(() => {

  const syncCatalogGrid = () => {
    const list = document.querySelector('.catalog-grid__list');
    if (!list) return;
    let expanded = false;
    const update = () => list.querySelectorAll('.catalog-grid__item').forEach((item, index) => {
      if (list.dataset.nodeReady) return;
      item.style.display = window.innerWidth < 768 && !expanded && index >= 5 ? 'none' : '';
    });
    document.querySelector('.catalog-grid__more')?.addEventListener('click', () => { expanded = true; update(); });
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



  const addFloatingExpert = () => { document.querySelector('.floating-expert__close')?.addEventListener('click',()=>document.querySelector('.floating-expert')?.remove()); };

  const syncStaticImagePaths = () => {
    document.querySelectorAll('img[src*="department-"]').forEach((image) => {
      const match = image.getAttribute('src')?.match(/(department-[a-z-]+\.png)$/);
      if (match) image.src = `assets/${match[1]}`;
    });
  };

  syncStaticImagePaths();
  syncCatalogGrid();
  addMap();


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
    if (document.body.classList.contains('country-node-page')) return;
    header?.classList.toggle('site-header--scrolled', window.scrollY > 36);
    const visible = window.scrollY > 320;
    pageNav?.classList.toggle('catalog-page-nav--visible', visible);
    if (visible && !pageNavWasVisible) requestAnimationFrame(() => { measurePageNav(); observePageNav(); syncPageNav(); });
    pageNavWasVisible = visible;
  };
  window.addEventListener('scroll', syncHeader, { passive: true });
  syncHeader();


  const filterButton = document.querySelector('.catalog-hero-filters__filter-icon');
  filterButton?.addEventListener('click', () => {
    if (document.body.classList.contains('country-node-page')) return;
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
    if (document.body.classList.contains('country-node-page')) return;
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
  document.querySelectorAll('.catalog-best-offers__nav-btn').forEach((button) => button.addEventListener('click', () => button.closest('section')?.querySelector('.splide__track, .catalog-best-offers__slider-wrap')?.scrollBy({ left: button.classList.contains('catalog-best-offers__nav-btn--prev') ? -520 : 520, behavior: 'smooth' })));
  document.querySelectorAll('.catalog-consultation__form, .catalog-contact__form').forEach((form) => form.addEventListener('submit', (event) => { event.preventDefault(); if (!form.reportValidity()) return; let status = form.querySelector('[role="status"]'); if (!status) { status = document.createElement('p'); status.setAttribute('role', 'status'); form.append(status); } status.textContent = 'Онлайн-отправка пока не подключена. Свяжись с нами по телефону +7 (495) 182-50-79.'; }));
})();
