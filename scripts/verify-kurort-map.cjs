// Run with the existing web-capture-toolkit Playwright installation.
const { chromium } = require(process.env.PLAYWRIGHT_PATH || '/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
  try {
    for (const width of [1440, 390, 2560]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      await page.goto('http://127.0.0.1:8769/kurortnaya/');
      await page.locator('.catalog-projects-map__fullscreen').click();
      const dialog = page.locator('.map-browser');
      await dialog.waitFor({ state: 'visible', timeout: 5000 });
      if (width < 541) await page.getByRole('button', { name: 'Развернуть список объектов' }).click();
      await page.locator('.map-browser__card').first().waitFor();
      assert.equal(await page.locator('.map-browser__card').count(), 32);
      await page.getByRole('searchbox', { name: 'Поиск объектов на карте' }).fill('GRAND HOTEL');
      assert.equal(await page.locator('.map-browser__card').count(), 1);
      await page.getByRole('searchbox', { name: 'Поиск объектов на карте' }).fill('нет-такого-объекта');
      assert.equal(await page.locator('.map-browser__card').count(), 0);
      await page.getByRole('button', { name: 'Сбросить фильтры' }).click();
      assert.equal(await page.locator('.map-browser__card').count(), 32);
      await page.getByLabel('Цена до, ₽').fill('1');
      assert.equal(await page.locator('.map-browser__card').count(), 0);
      await page.getByRole('button', { name: 'Сбросить фильтры' }).click();
      await page.getByLabel('Тип объекта', { exact: true }).selectOption('lot');
      assert.equal(await page.locator('.map-browser__card').count(), 0);
      await page.getByRole('button', { name: 'Сбросить фильтры' }).click();
      await dialog.getByRole('button', { name: 'Подробные фильтры' }).click();
      await page.getByLabel('Сортировка', { exact: true }).selectOption('asc');
      const prices = await page.locator('.map-browser__card p').allTextContents();
      const numeric = prices.filter(s => /\d/.test(s)).map(s => Number(s.replace(/[^0-9]/g, '')));
      assert.ok(numeric.every((n, i) => i === 0 || n >= numeric[i - 1]));
      await page.getByRole('button', { name: 'Сбросить фильтры' }).click();
      const overflow = await dialog.evaluate(el => el.scrollWidth > el.clientWidth);
      assert.equal(overflow, false);
      await page.keyboard.press('Escape');
      await dialog.waitFor({ state: 'hidden' });
      assert.equal(await page.evaluate(() => document.body.style.overflow), '');
      assert.equal(await page.locator('.catalog-projects-map__fullscreen').evaluate(el => el === document.activeElement), true);
      await page.locator('.catalog-projects-map__fullscreen').click();
      await page.getByRole('button', { name: 'Закрыть полноэкранный режим карты' }).click();
      await dialog.waitFor({ state: 'hidden' });
      console.log(`PASS: map panel ${width}px — search, price, reset, close, focus, overflow`);
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
