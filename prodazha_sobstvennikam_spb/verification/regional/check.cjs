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
   assert.equal(await page.locator('.owner-sale-types__card').count(),4);
   assert.equal(await page.locator('.owner-sale-types__card').evaluateAll(links=>links.every(a=>a.hash==='#request'||a.hostname==='barnestate-spb.ru')),true);
   const hero=page.locator('.owner-sale-hero img').first();assert.match(await hero.getAttribute('src'),/zen/);assert.equal(await hero.evaluate(i=>i.complete&&i.naturalWidth>0),true);
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
   const direction=page.locator('.owner-sale-types__card').nth(1);await direction.scrollIntoViewIfNeeded();await direction.click();await dialog.waitFor({state:'visible'});assert.match(await dialog.locator('.expert-dialog__summary').innerText(),/загородный дом/);await page.keyboard.press('Escape');await dialog.waitFor({state:'detached'});
   await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(300);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
   assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
   const directory=process.env.REPORT_DIR||__dirname;fs.mkdirSync(directory,{recursive:true});await page.screenshot({path:path.join(directory,width+'-hero.webp'),animations:'disabled'});
   report.push({width,h1:await page.locator('h1').innerText(),expert:await page.locator('.floating-expert__name').innerText(),errors,failed,dialogValidation:true,focusRestored:true,overflow:false});await page.close();
  }
  fs.writeFileSync(path.join(process.env.REPORT_DIR||__dirname,'report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
