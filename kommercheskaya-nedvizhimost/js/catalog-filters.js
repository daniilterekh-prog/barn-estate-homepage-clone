/* Resort catalogue composition, with commercial state/data kept intact. */
(()=>{
 const toolbar=document.querySelector('.catalog-mode-toolbar');if(!toolbar||toolbar.dataset.catalogLayout)return;
 toolbar.dataset.catalogLayout='commercial';
 const grid=toolbar.closest('.catalog-grid'),quick=toolbar.querySelector('.catalog-mode-filters');
 const deal=toolbar.querySelector('.catalog-mode-switch'),details=toolbar.querySelector('.catalog-mode-detailed-filters');
 const sort=toolbar.querySelector('.catalog-grid__sort'),brands=toolbar.querySelector('.barnes-brand-filters');
 const primary=document.createElement('div'),secondary=document.createElement('div');
 primary.className='catalog-toolbar__primary';secondary.className='catalog-toolbar__secondary';
 primary.innerHTML='<label class="catalog-direction catalog-department"><span class="visually-hidden">Департамент недвижимости</span><select aria-label="Департамент недвижимости"><option value="city">Городская</option><option value="country">Загородная</option><option value="commercial" selected>Коммерческая</option><option value="resort">Курортная</option><option value="international">Зарубежная</option></select><svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m3 6 5 5 5-5" stroke="currentColor" stroke-width="1.2"/></svg></label>';
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
 function sync(){
  const value=window.BarnesFilters.getState(),groups=[];input.value=value.query||'';
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
 primary.querySelector('select').addEventListener('change',e=>{const direction=e.target.value;if(direction==='commercial')return;const url=new URL('https://daniilterekh-prog.github.io/barn-estate-homepage-clone/katalog-nedvizhimosti/');url.searchParams.set('direction',direction);const event=new CustomEvent('barnes:department',{bubbles:true,cancelable:true,detail:{direction,url:url.href}});if(toolbar.dispatchEvent(event))location.href=url.href;});
 document.addEventListener('barnes:filters-apply',sync);small.addEventListener('change',layout);layout();sync();
})();
