const assert=require('node:assert/strict'),path=require('node:path');
const {chromium}=require('/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});try{
 const page=await browser.newPage();await page.goto('file://'+path.resolve(__dirname,'../kommercheskaya-nedvizhimost/index.html'));
 for(const width of [320,390,540,768,1024,1280,1440,1920,2560,3840]){
  await page.setViewportSize({width,height:900});
  const boxes=await page.locator('.catalog-consultation__method').evaluateAll(buttons=>buttons.map(e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height,overflow:e.scrollWidth>e.clientWidth};}));
  assert.equal(new Set(boxes.map(b=>b.y)).size,2,`CTA grid rows at ${width}`);
  assert.ok(boxes.every(b=>Math.abs(b.w-boxes[0].w)<.1&&!b.overflow),`Equal buttons without overflow at ${width}`);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 }
 await page.locator('.catalog-consultation__method').first().click();
 assert.equal(await page.locator('.catalog-consultation__method').first().getAttribute('aria-selected'),'true');
 console.log('PASS: resort CTA grid at 10 widths up to 4K, equal aligned buttons, no overflow, channel selection retained.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
