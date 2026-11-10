/* Owners navigation controller, bound to the existing local navigation markup. */
'use strict';
(()=>{
 const header=document.querySelector('.site-header'),nav=header?.querySelector('.mh-reference-nav');if(!nav)return;
 const list=nav.querySelector(':scope > ul');
 for(const li of list.children){const a=li.querySelector(':scope > a'),panel=li.querySelector(':scope > .mh-subnav');
   let timer,touch=false,wasOpen=false,suppress=false;
   const close=(restore=false)=>{clearTimeout(timer);panel.hidden=true;a.setAttribute('aria-expanded','false');if(restore){suppress=true;a.focus({preventScroll:true});suppress=false;}};
   const open=()=>{if(!matchMedia('(min-width:1281px)').matches)return;clearTimeout(timer);for(const other of list.querySelectorAll('.mh-subnav'))if(other!==panel){other.hidden=true;other.previousElementSibling.setAttribute('aria-expanded','false');}panel.hidden=false;a.setAttribute('aria-expanded','true');panel.style.left='0px';const r=panel.getBoundingClientRect(),limit=document.documentElement.clientWidth-12;if(r.right>limit)panel.style.left=(limit-r.right)+'px';};
   li.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')open();});li.addEventListener('pointerleave',()=>{if(!li.contains(document.activeElement))timer=setTimeout(()=>close(),140);});li.addEventListener('focusin',()=>{if(!suppress)open();});li.addEventListener('focusout',()=>setTimeout(()=>{if(!li.contains(document.activeElement))close();},0));
   a.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'){touch=true;wasOpen=!panel.hidden;}});a.addEventListener('click',e=>{if(touch){touch=false;if(!wasOpen){e.preventDefault();open();}}});
   li.addEventListener('keydown',e=>{const links=[...panel.querySelectorAll('a')],at=links.indexOf(document.activeElement);if(e.key==='Escape'&&!panel.hidden){e.preventDefault();e.stopPropagation();close(true);}if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();open();links[(at<0?(e.key==='ArrowDown'?0:links.length-1):(at+(e.key==='ArrowDown'?1:-1)+links.length)%links.length)]?.focus();}});
  }
  const closeAll=()=>{for(const panel of list.querySelectorAll('.mh-subnav')){panel.hidden=true;panel.previousElementSibling.setAttribute('aria-expanded','false');}};document.addEventListener('pointerdown',e=>{if(!nav.contains(e.target))closeAll();});window.addEventListener('resize',closeAll);window.addEventListener('scroll',closeAll,{passive:true});
})();
