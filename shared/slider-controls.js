/* Shared below-slider navigation for owner, ambassador and Media pages. */
(()=>{'use strict';
const specs=[
 ['.owner-sale-services','.owner-sale-services__slider-wrap','.owner-sale-services__nav'],
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
function refresh(){
 scheduled=false;const nuxt=document.querySelector('#__nuxt')?.__vue_app__?.config.globalProperties.$nuxt;
 if(document.querySelector('#__nuxt')&&document.querySelector('script[type="module"][src]')&&(!nuxt||nuxt.isHydrating)){setTimeout(schedule,40);return;}
 for(const[section,trackSelector,navSelector]of specs)for(const root of document.querySelectorAll(section)){
  const track=root.querySelector(trackSelector),nav=root.querySelector(navSelector);if(!track||!nav)continue;
  let state=states.get(root);if(!state){state={header:nav.parentElement};states.set(root,state);}
  hideCounters(root,nav,state.header);
  const parent=track.parentElement;
  let footer=state.footer;
  if(!footer?.isConnected){
   if(nav.parentElement===parent&&nav.previousElementSibling===track)footer=nav;
   else{footer=document.createElement('div');if(!parent.classList.contains('base-container'))footer.classList.add('base-container');}
   footer.classList.add('barn-slider-footer');footer.dataset.sliderFooter='';state.footer=footer;
  }
  if(footer!==nav&&nav.parentElement!==footer)footer.append(nav);
  if(footer.previousElementSibling!==track)track.after(footer);
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
