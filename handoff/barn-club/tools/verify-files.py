"""Check ready package links, file hashes, ZIP payload and source parity."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import hashlib,json,re,zipfile

OUT=Path(__file__).resolve().parents[1]
class Links(HTMLParser):
    def __init__(self):super().__init__();self.links=[];self.ids=set()
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.add(a['id'])
        for key in ['src','href']:
            if a.get(key):self.links.append(a[key])
full=Links();full.feed((OUT/'html/index.html').read_text());count=0
for file in (OUT/'html').glob('*.html'):
    parser=Links();parser.feed(file.read_text())
    for link in parser.links:
        u=urlsplit(link)
        if u.scheme or u.netloc:continue
        if not u.path:
            if u.fragment:assert unquote(u.fragment) in full.ids,(file.name,link)
            continue
        target=(file.parent/unquote(u.path)).resolve();assert OUT in target.parents and target.is_file(),(file.name,link)
        count+=1
for file in (OUT/'css').glob('*.css'):
    for link in re.findall(r'url\([\'\"]?([^\'\")]+)',file.read_text()):
        assert (file.parent/link).resolve().is_file(),(file.name,link);count+=1
for line in (OUT/'CHECKSUMS.sha256').read_text().splitlines():
    sha,name=line.split('  ',1);assert hashlib.sha256((OUT/name).read_bytes()).hexdigest()==sha,name
archive=OUT/'barn-club.zip';expected_hash=(OUT/'barn-club.zip.sha256').read_text().split()[0];assert hashlib.sha256(archive.read_bytes()).hexdigest()==expected_hash
with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None
    assert len(z.namelist())==len(set(z.namelist()))
    for name in z.namelist():
        rel=Path(name).relative_to('barn-club');assert '..' not in rel.parts
        assert z.read(name)==(OUT/rel).read_bytes(),name
    zip_files=len(z.namelist())
source=json.loads((OUT/'SOURCE.json').read_text());assets={p.name for p in (OUT/'assets').iterdir()}
assert len(assets)==12
for name in ['hero.webp','lounge.webp','about-mansion.webp','about-mansion-v2.webp']:assert name not in assets
for item in source['source_files']:
    name=item['path'];p=OUT/('html/index.html' if name=='index.html' else name)
    data=p.read_bytes()
    if name=='index.html':data=re.sub(r'(?<=["\'])\.\./((?:assets|css|js)/)',r'\1',data.decode()).encode()
    assert hashlib.sha256(data).hexdigest()==item['sha256'],name
report={'date':'2026-11-10','local_links_checked':count,'source_files':len(source['source_files']),'assets':len(assets),'zip_files':zip_files,'zip_bytes':archive.stat().st_size,'zip_sha256':expected_hash,'errors':[]}
(OUT/'verification').mkdir(exist_ok=True);(OUT/'verification/files.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
