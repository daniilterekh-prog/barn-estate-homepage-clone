const fs=require('node:fs/promises'),path=require('node:path'),assert=require('node:assert/strict');
const toolkit=process.env.WEB_CAPTURE_TOOLKIT||'/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit';
const {chromium}=require(path.join(toolkit,'node_modules/playwright'));
const {PNG}=require(path.join(process.env.CODEX_TOOLKIT_ROOT||path.join(require('node:os').homedir(),'.local/share/codex-toolkit'),'node_modules/pngjs'));
const root=path.resolve(__dirname,'../stranitsa-lota');
const capture=process.argv[2]||'/tmp/barnes-588036';
(async()=>{
  const pixelmatch=(await import(path.join(toolkit,'node_modules/pixelmatch/index.js'))).default;
  const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1440,height:900}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
  const load=async()=>{await p.goto('file://'+root+'/index.html');await p.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))});await p.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}.floating-expert{opacity:1!important;transform:none!important}'});};
  const cases=[['menu','.site-header__icon-btn','.site-menu'],['gallery','.lot-hero__action','.lot-gallery-modal'],['callback','.site-footer__callback-btn','.feedback-modal'],['tour','.lot-hero__card-action','.feedback-modal'],['presentation','.lot-hero__card-action:last-child','.feedback-modal'],['price','.lot-hero__track','.feedback-modal'],['construction','.construction__card','.construction-gallery-modal']];
  const visuals=[];
  for(const width of [390,1440]){
    await p.setViewportSize({width,height:900});
    for(const[name,button,modal]of cases){
      await load();await p.locator(button).first().click();await p.locator(modal).waitFor({state:'visible'});await p.evaluate(async()=>{await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))});
      assert.equal(await p.evaluate(()=>getComputedStyle(document.body).overflow),'hidden');
      const shot=await p.screenshot({path:path.join(capture,`local-state-${name}-${width}.png`)});
      if(width===1440){const a=PNG.sync.read(await fs.readFile(path.join(capture,`state-${name}.png`))),c=PNG.sync.read(shot),d=new PNG({width:a.width,height:a.height});const changed=pixelmatch(a.data,c.data,d.data,a.width,a.height,{threshold:0,includeAA:true});await fs.writeFile(path.join(capture,`state-diff-${name}.png`),PNG.sync.write(d));visuals.push({name,width,changedPixels:changed})}
      if(name==='gallery'){const counter=p.locator('.lot-gallery-modal__counter');assert.equal(await counter.innerText(),'1/38');await p.getByRole('button',{name:'Следующее фото',exact:true}).click();assert.equal(await counter.innerText(),'2/38');await p.getByRole('tab',{name:'На карте',exact:true}).click();await p.locator('.lot-gallery-modal__map').waitFor({state:'visible'});await p.getByRole('tab',{name:'Галерея',exact:true}).click();}
      await p.keyboard.press('Escape');assert.equal(await p.locator('[data-local-overlay]').count(),0);
      console.log('PASS',width,name);
    }
    await load();await p.locator('.lot-developer__toggle').click();assert.equal(await p.locator('.lot-developer__toggle').getAttribute('aria-expanded'),'true');await p.locator('.lot-developer__toggle').click();assert.equal(await p.locator('.lot-developer__toggle').getAttribute('aria-expanded'),'false');
    const old=await p.locator('.reviews-section__author').innerText();await p.getByRole('button',{name:'Следующий отзыв'}).click();assert.notEqual(await p.locator('.reviews-section__author').innerText(),old);await p.getByRole('button',{name:'Предыдущий отзыв'}).click();assert.equal(await p.locator('.reviews-section__author').innerText(),old);
    const slider=p.locator('.mortgage [role="slider"]').last();await slider.focus();await p.keyboard.press('ArrowRight');assert.equal(await slider.getAttribute('aria-valuenow'),'21');
    await p.getByRole('button',{name:'Школы',exact:true}).click();assert.ok((await p.locator('.surroundings-map__category--active').innerText()).includes('Школы'));
    await p.locator('.surroundings-map__search-input').fill('школа');
    const form=p.locator('.catalog-consultation form');assert.equal(await form.evaluate(f=>f.checkValidity()),false);
    console.log('PASS',width,'developer/reviews/mortgage/map/forms');
  }
  assert.deepEqual(errors,[]);await b.close();await fs.writeFile(path.join(root,'interaction-verification.json'),JSON.stringify({checkedAt:new Date().toISOString(),widths:[390,1440],errors,passed:true,visuals},null,2)+'\n');console.log(JSON.stringify(visuals));
})().catch(e=>{console.error(e);process.exit(1)});
