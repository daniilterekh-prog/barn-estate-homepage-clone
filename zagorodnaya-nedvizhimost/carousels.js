(() => {
  // Same Splide 4.1.4 options as the live BARNES reference.
  const initialize = (selector, options, previous, next) => {
    const old = document.querySelector(selector);
    if (!old || !window.Splide) return;
    const slider = old.cloneNode(true);
    old.replaceWith(slider);
    slider.className = `splide ${selector.slice(1)}`;
    slider.querySelectorAll('.splide__slide--clone, .splide__pagination').forEach(node => node.remove());
    const track = slider.querySelector('.splide__track');
    track.className = 'splide__track';
    track.removeAttribute('style');
    const list = slider.querySelector('.splide__list');
    list.removeAttribute('style');
    list.querySelectorAll('.splide__slide').forEach(slide => {
      slide.className = 'splide__slide';
      slide.removeAttribute('style');
    });
    slider.querySelectorAll('.apartment-card__image').forEach(image => {
      image.loading = 'eager';
      image.setAttribute('sizes', '768:320px 514px');
      image.setAttribute('densities', '1x 2x');
    });
    const carousel = new Splide(slider, options);
    const buttons = [previous, next].map(selector => {
      const old = document.querySelector(selector);
      if (!old) return null;
      const button = old.cloneNode(true);
      old.replaceWith(button);
      return button;
    });
    const update = () => {
      const loop = carousel.options.type === 'loop';
      if (buttons[0]) buttons[0].disabled = !loop && carousel.index === 0;
      if (buttons[1]) buttons[1].disabled = !loop && carousel.index >= carousel.Components.Controller.getEnd();
    };
    carousel.on('mounted move updated', update);
    carousel.on('resize', () => requestAnimationFrame(() => carousel.refresh()));
    carousel.mount();
    buttons[0]?.addEventListener('click', () => carousel.go('<'));
    buttons[1]?.addEventListener('click', () => carousel.go('>'));
    update();
  };
  initialize('.catalog-best-offers__slider', {
    type: 'loop', focus: 'center', autoWidth: true, gap: '90px', perMove: 1,
    speed: 850, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', arrows: false,
    pagination: false, drag: true, snap: true, flickPower: 280, trimSpace: false,
    updateOnMove: true,
    breakpoints: {
      1440: { gap: '24px' }, 1280: { gap: '20px' }, 1024: { gap: '16px' },
      768: { gap: '12px', speed: 650 },
      540: { type: 'slide', focus: false, autoWidth: false, fixedWidth: false,
        perPage: 1, gap: 0, pagination: true, trimSpace: true, speed: 650, overflow: 'hidden' },
    },
  }, '.catalog-best-offers__nav-btn--prev', '.catalog-best-offers__nav-btn--next');
  initialize('.news-section__slider', {
    type: 'slide', perPage: 3, perMove: 1, gap: '40px', arrows: false,
    pagination: false, drag: true, snap: true, trimSpace: false,
    breakpoints: {
      1024: { perPage: 2 }, 560: { perPage: 1, gap: '24px' },
      540: { perPage: 1, gap: '24px', pagination: true },
    },
  }, '.news-section__nav-btn[aria-label="Предыдущие новости"]', '.news-section__nav-btn[aria-label="Следующие новости"]');
})();
