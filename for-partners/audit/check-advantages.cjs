const {chromium}=require('playwright');
const assert=require('assert/strict');
const path=require('path');
const fs=require('fs');
(async()=>{
  const checks=[];
  for(const width of [320,375,390,540,768,1024,1280,1440,1920]){
    const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',args:['--disable-dev-shm-usage']});
    const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.route('**/*',r=>r.request().resourceType()==='image'&&(!(width===390||width===1440)||!/media-(01|03|05|06|09|13|26|27|28|29)\.png/.test(r.request().url()))?r.abort():r.continue());
    await page.goto((process.env.BASE_URL||'http://127.0.0.1:4183')+'/for-partners/',{waitUntil:'networkidle'});
    await page.evaluate(()=>document.fonts.ready);
    await page.addStyleTag({content:'html{scroll-behavior:auto!important}.floating-expert{visibility:hidden!important}'});
    const root=page.locator('#advantages');
    await root.scrollIntoViewIfNeeded();
    assert.equal(await root.locator('.splide__slide').count(),10);
    const style=await page.evaluate(()=>{
      const root=document.querySelector('#advantages');
      const css=s=>{const c=getComputedStyle(root.querySelector(s));return {size:parseFloat(c.fontSize),line:parseFloat(c.lineHeight),weight:c.fontWeight,color:c.color}};
      return {h2:css('h2'),lead:css('.ambassadors-advantages__text'),title:css('h3'),body:css('.ambassadors-advantages__description'),overlay:getComputedStyle(root.querySelector('.ambassadors-advantages__overlay')).backgroundColor,
      overflow:document.documentElement.scrollWidth>innerWidth,clipped:[...root.querySelectorAll('.ambassadors-advantages__card-copy')].some(e=>e.getBoundingClientRect().height>e.parentElement.getBoundingClientRect().height)};
    });
    assert.equal(style.title.size,width<=1024?20:24);assert.equal(style.title.weight,'400');
    assert.equal(style.h2.size,width<=1024?22:width>=1441?44:38);assert.equal(style.h2.weight,'300');
    assert.equal(style.lead.size,width<=1024?15:22);assert.equal(style.lead.weight,'300');
    assert.equal(style.body.size,16);assert.equal(style.body.line,22.4);assert.equal(style.body.weight,'400');
    assert.equal(style.overflow,false);assert.equal(style.clipped,false);assert.equal(style.overlay,'rgba(0, 0, 0, 0.12)');
    const firstCard=root.locator('.ambassadors-advantages__card').first();
    const shade=()=>firstCard.evaluate(e=>getComputedStyle(e.querySelector('.ambassadors-advantages__overlay')).backgroundColor);
    assert.equal(await shade(),'rgba(0, 0, 0, 0.12)');
    await firstCard.hover();assert.equal(await shade(),'rgba(0, 0, 0, 0.68)');
    await page.mouse.move(0,0);assert.equal(await shade(),'rgba(0, 0, 0, 0.12)');
    const mediaFillsCard = await root.locator('.ambassadors-advantages__card').first().evaluate(e=>{
      const c=e.getBoundingClientRect(),m=e.querySelector('.ambassadors-advantages__media').getBoundingClientRect();
      return Math.abs(c.width-m.width)<1&&Math.abs(c.height-m.height)<1;
    });
    assert.equal(mediaFillsCard,true);
    const track=root.locator('.splide__track');await track.focus();
    await page.keyboard.press('End');
    assert.equal(await root.locator('.splide__slide').last().getAttribute('aria-hidden'),null);
    assert.equal(await root.locator('[aria-label="Следующее преимущество"]').isDisabled(),true);
    await page.keyboard.press('Home');
    assert.equal(await root.locator('[aria-label="Предыдущее преимущество"]').isDisabled(),true);
    await page.keyboard.press('ArrowRight');
    assert.equal(await root.locator('.splide__slide.is-active').getAttribute('id'),'splide01-slide02');
    await root.locator('[aria-label="Предыдущее преимущество"]').click();
    assert.equal(await root.locator('.splide__slide.is-active').getAttribute('id'),'splide01-slide01');
    if(width===390||width===1440){
      await root.screenshot({path:path.join(__dirname,`advantages-${width}.png`)});
      await track.focus();await page.keyboard.press('End');
      await root.screenshot({path:path.join(__dirname,`advantages-${width}-last.png`)});
    }
    assert.deepEqual(errors,[]);
    checks.push({width,...style,errors,keyboardAndButtons:'PASS'});
    await page.close();
    await browser.close();
  }
  fs.writeFileSync(path.join(__dirname,'advantages-checks.json'),JSON.stringify(checks,null,2)+'\n');
  console.log('PASS: 9 widths, 10 cards, actual kit typography, no overflow/clipping, keyboard and arrows.');
})().catch(e=>{console.error(e);process.exit(1)});
