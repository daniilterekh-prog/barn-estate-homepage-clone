/* Approved Kurortnaya components adapted to the international route. */
(function(){
var openContactModal=null;
document.body.classList.add("barnes-header-template","international-node-design");
  function enhanceSiteHeader() {
    var header = document.querySelector('.layout__header .site-header');
    if (!header) return;

    header.classList.add('site-header--no-nav', 'catalog-header-ready');

    var pageNavigation = document.querySelector('.catalog-page-nav');
    if (pageNavigation) {
      pageNavigation.hidden = true;
      pageNavigation.setAttribute('aria-hidden', 'true');
    }

    var directionsNavigation = header.querySelector('.site-header__nav');
    if (directionsNavigation) directionsNavigation.remove();

    var searchButton = header.querySelector('.site-header__search-btn');
    if (searchButton) {
      searchButton.classList.add('catalog-header-search');
      searchButton.setAttribute('aria-label', 'Поиск');
      searchButton.innerHTML = '<span class="ui-icon ui-icon-current site-header__icon site-header__icon--search" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"></circle><path d="m15.4 15.4 5.1 5.1"></path></svg></span>';
    }

    var rightColumn = header.querySelector('.site-header__right');
    var phoneLink = rightColumn && rightColumn.querySelector('.site-header__phone');
    if (!rightColumn || !phoneLink || rightColumn.querySelector('.catalog-header-contacts')) return;

    var contacts = document.createElement('nav');
    contacts.className = 'catalog-header-contacts';
    contacts.setAttribute('aria-label', 'Способы связи');

    [
      ['Написать в WhatsApp', 'https://wa.me/79252621650', 'assets/header-whatsapp.svg'],
      ['Написать в MAX', 'https://max.ru/join/AWj8ibiCtAPOJOlulMGNkykKGz_prXVWg-IQK1KpUG8', 'assets/header-max.svg'],
      ['Написать в Telegram', 'https://t.me/art_de_vivre_barnes', 'assets/header-telegram.svg']
    ].forEach(function (contact) {
      var link = document.createElement('a');
      link.className = 'catalog-header-contact';
      link.href = contact[1];
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', contact[0]);

      var icon = document.createElement('img');
      icon.src = contact[2];
      icon.alt = '';
      icon.setAttribute('aria-hidden', 'true');
      link.appendChild(icon);
      contacts.appendChild(link);
    });

    phoneLink.classList.add('catalog-header-contact', 'catalog-header-contact--phone');
    phoneLink.setAttribute('aria-label', 'Позвонить по номеру +7 495 182-50-79');
    contacts.appendChild(phoneLink);
    rightColumn.appendChild(contacts);
    var mobilePhone = header.querySelector('.site-header__mobile-phone');
    if (mobilePhone) {
      mobilePhone.classList.add('catalog-primary-call');
      mobilePhone.setAttribute('aria-label', 'Позвонить по номеру +7 495 182-50-79');
    }
  }


enhanceSiteHeader();
document.querySelector(".site-header__messengers")?.remove();
  function enhanceCatalogStickyHeader() {
    var header = document.querySelector('.layout__header .site-header');
    var hero = document.querySelector('.catalog-hero');
    var page = document.querySelector('.catalog-page') || document.querySelector('main');
    if (!header || !hero || !page || document.querySelector('.catalog-sticky')) return;

    header.classList.remove('site-header--scrolled');
    var sections = [
      ['Проекты', 'catalog-new-starts'],
      ['Каталог', 'catalog-grid'],
      ['О BARNES', 'catalog-intro'],
      ['Вопросы', 'catalog-faq']
    ].filter(function (item) {
      return document.getElementById(item[1]);
    });

    var sticky = document.createElement('div');
    sticky.className = 'catalog-sticky';
    sticky.setAttribute('aria-hidden', 'true');
    sticky.setAttribute('inert', '');
    sticky.innerHTML = '<div class="catalog-sticky__inner base-container"><nav class="catalog-sticky__nav" aria-label="Навигация по странице"><ul class="catalog-sticky__list">' + sections.map(function (item) {
      return '<li class="catalog-sticky__item"><a class="catalog-sticky__link" href="#' + item[1] + '">' + item[0] + '</a></li>';
    }).join('') + '<li class="catalog-sticky__item catalog-sticky__item--contacts"><button class="catalog-sticky__contact-toggle" type="button" aria-expanded="false" aria-controls="international-sticky-contacts" aria-label="Показать способы связи"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.8 9.8 0 0 1-4-.9L3 21l1.7-4.6A8.4 8.4 0 1 1 21 11.5Z"></path><path d="M8 12h.01M12 12h.01M16 12h.01"></path></svg></button></li></ul></nav><a class="catalog-sticky__logo" aria-label="BARN Estate — на главную" href="https://barn-estate.ru/"><img alt="BARN Estate" width="220" height="30" src="assets/brand-logo.svg" style="object-fit:contain;aspect-ratio:220 / 30"></a><div class="catalog-sticky__brand"><button class="catalog-sticky__request" type="button">Оставить заявку</button><nav class="catalog-sticky__messengers" aria-label="Способы связи"><a class="catalog-sticky__messenger" href="https://wa.me/79252621650" target="_blank" rel="noopener noreferrer" aria-label="Написать в WhatsApp"><img src="assets/header-whatsapp.svg" alt=""></a><a class="catalog-sticky__messenger" href="https://max.ru/join/AWj8ibiCtAPOJOlulMGNkykKGz_prXVWg-IQK1KpUG8" target="_blank" rel="noopener noreferrer" aria-label="Написать в MAX"><img src="assets/header-max.svg" alt=""></a><a class="catalog-sticky__messenger" href="https://t.me/art_de_vivre_barnes" target="_blank" rel="noopener noreferrer" aria-label="Написать в Telegram"><img src="assets/header-telegram.svg" alt=""></a><a class="catalog-sticky__phone" href="tel:74951825079" aria-label="Позвонить по номеру +7 495 182-50-79"><span class="catalog-sticky__phone-number">+7 (495) 182-50-79</span><span class="catalog-sticky__phone-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></span></a></nav></div></div>';

    sticky.addEventListener('click', function(event) { var link=event.target.closest('.catalog-sticky__link'); if(!link)return; event.preventDefault(); var section=document.querySelector(link.getAttribute('href')); if(section) window.scrollTo({top:section.getBoundingClientRect().top+window.scrollY-sticky.offsetHeight-12,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}); });
    var sourceLogo = header.querySelector('.site-header__logo img');
    var stickyLogo = sticky.querySelector('.catalog-sticky__logo img');
    if (sourceLogo && stickyLogo) stickyLogo.src = sourceLogo.currentSrc || sourceLogo.src;

    page.insertBefore(sticky, page.firstChild);

    sticky.querySelector('.catalog-sticky__request').addEventListener('click', function () {
      if (openContactModal) {
        openContactModal(sticky.querySelector('.catalog-sticky__request'));
        return;
      }
      var contact = document.getElementById('catalog-contact');
      if (contact) contact.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    var toggle = sticky.querySelector('.catalog-sticky__contact-toggle');
    var panel = sticky.querySelector('.catalog-sticky__messengers').cloneNode(true);
    panel.id = 'international-sticky-contacts';
    panel.className = 'catalog-sticky__contact-panel';
    panel.hidden = true;
    sticky.querySelector('.catalog-sticky__inner').appendChild(panel);
    toggle.addEventListener('click', function () {
      panel.hidden = !panel.hidden;
      toggle.setAttribute('aria-expanded', String(!panel.hidden));
    });
    var callback = document.createElement('button');
    callback.type = 'button';
    callback.className = 'catalog-sticky__request catalog-sticky__callback';
    callback.setAttribute('aria-label', 'Оставить заявку');
    callback.setAttribute('aria-haspopup', 'dialog');
    callback.setAttribute('aria-controls', 'international-quiz-dialog');
    callback.textContent = 'Оставить заявку';
    callback.addEventListener('click', function () {
      panel.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      if (openContactModal) {
        openContactModal(callback);
      }
    });
    var actions = document.createElement('div');
    actions.className = 'catalog-sticky__mobile-actions';
    actions.append(toggle, callback);
    sticky.querySelector('.catalog-sticky__item--contacts').remove();
    sticky.querySelector('.catalog-sticky__nav').appendChild(actions);
    document.addEventListener('click', function (event) {
      if (!panel.contains(event.target) && !toggle.contains(event.target)) {
        panel.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !panel.hidden) {
        panel.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });

    document.addEventListener('keydown',function(event){if(event.key==='Escape'){panel.hidden=true;toggle.setAttribute('aria-expanded','false');}});
    var frameRequested = false;

    function updateStickyHeader() {
      frameRequested = false;
      var visible = window.scrollY > hero.offsetTop + hero.offsetHeight - 120;
      sticky.classList.toggle('catalog-sticky--visible', visible);
      sticky.setAttribute('aria-hidden', String(!visible));
      sticky.toggleAttribute('inert', !visible);

      var active = sections[0] && sections[0][1];
      sections.forEach(function (item) {
        var section = document.getElementById(item[1]);
        if (section && window.scrollY + 140 >= section.offsetTop) active = item[1];
      });
      sticky.querySelectorAll('.catalog-sticky__link').forEach(function (link) {
        var isActive = link.getAttribute('href') === '#' + active;
        link.classList.toggle('catalog-sticky__link--active', isActive);
        if (isActive) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }

    function requestStickyHeaderUpdate() {
      if (frameRequested) return;
      frameRequested = true;
      window.requestAnimationFrame(updateStickyHeader);
    }

    updateStickyHeader();
    window.addEventListener('scroll', requestStickyHeaderUpdate, { passive: true });
    window.addEventListener('resize', requestStickyHeaderUpdate);
  }


enhanceCatalogStickyHeader();
  openContactModal = function (trigger) {
    window.BarnesInternationalQuiz.open({trigger: trigger});
  };
  function enhanceContactMethods() {
    [
      ['.catalog-consultation__methods', '.catalog-consultation__method'],
      ['.catalog-contact__methods', '.catalog-contact__method']
    ].forEach(function (entry) {
      document.querySelectorAll(entry[0]).forEach(function (methods) {
        if (methods.dataset.contactMethodsReady === 'true') return;
        methods.dataset.contactMethodsReady = 'true';

        var form = methods.closest('form');
        var channelValue = document.createElement('input');
        channelValue.type = 'hidden';
        channelValue.name = 'preferredChannel';
        var selected = methods.querySelector(entry[1] + '[aria-selected="true"]') || methods.querySelector(entry[1]);
        channelValue.value = selected ? selected.textContent.trim() : 'Whatsapp';
        if (form) form.appendChild(channelValue);

        methods.addEventListener('click', function (event) {
          var button = event.target.closest(entry[1]);
          if (!button || !methods.contains(button)) return;
          methods.querySelectorAll(entry[1]).forEach(function (item) {
            item.setAttribute('aria-selected', String(item === button));
          });
          channelValue.value = button.textContent.trim();
        });
      });
    });
  }


window.BARNES_ENHANCE_CONTACT_METHODS=enhanceContactMethods;
window.BARNES_OPEN_CONTACT=openContactModal;
var assetBase=new URL("../assets/",document.currentScript.src);
document.querySelectorAll("img[src^=\"assets/\"]").forEach(function(img){img.src=new URL(img.getAttribute("src").slice("assets/".length),assetBase).href;});
})();
