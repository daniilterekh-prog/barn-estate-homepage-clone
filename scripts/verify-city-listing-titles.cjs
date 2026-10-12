const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const base=process.argv[2]||'http://127.0.0.1:4186';
(async()=>{
  const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true});
  try {
    for(const width of [320,390,540,768,1024,1440,2560]){
      const page=await browser.newPage({viewport:{width,height:900}});
      await page.goto(base+'/gorodskaya-nedvizhimost/',{waitUntil:'domcontentloaded'});
      await page.waitForSelector('.city-reference-synced',{state:'attached'});
      await page.evaluate(()=>document.fonts.ready);
      for(const mode of ['project','lot']){
        await page.locator('[data-mode='+mode+']').click();
        const result=await page.locator('.catalog-grid__item:not([hidden]) .apartment-card__name-text').first().evaluate(async title=>{
          const card=title.closest('.apartment-card'),old=title.textContent;
          const frame=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
          title.textContent='Короткое';await frame();
          const shortHeight=title.getBoundingClientRect().height,shortCardHeight=card.getBoundingClientRect().height;
          const facts=card.querySelector('.listing-card-facts'),shortGap=facts.getBoundingClientRect().y-title.getBoundingClientRect().y;
          title.textContent='Очень длинное название жилого комплекса или квартиры '.repeat(12);await frame();
          const css=getComputedStyle(title);
          const result={shortHeight,longHeight:title.getBoundingClientRect().height,shortCardHeight,longCardHeight:card.getBoundingClientRect().height,shortGap,longGap:facts.getBoundingClientRect().y-title.getBoundingClientRect().y,
            whiteSpace:css.whiteSpace,overflow:css.overflow,textOverflow:css.textOverflow,clipped:title.scrollWidth>title.clientWidth};
          title.textContent='';await frame();result.emptyHeight=title.getBoundingClientRect().height;
          title.textContent=old;return result;
        });
        assert.equal(result.whiteSpace,'nowrap');assert.equal(result.overflow,'hidden');assert.equal(result.textOverflow,'ellipsis');assert.equal(result.clipped,true);
        assert.ok(Math.abs(result.longHeight-result.shortHeight)<1);
        assert.ok(Math.abs(result.emptyHeight-result.shortHeight)<1,'Reserve one title line even before its text is populated');
        assert.ok(Math.abs(result.longGap-result.shortGap)<1);
        assert.ok(Math.abs(result.longCardHeight-result.shortCardHeight)<1);
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      }
      console.log('PASS one-line ellipsis and stable project/lot geometry:',width);
      await page.close();
    }
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
