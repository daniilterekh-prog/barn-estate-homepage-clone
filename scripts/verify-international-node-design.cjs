const fs=require('node:fs/promises'),path=require('node:path'),assert=require('node:assert/strict');
const toolkit='/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules';
const {chromium}=require(path.join(toolkit,'playwright')), {PNG}=require(path.join(toolkit,'pngjs'));
(async()=>{
  const pixelmatch=(await import(path.join(toolkit,'pixelmatch/index.js'))).default;
  const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({deviceScaleFactor:1});const report={reference:'https://daniilterekh-prog.github.io/barn-estate-homepage-clone/kurortnaya/',viewports:[],interactions:[],errors:[]};
  const local='http://127.0.0.1:8124/mezhdunarodnaya-nedvizhimost/';
  const output='/tmp/international-node-check';await fs.mkdir(output,{recursive:true});
  page.on('pageerror',error=>{if(page.url().startsWith(local))report.errors.push(error.message);});
  const selectors=['.catalog-sticky','.catalog-mode-toolbar','.catalog-grid__item:not([hidden]) .apartment-card','.catalog-best-offers .splide__slide.is-visible .launch-card','.catalog-consultation__methods','.catalog-contact__methods','.catalog-map__title','.catalog-grid__title','.catalog-faq__title','.catalog-section-eyebrow'];
  for(const width of [320,390,540,541,768,900,901,1024,1440,1920]){
    await page.setViewportSize({width,height:900});const pair={};
    for(const [name,url]of [['reference',report.reference],['international',local]]){
      await page.goto(url,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>document.querySelectorAll('.catalog-mode-toolbar').length>0);await page.waitForTimeout(1000);await page.evaluate(()=>document.fonts.ready);
      await page.evaluate(()=>scrollTo({top:850,behavior:'instant'}));await page.waitForTimeout(300);
      await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important}'});
      pair[name]=await page.evaluate(selectors=>({components:selectors.map(selector=>{const e=document.querySelector(selector),r=e.getBoundingClientRect(),s=getComputedStyle(e);return{selector,width:r.width,height:r.height,font:s.fontSize,weight:s.fontWeight,line:s.lineHeight,padding:s.padding,border:s.borderRadius};}),eyebrows:document.querySelectorAll('.catalog-section-eyebrow').length,overflow:document.documentElement.scrollWidth-innerWidth}),selectors);
      await page.locator('.catalog-sticky').screenshot({path:output+'/'+name+'-sticky-'+width+'.png'});
    }
    const differences=[];
    pair.reference.components.forEach((expected,i)=>{const actual=pair.international.components[i];for(const key of ['font','weight','line','padding','border'])if(expected[key]!==actual[key])differences.push({selector:expected.selector,key,expected:expected[key],actual:actual[key]});if(!expected.selector.includes('__title'))for(const key of ['width','height'])if(Math.abs(expected[key]-actual[key])>.6)differences.push({selector:expected.selector,key,expected:expected[key],actual:actual[key]});});
    assert.deepEqual(differences,[],'Component mismatch at '+width);assert.equal(pair.international.eyebrows,5);assert.ok(pair.international.overflow<=0);
    const a=PNG.sync.read(await fs.readFile(output+'/reference-sticky-'+width+'.png')),b=PNG.sync.read(await fs.readFile(output+'/international-sticky-'+width+'.png'));
    assert.equal(a.width,b.width);assert.equal(a.height,b.height);
    const count=pixelmatch(a.data,b.data,null,a.width,a.height,{threshold:0,includeAA:true});
    report.viewports.push({width,componentsMatch:true,eyebrows:5,horizontalOverflow:false,stickyPixelsDifferent:count,stickyDifferencePercent:Number((100*count/(a.width*a.height)).toFixed(3))});
    console.log(JSON.stringify(report.viewports.at(-1)));
  }
  for(const width of [390,1440]){
    await page.setViewportSize({width,height:900});await page.goto(local,{waitUntil:'domcontentloaded'});await page.waitForTimeout(700);
    const hero=await page.locator('.catalog-hero').evaluate(e=>e.offsetTop+e.offsetHeight);
    assert.equal(await page.locator('.catalog-sticky').getAttribute('aria-hidden'),'true');
    await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),hero-121);await page.waitForTimeout(100);assert.equal(await page.locator('.catalog-sticky').getAttribute('aria-hidden'),'true');
    await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),hero-119);await page.waitForTimeout(300);assert.equal(await page.locator('.catalog-sticky').getAttribute('aria-hidden'),'false');
    if(width===390){await page.locator('.catalog-sticky__contact-toggle').click();assert.ok(await page.locator('.catalog-sticky__contact-panel').isVisible());await page.keyboard.press('Escape');assert.ok(await page.locator('.catalog-sticky__contact-panel').isHidden());}
    else {await page.locator('.catalog-sticky__request').click();assert.ok(await page.locator('.catalog-feedback-modal').isVisible());await page.keyboard.press('Escape');}
    await page.getByRole('button',{name:'Вторичная',exact:true}).click();assert.equal(await page.locator('.catalog-grid__item:not([hidden])').count(),12);
    assert.equal(await page.locator('.catalog-grid__item:not([hidden]) .listing-card-facts--lot').count(),12);
    await page.getByRole('button',{name:'Новостройки',exact:true}).click();assert.equal(await page.locator('.catalog-grid__item:not([hidden])').count(),4);
    await page.locator('.catalog-mode-detailed-filters').click();assert.ok(await page.locator('.hero-filter-modal').isVisible());await page.keyboard.press('Escape');
    await page.locator('.catalog-quick-filters__button').first().click();assert.ok(await page.locator('.hero-filter-modal').isVisible());await page.keyboard.press('Escape');
    await page.locator('.catalog-grid__item:not([hidden]) .apartment-card__call-btn').first().click();assert.ok(await page.locator('.catalog-feedback-modal').isVisible());await page.locator('.feedback-modal__channels button[data-channel="MAX"]').click();assert.equal(await page.locator('.catalog-feedback-modal [name="preferredChannel"]').inputValue(),'MAX');await page.keyboard.press('Escape');
    const fav=page.locator('.catalog-grid__item:not([hidden]) .apartment-card__favorite').first();await fav.click();assert.equal(await fav.getAttribute('aria-pressed'),'true');
    await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.locator('.floating-expert__card').click();assert.ok(await page.locator('.catalog-feedback-modal').isVisible());await page.keyboard.press('Escape');
    report.interactions.push({width,stickyThreshold:true,contactPanel:true,modeSwitch:true,realProjects:4,realLots:12,detailedFilters:true,quickFilters:true,callback:true,channelSelection:true,favorites:true,expertPopup:true});
  }
  assert.deepEqual(report.errors,[]);
  await fs.writeFile('mezhdunarodnaya-nedvizhimost/verification/node-design.json',JSON.stringify(report,null,2)+'\n');
  await browser.close();console.log('PASS');
})().catch(e=>{console.error(e);process.exit(1);});
