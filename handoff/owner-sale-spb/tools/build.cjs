/* Export the saved SPb owner sale page; relocate resources without redesigning it. */
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto');
const {JSDOM}=require(process.env.JSDOM_MODULE||'/home/daniil/.local/share/codex-toolkit/node_modules/jsdom');
const output=path.resolve(process.env.HANDOFF_OUTPUT||path.join(__dirname,'..'));
const publicRepo=path.resolve(process.env.BARN_PUBLIC_REPO||path.join(__dirname,'../../..'));
const sourceRepo=path.resolve(process.env.BARN_SOURCE_REPO||publicRepo);
const assetsRepo=process.env.BARN_ASSETS_REPO;
const page='prodazha_sobstvennikam_spb',canonical='main-site/pages/owner-sale-spb';
if(path.basename(output)!=='owner-sale-spb'||!fs.existsSync(path.join(sourceRepo,canonical,'index.html')))throw Error('Set BARN_SOURCE_REPO to the canonical barnes-sites checkout');
const commit=repo=>cp.execFileSync('git',['-C',repo,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
const sourceCommit=commit(sourceRepo),publicCommit=commit(publicRepo),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const runtime=new Map(JSON.parse(fs.readFileSync(path.join(sourceRepo,'main-site/runtime-files.json'))).map(r=>[r.public,r.source]));
const origin='https://daniilterekh-prog.github.io',prefix='/barn-estate-homepage-clone/';
const records=new Map(),destinations=new Map(),queue=[],references=[];
function write(file,bytes){const target=path.join(output,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes);}
function readRuntime(name){
 const canonicalPath=runtime.get(name)||(name.startsWith(page+'/')?canonical+name.slice(page.length):null);
 const local=canonicalPath&&path.join(sourceRepo,canonicalPath);
 const file=path.join(publicRepo,name);
 if(fs.existsSync(file)){const bytes=fs.readFileSync(file);return{bytes,source:name,repository:'daniilterekh-prog/barn-estate-homepage-clone',canonicalReference:canonicalPath||null,canonicalSha256:local&&fs.existsSync(local)?sha(fs.readFileSync(local)):null};}
 if(local&&fs.existsSync(local))return{bytes:fs.readFileSync(local),source:canonicalPath,repository:'daniilterekh-prog/barnes-sites'};
 throw Error('Missing runtime resource '+name);
}
function targetFor(name){
 const ext=path.extname(name).toLowerCase(),base=path.basename(name);
 if(name===page+'/index.html')return'html/index.html';
 if(ext==='.css'||ext==='.js'){const folder=ext==='.css'?'css/':'js/';return folder+(name.startsWith('shared/')?'shared-':name.startsWith('exact-2026-10-21/')?'home-':'')+base;}
 if(name.startsWith(page+'/assets/'))return'assets/'+name.slice((page+'/assets/').length);
 if(/\.(?:woff2?|ttf|otf)$/i.test(name))return'assets/fonts/'+base;
 return'assets/shared/'+base;
}
function add(name){
 name=path.posix.normalize(name);if(name.startsWith('../')||path.isAbsolute(name))throw Error('Unsafe resource '+name);
 if(records.has(name))return records.get(name);
 const source=readRuntime(name);let target=targetFor(name);
 if(destinations.has(target)&&destinations.get(target)!==name)target=target.replace(/(\.[^.]+)$/,'-'+sha(source.bytes).slice(0,8)+'$1');
 const record={name,target,...source};records.set(name,record);destinations.set(target,name);queue.push(record);return record;
}
function resolve(value,owner){
 if(!value||/^(?:data:|blob:|#|tel:|mailto:|javascript:)/i.test(value))return null;
 const url=new URL(value,origin+prefix+owner);
 if(url.origin===origin&&url.pathname.startsWith('/barnes-assets/'))return{external:url.href};
 if(url.origin==='https://front.barnes.vsavr.ru'&&url.pathname==='/favicon.ico')return{name:'favicon.ico',suffix:url.search+url.hash};
 if(url.origin!==origin)return null;
 let name=url.pathname.startsWith(prefix)?url.pathname.slice(prefix.length):url.pathname.slice(1);
 name=decodeURIComponent(name);
 const aliases={'main-site/shared/pictures/floating-expert/old-money-interior.webp':'pictures/floating-expert/old-money-interior.webp','main-site/shared/pictures/for-banks/modal-request-img.webp':'arenda_sobstvennikam/pictures/for-banks/modal-request-img.webp','pictures/for-banks/modal-request-img.webp':'arenda_sobstvennikam/pictures/for-banks/modal-request-img.webp'};
 return{name:aliases[name]||name,suffix:url.search+url.hash};
}
function resource(value,owner){const r=resolve(value,owner);if(!r)return null;if(r.external)return records.get(r.external);return add(r.name);}
function relative(target,owner){return path.posix.relative(path.posix.dirname(owner),target)||path.posix.basename(target);}
function relocate(value,owner,target){
 const r=resolve(value,owner);if(!r)return value;
 const record=r.external?records.get(r.external):add(r.name);if(!record)throw Error('Unregistered external resource '+value);
 const result=relative(record.target,target)+(r.suffix||'');references.push({owner,before:value,after:result});return result;
}
const urlPattern=/url\(\s*(?:(["'])(.*?)\1|([^)]*))\s*\)/g;
function scanCss(text,owner){for(const m of text.matchAll(urlPattern))resource((m[2]??m[3]).trim(),owner);}
function css(text,owner,target){return text.replace(urlPattern,(m,q,a,b)=>'url("'+relocate((a??b).trim(),owner,target)+'")');}
// Resource strings used both in new URL(..., currentScript.src) and inserted HTML.
const jsResource=/(?<![\w/])(?:(?:\.\.?\/)*(?:assets|fonts|pictures)\/|(?:\.\.?\/)+shared\/)[A-Za-z0-9_./-]+\.(?:css|js|svg|webp|png|jpe?g|avif|woff2?|ttf|ico)(?:\?[^\s"'`<>\\)]*)?/g;
function javascript(text,owner,target){return text.replace(jsResource,value=>relocate(value,owner,target));}
function navigation(value,owner){
 if(!value||/^(?:#|https?:|tel:|mailto:|javascript:)/i.test(value))return value;
 return new URL(value,origin+prefix+owner).href;
}
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
(async()=>{
 const main=add(page+'/index.html');const doc=new JSDOM(main.bytes.toString(),{url:origin+prefix+main.name}).window.document;
 // The static page uses native controllers; stale framework preload hints are not runtime dependencies.
 for(const link of [...doc.querySelectorAll('link[href]')])if(link.rel.includes('modulepreload')||(['preload','prefetch'].includes(link.rel)&&link.getAttribute('href').includes('/_nuxt/'))||['preconnect','dns-prefetch'].includes(link.rel))link.remove();
 // The only remote visual in this snapshot is the canonical BARN Estate logo.
 const remote=new Set();
 for(const el of doc.querySelectorAll('[src],[srcset],link[href],[data-expert-image]')){
  const values=[];for(const attr of ['src','data-expert-image'])if(el.hasAttribute(attr))values.push(el.getAttribute(attr));
  if(el.tagName==='LINK'&&/stylesheet|icon|preload/.test(el.rel))values.push(el.getAttribute('href'));
  if(el.hasAttribute('srcset'))values.push(...el.getAttribute('srcset').split(',').map(s=>s.trim().split(/\s+/)[0]));
  for(const v of values){const r=resolve(v,main.name);if(r?.external)remote.add(r.external);else resource(v,main.name);}
 }
 for(const url of remote){
  const assetPath=new URL(url).pathname.slice('/barnes-assets/'.length);let bytes;
  if(assetsRepo)bytes=cp.execFileSync('git',['-C',assetsRepo,'show','origin/main:'+assetPath],{maxBuffer:10*1024*1024});
  else{const response=await fetch(url);if(!response.ok)throw Error('Asset HTTP '+response.status);bytes=Buffer.from(await response.arrayBuffer());}
  const record={name:url,target:'assets/brand/'+path.basename(assetPath),bytes,source:assetPath,repository:'daniilterekh-prog/barnes-assets'};
  records.set(url,record);destinations.set(record.target,url);
 }
 for(const el of doc.querySelectorAll('style,[style]'))scanCss(el.tagName==='STYLE'?el.textContent:el.getAttribute('style'),main.name);
 for(let i=0;i<queue.length;i++){
  const r=queue[i],text=r.bytes.toString();if(r.name.endsWith('.css'))scanCss(text,r.name);
  if(r.name.endsWith('.js'))for(const m of text.matchAll(jsResource))resource(m[0],r.name);
 }
 for(const name of ['html','css','js','assets','data'])fs.rmSync(path.join(output,name),{recursive:true,force:true});
 for(const r of records.values()){
  if(r===main)continue;let bytes=r.bytes;
  if(r.name.endsWith('.css'))bytes=Buffer.from(css(bytes.toString(),r.name,r.target));
  if(r.name.endsWith('.js'))bytes=Buffer.from(javascript(bytes.toString(),r.name,r.target));
  write(r.target,bytes);
 }
 let inline=0;
 for(const el of [...doc.querySelectorAll('style')]){const target='css/inline-'+String(++inline).padStart(2,'0')+'.css';write(target,css(el.textContent,main.name,target));const link=doc.createElement('link');link.rel='stylesheet';link.href=relative(target,main.target);link.dataset.handoffInline='true';el.replaceWith(link);}
 for(const el of [...doc.querySelectorAll('script:not([src])')]){
  if(el.type&&!/javascript|module/.test(el.type))continue;
  const target='js/inline-'+String(++inline).padStart(2,'0')+'.js';write(target,javascript(el.textContent,main.name,target));el.textContent='';el.src=relative(target,main.target);el.dataset.handoffInline='true';
 }
 for(const el of doc.querySelectorAll('[src],[href],[srcset],[style],[data-expert-image]')){
  if(el.hasAttribute('data-handoff-inline')){el.removeAttribute('data-handoff-inline');continue;}
  for(const key of ['src','data-expert-image'])if(el.hasAttribute(key))el.setAttribute(key,relocate(el.getAttribute(key),main.name,main.target));
  if(el.tagName==='LINK'&&/stylesheet|icon|preload/.test(el.rel))el.href=relocate(el.getAttribute('href'),main.name,main.target);
  if(el.tagName==='A'&&el.hasAttribute('href'))el.href=navigation(el.getAttribute('href'),main.name);
  if(el.hasAttribute('srcset'))el.setAttribute('srcset',el.getAttribute('srcset').split(',').map(s=>{const[u,...size]=s.trim().split(/\s+/);return relocate(u,main.name,main.target)+(size.length?' '+size.join(' '):'');}).join(', '));
  if(el.hasAttribute('style'))el.setAttribute('style',css(el.getAttribute('style'),main.name,main.target));
 }
 write('html/index.html','<!doctype html>\n<!-- FULL DOCUMENT: use as a complete page. -->\n'+doc.documentElement.outerHTML+'\n');
 write('html/head.fragment.html','<!-- FRAGMENT: content for the target document head; not a standalone page. -->\n'+doc.head.innerHTML+'\n');
 write('html/body.fragment.html','<!-- FRAGMENT: body content; requires the body attributes in data/body-attributes.json and head.fragment.html. -->\n'+doc.body.innerHTML+'\n');
 write('data/body-attributes.json',JSON.stringify(Object.fromEntries([...doc.body.attributes].map(a=>[a.name,a.value])),null,2)+'\n');
 write('html/README.md','# HTML\n\n- index.html — полная самостоятельная страница.\n- head.fragment.html и body.fragment.html — части для CMS, не самостоятельные блоки. Скопируйте атрибуты body из data/body-attributes.json. Не вставляйте их повторно в index.html. Пути рассчитаны на документ в html/.\n');
 for(const name of ['SPB-SOURCE.json','EDITORIAL-IMAGES.json'])write('data/'+name,fs.readFileSync(path.join(sourceRepo,canonical,name)));
 write('index.html','<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><meta http-equiv="refresh" content="0;url=html/index.html"><title>Собственникам СПб — пакет разработчика</title><a href="html/index.html">Открыть полную страницу</a></html>\n');
 const outputs=walk(output).filter(f=>/^(?:html|css|js|assets|data)\//.test(path.relative(output,f).split(path.sep).join('/'))).map(f=>({file:path.relative(output,f).split(path.sep).join('/'),bytes:fs.statSync(f).size,sha256:sha(fs.readFileSync(f))}));
 write('SOURCE.json',JSON.stringify({date:'2026-11-10',canonicalRepository:'daniilterekh-prog/barnes-sites',canonicalCommit:sourceCommit,source:canonical,publicReferenceCommit:publicCommit,preview:origin+prefix+page+'/',entryPolicy:'Materialised public HTML is the export input; canonical source remains in barnes-sites. Archive-only extraction of inline files is not replayed into the handoff.',transform:'Relocate runtime resources; externalize inline CSS/JS; preserve design, native controllers and preview-only forms; omit unused framework preload hints. HTML navigation links retain their approved destinations as absolute links.',files:[...records.values()].map(r=>({source:r.source,repository:r.repository,file:r.target,sourceSha256:sha(r.bytes),canonicalReference:r.canonicalReference||null,canonicalSha256:r.canonicalSha256||null})),references,outputs},null,2)+'\n');
 console.log(JSON.stringify({destination:output,runtimeFiles:outputs.length,bytes:outputs.reduce((s,r)=>s+r.bytes,0)}));
})().catch(e=>{console.error(e);process.exit(1)});
