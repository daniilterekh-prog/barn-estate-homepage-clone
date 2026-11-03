/* Connect the approved header contact control after the preserved Nuxt hydration. */
(()=>{
 'use strict';
 const pageRoot=new URL('./',document.currentScript.src);
 let counter=0;
 function annotate(root){
  for(const dialog of root.querySelectorAll('[role="dialog"]')){
   const heading=dialog.querySelector('h2,h3');
   if(heading&&!dialog.hasAttribute('aria-labelledby')){
    if(!heading.id)heading.id='media-dialog-title-'+(++counter);
    dialog.setAttribute('aria-labelledby',heading.id);
   }
  }
  for(const input of root.querySelectorAll('input:not([type="hidden"])')){
   if(![...(input.labels||[])].some(label=>label.textContent.trim())&&!input.hasAttribute('aria-label'))input.setAttribute('aria-label',input.placeholder||(input.type==='checkbox'?'Согласие на обработку персональных данных':'Контакт'));
  }
 }
 function ready(){
  const nuxt=document.querySelector('#__nuxt')?.__vue_app__?.config.globalProperties.$nuxt;
  if(!nuxt||nuxt.isHydrating){setTimeout(ready,30);return;}
  const header=document.querySelector('.site-header');
  if(header&&!header.querySelector('.media-reference-nav')){
   const nav=document.createElement('nav');nav.className='media-reference-nav';nav.setAttribute('aria-label','Направления BARN Estate');
   const list=document.createElement('ul');
   for(const [label,url] of [
    ['Москва','https://barn-estate.ru/gorodskaya-nedvizhimost/'],
    ['Загородная','https://barn-estate.ru/zagorodnaya-nedvizhimost/'],
    ['Коммерческая','https://barn-estate.ru/kommercheskaya-nedvizhimost/'],
    ['Курортная','https://barn-estate.ru/kurortnaya/'],
    ['Зарубежная','https://barn-estate.ru/mezhdunarodnaya-nedvizhimost/'],
    ['Санкт-Петербург','https://barnes-spb.ru/'],
    ['Медиа',pageRoot.href],
    ['О BARN Estate','https://barn-estate.ru/mir-barn-estate/'],
    ['Собственникам','https://barn-estate.ru/sobstvennikam/']
   ]){
    const item=document.createElement('li'),link=document.createElement('a');link.textContent=label;link.href=url;
    if(label==='Медиа')link.setAttribute('aria-current','page');item.append(link);list.append(item);
   }
   nav.append(list);header.querySelector('.site-header__inner').append(nav);
  }
  document.body.dataset.homeSpacingReady='true';
  window.__barnesHeaderContacts?.refresh();
  // Eyebrows of the shared team/newsletter sections, verbatim from the approved kit.
  for(const [selector,headingSelector,text] of [
   ['.team-section__intro','.team-section__title','Эксперты по недвижимости'],
   ['.newsletter-cta__copy','h2','Рассылка BARN Estate']
  ]){
   const parent=document.querySelector(selector),heading=parent?.querySelector(headingSelector);
   if(heading&&!parent.querySelector('.home-section-eyebrow')){
    const eyebrow=document.createElement('p');eyebrow.className='home-section-eyebrow';eyebrow.textContent=text;heading.before(eyebrow);
   }
  }
  annotate(document);
  new MutationObserver(()=>annotate(document)).observe(document.body,{childList:true,subtree:true});
  document.body.dataset.mediaKitReady='true';
 }
 ready();
})();
