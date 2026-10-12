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
  let filterValues = null;
  // Reference: Kurortnaya / canonical first-degree request-modal fragment.
  const callbackTemplate = document.getElementById('source-callback');
  if (callbackTemplate) callbackTemplate.innerHTML = `
    <div class="catalog-feedback-modal feedback-modal modal" role="dialog" aria-modal="true" aria-labelledby="catalog-feedback-modal-title">
      <div class="modal__content" tabindex="-1">
        <button class="modal__close" type="button" aria-label="Закрыть форму" data-catalog-modal-close>
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M5 5l14 14M19 5L5 19"></path></svg>
        </button>
        <div class="feedback-modal__layout">
          <div class="feedback-modal__body">
            <h2 class="feedback-modal__title" id="catalog-feedback-modal-title">Поможем найти подходящий объект</h2>
            <p class="feedback-modal__intro">Эксперт BARNES уточнит задачу и подберёт лучшие варианты.</p>
            <form class="feedback-modal__form" novalidate>
              <div class="feedback-modal__channels" role="group" aria-label="Предпочтительный способ связи">
                <button type="button" data-channel="Telegram" aria-pressed="true">Telegram</button>
                <button type="button" data-channel="WhatsApp" aria-pressed="false">WhatsApp</button>
                <button type="button" data-channel="MAX" aria-pressed="false">MAX</button>
                <button type="button" data-channel="Звонок" aria-pressed="false">Звонок</button>
              </div>
              <input type="hidden" name="preferredChannel" value="Telegram">
              <label class="feedback-modal__field"><span class="visually-hidden">Ваше имя</span><input class="feedback-modal__input" name="name" type="text" autocomplete="name" placeholder="Ваше имя" required></label>
              <label class="feedback-modal__field"><span class="visually-hidden">Номер телефона</span><input class="feedback-modal__input" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="Номер телефона в Telegram" required></label>
              <label class="feedback-modal__field"><span class="visually-hidden">Комментарий</span><textarea class="feedback-modal__input feedback-modal__textarea" name="comment" rows="3" placeholder="Опишите, какой объект вы ищете"></textarea></label>
              <button class="feedback-modal__submit" type="submit">Получить подборку</button>
              <label class="feedback-modal__consent">
                <input class="feedback-modal__consent-input" name="consent" type="checkbox" required>
                <span class="feedback-modal__consent-box" aria-hidden="true"></span>
                <span class="feedback-modal__consent-text">Я даю согласие на обработку <a class="feedback-modal__consent-link" href="https://front.barnes.vsavr.ru/legal_notices/yuridicheskie-uvedomleniya/" target="_blank" rel="noopener noreferrer">персональных данных</a></span>
              </label>
              <p class="feedback-modal__status" role="status" aria-live="polite"></p>
            </form>
          </div>
          <div class="feedback-modal__hero"><img class="feedback-modal__hero-image" src="assets/denis-perkovsky-cutout.png" alt="Денис Перковский — руководитель департамента курортной недвижимости BARNES" width="1024" height="1536"></div>
        </div>
      </div>
    </div>`;
  let contactToggle = null;
  let contactPanel = null;
  function closeContacts(restoreFocus = false) {
    if (!contactPanel || contactPanel.hidden) return;
    contactPanel.hidden = true;
    contactToggle.setAttribute('aria-expanded', 'false');
    contactToggle.setAttribute('aria-label', 'Показать способы связи');
    if (restoreFocus) contactToggle.focus({preventScroll:true});
  }
  one('.catalog-hero-filters__search-input')?.setAttribute('aria-label', 'Поиск по ID, названию ЖК, адресу');
  one('.catalog-projects-map__search-input')?.setAttribute('aria-label', 'Поиск в видимой области карты');
  const heroFilter = one('.catalog-hero-filters__filter-icon');
  if (heroFilter) {
    heroFilter.dataset.commercialFilters = 'hero';
    heroFilter.setAttribute('aria-haspopup', 'dialog');
    const quickFilters = one('.catalog-quick-filters');
    if (quickFilters) {
      const row = document.createElement('div');
      row.className = 'source-listing-filters';
      quickFilters.before(row); row.append(quickFilters);
      const button = heroFilter.cloneNode(true);
      button.dataset.commercialFilters = 'listing';
      button.classList.add('source-filter-trigger', 'source-filter-trigger--listing');
      row.append(button);
    }
  }
  // Approved first-degree node design; commerce keeps its own data and routes.
  document.body.classList.add('commercial-node', 'barnes-header-template');
  header?.classList.add('site-header--no-nav');
  if (nav) {
    nav.classList.add('catalog-sticky');
    one('.catalog-page-nav__inner', nav)?.classList.add('catalog-sticky__inner');
    one('.catalog-page-nav__list', nav)?.classList.add('catalog-sticky__list');
    const items = all('.catalog-page-nav__item', nav);
    const last = items.at(-1)?.cloneNode(true);
    if (last) one('.catalog-page-nav__list', nav).append(last);
    all('.catalog-page-nav__link', nav).forEach((button, index) => {
      button.classList.add('catalog-sticky__link');
      button.textContent = ['Карта', 'Каталог', 'О BARNES', 'Вопросы'][index];
    });
    const brand = one('.catalog-page-nav__brand', nav);
    const logo = one('.catalog-page-nav__logo', nav);
    if (logo && brand) { logo.classList.add('catalog-sticky__logo'); brand.before(logo); }
    brand?.classList.add('catalog-sticky__brand');
    const request = one('.catalog-page-nav__request', nav);
    if (request && brand) { request.classList.add('catalog-sticky__request'); brand.prepend(request); }
    one('.catalog-page-nav__phone', nav)?.classList.add('catalog-sticky__phone');
    contactToggle = document.createElement('button');
    contactToggle.className = 'catalog-sticky__contact-toggle';
    contactToggle.type = 'button';
    contactToggle.setAttribute('aria-expanded', 'false');
    contactToggle.setAttribute('aria-controls', 'commercial-sticky-contacts');
    contactToggle.setAttribute('aria-label', 'Показать способы связи');
    contactToggle.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.8 9.8 0 0 1-4-.9L3 21l1.7-4.6A8.4 8.4 0 1 1 21 11.5Z"></path><path d="M8 12h.01M12 12h.01M16 12h.01"></path></svg>';
    contactPanel = document.createElement('div');
    contactPanel.id = 'commercial-sticky-contacts';
    contactPanel.className = 'catalog-sticky__contact-panel';
    contactPanel.setAttribute('role', 'group');
    contactPanel.setAttribute('aria-label', 'Способы связи');
    contactPanel.hidden = true;
    const messengers = all('.site-header__messenger', header);
    for (const name of ['WhatsApp', 'MAX', 'Telegram']) {
      const source = messengers.find(link => link.getAttribute('aria-label') === name);
      if (!source) continue;
      const link = source.cloneNode(true);
      link.className = 'catalog-sticky__messenger';
      link.setAttribute('aria-label', `Написать в ${name}`);
      contactPanel.append(link);
    }
    const phone = one('.site-header__phone', header)?.cloneNode(true);
    if (phone) {
      phone.className = 'catalog-sticky__phone';
      phone.setAttribute('aria-label', 'Позвонить по номеру +7 495 182-50-79');
      one('span', phone)?.setAttribute('class', 'catalog-sticky__phone-icon');
      contactPanel.append(phone);
    }
    one('.catalog-sticky__inner', nav).append(contactToggle, contactPanel);
    contactToggle.addEventListener('click', () => {
      const open = contactPanel.hidden;
      contactPanel.hidden = !open;
      contactToggle.setAttribute('aria-expanded', String(open));
      contactToggle.setAttribute('aria-label', open ? 'Скрыть способы связи' : 'Показать способы связи');
    });
    document.addEventListener('click', event => {
      if (!contactPanel.contains(event.target) && !contactToggle.contains(event.target)) closeContacts();
    });
    addEventListener('resize', () => { if (innerWidth > 900) closeContacts(); });
  }
  for (const [selector, text] of [
    ['.catalog-map__title', 'География'],
    ['.catalog-grid__title', 'Каталог'],
    ['.catalog-faq__title', 'Экспертиза BARNES']
  ]) {
    const heading = one(selector);
    if (!heading || heading.previousElementSibling?.classList.contains('catalog-section-eyebrow')) continue;
    const eyebrow = document.createElement('p');
    eyebrow.className = 'catalog-section-eyebrow'; eyebrow.textContent = text;
    heading.before(eyebrow);
  }
  const toolbar = one('.source-listing-filters');
  if (toolbar) {
    toolbar.classList.add('catalog-mode-toolbar');
    toolbar.setAttribute('aria-label', 'Фильтры коммерческой недвижимости');
    one('.catalog-quick-filters', toolbar)?.classList.add('catalog-mode-filters');
    const filterIcons = [
      '<path d="M4 21V5l8-2v18M12 8h8v13M2 21h20M7 7h2M7 11h2M7 15h2M15 11h2M15 15h2"/>',
      '<circle cx="12" cy="12" r="9"/><path d="M9 16V7.5h3.4a2.75 2.75 0 1 1 0 5.5H9m0 0h5.6m-5.6 2h4.6"/>',
      '<path d="M4 4h16v16H4zM8 4v3M12 4v3M16 4v3M4 8h3M4 12h3M4 16h3M9 15l6-6M9 12v3h3M12 9h3v3"/>'
    ];
    all('.catalog-quick-filters__button', toolbar).forEach((button, index) => {
      const caption = ['Тип недвижимости', 'Стоимость', 'Площадь'][index];
      button.innerHTML = `<span class="catalog-quick-filters__content"><span class="catalog-quick-filters__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${filterIcons[index]}</svg></span><span class="catalog-quick-filters__label" data-v-6fd45cc6><span class="catalog-quick-filters__caption">${caption}</span></span></span><span class="catalog-quick-filters__chevron" data-v-6fd45cc6 aria-hidden="true"></span>`;
      button.setAttribute('aria-label', caption);
      button.setAttribute('aria-haspopup', 'dialog');
      button.addEventListener('click', () => {
        openDialog('filters', button);
        if (index) {
          const input = all('.hero-filter-panel-content__range-input', dialog)[index === 1 ? 0 : 2];
          input?.focus({preventScroll:true});
          input?.closest('.hero-filter-panel-content__group')?.scrollIntoView({block:'nearest'});
        }
      });
    });
    const detailed = one('[data-commercial-filters="listing"]', toolbar);
    detailed?.classList.remove('catalog-hero-filters__filter-icon', 'source-filter-trigger', 'source-filter-trigger--listing');
    detailed?.classList.add('catalog-mode-detailed-filters');
    if (detailed) detailed.innerHTML += '<span class="catalog-mode-detailed-filters__label catalog-mode-detailed-filters__label--desktop">Все фильтры</span><span class="catalog-mode-detailed-filters__label catalog-mode-detailed-filters__label--mobile">Фильтры</span>';
    const sort = one('.catalog-grid__sort');
    if (sort) toolbar.append(sort);
  }
  all('.apartment-card--catalog').forEach(card => {
    const body = one('.apartment-card__body', card);
    const address = one('.apartment-card__address', card);
    const name = one('.apartment-card__name', card);
    if (address && name) name.before(address);
    const stats = one('.apartment-card__stats', card);
    if (stats) {
      stats.classList.add('listing-card-facts');
      stats.style.setProperty('--facts-count', all('.apartment-card__stat', stats).length);
      all('.apartment-card__stat', stats).forEach(stat => {
        stat.classList.add('listing-card-fact');
        const label = one('.apartment-card__stat-label', stat);
        const value = one('.apartment-card__stat-value', stat);
        label?.classList.add('listing-card-fact__label');
        value?.classList.add('listing-card-fact__value');
        if (label && value) value.before(label);
      });
    }
    const price = one('.apartment-card__price', body);
    const id = one('.apartment-card__lotid', body);
    if (price && id) {
      const row = document.createElement('div'); row.className = 'listing-card-price-row';
      price.before(row); row.append(price, id);
      one('.apartment-card__topline', body)?.remove();
    }
  });
  const filterTriggers = all('[data-commercial-filters]');

  function closeDialog() {
    dialog?.remove(); dialog = null;
    document.body.style.removeProperty('overflow');
    header?.classList.remove('site-header--menu-open');
    menuButton?.setAttribute('aria-expanded', 'false');
    if (menuButton && originalMenuIcon) menuButton.innerHTML = originalMenuIcon;
    filterTriggers.forEach(button => button.setAttribute('aria-expanded', 'false'));
    if (returnFocus?.hasAttribute('aria-expanded')) returnFocus.setAttribute('aria-expanded', 'false');
    returnFocus?.focus({ preventScroll: true });
  }

  function openDialog(kind, trigger) {
    closeContacts();
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
    if (kind === 'filters') trigger?.setAttribute('aria-expanded', 'true');
    all('.modal__close,.vfm__overlay,.hero-filter-modal__close,.hero-filter-modal__backdrop', dialog).forEach(e => e.addEventListener('click', closeDialog));
    bindForms(dialog);
    bindFilters(dialog);
    const first = kind === 'filters' ? one('.hero-filter-modal__close', dialog) : kind === 'callback' ? one('.modal__content', dialog) : one('input:not([tabindex="-1"]),button,a[href]', dialog);
    first?.focus({ preventScroll: true });
  }

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (dialog) { event.stopImmediatePropagation(); closeDialog(); }
      else closeContacts(true);
    }
    if (event.key !== 'Tab' || !dialog) return;
    const focusable = all('button,a[href],input,select,textarea,[tabindex="0"]', dialog).filter(e => !e.disabled && e.getClientRects().length && !e.classList.contains('hero-filter-modal__backdrop'));
    if (dialog.classList.contains('site-menu') && menuButton) focusable.unshift(menuButton);
    if (!focusable.length) return;
    if (event.shiftKey && (document.activeElement === focusable[0] || document.activeElement === one('.modal__content', dialog))) { event.preventDefault(); focusable.at(-1).focus(); }
    else if (!event.shiftKey && document.activeElement === focusable.at(-1)) { event.preventDefault(); focusable[0].focus(); }
  });
  menuButton?.addEventListener('click', () => dialog?.classList.contains('site-menu') ? closeDialog() : openDialog('menu', menuButton));
  filterTriggers.forEach(button => button.addEventListener('click', event => openDialog('filters', event.currentTarget)));
  window.CommercialOpenFilters = trigger => openDialog('filters', trigger);
  all('.apartment-card__call-btn,.site-footer__callback-btn,.catalog-contact__card-submit,.floating-expert__card').forEach(e => e.addEventListener('click', () => openDialog('callback', e)));
  one('.floating-expert__close')?.addEventListener('click', () => one('.floating-expert')?.remove());

  const scrollToSection = selector => one(selector)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  all('.catalog-page-nav__link').forEach((button, index) => button.addEventListener('click', () => scrollToSection(['.catalog-map', '.catalog-grid', '.catalog-intro', '.catalog-faq'][index])));
  one('.catalog-page-nav__request')?.addEventListener('click', event => openDialog('callback', event.currentTarget));
  function onScroll() {
    header?.classList.remove('site-header--scrolled');
    const visible = scrollY >= (one('.catalog-hero')?.offsetHeight || 644) - 110;
    nav?.classList.toggle('catalog-page-nav--visible', visible);
    nav?.classList.toggle('catalog-sticky--visible', visible);
    nav?.setAttribute('aria-hidden', String(!visible));
    nav?.toggleAttribute('inert', !visible);
    if (!visible) closeContacts();
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
    if (root.classList.contains('hero-filter-modal')) {
      const inputs = all('input', root);
      if (filterValues) inputs.forEach((input, index) => {
        const saved = filterValues[index];
        if (!saved) return;
        if (input.type === 'checkbox') input.checked = saved.checked;
        else input.value = saved.value;
      });
      const remember = () => {
        filterValues = inputs.map(input => ({ value:input.value, checked:input.checked }));
        const active = inputs.some(input => input.type === 'checkbox' ? input.checked : input.value.trim());
        filterTriggers.forEach(button => button.classList.toggle('catalog-hero-filters__filter-icon--active', active));
      };
      inputs.forEach(input => input.addEventListener('input', remember));
      one('.hero-filter-modal__reset', root)?.addEventListener('click', () => {
        inputs.forEach(input => { if (input.type === 'checkbox') input.checked = false; else input.value = ''; });
        remember();
      });
      one('.hero-filter-modal__apply', root)?.addEventListener('click', () => { remember(); closeDialog(); });
    }
    all('.hero-filter-panel__reset', root).forEach(button => button.addEventListener('click', () => all('input', root).forEach(input => { input.value = ''; input.checked = false; })));
    all('button', root).filter(e => /показать.*объект/i.test(e.textContent)).forEach(button => button.addEventListener('click', () => { closeDialog(); scrollToSection('.catalog-grid'); }));
  }

  function bindForms(root) {
    all('form:not(.catalog-hero-filters__bar)', root).forEach(form => {
      all('[data-channel]', form).forEach(button => button.addEventListener('click', () => {
        all('[data-channel]', form).forEach(item => item.setAttribute('aria-pressed', String(item === button)));
        one('[name="preferredChannel"]', form).value = button.dataset.channel;
        one('[name="phone"]', form).placeholder = button.dataset.channel === 'Звонок' ? 'Номер телефона' : `Номер телефона в ${button.dataset.channel}`;
      }));
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
        let status = one('.feedback-modal__status,.source-form-status', form);
        if (!status) { status = document.createElement('p'); status.className = 'source-form-status'; status.setAttribute('role', 'status'); form.append(status); }
        status.textContent = 'Для отправки заявки свяжитесь с BARNES: +7 (495) 182-50-79.';
      });
    });
  }
  bindForms(document);
  const selectionScript = document.createElement('script');
  selectionScript.src = 'selection-carousel.js';
  document.body.append(selectionScript);
  const mapStyles=document.createElement('link');mapStyles.rel='stylesheet';mapStyles.href='open-map-layout.css';document.head.append(mapStyles);
  const mapTemplateScript=document.createElement('script');mapTemplateScript.src='open-map-template.js';
  mapTemplateScript.onload=()=>{const runtime=document.createElement('script');runtime.src='open-map.js';document.body.append(runtime);};
  document.body.append(mapTemplateScript);

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
