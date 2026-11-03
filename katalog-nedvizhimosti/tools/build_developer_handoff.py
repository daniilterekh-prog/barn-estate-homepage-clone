#!/usr/bin/env python3
"""Freeze the current catalogue as a standalone developer handoff, without editing it."""
import hashlib,json,pathlib,re,shutil,subprocess,zipfile
repo=pathlib.Path(__file__).resolve().parents[2]
source=repo/'katalog-nedvizhimosti';target=repo/'handoff/catalog-2026-11-03';site=target/'site'
source_commit='44fffa4960aad57bfa36c2433459acb961c8411b'
site.mkdir(exist_ok=True)
selected=[p for p in source.iterdir() if p.is_file() and p.suffix in ['.html','.css','.js','.json']]
for directory in ['assets','kit','kit-v1','map-view','reference-shell']:
 selected.extend(p for p in (source/directory).rglob('*') if p.is_file())
expected={p.relative_to(source) for p in selected}
for p in site.rglob('*'):
 if p.is_file() and p.relative_to(site) not in expected:raise RuntimeError('Unexpected existing file: '+str(p))
files=[]
for p in sorted(selected):
 rel=p.relative_to(source);out=site/rel;out.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(p,out);data=p.read_bytes()
 old=subprocess.check_output(['git','show',source_commit+':katalog-nedvizhimosti/'+rel.as_posix()],cwd=repo)
 assert data==old,'Source changed after release pin: '+str(rel)
 files.append({'path':'site/'+rel.as_posix(),'source':'katalog-nedvizhimosti/'+rel.as_posix(),'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'gitBlob':hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()})
manifest={'schemaVersion':1,'date':'2026-11-03','sourceRepository':'daniilterekh-prog/barn-estate-homepage-clone','canonicalRepository':'daniilterekh-prog/barnes-sites','sourceCommit':source_commit,'sourcePath':'katalog-nedvizhimosti/','canonicalPath':'main-site/pages/catalog/','runtimeCopiedUnchanged':True,'files':files}
(target/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
text=(source/'FONT-SIZES.md').read_text()
base='https://github.com/daniilterekh-prog/barn-estate-homepage-clone/blob/'+source_commit+'/katalog-nedvizhimosti/'
text=re.sub(r'\]\((?!https?://|#)([^)]+)\)',lambda m:']('+base+m.group(1)+')',text)
(target/'docs/FONT-SIZES.md').write_text(text)
# ZIP is regenerated after validation so the final verification report is included.
archive=target/'barn-estate-catalog-developer.zip'
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for p in sorted(target.rglob('*')):
  if not p.is_file() or p==archive or p.name=='release.json':continue
  info=zipfile.ZipInfo('barn-estate-catalog/'+p.relative_to(target).as_posix(),date_time=(2026,11,3,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o100644<<16
  z.writestr(info,p.read_bytes())
 assert z.testzip() is None
release={'version':'2026-11-03','sourceCommit':source_commit,'siteFiles':len(files),'siteBytes':sum(f['bytes'] for f in files),'archive':archive.name,'archiveBytes':archive.stat().st_size,'archiveSha256':hashlib.sha256(archive.read_bytes()).hexdigest(),'zipRoot':'barn-estate-catalog/'}
(target/'release.json').write_text(json.dumps(release,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(release))
