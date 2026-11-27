/* Country-owner page only. Shared UI components are frozen local copies. */
(() => {
 'use strict';
 const root=document.querySelector('.owner-sale-page');if(!root)return;
 for(const e of document.querySelectorAll('.breadcrumbs__item:last-child,.breadcrumbs__current'))e.textContent='Собственникам — загородная недвижимость';
 // Reserve only the space the country copy needs at reference font sizes.
 // Explicit width prevents a tall aspect-ratio card widening its grid column.
 const grid=root.querySelector('.owner-sale-presentation__grid');
 if(grid){
  let frame=0,lastWidth=-1;
  const fit=()=>{
   frame=0;
   const gap=matchMedia('(max-width:540px)').matches?12:14;
   for(const card of grid.querySelectorAll('.owner-sale-presentation__card')){
    const caption=card.querySelector('.owner-sale-presentation__caption');
    const text=card.querySelector('.owner-sale-presentation__reveal-text');
    const reveal=card.querySelector('.owner-sale-presentation__reveal');
    if(!caption||!text||!reveal)continue;
    const style=getComputedStyle(reveal);
    // A temporary, inert text probe measures the complete description without
    // opening the card or changing keyboard focus.
    const probe=text.cloneNode(true);probe.removeAttribute('id');
    probe.setAttribute('aria-hidden','true');probe.inert=true;
    probe.style.cssText='position:absolute!important;visibility:hidden!important;pointer-events:none!important;height:auto!important;max-height:none!important;padding-top:'+gap+'px!important;width:'+caption.clientWidth+'px!important;flex:none!important;';
    reveal.append(probe);
    const textHeight=probe.scrollHeight;
    probe.remove();
    const height=Math.ceil(caption.scrollHeight+textHeight+parseFloat(style.paddingTop)+parseFloat(style.paddingBottom)+4);
    card.style.setProperty('--country-card-min-height',height+'px');
    card.style.setProperty('--country-card-reveal-height',(textHeight+2)+'px');
   }
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(fit);};
  new ResizeObserver(entries=>{const width=entries[0].contentRect.width;if(Math.abs(width-lastWidth)>.25){lastWidth=width;schedule();}}).observe(grid);
  document.fonts.ready.then(schedule);
  document.fonts.addEventListener('loadingdone',schedule);
  window.addEventListener('resize',schedule,{passive:true});schedule();
 }
 // Static previews do not claim a lead was delivered or send personal information.
 window.addEventListener('submit',event=>{
  const form=event.target;if(!(form instanceof HTMLFormElement)||form.closest('.home-owner-host'))return;
  event.preventDefault();event.stopImmediatePropagation();
  let status=form.querySelector('.country-form-status');
  if(!status){status=document.createElement('p');status.className='country-form-status';status.id='country-status-'+[...document.forms].indexOf(form);status.setAttribute('role','status');status.setAttribute('aria-live','polite');form.append(status);}
  for(const field of form.querySelectorAll('input,textarea'))field.removeAttribute('aria-invalid');
  const email=form.querySelector('input[type=email]');
  const name=form.querySelector('input[autocomplete=name],input[name=name],.catalog-consultation__input:not([type=tel])');
  const phone=form.querySelector('input[type=tel],input[autocomplete=tel]');
  const consent=form.querySelector('input[type=checkbox]');
  const fail=(field,message)=>{field.setAttribute('aria-invalid','true');field.setAttribute('aria-describedby',status.id);status.textContent=message;field.focus();};
  if(email&&!email.validity.valid){fail(email,'Укажите корректный email.');return;}
  if(name&&!name.value.trim()){fail(name,'Укажите ваше имя.');return;}
  if(phone&&phone.value.replace(/\D/g,'').length<7){fail(phone,'Укажите корректный номер телефона.');return;}
  if(consent&&!consent.checked){fail(consent,'Подтвердите согласие на обработку персональных данных.');return;}
  status.textContent='В превью отправка не подключена. Данные не отправлены.';
 },true);
})();
