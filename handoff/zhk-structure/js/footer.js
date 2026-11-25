/* Keep the shared footer contacts clear of the page-specific mobile action bar. */
(() => {
  const footer = document.querySelector('.site-footer');
  const actions = document.querySelector('.mobile-action');
  if (!footer || !actions) return;
  new IntersectionObserver(([entry]) => {
    actions.hidden = entry.isIntersecting;
  }, { threshold: 0 }).observe(footer);
})();
