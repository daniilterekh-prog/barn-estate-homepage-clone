// Keep existing CTA elements/listeners. Only update hero presentation.
(() => {
  const hero = document.querySelector('.catalog-detail .detail-hero')
  if (!hero) return
  document.body.classList.add('vavilova-button-kit')
  const image = hero.querySelector('.detail-hero__image')
  if (image) { image.width = 1920; image.height = 1280 }
  const cost = hero.querySelectorAll('.vavilova-hero-fact')[1]
  if (cost) {
    cost.querySelector('dt').textContent = 'Стоимость'
    cost.querySelector('dd').textContent = 'По запросу'
  }
  // Search matches ambassadors hero; document uses the same 24px/1.5px outline grammar.
  const icon = secondary => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('viewBox', '0 0 24 24')
    svg.setAttribute('fill', 'none')
    svg.setAttribute('aria-hidden', 'true')
    svg.classList.add('architecture-hero-icon')
    svg.setAttribute('stroke', 'currentColor')
    svg.setAttribute('stroke-width', '1.5')
    svg.setAttribute('stroke-linecap', 'round')
    svg.setAttribute('stroke-linejoin', 'round')
    if (!secondary) {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      circle.setAttribute('cx', '11'); circle.setAttribute('cy', '11'); circle.setAttribute('r', '7')
      svg.append(circle)
    }
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', secondary
      ? 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8L14 2Zm0 0v6h6M8 13h8M8 17h6'
      : 'm20 20-3.5-3.5')
    svg.append(path)
    return svg
  }
  hero.querySelectorAll('.detail-hero__button').forEach((button) => {
    const secondary = button.classList.contains('detail-hero__button--secondary')
    const text = document.createElement('span')
    text.textContent = secondary ? 'Получить презентацию' : 'Смотреть лоты'
    button.replaceChildren(text, icon(secondary))
  })
})()
