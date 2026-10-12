import path from 'node:path';
import {pathToFileURL} from 'node:url';

const toolkit=process.env.CAPTURE_TOOLKIT;
if(!toolkit)throw new Error('Set CAPTURE_TOOLKIT to the existing capture toolkit.');
const {chromium}=await import(pathToFileURL(path.join(toolkit,'node_modules/playwright/index.mjs')));
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
const errors=[];
try {
  for(const width of [390,768,1024,1440,1920]) {
    const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
    page.on('pageerror',error=>errors.push(`${width}: ${error.message}`));
    await page.goto(process.env.COUNTRY_LOCAL_URL||'http://127.0.0.1:4188/zagorodnaya-nedvizhimost/',{waitUntil:'networkidle'});
    await page.evaluate(()=>document.fonts.ready);
    const quick=page.locator('.catalog-mode-toolbar [data-country-quick]');
    if(await quick.count()!==4)throw new Error(`${width}: expected four listing quick filters`);
    await quick.nth(1).click();
    const popup=page.locator('.country-reference-dropdown');
    if(!await popup.isVisible())throw new Error(`${width}: listing popup hidden`);
    await popup.getByRole('option',{name:'Дом',exact:true}).click();
    if(!await quick.nth(1).evaluate(button=>button.classList.contains('is-active')))throw new Error(`${width}: type not applied`);
    const brand=page.locator('.country-brand-filters[data-brand-context="listing"] input').first();
    await brand.check();
    await page.locator('.catalog-mode-toolbar [data-country-select="sort"]').click();
    if(!await popup.isVisible())throw new Error(`${width}: sorting popup hidden`);
    await popup.getByRole('option').nth(1).click();
    const sortValue=await page.locator('.catalog-mode-toolbar .catalog-grid__sort select').inputValue();
    if(!sortValue)throw new Error(`${width}: listing sorting not applied`);
    await quick.nth(0).click();await page.keyboard.press('Escape');
    if(await popup.isVisible())throw new Error(`${width}: popup did not close with Escape`);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
    if(overflow)throw new Error(`${width}: horizontal overflow`);
    if(width===390){
      await page.locator('.catalog-sticky__callback').click();
      if(!await page.locator('#catalog-feedback-modal').isVisible())throw new Error('Mobile header request did not open the form');
      await page.keyboard.press('Escape');
    }
    if(width===390||width===1440){
      await page.locator('.catalog-mode-toolbar').scrollIntoViewIfNeeded();
      await page.screenshot({path:`/tmp/country-reference-listing-${width}.png`});
    }
    await page.locator('.catalog-projects-map__fullscreen').click();
    const mapQuick=page.locator('.catalog-projects-map__panel [data-country-quick]');
    if(await mapQuick.count()!==4)throw new Error(`${width}: expected four map quick filters`);
    if(await page.locator('.country-map-sort select').inputValue()!==sortValue)throw new Error(`${width}: map sort did not sync`);
    if(width<=540)await page.locator('.catalog-projects-map__panel-handle').click();
    await mapQuick.nth(2).click();
    if(!await popup.isVisible())throw new Error(`${width}: map popup hidden`);
    await popup.getByRole('option',{name:'Любая стоимость'}).click();
    if(await popup.isVisible())throw new Error(`${width}: map popup did not close`);
    await page.locator('[data-country-market="lot"]').click();
    if(await page.locator('[data-country-mode="lot"]').getAttribute('aria-pressed')!=='true')throw new Error(`${width}: market not synchronized`);
    if(!await page.locator('.country-brand-filters[data-brand-context="map"] input').first().isChecked())throw new Error(`${width}: brand flags not synchronized`);
    if(width===390||width===1440)await page.screenshot({path:`/tmp/country-reference-map-${width}.png`});
    await page.locator('.catalog-projects-map__exit').click();
    await page.waitForFunction(()=>!document.fullscreenElement&&!document.querySelector('.country-map-fallback')&&!document.querySelector('.country-map-expanded'));
    const inert=await page.locator('[inert]').evaluateAll(nodes=>nodes.map(node=>node.className||node.tagName));
    if(inert.length)throw new Error(`${width}: inert elements after map exit: ${inert.join(', ')}`);
    console.log(JSON.stringify({width,quick:4,mapQuick:4,overflow,market:'lot',errors:errors.filter(error=>error.startsWith(`${width}:`))}));
    await page.close();
  }
  if(errors.length)throw new Error(errors.join('\n'));
} finally {await browser.close();}
