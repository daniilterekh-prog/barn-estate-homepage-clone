const fs=require('node:fs/promises'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const results=[];try{
 for(const width of [390,1440,2560]){
  const samples=[];
  for(const [kind,url]of[['reference','https://daniilterekh-prog.github.io/barn-estate-homepage-clone/kurortnaya/'],['local','file://'+path.resolve(__dirname,'../kommercheskaya-nedvizhimost/index.html')]]){
   const page=await browser.newPage({viewport:{width,height:900}});await page.goto(url,{waitUntil:'load'});
   if(kind==='local')await page.waitForFunction(()=>document.body.dataset.commercialReferenceReady);
   await page.waitForSelector('.resort-quick-dropdown',{state:'attached'});
   await page.locator('.catalog-mode-filters .catalog-quick-filters__button').nth(kind==='reference'?2:1).click();
   await page.evaluate(()=>document.fonts.ready);
   samples.push(await page.locator('.resort-quick-dropdown').evaluate(root=>[root,root.querySelector('.catalog-quick-filters__dropdown-header'),root.querySelector('.catalog-quick-filters__option')].map(e=>{const s=getComputedStyle(e);return{font:s.fontFamily,size:s.fontSize,weight:s.fontWeight,line:s.lineHeight,padding:s.padding,border:s.border,background:s.backgroundColor,shadow:s.boxShadow,minHeight:s.minHeight};})));
   await page.close();
  }
  assert.deepEqual(samples[1],samples[0],`Shared menu styles at ${width}`);results.push({width,matched:true,styles:samples[1]});console.log('MATCH shared menu',width);
 }
 await fs.writeFile(path.resolve(__dirname,'../kommercheskaya-nedvizhimost/reference-sync-verification.json'),JSON.stringify({source:'https://daniilterekh-prog.github.io/barn-estate-homepage-clone/kurortnaya/',sourceCommit:'ff101ce',verifiedAt:new Date().toISOString(),scope:'shared price dropdown computed typography/frame/colors; not whole-page pixel equality',results},null,2)+'\n');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
