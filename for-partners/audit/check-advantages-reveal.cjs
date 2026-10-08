const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const assert=require('assert/strict');
(async()=>{
  const results=[];
  for(const width of (process.env.WIDTHS||'390,1440').split(',').map(Number)){
    const browser=await chromium.launch({executablePath:'/home/daniil/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome',args:['--disable-dev-shm-usage']});
    try {
      const page=await browser.newPage({viewport:{width,height:1000},hasTouch:width===390,isMobile:width===390,reducedMotion:'reduce'});
      await page.route('**/*',r=>{
        if(r.request().resourceType()==='image'&&(process.env.NO_IMAGES==='1'||!/media-(13|01|09)\.png/.test(r.request().url())))return r.abort();
        if(r.request().resourceType()!=='document')return r.continue();
        const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
        const start=html.indexOf('<section id="advantages"');
        const section=html.slice(start,html.indexOf('</section>',start)+10);
        return r.fulfill({contentType:'text/html',body:html.slice(0,html.indexOf('</head>')+7)+'<body><main class="ambassadors-page"><div id="barnes-directions"></div>'+section+'</main><link rel="stylesheet" href="assets/advantages-enhanced.css"><script src="for-partners.js"></script></body></html>'});
      });
      await page.goto('http://127.0.0.1:4183/for-partners/',{waitUntil:'networkidle'});
      const root=page.locator('#advantages');
      const card=root.locator('.ambassadors-advantages__card').first();
      const state=()=>card.evaluate(e=>({opacity:getComputedStyle(e.querySelector('.ambassadors-advantages__overlay')).opacity,visibility:getComputedStyle(e.querySelector('.ambassadors-advantages__description')).visibility,height:e.getBoundingClientRect().height}));
      assert.equal(await root.locator('.ambassadors-advantages__card').count(),10);
      const before=await state();assert.equal(before.opacity,'0');assert.equal(before.visibility,'hidden');
      if(process.env.NO_IMAGES!=='1')await root.screenshot({path:path.join(__dirname,`advantages-reveal-${width}-closed.png`)});
      if(width===1440)await card.hover();
      else await card.locator('button').tap();
      const open=await state();assert.equal(open.opacity,'1');assert.equal(open.visibility,'visible');assert.equal(open.height,before.height);
      if(process.env.NO_IMAGES!=='1')await root.screenshot({path:path.join(__dirname,`advantages-reveal-${width}-open.png`)});
      if(width===1440)await page.mouse.move(0,0);
      else await card.locator('button').tap();
      assert.equal((await state()).opacity,'0');assert.equal((await state()).visibility,'hidden');
      await root.locator('.splide__track').focus();
      await page.keyboard.press('Home');
      assert.equal((await state()).visibility,'visible');
      await page.keyboard.press('End');
      assert.equal(await root.locator('.splide__slide').last().getAttribute('aria-hidden'),null);
      assert.equal(await root.locator('.splide__slide.is-active .ambassadors-advantages__description').evaluate(e=>getComputedStyle(e).visibility),'visible');
      results.push({width,mode:'focused-component',initial:'clear image, hidden description',reveal:width===1440?'hover':'touch toggle',stableCardHeight:true,keyboard:'PASS'});
      fs.writeFileSync(path.join(__dirname,`advantages-reveal-${width}.json`),JSON.stringify(results.at(-1),null,2)+'\n');
      console.log('PASS reveal '+width);
    } finally {await browser.close();}
  }
  const combined=[390,1440].map(w=>path.join(__dirname,`advantages-reveal-${w}.json`)).filter(f=>fs.existsSync(f)).map(f=>JSON.parse(fs.readFileSync(f,'utf8')));
  fs.writeFileSync(path.join(__dirname,'advantages-reveal-checks.json'),JSON.stringify(combined,null,2)+'\n');
})().catch(e=>{console.error(e);process.exitCode=1;});
