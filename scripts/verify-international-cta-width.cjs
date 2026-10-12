const assert = require('node:assert/strict');
const { chromium } = require('/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const url = process.argv[2] || 'http://127.0.0.1:8125/mezhdunarodnaya-nedvizhimost/';
  try {
    for (const width of [320, 390, 540, 541, 768, 1024, 1440, 1920, 2560]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(url, { waitUntil: 'networkidle' });
      const results = await page.evaluate(() => ['consultation', 'contact'].map(name => {
        const methods = document.querySelector('.catalog-' + name + '__methods');
        const form = document.querySelector('.catalog-' + name + '__form').getBoundingClientRect();
        const bounds = methods.getBoundingClientRect();
        return {
          name,
          aligned: Math.abs(bounds.left - form.left) < 1 && Math.abs(bounds.right - form.right) < 1,
          buttonsFit: [...methods.children].every(button => {
            const rect = button.getBoundingClientRect();
            return rect.left >= form.left - 1 && rect.right <= form.right + 1 && button.scrollWidth <= button.clientWidth;
          })
        };
      }));
      for (const result of results) assert.ok(result.aligned && result.buttonsFit, JSON.stringify({ width, ...result }));
      console.log('PASS', width, results);
    }
    await page.locator('.catalog-consultation__methods').screenshot({ path: '/tmp/international-cta-width.png' });
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
