const {chromium}=require(process.env.BARNES_PLAYWRIGHT_MODULE||'/home/daniil/.local/share/codex-toolkit/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('fs');
const base=process.env.BARNES_CATALOG_URL||'http://127.0.0.1:8921/katalog-nedvizhimosti/';
const proof=process.env.BARNES_PROOF_DIR||'katalog-nedvizhimosti/verification';fs.mkdirSync(proof,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome'}),context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),page=await context.newPage();
 const errors=[],httpErrors=[],checks=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)httpErrors.push(r.status()+' '+r.url());});
 const passed=name=>{checks.push(name);console.log('PASS',name);};
 const go=async(query='')=>{await page.goto(base+query);await page.waitForSelector('.apartment-card');await page.evaluate(()=>document.fonts.ready);};
 const count=async n=>page.waitForFunction(n=>document.querySelectorAll('.apartment-card').length===n,n,{timeout:5000});
 const direction=async key=>page.locator('#catalog-direction-select').selectOption(key,{force:true});
 const quick=()=>page.locator('.catalog-mode-filters .catalog-quick-filters__button');
 const modes=()=>page.locator('.catalog-mode-switch > .catalog-mode-switch__button');
 const choose=async(index,label)=>{await quick().nth(index).click();await page.locator('.resort-quick-dropdown [role=option]').filter({hasText:new RegExp('^'+label.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'$')}).click();};
 await go();assert.equal(await page.locator('h1').count(),1);assert.equal(await page.locator('#catalog-direction-select option').count(),5);
 assert.equal(await page.evaluate(()=>document.querySelector('.catalog-toolbar__primary').firstElementChild.matches('.catalog-direction')),true);await count(4);passed('direction is the first filter in layout and DOM; default city has four real projects');
 const expected={city:['Локация','Тип','Стоимость','Спальни'],country:['Шоссе','Тип','Стоимость','Площадь дома'],commercial:['Локация','Назначение','Стоимость / месяц','Площадь'],resort:['Регион','Тип','Стоимость','Спальни'],international:['Страна','Тип','Стоимость','Спальни']};
 for(const [key,captions] of Object.entries(expected)){
  await direction(key);assert.deepEqual(await page.locator('.catalog-quick-filters__caption').allTextContents(),captions);assert.equal(await page.locator('#catalog-direction-select').inputValue(),key);assert.equal(await page.locator('.apartment-card').evaluateAll((es,key)=>es.every(e=>e.dataset.direction===key),key),true);
  await page.locator('.catalog-mode-detailed-filters').click();await page.locator('.hero-filter-modal').waitFor({state:'visible'});
  const roomInput=page.locator('.hero-filter-modal [name=roomsMin]'),landInput=page.locator('.hero-filter-modal [name=landMin]');
  assert.equal(await roomInput.isVisible(),!['country','commercial'].includes(key));assert.equal(await roomInput.isDisabled(),['country','commercial'].includes(key));assert.equal(await landInput.isVisible(),key==='country');
  if(key==='commercial')assert.equal(await page.locator('.hero-filter-modal [name=propertyTypes][value=office]').count(),1);
  if(key==='international')assert.equal(await page.locator('.hero-filter-modal [name=directions][value="Франция"]').count(),1);
  await page.keyboard.press('Escape');passed(`direction ${key}: contextual controls, data and detailed modal`);
 }
 await direction('city');await modes().nth(1).click();await count(3);await choose(3,'3');await count(1);assert.equal(await page.locator('.apartment-card').getAttribute('data-id'),'586963');passed('bedroom count uses source metadata, independently of room count');
 await direction('commercial');await count(4);assert.equal(await page.evaluate(()=>BarnesFilters.getState().bedrooms),'');assert.deepEqual(await page.locator('.catalog-mode-switch > button').allTextContents(),['Купить','Снять']);assert.equal(await modes().nth(1).getAttribute('aria-pressed'),'true');assert.equal(await page.locator('.catalog-price-period').count(),4);passed('direction change clears incompatible bedrooms; commercial uses transaction and monthly rates');
 await choose(1,'Свободное назначение');await count(1);await page.locator('.catalog-mode-detailed-filters').click();await page.locator('.hero-filter-modal [name=areaMin]').fill('900');await page.locator('.hero-filter-modal [name=areaMax]').fill('100');await page.locator('.hero-filter-modal__apply').click();assert.equal(await page.locator('.resort-filters__error').isVisible(),true);await page.locator('.hero-filter-modal [name=areaMin]').fill('800');await page.locator('.hero-filter-modal [name=areaMax]').fill('850');await page.locator('.hero-filter-modal__apply').click();await count(1);passed('commercial purpose and area filter; validation survives context rebuild');
 await page.locator('[data-reset]').click();await count(4);await modes().nth(0).click();await count(0);assert.equal(await page.locator('.catalog-empty').isVisible(),true);await page.locator('[data-reset-empty]').click();assert.equal(await modes().nth(0).getAttribute('aria-pressed'),'true');await modes().nth(1).click();await count(4);passed('transaction filter and reset preserve the chosen deal without invented sale records');
 await direction('country');await count(6);await choose(0,'Киевское шоссе');await count(1);assert.equal(await page.locator('.apartment-card').getAttribute('data-id'),'564554');await page.locator('[data-reset]').click();await choose(3,'200 – 500 м²');await count(3);passed('country road and house area quick filters');
 await page.locator('.catalog-mode-detailed-filters').click();await page.locator('.hero-filter-modal [name=landMin]').fill('30');await page.locator('.hero-filter-modal [name=landMax]').fill('10');await page.locator('.hero-filter-modal__apply').click();assert.equal(await page.locator('.resort-filters__error').isVisible(),true);await page.keyboard.press('Escape');await direction('city');assert.equal(await page.evaluate(()=>BarnesFilters.getState().areaRanges.length),0);passed('land bounds validate and incompatible area ranges clear on direction change');
 await direction('international');await choose(0,'Турция');await count(1);assert.ok((await page.locator('.apartment-card__name').innerText()).includes('Стамбула'));await page.reload();await count(1);assert.equal(await page.locator('#catalog-direction-select').inputValue(),'international');assert.equal(await quick().first().getAttribute('aria-label'),'Страна: Турция');passed('country filtering and URL restore preserve direction and contextual options');
 await direction('resort');await count(6);await page.locator('[data-more]').click();await count(12);passed('resort projects and load more');
 await direction('city');await modes().nth(1).click();await page.locator('#catalog-search').fill('588036');await count(1);await page.locator('#catalog-search').press('Enter');assert.equal(await page.locator('#results').evaluate(e=>e===document.activeElement),true);await page.locator('[data-reset]').click();await count(3);passed('search, focus and reset within a direction');
 await page.locator('.resort-sort-trigger').click();await page.locator('.resort-quick-dropdown [role=option]').filter({hasText:/^Цена меньше$/}).click();let prices=await page.locator('.catalog-grid__item').evaluateAll(es=>es.map(e=>Number(e.dataset.price)));assert.deepEqual(prices,[...prices].sort((a,b)=>a-b));passed('canonical sorting popup');
 await page.locator('.apartment-card__favorite').first().click();await page.reload();await page.waitForSelector('.apartment-card');assert.equal(await page.locator('.apartment-card__favorite[aria-pressed=true]').count(),1);await page.locator('[data-show-favorites]').click();await count(1);await page.locator('.apartment-card__favorite').click();await count(0);passed('favorites persist and filter without changing direction');
 await go();for(const width of [320,390,540,768,1024,1366,1440,1920,2560]){
  await page.setViewportSize({width,height:1000});
  for(const key of Object.keys(expected)){
   await direction(key);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`overflow ${key} ${width}`);
   const first=page.locator('.apartment-card').first();assert.ok(await first.evaluate(e=>Math.abs(e.getBoundingClientRect().width-e.parentElement.getBoundingClientRect().width)<1));
   assert.equal(await first.locator('.apartment-card__detail-btn').evaluate(e=>getComputedStyle(e).height),'54px');
  }
  await direction('city');if([390,1440].includes(width))await page.screenshot({path:`${proof}/${width===390?'mobile':'desktop'}.png`,fullPage:true});passed(`five directions responsive ${width}px`);
 }
 await page.setViewportSize({width:1440,height:1000});await direction('country');await page.screenshot({path:`${proof}/country-desktop.png`,fullPage:true});await direction('commercial');await page.screenshot({path:`${proof}/commercial-desktop.png`,fullPage:true});
 for(const width of [320,390,768,1440,2560]){
  await page.setViewportSize({width,height:1000});await page.locator('.site-header__icon-btn').click();await page.locator('.site-menu').waitFor();assert.equal(await page.locator('.site-menu__nav-title').count(),6);assert.ok(await page.locator('.site-menu__nav-link').count()>25);assert.equal(await page.locator('main').evaluate(e=>e.inert),true);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  const toggle=page.locator('.site-header__icon-btn');await toggle.focus();await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.querySelector('.site-menu').contains(document.activeElement)),true);await toggle.focus();await page.keyboard.press('Shift+Tab');assert.equal(await page.evaluate(()=>document.querySelector('.site-menu').contains(document.activeElement)),true);
  if([390,1440].includes(width))await page.screenshot({path:`${proof}/menu-${width}.png`});await page.keyboard.press('Escape');assert.equal(await page.locator('.site-menu').count(),0);assert.equal(await toggle.evaluate(e=>document.activeElement===e),true);assert.equal(await page.locator('main').evaluate(e=>e.inert),false);passed(`reference full menu, focus trap and Escape ${width}px`);
 }
 await page.setViewportSize({width:1440,height:1000});
 for(const key of Object.keys(expected)){
  await direction(key);for(const image of await page.locator('.apartment-card img').all())await image.evaluate(e=>{e.loading='eager';return e.decode();});
 }
 await direction('city');await page.addScriptTag({path:'/home/daniil/.local/share/codex-toolkit/node_modules/axe-core/axe.min.js'});
 const violations=[];
 for(const key of Object.keys(expected)){
  await direction(key);const result=await page.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}));});violations.push(...result.map(v=>({direction:key,...v})));
 }
 fs.writeFileSync(`${proof}/accessibility.json`,JSON.stringify(violations,null,2)+'\n');assert.deepEqual(violations,[]);passed('axe WCAG 2.1 AA on all five directions');
 const failure=await browser.newPage();await failure.route('**/objects.json',r=>r.abort());await failure.goto(base);await failure.locator('.catalog-load-error').waitFor();await failure.unroute('**/objects.json');await failure.locator('[data-retry]').click();await failure.waitForSelector('.apartment-card');await failure.close();passed('load failure and retry');
 assert.deepEqual(errors,[]);assert.deepEqual(httpErrors,[]);passed('all displayed images decode; no script or HTTP errors');
 fs.writeFileSync(`${proof}/checks.json`,JSON.stringify({date:new Date().toISOString(),url:base,shellReference:'approved homepage v1.0.0; city reference full menu',checks,errors,httpErrors},null,2)+'\n');await browser.close();console.log(`${checks.length} checks passed`);
})().catch(e=>{console.error(e);process.exit(1)});
