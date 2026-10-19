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
    const button = event.target.closest('button')
    if (!button) return
    if (button.matches('[data-contact-open]')) document.querySelector('#contact-dialog').showModal()
    if (button.matches('[data-close-dialog]')) button.closest('dialog').close()
  })
  document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', event => {
    if (event.target !== dialog) return
    const rect = dialog.getBoundingClientRect()
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close()
  }))
})()
