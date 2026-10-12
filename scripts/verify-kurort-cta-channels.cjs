const { chromium } = require(process.env.PLAYWRIGHT_PATH || '/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
  try {
    for (const width of [320, 390, 768, 1024, 1366, 1440, 1920, 2560]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      await page.goto('http://127.0.0.1:8769/kurortnaya/', { waitUntil: 'domcontentloaded' });
      await page.locator('.catalog-contact__methods').waitFor();
      await page.waitForFunction(() => document.querySelector('link[href*="ui-kit.css"]')?.sheet);
      await page.evaluate(() => document.fonts.ready);
      for (const prefix of ['catalog-consultation', 'catalog-contact']) {
        const methods = page.locator(`.${prefix}__methods`);
        const boxes = await methods.locator('button').evaluateAll(buttons => buttons.map(button => ({
          button: button.getBoundingClientRect().toJSON(),
          icon: button.firstElementChild.getBoundingClientRect().toJSON(),
          label: button.lastElementChild.getBoundingClientRect().toJSON(),
          svg: button.querySelector('svg').getBoundingClientRect().toJSON(),
          text: button.textContent.trim()
        })));
        assert.equal(boxes.length, 4);
        for (const box of boxes) {
          assert.ok(box.icon.left >= box.button.left + 8 && box.label.right <= box.button.right - 8, `${width} ${prefix} ${box.text}: content fits`);
          assert.ok(box.label.left - box.icon.right >= 7.9, 'Icon/text gap');
          assert.ok(Math.abs((box.icon.top + box.icon.height / 2) - (box.label.top + box.label.height / 2)) < 1, 'Vertical centering');
          assert.equal(box.icon.width, box.svg.width, 'SVG fits icon slot');
          assert.ok(Math.abs(box.button.width - boxes[0].button.width) < 1, 'Equal button widths');
        }
        for (const [top, bottom] of [[boxes[0], boxes[2]], [boxes[1], boxes[3]]]) {
          assert.ok(Math.abs(top.icon.left - bottom.icon.left) < 1, `${width} ${prefix}: icons align in each column`);
          assert.ok(Math.abs(top.label.left - bottom.label.left) < 1, 'Labels align in each column');
        }
        const buttons = methods.locator('button');
        await buttons.nth(1).click();
        assert.equal(await buttons.nth(1).getAttribute('aria-selected'), 'true');
        await buttons.nth(3).click();
        assert.equal(await buttons.nth(3).getAttribute('aria-selected'), 'true');
        if ([390, 1440, 2560].includes(width)) {
          await methods.screenshot({ path: `/tmp/${prefix}-channels-${width}.png` });
        }
      }
      console.log(`PASS CTA channels ${width}px: aligned icons/labels, no clipping, MAX/Telegram selection`);
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
