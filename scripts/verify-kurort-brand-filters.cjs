const { chromium } = require(process.env.PLAYWRIGHT_PATH || '/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
  try {
    for (const width of [320, 390, 540, 768, 1440, 2560]) {
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
        function textRect(node) {
          const range = document.createRange();
          range.selectNodeContents(node);
          return range.getBoundingClientRect();
        }
        const switchRect = textRect(toolbar.querySelector('.catalog-mode-switch__button'));
        const captions = Array.from(toolbar.querySelectorAll('.catalog-mode-filters .catalog-quick-filters__caption')).map(textRect);
        const checkboxText = textRect(el.querySelector('label > span:last-child'));
        // Compare the text-row centres when narrow columns wrap the label.
        const textRange = document.createRange();
        textRange.selectNodeContents(el.querySelector('label > span:last-child'));
        const lineHeight = textRange.getClientRects()[0].height;
        const textRowTop = checkboxText.top + Math.max(0, checkboxText.height - lineHeight) / 2;
        return [captions[0].top - switchRect.bottom, textRowTop - Math.max(...captions.map(rect => rect.bottom))];
      });
      if (width > 540 && width <= 1024) assert.ok(Math.abs(gaps[0] - gaps[1]) < 1, `Matching visible text gaps: ${gaps}`);
      else if (width > 1024) {
        const market = await page.locator('.catalog-mode-switch').boundingBox();
        const brands = await listing.boundingBox();
        assert.ok(Math.abs(market.y + market.height / 2 - brands.y - brands.height / 2) < 1, 'Market and checkboxes share top row');
      }
      if (width <= 540) {
        const checkX = (await listing.locator('.barnes-brand-filters__box').first().boundingBox()).x;
        const iconX = (await page.locator('.catalog-mode-filters .catalog-quick-filters__icon svg').first().boundingBox()).x;
        assert.ok(Math.abs(checkX - iconX) < 1, 'Mobile listing checkbox aligned with filter SVG left edge');
        const exclusiveX = (await listing.locator('.barnes-brand-filters__box').nth(1).boundingBox()).x;
        const secondIconX = (await page.locator('.catalog-mode-filters .catalog-quick-filters__icon svg').nth(1).boundingBox()).x;
        assert.ok(Math.abs(exclusiveX - secondIconX) < 1, `Mobile exclusive checkbox aligned with second SVG: ${exclusiveX} vs ${secondIconX}`);
        const top = (await listing.boundingBox()).y;
        for (const selector of ['.catalog-grid__sort', '.catalog-mode-detailed-filters']) {
          const row = await page.locator(selector).boundingBox();
          assert.ok(row.y + row.height <= top, 'Mobile checkboxes below sorting and detailed filters, no overlap');
        }
        await page.locator('.catalog-mode-toolbar').screenshot({ path: `/tmp/listing-final-order-${width}.png` });
      } else {
        const brand = await listing.boundingBox();
        const sort = await page.locator('.catalog-grid__sort').boundingBox();
        assert.ok(brand.x + brand.width <= sort.x, 'Checkboxes to the left of sorting');
        const lastLabel = await listing.locator('label').last().boundingBox();
        assert.ok(sort.x - lastLabel.x - lastLabel.width <= 21, 'Checkboxes immediately next to sorting, not at page left edge');
        assert.ok(Math.abs(brand.y + brand.height / 2 - sort.y - sort.height / 2) < 1, 'Checkboxes and sorting share row/center');
      }
      for (const label of await listing.locator('label').all()) {
        const box = await label.boundingBox();
        assert.ok(box.x >= 0 && box.x + box.width <= width, 'Label fits viewport');
        assert.ok(box.height >= 44, 'Touch target');
      }
      await listing.screenshot({ path: `/tmp/brand-listing-${width}.png` });
      await page.locator('.catalog-projects-map__fullscreen').click();
      if (width <= 540) await page.locator('.map-browser__handle').click();
      if (width <= 540) {
        const checkX = (await map.locator('.barnes-brand-filters__box').first().boundingBox()).x;
        const iconX = (await page.locator('.map-browser__field > svg').first().boundingBox()).x;
        assert.ok(Math.abs(checkX - iconX) < 1, 'Mobile map checkbox aligned with filter SVG left edge');
        const exclusiveX = (await map.locator('.barnes-brand-filters__box').nth(1).boundingBox()).x;
        const secondIconX = (await page.locator('.map-browser__field > svg').nth(1).boundingBox()).x;
        assert.ok(Math.abs(exclusiveX - secondIconX) < 1, `Mobile map exclusive checkbox aligned with second SVG: ${exclusiveX} vs ${secondIconX}`);
      }
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
      { name: 'Selection fixture', href: '#a', image: '', priceRub: 1, market: 'new-build', brandFlags: ['selection'] },
      { name: 'Exclusive fixture', href: '#b', image: '', priceRub: 2, market: 'new-build', brandFlags: ['exclusive'] },
      { name: 'Other fixture', href: '#c', image: '', priceRub: 3, market: 'new-build', brandFlags: [] }
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
