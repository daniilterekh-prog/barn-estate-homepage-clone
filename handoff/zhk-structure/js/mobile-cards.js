/* Two independent mobile sliders; the existing card grid remains on larger screens. */
(()=>{
  'use strict';
  if(!window.BarnSplide)return;
  document.querySelectorAll('.mobile-cards').forEach(root=>{
    const previous=root.querySelector('[data-cards-prev]');
    const next=root.querySelector('[data-cards-next]');
    const carousel=new window.BarnSplide(root,{
      type:'slide',perPage:1,perMove:1,gap:'16px',arrows:false,pagination:false,
      drag:true,snap:true,trimSpace:true,mediaQuery:'min',
      speed:400,reducedMotion:{speed:0},
      breakpoints:{768:{destroy:true}},
      i18n:{carousel:'карусель',slide:'карточка',slideLabel:'%s из %s'}
    });
    function sync(){
      previous.disabled=carousel.index===0;
      next.disabled=carousel.index>=carousel.Components.Controller.getEnd();
    }
    carousel.on('mounted move updated resized',sync);
    carousel.mount();
    previous.addEventListener('click',()=>carousel.go('<'));
    next.addEventListener('click',()=>carousel.go('>'));
    root.cardCarousel=carousel;
  });
})();
