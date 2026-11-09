#!/usr/bin/env python3
"""Build the complete, portable developer ZIP and verify its contents."""
from pathlib import Path
import hashlib
import zipfile

root = Path(__file__).resolve().parents[1]
name = 'team-developer-2026-11-09'
archive = root / (name + '.zip')
files = sorted(p for p in root.rglob('*') if p.is_file() and p.suffix != '.zip' and not p.name.endswith('.sha256') and '__pycache__' not in p.parts)
checksums = root / 'CHECKSUMS.sha256'
checksums.write_text(''.join(hashlib.sha256(p.read_bytes()).hexdigest() + '  ' + p.relative_to(root).as_posix() + '\n' for p in files))
files.append(checksums)
with zipfile.ZipFile(archive, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as output:
    for file in sorted(files):
        entry = zipfile.ZipInfo(name + '/' + file.relative_to(root).as_posix(), date_time=(2026, 11, 9, 0, 0, 0))
        entry.compress_type = zipfile.ZIP_DEFLATED
        entry.external_attr = 0o100644 << 16
        output.writestr(entry, file.read_bytes())
with zipfile.ZipFile(archive) as output:
    assert output.testzip() is None
    assert len(output.namelist()) == len(files)
    for file in files:
        assert output.read(name + '/' + file.relative_to(root).as_posix()) == file.read_bytes()
digest = hashlib.sha256(archive.read_bytes()).hexdigest()
archive.with_suffix('.zip.sha256').write_text(digest + '  ' + archive.name + '\n')
print(f'ZIP verified: {len(files)} files, {archive.stat().st_size:,} bytes, sha256 {digest}')
