import assert from 'node:assert/strict';
const {chromium}=await import(process.env.CAPTURE_TOOLKIT+'/node_modules/playwright/index.mjs');
const {PNG}=await import(process.env.CAPTURE_TOOLKIT+'/node_modules/pngjs/lib/png.js');
const {default:pixelmatch}=await import(process.env.CAPTURE_TOOLKIT+'/node_modules/pixelmatch/index.js');
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const localURL=process.env.COUNTRY_MAP_URL||new URL('../zagorodnaya-nedvizhimost/index.html',import.meta.url).href;
const results=[];
const measure=()=>{
  const root=document.querySelector('.hero-filter-modal--drawer');
  const dialog=root.querySelector('.hero-filter-modal__dialog');
  const heading=root.querySelector('.hero-filter-modal__title');
  const style=getComputedStyle(heading);
  return {rect:dialog.getBoundingClientRect().toJSON(),background:getComputedStyle(dialog).backgroundColor,font:style.fontFamily,fontSize:style.fontSize,groups:[...root.querySelectorAll('.hero-filter-panel-content__group > p')].map(e=>e.textContent.trim()),overflow:dialog.scrollWidth>dialog.clientWidth};
};
try {
  const page=await browser.newPage();const reference=await browser.newPage();
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  for(const width of [320,390,540,541,768,1024,1440,1920,2560]) {
    await page.setViewportSize({width,height:900});await page.goto(localURL);
    await page.waitForFunction(()=>window.countryMapEnter);
    await page.locator('.catalog-projects-map__fullscreen').click();
    await page.waitForFunction(()=>document.fullscreenElement||document.querySelector('.country-map-fallback'));
    const trigger=page.locator('.catalog-projects-map__panel-filter');
    await trigger.click();await page.evaluate(()=>document.fonts.ready);
    const actual=await page.evaluate(measure);
    assert.equal(actual.background,'rgb(255, 255, 255)');assert.equal(actual.overflow,false);
    assert.ok(actual.rect.right<=width&&actual.rect.x>=0);
    assert.equal(await page.locator('.country-map-filter-drawer input[name="rooms"]').count(),0);
    assert.equal(await page.locator('.country-map-filter-drawer .hero-filter-panel-content__range-input').count(),4);
    await page.locator('.country-map-filter-drawer .hero-filter-modal__close').click();
    assert.equal(await page.locator('.country-map-filter-drawer').count(),0);
    assert.equal(await page.evaluate(()=>!!(document.fullscreenElement||document.querySelector('.country-map-fallback'))),true);
    assert.equal(await trigger.evaluate(e=>document.activeElement===e),true);
    await trigger.click();
    if([390,1440].includes(width)) {
      await reference.setViewportSize({width,height:900});
      await reference.goto('https://front.barnes.vsavr.ru/zagorodnaya-nedvizhimost/',{waitUntil:'domcontentloaded'});
      await reference.waitForTimeout(2000);
      await reference.locator('.catalog-projects-map__fullscreen').click();
      await reference.locator('.catalog-projects-map__panel-filter').click();
      await reference.waitForTimeout(500);await reference.evaluate(()=>document.fonts.ready);
      const expected=await reference.evaluate(measure);
      for(const key of ['x','y','width','height'])assert.ok(Math.abs(actual.rect[key]-expected.rect[key])<0.1,`${width}: ${key}`);
      assert.equal(actual.font,expected.font);assert.equal(actual.fontSize,expected.fontSize);
      assert.deepEqual(actual.groups,expected.groups);
      await page.mouse.move(0,0);await reference.mouse.move(0,0);
      await reference.waitForTimeout(300);
      const a=PNG.sync.read(await page.locator('.country-map-filter-drawer .hero-filter-modal__dialog').screenshot({path:`/tmp/country-white-drawer-${width}.png`}));
      const b=PNG.sync.read(await reference.locator('.hero-filter-modal__dialog').screenshot({path:`/tmp/front-white-drawer-${width}.png`}));
      actual.differentPixels=pixelmatch(a.data,b.data,null,a.width,a.height,{threshold:0,includeAA:true});
      assert.equal(actual.differentPixels,0,`${width}: white drawer screenshot differs`);
    }
    await page.locator('.country-map-filter-drawer .hero-filter-modal__backdrop').click({position:{x:0,y:0},force:true});
    // On a full-width mobile drawer the backdrop is covered; use its close button.
    if(await page.locator('.country-map-filter-drawer').count())await page.locator('.country-map-filter-drawer .hero-filter-modal__close').click();
    await page.locator('.catalog-projects-map__exit').click();
    await page.waitForFunction(()=>!document.fullscreenElement&&!document.querySelector('.country-map-fallback'));
    assert.equal(await page.locator('[inert]').count(),0);
    await page.evaluate(()=>document.querySelector('.catalog-projects-map').requestFullscreen=()=>Promise.reject(Error('test fallback')));
    await page.locator('.catalog-projects-map__fullscreen').click();await trigger.click();
    await page.locator('.country-map-filter-drawer label').filter({has:page.locator('input[name="districts"][value="AREAS:56287"]')}).click();
    await page.locator('.country-map-filter-drawer .hero-filter-modal__apply').click();
    assert.equal(await page.locator('.country-map-fallback').count(),1);
    assert.equal(await page.locator('.country-map-filter-drawer').count(),0);
    await page.locator('.catalog-projects-map__exit').click();
    assert.equal(await page.locator('[inert]').count(),0);
    await page.locator('.catalog-mode-toolbar > .catalog-mode-detailed-filters').click();
    assert.equal(await page.locator('.hero-filter-modal:visible input[name="districts"][value="AREAS:56287"]').isChecked(),true);
    await page.locator('.hero-filter-modal:visible .hero-filter-modal__reset').click();
    await page.locator('.hero-filter-modal:visible .hero-filter-modal__apply').click();
    results.push({width,...actual,closeKeepsMap:true,fallback:true});
  }
  assert.deepEqual(errors,[]);console.log(JSON.stringify({pass:true,results},null,2));
}finally{await browser.close();}
