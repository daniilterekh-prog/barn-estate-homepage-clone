(function () {
  if (!document.querySelector('link[data-kurortnaya-ui-kit]')) {
    var stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = 'ui-kit.css?v=20261009-ui-contracts-2';
    stylesheet.dataset.kurortnayaUiKit = 'true';
    document.head.appendChild(stylesheet);
  }

  if (!document.querySelector('link[data-kurortnaya-listing-mode]')) {
    var listingStylesheet = document.createElement('link');
    listingStylesheet.rel = 'stylesheet';
    listingStylesheet.href = 'listing-mode.css?v=20261009-ui-contracts-3';
    listingStylesheet.dataset.kurortnayaListingMode = 'true';
    document.head.appendChild(listingStylesheet);
  }

  if (!document.querySelector('link[data-kurortnaya-start-sales]')) {
    var startSalesStylesheet = document.createElement('link');
    startSalesStylesheet.rel = 'stylesheet';
    startSalesStylesheet.href = 'start-sales-cards.css?v=20261009-original-slider-4';
    startSalesStylesheet.dataset.kurortnayaStartSales = 'true';
    document.head.appendChild(startSalesStylesheet);
  }

  function addExplicitLabel(control, id) {
    if (!control) return;

    var existingLabel = control.closest('label');
    if (existingLabel) {
      if (!existingLabel.querySelector('.catalog-field-label')) {
        var hiddenText = document.createElement('span');
        hiddenText.className = 'visually-hidden catalog-field-label';
        hiddenText.textContent = control.getAttribute('placeholder') || 'Поле формы';
        existingLabel.insertBefore(hiddenText, control);
      }
      control.removeAttribute('aria-label');
      return;
    }

    if (control.labels.length) return;

    control.id = control.id || id;
    var label = document.createElement('label');
    label.className = 'visually-hidden';
    label.htmlFor = control.id;
    label.textContent = control.getAttribute('placeholder') || 'Поле формы';
    control.parentNode.insertBefore(label, control);
    control.removeAttribute('aria-label');
  }

  [
    ['.catalog-consultation__input[placeholder*="имя"]', 'catalog-consultation-name'],
    ['.catalog-consultation__input[placeholder*="телефон"]', 'catalog-consultation-phone'],
    ['.catalog-consultation__textarea', 'catalog-consultation-comment'],
    ['.catalog-contact__input[placeholder*="имя"]', 'catalog-contact-name'],
    ['.catalog-contact__input[placeholder*="телефон"]', 'catalog-contact-phone'],
    ['.catalog-contact__textarea', 'catalog-contact-comment']
  ].forEach(function (entry) {
    addExplicitLabel(document.querySelector(entry[0]), entry[1]);
  });

  document.querySelectorAll('input[placeholder]:not([aria-label]), textarea[placeholder]:not([aria-label])')
    .forEach(function (control) {
      if (!control.labels.length) {
        control.setAttribute('aria-label', control.getAttribute('placeholder'));
      }
    });

  var introDetails = document.querySelector('.catalog-intro__details');
  if (introDetails) {
    Array.from(introDetails.querySelectorAll('h3')).forEach(function (heading) {
      var replacement = document.createElement('h4');
      Array.from(heading.attributes).forEach(function (attribute) {
        replacement.setAttribute(attribute.name, attribute.value);
      });
      replacement.innerHTML = heading.innerHTML;
      heading.replaceWith(replacement);
    });

    Array.from(introDetails.querySelectorAll('h2')).forEach(function (heading) {
      var replacement = document.createElement('h3');
      Array.from(heading.attributes).forEach(function (attribute) {
        replacement.setAttribute(attribute.name, attribute.value);
      });
      replacement.innerHTML = heading.innerHTML;
      heading.replaceWith(replacement);
    });
  }

  var catalogIntroImage = document.querySelector('#catalog-intro img');
  if (catalogIntroImage) {
    catalogIntroImage.src = 'assets/barnes-moscow-residence-v4.webp';
    catalogIntroImage.removeAttribute('srcset');
    catalogIntroImage.width = 1448;
    catalogIntroImage.height = 1086;
    catalogIntroImage.alt = 'Современная курортная резиденция';
  }

  var catalogContactImage = document.querySelector('.catalog-contact__image');
  if (catalogContactImage) {
    catalogContactImage.src = 'assets/cta-contact-resort-lounge.webp';
    catalogContactImage.removeAttribute('srcset');
    catalogContactImage.alt = '';
    catalogContactImage.width = 1536;
    catalogContactImage.height = 1024;
  }

  var denisImageSource = 'assets/denis-perkovsky-interior-hq.webp';
  var denisCutoutSource = 'assets/denis-perkovsky-cutout.png';
  var consultationPortrait = document.querySelector('.catalog-consultation__image');
  if (consultationPortrait) {
    consultationPortrait.src = denisCutoutSource;
    consultationPortrait.removeAttribute('srcset');
    consultationPortrait.alt = '';
    consultationPortrait.width = 1024;
    consultationPortrait.height = 1536;
  }

  document.querySelectorAll([
    '.catalog-consultation__mobile-photo img',
    '.catalog-contact__mobile-photo img',
    '.catalog-contact__expert-photo img',
    '.floating-expert__avatar img'
  ].join(', ')).forEach(function (image) {
    image.src = denisImageSource;
    image.removeAttribute('srcset');
    image.alt = 'Денис Перковский';
    image.width = 2048;
    image.height = 3072;
  });

  if (!document.querySelector('script[data-kurortnaya-listing-mode]')) {
    var listingScript = document.createElement('script');
    listingScript.src = 'listing-mode.js?v=20261009-ui-contracts-1';
    listingScript.dataset.kurortnayaListingMode = 'true';
    document.body.appendChild(listingScript);
  }

  if (!document.querySelector('script[data-kurortnaya-start-sales]')) {
    var startSalesScript = document.createElement('script');
    startSalesScript.src = 'start-sales-cards.js?v=20261009-original-slider-4';
    startSalesScript.dataset.kurortnayaStartSales = 'true';
    document.body.appendChild(startSalesScript);
  }
}());
