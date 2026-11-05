/* Selection block from Kurortnaya, populated only from the first 3 commercial lots. */
(() => {
  const listing = document.querySelector('.catalog-grid__list');
  const map = document.querySelector('.catalog-map');
  if (!listing || !map || document.getElementById('commercial-selection')) return;
  const lots = [...listing.querySelectorAll(':scope > .catalog-grid__item')].slice(0, 3);
  if (lots.length !== 3) return;
  const template = document.createElement('template');
  template.innerHTML = "<section class=\"catalog-best-offers\" aria-label=\"Выбор BARN Estate\" data-v-f0be9abb=\"\" data-v-08286baa=\"\" id=\"commercial-selection\"><div class=\"catalog-best-offers__container base-container\" data-v-08286baa=\"\"><header class=\"catalog-best-offers__header\" data-v-08286baa=\"\"><p class=\"catalog-section-eyebrow\">Избранные предложения</p><h2 class=\"catalog-best-offers__title\" data-v-08286baa=\"\">Выбор BARN Estate</h2></header></div><div class=\"catalog-best-offers__slider-row\" data-v-08286baa=\"\"><button type=\"button\" class=\"catalog-best-offers__nav-btn catalog-best-offers__nav-btn--prev\" aria-label=\"Предыдущий проект\" data-v-08286baa=\"\"><span class=\"ui-icon ui-icon-current catalog-best-offers__nav-icon\" data-v-08286baa=\"\" data-v-8bd2f545=\"\"><svg width=\"11\" height=\"22\" viewBox=\"0 0 11 22\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M9.6582 21.3262L0.658204 10.8262L9.6582 0.326171\" stroke=\"#656462\"></path>\n</svg>\n</span></button><div class=\"catalog-best-offers__slider-wrap\" data-v-08286baa=\"\"><div data-v-08286baa=\"\" class=\"splide catalog-best-offers__slider is-overflow is-initialized splide--loop splide--ltr splide--draggable is-active\" aria-label=\"Выбор BARN Estate — коммерческая недвижимость\" id=\"commercial-selection-slider\" role=\"region\" aria-roledescription=\"carousel\"><div class=\"splide__track splide__track--loop splide__track--ltr splide__track--draggable\" id=\"commercial-selection-track\" aria-live=\"polite\" aria-atomic=\"true\"><ul class=\"splide__list\" id=\"commercial-selection-list\" role=\"presentation\"></ul></div></div></div><button type=\"button\" class=\"catalog-best-offers__nav-btn catalog-best-offers__nav-btn--next\" aria-label=\"Следующий проект\" data-v-08286baa=\"\"><span class=\"ui-icon ui-icon-current catalog-best-offers__nav-icon\" data-v-08286baa=\"\" data-v-8bd2f545=\"\"><svg width=\"11\" height=\"22\" viewBox=\"0 0 11 22\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M0.379883 21.3262L9.37988 10.8262L0.379884 0.326171\" stroke=\"#656462\"></path>\n</svg>\n</span></button></div></section>";
  const section = template.content.firstElementChild;
  // Splide's original inline horizontal padding is part of its centering.
  section.querySelector('.splide__track').style.paddingInline = '0px';
  const list = section.querySelector('.splide__list');
  const element = (tag, cls, text) => {
    const node = document.createElement(tag);
    node.className = cls;
    node.setAttribute('data-v-80c326fb', '');
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const slides = lots.map((lot, index) => {
    const source = lot.querySelector('.apartment-card');
    const slide = element('li', 'splide__slide' + (index === 0 ? ' is-active' : ''));
    slide.setAttribute('data-v-08286baa', '');
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', (index + 1) + ' of 3');
    slide.id = 'commercial-selection-slide-' + (index + 1);
    const card = element('article', 'apartment-card');
    const link = element('a', 'apartment-card__link');
    link.href = source.querySelector('.apartment-card__media-link').href;
    const media = element('div', 'apartment-card__media');
    const image = source.querySelector('.apartment-card__image').cloneNode(true);
    image.loading = 'eager';
    media.append(image);
    const body = element('div', 'apartment-card__body');
    const address = element('p', 'apartment-card__address', source.querySelector('.apartment-card__address')?.textContent.trim() || '');
    const name = element('p', 'apartment-card__name', source.querySelector('.apartment-card__name-text').textContent.trim());
    const details = element('div', 'apartment-card__details');
    const priceRow = element('div', 'apartment-card__price-row');
    priceRow.append(element('p', 'apartment-card__price', source.querySelector('.apartment-card__price').textContent.trim()));
    details.append(priceRow); body.append(address, name, details);
    link.append(media, body); card.append(link); slide.append(card);
    return slide;
  });
  const clones = suffix => slides.map((slide, index) => {
    const clone = slide.cloneNode(true);
    clone.id = 'commercial-selection-' + suffix + '-' + index;
    clone.classList.add('splide__slide--clone');
    clone.setAttribute('aria-hidden', 'true');
    return clone;
  });
  list.append(...clones('before'), ...slides, ...clones('after'));
  map.before(section);
})();
/* COMMON RECOMMENDATIONS LOADER */
(()=>{const s=document.createElement('script');s.src=new URL('../node-recommendations.js?v=14df14abeab1',document.currentScript.src);document.body.append(s);})();
