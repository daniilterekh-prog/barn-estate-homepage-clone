/* One source-faithful filter shared by the hero, listing and map. No remote submissions. */
(() => {
  'use strict';
  if (!window.countryFilterTemplate) return;
  const holder = document.createElement('div');
  holder.innerHTML = window.countryFilterTemplate;
  const modal = holder.firstElementChild;
  modal.hidden = true;
  const dialog = modal.querySelector('.hero-filter-modal__dialog');
  dialog.tabIndex = -1;
  document.body.append(modal);
  let opener, previousOverflow, applied = {};
  const q = selector => modal.querySelector(selector);
  const all = selector => [...modal.querySelectorAll(selector)];
  const ranges = ['priceMin', 'priceMax', 'areaMin', 'areaMax', 'roomsMin', 'roomsMax'];
  all('.hero-filter-panel-content__range-input').forEach((input, index) => {
    input.name = ranges[index];
    input.setAttribute('aria-label', input.closest('.hero-filter-panel-content__group').querySelector('p').textContent.trim() + ': ' + input.placeholder);
  });
  const groups = all('.hero-filter-panel-content__checkboxes');
  ['types', 'bands', 'districts'].forEach((name, index) =>
    groups[index].querySelectorAll('input').forEach(input => input.name = name));
  const number = value => value === '' ? null : Number(value.replace(/[^\d.,]/g, '').replace(',', '.'));
  const read = () => Object.fromEntries([
    ...ranges.map(name => [name, number(q(`[name="${name}"]`).value)]),
    ...['types', 'bands', 'districts'].map(name => [name, all(`[name="${name}"]:checked`).map(input => input.value)])
  ]);
  const restore = state => {
    ranges.forEach(name => q(`[name="${name}"]`).value = state[name] ?? '');
    ['types', 'bands', 'districts'].forEach(name => all(`[name="${name}"]`).forEach(input => input.checked = (state[name] || []).includes(input.value)));
  };
  function close() {
    modal.hidden = true;
    document.body.style.overflow = previousOverflow;
    opener?.setAttribute('aria-expanded', 'false');
    opener?.classList.remove('catalog-hero-filters__filter-icon--active');
    opener?.focus({preventScroll: true});
  }
  function open(trigger) {
    if (!modal.hidden) return;
    opener = trigger;
    previousOverflow = document.body.style.overflow;
    restore(applied);
    (document.fullscreenElement || document.body).append(modal);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    opener?.setAttribute('aria-expanded', 'true');
    opener?.classList.add('catalog-hero-filters__filter-icon--active');
    q('.hero-filter-modal__body').scrollTop = 0;
    dialog.focus({preventScroll: true});
  }
  all('.hero-filter-modal__close,.hero-filter-modal__backdrop').forEach(button => button.addEventListener('click', close));
  q('.hero-filter-modal__reset').addEventListener('click', () => restore({}));
  q('.hero-filter-modal__apply').addEventListener('click', () => {
    const next = read();
    for (const [min, max] of [['priceMin', 'priceMax'], ['areaMin', 'areaMax'], ['roomsMin', 'roomsMax']]) {
      const input = q(`[name="${max}"]`);
      input.setCustomValidity(next[min] != null && next[max] != null && next[min] > next[max] ? 'Максимум должен быть не меньше минимума' : '');
      if (!input.reportValidity()) return;
    }
    applied = next;
    document.dispatchEvent(new CustomEvent('country-filter-apply', {detail: applied}));
    close();
  });
  all('input').forEach(input => input.addEventListener('input', () => input.setCustomValidity('')));
  modal.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); close(); }
    if (event.key !== 'Tab') return;
    const focusable = all('button,input,a[href]').filter(el => !el.disabled && el !== q('.hero-filter-modal__backdrop'));
    const first = focusable[0], last = focusable.at(-1);
    if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialog)) { event.preventDefault(); first.focus(); }
  });
  document.addEventListener('country-filter-open', event => open(event.detail.trigger));
  const hero = document.querySelector('.catalog-hero-filters__filter-icon');
  hero?.addEventListener('click', () => open(hero));
  const listing = document.querySelector('.catalog-mode-detailed-filters');
  const mapButton = listing?.cloneNode(true);
  if (mapButton) {
    mapButton.classList.add('country-map-filters');
    document.querySelector('.catalog-projects-map__controls').prepend(mapButton);
    mapButton.addEventListener('click', () => open(mapButton));
  }
  [hero, listing, mapButton].filter(Boolean).forEach(button => {
    button.setAttribute('aria-controls', modal.id);
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-expanded', 'false');
  });
  const inRange = (value, min, max) => (min == null && max == null) || (Number(value) > 0 && (min == null || Number(value) >= min) && (max == null || Number(value) <= max));
  const bands = {'50m': [0, 50e6], '50-100m': [50e6, 100e6], '100-200m': [100e6, 200e6], '200m+': [200e6, null]};
  window.countryMatchesFullFilter = item => {
    const d = item.dataset, s = applied;
    // Unknown classifications are not guessed; extended search leads to the original live catalog.
    return inRange(d.price, s.priceMin, s.priceMax) && inRange(d.square, s.areaMin, s.areaMax) &&
      inRange(d.rooms, s.roomsMin, s.roomsMax) &&
      (!s.bands?.length || s.bands.some(band => inRange(d.price, ...bands[band]))) &&
      (!s.types?.length || s.types.includes(d.propertyType)) &&
      (!s.districts?.length || s.districts.includes(d.district));
  };
})();
