/* Owner-sale contacts adapted to the existing homepage header after hydration. */
(()=>{
 if(window.__barnesHeaderContacts)return;
 let header=null,toggle=null,panel=null,observer=null;
 function close(restoreFocus=false){if(!panel)return;const wasOpen=!panel.hidden;panel.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Показать способы связи');if(restoreFocus&&wasOpen)toggle.focus({preventScroll:true})}
 function refresh(){
  const current=document.querySelector('.site-header');if(!current||current===header)return;
  observer?.disconnect();header=current;const top=header.querySelector('.site-header__top'),contacts=header.querySelector('.site-header__messengers');if(!top||!contacts)return;
  toggle=document.createElement('button');toggle.type='button';toggle.className='home-header-contacts-toggle';toggle.setAttribute('aria-label','Показать способы связи');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-controls','home-header-contact-panel');
  toggle.innerHTML='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.8 9.8 0 0 1-4-.9L3 21l1.7-4.6A8.4 8.4 0 1 1 21 11.5Z"/><path d="M8 12h.01M12 12h.01M16 12h.01"/></svg>';
  panel=document.createElement('nav');panel.className='home-header-contacts-panel';panel.id='home-header-contact-panel';panel.hidden=true;panel.setAttribute('aria-label','Способы связи');
  for(const label of['WhatsApp','MAX','Telegram']){const source=[...contacts.querySelectorAll('a')].find(a=>a.getAttribute('aria-label')===label);if(!source)continue;const a=document.createElement('a');a.href=source.href;a.target='_blank';a.rel='noopener noreferrer';a.setAttribute('aria-label','Написать в '+label);const img=source.querySelector('img').cloneNode(true);img.alt='';img.setAttribute('aria-hidden','true');a.append(img);panel.append(a)}
  const phone=contacts.querySelector('a[href^="tel:"]');if(phone){const a=document.createElement('a');a.href=phone.href;a.setAttribute('aria-label','Позвонить по номеру +7 (495) 182-50-79');a.append(phone.querySelector('svg').cloneNode(true));panel.append(a)}
  top.append(toggle,panel);
  observer=new MutationObserver(()=>{if(!header.classList.contains('site-header--scrolled')||header.classList.contains('site-header--menu-open'))close()});observer.observe(header,{attributes:true,attributeFilter:['class']});
 }
 document.addEventListener('click',event=>{if(!toggle)return;if(toggle.contains(event.target)){event.preventDefault();const opening=panel.hidden;panel.hidden=!opening;toggle.setAttribute('aria-expanded',String(opening));toggle.setAttribute('aria-label',opening?'Скрыть способы связи':'Показать способы связи');return}if(!panel.contains(event.target)||event.target.closest('a'))close()});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&panel&&!panel.hidden){event.preventDefault();event.stopPropagation();close(true)}},true);
 window.addEventListener('resize',()=>close());
 window.__barnesHeaderContacts={refresh,close};
 if(document.body.dataset.homeSpacingReady==='true')refresh();
})();
