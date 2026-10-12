// Compare a served/published commercial page with the user's exact local reference.
const assert = require('node:assert/strict');
const {pathToFileURL} = require('node:url');
const {chromium} = require('/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const {PNG} = require('/home/daniil/.local/share/codex-toolkit/node_modules/pngjs');
const reference = pathToFileURL('/home/daniil/Documents/ChatGPT/САЙТ/kommercheskaya-nedvizhimost/index.html').href;
const target = process.argv[2] || 'http://127.0.0.1:8769/kommercheskaya-nedvizhimost/';
(async () => {
  const {default: pixelmatch} = await import('/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/pixelmatch/index.js');
  const browser = await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
  try {
    for (const width of [320,390,540,768,1440,1920]) {
      const pages = [];
      const captures = [];
      for (const url of [reference,target]) {
        const page = await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
        pages.push(page);
        const errors=[];
        page.on('pageerror',e=>errors.push(e.message));
        page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
        await page.goto(url);
        await page.waitForFunction(()=>document.body.dataset.commercialReferenceReady==='true');
        await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'});
        await page.evaluate(async()=>{
          const images=[...document.images];images.forEach(image=>image.loading='eager');
          await Promise.all(images.map(image=>image.decode().catch(()=>{})));
          await document.fonts.ready;
        });
        assert.equal(await page.locator('.catalog-grid__item').count(),12);
        assert.equal(await page.locator('.catalog-hero-filters__submit').innerText(),'Найти');
        assert.deepEqual(errors,[]);
        captures.push(PNG.sync.read(await page.screenshot({fullPage:true})));
      }
      const compare=(a,b,label)=>{
        assert.equal(a.width,b.width,label+' width');assert.equal(a.height,b.height,label+' height');
        const pixels=pixelmatch(a.data,b.data,null,a.width,a.height,{threshold:0.1});
        assert.equal(pixels,0,`${label}: ${pixels} different pixels at ${width}px`);
      };
      compare(...captures,'Full page');
      for(const page of pages){
        await page.locator('.catalog-projects-map__fullscreen').click();
        if(width<=540)await page.locator('.map-browser__handle').click();
        await page.locator('.commercial-map-quick').first().click();
      }
      compare(...await Promise.all(pages.map(async page=>PNG.sync.read(await page.screenshot()))),'Map type dropdown');
      console.log(`PASS ${width}px: full page and open-map dropdown match local reference`);
      for(const page of pages)await page.close();
    }
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exit(1);});
