/* Local preview validation. No lead is submitted without a backend. */
(() => {
  'use strict';
  for(const group of document.querySelectorAll('.catalog-consultation__methods')){
    const tabs=[...group.querySelectorAll('[role=tab]')];
    const sync=()=>tabs.forEach(tab=>tab.tabIndex=tab.getAttribute('aria-selected')==='true'?0:-1);
    group.addEventListener('click',sync);sync();
    group.addEventListener('keydown',event=>{
      const index=tabs.indexOf(event.target);if(index<0)return;
      const next={ArrowRight:(index+1)%tabs.length,ArrowLeft:(index+tabs.length-1)%tabs.length,Home:0,End:tabs.length-1}[event.key];
      if(next===undefined)return;event.preventDefault();tabs[next].click();tabs[next].focus();
    });
  }
  window.addEventListener('submit', event => {
    const form=event.target;
    if(!(form instanceof HTMLFormElement)||form.closest('.home-owner-host'))return;
    event.preventDefault();event.stopImmediatePropagation();
    let status=form.querySelector('.commercial-form-status');
    if(!status){status=document.createElement('p');status.className='commercial-form-status';status.id='commercial-status-'+[...document.forms].indexOf(form);status.setAttribute('role','status');status.setAttribute('aria-live','polite');form.append(status);}
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
