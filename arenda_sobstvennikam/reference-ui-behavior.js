/* Page-local accessibility glue for the reference UI transfer. */
(function () {
  'use strict';

  var trigger;
  var menuId = 'owner-rent-site-menu';
  var enhancementTimer;
  var exclusiveScrollFrame;
  var exclusiveScrollReady = false;

  function enhanceServicesSection() {
    var section = document.querySelector('.owner-sale-services');
    var headerWrap = section && section.querySelector('.owner-sale-services__header-wrap');
    var title = section && section.querySelector('.owner-sale-services__title');

    if (!section || !headerWrap) return;

    if (title) {
      title.id = 'owner-rent-services-title';
      section.setAttribute('aria-labelledby', title.id);
      section.removeAttribute('aria-label');
    }

    if (!headerWrap.querySelector('.owner-sale-services__eyebrow')) {
      var eyebrow = document.createElement('p');
      eyebrow.className = 'owner-sale-services__eyebrow';
      eyebrow.textContent = 'ЕДИНАЯ КОМАНДА BARNES';
      headerWrap.insertBefore(eyebrow, headerWrap.firstChild);
    }

    section.querySelectorAll('.owner-sale-services__text').forEach(function (text) {
      if (text.querySelector('strong')) return;

      var copy = text.textContent.trim().split(' — ');
      if (copy.length < 2) return;

      text.textContent = '';
      var lead = document.createElement('strong');
      lead.textContent = copy.shift();
      var detail = document.createElement('span');
      detail.textContent = copy.join(' — ');
      text.append(lead, detail);
    });

    if (!section.querySelector('.owner-sale-services__cta')) {
      var cta = document.createElement('a');
      cta.className = 'ui-button ui-button--primary ui-button--medium owner-sale-services__cta';
      cta.href = '#request';
      cta.innerHTML = 'Обсудить стратегию сдачи <span aria-hidden="true">↗</span>';
      section.appendChild(cta);
    }
  }

  function enhanceExclusiveSection() {
    var section = document.querySelector('.owner-sale-exclusive');
    var inner = section && section.querySelector('.owner-sale-exclusive__inner');
    var title = section && section.querySelector('.owner-sale-exclusive__title');
    var itemTitles = [
      'Единая подача',
      'Расширенный охват',
      'Персональный брокер',
      'Обоснованная ставка',
      'Проверка арендаторов',
      'Полное сопровождение'
    ];

    if (!section || !inner || !title) return;

    title.id = 'owner-rent-exclusive-title';
    section.setAttribute('aria-labelledby', title.id);
    section.removeAttribute('aria-label');

    if (!inner.querySelector('.owner-sale-exclusive__eyebrow')) {
      var eyebrow = document.createElement('p');
      eyebrow.className = 'owner-sale-exclusive__eyebrow';
      eyebrow.textContent = 'BARNES / ЭКСКЛЮЗИВ';
      inner.insertBefore(eyebrow, title);
    }

    if (!inner.querySelector('.owner-sale-exclusive__header')) {
      var header = document.createElement('header');
      var sectionEyebrow = inner.querySelector('.owner-sale-exclusive__eyebrow');
      header.className = 'owner-sale-exclusive__header';
      inner.insertBefore(header, sectionEyebrow);
      header.append(sectionEyebrow, title);
    }

    if (!title.querySelector('.owner-sale-exclusive__title-line')) {
      title.setAttribute(
        'aria-label',
        'Преимущества эксклюзивной работы с BARNES'
      );
      title.innerHTML = [
        'ПРЕИМУЩЕСТВА ЭКСКЛЮЗИВНОЙ',
        'РАБОТЫ С BARNES'
      ].map(function (line) {
        return '<span class="owner-sale-exclusive__title-line" aria-hidden="true">' + line + '</span>';
      }).join('');
    }

    section.querySelectorAll('.owner-sale-exclusive__item').forEach(function (item, index) {
      if (item.querySelector('.owner-sale-exclusive__number')) return;

      var text = item.querySelector('.owner-sale-exclusive__text');
      if (!text) return;

      var number = document.createElement('span');
      number.className = 'owner-sale-exclusive__number';
      number.setAttribute('aria-hidden', 'true');
      number.textContent = String(index + 1).padStart(2, '0');

      var content = document.createElement('div');
      content.className = 'owner-sale-exclusive__content';

      var heading = document.createElement('h3');
      heading.className = 'owner-sale-exclusive__item-title';
      heading.textContent = itemTitles[index] || '';

      item.insertBefore(number, item.firstChild);
      content.append(heading, text);
      item.appendChild(content);
    });
  }

  function updateExclusiveScrollState() {
    var section = document.querySelector('.owner-sale-exclusive');
    var items = section && Array.from(section.querySelectorAll('.owner-sale-exclusive__item'));
    var header = section && section.querySelector('.owner-sale-exclusive__header');
    var desktop = window.matchMedia('(min-width: 901px)').matches;

    if (!section || !items.length) return;

    if (!desktop) {
      section.classList.remove('owner-sale-exclusive--scroll-ready');
      items.forEach(function (item) {
        item.classList.remove('is-active', 'is-past');
      });
      return;
    }

    var alignmentLine = header ? parseFloat(window.getComputedStyle(header).top) : 120;
    if (!Number.isFinite(alignmentLine)) alignmentLine = 120;
    var activeIndex = 0;
    var closestDistance = Infinity;

    items.forEach(function (item, index) {
      var distance = Math.abs(item.getBoundingClientRect().top - alignmentLine);
      if (distance < closestDistance) {
        closestDistance = distance;
        activeIndex = index;
      }
    });

    section.classList.add('owner-sale-exclusive--scroll-ready');
    items.forEach(function (item, index) {
      item.classList.toggle('is-active', index === activeIndex);
      item.classList.toggle('is-past', index < activeIndex);
    });
  }

  function requestExclusiveScrollUpdate() {
    if (exclusiveScrollFrame) return;

    exclusiveScrollFrame = window.requestAnimationFrame(function () {
      exclusiveScrollFrame = null;
      updateExclusiveScrollState();
    });
  }

  function setupExclusiveScrollAnimation() {
    if (!exclusiveScrollReady) {
      exclusiveScrollReady = true;
      window.addEventListener('scroll', requestExclusiveScrollUpdate, { passive: true });
      window.addEventListener('resize', requestExclusiveScrollUpdate, { passive: true });
    }

    requestExclusiveScrollUpdate();
  }

  function enhanceSectionHeadings() {
    var sections = [
      {
        selector: '.owner-sale-presentation__title',
        eyebrow: 'СТРАТЕГИЯ ПРЕЗЕНТАЦИИ',
        id: 'owner-rent-presentation-title'
      },
      {
        selector: '.about-company__title',
        eyebrow: 'BARNES / МОСКВА',
        id: 'owner-rent-about-title'
      },
      {
        selector: '.catalog-contact__title',
        eyebrow: 'КОНСУЛЬТАЦИЯ ЭКСПЕРТА',
        id: 'owner-rent-contact-title'
      },
      {
        selector: '.newsletter-cta h2',
        eyebrow: 'BARNES / АНАЛИТИКА',
        id: 'owner-rent-newsletter-title'
      }
    ];

    sections.forEach(function (config) {
      var title = document.querySelector(config.selector);
      var section = title && title.closest('section');
      var container = title && title.parentElement;

      if (!title || !container) return;

      title.id = config.id;
      if (section) section.setAttribute('aria-labelledby', config.id);

      var eyebrow = container.querySelector(':scope > .owner-rent-section-eyebrow');
      if (!eyebrow) {
        eyebrow = document.createElement('p');
        eyebrow.className = 'owner-rent-section-eyebrow';
        eyebrow.textContent = config.eyebrow;
        container.insertBefore(eyebrow, title);
      }
    });

    document.querySelectorAll(
      '.owner-sale-services__eyebrow, .owner-sale-exclusive__eyebrow'
    ).forEach(function (eyebrow) {
      eyebrow.classList.add('owner-rent-section-eyebrow');
    });
  }

  function scheduleServicesEnhancement() {
    window.clearTimeout(enhancementTimer);
    enhancementTimer = window.setTimeout(function () {
      enhanceServicesSection();
      enhanceExclusiveSection();
      enhanceSectionHeadings();
      setupExclusiveScrollAnimation();
    }, 600);
  }

  function syncMenuState() {
    trigger = document.querySelector('.site-header__icon-btn');
    var menu = document.querySelector('.site-menu');

    if (!trigger) return;

    trigger.setAttribute('aria-controls', menuId);
    trigger.setAttribute('aria-expanded', menu ? 'true' : 'false');
    trigger.setAttribute('aria-label', menu ? 'Закрыть меню' : 'Открыть меню');

    if (menu) {
      menu.id = menuId;
      menu.setAttribute('aria-label', 'Основное меню');
    }
  }

  document.addEventListener('click', function (event) {
    if (event.target.closest && event.target.closest('.site-header__icon-btn')) {
      syncMenuState();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;

    window.setTimeout(function () {
      syncMenuState();
      if (!document.querySelector('.site-menu') && trigger) trigger.focus();
    }, 0);
  });

  new MutationObserver(function () {
    syncMenuState();
    scheduleServicesEnhancement();
  }).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class']
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      syncMenuState();
      scheduleServicesEnhancement();
    }, { once: true });
  } else {
    syncMenuState();
    scheduleServicesEnhancement();
  }
})();
