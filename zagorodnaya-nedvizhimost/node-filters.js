/* Catalogue presentation, preserving each node's authored filter state and data. */
(()=>{
 const paths={'gorodskaya-nedvizhimost':'city','zagorodnaya-nedvizhimost':'country','mezhdunarodnaya-nedvizhimost':'international','kommercheskaya-nedvizhimost':'commercial','kurortnaya':'resort'};
 const direction=document.body?.dataset.nodeFilterDirection||Object.entries(paths).find(([slug])=>location.pathname.split('/').includes(slug))?.[1];if(!direction)return;
 let queued=false;
 /* MAP TEMPLATE START */const mapTemplate="<div class=\"map-browser__filters\">\n   <label class=\"map-browser__field map-browser__field--select catalog-map-context\"><span class=\"map-browser__sr-only\">Департамент недвижимости</span><select data-node-map-direction=\"\" aria-label=\"Департамент недвижимости\"></select><span class=\"map-browser__chevron\" aria-hidden=\"true\"></span></label>\n   <div class=\"map-browser__market\" role=\"group\" aria-label=\"Рынок недвижимости\"><button type=\"button\" data-node-map-mode=\"0\" aria-pressed=\"true\">Покупка</button><button type=\"button\" data-node-map-mode=\"1\" aria-pressed=\"false\">Аренда</button></div>\n   <label class=\"map-browser__field map-browser__field--select catalog-map-context catalog-map-market\"><span class=\"map-browser__sr-only\">Рынок недвижимости</span><select data-node-map-market=\"\" data-node-map-filter=\"market\" aria-label=\"Рынок недвижимости\"><option value=\"new-build\">Новостройки</option><option value=\"secondary\">Вторичная</option></select><span class=\"map-browser__chevron\" aria-hidden=\"true\"></span></label>\n   <label class=\"map-browser__field map-browser__field--select catalog-map-context\"><span class=\"map-browser__sr-only\">Сортировка объектов</span><select data-node-map-sort=\"\" aria-label=\"Сортировка объектов\"></select><span class=\"map-browser__chevron\" aria-hidden=\"true\"></span></label>\n   <p class=\"catalog-map-favorites\" hidden=\"\">Показано только избранное</p>\n   <button type=\"button\" class=\"map-browser__reset\">Сбросить фильтры</button>\n  </div>";/* MAP TEMPLATE END */
 function mount(){
  const toolbar=document.querySelector('.catalog-mode-toolbar'),primary=toolbar?.querySelector('.catalog-toolbar__primary'),secondary=toolbar?.querySelector('.catalog-toolbar__secondary');
  if(!primary||!secondary||!toolbar.querySelector('input[type=search]')||!document.querySelector('.catalog-result-summary'))return;
  if(direction==='city'&&!document.body.dataset.cityHomeKitReady)return;
  if(direction==='country'){if(!window.countryFullFilters||!window.countryReferenceControls||!toolbar.dataset.catalogLayout)return;}else if(!window.BarnesFilters||!(window.BarnesMapBrowser||window.BARNES_OPEN_MAP)||!primary.querySelector('.resort-select-trigger'))return;
  if(toolbar.dataset.nodeFiltersReady)return;
  toolbar.dataset.nodeFiltersReady='true';document.body.dataset.nodeFilterDirection=direction;
  const grid=toolbar.closest('.catalog-grid'),collections=grid.querySelector('.catalog-collections-row'),summary=grid.querySelector('.catalog-result-summary'),details=toolbar.querySelector('.catalog-mode-detailed-filters');
  if(collections){const listingBrands=collections.querySelector('[data-brand-context=listing],.barnes-brand-filters,.country-brand-filters');if(listingBrands){const holder=document.createElement('div');holder.dataset.catalogCollections='';holder.hidden=true;listingBrands.before(holder);holder.append(listingBrands);}collections.querySelector('.catalog-reset-all')?.classList.add('catalog-text-reset');const brands=collections.querySelector('.country-brand-filters');if(brands){brands.hidden=true;brands.inert=true;brands.classList.add('node-map-brands-hidden','barnes-brand-filters');brands.querySelectorAll('.country-brand-filters__box').forEach(e=>e.classList.add('barnes-brand-filters__box'));}}
  const available=['city','international','resort'].includes(direction);document.body.dataset.marketAvailable=String(available);
  let search=toolbar.querySelector('.catalog-search-row');const input=search.querySelector('input');
  if(search.tagName==='LABEL'){const label=search,row=document.createElement('div');row.className='catalog-search-row';label.replaceWith(row);label.className='catalog-text-search';row.append(label);search=row;}
  const department=primary.querySelector('.catalog-direction:not(.catalog-market)');
  const oldSwitch=toolbar.querySelector('.catalog-mode-switch');
  let market=primary.querySelector('.catalog-market'),sourceButtons=[];
  if(available&&!market){
   sourceButtons=[...oldSwitch.querySelectorAll('button')];const hidden=document.createElement('div');hidden.dataset.nodeMarketSource='';hidden.hidden=true;oldSwitch.replaceWith(hidden);hidden.append(oldSwitch);toolbar.append(hidden);
   market=document.createElement('label');market.className='catalog-direction node-filter-market';market.innerHTML='<span class="visually-hidden">Рынок недвижимости</span><select aria-label="Рынок недвижимости"><option value="new-build">Новостройки</option><option value="secondary">Вторичная</option></select><svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m3 6 5 5 5-5" stroke="currentColor" stroke-width="1.2"/></svg>';
   market.querySelector('select').addEventListener('change',e=>sourceButtons[e.target.value==='secondary'?1:0]?.click());
  }
  let deal=direction==='commercial'?oldSwitch:null;
  if(!deal){
   if(!available&&oldSwitch){const hidden=document.createElement('div');hidden.dataset.nodeMarketSource='';hidden.hidden=true;oldSwitch.replaceWith(hidden);hidden.append(oldSwitch);toolbar.append(hidden);sourceButtons=[...oldSwitch.querySelectorAll('button')];}
   deal=document.createElement('div');deal.className='catalog-mode-switch';deal.setAttribute('role','group');deal.setAttribute('aria-label','Сделка');deal.innerHTML='<button class="catalog-mode-switch__button is-active" type="button" aria-pressed="true" data-node-deal="buy">Покупка</button><button class="catalog-mode-switch__button" type="button" aria-pressed="false" data-node-deal="rent">Аренда</button>';
   deal.addEventListener('click',e=>{const button=e.target.closest('[data-node-deal]');if(!button)return;setDeal(button.dataset.nodeDeal);});
  }
  const rentalAvailable=['city','country','commercial'].includes(direction);
  function currentDeal(){return direction==='country'?(window.countryListing.getDeal?.()||'buy'):direction==='commercial'?(window.BarnesFilters.getState().dealType==='rent'?'rent':'buy'):(window.BarnesFilters.getState().deal||'buy');}
  function setDeal(value){
   if(value==='rent'&&!rentalAvailable)return;
   if(direction==='country'){window.countryListing.setDeal(value);document.dispatchEvent(new CustomEvent('country-filter-set',{detail:{bands:[],priceMin:null,priceMax:null}}));}
   else if(direction==='commercial'){deal.querySelectorAll('button')[value==='rent'?1:0]?.click();}
   else window.BarnesFilters.patch({deal:value,priceMin:'',priceMax:'',priceRanges:[]});
   sync();document.dispatchEvent(new CustomEvent('barnes:node-deal-change'));
  }
  if(!rentalAvailable)deal.querySelector('[data-node-deal="rent"]')?.remove();
  primary.prepend(deal);if(department)deal.after(department);if(market)department.after(market);
  if(direction==='country'){upgradeSelect(department.querySelector('select'));const area=toolbar.querySelectorAll('.catalog-mode-filters button')[3];if(area){area.dataset.countryQuick='area';area.querySelector('.catalog-quick-filters__caption').textContent='Площадь дома';}}
  if(market?.classList.contains('node-filter-market'))upgradeSelect(market.querySelector('select'));
  const resultTools=document.createElement('div');resultTools.className='catalog-results-toolbar';toolbar.after(resultTools);if(collections)resultTools.append(collections);resultTools.append(summary);
  const small=matchMedia('(max-width:767px)');
  function layout(){const focused=document.activeElement;const label=search.querySelector('.catalog-text-search');if(!label&&direction==='country'){const original=grid.querySelector('label.catalog-text-search');if(original)search.append(original);}
   if(small.matches)secondary.insertBefore(search,details);else primary.append(search);
   if(collections)resultTools.append(collections);resultTools.append(summary);input.placeholder=small.matches?'Название или ID':'Название ЖК, адрес или ID';
   if(focused===input&&document.activeElement!==input)input.focus({preventScroll:true});
  }
  function sync(){const rental=currentDeal()==='rent';document.body.dataset.nodeDeal=rental?'rent':'buy';document.body.dataset.marketAvailable=String(available&&!rental);
   for(const option of department.querySelector('select').options){const key=paths[option.value]||option.value;option.hidden=option.disabled=rental&&['resort','international'].includes(key);}
   if(direction!=='commercial')deal.querySelectorAll('button').forEach(b=>{const active=b.dataset.nodeDeal===currentDeal();b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active));});
   if(market)market.hidden=rental;
   if(market&&sourceButtons.length){const value=window.BarnesFilters?.getState()?.market||'new-build',select=market.querySelector('select');if(select.value!==value){select.value=value;select.dispatchEvent(new Event('input'));}}
   if(collections){const reset=collections.querySelector('.catalog-reset-all');if(reset)reset.hidden=false;}
  }
  layout();sync();small.addEventListener('change',layout);document.addEventListener('barnes:filters-apply',sync);document.addEventListener('country-listing-render',sync);document.addEventListener('barnes:node-deal-change',sync);
  if(direction==='country')document.addEventListener('click',e=>{const button=e.target.closest('[data-country-market]');if(button){e.preventDefault();e.stopImmediatePropagation();setDeal(button.dataset.countryMarket==='lot'?'rent':'buy');}},true);
  document.dispatchEvent(new CustomEvent('barnes:node-filters-ready'));
 }
 // This helper is used only where the old node has no department/market dropdown controller.
 function upgradeSelect(select){
  if(!select||select.dataset.nodeSelectReady)return;select.dataset.nodeSelectReady='true';
  const button=document.createElement('button');button.type='button';button.className='node-filter-select-trigger'+(/Сортировка/.test(select.getAttribute('aria-label'))?' resort-sort-trigger':'');button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-expanded','false');select.before(button);select.hidden=true;select.setAttribute('aria-hidden','true');select.tabIndex=-1;
  const popup=document.createElement('div');popup.className='catalog-quick-filters__dropdown node-filters-dropdown';popup.hidden=true;popup.setAttribute('role','dialog');popup.setAttribute('aria-label',select.getAttribute('aria-label'));popup.id='node-select-'+document.querySelectorAll('.node-filters-dropdown').length;button.setAttribute('aria-controls',popup.id);document.body.append(popup);
  function sync(){const text=select.selectedOptions[0]?.textContent||'';if(button.textContent!==text)button.textContent=text;button.setAttribute('aria-label',select.getAttribute('aria-label')+': '+button.textContent);}sync();select.addEventListener('change',sync);select.addEventListener('input',sync);
  function close(restore){popup.hidden=true;button.setAttribute('aria-expanded','false');if(restore)button.focus({preventScroll:true});}
  function place() { const activeButton=button,list=popup.querySelector('.catalog-quick-filters__options');
    if (!activeButton) return;
    var rect = activeButton.getBoundingClientRect();
    var vw = document.documentElement.clientWidth;
    var width = Math.min(Math.max(rect.width,220),vw-32);
    popup.style.width = width + 'px';
    popup.style.left = Math.max(16,Math.min(rect.left,vw-width-16)) + 'px';
    // Match the field's text edge, including viewport clamping and responsive padding.
    if (!activeButton.classList.contains('resort-sort-trigger')) {
      var label = activeButton.querySelector('.catalog-quick-filters__caption') || activeButton;
      var range = document.createRange();
      range.selectNodeContents(label);
      var textLeft = range.getBoundingClientRect().left;
      var option = list.querySelector('[role=option]');
      if (option) {
        range.selectNodeContents(option);
        var inset = parseFloat(getComputedStyle(option).paddingLeft) + textLeft - range.getBoundingClientRect().left;
        popup.style.setProperty('--catalog-dropdown-option-inset', Math.max(0,inset) + 'px');
      }
      var header = popup.querySelector('.catalog-quick-filters__dropdown-header');
      if (!header.hidden) {
        range.selectNodeContents(header.querySelector('span'));
        var headerInset = parseFloat(getComputedStyle(header).paddingLeft) + textLeft - range.getBoundingClientRect().left;
        popup.style.setProperty('--catalog-dropdown-header-inset', Math.max(0,headerInset) + 'px');
      }
    } else {
      popup.style.removeProperty('--catalog-dropdown-option-inset');
      popup.style.removeProperty('--catalog-dropdown-header-inset');
    }
    list.style.maxHeight = '240px';
    var height = popup.getBoundingClientRect().height;
    var availableBelow = window.innerHeight-rect.bottom-16;
    var above = rect.top-16;
    var top = rect.bottom+6;
    if (height > availableBelow && above > availableBelow) top = rect.top-6-height;
    top = Math.max(16,Math.min(top,window.innerHeight-height-16));
    popup.style.top = top + 'px';
    list.style.maxHeight = Math.max(48,Math.min(240,window.innerHeight-top-80)) + 'px';
  }
  function open(){const parent=select.closest('.map-browser')||document.fullscreenElement||document.body;parent.append(popup);popup.inert=false;document.dispatchEvent(new CustomEvent('barnes:filters-open'));popup.replaceChildren();const header=document.createElement('div');header.className='catalog-quick-filters__dropdown-header';header.hidden=!!select.closest('.catalog-mode-toolbar')&&/Департамент/.test(select.getAttribute('aria-label'));const title=document.createElement('span');title.textContent=select.getAttribute('aria-label');const dismiss=document.createElement('button');dismiss.type='button';dismiss.setAttribute('aria-label','Закрыть');dismiss.className='catalog-quick-filters__dropdown-close';dismiss.textContent='×';dismiss.addEventListener('click',()=>close(true));header.append(title,dismiss);popup.append(header);const list=document.createElement('div');list.className='catalog-quick-filters__options';list.setAttribute('role','listbox');for(const option of select.options){if(option.disabled||option.hidden)continue;const item=document.createElement('button');item.type='button';item.className='catalog-quick-filters__option'+(option.selected?' is-selected':'');item.setAttribute('role','option');item.setAttribute('aria-selected',String(option.selected));item.textContent=option.textContent;item.addEventListener('click',()=>{select.value=option.value;select.dispatchEvent(new Event('change',{bubbles:true}));sync();close(true);});list.append(item);}popup.append(list);popup.hidden=false;button.setAttribute('aria-expanded','true');place();(popup.querySelector('[aria-selected=true]')||popup.querySelector('button'))?.focus();}
  button.addEventListener('click',()=>popup.hidden?open():close(true));button.addEventListener('keydown',e=>{if(['ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();open();}});
  popup.addEventListener('keydown',e=>{const options=[...popup.querySelectorAll('[role=option]')],i=options.indexOf(document.activeElement);if(e.key==='Escape'||e.key==='Tab'){e.preventDefault();e.stopPropagation();close(true);}if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();options[e.key==='Home'?0:e.key==='End'?options.length-1:(i+(e.key==='ArrowDown'?1:-1)+options.length)%options.length]?.focus();}});
  document.addEventListener('click',e=>{if(!popup.contains(e.target)&&!button.contains(e.target))close(false);});window.addEventListener('resize',()=>close(false));document.addEventListener('barnes:filters-open',()=>close(false));
 }

 function mountMaps(){
  const toolbar=document.querySelector('.catalog-mode-toolbar[data-node-filters-ready]');if(!toolbar)return;
  const mainDirection=toolbar.querySelector('.catalog-direction:not(.catalog-market):not(.node-filter-market) select');
  const mainMarket=toolbar.querySelector('.catalog-market select,.node-filter-market select');
  const mainSort=document.querySelector('.catalog-grid__sort select');if(!mainSort||!mainDirection)return;
  const roots=[...document.querySelectorAll('.map-browser:not(.node-country-map-controls)')];
  const countryPanel=direction==='country'?document.querySelector('.catalog-projects-map__panel'):null;
  if(countryPanel&&!countryPanel.querySelector('.node-country-map-controls')){
   const sourceSearch=countryPanel.querySelector('.catalog-projects-map__panel-search-row');
   const wrapper=document.createElement('div');wrapper.className='map-browser node-country-map-controls';
   sourceSearch.querySelector('input').addEventListener('input',event=>window.countryListing.setSelection('query',event.target.value));
   sourceSearch.before(wrapper);wrapper.append(sourceSearch);sourceSearch.classList.add('map-browser__search-row');
   sourceSearch.querySelector('label').classList.add('map-browser__search');sourceSearch.querySelector('button').classList.add('map-browser__filter-toggle');
   countryPanel.querySelectorAll('.country-map-market,.catalog-projects-map__panel-filters,.country-map-reference').forEach(e=>e.dataset.nodeMapSource='');roots.push(wrapper);
  }
  const existingCountry=countryPanel?.querySelector('.node-country-map-controls');if(existingCountry&&!roots.includes(existingCountry))roots.push(existingCountry);
  for(const root of roots){
   root.classList.add('catalog-map-browser');
   if(root.nodeFilterSync){root.nodeFilterSync();continue;}
   let old=root.querySelector('.map-browser__filters');if(!old&&root!==existingCountry)continue;
   if(old)old.dataset.nodeMapSource='';
   const holder=document.createElement('template');holder.innerHTML=mapTemplate;const controls=holder.content.firstElementChild;root.dataset.nodeMapReady='true';
   if(old)old.after(controls);else root.append(controls);
   if(direction==='commercial')root.querySelector('input[type=search]').addEventListener('input',event=>window.BarnesFilters.patch({query:event.target.value}));
   const dept=controls.querySelector('[data-node-map-direction]'),market=controls.querySelector('[data-node-map-market]'),sort=controls.querySelector('[data-node-map-sort]');
   dept.replaceChildren(...[...mainDirection.options].map(o=>o.cloneNode(true)));dept.value=mainDirection.value;
   sort.replaceChildren(...[...mainSort.options].map(o=>o.cloneNode(true)));sort.value=mainSort.value;
   market.closest('label').hidden=!mainMarket;
   dept.addEventListener('change',()=>{const value=dept.value;const url=new URL('../katalog-nedvizhimosti/',location.href);const aliases={'zagorodnaya-nedvizhimost':'country','gorodskaya-nedvizhimost':'city','kommercheskaya-nedvizhimost':'commercial','kurortnaya':'resort','mezhdunarodnaya-nedvizhimost':'international'};url.searchParams.set('direction',aliases[value]||value);url.searchParams.set('deal',document.body.dataset.nodeDeal==='rent'?'rent':'buy');const event=new CustomEvent('barnes:department',{bubbles:true,cancelable:true,detail:{direction:aliases[value]||value,url:url.href}});if(toolbar.dispatchEvent(event))location.href=url.href;});
   market.addEventListener('change',()=>{mainMarket.value=market.value;mainMarket.dispatchEvent(new Event('change',{bubbles:true}));});
   sort.addEventListener('change',()=>{mainSort.value=sort.value;mainSort.dispatchEvent(new Event('change',{bubbles:true}));});
   controls.querySelectorAll('[data-node-map-mode]').forEach((button,i)=>button.addEventListener('click',()=>toolbar.querySelectorAll('.catalog-toolbar__primary>.catalog-mode-switch button')[i]?.click()));
   controls.querySelector('.map-browser__reset').addEventListener('click',()=>document.querySelector('.catalog-collections-row .catalog-reset-all')?.click());
   if(mainMarket)upgradeSelect(market);
   function sync(){
    if(direction==='commercial'){const input=root.querySelector('input[type=search]'),value=window.BarnesFilters.getState().query||'';if(input.value!==value)input.value=value;}
    if(root.classList.contains('node-country-map-controls')){const input=root.querySelector('input[type=search]'),value=window.countryListing.getSelection().query||'';if(input.value!==value)input.value=value;}
    for(let i=0;i<dept.options.length;i++){dept.options[i].disabled=mainDirection.options[i].disabled;dept.options[i].hidden=mainDirection.options[i].hidden;}
    const brands=(root.classList.contains('node-country-map-controls')?root.parentElement:root).querySelector('[data-brand-context=map]');if(brands&&!controls.contains(brands))controls.querySelector('.map-browser__reset').before(brands);
    if(brands){brands.hidden=true;brands.inert=true;brands.classList.add('node-map-brands-hidden','barnes-brand-filters');brands.querySelectorAll('.country-brand-filters__box').forEach(e=>e.classList.add('barnes-brand-filters__box'));}
    const rental=document.body.dataset.nodeDeal==='rent';market.closest('label').hidden=!mainMarket||rental;
    controls.querySelector('[data-node-map-mode="1"]').hidden=['resort','international'].includes(direction);
    if(mainMarket&&market.value!==mainMarket.value){market.value=mainMarket.value;market.dispatchEvent(new Event('input'));}
    if(sort.value!==mainSort.value){sort.value=mainSort.value;sort.dispatchEvent(new Event('input'));}
    const dealButtons=toolbar.querySelectorAll('.catalog-toolbar__primary>.catalog-mode-switch button');
    controls.querySelectorAll('[data-node-map-mode]').forEach((button,i)=>button.setAttribute('aria-pressed',dealButtons[i]?.getAttribute('aria-pressed')||'false'));
   }
   const owner=root.classList.contains('node-country-map-controls')?root.closest('.catalog-projects-map'):root;let savedViewport=null;
   function viewport(){const open=owner===root?!root.hidden:owner.classList.contains('country-map-expanded');if(open&&!savedViewport){savedViewport={overflow:document.documentElement.style.overflow,gutter:document.documentElement.style.scrollbarGutter};document.documentElement.style.overflow='hidden';document.documentElement.style.scrollbarGutter=innerWidth<=540?'auto':'stable';}else if(!open&&savedViewport){document.documentElement.style.overflow=savedViewport.overflow;document.documentElement.style.scrollbarGutter=savedViewport.gutter;savedViewport=null;}}
   new MutationObserver(viewport).observe(owner,{attributes:true,attributeFilter:owner===root?['hidden']:['class']});document.addEventListener('fullscreenchange',viewport);viewport();
   root.nodeFilterSync=sync;sync();document.addEventListener('barnes:filters-apply',sync);document.addEventListener('country-listing-render',sync);document.addEventListener('barnes:node-deal-change',sync);
  }
 }

 // Reuse each node's listing card, never another direction's object facts.
 window.addEventListener('click',event=>{const button=event.target.closest?.('[data-node-map-listing-card] .apartment-card__call-btn');if(button?.nodeMapRequest){event.preventDefault();event.stopImmediatePropagation();button.nodeMapRequest();}},true);
 function enhanceMapCards(){
  const cards=[...document.querySelectorAll('.catalog-grid__list>.catalog-grid__item>.apartment-card')];if(!cards.length)return;
  const path=url=>{try{return new URL(url,location.href).pathname.replace(/\/$/,'');}catch{return url;}};
  const href=card=>card.querySelector('.apartment-card__name[href],.apartment-card__media-link[href],.apartment-card__link[href]')?.href;
  function closeMap(root){if(root.matches('.catalog-projects-map'))root.querySelector('.catalog-projects-map__exit')?.click();else root.querySelector('.map-browser__close')?.click();}
  function copyCard(source,root,record){
   const card=source.cloneNode(true);card.dataset.nodeMapListingCard='true';
   card.querySelectorAll('[id]').forEach(e=>e.removeAttribute('id'));
   card.querySelectorAll('img').forEach(e=>e.loading='lazy');
   if(record){
    card.querySelectorAll('.apartment-card__address,.apartment-card__lotid,.apartment-card__badge,.apartment-card__badges').forEach(e=>e.remove());
    const name=card.querySelector('.apartment-card__name');name.replaceChildren(document.createTextNode(record.name));
    card.querySelectorAll('a[href]').forEach(e=>e.href=record.href);
    const image=card.querySelector('.apartment-card__image');image.src=record.image;image.alt=record.name;image.removeAttribute('srcset');
    const price=card.querySelector('.apartment-card__price');if(price)price.textContent=record.price;
    card.querySelectorAll('.listing-card-fact__value,.apartment-card__stat-value').forEach(e=>{e.textContent='По запросу';e.removeAttribute('title');});
    // No saved favorite identity exists for these map-only records.
    card.querySelector('.apartment-card__favorite')?.remove();
   }else{
    const favorite=card.querySelector('.apartment-card__favorite'),original=source.querySelector('.apartment-card__favorite');
    favorite?.addEventListener('click',()=>{const before=original.getAttribute('aria-pressed');original.click();requestAnimationFrame(()=>{if(original.getAttribute('aria-pressed')===before){const active=before!=='true';original.setAttribute('aria-pressed',String(active));original.classList.toggle('apartment-card__favorite--active',active);}favorite.setAttribute('aria-pressed',original.getAttribute('aria-pressed'));favorite.className=original.className;});});
   }
   const call=card.querySelector('.apartment-card__call-btn');if(call)call.nodeMapRequest=()=>{closeMap(root);const original=!record&&source.querySelector('.apartment-card__call-btn');original?.click();requestAnimationFrame(()=>{const dialog=[...document.querySelectorAll('[role=dialog]')].some(e=>e.getBoundingClientRect().height>0&&getComputedStyle(e).visibility!=='hidden');if(!dialog){const input=document.querySelector('.catalog-consultation input:not([type=checkbox]):not([tabindex="-1"])');input?.scrollIntoView({block:'center'});input?.focus({preventScroll:true});}});};
   return card;
  }
  function listingRows(root,list,items){
   const key=items.map(e=>e.outerHTML).join('');
   const own=[...list.children].every(e=>e.dataset.nodeMapCard||e.classList.contains('node-map-empty'));
   if(list.nodeListingKey===key&&own)return;list.nodeListingKey=key;
   const rows=items.map(source=>{const row=document.createElement('div');row.className='map-browser__card';row.dataset.nodeMapCard='listing';row.append(copyCard(source,root));return row;});
   if(!rows.length){const empty=document.createElement('p');empty.className='map-browser__empty node-map-empty';empty.textContent='Ничего не найдено. Измени запрос или сбрось фильтры.';rows.push(empty);}list.replaceChildren(...rows);
   root.querySelector('.map-browser__heading,.catalog-projects-map__panel-title').textContent='Найдено объектов: '+items.length;
  }
  const countryRoot=document.querySelector('.catalog-projects-map:has(.node-country-map-controls)');
  if(countryRoot){const list=countryRoot.querySelector('.catalog-projects-map__panel-list');if(list){list.classList.add('catalog-grid','node-map-listing');listingRows(countryRoot,list,cards.filter(c=>c.closest('.catalog-grid__item').dataset.nodeFilterMatch==='true'));}}
  for(const root of document.querySelectorAll('.map-browser:not(.node-country-map-controls)')){
   const list=root.querySelector('.map-browser__list');if(!list)continue;list.classList.add('catalog-grid','node-map-listing');
   if(direction==='commercial'){listingRows(root,list,cards.filter(c=>!c.closest('.catalog-grid__item').hidden));continue;}
   for(const row of list.querySelectorAll(':scope>.map-browser__card:not([data-node-map-card])')){
    const record={href:row.querySelector('a')?.href,name:row.querySelector('h3')?.textContent,image:row.querySelector('img')?.src,price:row.querySelector('p')?.textContent||'Цена по запросу'};
    const source=cards.find(c=>path(href(c))===path(record.href));
    row.dataset.nodeMapCard=source?'listing':'record';row.replaceChildren(copyCard(source||cards[0],root,source?null:record));
   }
  }
 }

 function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;mount();mountMaps();enhanceMapCards();document.querySelectorAll('.country-catalog-filters').forEach(e=>e.classList.add('resort-filters'));for(const modal of document.querySelectorAll('.hero-filter-modal.resort-filters')){modal.classList.add('hero-filter-modal--dark');for(const name of ['hero-filter-panel','hero-filter-panel-content','ui-checkbox','ui-switch'])modal.querySelectorAll('.'+name).forEach(e=>e.classList.add(name+'--dark'));}});}
 new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});document.addEventListener('barnes:node-ready',schedule);document.addEventListener('DOMContentLoaded',schedule);document.addEventListener('country-listing-render',schedule);document.addEventListener('barnes:filters-apply',schedule);schedule();
})();
