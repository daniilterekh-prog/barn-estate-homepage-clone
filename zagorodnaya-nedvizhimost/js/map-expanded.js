/* Original front fullscreen shell. The existing raster map remains static. */
(() => {
  const map = document.querySelector('.catalog-projects-map');
  if (!map || !window.countryMapPanelTemplate) return;
  const trigger = map.querySelector('.catalog-projects-map__fullscreen');
  const holder = document.createElement('div');
  holder.innerHTML = window.countryMapPanelTemplate;
  map.append(...holder.children);
  const panel = map.querySelector('.catalog-projects-map__panel');
  const exit = map.querySelector('.catalog-projects-map__exit');
  const handle = panel.querySelector('.catalog-projects-map__panel-handle');
  const search = panel.querySelector('input');
  const filter = panel.querySelector('.catalog-projects-map__panel-filter');
  const quick = [...panel.querySelectorAll('.catalog-quick-filters__button')];
  let dropdown, dropdownTrigger, quickState = {};
  const filterRoot=panel.querySelector('.catalog-projects-map__panel-filters');
  function closeDropdown(focus=false) {
    dropdown?.remove(); dropdown=null;
    dropdownTrigger?.classList.remove('is-open');dropdownTrigger?.setAttribute('aria-expanded','false');
    if(focus)dropdownTrigger?.focus();
  }
  function quickOptions(index) {
    if(index===3)return [['0:300','до 300 м²'],['300:600','300–600 м²'],['600:','от 600 м²']];
    const name=['types','bands','districts'][index];
    return [...document.querySelectorAll(`#catalog-hero-filters-panel [name="${name}"]`)].map(input=>[input.value,input.closest('label').textContent.trim()]);
  }
  function quickValue(index) {
    const name=['types','bands','districts','area'][index];
    return quickState[name]||[];
  }
  function openDropdown(button,index) {
    if(dropdown && dropdownTrigger===button){closeDropdown();return;}
    closeDropdown();expand(true);dropdownTrigger=button;
    dropdown=document.createElement('div');dropdown.id='country-map-quick-dropdown';
    dropdown.className='catalog-quick-filters__dropdown catalog-quick-filters__dropdown--inline';
    dropdown.setAttribute('role','listbox');dropdown.setAttribute('aria-label',button.querySelector('.catalog-quick-filters__label').textContent);
    dropdown.style.cssText='position:absolute;top:calc(100% + 6px);left:0;width:min(270px,100%);z-index:8';
    const header=document.createElement('div');header.className='catalog-quick-filters__dropdown-header';
    const title=document.createElement('span');title.textContent=dropdown.getAttribute('aria-label');
    const closeButton=document.createElement('button');closeButton.type='button';closeButton.className='catalog-quick-filters__dropdown-close';closeButton.textContent=' × ';closeButton.setAttribute('aria-label','Закрыть');closeButton.addEventListener('click',()=>closeDropdown(true));header.append(title,closeButton);
    const options=document.createElement('div');options.className='catalog-quick-filters__options';
    quickOptions(index).forEach(([value,label])=>{
      const option=document.createElement('button');option.type='button';option.className='catalog-quick-filters__option';option.setAttribute('role','option');option.textContent=label;
      const selected=quickValue(index).includes(value);option.classList.toggle('is-selected',selected);option.setAttribute('aria-selected',String(selected));
      option.addEventListener('click',()=>{
        const key=['types','bands','districts','area'][index];
        const current=quickValue(index);
        quickState[key]=current.includes(value)?current.filter(v=>v!==value):index===3?[value]:[...current,value];
        let patch={[key]:quickState[key]};
        if(index===3){const [min,max]=(quickState.area[0]||':').split(':');patch={areaMin:min?+min:null,areaMax:max?+max:null};}
        document.dispatchEvent(new CustomEvent('country-filter-set',{detail:patch}));
        options.querySelectorAll('button').forEach((e,i)=>{const active=quickValue(index).includes(quickOptions(index)[i][0]);e.classList.toggle('is-selected',active);e.setAttribute('aria-selected',String(active));});
      });options.append(option);
    });
    dropdown.append(header,options);filterRoot.append(dropdown);button.classList.add('is-open');button.setAttribute('aria-expanded','true');button.setAttribute('aria-controls',dropdown.id);
    dropdown.addEventListener('keydown',event=>{if(['ArrowUp','ArrowDown','Home','End'].includes(event.key)){event.preventDefault();const opts=[...options.children];const i=opts.indexOf(document.activeElement);opts[event.key==='Home'?0:event.key==='End'?opts.length-1:(i+(event.key==='ArrowDown'?1:-1)+opts.length)%opts.length].focus();}});
  }
  document.addEventListener('country-filter-apply',event=>{
    quickState={...event.detail};
    const s=event.detail;
    quickState.area=s.areaMin!=null||s.areaMax!=null?[`${s.areaMin??''}:${s.areaMax??''}`]:[];
    quick.forEach((button,index)=>{
      const labels=quickOptions(index).filter(([v])=>quickValue(index).includes(v)).map(([,label])=>label);
      if(index===1&&!labels.length&&(s.priceMin!=null||s.priceMax!=null))labels.push(`${s.priceMin??0} – ${s.priceMax??'∞'} ₽`);
      if(index===3&&!labels.length&&quickState.area.length)labels.push(`${s.areaMin??0} – ${s.areaMax??'∞'} м²`);
      button.querySelector('.catalog-quick-filters__value').textContent=labels.join(', ')||'Не выбрано';button.classList.toggle('is-active',!!labels.length);
    });
  });
  document.addEventListener('pointerdown',event=>{if(dropdown&&!dropdown.contains(event.target)&&!quick.some(button=>button.contains(event.target)))closeDropdown();});
  map.setAttribute('data-v-25437794','');
  map.querySelectorAll('[class*="catalog-projects-map__"]').forEach(e=>e.setAttribute('data-v-25437794',''));
  panel.hidden = exit.hidden = true;
  let oldOverflow = '', active = false, pointerStart, suppressClick = false, background = [];
  search.setAttribute('aria-label','Поиск объектов на карте');
  const expand = value => {
    panel.classList.toggle('catalog-projects-map__panel--expanded',value);
    handle.setAttribute('aria-expanded',String(value));
    handle.setAttribute('aria-label',value?'Свернуть список объектов':'Развернуть список объектов');
  };
  function sync(value) {
    if (active === value) return;
    active = value;
    map.classList.toggle('country-map-expanded',value);
    panel.hidden = exit.hidden = !value;
    trigger.setAttribute('aria-expanded',String(value));
    if (value) {
      for(let node=map;node!==document.body;node=node.parentElement) {
        [...node.parentElement.children].filter(e=>e!==node && e.id!=='catalog-hero-filters-panel' && !['SCRIPT','STYLE','LINK'].includes(e.tagName)).forEach(e=>{
          background.push([e,e.inert]);e.inert=true;
        });
      }
      map.setAttribute('role','dialog');map.setAttribute('aria-modal','true');map.setAttribute('aria-label','Объекты на карте');
      oldOverflow = document.body.style.overflow;
      document.body.style.overflow='hidden';
      expand(false);
      exit.focus({preventScroll:true});
    } else {
      closeDropdown();
      background.forEach(([e,inert])=>e.inert=inert);background=[];
      map.removeAttribute('role');map.removeAttribute('aria-modal');map.removeAttribute('aria-label');
      document.body.style.overflow=oldOverflow;
      map.classList.remove('country-map-fallback');
      trigger.focus({preventScroll:true});
    }
    window.dispatchEvent(new Event('resize'));
  }
  async function close() {
    if (document.fullscreenElement === map) await document.exitFullscreen();
    else sync(false);
  }
  window.countryMapEnter = async () => {
    if (active) { await close(); return; }
    try {
      if (!map.requestFullscreen) throw Error('Fullscreen unavailable');
      await map.requestFullscreen();
    } catch {
      map.classList.add('country-map-fallback'); sync(true);
    }
  };
  document.addEventListener('fullscreenchange',()=>sync(document.fullscreenElement===map));
  exit.addEventListener('click',close);
  handle.addEventListener('click',()=>{if(suppressClick){suppressClick=false;return;}expand(handle.getAttribute('aria-expanded')!=='true');});
  handle.addEventListener('pointerdown',event=>{ pointerStart=event.clientY;handle.setPointerCapture(event.pointerId); });
  handle.addEventListener('pointerup',event=>{
    if (pointerStart!=null && Math.abs(event.clientY-pointerStart)>24) { expand(event.clientY<pointerStart);suppressClick=true;setTimeout(()=>suppressClick=false,0); }
    pointerStart=null;
  });
  search.addEventListener('focus',()=>{if(innerWidth<=540)expand(true);});
  function openFilters(button) {
    closeDropdown();
    expand(true);
    document.dispatchEvent(new CustomEvent('country-map-filter-open',{detail:{trigger:button}}));
  }
  [filter,...quick].forEach(button=>{
    button.setAttribute('aria-controls',button===filter?'country-map-filters-panel':'country-map-quick-dropdown');
    button.setAttribute('aria-haspopup',button===filter?'dialog':'listbox');
    button.addEventListener('click',()=>button===filter?openFilters(button):openDropdown(button,quick.indexOf(button)));
  });
  map.addEventListener('keydown',event=>{
    if(!active || document.querySelector('.hero-filter-modal:not([hidden])'))return;
    if(event.key==='Escape'&&dropdown){event.preventDefault();event.stopPropagation();closeDropdown(true);return;}
    if(event.key==='Escape'){ event.preventDefault();close(); }
    if(event.key==='Tab') {
      const elements=[...map.querySelectorAll('button,input,a[href]')].filter(e=>e.getClientRects().length);
      const first=elements[0],last=elements.at(-1);
      if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
    }
  });
})();
