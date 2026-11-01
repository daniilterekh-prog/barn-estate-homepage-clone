/* International flow, using the approved homepage quiz v1.0.0 visual contract. */
(() => {
 'use strict';
 if(window.BarnesInternationalQuiz)return;
 const countries=['Таиланд','ОАЭ','Грузия','Турция','Азербайджан','Другие страны'];
 const purposes=['Для жизни','Для отдыха','Для инвестиций','Пока выбираю'];
 const unsure='Бюджет пока не определён';
 let host=null,returnFocus=null,restore=null;
 function close(){
  if(!host)return;
  host.remove();host=null;restore?.();restore=null;
  const target=returnFocus;returnFocus=null;if(target?.isConnected)target.focus({preventScroll:true});
 }
 function objectFrom(trigger){
  const card=trigger?.closest('.apartment-card');
  if(!card)return null;
  const link=card.querySelector('.apartment-card__media-link,.apartment-card__link,.apartment-card__name[href]');
  const title=card.querySelector('.apartment-card__name-text,.apartment-card__name');
  return link?{href:link.href,name:title?.textContent.trim()||'Объект из каталога',country:card.closest('[data-country]')?.dataset.country||card.querySelector('.launch-card__region')?.textContent.trim()||''}:null;
 }
 function open({trigger=document.activeElement,context=objectFrom(trigger),channel=context?'Звонок':'Telegram',prefill=null}={}){
  if(host){host.querySelector('[role=dialog]').focus({preventScroll:true});return;}
  const template=document.querySelector('#international-quiz-template');if(!template)return;
  returnFocus=trigger;host=template.content.firstElementChild.cloneNode(true);
  const dialog=host.querySelector('[role=dialog]'),frame=host.querySelector('.modal__content'),body=host.querySelector('.home-owner-form__body');
  const title=host.querySelector('h2'),intro=host.querySelector('.home-owner-form__intro'),panel=host.querySelector('.home-quiz__panel'),summary=host.querySelector('.home-quiz__summary');
  const form=host.querySelector('form'),name=form.elements.name,phone=form.elements.phone,consent=form.elements.consent,status=form.querySelector('[data-owner-status]');
  const back=host.querySelector('.home-quiz__back'),progress=host.querySelector('.home-quiz__progress'),bar=host.querySelector('.home-quiz__track span');
  const answers={purpose:'',country:context?.country||'',budget:'',currency:'₽'};
  let step=context?'contact':'purpose';
  const sourceForm=trigger?.closest('form');
  prefill=prefill||{name:sourceForm?.querySelector('[autocomplete=name]')?.value||'',phone:sourceForm?.querySelector('[autocomplete=tel],input[type=tel]')?.value||'',channel:sourceForm?.querySelector('[name=preferredChannel]')?.value};
  name.value=prefill.name||'';phone.value=prefill.phone||'';
  form.elements.objectUrl.value=context?.href||'';form.elements.objectName.value=context?.name||'';
  function select(value){
   if(!['Telegram','WhatsApp','MAX','Звонок'].includes(value))value='Telegram';
   form.elements.preferredChannel.value=value;
   form.querySelectorAll('[data-channel]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.channel===value)));
   host.querySelector('[data-phone-label]').textContent=value==='Звонок'?'Ваш номер телефона':'Номер телефона в '+value;
   phone.placeholder='+7 900 000-00-00';
  }
  select(context?channel:prefill.channel||channel);
  function focusStep(){title.focus({preventScroll:true});}
  function sync(){form.elements.quizAnswers.value=JSON.stringify(answers);}
  function move(next){step=next;render();frame.scrollTop=0;body.scrollTop=0;focusStep();}
  function next(callback,disabled){const b=document.createElement('button');b.type='button';b.className='home-quiz__next';b.dataset.quizNext='';b.textContent=step==='budget'?'К контактам →':'Далее →';b.disabled=disabled;b.addEventListener('click',callback);panel.append(b);return b;}
  function choices(values,key){
   const group=document.createElement('div');group.className='home-quiz__options';group.setAttribute('role','group');group.setAttribute('aria-labelledby',title.id);
   for(const value of values){const b=document.createElement('button');b.type='button';b.className='home-quiz__option';b.textContent=value;b.setAttribute('aria-pressed',String(answers[key]===value));b.addEventListener('click',()=>{answers[key]=value;group.querySelectorAll('button').forEach(other=>other.setAttribute('aria-pressed',String(other===b)));panel.querySelector('[data-quiz-next]').disabled=false;sync();});group.append(b);}
   panel.append(group);
  }
  function budgetValid(value){return value===unsure||Number(value.match(/\d+(?:[.,]\d+)?/)?.[0]?.replace(',','.'))>0;}
  function render(){
   panel.replaceChildren();summary.replaceChildren();status.textContent='';
   const contact=step==='contact';host.dataset.quizStep=step;
   form.hidden=!contact;panel.hidden=contact;summary.hidden=!contact;back.hidden=step==='purpose'||!!context;
   const index={purpose:1,country:2,budget:3,contact:4}[step];
   progress.textContent=context?'Консультация по выбранному объекту':contact?'Шаг 4 из 4 · Контакты':`Вопрос ${index} из 3 · затем контакты`;
   bar.style.width=index*25+'%';
   intro.textContent=step==='purpose'?'Ответьте на три вопроса — Денис Перковский учтёт ваши пожелания.':step==='country'?'Выберите страну, в которой вы рассматриваете покупку.':step==='budget'?'Укажите ориентир или выберите вариант «Бюджет пока не определён».':'Выберите удобный способ связи с экспертом по зарубежной недвижимости.';
   if(step==='purpose'){title.textContent='Для чего вы рассматриваете недвижимость?';choices(purposes,'purpose');next(()=>move('country'),!answers.purpose);}
   if(step==='country'){title.textContent='В какой стране вы рассматриваете недвижимость?';choices(countries,'country');next(()=>move('budget'),!answers.country);}
   if(step==='budget'){
    title.textContent='На какой бюджет вы ориентируетесь?';
    const fields=document.createElement('div');fields.className='home-quiz__budget';
    fields.innerHTML='<label>Бюджет или диапазон<input name="budget" type="text" inputmode="decimal" maxlength="60" autocomplete="off"></label><label>Валюта<select name="currency" aria-label="Валюта бюджета"><option>₽</option><option>$</option><option>€</option></select></label>';
    panel.append(fields);const input=fields.querySelector('input'),currency=fields.querySelector('select');
    input.value=answers.budget===unsure?'':answers.budget;currency.value=answers.currency;
    const placeholder=()=>input.placeholder=currency.value==='₽'?'Например, 30–50 млн':'Например, 300–500 тыс.';placeholder();
    const unknown=document.createElement('button');unknown.type='button';unknown.className='home-quiz__option';unknown.textContent=unsure;unknown.setAttribute('aria-pressed',String(answers.budget===unsure));panel.append(unknown);
    const proceed=next(()=>move('contact'),!budgetValid(answers.budget));
    unknown.addEventListener('click',()=>{answers.budget=unsure;input.value='';unknown.setAttribute('aria-pressed','true');proceed.disabled=false;sync();});
    input.addEventListener('input',()=>{answers.budget=input.value.trim();unknown.setAttribute('aria-pressed','false');proceed.disabled=!budgetValid(answers.budget);sync();});
    currency.addEventListener('change',()=>{answers.currency=currency.value;placeholder();sync();});
   }
   if(contact){
    title.textContent='Как с вами связаться?';
    const text=document.createElement('p');text.textContent=context?[context.name,context.country].filter(Boolean).join(' · '):[answers.purpose,answers.country,answers.budget===unsure?unsure:answers.budget?answers.budget+' '+answers.currency:''].filter(Boolean).join(' · ')||'Консультация по зарубежной недвижимости';summary.append(text);
    if(!context){const edit=document.createElement('button');edit.type='button';edit.textContent='Изменить ответы';edit.addEventListener('click',()=>move('purpose'));summary.append(edit);}
    form.querySelector('[type=submit]').textContent=context?'Обсудить объект':'Получить подборку';
   }else{
    const skip=document.createElement('button');skip.type='button';skip.className='home-quiz__skip';skip.textContent='Сразу перейти к контактам';skip.addEventListener('click',()=>move('contact'));panel.append(skip);
   }
   sync();
  }
  back.addEventListener('click',()=>move(step==='contact'?'budget':step==='budget'?'country':'purpose'));
  host.addEventListener('click',event=>{const channelButton=event.target.closest('[data-channel]');if(channelButton)select(channelButton.dataset.channel);if(event.target.closest('[data-quiz-close]')||event.target===dialog||event.target.classList.contains('vfm__overlay'))close();});
  host.addEventListener('keydown',event=>{
   if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close();return;}
   if(event.key!=='Tab')return;
   const items=[...host.querySelectorAll('button,a[href],input:not([type=hidden]),textarea,select,[tabindex="0"]')].filter(e=>!e.disabled&&e.tabIndex>=0&&e.getClientRects().length&&!e.closest('[hidden]'));
   const first=items[0],last=items.at(-1);
   if(!host.contains(document.activeElement)){event.preventDefault();first?.focus();}
   else if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
  });
  form.addEventListener('input',event=>{if(event.target.matches('[aria-invalid=true]')){event.target.removeAttribute('aria-invalid');status.textContent='';}});
  const invalid=(field,message)=>{field.setAttribute('aria-invalid','true');field.setAttribute('aria-describedby',status.id);status.textContent=message;field.focus();};
  form.addEventListener('submit',event=>{
   event.preventDefault();[name,phone,consent].forEach(e=>e.removeAttribute('aria-invalid'));
   if(!name.value.trim())return invalid(name,'Укажите ваше имя.');
   const digits=phone.value.replace(/\D/g,'');if(digits.length<7||digits.length>15)return invalid(phone,'Укажите корректный номер телефона, включая код страны.');
   if(!consent.checked)return invalid(consent,'Подтвердите согласие на обработку персональных данных.');
   status.textContent='В превью отправка заявок не подключена. Данные не отправлены. Для обращения к эксперту: +7 (495) 182-50-79.';
   // Integration seam only: no fetch/POST, CRM, analytics or persistent personal data.
   form.dispatchEvent(new CustomEvent('barn:lead',{bubbles:true,detail:{form,data:Object.fromEntries(new FormData(form)),status:'preview'}}));
  });
  render();
  const inert=[...document.body.children].filter(e=>e instanceof HTMLElement&&!['SCRIPT','STYLE','LINK'].includes(e.tagName)).map(e=>[e,e.inert]);
  const root=document.documentElement,overflow=root.style.overflow,gutter=root.style.scrollbarGutter;
  document.body.append(host);inert.forEach(([e])=>e.inert=true);root.style.scrollbarGutter='stable';root.style.overflow='hidden';
  restore=()=>{inert.forEach(([e,value])=>e.inert=value);root.style.overflow=overflow;root.style.scrollbarGutter=gutter;};
  dialog.focus({preventScroll:true});requestAnimationFrame(()=>{if(host?.contains(title))focusStep();});
 }
 const inlineSelector='.catalog-consultation__form,.catalog-contact__form';
 document.addEventListener('click',event=>{const button=event.target.closest('button[type=submit]');if(button?.closest(inlineSelector)){event.preventDefault();event.stopImmediatePropagation();open({trigger:button});}},true);
 document.addEventListener('submit',event=>{if(event.target.matches(inlineSelector)){event.preventDefault();event.stopImmediatePropagation();open({trigger:event.target.querySelector('[type=submit]')});}},true);
 window.BarnesInternationalQuiz={open,close};
 // The existing expert card must not cover the footer's entry to this quiz.
 const footerAction=document.querySelector('.site-footer__callback-btn');
 if(footerAction)new IntersectionObserver(([entry])=>document.body.dataset.internationalFooterActionVisible=String(entry.isIntersecting)).observe(footerAction);
})();
