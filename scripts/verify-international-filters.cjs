const assert=require('node:assert/strict');
const {chromium}=require('/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const page=await browser.newPage();
 const target=process.argv[2]||'http://127.0.0.1:8125/mezhdunarodnaya-nedvizhimost/';
 const triggers=['.catalog-hero-filters__filter-icon','.catalog-mode-detailed-filters'];
 try {
  for(const width of [320,390,768,1440,1920]){
   await page.setViewportSize({width,height:900});
   const geometry=[];
   for(const url of ['https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost',target]){
    await page.goto(url,{waitUntil:'networkidle'});
    await page.locator(triggers[0]).click();
    await page.waitForTimeout(300);
    geometry.push(await page.locator('.hero-filter-modal__dialog').evaluate(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return {width:r.width,height:r.height,background:s.backgroundColor,font:s.fontFamily};}));
    await page.locator('.hero-filter-modal__dialog').screenshot({path:'/tmp/international-filter-'+(url===target?'copy':'original')+'-'+width+'.png'});
    await page.keyboard.press('Escape');
   }
   assert.deepEqual(geometry[0],geometry[1]);
   for(const selector of triggers){
    await page.locator(selector).click();
    assert.equal(await page.locator('.hero-filter-modal').count(),1);
    assert.equal(await page.locator(selector).getAttribute('aria-expanded'),'true');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.hero-filter-modal').count(),0);
    assert.equal(await page.locator(selector).getAttribute('aria-expanded'),'false');
   }
   await page.locator(triggers[1]).click();
   await page.locator('.hero-filter-modal .ui-checkbox').first().click();
   await page.locator('.hero-filter-modal__apply').click();
   assert.equal(await page.locator('.hero-filter-modal').count(),0);
   await page.locator(triggers[0]).click();
   assert.equal(await page.locator('.hero-filter-modal input[type="checkbox"]').first().isChecked(),true);
   await page.locator('.hero-filter-modal__reset').click();
   assert.equal(await page.locator('.hero-filter-modal input:checked').count(),0);
   await page.locator('.hero-filter-modal__apply').click();
   console.log('PASS',width,'original geometry; hero/listing/map; apply/reset/state');
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
