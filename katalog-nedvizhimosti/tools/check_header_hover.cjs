/* Mouse hover must work even when the browser reports a primary touch device. */
const {chromium}=require(process.env.BARNES_PLAYWRIGHT_MODULE||'/home/daniil/.local/share/codex-toolkit/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const base=process.env.BARNES_CATALOG_URL||'http://127.0.0.1:8921/katalog-nedvizhimosti/';
const proof=process.env.BARNES_PROOF_DIR||'/tmp/catalog-header-hover';fs.mkdirSync(proof,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true});
 const report={base,checks:[],layouts:[],errors:[],http:[]};
 const pass=name=>{report.checks.push(name);console.log('PASS',name)};
 try{
  for(const hasTouch of [false,true]){
   const page=await browser.newPage({viewport:{width:1440,height:1000},hasTouch,reducedMotion:'reduce'});
   page.on('pageerror',e=>report.errors.push(e.message));page.on('response',r=>{if(r.status()>=400)report.http.push(r.status()+' '+r.url())});
   const go=async()=>{await page.goto(base+'?direction=international');await page.waitForFunction(()=>window.BarnesCatalogListing?.getSnapshot().ready);await page.evaluate(()=>document.fonts.ready)};
   await go();const sections=await page.locator('#catalog-header-navigation').textContent().then(JSON.parse);
   const popup=page.locator('#catalog-header-dropdown'),nav=page.locator('.catalog-global-nav');
   for(const width of [768,1024,1440,1920]){
    await page.setViewportSize({width,height:1000});await go();
    for(let i=0;i<sections.length;i++){
     const trigger=nav.locator('.site-header__nav-link').nth(i);await trigger.hover();
     assert.ok(await popup.isVisible(),`${hasTouch}/${width}/${i}`);assert.equal(await trigger.getAttribute('aria-expanded'),'true');
     assert.equal(await popup.getAttribute('aria-labelledby'),await trigger.getAttribute('id'));
     assert.deepEqual(await popup.locator('a').evaluateAll(es=>es.map(e=>e.href)),sections[i].links.map(e=>new URL(e.href).href));
     const box=await popup.boundingBox(),viewport=await page.evaluate(()=>document.documentElement.clientWidth);
     assert.ok(box.x>=21&&box.x+box.width<=viewport-21);assert.ok(box.y>=0&&box.y+box.height<=1000);
     report.layouts.push({hasTouch,width,section:sections[i].label});
    }
   }
   pass(`${hasTouch?'hybrid':'mouse'}: 36 section/width hovers open correct links without a click`);
   await page.setViewportSize({width:1440,height:1000});await go();const first=nav.locator('.site-header__nav-link').first();
   await first.hover();await popup.locator('a').first().hover();await page.waitForTimeout(260);assert.ok(await popup.isVisible());
   await page.mouse.move(20,300);await popup.waitFor({state:'hidden'});pass(`${hasTouch?'hybrid':'mouse'}: pointer can enter the list; leaving closes it`);
   await first.focus();assert.ok(await popup.isVisible());await page.keyboard.press('ArrowDown');assert.ok(await popup.locator('a').first().evaluate(e=>e===document.activeElement));
   await page.keyboard.press('End');assert.ok(await popup.locator('a').last().evaluate(e=>e===document.activeElement));await page.keyboard.press('Escape');
   assert.equal(await popup.isVisible(),false);assert.ok(await first.evaluate(e=>e===document.activeElement));pass(`${hasTouch?'hybrid':'mouse'}: keyboard open, navigation, Escape and focus`);
   await page.evaluate(()=>scrollTo(0,120));await page.waitForFunction(()=>document.querySelector('.site-header--scrolled'));
   await nav.locator('.site-header__nav-link').nth(6).hover();assert.ok(await popup.isVisible());
   await page.locator('.site-header__icon-btn').click();assert.equal(await popup.isVisible(),false);await page.keyboard.press('Escape');
   pass(`${hasTouch?'hybrid':'mouse'}: sticky header hover and burger close`);
   // Intercept top-level navigation so the test never visits the external site.
   await page.route('https://barn-estate.ru/**',r=>r.fulfill({status:200,contentType:'text/html',body:'<p>Navigation fixture</p>'}));
   await go();await first.hover();await first.click();await page.waitForURL(sections[0].href);pass(`${hasTouch?'hybrid':'mouse'}: mouse click still follows the section URL`);
   if(hasTouch){
    await go();await first.tap();assert.ok(page.url().startsWith(base));assert.ok(await popup.isVisible());
    await first.tap();await page.waitForURL(sections[0].href);pass('touch: first tap opens, second tap follows the section URL');
    await page.setViewportSize({width:390,height:900});await go();assert.equal(await nav.isVisible(),false);
    await page.locator('.site-header__icon-btn').tap();assert.ok(await page.locator('.site-menu').isVisible());await page.keyboard.press('Escape');assert.equal(await page.locator('.site-menu').count(),0);pass('phone burger and Escape remain functional');
   }else{
    await go();await nav.locator('.site-header__nav-link').nth(6).hover();await page.screenshot({path:proof+'/media-hover-1440.png'});
   }
   await page.close();
  }
  assert.deepEqual(report.errors,[]);assert.deepEqual(report.http,[]);report.passed=true;
 }finally{fs.writeFileSync(proof+'/hover.json',JSON.stringify(report,null,2));await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
