/* Same Ruslan portrait as Media; wait for preserved page hydration. */
(() => {
  const portrait = new URL('../assets/shared/ruslan-floating-media.webp', document.currentScript.src).href;
  function update() {
    for (const image of document.querySelectorAll('.floating-expert__avatar img')) {
      if (image.src !== portrait) {
        image.removeAttribute('srcset'); image.src = portrait;
        image.width = 1086; image.height = 1448; image.loading = 'eager';
      }
      if (image.alt !== 'Руслан Прус') image.alt = 'Руслан Прус';
      const card = image.closest('.floating-expert');
      for (const [selector, text] of [['.floating-expert__name', 'Руслан Прус'], ['.floating-expert__label', 'Руководитель департамента городской недвижимости']]) {
        const label = card?.querySelector(selector);
        if (label && label.textContent !== text) label.textContent = text;
      }
      if (card && card.getAttribute('aria-label') !== 'Руслан Прус') card.setAttribute('aria-label', 'Руслан Прус');
      const close = card?.querySelector('.floating-expert__close');
      if (close && close.getAttribute('aria-label') !== 'Скрыть карточку Руслан Прус') close.setAttribute('aria-label', 'Скрыть карточку Руслан Прус');
    }
  }
  update(); new MutationObserver(update).observe(document.documentElement, {childList:true,subtree:true});
})();
