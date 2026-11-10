const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/home/daniil/.local/share/codex-toolkit/node_modules/playwright');
const base=process.env.CHECK_URL||'http://127.0.0.1:8769/barn-estate-homepage-clone/prodazha_sobstvennikam_spb/';
(async()=>{
 const browser=await chromium.launch({headless:true});const report=[];
 try{
  for(const width of [320,390,768,1440,1920,2560]){
   const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});const errors=[],failed=[];
   page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&r.url().startsWith(new URL(base).origin))failed.push({status:r.status(),url:r.url()})});
   await page.goto(base,{waitUntil:'networkidle',timeout:60000});await page.evaluate(()=>document.fonts.ready);
   assert.match(await page.locator('h1').innerText(),/Санкт-Петербурге/,'H1 должен обращаться к собственникам Петербурга');
   assert.equal(await page.locator('h1').count(),1);
   assert.equal(await page.locator('.mh-nav-item > a').evaluateAll(links=>links[0].textContent==='Санкт-Петербург'&&!links.some(a=>a.textContent==='Москва')),true,'Главное меню должно начинаться с Петербурга');
   assert.equal(await page.locator('.site-menu__nav-title').evaluateAll(headings=>headings.filter(e=>e.textContent.trim()==='Санкт-Петербург').length),1,'В мобильном меню одна группа Петербурга');
   assert.match(await page.locator('.floating-expert').innerText(),/ЛЮДМИЛА БЕЛОУСОВА/i);
   assert.equal(await page.locator('a[href^="tel:"]').evaluateAll(links=>links.every(a=>a.href.replace(/\D/g,'')==='74992724872')),true,'Все телефонные ссылки должны совпадать с главной СПб');
   assert.equal(await page.locator('.owner-sale-types').count(),0,'Блок направлений должен быть удалён');
   assert.equal(await page.locator('a[href="#property-types"]').count(),0,'Ссылок на удалённый блок быть не должно');
   assert.match(await page.locator('.catalog-consultation__image').getAttribute('src'),/ludmila.*hq/);
   assert.match(await page.locator('.catalog-consultation__media').evaluate(e=>getComputedStyle(e).backgroundImage),/cta-residence/);
   const hero=page.locator('.owner-sale-hero img').first();assert.match(await hero.getAttribute('src'),/editorial\/hero/);assert.equal(await hero.evaluate(i=>i.complete&&i.naturalWidth>0),true);
   const editorialImages=page.locator('.owner-sale-hero__image,.owner-sale-presentation__image,.be-panorama-image,.owner-sale-strategy__image');
   assert.equal(await editorialImages.count(),9,'На странице девять новых иллюстраций в img и отдельный фон CTA');
   assert.equal(await editorialImages.evaluateAll(images=>images.every(i=>i.currentSrc.includes('/assets/editorial/')||i.src.includes('/assets/editorial/'))),true,'Все иллюстрации должны использовать новую серию');
   for(const image of await editorialImages.all()){await image.scrollIntoViewIfNeeded();await image.evaluate(i=>i.decode());}
   assert.equal(await editorialImages.evaluateAll(images=>images.every(i=>i.complete&&i.naturalWidth>0)),true,'Все изображения должны загружаться');
   const copyButton=page.locator('.about-company__read-more');await copyButton.scrollIntoViewIfNeeded();await copyButton.click();
   assert.doesNotMatch(await page.locator('.about-company').innerText(),/Петровк|Москв|Подмосков/);
   assert.match(await page.locator('.about-company').innerText(),/Мойки, 59/);
   await page.locator('.owner-sale-hero__button').scrollIntoViewIfNeeded();await page.locator('.owner-sale-hero__button').click();
   const dialog=page.locator('.home-owner-host [role=dialog]');await dialog.waitFor({state:'visible'});
   assert.match(await dialog.locator('img').getAttribute('alt'),/Людмила Белоусова/);
   assert.equal(await dialog.locator('img').evaluate(i=>i.complete&&i.naturalWidth>0),true);
   await dialog.locator('button[type=submit]').click();assert.match(await dialog.locator('[role=status]').innerText(),/имя/);
   await page.keyboard.press('Escape');await dialog.waitFor({state:'detached'});
   assert.equal(await page.locator('.owner-sale-hero__button').evaluate(e=>e===document.activeElement),true,'Закрытие формы возвращает фокус');
   await page.locator('#request').scrollIntoViewIfNeeded();
   assert.equal(await page.locator('.catalog-consultation__media').evaluate(e=>e.getBoundingClientRect().width>=document.body.getBoundingClientRect().width-1),true,'Фотофон CTA должен занимать всю ширину страницы');
   await page.screenshot({path:path.join(process.env.REPORT_DIR||__dirname,width+'-consultation.webp'),animations:'disabled'});
   await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(300);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
   assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
   const directory=process.env.REPORT_DIR||__dirname;fs.mkdirSync(directory,{recursive:true});await page.screenshot({path:path.join(directory,width+'-hero.webp'),animations:'disabled'});
   report.push({width,h1:await page.locator('h1').innerText(),expert:await page.locator('.floating-expert__name').innerText(),errors,failed,dialogValidation:true,focusRestored:true,directionsRemoved:true,fullWidthInteriorBackground:true,newEditorialImages:10,portrait:"ludmila-belousova-color-hq",overflow:false});await page.close();
  }
  fs.writeFileSync(path.join(process.env.REPORT_DIR||__dirname,'report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
