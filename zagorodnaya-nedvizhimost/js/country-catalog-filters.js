/* Catalogue filter composition from the current resort node; country data stays local. */
(() => {
  'use strict';
  const toolbar = document.querySelector('.catalog-mode-toolbar');
  const listing = window.countryListing;
  if (!toolbar || !listing || toolbar.dataset.catalogLayout) return;
  toolbar.dataset.catalogLayout = 'true';
  const grid = toolbar.closest('.catalog-grid');
  const fullModal = document.querySelector('#catalog-hero-filters-panel');
  if (fullModal) {
    fullModal.classList.add('country-catalog-filters');
    for (const element of [fullModal, ...fullModal.querySelectorAll('[class]')]) {
      for (const name of ['hero-filter-modal--dark', 'hero-filter-panel--dark', 'hero-filter-panel-content--dark', 'ui-checkbox--dark', 'ui-switch--dark']) element.classList.remove(name);
    }
    fullModal.querySelector('.hero-filter-modal__reset').textContent = 'Сбросить';
    const firstGroup = fullModal.querySelector('.hero-filter-panel-content__group');
    const bedrooms = document.createElement('div');
    bedrooms.className = 'hero-filter-panel-content__group country-bedroom-group';
    bedrooms.innerHTML = '<p class="hero-filter-panel-content__title" id="country-bedroom-label">Спальни</p><div class="hero-filter-panel-content__checkboxes country-bedroom-options" role="radiogroup" aria-labelledby="country-bedroom-label"></div>';
    for (const [value, label] of [['','Любые'],['1','1'],['2','2'],['3','3'],['4','4+']]) {
      const option = document.createElement('label');
      option.className = 'ui-checkbox ui-checkbox--chip';
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'bedrooms';
      radio.value = value;
      radio.checked = value === '';
      const caption = document.createElement('span');
      caption.className = 'ui-checkbox__label';
      caption.textContent = label;
      option.append(radio, caption);
      bedrooms.querySelector('.country-bedroom-options').append(option);
    }
    firstGroup.after(bedrooms);
  }
  const market = toolbar.querySelector('.catalog-mode-switch');
  const quick = toolbar.querySelector('.catalog-mode-filters');
  const details = toolbar.querySelector('.catalog-mode-detailed-filters');
  const sort = toolbar.querySelector('.catalog-grid__sort');
  const brands = toolbar.querySelector('.country-brand-filters[data-brand-context="listing"]');
  const primary = document.createElement('div');
  const secondary = document.createElement('div');
  primary.className = 'catalog-toolbar__primary';
  secondary.className = 'catalog-toolbar__secondary';
  const direction = document.createElement('label');
  direction.className = 'catalog-direction';
  direction.innerHTML = '<span class="visually-hidden">Департамент недвижимости</span><select aria-label="Департамент недвижимости"><option value="zagorodnaya-nedvizhimost" selected>Загородная</option><option value="gorodskaya-nedvizhimost">Городская</option><option value="kommercheskaya-nedvizhimost">Коммерческая</option><option value="kurortnaya">Курортная</option></select><svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m3 6 5 5 5-5" stroke="currentColor" stroke-width="1.2"/></svg>';
  direction.querySelector('select').addEventListener('change', event => {
    location.href = `../${event.target.value}/`;
  });
  const search = document.createElement('label');
  search.className = 'catalog-search-row';
  search.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="7" stroke="currentColor" stroke-width="1.35"/><path d="m16 16 5 5" stroke="currentColor" stroke-width="1.35"/></svg><span class="visually-hidden">Поиск по названию, адресу или ID</span><input type="search" placeholder="Название ЖК, адрес или ID" autocomplete="off" data-country-search>';
  const input = search.querySelector('input');
  const mobile = matchMedia('(max-width:767px)');
  const updatePlaceholder = () => { input.placeholder = mobile.matches ? 'Название или ID' : 'Название ЖК, адрес или ID'; };
  updatePlaceholder();
  mobile.addEventListener('change', updatePlaceholder);
  input.addEventListener('input', () => listing.setSelection('query', input.value));
  primary.append(direction, market, search);
  secondary.append(quick, details);
  toolbar.replaceChildren(primary, secondary);

  const collections = document.createElement('div');
  collections.className = 'catalog-collections-row';
  collections.innerHTML = '<div class="catalog-active-filters" role="group" aria-label="Выбранные фильтры"></div><button class="catalog-reset-all" type="button" hidden>Сбросить фильтры</button>';
  if (brands) collections.prepend(brands);
  const summary = document.createElement('div');
  summary.className = 'catalog-result-summary';
  summary.innerHTML = '<p class="catalog-result-count" role="status" aria-live="polite"></p><div class="catalog-result-actions"><button class="catalog-map-trigger" type="button" aria-haspopup="dialog"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z M9 3v15 M15 6v15"/></svg><span>На карте</span></button></div>';
  summary.querySelector('.catalog-result-actions').append(sort);
  toolbar.after(collections, summary);
  summary.querySelector('.catalog-map-trigger').addEventListener('click', () => window.countryMapEnter?.());
  const sortButton = sort.querySelector('.country-sort-trigger');
  if (sortButton) sortButton.setAttribute('aria-label', `Сортировка: ${sortButton.textContent}`);
  const badge = document.createElement('span');
  badge.className = 'catalog-filter-count';
  badge.hidden = true;
  badge.setAttribute('aria-hidden', 'true');
  details.append(badge);
  const chips = collections.querySelector('.catalog-active-filters');
  const reset = collections.querySelector('.catalog-reset-all');
  reset.addEventListener('click', () => window.countryReferenceControls?.reset());
  const labelFor = (name, value) => {
    const field = document.querySelector(`#catalog-hero-filters-panel [name="${name}"][value="${CSS.escape(value)}"]`);
    return field?.closest('label')?.textContent.trim() || value;
  };
  function addChip(label, clear) {
    const button = document.createElement('button');
    button.className = 'catalog-active-filter';
    button.type = 'button';
    button.setAttribute('aria-label', `Убрать фильтр: ${label}`);
    button.innerHTML = '<span></span><svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M2 2l10 10M12 2 2 12" stroke="currentColor" stroke-width="1.2"/></svg>';
    button.querySelector('span').textContent = label;
    button.addEventListener('click', clear);
    chips.append(button);
  }
  function countText(count) {
    const form = count % 10 === 1 && count % 100 !== 11 ? 'объект' : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 12 || count % 100 > 14) ? 'объекта' : 'объектов';
    return `${count} ${form}`;
  }
  function sync(event) {
    const selection = listing.getSelection();
    const full = window.countryFullFilters?.getState() || {};
    const flags = window.countryReferenceControls?.getBrandFlags() || [];
    chips.replaceChildren();
    if (selection.location) addChip(selection.location, () => listing.setSelection('location', ''));
    if (selection.bedrooms) addChip(`Спальни: ${selection.bedrooms}+`, () => listing.setSelection('bedrooms', ''));
    if (selection.query) addChip(`Поиск: ${selection.query}`, () => listing.setSelection('query', ''));
    for (const key of ['types', 'bands', 'districts']) for (const value of full[key] || []) {
      addChip(labelFor(key, value), () => document.dispatchEvent(new CustomEvent('country-filter-set', {detail:{[key]:full[key].filter(item => item !== value)}})));
    }
    for (const key of ['price', 'area', 'rooms']) if (full[`${key}Min`] != null || full[`${key}Max`] != null) {
      addChip(`${{price:'Цена',area:'Площадь',rooms:'Комнаты'}[key]}: ${full[`${key}Min`] ?? 'от'}–${full[`${key}Max`] ?? 'до'}`, () => document.dispatchEvent(new CustomEvent('country-filter-set', {detail:{[`${key}Min`]:null,[`${key}Max`]:null}})));
    }
    for (const flag of flags) addChip(flag === 'selection' ? 'Выбор BARNES' : 'Эксклюзив BARNES', () => window.countryReferenceControls?.setBrandFlags(flags.filter(item => item !== flag)));
    badge.hidden = chips.childElementCount === 0;
    badge.textContent = String(chips.childElementCount);
    reset.hidden = chips.childElementCount === 0;
    const count = event?.detail?.count ?? [...grid.querySelectorAll('.catalog-grid__item:not([hidden])')].filter(item => item.dataset.listingMode === listing.getMarket()).length;
    summary.querySelector('.catalog-result-count').textContent = countText(count);
    if (input.value !== selection.query) input.value = selection.query;
  }
  for (const name of ['country-listing-render', 'country-filter-apply', 'country-quick-change', 'country-brand-change', 'country-market-change']) document.addEventListener(name, sync);
  sync();
})();
