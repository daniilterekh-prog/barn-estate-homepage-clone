const assert=require('node:assert/strict');
const {chromium}=require('/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const url=process.argv[2]||'http://127.0.0.1:8125/mezhdunarodnaya-nedvizhimost/';
 try{
  for(const width of [320,390,540,768,1024,1440,1920]){
   await page.setViewportSize({width,height:900});await page.goto(url,{waitUntil:'load'});await page.evaluate(()=>document.fonts.ready);
   for(const mode of ['new-build','secondary']){
    await page.locator('button[data-listing-mode='+mode+']').click();
    const result=await page.locator('.catalog-grid__item:not([hidden]) .apartment-card__name-text').first().evaluate(e=>{
     e.parentElement.classList.add('apartment-card__name--city');
     e.textContent='Очень длинное название зарубежной недвижимости '.repeat(8);
     const s=getComputedStyle(e),r=e.getBoundingClientRect();return{nowrap:s.whiteSpace,ellipsis:s.textOverflow,overflow:s.overflow,height:r.height,line:parseFloat(s.lineHeight),clipped:e.scrollWidth>e.clientWidth};
    });
    assert.equal(result.nowrap,'nowrap');assert.equal(result.ellipsis,'ellipsis');assert.equal(result.overflow,'hidden');assert.ok(result.clipped);assert.ok(result.height<=result.line+1);
   }
   await page.locator('.catalog-projects-map__fullscreen').click();if(width<=540)await page.locator('.map-browser__handle').click();
   const titles=await page.locator('.map-browser__card h3').evaluateAll(es=>es.map(e=>{const s=getComputedStyle(e);return{nowrap:s.whiteSpace,ellipsis:s.textOverflow,height:e.getBoundingClientRect().height,line:parseFloat(s.lineHeight)};}));
   assert.equal(titles.length,12);assert.ok(titles.every(t=>t.nowrap==='nowrap'&&t.ellipsis==='ellipsis'&&t.height<=t.line+1));
   const heading=page.locator('.map-browser__card h3').first();
   const before=await heading.evaluate(e=>e.closest('article').getBoundingClientRect().height);
   await heading.evaluate(e=>e.textContent='Очень длинное название '.repeat(20));
   const after=await heading.evaluate(e=>e.closest('article').getBoundingClientRect().height);
   assert.ok(Math.abs(after-before)<1,'Long title changes map card height');
   console.log('PASS',width,'catalog/alternate title style/map: single line and stable height');
  }
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
