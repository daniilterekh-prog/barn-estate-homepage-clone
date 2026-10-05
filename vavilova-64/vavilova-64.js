(() => {
  const $ = (selector, root = document) => root.querySelector(selector)
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)]
  const header = $('[data-header]')
  const menu = $('[data-menu]')

  const setMenu = (open) => {
    menu.classList.toggle('is-open', open)
    menu.setAttribute('aria-hidden', String(!open))
    $('[data-menu-open]').setAttribute('aria-expanded', String(open))
    document.body.style.overflow = open ? 'hidden' : ''
  }
  $('[data-menu-open]').addEventListener('click', () => setMenu(true))
  $$('[data-menu-close]').forEach((button) => button.addEventListener('click', () => setMenu(false)))
  $$('.menu-drawer nav a').forEach((link) => link.addEventListener('click', () => setMenu(false)))

  const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 60)
  window.addEventListener('scroll', updateHeader, { passive: true })
  updateHeader()

  const anchors = $$('[data-anchor-nav] a')
  const sections = anchors.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean)
  const anchorObserver = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
    if (!visible) return
    anchors.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${visible.target.id}`))
  }, { rootMargin: '-35% 0px -55% 0px', threshold: [0, .2, .8] })
  sections.forEach((section) => anchorObserver.observe(section))

  $$('[data-expand]').forEach((button) => button.addEventListener('click', () => {
    const content = document.getElementById(button.dataset.expand)
    const isHidden = content.hasAttribute('hidden')
    content.toggleAttribute('hidden', !isHidden)
    button.firstChild.textContent = isHidden ? 'скрыть ' : 'читать далее '
  }))

  const gallerySlides = $$('.gallery__slide')
  let galleryIndex = 0
  const setGallery = (index) => {
    galleryIndex = (index + gallerySlides.length) % gallerySlides.length
    gallerySlides.forEach((slide, i) => slide.classList.toggle('is-active', i === galleryIndex))
    $('[data-gallery-current]').textContent = String(galleryIndex + 1).padStart(2, '0')
  }
  $('[data-gallery-prev]').addEventListener('click', () => setGallery(galleryIndex - 1))
  $('[data-gallery-next]').addEventListener('click', () => setGallery(galleryIndex + 1))

  const maps = {
    culture: [['МГУ имени М. В. Ломоносова', '7 минут пешком'], ['Московский дворец пионеров', '10 минут на автомобиле'], ['Парк Воробьёвы горы', '12 минут пешком']],
    transport: [['Метро «Университет»', '12 минут пешком'], ['ТТК', '8 минут на автомобиле'], ['Ленинский проспект', '5 минут на автомобиле']],
    universities: [['МГУ имени М. В. Ломоносова', '7 минут пешком'], ['РАНХиГС', '14 минут на автомобиле'], ['МГИМО', '18 минут на автомобиле']],
    parks: [['Парк Воробьёвы горы', '12 минут пешком'], ['Нескучный сад', '18 минут на автомобиле'], ['Ботанический сад МГУ', '15 минут на автомобиле']],
    shops: [['ТЦ «Капитолий»', '10 минут на автомобиле'], ['ВкусВилл', '5 минут пешком'], ['Азбука вкуса', '7 минут пешком']],
    schools: [['Лицей №1586', '9 минут пешком'], ['Школа №1533', '11 минут на автомобиле'], ['Детский сад «Радуга»', '8 минут пешком']],
  }
  const mapList = $('[data-map-list]')
  $$('[data-map-tab]').forEach((tab) => tab.addEventListener('click', () => {
    $$('[data-map-tab]').forEach((item) => item.classList.toggle('is-active', item === tab))
    mapList.innerHTML = maps[tab.dataset.mapTab].map(([title, time]) => `<div><strong>${title}</strong><span>${time}</span></div>`).join('')
  }))

  const number = (value) => new Intl.NumberFormat('ru-RU').format(Math.round(value))
  const priceSlider = $('[data-price-slider]')
  const downSlider = $('[data-down-slider]')
  const termSlider = $('[data-term-slider]')
  const updateMortgage = () => {
    const price = Number(priceSlider.value)
    const down = Number(downSlider.value)
    const term = Number(termSlider.value)
    const monthlyRate = .219 / 12
    const months = term * 12
    const principal = Math.max(price - down, 0)
    const payment = principal * monthlyRate * (1 + monthlyRate) ** months / ((1 + monthlyRate) ** months - 1)
    $('[data-price-output]').textContent = `${number(price)} ₽`
    $('[data-down-output]').textContent = `${number(down)} ₽`
    $('[data-term-output]').textContent = `${term} лет`
    $('[data-payment]').textContent = `${number(payment)} ₽`
  }
  ;[priceSlider, downSlider, termSlider].forEach((slider) => slider.addEventListener('input', updateMortgage))

  const constructionData = {
    2025: ['assets/vavilova-64-render-towers-sunset.webp', '2025 ГОД'],
    2026: ['assets/vavilova-64-render-day-facade.webp', '2026 ГОД'],
  }
  $$('[data-construction-tab]').forEach((tab) => tab.addEventListener('click', () => {
    $$('[data-construction-tab]').forEach((item) => item.classList.toggle('is-active', item === tab))
    const [src, label] = constructionData[tab.dataset.constructionTab]
    $('[data-construction-image]').src = src
    $('[data-construction-image]').alt = `Ход строительства, ${label.toLowerCase()}`
    $('[data-construction-year]').textContent = label
  }))

  const docList = $('[data-doc-list]')
  $('[data-doc-prev]').addEventListener('click', () => docList.scrollBy({ left: -300, behavior: 'smooth' }))
  $('[data-doc-next]').addEventListener('click', () => docList.scrollBy({ left: 300, behavior: 'smooth' }))

  const toast = $('[data-toast]')
  const showToast = (message) => {
    toast.textContent = message
    toast.classList.add('is-visible')
    window.clearTimeout(showToast.timer)
    showToast.timer = window.setTimeout(() => toast.classList.remove('is-visible'), 3000)
  }
  $$('[data-presentation]').forEach((button) => button.addEventListener('click', () => showToast('Презентация будет отправлена после консультации')))
  $$('[data-consult]').forEach((button) => button.addEventListener('click', () => document.querySelector('#consultation').scrollIntoView({ behavior: 'smooth' })))
  $('[data-consult-form]').addEventListener('submit', (event) => {
    event.preventDefault()
    $('[data-form-status]').textContent = 'Спасибо! Эксперт свяжется с вами в ближайшее время.'
    event.currentTarget.reset()
  })
})()
