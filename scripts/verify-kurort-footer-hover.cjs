const { chromium } = require('/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const assert = require('node:assert/strict');
const selectors = ['.site-footer__nav', '.site-footer__column-title', '.site-footer__link', '.site-footer__callback-btn', '.site-footer__bottom', '.site-footer__phone', '.site-footer__logo'];
const properties = ['fontSize', 'fontWeight', 'lineHeight', 'color', 'backgroundColor', 'gridTemplateColumns', 'rowGap', 'columnGap', 'paddingTop', 'paddingBottom', 'marginBottom', 'minHeight'];
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
  try {
    for (const width of [320, 390, 768, 1440, 1920, 2560]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      const ref = await browser.newPage({ viewport: { width, height: 1000 } });
      await Promise.all([page.goto('http://127.0.0.1:8769/kurortnaya/'), ref.goto('http://127.0.0.1:8769/prodazha_sobstvennikam/')]);
      await page.waitForFunction(() => document.querySelector('link[href*="owner-footer.css"]')?.sheet);
      await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });
      await Promise.all([page.evaluate(() => document.fonts.ready), ref.evaluate(() => document.fonts.ready)]);
      const measure = async p => p.evaluate(({ selectors, properties }) => selectors.map(selector => {
        const el = document.querySelector(selector), s = getComputedStyle(el);
        return { selector, values: Object.fromEntries(properties.map(property => [property, s[property]])) };
      }), { selectors, properties });
      assert.deepEqual(await measure(page), await measure(ref), `${width}: footer computed styles match owners-sale`);
      const links = async p => p.locator('.site-footer a').evaluateAll(els => els.map(el => ({ text: el.textContent.trim(), href: el.getAttribute('href') })));
      assert.deepEqual(await links(page), await links(ref), 'Footer links match reference');
      await page.locator('.site-footer').scrollIntoViewIfNeeded();
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No horizontal overflow');
      if ([390, 1440, 2560].includes(width)) await page.locator('.site-footer').screenshot({ path: `/tmp/kurort-owner-footer-${width}.png` });
      const audit = await page.evaluate(() => {
        const gold = 'rgb(231, 200, 143)', probe = document.createElement('span'); document.body.append(probe);
        const failures = [], warm = []; let hoverRules = 0;
        function walk(rules) { for (const r of rules) {
          if (r.cssRules) walk(r.cssRules);
          if (!r.selectorText?.includes(':hover')) continue;
          let selector = r.selectorText.replace(/:hover/g, '').replace(/::(?:before|after)/g, '');
          let exists; try { exists = document.querySelector(selector); } catch { continue; }
          if (!exists) continue;
          hoverRules++;
          for (const prop of ['color', 'background-color', 'border-color', 'fill', 'stroke']) {
            const v = r.style.getPropertyValue(prop); if (!v || v.includes('var(') || v === 'currentcolor') continue;
            probe.style.color = v; const c = getComputedStyle(probe).color;
            const nums = c.match(/[\d.]+/g)?.map(Number); if (!nums || nums.length < 3) continue;
            const [red, green, blue] = nums;
            if (red > 140 && green > 100 && blue < Math.min(red, green) * .8 && red >= green) {
              warm.push({ selector: r.selectorText, prop, value: c });
              if (c !== gold) failures.push({ selector: r.selectorText, prop, value: c });
            }
          }
        }}
        for (const s of document.styleSheets) { try { walk(s.cssRules); } catch {} }
        probe.remove(); return { hoverRules, warm, failures };
      });
      assert.deepEqual(audit.failures, [], `${width}: no yellow hover rules; only kit gold allowed`);
      await page.locator('.site-footer__link').first().hover();
      await page.waitForTimeout(350);
      await page.locator('.site-footer__link').first().hover();
      await page.waitForTimeout(350);
      assert.equal(await page.locator('.site-footer__link').first().evaluate(el => getComputedStyle(el).color), 'rgb(139, 29, 37)');
      await page.locator('.site-footer__callback-btn').evaluate(el => el.scrollIntoView({ block: 'center' }));
      await page.locator('.site-footer__callback-btn').click({ position: { x: 12, y: 20 } });
      await page.locator('.catalog-feedback-modal').waitFor({ state: 'visible' });
      console.log(`PASS ${width}: footer matches reference, callback opens, ${audit.hoverRules} matching hover rules audited; gold rules ${audit.warm.length}`);
      await page.close(); await ref.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
