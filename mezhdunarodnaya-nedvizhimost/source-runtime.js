/* Local behaviour for the original public BARNES components. */
(() => {
  'use strict';
  const one = (s, root=document) => root.querySelector(s);
  const all = (s, root=document) => [...root.querySelectorAll(s)];
  let dialog = null, returnFocus = null, filterState = [];
  const header = one('.site-header'), menuButton = one('.site-header__icon-btn');
  function closeDialog() {
    dialog?.remove(); dialog=null;
    if(one('.map-browser:not([hidden])'))document.body.style.overflow='hidden';else document.body.style.removeProperty('overflow');
    header?.classList.remove('site-header--menu-open');
    menuButton?.setAttribute('aria-expanded','false');
    all('[data-international-filter]').forEach(button=>button.setAttribute('aria-expanded','false'));
    returnFocus?.focus({preventScroll:true});
  }
  function openDialog(kind, trigger) {
    if(kind==='callback'&&window.BARNES_OPEN_CONTACT){window.BARNES_OPEN_CONTACT(trigger);return;}
    closeDialog(); returnFocus=trigger || document.activeElement;
    const template=one('#source-'+kind); if(!template)return;
    dialog=template.content.firstElementChild.cloneNode(true);
    if(kind==='callback'&&trigger?.matches('.floating-expert__card,.catalog-contact__card-submit'))one('.feedback-modal__title',dialog).textContent='Обратная связь';
    document.body.append(dialog); document.body.style.overflow='hidden';
    all('.modal__close,.vfm__overlay,.hero-filter-modal__close,.hero-filter-modal__backdrop',dialog).forEach(e=>e.addEventListener('click',closeDialog));
    if(kind==='menu'){header?.classList.add('site-header--menu-open');menuButton?.setAttribute('aria-expanded','true');}
    if(kind==='filters'){
      trigger?.setAttribute('aria-expanded','true');
      all('input',dialog).forEach((input,i)=>{const saved=filterState[i];if(saved){input.value=saved.value;input.checked=saved.checked;}input.closest('.ui-checkbox')?.classList.toggle('ui-checkbox--checked',input.checked);input.closest('.ui-switch')?.classList.toggle('ui-switch--checked',input.checked);});
    }
    bindForms(dialog); bindFilters(dialog);
    all('.hero-filter-panel-content__range-input',dialog).forEach(input=>input.setAttribute('aria-label',input.closest('.hero-filter-panel-content__group')?.querySelector('.hero-filter-panel-content__title')?.textContent.trim()+' — '+input.placeholder));
    one('input:not([tabindex="-1"]),button',dialog)?.focus({preventScroll:true});
  }
  window.BARNES_OPEN_FILTER=trigger=>openDialog('filters',trigger);
  const mapSearch=one('.catalog-projects-map__search');
  if(mapSearch){
    const mapFilter=one('.catalog-hero-filters__filter-icon')?.cloneNode(true);
    if(mapFilter){mapFilter.className='international-map-filter';mapFilter.setAttribute('aria-label','Открыть фильтры на карте');mapSearch.append(mapFilter);mapFilter.addEventListener('click',event=>{event.preventDefault();openDialog('filters',mapFilter);});}
  }
  all('.catalog-hero-filters__filter-icon,.catalog-mode-detailed-filters,.catalog-quick-filters__button,.international-map-filter').forEach(button=>{
    button.dataset.internationalFilter='';button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-controls','catalog-hero-filters-panel');button.setAttribute('aria-expanded','false');
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'){if(dialog)event.preventDefault();closeDialog();one('.catalog-projects-map')?.classList.remove('source-map-expanded');}
    if(event.key!=='Tab'||!dialog)return;
    const items=all('button,a[href],input,select,textarea,[tabindex="0"]',dialog).filter(e=>!e.disabled&&e.getClientRects().length);
    if(!items.length)return;
    if(event.shiftKey&&document.activeElement===items[0]){event.preventDefault();items.at(-1).focus();}
    else if(!event.shiftKey&&document.activeElement===items.at(-1)){event.preventDefault();items[0].focus();}
  });
  menuButton?.addEventListener('click',()=>dialog?.classList.contains('site-menu')?closeDialog():openDialog('menu',menuButton));
  one('.catalog-hero-filters__filter-icon')?.addEventListener('click',e=>openDialog('filters',e.currentTarget));
  all('.apartment-card__call-btn,.site-footer__callback-btn,.catalog-contact__card-submit,.floating-expert__card').forEach(e=>e.addEventListener('click',()=>openDialog('callback',e)));
  one('.floating-expert__close')?.addEventListener('click',()=>one('.floating-expert')?.remove());
  const scrollToSection=s=>one(s)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
  all('.catalog-page-nav__link').forEach((button,i)=>button.addEventListener('click',()=>scrollToSection(['.catalog-best-offers','.catalog-map','.catalog-consultation','.departments-section','.news-section'][i])));
  one('.catalog-page-nav__request')?.addEventListener('click',()=>scrollToSection('.catalog-consultation'));
  function onScroll(){if(document.body.classList.contains('international-node-design'))return;header?.classList.toggle('site-header--scrolled',scrollY>24);one('.catalog-page-nav')?.classList.toggle('catalog-page-nav--visible',scrollY>=(one('.catalog-hero')?.offsetHeight||644)-110);}
  addEventListener('scroll',onScroll,{passive:true}); onScroll();
  all('.catalog-faq__question').forEach((button,i)=>{
    const item=button.closest('.catalog-faq__item'),answer=one('.catalog-faq__answer',item);
    if(!answer)return;answer.id='international-answer-'+i;button.setAttribute('aria-controls',answer.id);
    button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));item.classList.toggle('catalog-faq__item--open',open);answer.classList.toggle('catalog-faq__answer--open',open);});
  });
  one('.catalog-intro__toggle')?.addEventListener('click',e=>{
    const details=one('#catalog-intro-details');if(!details)return;
    const open=e.currentTarget.getAttribute('aria-expanded')!=='true';e.currentTarget.setAttribute('aria-expanded',String(open));details.setAttribute('aria-hidden',String(!open));details.style.maxHeight=open?details.scrollHeight+'px':'0px';
    one('.ui-more-link__label',e.currentTarget).textContent=open?'свернуть':'читать далее';
  });
  all('[role="tablist"]').forEach(list=>all('[role="tab"]',list).forEach(button=>button.addEventListener('click',()=>{
    all('[role="tab"]',list).forEach(tab=>{const active=tab===button;tab.setAttribute('aria-selected',String(active));for(const prefix of ['catalog-consultation','catalog-contact'])tab.classList.toggle(prefix+'__method--active',active&&tab.classList.contains(prefix+'__method'));});
    const form=button.closest('.catalog-consultation__content,.catalog-contact__content')?.querySelector('form');
    if(form){const input=one('input[autocomplete="tel"],input[type="tel"],input[inputmode="tel"]',form);if(input){const label=button.textContent.trim();input.placeholder=label==='Email'?'Ваш Email:':'Ваш номер телефона:';input.setAttribute('aria-label',input.placeholder);input.dataset.method=label;}}
  })));
  const list=one('.catalog-grid__list'),items=all('.catalog-grid__item'),cards=items.map(e=>one('.apartment-card',e));
  const number=s=>Number(s.replace(/[^\d,.]/g,'').replace(',','.'));
  const price=e=>number(one('.apartment-card__price',e)?.textContent||'0');
  const area=e=>number(one('.apartment-card__stat-value',e)?.textContent||'0');
  one('.catalog-grid__sort-select')?.addEventListener('change',e=>{const order=e.target.value,read=order.startsWith('price')?price:area;const sorted=order==='relevance'?[...items]:[...items].sort((a,b)=>(read(a)-read(b))*(order.endsWith('desc')?-1:1));sorted.forEach(item=>list.append(item));});
  all('.apartment-card__favorite').forEach(button=>button.addEventListener('click',()=>{const active=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',String(active));button.setAttribute('aria-label',active?'Удалить из избранного':'Добавить в избранное');button.classList.toggle('apartment-card__favorite--active',active);}));
  function applySearch(){const query=one('.catalog-hero-filters__search-input')?.value.trim().toLowerCase()||'';items.forEach(item=>item.hidden=(list?.dataset.activeMode&&item.dataset.listingMode!==list.dataset.activeMode)||(!!query&&!item.textContent.toLowerCase().includes(query)));scrollToSection('.catalog-grid');}
  one('.catalog-hero-filters__bar')?.addEventListener('submit',e=>{e.preventDefault();applySearch();});
  one('.catalog-hero-filters__submit')?.addEventListener('click',applySearch);
  one('.catalog-grid__more')?.addEventListener('click',()=>items.forEach(item=>item.classList.add('source-revealed')));
  function bindFilters(root){
    all('input[type="checkbox"]',root).forEach(input=>input.addEventListener('change',()=>{input.closest('.ui-checkbox')?.classList.toggle('ui-checkbox--checked',input.checked);input.closest('.ui-switch')?.classList.toggle('ui-switch--checked',input.checked);}));
    all('.hero-filter-panel__reset,.hero-filter-modal__reset',root).forEach(button=>button.addEventListener('click',()=>{filterState=[];all('input',root).forEach(input=>{if(input.type!=='checkbox')input.value='';input.checked=false;input.closest('.ui-checkbox')?.classList.remove('ui-checkbox--checked');input.closest('.ui-switch')?.classList.remove('ui-switch--checked');});}));
    all('.hero-filter-modal__apply',root).forEach(button=>button.addEventListener('click',()=>{
      filterState=all('input',root).map(input=>({value:input.value,checked:input.checked}));
      const selected=all('input[type="checkbox"]:checked',root).map(e=>e.closest('label')?.textContent.trim().toLowerCase()).filter(Boolean);
      const ranges=all('.hero-filter-panel-content__range-input',root).map(e=>number(e.value)||0);
      items.forEach(item=>{const text=item.textContent.toLowerCase();item.hidden=(list?.dataset.activeMode&&item.dataset.listingMode!==list.dataset.activeMode)||(selected.length>0&&!selected.some(label=>text.includes(label)))||(ranges[0]>0&&price(item)<ranges[0])||(ranges[1]>0&&price(item)>ranges[1]);});
      closeDialog();window.dispatchEvent(new Event('international-filters-applied'));if(!one('.map-browser:not([hidden])'))scrollToSection('.catalog-grid');
    }));
  }
  function bindForms(root){all('form:not(.catalog-hero-filters__bar)',root).forEach(form=>{
    if(form.closest('.catalog-feedback-modal'))return;
    all('input:not([tabindex="-1"]),textarea',form).forEach(input=>{if(!input.getAttribute('aria-label'))input.setAttribute('aria-label',input.type==='checkbox'?'Согласие на обработку персональных данных':input.placeholder||'Комментарий');});
    form.addEventListener('submit',e=>{
      e.preventDefault();const name=one('input[autocomplete="name"]',form),phone=one('input[autocomplete="tel"],input[type="tel"],input[inputmode="tel"]',form),consent=one('input[type="checkbox"]',form);
      if(name)name.required=true;if(phone){phone.required=true;phone.setCustomValidity(phone.dataset.method==='Email'?(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(phone.value)?'':'Введите Email'):(phone.value.replace(/\D/g,'').length<10?'Введите номер телефона':''));}if(consent)consent.required=true;
      if(!form.reportValidity())return;
      let status=one('.source-form-status',form);if(!status){status=document.createElement('p');status.className='source-form-status';status.setAttribute('role','status');form.append(status);}status.textContent='Для отправки заявки свяжитесь с BARNES: +7 (495) 182-50-79.';
    });
  });}
  bindForms(document);
  function pagination(root,slides,getIndex,setIndex){
    const ul=document.createElement('ul');ul.className='splide__pagination splide__pagination--ltr';ul.setAttribute('role','tablist');ul.setAttribute('aria-label','Выберите слайд');
    slides.forEach((slide,i)=>{const li=document.createElement('li');li.setAttribute('role','presentation');const b=document.createElement('button');b.type='button';b.className='splide__pagination__page';b.setAttribute('role','tab');b.setAttribute('aria-label','Перейти к слайду '+(i+1));b.setAttribute('aria-controls',slide.id);b.addEventListener('click',()=>setIndex(i));li.append(b);ul.append(li);});
    one('.splide',root).append(ul);
    return ()=>{ul.hidden=innerWidth>540;all('button',ul).forEach((b,i)=>{const active=i===getIndex();b.classList.toggle('is-active',active);b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;});};
  }
  function newsSlider(){
    const root=one('.news-section'),track=one('.splide__list',root);if(!track)return;
    const slides=all('.splide__slide',track);let index=0;
    let updatePagination=()=>{};
    const render=()=>{const count=innerWidth<=560?1:innerWidth<=1024?2:3;index=Math.max(0,Math.min(index,slides.length-count));const gap=innerWidth<=560?24:40;track.style.transform='translateX('+(-index*(slides[0].getBoundingClientRect().width+gap))+'px)';updatePagination();};
    updatePagination=pagination(root,slides,()=>index,i=>{index=i;render();});
    const buttons=all('.news-section__nav-btn',root);buttons[0]?.addEventListener('click',()=>{index--;render();});buttons[1]?.addEventListener('click',()=>{index++;render();});addEventListener('resize',render);render();
  }
  function offerSlider(){
    const root=one('.catalog-best-offers'),track=one('.splide__list',root);if(!track)return;
    all('.splide__slide--clone',track).forEach(e=>e.remove());const originals=all('.splide__slide',track);
    const before=originals.at(-1).cloneNode(true),after=originals[0].cloneNode(true);before.id='international-offer-before';after.id='international-offer-after';before.classList.add('splide__slide--clone');after.classList.add('splide__slide--clone');track.prepend(before);track.append(after);
    const slides=all('.splide__slide',track);let index=1;
    let updatePagination=()=>{};
    const render=()=>{
      const mobile=innerWidth<=540,gap=mobile?24:innerWidth<=768?12:innerWidth<=1024?16:innerWidth<=1280?20:innerWidth<=1440?24:90;
      const viewport=one('.splide__track',root).getBoundingClientRect().width;
      const width=mobile?viewport:(viewport-2*gap)/3;
      slides.forEach((slide,i)=>{slide.style.width=width+'px';slide.style.marginRight=gap+'px';slide.classList.toggle('is-active',i===index);slide.classList.toggle('is-visible',mobile?i===index:Math.abs(i-index)<=1);slide.removeAttribute('aria-hidden');});
      track.style.transform='translateX('+(mobile?-index*(width+gap):(viewport-width)/2-index*(width+gap))+'px)';updatePagination();
    };
    updatePagination=pagination(root,originals,()=>index-1,i=>{index=i+1;render();});
    const move=delta=>{index=1+(index-1+delta+originals.length)%originals.length;render();};
    const buttons=all('.catalog-best-offers__nav-btn',root);buttons[0]?.addEventListener('click',()=>move(-1));buttons[1]?.addEventListener('click',()=>move(1));
    let touch=0;track.addEventListener('touchstart',e=>touch=e.touches[0].clientX,{passive:true});track.addEventListener('touchend',e=>{if(Math.abs(touch-e.changedTouches[0].clientX)>30)move(touch>e.changedTouches[0].clientX?1:-1);},{passive:true});addEventListener('resize',render);render();
  }
  newsSlider(); if(!document.body.classList.contains('international-node-design'))offerSlider();
  const map=one('.catalog-projects-map');
  if(map){
    const engine=one('.ymaps3--map',map),tiles=one('.ymaps3--tile-layer__container',map),markers=one('.ymaps3--marker-layer',map);
    let scale=1,panX=0,panY=0;
    const layers=all('.ymaps3--tile-layer,.ymaps3--marker-layer',map);
    const camera=()=>layers.forEach(e=>{e.style.transformOrigin='center';e.style.transform='translate('+panX+'px,'+panY+'px) scale('+scale+')';});
    const resize=()=>{
      if(engine){engine.style.width=map.clientWidth+'px';engine.style.height=map.clientHeight+'px';}
      const states=window.BARNES_INTERNATIONAL_MAP_STATES;if(!states?.length||!tiles||!markers)return;
      const state=states.reduce((a,b)=>Math.abs(a.viewport-innerWidth)<Math.abs(b.viewport-innerWidth)?a:b);
      const dx=(map.clientWidth-state.width)/2,dy=(map.clientHeight-state.height)/2;
      tiles.dataset.z=String(state.zoom);tiles.style.transform=state.transform;
      tiles.replaceChildren(...state.tiles.map(tile=>{const img=document.createElement('img');img.src=tile.src;Object.assign(img.style,{width:'256px',height:'256px',opacity:'1',left:(tile.left+dx)+'px',top:(tile.top+dy)+'px'});return img;}));
      markers.replaceChildren(...state.markers.map(marker=>{const e=document.createElement('ymaps3');e.className='ymaps3--marker';e.style.transform=marker.transform.replace(/translate\(([-\d.]+)px, ([-\d.]+)px\)/,(_,x,y)=>'translate('+(Number(x)+dx)+'px, '+(Number(y)+dy)+'px)');e.innerHTML=marker.html.replace(/src="\//g,'src="https://front.barnes.vsavr.ru/');e.addEventListener('click',()=>window.BARNES_OPEN_MAP?window.BARNES_OPEN_MAP():scrollToSection('.catalog-grid'));return e;}));camera();
    };
    addEventListener('resize',resize);resize();
    if(!map.dataset.nodeMapBrowser)one('.catalog-projects-map__fullscreen',map)?.addEventListener('click',e=>{const expanded=map.classList.toggle('source-map-expanded');e.currentTarget.setAttribute('aria-pressed',String(expanded));resize();});
    [['.ymaps3--zoom-control__in',1.2,'Увеличить карту'],['.ymaps3--zoom-control__out',1/1.2,'Уменьшить карту']].forEach(([selector,factor,label])=>{const button=one(selector,map)?.closest('button');button?.setAttribute('aria-label',label);button?.addEventListener('click',()=>{scale=Math.max(.7,Math.min(3,scale*factor));camera();});});
    one('.ymaps3--open-maps-button',map)?.closest('button')?.addEventListener('click',()=>window.open('https://yandex.ru/maps/?ll=37.62%2C55.75&z=11','_blank','noopener'));
    const canvas=one('.catalog-projects-map__canvas',map);let drag=null;
    canvas?.addEventListener('pointerdown',e=>{if(e.target.closest('button,a'))return;drag={x:e.clientX,y:e.clientY,startX:panX,startY:panY};canvas.setPointerCapture(e.pointerId);});
    canvas?.addEventListener('pointermove',e=>{if(!drag)return;panX=drag.startX+e.clientX-drag.x;panY=drag.startY+e.clientY-drag.y;camera();});canvas?.addEventListener('pointerup',()=>drag=null);
    const search=one('.catalog-projects-map__search-input',map);search?.setAttribute('aria-label','Поиск в видимой области карты');search?.addEventListener('input',()=>{const query=search.value.trim().toLowerCase();items.forEach(item=>item.hidden=!!query&&!item.textContent.toLowerCase().includes(query));});
  }
})();
