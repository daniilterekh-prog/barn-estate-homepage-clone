/* One object page, local UI kit, no external UI dependencies or lead submission. */
(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const main = $('#main');
  const heroVariant = new URLSearchParams(location.search).get('hero');
  if (/^[1-5]$/.test(heroVariant || '')) document.body.dataset.heroVariant = heroVariant;
  const icons = {
    arrow: '<path d="M4 12h16M14 6l6 6-6 6"/>',
    photos: '<rect x="3" y="4" width="18" height="16" rx="1"/><circle cx="8" cy="9" r="1.5"/><path d="m3 17 6-5 4 3 4-5 4 5"/>',
    plan: '<path d="M3 3h18v18H3zM3 12h9V3M12 12v9M12 16h9"/>',
    left: '<path d="m14 6-6 6 6 6"/>',
    right: '<path d="m10 6 6 6-6 6"/>'
  };
  function el(tag, text, cls) {
    const node = document.createElement(tag);
    if (text != null) node.textContent = String(text);
    if (cls) node.className = cls;
    return node;
  }
  function icon(name) {
    const node = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    node.setAttribute('viewBox', '0 0 24 24');
    node.setAttribute('fill', 'none');
    node.setAttribute('stroke', 'currentColor');
    node.setAttribute('stroke-width', '1.5');
    node.setAttribute('stroke-linecap', 'round');
    node.setAttribute('stroke-linejoin', 'round');
    node.setAttribute('aria-hidden', 'true');
    node.innerHTML = icons[name] || icons.arrow;
    return node;
  }
  function safeUrl(value, fallback = '#') {
    if (typeof value !== 'string' || !value.trim()) return fallback;
    try {
      const url = new URL(value, location.href);
      return ['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol) ? value : fallback;
    } catch { return fallback; }
  }
  const money = value => new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
  const price = lot => lot.displayPrice || (lot.priceRub != null ? money(lot.priceRub) : 'Цена по запросу');
  const fact = (lot, label) => (lot.facts || []).find(f => f.label === label)?.value;
  function image(data, cls, eager = false) {
    const img = el('img', null, cls);
    img.src = safeUrl(data.src, ''); img.alt = data.alt || '';
    img.loading = eager ? 'eager' : 'lazy'; img.decoding = 'async';
    if (eager) img.fetchPriority = 'high';
    return img;
  }
  function link(text, href, cls = 'text-link') {
    const a = el('a', text, cls); a.href = safeUrl(href); return a;
  }
  function action(text, request = 'tour', cls = 'button', svg) {
    const button = el('button', text, cls); button.type = 'button';
    button.dataset.request = request;
    if (svg) button.append(icon(svg));
    return button;
  }
  function section(id, eyebrow, title, cls = '') {
    const node = el('section', null, 'section ' + cls); node.id = id;
    node.setAttribute('aria-labelledby', id + '-title');
    const box = el('div', null, 'container');
    const heading = el('div', null, 'section-heading');
    if (eyebrow) heading.append(el('p', eyebrow, 'eyebrow'));
    const h2 = el('h2', title); h2.id = id + '-title'; heading.append(h2);
    box.append(heading); node.append(box); return {node, box, heading};
  }
  function brokerBlock(lot) {
    const b = lot.broker || {name: 'Команда BARN Estate', role: 'Подбор недвижимости', phone: '+7 (499) 272-48-72'};
    const node = el('div', null, 'broker');
    if (b.photo?.src) node.append(image(b.photo));
    const info = el('div'); info.append(el('p', b.name, 'broker__name'), el('p', b.role, 'broker__role'));
    if (b.phone) info.append(link(b.phone, 'tel:' + b.phone.replace(/[^+\d]/g, ''), 'broker__phone'));
    node.append(info); return node;
  }
  function factsList(items, cls = 'lot-facts') {
    const dl = el('dl', null, cls);
    for (const item of items || []) {
      if (item.value == null || item.value === '') continue;
      const row = el('div'); row.append(el('dt', item.label), el('dd', item.value)); dl.append(row);
    }
    return dl;
  }
  function form(prefix) {
    const node = el('form', null, 'lot-form'); node.dataset.lotRequest = '';
    node.innerHTML = '<label for="' + prefix + '-name"><span>Ваше имя</span><input id="' + prefix + '-name" name="name" autocomplete="name" maxlength="100" required></label>' +
      '<label for="' + prefix + '-phone"><span>Телефон для связи</span><input id="' + prefix + '-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" maxlength="40" placeholder="+7" required></label>' +
      '<label class="consent" for="' + prefix + '-consent"><input id="' + prefix + '-consent" type="checkbox" name="consent" required><span>Согласен с <a href="https://barn-estate.ru/privacy/" target="_blank" rel="noopener noreferrer">политикой обработки персональных данных</a></span></label>' +
      '<p class="lot-form-error" id="' + prefix + '-error" role="alert" hidden></p>' +
      '<button class="button" type="submit">Подготовить запрос</button>' +
      '<p class="lot-form-note">Передайте подготовленный запрос брокеру по телефону или email.</p>';
    const phone = $('[name=phone]', node); phone.setAttribute('aria-describedby', prefix + '-error');
    return node;
  }
  let lot;
  function render(data) {
    if (!data?.id || !data.title || !data.cover?.src) throw new Error('Для лота нужны id, title и cover.src');
    lot = data; window.BARNES_LOT_DATA = data;
    main.replaceChildren();
    document.title = (data.pageTitle || data.title) + ' — BARN Estate';
    $('meta[name=description]').content = data.description || data.title;
    $('meta[property="og:title"]').content = document.title;
    $('meta[property="og:description"]').content = data.description || data.title;
    $('meta[property="og:image"]').content = new URL(safeUrl(data.cover.src), location.href).href;
    const hero = el('section', null, 'lot-hero'); hero.id = 'lot-photos'; hero.setAttribute('aria-labelledby', 'lot-title');
    const visual = el('div', null, 'lot-hero__visual'); visual.append(image(data.cover, 'lot-hero__image', true));
    const copy = el('div', null, 'lot-hero__copy'); copy.append(el('p', data.locationLabel || 'Недвижимость BARN Estate', 'eyebrow'));
    const title = el('h1', data.title); title.id = 'lot-title'; copy.append(title);
    if (data.description) copy.append(el('p', data.description, 'lead'));
    const actions = el('div', null, 'lot-hero__actions');
    const photos = action('Все фото · ' + (data.gallery?.length || 1), 'gallery', 'button', 'photos');
    photos.setAttribute('aria-label', 'Открыть галерею фотографий');
    actions.append(photos, link('Планировка', '#lot-plan', 'button button--outline'));
    copy.append(actions); visual.append(copy);
    const offer = el('aside', null, 'lot-offer'); offer.setAttribute('aria-label', 'Стоимость и контакт по лоту');
    offer.append(el('p', 'Лот ' + data.id + (data.statusLabel ? ' · ' + data.statusLabel : ''), 'lot-offer__meta'));
    const p = el('div'); p.append(el('p', price(data), 'lot-price'));
    const area = parseFloat(String(fact(data, 'Площадь') || '').replace(',', '.'));
    if (area > 0 && data.priceRub != null) p.append(el('p', money(Math.round(data.priceRub / area)) + '/м²', 'lot-price-per'));
    offer.append(p, factsList((data.facts || []).filter(f => ['Площадь', 'Спален', 'Этаж', 'Отделка'].includes(f.label)), 'lot-offer__facts'), brokerBlock(data));
    const offerActions = el('div', null, 'lot-offer__actions');
    offerActions.append(action(document.body.dataset.heroVariant === '2' ? 'На просмотр' : 'Записаться на просмотр', 'tour', 'button', 'arrow'));
    if (data.presentation?.url) offerActions.append(link('Скачать презентацию', data.presentation.url));
    else offerActions.append(action('Запросить презентацию', 'presentation', 'text-link'));
    offer.append(offerActions);
    if (data.demo) offer.append(el('p', 'Архивный пример. Актуальную цену и доступность уточните у брокера.', 'lot-offer__notice'));
    hero.append(visual, offer);
    if (document.body.dataset.heroVariant === '3') {
      hero.insertBefore(copy, offer);
      const metrics = $('.lot-offer__facts', offer);
      if (metrics?.childElementCount) {
        metrics.classList.add('lot-hero__facts');
        metrics.setAttribute('aria-label', 'Основные характеристики объекта');
        const secondary = [...metrics.children].find(row => $('dt', row)?.textContent === 'Отделка');
        const hideSecondary = secondary && metrics.childElementCount > 1;
        if (hideSecondary) secondary.dataset.heroFactSecondary = '';
        metrics.style.setProperty('--hero-fact-count', metrics.childElementCount);
        metrics.style.setProperty('--hero-fact-mobile-count', metrics.childElementCount - (hideSecondary ? 1 : 0));
        hero.dataset.hasHeroFacts = 'true';
        hero.append(metrics);
      } else metrics?.remove();
    }
    main.append(hero);
    if (document.body.dataset.heroVariant === '5') {
      const filmstrip = el('div', null, 'hero-filmstrip'); filmstrip.setAttribute('aria-label', 'Выбрать фотографию первого экрана');
      (data.gallery?.length ? data.gallery : [data.cover]).slice(0, 3).forEach((photo, index) => {
        const button = el('button'); button.type = 'button'; button.dataset.heroImage = String(index); button.setAttribute('aria-label', 'Фотография ' + (index + 1)); button.setAttribute('aria-pressed', String(index === 0)); button.append(image(photo)); filmstrip.append(button);
      }); hero.append(filmstrip);
    }
    const navWrap = el('div', null, 'lot-nav-wrap'); const nav = el('nav', null, 'container lot-nav'); nav.setAttribute('aria-label', 'Разделы лота'); navWrap.append(nav); main.append(navWrap);
    if (data.features?.length) {
      const s = section('lot-features', 'ДЕТАЛИ, КОТОРЫЕ ВАЖНЫ', 'Особенности объекта');
      const grid = el('div', null, 'lot-features');
      data.features.forEach((f, i) => {
        const card = el('article', null, 'lot-feature'); card.append(el('p', String(i + 1).padStart(2, '0'), 'lot-feature__number'), el('h3', f.label));
        if (f.text) card.append(el('p', f.text)); grid.append(card);
      }); s.box.append(grid); main.append(s.node);
    }
    {
      const s = section('lot-plan', 'ПРОСТРАНСТВО', 'Планировка', 'lot-soft');
      const split = el('div', null, 'lot-split'); const intro = el('div'); intro.append(s.heading);
      intro.append(el('p', data.floorPlan?.description || 'Посмотрите, как устроено пространство, и обсудите планировку с брокером.', 'lead'));
      if (data.floorPlan?.src) {
        const button = action('', 'plan', 'lot-plan-image'); button.append(image(data.floorPlan), el('span', 'Открыть и увеличить планировку')); split.append(intro, button);
      } else {
        const empty = el('div', null, 'lot-plan-empty');
        if (fact(data, 'Площадь')) { const metric = el('p', fact(data, 'Площадь'), 'lot-plan-empty__metric'); metric.append(el('small', 'общая площадь')); empty.append(metric); }
        const text = el('div'); text.append(el('h3', 'Планировка по запросу'), el('p', 'Попросите брокера прислать план и уточнить размеры помещений.'), action('Запросить планировку', 'plan-request', 'text-link'));
        empty.append(text); split.append(intro, empty);
      } s.box.append(split); main.append(s.node);
    }
    {
      const s = section('lot-about', 'ВАШ БУДУЩИЙ ДОМ', 'О квартире'); const split = el('div', null, 'lot-split');
      const text = el('div', null, 'lot-copy');
      (data.descriptionParagraphs || [data.description]).filter(Boolean).forEach(p => text.append(el('p', p, 'lead')));
      split.append(text, factsList(data.facts)); s.box.append(split); main.append(s.node);
    }
    if (data.building?.verified === true && data.building.name) {
      const b = data.building, s = section('lot-building', 'АДРЕС И ХАРАКТЕР', 'О доме', 'lot-soft');
      const split = el('div', null, 'lot-split'); const info = el('div');
      info.append(el('h3', b.name)); if (b.description) info.append(el('p', b.description, 'lead'));
      if (b.url) info.append(link('Подробнее о доме / ЖК', b.url));
      const panel = el('div', null, 'lot-building-summary');
      if (b.image?.src) panel.append(image(b.image, 'lot-building-image'));
      if (b.facts?.length) panel.append(factsList(b.facts, 'lot-building-facts'));
      else panel.append(el('p', 'Уточните у брокера сведения о доме, парковке и сервисе.', 'lead'));
      split.append(info, panel); s.box.append(split); main.append(s.node);
    }
    if (data.locationLabel || data.location) {
      const s = section('lot-location', 'ГОРОД ВОКРУГ ВАС', 'Расположение и окружение'); s.heading.classList.add('lot-location-top');
      const headingGroup = el('div'); headingGroup.append(...s.heading.childNodes); s.heading.append(headingGroup);
      const address = el('div'); address.append(el('p', data.location?.label || data.locationLabel, 'lead')); s.heading.append(address);
      const mapUrl = safeUrl(data.location?.mapUrl || 'https://yandex.ru/maps/?text=' + encodeURIComponent(data.locationLabel));
      if (data.location?.mapImage?.src) {
        const preview = link('', mapUrl, 'lot-map-preview'); preview.target = '_blank'; preview.rel = 'noopener noreferrer'; preview.setAttribute('aria-label', 'Открыть расположение объекта в Яндекс Картах');
        preview.append(image(data.location.mapImage, 'lot-map'));
        const pin = el('span', null, 'lot-map-pin'); pin.setAttribute('aria-hidden', 'true'); preview.append(pin); s.box.append(preview);
      }
      if (data.location?.embedUrl) {
        const frame = el('iframe', null, 'lot-map'); frame.src = safeUrl(data.location.embedUrl); frame.title = 'Расположение объекта на карте'; frame.loading = 'lazy'; frame.referrerPolicy = 'no-referrer-when-downgrade'; s.box.append(frame);
      }
      const bar = el('div', null, 'lot-location-footer'); const mapLink = link('Открыть в Яндекс Картах', mapUrl); mapLink.target = '_blank'; mapLink.rel = 'noopener noreferrer';
      bar.append(el('p', data.location?.note || 'Точный адрес и детали окружения уточнит брокер.', 'note'), mapLink); s.box.append(bar);
      if (data.location?.mapImage?.src) s.box.append(link('© Яндекс · Условия использования', 'https://yandex.ru/legal/maps_termsofuse/', 'note lot-map-attribution'));
      if (data.location?.nearby?.length) {
        const grid = el('div', null, 'lot-nearby'); data.location.nearby.forEach(place => { const card = el('article'); card.append(el('h3', place.name)); if (place.detail) card.append(el('p', place.detail)); grid.append(card); }); s.box.append(grid);
      } main.append(s.node);
    }
    {
      const s = section('lot-terms', 'СЛЕДУЮЩИЙ ШАГ', data.terms?.title || 'Стоимость и условия', 'lot-soft lot-terms');
      const split = el('div', null, 'lot-split'); const amount = el('div'); amount.append(el('p', price(data), 'lot-terms-price'));
      if (data.demo) amount.append(el('p', 'Стоимость из сохранённой карточки объекта.', 'note'));
      const text = el('div'); if (data.terms?.note) text.append(el('p', data.terms.note, 'lead'));
      if (data.terms?.items?.length) { const ul = el('ul', null, 'lot-terms-list'); data.terms.items.forEach(item => ul.append(el('li', item))); text.append(ul); }
      text.append(action('Обсудить условия с брокером', 'terms', 'text-link')); split.append(amount, text); s.box.append(split); main.append(s.node);
    }
    if (data.documents?.length) {
      const s = section('lot-documents', 'МАТЕРИАЛЫ', 'Документы'); const list = el('div', null, 'lot-optional-list');
      data.documents.filter(d => d.url && d.title).forEach(d => { const a = link(d.title, d.url); a.target = '_blank'; a.rel = 'noopener noreferrer'; list.append(a); });
      if (list.childElementCount) { s.box.append(list); main.append(s.node); }
    }
    if (data.faq?.length) {
      const s = section('lot-faq', 'ПОДРОБНОСТИ', 'Вопросы об объекте'); s.box.classList.add('lot-faq');
      data.faq.forEach(f => { const details = el('details'); details.append(el('summary', f.question), el('p', f.answer)); s.box.append(details); }); main.append(s.node);
    }
    {
      const s = section('lot-contact', 'ВАШ БРОКЕР', 'Запишитесь на просмотр', 'lot-contact');
      const grid = el('div', null, 'lot-contact-grid'); const intro = el('div'); intro.append(s.heading, el('p', 'Уточним детали объекта, обсудим ваши пожелания и удобное время просмотра.', 'lead'), brokerBlock(data));
      const request = el('div'); request.append(form('inline')); grid.append(intro, request); s.box.append(grid); main.append(s.node);
    }
    {
      const s = section('lot-related', 'ПРОДОЛЖИТЬ ВЫБОР', 'Похожие предложения');
      const valid = (data.related || []).filter(item => item.title && item.url);
      if (valid.length) {
        const grid = el('div', null, 'lot-related'); valid.forEach(item => { const a = link('', item.url, ''); if (item.cover?.src) a.append(image(item.cover)); a.append(el('h3', item.title)); if (item.displayPrice) a.append(el('p', item.displayPrice)); grid.append(a); }); s.box.append(grid);
      } else {
        const box = el('div', null, 'lot-pick'); box.append(el('p', 'Сравните несколько вариантов по локации, площади и бюджету. Брокер подготовит подборку под ваш запрос.', 'lead'), action('Подобрать похожие', 'similar', 'button button--outline', 'arrow')); s.box.append(box);
      } main.append(s.node);
    }
    for (const [id, label] of [['lot-photos', 'Фото'], ['lot-plan', 'Планировка'], ['lot-about', 'О квартире'], ['lot-building', 'О доме'], ['lot-location', 'Расположение'], ['lot-terms', 'Условия'], ['lot-contact', 'Контакт']]) {
      if ($('#' + id)) nav.append(link(label, '#' + id, ''));
    }
    const bar = $('.lot-mobile-bar'); bar.replaceChildren();
    const label = el('div'); label.append(el('strong', price(data)), el('small', 'Лот ' + data.id)); bar.append(label, action('На просмотр', 'tour'));
    const contact = $('#lot-contact'); contact.style.setProperty('--contact-image', 'url("' + safeUrl(data.cover.src).replace(/["\\]/g, '') + '")');
    main.dataset.lotId = data.id;
  }
  window.renderBarnesLot = render;
  render(window.BARNES_LOT_DATA);
  if (window.__LOT_RENDER_ONLY__) return;

  const requestDialog = $('#request-dialog'), galleryDialog = $('#gallery-dialog');
  let requestKind = 'tour', requestTrigger = null, galleryTrigger = null, galleryItems = [], galleryIndex = 0;
  const requestNames = {tour: 'Просмотр объекта', presentation: 'Презентация объекта', 'plan-request': 'Планировка объекта', terms: 'Условия сделки', similar: 'Подбор похожих предложений'};
  function openRequest(kind, trigger) {
    if (menuOpen) setMenu(false);
    requestKind = kind; requestTrigger = trigger || document.activeElement;
    $('#request-title').textContent = kind === 'tour' ? 'Записаться на просмотр' : requestNames[kind] || 'Обсудить объект';
    $('#request-context').textContent = 'Лот ' + lot.id + ' · ' + lot.title;
    const body = $('#request-body'); body.replaceChildren(form('dialog'));
    if (!requestDialog.open) requestDialog.showModal();
    $('#dialog-name').focus({preventScroll: true});
  }
  function showPhoto() {
    const data = galleryItems[galleryIndex]; const stage = $('.gallery-viewport'); stage.classList.remove('is-zoomed'); stage.scrollTo(0, 0);
    stage.replaceChildren(image(data, '', true)); $('.gallery-counter').textContent = (galleryIndex + 1) + ' / ' + galleryItems.length;
    $('#gallery-zoom').textContent = 'Увеличить'; $('#gallery-zoom').setAttribute('aria-pressed', 'false');
    $$('.gallery-arrows button').forEach(button => button.hidden = galleryItems.length < 2);
  }
  function openGallery(plan, trigger) {
    galleryItems = plan ? [lot.floorPlan] : (lot.gallery?.length ? lot.gallery : [lot.cover]);
    if (!galleryItems[0]?.src) return;
    galleryIndex = 0; galleryTrigger = trigger;
    $('#gallery-title').textContent = plan ? 'Планировка объекта' : 'Фотографии объекта';
    $('#gallery-context').textContent = 'Лот ' + lot.id + ' · ' + lot.title;
    showPhoto(); galleryDialog.showModal(); $('.dialog-close', galleryDialog).focus({preventScroll: true});
  }
  document.addEventListener('click', event => {
    const thumbnail = event.target.closest('[data-hero-image]');
    if (thumbnail) {
      const selected = (lot.gallery?.length ? lot.gallery : [lot.cover])[Number(thumbnail.dataset.heroImage)];
      const cover = $('.lot-hero__image'); cover.src = safeUrl(selected.src); cover.alt = selected.alt || '';
      $$('[data-hero-image]').forEach(button => button.setAttribute('aria-pressed', String(button === thumbnail)));
    }
    const button = event.target.closest('[data-request]');
    if (button) {
      event.preventDefault();
      if (button.dataset.request === 'gallery' || button.dataset.request === 'plan') openGallery(button.dataset.request === 'plan', button);
      else openRequest(button.dataset.request, button);
    }
    const headerRequest = event.target.closest('[data-contact-open]');
    if (headerRequest) { event.preventDefault(); openRequest('tour', headerRequest); }
    if (event.target.closest('.site-footer__callback-btn')) { event.preventDefault(); openRequest('tour', event.target.closest('button')); }
  });
  document.addEventListener('input', event => {
    if (event.target.name !== 'phone') return;
    event.target.setCustomValidity(''); event.target.removeAttribute('aria-invalid');
    const error = $('.lot-form-error', event.target.form); if (error) error.hidden = true;
  });
  document.addEventListener('submit', event => {
    const node = event.target.closest('[data-lot-request]'); if (!node) return; event.preventDefault();
    const phone = $('[name=phone]', node), error = $('.lot-form-error', node);
    if (phone.value.replace(/\D/g, '').length < 7) {
      error.textContent = 'Введите телефон, по которому с вами можно связаться.'; error.hidden = false; phone.setAttribute('aria-invalid', 'true'); phone.focus(); return;
    }
    const kind = node.closest('dialog') ? requestKind : 'tour';
    const name = $('[name=name]', node).value.trim();
    const text = [requestNames[kind], 'Лот ' + lot.id + ' · ' + lot.title, 'Имя: ' + name, 'Телефон: ' + phone.value.trim()].join('\n');
    const result = el('div', null, 'lot-request-result'); result.setAttribute('role', 'status'); result.tabIndex = -1;
    result.append(el('h3', 'Запрос подготовлен'), el('p', text));
    const email = lot.broker?.email || 'moscow@barn-estate.com';
    result.append(link('Открыть письмо брокеру', 'mailto:' + email + '?subject=' + encodeURIComponent(requestNames[kind] + ' · лот ' + lot.id) + '&body=' + encodeURIComponent(text), 'button'));
    const phoneNumber = lot.broker?.phone || '+7 (499) 272-48-72'; result.append(link('Позвонить: ' + phoneNumber, 'tel:' + phoneNumber.replace(/[^+\d]/g, '')));
    result.append(el('p', 'Передайте запрос удобным способом. Он ещё не отправлен.', 'lot-form-note'));
    node.replaceWith(result); result.focus({preventScroll: true});
  });
  [requestDialog, galleryDialog].forEach(dialog => {
    $('.dialog-close', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target !== dialog) return; const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); });
    dialog.addEventListener('close', () => (dialog === requestDialog ? requestTrigger : galleryTrigger)?.focus({preventScroll: true}));
  });
  const advance = offset => { galleryIndex = (galleryIndex + offset + galleryItems.length) % galleryItems.length; showPhoto(); };
  $('#gallery-prev').addEventListener('click', () => advance(-1)); $('#gallery-next').addEventListener('click', () => advance(1));
  galleryDialog.addEventListener('keydown', event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); advance(event.key === 'ArrowRight' ? 1 : -1); } });
  $('#gallery-zoom').addEventListener('click', event => { const zoomed = $('.gallery-viewport').classList.toggle('is-zoomed'); event.currentTarget.textContent = zoomed ? 'Уменьшить' : 'Увеличить'; event.currentTarget.setAttribute('aria-pressed', String(zoomed)); });
  let touchX = null;
  $('.gallery-viewport').addEventListener('touchstart', event => { touchX = event.touches[0].clientX; }, {passive: true});
  $('.gallery-viewport').addEventListener('touchend', event => { if (touchX == null || $('.gallery-viewport').classList.contains('is-zoomed')) return; const delta = event.changedTouches[0].clientX - touchX; if (Math.abs(delta) > 60) advance(delta < 0 ? 1 : -1); touchX = null; }, {passive: true});

  const header = $('.site-header'), menu = $('.site-menu'), menuButton = $('.site-header__icon-btn');
  let menuOpen = false, previousOverflow = '';
  function setMenu(open) {
    menuOpen = open; menu.hidden = !open; header.classList.toggle('site-header--menu-open', open);
    menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    main.inert = open; $('footer').inert = open; $('.lot-mobile-bar').inert = open;
    if (open) { previousOverflow = document.documentElement.style.overflow; document.documentElement.style.overflow = 'hidden'; menu.setAttribute('role', 'dialog'); menu.setAttribute('aria-modal', 'true'); menu.setAttribute('aria-label', 'Основное меню'); $('a', menu).focus(); }
    else { document.documentElement.style.overflow = previousOverflow; menuButton.focus({preventScroll: true}); }
  }
  menuButton.addEventListener('click', () => setMenu(!menuOpen));
  menu.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', event => {
    if (!menuOpen) return;
    if (event.key === 'Escape') { event.preventDefault(); setMenu(false); }
    if (event.key === 'Tab') {
      const focusable = [...$$('button,a[href]', header), ...$$('a[href]', menu)].filter(e => e.getClientRects().length && !e.disabled);
      const first = focusable[0], last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  window.__barnesOwnerForm = {open: ({trigger} = {}) => openRequest('tour', trigger)};
  const count = $('.site-header__favorites-count');
  try { const stored = JSON.parse(localStorage.getItem('barnes:favorites') || '[]'); count.textContent = Array.isArray(stored) ? String(stored.length) : '0'; } catch { count.textContent = '0'; }
  let pending = false;
  function activeNav() {
    pending = false; const links = $$('.lot-nav a'); let active = links[0];
    for (const a of links) { if ($(a.hash)?.getBoundingClientRect().top < 100) active = a; }
    links.forEach(a => a === active ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'));
  }
  window.addEventListener('scroll', () => { if (!pending) { pending = true; requestAnimationFrame(activeNav); } }, {passive: true}); activeNav();
  new IntersectionObserver(entries => {
    document.body.dataset.lotHeroOffscreen = String(!entries[0].isIntersecting);
  }).observe($('#lot-photos'));
})();
