/** Verify this folder when served as the document root, without sibling routes. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || '/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');

const root = path.resolve(__dirname, '..');
const base = process.argv[2] || 'http://127.0.0.1:4195/';
const origin = new URL(base).origin;
const report = { base, checks: [], pageErrors: [], missingResources: [], externalRequests: [] };

// Catch dormant CSS URLs too: they may not be requested in the tested states.
for (const name of fs.readdirSync(path.join(root, 'css')).filter(file => file.endsWith('.css'))) {
  const file = path.join(root, 'css', name);
  const css = fs.readFileSync(file, 'utf8');
  for (const match of css.matchAll(/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/g)) {
    const url = match[1];
    if (/^(data:|#)/.test(url)) continue;
    assert.equal(/^https?:/.test(url), false, `${name}: remote CSS resource ${url}`);
    const target = path.resolve(path.dirname(file), decodeURIComponent(url.split('?')[0]));
    assert.ok(target.startsWith(root + path.sep), `${name}: resource outside package ${url}`);
    assert.ok(fs.existsSync(target), `${name}: missing CSS resource ${url}`);
  }
}
for (const match of fs.readFileSync(path.join(root, 'index.html'), 'utf8').matchAll(/(?:src|href)="([^"#?]+\.(?:css|js|png|jpe?g|webp|svg|woff2))(?:\?[^\"]*)?"/g)) {
  const url = match[1];
  if (/^https?:/.test(url)) continue;
  const target = path.resolve(root, decodeURIComponent(url));
  assert.ok(target.startsWith(root + path.sep), `HTML resource outside package: ${url}`);
  assert.ok(fs.existsSync(target), `HTML resource missing: ${url}`);
}

(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
  try {
    for (const width of [320, 390, 540, 541, 768, 1024, 1440, 1920, 2560]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
      page.on('pageerror', error => report.pageErrors.push(`${width}px: ${error.message}`));
      page.on('request', request => {
        if (/^https?:/.test(request.url()) && new URL(request.url()).origin !== origin) report.externalRequests.push(request.url());
      });
      page.on('response', response => {
        if (response.status() >= 400) report.missingResources.push(`${response.status()} ${response.url()}`);
      });
      await page.goto(base, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('.catalog-mode-switch [data-country-mode]');
      await page.evaluate(async () => {
        document.querySelectorAll('img[loading="lazy"]').forEach(image => { image.loading = 'eager'; });
        await document.fonts.ready;
        await Promise.all([...document.images].map(image => Promise.race([
          image.decode().catch(() => {}),
          new Promise(resolve => setTimeout(resolve, 5000))
        ])));
      });
      const data = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        brokenImages: [...document.images].filter(image => !image.naturalWidth).map(image => image.src),
        font: document.fonts.check('400 20px "Tilda Sans"'),
        hero: new URL(document.querySelector('.catalog-hero__image').currentSrc).pathname.split('/').pop(),
        projects: document.querySelectorAll('.catalog-grid__item:not([hidden])').length
      }));
      assert.equal(data.overflow, false, `${width}px horizontal overflow`);
      assert.deepEqual(data.brokenImages, [], `${width}px broken images`);
      assert.equal(data.font, true, `${width}px local Tilda Sans unavailable`);
      assert.equal(data.hero, width <= 540 ? 'hero-estate-mobile.png' : 'hero-estate-desktop.png');
      assert.equal(data.projects, 5, `${width}px project count`);

      await page.locator('[data-country-mode="lot"]').click();
      const lots = width < 768 ? 5 : 12;
      assert.equal(await page.locator('.catalog-grid__item:not([hidden])').count(), lots, `${width}px initial lot count`);
      await page.locator('.catalog-mode-toolbar > .catalog-mode-detailed-filters').click();
      assert.equal(await page.locator('.hero-filter-modal:visible').count(), 1, `${width}px full filters`);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('.hero-filter-modal:visible').count(), 0, `${width}px filter close`);

      await page.locator('.catalog-projects-map__fullscreen').click();
      await page.waitForFunction(() => !!document.querySelector('.country-map-expanded'));
      await page.locator('.catalog-projects-map__exit').click();
      await page.waitForFunction(() => !document.querySelector('.country-map-expanded'));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);

      const call = page.locator('.catalog-grid__item:not([hidden]) .apartment-card__call-btn').first();
      await call.click();
      assert.equal(await page.locator('.catalog-feedback-modal').isVisible(), true, `${width}px request modal`);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('.catalog-feedback-modal').isVisible(), false, `${width}px modal close`);
      report.checks.push({ width, ...data, lots, map: true, fullFilters: true, requestModal: true });
      console.log(`PASS standalone country page ${width}px`);
      await page.close();
    }
    assert.deepEqual([...new Set(report.pageErrors)], [], 'JavaScript errors');
    assert.deepEqual([...new Set(report.missingResources)], [], 'Missing resources');
    assert.deepEqual([...new Set(report.externalRequests)], [], 'External render requests');
    console.log('PASS self-contained package: no external render requests, 404, broken images, or JS errors');
  } finally {
    await browser.close();
    fs.mkdirSync(path.join(root, 'verification'), { recursive: true });
    fs.writeFileSync(path.join(root, 'verification/package.json'), JSON.stringify(report, null, 2) + '\n');
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
