import assert from 'node:assert/strict';
const toolkit = process.env.CAPTURE_TOOLKIT;
const {chromium} = await import(toolkit + '/node_modules/playwright/index.mjs');
const {PNG} = await import(toolkit + '/node_modules/pngjs/lib/png.js');
const {default: pixelmatch} = await import(toolkit + '/node_modules/pixelmatch/index.js');
const browser = await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const localURL = process.env.COUNTRY_FILTER_URL || new URL('../zagorodnaya-nedvizhimost/index.html',import.meta.url).href;
const results = [];
try {
  const page = await browser.newPage();
  const reference = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  for (const width of [320,390,540,768,1024,1440,1920,2560]) {
    const viewport = {width,height:900};
    await page.setViewportSize(viewport);
    await page.goto(localURL);
    await page.waitForFunction(()=>window.countryMatchesFullFilter && document.querySelector('.country-map-filters'));
    for (const selector of ['.catalog-hero-filters__filter-icon','.catalog-mode-toolbar > .catalog-mode-detailed-filters','.country-map-filters']) {
      await page.locator(selector).click();
      assert.equal(await page.locator('.hero-filter-modal:visible').count(),1);
      assert.equal(await page.locator(selector).getAttribute('aria-expanded'),'true');
      await page.keyboard.press('Shift+Tab');
      assert.equal(await page.evaluate(()=>document.activeElement.classList.contains('hero-filter-modal__apply')),true);
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(()=>document.activeElement.classList.contains('hero-filter-modal__close')),true);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('.hero-filter-modal:visible').count(),0);
      assert.equal(await page.locator(selector).evaluate(e=>e===document.activeElement),true);
    }
    await page.locator('.catalog-hero-filters__filter-icon').click();
    await page.evaluate(()=>document.fonts.ready);
    const geometry = await page.locator('.hero-filter-modal__dialog').evaluate(e=>({rect:e.getBoundingClientRect().toJSON(),overflow:e.scrollWidth>e.clientWidth+1}));
    assert.equal(geometry.overflow,false);
    assert.ok(geometry.rect.left>=0 && geometry.rect.right<=width);
    let pixels, rawPixels;
    if ([390,1440].includes(width)) {
      await reference.setViewportSize(viewport);
      await reference.goto('https://barn-estate.ru/zagorodnaya-nedvizhimost/',{waitUntil:'domcontentloaded'});
      // Wait for the source Vue hydration before invoking its client-only modal.
      await reference.waitForTimeout(2000);
      await reference.locator('.catalog-hero-filters__filter-icon').click();
      await reference.waitForFunction(()=>{
        const modal=document.querySelector('.hero-filter-modal');
        return modal && ![...modal.classList].some(name=>name.includes('-enter-'));
      });
      await reference.evaluate(()=>document.fonts.ready);
      const expectedRect=await reference.locator('.hero-filter-modal__dialog').evaluate(e=>e.getBoundingClientRect().toJSON());
      for (const key of ['x','y','width','height']) assert.ok(Math.abs(geometry.rect[key]-expectedRect[key])<0.01,`${width}px ${key} geometry differs`);
      const a=PNG.sync.read(await reference.locator('.hero-filter-modal__dialog').screenshot());
      const b=PNG.sync.read(await page.locator('.hero-filter-modal__dialog').screenshot());
      assert.equal(a.width,b.width); assert.equal(a.height,b.height);
      rawPixels=pixelmatch(a.data,b.data,null,a.width,a.height,{threshold:0,includeAA:true});
      // Rounded corners and a half-pixel crop edge reveal different underlying pages.
      if (width>768) for(let y=0;y<a.height;y++) for(let x=0;x<a.width;x++) {
        if (x===0 || y===0 || x===a.width-1 || y===a.height-1 || ((x<8 || x>=a.width-8) && (y<8 || y>=a.height-8))) {
          const i=(y*a.width+x)*4; a.data.fill(0,i,i+4); b.data.fill(0,i,i+4);
        }
      }
      pixels=pixelmatch(a.data,b.data,null,a.width,a.height,{threshold:0,includeAA:true});
      assert.equal(pixels,0,`${width}px filter dialog differs from source`);
    }
    await page.keyboard.press('Escape');
    await page.locator('[data-country-mode="lot"]').click();
    await page.locator('.country-map-filters').click();
    await page.locator('[name="priceMax"]').fill('100000000');
    await page.locator('.hero-filter-modal__apply').click();
    assert.equal(await page.locator('.catalog-grid__item:not([hidden])').count(),4);
    await page.locator('.catalog-mode-toolbar > .catalog-mode-detailed-filters').click();
    assert.equal(await page.locator('[name="priceMax"]').inputValue(),'100000000');
    await page.locator('[name="priceMin"]').fill('200000000');
    await page.locator('.hero-filter-modal__apply').click();
    assert.equal(await page.locator('.hero-filter-modal:visible').count(),1);
    await page.locator('.hero-filter-modal__reset').click();
    await page.locator('.hero-filter-modal__apply').click();
    assert.equal(await page.locator('.catalog-grid__item:not([hidden])').count(),12);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    results.push({width,geometry,pixels,rawPixels,entryPoints:3,applyReset:true,keyboard:true});
  }
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({pass:true,results},null,2));
} finally {await browser.close();}
