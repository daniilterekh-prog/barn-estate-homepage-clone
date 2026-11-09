(() => {
  const filters = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('.team-grid__item')];
  const status = document.querySelector('.team-count');
  // Reserve the tallest name and role across the entire team, including filtered cards.
  // Filter changes must not move a person's name; only available card width may resize it.
  const grid = document.querySelector('.team-grid');
  let alignmentFrame = 0;
  const alignCardText = () => {
    alignmentFrame = 0;
    const visible = cards.filter(card => !card.hidden);
    if (!visible.length) return;
    const overlay = visible[0].querySelector('.team-member-card__overlay');
    const overlayStyle = getComputedStyle(overlay);
    const width = Math.min(...visible.map(card => card.querySelector('.team-member-card__overlay').getBoundingClientRect().width))
      - parseFloat(overlayStyle.paddingLeft) - parseFloat(overlayStyle.paddingRight);
    if (width <= 0) return;
    const probe = document.createElement('div');
    probe.setAttribute('aria-hidden', 'true');
    probe.inert = true;
    probe.style.cssText = `position:fixed;left:-10000px;top:0;width:${width}px;visibility:hidden;pointer-events:none;`;
    const probes = {};
    for (const kind of ['name', 'role']) {
      const selector = `.team-member-card__${kind}`;
      const type = getComputedStyle(visible[0].querySelector(selector));
      probes[kind] = cards.map(card => {
        const node = document.createElement('div');
        node.textContent = card.querySelector(selector).textContent;
        Object.assign(node.style, {
          font: type.font, letterSpacing: type.letterSpacing,
          overflowWrap: type.overflowWrap, wordBreak: type.wordBreak,
          whiteSpace: type.whiteSpace, textTransform: type.textTransform,
          fontKerning: type.fontKerning, fontFeatureSettings: type.fontFeatureSettings,
          margin: '0', padding: '0', border: '0'
        });
        probe.append(node);
        return node;
      });
    }
    document.body.append(probe);
    for (const kind of ['name', 'role']) {
      const height = Math.ceil(Math.max(...probes[kind].map(node => node.getBoundingClientRect().height)));
      grid.style.setProperty(`--team-${kind}-height`, `${height}px`);
    }
    probe.remove();
  };
  const scheduleAlignment = () => {
    if (!alignmentFrame) alignmentFrame = requestAnimationFrame(alignCardText);
  };
  let observedWidth = -1;
  const alignmentObserver = new ResizeObserver(entries => {
    const width = entries[0].contentRect.width;
    if (Math.abs(width - observedWidth) > 0.1) {
      observedWidth = width;
      scheduleAlignment();
    }
  });
  alignmentObserver.observe(grid);
  document.fonts.ready.then(scheduleAlignment);

  const search = document.querySelector('#team-search-input');
  const clearSearch = document.querySelector('.team-search__clear');
  const empty = document.querySelector('.team-search-empty');
  const transliteration = {а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'kh',ц:'ts',ч:'ch',ш:'sh',щ:'shch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya'};
  const fold = value => String(value).toLocaleLowerCase('ru-RU').replace(/ё/g,'е')
    .replace(/[а-я]/g, letter => transliteration[letter]).normalize('NFKD')
    .replace(/[\u0300-\u036f]/g,'').replace(/ija/g,'ya').replace(/iy/g,'y').replace(/ia/g,'ya').replace(/zh/g,'j')
    .replace(/[^a-z0-9]+/g,' ').trim();
  const searchIndex = new Map(cards.map(card => [card, fold(`${card.textContent} ${card.dataset.searchAliases || ''}`)]));
  let activeFilter = 'all';
  const applyFilters = () => {
    const tokens = fold(search.value).split(/\s+/).filter(Boolean);
    let count = 0;
    cards.forEach(card => {
      const directionMatches = activeFilter === 'all' || (activeFilter === 'management' ? card.dataset.leadership === 'true' : card.dataset.group === activeFilter);
      card.hidden = !(directionMatches && tokens.every(token => searchIndex.get(card).includes(token)));
      if (!card.hidden) count++;
    });
    const label = activeFilter === 'all' ? 'Все специалисты' : filters.find(button => button.dataset.filter === activeFilter).textContent;
    status.textContent = `${tokens.length ? 'Найдено' : label} · ${count}`;
    clearSearch.hidden = !search.value;
    empty.hidden = count !== 0;
    if (count) scheduleAlignment();
  };
  document.querySelector('.team-filters').hidden = false;
  document.querySelector('.team-search').hidden = false;
  filters.forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    applyFilters();
  }));
  const resetSearch = () => {search.value = '';applyFilters();search.focus();};
  search.addEventListener('input', applyFilters);
  search.addEventListener('keydown', event => {
    if (event.key === 'Escape' && search.value) {event.preventDefault();event.stopPropagation();resetSearch();}
  });
  clearSearch.addEventListener('click', resetSearch);
  empty.querySelector('button').addEventListener('click', resetSearch);
  document.querySelector('[data-home-form-open]').addEventListener('click', event => {
    window.__barnesOwnerForm.open({trigger:event.currentTarget});
  });
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
