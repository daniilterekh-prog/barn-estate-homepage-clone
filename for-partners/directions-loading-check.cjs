const {chromium}=require('playwright');
(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome'});
  const results=[];
  for(const width of [390,1280]) {
    const page=await browser.newPage({viewport:{width,height:1100}});
    let release;
    const ready=new Promise(r=>release=r);
    await page.route('**/*',async route=>{
      const r=route.request(),url=r.url();
      if(r.resourceType()==='font'||url.includes('/assets/directions/')&&r.resourceType()==='image')await ready;
      if(r.resourceType()==='image'&&!url.includes('/assets/directions/'))return route.abort();
      await route.continue();
    });
    await page.goto('http://127.0.0.1:4181/for-partners/',{waitUntil:'domcontentloaded'});
    const geometry=()=>[...document.querySelectorAll('.bd-imagewrap,.bd-copy,.bd-price,.bd-metrics,.bd-commission,.bd-cta')].map(e=>{const r=e.getBoundingClientRect(),f=document.querySelector('.bd-feature').getBoundingClientRect();return [r.top-f.top,r.height,r.width]});
    const before=await page.evaluate(geometry);
    release();
    await page.evaluate(()=>document.fonts.ready);
    await page.locator('.bd-photo').evaluate(img=>img.decode());
    const after=await page.evaluate(geometry);
    const delta=Math.max(...before.flatMap((b,j)=>b.map((v,k)=>Math.abs(v-after[j][k]))));
    if(delta>1)throw new Error('Loading layout shift '+width+': '+delta);
    if(width===1280){
      await page.locator('.bd-navbtn').first().focus();
      await page.keyboard.press('End');
      if(await page.locator('.bd-navbtn').last().getAttribute('aria-selected')!=='true')throw new Error('Keyboard selection');
      await page.keyboard.press('Home');
      if(await page.locator('.bd-navbtn').first().getAttribute('aria-selected')!=='true')throw new Error('Keyboard Home');
    }
    results.push({width,loadingDelta:delta});
    await page.close();
  }
  console.log(JSON.stringify(results));
  await browser.close();
})();
