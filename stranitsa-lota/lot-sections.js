/* Property-first sections. Feed BARNES_LOT_DATA before lot-data.js; no per-ID pages. */
(function () {
  'use strict';
  const lot = window.BARNES_LOT_DATA;
  const page = document.querySelector('.lot-page');
  const el = (tag, text, cls) => {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (cls) node.className = cls;
    return node;
  };
  const section = (id, title) => {
    const node = el('section', null, 'lot-detail base-container');
    node.id = id;
    node.setAttribute('aria-labelledby', id + '-title');
    const heading = el('h2', title);
    heading.id = id + '-title';
    node.append(heading);
    return node;
  };
  const action = (label, modal) => {
    const button = el('button', label, 'lot-detail__button');
    button.type = 'button';
    button.dataset.lotModal = modal;
    return button;
  };
  const appendImage = (parent, image) => {
    const img = el('img');
    img.src = image.src;
    img.alt = image.alt || '';
    img.loading = 'lazy';
    parent.append(img);
  };
  const hero = page.querySelector('.lot-hero');
  hero.id = 'lot-photos';
  const nav = el('nav', null, 'lot-detail-nav base-container');
  nav.setAttribute('aria-label', 'Разделы лота');
  hero.after(nav);
  let cursor = nav;
  function insert(node) { cursor.after(node); cursor = node; }

  const about = section('lot-about', 'О лоте');
  const grid = el('div', null, 'lot-detail__grid');
  const copy = el('div', null, 'lot-detail__copy');
  (lot.descriptionParagraphs || [lot.description]).filter(Boolean).forEach(p => copy.append(el('p', p)));
  const facts = el('dl', null, 'lot-detail__facts');
  (lot.facts || []).filter(f => f.value != null && f.value !== '').forEach(f => {
    const row = el('div');
    row.append(el('dt', f.label), el('dd', String(f.value)));
    facts.append(row);
  });
  grid.append(copy, facts);
  about.append(grid);
  if (lot.demo?.notice) about.append(el('p', lot.demo.notice, 'lot-detail__note'));
  insert(about);

  if (lot.floorPlan?.src) {
    const plan = section('lot-plan', 'Планировка');
    const link = el('a', null, 'lot-detail__plan');
    link.href = lot.floorPlan.src;
    link.target = '_blank';
    link.rel = 'noopener';
    link.setAttribute('aria-label', 'Открыть планировку в полном размере');
    appendImage(link, lot.floorPlan);
    plan.append(link);
    insert(plan);
  } else if (lot.broker) {
    const request = el('div', null, 'lot-detail__plan-request');
    request.append(el('p', 'Нужна планировка или дополнительные материалы?'), action('Запросить у брокера', 'presentation'));
    about.append(request);
  }

  const map = page.querySelector('.surroundings-map');
  if (map) {
    const location = section('lot-location', 'Расположение');
    if (lot.locationLabel) location.append(el('p', lot.locationLabel, 'lot-detail__lead'));
    location.append(el('p', 'Карта сохранена для предпросмотра. Точный адрес и актуальное окружение уточнит брокер.', 'lot-detail__note'));
    insert(location);
    cursor.after(map);
    cursor = map;
  }

  // Never infer a complex/developer from a gallery or a property category.
  if (lot.building?.verified === true && lot.building.name) {
    const building = section('lot-building', 'О доме');
    const box = el('div', null, 'lot-detail__building');
    const content = el('div');
    content.append(el('h3', lot.building.name));
    if (lot.building.description) content.append(el('p', lot.building.description));
    box.append(content);
    if (lot.building.url) {
      const link = el('a', 'Подробнее о доме / ЖК →', 'lot-detail__link');
      link.href = lot.building.url;
      box.append(link);
    }
    building.append(box);
    insert(building);
  }

  if (lot.related?.length) {
    const related = section('lot-related', 'Похожие лоты');
    const cards = el('div', null, 'lot-detail__related');
    lot.related.filter(item => item.url && item.title).forEach(item => {
      const card = el('a', null, 'lot-detail__related-card');
      card.href = item.url;
      if (item.cover?.src) appendImage(card, item.cover);
      card.append(el('h3', item.title));
      if (item.displayPrice) card.append(el('p', item.displayPrice));
      cards.append(card);
    });
    if (cards.childElementCount) { related.append(cards); insert(related); }
  }

  const contact = section('lot-contact', 'Обсудим этот лот?');
  const contactBox = el('div', null, 'lot-detail__contact');
  if (lot.broker) {
    const broker = el('div', null, 'lot-detail__broker');
    if (lot.broker.photo?.src) appendImage(broker, lot.broker.photo);
    const info = el('div');
    info.append(el('h3', lot.broker.name), el('p', lot.broker.role));
    const phone = el('a', lot.broker.phone, 'lot-detail__phone');
    phone.href = 'tel:' + lot.broker.phone.replace(/[^+\d]/g, '');
    info.append(phone);
    broker.append(info);
    contactBox.append(broker);
    const actions = el('div', null, 'lot-detail__contact-actions');
    actions.append(action('Записаться на просмотр', 'tour'), action('Подобрать похожие', 'callback'));
    contactBox.append(actions);
    contact.append(contactBox, el('p', 'В предпросмотре формы не отправляют заявки. Связаться можно по телефону брокера.', 'lot-detail__note'));
  } else {
    contact.append(el('p', 'Контакт по этому лоту пока не указан.'));
    page.querySelector('.floating-expert')?.remove();
  }
  insert(contact);

  const anchors = [['lot-photos', 'Фото'], ['lot-about', 'Описание и характеристики'], ['lot-plan', 'Планировка'], ['lot-location', 'Расположение'], ['lot-building', 'О доме'], ['lot-related', 'Похожие лоты'], ['lot-contact', 'Контакт']];
  anchors.forEach(([id, label]) => {
    if (!document.getElementById(id)) return;
    const link = el('a', label);
    link.href = '#' + id;
    nav.append(link);
  });
  // One offer, one primary viewing action; inherited templates use the same context.
  document.querySelectorAll('.lot-hero__card-action').forEach(button => {
    const node = [...button.childNodes].find(n => n.nodeType === 3 && n.textContent.trim());
    if (node && /экскурси/i.test(node.textContent)) node.textContent = 'Записаться на просмотр';
  });
  const presentation = document.getElementById('source-presentation');
  if (presentation) {
    const heading = presentation.content.querySelector('h2');
    if (heading) heading.textContent = 'Материалы по лоту';
  }
  const tour = document.getElementById('source-tour');
  const tourHeading = tour?.content.querySelector('h2');
  if (tourHeading) tourHeading.textContent = 'Записаться на просмотр';
}());
