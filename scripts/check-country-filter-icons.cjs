const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const toolkit=process.env.CAPTURE_TOOLKIT;
if(!toolkit)throw Error('Set CAPTURE_TOOLKIT to the existing capture toolkit.');
const {chromium}=require(path.join(toolkit,'node_modules/playwright'));
const {PNG}=require(path.join(toolkit,'node_modules/pngjs'));

(async()=>{
  const {default:pixelmatch}=await import(pathToFileURL(path.join(toolkit,'node_modules/pixelmatch/index.js')));
  const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
  const listing='.catalog-mode-filters .catalog-quick-filters__button';
  const reference='https://daniilterekh-prog.github.io/barn-estate-homepage-clone/kurortnaya/';
  const country=process.env.COUNTRY_URL||'http://127.0.0.1:4188/zagorodnaya-nedvizhimost/';
  async function raster(locator){
    const fixture=await locator.evaluateHandle(svg=>{
      const clone=svg.cloneNode(true),originals=[svg,...svg.querySelectorAll('*')],copies=[clone,...clone.querySelectorAll('*')];
      originals.forEach((node,index)=>{
        const style=getComputedStyle(node);
        for(const property of ['color','stroke','stroke-width','stroke-linecap','stroke-linejoin','fill','opacity'])copies[index].style.setProperty(property,style.getPropertyValue(property));
      });
      const rect=svg.getBoundingClientRect();
      Object.assign(clone.style,{position:'fixed',left:'100px',top:'100px',width:rect.width+'px',height:rect.height+'px',margin:'0',background:'#fff',zIndex:'99999'});
      (document.fullscreenElement||document.body).append(clone);return clone;
    });
    try{return PNG.sync.read(await fixture.asElement().screenshot());}
    finally{await fixture.evaluate(element=>element.remove());await fixture.dispose();}
  }
  async function compare(a,b,label,width){
    const first=await raster(a),second=await raster(b);
    assert.deepEqual([second.width,second.height],[first.width,first.height],`${width}px ${label}: size`);
    assert.equal(pixelmatch(first.data,second.data,null,first.width,first.height,{threshold:0.1}),0,`${width}px ${label}: SVG pixels`);
  }
  try{
    for(const width of [320,390,768,1024,1440,1920]){
      const pages=[];
      for(const url of [reference,country]){
        const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
        pages.push(page);await page.goto(url,{waitUntil:'domcontentloaded'});
        await page.waitForFunction(()=>document.querySelectorAll('.catalog-mode-filters .catalog-quick-filters__button').length===4);
        await page.evaluate(()=>document.fonts.ready);
      }
      for(let index=0;index<4;index++)await compare(pages[0].locator(listing).nth(index).locator('svg'),pages[1].locator(listing).nth(index).locator('svg'),`listing ${index+1}`,width);
      await compare(pages[0].locator('.catalog-mode-detailed-filters svg'),pages[1].locator('.catalog-mode-detailed-filters svg'),'listing full filters',width);
      for(const page of pages)await page.locator('.catalog-projects-map__fullscreen').click();
      await pages[0].locator('.map-browser__panel').waitFor({state:'visible'});
      await pages[1].waitForFunction(()=>document.querySelector('.catalog-projects-map')?.classList.contains('country-map-expanded'));
      if(width<=540){
        await pages[0].locator('.map-browser__handle').click();
        await pages[1].locator('.catalog-projects-map__panel-handle').click();
      }
      for(let index=0;index<4;index++)await compare(pages[0].locator('.map-browser__filters .map-browser__field > svg').nth(index),pages[1].locator('.country-map-filter-icon svg').nth(index),`map ${index+1}`,width);
      await compare(pages[0].locator('.map-browser__search svg'),pages[1].locator('.catalog-projects-map__panel-search-icon svg'),'map search',width);
      await compare(pages[0].locator('.map-browser__filter-toggle svg'),pages[1].locator('.catalog-projects-map__panel-filter-icon'),'map full filters',width);
      console.log(`PASS ${width}px: 11 SVGs match the resort reference`);
      for(const page of pages)await page.close();
    }
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
