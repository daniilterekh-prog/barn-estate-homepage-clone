/* Canonical footer is rendered at build time. Bind the existing callback only. */
(()=>{
 const footer=document.querySelector('.node-footer');
 if(!footer||footer.dataset.nodeFooterReady)return;
 document.addEventListener('click',event=>{if(!event.target.closest('.node-footer .site-footer__callback-btn'))return;event.preventDefault();event.stopImmediatePropagation();document.querySelector('.floating-expert__card')?.click();},true);
 footer.dataset.nodeFooterReady='true';
 document.dispatchEvent(new CustomEvent('barnes:node-footer-ready'));
})();
