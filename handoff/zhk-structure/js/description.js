/* Read-more sized to the adjacent photo; complete text remains in the document. */
(()=>{
  'use strict';
  const section=document.querySelector('#architecture');
  const body=section?.querySelector('.project-description__body');
  const text=body?.querySelector('.project-description__text');
  const button=body?.querySelector('.project-description__toggle');
  if(!body||!text||!button)return;
  let expanded=false,frame=0;
  const originalTabs=new WeakMap();
  function syncLinks(collapsed){
    const bounds=text.getBoundingClientRect();
    const visibleBottom=bounds.bottom-parseFloat(getComputedStyle(text).fontSize)*1.5;
    text.querySelectorAll('a[href],button,input,select,textarea,[tabindex]').forEach(link=>{
      if(!originalTabs.has(link))originalTabs.set(link,link.getAttribute('tabindex'));
      if(collapsed&&link.getBoundingClientRect().bottom>visibleBottom){link.setAttribute('tabindex','-1');}
      else{const original=originalTabs.get(link);if(original===null)link.removeAttribute('tabindex');else link.setAttribute('tabindex',original);}
    });
  }
  function measure(){
    frame=0;
    const style=getComputedStyle(text);
    const line=parseFloat(style.lineHeight)||parseFloat(style.fontSize)*1.5;
    const photo=section.querySelector('.project-description__image img');
    const photoHeight=photo?.getBoundingClientRect().height||0;
    const beside=window.matchMedia('(min-width:768px)').matches&&photoHeight>0;
    const limit=beside?photoHeight:line*8;
    const fullHeight=text.scrollHeight;
    if(fullHeight<=limit+1){
      body.dataset.descriptionCollapsed='false';body.style.removeProperty('--description-preview-height');
      button.hidden=true;button.setAttribute('aria-expanded',String(expanded));syncLinks(false);return;
    }
    button.hidden=false;
    button.textContent=expanded?'Свернуть':'Читать далее';
    button.setAttribute('aria-expanded',String(expanded));
    const preview=Math.max(line*2,Math.floor(limit-button.getBoundingClientRect().height-16));
    body.style.setProperty('--description-preview-height',`${preview}px`);
    body.dataset.descriptionCollapsed=String(!expanded);
    syncLinks(!expanded);
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(measure);}
  button.addEventListener('click',()=>{
    expanded=!expanded;measure();
    if(!expanded)requestAnimationFrame(()=>{
      const bounds=button.getBoundingClientRect();
      if(bounds.top<110||bounds.bottom>innerHeight-90)button.scrollIntoView({block:'nearest',behavior:'instant'});
    });
  });
  if(window.ResizeObserver){
    const observer=new ResizeObserver(schedule);observer.observe(text);
    const photo=section.querySelector('.project-description__image');if(photo)observer.observe(photo);
  }
  new MutationObserver(schedule).observe(text,{childList:true,subtree:true,characterData:true});
  window.addEventListener('resize',schedule,{passive:true});
  section.querySelector('.project-description__image img')?.addEventListener('load',schedule);
  document.fonts?.ready.then(schedule);
  measure();section.dataset.descriptionReady='true';
})();
