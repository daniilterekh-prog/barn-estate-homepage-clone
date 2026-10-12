const { chromium } = require(process.env.PLAYWRIGHT_PATH || '/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ executablePath:'/usr/bin/google-chrome', headless:true });
  try {
    for (const width of [1440,390,768,2560]) {
      const page = await browser.newPage({ viewport:{width,height:900} });
      await page.goto('http://127.0.0.1:8769/kurortnaya/', {waitUntil:'domcontentloaded'});
      const buttons = page.locator('.catalog-mode-filters .catalog-quick-filters__button');
      await buttons.first().waitFor();
      assert.equal(await buttons.count(),4,'Four quick filters, including property type');
      const widths=await buttons.evaluateAll(elements=>elements.map(el=>el.getBoundingClientRect().width));
      assert.ok(Math.max(...widths)-Math.min(...widths)<1,'All quick filters must have equal widths');
      await buttons.nth(0).click();
      const dropdown = page.locator('.resort-quick-dropdown');
      await dropdown.waitFor({state:'visible',timeout:5000});
      const type=await dropdown.getByRole('option',{name:'Сочи',exact:true}).evaluate(el=>{
        const css=getComputedStyle(el);return {family:css.fontFamily,size:css.fontSize,weight:css.fontWeight};
      });
      assert.ok(type.family.includes('Tilda Sans'),'Dropdown uses BARNES font');
      assert.equal(type.size,width>1440?'19px':'17px');
      assert.equal(type.weight,'300');
      await dropdown.getByRole('option',{name:'Сочи',exact:true}).click();
      await dropdown.waitFor({state:'hidden'});
      assert.ok((await buttons.nth(0).textContent()).includes('Сочи'));
      await buttons.nth(1).click();
      await dropdown.getByRole('option',{name:'Апартаменты',exact:true}).click();
      assert.ok((await buttons.nth(1).textContent()).includes('Апартаменты'));
      await buttons.nth(2).click();
      await dropdown.getByRole('option',{name:'до 50 млн ₽',exact:true}).click();
      await buttons.nth(3).click();
      const rect = await dropdown.evaluate(el=>el.getBoundingClientRect().toJSON());
      assert.ok(rect.x>=0 && rect.right<=width && rect.y>=0 && rect.bottom<=900);
      if(process.env.SCREENSHOT_DIR) await page.screenshot({path:`${process.env.SCREENSHOT_DIR}/quick-filter-${width}.png`});
      await dropdown.getByRole('option',{name:'Более 3',exact:true}).click();
      assert.ok((await buttons.nth(3).textContent()).includes('Более 3'));
      await page.locator('.catalog-mode-detailed-filters').click();
      const modal=page.locator('.resort-filters');
      await modal.waitFor({state:'visible'});
      assert.equal(await modal.getByLabel('Сочи',{exact:true}).isChecked(),true);
      assert.equal(await modal.getByLabel('до 50 млн ₽',{exact:true}).isChecked(),true);
      assert.equal(await modal.getByLabel('Апартаменты',{exact:true}).isChecked(),true);
      await modal.getByLabel('Апартаменты',{exact:true}).uncheck();
      await modal.getByLabel('Пентхаус',{exact:true}).check();
      await modal.getByRole('button',{name:'Применить',exact:true}).click();
      assert.ok((await buttons.nth(1).textContent()).includes('Пентхаус'));
      await page.locator('.catalog-mode-detailed-filters').click();
      await modal.getByRole('button',{name:'Сбросить фильтры',exact:true}).click();
      await modal.getByRole('button',{name:'Применить',exact:true}).click();
      assert.ok((await buttons.nth(0).textContent()).includes('Локация'));
      assert.equal((await buttons.nth(1).locator('.catalog-quick-filters__caption').textContent()).trim(), 'Тип');
      assert.ok((await buttons.nth(3).textContent()).includes('Спальни'));
      const geometry=await buttons.evaluateAll(elements=>elements.map(el=>el.getBoundingClientRect().toJSON()));
      assert.ok(geometry.every(r=>r.x>=0 && r.right<=width),'Filter buttons stay inside viewport');
      for(let i=0;i<geometry.length;i++) for(let j=i+1;j<geometry.length;j++) {
        const a=geometry[i],b=geometry[j];
        assert.ok(a.right<=b.x || b.right<=a.x || a.bottom<=b.y || b.bottom<=a.y,'Filter buttons must not overlap');
      }
      await buttons.nth(0).click();
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Escape');
      assert.equal(await dropdown.isVisible(),false);
      assert.equal(await buttons.nth(0).evaluate(el=>el===document.activeElement),true);
      await buttons.nth(1).click();
      await page.locator('.catalog-grid__title').click();
      assert.equal(await dropdown.isVisible(),false);
      console.log(`PASS quick filters ${width}px — dropdowns, selection, shared state, reset, keyboard, outside click, bounds`);
      await page.close();
    }
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
