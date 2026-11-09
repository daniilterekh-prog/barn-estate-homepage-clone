(() => {
  'use strict';
  const cards = [...document.querySelectorAll('.event-card')];
  const years = [...document.querySelectorAll('.events-year')];
  const more = document.getElementById('events-more');
  const progress = document.getElementById('events-progress');
  const count = document.getElementById('events-count');
  const pageSize = matchMedia('(max-width:540px)').matches ? 6 : 12;
  let year = 'all', limit = pageSize;
  const plural = n => n % 10 === 1 && n % 100 !== 11 ? 'событие' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 'события' : 'событий';
  function render() {
    const matching = cards.filter(card => year === 'all' || card.dataset.year === year);
    const visible = new Set(matching.slice(0, limit));
    cards.forEach(card => { card.hidden = !visible.has(card); });
    years.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.year === year)));
    count.textContent = `${matching.length} ${plural(matching.length)}`;
    progress.textContent = `Показано ${Math.min(limit, matching.length)} из ${matching.length}`;
    more.hidden = limit >= matching.length;
    document.documentElement.classList.add('events-ready');
  }
  years.forEach(button => button.addEventListener('click', () => {
    year = button.dataset.year; limit = pageSize; render();
  }));
  more.addEventListener('click', () => {
    const previous = cards.filter(card => !card.hidden).length;
    limit += pageSize; render();
    // Keep keyboard focus in reading order when additional cards appear.
    cards.filter(card => !card.hidden)[previous]?.querySelector('a')?.focus({ preventScroll: true });
  });
  render();

  const header = document.querySelector('.site-header');
  const hero = document.querySelector('.media-hero');
  new IntersectionObserver(entries => {
    const sticky = !entries[0].isIntersecting && entries[0].boundingClientRect.top < 0;
    header.classList.toggle('is-sticky', sticky);
  }, { threshold: 0 }).observe(hero);

  const dialog = document.getElementById('contact-dialog');
  let returnFocus;
  function openContact(trigger) {
    returnFocus = trigger; dialog.showModal();
  }
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-open-contact],.site-header__request,.site-footer__callback-btn');
    if (trigger) { event.preventDefault(); openContact(trigger); }
  });
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => returnFocus?.focus({ preventScroll: true }));
})();
