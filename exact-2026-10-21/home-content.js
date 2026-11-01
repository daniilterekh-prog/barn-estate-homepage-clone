/* Eyebrows from «ЭКСТРА ФИНАЛЬНОЕ ТЗ», Главная, read 2026-10-27.
 * Runs after Nuxt hydration; leaves the immutable capture untouched.
 */
(() => {
  if (window.__barnesHomeContent) return;
  window.__barnesHomeContent = {pending: true};
  const saleImageBase = new URL('assets/', document.currentScript.src).href;
  const floatingPortrait = new URL('assets/owner-modal-prus.webp', document.currentScript.src).href;
  const roles = [
    ['.services-section__header', '.services-section__titles', 'BARN ESTATE', '.services-section__eyebrow'],
    ['.barnes-choice__heading', '.barnes-choice__title', 'Недвижимость по направлениям'],
    ['.departments-section__heading', '.departments-section__title', 'Выбрать направление'],
    ['.reviews-section__intro', '.reviews-section__title', 'Репутация BARN Estate', '.reviews-section__eyebrow'],
    ['.team-section__intro', '.team-section__title', 'Эксперты по недвижимости'],
    ['.partners-section__intro', '.partners-section__title', 'Международная сеть'],
    ['.office-contact__copy', 'h2', 'Контакт'],
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
      if (node.parentElement?.closest('script,style,textarea,[data-preserve-brand]')) continue;
      const text = brandText(node.nodeValue);
      if (text !== node.nodeValue) node.nodeValue = text;
    }
    for (const el of document.querySelectorAll('[alt],[title],[aria-label],[placeholder],meta[content]')) {
      if (el.closest('[data-preserve-brand]')) continue;
      for (const attr of ['alt','title','aria-label','placeholder', ...(el.tagName === 'META' ? ['content'] : [])]) {
        if (!el.hasAttribute(attr)) continue;
        const text = el.getAttribute(attr), updated = brandText(text);
        if (updated !== text) el.setAttribute(attr, updated);
      }
    }
    const title = brandText(document.title);
    if (document.title !== title) document.title = title;
  }
  function refreshLinks() {
    const destinations = new Map([
      ['НОВОСТРОЙКИ МОСКВЫ', 'https://barn-estate.ru/novostroyki/'],
      ['ВТОРИЧНАЯ НЕДВИЖИМОСТЬ', 'https://barn-estate.ru/vtorichnaya-nedvizhimost/']
    ]);
    for (const card of document.querySelectorAll('.department-card')) {
      const href = destinations.get(card.querySelector('.department-card__title')?.textContent.trim());
      if (href && card.tagName === 'A') { card.href = href; card.dataset.homeOriginalLink = ''; }
    }
    for (const link of document.querySelectorAll('a[href^="/"]:not([href^="//"])')) {
      const href = link.getAttribute('href');
      if (href === '/') continue;
      link.href = new URL(href, 'https://barn-estate.ru').href;
      link.dataset.homeOriginalLink = '';
    }
  }
  // Keep the archived Vue router from intercepting corrected external links.
  document.addEventListener('click', event => {
    if (event.target.closest('a[data-home-original-link]')) event.stopImmediatePropagation();
  }, true);
  // Material Icons (Apache-2.0), matching the header Call artwork.
  const contactArtwork = {"email":"<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"contact-button__icon home-contact-artwork\" width=\"26\" height=\"26\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\" data-email-icon=\"blue-envelope\"><rect x=\"1\" y=\"5\" width=\"22\" height=\"15\" rx=\"3\" fill=\"#208bd1\"/><path d=\"M2 7.2 12 14 22 7.2V7a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1Z\" fill=\"#70bff0\"/><path d=\"m2 18 7.3-5.5L12 14l2.7-1.5L22 18v.2a.8.8 0 0 1-.8.8H2.8a.8.8 0 0 1-.8-.8Z\" fill=\"#0876b9\"/><path d=\"m2.5 7.2 8.6 5.9a1.6 1.6 0 0 0 1.8 0l8.6-5.9\" fill=\"none\" stroke=\"#fff\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>","map":"<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"contact-button__icon home-contact-artwork\" width=\"26\" height=\"26\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"12\" cy=\"12\" r=\"12\" fill=\"#e94335\"/><g transform=\"translate(3 3) scale(.75)\" fill=\"#fff\"><path d=\"M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z\"/></g></svg>","phone":"<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"contact-button__icon home-contact-artwork\" width=\"26\" height=\"26\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"12\" cy=\"12\" r=\"12\" fill=\"#2BB673\"/><g transform=\"translate(3 3) scale(.75)\" fill=\"white\"><path d=\"M0 0h24v24H0z\" fill=\"none\"/><path d=\"M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z\"/></g></svg>\n"};
  function refreshContactButtons() {
    for (const link of document.querySelectorAll('.office-contact__social')) {
      const href=link.getAttribute('href')||'';
      const kind=href.startsWith('mailto:')?'email':href.startsWith('tel:')?'phone':href.includes('yandex.ru/maps')?'map':null;
      if(!kind)continue;
      const label=link.querySelector(':scope > span:not(.office-contact__arrow)');
      const text=kind==='email'?'Email':kind==='map'?'На карте':null;
      if(text&&label&&label.textContent!==text)label.textContent=text;
      if(kind==='email')link.setAttribute('aria-label','Email: '+href.slice(7));
      if(kind==='map')link.setAttribute('aria-label','На карте: офис BARN Estate, Петровка, 19');
      if(link.dataset.homeContactArtwork===kind)continue;
      const current=link.querySelector(':scope > svg,:scope > img');
      if(current){const holder=document.createElement('div');holder.innerHTML=contactArtwork[kind];current.replaceWith(holder.firstElementChild);link.dataset.homeContactArtwork=kind;}
    }
  }
  let observer, scheduled = false;
  function apply() {
    observer?.disconnect();
    window.__barnesHomeAbout?.refresh();
    for (const [parentSelector, headingSelector, text, existingSelector] of roles) {
      const parent = document.querySelector(parentSelector);
      const heading = parent?.querySelector(headingSelector);
      if (!heading) continue;
      let eyebrow = parent.querySelector('.home-section-eyebrow') || (existingSelector && parent.querySelector(existingSelector));
      if (!eyebrow) { eyebrow = document.createElement('p'); parent.insertBefore(eyebrow, heading); }
      eyebrow.classList.add('home-section-eyebrow');
      if (eyebrow.textContent !== text) eyebrow.textContent = text;
    }
    const heroVideo = document.querySelector('.home-hero__video');
    if (heroVideo?.hasAttribute('src')) {
      heroVideo.pause();
      heroVideo.removeAttribute('autoplay');
      heroVideo.removeAttribute('src');
      heroVideo.load();
    }
    const saleImage = document.querySelector('.services-section__item--wide .services-section__image');
    const saleVariant = innerWidth > 1920 ? ['wide',2160,396] : innerWidth > 540 ? ['desktop',2160,517] : ['mobile',1212,724];
    const saleServiceImage = saleImageBase + 'home-service-sale-gloss-' + saleVariant[0] + '.webp?v=gloss-20261031';
    if (saleImage && saleImage.src !== saleServiceImage) {
      saleImage.removeAttribute('srcset');
      saleImage.src = saleServiceImage;
      saleImage.width = saleVariant[1];
      saleImage.height = saleVariant[2];
    }
    const countryCard=[...document.querySelectorAll('.department-card')].find(card=>card.querySelector('.department-card__title')?.textContent.trim()==='Загородная');
    countryCard?.classList.add('department-card--country-clear');
    const countryImage=countryCard?.querySelector('.department-card__image');
    const countryPhoto=saleImageBase+'home-direction-country.webp';
    if(countryImage && countryImage.src!==countryPhoto){
      countryImage.removeAttribute('srcset');
      countryImage.src=countryPhoto;
      countryImage.width=1920;
      countryImage.height=526;
      countryImage.style.objectPosition='right center';
    }
    const recommendationTitle=document.querySelector('.barnes-choice__title');
    if(recommendationTitle && recommendationTitle.textContent!=='По рекомендации BARN\u00a0Estate')recommendationTitle.textContent='По рекомендации BARN\u00a0Estate';
    const contactTitle=document.querySelector('.office-contact__copy h2');
    if(contactTitle && contactTitle.textContent!=='СПОСОБЫ СВЯЗИ BARN ESTATE')contactTitle.textContent='СПОСОБЫ СВЯЗИ BARN ESTATE';
    const officeImage=document.querySelector('.office-contact__visual img');
    const officePhoto=saleImageBase+'home-office-estate.webp';
    if(officeImage && officeImage.src!==officePhoto){
      officeImage.removeAttribute('srcset');
      officeImage.src=officePhoto;
      officeImage.width=1563;
      officeImage.height=1006;
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
    refreshContactButtons();
    refreshLinks();
    refreshBrand();
    window.__barnesHomeAbout?.fitLogo();
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
  window.addEventListener('resize', () => window.__barnesHomeContent?.refresh?.());
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true});
  else start();
})();
