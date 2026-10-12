/* Capture only public UI states; never send forms to the reference site. */
const fs = require('node:fs/promises');
const { chromium } = require('/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const url = 'https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost';
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const result = {};
  const load = async () => { await page.goto(url, { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(1800); };
  await load();
  await page.evaluate(async () => { for (let y=0;y<document.body.scrollHeight;y+=800) { scrollTo(0,y); await new Promise(r=>setTimeout(r,60)); } scrollTo(0,0); });
  await page.waitForTimeout(700);
  result.html = await page.content();
  const css = () => page.evaluate(() => [...document.styleSheets].map(s => { try { return [...s.cssRules].map(r=>r.cssText).join('\n'); } catch { return ''; } }));
  const sheets = new Set(await css());
  await page.locator('.catalog-hero-filters__filter-icon').click(); await page.waitForTimeout(400);
  result.filters = await page.locator('.hero-filter-modal').evaluate(e=>e.outerHTML);
  (await css()).forEach(s=>sheets.add(s));
  await load(); await page.locator('.apartment-card--catalog .apartment-card__call-btn').first().click(); await page.waitForTimeout(400);
  result.callback = await page.locator('.feedback-modal').evaluate(e=>e.outerHTML);
  (await css()).forEach(s=>sheets.add(s));
  await load(); await page.locator('.site-header__icon-btn').first().click(); await page.waitForTimeout(300);
  result.menu = await page.locator('.site-menu').evaluate(e=>e.outerHTML);
  (await css()).forEach(s=>sheets.add(s));
  result.css = [...sheets].join('\n');
  await fs.writeFile('/tmp/barnes-international-capture.json', JSON.stringify(result));
  console.log(JSON.stringify(Object.fromEntries(Object.entries(result).map(([k,v])=>[k,v.length]))));
  await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1;});
