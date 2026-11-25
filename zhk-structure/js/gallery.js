/* Isolated project gallery using existing Splide and the page's native image dialog. */
(()=>{
  'use strict';
  const section=document.querySelector('#gallery');
  if(!section)return;
  const buttons=Array.from(section.querySelectorAll('.pg-photo'));
  const previous=section.querySelector('[data-gallery-prev]');
  const next=section.querySelector('[data-gallery-next]');
  const counter=section.querySelector('.pg-counter');
  const total=buttons.length;
  if(!total){section.hidden=true;return;}
  if(window.BarnSplide){
    const carousel=new window.BarnSplide(section.querySelector('.splide'),{
      type:'slide',perPage:2,perMove:1,gap:'24px',arrows:false,pagination:false,
      drag:true,snap:true,trimSpace:true,
      speed:window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:400,
      breakpoints:{767:{perPage:1,gap:'16px'}},
      i18n:{carousel:'галерея проекта',slide:'фотография',slideLabel:'%s из %s'}
    });
    function sync(){
      const first=carousel.index+1,last=Math.min(total,carousel.index+carousel.options.perPage);
      counter.textContent=first===last?`${first} / ${total}`:`${first}–${last} / ${total}`;
      counter.setAttribute('aria-label',`Фотографии ${first===last?first:`${first}–${last}`} из ${total}`);
      previous.disabled=carousel.index===0;
      next.disabled=carousel.index>=carousel.Components.Controller.getEnd();
      previous.hidden=next.hidden=total<=carousel.options.perPage;
    }
    carousel.on('mounted move updated resized',sync);carousel.mount();
    previous.addEventListener('click',()=>carousel.go('<'));
    next.addEventListener('click',()=>carousel.go('>'));
    section.projectGallery=carousel;
  }
  // The existing page controller opens the dialog and restores focus on close.
  const dialog=document.querySelector('#image-dialog');
  const nav=document.createElement('div');
  nav.className='pg-viewer-nav';nav.hidden=true;
  const viewerPrevious=previous.cloneNode(true),viewerNext=next.cloneNode(true);
  viewerPrevious.removeAttribute('data-gallery-prev');viewerNext.removeAttribute('data-gallery-next');
  viewerPrevious.setAttribute('aria-label','Предыдущая фотография');
  viewerNext.setAttribute('aria-label','Следующая фотография');
  nav.append(viewerPrevious,viewerNext);dialog.append(nav);
  let active=-1;
  function show(index){
    active=index;
    const source=buttons[active];
    const image=dialog.querySelector('#image-large');
    image.src=source.dataset.image;image.alt=source.dataset.caption;
    dialog.querySelector('#image-caption').textContent=source.dataset.caption;
    viewerPrevious.hidden=viewerNext.hidden=total<2;
    viewerPrevious.disabled=active===0;viewerNext.disabled=active===total-1;
  }
  buttons.forEach((button,index)=>button.addEventListener('click',()=>{
    dialog.classList.add('pg-viewer');nav.hidden=false;show(index);
  }));
  viewerPrevious.addEventListener('click',()=>{if(active>0)show(active-1);});
  viewerNext.addEventListener('click',()=>{if(active<total-1)show(active+1);});
  dialog.addEventListener('keydown',event=>{
    if(active<0)return;
    if(event.key==='ArrowLeft'){event.preventDefault();if(active>0)show(active-1);}
    if(event.key==='ArrowRight'){event.preventDefault();if(active<total-1)show(active+1);}
  });
  dialog.addEventListener('close',()=>{active=-1;nav.hidden=true;dialog.classList.remove('pg-viewer');});
  section.dataset.galleryReady='true';
})();
