/* Shared reference refinements, without replacing Moscow content or portraits. */
(function () {
  'use strict';
  var base = new URL('.', document.currentScript.src);
  var phone = document.querySelector('.site-header__mobile-phone');
  if (phone) phone.classList.add('catalog-primary-call');
  var toggle = document.querySelector('.catalog-sticky__contact-toggle');
  var nav = document.querySelector('.catalog-sticky__nav');
  if (toggle && nav) {
    var actions = document.createElement('div'); actions.className = 'catalog-sticky__mobile-actions';
    var callback = document.createElement('button'); callback.type = 'button';
    callback.className = 'catalog-sticky__request catalog-sticky__callback';
    callback.textContent = 'Оставить заявку';
    callback.setAttribute('aria-haspopup','dialog'); callback.setAttribute('aria-controls','city-request-modal');
    var holder = toggle.closest('li'); actions.append(toggle,callback); holder.remove(); nav.append(actions);
    document.addEventListener('click',function(event){
      var panel=document.querySelector('.catalog-sticky__contact-panel');
      if (panel && !panel.contains(event.target) && !toggle.contains(event.target)) {
        panel.hidden=true;toggle.setAttribute('aria-expanded','false');
      }
    });
  }
}());
