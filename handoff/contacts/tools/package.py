#!/usr/bin/env python3
"""Create one current developer ZIP with SHA-256 checksums."""
from pathlib import Path
import hashlib, zipfile
root = Path(__file__).resolve().parents[1]
files = sorted(p for p in root.rglob('*') if p.is_file() and not p.name.endswith(('.zip', '.zip.sha256')) and p.name != 'CHECKSUMS.sha256' and '__pycache__' not in p.parts)
(root / 'CHECKSUMS.sha256').write_text(''.join(hashlib.sha256(p.read_bytes()).hexdigest() + '  ' + p.relative_to(root).as_posix() + '\n' for p in files))
archive = root / 'contacts-developer.zip'
with zipfile.ZipFile(archive, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as out:
    for p in sorted(files + [root / 'CHECKSUMS.sha256']):
        out.write(p, p.relative_to(root).as_posix())
(root / 'contacts-developer.zip.sha256').write_text(hashlib.sha256(archive.read_bytes()).hexdigest() + '  ' + archive.name + '\n')
print(f'Packaged {len(files) + 1} files; {archive.stat().st_size} bytes')
