const { chromium } = require('playwright');
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ executablePath: '/home/daniil/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome', args: ['--disable-dev-shm-usage'] });
  try {
    for (const width of (process.env.WIDTHS || '390,1440').split(',').map(Number)) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      // Keep real HTTP requests for the shared icon directory: routing them from
      // Git or mocking responses would hide missing sparse-checkout dependencies.
      await page.route('**/*', route => {
        const request = route.request();
        if (process.env.FOCUSED === '1' && request.resourceType() === 'document') {
          const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
          const header = html.match(/<header class="site-header[\s\S]*?<\/header>/)[0];
          const head = html.slice(0, html.indexOf('</head>') + 7);
          return route.fulfill({ contentType: 'text/html', body: head + '<body style="background:#333"><div class="layout__header" data-v-47bd53e9>' + header + '</div><main class="ambassadors-page" style="height:2000px"><section class="ambassadors-hero" style="height:900px"></section></main><script src="for-partners.js"></script></body></html>' });
        }
        if (request.resourceType() === 'image' && !request.url().includes('/pictures/office-contact/') && !request.url().endsWith('/logo.svg')) return route.abort();
        return route.continue();
      });
      await page.goto('http://127.0.0.1:4183/for-partners/', { waitUntil: 'networkidle' });
      for (const selector of ['.owner-sale-hero-contacts img', '.owner-sale-sticky__messengers img']) {
        const icons = page.locator(selector);
        assert.equal(await icons.count(), 3);
        await page.waitForFunction(selector => [...document.querySelectorAll(selector)].every(img => img.complete && img.naturalWidth > 0), selector);
        for (const img of await icons.all()) {
          const src = await img.getAttribute('src');
          const response = await page.request.get(new URL(src, page.url()).href);
          assert.equal(response.status(), 200, src);
          assert.match(response.headers()['content-type'], /image\/svg\+xml/);
        }
      }
      await page.screenshot({ path: path.join(__dirname, `header-icons-${width}.png`) });
      console.log(`PASS ${width}: all six messenger icons decoded, real HTTP 200 (${process.env.FOCUSED === '1' ? 'focused headers' : 'full page'})`);
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
