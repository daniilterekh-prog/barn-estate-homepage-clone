/* Reuse resort CTA layout without replacing forms, handlers, copy or image sources. */
(()=>{'use strict';
function refresh(){
 const nuxt=document.querySelector('#__nuxt')?.__vue_app__?.config.globalProperties.$nuxt;
 if(document.querySelector('#__nuxt')&&document.querySelector('script[type="module"][src]')&&(!nuxt||nuxt.isHydrating)){setTimeout(refresh,40);return;}
 if(document.body.classList.contains('owner-rent-reference-ui')&&!document.querySelector('.catalog-consultation:not(.newsletter-cta)')){setTimeout(refresh,40);return;}
 for(const root of document.querySelectorAll('.catalog-consultation,.catalog-contact')){
  if(!root.id)root.id=root.classList.contains('catalog-contact')?'resort-cta-contact':'resort-cta-consultation';
  for(const button of root.querySelectorAll('.catalog-consultation__submit,.catalog-contact__submit'))button.classList.add('ui-button','ui-button--primary','ui-button--medium');
  root.dataset.resortNode='';for(const e of root.querySelectorAll('*'))if(!e.hasAttribute('data-resort-node'))e.setAttribute('data-resort-node','');
 }
}
refresh();new MutationObserver(refresh).observe(document.documentElement,{childList:true,subtree:true});
})();
