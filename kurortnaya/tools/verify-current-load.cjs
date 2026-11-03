/** Current HTML must be present before scripts; loading must not duplicate resources or controls. */
const {chromium} = require(process.env.PLAYWRIGHT_PATH || '/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = process.argv[2] || 'http://127.0.0.1:8875/kurortnaya/';
const checks = [];
(async () => {
  const browser = await chromium.launch({executablePath:'/usr/bin/google-chrome'});
  try {
    for (const width of [390, 900, 1440, 2560]) {
      const context = await browser.newContext({viewport:{width,height:1000}});
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('response', r => { if(r.status() >= 400) errors.push(r.status()+' '+r.url()); });
      // Delay runtime, rather than hiding it: the source must already be the current interface.
      await page.route('**/js/ui-kit-runtime.js*', async route => {
        await new Promise(resolve => setTimeout(resolve, 1100));
        await route.continue();
      });
      await page.goto(base+'#catalog-grid', {waitUntil:'commit'});
      await page.locator('.catalog-toolbar__primary').waitFor();
      assert.equal(await page.locator('.catalog-mode-toolbar').count(), 1);
      assert.equal(await page.locator('.catalog-mode-filters .catalog-quick-filters__button').count(), 4);
      assert.equal(await page.locator('[data-brand-context=listing] input').count(), 2);
      assert.equal(await page.locator('.catalog-grid__inner > .catalog-quick-filters').count(), 0);
      assert.equal(await page.locator('.catalog-mode-switch').count(), 0);
      assert.equal(await page.locator('#catalog-grid').getByText('Не выбрано',{exact:true}).count(), 0);
      await page.waitForFunction(() => window.BarnesFilters && window.BarnesMapBrowser && window.BarnEstateBrandFilters);
      await page.locator('.catalog-market .resort-select-trigger').waitFor();
      const links = await page.evaluate(() => [...document.querySelectorAll('link[rel=stylesheet]')].map(e => new URL(e.href).pathname));
      assert.equal(new Set(links).size, links.length, 'styles must be loaded once');
      const flags = page.locator('[data-brand-context=listing] input');
      await flags.first().check();
      assert.deepEqual(await page.evaluate(() => BarnesFilters.getState().brandFlags), ['selection']);
      await page.evaluate(() => BarnesFilters.reset());
      const market = page.locator('.catalog-market .resort-select-trigger');
      await market.click();
      await page.getByRole('option',{name:'Вторичная',exact:true}).click();
      assert.equal(await page.locator('[data-listing-mode=secondary]').isVisible(), true);
      assert.equal(await page.locator('[data-listing-mode=new-build]').isVisible(), false);
      await page.unroute('**/js/ui-kit-runtime.js*');
      await page.reload({waitUntil:'networkidle'});
      await page.waitForFunction(() => window.BarnesFilters && window.BarnesMapBrowser && window.BarnEstateBrandFilters);
      assert.equal(await page.locator('.catalog-mode-toolbar').count(), 1);
      assert.equal(await page.locator('.catalog-result-summary').count(), 1);
      assert.equal(await page.locator('.resort-quick-dropdown').count(), 1);
      assert.equal(await page.locator('[data-brand-context=listing]').count(), 1);
      assert.equal(await page.locator('[data-brand-context=map]').count(), 1);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      assert.deepEqual(errors, []);
      checks.push({width, currentSource:true, delayedRuntime:true, uniqueStyles:true, warmReload:true, checkboxes:true, separatedMarkets:true, noOverflow:true});
      console.log('PASS current load', width);
      await context.close();
    }
    for (const view of ['index.html','mobile.html']) {
      const page = await browser.newPage({javaScriptEnabled:false});
      await page.goto(new URL(view,base).href);
      assert.equal(await page.locator('.catalog-toolbar__primary').count(),1);
      assert.equal(await page.locator('[data-brand-context=listing] input').count(),2);
      assert.equal(await page.locator('.catalog-grid__item').count(),2);
      checks.push({view, currentSourceWithoutJavaScript:true});
      await page.close();
    }
  } finally { await browser.close(); }
  fs.writeFileSync(process.env.CURRENT_LOAD_REPORT || path.resolve(__dirname,'../verification/current-load-2026-11-03.json'),JSON.stringify({base,checks},null,2)+'\n');
})().catch(error => { console.error(error); process.exitCode=1; });
