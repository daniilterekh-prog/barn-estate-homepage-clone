/* Page wiring for the unchanged owner/media header component. */
(() => {
  const header = document.querySelector('.site-header');
  const wrapper = document.querySelector('.layout__header');
  const menu = document.querySelector('.site-menu');
  const trigger = header.querySelector('.site-header__icon-btn');
  const sticky = document.querySelector('.owner-sale-sticky');
  const main = document.querySelector('main');
  const footer = document.querySelector('footer');
  const hero = document.querySelector('.hero');
  const target = document.querySelector('#zhk-site-menu-nav');
  const updateTop = () => document.documentElement.style.setProperty('--zhk-menu-top', `${header.getBoundingClientRect().height}px`);
  new ResizeObserver(updateTop).observe(header);
  const buildMenu = () => {
    if (target.children.length) return;
    const nav = header.querySelector('.mh-reference-nav');
    if (!nav) return;
    nav.querySelectorAll(':scope > ul > li').forEach(item => {
      const parent = item.querySelector(':scope > a');
      const group = document.createElement('details');
      group.className = 'zhk-menu-section';
      const summary = document.createElement('summary');
      summary.textContent = parent.textContent;
      group.append(summary);
      const all = document.createElement('a');
      all.textContent = `Все: ${parent.textContent}`;
      all.href = parent.href;
      group.append(all);
      item.querySelectorAll('.mh-subnav a').forEach(link => group.append(link.cloneNode(true)));
      target.append(group);
    });
  };
  buildMenu();
  if (!target.children.length) {
    const wait = new MutationObserver(() => { buildMenu(); if (target.children.length) wait.disconnect(); });
    wait.observe(header, { childList: true, subtree: true });
  }
  const setMenu = open => {
    header.classList.toggle('site-header--menu-open', open);
    wrapper.classList.toggle('is-menu-open', open);
    menu.hidden = !open;
    document.body.classList.toggle('has-site-menu', open);
    main.inert = open;
    footer.inert = open;
    trigger.setAttribute('aria-expanded', String(open));
    trigger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    updateTop();
    window.__barnesMediaHeaderSync?.refresh();
  };
  trigger.addEventListener('click', () => setMenu(!header.classList.contains('site-header--menu-open')));
  menu.querySelector('.zhk-menu-project').addEventListener('click', event => {
    if (!event.target.closest('a')) return;
    setMenu(false);
  });
  new IntersectionObserver(([entry]) => {
    const visible = entry.boundingClientRect.bottom <= 0;
    sticky.classList.toggle('owner-sale-sticky--visible', visible);
    sticky.setAttribute('aria-hidden', String(!visible));
    sticky.inert = !visible;
    window.__barnesMediaHeaderSync?.refresh();
  }, { threshold: 0 }).observe(hero);
  const anchors = sticky.querySelectorAll('.owner-sale-sticky__link');
  const sectionsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      anchors.forEach(link => {
        const active = link.hash === `#${entry.target.id}`;
        link.classList.toggle('owner-sale-sticky__link--active', active);
        if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-120px 0px -55% 0px', threshold: 0 });
  anchors.forEach(link => { const section = document.querySelector(link.hash); if (section) sectionsObserver.observe(section); });
})();
