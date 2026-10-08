(function () {
  'use strict';

  var page = document.querySelector('.ambassadors-page');
  if (!page) return;

  var stagesStylesheet = document.createElement('link');
  stagesStylesheet.rel = 'stylesheet';
  stagesStylesheet.href = 'assets/how-it-works.css';
  document.head.appendChild(stagesStylesheet);

  function enhanceHowItWorks() {
    var section = page.querySelector('#how-it-works');
    var aside = section && section.querySelector('.owner-sale-stages__aside');
    var title = section && section.querySelector('.owner-sale-stages__title');
    var offer = section && section.querySelector('.owner-sale-stages__offer');
    var offerTitle = offer && offer.querySelector('.owner-sale-stages__offer-title');
    var offerText = offer && offer.querySelector('.owner-sale-stages__offer-text');
    var offerButton = offer && offer.querySelector('.owner-sale-stages__offer-btn');
    if (!section || !aside || !title) return;

    title.id = 'partners-stages-title';
    section.setAttribute('aria-labelledby', title.id);
    section.removeAttribute('aria-label');
    aside.classList.add('owner-sale-stages__header');

    if (offerTitle) {
      offerTitle.className = 'partners-stages__lead';
      aside.appendChild(offerTitle);
    }
    if (offerText) {
      offerText.className = 'owner-sale-stages__intro';
      aside.appendChild(offerText);
    }
    if (offerButton) {
      offerButton.classList.add('owner-sale-stages__cta');
      aside.appendChild(offerButton);
    }
    if (offer) offer.remove();
  }

  enhanceHowItWorks();

  function enhanceSectionEyebrows() {
    [
      ['.owner-sale-stages__title', 'МЕХАНИКА ПАРТНЁРСТВА'],
      ['.ambassadors-requests__title', 'НАПРАВЛЕНИЯ BARNES'],
      ['.ambassadors-advantages__title', 'ПАРТНЁРСТВО С BARNES'],
      ['.catalog-contact__title', 'СВЯЗЬ С BARNES'],
      ['.catalog-faq__title', 'ПАРТНЁРСКАЯ ПРОГРАММА'],
      ['.newsletter-cta h2', 'BARNES / АНАЛИТИКА']
    ].forEach(function (item) {
      var title = document.querySelector(item[0]);
      var container = title && title.parentElement;
      if (!title || !container || container.querySelector(':scope > .partners-section-eyebrow')) return;

      var eyebrow = document.createElement('p');
      eyebrow.className = 'partners-section-eyebrow';
      eyebrow.textContent = item[1];
      container.insertBefore(eyebrow, title);
    });
  }

  enhanceSectionEyebrows();

  var stagesScrollFrame = null;
  function updateStagesScrollState() {
    var section = page.querySelector('#how-it-works');
    var items = section ? Array.prototype.slice.call(section.querySelectorAll('.owner-sale-stages__item')) : [];
    var headerBlock = section && section.querySelector('.owner-sale-stages__header');
    var desktop = window.matchMedia('(min-width: 901px)').matches;
    if (!section || !items.length) return;

    if (!desktop) {
      section.classList.remove('owner-sale-stages--scroll-ready');
      items.forEach(function (item) {
        item.classList.remove('is-active', 'is-past');
        item.style.removeProperty('--partners-stages-last-offset');
      });
      return;
    }

    var alignmentLine = headerBlock ? parseFloat(window.getComputedStyle(headerBlock).top) : 120;
    if (!Number.isFinite(alignmentLine)) alignmentLine = 120;

    var lastItem = items[items.length - 1];
    var currentLastOffset = parseFloat(lastItem.style.getPropertyValue('--partners-stages-last-offset')) || 0;
    var naturalLastTop = lastItem.getBoundingClientRect().top - currentLastOffset;
    var headerTop = headerBlock ? headerBlock.getBoundingClientRect().top : alignmentLine;
    var lastOffset = Math.max(0, headerTop - naturalLastTop);
    lastItem.style.setProperty('--partners-stages-last-offset', lastOffset + 'px');

    var activeIndex = 0;
    var closestDistance = Infinity;
    items.forEach(function (item, index) {
      var distance = Math.abs(item.getBoundingClientRect().top - alignmentLine);
      if (distance < closestDistance) {
        closestDistance = distance;
        activeIndex = index;
      }
    });

    section.classList.add('owner-sale-stages--scroll-ready');
    items.forEach(function (item, index) {
      item.classList.toggle('is-active', index === activeIndex);
      item.classList.toggle('is-past', index < activeIndex);
    });
  }

  function requestStagesScrollUpdate() {
    if (stagesScrollFrame) return;
    stagesScrollFrame = window.requestAnimationFrame(function () {
      stagesScrollFrame = null;
      updateStagesScrollState();
    });
  }

  window.addEventListener('scroll', requestStagesScrollUpdate, { passive: true });
  window.addEventListener('resize', requestStagesScrollUpdate, { passive: true });
  window.addEventListener('load', requestStagesScrollUpdate, { once: true });
  requestStagesScrollUpdate();

  var sliderStyle = document.createElement('style');
  sliderStyle.textContent = [
    '@media (max-width: 768px) { .ambassadors-advantages__slider .splide__slide { margin-right: 12px !important; width: calc(100% + 0px) !important; } }',
    '@media (min-width: 769px) and (max-width: 1024px) { .ambassadors-advantages__slider .splide__slide { margin-right: 16px !important; width: calc(50% - 8px) !important; } }',
    '@media (min-width: 1025px) { .ambassadors-advantages__slider .splide__slide { margin-right: 20px !important; width: calc(33.3333% - 13.3333px) !important; } }'
  ].join('');
  document.head.appendChild(sliderStyle);

  var header = document.querySelector('.site-header');
  var menuButton = document.querySelector('.site-header__icon-btn');
  var floatingCard = document.querySelector('.floating-expert__card');
  var floatingClose = document.querySelector('.floating-expert__close');

  function setScrolledHeader() {
    if (!header) return;
    header.classList.toggle('site-header--scrolled', window.scrollY > 24);
  }

  window.addEventListener('scroll', setScrolledHeader, { passive: true });
  setScrolledHeader();

  function scrollToTarget(selector) {
    var target = document.querySelector(selector);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  document.querySelectorAll('.ambassadors-hero__button--primary, .owner-sale-stages__offer-btn, .catalog-contact__card-submit').forEach(function (button) {
    button.addEventListener('click', function () { scrollToTarget('.catalog-contact'); });
  });
  document.querySelectorAll('.ambassadors-hero__button--secondary').forEach(function (button) {
    button.addEventListener('click', function () { scrollToTarget('#conditions'); });
  });

  document.querySelectorAll('.catalog-contact__method').forEach(function (button) {
    button.addEventListener('click', function () {
      document.querySelectorAll('.catalog-contact__method').forEach(function (item) {
        item.classList.remove('catalog-contact__method--active');
      });
      button.classList.add('catalog-contact__method--active');
    });
  });

  document.querySelectorAll('.catalog-faq__question').forEach(function (button) {
    button.addEventListener('click', function () {
      var item = button.closest('.catalog-faq__item');
      var answer = item && item.querySelector('.catalog-faq__answer');
      var isOpen = item && item.classList.toggle('catalog-faq__item--open');
      button.setAttribute('aria-expanded', String(Boolean(isOpen)));
      if (answer) answer.classList.toggle('catalog-faq__answer--open', Boolean(isOpen));
    });
  });

  var requestTabs = Array.prototype.slice.call(document.querySelectorAll('.ambassadors-requests__tab'));
  var requestPanel = document.querySelector('.ambassadors-requests__panel');
  var requestImage = document.querySelector('.ambassadors-requests__image');
  var requestStats = requestPanel ? Array.prototype.slice.call(requestPanel.querySelectorAll('.ambassadors-requests__stat')) : [];
  var requestData = [
    {
      image: 'assets/media-06.png',
      stats: [['Чек покупки', 'от 52 млн ₽'], ['Новостройки класса премиум и выше', '150+'], ['Объекты вторичной недвижимости', '2000+'], ['Комиссия', '3–5%']]
    },
    {
      image: 'assets/media-20.png',
      stats: [['Чек покупки', 'от 50 млн ₽'], ['Объекты', '380'], ['Эксклюзивы', '30+'], ['Комиссия', '4–5%']]
    },
    {
      image: 'assets/media-21.png',
      stats: [['Средний чек', '250 тыс. ₽/месяц'], ['Новостройки класса премиум и выше', '200+'], ['Эксклюзивы', '15+'], ['Комиссия', '50–100%']]
    },
    {
      image: 'assets/media-22.png',
      stats: [['Средний чек', 'от 250 тыс. ₽'], ['Объектов в базе', '200+'], ['Эксклюзивов', '15+'], ['Комиссия', '50–100%']]
    },
    {
      image: 'assets/media-23.png',
      stats: [['Чек покупки', 'от 200 тыс. $'], ['Направления', 'ОАЭ, Турция, Таиланд, Бали, Грузия, Европа'], ['Помощь в получении', 'ВНЖ и гражданства'], ['Комиссия', '2–5%']]
    },
    {
      image: 'assets/media-24.png',
      stats: [['Программа', 'Паспорт Турции'], ['Сопровождение', 'Под ключ'], ['ВНЖ', 'ОАЭ и другие'], ['Формат', 'С недвижимостью']]
    },
    {
      image: 'assets/media-25.png',
      stats: [['Объекты', '500+'], ['Лоты с окупаемостью', 'менее 7 лет'], ['Недвижимость под', 'склад, офис, торговлю'], ['Инвестиции в', 'ГАБ']]
    }
  ];

  function updateRequest(index) {
    var data = requestData[index];
    if (!data) return;

    requestTabs.forEach(function (item, itemIndex) {
      var active = itemIndex === index;
      item.classList.toggle('ambassadors-requests__tab--active', active);
      item.setAttribute('aria-selected', String(active));
      item.setAttribute('tabindex', active ? '0' : '-1');
    });

    requestStats.forEach(function (stat, statIndex) {
      var values = data.stats[statIndex];
      if (!values) return;
      var label = stat.querySelector('.ambassadors-requests__stat-label');
      var value = stat.querySelector('.ambassadors-requests__stat-value');
      if (label) label.textContent = values[0];
      if (value) value.textContent = values[1];
    });

    if (requestImage) {
      requestImage.src = data.image;
      requestImage.removeAttribute('srcset');
    }
    if (requestPanel && requestTabs[index]) {
      requestPanel.setAttribute('aria-labelledby', requestTabs[index].id);
    }
    page.dataset.requestIndex = String(index);
  }

  requestTabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () { updateRequest(index); });
    tab.addEventListener('keydown', function (event) {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowRight' && event.key !== 'ArrowUp' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      var direction = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1;
      var nextIndex = (index + direction + requestTabs.length) % requestTabs.length;
      requestTabs[nextIndex].focus();
      updateRequest(nextIndex);
    });
  });

  var advantages = document.querySelector('.ambassadors-advantages__slider');
  var previous = document.querySelector('.ambassadors-advantages__nav-btn[aria-label*="Предыдущее"]');
  var next = document.querySelector('.ambassadors-advantages__nav-btn[aria-label*="Следующее"]');
  var advantageIndex = 0;
  function moveAdvantages(direction) {
    if (!advantages) return;
    var list = advantages.querySelector('.splide__list');
    var cards = list && list.querySelectorAll('.splide__slide');
    if (!list || !cards || cards.length < 2) return;
    advantageIndex = (advantageIndex + direction + cards.length) % cards.length;
    list.style.transform = 'translateX(' + (-advantageIndex * 100) + '%)';
  }
  if (previous) previous.addEventListener('click', function () { moveAdvantages(-1); });
  if (next) {
    next.disabled = false;
    next.addEventListener('click', function () { moveAdvantages(1); });
  }

  document.querySelectorAll('.catalog-contact__form, .newsletter-form').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var required = form.querySelectorAll('[required]');
      var valid = true;
      required.forEach(function (input) {
        var filled = String(input.value || '').trim();
        input.classList.toggle('catalog-contact__input--error', !filled);
        if (!filled) valid = false;
      });
      if (!valid) return;
      form.classList.add('is-submitted');
      var status = form.querySelector('.catalog-contact__status, .newsletter-form__status');
      if (status) status.textContent = 'Спасибо! Мы свяжемся с вами.';
    });
  });

  if (floatingClose && floatingCard) {
    floatingClose.addEventListener('click', function () {
      floatingCard.hidden = true;
    });
  }

  if (menuButton) {
    menuButton.addEventListener('click', function () {
      var open = document.body.classList.toggle('partners-menu-open');
      menuButton.setAttribute('aria-expanded', String(open));
    });
  }
})();
