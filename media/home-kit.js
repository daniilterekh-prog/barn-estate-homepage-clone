/* Connect the approved header contact control after the preserved Nuxt hydration. */
(()=>{
 'use strict';
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
