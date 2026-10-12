const fs=require('node:fs/promises');
const {chromium}=require('/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
(async()=>{
  const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
  const page=await browser.newPage();const states=[];
  for(const width of [390,768,1024,1440,1920]){
    await page.setViewportSize({width,height:900});await page.goto('https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost',{waitUntil:'domcontentloaded'});await page.locator('.catalog-projects-map').scrollIntoViewIfNeeded();
    await page.waitForFunction(()=>document.querySelectorAll('.ymaps3--tile-layer__container img').length>0,{timeout:15000});await page.waitForTimeout(700);
    states.push(await page.evaluate(()=>{const map=document.querySelector('.catalog-projects-map'),tiles=map.querySelector('.ymaps3--tile-layer__container');return{viewport:innerWidth,width:map.clientWidth,height:map.clientHeight,zoom:tiles.dataset.z,transform:tiles.style.transform,tiles:[...tiles.querySelectorAll('img')].map(e=>({src:e.src,left:parseFloat(e.style.left),top:parseFloat(e.style.top)})),markers:[...map.querySelectorAll('.ymaps3--marker')].map(e=>({transform:e.style.transform,html:e.innerHTML}))};}));
  }
  await fs.writeFile('mezhdunarodnaya-nedvizhimost/source-map-states.js','window.BARNES_INTERNATIONAL_MAP_STATES='+JSON.stringify(states)+';\n');
  const sheets=await page.evaluate(()=>[...document.styleSheets].map(s=>s.href).filter(h=>h?.startsWith('https://yastatic.net/')));
  const css=[];
  for(const href of sheets){const response=await fetch(href);if(!response.ok)throw new Error('Map CSS '+response.status);css.push((await response.text()).replace(/url\((['"]?)([^)'"\s]+)\1\)/g,(_,q,url)=>'url("'+new URL(url,href).href+'")'));}
  await fs.writeFile('mezhdunarodnaya-nedvizhimost/source-map.css',css.join('\n'));
  console.log(states.map(s=>({width:s.viewport,tiles:s.tiles.length,markers:s.markers.length})));await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1;});
