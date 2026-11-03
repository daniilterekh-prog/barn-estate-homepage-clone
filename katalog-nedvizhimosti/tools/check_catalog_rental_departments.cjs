const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/home/daniil/.local/share/codex-toolkit/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const base=process.env.BARNES_CATALOG_URL||'http://127.0.0.1:8921/katalog-nedvizhimosti/';
const proof=process.env.BARNES_PROOF_DIR||path.resolve(__dirname,'../verification/rental-departments');
(async()=>{
 fs.mkdirSync(proof,{recursive:true});
 const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
 const page=await browser.newPage(),errors=[],checks=[];
 page.on('pageerror',error=>errors.push(error.message));
 const rental=['city','country','commercial'],all=[...rental,'resort','international'];
 async function snapshot(){return page.evaluate(()=>window.BarnesCatalogListing.getSnapshot());}
 async function load(direction,deal){const url=new URL(base);url.searchParams.set('direction',direction);url.searchParams.set('deal',deal);await page.goto(url.href);await page.waitForFunction(()=>window.BarnesCatalogListing?.getSnapshot().ready);}
 async function available(selector){return page.locator(selector).evaluate(select=>[...select.options].filter(o=>!o.disabled&&!o.hidden).map(o=>o.value));}
 async function mainOptions(expected){await page.locator('.resort-select-trigger[aria-label^="Департамент недвижимости:"]').click();assert.deepEqual(await page.locator('#resort-quick-dropdown [role=option]').allTextContents(),expected.map(key=>({city:'Москва',country:'Загородная',commercial:'Коммерческая',resort:'Курортная',international:'Зарубежная'})[key]));await page.keyboard.press('Escape');}
 for(const width of [320,390,1440]){
  await page.setViewportSize({width,height:900});
  for(const direction of all){
   await load(direction,'rent');const s=await snapshot();assert.equal(s.direction,rental.includes(direction)?direction:'city');assert.equal(s.filters.deal,'rent');assert.equal(new URL(page.url()).searchParams.get('direction'),s.direction);assert.deepEqual(await available('#catalog-direction-select'),rental);await mainOptions(rental);
   checks.push({width,scenario:'rental URL',requested:direction,direction:s.direction});
  }
  await load('country','rent');
  await page.locator('.resort-select-trigger[aria-label^="Департамент недвижимости:"]').click();await page.locator('#resort-quick-dropdown [role=option]').filter({hasText:'Москва'}).click();assert.equal((await snapshot()).filters.deal,'rent');
  await page.evaluate(()=>window.BarnesCatalogListing.setDirection('international'));assert.equal((await snapshot()).direction,'city');assert.equal((await snapshot()).filters.deal,'rent');
  await page.locator('[data-open-map]').click();if(width<=540)await page.locator('.map-browser__handle').click();assert.deepEqual(await available('[data-map-direction]'),rental);await page.locator('[data-map-direction]').selectOption('country');assert.equal((await snapshot()).direction,'country');assert.equal((await snapshot()).filters.deal,'rent');
  await page.locator('[data-map-mode]').first().click();assert.deepEqual(await available('[data-map-direction]'),all);await page.locator('[data-map-direction]').selectOption('international');assert.equal((await snapshot()).direction,'international');await page.locator('[data-map-mode]').nth(1).click();assert.equal((await snapshot()).direction,'city');assert.equal((await snapshot()).filters.deal,'rent');assert.deepEqual(await available('[data-map-direction]'),rental);await page.locator('.map-browser__close').click();
  await page.locator('.catalog-mode-switch > .catalog-mode-switch__button').first().click();await mainOptions(all);
  for(const direction of ['resort','international']){await load(direction,'buy');assert.equal((await snapshot()).direction,direction);await mainOptions(all);await page.locator('.catalog-mode-switch > .catalog-mode-switch__button').nth(1).click();assert.equal((await snapshot()).direction,'city');assert.equal((await snapshot()).filters.deal,'rent');await mainOptions(rental);}
  await page.screenshot({path:path.join(proof,`rent-${width}.png`)});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  checks.push({width,scenario:'dropdown, map, buy restoration, unsupported rental transitions',passed:true});
 }
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(proof,'rental-departments.json'),JSON.stringify({passed:true,base,checks,errors},null,2));await browser.close();console.log(JSON.stringify({passed:true,checks:checks.length,proof}));
})().catch(error=>{console.error(error);process.exit(1);});
