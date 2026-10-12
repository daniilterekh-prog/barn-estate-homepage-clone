const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || '/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const base = process.argv[2] || 'http://127.0.0.1:8769/kurortnaya/';
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
  const errors = [];
  try {
    const page = await browser.newPage();
    page.on('pageerror', error => errors.push(error.message));
    for (const width of [320, 390, 540, 541, 768, 1440, 1920, 2560]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(base, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('[data-brand-context="listing"]');
      const image = page.locator('.catalog-hero__image');
      const info = await image.evaluate(async img => {
        await img.decode();
        return { src: img.currentSrc, width: img.naturalWidth, height: img.naturalHeight };
      });
      assert.ok(info.src.endsWith(width <= 540 ? 'hero-alpine-mobile.webp' : 'hero-alpine-natural-desktop.webp'), info.src);
      if (width > 540) assert.equal(info.width * 9, info.height * 16, 'Desktop is exact 16:9');
      else assert.ok(info.height > info.width, 'Mobile keeps portrait composition');
      assert.equal(await page.locator('.catalog-hero__title').count(), 1);
      const overlay = await page.locator('.catalog-hero__overlay').evaluate(el => {
        const style = getComputedStyle(el);
        return { color: style.backgroundColor, image: style.backgroundImage };
      });
      assert.equal(overlay.color, 'rgba(0, 0, 0, 0)');
      assert.ok(overlay.image.startsWith('linear-gradient('), 'Original common overlay, not an extra 20% layer');
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      if ([390, 1440, 2560].includes(width)) await page.screenshot({ path: `/tmp/kurort-alpine-hero-${width}.png` });
      console.log(`PASS hero ${width}: ${info.width}×${info.height}`);
    }
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
