const assert=require('node:assert/strict');
const path=require('node:path');
const {chromium}=require(path.join(process.env.WEB_CAPTURE_TOOLKIT||'/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit','node_modules/playwright'));
(async()=>{
  const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto('file://'+path.resolve(__dirname,'../kommercheskaya-nedvizhimost/index.html'));
    assert.equal(await page.locator('.catalog-best-offers').count(),1,'Add the reference carousel');
    assert.equal(await page.locator('.catalog-best-offers__title').textContent(),'Выбор BARNES');
    const listing=await page.locator('.catalog-grid__item').evaluateAll(items=>items.slice(0,3).map(item=>({name:item.querySelector('.apartment-card__name-text').textContent.trim(),price:item.querySelector('.apartment-card__price').textContent.trim(),src:item.querySelector('img').getAttribute('src'),href:item.querySelector('.apartment-card__media-link').href})));
    await page.waitForFunction(()=>document.querySelectorAll('.catalog-best-offers .launch-card').length===9);
    const chosen=await page.locator('.catalog-best-offers .splide__slide:not(.splide__slide--clone)').evaluateAll(items=>items.map(item=>({name:item.querySelector('.apartment-card__name').textContent.trim(),price:item.querySelector('.apartment-card__price').textContent.trim(),src:item.querySelector('img').getAttribute('src'),href:item.querySelector('.apartment-card__link').href})));
    assert.deepEqual(chosen,listing,'Use exactly the first three real listing objects');
    assert.equal(await page.locator('.catalog-best-offers .apartment-card__delivery').count(),0,'Do not invent sale start dates');
    assert.equal(await page.locator('.catalog-grid__item').count(),12);
    for(const width of [320,390,540,768,1440,1920,2560]){
      await page.setViewportSize({width,height:900});
      await page.waitForTimeout(850);
      const section=page.locator('.catalog-best-offers');
      assert.equal(await section.locator('.splide__slide.is-visible').count(),width<=540?1:3);
      const centered=await section.locator('.splide__slide.is-visible.is-active').evaluate(slide=>{const r=slide.getBoundingClientRect();return Math.abs(r.x+r.width/2-document.body.clientWidth/2);});
      assert.equal(centered<=.5,true,`Center the active reference card at ${width}px; offset ${centered}`);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
      const before=await section.locator('.splide__pagination__page[aria-selected="true"]').getAttribute('aria-label');
      if(width<=540){
        const selected=await section.locator('.splide__pagination__page').evaluateAll(buttons=>buttons.findIndex(button=>button.getAttribute('aria-selected')==='true'));
        await section.locator('.splide__pagination__page').nth((selected+1)%3).click();
      }else await section.locator('.catalog-best-offers__nav-btn--next').click();
      const after=await section.locator('.splide__pagination__page[aria-selected="true"]').getAttribute('aria-label');
      assert.notEqual(after,before);
    }
    await page.setViewportSize({width:390,height:900});
    await page.locator('.catalog-best-offers .splide__pagination__page').nth(0).click();
    const button=page.locator('.catalog-best-offers .splide__slide.is-visible .launch-card__favorite');
    const pressed=await button.getAttribute('aria-pressed');
    await button.click();assert.notEqual(await button.getAttribute('aria-pressed'),pressed);
    assert.equal(await page.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return ids.length===new Set(ids).size;}),true,'Carousel IDs stay independent of the article slider');
    assert.deepEqual(errors,[]);
    console.log('PASS: reference selection carousel, first 3 listing objects, no invented dates, arrows/loop at 7 widths, mobile pagination, favorites, unique IDs, no overflow/errors.');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
