/* Page-local accessibility glue for the reference UI transfer. */
(function () {
  'use strict';

  var trigger;
  var menuId = 'owner-rent-site-menu';
  var enhancementTimer;

  function enhanceServicesSection() {
    var section = document.querySelector('.owner-sale-services');
    var headerWrap = section && section.querySelector('.owner-sale-services__header-wrap');

    if (!section || !headerWrap) return;

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

    if (!title.querySelector('br')) {
      title.innerHTML = 'ПРЕИМУЩЕСТВА<br>ЭКСКЛЮЗИВНОЙ<br>РАБОТЫ С BARNES';
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

  function scheduleServicesEnhancement() {
    window.clearTimeout(enhancementTimer);
    enhancementTimer = window.setTimeout(function () {
      enhanceServicesSection();
      enhanceExclusiveSection();
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
