const path=require('node:path');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const toolkit=process.env.CAPTURE_TOOLKIT;
if(!toolkit)throw Error('Set CAPTURE_TOOLKIT');
const {chromium}=require(path.join(toolkit,'node_modules/playwright'));
const urls={reference:'https://daniilterekh-prog.github.io/barn-estate-homepage-clone/kurortnaya/',country:process.env.COUNTRY_URL||'http://127.0.0.1:4188/zagorodnaya-nedvizhimost/'};
const selectors={reference:{panel:'.map-browser__panel',heading:'.map-browser__heading',headingText:'.map-browser__heading',search:'.map-browser__search-row',market:'.map-browser__market',fields:'.map-browser__field',brand:'.barnes-brand-filters',reset:'.map-browser__reset',list:'.map-browser__list'},country:{panel:'.catalog-projects-map__panel',heading:'.catalog-projects-map__panel-header',headingText:'.catalog-projects-map__panel-title',search:'.catalog-projects-map__panel-search-row',market:'.country-map-market',fields:'.catalog-projects-map__panel-filters .catalog-quick-filters__button, .country-map-sort',brand:'.country-map-reference .country-brand-filters',reset:'.country-map-reset',list:'.catalog-projects-map__panel-list'}};
(async()=>{
  const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
  const report=[];
  try{
    for(const width of [390,1024,1440,1920])for(const kind of ['reference','country']){
      const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
      await page.goto(urls[kind],{waitUntil:'domcontentloaded'});
      await page.locator(selectors[kind].panel).waitFor({state:'attached'});
      if(kind==='reference')await page.waitForFunction(()=>{
        const required=['map-fullscreen.css','quick-filters.css','brand-filters.css'];
        return required.every(name=>[...document.querySelectorAll('link[rel="stylesheet"]')].some(link=>link.href.includes(name)&&link.sheet));
      });
      await page.evaluate(()=>document.fonts.ready);
      await page.locator('.catalog-projects-map__fullscreen').click();
      await page.locator(selectors[kind].panel).waitFor({state:'visible'});
      if(kind==='country')await page.waitForFunction(()=>document.querySelector('.catalog-projects-map')?.classList.contains('country-map-expanded'));
      if(width<=540){
        const handle=page.locator(kind==='reference'?'.map-browser__handle':'.catalog-projects-map__panel-handle');
        await handle.waitFor({state:'visible'});
        await handle.click();
      }
      const data=await page.evaluate(selectors=>{
        const panel=document.querySelector(selectors.panel),base=panel.getBoundingClientRect();
        const read=selector=>[...panel.querySelectorAll(selector)].filter(el=>el.getClientRects().length).map(el=>{
          const rect=el.getBoundingClientRect(),style=getComputedStyle(el);
          return {text:el.textContent.trim().replace(/\s+/g,' ').slice(0,80),x:Math.round(rect.x-base.x),y:Math.round(rect.y-base.y),width:Math.round(rect.width),height:Math.round(rect.height),font:style.fontSize,weight:style.fontWeight,color:style.color,border:style.borderBottomColor};
        });
        const quickAlignment=selectors.kind==='country'?[...panel.querySelectorAll('.catalog-projects-map__panel-filters .catalog-quick-filters__button')].map(button=>{
          const icon=button.querySelector('.country-map-filter-icon svg').getBoundingClientRect();
          const label=button.querySelector('.catalog-quick-filters__value').getBoundingClientRect();
          return {iconX:Math.round(icon.x-base.x),labelX:Math.round(label.x-base.x),centerDelta:Math.round((label.y+label.height/2)-(icon.y+icon.height/2))};
        }):[];
        return {panel:[Math.round(base.width),Math.round(base.height)],heading:read(selectors.heading),headingText:read(selectors.headingText),search:read(selectors.search),market:read(selectors.market),fields:read(selectors.fields),brand:read(selectors.brand),reset:read(selectors.reset),list:read(selectors.list),quickAlignment};
      },{...selectors[kind],kind});
      await page.locator(selectors[kind].panel).screenshot({path:`/tmp/${kind}-map-panel-${width}.png`});
      report.push({width,kind,...data});
      console.log(JSON.stringify({width,kind,...data}));
      await page.close();
    }
    fs.writeFileSync('/tmp/country-map-panel-audit.json',JSON.stringify(report,null,2));
    assert.equal(report.length,8);
    for(const width of [390,1024,1440,1920]){
      const reference=report.find(row=>row.width===width&&row.kind==='reference');
      const country=report.find(row=>row.width===width&&row.kind==='country');
      assert.deepEqual(country.panel,reference.panel,`${width}: panel size`);
      for(const key of (width<=540?['heading','search','market','fields']:['heading','search','market','fields','brand','reset','list'])){
        const positions=items=>items.map(item=>[item.x,item.y,item.width,item.height]);
        assert.deepEqual(positions(country[key]),positions(reference[key]),`${width}: ${key} geometry`);
      }
      const left=width<=540?24:28,right=width<=540?204:226;
      assert.deepEqual(country.quickAlignment.map(({iconX,labelX,centerDelta})=>[iconX,labelX,centerDelta]),[[left,left+34,0],[right,right+34,0],[left,left+34,0],[right,right+34,0]],`${width}: quick-filter alignment`);
      assert.deepEqual([country.headingText[0].font,country.headingText[0].weight],[reference.headingText[0].font,reference.headingText[0].weight],`${width}: heading typography`);
    }
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
