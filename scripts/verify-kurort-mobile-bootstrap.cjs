const { chromium, devices } = require(process.env.PLAYWRIGHT_PATH || '/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
  try {
    for (const scenario of ['fast', 'slow', 'fallback']) {
      const page = await browser.newPage({ ...devices['iPhone 13'] });
      let runtimeRequests = 0;
      page.on('request', req => { if (req.url().includes('/ui-kit-runtime.js')) runtimeRequests++; });
      if (scenario !== 'fast') await page.route('**/mobile.html', async route => {
        if (scenario === 'fallback') return route.fulfill({ status: 503, body: '' });
        await new Promise(resolve => setTimeout(resolve, 1500));
        await route.continue();
      });
      await page.goto((process.env.KURORT_BASE_URL || 'http://127.0.0.1:8769/kurortnaya/'), { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2200);
      assert.equal(runtimeRequests, 1, 'Initialize only the final document, not the replaced desktop document');
      const modal = page.locator('.resort-filters');
      for (const selector of ['.catalog-hero-filters__filter-icon', '.catalog-mode-detailed-filters__label--mobile', '.map-browser__filter-toggle']) {
        if (selector.startsWith('.map')) await page.locator('.catalog-projects-map__fullscreen').tap();
        await page.locator(selector).tap();
        await modal.waitFor({ state: 'visible', timeout: 5000 });
        assert.equal(await modal.count(), 1);
        await modal.locator('.hero-filter-modal__close').tap();
        await modal.waitFor({ state: 'hidden' });
        if (selector.startsWith('.map')) await page.locator('.map-browser__close').tap();
      }
      console.log(`PASS mobile bootstrap ${scenario}: one runtime, touch opens hero/listing/map filters`);
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
