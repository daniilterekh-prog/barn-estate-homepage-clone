const { chromium } = require('/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ executablePath:'/usr/bin/google-chrome', headless:true });
  try {
    for (const width of [320,390,1440,2560]) {
      const page = await browser.newPage({ viewport:{width,height:1000} });
      await page.goto((process.env.KURORT_BASE_URL || 'http://127.0.0.1:8769/kurortnaya/'));
      const popup = page.locator('.resort-quick-dropdown');
      const sort = page.locator('.catalog-grid__sort .resort-sort-trigger');
      await sort.waitFor();
      await page.locator('.catalog-mode-filters .catalog-quick-filters__button').first().click();
      const style = async () => popup.getByRole('option').first().evaluate(el => {
        const s=getComputedStyle(el);return [s.fontFamily,s.fontSize,s.fontWeight,s.padding,s.lineHeight,s.minHeight];
      });
      const reference = await style();
      await page.keyboard.press('Escape');
      for (const context of ['listing','map']) {
        if (context === 'map') {
          await page.locator('.catalog-projects-map__fullscreen').click();
          if(width<=540) await page.locator('.map-browser__handle').click();
        }
        const button = context === 'listing' ? sort : page.locator('.map-browser .resort-sort-trigger');
        await button.click();
        await popup.waitFor({state:'visible'});
        assert.equal(await popup.getAttribute('aria-label'),'Сортировка');
        assert.equal(await popup.evaluate(el=>el.inert),false);
        assert.deepEqual(await style(),reference);
        assert.equal(await popup.getByRole('option',{selected:true}).count(),1);
        const rect=await popup.boundingBox();
        assert.ok(rect.x>=0 && rect.x+rect.width<=width && rect.y>=0 && rect.y+rect.height<=1000,'Dropdown fits viewport');
        await popup.screenshot({path:`/tmp/sort-dropdown-${context}-${width}.png`});
        await page.keyboard.press('End');
        await page.keyboard.press('Enter');
        await popup.waitFor({state:'hidden'});
        assert.equal(await button.evaluate(el=>el===document.activeElement),true);
        assert.ok((await button.textContent()).includes(context==='listing'?'Площадь больше':'Сначала дороже'));
        await button.click();
        assert.equal((await popup.getByRole('option',{selected:true}).textContent()).trim(),context==='listing'?'Площадь больше':'Сначала дороже');
        await page.keyboard.press('Escape');
        if(context==='map') {
          assert.equal(await page.locator('.map-browser').isVisible(),true,'Escape closes menu, not map');
          await page.locator('.map-browser__reset').click();
          assert.equal((await button.textContent()).trim(),'По релевантности');
          for (const [field,value,label] of [['type','apartment','Апартаменты'],['location','Сочи','Сочи'],['bedrooms','4+','Более 3']]) {
            const select = page.locator(`.map-browser [data-filter="${field}"]`);
            const trigger = select.locator('..').locator('.resort-select-trigger');
            await trigger.click();
            assert.deepEqual(await style(),reference,'Map parameter menu matches sorting/listing');
            assert.equal(await popup.evaluate(el=>el.inert),false);
            await popup.getByRole('option',{name:label,exact:true}).click();
            assert.equal(await select.inputValue(),value);
            assert.equal((await trigger.textContent()).trim(),label);
          }
          await page.locator('.map-browser__reset').click();
          assert.equal(await page.locator('.map-browser [data-filter=type]').inputValue(),'');
          assert.equal((await page.locator('.map-browser [data-filter=type]').locator('..').locator('.resort-select-trigger').textContent()).trim(),'Тип объекта');
          await page.locator('.map-browser__close').click();
        }
      }
      console.log(`PASS ${width}: shared sorting design, listing/map selection, keyboard, focus, map reset, bounds`);
      await page.close();
    }
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
