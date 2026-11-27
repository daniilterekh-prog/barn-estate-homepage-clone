/* Local standalone preview only; never transmits a lead. */
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/home/daniil/.local/share/codex-toolkit/node_modules/playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'verification');fs.mkdirSync(out,{recursive:true});fs.mkdirSync(path.join(root,'design'),{recursive:true});
const url=process.env.PACKAGE_URL||'http://127.0.0.1:18785/html/index.html';
const widths=process.env.CHECK_WIDTHS?process.env.CHECK_WIDTHS.split(',').map(Number):[320,390,540,541,768,1024,1025,1440,1920,3840];
(async()=>{
 const browser=await chromium.launch(),profiles=[],resources=new Map(),measurements=[];
 try{for(const width of widths){
  const p=await browser.newPage({viewport:{width,height:1080},reducedMotion:'reduce'}),errors=[],http=[],posts=[],external=[];
  p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)http.push(r.status()+' '+r.url());if(r.request().resourceType()==='image')resources.set(r.url(),r.headers()['content-type'])});
  p.on('request',r=>{if(!['GET','HEAD'].includes(r.method()))posts.push(r.method()+' '+r.url());if(/^https?:/.test(r.url())&&new URL(r.url()).origin!==new URL(url).origin)external.push(r.url())});
  await p.goto(url,{waitUntil:'networkidle'});await p.evaluate(async()=>{for(const i of document.images)i.loading='eager';await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));await document.fonts.ready});
  assert.equal(await p.locator('h1').count(),1);assert.match(await p.locator('h1').innerText(),/коммерческ/i);
  assert.equal(await p.locator('.owner-sale-services__card').count(),11);assert.equal(await p.locator('.owner-sale-stages__item').count(),6);assert.equal(await p.locator('.owner-sale-types__card').count(),4);assert.equal(await p.locator('#faq .catalog-faq__question').count(),6);
  assert.match(await p.locator('.owner-sale-types__card').nth(1).getAttribute('href'),/prodazha_sobstvennikam_spb/);
  assert.match(await p.locator('#request .catalog-consultation__image').getAttribute('src'),/alina-medvedeva-cta.webp$/);
  assert.equal(await p.locator('.floating-expert__avatar img').getAttribute('alt'),'Алина Медведева');assert.match(await p.locator('.floating-expert__avatar img').getAttribute('src'),/alina-floating-avatar.webp$/);
  const avatar=await p.locator('.floating-expert__avatar img').evaluate(e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect(),parent=e.parentElement.getBoundingClientRect();return{width:r.width,height:r.height,parentWidth:parent.width,parentHeight:parent.height,transform:s.transform,position:s.objectPosition}});
  assert.equal(avatar.transform,'none');assert.equal(avatar.width,avatar.parentWidth);assert.equal(avatar.height,avatar.parentHeight);
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  let forms=false,faq=false;
  if([390,1440].includes(width)){
   for(const q of await p.locator('#faq .catalog-faq__question').all()){
    await q.focus();await p.keyboard.press('Enter');assert.equal(await q.getAttribute('aria-expanded'),'true');const id=await q.getAttribute('aria-controls');assert.equal(await p.locator('#'+id).getAttribute('aria-hidden'),'false');await p.keyboard.press('Space');assert.equal(await q.getAttribute('aria-expanded'),'false');
   }faq=true;
   const form=p.locator('#request form'),name=form.locator('input[autocomplete=name]'),phone=form.locator('input[type=tel]'),consent=form.locator('input[type=checkbox]'),submit=form.locator('button[type=submit]');
   await submit.click();assert.equal(await name.getAttribute('aria-invalid'),'true');await name.fill('Проверка пакета');await phone.fill('123');await submit.click();assert.equal(await phone.getAttribute('aria-invalid'),'true');await phone.fill('+7 000 000 00 00');await submit.click();assert.equal(await consent.getAttribute('aria-invalid'),'true');await consent.focus();await p.keyboard.press('Space');assert(await consent.isChecked());await submit.click();assert.match(await form.locator('[role=status]').innerText(),/Данные не отправлены/);
   const tabs=p.locator('#request [role=tab]');await tabs.first().focus();await p.keyboard.press('ArrowRight');assert.equal(await tabs.nth(1).getAttribute('aria-selected'),'true');
   const news=p.locator('.newsletter-cta form'),email=news.locator('input[type=email]');await email.fill('bad-email');await news.locator('button[type=submit]').click();assert.equal(await email.getAttribute('aria-invalid'),'true');await email.fill('preview@example.test');await news.locator('button[type=submit]').click();assert.match(await news.locator('[role=status]').innerText(),/Данные не отправлены/);forms=true;
   await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(150);
   const hero=p.locator('.owner-sale-hero__button');await hero.click();const modal=p.getByRole('dialog');await modal.waitFor();assert.match(await modal.locator('.home-owner-form__hero-image').getAttribute('src'),/alina-medvedeva.webp$/);
   const send=modal.locator('button[type=submit]');await send.click();assert.equal(await modal.locator('[name=name]').getAttribute('aria-invalid'),'true');await modal.locator('[name=name]').fill('Проверка пакета');await modal.locator('[name=phone]').fill('123');await send.click();assert.equal(await modal.locator('[name=phone]').getAttribute('aria-invalid'),'true');await modal.locator('[name=phone]').fill('+7 000 000 00 00');await send.click();assert.equal(await modal.locator('[type=checkbox]').getAttribute('aria-invalid'),'true');await modal.locator('.home-owner-form__consent-box').click();await send.click();assert.match(await modal.locator('[role=status]').innerText(),/Данные не отправлены/);await p.screenshot({path:path.join(out,`modal-${width}.png`)});await p.keyboard.press('Escape');assert.equal(await p.getByRole('dialog').count(),0);assert(await hero.evaluate(e=>e===document.activeElement));
  }
  await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(150);await p.locator('.floating-expert__card').click();await p.getByRole('dialog').waitFor();await p.keyboard.press('Escape');assert(await p.locator('.floating-expert__card').evaluate(e=>e===document.activeElement));
  await p.locator('button[aria-label="Открыть меню"]:visible').first().click();await p.evaluate(async()=>{await Promise.all([...document.querySelectorAll('.site-menu img')].map(i=>i.decode()))});await p.keyboard.press('Escape');
  assert.equal(await p.evaluate(()=>[...document.images].filter(i=>i.getClientRects().length&&(!i.complete||!i.naturalWidth)).length),0);assert.deepEqual(errors,[]);assert.deepEqual(http,[]);assert.deepEqual(posts,[]);assert.deepEqual(external,[]);
  if([390,1440].includes(width))measurements.push(await p.evaluate(()=>({width:innerWidth,body:{font:getComputedStyle(document.body).fontFamily,background:getComputedStyle(document.body).backgroundColor},sections:[...document.querySelectorAll('.owner-sale-page>section,.newsletter-cta,.site-footer')].map(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return{id:e.id,class:e.className,width:r.width,height:r.height,padding:s.padding,margin:s.margin,font:s.fontFamily,background:s.backgroundColor}})})));
  profiles.push({width,forms,faqKeyboard:faq,dialog:true,menu:true,avatar,brokenImages:0,overflow:false,jsErrors:0,httpErrors:0,nonGetRequests:0,externalRuntimeRequests:0});await p.close();
 }
 for(const[url,type]of resources){assert(/\.(webp|svg)(?:[?#]|$)/i.test(url),url);if(/\.webp(?:[?#]|$)/.test(url))assert.match(type||'',/image\/webp/)}
 fs.writeFileSync(path.join(root,'design/measurements.json'),JSON.stringify(measurements,null,2)+'\n');
 fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({date:'2026-11-27',url,profiles,images:[...resources].map(([url,contentType])=>({url,contentType})),result:'pass'},null,2)+'\n');console.log(JSON.stringify({viewports:profiles.length,formFlows:profiles.filter(p=>p.forms).length,images:resources.size,result:'pass'}));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
