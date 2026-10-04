"""Capture a bounded, stdout-only FMA synthetic fixture evaluation."""

from __future__ import annotations

from dataclasses import asdict, dataclass
from datetime import datetime, timezone
import hashlib
import json
import os
from pathlib import Path
import platform
import shlex
import subprocess
import sys
from typing import TypeAlias, cast


JsonValue: TypeAlias = None | bool | int | float | str | list["JsonValue"] | dict[str, "JsonValue"]

SOURCE = Path("/Users/macbookpro/Codex/Any/BN7-sources/frontier-mission-assurance")
EXPECTED_HEAD = "f99dd2174c74f26b648321e02f8d30e2cff10230"
WORK = Path(__file__).resolve().parent
EVIDENCE = Path("/Users/macbookpro/Documents/ChatGPT/BN7/research/fma-evaluation")
BASE_PYTHON = Path("/opt/homebrew/bin/python3.11")
BASELINE = SOURCE / "profiles/ftqc-assurance/examples/synthetic-neutral-atom/baseline"
CURRENT = SOURCE / "profiles/ftqc-assurance/examples/synthetic-neutral-atom/changed-assumption-case"
EXPECTED = SOURCE / "profiles/ftqc-assurance/examples/synthetic-neutral-atom/changed-assumption/expected-impact.json"


@dataclass(frozen=True)
class CommandRecord:
    name: str
    argv: list[str]
    cwd: str
    environment_overrides: dict[str, str]
    shell_display: str
    started_at_utc: str
    finished_at_utc: str
    exit_code: int
    stdout_path: str
    stderr_path: str
    stdout_sha256: str
    stderr_sha256: str


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def read_json_object(path: Path) -> dict[str, JsonValue]:
    parsed = cast(JsonValue, json.loads(path.read_text(encoding="utf-8")))
    if not isinstance(parsed, dict):
        raise TypeError(f"Expected JSON object at {path}, found {type(parsed).__name__}")
    return parsed


def object_field(value: dict[str, JsonValue], field: str) -> dict[str, JsonValue]:
    item = value[field]
    if not isinstance(item, dict):
        raise TypeError(f"Expected object field {field}, found {type(item).__name__}")
    return item


def run_command(name: str, argv: list[str], cwd: Path, overrides: dict[str, str], timeout: int) -> CommandRecord:
    started = utc_now()
    environment = dict(os.environ) | overrides
    completed = subprocess.run(argv, cwd=cwd, env=environment, capture_output=True, check=False, timeout=timeout)
    stdout = EVIDENCE / f"{name}.stdout.txt"
    stderr = EVIDENCE / f"{name}.stderr.txt"
    stdout.write_bytes(completed.stdout)
    stderr.write_bytes(completed.stderr)
    prefix = [f"{key}={value}" for key, value in sorted(overrides.items())]
    record = CommandRecord(name, argv, str(cwd), overrides, shlex.join(["env", *prefix, *argv]), started, utc_now(), completed.returncode, str(stdout), str(stderr), digest(completed.stdout), digest(completed.stderr))
    (EVIDENCE / f"{name}.command.json").write_text(json.dumps(asdict(record), indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"step": name, "exit_code": record.exit_code, "stdout": str(stdout), "stderr": str(stderr)}), flush=True)
    if completed.returncode != 0:
        raise subprocess.CalledProcessError(completed.returncode, argv, completed.stdout, completed.stderr)
    return record


def git_output(arguments: list[str]) -> bytes:
    completed = subprocess.run(["git", "-C", str(SOURCE), *arguments], capture_output=True, check=True)
    return completed.stdout


def source_snapshot() -> dict[str, JsonValue]:
    files = git_output(["ls-files", "-z"]).decode("utf-8").rstrip("\x00").split("\x00")
    hashes: dict[str, JsonValue] = {name: digest((SOURCE / name).read_bytes()) for name in files}
    return {
        "repo_url": git_output(["remote", "get-url", "origin"]).decode().strip(),
        "clone_path": str(SOURCE),
        "head": git_output(["rev-parse", "HEAD"]).decode().strip(),
        "branch": git_output(["branch", "--show-current"]).decode().strip(),
        "status_porcelain": git_output(["status", "--porcelain=v1", "--untracked-files=all"]).decode(),
        "tracked_file_count": len(files),
        "tracked_file_sha256": hashes,
        "version": (SOURCE / "VERSION").read_text(encoding="utf-8").strip(),
        "captured_at_utc": utc_now(),
    }


def main() -> int:
    EVIDENCE.mkdir(parents=True, exist_ok=False)
    before = source_snapshot()
    (EVIDENCE / "source-before.json").write_text(json.dumps(before, indent=2) + "\n", encoding="utf-8")
    if before["head"] != EXPECTED_HEAD:
        raise ValueError(f"Source HEAD {before['head']} differs from pinned {EXPECTED_HEAD}")
    if before["status_porcelain"] != "":
        raise ValueError(f"Source is not clean: {before['status_porcelain']}")

    pins = ["PyYAML==6.0.3", "jsonschema==4.26.0"]
    declared = (SOURCE / "requirements-dev.txt").read_text(encoding="utf-8").splitlines()
    for pin in pins:
        if pin not in declared:
            raise ValueError(f"Required evaluation pin {pin} missing from source requirements-dev.txt")
    requirements = WORK / "requirements-ftqc-evaluation.txt"
    requirements.write_text("\n".join(pins) + "\n", encoding="utf-8")
    (EVIDENCE / requirements.name).write_bytes(requirements.read_bytes())
    (EVIDENCE / "expected-impact.json").write_bytes(EXPECTED.read_bytes())
    (EVIDENCE / "run.py").write_bytes(Path(__file__).read_bytes())

    runtime_environment = {"PYTHONDONTWRITEBYTECODE": "1", "PYTHONPATH": str(SOURCE / "src")}
    setup_environment = {"PYTHONDONTWRITEBYTECODE": "1", "PIP_CONFIG_FILE": "/dev/null", "PIP_DISABLE_PIP_VERSION_CHECK": "1"}
    venv = WORK / ".venv"
    run_command("create-venv", [str(BASE_PYTHON), "-m", "venv", str(venv)], WORK, {"PYTHONDONTWRITEBYTECODE": "1"}, 60)
    python = venv / "bin/python"
    run_command("install-dependencies", [str(python), "-m", "pip", "install", "--no-input", "--no-cache-dir", "--index-url", "https://pypi.org/simple", "--retries", "3", "--timeout", "30", "--report", str(EVIDENCE / "installation-report.json"), "-r", str(requirements)], WORK, setup_environment, 240)
    run_command("pip-check", [str(python), "-m", "pip", "check"], WORK, setup_environment, 30)
    run_command("pip-freeze", [str(python), "-m", "pip", "freeze", "--all"], WORK, setup_environment, 30)
    interpreter_code = "import json,platform,sys; print(json.dumps({'version':sys.version,'executable':sys.executable,'base_prefix':sys.base_prefix,'prefix':sys.prefix,'platform':platform.platform(),'machine':platform.machine()},sort_keys=True,indent=2))"
    run_command("interpreter", [str(python), "-c", interpreter_code], WORK, {"PYTHONDONTWRITEBYTECODE": "1"}, 30)
    baseline_command = run_command("baseline-validation", [str(python), str(SOURCE / "scripts/validate_ftqc_case.py"), str(BASELINE), "--root", str(SOURCE), "--json"], SOURCE, runtime_environment, 60)
    comparison_command = run_command("changed-assumption-comparison", [str(python), str(SOURCE / "scripts/compare_ftqc_cases.py"), str(BASELINE), str(CURRENT), "--root", str(SOURCE), "--json"], SOURCE, runtime_environment, 60)

    baseline_payload = read_json_object(Path(baseline_command.stdout_path))
    comparison_payload = read_json_object(Path(comparison_command.stdout_path))
    expected = read_json_object(EVIDENCE / "expected-impact.json")
    summary = object_field(baseline_payload, "summary")
    decision = object_field(summary, "decision")
    result = object_field(comparison_payload, "result")
    current = object_field(result, "current_case")
    current_decision = object_field(current, "decision")
    checks: dict[str, JsonValue] = {
        "baseline_status_pass": baseline_payload["status"] == "PASS",
        "baseline_record_class_synthetic": summary["record_class"] == "synthetic",
        "baseline_disposition_hold": decision["disposition"] == "HOLD",
        "baseline_declared_applicability_hold": "ENVELOPE-RESOURCE-001 applicability is declared but not established" in cast(list[str], summary["hold_reasons"]),
        "comparison_status_pass": comparison_payload["status"] == "PASS",
        "comparison_record_class_synthetic": result["record_class"] == "synthetic",
        "current_disposition_remains_hold": current_decision["disposition"] == "HOLD",
        "context_change_architecture_revision": result["context_changes"] == ["architecture_revision"],
    }
    for field, expectation in expected.items():
        checks[f"expected_{field}"] = result[field] == expectation
    after = source_snapshot()
    (EVIDENCE / "source-after.json").write_text(json.dumps(after, indent=2) + "\n", encoding="utf-8")
    checks["source_head_unchanged"] = after["head"] == before["head"]
    checks["source_tracked_bytes_unchanged"] = after["tracked_file_sha256"] == before["tracked_file_sha256"]
    checks["source_clean_after"] = after["status_porcelain"] == ""
    report: dict[str, JsonValue] = {
        "scope": "Two stdout-only synthetic FTQC commands: baseline validation and baseline versus changed-assumption comparison; no whole suite, receipt-code reproduction, editable package install, or upstream modifications.",
        "completed_at_utc": utc_now(),
        "working_directory": str(WORK),
        "source_head": EXPECTED_HEAD,
        "source_version": before["version"],
        "base_interpreter": str(BASE_PYTHON),
        "base_interpreter_resolved_path": str(BASE_PYTHON.resolve()),
        "base_interpreter_sha256": digest(BASE_PYTHON.resolve().read_bytes()),
        "requirements_selection": "Only the two repository-pinned imports needed by the FTQC scripts; pytest, ruff, build, setuptools and wheel were not installed as source build requirements.",
        "requirements_sha256": digest(requirements.read_bytes()),
        "expected_fixture_source_path": str(EXPECTED),
        "expected_fixture_sha256": digest(EXPECTED.read_bytes()),
        "checks": checks,
        "all_checks_pass": all(value is True for value in checks.values()),
        "baseline_hold_reasons": summary["hold_reasons"],
        "baseline_warnings": baseline_payload["warnings"],
        "comparison_warnings": comparison_payload["warnings"],
        "current_hold_reasons": current["hold_reasons"],
        "governance_review_required": result["governance_review_required"],
        "resource_estimate_current_fixture_review_state": object_field(current, "resource_estimate")["review_state"],
        "resource_estimates_computed_stale": result["resource_estimates_stale"],
        "decision_changes": result["decision_changes"],
        "boundary_note": result["boundary_note"],
    }
    (EVIDENCE / "evaluation.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"all_checks_pass": report["all_checks_pass"], "checks": checks}, indent=2), flush=True)
    if report["all_checks_pass"] is not True:
        raise AssertionError(f"Evaluation expectation comparison failed: {checks}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
