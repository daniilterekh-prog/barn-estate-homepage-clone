(() => {
  const fallback = document.createElement('style');
  fallback.textContent = '.catalog-map{position:relative;overflow:hidden;background:#fff}.catalog-map:after{display:none}.catalog-map .base-container{position:relative;z-index:1}.catalog-projects-map{background:url("map-canvas.png") center/cover no-repeat!important;overflow:hidden}.catalog-projects-map__canvas{background:transparent!important}.catalog-projects-map__canvas canvas{opacity:0}@media(max-width:1920px){.catalog-projects-map{background-image:url("map-canvas-1920.png")!important}}@media(max-width:1440px){.catalog-projects-map{background-image:url("map-canvas-1440.png")!important}}@media(max-width:1024px){.catalog-projects-map{background-image:url("map-canvas-1024.png")!important}}@media(max-width:768px){.catalog-projects-map{background-image:url("map-canvas-768.png")!important}}@media(min-width:541px) and (max-width:1024px){.news-section__slider[data-v-411e09d7] .splide__slide{width:calc(50% - 20px)!important}}@media(max-width:540px){.catalog-projects-map{background-image:url("map-canvas-540.png")!important}.news-section__slider[data-v-411e09d7] .splide__slide{margin-right:0!important;width:100%!important}.catalog-best-offers__slider[data-v-08286baa] .splide__pagination,.news-section__slider[data-v-411e09d7] .splide__pagination{display:flex!important}}@media(min-width:541px){.catalog-best-offers__slider[data-v-08286baa] .splide__pagination,.news-section__slider[data-v-411e09d7] .splide__pagination{display:none!important}}@media(max-width:400px){.catalog-projects-map{background-image:url("map-canvas-390.png")!important}}';
  document.head.appendChild(fallback);

  const bestOffers = [
    ['/kottedzhnye-poselki/papushevo-park/', 'assets/best-papushevo.jpeg', 'Папушево парк', 'Рублёво-Успенское шоссе, 25 от МКАД', 'от 130 000 000 ₽'],
    ['/kottedzhnye-poselki/usadba-anosino/', 'assets/best-anosino.jpg', 'Усадьба Аносино', ', 25 от МКАД', 'Цена по запросу'],
    ['/kottedzhnye-poselki/renessans-park/', 'assets/best-renessans.jpg', 'Ренессанс Парк', 'Новорижское шоссе, 19 от МКАД', 'Цена по запросу'],
    ['/kottedzhnye-poselki/nikolskaya-sloboda/', 'assets/best-nikolskaya.jpg', 'Никольская слобода', 'Новорижское шоссе, 9 от МКАД', 'Цена по запросу'],
    ['/kottedzhnye-poselki/miras/', 'assets/best-zaitsevo.jpg', 'Зайцево Парк', 'Минское шоссе, 19 от МКАД', 'от 85 000 000 ₽'],
  ];

  const news = [
    ['https://barn-estate.ru/media/blog/top-5-kottedzhnykh-poselkov-dlya-vtorogo-doma-v-podmoskove/', 'news-1.png', 'Топ-5 коттеджных поселков для второго дома в Подмосковье'],
    ['https://barn-estate.ru/media/novosti/rossiya-voshla-v-top-10-stran-po-rostu-tsen-na-zhiluyu-nedvizhimost/', 'news-2.jpg', 'Россия вошла в топ-10 стран по росту цен на жилую недвижимость'],
    ['https://barn-estate.ru/media/novosti/tri-proekta-za-230-mlrd-rubley-kak-izmenyatsya-dorogi-ot-moskva-siti-do-novoy-rigi/', 'news-3.jpg', 'Три проекта за 230 млрд рублей: как изменятся дороги от Москва-Сити до Новой Риги'],
    ['https://barn-estate.ru/media/analitika/analiz-rynka-elitnoy-zagorodnoy-nedvizhimosti-podmoskovya-za-2025-god-ot-barnes/', 'news-4.png', 'Анализ рынка элитной загородной недвижимости Подмосковья за 2025 год от BARNES'],
    ['https://barn-estate.ru/media/novosti/novye-pravila-stroitelstva-chastnykh-domov-v-podmoskove-v-2026-godu/', 'news-5.jpg', 'Новые правила строительства частных домов в Подмосковье в 2026 году'],
    ['https://barn-estate.ru/media/novosti/za-chto-mogut-oshtrafovat-vladeltsev-dach-i-uchastkov-/', 'news-6.png', 'За что могут оштрафовать владельцев дач и участков в 2026 году'],
  ];

  const catalogItems = [
    ['https://barn-estate.ru/zagorodnaya-nedvizhimost/575528/', 'assets/grid-01.png', 'Резиденции Березки', 'Рублёво-Успенское шоссе, 15 от мкад', '219 000 000 ₽', '575528', ['1 167 м²', '6']],
    ['https://barn-estate.ru/zagorodnaya-nedvizhimost/595031/', 'assets/grid-02.png', 'Весна', 'Рублёво-Успенское шоссе, 16 от мкад', '239 900 000 ₽', '595031', ['611 м²', '5']],
    ['https://barn-estate.ru/zagorodnaya-nedvizhimost/586385/', 'assets/grid-03.jpg', 'КП Трувиль', 'Минское шоссе, 18 от мкад', '320 000 000 ₽', '586385', ['365 м²', '5']],
    ['https://barn-estate.ru/zagorodnaya-nedvizhimost/562250/', 'assets/grid-04.jpg', 'Павлово', 'Новорижское шоссе, 19 от мкад', '877 923 900 ₽', '562250', ['877 м²', '5']],
    ['https://barn-estate.ru/zagorodnaya-nedvizhimost/593776/', 'assets/grid-05.jpg', 'Княжье Озеро', 'Новорижское шоссе, 25 от мкад', '90 000 000 ₽', '593776', ['260 м²', '3']],
    ['https://barn-estate.ru/zagorodnaya-nedvizhimost/560208/', 'assets/grid-06.jpg', 'Crystal Istra (Кристал Истра)', 'Новорижское шоссе, 18 от мкад', '93 126 600 ₽', '560208', ['583,6 м²', '6']],
    ['https://barn-estate.ru/zagorodnaya-nedvizhimost/587962/', 'assets/grid-07.png', 'Успенские дачи -1', 'Рублёво-Успенское шоссе, 19 от мкад', '825 000 000 ₽', '587962', ['687 м²', '5']],
    ['https://barn-estate.ru/zagorodnaya-nedvizhimost/584131/', 'assets/grid-08.jpg', 'Лес и Река', 'Новорижское шоссе, 15 от мкад', '349 000 000 ₽', '584131', ['600 м²', '4']],
    ['https://barn-estate.ru/zagorodnaya-nedvizhimost/587243/', 'assets/grid-09.jpg', 'Бузланово', 'Новорижское шоссе, 15 от мкад', '50 170 000 ₽', '587243', []],
    ['https://barn-estate.ru/zagorodnaya-nedvizhimost/576274/', 'assets/grid-10.png', 'Миллениум Парк', 'Новорижское шоссе, 24 от мкад', '230 000 000 ₽', '576274', ['478 м²', '4']],
    ['https://barn-estate.ru/zagorodnaya-nedvizhimost/595240/', 'assets/grid-11.jpg', 'Николина Гора', 'Рублёво-Успенское шоссе, 24 от мкад', '210 000 000 ₽', '595240', ['986,8 м²', '3']],
    ['https://barn-estate.ru/zagorodnaya-nedvizhimost/543198/', 'assets/grid-12.jpg', 'Дом в Конаково', 'Ленинградское шоссе', '300 000 000 ₽', '543198', ['1 038 м²', '7']],
  ];

  const syncCatalogGrid = () => {
    const list = document.querySelector('.catalog-grid__list');
    if (!list) return;
    list.innerHTML = catalogItems.map(([href, image, name, address, price, id, stats]) => `<li class="catalog-grid__item" data-v-3935e33d=""><article class="apartment-card apartment-card--catalog" data-v-3935e33d="" data-v-80c326fb=""><div class="apartment-card__media" data-v-80c326fb=""><a class="apartment-card__media-link" href="${href}" data-v-80c326fb=""><img src="${image}" alt="${name}" class="apartment-card__image" width="720" height="540" sizes="768:100vw 480px" loading="lazy" data-v-80c326fb=""></a><button type="button" class="apartment-card__favorite" aria-pressed="false" aria-label="Добавить в избранное" data-v-80c326fb=""><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg></button></div><div class="apartment-card__body" data-v-80c326fb=""><div class="apartment-card__topline" data-v-80c326fb=""><span class="apartment-card__lotid" data-v-80c326fb="">ID ${id}</span></div><a class="apartment-card__name apartment-card__name--link" href="${href}" data-v-80c326fb=""><span class="apartment-card__name-text" data-v-80c326fb="">${name}</span></a><p class="apartment-card__address" data-v-80c326fb="">${address}</p>${stats.length ? `<div class="apartment-card__stats" style="--stats-count:${stats.length};" data-v-80c326fb="">${stats.map((stat, index) => `<div class="apartment-card__stat" data-v-80c326fb=""><b class="apartment-card__stat-value" data-v-80c326fb="">${stat}</b><small class="apartment-card__stat-label" data-v-80c326fb="">${index ? 'Спален' : 'Площадь'}</small></div>`).join('')}</div>` : ''}<p class="apartment-card__price" data-v-80c326fb="">${price}</p></div><div class="apartment-card__actions" data-v-80c326fb=""><button type="button" class="ui-button ui-button--secondary ui-button--medium apartment-card__call-btn" data-v-80c326fb=""> Заказать звонок </button><a class="ui-button ui-button--primary ui-button--medium apartment-card__detail-btn" data-v-80c326fb="" href="${href}"> Подробнее <span class="apartment-card__arrow" aria-hidden="true" data-v-80c326fb=""><svg viewBox="0 0 16 16" fill="none"><path d="M3 13 13 3M6 3h7v7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25"></path></svg></span></a></div></article></li>`).join('');
    const updateVisibility = () => list.querySelectorAll('.catalog-grid__item').forEach((item, index) => { item.style.display = window.innerWidth <= 540 && index >= 5 ? 'none' : ''; });
    updateVisibility();
    window.addEventListener('resize', updateVisibility, { passive: true });
  };

  const addBestOffers = () => {
    const section = document.querySelector('.catalog-best-offers');
    if (!section || section.querySelector('.apartment-card')) return;
    let row = section.querySelector('.catalog-best-offers__slider-row');
    if (!row) {
      row = document.createElement('div');
      row.className = 'catalog-best-offers__slider-row';
      row.setAttribute('data-v-08286baa', '');
      section.append(row);
    }
    const gap = () => window.innerWidth > 1440 ? 90 : window.innerWidth > 1024 ? 24 : window.innerWidth > 768 ? 20 : window.innerWidth > 540 ? 16 : 0;
    const slideMarkup = ([href, image, name, address, price], index, state = '') => `<li class="splide__slide ${state}" data-v-08286baa="" style="margin-right:${gap()}px;"><article data-v-80c326fb="" data-v-08286baa="" class="apartment-card"><a data-v-80c326fb="" class="apartment-card__link" href="${href}" tabindex="-1"><div data-v-80c326fb="" class="apartment-card__media"><img data-v-80c326fb="" src="${image}" alt="${name}" class="apartment-card__image" width="514" height="424" loading="lazy"></div><div data-v-80c326fb="" class="apartment-card__body"><p data-v-80c326fb="" class="apartment-card__name">${name}</p><p data-v-80c326fb="" class="apartment-card__address">${address}</p><div data-v-80c326fb="" class="apartment-card__details"><div data-v-80c326fb="" class="apartment-card__price-row"><p data-v-80c326fb="" class="apartment-card__price">${price}</p></div></div></div></a></article></li>`;
    const cards = [...bestOffers, ...bestOffers, ...bestOffers].map((item, index) => slideMarkup(item, index, index === 4 ? 'is-visible is-prev' : index === 5 ? 'is-active is-visible' : index === 6 ? 'is-visible is-next' : '')).join('');
    const wrap = row.querySelector('.catalog-best-offers__slider-wrap') || (() => { const x = document.createElement('div'); x.className = 'catalog-best-offers__slider-wrap'; x.setAttribute('data-v-08286baa', ''); row.append(x); return x; })();
    wrap.innerHTML = `<div class="splide catalog-best-offers__slider splide--slide splide--ltr splide--draggable is-active is-overflow" data-v-08286baa=""><div class="splide__track" data-v-08286baa="" style="padding-left:0px;padding-right:0px;"><ul class="splide__list" data-v-08286baa="">${cards}</ul></div><ul class="splide__pagination splide__pagination--ltr" role="tablist" aria-label="Select a slide to show" data-v-08286baa=""><li role="presentation"><button class="splide__pagination__page is-active" type="button" role="tab" aria-label="Go to slide 1"></button></li><li role="presentation"><button class="splide__pagination__page" type="button" role="tab" aria-label="Go to slide 2"></button></li><li role="presentation"><button class="splide__pagination__page" type="button" role="tab" aria-label="Go to slide 3"></button></li><li role="presentation"><button class="splide__pagination__page" type="button" role="tab" aria-label="Go to slide 4"></button></li><li role="presentation"><button class="splide__pagination__page" type="button" role="tab" aria-label="Go to slide 5"></button></li></ul></div>`;
    const list = row.querySelector('.splide__list');
    let active = 5;
    const update = () => {
      const slide = list?.querySelector('.splide__slide');
      if (!list || !slide) return;
      const step = slide.getBoundingClientRect().width + gap();
      const offset = window.innerWidth <= 768 ? active : active - 1;
      list.style.transform = `translateX(-${offset * step}px)`;
      list.querySelectorAll('.splide__slide').forEach((item, index) => item.classList.toggle('is-prev', index === active - 1));
      list.querySelectorAll('.splide__slide').forEach((item, index) => item.classList.toggle('is-active', index === active));
      list.querySelectorAll('.splide__slide').forEach((item, index) => item.classList.toggle('is-next', index === active + 1));
    };
    row.querySelector('.catalog-best-offers__nav-btn--prev')?.addEventListener('click', () => { active = active <= 5 ? 9 : active - 1; update(); });
    row.querySelector('.catalog-best-offers__nav-btn--next')?.addEventListener('click', () => { active = active >= 9 ? 5 : active + 1; update(); });
    window.addEventListener('resize', update, { passive: true });
    update();
  };

  const addMap = () => {
    const section = document.querySelector('.catalog-map');
    const container = section?.querySelector('.base-container');
    if (!section || !container || container.querySelector('.catalog-projects-map')) return;
    container.querySelector(':scope > span')?.remove();
    const map = document.createElement('div');
    map.className = 'catalog-projects-map';
    map.setAttribute('data-v-4e8b332d', '');
    map.setAttribute('data-v-725ba8fe', '');
    map.innerHTML = '<div class="catalog-projects-map__canvas" data-v-4e8b332d="" data-v-725ba8fe=""></div>';
    container.append(map);
  };

  const addNews = () => {
    const section = document.querySelector('.news-section');
    if (!section || section.querySelector('.news-section__card')) return;
    section.querySelector('.news-section__inner > span')?.remove();
    const slider = document.createElement('div');
    slider.className = 'splide news-section__slider splide--slide splide--ltr splide--draggable is-active is-overflow is-initialized';
    slider.setAttribute('data-v-411e09d7', '');
    const cards = news.map(([href, image, title]) => `<li class="splide__slide" data-v-411e09d7="" style="margin-right:40px;width:calc(33.3333% - 26.6667px);"><article data-v-411e09d7="" class="news-section__card"><a data-v-411e09d7="" class="news-section__card-link" href="${href}"><img data-v-411e09d7="" src="${image}" alt="${title}" class="news-section__image" width="540" height="489" loading="lazy"><div data-v-411e09d7="" class="news-section__content"><p data-v-411e09d7="" class="news-section__category">${title}</p><span data-v-411e09d7="" class="news-section__read-more">Читать подробнее</span></div></a></article></li>`).join('');
    slider.innerHTML = `<div class="splide__track" data-v-411e09d7=""><ul class="splide__list" data-v-411e09d7="">${cards}</ul></div><ul class="splide__pagination splide__pagination--ltr" role="tablist" aria-label="Select a slide to show" data-v-411e09d7=""><li role="presentation"><button class="splide__pagination__page is-active" type="button" role="tab" aria-label="Go to slide 1"></button></li><li role="presentation"><button class="splide__pagination__page" type="button" role="tab" aria-label="Go to slide 2"></button></li><li role="presentation"><button class="splide__pagination__page" type="button" role="tab" aria-label="Go to slide 3"></button></li><li role="presentation"><button class="splide__pagination__page" type="button" role="tab" aria-label="Go to slide 4"></button></li><li role="presentation"><button class="splide__pagination__page" type="button" role="tab" aria-label="Go to slide 5"></button></li><li role="presentation"><button class="splide__pagination__page" type="button" role="tab" aria-label="Go to slide 6"></button></li></ul>`;
    section.querySelector('.news-section__footer')?.before(slider);
  };

  const syncStaticImagePaths = () => {
    document.querySelectorAll('img[src*="department-"]').forEach((image) => {
      const match = image.getAttribute('src')?.match(/(department-[a-z-]+\.png)$/);
      if (match) image.src = `assets/${match[1]}`;
    });
  };

  syncStaticImagePaths();
  syncCatalogGrid();
  addMap();
  addBestOffers();
  addNews();

  const header = document.querySelector('.site-header');
  const syncHeader = () => header?.classList.toggle('site-header--scrolled', window.scrollY > 36);
  window.addEventListener('scroll', syncHeader, { passive: true });
  syncHeader();
  document.querySelectorAll('.site-header__icon-btn').forEach((button) => button.addEventListener('click', () => header?.classList.toggle('site-header--menu-open')));

  const filterButton = document.querySelector('.catalog-hero-filters__filter-icon');
  filterButton?.addEventListener('click', () => {
    filterButton.classList.toggle('catalog-hero-filters__filter-icon--active');
    filterButton.setAttribute('aria-expanded', String(filterButton.classList.contains('catalog-hero-filters__filter-icon--active')));
  });
  document.querySelector('.catalog-hero-filters__bar')?.addEventListener('submit', (event) => { event.preventDefault(); document.querySelector('#catalog-grid')?.scrollIntoView({ behavior: 'smooth' }); });

  document.querySelectorAll('.catalog-page-nav__link').forEach((button) => button.addEventListener('click', () => {
    const target = button.textContent.trim() === 'Карта' ? '.catalog-map' : button.textContent.trim() === 'Оставить заявку' ? '.catalog-consultation' : '.catalog-best-offers';
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
  }));

  document.querySelectorAll('.catalog-intro__toggle').forEach((button) => button.addEventListener('click', () => {
    const details = button.closest('.catalog-intro__content')?.querySelector('.catalog-intro__details');
    if (!details) return;
    const open = details.getAttribute('aria-hidden') !== 'false';
    details.setAttribute('aria-hidden', String(!open)); details.style.maxHeight = open ? `${details.scrollHeight}px` : '0px'; button.setAttribute('aria-expanded', String(open));
  }));

  document.querySelectorAll('.catalog-faq__question').forEach((button) => button.addEventListener('click', () => {
    const item = button.closest('.catalog-faq__item'); const answer = item?.querySelector('.catalog-faq__answer'); const open = button.getAttribute('aria-expanded') !== 'true';
    item?.classList.toggle('catalog-faq__item--open', open); answer?.classList.toggle('catalog-faq__answer--open', open); button.setAttribute('aria-expanded', String(open));
  }));
  document.querySelectorAll('.catalog-seo-links__more').forEach((button) => button.addEventListener('click', () => {
    button.closest('.catalog-seo-links__group')?.querySelectorAll('li[style*="display:none"], li[style*="display: none"]').forEach((item) => { item.style.display = ''; }); button.setAttribute('aria-expanded', 'true');
  }));
  document.querySelectorAll('.apartment-card__favorite').forEach((button) => button.addEventListener('click', () => { const active = button.getAttribute('aria-pressed') !== 'true'; button.setAttribute('aria-pressed', String(active)); button.classList.toggle('is-active', active); }));
  document.querySelectorAll('.catalog-best-offers__nav-btn, .news-section__nav-btn').forEach((button) => button.addEventListener('click', () => button.closest('section')?.querySelector('.splide__track, .catalog-best-offers__slider-wrap')?.scrollBy({ left: button.classList.contains('catalog-best-offers__nav-btn--prev') ? -520 : 520, behavior: 'smooth' })));
  document.querySelectorAll('.catalog-consultation__form, .catalog-contact__form').forEach((form) => form.addEventListener('submit', (event) => { event.preventDefault(); const submit = form.querySelector('button[type="submit"]'); if (submit) submit.textContent = 'Заявка отправлена'; }));
})();
