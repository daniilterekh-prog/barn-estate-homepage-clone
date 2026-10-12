/* Small local replacement for the captured news carousel's vendor controls. */
(function(){
  const slider=document.querySelector('.news-section__slider');
  if(!slider)return;
  const list=slider.querySelector('.splide__list'),track=slider.querySelector('.splide__track');
  const slides=[...list.children],nav=slider.closest('.news-section').querySelectorAll('.news-section__nav-btn'),prev=nav[0],next=nav[1];
  let index=0,startX=null;
  const pages=[...slider.querySelectorAll('.splide__pagination__page')];
  function render(){
    const step=slides[0].getBoundingClientRect().width+parseFloat(getComputedStyle(slides[0]).marginRight||0);
    const visible=matchMedia('(max-width:560px)').matches?1:matchMedia('(max-width:1024px)').matches?2:3;
    index=Math.max(0,Math.min(index,slides.length-visible));
    list.style.transform='translateX('+(-index*step)+'px)';
    list.style.transition=matchMedia('(prefers-reduced-motion:reduce)').matches?'none':'transform 400ms ease';
    slides.forEach((slide,i)=>{
      const shown=i>=index&&i<index+visible;
      slide.setAttribute('aria-hidden',String(!shown));
      slide.querySelectorAll('a,button').forEach(control=>control.tabIndex=shown?0:-1);
    });
    if(prev)prev.disabled=index===0;
    if(next)next.disabled=index===slides.length-visible;
    pages.forEach((button,i)=>{button.classList.toggle('is-active',i===index);button.setAttribute('aria-selected',String(i===index));button.tabIndex=i===index?0:-1});
  }
  pages.forEach((button,i)=>button.addEventListener('click',()=>{index=i;render()}));
  prev?.addEventListener('click',()=>{index--;render()});
  next?.addEventListener('click',()=>{index++;render()});
  track.addEventListener('pointerdown',e=>{startX=e.clientX});
  track.addEventListener('pointerup',e=>{if(startX!==null&&Math.abs(e.clientX-startX)>40){index+=e.clientX<startX?1:-1;render()}startX=null});
  track.addEventListener('pointercancel',()=>startX=null);
  window.addEventListener('resize',render);render();
}());
