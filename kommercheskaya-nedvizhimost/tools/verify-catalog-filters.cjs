const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const{chromium}=require(process.env.PLAYWRIGHT_PATH||'/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const base=process.argv[2]||'http://127.0.0.1:8793/',reference=process.argv[3]||'http://127.0.0.1:8794/';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const report={base,reference,checks:[],errors:[]};
try{for(const width of[320,390,540,768,1024,1440,1920,2560,3840]){
 const p=await b.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});p.on('pageerror',e=>report.errors.push(e.message));p.on('response',r=>{if(r.status()>=400)report.errors.push(r.status()+' '+r.url())});
 await p.goto(base);await p.waitForFunction(()=>document.body.dataset.commercialReferenceReady==='true');await p.evaluate(()=>document.fonts.ready);
 assert.equal(await p.locator('.catalog-toolbar__primary').count(),1);assert.equal(await p.locator('.catalog-grid__item').count(),12);
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 const search=p.locator('[data-catalog-search]');assert.equal(await search.isVisible(),true);
 const quick=p.locator('.catalog-mode-filters .catalog-quick-filters__button');assert.equal(await quick.count(),4);
 for(let i=0;i<4;i++)assert.equal(await quick.nth(i).isVisible(),true);
 await p.locator('[data-commercial-deal="rent"]').first().click();assert.equal(await p.evaluate(()=>BarnesFilters.getState().dealType),'rent');
 await quick.first().click();await p.locator('.resort-quick-dropdown').waitFor({state:'visible'});await p.getByRole('option',{name:'Арбат',exact:true}).click();
 assert.deepEqual(await p.evaluate(()=>BarnesFilters.getState().districts),['Арбат']);assert.ok(await p.locator('.catalog-active-filter').filter({hasText:'Арбат'}).count());
 await p.locator('.catalog-mode-filters [data-quick-index="0"]').click();const typeOption=p.locator('.resort-quick-dropdown [role=option]').nth(1);await typeOption.click();assert.equal((await p.evaluate(()=>BarnesFilters.getState().propertyTypes)).length,1);
 await search.fill('593724');assert.equal(await p.evaluate(()=>BarnesFilters.getState().query),'593724');
 await p.locator('[data-catalog-reset]').click();assert.deepEqual(await p.evaluate(()=>BarnesFilters.getState().districts),[]);assert.equal(await p.evaluate(()=>BarnesFilters.getState().dealType),'rent');assert.equal(await search.inputValue(),'');
 await p.locator('.catalog-department .resort-select-trigger').click();assert.equal(await p.locator('.resort-quick-dropdown').isVisible(),true);await p.keyboard.press('Escape');assert.equal(await p.locator('.resort-quick-dropdown').isVisible(),false);
 await p.locator('.catalog-mode-detailed-filters').click();await p.locator('.resort-filters').waitFor({state:'visible'});
 const dialog=p.locator('.resort-filters .hero-filter-modal__dialog');const style=await dialog.evaluate(e=>({width:e.getBoundingClientRect().width,bg:getComputedStyle(e).backgroundColor}));assert.equal(style.bg,'rgb(255, 255, 255)');
 const ranges=p.locator('.resort-filters .hero-filter-panel-content__range-input');await ranges.nth(0).fill('200');await ranges.nth(1).fill('100');await p.locator('.resort-filters .hero-filter-modal__apply').click();assert.equal(await p.locator('.resort-filters').isVisible(),true);await ranges.nth(0).fill('50');await p.locator('.resort-filters .hero-filter-modal__apply').click();assert.equal(await p.locator('.resort-filters').isVisible(),false);
 assert.equal(await p.evaluate(()=>String(BarnesFilters.getState().priceMin)),'50');
 await p.locator('.catalog-map-trigger').click();await p.locator('.map-browser').waitFor({state:'visible'});if(width<=540)await p.locator('.map-browser__handle').click();
 const mapQuick=p.locator('.commercial-map-quick[data-quick-index="3"]');await mapQuick.click();await p.locator('.resort-quick-dropdown').waitFor({state:'visible'});await p.keyboard.press('Escape');await p.keyboard.press('Escape');
 // Card typography/geometry must stay equal to the pre-filter package.
 const before=await b.newPage({viewport:{width,height:1000}});await before.goto('file:///home/daniil/.codex/worktrees/commercial-public-sync/САЙТ/kommercheskaya-nedvizhimost/index.html');await before.waitForFunction(()=>document.body.dataset.commercialReferenceReady==='true');
 const cards=async page=>page.locator('.catalog-grid .apartment-card').first().evaluate(e=>['.apartment-card__name-text','.apartment-card__address','.listing-card-fact__value','.apartment-card__price'].map(s=>{const n=e.querySelector(s),c=getComputedStyle(n);return{font:c.fontSize,line:c.lineHeight,weight:c.fontWeight,color:c.color,padding:c.padding}}));assert.deepEqual(await cards(p),await cards(before));await before.close();
 const ref=await b.newPage({viewport:{width,height:1000}});await ref.goto(reference);await ref.waitForSelector('.catalog-toolbar__primary');await ref.waitForFunction(()=>[...document.styleSheets].some(s=>s.href?.includes('catalog-filters.css')));await ref.evaluate(()=>document.fonts.ready);
 const geometry=async page=>page.locator('.catalog-mode-filters .catalog-quick-filters__button').first().evaluate(e=>{const c=getComputedStyle(e);return{height:e.getBoundingClientRect().height,padding:c.padding,font:c.fontSize,color:c.color,bg:c.backgroundColor}});
 assert.deepEqual(await geometry(p),await geometry(ref));await ref.close();
 await p.locator('[data-catalog-reset]').click();
 if([390,1440].includes(width)){await p.addStyleTag({content:'.catalog-sticky,.floating-expert{visibility:hidden!important}'});await p.locator('.catalog-mode-toolbar').screenshot({path:path.resolve(__dirname,'../verification/catalog-filters-'+width+'.png')});}
 report.checks.push({width,dialog:style,cardsUnchanged:true,quickStyleMatchesResort:true});console.log('PASS filters '+width);await p.close();
 }assert.deepEqual(report.errors,[]);}finally{await b.close();report.passed=report.checks.length===9&&!report.errors.length;fs.writeFileSync(path.resolve(__dirname,'../verification/catalog-filters.json'),JSON.stringify(report,null,2)+'\n');}})().catch(e=>{console.error(e);process.exitCode=1});
