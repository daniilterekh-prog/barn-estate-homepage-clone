/* One page type, one renderer. Object-specific values come from lot-data.js. */
(function(){
  'use strict';
  const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const money=v=>new Intl.NumberFormat('ru-RU').format(v).replace(/\u00a0/g,' ')+' ₽';
  function text(selector,value,root=document){qa(selector,root).forEach(e=>{e.textContent=value??''})}
  function image(selector,value,root=document){if(!value)return;qa(selector,root).forEach(e=>{e.src=value.src;e.alt=value.alt||''})}
  function link(selector,value,root=document){if(!value)return;qa(selector,root).forEach(e=>{const content=[...e.childNodes].find(n=>n.nodeType===3&&n.textContent.trim());if(content)content.textContent=value.text;else e.textContent=value.text;e.href=value.href})}
  function list(selector,items,render,root=document){const parent=q(selector,root),sample=parent?.firstElementChild;if(!parent||!sample)return;const nodes=(items||[]).map((item,index)=>{const node=sample.cloneNode(true);render(node,item,index);return node});parent.replaceChildren(...nodes)}
  function bind(root,lot){
    text('.lot-hero__title,.lot-complex-bar__name,.lot-gallery-modal__title',lot.title,root);
    text('.lot-hero__intro',lot.description,root);
    text('.lot-hero__price,.lot-gallery-modal__price',lot.displayPrice||(lot.priceRub==null?'Цена по запросу':money(lot.priceRub)),root);
    image('.lot-hero__image',lot.cover,root);
    const b=lot.broker;
    if(b){image('.lot-hero__broker-photo,.lot-complex-bar__manager-photo,.lot-gallery-modal__broker-photo',b.photo,root);link('.lot-hero__broker-name,.lot-gallery-modal__broker-name',{text:b.name,href:b.url},root);text('.lot-complex-bar__manager-name',b.name,root);text('.lot-hero__broker-role,.lot-gallery-modal__broker-role',b.role,root);link('.lot-hero__broker-phone,.lot-complex-bar__manager-phone,.lot-gallery-modal__broker-phone',{text:b.phone,href:'tel:'+b.phone.replace(/[^+\d]/g,'')},root)}
    else qa('.lot-hero__broker,.lot-complex-bar__manager,.lot-gallery-modal__broker',root).forEach(e=>e.remove());
    list('.lot-hero__highlights',lot.highlights,(node,value)=>node.lastElementChild.textContent=value,root);
    list('.lot-hero__price-meta',lot.badges,(node,value)=>node.textContent=value,root);
    list('.lot-gallery-modal__highlights',lot.highlights,(node,value)=>node.lastElementChild.textContent=value,root);
    list('.lot-gallery-modal__price-meta',lot.galleryBadges||lot.badges,(node,value)=>node.textContent=value,root);
    list('.lot-gallery-modal__stage',lot.gallery,(node,item)=>image('img',item,node),root);
    text('.lot-gallery-modal__counter','1/'+(lot.gallery?.length||0),root);
    if(lot.complex){list('.lot-about-complex__grid',lot.complex.cards,(node,item)=>{node.className='lot-about-complex__item--'+(item.span||'half')+' lot-about-complex__item';image('img',item.image,node);text('.lot-about-complex__label',item.label,node)},root)}
    if(lot.developer){text('.lot-developer__name',lot.developer.name,root);text('.lot-developer__text',lot.developer.description,root);image('.lot-developer__logo',lot.developer.logo,root);const a=q('.lot-developer__cta',root);if(a)a.href=lot.developer.url}
    if(lot.construction){list('.construction__grid',lot.construction.cards,(node,item)=>{node.className='construction__item--'+(item.span||'half')+' construction__item';image('img',item.image,node);text('.construction__year',item.period,node)},root);list('.construction-gallery-modal__stage',lot.construction.photos,(node,item)=>image('img',item,node),root);text('.construction-gallery-modal__counter','1/'+lot.construction.photos.length,root)}
    if(!lot.map)qa('.surroundings-map',root).forEach(e=>e.remove());
    if(lot.map?.galleryMarkup)qa('.lot-gallery-modal__map',root).forEach(e=>e.innerHTML=lot.map.galleryMarkup);
    else{qa('.lot-gallery-modal__map',root).forEach(e=>e.remove());qa('.lot-gallery-modal__tab',root).filter(e=>e.textContent.includes('На карте')).forEach(e=>e.remove())}
  }
  function render(lot){
    if(!lot||!lot.id||!lot.title||!lot.cover?.src)throw new Error('Карточка лота требует id, title и cover.src');
    window.BARNES_LOT_DATA=lot;
    bind(document,lot);
    const crumb=q('.breadcrumbs__link--active');if(crumb)crumb.textContent=lot.title;
    const meta=q('meta[name="description"]');if(meta)meta.content=lot.seo?.description||lot.description||lot.title;
    const ogTitle=q('meta[property="og:title"]'),ogDescription=q('meta[property="og:description"]');if(ogTitle)ogTitle.content=lot.seo?.ogTitle||lot.title;if(ogDescription)ogDescription.content=lot.seo?.ogDescription||lot.description||lot.title;
    const schema=q('script[type="application/ld+json"]');if(schema){if(lot.seo?.structuredData)schema.textContent=JSON.stringify(lot.seo.structuredData);else schema.remove()}
    document.title=lot.pageTitle||'Недвижимость - BARNES';
    for(const [field,selector]of [['complex','.lot-about-complex'],['developer','.lot-developer'],['construction','.construction'],['mortgage','.mortgage']])if(!lot[field])q(selector)?.remove();
    qa('template[id^="source-"]').forEach(template=>bind(template.content,lot));
    if(lot.mortgage){qa('.mortgage__field').forEach((field,index)=>{const cfg=lot.mortgage.fields[index],handle=q('[role="slider"]',field);if(!cfg||!handle)return;const pct=(cfg.value-cfg.min)/(cfg.max-cfg.min)*100;handle.setAttribute('aria-valuemin',cfg.min);handle.setAttribute('aria-valuemax',cfg.max);handle.setAttribute('aria-valuenow',cfg.value);handle.setAttribute('aria-valuetext',cfg.value);handle.style.left=pct+'%';q('.ui-range-slider__fill',field).style.width=pct+'%';text('.mortgage__field-value',cfg.displayValue,field)});qa('.mortgage__table tbody tr').forEach((row,index)=>{const cfg=lot.mortgage.offers[index];if(cfg)qa('td',row).slice(0,4).forEach((cell,i)=>cell.textContent=cfg[i])})}
  }
  window.renderBarnesLot=render;
  render(window.BARNES_LOT_DATA);
}());
