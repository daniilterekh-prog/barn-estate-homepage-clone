/* Page-local accessibility glue for the reference UI transfer. */
(function () {
  'use strict';

  var trigger;
  var menuId = 'owner-rent-site-menu';
  var enhancementTimer;

  function enhanceServicesSection() {
    var section = document.querySelector('.owner-sale-services');
    var headerWrap = section && section.querySelector('.owner-sale-services__header-wrap');

    if (!section || !headerWrap || section.querySelector('.owner-sale-services__reference')) return;

    var eyebrow = document.createElement('p');
    eyebrow.className = 'owner-sale-services__eyebrow';
    eyebrow.textContent = 'ЕДИНАЯ КОМАНДА BARNES';
    headerWrap.insertBefore(eyebrow, headerWrap.firstChild);

    var enhancement = document.createElement('div');
    enhancement.className = 'owner-sale-services__reference';
    enhancement.innerHTML = [
      '<div class="owner-sale-services__comparison" aria-label="Сравнение подходов к сдаче объекта">',
      '  <article class="owner-sale-services__comparison-card owner-sale-services__comparison-card--primary">',
      '    <h3>ОДНА КОМАНДА BARNES</h3>',
      '    <ul>',
      '      <li>Одна цена и стратегия</li>',
      '      <li>Один ответственный брокер</li>',
      '      <li>Все обращения в одном месте</li>',
      '    </ul>',
      '  </article>',
      '  <article class="owner-sale-services__comparison-card">',
      '    <h3>НЕСКОЛЬКО АГЕНТСТВ</h3>',
      '    <ul>',
      '      <li>Разные цены и позиционирование</li>',
      '      <li>Несогласованные условия</li>',
      '      <li>Несколько точек коммуникации</li>',
      '    </ul>',
      '  </article>',
      '</div>',
      '<div class="owner-sale-services__process" role="img" aria-label="Один объект, одна стратегия, один ответственный результат">',
      '  <span><strong>01</strong>Объект</span>',
      '  <i aria-hidden="true">→</i>',
      '  <span><strong>02</strong>Стратегия</span>',
      '  <i aria-hidden="true">→</i>',
      '  <span><strong>03</strong>Ответственный результат</span>',
      '</div>',
      '<a class="ui-button ui-button--primary ui-button--medium owner-sale-services__cta" href="#request">Обсудить стратегию сдачи <span aria-hidden="true">↗</span></a>'
    ].join('');

    section.appendChild(enhancement);
    section.dataset.referenceEnhanced = 'true';
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
