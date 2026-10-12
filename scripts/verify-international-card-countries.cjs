const assert=require('node:assert/strict');
const {chromium}=require('/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const url=process.argv[2]||'http://127.0.0.1:8125/mezhdunarodnaya-nedvizhimost/';
 try{
  for(const width of [320,390,768,1440,1920]){
   await page.setViewportSize({width,height:900});await page.goto(url,{waitUntil:'load'});
   await page.waitForFunction(()=>document.querySelector('.launch-card'));
   const cards=await page.locator('.catalog-grid__item').evaluateAll(items=>items.map(item=>{const body=item.querySelector('.apartment-card__body'),address=body.querySelector('.apartment-card__address');return{market:item.dataset.listingMode,country:address?.textContent.trim(),first:body.firstElementChild===address,href:item.querySelector('.apartment-card__media-link').href};}));
   assert.equal(cards.length,16);assert.ok(cards.every(c=>c.country&&c.first&&c.href.includes(c.market==='new-build'?'/zhilye-kompleksy/':'/mezhdunarodnaya-nedvizhimost/')));
   assert.deepEqual(cards.filter(c=>c.market==='new-build').map(c=>c.country).sort(),['Армения','ОАЭ','Оман','Турция'].sort());
   assert.deepEqual(cards.filter(c=>c.market==='secondary').map(c=>c.country),['Франция','Турция','Марокко','Португалия','Франция','Греция','Люксембург','Франция','Испания','Португалия','Марокко','Франция']);
   const launches=await page.locator('.splide__slide:not(.splide__slide--clone) .launch-card__region').allTextContents();
   assert.deepEqual(launches.map(s=>s.trim()),['Турция','ОАЭ','Оман','Армения']);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   console.log('PASS',width,'16 country eyebrows + 4 launch countries; links and layout retained');
  }
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
