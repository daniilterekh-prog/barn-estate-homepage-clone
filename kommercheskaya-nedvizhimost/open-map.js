/* Source fullscreen interface, isolated from the collapsed map and node UI. */
(() => {
  const trigger=document.querySelector('.catalog-projects-map__fullscreen');
  if(!trigger||!window.CommercialOpenMapTemplate)return;
  const css=document.createElement('link');css.rel='stylesheet';css.href='open-map-source.css';document.head.append(css);
  const shell=document.createElement('div');shell.className='commercial-map-surface';shell.hidden=true;
  shell.setAttribute('role','dialog');shell.setAttribute('aria-modal','true');shell.setAttribute('aria-label','Карта коммерческой недвижимости');
  shell.innerHTML=window.CommercialOpenMapTemplate;document.body.append(shell);
  const panel=shell.querySelector('.catalog-projects-map__panel');
  const handle=shell.querySelector('.catalog-projects-map__panel-handle');
  const exit=shell.querySelector('.catalog-projects-map__exit');
  const image=shell.querySelector('.commercial-open-map-image');
  const search=shell.querySelector('.catalog-projects-map__panel-search-input');
  search.setAttribute('aria-label','Поиск объектов на карте');
  let background=[],oldOverflow='';
  const expanded=open=>{panel.classList.toggle('catalog-projects-map__panel--expanded',open);handle.setAttribute('aria-expanded',String(open));handle.setAttribute('aria-label',open?'Свернуть список объектов':'Развернуть список объектов');};
  function resize(){
    const widths=[320,390,540,768,1440,1920];const closest=widths.reduce((a,b)=>Math.abs(b-innerWidth)<Math.abs(a-innerWidth)?b:a);
    image.src=`assets/open-map-${closest}.png`;
  }
  function close(){
    if(shell.hidden)return;
    shell.hidden=true;document.body.style.overflow=oldOverflow;
    background.forEach(([el,inert])=>el.inert=inert);background=[];
    trigger.focus({preventScroll:true});
  }
  trigger.setAttribute('aria-haspopup','dialog');
  trigger.addEventListener('click',()=>{
    resize();expanded(false);search.value='';oldOverflow=document.body.style.overflow;
    background=[...document.body.children].filter(el=>el!==shell&&el.tagName!=='SCRIPT').map(el=>[el,el.inert]);
    background.forEach(([el])=>el.inert=true);document.body.style.overflow='hidden';shell.hidden=false;exit.focus({preventScroll:true});
  });
  exit.addEventListener('click',close);
  handle.addEventListener('click',()=>expanded(!panel.classList.contains('catalog-projects-map__panel--expanded')));
  search.addEventListener('focus',()=>{if(innerWidth<=540)expanded(true);});
  shell.querySelectorAll('.catalog-projects-map__panel-filter,.catalog-quick-filters__button').forEach(button=>button.addEventListener('click',()=>{
    // Reuse the offline original commercial filter; never manufacture map results.
    window.CommercialOpenFilters(button);
  }));
  document.addEventListener('keydown',event=>{
    if(shell.hidden||document.querySelector('.hero-filter-modal'))return;
    if(event.key==='Escape'){event.preventDefault();close();return;}
    if(event.key!=='Tab')return;
    const items=[...shell.querySelectorAll('button,input,a[href]')].filter(el=>el.getClientRects().length&&!el.disabled);
    if(event.shiftKey&&document.activeElement===items[0]){event.preventDefault();items.at(-1).focus();}
    else if(!event.shiftKey&&document.activeElement===items.at(-1)){event.preventDefault();items[0].focus();}
  });
  addEventListener('resize',()=>{if(!shell.hidden)resize();});
})();
