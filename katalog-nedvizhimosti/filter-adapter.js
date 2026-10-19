/* Page option adapter. UI markup, popup engine and modal remain the BARNES export. */
(() => {
  const directions = ['Москва','Подмосковье','Сочи','Анапа','Алтай','Архыз'];
  const types = [['flat','Квартира'],['apartment','Апартаменты'],['new_build','Квартира в новостройке'],['penthouse','Пентхаус'],['house','Дом']];
  window.BarnesCatalogQuickConfig = [
    {title:'Локация',key:'directions',reset:'Все локации',choices:directions},
    {title:'Тип',key:'propertyTypes',reset:'Любой тип',choices:types.map(v=>v[1]),values:types.map(v=>v[0])},
    {title:'Стоимость',key:'priceRanges',reset:'Любая',choices:['до 50 млн ₽','50 – 100 млн ₽','100 – 200 млн ₽','от 200 млн ₽'],values:['50m','50-100m','100-200m','200m+']},
    {title:'Спальни',key:'bedrooms',reset:'Любые',choices:['1','2','3','Более 3'],values:['1','2','3','4+']}
  ];
  const template = document.createElement('template');
  template.innerHTML = window.BarnesFilterTemplate;
  for (const [name,choices] of [['directions',directions.map(v=>[v,v])],['propertyTypes',types]]) {
    const original=template.content.querySelector(`[name="${name}"]`).closest('label');
    const container=original.parentElement;
    container.replaceChildren(...choices.map(([value,label])=>{
      const node=original.cloneNode(true);node.querySelector('input').value=value;
      node.querySelector('.ui-checkbox__label').textContent=label;return node;
    }));
  }
  // No unsupported finishing/lift/trophy filters: the saved records contain no such metadata.
  template.content.querySelectorAll('.hero-filter-panel-content__group--toggle').forEach(group=>group.remove());
  window.BarnesFilterTemplate=template.innerHTML;
})();
