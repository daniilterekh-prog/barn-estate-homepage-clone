// Keep existing CTA elements/listeners. Only update hero presentation.
(() => {
  const hero = document.querySelector('.catalog-detail .detail-hero')
  if (!hero) return
  const image = hero.querySelector('.detail-hero__image')
  if (image) { image.width = 1920; image.height = 1280 }
  const cost = hero.querySelectorAll('.vavilova-hero-fact')[1]
  if (cost) {
    cost.querySelector('dt').textContent = 'Стоимость'
    cost.querySelector('dd').textContent = 'По запросу'
  }
  const arrow = (diagonal) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('viewBox', '0 0 24 24')
    svg.setAttribute('fill', 'none')
    svg.setAttribute('aria-hidden', 'true')
    svg.classList.add('architecture-hero-arrow')
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', diagonal ? 'M6 18 18 6M6 6h12v12' : 'M3 12h18m-7-7 7 7-7 7')
    path.setAttribute('stroke', 'currentColor')
    path.setAttribute('stroke-width', '1.4')
    path.setAttribute('stroke-linecap', 'round')
    path.setAttribute('stroke-linejoin', 'round')
    svg.append(path)
    return svg
  }
  hero.querySelectorAll('.detail-hero__button').forEach((button) => {
    const secondary = button.classList.contains('detail-hero__button--secondary')
    const text = document.createElement('span')
    text.textContent = secondary ? 'Получить презентацию' : 'Смотреть лоты'
    button.replaceChildren(text, arrow(secondary))
  })
})()
