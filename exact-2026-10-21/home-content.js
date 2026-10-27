/* Eyebrows from «ЭКСТРА ФИНАЛЬНОЕ ТЗ», Главная, read 2026-10-27.
 * Runs after Nuxt hydration; leaves the immutable capture untouched.
 */
(() => {
  if (window.__barnesHomeContent) return;
  window.__barnesHomeContent = {pending: true};
  const roles = [
    ['.services-section__header', '.services-section__titles', 'BARNES MOSCOW', '.services-section__eyebrow'],
    ['.barnes-choice__heading', '.barnes-choice__title', 'Недвижимость по направлениям'],
    ['.departments-section__heading', '.departments-section__title', 'Выбрать направление'],
    ['.reviews-section__intro', '.reviews-section__title', 'Репутация BARNES', '.reviews-section__eyebrow'],
    ['.team-section__intro', '.team-section__title', 'Эксперты по недвижимости'],
    ['.partners-section__intro', '.partners-section__title', 'Международная сеть'],
    ['.office-contact__copy', 'h2', 'Связь с BARNES'],
    ['.news-section__header', '.news-section__title', 'Медиа BARNES', '.news-section__eyebrow'],
    ['.newsletter-cta__copy', 'h2', 'Рассылка BARNES'],
    ['.about-company__content', '.about-company__title', 'О компании']
  ];
  let observer, scheduled = false;
  function apply() {
    observer?.disconnect();
    for (const [parentSelector, headingSelector, text, existingSelector] of roles) {
      const parent = document.querySelector(parentSelector);
      const heading = parent?.querySelector(headingSelector);
      if (!heading) continue;
      let eyebrow = parent.querySelector('.home-section-eyebrow') || (existingSelector && parent.querySelector(existingSelector));
      if (!eyebrow) { eyebrow = document.createElement('p'); parent.insertBefore(eyebrow, heading); }
      eyebrow.classList.add('home-section-eyebrow');
      if (eyebrow.textContent !== text) eyebrow.textContent = text;
    }
    document.body.dataset.homeSpacingReady = 'true';
    observer?.observe(document.querySelector('#__nuxt'), {childList:true, subtree:true});
  }
  function start() {
    const app = document.querySelector('#__nuxt')?.__vue_app__;
    if (!app || app.config.globalProperties.$nuxt?.isHydrating !== false) { setTimeout(start, 50); return; }
    observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => { scheduled = false; apply(); });
    });
    window.__barnesHomeContent = {refresh: apply};
    apply();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true});
  else start();
})();
