(() => {
  const $ = (selector, root = document) => root.querySelector(selector)
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)]
  const toast = (message) => {
    const node = $('[data-toast]')
    node.textContent = message
    node.classList.add('is-visible')
    clearTimeout(toast.timer)
    toast.timer = setTimeout(() => node.classList.remove('is-visible'), 2400)
  }

  const fallbackImage = 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/iblock/7cf/7cfad5e752a2fef5bb64bac5b0cfd356/1ae6ebb621690055c8904fa66e54c6ec.png'
  $$('img').forEach((image) => image.addEventListener('error', () => {
    if (image.src !== fallbackImage) image.src = fallbackImage
  }))

  const menu = $('[data-mobile-menu]')
  const menuToggle = $('[data-menu-toggle]')
  menuToggle?.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open')
    menu.setAttribute('aria-hidden', String(!open))
    menuToggle.setAttribute('aria-expanded', String(open))
  })
  $$('.mobile-menu a').forEach((link) => link.addEventListener('click', () => {
    menu.classList.remove('is-open')
    menu.setAttribute('aria-hidden', 'true')
    menuToggle.setAttribute('aria-expanded', 'false')
  }))

  $('[data-focus-search]')?.addEventListener('click', () => $('[data-search-input]')?.focus())
  $('[data-filter-button]')?.addEventListener('click', () => toast('Фильтры доступны после выбора параметров'))
  $('[data-hero-form]')?.addEventListener('submit', (event) => {
    event.preventDefault()
    document.querySelector('#catalog-grid')?.scrollIntoView({ behavior: 'smooth' })
  })

  $$('.property-card__favorite').forEach((button) => button.addEventListener('click', () => {
    const active = button.getAttribute('aria-pressed') === 'true'
    button.setAttribute('aria-pressed', String(!active))
    button.textContent = active ? '♡' : '♥'
    button.setAttribute('aria-label', active ? 'Добавить в избранное' : 'Удалить из избранного')
    const count = $$('[aria-pressed="true"]', document).length
    $('[data-favorite-count]').textContent = count
    $('[data-favorite-count]').style.display = count ? 'inline-flex' : 'none'
  }))
  $$('[data-call]').forEach((button) => button.addEventListener('click', () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
    toast('Оставьте номер — эксперт свяжется с вами')
  }))

  const grid = $('[data-property-grid]')
  $('[data-sort]')?.addEventListener('change', (event) => {
    const cards = $$('.property-card', grid)
    const value = event.target.value
    cards.sort((a, b) => {
      if (value === 'price-asc') return Number(a.dataset.price) - Number(b.dataset.price)
      if (value === 'price-desc') return Number(b.dataset.price) - Number(a.dataset.price)
      if (value === 'area-desc') return Number(b.dataset.area) - Number(a.dataset.area)
      return 0
    }).forEach((card) => grid.append(card))
  })
  $('[data-show-more]')?.addEventListener('click', (event) => {
    $$('.property-card', grid).forEach((card) => { card.style.display = 'block' })
    event.currentTarget.hidden = true
  })

  $('[data-intro-toggle]')?.addEventListener('click', (event) => {
    const details = $('[data-intro-details]')
    const open = details.classList.toggle('is-open')
    event.currentTarget.innerHTML = open ? 'скрыть <span>↗</span>' : 'читать далее <span>↗</span>'
  })
  $('[data-contact-form]')?.addEventListener('submit', (event) => {
    event.preventDefault()
    $('[data-form-status]').textContent = 'Спасибо! Мы свяжемся с вами в ближайшее время.'
    event.currentTarget.reset()
  })
  $('[data-scroll-contact]')?.addEventListener('click', () => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }))
  $$('.contact-methods button').forEach((button) => button.addEventListener('click', () => {
    $$('.contact-methods button').forEach((item) => item.classList.remove('is-active'))
    button.classList.add('is-active')
  }))

  const expert = $('[data-floating-expert]')
  setTimeout(() => expert?.classList.add('is-visible'), 1400)
  $('[data-close-expert]')?.addEventListener('click', () => expert.classList.remove('is-visible'))
})()
