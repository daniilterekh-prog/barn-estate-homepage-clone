/* Local behavior for the preserved source HTML. No Nuxt server or source API required. */
(function(){
  'use strict';
  const data=window.BARNES_PROPERTY_DATA;
  const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const header=q('.site-header'),menuButton=q('.site-header__icon-btn');
  const closedMenuIcon=menuButton?.innerHTML;
  let overlay=null,returnFocus=null,reviewIndex=0;
  function headerSize(){if(header){document.documentElement.style.setProperty('--layout-header-height',header.getBoundingClientRect().height+'px');document.documentElement.style.setProperty('--site-menu-top',header.getBoundingClientRect().bottom+'px')}}
  headerSize();new ResizeObserver(headerSize).observe(header);
  function developerSize(){const t=q('.lot-developer__text'),w=q('.lot-developer__text-wrap'),b=q('.lot-developer__toggle');if(!t||!w)return;const collapsed=parseFloat(getComputedStyle(t).fontSize)*6;w.style.maxHeight=b?.getAttribute('aria-expanded')==='true'?t.scrollHeight+'px':collapsed+'px';if(b)b.hidden=t.scrollHeight<=collapsed}
  developerSize();window.addEventListener('resize',developerSize);
  q('.lot-developer__toggle')?.addEventListener('click',e=>{const b=e.currentTarget,expanded=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',String(expanded));b.textContent=expanded?'Свернуть':'Читать далее';q('.lot-developer__text-wrap').classList.toggle('lot-developer__text-wrap--expanded',expanded);developerSize()});
  function close(){if(!overlay)return;overlay.remove();overlay=null;document.body.style.removeProperty('overflow');document.body.classList.remove('no-scroll');header?.classList.remove('site-header--menu-open');menuButton?.setAttribute('aria-label','Открыть меню');menuButton?.setAttribute('aria-expanded','false');if(menuButton)menuButton.innerHTML=closedMenuIcon;returnFocus?.focus({preventScroll:true})}
  function open(name){close();const template=q('#source-'+name);if(!template)return;returnFocus=document.activeElement;overlay=document.createElement('div');overlay.dataset.localOverlay=name;overlay.append(template.content.cloneNode(true));qa('[class]',overlay).forEach(e=>[...e.classList].filter(c=>/-enter-|^-leave-/.test(c)).forEach(c=>e.classList.remove(c)));document.body.append(overlay);document.body.style.overflow='hidden';document.body.classList.add('no-scroll');if(name==='menu'){header.classList.add('site-header--menu-open');menuButton.setAttribute('aria-label','Закрыть меню');menuButton.setAttribute('aria-expanded','true');menuButton.innerHTML=data.menuIcon;headerSize()}initOverlay(overlay,name);initForms(overlay);q('button,input,a',overlay)?.focus({preventScroll:true});}
  menuButton?.addEventListener('click',()=>overlay?.dataset.localOverlay==='menu'?close():open('menu'));
  document.addEventListener('keydown',e=>{if(!overlay)return;if(e.key==='Escape'){close();return}if(e.key==='Tab'){const items=qa('a[href],button,input,[tabindex="0"]',overlay).filter(e=>e.getClientRects().length&&!e.disabled);if(!items.length)return;const first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
  function initOverlay(root,name){
    qa('button',root).filter(b=>/закрыть/i.test(b.getAttribute('aria-label')||'')||/__(close|close-btn)$/.test(b.className)).forEach(b=>b.addEventListener('click',close));
    root.addEventListener('click',e=>{if(e.target.classList.contains('modal'))close()});
    if(name==='gallery'||name==='gallery-map'||name==='construction'){
      const stage=q('.lot-gallery-modal__stage,.construction-gallery-modal__stage',root);
      let imageIndex=0;const slides=stage?qa('[class$="__slide"]',stage):[],counter=q('[class$="__counter"]',root);
      qa('[aria-label="Предыдущее фото"],[aria-label="Следующее фото"]',root).forEach(b=>b.addEventListener('click',()=>{if(!stage||!slides.length)return;imageIndex=(imageIndex+(b.getAttribute('aria-label').startsWith('Пред')?-1:1)+slides.length)%slides.length;stage.scrollTo({top:Math.floor(imageIndex/2)*stage.clientHeight,behavior:'smooth'});if(counter)counter.textContent=(imageIndex+1)+'/'+slides.length}));
      qa('.lot-gallery-modal__tab',root).forEach((b,i)=>b.addEventListener('click',()=>open(i?'gallery-map':'gallery')));
      qa('.lot-gallery-modal__action',root).forEach(b=>b.addEventListener('click',()=>open(b.textContent.includes('презентацию')?'presentation':'tour')));
      q('.lot-gallery-modal__track',root)?.addEventListener('click',()=>open('price'));
      if(name==='gallery-map'){
        const box=q('.lot-gallery-modal__map',root),mapNode=q('.ymaps3--map',box),tileLayer=q('.ymaps3--tile-layer__container',box);
        if(box&&mapNode&&tileLayer){const w=parseFloat(mapNode.style.width),h=parseFloat(mapNode.style.height),tiles=qa('img',tileLayer).map(e=>({e,x:parseFloat(e.style.left),y:parseFloat(e.style.top)})),markers=qa('.ymaps3--marker',box).map(e=>({e,pos:e.style.transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/)}));new ResizeObserver(()=>{const dx=(box.clientWidth-w)/2,dy=(box.clientHeight-h)/2;mapNode.style.width=box.clientWidth+'px';mapNode.style.height=box.clientHeight+'px';tiles.forEach(t=>{t.e.style.left=t.x+dx+'px';t.e.style.top=t.y+dy+'px'});markers.forEach(m=>{if(m.pos)m.e.style.transform='translate('+(+m.pos[1]+dx)+'px,'+(+m.pos[2]+dy)+'px)'})}).observe(box)}
      }
    }
  }
  qa('.lot-hero__media-hit,.lot-hero__action').forEach(b=>b.addEventListener('click',()=>open('gallery')));
  qa('.construction__card').forEach((b,index)=>b.addEventListener('click',()=>{open('construction');const stage=q('.construction-gallery-modal__stage',overlay);if(stage)stage.scrollTo({top:Math.floor(index/2)*stage.clientHeight});const period=q('.construction-gallery-modal__period',overlay);if(period)period.textContent=q('.construction__year',b)?.textContent||''}));
  qa('.site-footer__callback-btn,.lot-complex-bar__consult,.lot-complex-bar__action,.mortgage__action,.floating-expert__card').forEach(b=>b.addEventListener('click',()=>open(b.textContent.includes('Смотреть обзор')?'gallery':'callback')));
  function scrollBar(){const bar=q('.lot-complex-bar'),hero=q('.lot-hero');if(!bar||!hero)return;const show=hero.getBoundingClientRect().bottom<header.getBoundingClientRect().height;bar.classList.toggle('lot-complex-bar--visible',show);bar.setAttribute('aria-hidden',String(!show))}
  window.addEventListener('scroll',scrollBar,{passive:true});scrollBar();
  qa('.lot-hero__card-action,.catalog-contact__card-submit').forEach(b=>b.addEventListener('click',()=>open(b.textContent.includes('презентацию')?'presentation':'tour')));
  q('.lot-hero__track')?.addEventListener('click',()=>open('price'));
  q('.floating-expert__close')?.addEventListener('click',()=>q('.floating-expert')?.remove());
  function initForms(root){
    qa('.catalog-consultation__method,.catalog-contact__method,.callback-modal__method',root).forEach(b=>b.addEventListener('click',()=>{const group=b.parentElement;qa('button',group).forEach(t=>{[...t.classList].filter(c=>c.endsWith('--active')).forEach(c=>t.classList.remove(c));t.setAttribute('aria-pressed',String(t===b))});const base=[...b.classList].find(c=>c.endsWith('__method'));if(base)b.classList.add(base+'--active')}));
    qa('form',root).forEach(f=>{qa('input:not([type="hidden"])',f).forEach(i=>{if(i.type==='checkbox'||i.type==='tel'||i.type==='email')i.required=true});f.addEventListener('submit',e=>{e.preventDefault();if(!f.reportValidity())return;let msg=q('.local-form-feedback',f);if(!msg){msg=document.createElement('p');msg.className='local-form-feedback';msg.setAttribute('role','status');f.append(msg)}msg.textContent='Для отправки заявки свяжитесь с BARNES по телефону +7 (499) 272-48-72.'})});
  }
  initForms(document);
  qa('.reviews-section__nav-btn').forEach((b,i)=>b.addEventListener('click',()=>{reviewIndex=Math.max(0,Math.min(data.reviews.length-1,reviewIndex+(i?1:-1)));q('.reviews-section__content').innerHTML=data.reviews[reviewIndex];qa('.reviews-section__nav-btn').forEach((t,j)=>t.disabled=j?reviewIndex===data.reviews.length-1:reviewIndex===0)}));
  const wrap=q('.surroundings-map__wrap'),map=q('.ymaps3--map'),layer=q('.ymaps3--tile-layer__container'),engine=q('.ymaps3--main-engine-container');
  let category=null,mapPan={x:0,y:0},mapScale=1;
  const translate=s=>{const m=s.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);return m?[+m[1],+m[2]]:[0,0]};
  function mapGeometry(){
    if(!wrap||!map||!layer)return;
    const state=data.maps.reduce((a,b)=>Math.abs(b.viewport-innerWidth)<Math.abs(a.viewport-innerWidth)?b:a);
    const dx=(wrap.clientWidth-state.width)/2,dy=(wrap.clientHeight-state.height)/2;
    map.style.width=wrap.clientWidth+'px';map.style.height=wrap.clientHeight+'px';
    const agreement=q('.ymaps3--map-copyrights__user-agreements',wrap);if(agreement)agreement.textContent=wrap.clientWidth<320?'Условия':'Условия использования';
    layer.dataset.z=state.zoom;layer.style.transform=state.transform;
    layer.replaceChildren(...state.tiles.map(t=>{const img=document.createElement('img');img.src=t.src;img.loading='eager';img.style.cssText='width:256px;height:256px;opacity:1;left:'+(t.left+dx)+'px;top:'+(t.top+dy)+'px';return img}));
    const existing=qa('.ymaps3--marker',map),parent=existing[0]?.parentElement;if(!parent)return;existing.forEach(m=>m.remove());
    const markers=category===null?state.markers:data.categories[category].map.markers;
    const base=category===null?state:data.categories[category].map;
    markers.forEach(m=>{const [x,y]=translate(m.transform),e=document.createElement('ymaps3');e.className='ymaps3--marker';e.style.cssText='transform:translate('+(x+(wrap.clientWidth-base.width)/2)+'px,'+(y+(wrap.clientHeight-base.height)/2)+'px);z-index:0';e.innerHTML=m.html;parent.append(e)});
    if(engine){engine.style.transformOrigin='50% 50%';if(mapPan.x===0&&mapPan.y===0&&mapScale===1)engine.style.removeProperty('transform');else engine.style.transform='translate('+mapPan.x+'px,'+mapPan.y+'px) scale('+mapScale+')'}
  }
  mapGeometry();if(wrap)new ResizeObserver(mapGeometry).observe(wrap);
  qa('.surroundings-map__category').forEach((b,i)=>b.addEventListener('click',()=>{category=i;qa('.surroundings-map__category').forEach(t=>t.classList.toggle('surroundings-map__category--active',t===b));mapGeometry()}));
  q('.surroundings-map__switch')?.addEventListener('click',e=>{const b=e.currentTarget,show=!b.classList.contains('surroundings-map__switch--on');b.classList.toggle('surroundings-map__switch--on',show);b.setAttribute('aria-checked',String(show));qa('.ymaps3--marker').forEach(m=>{if(!q('.surroundings-map__lot-pin',m))m.style.visibility=show?'visible':'hidden'})});
  q('.surroundings-map__fullscreen')?.addEventListener('click',()=>document.fullscreenElement?document.exitFullscreen():wrap.requestFullscreen());
  qa('.ymaps3--zoom-control button').forEach((b,i)=>b.addEventListener('click',()=>{mapScale=Math.max(.5,Math.min(4,mapScale*(i?.8:1.25)));mapGeometry()}));
  q('.ymaps3--open-maps-button')?.parentElement.addEventListener('click',()=>window.open('https://yandex.ru/maps/?ll=37.5934252%2C55.7641867&z=15','_blank','noopener'));
  q('.surroundings-map__search-input')?.addEventListener('input',e=>{const term=e.target.value.toLocaleLowerCase('ru');qa('.ymaps3--marker').forEach(m=>{const pin=q('[title]',m);m.style.visibility=!pin||pin.title.toLocaleLowerCase('ru').includes(term)?'visible':'hidden'})});
  let drag=null;q('.surroundings-map__canvas')?.addEventListener('pointerdown',e=>{if(e.target.closest('button,a'))return;drag={x:e.clientX,y:e.clientY,pan:{...mapPan}};e.currentTarget.setPointerCapture(e.pointerId)});
  q('.surroundings-map__canvas')?.addEventListener('pointermove',e=>{if(!drag)return;mapPan={x:drag.pan.x+e.clientX-drag.x,y:drag.pan.y+e.clientY-drag.y};if(engine)engine.style.transform='translate('+mapPan.x+'px,'+mapPan.y+'px) scale('+mapScale+')'});
  q('.surroundings-map__canvas')?.addEventListener('pointerup',()=>drag=null);
  const sliders=qa('.mortgage .ui-range-slider');
  function updateMortgage(index,value){
    const s=sliders[index],handle=q('[role="slider"]',s),min=+handle.getAttribute('aria-valuemin'),max=+handle.getAttribute('aria-valuemax');value=Math.max(min,Math.min(max,value));const pct=(value-min)/(max-min)*100;
    handle.setAttribute('aria-valuenow',value);handle.setAttribute('aria-valuetext',value);handle.style.left=pct+'%';q('.ui-range-slider__fill',s).style.width=pct+'%';q('.mortgage__field-value',s.closest('.mortgage__field')).textContent=index===2?value+' '+(value===1?'год':value<5?'года':'лет'):new Intl.NumberFormat('ru-RU').format(value)+' ₽';
    const values=sliders.map(s=>+q('[role="slider"]',s).getAttribute('aria-valuenow'));
    qa('.mortgage__table tbody tr').forEach(row=>{const cells=qa('td',row),r=parseFloat(cells[1].textContent.replace(',','.'))/1200,n=values[2]*12,p=(values[0]-values[1])*r/(1-Math.pow(1+r,-n));cells[2].textContent=new Intl.NumberFormat('ru-RU').format(Math.round(values[0]*.2))+' ₽';cells[3].textContent=new Intl.NumberFormat('ru-RU').format(Math.round(p))+' ₽'});
  }
  sliders.forEach((s,index)=>{const handle=q('[role="slider"]',s),step=index===2?1:50000;handle.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key))return;e.preventDefault();const value=e.key==='Home'?+handle.getAttribute('aria-valuemin'):e.key==='End'?+handle.getAttribute('aria-valuemax'):+handle.getAttribute('aria-valuenow')+(['ArrowRight','ArrowUp'].includes(e.key)?step:-step);updateMortgage(index,value)});const track=q('.ui-range-slider__track',s);let active=false;const move=e=>{const rect=track.getBoundingClientRect(),min=+handle.getAttribute('aria-valuemin'),max=+handle.getAttribute('aria-valuemax');updateMortgage(index,Math.round((min+(max-min)*(e.clientX-rect.x)/rect.width)/step)*step)};track.addEventListener('pointerdown',e=>{active=true;track.setPointerCapture(e.pointerId);move(e)});track.addEventListener('pointermove',e=>{if(active)move(e)});track.addEventListener('pointerup',()=>active=false)});
  document.fonts.ready.then(()=>{headerSize();developerSize()});
}());
