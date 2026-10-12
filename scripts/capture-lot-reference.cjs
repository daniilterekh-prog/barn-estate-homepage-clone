/* Read-only capture of the explicitly selected BARNES reference. No forms are submitted. */
const fs = require('node:fs/promises');
const path = require('node:path');
const toolkit=process.env.WEB_CAPTURE_TOOLKIT||'/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit';
const { chromium } = require(path.join(toolkit,'node_modules/playwright'));
const source = 'https://front.barnes.vsavr.ru/vtorichnaya-nedvizhimost/588036/';
const output = process.argv[2] || '/tmp/barnes-588036';
const widths = process.argv.slice(3).map(Number);
if (!widths.length) widths.push(320,360,390,414,540,541,640,767,768,1024,1025,1280,1281,1440,1441,1600,1920,2560);
const stable = '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}.floating-expert{opacity:1!important;transform:none!important}';
async function ready(page) {
  await page.evaluate(async () => {
    document.querySelectorAll('img').forEach(i => i.loading = 'eager');
    await document.fonts.ready;
    await Promise.all([...document.images].map(i => i.decode().catch(() => {})));
  });
  await page.addStyleTag({content:stable});
  await page.waitForTimeout(100);
}
async function reset(page) {
  await page.goto(source,{waitUntil:'domcontentloaded',timeout:60000});
  await page.locator('.ymaps3--tile-layer__container').waitFor({state:'attached',timeout:20000});
  await page.waitForTimeout(700);
  await ready(page);
}
async function metrics(page) {
  return page.evaluate(() => {
    const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}};
    const map=document.querySelector('.surroundings-map__wrap');
    const layer=map.querySelector('.ymaps3--tile-layer__container');
    return {width:innerWidth,height:document.documentElement.scrollHeight,headerHeight:getComputedStyle(document.documentElement).getPropertyValue('--layout-header-height'),
      sections:[...document.querySelectorAll('main section,.site-footer,.breadcrumbs')].map(e=>({selector:'.'+e.classList[0],...rect(e)})),
      text:[...document.querySelectorAll('h1,h2,h3,.lot-hero__price,.reviews-section__text,.lot-about-complex__text')].map(e=>{const s=getComputedStyle(e);return {cls:e.className,text:e.textContent.trim(),...rect(e),font:s.fontFamily,size:s.fontSize,weight:s.fontWeight,line:s.lineHeight,spacing:s.letterSpacing,margin:s.margin,padding:s.padding}}),
      map:{width:map.clientWidth,height:map.clientHeight,zoom:Number(layer.dataset.z),transform:layer.style.transform,tiles:[...layer.querySelectorAll('img')].map(i=>({src:i.src,left:parseFloat(i.style.left),top:parseFloat(i.style.top)})),markers:[...map.querySelectorAll('.ymaps3--marker')].map(e=>({transform:e.style.transform,html:e.innerHTML}))}
    };
  });
}
(async()=>{
  await fs.mkdir(output,{recursive:true});
  const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
  const p=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
  for(const width of widths){
    if(!process.env.BARNES_RECAPTURE && await fs.stat(path.join(output,`reference-${width}.png`)).then(()=>true).catch(()=>false))continue;
    await p.setViewportSize({width,height:900});await reset(p);
    const height=await p.evaluate(()=>document.documentElement.scrollHeight);
    for(let y=0;y<height;y+=850){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(30)}
    await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(150);await ready(p);
    await p.waitForLoadState('networkidle',{timeout:12000}).catch(()=>{});
    await ready(p);
    const data=await metrics(p);
    await fs.writeFile(path.join(output,`matrix-${width}.json`),JSON.stringify(data,null,2));
    await fs.writeFile(path.join(output,`reference-${width}.html`),await p.content());
    await p.screenshot({path:path.join(output,`reference-${width}.png`),fullPage:true});
    console.log(JSON.stringify({width,height:data.height,mapWidth:data.map.width,mapZoom:data.map.zoom}));
  }
  await p.setViewportSize({width:1440,height:900});
  const states=[['menu','.site-header__icon-btn','.site-menu'],['gallery','.lot-hero__action','.lot-gallery-modal'],['callback','.site-footer__callback-btn','.modal'],['tour','.lot-hero__card-action','.modal'],['presentation','.lot-hero__card-action:last-child','.modal'],['price','.lot-hero__track','.modal'],['construction','.construction__card','.construction-gallery-modal']];
  for(const [name,button,selector] of states){
    if(await fs.stat(path.join(output,`state-${name}.html`)).then(()=>true).catch(()=>false))continue;
    await reset(p);await p.locator(button).first().click();await p.waitForTimeout(500);await ready(p);
    console.log('state',name,await p.locator(selector).count());
    await fs.writeFile(path.join(output,`state-${name}.html`),await p.content());
    await p.screenshot({path:path.join(output,`state-${name}.png`)});
  }
  if(!await fs.stat(path.join(output,'state-gallery-map.html')).then(()=>true).catch(()=>false)){
    await reset(p);await p.locator('.lot-hero__action').click();await p.locator('.lot-gallery-modal__tab').last().click();await p.waitForTimeout(1200);await ready(p);
    await fs.writeFile(path.join(output,'state-gallery-map.html'),await p.content());await p.screenshot({path:path.join(output,'state-gallery-map.png')});
  }
  await reset(p);
  const reviews=[];
  for(let n=0;n<3;n++){reviews.push(await p.locator('.reviews-section__content').innerHTML());if(n<2){await p.getByRole('button',{name:'Следующий отзыв'}).click();await p.waitForTimeout(300)}}
  await fs.writeFile(path.join(output,'reviews.json'),JSON.stringify(reviews));
  const categories=[];
  for(let n=0;n<await p.locator('.surroundings-map__category').count();n++){
    await p.locator('.surroundings-map__category').nth(n).click();await p.waitForTimeout(250);
    categories.push({name:await p.locator('.surroundings-map__category').nth(n).innerText(),map:(await metrics(p)).map});
  }
  await fs.writeFile(path.join(output,'categories.json'),JSON.stringify(categories));
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
