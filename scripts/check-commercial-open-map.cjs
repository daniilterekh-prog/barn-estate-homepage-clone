const assert=require('node:assert/strict'),path=require('node:path');
const {chromium}=require('/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});try{
 const page=await browser.newPage({reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file://'+path.resolve(__dirname,'../kommercheskaya-nedvizhimost/index.html'));
 await page.waitForFunction(()=>document.body.dataset.commercialReferenceReady==='true');
 const trigger=page.locator('.catalog-projects-map__fullscreen').first(),map=page.getByRole('dialog',{name:'Объекты на карте'});
 for(const width of [320,390,540,768,1440,1920]){
  await page.setViewportSize({width,height:900});await trigger.click();await map.waitFor({state:'visible'});
  await page.waitForFunction(()=>document.querySelector('.map-browser__backdrop img').complete);
  assert.equal(await map.locator('.map-browser__backdrop img').evaluate(e=>e.naturalWidth>0),true);
  assert.equal(await map.locator('.map-browser__heading').textContent(),'Найдено объектов: 0');
  if(width<=540){await map.locator('.map-browser__handle').click();assert.equal(await map.locator('.map-browser__handle').getAttribute('aria-expanded'),'true');}
  await map.locator('.map-browser__filter-toggle').click();
  await page.getByRole('dialog',{name:'Фильтры',exact:true}).waitFor({state:'visible'});
  await page.keyboard.press('Escape');assert.equal(await map.isVisible(),true);
  await map.locator('a').first().focus();await page.keyboard.press('Shift+Tab');
  assert.equal(await map.locator('button').last().evaluate(e=>e===document.activeElement),true);
  await page.keyboard.press('Escape');assert.equal(await map.isVisible(),false);
  assert.equal(await trigger.evaluate(e=>e===document.activeElement),true);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 }
 assert.deepEqual(errors,[]);console.log('PASS: open map at 6 widths, source zero-results state, mobile sheet, filter layering, Escape/focus, no overflow/errors.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
