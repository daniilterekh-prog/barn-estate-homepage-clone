/* Compare shared filter roles to the current resort node, retaining Moscow data. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const{chromium}=require(process.env.PLAYWRIGHT_PATH||'/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const base=process.argv[2]||'http://127.0.0.1:4192/',reference='https://daniilterekh-prog.github.io/barn-estate-homepage-clone/kurortnaya/';
const report={base,reference,date:'2026-11-02',checks:[],errors:[],missing:[]};
const props=['height','padding','fontSize','fontWeight','lineHeight','borderColor','borderRadius','color','backgroundColor'];
async function style(p,s,keys=props){return p.locator(s).first().evaluate((e,keys)=>Object.fromEntries(keys.map(k=>[k,getComputedStyle(e)[k]])),keys)}
(async()=>{let b=await chromium.launch({executablePath:'/usr/bin/google-chrome'});try{
 for(const width of[320,390,540,768,1024,1440,1920,2560,3840]){
  let p=await b.newPage({viewport:{width,height:1000}}),r=await b.newPage({viewport:{width,height:1000}});
  p.on('pageerror',e=>report.errors.push(e.message));p.on('response',x=>{if(x.status()>=400)report.missing.push(x.url())});
  await Promise.all([p.goto(base,{waitUntil:'networkidle'}),r.goto(reference,{waitUntil:'networkidle'})]);await p.waitForSelector('[data-city-home-kit-ready=true]',{state:'attached'});await Promise.all([p.evaluate(()=>document.fonts.ready),r.evaluate(()=>document.fonts.ready)]);
  for(const s of['.catalog-mode-switch__button','.catalog-text-search input','.catalog-toolbar__secondary .catalog-quick-filters__button','.catalog-department .resort-select-trigger'])assert.deepEqual(await style(p,s),await style(r,s),width+' '+s);
  assert.equal(await p.locator('.catalog-department select').inputValue(),'city');assert.equal(await p.locator('.catalog-mode-filters .catalog-quick-filters__item:visible').count(),width<768?4:2);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  if([390,1440].includes(width)){
   const first=p.locator('.catalog-mode-filters .catalog-quick-filters__button').first();await first.click();await p.locator('.resort-quick-dropdown [role=option]').nth(1).click();assert.equal((await p.evaluate(()=>BarnesFilters.getState().directions)).length,1);
   await p.locator('.catalog-active-filter').first().click();assert.equal((await p.evaluate(()=>BarnesFilters.getState().directions)).length,0);
   await p.locator('.catalog-mode-detailed-filters').click();await r.locator('.catalog-mode-detailed-filters').click();
   for(const s of['.hero-filter-modal__header','.hero-filter-modal__body','.hero-filter-modal__footer','.hero-filter-modal__title','.hero-filter-panel-content__title','.hero-filter-panel-content__range-input','.hero-filter-modal__apply','.hero-filter-modal__reset'])assert.deepEqual(await style(p,'.resort-filters '+s,['padding','fontSize','fontWeight','lineHeight','backgroundColor']),await style(r,'.resort-filters '+s,['padding','fontSize','fontWeight','lineHeight','backgroundColor']),width+' light form '+s);
   const modal=p.locator('.resort-filters');assert.equal(await modal.locator('[name=districts]').count()>0,true);assert.equal(await modal.locator('[name=amenities]').count()>0,true);
   await modal.locator('[name=priceMin]').fill('200');await modal.locator('[name=priceMax]').fill('100');await modal.locator('.hero-filter-modal__apply').click();assert.equal(await modal.locator('.resort-filters__error').isVisible(),true);await p.keyboard.press('Escape');assert.equal(await p.locator('.catalog-mode-detailed-filters').evaluate(e=>e===document.activeElement),true);
   await p.locator('[data-catalog-search]').fill('NO_SUCH_CITY_OBJECT');assert.equal(await p.locator('.catalog-filter-empty').isVisible(),true);await p.locator('.catalog-filter-empty [data-catalog-reset]').click();assert.equal(await p.locator('.catalog-grid__item:visible').count(),4);
   await p.locator('[data-mode=lot]').click();assert.equal(await p.locator('.catalog-grid__item:visible').count(),await p.locator('.catalog-grid__item[data-listing-mode=lot]').count());assert.equal(await p.locator('.catalog-mode-switch__button[aria-pressed=true]').count(),1);
   await p.locator('.catalog-result-summary .resort-sort-trigger').click();await p.locator('.resort-quick-dropdown [role=option]').filter({hasText:'Цена меньше'}).click();assert.equal(await p.evaluate(()=>BarnesFilters.getState().sort),'price_asc');
   await p.locator('[data-open-resort-map]').click();if(width<=540)await p.locator('.map-browser__handle').click();assert.equal(await p.locator('.map-browser__card').count(),12);assert.equal(await p.locator('.map-browser [data-filter=sort]').inputValue(),'asc');
   await p.locator('[data-map-market=new-build]').click();assert.equal(await p.locator('.map-browser__card').count(),4);await p.locator('.map-browser input[type=search]').fill('Вавилова');assert.equal(await p.locator('.map-browser__card').count(),1);
   await p.locator('.map-browser__filter-toggle').click();await p.locator('.hero-filter-modal--drawer').waitFor({state:'visible'});await p.keyboard.press('Escape');assert.equal(await p.locator('.map-browser').isVisible(),true);await p.locator('.map-browser__reset').click();assert.equal(await p.locator('.map-browser__card').count(),4);await p.locator('.map-browser__close').click();assert.equal(await p.locator('[data-open-resort-map]').evaluate(e=>e===document.activeElement),true);
   assert.equal(await p.locator('[data-catalog-search]').inputValue(),'');
  }
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);report.checks.push({width,rolesMatch:true,moscow:true,interactions:[390,1440].includes(width)});console.log('PASS resort filter design',width);await p.close();await r.close();
 }
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.missing,[]);
}finally{await b.close();fs.writeFileSync(path.resolve(__dirname,'../verification/resort-filters-2026-11-02.json'),JSON.stringify(report,null,2)+'\n')}})().catch(e=>{console.error(e);process.exitCode=1});
