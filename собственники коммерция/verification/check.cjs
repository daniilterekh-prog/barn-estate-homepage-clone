/* Run against a local static preview; never submits a real lead. */
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const {chromium}=require('/home/daniil/.local/share/codex-toolkit/node_modules/playwright');
const {default:AxeBuilder}=require('/home/daniil/.local/share/codex-toolkit/node_modules/@axe-core/playwright');
const base=process.env.COMMERCIAL_PREVIEW_URL||'http://127.0.0.1:8796/';
const out=__dirname;
const layout=JSON.parse(fs.readFileSync(path.join(out,'layout-expectations.json')));
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const report={url:base,viewports:[],flows:[],httpErrors:[],pageErrors:[],nonGetRequests:[],requestedAssets:[],axe:[]};
const fail=[];
const check=(ok,message)=>{if(!ok)fail.push(message);};
const normalize=s=>s.replace(/\s|\u00a0/g,' ').trim();
(async()=>{
 const browser=await chromium.launch({headless:true});
 const context=await browser.newContext();
 const page=await context.newPage();
 page.on('pageerror',e=>report.pageErrors.push(e.message));
 page.on('request',r=>{if(!['GET','HEAD'].includes(r.method()))report.nonGetRequests.push(r.method()+' '+r.url());if(r.url().startsWith(base))report.requestedAssets.push(r.url().slice(base.length));});
 page.on('response',r=>{if(r.status()>=400)report.httpErrors.push(r.status()+' '+r.url());});
 async function ready(width,height=1000){
  await page.setViewportSize({width,height});await page.goto(base,{waitUntil:'networkidle'});
  await page.evaluate(async()=>{for(const i of document.images)i.loading='eager';await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
 }
 for(const width of [320,360,390,540,768,900,1024,1280,1440,1600,1920,2560,3840]){
  await ready(width,width<768?844:1000);
  const state=await page.evaluate(()=>{
   const hero=document.querySelector('.owner-sale-hero'),button=hero.querySelector('.owner-sale-hero__button');
   return {footerBackground:getComputedStyle(document.querySelector('.site-footer')).backgroundColor,footerGrid:getComputedStyle(document.querySelector('.site-footer__nav')).display,sectionOrder:[...document.querySelectorAll('.owner-sale-page > section')].map(e=>e.id||e.classList[0]),footerLogo:document.querySelector('.site-footer__logo img').getAttribute('src'),footerHours:document.querySelector('.site-footer__hours').textContent,footerClub:[...document.querySelectorAll('.site-footer a')].some(a=>a.textContent.trim()==='BARN Club'),width:innerWidth,overflow:Math.max(0,document.documentElement.scrollWidth-innerWidth),heroButtonFits:button.getBoundingClientRect().bottom<=hero.getBoundingClientRect().bottom+1,brokenImages:[...document.images].filter(i=>i.currentSrc&&(!i.complete||!i.naturalWidth)).map(i=>i.currentSrc),h1:document.querySelectorAll('h1').length,faq:document.querySelectorAll('#faq details').length,steps:document.querySelectorAll('.owner-sale-stages__item').length,tools:document.querySelectorAll('.owner-sale-services__card').length,cta:document.querySelector('.catalog-consultation__lead').textContent,expert:document.querySelector('.floating-expert__name')?.textContent};
  });
  check(state.overflow===0,`overflow at ${width}`);check(state.heroButtonFits,`hero clips its CTA at ${width}`);check(state.brokenImages.length===0,`broken images at ${width}`);check(state.h1===1&&state.faq===6&&state.steps===6&&state.tools===11,`content incomplete at ${width}`);check(normalize(state.expert||'')==='Алина Медведева',`expert at ${width}`);
  check(JSON.stringify(state.sectionOrder)===JSON.stringify(layout.sectionOrder),`section order at ${width}`);check(state.footerBackground==='rgb(38, 38, 38)'&&state.footerGrid==='grid'&&state.footerLogo==='assets/barn-estate-logo.svg'&&state.footerHours==='Ежедневно с 09:00 до 21:00'&&state.footerClub,`current footer at ${width}`);
  report.viewports.push(state);
 }
 for(const width of [390,1440]){
  await ready(width,width===390?844:1000);
  const first=page.locator('#faq summary').first();await first.focus();await first.press('Enter');check(await page.locator('#faq details').first().getAttribute('open')!==null,`FAQ keyboard at ${width}`);await first.press('Enter');
  const tabs=page.locator('.catalog-consultation__methods [role=tab]');await tabs.first().focus();await tabs.first().press('ArrowRight');check(await tabs.nth(1).getAttribute('aria-selected')==='true',`contact channel keyboard at ${width}`);
  const hero=page.locator('.owner-sale-hero__button');await hero.click();const modal=page.locator('.home-owner-host');await modal.waitFor({state:'visible'});
  const portrait=await modal.locator('.home-owner-form__hero-image').getAttribute('src');check(/alina-medvedeva/.test(portrait),`modal portrait at ${width}`);
  const submit=modal.locator('button[type=submit]');await submit.click();check(await modal.locator('[name=name]').getAttribute('aria-invalid')==='true',`name validation at ${width}`);
  await modal.locator('[name=name]').fill('Тест локального превью');await modal.locator('[name=phone]').fill('123');await submit.click();check(await modal.locator('[name=phone]').getAttribute('aria-invalid')==='true',`phone validation at ${width}`);
  await modal.locator('[name=phone]').fill('+7 000 000 00 00');await submit.click();check(await modal.locator('[type=checkbox]').getAttribute('aria-invalid')==='true',`consent validation at ${width}`);
  await modal.locator('.home-owner-form__consent-box').click();check(await modal.locator('[type=checkbox]').isChecked(),`visible consent control at ${width}`);await submit.click();check((await modal.locator('[role=status]').innerText()).includes('Данные не отправлены'),`honest preview status at ${width}`);
  await page.screenshot({path:path.join(out,`modal-${width}.png`)});await page.keyboard.press('Escape');check(await page.locator('.home-owner-host').count()===0,`Escape at ${width}`);check(await hero.evaluate(e=>e===document.activeElement),`focus return at ${width}`);
  const floating=page.locator('.floating-expert__card');await floating.click();check(await page.locator('.home-owner-host').count()===1,`floating dialog at ${width}`);await page.keyboard.press('Escape');
  for(const card of await page.locator('.owner-sale-presentation__card').all()){
   await card.focus();await page.waitForTimeout(350);
   const box=await card.evaluate(e=>{const a=e.getBoundingClientRect(),b=e.querySelector('.owner-sale-presentation__reveal-text').getBoundingClientRect();return {fits:b.bottom<=a.bottom+2&&b.top>=a.top-2,readable:getComputedStyle(e.querySelector('.owner-sale-presentation__reveal-text')).opacity!=='0'};});
   check(box.fits&&box.readable,`advantage card clips at ${width}`);
  }
  if(width===1440){const service=page.locator('.owner-sale-services__card').nth(1);await service.hover();check(await service.locator('strong').evaluate(e=>getComputedStyle(e).color)==='rgb(255, 255, 255)','hover text must be white');const next=page.locator('.owner-sale-services .slider-controls button').last();if(await next.count()&&await next.isEnabled())await next.click();}
  await page.locator('.site-footer__callback-btn').click();check(await page.locator('.home-owner-host').count()===1,`footer callback at ${width}`);await page.keyboard.press('Escape');await page.locator('.site-footer').screenshot({path:path.join(out,`footer-${width}.png`)});
  const axe=await new AxeBuilder({page}).include('.owner-sale-page').analyze();report.axe.push({width,violations:axe.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}))});
  check(!axe.violations.some(v=>['serious','critical'].includes(v.impact)),`serious axe at ${width}`);
  await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(out,`page-${width}.png`),fullPage:true});await page.screenshot({path:path.join(out,`hero-${width}.png`)});
  report.flows.push({width,faqKeyboard:true,channelsKeyboard:true,modalValidation:true,consent:true,noTransmission:true,escape:true,focusReturn:true,presentationCards:true});
 }
 const pageRoot=path.dirname(out),repo=path.dirname(pageRoot);
 const hub=fs.existsSync(path.join(repo,'sobstvenniki-uzel'))?'sobstvenniki-uzel':'owner-hub';
 report.directionHashes=['service-city.webp','service-country.webp','service-rent.webp'].map(file=>{const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');const a=hash(path.join(pageRoot,'assets/directions',file)),b=hash(path.join(repo,hub,'assets/editorial',file));check(a===b,`direction image changed: ${file}`);return {file,sha256:a,matchesOwnerHub:a===b};});
 check(hash(fs.readFileSync(path.join(pageRoot,'assets/barn-estate-logo.svg')))===layout.footerLogoSha256,'canonical footer logo hash');
 check(!report.pageErrors.length,'JavaScript errors');check(!report.httpErrors.length,'HTTP errors');check(!report.nonGetRequests.length,'unexpected data transmission');
 report.requestedAssets=[...new Set(report.requestedAssets)].sort();report.failures=fail;report.passed=!fail.length;
 fs.writeFileSync(path.join(out,'browser.json'),JSON.stringify(report,null,2)+'\n');await browser.close();
 console.log(JSON.stringify({passed:report.passed,viewports:report.viewports.length,flows:report.flows.length,failures:fail,http:report.httpErrors,js:report.pageErrors,axe:report.axe}));
 if(fail.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
