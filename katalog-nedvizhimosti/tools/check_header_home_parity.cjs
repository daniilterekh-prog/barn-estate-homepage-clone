/* Live homepage reference: matching header geometry, typography and white menu states. */
const{chromium}=require(process.env.BARNES_PLAYWRIGHT_MODULE||'/home/daniil/.local/share/codex-toolkit/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const base=process.env.BARNES_CATALOG_URL||'http://127.0.0.1:8921/katalog-nedvizhimosti/';
const reference=process.env.BARNES_HOME_URL||'https://daniilterekh-prog.github.io/barn-estate-homepage-clone/exact-2026-10-21/';
const proof=process.env.BARNES_PROOF_DIR||'/tmp/catalog-header-home-parity';fs.mkdirSync(proof,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true});
 const home=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1,reducedMotion:'reduce'}),catalog=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1,reducedMotion:'reduce'});
 const report={base,reference,date:new Date().toISOString(),layouts:[],checks:[],errors:[],http:[],axe:[]};
 catalog.on('pageerror',e=>report.errors.push(e.message));catalog.on('response',r=>{if(r.status()>=400)report.http.push(r.status()+' '+r.url())});
 const pass=name=>{report.checks.push(name);console.log('PASS',name)};
 const keys={header:'.site-header',inner:'.site-header__inner',top:'.site-header__top',left:'.site-header__left',burger:'.site-header__icon-btn',burgerIcon:'.site-header__icon-btn svg',favorite:'.site-header__favorites-btn',logo:'.site-header__logo img',right:'.site-header__right',request:'.site-header__request',contacts:'.site-header__messengers',contactToggle:'.home-header-contacts-toggle',nav:'.site-header__nav',navList:'.site-header__nav-list'};
 const styleKeys=['fontSize','fontWeight','lineHeight','letterSpacing','gap','padding','margin'];
 const measure=selectors=>{function item(e){if(!e)return{visible:false};const s=getComputedStyle(e),r=e.getBoundingClientRect();return{visible:e.checkVisibility()&&r.height>0,rect:[r.x,r.y,r.width,r.height],styles:Object.fromEntries(['fontSize','fontWeight','lineHeight','letterSpacing','gap','padding','margin','color','backgroundColor','borderBottomColor'].map(k=>[k,s[k]]))};}return{items:Object.fromEntries(Object.entries(selectors).map(([k,s])=>[k,item(document.querySelector(s))])),links:[...document.querySelectorAll('.site-header__nav-link')].map(e=>({text:e.textContent.trim(),href:e.href,...item(e)})),overflow:document.documentElement.scrollWidth>innerWidth,headerCount:document.querySelectorAll('header.site-header').length}};
 function compare(a,b,label){assert.equal(b.visible,a.visible,label+' visibility');if(!a.visible)return;for(let i=0;i<4;i++)assert.ok(Math.abs(a.rect[i]-b.rect[i])<.1,label+' rect '+i+' '+a.rect[i]+'/'+b.rect[i]);for(const key of styleKeys)assert.equal(b.styles[key],a.styles[key],label+' '+key);}
 try{
  await Promise.all([home.goto(reference),catalog.goto(base+'?direction=international')]);
  for(const p of[home,catalog]){await p.waitForSelector('.home-header-contacts-toggle',{state:'attached'});await p.evaluate(()=>document.fonts.ready)}
  for(const width of[320,390,540,541,767,768,1024,1280,1281,1440,1441,1920,2560,3840]){
   for(const p of[home,catalog])await p.setViewportSize({width,height:1000});
   for(const scroll of[0,200]){
    for(const p of[home,catalog])await p.evaluate(y=>scrollTo(0,y),scroll);await home.waitForTimeout(650);
    const h=await home.evaluate(measure,keys),c=await catalog.evaluate(measure,keys);assert.equal(c.headerCount,1);assert.equal(c.overflow,false);
    for(const key of Object.keys(keys))compare(h.items[key],c.items[key],`${width}/${scroll}/${key}`);
    assert.equal(c.links.length,h.links.length);
    for(let i=0;i<h.links.length;i++){compare(h.links[i],c.links[i],`${width}/${scroll}/nav${i}`);assert.equal(c.links[i].text,h.links[i].text);assert.equal(c.links[i].href,h.links[i].href)}
    if(scroll){for(const key of['header','top','burger','favorite','request','contactToggle'])if(h.items[key].visible)for(const prop of['color','backgroundColor','borderBottomColor'])assert.equal(c.items[key].styles[prop],h.items[key].styles[prop],`${width}/${key}/${prop}`);}
    report.layouts.push({width,state:scroll?'scrolled':'top',headerHeight:c.items.header.rect[3],navVisible:c.items.nav.visible,top:c.items.top.rect,logo:c.items.logo.rect,burger:c.items.burger.rect,gap:c.items.top.styles.margin,referenceHeaderHeight:h.items.header.rect[3]});
    if([390,1440,2560].includes(width))await catalog.screenshot({path:proof+'/catalog-'+(scroll?'scrolled':'top')+'-'+width+'.png',clip:{x:0,y:0,width:c.items.header.rect[2],height:c.items.header.rect[3]}});
   }
  }pass('28 states across 14 widths: homepage rectangles, type, gap, labels, links and white palette match; one header');
  await home.setViewportSize({width:1440,height:1000});await catalog.setViewportSize({width:1440,height:1000});
  for(const y of[48,49]){for(const p of[home,catalog])await p.evaluate(y=>scrollTo(0,y),y);await home.waitForTimeout(100);assert.equal(await catalog.locator('.site-header').evaluate(e=>e.classList.contains('site-header--scrolled')),y>48);assert.equal(await home.locator('.site-header').evaluate(e=>e.classList.contains('site-header--scrolled')),y>48);}pass('desktop compact state uses the same 48px threshold');
  await catalog.locator('.site-header__request').click();assert.equal(await catalog.locator('[data-quiz-step]').getAttribute('data-quiz-step'),'task');assert.ok(await catalog.locator('.home-quiz__option').first().isVisible());await catalog.keyboard.press('Escape');assert.ok(await catalog.locator('.site-header__request').evaluate(e=>e===document.activeElement));
  const quickDeal=catalog.locator('.catalog-mode-switch__button').first();await quickDeal.evaluate(e=>{const r=e.getBoundingClientRect();scrollTo(0,r.top+scrollY+r.height/2-130)});await catalog.waitForTimeout(650);assert.ok(await quickDeal.evaluate(e=>{const r=e.getBoundingClientRect();return e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))}));pass('request still opens the quiz; transparent reserved space never blocks controls below the compact header');
  for(const p of[home,catalog])await p.evaluate(()=>scrollTo(0,0));await home.waitForTimeout(650);
  for(let i=0;i<9;i++){
   await home.locator('.site-header__nav-link').nth(i).hover();await home.locator('.site-header__nav-item').nth(i).locator('.site-header__subnav').waitFor({state:'visible'});
   await catalog.locator('.site-header__nav-link').nth(i).hover();
   const read=es=>es.map(e=>{const s=getComputedStyle(e);return{text:e.textContent.trim(),href:e.href,font:s.fontFamily,size:s.fontSize,weight:s.fontWeight,line:s.lineHeight,spacing:s.letterSpacing}});
   assert.deepEqual(await catalog.locator('.catalog-header-dropdown__link').evaluateAll(read),await home.locator('.site-header__nav-item').nth(i).locator('.site-header__subnav-link').evaluateAll(read));
  }pass('all nine hover submenus use the homepage texts, URLs and type roles');

  const menuKeys={header:'.site-header',top:'.site-header__top',menu:'.site-menu',inner:'.site-menu__inner',main:'.site-menu__main',nav:'.site-menu__nav',title:'.site-menu__nav-title',link:'.site-menu__nav-link',featured:'.site-menu__featured',bottom:'.site-menu__bottom',bottomTitle:'.site-menu__bottom-title',bottomList:'.site-menu__bottom-list',bottomLink:'.site-menu__bottom-link'};
  for(const width of[390,1024,1440]){
   for(const p of[home,catalog]){await p.setViewportSize({width,height:1000});await p.evaluate(()=>scrollTo(0,200));await p.locator('.site-header__icon-btn').click();await p.locator('.site-menu').waitFor({state:'visible'});}await home.waitForTimeout(650);
   let h=await home.evaluate(measure,menuKeys),c=await catalog.evaluate(measure,menuKeys);for(const key of Object.keys(menuKeys))compare(h.items[key],c.items[key],`${width}/menu/${key}`);
   assert.equal(await catalog.locator('.site-menu').innerText(),await home.locator('.site-menu').innerText());
   if(width<=1024){for(const p of[home,catalog])await p.locator('.home-header-contacts-toggle').click();h=await home.evaluate(measure,{panel:'.home-header-contacts-panel'});c=await catalog.evaluate(measure,{panel:'.home-header-contacts-panel'});compare(h.items.panel,c.items.panel,width+'/contact panel');assert.equal(await catalog.locator('.home-header-contacts-panel a').count(),4);for(const p of[home,catalog]){await p.keyboard.press('Escape');assert.ok(await p.locator('.site-menu').isVisible());}}
   for(const p of[home,catalog]){await p.keyboard.press('Escape');await p.locator('.site-menu').waitFor({state:'hidden'});if(p===catalog)assert.ok(await p.locator('.site-header__icon-btn').evaluate(e=>e===document.activeElement));}
  }pass('menu, content/brand labels, contact popover, nested Escape and return focus match at 390/1024/1440');
  for(const width of[390,1440]){await catalog.setViewportSize({width,height:1000});await catalog.evaluate(()=>scrollTo(0,0));await catalog.waitForTimeout(650);await catalog.addScriptTag({path:'/home/daniil/.local/share/codex-toolkit/node_modules/axe-core/axe.min.js'});const v=await catalog.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations);assert.deepEqual(v,[]);report.axe.push({width,violations:v});}pass('mobile/desktop axe; no runtime or HTTP errors');
  assert.deepEqual(report.errors,[]);assert.deepEqual(report.http,[]);report.passed=true;
 }finally{fs.writeFileSync(proof+'/parity.json',JSON.stringify(report,null,2));await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
