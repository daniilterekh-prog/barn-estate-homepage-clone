const {chromium}=require('playwright');
const assert=require('assert/strict');
const fs=require('fs');
const path=require('path');
(async()=>{
 const results=[];
 for(const width of (process.env.WIDTHS ? process.env.WIDTHS.split(',').map(Number) : [320,375,390,540,768,1024,1280,1440,1920])){
  const browser=await chromium.launch({executablePath:'/home/daniil/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome',args:['--disable-dev-shm-usage']});
  const page=await browser.newPage({viewport:{width,height:1000}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  page.on('requestfailed',r=>{if(r.url().includes('/assets/directions/'))console.log('Image request failed',r.url(),r.failure());});
  await page.route('**/*',r=>{
    if(r.request().resourceType()!=='image') return r.continue();
    if(!r.request().url().includes('/assets/directions/')) return r.abort();
    const filename=path.basename(new URL(r.request().url()).pathname);
    return r.fulfill({status:200,contentType:'image/webp',body:fs.readFileSync(path.join(__dirname,'../assets/directions',filename))});
  });
  await page.goto('http://127.0.0.1:4183/for-partners/',{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.addStyleTag({content:'html{scroll-behavior:auto!important}.floating-expert{visibility:hidden!important}'});
  const measurements=[];
  for(let i=0;i<7;i++){
   if(width<=900) await page.locator('.bd-mobile-picker').selectOption(String(i));
   else await page.evaluate(i=>document.querySelector(`[data-pick="${i}"]`).click(),i);
   try { await page.waitForFunction(()=>{const img=document.querySelector('.bd-photo');return img.complete && img.naturalWidth>0;}); }
   catch(e){console.log({width,i,image:await page.locator('.bd-photo').evaluate(im=>({src:im.src,complete:im.complete,naturalWidth:im.naturalWidth})),active:await page.locator('.bd-navbtn[aria-selected="true"]').getAttribute('data-pick')});throw e;}
   await page.locator('.bd-photo').evaluate(img=>img.decode());
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   const actual=await page.evaluate(()=>{
    const copy=document.querySelector('.bd-copy'), children=[...copy.children];
    const rect=e=>{const r=e.getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right,height:r.height,width:r.width}};
    return {image:rect(document.querySelector('.bd-imagewrap')),copy:rect(copy),button:rect(document.querySelector('.bd-cta')),
     overlaps:children.slice(0,-1).some((e,i)=>rect(e).bottom>rect(children[i+1]).top),
     internalOverflow:children.some(e=>e.scrollHeight>e.clientHeight+1),
     overflow:document.documentElement.scrollWidth>innerWidth,
     details:document.querySelectorAll('.bd-details').length,
     font:getComputedStyle(copy.querySelector('h3')).fontFamily,
     buttonFont:getComputedStyle(document.querySelector('.bd-cta')).fontSize,
     source:document.querySelector('.bd-photo').getAttribute('src')};
   });
   assert.equal(actual.overlaps,false);assert.equal(actual.internalOverflow,false);assert.equal(actual.overflow,false);assert.equal(actual.details,0);
   assert.ok(actual.font.includes('Tilda Sans'));
   assert.equal(actual.button.height,width<=540?58:70);
   if(width>900) assert.ok(actual.image.width<actual.copy.width);
   measurements.push(actual);
   if(process.env.SCREENSHOTS==='1' && ((width===390&&(i===1||i===6))||(width===1440&&i===1))) await page.locator('#requests').screenshot({path:path.join(__dirname,`directions-redesign-${width}-${i}.png`)});
  }
  const first=measurements[0];
  for(const m of measurements){assert.ok(Math.abs(m.image.height-first.image.height)<1);assert.ok(Math.abs(m.button.top-first.button.top)<1);}
  const directionInForm=await page.evaluate(()=>{
    document.querySelector('.bd-cta').click();
    return document.querySelector('input[name="directionId"]')?.value;
  });
  assert.equal(directionInForm,'commercial');
  assert.deepEqual(errors,[]);
  results.push({width,measurements,errors});fs.writeFileSync(path.join(__dirname,`directions-check-${width}.json`),JSON.stringify(results.at(-1),null,2)+'\n');console.log('PASS width '+width);await browser.close();
 }
 const combined=[320,375,390,540,768,1024,1280,1440,1920].map(w=>path.join(__dirname,`directions-check-${w}.json`)).filter(p=>fs.existsSync(p)).map(p=>JSON.parse(fs.readFileSync(p,'utf8')));
 fs.writeFileSync(path.join(__dirname,'directions-redesign-checks.json'),JSON.stringify(combined,null,2)+'\n');
 console.log('PASS: 7 categories x 9 widths, images loaded, stable CTA/photo, no overlaps or overflow, selected direction passed to form');
})().catch(e=>{console.error(e);process.exit(1)});
