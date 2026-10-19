(() => {
  'use strict';
  const $=selector=>document.querySelector(selector);
  const list=$('.catalog-grid__list');
  const money=new Intl.NumberFormat('ru-RU');
  const STORAGE='barnes-catalog-favorites';
  let objects=[],favorites=[],query='',sort='relevance',onlyFavorites=false,limit=6;
  try{const saved=JSON.parse(localStorage.getItem(STORAGE)||'[]');if(Array.isArray(saved))favorites=[...new Set(saved)].filter(id=>typeof id==='string');}catch{}
  const countLabel=(n,word='объект')=>`${n} ${word==='проект'?(n%100>=11&&n%100<=14?'проектов':n%10===1?'проект':n%10>=2&&n%10<=4?'проекта':'проектов'):(n%100>=11&&n%100<=14?'объектов':n%10===1?'объект':n%10>=2&&n%10<=4?'объекта':'объектов')}`;
  const state=()=>window.BarnesFilters.getState();
  function readURL(){
    const params=new URLSearchParams(location.search),value={market:params.get('market')==='secondary'?'secondary':'new-build'};
    for(const key of ['directions','propertyTypes','priceRanges','brandFlags'])value[key]=params.getAll(key);
    for(const key of ['priceMin','priceMax','areaMin','areaMax','roomsMin','roomsMax','bedrooms']){const v=params.get(key);if(v&&/^(\d+|4\+)$/.test(v))value[key]=v;}
    query=params.get('q')||'';$('#catalog-search').value=query;
    const sorting=params.get('sort');if(['price_asc','price_desc','square_asc','square_desc'].includes(sorting))sort=sorting;
    onlyFavorites=params.get('favorites')==='1';
    $('.catalog-grid__sort select').value=sort;
    $('.catalog-grid__sort select').dispatchEvent(new Event('change',{bubbles:true}));
    window.BarnesFilters.patch(value);
  }
  function writeURL(){
    const params=new URLSearchParams(),s=state();
    if(s.market==='secondary')params.set('market',s.market);
    for(const key of ['directions','propertyTypes','priceRanges','brandFlags'])for(const value of s[key]||[])params.append(key,value);
    for(const key of ['priceMin','priceMax','areaMin','areaMax','roomsMin','roomsMax','bedrooms'])if(s[key])params.set(key,s[key]);
    if(query)params.set('q',query);if(sort!=='relevance')params.set('sort',sort);if(onlyFavorites)params.set('favorites','1');
    history.replaceState(null,'',location.pathname+(params.size?'?'+params:'')+location.hash);
  }
  const rangeMatch=(price,key)=>key==='50m'?price<50e6:key==='50-100m'?price>=50e6&&price<100e6:key==='100-200m'?price>=100e6&&price<200e6:key==='200m+'?price>=200e6:false;
  function matches(item,s){
    if(item.market!==s.market)return false;
    if(onlyFavorites&&!favorites.includes(item.id))return false;
    if(s.directions?.length&&!s.directions.some(value=>item.directions.includes(value)))return false;
    if(s.propertyTypes?.length&&!s.propertyTypes.some(value=>item.propertyTypes.includes(value)))return false;
    if(s.brandFlags?.length&&!s.brandFlags.some(value=>item.brandFlags.includes(value)))return false;
    if(s.priceRanges?.length&&!s.priceRanges.some(value=>rangeMatch(item.price,value)))return false;
    for(const [min,max,key] of [['priceMin','priceMax','price'],['areaMin','areaMax','area'],['roomsMin','roomsMax','rooms']]){
      if((s[min]||s[max])&&item[key]==null)return false;
      if(s[min]&&item[key]<Number(s[min]))return false;
      if(s[max]&&item[key]>Number(s[max]))return false;
    }
    if(s.bedrooms){
      const bedroom=Number(item.stats?.find(([,label])=>/^Спал/.test(label))?.[0]);
      if(item.bedrooms){
        const range=item.bedrooms.match(/\d+/g).map(Number),min=range[0],max=item.bedrooms.includes('+')?Infinity:range.at(-1);
        if(!(s.bedrooms==='4+'?max>=4:Number(s.bedrooms)>=min&&Number(s.bedrooms)<=max))return false;
      }else if(!bedroom||!(s.bedrooms==='4+'?bedroom>=4:bedroom===Number(s.bedrooms)))return false;
    }
    if(query.trim()&&!`${item.id} ${item.title} ${item.address}`.toLocaleLowerCase('ru').includes(query.trim().toLocaleLowerCase('ru')))return false;
    return true;
  }
  function card(item,index){
    const article=$(item.market==='new-build'?'#card-project':'#card-lot').content.firstElementChild.cloneNode(true);
    article.dataset.id=item.id;
    const image=article.querySelector('img');image.src=item.image;image.alt=item.title;image.loading=index<3?'eager':'lazy';
    for(const link of article.querySelectorAll('a'))link.href=item.url;
    article.querySelector('.apartment-card__address').textContent=item.address||'Адрес уточняется';
    article.querySelector('.apartment-card__name-text').textContent=item.title;
    article.querySelector('.apartment-card__name').title=item.title;
    const facts=item.market==='new-build'?[
      ['Локация',item.locationLabel||item.directions.join(', ')||'По запросу'],['Срок сдачи',item.completion||'По запросу'],['Спальни',item.bedrooms||'По запросу']
    ]:[['Комнаты',String(item.rooms)],['Площадь',money.format(item.area)+' м²'],['Этаж',item.stats.find(([,label])=>label==='Этаж')?.[0]||'По запросу']];
    article.querySelectorAll('.listing-card-fact').forEach((fact,i)=>{fact.querySelector('dt').textContent=facts[i][0];fact.querySelector('dd').textContent=facts[i][1];});
    article.querySelector('.apartment-card__price').textContent=(item.market==='new-build'?'от ':'')+money.format(item.price)+' ₽';
    const lotID=article.querySelector('.apartment-card__lotid');if(lotID){lotID.textContent='ID '+item.id;lotID.setAttribute('aria-label','ID объекта '+item.id);}
    const favorite=article.querySelector('.apartment-card__favorite');favorite.dataset.favorite=item.id;favorite.setAttribute('aria-pressed',String(favorites.includes(item.id)));favorite.setAttribute('aria-label',`${favorites.includes(item.id)?'Удалить из избранного':'Добавить в избранное'}: ${item.title}`);
    const call=article.querySelector('.apartment-card__call-btn');const phone=document.createElement('a');for(const attr of call.attributes)if(attr.name!=='type')phone.setAttribute(attr.name,attr.value);phone.href='tel:+74951825079';phone.textContent='Позвонить';phone.setAttribute('aria-label','Позвонить по объекту '+item.title);call.replaceWith(phone);
    const wrapper=document.createElement('li');wrapper.className='catalog-grid__item';wrapper.setAttribute('data-v-5a2b3b97','');wrapper.dataset.listingMode=item.market;wrapper.dataset.price=item.price;wrapper.dataset.area=item.area??'';wrapper.appendChild(article);return wrapper;
  }
  function render(){
    const s=state();let visible=objects.filter(item=>matches(item,s));
    const direction=sort.endsWith('_desc')?-1:1;
    if(sort.startsWith('price_'))visible.sort((a,b)=>direction*(a.price-b.price));
    if(sort.startsWith('square_'))visible.sort((a,b)=>a.area==null?(b.area==null?0:1):b.area==null?-1:direction*(a.area-b.area));
    list.replaceChildren(...visible.slice(0,limit).map(card));list.setAttribute('aria-busy','false');
    document.querySelectorAll('.catalog-mode-switch__button').forEach(button=>{const active=button.dataset.listingMode===s.market;button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',String(active));});
    $('#results-count').textContent=countLabel(visible.length,s.market==='new-build'?'проект':'объект');
    $('.catalog-empty').hidden=visible.length>0;
    $('.catalog-grid__footer').hidden=!visible.length;
    $('[data-more]').hidden=limit>=visible.length;
    $('[data-progress]').textContent=`Показано ${Math.min(limit,visible.length)} из ${visible.length}`;
    const active=query||onlyFavorites||['directions','propertyTypes','priceRanges','brandFlags','priceMin','priceMax','areaMin','areaMax','roomsMin','roomsMax','bedrooms'].some(key=>s[key]?.length);
    $('[data-reset]').hidden=!active;
    $('[data-show-favorites]').setAttribute('aria-pressed',String(onlyFavorites));
    document.querySelectorAll('[data-favorite-count],.site-header__favorites-count').forEach(el=>{el.textContent=favorites.length;});
    writeURL();
  }
  function reset(){
    query='';onlyFavorites=false;limit=6;$('#catalog-search').value='';
    window.BarnesFilters.patch({market:state().market,directions:[],propertyTypes:[],priceRanges:[],brandFlags:[],priceMin:'',priceMax:'',areaMin:'',areaMax:'',roomsMin:'',roomsMax:'',bedrooms:''});
  }
  document.addEventListener('barnes:filters-apply',()=>{limit=6;if(objects.length)render();});
  document.querySelectorAll('.catalog-mode-switch__button').forEach(button=>button.addEventListener('click',()=>window.BarnesFilters.patch({market:button.dataset.listingMode})));
  $('.catalog-grid__sort select').addEventListener('change',event=>{sort=event.target.value;if(objects.length)render();});
  $('#catalog-search').addEventListener('input',event=>{query=event.target.value;limit=6;render();});
  $('#catalog-search').addEventListener('keydown',event=>{if(event.key==='Enter'){$('#results').focus();}});
  document.querySelectorAll('[data-reset],[data-reset-empty]').forEach(button=>button.addEventListener('click',reset));
  $('[data-more]').addEventListener('click',()=>{const oldLimit=limit;limit+=6;render();list.children[oldLimit]?.querySelector('.apartment-card__name').focus({preventScroll:true});});
  function toggleFavorites(event){event.preventDefault();onlyFavorites=!onlyFavorites;limit=6;render();}
  $('[data-show-favorites]').addEventListener('click',toggleFavorites);
  $('.site-header__favorites-btn').addEventListener('click',toggleFavorites);
  $('.catalog-header-search').href='#catalog-search';
  $('.catalog-header-search').addEventListener('click',event=>{event.preventDefault();$('#catalog-search').focus();});
  list.addEventListener('click',event=>{
    const button=event.target.closest('[data-favorite]');if(!button)return;
    const id=button.dataset.favorite,adding=!favorites.includes(id);
    favorites=adding?[...favorites,id]:favorites.filter(value=>value!==id);
    try{localStorage.setItem(STORAGE,JSON.stringify(favorites));}catch{}
    render();(list.querySelector(`[data-favorite="${CSS.escape(id)}"]`)||$('[data-show-favorites]')).focus({preventScroll:true});
    $('[data-announcement]').textContent=adding?'Объект добавлен в избранное':'Объект удалён из избранного';
  });
  const navigation=$('.catalog-navigation');
  $('.site-header__icon-btn').addEventListener('click',()=>navigation.showModal());
  $('[data-close-navigation]').addEventListener('click',()=>navigation.close());
  navigation.addEventListener('click',event=>{if(event.target===navigation)navigation.close();});
  for(const button of document.querySelectorAll('.site-footer button'))button.addEventListener('click',()=>{location.href='tel:+74951825079';});
  window.addEventListener('popstate',()=>{readURL();render();});
  async function load(){
    $('.catalog-load-error').hidden=true;$('.catalog-empty').hidden=true;
    try{const response=await fetch('objects.json');if(!response.ok)throw Error('load');const data=await response.json();if(!Array.isArray(data))throw Error('shape');objects=data;favorites=favorites.filter(id=>objects.some(item=>item.id===id));render();}
    catch{list.setAttribute('aria-busy','false');$('.catalog-load-error').hidden=false;$('.catalog-grid__footer').hidden=true;$('#results-count').textContent='';}
  }
  $('[data-retry]').addEventListener('click',load);
  readURL();load();
})();
