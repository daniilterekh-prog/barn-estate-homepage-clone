const assert=require('node:assert/strict'),path=require('node:path');
const {chromium}=require('/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const {PNG}=require('/home/daniil/.local/share/codex-toolkit/node_modules/pngjs');
(async()=>{
 const {default:pixelmatch}=await import('/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/pixelmatch/index.js');
 const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 try{for(const width of [320,390,540,768,1024,1440,1920,2560,3840]){
  const pages=[],images=[];
  for(const url of ['https://daniilterekh-prog.github.io/barn-estate-homepage-clone/kurortnaya/',process.argv[2]||'file://'+path.resolve(__dirname,'../kommercheskaya-nedvizhimost/index.html')]){
   const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});pages.push(page);
   await page.goto(url);await page.waitForFunction(()=>document.querySelector('.catalog-sticky__mobile-actions'));
   await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.querySelectorAll('.catalog-sticky img')].map(i=>i.decode()));scrollTo(0,1000);});
   await page.waitForFunction(()=>document.querySelector('.catalog-sticky').getAttribute('aria-hidden')==='false');
   await page.addStyleTag({content:'*,*::before,*::after{transition:none!important;animation:none!important}'});
   images.push(PNG.sync.read(await page.locator('.catalog-sticky').screenshot()));
  }
  assert.equal(images[0].width,images[1].width);assert.equal(images[0].height,images[1].height);
  const different=pixelmatch(images[0].data,images[1].data,null,images[0].width,images[0].height,{threshold:0.1});
  assert.equal(different,0,`${width}px: ${different} different header pixels`);
  const page=pages[1],sticky=page.locator('.catalog-sticky');
  assert.equal(await sticky.locator('.catalog-sticky__messengers a').count(),4);
  if(width<=540){await sticky.locator('.catalog-sticky__contact-toggle').click();assert.equal(await sticky.locator('.catalog-sticky__contact-panel').isVisible(),true);await page.keyboard.press('Escape');assert.equal(await sticky.locator('.catalog-sticky__contact-panel').isVisible(),false);}
  const request=width<=540?sticky.locator('.catalog-sticky__mobile-actions .catalog-sticky__request'):sticky.locator('.catalog-sticky__brand .catalog-sticky__request');
  await request.click();await page.locator('.catalog-feedback-modal').waitFor({state:'visible'});await page.keyboard.press('Escape');
  await sticky.getByRole('link',{name:'Каталог',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('.catalog-sticky__link--active')?.textContent==='Каталог');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  console.log(`PASS ${width}px: sticky screenshot matches resort; contacts/request/anchors work`);
  for(const page of pages)await page.close();
 }}finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
