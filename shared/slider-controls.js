/* Shared below-slider navigation for owner, ambassador and Media pages. */
(()=>{'use strict';
const specs=[
 ['.owner-sale-services','.owner-sale-services__slider-wrap','.owner-sale-services__nav'],
 ['.ap-mechanics','.ap-steps','.ap-mechanics__nav'],
 ['.ap-benefits','.ap-benefit-grid','.ap-benefit-controls'],
 ['.ambassadors-advantages','.ambassadors-advantages__slider','.ambassadors-advantages__nav'],
 ['.team-section','.team-section__slider','.team-section__nav']
];
let scheduled=false;const states=new WeakMap();
function hideCounters(root,nav,header){
 for(const e of root.querySelectorAll('[class*="counter"],[class*="fraction"],[class$="__count"]')){
  if(e.closest('.splide__slide,article,.ap-benefit-grid li,[aria-live]')||e.contains(nav))continue;
  e.dataset.sliderCounter='';e.setAttribute('aria-hidden','true');e.hidden=true;
 }
 if(header)for(const e of header.querySelectorAll('span,p,div')){
  if(e.contains(nav)||e.closest('button,[aria-live]'))continue;
  if(/^\s*\d+\s*(?:\/|из|of|–|-)\s*\d+\s*$/i.test(e.textContent)){e.dataset.sliderCounter='';e.setAttribute('aria-hidden','true');e.hidden=true;}
 }
}
function setupMechanics(){
 const root=document.querySelector('.ap-mechanics'),track=root?.querySelector('.ap-steps');
 if(!track||track.hasAttribute('data-service-slider'))return;
 track.dataset.serviceSlider='';track.id='partner-mechanic-slides';track.tabIndex=0;track.setAttribute('aria-label','Этапы партнёрства');
 const nav=document.createElement('div');nav.className='ap-mechanics__nav';nav.setAttribute('aria-label','Управление этапами партнёрства');
 for(const[direction,label,path]of [['prev','Предыдущие этапы','M15 5 8 12l7 7'],['next','Следующие этапы','m9 5 7 7-7 7']]){
  const button=document.createElement('button');button.type='button';button.className='ap-mechanics__'+direction;button.setAttribute('aria-label',label);button.setAttribute('aria-controls',track.id);
  button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none"><path d="'+path+'" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>';nav.append(button);
 }
 track.after(nav);
 const[previous,next]=nav.children;
 function update(){previous.disabled=track.scrollLeft<=1;next.disabled=track.scrollLeft>=track.scrollWidth-track.clientWidth-1;}
 function move(direction){const card=track.firstElementChild;track.scrollBy({left:direction*(card.getBoundingClientRect().width+(parseFloat(getComputedStyle(track).columnGap)||0)),behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});}
 previous.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));track.addEventListener('scroll',update,{passive:true});new ResizeObserver(update).observe(track);
 track.addEventListener('keydown',event=>{if(event.target!==track)return;if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();move(event.key==='ArrowRight'?1:-1);}else if(event.key==='Home'||event.key==='End'){event.preventDefault();track.scrollTo({left:event.key==='Home'?0:track.scrollWidth,behavior:'instant'});}});
 update();
}
function serviceAction(root){
 let cta=root.querySelector('.owner-sale-services__cta');if(cta)return cta;
 cta=document.createElement('a');cta.className='ui-button ui-button--primary ui-button--medium owner-sale-services__cta';cta.href='#request';
 cta.innerHTML=(document.body.classList.contains('owner-rent-reference-ui')?'Обсудить стратегию сдачи':'Обсудить стратегию продажи')+' <span aria-hidden="true"><svg viewBox="0 0 16 16" focusable="false"><path d="M3 13 13 3M5 3h8v8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25"/></svg></span>';
 root.append(cta);return cta;
}
function refresh(){
 scheduled=false;const nuxt=document.querySelector('#__nuxt')?.__vue_app__?.config.globalProperties.$nuxt;
 if(document.querySelector('#__nuxt')&&document.querySelector('script[type="module"][src]')&&(!nuxt||nuxt.isHydrating)){setTimeout(schedule,40);return;}
 setupMechanics();
 for(const[section,trackSelector,navSelector]of specs)for(const root of document.querySelectorAll(section)){
  const track=root.querySelector(trackSelector),nav=root.querySelector(navSelector);if(!track||!nav)continue;
  let state=states.get(root);if(!state){state={header:nav.parentElement};states.set(root,state);}
  hideCounters(root,nav,state.header);
  const parent=track.parentElement;
  let footer=state.footer;
  if(!footer?.isConnected){
   if(nav.parentElement===parent&&nav.previousElementSibling===track&&!root.matches('.owner-sale-services,.ap-mechanics'))footer=nav;
   else{footer=document.createElement('div');if(!parent.classList.contains('base-container'))footer.classList.add('base-container');}
   footer.classList.add('barn-slider-footer');footer.dataset.sliderFooter='';state.footer=footer;
  }
  if(footer!==nav&&nav.parentElement!==footer)footer.append(nav);
  if(footer.previousElementSibling!==track)track.after(footer);
  if(root.matches('.owner-sale-services,.ap-mechanics')){
   const cta=root.matches('.owner-sale-services')?serviceAction(root):root.querySelector('.ap-action');
   if(cta&&cta.parentElement!==footer)footer.prepend(cta);
  }
  nav.dataset.sliderNavigation='';
  for(const[k,v]of Object.entries({display:'flex',position:'static',transform:'none',margin:'0',padding:'0',width:'auto',height:'auto'}))nav.style.setProperty(k,v,'important');
  for(const b of nav.querySelectorAll('button'))b.style.setProperty('display','flex','important');
  const style=getComputedStyle(parent),parentGap=/grid|flex/.test(style.display)?parseFloat(style.rowGap)||0:0;
  footer.style.marginTop=((innerWidth<=540?24:28)-parentGap)+'px';
  if(footer===nav)nav.style.setProperty('margin-top',((innerWidth<=540?24:28)-parentGap)+'px','important');
 }
}
function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(refresh);}}
schedule();new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});window.addEventListener('resize',schedule,{passive:true});document.fonts?.ready.then(schedule);
})();
