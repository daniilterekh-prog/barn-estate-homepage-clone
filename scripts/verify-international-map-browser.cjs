const assert=require('node:assert/strict');
const {chromium}=require('/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const url=process.argv[2]||'http://127.0.0.1:8125/mezhdunarodnaya-nedvizhimost/';
 try{
  for(const width of [320,390,540,541,768,1440,1920]){
   await page.setViewportSize({width,height:900});const styles=[];
   for(const address of ['https://daniilterekh-prog.github.io/barn-estate-homepage-clone/kurortnaya/',url]){
    await page.goto(address,{waitUntil:'networkidle'});await page.locator('.catalog-projects-map__fullscreen').click();
    if(width<=540)await page.locator('.map-browser__handle').click();
    styles.push(await page.evaluate(()=>['.map-browser__panel','.map-browser__search','.map-browser__filters','.map-browser__card img'].map(s=>{const e=document.querySelector(s),r=e.getBoundingClientRect(),c=getComputedStyle(e);return{width:r.width,font:c.fontSize,padding:c.padding};})));
   }
   assert.deepEqual(styles[1],styles[0]);
   assert.equal(await page.locator('.map-browser__card').count(),16);
   await page.locator('[data-filter=type]').selectOption('rc');assert.equal(await page.locator('.map-browser__card').count(),4);
   await page.locator('[data-filter=type]').selectOption('lot');assert.equal(await page.locator('.map-browser__card').count(),12);
   await page.locator('.map-browser__reset').click();
   await page.getByRole('searchbox',{name:'Поиск объектов на карте'}).fill('ARTLIFE');assert.equal(await page.locator('.map-browser__card').count(),1);
   await page.getByRole('searchbox',{name:'Поиск объектов на карте'}).fill('нет-такого-объекта');assert.equal(await page.locator('.map-browser__card').count(),0);
   await page.locator('.map-browser__reset').click();assert.equal(await page.locator('.map-browser__card').count(),16);
   await page.locator('[data-filter=price]').fill('1');assert.equal(await page.locator('.map-browser__card').count(),0);
   await page.locator('.map-browser__reset').click();
   await page.locator('[data-filter=sort]').selectOption('asc');
   await page.locator('.map-browser__filter-toggle').click();assert.ok(await page.locator('.hero-filter-modal').isVisible());
   await page.keyboard.press('Escape');assert.ok(await page.locator('.map-browser').isVisible());
   await page.locator('.map-browser__filter-toggle').click();await page.locator('.hero-filter-modal__reset').click();await page.locator('.hero-filter-modal__apply').click();
   assert.ok(await page.locator('.map-browser').isVisible());assert.equal(await page.locator('.map-browser__card').count(),4);
   await page.locator('.map-browser__reset').click();assert.equal(await page.locator('.map-browser__card').count(),16);
   assert.ok(await page.locator('.map-browser').evaluate(e=>e.scrollWidth<=e.clientWidth));
   await page.screenshot({path:'/tmp/international-map-browser-'+width+'.png'});
   await page.keyboard.press('Escape');assert.ok(await page.locator('.map-browser').isHidden());
   assert.ok(await page.locator('.catalog-projects-map__fullscreen').evaluate(e=>e===document.activeElement));
   assert.ok(await page.locator('body').evaluate(e=>e.style.overflow!=='hidden'));
   console.log('PASS',width,'reference layout; 4 projects/12 lots; search/type/price/sort/reset; full filters; Escape/focus');
  }
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
