const assert=require('node:assert/strict');
const {chromium}=require('/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const page=await browser.newPage();
 const url=process.argv[2]||'http://127.0.0.1:8125/mezhdunarodnaya-nedvizhimost/';const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  for(const width of [320,390,540,768,1024,1440,1920]){
   await page.setViewportSize({width,height:900});const pair=[];
   for(const address of ['https://daniilterekh-prog.github.io/barn-estate-homepage-clone/kurortnaya/',url]){
    await page.goto(address,{waitUntil:'networkidle'});
    assert.equal(await page.locator('.catalog-mode-filters .catalog-quick-filters__button').count(),4);
    await page.locator('.catalog-mode-filters .catalog-quick-filters__button').nth(1).click();
    pair.push(await page.locator('.resort-quick-dropdown').evaluate(e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect(),o=getComputedStyle(e.querySelector('.catalog-quick-filters__option'));return{width:r.width,font:o.fontSize,weight:o.fontWeight,padding:o.padding,bg:s.backgroundColor};}));
    await page.keyboard.press('Escape');
   }
   assert.deepEqual(pair[1],pair[0]);
   const buttons=page.locator('.catalog-mode-filters .catalog-quick-filters__button');
   assert.deepEqual(await page.locator('.catalog-quick-filters__caption').allTextContents(),['Страна','Тип','Стоимость','Спальни']);
   for(let i=0;i<4;i++){
    await buttons.nth(i).click();assert.ok(await page.locator('.resort-quick-dropdown').isVisible());assert.equal(await page.locator('.hero-filter-modal').count(),0);
    assert.ok(await page.locator('.resort-quick-dropdown').evaluate(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight;}));
    await page.keyboard.press('ArrowDown');await page.keyboard.press('Escape');
    assert.equal(await buttons.nth(i).getAttribute('aria-expanded'),'false');
   }
   await buttons.nth(1).click();await page.locator('.resort-quick-dropdown [role=option]').getByText('Квартира',{exact:true}).click();
   assert.equal(await buttons.nth(1).locator('.catalog-quick-filters__caption').textContent(),'Квартира');
   await page.locator('.catalog-mode-detailed-filters').click();assert.ok(await page.locator('.hero-filter-modal input:checked').count()>0);
   await page.locator('.hero-filter-modal__reset').click();await page.locator('.hero-filter-modal__apply').click();
   assert.equal(await buttons.nth(1).locator('.catalog-quick-filters__caption').textContent(),'Тип');
   await buttons.nth(2).click();await page.locator('.resort-quick-dropdown [role=option]').getByText('до 50 млн ₽',{exact:true}).click();
   assert.equal(await page.locator('.catalog-grid__item:not([hidden])').count(),1);
   await buttons.nth(2).click();await page.locator('.resort-quick-dropdown [role=option]').getByText('Любая',{exact:true}).click();
   assert.equal(await page.locator('.catalog-grid__item:not([hidden])').count(),4);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await page.locator('.catalog-mode-toolbar').screenshot({path:'/tmp/international-quick-toolbar-'+width+'.png'});
   console.log('PASS',width,'4 reference dropdowns; property type; keyboard; full-filter sync; price/reset');
  }
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
