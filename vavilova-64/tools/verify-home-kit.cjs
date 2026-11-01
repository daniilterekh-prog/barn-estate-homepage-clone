/* Run with the existing Playwright installation; no package installation needed.
   NODE_PATH=<runtime node_modules> node vavilova-64/tools/verify-home-kit.cjs [URL]
   CHROME_PATH can point to an installed Chromium. Never sends a real enquiry. */
const { chromium } = require('playwright')
const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const path = require('node:path')

async function main() {
  const out = path.resolve(__dirname, '../verification/home-kit')
  await fs.mkdir(out, { recursive: true })
  const browser = await chromium.launch({headless: true, executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome'})
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
    const errors = [], failedLocal = []
    page.on('pageerror', e => errors.push(e.message))
    page.on('response', r => { if (r.status() >= 400 && r.url().startsWith('http://127.0.0.1')) failedLocal.push({url:r.url(),status:r.status()}) })
    await page.goto(process.argv[2] || 'http://127.0.0.1:4215/vavilova-64/', { waitUntil: 'domcontentloaded' })
    // The third-party map keeps network activity alive. Wait for actual content.
    await page.waitForFunction(() => document.fonts.check('300 22px "Tilda Sans"') && document.querySelector('.vp-photo img').naturalWidth > 0)
    const measurements = []
    for (const width of [320,360,390,540,768,1024,1440,1920,2560,3840]) {
      await page.setViewportSize({width, height:1000})
      const m = await page.evaluate(() => {
        const style = selector => {
          const e = document.querySelector(selector), c = getComputedStyle(e), r = e.getBoundingClientRect()
          return {font:+c.fontSize.replace('px',''),line:c.lineHeight,weight:c.fontWeight,color:c.color,
            height:r.height,width:r.width,padding:c.padding,gap:c.gap,overflow:e.scrollWidth > e.clientWidth + 1}
        }
        const radiusViolations = [...document.querySelectorAll('body *')].filter(e => ['', '::before', '::after'].some(p => {
          const c = getComputedStyle(e, p || null)
          return ['borderTopLeftRadius','borderTopRightRadius','borderBottomLeftRadius','borderBottomRightRadius'].some(k => parseFloat(c[k]) > 1)
        })).length
        return {width:innerWidth,overflow:document.documentElement.scrollWidth > innerWidth,
          container:style('.vp-inner'),heading:style('.vp-title'),eyebrow:style('.vp-eyebrow'),
          section:style('#characteristics'),passport:style('.vp-cta'),footer:style('.site-footer__callback-btn'),
          copy:style('.detail-about__text'),readmore:style('.detail-about__toggle'),chip:style('.detail-location__category'),
          hero:style('.detail-hero'),photo:style('.vp-photo'),radiusViolations,
          photoLoaded:document.querySelector('.vp-photo img').naturalWidth > 0,
          heroActions:[...document.querySelectorAll('.detail-hero__button')].filter(e=>e.getClientRects().length).length,
          rows:[...document.querySelectorAll('.vp-row')].map(e=>{const [a,b]=e.children;return {
            overlaps:a.getBoundingClientRect().right > b.getBoundingClientRect().left,
            overflow:b.scrollWidth > b.clientWidth + 1
          }})}
      })
      assert.equal(m.overflow, false, `document overflow at ${width}`)
      assert.ok(m.rows.every(r => !r.overlaps && !r.overflow), `passport rows at ${width}`)
      assert.equal(m.passport.overflow, false, `CTA overflow at ${width}`)
      assert.equal(m.radiusViolations, 0, `radii at ${width}`)
      assert.ok(m.photoLoaded)
      assert.equal(m.heading.font, width <= 540 ? 22 : width <= 1440 ? 38 : 44)
      assert.equal(m.passport.height, width <= 540 ? 58 : 70)
      assert.equal(m.footer.height, width <= 540 ? 58 : 70)
      assert.ok(m.readmore.height >= 44 && m.chip.height >= 44)
      assert.equal(m.heroActions, width <= 768 ? 1 : 2)
      assert.ok(m.hero.height >= (width <= 540 ? 520 : width <= 768 ? 560 : width <= 1024 ? 640 : width <= 1440 ? 900 : 1040))
      if (width <= 540) assert.equal(m.photo.height, 168)
      measurements.push(m)
      if ([390,1440].includes(width)) {
        await page.locator('#characteristics').screenshot({path:path.join(out,`passport-${width}.png`)})
      }
    }
    const interactions=[]
    for (const width of [390,1440]) {
      await page.setViewportSize({width,height:1000})
      await page.locator('.vp-cta').click()
      await page.waitForFunction(() => {
        const r=document.querySelector('.catalog-contact').getBoundingClientRect()
        return r.top >= -3 && r.top < innerHeight / 2
      })
      assert.equal(await page.getByRole('textbox',{name:'Ваше имя',exact:true}).count(),1)
      assert.equal(await page.getByRole('textbox',{name:'Номер телефона',exact:true}).count(),1)
      const channels=page.locator('.catalog-contact__method')
      await channels.nth(1).click()
      assert.equal(await channels.nth(1).getAttribute('aria-pressed'),'true')
      assert.equal(await page.locator('.catalog-contact__method[aria-pressed="true"]').count(),1)
      await page.locator('.catalog-contact__input[type="text"]').focus()
      assert.ok(await page.locator('.catalog-contact__input[type="text"]').evaluate(e=>document.activeElement === e))
      await page.locator('.detail-about__toggle').click()
      assert.equal(await page.locator('.detail-about__toggle').getAttribute('aria-expanded'),'true')
      await page.locator('.detail-about__toggle').click()
      assert.equal(await page.locator('.detail-about__toggle').getAttribute('aria-expanded'),'false')
      const faq=page.locator('.catalog-faq__question').first()
      const initialFaq=await faq.getAttribute('aria-expanded')
      await faq.click()
      assert.equal(await faq.getAttribute('aria-expanded'),initialFaq === 'true' ? 'false' : 'true')
      await faq.press('Enter')
      assert.equal(await faq.getAttribute('aria-expanded'),initialFaq)
      const activeGallery=()=>page.locator('.detail-gallery .splide__slide').evaluateAll(slides=>slides.findIndex(s=>s.classList.contains('is-active')))
      const initialSlide=await activeGallery()
      await page.locator('.detail-gallery__nav--next').click()
      assert.notEqual(await activeGallery(),initialSlide)
      await page.locator('.detail-gallery__nav--prev').press('Enter')
      assert.equal(await activeGallery(),initialSlide)
      await page.locator('.vp-cta').focus()
      assert.equal(await page.locator('.vp-cta').evaluate(e=>getComputedStyle(e).outlineWidth),'2px')
      await page.locator('.vp-cta').hover()
      assert.equal(await page.locator('.vp-cta').evaluate(e=>getComputedStyle(e).transform),'none')
      assert.equal(await page.locator('.vp-arrow svg').evaluate(e=>getComputedStyle(e).transform),'none')
      await page.goto(new URL('#characteristics',page.url()).href)
      await page.locator('#characteristics').scrollIntoViewIfNeeded()
      assert.equal(await page.locator('#characteristics').count(),1)
      interactions.push({width,consultation:true,channels:true,fieldFocus:true,expandCollapse:true,faqKeyboard:true,gallery:true,ctaFocus:true,staticArrow:true,anchor:true})
    }
    assert.deepEqual(errors, [])
    assert.deepEqual(failedLocal, [])
    const result={checkedAt:new Date().toISOString(),url:page.url(),measurements,interactions,errors,failedLocal,
      limitation:'No real submission or CRM/analytics verification. Cross-origin map internals excluded.'}
    await fs.writeFile(path.join(out,'checks.json'), JSON.stringify(result,null,2)+'\n')
    console.log(JSON.stringify({widths:measurements.map(m=>m.width),interactions,errors,failedLocal}))
  } finally { await browser.close() }
}
main().catch(e=>{console.error(e);process.exitCode=1})
