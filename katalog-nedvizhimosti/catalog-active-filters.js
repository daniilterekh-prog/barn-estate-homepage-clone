/* Selected conditions are a view of catalogue state, with per-condition removal. */
(()=>{
 const api=window.BarnesCatalogListing,row=document.querySelector('.catalog-collections-row'),container=row.querySelector('[data-active-filters]');
 const money=new Intl.NumberFormat('ru-RU'),brand={selection:'Выбор BARN Estate',exclusive:'Эксклюзив BARN Estate'};
 function render(snapshot=api.getSnapshot()){
  if(!snapshot.ready)return;
  const state=snapshot.filters,conditions=[],profile=window.BarnesCatalogProfiles[snapshot.direction];
  const patch=fields=>window.BarnesFilters.patch(fields);
  for(const key of ['directions','propertyTypes','priceRanges','areaRanges','brandFlags'])for(const value of state[key]||[]){
   const config=window.BarnesCatalogQuickConfig.find(c=>c.key===key),index=config?(config.values||config.choices).indexOf(value):-1;
   const label=key==='brandFlags'?brand[value]:key==='propertyTypes'?window.BarnesCatalogTypes[value]:index>=0?config.choices[index]:value;
   conditions.push([label||value,()=>patch({[key]:(state[key]||[]).filter(item=>item!==value)})]);
  }
  if(state.bedrooms)conditions.push(['Спальни: '+state.bedrooms,()=>patch({bedrooms:''})]);
  for(const [prefix,label,unit] of [['price','Стоимость',' ₽'],['area',profile.areaTitle||'Площадь',' м²'],['land','Участок',' соток'],['rooms','Комнаты','']]){
   const min=state[prefix+'Min'],max=state[prefix+'Max'];if(!min&&!max)continue;
   const text=(min?'от '+money.format(Number(min)):'')+(min&&max?' ':'')+(max?'до '+money.format(Number(max)):'');
   conditions.push([label+': '+text+unit,()=>patch({[prefix+'Min']:'',[prefix+'Max']:''})]);
  }
  if(snapshot.query)conditions.push(['Поиск: '+snapshot.query,()=>api.setQuery('')]);
  if(snapshot.onlyFavorites)conditions.push(['Только избранное',()=>document.querySelector('[data-show-favorites]').click()]);
  container.replaceChildren(...conditions.map(([label,remove])=>{
   const button=document.createElement('button'),text=document.createElement('span');button.type='button';button.className='catalog-active-filter';button.setAttribute('aria-label','Удалить условие: '+label);button.title=label;text.textContent=label;button.append(text);
   button.insertAdjacentHTML('beforeend','<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8"/></svg>');
   button.addEventListener('click',()=>{const index=[...container.children].indexOf(button);remove();(container.children[Math.min(index,container.children.length-1)]||document.querySelector('.catalog-mode-detailed-filters')).focus({preventScroll:true});});return button;
  }));
 }
 document.addEventListener('barn:catalog-results',event=>render(event.detail));render();
})();
