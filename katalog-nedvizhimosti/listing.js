(() => {
 'use strict';
 const $=selector=>document.querySelector(selector),list=$('.catalog-grid__list'),money=new Intl.NumberFormat('ru-RU');
 const profiles=window.BarnesCatalogProfiles,STORAGE='barnes-catalog-favorites';
 let objects=[],favorites=[],query='',sort='relevance',onlyFavorites=false,limit=6,currentDirection='city';
 try{const saved=JSON.parse(localStorage.getItem(STORAGE)||'[]');if(Array.isArray(saved))favorites=[...new Set(saved)].filter(id=>typeof id==='string');}catch{}
 const profile=()=>profiles[currentDirection],state=()=>window.BarnesFilters.getState();
 const effectiveDeal=()=>state().deal||profile().defaultDeal||'buy';
 const blank=()=>({directions:[],propertyTypes:[],priceRanges:[],areaRanges:[],brandFlags:[],priceMin:'',priceMax:'',areaMin:'',areaMax:'',landMin:'',landMax:'',roomsMin:'',roomsMax:'',bedrooms:''});
 const arrayKeys=['directions','propertyTypes','priceRanges','areaRanges','brandFlags'];
 const numericKeys=['priceMin','priceMax','areaMin','areaMax','landMin','landMax','roomsMin','roomsMax'];
 const modeButtons=()=>[...document.querySelectorAll('.catalog-mode-switch > .catalog-mode-switch__button')];
 function configure(direction,deal){
  currentDirection=direction;document.body.dataset.direction=direction;
  window.BarnesCatalogConfigureContext(direction,deal);
  const buttons=modeButtons();
  buttons[0].textContent=profile().mode==='deal'?'Купить':'Новостройки';buttons[1].textContent=profile().mode==='deal'?'Снять':'Вторичная';
  $('.catalog-mode-switch').setAttribute('aria-label',profile().mode==='deal'?'Сделка':'Рынок недвижимости');
 }
 function setDirection(direction){
  if(direction===currentDirection)return;
  const p=profiles[direction];query='';$('#catalog-search').value='';limit=6;
  configure(direction,p.defaultDeal||'buy');
  window.BarnesFilters.patch({...blank(),market:p.defaultMarket||'secondary',deal:p.defaultDeal||'buy'});
  $('[data-announcement]').textContent=`${p.label} недвижимость. Фильтры обновлены.`;
 }
 function readURL(){
  const params=new URLSearchParams(location.search),direction=profiles[params.get('direction')]?params.get('direction'):'city',p=profiles[direction];
  const deal=['buy','rent'].includes(params.get('deal'))?params.get('deal'):p.defaultDeal||'buy';
  const fields={...blank(),deal,market:params.get('market')==='secondary'?'secondary':p.defaultMarket||'new-build'};
  configure(direction,deal);
  const configs=window.BarnesCatalogQuickConfig;
  for(const key of arrayKeys){
   const config=configs.find(c=>c.key===key);const allowed=key==='brandFlags'?['selection','exclusive']:config?(config.values||config.choices):[];
   fields[key]=params.getAll(key).filter(value=>allowed.includes(value));
  }
  for(const key of numericKeys){const value=params.get(key);if(value&&/^\d+$/.test(value))fields[key]=value;}
  if(!p.rooms){fields.roomsMin='';fields.roomsMax='';}if(!p.land){fields.landMin='';fields.landMax='';}
  const beds=params.get('bedrooms');if(p.bedrooms&&['1','2','3','4+'].includes(beds))fields.bedrooms=beds;
  for(const prefix of ['price','area','land','rooms'])if(fields[prefix+'Min']&&fields[prefix+'Max']&&Number(fields[prefix+'Min'])>Number(fields[prefix+'Max'])){fields[prefix+'Min']='';fields[prefix+'Max']='';}
  query=params.get('q')||'';$('#catalog-search').value=query;
  sort=['price_asc','price_desc','square_asc','square_desc'].includes(params.get('sort'))?params.get('sort'):'relevance';
  onlyFavorites=params.get('favorites')==='1';$('.catalog-grid__sort select').value=sort;
  $('.catalog-grid__sort select').dispatchEvent(new Event('change',{bubbles:true}));
  window.BarnesFilters.patch(fields);
 }
 function writeURL(){
  const params=new URLSearchParams(),s=state();params.set('direction',currentDirection);
  if(profile().mode==='market'&&s.market==='secondary')params.set('market','secondary');
  if(profile().mode==='deal')params.set('deal',effectiveDeal());
  for(const key of arrayKeys)for(const value of s[key]||[])params.append(key,value);
  for(const key of [...numericKeys,'bedrooms'])if(s[key])params.set(key,s[key]);
  if(query)params.set('q',query);if(sort!=='relevance')params.set('sort',sort);if(onlyFavorites)params.set('favorites','1');
  history.replaceState(null,'',location.pathname+'?'+params+location.hash);
 }
 const ranges={
  '50m':[0,50e6],'50-100m':[50e6,100e6],'100-200m':[100e6,200e6],'200m+':[200e6,Infinity],
  'rent-1m':[0,1e6],'rent-1-3m':[1e6,3e6],'rent-3-5m':[3e6,5e6],'rent-5m+':[5e6,Infinity],
  'area-200':[0,200],'area-200-500':[200,500],'area-500+':[500,Infinity]
 };
 function rangeMatch(value,key){return value!=null&&ranges[key]&&value>=ranges[key][0]&&value<ranges[key][1];}
 function bedroomsMatch(item,value){
  if(item.bedrooms){const numbers=item.bedrooms.match(/\d+/g).map(Number),min=numbers[0],max=item.bedrooms.includes('+')?Infinity:numbers.at(-1);return value==='4+'?max>=4:Number(value)>=min&&Number(value)<=max;}
  const count=item.bedroomCount??Number(item.stats?.find(([,label])=>/^Спал/.test(label))?.[0]);return !!count&&(value==='4+'?count>=4:count===Number(value));
 }
 function matches(item,s){
  if(item.direction!==currentDirection)return false;
  if(profile().mode==='market'&&item.market!==s.market)return false;
  if(profile().mode==='deal'&&item.deal!==effectiveDeal())return false;
  if(onlyFavorites&&!favorites.includes(item.id))return false;
  for(const key of ['directions','propertyTypes','brandFlags'])if(s[key]?.length&&!s[key].some(value=>item[key]?.includes(value)))return false;
  if(s.priceRanges?.length&&!s.priceRanges.some(value=>rangeMatch(item.price,value)))return false;
  if(s.areaRanges?.length&&!s.areaRanges.some(value=>rangeMatch(item.area,value)))return false;
  for(const [prefix,key] of [['price','price'],['area','area'],['land','landArea'],['rooms','rooms']]){
   if((s[prefix+'Min']||s[prefix+'Max'])&&item[key]==null)return false;
   if(s[prefix+'Min']&&item[key]<Number(s[prefix+'Min']))return false;
   if(s[prefix+'Max']&&item[key]>Number(s[prefix+'Max']))return false;
  }
  if(s.bedrooms&&!bedroomsMatch(item,s.bedrooms))return false;
  return !query.trim()||`${item.id} ${item.title} ${item.address}`.toLocaleLowerCase('ru').includes(query.trim().toLocaleLowerCase('ru'));
 }
 function card(item,index){
  const isProject=item.kind==='project';const article=$(isProject?'#card-project':'#card-lot').content.firstElementChild.cloneNode(true);article.dataset.id=item.id;article.dataset.direction=item.direction;
  const image=article.querySelector('img');image.src=item.image;image.alt=item.title;image.loading=index<3?'eager':'lazy';
  for(const link of article.querySelectorAll('a'))link.href=item.url;
  article.querySelector('.apartment-card__address').textContent=item.address||'Адрес уточняется';
  article.querySelector('.apartment-card__name-text').textContent=item.title;article.querySelector('.apartment-card__name').title=item.title;
  const stat=pattern=>item.stats?.find(([,label])=>pattern.test(label))?.[0]||'По запросу';
  let facts=isProject?[
   ['Локация',item.locationLabel||item.directions.join(', ')||'По запросу'],['Срок сдачи',item.completion||'По запросу'],['Спальни',item.bedrooms||'По запросу']
  ]:[['Локация',item.directions.join(', ')||'По запросу'],['Площадь',item.area!=null?money.format(item.area)+' м²':'По запросу'],['Спальни',stat(/^Спал/)]];
  if(item.direction==='commercial')facts=[['Назначение',item.propertyTypes.map(v=>window.BarnesCatalogTypes[v]).join(', ')||'По запросу'],['Площадь',money.format(item.area)+' м²'],['Этаж',stat(/^Этаж/)]];
  if(item.direction==='country')facts=[['Шоссе',item.directions[0]?.replace(/ шоссе$/,'')||'По запросу'],['Площадь дома',money.format(item.area)+' м²'],['Спальни',stat(/^Спал/)]];
  article.querySelectorAll('.listing-card-fact').forEach((fact,i)=>{fact.querySelector('dt').textContent=facts[i][0];fact.querySelector('dd').textContent=facts[i][1];fact.querySelector('dd').title=facts[i][1];});
  if(!isProject){
   const body=article.querySelector('.apartment-card__body'),name=article.querySelector('.apartment-card__name'),address=article.querySelector('.apartment-card__address'),id=article.querySelector('.apartment-card__lotid'),price=article.querySelector('.apartment-card__price');
   const top=document.createElement('div');top.className='apartment-card__topline';top.setAttribute('data-v-80c326fb','');if(id)top.append(id);
   const stats=document.createElement('div');stats.className='apartment-card__stats';stats.setAttribute('data-v-80c326fb','');stats.setAttribute('aria-label','Основные характеристики');
   const values=item.stats?.length?item.stats.slice(0,4):facts.map(([label,value])=>[value,label]);stats.style.setProperty('--stats-count',values.length);
   for(const [value,label] of values){const cell=document.createElement('div'),number=document.createElement('b'),caption=document.createElement('small');cell.className='apartment-card__stat';number.className='apartment-card__stat-value';caption.className='apartment-card__stat-label';for(const node of [cell,number,caption])node.setAttribute('data-v-80c326fb','');number.textContent=value;caption.textContent=label;cell.append(number,caption);stats.append(cell);}
   body.replaceChildren(top,name,address,stats,price);
  }
  const price=article.querySelector('.apartment-card__price');price.textContent=item.priceLabel||(item.price!=null?(isProject?'от ':'')+money.format(item.price)+' ₽':'Цена по запросу');
  if(item.deal==='rent'){const period=document.createElement('small');period.className='catalog-price-period';period.textContent='в месяц';price.append(period);}
  const lotID=article.querySelector('.apartment-card__lotid');if(lotID){if(/^\d+$/.test(item.id)){lotID.textContent='ID '+item.id;lotID.setAttribute('aria-label','ID объекта '+item.id);}else lotID.remove();}
  const favorite=article.querySelector('.apartment-card__favorite');favorite.dataset.favorite=item.id;favorite.setAttribute('aria-pressed',String(favorites.includes(item.id)));favorite.setAttribute('aria-label',`${favorites.includes(item.id)?'Удалить из избранного':'Добавить в избранное'}: ${item.title}`);
  const call=article.querySelector('.apartment-card__call-btn'),phone=document.createElement('a');for(const attr of call.attributes)if(attr.name!=='type')phone.setAttribute(attr.name,attr.value);phone.href='tel:+74951825079';phone.textContent='Позвонить';phone.setAttribute('aria-label','Позвонить по объекту '+item.title);call.replaceWith(phone);
  const wrapper=document.createElement('li');wrapper.className='catalog-grid__item';wrapper.setAttribute('data-v-5a2b3b97','');wrapper.dataset.listingMode=item.market||item.deal;wrapper.dataset.price=item.price??'';wrapper.dataset.area=item.area??'';wrapper.append(article);return wrapper;
 }
 function render(){
  const s=state();let visible=objects.filter(item=>matches(item,s));
  const order=sort.endsWith('_desc')?-1:1,key=sort.startsWith('price_')?'price':sort.startsWith('square_')?'area':null;
  if(key)visible.sort((a,b)=>a[key]==null?(b[key]==null?0:1):b[key]==null?-1:order*(a[key]-b[key]));
  list.replaceChildren(...visible.slice(0,limit).map(card));list.setAttribute('aria-busy','false');
  document.querySelectorAll('.catalog-direction [data-direction]').forEach(button=>{const active=button.dataset.direction===currentDirection;button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',String(active));});
  modeButtons().forEach((button,i)=>{const active=profile().mode==='deal'?effectiveDeal()===(i?'rent':'buy'):s.market===(i?'secondary':'new-build');button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',String(active));});
  const n=visible.length,word=profile().mode==='market'&&s.market==='new-build'?'проект':'объект';
  $('#results-count').textContent=`${n} ${n%100>=11&&n%100<=14?word+'ов':n%10===1?word:n%10>=2&&n%10<=4?word+'а':word+'ов'}`;
  $('.catalog-empty').hidden=n>0;$('.catalog-grid__footer').hidden=!n;$('[data-more]').hidden=limit>=n;$('[data-progress]').textContent=`Показано ${Math.min(limit,n)} из ${n}`;
  $('[data-reset]').hidden=!(query||onlyFavorites||[...arrayKeys,...numericKeys,'bedrooms'].some(key=>s[key]?.length));
  $('[data-show-favorites]').setAttribute('aria-pressed',String(onlyFavorites));document.querySelectorAll('[data-favorite-count],.site-header__favorites-count').forEach(el=>{el.textContent=favorites.length;});
  writeURL();
 }
 function reset(){query='';onlyFavorites=false;limit=6;$('#catalog-search').value='';window.BarnesFilters.patch({...blank(),market:state().market,deal:effectiveDeal()});}
 document.addEventListener('barnes:filters-apply',()=>{limit=6;if(objects.length)render();});
 document.querySelectorAll('.catalog-direction [data-direction]').forEach(button=>button.addEventListener('click',()=>setDirection(button.dataset.direction)));
 modeButtons().forEach((button,i)=>button.addEventListener('click',()=>{
  if(profile().mode==='deal'){const deal=i?'rent':'buy';window.BarnesCatalogConfigureContext(currentDirection,deal);window.BarnesFilters.patch({deal,priceRanges:[],priceMin:'',priceMax:''});}
  else window.BarnesFilters.patch({market:i?'secondary':'new-build'});
 }));
 $('.catalog-grid__sort select').addEventListener('change',event=>{sort=event.target.value;if(objects.length)render();});
 $('#catalog-search').addEventListener('input',event=>{query=event.target.value;limit=6;render();});$('#catalog-search').addEventListener('keydown',event=>{if(event.key==='Enter')$('#results').focus();});
 document.querySelectorAll('[data-reset],[data-reset-empty]').forEach(button=>button.addEventListener('click',reset));
 $('[data-more]').addEventListener('click',()=>{const previous=limit;limit+=6;render();list.children[previous]?.querySelector('.apartment-card__name').focus({preventScroll:true});});
 function showFavorites(event){event.preventDefault();onlyFavorites=!onlyFavorites;limit=6;render();}
 $('[data-show-favorites]').addEventListener('click',showFavorites);$('.site-header__favorites-btn')?.addEventListener('click',showFavorites);
 const search=$('.site-header__search-btn');if(search){search.href='#catalog-search';search.addEventListener('click',event=>{event.preventDefault();$('#catalog-search').focus();});}
 list.addEventListener('click',event=>{
  const button=event.target.closest('[data-favorite]');if(!button)return;const id=button.dataset.favorite,adding=!favorites.includes(id);favorites=adding?[...favorites,id]:favorites.filter(value=>value!==id);
  try{localStorage.setItem(STORAGE,JSON.stringify(favorites));}catch{}
  render();(list.querySelector(`[data-favorite="${CSS.escape(id)}"]`)||$('[data-show-favorites]')).focus({preventScroll:true});$('[data-announcement]').textContent=adding?'Объект добавлен в избранное':'Объект удалён из избранного';
 });
 // Native links retain their destinations; submenus support hover, Tab and Escape.
 document.querySelectorAll('.catalog-global-nav .site-header__nav-item').forEach(item=>{
  item.addEventListener('pointerenter',()=>item.classList.remove('is-subnav-dismissed'));
  item.addEventListener('pointerleave',()=>item.classList.remove('is-subnav-dismissed'));
  item.addEventListener('focusin',event=>{if(!item.contains(event.relatedTarget))item.classList.remove('is-subnav-dismissed');});
  item.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();item.classList.add('is-subnav-dismissed');item.querySelector('.site-header__nav-link').focus();}});
 });
 // Original full site-menu from the city reference, with isolation and focus restoration.
 const toggle=$('.site-header__icon-btn'),header=$('.site-header'),headerHolder=$('.layout__header');
 let menu=null,menuSaved=null;
 function closeMenu(){
  if(!menu)return;menu.remove();menu=null;header.classList.remove('site-header--menu-open');headerHolder.style.minHeight=menuSaved.height;document.body.style.overflow=menuSaved.overflow;
  menuSaved.isolated.forEach(([el,inert])=>{el.inert=inert;});toggle.innerHTML=menuSaved.icon;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Открыть меню');toggle.focus({preventScroll:true});
 }
 function openMenu(){
  if(menu){closeMenu();return;}
  menuSaved={icon:toggle.innerHTML,overflow:document.body.style.overflow,height:headerHolder.style.minHeight,isolated:[]};
  headerHolder.style.minHeight=headerHolder.getBoundingClientRect().height+'px';header.classList.add('site-header--menu-open');
  menu=$('#site-menu-template').content.firstElementChild.cloneNode(true);menu.id='catalog-site-menu';menu.style.setProperty('--site-menu-top',header.getBoundingClientRect().bottom+'px');document.body.append(menu);
  const menuPath={city:'/gorodskaya-nedvizhimost/',country:'/zagorodnaya-nedvizhimost/',commercial:'/kommercheskaya-nedvizhimost/',resort:'/kurortnaya/',international:'/mezhdunarodnaya-nedvizhimost/'}[currentDirection];
  menu.querySelectorAll('.site-menu__nav-title').forEach(link=>link.classList.toggle('site-menu__nav-title--active',new URL(link.href).pathname===menuPath));
  for(const el of [...document.querySelectorAll('main,.site-footer'),...header.querySelectorAll('a,button')].filter(el=>el!==toggle)){menuSaved.isolated.push([el,el.inert]);el.inert=true;}
  document.body.style.overflow='hidden';toggle.setAttribute('aria-expanded','true');toggle.setAttribute('aria-controls',menu.id);toggle.setAttribute('aria-label','Закрыть меню');toggle.innerHTML='<span class="site-header__icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19"/></svg></span>';
  menu.querySelector('a,button')?.focus({preventScroll:true});menu.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{location.href='tel:+74951825079';}));
 }
 toggle.setAttribute('aria-expanded','false');toggle.addEventListener('click',openMenu);
 document.addEventListener('keydown',event=>{
  if(!menu)return;if(event.key==='Escape'){event.preventDefault();closeMenu();return;}
  if(event.key==='Tab'){
   const controls=[toggle,...menu.querySelectorAll('a[href],button')].filter(e=>!e.disabled&&e.getClientRects().length),first=controls[0],last=controls.at(-1);
   event.preventDefault();const index=controls.indexOf(document.activeElement);controls[(index+(event.shiftKey?-1:1)+controls.length)%controls.length].focus();
  }
 });
 window.addEventListener('resize',()=>{if(menu)menu.style.setProperty('--site-menu-top',header.getBoundingClientRect().bottom+'px');});
 document.querySelectorAll('.site-footer__callback-btn').forEach(button=>button.addEventListener('click',()=>{location.href='tel:+74951825079';}));
 window.addEventListener('popstate',()=>{readURL();render();});
 async function load(){
  $('.catalog-load-error').hidden=true;$('.catalog-empty').hidden=true;
  try{const response=await fetch('objects.json');if(!response.ok)throw Error('load');objects=await response.json();if(!Array.isArray(objects))throw Error('shape');favorites=favorites.filter(id=>objects.some(item=>item.id===id));render();}
  catch{list.setAttribute('aria-busy','false');$('.catalog-load-error').hidden=false;$('.catalog-grid__footer').hidden=true;$('#results-count').textContent='';}
 }
 $('[data-retry]').addEventListener('click',load);readURL();load();
})();
