/* Capture only the public map-filter drawer, without cookies or application state. */
const fs=require('node:fs/promises');
const {chromium}=require('/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  await page.goto('https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost',{waitUntil:'networkidle'});
  await page.locator('.catalog-projects-map__fullscreen').click();
  await page.locator('.catalog-projects-map__panel-filter').click();
  const html=await page.locator('.hero-filter-modal--drawer').evaluate(e=>e.outerHTML);
  await fs.writeFile('mezhdunarodnaya-nedvizhimost/map-filters-template.html',html+'\n');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
