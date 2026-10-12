/* CITY_PLAYWRIGHT_MODULE may point to the installed web-capture-toolkit Playwright. */
const assert = require('node:assert/strict');
const { chromium } = require(process.env.CITY_PLAYWRIGHT_MODULE || 'playwright');
const base = process.argv[2] || 'http://127.0.0.1:4186/';

(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
  try {
    for (const width of [390, 768, 1366, 1920, 2560]) {
      const measurements = [];
      for (const route of ['kurortnaya', 'gorodskaya-nedvizhimost']) {
        const page = await browser.newPage({ viewport: { width, height: 900 } });
        page.setDefaultTimeout(10000);
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(new URL(route + '/', base).href, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('.catalog-feedback-modal', { state: 'attached' });
        await page.evaluate(() => document.fonts.ready);
        const trigger = page.locator('.floating-expert__card');
        await trigger.click();
        const modal = page.locator('.catalog-feedback-modal');
        await modal.waitFor({ state: 'visible' });
        const geometry = await modal.evaluate(element => {
          const rect = selector => {
            const r = element.querySelector(selector).getBoundingClientRect();
            return { x: r.x, y: r.y, width: r.width, height: r.height };
          };
          return { content: rect('.modal__content'), form: rect('.feedback-modal__body'), title: rect('.feedback-modal__title') };
        });
        measurements.push(geometry);
        if (route === 'gorodskaya-nedvizhimost') {
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
          await modal.locator('[data-channel="WhatsApp"]').click();
          assert.equal(await modal.locator('[name="phone"]').getAttribute('placeholder'), 'Номер телефона в WhatsApp');
          await modal.locator('[name="name"]').fill('Проверка');
          await modal.locator('.feedback-modal__submit').click();
          assert.equal(await modal.locator('[name="phone"]').evaluate(input => input.validity.valid), false);
          await modal.locator('[name="phone"]').fill('+7 999 000 00 00');
          await modal.locator('.feedback-modal__consent-box').click();
          assert.equal(await modal.locator('[name="consent"]').isChecked(), true);
          await modal.locator('.feedback-modal__submit').click();
          assert.match(await modal.locator('.feedback-modal__status').textContent(), /не отправлена/);
          assert.equal(await modal.locator('[name="phone"]').getAttribute('placeholder'), 'Номер телефона в Telegram');
          await modal.locator('.feedback-modal__consent-link').focus();
          await page.keyboard.press('Tab');
          assert.equal(await modal.locator('.modal__close').evaluate(element => element === document.activeElement), true);
          await page.keyboard.press('Escape');
          assert.equal(await modal.isVisible(), false);
          assert.equal(await trigger.evaluate(element => element === document.activeElement), true);
          await page.locator('.apartment-card__call-btn:visible').first().click();
          await modal.waitFor({ state: 'visible' });
          assert.equal(await page.locator('.vfm').count(), 0);
          await modal.locator('.modal__close').click();
          if (width > 580) {
            await page.locator('.catalog-sticky__request').click();
            await modal.waitFor({ state: 'visible' });
            await page.keyboard.press('Escape');
          }
        }
        assert.deepEqual(errors, []);
        await page.close();
      }
      assert.deepEqual(measurements[1], measurements[0], 'RequestModal geometry differs from reference');
      console.log(JSON.stringify({ width, referenceGeometry: measurements[0], passed: true }));
    }
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
