import assert from 'node:assert/strict';

const { chromium } = await import(process.env.CAPTURE_TOOLKIT + '/node_modules/playwright/index.mjs');
const url = process.env.COUNTRY_CTA_URL || new URL('../zagorodnaya-nedvizhimost/index.html', import.meta.url).href;
const widths = [320, 360, 390, 540, 541, 768, 769, 1024, 1025, 1280, 1440, 1441, 1600, 1920, 2560];
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
const results = [];
try {
  const page = await browser.newPage();
  for (const width of widths) {
    await page.setViewportSize({ width, height: 1080 });
    await page.goto(url);
    await page.waitForFunction(() =>
      document.querySelector('.catalog-consultation__methods')?.dataset.contactMethodsReady === 'true' &&
      [...document.querySelectorAll('link[data-kurortnaya-ui-kit]')].every(link => link.sheet)
    );
    await page.evaluate(() => document.fonts.ready);
    const blocks = await page.evaluate(() => ['catalog-consultation', 'catalog-contact'].map(prefix => {
      const methods = document.querySelector('.' + prefix + '__methods');
      const form = document.querySelector('.' + prefix + '__form');
      const rect = methods.getBoundingClientRect();
      const formRect = form.getBoundingClientRect();
      return {
        prefix, width: rect.width, formWidth: formRect.width,
        left: rect.left, formLeft: formRect.left, right: rect.right, formRight: formRect.right,
        buttons: [...methods.querySelectorAll('button')].map(button => {
          const b = button.getBoundingClientRect();
          return { text: button.textContent.trim(), left: b.left, right: b.right, width: b.width,
            clipped: button.scrollWidth > button.clientWidth + 1 };
        })
      };
    }));
    for (const block of blocks) {
      assert.ok(Math.abs(block.left - block.formLeft) < 1 && Math.abs(block.right - block.formRight) < 1,
        `${width}px ${block.prefix}: channels ${block.width}px exceed/misalign with form ${block.formWidth}px`);
      assert.equal(block.buttons.length, 4);
      for (const button of block.buttons) {
        assert.ok(button.left >= block.formLeft - 1 && button.right <= block.formRight + 1,
          `${width}px ${block.prefix}: ${button.text} outside form`);
        assert.equal(button.clipped, false, `${width}px ${block.prefix}: ${button.text} clipped`);
      }
      const selector = '.' + block.prefix + '__method';
      await page.locator(selector).filter({ hasText: /MAX/ }).click();
      assert.equal(await page.locator(selector + '[aria-selected="true"]').textContent().then(s => s.trim()), 'MAX');
      await page.locator(selector).filter({ hasText: /Telegram/ }).focus();
      await page.keyboard.press('Enter');
      assert.equal(await page.locator(selector + '[aria-selected="true"]').textContent().then(s => s.trim()), 'Telegram');
    }
    results.push({ width, blocks });
  }
  console.log(JSON.stringify({ pass: true, widths, results }, null, 2));
} finally {
  await browser.close();
}
