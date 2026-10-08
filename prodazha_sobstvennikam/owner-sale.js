(function () {
  'use strict';

  const page = document.querySelector('.owner-sale-page');
  if (!page) return;

  document.body.classList.add('owner-sale-reference-ui');

  page.querySelectorAll('.catalog-consultation__subtitle, .catalog-consultation__mobile-title').forEach(function (title) {
    title.textContent = 'Расскажите об объекте эксперту BARNES';
  });
  page.querySelectorAll('.catalog-consultation__lead, .catalog-consultation__mobile-lead').forEach(function (lead) {
    lead.hidden = true;
  });

  const lowerContact = page.querySelector('.catalog-contact');
  if (lowerContact) {
    const contactTitle = lowerContact.querySelector('.catalog-contact__title');
    const cardTitle = lowerContact.querySelector('.catalog-contact__card-title');
    if (contactTitle) contactTitle.textContent = 'Получите персональную консультацию';
    if (cardTitle) cardTitle.textContent = 'Получите предварительную оценку объекта';

    lowerContact.querySelectorAll('.catalog-contact__expert-photo img, .catalog-contact__mobile-photo img').forEach(function (image) {
      image.src = 'assets/ruslan.webp';
      image.alt = 'Руслан Прус';
    });
    lowerContact.querySelectorAll('.catalog-contact__expert-name, .catalog-contact__mobile-name').forEach(function (name) {
      name.textContent = 'Руслан Прус';
    });
    lowerContact.querySelectorAll('.catalog-contact__expert-role, .catalog-contact__mobile-role').forEach(function (role) {
      role.textContent = 'Руководитель департамента городской недвижимости';
    });
  }

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

  const syncMenuState = function () {
    if (!menuButton) return;
    const menuId = 'owner-sale-site-menu';
    if (menu) {
      menu.id = menuId;
      menu.setAttribute('aria-label', 'Основное меню');
    }
    menuButton.setAttribute('aria-controls', menuId);
    menuButton.setAttribute('aria-expanded', menu ? String(!menu.hasAttribute('hidden')) : 'false');
  };

  const enhanceHeroHeader = function () {
    const inner = header && header.querySelector('.site-header__inner');
    if (!header || !inner) return;

    header.classList.remove('site-header--no-nav');
    if (!inner.querySelector(':scope > .site-header__nav')) {
      const items = [
        ['Москва', 'https://barn-estate.ru/gorodskaya-nedvizhimost/', [['Вторичная', 'https://barn-estate.ru/vtorichnaya-nedvizhimost/'], ['Арендовать', 'https://barn-estate.ru/arendovat/'], ['Новостройки', 'https://barn-estate.ru/novostroyki/'], ['Жилые комплексы', 'https://barn-estate.ru/zhilye-kompleksy/'], ['Квартиры', 'https://barn-estate.ru/gorodskaya-nedvizhimost/kvartiry/'], ['Апартаменты', 'https://barn-estate.ru/gorodskaya-nedvizhimost/apartamenty/'], ['Пентхаусы', 'https://barn-estate.ru/kupit-penthausy-v-moskve/'], ['Застройщики', 'https://barn-estate.ru/zastroyshchiki/']]],
        ['Загородная', 'https://barn-estate.ru/zagorodnaya-nedvizhimost/', [['Купить', 'https://barn-estate.ru/zagorodnaya-nedvizhimost/'], ['Снять', 'https://barn-estate.ru/snyat-zagorodnuyu-nedvizhimost/'], ['Коттеджные поселки', 'https://barn-estate.ru/kottedzhnye-poselki/']]],
        ['Коммерческая', 'https://barn-estate.ru/kommercheskaya-nedvizhimost/', [['Купить', 'https://barn-estate.ru/kommercheskaya-nedvizhimost/'], ['Снять', 'https://barn-estate.ru/kommercheskaya-nedvizhimost/arendovat/'], ['Здания', 'https://barn-estate.ru/kommercheskaya-nedvizhimost/zdanie/'], ['Бизнес-центры', 'https://barn-estate.ru/kommercheskaya-nedvizhimost/business-center/'], ['Особняки', 'https://barn-estate.ru/kommercheskaya-nedvizhimost/osobnyak/'], ['Арендный бизнес', 'https://barn-estate.ru/kommercheskaya-nedvizhimost/arendnyj-biznes/']]],
        ['Курортная', 'https://barn-estate.ru/kurortnaya/', [['Инвестиции', 'https://barn-estate.ru/media/tag/investitsii-v-kurortnuyu-nedvizhimost-rossii/'], ['Алтай', 'https://barn-estate.ru/altai/'], ['Архыз', 'https://barn-estate.ru/arhyz/'], ['Сочи', 'https://barn-estate.ru/sochi/']]],
        ['Зарубежная', 'https://barn-estate.ru/mezhdunarodnaya-nedvizhimost/', [['ОАЭ', 'https://barn-estate.ru/oae/'], ['Турция', 'https://barn-estate.ru/mezhdunarodnaya-nedvizhimost/turtsiya/'], ['Таиланд', 'https://barn-estate.ru/tailand/'], ['Бали', 'https://barn-estate.ru/zhilye-kompleksy-indonesia/'], ['Испания', 'https://barn-estate.ru/ispaniya/'], ['Италия', 'https://barn-estate.ru/italiya/'], ['Португалия', 'https://barn-estate.ru/portugaliya/'], ['Франция', 'https://barn-estate.ru/frantsiya/'], ['Оман', 'https://barn-estate.ru/oman/'], ['Жилые комплексы', 'https://barn-estate.ru/mezhdunarodnaya-nedvizhimost-zhilye-kompleksy/']]],
        ['Санкт-Петербург', 'https://barnes-spb.ru', [['Вторичная', 'https://barnes-spb.ru/gorodskaya-nedvizhimost/vtorichnaya-nedvizhimost/'], ['Новостройки', 'https://barnes-spb.ru/gorodskaya-nedvizhimost/novostroyki/'], ['Загородная', 'https://barnes-spb.ru/zagorodnaya-nedvizhimost/'], ['Коммерческая', 'https://barnes-spb.ru/kommercheskaya-nedvizhimost/'], ['Эксклюзив', 'https://barnes-spb.ru/exclusive/'], ['Апартаменты', 'https://barnes-spb.ru/gorodskaya-nedvizhimost/filter/type_immovables-is-apartamenty/'], ['Пентхаус', 'https://barnes-spb.ru/gorodskaya-nedvizhimost/filter/type_immovables-is-penthausy/']]],
        ['Медиа', 'https://barn-estate.ru/media/', [['Блог', 'https://barn-estate.ru/media/blog/'], ['Новости', 'https://barn-estate.ru/media/novosti/'], ['Вебинары и видео', 'https://barn-estate.ru/media/vebinary-i-video/'], ['Аналитика рынка', 'https://barn-estate.ru/media/analitika/'], ['Искусство жить', 'https://barn-estate.ru/media/stil-zhizni/'], ['Кейсы', 'https://barn-estate.ru/media/cases/'], ['Журнал', 'https://barn-estate.ru/zhurnaly/']]],
        ['О BARNES', 'https://barn-estate.ru/mir-barnes/', [['Контакты', 'https://barn-estate.ru/contacts/'], ['Партнерам', 'https://barn-estate.ru/for-partners/'], ['Barnes Club', 'https://barn-estate.ru/barnes-club/'], ['СМИ о нас', 'https://barn-estate.ru/novosti/smi-o-nas/'], ['Мероприятия', 'https://barn-estate.ru/novosti/meropriyatiya/'], ['Команда', 'https://barn-estate.ru/team/'], ['Вакансии', 'https://barn-estate.ru/vacancies/'], ['Стиль жизни', 'https://barn-estate.ru/stily-zhizni/']]],
        ['Собственникам', 'https://barn-estate.ru/sobstvennikam/', [['Продажа', 'https://barn-estate.ru/prodazha_sobstvennikam/'], ['Аренда', 'https://barn-estate.ru/arenda_sobstvennikam/']]]
      ];
      const nav = document.createElement('nav');
      nav.className = 'site-header__nav';
      nav.setAttribute('aria-label', 'Основное меню');
      nav.setAttribute('data-v-7912d681', '');
      nav.innerHTML = '<ul class="site-header__nav-list" data-v-7912d681>' + items.map(function (item) {
        const subnav = '<ul class="site-header__subnav" data-v-7912d681>' + item[2].map(function (subitem) {
          return '<li data-v-7912d681><a class="site-header__subnav-link" href="' + subitem[1] + '" data-v-7912d681>' + subitem[0] + '</a></li>';
        }).join('') + '</ul>';
        return '<li class="site-header__nav-item owner-sale-nav-item" data-v-7912d681><a class="site-header__nav-link" href="' + item[1] + '" data-v-7912d681>' + item[0] + '</a>' + subnav + '</li>';
      }).join('') + '</ul>';
      inner.appendChild(nav);
    }

    const right = inner.querySelector('.site-header__right');
    const phone = right && right.querySelector('.site-header__phone');
    if (!right || !phone || right.querySelector('.owner-sale-hero-contacts')) return;

    const contacts = document.createElement('nav');
    contacts.className = 'owner-sale-hero-contacts';
    contacts.setAttribute('aria-label', 'Способы связи');
    [
      ['WhatsApp', 'https://wa.me/79252621650', '../pictures/office-contact/whatsapp.svg'],
      ['MAX', 'https://max.ru/join/AWj8ibiCtAPOJOlulMGNkykKGz_prXVWg-IQK1KpUG8', '../pictures/office-contact/max.svg'],
      ['Telegram', 'https://t.me/art_de_vivre_barnes', '../pictures/office-contact/telegram.svg']
    ].forEach(function (item) {
      const link = document.createElement('a');
      const icon = document.createElement('img');
      link.className = 'owner-sale-hero-contact';
      link.href = item[1];
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', 'Написать в ' + item[0]);
      icon.src = item[2];
      icon.alt = '';
      icon.setAttribute('aria-hidden', 'true');
      link.appendChild(icon);
      contacts.appendChild(link);
    });
    phone.classList.add('owner-sale-hero-contact', 'owner-sale-hero-contact--phone');
    phone.setAttribute('aria-label', 'Позвонить по номеру +7 495 182-50-79');
    contacts.appendChild(phone);
    right.appendChild(contacts);
  };

  enhanceHeroHeader();

  const enhanceAmbassadorsLink = function () {
    const label = 'Амбассадоры';
    const href = 'https://barn-estate.ru/for-partners/';

    document.querySelectorAll('.site-footer__column').forEach(function (column) {
      const title = column.querySelector('.site-footer__column-title');
      const links = column.querySelector('.site-footer__links');
      if (!title || !links || title.textContent.trim().toUpperCase() !== 'СОБСТВЕННИКАМ') return;
      if (Array.from(links.querySelectorAll('a')).some(function (link) {
        return link.textContent.trim() === label;
      })) return;

      const sampleItem = links.querySelector(':scope > li');
      const item = sampleItem ? sampleItem.cloneNode(true) : document.createElement('li');
      let link = item.querySelector('a');
      if (!link) {
        link = document.createElement('a');
        link.className = 'site-footer__link';
        item.appendChild(link);
      }
      link.textContent = label;
      link.href = href;
      link.removeAttribute('aria-current');
      links.appendChild(item);
    });
  };

  enhanceAmbassadorsLink();

  const magazineSection = page.querySelector(':scope > .owner-sale-magazine');
  if (magazineSection) magazineSection.remove();

  const enhanceSectionEyebrows = function () {
    [
      ['.owner-sale-stages__title', 'ПРОЦЕСС ПРОДАЖИ'],
      ['.owner-sale-strategy__title', 'СТРАТЕГИЯ BARNES'],
      ['.owner-sale-presentation__title', 'СТРАТЕГИЯ ПРЕЗЕНТАЦИИ'],
      ['.about-company__title', 'BARNES / МОСКВА'],
      ['.newsletter-cta h2', 'BARNES / АНАЛИТИКА']
    ].forEach(function (item) {
      const title = document.querySelector(item[0]);
      const container = title && title.parentElement;
      if (!title || !container || container.querySelector(':scope > .owner-sale-section-eyebrow')) return;

      const eyebrow = document.createElement('p');
      eyebrow.className = 'owner-sale-section-eyebrow';
      eyebrow.textContent = item[1];
      container.insertBefore(eyebrow, title);
    });

    const services = document.querySelector('.owner-sale-services__header-wrap');
    const servicesHeader = services && services.querySelector(':scope > .owner-sale-services__header');
    if (services && servicesHeader && !services.querySelector(':scope > .owner-sale-section-eyebrow')) {
      const eyebrow = document.createElement('p');
      eyebrow.className = 'owner-sale-section-eyebrow owner-sale-services__eyebrow';
      eyebrow.textContent = 'ЕДИНАЯ КОМАНДА BARNES';
      services.insertBefore(eyebrow, servicesHeader);
    }

    const typesSection = document.querySelector('.owner-sale-types');
    const typesInner = typesSection && typesSection.querySelector('.owner-sale-types__inner');
    if (typesSection && typesInner && !typesInner.querySelector(':scope > .owner-sale-types__header')) {
      const header = document.createElement('header');
      header.className = 'owner-sale-types__header';
      header.innerHTML = '<p class="owner-sale-section-eyebrow owner-sale-types__eyebrow">НАПРАВЛЕНИЯ BARNES</p><h2 class="owner-sale-types__section-title" id="owner-sale-types-title">НЕДВИЖИМОСТЬ ДЛЯ ПРОДАЖИ</h2>';
      typesInner.insertBefore(header, typesInner.firstChild);
      typesSection.setAttribute('aria-labelledby', 'owner-sale-types-title');
      typesSection.removeAttribute('aria-label');
    }
  };

  enhanceSectionEyebrows();

  const enhanceFormAccessibility = function () {
    const fieldMap = [
      ['.catalog-consultation__input', ['Ваше имя', 'Номер телефона']],
      ['.catalog-contact__input', ['Ваше имя', 'Номер телефона']]
    ];

    fieldMap.forEach(function (item) {
      page.querySelectorAll(item[0]).forEach(function (field, index) {
        if (!field.hasAttribute('aria-label')) field.setAttribute('aria-label', item[1][index] || 'Контактное поле');
        if (index === 1 && field.type === 'text') field.type = 'tel';
        if (index === 0 && !field.hasAttribute('autocomplete')) field.setAttribute('autocomplete', 'name');
        if (index === 1 && !field.hasAttribute('autocomplete')) field.setAttribute('autocomplete', 'tel');
      });
    });

    page.querySelectorAll('.catalog-consultation__textarea, .catalog-contact__textarea').forEach(function (field) {
      if (!field.hasAttribute('aria-label')) field.setAttribute('aria-label', 'Комментарий');
    });

    page.querySelectorAll('.catalog-consultation__consent-input, .catalog-contact__consent-input').forEach(function (field) {
      if (!field.hasAttribute('aria-label')) field.setAttribute('aria-label', 'Согласие на обработку персональных данных');
    });

    document.querySelectorAll('.newsletter-form input[type="email"]').forEach(function (field) {
      if (!field.hasAttribute('aria-label')) field.setAttribute('aria-label', 'Ваш email');
    });
  };

  enhanceFormAccessibility();

  const reorderSaleSections = function () {
    const hero = page.querySelector(':scope > .owner-sale-hero');
    if (!hero) return;

    const orderedSections = [
      page.querySelector(':scope > .owner-sale-presentation'),
      page.querySelector(':scope > .owner-sale-services'),
      page.querySelector(':scope > .about-company'),
      page.querySelector(':scope > .owner-sale-stages'),
      page.querySelector(':scope > .owner-sale-strategy'),
      page.querySelector(':scope > .catalog-consultation'),
      page.querySelector(':scope > .owner-sale-types')
    ].filter(Boolean);

    let insertionPoint = hero.nextSibling;
    orderedSections.forEach(function (section) {
      page.insertBefore(section, insertionPoint);
      insertionPoint = section.nextSibling;
    });
  };

  reorderSaleSections();

  const enhancePresentationCards = function () {
    const descriptions = [
      'Находим сильные стороны объекта и превращаем их в понятные преимущества для будущего покупателя.',
      'Определяем позиционирование, ценовой ориентир и ключевые акценты для презентации объекта.',
      'Выбираем релевантные каналы и показываем объект аудитории, которая соответствует его уровню.',
      'Берём на себя коммуникацию с покупателями и защищаем интересы собственника на каждом этапе переговоров.',
      'Проверяем документы и сопровождаем сделку, чтобы обеспечить её юридическую чистоту и безопасность.',
      'Контролируем доступ к информации об объекте и проводим просмотры с учётом требований собственника.'
    ];

    page.querySelectorAll('.owner-sale-presentation__card').forEach(function (card, index) {
      const caption = card.querySelector('.owner-sale-presentation__caption');
      if (!caption || card.querySelector('.owner-sale-presentation__reveal')) return;

      const reveal = document.createElement('div');
      const text = document.createElement('p');
      reveal.className = 'owner-sale-presentation__reveal';
      text.className = 'owner-sale-presentation__reveal-text';
      text.id = 'owner-sale-presentation-description-' + (index + 1);
      text.textContent = descriptions[index];
      caption.parentNode.insertBefore(reveal, caption);
      reveal.append(caption, text);
      card.tabIndex = 0;
      card.setAttribute('aria-describedby', text.id);
    });
  };

  enhancePresentationCards();

  const enhanceSaleStages = function () {
    const section = page.querySelector('.owner-sale-stages');
    const aside = section && section.querySelector('.owner-sale-stages__aside');
    const title = section && section.querySelector('.owner-sale-stages__title');
    const offer = section && section.querySelector('.owner-sale-stages__offer');
    const offerTitle = offer && offer.querySelector('.owner-sale-stages__offer-title');
    const offerText = offer && offer.querySelector('.owner-sale-stages__offer-text');
    const offerButton = offer && offer.querySelector('.owner-sale-stages__offer-btn');
    if (!section || !aside || !title) return;

    title.id = 'owner-sale-stages-title';
    section.setAttribute('aria-labelledby', title.id);
    section.removeAttribute('aria-label');
    aside.classList.add('owner-sale-stages__header');

    if (offerTitle && !aside.querySelector('.owner-sale-stages__lead')) {
      offerTitle.className = 'owner-sale-stages__lead';
      aside.appendChild(offerTitle);
    }
    if (offerText && !aside.querySelector('.owner-sale-stages__intro')) {
      offerText.className = 'owner-sale-stages__intro';
      aside.appendChild(offerText);
    }
    if (offerButton) {
      offerButton.classList.add('owner-sale-stages__cta');
      aside.appendChild(offerButton);
    }
    if (offer) offer.remove();
  };

  enhanceSaleStages();

  let stagesScrollFrame = null;
  const updateStagesScrollState = function () {
    const section = page.querySelector('.owner-sale-stages');
    const items = section && Array.from(section.querySelectorAll('.owner-sale-stages__item'));
    const headerBlock = section && section.querySelector('.owner-sale-stages__header');
    const desktop = window.matchMedia('(min-width: 901px)').matches;
    if (!section || !items.length) return;

    if (!desktop) {
      section.classList.remove('owner-sale-stages--scroll-ready');
      items.forEach(function (item) {
        item.classList.remove('is-active', 'is-past');
        item.style.removeProperty('--owner-sale-stages-last-offset');
      });
      return;
    }

    let alignmentLine = headerBlock ? parseFloat(window.getComputedStyle(headerBlock).top) : 120;
    if (!Number.isFinite(alignmentLine)) alignmentLine = 120;
    const lastItem = items[items.length - 1];
    const currentLastOffset = parseFloat(lastItem.style.getPropertyValue('--owner-sale-stages-last-offset')) || 0;
    const naturalLastTop = lastItem.getBoundingClientRect().top - currentLastOffset;
    const headerTop = headerBlock ? headerBlock.getBoundingClientRect().top : alignmentLine;
    const lastOffset = Math.max(0, headerTop - naturalLastTop);
    lastItem.style.setProperty('--owner-sale-stages-last-offset', lastOffset + 'px');

    let activeIndex = 0;
    let closestDistance = Infinity;
    items.forEach(function (item, index) {
      const distance = Math.abs(item.getBoundingClientRect().top - alignmentLine);
      if (distance < closestDistance) {
        closestDistance = distance;
        activeIndex = index;
      }
    });

    section.classList.add('owner-sale-stages--scroll-ready');
    items.forEach(function (item, index) {
      item.classList.toggle('is-active', index === activeIndex);
      item.classList.toggle('is-past', index < activeIndex);
    });
  };

  const requestStagesScrollUpdate = function () {
    if (stagesScrollFrame) return;
    stagesScrollFrame = window.requestAnimationFrame(function () {
      stagesScrollFrame = null;
      updateStagesScrollState();
    });
  };

  window.addEventListener('scroll', requestStagesScrollUpdate, { passive: true });
  window.addEventListener('resize', requestStagesScrollUpdate, { passive: true });
  requestStagesScrollUpdate();

  const enhanceStickyHeader = function () {
    const inner = sticky && sticky.querySelector('.owner-sale-sticky__inner');
    const nav = inner && inner.querySelector('.owner-sale-sticky__nav');
    const list = nav && nav.querySelector('.owner-sale-sticky__list');
    const brand = inner && inner.querySelector('.owner-sale-sticky__brand');
    const logo = brand && brand.querySelector('.owner-sale-sticky__logo');
    const phone = brand && brand.querySelector('.owner-sale-sticky__phone');
    if (!sticky || !inner || !list || !brand || !phone) return;

    const presentation = page.querySelector('.owner-sale-presentation');
    const services = page.querySelector('.owner-sale-services');
    const about = page.querySelector('.about-company');
    if (presentation) presentation.id = 'presentation';
    if (services) services.id = 'services';
    if (about) about.id = 'team';

    if (logo && logo.parentElement !== inner) inner.insertBefore(logo, brand);

    if (!brand.querySelector('.owner-sale-sticky__request')) {
      const request = document.createElement('button');
      request.className = 'owner-sale-sticky__request';
      request.type = 'button';
      request.textContent = 'Оставить заявку';
      brand.insertBefore(request, phone);
    }

    if (!brand.querySelector('.owner-sale-sticky__messengers')) {
      const messengers = document.createElement('nav');
      messengers.className = 'owner-sale-sticky__messengers';
      messengers.setAttribute('aria-label', 'Способы связи');
      [
        ['WhatsApp', 'https://wa.me/79252621650', '../pictures/office-contact/whatsapp.svg'],
        ['MAX', 'https://max.ru/join/AWj8ibiCtAPOJOlulMGNkykKGz_prXVWg-IQK1KpUG8', '../pictures/office-contact/max.svg'],
        ['Telegram', 'https://t.me/art_de_vivre_barnes', '../pictures/office-contact/telegram.svg']
      ].forEach(function (item) {
        const link = document.createElement('a');
        const icon = document.createElement('img');
        link.className = 'owner-sale-sticky__messenger';
        link.href = item[1];
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', 'Написать в ' + item[0]);
        icon.src = item[2];
        icon.alt = '';
        icon.setAttribute('aria-hidden', 'true');
        link.appendChild(icon);
        messengers.appendChild(link);
      });
      brand.insertBefore(messengers, phone);
    }

    const messengers = brand.querySelector('.owner-sale-sticky__messengers');
    phone.setAttribute('aria-label', 'Позвонить по номеру +7 495 182-50-79');
    if (messengers && phone.parentElement !== messengers) messengers.appendChild(phone);

    list.innerHTML = [
      ['Презентация', 'presentation'],
      ['Команда', 'team'],
      ['Этапы', 'stages'],
      ['Направления', 'property-types']
    ].map(function (item) {
      return '<li class="owner-sale-sticky__item"><a class="owner-sale-sticky__link" href="#' + item[1] + '">' + item[0] + '</a></li>';
    }).join('') + '<li class="owner-sale-sticky__item owner-sale-sticky__item--contacts"><button class="owner-sale-sticky__contact-toggle" type="button" aria-expanded="false" aria-controls="owner-sale-sticky-contacts" aria-label="Показать способы связи"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.8 9.8 0 0 1-4-.9L3 21l1.7-4.6A8.4 8.4 0 1 1 21 11.5Z"></path><path d="M8 12h.01M12 12h.01M16 12h.01"></path></svg></button></li>';

    let panel = inner.querySelector('.owner-sale-sticky__contact-panel');
    if (!panel && messengers) {
      panel = messengers.cloneNode(true);
      panel.id = 'owner-sale-sticky-contacts';
      panel.className = 'owner-sale-sticky__contact-panel';
      panel.hidden = true;
      inner.appendChild(panel);
    }

    const toggle = list.querySelector('.owner-sale-sticky__contact-toggle');
    if (toggle && panel) {
      toggle.dataset.bound = 'true';
      toggle.addEventListener('click', function () {
        const open = panel.hidden;
        panel.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Скрыть способы связи' : 'Показать способы связи');
      });
    }
  };

  enhanceStickyHeader();

  page.querySelectorAll('.owner-sale-types__action').forEach(function (action) {
    if (action.querySelector('.owner-sale-types__action-icon')) return;
    const icon = document.createElement('span');
    icon.className = 'owner-sale-types__action-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.innerHTML = '<svg viewBox="0 0 16 16" focusable="false"><path d="M3 13 13 3M5 3h8v8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25"></path></svg>';
    action.appendChild(icon);
  });

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

    feedbackModal.classList.add('feedback-modal--owner-sale');
    const feedbackLayout = feedbackModal.querySelector('.feedback-modal__layout');
    const feedbackHero = feedbackModal.querySelector('.feedback-modal__hero');
    const feedbackBody = feedbackModal.querySelector('.feedback-modal__body');
    const feedbackForm = feedbackModal.querySelector('.feedback-modal__form');
    const feedbackTitle = feedbackModal.querySelector('.feedback-modal__title');
    const feedbackImage = feedbackModal.querySelector('.feedback-modal__hero-image');

    feedbackTitle.textContent = 'Узнайте рыночную стоимость вашей недвижимости';
    const feedbackIntro = document.createElement('p');
    feedbackIntro.className = 'feedback-modal__intro';
    feedbackIntro.textContent = 'Поможем определить рыночную стоимость и подготовить эффективную стратегию продажи.';
    feedbackTitle.insertAdjacentElement('afterend', feedbackIntro);

    feedbackHero.querySelectorAll('.feedback-modal__hero-overlay, .feedback-modal__brand').forEach(function (node) {
      node.remove();
    });
    const feedbackPicture = document.createElement('picture');
    const feedbackSource = document.createElement('source');
    feedbackSource.media = '(max-width: 580px)';
    feedbackSource.srcset = 'assets/feedback-hero.webp';
    feedbackImage.parentNode.insertBefore(feedbackPicture, feedbackImage);
    feedbackPicture.append(feedbackSource, feedbackImage);
    feedbackImage.src = 'assets/feedback-modal-interior-desktop.webp';
    feedbackImage.alt = 'Премиальный интерьер с панорамным видом';

    const feedbackChannels = document.createElement('div');
    feedbackChannels.className = 'feedback-modal__channels';
    feedbackChannels.setAttribute('role', 'group');
    feedbackChannels.setAttribute('aria-label', 'Способ связи');
    const feedbackChannelValue = document.createElement('input');
    feedbackChannelValue.type = 'hidden';
    feedbackChannelValue.name = 'preferredChannel';
    feedbackChannelValue.value = 'Telegram';
    ['Telegram', 'WhatsApp', 'MAX', 'Звонок'].forEach(function (channel, index) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = channel;
      button.dataset.channel = channel;
      button.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
      feedbackChannels.appendChild(button);
    });

    const feedbackFields = feedbackForm.querySelectorAll('.feedback-modal__input');
    feedbackForm.insertBefore(feedbackChannels, feedbackFields[0].closest('.feedback-modal__field'));
    feedbackForm.appendChild(feedbackChannelValue);
    feedbackFields[0].name = 'name';
    feedbackFields[0].placeholder = 'Ваше имя';
    feedbackFields[0].setAttribute('aria-label', 'Ваше имя');
    feedbackFields[1].name = 'phone';
    feedbackFields[1].placeholder = 'Номер телефона в Telegram';
    feedbackFields[1].setAttribute('aria-label', 'Номер телефона в Telegram');
    feedbackModal.querySelector('.feedback-modal__submit').textContent = 'Получить оценку';

    feedbackChannels.addEventListener('click', function (event) {
      const button = event.target.closest('button[data-channel]');
      if (!button) return;
      feedbackChannels.querySelectorAll('button').forEach(function (item) {
        item.setAttribute('aria-pressed', String(item === button));
      });
      feedbackChannelValue.value = button.dataset.channel;
      const phoneLabel = button.dataset.channel === 'Звонок' ? 'Номер телефона' : 'Номер телефона в ' + button.dataset.channel;
      feedbackFields[1].placeholder = phoneLabel;
      feedbackFields[1].setAttribute('aria-label', phoneLabel);
    });

    feedbackLayout.insertBefore(feedbackBody, feedbackHero);

    const closeFeedback = function () {
      feedbackModal.setAttribute('hidden', '');
      unlockBodyScroll();
    };
    const openFeedback = function () {
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

    [['.owner-sale-hero__button', 'Получить консультацию'], ['.owner-sale-sticky__request', 'Оставить заявку'], ['.owner-sale-stages__offer-btn', 'Отправить заявку'], ['.owner-sale-strategy__button', 'Обсудить стратегию'], ['.catalog-contact__card-submit', 'ПОЛУЧИТЕ ПРЕДВАРИТЕЛЬНУЮ ОЦЕНКУ ОБЪЕКТА'], ['.site-footer__callback-btn', 'Обратная связь']].forEach(function (item) {
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

    const serviceTitles = [
      'Презентация объекта',
      'Адресные рассылки',
      'Тематические подборки',
      'Социальные сети и площадки',
      'Персональный брокер',
      'Индивидуальный сценарий продажи',
      'Виртуальный 3D-тур',
      'Видеосъёмка',
      'Рекламные материалы',
      'Фотосъёмка',
      'Баннер на объекте'
    ];
    const slider = document.createElement('div');
    slider.className = 'splide owner-sale-services__slider is-overflow is-initialized splide--slide splide--ltr splide--draggable is-active';
    slider.setAttribute('data-v-2d6c67d9', '');
    slider.setAttribute('role', 'region');
    slider.setAttribute('aria-label', 'Список услуг');
    slider.innerHTML = '<div class="splide__track" data-v-2d6c67d9=""><ul class="splide__list" data-v-2d6c67d9="">' + services.map(function (service, index) {
      const number = String(index + 1).padStart(2, '0');
      return '<li class="splide__slide" data-v-2d6c67d9=""><article class="owner-sale-services__card" data-v-2d6c67d9=""><span class="owner-sale-services__number" data-v-2d6c67d9="">' + number + '</span><p class="owner-sale-services__text" data-v-2d6c67d9=""><strong>' + serviceTitles[index] + '</strong><span>' + service + '</span></p></article></li>';
    }).join('') + '</ul></div>';
    placeholder.replaceWith(slider);
  });

  syncMenuState();

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
      syncMenuState();
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
      if (menuButton) {
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Открыть меню');
      }
      syncMenuState();
      unlockBodyScroll();
    });
  });

  const syncSticky = function () {
    if (!sticky) return;
    const hero = page.querySelector('.owner-sale-hero');
    const revealPoint = hero ? hero.offsetTop + hero.offsetHeight - 120 : window.innerHeight * 0.72;
    const visible = window.scrollY > revealPoint;
    sticky.classList.toggle('owner-sale-sticky--visible', visible);
    sticky.setAttribute('aria-hidden', String(!visible));
    sticky.toggleAttribute('inert', !visible);
    const links = Array.from(sticky.querySelectorAll('.owner-sale-sticky__link'));
    let activeLink = links[0];
    links.forEach(function (link) {
      const target = document.querySelector(link.getAttribute('href'));
      if (target && window.scrollY + 140 >= target.offsetTop) activeLink = link;
    });
    links.forEach(function (link) {
      link.classList.toggle('owner-sale-sticky__link--active', link === activeLink);
    });
  };
  window.addEventListener('scroll', syncSticky, { passive: true });
  syncSticky();

  page.querySelectorAll('.owner-sale-presentation__card').forEach(function (card, index) {
    card.setAttribute('tabindex', '0');
    const caption = card.querySelector('.owner-sale-presentation__caption, .owner-sale-presentation__featured-title');
    if (caption && !caption.id) caption.id = 'owner-sale-presentation-caption-' + (index + 1);
    if (caption) card.setAttribute('aria-labelledby', caption.id);
  });

  page.querySelectorAll('img:not(.owner-sale-hero__image)').forEach(function (image) {
    if (!image.hasAttribute('loading')) image.setAttribute('loading', 'lazy');
    if (!image.hasAttribute('decoding')) image.setAttribute('decoding', 'async');
  });

  document.querySelectorAll([
    '.owner-sale-strategy img',
    '.owner-sale-presentation img',
    '.catalog-consultation img',
    '.owner-sale-types img',
    '.catalog-contact img',
    '.newsletter-cta img'
  ].join(',')).forEach(function (image) {
    image.setAttribute('loading', 'eager');
  });

  document.querySelectorAll('a[target="_blank"]').forEach(function (link) {
    link.setAttribute('rel', 'noopener noreferrer');
  });

  page.querySelectorAll('.owner-sale-sticky__link').forEach(function (link) {
    link.addEventListener('click', function () {
      const targets = { Презентация: '#presentation', Команда: '#team', Этапы: '#stages', Направления: '#property-types' };
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
