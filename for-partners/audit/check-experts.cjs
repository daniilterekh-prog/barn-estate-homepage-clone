// Run with Playwright installed and the repository served on port 4183.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
(async () => {
  const browser = await chromium.launch({headless:true, executablePath:process.env.CHROME_PATH || '/usr/bin/google-chrome'});
  const results = [];
  for (const width of [320,375,390,540,768,1024,1280,1440,1920]) {
    const page = await browser.newPage({viewport:{width,height:1000},deviceScaleFactor:1});
    const errors=[];
    page.on('pageerror', e => errors.push(e.message));
    await page.route('**/*', route => route.request().resourceType()==='image' ? route.abort() : route.continue());
    await page.goto((process.env.BASE_URL || 'http://127.0.0.1:4183')+'/for-partners/', {waitUntil:'networkidle'});
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({content:'html{scroll-behavior:auto!important}.floating-expert{visibility:hidden!important}'});
    const actual=await page.evaluate(() => {
      const root=document.querySelector('.barnes-experts');
      const style=selector=>{const s=getComputedStyle(root.querySelector(selector)); return {family:s.fontFamily,size:parseFloat(s.fontSize),line:parseFloat(s.lineHeight),weight:s.fontWeight};};
      const rect=selector=>{const r=root.querySelector(selector).getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom};};
      const box=root.getBoundingClientRect();
      return {count:document.querySelectorAll('.barnes-experts').length,items:root.querySelectorAll('.be-item').length,h1:document.querySelectorAll('h1').length,h2:style('.be-title'),h3:style('h3'),body:style('.be-item p'),eyebrow:style('.be-eyebrow'),heading:rect('.be-heading'),list:rect('.be-list'),container:rect('.base-container'),overflow:[...root.querySelectorAll('*')].filter(e=>{const r=e.getBoundingClientRect();return r.left < -1 || r.right > innerWidth+1;}).map(e=>e.className),previous:root.previousElementSibling?.className,next:root.nextElementSibling?.className,fontLoaded:document.fonts.check('300 16px "Tilda Sans"'),height:box.height};
    });
    assert.equal(actual.count,1); assert.equal(actual.items,4); assert.equal(actual.h1,1);
    assert.deepEqual(actual.overflow,[]); assert.equal(actual.fontLoaded,true);
    assert.equal(actual.h2.size,width<=1024?22:width>=1441?44:38);
    assert.equal(actual.h2.weight,'300'); assert.equal(actual.h3.weight,'400');
    assert.equal(actual.h3.size,width<=1024?18:width>=1441?22:20);
    assert.equal(actual.body.size,16); assert.equal(actual.body.line,22.4); assert.equal(actual.body.weight,'300');
    assert.equal(actual.eyebrow.size,width<=1024?12:14);
    assert.ok(actual.h2.family.includes('Tilda Sans'));
    assert.ok(actual.next.includes('catalog-contact'));
    if(width<=1024) assert.ok(actual.list.top>=actual.heading.bottom+31);
    else assert.ok(actual.list.left>actual.heading.right);
    assert.deepEqual(errors,[]);
    const geometry = await page.evaluate(() => {
      const root=document.querySelector('.barnes-experts');
      const box=root.getBoundingClientRect();
      const textLeft=root.querySelector('.be-layout').getBoundingClientRect().left;
      const prev=root.previousElementSibling;
      const previousText=prev.querySelector('h2').getBoundingClientRect();
      return {pageOverflow:document.documentElement.scrollWidth>innerWidth,
        previousOverlap:prev.getBoundingClientRect().bottom>box.top+1,
        nextOverlap:root.nextElementSibling.getBoundingClientRect().top<box.bottom-1,
        textAligned:Math.abs(textLeft-previousText.left)<1,
        itemOverlap:[...root.querySelectorAll('.be-item')].some(item=>item.querySelector('h3').getBoundingClientRect().bottom>item.querySelector('p').getBoundingClientRect().top)};
    });
    assert.equal(geometry.pageOverflow,false);
    assert.equal(geometry.previousOverlap,false); assert.equal(geometry.nextOverlap,false);
    assert.equal(geometry.textAligned,true); assert.equal(geometry.itemOverlap,false);
    if(width===390 || width===1440) {
      for(let i=0;i<7;i++) {
        if(width===390) await page.locator('.bd-mobile-picker').selectOption(String(i));
        else await page.locator(`[data-pick="${i}"]`).click();
        assert.equal(await page.locator('.bd-navbtn[aria-selected="true"]').getAttribute('data-pick'),String(i));
        assert.equal(await page.locator('.bd-copy h3').textContent(),await page.evaluate(i=>window.BarnesDirectionsData[i].title,i));
      }
    }
    await page.locator('.barnes-experts').screenshot({path:path.join(__dirname,`experts-${width}.png`)});
    results.push({width,...actual,geometry,errors});
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(__dirname,'experts-checks.json'),JSON.stringify(results,null,2)+'\n');
  console.log('PASS: nine viewports, typography, loaded font, semantic structure, layout and no section overflow.');
})().catch(e=>{console.error(e);process.exit(1)});
