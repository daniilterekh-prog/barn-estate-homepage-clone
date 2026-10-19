(() => {
  'use strict'
  const KEY = 'barnes-catalog-favorites'
  const page = document.body.hasAttribute('data-favorites-page')
  const preview = page && new URLSearchParams(location.search).get('preview') === '1'
  const grid = document.querySelector('[data-favorites-grid]')
  if (grid) grid.append(document.querySelector('#favorites-card-templates').content.cloneNode(true))
  const cards = [...document.querySelectorAll('[data-favorite-id]')]
  const sort = document.querySelector('[data-favorites-sort]')
  const toast = document.querySelector('.favorites-toast')
  const fallbackImage = new URL('photo-unavailable.svg', document.currentScript.src).href
  let storageAvailable = true, kind = 'all', undo = null, timer
  function read() {
    try {
      const value = JSON.parse(localStorage.getItem(KEY) || '[]')
      return Array.isArray(value) ? [...new Set(value.filter(id => typeof id === 'string' && /^[a-zA-Z0-9:_-]{1,100}$/.test(id)))] : []
    } catch { return [] }
  }
  let ids = preview ? ['demo:384721', 'project:grand-hotel'] : read()
  function countText(count) {
    const last = count % 10, lastTwo = count % 100
    return `${count} ${lastTwo >= 11 && lastTwo <= 14 ? 'объектов' : last === 1 ? 'объект' : last >= 2 && last <= 4 ? 'объекта' : 'объектов'}`
  }
  function persist() {
    if (!preview) {
      try { localStorage.setItem(KEY, JSON.stringify(ids)); storageAvailable = true }
      catch { storageAvailable = false }
    }
    render()
  }
  function notify(message) {
    if (!toast) return
    clearTimeout(timer)
    toast.querySelector('[data-favorites-message]').textContent = message
    toast.hidden = false
    timer = setTimeout(() => { toast.hidden = true; undo = null }, 15000)
  }
  function fallback(image) {
    image.onerror = null
    image.src = fallbackImage
    image.alt = 'Фото объекта временно недоступно'
  }
  cards.forEach(card => {
    const image = card.querySelector('img')
    image.onerror = () => fallback(image)
    if (image.complete && !image.naturalWidth) fallback(image)
  })
  function render() {
    document.querySelectorAll('.header-link__count, [data-favorites-total]').forEach(el => { el.textContent = ids.length })
    document.querySelectorAll('.header-link--favorites, .site-header__favorites-btn').forEach(el => el.setAttribute('aria-label', `Избранное: ${countText(ids.length)}`))
    cards.forEach(card => {
      const selected = ids.includes(card.dataset.favoriteId)
      const button = card.querySelector('.apartment-card__favorite, .card__favorite')
      const title = card.querySelector('.apartment-card__name-text, .card__title').textContent
      button.setAttribute('aria-pressed', String(selected))
      button.setAttribute('aria-label', `${selected ? 'Удалить из избранного' : 'Добавить в избранное'}: ${title}`)
      button.classList.toggle('apartment-card__favorite--active', selected)
      // Existing catalog uses a text heart; approved ListingCard keeps its SVG intact.
      if (!button.querySelector('svg')) button.textContent = selected ? '♥' : '♡'
      if (page) card.hidden = !selected || (kind !== 'all' && card.dataset.kind !== kind)
    })
    if (!page) return
    const selectedCards = cards.filter(card => ids.includes(card.dataset.favoriteId))
    const visible = selectedCards.filter(card => kind === 'all' || card.dataset.kind === kind)
    const order = sort.value
    visible.sort((a,b) => {
      if (order === 'price-asc') return Number(a.dataset.price) - Number(b.dataset.price)
      if (order === 'price-desc') return Number(b.dataset.price) - Number(a.dataset.price)
      return ids.indexOf(b.dataset.favoriteId) - ids.indexOf(a.dataset.favoriteId)
    }).forEach(card => grid.append(card))
    document.querySelectorAll('[data-kind-count]').forEach(el => { el.textContent = el.dataset.kindCount === 'all' ? selectedCards.length : selectedCards.filter(card => card.dataset.kind === el.dataset.kindCount).length })
    document.querySelectorAll('[data-favorites-kind]').forEach(button => { const active = button.dataset.favoritesKind === kind; button.classList.toggle('is-active', active); button.setAttribute('aria-pressed', String(active)) })
    grid.hidden = visible.length === 0
    document.querySelector('[data-favorites-empty]').hidden = visible.length > 0
    document.querySelector('[data-empty-title]').textContent = selectedCards.length ? 'В этом разделе пока ничего нет' : 'В избранном пока ничего нет'
    document.querySelector('[data-favorites-count]').textContent = countText(visible.length)
    document.querySelector('[data-favorites-clear]').hidden = selectedCards.length === 0
    document.querySelector('[data-preview-notice]').hidden = !preview
    document.querySelector('[data-storage-note]').textContent = preview ? 'Режим просмотра: изменения не сохраняются.' : storageAvailable ? 'Подборка сохраняется в этом браузере.' : 'Хранилище недоступно. Подборка сохранится только до закрытия страницы.'
  }
  cards.forEach(card => card.querySelector('.apartment-card__favorite, .card__favorite').addEventListener('click', () => {
    const id = card.dataset.favoriteId
    const selected = ids.includes(id)
    if (page) undo = [...ids]
    ids = selected ? ids.filter(value => value !== id) : [...ids,id]
    persist()
    if (page && selected) {
      notify('Объект удалён из избранного')
      const next = cards.find(item => !item.hidden)
      ;(next ? next.querySelector('.apartment-card__favorite') : document.querySelector('[data-favorites-empty] a')).focus({preventScroll:true})
    }
  }))
  document.querySelectorAll('[data-favorites-kind]').forEach(button => button.addEventListener('click', () => {kind = button.dataset.favoritesKind;render()}))
  document.querySelector('[data-favorites-clear]')?.addEventListener('click', () => {undo = [...ids];ids=[];persist();notify('Избранное очищено');document.querySelector('[data-favorites-undo]').focus({preventScroll:true})})
  document.querySelector('[data-favorites-undo]')?.addEventListener('click', () => {
    if (!undo) return
    ids=undo;undo=null;persist();clearTimeout(timer);toast.hidden=true
    cards.find(card => !card.hidden)?.querySelector('.apartment-card__favorite').focus({preventScroll:true})
  })
  sort?.addEventListener('change',render)
  window.addEventListener('storage',event => {
    if (!preview && (event.key === KEY || event.key === null)) {ids=read();undo=null;if(toast)toast.hidden=true;render()}
  })
  window.BarnesFavorites = Object.freeze({
    getIds: () => [...ids],
    add: id => { if (typeof id === 'string' && /^[a-zA-Z0-9:_-]{1,100}$/.test(id) && !ids.includes(id)) {ids.push(id);persist()} },
    remove: id => {ids=ids.filter(value=>value!==id);persist()}
  })
  render()
})()
