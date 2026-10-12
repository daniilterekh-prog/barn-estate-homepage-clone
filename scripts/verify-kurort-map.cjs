// Run with the existing web-capture-toolkit Playwright installation.
const { chromium } = require(process.env.PLAYWRIGHT_PATH || '/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
  try {
    for (const width of [1440, 390, 2560]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      await page.goto('http://127.0.0.1:8769/kurortnaya/');
      await page.locator('.catalog-projects-map__fullscreen').click();
      const dialog = page.locator('.map-browser');
      await dialog.waitFor({ state: 'visible', timeout: 5000 });
      if (width < 541) await page.getByRole('button', { name: 'Развернуть список объектов' }).click();
      await page.locator('.map-browser__card').first().waitFor();
      assert.equal(await page.locator('.map-browser__card').count(), 32);
      await dialog.getByRole('button',{name:'Увеличить карту',exact:true}).click();
      assert.notEqual(await dialog.locator('.map-browser__backdrop img').evaluate(el=>getComputedStyle(el).transform),'none');
      await dialog.getByRole('button',{name:'Уменьшить карту',exact:true}).click();
      assert.equal(await dialog.getByRole('button',{name:'Уменьшить карту',exact:true}).isDisabled(),true);
      const mapBounds=await dialog.evaluate(el=>el.getBoundingClientRect().toJSON());
      assert.equal(mapBounds.top,0,'Fullscreen map stays at viewport top after zoom');
      assert.equal(mapBounds.height,900,'Fullscreen map fills viewport after zoom');
      assert.deepEqual(await dialog.getByLabel('Локация',{exact:true}).locator('option').allTextContents(),['Локация','Сочи','Анапа','Алтай','Архыз']);
      assert.deepEqual(await dialog.getByLabel('Спальни',{exact:true}).locator('option').allTextContents(),['Спальни','1','2','3','Более 3']);
      assert.deepEqual(await dialog.getByLabel('Тип объекта',{exact:true}).locator('option').allTextContents(),['Тип объекта','Апартаменты','Квартира','Пентхаус']);
      assert.equal(await dialog.getByRole('button',{name:'Новостройки',exact:true}).count(),1);
      assert.equal(await dialog.getByRole('button',{name:'Вторичка',exact:true}).count(),1);
      const referenceFont = await page.locator('.catalog-quick-filters__caption').first().evaluate(el => {
        const s = getComputedStyle(el);
        return { size: s.fontSize, weight: s.fontWeight, color: s.color, family: s.fontFamily };
      });
      for (const selector of ['.map-browser__search input', '[data-filter=type]', '[data-filter=price]', '[data-filter=sort]', '[data-filter=location]', '[data-filter=bedrooms]']) {
        const actualFont = await dialog.locator(selector).evaluate(el => {
          const s = getComputedStyle(el);
          return { size: s.fontSize, weight: s.fontWeight, color: s.color, family: s.fontFamily };
        });
        assert.deepEqual(actualFont, referenceFont, selector + ' must use listing typography');
      }
      const mapIcon = await dialog.locator('.map-browser__field > svg').first().evaluate(el => {
        const s = getComputedStyle(el); return [s.width, s.height, el.getAttribute('stroke-width')];
      });
      const listingIcon = await page.locator('.catalog-quick-filters__icon svg').first().evaluate(el => {
        const s = getComputedStyle(el); return [s.width, s.height, el.querySelector('[stroke-width]').getAttribute('stroke-width')];
      });
      assert.deepEqual(mapIcon, listingIcon, 'parameter icons must match listing dimensions and stroke');
      const mapChevron = await dialog.locator('.map-browser__chevron').first().evaluate(el => {
        const s = getComputedStyle(el); return [s.width, s.height, s.borderBottomWidth, s.borderBottomColor];
      });
      const listingChevron = await page.locator('.catalog-grid__sort').evaluate(el => {
        const s = getComputedStyle(el, '::after'); return [s.width, s.height, s.borderBottomWidth, s.borderBottomColor];
      });
      assert.deepEqual(mapChevron, listingChevron, 'select arrows must match listing sorting arrow');
      assert.equal(await dialog.locator('.map-browser__extra').isVisible(), true);
      const resetFont = await dialog.locator('.map-browser__reset').evaluate(el => {
        const s = getComputedStyle(el); return [s.fontSize, s.fontWeight];
      });
      assert.deepEqual(resetFont, [referenceFont.size, referenceFont.weight]);
      if (process.env.SCREENSHOT_DIR) await page.screenshot({ path: `${process.env.SCREENSHOT_DIR}/map-filters-${width}.png` });
      await page.getByRole('searchbox', { name: 'Поиск объектов на карте' }).fill('GRAND HOTEL');
      assert.equal(await page.locator('.map-browser__card').count(), 1);
      await page.getByRole('searchbox', { name: 'Поиск объектов на карте' }).fill('нет-такого-объекта');
      assert.equal(await page.locator('.map-browser__card').count(), 0);
      await page.getByRole('button', { name: 'Сбросить фильтры' }).click();
      assert.equal(await page.locator('.map-browser__card').count(), 32);
      await dialog.getByLabel('Цена до, ₽').fill('1');
      assert.equal(await page.locator('.map-browser__card').count(), 0);
      await page.getByRole('button', { name: 'Сбросить фильтры' }).click();
      await dialog.getByLabel('Тип объекта', { exact: true }).selectOption('apartment');
      assert.equal(await page.locator('.map-browser__card').count(), 32,'Unannotated snapshot must not pretend to filter property types');
      assert.equal(await dialog.locator('.map-browser__metadata-notice').isVisible(),true);
      await page.getByRole('button', { name: 'Сбросить фильтры' }).click();
      await dialog.getByRole('button', { name: 'Подробные фильтры' }).click();
      const filtersModal = page.locator('.resort-filters');
      await filtersModal.waitFor({ state: 'visible' });
      await filtersModal.locator('.hero-filter-modal__close').click();
      await dialog.getByLabel('Сортировка', { exact: true }).selectOption('asc');
      const prices = await page.locator('.map-browser__card p').allTextContents();
      const numeric = prices.filter(s => /\d/.test(s)).map(s => Number(s.replace(/[^0-9]/g, '')));
      assert.ok(numeric.every((n, i) => i === 0 || n >= numeric[i - 1]));
      await page.getByRole('button', { name: 'Сбросить фильтры' }).click();
      const overflow = await dialog.evaluate(el => el.scrollWidth > el.clientWidth);
      assert.equal(overflow, false);
      await page.keyboard.press('Escape');
      await dialog.waitFor({ state: 'hidden' });
      // Controlled annotated data validates independent type/market filtering, not invented production facts.
      await page.evaluate(()=>window.BarnesMapProjects.splice(0,window.BarnesMapProjects.length,
        {name:'Apartment new',href:'#',image:'map-preview.png',priceRub:10,price:'10 ₽',propertyTypes:['apartment'],market:'new-build',directions:['Сочи'],bedrooms:['1']},
        {name:'Apartment resale',href:'#',image:'map-preview.png',priceRub:20,price:'20 ₽',propertyTypes:['apartment'],market:'secondary',directions:['Анапа'],bedrooms:['2']},
        {name:'Penthouse resale',href:'#',image:'map-preview.png',priceRub:30,price:'30 ₽',propertyTypes:['penthouse'],market:'secondary',directions:['Сочи'],bedrooms:['4+']}));
      await page.locator('.catalog-projects-map__fullscreen').click();
      if(width<541) await dialog.getByRole('button',{name:'Развернуть список объектов'}).click();
      await dialog.getByLabel('Тип объекта',{exact:true}).selectOption('apartment');
      assert.equal(await dialog.locator('.map-browser__card').count(),1);
      await dialog.getByRole('button',{name:'Вторичка',exact:true}).click();
      assert.deepEqual(await dialog.locator('.map-browser__card h3').allTextContents(),['Apartment resale']);
      await dialog.getByRole('button',{name:'Новостройки',exact:true}).click();
      assert.deepEqual(await dialog.locator('.map-browser__card h3').allTextContents(),['Apartment new']);
      await dialog.getByRole('button',{name:'Сбросить фильтры'}).click();
      assert.equal(await dialog.locator('.map-browser__card').count(),1);
      await dialog.getByRole('button',{name:'Вторичка',exact:true}).click();
      await dialog.getByLabel('Локация',{exact:true}).selectOption('Сочи');
      assert.equal(await dialog.locator('.map-browser__card').count(),1);
      await dialog.getByLabel('Спальни',{exact:true}).selectOption('4+');
      assert.deepEqual(await dialog.locator('.map-browser__card h3').allTextContents(),['Penthouse resale']);
      await dialog.getByRole('button',{name:'Сбросить фильтры'}).click();
      assert.equal(await dialog.locator('.map-browser__card').count(),2);
      assert.equal(await dialog.getByRole('button',{name:'Новостройки',exact:true}).getAttribute('aria-pressed'),'false');
      await dialog.getByRole('button',{name:'Закрыть полноэкранный режим карты'}).click();
      assert.equal(await page.evaluate(() => document.body.style.overflow), '');
      assert.equal(await page.locator('.catalog-projects-map__fullscreen').evaluate(el => el === document.activeElement), true);
      await page.locator('.catalog-projects-map__fullscreen').click();
      await page.getByRole('button', { name: 'Закрыть полноэкранный режим карты' }).click();
      await dialog.waitFor({ state: 'hidden' });
      console.log(`PASS: map panel ${width}px — search, price, reset, close, focus, overflow`);
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
