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

  function scheduleServicesEnhancement() {
    window.clearTimeout(enhancementTimer);
    enhancementTimer = window.setTimeout(enhanceServicesSection, 600);
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
