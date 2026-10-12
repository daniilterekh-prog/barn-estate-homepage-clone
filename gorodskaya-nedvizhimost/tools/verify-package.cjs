/** Verify only the copied city folder served as HTTP document root. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const root=path.resolve(__dirname,'..'),base=process.argv[2]||'http://127.0.0.1:4187/';
const report={base,checks:[],errors:[],externalResources:[],missingResources:[],parity:[]};
function observe(page){
 page.on('pageerror',e=>report.errors.push(e.message));
 page.on('request',r=>{if(r.url().startsWith('http')&&!r.url().startsWith(new URL(base).origin))report.externalResources.push(r.url())});
 page.on('response',r=>{if(r.status()>=400)report.missingResources.push(r.url()+' '+r.status())});
}
async function images(page){
 return page.evaluate(async()=>{
  const all=[...document.images];all.forEach(i=>i.loading='eager');
  await Promise.all(all.map(i=>Promise.race([i.decode().catch(()=>{}),new Promise(r=>setTimeout(r,5000))])));
  return{overflow:document.documentElement.scrollWidth>innerWidth+1,broken:all.filter(i=>!i.naturalWidth).map(i=>i.src)};
 });
}
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome'});
 try{
  for(const width of[320,390,540,541,768,1024,1440,1920,2560]){
   const page=await browser.newPage({viewport:{width,height:900}});observe(page);
   await page.goto(base,{waitUntil:'networkidle'});await page.waitForSelector('.city-reference-synced',{state:'attached'});
   await page.evaluate(()=>document.fonts.ready);
   let data=await images(page);assert.deepEqual(data.broken,[]);assert.equal(data.overflow,false);
   assert.equal(await page.locator('.catalog-mode-filters button').count(),4);
   await page.locator('.site-header__icon-btn').click();await page.locator('.site-menu').waitFor({state:'visible'});
   assert.deepEqual((await images(page)).broken,[]);await page.keyboard.press('Escape');assert.equal(await page.locator('.site-menu').count(),0);
   const faq=page.locator('.catalog-faq__question').first();await faq.click();assert.equal(await faq.getAttribute('aria-expanded'),'true');await faq.click();
   const news=page.locator('.news-section .splide__list'),newsNext=page.locator('.news-section__nav-btn').nth(1);
   if(await newsNext.isVisible()){
     const before=await news.getAttribute('style');await newsNext.click();assert.notEqual(await news.getAttribute('style'),before);
     await page.locator('.news-section__nav-btn').first().click();
   }
   await page.locator('.catalog-projects-map__fullscreen').click();await page.locator('.map-browser').waitFor({state:'visible'});
   if(width<=540)await page.locator('.map-browser__handle').click();
   assert.equal(await page.locator('.map-browser__card').count(),4);
   await page.locator('[data-map-market=secondary]').click();assert.equal(await page.locator('.map-browser__card').count(),12);
   await page.locator('.map-browser__filter-toggle').click();await page.locator('.hero-filter-modal--drawer').waitFor({state:'visible'});
   await page.keyboard.press('Escape');assert.equal(await page.locator('.map-browser').isVisible(),true);await page.keyboard.press('Escape');
   await page.locator('.floating-expert__card').click();await page.locator('.catalog-feedback-modal').waitFor({state:'visible'});
   assert.deepEqual((await images(page)).broken,[]);await page.keyboard.press('Escape');
   const geometry=await page.evaluate(()=>Object.fromEntries(['.catalog-hero','.catalog-best-offers','.catalog-grid','.catalog-mode-toolbar','.catalog-intro','.catalog-consultation','.catalog-contact','.site-footer'].map(s=>{const e=document.querySelector(s),r=e.getBoundingClientRect();return[s,{width:r.width,height:r.height,top:r.y+scrollY}]})));
   report.checks.push({entry:'index.html',width,...data,geometry});
   console.log('PASS autonomous page',width);await page.close();
  }
  const manifest=JSON.parse(fs.readFileSync(path.join(root,'blocks/manifest.json')));
  for(const block of manifest.blocks)for(const width of[390,1440]){
   const page=await browser.newPage({viewport:{width,height:1000}});observe(page);
   await page.goto(new URL('blocks/'+block.path+'/',base).href,{waitUntil:'networkidle'});
   await page.waitForSelector('[data-preview-ready=true]',{state:'attached'});
   await page.evaluate(()=>document.fonts.ready);
   const data=await images(page);assert.deepEqual(data.broken,[],block.id);assert.equal(data.overflow,false,block.id);
   report.checks.push({entry:'blocks/'+block.path,width,...data});console.log('PASS preview',block.id,width);
   await page.close();
  }
  assert.deepEqual([...new Set(report.errors)],[]);assert.deepEqual([...new Set(report.externalResources)],[]);assert.deepEqual([...new Set(report.missingResources)],[]);
 }finally{await browser.close();fs.writeFileSync(path.join(root,'verification/package.json'),JSON.stringify(report,null,2)+'\n')}
})().catch(e=>{console.error(e);process.exitCode=1});
