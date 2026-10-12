/* Shared reference refinements, without replacing Moscow content or portraits. */
(function () {
  'use strict';
  var base = new URL('.', document.currentScript.src);
  var css = document.createElement('link');
  css.rel = 'stylesheet'; css.href = new URL('../css/owner-footer.css', base);
  document.head.append(css);
  var footerScript = document.createElement('script');
  footerScript.src = new URL('footer-template.js?v=20261012-reference-sync-1', base);
  footerScript.onload = function () {
    var old = document.querySelector('.site-footer'), template = document.createElement('template');
    template.innerHTML = window.BarnesCityFooterTemplate;
    template.content.querySelectorAll('img').forEach(function (image) {
      var path=image.getAttribute('src');
      if (path && path.startsWith('/')) image.src=new URL('../'+path.slice(1),base).href;
    });
    if (old) old.replaceWith(template.content);
  };
  document.body.append(footerScript);
  var phone = document.querySelector('.site-header__mobile-phone');
  if (phone) phone.classList.add('catalog-primary-call');
  var toggle = document.querySelector('.catalog-sticky__contact-toggle');
  var nav = document.querySelector('.catalog-sticky__nav');
  if (toggle && nav) {
    var actions = document.createElement('div'); actions.className = 'catalog-sticky__mobile-actions';
    var callback = document.createElement('button'); callback.type = 'button';
    callback.className = 'catalog-sticky__request catalog-sticky__callback';
    callback.textContent = 'Оставить заявку';
    callback.setAttribute('aria-haspopup','dialog'); callback.setAttribute('aria-controls','catalog-feedback-modal');
    var holder = toggle.closest('li'); actions.append(toggle,callback); holder.remove(); nav.append(actions);
    document.addEventListener('click',function(event){
      var panel=document.querySelector('.catalog-sticky__contact-panel');
      if (panel && !panel.contains(event.target) && !toggle.contains(event.target)) {
        panel.hidden=true;toggle.setAttribute('aria-expanded','false');
      }
    });
  }
}());
