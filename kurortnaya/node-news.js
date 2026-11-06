/* NewsSection markup/options from the approved homepage. Shared BarnSplide 4.1.4/MIT. */
(()=>{
 'use strict';
 const body=document.body;if(body.dataset.nodeNewsBootstrap)return;body.dataset.nodeNewsBootstrap='true';
 const css=document.createElement('link');css.rel='stylesheet';css.href=new URL('node-news.css?v=369da06e50cb',document.currentScript.src).href;let styled=false;css.onload=()=>{styled=true;mount();};document.head.append(css);
 /* TEMPLATE START */const templateMarkup="<section class=\"node-news\"><div class=\"base-container\"><div class=\"node-news__inner\"><div class=\"node-news__header\"><p class=\"node-news__eyebrow\">Медиа BARN Estate</p><h2 class=\"node-news__title\">Наши новости</h2></div><div class=\"node-news__footer\"><div class=\"node-news__nav\"><button type=\"button\" class=\"node-news__nav-btn\" disabled=\"\" aria-label=\"Предыдущие новости\"><span class=\"ui-icon ui-icon-current node-news__nav-icon\"><svg width=\"11\" height=\"22\" viewBox=\"0 0 11 22\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M9.6582 21.3262L0.658204 10.8262L9.6582 0.326171\" stroke=\"#656462\"></path>\n</svg>\n</span></button><button type=\"button\" class=\"node-news__nav-btn\" disabled=\"\" aria-label=\"Следующие новости\"><span class=\"ui-icon ui-icon-current node-news__nav-icon\"><svg width=\"11\" height=\"22\" viewBox=\"0 0 11 22\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M0.379883 21.3262L9.37988 10.8262L0.379884 0.326171\" stroke=\"#656462\"></path>\n</svg>\n</span></button></div><a class=\"ui-more-link node-news__action\" href=\"https://barn-estate.ru/media/\"><!--[--><span class=\"ui-more-link__label\"><!--[-->Читать все новости<!--]--></span><span class=\"ui-more-link__icon\" aria-hidden=\"true\"><svg viewBox=\"0 0 16 16\" focusable=\"false\"><path d=\"M3 13 13 3M5 3h8v8\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.25\"></path></svg></span><!--]--></a></div></div></div></section>";/* TEMPLATE END */
 function mount(){
  if(!body.isConnected||document.querySelector('.node-news'))return;
  const old=document.querySelector('.news-section'),cards=old&&[...old.querySelectorAll('.news-section__card')];
  if(!styled)return;
  if(!window.BarnSplide||!cards?.length||!document.querySelector('.catalog-mode-toolbar')?.dataset.nodeFiltersReady){setTimeout(mount,50);return;}
  const template=document.createElement('template');template.innerHTML=templateMarkup;const section=template.content.firstElementChild;
  const action=old.querySelector('.news-section__action');if(action?.getAttribute('href'))section.querySelector('.node-news__action').setAttribute('href',action.getAttribute('href'));
  section.querySelector('.node-news__eyebrow').classList.add('home-section-eyebrow');
  const slider=document.createElement('div');slider.className='splide node-news__slider';slider.setAttribute('aria-label','Новости');
  const track=document.createElement('div');track.className='splide__track';const list=document.createElement('ul');list.className='splide__list';track.append(list);slider.append(track);
  for(const card of cards){const item=document.createElement('li');item.className='splide__slide';const copy=card.cloneNode(true);for(const e of[copy,...copy.querySelectorAll('*')]){for(const a of [...e.attributes])if(a.name.startsWith('data-v-')||['style','id','tabindex','aria-hidden'].includes(a.name))e.removeAttribute(a.name);if(e.hasAttribute('class'))e.setAttribute('class',e.getAttribute('class').replaceAll('news-section','node-news'));}item.append(copy);list.append(item);}
  section.querySelector('.node-news__footer').before(slider);old.replaceWith(section);
  const previous=section.querySelectorAll('.node-news__nav-btn')[0],next=section.querySelectorAll('.node-news__nav-btn')[1];
  const carousel=new window.BarnSplide(slider,{type:'slide',perPage:3,perMove:1,gap:'40px',arrows:false,pagination:false,drag:true,snap:true,trimSpace:false,breakpoints:{1024:{perPage:2},560:{perPage:1,gap:'24px'},540:{perPage:1,gap:'24px',pagination:true}},i18n:{prev:'Предыдущие новости',next:'Следующие новости',first:'Первые новости',last:'Последние новости',slideX:'Перейти к новости %s',pageX:'Перейти на страницу %s',carousel:'карусель',slide:'новость',select:'Выбрать новость',slideLabel:'%s из %s'}});
  function sync(){previous.disabled=carousel.index===0;next.disabled=carousel.index>=carousel.Components.Controller.getEnd();}
  carousel.on('mounted move updated resized',sync);carousel.mount();previous.addEventListener('click',()=>carousel.go('<'));next.addEventListener('click',()=>carousel.go('>'));
  section.nodeNewsCarousel=carousel;section.dataset.nodeNewsReady='true';document.dispatchEvent(new CustomEvent('barnes:node-news-ready'));
 }
 mount();
})();
