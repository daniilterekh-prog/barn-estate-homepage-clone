/* Eyebrows from «ЭКСТРА ФИНАЛЬНОЕ ТЗ», Главная, read 2026-10-27.
 * Runs after Nuxt hydration; leaves the immutable capture untouched.
 */
(() => {
  if (window.__barnesHomeContent) return;
  window.__barnesHomeContent = {pending: true};
  const saleServiceImage = new URL('assets/home-service-sale-original.webp', document.currentScript.src).href;
  const floatingPortrait = new URL('assets/owner-modal-prus.webp', document.currentScript.src).href;
  const roles = [
    ['.services-section__header', '.services-section__titles', 'BARN ESTATE', '.services-section__eyebrow'],
    ['.barnes-choice__heading', '.barnes-choice__title', 'Недвижимость по направлениям'],
    ['.departments-section__heading', '.departments-section__title', 'Выбрать направление'],
    ['.reviews-section__intro', '.reviews-section__title', 'Репутация BARN Estate', '.reviews-section__eyebrow'],
    ['.team-section__intro', '.team-section__title', 'Эксперты по недвижимости'],
    ['.partners-section__intro', '.partners-section__title', 'Международная сеть'],
    ['.office-contact__copy', 'h2', 'Связь с BARN Estate'],
    ['.news-section__header', '.news-section__title', 'Медиа BARN Estate', '.news-section__eyebrow'],
    ['.newsletter-cta__copy', 'h2', 'Рассылка BARN Estate'],
    ['.about-company__content', '.about-company__title', 'О компании']
  ];
  const oldBrand = /(?<![\w@./-])barnes(?:\s+(?:moscow|international\s+realty))?(?![\w@./-])|(?<![а-яё])барн(?:с|ес)(?![а-яё])/giu;
  const brandText = value => value.replace(oldBrand, 'BARN Estate');
  function refreshBrand() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.parentElement?.closest('script,style,textarea')) continue;
      const text = brandText(node.nodeValue);
      if (text !== node.nodeValue) node.nodeValue = text;
    }
    for (const el of document.querySelectorAll('[alt],[title],[aria-label],[placeholder],meta[content]')) {
      for (const attr of ['alt','title','aria-label','placeholder', ...(el.tagName === 'META' ? ['content'] : [])]) {
        if (!el.hasAttribute(attr)) continue;
        const text = el.getAttribute(attr), updated = brandText(text);
        if (updated !== text) el.setAttribute(attr, updated);
      }
    }
    const title = brandText(document.title);
    if (document.title !== title) document.title = title;
  }
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
    const saleImage = document.querySelector('.services-section__item--wide .services-section__image');
    if (saleImage && saleImage.src !== saleServiceImage) {
      saleImage.removeAttribute('srcset');
      saleImage.src = saleServiceImage;
      saleImage.width = 1823;
      saleImage.height = 863;
    }
    const avatar = document.querySelector('.floating-expert__avatar img');
    if (avatar && avatar.src !== floatingPortrait) {
      avatar.removeAttribute('srcset');
      avatar.src = floatingPortrait;
      avatar.width = 1086;
      avatar.height = 1448;
    }
    const copyright = document.querySelector('.site-footer__copyright');
    if (copyright && copyright.textContent !== '© 2026 BARN ESTATE') copyright.textContent = '© 2026 BARN ESTATE';
    const hours = document.querySelector('.site-footer__hours');
    if (hours && hours.textContent !== 'Ежедневно с 09:00 до 21:00') hours.textContent = 'Ежедневно с 09:00 до 21:00';
    refreshBrand();
    window.__barnesHeaderContacts?.refresh();
    window.__barnesRecommendations?.refresh();
    window.__barnesOwnerForm?.refresh();
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
