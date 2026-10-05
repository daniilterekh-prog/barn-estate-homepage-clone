(() => {
  const header = document.querySelector('[data-header]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  const setHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 36);
  window.addEventListener('scroll', setHeader, { passive: true });
  setHeader();
  menuToggle?.addEventListener('click', () => {
    const open = header.classList.toggle('is-menu-open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('[data-scroll-to]').forEach((button) => button.addEventListener('click', () => document.querySelector(button.dataset.scrollTo)?.scrollIntoView({ behavior: 'smooth' })));

  const filterToggle = document.querySelector('[data-filter-toggle]');
  const filterPanel = document.querySelector('#filter-panel');
  const closeFilters = () => { filterPanel.hidden = true; filterToggle?.setAttribute('aria-expanded', 'false'); };
  filterToggle?.addEventListener('click', () => { filterPanel.hidden = !filterPanel.hidden; filterToggle.setAttribute('aria-expanded', String(!filterPanel.hidden)); });
  document.querySelector('[data-filter-close]')?.addEventListener('click', closeFilters);
  document.querySelector('[data-search-form]')?.addEventListener('submit', (event) => { event.preventDefault(); document.querySelector('#country-objects')?.scrollIntoView({ behavior: 'smooth' }); closeFilters(); });

  document.querySelectorAll('[data-scroll]').forEach((button) => button.addEventListener('click', () => document.getElementById(button.dataset.scroll)?.scrollBy({ left: Number(button.dataset.direction) * 460, behavior: 'smooth' })));
  document.querySelectorAll('[data-pin]').forEach((pin) => pin.addEventListener('click', () => { const tooltip = document.querySelector('[data-map-tooltip]'); tooltip.textContent = pin.dataset.pin; tooltip.hidden = false; tooltip.style.left = `${pin.offsetLeft + 28}px`; tooltip.style.top = `${pin.offsetTop - 18}px`; }));
  document.querySelector('[data-map]')?.addEventListener('click', (event) => { if (!event.target.closest('[data-pin]')) document.querySelector('[data-map-tooltip]').hidden = true; });

  const grid = document.querySelector('[data-objects]');
  document.querySelector('[data-sort]')?.addEventListener('change', (event) => {
    const cards = [...grid.children];
    const key = event.target.value;
    if (key === 'default') return;
    cards.sort((a, b) => Number(b.dataset[key === 'area' ? 'area' : 'price']) - Number(a.dataset[key === 'area' ? 'area' : 'price']));
    cards.forEach((card) => grid.append(card));
  });
  document.querySelector('[data-more-objects]')?.addEventListener('click', (event) => { event.currentTarget.textContent = 'Все актуальные объекты открыты ↗'; event.currentTarget.disabled = true; });
  const introToggle = document.querySelector('[data-intro-toggle]');
  const introDetails = document.querySelector('[data-intro-details]');
  introToggle?.addEventListener('click', () => { const open = introDetails.hidden; introDetails.hidden = !open; introToggle.setAttribute('aria-expanded', String(open)); introToggle.innerHTML = open ? 'свернуть ↑' : 'читать далее ↗'; });
  document.querySelectorAll('[data-show-links]').forEach((button) => button.addEventListener('click', () => { const links = button.parentElement.querySelectorAll('.is-hidden'); links.forEach((link) => link.classList.add('is-visible')); button.hidden = true; }));
  document.querySelectorAll('[data-local-form]').forEach((form) => form.addEventListener('submit', (event) => { event.preventDefault(); const status = form.querySelector('.form-status'); status.textContent = 'Спасибо. Мы свяжемся с вами в ближайшее время.'; form.reset(); }));
})();
