/* Reference listing geometry; all displayed data belongs to the international page. */
(() => {
  const one=(s,r=document)=>r.querySelector(s),all=(s,r=document)=>[...r.querySelectorAll(s)];
  const list=one('.catalog-grid__list'),header=one('.catalog-grid__header'),sort=one('.catalog-grid__sort');
  if(!list||!header||!sort)return;
  const facts=(entries,kind)=>{const dl=document.createElement('dl');dl.className='listing-card-facts listing-card-facts--'+kind;dl.setAttribute('aria-label','Основные характеристики');entries.forEach(([label,value])=>{const item=document.createElement('div');item.className='listing-card-fact';const dt=document.createElement('dt'),dd=document.createElement('dd');dt.className='listing-card-fact__label';dd.className='listing-card-fact__value';dt.textContent=label;dd.textContent=value||'По запросу';item.append(dt,dd);dl.append(item);});return dl;};
  const lots=all('.catalog-grid__item',list);
  // Countries are tied to the existing objects, never guessed from descriptions.
  const countriesByName={'Paris-75017':'Франция','Almis La Mer Dragos':'Турция','Marrakech':'Марокко','Lisboa':'Португалия','Saint-Maur-des-Fossés-94100':'Франция','Уникальная резиденция с прекрасным видом - Колонаки':'Греция','Luxembourg':'Люксембург','Megève-74120':'Франция','Benahavís':'Испания','Sciez-74140':'Франция'};
  const countriesByCity={'Стамбул':'Турция','Дубай':'ОАЭ','Салала':'Оман','Ереван':'Армения'};
  const originalTemplate=lots[0].cloneNode(true);
  lots.forEach(item=>{
    item.dataset.listingMode='secondary';item.hidden=true;
    const card=one('.apartment-card',item),body=one('.apartment-card__body',card),name=one('.apartment-card__name',body),id=one('.apartment-card__lotid',body),price=one('.apartment-card__price',body),address=one('.apartment-card__address',body);
    const stats=all('.apartment-card__stat',body).map(e=>[one('.apartment-card__stat-label',e)?.textContent.trim(),one('.apartment-card__stat-value',e)?.textContent.trim()]);
    const get=key=>stats.find(([label])=>label?.toLowerCase().includes(key))?.[1];
    one('.apartment-card__stats',body)?.remove();one('.apartment-card__topline',body)?.remove();
    const country=countriesByName[one('.apartment-card__name-text',name)?.textContent.trim()];
    if(address){address.textContent=country||'';if(country){item.dataset.country=country;body.prepend(address);}else address.remove();}
    name.after(facts([['Комнаты',get('комнат')||get('спаль')],['Площадь',get('площад')],['Этаж',get('этаж')]],'lot'));
    if(price){const row=document.createElement('div');row.className='apartment-card__price-row listing-card-price-row';row.setAttribute('data-v-80c326fb','');row.append(price);if(id)row.append(id);body.append(row);}
  });
  const offers=all('.catalog-best-offers .splide__slide:not(.splide__slide--clone) .apartment-card');
  offers.forEach(offer=>{
    const item=originalTemplate.cloneNode(true);item.dataset.listingMode='new-build';item.hidden=false;
    const body=one('.apartment-card__body',item),name=one('.apartment-card__name',body),nameText=one('.apartment-card__name-text',name),price=one('.apartment-card__price',body),image=one('.apartment-card__image',item);
    const title=one('.apartment-card__name',offer)?.textContent.trim(),region=one('.apartment-card__address',offer)?.textContent.trim(),href=one('.apartment-card__link',offer)?.href,delivery=one('.apartment-card__delivery',offer)?.textContent.trim();
    nameText.textContent=title;all('a',item).forEach(a=>a.href=href);image.src=one('.apartment-card__image',offer).src;image.alt=title;image.removeAttribute('srcset');
    const country=countriesByCity[region];item.dataset.country=country||'';
    one('.apartment-card__topline',body)?.remove();const address=one('.apartment-card__address',body);if(address){address.textContent=country||'';if(country)body.prepend(address);else address.remove();}one('.apartment-card__stats',body)?.remove();
    name.after(facts([['Локация',region],['Срок сдачи',delivery],['Спальни','По запросу']],'project'));
    price.textContent=one('.apartment-card__price',offer)?.textContent.trim()||'Цена по запросу';
    list.prepend(item);
  });
  // Launch cards use the same country eyebrow; project facts keep the city.
  all('.catalog-best-offers .apartment-card__address').forEach(address=>{const country=countriesByCity[address.textContent.trim()];if(country)address.textContent=country;});
  one('.catalog-grid__inner > .catalog-quick-filters')?.remove();
  const toolbar=document.createElement('section');toolbar.className='catalog-mode-toolbar';toolbar.setAttribute('aria-label','Фильтры каталога');
  toolbar.innerHTML='<div class="catalog-mode-switch" role="group" aria-label="Тип недвижимости"><button class="catalog-mode-switch__button is-active" data-listing-mode="new-build" type="button" aria-pressed="true">Новостройки</button><button class="catalog-mode-switch__button" data-listing-mode="secondary" type="button" aria-pressed="false">Вторичная</button></div><div class="catalog-mode-filters catalog-quick-filters" data-v-6fd45cc6></div>';
  const icons=['<path d="M12 21s6-5.4 6-11a6 6 0 1 0-12 0c0 5.6 6 11 6 11Z"/><circle cx="12" cy="10" r="2.25"/>','<circle cx="12" cy="12" r="9"/><path d="M9 16V7.5h3.4a2.75 2.75 0 1 1 0 5.5H9m0 0h5.6m-5.6 2h4.6"/>','<path d="M3 18v-7.5M21 18v-5.5a2 2 0 0 0-2-2h-7.5A2.5 2.5 0 0 0 9 13v2M3 15h18M5.5 10.5h2A1.5 1.5 0 0 1 9 12v3H4v-3a1.5 1.5 0 0 1 1.5-1.5Z"/>'];
  icons.splice(1,0,'<path d="M4 21V8l8-5 8 5v13M2 21h20M9 21v-6h6v6M8 9h1m6 0h1M8 12h1m6 0h1"/>');
  ['Локация','Тип','Стоимость','Спальни'].forEach((label,i)=>{
    const item=document.createElement('div');item.className='catalog-quick-filters__item';item.setAttribute('data-v-6fd45cc6','');
    item.innerHTML='<button class="catalog-quick-filters__button" data-v-6fd45cc6 type="button" aria-expanded="false" aria-haspopup="dialog"><span class="catalog-quick-filters__content"><span class="catalog-quick-filters__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+icons[i]+'</svg></span><span class="catalog-quick-filters__label" data-v-6fd45cc6><span class="catalog-quick-filters__caption">'+label+'</span></span></span><span class="catalog-quick-filters__chevron" data-v-6fd45cc6 aria-hidden="true"></span></button>';
    one('.catalog-mode-filters',toolbar).append(item);
  });
  const detailed=document.createElement('button');detailed.type='button';detailed.className='catalog-mode-detailed-filters';detailed.setAttribute('aria-label','Подробные фильтры');
  detailed.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6h3m4 0h9M4 12h8m4 0h4M4 18h4m4 0h8" stroke="currentColor" stroke-width="1.15"/><circle cx="9" cy="6" r="2" stroke="currentColor" stroke-width="1.15"/><circle cx="14" cy="12" r="2" stroke="currentColor" stroke-width="1.15"/><circle cx="10" cy="18" r="2" stroke="currentColor" stroke-width="1.15"/></svg><span class="catalog-mode-detailed-filters__label catalog-mode-detailed-filters__label--desktop">Все фильтры</span><span class="catalog-mode-detailed-filters__label catalog-mode-detailed-filters__label--mobile">Фильтры</span>';
  detailed.addEventListener('click',e=>window.BARNES_OPEN_FILTER?.(e.currentTarget));toolbar.append(sort,detailed);header.after(toolbar);
  const setMode=mode=>{list.dataset.activeMode=mode;all('.catalog-mode-switch__button',toolbar).forEach(b=>{const active=b.dataset.listingMode===mode;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active));});all('.catalog-grid__item',list).forEach(item=>item.hidden=item.dataset.listingMode!==mode);};
  all('.catalog-mode-switch__button',toolbar).forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.listingMode)));setMode('new-build');list.dataset.modeReady='true';
  document.addEventListener('barnes:filters-apply',()=>{const market=window.BarnesFilters?.getState().market;if(market&&market!==list.dataset.activeMode)setMode(market);});
  [['.catalog-best-offers__title','Новые проекты'],['.catalog-map__title','География'],['.catalog-grid__title','Каталог'],['.departments-section__title','Направления'],['.catalog-faq__title','Экспертиза BARNES']].forEach(([selector,text])=>{const heading=one(selector);if(!heading)return;const p=document.createElement('p');p.className='catalog-section-eyebrow';p.textContent=text;heading.before(p);});
  all('.catalog-intro__details h3').forEach(h=>{const e=document.createElement('h4');e.innerHTML=h.innerHTML;h.replaceWith(e);});all('.catalog-intro__details h2').forEach(h=>{const e=document.createElement('h3');e.innerHTML=h.innerHTML;h.replaceWith(e);});
  const base=new URL('../kurortnaya/assets/',new URL('node-catalog.js',document.currentScript.src));
  const change=(selector,file)=>all(selector).forEach(img=>{img.src=new URL(file,base).href;img.removeAttribute('srcset');});
  change('.catalog-consultation__image','denis-perkovsky-cutout.png');
  change('.catalog-contact__image','cta-contact-resort-lounge.webp');
  ['consultation','contact'].forEach(prefix=>{const form=one('.catalog-'+prefix+'__form'),methods=one('.catalog-'+prefix+'__methods');if(form&&methods)form.prepend(methods);});
  window.BARNES_ENHANCE_CONTACT_METHODS?.();
  change('.catalog-consultation__mobile-photo img,.catalog-contact__mobile-photo img,.catalog-contact__expert-photo img,.floating-expert__avatar img','denis-perkovsky-interior-hq.webp');
})();
