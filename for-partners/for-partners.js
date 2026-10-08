(function () {
  'use strict';

  var page = document.querySelector('.ambassadors-page');
  if (!page) return;

  var stagesStylesheet = document.createElement('link');
  stagesStylesheet.rel = 'stylesheet';
  stagesStylesheet.href = 'assets/how-it-works.css?v=20261008-7';
  document.head.appendChild(stagesStylesheet);

  var conditionsStylesheet = document.createElement('link');
  conditionsStylesheet.rel = 'stylesheet';
  conditionsStylesheet.href = 'assets/conditions-heading.css?v=20261008-3';
  document.head.appendChild(conditionsStylesheet);

  page.querySelectorAll('.ambassadors-conditions__reveal').forEach(function (button) {
    var card = button.closest('.ambassadors-conditions__card');
    button.addEventListener('click', function () {
      var open = card.classList.toggle('is-revealed');
      button.setAttribute('aria-expanded', String(open));
      button.textContent = open ? '−' : '+';
    });
    button.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      card.classList.remove('is-revealed');
      button.setAttribute('aria-expanded', 'false');
      button.textContent = '+';
      button.blur();
    });
  });

  var ownerShellStylesheet = document.createElement('link');
  ownerShellStylesheet.rel = 'stylesheet';
  ownerShellStylesheet.href = 'assets/owner-shell.css?v=20261008-5';
  document.head.appendChild(ownerShellStylesheet);

  var modalStylesheet = document.createElement('link');
  modalStylesheet.rel = 'stylesheet';
  modalStylesheet.href = 'assets/partner-modal.css?v=20261008-1';
  document.head.appendChild(modalStylesheet);

  var faqStylesheet = document.createElement('link');
  faqStylesheet.rel = 'stylesheet';
  faqStylesheet.href = 'assets/faq-typography.css?v=20261008-2';
  document.head.appendChild(faqStylesheet);

  var buttonStylesheet = document.createElement('link');
  buttonStylesheet.rel = 'stylesheet';
  buttonStylesheet.href = 'assets/button-kit.css?v=20261008-2';
  document.head.appendChild(buttonStylesheet);

  document.body.classList.add('partners-owner-shell');

  function enhanceOwnerHeader() {
    var header = document.querySelector('.site-header');
    var inner = header && header.querySelector('.site-header__inner');
    if (!header || !inner) return;

    header.classList.remove('site-header--no-nav');
    if (!inner.querySelector(':scope > .site-header__nav')) {
      var items = [
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
      var nav = document.createElement('nav');
      nav.className = 'site-header__nav';
      nav.setAttribute('aria-label', 'Основное меню');
      nav.innerHTML = '<ul class="site-header__nav-list">' + items.map(function (item) {
        return '<li class="site-header__nav-item owner-sale-nav-item"><a class="site-header__nav-link" href="' + item[1] + '">' + item[0] + '</a><ul class="site-header__subnav">' + item[2].map(function (subitem) {
          return '<li><a class="site-header__subnav-link" href="' + subitem[1] + '">' + subitem[0] + '</a></li>';
        }).join('') + '</ul></li>';
      }).join('') + '</ul>';
      nav.querySelectorAll('*').forEach(function (element) { element.setAttribute('data-v-7912d681', ''); });
      nav.setAttribute('data-v-7912d681', '');
      inner.appendChild(nav);

      if (!document.querySelector('.site-menu')) {
        var menu = document.createElement('div');
        var columns = [items.slice(0, 5), items.slice(5)];
        menu.className = 'site-menu';
        menu.hidden = true;
        menu.id = 'partners-site-menu';
        menu.setAttribute('role', 'dialog');
        menu.setAttribute('aria-modal', 'true');
        menu.setAttribute('aria-label', 'Основное меню');
        menu.innerHTML = '<div class="site-menu__panel"><div class="site-menu__inner base-container"><div class="site-menu__main"><nav class="site-menu__nav" aria-label="Категории недвижимости">' + columns.map(function (column) {
          return '<div class="site-menu__nav-column">' + column.map(function (item) {
            return '<div class="site-menu__nav-group"><a class="site-menu__nav-title" href="' + item[1] + '">' + item[0] + '</a><ul class="site-menu__nav-list">' + item[2].map(function (subitem) {
              return '<li><a class="site-menu__nav-link" href="' + subitem[1] + '">' + subitem[0] + '</a></li>';
            }).join('') + '</ul></div>';
          }).join('') + '</div>';
        }).join('') + '</nav></div></div></div>';
        menu.querySelectorAll('*').forEach(function (element) { element.setAttribute('data-v-6d1f991a', ''); });
        menu.setAttribute('data-v-6d1f991a', '');
        document.body.appendChild(menu);
      }
    }

    var right = inner.querySelector('.site-header__right');
    var phone = right && right.querySelector('.site-header__phone');
    if (!right || !phone || right.querySelector('.owner-sale-hero-contacts')) return;
    var contacts = document.createElement('nav');
    contacts.className = 'owner-sale-hero-contacts';
    contacts.setAttribute('aria-label', 'Способы связи');
    [['WhatsApp', 'https://wa.me/79252621650', '../pictures/office-contact/whatsapp.svg'], ['MAX', 'https://max.ru/join/AWj8ibiCtAPOJOlulMGNkykKGz_prXVWg-IQK1KpUG8', '../pictures/office-contact/max.svg'], ['Telegram', 'https://t.me/art_de_vivre_barnes', '../pictures/office-contact/telegram.svg']].forEach(function (item) {
      var link = document.createElement('a');
      link.className = 'owner-sale-hero-contact';
      link.href = item[1];
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', 'Написать в ' + item[0]);
      link.innerHTML = '<img src="' + item[2] + '" alt="" aria-hidden="true">';
      contacts.appendChild(link);
    });
    phone.classList.add('owner-sale-hero-contact', 'owner-sale-hero-contact--phone');
    phone.setAttribute('aria-label', 'Позвонить по номеру +7 495 182-50-79');
    contacts.appendChild(phone);
    right.appendChild(contacts);
  }

  function enhanceOwnerFooter() {
    document.querySelectorAll('.site-footer__column').forEach(function (column) {
      var title = column.querySelector('.site-footer__column-title');
      var links = column.querySelector('.site-footer__links');
      if (!title || !links || title.textContent.trim().toUpperCase() !== 'СОБСТВЕННИКАМ') return;
      if (Array.prototype.some.call(links.querySelectorAll('a'), function (link) { return link.textContent.trim() === 'Амбассадоры'; })) return;
      var item = document.createElement('li');
      item.innerHTML = '<a class="site-footer__link" href="https://barn-estate.ru/for-partners/">Амбассадоры</a>';
      links.appendChild(item);
    });
  }

  function enhanceOwnerStickyHeader() {
    if (page.querySelector('.owner-sale-sticky')) return;
    var sections = [
      ['Условия', 'conditions'],
      ['Как это работает', 'how-it-works'],
      ['Запросы', 'requests'],
      ['Преимущества', 'advantages']
    ].filter(function (item) { return document.getElementById(item[1]); });
    var sticky = document.createElement('div');
    sticky.className = 'owner-sale-sticky';
    sticky.setAttribute('aria-hidden', 'true');
    sticky.setAttribute('inert', '');
    sticky.innerHTML = '<div class="owner-sale-sticky__inner base-container"><nav class="owner-sale-sticky__nav" aria-label="Навигация по странице"><ul class="owner-sale-sticky__list">' + sections.map(function (item) {
      return '<li class="owner-sale-sticky__item"><a class="owner-sale-sticky__link" href="#' + item[1] + '">' + item[0] + '</a></li>';
    }).join('') + '<li class="owner-sale-sticky__item owner-sale-sticky__item--contacts"><button class="owner-sale-sticky__contact-toggle" type="button" aria-expanded="false" aria-controls="partners-sticky-contacts" aria-label="Показать способы связи"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.8 9.8 0 0 1-4-.9L3 21l1.7-4.6A8.4 8.4 0 1 1 21 11.5Z"></path><path d="M8 12h.01M12 12h.01M16 12h.01"></path></svg></button></li></ul></nav><a class="owner-sale-sticky__logo" aria-label="BARNES Moscow — на главную" href="https://barn-estate.ru/"><img src="assets/logo.svg" alt="BARNES Moscow" width="220" height="30"></a><div class="owner-sale-sticky__brand"><button class="owner-sale-sticky__request" type="button">Направить клиента</button><nav class="owner-sale-sticky__messengers" aria-label="Способы связи"><a class="owner-sale-sticky__messenger" href="https://wa.me/79252621650" target="_blank" rel="noopener noreferrer" aria-label="Написать в WhatsApp"><img src="../pictures/office-contact/whatsapp.svg" alt=""></a><a class="owner-sale-sticky__messenger" href="https://max.ru/join/AWj8ibiCtAPOJOlulMGNkykKGz_prXVWg-IQK1KpUG8" target="_blank" rel="noopener noreferrer" aria-label="Написать в MAX"><img src="../pictures/office-contact/max.svg" alt=""></a><a class="owner-sale-sticky__messenger" href="https://t.me/art_de_vivre_barnes" target="_blank" rel="noopener noreferrer" aria-label="Написать в Telegram"><img src="../pictures/office-contact/telegram.svg" alt=""></a><a class="owner-sale-sticky__phone" href="tel:74951825079" aria-label="Позвонить по номеру +7 495 182-50-79"><span class="owner-sale-sticky__phone-number">+7 (495) 182-50-79</span><span class="owner-sale-sticky__phone-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></span></a></nav></div></div>';
    var panel = sticky.querySelector('.owner-sale-sticky__messengers').cloneNode(true);
    panel.id = 'partners-sticky-contacts';
    panel.className = 'owner-sale-sticky__contact-panel';
    panel.hidden = true;
    sticky.querySelector('.owner-sale-sticky__inner').appendChild(panel);
    page.insertBefore(sticky, page.firstChild);

    sticky.querySelector('.owner-sale-sticky__request').addEventListener('click', function () {
      var primary = page.querySelector('.ambassadors-hero__button--primary');
      if (primary) primary.click();
    });
    var toggle = sticky.querySelector('.owner-sale-sticky__contact-toggle');
    toggle.addEventListener('click', function () {
      var open = panel.hidden;
      panel.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Скрыть способы связи' : 'Показать способы связи');
    });

    function syncStickyHeader() {
      var hero = page.querySelector('.ambassadors-hero');
      var visible = hero ? window.scrollY > hero.offsetTop + hero.offsetHeight - 120 : window.scrollY > window.innerHeight * .72;
      sticky.classList.toggle('owner-sale-sticky--visible', visible);
      sticky.setAttribute('aria-hidden', String(!visible));
      sticky.toggleAttribute('inert', !visible);
      var active = sections[0] && sections[0][1];
      sections.forEach(function (item) {
        var section = document.getElementById(item[1]);
        if (section && window.scrollY + 140 >= section.offsetTop) active = item[1];
      });
      sticky.querySelectorAll('.owner-sale-sticky__link').forEach(function (link) {
        link.classList.toggle('owner-sale-sticky__link--active', link.getAttribute('href') === '#' + active);
      });
    }
    window.addEventListener('scroll', syncStickyHeader, { passive: true });
    syncStickyHeader();
  }

  enhanceOwnerHeader();
  enhanceOwnerFooter();
  enhanceOwnerStickyHeader();

  function enhancePartnerModal() {
    if (document.querySelector('.feedback-modal--partners')) return;
    var modal = document.createElement('div');
    var lastTrigger = null;
    modal.className = 'modal feedback-modal feedback-modal--partners';
    modal.hidden = true;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'partners-modal-title');
    modal.innerHTML = '<div class="feedback-modal__overlay" aria-hidden="true"></div><div class="feedback-modal__content" tabindex="-1"><button type="button" class="feedback-modal__close" aria-label="Закрыть форму"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"></path></svg></button><div class="feedback-modal__layout"><div class="feedback-modal__body"><h2 class="feedback-modal__title" id="partners-modal-title">Направить клиента</h2><p class="feedback-modal__intro">Знакомьте нас с клиентами, которым нужна помощь с недвижимостью, и получайте вознаграждение после сделки.</p><form class="feedback-modal__form" novalidate><div class="feedback-modal__channels" role="group" aria-label="Предпочтительный способ связи"><button type="button" data-channel="Telegram" aria-pressed="true">Telegram</button><button type="button" data-channel="WhatsApp" aria-pressed="false">WhatsApp</button><button type="button" data-channel="MAX" aria-pressed="false">MAX</button><button type="button" data-channel="Звонок" aria-pressed="false">Звонок</button></div><input type="hidden" name="preferredChannel" value="Telegram"><label class="feedback-modal__field"><span class="visually-hidden">Ваше имя</span><input class="feedback-modal__input" name="name" type="text" autocomplete="name" placeholder="Ваше имя" required></label><label class="feedback-modal__field"><span class="visually-hidden">Номер телефона в Telegram</span><input class="feedback-modal__input" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="Номер телефона в Telegram" required></label><button type="submit" class="feedback-modal__submit">Направить клиента</button><label class="feedback-modal__consent"><input class="feedback-modal__consent-input" type="checkbox" required><span class="feedback-modal__consent-box" aria-hidden="true"></span><span>Я даю согласие на обработку <a href="https://barn-estate.ru/legal_notices/yuridicheskie-uvedomleniya/" target="_blank" rel="noopener noreferrer">персональных данных</a></span></label><p class="feedback-modal__status" role="status" aria-live="polite"></p></form></div><div class="feedback-modal__hero"><img src="assets/media-05.png" alt="Премиальный интерьер BARNES" class="feedback-modal__hero-image" width="755" height="470"></div></div></div>';
    document.body.appendChild(modal);

    var content = modal.querySelector('.feedback-modal__content');
    var form = modal.querySelector('.feedback-modal__form');
    var phone = modal.querySelector('input[name="phone"]');
    var channelValue = modal.querySelector('input[name="preferredChannel"]');
    var status = modal.querySelector('.feedback-modal__status');
    var directionId = document.createElement('input');
    directionId.type = 'hidden';
    directionId.name = 'directionId';
    var directionName = document.createElement('input');
    directionName.type = 'hidden';
    directionName.name = 'directionName';
    form.append(directionId, directionName);
    var directionSummary = document.createElement('p');
    directionSummary.className = 'feedback-modal__direction';
    directionSummary.hidden = true;
    form.before(directionSummary);
    function closeModal() {
      modal.hidden = true;
      document.body.style.removeProperty('overflow');
      if (lastTrigger) lastTrigger.focus();
    }
    function openModal(trigger) {
      directionId.value = '';
      directionName.value = '';
      directionSummary.hidden = true;
      status.textContent = '';
      lastTrigger = trigger || document.activeElement;
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      window.requestAnimationFrame(function () { content.focus(); });
    }
    document.getElementById('barnes-directions').addEventListener('barnes:request', function (event) {
      openModal(document.activeElement);
      directionId.value = event.detail.directionId;
      directionName.value = event.detail.directionName;
      directionSummary.textContent = 'Направление: ' + event.detail.directionName;
      directionSummary.hidden = false;
    });
    modal.querySelector('.feedback-modal__close').addEventListener('click', closeModal);
    modal.querySelector('.feedback-modal__overlay').addEventListener('click', closeModal);
    modal.querySelector('.feedback-modal__channels').addEventListener('click', function (event) {
      var button = event.target.closest('button[data-channel]');
      if (!button) return;
      modal.querySelectorAll('.feedback-modal__channels button').forEach(function (item) {
        item.setAttribute('aria-pressed', String(item === button));
      });
      channelValue.value = button.dataset.channel;
      var label = button.dataset.channel === 'Звонок' ? 'Номер телефона' : 'Номер телефона в ' + button.dataset.channel;
      phone.placeholder = label;
      phone.previousElementSibling.textContent = label;
    });
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;
      status.textContent = 'Спасибо! Мы свяжемся с вами.';
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !modal.hidden) closeModal();
    });
    document.querySelectorAll('.ambassadors-hero__button--primary, .owner-sale-stages__offer-btn, .ambassadors-requests__button, .catalog-contact__card-submit, .site-footer__callback-btn, .floating-expert__card').forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        openModal(button);
      }, true);
    });
  }

  enhancePartnerModal();

  function enhanceHowItWorks() {
    var section = page.querySelector('#how-it-works');
    var aside = section && section.querySelector('.owner-sale-stages__aside');
    var title = section && section.querySelector('.owner-sale-stages__title');
    var offer = section && section.querySelector('.owner-sale-stages__offer');
    var offerTitle = offer && offer.querySelector('.owner-sale-stages__offer-title');
    var offerText = offer && offer.querySelector('.owner-sale-stages__offer-text');
    var offerButton = offer && offer.querySelector('.owner-sale-stages__offer-btn');
    if (!section || !aside || !title) return;

    title.id = 'partners-stages-title';
    section.setAttribute('aria-labelledby', title.id);
    section.removeAttribute('aria-label');
    aside.classList.add('owner-sale-stages__header');

    if (offerTitle) {
      offerTitle.className = 'partners-stages__lead';
      aside.appendChild(offerTitle);
    }
    if (offerText) {
      offerText.className = 'owner-sale-stages__intro';
      aside.appendChild(offerText);
    }
    if (offerButton) {
      offerButton.classList.add('owner-sale-stages__cta');
      aside.appendChild(offerButton);
    }

    if (offer) offer.remove();
  }

  enhanceHowItWorks();

  function enhanceConditionsHeading() {
    var section = page.querySelector('#conditions');
    var inner = section && section.querySelector('.ambassadors-conditions__inner');
    var grid = inner && inner.querySelector('.ambassadors-conditions__grid');
    if (!section || !inner || !grid || inner.querySelector('.ambassadors-conditions__header')) return;

    var header = document.createElement('header');
    var title = document.createElement('h2');
    header.className = 'ambassadors-conditions__header';
    title.className = 'ambassadors-conditions__section-title';
    title.id = 'partners-conditions-title';
    title.textContent = 'УСЛОВИЯ СОТРУДНИЧЕСТВА';
    header.appendChild(title);
    inner.insertBefore(header, grid);
    section.setAttribute('aria-labelledby', title.id);
    section.removeAttribute('aria-label');
  }

  enhanceConditionsHeading();

  function enhanceSectionEyebrows() {
    [
      ['.ambassadors-conditions__section-title', 'ПАРТНЁРСКАЯ ПРОГРАММА'],
      ['.owner-sale-stages__title', 'МЕХАНИКА ПАРТНЁРСТВА'],
      ['.ambassadors-advantages__title', 'ПАРТНЁРСТВО С BARNES'],
      ['.catalog-faq__title', 'ПАРТНЁРСКАЯ ПРОГРАММА'],
      ['.newsletter-cta h2', 'BARNES / АНАЛИТИКА']
    ].forEach(function (item) {
      var title = document.querySelector(item[0]);
      var container = title && title.parentElement;
      if (!title || !container || container.querySelector(':scope > .partners-section-eyebrow')) return;

      var eyebrow = document.createElement('p');
      eyebrow.className = 'partners-section-eyebrow';
      eyebrow.textContent = item[1];
      container.insertBefore(eyebrow, title);
    });
  }

  enhanceSectionEyebrows();

  var stagesScrollFrame = null;
  function updateStagesScrollState() {
    var section = page.querySelector('#how-it-works');
    var items = section ? Array.prototype.slice.call(section.querySelectorAll('.owner-sale-stages__item')) : [];
    var headerBlock = section && section.querySelector('.owner-sale-stages__header');
    var desktop = window.matchMedia('(min-width: 901px)').matches;
    if (!section || !items.length) return;

    if (!desktop) {
      section.classList.remove('owner-sale-stages--scroll-ready');
      items.forEach(function (item) {
        item.classList.remove('is-active', 'is-past');
        item.style.removeProperty('--partners-stages-last-offset');
      });
      return;
    }

    var alignmentLine = headerBlock ? parseFloat(window.getComputedStyle(headerBlock).top) : 120;
    if (!Number.isFinite(alignmentLine)) alignmentLine = 120;

    var lastItem = items[items.length - 1];
    var currentLastOffset = parseFloat(lastItem.style.getPropertyValue('--partners-stages-last-offset')) || 0;
    var naturalLastTop = lastItem.getBoundingClientRect().top - currentLastOffset;
    var headerTop = headerBlock ? headerBlock.getBoundingClientRect().top : alignmentLine;
    var lastOffset = Math.max(0, headerTop - naturalLastTop);
    lastItem.style.setProperty('--partners-stages-last-offset', lastOffset + 'px');

    var activeIndex = 0;
    var closestDistance = Infinity;
    items.forEach(function (item, index) {
      var distance = Math.abs(item.getBoundingClientRect().top - alignmentLine);
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
  }

  function requestStagesScrollUpdate() {
    if (stagesScrollFrame) return;
    stagesScrollFrame = window.requestAnimationFrame(function () {
      stagesScrollFrame = null;
      updateStagesScrollState();
    });
  }

  window.addEventListener('scroll', requestStagesScrollUpdate, { passive: true });
  window.addEventListener('resize', requestStagesScrollUpdate, { passive: true });
  window.addEventListener('load', requestStagesScrollUpdate, { once: true });
  requestStagesScrollUpdate();

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


  var advantages = document.querySelector('.ambassadors-advantages__slider');
  var previous = document.querySelector('.ambassadors-advantages__nav-btn[aria-label*="Предыдущее"]');
  var next = document.querySelector('.ambassadors-advantages__nav-btn[aria-label*="Следующее"]');
  var advantageIndex = 0;
  var advantagesList = advantages && advantages.querySelector('.splide__list');
  var advantagesTrack = advantages && advantages.querySelector('.splide__track');
  var advantageCards = advantagesList ? Array.prototype.slice.call(advantagesList.querySelectorAll('.splide__slide')) : [];
  var advantageDragStart = null;
  var advantageDragOffset = 0;

  function visibleAdvantageCount() {
    if (window.matchMedia('(max-width: 768px)').matches) return 1;
    if (window.matchMedia('(max-width: 1024px)').matches) return 2;
    return 3;
  }

  function advantageStep() {
    if (!advantageCards.length) return 0;
    var cardStyle = window.getComputedStyle(advantageCards[0]);
    return advantageCards[0].getBoundingClientRect().width + (parseFloat(cardStyle.marginRight) || 0);
  }

  function updateAdvantages(animate) {
    if (!advantagesList || !advantageCards.length) return;
    var visibleCount = visibleAdvantageCount();
    var maxIndex = Math.max(0, advantageCards.length - visibleCount);
    advantageIndex = Math.max(0, Math.min(advantageIndex, maxIndex));
    advantageDragOffset = -advantageIndex * advantageStep();

    advantagesList.style.transition = animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'transform 400ms cubic-bezier(.25, 1, .5, 1)'
      : 'none';
    advantagesList.style.transform = 'translateX(' + advantageDragOffset + 'px)';

    advantageCards.forEach(function (card, index) {
      var visible = index >= advantageIndex && index < advantageIndex + visibleCount;
      card.classList.toggle('is-active', index === advantageIndex);
      card.classList.toggle('is-next', index === advantageIndex + 1);
      card.classList.toggle('is-visible', visible);
      var reveal = card.querySelector('.ambassadors-advantages__reveal');
      if (reveal) reveal.tabIndex = visible ? 0 : -1;
      if (visible) card.removeAttribute('aria-hidden');
      else card.setAttribute('aria-hidden', 'true');
    });

    if (previous) previous.disabled = advantageIndex === 0;
    if (next) next.disabled = advantageIndex === maxIndex;
    var progress = document.querySelector('.ambassadors-advantages__progress');
    if (progress) progress.textContent = String(advantageIndex + 1).padStart(2, '0') +
      (visibleCount > 1 ? '–' + String(Math.min(advantageIndex + visibleCount, advantageCards.length)).padStart(2, '0') : '') +
      ' / ' + advantageCards.length;
  }

  function moveAdvantages(direction) {
    advantageIndex += direction;
    updateAdvantages(true);
  }

  if (previous) previous.addEventListener('click', function () { moveAdvantages(-1); });
  if (next) next.addEventListener('click', function () { moveAdvantages(1); });

  if (advantagesTrack && advantagesList && advantageCards.length) {
    advantageCards.forEach(function (slide, index) {
      var card = slide.querySelector('.ambassadors-advantages__card');
      var description = card.querySelector('.ambassadors-advantages__description');
      description.id = 'advantage-description-' + index;
      var reveal = document.createElement('button');
      reveal.type = 'button';
      reveal.className = 'ambassadors-advantages__reveal';
      reveal.setAttribute('aria-label', 'Описание: ' + card.querySelector('h3').textContent);
      reveal.setAttribute('aria-controls', description.id);
      reveal.setAttribute('aria-expanded', 'false');
      reveal.textContent = '+';
      reveal.addEventListener('pointerdown', function (event) { event.stopPropagation(); });
      reveal.addEventListener('click', function () {
        var open = card.classList.toggle('is-revealed');
        reveal.setAttribute('aria-expanded', String(open));
        reveal.textContent = open ? '−' : '+';
      });
      card.appendChild(reveal);
    });
    advantagesTrack.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        moveAdvantages(event.key === 'ArrowRight' ? 1 : -1);
      } else if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        advantageIndex = event.key === 'Home' ? 0 : advantageCards.length;
        updateAdvantages(true);
      }
    });
    advantagesTrack.addEventListener('pointerdown', function (event) {
      if (event.button !== undefined && event.button !== 0) return;
      advantageDragStart = event.clientX;
      advantagesList.style.transition = 'none';
      advantagesTrack.classList.add('is-dragging');
      if (advantagesTrack.setPointerCapture) advantagesTrack.setPointerCapture(event.pointerId);
    });

    advantagesTrack.addEventListener('pointermove', function (event) {
      if (advantageDragStart === null) return;
      var delta = event.clientX - advantageDragStart;
      advantagesList.style.transform = 'translateX(' + (advantageDragOffset + delta) + 'px)';
    });

    function finishAdvantagesDrag(event) {
      if (advantageDragStart === null) return;
      var delta = event.clientX - advantageDragStart;
      var threshold = Math.min(72, Math.max(36, advantageStep() * .16));
      advantageDragStart = null;
      advantagesTrack.classList.remove('is-dragging');
      if (Math.abs(delta) >= threshold) advantageIndex += delta < 0 ? 1 : -1;
      updateAdvantages(true);
    }

    advantagesTrack.addEventListener('pointerup', finishAdvantagesDrag);
    advantagesTrack.addEventListener('pointercancel', finishAdvantagesDrag);
    window.addEventListener('resize', function () { updateAdvantages(false); }, { passive: true });
  }

  updateAdvantages(false);

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
    menuButton.setAttribute('aria-controls', 'partners-site-menu');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.addEventListener('click', function () {
      var menu = document.querySelector('.site-menu');
      var open = menu ? menu.hasAttribute('hidden') : !document.body.classList.contains('partners-menu-open');
      if (menu) menu.toggleAttribute('hidden', !open);
      document.body.classList.toggle('partners-menu-open', open);
      if (header) header.classList.toggle('site-header--menu-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
      if (open) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.removeProperty('overflow');
      }
    });
  }
})();
