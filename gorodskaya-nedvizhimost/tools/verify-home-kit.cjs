/* Assert UI-kit roles and city-specific behavior. Demo submit never calls a backend. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const base=process.argv[2]||'http://127.0.0.1:4190/',root=path.resolve(__dirname,'..');
const report={base,reference:'home UI-kit v1.0.0',date:'2026-11-01',cases:[],errors:[],missing:[],external:[],posts:[]};
const near=(a,b,label)=>assert.ok(Math.abs(a-b)<1,label+': '+a+' != '+b);
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'});try{
 for(const width of[320,390,540,541,768,1024,1440,1441,2560,3840]){
  const p=await b.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
  p.on('pageerror',e=>report.errors.push(e.message));p.on('response',r=>{if(r.status()>=400)report.missing.push(r.url()+' '+r.status())});
  p.on('request',r=>{if(r.method()==='POST')report.posts.push(r.url());if(r.url().startsWith('http')&&!r.url().startsWith(new URL(base).origin))report.external.push(r.url())});
  await p.goto(base,{waitUntil:'networkidle'});await p.waitForSelector('[data-city-home-kit-ready=true]',{state:'attached'});await p.evaluate(()=>document.fonts.ready);
  const data=await p.evaluate(async()=>{
   const all=[...document.images];all.forEach(i=>i.loading='eager');await Promise.all(all.map(i=>i.decode().catch(()=>{})));
   function m(s){const e=document.querySelector(s),r=e.getBoundingClientRect(),c=getComputedStyle(e);return {size:parseFloat(c.fontSize),line:c.lineHeight,weight:c.fontWeight,pad:parseFloat(c.paddingTop),inlinePad:parseFloat(c.paddingLeft),spacing:c.letterSpacing,h:r.height,w:r.width,x:r.x,y:r.y+scrollY}}
   return {overflow:document.documentElement.scrollWidth>innerWidth+1,broken:all.filter(i=>!i.naturalWidth).map(i=>i.src),h1:document.querySelectorAll('h1').length,
    section:m('.catalog-grid'),eyebrow:m('.catalog-grid .catalog-section-eyebrow'),intro:m('.catalog-intro__title'),direction:m('.department-card__title'),footer:m('.site-footer__callback-btn'),more:m('.catalog-intro__toggle'),container:m('.catalog-best-offers__container'),row:m('.catalog-best-offers__slider-row'),active:m('.catalog-best-offers .splide__slide.is-visible.is-active .launch-card')};
  });
  assert.equal(data.overflow,false);assert.deepEqual(data.broken,[]);assert.equal(data.h1,1);
  near(data.section.pad,width<=540?48:Math.min(100,Math.max(72,width*.06)),'section');
  near(data.eyebrow.size,width<=1024?12:14,'eyebrow');near(data.intro.size,width<=540?22:width<=1440?38:44,'intro');assert.equal(data.intro.spacing,'normal');
  assert.equal(data.direction.weight,'300');near(data.footer.h,width<=540?58:70,'footer CTA');assert.ok(data.more.h>=44);near(data.more.size,width<=540?12:14,'read more');
  near(data.active.h,width<=540?410:500,'launch height');
  near(data.row.x,data.container.x+data.container.inlinePad,'launch grid left');
  if(width>1920){near(data.container.inlinePad,0,'wide gutter');near(data.row.w,1920,'wide useful width')}
  if(width<=540){near(data.container.inlinePad,22,'mobile gutter');near(data.active.x,data.row.x,'mobile card left');near(data.active.w,data.row.w,'mobile card width')}
  await p.locator('.catalog-intro__toggle').click();assert.equal(await p.locator('.catalog-intro__details').getAttribute('aria-hidden'),'false');assert.ok((await p.locator('.catalog-intro__details').boundingBox()).height>100);await p.locator('.catalog-intro__toggle').click();
  if(width>1024){const bottoms=await p.evaluate(()=>['.catalog-intro__toggle','.catalog-intro__media'].map(s=>document.querySelector(s).getBoundingClientRect().bottom));near(bottoms[0],bottoms[1],'intro image/button bottom alignment')}
  if(width>=768){
   const arrows=p.locator('.catalog-best-offers__nav-btn');const boxes=await arrows.evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y+scrollY,w:r.width,h:r.height}}));
   near(boxes[0].y,boxes[1].y,'arrows row');near(boxes[1].x-boxes[0].x-boxes[0].w,12,'arrow gap');assert.ok(boxes[0].y>=data.active.y+data.active.h);
   const before=await p.locator('.catalog-best-offers .splide__list').getAttribute('style');await arrows.nth(1).click();assert.notEqual(await p.locator('.catalog-best-offers .splide__list').getAttribute('style'),before);
  }
  if(width<=1024){await p.locator('.city-header-contact-toggle').click();assert.equal(await p.locator('.city-header-contact-panel').isVisible(),true);await p.keyboard.press('Escape');assert.equal(await p.locator('.city-header-contact-panel').isVisible(),false)}
  await p.locator('.floating-expert__card').click();const host=p.locator('.home-owner-host');assert.equal(await host.getAttribute('data-quiz-step'),'task');
  await host.getByRole('button',{name:'Купить',exact:true}).click();await host.locator('[data-quiz-next]').click();assert.equal(await host.getAttribute('data-quiz-step'),'detail');
  assert.deepEqual(await host.locator('select[name=currency] option').allTextContents(),['₽','$','€']);await host.locator('[name=budget]').fill('30–50 млн');await host.locator('[data-quiz-next]').click();
  assert.equal(await host.getAttribute('data-quiz-step'),'contact');assert.match(await host.locator('.home-quiz__summary').innerText(),/Москва/);
  await host.locator('[type=submit]').click();assert.equal(await host.locator('[name=name]').getAttribute('aria-invalid'),'true');
  await host.locator('[name=name]').fill('Тест проверки');await host.locator('[name=phone]').fill('123');await host.locator('[type=submit]').click();assert.equal(await host.locator('[name=phone]').getAttribute('aria-invalid'),'true');
  await host.locator('[name=phone]').fill('+7 999 123-45-67');await host.locator('[type=submit]').click();assert.equal(await host.locator('[type=checkbox]').getAttribute('aria-invalid'),'true');
  await host.locator('.home-owner-form__consent-box').click();await host.locator('[type=submit]').click();assert.match(await host.locator('[data-owner-status]').innerText(),/не отправлены/);
  const last=host.locator('.home-owner-form__consent-link');await last.focus();await p.keyboard.press('Tab');assert.equal(await p.evaluate(()=>document.activeElement.classList.contains('modal__close')),true);
  await p.keyboard.press('Escape');assert.equal(await host.count(),0);assert.equal(await p.locator('.floating-expert__card').evaluate(e=>e===document.activeElement),true);
  await p.locator('[data-mode=lot]').click();const card=p.locator('.catalog-grid__item:visible .apartment-card').first(),name=await card.locator('.apartment-card__name').innerText();
  await card.locator('.apartment-card__call-btn').click();assert.equal(await host.getAttribute('data-quiz-step'),'contact');assert.equal(await host.locator('.home-quiz__summary p').innerText(),name.trim());assert.equal(await host.locator('[name=preferredChannel]').inputValue(),'Звонок');await p.keyboard.press('Escape');
  await p.locator('.catalog-projects-map__fullscreen').click();if(width<=540)await p.locator('.map-browser__handle').click();await p.locator('[data-map-market=new-build]').click();assert.equal(await p.locator('.map-browser__card').count(),4);await p.locator('[data-map-market=secondary]').click();assert.equal(await p.locator('.map-browser__card').count(),12);
  await p.locator('.map-browser__filter-toggle').click();await p.locator('.hero-filter-modal--drawer').waitFor({state:'visible'});await p.keyboard.press('Escape');assert.equal(await p.locator('.map-browser').isVisible(),true);await p.keyboard.press('Escape');
  if([390,1440,2560].includes(width))await p.screenshot({path:path.join(root,'verification','home-kit-'+width+'.png')});
  report.cases.push({width,...data,quiz:true,validation:true,objectContext:true,mapMarkets:[4,12],nestedFilters:true});console.log('PASS city home-kit and flows',width);await p.close();
 }
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.missing,[]);assert.deepEqual(report.external,[]);assert.deepEqual(report.posts,[]);
}finally{await b.close();fs.writeFileSync(path.join(root,'verification/home-kit.json'),JSON.stringify(report,null,2)+'\n')}})().catch(e=>{console.error(e);process.exitCode=1});
