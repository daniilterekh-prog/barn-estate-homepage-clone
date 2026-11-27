/* User-selected square Alina portrait for this page-local floating widget. */
(() => {
  const portrait = new URL('../assets/alina-floating-avatar.webp', document.currentScript.src).href;
  function update() {
    for (const image of document.querySelectorAll('.floating-expert__avatar img')) {
      if (image.src !== portrait) {
        image.removeAttribute('srcset'); image.src = portrait;
        image.width = 640; image.height = 640; image.loading = 'eager';
      }
      if (image.alt !== 'Алина Медведева') image.alt = 'Алина Медведева';
      const card = image.closest('.floating-expert');
      for (const [selector, text] of [['.floating-expert__name', 'Алина Медведева'], ['.floating-expert__label', 'Эксперт по коммерческой недвижимости']]) {
        const label = card?.querySelector(selector);
        if (label && label.textContent !== text) label.textContent = text;
      }
      if (card && card.getAttribute('aria-label') !== 'Алина Медведева') card.setAttribute('aria-label', 'Алина Медведева');
      const close = card?.querySelector('.floating-expert__close');
      if (close && close.getAttribute('aria-label') !== 'Скрыть карточку Алина Медведева') close.setAttribute('aria-label', 'Скрыть карточку Алина Медведева');
    }
  }
  update(); new MutationObserver(update).observe(document.documentElement, {childList:true,subtree:true});
})();
