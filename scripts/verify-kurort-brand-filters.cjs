const { chromium } = require(process.env.PLAYWRIGHT_PATH || '/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
  try {
    for (const width of [320, 390, 768, 1440, 2560]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      await page.goto('http://127.0.0.1:8769/kurortnaya/');
      const listing = page.locator('[data-brand-context=listing]');
      const map = page.locator('[data-brand-context=map]');
      await listing.waitFor();
      await page.waitForFunction(() => document.querySelector('[data-brand-context=map]'));
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await listing.getByRole('checkbox').count(), 2);
      await listing.getByRole('checkbox', { name: 'Выбор BARNES', exact: true }).check();
      await listing.getByRole('checkbox', { name: 'Эксклюзив BARNES', exact: true }).focus();
      await page.keyboard.press('Space');
      assert.deepEqual(await page.evaluate(() => BarnesFilters.getState().brandFlags), ['selection', 'exclusive']);
      assert.equal(await page.locator('.barnes-brand-filters__notice').count(), 0, 'No technical description on checkbox selection');
      const gaps = await listing.evaluate(el => {
        const toolbar = el.closest('.catalog-mode-toolbar');
        const switchRect = toolbar.querySelector('.catalog-mode-switch').getBoundingClientRect();
        const filtersRect = toolbar.querySelector('.catalog-mode-filters').getBoundingClientRect();
        const lastBottom = Math.max(...Array.from(toolbar.children).filter(child => child !== el).map(child => child.getBoundingClientRect().bottom));
        return [filtersRect.top - switchRect.bottom, el.getBoundingClientRect().top - lastBottom];
      });
      assert.ok(Math.abs(gaps[0] - gaps[1]) < 1, `Matching toolbar row gaps: ${gaps}`);
      for (const label of await listing.locator('label').all()) {
        const box = await label.boundingBox();
        assert.ok(box.x >= 0 && box.x + box.width <= width, 'Label fits viewport');
        assert.ok(box.height >= 44, 'Touch target');
      }
      await listing.screenshot({ path: `/tmp/brand-listing-${width}.png` });
      await page.locator('.catalog-projects-map__fullscreen').click();
      if (width <= 540) await page.locator('.map-browser__handle').click();
      assert.equal(await map.getByRole('checkbox', { name: 'Выбор BARNES', exact: true }).isChecked(), true);
      assert.equal(await map.getByRole('checkbox', { name: 'Эксклюзив BARNES', exact: true }).isChecked(), true);
      assert.equal(await page.locator('.map-browser__metadata-notice').isVisible(), false, 'No brand debug notice in map');
      const before = await page.locator('.map-browser__card').count();
      await map.getByRole('checkbox', { name: 'Выбор BARNES', exact: true }).uncheck();
      assert.equal(await page.locator('.map-browser__card').count(), before, 'Missing metadata must not invent results');
      await map.screenshot({ path: `/tmp/brand-map-${width}.png` });
      await page.locator('.map-browser__reset').click();
      assert.deepEqual(await page.evaluate(() => BarnesFilters.getState().brandFlags), []);
      await page.locator('.map-browser__close').click();
      assert.equal(await listing.getByRole('checkbox', { name: 'Эксклюзив BARNES', exact: true }).isChecked(), false);
      await listing.getByRole('checkbox', { name: 'Выбор BARNES', exact: true }).check();
      await page.locator('.catalog-mode-detailed-filters').click();
      await page.locator('.hero-filter-modal__reset').click();
      await page.locator('.hero-filter-modal__apply').click();
      assert.equal(await listing.getByRole('checkbox', { name: 'Выбор BARNES', exact: true }).isChecked(), false);
      console.log(`PASS brand filters ${width}px: native keyboard, shared state, map/listing/reset, no invented flags`);
      await page.close();
    }
    // Only tests supply these flags; production metadata is never fabricated.
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.route('**/map-projects.js?*', route => route.fulfill({ contentType: 'text/javascript', body: 'window.BarnesMapProjects=' + JSON.stringify([
      { name: 'Selection fixture', href: '#a', image: '', priceRub: 1, brandFlags: ['selection'] },
      { name: 'Exclusive fixture', href: '#b', image: '', priceRub: 2, brandFlags: ['exclusive'] },
      { name: 'Other fixture', href: '#c', image: '', priceRub: 3, brandFlags: [] }
    ]) }));
    await page.goto('http://127.0.0.1:8769/kurortnaya/');
    await page.locator('[data-brand-context=listing]').waitFor();
    await page.locator('.catalog-projects-map__fullscreen').click();
    const map = page.locator('[data-brand-context=map]');
    await map.getByRole('checkbox', { name: 'Выбор BARNES', exact: true }).check();
    assert.equal(await page.locator('.map-browser__card').count(), 1);
    await map.getByRole('checkbox', { name: 'Эксклюзив BARNES', exact: true }).check();
    assert.equal(await page.locator('.map-browser__card').count(), 2, 'Both checkboxes combine by OR');
    console.log('PASS annotated fixtures: selection/exclusive filter and union');
    await page.close();
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
