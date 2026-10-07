/* Page-local accessibility glue for the reference UI transfer. */
(function () {
  'use strict';

  var trigger;
  var menuId = 'owner-rent-site-menu';

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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncMenuState, { once: true });
  } else {
    syncMenuState();
  }
})();
