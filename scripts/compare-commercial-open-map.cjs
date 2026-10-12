const fs=require('node:fs/promises'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const results=[];try{
 for(const width of [320,390,540,768,1440,1920]){
  const captures=[];
  for(const [kind,url] of [['source','https://front.barnes.vsavr.ru/kommercheskaya-nedvizhimost/'],['local','file://'+path.resolve(__dirname,'../kommercheskaya-nedvizhimost/index.html')]]){
   const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});await page.goto(url,{waitUntil:'load'});if(kind==='local')await page.waitForFunction(()=>document.querySelector('.commercial-map-surface'));
   await page.locator('.catalog-projects-map__fullscreen').first().click();await page.evaluate(()=>document.fonts.ready);
   if(width<=540)await page.locator('.catalog-projects-map__panel-handle').click();
   await page.waitForTimeout(350);
   captures.push(await page.locator('.catalog-projects-map__panel').evaluate(panel=>[panel,...panel.querySelectorAll('input,button,p,.catalog-quick-filters__label,.catalog-quick-filters__value')].map(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return{class:e.className,x:r.x,y:r.y,width:r.width,height:r.height,fontSize:s.fontSize,fontWeight:s.fontWeight,lineHeight:s.lineHeight,padding:s.padding};})));
   await page.close();
  }
  const matched=JSON.stringify(captures[0])===JSON.stringify(captures[1]);results.push({width,matched,source:captures[0],local:captures[1]});console.log(width,matched?'MATCH':'DIFF');
 }
 await fs.writeFile(path.resolve(__dirname,'../kommercheskaya-nedvizhimost/open-map-verification.json'),JSON.stringify({source:'https://front.barnes.vsavr.ru/kommercheskaya-nedvizhimost/',surface:'panel geometry and typography; expanded mobile sheet; not whole-map pixel equality or live API',verifiedAt:new Date().toISOString(),results},null,2)+'\n');
 assert.ok(results.every(r=>r.matched),'Source panel geometry and typography');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
