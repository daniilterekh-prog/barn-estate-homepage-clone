const assert=require('node:assert/strict'),path=require('node:path');
const {chromium}=require('/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const {PNG}=require('/home/daniil/.local/share/codex-toolkit/node_modules/pngjs');
(async()=>{
 const {default:pixelmatch}=await import('/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/pixelmatch/index.js');
 const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const listing='.catalog-mode-filters .catalog-quick-filters__button';
 try{for(const width of [320,390,768,1440,1920]){
  const pages=[];
  for(const url of ['https://daniilterekh-prog.github.io/barn-estate-homepage-clone/kurortnaya/','file://'+path.resolve(__dirname,'../kommercheskaya-nedvizhimost/index.html')]){
   const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});pages.push(page);await page.goto(url);
   await page.waitForFunction(()=>document.querySelector('.resort-sort-trigger'));
   await page.evaluate(()=>document.fonts.ready);
   await page.addStyleTag({content:'.catalog-sticky{display:none!important}*,*::before,*::after{transition:none!important;animation:none!important}'});
  }
  const compare=async(a,b,label)=>{
   // Normalize raster origin: unlike the resort's four filters, commerce has
   // three, so original fractional column coordinates differ by design.
   const capture=async locator=>{
    const fixture=await locator.evaluateHandle(svg=>{
     const clone=svg.cloneNode(true),originals=[svg,...svg.querySelectorAll('*')],copies=[clone,...clone.querySelectorAll('*')];
     originals.forEach((node,index)=>{const style=getComputedStyle(node);for(const property of ['color','stroke','stroke-width','stroke-linecap','stroke-linejoin','fill','opacity'])copies[index].style.setProperty(property,style.getPropertyValue(property));});
     const rect=svg.getBoundingClientRect();
     Object.assign(clone.style,{position:'fixed',left:'100px',top:'100px',width:rect.width+'px',height:rect.height+'px',margin:'0',background:'white',zIndex:'99999'});
     document.body.append(clone);return clone;
    });
    const result=PNG.sync.read(await fixture.asElement().screenshot());await fixture.evaluate(e=>e.remove());await fixture.dispose();return result;
   };
   const first=await capture(a),second=await capture(b);
   assert.equal(first.width,second.width,label+' width');assert.equal(first.height,second.height,label+' height');
   assert.equal(pixelmatch(first.data,second.data,null,first.width,first.height,{threshold:0.1}),0,`${label} at ${width}px`);
  };
  await compare(pages[0].locator(listing).nth(1).locator('svg'),pages[1].locator(listing).nth(0).locator('svg'),'Listing type');
  await compare(pages[0].locator(listing).nth(2).locator('svg'),pages[1].locator(listing).nth(1).locator('svg'),'Listing cost');
  await compare(pages[0].locator('.catalog-mode-detailed-filters svg'),pages[1].locator('.catalog-mode-detailed-filters svg'),'All filters');
  for(const page of pages){await page.locator('.catalog-projects-map__fullscreen').click();if(width<=540)await page.locator('.map-browser__handle').click();}
  for(const selector of ['.map-browser [data-filter=type]','.map-browser [data-filter=price]']){
   await compare(pages[0].locator(selector).locator('..').locator('svg'),pages[1].locator(selector).locator('..').locator('svg'),selector);
  }
  for(const selector of ['.map-browser__search svg','.map-browser__filter-toggle svg'])await compare(pages[0].locator(selector),pages[1].locator(selector),selector);
  const area=await pages[1].locator('.map-browser__area svg path').getAttribute('d');
  assert.equal(area,await pages[1].locator(listing).nth(2).locator('svg path').getAttribute('d'));
  console.log(`PASS ${width}px: 7 SVGs match resort at normalized raster origin, area path shared`);
  for(const page of pages)await page.close();
 }}finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
