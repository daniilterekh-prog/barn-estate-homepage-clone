/* Reuse resort CTA layout without replacing forms, handlers, copy or image sources. */
(()=>{'use strict';
function refresh(){
 const nuxt=document.querySelector('#__nuxt')?.__vue_app__?.config.globalProperties.$nuxt;
 if(document.querySelector('#__nuxt')&&document.querySelector('script[type="module"][src]')&&(!nuxt||nuxt.isHydrating)){setTimeout(refresh,40);return;}
 if(document.body.classList.contains('owner-rent-reference-ui')&&!document.querySelector('.catalog-consultation:not(.newsletter-cta)')){setTimeout(refresh,40);return;}
 for(const section of document.querySelectorAll('.newsletter-cta:not([data-resort-newsletter])')){
  const inner=section.querySelector('.newsletter-cta__inner'),grid=section.querySelector('.newsletter-cta__grid'),copy=section.querySelector('.newsletter-cta__copy'),visual=section.querySelector('.newsletter-cta__visual'),form=section.querySelector('form');
  if(!inner||!grid||!copy||!visual||!form)continue;
  section.dataset.resortNewsletter='';if(!section.id)section.id='resort-cta-newsletter';
  inner.classList.add('catalog-consultation__inner');grid.classList.add('catalog-consultation__grid');copy.classList.add('catalog-consultation__content');
  const media=document.createElement('div');media.className='catalog-consultation__media';inner.append(media);media.append(visual,grid);
  visual.classList.add('resort-newsletter-visual');visual.querySelector('img')?.classList.add('catalog-consultation__image');
  const overlay=document.createElement('div');overlay.className='catalog-consultation__overlay';overlay.setAttribute('aria-hidden','true');media.insertBefore(overlay,grid);
  const header=document.createElement('div');header.className='catalog-consultation__header';copy.prepend(header);
  for(const item of [...copy.children])if(item!==header&&item!==form)header.append(item);
  header.querySelector('h2')?.classList.add('catalog-consultation__subtitle');header.querySelector('.newsletter-cta__lead')?.classList.add('catalog-consultation__lead');
  form.classList.add('catalog-consultation__form');form.querySelector('input[type=email]')?.classList.add('catalog-consultation__input');form.querySelector('button[type=submit]')?.classList.add('catalog-consultation__submit');
  form.querySelector('label')?.classList.add('visually-hidden');
 }
 for(const root of document.querySelectorAll('.catalog-consultation,.catalog-contact,.newsletter-cta')){
  if(!root.id)root.id=root.classList.contains('catalog-contact')?'resort-cta-contact':'resort-cta-consultation';
  for(const button of root.querySelectorAll('.catalog-consultation__submit,.catalog-contact__submit'))button.classList.add('ui-button','ui-button--primary','ui-button--medium');
  root.dataset.resortNode='';for(const e of root.querySelectorAll('*'))if(!e.hasAttribute('data-resort-node'))e.setAttribute('data-resort-node','');
 }
}
refresh();new MutationObserver(refresh).observe(document.documentElement,{childList:true,subtree:true});
})();
