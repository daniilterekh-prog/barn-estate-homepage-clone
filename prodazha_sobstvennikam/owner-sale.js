(function () {
  'use strict';

  const page = document.querySelector('.owner-sale-page');
  if (!page) return;

  const menuButton = document.querySelector('[aria-label="Открыть меню"]');
  let menu = document.querySelector('.site-menu');
  const sticky = page.querySelector('.owner-sale-sticky');
  const header = document.querySelector('.site-header');
  const lockBodyScroll = function () {
    const scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
    document.body.style.paddingRight = scrollbarWidth ? scrollbarWidth + 'px' : '';
    document.body.style.overflow = 'hidden';
  };
  const unlockBodyScroll = function () {
    document.body.style.paddingRight = '';
    document.body.style.overflow = '';
  };

  if (!menu && menuButton) {
    menu = document.createElement('aside');
    menu.className = 'owner-sale-clone-menu';
    menu.setAttribute('hidden', '');
    menu.innerHTML = '<div class="owner-sale-clone-menu__inner"><button class="owner-sale-clone-menu__close" type="button" aria-label="Закрыть меню">×</button><nav aria-label="Навигация"><a href="#stages">Процесс продажи объекта</a><a href="#about">О Барнс</a><a href="#property-types">Виды недвижимости</a><a href="#request">Оставить заявку</a><a href="#newsletter-title">Статьи</a></nav><a class="owner-sale-clone-menu__phone" href="tel:74951825079">+7 (495) 182-50-79</a></div>';
    document.body.appendChild(menu);
    menu.querySelector('.owner-sale-clone-menu__close').addEventListener('click', function () {
      menu.setAttribute('hidden', '');
      menuButton.setAttribute('aria-expanded', 'false');
      unlockBodyScroll();
    });
  }

  if (!document.querySelector('.floating-expert')) {
    const expert = document.createElement('aside');
    expert.className = 'floating-expert floating-expert--gorodskaya';
    expert.setAttribute('aria-label', 'Руслан Прус');
    expert.innerHTML = '<button type="button" class="floating-expert__card" aria-haspopup="dialog"><span class="floating-expert__avatar"><img src="assets/ruslan.webp" alt="Руслан Прус" width="72" height="72" loading="lazy" decoding="async"></span><span class="floating-expert__content"><span class="floating-expert__label">Руководитель департамента городской недвижимости</span><span class="floating-expert__title">Задать вопрос эксперту</span><span class="floating-expert__name">Руслан Прус</span></span></button><button type="button" class="floating-expert__close" aria-label="Скрыть карточку Руслан Прус"></button>';
    expert.querySelectorAll('*').forEach(function (element) {
      element.setAttribute('data-v-cd0a1259', '');
    });
    expert.setAttribute('data-v-cd0a1259', '');
    document.body.appendChild(expert);

    const feedbackModal = document.createElement('div');
    feedbackModal.className = 'modal feedback-modal vfm vfm--fixed vfm--inset';
    feedbackModal.setAttribute('role', 'dialog');
    feedbackModal.setAttribute('aria-modal', 'true');
    feedbackModal.setAttribute('hidden', '');
    feedbackModal.innerHTML = '<div class="vfm__overlay vfm--overlay vfm--absolute vfm--inset vfm--prevent-none" aria-hidden="true"></div><div class="vfm__content vfm--outline-none modal__content" tabindex="0"><button type="button" class="modal__close" aria-label="Закрыть"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg></button><div class="feedback-modal__layout"><div class="feedback-modal__hero"><img src="assets/feedback-hero.webp" alt="" class="feedback-modal__hero-image" width="840" height="360" loading="lazy"><div class="feedback-modal__hero-overlay" aria-hidden="true"></div><div class="feedback-modal__brand"><img src="assets/logo.svg" alt="BARNES Moscow" class="feedback-modal__logo" width="220" height="30"></div></div><div class="feedback-modal__body"><h2 class="feedback-modal__title">Обратная связь</h2><form class="feedback-modal__form" novalidate><div class="feedback-modal__honeypot" aria-hidden="true"><input type="text" tabindex="-1" autocomplete="off"></div><label class="feedback-modal__field"><input type="text" class="feedback-modal__input" autocomplete="name" placeholder="Введите Ваше Имя:"></label><label class="feedback-modal__field"><input type="text" inputmode="tel" class="feedback-modal__input" autocomplete="tel" placeholder="Ваш номер телефона:"></label><button formnovalidate type="submit" class="ui-button ui-button--primary ui-button--large ui-button--full feedback-modal__submit">Отправить заявку</button><label class="feedback-modal__consent"><input type="checkbox" class="feedback-modal__consent-input"><span class="feedback-modal__consent-box" aria-hidden="true"></span><span class="feedback-modal__consent-text"> Я даю согласие на обработку <a class="feedback-modal__consent-link" target="_blank" href="https://front.barnes.vsavr.ru/legal_notices/yuridicheskie-uvedomleniya/"> персональных данных </a></span></label></form></div></div></div>';
    feedbackModal.querySelector('.modal__close').setAttribute('data-v-fd466e7b', '');
    feedbackModal.querySelectorAll('.feedback-modal__layout, .feedback-modal__layout *').forEach(function (element) {
      element.setAttribute('data-v-231b17b3', '');
    });
    feedbackModal.querySelector('.feedback-modal__submit').setAttribute('data-v-0abc262e', '');
    document.body.appendChild(feedbackModal);

    const closeFeedback = function () {
      feedbackModal.setAttribute('hidden', '');
      unlockBodyScroll();
    };
    const openFeedback = function (title) {
      const heading = feedbackModal.querySelector('.feedback-modal__title');
      if (heading) heading.textContent = title || 'Обратная связь';
      feedbackModal.removeAttribute('hidden');
      lockBodyScroll();
      feedbackModal.querySelector('.feedback-modal__input')?.focus();
    };
    expert.querySelector('.floating-expert__card').addEventListener('click', function () {
      openFeedback('Обратная связь');
    });
    expert.querySelector('.floating-expert__close').addEventListener('click', function (event) {
      event.stopPropagation();
      expert.remove();
    });
    feedbackModal.querySelector('.modal__close').addEventListener('click', closeFeedback);
    feedbackModal.querySelector('.vfm__overlay').addEventListener('click', closeFeedback);

    [['.owner-sale-hero__button', 'Получить консультацию'], ['.owner-sale-stages__offer-btn', 'Отправить заявку'], ['.owner-sale-strategy__button', 'Обсудить стратегию'], ['.catalog-contact__card-submit', 'ПОЛУЧИТЕ ПРЕДВАРИТЕЛЬНУЮ ОЦЕНКУ ОБЪЕКТА'], ['.site-footer__callback-btn', 'Обратная связь']].forEach(function (item) {
      document.querySelectorAll(item[0]).forEach(function (button) {
        button.addEventListener('click', function () {
          openFeedback(item[1]);
        });
      });
    });
  }

  const liveFeedbackModal = document.querySelector('.feedback-modal');
  if (liveFeedbackModal) {
    const closeLiveFeedback = function () {
      liveFeedbackModal.setAttribute('hidden', '');
      unlockBodyScroll();
    };
    liveFeedbackModal.querySelectorAll('.modal__close, .vfm__overlay').forEach(function (control) {
      control.addEventListener('click', closeLiveFeedback);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !liveFeedbackModal.hasAttribute('hidden')) closeLiveFeedback();
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
      return '<li class="splide__slide" data-v-2d6c67d9=""><article class="owner-sale-services__card" data-v-2d6c67d9=""><span class="owner-sale-services__number" data-v-2d6c67d9="">' + number + '</span><p class="owner-sale-services__text" data-v-2d6c67d9="">' + service + '</p></article></li>';
    }).join('') + '</ul></div>';
    placeholder.replaceWith(slider);
  });

  if (menuButton && menu) {
    menuButton.addEventListener('click', function () {
      const isOpen = menu.hasAttribute('hidden') === false;
      const nextOpen = !isOpen;
      menu.toggleAttribute('hidden', !nextOpen);
      if (header) header.classList.toggle('site-header--menu-open', nextOpen);
      if (nextOpen && header) {
        const headerHeight = header.getBoundingClientRect().height;
        document.documentElement.style.setProperty('--layout-header-height', headerHeight + 'px');
        document.documentElement.style.setProperty('--site-menu-top', headerHeight + 'px');
      } else {
        document.documentElement.style.removeProperty('--layout-header-height');
        document.documentElement.style.removeProperty('--site-menu-top');
      }
      menuButton.setAttribute('aria-label', nextOpen ? 'Закрыть меню' : 'Открыть меню');
      menuButton.innerHTML = nextOpen
        ? '<span class="ui-icon ui-icon-current site-header__icon" data-v-7912d681 data-v-8bd2f545><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg></span>'
        : '<span class="ui-icon ui-icon-current site-header__icon" data-v-7912d681 data-v-8bd2f545><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M5 7h14"></path><path d="M5 12h14"></path><path d="M5 17h14"></path></svg></span>';
      if (nextOpen) lockBodyScroll();
      else unlockBodyScroll();
    });
  }

  document.querySelectorAll('.site-menu__close, .site-menu__overlay').forEach(function (control) {
    control.addEventListener('click', function () {
      if (!menu) return;
      menu.setAttribute('hidden', '');
      if (menuButton) menuButton.setAttribute('aria-expanded', 'false');
      unlockBodyScroll();
    });
  });

  const syncSticky = function () {
    if (!sticky) return;
    sticky.classList.toggle('owner-sale-sticky--visible', window.scrollY > window.innerHeight * 0.72);
    const links = Array.from(sticky.querySelectorAll('.owner-sale-sticky__link'));
    const stagesTop = document.querySelector('#stages')?.offsetTop || 0;
    const typesTop = document.querySelector('#property-types')?.offsetTop || 0;
    const requestTop = document.querySelector('#request')?.offsetTop || 0;
    let active = 0;
    if (window.scrollY >= stagesTop) active = 1;
    if (window.scrollY >= typesTop) active = 2;
    if (window.scrollY >= requestTop) active = 3;
    links.forEach(function (link, index) {
      link.classList.toggle('owner-sale-sticky__link--active', index === active);
    });
  };
  window.addEventListener('scroll', syncSticky, { passive: true });
  syncSticky();

  page.querySelectorAll('.owner-sale-sticky__link').forEach(function (link) {
    link.addEventListener('click', function () {
      const targets = { 'О Барнс': '#about', 'Процесс продажи объекта': '#stages', 'Виды недвижимости': '#property-types', 'Оставить заявку': '#request', 'Статьи': '#newsletter-title' };
      const target = document.querySelector(targets[link.textContent.trim()]);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

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
          const itemMethodClass = Array.from(item.classList).find(function (className) {
            return className.endsWith('__method') || className.endsWith('__method--active');
          });
          const baseMethodClass = itemMethodClass?.replace(/--active$/, '');
          if (baseMethodClass) item.className = item === tab ? baseMethodClass + '--active ' + baseMethodClass : baseMethodClass;
        });
      });
    });
  });

  const moreButton = page.querySelector('.ui-more-link[aria-controls="about-company-more"]');
  const moreCopy = document.querySelector('#about-company-more');
  if (moreButton && moreCopy) {
    moreButton.addEventListener('click', function () {
      const expanded = moreButton.getAttribute('aria-expanded') === 'true';
      moreButton.setAttribute('aria-expanded', String(!expanded));
      moreButton.querySelector('.ui-more-link__label').textContent = expanded ? 'Читать далее' : 'Свернуть';
      const copy = moreCopy.closest('.about-company__copy');
      if (copy) copy.classList.toggle('about-company__copy--open', !expanded);
    });
  }

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
