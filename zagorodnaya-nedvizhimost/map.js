(() => {
  const map = document.querySelector('.catalog-projects-map');
  if (!map) return;
  const surface = map.querySelector('.ymaps3--map');
  const engine = document.createElement('ymaps3');
  engine.className = 'ymaps3--main-engine-container';
  const holder = document.createElement('ymaps3');
  const layer = document.createElement('ymaps3');
  layer.className = 'ymaps3--layer ymaps3--tile-layer';
  layer.style.opacity = '1';
  const tiles = document.createElement('ymaps3');
  tiles.className = 'ymaps3--tile-layer__container';
  tiles.setAttribute('data-z', '11');
  tiles.style.zIndex = '11';
  for (let x = 1232; x <= 1243; x++) {
    for (let y = 641; y <= 642; y++) {
      const image = document.createElement('img');
      image.src = `assets/map/${x}-${y}.png`;
      image.alt = '';
      image.dataset.tileX = x;
      image.dataset.tileY = y;
      image.style.cssText = 'width:256px;height:256px;opacity:1;';
      tiles.append(image);
    }
  }
  layer.append(tiles);
  holder.append(layer);
  engine.append(holder);
  surface.append(engine);
  const position = () => {
    const rect = map.getBoundingClientRect();
    surface.style.width = `${map.clientWidth}px`;
    surface.style.height = `${map.clientHeight}px`;
    const terms = map.querySelector('.ymaps3--map-copyrights__user-agreements');
    const copyright = map.querySelector('.ymaps3--map-copyrights__text');
    const logo = map.querySelector('.ymaps3--map-copyrights__logo');
    if (terms && copyright && logo) {
      terms.textContent = 'Условия использования';
      if (copyright.offsetWidth >= map.clientWidth - logo.offsetWidth - terms.offsetWidth - 40) terms.textContent = 'Условия';
    }
    const left = Math.round(map.clientWidth / 2 - 258);
    const top = Math.round(map.clientHeight / 2 - 272);
    layer.style.perspective = `${(map.clientHeight / 2 / Math.tan(Math.PI / 12)).toFixed(3)}px`;
    tiles.style.transform = `rotateX(0rad) translate3d(0px, 0px, 0px) rotateZ(0rad) translate3d(${Math.round(rect.x) - rect.x}px, ${Math.round(rect.y) - rect.y}px, 0px)`;
    tiles.querySelectorAll('img').forEach(image => {
      image.style.left = `${left + (Number(image.dataset.tileX) - 1237) * 256}px`;
      image.style.top = `${top + (Number(image.dataset.tileY) - 641) * 256}px`;
    });
  };
  new ResizeObserver(position).observe(map);
  window.addEventListener('scroll', position, { passive: true });
  window.addEventListener('resize', position, { passive: true });
  position();
  document.fonts.ready.then(position);
  map.querySelector('.catalog-projects-map__fullscreen')?.addEventListener('click', () => {
    if (document.fullscreenElement === map) document.exitFullscreen();
    else map.requestFullscreen?.();
  });
  map.querySelector('.ymaps3--open-maps-button')?.closest('button')?.addEventListener('click', () => {
    window.open(map.querySelector('.ymaps3--map-copyrights__logo').href, '_blank', 'noopener');
  });
})();
