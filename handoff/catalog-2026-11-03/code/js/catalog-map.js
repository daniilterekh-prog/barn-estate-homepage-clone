/* Fullscreen resort-map view backed by the catalogue's single result snapshot. */
(()=>{
 'use strict';
 const api=window.BarnesCatalogListing,trigger=document.querySelector('[data-open-map]');
 const dialog=document.querySelector('#catalog-map-template').content.firstElementChild.cloneNode(true);
 dialog.id='catalog-map-dialog';document.body.append(dialog);trigger.setAttribute('aria-controls',dialog.id);
 const $=selector=>dialog.querySelector(selector),panel=$('.map-browser__panel'),handle=$('.map-browser__handle');
 const query=$('input[type=search]'),direction=$('[data-map-direction]'),sort=$('[data-map-sort]'),list=$('.map-browser__list');
 const market=$('[data-map-market]');
 const modes=[...dialog.querySelectorAll('[data-map-mode]')],profiles=window.BarnesCatalogProfiles;
 for(const [value,profile] of Object.entries(profiles)){const option=document.createElement('option');option.value=value;option.textContent=profile.label;direction.append(option);}
 sort.replaceChildren(...[...document.querySelector('.catalog-grid__sort select').options].map(option=>option.cloneNode(true)));
 let zoom=1,saved=null,isolated=[];
 function isolate(element){
  if(element!==dialog&&!['SCRIPT','STYLE','LINK'].includes(element.tagName)&&!isolated.some(([node])=>node===element)){isolated.push([element,element.inert]);element.inert=true;}
 }
 const observer=new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(node=>{if(node instanceof HTMLElement)isolate(node);}))); 
 function setZoom(value){zoom=Math.max(1,Math.min(3,value));$('.map-browser__backdrop img').style.transform=`scale(${zoom})`;$('[data-map-zoom=in]').disabled=zoom===3;$('[data-map-zoom=out]').disabled=zoom===1;}
 function expand(value){panel.classList.toggle('map-browser__panel--expanded',value);handle.setAttribute('aria-expanded',String(value));handle.setAttribute('aria-label',value?'Свернуть список объектов':'Развернуть список объектов');}
 function render(snapshot=api.getSnapshot()){
  trigger.disabled=!snapshot.ready;
  if(snapshot.ready)window.BarnesCatalogUpdateDirections(direction,snapshot.filters.deal);
  if(!snapshot.ready||dialog.hidden)return;
  const profile=profiles[snapshot.direction],state=snapshot.filters;
  $('.map-browser__heading').textContent=`Найдено объектов: ${snapshot.items.length}`;
  direction.value=snapshot.direction;if(query.value!==snapshot.query)query.value=snapshot.query;sort.value=snapshot.sort;
  $('.map-browser__market').setAttribute('aria-label','Сделка');
  market.value=state.market;market.dispatchEvent(new Event('input'));market.closest('label').hidden=profile.mode!=='market'||state.deal==='rent';
  modes.forEach((button,index)=>{button.textContent=index?'Аренда':'Покупка';button.setAttribute('aria-pressed',String((state.deal||profile.defaultDeal||'buy')===(index?'rent':'buy')));});
  $('.catalog-map-favorites').hidden=!snapshot.onlyFavorites;
  list.replaceChildren(...snapshot.items.map(item=>{
   const card=document.createElement('article'),link=document.createElement('a'),image=document.createElement('img'),title=document.createElement('h3'),address=document.createElement('address'),price=document.createElement('p');
   card.className='map-browser__card';card.dataset.id=item.id;link.href=item.url;image.src=item.image;image.alt='';image.loading='lazy';title.textContent=item.title;address.textContent=item.address||item.locationLabel||item.directions.join(', ');
   price.textContent=(item.priceLabel||(item.price!=null?(item.kind==='project'?'от ':'')+new Intl.NumberFormat('ru-RU').format(item.price)+' ₽':'Цена по запросу'))+(item.deal==='rent'?' в месяц':'');
   link.append(image,title);card.append(link);if(address.textContent)card.append(address);card.append(price);return card;
  }));
  if(!snapshot.items.length){const empty=document.createElement('p');empty.className='map-browser__empty';empty.textContent='Ничего не найдено. Измени запрос или сбрось фильтры.';list.append(empty);}
  list.scrollTop=0;
 }
 function open(){
  if(!dialog.hidden||!api.getSnapshot().ready)return;
  saved={body:document.body.style.overflow,root:document.documentElement.style.overflow,gutter:document.documentElement.style.scrollbarGutter};
  [...document.body.children].forEach(isolate);observer.observe(document.body,{childList:true});
  document.documentElement.style.scrollbarGutter=innerWidth<=540?'auto':'stable';document.documentElement.style.overflow='hidden';document.body.style.overflow='hidden';
  const image=$('[data-map-preview]');if(!image.hasAttribute('src'))image.src='../assets/images/map-view/map-preview.png';
  dialog.hidden=false;trigger.setAttribute('aria-expanded','true');setZoom(1);expand(false);render();$('.map-browser__close').focus({preventScroll:true});
 }
 function close(){
  if(dialog.hidden||dialog.inert)return;
  observer.disconnect();dialog.hidden=true;trigger.setAttribute('aria-expanded','false');
  isolated.forEach(([node,inert])=>node.inert=inert);isolated=[];
  document.body.style.overflow=saved.body;document.documentElement.style.overflow=saved.root;document.documentElement.style.scrollbarGutter=saved.gutter;trigger.focus({preventScroll:true});
 }
 trigger.addEventListener('click',open);$('.map-browser__close').addEventListener('click',close);
 $('[data-map-zoom=in]').addEventListener('click',()=>setZoom(zoom+.25));$('[data-map-zoom=out]').addEventListener('click',()=>setZoom(zoom-.25));
 handle.addEventListener('click',()=>expand(handle.getAttribute('aria-expanded')!=='true'));
 query.addEventListener('focus',()=>{if(innerWidth<=540)expand(true);});query.addEventListener('input',()=>api.setQuery(query.value));
 market.addEventListener('change',()=>api.setMarket(market.value));
 direction.addEventListener('change',()=>api.setDirection(direction.value));modes.forEach((button,index)=>button.addEventListener('click',()=>api.setMode(index)));
 sort.addEventListener('change',()=>api.setSort(sort.value));$('.map-browser__reset').addEventListener('click',()=>api.reset());
 document.addEventListener('barn:catalog-results',event=>render(event.detail));
 document.addEventListener('keydown',event=>{
  if(dialog.hidden||dialog.inert)return;
  if(event.key==='Escape'){event.preventDefault();close();return;}
  if(event.key==='Tab'){
   const controls=[...dialog.querySelectorAll('a,button,input,select')].filter(element=>!element.disabled&&element.tabIndex!==-1&&element.checkVisibility());
   const first=controls[0],last=controls.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  }
 });
 render();
})();
