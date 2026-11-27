/* Keep existing text-node/Vue references; only join the two brand words. */
(()=>{
 'use strict';
 if(window.__barnEstateNoWrap?.root===document.documentElement)return;
 window.__barnEstateNoWrap?.disconnect();
 const pattern=/(\bBARN|БАРН)[ \t\r\n\u00a0\u202f]+(ESTATE\b|ЭСТЕЙТ|ЕСТЕЙТ)/giu;
 const excluded='script,style,textarea,input,option,pre,code,svg,[contenteditable]';
 const started=performance.now();let pending=false,ready=false,active=true;
 function normalize(node){
  const parent=node.parentElement;if(!parent)return;
  pattern.lastIndex=0;if(!pattern.test(node.nodeValue)||parent.closest(excluded))return;
  pattern.lastIndex=0;const text=node.nodeValue.replace(pattern,(_,first,last)=>first+'\u00a0'+last);
  if(text!==node.nodeValue)node.nodeValue=text;
  if(!parent.classList.contains('barn-estate-name'))parent.classList.add('barn-estate-name');
 }
 function scan(root){
  if(root.nodeType===Node.TEXT_NODE){normalize(root);return;}
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  for(let node=walker.nextNode();node;node=walker.nextNode())normalize(node);
 }
 function refresh(){
  pending=false;if(!active||!document.body)return;
  const nuxt=document.querySelector('#__nuxt')?.__vue_app__?.config.globalProperties.$nuxt;
  if(document.querySelector('#__nuxt')&&document.querySelector('script[type="module"][src]')&&(!nuxt||nuxt.isHydrating!==false)&&performance.now()-started<10000){pending=true;setTimeout(()=>{pending=false;refresh();},40);return;}
  scan(document.body);ready=true;document.body.dataset.brandNoWrapReady='true';
 }
 function schedule(){if(active&&!pending){pending=true;requestAnimationFrame(refresh);}}
 const observer=new MutationObserver(records=>{
  if(!active)return;if(!ready){schedule();return;}
  for(const record of records){if(record.type==='characterData')normalize(record.target);else for(const node of record.addedNodes)scan(node);}
 });
 observer.observe(document.documentElement,{childList:true,subtree:true,characterData:true});
 window.__barnEstateNoWrap={root:document.documentElement,refresh,disconnect(){active=false;observer.disconnect();}};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refresh,{once:true});else refresh();
})();
