const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/home/daniil/.local/share/codex-toolkit/node_modules/playwright');
const root=path.resolve(__dirname,'..'),url=process.env.HANDOFF_URL||'http://127.0.0.1:8181/code/html/index.html',original=process.env.TEAM_URL||'http://127.0.0.1:8179/';
const widths=[320,360,375,390,414,540,768,769,1024,1200,1280,1281,1440,1920,2560,3840];
const selectors=['.site-header','.site-header__top','.site-header__nav-link','h1','.team-directory','.team-directory__intro','.team-search__field','.team-search input','.team-filters','.team-filter','.team-count','.team-grid','.team-member-card','.team-member-card__name','.team-member-card__role','.team-question__inner','.team-question h2','.team-question p','.primary-button','.site-footer__inner'];
async function ready(p){await p.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(e=>{e.loading='eager';return e.decode().catch(()=>{})}))})}
async function measure(p){return p.evaluate(selectors=>Object.fromEntries(selectors.map(selector=>{const e=document.querySelector(selector);if(!e)return[selector,null];const r=e.getBoundingClientRect(),s=getComputedStyle(e);return[selector,{width:r.width,height:r.height,x:r.x,y:r.y,fontFamily:s.fontFamily,fontSize:s.fontSize,fontWeight:s.fontWeight,lineHeight:s.lineHeight,letterSpacing:s.letterSpacing,color:s.color,background:s.backgroundColor,border:s.border,borderRadius:s.borderRadius,padding:s.padding,margin:s.margin,gap:s.gap,columns:s.gridTemplateColumns,display:s.display}]})),selectors)}
(async()=>{
 const browser=await chromium.launch(),context=await browser.newContext(),page=await context.newPage(),reference=await browser.newPage();
 const errors=[],failed=[],external=[],measurements=[],parity=[],flows=[];
 await context.route('**/*',route=>{if(new URL(route.request().url()).origin===new URL(url).origin)return route.continue();external.push(route.request().url());return route.abort()});
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push([r.status(),r.url()])});
 try{
  for(const width of widths){
   await page.setViewportSize({width,height:1000});await page.goto(url);await ready(page);
   assert.equal(await page.locator('.team-grid__item:visible').count(),27);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   measurements.push({width,height:1000,state:'page',elements:await measure(page)});
   if([390,1440,1920].includes(width)){
    await reference.setViewportSize({width,height:1000});await reference.goto(original);await ready(reference);
    const a=await page.screenshot(),b=await reference.screenshot();assert.ok(a.equals(b),`pixel-identical export at ${width}`);parity.push({width,pixelIdentical:true,sha256:crypto.createHash('sha256').update(a).digest('hex')});
    if(width===390||width===1440){fs.mkdirSync(path.join(root,'design/screenshots'),{recursive:true});fs.writeFileSync(path.join(root,`design/screenshots/team-${width}.png`),a)}
   }
  }
  await page.setViewportSize({width:1440,height:1000});await page.goto(url);await ready(page);
  for(const item of await page.locator('.site-header__nav-link').all()){await item.hover();await page.locator('#catalog-header-dropdown').waitFor({state:'visible'});assert.ok(await page.locator('#catalog-header-dropdown a').count()>0);await page.mouse.move(10,900);await page.locator('#catalog-header-dropdown').waitFor({state:'hidden'})}
  flows.push('all 9 header dropdowns');
  const search=page.getByRole('searchbox',{name:'Поиск по команде'});
  await search.fill('прус');assert.equal(await page.locator('.team-grid__item:visible').count(),1);await search.press('Escape');
  await page.locator('[data-filter=marketing]').click();assert.equal(await page.locator('.team-grid__item:visible').count(),4);await search.fill('SMM');assert.equal(await page.locator('.team-grid__item:visible').count(),2);
  await page.locator('[data-filter=office]').click();assert.ok(await page.locator('.team-search-empty').isVisible());await page.locator('.team-search-empty__reset').click();assert.equal(await page.locator('.team-grid__item:visible').count(),5);flows.push('search, filters, empty state and reset');
  await page.locator('[data-home-form-open]').click();await page.locator('.home-quiz__skip').click();await page.locator('.home-quiz__contact [type=submit]').click();assert.equal(await page.locator('[name=name]').getAttribute('aria-invalid'),'true');await page.keyboard.press('Escape');assert.ok(await page.locator('[data-home-form-open]').evaluate(e=>e===document.activeElement));flows.push('homepage form and validation');
  await page.setViewportSize({width:390,height:1000});await page.goto(url);await ready(page);
  await page.locator('.site-header__icon-btn').click();assert.ok(await page.locator('#site-mobile-menu').isVisible());await page.keyboard.press('Escape');assert.equal(await page.locator('[inert]').count(),0);
  await page.locator('.home-header-contacts-toggle').click();assert.equal(await page.locator('.home-header-contacts-panel a').count(),4);await page.keyboard.press('Escape');flows.push('mobile menu, Escape and contact panel');
  const nojs=await browser.newContext({javaScriptEnabled:false}),staticPage=await nojs.newPage();await staticPage.goto(url);assert.equal(await staticPage.locator('.team-grid__item:visible').count(),27);await nojs.close();flows.push('all 27 people available without JS');
  assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);assert.deepEqual(external,[]);
  fs.writeFileSync(path.join(root,'design/MEASUREMENTS.json'),JSON.stringify({date:new Date().toISOString(),units:'CSS px',measurements},null,2)+'\n');
  fs.writeFileSync(path.join(root,'VERIFICATION.json'),JSON.stringify({date:new Date().toISOString(),url,original,widths,parity,flows,errors,failed,externalRequests:external},null,2)+'\n');
  console.log('Passed: 16 widths, exact screenshots at 390/1440/1920, 9 dropdowns, team flows, form, mobile, no JS; no external asset requests.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
