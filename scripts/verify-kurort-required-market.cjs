const { chromium } = require('/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
  try {
    for (const width of [390, 1440, 2560]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      await page.goto('http://127.0.0.1:8769/kurortnaya/');
      await page.waitForSelector('[data-brand-context=listing]');
      await page.waitForFunction(() => !!window.BarnesFilters);
      assert.equal(await page.evaluate(() => BarnesFilters.getState().market), 'new-build');
      await page.locator('button[data-listing-mode=secondary]').click();
      assert.equal(await page.evaluate(() => BarnesFilters.getState().market), 'secondary');
      await page.evaluate(() => window.BarnesMapProjects.splice(0, window.BarnesMapProjects.length,
        { name: 'New fixture', href: '#', image: 'map-preview.png', priceRub: 10, market: 'new-build' },
        { name: 'Resale fixture', href: '#', image: 'map-preview.png', priceRub: 20, market: 'secondary' },
        { name: 'Unknown fixture', href: '#', image: 'map-preview.png', priceRub: 30 }));
      await page.locator('.catalog-projects-map__fullscreen').click();
      if (width <= 540) await page.locator('.map-browser__handle').click();
      const cards = page.locator('.map-browser__card h3');
      assert.deepEqual(await cards.allTextContents(), ['Resale fixture']);
      for (const market of ['secondary', 'new-build', 'new-build', 'secondary']) {
        await page.locator(`[data-map-market="${market}"]`).click();
        assert.equal(await page.locator('[data-map-market][aria-pressed=true]').count(), 1);
        assert.equal(await page.evaluate(() => BarnesFilters.getState().market), market);
        assert.deepEqual(await cards.allTextContents(), [market === 'secondary' ? 'Resale fixture' : 'New fixture']);
      }
      await page.locator('.map-browser__reset').click();
      assert.deepEqual(await cards.allTextContents(), ['Resale fixture']);
      await page.locator('.map-browser__filter-toggle').click();
      await page.locator('.hero-filter-modal__reset').click();
      await page.locator('.hero-filter-modal__apply').click();
      assert.equal(await page.evaluate(() => BarnesFilters.getState().market), 'secondary');
      assert.deepEqual(await cards.allTextContents(), ['Resale fixture']);
      if (width > 540) {
        for (let i = 0; i < 2; i++) {
          const box = await page.locator('[data-brand-context=map] .barnes-brand-filters__box').nth(i).boundingBox();
          const svg = await page.locator('.map-browser__field > svg').nth(i).boundingBox();
          assert.ok(Math.abs(box.x - svg.x) < 1, 'Desktop checkbox/SVG alignment');
        }
        const brands = await page.locator('[data-brand-context=map]').boundingBox();
        const sort = await page.locator('.map-browser__extra').boundingBox();
        assert.ok(brands.y + brands.height <= sort.y, 'Checkbox row precedes sorting');
        await page.locator('.map-browser__panel').screenshot({ path: `/tmp/map-required-market-${width}.png` });
      }
      await page.locator('.map-browser__close').click();
      assert.equal(await page.locator('button[data-listing-mode=secondary]').getAttribute('aria-pressed'), 'true');
      await page.evaluate(() => BarnesFilters.patch({ market: '' }));
      assert.equal(await page.evaluate(() => BarnesFilters.getState().market), 'secondary');
      console.log(`PASS ${width}: one market always selected, listing/map sync, repeat/reset safe, no mixed or unknown records`);
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
