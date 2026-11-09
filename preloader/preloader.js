(() => {
  const overlay = document.querySelector('.be-preloader');
  if (!overlay) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches) { overlay.remove(); return; }
  const started = performance.now();
  let leaving = false;
  let minimumTimer;
  let maximumTimer;
  let removalTimer;
  const preventScroll = event => event.preventDefault();
  const remove = () => {
    clearTimeout(minimumTimer);
    clearTimeout(maximumTimer);
    clearTimeout(removalTimer);
    window.removeEventListener('load', loaded);
    window.removeEventListener('pageshow', restored);
    motion.removeEventListener('change', motionChanged);
    overlay.remove();
  };
  const reveal = () => {
    if (leaving) return;
    leaving = true;
    clearTimeout(maximumTimer);
    overlay.classList.add('is-leaving');
    removalTimer = setTimeout(remove, 950);
  };
  const loaded = () => {
    clearTimeout(minimumTimer);
    minimumTimer = setTimeout(reveal, Math.max(0, 1900 - (performance.now() - started)));
  };
  const restored = event => { if (event.persisted) remove(); };
  const motionChanged = event => { if (event.matches) remove(); };
  // Register recovery before showing the overlay. No scroll/focus changes on the page.
  maximumTimer = setTimeout(reveal, 3500);
  window.addEventListener('pageshow', restored);
  motion.addEventListener('change', motionChanged);
  overlay.addEventListener('wheel', preventScroll, { passive: false });
  overlay.addEventListener('touchmove', preventScroll, { passive: false });
  overlay.classList.add('is-active');
  if (document.readyState === 'complete') loaded();
  else window.addEventListener('load', loaded, { once: true });
})();
