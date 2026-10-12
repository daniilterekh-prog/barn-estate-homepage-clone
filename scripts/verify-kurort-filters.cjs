const { chromium } = require(process.env.PLAYWRIGHT_PATH || '/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
  try {
    for (const width of [1440, 390, 2560]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      await page.goto('http://127.0.0.1:8769/kurortnaya/', { waitUntil: 'domcontentloaded' });
      const modal = page.locator('.resort-filters');
      await page.locator('.catalog-hero-filters__filter-icon').click();
      await modal.waitFor({ state: 'visible', timeout: 5000 });
      assert.equal(await page.locator('.resort-filters').count(), 1);
      const geometry = await modal.locator('.hero-filter-modal__dialog').evaluate(el => ({
        width: el.getBoundingClientRect().width, color: getComputedStyle(el).backgroundColor,
        title: getComputedStyle(el.querySelector('h2')).fontSize,
        section: getComputedStyle(el.querySelector('.hero-filter-panel-content__title')).fontSize
      }));
      assert.equal(geometry.width, width <= 540 ? await page.evaluate(() => document.documentElement.clientWidth) : 640);
      assert.equal(geometry.color, 'rgb(41, 41, 41)');
      assert.equal(geometry.title, '24px');
      assert.equal(geometry.section, '18px');
      if (process.env.SCREENSHOT_DIR) await page.screenshot({ path: `${process.env.SCREENSHOT_DIR}/resort-filters-${width}.png` });
      assert.ok(!(await modal.textContent()).includes('Хамовники'));
      await modal.getByLabel('Сочи', { exact: true }).check();
      await modal.getByLabel('Цена от, ₽', { exact: true }).fill('10000000');
      await modal.getByLabel('Цена до, ₽', { exact: true }).fill('1');
      await modal.getByRole('button', { name: 'Применить', exact: true }).click();
      assert.equal(await modal.isVisible(), true);
      assert.equal(await modal.getByLabel('Цена от, ₽', { exact: true }).getAttribute('aria-invalid'), 'true');
      await modal.getByLabel('Цена до, ₽', { exact: true }).fill('');
      await modal.getByRole('button', { name: 'Применить', exact: true }).click();
      await modal.waitFor({ state: 'hidden' });
      await page.locator('.catalog-mode-detailed-filters').click();
      await modal.waitFor({ state: 'visible' });
      await modal.locator('.hero-filter-modal__close').focus();
      await page.keyboard.press('Shift+Tab');
      assert.equal(await modal.locator('.hero-filter-modal__apply').evaluate(el => el === document.activeElement), true);
      await page.keyboard.press('Tab');
      assert.equal(await modal.locator('.hero-filter-modal__close').evaluate(el => el === document.activeElement), true);
      assert.equal(await modal.getByLabel('Сочи', { exact: true }).isChecked(), true);
      assert.equal(await modal.getByLabel('Цена от, ₽', { exact: true }).inputValue(), '10000000');
      await modal.getByLabel('Алтай', { exact: true }).check();
      await page.keyboard.press('Escape');
      await modal.waitFor({ state: 'hidden' });
      await page.locator('.catalog-projects-map__fullscreen').click();
      await page.locator('.map-browser__filter-toggle').click();
      await modal.waitFor({ state: 'visible' });
      assert.equal(await modal.getByLabel('Алтай', { exact: true }).isChecked(), false, 'cancel must discard draft');
      const drawer=await modal.locator('.hero-filter-modal__dialog').evaluate(el=>({
        rect:el.getBoundingClientRect().toJSON(),background:getComputedStyle(el).backgroundColor,
        shadow:getComputedStyle(el).boxShadow,section:getComputedStyle(el.querySelector('.hero-filter-panel-content__title')).fontSize
      }));
      assert.equal(drawer.background,'rgb(255, 255, 255)','Map filters use white drawer');
      assert.equal(drawer.shadow,'none','No new shadows');
      assert.equal(drawer.rect.width,width<=540?width:Math.min(520,width-420));
      assert.equal(drawer.rect.right,await page.locator('.map-browser').evaluate(el=>el.getBoundingClientRect().right));
      assert.equal(drawer.rect.top,0);
      assert.equal(drawer.rect.height,900);
      assert.equal(drawer.section,'14px');
      assert.equal(await modal.locator('.ui-checkbox--chip').count(),0,'White map drawer uses source checkboxes, not dark chips');
      assert.equal(await modal.locator('[name=propertyTypes]').first().evaluate(el=>getComputedStyle(el.parentElement.querySelector('.ui-checkbox__label')).fontSize),'18px');
      if(process.env.SCREENSHOT_DIR) await page.screenshot({path:`${process.env.SCREENSHOT_DIR}/map-filter-drawer-${width}.png`});
      assert.equal(await modal.getByLabel('Сочи', { exact: true }).isChecked(), true);
      const overflow = await modal.locator('.hero-filter-modal__dialog').evaluate(el => el.scrollWidth > el.clientWidth);
      assert.equal(overflow, false);
      await modal.getByRole('button', { name: 'Сбросить фильтры', exact: true }).click();
      assert.equal(await modal.getByLabel('Сочи', { exact: true }).isChecked(), false);
      await modal.getByRole('button', { name: 'Применить', exact: true }).click();
      await modal.waitFor({ state: 'hidden' });
      assert.equal(await page.locator('.map-browser').isVisible(), true, 'closing filters must preserve map');
      assert.equal(await page.locator('.map-browser__filter-toggle').evaluate(el => el === document.activeElement), true);
      await page.getByRole('button', { name: 'Закрыть полноэкранный режим карты' }).click();
      assert.equal(await page.evaluate(() => document.body.style.overflow), '');
      await page.locator('.catalog-hero-filters__filter-icon').click();
      assert.equal(await modal.locator('.hero-filter-modal__dialog').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(41, 41, 41)','Hero keeps dark modal after map drawer');
      await page.keyboard.press('Escape');
      console.log(`PASS: shared resort filters ${width}px — three entry points, apply, cancel, reset, map nesting, overflow`);
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
