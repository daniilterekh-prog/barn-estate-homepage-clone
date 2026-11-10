/* Package the isolated SPb snapshot; preserve its compiled Vue/Nuxt runtime. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process');
const {JSDOM}=require(process.env.JSDOM_MODULE||'/home/daniil/.local/share/codex-toolkit/node_modules/jsdom');
const dest=path.resolve(process.env.HANDOFF_OUTPUT||path.join(__dirname,'..'));
const source=path.resolve(process.env.HANDOFF_SOURCE||path.join(__dirname,'../../../pages/home-spb'));
const publicRepo=process.env.BARN_PUBLIC_REPO||'/tmp/barnes-spb-pages-20261109';
const repository=cp.execFileSync('git',['-C',source,'rev-parse','--show-toplevel'],{encoding:'utf8'}).trim();
const commit=cp.execFileSync('git',['-C',repository,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
const sourcePath='/main-site/pages/home-spb/',virtual='https://daniilterekh-prog.github.io'+sourcePath,publicBase='https://daniilterekh-prog.github.io/barn-estate-homepage-clone/home-spb/';
if(path.basename(dest)!=='home-spb'||dest===source)throw Error('Unsafe package destination');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const write=(name,data)=>{const f=path.join(dest,name);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,data);};
const rel=(target,owner)=>{const x=path.posix.relative(path.posix.dirname(owner),target);return (x.startsWith('.')?x:'./'+x)+(target.endsWith('/')?'/':'');};
const clean=u=>{const x=new URL(u);x.search='';x.hash='';return x.href;};
const mapping=new Map(),files=[],originals=new Map(),external=[];
function register(url,target){mapping.set(clean(url),target);}
function local(name,target,bytes){const old=virtual+name;register(old,target);register(publicBase+name,target);if(name.startsWith('_nuxt/'))register('https://daniilterekh-prog.github.io/'+name,target);originals.set(name,{target,bytes});files.push({source:path.relative(repository,path.join(source,name)).split(path.sep).join('/'),file:target,sourceSha256:sha(bytes),bytes:bytes.length});}
function walk(root,prefix=''){return fs.readdirSync(root,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(root,e.name),prefix+e.name+'/'):[prefix+e.name]);}
const rootJSON=['spb-catalog.json','spb-copy.json','spb-routes.json','spb-expert.json','spb-schema.json','hero-source.json','direction-image-sources.json'];
for(const name of walk(source)){
 if(name.includes('verification/')||name.startsWith('tools/')||name.endsWith('.mp4'))continue;
 let target;
 if(name==='index.html')target='html/index.html';
 else if(name.endsWith('.js'))target='js/'+(name.startsWith('_nuxt/')?'nuxt/'+name.slice(6):name);
 else if(name.endsWith('.css'))target='css/'+(name.startsWith('_nuxt/')?'nuxt/'+name.slice(6):name);
 else if(name.startsWith('_nuxt/')&&name.endsWith('.json'))target='data/nuxt/'+name.slice(6);
 else if(name.startsWith('assets/')&&name.endsWith('.json'))target='data/api/'+path.basename(name);
 else if(name.startsWith('assets/'))target=name;
 else if(rootJSON.includes(name))target='data/'+name;
 else continue;
 local(name,target,fs.readFileSync(path.join(source,name)));
}
// Preserve equality checks in controllers that construct asset-directory URLs.
register(virtual+'assets/','assets/');register(publicBase+'assets/','assets/');
// Root favicon and retained hidden-form CSS assets also need physical local copies.
const publicExtras=[
 ['favicon.ico','/favicon.ico','assets/favicon.ico'],
 ['arenda_sobstvennikam/pictures/for-banks/modal-request-img.webp','/pictures/for-banks/modal-request-img.webp','assets/ui/modal-request-img.webp'],
 ['pictures/floating-expert/old-money-interior.webp','/pictures/floating-expert/old-money-interior.webp','assets/ui/old-money-interior.webp']
].map(([name,url,target])=>{const bytes=cp.execFileSync('git',['-C',publicRepo,'show','origin/master:'+name],{maxBuffer:10*1024*1024});register('https://daniilterekh-prog.github.io'+url,target);files.push({source:'barn-estate-homepage-clone:'+name,file:target,sourceSha256:sha(bytes),bytes:bytes.length});return {target,bytes};});
const doc=new JSDOM(originals.get('index.html').bytes.toString(),{url:virtual}).window.document;
const payload=JSON.parse(doc.querySelector('#__NUXT_DATA__').textContent),reachable=new Set(),urls=new Set();
function scanString(s){if(typeof s!=='string')return;const candidates=[s,...Array.from(s.matchAll(/(?:src|poster)=["']([^"']+)["']/g),m=>m[1])];for(const x of candidates)if(/^https?:\/\/.+\.(?:jpe?g|webp|png|svg|avif|woff2?)(?:[?#].*)?$/i.test(x))urls.add(clean(x));}
function traverse(i){if(!Number.isInteger(i)||i<0||reachable.has(i))return;reachable.add(i);const v=payload[i];if(typeof v==='string')scanString(v);else if(Array.isArray(v))for(const n of v)traverse(n);else if(v&&typeof v==='object')for(const [key,n] of Object.entries(v))if(!['sourceImage','source','canonicalAssets'].includes(key))traverse(n);}
const page=payload.find(x=>x&&typeof x==='object'&&!Array.isArray(x)&&'barnesChoice'in x&&'departments'in x);for(const x of Object.values(page))traverse(x);
const settings=payload.find(x=>x&&typeof x==='object'&&!Array.isArray(x)&&'topMenu'in x&&'officeContact'in x);for(const x of Object.values(settings||{}))traverse(x);
for(const el of doc.querySelectorAll('img[src],source[srcset]')){scanString(el.getAttribute('src'));for(const part of (el.getAttribute('srcset')||'').split(','))scanString(part.trim().split(/\s+/)[0]);}
// Fonts referenced outside the isolated source are copied without changing shared files.
const fontNames=new Set();for(const[name,item]of originals)if(name.endsWith('.css'))for(const m of item.bytes.toString().matchAll(/url\(["']?(\/fonts\/[^\)"']+)/g))fontNames.add(m[1]);
for(const url of fontNames){const f=path.join(publicRepo,url.slice(1));if(!fs.existsSync(f))throw Error('Font missing '+url);const target='assets/fonts/'+path.basename(url),bytes=fs.readFileSync(f);register('https://daniilterekh-prog.github.io'+url,target);write(target,bytes);files.push({source:'barn-estate-homepage-clone:'+url,file:target,sourceSha256:sha(bytes),bytes:bytes.length});}
async function gather(url){if(mapping.has(url))return;const legacyPath=new URL(url).pathname;if(legacyPath.startsWith(sourcePath)){const item=originals.get(decodeURIComponent(legacyPath.slice(sourcePath.length)));if(item){register(url,item.target);return;}}const response=await fetch(url,{signal:AbortSignal.timeout(30000)});if(!response.ok)throw Error('External asset HTTP'+response.status+': '+url);const bytes=Buffer.from(await response.arrayBuffer());const extension=path.extname(new URL(url).pathname)||'.bin';const target='assets/external/'+sha(Buffer.from(url)).slice(0,20)+extension;register(url,target);write(target,bytes);external.push({url,file:target,httpStatus:response.status,sha256:sha(bytes),bytes:bytes.length});files.push({source:url,file:target,sourceSha256:sha(bytes),bytes:bytes.length});}
function mapped(value,base,owner){if(!value||/^(?:data:|blob:|#|mailto:|tel:|javascript:)/.test(value))return value;let u;try{u=new URL(value,base);}catch{return value;}const target=mapping.get(clean(u.href));return target?rel(target,owner)+u.search+u.hash:value;}
function css(text,base,owner){return text.replace(/url\(\s*(?:(["'])(.*?)\1|([^)]*))\s*\)/g,(m,q,a,b)=>'url("'+mapped((a??b).trim(),base,owner)+'")').replace(/(@import\s+)(['"])([^'"]+)\2/g,(m,a,q,v)=>a+q+mapped(v,base,owner)+q);}
(async()=>{
 // Only generated runtime directories are replaced; tools, README and verification persist.
 for(const name of ['html','css','js','assets','data'])fs.rmSync(path.join(dest,name),{recursive:true,force:true});
 // Fonts written before cleanup are restored now.
 for(const url of fontNames)write('assets/fonts/'+path.basename(url),fs.readFileSync(path.join(publicRepo,url.slice(1))));
 for(const item of publicExtras)write(item.target,item.bytes);
 await Promise.all([...urls].map(gather));
 for(const[name,item]of originals){let bytes=item.bytes;if(name.endsWith('.css'))bytes=Buffer.from(css(bytes.toString(),virtual+name,item.target));write(item.target,bytes);}
 let inline=0;
 for(const style of [...doc.querySelectorAll('style')]){const target='css/inline-'+String(++inline).padStart(2,'0')+'.css';write(target,css(style.textContent,virtual,target));const link=doc.createElement('link');link.rel='stylesheet';link.href=rel(target,'html/index.html');style.replaceWith(link);}
 for(const script of [...doc.querySelectorAll('script:not([src])')]){
  if(script.type&&!/javascript|module/.test(script.type))continue;
  const target='js/inline-'+String(++inline).padStart(2,'0')+'.js';let text=script.textContent;
  // This page has no embedded API map; do not distribute an unused browser key.
  text=text.replace(/apikey:"[^"]*"/g,'apikey:"HANDOFF_MAP_KEY_NOT_CONFIGURED"');write(target,text);script.textContent='';script.src=rel(target,'html/index.html');
 }
 for(const el of doc.querySelectorAll('[src],[href],[poster],[srcset],[style]')){
  for(const key of ['src','href','poster'])if(el.hasAttribute(key)&&!(key==='href'&&el.tagName==='A'))el.setAttribute(key,mapped(el.getAttribute(key),virtual,'html/index.html'));
  if(el.hasAttribute('srcset'))el.setAttribute('srcset',el.getAttribute('srcset').split(',').map(x=>{const [u,...size]=x.trim().split(/\s+/);return mapped(u,virtual,'html/index.html')+(size.length?' '+size.join(' '):'');}).join(', '));
  if(el.hasAttribute('style'))el.setAttribute('style',css(el.getAttribute('style'),virtual,'html/index.html'));
 }
 for(const video of doc.querySelectorAll('.home-hero__video,.video-section video')){video.removeAttribute('src');video.removeAttribute('autoplay');video.preload='none';}
 // Framework route and resource relocation is isolated from editable controllers.
 register(virtual,'html/index.html');
 let template=fs.readFileSync(path.join(__dirname,'runtime-bootstrap.template.js'),'utf8');
 const resourceMap=Object.fromEntries([...mapping].map(([u,d])=>[u,rel(d,'js/handoff-bootstrap.js')]));
 template=template.replace("/*__SOURCE__*/''",JSON.stringify(virtual)).replace('/*__MAP__*/{}',JSON.stringify(resourceMap));write('js/handoff-bootstrap.js',template);
 const boot=doc.createElement('script');boot.src='../js/handoff-bootstrap.js';boot.dataset.nativePage='true';doc.head.prepend(boot);
 write('html/index.html','<!doctype html>\n'+doc.documentElement.outerHTML+'\n');
 write('data/nuxt-payload.json',JSON.stringify(payload)+'\n');
 write('html/README.md','# HTML главной СПб\n\n`index.html` — **полная самостоятельная страница**, не HTML-фрагмент. Сохраняйте соседние css/, js/, assets/ и data/. Разрозненные Vue-фрагменты не выдаются за независимые блоки: им нужен сохранённый runtime.\n');
 write('index.html','<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><meta http-equiv="refresh" content="0;url=html/index.html"><title>Главная СПб — пакет разработчика</title><a href="html/index.html">Открыть полную страницу</a></html>\n');
 write('data/resource-map.json',JSON.stringify(Object.fromEntries(mapping),null,2)+'\n');
 const outputs=walk(dest).filter(x=>/^(?:html|css|js|assets|data)\//.test(x));const manifest=outputs.map(file=>{const bytes=fs.readFileSync(path.join(dest,file));return{file,bytes:bytes.length,sha256:sha(bytes)};});
 write('SOURCE.json',JSON.stringify({date:'2026-11-10',repository:'daniilterekh-prog/barnes-sites',commit,source:path.relative(repository,source).split(path.sep).join('/'),preview:publicBase,scope:'Independent current SPb homepage; no Moscow/final-node rebuild',transform:'Separate HTML/CSS/JS/assets/data; resource-path relocation; preserved compiled runtime; unused browser map key replaced with an explicit non-secret placeholder; already-disabled video transport suppressed; no application redesign',bootstrapProvenance:'Adapted from main-site/handoff/current/home/js/handoff-bootstrap.js',files,external,manifest},null,2)+'\n');
 console.log(JSON.stringify({files:manifest.length,bytes:manifest.reduce((s,x)=>s+x.bytes,0),external:external.length,destination:dest}));
})().catch(e=>{console.error(e);process.exit(1)});
