/* RequestModal copied from kurortnaya/ui-kit-runtime.js; city-only triggers and portrait. */
(function () {
  'use strict';
  var openContactModal = null;
  function enhanceContactModal() {
    if (document.querySelector('.catalog-feedback-modal')) return;

    var modal = document.createElement('div');
    modal.className = 'catalog-feedback-modal feedback-modal modal';
    modal.hidden = true;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'catalog-feedback-modal-title');
    modal.innerHTML = [
      '<div class="modal__content" tabindex="-1">',
      '  <button class="modal__close" type="button" aria-label="Закрыть форму" data-catalog-modal-close>',
      '    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M5 5l14 14M19 5L5 19"></path></svg>',
      '  </button>',
      '  <div class="feedback-modal__layout">',
      '    <div class="feedback-modal__body">',
      '      <h2 class="feedback-modal__title" id="catalog-feedback-modal-title">Поможем найти подходящий объект</h2>',
      '      <p class="feedback-modal__intro">Эксперт BARNES уточнит задачу и подберёт лучшие варианты.</p>',
      '      <form class="feedback-modal__form" novalidate>',
      '        <div class="feedback-modal__channels" role="group" aria-label="Предпочтительный способ связи">',
      '          <button type="button" data-channel="Telegram" aria-pressed="true">Telegram</button>',
      '          <button type="button" data-channel="WhatsApp" aria-pressed="false">WhatsApp</button>',
      '          <button type="button" data-channel="MAX" aria-pressed="false">MAX</button>',
      '          <button type="button" data-channel="Звонок" aria-pressed="false">Звонок</button>',
      '        </div>',
      '        <input type="hidden" name="preferredChannel" value="Telegram">',
      '        <label class="feedback-modal__field"><span class="visually-hidden">Ваше имя</span><input class="feedback-modal__input" name="name" type="text" autocomplete="name" placeholder="Ваше имя" required></label>',
      '        <label class="feedback-modal__field"><span class="visually-hidden">Номер телефона</span><input class="feedback-modal__input" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="Номер телефона в Telegram" required></label>',
      '        <label class="feedback-modal__field"><span class="visually-hidden">Комментарий</span><textarea class="feedback-modal__input feedback-modal__textarea" name="comment" rows="3" placeholder="Опишите, какой объект вы ищете"></textarea></label>',
      '        <button class="feedback-modal__submit" type="submit">Получить подборку</button>',
      '        <label class="feedback-modal__consent">',
      '          <input class="feedback-modal__consent-input" name="consent" type="checkbox" required>',
      '          <span class="feedback-modal__consent-box" aria-hidden="true"></span>',
      '          <span class="feedback-modal__consent-text">Я даю согласие на обработку <a class="feedback-modal__consent-link" href="https://front.barnes.vsavr.ru/legal_notices/yuridicheskie-uvedomleniya/" target="_blank" rel="noopener noreferrer">персональных данных</a></span>',
      '        </label>',
      '        <p class="feedback-modal__status" role="status" aria-live="polite"></p>',
      '      </form>',
      '    </div>',
      '    <div class="feedback-modal__hero">',
      '      <img class="feedback-modal__hero-image" src="assets/cta-ruslan-unified-v1.webp" alt="Руслан Прус — руководитель департамента городской недвижимости BARNES" width="1817" height="866">',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('');
    document.body.appendChild(modal);

    var content = modal.querySelector('.modal__content');
    var form = modal.querySelector('.feedback-modal__form');
    var phone = form.querySelector('[name="phone"]');
    var channelValue = form.querySelector('[name="preferredChannel"]');
    var status = form.querySelector('.feedback-modal__status');
    var previousFocus = null;

    function closeModal() {
      if (modal.hidden) return;
      modal.hidden = true;
      document.body.classList.remove('catalog-modal-open');
      if (previousFocus && document.contains(previousFocus)) previousFocus.focus();
    }

    openContactModal = function (trigger) {
      previousFocus = trigger || document.activeElement;
      modal.hidden = false;
      document.body.classList.add('catalog-modal-open');
      window.requestAnimationFrame(function () {
        content.focus();
      });
    };

    modal.addEventListener('click', function (event) {
      if (event.target === modal || event.target.closest('[data-catalog-modal-close]')) closeModal();
    });

    modal.querySelector('.feedback-modal__channels').addEventListener('click', function (event) {
      var button = event.target.closest('button[data-channel]');
      if (!button) return;
      modal.querySelectorAll('.feedback-modal__channels button').forEach(function (item) {
        item.setAttribute('aria-pressed', String(item === button));
      });
      channelValue.value = button.dataset.channel;
      phone.placeholder = button.dataset.channel === 'Звонок' ? 'Номер телефона' : 'Номер телефона в ' + button.dataset.channel;
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      status.textContent = 'Демонстрационная форма: заявка не отправлена. Свяжитесь с BARNES через контакты на странице.';
      form.reset();
      channelValue.value = 'Telegram';
      phone.placeholder = 'Номер телефона в Telegram';
      modal.querySelectorAll('.feedback-modal__channels button').forEach(function (item) {
        item.setAttribute('aria-pressed', String(item.dataset.channel === 'Telegram'));
      });
    });

    document.addEventListener('keydown', function (event) {
      if (modal.hidden) return;
      if (event.key === 'Escape') {
        closeModal();
        return;
      }
      if (event.key !== 'Tab') return;
      var focusable = Array.from(modal.querySelectorAll('button, input, textarea, a[href]')).filter(function (item) {
        return !item.disabled && item.offsetParent !== null;
      });
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === content)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

  }

  enhanceContactModal();
  document.addEventListener('click', function (event) {
    var trigger = event.target.closest('.catalog-sticky__request, .catalog-page-nav__request, .catalog-contact__card-submit, .floating-expert__card, .apartment-card__call-btn, .site-footer__callback-btn');
    if (!trigger) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openContactModal(trigger);
  }, true);
}());

