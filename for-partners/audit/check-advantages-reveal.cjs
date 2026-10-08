const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const assert=require('assert/strict');
(async()=>{
  const results=[];
  for(const width of (process.env.WIDTHS||'390,1440').split(',').map(Number)){
    const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/home/daniil/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome',args:['--disable-dev-shm-usage','--disable-gpu']});
    try {
      const page=await browser.newPage({viewport:{width,height:1000},hasTouch:width<=1024,isMobile:width<=1024,reducedMotion:'reduce'});
      await page.route('**/*',r=>{
        if(r.request().resourceType()==='image'&&process.env.NO_IMAGES==='1')return r.abort();
        if(r.request().resourceType()!=='document')return r.continue();
        const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
        const start=html.indexOf('<section id="advantages"');
        const section=html.slice(start,html.indexOf('</section>',start)+10);
        return r.fulfill({contentType:'text/html',body:html.slice(0,html.indexOf('</head>')+7)+'<body><main class="ambassadors-page"><div id="barnes-directions"></div>'+section+'</main><link rel="stylesheet" href="assets/advantages-enhanced.css"><script src="for-partners.js"></script></body></html>'});
      });
      await page.goto('http://127.0.0.1:4183/for-partners/',{waitUntil:'networkidle'});
      const root=page.locator('#advantages');
      const card=root.locator('.ambassadors-advantages__card').first();
      const state=()=>card.evaluate(e=>({shade:getComputedStyle(e.querySelector('.ambassadors-advantages__overlay')).backgroundColor,visibility:getComputedStyle(e.querySelector('.ambassadors-advantages__description')).visibility,height:e.getBoundingClientRect().height}));
      assert.equal(await root.locator('.ambassadors-advantages__card').count(),10);
      const aligned=await root.locator('.ambassadors-advantages__card').evaluateAll(cards=>cards.map(c=>{const top=c.getBoundingClientRect().top;return {number:c.querySelector('.ambassadors-advantages__number').getBoundingClientRect().top-top,title:c.querySelector('h3').getBoundingClientRect().top-top};}));
      for(const v of aligned){assert.equal(v.number,aligned[0].number);assert.equal(v.title,aligned[0].title);}
      assert.match(await root.locator('h3').last().textContent(),/^Art de Vivre/);
      const before=await state();assert.equal(before.shade,'rgba(0, 0, 0, 0.12)');assert.equal(before.visibility,'hidden');
      if(process.env.NO_IMAGES!=='1')await root.screenshot({path:path.join(__dirname,`advantages-reveal-${width}-closed.png`)});
      if(width>1024)await card.hover();
      else await card.locator('button').tap();
      const open=await state();assert.equal(open.shade,'rgba(0, 0, 0, 0.68)');assert.equal(open.visibility,'visible');assert.equal(open.height,before.height);
      if(process.env.NO_IMAGES!=='1')await root.screenshot({path:path.join(__dirname,`advantages-reveal-${width}-open.png`)});
      if(width>1024)await page.mouse.move(0,0);
      else await card.locator('button').tap();
      assert.equal((await state()).shade,'rgba(0, 0, 0, 0.12)');assert.equal((await state()).visibility,'hidden');
      await root.locator('.splide__track').focus();
      await page.keyboard.press('Home');
      assert.equal((await state()).visibility,'visible');
      await page.keyboard.press('End');
      assert.equal(await root.locator('.splide__slide').last().getAttribute('aria-hidden'),null);
      assert.equal(await root.locator('.splide__slide.is-active .ambassadors-advantages__description').evaluate(e=>getComputedStyle(e).visibility),'visible');
      if(process.env.NO_IMAGES!=='1'){
        await root.locator('img').evaluateAll(images=>images.forEach(img=>img.loading='eager'));
        await page.waitForFunction(()=>[...document.querySelectorAll('#advantages img')].every(img=>img.complete&&img.naturalWidth>0));
      }
      const contents=await root.locator('.ambassadors-advantages__card').evaluateAll(cards=>cards.map(c=>{const r=c.getBoundingClientRect();const copy=c.querySelector('.ambassadors-advantages__card-copy');const d=c.querySelector('.ambassadors-advantages__description');const number=c.querySelector('.ambassadors-advantages__number');const title=c.querySelector('h3');const s=getComputedStyle(copy);return {image:c.querySelector('img').complete&&c.querySelector('img').naturalWidth>0,required:parseFloat(s.paddingTop)+parseFloat(s.paddingBottom)+number.getBoundingClientRect().height+parseFloat(getComputedStyle(number).marginBottom)+title.getBoundingClientRect().height+d.scrollHeight+16,available:r.height};}));
      if(process.env.NO_IMAGES!=='1')assert.ok(contents.every(c=>c.image),'All ten photos must load');
      assert.ok(contents.every(c=>c.required<=c.available),'Expanded content must fit every card');
      if(process.env.NO_IMAGES!=='1')await root.screenshot({path:path.join(__dirname,`advantages-reveal-${width}-last.png`)});
      results.push({width,mode:'focused-component',initial:'12% shading, hidden description',reveal:width>1024?'hover':'touch toggle',stableCardHeight:true,numbersAndTitlesAligned:true,artDeVivreLast:true,allTenDescriptionsFit:true,photosEnabled:process.env.NO_IMAGES!=='1',keyboard:'PASS'});
      fs.writeFileSync(path.join(__dirname,`advantages-reveal-${width}.json`),JSON.stringify(results.at(-1),null,2)+'\n');
      console.log('PASS reveal '+width);
    } finally {await browser.close();}
  }
  const combined=[390,1440].map(w=>path.join(__dirname,`advantages-reveal-${w}.json`)).filter(f=>fs.existsSync(f)).map(f=>JSON.parse(fs.readFileSync(f,'utf8')));
  fs.writeFileSync(path.join(__dirname,'advantages-reveal-checks.json'),JSON.stringify(combined,null,2)+'\n');
})().catch(e=>{console.error(e);process.exitCode=1;});
