/* Compare the source filter panel, not the page behind the user-added entries. */
const fs=require('node:fs/promises');
const path=require('node:path');
const assert=require('node:assert/strict');
const toolkit=process.env.WEB_CAPTURE_TOOLKIT||'/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit';
const modules=process.env.CODEX_TOOLKIT_ROOT||'/home/daniil/.local/share/codex-toolkit';
const {chromium}=require(path.join(toolkit,'node_modules/playwright'));
const {PNG}=require(path.join(modules,'node_modules/pngjs'));
const source='https://front.barnes.vsavr.ru/kommercheskaya-nedvizhimost/';
const local='file://'+path.resolve(__dirname,'../kommercheskaya-nedvizhimost/index.html');

(async()=>{
  const pixelmatch=(await import(path.join(toolkit,'node_modules/pixelmatch/index.js'))).default;
  const output=process.argv[2]||'/tmp/commercial-filters';
  await fs.mkdir(output,{recursive:true});
  const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-gpu']});
  const results=[];
  try {
    for(const width of [320,390,768,1440,1920]){
      const captures=[];
      for(const [kind,url] of [['source',source],['local',local]]){
        const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
        await page.goto(url,{waitUntil:'domcontentloaded'});
        if(kind==='source')await page.locator('.ymaps3--tile-layer__container').waitFor({state:'attached'});
        await page.evaluate(()=>document.fonts.ready);
        await page.locator('.catalog-hero-filters__filter-icon').first().click();
        await page.locator('.hero-filter-modal').waitFor({state:'visible'});
        await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'});
        const panel=page.locator('.hero-filter-modal__dialog');
        const metrics=await panel.evaluate(root=>[root,...root.querySelectorAll('h2,p,label,input,button')].map(e=>{
          const r=e.getBoundingClientRect(),s=getComputedStyle(e);
          return {cls:e.className,text:e.textContent.trim(),x:r.x,y:r.y,w:r.width,h:r.height,font:s.fontFamily,size:s.fontSize,weight:s.fontWeight,line:s.lineHeight,padding:s.padding,margin:s.margin};
        }));
        const png=await panel.screenshot({path:path.join(output,`${kind}-${width}.png`)});
        captures.push({metrics,png:PNG.sync.read(png)});
        await page.close();
      }
      const [a,b]=captures;
      assert.deepEqual(b.metrics,a.metrics,`Source filter geometry/typography at ${width}px`);
      assert.equal(b.png.width,a.png.width);assert.equal(b.png.height,a.png.height);
      const diff=new PNG({width:a.png.width,height:a.png.height});
      const changedPixels=pixelmatch(a.png.data,b.png.data,diff.data,a.png.width,a.png.height,{threshold:0,includeAA:true});
      await fs.writeFile(path.join(output,`diff-${width}.png`),PNG.sync.write(diff));
      results.push({width,panelWidth:a.png.width,panelHeight:a.png.height,changedPixels,metricsMatched:true});
      console.log(results.at(-1));
    }
    const report={source,verifiedAt:new Date().toISOString(),settings:{height:900,DPR:1,threshold:0,includeAA:true,browser:browser.version(),rendering:'software --disable-gpu',surface:'original filter dialog; added listing/map triggers are intentional page changes'},results};
    await fs.writeFile(path.resolve(__dirname,'../kommercheskaya-nedvizhimost/filter-verification-report.json'),JSON.stringify(report,null,2)+'\n');
    assert.equal(results.every(result=>result.changedPixels===0),true,'Strict panel pixel equality');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
