const assert = require('node:assert/strict');
const { chromium } = require(process.env.CITY_PLAYWRIGHT_MODULE || 'playwright');
const target = process.argv[2] || 'http://127.0.0.1:4186/gorodskaya-nedvizhimost/';
const source = 'https://front.barnes.vsavr.ru/gorodskaya-nedvizhimost/';

async function measure(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  return page.locator('.hero-filter-modal').evaluate(modal => {
    const rect = selector => {
      const element = modal.querySelector(selector), r = element.getBoundingClientRect(), c = getComputedStyle(element);
      return { x: r.x, y: r.y, width: r.width, height: r.height, font: c.font, color: c.color, background: c.backgroundColor };
    };
    return { dialog: rect('.hero-filter-modal__dialog'), title: rect('.hero-filter-modal__title'), footer: rect('.hero-filter-modal__footer'), input: rect('.hero-filter-panel-content__range-input') };
  });
}

(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
  try {
    for (const width of [390, 768, 1366, 1920, 2560]) {
      const viewport = { width, height: 900 };
      const original = await browser.newPage({ viewport });
      await original.goto(source, { waitUntil: 'domcontentloaded' });
      await original.waitForFunction(() => document.querySelector('#__nuxt')?.__vue_app__?.$nuxt?.isHydrating === false);
      await original.locator('.catalog-hero-filters__filter-icon').click();
      const reference = await measure(original);
      await original.close();
      const page = await browser.newPage({ viewport });
      page.setDefaultTimeout(10000);
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(target, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('.city-node-ready');
      for (const place of ['hero', 'listing', 'map']) {
        const trigger = page.locator(`[data-city-filter-entry="${place}"]`);
        await trigger.click();
        const modal = page.locator('.hero-filter-modal');
        await modal.waitFor({ state: 'visible' });
        assert.equal(await modal.count(), 1);
        assert.deepEqual(await measure(page), reference, `${width}px ${place}: modal differs from front original`);
        assert.equal(await trigger.getAttribute('aria-expanded'), 'true');
        await modal.locator('.hero-filter-modal__apply').focus();
        await page.keyboard.press('Tab');
        assert.equal(await modal.locator('.hero-filter-modal__close').evaluate(e => e === document.activeElement), true);
        await page.keyboard.press('Escape');
        await modal.waitFor({ state: 'detached' });
        await page.waitForTimeout(70);
        assert.equal(await trigger.evaluate(e => e === document.activeElement), true);
        assert.equal(await trigger.getAttribute('aria-expanded'), 'false');
      }
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      assert.deepEqual(errors, []);
      console.log(JSON.stringify({ width, entries: ['hero', 'listing', 'map'], geometryMatchesOriginal: true, keyboard: true }));
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
