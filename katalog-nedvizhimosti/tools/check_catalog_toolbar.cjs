const {chromium}=require(process.env.BARNES_PLAYWRIGHT_MODULE||'/home/daniil/.local/share/codex-toolkit/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const base=process.env.BARNES_CATALOG_URL||'http://127.0.0.1:8921/katalog-nedvizhimosti/';
const proof=process.env.BARNES_PROOF_DIR||'katalog-nedvizhimosti/verification';fs.mkdirSync(proof,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome'});
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),results=[],errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try{
  await page.goto(base);await page.waitForSelector('.apartment-card');await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.locator('.catalog-toolbar__primary > *').count(),4);
  assert.equal(await page.locator('.catalog-toolbar__secondary > *').count(),2);
  assert.equal(await page.locator('.catalog-collections-row .barnes-brand-filters').count(),1);
  assert.equal(await page.locator('.catalog-collections-row').isVisible(),true);
  assert.equal(await page.locator('.catalog-result-summary .resort-sort-trigger').count(),1);
  assert.equal(await page.locator('.catalog-toolbar__primary').evaluate(e=>e.firstElementChild.matches('.catalog-mode-switch')),true);
  for(const width of [320,390,540,541,767,768,1024,1280,1440,1920,2560]){
   await page.setViewportSize({width,height:1000});
   for(const direction of ['city','country','commercial','resort','international']){
    await page.locator('#catalog-direction-select').selectOption(direction,{force:true});
    const m=await page.evaluate(()=>{
     const rect=e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height,right:r.right}},groups=[...document.querySelectorAll('.catalog-toolbar__primary,.catalog-toolbar__secondary')].map(e=>[...e.children].filter(e=>e.checkVisibility()).map(rect));
     return{overflow:document.documentElement.scrollWidth>innerWidth,groups,fieldFont:getComputedStyle(document.querySelector('#catalog-search')).fontSize,modeClipped:[...document.querySelectorAll('.catalog-mode-switch__button')].some(e=>e.scrollWidth>e.clientWidth+1),card:rect(document.querySelector('.apartment-card')),panel:rect(document.querySelector('.catalog-mode-toolbar'))};
    });
    assert.equal(m.overflow,false,`${direction} ${width}`);assert.equal(await page.locator('.catalog-mode-filters .catalog-quick-filters__button:visible').count(),4);assert.equal(m.modeClipped,false,`market clipped ${width}`);
    if(width>=1024){for(const row of m.groups){assert.ok(row.every(r=>Math.abs(r.y-row[0].y)<1&&r.h===64));for(let i=1;i<row.length;i++)assert.ok(row[i].x>=row[i-1].right)}assert.ok(m.groups[1][0].y>m.groups[0][0].y);assert.equal(m.fieldFont,(width<=1440?'18px':'20px'))}
    if(width<=767){assert.equal(await page.locator('.catalog-mode-filters').isVisible(),true);assert.equal(await page.locator('.catalog-mode-detailed-filters').isVisible(),true);assert.ok(m.panel.h<=410);assert.equal(m.fieldFont,(width<=540?'17px':'18px'));await page.locator('.catalog-mode-detailed-filters').click();assert.ok(await page.locator('.hero-filter-modal').isVisible());assert.equal(await page.locator('.hero-filter-modal [name=landMin]').isVisible(),direction==='country');await page.keyboard.press('Escape')}
    results.push({width,direction,twoRows:width>=1024,compact:width<=767,panelHeight:m.panel.h,overflow:m.overflow});
   }
   await page.locator('#catalog-direction-select').selectOption('city',{force:true});
   if([390,768,1024,1440].includes(width))await page.screenshot({path:`${proof}/toolbar-${width}.png`});
  }
  await page.setViewportSize({width:390,height:844});await page.locator('#catalog-direction-select').selectOption('country',{force:true});await page.locator('.catalog-mode-detailed-filters').click();await page.locator('.hero-filter-modal [name=landMin]').fill('15');await page.locator('.hero-filter-modal__apply').click();assert.equal(await page.locator('[data-filter-count]').innerText(),'1');assert.equal(await page.locator('[data-filter-count]').isVisible(),true);assert.ok(page.url().includes('landMin=15'));await page.locator('[data-reset]').click();assert.equal(await page.locator('[data-filter-count]').isVisible(),false);assert.equal(await page.locator('[data-reset]').isVisible(),true);
  await page.locator('#catalog-search').fill('564554');await page.waitForFunction(()=>document.querySelectorAll('.apartment-card').length===1);await page.locator('[data-reset]').click();await page.waitForFunction(()=>document.querySelectorAll('.apartment-card').length===6);
  await page.locator('.resort-sort-trigger').click();await page.locator('.resort-quick-dropdown [role=option]').filter({hasText:/^Цена меньше$/}).click();assert.ok(page.url().includes('sort=price_asc'));
  await page.locator('.catalog-mode-detailed-filters').click();await page.locator('.resort-filters input[name=brandFlags][value=selection]').check();await page.locator('.hero-filter-modal__apply').click();assert.equal(await page.locator('.catalog-collections-row input[value=selection]').isChecked(),true);assert.ok(await page.locator('.catalog-active-filter').filter({hasText:'Выбор BARN Estate'}).isVisible());await page.locator('[data-reset]').click();assert.equal(await page.locator('.catalog-collections-row input[value=selection]').isChecked(),false);assert.equal(await page.locator('.catalog-collections-row').isVisible(),true);
  await page.addScriptTag({path:'/home/daniil/.local/share/codex-toolkit/node_modules/axe-core/axe.min.js'});const violations=await page.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return r.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))});assert.deepEqual(violations,[]);assert.deepEqual(errors,[]);
  fs.writeFileSync(proof+'/two-row-toolbar.json',JSON.stringify({url:base,date:new Date().toISOString(),results,customDepartmentDropdown:true,mobileModalAndCount:true,searchAndReset:true,sortingAndCollections:true,quickFields:4,secondaryFiltersInFullForm:false,mobileQuickFields:4,accessibility:violations,errors},null,2)+'\n');console.log(`${results.length} direction/width combinations, mobile modal/count, search/reset, sorting/collections and axe passed`);
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
