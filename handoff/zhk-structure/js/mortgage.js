/* The iframe keeps Calcus CSS/JS separate from the other forms on the page. */
(()=>{
  const frame=document.querySelector('#mortgage-calculator');
  const launch=document.querySelector('#mortgage-launch');
  if(!frame||!launch)return;
  const theme=()=>frame.contentWindow?.postMessage({type:'barn-mortgage-theme',width:innerWidth},location.origin);
  frame.addEventListener('load',theme);window.addEventListener('resize',theme);
  launch.addEventListener('click',()=>{
    frame.hidden=false;
    launch.setAttribute('aria-expanded','true');
    launch.hidden=true;
    frame.src=frame.dataset.src;
    frame.focus({preventScroll:true});
  },{once:true});
  window.addEventListener('message',event=>{
    if(event.origin!==location.origin||event.source!==frame.contentWindow)return;
    if(event.data?.type!=='barn-mortgage-height'||!Number.isFinite(event.data.height))return;
    frame.height=String(Math.max(240,Math.min(2400,Math.ceil(event.data.height))));
  });
})();
