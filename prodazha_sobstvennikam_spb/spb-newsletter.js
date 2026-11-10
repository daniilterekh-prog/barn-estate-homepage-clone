/* Isolated copy of homepage shared/cta-bleed.js; newsletter only. */
/* Background-only adapter. Existing forms, controls and portraits retain their DOM/layout. */
(()=>{'use strict';
const roots='#newsletter',mounted=new WeakMap();
function layer(parent){const e=document.createElement('div');parent.append(e);return e;}
function mount(root){
 if(mounted.has(root))return;
 const form=root.querySelector('.newsletter-form');
 form.addEventListener('submit',event=>{
  event.preventDefault();
  let status=form.querySelector('[data-preview-status]');
  if(!status){status=document.createElement('p');status.className='newsletter-form__status';status.dataset.previewStatus='';status.setAttribute('role','status');form.append(status);}
  status.textContent='В превью подписка не подключена.';
 });
 if(root.classList.contains('catalog-contact')){root.dataset.ctaBleed='existing';mounted.set(root,{});return;}
 const split=root.matches('.newsletter-cta,.office-contact');
 const media=root.querySelector(split?'.newsletter-cta__visual,.office-contact__visual':'.media-library__frame,.media-cta-banner__media,.catalog-consultation__media');
 if(!media)return;
 const image=media.querySelector('img'),overlay=media.querySelector('.media-cta-banner__overlay,.catalog-consultation__overlay');
 if(!image)return;
 const backdrop=document.createElement('div');backdrop.className='cta-bleed-backdrop';backdrop.setAttribute('aria-hidden','true');backdrop.inert=true;
 const photo=layer(backdrop),shade=layer(backdrop);
 root.prepend(backdrop);root.dataset.ctaBleed=split?'split':'background';
 const frame=root.querySelector('.media-cta-banner__frame,.media-library__frame');
 const state={root,media,image,overlay,frame,backdrop,photo,shade,split};mounted.set(root,state);
 function update(){
  media.classList.remove('cta-bleed-clear');image.classList.remove('cta-bleed-hide');overlay?.classList.remove('cta-bleed-hide');frame?.classList.remove('cta-bleed-clear');
  const m=getComputedStyle(media),im=getComputedStyle(image),ov=overlay&&getComputedStyle(overlay),rr=root.getBoundingClientRect(),mr=media.getBoundingClientRect();
  const url=image.currentSrc||image.src,cutout=/cutout|\.png(?:[?#]|$)/i.test(url)&&!split;
  backdrop.style.backgroundColor=m.backgroundColor==='rgba(0, 0, 0, 0)'?(split?'transparent':'#101318'):m.backgroundColor;
  backdrop.style.backgroundImage=m.backgroundImage;
  photo.style.backgroundImage=im.display==='none'||cutout?'none':'url('+JSON.stringify(url)+')';
  photo.style.backgroundPosition=im.objectPosition;photo.style.filter=im.filter;photo.style.opacity=im.opacity;
  shade.style.backgroundImage=cutout?'none':(ov?.backgroundImage||'none');shade.style.backgroundColor=cutout?'transparent':(ov?.backgroundColor||'transparent');shade.style.opacity=ov?.opacity||'1';
  if(split){
   const shown=mr.width>0&&mr.height>0&&m.display!=='none';backdrop.hidden=!shown;
   const stacked=mr.width>rr.width*.8;
   backdrop.style.left=stacked?'0px':Math.max(0,mr.left-rr.left)+'px';
   backdrop.style.top=stacked?Math.max(0,mr.top-rr.top)+'px':'0px';
  }
  media.classList.add('cta-bleed-clear');frame?.classList.add('cta-bleed-clear');
  if(!cutout)image.classList.add('cta-bleed-hide');if(overlay&&!cutout)overlay.classList.add('cta-bleed-hide');
 }
 const observer=new ResizeObserver(update);observer.observe(root);observer.observe(media);image.addEventListener('load',update);window.addEventListener('resize',update,{passive:true});document.fonts?.ready.then(update);update();
}
function refresh(){const nuxt=document.querySelector('#__nuxt')?.__vue_app__?.config.globalProperties.$nuxt;if(document.querySelector('#__nuxt')&&document.querySelector('script[type="module"][src]')&&(!nuxt||nuxt.isHydrating)){setTimeout(refresh,40);return;}document.querySelectorAll(roots).forEach(mount);}
refresh();new MutationObserver(refresh).observe(document.documentElement,{childList:true,subtree:true});
})();
