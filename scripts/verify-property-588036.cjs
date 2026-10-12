/* Whole-page comparison using the same Chrome viewport, loaded fonts and decoded images. */
const fs=require('node:fs/promises'),path=require('node:path');
const toolkit=process.env.WEB_CAPTURE_TOOLKIT||'/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit';
const {chromium}=require(path.join(toolkit,'node_modules/playwright'));
const {PNG}=require(path.join(process.env.CODEX_TOOLKIT_ROOT||path.join(require('node:os').homedir(),'.local/share/codex-toolkit'),'node_modules/pngjs'));
const capture=process.argv[2]||'/tmp/barnes-588036';
const root=path.resolve(__dirname,'../vtorichnaya-nedvizhimost/588036');
const widths=process.argv.slice(3).map(Number);
const stable='*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}.floating-expert{opacity:1!important;transform:none!important}';
(async()=>{
  if(!widths.length)widths.push(...(await fs.readdir(capture)).filter(n=>/^matrix-\d+\.json$/.test(n)).map(n=>Number(n.match(/\d+/)[0])).sort((a,b)=>a-b));
  const pixelmatch=(await import(path.join(toolkit,'node_modules/pixelmatch/index.js'))).default;
  const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
  const page=await b.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
  let errors=[];page.on('pageerror',e=>errors.push(e.message));const results=[];
  for(const width of widths){
    const ref=JSON.parse(await fs.readFile(path.join(capture,`matrix-${width}.json`),'utf8'));
    await page.setViewportSize({width,height:900});await page.goto('file://'+root+'/index.html',{waitUntil:'load'});
    await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))});
    await page.addStyleTag({content:stable});await page.waitForTimeout(150);
    const local=await page.evaluate(()=>{const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}};return {height:document.documentElement.scrollHeight,overflow:document.documentElement.scrollWidth>innerWidth,sections:[...document.querySelectorAll('main section,.site-footer,.breadcrumbs')].map(e=>({selector:'.'+e.classList[0],...rect(e)})),text:[...document.querySelectorAll('h1,h2,h3,.lot-hero__price,.reviews-section__text,.lot-about-complex__text')].map(e=>{const s=getComputedStyle(e);return {cls:e.className,text:e.textContent.trim(),...rect(e),font:s.fontFamily,size:s.fontSize,weight:s.fontWeight,line:s.lineHeight,spacing:s.letterSpacing,margin:s.margin,padding:s.padding}}),brokenImages:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.getAttribute('src'))}});
    const shot=await page.screenshot({path:path.join(capture,`local-${width}.png`),fullPage:true});
    const a=PNG.sync.read(await fs.readFile(path.join(capture,`reference-${width}.png`))),c=PNG.sync.read(shot);
    let pixels=null;
    if(a.width===c.width&&a.height===c.height){const diff=new PNG({width:a.width,height:a.height});const changed=pixelmatch(a.data,c.data,diff.data,a.width,a.height,{threshold:0,includeAA:true});await fs.writeFile(path.join(capture,`diff-${width}.png`),PNG.sync.write(diff));pixels={changed,total:a.width*a.height,percent:changed/(a.width*a.height)*100}}
    const geometry=ref.sections.flatMap((r,i)=>['x','y','w','h'].filter(k=>r[k]!==local.sections[i]?.[k]).map(k=>({selector:r.selector,property:k,source:r[k],local:local.sections[i]?.[k]})));
    const typography=ref.text.flatMap((r,i)=>['text','x','y','w','h','font','size','weight','line','spacing','margin','padding'].filter(k=>r[k]!==local.text[i]?.[k]).map(k=>({cls:r.cls,property:k,source:r[k],local:local.text[i]?.[k]})));
    const result={width,sourceHeight:ref.height,localHeight:local.height,pixels,geometry,typography,overflow:local.overflow,brokenImages:local.brokenImages};results.push(result);console.log(JSON.stringify({...result,geometry:geometry.length,typography:typography.length}));
  }
  await b.close();const report={source:'https://front.barnes.vsavr.ru/vtorichnaya-nedvizhimost/588036/',checkedAt:new Date().toISOString(),settings:{browser:'Google Chrome',height:900,deviceScaleFactor:1,fonts:'document.fonts.ready',images:'decoded',animations:'disabled',pixelmatch:{version:'8.0.0',threshold:0,includeAA:true}},errors,results};await fs.writeFile(path.join(root,'verification.json'),JSON.stringify(report,null,2)+'\n');
  if(errors.length||results.some(r=>!r.pixels||r.pixels.changed||r.geometry.length||r.typography.length||r.overflow||r.brokenImages.length))process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
