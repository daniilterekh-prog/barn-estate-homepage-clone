// Adapted from kurortnaya/start-sales-cards.js; keep project data and favorites.
(() => {
  document.querySelectorAll('.detail-similar .apartment-card').forEach((card) => {
    const media = card.querySelector('.apartment-card__media')
    const originalLink = card.querySelector('.apartment-card__media-link')
    const body = card.querySelector('.apartment-card__body')
    const name = card.querySelector('.apartment-card__name')
    const address = card.querySelector('.apartment-card__address')
    const price = card.querySelector('.apartment-card__price')
    if (!media || !originalLink || !body || !name || !price) return
    card.classList.add('launch-card')
    const favorite = card.querySelector('.apartment-card__favorite')
    if (favorite) {
      favorite.classList.remove('apartment-card__favorite')
      favorite.classList.add('launch-card__favorite')
      card.append(favorite)
      const storageKey = 'barnes-start-sales-favorites'
      const projectKey = new URL(originalLink.href).pathname.replace(/\/$/, '')
      const readFavorites = () => {
        try {
          const saved = JSON.parse(localStorage.getItem(storageKey) || '[]')
          return Array.isArray(saved) ? saved : []
        } catch { return [] }
      }
      const selected = readFavorites().includes(projectKey)
      favorite.setAttribute('aria-pressed', String(selected))
      favorite.setAttribute('aria-label', selected ? 'Удалить из избранного' : 'Добавить в избранное')
      favorite.addEventListener('click', () => {
        const items = readFavorites().filter((item) => item !== projectKey)
        if (favorite.getAttribute('aria-pressed') === 'true') items.push(projectKey)
        try { localStorage.setItem(storageKey, JSON.stringify(items)) } catch {}
      })
    }
    const link = document.createElement('a')
    link.className = 'apartment-card__link'
    link.href = originalLink.href
    link.setAttribute('aria-label', name.textContent.trim())
    const title = document.createElement('span')
    title.className = 'apartment-card__name'
    title.textContent = name.textContent.trim()
    name.replaceWith(title)
    const delivery = card.querySelector('.apartment-card__stat-value')
    if (delivery) {
      const badge = document.createElement('span')
      badge.className = 'apartment-card__delivery'
      badge.textContent = delivery.textContent.trim()
      media.append(badge)
    }
    body.querySelector('.apartment-card__topline')?.remove()
    body.querySelector('.apartment-card__stats')?.remove()
    if (address) {
      address.classList.add('launch-card__region')
      address.insertAdjacentHTML('afterbegin', '<svg class="launch-card__region-icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 14s4.5-4.35 4.5-8A4.5 4.5 0 0 0 3.5 6c0 3.65 4.5 8 4.5 8Z"/><circle cx="8" cy="6" r="1.65"/></svg>')
      body.prepend(address)
    }
    const details = document.createElement('div')
    details.className = 'apartment-card__details'
    const priceRow = document.createElement('div')
    priceRow.className = 'apartment-card__price-row'
    priceRow.append(price)
    details.append(priceRow)
    body.append(details)
    originalLink.replaceWith(...originalLink.childNodes)
    link.append(media, body)
    card.querySelector('.apartment-card__actions')?.remove()
    card.prepend(link)
  })
})()
