#!/usr/bin/env python3
"""Replace the one current developer ZIP and verify its CRC and checksums."""
from pathlib import Path
import hashlib,json,zipfile
root=Path(__file__).resolve().parents[1]
target=root/'owner-sale-spb-developer.zip'
def sha(data):return hashlib.sha256(data).hexdigest()
files=[p for p in root.rglob('*') if p.is_file() and p!=target and p.name!='CHECKSUMS.json' and 'verification' not in p.relative_to(root).parts and not p.name.endswith('.tmp')]
checksums=[{'file':p.relative_to(root).as_posix(),'bytes':p.stat().st_size,'sha256':sha(p.read_bytes())} for p in sorted(files)]
(root/'CHECKSUMS.json').write_text(json.dumps(checksums,ensure_ascii=False,indent=2)+'\n')
files.append(root/'CHECKSUMS.json')
temporary=target.with_suffix('.zip.tmp')
with zipfile.ZipFile(temporary,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as archive:
 for p in sorted(files):archive.write(p,'owner-sale-spb/'+p.relative_to(root).as_posix())
temporary.replace(target)
with zipfile.ZipFile(target) as archive:
 assert archive.testzip() is None
 for item in checksums:assert sha(archive.read('owner-sale-spb/'+item['file']))==item['sha256'],item['file']
(root/'verification').mkdir(exist_ok=True)
(root/'verification/ZIP.json').write_text(json.dumps({'file':target.name,'bytes':target.stat().st_size,'files':len(files),'sha256':sha(target.read_bytes()),'crc':'pass','checksums':'pass'},indent=2)+'\n')
print(f'{target.name}: {len(files)} files, {target.stat().st_size} bytes, CRC/checksums passed')
