/* Offline interaction layer for the imported source components. */
(() => {
  const one = (selector, root = document) => root.querySelector(selector);
  const all = (selector, root = document) => [...root.querySelectorAll(selector)];
  const header = one('.site-header');
  const menuButton = one('.site-header__icon-btn');
  const nav = one('.catalog-page-nav');
  let dialog = null;
  let returnFocus = null;
  const originalMenuIcon = menuButton?.innerHTML;
  one('.catalog-hero-filters__search-input')?.setAttribute('aria-label', 'Поиск по ID, названию ЖК, адресу');
  one('.catalog-projects-map__search-input')?.setAttribute('aria-label', 'Поиск в видимой области карты');

  function closeDialog() {
    dialog?.remove(); dialog = null;
    document.body.style.removeProperty('overflow');
    header?.classList.remove('site-header--menu-open');
    menuButton?.setAttribute('aria-expanded', 'false');
    if (menuButton && originalMenuIcon) menuButton.innerHTML = originalMenuIcon;
    one('.catalog-hero-filters__filter-icon')?.setAttribute('aria-expanded', 'false');
    returnFocus?.focus({ preventScroll: true });
  }

  function openDialog(kind, trigger) {
    closeDialog(); returnFocus = trigger || document.activeElement;
    const template = document.getElementById(`source-${kind}`);
    if (!template) return;
    dialog = template.content.firstElementChild.cloneNode(true);
    document.body.prepend(dialog);
    document.body.style.overflow = 'hidden';
    if (kind === 'menu') {
      header?.classList.add('site-header--menu-open');
      menuButton?.setAttribute('aria-expanded', 'true');
      const svg = menuButton?.querySelector('svg');
      if (svg) svg.innerHTML = '<path d="M5 5l14 14M19 5 5 19"></path>';
    }
    if (kind === 'filters') one('.catalog-hero-filters__filter-icon')?.setAttribute('aria-expanded', 'true');
    all('.modal__close,.vfm__overlay,.hero-filter-modal__close,.hero-filter-modal__backdrop', dialog).forEach(e => e.addEventListener('click', closeDialog));
    bindForms(dialog);
    bindFilters(dialog);
    const first = one('input:not([tabindex="-1"]),button,a[href]', dialog);
    first?.focus({ preventScroll: true });
  }

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeDialog();
    if (event.key !== 'Tab' || !dialog) return;
    const focusable = all('button,a[href],input,select,textarea,[tabindex="0"]', dialog).filter(e => !e.disabled && e.getClientRects().length);
    if (dialog.classList.contains('site-menu') && menuButton) focusable.unshift(menuButton);
    if (!focusable.length) return;
    if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable.at(-1).focus(); }
    else if (!event.shiftKey && document.activeElement === focusable.at(-1)) { event.preventDefault(); focusable[0].focus(); }
  });
  menuButton?.addEventListener('click', () => dialog?.classList.contains('site-menu') ? closeDialog() : openDialog('menu', menuButton));
  one('.catalog-hero-filters__filter-icon')?.addEventListener('click', event => openDialog('filters', event.currentTarget));
  all('.apartment-card__call-btn,.site-footer__callback-btn,.catalog-contact__card-submit,.floating-expert__card').forEach(e => e.addEventListener('click', () => openDialog('callback', e)));
  one('.floating-expert__close')?.addEventListener('click', () => one('.floating-expert')?.remove());

  const scrollToSection = selector => one(selector)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  all('.catalog-page-nav__link').forEach((button, index) => button.addEventListener('click', () => scrollToSection(['.catalog-map', '.catalog-consultation', '.news-section'][index])));
  one('.catalog-page-nav__request')?.addEventListener('click', () => scrollToSection('.catalog-consultation'));
  function onScroll() {
    const scrolled = scrollY > 100;
    header?.classList.toggle('site-header--scrolled', scrolled);
    nav?.classList.toggle('catalog-page-nav--visible', scrollY >= (one('.catalog-hero')?.offsetHeight || 644) - 110);
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  all('.catalog-faq__question').forEach((button, index) => {
    const item = button.closest('.catalog-faq__item');
    const answer = one('.catalog-faq__answer', item);
    answer.id = `commercial-answer-${index}`;
    button.setAttribute('aria-controls', answer.id);
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(open));
      item.classList.toggle('catalog-faq__item--open', open);
      answer.classList.toggle('catalog-faq__answer--open', open);
    });
  });
  one('.catalog-intro__toggle')?.addEventListener('click', event => {
    const button = event.currentTarget;
    const details = one('#catalog-intro-details');
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    details.setAttribute('aria-hidden', String(!open));
    details.style.maxHeight = open ? `${details.scrollHeight}px` : '0px';
    one('.ui-more-link__label', button).textContent = open ? 'свернуть' : 'читать далее';
  });
  all('[role="tablist"]').forEach(list => all('[role="tab"]', list).forEach(button => button.addEventListener('click', () => {
    all('[role="tab"]', list).forEach(tab => {
      const active = tab === button;
      tab.setAttribute('aria-selected', String(active));
      for (const prefix of ['catalog-consultation', 'catalog-contact']) tab.classList.toggle(`${prefix}__method--active`, active && tab.classList.contains(`${prefix}__method`));
    });
  })));

  const cardContainer = one('.catalog-grid__list') || one('.apartment-card')?.parentElement;
  const cards = cardContainer ? all('.apartment-card', cardContainer) : [];
  const number = value => Number(value.replace(/[^\d,.]/g, '').replace(',', '.'));
  const price = card => number(one('.apartment-card__price', card)?.textContent || '0');
  const area = card => number(one('.apartment-card__stat-value', card)?.textContent || '0');
  one('.catalog-grid__sort-select')?.addEventListener('change', event => {
    const order = event.target.value;
    const sorted = order === 'relevance' ? [...cards] : [...cards].sort((a, b) => {
      const read = order.startsWith('price') ? price : area;
      return (read(a) - read(b)) * (order.endsWith('desc') ? -1 : 1);
    });
    sorted.forEach(card => cardContainer.append(card.closest('.catalog-grid__item') || card));
  });
  all('.apartment-card__favorite').forEach(button => button.addEventListener('click', () => {
    const active = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(active));
    button.setAttribute('aria-label', active ? 'Удалить из избранного' : 'Добавить в избранное');
    button.classList.toggle('apartment-card__favorite--active', active);
  }));
  one('.catalog-hero-filters__bar')?.addEventListener('submit', event => {
    event.preventDefault();
    const query = one('.catalog-hero-filters__search-input').value.trim().toLowerCase();
    cards.forEach(card => { card.hidden = query && !card.textContent.toLowerCase().includes(query); });
    scrollToSection('.catalog-grid');
  });
  one('.catalog-grid__more')?.addEventListener('click', () => {
    location.href = 'https://front.barnes.vsavr.ru/kommercheskaya-nedvizhimost/?page=2';
  });

  function bindFilters(root) {
    all('.hero-filter-panel__reset', root).forEach(button => button.addEventListener('click', () => all('input', root).forEach(input => { input.value = ''; input.checked = false; })));
    all('button', root).filter(e => /показать.*объект/i.test(e.textContent)).forEach(button => button.addEventListener('click', () => { closeDialog(); scrollToSection('.catalog-grid'); }));
  }

  function bindForms(root) {
    all('form:not(.catalog-hero-filters__bar)', root).forEach(form => {
      all('input:not([tabindex="-1"]),textarea', form).forEach(input => {
        if (!input.getAttribute('aria-label')) input.setAttribute('aria-label', input.type === 'checkbox' ? 'Согласие на обработку персональных данных' : input.placeholder || 'Комментарий');
      });
      form.addEventListener('submit', event => {
        event.preventDefault();
        const name = one('input[autocomplete="name"]', form) || one('input[type="text"]:not([tabindex="-1"])', form);
        const phone = one('input[type="tel"]', form);
        const consent = one('input[type="checkbox"]', form);
        if (name) name.required = true;
        if (phone) { phone.required = true; phone.setCustomValidity(phone.value.replace(/\D/g, '').length < 10 ? 'Введите номер телефона' : ''); }
        if (consent) consent.required = true;
        if (!form.reportValidity()) return;
        let status = one('.source-form-status', form);
        if (!status) { status = document.createElement('p'); status.className = 'source-form-status'; status.setAttribute('role', 'status'); form.append(status); }
        status.textContent = 'Для отправки заявки свяжитесь с BARNES: +7 (495) 182-50-79.';
      });
    });
  }
  bindForms(document);

  const slider = one('.news-section .splide__list');
  const slides = slider ? all('.splide__slide', slider) : [];
  const newsButtons = all('.news-section__nav-btn');
  let slideIndex = 0;
  const pagination = document.createElement('ul');
  pagination.className = 'splide__pagination splide__pagination--ltr';
  pagination.setAttribute('role', 'tablist');
  pagination.setAttribute('aria-label', 'Выберите слайд');
  slides.forEach((slide, index) => {
    const item = document.createElement('li'); item.setAttribute('role', 'presentation');
    const button = document.createElement('button'); button.type = 'button';
    button.className = 'splide__pagination__page'; button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', slide.id); button.setAttribute('aria-label', `Перейти к слайду ${index + 1}`);
    button.addEventListener('click', () => { slideIndex = index; renderSlider(); });
    item.append(button); pagination.append(item);
  });
  one('.news-section .splide')?.append(pagination);
  function renderSlider() {
    if (!slider || !slides.length) return;
    const count = innerWidth <= 560 ? 1 : innerWidth <= 1024 ? 2 : 3;
    const gap = innerWidth <= 560 ? 24 : 40;
    slideIndex = Math.min(Math.max(0, slideIndex), slides.length - count);
    const step = slides[0].getBoundingClientRect().width + gap;
    slider.style.transform = `translateX(${-slideIndex * step}px)`;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-visible', i >= slideIndex && i < slideIndex + count);
      slide.setAttribute('aria-hidden', String(i < slideIndex || i >= slideIndex + count));
    });
    pagination.hidden = innerWidth > 540;
    all('button', pagination).forEach((button, i) => {
      button.classList.toggle('is-active', i === slideIndex);
      button.setAttribute('aria-selected', String(i === slideIndex));
      button.tabIndex = i === slideIndex ? 0 : -1;
    });
    if (newsButtons[0]) newsButtons[0].disabled = slideIndex === 0;
    if (newsButtons[1]) newsButtons[1].disabled = slideIndex === slides.length - count;
  }
  newsButtons[0]?.addEventListener('click', () => { slideIndex--; renderSlider(); });
  newsButtons[1]?.addEventListener('click', () => { slideIndex++; renderSlider(); });
  let touchX = 0;
  slider?.addEventListener('touchstart', event => { touchX = event.touches[0].clientX; }, { passive: true });
  slider?.addEventListener('touchend', event => { const delta = touchX - event.changedTouches[0].clientX; if (Math.abs(delta) > 30) { slideIndex += delta > 0 ? 1 : -1; renderSlider(); } }, { passive: true });

  const map = one('.catalog-projects-map');
  const mapPositions = map ? all('.ymaps3--tile-layer__container img,.ymaps3--marker', map).map(element => ({ element, left: parseFloat(element.style.left), top: parseFloat(element.style.top), transform: element.style.transform })) : [];
  function resizeMap() {
    if (!map) return;
    const engine = one('.ymaps3--map', map);
    if (engine) { engine.style.width = `${map.clientWidth}px`; engine.style.height = `${map.clientHeight}px`; }
    const states = window.BARNES_COMMERCIAL_MAP_STATES;
    if (states?.length) {
      const candidates = states.filter(state => (state.viewport <= 540) === (innerWidth <= 540) && (state.viewport <= 1440) === (innerWidth <= 1440));
      const state = (candidates.length ? candidates : states).reduce((best, current) => Math.abs(current.viewport - innerWidth) < Math.abs(best.viewport - innerWidth) ? current : best);
      const dx = (map.clientWidth - state.width) / 2;
      const dy = (map.clientHeight - state.height) / 2;
      if (state.html) {
        one('.catalog-projects-map__canvas', map).innerHTML = state.html;
        const capturedEngine = one('.ymaps3--map', map);
        if (dx || dy) {
          capturedEngine.style.width = `${parseFloat(capturedEngine.style.width) + dx * 2}px`;
          capturedEngine.style.height = `${parseFloat(capturedEngine.style.height) + dy * 2}px`;
          all('.ymaps3--tile-layer__container img', map).forEach(image => {
            image.style.left = `${parseFloat(image.style.left) + dx}px`;
            image.style.top = `${parseFloat(image.style.top) + dy}px`;
          });
          all('.ymaps3--marker', map).forEach(marker => {
            marker.style.transform = marker.style.transform.replace(/translate\(([-\d.]+)px, ([-\d.]+)px\)/, (_, x, y) => `translate(${Number(x) + dx}px, ${Number(y) + dy}px)`);
          });
        }
        return;
      }
      const tiles = one('.ymaps3--tile-layer__container', map);
      const markers = one('.ymaps3--marker-layer', map);
      tiles.dataset.z = String(state.zoom);
      tiles.style.transform = state.transform;
      tiles.style.zIndex = String(state.zoom);
      tiles.replaceChildren(...state.tiles.map(tile => {
        const img = document.createElement('img'); img.src = tile.src;
        Object.assign(img.style, { width: '256px', height: '256px', opacity: '1', left: `${tile.left + dx}px`, top: `${tile.top + dy}px` });
        return img;
      }));
      markers.replaceChildren(...state.markers.map(marker => {
        const element = document.createElement('ymaps3'); element.className = 'ymaps3--marker';
        element.style.transform = marker.transform.replace(/translate\(([-\d.]+)px, ([-\d.]+)px\)/, (_, x, y) => `translate(${Number(x) + dx}px, ${Number(y) + dy}px)`);
        element.style.zIndex = '0'; element.innerHTML = marker.html; return element;
      }));
      return;
    }
    const dx = (map.clientWidth - Number(map.dataset.captureWidth || 1288)) / 2;
    const dy = (map.clientHeight - 220) / 2;
    mapPositions.forEach(({ element, left, top, transform }) => {
      if (Number.isFinite(left)) { element.style.left = `${left + dx}px`; element.style.top = `${top + dy}px`; }
      else element.style.transform = transform.replace(/translate\(([-\d.]+)px, ([-\d.]+)px\)/, (_, x, y) => `translate(${Number(x) + dx}px, ${Number(y) + dy}px)`);
    });
  }
  addEventListener('resize', () => { renderSlider(); resizeMap(); });
  renderSlider(); resizeMap();
})();
