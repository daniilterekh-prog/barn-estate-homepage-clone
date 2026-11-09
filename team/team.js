(() => {
  const filters = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('.team-grid__item')];
  const status = document.querySelector('.team-count');
  document.querySelector('.team-filters').hidden = false;
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    let count = 0;
    cards.forEach(card => {
      const filter = button.dataset.filter;
      const matches = filter === 'all' || (filter === 'management' ? card.dataset.leadership === 'true' : card.dataset.group === filter);
      card.hidden = !matches;
      if (!card.hidden) count++;
    });
    status.textContent = `${button.dataset.filter === 'all' ? 'Все специалисты' : button.textContent} · ${count}`;
  }));
  const burger = document.querySelector('.site-header__icon-btn');
  const menu = document.querySelector('#site-mobile-menu');
  const header = document.querySelector('.site-header');
  if (burger && menu) {
    menu.hidden = true;
    const toggle = (open, restoreFocus = false) => {
      menu.hidden = !open;
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
      header.classList.toggle('site-header--menu-open', open);
      document.body.classList.toggle('team-menu-open', open);
      document.querySelector('main').inert = open;
      document.querySelector('.site-footer').inert = open;
      if (restoreFocus) burger.focus();
    };
    burger.addEventListener('click', () => toggle(menu.hidden));
    menu.addEventListener('click', e => { if (e.target.closest('a')) toggle(false); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !menu.hidden) toggle(false, true);
    });
    document.addEventListener('click', e => {
      if (!menu.hidden && !header.contains(e.target) && !menu.contains(e.target)) toggle(false);
    });
  }
  document.querySelectorAll('.mh-contact-toggle,.home-header-contacts-toggle').forEach(button => {
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    if (!panel) return;
    panel.hidden = true;
    const close = () => { panel.hidden = true; button.setAttribute('aria-expanded', 'false'); };
    button.addEventListener('click', () => {
      panel.hidden = !panel.hidden;
      button.setAttribute('aria-expanded', String(!panel.hidden));
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { close(); button.focus(); } });
    document.addEventListener('click', e => { if (!panel.contains(e.target) && !button.contains(e.target)) close(); });
  });
})();
// Local positioning for the canonical breadcrumb CSS; protected shared files are unchanged.
(() => {
 const crumbs = document.querySelector('.team-breadcrumbs');
 const row = document.querySelector('.site-header__top');
 const sync = () => {
  if (!crumbs || !row) return;
  const canvas = document.body.getBoundingClientRect();
  crumbs.style.width = `${Math.min(1920, canvas.width)}px`;
  crumbs.style.left = `${Math.max(0, (canvas.width - 1920) / 2)}px`;
  crumbs.style.visibility = innerWidth <= 1024 || scrollY > 4 ? 'hidden' : '';
  if (innerWidth > 1024 && scrollY < 4) crumbs.style.top = `${row.getBoundingClientRect().bottom - crumbs.offsetHeight - 8}px`;
 };
 addEventListener('resize', sync);
 addEventListener('scroll', sync, {passive:true});
 document.fonts.ready.then(sync);
 sync();
})();
