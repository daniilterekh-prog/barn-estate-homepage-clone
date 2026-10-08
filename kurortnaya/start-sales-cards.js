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
      priceRow.appendChild(region);
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
    var slider = section.querySelector('#splide01');
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

    var currentIndex = Math.max(0, originals.findIndex(function (slide) {
      return slide.classList.contains('is-active');
    }));
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var mobileQuery = window.matchMedia('(max-width: 540px)');
    var previousButton = section.querySelector('.catalog-best-offers__nav-btn--prev');
    var nextButton = section.querySelector('.catalog-best-offers__nav-btn--next');
    var paginationButtons = Array.prototype.slice.call(slider.querySelectorAll('.splide__pagination__page'));
    var pointerStartX = null;
    slider.classList.add('start-sales-carousel-ready');

    function updatePagination() {
      paginationButtons.forEach(function (button, index) {
        var selected = index === currentIndex;
        button.classList.toggle('is-active', selected);
        button.setAttribute('aria-selected', String(selected));
        button.tabIndex = selected ? 0 : -1;
      });
    }

    function render(animate) {
      var isMobile = mobileQuery.matches;
      slides.forEach(function (slide) {
        slide.classList.remove('is-active', 'is-prev', 'is-next', 'is-visible');
        slide.setAttribute('aria-hidden', 'true');
      });

      if (isMobile) {
        var mobileStep = track.clientWidth;
        list.style.transition = animate && !reducedMotion ? 'transform 420ms cubic-bezier(.22,1,.36,1)' : 'none';
        list.style.transform = 'translateX(' + (-currentIndex * mobileStep) + 'px)';
        originals[currentIndex].classList.add('is-active', 'is-visible');
        originals[currentIndex].removeAttribute('aria-hidden');
      } else {
        var firstSlide = slides[0];
        var slideStyle = window.getComputedStyle(firstSlide);
        var step = firstSlide.getBoundingClientRect().width + parseFloat(slideStyle.marginRight || '0');
        var firstOriginalIndex = slides.indexOf(originals[0]);
        var leftIndex = firstOriginalIndex - 1 + currentIndex;
        var centerIndex = firstOriginalIndex + currentIndex;
        var rightIndex = firstOriginalIndex + 1 + currentIndex;
        list.style.transition = animate && !reducedMotion ? 'transform 520ms cubic-bezier(.22,1,.36,1)' : 'none';
        list.style.transform = 'translateX(' + (-leftIndex * step) + 'px)';

        if (slides[leftIndex]) {
          slides[leftIndex].classList.add('is-prev', 'is-visible');
          slides[leftIndex].removeAttribute('aria-hidden');
        }
        if (slides[centerIndex]) {
          slides[centerIndex].classList.add('is-active', 'is-visible');
          slides[centerIndex].removeAttribute('aria-hidden');
        }
        if (slides[rightIndex]) {
          slides[rightIndex].classList.add('is-next', 'is-visible');
          slides[rightIndex].removeAttribute('aria-hidden');
        }
      }

      updatePagination();
      syncSlideTabStops();
    }

    function move(direction) {
      currentIndex = (currentIndex + direction + originals.length) % originals.length;
      render(true);
    }

    previousButton && previousButton.addEventListener('click', function () { move(-1); });
    nextButton && nextButton.addEventListener('click', function () { move(1); });
    paginationButtons.forEach(function (button, index) {
      button.addEventListener('click', function () {
        currentIndex = index;
        render(true);
      });
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
      resizeFrame = window.requestAnimationFrame(function () { render(false); });
    }, { passive: true });

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
