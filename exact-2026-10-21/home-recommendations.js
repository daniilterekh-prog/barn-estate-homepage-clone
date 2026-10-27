/* FirstDegree ListingLot presentation; original Nuxt nodes remain mounted. */
(() => {
 if(window.__barnesRecommendations)return;
 const records={
  "/vtorichnaya-nedvizhimost/537017/": {
    "name": "Стильный 3-уровневый пентхаус с террасой в ЖК «Венский дом»",
    "url": "/vtorichnaya-nedvizhimost/537017/",
    "lotid": 537017,
    "square": 363,
    "rooms": 5,
    "bedrooms": 3,
    "floor": 9,
    "address": "Неопалимовский 1-й пер, 8"
  },
  "/vtorichnaya-nedvizhimost/585570/": {
    "name": "Роскошная 3-комнатная квартира в клубном ЖК «Green Plaza» рядом с Кремлем",
    "url": "/vtorichnaya-nedvizhimost/585570/",
    "lotid": 585570,
    "square": 190,
    "rooms": 3,
    "bedrooms": 2,
    "floor": 3,
    "address": "Хлыновский туп, 4"
  },
  "/vtorichnaya-nedvizhimost/585978/": {
    "name": "Просторная квартира на Мичуринском проспекте",
    "url": "/vtorichnaya-nedvizhimost/585978/",
    "lotid": 585978,
    "square": 253,
    "rooms": 4,
    "bedrooms": 3,
    "floor": 24,
    "address": "Мичуринский пр-кт, 80"
  },
  "/vtorichnaya-nedvizhimost/558610/": {
    "name": "Роскошный видовой 3-комнатный апартамент в башне «Москва» ЖК «Город Столиц»",
    "url": "/vtorichnaya-nedvizhimost/558610/",
    "lotid": 558610,
    "square": 269.4,
    "rooms": 3,
    "bedrooms": 2,
    "floor": 69,
    "address": "Пресненская наб, 8стр1"
  },
  "/vtorichnaya-nedvizhimost/558443/": {
    "name": "Хилл 8",
    "url": "/vtorichnaya-nedvizhimost/558443/",
    "lotid": 558443,
    "square": 128.8,
    "rooms": 2,
    "bedrooms": 2,
    "floor": 15,
    "address": "Мира (дублёр), 95 с2"
  },
  "/zagorodnaya-nedvizhimost/586609/": {
    "name": "Николино",
    "url": "/zagorodnaya-nedvizhimost/586609/",
    "lotid": 586609,
    "square": 760,
    "rooms": null,
    "bedrooms": 4,
    "floor": null,
    "address": "Можайское шоссе, 20 от мкад"
  },
  "/zagorodnaya-nedvizhimost/586545/": {
    "name": "Резиденции Березки",
    "url": "/zagorodnaya-nedvizhimost/586545/",
    "lotid": 586545,
    "square": 730,
    "rooms": null,
    "bedrooms": 4,
    "floor": null,
    "address": "Рублёво-Успенское шоссе, 15 от мкад"
  },
  "/zagorodnaya-nedvizhimost/587186/": {
    "name": "Малое Сареево",
    "url": "/zagorodnaya-nedvizhimost/587186/",
    "lotid": 587186,
    "square": 836,
    "rooms": null,
    "bedrooms": 5,
    "floor": null,
    "address": "Рублёво-Успенское шоссе, 13 от мкад"
  },
  "/zagorodnaya-nedvizhimost/583806/": {
    "name": "Веледниково",
    "url": "/zagorodnaya-nedvizhimost/583806/",
    "lotid": 583806,
    "square": 650,
    "rooms": null,
    "bedrooms": 3,
    "floor": null,
    "address": "Новорижское шоссе, 14 от мкад"
  },
  "/zagorodnaya-nedvizhimost/587272/": {
    "name": "Николино",
    "url": "/zagorodnaya-nedvizhimost/587272/",
    "lotid": 587272,
    "square": 970,
    "rooms": null,
    "bedrooms": 5,
    "floor": null,
    "address": "Рублёво-Успенское шоссе, 20 от мкад"
  },
  "/kommercheskaya-nedvizhimost/560494/": {
    "name": "БЦ STONE Дмитровская - 101,8 кв.м. street-retail",
    "url": "/kommercheskaya-nedvizhimost/560494/",
    "lotid": 560494,
    "square": 101.8,
    "rooms": null,
    "bedrooms": null,
    "floor": 1,
    "address": "Дмитровский пер, 1Г"
  },
  "/kommercheskaya-nedvizhimost/593723/": {
    "name": "Особняк / ОСЗ Садовническая, 84с3,7",
    "url": "/kommercheskaya-nedvizhimost/593723/",
    "lotid": 593723,
    "square": 1184,
    "rooms": null,
    "bedrooms": null,
    "floor": 1,
    "address": "Садовническая ул, 41стр1"
  },
  "/kommercheskaya-nedvizhimost/557723/": {
    "name": "Особняк 3 299 кв.м. в Милютинском переулке",
    "url": "/kommercheskaya-nedvizhimost/557723/",
    "lotid": 557723,
    "square": 3299.8,
    "rooms": null,
    "bedrooms": null,
    "floor": 3,
    "address": "Милютинский пер, 18"
  },
  "/kommercheskaya-nedvizhimost/560437/": {
    "name": "ОСЗ 1913 кв.м. на Тверском бульваре",
    "url": "/kommercheskaya-nedvizhimost/560437/",
    "lotid": 560437,
    "square": 1913,
    "rooms": null,
    "bedrooms": null,
    "floor": 3,
    "address": "Тверской б-р, 14стр4"
  },
  "/mezhdunarodnaya-nedvizhimost/562771/": {
    "name": "VERVE CITY WALK Пентхаус с 5 спальнями",
    "url": "/mezhdunarodnaya-nedvizhimost/562771/",
    "lotid": 562771,
    "square": 857,
    "rooms": 7,
    "bedrooms": 5,
    "floor": null,
    "address": "Вся инфраструктура"
  },
  "/mezhdunarodnaya-nedvizhimost/586471/": {
    "name": "Above Element Villas: Вилла 3BR | Пространство мечты на Пхукете",
    "url": "/mezhdunarodnaya-nedvizhimost/586471/",
    "lotid": 586471,
    "square": 370,
    "rooms": null,
    "bedrooms": 3,
    "floor": null,
    "address": "Вся инфраструктура"
  },
  "/mezhdunarodnaya-nedvizhimost/557235/": {
    "name": "Апартаменты в финансовом центре стамбула",
    "url": "/mezhdunarodnaya-nedvizhimost/557235/",
    "lotid": 557235,
    "square": 69,
    "rooms": 2,
    "bedrooms": 1,
    "floor": null,
    "address": "Турция, Стамбул"
  },
  "/mezhdunarodnaya-nedvizhimost/prodazha_benahav_s_5012/": {
    "name": "Benahavís",
    "url": "/mezhdunarodnaya-nedvizhimost/prodazha_benahav_s_5012/",
    "lotid": 3477411,
    "square": 1340,
    "rooms": 22,
    "bedrooms": 5,
    "floor": 3,
    "address": "Впечатляющая вилла в Лос-Фламингосе."
  },
  "/mezhdunarodnaya-nedvizhimost/prodazha_elviria_5008/": {
    "name": "Elviria",
    "url": "/mezhdunarodnaya-nedvizhimost/prodazha_elviria_5008/",
    "lotid": 3525465,
    "square": 1054,
    "rooms": 15,
    "bedrooms": 8,
    "floor": null,
    "address": "ВИЛЛА С 8 СПАЛЬНЯМИ В ЭЛЬВИРИИ"
  },
  "/novostroyki/582217/": {
    "name": "Imperial Club",
    "url": "/novostroyki/582217/",
    "lotid": 582217,
    "square": 40.16,
    "rooms": 2,
    "bedrooms": 1,
    "floor": 2,
    "address": "Косая линия, 16"
  },
  "/vtorichnaya-nedvizhimost/536995/": {
    "name": "Пентхауса в Well House на Ленинском проспекте!",
    "url": "/vtorichnaya-nedvizhimost/536995/",
    "lotid": 536995,
    "square": 440,
    "rooms": 6,
    "bedrooms": 4,
    "floor": 39,
    "address": "Ленинский пр-кт, 111к1"
  },
  "/vtorichnaya-nedvizhimost/536996/": {
    "name": "Апартамента в Федерации Восток!",
    "url": "/vtorichnaya-nedvizhimost/536996/",
    "lotid": 536996,
    "square": 178.7,
    "rooms": 4,
    "bedrooms": 3,
    "floor": 82,
    "address": "Пресненская наб, 12"
  },
  "/vtorichnaya-nedvizhimost/536997/": {
    "name": "Квартиры в ЖК Снегири Эко!",
    "url": "/vtorichnaya-nedvizhimost/536997/",
    "lotid": 536997,
    "square": 169.1,
    "rooms": 3,
    "bedrooms": 2,
    "floor": 3,
    "address": "Минская ул, влд1/1соор2"
  },
  "/mezhdunarodnaya-nedvizhimost/prodazha_pantin_93500_2/": {
    "name": "Pantin-93500",
    "url": "/mezhdunarodnaya-nedvizhimost/prodazha_pantin_93500_2/",
    "lotid": 3142604,
    "square": 62,
    "rooms": 3,
    "bedrooms": 2,
    "floor": 4,
    "address": "ПАНТИН - Ратуша - Площадь помещения 62,61 м² хаб-авек pkg"
  },
  "/mezhdunarodnaya-nedvizhimost/prodazha_nantes_44100_7/": {
    "name": "Nantes-44100",
    "url": "/mezhdunarodnaya-nedvizhimost/prodazha_nantes_44100_7/",
    "lotid": 4885904,
    "square": 73,
    "rooms": 3,
    "bedrooms": 2,
    "floor": 4,
    "address": "НАНТСКАЯ НОВАЯ 2-Х КОМНАТНАЯ КВАРТИРА"
  },
  "/mezhdunarodnaya-nedvizhimost/prodazha_cap_ferret_33970_3/": {
    "name": "Cap-Ferret-33970",
    "url": "/mezhdunarodnaya-nedvizhimost/prodazha_cap_ferret_33970_3/",
    "lotid": 3844577,
    "square": 86,
    "rooms": 4,
    "bedrooms": 2,
    "floor": 2,
    "address": "ВИД ТРИПЛЕКСНОГО ПОРТА"
  }
};
 const favorites=new Set();
 try{for(const value of JSON.parse(localStorage.getItem('barnes-preview-recommendation-favorites')||'[]'))favorites.add(value)}catch{}
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const heart='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>';
 const arrow='<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 13 13 3M6 3h7v7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25"/></svg>';
 const fact=(label,value)=>`<div class="home-rec-fact"><dt>${label}</dt><dd title="${esc(value)}">${esc(value)}</dd></div>`;
 const known=value=>value===null||value===undefined||value===''?'—':value;
 function syncFavorites(){for(const view of document.querySelectorAll('.home-rec-card')){const button=view.querySelector('.home-rec-favorite'),selected=favorites.has(view.dataset.href);button.setAttribute('aria-pressed',String(selected));button.setAttribute('aria-label',selected?'Удалить из избранного':'Добавить в избранное')}}
 function refresh(){
  for(const card of document.querySelectorAll('.barnes-choice .apartment-card')){
   const source=card.querySelector(':scope > .apartment-card__link');if(!source)continue;
   const image=source.querySelector('img'),href=source.href;if(!image||!href)continue;
   const name=source.querySelector('.apartment-card__name')?.textContent.trim()||image.alt;
   const address=source.querySelector('.apartment-card__address')?.textContent.trim()||'—';
   const price=source.querySelector('.apartment-card__price')?.textContent.trim()||'—';
   const id=source.querySelector('.apartment-card__lotid')?.textContent.trim()||'';
   const record=records[new URL(href).pathname]||{};
   const key=JSON.stringify([href,name,address,price,id,image.src]);
   let view=card.querySelector(':scope > .home-rec-card');
   if(view?.dataset.sourceKey===key)continue;
   if(!view){view=document.createElement('div');view.className='home-rec-card';card.append(view)}
   view.dataset.sourceKey=key;view.dataset.href=href;view.dataset.name=name;
   const area=record.square===null||record.square===undefined?'—':`${record.square.toLocaleString('ru-RU')} м²`;
   view.innerHTML=`<div class="home-rec-media"><a href="${esc(href)}" aria-label="${esc(name)}"><img src="${esc(image.src)}" alt="${esc(name)}" width="720" height="540" loading="lazy"></a><button type="button" class="home-rec-favorite" aria-pressed="false" aria-label="Добавить в избранное">${heart}</button></div><div class="home-rec-body"><p class="home-rec-address" title="${esc(address)}">${esc(address)}</p><a class="home-rec-name" href="${esc(href)}" title="${esc(name)}">${esc(name)}</a><dl class="home-rec-facts" aria-label="Основные характеристики">${fact('Комнаты',known(record.rooms))}${fact('Площадь',area)}${fact('Этаж',known(record.floor))}</dl><div class="home-rec-price-row"><p class="home-rec-price">${esc(price)}</p><p class="home-rec-id">${esc(id)}</p></div></div><div class="home-rec-actions"><button type="button" class="home-rec-call" aria-label="Заказать звонок по объекту «${esc(name)}»">Заказать звонок</button><a class="home-rec-detail" href="${esc(href)}">Подробнее ${arrow}</a></div>`;
  }
  syncFavorites();
 }
 window.__barnesRecommendations={refresh,lastRequest:null};
 document.addEventListener('click',event=>{
  const view=event.target.closest('.home-rec-card');if(!view)return;
  if(event.target.closest('.home-rec-favorite')){event.preventDefault();const href=view.dataset.href;if(favorites.has(href))favorites.delete(href);else favorites.add(href);try{localStorage.setItem('barnes-preview-recommendation-favorites',JSON.stringify([...favorites]))}catch{}syncFavorites()}
  if(event.target.closest('.home-rec-call')){event.preventDefault();window.__barnesRecommendations.lastRequest={href:view.dataset.href,name:view.dataset.name};window.__barnesOwnerForm?window.__barnesOwnerForm.open({trigger:event.target.closest('.home-rec-call'),channel:'Звонок',context:window.__barnesRecommendations.lastRequest}):document.querySelector('.site-footer__callback-btn')?.click()}
 });
 window.__barnesHomeContent?.refresh?.();
})();
