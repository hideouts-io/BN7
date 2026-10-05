"""Create immutable, deterministic review archives shared by both playbook editions."""

from io import BytesIO
from pathlib import Path
from typing import TypeAlias
from zipfile import ZIP_STORED, ZipFile, ZipInfo

ArchiveMember: TypeAlias = tuple[str, bytes]


def archive_bytes(members: list[ArchiveMember]) -> bytes:
    """Create deterministic stdlib ZIP bytes without timestamps or compression drift."""
    buffer = BytesIO()
    with ZipFile(buffer, mode="w", compression=ZIP_STORED) as archive:
        for name, data in members:
            info = ZipInfo(filename=name, date_time=(1980, 1, 1, 0, 0, 0))
            info.create_system = 3
            info.external_attr = 0o100644 << 16
            archive.writestr(info, data)
    return buffer.getvalue()


def write_candidate(output: Path, data: bytes) -> bool:
    """Reuse identical bytes or create a new candidate without replacing old work."""
    if output.exists():
        if output.read_bytes() != data:
            raise FileExistsError(f"Existing candidate {output} has different bytes; choose an unused output path to preserve it")
        return True
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open("xb") as stream:
        stream.write(data)
    return False
