/* Import the captured original markup and only this property's resources. */
const fs=require('node:fs/promises');
const path=require('node:path');
const crypto=require('node:crypto');
const toolkit=process.env.CODEX_TOOLKIT_ROOT||path.join(require('node:os').homedir(),'.local/share/codex-toolkit');
const {JSDOM}=require(path.join(toolkit,'node_modules/jsdom'));
const origin='https://front.barnes.vsavr.ru';
const capture=process.argv[2]||'/tmp/barnes-588036';
const output=path.resolve(__dirname,'../stranitsa-lota');
const assets=path.join(output,'assets/source');
const pending=new Map(),manifest=[];
const sha=v=>crypto.createHash('sha256').update(v).digest('hex');
const safeUrl=raw=>{const u=new URL(raw);u.searchParams.delete('apikey');return u.href};
async function download(raw,base=origin,inCss=false){
  if(!raw||/^(data:|blob:|#)/.test(raw))return raw;
  const url=new URL(raw,base).href,key=safeUrl(url);
  if(!pending.has(key))pending.set(key,(async()=>{
    let r;for(let attempt=0;attempt<3;attempt++){r=await fetch(url);if(r.ok)break}
    if(!r.ok)throw new Error('Asset '+r.status+' '+key);
    let data=Buffer.from(await r.arrayBuffer());const type=r.headers.get('content-type')||'';
    let ext=path.extname(new URL(url).pathname);if(!ext||ext.length>8)ext=type.includes('png')?'.png':type.includes('svg')?'.svg':type.includes('css')?'.css':type.includes('jpeg')?'.jpg':'.bin';
    const name=sha(key).slice(0,12)+ext;
    if(type.includes('text/css')||ext==='.css')data=Buffer.from(await css(data.toString(),url,true));
    await fs.writeFile(path.join(assets,name),data);manifest.push({source:key,file:'assets/source/'+name,bytes:data.length,sha256:sha(data)});return 'assets/source/'+name;
  })());
  const result=await pending.get(key);return inCss?path.basename(result):result;
}
async function css(text,base,inAssets){
  const matches=[...text.matchAll(/url\(\s*(['"]?)([^)'"\s]+)\1\s*\)/g)];
  const values=await Promise.all(matches.map(async m=>[m[0],await download(m[2],base,inAssets)]));
  for(const [old,value]of values)text=text.split(old).join('url("'+value+'")');return text;
}
async function rewrite(d){
  d.querySelectorAll('script:not([type="application/ld+json"]),link[rel="modulepreload"],link[as="fetch"],link[rel="preload"][as="script"]').forEach(e=>e.remove());
  await Promise.all([...d.querySelectorAll('link[href]')].map(async e=>{
    e.removeAttribute('crossorigin');e.removeAttribute('integrity');
    if(['stylesheet','icon','shortcut icon','apple-touch-icon'].includes(e.rel))e.setAttribute('href',await download(e.getAttribute('href')));
    else if(e.getAttribute('href').startsWith('/'))e.href=new URL(e.getAttribute('href'),origin).href;
  }));
  await Promise.all([...d.querySelectorAll('style')].map(async e=>e.textContent=await css(e.textContent,origin,false)));
  await Promise.all([...d.querySelectorAll('img[src],source[src],source[srcset],video[poster]')].map(async e=>{const a=e.hasAttribute('poster')?'poster':'src';if(e.hasAttribute(a))e.setAttribute(a,await download(e.getAttribute(a)));if(e.hasAttribute('srcset')){const v=e.getAttribute('srcset').split(',').map(x=>x.trim().split(/\s+/));e.setAttribute('srcset',(await Promise.all(v.map(async([u,...desc])=>[await download(u),...desc].join(' ')))).join(', '))}e.loading='eager'}));
  await Promise.all([...d.querySelectorAll('[style]')].map(async e=>{if(e.getAttribute('style').includes('url('))e.setAttribute('style',await css(e.getAttribute('style'),origin,false))}));
  d.querySelectorAll('a[href]').forEach(a=>{const href=a.getAttribute('href');if(href.startsWith('/'))a.href=new URL(href,origin).href});
}
(async()=>{
  await fs.mkdir(assets,{recursive:true});
  const d=new JSDOM(await fs.readFile(path.join(capture,'reference-1440.html'),'utf8')).window.document;
  await rewrite(d);d.documentElement.lang='ru';
  d.querySelectorAll('style').forEach(e=>{if(e.textContent.startsWith('*,*::before,*::after{animation:none'))e.remove()});
  d.querySelectorAll('[class]').forEach(e=>{[...e.classList].filter(c=>/-enter-(active|from)|-leave-(active|to)/.test(c)).forEach(c=>e.classList.remove(c))});
  d.body.style.removeProperty('overflow');
  const matrices=(await fs.readdir(capture)).filter(n=>/^matrix-\d+\.json$/.test(n));const maps=[];
  for(const name of matrices){const data=JSON.parse(await fs.readFile(path.join(capture,name)));for(const tile of data.map.tiles)tile.src=await download(tile.src);maps.push({viewport:data.width,...data.map})}
  maps.sort((a,b)=>a.viewport-b.viewport);
  const categories=JSON.parse(await fs.readFile(path.join(capture,'categories.json')));for(const c of categories){for(const tile of c.map.tiles)tile.src=await download(tile.src)}
  const reviews=JSON.parse(await fs.readFile(path.join(capture,'reviews.json')));
  const menuIcon=new JSDOM(await fs.readFile(path.join(capture,'state-menu.html'),'utf8')).window.document.querySelector('.site-header__icon-btn').innerHTML;
  const dataScript=d.createElement('script');dataScript.src='source-data.js';dataScript.defer=true;d.body.append(dataScript);
  await fs.writeFile(path.join(output,'source-data.js'),'/* Original map geometry and review states. No API credentials. */\nwindow.BARNES_PROPERTY_DATA='+JSON.stringify({maps,categories,reviews,menuIcon})+';\n');
  for(const name of ['menu','gallery','gallery-map','callback','tour','presentation','price','construction']){
    const sd=new JSDOM(await fs.readFile(path.join(capture,`state-${name}.html`),'utf8')).window.document;await rewrite(sd);
    const nodes=[...sd.body.children].filter(e=>!['__nuxt','teleports'].includes(e.id)&&e.tagName!=='SCRIPT');
    const html=nodes.map(e=>e.outerHTML).join('\n')+(sd.querySelector('#teleports')?.innerHTML||'');
    const t=d.createElement('template');t.id='source-'+name;t.innerHTML=html;d.body.append(t);
  }
  const link=d.createElement('link');link.rel='stylesheet';link.href='local.css';d.head.append(link);
  const script=d.createElement('script');script.src='local.js';script.defer=true;d.body.append(script);
  await fs.writeFile(path.join(output,'index.html'),'<!DOCTYPE html>\n'+d.documentElement.outerHTML+'\n');
  await fs.writeFile(path.join(output,'source-assets.json'),JSON.stringify({source:origin+'/vtorichnaya-nedvizhimost/588036/',capturedAt:new Date().toISOString(),assets:manifest.sort((a,b)=>a.file.localeCompare(b.file))},null,2)+'\n');
  require('node:child_process').execFileSync(process.execPath,[path.join(__dirname,'configure-lot-template.cjs')],{stdio:'inherit'});
  console.log('Imported '+manifest.length+' assets into the common lot template');
})().catch(e=>{console.error(e);process.exitCode=1});
