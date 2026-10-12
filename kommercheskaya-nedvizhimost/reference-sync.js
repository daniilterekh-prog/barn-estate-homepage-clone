/* Latest first-degree components, with commercial data/configuration only. */
(async () => {
  const load = src => new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=src;script.onload=resolve;script.onerror=reject;document.body.append(script);});
  const styles = href => new Promise((resolve,reject)=>{const link=document.createElement('link');link.rel='stylesheet';link.href=href;link.onload=resolve;link.onerror=reject;document.head.append(link);});
  const template=document.createElement('template');
  template.innerHTML=document.getElementById('source-filters').innerHTML;
  const modal=template.content.firstElementChild;
  modal.classList.add('resort-filters');modal.id='commercial-shared-filters';modal.hidden=true;
  const chips=[...modal.querySelectorAll('.ui-checkbox--chip input')];
  chips.forEach((input,index)=>input.name=index<11?'propertyTypes':'priceRanges');
  [...modal.querySelectorAll('.hero-filter-panel-content__range-input')].forEach((input,index)=>input.name=['priceMin','priceMax','areaMin','areaMax'][index]);
  const trophy=modal.querySelector('.ui-switch input');trophy.name='features';trophy.value='trophy';
  window.BarnesFilterTemplate=modal.outerHTML;
  const types=chips.slice(0,11).map(input=>({value:input.value,label:input.closest('label').textContent.trim()}));
  window.BarnesCommercialTypes=types;
  window.BarnesQuickConfig=[
    {title:'Тип',key:'propertyTypes',reset:'Любой тип',choices:types.map(t=>t.label),values:types.map(t=>t.value)},
    {title:'Стоимость',key:'priceRanges',reset:'Любая',choices:['до 50 млн ₽','50 – 100 млн ₽','100 – 200 млн ₽','от 200 млн ₽'],values:['50m','50-100m','100-200m','200m+']},
    {title:'Площадь',key:'areaMax',reset:'Любая',range:{min:'areaMin',max:'areaMax',unit:'м²'}},
    {title:'Район',key:'districts',reset:'Все районы',choices:['Академический','Алексеевский','Арбат','Аэропорт','Басманный','Беговой','Бутырский','Войковский','Гагаринский','Головинский','Даниловский','Донской','Дорогомилово','Замоскворечье','Западное Дегунино','Красносельский','Крылатское','Кунцево','Левобережный','Ломоносовский','Марфино','Марьина Роща','Мещанский','Митино','Можайский','Обручевский','Отрадное','Очаково-матвеевское','Покровское-Стрешнево','Пресненский','Проспект Вернадского','Раменки','Савёловский','Свиблово','Сокол','Сокольники','Строгино','Таганский','Тверской','Тропарёво-Никулино','Филевский парк','Фили-Давыдково','Хамовники','Ховрино','Хорошёво-Мнёвники','Хорошёвский','Щукино','Южнопортовый','Якиманка']}
  ];
  const districtIcon='<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s6-5.4 6-11a6 6 0 1 0-12 0c0 5.6 6 11 6 11Z" stroke="currentColor" stroke-width="1.35"/><circle cx="12" cy="10" r="2.25" stroke="currentColor" stroke-width="1.35"/></svg>';
  const quickList=document.querySelector('.catalog-mode-filters');
  const districtItem=quickList.querySelector('.catalog-quick-filters__item').cloneNode(true);districtItem.classList.add('commercial-district');
  districtItem.querySelector('.catalog-quick-filters__icon').innerHTML=districtIcon;
  quickList.append(districtItem);
  await styles('owner-footer.css');
  await load('reference-footer.js');
  const footerTemplate=document.createElement('template');footerTemplate.innerHTML=window.CommercialReferenceFooter;
  document.querySelector('.site-footer').replaceWith(footerTemplate.content.firstElementChild);
  document.querySelector('.site-footer__callback-btn').addEventListener('click',event=>window.CommercialOpenCallback(event.currentTarget));
  await load('filters-modal.js');
  document.querySelectorAll('[data-commercial-filters]').forEach(button=>button.setAttribute('aria-controls',modal.id));
  // Preserve the front commercial zero-results capture; do not borrow resort projects.
  window.BarnesMapProjects=[];
  await load('map-fullscreen.js');
  const districtField=document.createElement('label');districtField.className='map-browser__field commercial-district';
  districtField.innerHTML=districtIcon+'<input data-filter="district" aria-label="Район" type="text">';
  document.querySelector('.map-browser__filters').prepend(districtField);
  await load('quick-filters.js');
  await load('brand-filters.js');
  // Purchase/rent replaces residential markets, sharing selection with the map.
  function dealSwitch(context) {
    const group=document.createElement('div');
    group.className=context==='listing'?'catalog-mode-switch':'map-browser__market';
    group.setAttribute('role','group');group.setAttribute('aria-label','Тип сделки');
    for(const [value,label] of [['purchase','Покупка'],['rent','Аренда']]){
      const button=document.createElement('button');button.type='button';button.textContent=label;
      button.className='catalog-mode-switch__button';button.dataset.commercialDeal=value;
      button.addEventListener('click',()=>window.BarnesFilters.patch({dealType:value}));group.append(button);
    }
    return group;
  }
  document.querySelector('.catalog-mode-toolbar').prepend(dealSwitch('listing'));
  document.querySelector('.map-browser__filters').prepend(dealSwitch('map'));
  function syncDeal(){const selected=window.BarnesFilters.getState().dealType||'purchase';document.querySelectorAll('[data-commercial-deal]').forEach(button=>{const active=button.dataset.commercialDeal===selected;button.setAttribute('aria-pressed',String(active));button.classList.toggle('is-active',active);});}
  document.addEventListener('barnes:filters-apply',syncDeal);syncDeal();
  await styles('reference-sync.css');
  const request=document.createElement('button');request.type='button';request.className='catalog-sticky__request catalog-sticky__callback commercial-mobile-request';request.textContent='Оставить заявку';request.setAttribute('aria-haspopup','dialog');
  const desktopRequest=document.querySelector('.catalog-page-nav__request');
  request.addEventListener('click',()=>{desktopRequest.click();const channel=document.querySelector('.catalog-feedback-modal [data-channel="Звонок"]');channel?.click();});
  document.querySelector('.catalog-sticky__contact-toggle').after(request);
  // Use the reference sticky-header structure, not source navigation aliases.
  const sticky=document.querySelector('.catalog-sticky');
  const inner=sticky.querySelector('.catalog-sticky__inner');
  const list=sticky.querySelector('.catalog-sticky__list');
  const navigation=document.createElement('nav');navigation.className='catalog-sticky__nav';navigation.setAttribute('aria-label','Навигация по странице');
  const actions=document.createElement('div');actions.className='catalog-sticky__mobile-actions';
  actions.append(sticky.querySelector('.catalog-sticky__contact-toggle'),request);
  inner.prepend(navigation);navigation.append(list,actions);
  const targets=['#commercial-selection','.catalog-grid','.catalog-intro','.catalog-faq'];
  const links=[...list.querySelectorAll('.catalog-sticky__link')].map((old,index)=>{
    const link=document.createElement('a');link.className='catalog-sticky__link';link.textContent=['Проекты','Каталог','О BARNES','Вопросы'][index];
    const section=document.querySelector(targets[index]);
    if(section){if(!section.id)section.id=['catalog-new-starts','catalog-grid','catalog-intro','catalog-faq'][index];link.href='#'+section.id;}
    link.addEventListener('click',event=>{event.preventDefault();section?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});});
    old.replaceWith(link);link.parentElement.className='catalog-sticky__item';return link;
  });
  const brand=sticky.querySelector('.catalog-sticky__brand');
  brand.querySelector('.catalog-sticky__phone')?.remove();
  const messengers=document.createElement('nav');messengers.className='catalog-sticky__messengers';messengers.setAttribute('aria-label','Способы связи');
  sticky.querySelector('.catalog-sticky__contact-panel').querySelectorAll('a').forEach(link=>messengers.append(link.cloneNode(true)));
  brand.append(messengers);
  sticky.querySelector('.catalog-page-nav__mobile-phone')?.remove();
  sticky.querySelectorAll('*').forEach(element=>[...element.classList].filter(name=>name.startsWith('catalog-page-nav__')).forEach(name=>element.classList.remove(name)));
  sticky.classList.remove('catalog-page-nav');
  function highlightSticky(){let current=0;targets.forEach((selector,index)=>{const section=document.querySelector(selector);if(section&&section.getBoundingClientRect().top<=sticky.offsetHeight+40)current=index;});links.forEach((link,index)=>{link.classList.toggle('catalog-sticky__link--active',index===current);if(index===current)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});}
  addEventListener('scroll',highlightSticky,{passive:true});highlightSticky();
  // Match the common header phone / menu placement without changing links.
  const header=document.querySelector('.site-header');header.classList.add('catalog-header-ready');
  header.querySelector('.site-header__mobile-phone')?.classList.add('catalog-primary-call');
  document.body.dataset.commercialReferenceReady='true';
})().catch(error=>console.error('Commercial reference initialization failed:',error));
