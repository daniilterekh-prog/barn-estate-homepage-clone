/* Public optional fields only. CRM/API access stays outside the browser. */
(()=>{
  'use strict';
  const missing=new Set(['','0','0.0','0,0','—','-','null','undefined','n/a','не указано','не указана','не заполнено','не заполнена','неизвестно','другое','по запросу','уточняется']);
  function text(value){
    if(typeof value!=='string'&&typeof value!=='number')return '';
    if(typeof value==='number'&&!Number.isFinite(value))return '';
    const result=String(value).replace(/\u00a0/g,' ').trim();
    return missing.has(result.toLowerCase())?'':result;
  }
  function year(value){
    const valueText=text(value).replace(/\s/g,'');
    if(!/^\d{4}$/.test(valueText))return '';
    const number=Number(valueText);
    return number>=1900&&number<=2199?String(number):'';
  }
  function ceiling(value){
    const valueText=text(value);
    if(!valueText||/^[-−]\s*\d/.test(valueText))return '';
    const numbers=valueText.match(/\d+(?:[.,]\d+)?/g);
    if(!numbers||numbers.some(n=>Number(n.replace(',','.'))<=0))return '';
    if(/^\d+(?:[.,]\d+)?$/.test(valueText))return valueText.replace('.',',')+'\u00a0м';
    return valueText.replace(/(\d)\s+м(?=[\s.,;]|$)/g,'$1\u00a0м');
  }
  function normalize(data={}){
    return [
      {key:'handover_year',label:'Год сдачи',value:year(data.handover_year)},
      {key:'finishing',label:'Отделка',value:text(data.finishing)},
      {key:'ceiling_height',label:'Высота потолков',value:ceiling(data.ceiling_height)}
    ].filter(item=>item.value);
  }
  function render(root,data){
    const items=normalize(data);
    Array.from(root.children).filter(cell=>cell.hasAttribute('data-optional-fact')).forEach(cell=>cell.remove());
    for(const item of items){
      const cell=document.createElement('div'),label=document.createElement('dt'),value=document.createElement('dd');
      cell.dataset.optionalFact='true';cell.dataset.characteristic=item.key;label.textContent=item.label;value.textContent=item.value;
      cell.append(label,value);root.append(cell);
    }
    root.dataset.count=String(items.length);root.hidden=false;
    return items;
  }
  window.BarnProjectCharacteristics={normalize,render};
  const root=document.querySelector('#project-optional-facts'),source=document.querySelector('#project-optional-data');
  if(root&&source){
    try{render(root,JSON.parse(source.textContent));}
    catch{Array.from(root.children).filter(cell=>cell.hasAttribute('data-optional-fact')).forEach(cell=>cell.remove());root.dataset.count='0';root.hidden=false;}
  }
})();
