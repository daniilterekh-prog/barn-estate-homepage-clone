const assert = require('node:assert/strict');
const path = require('node:path');
const {chromium} = require(path.join(process.env.WEB_CAPTURE_TOOLKIT || '/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit', 'node_modules/playwright'));
(async () => {
  const browser = await chromium.launch({executablePath:'/usr/bin/google-chrome', args:['--no-sandbox']});
  try {
    const page = await browser.newPage({reducedMotion:'reduce'});
    const errors=[]; page.on('pageerror', error => errors.push(error.message));
    await page.goto('file://' + path.resolve(__dirname,'../kommercheskaya-nedvizhimost/index.html'));
    for (const width of [320,390,540,768,1440,1920]) {
      await page.setViewportSize({width,height:900});
      const trigger=page.locator('.floating-expert__card');
      await trigger.click();
      const modal=page.getByRole('dialog',{name:'Поможем найти подходящий объект'});
      await modal.waitFor({state:'visible',timeout:1500});
      assert.equal(await modal.locator('[data-channel]').count(),4);
      assert.equal(await modal.locator('textarea[name="comment"]').count(),1);
      await modal.locator('[data-channel="MAX"]').click();
      assert.equal(await modal.locator('[name="preferredChannel"]').inputValue(),'MAX');
      assert.equal(await modal.locator('[name="phone"]').getAttribute('placeholder'),'Номер телефона в MAX');
      await modal.locator('[type="submit"]').click();
      assert.equal(await modal.locator('input:invalid').count()>0,true);
      await modal.locator('[name="name"]').fill('Тест');
      await modal.locator('[name="phone"]').fill('+7 925 000 00 00');
      await modal.locator('.feedback-modal__consent-box').click();
      assert.equal(await modal.locator('[name="consent"]').isChecked(),true);
      await modal.locator('[type="submit"]').click();
      assert.match(await modal.locator('[role="status"]').textContent(),/Для отправки заявки/);
      assert.equal(await modal.locator('.feedback-modal__hero-image').evaluate(img => img.complete && img.naturalWidth>0),true);
      const box=await modal.locator('.modal__content').boundingBox();
      assert.ok(box.x>=0 && box.x+box.width<=width);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
      await modal.locator('a').last().focus();
      await page.keyboard.press('Tab');
      assert.equal(await modal.locator('.modal__close').evaluate(e=>e===document.activeElement),true);
      await page.keyboard.press('Escape');
      assert.equal(await page.getByRole('dialog').count(),0);
      assert.equal(await trigger.evaluate(e=>e===document.activeElement),true);
    }
    await page.setViewportSize({width:1440,height:900});
    await page.locator('.floating-expert__close').click();
    for (const selector of ['.apartment-card__call-btn','.site-footer__callback-btn','.catalog-contact__card-submit','.catalog-sticky__brand .catalog-sticky__request']) {
      await page.locator(selector).first().click();
      const modal=page.locator('.catalog-feedback-modal');
      await modal.waitFor({state:'visible'});
      await modal.locator('.modal__close').click();
      assert.equal(await modal.count(),0);
    }
    assert.deepEqual(errors,[]);
    console.log('PASS: reference popup at 6 widths, channels, comment, validation, honest offline status, portrait, keyboard/focus, all request triggers, no overflow/errors.');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
