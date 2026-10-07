/* Page-local accessibility glue for the reference UI transfer. */
(function () {
  'use strict';

  var trigger;
  var menuId = 'owner-rent-site-menu';
  var enhancementTimer;
  var exclusiveScrollFrame;
  var exclusiveScrollReady = false;

  function enhanceServicesSection() {
    var section = document.querySelector('.owner-sale-services');
    var headerWrap = section && section.querySelector('.owner-sale-services__header-wrap');
    var title = section && section.querySelector('.owner-sale-services__title');

    if (!section || !headerWrap) return;

    if (title) {
      title.id = 'owner-rent-services-title';
      section.setAttribute('aria-labelledby', title.id);
      section.removeAttribute('aria-label');
    }

    if (!headerWrap.querySelector('.owner-sale-services__eyebrow')) {
      var eyebrow = document.createElement('p');
      eyebrow.className = 'owner-sale-services__eyebrow';
      eyebrow.textContent = 'ЕДИНАЯ КОМАНДА BARNES';
      headerWrap.insertBefore(eyebrow, headerWrap.firstChild);
    }

    section.querySelectorAll('.owner-sale-services__text').forEach(function (text) {
      if (text.querySelector('strong')) return;

      var copy = text.textContent.trim().split(' — ');
      if (copy.length < 2) return;

      text.textContent = '';
      var lead = document.createElement('strong');
      lead.textContent = copy.shift();
      var detail = document.createElement('span');
      var detailText = copy.join(' — ').trim();
      detail.textContent = detailText.charAt(0).toLocaleUpperCase('ru-RU') + detailText.slice(1);
      text.append(lead, detail);
    });

    if (!section.querySelector('.owner-sale-services__cta')) {
      var cta = document.createElement('a');
      cta.className = 'ui-button ui-button--primary ui-button--medium owner-sale-services__cta';
      cta.href = '#request';
      cta.innerHTML = 'Обсудить стратегию сдачи <span aria-hidden="true"><svg viewBox="0 0 16 16" focusable="false"><path d="M3 13 13 3M5 3h8v8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25"></path></svg></span>';
      section.appendChild(cta);
    }
  }

  function enhanceHeroSection() {
    var button = document.querySelector('.owner-sale-hero__button');
    if (!button || button.querySelector('.owner-sale-hero__button-arrow')) return;

    button.innerHTML = 'Обсудить стратегию <span class="owner-sale-hero__button-arrow" aria-hidden="true"><svg viewBox="0 0 16 16" focusable="false"><path d="M3 13 13 3M5 3h8v8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25"></path></svg></span>';
  }

  function enhanceExclusiveSection() {
    var section = document.querySelector('.owner-sale-exclusive');
    var inner = section && section.querySelector('.owner-sale-exclusive__inner');
    var title = section && section.querySelector('.owner-sale-exclusive__title');
    var itemTitles = [
      'Единая подача',
      'Расширенный охват',
      'Персональный брокер',
      'Обоснованная ставка',
      'Проверка арендаторов',
      'Полное сопровождение'
    ];

    if (!section || !inner || !title) return;

    title.id = 'owner-rent-exclusive-title';
    section.setAttribute('aria-labelledby', title.id);
    section.removeAttribute('aria-label');

    if (!inner.querySelector('.owner-sale-exclusive__eyebrow')) {
      var eyebrow = document.createElement('p');
      eyebrow.className = 'owner-sale-exclusive__eyebrow';
      eyebrow.textContent = 'BARNES / ЭКСКЛЮЗИВ';
      inner.insertBefore(eyebrow, title);
    }

    if (!inner.querySelector('.owner-sale-exclusive__header')) {
      var header = document.createElement('header');
      var sectionEyebrow = inner.querySelector('.owner-sale-exclusive__eyebrow');
      header.className = 'owner-sale-exclusive__header';
      inner.insertBefore(header, sectionEyebrow);
      header.append(sectionEyebrow, title);
    }

    if (!title.querySelector('.owner-sale-exclusive__title-line')) {
      title.setAttribute(
        'aria-label',
        'Преимущества эксклюзивной работы с BARNES'
      );
      title.innerHTML = [
        'ПРЕИМУЩЕСТВА ЭКСКЛЮЗИВНОЙ',
        'РАБОТЫ С BARNES'
      ].map(function (line) {
        return '<span class="owner-sale-exclusive__title-line" aria-hidden="true">' + line + '</span>';
      }).join('');
    }

    var exclusiveHeader = inner.querySelector('.owner-sale-exclusive__header');
    if (exclusiveHeader && !exclusiveHeader.querySelector('.owner-sale-exclusive__intro')) {
      var intro = document.createElement('p');
      intro.className = 'owner-sale-exclusive__intro';
      intro.textContent = 'Объединяем стратегию, продвижение и переговоры в одной команде — от подготовки объекта до подписания договора.';

      var exclusiveCta = document.createElement('a');
      exclusiveCta.className = 'ui-button ui-button--primary ui-button--medium owner-sale-exclusive__cta';
      exclusiveCta.href = '#request';
      exclusiveCta.innerHTML = 'Связаться с брокером <span aria-hidden="true"><svg viewBox="0 0 16 16" focusable="false"><path d="M3 13 13 3M5 3h8v8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25"></path></svg></span>';

      exclusiveHeader.append(intro, exclusiveCta);
    }

    section.querySelectorAll('.owner-sale-exclusive__item').forEach(function (item, index) {
      if (item.querySelector('.owner-sale-exclusive__number')) return;

      var text = item.querySelector('.owner-sale-exclusive__text');
      if (!text) return;

      var number = document.createElement('span');
      number.className = 'owner-sale-exclusive__number';
      number.setAttribute('aria-hidden', 'true');
      number.textContent = String(index + 1).padStart(2, '0');

      var content = document.createElement('div');
      content.className = 'owner-sale-exclusive__content';

      var heading = document.createElement('h3');
      heading.className = 'owner-sale-exclusive__item-title';
      heading.textContent = itemTitles[index] || '';

      item.insertBefore(number, item.firstChild);
      content.append(heading, text);
      item.appendChild(content);
    });
  }

  function reorderBrandSections() {
    var about = document.querySelector('.about-company');
    var services = document.querySelector('.owner-sale-services');
    var exclusive = document.querySelector('.owner-sale-exclusive');

    if (!about || !services || !exclusive) return;
    if (about.parentNode !== services.parentNode || services.parentNode !== exclusive.parentNode) return;
    if (services.nextElementSibling === about && about.nextElementSibling === exclusive) return;

    var parent = services.parentNode;
    var first = [about, services, exclusive].sort(function (a, b) {
      return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    })[0];

    parent.insertBefore(services, first);
    parent.insertBefore(about, services.nextSibling);
    parent.insertBefore(exclusive, about.nextSibling);
  }

  function replaceConsultationSection() {
    var current = document.querySelector('.catalog-contact');
    if (!current || document.querySelector('.catalog-consultation')) return;

    var section = document.createElement('section');
    section.id = 'request';
    section.className = 'catalog-consultation';
    section.innerHTML = `
      <div class="catalog-consultation__inner">
        <div class="catalog-consultation__media">
          <img class="catalog-consultation__image" src="/assets/city-real-estate/source-assets/16-7d2ca45d4d-contacts-man.webp" alt="" width="1920" height="800">
          <div class="catalog-consultation__overlay" aria-hidden="true"></div>
          <div class="catalog-consultation__grid">
            <div class="catalog-consultation__content">
              <div class="catalog-consultation__mobile-expert">
                <div class="catalog-consultation__mobile-photo"><img src="/assets/city-real-estate/source-assets/17-23350d2829-cta-ruslan-pruss.webp" alt="Руслан Прус" width="68" height="68"></div>
                <div><p class="catalog-consultation__mobile-role">Руководитель департамента городской недвижимости</p><p class="catalog-consultation__mobile-name">Руслан Прус</p></div>
              </div>
              <div class="catalog-consultation__mobile-header"><h2 class="catalog-consultation__mobile-title">Эксперты BARNES подскажут</h2><p class="catalog-consultation__mobile-lead">Эксперты BARNES сэкономят ваше время и подберут оптимальный вариант недвижимости</p></div>
              <div class="catalog-consultation__header"><h2 class="catalog-consultation__subtitle">Эксперты BARNES подскажут</h2><p class="catalog-consultation__lead">Эксперты BARNES сэкономят ваше время и подберут оптимальный вариант недвижимости</p></div>
              <div class="catalog-consultation__methods" role="tablist" aria-label="Способ связи">
                <button type="button" role="tab" class="catalog-consultation__method" aria-selected="false" data-method="call"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg><span>Звонок</span></button>
                <button type="button" role="tab" class="catalog-consultation__method" aria-selected="false" data-method="max"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm-4-6.2c1.3.9 2.7 1.4 4.2 1.4a5.2 5.2 0 1 0-4.9-3.5c.1.8.4 1.5.7 2.1Z" fill="currentColor"/></svg><span>MAX</span></button>
                <button type="button" role="tab" class="catalog-consultation__method catalog-consultation__method--active" aria-selected="true" data-method="whatsapp"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 21a9 9 0 1 0-7.7-4.3L3 21l4.4-1.2A9 9 0 0 0 12 21Z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8.2 7.8c.5 4 3 6.5 7 7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/></svg><span>Whatsapp</span></button>
                <button type="button" role="tab" class="catalog-consultation__method" aria-selected="false" data-method="telegram"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m3 11 17-7-4 16-5-4-3 3 1-5-6-3Z" fill="currentColor"/><path d="m9 14 7-6" fill="none" stroke="#262626" stroke-width="1.2"/></svg><span>Telegram</span></button>
              </div>
              <form class="catalog-consultation__form" novalidate>
                <label class="catalog-consultation__field"><span class="visually-hidden">Ваше имя</span><input type="text" class="catalog-consultation__input" name="name" autocomplete="name" placeholder="Введите Ваше имя" aria-label="Ваше имя"></label>
                <label class="catalog-consultation__field"><span class="visually-hidden">Номер телефона</span><input type="tel" inputmode="tel" class="catalog-consultation__input" name="phone" autocomplete="tel" placeholder="Ваш номер телефона" aria-label="Номер телефона" required></label>
                <label class="catalog-consultation__field catalog-consultation__field--textarea"><span class="visually-hidden">Комментарий</span><textarea class="catalog-consultation__textarea" name="comment" rows="2" placeholder="Оставьте свой комментарий" aria-label="Комментарий"></textarea></label>
                <button type="submit" class="catalog-consultation__submit">Отправить заявку</button>
                <label class="catalog-consultation__consent"><input type="checkbox" class="catalog-consultation__consent-input" required><span class="catalog-consultation__consent-box" aria-hidden="true"></span><span>Я даю согласие на <a target="_blank" href="https://barn-estate.ru/legal_notices/yuridicheskie-uvedomleniya/">обработку персональных данных</a></span></label>
                <p class="catalog-consultation__status" aria-live="polite"></p>
              </form>
            </div>
          </div>
        </div>
      </div>`;

    current.replaceWith(section);

    section.querySelectorAll('.catalog-consultation__method').forEach(function (button) {
      button.addEventListener('click', function () {
        section.querySelectorAll('.catalog-consultation__method').forEach(function (item) {
          var active = item === button;
          item.classList.toggle('catalog-consultation__method--active', active);
          item.setAttribute('aria-selected', String(active));
        });
      });
    });

    section.querySelector('form').addEventListener('submit', function (event) {
      event.preventDefault();
      var phone = section.querySelector('[name="phone"]');
      var consent = section.querySelector('.catalog-consultation__consent-input');
      var status = section.querySelector('.catalog-consultation__status');
      if (!phone.value.trim() || !consent.checked) {
        status.textContent = 'Укажите номер телефона и подтвердите согласие.';
        return;
      }
      status.textContent = 'Спасибо! Заявка подготовлена к отправке.';
    });
  }

  function updateExclusiveScrollState() {
    var section = document.querySelector('.owner-sale-exclusive');
    var items = section && Array.from(section.querySelectorAll('.owner-sale-exclusive__item'));
    var header = section && section.querySelector('.owner-sale-exclusive__header');
    var desktop = window.matchMedia('(min-width: 901px)').matches;

    if (!section || !items.length) return;

    if (!desktop) {
      section.classList.remove('owner-sale-exclusive--scroll-ready');
      items.forEach(function (item) {
        item.classList.remove('is-active', 'is-past');
        item.style.removeProperty('--owner-rent-exclusive-last-offset');
      });
      return;
    }

    var alignmentLine = header ? parseFloat(window.getComputedStyle(header).top) : 120;
    if (!Number.isFinite(alignmentLine)) alignmentLine = 120;
    var lastItem = items[items.length - 1];
    var currentLastOffset = parseFloat(
      lastItem.style.getPropertyValue('--owner-rent-exclusive-last-offset')
    ) || 0;
    var naturalLastTop = lastItem.getBoundingClientRect().top - currentLastOffset;
    var headerTop = header ? header.getBoundingClientRect().top : alignmentLine;
    var lastOffset = Math.max(0, headerTop - naturalLastTop);
    lastItem.style.setProperty('--owner-rent-exclusive-last-offset', lastOffset + 'px');
    var activeIndex = 0;
    var closestDistance = Infinity;

    items.forEach(function (item, index) {
      var distance = Math.abs(item.getBoundingClientRect().top - alignmentLine);
      if (distance < closestDistance) {
        closestDistance = distance;
        activeIndex = index;
      }
    });

    section.classList.add('owner-sale-exclusive--scroll-ready');
    items.forEach(function (item, index) {
      item.classList.toggle('is-active', index === activeIndex);
      item.classList.toggle('is-past', index < activeIndex);
    });
  }

  function requestExclusiveScrollUpdate() {
    if (exclusiveScrollFrame) return;

    exclusiveScrollFrame = window.requestAnimationFrame(function () {
      exclusiveScrollFrame = null;
      updateExclusiveScrollState();
    });
  }

  function setupExclusiveScrollAnimation() {
    if (!exclusiveScrollReady) {
      exclusiveScrollReady = true;
      window.addEventListener('scroll', requestExclusiveScrollUpdate, { passive: true });
      window.addEventListener('resize', requestExclusiveScrollUpdate, { passive: true });
    }

    requestExclusiveScrollUpdate();
  }

  function enhanceSectionHeadings() {
    var sections = [
      {
        selector: '.owner-sale-presentation__title',
        eyebrow: 'СТРАТЕГИЯ ПРЕЗЕНТАЦИИ',
        id: 'owner-rent-presentation-title'
      },
      {
        selector: '.about-company__title',
        eyebrow: 'BARNES / МОСКВА',
        id: 'owner-rent-about-title'
      },
      {
        selector: '.newsletter-cta h2',
        eyebrow: 'BARNES / АНАЛИТИКА',
        id: 'owner-rent-newsletter-title'
      }
    ];

    sections.forEach(function (config) {
      var title = document.querySelector(config.selector);
      var section = title && title.closest('section');
      var container = title && title.parentElement;

      if (!title || !container) return;

      title.id = config.id;
      if (section) section.setAttribute('aria-labelledby', config.id);

      var eyebrow = container.querySelector(':scope > .owner-rent-section-eyebrow');
      if (!eyebrow) {
        eyebrow = document.createElement('p');
        eyebrow.className = 'owner-rent-section-eyebrow';
        eyebrow.textContent = config.eyebrow;
        container.insertBefore(eyebrow, title);
      }
    });

    var contactTitle = document.querySelector('.catalog-contact__title');
    var contactSection = contactTitle && contactTitle.closest('section');
    var contactEyebrow = document.querySelector(
      '.catalog-contact .owner-rent-section-eyebrow'
    );

    if (contactEyebrow) contactEyebrow.remove();
    if (contactTitle) {
      contactTitle.id = 'owner-rent-contact-title';
      if (contactSection) contactSection.setAttribute('aria-labelledby', contactTitle.id);
    }

    document.querySelectorAll(
      '.owner-sale-services__eyebrow, .owner-sale-exclusive__eyebrow'
    ).forEach(function (eyebrow) {
      eyebrow.classList.add('owner-rent-section-eyebrow');
    });
  }

  function enhanceTypeCardActions() {
    document.querySelectorAll('.owner-sale-types__action').forEach(function (action) {
      if (action.querySelector('.owner-sale-types__action-icon')) return;

      var icon = document.createElement('span');
      icon.className = 'owner-sale-types__action-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.innerHTML = '<svg viewBox="0 0 16 16" focusable="false"><path d="M3 13 13 3M5 3h8v8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25"></path></svg>';
      action.appendChild(icon);
    });
  }

  function scheduleServicesEnhancement() {
    window.clearTimeout(enhancementTimer);
    enhancementTimer = window.setTimeout(function () {
      reorderBrandSections();
      replaceConsultationSection();
      enhanceHeroSection();
      enhanceServicesSection();
      enhanceExclusiveSection();
      enhanceSectionHeadings();
      enhanceTypeCardActions();
      setupExclusiveScrollAnimation();
    }, 600);
  }

  function syncMenuState() {
    trigger = document.querySelector('.site-header__icon-btn');
    var menu = document.querySelector('.site-menu');

    if (!trigger) return;

    trigger.setAttribute('aria-controls', menuId);
    trigger.setAttribute('aria-expanded', menu ? 'true' : 'false');
    trigger.setAttribute('aria-label', menu ? 'Закрыть меню' : 'Открыть меню');

    if (menu) {
      menu.id = menuId;
      menu.setAttribute('aria-label', 'Основное меню');
    }
  }

  document.addEventListener('click', function (event) {
    if (event.target.closest && event.target.closest('.site-header__icon-btn')) {
      syncMenuState();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;

    window.setTimeout(function () {
      syncMenuState();
      if (!document.querySelector('.site-menu') && trigger) trigger.focus();
    }, 0);
  });

  new MutationObserver(function () {
    syncMenuState();
    scheduleServicesEnhancement();
  }).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class']
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      syncMenuState();
      scheduleServicesEnhancement();
    }, { once: true });
  } else {
    syncMenuState();
    scheduleServicesEnhancement();
  }
})();
