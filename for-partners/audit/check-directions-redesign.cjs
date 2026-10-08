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
    const url=new URL(r.request().url());
    if(r.request().resourceType()==='image'&&!url.pathname.includes('/assets/directions/'))return r.abort();
    if(url.hostname!=='127.0.0.1')return r.continue();
    let filename=path.resolve(__dirname,'../..','.'+decodeURIComponent(url.pathname));
    if(url.pathname.endsWith('/'))filename=path.join(filename,'index.html');
    if(!fs.existsSync(filename))return r.continue();
    if(process.env.FOCUSED==='1' && filename.endsWith('/for-partners/index.html')) {
      const html=fs.readFileSync(filename,'utf8');
      const start=html.indexOf('<section id="requests"');
      const section=html.slice(start,html.indexOf('</section>',start)+10);
      const head=html.slice(0,html.indexOf('</head>')+7);
      return r.fulfill({status:200,contentType:'text/html',body:head+'<body>'+section+'<link rel="stylesheet" href="assets/directions/directions.css"><script defer src="assets/directions/directions-data.js"></script><script defer src="assets/directions/directions.js"></script></body></html>'});
    }
    const type={'.html':'text/html','.css':'text/css','.js':'application/javascript','.woff2':'font/woff2','.webp':'image/webp'}[path.extname(filename)]||'application/octet-stream';
    return r.fulfill({status:200,contentType:type,body:fs.readFileSync(filename)});
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
   const actual=await page.evaluate(()=>{
    const copy=document.querySelector('.bd-copy'), children=[...copy.children];
    const rect=e=>{const r=e.getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right,height:r.height,width:r.width}};
    return {image:rect(document.querySelector('.bd-imagewrap')),copy:rect(copy),button:rect(document.querySelector('.bd-cta')),rows:children.map(e=>rect(e).height),
     overlaps:children.slice(0,-1).some((e,i)=>rect(e).bottom>rect(children[i+1]).top),
     internalOverflow:children.some(e=>e.scrollHeight>e.clientHeight+1),
     overflow:document.documentElement.scrollWidth>innerWidth,
     details:document.querySelectorAll('.bd-details').length,
     font:getComputedStyle(copy.querySelector('h3')).fontFamily,
     typography:Object.fromEntries(['h2','.bd-eyebrow','.bd-heading h3','.bd-intro','.bd-label','.bd-price-label','.bd-price','.bd-price small','.bd-num','.bd-facttext','.bd-commission strong','.bd-commission-note','.bd-image-caption','.bd-navbtn','.bd-mobile-picker','.bd-cta'].map(selector=>{
       const e=document.querySelector('#barnes-directions '+selector);if(!e)return [selector,null];const s=getComputedStyle(e);return [selector,{size:parseFloat(s.fontSize),line:parseFloat(s.lineHeight),weight:s.fontWeight}];
     })),
     buttonFont:getComputedStyle(document.querySelector('.bd-cta')).fontSize,
     source:document.querySelector('.bd-photo').getAttribute('src')};
   });
   assert.equal(actual.overlaps,false);assert.equal(actual.internalOverflow,false);assert.equal(actual.overflow,false);assert.equal(actual.details,0);
   assert.ok(actual.font.includes('Tilda Sans'));
   assert.equal(await page.locator('.bd-eyebrow').evaluate(e=>getComputedStyle(e).textAlign),'left');
   const t=actual.typography;
   assert.equal(t['h2'].size,width<=1024?22:width>=1441?44:38);
   assert.equal(t['.bd-heading h3'].size,width<=1024?20:24);
   assert.equal(t['.bd-heading h3'].weight,'400');
   assert.equal(t['.bd-intro'].size,width<=1024?16:22);
   assert.equal(t['.bd-intro'].weight,'300');
   assert.equal(t['.bd-label'].size,width<=1024?18:20);
   assert.equal(t['.bd-price-label'].size,width<=1024?18:20);
   assert.equal(t['.bd-cta'].size,width<=540?18:width>=1441?19:17);
   assert.equal(t['.bd-cta'].weight,'400');
   const expectRole=(selector,size,line,weight)=>{
     if(!t[selector])return;
     assert.equal(t[selector].size,size,selector+' size');
     assert.equal(t[selector].line,line,selector+' line');
     if(weight)assert.equal(t[selector].weight,weight,selector+' weight');
   };
   expectRole('h2',width<=1024?22:width>=1441?44:38,width<=1024?26.4:width>=1441?52.8:45.6,'300');
   expectRole('.bd-eyebrow',width<=1024?12:14,width<=1024?14.4:16.1,'400');
   expectRole('.bd-heading h3',width<=1024?20:24,width<=1024?24:28.8,'400');
   expectRole('.bd-intro',width<=1024?16:22,width<=1024?22.4:28.16,'300');
   expectRole('.bd-label',width<=1024?18:20,width<=1024?25.2:28,'400');
   expectRole('.bd-price-label',width<=1024?18:20,width<=1024?25.2:28,'400');
   expectRole('.bd-price',i===5?22:38,i===5?30.8:45.6,i===5?'400':'300');
   expectRole('.bd-price small',20,28,'400');
   expectRole('.bd-num',width<=540?32:38,width<=540?38.4:45.6,'300');
   expectRole('.bd-facttext',width<=1024?18:20,width<=1024?25.2:28,'400');
   expectRole('.bd-commission strong',i>=5?22:48,i>=5?30.8:52.8,'400');
   expectRole('.bd-commission-note',width<=1024?18:20,width<=1024?25.2:28,'400');
   expectRole('.bd-image-caption',13,18);
   expectRole('.bd-navbtn',17,23.8,'400');
   expectRole('.bd-mobile-picker',18,24,'400');
   expectRole('.bd-cta',width<=540?18:width>=1441?19:17,width<=540?19.8:width>=1441?20.9:18.7,'400');
   assert.equal(actual.button.height,width<=540?58:70);
   if(width>900) {
     assert.ok(actual.image.width<actual.copy.width);
     assert.ok(Math.abs(actual.image.bottom-actual.button.bottom)<1,'Photo and CTA bottoms must align');
   } else assert.equal(actual.image.height,width<=540?290:320);
   measurements.push(actual);
   if(process.env.SCREENSHOTS==='1' && ((width===390&&(i===1||i===6))||(width===1440&&i===1))) {
     await page.locator('.bd-photo').evaluate(img=>img.decode());
     await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
     await page.locator('#requests').screenshot({path:path.join(__dirname,`directions-redesign-${width}-${i}.png`)});
   }
  }
  const first=measurements[0];
  for(const m of measurements){assert.ok(Math.abs(m.image.height-first.image.height)<1);assert.ok(Math.abs(m.button.top-first.button.top)<1,JSON.stringify(measurements.map(v=>({rows:v.rows,top:v.button.top}))));}
  const directionInForm=process.env.FOCUSED==='1' ? 'focused-component-only' : await page.evaluate(()=>{
    document.querySelector('.bd-cta').click();
    return document.querySelector('input[name="directionId"]')?.value;
  });
  if(process.env.FOCUSED!=='1') assert.equal(directionInForm,'commercial');
  assert.deepEqual(errors,[]);
  results.push({width,measurements,errors,mode:process.env.FOCUSED==='1'?'focused-component':'full-page'});fs.writeFileSync(path.join(__dirname,`directions-check-${width}.json`),JSON.stringify(results.at(-1),null,2)+'\n');console.log('PASS width '+width);await browser.close();
 }
 const combined=[320,375,390,540,768,1024,1280,1440,1920].map(w=>path.join(__dirname,`directions-check-${w}.json`)).filter(p=>fs.existsSync(p)).map(p=>JSON.parse(fs.readFileSync(p,'utf8')));
 fs.writeFileSync(path.join(__dirname,'directions-redesign-checks.json'),JSON.stringify(combined,null,2)+'\n');
 console.log('PASS: 7 categories x '+results.length+' requested width(s), all typography roles, images loaded, stable CTA/photo, no overlaps or overflow; '+(process.env.FOCUSED==='1'?'focused component, form not tested':'selected direction passed to form'));
})().catch(e=>{console.error(e);process.exit(1)});
