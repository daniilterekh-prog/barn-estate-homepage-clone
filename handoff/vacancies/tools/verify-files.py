#!/usr/bin/env python3
"""Verify handoff hashes, local dependencies, asset closure and optional ZIP."""
from pathlib import Path
from urllib.parse import urlsplit, unquote
import argparse, hashlib, json, re, zipfile
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--root',type=Path,default=Path(__file__).resolve().parents[1])
parser.add_argument('--archive',type=Path)
a=parser.parse_args();root=a.root.resolve()
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
manifest=json.loads((root/'SOURCE.json').read_text())
for name,digest in manifest['runtime_sha256'].items():
 p=(root/name).resolve();assert root in p.parents and p.is_file(),name;assert sha(p)==digest,name
seen=set();queue=[root/'html/index.html']
while queue:
 p=queue.pop().resolve()
 if p in seen:continue
 seen.add(p);text=p.read_text() if p.suffix in {'.html','.css'} else ''
 refs=[]
 if p.suffix=='.html':
  refs+=re.findall(r'(?:src|href)="([^\"]+)"',text)
  for value in re.findall(r'srcset="([^\"]+)"',text):refs += [x.strip().split()[0] for x in value.split(',')]
 elif p.suffix=='.css':refs+=re.findall(r'url\([\"\']?([^\)\"\']+)',text)
 for value in refs:
  parts=urlsplit(value)
  if parts.scheme or parts.netloc or not parts.path:continue
  target=(p.parent/unquote(parts.path)).resolve();assert root in target.parents and target.is_file(),(str(p),value)
  if target not in seen:queue.append(target)
assets={p.resolve() for p in (root/'assets').iterdir() if p.is_file()};assert assets<=seen,sorted(str(p) for p in assets-seen)
archive_entries=None
if a.archive:
 with zipfile.ZipFile(a.archive) as z:
  assert z.testzip() is None
  for i in z.infolist():assert not Path(i.filename).is_absolute() and '..' not in Path(i.filename).parts
  for name,digest in manifest['runtime_sha256'].items():assert hashlib.sha256(z.read('vacancies/'+name)).hexdigest()==digest,name
  archive_entries=len(z.infolist())
print(json.dumps({'passed':True,'manifest_files':len(manifest['runtime_sha256']),'referenced_assets':len(assets),'reachable_files':len(seen),'zip_entries':archive_entries}))
