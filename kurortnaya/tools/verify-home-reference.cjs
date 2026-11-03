/** Assert the approved 2026-11-01 kit and preserved hero/FAQ exceptions. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const root=path.resolve(__dirname,'..'),base=process.argv[2]||'http://127.0.0.1:8875/kurortnaya/';
const baseline=JSON.parse(fs.readFileSync(path.join(root,'verification/home-reference-exceptions.json')));
const report={reference:'Home v1.0.0, 2026-11-01',resortVersion:'1.5.0',exceptions:['hero H1','FAQ'],checks:[]};
function near(a,b,label){assert.ok(Math.abs(a-b)<.2,label+': '+a+' vs '+b);}
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome'});const errors=[];
try{for(const width of [320,390,540,768,1024,1440,1441,1920,2560,3840]){
 const page=await browser.newPage({viewport:{width,height:1000}});page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base,{waitUntil:'networkidle'});await page.waitForSelector('[data-brand-context=listing]');await page.evaluate(()=>document.fonts.ready);
 const get=sel=>page.locator(sel).first().evaluate(e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return {size:s.fontSize,weight:s.fontWeight,line:s.lineHeight,spacing:s.letterSpacing,color:s.color,background:s.backgroundColor,radius:s.borderRadius,padding:s.padding,width:r.width,height:r.height,x:r.x,margin:s.margin}});
 const mobile=width<=540,wide=width>=1441,expected=baseline.rows.find(r=>r.width===width);
 for(const role of Object.values(expected.roles)){
   const current=await get(role.selectorClass?'.'+role.selectorClass.split(' ')[0]:role.selector||'.catalog-hero__title');
   for(const p of ['size','weight','line','spacing','color','padding','margin'])assert.equal(current[p],role[p],width+' exception '+role.selectorClass+' '+p);
 }
 const faq=await page.locator('.catalog-faq').evaluate(e=>getComputedStyle(e).padding);assert.equal(faq,expected.section.padding,'FAQ section preserved');
 const intro=await get('.catalog-intro__title');assert.equal(intro.size,(mobile?22:wide?44:38)+'px');assert.equal(intro.weight,'300');near(parseFloat(intro.line),parseFloat(intro.size)*1.2,'Intro leading');assert.equal(intro.spacing,'normal');
 const section=await page.locator('.catalog-grid').evaluate(e=>({padding:parseFloat(getComputedStyle(e).paddingTop),vw:innerWidth}));near(section.padding,mobile?48:Math.min(100,Math.max(72,section.vw*.06)),'Section spacing');
 const brow=await get('.catalog-grid .catalog-section-eyebrow');assert.equal(brow.size,(width<=1024?12:14)+'px');
 for(const selector of ['.catalog-best-offers__title','.catalog-grid__title','.catalog-intro__title','.departments-section__title','.news-section__title']){
  const gap=await page.locator(selector).evaluate(e=>{const prev=e.previousElementSibling;return e.getBoundingClientRect().top-prev.getBoundingClientRect().bottom});near(gap,width<=1024?12:25,'Eyebrow '+selector);
 }
 const container=await get('.catalog-grid__inner');if(width>1920){near(container.width,1920,'Wide container');assert.equal(container.padding,'0px');}if(mobile)assert.ok(container.padding.endsWith('22px'));
 const listingGap=await page.locator('.catalog-mode-toolbar').evaluate(e=>e.getBoundingClientRect().top-document.querySelector('.catalog-grid__header').getBoundingClientRect().bottom);near(listingGap,mobile?28:40,'Listing heading/content gap');
 const sliderGap=await page.locator('.catalog-best-offers__slider-row').evaluate(e=>e.getBoundingClientRect().top-document.querySelector('.catalog-best-offers__header').getBoundingClientRect().bottom);near(sliderGap,mobile?28:40,'Start-sales heading/content gap');
 const text=await get('.catalog-intro__text p');assert.equal(text.size,(mobile?14:18)+'px');assert.equal(text.color,'rgb(79, 77, 73)');
 for(const selector of ['.catalog-hero-filters__submit','.catalog-consultation__submit','.catalog-contact__submit','.site-footer__callback-btn']){
  const action=await get(selector);assert.equal(action.size,(mobile?18:wide?19:17)+'px');assert.equal(action.weight,'400');assert.equal(action.radius,'1px');near(action.height,mobile?58:70,'Action '+selector);
 }
 const channel=await get('.catalog-consultation__method');assert.equal(channel.size,(mobile?18:17)+'px');assert.ok(channel.height>=46);assert.equal(channel.padding,'10px 8px');
 const direction=await get('.department-card__title');assert.equal(direction.weight,'300');
 const readMore=await get('.catalog-intro__toggle');assert.equal(readMore.size,(mobile?12:14)+'px');assert.ok(readMore.height>=44);
 if(width<=1024){
  await page.locator('.catalog-header-mobile-toggle').click();await page.locator('.catalog-header-mobile-panel').waitFor({state:'visible'});
  assert.equal(await page.locator('.catalog-header-mobile-panel a[href^="tel:"]').count(),1);
  await page.keyboard.press('Escape');assert.equal(await page.locator('.catalog-header-mobile-panel').isVisible(),false);
  const centers=await page.evaluate(()=>['.site-header__icon-btn','.site-header__logo img','.catalog-header-mobile-toggle'].map(sel=>{const r=document.querySelector('.layout__header '+sel).getBoundingClientRect();return r.y+r.height/2}));assert.ok(Math.max(...centers)-Math.min(...centers)<1,'Hero header alignment');
 }
 await page.keyboard.press('Escape');
 // The dismissible floating expert can cover a footer action on a short screen.
 // Dismiss it as a user would; no forced click through the overlay.
 if(await page.locator('.floating-expert__close').isVisible())await page.locator('.floating-expert__close').click();
 await page.locator('.site-footer__callback-btn').click();await page.locator('.catalog-feedback-modal').waitFor({state:'visible'});
 const send=await get('.feedback-modal__submit');assert.equal(send.size,(mobile?18:wide?19:17)+'px');near(send.height,mobile?58:64,'Request submit');
 const modalChannel=await get('.feedback-modal__channels button');assert.equal(modalChannel.size,(mobile?18:17)+'px');assert.equal(modalChannel.radius,'1px');assert.ok(modalChannel.height>=46);
 await page.keyboard.press('Escape');
 await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';scrollTo(0,document.querySelector('.catalog-hero').offsetHeight+300)});await page.locator('.catalog-sticky--visible').waitFor();
 if(width>1024){const logo=await get('.catalog-sticky__logo img');near(logo.height,48,'Logo height');near(logo.width,48*327/91.11,'Logo ratio');const request=await get('.catalog-sticky__request');assert.equal(request.background,'rgba(0, 0, 0, 0)');assert.equal(request.radius,'1px');}
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'No overflow');
 if([390,1440,2560,3840].includes(width))await page.screenshot({path:'/tmp/resort-home-kit-'+width+'.png'});
 report.checks.push({width,kit:true,exceptionsPreserved:true,overflow:false});console.log('PASS home kit '+width);await page.close();
}assert.deepEqual(errors,[]);}finally{await browser.close();fs.writeFileSync((process.env.HOME_REFERENCE_REPORT||path.join(root,'verification/home-reference-refresh-2026-11-03.json')),JSON.stringify(report,null,2)+'\n');}
})().catch(e=>{console.error(e);process.exitCode=1});
