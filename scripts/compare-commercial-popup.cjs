const fs=require('node:fs/promises');
const path=require('node:path');
const assert=require('node:assert/strict');
const toolkit=process.env.WEB_CAPTURE_TOOLKIT||'/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit';
const {chromium}=require(path.join(toolkit,'node_modules/playwright'));
const {PNG}=require(path.join(process.env.CODEX_TOOLKIT_ROOT||'/home/daniil/.local/share/codex-toolkit','node_modules/pngjs'));
(async()=>{
  const pixelmatch=(await import(path.join(toolkit,'node_modules/pixelmatch/index.js'))).default;
  const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--disable-gpu']});
  const output=process.argv[2]||'/tmp/commercial-popup-comparison';await fs.mkdir(output,{recursive:true});
  const results=[];
  try {
    for(const width of [320,390,540,768,1440,1920]){
      const images=[];
      for(const [kind,url] of [['reference','https://daniilterekh-prog.github.io/barn-estate-homepage-clone/kurortnaya/'],['local','file://'+path.resolve(__dirname,'../kommercheskaya-nedvizhimost/index.html')]]){
        const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:'reduce'});
        await page.goto(url,{waitUntil:'load'});
        await page.evaluate(()=>document.fonts.ready);
        await page.locator('.floating-expert__card').click();
        const panel=page.locator('.catalog-feedback-modal .modal__content');
        await panel.waitFor({state:'visible'});
        await page.waitForFunction(()=>{const img=document.querySelector('.catalog-feedback-modal img');return img?.complete&&img.naturalWidth>0;});
        await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}.catalog-feedback-modal{background:rgb(8,10,13)!important}'});
        // The reference focuses the content; match this state before comparing pixels.
        await panel.focus();
        images.push(PNG.sync.read(await panel.screenshot({path:path.join(output,`${kind}-${width}.png`)})));
        await page.close();
      }
      const [a,b]=images;assert.equal(a.width,b.width);assert.equal(a.height,b.height);
      const diff=new PNG({width:a.width,height:a.height});
      const changedPixels=pixelmatch(a.data,b.data,diff.data,a.width,a.height,{threshold:0,includeAA:true});
      await fs.writeFile(path.join(output,`diff-${width}.png`),PNG.sync.write(diff));
      results.push({width,panelWidth:a.width,panelHeight:a.height,changedPixels});console.log(results.at(-1));
    }
    await fs.writeFile(path.resolve(__dirname,'../kommercheskaya-nedvizhimost/popup-verification.json'),JSON.stringify({source:'https://daniilterekh-prog.github.io/barn-estate-homepage-clone/kurortnaya/',verifiedAt:new Date().toISOString(),surface:'initial popup content, not background or submitted state; opaque backdrop during capture excludes different page images in fractional edge pixels',settings:{height:900,DPR:1,threshold:0,includeAA:true,browser:browser.version()},results},null,2)+'\n');
    assert.ok(results.every(result=>result.changedPixels===0),'Strict reference popup pixel equality');
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
