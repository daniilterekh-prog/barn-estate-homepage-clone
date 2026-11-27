/* Focused regression: same breadcrumb placement as the existing owner-sale UI kit. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('/home/daniil/.local/share/codex-toolkit/node_modules/playwright');
const base=process.env.COMMERCIAL_PREVIEW_URL||'http://127.0.0.1:8796/';
(async()=>{
 const browser=await chromium.launch();const page=await browser.newPage();const report={url:base,checkedAt:new Date().toISOString(),viewports:[],errors:[]};
 page.on('pageerror',e=>report.errors.push(e.message));page.on('response',r=>{if(r.status()>=400)report.errors.push(r.status()+' '+r.url())});
 try{
  for(const width of[320,390,768,1024,1280,1440,1920,3840]){
   await page.setViewportSize({width,height:width<768?844:1000});await page.goto(base,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
   const state=await page.evaluate(()=>{
    const nav=document.querySelector('.page-breadcrumbs'),line=document.querySelector('.site-header__top'),source=document.querySelector('.owner-sale-hero__breadcrumbs');
    const rect=e=>e?{top:e.getBoundingClientRect().top,bottom:e.getBoundingClientRect().bottom,left:e.getBoundingClientRect().left}:null;
    return{width:innerWidth,count:document.querySelectorAll('.page-breadcrumbs').length,visible:!!nav&&getComputedStyle(nav).display!=='none'&&getComputedStyle(nav).visibility!=='hidden',crumb:rect(nav),header:rect(line),text:nav?.textContent,sourceHidden:source?.getAttribute('aria-hidden')==='true'&&source.inert,overflow:document.documentElement.scrollWidth>innerWidth,home:nav?.querySelector('a')?.href};
   });
   assert.equal(state.count,1,'Missing common breadcrumb component');assert.equal(state.sourceHidden,true,'Old hero breadcrumbs must be hidden');assert.equal(state.overflow,false,'Horizontal overflow');assert.equal(state.home,'https://daniilterekh-prog.github.io/barn-estate-homepage-clone/exact-2026-10-21/');assert(state.text.includes('Продажа коммерческой недвижимости'));
   if(width>1024){assert(state.visible);assert(state.crumb.top>=state.header.top&&state.crumb.bottom<=state.header.bottom,'Breadcrumb must sit at the top by the header');await page.locator('.page-breadcrumbs a').focus();assert(await page.locator('.page-breadcrumbs a').evaluate(e=>e===document.activeElement));await page.evaluate(()=>scrollTo(0,200));await page.waitForFunction(()=>getComputedStyle(document.querySelector('.page-breadcrumbs')).visibility==='hidden');await page.evaluate(()=>scrollTo(0,0));await page.waitForFunction(()=>getComputedStyle(document.querySelector('.page-breadcrumbs')).visibility==='visible');}
   else assert.equal(state.visible,false,'Mobile behavior must match the existing owner-sale kit');
   if([390,1440].includes(width))await page.screenshot({path:path.join(__dirname,`breadcrumbs-${width}.png`)});
   report.viewports.push(state);
  }
  assert.deepEqual(report.errors,[]);report.passed=true;fs.writeFileSync(path.join(__dirname,process.env.COMMERCIAL_PREVIEW_URL?'breadcrumbs-publication.json':'breadcrumbs.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({passed:true,viewports:report.viewports.length,url:base}));
 }finally{await browser.close()}
})().catch(e=>{console.error(e.message);process.exit(1)});
