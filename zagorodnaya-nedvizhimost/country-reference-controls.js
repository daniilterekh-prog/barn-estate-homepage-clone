/* Country data adapter for the approved Kurortnaya quick-filter controls. */
(() => {
  'use strict';
  const listing=window.countryListing;
  if(!listing)return;
  const $=(s,r=document)=>r.querySelector(s), all=(s,r=document)=>[...r.querySelectorAll(s)];
  const source=$('#catalog-hero-filters-panel');
  const checkboxOptions=name=>all(`[name="${name}"]`,source).map(input=>[input.value,input.closest('label').textContent.trim()]);
  const priceOptions=checkboxOptions('bands');
  const typeOptions=checkboxOptions('types');
  const bedroomOptions=[['1','От 1 спальни'],['2','От 2 спален'],['3','От 3 спален'],['4','От 4 спален']];
  const state={types:[],bands:[],brandFlags:[]};
  const selections={location:'',bedrooms:''};
  const popup=document.createElement('div');
  popup.className='catalog-quick-filters__dropdown country-reference-dropdown';
  popup.id='country-reference-dropdown';popup.role='dialog';popup.hidden=true;
  popup.innerHTML='<div class="catalog-quick-filters__dropdown-header"><span></span><button type="button" class="catalog-quick-filters__dropdown-close" aria-label="Закрыть">×</button></div><div class="catalog-quick-filters__options" role="listbox"></div>';
  document.body.append(popup);
  const list=$('.catalog-quick-filters__options',popup);
  let active, config, lastParent=document.body;
  const choice=(key,button)=>{
    if(key==='sort')return {title:'Сортировка',values:all('option',button.nextElementSibling).map(option=>[option.value,option.textContent.trim()]),selected:()=>button.nextElementSibling.value};
    if(key==='location')return {title:'Шоссе',values:listing.getLocations().map(value=>[value,value]),selected:()=>listing.getSelection().location};
    if(key==='type')return {title:button.closest('.catalog-projects-map__panel')?'Тип объекта':'Тип',values:typeOptions,selected:()=>state.types[0]||''};
    if(key==='price')return {title:'Стоимость',values:priceOptions,selected:()=>state.bands[0]||''};
    if(key==='bedrooms')return {title:'Спальни',values:bedroomOptions,selected:()=>listing.getSelection().bedrooms};
    return null;
  };
  function sync(){
    all('[data-country-quick]').forEach(button=>{
      const key=button.dataset.countryQuick, c=choice(key,button), selected=c?.selected()||'';
      const label=c?.values.find(([value])=>value===selected)?.[1]||c?.title||'';
      const caption=$('.catalog-quick-filters__caption,.catalog-quick-filters__value',button);
      if(caption&&caption.textContent!==(selected?label:c.title))caption.textContent=selected?label:c.title;
      button.classList.toggle('is-active',!!selected);
      button.setAttribute('aria-label',`${c.title}: ${selected?label:'Любые'}`);
      button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-controls',popup.id);
    });
    all('.country-brand-filters input').forEach(input=>input.checked=state.brandFlags.includes(input.value));
    all('[data-country-market]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.countryMarket===listing.getMarket())));
  }
  function close(focus=false){
    if(!active)return;
    const button=active;active=null;popup.hidden=true;popup.style.display='none';
    button.classList.remove('is-open');button.setAttribute('aria-expanded','false');
    if(focus&&button.isConnected)button.focus({preventScroll:true});
  }
  function position(){
    if(!active)return;
    const rect=active.getBoundingClientRect(),width=Math.min(Math.max(rect.width,220),innerWidth-32);
    popup.style.width=`${width}px`;popup.style.left=`${Math.max(16,Math.min(rect.left,innerWidth-width-16))}px`;
    list.style.maxHeight='240px';
    const height=popup.getBoundingClientRect().height,below=innerHeight-rect.bottom-16;
    popup.style.top=`${Math.max(16,Math.min(height>below&&rect.top-16>below?rect.top-6-height:rect.bottom+6,innerHeight-height-16))}px`;
  }
  function select(value){
    if(!active)return;
    const key=active.dataset.countryQuick||active.dataset.countrySelect;
    if(key==='sort'){
      const select=active.nextElementSibling;select.value=value;select.dispatchEvent(new Event('change',{bubbles:true}));active.textContent=select.selectedOptions[0].textContent;active.setAttribute('aria-label',`Сортировка: ${active.textContent}`);
    }else if(key==='type')document.dispatchEvent(new CustomEvent('country-filter-set',{detail:{types:value?[value]:[]}}));
    else if(key==='price')document.dispatchEvent(new CustomEvent('country-filter-set',{detail:{bands:value?[value]:[],priceMin:null,priceMax:null}}));
    else listing.setSelection(key,value);
    sync();close(true);
  }
  function open(button){
    if(active===button){close(true);return;}
    close();active=button;config=choice(button.dataset.countryQuick||button.dataset.countrySelect,button);if(!config){active=null;return;}
    const parent=document.fullscreenElement||document.body;
    if(parent!==lastParent){parent.append(popup);lastParent=parent;}
    popup.inert=false;
    button.classList.add('is-open');button.setAttribute('aria-expanded','true');
    $('.catalog-quick-filters__dropdown-header > span',popup).textContent=config.title;
    popup.setAttribute('aria-label',config.title);list.setAttribute('aria-label',config.title);list.replaceChildren();
    const options=button.dataset.countrySelect==='sort'?config.values:[['',keyReset(button.dataset.countryQuick)] ,...config.values];
    options.forEach(([value,label])=>{
      const option=document.createElement('button');option.type='button';option.role='option';option.className='catalog-quick-filters__option';option.textContent=label;
      const selected=config.selected()===value;option.classList.toggle('is-selected',selected);option.setAttribute('aria-selected',String(selected));
      option.addEventListener('click',()=>select(value));list.append(option);
    });
    popup.hidden=false;popup.style.display='block';position();
    (list.querySelector('[aria-selected=true]')||list.firstElementChild)?.focus({preventScroll:true});
  }
  const keyReset=key=>({location:'Все шоссе',type:'Любой тип',price:'Любая стоимость',bedrooms:'Любые спальни'}[key]||'Любые');
  function makeBrands(context){
    const fieldset=document.createElement('fieldset');fieldset.className='country-brand-filters';fieldset.dataset.brandContext=context;
    const legend=document.createElement('legend');legend.textContent='Подборки BARNES';fieldset.append(legend);
    for(const [value,label] of [['selection','Выбор BARNES'],['exclusive','Эксклюзив BARNES']]){
      const wrap=document.createElement('label'),input=document.createElement('input'),box=document.createElement('span');
      input.type='checkbox';input.value=value;input.name='brandFlags';box.className='country-brand-filters__box';box.setAttribute('aria-hidden','true');
      input.addEventListener('change',()=>{state.brandFlags=input.checked?[...new Set([...state.brandFlags,value])]:state.brandFlags.filter(flag=>flag!==value);sync();});
      wrap.append(input,box,document.createTextNode(label));fieldset.append(wrap);
    }
    return fieldset;
  }
  function resetMapFilters(){
    close();
    const search=$('.catalog-projects-map__panel-search-input');if(search)search.value='';
    document.dispatchEvent(new CustomEvent('country-filter-set',{detail:{types:[],bands:[],districts:[],priceMin:null,priceMax:null,areaMin:null,areaMax:null,roomsMin:null,roomsMax:null}}));
    listing.setSelection('location','');listing.setSelection('bedrooms','');
    const sort=listing.getSort();sort.value=sort.options[0].value;sort.dispatchEvent(new Event('change',{bubbles:true}));
    state.brandFlags=[];sync();
  }
  function mount(){
    const toolbar=$('.catalog-mode-toolbar');
    if(toolbar&&!$('.country-brand-filters[data-brand-context="listing"]'))toolbar.append(makeBrands('listing'));
    const panel=$('.catalog-projects-map__panel');
    if(panel&&!$('.country-map-reference',panel)){
      const filterRoot=$('.catalog-projects-map__panel-filters',panel);
      const iconPaths={
        location:'<path d="M12 21s6-5.4 6-11a6 6 0 1 0-12 0c0 5.6 6 11 6 11Z"/><circle cx="12" cy="10" r="2.25"/>',
        type:'<path d="M4 21V5h10v16M14 10h6v11M2 21h20M8 9h2M8 13h2M8 17h2M17 14h1M17 17h1"/>',
        price:'<circle cx="12" cy="12" r="9"/><path d="M9 16V7.5h3.4a2.75 2.75 0 1 1 0 5.5H9m0 0h5.6m-5.6 2h4.6"/>',
        bedrooms:'<path d="M3 18v-7.5M21 18v-5.5a2 2 0 0 0-2-2h-7.5A2.5 2.5 0 0 0 9 13v2M3 15h18M5.5 10.5h2A1.5 1.5 0 0 1 9 12v3H4v-3a1.5 1.5 0 0 1 1.5-1.5Z"/>'
      };
      all('.catalog-quick-filters__button',panel).forEach((button,index)=>{
        const key=['type','price','location','bedrooms'][index];button.dataset.countryQuick=key;
        const label=$('.catalog-quick-filters__label',button);if(label)label.textContent=({location:'Шоссе',type:'Тип объекта',price:'Стоимость',bedrooms:'Спальни'})[key];
        button.insertAdjacentHTML('afterbegin',`<span class="country-map-filter-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round">${iconPaths[key]}</svg></span>`);
      });
      const heading=$('.catalog-projects-map__panel-title',panel);if(heading)heading.textContent='Найдено объектов: 0';
      const search=$('.catalog-projects-map__panel-search-input',panel);if(search)search.placeholder='Поиск объектов';
      const filterIcon=$('.catalog-projects-map__panel-filter-icon',panel);
      if(filterIcon)filterIcon.innerHTML='<path d="M4 6h3m4 0h9M4 12h8m4 0h4M4 18h4m4 0h8" stroke="currentColor" stroke-width="1.15" stroke-linecap="round"/><circle cx="9" cy="6" r="2" stroke="currentColor" stroke-width="1.15"/><circle cx="14" cy="12" r="2" stroke="currentColor" stroke-width="1.15"/><circle cx="10" cy="18" r="2" stroke="currentColor" stroke-width="1.15"/>';
      const controls=document.createElement('div');controls.className='country-map-reference';
      const market=document.createElement('div');market.className='country-map-market';market.setAttribute('role','group');market.setAttribute('aria-label','Рынок недвижимости');
      for(const [value,label] of [['project','Новостройки'],['lot','Вторичка']]){const button=document.createElement('button');button.type='button';button.dataset.countryMarket=value;button.textContent=label;button.addEventListener('click',()=>{listing.setMarket(value);sync();});market.append(button);}
      filterRoot.before(market);
      const sorting=document.createElement('div');sorting.className='country-map-sort';sorting.setAttribute('aria-label','Сортировка');
      const source=listing.getSort(),select=source.cloneNode(true);select.removeAttribute('id');
      select.addEventListener('change',()=>{if(source.value===select.value)return;source.value=select.value;source.dispatchEvent(new Event('change',{bubbles:true}));});
      source.addEventListener('change',()=>{if(select.value===source.value)return;select.value=source.value;select.dispatchEvent(new Event('change',{bubbles:true}));});
      const reset=document.createElement('button');reset.type='button';reset.className='country-map-reset';reset.textContent='Сбросить фильтры';reset.addEventListener('click',resetMapFilters);
      sorting.append(select);controls.append(sorting,makeBrands('map'),reset);
      filterRoot.after(controls);
    }
    all('.catalog-mode-toolbar .catalog-grid__sort select,.country-map-sort select').forEach(select=>{
      if(select.dataset.countryEnhanced)return;select.dataset.countryEnhanced='true';
      const button=document.createElement('button');button.type='button';button.className=select.className+' country-sort-trigger';button.dataset.countrySelect='sort';
      button.textContent=select.selectedOptions[0].textContent;button.setAttribute('aria-label',`Сортировка: ${button.textContent}`);button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-controls',popup.id);
      select.before(button);select.hidden=true;select.setAttribute('aria-hidden','true');select.tabIndex=-1;
      select.addEventListener('change',()=>{button.textContent=select.selectedOptions[0].textContent;button.setAttribute('aria-label',`Сортировка: ${button.textContent}`);});
    });
    sync();
  }
  const observer=new MutationObserver(()=>mount());observer.observe(document.body,{childList:true,subtree:true});mount();
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-country-quick],[data-country-select]');
    if(button){event.preventDefault();event.stopPropagation();open(button);}else if(!popup.contains(event.target))close();
  },true);
  $('.catalog-quick-filters__dropdown-close',popup).addEventListener('click',()=>close(true));
  popup.addEventListener('keydown',event=>{
    const options=all('[role="option"]',list),index=options.indexOf(document.activeElement);
    if(event.key==='Escape'||event.key==='Tab'){event.preventDefault();event.stopPropagation();close(true);return;}
    if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){event.preventDefault();options[event.key==='Home'?0:event.key==='End'?options.length-1:(index+(event.key==='ArrowDown'?1:-1)+options.length)%options.length]?.focus();}
    if(['Enter',' '].includes(event.key)&&document.activeElement?.role==='option'){event.preventDefault();document.activeElement.click();}
  });
  document.addEventListener('country-filter-apply',event=>{Object.assign(state,event.detail);sync();});
  document.addEventListener('country-market-change',sync);
  document.addEventListener('country-map-filter-open',()=>close());
  document.addEventListener('country-filter-open',()=>close());
  document.addEventListener('country-quick-change',event=>{selections[event.detail.key]=event.detail.value;sync();});
  document.addEventListener('scroll',()=>{if(active){const rect=active.getBoundingClientRect();if(rect.bottom<0||rect.top>innerHeight)close();else position();}},true);
  addEventListener('resize',()=>close());
})();
