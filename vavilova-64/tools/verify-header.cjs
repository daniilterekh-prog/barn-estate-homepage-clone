// Uses the existing Playwright installation; never submits an enquiry.
const {chromium}=require('playwright')
const assert=require('node:assert/strict')
const fs=require('node:fs/promises')
const path=require('node:path')
;(async()=>{
  const out=path.resolve(__dirname,'../verification/header-navigation')
  await fs.mkdir(out,{recursive:true})
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome'})
  try {
    const page=await browser.newPage({reducedMotion:'reduce'})
    const errors=[];page.on('pageerror',e=>errors.push(e.message))
    await page.goto(process.argv[2]||'http://127.0.0.1:4215/vavilova-64/',{waitUntil:'domcontentloaded'})
    await page.waitForFunction(()=>document.querySelectorAll('.site-header__nav-link').length>=9&&document.fonts.check('300 14px "Tilda Sans"'))
    const measurements=[]
    for(const width of [320,390,768,1024,1025,1100,1280,1440,2560]) {
      await page.setViewportSize({width,height:1000})
      const m=await page.evaluate(()=>{
        const nav=document.querySelector('.site-header__inner>.site-header__nav')
        const links=[...nav.querySelectorAll(':scope>.site-header__nav-list>.site-header__nav-item>.site-header__nav-link')]
        const c=getComputedStyle(document.querySelector('.site-header__favorites-count'))
        return {width:innerWidth,visible:nav.getBoundingClientRect().height>0&&getComputedStyle(nav).display!=='none',
          overflow:document.documentElement.scrollWidth>innerWidth,
          links:links.map(a=>({text:a.textContent.trim(),href:a.href,left:a.getBoundingClientRect().left,right:a.getBoundingClientRect().right,top:a.getBoundingClientRect().top})),
          badge:{background:c.backgroundColor,border:c.borderWidth,shadow:c.boxShadow,padding:c.padding,color:c.color}}
      })
      assert.equal(m.visible,width>=1025)
      assert.equal(m.overflow,false)
      assert.equal(m.links.length,9)
      assert.equal(m.badge.background,'rgba(0, 0, 0, 0)')
      assert.equal(m.badge.border,'0px')
      assert.equal(m.badge.shadow,'none')
      if(m.visible)for(const link of m.links)assert.ok(link.left>=0&&link.right<=width,`clipped link ${link.text} at ${width}`)
      measurements.push(m)
      if([390,1280].includes(width))await page.screenshot({path:path.join(out,`hero-${width}.png`)})
    }
    const links=measurements[0].links
    for(const link of links.slice(0,5)) {
      assert.ok(link.href.startsWith(new URL('../',page.url()).href))
      assert.equal((await page.request.get(link.href)).status(),200)
    }
    assert.ok(links.some(l=>l.text==='Медиа'&&l.href==='https://barn-estate.ru/media/'))
    await page.setViewportSize({width:390,height:1000})
    await page.locator('.site-header__icon-btn').first().click()
    assert.equal(await page.locator('.vavilova-site-menu').isVisible(),true)
    assert.equal(await page.locator('.vavilova-site-menu .site-header__nav-link').count(),9)
    await page.keyboard.press('Escape')
    assert.equal(await page.locator('.vavilova-site-menu').isVisible(),false)
    assert.equal(await page.locator('.site-header__icon-btn').first().getAttribute('aria-expanded'),'false')
    await page.setViewportSize({width:1280,height:1000})
    const city=page.locator('.site-header__inner>.site-header__nav .site-header__nav-link').first()
    await city.focus();assert.ok(await city.evaluate(e=>document.activeElement===e))
    await city.click();assert.ok(page.url().includes('/gorodskaya-nedvizhimost/'))
    assert.deepEqual(errors,[])
    await fs.writeFile(path.join(out,'checks.json'),JSON.stringify({checkedAt:new Date().toISOString(),measurements,localDestinations:true,mobileMenu:true,escape:true,keyboardFocus:true,cityNavigation:true,errors},null,2)+'\n')
    console.log('Header verified at nine widths; five sibling pages 200; mobile menu/Escape and city navigation passed.')
  } finally {await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1})
