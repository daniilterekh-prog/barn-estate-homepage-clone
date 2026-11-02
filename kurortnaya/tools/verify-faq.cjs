const {chromium}=require(process.env.PLAYWRIGHT_PATH||'/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),base=process.argv[2]||'http://127.0.0.1:8875/kurortnaya/';
const source=JSON.parse(fs.readFileSync(path.join(root,'verification/faq-source-2026-11-02.json'))),norm=s=>s.replace(/\s+/g,' ').trim();
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'}),checks=[],errors=[];try{
 for(const width of [320,390,768,1440,1920,3840]){
  const p=await b.newPage({viewport:{width,height:1000}});p.on('pageerror',e=>errors.push(e.message));await p.goto(base,{waitUntil:'networkidle'});await p.locator('[data-brand-context=listing]').waitFor();await p.locator('.floating-expert__close').click();
  const items=p.locator('.catalog-faq__item');assert.equal(await items.count(),source.items.length);
  for(let i=0;i<source.items.length;i++){assert.equal(norm(await items.nth(i).locator('.catalog-faq__question').textContent()),norm(source.items[i].question));assert.equal(norm(await items.nth(i).locator('.catalog-faq__answer-content').textContent()),norm(source.items[i].answer));}
  const indexes=[390,1440].includes(width)?source.items.map((_,i)=>i):[0,9];
  for(const i of indexes){
   const item=items.nth(i),q=item.locator('.catalog-faq__question'),a=item.locator('.catalog-faq__answer');
   assert.equal(await q.getAttribute('aria-expanded'),'false');assert.equal(await a.getAttribute('aria-hidden'),'true');assert.equal(await a.evaluate(e=>e.inert),true);
   assert.equal(await q.getAttribute('aria-controls'),await a.getAttribute('id'));await q.click();
   await p.waitForFunction(id=>{const a=document.getElementById(id),c=a.querySelector('.catalog-faq__answer-content');return a.getBoundingClientRect().height>30&&c.clientHeight>=c.scrollHeight-1},await a.getAttribute('id'));
   assert.equal(await q.getAttribute('aria-expanded'),'true');assert.equal(await a.getAttribute('aria-hidden'),'false');assert.equal(await a.evaluate(e=>e.inert),false);
   await q.click();await p.waitForFunction(id=>document.getElementById(id).getBoundingClientRect().height<1,await a.getAttribute('id'));assert.equal(await q.getAttribute('aria-expanded'),'false');
  }
  const first=items.first().locator('button');await first.focus();await p.keyboard.press('Enter');assert.equal(await first.getAttribute('aria-expanded'),'true');await p.keyboard.press('Space');assert.equal(await first.getAttribute('aria-expanded'),'false');
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);assert.equal(await p.locator('.catalog-feedback-modal').count(),1);
  checks.push({width,sourceItems:10,answersVerified:true,clicked:indexes.length,keyboard:true,aria:true,noClipping:true});console.log('PASS FAQ',width,indexes.length);await p.close();
 }
 for(const width of [390,1440]){const p=await b.newPage({viewport:{width,height:1000}});await p.goto(new URL('blocks/faq/',base).href,{waitUntil:'networkidle'});const q=p.locator('.catalog-faq__question').first();await q.click();assert.equal(await q.getAttribute('aria-expanded'),'true');await q.click();assert.equal(await q.getAttribute('aria-expanded'),'false');checks.push({block:'faq',width,toggle:true});console.log('PASS portable FAQ',width);await p.close()}
 assert.deepEqual(errors,[]);
}finally{await b.close()}fs.writeFileSync(path.join(root,'verification/faq-2026-11-02.json'),JSON.stringify({source:source.source,checks,errors},null,2)+'\n')})().catch(e=>{console.error(e);process.exitCode=1});
