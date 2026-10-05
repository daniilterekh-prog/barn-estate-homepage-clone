(function () {
  'use strict';

  if (window.location.protocol !== 'file:') return;

  var root = document.documentElement;
  var body = document.body;
  var header = document.querySelector('.site-header');
  var menuButton = document.querySelector('.site-header__icon-btn');
  var propertyImages = [
    './assets/images/de1884e30f08.jpg',
    './assets/images/6571b7fe661a.jpg',
    './assets/images/86a4a6ce938c.jpg',
    './assets/images/b57416a94176.jpg',
    './assets/images/8fbfa1fa58b6.jpg',
    './assets/images/89641973f5cb.jpg',
    './assets/images/7bb4905def97.jpg'
  ];

  function closeMenu() {
    var menu = document.querySelector('[data-local-menu]');
    if (menu) menu.remove();
    if (header) header.classList.remove('site-header--menu-open');
    if (menuButton) menuButton.setAttribute('aria-label', 'Открыть меню');
    body.classList.remove('no-scroll');
  }

  function openMenu() {
    if (document.querySelector('[data-local-menu]')) return;
    var menu = document.createElement('section');
    menu.className = 'site-menu';
    menu.setAttribute('data-local-menu', '');
    menu.setAttribute('aria-label', 'Меню сайта');
    menu.innerHTML = [
      '<div class="site-menu__panel"><div class="site-menu__inner base-container"><div class="site-menu__main">',
      '<nav class="site-menu__nav" aria-label="Основная навигация">',
      '<div class="site-menu__nav-group"><a class="site-menu__nav-title site-menu__nav-title--active" href="../../../index.html">Главная</a></div>',
      '<div class="site-menu__nav-group"><a class="site-menu__nav-title" href="../../../listing.html">Недвижимость</a><ul class="site-menu__nav-list"><li><a class="site-menu__nav-link" href="../../../listing.html">Вторичная недвижимость</a></li><li><a class="site-menu__nav-link" href="../../../listing.html">Новостройки</a></li><li><a class="site-menu__nav-link" href="../../../listing.html">Аренда</a></li><li><a class="site-menu__nav-link" href="../../../listing.html">Загородная недвижимость</a></li></ul></div>',
      '<div class="site-menu__nav-group"><a class="site-menu__nav-title" href="https://front.barnes.vsavr.ru/contacts/">Сервисы BARNES</a><ul class="site-menu__nav-list"><li><a class="site-menu__nav-link" href="https://front.barnes.vsavr.ru/team/">Команда</a></li><li><a class="site-menu__nav-link" href="https://front.barnes.vsavr.ru/media/blog/">Журнал</a></li><li><a class="site-menu__nav-link" href="https://front.barnes.vsavr.ru/contacts/">Контакты</a></li><li><a class="site-menu__nav-link" href="https://front.barnes.vsavr.ru/prodazha_sobstvennikam/">Продать недвижимость</a></li></ul></div>',
      '</nav><div class="site-menu__featured"><div class="site-menu__divider"></div><a class="site-menu__view-all" href="../../../listing.html">Смотреть все объекты ↗</a></div>',
      '</div><div class="site-menu__divider"></div><div class="site-menu__bottom"><div class="site-menu__bottom-group"><h3 class="site-menu__bottom-title">BARNES Moscow</h3><a class="site-menu__bottom-link" href="tel:74951825079">+7 (495) 182-50-79</a></div><div class="site-menu__bottom-group"><h3 class="site-menu__bottom-title">Мы в социальных сетях</h3><a class="site-menu__bottom-link" href="https://t.me/art_de_vivre_barnes">Telegram</a></div></div>',
      '</div></div>'
    ].join('');
    body.appendChild(menu);
    if (header) header.classList.add('site-header--menu-open');
    if (menuButton) menuButton.setAttribute('aria-label', 'Закрыть меню');
    body.classList.add('no-scroll');
  }

  if (menuButton) {
    menuButton.addEventListener('click', function () {
      if (document.querySelector('[data-local-menu]')) closeMenu();
      else openMenu();
    });
  }

  function closeGallery() {
    var modal = document.querySelector('[data-local-gallery]');
    if (modal) modal.remove();
    body.classList.remove('no-scroll');
  }

  function openGallery(startIndex) {
    if (document.querySelector('[data-local-gallery]')) return;
    var index = Math.max(0, Math.min(startIndex || 0, propertyImages.length - 1));
    var modal = document.createElement('div');
    modal.setAttribute('data-local-gallery', '');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Галерея объекта');
    modal.innerHTML = '<div class="property-gallery"><button class="property-gallery__close" type="button" aria-label="Закрыть галерею">×</button><div class="property-gallery__stage"><img class="property-gallery__image" alt="Квартира в Москве, ID576683"><button class="property-gallery__nav property-gallery__nav--prev" type="button" aria-label="Предыдущее фото">‹</button><button class="property-gallery__nav property-gallery__nav--next" type="button" aria-label="Следующее фото">›</button></div><div class="property-gallery__footer"><span class="property-gallery__count"></span><img src="./assets/pictures/logo.svg" alt="BARNES Moscow" class="property-gallery__logo"></div></div>';
    body.appendChild(modal);
    body.classList.add('no-scroll');
    var image = modal.querySelector('.property-gallery__image');
    var count = modal.querySelector('.property-gallery__count');
    function render() {
      image.src = propertyImages[index];
      count.textContent = String(index + 1) + ' / ' + String(propertyImages.length);
    }
    modal.querySelector('.property-gallery__close').addEventListener('click', closeGallery);
    modal.querySelector('.property-gallery__nav--prev').addEventListener('click', function () {
      index = (index + propertyImages.length - 1) % propertyImages.length;
      render();
    });
    modal.querySelector('.property-gallery__nav--next').addEventListener('click', function () {
      index = (index + 1) % propertyImages.length;
      render();
    });
    modal.addEventListener('click', function (event) {
      if (event.target === modal) closeGallery();
    });
    render();
  }

  document.querySelectorAll('.lot-hero__media-hit, .lot-hero__action, .construction__card').forEach(function (button) {
    button.addEventListener('click', function () { openGallery(0); });
  });

  document.querySelectorAll('.catalog-consultation__method, .catalog-contact__method').forEach(function (button) {
    button.addEventListener('click', function () {
      var group = button.parentElement;
      group.querySelectorAll('button').forEach(function (item) {
        Array.prototype.slice.call(item.classList).filter(function (name) { return name.indexOf('--active') !== -1; }).forEach(function (name) { item.classList.remove(name); });
        item.setAttribute('aria-selected', 'false');
      });
      button.classList.add('catalog-' + (button.classList.contains('catalog-contact__method') ? 'contact' : 'consultation') + '__method--active');
      button.setAttribute('aria-selected', 'true');
    });
  });

  var floatingClose = document.querySelector('.floating-expert__close');
  if (floatingClose) floatingClose.addEventListener('click', function () {
    var card = floatingClose.closest('.floating-expert');
    if (card) card.remove();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') { closeMenu(); closeGallery(); }
  });

  var style = document.createElement('style');
  style.textContent = [
    '[data-local-gallery]{position:fixed;inset:0;z-index:2000;background:#1e1e1e;color:#fff}',
    '.property-gallery{height:100%;display:flex;flex-direction:column;padding:32px 48px 24px}',
    '.property-gallery__stage{position:relative;flex:1;min-height:0;display:flex;align-items:center;justify-content:center}',
    '.property-gallery__image{display:block;width:100%;height:100%;object-fit:contain}',
    '.property-gallery__close{position:absolute;z-index:1;right:0;top:0;width:48px;height:48px;border:1px solid #ffffff99;border-radius:50%;background:transparent;color:#fff;font-size:32px;font-weight:300;line-height:1}',
    '.property-gallery__nav{position:absolute;top:50%;transform:translateY(-50%);width:56px;height:56px;border:1px solid #fff;border-radius:50%;background:#1e1e1eaa;color:#fff;font-size:38px;line-height:1}',
    '.property-gallery__nav--prev{left:16px}.property-gallery__nav--next{right:16px}',
    '.property-gallery__footer{display:flex;justify-content:space-between;align-items:center;padding-top:20px}',
    '.property-gallery__count{font-size:16px}.property-gallery__logo{width:min(220px,42vw);filter:brightness(0) invert(1);opacity:.7}',
    '@media(max-width:540px){.property-gallery{padding:20px 16px 16px}.property-gallery__nav{width:44px;height:44px}.property-gallery__nav--prev{left:4px}.property-gallery__nav--next{right:4px}}'
  ].join('');
  root.appendChild(style);
}());
