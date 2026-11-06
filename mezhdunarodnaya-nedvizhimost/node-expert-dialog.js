/* One presentation for the five existing expert dialogs. Keep local questions/controllers. */
(()=>{
 const body=document.body;if(body.dataset.nodeExpertDialogBootstrap)return;body.dataset.nodeExpertDialogBootstrap='true';
 const css=document.createElement('link');css.rel='stylesheet';css.onload=()=>{body.dataset.nodeExpertDialogStyled='true'};css.href=new URL('node-expert-dialog.css?v=0e9b9bfa3294',document.currentScript.src).href;document.head.append(css);
 const rootSelector='.home-owner-form[role="dialog"],.catalog-feedback-modal[role="dialog"]';
 const map={content:'.modal__content',close:'.modal__close,[data-catalog-modal-close],[data-quiz-close]',layout:'.home-owner-form__layout,.feedback-modal__layout',body:'.home-owner-form__body,.feedback-modal__body',hero:'.home-owner-form__hero,.feedback-modal__hero',photo:'.home-owner-form__hero-image,.feedback-modal__hero-image',title:'.home-owner-form__title,.feedback-modal__title',intro:'.home-owner-form__intro,.feedback-modal__intro',form:'.home-owner-form__form,.feedback-modal__form',channels:'.home-owner-form__channels,.feedback-modal__channels',field:'.home-owner-form__field,.feedback-modal__field',input:'.home-owner-form__input,.feedback-modal__input',submit:'.home-owner-form__submit,.feedback-modal__submit',consent:'.home-owner-form__consent,.feedback-modal__consent','consent-input':'.home-owner-form__consent-input,.feedback-modal__consent-input','consent-box':'.home-owner-form__consent-box,.feedback-modal__consent-box','consent-text':'.home-owner-form__consent-text,.feedback-modal__consent-text',status:'[data-owner-status],.feedback-modal__status'};
 for(const part of ['top','eyebrow','progress','track','back','panel','options','option','next','skip','summary','budget'])map[part]='.home-quiz__'+part+',.resort-quiz__'+part;
 function enhance(root){
  root.classList.add('node-expert-dialog');
  const photo=root.querySelector('.home-owner-form__hero-image,.feedback-modal__hero-image');if(photo?.alt.includes('Алина'))root.style.setProperty('--node-dialog-photo-position','90% top');
  if(photo?.alt.includes('Михаил')){root.style.setProperty('--node-dialog-photo-fit','contain');root.style.setProperty('--node-dialog-photo-position','center center');}
  for(const [part,selector]of Object.entries(map))root.querySelectorAll(selector).forEach(e=>e.classList.add('node-dialog__'+part));
  const title=root.querySelector('.node-dialog__title');if(title){if(!title.id)title.id='node-dialog-title';root.setAttribute('aria-labelledby',title.id);}
  const form=root.querySelector('form');if(form){const status=root.querySelector('.node-dialog__status');if(status){if(!status.id)status.id='node-dialog-status';form.querySelectorAll('input:not([type=hidden]),textarea,select').forEach(e=>{const ids=new Set((e.getAttribute('aria-describedby')||'').split(' ').filter(Boolean));ids.add(status.id);e.setAttribute('aria-describedby',[...ids].join(' '));});}form.querySelectorAll('input:not([type=hidden]),textarea,select').forEach(e=>{if(e.closest('label')||e.getAttribute('aria-label'))return;const label=e.placeholder||e.name;if(label)e.setAttribute('aria-label',label)});}
  if(form&&!form.dataset.nodeDialogValidation){
   form.dataset.nodeDialogValidation='true';
   form.addEventListener('submit',event=>{const name=form.querySelector('[name=name]'),phone=form.querySelector('[name=phone]'),consent=form.querySelector('[type=checkbox]'),status=root.querySelector('.node-dialog__status');
    const invalid=!name?.value.trim()?[name,'Укажите ваше имя.']:phone&&phone.value.replace(/\D/g,'').length<7?[phone,'Укажите корректный номер телефона.']:consent&&!consent.checked?[consent,'Подтвердите согласие на обработку персональных данных.']:null;
    if(!invalid)return;event.preventDefault();event.stopImmediatePropagation();form.querySelectorAll('[aria-invalid=true]').forEach(e=>e.removeAttribute('aria-invalid'));invalid[0]?.setAttribute('aria-invalid','true');if(status)status.textContent=invalid[1];invalid[0]?.focus();
   },true);
   form.addEventListener('input',event=>{if(event.target.getAttribute('aria-invalid')==='true'){event.target.removeAttribute('aria-invalid');const status=root.querySelector('.node-dialog__status');if(status)status.textContent='';}});
  }
  root.dataset.nodeExpertDialogReady='true';
 }
 function scan(node){if(!(node instanceof Element))return;if(node.matches(rootSelector))enhance(node);node.querySelectorAll(rootSelector).forEach(enhance);const root=node.closest(rootSelector);if(root)enhance(root);}
 const observer=new MutationObserver(records=>{const roots=new Set();for(const r of records)for(const node of r.addedNodes)if(node instanceof Element)roots.add(node);for(const node of roots)scan(node)});observer.observe(body,{subtree:true,childList:true});scan(body);
})();
