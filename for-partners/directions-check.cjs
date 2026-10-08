const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
(async () => {
  const browser = await chromium.launch({headless:true, executablePath:process.env.CHROMIUM_PATH || '/usr/bin/google-chrome'});
  let page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const output = path.join(__dirname, 'directions-verification');
  fs.mkdirSync(output, {recursive:true});
  await page.setViewportSize({width:1440,height:1100});
  if(process.env.REFERENCE_URL) {
    await page.goto(process.env.REFERENCE_URL);
    await page.screenshot({path:path.join(output,'reference-desktop.png'),fullPage:true});
  }
  const results=[];
  for(const width of (process.env.WIDTHS ? process.env.WIDTHS.split(',').map(Number) : [320,360,390,430,768,1024,1280,1440,1920,740,742,744])) {
    await page.close();
    page = await browser.newPage();
    await page.route('**/*', route => {
      const req=route.request();
      if(req.resourceType()==='image' && !req.url().includes('/assets/directions/')) return route.abort();
      return route.continue();
    });
    page.on('pageerror', e => errors.push(e.message));
    await page.setViewportSize({width,height:1100});
    await page.goto((process.env.BASE_URL || 'http://127.0.0.1:4181') + '/for-partners/');
    await page.addStyleTag({content:'html{scroll-behavior:auto!important}'});
    await page.locator('.floating-expert__close').click();
    await page.evaluate(()=>document.fonts.ready);
    await page.locator('#requests').scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const mobile=await page.locator('.bd-mobile-picker').isVisible();
    let initial;
    for(let i=0;i<7;i++) {
      if(mobile) await page.locator('.bd-mobile-picker').selectOption(String(i));
      else await page.locator('.bd-navbtn').nth(i).click();
      await page.locator('.bd-photo').evaluate(async img=>{await img.decode();});
      const metrics=await page.evaluate(()=>{
        const sels=['#requests','.bd-imagewrap','.bd-copy','.bd-copy>h3','.bd-price','.bd-metrics,.bd-textfacts','.bd-commission','.bd-cta'];
        const boxes=sels.map(s=>{const r=document.querySelector(s).getBoundingClientRect();return [r.top+scrollY,r.height,r.width]});
        const overflows=[...document.querySelectorAll('.bd-copy>h3,.bd-intro,.bd-price,.bd-label,.bd-facttext')].filter(e=>e.scrollWidth>e.clientWidth+2||e.scrollHeight>e.clientHeight+2).map(e=>e.textContent);
        const children=[...document.querySelector('.bd-copy').children];
        const overlaps=children.slice(0,-1).filter((e,i)=>e.getBoundingClientRect().bottom>children[i+1].getBoundingClientRect().top+1).map(e=>e.className);
        document.querySelectorAll('.bd-details dl>div').forEach(e=>{const last=e.lastElementChild;if(last.getBoundingClientRect().bottom>e.getBoundingClientRect().bottom+1)overlaps.push('details:'+e.textContent);});
        return {boxes,overflows,overlaps,overflow:document.documentElement.scrollWidth>innerWidth+1,container:document.querySelector('.bd-window').clientWidth};
      });
      if(!initial) initial=metrics.boxes;
      const delta=Math.max(...metrics.boxes.flatMap((b,j)=>b.slice(0,2).map((v,k)=>Math.abs(v-initial[j][k]))));
      if(delta>1||metrics.overflow||metrics.overflows.length||metrics.overlaps.length) errors.push(JSON.stringify({width,i,delta,...metrics}));
      await page.locator('.bd-cta').evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));
      await page.locator('.bd-cta').click();
      const id=await page.locator('input[name=directionId]').inputValue();
      const name=await page.locator('input[name=directionName]').inputValue();
      if(id!==await page.locator('.bd-navbtn').nth(i).getAttribute('id').then(x=>x.replace('direction-tab-','')))errors.push('direction mismatch');
      await page.locator('.feedback-modal__close').click();
      if((width===1440&&[0,2,4].includes(i))||(width===390&&[0,4,5].includes(i))) {
        const cleanShot=await page.addStyleTag({content:'.floating-expert{visibility:hidden!important}'});
        await page.locator('#requests').screenshot({path:path.join(output,`${width}-${id}.png`)});
        await cleanShot.evaluate(e=>e.remove());
      }
      results.push({width,i,id,name,delta,container:metrics.container,photoHeight:metrics.boxes[1][1],copyHeight:metrics.boxes[2][1]});
    }
    console.log('Checked width',width);
    fs.writeFileSync(path.join(output,process.env.REPORT_FILE || 'results.json'),JSON.stringify({errors,results},null,2));
  }
  fs.writeFileSync(path.join(output,process.env.REPORT_FILE || 'results.json'),JSON.stringify({errors,results},null,2));
  console.log(JSON.stringify({errors,cases:results.length,output},null,2));
  await browser.close();
  if(errors.length)process.exitCode=1;
})();
