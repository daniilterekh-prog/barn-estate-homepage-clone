const assert = require('node:assert/strict');
const path = require('node:path');
const {chromium} = require(path.join(process.env.WEB_CAPTURE_TOOLKIT || '/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit', 'node_modules/playwright'));
(async () => {
  const browser = await chromium.launch({executablePath:'/usr/bin/google-chrome', args:['--no-sandbox']});
  try {
    const page = await browser.newPage({reducedMotion:'reduce'});
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto('file://' + path.resolve(__dirname, '../kommercheskaya-nedvizhimost/index.html'));
    await page.waitForFunction(()=>document.body.dataset.commercialReferenceReady==='true');
    const toggle = page.locator('.catalog-sticky__contact-toggle');
    const panel = page.locator('#commercial-sticky-contacts');
    for (const width of [320,390,540,768,900]) {
      await page.setViewportSize({width,height:900});
      await page.evaluate(() => scrollTo(0, document.querySelector('.catalog-hero').offsetHeight + 80));
      await page.waitForTimeout(350);
      assert.equal(await toggle.isVisible(), true, `Contact toggle at ${width}px`);
      const box = await toggle.boundingBox();
      assert.ok(box.x >= 0 && box.x + box.width <= width, 'Toggle stays on screen');
      await toggle.click();
      assert.equal(await panel.isVisible(), true);
      assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
      assert.equal(await panel.locator('a').count(), 4);
      const hrefs = await panel.locator('a').evaluateAll(links => links.map(link => link.getAttribute('href')));
      assert.ok(hrefs.includes('https://wa.me/79252621650'));
      assert.ok(hrefs.includes('https://t.me/art_de_vivre_barnes'));
      assert.ok(hrefs.some(href => href.startsWith('https://max.ru/join/')));
      assert.ok(hrefs.includes('tel:74951825079'));
      const bounds = await panel.boundingBox();
      assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= width, 'Panel stays on screen');
      await page.keyboard.press('Tab');
      if (width <= 540) await page.keyboard.press('Tab'); // The new reference callback sits beside contacts.
      assert.equal(await panel.locator('a:first-child').evaluate(link => link === document.activeElement), true);
      await page.keyboard.press('Escape');
      assert.equal(await panel.isVisible(), false);
      assert.equal(await toggle.evaluate(button => button === document.activeElement), true);
      await page.keyboard.press('Enter');
      assert.equal(await panel.isVisible(), true);
      await page.mouse.click(2, 250);
      assert.equal(await panel.isVisible(), false);
      await toggle.click();
      await page.evaluate(() => scrollTo(0,0));
      await page.waitForTimeout(350);
      assert.equal(await panel.isVisible(), false);
      assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    }
    await page.setViewportSize({width:1440,height:900});
    assert.equal(await toggle.isVisible(), false);
    assert.deepEqual(errors, []);
    console.log('PASS: mobile sticky contacts at 5 widths, all 4 channels, keyboard, Escape/outside/hero dismissal, no overflow/errors.');
  } finally { await browser.close(); }
})().catch(error => {console.error(error); process.exitCode = 1;});
