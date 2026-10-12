const assert=require('node:assert/strict');
const {chromium}=require('/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const base=process.argv[2]||'http://127.0.0.1:8125/mezhdunarodnaya-nedvizhimost/';
 try{
  for(const path of ['', 'standalone/'])for(const width of [320,390,540,541,768,1440,1920]){
   await page.setViewportSize({width,height:900});await page.goto(new URL(path,base).href,{waitUntil:'load'});
   const hero=page.locator('.catalog-hero__image');await hero.evaluate(img=>img.decode());
   const src=await hero.evaluate(img=>img.currentSrc);
   assert.ok(src.endsWith(width<=540?'hero-mobile-villa.png':'9783a5a60ad7ae44-be19a5749214443d45f5e54fdf0fdd03.png'));
   assert.equal(await page.locator('.site-header__logo').count(),1);
   assert.equal(await page.locator('.catalog-hero__title').count(),1);
   assert.equal(await page.locator('.catalog-grid__item').count(),16);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   if(path===''&&[390,1440].includes(width))await page.screenshot({path:'/tmp/international-hero-'+width+'.png'});
   console.log('PASS',path||'main',width,width<=540?'mobile':'desktop');
  }
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
