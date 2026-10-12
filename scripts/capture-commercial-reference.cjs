/* Read-only captures of the user-selected reference; never submit its forms. */
const fs = require('node:fs/promises');
const path = require('node:path');
const toolkit = process.env.WEB_CAPTURE_TOOLKIT || '/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit';
const { chromium } = require(path.join(toolkit, 'node_modules/playwright'));
const source = 'https://front.barnes.vsavr.ru/kommercheskaya-nedvizhimost/';
const output = process.argv[2] || '/tmp/commercial-parity';
const statesOnly = process.argv.includes('--states-only');
const widths = process.argv.slice(3).filter(value=>value!=='--states-only').map(Number);
if (!widths.length && !statesOnly) widths.push(320,360,390,414,540,541,560,561,639,640,641,767,768,1024,1025,1280,1281,1440,1441,1600,1920,2560);
const stableStyles = '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}.floating-expert{opacity:1!important;transform:none!important}';

(async () => {
  await fs.mkdir(output, { recursive:true });
  const browser = await chromium.launch({ executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-gpu'] });
  const page = await browser.newPage({ viewport:{width:1440,height:900},deviceScaleFactor:1 });
  const captureSession=await page.context().newCDPSession(page);
  for (const width of widths) {
    await page.setViewportSize({ width,height:900 });
    // A fresh navigation matters: map fit-bounds differs from a resized map.
    await page.goto(source, { waitUntil:'domcontentloaded',timeout:30000 });
    await page.locator('.ymaps3--tile-layer__container').waitFor({ state:'attached',timeout:20000 });
    await page.evaluate(async () => {
      document.querySelectorAll('img').forEach(image => { image.loading='eager'; });
      await document.fonts.ready;
      await Promise.race([Promise.all([...document.images].map(image=>image.decode().catch(()=>{}))),new Promise(resolve=>setTimeout(resolve,5000))]);
    });
    await page.locator('.catalog-projects-map').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => [...document.querySelectorAll('.ymaps3--tile-layer__container img')].every(image => image.complete && image.naturalWidth > 0), null, { timeout:10000 });
    await page.waitForTimeout(2000);
    await page.addStyleTag({ content:stableStyles });
    await page.waitForTimeout(700);
    const height = await page.evaluate(()=>document.documentElement.scrollHeight);
    for(let y=0;y<height;y+=800){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(20);}
    await page.evaluate(()=>scrollTo(0,0));
    await page.waitForTimeout(800);
    // A full-page capture wakes the map's offscreen compositor. Warm it first.
    await page.screenshot({fullPage:true,timeout:60000});
    await page.waitForTimeout(1000);
    const data = await page.evaluate(() => {
      const selectors=['.catalog-hero','.catalog-map','.catalog-grid','.catalog-intro','.catalog-consultation','.news-section','.catalog-faq','.catalog-contact','.site-footer'];
      const map=document.querySelector('.catalog-projects-map'),r=map.getBoundingClientRect();
      return {
        viewport:innerWidth,height:document.documentElement.scrollHeight,
        sections:selectors.map(selector=>{const r=document.querySelector(selector).getBoundingClientRect();return {selector,x:r.x,y:r.y,w:r.width,h:r.height};}),
        map:{x:r.x,y:r.y,width:r.width,height:r.height,clientWidth:map.clientWidth,clientHeight:map.clientHeight,zoom:document.querySelector('.ymaps3--tile-layer__container').dataset.z,transform:document.querySelector('.ymaps3--tile-layer__container').style.transform,tiles:[...map.querySelectorAll('.ymaps3--tile-layer__container img')].map(image=>({src:image.src,left:image.style.left,top:image.style.top})),markers:[...map.querySelectorAll('.ymaps3--marker')].map(marker=>({transform:marker.style.transform,html:marker.innerHTML}))},
        text:[...document.querySelectorAll('h1,h2,h3,.catalog-hero-filters__bar,.news-section__category,.catalog-faq__question-text,.site-header__logo,.splide__slide')].map(element=>{const r=element.getBoundingClientRect(),s=getComputedStyle(element);return {cls:element.className,text:element.textContent.trim().slice(0,70),x:r.x,y:r.y,w:r.width,h:r.height,font:s.fontFamily,size:s.fontSize,weight:s.fontWeight,line:s.lineHeight,spacing:s.letterSpacing,padding:s.padding,margin:s.margin};}),
      };
    });
    await fs.writeFile(path.join(output,`matrix-${width}.json`),JSON.stringify(data,null,2));
    await fs.writeFile(path.join(output,`reference-dom-${width}.html`),await page.content());
    if (width === 1440) await fs.writeFile(path.join(output,'reference.html'),await page.content());
    // Freeze page scripts for the capture, otherwise the map redraws when the
    // offscreen compositor is asked to paint the full page.
    await captureSession.send('Emulation.setScriptExecutionDisabled',{value:true});
    try {
      const screenshot=await captureSession.send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:true,clip:{x:0,y:0,width,height:data.height,scale:1}});
      await fs.writeFile(path.join(output,`matrix-reference-${width}.png`),Buffer.from(screenshot.data,'base64'));
    } finally { await captureSession.send('Emulation.setScriptExecutionDisabled',{value:false}); }
    console.log(JSON.stringify({width,height:data.height,zoom:data.map.zoom}));
  }
  for (const kind of ['menu','filters','callback']) {
    await page.setViewportSize({width:1440,height:900});
    await page.goto(source,{waitUntil:'domcontentloaded',timeout:30000});
    // The server-rendered button exists before Nuxt attaches click handlers.
    await page.locator('.ymaps3--tile-layer__container').waitFor({state:'attached',timeout:20000});
    const selector={menu:'.site-header__icon-btn',filters:'.catalog-hero-filters__filter-icon',callback:'.apartment-card__call-btn'}[kind];
    await page.locator(selector).first().click();
    await page.locator({menu:'.site-menu',filters:'.hero-filter-modal',callback:'.feedback-modal'}[kind]).waitFor({state:'visible'});
    await page.waitForTimeout(500);
    await fs.writeFile(path.join(output,`state-${kind}.html`),await page.content());
  }
  await browser.close();
})().catch(error=>{console.error(error);process.exitCode=1;});
