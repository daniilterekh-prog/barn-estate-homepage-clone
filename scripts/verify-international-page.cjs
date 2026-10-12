/* Compare geometry and hero pixels against the public reference, then exercise local dialogs. */
const fs=require('node:fs/promises'),path=require('node:path'),assert=require('node:assert/strict');
const toolkit='/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules';
const {chromium}=require(path.join(toolkit,'playwright'));
const {PNG}=require(path.join(toolkit,'pngjs'));
(async()=>{
  const pixelmatch=(await import(path.join(toolkit,'pixelmatch/index.js'))).default;
  const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({deviceScaleFactor:1});
  const report={viewports:[],interactions:[],errors:[]};
  const local='file://'+path.resolve('mezhdunarodnaya-nedvizhimost/index.html');
  const output='/tmp/international-final-check';await fs.mkdir(output,{recursive:true});
  const selectors=['.catalog-hero','.catalog-best-offers','.catalog-map','.catalog-grid','.catalog-intro','.catalog-consultation','.departments-section','.news-section','.catalog-faq','.catalog-contact','.site-footer'];
  page.on('pageerror',e=>report.errors.push(e.message));
  for(const width of [390,541,768,1024,1440,1920]){
    const pair={};await page.setViewportSize({width,height:900});
    for(const [name,url]of [['original','https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost'],['local',local]]){
      await page.goto(url,{waitUntil:'domcontentloaded'});await page.waitForTimeout(1300);await page.evaluate(()=>document.fonts.ready);
      await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}.floating-expert{opacity:1!important;transform:none!important}'});
      pair[name]=await page.evaluate(selectors=>({sections:selectors.map(s=>{const r=document.querySelector(s).getBoundingClientRect();return{selector:s,height:r.height}}),overflow:document.documentElement.scrollWidth-innerWidth}),selectors);
      await page.locator('.catalog-hero').screenshot({path:path.join(output,name+'-hero-'+width+'.png')});
    }
    const a=PNG.sync.read(await fs.readFile(path.join(output,'original-hero-'+width+'.png'))),b=PNG.sync.read(await fs.readFile(path.join(output,'local-hero-'+width+'.png')));
    assert.equal(a.width,b.width);assert.equal(a.height,b.height);
    const diff=new PNG({width:a.width,height:a.height});const mismatched=pixelmatch(a.data,b.data,diff.data,a.width,a.height,{threshold:0,includeAA:true});
    await fs.writeFile(path.join(output,'diff-hero-'+width+'.png'),PNG.sync.write(diff));
    const differences=pair.original.sections.map((s,i)=>({selector:s.selector,heightDelta:Number((pair.local.sections[i].height-s.height).toFixed(2))})).filter(s=>Math.abs(s.heightDelta)>.5);
    assert.ok(pair.local.overflow<=0,'Horizontal overflow');
    assert.ok(differences.every(s=>s.selector==='.catalog-intro'),'Unexpected block geometry: '+JSON.stringify(differences));
    report.viewports.push({width,heroPixelsDifferent:mismatched,heroMismatchPercent:Number((100*mismatched/(a.width*a.height)).toFixed(4)),differences});
  }
  for(const width of [390,1440]){
    await page.setViewportSize({width,height:900});await page.goto(local,{waitUntil:'domcontentloaded'});await page.waitForTimeout(500);
    await page.locator('.catalog-hero-filters__filter-icon').click();await page.locator('.hero-filter-modal__dialog').waitFor({state:'visible'});
    assert.equal(await page.locator('.hero-filter-modal input[type="checkbox"]').count(),68);
    const check=page.locator('.hero-filter-modal input[type="checkbox"]').first();await page.locator('.hero-filter-modal .ui-checkbox__label').first().click();assert.ok(await check.isChecked());
    await page.keyboard.press('Escape');assert.equal(await page.locator('.hero-filter-modal').count(),0);
    await page.locator('.apartment-card--catalog .apartment-card__call-btn').first().click();await page.locator('.feedback-modal').waitFor({state:'visible'});
    await page.locator('.feedback-modal__submit').click();assert.ok(await page.locator('.feedback-modal input[autocomplete="name"]').evaluate(e=>!e.checkValidity()));
    await page.keyboard.press('Escape');assert.equal(await page.locator('.feedback-modal').count(),0);
    await page.locator('.floating-expert__card').click();assert.equal(await page.locator('.feedback-modal__title').innerText(),'Обратная связь');await page.keyboard.press('Escape');
    await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.locator('.site-header__icon-btn').click();await page.locator('.site-menu').waitFor({state:'visible'});await page.keyboard.press('Escape');
    const faq=page.locator('.catalog-faq__question').first();await faq.click();assert.equal(await faq.getAttribute('aria-expanded'),'true');await faq.click();assert.equal(await faq.getAttribute('aria-expanded'),'false');
    await page.locator('.catalog-projects-map__fullscreen').click();assert.equal(await page.locator('.source-map-expanded').count(),1);await page.keyboard.press('Escape');
    await page.getByRole('button',{name:'Увеличить карту',exact:true}).click();assert.ok(await page.locator('.ymaps3--tile-layer').evaluate(e=>e.style.transform.includes('1.2')));
    report.interactions.push({width,filters:true,callback:true,expert:true,menu:true,faq:true,mapFullscreen:true,mapZoom:true});
  }
  assert.deepEqual(report.errors,[]);
  await fs.mkdir('mezhdunarodnaya-nedvizhimost/verification',{recursive:true});await fs.writeFile('mezhdunarodnaya-nedvizhimost/verification/result.json',JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
