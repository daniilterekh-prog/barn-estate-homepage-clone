/* One breadcrumb component for the current pages. It never edits the header. */
(()=>{
 'use strict';
 if(window.BarnPageBreadcrumbs)return;
 const script=document.currentScript,key=script.dataset.page;
 const root=new URL('../',script.src),home=new URL('exact-2026-10-21/',root).href;
 const titles={home:'Главная',media:'Медиа',partners:'Амбассадорам','owner-rent':'Собственникам — аренда','owner-sale':'Собственникам — продажа',city:'Городская недвижимость Москвы',country:'Загородная недвижимость Москвы',international:'Зарубежная недвижимость',commercial:'Коммерческая недвижимость',resort:'Курортная недвижимость',catalog:'Каталог недвижимости',favorites:'Избранное',lot:'Лот'};
 if(!(key in titles))return;
 const nav=document.createElement('nav');nav.className='page-breadcrumbs';nav.dataset.barnBreadcrumbs='';nav.dataset.page=key;nav.dataset.tone=['catalog','favorites','lot'].includes(key)?'light':'dark';nav.setAttribute('aria-label','Хлебные крошки');
 const list=document.createElement('ol');nav.append(list);
 const clean=s=>s.replace(/\s+/g,' ').trim();
 let current,observedHeader=null,lastTop=120,scheduled=false;
 function item(text,href){const li=document.createElement('li');if(list.children.length){const separator=document.createElement('span');separator.className='page-breadcrumbs__separator';separator.setAttribute('aria-hidden','true');separator.textContent='/';li.append(separator)}const label=document.createElement(href?'a':'span');label.textContent=text;if(href)label.href=href;else{label.setAttribute('aria-current','page');current=label}li.append(label);list.append(li)}
 if(key!=='home')item('Главная',home);
 if(key==='lot')item('Каталог недвижимости',new URL('katalog-nedvizhimosti/',root).href);
 item(titles[key]);
 function position(){
  scheduled=false;if(!nav.isConnected)return;
  const canvas=document.body.getBoundingClientRect(),header=document.querySelector('.site-header');
  nav.style.width=Math.min(1920,canvas.width)+'px';nav.style.left=(canvas.left+Math.max(0,(canvas.width-1920)/2))+'px';
  const mobile=innerWidth<=540;
  nav.style.visibility=mobile&&scrollY>4?'hidden':'';
  let headerLayer=0;
  if(mobile)for(let node=header;node&&node!==document.body;node=node.parentElement)headerLayer=Math.max(headerLayer,parseInt(getComputedStyle(node).zIndex,10)||0);
  nav.style.zIndex=mobile?String(headerLayer+1):'';
  const offset=mobile?-nav.offsetHeight-1:16;
  if(header){if(observedHeader!==header){resize.disconnect();resize.observe(header);observedHeader=header}if(scrollY<4){lastTop=header.getBoundingClientRect().bottom+offset;}else if(!nav.style.top){lastTop=header.getBoundingClientRect().height+offset;}}
  nav.style.top=lastTop+'px';
 }
 function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(position)}}
 const resize=new ResizeObserver(schedule);
 function refresh(){
  for(const original of document.querySelectorAll('.breadcrumbs,.catalog-breadcrumbs,.favorites-breadcrumbs')){
   if(original.closest('.site-header,.page-breadcrumbs')||original.hasAttribute('data-barn-crumb-source'))continue;
   original.setAttribute('data-barn-crumb-source','');original.setAttribute('aria-hidden','true');original.inert=true;
  }
  if(key==='lot'){const title=clean(document.querySelector('h1')?.textContent||titles.lot);if(clean(current.textContent)!==title)current.textContent=title;current.title=title;}
  schedule();
 }
 document.body.append(nav);
 const mutations=new MutationObserver(refresh);mutations.observe(document.body,{childList:true,subtree:true});
 addEventListener('resize',schedule,{passive:true});addEventListener('scroll',()=>{if(scrollY<4||innerWidth<=540)schedule()},{passive:true});
 // Normal breadcrumb navigation precedes archived preview-router click guards.
 // Modified clicks keep the browser's native new-tab/window behaviour.
 addEventListener('click',event=>{const anchor=event.target.closest?.('.page-breadcrumbs a[href]');if(!anchor||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();event.stopImmediatePropagation();location.assign(anchor.href)},true);
 window.BarnPageBreadcrumbs={refresh};refresh();
})();
