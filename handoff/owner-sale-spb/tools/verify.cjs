const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/home/daniil/.local/share/codex-toolkit/node_modules/playwright');
const sharp=require(process.env.SHARP_MODULE||'/home/daniil/.local/share/codex-toolkit/node_modules/sharp');
const root=path.resolve(__dirname,'..'),out=path.join(root,'verification');fs.mkdirSync(out,{recursive:true});
const packageUrl=process.env.PACKAGE_URL||'http://127.0.0.1:8771/html/index.html';
const sourceUrl=process.env.SOURCE_URL||'http://127.0.0.1:8769/barn-estate-homepage-clone/prodazha_sobstvennikam_spb/';
async function ready(page,url){
 await page.goto(url,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
 for(const image of await page.locator('img[src]').all())await image.evaluate(i=>{i.loading='eager';return i.decode()});
 await page.waitForFunction(()=>document.querySelector('.floating-expert__avatar img')?.complete);
 await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important}'});
}
async function capture(page,selector,name){
 const el=page.locator(selector);await el.scrollIntoViewIfNeeded();
 await page.addStyleTag({content:'header,footer,.site-header,.site-footer,.owner-sale-sticky,.floating-expert{visibility:hidden!important}'});
 const original=await el.getAttribute('style');
 const geometry=await el.evaluate(e=>{const r=e.getBoundingClientRect();return{width:r.width,height:r.height}});
 await el.evaluate(e=>{const w=e.getBoundingClientRect().width;for(const[k,v]of Object.entries({position:'fixed',top:'0px',left:'0px',width:w+'px','z-index':'2147483647'}))e.style.setProperty(k,v,'important')});
 const buffer=await el.screenshot({animations:'disabled'});fs.writeFileSync(path.join(out,name+'.png'),buffer);
 await el.evaluate((e,value)=>{if(value===null)e.removeAttribute('style');else e.setAttribute('style',value)},original);
 return{buffer,geometry};
}
(async()=>{
 const browser=await chromium.launch({headless:true}),report=[],parity=[];
 for(const width of [320,390,768,1440,1920,2560]){
  const reference={};
  if([390,1440].includes(width)){
   const p=await browser.newPage({viewport:{width,height:1000},deviceScaleFactor:1});await ready(p,sourceUrl);
   for(const[key,selector]of Object.entries({hero:'.owner-sale-hero',consultation:'#request',newsletter:'#newsletter'}))reference[key]=await capture(p,selector,width+'-source-'+key);
   await p.close();
  }
  const p=await browser.newPage({viewport:{width,height:1000},deviceScaleFactor:1}),errors=[],failed=[],external=[],posts=[];
  p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)failed.push({url:r.url(),status:r.status()})});
  p.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()?.errorText}));
  p.on('request',r=>{if(r.method()==='POST')posts.push(r.url());if(/^https?:/.test(r.url())&&new URL(r.url()).origin!==new URL(packageUrl).origin)external.push(r.url())});
  await ready(p,packageUrl);
  assert.match(await p.locator('h1').innerText(),/Санкт-Петербурге/);
  assert.equal(await p.locator('.owner-sale-types').count(),0);
  if(reference.hero){
   for(const[key,selector]of Object.entries({hero:'.owner-sale-hero',consultation:'#request',newsletter:'#newsletter'})){
    const actual=await capture(p,selector,width+'-package-'+key),expected=reference[key];
    assert.ok(Math.abs(actual.geometry.width-expected.geometry.width)<.1&&Math.abs(actual.geometry.height-expected.geometry.height)<.1,'Geometry '+width+' '+key);
    const a=await sharp(expected.buffer).ensureAlpha().raw().toBuffer({resolveWithObject:true}),b=await sharp(actual.buffer).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    assert.equal(a.info.width,b.info.width);assert.equal(a.info.height,b.info.height);
    let pixels=0;for(let i=0;i<a.data.length;i+=4)if(a.data.subarray(i,i+4).some((v,j)=>v!==b.data[i+j]))pixels++;
    const ratio=pixels/(a.info.width*a.info.height);assert.ok(ratio<.001,'Image difference '+width+' '+key+': '+ratio);
    parity.push({width,section:key,geometry:actual.geometry,differentPixels:pixels,ratio});
    await sharp(actual.buffer).webp({quality:86}).toFile(path.join(root,'design',width+'-'+key+'.webp'));
   }
   await p.addStyleTag({content:'header,footer,.site-header,.site-footer,.owner-sale-sticky,.floating-expert{visibility:visible!important}'});
  }
  await p.locator('.about-company__read-more').click();assert.equal(await p.locator('.about-company__read-more').getAttribute('aria-expanded'),'true');
  const trigger=p.locator('.owner-sale-hero__button');await trigger.click();const dialog=p.locator('.home-owner-host [role=dialog]');await dialog.waitFor();
  await dialog.locator('img').evaluate(i=>i.decode());assert.match(await dialog.locator('img').getAttribute('src'),/ludmila-belousova-color-hq/);
  await dialog.locator('button[type=submit]').click();assert.match(await dialog.locator('[role=status]').innerText(),/имя/);
  await dialog.locator('input[name=name]').fill('Тест');await dialog.locator('input[name=phone]').fill('+7 (999) 123-45-67');
  const consent=dialog.locator('input[type=checkbox]');await consent.focus();await p.keyboard.press('Space');assert.ok(await consent.isChecked());
  await dialog.locator('button[type=submit]').click();assert.match(await dialog.locator('[role=status]').innerText(),/превью|подключ/i);
  await p.keyboard.press('Escape');await dialog.waitFor({state:'detached'});assert.ok(await trigger.evaluate(e=>e===document.activeElement));
  const email=p.locator('#newsletter-email');await email.fill('bad-email');await p.locator('#newsletter button').click();assert.ok(await email.evaluate(e=>e.validity.typeMismatch));
  await email.fill('owner@example.test');await email.press('Tab');assert.ok(await p.locator('#newsletter button').evaluate(e=>e===document.activeElement));
  await p.locator('#newsletter button').click();assert.match(await p.locator('#newsletter [data-preview-status]').innerText(),/не подключена/);
  const avatar=await p.locator('.floating-expert__avatar').evaluate(e=>e.querySelector('img').getBoundingClientRect().width/e.getBoundingClientRect().width);assert.ok(Math.abs(avatar-1.4)<.005);
  await p.evaluate(()=>scrollTo(0,0));assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);assert.deepEqual(external,[]);assert.deepEqual(posts,[]);
  report.push({width,localResources:true,browserErrors:0,httpErrors:0,externalRequests:0,postRequests:0,overflow:false,expertDialog:true,validation:true,keyboard:true,newsletter:true,avatarScale:avatar});await p.close();
 }
 await browser.close();const result={checkedAt:new Date().toISOString(),packageUrl,sourceUrl,widths:report,parity};
 fs.writeFileSync(path.join(root,'VERIFICATION.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
})().catch(e=>{console.error(e);process.exit(1)});
