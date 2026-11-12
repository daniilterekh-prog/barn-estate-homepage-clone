/* Country-owner page only. Shared UI components are frozen local copies. */
(() => {
 'use strict';
 const root=document.querySelector('.owner-sale-page');if(!root)return;
 const hero=root.querySelector('.owner-sale-hero');
 const lead=hero.querySelector('.owner-sale-hero__description,.owner-sale-hero__text');
 if(lead)lead.textContent='Выстроим стратегию продажи дома и участка, найдём покупателя, проведём переговоры и сопроводим сделку.';
 for(const e of document.querySelectorAll('.breadcrumbs__item:last-child,.breadcrumbs__current'))e.textContent='Собственникам — загородная недвижимость';
 const stages=root.querySelector('.owner-sale-stages__text');
 if(stages)stages.textContent='Изучим дом, участок и окружение. Предложим стратегию продажи с учётом рынка, сроков и ваших задач.';
 const photo=root.querySelector('.catalog-consultation__image');
 if(photo){photo.src='assets/hero-country.png';photo.alt='Загородная резиденция';}
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
