/* Restore homepage newsletter after Nuxt hydration; keep the native form and submit handler. */
(()=>{'use strict';
function restore(){
 const app=document.querySelector('#__nuxt')?.__vue_app__?.config.globalProperties.$nuxt;
 if(document.querySelector('script[type="module"][src]')&&(!app||app.isHydrating)){setTimeout(restore,40);return;}
 for(const section of document.querySelectorAll('.newsletter-cta[data-home-newsletter]')){
  if(section.dataset.homeNewsletterReady)continue;
  const copy=section.querySelector('.newsletter-cta__copy'),heading=copy.querySelector('h2');
  let eyebrow=copy.querySelector('.home-section-eyebrow,.owner-rent-section-eyebrow,.owner-sale-section-eyebrow');
  if(!eyebrow){eyebrow=document.createElement('p');copy.insertBefore(eyebrow,heading);}
  eyebrow.className='home-section-eyebrow owner-sale-section-eyebrow owner-rent-section-eyebrow';
  eyebrow.textContent='Рассылка BARN Estate';
  heading.textContent='В центре событий рынка недвижимости';
  copy.querySelector('.newsletter-cta__lead').textContent='Узнавайте первыми о новых проектах, редких объектах и ключевых тенденциях рынка элитной недвижимости. Подписывайтесь на рассылку BARN Estate.';
  section.querySelector('form').setAttribute('aria-label','Подписка на новости BARN Estate');
  section.querySelector('input[type=email]').required=true;
  const link=section.querySelector('.newsletter-form__note-link');
  link.href='https://barn-estate.ru/legal_notices/yuridicheskie-uvedomleniya/';link.rel='noopener noreferrer';
  const arrow=section.querySelector('button span[aria-hidden]');
  if(arrow)arrow.outerHTML='<svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 13 13 3M5 3h8v8" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  section.dataset.homeNewsletterReady='true';
 }
}
restore();new MutationObserver(restore).observe(document.documentElement,{childList:true,subtree:true});
})();
