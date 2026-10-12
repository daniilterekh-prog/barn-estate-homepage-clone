const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
(async()=>{
 const root=path.resolve(__dirname,'..'),base=new URL(process.argv[2]||'http://127.0.0.1:8126/');
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/google-chrome',args:['--no-sandbox']});
 const page=await browser.newPage();const errors=[],failed=[],external=[],rows=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400)failed.push({status:r.status(),path:new URL(r.url()).pathname});});
 await page.route('**/*',route=>{const u=new URL(route.request().url());if(/^https?:/.test(u.protocol)&&(!u.href.startsWith(base.origin+base.pathname))){external.push({type:route.request().resourceType(),origin:u.origin,path:u.pathname});return route.abort();}return route.continue();});
 try{
  for(const entry of ['index.html','mobile.html'])for(const width of [320,390,540,541,768,1024,1440,2560]){
   await page.setViewportSize({width,height:900});await page.goto(new URL(entry,base).href,{waitUntil:'load'});await page.evaluate(()=>document.fonts.ready);
   await page.evaluate(()=>document.querySelectorAll('img').forEach(i=>i.loading='eager'));
   await page.waitForFunction(()=>[...document.images].every(i=>i.complete));
   await page.waitForTimeout(800); // Let the existing carousel finish its initial layout.
   assert.equal(await page.locator('.catalog-grid__item').count(),16);
   assert.equal(await page.locator('.catalog-grid__item:not([hidden])').count(),4);
   const broken=await page.locator('img').evaluateAll(es=>es.filter(e=>!e.naturalWidth).map(e=>new URL(e.src).pathname));assert.deepEqual(broken,[]);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   assert.equal(await page.locator('.catalog-quick-filters__caption').first().textContent(),'Страна');
   assert.ok((await page.locator('.catalog-hero__image').evaluate(e=>e.currentSrc)).endsWith(width<=540?'hero-mobile-villa.png':'9783a5a60ad7ae44-be19a5749214443d45f5e54fdf0fdd03.png'));
   if(entry==='index.html'&&[390,1440].includes(width))await page.screenshot({path:'/tmp/international-after-package-'+width+'.png',fullPage:true});
   rows.push({entry,width,images:true,overflow:false,projects:4,lots:12,hero:true});console.log('PASS',entry,width);
  }
  for(const width of [390,1440]){
   await page.setViewportSize({width,height:900});await page.goto(new URL('index.html',base).href,{waitUntil:'load'});
   await page.locator('.catalog-mode-filters .catalog-quick-filters__button').first().click();assert.ok(await page.locator('.resort-quick-dropdown').isVisible());await page.keyboard.press('Escape');
   await page.locator('.catalog-hero-filters__filter-icon').click();assert.ok(await page.locator('.hero-filter-modal').isVisible());await page.keyboard.press('Escape');
   await page.locator('.catalog-mode-detailed-filters').click();assert.ok(await page.locator('.hero-filter-modal').isVisible());await page.keyboard.press('Escape');
   await page.locator('button[data-listing-mode=secondary]').click();assert.equal(await page.locator('.catalog-grid__item:not([hidden])').count(),12);
   await page.locator('.catalog-projects-map__fullscreen').click();assert.equal(await page.locator('.map-browser__card').count(),12);if(width<=540)await page.locator('.map-browser__handle').click();
   await page.locator('.map-browser__filter-toggle').click();assert.ok(await page.locator('.hero-filter-modal--drawer').isVisible());await page.keyboard.press('Escape');
   assert.ok(await page.locator('.map-browser').isVisible());await page.locator('[data-map-market=new-build]').click();assert.equal(await page.locator('.map-browser__card').count(),4);
   await page.locator('[data-map-zoom=in]').click();assert.match(await page.locator('.map-browser__backdrop img').getAttribute('style'),/1.25/);
   await page.keyboard.press('Escape');assert.equal(await page.locator('.catalog-grid__item:not([hidden])').count(),4);
   await page.locator('.catalog-grid__sort .resort-sort-trigger').click();assert.ok(await page.locator('.resort-quick-dropdown').isVisible());await page.keyboard.press('Escape');
   await page.locator('.catalog-grid__item:not([hidden]) .apartment-card__call-btn').first().click();assert.ok(await page.locator('.catalog-feedback-modal').isVisible());
   await page.locator('.catalog-feedback-modal button[data-channel=MAX]').click();assert.equal(await page.locator('.catalog-feedback-modal [name=preferredChannel]').inputValue(),'MAX');await page.keyboard.press('Escape');
   const faq=page.locator('.catalog-faq__question').first();await faq.click();assert.equal(await faq.getAttribute('aria-expanded'),'true');
   rows.push({width,quickDropdown:true,threeFullFilterEntrances:true,marketSync:true,map:true,callback:true,channel:true,faq:true});
  }
  assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);assert.deepEqual(external,[]);
  fs.writeFileSync(path.join(root,'verification/package.json'),JSON.stringify({base:base.href,rows,errors,failed,external},null,2)+'\n');
  console.log('PASS self-contained package; no external render dependencies');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
