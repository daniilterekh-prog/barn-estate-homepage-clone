/** One-time mechanical migration of the original city snapshot into an autonomous folder. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const repo=path.resolve(__dirname,'..'),root=path.join(repo,'gorodskaya-nedvizhimost');
const origin=process.env.CITY_CAPTURE_BASE||'http://127.0.0.1:4186/';
if(fs.existsSync(path.join(root,'templates/desktop.html')))throw Error('Migration already completed; use tools/build-page.cjs.');
const write=(file,data)=>{const target=path.join(root,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,data)};
const hash=b=>crypto.createHash('sha256').update(b).digest('hex').slice(0,16);
const manifest=[],copied=new Map(),localFiles=new Map();
function asset(url,base){
  if(!url||url.startsWith('data:')||url.startsWith('#'))return url;
  const absolute=new URL(url,base);
  if(absolute.origin!==new URL(origin).origin)throw Error('Remote render asset: '+absolute.href);
  const source=path.join(repo,decodeURIComponent(absolute.pathname));
  if(!fs.existsSync(source)||!fs.statSync(source).isFile())throw Error('Missing source '+source);
  const bytes=fs.readFileSync(source),digest=hash(bytes);
  if(copied.has(digest))return copied.get(digest);
  const name=path.basename(source),ext=path.extname(name);
  const destination=/\.woff2?$/.test(ext)?'assets/fonts/'+name:['city-map-preview.png','cta-ruslan-unified-v1.webp'].includes(name)?'assets/'+name:'assets/'+digest+ext;
  write(destination,bytes);copied.set(digest,destination);localFiles.set(destination,source);
  manifest.push({file:destination,source:path.relative(repo,source),sha256:crypto.createHash('sha256').update(bytes).digest('hex')});
  return destination;
}
function cssURLs(css,base,relative='../'){
  return css.replace(/url\(\s*(['"]?)([^)'"]+)\1\s*\)/g,(_,quote,url)=>{
    if(url.startsWith('data:')||url.startsWith('#'))return 'url('+quote+url+quote+')';
    return 'url("'+relative+asset(url,base)+'")';
  });
}
const sections=[['header','.layout__header'],['hero','.catalog-hero'],['start-sales','.catalog-best-offers'],['map','.catalog-map'],['listing','.catalog-grid'],['brand-intro','.catalog-intro'],['cta-central','.catalog-consultation'],['directions','.departments-section'],['news','.news-section'],['faq','.catalog-faq'],['cta-bottom','.catalog-contact'],['footer','.site-footer'],['floating-expert','.floating-expert']];
async function capture(browser,view,width){
 const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
 await page.route(/node-(reference|modal)\.js/,route=>route.fulfill({status:200,body:'/* captured before adapters */',contentType:'text/javascript'}));
 await page.goto(new URL('gorodskaya-nedvizhimost/',origin).href,{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>{const n=document.querySelector('#__nuxt')?.__vue_app__?.$nuxt;return n&&!n.isHydrating;});
 await page.evaluate(()=>document.fonts.ready);
 const data=await page.evaluate(()=>{
   document.querySelectorAll('.catalog-projects-map__canvas').forEach(e=>{e.innerHTML='<img class="city-static-map" src="assets/city-map-preview.png" alt="Карта расположения объектов в Москве — статичный предпросмотр">';});
   document.querySelectorAll('script,link[rel=modulepreload],link[rel=preload],base,meta[http-equiv]').forEach(e=>e.remove());
   // Keep document styles; stylesheet URLs are resolved by the packager.
   document.querySelectorAll('img').forEach(e=>{e.src=e.currentSrc||e.src;e.loading='eager';});
   document.querySelectorAll('source').forEach(e=>{e.removeAttribute('srcset')});
   document.querySelectorAll('img[srcset]').forEach(e=>e.removeAttribute('srcset'));
   document.querySelectorAll('[style]').forEach(e=>{
     if(e.matches('.splide__list'))e.style.transform='';
   });
   return {html:document.documentElement.outerHTML,styles:[...document.querySelectorAll('style')].map(e=>e.textContent),sheets:[...document.querySelectorAll('link[rel=stylesheet]')].map(e=>e.href)};
 });
 const html=await page.evaluate(async({sections})=>{
   const result=[];
   sections.forEach(([id,selector])=>{
     const element=document.querySelector(selector);
     if(!element)return;
     const fragment=element.outerHTML;const comment=document.createComment(' BARNES:'+id+' ');
     element.replaceWith(comment);result.push({id,fragment});
   });
   document.querySelectorAll('style,link[rel=stylesheet]').forEach(e=>e.remove());
   document.querySelectorAll('script,link[rel=modulepreload],link[rel=preload],base').forEach(e=>e.remove());
   const style=document.createElement('link');style.rel='stylesheet';style.href='css/document-'+(innerWidth<=540?'mobile':'desktop')+'.css';document.head.append(style);
   return {shell:'<!DOCTYPE html>\n'+document.documentElement.outerHTML,blocks:result};
 },{sections});
 const base=page.url();
 let css=cssURLs(data.styles.join('\n'),base,'../');
 for(const url of data.sheets){
   if(/node-(ui|listing|launch|city)\.css|owner-header\.css/.test(url))continue;
   if(new URL(url).origin!==new URL(origin).origin)continue;
   const source=path.join(repo,new URL(url).pathname);
   css+='\n'+cssURLs(fs.readFileSync(source,'utf8'),url,'../');
 }
 write('css/document-'+view+'.css',css);
 function localize(markup){
   return markup.replace(/\bsrc="([^"]+)"/g,(_,url)=>'src="'+(url==='assets/city-map-preview.png'?url:asset(url,base))+'"')
     .replace(/\b(?:href)="([^"]+)"/g,(match,url)=>{
       if(/css\/document/.test(url)||/^(?:https?:|mailto:|tel:|#|javascript:)/.test(url))return match;
       if(/\.ico|\.svg|\.png$/.test(url))return 'href="'+asset(url,base)+'"';
       return 'href="'+new URL(url,base).href.replace(new URL(origin).origin,'https://barn-estate.ru')+'"';
     }).replace(/url\((['"]?)([^)'"]+)\1\)/g,(_,q,url)=>url.startsWith('data:')?'url('+q+url+q+')':'url("'+asset(url,base)+'")');
 }
 html.shell=localize(html.shell).replace('</head>','<link rel="stylesheet" href="css/node-ui.css"><link rel="stylesheet" href="css/node-listing.css"><link rel="stylesheet" href="css/node-launch.css"><link rel="stylesheet" href="css/node-city.css"><link rel="stylesheet" href="css/owner-header.css"></head>')
   .replace('</body>','<script src="js/bootstrap.js"></script></body>');
 write('templates/'+view+'.html',html.shell);
 for(const block of html.blocks)write('blocks/'+block.id+'/page-'+view+'.html',localize(block.fragment));
 await page.close();
}
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true});
 try{
   // Visual and geometry control of the original rendered adapters.
   const baseline=[];
   for(const width of [390,768,1440,2560]){
     const p=await browser.newPage({viewport:{width,height:900}});
     await p.goto(new URL('gorodskaya-nedvizhimost/',origin).href,{waitUntil:'domcontentloaded'});
     await p.waitForSelector('.city-reference-synced',{state:'attached'});await p.evaluate(()=>document.fonts.ready);
     await p.screenshot({path:'/tmp/city-before-package-'+width+'.png',fullPage:true});
     baseline.push({width,data:await p.evaluate(()=>Object.fromEntries(['.catalog-hero','.catalog-best-offers','.catalog-grid','.catalog-mode-toolbar','.catalog-intro','.catalog-consultation','.catalog-contact','.site-footer'].map(s=>{const e=document.querySelector(s),r=e.getBoundingClientRect();return[s,{width:r.width,height:r.height,top:r.y+scrollY}]})))});
     await p.close();
   }
   write('verification/baseline.json',JSON.stringify(baseline,null,2)+'\n');
   await capture(browser,'desktop',1440);await capture(browser,'mobile',390);
   // Move only current adapters; CSS source URL resolution remains document-independent.
   for(const name of fs.readdirSync(root).filter(name=>/\.(?:css|js)$/.test(name))){
     let text=fs.readFileSync(path.join(root,name),'utf8');
     if(name.endsWith('.css'))text=cssURLs(text,new URL('gorodskaya-nedvizhimost/'+name,origin).href,'../');
     if(name==='node-reference.js'){
       text=text.replace("new URL('../kurortnaya/', document.baseURI)","new URL('./', document.baseURI)");
       text=text.replace("new URL('node-launch.js?v=1',document.baseURI)","new URL('js/node-launch.js',document.baseURI)");
       text=text.replace("new URL(file+'?v=20261012-district-label-1',document.baseURI)","new URL('js/'+file,document.baseURI)");
       text=text.replace("new URL('city-map-projects.js?v=20261012-1',document.baseURI)","new URL('js/city-map-projects.js',document.baseURI)");
       text=text.replace("new URL('city-map-fullscreen.js?v=20261012-district-label-1',document.baseURI)","new URL('js/city-map-fullscreen.js',document.baseURI)");
       text=text.replace(/  \/\/ Decorate only after Nuxt[\s\S]*?\n\}\)\(\);/,"  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialize,{once:true});else initialize();\n})();");
       for(const icon of ['header-whatsapp.svg','header-max.svg','header-telegram.svg']){
         const target=asset('../kurortnaya/assets/'+icon,new URL('gorodskaya-nedvizhimost/',origin));
         text=text.replaceAll(icon,path.basename(target));
       }
     }
     if(name==='city-map-projects.js'){
       const matches=[...text.matchAll(/"image":\s*"([^"]+)"/g)];
       for(const match of matches)text=text.replace(match[1],'../'+asset(match[1],new URL('gorodskaya-nedvizhimost/',origin)));
     }
     if(name==='footer-template.js')text=text.replace(/\/prodazha_sobstvennikam\/assets\/logo.svg/g,asset('../prodazha_sobstvennikam/assets/logo.svg',new URL('gorodskaya-nedvizhimost/',origin)));
     if(name==='city-reference-extras.js')text=text.replace("new URL('owner-footer.css?v=20261012-reference-sync-1', base)","new URL('../css/owner-footer.css', base)");
     if(name==='city-map-fullscreen.js')text=text.replace("new URL('assets/city-map-preview.png', assetsBase)","new URL('../assets/city-map-preview.png', assetsBase)");
     text=text.replace(/new URL\('([^']+\.css)(?:\?[^']*)?', (base|assetsBase)\)/g,"new URL('../css/$1', $2)");
     write((name.endsWith('.css')?'css/':'js/')+name,text);
   }
   // All actually used CSS resources, including shared header and fallback backgrounds.
   const header=fs.readFileSync(path.join(repo,'shared/owner-header.css'),'utf8');
   write('css/owner-header.css',cssURLs(header,new URL('shared/owner-header.css',origin),'../'));
   // Prompt documentation is provenance, not an obsolete bitmap version.
   write('assets/manifest.json',JSON.stringify(manifest,null,2)+'\n');
   const inventory=[];
   function files(directory){for(const entry of fs.readdirSync(directory,{withFileTypes:true})){const target=path.join(directory,entry.name);if(entry.isDirectory())files(target);else inventory.push(path.relative(root,target));}}
   files(root);write('verification/migration-inventory.json',JSON.stringify({files:inventory,assetCount:manifest.length},null,2)+'\n');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
