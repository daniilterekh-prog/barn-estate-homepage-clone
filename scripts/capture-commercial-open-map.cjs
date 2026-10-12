const fs=require('node:fs/promises');
const path=require('node:path');
const {chromium}=require('/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
(async()=>{
 const root=path.resolve(__dirname,'../kommercheskaya-nedvizhimost');
 const clean=process.argv.includes('--clean-background');
 const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 try{
  const captures=[];
  for(const width of clean?[1440]:[320,390,540,768,1440,1920]){
   const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
   await page.goto('https://front.barnes.vsavr.ru/kommercheskaya-nedvizhimost/',{waitUntil:'load'});
   await page.locator('.catalog-projects-map__fullscreen').click();
   await page.waitForTimeout(1400);
   await page.evaluate(()=>document.fonts.ready);
   if(width===1440&&!clean){
    const data=await page.locator('.catalog-projects-map').evaluate(map=>{
     const clone=map.cloneNode(true);clone.querySelector('.catalog-projects-map__canvas').innerHTML='<img class="commercial-open-map-image" alt="Карта Москвы — статичный снимок Яндекс Карт">';
     clone.classList.add('commercial-map-open');
     function rules(list){return [...list].map(rule=>{
      if(rule.selectorText){if(!/catalog-projects-map|catalog-quick-filters/.test(rule.selectorText))return '';return rule.selectorText.split(',').map(s=>'html body .commercial-map-surface '+s.trim().replace(/:-webkit-full-screen|:fullscreen/g,'.commercial-map-open')).join(',')+'{'+rule.style.cssText+'}';}
      if(rule.cssRules){const inner=rules(rule.cssRules);return inner?rule.cssText.slice(0,rule.cssText.indexOf('{')+1)+inner+'}':'';}return '';
     }).filter(Boolean).join('\n');}
     return {html:clone.outerHTML,css:[...document.styleSheets].map(sheet=>{try{return rules(sheet.cssRules)}catch{return ''}}).join('\n')};
    });
    if(/apikey|https:\/\/core-renderer/.test(data.html))throw Error('Do not persist map API credentials');
    await fs.writeFile(path.join(root,'open-map-template.js'),'window.CommercialOpenMapTemplate = '+JSON.stringify(data.html)+';\n');
    await fs.writeFile(path.join(root,'open-map-source.css'),data.css+'\n');
   }
   await page.addStyleTag({content:'.catalog-projects-map__panel,.catalog-projects-map__exit,.catalog-projects-map__controls{visibility:hidden!important}'});
   if(clean)await page.addStyleTag({content:'.ymaps3--controls{visibility:hidden!important}'});
   const file=`assets/open-map-${width}.png`;
   await page.locator('.catalog-projects-map__canvas').screenshot({path:path.join(root,file)});
   captures.push({width,height:900,file});await page.close();
  }
  if(!clean)await fs.writeFile(path.join(root,'open-map-capture.json'),JSON.stringify({source:'https://front.barnes.vsavr.ru/kommercheskaya-nedvizhimost/',capturedAt:new Date().toISOString(),status:'Static source map at initial fullscreen state, 0 matches; no API keys or invented listings',captures},null,2)+'\n');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
