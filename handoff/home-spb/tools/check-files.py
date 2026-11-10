#!/usr/bin/env python3
"""Check direct HTML/CSS dependencies and exported runtime fingerprints."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json,re,hashlib
root=Path(__file__).resolve().parent.parent
references=[];missing=[];external=[]
def check(value,owner):
    url=urlsplit(value)
    if not value or value.startswith('#') or url.scheme in {'data','blob','mailto','tel','javascript'}:return
    if url.scheme or url.netloc:
        external.append({'owner':str(owner.relative_to(root)),'url':value});return
    target=(owner.parent/unquote(url.path)).resolve()
    if not target.is_relative_to(root) or not target.exists():missing.append({'owner':str(owner.relative_to(root)),'path':value})
    references.append({'owner':str(owner.relative_to(root)),'path':value})
class HTML(HTMLParser):
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        for key in ['src','poster']:
            if key in attrs:check(attrs[key],self.owner)
        if tag in {'link','use'} and 'href' in attrs:check(attrs['href'],self.owner)
        for value in attrs.get('srcset','').split(','):
            if value.strip():check(value.strip().split()[0],self.owner)
for file in [root/'html/index.html',root/'index.html']:
    parser=HTML();parser.owner=file;parser.feed(file.read_text())
for file in (root/'css').rglob('*.css'):
    text=file.read_text()
    for match in re.finditer(r'url\(\s*(?:(["\x27])(.*?)\1|([^)]*))\s*\)',text):check((match[2] or match[3] or '').strip(),file)
    for match in re.finditer(r'@import\s+["\x27]([^"\x27]+)',text):check(match[1],file)
manifest=json.loads((root/'SOURCE.json').read_text())['manifest']
for item in manifest:assert hashlib.sha256((root/item['file']).read_bytes()).hexdigest()==item['sha256'],item['file']
report={'date':'2026-11-10','htmlAndCSSReferences':len(references),'runtimeChecksumsVerified':len(manifest),'missing':missing,'externalResourceAttributes':external}
(root/'verification').mkdir(exist_ok=True)
(root/'verification/files.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False));assert not missing and not external
