/* City adapter for the approved FirstDegreeNode contract. Preserve live city data. */
(() => {
  'use strict';
  const q = (selector, root = document) => root.querySelector(selector);
  const all = (selector, root = document) => [...root.querySelectorAll(selector)];
  const text = (selector, root) => q(selector, root)?.textContent.trim() || '';
  const assetRoot = new URL('../kurortnaya/', document.baseURI);
  const icon = (kind) => ({location:'<path d="M12 21s6-5.4 6-11a6 6 0 1 0-12 0c0 5.6 6 11 6 11Z"/><circle cx="12" cy="10" r="2.25"/>',price:'<circle cx="12" cy="12" r="9"/><path d="M9 16V7.5h3.4a2.75 2.75 0 1 1 0 5.5H9m0 0h5.6m-5.6 2h4.6"/>',bedrooms:'<path d="M3 18v-7.5M21 18v-5.5a2 2 0 0 0-2-2h-7.5A2.5 2.5 0 0 0 9 13v2M3 15h18M5.5 10.5h2A1.5 1.5 0 0 1 9 12v3H4v-3a1.5 1.5 0 0 1 1.5-1.5Z"/>'}[kind]);
  const svg = (kind) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon(kind)}</svg>`;
  function eyebrow(selector, label) {
    const heading = q(selector);
    if (!heading || heading.previousElementSibling?.classList.contains('catalog-section-eyebrow')) return;
    const p = document.createElement('p'); p.className = 'catalog-section-eyebrow'; p.textContent = label; heading.before(p);
  }
  function facts(entries, mode) {
    const dl = document.createElement('dl'); dl.className = `listing-card-facts listing-card-facts--${mode}`;
    dl.setAttribute('aria-label','Основные характеристики');
    entries.forEach(([label,value])=>{const div=document.createElement('div'); div.className='listing-card-fact';const dt=document.createElement('dt');dt.className='listing-card-fact__label';dt.textContent=label;const dd=document.createElement('dd');dd.className='listing-card-fact__value';dd.textContent=value || 'По запросу';dd.title=dd.textContent;div.append(dt,dd);dl.append(div)});
    return dl;
  }
  let mode = 'project';
  const selection = {location:'',price:'',bedrooms:''};
  function enhanceLot(card) {
    if (card.dataset.nodeCard) return;
    card.dataset.nodeCard='lot';
    const body=q('.apartment-card__body',card), name=q('.apartment-card__name',card), address=q('.apartment-card__address',card);
    const stats = Object.fromEntries(all('.apartment-card__stat',card).map(e=>[text('.apartment-card__stat-label',e),text('.apartment-card__stat-value',e)]));
    const lotId=q('.apartment-card__lotid',card),price=q('.apartment-card__price',card);
    q('.apartment-card__stats',card)?.remove();q('.apartment-card__topline',card)?.remove();
    if(address) name.before(address);
    name.after(facts([['Площадь',stats['Площадь']],['Спальни',stats['Спальни']],['Этаж',stats['Этаж']]],'lot'));
    const row=document.createElement('div');row.className='apartment-card__price-row listing-card-price-row';row.append(price);if(lotId)row.append(lotId);body.append(row);
    const item=card.closest('.catalog-grid__item'); item.dataset.listingMode='lot';item.dataset.bedrooms=stats['Спальни'] || '';item.dataset.square=(stats['Площадь'] || '').replace(/[^\d.,]/g,'').replace(',','.');item.dataset.location=address?.textContent || '';item.dataset.price=(price.textContent.replace(/\D/g,'')) || '0';
  }
  function render() {
    const list=q('.catalog-grid__list'); if(!list)return;
    let count=0;
    all(':scope > .catalog-grid__item',list).forEach(item=>{
      const visible=item.dataset.listingMode===mode && (!selection.location || item.dataset.location===selection.location) && (!selection.price || (Number(item.dataset.price)>0 && Number(item.dataset.price)<=Number(selection.price))) && (!selection.bedrooms || Number(item.dataset.bedrooms)>=Number(selection.bedrooms));
      item.hidden=!visible;if(visible)count++;
    });
    q('.city-catalog-empty').hidden=Boolean(count);
    all('.catalog-mode-switch__button').forEach(b=>{const active=b.dataset.mode===mode;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active))});
  }
  function initialize() {
    const list=q('.catalog-grid__list'),header=q('.catalog-grid__header');if(!list || !header || q('.city-node-ready'))return;
    document.body.classList.add('city-node-ready','barnes-header-template');
    const consultationImage=q('.catalog-consultation__image');
    if(consultationImage) consultationImage.src=new URL('assets/cta-ruslan-unified-v1.webp',document.baseURI).href;
    [['.catalog-best-offers__title','Новые проекты'],['.catalog-map__title','География'],['.catalog-grid__title','Каталог'],['.departments-section__title','Направления'],['.catalog-faq__title','Экспертиза BARNES']].forEach(([s,t])=>eyebrow(s,t));
    q('.catalog-grid__title').textContent='Актуальные проекты и лоты';
    all('.catalog-grid .apartment-card').forEach(enhanceLot);
    const template=q('.catalog-grid .apartment-card').closest('.catalog-grid__item');
    const keys=new Set();
    all('.catalog-best-offers .apartment-card').forEach(launch=>{
      const link=q('.apartment-card__link',launch);if(!link || keys.has(link.href))return;keys.add(link.href);
      const item=template.cloneNode(true), card=q('.apartment-card',item), body=q('.apartment-card__body',card);
      item.dataset.listingMode='project';item.dataset.location=text('.apartment-card__address',launch);item.dataset.bedrooms='';item.dataset.square='';item.dataset.price=text('.apartment-card__price',launch).replace(/\D/g,'')||'0';card.dataset.nodeCard='project';
      const image=q('.apartment-card__image',card),src=q('.apartment-card__image',launch);image.src=src.currentSrc||src.src;image.alt=src.alt;
      const name=q('.apartment-card__name',card);q('.apartment-card__name-text',name).textContent=text('.apartment-card__name',launch).replace(/^Старт\s+Продаж[.\s]*/i,'');
      all('a',card).forEach(a=>a.href=link.href);
      const price=q('.apartment-card__price',card);price.textContent=text('.apartment-card__price',launch);
      body.replaceChildren(name,facts([['Локация',item.dataset.location],['Срок сдачи',text('.apartment-card__delivery',launch)],['Спальни','По запросу']],'project'),price);
      q('.apartment-card__favorite',card).addEventListener('click',e=>{const b=e.currentTarget;b.setAttribute('aria-pressed',String(b.getAttribute('aria-pressed')!=='true'))});
      q('.apartment-card__call-btn',card).addEventListener('click',()=>q('.catalog-grid__item[data-listing-mode="lot"] .apartment-card__call-btn')?.click());
      list.prepend(item);
    });
    const toolbar=document.createElement('section');toolbar.className='catalog-mode-toolbar';toolbar.setAttribute('aria-label','Фильтры каталога');
    toolbar.innerHTML='<div class="catalog-mode-switch" role="group" aria-label="Тип недвижимости"><button class="catalog-mode-switch__button is-active" type="button" data-mode="project" aria-pressed="true">Новостройки</button><button class="catalog-mode-switch__button" type="button" data-mode="lot" aria-pressed="false">Вторичная</button></div><div class="catalog-mode-filters catalog-quick-filters" data-v-6fd45cc6></div>';
    [['location','Локация'],['price','Стоимость'],['bedrooms','Спальни']].forEach(([key,label])=>{
      const item=document.createElement('div');item.className='catalog-quick-filters__item';item.setAttribute('data-v-6fd45cc6','');item.innerHTML=`<button class="catalog-quick-filters__button" type="button" data-v-6fd45cc6 aria-haspopup="dialog" aria-expanded="false"><span class="catalog-quick-filters__content"><span class="catalog-quick-filters__icon">${svg(key)}</span><span class="catalog-quick-filters__label" data-v-6fd45cc6><span class="catalog-quick-filters__caption">${label}</span></span></span><span class="catalog-quick-filters__chevron" data-v-6fd45cc6 aria-hidden="true"></span></button>`;
      q('button',item).addEventListener('click',e=>openFilter(key,label,e.currentTarget));q('.catalog-mode-filters',toolbar).append(item);
    });
    all(':scope > .catalog-grid__item',list).forEach((item,i)=>item.dataset.order=String(i));
    const sort=q('.catalog-grid__sort').cloneNode(true),select=q('select',sort);select.setAttribute('data-v-5a2b3b97','');select.addEventListener('change',()=>{const items=all(':scope > .catalog-grid__item',list);const value=select.value;const [key,direction]=value.split('_');items.sort((a,b)=>value==='relevance'?Number(a.dataset.order)-Number(b.dataset.order):(direction==='desc'?-1:1)*(Number(a.dataset[key])-Number(b.dataset[key])));items.forEach(i=>list.append(i))});
    q('.catalog-grid__sort').remove();toolbar.append(sort);
    const detailed=document.createElement('button');detailed.className='catalog-mode-detailed-filters';detailed.type='button';detailed.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.15" aria-hidden="true"><path d="M4 6h3m4 0h9M4 12h8m4 0h4M4 18h4m4 0h8"/><circle cx="9" cy="6" r="2"/><circle cx="14" cy="12" r="2"/><circle cx="10" cy="18" r="2"/></svg><span class="catalog-mode-detailed-filters__label catalog-mode-detailed-filters__label--desktop">Все фильтры</span><span class="catalog-mode-detailed-filters__label catalog-mode-detailed-filters__label--mobile">Фильтры</span>';detailed.addEventListener('click',()=>q('.catalog-hero-filters__filter-icon')?.closest('button')?.click());toolbar.append(detailed);header.after(toolbar);
    all('[data-mode]',toolbar).forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.mode;selection.location='';render()}));
    const empty=document.createElement('p');empty.className='city-catalog-empty';empty.textContent='Объектов с такими параметрами нет. Измени фильтры.';list.after(empty);
    render();
    all('.catalog-best-offers .apartment-card__name').forEach(name=>{name.textContent=name.textContent.replace(/^Старт\s+Продаж[.\s]*/i,'')});
    all('.catalog-best-offers .apartment-card').forEach(card=>{if(!q('.apartment-card__delivery',card)){const badge=document.createElement('span');badge.className='apartment-card__delivery';badge.textContent='Старт продаж';q('.apartment-card__media',card)?.append(badge)}});
    const script=document.createElement('script');script.src=new URL('node-launch.js?v=1',document.baseURI);document.body.append(script);
    setupHeader();
    setupSticky();
    setupFullFilters();
    let pending=false;
    new MutationObserver(()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;all('.catalog-grid .apartment-card:not([data-node-card])').forEach(enhanceLot);render()})}).observe(list,{childList:true,subtree:true});
  }
  function openFilter(key,label,trigger) {
    const dialog=document.createElement('dialog');dialog.className='city-filter-dialog';const heading=document.createElement('h2');heading.textContent=label;const select=document.createElement('select');select.setAttribute('aria-label',label);
    let options=[['','Любые']];
    if(key==='location')options=[['','Все локации'],...[...new Set(all('.catalog-grid__item').filter(i=>i.dataset.listingMode===mode).map(i=>i.dataset.location).filter(Boolean))].map(s=>[s,s])];
    if(key==='price')options=[['','Любая стоимость'],['30000000','До 30 млн ₽'],['50000000','До 50 млн ₽'],['100000000','До 100 млн ₽'],['300000000','До 300 млн ₽']];
    if(key==='bedrooms')options=[['','Любое количество'],['1','От 1 спальни'],['2','От 2 спален'],['3','От 3 спален'],['4','От 4 спален']];
    options.forEach(([v,t])=>{const o=new Option(t,v);select.append(o)});select.value=selection[key];const button=document.createElement('button');button.className='ui-button ui-button--primary';button.textContent='Применить';button.addEventListener('click',()=>{selection[key]=select.value;render();dialog.close()});dialog.append(heading,select,button);dialog.addEventListener('close',()=>{trigger.setAttribute('aria-expanded','false');dialog.remove();trigger.focus()});document.body.append(dialog);trigger.setAttribute('aria-expanded','true');dialog.showModal();
  }
  function setupFullFilters() {
    let hero=q('.catalog-hero-filters__filter-icon');
    const listing=q('.catalog-mode-detailed-filters');
    const controls=q('.catalog-projects-map__controls');
    if(!hero || !listing || !controls)return;
    hero.dataset.cityFilterEntry='hero';
    listing.dataset.cityFilterEntry='listing';
    const map=document.createElement('button');
    map.type='button';map.className='catalog-projects-map__fullscreen city-map-filters';
    const fullscreen=q('.catalog-projects-map__fullscreen',controls);
    for(const attr of fullscreen?.attributes || [])if(attr.name.startsWith('data-v-'))map.setAttribute(attr.name,'');
    map.dataset.cityFilterEntry='map';
    map.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.15" stroke-linecap="round" aria-hidden="true"><path d="M4 6h3m4 0h9M4 12h8m4 0h4M4 18h4m4 0h8"/><circle cx="9" cy="6" r="2"/><circle cx="14" cy="12" r="2"/><circle cx="10" cy="18" r="2"/></svg><span>Фильтры</span>';
    controls.insertBefore(map,fullscreen);
    const triggers=[hero,listing,map];
    triggers.forEach(button=>{button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-controls','catalog-hero-filters-panel');button.setAttribute('aria-expanded','false')});
    map.setAttribute('aria-label','Открыть фильтры недвижимости');
    let opener=null, wasOpen=false, savedScroll=0;
    document.addEventListener('click',event=>{
      const button=event.target.closest('[data-city-filter-entry]');
      if(!button)return;
      if(button===hero){if(!opener)opener=hero;return;}
      event.preventDefault();event.stopImmediatePropagation();
      opener=button;savedScroll=scrollY;
      if(!q('.hero-filter-modal'))q('.catalog-hero-filters__filter-icon')?.click();
    },true);
    document.addEventListener('keydown',event=>{
      const panel=q('.hero-filter-modal');
      if(!panel)return;
      if(event.key==='Escape'){
        event.preventDefault();q('.hero-filter-modal__close',panel)?.click();return;
      }
      if(event.key!=='Tab')return;
      const controls=all('button:not(.hero-filter-modal__backdrop),input,a[href]',panel).filter(element=>!element.disabled && element.getClientRects().length);
      const first=controls[0],last=controls[controls.length-1];
      if(event.shiftKey && document.activeElement===first){event.preventDefault();last?.focus();}
      else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first?.focus();}
    });
    const update=()=>{
      const currentHero=q('.catalog-hero-filters__filter-icon');
      if(currentHero && currentHero!==hero){
        hero=currentHero;triggers[0]=hero;
        hero.dataset.cityFilterEntry='hero';
        hero.setAttribute('aria-haspopup','dialog');
      }
      const panel=q('.hero-filter-modal');
      const open=Boolean(panel);
      triggers.forEach(button=>button.setAttribute('aria-expanded',String(open)));
      if(open && !wasOpen){
        // Use the existing Nuxt modal and reactive selection; never clone its fields.
        q('.hero-filter-modal__close',panel)?.focus({preventScroll:true});
      }
      if(!open && wasOpen){
        const previous=opener;opener=null;
        requestAnimationFrame(()=>{
          previous?.focus({preventScroll:true});
          if(previous && previous!==hero)scrollTo({top:savedScroll,behavior:'instant'});
        });
      }
      wasOpen=open;
    };
    new MutationObserver(update).observe(document.body,{childList:true,subtree:true});
  }
  function setupHeader() {
    const header=q('.layout__header .site-header');if(!header)return;
    header.classList.add('site-header--no-nav','catalog-header-ready');q('.site-header__nav',header)?.remove();q('.catalog-page-nav')?.setAttribute('hidden','');
    const contacts=document.createElement('nav');contacts.className='catalog-header-contacts';contacts.setAttribute('aria-label','Способы связи');
    [['WhatsApp','https://wa.me/79252621650','header-whatsapp.svg'],['MAX','https://max.ru/join/AWj8ibiCtAPOJOlulMGNkykKGz_prXVWg-IQK1KpUG8','header-max.svg'],['Telegram','https://t.me/art_de_vivre_barnes','header-telegram.svg']].forEach(([label,href,file])=>{const a=document.createElement('a');a.className='catalog-header-contact';a.href=href;a.setAttribute('aria-label','Написать в '+label);const img=document.createElement('img');img.alt='';img.src=new URL('assets/'+file,assetRoot);a.append(img);contacts.append(a)});
    const phone=q('.site-header__right .site-header__phone',header);phone?.classList.add('catalog-header-contact','catalog-header-contact--phone');if(phone)contacts.append(phone);q('.site-header__right',header)?.append(contacts);
  }
  function setupSticky() {
    const hero=q('.catalog-hero'),header=q('.layout__header .site-header');if(!hero || !header)return;
    const nav=document.createElement('div');nav.className='catalog-sticky';nav.setAttribute('aria-hidden','true');nav.setAttribute('inert','');
    const entries=[['Проекты','catalog-new-starts'],['Каталог','catalog-grid'],['О BARNES','catalog-intro'],['Вопросы','catalog-faq']];
    nav.innerHTML='<div class="catalog-sticky__inner base-container"><nav class="catalog-sticky__nav" aria-label="Навигация по странице"><ul class="catalog-sticky__list"></ul></nav><a class="catalog-sticky__logo" href="https://barn-estate.ru/" aria-label="BARNES Moscow — на главную"><img alt="BARNES Moscow"></a><div class="catalog-sticky__brand"><button class="catalog-sticky__request" type="button">Оставить заявку</button><nav class="catalog-sticky__messengers" aria-label="Способы связи"></nav></div></div>';
    entries.forEach(([label,id])=>{const li=document.createElement('li');li.className='catalog-sticky__item';const a=document.createElement('a');a.className='catalog-sticky__link';a.href='#'+id;a.textContent=label;li.append(a);q('.catalog-sticky__list',nav).append(li)});
    q('.catalog-sticky__logo img',nav).src=q('.site-header__logo img',header).src;
    all('.catalog-header-contacts a',header).forEach(link=>{const a=link.cloneNode(true);a.className=link.classList.contains('catalog-header-contact--phone')?'catalog-sticky__phone':'catalog-sticky__messenger';q('.site-header__phone-number',a)?.classList.add('catalog-sticky__phone-number');q('.site-header__icon',a)?.classList.add('catalog-sticky__phone-icon');q('.catalog-sticky__messengers',nav).append(a)});
    const panel=q('.catalog-sticky__messengers',nav).cloneNode(true);panel.className='catalog-sticky__contact-panel';panel.id='city-sticky-contacts';panel.hidden=true;q('.catalog-sticky__inner',nav).append(panel);
    const li=document.createElement('li');li.className='catalog-sticky__item catalog-sticky__item--contacts';li.innerHTML='<button class="catalog-sticky__contact-toggle" type="button" aria-label="Показать способы связи" aria-expanded="false" aria-controls="city-sticky-contacts"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.8 9.8 0 0 1-4-.9L3 21l1.7-4.6A8.4 8.4 0 1 1 21 11.5Z"/><path d="M8 12h.01M12 12h.01M16 12h.01"/></svg></button>';q('.catalog-sticky__list',nav).append(li);
    q('button',li).addEventListener('click',e=>{panel.hidden=!panel.hidden;e.currentTarget.setAttribute('aria-expanded',String(!panel.hidden))});
    q('.catalog-sticky__request',nav).addEventListener('click',()=>q('.catalog-grid__item[data-listing-mode="lot"] .apartment-card__call-btn')?.click());
    hero.closest('main').prepend(nav);
    const update=()=>{const visible=scrollY>hero.offsetTop+hero.offsetHeight-120;nav.classList.toggle('catalog-sticky--visible',visible);nav.setAttribute('aria-hidden',String(!visible));nav.toggleAttribute('inert',!visible);header.classList.remove('site-header--scrolled');let active=entries[0][1];entries.forEach(([,id])=>{if(q('#'+id).getBoundingClientRect().top<=140)active=id});all('.catalog-sticky__link',nav).forEach(a=>a.classList.toggle('catalog-sticky__link--active',a.hash==='#'+active))};
    addEventListener('scroll',update,{passive:true});addEventListener('resize',update);update();
  }
  // Decorate only after Nuxt has mounted; a timer alone races slower connections.
  const waitForHydration=()=>{
    const nuxt=q('#__nuxt')?.__vue_app__?.$nuxt;
    if(nuxt && !nuxt.isHydrating){initialize();return;}
    setTimeout(waitForHydration,100);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',waitForHydration,{once:true});else waitForHydration();
})();
