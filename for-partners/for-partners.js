(function () {
  'use strict';

  var page = document.querySelector('.ambassadors-page');
  if (!page) return;

  var sliderStyle = document.createElement('style');
  sliderStyle.textContent = [
    '@media (max-width: 768px) { .ambassadors-advantages__slider .splide__slide { margin-right: 12px !important; width: calc(100% + 0px) !important; } }',
    '@media (min-width: 769px) and (max-width: 1024px) { .ambassadors-advantages__slider .splide__slide { margin-right: 16px !important; width: calc(50% - 8px) !important; } }',
    '@media (min-width: 1025px) { .ambassadors-advantages__slider .splide__slide { margin-right: 20px !important; width: calc(33.3333% - 13.3333px) !important; } }'
  ].join('');
  document.head.appendChild(sliderStyle);

  var header = document.querySelector('.site-header');
  var menuButton = document.querySelector('.site-header__icon-btn');
  var floatingCard = document.querySelector('.floating-expert__card');
  var floatingClose = document.querySelector('.floating-expert__close');

  function setScrolledHeader() {
    if (!header) return;
    header.classList.toggle('site-header--scrolled', window.scrollY > 24);
  }

  window.addEventListener('scroll', setScrolledHeader, { passive: true });
  setScrolledHeader();

  function scrollToTarget(selector) {
    var target = document.querySelector(selector);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  document.querySelectorAll('.ambassadors-hero__button--primary, .owner-sale-stages__offer-btn, .catalog-contact__card-submit').forEach(function (button) {
    button.addEventListener('click', function () { scrollToTarget('.catalog-contact'); });
  });
  document.querySelectorAll('.ambassadors-hero__button--secondary').forEach(function (button) {
    button.addEventListener('click', function () { scrollToTarget('#conditions'); });
  });

  document.querySelectorAll('.catalog-contact__method').forEach(function (button) {
    button.addEventListener('click', function () {
      document.querySelectorAll('.catalog-contact__method').forEach(function (item) {
        item.classList.remove('catalog-contact__method--active');
      });
      button.classList.add('catalog-contact__method--active');
    });
  });

  document.querySelectorAll('.catalog-faq__question').forEach(function (button) {
    button.addEventListener('click', function () {
      var item = button.closest('.catalog-faq__item');
      var answer = item && item.querySelector('.catalog-faq__answer');
      var isOpen = item && item.classList.toggle('catalog-faq__item--open');
      button.setAttribute('aria-expanded', String(Boolean(isOpen)));
      if (answer) answer.classList.toggle('catalog-faq__answer--open', Boolean(isOpen));
    });
  });

  var requestTabs = Array.prototype.slice.call(document.querySelectorAll('.ambassadors-requests__tab'));
  requestTabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () {
      requestTabs.forEach(function (item) { item.classList.remove('ambassadors-requests__tab--active'); });
      tab.classList.add('ambassadors-requests__tab--active');
      page.dataset.requestIndex = String(index);
    });
  });

  var advantages = document.querySelector('.ambassadors-advantages__slider');
  var previous = document.querySelector('.ambassadors-advantages__nav-btn[aria-label*="Предыдущее"]');
  var next = document.querySelector('.ambassadors-advantages__nav-btn[aria-label*="Следующее"]');
  var advantageIndex = 0;
  function moveAdvantages(direction) {
    if (!advantages) return;
    var list = advantages.querySelector('.splide__list');
    var cards = list && list.querySelectorAll('.splide__slide');
    if (!list || !cards || cards.length < 2) return;
    advantageIndex = (advantageIndex + direction + cards.length) % cards.length;
    list.style.transform = 'translateX(' + (-advantageIndex * 100) + '%)';
  }
  if (previous) previous.addEventListener('click', function () { moveAdvantages(-1); });
  if (next) {
    next.disabled = false;
    next.addEventListener('click', function () { moveAdvantages(1); });
  }

  document.querySelectorAll('.catalog-contact__form, .newsletter-form').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var required = form.querySelectorAll('[required]');
      var valid = true;
      required.forEach(function (input) {
        var filled = String(input.value || '').trim();
        input.classList.toggle('catalog-contact__input--error', !filled);
        if (!filled) valid = false;
      });
      if (!valid) return;
      form.classList.add('is-submitted');
      var status = form.querySelector('.catalog-contact__status, .newsletter-form__status');
      if (status) status.textContent = 'Спасибо! Мы свяжемся с вами.';
    });
  });

  if (floatingClose && floatingCard) {
    floatingClose.addEventListener('click', function () {
      floatingCard.hidden = true;
    });
  }

  if (menuButton) {
    menuButton.addEventListener('click', function () {
      var open = document.body.classList.toggle('partners-menu-open');
      menuButton.setAttribute('aria-expanded', String(open));
    });
  }
})();
