"""Bind expanded review artifacts to canonical inputs and create an immutable ZIP.

Pass explicit --canonical-root, --candidate-root and --output paths. The manifest
is public metadata; it contains no local executable paths or private review data.
"""

from __future__ import annotations

import argparse
from hashlib import sha256
import json
from pathlib import Path
import re
from typing import TypeAlias, cast
from review_archive import ArchiveMember, archive_bytes, write_candidate

JsonValue: TypeAlias = None | bool | int | float | str | list["JsonValue"] | dict[str, "JsonValue"]


def checked_files(value: JsonValue, root: Path, expected: set[str]) -> list[ArchiveMember]:
    """Validate required identity fields and exact bytes against a closed file set."""
    if not isinstance(value, list):
        raise TypeError(f"Manifest identities must be an array; found {type(value).__name__}")
    members: list[ArchiveMember] = []
    for entry in value:
        if not isinstance(entry, dict):
            raise TypeError(f"Manifest identity must be an object; found {entry!r}")
        name = entry.get("name")
        size = entry.get("bytes")
        digest = entry.get("sha256")
        if not isinstance(name, str) or name not in expected:
            raise ValueError(f"Unexpected or missing file name in manifest: {name!r}")
        if type(size) is not int or size < 1:
            raise TypeError(f"Invalid byte count for {name}: {size!r}")
        if not isinstance(digest, str) or re.fullmatch(r"[a-f0-9]{64}", digest) is None:
            raise ValueError(f"Invalid SHA-256 for {name}: {digest!r}")
        data = (root / name).read_bytes()
        if len(data) != size or sha256(data).hexdigest() != digest:
            raise ValueError(f"Stale or changed {root / name}; bytes do not match manifest")
        members.append((name, data))
    names = [name for name, _ in members]
    if len(names) != len(expected) or set(names) != expected:
        raise ValueError(f"Missing or duplicate files: expected {sorted(expected)}, found {names}")
    return members


def verified_members(canonical_root: Path, candidate_root: Path) -> list[ArchiveMember]:
    """Require current canonical inputs and matching source, HTML, PDF and manifest."""
    manifest_bytes = (candidate_root / "manifest.json").read_bytes()
    manifest = cast(JsonValue, json.loads(manifest_bytes))
    if not isinstance(manifest, dict):
        raise TypeError("Expanded manifest must be an object")
    if manifest.get("source_name") != "PUBLIC_PLAYBOOK_EXTENDED.md":
        raise ValueError("Expanded manifest must identify PUBLIC_PLAYBOOK_EXTENDED.md")
    expected_metadata = {
        "title": "Bridge Node 7: public playbook — expanded review edition",
        "status": "Editorial review draft; company, qualified technical, audience and accessibility review pending",
        "edition": "Expanded ten-chapter candidate; preserved short edition remains separate",
        "source_review_date": "2026-10-05",
    }
    for key, expected in expected_metadata.items():
        if manifest.get(key) != expected:
            raise ValueError(f"Expanded manifest {key} must be {expected!r}; found {manifest.get(key)!r}")
    engine = manifest.get("pdf_engine")
    if not isinstance(engine, dict) or engine.get("name") != "Chromium" or not isinstance(engine.get("version"), str) or not engine.get("version"):
        raise ValueError(f"Expanded manifest requires a recorded Chromium version; found {engine!r}")
    members = checked_files(manifest.get("files"), candidate_root,
                            {"PUBLIC_PLAYBOOK_EXTENDED.md", "index.html", "Bridge-Node-7-Public-Playbook-Expanded.pdf"})
    inputs = checked_files(manifest.get("inputs"), canonical_root,
                           {"PUBLIC_PLAYBOOK_EXTENDED.md", "assets/playbook.css", "assets/extended-playbook.css",
                            "scripts/playbook-page.mts", "scripts/prepare-expanded-playbook.mts", "package.json", "package-lock.json"})
    source = next(data for name, data in members if name == "PUBLIC_PLAYBOOK_EXTENDED.md")
    canonical_source = next(data for name, data in inputs if name == "PUBLIC_PLAYBOOK_EXTENDED.md")
    if source != canonical_source or manifest.get("source_sha256") != sha256(source).hexdigest():
        raise ValueError("Candidate manuscript differs from canonical expanded manuscript")
    pdf = next(data for name, data in members if name.endswith(".pdf"))
    if manifest.get("revision") != f"{sha256(source).hexdigest()[:12]}-{sha256(pdf).hexdigest()[:12]}":
        raise ValueError("Expanded revision ID does not match manuscript and PDF identities")
    return [*members, ("manifest.json", manifest_bytes)]


def main() -> None:
    """Package one explicitly selected expanded candidate without overwriting work."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--canonical-root", type=Path, required=True)
    parser.add_argument("--candidate-root", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    arguments = parser.parse_args()
    canonical_root: Path = arguments.canonical_root.resolve(strict=True)
    candidate_root: Path = arguments.candidate_root.resolve(strict=True)
    output: Path = arguments.output.resolve(strict=False)
    if output.suffix != ".zip":
        raise ValueError(f"Output must have .zip suffix: {output}")
    members = verified_members(canonical_root, candidate_root)
    data = archive_bytes(members)
    reused = write_candidate(output, data)
    print(json.dumps({"output": str(output), "sha256": sha256(data).hexdigest(),
                      "bytes": len(data), "members": [name for name, _ in members],
                      "reused_identical_candidate": reused}, sort_keys=True))


if __name__ == "__main__":
    main()
