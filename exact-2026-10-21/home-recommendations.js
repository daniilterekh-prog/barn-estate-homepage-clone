/* FirstDegree LaunchCard / start-sales presentation; original Nuxt nodes remain mounted. */
(() => {
 if(window.__barnesRecommendations)return;
 const favorites=new Set();
 const cityProjects=[
  {
    "name": "Клубный дом DUO",
    "url": "https://barn-estate.ru/zhilye-kompleksy/klubnyy-dom-duo-duo/",
    "address": "Москва, Софийская наб, 34стр3",
    "price": "от 113 000 000 ₽",
    "sourceImage": "https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/10984102/d459475776d7dcb85e27b36a9f4b2a81/iblock/9c9/9c9ec62df8a1eaeee42da723bb78b666/9b5402cab1ec89581ae298a277bcf736.jpg",
    "image": "home-city-klubnyy-dom-duo-duo.webp",
    "sourceSlot": "/vtorichnaya-nedvizhimost/585570/"
  },
  {
    "name": "Палашевский, 11",
    "url": "https://barn-estate.ru/zhilye-kompleksy/start-prodazh-palashevskiy-11/",
    "address": "Москва, Большой Палашёвский пер, 11",
    "price": "Цена по запросу",
    "sourceImage": "https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/11098495/b39711304c20a894a46b32e4842c20c7/iblock/a66/a66dc2782cd3baf887b27c3a5eb697b5/7e61da0b466c54e69065ec03ac1fa43d.jpg",
    "image": "home-city-start-prodazh-palashevskiy-11.webp",
    "sourceSlot": "/vtorichnaya-nedvizhimost/558610/"
  },
  {
    "name": "Вавилова, 64",
    "url": "https://barn-estate.ru/zhilye-kompleksy/vavilova-64/",
    "address": "Москва, Вавилова ул, 64",
    "price": "Цена по запросу",
    "sourceImage": "https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/11088774/d459475776d7dcb85e27b36a9f4b2a81/iblock/335/335485a4b9acb18f60b1e1bd55ebfc72/37537bbcc39d4cd6cbbfa8bee57ccfe0.jpg",
    "image": "home-city-vavilova-64.webp",
    "sourceSlot": "/vtorichnaya-nedvizhimost/558443/"
  }
];
 // Stable source slots also identify Splide loop clones. Other categories keep their captured listings.
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
   const isCity=document.querySelector('.barnes-choice__tab[aria-selected="true"]')?.textContent.trim()==='Городская';
   const project=isCity?cityProjects.find(project=>project.sourceSlot===new URL(source.href).pathname):null;
   const href=project?.url||source.href,imageSrc=project?new URL(project.image,imageBase).href:image?.src||new URL('home-property-photo-unavailable.svg',imageBase).href;
   const name=project?.name||source.querySelector('.apartment-card__name')?.textContent.trim()||image?.alt||'Объект недвижимости';
   const address=project?.address||source.querySelector('.apartment-card__address')?.textContent.trim()||'—';
   const price=project?.price||source.querySelector('.apartment-card__price')?.textContent.trim()||'—';
   const id=source.querySelector('.apartment-card__lotid')?.textContent.trim()||'';
   const key=JSON.stringify([href,name,address,price,id,imageSrc]);
   let view=card.querySelector(':scope > .home-rec-card');
   if(view?.dataset.sourceKey===key)continue;
   if(!view){view=document.createElement('div');view.className='home-rec-card';card.append(view)}
   view.dataset.sourceKey=key;view.dataset.href=href;view.dataset.name=name;
   view.innerHTML=`<a class="home-rec-link" href="${esc(href)}" aria-label="${esc(name)}"><div class="home-rec-media"><img class="home-rec-image" src="${esc(imageSrc)}" alt="${esc(name)}" width="514" height="424" loading="lazy"></div><div class="home-rec-body"><p class="home-rec-address" title="${esc(address)}"><svg class="home-rec-region-icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 14s4.5-4.35 4.5-8A4.5 4.5 0 0 0 3.5 6c0 3.65 4.5 8 4.5 8Z"/><circle cx="8" cy="6" r="1.65"/></svg><span>${esc(address)}</span></p><p class="home-rec-name">${esc(name)}</p><div class="home-rec-details"><div class="home-rec-price-row"><p class="home-rec-price">${esc(price)}</p></div></div></div></a><button type="button" class="home-rec-favorite" aria-pressed="false" aria-label="Добавить в избранное">${heart}</button>`;
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
