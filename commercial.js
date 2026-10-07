(() => {
  const page = document.querySelector('.commercial-page');
  const header = document.querySelector('[data-commercial-header]');
  const menu = document.querySelector('[data-menu]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const toast = document.querySelector('[data-toast]');

  const consultation = document.querySelector('.commercial-consultation');
  if (consultation?.id === 'commercial-contact') consultation.id = 'commercial-consultation';
  const headerInner = document.querySelector('.commercial-header__inner');
  const headerPhone = document.querySelector('.commercial-header__phone');
  if (headerInner && headerPhone && !headerInner.querySelector('.commercial-header__right')) {
    const headerRight = document.createElement('div');
    headerRight.className = 'commercial-header__right';
    const sellLink = document.createElement('a');
    sellLink.className = 'commercial-header__sell';
    sellLink.href = '#commercial-contact';
    sellLink.innerHTML = 'Продать недвижимость <span aria-hidden="true">↗</span>';
    headerRight.append(sellLink, headerPhone);
    headerInner.append(headerRight);
  }
  if (header && !header.querySelector('.commercial-page-nav')) {
    const pageNav = document.createElement('div');
    pageNav.className = 'commercial-page-nav';
    pageNav.innerHTML = '<div class="commercial-page-nav__inner"><div class="commercial-page-nav__list"><a class="is-active" href="#commercial-map">Карта</a><a href="#commercial-contact">Оставить заявку</a><a href="#commercial-news">Статьи</a></div><div class="commercial-page-nav__brand"><a href="index.html"><img src="assets/commercial/logo-current.svg" alt="BARNES Moscow" /></a><a class="commercial-page-nav__phone" href="tel:+74951825079">+7 (495) 182-50-79 <span aria-hidden="true">⌕</span></a></div></div>';
    header.append(pageNav);
  }
  document.querySelectorAll('.commercial-logo img').forEach((image) => { image.src = 'assets/commercial/logo-current.svg'; });
  const faqTitle = document.querySelector('#commercial-faq-title');
  if (faqTitle) faqTitle.textContent = 'ВОПРОСЫ И ОТВЕТЫ ПО КОММЕРЧЕСКОЙ НЕДВИЖИМОСТИ';
  const projectTitle = document.querySelector('#commercial-projects-title');
  if (projectTitle && window.innerWidth <= 860) projectTitle.innerHTML = 'АКТУАЛЬНЫЕ ПРОЕКТЫ И<br />ЛОТЫ';
  document.querySelectorAll('.commercial-faq details').forEach((item) => item.removeAttribute('open'));
  const favoriteCount = document.querySelector('.commercial-header__favorite b');
  if (favoriteCount) favoriteCount.style.display = 'none';
  const mapImage = document.querySelector('.commercial-map > img');
  if (mapImage && window.innerWidth >= 1800) {
    mapImage.src = 'assets/commercial/source-map-wide.png';
    document.querySelector('.commercial-map')?.classList.add('commercial-map--captured');
  }

  const introLead = document.querySelector('.commercial-intro__copy > p:not(.commercial-kicker)');
  if (introLead) introLead.textContent = 'В каталоге BARNES MOSCOW представлены коммерческие объекты в Москве и Московской области: офисы, торговые помещения, помещения свободного назначения, отдельно стоящие здания, склады и индустриальные объекты. Среди предложений есть как свободные объекты для собственного бизнеса, так и помещения с действующими арендаторами для получения регулярного дохода.';
  const introTitle = document.querySelector('.commercial-intro__copy > h2');
  if (introTitle) introTitle.innerHTML = 'КОММЕРЧЕСКАЯ<br class="commercial-mobile-break"> НЕДВИЖИМОСТЬ<br class="commercial-mobile-break"> МОСКВЫ';
  const introToggle = document.querySelector('[data-intro-toggle]');
  if (introToggle) introToggle.innerHTML = '<span>читать далее</span><span aria-hidden="true">↗</span>';
  const newsEyebrow = document.querySelector('.commercial-news .commercial-kicker');
  if (newsEyebrow) newsEyebrow.textContent = 'Медиа Barnes';
  const newsTitle = document.querySelector('.commercial-news h2');
  if (newsTitle) newsTitle.innerHTML = 'АКТУАЛЬНЫЕ<br class="commercial-mobile-break"> СТАТЬИ ПО<br class="commercial-mobile-break"> КОММЕРЧЕСКОЙ НЕДВИЖИМОСТИ';
  const newsMore = document.querySelector('.commercial-news>.commercial-shell>.commercial-more-link');
  if (newsMore) newsMore.innerHTML = '<span>Читать все новости</span><span aria-hidden="true">↗</span>';
  document.querySelectorAll('.commercial-floating-expert img, .commercial-contact__expert img').forEach((image) => { image.src = 'assets/commercial/expert-current.webp'; });

  const consultationCopy = document.querySelector('.commercial-consultation__copy');
  if (consultationCopy) {
    consultationCopy.querySelector('.commercial-kicker')?.remove();
    consultationCopy.querySelector('h2')?.remove();
    const consultationTitle = consultationCopy.querySelector('h3');
    if (consultationTitle) consultationTitle.textContent = 'Эксперты BARNES подскажут';
    const methods = consultationCopy.querySelector('.commercial-methods');
    if (methods) {
      const methodButtons = [...methods.querySelectorAll('button')];
      ['Звонок', 'MAX', 'Whatsapp', 'Telegram'].forEach((label) => {
        const button = methodButtons.find((item) => item.textContent.trim().toLowerCase() === label.toLowerCase());
        if (button) methods.append(button);
      });
      const icons = {
        Звонок: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>',
        MAX: '<svg viewBox="0 0 42 42" aria-hidden="true"><path d="M21.47 41.88c-4.11 0-6.02-.6-9.34-3-2.1 2.7-8.75 4.81-9.04 1.2 0-2.71-.6-5-1.28-7.5C1 29.5.08 26.07.08 21.1.08 9.23 9.82.3 21.36.3c11.55 0 20.6 9.37 20.6 20.91a20.6 20.6 0 0 1-20.49 20.67m.17-31.32c-5.62-.29-10 3.6-10.97 9.7-.8 5.05.62 11.2 1.83 11.52.58.14 2.04-1.04 2.95-1.95a10.4 10.4 0 0 0 5.08 1.81 10.7 10.7 0 0 0 11.19-9.97 10.7 10.7 0 0 0-10.08-11.1Z"></path></svg>',
        Whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495.0.16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"></path></svg>',
        Telegram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"></path></svg>'
      };
      methods.querySelectorAll('button').forEach((button) => {
        const label = button.textContent.trim();
        button.innerHTML = `${icons[label] || ''}<span>${label}</span>`;
      });
      methods.querySelectorAll('button').forEach((button) => button.classList.toggle('is-active', button.textContent.trim().toLowerCase() === 'whatsapp'));
    }
    const leadForm = consultationCopy.querySelector('.commercial-lead-form');
    if (leadForm) {
      leadForm.innerHTML = '<label><input name="name" autocomplete="name" required placeholder="Введите Ваше имя" /></label><label><input name="phone" autocomplete="tel" required placeholder="Ваш номер телефона" /></label><label class="commercial-consultation__textarea-label"><textarea class="commercial-contact-textarea" name="message" placeholder="Оставьте свой комментарий"></textarea></label><button class="commercial-button commercial-button--red" type="submit">Отправить заявку</button><label class="commercial-checkbox"><input type="checkbox" required /> <span>Я даю согласие на обработку персональных данных</span></label><p class="commercial-form-status" data-form-status aria-live="polite"></p>';
    }
  }

  const contactMethods = document.querySelector('.commercial-contact__methods');
  if (contactMethods) {
    const consultationButtons = [...document.querySelectorAll('.commercial-consultation .commercial-methods button')];
    const contactButtons = [...contactMethods.querySelectorAll('button')];
    ['Звонок', 'MAX', 'Whatsapp', 'Telegram'].forEach((label) => {
      const button = contactButtons.find((item) => item.textContent.trim().toLowerCase().startsWith(label.toLowerCase()));
      if (button) contactMethods.append(button);
    });
    contactMethods.querySelectorAll('button').forEach((button) => {
      const label = button.textContent.trim().replace('↗', '').trim();
      const sourceButton = consultationButtons.find((item) => item.textContent.trim().toLowerCase() === label.toLowerCase());
      button.innerHTML = `${sourceButton?.querySelector('svg')?.outerHTML || ''}<span>${label}</span>`;
      button.classList.toggle('is-active', label.toLowerCase() === 'whatsapp');
    });
  }
  const contactForm = document.querySelector('.commercial-contact__form');
  if (contactForm) {
    contactForm.innerHTML = '<label><input name="name" autocomplete="name" required placeholder="Введите Ваше имя" /></label><label><input name="phone" autocomplete="tel" required placeholder="Ваш номер телефона" /></label><label class="commercial-contact__message"><textarea name="message" placeholder="Оставьте свой комментарий"></textarea></label><button class="commercial-button commercial-button--red" type="submit">Отправить заявку</button><label class="commercial-checkbox"><input type="checkbox" required /> <span>Я даю согласие на обработку персональных данных</span></label><p class="commercial-form-status" data-form-status aria-live="polite"></p>';
  }
  const contactCardSubmit = document.querySelector('.commercial-contact__submit');
  if (contactCardSubmit) contactCardSubmit.textContent = 'Получить подборку';

  const catalogLots = [
    ['582971', 'ПСН в Метрополь, 270 кв.м., Театральный проезд 2.', 'Театральный проезд, 2', '270 м²', '1', '1 575 000 ₽', 'catalog-02.jpeg'],
    ['594473', 'Аренда ПСН 416.2 м² в бизнес-центре Малая Дмитровка, 5/9.', 'Малая Дмитровка ул, 5/9', '416,2 м²', '1', '3 000 000 ₽', 'catalog-03.jpg'],
    ['587829', 'Аренда офиса 314.8 м² в особняке Малый Ивановский, 7-9с1', 'Малый Ивановский пер, 7-9стр1', '314,8 м²', '2', '1 548 750 ₽', 'catalog-04.jpg'],
    ['562779', 'Помещение свободного назначения в шаговой доступности от "Патриарших прудов", Большая Садовая 6стр2', 'Большая Садовая ул, 6стр2', '27,7 м²', '1', '550 000 ₽', 'catalog-05.jpg'],
    ['590186', 'ПСН 1637м2 в ЦАО', 'Долгоруковская ул, 40', '1 637,5 м²', '1', '4 970 000 ₽', 'catalog-06.png'],
    ['587184', 'Сдается помещение свободного назначения (А) в бизнес-центре «OPUS (Опус)»', 'Дербеневская ул, 1', '35 м²', '1', '350 000 ₽', 'catalog-07.jpg'],
    ['595945', 'ГАБ с Магнит', 'Речная ул, 20к1', '753 м²', '1', '125 000 000 ₽', 'catalog-08.png'],
    ['593473', 'Аренда офиса 265.5 м² Большая Дмитровка, 7/5с1', 'Большая Дмитровка ул, 7/5стр1', '265 м²', '4', '1 104 166 ₽', 'catalog-09.jpg'],
    ['585814', 'Офисы с ремонтом в лофт-квартале на Тульской', 'Варшавское ш, 9 с1Б', '190,9 м²', '3', '636 400 ₽', 'catalog-10.jpeg'],
    ['595323', 'Крылатские Холмы', 'Крылатская ул, 17к1', '190 м²', '1', '1 390 800 ₽', 'catalog-11.jpg'],
    ['588355', 'БЦ " Романов двор"', 'Романов пер, 4стр2', '1 591 м²', '5', '14 557 650 ₽', 'catalog-12.jpg'],
    ['583655', 'Маршала Василевского, д.5к1', 'Маршала Василевского ул, 5к1', '481 м²', '1', '125 000 000 ₽', 'catalog-13.png']
  ];
  document.querySelectorAll('.commercial-property-card').forEach((card, index) => {
    const lot = catalogLots[index];
    if (!lot) return;
    const [id, name, address, area, floor, price, image] = lot;
    card.dataset.price = price.replace(/[^0-9]/g, '');
    card.dataset.area = area.replace(',', '.').replace(/[^0-9.]/g, '');
    const imageNode = card.querySelector('.commercial-property-card__media img');
    if (imageNode) { imageNode.src = `assets/commercial/${image}`; imageNode.alt = name; }
    const meta = card.querySelector('.commercial-card-meta span');
    if (meta) meta.textContent = `ID ${id}`;
    const title = card.querySelector('h3');
    if (title) title.textContent = name;
    const addressNode = card.querySelector('.commercial-property-card__body > p');
    if (addressNode) addressNode.textContent = address;
    const values = card.querySelectorAll('dl dt');
    if (values[0]) values[0].textContent = area;
    if (values[1]) values[1].textContent = floor;
    const priceNode = card.querySelector('strong');
    if (priceNode) priceNode.textContent = price;
    const detail = card.querySelector('.commercial-property-card__actions a');
    if (detail) detail.href = `https://barn-estate.ru/kommercheskaya-nedvizhimost/${id}/`;
  });

  // The source catalog keeps the action row outside the information body.
  // Move our semantically grouped controls after the body before layout settles.
  document.querySelectorAll('.commercial-property-card').forEach((card) => {
    const body = card.querySelector('.commercial-property-card__body');
    const actions = body?.querySelector('.commercial-property-card__actions');
    if (body && actions) body.parentNode.insertBefore(actions, body.nextSibling);
  });

  const footerNav = document.querySelector('.commercial-footer__nav');
  if (footerNav && footerNav.children.length === 8) {
    const media = footerNav.children[5];
    const owner = footerNav.lastElementChild;
    const sp = document.createElement('div');
    sp.innerHTML = '<h2>Санкт-Петербург</h2><a>Вторичная</a><a>Новостройки</a><a>Загородная</a><a>Коммерческая</a><a>Эксклюзив</a><a>Апартаменты</a><a>Пентхаус</a>';
    footerNav.insertBefore(sp, media);
    owner.style.gridColumn = '1';
    const titles = ['Москва', 'Загородная', 'Коммерческая', 'Курортная', 'Зарубежная', 'Санкт-Петербург', 'Медиа', 'О BARNES', 'Собственникам'];
    [...footerNav.children].forEach((column, index) => { const title = column.querySelector('h2'); if (title) title.textContent = titles[index]; });
  }
  if (footerNav) {
    const appendLinks = (column, labels) => labels.forEach((label) => {
      if (!column || [...column.querySelectorAll('a')].some((link) => link.textContent.trim() === label)) return;
      const link = document.createElement('a');
      link.textContent = label;
      column.append(link);
    });
    appendLinks(footerNav.children[0], ['Застройщики']);
    appendLinks(footerNav.children[4], ['Португалия', 'Франция', 'Оман', 'Жилые комплексы']);
    appendLinks(footerNav.children[6], ['Кейсы', 'Журнал']);
    appendLinks(footerNav.children[7], ['Мероприятия', 'Вакансии', 'Стиль жизни']);

    const footerLinks = [
      ['/vtorichnaya-nedvizhimost/', '/arendovat/', '/novostroyki/', '/zhilye-kompleksy/', '/gorodskaya-nedvizhimost/kvartiry/', '/gorodskaya-nedvizhimost/apartamenty/', '/kupit-penthausy-v-moskve/', '/zastroyshchiki/'],
      ['/zagorodnaya-nedvizhimost/', '/snyat-zagorodnuyu-nedvizhimost/', '/kottedzhnye-poselki/'],
      ['/kommercheskaya-nedvizhimost/', '/kommercheskaya-nedvizhimost/arendovat/', '/kommercheskaya-nedvizhimost/zdanie/', '/kommercheskaya-nedvizhimost/business-center/', '/kommercheskaya-nedvizhimost/osobnyak/', '/kommercheskaya-nedvizhimost/arendnyj-biznes/'],
      ['/media/tag/investitsii-v-kurortnuyu-nedvizhimost-rossii/', '/altai/', '/arhyz/', '/sochi/'],
      ['/oae/', '/mezhdunarodnaya-nedvizhimost/turtsiya/', '/tailand/', '/zhilye-kompleksy-indonesia/', '/ispaniya/', '/italiya/', '/portugaliya/', '/frantsiya/', '/oman/', '/mezhdunarodnaya-nedvizhimost-zhilye-kompleksy/'],
      ['https://barnes-spb.ru/gorodskaya-nedvizhimost/vtorichnaya-nedvizhimost/', 'https://barnes-spb.ru/gorodskaya-nedvizhimost/novostroyki/', 'https://barnes-spb.ru/zagorodnaya-nedvizhimost/', 'https://barnes-spb.ru/kommercheskaya-nedvizhimost/', 'https://barnes-spb.ru/exclusive/', 'https://barnes-spb.ru/gorodskaya-nedvizhimost/filter/type_immovables-is-apartamenty/', 'https://barnes-spb.ru/gorodskaya-nedvizhimost/filter/type_immovables-is-penthausy/'],
      ['/media/blog/', '/media/novosti/', '/media/vebinary-i-video/', '/media/analitika/', '/media/stil-zhizni/', '/media/cases/', '/zhurnaly/'],
      ['/contacts/', '/for-partners/', '/barnes-club/', '/novosti/smi-o-nas/', '/novosti/meropriyatiya/', '/team/', '/vacancies/', '/stily-zhizni/'],
      ['/prodazha_sobstvennikam/', '/arenda_sobstvennikam/']
    ];
    [...footerNav.children].forEach((column, columnIndex) => {
      [...column.querySelectorAll('a')].forEach((link, linkIndex) => {
        const href = footerLinks[columnIndex]?.[linkIndex];
        if (href) link.href = href.startsWith('http') ? href : `https://barn-estate.ru${href}`;
      });
    });
  }

  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove('is-visible'), 2800);
  };

  const setMenu = (open) => {
    menu.hidden = !open;
    header.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    if (open) menu.querySelector('a')?.focus();
  };

  menuToggle?.addEventListener('click', () => setMenu(menu.hidden));
  menu?.addEventListener('click', (event) => { if (event.target === menu) setMenu(false); });
  document.querySelectorAll('.commercial-menu a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  const pageNavLinks = [...document.querySelectorAll('.commercial-page-nav__list a')];
  const updatePageNav = () => {
    const y = window.scrollY;
    const newsTop = document.querySelector('#commercial-news')?.offsetTop ?? Infinity;
    const requestTop = document.querySelector('.commercial-intro')?.offsetTop ?? Infinity;
    const target = y >= newsTop ? '#commercial-news' : y >= requestTop ? '#commercial-contact' : '#commercial-map';
    pageNavLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === target));
  };
  window.addEventListener('scroll', () => { header.classList.toggle('is-scrolled', window.scrollY > 32); updatePageNav(); }, { passive: true });
  updatePageNav();

  document.querySelectorAll('.commercial-favorite').forEach((button) => button.addEventListener('click', () => {
    const active = button.getAttribute('aria-pressed') === 'true';
    button.setAttribute('aria-pressed', String(!active));
    const count = [...document.querySelectorAll('.commercial-favorite[aria-pressed="true"]')].length;
    const badge = document.querySelector('.commercial-header__favorite b');
    badge.textContent = count;
    badge.style.display = count ? 'grid' : 'none';
  }));

  document.querySelector('[data-hero-search]')?.addEventListener('submit', (event) => {
    event.preventDefault();
    document.querySelector('#commercial-projects')?.scrollIntoView({ behavior: 'smooth' });
  });

  document.querySelectorAll('[data-open-contact]').forEach((button) => button.addEventListener('click', () => {
    document.querySelector('#commercial-contact')?.scrollIntoView({ behavior: 'smooth' });
    window.setTimeout(() => document.querySelector('.commercial-lead-form input')?.focus(), 550);
  }));

  document.querySelector('[data-map-fullscreen]')?.addEventListener('click', () => {
    const map = document.querySelector('[data-map]');
    map.classList.toggle('is-fullscreen');
    document.body.classList.toggle('commercial-no-scroll', map.classList.contains('is-fullscreen'));
  });

  document.querySelector('[data-intro-toggle]')?.addEventListener('click', (event) => {
    const extra = document.querySelector('[data-intro-extra]');
    const expanded = extra.classList.toggle('is-visible');
    event.currentTarget.firstChild.textContent = expanded ? 'СКРЫТЬ ' : 'ЧИТАТЬ ДАЛЕЕ ';
  });

  document.querySelectorAll('.commercial-methods button').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('.commercial-methods button').forEach((item) => item.classList.remove('is-active'));
    button.classList.add('is-active');
  }));

  document.querySelectorAll('[data-lead-form]').forEach((form) => form.addEventListener('submit', (event) => {
    event.preventDefault();
    event.currentTarget.querySelector('[data-form-status]').textContent = 'Спасибо — эксперт BARNES свяжется с вами.';
    event.currentTarget.reset();
  }));

  const grid = document.querySelector('[data-project-grid]');
  document.querySelector('[data-sort]')?.addEventListener('change', (event) => {
    const cards = [...grid.children];
    const direction = event.target.value;
    cards.sort((a, b) => {
      if (direction === 'Цена меньше') return Number(a.dataset.price) - Number(b.dataset.price);
      if (direction === 'Цена больше') return Number(b.dataset.price) - Number(a.dataset.price);
      if (direction === 'Площадь меньше') return Number(a.dataset.area) - Number(b.dataset.area);
      if (direction === 'Площадь больше') return Number(b.dataset.area) - Number(a.dataset.area);
      return 0;
    });
    cards.forEach((card) => grid.append(card));
  });
  document.querySelector('[data-load-more]')?.addEventListener('click', (event) => {
    event.currentTarget.textContent = 'ВСЕ ОБЪЕКТЫ УЖЕ ПОКАЗАНЫ';
    event.currentTarget.disabled = true;
  });

  const track = document.querySelector('[data-news-track]');
  let newsOffset = 0;
  const moveNews = (step) => {
    const first = track?.firstElementChild;
    if (!first) return;
    const width = first.getBoundingClientRect().width + 26;
    const max = Math.max(0, track.children.length - (window.innerWidth < 860 ? 1 : 4));
    newsOffset = Math.max(0, Math.min(max, newsOffset + step));
    track.style.transform = `translateX(-${newsOffset * width}px)`;
  };
  document.querySelector('[data-news-prev]')?.addEventListener('click', () => moveNews(-1));
  document.querySelector('[data-news-next]')?.addEventListener('click', () => moveNews(1));

  document.querySelector('[data-floating-expert] .commercial-floating-expert__close')?.addEventListener('click', () => document.querySelector('[data-floating-expert]').classList.add('is-hidden'));
  page?.classList.add('is-ready');
})();
