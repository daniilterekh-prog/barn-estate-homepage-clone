const { chromium } = require(process.env.PLAYWRIGHT_PATH || '/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const assert = require('node:assert/strict');
(async()=>{
  const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true});
  try {
    for(const width of [390,1440,2560]) {
      const page=await browser.newPage({viewport:{width,height:900}});
      await page.goto((process.env.KURORT_BASE_URL || 'http://127.0.0.1:8769/kurortnaya/'),{waitUntil:'domcontentloaded'});
      const project=page.locator('[data-listing-mode=new-build].catalog-grid__item');
      await project.waitFor();
      const address=project.locator('.apartment-card__address');
      assert.equal(await address.count(),1,'Project has one address above title');
      assert.equal(await address.textContent(),'Сочи, ул. Шоссейная, 9Б');
      assert.equal(await address.evaluate(el=>el.nextElementSibling.classList.contains('apartment-card__name')),true);
      const expected=await address.evaluate(el=>{const s=getComputedStyle(el);return [s.fontFamily,s.fontSize,s.fontWeight,s.color];});
      await project.scrollIntoViewIfNeeded();
      await page.screenshot({path:`/tmp/project-address-${width}.png`});
      await page.locator('.catalog-mode-switch [data-listing-mode=secondary]').click();
      const lot=page.locator('.catalog-grid__item[data-listing-mode=secondary] .apartment-card__address');
      assert.equal(await lot.textContent(),'Сочи · Курортный проспект');
      assert.deepEqual(await lot.evaluate(el=>{const s=getComputedStyle(el);return [s.fontFamily,s.fontSize,s.fontWeight,s.color];}),expected);
      console.log(`PASS project address ${width}px — order, no duplicates, lot styling unchanged`);
      await page.close();
    }
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
