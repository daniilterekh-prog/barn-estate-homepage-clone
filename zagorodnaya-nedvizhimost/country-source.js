(() => {

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

  const syncCatalogGrid = () => {
    const list = document.querySelector('.catalog-grid__list');
    if (!list) return;
    let expanded = false;
    const update = () => list.querySelectorAll('.catalog-grid__item').forEach((item, index) => {
      item.style.display = window.innerWidth < 768 && !expanded && index >= 5 ? 'none' : '';
    });
    document.querySelector('.catalog-grid__more')?.addEventListener('click', () => { expanded = true; update(); });
    window.addEventListener('resize', update, { passive: true });
    update();
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
    const gap = () => window.innerWidth > 1440 ? 90 : window.innerWidth > 1024 ? 24 : window.innerWidth > 768 ? 16 : window.innerWidth > 540 ? 12 : 0;
    const mobile = () => window.innerWidth <= 540;
    const slideMarkup = ([href, image, name, address, price], index, state = '') => `<li class="splide__slide ${state}" data-v-08286baa="" style="${mobile() ? 'width:calc(100%);' : `margin-right:${gap()}px;`}"><article data-v-80c326fb="" data-v-08286baa="" class="apartment-card"><a data-v-80c326fb="" class="apartment-card__link" href="${href}" tabindex="-1"><div data-v-80c326fb="" class="apartment-card__media"><img data-v-80c326fb="" src="${image}" alt="${name}" class="apartment-card__image" width="514" height="424" loading="lazy"></div><div data-v-80c326fb="" class="apartment-card__body"><p data-v-80c326fb="" class="apartment-card__name">${name}</p><p data-v-80c326fb="" class="apartment-card__address">${address}</p><div data-v-80c326fb="" class="apartment-card__details"><div data-v-80c326fb="" class="apartment-card__price-row"><p data-v-80c326fb="" class="apartment-card__price">${price}</p></div></div></div></a></article></li>`;
    const sourceSlides = mobile() ? bestOffers : [...bestOffers, ...bestOffers, ...bestOffers];
    const cards = sourceSlides.map((item, index) => {
      const state = mobile() ? (index === 0 ? 'is-active is-visible' : index === 1 ? 'is-next' : '') : index === 4 ? 'splide__slide--clone is-visible is-prev' : index === 5 ? 'is-active is-visible' : index === 6 ? 'is-visible is-next' : index < 5 || index >= 10 ? 'splide__slide--clone' : '';
      return slideMarkup(item, index, state);
    }).join('');
    const wrap = row.querySelector('.catalog-best-offers__slider-wrap') || (() => { const x = document.createElement('div'); x.className = 'catalog-best-offers__slider-wrap'; x.setAttribute('data-v-08286baa', ''); row.append(x); return x; })();
    wrap.innerHTML = `<div class="splide catalog-best-offers__slider splide--slide ${mobile() ? '' : 'splide--loop '}splide--ltr splide--draggable is-active is-overflow is-initialized" data-v-08286baa="" aria-label="Новые старты ЖК" role="region" aria-roledescription="carousel"><div class="splide__track ${mobile() ? 'splide__track--slide' : 'splide__track--loop'} splide__track--ltr splide__track--draggable" data-v-08286baa="" style="padding-left:0px;padding-right:0px;"><ul class="splide__list" data-v-08286baa="">${cards}</ul></div><ul class="splide__pagination splide__pagination--ltr" role="tablist" aria-label="Select a slide to show" data-v-08286baa=""><li role="presentation"><button class="splide__pagination__page is-active" type="button" role="tab" aria-label="Go to slide 1"></button></li><li role="presentation"><button class="splide__pagination__page" type="button" role="tab" aria-label="Go to slide 2"></button></li><li role="presentation"><button class="splide__pagination__page" type="button" role="tab" aria-label="Go to slide 3"></button></li><li role="presentation"><button class="splide__pagination__page" type="button" role="tab" aria-label="Go to slide 4"></button></li><li role="presentation"><button class="splide__pagination__page" type="button" role="tab" aria-label="Go to slide 5"></button></li></ul></div>`;
    const list = row.querySelector('.splide__list');
    let active = mobile() ? 0 : 5;
    const update = () => {
      const slide = list?.querySelector('.splide__slide');
      if (!list || !slide) return;
      const step = slide.getBoundingClientRect().width + gap();
      const offset = mobile() ? active : active - 1;
      list.style.transform = `translateX(-${offset * step}px)`;
      list.querySelectorAll('.splide__slide').forEach((item, index) => item.classList.toggle('is-prev', index === active - 1));
      list.querySelectorAll('.splide__slide').forEach((item, index) => item.classList.toggle('is-active', index === active));
      list.querySelectorAll('.splide__slide').forEach((item, index) => item.classList.toggle('is-next', index === active + 1));
      row.querySelectorAll('.splide__pagination__page').forEach((item, index) => item.classList.toggle('is-active', index === active));
    };
    row.querySelectorAll('.splide__pagination__page').forEach((button, index) => button.addEventListener('click', () => { active = index; update(); }));
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
    map.innerHTML = '<div class="catalog-projects-map__canvas" data-v-4e8b332d="" data-v-725ba8fe=""></div><div class="catalog-projects-map__link-proxy" aria-hidden="true"><a href="https://yandex.ru/legal/maps_termsofuse/?lang=ru_RU" target="_blank" rel="noopener">Условия использования</a><a href="https://yandex.ru/maps/?from=api-maps&amp;utm_source=jsapi&amp;ll=37.61842300000002%2C55.75124399999371&amp;origin=jsapi_3&amp;z=11&amp;l=map" target="_blank" rel="noopener"></a></div>';
    container.append(map);
  };

  const addNews = () => {
    const section = document.querySelector('.news-section');
    if (!section || section.querySelector('.news-section__card')) return;
    section.querySelector('.news-section__inner > span')?.remove();
    const slider = document.createElement('div');
    slider.className = 'splide news-section__slider splide--slide splide--ltr splide--draggable is-active is-overflow is-initialized';
    slider.setAttribute('data-v-411e09d7', '');
    const cards = news.map(([href, image, title], index) => `<li class="splide__slide ${index === 0 ? 'is-active is-visible' : index === 1 ? 'is-visible is-next' : ''}" data-v-411e09d7="" style="margin-right:40px;width:calc(33.3333% - 26.6667px);"><article data-v-411e09d7="" class="news-section__card"><a data-v-411e09d7="" class="news-section__card-link" href="${href}"><img data-v-411e09d7="" src="${image}" alt="${title}" class="news-section__image" width="540" height="489" loading="lazy"><div data-v-411e09d7="" class="news-section__content"><p data-v-411e09d7="" class="news-section__category">${title}</p><span data-v-411e09d7="" class="news-section__read-more">Читать подробнее</span></div></a></article></li>`).join('');
    slider.innerHTML = `<div class="splide__track splide__track--slide splide__track--ltr splide__track--draggable" data-v-411e09d7=""><ul class="splide__list" data-v-411e09d7="">${cards}</ul></div><ul class="splide__pagination splide__pagination--ltr" role="tablist" aria-label="Select a slide to show" data-v-411e09d7=""><li role="presentation"><button class="splide__pagination__page is-active" type="button" role="tab" aria-label="Go to slide 1"></button></li><li role="presentation"><button class="splide__pagination__page" type="button" role="tab" aria-label="Go to slide 2"></button></li><li role="presentation"><button class="splide__pagination__page" type="button" role="tab" aria-label="Go to slide 3"></button></li><li role="presentation"><button class="splide__pagination__page" type="button" role="tab" aria-label="Go to slide 4"></button></li><li role="presentation"><button class="splide__pagination__page" type="button" role="tab" aria-label="Go to slide 5"></button></li><li role="presentation"><button class="splide__pagination__page" type="button" role="tab" aria-label="Go to slide 6"></button></li></ul>`;
    section.querySelector('.news-section__footer')?.before(slider);
    const list = slider.querySelector('.splide__list');
    const update = (active) => {
      const slide = list?.querySelector('.splide__slide');
      if (!list || !slide || window.innerWidth > 540) return;
      list.style.transform = `translateX(-${active * slide.getBoundingClientRect().width}px)`;
      list.querySelectorAll('.splide__slide').forEach((item, index) => {
        item.classList.toggle('is-active', index === active);
        item.classList.toggle('is-next', index === active + 1);
        item.classList.toggle('is-visible', index === active || index === active + 1);
      });
      slider.querySelectorAll('.splide__pagination__page').forEach((button, index) => button.classList.toggle('is-active', index === active));
    };
    slider.querySelectorAll('.splide__pagination__page').forEach((button, index) => button.addEventListener('click', () => update(index)));
  };

  const addFloatingExpert = () => {
    if (document.querySelector('.floating-expert')) return;
    const aside = document.createElement('aside');
    aside.className = 'floating-expert floating-expert--alexander';
    aside.setAttribute('data-v-553bd346', '');
    aside.setAttribute('aria-label', 'Михаил Долгов');
    aside.innerHTML = '<button data-v-553bd346 type="button" class="floating-expert__card" aria-haspopup="dialog"><span data-v-553bd346 class="floating-expert__avatar"><img data-v-553bd346 src="../pictures/floating-expert/alexander-dolgov.webp" alt="Михаил Долгов" width="72" height="72" loading="lazy" decoding="async"></span><span data-v-553bd346 class="floating-expert__content"><span data-v-553bd346 class="floating-expert__label">Руководитель департамента загородной недвижимости</span><span data-v-553bd346 class="floating-expert__title">Задать вопрос эксперту</span><span data-v-553bd346 class="floating-expert__name">Михаил Долгов</span></span></button><button data-v-553bd346 type="button" class="floating-expert__close" aria-label="Скрыть карточку Михаил Долгов"></button>';
    aside.querySelector('.floating-expert__close')?.addEventListener('click', () => aside.remove());
    aside.querySelector('.floating-expert__card')?.addEventListener('click', () => document.querySelector('.catalog-consultation')?.scrollIntoView({ behavior: 'smooth' }));
    document.body.append(aside);
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
  addFloatingExpert();

  const favoritesLink = document.querySelector('.site-header__favorites-btn');
  if (favoritesLink && !favoritesLink.querySelector('.site-header__favorites-count')) {
    const count = document.createElement('span');
    count.className = 'site-header__favorites-count';
    count.setAttribute('data-v-7912d681', '');
    count.textContent = '1';
    favoritesLink.append(count);
  }

  const header = document.querySelector('.site-header');
  const pageNav = document.querySelector('.catalog-page-nav');
  let pageNavWasVisible = false;
  const syncHeader = () => {
    header?.classList.toggle('site-header--scrolled', window.scrollY > 36);
    const visible = window.scrollY > 320;
    pageNav?.classList.toggle('catalog-page-nav--visible', visible);
    if (visible && !pageNavWasVisible) requestAnimationFrame(() => { measurePageNav(); observePageNav(); syncPageNav(); });
    pageNavWasVisible = visible;
  };
  window.addEventListener('scroll', syncHeader, { passive: true });
  syncHeader();
  document.querySelectorAll('.site-header__icon-btn').forEach((button) => button.addEventListener('click', () => header?.classList.toggle('site-header--menu-open')));

  const filterButton = document.querySelector('.catalog-hero-filters__filter-icon');
  filterButton?.addEventListener('click', () => {
    filterButton.classList.toggle('catalog-hero-filters__filter-icon--active');
    filterButton.setAttribute('aria-expanded', String(filterButton.classList.contains('catalog-hero-filters__filter-icon--active')));
  });
  document.querySelector('.catalog-hero-filters__bar')?.addEventListener('submit', (event) => { event.preventDefault(); document.querySelector('#catalog-grid')?.scrollIntoView({ behavior: 'smooth' }); });

  const pageNavTargets = ['#catalog-new-starts', '#catalog-map', '#catalog-consultation', '#catalog-departments', '#catalog-news'];
  const pageNavButtons = [...document.querySelectorAll('.catalog-page-nav__link')];
  let navigating = false;
  let navigationTimer;
  let observer;
  let activeIndex = -1;
  const navOffset = () => (pageNav?.offsetHeight || 101) + 12;
  const setActive = (active) => {
    if (active === activeIndex) return;
    activeIndex = active;
    pageNavButtons.forEach((button, index) => button.classList.toggle('catalog-page-nav__link--active', index === active));
    pageNavButtons[active]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };
  const measurePageNav = () => {
    document.documentElement.style.setProperty('--catalog-sticky-nav-top', '0px');
    document.documentElement.style.setProperty('--catalog-sticky-nav-height', `${pageNav?.offsetHeight || 0}px`);
  };
  const syncPageNav = () => {
    if (navigating) return;
    measurePageNav();
    const marker = window.scrollY + navOffset();
    let active = 0;
    pageNavTargets.forEach((selector, index) => {
      const section = document.querySelector(selector);
      if (section && section.getBoundingClientRect().top + window.scrollY <= marker) active = index;
    });
    setActive(active);
  };
  const navigate = (index) => {
    const section = document.querySelector(pageNavTargets[index]);
    if (!section) return;
    navigating = true;
    setActive(index);
    clearTimeout(navigationTimer);
    window.scrollTo({ top: Math.max(0, section.getBoundingClientRect().top + window.scrollY - navOffset()), behavior: 'smooth' });
    navigationTimer = setTimeout(() => { navigating = false; syncPageNav(); }, 700);
  };
  const observePageNav = () => {
    observer?.disconnect();
    const ratios = new Map();
    observer = new IntersectionObserver(entries => {
      if (navigating) return;
      entries.forEach(entry => ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0));
      let selected = -1;
      let highest = -1;
      let nearest = Infinity;
      pageNavTargets.forEach((selector, index) => {
        const section = document.querySelector(selector);
        const ratio = ratios.get(section?.id) || 0;
        if (!section || ratio <= 0) return;
        const top = section.getBoundingClientRect().top;
        if (ratio > highest || (ratio === highest && top < nearest)) { selected = index; highest = ratio; nearest = top; }
      });
      if (highest > 0 && selected !== activeIndex) setActive(selected);
      else syncPageNav();
    }, { root: null, rootMargin: `-${navOffset()}px 0px -45% 0px`, threshold: [0, .15, .35, .55, .75, 1] });
    pageNavTargets.forEach(selector => { const section = document.querySelector(selector); if (section) observer.observe(section); });
  };
  pageNavButtons.forEach((button, index) => button.addEventListener('click', () => navigate(index)));
  document.querySelector('.catalog-page-nav__request')?.addEventListener('click', () => navigate(2));
  window.addEventListener('scroll', syncPageNav, { passive: true });
  window.addEventListener('resize', () => { measurePageNav(); observePageNav(); syncPageNav(); }, { passive: true });
  measurePageNav();
  observePageNav();
  syncPageNav();
  if (pageNav) new ResizeObserver(() => { measurePageNav(); observePageNav(); syncPageNav(); }).observe(pageNav);

  document.querySelectorAll('.catalog-intro__toggle').forEach((button) => button.addEventListener('click', () => {
    const details = button.closest('.catalog-intro__content')?.querySelector('.catalog-intro__details');
    if (!details) return;
    const open = details.getAttribute('aria-hidden') !== 'false';
    details.setAttribute('aria-hidden', String(!open)); details.style.maxHeight = open ? `${details.scrollHeight}px` : '0px'; button.setAttribute('aria-expanded', String(open));
    button.querySelector('.ui-more-link__label').textContent = open ? 'свернуть' : 'читать далее';
  }));

  document.querySelectorAll('.catalog-faq__question').forEach((button) => button.addEventListener('click', () => {
    const item = button.closest('.catalog-faq__item'); const answer = item?.querySelector('.catalog-faq__answer'); const open = button.getAttribute('aria-expanded') !== 'true';
    item?.classList.toggle('catalog-faq__item--open', open); answer?.classList.toggle('catalog-faq__answer--open', open); button.setAttribute('aria-expanded', String(open));
  }));
  document.querySelectorAll('.catalog-seo-links__more').forEach((button) => button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.closest('.catalog-seo-links__group')?.querySelectorAll('li').forEach((item, index) => { if (index >= 3) item.style.display = open ? '' : 'none'; });
    button.setAttribute('aria-expanded', String(open));
    button.querySelector('.ui-more-link__label').textContent = open ? 'Скрыть' : 'Показать все';
  }));
  document.querySelectorAll('.apartment-card__favorite').forEach((button) => button.addEventListener('click', () => { const active = button.getAttribute('aria-pressed') !== 'true'; button.setAttribute('aria-pressed', String(active)); button.classList.toggle('is-active', active); }));
  document.querySelectorAll('.catalog-best-offers__nav-btn, .news-section__nav-btn').forEach((button) => button.addEventListener('click', () => button.closest('section')?.querySelector('.splide__track, .catalog-best-offers__slider-wrap')?.scrollBy({ left: button.classList.contains('catalog-best-offers__nav-btn--prev') ? -520 : 520, behavior: 'smooth' })));
  document.querySelectorAll('.catalog-consultation__form, .catalog-contact__form').forEach((form) => form.addEventListener('submit', (event) => { event.preventDefault(); const submit = form.querySelector('button[type="submit"]'); if (submit) submit.textContent = 'Заявка отправлена'; }));
})();
