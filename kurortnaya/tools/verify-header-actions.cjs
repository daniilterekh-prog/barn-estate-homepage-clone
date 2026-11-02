const {chromium}=require(process.env.PLAYWRIGHT_PATH||'/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const base=process.argv[2]||'http://127.0.0.1:8875/kurortnaya/',ref='https://daniilterekh-prog.github.io/barn-estate-homepage-clone/exact-2026-10-21/';
const root=path.resolve(__dirname,'..'),checks=[];
const style=(loc,keys)=>loc.evaluate((e,keys)=>Object.fromEntries(keys.map(k=>[k,getComputedStyle(e)[k]])),keys);
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'});try{for(const width of [320,390,540,768,1024,1440,1920,2560,3840]){
 const home=await b.newPage({viewport:{width,height:1000}}),page=await b.newPage({viewport:{width,height:1000}});
 await home.goto(ref,{waitUntil:'networkidle'});await page.goto(base,{waitUntil:'networkidle'});await page.locator('[data-brand-context=listing]').waitFor();
 const compact=width<=1024;
 if(compact){
  for(const sticky of [false,true]){
   if(sticky){for(const p of [home,page])await p.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';scrollTo(0,1600)});await page.waitForFunction(()=>{const r=document.querySelector('.catalog-sticky').getBoundingClientRect();return r.top>=-1&&r.top<1});await home.waitForFunction(()=>getComputedStyle(document.querySelector('.site-header')).color==='rgb(30, 30, 30)');}
   const ht=home.locator('.home-header-contacts-toggle'),t=page.locator(sticky?'.catalog-sticky__contact-toggle':'.catalog-header-mobile-toggle');
   const hp=home.locator('.home-header-contacts-panel'),panel=page.locator(sticky?'.catalog-sticky__contact-panel':'.catalog-header-mobile-panel');
   assert.deepEqual(await style(t,['width','height','borderWidth','borderRadius','backgroundColor','color']),await style(ht,['width','height','borderWidth','borderRadius','backgroundColor','color']),`${width} ${sticky} toggle`);
   assert.deepEqual(await style(t.locator('svg'),['width','height','strokeWidth']),await style(ht.locator('svg'),['width','height','strokeWidth']));
   await ht.click();await t.click();assert.equal(await t.getAttribute('aria-expanded'),'true');assert.equal(await t.getAttribute('aria-label'),'Скрыть способы связи');
   assert.deepEqual(await style(panel,['width','height','gap','padding','border','boxShadow']),await style(hp,['width','height','gap','padding','border','boxShadow']),`${width} ${sticky} panel`);
   assert.deepEqual(await panel.locator('a').evaluateAll(es=>es.map(e=>e.getAttribute('href'))),await hp.locator('a').evaluateAll(es=>es.map(e=>e.getAttribute('href'))));
   assert.equal(await panel.locator('a:visible').count(),4);
   assert.deepEqual(await style(panel.locator('a img').first(),['width','height']),await style(hp.locator('a img').first(),['width','height']));
   await page.keyboard.press('Escape');await home.keyboard.press('Escape');assert.equal(await panel.isVisible(),false);assert.equal(await t.evaluate(e=>e===document.activeElement),true);
   await t.click();await page.setViewportSize({width:width+1,height:1000});await panel.waitFor({state:'hidden'});await page.setViewportSize({width,height:1000});
   if(!sticky){const r=await page.locator('.site-header__icon-btn').evaluate(e=>e.getBoundingClientRect().toJSON());const tr=await t.evaluate(e=>e.getBoundingClientRect().toJSON());assert.ok(r.right<tr.left,'Burger must not overlap contact toggle');}
  }
  await page.locator('.catalog-sticky__callback').click();await page.locator('.catalog-feedback-modal').waitFor({state:'visible'});await page.keyboard.press('Escape');
 }else{
  assert.equal(await page.locator('.catalog-header-request').isVisible(),false,'No hero request in the homepage reference');
  const selectors=['.site-header__messengers','.catalog-header-contacts'];
  const metrics=await Promise.all([home.locator(selectors[0]),page.locator(selectors[1])].map(l=>style(l,['gap'])));assert.deepEqual(metrics[0],metrics[1]);
  for(const p of [home,page])await p.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';scrollTo(0,1600)});
  await home.locator('.site-header__request').waitFor({state:'visible'});await page.locator('.catalog-sticky--visible').waitFor();
  const hb=home.locator('.site-header__request'),pb=page.locator('.catalog-sticky__brand .catalog-sticky__request'),props=['height','fontSize','fontWeight','lineHeight','padding','border','borderRadius','color','backgroundColor'];
  assert.deepEqual(await style(pb,props),await style(hb,props));await hb.hover();await home.waitForFunction(()=>getComputedStyle(document.querySelector('.site-header__request')).backgroundColor==='rgb(139, 29, 37)');await pb.hover();await page.waitForFunction(()=>getComputedStyle(document.querySelector('.catalog-sticky__brand .catalog-sticky__request')).backgroundColor==='rgb(139, 29, 37)');assert.deepEqual(await style(pb,['color','backgroundColor','borderColor']),await style(hb,['color','backgroundColor','borderColor']));
  await pb.click();await page.locator('.catalog-feedback-modal').waitFor({state:'visible'});await page.keyboard.press('Escape');
 }
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);checks.push({width,contacts:true,request:true,referenceParity:true});console.log('PASS header actions',width);await home.close();await page.close();
}}finally{await b.close()}fs.writeFileSync(path.join(root,'verification/header-actions-2026-11-02.json'),JSON.stringify({reference:ref,checks},null,2)+'\n')})().catch(e=>{console.error(e);process.exitCode=1});
