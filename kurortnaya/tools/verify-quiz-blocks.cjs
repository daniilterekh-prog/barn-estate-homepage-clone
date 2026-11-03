const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const{chromium}=require(process.env.PLAYWRIGHT_PATH||'/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'}),checks=[],errors=[];try{
 const bases=process.argv.slice(2).length?process.argv.slice(2):['http://127.0.0.1:8875/kurortnaya/blocks/','http://127.0.0.1:8876/blocks/nodes/first-degree/'];
 for(const base of bases)for(const block of ['request-modal','floating-expert'])for(const width of [390,1440]){
  const p=await b.newPage({viewport:{width,height:width===390?844:1000}});p.on('pageerror',e=>errors.push(e.message));
  await p.goto(base+block+'/',{waitUntil:'networkidle'});await p.locator('[data-node-id]').waitFor();
  if(block==='floating-expert')await p.locator('.floating-expert__card').click();
  else await p.evaluate(()=>window.BarnEstateExpertQuiz.mount(document.querySelector('.catalog-feedback-modal')).start());
  const m=p.locator('.catalog-feedback-modal');await m.waitFor({state:'visible'});assert.equal(await m.getAttribute('data-quiz-step'),'goal');
  await m.locator('.resort-quiz__skip').click();
  const data=await m.evaluate(m=>{const rect=m.querySelector('.modal__content').getBoundingClientRect(),f=m.querySelector('.feedback-modal__form').getBoundingClientRect(),i=m.querySelector('.feedback-modal__hero-image');return{width:rect.width,height:rect.height,form:f.height,portrait:!!i.naturalWidth,alt:i.alt,title:getComputedStyle(m.querySelector('.feedback-modal__title')).fontSize,comment:m.querySelector('[name=comment]').disabled};});
  assert.equal(data.width,width===390?359:1040);assert.equal(data.height,width===390?828:820);assert.ok(Math.abs(data.form-(width===390?398.375:344.1875))<1);assert.equal(data.portrait,true);assert.match(data.alt,/Денис/);assert.equal(data.comment,true);assert.equal(data.title,width===390?'31px':'34px');
  checks.push({base,block,width,...data});console.log('PASS quiz block',base,block,width);await p.close();
 }
 assert.deepEqual(errors,[]);
}finally{await b.close()}fs.writeFileSync(path.resolve(__dirname,'../verification/quiz-blocks-2026-11-03.json'),JSON.stringify({checks,errors},null,2)+'\n')})().catch(e=>{console.error(e);process.exitCode=1});
