/** Responsive resort-filter parity on the standalone country node. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || '/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const base = process.argv[2] || 'http://127.0.0.1:4195/';
const report = { source: 'kurortnaya filters 02.11.2026', widths: [], errors: [] };
const near = (actual, expected, label, tolerance = 1) => assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: ${actual} !== ${expected}`);

(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
  try {
    for (const width of [320, 390, 541, 768, 1024, 1440, 1920, 3840]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      page.on('pageerror', error => report.errors.push(`${width}px ${error.message}`));
      await page.goto(base, { waitUntil: 'domcontentloaded' });
      await page.locator('.catalog-mode-toolbar[data-catalog-layout]').waitFor();
      await page.evaluate(() => document.fonts.ready);
      const layout = await page.evaluate(() => {
        const rect = selector => {
          const element = document.querySelector(selector), box = element.getBoundingClientRect(), css = getComputedStyle(element);
          return { x: box.x, y: box.y, width: box.width, height: box.height, visible: css.display !== 'none' };
        };
        return { direction: rect('.catalog-direction'), market: rect('.catalog-mode-switch'), quick: rect('.catalog-mode-filters'), search: rect('.catalog-search-row'), detailed: rect('.catalog-mode-detailed-filters'), overflow: document.documentElement.scrollWidth > innerWidth + 1,
          quickVisible: [...document.querySelectorAll('.catalog-mode-filters > .catalog-quick-filters__item')].filter(item => getComputedStyle(item).display !== 'none').length };
      });
      assert.equal(layout.overflow, false, `${width}px overflow`);
      near(layout.direction.height, width < 768 ? 58 : 64, `${width}px direction`);
      near(layout.quick.height, width < 768 ? 116 : 64, `${width}px quick fields`);
      assert.equal(layout.quickVisible, width < 768 ? 4 : 2, `${width}px visible quick fields`);
      if (width < 768) {
        assert.ok(layout.direction.y < layout.market.y && layout.market.y < layout.quick.y && layout.quick.y < layout.search.y, `${width}px mobile order`);
        near(layout.detailed.width, 58, `${width}px filter icon`);
      } else if (width >= 1024) {
        near(layout.direction.y, layout.market.y, `${width}px desktop primary row`);
        near(layout.quick.y, layout.detailed.y, `${width}px desktop secondary row`);
      }
      if ([390, 1440].includes(width)) {
        const cardStyles = await page.evaluate(() => {
          const sheet = document.querySelector('link[href^="css/country-catalog-filters.css"]');
          const selectors = ['.apartment-card', '.apartment-card__name', '.apartment-card__price', '.listing-card-fact__value'];
          const take = () => Object.fromEntries(selectors.map(selector => {
            const css = getComputedStyle(document.querySelector(selector));
            return [selector, ['fontSize','fontWeight','lineHeight','color','backgroundColor','borderRadius','padding'].map(key => css[key])];
          }));
          const withFilterStyles = take(); sheet.disabled = true; const withoutFilterStyles = take(); sheet.disabled = false;
          return { withFilterStyles, withoutFilterStyles };
        });
        assert.deepEqual(cardStyles.withFilterStyles, cardStyles.withoutFilterStyles, `${width}px card styles`);
        await page.locator('.catalog-mode-toolbar [data-country-quick="location"]').click();
        await page.locator('.country-reference-dropdown [role="option"]').nth(1).click();
        assert.ok(await page.locator('.catalog-active-filter').count() > 0, `${width}px active chip`);
        await page.locator('.catalog-active-filter').first().click();
        await page.locator('[data-country-search]').fill('нет-такого-объекта');
        await page.waitForFunction(() => document.querySelector('.catalog-result-count').textContent.startsWith('0 '));
        await page.locator('[data-country-search]').fill('');
        await page.locator('[data-country-mode="lot"]').click();
        await page.locator('.catalog-mode-detailed-filters').click();
        const full = page.locator('#catalog-hero-filters-panel');
        assert.equal(await full.isVisible(), true);
        const surface = await full.evaluate(modal => ({bg:getComputedStyle(modal.querySelector('.hero-filter-modal__dialog')).backgroundColor, width:modal.querySelector('.hero-filter-modal__dialog').getBoundingClientRect().width}));
        assert.equal(surface.bg, 'rgb(255, 255, 255)');
        near(surface.width, width <= 540 ? width - 15 : 640, `${width}px full filter width`, 18);
        await full.locator('[name="bedrooms"][value="2"]').check({force:true});
        await full.locator('.hero-filter-modal__apply').click();
        assert.equal(await page.evaluate(() => window.countryListing.getSelection().bedrooms), '2');
        await page.locator('.catalog-reset-all').click();
        assert.equal(await page.evaluate(() => window.countryListing.getSelection().bedrooms), '');
        await page.locator('.catalog-map-trigger').click();
        await page.locator('.catalog-projects-map__panel-filter').click();
        assert.equal(await full.isVisible(), true);
        assert.equal(await full.evaluate(modal => modal.classList.contains('hero-filter-modal--drawer')), true);
        await page.keyboard.press('Escape');
        assert.equal(await full.isVisible(), false);
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('.country-map-expanded').count(), 0);
      }
      report.widths.push({width,layout});
      console.log(`PASS country catalogue filters ${width}px`);
      await page.close();
    }
    assert.deepEqual(report.errors, []);
  } finally { await browser.close(); }
  fs.writeFileSync(path.join(__dirname, '../verification/catalog-filters-2026-11-02.json'), JSON.stringify(report, null, 2) + '\n');
})().catch(error => { console.error(error); process.exitCode = 1; });
