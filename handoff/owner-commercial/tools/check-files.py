#!/usr/bin/env python3
"""Check full-page HTML/CSS resource paths and exported runtime hashes."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import hashlib,json,re
root=Path(__file__).resolve().parents[1]
checked=[]
def check(value,owner):
 if not value or value.startswith(('#','data:','blob:','mailto:','tel:','javascript:')):return
 p=urlsplit(value)
 assert not p.scheme and not p.netloc,f'External runtime resource: {value}'
 assert not p.path.startswith('/'),f'Root resource path: {value}'
 target=(owner.parent/unquote(p.path)).resolve()
 assert target.is_relative_to(root) and target.is_file(),(owner.relative_to(root),value)
 checked.append(value)
class Resources(HTMLParser):
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  for key in ['src','data-expert-image']:
   if key in a:check(a[key],root/'html/index.html')
  if tag=='link' and any(x in a.get('rel','') for x in ['stylesheet','icon','preload']):check(a.get('href'),root/'html/index.html')
  for item in a.get('srcset','').split(','):
   if item.strip():check(item.strip().split()[0],root/'html/index.html')
Resources().feed((root/'html/index.html').read_text())
for css in (root/'css').glob('*.css'):
 for m in re.finditer(r'url\(\s*(?:([\"\'])(.*?)\1|([^)]*))\s*\)',css.read_text()):check((m[2] if m[2] is not None else m[3]).strip(),css)
source=json.loads((root/'SOURCE.json').read_text())
for item in source['outputs']:
 p=root/item['file'];assert hashlib.sha256(p.read_bytes()).hexdigest()==item['sha256'],item['file']
print(f'{len(checked)} local resource references and {len(source["outputs"])} runtime hashes passed')
