// Uses the existing web-capture-toolkit; does not install project dependencies.
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { pathToFileURL } from 'node:url';

const toolkit = process.env.CAPTURE_TOOLKIT;
if (!toolkit) throw new Error('Set CAPTURE_TOOLKIT to the existing web-capture-toolkit checkout.');
const { chromium } = await import(pathToFileURL(path.join(toolkit, 'node_modules/playwright/index.mjs')));
const { PNG } = await import(pathToFileURL(path.join(toolkit, 'node_modules/pngjs/lib/png.js')));
const { default: pixelmatch } = await import(pathToFileURL(path.join(toolkit, 'node_modules/pixelmatch/index.js')));
const widths = process.argv.slice(2).map(Number);
if (!widths.length) widths.push(320, 360, 375, 390, 414, 540, 541, 560, 561, 767, 768, 769, 1024, 1025, 1280, 1281, 1440, 1441, 1920, 2560);
const out = await fs.mkdtemp(path.join(os.tmpdir(), 'barnes-country-audit-'));
const localURL = process.env.COUNTRY_LOCAL_URL || 'http://127.0.0.1:4174/zagorodnaya-nedvizhimost/';
const referenceURL = 'https://barn-estate.ru/zagorodnaya-nedvizhimost/';
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--disable-webgl'] });
let sessions;
const errors = [[], []];
const stabilize = async page => {
  // The reference initializes lazy cards through IntersectionObserver, not just
  // the native loading attribute. Visit every block before decoding its images.
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += 750) {
    await page.evaluate(y => window.scrollTo(0, y), y);
    await page.waitForTimeout(90);
  }
  await page.waitForTimeout(800);
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(async image => {
      image.loading = 'eager';
      await Promise.race([image.decode().catch(() => {}), new Promise(resolve => setTimeout(resolve, 12000))]);
    }));
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(500);
};
const selectors = ['.catalog-hero', '.catalog-best-offers', '.catalog-projects-map', '.catalog-grid', '.catalog-intro', '.catalog-consultation', '.departments-section', '.news-section', '.catalog-seo-links', '.catalog-faq', '.catalog-contact', '.site-footer'];
const properties = ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'color', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'];
const metrics = page => page.evaluate(({ selectors, properties }) => {
  const sections = Object.fromEntries(selectors.map(selector => {
    const element = document.querySelector(selector);
    const r = element.getBoundingClientRect();
    const css = getComputedStyle(element);
    return [selector, { rect: [r.x, r.y + scrollY, r.width, r.height], style: Object.fromEntries(properties.map(name => [name, css[name]])) }];
  }));
  const texts = [...document.querySelectorAll('h1,h2,h3,p,a,button,b,small,label')]
    .filter(element => !element.children.length && element.getBoundingClientRect().width && !element.closest('ymaps3'))
    .map(element => ({ key: `${element.tagName}|${element.className}|${element.textContent.trim()}`, style: Object.fromEntries(properties.map(name => [name, getComputedStyle(element)[name]])) }));
  const map = document.querySelector('.catalog-projects-map');
  const tile = map.querySelector('.ymaps3--tile-layer__container img');
  const tileURL = new URL(tile.src);
  const tileX = Number(tile.dataset.tileX || tileURL.searchParams.get('x'));
  const tileY = Number(tile.dataset.tileY || tileURL.searchParams.get('y'));
  const mapOrigin = {
    clientWidth: map.clientWidth,
    mapStyle: map.querySelector('.ymaps3--map').style.cssText,
    left: parseFloat(tile.style.left) - (tileX - 1237) * 256,
    top: parseFloat(tile.style.top) - (tileY - 641) * 256,
    transform: tile.parentElement.style.transform,
  };
  return {
    width: innerWidth, height: document.body.scrollHeight, sections, texts, mapOrigin,
    fonts: [...document.fonts].filter(font => font.family === 'Tilda Sans').map(font => ({ weight: font.weight, status: font.status })),
    brokenImages: [...document.images].filter(image => image.complete && !image.naturalWidth).map(image => ({ alt: image.alt, source: image.getAttribute('src')?.split('?')[0] })),
    links: [...document.querySelectorAll('a')].map(anchor => ({ text: anchor.textContent.trim(), path: new URL(anchor.href).pathname })),
  };
}, { selectors, properties });
const screenshot = async (index, width, height, fullPage, filename) => {
  const options = { format: 'png' };
  if (fullPage) Object.assign(options, { captureBeyondViewport: true, clip: { x: 0, y: 0, width, height, scale: 1 } });
  const shot = await sessions[index].send('Page.captureScreenshot', options);
  const buffer = Buffer.from(shot.data, 'base64');
  await fs.writeFile(path.join(out, filename), buffer);
  return PNG.sync.read(buffer);
};
const comparePixels = async (a, b, filename) => {
  if (a.width !== b.width || a.height !== b.height) return { dimensionsMatch: false, source: [a.width, a.height], local: [b.width, b.height] };
  const diff = new PNG({ width: a.width, height: a.height });
  const changed = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0, includeAA: true });
  const perceptible = pixelmatch(a.data, b.data, undefined, a.width, a.height, { threshold: 0.01, includeAA: true });
  let maxChannelDifference = 0;
  for (let i = 0; i < a.data.length; i++) maxChannelDifference = Math.max(maxChannelDifference, Math.abs(a.data[i] - b.data[i]));
  if (changed) await fs.writeFile(path.join(out, filename), PNG.sync.write(diff));
  return { dimensionsMatch: true, strictChangedPixels: changed, totalPixels: a.width * a.height, perceptibleChangedPixels: perceptible, maxChannelDifference };
};
const outsideMap = (image, rect) => {
  const copy = new PNG({width:image.width,height:image.height});
  image.data.copy(copy.data);
  const [x,y,w,h] = rect;
  for(let row=Math.max(0,Math.floor(y));row<Math.min(image.height,Math.ceil(y+h));row++) {
    for(let col=Math.max(0,Math.floor(x));col<Math.min(image.width,Math.ceil(x+w));col++) {
      copy.data.fill(255,(row*image.width+col)*4,(row*image.width+col)*4+4);
    }
  }
  return copy;
};
const report = { capturedAt: new Date().toISOString(), referenceURL, localURL, viewportHeight: 900, deviceScaleFactor: 1, reducedMotion: true, renderer: 'Chrome raster (--disable-webgl)', freshNavigationPerWidth: true, scrollSettleMs: 1200, strictThreshold: 0, includeAA: true, toolkitVersions: { playwright: '1.64.0', pixelmatch: '8.0.0' }, widths: [], errors };
for (const width of widths) {
  // A fresh context prevents cross-size image raster caches and map camera state.
  const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const pages = await Promise.all([context.newPage(), context.newPage()]);
  const [source, local] = pages;
  sessions = await Promise.all(pages.map(page => context.newCDPSession(page)));
  pages.forEach((page, index) => page.on('pageerror', error => errors[index].push(error.message)));
  await Promise.all([source.goto(referenceURL, {waitUntil:'domcontentloaded'}), local.goto(localURL, {waitUntil:'domcontentloaded'})]);
  await source.waitForTimeout(4000);
  for (let index = 0; index < pages.length; index++) {
    try {
      await pages[index].locator('.catalog-contact').waitFor({ state: 'attached', timeout: 20000 });
      await pages[index].locator('.catalog-projects-map').scrollIntoViewIfNeeded();
      await pages[index].locator('.ymaps3--tile-layer__container img').first().waitFor({ state: 'attached', timeout: 20000 });
    } catch (error) {
      await fs.writeFile(path.join(out, `failure-${index}-${width}.html`), await pages[index].content());
      console.log('Capture failed', width, index, await pages[index].title(), 'Evidence saved to', out);
      throw error;
    }
  }
  for (const page of pages) await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}*,*::before,*::after{animation:none!important;transition:none!important}.floating-expert{opacity:1!important;transform:none!important}' });
  await Promise.all(pages.map(stabilize));
  const measured = await Promise.all(pages.map(metrics));
  const sectionDifferences = selectors.filter(selector => JSON.stringify(measured[0].sections[selector]) !== JSON.stringify(measured[1].sections[selector]));
  const sourceText = new Map(measured[0].texts.map(text => [text.key, text.style]));
  const localText = new Map(measured[1].texts.map(text => [text.key, text.style]));
  const textStyleDifferences = [...sourceText].filter(([key, style]) => localText.has(key) && JSON.stringify(style) !== JSON.stringify(localText.get(key))).map(([key]) => key);
  const images = await Promise.all(pages.map((page, index) => screenshot(index, width, measured[index].height, true, `${index ? 'local' : 'source'}-${width}-full.png`)));
  const fullPage = await comparePixels(images[0], images[1], `diff-${width}-full.png`);
  const fullPageOutsideMap = await comparePixels(...images.map((image,index) => outsideMap(image,measured[index].sections['.catalog-projects-map'].rect)), `diff-${width}-outside-map.png`);
  const scrollStates = [];
  for (const y of [0, 700, 1400]) {
    await Promise.all(pages.map(page => page.evaluate(y => scrollTo(0, y), y)));
    // Native scrollIntoView({behavior:'smooth'}) is independent of CSS
    // transitions. Let the sticky navigation finish its horizontal scrolling.
    await source.waitForTimeout(1200);
    const shots = await Promise.all(pages.map((page, index) => screenshot(index, width, 900, false, `${index ? 'local' : 'source'}-${width}-y${y}.png`)));
    scrollStates.push({ y, ...await comparePixels(shots[0], shots[1], `diff-${width}-y${y}.png`) });
  }
  const row = { width, sourceHeight: measured[0].height, localHeight: measured[1].height, sectionMetrics: measured[0].sections, mapOrigin: measured.map(data => data.mapOrigin), sectionDifferences, matchingTextElements: [...sourceText.keys()].filter(key => localText.has(key)).length, textStyleDifferences, brokenImages: measured.map(data => data.brokenImages), fullPage, fullPageOutsideMap, scrollStates };
  report.widths.push(row);
  console.log(JSON.stringify({...row,sectionMetrics:undefined}));
  await fs.writeFile(path.join(out, 'report.json'), JSON.stringify(report, null, 2));
  await context.close();
}
await browser.close();
console.log(`Evidence: ${out}`);
