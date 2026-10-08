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

  section.querySelectorAll('.apartment-card').forEach(enhanceCard);
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
