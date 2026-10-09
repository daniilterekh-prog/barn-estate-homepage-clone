(function () {
  if (!document.querySelector('link[data-kurortnaya-ui-kit]')) {
    var stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = 'ui-kit.css?v=20261009-listing-flow-1';
    stylesheet.dataset.kurortnayaUiKit = 'true';
    document.head.appendChild(stylesheet);
  }

  if (!document.querySelector('link[data-kurortnaya-listing-mode]')) {
    var listingStylesheet = document.createElement('link');
    listingStylesheet.rel = 'stylesheet';
    listingStylesheet.href = 'listing-mode.css?v=20261009-ui-contracts-3';
    listingStylesheet.dataset.kurortnayaListingMode = 'true';
    document.head.appendChild(listingStylesheet);
  }

  if (!document.querySelector('link[data-kurortnaya-start-sales]')) {
    var startSalesStylesheet = document.createElement('link');
    startSalesStylesheet.rel = 'stylesheet';
    startSalesStylesheet.href = 'start-sales-cards.css?v=20261009-location-emphasis-1';
    startSalesStylesheet.dataset.kurortnayaStartSales = 'true';
    document.head.appendChild(startSalesStylesheet);
  }

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

  function enableStickyHeaderAfterHero() {
    var header = document.querySelector('.layout__header .site-header');
    var hero = document.querySelector('.catalog-hero');
    if (!header || !hero || header.dataset.stickyHeaderReady === 'true') return;

    header.dataset.stickyHeaderReady = 'true';
    var frameRequested = false;

    function updateStickyHeader() {
      frameRequested = false;
      header.classList.toggle('site-header--scrolled', hero.getBoundingClientRect().bottom <= 0);
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

  enableStickyHeaderAfterHero();

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
    ['.catalog-consultation__mobile-title', 'Консультация', true],
    ['.catalog-consultation__subtitle', 'Консультация', true],
    ['.departments-section__title', 'Направления'],
    ['.catalog-faq__title', 'Экспертиза BARNES'],
    ['.catalog-contact__title', 'Персональный подбор', true]
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

  if (!document.querySelector('script[data-kurortnaya-listing-mode]')) {
    var listingScript = document.createElement('script');
    listingScript.src = 'listing-mode.js?v=20261009-ui-contracts-1';
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
