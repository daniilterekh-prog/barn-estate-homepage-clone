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
    {title:'Площадь',key:'areaMax',reset:'Любая',range:{min:'areaMin',max:'areaMax',unit:'м²'}}
  ];
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
  await load('quick-filters.js');
  await load('brand-filters.js');
  await styles('reference-sync.css');
  const request=document.createElement('button');request.type='button';request.className='catalog-sticky__request catalog-sticky__callback commercial-mobile-request';request.textContent='Оставить заявку';request.setAttribute('aria-haspopup','dialog');
  const desktopRequest=document.querySelector('.catalog-page-nav__request');
  request.addEventListener('click',()=>{desktopRequest.click();const channel=document.querySelector('.catalog-feedback-modal [data-channel="Звонок"]');channel?.click();});
  document.querySelector('.catalog-sticky__contact-toggle').after(request);
  // Match the common header phone / menu placement without changing links.
  const header=document.querySelector('.site-header');header.classList.add('catalog-header-ready');
  header.querySelector('.site-header__mobile-phone')?.classList.add('catalog-primary-call');
  document.body.dataset.commercialReferenceReady='true';
})().catch(error=>console.error('Commercial reference initialization failed:',error));
