const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/home/daniil/.local/share/codex-toolkit/node_modules/playwright');
const sharp=require(process.env.SHARP_MODULE||'/home/daniil/.local/share/codex-toolkit/node_modules/sharp');
const root=path.resolve(__dirname,'..');fs.mkdirSync(path.join(root,'design'),{recursive:true});
const source=process.env.SOURCE_URL||'http://127.0.0.1:18784/',target=process.env.PACKAGE_URL||'http://127.0.0.1:18785/html/index.html';
async function capture(browser,url,width){
 const p=await browser.newPage({viewport:{width,height:1080},deviceScaleFactor:1,reducedMotion:'reduce'});
 try{
  await p.goto(url,{waitUntil:'networkidle'});
  await p.evaluate(async()=>{for(const i of document.images)i.loading='eager';await Promise.all([...document.images].map(i=>i.decode()));await document.fonts.ready;scrollTo(0,0)});
  await p.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'});
  const geometry=await p.locator('.owner-sale-page').evaluate(e=>[...e.children].map(n=>{const r=n.getBoundingClientRect();return{class:n.className,id:n.id,width:r.width,height:r.height,padding:getComputedStyle(n).padding}}));
  return {buffer:await p.screenshot({fullPage:true,animations:'disabled'}),geometry};
 }finally{await p.close()}
}
(async()=>{const b=await chromium.launch(),report=[];try{for(const width of[390,1440]){
 const a=await capture(b,source,width),c=await capture(b,target,width);assert.deepEqual(c.geometry,a.geometry,'Section geometry '+width);
 const x=await sharp(a.buffer).ensureAlpha().raw().toBuffer({resolveWithObject:true}),y=await sharp(c.buffer).ensureAlpha().raw().toBuffer({resolveWithObject:true});assert.equal(x.info.width,y.info.width);assert.equal(x.info.height,y.info.height);
 let pixels=0;for(let i=0;i<x.data.length;i+=4)if(x.data[i]!==y.data[i]||x.data[i+1]!==y.data[i+1]||x.data[i+2]!==y.data[i+2]||x.data[i+3]!==y.data[i+3])pixels++;
 const ratio=pixels/(x.info.width*x.info.height);fs.writeFileSync(path.join(root,'verification',`parity-${width}.json`),JSON.stringify({width,height:x.info.height,differentPixels:pixels,ratio,geometry:c.geometry},null,2)+'\n');
 if(pixels){fs.writeFileSync(path.join(root,'verification',`source-${width}.png`),a.buffer);fs.writeFileSync(path.join(root,'verification',`package-${width}.png`),c.buffer)}
 assert.equal(pixels,0,'Strict full-page pixel comparison '+width);
 await sharp(c.buffer).webp({quality:86}).toFile(path.join(root,'design',`page-${width}.webp`));report.push({width,height:x.info.height,differentPixels:pixels,ratio,geometry:c.geometry});console.log('parity',width,pixels)
 }fs.writeFileSync(path.join(root,'VERIFICATION.json'),JSON.stringify({date:'2026-11-27',sourceUrl:source,packageUrl:target,parity:report,flows:JSON.parse(fs.readFileSync(path.join(root,'verification/report.json')))},null,2)+'\n')}finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
