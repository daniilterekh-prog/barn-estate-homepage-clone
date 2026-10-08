(function () {
  if (!document.querySelector('link[data-kurortnaya-ui-kit]')) {
    var stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = 'ui-kit.css';
    stylesheet.dataset.kurortnayaUiKit = 'true';
    document.head.appendChild(stylesheet);
  }

  if (!document.querySelector('link[data-kurortnaya-listing-mode]')) {
    var listingStylesheet = document.createElement('link');
    listingStylesheet.rel = 'stylesheet';
    listingStylesheet.href = 'listing-mode.css?v=20261009-filter-type-16';
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

  document.querySelectorAll('input[placeholder]:not([aria-label]), textarea[placeholder]:not([aria-label])')
    .forEach(function (control) {
      control.setAttribute('aria-label', control.getAttribute('placeholder'));
    });

  if (!document.querySelector('script[data-kurortnaya-listing-mode]')) {
    var listingScript = document.createElement('script');
    listingScript.src = 'listing-mode.js?v=20261009-filter-type-16';
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
