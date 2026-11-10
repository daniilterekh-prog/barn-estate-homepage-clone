/* Compare the source page with the standalone developer package. No real email is sent. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const toolkit=process.env.CODEX_TOOLKIT_DIR||'/home/daniil/.local/share/codex-toolkit';
const {chromium}=require(path.join(toolkit,'node_modules/playwright'));
const source=process.argv[2]||'http://127.0.0.1:4381/main-site/pages/barn-club/';
const target=process.argv[3]||'http://127.0.0.1:4381/main-site/handoff/barn-club/html/';
const out=process.env.HANDOFF_OUTPUT||path.join(__dirname,'../verification');fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch({headless:true});try{
 const pages=[],errors=[],rows=[];
 for(const url of [source,target]){let p=await browser.newPage();p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});await p.goto(url);await p.evaluate(async()=>{document.querySelectorAll('img').forEach(i=>i.loading='eager');await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()))});pages.push(p)}
 for(const width of [320,360,375,390,414,540,541,600,767,768,769,820,1024,1025,1100,1280,1366,1440,1441,1536,1728,1919,1920,1921,2048,2560,3840]){
  const pair=[];
  for(const p of pages){await p.setViewportSize({width,height:900});await p.evaluate(()=>scrollTo(0,0));pair.push(await p.evaluate(()=>{
   const round=n=>Math.round(n*100)/100;
   const selectors=['.club-hero','.club-hero__inner','h1',...Array.from({length:document.querySelectorAll('h2').length},(_,i)=>`h2:nth-of-type(${i+1})`),'#about','.about-illustration img','#guests','#spaces','#events','#inquiry','.inquiry__visual','.inquiry__form','.site-footer'];
   const elements=[...new Set([...selectors.flatMap(s=>[...document.querySelectorAll(s)]),...document.querySelectorAll('h2')])];
   return {text:document.body.innerText,overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(i=>!i.naturalWidth).length,headings:[...document.querySelectorAll('h2')].map(e=>getComputedStyle(e).textTransform),geometry:elements.map(e=>{let r=e.getBoundingClientRect(),c=getComputedStyle(e);return {tag:e.tagName,class:e.className,x:round(r.x),y:round(r.y),width:round(r.width),height:round(r.height),font:c.fontSize,line:c.lineHeight,weight:c.fontWeight,transform:c.textTransform}})}
  }))}
  assert.deepEqual(pair[1],pair[0],`Source/package mismatch at ${width}`);assert.equal(pair[1].overflow,false);assert.equal(pair[1].broken,0);assert.ok(pair[1].headings.every(t=>t==='uppercase'));rows.push({width,parity:true,overflow:false,h2:pair[1].headings.length});
 }
 const screenshots=[];
 for(const width of [390,1440]){for(const p of pages)await p.setViewportSize({width,height:900});for(const section of ['about','inquiry']){const buffers=[];for(const p of pages){await p.locator('#'+section).scrollIntoViewIfNeeded();await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));buffers.push(await p.screenshot({type:'png'}))}assert.ok(buffers[0].equals(buffers[1]),`Screenshot differs ${width}/${section}`);fs.writeFileSync(path.join(out,`${width}-${section}.png`),buffers[1]);screenshots.push({width,section,byteIdentical:true})}}
 assert.deepEqual(errors,[]);const report={date:'2026-11-10',browser:'Chromium',source,target,widths:rows,screenshots,errors};fs.writeFileSync(path.join(out,'parity.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({widths:rows.length,pixelIdenticalScreenshots:screenshots.length,errors}));
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
