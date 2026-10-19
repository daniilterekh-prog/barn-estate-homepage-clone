/* Configure the same canonical modal; keep its styling, focus and validation. */
(() => {
 const source=document.createElement('template');source.innerHTML=window.BarnesFilterTemplate;
 source.content.querySelectorAll('.hero-filter-panel-content__group--toggle').forEach(group=>group.remove());
 const areaGroup=source.content.querySelector('[name=areaMin]').closest('.hero-filter-panel-content__group');
 const land=areaGroup.cloneNode(true);land.dataset.contextGroup='land';land.querySelector('.hero-filter-panel-content__title').textContent='Площадь участка, сотки';
 land.querySelector('[name=areaMin]').name='landMin';land.querySelector('[name=areaMax]').name='landMax';
 land.querySelectorAll('input').forEach(input=>{input.disabled=true;input.setAttribute('aria-label',input.name==='landMin'?'Площадь участка от, сотки':'Площадь участка до, сотки');});land.hidden=true;areaGroup.after(land);
 window.BarnesFilterTemplate=source.innerHTML;
 window.BarnesCatalogConfigureContext=(key,deal)=>{
  const profile=window.BarnesCatalogProfiles[key],configs=window.BarnesCatalogConfigs(key,deal);
  document.dispatchEvent(new CustomEvent('barnes:filters-open'));
  window.BarnesCatalogQuickConfig.splice(0,window.BarnesCatalogQuickConfig.length,...configs);
  const buttons=[...document.querySelectorAll('.catalog-mode-filters .catalog-quick-filters__button')];
  buttons.forEach((button,i)=>{
   button.querySelector('.catalog-quick-filters__caption').textContent=configs[i].title;
   if(i===3)button.querySelector('.catalog-quick-filters__icon').innerHTML=profile.bedrooms?'<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 18v-7.5M21 18v-5.5a2 2 0 0 0-2-2h-7.5A2.5 2.5 0 0 0 9 13v2M3 15h18M5.5 10.5h2A1.5 1.5 0 0 1 9 12v3H4v-3a1.5 1.5 0 0 1 1.5-1.5Z" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/></svg>':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" aria-hidden="true"><path d="M4 4h16v16H4zM4 9h4M4 14h4M9 4v4M14 4v4"/></svg>';
  });
  window.BarnesFilters.configure(modal=>{
   for(const [name,options,title] of [
    ['directions',profile.locations.map(v=>[v,v]),profile.location],
    ['propertyTypes',profile.types.map(v=>[v,window.BarnesCatalogTypes[v]]),profile.typeTitle||'Тип недвижимости'],
    ['priceRanges',configs[2].values.map((v,i)=>[v,configs[2].choices[i]]),'Диапазоны']
   ]){
    const input=modal.querySelector(`[name="${name}"]`),original=input.closest('label'),container=original.parentElement;
    container.replaceChildren(...options.map(([value,label])=>{const node=original.cloneNode(true);node.querySelector('input').value=value;node.querySelector('input').checked=false;node.querySelector('.ui-checkbox__label').textContent=label;return node;}));
    container.closest('.hero-filter-panel-content__group').querySelector('.hero-filter-panel-content__title').textContent=title;
   }
   const rooms=modal.querySelector('[name=roomsMin]').closest('.hero-filter-panel-content__group');rooms.hidden=!profile.rooms;rooms.querySelectorAll('input').forEach(input=>input.disabled=!profile.rooms);
   const land=modal.querySelector('[data-context-group=land]');land.hidden=!profile.land;land.querySelectorAll('input').forEach(input=>input.disabled=!profile.land);
   const area=modal.querySelector('[name=areaMin]').closest('.hero-filter-panel-content__group');area.querySelector('.hero-filter-panel-content__title').textContent=(profile.areaTitle||'Общая площадь')+', м²';
   area.querySelectorAll('input').forEach(input=>input.setAttribute('aria-label',(profile.areaTitle||'Площадь')+(input.name==='areaMin'?' от':' до')+', м²'));
   const price=modal.querySelector('[name=priceMin]').closest('.hero-filter-panel-content__group');price.querySelector('.hero-filter-panel-content__title').textContent=deal==='rent'?'Цена, ₽ в месяц':'Цена, ₽';
  });
 };
})();
