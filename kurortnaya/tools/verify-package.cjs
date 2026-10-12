/** Test a copied kurortnaya folder served as the document root. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH || '/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const root=path.resolve(__dirname,'..'),base=process.argv[2] || 'http://127.0.0.1:8785/';
const report={base,source:'self-contained kurortnaya',checks:[],errors:[],externalResources:[],missingResources:[]};
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome'});
 try{
  for(const width of [320,390,540,541,768,1440,1920,2560]){
   const page=await browser.newPage({viewport:{width,height:1000}});
   page.on('pageerror',e=>report.errors.push(e.message));
   page.on('request',r=>{if(/^https?:/.test(r.url())&&!r.url().startsWith(new URL(base).origin))report.externalResources.push(r.url())});
   page.on('response',r=>{if(r.status()>=400)report.missingResources.push(r.url()+' '+r.status())});
   await page.goto(base,{waitUntil:'networkidle'});
   await page.waitForSelector('[data-brand-context=listing]');
   await page.evaluate(()=>document.fonts.ready);
   const data=await page.evaluate(async()=>{
    const images=[...document.images];images.forEach(i=>i.loading='eager');await Promise.all(images.map(i=>Promise.race([i.decode().catch(()=>{}),new Promise(r=>setTimeout(r,5000))])));
    return {overflow:document.documentElement.scrollWidth>innerWidth+1,broken:images.filter(i=>!i.naturalWidth).map(i=>i.src),font:getComputedStyle(document.querySelector('.catalog-hero__title')).fontFamily};
   });
   assert.equal(data.overflow,false);assert.deepEqual(data.broken,[]);assert.ok(data.font.includes('Tilda Sans'));
   await page.locator('.catalog-projects-map__fullscreen').click();
   await page.locator('.map-browser').waitFor({state:'visible'});
   assert.equal(await page.locator('.map-browser__card').count(),32);
   await page.getByRole('searchbox',{name:'Поиск объектов на карте'}).fill('GRAND HOTEL');
   assert.equal(await page.locator('.map-browser__card').count(),1);
   await page.keyboard.press('Escape');
   await page.locator('.map-browser').waitFor({state:'hidden'});
   report.checks.push({entry:'index.html',width,...data});console.log('PASS page '+width);
   if([390,1440,2560].includes(width))await page.screenshot({path:'/tmp/kurort-clean-'+width+'.png',fullPage:true});
   await page.close();
  }
  const manifest=JSON.parse(fs.readFileSync(path.join(root,'blocks/manifest.json')));
  for(const block of manifest.blocks)for(const width of [390,1440]){
   const page=await browser.newPage({viewport:{width,height:1000}});
   page.on('pageerror',e=>report.errors.push(block.id+': '+e.message));
   page.on('request',r=>{if(/^https?:/.test(r.url())&&!r.url().startsWith(new URL(base).origin))report.externalResources.push(r.url())});
   page.on('response',r=>{if(r.status()>=400)report.missingResources.push(r.url()+' '+r.status())});
   const entry='blocks/'+block.id.replace('first-degree-','')+'/index.html';
   await page.goto(new URL(entry,base).href,{waitUntil:'networkidle'});
   await page.waitForSelector('[data-node-id]');
   await page.evaluate(()=>document.fonts.ready);
   const data=await page.evaluate(async()=>{const imgs=[...document.images];imgs.forEach(i=>i.loading='eager');await Promise.all(imgs.map(i=>Promise.race([i.decode().catch(()=>{}),new Promise(r=>setTimeout(r,5000))])));return {overflow:document.documentElement.scrollWidth>innerWidth+1,broken:imgs.filter(i=>!i.naturalWidth).map(i=>i.src)}});
   assert.equal(data.overflow,false,entry+' '+width);assert.deepEqual(data.broken,[],entry);
   report.checks.push({entry,width,...data});console.log('PASS '+entry+' '+width);await page.close();
  }
  assert.deepEqual([...new Set(report.errors)],[]);assert.deepEqual([...new Set(report.externalResources)],[]);assert.deepEqual([...new Set(report.missingResources)],[]);
  console.log('PASS '+report.checks.length+' self-contained viewport/preview checks, no remote resources, 404 or JS errors');
 }finally{await browser.close();fs.mkdirSync(path.join(root,'verification'),{recursive:true});fs.writeFileSync(path.join(root,'verification/package.json'),JSON.stringify(report,null,2)+'\n');}
})().catch(e=>{console.error(e);process.exitCode=1});
