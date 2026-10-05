(() => {
  const page = document.querySelector('.commercial-page');
  const header = document.querySelector('[data-commercial-header]');
  const menu = document.querySelector('[data-menu]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const toast = document.querySelector('[data-toast]');

  const consultation = document.querySelector('.commercial-consultation');
  if (consultation?.id === 'commercial-contact') consultation.id = 'commercial-consultation';
  const faqTitle = document.querySelector('#commercial-faq-title');
  if (faqTitle) faqTitle.textContent = 'Вопросы и ответы по коммерческой недвижимости';
  document.querySelectorAll('.commercial-faq details').forEach((item) => item.removeAttribute('open'));
  const favoriteCount = document.querySelector('.commercial-header__favorite b');
  if (favoriteCount) favoriteCount.style.display = 'none';
  const mapImage = document.querySelector('.commercial-map > img');
  if (mapImage && window.innerWidth >= 1800) {
    mapImage.src = 'assets/commercial/source-map-wide.png';
    document.querySelector('.commercial-map')?.classList.add('commercial-map--captured');
  }

  // The source catalog keeps the action row outside the information body.
  // Move our semantically grouped controls after the body before layout settles.
  document.querySelectorAll('.commercial-property-card').forEach((card) => {
    const body = card.querySelector('.commercial-property-card__body');
    const actions = body?.querySelector('.commercial-property-card__actions');
    if (body && actions) body.parentNode.insertBefore(actions, body.nextSibling);
  });

  const footerNav = document.querySelector('.commercial-footer__nav');
  if (footerNav && footerNav.children.length === 8) {
    const owner = footerNav.lastElementChild;
    const sp = document.createElement('div');
    sp.innerHTML = '<h2>Санкт-Петербург</h2><a>Вторичная</a><a>Новостройки</a><a>Загородная</a><a>Коммерческая</a><a>Эксклюзив</a><a>Апартаменты</a><a>Пентхаус</a>';
    footerNav.insertBefore(sp, owner);
    owner.style.gridColumn = '1';
    const titles = ['Москва', 'Загородная', 'Коммерческая', 'Курортная', 'Зарубежная', 'Санкт-Петербург', 'Медиа', 'О BARNES', 'Собственникам'];
    [...footerNav.children].forEach((column, index) => { const title = column.querySelector('h2'); if (title) title.textContent = titles[index]; });
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
  window.addEventListener('scroll', () => header.classList.toggle('is-scrolled', window.scrollY > 32), { passive: true });

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
