#!/usr/bin/env python3
"""Verify the packaged site with Python's standard library."""
import hashlib,json,pathlib,sys
root=pathlib.Path(__file__).resolve().parents[1]
manifest=json.loads((root/'manifest.json').read_text())
expected={item['path']:item for item in manifest['files']}
actual={str(p.relative_to(root)).replace('\\','/') for p in (root/'site').rglob('*') if p.is_file()}
errors=[]
if actual!=set(expected):errors.append({'missing':sorted(set(expected)-actual),'unexpected':sorted(actual-set(expected))})
for name,item in expected.items():
 p=root/name
 if not p.is_file():continue
 data=p.read_bytes()
 if len(data)!=item['bytes'] or hashlib.sha256(data).hexdigest()!=item['sha256']:errors.append(name)
if errors:
 print(json.dumps({'passed':False,'errors':errors},ensure_ascii=False,indent=2));sys.exit(1)
print(json.dumps({'passed':True,'files':len(actual),'sourceCommit':manifest['sourceCommit']},ensure_ascii=False))
