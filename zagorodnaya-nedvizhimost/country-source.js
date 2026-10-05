(() => {
  const fallback = document.createElement('style');
  fallback.textContent = '.catalog-map{position:relative;overflow:hidden;min-height:565px;background:radial-gradient(ellipse at 55% 45%,#4e554c 0,#323a35 34%,#252b2e 72%)}.catalog-map:after{content:"";position:absolute;inset:-20%;opacity:.26;pointer-events:none;background:repeating-linear-gradient(17deg,transparent 0 90px,#78816f 92px 94px,transparent 96px 155px),repeating-linear-gradient(82deg,transparent 0 130px,#111c21 132px 136px,transparent 138px 210px);transform:rotate(-9deg)}.catalog-map .base-container{position:relative;z-index:1}.catalog-projects-map{background:url("map-canvas.png") center/cover no-repeat!important;overflow:hidden}.catalog-projects-map__canvas{background:transparent!important}.catalog-projects-map__canvas canvas{opacity:0}.catalog-projects-map:after{display:none}@media(max-width:768px){.news-section__slider[data-v-411e09d7] .splide__slide{margin-right:0!important;width:100%!important}}@media (max-width:1024px){.catalog-map{min-height:480px}}@media (max-width:540px){.catalog-map{min-height:420px}}';
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

  const addBestOffers = () => {
    const section = document.querySelector('.catalog-best-offers');
    if (!section || section.querySelector('.apartment-card')) return;
    const row = document.createElement('div');
    row.className = 'catalog-best-offers__slider-row';
    row.setAttribute('data-v-08286baa', '');
    const cards = bestOffers.map(([href, image, name, address, price]) => `
      <li class="splide__slide" data-v-08286baa=""><article data-v-80c326fb="" data-v-08286baa="" class="apartment-card"><a data-v-80c326fb="" class="apartment-card__link" href="${href}" tabindex="-1"><div data-v-80c326fb="" class="apartment-card__media"><img data-v-80c326fb="" src="${image}" alt="${name}" class="apartment-card__image" width="514" height="424" loading="lazy"></div><div data-v-80c326fb="" class="apartment-card__body"><p data-v-80c326fb="" class="apartment-card__name">${name}</p><p data-v-80c326fb="" class="apartment-card__address">${address}</p><div data-v-80c326fb="" class="apartment-card__details"><div data-v-80c326fb="" class="apartment-card__price-row"><p data-v-80c326fb="" class="apartment-card__price">${price}</p></div></div></a></article></li>`).join('');
    row.innerHTML = `<button type="button" class="catalog-best-offers__nav-btn catalog-best-offers__nav-btn--prev" aria-label="Предыдущий слайд" data-v-08286baa=""><svg class="catalog-best-offers__nav-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></button><div class="catalog-best-offers__slider-wrap" data-v-08286baa=""><div class="splide catalog-best-offers__slider splide--slide splide--ltr splide--draggable is-active is-overflow" data-v-08286baa=""><div class="splide__track" data-v-08286baa=""><ul class="splide__list" data-v-08286baa="">${cards}</ul></div></div></div><button type="button" class="catalog-best-offers__nav-btn catalog-best-offers__nav-btn--next" aria-label="Следующий слайд" data-v-08286baa=""><svg class="catalog-best-offers__nav-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></button>`;
    section.append(row);
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
    slider.className = 'splide news-section__slider splide--slide splide--ltr splide--draggable is-active is-overflow';
    slider.setAttribute('data-v-411e09d7', '');
    const cards = news.map(([href, image, title]) => `<li class="splide__slide" data-v-411e09d7="" style="margin-right:40px;width:calc(33.3333% - 26.6667px);"><article data-v-411e09d7="" class="news-section__card"><a data-v-411e09d7="" class="news-section__card-link" href="${href}"><img data-v-411e09d7="" src="${image}" alt="${title}" class="news-section__image" width="540" height="489" loading="lazy"><div data-v-411e09d7="" class="news-section__content"><p data-v-411e09d7="" class="news-section__category">${title}</p><span data-v-411e09d7="" class="news-section__read-more">Читать подробнее</span></div></a></article></li>`).join('');
    slider.innerHTML = `<div class="splide__track" data-v-411e09d7=""><ul class="splide__list" data-v-411e09d7="">${cards}</ul></div>`;
    section.querySelector('.news-section__footer')?.before(slider);
  };

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
