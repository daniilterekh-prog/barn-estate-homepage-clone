/* Separate white map presentation; values are shared with the dark hero/listing filter. */
(() => {
  let state={}, modal, opener, overflow, inert=[];
  const rangeNames=['priceMin','priceMax','areaMin','areaMax'];
  const q=s=>modal.querySelector(s), all=s=>[...modal.querySelectorAll(s)];
  document.addEventListener('country-filter-apply',event=>state={...event.detail});
  function restore(values) {
    rangeNames.forEach(name=>q(`[name="${name}"]`).value=values[name]??'');
    ['types','bands','districts'].forEach(name=>all(`[name="${name}"]`).forEach(input=>input.checked=(values[name]||[]).includes(input.value)));
  }
  function close() {
    if(!modal)return;
    modal.remove();modal=null;
    inert.forEach(([element,value])=>element.inert=value);inert=[];
    document.body.style.overflow=overflow;
    opener?.setAttribute('aria-expanded','false');
    opener?.classList.remove('catalog-projects-map__panel-filter--active');
    if(opener?.getClientRects().length)opener.focus({preventScroll:true});
    else document.querySelector('.catalog-projects-map__fullscreen')?.focus({preventScroll:true});
  }
  function open(trigger) {
    if(modal||!window.countryMapFilterTemplate)return;
    const holder=document.createElement('div');holder.innerHTML=window.countryMapFilterTemplate;
    modal=holder.firstElementChild;modal.classList.add('country-map-filter-drawer');
    opener=trigger;overflow=document.body.style.overflow;
    const parent=document.fullscreenElement||document.querySelector('.country-map-expanded')||document.body;
    parent.append(modal);
    for(let node=modal;node!==document.body;node=node.parentElement) {
      [...node.parentElement.children].filter(e=>e!==node&&!['SCRIPT','STYLE','LINK'].includes(e.tagName)).forEach(e=>{inert.push([e,e.inert]);e.inert=true;});
    }
    const dialog=q('.hero-filter-modal__dialog');dialog.tabIndex=-1;
    all('.hero-filter-panel-content__range-input').forEach((input,index)=>{
      input.name=rangeNames[index];input.setAttribute('aria-label',input.closest('.hero-filter-panel-content__group').querySelector('p').textContent.trim()+': '+input.placeholder);
      input.addEventListener('input',()=>input.setCustomValidity(''));
    });
    const groups=all('.hero-filter-panel-content__checkboxes');
    ['types','bands','districts'].forEach((name,index)=>groups[index].querySelectorAll('input').forEach(input=>input.name=name));
    restore(state);
    document.body.style.overflow='hidden';
    opener.setAttribute('aria-expanded','true');opener.classList.add('catalog-projects-map__panel-filter--active');
    all('.hero-filter-modal__close,.hero-filter-modal__backdrop').forEach(button=>button.addEventListener('click',close));
    q('.hero-filter-modal__reset').addEventListener('click',()=>restore({}));
    q('.hero-filter-modal__apply').addEventListener('click',()=>{
      const values={...state};
      rangeNames.forEach(name=>{const value=q(`[name="${name}"]`).value.trim();values[name]=value===''?null:Number(value.replace(/[^\d.,]/g,'').replace(',','.'));});
      for(const [min,max] of [['priceMin','priceMax'],['areaMin','areaMax']]) {
        const input=q(`[name="${max}"]`);input.setCustomValidity(values[min]!=null&&values[max]!=null&&values[min]>values[max]?'Максимум должен быть не меньше минимума':'');
        if(!input.reportValidity())return;
      }
      ['types','bands','districts'].forEach(name=>values[name]=all(`[name="${name}"]:checked`).map(input=>input.value));
      document.dispatchEvent(new CustomEvent('country-filter-set',{detail:values}));close();
    });
    modal.addEventListener('keydown',event=>{
      if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close();return;}
      if(event.key!=='Tab')return;
      const elements=all('button,input,a[href]').filter(e=>!e.disabled&&e!==q('.hero-filter-modal__backdrop'));
      const first=elements[0],last=elements.at(-1);
      if(event.shiftKey&&(document.activeElement===first||document.activeElement===dialog)){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&(document.activeElement===last||document.activeElement===dialog)){event.preventDefault();first.focus();}
    });
    dialog.focus({preventScroll:true});
  }
  document.addEventListener('country-map-filter-open',event=>open(event.detail.trigger));
  document.addEventListener('fullscreenchange',()=>{if(modal&&!document.fullscreenElement&&!document.querySelector('.country-map-fallback'))close();});
})();
