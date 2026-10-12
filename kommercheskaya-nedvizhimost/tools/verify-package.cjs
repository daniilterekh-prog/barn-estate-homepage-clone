const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const base=process.argv[2]||'http://127.0.0.1:8793/';
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',args:['--no-sandbox']});const errors=[],widths=[320,390,540,768,1440,1920,2560,3840],checks=[];
try{for(const width of widths){const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>errors.push(r.url()+': '+r.failure().errorText));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
page.on('request',r=>{if(new URL(r.url()).origin!==new URL(base).origin&&!r.url().startsWith('data:'))errors.push('External render dependency: '+r.url());});
await page.goto(base);await page.waitForFunction(()=>document.body.dataset.commercialReferenceReady==='true');
await page.evaluate(async()=>{await document.fonts.ready;document.querySelectorAll('img').forEach(i=>i.loading='eager');await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
assert.deepEqual(await page.evaluate(()=>[...document.images].filter(i=>i.currentSrc&&!i.naturalWidth).map(i=>i.src)),[]);
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
assert.equal(await page.locator('.catalog-grid__item').count(),12);
await page.locator('.catalog-projects-map__fullscreen').click();await page.locator('.map-browser').waitFor({state:'visible'});await page.keyboard.press('Escape');
await page.evaluate(()=>scrollTo(0,1200));await page.waitForFunction(()=>document.querySelector('.catalog-sticky').getAttribute('aria-hidden')==='false');
await page.locator(width<=540?'.catalog-sticky__mobile-actions .catalog-sticky__request':'.catalog-sticky__brand .catalog-sticky__request').click();await page.locator('.catalog-feedback-modal').waitFor({state:'visible'});await page.keyboard.press('Escape');
checks.push({width,passed:true});await page.close();}
assert.deepEqual(errors,[]);console.log('PASS: isolated package at 8 widths to 4K; images/fonts, local dependencies, map and popup');
}finally{await browser.close();fs.writeFileSync(path.resolve(__dirname,'../verification/package.json'),JSON.stringify({base,checks,errors,passed:checks.length===widths.length&&!errors.length},null,2)+'\n');}})().catch(e=>{console.error(e);process.exit(1)});
