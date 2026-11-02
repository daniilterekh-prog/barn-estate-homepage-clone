const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const root=path.resolve(__dirname,'..'),base=process.argv[2]||'http://127.0.0.1:8875/kurortnaya/';
const source=JSON.parse(fs.readFileSync(path.join(root,'verification/intro-source-2026-11-02.json')));
const normalize=s=>s.replace(/\s+/g,' ').trim();
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'}),checks=[],errors=[];try{
 for(const width of [320,390,768,1440,1920,3840]){
  const p=await b.newPage({viewport:{width,height:1000}});p.on('pageerror',e=>errors.push(e.message));await p.goto(base,{waitUntil:'networkidle'});await p.locator('[data-brand-context=listing]').waitFor();
  const toggle=p.locator('.catalog-intro__toggle'),details=p.locator('.catalog-intro__details');
  assert.equal(await toggle.getAttribute('aria-expanded'),'false');assert.equal(await details.isVisible(),false);
  // Real keyboard activation covers the same native button as a pointer click.
  await toggle.focus();await p.keyboard.press('Enter');assert.equal(await toggle.getAttribute('aria-expanded'),'true');assert.equal(await details.isVisible(),true);
  assert.equal(normalize(await details.textContent()),normalize(source.detailsText),'Complete source copy');assert.match(await toggle.innerText(),/свернуть/i);
  await p.setViewportSize({width:Math.max(320,width-37),height:850});
  assert.equal(await details.evaluate(e=>e.scrollHeight<=e.clientHeight+1),true,'Expanded copy not clipped after resize');
  await toggle.click();assert.equal(await details.isVisible(),false);assert.equal(await toggle.getAttribute('aria-expanded'),'false');assert.match(await toggle.innerText(),/читать далее/i);
  assert.doesNotMatch(await p.locator('body').innerText(),/\bBARNES\b/i,'Old visible brand removed');
  await p.locator('.catalog-header-request,.catalog-sticky__request').first().count();
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);checks.push({width,keyboard:true,completeCopy:true,resize:true,collapse:true,brand:true});console.log('PASS intro/brand',width);await p.close();
 }
 for(const width of [390,1440]){
  const p=await b.newPage({viewport:{width,height:1000}});await p.goto(new URL('blocks/brand-intro/',base).href,{waitUntil:'networkidle'});const t=p.locator('.catalog-intro__toggle'),d=p.locator('.catalog-intro__details');await t.click();assert.equal(await t.getAttribute('aria-expanded'),'true');assert.equal(normalize(await d.textContent()),normalize(source.detailsText));assert.equal(await d.isVisible(),true);await t.click();assert.equal(await t.getAttribute('aria-expanded'),'false');assert.equal(await d.isVisible(),false);checks.push({block:'brand-intro',width,disclosure:true,completeCopy:true});console.log('PASS standalone intro',width);await p.close();
 }
 assert.deepEqual(errors,[]);
}finally{await b.close()}fs.writeFileSync(path.join(root,'verification/intro-brand-2026-11-02.json'),JSON.stringify({source:source.url,checks,errors},null,2)+'\n')})().catch(e=>{console.error(e);process.exitCode=1});
