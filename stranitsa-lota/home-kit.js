/* UI adapter only. Keep the selected lot's broker and object-specific request. */
(function(){
 'use strict';
 const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
 const header=q('.site-header'),headerData=q('[data-barn-block="01-header"] .barn-block-data');
 if(headerData){const data=JSON.parse(headerData.textContent);if(data.stickyRight)q('.site-header__right').innerHTML=data.stickyRight;
  if(data.menu){const template=q('#source-menu');template.innerHTML=data.menu;template.content.firstElementChild?.removeAttribute('hidden');}
 }
 const contacts=q('.site-header__messengers');
 if(contacts){
  const toggle=document.createElement('button');toggle.type='button';toggle.className='home-header-contacts-toggle';toggle.setAttribute('aria-label','Показать способы связи');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-controls','lot-header-contacts');toggle.innerHTML='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.8 9.8 0 0 1-4-.9L3 21l1.7-4.6A8.4 8.4 0 1 1 21 11.5Z"/><path d="M8 12h.01M12 12h.01M16 12h.01"/></svg>';
  const panel=document.createElement('nav');panel.className='home-header-contacts-panel';panel.id='lot-header-contacts';panel.hidden=true;panel.setAttribute('aria-label','Способы связи');
  for(const label of ['WhatsApp','MAX','Telegram','Позвонить']){const link=qa('a',contacts).find(a=>a.getAttribute('aria-label')===label);if(link)panel.append(link.cloneNode(true));}
  q('.site-header__top').append(toggle,panel);
  function close(restore=false){panel.hidden=true;toggle.setAttribute('aria-expanded','false');if(restore)toggle.focus();}
  toggle.addEventListener('click',()=>{panel.hidden=!panel.hidden;toggle.setAttribute('aria-expanded',String(!panel.hidden));});
  document.addEventListener('click',e=>{if(!toggle.contains(e.target)&&!panel.contains(e.target))close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){e.preventDefault();close(true);}});
  window.addEventListener('resize',()=>close());
 }
 const main=q('main');if(main){main.id='lot-main';main.tabIndex=-1;const skip=document.createElement('a');skip.href='#lot-main';skip.className='lot-skip-link';skip.textContent='К содержанию лота';document.body.prepend(skip);}
 q('.site-header__request')?.addEventListener('click',()=>q('[data-lot-modal="tour"]')?.click());
 // Imported footer actions are wired by local.js to the same object contact.
 qa('[data-barn-block="15-footer"] [data-barn-quiz]').forEach(b=>b.addEventListener('click',()=>q('[data-lot-modal="tour"]')?.click()));
 let count=0;
 function accessibleForms(root){
  qa('[role="dialog"]',root).forEach(dialog=>{const h=q('h2',dialog);if(h){h.id='lot-dialog-heading-'+(++count);dialog.setAttribute('aria-labelledby',h.id);}});
  qa('input:not([type="hidden"])',root).forEach(input=>{
   if(!input.id)input.id='lot-field-'+(++count);
   if(!input.labels?.length&&!input.getAttribute('aria-label')){
    const label=document.createElement('label');label.className='lot-sr-only';label.htmlFor=input.id;label.textContent=input.placeholder||'Контакт';input.before(label);
   }
   if(!input.name)input.name=input.type==='checkbox'?'consent':input.tabIndex===-1?'website':/телефон/i.test(input.placeholder)?'phone':'name';
   if(/телефон/i.test(input.placeholder)){input.type='tel';input.autocomplete='tel';input.inputMode='tel';}
   else if(input.type==='text'&&/имя/i.test(input.placeholder))input.autocomplete='name';
  });
  qa('form',root).filter(f=>f.closest('[data-local-overlay]')).forEach(f=>{
   if(q('.lot-form-context',f))return;const p=document.createElement('p');p.className='lot-form-context';p.textContent='Лот '+window.BARNES_LOT_DATA.id+' · '+window.BARNES_LOT_DATA.title;f.prepend(p);
  });
 }
 accessibleForms(document);
 new MutationObserver(records=>records.forEach(r=>r.addedNodes.forEach(n=>{if(n.nodeType===1&&n.hasAttribute('data-local-overlay'))accessibleForms(n);}))).observe(document.body,{childList:true});
}());
