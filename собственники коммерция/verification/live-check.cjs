const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {chromium}=require('/home/daniil/.local/share/codex-toolkit/node_modules/playwright');
const dir=path.dirname(__dirname);
const base='https://daniilterekh-prog.github.io/barn-estate-homepage-clone/'+encodeURIComponent('собственники коммерция')+'/';
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
(async()=>{
 const expected=sha(fs.readFileSync(path.join(dir,'index.html')));
 const response=await fetch(base+'?v=20261113-commercial');const html=Buffer.from(await response.arrayBuffer());
 const report={url:base,checkedAt:new Date().toISOString(),deployedCodeCommit:'e52b643a52ce78c59e37d7eead8388a422f6431f',htmlStatus:response.status,expectedHtmlSha256:expected,htmlSha256:sha(html),images:[],viewports:[],httpErrors:[],pageErrors:[],nonGetRequests:[]};
 if(response.status!==200||report.htmlSha256!==expected)throw Error('Published HTML has not reached the expected version');
 const manifest=JSON.parse(fs.readFileSync(path.join(dir,'assets/editorial/sources.json')));
 report.images=await Promise.all(manifest.images.map(async image=>{const r=await fetch(base+'assets/editorial/'+image.webp);const hash=sha(Buffer.from(await r.arrayBuffer()));if(r.status!==200||hash!==image.sha256)throw Error('Published image mismatch: '+image.webp);return {file:image.webp,status:r.status,sha256:hash};}));
 const browser=await chromium.launch({headless:true});const context=await browser.newContext();const page=await context.newPage();
 page.on('response',r=>{if(r.status()>=400)report.httpErrors.push(r.status()+' '+r.url());});page.on('pageerror',e=>report.pageErrors.push(e.message));page.on('request',r=>{if(!['GET','HEAD'].includes(r.method()))report.nonGetRequests.push(r.method()+' '+r.url());});
 for(const width of [390,1440]){
  await page.setViewportSize({width,height:width===390?844:1000});await page.goto(base+'?v=20261113-commercial',{waitUntil:'networkidle'});
  await page.evaluate(async()=>{for(const i of document.images)i.loading='eager';await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
  const state=await page.evaluate(()=>({width:innerWidth,h1:document.querySelector('h1')?.textContent,overflow:Math.max(0,document.documentElement.scrollWidth-innerWidth),brokenImages:[...document.images].filter(i=>i.currentSrc&&!i.naturalWidth).map(i=>i.currentSrc),faq:document.querySelectorAll('#faq details').length,tools:document.querySelectorAll('.owner-sale-services__card').length,stages:document.querySelectorAll('.owner-sale-stages__item').length,expert:document.querySelector('.floating-expert__name')?.textContent}));
  if(state.overflow||state.brokenImages.length||state.faq!==6||state.tools!==11||state.stages!==6||state.expert!=='Алина Медведева')throw Error('Published page smoke test failed: '+JSON.stringify(state));
  const summary=page.locator('#faq summary').first();await summary.focus();await summary.press('Enter');if(await page.locator('#faq details').first().getAttribute('open')===null)throw Error('Published FAQ keyboard failed');await summary.press('Enter');
  await page.locator('.owner-sale-hero__button').click();const portrait=await page.locator('.home-owner-form__hero-image').getAttribute('src');if(!portrait.includes('alina-medvedeva.webp'))throw Error('Wrong expert in published dialog');await page.keyboard.press('Escape');
  await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(__dirname,`published-${width}.png`)});report.viewports.push(state);
 }
 report.passed=report.httpErrors.length===0&&report.pageErrors.length===0&&report.nonGetRequests.length===0;
 fs.writeFileSync(path.join(__dirname,'publication.json'),JSON.stringify(report,null,2)+'\n');await browser.close();
 console.log(JSON.stringify(report));if(!report.passed)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
