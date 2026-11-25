/* Home header states: transparent at the top, fixed white after 48px of scrolling. */
(() => {
  const header = document.querySelector('.site-header');
  const wrapper = document.querySelector('.layout__header');
  const menu = document.querySelector('.site-menu');
  const trigger = header.querySelector('.site-header__icon-btn');
  const main = document.querySelector('main');
  const footer = document.querySelector('footer');
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
      summary.tabIndex = 0;
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
  const updateScrolled = () => {
    const scrolled = window.scrollY > 48;
    if (header.classList.contains('site-header--scrolled') === scrolled) return;
    header.classList.toggle('site-header--scrolled', scrolled);
    updateTop();
    window.__barnesMediaHeaderSync?.refresh();
  };
  let scrollFrame = 0;
  window.addEventListener('scroll', () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      updateScrolled();
    });
  }, { passive: true });
  window.addEventListener('pageshow', updateScrolled);
  updateScrolled();
})();
