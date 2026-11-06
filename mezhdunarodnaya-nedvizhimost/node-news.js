/* NewsSection markup/options from the approved homepage. Shared BarnSplide 4.1.4/MIT. */
(()=>{
 'use strict';
 const body=document.body;if(body.dataset.nodeNewsBootstrap)return;body.dataset.nodeNewsBootstrap='true';
 function mount(){
  const section=document.querySelector('.node-news');
  if(!body.isConnected||!section||section.dataset.nodeNewsReady)return;
  if(!window.BarnSplide){setTimeout(mount,50);return;}
  const slider=section.querySelector('.node-news__slider');
  const previous=section.querySelectorAll('.node-news__nav-btn')[0],next=section.querySelectorAll('.node-news__nav-btn')[1];
  const carousel=new window.BarnSplide(slider,{type:'slide',perPage:3,perMove:1,gap:'40px',arrows:false,pagination:false,drag:true,snap:true,trimSpace:false,breakpoints:{1024:{perPage:2},560:{perPage:1,gap:'24px'},540:{perPage:1,gap:'24px',pagination:true}},i18n:{prev:'Предыдущие новости',next:'Следующие новости',first:'Первые новости',last:'Последние новости',slideX:'Перейти к новости %s',pageX:'Перейти на страницу %s',carousel:'карусель',slide:'новость',select:'Выбрать новость',slideLabel:'%s из %s'}});
  function sync(){previous.disabled=carousel.index===0;next.disabled=carousel.index>=carousel.Components.Controller.getEnd();}
  carousel.on('mounted move updated resized',sync);carousel.mount();previous.addEventListener('click',()=>carousel.go('<'));next.addEventListener('click',()=>carousel.go('>'));
  section.nodeNewsCarousel=carousel;section.dataset.nodeNewsReady='true';document.dispatchEvent(new CustomEvent('barnes:node-news-ready'));
 }
 mount();
})();
