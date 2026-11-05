(function () {
  'use strict';

  var page = document.querySelector('.ambassadors-page');
  if (!page) return;

  var conditionsStylesheet = document.createElement('link');
  conditionsStylesheet.rel = 'stylesheet';
  conditionsStylesheet.href = 'assets/conditions-heading.css?v=20261009-pointer-hover';
  document.head.appendChild(conditionsStylesheet);

  page.querySelectorAll('.ambassadors-conditions__reveal').forEach(function (button) {
    var card = button.closest('.ambassadors-conditions__card');
    button.textContent = '';
    card.addEventListener('pointerenter', function (event) {
      if (event.pointerType !== 'mouse') return;
      card.classList.add('is-hovered');
    });
    card.addEventListener('pointerleave', function (event) {
      if (event.pointerType !== 'mouse') return;
      card.classList.remove('is-hovered', 'is-revealed');
      button.setAttribute('aria-expanded', 'false');
    });
    button.addEventListener('click', function (event) {
      if (event.detail && event.pointerType !== 'touch' && window.matchMedia('(any-hover: hover)').matches) return;
      var open = card.classList.toggle('is-revealed');
      button.setAttribute('aria-expanded', String(open));
    });
    button.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      card.classList.remove('is-revealed');
      button.setAttribute('aria-expanded', 'false');
      button.blur();
    });
  });

  // Native scrolling retains touch gestures; controls follow the slide list.
  var benefits = document.querySelector('#partner-benefit-slides');
  if (benefits) {
    var benefitPrevious = document.querySelector('.ap-benefit-prev');
    var benefitNext = document.querySelector('.ap-benefit-next');
    var syncBenefits = function () {
      benefitPrevious.disabled = benefits.scrollLeft < 2;
      benefitNext.disabled = benefits.scrollLeft >= benefits.scrollWidth - benefits.clientWidth - 2;
    };
    var moveBenefits = function (direction) {
      benefits.scrollBy({ left: direction * benefits.clientWidth, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    };
    benefitPrevious.addEventListener('click', function () { moveBenefits(-1); });
    benefitNext.addEventListener('click', function () { moveBenefits(1); });
    benefits.addEventListener('scroll', syncBenefits, { passive: true });
    benefits.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); moveBenefits(event.key === 'ArrowLeft' ? -1 : 1); }
    });
    new ResizeObserver(syncBenefits).observe(benefits); syncBenefits();
  }

  var ownerShellStylesheet = document.createElement('link');
  ownerShellStylesheet.rel = 'stylesheet';
  ownerShellStylesheet.href = 'assets/owner-shell.css?v=20261009-newsletter-width';
  document.head.appendChild(ownerShellStylesheet);

  var modalStylesheet = document.createElement('link');
  modalStylesheet.rel = 'stylesheet';
  modalStylesheet.href = 'assets/partner-modal.css?v=20261008-2';
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
        ['О BARN Estate', 'https://barn-estate.ru/mir-barnes/', [['Контакты', 'https://barn-estate.ru/contacts/'], ['Партнерам', 'https://barn-estate.ru/for-partners/'], ['BARN Estate Club', 'https://barn-estate.ru/barnes-club/'], ['СМИ о нас', 'https://barn-estate.ru/novosti/smi-o-nas/'], ['Мероприятия', 'https://barn-estate.ru/novosti/meropriyatiya/'], ['Команда', 'https://barn-estate.ru/team/'], ['Вакансии', 'https://barn-estate.ru/vacancies/'], ['Стиль жизни', 'https://barn-estate.ru/stily-zhizni/']]],
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
    [['WhatsApp', 'https://wa.me/79252621650', '../../shared/pictures/office-contact/whatsapp.svg'], ['MAX', 'https://max.ru/join/AWj8ibiCtAPOJOlulMGNkykKGz_prXVWg-IQK1KpUG8', '../../shared/pictures/office-contact/max.svg'], ['Telegram', 'https://t.me/art_de_vivre_barnes', '../../shared/pictures/office-contact/telegram.svg']].forEach(function (item) {
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
    }).join('') + '<li class="owner-sale-sticky__item owner-sale-sticky__item--contacts"><button class="owner-sale-sticky__contact-toggle" type="button" aria-expanded="false" aria-controls="partners-sticky-contacts" aria-label="Показать способы связи"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.8 9.8 0 0 1-4-.9L3 21l1.7-4.6A8.4 8.4 0 1 1 21 11.5Z"></path><path d="M8 12h.01M12 12h.01M16 12h.01"></path></svg></button></li></ul></nav><a class="owner-sale-sticky__logo" aria-label="BARN Estate — на главную" href="https://barn-estate.ru/"><img src="https://daniilterekh-prog.github.io/barnes-assets/brand/barn-estate/logo.svg" alt="BARN Estate" width="220" height="30" style="object-fit:contain;aspect-ratio:220 / 30"></a><div class="owner-sale-sticky__brand"><button class="owner-sale-sticky__request" type="button">Направить клиента</button><nav class="owner-sale-sticky__messengers" aria-label="Способы связи"><a class="owner-sale-sticky__messenger" href="https://wa.me/79252621650" target="_blank" rel="noopener noreferrer" aria-label="Написать в WhatsApp"><img src="../../shared/pictures/office-contact/whatsapp.svg" alt=""></a><a class="owner-sale-sticky__messenger" href="https://max.ru/join/AWj8ibiCtAPOJOlulMGNkykKGz_prXVWg-IQK1KpUG8" target="_blank" rel="noopener noreferrer" aria-label="Написать в MAX"><img src="../../shared/pictures/office-contact/max.svg" alt=""></a><a class="owner-sale-sticky__messenger" href="https://t.me/art_de_vivre_barnes" target="_blank" rel="noopener noreferrer" aria-label="Написать в Telegram"><img src="../../shared/pictures/office-contact/telegram.svg" alt=""></a><a class="owner-sale-sticky__phone" href="tel:74951825079" aria-label="Позвонить по номеру +7 495 182-50-79"><span class="owner-sale-sticky__phone-number">+7 (495) 182-50-79</span><span class="owner-sale-sticky__phone-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></span></a></nav></div></div>';
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
    modal.innerHTML = '<div class="feedback-modal__overlay" aria-hidden="true"></div><div class="feedback-modal__content" tabindex="-1"><button type="button" class="feedback-modal__close" aria-label="Закрыть форму"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"></path></svg></button><div class="feedback-modal__layout"><div class="feedback-modal__body"><h2 class="feedback-modal__title" id="partners-modal-title">Рекомендовать клиента</h2><p class="feedback-modal__intro">Оставьте свой контакт — обсудим рекомендацию клиента, его закрепление и условия вознаграждения.</p><form class="feedback-modal__form" novalidate><div class="feedback-modal__channels" role="group" aria-label="Предпочтительный способ связи"><button type="button" data-channel="Telegram" aria-pressed="true">Telegram</button><button type="button" data-channel="WhatsApp" aria-pressed="false">WhatsApp</button><button type="button" data-channel="MAX" aria-pressed="false">MAX</button><button type="button" data-channel="Звонок" aria-pressed="false">Звонок</button></div><input type="hidden" name="preferredChannel" value="Telegram"><label class="feedback-modal__field"><span class="visually-hidden">Ваше имя</span><input class="feedback-modal__input" name="name" type="text" autocomplete="name" placeholder="Ваше имя" required></label><label class="feedback-modal__field"><span class="visually-hidden">Номер телефона в Telegram</span><input class="feedback-modal__input" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="Номер телефона в Telegram" required></label><label class="feedback-modal__field"><span class="visually-hidden">Ваш запрос по партнёрству (необязательно)</span><textarea class="feedback-modal__input feedback-modal__textarea" name="message" rows="3" placeholder="Ваш запрос по партнёрству (необязательно)"></textarea></label><button type="submit" class="feedback-modal__submit">Рекомендовать клиента</button><label class="feedback-modal__consent"><input class="feedback-modal__consent-input" type="checkbox" required><span class="feedback-modal__consent-box" aria-hidden="true"></span><span>Я даю согласие на обработку <a href="https://barn-estate.ru/legal_notices/yuridicheskie-uvedomleniya/" target="_blank" rel="noopener noreferrer">персональных данных</a></span></label><p class="feedback-modal__status" role="status" aria-live="polite"></p></form></div><div class="feedback-modal__hero"><img src="assets/igor-bocharov.webp" alt="Игорь Бочаров" class="feedback-modal__hero-image" width="641" height="860"><div class="partner-modal-expert"><p>Игорь Бочаров</p><span>Заместитель директора</span></div></div></div></div>';
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
      var partnership = trigger && trigger.matches('.catalog-contact__card-submit, .floating-expert__card, .site-footer__callback-btn, [data-partner-intent="consultation"]');
      modal.querySelector('.feedback-modal__title').textContent = partnership ? 'Задать вопрос эксперту' : 'Рекомендовать клиента';
      modal.querySelector('.feedback-modal__intro').textContent = partnership ? 'Расскажите о вашей рекомендации или задайте вопрос об амбассадорской программе. Начнём с удобного для вас способа связи.' : 'Оставьте свой контакт — обсудим рекомендацию клиента, его закрепление и условия вознаграждения.';
      modal.querySelector('.feedback-modal__submit').textContent = partnership ? 'Задать вопрос эксперту' : 'Рекомендовать клиента';
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
      status.textContent = 'Отправка заявок пока не подключена. Позвоните в BARN Estate: +7 (495) 182-50-79.';
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !modal.hidden) closeModal();
      if (event.key !== 'Tab' || modal.hidden) return;
      var focusable = Array.from(content.querySelectorAll('button,input:not([type="hidden"]),textarea,a[href]')).filter(function (element) { return !element.disabled && element.getClientRects().length; });
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === content)) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    });
    document.querySelectorAll('.ambassadors-hero__button--primary, .catalog-contact__card-submit, .site-footer__callback-btn, .floating-expert__card, [data-partner-intent]').forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        openModal(button);
      }, true);
    });
  }

  enhancePartnerModal();

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
      ['.catalog-faq__title', 'ПАРТНЁРСКАЯ ПРОГРАММА'],
      ['.newsletter-cta h2', 'BARN Estate / АНАЛИТИКА']
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

  document.querySelectorAll('.ambassadors-hero__button--secondary').forEach(function (button) {
    button.addEventListener('click', function () { scrollToTarget('#conditions'); });
  });

  document.querySelectorAll('.catalog-contact__method').forEach(function (button) {
    button.addEventListener('click', function () {
      document.querySelectorAll('.catalog-contact__method').forEach(function (item) {
        item.classList.remove('catalog-contact__method--active');
        item.setAttribute('aria-pressed', String(item === button));
      });
      button.classList.add('catalog-contact__method--active');
      var channel = document.querySelector('.catalog-contact__form input[name="preferredChannel"]');
      if (channel) channel.value = button.textContent.trim();
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


  document.querySelectorAll('.catalog-contact__form, .newsletter-form').forEach(function (form) {
    if (form.classList.contains('catalog-contact__form')) {
      var channel = document.createElement('input');
      channel.type = 'hidden'; channel.name = 'preferredChannel'; channel.value = 'WhatsApp';
      form.appendChild(channel);
    }
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (form.classList.contains('catalog-contact__form')) {
        if (!form.reportValidity()) return;
        form.querySelector('.catalog-contact__status').textContent = 'Отправка заявок пока не подключена. Позвоните в BARN Estate: +7 (495) 182-50-79.';
        return;
      }
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
