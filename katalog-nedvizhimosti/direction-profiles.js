/* Direction is the top-level context. `directions` in BarnesFilters remains location. */
(() => {
 const types={flat:'Квартира',apartment:'Апартаменты',new_build:'Квартира в новостройке',penthouse:'Пентхаус',house:'Дом',townhouse:'Таунхаус',land:'Участок',office:'Офис','free-purpose':'Свободное назначение',retail:'Торговое помещение',warehouse:'Склад',villa:'Вилла'};
 const purchase={choices:['до 50 млн ₽','50 – 100 млн ₽','100 – 200 млн ₽','от 200 млн ₽'],values:['50m','50-100m','100-200m','200m+']};
 const monthly={choices:['до 1 млн ₽/мес.','1 – 3 млн ₽/мес.','3 – 5 млн ₽/мес.','от 5 млн ₽/мес.'],values:['rent-1m','rent-1-3m','rent-3-5m','rent-5m+']};
 const area={title:'Площадь',key:'areaRanges',reset:'Любая площадь',choices:['до 200 м²','200 – 500 м²','от 500 м²'],values:['area-200','area-200-500','area-500+']};
 window.BarnesCatalogProfiles={
  city:{label:'Городская',mode:'market',defaultMarket:'new-build',location:'Локация',locations:['Москва'],types:['flat','apartment','new_build','penthouse','townhouse'],bedrooms:true,rooms:true},
  country:{label:'Загородная',mode:'deal',defaultDeal:'buy',location:'Шоссе',locations:['Ленинградское шоссе','Киевское шоссе','Рублёво-Успенское шоссе','Можайское шоссе'],types:['house','townhouse','land'],areaTitle:'Площадь дома',land:true},
  commercial:{label:'Коммерческая',mode:'deal',defaultDeal:'rent',location:'Локация',locations:['Москва'],types:['office','free-purpose','retail','warehouse'],typeTitle:'Назначение',areaTitle:'Площадь'},
  resort:{label:'Курортная',mode:'market',defaultMarket:'new-build',location:'Регион',locations:['Сочи','Анапа','Алтай','Архыз'],types:['apartment','flat','house','villa'],bedrooms:true,rooms:true},
  international:{label:'Зарубежная',mode:'market',defaultMarket:'new-build',location:'Страна',locations:['Турция','ОАЭ','Оман','Армения','Франция','Марокко','Португалия'],types:['apartment','flat','house','villa','penthouse'],bedrooms:true,rooms:true}
 };
 window.BarnesCatalogTypes=types;
 window.BarnesCatalogConfigs=(key,deal)=>{
  const p=window.BarnesCatalogProfiles[key];
  return [
   {title:p.location,key:'directions',reset:p.location==='Страна'?'Все страны':p.location==='Шоссе'?'Любое шоссе':'Все локации',choices:p.locations},
   {title:p.typeTitle||'Тип',key:'propertyTypes',reset:'Любой тип',choices:p.types.map(v=>types[v]),values:p.types},
   {title:deal==='rent'?'Стоимость / месяц':'Стоимость',key:'priceRanges',reset:'Любая стоимость',...(deal==='rent'?monthly:purchase)},
   p.bedrooms?{title:'Спальни',key:'bedrooms',reset:'Любые',choices:['1','2','3','Более 3'],values:['1','2','3','4+']}:{...area,title:p.areaTitle}
  ];
 };
 window.BarnesCatalogQuickConfig=window.BarnesCatalogConfigs('city','buy');
})();
