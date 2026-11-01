(() => {
  // Host state required by the source dropdown; this page exposes sorting only.
  const sort = document.querySelector('[data-favorites-sort]')
  window.BarnesFilters = Object.freeze({
    getState: () => ({ sort: sort.value }),
    patch: fields => {
      if (Object.keys(fields).some(key => key !== 'sort')) throw new TypeError('Favorites supports sorting only')
      if ([...sort.options].some(option => option.value === fields.sort)) {
        sort.value = fields.sort
        sort.dispatchEvent(new Event('change', { bubbles: true }))
      }
    }
  })
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-contact-open]')
    if (!button) return
    const card = button.closest('[data-favorite-id]')
    const context = card ? {
      id: card.dataset.favoriteId,
      name: card.querySelector('.apartment-card__name-text').textContent.trim(),
      href: card.querySelector('.apartment-card__media-link').href
    } : null
    window.__barnesOwnerForm?.open({trigger: button, context})
  })
})()
