/* Local controllers: office tabs, accessible site menu, contact dialog. No requests are submitted. */
(()=>{
 'use strict';
 const header=document.querySelector('.site-header'),hero=document.querySelector('.contacts-hero');
 const menu=document.querySelector('.site-menu'),menuButton=header.querySelector('.site-header__icon-btn');
 const main=document.querySelector('main'),footer=document.querySelector('footer');
 const dialog=document.querySelector('.contact-dialog');
 let menuOpen=false,restoreOverflow='';
 function scrollHeader(){header.classList.toggle('site-header--scrolled',window.scrollY>hero.offsetHeight-110)}
 window.addEventListener('scroll',scrollHeader,{passive:true});scrollHeader();
 function setMenu(open){
  menuOpen=open;menu.hidden=!open;header.classList.toggle('site-header--menu-open',open);
  menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');
  if(open){restoreOverflow=document.documentElement.style.overflow;document.documentElement.style.overflow='hidden';menu.setAttribute('role','dialog');menu.setAttribute('aria-modal','true');menu.setAttribute('aria-label','Основное меню');main.inert=true;footer.inert=true;menu.querySelector('a').focus()}
  else{document.documentElement.style.overflow=restoreOverflow;main.inert=false;footer.inert=false;menuButton.focus({preventScroll:true})}
  window.BarnPageBreadcrumbs?.refresh();
 }
 menuButton.addEventListener('click',()=>setMenu(!menuOpen));
 menu.addEventListener('click',event=>{if(event.target.closest('a'))setMenu(false)});
 document.addEventListener('keydown',event=>{if(menuOpen&&event.key==='Escape'){event.preventDefault();setMenu(false)}});
 const tabs=[...document.querySelectorAll('[data-office-tab]')],panels=[...document.querySelectorAll('.office-panel')];
 const tablist=document.querySelector('.office-tabs');tablist.setAttribute('role','tablist');
 function selectOffice(id,focus=false){
  tabs.forEach(tab=>{const selected=tab.dataset.officeTab===id;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;if(selected&&focus)tab.focus()});
  panels.forEach(panel=>{panel.hidden=panel.id!=='office-'+id;if(!panel.hidden){const frame=panel.querySelector('iframe[data-src]');if(frame){frame.src=frame.dataset.src;frame.removeAttribute('data-src')}}});
 }
 tabs.forEach((tab,index)=>{
  tab.setAttribute('role','tab');tab.setAttribute('aria-controls','office-'+tab.dataset.officeTab);
  tab.addEventListener('click',event=>{event.preventDefault();selectOffice(tab.dataset.officeTab)});
  tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%tabs.length;else if(event.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else if(event.key===' '||event.key==='Enter'){event.preventDefault();selectOffice(tab.dataset.officeTab);return}else return;event.preventDefault();selectOffice(tabs[next].dataset.officeTab,true)});
 });
 panels.forEach(panel=>{panel.setAttribute('role','tabpanel');panel.tabIndex=0});
 selectOffice(location.hash.startsWith('#office-')&&panels.some(p=>'#'+p.id===location.hash)?location.hash.slice(8):'moscow');
 document.querySelectorAll('[data-select-office]').forEach(link=>link.addEventListener('click',()=>selectOffice(link.dataset.selectOffice)));
 document.querySelector('.hero-bottom>a:first-child').addEventListener('click',()=>selectOffice('moscow'));
 let dialogTrigger=null,dialogOverflow='';
 function openContact(trigger){if(menuOpen)setMenu(false);dialogTrigger=trigger?.getClientRects().length?trigger:document.activeElement;dialogOverflow=document.documentElement.style.overflow;document.documentElement.style.overflow='hidden';dialog.showModal();dialog.querySelector('.dialog-close').focus();window.BarnPageBreadcrumbs?.refresh()}
 document.addEventListener('click',event=>{const trigger=event.target.closest('[data-contact-open]');if(trigger){event.preventDefault();openContact(trigger)}});
 dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close()}});
 dialog.addEventListener('keydown',event=>{if(event.key!=='Tab')return;const items=[...dialog.querySelectorAll('button,a[href]')],first=items[0],last=items[items.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}});
 dialog.addEventListener('close',()=>{document.documentElement.style.overflow=dialogOverflow;dialogTrigger?.focus({preventScroll:true});window.BarnPageBreadcrumbs?.refresh()});
 // Keep the shared header callback contract without introducing a second form controller.
 window.__barnesOwnerForm={open:({trigger}={})=>openContact(trigger)};
 const stored=(()=>{try{return JSON.parse(localStorage.getItem('barnes:favorites')||'[]')}catch{return []}})();
 header.querySelector('.site-header__favorites-count').textContent=Array.isArray(stored)?String(stored.length):'0';
})();
