'use strict';
(() => {
  const header = document.querySelector('.site-header');
  const hero = document.querySelector('.career-hero');
  const menu = document.querySelector('#career-menu');
  const menuButton = document.querySelector('.site-header__icon-btn');
  const contacts = document.querySelector('#career-contacts');
  const contactButton = document.querySelector('.mh-contact-toggle');
  const breadcrumbs = document.querySelector('.career-breadcrumbs');
  let framePending = false;
  const syncLayout = () => {
    framePending = false;
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
