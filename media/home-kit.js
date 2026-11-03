/* Connect the approved header contact control after the preserved Nuxt hydration. */
(()=>{
 'use strict';
 const pageRoot=new URL('./',document.currentScript.src);
 const headerNavigation=[{"label":"Москва","url":"https://barn-estate.ru/gorodskaya-nedvizhimost/","children":[{"label":"Вторичная","url":"https://barn-estate.ru/vtorichnaya-nedvizhimost/"},{"label":"Арендовать","url":"https://barn-estate.ru/arendovat/"},{"label":"Новостройки","url":"https://barn-estate.ru/novostroyki/"},{"label":"Жилые комплексы","url":"https://barn-estate.ru/zhilye-kompleksy/"},{"label":"Квартиры","url":"https://barn-estate.ru/gorodskaya-nedvizhimost/kvartiry/"},{"label":"Апартаменты","url":"https://barn-estate.ru/gorodskaya-nedvizhimost/apartamenty/"},{"label":"Пентхаусы","url":"https://barn-estate.ru/kupit-penthausy-v-moskve/"},{"label":"Застройщики","url":"https://barn-estate.ru/zastroyshchiki/"}]},{"label":"Загородная","url":"https://barn-estate.ru/zagorodnaya-nedvizhimost/","children":[{"label":"Купить","url":"https://barn-estate.ru/zagorodnaya-nedvizhimost/"},{"label":"Снять","url":"https://barn-estate.ru/snyat-zagorodnuyu-nedvizhimost/"},{"label":"Коттеджные поселки","url":"https://barn-estate.ru/kottedzhnye-poselki/"}]},{"label":"Коммерческая","url":"https://barn-estate.ru/kommercheskaya-nedvizhimost/","children":[{"label":"Купить","url":"https://barn-estate.ru/kommercheskaya-nedvizhimost/"},{"label":"Снять","url":"https://barn-estate.ru/kommercheskaya-nedvizhimost/arendovat/"},{"label":"Здания","url":"https://barn-estate.ru/kommercheskaya-nedvizhimost/zdanie/"},{"label":"Бизнес-центры","url":"https://barn-estate.ru/kommercheskaya-nedvizhimost/business-center/"},{"label":"Особняки","url":"https://barn-estate.ru/kommercheskaya-nedvizhimost/osobnyak/"},{"label":"Арендный бизнес","url":"https://barn-estate.ru/kommercheskaya-nedvizhimost/arendnyj-biznes/"}]},{"label":"Курортная","url":"https://barn-estate.ru/kurortnaya/","children":[{"label":"Инвестиции","url":"https://barn-estate.ru/media/tag/investitsii-v-kurortnuyu-nedvizhimost-rossii/"},{"label":"Алтай","url":"https://barn-estate.ru/altai/"},{"label":"Архыз","url":"https://barn-estate.ru/arhyz/"},{"label":"Сочи","url":"https://barn-estate.ru/sochi/"}]},{"label":"Зарубежная","url":"https://barn-estate.ru/mezhdunarodnaya-nedvizhimost/","children":[{"label":"ОАЭ","url":"https://barn-estate.ru/oae/"},{"label":"Турция","url":"https://barn-estate.ru/mezhdunarodnaya-nedvizhimost/turtsiya/"},{"label":"Таиланд","url":"https://barn-estate.ru/tailand/"},{"label":"Бали","url":"https://barn-estate.ru/zhilye-kompleksy-indonesia/"},{"label":"Испания","url":"https://barn-estate.ru/ispaniya/"},{"label":"Италия","url":"https://barn-estate.ru/italiya/"},{"label":"Португалия","url":"https://barn-estate.ru/portugaliya/"},{"label":"Франция","url":"https://barn-estate.ru/frantsiya/"},{"label":"Оман","url":"https://barn-estate.ru/oman/"},{"label":"Жилые комплексы","url":"https://barn-estate.ru/mezhdunarodnaya-nedvizhimost-zhilye-kompleksy/"}]},{"label":"Санкт-Петербург","url":"https://barnes-spb.ru/","children":[{"label":"Вторичная","url":"https://barnes-spb.ru/gorodskaya-nedvizhimost/vtorichnaya-nedvizhimost/"},{"label":"Новостройки","url":"https://barnes-spb.ru/gorodskaya-nedvizhimost/novostroyki/"},{"label":"Загородная","url":"https://barnes-spb.ru/zagorodnaya-nedvizhimost/"},{"label":"Коммерческая","url":"https://barnes-spb.ru/kommercheskaya-nedvizhimost/"},{"label":"Эксклюзив","url":"https://barnes-spb.ru/exclusive/"},{"label":"Апартаменты","url":"https://barnes-spb.ru/gorodskaya-nedvizhimost/filter/type_immovables-is-apartamenty/"},{"label":"Пентхаус","url":"https://barnes-spb.ru/gorodskaya-nedvizhimost/filter/type_immovables-is-penthausy/"}]},{"label":"Медиа","url":"https://barn-estate.ru/media/","children":[{"label":"Блог","url":"https://barn-estate.ru/media/blog/"},{"label":"Новости","url":"https://barn-estate.ru/media/novosti/"},{"label":"Вебинары и видео","url":"https://barn-estate.ru/media/vebinary-i-video/"},{"label":"Аналитика рынка","url":"https://barn-estate.ru/media/analitika/"},{"label":"Искусство жить","url":"https://barn-estate.ru/media/stil-zhizni/"},{"label":"Кейсы","url":"https://barn-estate.ru/media/cases/"},{"label":"Журнал","url":"https://barn-estate.ru/zhurnaly/"}]},{"label":"О BARN Estate","url":"https://barn-estate.ru/mir-barn-estate/","children":[{"label":"Контакты","url":"https://barn-estate.ru/contacts/"},{"label":"Партнерам","url":"https://barn-estate.ru/for-partners/"},{"label":"BARN Estate Club","url":"https://barn-estate.ru/barn-estate-club/"},{"label":"СМИ о нас","url":"https://barn-estate.ru/novosti/smi-o-nas/"},{"label":"Мероприятия","url":"https://barn-estate.ru/novosti/meropriyatiya/"},{"label":"Команда","url":"https://barn-estate.ru/team/"},{"label":"Вакансии","url":"https://barn-estate.ru/vacancies/"},{"label":"Стиль жизни","url":"https://barn-estate.ru/stily-zhizni/"}]},{"label":"Собственникам","url":"https://barn-estate.ru/sobstvennikam/","children":[{"label":"Амбассадоры","url":"https://barn-estate.ru/for-partners/"},{"label":"Продажа","url":"https://barn-estate.ru/prodazha_sobstvennikam/"},{"label":"Аренда","url":"https://barn-estate.ru/arenda_sobstvennikam/"}]}];
 let counter=0;
 function annotate(root){
  for(const dialog of root.querySelectorAll('[role="dialog"]')){
   const heading=dialog.querySelector('h2,h3');
   if(heading&&!dialog.hasAttribute('aria-labelledby')){
    if(!heading.id)heading.id='media-dialog-title-'+(++counter);
    dialog.setAttribute('aria-labelledby',heading.id);
   }
  }
  for(const input of root.querySelectorAll('input:not([type="hidden"])')){
   if(![...(input.labels||[])].some(label=>label.textContent.trim())&&!input.hasAttribute('aria-label'))input.setAttribute('aria-label',input.placeholder||(input.type==='checkbox'?'Согласие на обработку персональных данных':'Контакт'));
  }
 }
 function setupDropdowns(nav){
  const entries=[...nav.querySelectorAll('.media-reference-item')].map(item=>({item,trigger:item.querySelector(':scope > a'),panel:item.querySelector(':scope > ul'),timer:null}));
  let suppressFocus=false;
  function close(entry,restore=false){
   clearTimeout(entry.timer);entry.panel.hidden=true;entry.trigger.setAttribute('aria-expanded','false');
   if(restore){suppressFocus=true;entry.trigger.focus({preventScroll:true});suppressFocus=false;}
  }
  const closeAll=()=>entries.forEach(entry=>close(entry));
  function open(entry){
   if(!matchMedia('(min-width:1281px)').matches)return;
   for(const other of entries)if(other!==entry)close(other);
   clearTimeout(entry.timer);entry.panel.hidden=false;entry.trigger.setAttribute('aria-expanded','true');
   entry.panel.style.left='0px';const bounds=entry.panel.getBoundingClientRect(),limit=document.documentElement.clientWidth-12;
   if(bounds.right>limit)entry.panel.style.left=(limit-bounds.right)+'px';
  }
  for(const entry of entries){
   let touchPending=false,touchWasOpen=false;
   entry.trigger.addEventListener('pointerdown',event=>{if(event.pointerType==='touch'){touchPending=true;touchWasOpen=!entry.panel.hidden;}});
   entry.trigger.addEventListener('pointercancel',()=>{touchPending=false;});
   entry.item.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch')open(entry);});
   entry.item.addEventListener('pointerleave',()=>{if(!entry.item.contains(document.activeElement))entry.timer=setTimeout(()=>close(entry),140);});
   entry.item.addEventListener('focusin',()=>{if(!suppressFocus)open(entry);});
   entry.item.addEventListener('focusout',()=>setTimeout(()=>{if(!entry.item.contains(document.activeElement))close(entry);},0));
   entry.item.addEventListener('keydown',event=>{
    const links=[...entry.panel.querySelectorAll('a')],index=links.indexOf(document.activeElement);
    if(event.key==='Escape'&&!entry.panel.hidden){event.preventDefault();event.stopPropagation();close(entry,true);}
    if(event.key==='ArrowDown'||event.key==='ArrowUp'){
     event.preventDefault();open(entry);const next=index<0?(event.key==='ArrowDown'?0:links.length-1):(index+(event.key==='ArrowDown'?1:-1)+links.length)%links.length;links[next]?.focus();
    }
   });
   entry.trigger.addEventListener('click',event=>{if(touchPending){touchPending=false;if(!touchWasOpen){event.preventDefault();open(entry);}}});
  }
  document.addEventListener('pointerdown',event=>{if(!nav.contains(event.target))closeAll();});
  window.addEventListener('resize',closeAll);window.addEventListener('scroll',closeAll,{passive:true});
 }
 function ready(){
  const nuxt=document.querySelector('#__nuxt')?.__vue_app__?.config.globalProperties.$nuxt;
  if(!nuxt||nuxt.isHydrating){setTimeout(ready,30);return;}
  // Remove the redundant digest block after Nuxt hydration. Keep the hero
  // subscription shortcut pointing to the shared newsletter below the page.
  document.querySelector('.media-subscribe')?.remove();
  const newsletter=document.querySelector('.newsletter-cta');
  if(newsletter)newsletter.id='subscribe';
  const header=document.querySelector('.site-header');
  if(header&&!header.querySelector('.media-reference-nav')){
   const nav=document.createElement('nav');nav.className='media-reference-nav';nav.setAttribute('aria-label','Направления BARN Estate');
   const list=document.createElement('ul');
   for(const [index,entry] of headerNavigation.entries()){
    const item=document.createElement('li'),link=document.createElement('a');item.className='media-reference-item';
    link.textContent=entry.label;link.href=entry.label==='Медиа'?pageRoot.href:entry.url;
    if(entry.label==='Медиа')link.setAttribute('aria-current','page');
    const panel=document.createElement('ul');panel.className='media-reference-subnav';panel.id='media-reference-subnav-'+index;panel.hidden=true;
    link.setAttribute('aria-controls',panel.id);link.setAttribute('aria-expanded','false');
    for(const child of entry.children){const row=document.createElement('li'),anchor=document.createElement('a');anchor.textContent=child.label;anchor.href=child.url;row.append(anchor);panel.append(row);}
    item.append(link,panel);list.append(item);
   }
   nav.append(list);header.querySelector('.site-header__inner').append(nav);
   setupDropdowns(nav);
  }
  document.body.dataset.homeSpacingReady='true';
  window.__barnesHeaderContacts?.refresh();
  // Explicit section-heading roles from the homepage kit. A single wrapper
  // prevents the section gap being added between the eyebrow and its H2.
  const headings=[
   ['.media-weekly__title','Редакционный выбор'],
   ['.media-market__title','Направления BARN Estate'],
   ['.media-fresh__title','Медиа BARN Estate'],
   ['.media-analytics__title','Аналитика BARN Estate'],
   ['.media-cta-banner__title','Консультация BARN Estate'],
   ['.media-library__title','Издания BARN Estate']
  ];
  for(const [selector,text] of headings){
   const heading=document.querySelector(selector);if(!heading||heading.closest('.media-kit-heading'))continue;
   const group=document.createElement('div');group.className='media-kit-heading';
   const eyebrow=document.createElement('p');eyebrow.className='home-section-eyebrow';eyebrow.textContent=text;
   heading.before(group);group.append(eyebrow,heading);
  }
  for(const [selector,headingSelector,text] of [
   ['.team-section__intro','.team-section__title','Эксперты по недвижимости'],
   ['.newsletter-cta__copy','h2','Рассылка BARN Estate']
  ]){
   const parent=document.querySelector(selector),heading=parent?.querySelector(headingSelector);
   if(heading&&!parent.querySelector('.home-section-eyebrow')){
    const eyebrow=document.createElement('p');eyebrow.className='home-section-eyebrow';eyebrow.textContent=text;heading.before(eyebrow);
   }
  }
  annotate(document);
  new MutationObserver(()=>annotate(document)).observe(document.body,{childList:true,subtree:true});
  document.body.dataset.mediaKitReady='true';
 }
 ready();
})();
