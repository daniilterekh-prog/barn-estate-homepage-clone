const contactDialog = document.querySelector('#contact-dialog');
const imageDialog = document.querySelector('#image-dialog');
const result = document.querySelector('#contact-result');
let previousFocus;
function openDialog(dialog) {
  previousFocus = document.activeElement;
  dialog.showModal();
  document.body.classList.add('has-dialog');
}
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    document.body.classList.remove('has-dialog');
    previousFocus?.focus();
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
});
document.querySelectorAll('[data-contact]').forEach(button => button.addEventListener('click', () => {
  document.querySelector('#contact-topic').textContent = button.dataset.contact;
  result.textContent = '';
  document.querySelector('#contact-form').reset();
  openDialog(contactDialog);
}));
document.querySelector('#contact-form').addEventListener('submit', event => {
  event.preventDefault();
  result.textContent = 'Сценарий проверен. В рабочей версии здесь будет отправка обращения эксперту. Введённые данные никуда не отправлены и не сохранены.';
  event.currentTarget.reset();
});
document.querySelectorAll('[data-image]').forEach(button => button.addEventListener('click', () => {
  const largeImage = document.querySelector('#image-large');
  largeImage.src = button.dataset.image;
  largeImage.alt = button.dataset.caption;
  document.querySelector('#image-caption').textContent = button.dataset.caption;
  openDialog(imageDialog);
}));
document.querySelectorAll('[data-room]').forEach(button => button.addEventListener('click', () => {
  const room = button.dataset.room;
  document.querySelectorAll('[data-room]').forEach(item => {
    const selected = item === button;
    item.classList.toggle('selected', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  document.querySelectorAll('[data-format]').forEach(item => { item.hidden = room !== 'all' && item.dataset.format !== room; });
  const count = document.querySelectorAll('[data-format]:not([hidden])').length;
  document.querySelector('#format-status').textContent = `Примеров форматов: ${count} · наличие и стоимость уточняются`;
}));
document.querySelector('#annotations').addEventListener('click', event => {
  const enabled = document.body.classList.toggle('show-structure');
  const button = event.currentTarget;
  button.setAttribute('aria-pressed', String(enabled));
  button.innerHTML = enabled ? 'Скрыть структуру <span aria-hidden="true">−</span>' : 'Показать структуру <span aria-hidden="true">＋</span>';
});
const menuTrigger = document.querySelector('.menu-trigger');
const menu = document.querySelector('#mobile-menu');
menuTrigger.addEventListener('click', () => {
  menu.hidden = !menu.hidden;
  menuTrigger.setAttribute('aria-expanded', String(!menu.hidden));
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { menu.hidden = true; menuTrigger.setAttribute('aria-expanded', 'false'); }));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !menu.hidden) { menu.hidden = true; menuTrigger.setAttribute('aria-expanded', 'false'); menuTrigger.focus(); }
});

const mapButton = document.querySelector('#load-map');
mapButton.addEventListener('click', () => {
  const panel = document.querySelector('.map-panel');
  const frame = panel.querySelector('iframe');
  mapButton.disabled = true;
  document.querySelector('#map-status').textContent = 'Загружается карта. Также можно открыть её по ссылке ниже.';
  frame.addEventListener('load', () => { frame.hidden = false; panel.classList.add('is-loaded'); }, { once: true });
  frame.src = frame.dataset.src;
});
