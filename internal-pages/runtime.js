/* Child context adapter. Visual components and native controls belong to the five nodes. */
(()=>{
 'use strict';const config=JSON.parse(document.getElementById('internal-page-data').textContent);let initialized=false,queued=false;
 function refresh(){queued=false;
  const crumb=document.querySelector('.page-breadcrumbs [aria-current="page"]');if(crumb&&crumb.textContent!==config.h1)crumb.textContent=config.h1;
  const title=document.querySelector('.catalog-grid__title');if(title&&title.textContent!==config.listingTitle)title.textContent=config.listingTitle;
  for(const a of document.querySelectorAll('a[href^="#"]'))a.href=location.pathname+a.getAttribute('href');
  for(const a of document.querySelectorAll('a[href]')){const url=new URL(a.getAttribute('href'),document.baseURI),key=url.pathname.replace(/^\/|\/$/g,'');if(['front.barnes.vsavr.ru','barn-estate.ru'].includes(url.hostname)&&key in config.routes)a.href='/barn-estate-homepage-clone/'+config.routes[key]+'/'+url.search+url.hash;else if(key.endsWith('katalog-nedvizhimosti'))a.href='/barn-estate-homepage-clone/katalog-nedvizhimosti/'+url.search;}
  for(const a of document.querySelectorAll('a.catalog-sticky__link,a.catalog-page-nav__link')){const hash=new URL(a.getAttribute('href')||'',document.baseURI).hash,target=hash&&document.querySelector(hash);if(!target||target.closest('[data-internal-omitted]'))a.closest('li')?.setAttribute('hidden','');}
  if(!initialized&&document.querySelector('.catalog-mode-toolbar[data-node-filters-ready]')){
   initialized=true;
   if(config.parent==='country'){window.countryListing?.setMarket(config.market==='secondary'?'lot':'project');window.countryListing?.setDeal(config.deal);const map=document.querySelector('.catalog-projects-map');if(map){map.dataset.internalMap='';document.body.append(map);}}
   else window.BarnesFilters?.patch(config.parent==='commercial'?{dealType:config.deal==='rent'?'rent':'purchase'}:{market:config.market,deal:config.deal});
   document.dispatchEvent(new CustomEvent('barnes:node-deal-change'));
  }
 }
 const observer=new MutationObserver(()=>{if(!queued){queued=true;requestAnimationFrame(refresh);}});observer.observe(document.body,{childList:true,subtree:true});
 document.addEventListener('barnes:node-filters-ready',refresh);document.addEventListener('DOMContentLoaded',refresh);refresh();
 document.addEventListener('click',e=>{const request=e.target.closest('[data-internal-request]');if(request){e.preventDefault();window.BarnNodeQuiz?.open({trigger:request});}});
 document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-internal-request]')){e.preventDefault();e.target.click();}});
 // The header search also searches the reused editorial rows on the developer directory.
 if(config.blocks.includes('developers'))document.querySelector('.catalog-hero-filters__bar')?.addEventListener('submit',e=>{e.preventDefault();const query=e.currentTarget.querySelector('input')?.value.toLocaleLowerCase('ru')||'';document.querySelectorAll('[data-internal-block="developer"]').forEach(el=>el.hidden=!el.textContent.toLocaleLowerCase('ru').includes(query));});
})();
