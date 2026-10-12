// Reuse the same static directional SVG; preserve buttons and their listeners.
(() => {
  if (!document.body.classList.contains('vavilova-button-kit')) return
  const template = document.querySelector('.detail-hero .architecture-hero-arrow')
  if (!template) return
  const cloneArrow = () => {
    const svg = template.cloneNode(true)
    svg.setAttribute('class', 'barnes-action-arrow')
    return svg
  }
  document.querySelectorAll('.catalog-detail .mortgage__action .ui-icon').forEach(icon => {
    icon.replaceChildren(cloneArrow())
  })
  const subscribe = document.querySelector('.newsletter-form__row > button')
  if (subscribe) {
    const label = document.createElement('span')
    label.textContent = 'Подписаться'
    subscribe.replaceChildren(label, cloneArrow())
  }
})()
