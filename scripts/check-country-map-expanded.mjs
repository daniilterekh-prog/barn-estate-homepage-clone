import assert from 'node:assert/strict';
const {chromium}=await import(process.env.CAPTURE_TOOLKIT+'/node_modules/playwright/index.mjs');
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const url=process.env.COUNTRY_MAP_URL||new URL('../zagorodnaya-nedvizhimost/index.html',import.meta.url).href;
const results=[];
try {
  const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const width of [320,390,540,541,768,1024,1440,1920,2560]) {
    await page.setViewportSize({width,height:900});await page.goto(url);
    await page.waitForFunction(()=>window.countryMapEnter);
    const trigger=page.locator('.catalog-projects-map__fullscreen');
    await trigger.click();await page.waitForFunction(()=>document.fullscreenElement);
    const panel=page.locator('.catalog-projects-map__panel');
    let rect=await panel.evaluate(e=>e.getBoundingClientRect().toJSON());
    assert.ok(width<=540 ? rect.bottom===900&&rect.height===92 : rect.width===420&&rect.height===900);
    if(width<=540) {
      const box=await page.locator('.catalog-projects-map__panel-handle').boundingBox();
      await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();
      await page.mouse.move(box.x+box.width/2,box.y-120,{steps:8});await page.mouse.up();
      await page.waitForFunction(()=>Math.abs(document.querySelector('.catalog-projects-map__panel').getBoundingClientRect().height-765)<1);
      await page.locator('.catalog-projects-map__panel-handle').click();
      await page.locator('.catalog-projects-map__panel-handle').click();
      await page.waitForFunction(()=>Math.abs(document.querySelector('.catalog-projects-map__panel').getBoundingClientRect().height-765)<1);
      await page.locator('.catalog-projects-map__panel-handle').click();
      await panel.locator('input').focus();
      assert.equal(await page.locator('.catalog-projects-map__panel-handle').getAttribute('aria-expanded'),'true');
    }
    await page.locator('.catalog-projects-map__panel-filter').click();
    assert.equal(await page.locator('.hero-filter-modal:visible').count(),1);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.hero-filter-modal:visible').count(),0);
    // Chrome may also exit native fullscreen on Escape; reopen to test the cross independently.
    if(!await page.evaluate(()=>!!document.fullscreenElement)) { await trigger.click();await page.waitForFunction(()=>document.fullscreenElement); }
    if(width<=540 && await page.locator('.catalog-projects-map__panel-handle').getAttribute('aria-expanded')==='false')await page.locator('.catalog-projects-map__panel-handle').click();
    for(let i=0;i<4;i++) {
      await page.locator('.catalog-projects-map__panel .catalog-quick-filters__button').nth(i).click();
      assert.equal(await page.locator('#country-map-quick-dropdown .catalog-quick-filters__option').count(),[4,4,8,3][i]);
      const first=page.locator('#country-map-quick-dropdown .catalog-quick-filters__option').first();
      const label=await first.textContent();await first.click();
      assert.equal(await page.locator('.catalog-projects-map__panel .catalog-quick-filters__value').nth(i).textContent(),label);
      await page.locator('#country-map-quick-dropdown .catalog-quick-filters__dropdown-close').click();
    }
    await page.locator('.catalog-projects-map__exit').click();
    await page.waitForFunction(()=>!document.fullscreenElement);
    assert.equal(await trigger.evaluate(e=>e===document.activeElement),true);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await page.evaluate(()=>document.querySelector('.catalog-projects-map').requestFullscreen=()=>Promise.reject(Error('test fallback')));
    await trigger.click();await page.waitForFunction(()=>document.querySelector('.country-map-fallback'));
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.country-map-fallback').count(),0);
    assert.equal(await page.locator('[inert]').count(),0);
    const failures=await page.evaluate(()=>[...document.querySelectorAll('.catalog-projects-map img')].filter(e=>e.complete&&!e.naturalWidth).map(e=>e.getAttribute('src')));
    assert.deepEqual(failures,[]);
    results.push({width,rect,nativeFullscreen:true,mobilePanel:width<=540,filter:true,quickDropdowns:4,returnFocus:true,fallback:true});
  }
  assert.deepEqual(errors,[]);console.log(JSON.stringify({pass:true,results},null,2));
}finally{await browser.close();}
