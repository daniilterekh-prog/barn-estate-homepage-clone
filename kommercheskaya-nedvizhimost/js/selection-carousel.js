/* Selection block from Kurortnaya, populated only from the first 3 commercial lots. */
(() => {
  const listing = document.querySelector('.catalog-grid__list');
  const map = document.querySelector('.catalog-map');
  if (!listing || !map || document.getElementById('commercial-selection')) return;
  const lots = [...listing.querySelectorAll(':scope > .catalog-grid__item')].slice(0, 3);
  if (lots.length !== 3) return;
  const template = document.createElement('template');
  template.innerHTML = "<section class=\"catalog-best-offers\" aria-label=\"Выбор BARNES\" data-v-f0be9abb=\"\" data-v-08286baa=\"\" id=\"commercial-selection\"><div class=\"catalog-best-offers__container base-container\" data-v-08286baa=\"\"><header class=\"catalog-best-offers__header\" data-v-08286baa=\"\"><p class=\"catalog-section-eyebrow\">Избранные предложения</p><h2 class=\"catalog-best-offers__title\" data-v-08286baa=\"\">Выбор BARNES</h2></header></div><div class=\"catalog-best-offers__slider-row\" data-v-08286baa=\"\"><button type=\"button\" class=\"catalog-best-offers__nav-btn catalog-best-offers__nav-btn--prev\" aria-label=\"Предыдущий проект\" data-v-08286baa=\"\"><span class=\"ui-icon ui-icon-current catalog-best-offers__nav-icon\" data-v-08286baa=\"\" data-v-8bd2f545=\"\"><svg width=\"11\" height=\"22\" viewBox=\"0 0 11 22\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M9.6582 21.3262L0.658204 10.8262L9.6582 0.326171\" stroke=\"#656462\"></path>\n</svg>\n</span></button><div class=\"catalog-best-offers__slider-wrap\" data-v-08286baa=\"\"><div data-v-08286baa=\"\" class=\"splide catalog-best-offers__slider is-overflow is-initialized splide--loop splide--ltr splide--draggable is-active\" aria-label=\"Выбор BARNES — коммерческая недвижимость\" id=\"commercial-selection-slider\" role=\"region\" aria-roledescription=\"carousel\"><div class=\"splide__track splide__track--loop splide__track--ltr splide__track--draggable\" id=\"commercial-selection-track\" aria-live=\"polite\" aria-atomic=\"true\"><ul class=\"splide__list\" id=\"commercial-selection-list\" role=\"presentation\"></ul></div></div></div><button type=\"button\" class=\"catalog-best-offers__nav-btn catalog-best-offers__nav-btn--next\" aria-label=\"Следующий проект\" data-v-08286baa=\"\"><span class=\"ui-icon ui-icon-current catalog-best-offers__nav-icon\" data-v-08286baa=\"\" data-v-8bd2f545=\"\"><svg width=\"11\" height=\"22\" viewBox=\"0 0 11 22\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M0.379883 21.3262L9.37988 10.8262L0.379884 0.326171\" stroke=\"#656462\"></path>\n</svg>\n</span></button></div></section>";
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
(function () {
  var section = document.querySelector('.catalog-best-offers');
  if (!section) return;

  var favoriteStorageKey = 'barnes-start-sales-favorites';

  function readFavorites() {
    try {
      return JSON.parse(window.localStorage.getItem(favoriteStorageKey) || '[]');
    } catch (error) {
      return [];
    }
  }

  function writeFavorites(items) {
    try {
      window.localStorage.setItem(favoriteStorageKey, JSON.stringify(items));
    } catch (error) {
      // The control remains usable for the current document if storage is unavailable.
    }
  }

  function normalizedProjectKey(link) {
    try {
      return new URL(link.href, window.location.href).pathname.replace(/\/$/, '');
    } catch (error) {
      return link.getAttribute('href') || '';
    }
  }

  function favoriteIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function syncFavoriteButtons(projectKey, pressed) {
    section.querySelectorAll('.launch-card__favorite').forEach(function (button) {
      if (button.dataset.projectKey !== projectKey) return;
      button.setAttribute('aria-pressed', String(pressed));
      var projectName = button.dataset.projectName || 'проект';
      button.setAttribute('aria-label', (pressed ? 'Удалить ' : 'Добавить ') + projectName + (pressed ? ' из избранного' : ' в избранное'));
    });
  }

  function buildFavorite(card, link, projectName) {
    var projectKey = normalizedProjectKey(link);
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'launch-card__favorite';
    button.dataset.projectKey = projectKey;
    button.dataset.projectName = projectName;
    button.innerHTML = favoriteIcon();
    button.addEventListener('click', function () {
      var favorites = readFavorites();
      var isFavorite = favorites.indexOf(projectKey) !== -1;
      favorites = isFavorite
        ? favorites.filter(function (item) { return item !== projectKey; })
        : favorites.concat(projectKey);
      writeFavorites(favorites);
      syncFavoriteButtons(projectKey, !isFavorite);
    });
    card.appendChild(button);
    syncFavoriteButtons(projectKey, readFavorites().indexOf(projectKey) !== -1);
  }

  function enhanceCard(card) {
    if (card.classList.contains('launch-card')) return;

    var link = card.querySelector('.apartment-card__link');
    var name = card.querySelector('.apartment-card__name');
    var region = card.querySelector('.apartment-card__address');
    var priceRow = card.querySelector('.apartment-card__price-row');
    var image = card.querySelector('.apartment-card__image');
    if (!link || !name || !priceRow || !image) return;

    card.classList.add('launch-card');
    link.setAttribute('aria-label', name.textContent.trim());

    if (region && region.textContent.trim()) {
      region.classList.add('launch-card__region');
      region.insertAdjacentHTML('afterbegin', '<svg class="launch-card__region-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M8 14s4.5-4.35 4.5-8A4.5 4.5 0 0 0 3.5 6c0 3.65 4.5 8 4.5 8Z"/><circle cx="8" cy="6" r="1.65"/></svg>');
      name.parentNode.insertBefore(region, name);
    }

    image.addEventListener('error', function () {
      card.classList.add('launch-card--image-error');
    }, { once: true });

    buildFavorite(card, link, name.textContent.trim());
  }

  function syncSlideTabStops() {
    section.querySelectorAll('.splide__slide').forEach(function (slide) {
      var hidden = slide.getAttribute('aria-hidden') === 'true';
      var cloned = slide.classList.contains('splide__slide--clone');
      slide.querySelectorAll('.apartment-card__link, .launch-card__favorite').forEach(function (control) {
        if (hidden || cloned) {
          control.setAttribute('tabindex', '-1');
        } else {
          control.removeAttribute('tabindex');
        }
      });
    });
  }

  function initializeCarousel() {
    var slider = section.querySelector('#commercial-selection-slider');
    var track = slider && slider.querySelector('.splide__track');
    var list = slider && slider.querySelector('.splide__list');
    if (!slider || !track || !list) return;

    var slides = Array.prototype.slice.call(list.children).filter(function (item) {
      return item.classList.contains('splide__slide');
    });
    var originals = slides.filter(function (slide) {
      return !slide.classList.contains('splide__slide--clone');
    });
    if (!originals.length) return;

    var firstOriginalIndex = slides.indexOf(originals[0]);
    var lastOriginalIndex = firstOriginalIndex + originals.length - 1;
    var activeOriginalIndex = originals.findIndex(function (slide) {
      return slide.classList.contains('is-active');
    });
    var centerIndex = firstOriginalIndex + Math.max(0, activeOriginalIndex);
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var mobileQuery = window.matchMedia('(max-width: 540px)');
    var previousButton = section.querySelector('.catalog-best-offers__nav-btn--prev');
    var nextButton = section.querySelector('.catalog-best-offers__nav-btn--next');
    var pagination = slider.querySelector('.splide__pagination');
    var paginationButtons = [];
    var pointerStartX = null;
    var resetTimer = 0;

    function logicalIndex() {
      return ((centerIndex - firstOriginalIndex) % originals.length + originals.length) % originals.length;
    }

    function ensurePagination() {
      if (!pagination) {
        pagination = document.createElement('ul');
        pagination.className = 'splide__pagination';
        pagination.setAttribute('role', 'tablist');
        pagination.setAttribute('aria-label', 'Выбор проекта');
        originals.forEach(function (_, index) {
          var item = document.createElement('li');
          item.setAttribute('role', 'presentation');
          var button = document.createElement('button');
          button.type = 'button';
          button.className = 'splide__pagination__page';
          button.setAttribute('role', 'tab');
          button.setAttribute('aria-label', 'Перейти к проекту ' + (index + 1));
          item.appendChild(button);
          pagination.appendChild(item);
        });
        slider.appendChild(pagination);
      }
      paginationButtons = Array.prototype.slice.call(pagination.querySelectorAll('.splide__pagination__page'));
      paginationButtons.forEach(function (button, index) {
        if (button.dataset.startSalesBound === 'true') return;
        button.dataset.startSalesBound = 'true';
        button.addEventListener('click', function () {
          window.clearTimeout(resetTimer);
          centerIndex = firstOriginalIndex + index;
          render(true);
        });
      });
    }

    function updatePagination() {
      var current = logicalIndex();
      paginationButtons.forEach(function (button, index) {
        var selected = index === current;
        button.classList.toggle('is-active', selected);
        button.setAttribute('aria-selected', String(selected));
        button.tabIndex = selected ? 0 : -1;
      });
    }

    function setLogicalActive(current) {
      var labelPrefix = (current + 1) + ' of ';
      slides.forEach(function (slide) {
        var label = slide.getAttribute('aria-label') || '';
        slide.classList.toggle('is-active', label.indexOf(labelPrefix) === 0);
      });
    }

    function setSlideStates() {
      var current = logicalIndex();
      slides.forEach(function (slide) {
        slide.classList.remove('is-prev', 'is-next', 'is-visible');
        slide.setAttribute('aria-hidden', 'true');
      });
      setLogicalActive(current);

      if (mobileQuery.matches) {
        var mobileSlide = slides[centerIndex];
        mobileSlide.classList.add('is-visible');
        mobileSlide.removeAttribute('aria-hidden');
        return;
      }

      var previousSlide = slides[centerIndex - 1];
      var activeSlide = slides[centerIndex];
      var nextSlide = slides[centerIndex + 1];
      if (previousSlide) {
        previousSlide.classList.add('is-prev', 'is-visible');
        previousSlide.removeAttribute('aria-hidden');
      }
      if (activeSlide) {
        activeSlide.classList.add('is-visible');
        activeSlide.removeAttribute('aria-hidden');
      }
      if (nextSlide) {
        nextSlide.classList.add('is-next', 'is-visible');
        nextSlide.removeAttribute('aria-hidden');
      }
    }

    function updateGeometry(animate) {
      var wrap = slider.closest('.catalog-best-offers__slider-wrap');
      var gap = mobileQuery.matches ? 0 : parseFloat(window.getComputedStyle(wrap).getPropertyValue('--catalog-best-offers-gap')) || 0;
      slides.forEach(function (slide) {
        slide.style.marginRight = gap + 'px';
      });

      var step = mobileQuery.matches
        ? track.getBoundingClientRect().width
        : slides[centerIndex].getBoundingClientRect().width + gap;
      var offsetIndex = mobileQuery.matches ? centerIndex : centerIndex - 1;
      list.style.transition = animate && !reducedMotion
        ? 'transform 700ms cubic-bezier(.22,1,.36,1)'
        : 'none';
      list.style.transform = 'translateX(' + (-offsetIndex * step) + 'px)';
    }

    function render(animate) {
      setSlideStates();
      updateGeometry(animate);
      updatePagination();
      syncSlideTabStops();
    }

    function normalizeLoopIndex() {
      if (centerIndex > lastOriginalIndex) {
        centerIndex = firstOriginalIndex + (centerIndex - lastOriginalIndex - 1);
      } else if (centerIndex < firstOriginalIndex) {
        centerIndex = lastOriginalIndex - (firstOriginalIndex - centerIndex - 1);
      }
    }

    function normalizeLoopPosition() {
      normalizeLoopIndex();
      render(false);
    }

    function move(direction) {
      window.clearTimeout(resetTimer);
      normalizeLoopIndex();
      centerIndex += direction;
      render(true);
      resetTimer = window.setTimeout(normalizeLoopPosition, reducedMotion ? 0 : 720);
    }

    previousButton && previousButton.addEventListener('click', function () { move(-1); });
    nextButton && nextButton.addEventListener('click', function () { move(1); });

    slider.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        move(-1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        move(1);
      }
    });

    track.addEventListener('pointerdown', function (event) {
      if (event.target.closest('.launch-card__favorite')) return;
      pointerStartX = event.clientX;
    });
    track.addEventListener('pointerup', function (event) {
      if (pointerStartX === null) return;
      var distance = event.clientX - pointerStartX;
      pointerStartX = null;
      if (Math.abs(distance) > 40) move(distance < 0 ? 1 : -1);
    });
    track.addEventListener('pointercancel', function () { pointerStartX = null; });

    var resizeFrame = 0;
    window.addEventListener('resize', function () {
      window.cancelAnimationFrame(resizeFrame);
      window.clearTimeout(resetTimer);
      resizeFrame = window.requestAnimationFrame(function () {
        normalizeLoopIndex();
        render(false);
        // Source slide widths animate across breakpoints; settle the offset
        // once those widths finish, rather than keep an intermediate value.
        resetTimer = window.setTimeout(function () { render(false); }, reducedMotion ? 0 : 720);
      });
    }, { passive: true });

    ensurePagination();
    render(false);
  }

  section.querySelectorAll('.apartment-card').forEach(enhanceCard);
  initializeCarousel();
  syncSlideTabStops();

  new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (!(node instanceof Element)) return;
        if (node.matches('.apartment-card')) enhanceCard(node);
        node.querySelectorAll('.apartment-card').forEach(enhanceCard);
      });
    });
    syncSlideTabStops();
  }).observe(section, {
    attributes: true,
    childList: true,
    subtree: true,
    attributeFilter: ['aria-hidden']
  });
}());
