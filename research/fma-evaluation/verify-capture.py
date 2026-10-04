"""Verify retained successful FMA outputs after correcting a wrapper identifier typo."""

from __future__ import annotations

from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
from typing import TypeAlias, cast


JsonValue: TypeAlias = None | bool | int | float | str | list["JsonValue"] | dict[str, "JsonValue"]
EVIDENCE = Path("/Users/macbookpro/Documents/ChatGPT/BN7/research/fma-evaluation")
SOURCE = Path("/Users/macbookpro/Codex/Any/BN7-sources/frontier-mission-assurance")
WORK = Path(__file__).resolve().parent


def read_object(path: Path) -> dict[str, JsonValue]:
    value = cast(JsonValue, json.loads(path.read_text(encoding="utf-8")))
    if not isinstance(value, dict):
        raise TypeError(f"Expected JSON object at {path}")
    return value


def object_field(value: dict[str, JsonValue], field: str) -> dict[str, JsonValue]:
    item = value[field]
    if not isinstance(item, dict):
        raise TypeError(f"Expected object in field {field}, found {type(item).__name__}")
    return item


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> int:
    initial = read_object(EVIDENCE / "evaluation.json")
    initial_checks = object_field(initial, "checks")
    if initial_checks["baseline_declared_applicability_hold"] is not False:
        raise ValueError("The preserved initial wrapper result must expose the known identifier typo")
    expected_reasons = ["ENV-RESOURCE-001 applicability is declared but not established", "ENV-LOSS-001 applicability is declared but not established"]
    checks: dict[str, JsonValue] = dict(initial_checks) | {
        "baseline_declared_applicability_hold": initial["baseline_hold_reasons"] == expected_reasons,
    }
    for name in ["baseline-validation", "changed-assumption-comparison"]:
        command = read_object(EVIDENCE / f"{name}.command.json")
        stdout = command["stdout_path"]
        stderr = command["stderr_path"]
        if not isinstance(stdout, str) or not isinstance(stderr, str):
            raise TypeError(f"Missing stream paths in {name} command record")
        checks[f"{name}_stdout_hash_matches"] = sha256(Path(stdout)) == command["stdout_sha256"]
        checks[f"{name}_stderr_hash_matches"] = sha256(Path(stderr)) == command["stderr_sha256"]
        checks[f"{name}_exit_zero"] = command["exit_code"] == 0
    envelope_document = read_object(SOURCE / "profiles/ftqc-assurance/examples/synthetic-neutral-atom/baseline/evidence-envelopes.json")
    envelopes = envelope_document["envelopes"]
    if not isinstance(envelopes, list):
        raise TypeError("Baseline evidence-envelopes.json must contain an envelopes array")
    declared_gate_ids: list[str] = []
    for envelope in envelopes:
        if not isinstance(envelope, dict):
            raise TypeError("Baseline envelope entries must be objects")
        review = object_field(envelope, "review")
        identifier = envelope["envelope_id"]
        if not isinstance(identifier, str):
            raise TypeError("Envelope identifier must be a string")
        if review["decision_gate"] is True and review["authority_state"] == "DECLARED":
            declared_gate_ids.append(identifier)
    checks["baseline_source_declares_two_gate_ids"] = declared_gate_ids == ["ENV-RESOURCE-001", "ENV-LOSS-001"]
    verification: dict[str, JsonValue] = {
        "verified_at_utc": datetime.now(timezone.utc).isoformat(),
        "runtime_commands_reexecuted": False,
        "source_head": initial["source_head"],
        "initial_wrapper_result": "evaluation.json",
        "correction": "The wrapper's ENVELOPE-RESOURCE-001 string was a recording-script identifier typo. Source and runtime use ENV-RESOURCE-001, and baseline also exposes ENV-LOSS-001. FMA commands and outputs were not changed or rerun.",
        "checks": checks,
        "all_checks_pass": all(value is True for value in checks.values()),
        "baseline_declared_gate_ids": declared_gate_ids,
        "preserved_initial_script_sha256": sha256(EVIDENCE / "run.py"),
        "preserved_initial_evaluation_sha256": sha256(EVIDENCE / "evaluation.json"),
        "orchestrator_stdout_sha256": sha256(WORK / "orchestrator.stdout.txt"),
        "orchestrator_stderr_sha256": sha256(WORK / "orchestrator.stderr.txt"),
        "orchestrator_exit_code": 1,
    }
    (EVIDENCE / "verify-capture.py").write_bytes(Path(__file__).read_bytes())
    (EVIDENCE / "orchestrator.stdout.txt").write_bytes((WORK / "orchestrator.stdout.txt").read_bytes())
    (EVIDENCE / "orchestrator.stderr.txt").write_bytes((WORK / "orchestrator.stderr.txt").read_bytes())
    (EVIDENCE / "verification.json").write_text(json.dumps(verification, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(verification, indent=2))
    if verification["all_checks_pass"] is not True:
        raise AssertionError(f"Retained FMA output verification failed: {checks}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
