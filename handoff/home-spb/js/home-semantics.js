/* Shared semantic/form annotations; no layout changes and no submission backend. */
(()=>{
 if(window.__barnesSemantics)return;
 const all=selector=>[...document.querySelectorAll(selector)].filter(el=>document.body.classList.contains('barnes-home-typography')||el.closest('.barnes-block'));
 const set=(el,name,value)=>{if(el&&el.getAttribute(name)!==value)el.setAttribute(name,value)};
 function refresh(){
  if(document.body.classList.contains('barnes-home-typography')||document.body.hasAttribute('data-barn-home-page'))set(document.documentElement,'lang','ru');
  for(const list of all('.splide__list'))set(list,'role','list');
  for(const slide of all('.splide__slide')){
   set(slide,'role','listitem');
   const hidden=slide.getAttribute('aria-hidden')==='true';if(slide.inert!==hidden)slide.inert=hidden;
  }
  for(const form of all('.home-hero-filters__bar')){
   set(form,'role','search');set(form,'aria-label','Подбор недвижимости');
   const input=form.querySelector('input[type=search]');set(input,'aria-label','Поиск по ID, названию ЖК или адресу');set(input,'name','query');
  }
  for(const form of all('.newsletter-form')){
   set(form,'aria-label','Подписка на новости BARN Estate');
   const email=form.querySelector('input[type=email]');if(email){email.required=true;set(email,'autocomplete','email')}
  }
  for(const form of all('.home-owner-form__form')){
   set(form,'aria-labelledby','home-owner-form-title');
   for(const name of['name','phone']){const input=form.querySelector('[name="'+name+'"]');if(!input)continue;set(input,'id','home-owner-'+name);set(input,'aria-describedby','home-owner-form-status');set(input.closest('label'),'for',input.id)}
   const consent=form.querySelector('input[type=checkbox]');if(consent){set(consent,'id','home-owner-consent');set(consent,'name','consent');set(consent,'value','yes');set(consent,'aria-describedby','home-owner-form-status');set(consent.closest('label'),'for',consent.id)}
  }
 }
 let pending=false;
 const observer=new MutationObserver(()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;refresh()})});
 function start(){refresh();observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['aria-hidden','role']})}
 window.__barnesSemantics={refresh};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
