const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/home/daniil/.local/share/codex-toolkit/node_modules/playwright');
const sharp=require(process.env.SHARP_MODULE||'/home/daniil/.local/share/codex-toolkit/node_modules/sharp');
const root=path.resolve(__dirname,'..'),out=path.join(root,'verification','parity'),urls=[process.env.REFERENCE_URL,process.env.CHECK_URL];
if(urls.some(u=>!u))throw Error('Set REFERENCE_URL and CHECK_URL');
(async()=>{fs.mkdirSync(out,{recursive:true});const b=await chromium.launch(),results=[];
for(const width of [390,1440]){
 const captures=[];
 for(let i=0;i<2;i++){
  const p=await b.newPage({viewport:{width,height:900}});if(i===0)await p.route('http://127.0.0.1:8826/**',async r=>{const u=new URL(r.request().url());u.port=new URL(urls[0]).port;return r.fulfill({response:await r.fetch({url:u.href})});});
  await p.goto(urls[i],{waitUntil:'networkidle'});await p.waitForFunction(()=>document.querySelector('#__nuxt')?.__vue_app__?.config.globalProperties.$nuxt?.isHydrating===false);await p.waitForTimeout(700);await p.locator('.floating-expert__close').click().catch(()=>{});
  await p.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'});
  const states=[];
  for(const [name,selector]of [['hero','.home-hero'],['directions','.departments-section'],['featured','.project-hero']]){
   const e=p.locator(selector);await e.scrollIntoViewIfNeeded();await p.waitForTimeout(300);const file=path.join(out,`${width}-${name}-${i?'package':'source'}.png`);await e.screenshot({path:file,animations:'disabled'});states.push({name,file,geometry:await e.evaluate(e=>({w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height,text:e.textContent.trim().replace(/\s+/g,' ')}))});
  }
  captures.push(states);await p.close();
 }
 for(let j=0;j<captures[0].length;j++){
  const a=captures[0][j],c=captures[1][j];assert.deepEqual(a.geometry,c.geometry,`${width} ${a.name} structure`);
  const x=await sharp(a.file).ensureAlpha().raw().toBuffer({resolveWithObject:true}),y=await sharp(c.file).ensureAlpha().raw().toBuffer({resolveWithObject:true});assert.deepEqual(x.info,y.info);let different=0,max=0,sum=0;for(let k=0;k<x.data.length;k+=4){const d=Math.max(...[0,1,2].map(n=>Math.abs(x.data[k+n]-y.data[k+n])));if(d>8)different++;max=Math.max(max,d);sum+=d;}
  results.push({width,section:a.name,geometry:a.geometry,differentPixelsAbove8:different,ratio:different/(x.info.width*x.info.height),meanMaxChannelDelta:sum/(x.info.width*x.info.height),maximumChannelDelta:max});
 }
}
await b.close();fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({date:'2026-11-10',urls,results},null,2)+'\n');console.log(JSON.stringify(results.map(({geometry,...r})=>r)));assert(results.every(r=>r.ratio<0.01),'Visual difference above 1% needs review');
})().catch(e=>{console.error(e);process.exit(1)});
