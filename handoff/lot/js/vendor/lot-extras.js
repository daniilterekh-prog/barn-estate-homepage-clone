/* Existing project-page widget/card interactions, scoped to the lot preview. */
(() => {
  const widget = document.querySelector('.project-floating-expert');
  let dismissed = false;
  const visible = new Set();
  const update = () => { widget.hidden = dismissed || visible.size > 0; };
  widget.querySelector('.pf-close').addEventListener('click', () => { dismissed = true; update(); });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target); else visible.delete(entry.target);
      }
      update();
    }, {threshold:0});
    document.querySelectorAll('#lot-contact,#lot-newsletter,footer').forEach(section => observer.observe(section));
  } else update();

  // Match the source card's page-memory favorites, without changing account storage.
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-related-favorite]');
    if (!button) return;
    const selected = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(selected));
    button.setAttribute('aria-label', (selected ? 'Убрать ' : 'Добавить ') + button.dataset.relatedTitle + (selected ? ' из избранного' : ' в избранное'));
    document.querySelector('#lot-related .rp-status').textContent = button.dataset.relatedTitle + (selected ? ' добавлен в избранное' : ' убран из избранного');
  });
  document.addEventListener('input', event => {
    if (!event.target.matches('#newsletter-email')) return;
    event.target.removeAttribute('aria-invalid');
    const error = document.querySelector('#newsletter-error');error.textContent = '';error.classList.remove('is-visible');
  });
  document.addEventListener('submit', event => {
    const form = event.target.closest('.newsletter-form');
    if (!form) return;
    event.preventDefault();
    const input = form.querySelector('[type=email]'), error = form.querySelector('.newsletter-form__error');
    if (!input.validity.valid) {
      error.textContent = 'Введите корректный email.';error.classList.add('is-visible');input.setAttribute('aria-invalid','true');input.focus();return;
    }
    error.textContent = '';error.classList.remove('is-visible');input.removeAttribute('aria-invalid');
    let result = form.querySelector('.newsletter-result');
    if (!result) {result = document.createElement('p');result.className='newsletter-result';result.setAttribute('role','status');result.tabIndex=-1;form.append(result);}
    result.replaceChildren(document.createTextNode('Запрос на подписку подготовлен. '));
    const link = document.createElement('a');link.className='text-link';link.textContent='Отправить письмо для подписки';
    link.href='mailto:moscow@barn-estate.com?subject='+encodeURIComponent('Подписка на рассылку BARN Estate')+'&body='+encodeURIComponent('Прошу подписать меня на рассылку BARN Estate.\nEmail: '+input.value.trim());
    result.append(link);result.focus({preventScroll:true});
  });
})();
