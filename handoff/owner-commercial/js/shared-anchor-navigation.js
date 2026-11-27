(function () {
  'use strict';

  var frame;
  function updateActiveSection() {
    frame = null;
    var sticky = document.querySelector('.owner-sale-sticky');
    if (!sticky) return;
    var links = Array.from(sticky.querySelectorAll('.owner-sale-sticky__link[href^="#"]'));
    var threshold = sticky.getBoundingClientRect().height + 32;
    var current = null;
    var currentTop = -Infinity;
    links.forEach(function (link) {
      var section = document.getElementById(link.hash.slice(1));
      if (!section) return;
      var top = section.getBoundingClientRect().top;
      var anchorOffset = parseFloat(window.getComputedStyle(section).scrollMarginTop) || 0;
      if (top <= Math.max(threshold, anchorOffset + 1) && top > currentTop) {
        current = link;
        currentTop = top;
      }
    });
    links.forEach(function (link) {
      var active = link === current;
      link.classList.toggle('owner-sale-sticky__link--active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function scheduleUpdate() {
    if (!frame) frame = window.requestAnimationFrame(updateActiveSection);
  }

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('hashchange', scheduleUpdate);
  new MutationObserver(function (mutations) {
    if (mutations.some(function (mutation) {
      return mutation.target instanceof Element &&
        (mutation.target.closest('.owner-sale-sticky') || Array.from(mutation.addedNodes).some(function (node) {
          return node instanceof Element && (node.matches('.owner-sale-sticky') || node.querySelector('.owner-sale-sticky'));
        }));
    })) scheduleUpdate();
  }).observe(document.body, { childList: true, subtree: true });
  if (document.fonts) document.fonts.ready.then(scheduleUpdate);
  scheduleUpdate();
})();
