'use strict';
(() => {
  const header = document.querySelector('.site-header');
  const hero = document.querySelector('.career-hero');
  const menu = document.querySelector('#career-menu');
  const menuButton = document.querySelector('.site-header__icon-btn');
  const contacts = document.querySelector('#career-contacts');
  const contactButton = document.querySelector('.mh-contact-toggle');
  const breadcrumbs = document.querySelector('.career-breadcrumbs');
  const heroPhoto = hero.querySelector('.career-hero__photo');
  const heroTitle = hero.querySelector('h1');
  const syncHeroCrop = () => {
    if (!heroPhoto.naturalWidth) return;
    // Keep the approved bottom-left title/button stack. Adapt the image and
    // reserve enough vertical room for all faces instead of moving the caption.
    const navBottom = innerWidth >= 1281 ? (innerWidth >= 1441 ? 155 : 153) : (innerWidth > 540 ? 111 : 77);
    if (innerWidth > 1024) {
      const style = getComputedStyle(hero.querySelector('.career-hero__inner'));
      const copyHeight = hero.querySelector('.career-hero__content').getBoundingClientRect().height;
      const required = navBottom + 24 + 504 * hero.clientWidth / heroPhoto.naturalWidth + 24 + copyHeight + parseFloat(style.paddingBottom);
      hero.style.setProperty('--career-framing-height', `${Math.ceil(required)}px`);
    } else hero.style.removeProperty('--career-framing-height');
    const r = hero.getBoundingClientRect(), title = heroTitle.getBoundingClientRect();
    const scale = Math.max(r.width / heroPhoto.naturalWidth, r.height / heroPhoto.naturalHeight);
    const overflow = Math.max(0, heroPhoto.naturalHeight * scale - r.height);
    if (overflow < 1 && innerWidth <= 1024) { heroPhoto.style.objectPosition = '50% 0px'; return; }
    // Landmarks refer to the approved2304x1536 image, whose original people remain1:1.
    const low = innerWidth > 1024 ? Math.min(0, navBottom + 24 - 546 * scale) : Math.max(-overflow, navBottom + 24 - 546 * scale);
    const preferred = -overflow * (innerWidth > 1920 ? .5 : .65) - (innerWidth >= 1281 ? 32 : 0);
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const upper = Math.min(0, title.top - r.top - 24 - 1050 * scale);
    let offset = clamp(preferred, low, Math.max(low, upper));
    if (innerWidth <= 1024) {
      const faceLeft = r.left + (r.width - heroPhoto.naturalWidth * scale) / 2 + 282 * scale;
      const faceRight = faceLeft + 85 * scale;
      offset = clamp(preferred, low, 0);
      if (faceRight > title.left && faceLeft < title.right) {
        const above = Math.min(0, title.top - r.top - 4 - 991 * scale);
        const below = Math.max(low, title.bottom - r.top + 8 - 886 * scale);
        if (above >= low) offset = clamp(preferred, low, above);
        else if (below <= 0) offset = clamp(preferred, below, 0);
      }
    }
    heroPhoto.style.objectPosition = `50% ${Math.round(offset * 100) / 100}px`;
  };
  let framePending = false;
  const syncLayout = () => {
    framePending = false;
    syncHeroCrop();
    header.classList.toggle('site-header--scrolled', hero.getBoundingClientRect().bottom <= 0);
    const canvas = document.body.getBoundingClientRect();
    breadcrumbs.style.width = Math.min(1920, canvas.width) + 'px';
    breadcrumbs.style.left = canvas.left + Math.max(0, (canvas.width - 1920) / 2) + 'px';
    breadcrumbs.style.visibility = innerWidth <= 1024 || scrollY > 4 ? 'hidden' : '';
    if (scrollY < 4 && innerWidth > 1024) {
      const line = header.querySelector('.site-header__top').getBoundingClientRect();
      breadcrumbs.style.top = line.bottom - breadcrumbs.offsetHeight - 8 + 'px';
    }
  };
  const scheduleLayout = () => {
    if (!framePending) { framePending = true; requestAnimationFrame(syncLayout); }
  };
  new ResizeObserver(scheduleLayout).observe(header);
  heroPhoto.addEventListener('load', scheduleLayout);
  window.addEventListener('scroll', scheduleLayout, {passive:true});
  window.addEventListener('resize', scheduleLayout);
  document.fonts.ready.then(scheduleLayout);
  syncLayout();
  menuButton.addEventListener('click', () => {
    menu.showModal();
    menuButton.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  });
  menu.addEventListener('close', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    menuButton.focus({preventScroll:true});
  });
  menu.querySelector('.career-menu__close').addEventListener('click', () => menu.close());
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => menu.close()));
  menu.addEventListener('click', event => {if (event.target === menu && (event.clientX < menu.getBoundingClientRect().left || event.clientY > menu.getBoundingClientRect().bottom)) menu.close();});
  if (contacts && contactButton) {
    contactButton.setAttribute('aria-expanded','false');
    contactButton.addEventListener('click', () => {
      contacts.hidden = !contacts.hidden;
      contactButton.setAttribute('aria-expanded', String(!contacts.hidden));
    });
    document.addEventListener('keydown', event => {if(event.key === 'Escape' && !contacts.hidden){contacts.hidden=true;contactButton.setAttribute('aria-expanded','false');contactButton.focus();}});
    document.addEventListener('click', event => {if(!contacts.contains(event.target) && !contactButton.contains(event.target)){contacts.hidden=true;contactButton.setAttribute('aria-expanded','false');}});
  }
})();
