/* Same Ruslan portrait as Media; wait for preserved page hydration. */
(() => {
  const portrait = new URL('assets/ludmila-belousova-color-hq-avatar.webp', document.currentScript.src).href;
  function update() {
    for (const image of document.querySelectorAll('.floating-expert__avatar img')) {
      if (image.src !== portrait) {
        image.removeAttribute('srcset'); image.src = portrait;
        image.width = 1086; image.height = 1448; image.loading = 'eager';
      }
      if (image.alt !== 'Людмила Белоусова') image.alt = 'Людмила Белоусова';
      const card = image.closest('.floating-expert');
      for (const [selector, text] of [['.floating-expert__name', 'Людмила Белоусова'], ['.floating-expert__label', 'Руководитель филиала BARN Estate в Санкт-Петербурге']]) {
        const label = card?.querySelector(selector);
        if (label && label.textContent.replace(/\s+/g, ' ') !== text) label.textContent = text;
      }
      if (card && card.getAttribute('aria-label') !== 'Людмила Белоусова') card.setAttribute('aria-label', 'Людмила Белоусова');
      const close = card?.querySelector('.floating-expert__close');
      if (close && close.getAttribute('aria-label') !== 'Скрыть карточку Людмила Белоусова') close.setAttribute('aria-label', 'Скрыть карточку Людмила Белоусова');
    }
  }
  update(); new MutationObserver(update).observe(document.documentElement, {childList:true,subtree:true});
})();
