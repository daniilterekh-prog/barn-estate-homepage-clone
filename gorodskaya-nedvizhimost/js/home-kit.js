/* City integration for approved homepage UI-kit v1.0.0, without altering object data. */
(()=>{
 const assets=new URL('../assets/',document.currentScript.src);
 const phoneArtwork='<circle cx="12" cy="12" r="12" fill="#2BB673"/><g transform="translate(3 3) scale(.75)" fill="white"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/></g>';
 function brand(root){
  const walk=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;
  while((node=walk.nextNode())){
   if(node.parentElement?.closest('script,style,.apartment-card__name,.home-rec-card__name'))continue;
   const text=node.nodeValue,next=text.replace(/BARN Estate|BARN Estate/g,'BARN Estate')
    .replace(/(Эксперты|Эксперт|Экспертиза|Выбор|Эксклюзив|Рассылка|Медиа) BARNES/g,'$1 BARN Estate')
    .replace(/О BARN Estate/g,'О BARN Estate').replace(/в портфеле BARN Estate/g,'в портфеле BARN Estate')
    .replace(/©\s*BARNES/g,'© BARN Estate');
   if(next!==text)node.nodeValue=next;
  }
 }
 function contacts(){
    if(document.querySelector('script[src*="node-shell.js"]'))return;
  for(const svg of document.querySelectorAll('.catalog-header-contact--phone svg,.catalog-sticky__phone svg')){
   svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('stroke','none');svg.innerHTML=phoneArtwork;
  }
  const header=document.querySelector('.layout__header .site-header'),top=header?.querySelector('.site-header__top'),source=header?.querySelector('.catalog-header-contacts');
  if(!top||!source||top.querySelector('.city-header-contact-toggle'))return;
  const toggle=document.createElement('button');toggle.type='button';toggle.className='city-header-contact-toggle';
  toggle.setAttribute('aria-label','Показать способы связи');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-controls','city-hero-contacts');
  toggle.innerHTML=document.querySelector('.catalog-sticky__contact-toggle')?.innerHTML||'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.8 9.8 0 0 1-4-.9L3 21l1.7-4.6A8.4 8.4 0 1 1 21 11.5Z"/></svg>';
  const panel=source.cloneNode(true);panel.className='city-header-contact-panel';panel.id='city-hero-contacts';panel.hidden=true;
  top.append(toggle,panel);
  const stickyToggle=document.querySelector('.catalog-sticky__contact-toggle'),stickyPanel=document.querySelector('.catalog-sticky__contact-panel');
  function close(restore=false){
   const wasOpen=!panel.hidden;panel.hidden=true;toggle.setAttribute('aria-expanded','false');
   if(restore&&wasOpen)toggle.focus({preventScroll:true});
  }
  toggle.addEventListener('click',()=>{const opening=panel.hidden;panel.hidden=!opening;toggle.setAttribute('aria-expanded',String(opening))});
  document.addEventListener('click',e=>{if(!toggle.contains(e.target)&&!panel.contains(e.target))close()});
  document.addEventListener('keydown',e=>{
   if(e.key!=='Escape')return;
   if(!panel.hidden){e.preventDefault();e.stopImmediatePropagation();close(true)}
   else if(stickyPanel&&!stickyPanel.hidden){e.preventDefault();stickyPanel.hidden=true;stickyToggle?.setAttribute('aria-expanded','false');stickyToggle?.focus()}
  },true);
  window.addEventListener('resize',()=>close());
 }
 function apply(){
  document.body.classList.add('city-home-kit');
  brand(document.body);
  for(const image of document.querySelectorAll('.site-header__logo img,.catalog-sticky__logo img,.site-footer__logo img')){
   image.src=new URL('barn-estate-logo.svg',assets);image.alt='BARN Estate';
  }
  const portrait=document.querySelector('.floating-expert--ruslan .floating-expert__avatar img');
  if(portrait){portrait.src=new URL('owner-modal-prus.webp',assets);portrait.alt='Руслан Прус — BARN Estate';}
  contacts();
  for(const button of document.querySelectorAll('.catalog-sticky__request,.floating-expert__card,.site-footer__callback-btn,.apartment-card__call-btn'))button.setAttribute('aria-haspopup','dialog');
  const container=document.querySelector('.catalog-best-offers__container'),row=document.querySelector('.catalog-best-offers__slider-row');
  if(container&&row){
   new ResizeObserver(([entry])=>{
    const width=entry.contentRect.width+'px';
    if(row.style.getPropertyValue('--city-content-width')!==width){row.style.setProperty('--city-content-width',width);window.dispatchEvent(new Event('resize'))}
   }).observe(container);
  }
  const nodes=new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes)if(node.nodeType===1)brand(node)});
  nodes.observe(document.body,{childList:true,subtree:true});
  document.body.dataset.cityHomeKitReady='true';
 }
 if(document.body.classList.contains('city-reference-synced')||document.body.dataset.cityPreview)apply();else{
  const observer=new MutationObserver(()=>{if(document.body.classList.contains('city-reference-synced')){observer.disconnect();apply()}});
  observer.observe(document.body,{attributes:true,attributeFilter:['class']});
 }
})();
