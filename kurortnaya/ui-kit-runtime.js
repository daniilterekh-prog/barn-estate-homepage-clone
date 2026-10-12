(function () {
  var filtersTemplate = document.createElement('script');
  filtersTemplate.src = 'filters-template.js?v=1';
  filtersTemplate.onload = function () {
    var filtersScript = document.createElement('script');
    filtersScript.src = 'filters-modal.js?v=3';
    filtersScript.onload = function () {
      var quickScript = document.createElement('script');
      quickScript.src = 'quick-filters.js?v=3';
      quickScript.onload = function () {
        var brandsScript = document.createElement('script');
        brandsScript.src = 'brand-filters.js?v=4';
        document.body.appendChild(brandsScript);
      };
      document.body.appendChild(quickScript);
    };
    document.body.appendChild(filtersScript);
  };
  document.body.appendChild(filtersTemplate);
  var mapDataScript = document.createElement('script');
  mapDataScript.src = 'map-projects.js?v=1';
  mapDataScript.onload = function () {
    var mapScript = document.createElement('script');
    mapScript.src = 'map-fullscreen.js?v=7';
    document.body.appendChild(mapScript);
  };
  document.body.appendChild(mapDataScript);
  var openContactModal = null;
  document.body.classList.add('barnes-header-template');
  var ownerHeaderStyles = document.createElement('link');
  ownerHeaderStyles.rel = 'stylesheet';
  ownerHeaderStyles.href = '../shared/owner-header.css?v=20261012-owner-header-5';

  if (!document.querySelector('link[data-kurortnaya-ui-kit]')) {
    var stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = 'ui-kit.css?v=20261012-cta-form-width-1';
    stylesheet.dataset.kurortnayaUiKit = 'true';
    document.head.appendChild(stylesheet);
  }

  if (!document.querySelector('link[data-kurortnaya-listing-mode]')) {
    var listingStylesheet = document.createElement('link');
    listingStylesheet.rel = 'stylesheet';
    listingStylesheet.href = 'listing-mode.css?v=20261012-sort-text-gap-1';
    listingStylesheet.dataset.kurortnayaListingMode = 'true';
    document.head.appendChild(listingStylesheet);
  }

  if (!document.querySelector('link[data-kurortnaya-start-sales]')) {
    var startSalesStylesheet = document.createElement('link');
    startSalesStylesheet.rel = 'stylesheet';
    startSalesStylesheet.href = 'start-sales-cards.css?v=20261011-content-spacing-1';
    startSalesStylesheet.dataset.kurortnayaStartSales = 'true';
    document.head.appendChild(startSalesStylesheet);
  }

  document.head.appendChild(ownerHeaderStyles);

  function enhanceSiteHeader() {
    var header = document.querySelector('.layout__header .site-header');
    if (!header) return;

    header.classList.add('site-header--no-nav', 'catalog-header-ready');

    var pageNavigation = document.querySelector('.catalog-page-nav');
    if (pageNavigation) {
      pageNavigation.hidden = true;
      pageNavigation.setAttribute('aria-hidden', 'true');
    }

    var directionsNavigation = header.querySelector('.site-header__nav');
    if (directionsNavigation) directionsNavigation.remove();

    var searchButton = header.querySelector('.site-header__search-btn');
    if (searchButton) {
      searchButton.classList.add('catalog-header-search');
      searchButton.setAttribute('aria-label', 'Поиск');
      searchButton.innerHTML = '<span class="ui-icon ui-icon-current site-header__icon site-header__icon--search" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"></circle><path d="m15.4 15.4 5.1 5.1"></path></svg></span>';
    }

    var rightColumn = header.querySelector('.site-header__right');
    var phoneLink = rightColumn && rightColumn.querySelector('.site-header__phone');
    if (!rightColumn || !phoneLink || rightColumn.querySelector('.catalog-header-contacts')) return;

    var contacts = document.createElement('nav');
    contacts.className = 'catalog-header-contacts';
    contacts.setAttribute('aria-label', 'Способы связи');

    [
      ['Написать в WhatsApp', 'https://wa.me/79252621650', 'assets/header-whatsapp.svg'],
      ['Написать в MAX', 'https://max.ru/join/AWj8ibiCtAPOJOlulMGNkykKGz_prXVWg-IQK1KpUG8', 'assets/header-max.svg'],
      ['Написать в Telegram', 'https://t.me/art_de_vivre_barnes', 'assets/header-telegram.svg']
    ].forEach(function (contact) {
      var link = document.createElement('a');
      link.className = 'catalog-header-contact';
      link.href = contact[1];
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', contact[0]);

      var icon = document.createElement('img');
      icon.src = contact[2];
      icon.alt = '';
      icon.setAttribute('aria-hidden', 'true');
      link.appendChild(icon);
      contacts.appendChild(link);
    });

    phoneLink.classList.add('catalog-header-contact', 'catalog-header-contact--phone');
    phoneLink.setAttribute('aria-label', 'Позвонить по номеру +7 495 182-50-79');
    contacts.appendChild(phoneLink);
    rightColumn.appendChild(contacts);
  }

  enhanceSiteHeader();

  function enhanceCatalogStickyHeader() {
    var header = document.querySelector('.layout__header .site-header');
    var hero = document.querySelector('.catalog-hero');
    var page = document.querySelector('.catalog-page') || document.querySelector('main');
    if (!header || !hero || !page || document.querySelector('.catalog-sticky')) return;

    header.classList.remove('site-header--scrolled');
    var sections = [
      ['Проекты', 'catalog-new-starts'],
      ['Каталог', 'catalog-grid'],
      ['О BARNES', 'catalog-intro'],
      ['Вопросы', 'catalog-faq']
    ].filter(function (item) {
      return document.getElementById(item[1]);
    });

    var sticky = document.createElement('div');
    sticky.className = 'catalog-sticky';
    sticky.setAttribute('aria-hidden', 'true');
    sticky.setAttribute('inert', '');
    sticky.innerHTML = '<div class="catalog-sticky__inner base-container"><nav class="catalog-sticky__nav" aria-label="Навигация по странице"><ul class="catalog-sticky__list">' + sections.map(function (item) {
      return '<li class="catalog-sticky__item"><a class="catalog-sticky__link" href="#' + item[1] + '">' + item[0] + '</a></li>';
    }).join('') + '<li class="catalog-sticky__item catalog-sticky__item--contacts"><button class="catalog-sticky__contact-toggle" type="button" aria-expanded="false" aria-controls="kurortnaya-sticky-contacts" aria-label="Показать способы связи"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.8 9.8 0 0 1-4-.9L3 21l1.7-4.6A8.4 8.4 0 1 1 21 11.5Z"></path><path d="M8 12h.01M12 12h.01M16 12h.01"></path></svg></button></li></ul></nav><a class="catalog-sticky__logo" aria-label="BARNES Moscow — на главную" href="https://barn-estate.ru/"><img alt="BARNES Moscow" width="220" height="30"></a><div class="catalog-sticky__brand"><button class="catalog-sticky__request" type="button">Оставить заявку</button><nav class="catalog-sticky__messengers" aria-label="Способы связи"><a class="catalog-sticky__messenger" href="https://wa.me/79252621650" target="_blank" rel="noopener noreferrer" aria-label="Написать в WhatsApp"><img src="assets/header-whatsapp.svg" alt=""></a><a class="catalog-sticky__messenger" href="https://max.ru/join/AWj8ibiCtAPOJOlulMGNkykKGz_prXVWg-IQK1KpUG8" target="_blank" rel="noopener noreferrer" aria-label="Написать в MAX"><img src="assets/header-max.svg" alt=""></a><a class="catalog-sticky__messenger" href="https://t.me/art_de_vivre_barnes" target="_blank" rel="noopener noreferrer" aria-label="Написать в Telegram"><img src="assets/header-telegram.svg" alt=""></a><a class="catalog-sticky__phone" href="tel:74951825079" aria-label="Позвонить по номеру +7 495 182-50-79"><span class="catalog-sticky__phone-number">+7 (495) 182-50-79</span><span class="catalog-sticky__phone-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></span></a></nav></div></div>';

    var sourceLogo = header.querySelector('.site-header__logo img');
    var stickyLogo = sticky.querySelector('.catalog-sticky__logo img');
    if (sourceLogo && stickyLogo) stickyLogo.src = sourceLogo.currentSrc || sourceLogo.src;

    var panel = sticky.querySelector('.catalog-sticky__messengers').cloneNode(true);
    panel.id = 'kurortnaya-sticky-contacts';
    panel.className = 'catalog-sticky__contact-panel';
    panel.hidden = true;
    sticky.querySelector('.catalog-sticky__inner').appendChild(panel);
    page.insertBefore(sticky, page.firstChild);

    sticky.querySelector('.catalog-sticky__request').addEventListener('click', function () {
      if (openContactModal) {
        openContactModal(sticky.querySelector('.catalog-sticky__request'));
        return;
      }
      var contact = document.getElementById('catalog-contact');
      if (contact) contact.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    var toggle = sticky.querySelector('.catalog-sticky__contact-toggle');
    toggle.addEventListener('click', function () {
      var open = panel.hidden;
      panel.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Скрыть способы связи' : 'Показать способы связи');
    });

    var frameRequested = false;

    function updateStickyHeader() {
      frameRequested = false;
      var visible = window.scrollY > hero.offsetTop + hero.offsetHeight - 120;
      sticky.classList.toggle('catalog-sticky--visible', visible);
      sticky.setAttribute('aria-hidden', String(!visible));
      sticky.toggleAttribute('inert', !visible);

      var active = sections[0] && sections[0][1];
      sections.forEach(function (item) {
        var section = document.getElementById(item[1]);
        if (section && window.scrollY + 140 >= section.offsetTop) active = item[1];
      });
      sticky.querySelectorAll('.catalog-sticky__link').forEach(function (link) {
        var isActive = link.getAttribute('href') === '#' + active;
        link.classList.toggle('catalog-sticky__link--active', isActive);
        if (isActive) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }

    function requestStickyHeaderUpdate() {
      if (frameRequested) return;
      frameRequested = true;
      window.requestAnimationFrame(updateStickyHeader);
    }

    updateStickyHeader();
    window.addEventListener('scroll', requestStickyHeaderUpdate, { passive: true });
    window.addEventListener('resize', requestStickyHeaderUpdate);
  }

  enhanceCatalogStickyHeader();

  function addExplicitLabel(control, id) {
    if (!control) return;

    var existingLabel = control.closest('label');
    if (existingLabel) {
      if (!existingLabel.querySelector('.catalog-field-label')) {
        var hiddenText = document.createElement('span');
        hiddenText.className = 'visually-hidden catalog-field-label';
        hiddenText.textContent = control.getAttribute('placeholder') || 'Поле формы';
        existingLabel.insertBefore(hiddenText, control);
      }
      control.removeAttribute('aria-label');
      return;
    }

    if (control.labels.length) return;

    control.id = control.id || id;
    var label = document.createElement('label');
    label.className = 'visually-hidden';
    label.htmlFor = control.id;
    label.textContent = control.getAttribute('placeholder') || 'Поле формы';
    control.parentNode.insertBefore(label, control);
    control.removeAttribute('aria-label');
  }

  [
    ['.catalog-consultation__input[placeholder*="имя"]', 'catalog-consultation-name'],
    ['.catalog-consultation__input[placeholder*="телефон"]', 'catalog-consultation-phone'],
    ['.catalog-consultation__textarea', 'catalog-consultation-comment'],
    ['.catalog-contact__input[placeholder*="имя"]', 'catalog-contact-name'],
    ['.catalog-contact__input[placeholder*="телефон"]', 'catalog-contact-phone'],
    ['.catalog-contact__textarea', 'catalog-contact-comment']
  ].forEach(function (entry) {
    addExplicitLabel(document.querySelector(entry[0]), entry[1]);
  });

  document.querySelectorAll('input[placeholder]:not([aria-label]), textarea[placeholder]:not([aria-label])')
    .forEach(function (control) {
      if (!control.labels.length) {
        control.setAttribute('aria-label', control.getAttribute('placeholder'));
      }
    });

  function addSectionEyebrow(selector, text, inverse) {
    var heading = document.querySelector(selector);
    if (!heading || (heading.previousElementSibling && heading.previousElementSibling.classList.contains('catalog-section-eyebrow'))) return;

    var eyebrow = document.createElement('p');
    eyebrow.className = 'catalog-section-eyebrow' + (inverse ? ' catalog-section-eyebrow--inverse' : '');
    eyebrow.textContent = text;
    heading.parentNode.insertBefore(eyebrow, heading);
  }

  [
    ['.catalog-best-offers__title', 'Новые проекты'],
    ['.catalog-map__title', 'География'],
    ['.catalog-grid__title', 'Каталог'],
    ['.departments-section__title', 'Направления'],
    ['.catalog-faq__title', 'Экспертиза BARNES']
  ].forEach(function (entry) {
    addSectionEyebrow(entry[0], entry[1], entry[2]);
  });

  var introDetails = document.querySelector('.catalog-intro__details');
  if (introDetails) {
    Array.from(introDetails.querySelectorAll('h3')).forEach(function (heading) {
      var replacement = document.createElement('h4');
      Array.from(heading.attributes).forEach(function (attribute) {
        replacement.setAttribute(attribute.name, attribute.value);
      });
      replacement.innerHTML = heading.innerHTML;
      heading.replaceWith(replacement);
    });

    Array.from(introDetails.querySelectorAll('h2')).forEach(function (heading) {
      var replacement = document.createElement('h3');
      Array.from(heading.attributes).forEach(function (attribute) {
        replacement.setAttribute(attribute.name, attribute.value);
      });
      replacement.innerHTML = heading.innerHTML;
      heading.replaceWith(replacement);
    });
  }

  var catalogIntroImage = document.querySelector('#catalog-intro img');
  if (catalogIntroImage) {
    catalogIntroImage.src = 'assets/barnes-moscow-residence-v4.webp';
    catalogIntroImage.removeAttribute('srcset');
    catalogIntroImage.width = 1448;
    catalogIntroImage.height = 1086;
    catalogIntroImage.alt = 'Современная курортная резиденция';
  }

  var catalogContactImage = document.querySelector('.catalog-contact__image');
  if (catalogContactImage) {
    catalogContactImage.src = 'assets/cta-contact-resort-lounge.webp';
    catalogContactImage.removeAttribute('srcset');
    catalogContactImage.alt = '';
    catalogContactImage.width = 1536;
    catalogContactImage.height = 1024;
  }

  var denisImageSource = 'assets/denis-perkovsky-interior-hq.webp';
  var denisCutoutSource = 'assets/denis-perkovsky-cutout.png';
  var consultationPortrait = document.querySelector('.catalog-consultation__image');
  if (consultationPortrait) {
    consultationPortrait.src = denisCutoutSource;
    consultationPortrait.removeAttribute('srcset');
    consultationPortrait.alt = '';
    consultationPortrait.width = 1024;
    consultationPortrait.height = 1536;
  }

  document.querySelectorAll([
    '.catalog-consultation__mobile-photo img',
    '.catalog-contact__mobile-photo img',
    '.catalog-contact__expert-photo img',
    '.floating-expert__avatar img'
  ].join(', ')).forEach(function (image) {
    image.src = denisImageSource;
    image.removeAttribute('srcset');
    image.alt = 'Денис Перковский';
    image.width = 2048;
    image.height = 3072;
  });

  function enhanceContactMethods() {
    [
      ['.catalog-consultation__methods', '.catalog-consultation__method'],
      ['.catalog-contact__methods', '.catalog-contact__method']
    ].forEach(function (entry) {
      document.querySelectorAll(entry[0]).forEach(function (methods) {
        if (methods.dataset.contactMethodsReady === 'true') return;
        methods.dataset.contactMethodsReady = 'true';

        var form = methods.closest('form');
        var channelValue = document.createElement('input');
        channelValue.type = 'hidden';
        channelValue.name = 'preferredChannel';
        var selected = methods.querySelector(entry[1] + '[aria-selected="true"]') || methods.querySelector(entry[1]);
        channelValue.value = selected ? selected.textContent.trim() : 'Whatsapp';
        if (form) form.appendChild(channelValue);

        methods.addEventListener('click', function (event) {
          var button = event.target.closest(entry[1]);
          if (!button || !methods.contains(button)) return;
          methods.querySelectorAll(entry[1]).forEach(function (item) {
            item.setAttribute('aria-selected', String(item === button));
          });
          channelValue.value = button.textContent.trim();
        });
      });
    });
  }

  function enhanceContactModal() {
    if (document.querySelector('.catalog-feedback-modal')) return;

    var modal = document.createElement('div');
    modal.className = 'catalog-feedback-modal feedback-modal modal';
    modal.hidden = true;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'catalog-feedback-modal-title');
    modal.innerHTML = [
      '<div class="modal__content" tabindex="-1">',
      '  <button class="modal__close" type="button" aria-label="Закрыть форму" data-catalog-modal-close>',
      '    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M5 5l14 14M19 5L5 19"></path></svg>',
      '  </button>',
      '  <div class="feedback-modal__layout">',
      '    <div class="feedback-modal__body">',
      '      <h2 class="feedback-modal__title" id="catalog-feedback-modal-title">Поможем найти подходящий объект</h2>',
      '      <p class="feedback-modal__intro">Эксперт BARNES уточнит задачу и подберёт лучшие варианты.</p>',
      '      <form class="feedback-modal__form" novalidate>',
      '        <div class="feedback-modal__channels" role="group" aria-label="Предпочтительный способ связи">',
      '          <button type="button" data-channel="Telegram" aria-pressed="true">Telegram</button>',
      '          <button type="button" data-channel="WhatsApp" aria-pressed="false">WhatsApp</button>',
      '          <button type="button" data-channel="MAX" aria-pressed="false">MAX</button>',
      '          <button type="button" data-channel="Звонок" aria-pressed="false">Звонок</button>',
      '        </div>',
      '        <input type="hidden" name="preferredChannel" value="Telegram">',
      '        <label class="feedback-modal__field"><span class="visually-hidden">Ваше имя</span><input class="feedback-modal__input" name="name" type="text" autocomplete="name" placeholder="Ваше имя" required></label>',
      '        <label class="feedback-modal__field"><span class="visually-hidden">Номер телефона</span><input class="feedback-modal__input" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="Номер телефона в Telegram" required></label>',
      '        <label class="feedback-modal__field"><span class="visually-hidden">Комментарий</span><textarea class="feedback-modal__input feedback-modal__textarea" name="comment" rows="3" placeholder="Опишите, какой объект вы ищете"></textarea></label>',
      '        <button class="feedback-modal__submit" type="submit">Получить подборку</button>',
      '        <label class="feedback-modal__consent">',
      '          <input class="feedback-modal__consent-input" name="consent" type="checkbox" required>',
      '          <span class="feedback-modal__consent-box" aria-hidden="true"></span>',
      '          <span class="feedback-modal__consent-text">Я даю согласие на обработку <a class="feedback-modal__consent-link" href="https://front.barnes.vsavr.ru/legal_notices/yuridicheskie-uvedomleniya/" target="_blank" rel="noopener noreferrer">персональных данных</a></span>',
      '        </label>',
      '        <p class="feedback-modal__status" role="status" aria-live="polite"></p>',
      '      </form>',
      '    </div>',
      '    <div class="feedback-modal__hero">',
      '      <img class="feedback-modal__hero-image" src="assets/denis-perkovsky-cutout.png" alt="Денис Перковский — руководитель департамента курортной недвижимости BARNES" width="1024" height="1536">',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('');
    document.body.appendChild(modal);

    var content = modal.querySelector('.modal__content');
    var form = modal.querySelector('.feedback-modal__form');
    var phone = form.querySelector('[name="phone"]');
    var channelValue = form.querySelector('[name="preferredChannel"]');
    var status = form.querySelector('.feedback-modal__status');
    var previousFocus = null;

    function closeModal() {
      if (modal.hidden) return;
      modal.hidden = true;
      document.body.classList.remove('catalog-modal-open');
      if (previousFocus && document.contains(previousFocus)) previousFocus.focus();
    }

    openContactModal = function (trigger) {
      previousFocus = trigger || document.activeElement;
      modal.hidden = false;
      document.body.classList.add('catalog-modal-open');
      window.requestAnimationFrame(function () {
        content.focus();
      });
    };

    modal.addEventListener('click', function (event) {
      if (event.target === modal || event.target.closest('[data-catalog-modal-close]')) closeModal();
    });

    modal.querySelector('.feedback-modal__channels').addEventListener('click', function (event) {
      var button = event.target.closest('button[data-channel]');
      if (!button) return;
      modal.querySelectorAll('.feedback-modal__channels button').forEach(function (item) {
        item.setAttribute('aria-pressed', String(item === button));
      });
      channelValue.value = button.dataset.channel;
      phone.placeholder = button.dataset.channel === 'Звонок' ? 'Номер телефона' : 'Номер телефона в ' + button.dataset.channel;
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      status.textContent = 'Спасибо! Мы свяжемся с вами в ближайшее время.';
      form.reset();
      channelValue.value = 'Telegram';
      modal.querySelectorAll('.feedback-modal__channels button').forEach(function (item) {
        item.setAttribute('aria-pressed', String(item.dataset.channel === 'Telegram'));
      });
    });

    document.addEventListener('keydown', function (event) {
      if (modal.hidden) return;
      if (event.key === 'Escape') {
        closeModal();
        return;
      }
      if (event.key !== 'Tab') return;
      var focusable = Array.from(modal.querySelectorAll('button, input, textarea, a[href]')).filter(function (item) {
        return !item.disabled && item.offsetParent !== null;
      });
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    document.querySelectorAll('.catalog-contact__card-submit, .floating-expert__card').forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        openContactModal(trigger);
      });
    });
  }

  enhanceContactMethods();
  enhanceContactModal();

  if (!document.querySelector('script[data-kurortnaya-listing-mode]')) {
    var listingScript = document.createElement('script');
    listingScript.src = 'listing-mode.js?v=20261012-project-address-1';
    listingScript.dataset.kurortnayaListingMode = 'true';
    document.body.appendChild(listingScript);
  }

  if (!document.querySelector('script[data-kurortnaya-start-sales]')) {
    var startSalesScript = document.createElement('script');
    startSalesScript.src = 'start-sales-cards.js?v=20261009-location-emphasis-1';
    startSalesScript.dataset.kurortnayaStartSales = 'true';
    document.body.appendChild(startSalesScript);
  }
}());
