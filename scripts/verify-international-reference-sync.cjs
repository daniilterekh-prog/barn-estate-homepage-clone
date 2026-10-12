const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const {chromium} = require('/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
  const page = await browser.newPage();
  const url = process.argv[2] || 'http://127.0.0.1:8125/mezhdunarodnaya-nedvizhimost/';
  const reference = 'https://daniilterekh-prog.github.io/barn-estate-homepage-clone/kurortnaya/';
  const errors = [], rows = [];
  page.on('pageerror', e => errors.push(e.message));
  const metrics = () => page.evaluate(() => {
    const selectors = ['.catalog-mode-filters .catalog-quick-filters__button','.resort-sort-trigger','.barnes-brand-filters__box','.catalog-contact__method','.catalog-consultation__method','.map-browser__field','.catalog-sticky__callback','.site-footer__link'];
    return selectors.map(selector => {
      const e = document.querySelector(selector), s = getComputedStyle(e);
      return {selector,font:s.fontSize,line:s.lineHeight,weight:s.fontWeight,padding:s.padding,border:s.borderRadius};
    });
  });
  try {
    for (const width of [320,390,540,768,1024,1440,1920]) {
      await page.setViewportSize({width,height:900});
      await page.goto(reference,{waitUntil:'load'}); await page.waitForFunction(()=>document.querySelector('.catalog-sticky__callback')&&document.querySelector('.resort-sort-trigger')); await page.evaluate(()=>document.fonts.ready);
      await page.waitForFunction(()=>getComputedStyle(document.querySelector('.barnes-brand-filters__box')).borderRadius==='1px');
      const expected = await metrics();
      await page.goto(url,{waitUntil:'load'}); await page.waitForFunction(()=>document.querySelector('.catalog-sticky__callback')&&document.querySelector('.resort-sort-trigger')); await page.evaluate(()=>document.fonts.ready);
      await page.waitForFunction(()=>getComputedStyle(document.querySelector('.barnes-brand-filters__box')).borderRadius==='1px');
      assert.deepEqual(await metrics(),expected,'Reference typography/spacing at '+width);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      assert.equal(await page.locator('.catalog-grid__item:not([hidden])').count(),4);
      assert.equal(await page.locator('.international-map-filter').count(),0);
      assert.equal(await page.getByRole('link',{name:'Амбассадоры',exact:true}).count(),1);
      for (const section of ['contact','consultation']) {
        const channel=page.locator('.catalog-'+section+'__method').filter({hasText:'Telegram'});
        await channel.click();
        assert.equal((await page.locator('.catalog-'+section+'__form [name=preferredChannel]').inputValue()).trim(),'Telegram');
        assert.ok(await page.locator('.catalog-'+section+'__methods').evaluate(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth;}));
      }
      await page.locator('.catalog-mode-filters .catalog-quick-filters__button').nth(1).click();
      assert.ok(await page.locator('.resort-quick-dropdown').isVisible());
      await page.keyboard.press('Escape');
      await page.locator('.catalog-grid__sort .resort-sort-trigger').click();
      assert.ok(await page.locator('.resort-quick-dropdown').isVisible());
      await page.keyboard.press('Escape');
      await page.locator('[data-brand-context=listing] input[value=selection]').check({force:true});
      await page.locator('.catalog-projects-map__fullscreen').click();
      assert.equal(await page.locator('.map-browser__card').count(),4);
      assert.ok(await page.locator('[data-brand-context=map] input[value=selection]').isChecked());
      if(width<=540) await page.locator('.map-browser__handle').click();
      await page.locator('[data-map-market=secondary]').click();
      assert.equal(await page.locator('.map-browser__card').count(),12);
      await page.locator('.map-browser__reset').click();
      assert.equal(await page.locator('[data-map-market=secondary]').getAttribute('aria-pressed'),'true');
      assert.equal(await page.locator('.map-browser__card').count(),12);
      assert.equal(await page.locator('[data-brand-context=map] input:checked').count(),0);
      await page.locator('.map-browser__field .resort-select-trigger').first().click();
      assert.ok(await page.locator('.resort-quick-dropdown').isVisible());
      await page.keyboard.press('Escape');
      assert.ok(await page.locator('.map-browser').isVisible());
      await page.locator('.map-browser__filter-toggle').click();
      assert.ok(await page.locator('.hero-filter-modal--drawer').isVisible());
      await page.keyboard.press('Escape');
      assert.ok(await page.locator('.map-browser').isVisible());
      await page.locator('[data-map-zoom=in]').click();
      assert.ok(await page.locator('.map-browser__backdrop img').evaluate(e=>e.style.transform.includes('1.25')));
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('.catalog-grid__item:not([hidden])').count(),12);
      await page.locator('.catalog-mode-toolbar').screenshot({path:'/tmp/international-sync-listing-'+width+'.png'});
      rows.push({width,referenceStyles:true,overflow:false,dropdowns:true,marketSync:true,brandSync:true,whiteDrawer:true,zoom:true,cta:true,footer:true});
      console.log('PASS',width);
    }
    assert.deepEqual(errors,[]);
    await fs.writeFile('mezhdunarodnaya-nedvizhimost/verification/reference-sync.json',JSON.stringify({url,reference,rows,errors},null,2)+'\n');
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
