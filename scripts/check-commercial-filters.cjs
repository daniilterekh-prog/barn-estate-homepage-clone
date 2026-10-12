/* Regression: every commercial filter entry opens the same source dialog. */
const assert = require('node:assert/strict');
const path = require('node:path');
const toolkit = process.env.WEB_CAPTURE_TOOLKIT || '/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit';
const { chromium } = require(path.join(toolkit, 'node_modules/playwright'));

(async () => {
  const browser = await chromium.launch({ executablePath:'/usr/bin/google-chrome', headless:true, args:['--no-sandbox'] });
  try {
    const page = await browser.newPage({ viewport:{width:1440,height:900} });
    const errors=[]; page.on('pageerror',error=>errors.push(error.message));
    await page.goto('file://'+path.resolve(__dirname,'../kommercheskaya-nedvizhimost/index.html'));
    assert.equal(await page.locator('[data-commercial-filters]').count(),2,'Keep hero and listing filter triggers');
    assert.equal(await page.locator('.catalog-projects-map [data-commercial-filters],.source-filter-trigger--map').count(),0,'No filter icon beside the collapsed map search');
    for (const width of [320,390,768,1440,1920]) {
      await page.setViewportSize({width,height:900});
      for (const placement of ['hero','listing']) {
        const trigger=page.locator(`[data-commercial-filters="${placement}"]`);
        await trigger.click();
        const dialog=page.getByRole('dialog',{name:'Фильтры',exact:true});
        await dialog.waitFor({state:'visible'});
        assert.equal(await trigger.getAttribute('aria-expanded'),'true');
        assert.equal(await dialog.locator('.ui-checkbox--chip').count(),15);
        assert.equal(await dialog.locator('.hero-filter-panel-content__range-input').count(),4);
        assert.equal(await dialog.locator('.hero-filter-modal__dialog').evaluate(e=>e.scrollWidth<=e.clientWidth),true);
        await page.keyboard.press('Escape');
        await dialog.waitFor({state:'detached'});
        assert.equal(await trigger.getAttribute('aria-expanded'),'false');
        assert.equal(await trigger.evaluate(e=>e===document.activeElement),true);
      }
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    }
    await page.locator('[data-commercial-filters="hero"]').click();
    const dialog=page.locator('.hero-filter-modal');
    await dialog.locator('.ui-checkbox').first().click();
    await dialog.locator('.hero-filter-panel-content__range-input').first().fill('50000000');
    await dialog.locator('.ui-switch').click();
    await dialog.locator('.hero-filter-modal__close').click();
    await page.locator('[data-commercial-filters="listing"]').click();
    assert.equal(await dialog.locator('.ui-checkbox input').first().isChecked(),true);
    assert.equal(await dialog.locator('.ui-switch input').isChecked(),true);
    assert.equal(await dialog.locator('.hero-filter-panel-content__range-input').first().inputValue(),'50000000');
    await dialog.locator('.hero-filter-modal__reset').click();
    assert.equal(await dialog.locator('input:checked').count(),0);
    assert.equal(await dialog.locator('.hero-filter-panel-content__range-input').first().inputValue(),'');
    await dialog.locator('.hero-filter-modal__apply').click();
    await dialog.waitFor({state:'detached'});
    await page.locator('[data-commercial-filters="listing"]').click();
    await page.keyboard.press('Shift+Tab');
    assert.equal(await page.locator('.hero-filter-modal__apply').evaluate(e=>e===document.activeElement),true);
    await page.keyboard.press('Tab');
    assert.equal(await page.locator('.hero-filter-modal__close').evaluate(e=>e===document.activeElement),true);
    await page.locator('.hero-filter-modal__backdrop').click({position:{x:2,y:2},force:true});
    await dialog.waitFor({state:'detached'});
    assert.deepEqual(errors,[]);
    console.log('PASS: 2 filter entries at 5 widths; no collapsed map filter icon; source fields; shared selection; reset/apply; close/backdrop/Escape; focus trap and return; no overflow/errors.');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
