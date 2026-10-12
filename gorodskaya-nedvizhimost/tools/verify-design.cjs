/** Compare settled geometry to a chosen published reference; lazy media are decoded first. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const root=path.resolve(__dirname,'..');
const local=process.argv[2]||'http://127.0.0.1:4187/',reference=process.argv[3]||'https://daniilterekh-prog.github.io/barn-estate-homepage-clone/gorodskaya-nedvizhimost/';
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome'}),report=[];
 try{
  for(const width of[320,390,540,541,768,1024,1440,1920,2560]){
   const snapshots=[];
   for(const url of[reference,local]){
    const page=await browser.newPage({viewport:{width,height:900}});
    await page.goto(url);await page.waitForSelector('.city-reference-synced',{state:'attached'});
    await page.evaluate(async()=>{await document.fonts.ready;const images=[...document.images];images.forEach(i=>i.loading='eager');await Promise.all(images.map(i=>i.decode().catch(()=>{})));});
    const data=await page.evaluate(()=>Object.fromEntries(['.catalog-hero','.catalog-hero__title','.catalog-best-offers','.catalog-grid','.catalog-mode-toolbar','.catalog-intro','.catalog-consultation','.catalog-contact','.site-footer'].map(selector=>{
     const e=document.querySelector(selector),r=e.getBoundingClientRect(),s=getComputedStyle(e);
     return[selector,{width:r.width,height:r.height,top:r.y+scrollY,font:s.fontSize,line:s.lineHeight,weight:s.fontWeight}];
    })));
    snapshots.push(data);await page.close();
   }
   const differences=[];
   for(const selector of Object.keys(snapshots[0]))for(const key of Object.keys(snapshots[0][selector])){
    const a=snapshots[0][selector][key],b=snapshots[1][selector][key];
    if(typeof a==='number'?Math.abs(a-b)>1:a!==b)differences.push({selector,key,before:a,after:b});
   }
   report.push({width,reference,local,differences,referenceGeometry:snapshots[0],packagedGeometry:snapshots[1]});
   assert.deepEqual(differences,[]);console.log('PASS settled design geometry',width);
  }
 }finally{await browser.close();fs.writeFileSync(path.join(root,'verification/design-parity.json'),JSON.stringify(report,null,2)+'\n')}
})().catch(e=>{console.error(e);process.exitCode=1});
