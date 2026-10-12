
(function () {
  function startRuntime() {
    var uiKitRuntime = document.createElement('script');
    uiKitRuntime.src = 'js/ui-kit-runtime.js?v=20261012-hero-baked-dark-1';
    document.body.appendChild(uiKitRuntime);
  }
  // document.open replaces DOM/listeners but retains window.BarnesFilters.
  // Never initialize controls on the desktop document before a mobile swap.
  if (!window.matchMedia('(max-width: 540px)').matches) {
    startRuntime();
    return;
  }
  fetch('mobile.html', { cache: 'no-store' })
    .then(function (response) {
      if (!response.ok) throw new Error('Mobile snapshot unavailable');
      return response.text();
    })
    .then(function (markup) {
      markup = markup.replace('</body>', '<script src="js/ui-kit-runtime.js?v=20261012-hero-baked-dark-1"><\/script></body>');
      document.open();
      document.write(markup);
      document.close();
      history.replaceState(null, '', './');
    })
    .catch(function () {
      document.documentElement.classList.add('mobile-snapshot-fallback');
      startRuntime();
    });
}());
