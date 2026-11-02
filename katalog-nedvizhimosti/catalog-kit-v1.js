/* Adapter for the frozen homepage modules; catalogue state remains in listing.js. */
(()=>{
 'use strict';
 const compactScreen=matchMedia('(max-width:767px)');
 const header=document.querySelector('.site-header'),right=header.querySelector('.site-header__right');
 const request=document.createElement('button');request.type='button';request.className='site-header__request';request.textContent='Оставить заявку';request.setAttribute('aria-haspopup','dialog');request.hidden=true;right.prepend(request);
 let frame=0;
 const updateSticky=()=>{
  frame=0;const on=compactScreen.matches||window.scrollY>40;header.classList.toggle('site-header--scrolled',on);request.hidden=!on;
  const panel=document.querySelector('.site-menu');if(panel)panel.style.setProperty('--site-menu-top',header.querySelector('.site-header__top').getBoundingClientRect().bottom+'px');
 };
 window.addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(updateSticky)},{passive:true});updateSticky();
 window.__barnesHeaderContacts?.refresh();
 // Keep the DOM/focus order aligned with the compact visual layout.
 const primary=document.querySelector('.catalog-toolbar__primary'),secondary=document.querySelector('.catalog-toolbar__secondary'),searchRow=document.querySelector('.catalog-search-row'),details=document.querySelector('.catalog-mode-detailed-filters');
 const moveSearch=()=>{const parent=compactScreen.matches?secondary:primary;if(searchRow.parentElement===parent)return;const focused=searchRow.contains(document.activeElement)?document.activeElement:null;if(compactScreen.matches)secondary.insertBefore(searchRow,details);else primary.append(searchRow);focused?.focus({preventScroll:true});};
 moveSearch();compactScreen.addEventListener('change',()=>{moveSearch();updateSticky();});

 const smallScreen=compactScreen;const updateSearchHint=()=>document.querySelector('#catalog-search').placeholder=smallScreen.matches?'Название или ID':'Название ЖК, адрес или ID';smallScreen.addEventListener('change',updateSearchHint);updateSearchHint();
 document.querySelector('.floating-expert__close')?.addEventListener('click',event=>{event.currentTarget.closest('.barnes-block').hidden=true;});
 // Replace legacy reset copy without changing the filter reset behavior.
 const renameReset=()=>{const button=document.querySelector('.hero-filter-modal__reset');if(button){button.textContent='Сбросить';button.setAttribute('aria-label','Сбросить все фильтры');}};
 renameReset();
 const observer=new MutationObserver(()=>{if(document.querySelector('.hero-filter-modal__reset')){renameReset();observer.disconnect();}});if(!document.querySelector('.hero-filter-modal__reset'))observer.observe(document.body,{childList:true,subtree:true});
 // Preserve familiar Escape priority and expose current catalogue context to the integration event.
 document.addEventListener('barn:lead',event=>{event.detail.data.pageUrl=location.href;event.detail.data.department=document.body.dataset.direction;});
})();
