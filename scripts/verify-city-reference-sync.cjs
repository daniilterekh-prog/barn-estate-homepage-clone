/* Run with PLAYWRIGHT_MODULE pointing to the existing test runtime. No new dependencies. */
const assert = require('node:assert/strict');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || '/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const base = process.argv[2] || 'http://127.0.0.1:4186';
(async () => {
  const browser = await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true});
  try {
    for (const width of [320,390,540,768,1024,1440,2560]) {
      const page = await browser.newPage({viewport:{width,height:900}});
      page.setDefaultTimeout(10000);
      const errors=[];page.on('pageerror',e=>errors.push(e.message));
      await page.goto(base+'/gorodskaya-nedvizhimost/',{waitUntil:'domcontentloaded'});
      await page.waitForSelector('.city-reference-synced',{state:'attached'});
      await page.waitForFunction(()=>!!document.querySelector('.site-footer a[href*="for-partners"]'));
      await page.evaluate(()=>document.fonts.ready);
      assert.equal(await page.locator('.catalog-mode-filters button').count(),4);
      assert.match(await page.locator('.catalog-mode-filters button').first().textContent(),/Район/);
      assert.equal(await page.locator('.city-map-filters').count(),0);
      assert.equal(await page.locator('[data-brand-context=listing] input').count(),2);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      const widths=await page.locator('.catalog-mode-filters button').evaluateAll(es=>es.map(e=>e.getBoundingClientRect().width));
      assert.ok(Math.max(...widths)-Math.min(...widths)<1);
      await page.locator('.catalog-mode-filters button').nth(1).click();
      assert.equal(await page.locator('.resort-quick-dropdown').isVisible(),true);
      assert.equal(await page.locator('.resort-quick-dropdown').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(255, 255, 255)');
      await page.keyboard.press('ArrowDown');await page.keyboard.press('Escape');
      assert.equal(await page.locator('.resort-quick-dropdown').isVisible(),false);
      await page.locator('.resort-sort-trigger').first().click();
      await page.locator('.resort-quick-dropdown [role=option]').nth(1).click();
      assert.equal(await page.locator('.resort-quick-dropdown').isVisible(),false);
      await page.locator('[data-mode=lot]').click();
      assert.equal(await page.evaluate(()=>BarnesFilters.getState().market),'secondary');
      await page.locator('.catalog-mode-detailed-filters').click();
      await page.locator('.resort-filters [name=priceMin]').fill('100');
      await page.locator('.resort-filters [name=priceMax]').fill('10');
      await page.locator('.resort-filters .hero-filter-modal__apply').click();
      assert.equal(await page.locator('.resort-filters__error').isVisible(),true);
      await page.locator('.resort-filters .hero-filter-modal__reset').click();
      await page.locator('.resort-filters .hero-filter-modal__apply').click();
      assert.equal(await page.evaluate(()=>BarnesFilters.getState().market),'secondary');
      assert.ok(page.url().includes('/gorodskaya-nedvizhimost/'));
      await page.locator('.catalog-projects-map__fullscreen:not(.city-map-filters)').click();
      if(width<=540)await page.locator('.map-browser__handle').click();
      assert.equal(await page.locator('.map-browser__card').count(),12);
      assert.equal(await page.locator('.map-browser [data-filter=location]').getAttribute('aria-label'),'Район');
      await page.locator('[data-map-market=new-build]').click();
      assert.equal(await page.locator('.map-browser__card').count(),4);
      for(const selector of ['[data-filter=type]','.map-browser [data-filter=location]','.map-browser [data-filter=bedrooms]','.map-browser [data-filter=sort]']){
        const button=page.locator(selector).locator('xpath=preceding-sibling::button');
        await button.click();
        assert.equal(await page.locator('.resort-quick-dropdown').isVisible(),true);
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('.map-browser').isVisible(),true);
      }
      const layout=await page.locator('.map-browser__filters').evaluate(e=>{
        const y=s=>e.querySelector(s).getBoundingClientRect().y;
        return [y('.map-browser__extra'),y('.barnes-brand-filters'),y('.map-browser__reset')];
      });
      assert.ok(layout[0]<layout[1]&&layout[1]<layout[2]);
      await page.locator('[data-brand-context=map] input').first().check();
      assert.deepEqual(await page.evaluate(()=>BarnesFilters.getState().brandFlags),['selection']);
      await page.locator('.map-browser__filter-toggle').click();
      const drawer=page.locator('.resort-filters.hero-filter-modal--drawer');
      assert.equal(await drawer.isVisible(),true);
      const box=await drawer.locator('.hero-filter-modal__dialog').boundingBox();
      assert.ok(Math.abs(box.y)<1);assert.ok(Math.abs(box.height-900)<2);
      if(width<=540)assert.ok(Math.abs(box.width-width)<1);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('.map-browser').isVisible(),true);
      await page.locator('.map-browser__reset').click();
      assert.equal(await page.evaluate(()=>BarnesFilters.getState().market),'new-build');
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('[data-mode=project]').getAttribute('aria-pressed'),'true');
      await page.locator('.floating-expert__close').click();
      await page.locator('.site-footer__callback-btn').click();
      assert.equal(await page.locator('.catalog-feedback-modal').isVisible(),true);
      await page.keyboard.press('Escape');
      assert.deepEqual(errors,[]);
      console.log('PASS',width);
      await page.close();
    }
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
