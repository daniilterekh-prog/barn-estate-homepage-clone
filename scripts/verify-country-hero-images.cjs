const assert = require('node:assert/strict');
const path = require('node:path');

const toolkit = process.env.CAPTURE_TOOLKIT;
if (!toolkit) throw new Error('Set CAPTURE_TOOLKIT to the existing capture toolkit.');
const {chromium} = require(path.join(toolkit, 'node_modules/playwright'));
const url = process.env.COUNTRY_URL || 'http://127.0.0.1:4188/zagorodnaya-nedvizhimost/';

(async () => {
  const browser = await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
  try {
    for (const width of [320,390,540,541,768,1024,1440,1920]) {
      const page = await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:'reduce'});
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(url,{waitUntil:'domcontentloaded'});
      await page.locator('.catalog-hero__image').evaluate(image => image.decode());
      const result = await page.evaluate(() => {
        const media = document.querySelector('.catalog-hero__media');
        const image = media.querySelector('.catalog-hero__image');
        const outer = media.getBoundingClientRect(), inner = image.getBoundingClientRect();
        return {
          source:new URL(image.currentSrc).pathname,
          naturalWidth:image.naturalWidth,
          naturalHeight:image.naturalHeight,
          media:[outer.width,outer.height],
          image:[inner.width,inner.height],
          objectFit:getComputedStyle(image).objectFit,
          overflow:document.documentElement.scrollWidth>innerWidth,
          titleVisible:!!document.querySelector('.catalog-hero__title')?.getClientRects().length
        };
      });
      assert.ok(result.source.endsWith(width<=540?'hero-estate-mobile.png':'hero-estate-desktop.png'),`${width}: wrong hero image`);
      assert.deepEqual([result.naturalWidth,result.naturalHeight],width<=540?[941,1672]:[2172,724]);
      assert.ok(result.media.every((value,index)=>Math.abs(value-result.image[index])<1),`${width}: image does not fill hero`);
      assert.equal(result.objectFit,'cover');
      assert.equal(result.overflow,false);
      assert.equal(result.titleVisible,true);
      assert.deepEqual(errors,[]);
      if ([390,768,1024,1440].includes(width)) await page.locator('.catalog-hero').screenshot({path:`/tmp/country-hero-${width}.png`});
      console.log(JSON.stringify({width,source:path.basename(result.source),size:result.media,overflow:result.overflow}));
      await page.close();
    }
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
