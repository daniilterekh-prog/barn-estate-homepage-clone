const assert=require('node:assert/strict');
const fs=require('node:fs');
const {PNG}=require('/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/pngjs');
const {chromium}=require('/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
(async()=>{
 const pixelmatch=(await import('/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/pixelmatch/index.js')).default;
 const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const page=await browser.newPage();
 const url=process.argv[2]||'http://127.0.0.1:8125/mezhdunarodnaya-nedvizhimost/';
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  for(const width of [320,390,768,1024,1440,1920]){
   await page.setViewportSize({width,height:900});const pair=[];
   for(const [name,address] of [['original','https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost'],['copy',url]]){
    await page.goto(address,{waitUntil:'networkidle'});await page.locator('.catalog-projects-map__fullscreen').click();
    await page.locator(name==='original'?'.catalog-projects-map__panel-filter':'.map-browser__filter-toggle').click();await page.waitForTimeout(350);
    pair.push(await page.locator('.hero-filter-modal--drawer').evaluate(root=>['.hero-filter-modal__dialog','.hero-filter-modal__header','.hero-filter-modal__body','.hero-filter-modal__footer','.hero-filter-panel-content__title','.ui-checkbox__label','.hero-filter-modal__apply'].map(selector=>{const e=root.querySelector(selector),r=e.getBoundingClientRect(),s=getComputedStyle(e);return {selector,width:r.width,height:r.height,font:s.fontSize,weight:s.fontWeight,padding:s.padding,background:s.backgroundColor,color:s.color};})));
    await page.locator('.hero-filter-modal__dialog').screenshot({path:'/tmp/international-map-drawer-'+name+'-'+width+'.png'});
   }
   assert.deepEqual(pair[1],pair[0]);
   const original=PNG.sync.read(fs.readFileSync('/tmp/international-map-drawer-original-'+width+'.png'));
   const copy=PNG.sync.read(fs.readFileSync('/tmp/international-map-drawer-copy-'+width+'.png'));
   assert.equal(pixelmatch(original.data,copy.data,null,original.width,original.height,{threshold:0,includeAA:true}),0);
   assert.equal(await page.locator('.hero-filter-modal--drawer').count(),1);
   await page.locator('.hero-filter-modal .ui-checkbox').first().click();
   await page.locator('.hero-filter-modal__apply').click();assert.ok(await page.locator('.map-browser').isVisible());
   await page.locator('.map-browser__filter-toggle').click();assert.ok(await page.locator('.hero-filter-modal input[type=checkbox]').first().isChecked());
   await page.locator('.hero-filter-modal__reset').click();assert.equal(await page.locator('.hero-filter-modal input:checked').count(),0);
   await page.keyboard.press('Escape');assert.ok(await page.locator('.map-browser').isVisible());
   await page.keyboard.press('Escape');assert.ok(await page.locator('.map-browser').isHidden());
   await page.locator('.catalog-hero-filters__filter-icon').click();assert.equal(await page.locator('.hero-filter-modal--dark').count(),1);await page.keyboard.press('Escape');
   await page.locator('.catalog-mode-detailed-filters').click();assert.equal(await page.locator('.hero-filter-modal--dark').count(),1);await page.keyboard.press('Escape');
   assert.equal(await page.locator('.international-map-filter').count(),0);
   console.log('PASS',width,'original drawer geometry/typography; map apply/reset; hero/listing remain dark');
  }
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
