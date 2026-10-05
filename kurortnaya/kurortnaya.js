(function () {
  'use strict';
  const root = document.querySelector('.kurortnaya-page');
  if (!root) return;
  const scrollToId = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  document.querySelectorAll('[data-scroll-to]').forEach((button) => button.addEventListener('click', () => scrollToId(button.dataset.scrollTo)));

  const pageNav = document.querySelector('[data-page-nav]');
  const hero = document.querySelector('.catalog-hero');
  const updateNav = () => pageNav?.classList.toggle('catalog-page-nav--visible', window.scrollY > (hero?.offsetHeight || 580) - 110);
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  document.querySelectorAll('[data-filter-toggle], [data-filter-close]').forEach((control) => control.addEventListener('click', () => {
    const panel = document.querySelector('[data-filter-panel]');
    const toggle = document.querySelector('[data-filter-toggle]');
    const nextOpen = panel?.hasAttribute('hidden');
    panel?.toggleAttribute('hidden', !nextOpen);
    toggle?.setAttribute('aria-expanded', String(nextOpen));
  }));
  document.querySelector('[data-search-form]')?.addEventListener('submit', (event) => {
    event.preventDefault();
    scrollToId('catalog-grid');
  });

  document.querySelectorAll('[data-favorite]').forEach((button) => button.addEventListener('click', () => {
    const active = button.getAttribute('aria-pressed') === 'true';
    button.setAttribute('aria-pressed', String(!active));
    button.textContent = active ? '♡' : '♥';
  }));

  const list = document.querySelector('[data-catalog-list]');
  document.querySelector('[data-sort]')?.addEventListener('change', (event) => {
    const items = [...(list?.children || [])];
    if (event.target.value === 'price_asc') items.sort((a, b) => Number(a.dataset.price) - Number(b.dataset.price));
    if (event.target.value === 'price_desc') items.sort((a, b) => Number(b.dataset.price) - Number(a.dataset.price));
    items.forEach((item) => list.appendChild(item));
  });
  document.querySelector('[data-more]')?.addEventListener('click', (event) => { event.currentTarget.textContent = 'Все проекты загружены'; });

  document.querySelector('[data-intro-toggle]')?.addEventListener('click', (event) => {
    const details = document.querySelector('[data-intro-details]');
    const open = event.currentTarget.getAttribute('aria-expanded') === 'true';
    event.currentTarget.setAttribute('aria-expanded', String(!open));
    details?.setAttribute('aria-hidden', String(open));
    if (details) details.style.maxHeight = open ? '0px' : `${details.scrollHeight}px`;
    event.currentTarget.firstChild.textContent = open ? 'читать далее ' : 'свернуть ';
  });

  document.querySelectorAll('[data-faq-button]').forEach((button) => button.addEventListener('click', () => {
    const item = button.closest('[data-v-d09db9d2]');
    const answer = item?.querySelector('[data-faq-answer]');
    const open = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!open));
    item?.classList.toggle('catalog-faq__item--open', !open);
    answer?.classList.toggle('catalog-faq__answer--open', !open);
  }));

  const modal = document.querySelector('[data-contact-modal]');
  const openModal = () => { if (modal) { modal.hidden = false; document.body.classList.add('modal-open'); modal.querySelector('input')?.focus(); } };
  const closeModal = () => { if (modal) modal.hidden = true; document.body.classList.remove('modal-open'); };
  document.querySelectorAll('[data-open-contact]').forEach((button) => button.addEventListener('click', openModal));
  document.querySelectorAll('[data-contact-close]').forEach((button) => button.addEventListener('click', closeModal));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModal(); });
  document.querySelectorAll('[data-consultation-form], [data-contact-form], [data-modal-form]').forEach((form) => form.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = form.querySelector('[data-form-status]') || document.querySelector('[data-contact-modal] [data-form-status]');
    if (status) status.textContent = 'Спасибо! Мы свяжемся с вами в ближайшее время.';
    form.reset();
  }));
  document.querySelector('[data-floating-close]')?.addEventListener('click', (event) => event.currentTarget.closest('[data-floating-expert]')?.remove());
})();
