#!/usr/bin/env python3
"""Package the unchanged catalogue into HTML/CSS/JS folders; measurements are separate."""
import json,os,pathlib,re,shutil,urllib.parse
repo=pathlib.Path(__file__).resolve().parents[2];source=repo/'katalog-nedvizhimosti';target=repo/'handoff/catalog-2026-11-03';code=target/'code'
# The user explicitly requested replacing the previous handoff contents.
for name in ['site','docs','tools','verification','PLAN.md','INDEX.md','manifest.json','release.json','barn-estate-catalog-developer.zip']:
 p=target/name
 if p.is_dir():shutil.rmtree(p)
 elif p.exists():p.unlink()
if code.exists():shutil.rmtree(code)
files=[]
for p in source.rglob('*'):
 if not p.is_file() or any(x in p.relative_to(source).parts for x in ['verification','tools']):continue
 rel=p.relative_to(source).as_posix()
 if p.suffix in ['.css','.js']:dest=code/p.suffix[1:]/rel
 elif rel=='index.html':dest=code/'html/index.html'
 elif rel=='objects.json':dest=code/'data/objects.json'
 elif p.suffix=='.woff2':dest=code/'assets/fonts'/p.name
 elif p.suffix in ['.jpg','.jpeg','.png','.webp','.svg']:dest=code/'assets/images'/rel
 elif p.name.endswith('LICENSE.txt') or rel=='map-view/LICENSE.md':dest=code/'assets/licenses'/('map-LICENSE.md' if p.suffix=='.md' else p.name)
 else:continue
 files.append((p,dest))
mapping={p.resolve():dest for p,dest in files};html=code/'html/index.html'
def reference(value,oldbase,newbase):
 if not value or value.startswith(('#','data:','http:','https:','tel:','mailto:','//')):return value
 parts=urllib.parse.urlsplit(value);old=(oldbase/urllib.parse.unquote(parts.path)).resolve();dest=mapping.get(old)
 if dest is None:return value
 return pathlib.Path(os.path.relpath(dest,newbase)).as_posix()+('?' + parts.query if parts.query else '')+('#'+parts.fragment if parts.fragment else '')
url_pattern=re.compile(r'url\(\s*(?:(["\'])(.*?)\1|([^)]*))\s*\)')
for p,dest in files:
 dest.parent.mkdir(parents=True,exist_ok=True)
 if p.suffix not in ['.html','.css','.js','.json']:shutil.copyfile(p,dest);continue
 text=p.read_text()
 if p.suffix=='.css':
  def css(m):
   value=m.group(2) if m.group(1) else m.group(3).strip();new=reference(value,p.parent,dest.parent)
   return m.group(0) if new==value else 'url("'+new+'")'
  text=url_pattern.sub(css,text)
 elif p.suffix=='.html':
  def attr(m):
   name,value=m.group(1),m.group(2)
   if name=='srcset':value=', '.join(reference(x.strip().split()[0],source,html.parent)+(' '+' '.join(x.strip().split()[1:]) if len(x.strip().split())>1 else '') for x in value.split(','))
   else:value=reference(value,source,html.parent)
   return name+'="'+value+'"'
  text=re.sub(r'\b(src|href|srcset)="([^"]*)"',attr,text)
 elif p.suffix=='.js':
  def js_url(m):return 'new URL('+m.group(1)+reference(m.group(2),p.parent,dest.parent)+m.group(1)+','
  text=re.sub(r'new URL\((["\'])([^"\']+\.(?:css|webp|png|jpg|svg)[^"\']*)\1,',js_url,text)
  if p.name=='listing.js':text=text.replace("fetch('objects.json')","fetch('../data/objects.json')")
  if p.name=='catalog-map.js':text=text.replace("'map-view/map-preview.png'",repr(reference('map-view/map-preview.png',source,html.parent)))
 elif p.name=='objects.json':
  records=json.loads(text)
  for item in records:item['image']=reference(item['image'],source,html.parent)
  text=json.dumps(records,ensure_ascii=False,indent=2)+'\n'
 dest.write_text(text)
# Keep the design collector's full measurement file when rebuilding the code.
(target/'design').mkdir(exist_ok=True)
font=(source/'FONT-SIZES.md').read_text();font=font[font.index('## Страница и быстрые фильтры'):]
font=re.sub(r'\[([^\]]+)\]\([^)]*\)',r'\1',font)
(target/'design/TYPOGRAPHY.md').write_text('# Шрифты каталога\n\nВсе значения — CSS px. Основной шрифт Tilda Sans. Вес: 300 Light, 400 Regular, 500 Medium, 700 Bold. Логотип — SVG. Фильтры сохранены в прежнем размере 17/18/20px.\n\n'+font+'\nПолные межстрочные интервалы, разрядка, выравнивание и цвета каждого измеренного элемента — в [MEASUREMENTS.json](MEASUREMENTS.json).\n')
report=repo/'katalog-nedvizhimosti/verification/design-handoff';report.mkdir(parents=True,exist_ok=True)
(report/'code-paths.json').write_text(json.dumps([{'source':str(p.relative_to(repo)),'target':str(d.relative_to(repo))} for p,d in files],ensure_ascii=False,indent=2))
print(json.dumps({'files':len(files),'html':sum(p.suffix=='.html' for p,d in files),'css':sum(p.suffix=='.css' for p,d in files),'js':sum(p.suffix=='.js' for p,d in files)}))
