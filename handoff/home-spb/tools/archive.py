#!/usr/bin/env python3
"""Overwrite the single current handoff ZIP; verify all runtime fingerprints."""
import hashlib, json, pathlib, zipfile
root=pathlib.Path(__file__).resolve().parent.parent
assert root.name=='home-spb'
sha=lambda data:hashlib.sha256(data).hexdigest()
source=json.loads((root/'SOURCE.json').read_text())
for item in source['manifest']:
    content=(root/item['file']).read_bytes()
    assert sha(content)==item['sha256'],f"Runtime changed after export: {item['file']}"
archive=root/'home-spb-developer.zip'
files=[]
for file in sorted(root.rglob('*')):
    if not file.is_file(): continue
    relative=file.relative_to(root)
    if file==archive or relative.as_posix()=='ARCHIVE.json': continue
    if '__pycache__' in relative.parts: continue
    if relative.parts[0]=='verification' and (file.suffix in {'.webp','.png','.jpg'} or 'extracted' in relative.parts): continue
    files.append((file,relative))
with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as output:
    for file,relative in files:
        info=zipfile.ZipInfo('home-spb/'+relative.as_posix(),date_time=(2026,11,10,0,0,0))
        info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o100644<<16
        output.writestr(info,file.read_bytes())
with zipfile.ZipFile(archive) as output:
    assert output.testzip() is None
    for file,relative in files:
        assert output.read('home-spb/'+relative.as_posix())==file.read_bytes()
report={'date':'2026-11-10','file':archive.name,'bytes':archive.stat().st_size,'sha256':sha(archive.read_bytes()),'entries':len(files),'runtimeFilesVerified':len(source['manifest']),'files':[{'file':relative.as_posix(),'bytes':file.stat().st_size,'sha256':sha(file.read_bytes())} for file,relative in files]}
(root/'ARCHIVE.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k!='files'}))
