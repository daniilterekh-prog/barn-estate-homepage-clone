(() => {
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
