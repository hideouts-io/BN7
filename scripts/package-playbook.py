"""Package current public artifacts after verifying their build/export provenance.

Pass explicit canonical-root, render-root, and output paths. Existing archives are
reused only when byte-identical; a different candidate is never overwritten.
"""

from __future__ import annotations

import argparse
from hashlib import sha256
import json
from pathlib import Path
import re
from typing import TypeAlias, TypedDict, cast
from review_archive import archive_bytes, write_candidate


JsonValue: TypeAlias = None | bool | int | float | str | list["JsonValue"] | dict[str, "JsonValue"]
ArchiveMember: TypeAlias = tuple[str, bytes]


class WebSource(TypedDict):
    """Required interface to the web build's provenance sidecar."""

    source_hash: str
    html_hash: str
    stylesheet_hash: str


class PdfSource(TypedDict):
    """Required interface to the successful PDF export's provenance sidecar."""

    source_hash: str
    html_hash: str
    stylesheet_hash: str
    pdf_hash: str
    browser_version: str


def read_object(path: Path) -> dict[str, JsonValue]:
    """Read a sidecar object and reject incompatible top-level JSON."""
    value = cast(JsonValue, json.loads(path.read_text(encoding="utf-8")))
    if not isinstance(value, dict):
        raise TypeError(f"Expected a JSON object in {path}; found {type(value).__name__}")
    return value


def required_field(value: dict[str, JsonValue], field: str, path: Path) -> JsonValue:
    """Identify missing provenance fields with their exact sidecar path."""
    if field not in value:
        raise ValueError(f"Missing required field {field!r} in {path}; rebuild/export with the current scripts")
    return value[field]


def string_field(value: dict[str, JsonValue], field: str, path: Path) -> str:
    """Require a nonempty sidecar string, without inventing missing metadata."""
    item = required_field(value, field, path)
    if not isinstance(item, str) or not item:
        raise TypeError(f"Expected a nonempty string for {field} in {path}; found {item!r}")
    return item


def hash_field(value: dict[str, JsonValue], field: str, path: Path) -> str:
    """Require the exact lowercase SHA-256 representation emitted by the renderer."""
    item = string_field(value, field, path)
    if re.fullmatch(r"[a-f0-9]{64}", item) is None:
        raise ValueError(f"Invalid SHA-256 for {field} in {path}: {item!r}")
    return item


def web_source(path: Path) -> WebSource:
    """Validate required web metadata while ignoring unrelated extra fields."""
    record = read_object(path)
    expected = {"source": "PUBLIC_PLAYBOOK.md", "html": "index.html", "stylesheet": "assets/playbook.css", "generator": "scripts/build-playbook.mts"}
    for field, name in expected.items():
        if string_field(record, field, path) != name:
            raise ValueError(f"Unexpected {field} in {path}; expected {name!r}")
    sections = required_field(record, "sections", path)
    if not isinstance(sections, int) or isinstance(sections, bool) or sections < 1:
        raise ValueError(f"Invalid section count in {path}: {sections!r}")
    return {"source_hash": hash_field(record, "sha256", path), "html_hash": hash_field(record, "html_sha256", path), "stylesheet_hash": hash_field(record, "stylesheet_sha256", path)}


def pdf_source(path: Path) -> PdfSource:
    """Validate export provenance, including an explicitly identified browser."""
    record = read_object(path)
    expected = {"source": "PUBLIC_PLAYBOOK.md", "html": "index.html", "stylesheet": "assets/playbook.css", "pdf": "Bridge-Node-7-Public-Playbook-Short.pdf", "generator": "scripts/export-playbook.mts"}
    for field, name in expected.items():
        if string_field(record, field, path) != name:
            raise ValueError(f"Unexpected {field} in {path}; expected {name!r}")
    browser = required_field(record, "browser", path)
    if not isinstance(browser, dict):
        raise TypeError(f"Expected a browser object in {path}")
    executable = string_field(browser, "executable", path)
    if not Path(executable).is_absolute():
        raise ValueError(f"Browser executable in {path} must be an absolute path")
    version = string_field(browser, "version", path)
    if re.fullmatch(r"\d+(?:\.\d+){1,3}", version) is None:
        raise ValueError(f"Invalid Chromium version in {path}: {version!r}")
    return {"source_hash": hash_field(record, "sha256", path), "html_hash": hash_field(record, "html_sha256", path), "stylesheet_hash": hash_field(record, "stylesheet_sha256", path), "pdf_hash": hash_field(record, "pdf_sha256", path), "browser_version": version}


def validate_hash(data: bytes, expected: str, label: str) -> None:
    """Reject stale bytes with the exact expected and observed identities."""
    actual = sha256(data).hexdigest()
    if actual != expected:
        raise ValueError(f"Stale or mismatched {label}: expected SHA-256 {expected}, observed {actual}; rebuild/export from the canonical manuscript before packaging")


def public_manifest(members: list[ArchiveMember], source_hash: str, browser_version: str) -> bytes:
    """Describe only the public archive members; omit private paths and sidecars."""
    files: list[JsonValue] = [{"file": name, "bytes": len(data), "sha256": sha256(data).hexdigest()} for name, data in members]
    record: dict[str, JsonValue] = {
        "title": "Bridge Node 7 short public playbook",
        "status": "Editorial review draft",
        "source_manuscript": "PUBLIC_PLAYBOOK.md",
        "source_sha256": source_hash,
        "pdf_renderer": {"engine": "Chromium", "version": browser_version},
        "files": files,
    }
    return (json.dumps(record, indent=2, sort_keys=True) + "\n").encode("utf-8")


def verified_members(canonical_root: Path, render_root: Path) -> list[ArchiveMember]:
    """Bind current manuscript, stylesheet, HTML, and PDF to both sidecars."""
    source = (canonical_root / "PUBLIC_PLAYBOOK.md").read_bytes()
    render_source = (render_root / "PUBLIC_PLAYBOOK.md").read_bytes()
    stylesheet = (canonical_root / "assets/playbook.css").read_bytes()
    render_stylesheet = (render_root / "assets/playbook.css").read_bytes()
    html = (render_root / "output/web/index.html").read_bytes()
    pdf = (render_root / "output/pdf/Bridge-Node-7-Public-Playbook-Short.pdf").read_bytes()
    web = web_source(render_root / "output/web/source.json")
    exported = pdf_source(render_root / "output/pdf/source.json")
    validate_hash(source, web["source_hash"], "canonical manuscript against web sidecar")
    validate_hash(render_source, web["source_hash"], "render manuscript against web sidecar")
    validate_hash(stylesheet, web["stylesheet_hash"], "canonical stylesheet against web sidecar")
    validate_hash(render_stylesheet, web["stylesheet_hash"], "render stylesheet against web sidecar")
    validate_hash(html, web["html_hash"], "HTML against web sidecar")
    validate_hash(source, exported["source_hash"], "canonical manuscript against PDF sidecar")
    validate_hash(stylesheet, exported["stylesheet_hash"], "stylesheet against PDF sidecar")
    validate_hash(html, exported["html_hash"], "HTML against PDF sidecar")
    validate_hash(pdf, exported["pdf_hash"], "PDF against PDF sidecar")
    members: list[ArchiveMember] = [("PUBLIC_PLAYBOOK.md", source), ("index.html", html), ("Bridge-Node-7-Public-Playbook-Short.pdf", pdf)]
    return [*members, ("manifest.json", public_manifest(members, web["source_hash"], exported["browser_version"]))]


def main() -> None:
    """Package explicitly selected roots only after every required integrity check."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--canonical-root", type=Path, required=True)
    parser.add_argument("--render-root", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    arguments = parser.parse_args()
    canonical_root: Path = arguments.canonical_root.resolve(strict=True)
    render_root: Path = arguments.render_root.resolve(strict=True)
    output: Path = arguments.output.resolve(strict=False)
    if output.suffix != ".zip":
        raise ValueError(f"Output must have a .zip suffix: {output}")
    members = verified_members(canonical_root, render_root)
    data = archive_bytes(members)
    reused = write_candidate(output, data)
    print(json.dumps({"output": str(output), "bytes": len(data), "sha256": sha256(data).hexdigest(), "members": [name for name, _ in members], "reused_identical_candidate": reused}, sort_keys=True))


if __name__ == "__main__":
    main()
