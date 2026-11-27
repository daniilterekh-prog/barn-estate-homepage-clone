/* User-supplied Elena portrait, isolated to the country owner page. */
(() => {
  const portrait = new URL('../assets/expert-avatar-square.webp', document.currentScript.src).href;
  function update() {
    for (const image of document.querySelectorAll('.floating-expert__avatar img')) {
      if (image.src !== portrait) {
        image.removeAttribute('srcset'); image.src = portrait;
        image.width = 640; image.height = 640; image.loading = 'eager';
      }
      if (image.alt !== 'Елена Валерьевна Картавцева') image.alt = 'Елена Валерьевна Картавцева';
      const card = image.closest('.floating-expert');
      for (const [selector, text] of [['.floating-expert__name', 'Елена Валерьевна Картавцева'], ['.floating-expert__label', 'Руководитель департамента загородной недвижимости BARN Estate']]) {
        const label = card?.querySelector(selector);
        if (label && label.textContent.replace(/\s+/g, ' ') !== text) label.textContent = text;
      }
      if (card && card.getAttribute('aria-label') !== 'Елена Валерьевна Картавцева') card.setAttribute('aria-label', 'Елена Валерьевна Картавцева');
      const close = card?.querySelector('.floating-expert__close');
      if (close && close.getAttribute('aria-label') !== 'Скрыть карточку Елена Валерьевна Картавцева') close.setAttribute('aria-label', 'Скрыть карточку Елена Валерьевна Картавцева');
    }
  }
  update(); new MutationObserver(update).observe(document.documentElement, {childList:true,subtree:true});
})();
