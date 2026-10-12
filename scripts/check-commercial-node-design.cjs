/* Contract regression for the approved Kurortnaya design adapted to commerce. */
const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs/promises');
const toolkit=process.env.WEB_CAPTURE_TOOLKIT||'/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit';
const {chromium}=require(path.join(toolkit,'node_modules/playwright'));
(async()=>{
  const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:900}});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto('file://'+path.resolve(__dirname,'../kommercheskaya-nedvizhimost/index.html'));
    await page.evaluate(async()=>{
      await document.fonts.ready;
      document.querySelectorAll('img').forEach(image=>image.loading='eager');
      await Promise.all([...document.images].map(image=>image.decode().catch(()=>{})));
    });
    assert.equal(await page.locator('.catalog-grid__header>.catalog-section-eyebrow').textContent(),'Каталог');
    assert.equal(await page.locator('[data-listing-mode],.catalog-mode-switch').count(),0,'No new-build/secondary switch in commerce');
    assert.equal(await page.locator('.apartment-card--catalog').count(),12,'Keep all real commercial lots');
    assert.equal(await page.locator('.listing-card-price-row>.apartment-card__lotid').count(),12,'Lot IDs belong next to their prices');
    assert.equal(await page.locator('.catalog-mode-filters .catalog-quick-filters__caption').first().textContent(),'Тип недвижимости');
    const results=[];
    for(const width of [320,390,540,541,768,1024,1280,1440,1441,1920,2560]){
      await page.setViewportSize({width,height:900});
      // Responsive map states replace tile images when the viewport changes.
      await page.evaluate(()=>Promise.all([...document.images].map(image=>image.decode().catch(()=>{}))));
      const metrics=await page.evaluate(()=>{
        const css=selector=>{const s=getComputedStyle(document.querySelector(selector));return {size:s.fontSize,weight:s.fontWeight,line:s.lineHeight,color:s.color};};
        return {title:css('.catalog-grid__title'),eyebrow:css('.catalog-grid__header>.catalog-section-eyebrow'),name:css('.apartment-card__name-text'),price:css('.apartment-card__price'),filter:css('.catalog-quick-filters__caption'),sort:css('.catalog-grid__sort-select'),overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(e=>!e.complete||!e.naturalWidth).map(e=>e.getAttribute('src'))};
      });
      assert.equal(metrics.title.size,width<=540?'22px':width>=1441?'44px':'38px');
      assert.equal(metrics.title.weight,'300');
      assert.equal(metrics.eyebrow.size,width<=540?'12px':'14px');
      assert.equal(metrics.name.size,width<=540?'20px':'22px');
      assert.equal(metrics.name.weight,'400');
      assert.equal(metrics.price.size,width<=540?'24px':'26px');
      assert.equal(metrics.price.weight,'500');
      assert.equal(metrics.filter.size,width>=1441?'19px':'17px');
      assert.equal(metrics.sort.size,metrics.filter.size);
      assert.equal(metrics.overflow,false,`No horizontal overflow at ${width}`);
      assert.deepEqual(metrics.broken,[]);
      results.push({width,...metrics});
    }
    await page.setViewportSize({width:1440,height:900});
    await page.locator('.catalog-mode-filters .catalog-quick-filters__button').first().click();
    await page.getByRole('dialog',{name:'Фильтры',exact:true}).waitFor({state:'visible'});
    await page.keyboard.press('Escape');
    assert.deepEqual(errors,[]);
    await fs.writeFile(path.resolve(__dirname,'../kommercheskaya-nedvizhimost/node-design-verification.json'),JSON.stringify({reference:'https://daniilterekh-prog.github.io/barn-estate-homepage-clone/kurortnaya/',verifiedAt:new Date().toISOString(),scope:'Commercial adaptation: existing lots and blocks; no new-build/secondary toggle or invented launches/projects',results,errors},null,2)+'\n');
    console.log('PASS: commercial node design at 11 widths, original 12 lots/IDs, type filter, no residential mode toggle, no missing images/overflow/browser errors.');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
