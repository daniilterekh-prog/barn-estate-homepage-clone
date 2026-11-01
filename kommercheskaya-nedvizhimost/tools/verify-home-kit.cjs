const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const{chromium}=require(process.env.PLAYWRIGHT_PATH||'/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const base=process.argv[2]||'http://127.0.0.1:8793/';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const checks=[],errors=[];try{for(const width of[320,390,540,768,1024,1440,1441,1920,2560,3840]){
 const p=await b.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url())});
 await p.goto(base);await p.waitForFunction(()=>document.body.dataset.commercialHomeKit==='1.0.0');await p.evaluate(()=>document.fonts.ready);
 const actual=await p.evaluate(()=>{const style=s=>{const e=document.querySelector(s),c=getComputedStyle(e),r=e.getBoundingClientRect();return{font:c.fontSize,line:c.lineHeight,height:r.height,padding:c.padding,padLeft:c.paddingLeft,padRight:c.paddingRight,gap:c.marginBottom,weight:c.fontWeight,radius:c.borderRadius,bg:c.backgroundColor,color:c.color}};return{section:style('.catalog-grid'),intro:style('.catalog-intro__title'),eyebrow:style('.catalog-grid .catalog-section-eyebrow'),footer:style('.site-footer__callback-btn'),channel:style('.catalog-consultation__method'),address:style('.catalog-grid .apartment-card__address'),fact:style('.listing-card-fact__value'),container:style('.layout__header .base-container'),overflow:document.documentElement.scrollWidth>innerWidth};});
 const mobile=width<=540,wide=width>=1441;
 assert.equal(actual.intro.font,(mobile?22:wide?44:38)+'px');assert.equal(actual.eyebrow.font,(width<=1024?12:14)+'px');
 assert.equal(actual.eyebrow.gap,(width<=1024?12:25)+'px');assert.equal(actual.footer.height,mobile?58:70);assert.equal(actual.footer.font,(mobile?18:wide?19:17)+'px');
 assert.equal(actual.channel.font,(mobile?18:17)+'px');assert.equal(actual.channel.height,46);assert.equal(actual.address.font,(mobile?15:14)+'px');assert.equal(actual.address.weight,'400');
 assert.equal(actual.fact.font,(width<=1024?13:16)+'px');assert.equal(actual.overflow,false);if(mobile)assert.equal(actual.container.padLeft,'22px');if(width>1920)assert.equal(actual.container.padLeft,'0px');
 const logo=await p.locator('.site-header__logo img').getAttribute('src');assert.ok(logo.endsWith('barn-estate-logo.svg'));
 assert.equal(await p.locator('.catalog-grid__item').count(),12);
 await p.locator('.catalog-projects-map__fullscreen').click();await p.locator('.map-browser').waitFor({state:'visible'});await p.keyboard.press('Escape');
 await p.evaluate(()=>scrollTo(0,1300));await p.waitForFunction(()=>document.querySelector('.catalog-sticky').getAttribute('aria-hidden')==='false');
 const request=p.locator(mobile?'.catalog-sticky__mobile-actions .catalog-sticky__request':'.catalog-sticky__brand .catalog-sticky__request');
 assert.equal(await request.evaluate(e=>getComputedStyle(e).borderRadius),'1px');
 await request.click();await p.locator('.catalog-feedback-modal').waitFor({state:'visible'});
 const popup=await p.locator('.feedback-modal__channels button').first().evaluate(e=>({font:getComputedStyle(e).fontSize,h:e.getBoundingClientRect().height}));assert.equal(popup.font,(mobile?18:17)+'px');assert.ok(popup.h>=46);
 assert.equal(await p.locator('.feedback-modal__submit').evaluate(e=>getComputedStyle(e).fontSize),(mobile?18:wide?19:17)+'px');await p.keyboard.press('Escape');
 if(width>1920){assert.equal(await p.locator('.catalog-consultation__image').evaluate(e=>e.getBoundingClientRect().width),1920);}
 if([390,1440,2560,3840].includes(width)){await p.addStyleTag({content:'.catalog-sticky,.floating-expert{visibility:hidden!important}'});await p.locator('.catalog-consultation').screenshot({path:path.resolve(__dirname,'../verification/home-kit-cta-'+width+'.png')});}
 checks.push({width,actual});console.log('PASS kit '+width);await p.close();
 }assert.deepEqual(errors,[]);}finally{await b.close();fs.writeFileSync(path.resolve(__dirname,'../verification/home-kit.json'),JSON.stringify({base,checks,errors,passed:checks.length===10&&!errors.length},null,2)+'\n');}})().catch(e=>{console.error(e);process.exitCode=1});
