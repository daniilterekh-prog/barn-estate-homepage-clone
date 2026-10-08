const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const assert=require('assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'/home/daniil/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome',args:['--disable-dev-shm-usage','--disable-gpu']});
 try {
  const page=await browser.newPage();
  const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
  const start=html.indexOf('<section id="conditions"');
  const section=html.slice(start,html.indexOf('</section>',start)+10);
  const head=html.slice(0,html.indexOf('</head>')+7).replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'');
  await page.route('**/*',r=>r.request().resourceType()==='document'?r.fulfill({contentType:'text/html',body:head+'<body class="partners-owner-shell"><main class="ambassadors-page">'+section+'</main></body></html>'}):r.continue());
  const results=[];
  for(const width of [390,1440]){
   await page.setViewportSize({width,height:1000});
   await page.goto('http://127.0.0.1:4183/for-partners/',{waitUntil:'networkidle',timeout:15000});
   await page.locator('#conditions img').evaluateAll(images=>images.forEach(i=>i.loading='eager'));
   await page.waitForFunction(()=>[...document.querySelectorAll('#conditions img')].every(i=>i.complete&&i.naturalWidth===800),{},{timeout:15000});
   const imgs=await page.locator('#conditions img').evaluateAll(images=>images.map(i=>({src:i.getAttribute('src'),naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight,width:i.getBoundingClientRect().width,height:i.getBoundingClientRect().height,fit:getComputedStyle(i).objectFit})));
   assert.equal(imgs.length,3);assert.equal(new Set(imgs.map(i=>i.src)).size,3);assert.ok(imgs.every(i=>i.width>0&&i.height>0&&i.naturalHeight===800));
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await page.locator('#conditions').screenshot({path:path.join(__dirname,`conditions-images-${width}.png`)});
   results.push({viewport:width,status:'PASS',images:imgs});console.log('PASS conditions '+width);
  }
  fs.writeFileSync(path.join(__dirname,'conditions-images-checks.json'),JSON.stringify(results,null,2)+'\n');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
