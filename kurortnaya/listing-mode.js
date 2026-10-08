(function () {
  'use strict';

  const list = document.querySelector('.catalog-grid__list');
  const header = document.querySelector('.catalog-grid__header');
  const legacyFilters = document.querySelector('.catalog-quick-filters');
  const sort = document.querySelector('.catalog-grid__sort');
  if (!list || !header || !sort || list.dataset.modeReady === 'true') return;

  list.dataset.modeReady = 'true';
  const projectItems = [...list.querySelectorAll(':scope > .catalog-grid__item')];
  const projectItem = projectItems[0];
  if (!projectItem) return;

  projectItems.slice(1).forEach((item) => {
    item.hidden = true;
  });
  legacyFilters?.setAttribute('hidden', '');

  const createFact = (label, value) => {
    const fact = document.createElement('div');
    fact.className = 'listing-card-fact';
    const term = document.createElement('dt');
    term.className = 'listing-card-fact__label';
    term.textContent = label;
    const description = document.createElement('dd');
    description.className = 'listing-card-fact__value';
    description.textContent = value;
    fact.append(term, description);
    return fact;
  };

  const createFacts = (items, modifier) => {
    const facts = document.createElement('dl');
    facts.className = `listing-card-facts listing-card-facts--${modifier}`;
    facts.setAttribute('aria-label', 'Основные характеристики');
    items.forEach(([label, value]) => facts.append(createFact(label, value)));
    return facts;
  };

  const projectCard = projectItem.querySelector('.apartment-card');
  const projectBody = projectCard?.querySelector('.apartment-card__body');
  const projectName = projectBody?.querySelector('.apartment-card__name');
  projectBody?.querySelector('.apartment-card__topline')?.remove();
  projectBody?.querySelector('.apartment-card__address')?.remove();
  if (projectName && !projectBody.querySelector('.listing-card-facts')) {
    projectName.after(createFacts([
      ['Локация', 'Сочи · Хоста'],
      ['Срок сдачи', 'IV кв. 2026'],
      ['Спальни', '1–4+'],
    ], 'project'));
  }
  projectItem.dataset.listingMode = 'new-build';

  const lotItem = projectItem.cloneNode(true);
  lotItem.dataset.listingMode = 'secondary';
  lotItem.hidden = true;
  const lotCard = lotItem.querySelector('.apartment-card');
  const lotImage = lotCard.querySelector('.apartment-card__image');
  const lotMediaLink = lotCard.querySelector('.apartment-card__media-link');
  const lotBody = lotCard.querySelector('.apartment-card__body');
  const lotDetailLink = lotCard.querySelector('.apartment-card__detail-btn');
  if (lotImage) {
    lotImage.src = '../shared/assets/presentation-v3/interior.webp';
    lotImage.alt = 'Светлая гостиная квартиры';
  }
  if (lotMediaLink) lotMediaLink.href = '#secondary-lot';
  if (lotDetailLink) lotDetailLink.href = '#secondary-lot';
  if (lotBody) {
    lotBody.replaceChildren();

    const address = document.createElement('p');
    address.className = 'apartment-card__address';
    address.setAttribute('data-v-80c326fb', '');
    address.textContent = 'Сочи · Курортный проспект';

    const name = document.createElement('a');
    name.className = 'apartment-card__name apartment-card__name--link';
    name.href = '#secondary-lot';
    name.setAttribute('data-v-80c326fb', '');
    const nameText = document.createElement('span');
    nameText.className = 'apartment-card__name-text';
    nameText.setAttribute('data-v-80c326fb', '');
    nameText.textContent = 'АПАРТАМЕНТЫ С ВИДОМ НА МОРЕ';
    name.append(nameText);

    const priceRow = document.createElement('div');
    priceRow.className = 'apartment-card__price-row listing-card-price-row';
    priceRow.setAttribute('data-v-80c326fb', '');
    const price = document.createElement('p');
    price.className = 'apartment-card__price';
    price.setAttribute('data-v-80c326fb', '');
    price.textContent = '32 000 000 ₽';
    const lotId = document.createElement('p');
    lotId.className = 'apartment-card__lotid';
    lotId.setAttribute('data-v-80c326fb', '');
    lotId.setAttribute('aria-label', 'ID объекта 384721');
    lotId.textContent = 'ID 384721';
    priceRow.append(price, lotId);

    lotBody.append(
      address,
      name,
      createFacts([
        ['Комнаты', '2'],
        ['Площадь', '54 м²'],
        ['Этаж', '7 из 12'],
      ], 'lot'),
      priceRow,
    );
  }
  list.append(lotItem);

  const toolbar = document.createElement('section');
  toolbar.className = 'catalog-mode-toolbar';
  toolbar.setAttribute('aria-label', 'Фильтры каталога');
  toolbar.innerHTML = `
    <div class="catalog-mode-switch" role="group" aria-label="Тип недвижимости">
      <button class="catalog-mode-switch__button is-active" type="button" data-listing-mode="new-build" aria-pressed="true">Новостройки</button>
      <button class="catalog-mode-switch__button" type="button" data-listing-mode="secondary" aria-pressed="false">Вторичка</button>
    </div>
    <div class="catalog-mode-filters catalog-quick-filters" data-v-6fd45cc6>
      <div class="catalog-quick-filters__item" data-v-6fd45cc6><button class="catalog-quick-filters__button" type="button" aria-expanded="false" aria-haspopup="true" data-v-6fd45cc6><span class="catalog-quick-filters__label" data-v-6fd45cc6>Цена ₽</span><span class="catalog-quick-filters__value" data-v-6fd45cc6>Не выбрано</span><span class="catalog-quick-filters__chevron" aria-hidden="true" data-v-6fd45cc6></span></button></div>
      <div class="catalog-quick-filters__item" data-v-6fd45cc6><button class="catalog-quick-filters__button" type="button" aria-expanded="false" aria-haspopup="true" data-v-6fd45cc6><span class="catalog-quick-filters__label" data-v-6fd45cc6>Локация</span><span class="catalog-quick-filters__value" data-v-6fd45cc6>Не выбрано</span><span class="catalog-quick-filters__chevron" aria-hidden="true" data-v-6fd45cc6></span></button></div>
      <div class="catalog-quick-filters__item" data-v-6fd45cc6><button class="catalog-quick-filters__button" type="button" aria-expanded="false" aria-haspopup="true" data-v-6fd45cc6><span class="catalog-quick-filters__label" data-v-6fd45cc6>Площадь</span><span class="catalog-quick-filters__value" data-v-6fd45cc6>Не выбрано</span><span class="catalog-quick-filters__chevron" aria-hidden="true" data-v-6fd45cc6></span></button></div>
      <div class="catalog-quick-filters__item" data-v-6fd45cc6><button class="catalog-quick-filters__button" type="button" aria-expanded="false" aria-haspopup="true" data-v-6fd45cc6><span class="catalog-quick-filters__label" data-v-6fd45cc6>Спальни</span><span class="catalog-quick-filters__value" data-v-6fd45cc6>Не выбрано</span><span class="catalog-quick-filters__chevron" aria-hidden="true" data-v-6fd45cc6></span></button></div>
      <div class="catalog-quick-filters__item" data-v-6fd45cc6><button class="catalog-quick-filters__button" type="button" aria-expanded="false" aria-haspopup="true" data-v-6fd45cc6><span class="catalog-quick-filters__label" data-v-6fd45cc6>Срок сдачи</span><span class="catalog-quick-filters__value" data-v-6fd45cc6>Не выбрано</span><span class="catalog-quick-filters__chevron" aria-hidden="true" data-v-6fd45cc6></span></button></div>
    </div>`;
  toolbar.append(sort);
  header.after(toolbar);

  const modeButtons = toolbar.querySelectorAll('[data-listing-mode]');
  modeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const mode = button.dataset.listingMode;
      modeButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      projectItem.hidden = mode !== 'new-build';
      lotItem.hidden = mode !== 'secondary';
    });
  });
}());
