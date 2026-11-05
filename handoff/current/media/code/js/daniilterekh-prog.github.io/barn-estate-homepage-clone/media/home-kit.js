/* Connect the approved header contact control after the preserved Nuxt hydration. */
(()=>{
 'use strict';
 const pageRoot=new URL('./',document.currentScript.src);
 let counter=0;
 function annotate(root){
  // The preserved Media header omits search; restore the standard icon after favourites.
  const favorites=root.querySelector('.site-header__favorites-btn');
  if(favorites&&!favorites.parentElement.querySelector('.site-header__search-btn')){
   const search=document.createElement('a');
   search.className='site-header__search-btn';
   search.setAttribute('data-media-header-search','');
   search.href='https://daniilterekh-prog.github.io/barn-estate-homepage-clone/katalog-nedvizhimosti/';
   search.setAttribute('aria-label','Поиск недвижимости');
   search.setAttribute('data-v-63dbb988','');
   search.innerHTML='<svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';
   favorites.after(search);
  }

  // One article appears in both editorial choice and the analytics section.
  const analyticsSrc=new URL('pictures/media/moscow-q1-2026-photo.webp',pageRoot).href;
  for(const image of root.querySelectorAll('img[src*="ac08b5bc4b40.png"]')){
   image.removeAttribute('srcset');image.src=analyticsSrc;image.width=1920;image.height=1280;
  }
  const moscow=root.querySelector('.media-market__featured-image');
  const moscowSrc=new URL('pictures/media/moscow-editorial-20261103.webp',pageRoot).href;
  if(moscow&&moscow.src!==moscowSrc){moscow.removeAttribute('srcset');moscow.src=moscowSrc;moscow.width=1774;moscow.height=887;}
  // Apply the generated publication after hydration without changing Nuxt chunks.
  const publication=root.querySelector('.media-library__image');
  const publicationSrc=new URL('pictures/media/library-editorial-20261103.webp',pageRoot).href;
  if(publication&&publication.src!==publicationSrc){publication.removeAttribute('srcset');publication.src=publicationSrc;publication.width=2046;publication.height=768;}
  const avatar=root.querySelector('.floating-expert__avatar img');
  const portrait=new URL('quiz/assets/owner-modal-prus.webp',pageRoot).href;
  if(avatar&&avatar.src!==portrait){avatar.removeAttribute('srcset');avatar.src=portrait;avatar.width=1086;avatar.height=1448;avatar.loading='eager';}

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
  // Remove the redundant digest block after Nuxt hydration. Keep the hero
  // subscription shortcut pointing to the shared newsletter below the page.
  document.querySelector('.media-subscribe')?.remove();
  const newsletter=document.querySelector('.newsletter-cta');
  if(newsletter)newsletter.id='subscribe';
  document.body.dataset.homeSpacingReady='true';
  window.__barnesHeaderContacts?.refresh();
  window.__barnesOwnerForm?.refresh();
  // Explicit section-heading roles from the homepage kit. A single wrapper
  // prevents the section gap being added between the eyebrow and its H2.
  const headings=[
   ['.media-weekly__title','Выбор редакции'],
   ['.media-market__title','Направления BARN Estate'],
   ['.media-fresh__title','Медиа BARN Estate'],
   ['.media-analytics__title','Аналитика BARN Estate'],
   ['.media-cta-banner__title','Консультация BARN Estate'],
   ['.media-library__title','Издания BARN Estate']
  ];
  for(const [selector,text] of headings){
   const heading=document.querySelector(selector);if(!heading||heading.closest('.media-kit-heading'))continue;
   const group=document.createElement('div');group.className='media-kit-heading';
   const eyebrow=document.createElement('p');eyebrow.className='home-section-eyebrow';eyebrow.textContent=text;
   heading.before(group);group.append(eyebrow,heading);
  }
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
  new MutationObserver(()=>annotate(document)).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});
  document.body.dataset.mediaKitReady='true';
 }
 ready();
})();
