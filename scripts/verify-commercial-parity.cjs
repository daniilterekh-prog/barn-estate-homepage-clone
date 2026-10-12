/* Strict visual regression against controlled captures of the selected source. */
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const toolkit = process.env.WEB_CAPTURE_TOOLKIT || '/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit';
const { chromium } = require(path.join(toolkit, 'node_modules/playwright'));
const { PNG } = require(path.join(process.env.CODEX_TOOLKIT_ROOT || path.join(os.homedir(), '.local/share/codex-toolkit'), 'node_modules/pngjs'));
const directory = process.argv[2] || '/tmp/commercial-parity';
const widths = process.argv.slice(3).map(Number);
if (!widths.length) widths.push(320, 360, 390, 414, 540, 541, 560, 561, 639, 640, 641, 767, 768, 1024, 1025, 1280, 1281, 1440, 1441, 1600, 1920, 2560);
const localUrl = 'file://' + path.resolve(__dirname, '../kommercheskaya-nedvizhimost/index.html');
const source = 'https://front.barnes.vsavr.ru/kommercheskaya-nedvizhimost/';

(async () => {
  const pixelmatch = (await import(path.join(toolkit, 'node_modules/pixelmatch/index.js'))).default;
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox','--disable-gpu'] });
  const browserVersion=browser.version();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const captureSession=await page.context().newCDPSession(page);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const results = [];
  for (const width of widths) {
    const reference = JSON.parse(await fs.readFile(path.join(directory, `matrix-${width}.json`), 'utf8'));
    await page.setViewportSize({ width, height: 900 });
    await page.goto(localUrl, { waitUntil: 'load' });
    await page.evaluate(async () => {
      document.querySelectorAll('img').forEach(image => { image.loading = 'eager'; });
      await document.fonts.ready;
      await Promise.all([...document.images].map(image => image.decode().catch(() => {})));
    });
    await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}.floating-expert{opacity:1!important;transform:none!important}' });
    await page.evaluate(() => scrollTo(0, 0));
    const local = await page.evaluate(selectors => ({
      height: document.documentElement.scrollHeight,
      overflow: document.documentElement.scrollWidth > innerWidth,
      sections: selectors.map(selector => {
        const element = document.querySelector(selector), r = element.getBoundingClientRect();
        return { selector, x: r.x, y: r.y, w: r.width, h: r.height };
      }),
      text: [...document.querySelectorAll('h1,h2,h3,.catalog-hero-filters__bar,.news-section__category,.catalog-faq__question-text,.site-header__logo,.splide__slide')].map(element => {
        const r = element.getBoundingClientRect(), s = getComputedStyle(element);
        return { cls: element.className, text: element.textContent.trim().slice(0,70), x:r.x,y:r.y,w:r.width,h:r.height,font:s.fontFamily,size:s.fontSize,weight:s.fontWeight,line:s.lineHeight,spacing:s.letterSpacing,padding:s.padding,margin:s.margin };
      }),
      brokenImages: [...document.images].filter(image => image.complete && !image.naturalWidth).map(image => image.getAttribute('src')),
    }), reference.sections.map(section => section.selector));
    await captureSession.send('Emulation.setScriptExecutionDisabled',{value:true});
    let screenshot;
    try {
      const captured=await captureSession.send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:true,clip:{x:0,y:0,width,height:local.height,scale:1}});
      screenshot=Buffer.from(captured.data,'base64');
      await fs.writeFile(path.join(directory,`verified-local-${width}.png`),screenshot);
    } finally { await captureSession.send('Emulation.setScriptExecutionDisabled',{value:false}); }
    const a = PNG.sync.read(await fs.readFile(path.join(directory, `matrix-reference-${width}.png`)));
    const b = PNG.sync.read(screenshot);
    let difference = null;
    if (a.width === b.width && a.height === b.height) {
      const diff = new PNG({ width: a.width, height: a.height });
      const changed = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0, includeAA: true });
      await fs.writeFile(path.join(directory, `verified-diff-${width}.png`), PNG.sync.write(diff));
      let maxChannelDifference=0;
      for(let i=0;i<a.data.length;i++)maxChannelDifference=Math.max(maxChannelDifference,Math.abs(a.data[i]-b.data[i]));
      difference = { changedPixels: changed, totalPixels: a.width * a.height, percent: changed / (a.width * a.height) * 100,maxChannelDifference };
    }
    const sectionDifferences = reference.sections.flatMap((section, index) => ['x','y','w','h'].filter(key => section[key] !== local.sections[index][key]).map(key => ({ selector:section.selector,property:key,reference:section[key],local:local.sections[index][key] })));
    const textDifferences = reference.text.flatMap((element, index) => ['x','y','w','h','font','size','weight','line','spacing','padding','margin'].filter(key => element[key] !== local.text[index]?.[key]).map(key => ({ index,cls:element.cls,property:key,reference:element[key],local:local.text[index]?.[key] })));
    const pixelHash=data=>crypto.createHash('sha256').update(data).digest('hex');
    const result = { width, referenceHeight:reference.height, localHeight:local.height, difference, referencePixelSha256:pixelHash(a.data),localPixelSha256:pixelHash(b.data),sectionDifferences, textDifferences, overflow:local.overflow, brokenImages:local.brokenImages };
    results.push(result); console.log(JSON.stringify({ width, referenceHeight:reference.height, localHeight:local.height, difference, sectionDifferences:sectionDifferences.length, textDifferences:textDifferences.length, brokenImages:local.brokenImages.length }));
  }
  await browser.close();
  const report = { source, capturedDate:'2026-10-12', verifiedAt:new Date().toISOString(), layoutAndTypographyPassed:!errors.length&&results.every(result=>!result.sectionDifferences.length&&!result.textDifferences.length&&!result.overflow&&!result.brokenImages.length),strictPixelEquality:results.every(result=>result.difference?.changedPixels===0),settings:{ browser:'Google Chrome',browserVersion,rendering:'software; --disable-gpu',viewportHeight:900,deviceScaleFactor:1,fontReadiness:'document.fonts.ready',images:'decoded',animations:'disabled; floating expert in its fully entered state',scripts:'paused only during both captures to prevent map redraws',captureMethod:'CDP Page.captureScreenshot; identical clip and scale for source and copy',scrollPosition:0,pixelmatchVersion:'8.0.0',threshold:0,includeAA:true },errors,results };
  await fs.writeFile(path.join(directory,'verification-report.json'),JSON.stringify(report,null,2)+'\n');
  await fs.writeFile(path.resolve(__dirname,'../kommercheskaya-nedvizhimost/verification-report.json'),JSON.stringify(report,null,2)+'\n');
  if (errors.length || results.some(result => !result.difference || result.difference.changedPixels || result.sectionDifferences.length || result.textDifferences.length || result.overflow || result.brokenImages.length)) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
