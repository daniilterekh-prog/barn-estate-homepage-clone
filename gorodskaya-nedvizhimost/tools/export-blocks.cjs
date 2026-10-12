/** Export the current city components, never resort business data. */
const fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const root=path.resolve(__dirname,'..'),base=process.argv[2]||'http://127.0.0.1:4187/';
const blocks=[['header','.layout__header'],['sticky-nav','.catalog-sticky'],['hero','.catalog-hero'],['start-sales','.catalog-best-offers'],['map','.catalog-map'],['listing','.catalog-grid'],['brand-intro','.catalog-intro'],['cta-central','.catalog-consultation'],['directions','.departments-section'],['news','.news-section'],['faq','.catalog-faq'],['cta-bottom','.catalog-contact'],['footer','.site-footer'],['floating-expert','.floating-expert'],['request-modal','.catalog-feedback-modal'],['filters-modal','.resort-filters'],['quick-filter-dropdowns','.resort-quick-dropdown'],['card-start-sales','.launch-card'],['card-project','[data-listing-mode=project] .apartment-card'],['card-lot','[data-listing-mode=lot] .apartment-card'],['map-panel','.map-browser']];
const write=(file,text)=>{fs.mkdirSync(path.dirname(path.join(root,file)),{recursive:true});fs.writeFileSync(path.join(root,file),text)};
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome'});
 try{
  for(const [view,width]of [['fragment',1440],['mobile',390]]){
   const page=await browser.newPage({viewport:{width,height:900}});
   await page.goto(base);await page.waitForSelector('.city-reference-synced',{state:'attached'});
   await page.evaluate(()=>document.fonts.ready);
   await page.locator('.catalog-mode-filters button').nth(1).click();
   const fragments=await page.evaluate(blocks=>{
     function normalize(node){
       const el=node.cloneNode(true);
       el.querySelectorAll('[src]').forEach(image=>{const url=new URL(image.getAttribute('src'),location.href);if(url.origin===location.origin)image.setAttribute('src','../../'+url.pathname.replace(/^\//,''));});
       if(el.hasAttribute('src'))el.setAttribute('src','../../'+new URL(el.getAttribute('src'),location.href).pathname.replace(/^\//,''));
       el.querySelectorAll('[id]').forEach(n=>{if(n.id.startsWith('splide'))n.removeAttribute('id')});
       el.removeAttribute('hidden');
       if(el.classList.contains('resort-quick-dropdown'))el.removeAttribute('style');
       if(el.classList.contains('catalog-sticky')){el.removeAttribute('inert');el.setAttribute('aria-hidden','false');el.classList.add('catalog-sticky--visible')}
       return el.outerHTML;
     }
     return blocks.map(([id,s])=>{const e=document.querySelector(s);return{id,html:e?normalize(e):''}});
   },blocks);
   for(const block of fragments){if(!block.html)throw Error('Missing block '+block.id);write('blocks/'+block.id+'/'+view+'.html',block.html)}
   await page.close();
  }
  const css=['document-desktop','node-ui','node-listing','node-launch','node-city','owner-header','owner-footer','filters-source','filters-modal','quick-filters','brand-filters','city-map-fullscreen','portable'];
  for(const [id]of blocks){
   write('blocks/'+id+'/styles.css',css.map(file=>'@import url("../../css/'+file+'.css");').join('\n')+'\n');
   write('blocks/'+id+'/block.json',JSON.stringify({id:'city-'+id,desktop:'fragment.html',mobile:'mobile.html',styles:'styles.css',assets:'../../assets/',runtime:'../_shared/preview.js',data:'Moscow city snapshot; no API'},null,2)+'\n');
   write('blocks/'+id+'/README.md','# '+id+'\n\nГородской компонент, экспортированный из текущей страницы. fragment.html / mobile.html — итоговый DOM; page-desktop.html / page-mobile.html (если есть) — источник сборки целой страницы. Не применять адаптер повторно к итоговому DOM. Ассеты и CSS находятся внутри этого узла; для переноса сохранить структуру. Боевые формы и данные подключаются хостом.\n');
   write('blocks/'+id+'/index.html','<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="styles.css"><body class="city-node-ready barnes-header-template" data-city-preview="'+id+'"><main id="preview"></main><script src="../_shared/preview.js"></script></body></html>');
  }
  write('blocks/manifest.json',JSON.stringify({node:'city',blocks:blocks.map(([id])=>({id:'city-'+id,path:id}))},null,2)+'\n');
  write('blocks/catalog.html','<!doctype html><html lang="ru"><meta charset="utf-8"><title>Городская — блоки</title><h1>Городская: самостоятельные блоки</h1><ul>'+blocks.map(([id])=>'<li><a href="'+id+'/">'+id+'</a></li>').join('')+'</ul></html>');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
