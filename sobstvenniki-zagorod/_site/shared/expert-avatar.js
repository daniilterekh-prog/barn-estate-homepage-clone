/* Same Ruslan portrait as Media; wait for preserved page hydration. */
(() => {
  const portrait = new URL('../../assets/mikhail-dolgov.jpg', document.currentScript.src).href;
  function update() {
    for (const image of document.querySelectorAll('.floating-expert__avatar img')) {
      if (image.src !== portrait) {
        image.removeAttribute('srcset'); image.src = portrait;
        image.width = 1086; image.height = 1448; image.loading = 'eager';
      }
      if (image.alt !== 'Михаил Долгов') image.alt = 'Михаил Долгов';
      const card = image.closest('.floating-expert');
      for (const [selector, text] of [['.floating-expert__name', 'Михаил Долгов'], ['.floating-expert__label', 'Руководитель департамента загородной недвижимости']]) {
        const label = card?.querySelector(selector);
        if (label && label.textContent !== text) label.textContent = text;
      }
      if (card && card.getAttribute('aria-label') !== 'Михаил Долгов') card.setAttribute('aria-label', 'Михаил Долгов');
      const close = card?.querySelector('.floating-expert__close');
      if (close && close.getAttribute('aria-label') !== 'Скрыть карточку Михаил Долгов') close.setAttribute('aria-label', 'Скрыть карточку Михаил Долгов');
    }
  }
  update(); new MutationObserver(update).observe(document.documentElement, {childList:true,subtree:true});
})();
