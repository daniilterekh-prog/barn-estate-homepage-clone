/* Resort catalogue composition, with commercial state/data kept intact. */
(()=>{
 const toolbar=document.querySelector('.catalog-mode-toolbar');if(!toolbar||toolbar.dataset.catalogLayout)return;
 toolbar.dataset.catalogLayout='commercial';
 const grid=toolbar.closest('.catalog-grid'),quick=toolbar.querySelector('.catalog-mode-filters');
 const deal=toolbar.querySelector('.catalog-mode-switch'),details=toolbar.querySelector('.catalog-mode-detailed-filters');
 const sort=toolbar.querySelector('.catalog-grid__sort'),brands=toolbar.querySelector('.barnes-brand-filters');
 const primary=document.createElement('div'),secondary=document.createElement('div');
 primary.className='catalog-toolbar__primary';secondary.className='catalog-toolbar__secondary';
 primary.innerHTML='<label class="catalog-direction catalog-department"><span class="visually-hidden">Департамент недвижимости</span><select aria-label="Департамент недвижимости"><option value="city">Москва</option><option value="country">Загородная</option><option value="commercial" selected>Коммерческая</option><option value="resort">Курортная</option><option value="international">Зарубежная</option></select><svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m3 6 5 5 5-5" stroke="currentColor" stroke-width="1.2"/></svg></label>';
 const search=document.createElement('div');search.className='catalog-search-row';
 search.innerHTML='<label class="catalog-text-search"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="7" stroke="currentColor" stroke-width="1.35"/><path d="m16 16 5 5" stroke="currentColor" stroke-width="1.35"/></svg><span class="visually-hidden">Поиск по названию, адресу или ID</span><input type="search" placeholder="Название, адрес или ID" autocomplete="off" data-catalog-search></label>';
 // Keep configuration IDs stable while matching the reference's visual order.
 const items=[...quick.children];items.forEach((item,index)=>item.querySelector('button').dataset.quickIndex=index);
 const district=items.find(item=>item.classList.contains('commercial-district'));if(district)quick.prepend(district);
 primary.append(deal,search);secondary.append(quick,details);
 details.insertAdjacentHTML('beforeend','<span class="catalog-filter-count" data-filter-count aria-hidden="true" hidden></span>');
 const collections=document.createElement('div');collections.className='catalog-collections-row';
 collections.innerHTML='<div class="catalog-active-filters" role="group" aria-label="Выбранные фильтры"></div><button class="catalog-reset-all" type="button" data-catalog-reset hidden>Сбросить фильтры</button>';
 if(brands)collections.prepend(brands);
 const summary=document.createElement('div');summary.className='catalog-result-summary';
 summary.innerHTML='<p class="catalog-result-count" role="status">12 объектов в снимке</p><div class="catalog-result-actions"><button type="button" class="catalog-map-trigger" aria-haspopup="dialog"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z M9 3v15 M15 6v15"/></svg><span>На карте</span></button></div>';
 summary.querySelector('.catalog-result-actions').append(sort);toolbar.replaceChildren(primary,secondary);toolbar.after(collections,summary);
 const input=search.querySelector('input'),small=matchMedia('(max-width:767px)');
 function layout(){if(small.matches){secondary.insertBefore(search,details);summary.after(collections);}else{primary.append(search);toolbar.after(collections);}input.placeholder=small.matches?'Название или ID':'Название, адрес или ID';}
 function patch(value){window.BarnesFilters.patch(value);}
 const list=grid.querySelector('.catalog-grid__list'), captured=[...list.querySelectorAll(':scope > .catalog-grid__item')];
 const originalMore=grid.querySelector('.catalog-grid__more'),more=document.createElement('a');
 for(const attr of originalMore.attributes)if(attr.name!=='type')more.setAttribute(attr.name,attr.value);
 more.append(...originalMore.childNodes);originalMore.replaceWith(more);
 function moreURL(value){
  const url=new URL('../katalog-nedvizhimosti/',location.href);url.searchParams.set('direction','commercial');url.searchParams.set('deal',value.dealType==='rent'?'rent':'buy');
  for(const key of ['priceMin','priceMax','areaMin','areaMax','sort'])if(value[key])url.searchParams.set(key,value[key]);
  if(value.query)url.searchParams.set('q',value.query);
  for(const key of ['priceRanges','brandFlags'])for(const v of value[key]||[])url.searchParams.append(key,v);
  for(const type of value.propertyTypes||[])url.searchParams.append('propertyTypes',({ofice:'office',stock:'warehouse','free-appointment':'free-purpose'})[type]||type);
  return url.href;
 }

 /* COMMERCIAL METADATA START */const commercialMetadata={"584862":{"deal":"rent","propertyTypes":["free-purpose"],"brandFlags":[],"directions":["Москва"]},"587810":{"deal":"rent","propertyTypes":["office"],"brandFlags":[],"directions":["Москва"]},"593724":{"deal":"rent","propertyTypes":["office"],"brandFlags":[],"directions":["Москва"]},"595200":{"deal":"rent","propertyTypes":["office"],"brandFlags":[],"directions":["Москва"]}};/* COMMERCIAL METADATA END */
 const numeric=text=>Number(String(text).replace(/[^\d,.-]/g,'').replace(',','.'));
 const records=captured.map((item,index)=>{const name=item.querySelector('.apartment-card__name')?.textContent.trim()||'',text=item.textContent.toLocaleLowerCase('ru');const stat=[...item.querySelectorAll('.apartment-card__stat')].find(e=>e.querySelector('small')?.textContent.includes('Площадь'));const search=(name+' '+(item.querySelector('.apartment-card__address')?.textContent||'')+' '+(item.querySelector('.apartment-card__lotid')?.textContent||'')).toLocaleLowerCase('ru');const metadata=commercialMetadata[(item.querySelector('.apartment-card__lotid')?.textContent||'').replace(/\D/g,'')];return{item,index,name,text,search,metadata,deal:metadata?.deal==='rent'?'rent':metadata?.deal==='buy'?'purchase':/^Аренда|^Сда[её]тся/i.test(name)?'rent':/^Продажа/i.test(name)?'purchase':null,price:numeric(item.querySelector('.apartment-card__price')?.textContent||''),area:numeric(stat?.querySelector('b')?.textContent||'')};});
 const knownTypes={ofice:/офис/i,bc:/^(?:аренда|продажа)\s+(?:бизнес.?центр|БЦ)/i,building:/^(?:аренда|продажа)\s+(?:здани|особняк)/i,retail:/ритейл|торгов.*помещ/i,restaurant:/ресторан/i,stock:/склад/i,'free-appointment':/свободного назначения/i,'commercial-land':/земель|участок/i,'ready-rental-business':/готов.*арендн.*бизнес/i,'ready-business':/готов.*бизнес/i,tc:/торгов.*центр/i};
 let empty=grid.querySelector('.catalog-filter-empty');if(!empty){empty=document.createElement('div');empty.className='catalog-filter-empty';empty.innerHTML='<p>Ничего не найдено. Попробуй изменить параметры.</p><button type="button" data-catalog-reset>Сбросить фильтры</button>';list.before(empty);empty.querySelector('button').addEventListener('click',()=>collections.querySelector('[data-catalog-reset]').click());}
 function filterRecords(value){const query=(value.query||'').trim().toLocaleLowerCase('ru'),ranges={'50m':[0,50e6],'50-100m':[50e6,100e6],'100-200m':[100e6,200e6],'200m+':[200e6,Infinity],'rent-1m':[0,1e6],'rent-1-3m':[1e6,3e6],'rent-3-5m':[3e6,5e6],'rent-5m+':[5e6,Infinity]};let count=0;
  for(const r of records){let show=(!query||r.search.includes(query))&&(!value.dealType||r.deal===value.dealType);
   for(const [key,n]of [['price',r.price],['area',r.area]]){if(value[key+'Min'])show=show&&n>0&&n>=Number(value[key+'Min']);if(value[key+'Max'])show=show&&n>0&&n<=Number(value[key+'Max']);}
   if(value.propertyTypes?.length)show=show&&value.propertyTypes.some(t=>r.metadata?.propertyTypes?.includes(({ofice:'office','free-appointment':'free-purpose',stock:'warehouse'})[t]||t)||knownTypes[t]?.test(r.name));
   if(value.priceRanges?.length)show=show&&value.priceRanges.some(key=>ranges[key]&&r.price>=ranges[key][0]&&r.price<=ranges[key][1]);
   if(value.districts?.length)show=show&&value.districts.some(d=>r.text.includes(d.toLocaleLowerCase('ru')));
   if(value.brandFlags?.length)show=show&&value.brandFlags.every(flag=>flag==='exclusive'?/эксклюзив/i.test(r.text):/выбор barn/i.test(r.text));
   if(value.features?.length)show=show&&value.features.every(flag=>flag==='trophy'&&/трофейн/i.test(r.text));
   r.match=show;r.item.hidden=!show;if(show)count++;
  }
  const sort=grid.querySelector('.catalog-grid__sort select').value;const ordered=[...records].sort((a,b)=>a.match!==b.match?Number(b.match)-Number(a.match):sort==='price_asc'?a.price-b.price:sort==='price_desc'?b.price-a.price:sort==='square_asc'?a.area-b.area:sort==='square_desc'?b.area-a.area:a.index-b.index);for(const r of ordered)list.append(r.item);
  const countNode=summary.querySelector('.catalog-result-count');countNode.textContent=count+' '+(count%100>=11&&count%100<=14?'объектов':count%10===1?'объект':count%10>=2&&count%10<=4?'объекта':'объектов');empty.hidden=!!count;const footer=grid.querySelector('.catalog-grid__footer');if(footer)footer.hidden=!count;more.href=moreURL(value);
 }
 function sync(){
  const value=window.BarnesFilters.getState(),groups=[];input.value=value.query||'';const sortSelect=grid.querySelector('.catalog-grid__sort select');if(sortSelect.value!==(value.sort||'relevance')){sortSelect.value=value.sort||'relevance';sortSelect.dispatchEvent(new Event('change',{bubbles:true}));}filterRecords(value);
  const labelMaps={propertyTypes:Object.fromEntries((window.BarnesQuickConfig[0].values||[]).map((v,i)=>[v,window.BarnesQuickConfig[0].choices[i]])),brandFlags:{selection:'Выбор BARN Estate',exclusive:'Эксклюзив BARN Estate'}};
  for(const key of ['districts','propertyTypes','priceRanges','brandFlags','features'])for(const v of value[key]||[]){groups.push({key,label:labelMaps[key]?.[v]||v,fields:{[key]:(value[key]||[]).filter(x=>x!==v)}});}
  for(const [key,label]of [['price','Стоимость'],['area','Площадь']])if(value[key+'Min']||value[key+'Max'])groups.push({key,label:label+': '+(value[key+'Min']||'от')+'–'+(value[key+'Max']||'до'),fields:{[key+'Min']:'',[key+'Max']:''}});
  if(value.query)groups.push({key:'query',label:'Поиск: '+value.query,fields:{query:''}});
  const chips=collections.querySelector('.catalog-active-filters');chips.replaceChildren();
  for(const group of groups){const b=document.createElement('button');b.type='button';b.className='catalog-active-filter';b.setAttribute('aria-label','Убрать фильтр: '+group.label);const text=document.createElement('span');text.textContent=group.label;const close=document.createElement('span');close.textContent='×';close.setAttribute('aria-hidden','true');b.append(text,close);b.onclick=()=>patch(group.fields);chips.append(b);}
  collections.querySelector('[data-catalog-reset]').hidden=!groups.length;
  const badge=details.querySelector('[data-filter-count]'),count=new Set(groups.map(g=>g.key)).size;badge.hidden=!count;badge.textContent=count;details.setAttribute('aria-label',count?'Все фильтры: выбрано '+count:'Все фильтры');
 }
 input.addEventListener('input',()=>patch({query:input.value}));
 collections.querySelector('[data-catalog-reset]').addEventListener('click',()=>{const v=window.BarnesFilters.getState(),clear={};Object.keys(v).filter(k=>k!=='dealType').forEach(k=>clear[k]=Array.isArray(v[k])?[]:'');clear.sort='relevance';patch(clear);});
 summary.querySelector('.catalog-map-trigger').addEventListener('click',e=>window.BarnesMapBrowser.open(e.currentTarget));
 primary.querySelector('select').addEventListener('change',e=>{const direction=e.target.value;if(direction==='commercial')return;const url=new URL('https://daniilterekh-prog.github.io/barn-estate-homepage-clone/katalog-nedvizhimosti/');url.searchParams.set('direction',direction);url.searchParams.set('deal',window.BarnesFilters.getState().dealType==='rent'?'rent':'buy');const event=new CustomEvent('barnes:department',{bubbles:true,cancelable:true,detail:{direction,url:url.href}});if(toolbar.dispatchEvent(event))location.href=url.href;});
 grid.querySelector('.catalog-grid__sort select').addEventListener('change',()=>{const value=grid.querySelector('.catalog-grid__sort select').value;if(window.BarnesFilters.getState().sort!==value)patch({sort:value});});document.addEventListener('barnes:filters-apply',sync);small.addEventListener('change',layout);layout();patch({dealType:'rent'});sync();
})();
