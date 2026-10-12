const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || '/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const base = process.argv[2] || 'http://127.0.0.1:4186/';
async function open(page, route, width) {
  await page.goto(new URL(route + '/', base).href, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.map-browser', { state: 'attached' });
  await page.locator('.catalog-projects-map__fullscreen:not(.city-map-filters)').click();
  await page.locator('.map-browser').waitFor({ state: 'visible' });
  if (width <= 540) await page.locator('.map-browser__handle').click();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
}
async function geometry(page) {
  return page.locator('.map-browser').evaluate(dialog => {
    const measure = selector => {
      const element = dialog.querySelector(selector), r = element.getBoundingClientRect(), s = getComputedStyle(element);
      return { x: r.x, y: r.y, w: r.width, h: r.height, font: s.font, color: s.color };
    };
    return { panel: measure('.map-browser__panel'), heading: measure('.map-browser__heading'), search: measure('.map-browser__search'), type: measure('[data-filter="type"]'), price: measure('[data-filter="price"]'), media: measure('.map-browser__card img') };
  });
}
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
  try {
    for (const width of [390, 768, 1440, 1920, 2560]) {
      const viewport = { width, height: 900 };
      const reference = await browser.newPage({ viewport });
      await open(reference, 'kurortnaya', width);
      const expected = await geometry(reference);
      await reference.close();
      const page = await browser.newPage({ viewport });
      page.setDefaultTimeout(10000);
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await open(page, 'gorodskaya-nedvizhimost', width);
      assert.deepEqual(await geometry(page), expected, 'map panel geometry/styles differ from resort reference');
      const items = await page.evaluate(() => window.BarnesCityMapProjects);
      assert.equal(items.length, 16, 'map snapshot must not depend on responsive listing pagination');
      const dialog = page.locator('.map-browser');
      assert.equal(await dialog.locator('.map-browser__card').count(), items.length);
      assert.equal(await page.locator('.catalog-projects-map__modal').count(), 0);
      const query = dialog.locator('input[type="search"]');
      await query.fill(items[0].name);
      assert.equal(await dialog.locator('.map-browser__card').count(), items.filter(i => i.name.toLowerCase().includes(items[0].name.toLowerCase())).length);
      await query.fill('нет-такого-объекта');
      assert.equal(await dialog.locator('.map-browser__card').count(), 0);
      await dialog.locator('.map-browser__reset').click();
      await dialog.locator('[data-filter="type"]').selectOption('lot');
      assert.equal(await dialog.locator('.map-browser__card').count(), items.filter(i => i.type === 'lot').length);
      await dialog.locator('.map-browser__reset').click();
      await dialog.locator('[data-filter="price"]').fill('1');
      assert.equal(await dialog.locator('.map-browser__card').count(), 0);
      await dialog.locator('.map-browser__reset').click();
      await dialog.locator('[data-filter="sort"]').selectOption('asc');
      const actualPrices = await dialog.locator('.map-browser__card p').allTextContents();
      const sorted = [...items].sort((a,b) => (a.priceRub ?? Infinity) - (b.priceRub ?? Infinity));
      assert.deepEqual(actualPrices, sorted.map(i => i.price || 'Цена по запросу'));
      await dialog.locator('.map-browser__filter-toggle').click();
      const filters = page.locator('.hero-filter-modal');
      await filters.waitFor({ state: 'visible' });
      assert.equal(await dialog.locator('.map-browser__filter-toggle').getAttribute('aria-expanded'), 'true');
      assert.equal(await filters.evaluate(e => e.inert), false);
      assert.equal(await filters.evaluate(e => Number(getComputedStyle(e).zIndex) > 10000), true);
      await page.keyboard.press('Escape');
      await filters.waitFor({ state: 'detached' });
      assert.equal(await dialog.isVisible(), true);
      assert.equal(await dialog.evaluate(e => e.inert), false);
      assert.equal(await dialog.locator('.map-browser__filter-toggle').getAttribute('aria-expanded'), 'false');
      await dialog.locator('.map-browser__reset').click();
      if (process.env.SCREENSHOT_DIR) await page.screenshot({ path: `${process.env.SCREENSHOT_DIR}/city-map-${width}.png` });
      assert.equal(await dialog.evaluate(e => e.scrollWidth > e.clientWidth), false);
      await page.keyboard.press('Escape');
      await dialog.waitFor({ state: 'hidden' });
      assert.equal(await page.locator('.catalog-projects-map__fullscreen:not(.city-map-filters)').evaluate(e => e === document.activeElement), true);
      assert.equal(await page.locator('#__nuxt').evaluate(e => e.inert), false);
      assert.deepEqual(errors, []);
      console.log(JSON.stringify({ width, objects: items.length, matchesReference: true, search: true, type: true, price: true, sort: true, nestedFilters: true, close: true }));
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
