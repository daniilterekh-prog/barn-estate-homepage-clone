const { chromium, devices } = require(process.env.PLAYWRIGHT_PATH || '/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
  try {
    for (const width of [320, 390, 540]) {
      const page = await browser.newPage({ ...devices['iPhone 13'], viewport: { width, height: 900 } });
      await page.goto('http://127.0.0.1:8769/kurortnaya/');
      const toggle = page.locator('.catalog-primary-contact-toggle');
      await toggle.waitFor();
      await toggle.tap();
      const panel = page.locator('.catalog-primary-contact-panel');
      assert.equal(await panel.isVisible(), true);
      assert.equal(await panel.locator('a').count(), 4);
      assert.match(await panel.locator('a').last().getAttribute('href'), /^tel:/);
      const rect = await panel.boundingBox();
      assert.ok(rect.x >= 0 && rect.x + rect.width <= width);
      await panel.screenshot({ path: `/tmp/mobile-hero-contacts-${width}.png` });
      await page.keyboard.press('Escape');
      assert.equal(await toggle.evaluate(el => el === document.activeElement), true);
      assert.equal(await panel.isVisible(), false);
      await page.evaluate(() => window.scrollTo(0, document.querySelector('.catalog-hero').offsetHeight + 300));
      const contacts = page.locator('.catalog-sticky--visible .catalog-sticky__mobile-actions button').first();
      await contacts.tap();
      assert.equal(await page.locator('.catalog-sticky__contact-panel').isVisible(), true);
      const sticky = page.locator('.catalog-sticky--visible .catalog-sticky__callback');
      await sticky.tap();
      const modal = page.locator('.catalog-feedback-modal');
      assert.equal(await modal.isVisible(), true, 'Separate callback button opens form');
      assert.ok(await modal.locator('input[type=tel]').isVisible());
      await page.keyboard.press('Escape');
      assert.equal(await modal.isVisible(), false);
      assert.equal(await sticky.evaluate(el => el === document.activeElement), true);
      console.log(`PASS mobile headers ${width}px: hero contact picker / sticky request form, focus return`);
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
