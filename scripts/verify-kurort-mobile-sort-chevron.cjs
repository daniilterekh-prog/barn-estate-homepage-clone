const { chromium } = require(process.env.PLAYWRIGHT_PATH || '/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true});
  try {
    for (const width of [320,390,540]) {
      const page = await browser.newPage({viewport:{width,height:900}});
      await page.goto('http://127.0.0.1:8769/kurortnaya/',{waitUntil:'domcontentloaded'});
      const sort = page.locator('.catalog-mode-toolbar .catalog-grid__sort');
      await sort.waitFor();
      await page.locator('.catalog-mode-filters .catalog-quick-filters__button').first().scrollIntoViewIfNeeded();
      const result = await sort.evaluate(el => {
        const rect=el.getBoundingClientRect(), css=getComputedStyle(el,'::after');
        const above=document.querySelector('.catalog-mode-filters .catalog-quick-filters__item:last-child .catalog-quick-filters__chevron');
        const filter=above.getBoundingClientRect();
        // Rotation is around the center, so the pseudo-element's horizontal center remains unchanged.
        const boxWidth=parseFloat(css.width)+(css.boxSizing==='border-box'?0:parseFloat(css.borderRightWidth)+parseFloat(css.borderLeftWidth));
        return {sortX:rect.right-parseFloat(css.right)-boxWidth/2,
          filterX:filter.x+filter.width/2, sortStroke:css.borderRightWidth,filterStroke:getComputedStyle(above).borderRightWidth};
      });
      console.log(width,result);
      assert.ok(Math.abs(result.sortX-result.filterX)<0.1,`Sorting arrow must align with filter above (${width}px)`);
      assert.equal(result.sortStroke,result.filterStroke);
      const select=sort.locator('select');
      const values=await select.locator('option').evaluateAll(options=>options.map(el=>el.value));
      if(values.length>1) {await select.selectOption(values[1]); assert.equal(await select.inputValue(),values[1]);}
      await sort.scrollIntoViewIfNeeded();
      await page.screenshot({path:`/tmp/mobile-sort-chevron-${width}.png`});
      console.log(`PASS mobile sort arrow ${width}px — alignment, stroke, selection`);
      await page.close();
    }
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
