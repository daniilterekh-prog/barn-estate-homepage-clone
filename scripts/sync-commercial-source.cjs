/* Mechanical source import; run only against the explicitly selected reference. */
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const os = require('node:os');
const { JSDOM } = require(path.join(process.env.CODEX_TOOLKIT_ROOT || path.join(os.homedir(), '.local/share/codex-toolkit'), 'node_modules/jsdom'));
const origin = 'https://front.barnes.vsavr.ru';
const capture = process.argv[2] || '/tmp/commercial-parity';
const output = path.resolve(__dirname, '../kommercheskaya-nedvizhimost');
const assets = path.join(output, 'assets/source');
const manifest = [];
const pending = new Map();
const hash = data => crypto.createHash('sha256').update(data).digest('hex');

async function download(raw, base = origin) {
  if (!raw || /^(data:|blob:|#)/.test(raw)) return raw;
  const url = new URL(raw, base).href;
  if (pending.has(url)) return pending.get(url);
  const task = (async () => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Asset request failed: ${response.status} ${new URL(url).pathname}`);
    let data = Buffer.from(await response.arrayBuffer());
    const type = response.headers.get('content-type') || '';
    let ext = path.extname(new URL(url).pathname).split('?')[0];
    if (!ext || ext.length > 8) ext = type.includes('png') ? '.png' : type.includes('svg') ? '.svg' : type.includes('css') ? '.css' : '.bin';
    const file = `${hash(url).slice(0,12)}${ext}`;
    if (type.includes('text/css') || ext === '.css') data = Buffer.from(await rewriteCss(data.toString(), url));
    await fs.writeFile(path.join(assets, file), data);
    const safeUrl = new URL(url); safeUrl.searchParams.delete('apikey');
    manifest.push({ source: safeUrl.href, file: `assets/source/${file}`, sha256: hash(data), bytes: data.length });
    return `assets/source/${file}`;
  })();
  pending.set(url, task);
  return task;
}

async function rewriteCss(css, base, inAssets = true) {
  const matches = [...css.matchAll(/url\(\s*(['"]?)([^)'"\s]+)\1\s*\)/g)];
  for (const match of matches) {
    if (/^(data:|#)/.test(match[2])) continue;
    const local = await download(match[2], base);
    css = css.split(match[0]).join(`url("${inAssets ? path.basename(local) : local}")`);
  }
  return css;
}

async function rewriteDocument(document) {
  document.querySelectorAll('script:not([type="application/ld+json"]),link[rel="modulepreload"],link[as="fetch"]').forEach(e=>e.remove());
  document.querySelectorAll('style').forEach(style=>{
    if(style.textContent.includes('caret-color:transparent!important')||style.textContent.trim()==='.floating-expert{opacity:1!important;transform:none!important}')style.remove();
  });
  for (const link of document.querySelectorAll('link[href]')) {
    link.removeAttribute('crossorigin'); link.removeAttribute('integrity');
    if (['stylesheet','icon','shortcut icon','apple-touch-icon'].includes(link.rel)) link.setAttribute('href',await download(link.getAttribute('href')));
    else if (link.getAttribute('href').startsWith('/')) link.href=new URL(link.getAttribute('href'),origin).href;
  }
  for (const style of document.querySelectorAll('style')) style.textContent=await rewriteCss(style.textContent,origin,false);
  for (const element of document.querySelectorAll('img[src],source[src],video[poster]')) {
    const attr=element.hasAttribute('poster')?'poster':'src';
    element.setAttribute(attr,await download(element.getAttribute(attr)));
    element.removeAttribute('srcset');
  }
  for (const element of document.querySelectorAll('[style]')) {
    const value=element.getAttribute('style');
    if(value.includes('url(')) element.setAttribute('style',await rewriteCss(value,origin,false));
  }
  for (const anchor of document.querySelectorAll('a[href]')) {
    const href=anchor.getAttribute('href');
    if(href.startsWith('/'))anchor.href=new URL(href,origin).href;
  }
}

(async()=>{
  await fs.mkdir(assets,{recursive:true});
  const document=new JSDOM(await fs.readFile(path.join(capture,'reference.html'),'utf8')).window.document;
  await rewriteDocument(document);
  document.documentElement.lang='ru';
  document.body.style.removeProperty('overflow');
  document.querySelector('.site-header')?.classList.remove('site-header--scrolled');
  document.querySelector('.catalog-page-nav')?.classList.remove('catalog-page-nav--visible');
  // Splide's runtime widths are recalculated by the local interaction module.
  document.querySelectorAll('.splide__slide').forEach(e=>{e.style.removeProperty('width');e.style.removeProperty('margin-right')});
  const localStyle=document.createElement('link');localStyle.rel='stylesheet';localStyle.href='source-interactions.css';document.head.append(localStyle);
  const matrices=(await fs.readdir(capture)).filter(name=>/^matrix-\d+\.json$/.test(name));
  if(matrices.length){
    const states=[];
    for(const name of matrices){
      const data=JSON.parse(await fs.readFile(path.join(capture,name),'utf8'));
      const map=data.map;
      const capturedDocument=new JSDOM(await fs.readFile(path.join(capture,`reference-dom-${data.viewport}.html`),'utf8')).window.document;
      const canvas=capturedDocument.querySelector('.catalog-projects-map__canvas');
      const fragment=new JSDOM('<div id="map-snapshot">'+canvas.innerHTML+'</div>').window.document;
      await rewriteDocument(fragment);
      const tiles=[];
      for(const tile of map.tiles)tiles.push({src:await download(tile.src),left:parseFloat(tile.left),top:parseFloat(tile.top)});
      states.push({viewport:data.viewport,width:map.clientWidth,height:map.clientHeight,zoom:Number(map.zoom),transform:map.transform,tiles,markers:map.markers,html:fragment.querySelector('#map-snapshot').innerHTML});
    }
    states.sort((a,b)=>a.viewport-b.viewport);
    await fs.writeFile(path.join(output,'source-map-states.js'),'/* Captured source map views. Asset URLs are local; no API credentials. */\nwindow.BARNES_COMMERCIAL_MAP_STATES = '+JSON.stringify(states,null,2)+';\n');
    const mapScript=document.createElement('script');mapScript.src='source-map-states.js';mapScript.defer=true;document.body.append(mapScript);
  }
  const localScript=document.createElement('script');localScript.src='source-interactions.js';localScript.defer=true;document.body.append(localScript);
  // Snapshot coordinates at 1440px; preserve the same map centre on resize.
  const map=document.querySelector('.catalog-projects-map');
  if(map)map.dataset.captureWidth='1288';
  await fs.writeFile(path.join(output,'index.html'),'<!DOCTYPE html>\n'+document.documentElement.outerHTML+'\n');
  for(const name of ['menu','filters','callback']){
    const stateDocument=new JSDOM(await fs.readFile(path.join(capture,`state-${name}.html`),'utf8')).window.document;
    await rewriteDocument(stateDocument);
    const template=[...stateDocument.body.children].filter(e=>!['__nuxt','teleports'].includes(e.id)&&e.tagName!=='SCRIPT').map(e=>e.outerHTML).join('\n')+(stateDocument.querySelector('#teleports')?.innerHTML||'');
    if(!template.trim())throw new Error(`Missing opened source state: ${name}; recapture after hydration.`);
    await fs.writeFile(path.join(output,`source-${name}.html`),template+'\n');
    const node=document.createElement('template');node.id=`source-${name}`;node.innerHTML=template;document.body.append(node);
  }
  await fs.writeFile(path.join(output,'index.html'),'<!DOCTYPE html>\n'+document.documentElement.outerHTML+'\n');
  await fs.writeFile(path.join(output,'source-assets.json'),JSON.stringify({reference:origin+'/kommercheskaya-nedvizhimost/',capturedAt:new Date().toISOString(),assets:manifest.sort((a,b)=>a.file.localeCompare(b.file))},null,2)+'\n');
  console.log(`Imported source markup and ${manifest.length} local assets.`);
})().catch(e=>{console.error(e);process.exitCode=1});
