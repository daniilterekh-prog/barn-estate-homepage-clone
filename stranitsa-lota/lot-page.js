/* One object page, local UI kit, no external UI dependencies or lead submission. */
(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const main = $('#main');
  const heroVariant = new URLSearchParams(location.search).get('hero');
  if (/^[1-5]$/.test(heroVariant || '')) document.body.dataset.heroVariant = heroVariant;
  const icons = {
    arrow: '<path d="M6 18 18 6M6 6h12v12"/>',
    photos: '<rect x="3" y="4" width="18" height="16" rx="1"/><circle cx="8" cy="9" r="1.5"/><path d="m3 17 6-5 4 3 4-5 4 5"/>',
    plan: '<path d="M3 3h18v18H3zM3 12h9V3M12 12v9M12 16h9"/>',
    left: '<path d="M9.5 21 1 11 9.5 1"/>',
    right: '<path d="M1.5 21 10 11 1.5 1"/>'
  };
  function el(tag, text, cls) {
    const node = document.createElement(tag);
    if (text != null) node.textContent = String(text);
    if (cls) node.className = cls;
    return node;
  }
  function icon(name) {
    const node = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    node.setAttribute('width', name === 'left' || name === 'right' ? '11' : '18');
    node.setAttribute('height', name === 'left' || name === 'right' ? '22' : '18');
    node.classList.add('ui-arrow');
    node.setAttribute('viewBox', name === 'left' || name === 'right' ? '0 0 11 22' : '0 0 24 24');
    node.setAttribute('fill', 'none');
    node.setAttribute('stroke', 'currentColor');
    node.setAttribute('stroke-width', name === 'left' || name === 'right' ? '1' : '1.5');
    node.setAttribute('stroke-linecap', name === 'left' || name === 'right' ? 'butt' : 'round');
    node.setAttribute('stroke-linejoin', name === 'left' || name === 'right' ? 'miter' : 'round');
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
    const group = el('div');
    if (eyebrow) group.append(el('p', eyebrow, 'eyebrow'));
    const h2 = el('h2', title); h2.id = id + '-title'; group.append(h2); heading.append(group);
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
  function heroPhotos(data) {
    const seen = new Set();
    return [data.cover, ...(data.gallery || [])].filter(photo => {
      const src = safeUrl(photo?.src, '');
      if (!src || seen.has(src)) return false;
      seen.add(src); return true;
    });
  }
  let lot, heroIndex = 0;
  function render(data) {
    if (!data?.id || !data.title || !data.cover?.src) throw new Error('Для лота нужны id, title и cover.src');
    lot = data; heroIndex = 0; window.BARNES_LOT_DATA = data;
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
    if (document.body.dataset.heroVariant === '3') {
      const items = heroPhotos(data);
      if (items.length > 1) {
        actions.classList.add('lot-hero__slider');
        actions.setAttribute('role', 'group');
        actions.setAttribute('aria-label', 'Фотографии объекта');
        const previous = el('button', null, 'icon-button pg-nav-button'); previous.type = 'button';
        previous.dataset.heroStep = '-1'; previous.setAttribute('aria-label', 'Предыдущее фото в херо'); previous.append(icon('left'));
        const counter = el('span', '1 / ' + items.length, 'lot-hero__counter');
        counter.setAttribute('aria-live', 'polite'); counter.setAttribute('aria-atomic', 'true');
        const next = el('button', null, 'icon-button pg-nav-button'); next.type = 'button';
        next.dataset.heroStep = '1'; next.setAttribute('aria-label', 'Следующее фото в херо'); next.append(icon('right'));
        actions.append(previous, counter, next); copy.append(actions);
      }
    } else {
      const photos = action('Все фото · ' + (data.gallery?.length || 1), 'gallery', 'button', 'photos');
      photos.setAttribute('aria-label', 'Открыть галерею фотографий');
      actions.append(photos, link('Планировка', '#lot-plan', 'button button--outline'));
      copy.append(actions);
    }
    visual.append(copy);
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
      if (actions.classList.contains('lot-hero__slider')) offer.append(actions);
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
    const sectionLinks = [];
    const photosForBlocks = heroPhotos(data);
    const photoFor = index => photosForBlocks[index] || data.cover;
    const characteristics = (data.facts || []).filter(f => f.value != null && f.value !== '');
    if (characteristics.length || data.features?.length) {
      const s = section('lot-features', 'ОБ ОБЪЕКТЕ', 'Характеристики объекта');
      const passport = el('div', null, 'passport'); const figure = el('figure'); figure.append(image(photoFor(1)));
      const items = characteristics.length ? characteristics : data.features.map(f => ({label:f.label,value:f.text}));
      const list = factsList(items, 'passport-facts'); list.setAttribute('aria-label','Характеристики объекта');
      passport.append(figure,list); s.box.append(passport); main.append(s.node);
    }
    {
      const s = section('lot-plan', 'ПРОСТРАНСТВО', 'Планировка');
      const layout = el('div',null,'apartments-layout'); const content = el('div',null,'formats-content');
      const heading = el('div',null,'formats-heading'); heading.setAttribute('aria-hidden','true');
      ['Формат','Площадь','Комнат',''].forEach(value=>heading.append(el('span',value)));
      const formats = el('div',null,'format-list'); formats.setAttribute('aria-label','Параметры планировки объекта');
      const request = data.floorPlan?.src ? 'plan' : 'plan-request';
      const row = action('',request,'format-row');
      row.append(el('span',fact(data,'Тип объекта') || 'Объект','format-name'),el('span',fact(data,'Площадь') || 'Уточнить','format-price'),el('span',fact(data,'Комнат') ? fact(data,'Комнат') + ' комн.' : '—','format-area'));
      const rowAction=el('span',data.floorPlan?.src?'Смотреть':'Запросить','format-action'); rowAction.append(icon('right')); row.append(rowAction); formats.append(row);
      content.append(heading,formats);
      if(data.floorPlan?.description) content.append(el('p',data.floorPlan.description,'format-note lead'));
      const cover=el('figure',null,'formats-cover'); cover.append(image(photoFor(3)));
      const caption=el('figcaption'); caption.append(el('h3',data.floorPlan?.src?'Планировка объекта':'Планировка по запросу'),el('p',data.floorPlan?.src?'Посмотрите план и обсудите пространство с брокером.':'Попросите брокера прислать план и уточнить размеры помещений.'));
      caption.append(action(data.floorPlan?.src?'Открыть планировку':'Запросить планировку',request,'formats-plan-link','arrow')); cover.append(caption);
      layout.append(content,cover); s.box.append(layout); main.append(s.node);
    }
    {
      const s=section('lot-about','ВАШ БУДУЩИЙ ДОМ','О квартире'); const description=el('div',null,'project-description');
      const text=el('div',null,'project-description__text');
      (data.descriptionParagraphs || [data.description]).filter(Boolean).forEach(p=>text.append(el('p',p)));
      if(data.features?.length){const list=el('ul',null,'plain-list');data.features.forEach(f=>list.append(el('li',f.label+(f.text?' — '+f.text:''))));text.append(list);}
      const figure=el('figure',null,'project-description__image');figure.append(image(photoFor(2)));
      description.append(text,figure);s.box.append(description);main.append(s.node);
    }
    if(data.building?.verified===true && data.building.name){
      const b=data.building,s=section('lot-building','АДРЕС И ХАРАКТЕР','О доме');
      const description=el('div',null,'project-description'+(b.image?.src?'':' project-description--text-only'));
      const text=el('div',null,'project-description__text'); text.append(el('h3',b.name));
      if(b.description)text.append(el('p',b.description));if(b.url)text.append(link('Подробнее о доме / ЖК',b.url));description.append(text);
      if(b.image?.src){const figure=el('figure',null,'project-description__image');figure.append(image(b.image));description.append(figure);}
      s.box.append(description);
      if(b.facts?.length){const passport=el('div',null,'passport passport--text-only');passport.append(factsList(b.facts,'passport-facts'));s.box.append(passport);}
      main.append(s.node);
    }
    if(data.locationLabel || data.location){
      const s=section('lot-location','ГОРОД ВОКРУГ ВАС','Расположение и окружение');
      const layout=el('div',null,'location-layout');const panel=el('div',null,'map-panel');
      const mapUrl=safeUrl(data.location?.mapUrl || 'https://yandex.ru/maps/?text='+encodeURIComponent(data.locationLabel));
      if(data.location?.mapImage?.src){const preview=link('',mapUrl,'lot-map-preview');preview.target='_blank';preview.rel='noopener noreferrer';preview.setAttribute('aria-label','Открыть расположение объекта в Яндекс Картах');preview.append(image(data.location.mapImage,'lot-map'));const pin=el('span',null,'lot-map-pin');pin.setAttribute('aria-hidden','true');preview.append(pin);panel.append(preview);}
      if(data.location?.embedUrl){const frame=el('iframe',null,'lot-map');frame.src=safeUrl(data.location.embedUrl);frame.title='Расположение объекта на карте';frame.loading='lazy';frame.referrerPolicy='no-referrer-when-downgrade';panel.append(frame);}
      const copy=el('div',null,'location-copy');copy.append(el('h3',data.location?.label || data.locationLabel),el('p',data.location?.note || 'Точный адрес и детали окружения уточнит брокер.','lead'));
      const mapLink=link('Открыть в Яндекс Картах',mapUrl);mapLink.target='_blank';mapLink.rel='noopener noreferrer';mapLink.append(icon('arrow'));copy.append(mapLink);
      if(data.location?.nearby?.length){const list=el('ul',null,'plain-list');data.location.nearby.forEach(place=>list.append(el('li',place.name+(place.detail?' — '+place.detail:''))));copy.append(list);}
      if(panel.childElementCount)layout.append(panel);else layout.classList.add('location-layout--text-only');layout.append(copy);s.box.append(layout);
      if(data.location?.mapImage?.src)s.box.append(link('© Яндекс · Условия использования','https://yandex.ru/legal/maps_termsofuse/','note lot-map-attribution'));main.append(s.node);
    }
    {
      const s=section('lot-terms','ПРИОБРЕТЕНИЕ НЕДВИЖИМОСТИ',data.terms?.title || 'Стоимость и условия','purchase');
      const grid=el('div',null,'three-columns lot-purchase-pair');
      const amount=el('article');amount.append(el('span','01','item-number'),el('h3','Стоимость объекта'),el('p',price(data),'lot-price-caption'));
      if(data.demo)amount.append(el('p','Стоимость из сохранённой карточки объекта.','small muted'));
      amount.append(action('Уточнить стоимость','terms','text-link','arrow'));
      const terms=el('article');terms.append(el('span','02','item-number'),el('h3','Условия сделки'));
      if(data.terms?.note)terms.append(el('p',data.terms.note));
      if(data.terms?.items?.length){const list=el('ul',null,'plain-list');data.terms.items.forEach(item=>list.append(el('li',item)));terms.append(list);}
      terms.append(action('Обсудить условия с брокером','terms','text-link','arrow'));grid.append(amount,terms);s.box.append(grid);main.append(s.node);
    }
    if(data.documents?.length){
      const s=section('lot-documents','МАТЕРИАЛЫ','Документы');const grid=el('div',null,'three-columns documents');
      data.documents.filter(d=>d.url&&d.title).forEach(d=>{const a=link('',d.url,'');a.target='_blank';a.rel='noopener noreferrer';const label=el('span','Документ','small muted');label.append(icon('arrow'));a.append(label,el('h3',d.title),el('span','Открыть документ','small'));grid.append(a)});
      if(grid.childElementCount){s.box.append(grid);main.append(s.node)}
    }
    if(data.faq?.length){
      const s=section('lot-faq','ПОДРОБНОСТИ','Вопросы об объекте');const list=el('div',null,'faq-list');
      data.faq.forEach(f=>{const details=el('details');const summary=el('summary');summary.append(el('span',f.question,'faq-question'));const plus=el('span',null,'faq-icon');plus.innerHTML='<svg viewBox="0 0 30 30" fill="none" stroke="currentColor" aria-hidden="true"><path d="M15 5v20M5 15h20"/></svg>';summary.append(plus);details.append(summary,el('p',f.answer));list.append(details)});s.box.append(list);main.append(s.node);
    }
    {
      // Reuse the complete agency consultation component, including its expert composite.
      // The expert illustrates the agency; the lot's broker and handoff destination stay in its data.
      const wrapper = el('div');
      wrapper.innerHTML = `<section class="project-consultation block" id="lot-contact" aria-labelledby="lot-contact-title">
  <img class="pc-background" src="kit/assets/cta-ruslan-background.webp" alt="" width="1700" height="889" loading="lazy">
  <div class="pc-overlay" aria-hidden="true"></div>
  <div class="container pc-inner"><div class="pc-content">
    <div class="pc-expert"><span class="pc-expert-photo"><img src="kit/assets/cta-ruslan-avatar.webp" alt="Руслан Прус" width="66" height="66" loading="lazy"></span><div><p class="pc-expert-role">Руководитель департамента городской недвижимости</p><p class="pc-inline-name">Руслан Прус</p></div></div>
    <header class="pc-header"><p class="eyebrow">BARN Estate</p><h2 id="lot-contact-title">Консультация эксперта</h2></header>
    <form id="lot-consultation-form" data-lot-request="">
      <fieldset class="pc-channels"><legend class="pc-sr-only">Удобный способ связи</legend><label class="pc-channel"><input class="pc-sr-only" type="radio" name="channel" value="call" checked=""><span><svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
</svg><span>Звонок</span></span></label>
<label class="pc-channel"><input class="pc-sr-only" type="radio" name="channel" value="max"><span><svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 42 42" fill="none">
  <path d="M21.47 41.88c-4.11 0-6.02-.6-9.34-3-2.1 2.7-8.75 4.81-9.04 1.2 0-2.71-.6-5-1.28-7.5C1 29.5.08 26.07.08 21.1.08 9.23 9.82.3 21.36.3c11.55 0 20.6 9.37 20.6 20.91a20.6 20.6 0 0 1-20.49 20.67m.17-31.32c-5.62-.29-10 3.6-10.97 9.7-.8 5.05.62 11.2 1.83 11.52.58.14 2.04-1.04 2.95-1.95a10.4 10.4 0 0 0 5.08 1.81 10.7 10.7 0 0 0 11.19-9.97 10.7 10.7 0 0 0-10.08-11.1Z" fill="currentColor"></path>
</svg><span>MAX</span></span></label>
<label class="pc-channel"><input class="pc-sr-only" type="radio" name="channel" value="whatsapp"><span><svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" fill="currentColor"></path>
</svg><span>WhatsApp</span></span></label>
<label class="pc-channel"><input class="pc-sr-only" type="radio" name="channel" value="telegram"><span><svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" fill="currentColor"></path>
</svg><span>Telegram</span></span></label></fieldset>
      <div class="pc-fields">
        <div><label class="pc-sr-only" for="inline-name">Ваше имя</label><input class="pc-input" id="inline-name" name="name" type="text" maxlength="100" autocomplete="name" placeholder="Введите ваше имя" required=""></div>
        <div><label class="pc-sr-only" for="inline-phone">Номер телефона</label><input class="pc-input" id="inline-phone" name="phone" type="tel" maxlength="40" aria-describedby="inline-error" inputmode="tel" autocomplete="tel" placeholder="Ваш номер телефона" required=""></div>
        <div><label class="pc-sr-only" for="inline-comment">Комментарий</label><textarea class="pc-textarea" id="inline-comment" name="comment" rows="2" maxlength="1000" placeholder="Оставьте свой комментарий"></textarea></div>
      </div>
      <button class="button pc-submit" type="submit">Подготовить запрос</button>
      <label class="pc-consent"><input id="inline-consent" type="checkbox" name="consent" required=""><span>Я даю согласие на <a href="https://barn-estate.ru/legal_notices/yuridicheskie-uvedomleniya/" target="_blank" rel="noopener">обработку персональных данных</a></span></label>
      <p class="lot-form-error" id="inline-error" role="alert" hidden></p>
    </form>
  </div></div>
</section>`;
      main.append(wrapper.firstElementChild);
    }
    {
      const s=section('lot-related','ПРОДОЛЖИТЬ ВЫБОР','Похожие предложения');const valid=(data.related || []).filter(item=>item.title&&item.url);
      if(valid.length){const grid=el('ul',null,'related-project-grid');grid.setAttribute('aria-label','Похожие предложения недвижимости');
        valid.forEach((item,index)=>{const li=el('li'),card=el('article',null,'rp-card');const key=String(item.id || index);card.setAttribute('aria-labelledby','related-'+key+'-title');
          if(item.cover?.src){const media=el('div',null,'rp-media'),a=link('',item.url,'rp-image-link');a.append(image(item.cover));media.append(a);
            const favorite=el('button',null,'rp-favorite');favorite.type='button';favorite.dataset.relatedFavorite=key;favorite.dataset.relatedTitle=item.title;favorite.setAttribute('aria-pressed','false');favorite.setAttribute('aria-label','Добавить '+item.title+' в избранное');
            favorite.innerHTML='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>';media.append(favorite);card.append(media);}
          const body=el('div',null,'rp-body');if(item.address)body.append(el('p',item.address,'rp-address'));const title=el('h3',null,'rp-name');title.id='related-'+key+'-title';title.append(link(item.title,item.url,''));body.append(title);
          if(item.facts?.length)body.append(factsList(item.facts,'rp-facts'));if(item.displayPrice)body.append(el('p',item.displayPrice,'small'));card.append(body);
          const actions=el('div',null,'rp-actions'),call=action('Заказать звонок','related','rp-call');call.setAttribute('aria-haspopup','dialog');call.dataset.relatedId=item.id || '';call.dataset.relatedTitle=item.title;
          const details=link('Подробнее',item.url,'rp-details');details.innerHTML+=' <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true" focusable="false"><path d="M3 13 13 3M6 3h7v7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25"/></svg>';
          actions.append(call,details);card.append(actions);li.append(card);grid.append(li);
        });s.box.append(grid);const status=el('p',null,'rp-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');s.box.append(status);
      }else{const content=el('div',null,'project-description__text lot-selection-copy');content.append(el('p','Сравните несколько вариантов по локации, площади и бюджету. Брокер подготовит подборку под ваш запрос.','lead'),action('Подобрать похожие','similar','button outline selection-cta','arrow'));s.box.append(content)}main.append(s.node);
    }
    for (const [id, label] of [['lot-photos', 'Фото'], ['lot-plan', 'Планировка'], ['lot-about', 'О квартире'], ['lot-building', 'О доме'], ['lot-location', 'Расположение'], ['lot-terms', 'Условия'], ['lot-contact', 'Контакт']]) {
      if ($('#' + id)) sectionLinks.push({id, label});
    }
    const newsletter = el('div');newsletter.innerHTML = "<section class=\"newsletter-cta\" aria-labelledby=\"newsletter-title\" data-v-47bd53e9=\"\" data-v-1e8e9561=\"\" id=\"lot-newsletter\"><div class=\"newsletter-cta__inner\" data-v-1e8e9561=\"\"><div class=\"newsletter-cta__grid\" data-v-1e8e9561=\"\"><div class=\"newsletter-cta__copy\" data-v-1e8e9561=\"\"><p class=\"home-section-eyebrow\">Рассылка BARN Estate</p><h2 id=\"newsletter-title\" data-v-1e8e9561=\"\"> В центре событий рынка недвижимости </h2><p class=\"newsletter-cta__lead\" data-v-1e8e9561=\"\"> Узнавайте первыми о новых проектах, редких объектах и ключевых тенденциях рынка элитной недвижимости. Подписывайтесь на рассылку BARN Estate. </p><form class=\"newsletter-form\" novalidate=\"\" data-v-1e8e9561=\"\" aria-label=\"Подписка на новости BARN Estate\"><label class=\"newsletter-form__label\" for=\"newsletter-email\" data-v-1e8e9561=\"\"> Ваш email </label><div class=\"newsletter-form__row\" data-v-1e8e9561=\"\"><input id=\"newsletter-email\" value=\"\" name=\"email\" type=\"email\" autocomplete=\"email\" placeholder=\"Ваш email\" aria-describedby=\"newsletter-note newsletter-error\" data-v-1e8e9561=\"\" required=\"\"><button type=\"submit\" data-v-1e8e9561=\"\">Подписаться <svg aria-hidden=\"true\" focusable=\"false\" width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\"><path d=\"M3 13 13 3M5 3h8v8\" stroke=\"currentColor\" stroke-width=\"1.25\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg></button></div><p id=\"newsletter-error\" class=\"newsletter-form__error\" data-v-1e8e9561=\"\" role=\"alert\"></p><p class=\"newsletter-form__note\" id=\"newsletter-note\" data-v-1e8e9561=\"\"> Нажимая на кнопку, вы соглашаетесь с <a class=\"newsletter-form__note-link\" target=\"_blank\" href=\"https://barn-estate.ru/legal_notices/yuridicheskie-uvedomleniya/\" data-v-1e8e9561=\"\" rel=\"noopener noreferrer\"><!--[--> политикой конфиденциальности <!--]--></a>. </p><!----></form></div><div class=\"newsletter-cta__visual\" data-v-1e8e9561=\"\"><picture data-v-1e8e9561=\"\"><source media=\"(max-width: 540px)\" srcset=\"kit/assets/newsletter-mobile.webp\" data-v-1e8e9561=\"\"><img src=\"kit/assets/newsletter-desktop.webp\" alt=\"Обложки журнала BARN Estate\" width=\"1100\" height=\"540\" loading=\"lazy\" data-v-1e8e9561=\"\"></picture></div></div></div></section>";main.append(newsletter.firstElementChild);
    main.dataset.lotId = data.id;
    // Reuse the existing Owner/Media compact header adapter with lot anchors.
    $('.lot-sticky-header')?.remove();
    const sticky = el('div', null, 'owner-sale-sticky lot-sticky-header');
    sticky.setAttribute('aria-label', 'Навигация и связь по лоту');
    sticky.setAttribute('aria-hidden', 'true'); sticky.setAttribute('inert', '');
    const inner = el('div', null, 'owner-sale-sticky__inner base-container');
    const stickyNav = el('nav', null, 'owner-sale-sticky__nav'); stickyNav.setAttribute('aria-label', 'Разделы лота в хедере');
    const list = el('ul', null, 'owner-sale-sticky__list');
    for (const {id, label} of sectionLinks) {
      const item = el('li', null, 'owner-sale-sticky__item');
      item.append(link(label, '#' + id, 'owner-sale-sticky__link')); list.append(item);
    }
    stickyNav.append(list);
    const logo = $('.site-header__logo').cloneNode(true); logo.className = 'owner-sale-sticky__logo';
    const brand = el('div', null, 'owner-sale-sticky__brand');
    brand.append(action('Связаться с нами', 'tour', 'owner-sale-sticky__request'));
    inner.append(stickyNav, logo, brand); sticky.append(inner); main.before(sticky);
    if (!window.__LOT_RENDER_ONLY__) requestAnimationFrame(syncSticky);
  }
  window.renderBarnesLot = render;
  render(window.BARNES_LOT_DATA);
  if (window.__LOT_RENDER_ONLY__) return;

  const requestDialog = $('#request-dialog'), galleryDialog = $('#gallery-dialog');
  let requestKind = 'tour', requestTarget = null, requestTrigger = null, galleryTrigger = null, galleryItems = [], galleryIndex = 0;
  const requestNames = {tour: 'Просмотр объекта', presentation: 'Презентация объекта', 'plan-request': 'Планировка объекта', terms: 'Условия сделки', similar: 'Подбор похожих предложений', expert:'Вопрос эксперту', related:'Вопрос по объекту'};
  function openRequest(kind, trigger) {
    if (menuOpen) setMenu(false);
    requestKind = kind; requestTrigger = trigger?.checkVisibility() ? trigger : document.activeElement;
    $('#request-title').textContent = kind === 'tour' ? 'Записаться на просмотр' : requestNames[kind] || 'Обсудить объект';
    requestTarget = trigger?.dataset.relatedTitle ? {id:trigger.dataset.relatedId || '',title:trigger.dataset.relatedTitle} : lot;
    $('#request-context').textContent = (requestTarget.id ? 'Лот ' + requestTarget.id + ' · ' : '') + requestTarget.title;
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
  function advanceHero(offset) {
    const items = heroPhotos(lot);
    if (items.length < 2) return;
    heroIndex = (heroIndex + offset + items.length) % items.length;
    const selected = items[heroIndex], cover = $('.lot-hero__image');
    cover.src = safeUrl(selected.src); cover.alt = selected.alt || '';
    $('.lot-hero__counter').textContent = (heroIndex + 1) + ' / ' + items.length;
  }
  document.addEventListener('keydown', event => {
    if (!event.target.closest('.lot-hero__slider')) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); advanceHero(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  let heroTouch = null;
  document.addEventListener('pointerdown', event => {
    if (document.body.dataset.heroVariant !== '3' || event.pointerType !== 'touch' ||
        !event.target.closest('.lot-hero') || event.target.closest('a,button,input')) return;
    heroTouch = {id:event.pointerId,x:event.clientX,y:event.clientY};
  }, {passive:true});
  document.addEventListener('pointerup', event => {
    if (!heroTouch || heroTouch.id !== event.pointerId) return;
    const dx = event.clientX - heroTouch.x, dy = event.clientY - heroTouch.y;
    heroTouch = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.2) advanceHero(dx < 0 ? 1 : -1);
  }, {passive:true});
  document.addEventListener('pointercancel', () => {heroTouch = null;}, {passive:true});
  document.addEventListener('click', event => {
    const heroStep = event.target.closest('[data-hero-step]');
    if (heroStep) {advanceHero(Number(heroStep.dataset.heroStep));return;}
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
    const channel = $('[name=channel]:checked', node)?.value;
    const channels = {call:'Звонок',max:'MAX',whatsapp:'WhatsApp',telegram:'Telegram'};
    const comment = $('[name=comment]', node)?.value.trim();
    const target = node.closest('dialog') ? requestTarget || lot : lot;
    const text = [requestNames[kind], (target.id ? 'Лот ' + target.id + ' · ' : '') + target.title, 'Имя: ' + name, 'Телефон: ' + phone.value.trim(), channel && 'Предпочтительный способ связи: ' + channels[channel], comment && 'Комментарий: ' + comment].filter(Boolean).join('\n');
    const result = el('div', null, 'lot-request-result'); result.setAttribute('role', 'status'); result.tabIndex = -1;
    result.append(el('h3', 'Запрос подготовлен'), el('p', text));
    const email = lot.broker?.email || 'moscow@barn-estate.com';
    result.append(link('Открыть письмо брокеру', 'mailto:' + email + '?subject=' + encodeURIComponent(requestNames[kind] + (target.id ? ' · лот ' + target.id : '')) + '&body=' + encodeURIComponent(text), 'button'));
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
    main.inert = open; $('footer').inert = open; $('.project-floating-expert').inert = open;
    if (open) { previousOverflow = document.documentElement.style.overflow; document.documentElement.style.overflow = 'hidden'; menu.setAttribute('role', 'dialog'); menu.setAttribute('aria-modal', 'true'); menu.setAttribute('aria-label', 'Основное меню'); $('a', menu).focus(); }
    else { document.documentElement.style.overflow = previousOverflow; menuButton.focus({preventScroll: true}); }
    syncSticky();
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
  function syncSticky() {
    const sticky = $('.lot-sticky-header'), hero = $('#lot-photos');
    if (!sticky || !hero) return;
    const visible = window.scrollY > hero.offsetTop + hero.offsetHeight - 120 && !menuOpen;
    sticky.classList.toggle('owner-sale-sticky--visible', visible);
    sticky.setAttribute('aria-hidden', String(!visible)); sticky.inert = !visible;
    document.body.dataset.lotStickyActive = String(visible);
    document.documentElement.style.setProperty('--lot-sticky-height', sticky.offsetHeight + 'px');
  }
  function activeNav() {
    pending = false; syncSticky();
    const links = $$('.lot-sticky-header .owner-sale-sticky__link'); let active = links[0];
    const line = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) + 2;
    for (const a of links) { if ($(a.hash)?.getBoundingClientRect().top < line) active = a; }
    for (const a of links) {
      const selected = a.hash === active?.hash;
      if (selected) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      a.classList.toggle('owner-sale-sticky__link--active', selected);
    }
  }
  const scheduleNav = () => {if (!pending) {pending = true; requestAnimationFrame(activeNav);}};
  window.addEventListener('scroll', scheduleNav, {passive:true});
  window.addEventListener('resize', scheduleNav); activeNav();
  new ResizeObserver(scheduleNav).observe($('.lot-sticky-header'));
  new IntersectionObserver(entries => {
    document.body.dataset.lotHeroOffscreen = String(!entries[0].isIntersecting);
  }).observe($('#lot-photos'));

})();
