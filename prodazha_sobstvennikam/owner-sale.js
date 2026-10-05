(function () {
  'use strict';

  const page = document.querySelector('.owner-sale-page');
  if (!page) return;

  const menuButton = document.querySelector('[aria-label="Открыть меню"]');
  let menu = document.querySelector('.site-menu');
  const sticky = page.querySelector('.owner-sale-sticky');

  if (!menu && menuButton) {
    menu = document.createElement('aside');
    menu.className = 'owner-sale-clone-menu';
    menu.setAttribute('hidden', '');
    menu.innerHTML = '<div class="owner-sale-clone-menu__inner"><button class="owner-sale-clone-menu__close" type="button" aria-label="Закрыть меню">×</button><nav aria-label="Навигация"><a href="#stages">Процесс продажи объекта</a><a href="#about">О Барнс</a><a href="#property-types">Виды недвижимости</a><a href="#request">Оставить заявку</a><a href="#newsletter-title">Статьи</a></nav><a class="owner-sale-clone-menu__phone" href="tel:74951825079">+7 (495) 182-50-79</a></div>';
    document.body.appendChild(menu);
    menu.querySelector('.owner-sale-clone-menu__close').addEventListener('click', function () {
      menu.setAttribute('hidden', '');
      menuButton.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
    });
  }

  page.querySelectorAll('.owner-sale-services__slider-wrap').forEach(function (wrap) {
    const placeholder = wrap.querySelector(':scope > span');
    if (!placeholder || placeholder.children.length) return;

    const services = [
      'Отдельная веб-страница с презентацией объекта',
      'Адресные рассылки по клиентской базе — на почту и в мессенджеры',
      'Включение объекта в тематические подборки недвижимости',
      'Размещение в социальных сетях и на онлайн-площадках',
      'Персональный брокер, погруженный во все детали объекта',
      'Нестандартные сценарии продажи: аукцион, обмен и другие форматы',
      'Виртуальный 3D-тур для детального знакомства с объектом онлайн',
      'Профессиональная видеосъемка недвижимости',
      'Создание рекламных материалов для продвижения объекта',
      'Профессиональная фотосъемка и обработка изображений',
      'Брендированный баннер на объекте'
    ];

    const slider = document.createElement('div');
    slider.className = 'splide owner-sale-services__slider is-overflow is-initialized splide--slide splide--ltr splide--draggable is-active';
    slider.setAttribute('data-v-2d6c67d9', '');
    slider.setAttribute('role', 'region');
    slider.setAttribute('aria-label', 'Список услуг');
    slider.innerHTML = '<div class="splide__track" data-v-2d6c67d9=""><ul class="splide__list" data-v-2d6c67d9="">' + services.map(function (service, index) {
      const number = String(index + 1).padStart(2, '0');
      return '<li class="splide__slide" data-v-2d6c67d9="" style="width: calc(25vw - 13px);"><article class="owner-sale-services__card" data-v-2d6c67d9=""><span class="owner-sale-services__number" data-v-2d6c67d9="">' + number + '</span><p class="owner-sale-services__text" data-v-2d6c67d9="">' + service + '</p></article></li>';
    }).join('') + '</ul></div>';
    placeholder.replaceWith(slider);
  });

  if (menuButton && menu) {
    menuButton.addEventListener('click', function () {
      const isOpen = menu.hasAttribute('hidden') === false;
      menu.toggleAttribute('hidden', isOpen);
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      document.body.classList.toggle('no-scroll', !isOpen);
    });
  }

  document.querySelectorAll('.site-menu__close, .site-menu__overlay').forEach(function (control) {
    control.addEventListener('click', function () {
      if (!menu) return;
      menu.setAttribute('hidden', '');
      if (menuButton) menuButton.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
    });
  });

  const syncSticky = function () {
    if (!sticky) return;
    sticky.classList.toggle('owner-sale-sticky--visible', window.scrollY > window.innerHeight * 0.72);
  };
  window.addEventListener('scroll', syncSticky, { passive: true });
  syncSticky();

  page.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  page.querySelectorAll('.owner-sale-services').forEach(function (section) {
    const slider = section.querySelector('.owner-sale-services__slider');
    const list = slider && slider.querySelector('.splide__list');
    const previous = section.querySelector('.owner-sale-services__nav-btn:first-child');
    const next = section.querySelector('.owner-sale-services__nav-btn:last-child');
    if (!slider || !list || !previous || !next) return;

    let offset = 0;
    const step = function () {
      const card = list.querySelector('.splide__slide');
      return card ? card.getBoundingClientRect().width : 0;
    };
    const maxOffset = function () {
      return Math.max(0, list.scrollWidth - slider.querySelector('.splide__track').clientWidth);
    };
    const render = function () {
      list.style.transform = 'translateX(' + (-offset) + 'px)';
      previous.disabled = offset <= 0;
      next.disabled = offset >= maxOffset() - 1;
    };
    previous.addEventListener('click', function () {
      offset = Math.max(0, offset - step());
      render();
    });
    next.addEventListener('click', function () {
      offset = Math.min(maxOffset(), offset + step());
      render();
    });
    window.addEventListener('resize', function () {
      offset = Math.min(offset, maxOffset());
      render();
    });
    render();
  });

  page.querySelectorAll('[role="tablist"]').forEach(function (tablist) {
    const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (item) {
          item.setAttribute('aria-selected', String(item === tab));
          item.classList.toggle('is-active', item === tab);
        });
      });
    });
  });

  page.querySelectorAll('form').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const submit = form.querySelector('button[type="submit"], button');
      if (!submit) return;
      const original = submit.textContent;
      submit.textContent = 'Спасибо, заявка отправлена';
      submit.disabled = true;
      window.setTimeout(function () {
        submit.textContent = original;
        submit.disabled = false;
      }, 2600);
    });
  });

  document.querySelectorAll('.floating-expert__close').forEach(function (close) {
    close.addEventListener('click', function (event) {
      event.stopPropagation();
      const card = close.closest('.floating-expert');
      if (card) card.remove();
    });
  });
}());
