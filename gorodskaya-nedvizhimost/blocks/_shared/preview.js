/* Component previews expose UI state/events, never pretend to call a production API. */
(async()=>{
 const host=document.querySelector('#preview'),id=document.body.dataset.cityPreview;
 const root=new URL('../../',location.href);
 const load=file=>new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=new URL('js/'+file,root);script.onload=resolve;script.onerror=reject;document.body.append(script)});
 if(id==='request-modal'){
   await load('node-modal.js');
   const button=document.createElement('button');button.className='catalog-sticky__request';button.textContent='Открыть форму';host.append(button);button.click();
 }else if(id==='filters-modal'){
   await load('filters-template.js');await load('filters-modal.js');
   const button=document.createElement('button');button.className='catalog-mode-detailed-filters';button.textContent='Открыть фильтры';host.append(button);button.click();
 }else if(id==='map-panel'){
   host.innerHTML='<div class="catalog-projects-map"><button class="catalog-projects-map__fullscreen">На весь экран</button></div>';
   await load('city-map-projects.js');await load('city-map-fullscreen.js');await load('filters-template.js');await load('filters-modal.js');await load('quick-filters.js');await load('brand-filters.js');
   host.querySelector('button').click();
 }else{
   const file=matchMedia('(max-width:540px)').matches?'mobile.html':'fragment.html';
   const r=await fetch(file);if(!r.ok)throw Error(file);host.innerHTML=await r.text();
   host.querySelectorAll('.catalog-faq__question').forEach(button=>button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));button.closest('.catalog-faq__item').classList.toggle('catalog-faq__item--open',open)}));
   host.querySelectorAll('[data-mode]').forEach(button=>button.addEventListener('click',()=>{host.querySelectorAll('.catalog-grid__item').forEach(item=>item.hidden=item.dataset.listingMode!==button.dataset.mode)}));
   host.querySelectorAll('.launch-card__favorite,.apartment-card__favorite').forEach(button=>button.addEventListener('click',()=>button.setAttribute('aria-pressed',String(button.getAttribute('aria-pressed')!=='true'))));
   host.querySelectorAll('form').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();form.dispatchEvent(new CustomEvent('barnes:request',{bubbles:true}))}));
   if(id==='listing'){
     await load('filters-template.js');await load('filters-modal.js');await load('quick-filters.js');await load('brand-filters.js');
   }
   if(id==='news')await load('news-slider.js');
   if(id==='map'){
     await load('city-map-projects.js');await load('city-map-fullscreen.js');await load('filters-template.js');await load('filters-modal.js');await load('quick-filters.js');await load('brand-filters.js');
   }
   if(['cta-bottom','floating-expert','sticky-nav','card-project','card-lot'].includes(id))await load('node-modal.js');
 }
 if(id.startsWith('card-')){host.style.maxWidth='440px';host.style.margin='24px auto'}
 document.body.dataset.previewReady='true';
})().catch(error=>{document.body.dataset.previewError=error.message;console.error(error)});
