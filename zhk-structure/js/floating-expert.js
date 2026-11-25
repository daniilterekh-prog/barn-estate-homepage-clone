/* Page-local placement and dismissal; the existing dialog handles consultation. */
(() => {
  const widget = document.querySelector('.project-floating-expert');
  if (!widget) return;
  const trigger = widget.querySelector('.pf-card');
  const project = document.querySelector('#project-title')?.textContent.trim();
  if (project) trigger.dataset.contact = `Вопрос эксперту о проекте «${project}»`;

  const mobileActions = document.querySelector('.mobile-action');
  const updateOffset = () => {
    const height = mobileActions?.getBoundingClientRect().height || 0;
    widget.style.setProperty('--pf-mobile-height', `${height}px`);
  };
  updateOffset();
  if (mobileActions && 'ResizeObserver' in window) new ResizeObserver(updateOffset).observe(mobileActions);
  else window.addEventListener('resize', updateOffset);

  let dismissed = false;
  const visibleSections = new Set();
  const update = () => { widget.hidden = dismissed || visibleSections.size > 0; };
  widget.querySelector('.pf-close').addEventListener('click', () => {
    dismissed = true;
    update();
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) visibleSections.add(entry.target);
        else visibleSections.delete(entry.target);
      }
      update();
    }, { threshold: 0 });
    document.querySelectorAll('#expert,#footer').forEach(section => observer.observe(section));
  } else update();
})();
