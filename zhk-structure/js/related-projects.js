/* Preview favorites are kept only in memory on this page. */
document.querySelectorAll('[data-project-favorite]').forEach(button => {
  button.addEventListener('click', () => {
    const selected = button.getAttribute('aria-pressed') !== 'true';
    const name = button.dataset.projectName;
    button.setAttribute('aria-pressed', String(selected));
    button.setAttribute('aria-label', `${selected ? 'Убрать' : 'Добавить'} ${name} ${selected ? 'из избранного' : 'в избранное'}`);
    document.querySelector('#similar .rp-status').textContent = `${name} ${selected ? 'добавлен в избранное' : 'убран из избранного'}`;
  });
});
