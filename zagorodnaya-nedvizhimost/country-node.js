/* FirstDegreeNode adapter. Retain all country objects and their source facts. */
(() => {
  'use strict';
  const q = (s, root = document) => root.querySelector(s);
  const all = (s, root = document) => [...root.querySelectorAll(s)];
  const text = (s, root) => q(s, root)?.textContent.trim() || '';
  const list = q('.catalog-grid__list');
  if (!list || list.dataset.nodeReady) return;
  list.dataset.nodeReady = 'true';
  const facts = (entries, mode) => {
    const dl = document.createElement('dl'); dl.className = `listing-card-facts listing-card-facts--${mode}`;
    dl.setAttribute('aria-label', 'Основные характеристики');
    for (const [label, value] of entries) {
      const field = document.createElement('div'); field.className = 'listing-card-fact';
      const term = document.createElement('dt'); term.className = 'listing-card-fact__label'; term.textContent = label;
      const description = document.createElement('dd'); description.className = 'listing-card-fact__value'; description.textContent = value || 'По запросу'; description.title = description.textContent;
      field.append(term, description); dl.append(field);
    }
    return dl;
  };
  const originals = all(':scope > .catalog-grid__item', list);
  originals.forEach(item => {
    item.style.display = '';
    const card = q('.apartment-card', item), body = q('.apartment-card__body', card);
    const stats = Object.fromEntries(all('.apartment-card__stat', card).map(s => [text('.apartment-card__stat-label', s), text('.apartment-card__stat-value', s)]));
    const name = q('.apartment-card__name', card), address = q('.apartment-card__address', card), price = q('.apartment-card__price', card), id = q('.apartment-card__lotid', card);
    item.dataset.listingMode = 'lot'; card.dataset.nodeCard = 'lot';
    item.dataset.location = address?.textContent.trim() || '';
    item.dataset.bedrooms = stats['Спальни'] || '';
    item.dataset.price = price?.textContent.replace(/\D/g, '') || '';
    item.dataset.square = (stats['Площадь'] || '').replace(/[^\d.,]/g, '').replace(',', '.');
    q('.apartment-card__topline', body)?.remove(); q('.apartment-card__stats', body)?.remove();
    if (address) name.before(address);
    name.after(facts([['Площадь', stats['Площадь']], ['Спальни', stats['Спальни']], ['Участок', stats['Участок']]], 'lot'));
    const row = document.createElement('div'); row.className = 'apartment-card__price-row listing-card-price-row'; row.append(price); if (id) row.append(id);
    body.append(row);
  });
  const seen = new Set();
  const projectItems = [];
  all('.catalog-best-offers .splide__slide:not(.splide__slide--clone) .apartment-card').forEach(source => {
    const link = q('.apartment-card__link', source); if (!link || seen.has(link.getAttribute('href'))) return;
    seen.add(link.getAttribute('href'));
    link.href = new URL(link.getAttribute('href'), 'https://barn-estate.ru/').href;
    const item = originals[0].cloneNode(true), card = q('.apartment-card', item), body = q('.apartment-card__body', card);
    item.dataset.listingMode = 'project'; card.dataset.nodeCard = 'project';
    item.dataset.location = text('.apartment-card__address', source); item.dataset.bedrooms = ''; item.dataset.square = ''; item.dataset.price = text('.apartment-card__price', source).replace(/\D/g, '');
    item.style.display = '';
    const image = q('.apartment-card__image', card), sourceImage = q('.apartment-card__image', source); image.src = sourceImage.src; image.alt = sourceImage.alt;
    all('a', card).forEach(a => a.href = link.getAttribute('href'));
    const name = q('.apartment-card__name', card); q('.apartment-card__name-text', name).textContent = text('.apartment-card__name', source);
    const price = q('.apartment-card__price', card); price.textContent = text('.apartment-card__price', source);
    body.replaceChildren(name, facts([['Локация', item.dataset.location], ['Срок сдачи', 'По запросу'], ['Спальни', 'По запросу']], 'project'), price);
    projectItems.push(item);
  });
  list.prepend(...projectItems);
  const header = q('.catalog-grid__header'); q('.catalog-grid__title').textContent = 'Актуальные проекты и лоты';
  q('.catalog-best-offers__title').textContent = 'Старты продаж';
  q('.catalog-quick-filters')?.remove();
  const toolbar = document.createElement('section'); toolbar.className = 'catalog-mode-toolbar'; toolbar.setAttribute('aria-label', 'Фильтры каталога');
  toolbar.innerHTML = '<div class="catalog-mode-switch" role="group" aria-label="Тип недвижимости"><button class="catalog-mode-switch__button is-active" type="button" data-country-mode="project" aria-pressed="true">Новостройки</button><button class="catalog-mode-switch__button" type="button" data-country-mode="lot" aria-pressed="false">Вторичная</button></div><div class="catalog-mode-filters catalog-quick-filters" data-v-6fd45cc6></div>';
  const paths = {
    location: '<path d="M12 21s6-5.4 6-11a6 6 0 1 0-12 0c0 5.6 6 11 6 11Z"/><circle cx="12" cy="10" r="2.25"/>',
    type: '<path d="M4 21V6l8-3 8 3v15M2 21h20M8 10h2m4 0h2m-8 4h2m4 0h2M10 21v-4h4v4"/>',
    price: '<circle cx="12" cy="12" r="9"/><path d="M9 16V7.5h3.4a2.75 2.75 0 1 1 0 5.5H9m0 0h5.6m-5.6 2h4.6"/>',
    bedrooms: '<path d="M3 18v-7.5M21 18v-5.5a2 2 0 0 0-2-2h-7.5A2.5 2.5 0 0 0 9 13v2M3 15h18M5.5 10.5h2A1.5 1.5 0 0 1 9 12v3H4v-3a1.5 1.5 0 0 1 1.5-1.5Z"/>'
  };
  const filters = [['location', 'Шоссе'], ['type', 'Тип'], ['price', 'Стоимость'], ['bedrooms', 'Спальни']];
  filters.forEach(([key, label]) => {
    const item = document.createElement('div'); item.className = 'catalog-quick-filters__item'; item.setAttribute('data-v-6fd45cc6', '');
    item.innerHTML = `<button class="catalog-quick-filters__button" type="button" data-v-6fd45cc6 aria-haspopup="dialog" aria-expanded="false"><span class="catalog-quick-filters__content"><span class="catalog-quick-filters__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[key]}</svg></span><span class="catalog-quick-filters__label" data-v-6fd45cc6><span class="catalog-quick-filters__caption">${label}</span></span></span><span class="catalog-quick-filters__chevron" data-v-6fd45cc6 aria-hidden="true"></span></button>`;
    q('button', item).dataset.countryQuick = key;
    q('.catalog-mode-filters', toolbar).append(item);
  });
  const sort = q('.catalog-grid__sort'); q('select', sort).setAttribute('data-v-5a2b3b97', ''); toolbar.append(sort);
  const detailed = document.createElement('button'); detailed.className = 'catalog-mode-detailed-filters'; detailed.type = 'button'; detailed.setAttribute('aria-haspopup', 'dialog'); detailed.setAttribute('aria-expanded', 'false');
  detailed.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.15" aria-hidden="true"><path d="M4 6h3m4 0h9M4 12h8m4 0h4M4 18h4m4 0h8"/><circle cx="9" cy="6" r="2"/><circle cx="14" cy="12" r="2"/><circle cx="10" cy="18" r="2"/></svg><span class="catalog-mode-detailed-filters__label catalog-mode-detailed-filters__label--desktop">Все фильтры</span><span class="catalog-mode-detailed-filters__label catalog-mode-detailed-filters__label--mobile">Фильтры</span>';
  detailed.addEventListener('click', () => document.dispatchEvent(new CustomEvent('country-filter-open', {detail: {trigger: detailed}}))); toolbar.append(detailed); header.after(toolbar);
  const empty = document.createElement('p'); empty.className = 'country-catalog-empty'; empty.setAttribute('role', 'status'); empty.textContent = 'Объектов с такими параметрами нет. Измени фильтры.'; list.after(empty);
  let mode = 'project', expanded = false;
  const selection = {location: '', price: '', bedrooms: ''};
  const more = q('.catalog-grid__more');
  const render = () => {
    let count = 0;
    all(':scope > .catalog-grid__item', list).forEach(item => {
      item.style.display = '';
      const match = item.dataset.listingMode === mode && (!selection.location || item.dataset.location === selection.location) && (!selection.price || (Number(item.dataset.price) > 0 && Number(item.dataset.price) <= Number(selection.price))) && (!selection.bedrooms || Number.parseInt(item.dataset.bedrooms) >= Number(selection.bedrooms)) && (!window.countryMatchesFullFilter || window.countryMatchesFullFilter(item));
      item.hidden = !match || (innerWidth < 768 && !expanded && count >= 5);
      if (match) count++;
    });
    empty.hidden = count > 0;
    if (more) more.hidden = expanded || count <= (innerWidth < 768 ? 5 : 100);
    all('[data-country-mode]', toolbar).forEach(b => { const active = b.dataset.countryMode === mode; b.classList.toggle('is-active', active); b.setAttribute('aria-pressed', String(active)); });
  };
  document.addEventListener('country-filter-apply', event => {
    const s = event.detail;
    empty.textContent = s.types?.length || s.districts?.length || s.roomsMin != null || s.roomsMax != null
      ? 'В локальных карточках нет данных о типе объекта, районе и количестве комнат. Для поиска по этим параметрам используй расширенный поиск на оригинальном сайте.'
      : 'Объектов с такими параметрами нет. Измени фильтры.';
    expanded = true; render();
  });
  const setMarket = value => {
    if (!['project','lot'].includes(value)) return;
    mode = value; expanded = false; render();
    document.dispatchEvent(new CustomEvent('country-market-change',{detail:{mode}}));
  };
  all('[data-country-mode]', toolbar).forEach(button => button.addEventListener('click', () => setMarket(button.dataset.countryMode)));
  window.countryListing = {
    getMarket:()=>mode,
    setMarket,
    getSelection:()=>({...selection}),
    setSelection:(key,value)=>{if(!(key in selection))return;selection[key]=value;expanded=true;render();document.dispatchEvent(new CustomEvent('country-quick-change',{detail:{key,value}}));},
    getLocations:()=>[...new Set(all('.catalog-grid__item',list).filter(item=>item.dataset.listingMode===mode).map(item=>item.dataset.location).filter(Boolean))],
    getSort:()=>q('select',sort)
  };
  more?.addEventListener('click', () => { expanded = true; render(); }); addEventListener('resize', render, {passive: true});
  all('.catalog-grid__item', list).forEach((item, i) => item.dataset.order = String(i));
  q('select', sort).addEventListener('change', event => {
    const value = event.target.value, items = all(':scope > .catalog-grid__item', list);
    const key = value.startsWith('square') ? 'square' : 'price';
    items.sort((a, b) => {
      if (value === 'relevance') return Number(a.dataset.order) - Number(b.dataset.order);
      if (!Number(a.dataset[key])) return Number(b.dataset[key]) ? 1 : 0;
      if (!Number(b.dataset[key])) return -1;
      return (value.endsWith('desc') ? -1 : 1) * (Number(a.dataset[key]) - Number(b.dataset[key]));
    });
    items.forEach(item => list.append(item)); render();
  });
  function openFilters(keys, title, trigger) {
    const dialog = document.createElement('dialog'); dialog.className = 'country-filter-dialog'; const heading = document.createElement('h2'); heading.id = 'country-filter-title'; heading.textContent = title; dialog.setAttribute('aria-labelledby', heading.id);
    const form = document.createElement('form'); form.method = 'dialog';
    keys.forEach(key => {
      const label = document.createElement('label'); label.textContent = filters.find(([k]) => k === key)[1]; const select = document.createElement('select'); select.name = key;
      let options = [['', 'Любые']];
      if (key === 'location') options = [['', 'Все шоссе'], ...[...new Set(all('.catalog-grid__item', list).filter(item => item.dataset.listingMode === mode).map(item => item.dataset.location).filter(Boolean))].map(s => [s, s])];
      if (key === 'price') options = [['', 'Любая стоимость'], ['50000000', 'До 50 млн ₽'], ['100000000', 'До 100 млн ₽'], ['200000000', 'До 200 млн ₽'], ['500000000', 'До 500 млн ₽']];
      if (key === 'bedrooms') options = [['', 'Любое количество'], ['1', 'От 1 спальни'], ['2', 'От 2 спален'], ['3', 'От 3 спален'], ['4', 'От 4 спален']];
      options.forEach(([value, text]) => select.append(new Option(text, value))); select.value = selection[key]; label.append(select); form.append(label);
    });
    const actions = document.createElement('div'); actions.className = 'country-filter-dialog__actions'; const apply = document.createElement('button'); apply.type = 'submit'; apply.textContent = 'Применить'; const cancel = document.createElement('button'); cancel.type = 'button'; cancel.textContent = 'Закрыть'; cancel.addEventListener('click', () => dialog.close()); actions.append(apply, cancel); form.append(actions); dialog.append(heading, form);
    form.addEventListener('submit', () => { keys.forEach(key => selection[key] = form.elements[key].value); expanded = true; render(); });
    dialog.addEventListener('close', () => { trigger.setAttribute('aria-expanded', 'false'); dialog.remove(); trigger.focus(); }); document.body.append(dialog); trigger.setAttribute('aria-expanded', 'true'); dialog.showModal();
  }
  // Remove legacy per-card listeners before binding the common contact modal.
  all('.catalog-grid .apartment-card__call-btn').forEach(old => { const button = old.cloneNode(true); old.replaceWith(button); });
  all('.catalog-grid .apartment-card__favorite').forEach(old => { const button = old.cloneNode(true); old.replaceWith(button); button.addEventListener('click', () => { const active = button.getAttribute('aria-pressed') !== 'true'; button.setAttribute('aria-pressed', String(active)); button.classList.toggle('is-active', active); }); });
  const floating = q('.floating-expert__card'); if (floating) floating.replaceWith(floating.cloneNode(true));
  // The reference owns launch-card geometry and gestures; avoid two carousel engines.
  window.countryBestCarousel?.destroy(true);
  const oldSlider = q('.catalog-best-offers__slider'), slider = oldSlider.cloneNode(true); oldSlider.replaceWith(slider); slider.id = 'splide01'; slider.tabIndex = 0; slider.className = 'splide catalog-best-offers__slider splide--loop splide--ltr is-active is-initialized';
  const track = q('.splide__track', slider); track.className = 'splide__track splide__track--loop splide__track--ltr'; track.style.paddingLeft = '0px'; track.style.paddingRight = '0px';
  const slideList = q('.splide__list', slider); const slides = all(':scope > .splide__slide', slideList); const n = slides.length;
  slides.forEach((slide, i) => { slide.style.cssText = ''; slide.className = 'splide__slide'; slide.setAttribute('aria-label', `${i + 1} of ${n}`); const badge = document.createElement('span'); badge.className = 'apartment-card__delivery'; badge.setAttribute('data-v-80c326fb', ''); badge.textContent = 'Срок по запросу'; q('.apartment-card__media', slide).append(badge); });
  slides[0]?.classList.add('is-active');
  const clones = () => slides.map(slide => { const copy = slide.cloneNode(true); copy.removeAttribute('id'); all('[id]', copy).forEach(e => e.removeAttribute('id')); copy.classList.add('splide__slide--clone'); return copy; });
  slideList.prepend(...clones()); slideList.append(...clones());
  all('.catalog-best-offers__nav-btn').forEach(button => button.replaceWith(button.cloneNode(true)));
  render();
})();
