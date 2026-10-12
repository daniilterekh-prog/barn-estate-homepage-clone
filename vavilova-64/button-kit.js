// Reuse the same static directional SVG; preserve buttons and their listeners.
(() => {
  if (!document.body.classList.contains('vavilova-button-kit')) return
  // Directional text links remain independent of the semantic hero icons.
  const cloneArrow = () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('viewBox', '0 0 16 16')
    svg.setAttribute('fill', 'none')
    svg.setAttribute('aria-hidden', 'true')
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', 'M3 13 13 3M5 3h8v8')
    path.setAttribute('stroke', 'currentColor')
    path.setAttribute('stroke-width', '1.35')
    path.setAttribute('stroke-linecap', 'round')
    path.setAttribute('stroke-linejoin', 'round')
    svg.append(path)
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
