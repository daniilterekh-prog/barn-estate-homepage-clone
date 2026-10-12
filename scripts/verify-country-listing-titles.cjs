const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || '/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const base = process.argv[2] || 'http://127.0.0.1:4188';

(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
  try {
    for (const width of [320, 390, 540, 768, 1024, 1440, 1920]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      await page.goto(base + '/zagorodnaya-nedvizhimost/', { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('.catalog-mode-switch [data-country-mode]');
      await page.evaluate(() => document.fonts.ready);
      for (const mode of ['project', 'lot']) {
        await page.locator(`[data-country-mode="${mode}"]`).click();
        const result = await page.locator('.catalog-grid__item:not([hidden]) .apartment-card__name-text').first().evaluate(async title => {
          const card = title.closest('.apartment-card');
          const original = title.textContent;
          const frame = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
          title.textContent = 'Короткое';
          await frame();
          const shortHeight = title.getBoundingClientRect().height;
          const shortCardHeight = card.getBoundingClientRect().height;
          title.textContent = 'Очень длинное название загородного дома и коттеджного посёлка '.repeat(12);
          await frame();
          const style = getComputedStyle(title);
          const result = {
            whiteSpace: style.whiteSpace,
            overflow: style.overflow,
            textOverflow: style.textOverflow,
            clipped: title.scrollWidth > title.clientWidth,
            shortHeight,
            longHeight: title.getBoundingClientRect().height,
            shortCardHeight,
            longCardHeight: card.getBoundingClientRect().height
          };
          title.textContent = '';
          await frame();
          result.emptyHeight = title.getBoundingClientRect().height;
          title.textContent = original;
          return result;
        });
        assert.equal(result.whiteSpace, 'nowrap', `${width}px ${mode}: white-space`);
        assert.equal(result.overflow, 'hidden', `${width}px ${mode}: overflow`);
        assert.equal(result.textOverflow, 'ellipsis', `${width}px ${mode}: text-overflow`);
        assert.equal(result.clipped, true, `${width}px ${mode}: title should be truncated`);
        assert.ok(Math.abs(result.longHeight - result.shortHeight) < 1, `${width}px ${mode}: title height jumps`);
        assert.ok(Math.abs(result.emptyHeight - result.shortHeight) < 1, `${width}px ${mode}: title line is not reserved`);
        assert.ok(Math.abs(result.longCardHeight - result.shortCardHeight) < 1, `${width}px ${mode}: card height jumps`);
      }
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${width}px: horizontal overflow`);
      console.log(`PASS listing title ellipsis and stable card height: ${width}px`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
