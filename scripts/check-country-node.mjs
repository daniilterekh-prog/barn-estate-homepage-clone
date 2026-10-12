import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const toolkit=process.env.CAPTURE_TOOLKIT;
if(!toolkit)throw new Error('Set CAPTURE_TOOLKIT to the existing capture toolkit.');
const {chromium}=await import(pathToFileURL(path.join(toolkit,'node_modules/playwright/index.mjs')));
const reference='https://daniilterekh-prog.github.io/barn-estate-homepage-clone/kurortnaya/';
const local=process.env.COUNTRY_LOCAL_URL||'http://127.0.0.1:4188/zagorodnaya-nedvizhimost/';
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
const widths=process.argv.slice(2).map(Number);if(!widths.length)widths.push(320,390,540,541,768,1024,1280,1440,1441,1920,2560);
const sections=['.catalog-hero__title','.catalog-best-offers__title','.catalog-section-eyebrow','.catalog-map__title','.catalog-grid__title','.catalog-intro__title','.catalog-consultation__subtitle','.departments-section__title','.news-section__title','.catalog-faq__title','.catalog-contact__title'];
const components=['.catalog-mode-switch__button','.catalog-quick-filters__caption','.catalog-grid__sort-select','.catalog-mode-detailed-filters','.listing-card-fact__label','.listing-card-fact__value','.apartment-card--catalog .apartment-card__name-text','.apartment-card--catalog .apartment-card__price','.apartment-card--catalog .apartment-card__call-btn','.catalog-best-offers .splide__slide.is-visible.is-active .launch-card .apartment-card__name','.catalog-best-offers .splide__slide.is-visible.is-active .launch-card .apartment-card__price','.catalog-best-offers .splide__slide.is-visible.is-active .launch-card__region'];
const properties=['fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','color','borderRadius'];
const blocks=['.catalog-best-offers','.catalog-map','.catalog-grid','.catalog-intro','.catalog-consultation','.departments-section','.news-section','.catalog-faq','.catalog-contact'];
const report={date:new Date().toISOString(),reference,local:'/zagorodnaya-nedvizhimost/',transport:new URL(local).protocol,deviceScaleFactor:1,viewportHeight:900,widths:[],interactions:{},errors:[]};
const measure=page=>page.evaluate(({sections,components,properties,blocks})=>{
 const style=e=>e?Object.fromEntries(properties.map(k=>[k,getComputedStyle(e)[k]])):null;
 const rect=e=>{if(!e)return null;const r=e.getBoundingClientRect();return[r.x,r.width,r.height]};
 return {styles:Object.fromEntries([...sections,...components].map(s=>[s,style(document.querySelector(s))])),spacing:Object.fromEntries(blocks.map(s=>{const e=document.querySelector(s),c=getComputedStyle(e);return[s,[c.paddingTop,c.paddingBottom]]})),launch:rect(document.querySelector('.catalog-best-offers .splide__slide.is-visible.is-active .launch-card')),launchNeighbor:rect(document.querySelector('.catalog-best-offers .splide__slide.is-visible.is-prev .launch-card')),listing:rect(document.querySelector('.catalog-grid__item:not([hidden]) .apartment-card')),toolbar:rect(document.querySelector('.catalog-mode-toolbar')),overflow:document.documentElement.scrollWidth>innerWidth,eyebrows:document.querySelectorAll('.catalog-section-eyebrow').length,brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.getAttribute('src')),duplicateIds:[...document.querySelectorAll('[id]')].map(e=>e.id).filter((id,index,array)=>array.indexOf(id)!==index)};
},{sections,components,properties,blocks});
for(const width of widths){
 const context=await browser.newContext({viewport:{width,height:900},deviceScaleFactor:1,reducedMotion:'reduce'}),a=await context.newPage(),b=await context.newPage();b.on('pageerror',e=>report.errors.push(e.message));
 await Promise.all([a.goto(reference,{waitUntil:'domcontentloaded'}),b.goto(local,{waitUntil:'domcontentloaded'})]);
 await Promise.all([a,b].map(p=>p.waitForFunction(()=>{const e=document.querySelector('.catalog-best-offers .splide__slide.is-visible.is-active .launch-card .apartment-card__name');const styles=['data-kurortnaya-ui-kit','data-kurortnaya-listing-mode','data-kurortnaya-start-sales'].every(attr=>document.querySelector(`link[${attr}]`)?.sheet);return styles&&e&&getComputedStyle(e).color==='rgb(255, 255, 255)'},null,{timeout:15000})));
 await Promise.all([a,b].map(p=>p.evaluate(()=>document.fonts.ready)));
 const [source,target]=await Promise.all([a,b].map(measure));
 const styleDifferences=Object.keys(source.styles).filter(s=>JSON.stringify(source.styles[s])!==JSON.stringify(target.styles[s]));
 const spacingDifferences=blocks.filter(s=>JSON.stringify(source.spacing[s])!==JSON.stringify(target.spacing[s]));
 const geometryDifferences=['launch','toolbar'].filter(key=>source[key]?.some((n,i)=>Math.abs(n-target[key]?.[i])>.02));
 const row={width,styleDifferences,spacingDifferences,geometryDifferences,source,target};report.widths.push(row);console.log(JSON.stringify({width,styleDifferences,spacingDifferences,geometryDifferences,overflow:target.overflow,brokenImages:target.brokenImages,duplicateIds:target.duplicateIds,launch:[source.launch,target.launch],toolbar:[source.toolbar,target.toolbar]}));
 if(width===390||width===1440){await b.locator('.catalog-best-offers').scrollIntoViewIfNeeded();await b.waitForTimeout(300);await b.screenshot({path:`/tmp/country-node-${width}-launch.png`});await b.locator('.catalog-grid').scrollIntoViewIfNeeded();await b.waitForTimeout(300);await b.screenshot({path:`/tmp/country-node-${width}-catalog.png`});}
 await context.close();
}
const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});page.on('pageerror',e=>report.errors.push(e.message));await page.goto(local);await page.evaluate(()=>document.fonts.ready);
const visibleItems=()=>page.locator('.catalog-grid__item:not([hidden])').count();
report.interactions.projects=await visibleItems();
await page.locator('[data-country-mode="lot"]').click();report.interactions.mobileLots=await visibleItems();await page.locator('.catalog-grid__more').click();report.interactions.allLots=await visibleItems();
const favorite=page.locator('.catalog-grid__item:not([hidden]) .apartment-card__favorite').first();await favorite.click();report.interactions.favorite=await favorite.getAttribute('aria-pressed');
const filter=page.locator('.catalog-mode-detailed-filters');await filter.click();await page.locator('.country-filter-dialog select[name="price"]').selectOption('100000000');await page.locator('.country-filter-dialog button[type="submit"]').click();report.interactions.priceFilterVisible=await visibleItems();report.interactions.priceFilterValid=await page.locator('.catalog-grid__item:not([hidden])').evaluateAll(items=>items.every(i=>Number(i.dataset.price)<=100000000));
await filter.click();await page.keyboard.press('Escape');report.interactions.filterEscape=await page.locator('.country-filter-dialog').count()===0;report.interactions.filterFocusRestored=await filter.evaluate(e=>e===document.activeElement);
await page.locator('[data-country-mode="project"]').click();const call=page.locator('.catalog-grid__item:not([hidden]) .apartment-card__call-btn').first();await call.click();report.interactions.modalOpen=await page.locator('.catalog-feedback-modal').isVisible();await page.keyboard.press('Escape');report.interactions.modalClosed=!(await page.locator('.catalog-feedback-modal').isVisible());report.interactions.modalFocusRestored=await call.evaluate(e=>e===document.activeElement);
await page.locator('.catalog-best-offers').scrollIntoViewIfNeeded();const getActive=()=>page.locator('.splide__slide.is-visible.is-active:not(.splide__slide--clone) .apartment-card__name').first().textContent();const before=await getActive();await page.locator('.catalog-best-offers__slider').press('ArrowRight');await page.waitForTimeout(100);report.interactions.carouselChanged=(await getActive())!==before;
const faq=page.locator('.catalog-faq__question').first();await faq.click();report.interactions.faqExpanded=await faq.getAttribute('aria-expanded')==='true';
report.pass=report.widths.every(r=>!r.styleDifferences.length&&!r.spacingDifferences.length&&!r.geometryDifferences.length&&!r.target.overflow&&!r.target.brokenImages.length&&!r.target.duplicateIds.length)&&!report.errors.length&&report.interactions.favorite==='true'&&report.interactions.allLots===12&&report.interactions.priceFilterValid&&report.interactions.filterEscape&&report.interactions.filterFocusRestored&&report.interactions.modalOpen&&report.interactions.modalClosed&&report.interactions.modalFocusRestored&&report.interactions.carouselChanged&&report.interactions.faqExpanded;
await fs.mkdir('zagorodnaya-nedvizhimost/verification',{recursive:true});await fs.writeFile('zagorodnaya-nedvizhimost/verification/node-reference-2026-10-12.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({pass:report.pass,interactions:report.interactions,errors:report.errors}));await browser.close();if(!report.pass)process.exitCode=1;
