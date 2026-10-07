/* Page-local accessibility glue for the reference UI transfer. */
(function () {
  'use strict';

  var trigger;
  var menuId = 'owner-rent-site-menu';

  function syncHeroButton() {
    var body = document.querySelector('.owner-sale-hero__body');
    var title = document.querySelector('.owner-sale-hero__title');
    var actions = document.querySelector('.owner-sale-hero__actions');
    var button = document.querySelector('.owner-sale-hero__button');

    if (!body || !title || !actions || !button) return;

    if (window.innerWidth < 1025) {
      actions.style.removeProperty('margin-top');
      return;
    }

    var offset = Math.max(0, title.getBoundingClientRect().height - button.getBoundingClientRect().height);
    actions.style.marginTop = offset + 'px';
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

  new MutationObserver(syncMenuState).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class']
  });

  window.addEventListener('resize', syncHeroButton, { passive: true });
  if (window.ResizeObserver) {
    var heroTitle = document.querySelector('.owner-sale-hero__title');
    if (heroTitle) new ResizeObserver(syncHeroButton).observe(heroTitle);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      syncMenuState();
      syncHeroButton();
    }, { once: true });
  } else {
    syncMenuState();
    syncHeroButton();
  }
})();
