/** The standalone block and full page must use the same map/filter controllers. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_PATH || '/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const base=process.argv[2] || 'http://127.0.0.1:8785/';
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome'});const checks=[];
try{for(const width of [390,1440,2560]){
 const page=await browser.newPage({viewport:{width,height:1000}});
 await page.goto(new URL('blocks/map/',base).href,{waitUntil:'networkidle'});
 await page.locator('.catalog-projects-map__fullscreen').click();
 await page.locator('.map-browser').waitFor({state:'visible'});
 assert.equal(await page.locator('.map-browser__card').count(),32);
 const images=await page.locator('.map-browser__card img').evaluateAll(async imgs=>{
  imgs.forEach(i=>i.loading='eager');
  await Promise.all(imgs.map(i=>Promise.race([i.decode().catch(()=>{}),new Promise(r=>setTimeout(r,5000))])));
  return imgs.every(i=>i.naturalWidth&&i.currentSrc.startsWith(location.origin));
 });assert.equal(images,true);
 await page.locator('.map-browser__filter-toggle').click();
 await page.locator('.resort-filters').waitFor({state:'visible'});
 assert.equal(await page.locator('.resort-filters').evaluate(e=>e.classList.contains('hero-filter-modal--drawer')),true);
 await page.keyboard.press('Escape');await page.keyboard.press('Escape');
 await page.locator('.map-browser').waitFor({state:'hidden'});
 checks.push({width,localImages:32,sharedControllers:true,filters:true});
 console.log('PASS shared map '+width);await page.close();
}fs.writeFileSync(path.join(__dirname,'../verification/shared-map.json'),JSON.stringify({checks},null,2)+'\n');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
