const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/home/daniil/.local/share/codex-toolkit/node_modules/playwright');
const sharp=require(process.env.SHARP_MODULE||'/home/daniil/.local/share/codex-toolkit/node_modules/sharp');
const root=path.resolve(__dirname,'..'),out=path.join(root,'verification');fs.mkdirSync(out,{recursive:true});fs.mkdirSync(path.join(root,'design'),{recursive:true});
const packageUrl=process.env.PACKAGE_URL||'http://127.0.0.1:8796/html/index.html';
const sourceUrl=process.env.SOURCE_URL||'http://127.0.0.1:8795/sobstvenniki-uzel/';
async function ready(page,url){
 await page.goto(url,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
 for(const image of await page.locator('img[src]').all())await image.evaluate(i=>{i.loading='eager';return i.decode()});
 await page.waitForFunction(()=>document.querySelector('.floating-expert__avatar img')?.complete);
 await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important}'});
}
async function capture(page,selector,name){
 const el=page.locator(selector);await el.scrollIntoViewIfNeeded();
 await page.addStyleTag({content:'.site-header,.site-footer,.owner-sale-sticky,.floating-expert{visibility:hidden!important}'});
 const geometry=await el.evaluate(e=>{const r=e.getBoundingClientRect();return{width:r.width,height:r.height}});
 const buffer=await el.screenshot({animations:'disabled'});
 return{buffer,geometry};
}
(async()=>{
 const browser=await chromium.launch({headless:true}),report=[],parity=[];
 for(const width of [320,390,540,768,1024,1440,1920,2560]){
  const reference={};
  if([390,1440].includes(width)){
   const p=await browser.newPage({viewport:{width,height:1000},deviceScaleFactor:1});await ready(p,sourceUrl);
   for(const[key,selector]of Object.entries({hero:'.owner-sale-hero',consultation:'#request',services:'.owner-sale-types',advantages:'#why-barnes'}))reference[key]=await capture(p,selector,width+'-source-'+key);
   await p.close();
  }
  const p=await browser.newPage({viewport:{width,height:1000},deviceScaleFactor:1}),errors=[],failed=[],external=[],posts=[];
  p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)failed.push({url:r.url(),status:r.status()})});
  p.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()?.errorText}));
  p.on('request',r=>{if(r.method()==='POST')posts.push(r.url());if(/^https?:/.test(r.url())&&new URL(r.url()).origin!==new URL(packageUrl).origin)external.push(r.url())});
  await ready(p,packageUrl);
  assert.equal(await p.locator('h1').innerText(),'Услуги собственникам недвижимости');
  assert.equal(await p.locator('.owner-sale-types__card').count(),4);
  assert.equal(await p.locator('.owner-sale-services .splide__slide').count(),5);
  if(reference.hero){
   for(const[key,selector]of Object.entries({hero:'.owner-sale-hero',consultation:'#request',services:'.owner-sale-types',advantages:'#why-barnes'})){
    const actual=await capture(p,selector,width+'-package-'+key),expected=reference[key];
    assert.ok(Math.abs(actual.geometry.width-expected.geometry.width)<.1&&Math.abs(actual.geometry.height-expected.geometry.height)<.1,'Geometry '+width+' '+key);
    const a=await sharp(expected.buffer).ensureAlpha().raw().toBuffer({resolveWithObject:true}),b=await sharp(actual.buffer).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    assert.equal(a.info.width,b.info.width);assert.equal(a.info.height,b.info.height);
    let pixels=0;for(let i=0;i<a.data.length;i+=4)if(a.data.subarray(i,i+4).some((v,j)=>v!==b.data[i+j]))pixels++;
    const ratio=pixels/(a.info.width*a.info.height);assert.ok(ratio<.001,'Image difference '+width+' '+key+': '+ratio);
    parity.push({width,section:key,geometry:actual.geometry,differentPixels:pixels,ratio});
    await sharp(actual.buffer).webp({quality:86}).toFile(path.join(root,'design',width+'-'+key+'.webp'));
   }
   await p.addStyleTag({content:'.site-header,.site-footer,.owner-sale-sticky,.floating-expert{visibility:visible!important}'});
  }
  const tabs=p.locator('#why-barnes [role=tab]');await tabs.nth(1).click();assert.equal(await tabs.nth(1).getAttribute('aria-selected'),'true');await tabs.nth(1).press('End');assert.equal(await tabs.last().getAttribute('aria-selected'),'true');
  const slider=p.locator('.owner-sale-services__slider');await slider.scrollIntoViewIfNeeded();await slider.focus();await slider.press('End');assert.notEqual(await p.locator('.owner-sale-services .splide__list').evaluate(e=>e.style.transform),'translateX(0px)');await slider.press('Home');
  const trigger=p.locator('.owner-sale-hero__button');await trigger.click();const dialog=p.locator('.home-owner-host [role=dialog]');await dialog.waitFor();
  await dialog.locator('img').evaluate(i=>i.decode());assert.match(await dialog.locator('img').getAttribute('src'),/modal-ruslan-organic/);
  await dialog.locator('button[type=submit]').click();assert.match(await dialog.locator('[role=status]').innerText(),/имя/);
  await dialog.locator('input[name=name]').fill('Тест');await dialog.locator('input[name=phone]').fill('+7 (999) 123-45-67');
  const consent=dialog.locator('input[type=checkbox]');await consent.focus();await p.keyboard.press('Space');assert.ok(await consent.isChecked());
  await dialog.locator('button[type=submit]').click();assert.match(await dialog.locator('[role=status]').innerText(),/превью|подключ/i);
  await p.keyboard.press('Escape');await dialog.waitFor({state:'detached'});assert.ok(await trigger.evaluate(e=>e===document.activeElement));
  const links=await p.locator('.owner-sale-types__card').evaluateAll(a=>a.map(e=>e.href));assert(links.every((v,i)=>v.endsWith(i===3?'/arenda_sobstvennikam/':'/prodazha_sobstvennikam/')));
  if(width===390){const menu=p.locator('.site-header .site-header__icon-btn').first();await p.evaluate(()=>scrollTo(0,0));await menu.click();await p.locator('.site-menu').waitFor({state:'visible'});await p.keyboard.press('Escape');assert.equal(await menu.getAttribute('aria-expanded'),'false');}
  const geometry=await p.locator('.owner-hub-page').evaluate(e=>[...e.children].map(n=>({class:n.className,id:n.id,height:n.getBoundingClientRect().height,padding:getComputedStyle(n).padding})));
  if([390,1440].includes(width)){const roles=await p.evaluate(()=>['h1','.owner-sale-types__title','#panorama-title','.owner-sale-services__text','.owner-sale-strategy__title'].map(s=>{const e=document.querySelector(s);if(!e)return{selector:s};const c=getComputedStyle(e);return{selector:s,font:c.fontFamily,size:c.fontSize,lineHeight:c.lineHeight,weight:c.fontWeight,letterSpacing:c.letterSpacing,color:c.color}}));fs.writeFileSync(path.join(root,'design',width+'-metrics.json'),JSON.stringify({sections:geometry,roles},null,2));}
  await p.evaluate(()=>scrollTo(0,0));assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);assert.deepEqual(external,[]);assert.deepEqual(posts,[]);
  report.push({width,localResources:true,browserErrors:0,httpErrors:0,externalRequests:0,postRequests:0,overflow:false,expertDialog:true,validation:true,keyboard:true,tabs:true,sliderKeyboard:true,serviceLinks:true});await p.close();
 }
 await browser.close();const result={checkedAt:new Date().toISOString(),packageUrl,sourceUrl,widths:report,parity};
 fs.writeFileSync(path.join(root,'VERIFICATION.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
})().catch(e=>{console.error(e);process.exit(1)});
