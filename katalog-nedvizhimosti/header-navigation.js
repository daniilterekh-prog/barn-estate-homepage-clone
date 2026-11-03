/* Subpages from the approved homepage header. The top-level links keep their URLs. */
(()=>{
 'use strict';
 const header=document.querySelector('.site-header'),nav=header.querySelector('.catalog-global-nav');
 const sections=JSON.parse(document.querySelector('#catalog-header-navigation').textContent);
 const triggers=[...nav.querySelectorAll('.site-header__nav-link')];
 const dropdown=document.createElement('nav');dropdown.id='catalog-header-dropdown';dropdown.className='catalog-header-dropdown';dropdown.hidden=true;
 const list=document.createElement('ul');list.className='catalog-header-dropdown__list';dropdown.append(list);header.append(dropdown);
 let active=null,closeTimer=0,suppressFocus=false,touchWasOpen=false,touchInteraction=false;
 const cancelClose=()=>clearTimeout(closeTimer);
 function close(restoreFocus=false){
  cancelClose();const previous=active;active=null;dropdown.hidden=true;
  previous?.setAttribute('aria-expanded','false');
  if(restoreFocus&&previous){suppressFocus=true;previous.focus({preventScroll:true});suppressFocus=false;}
 }
 function position(){
  if(!active)return;
  const row=nav.getBoundingClientRect(),anchor=active.getBoundingClientRect();
  if(!nav.checkVisibility()||row.height===0||anchor.right<=row.left||anchor.left>=row.right){close();return;}
  const gutter=22,viewport=document.documentElement.clientWidth;
  dropdown.style.maxWidth=Math.max(0,viewport-gutter*2)+'px';
  dropdown.style.setProperty('--catalog-dropdown-top',row.bottom+'px');dropdown.style.top=row.bottom+'px';
  dropdown.style.left=Math.max(gutter,Math.min(anchor.left,viewport-dropdown.getBoundingClientRect().width-gutter))+'px';
 }
 function open(trigger){
  cancelClose();if(header.classList.contains('site-header--menu-open'))return;
  if(active!==trigger){
   close();const section=sections.find(section=>section.href===trigger.href);if(!section?.links.length)return;
   list.replaceChildren(...section.links.map(item=>{const li=document.createElement('li'),link=document.createElement('a');link.className='catalog-header-dropdown__link';link.textContent=item.label;link.href=item.href;li.append(link);return li;}));
   active=trigger;trigger.setAttribute('aria-expanded','true');dropdown.setAttribute('aria-labelledby',trigger.id);dropdown.hidden=false;
  }
  position();
 }
 const scheduleClose=()=>{cancelClose();closeTimer=setTimeout(()=>{if(!dropdown.contains(document.activeElement)&&document.activeElement!==active)close();},180);};
 triggers.forEach((trigger,index)=>{
  // URL normalization also matches the homepage's slash on barnes-spb.ru.
  const section=sections.find(section=>new URL(section.href).href===trigger.href);if(!section)return;
  trigger.id='catalog-header-nav-'+index;trigger.setAttribute('aria-controls',dropdown.id);trigger.setAttribute('aria-expanded','false');
  trigger.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch')open(trigger);});
  trigger.addEventListener('focus',()=>{trigger.scrollIntoView({block:'nearest',inline:'nearest'});if(!suppressFocus)open(trigger);});
  trigger.addEventListener('pointerdown',event=>{touchInteraction=event.pointerType==='touch';touchWasOpen=touchInteraction&&active===trigger&&!dropdown.hidden;});
  trigger.addEventListener('click',event=>{if(event.detail>0&&touchInteraction&&!touchWasOpen){event.preventDefault();open(trigger);}touchInteraction=false;touchWasOpen=false;});
  trigger.addEventListener('keydown',event=>{
   if(event.key==='ArrowDown'||event.key==='ArrowUp'||(event.key==='Tab'&&!event.shiftKey&&active===trigger)){
    event.preventDefault();open(trigger);const links=list.querySelectorAll('a');(event.key==='ArrowUp'?links[links.length-1]:links[0])?.focus();
   }
  });
 });
 nav.addEventListener('mouseleave',scheduleClose);nav.addEventListener('mouseenter',cancelClose);
 dropdown.addEventListener('mouseenter',cancelClose);dropdown.addEventListener('mouseleave',scheduleClose);
 nav.addEventListener('scroll',position,{passive:true});
 dropdown.addEventListener('keydown',event=>{
  const links=[...list.querySelectorAll('a')],index=links.indexOf(document.activeElement);
  if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){
   event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?links.length-1:(index+(event.key==='ArrowDown'?1:-1)+links.length)%links.length;links[next]?.focus();
  }else if(event.key==='Tab'&&event.shiftKey&&index===0){event.preventDefault();close(true);
  }else if(event.key==='Tab'&&!event.shiftKey&&index===links.length-1){const next=triggers[triggers.indexOf(active)+1];if(next){event.preventDefault();next.focus();}}
 });
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&active){event.preventDefault();event.stopPropagation();close(true);}},true);
 document.addEventListener('pointerdown',event=>{if(!nav.contains(event.target)&&!dropdown.contains(event.target))close();});
 document.addEventListener('focusin',event=>{if(!nav.contains(event.target)&&!dropdown.contains(event.target))close();});
 header.querySelector('.site-header__icon-btn').addEventListener('click',()=>close(),true);
 window.addEventListener('scroll',()=>close(),{passive:true});window.addEventListener('resize',()=>close());
})();
