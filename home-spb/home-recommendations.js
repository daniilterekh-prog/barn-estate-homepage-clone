/* FirstDegree LaunchCard / start-sales presentation; original Nuxt nodes remain mounted. */
(() => {
 if(window.__barnesRecommendations)return;
 const favorites=new Set();
 const catalog=JSON.parse(document.getElementById('spb-catalog-data').textContent);
 const catalogRecords=new Map([...catalog.projects,...catalog.lots].map(item=>[item.url,item]));
 // The embedded SPb catalog also identifies Splide loop clones by their real destination URL.
 const imageBase=new URL('assets/',document.currentScript.src);
 try{for(const value of JSON.parse(localStorage.getItem('barnes-preview-recommendation-favorites')||'[]'))favorites.add(value)}catch{}
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const heart='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>';
 function syncFavorites(){for(const view of document.querySelectorAll('.home-rec-card')){const button=view.querySelector('.home-rec-favorite'),selected=favorites.has(view.dataset.href);button.setAttribute('aria-pressed',String(selected));button.setAttribute('aria-label',selected?'Удалить из избранного':'Добавить в избранное')}}
 function refresh(){
  const sliderRow=document.querySelector('.barnes-choice__slider-row');
  const sliderWrap=sliderRow?.querySelector('.barnes-choice__slider-wrap');
  if(sliderWrap){
   const inset=Math.max(0,sliderWrap.getBoundingClientRect().left-sliderRow.getBoundingClientRect().left);
   sliderRow.style.setProperty('--home-rec-nav-inset',`${inset}px`);
  }
  for(const card of document.querySelectorAll('.barnes-choice .apartment-card')){
   const source=card.querySelector(':scope > .apartment-card__link');if(!source)continue;
   const image=source.querySelector('img');if(!source.href)continue;
   const record=catalogRecords.get(new URL(source.href).href);
   const href=record?.url||source.href,imageSrc=record?new URL(record.image,imageBase).href:image?.src||new URL('home-property-photo-unavailable.svg',imageBase).href;
   const name=record?.name||source.querySelector('.apartment-card__name')?.textContent.trim()||image?.alt||'Объект недвижимости';
   const address=record?.address||source.querySelector('.apartment-card__address')?.textContent.trim()||'—';
   const price=record?.priceLabel||source.querySelector('.apartment-card__price')?.textContent.trim()||'—';
   const id=source.querySelector('.apartment-card__lotid')?.textContent.trim()||'';
   const key=JSON.stringify([href,name,address,price,id,imageSrc]);
   let view=card.querySelector(':scope > .home-rec-card');
   if(view?.dataset.sourceKey===key)continue;
   if(!view){view=document.createElement('div');view.className='home-rec-card';card.append(view)}
   view.dataset.sourceKey=key;view.dataset.href=href;view.dataset.name=name;
   view.innerHTML=`<a class="home-rec-link" href="${esc(href)}" aria-label="${esc(name)}"><div class="home-rec-media"><img class="home-rec-image" src="${esc(imageSrc)}" alt="${esc(name)}" width="514" height="424" loading="lazy"></div><div class="home-rec-body"><p class="home-rec-address" title="${esc(address)}"><svg class="home-rec-region-icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 14s4.5-4.35 4.5-8A4.5 4.5 0 0 0 3.5 6c0 3.65 4.5 8 4.5 8Z"/><circle cx="8" cy="6" r="1.65"/></svg><span>${esc(address)}</span></p><p class="home-rec-name">${esc(name)}</p><div class="home-rec-details"><div class="home-rec-price-row"><p class="home-rec-price">${esc(price)}</p></div></div></div></a><button type="button" class="home-rec-favorite" aria-pressed="false" aria-label="Добавить в избранное">${heart}</button>`;
  }
  const selected=document.querySelector('.barnes-choice__tab[aria-selected="true"]')?.textContent.trim()||document.querySelector('.barnes-choice__select-value')?.textContent.trim();
  const group=catalog.groups.find(item=>item.name===selected)||catalog.groups[0];
  const direction=catalog.directions.find(item=>item.key===group.key);
  const action=document.querySelector('.barnes-choice__action');
  if(action&&action.href!==direction.url){action.href=direction.url;action.dataset.homeOriginalLink='';}
  const wrap=document.querySelector('.barnes-choice__slider-wrap');
  const empty=wrap?.querySelector(':scope > .home-rec-empty');
  if(group.list.length){empty?.remove();}
  else if(wrap&&!empty){
   const panel=document.createElement('div');panel.className='home-rec-empty';
   const title=document.createElement('h3');title.textContent=group.name+' недвижимость';
   const text=document.createElement('p');text.textContent='Подберём недвижимость под ваши планы. Обсудите задачу с экспертом петербургского департамента.';
   const links=document.createElement('nav');links.setAttribute('aria-label','Направления '+group.name.toLowerCase()+' недвижимости');
   for(const region of catalog.regionLinks[group.key]||[]){const link=document.createElement('a');link.href=region.url;link.textContent=region.name;links.append(link);}
   const contact=document.createElement('a');contact.href='https://barnestate-spb.ru/contacts/';contact.textContent='Связаться с экспертом';links.append(contact);
   panel.append(title,text,links);wrap.append(panel);
  }
  syncFavorites();
 }
 window.__barnesRecommendations={refresh};
 document.addEventListener('click',event=>{
  const view=event.target.closest('.home-rec-card');if(!view)return;
  if(event.target.closest('.home-rec-favorite')){event.preventDefault();const href=view.dataset.href;if(favorites.has(href))favorites.delete(href);else favorites.add(href);try{localStorage.setItem('barnes-preview-recommendation-favorites',JSON.stringify([...favorites]))}catch{}syncFavorites()}
 });
 window.__barnesHomeContent?.refresh?.();
})();
