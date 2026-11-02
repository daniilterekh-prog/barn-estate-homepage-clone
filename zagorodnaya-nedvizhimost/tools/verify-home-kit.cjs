/** Check shared BARN Estate home UI-kit v1.0.0 roles on the country node. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || '/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');

const base = process.argv[2] || 'http://127.0.0.1:4195/';
const report = { reference: 'BARN Estate home UI-kit v1.0.0 (2026-11-01)', base, widths: [], errors: [] };
const near = (actual, expected, label, tolerance = 1) => assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: ${actual} !== ${expected}`);

(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
  try {
    for (const width of [320, 390, 540, 541, 768, 1024, 1440, 1441, 1920, 2560, 3840]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
      page.on('pageerror', error => report.errors.push(`${width}px ${error.message}`));
      await page.goto(base, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('.catalog-mode-switch [data-country-mode]');
      await page.evaluate(() => document.fonts.ready);
      const result = await page.evaluate(() => {
        const style = selector => {
          const element = document.querySelector(selector);
          if (!element) return null;
          const css = getComputedStyle(element);
          return { size: parseFloat(css.fontSize), weight: +css.fontWeight, line: parseFloat(css.lineHeight), color: css.color,
            height: element.getBoundingClientRect().height, radius: parseFloat(css.borderRadius),
            paddingTop: parseFloat(css.paddingTop), paddingLeft: parseFloat(css.paddingLeft), minHeight: parseFloat(css.minHeight) };
        };
        const sections = ['.catalog-best-offers', '.catalog-map', '.catalog-grid', '.catalog-intro', '.departments-section', '.news-section', '.catalog-faq'];
        const eyebrowGaps = [...document.querySelectorAll('section h2')].filter(heading => {
          const previous = heading.previousElementSibling;
          return previous && /eyebrow/.test(previous.className);
        }).map(heading => ({ section: heading.className,
          gap: heading.getBoundingClientRect().top - heading.previousElementSibling.getBoundingClientRect().bottom,
          eyebrow: getComputedStyle(heading.previousElementSibling).fontSize }));
        return {
          gutter: parseFloat(getComputedStyle(document.querySelector('.catalog-grid__inner.base-container')).paddingLeft),
          sections: Object.fromEntries(sections.map(selector => [selector, {
            top: parseFloat(getComputedStyle(document.querySelector(selector)).paddingTop),
            bottom: parseFloat(getComputedStyle(document.querySelector(selector)).paddingBottom)
          }])), eyebrowGaps,
          introTitle: style('.catalog-intro__title'), introText: style('.catalog-intro__text p'),
          introToggle: style('.catalog-intro__toggle'), mapText: style('.catalog-map__text'),
          footerCTA: style('.site-footer__callback-btn'), channel: style('.catalog-consultation__method'),
          overflow: document.documentElement.scrollWidth > innerWidth + 1
        };
      });
      const targetGutter = width <= 540 ? 22 : width >= 1921 ? 0 : Math.max(24, Math.min(-26.66667 + width * 0.0659722, 100));
      const sectionSpace = width <= 540 ? 48 : Math.max(72, Math.min(width * 0.06, 100));
      near(result.gutter, targetGutter, `${width}px gutter`);
      for (const [section, padding] of Object.entries(result.sections)) {
        near(padding.top, sectionSpace, `${width}px ${section} top`);
        near(padding.bottom, sectionSpace, `${width}px ${section} bottom`);
      }
      assert.ok(result.eyebrowGaps.length >= 7, `${width}px missing eyebrows`);
      for (const row of result.eyebrowGaps) {
        near(row.gap, width <= 1024 ? 12 : 25, `${width}px ${row.section} eyebrow gap`);
        near(parseFloat(row.eyebrow), width <= 1024 ? 12 : 14, `${width}px ${row.section} eyebrow size`);
      }
      near(result.introTitle.size, width <= 540 ? 22 : width <= 1440 ? 38 : 44, `${width}px intro title size`);
      near(result.introTitle.line, width <= 540 ? 26.4 : width <= 1440 ? 45.6 : 52.8, `${width}px intro title line`);
      near(result.introText.size, width <= 540 ? 14 : 18, `${width}px intro detail size`);
      near(result.introText.line, width <= 540 ? 21 : 27, `${width}px intro detail line`);
      assert.equal(result.introText.color, 'rgb(79, 77, 73)');
      near(result.mapText.line, width <= 540 ? 21 : 33, `${width}px map text line`);
      assert.equal(result.mapText.color, 'rgb(79, 77, 73)');
      near(result.introToggle.height, 44, `${width}px read-more height`);
      near(result.introToggle.size, width <= 540 ? 12 : 14, `${width}px read-more font`);
      near(result.footerCTA.height, width <= 540 ? 58 : 70, `${width}px footer CTA height`);
      near(result.channel.height, 46, `${width}px CTA channel height`);
      near(result.channel.size, width <= 540 ? 18 : 17, `${width}px CTA channel font`);
      assert.equal(result.overflow, false, `${width}px horizontal overflow`);

      await page.locator('[data-country-mode="lot"]').click();

      await page.locator('.catalog-mode-toolbar .catalog-mode-detailed-filters').click();
      const filter = await page.locator('.hero-filter-modal__apply').evaluate(button => ({ height: button.getBoundingClientRect().height, size: parseFloat(getComputedStyle(button).fontSize), radius: parseFloat(getComputedStyle(button).borderRadius) }));
      near(filter.height, width <= 540 ? 58 : 70, `${width}px filter apply height`);
      near(filter.size, width <= 540 ? 18 : width <= 1440 ? 17 : 19, `${width}px filter apply font`);
      near(filter.radius, 1, `${width}px filter apply radius`);
      await page.keyboard.press('Escape');

      if ([390, 1440, 2560].includes(width)) {
        await page.locator('.catalog-grid__item:not([hidden]) .apartment-card__call-btn').first().click();
        const popup = await page.locator('.catalog-feedback-modal').evaluate(modal => {
          const channel = modal.querySelector('.feedback-modal__channels button'), submit = modal.querySelector('.feedback-modal__submit');
          return { channel: { size: parseFloat(getComputedStyle(channel).fontSize), height: channel.getBoundingClientRect().height, radius: parseFloat(getComputedStyle(channel).borderRadius) },
            submit: { size: parseFloat(getComputedStyle(submit).fontSize), height: submit.getBoundingClientRect().height } };
        });
        near(popup.channel.size, width <= 540 ? 18 : 17, `${width}px popup channel font`);
        near(popup.channel.height, 46, `${width}px popup channel height`);
        near(popup.channel.radius, 1, `${width}px popup channel radius`);
        near(popup.submit.size, width <= 540 ? 18 : width <= 1440 ? 17 : 19, `${width}px popup submit font`);
        near(popup.submit.height, width <= 540 ? 58 : 64, `${width}px popup submit height`);
        await page.keyboard.press('Escape');
      }
      const cardStyles = await page.evaluate(() => {
        const kit = document.querySelector('link[href^="css/home-kit-v1.css"]');
        const selectors = ['.apartment-card__name', '.apartment-card__address', '.apartment-card__lotid', '.listing-card-fact__value', '.department-card__title'];
        const properties = ['fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'color', 'backgroundColor', 'borderColor', 'borderRadius', 'padding', 'margin'];
        const snapshot = () => Object.fromEntries(selectors.map(selector => {
          const element = document.querySelector(selector);
          const css = getComputedStyle(element);
          return [selector, Object.fromEntries(properties.map(property => [property, css[property]]))];
        }));
        const withKit = snapshot();
        kit.disabled = true;
        const withoutKit = snapshot();
        kit.disabled = false;
        return { withKit, withoutKit };
      });
      assert.deepEqual(cardStyles.withKit, cardStyles.withoutKit, `${width}px card styles changed by home kit`);
      report.widths.push({ width, gutter: result.gutter, sectionSpace, eyebrowGaps: result.eyebrowGaps.length, cardsUnchanged: true, filter });
      console.log(`PASS home kit roles ${width}px`);
      await page.close();
    }
    assert.deepEqual(report.errors, []);
  } finally {
    await browser.close();
  }
  fs.writeFileSync(path.join(__dirname, '../verification/home-kit-v1.json'), JSON.stringify(report, null, 2) + '\n');
})().catch(error => { console.error(error); process.exitCode = 1; });
