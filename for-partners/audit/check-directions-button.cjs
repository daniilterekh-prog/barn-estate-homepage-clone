const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const assert=require('assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'/home/daniil/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome',args:['--disable-dev-shm-usage','--disable-gpu']});
 try{
  const page=await browser.newPage();
  const css=fs.readFileSync(path.join(__dirname,'../assets/directions/directions.css'),'utf8');
  const results=[];
  for(const width of [320,390,768,1440,1920]){
   await page.setViewportSize({width,height:1000});
   await page.setContent(`<style>${css}</style><div id="barnes-directions"><div class="bd-copy"><div></div><div></div><div></div><div></div><button class="bd-cta">Отправить заявку <span aria-hidden="true">↗</span></button></div></div>`);
   const actual=await page.locator('.bd-cta').evaluate(e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return {width:r.width,panel:e.parentElement.getBoundingClientRect().width,height:r.height,font:s.fontSize,weight:s.fontWeight,radius:s.borderRadius,padding:s.paddingLeft,left:r.left,panelLeft:e.parentElement.getBoundingClientRect().left};});
   assert.ok(actual.width<actual.panel);assert.equal(actual.left,actual.panelLeft);
   assert.equal(actual.height,width<=540?58:70);assert.equal(actual.font,width<=540?'18px':width>=1441?'19px':'17px');assert.equal(actual.weight,'400');assert.equal(actual.radius,'1px');assert.equal(actual.padding,width<=540?'24px':width>=1441?'47px':'36px');
   results.push({viewport:width,...actual,status:'PASS'});
  }
  fs.writeFileSync(path.join(__dirname,'directions-button-checks.json'),JSON.stringify(results,null,2)+'\n');console.log('PASS: compact UI-kit button at 320/390/768/1440/1920');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
