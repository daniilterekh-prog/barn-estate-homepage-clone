const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const base=process.argv[2]||'http://127.0.0.1:4186';
async function svgSnapshot(page,selector) {
  return page.locator(selector).evaluateAll(elements=>elements.map(svg=>{
    function node(element) {
      const css=getComputedStyle(element);
      return {tag:element.tagName,attrs:Object.fromEntries(Array.from(element.attributes).filter(a=>!a.name.startsWith('data-')&&a.name!=='class').map(a=>[a.name,a.value]).sort()),
        stroke:css.stroke,strokeWidth:css.strokeWidth,cap:css.strokeLinecap,join:css.strokeLinejoin,fill:css.fill,children:Array.from(element.children,node)};
    }
    const box=svg.getBoundingClientRect(),css=getComputedStyle(svg);
    return {width:box.width,height:box.height,color:css.color,tree:node(svg)};
  }));
}
async function chevrons(page,selector) {
  return page.locator(selector).evaluateAll(elements=>elements.map(element=>{
    const css=getComputedStyle(element),box=element.getBoundingClientRect();
    return {width:box.width,height:box.height,borderRight:css.borderRight,borderBottom:css.borderBottom,transform:css.transform};
  }));
}
(async()=>{
  const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true});
  try {
    for(const width of [320,390,540,768,1024,1440,2560]) {
      const snapshots=[];
      for(const route of ['kurortnaya','gorodskaya-nedvizhimost']) {
        const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
        page.setDefaultTimeout(15000);
        await page.goto(base+'/'+route+'/',{waitUntil:'domcontentloaded'});
        await page.waitForSelector('.resort-quick-dropdown',{state:'attached'});
        if(route==='gorodskaya-nedvizhimost')await page.waitForSelector('.city-reference-synced',{state:'attached'});
        await page.evaluate(()=>document.fonts.ready);
        const listing=await svgSnapshot(page,'.catalog-mode-filters svg');
        const hero=await svgSnapshot(page,'.catalog-hero-filters svg');
        const detailed=await svgSnapshot(page,'.catalog-mode-detailed-filters svg');
        const arrows=await chevrons(page,'.catalog-mode-filters .catalog-quick-filters__chevron');
        await page.locator('.catalog-projects-map__fullscreen').click();
        await page.locator('.map-browser').waitFor({state:'visible'});
        if(width<=540)await page.locator('.map-browser__handle').click();
        const map=await svgSnapshot(page,'.map-browser__field > svg');
        const mapSearch=await svgSnapshot(page,'.map-browser__search > svg');
        const mapDetailed=await svgSnapshot(page,'.map-browser__filter-toggle svg');
        const mapArrows=await chevrons(page,'.map-browser__chevron');
        assert.equal(listing.length,4);assert.equal(map.length,4);
        assert.ok(listing.concat(map).every(icon=>icon.width===22&&icon.height===22));
        snapshots.push({hero,listing,detailed,arrows,map,mapSearch,mapDetailed,mapArrows});
        await page.close();
      }
      assert.deepEqual(snapshots[1],snapshots[0],'City SVG differs from Kurortnaya at '+width);
      console.log('PASS exact SVG paths, attributes, paint, dimensions and chevrons:',width);
    }
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
