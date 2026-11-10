#!/usr/bin/env python3
"""Export the approved Contacts page, changing local resource paths only."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, urlunsplit
import argparse,hashlib,json,posixpath,re,shutil,subprocess
PACKAGE=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--source',type=Path,default=PACKAGE.parents[1]/'pages/contacts');args=parser.parse_args();source=args.source.resolve()
repo=Path(subprocess.check_output(['git','-C',str(source),'rev-parse','--show-toplevel'],text=True).strip());commit=subprocess.check_output(['git','-C',str(repo),'rev-parse','HEAD'],text=True).strip()
rows=[r for r in json.loads((repo/'main-site/runtime-files.json').read_text()) if r['page']=='contacts' and not r['source'].endswith('README.md')]
def destination(name):
 if name=='index.html':return 'html/index.html'
 if name=='content-sources.json':return 'data/content-sources.json'
 if name.endswith('.css'):return 'css/'+name
 if name.endswith('.js'):return 'js/'+name
 if name.startswith('assets/'):return 'assets/icons/'+name[7:]
 if name.startswith('fonts/'):return 'assets/fonts/'+name[6:]
 if name.endswith('LICENSE.txt'):return 'assets/licenses/'+Path(name).name
 raise ValueError(name)
mapping={str(Path(r['source']).relative_to(source.relative_to(repo))):None for r in rows}
mapping={name:destination(name) for name in mapping};references=[]
def rebase(value,owner):
 if not value or value.startswith(('#','data:','tel:','mailto:','javascript:')):return value
 parts=urlsplit(value)
 if parts.scheme or parts.netloc:return value
 target=posixpath.normpath(posixpath.join(posixpath.dirname(owner),parts.path))
 if target not in mapping:raise ValueError(f'Unmapped local reference {value} in {owner}')
 result=posixpath.relpath(mapping[target],posixpath.dirname(mapping[owner]));references.append({'owner':owner,'before':value,'after':result})
 return urlunsplit(('','',result,parts.query,parts.fragment))
files=[]
for name,target in mapping.items():
 src=source/name;raw=src.read_bytes();data=raw
 if name.endswith('.html'):
  text=raw.decode();text=re.sub(r'\b(src|href)=("|\')(.*?)\2',lambda m:m[1]+'='+m[2]+rebase(m[3],name)+m[2],text);data=text.encode()
 elif name.endswith('.css'):
  text=raw.decode();text=re.sub(r'url\(\s*(["\']?)([^)\s"\']+)\1\s*\)',lambda m:'url('+m[1]+rebase(m[2],name)+m[1]+')',text);data=text.encode()
 out=PACKAGE/target;out.parent.mkdir(parents=True,exist_ok=True);out.write_bytes(data);files.append({'source':src.relative_to(repo).as_posix(),'file':target,'sourceSha256':hashlib.sha256(raw).hexdigest(),'sha256':hashlib.sha256(data).hexdigest(),'bytes':len(data),'changedPathsOnly':data!=raw})
class Fragments(HTMLParser):
 def __init__(self,text):
  super().__init__(convert_charrefs=False);self.text=text;self.offsets=[0];self.stack=[];self.nodes=[]
  for line in text.splitlines(True):self.offsets.append(self.offsets[-1]+len(line))
  self.feed(text)
 def source_position(self):line,col=self.getpos();return self.offsets[line-1]+col
 def handle_starttag(self,tag,attrs):
  if tag not in {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}:self.stack.append((tag,dict(attrs),self.source_position()))
 def handle_endtag(self,tag):
  for i in range(len(self.stack)-1,-1,-1):
   if self.stack[i][0]==tag:
    t,a,start=self.stack[i];end=self.text.find('>',self.source_position())+1;self.nodes.append((t,a,start,end));self.stack=self.stack[:i];break
 def get(self,tag,cls=None,id=None):
  matches=[(s,e) for t,a,s,e in self.nodes if t==tag and (not cls or cls in a.get('class','').split()) and (not id or a.get('id')==id)];assert len(matches)==1,(tag,cls,id,matches);s,e=matches[0];return self.text[s:e]
html=(PACKAGE/'html/index.html').read_text();fragments=Fragments(html)
parts={'01-header.html':fragments.get('a','skip-link')+'\n'+fragments.get('header','site-header')+'\n'+fragments.get('div','site-menu')+'\n'+fragments.get('script',id='catalog-header-navigation'),'02-contacts.html':fragments.get('main',id='main'),'03-footer.html':fragments.get('footer','site-footer'),'04-contact-dialog.html':fragments.get('dialog','contact-dialog')}
for name,text in parts.items():(PACKAGE/'html'/name).write_text(text+'\n')
(PACKAGE/'index.html').write_text('<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><meta http-equiv="refresh" content="0;url=html/index.html"><title>Контакты BARN Estate — код</title><a href="html/index.html">Открыть страницу контактов</a></html>\n')
(PACKAGE/'SOURCE.json').write_text(json.dumps({'date':'2026-11-10','repository':'daniilterekh-prog/barnes-sites','commit':commit,'source':source.relative_to(repo).as_posix()+'/','preview':'https://daniilterekh-prog.github.io/barn-estate-homepage-clone/contacts/','transform':'Local resource paths only. JavaScript, assets and content data copied byte-for-byte. HTML fragments extracted from the exported full page.','files':files,'references':references},ensure_ascii=False,indent=2)+'\n')
print(f'Exported {len(files)} runtime files and {len(parts)} HTML fragments')

rule=PACKAGE.parent/'RULES.md'
if rule.exists():shutil.copy2(rule,PACKAGE/'RULES.md')
