(() => {
  'use strict'

  const page = document.body
  if (!page.classList.contains('international-page')) return

  const header = document.querySelector('.site-header')
  const menuButton = document.querySelector('.site-header__icon-btn')
  const nav = document.querySelector('.catalog-page-nav')
  const toast = document.createElement('div')
  toast.className = 'international-toast'
  toast.setAttribute('role', 'status')
  document.body.append(toast)

  const showToast = (message) => {
    toast.textContent = message
    toast.classList.add('is-visible')
    window.clearTimeout(showToast.timer)
    showToast.timer = window.setTimeout(() => toast.classList.remove('is-visible'), 2600)
  }

  const menu = document.createElement('aside')
  menu.className = 'international-menu'
  menu.hidden = true
  menu.setAttribute('aria-label', 'Меню BARNES')
  menu.innerHTML = `
    <div class="international-menu__grid">
      <section class="international-menu__group"><h2>Недвижимость</h2>
        <a href="/mezhdunarodnaya-nedvizhimost.html">Зарубежная недвижимость</a>
        <a href="/gorodskaya-nedvizhimost/">Городская недвижимость</a>
        <a href="/zagorodnaya-nedvizhimost/">Загородная недвижимость</a>
      </section>
      <section class="international-menu__group"><h2>Направления</h2>
        <a href="/oae/">ОАЭ</a><a href="/ispaniya/">Испания</a><a href="/italiya/">Италия</a>
        <a href="/mezhdunarodnaya-nedvizhimost/turtsiya/">Турция</a><a href="/tailand/">Таиланд</a>
      </section>
      <section class="international-menu__group"><h2>BARNES Moscow</h2>
        <a href="/contacts/">Контакты</a><a href="/team/">Команда</a><a href="#catalog-contact">Оставить заявку</a>
      </section>
    </div>`
  document.body.append(menu)

  const setMenu = (open) => {
    menu.hidden = !open
    header?.classList.toggle('site-header--menu-open', open)
    menuButton?.setAttribute('aria-expanded', String(open))
    page.classList.toggle('international-menu-open', open)
  }
  menuButton?.setAttribute('aria-expanded', 'false')
  menuButton?.addEventListener('click', () => setMenu(menu.hidden))
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false)
  })

  const updateHeader = () => {
    header?.classList.toggle('site-header--scrolled', window.scrollY > 24)
  }
  window.addEventListener('scroll', updateHeader, { passive: true })
  updateHeader()

  const scrollTo = (selector) => {
    const target = document.querySelector(selector)
    if (!target) return
    const offset = (nav?.getBoundingClientRect().height || 0) + 16
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' })
  }

  const navTargets = ['.catalog-best-offers', '.catalog-map', '.catalog-consultation', '.departments-section', '.news-section']
  nav?.querySelectorAll('button').forEach((button, index) => {
    button.addEventListener('click', () => scrollTo(navTargets[index]))
  })

  const bestOffers = document.querySelector('.catalog-best-offers')
  const bestOfferImages = [...document.querySelectorAll('img')]
    .filter((image) => image.src.includes('selstorage.ru'))
    .slice(0, 3)
  if (bestOffers && bestOfferImages.length && !bestOffers.querySelector('.international-offer-strip')) {
    const offerStrip = document.createElement('div')
    offerStrip.className = 'international-offer-strip'
    const offerNames = [
      ['Жемчужина Стамбула в Кыгытхане', 'Стамбул'],
      ['AL JURF GARDENS', 'Дубай'],
      ['AMAZI SALALAH', 'Салала']
    ]
    bestOfferImages.forEach((image, index) => {
      const card = document.createElement('article')
      card.className = 'international-offer-card'
      const clone = image.cloneNode(true)
      clone.alt = offerNames[index][0]
      card.innerHTML = '<div class="international-offer-card__media"></div>'
      card.querySelector('.international-offer-card__media').append(clone)
      card.insertAdjacentHTML('beforeend', `<p class="international-offer-card__name">${offerNames[index][0]}</p><p class="international-offer-card__place">${offerNames[index][1]}</p>`)
      offerStrip.append(card)
    })
    bestOffers.querySelector('.catalog-best-offers__header')?.after(offerStrip)
  }

  const news = document.querySelector('.news-section')
  if (news && !news.querySelector('.international-news-grid')) {
    const newsItems = [
      ['https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/11174655/8f5ddbc1f811f957fe777caaf9cef323/iblock/9a9/9a9041c1611692076e767fdcd4a2fb6d/32bb1c09e2de90b389dcf4bd8cfa3802.png', 'Forbes обновил мировой рейтинг городов по числу миллиардеров: Москва опустилась на третье место'],
      ['https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/11174656/8f5ddbc1f811f957fe777caaf9cef323/iblock/48e/48e3fba91f6bfc920f2e2c77244dcf82/8b67d18cf8e818fb793c259ffb3fed78.png', 'Инвестиции в туризм Алтайского края выросли в полтора раза за год'],
      ['https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/11174654/8f5ddbc1f811f957fe777caaf9cef323/iblock/753/753a5fd832550d48dca46a89a654e6e9/f65d8dbc17c559c5df2fd4ac4d1c0c94.png', 'Москва вошла в топ-5 городов мира по ценам на элитное жилье'],
      ['https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/11138184/8f5ddbc1f811f957fe777caaf9cef323/iblock/090/0901ea8a8fe1ab26001aa935c0442cea/f19bce520e61659e0feb1844a98319ae.png', 'Состоятельные покупатели стимулируют рынок брендовой недвижимости в Дубае'],
      ['https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/11183306/8f5ddbc1f811f957fe777caaf9cef323/iblock/a3f/a3f9a05b430280e2897d887fbf6bfe12/764e3d4bccb6027b30366e2f2bf025d2.jpg', 'Стоимость недвижимости делюкс-сегмента выросла в третьем квартале 2024'],
      ['https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/11177242/8f5ddbc1f811f957fe777caaf9cef323/iblock/1d1/1d19c59186122a2d4c2b21fa848f77ac/32b04ebf9a2af2e54c68f782cb58f3f9.png', 'Опубликован рейтинг городов по уровню ресторанного обслуживания']
    ]
    const grid = document.createElement('div')
    grid.className = 'international-news-grid'
    newsItems.forEach(([src, title]) => {
      const card = document.createElement('article')
      card.className = 'international-news-card'
      card.innerHTML = `<a href="https://front.barnes.vsavr.ru/media/novosti/"><img src="${src}" alt="${title}"><p>${title}</p><span>Читать подробнее</span></a>`
      grid.append(card)
    })
    news.querySelector('.news-section__header')?.after(grid)
  }

  const heroSearch = document.querySelector('.catalog-hero-filters__search-input')
  const submitSearch = document.querySelector('.catalog-hero-filters__submit')
  const catalog = document.querySelector('.catalog-grid')
  const cards = [...document.querySelectorAll('.apartment-card--catalog')]
  const applySearch = () => {
    const query = heroSearch?.value.trim().toLocaleLowerCase('ru') || ''
    let matches = 0
    cards.forEach((card) => {
      const visible = !query || card.textContent.toLocaleLowerCase('ru').includes(query)
      card.closest('.catalog-grid__item')?.classList.toggle('is-filtered', !visible)
      if (visible) matches += 1
    })
    if (catalog) scrollTo('.catalog-grid')
    showToast(query ? `Найдено объектов: ${matches}` : 'Показаны все объекты')
  }
  heroSearch?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { event.preventDefault(); applySearch() }
  })
  submitSearch?.addEventListener('click', applySearch)

  const sort = document.querySelector('.catalog-grid__sort-select')
  sort?.addEventListener('change', () => {
    const items = [...document.querySelectorAll('.catalog-grid__item')]
    const direction = sort.value.includes('desc') || sort.value.includes('high') ? -1 : 1
    if (!sort.value || sort.selectedIndex === 0) return
    const value = (item) => Number((item.textContent.match(/[\d\s]+\s₽/)?.[0] || '0').replace(/\D/g, ''))
    items.sort((a, b) => (value(a) - value(b)) * direction).forEach((item) => item.parentElement.append(item))
  })

  document.querySelectorAll('.catalog-quick-filters__button').forEach((button) => {
    button.addEventListener('click', () => {
      const value = button.querySelector('.catalog-quick-filters__value')
      if (!value) return
      value.textContent = value.textContent === 'Не выбрано' ? 'Выбрано' : 'Не выбрано'
      button.classList.toggle('is-selected')
    })
  })

  const offerRow = document.querySelector('.catalog-best-offers__slider-row')
  document.querySelectorAll('.catalog-best-offers__nav-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const delta = button.classList.contains('catalog-best-offers__nav-btn--prev') ? -1 : 1
      offerRow?.scrollBy({ left: delta * Math.max(320, offerRow.clientWidth * .6), behavior: 'smooth' })
    })
  })

  document.querySelectorAll('.catalog-faq__question').forEach((question) => {
    const item = question.closest('.catalog-faq__item')
    const answer = item?.querySelector('.catalog-faq__answer')
    question.setAttribute('aria-expanded', String(!answer?.hidden))
    question.addEventListener('click', () => {
      if (!answer) return
      answer.hidden = !answer.hidden
      question.setAttribute('aria-expanded', String(!answer.hidden))
      item?.classList.toggle('is-open', !answer.hidden)
    })
  })

  const map = document.querySelector('.catalog-map')
  if (map && !map.querySelector('.international-map-fallback')) {
    const viewport = document.createElement('div')
    viewport.className = 'catalog-projects-map'
    viewport.setAttribute('aria-label', 'Карта объектов BARNES')
    viewport.innerHTML = `
      <div class="international-map-fallback"></div>
      <div class="international-map-markers" aria-live="polite"></div>
      <div class="international-map-zoom" aria-label="Управление масштабом"><button type="button" data-map-zoom="in" aria-label="Увеличить карту">+</button><button type="button" data-map-zoom="out" aria-label="Уменьшить карту">−</button></div>
      <div class="international-map-controls"><label><input type="search" placeholder="Поиск в видимой области" aria-label="Поиск в видимой области"></label><button type="button" data-map-fullscreen>На весь экран</button></div>
      <div class="international-map-popup" hidden>
        <button type="button" class="international-map-popup__close" aria-label="Закрыть карточку">×</button>
        <p class="international-map-popup__kicker">Направление BARNES</p><h3></h3><p></p><a href="#catalog-contact">Подробнее ↗</a>
      </div>`
    map.append(viewport)
    const markers = viewport.querySelector('.international-map-markers')
    const popup = viewport.querySelector('.international-map-popup')
    const search = viewport.querySelector('input[type="search"]')
    const fallback = viewport.querySelector('.international-map-fallback')
    const places = [['Дубай', 'ОАЭ', 22, 34], ['Стамбул', 'Турция', 45, 25], ['Рим', 'Италия', 57, 48], ['Париж', 'Франция', 48, 62], ['Бангкок', 'Таиланд', 78, 52]]
    places.forEach(([name, country, x, y]) => {
      const marker = document.createElement('button')
      marker.className = 'international-map-marker'
      marker.type = 'button'
      marker.style.left = `${x}%`
      marker.style.top = `${y}%`
      marker.dataset.search = `${name} ${country}`.toLocaleLowerCase('ru')
      marker.setAttribute('aria-label', `${name}, ${country}`)
      marker.addEventListener('click', () => {
        popup.querySelector('h3').textContent = name
        popup.querySelector('p:not(.international-map-popup__kicker)').textContent = country
        popup.hidden = false
      })
      markers.append(marker)
    })
    popup.querySelector('.international-map-popup__close').addEventListener('click', () => { popup.hidden = true })
    search.addEventListener('input', () => {
      const query = search.value.trim().toLocaleLowerCase('ru')
      markers.querySelectorAll('.international-map-marker').forEach((marker) => {
        marker.hidden = Boolean(query) && !marker.dataset.search.includes(query)
      })
    })
    viewport.querySelector('[data-map-fullscreen]').addEventListener('click', (event) => {
      const fullscreen = viewport.classList.toggle('international-map--fullscreen')
      event.currentTarget.textContent = fullscreen ? 'Свернуть' : 'На весь экран'
    })
    let scale = 1
    viewport.querySelectorAll('[data-map-zoom]').forEach((button) => {
      button.addEventListener('click', () => {
        scale = Math.min(1.4, Math.max(.85, scale + (button.dataset.mapZoom === 'in' ? .12 : -.12)))
        fallback.style.transform = `scale(${scale})`
      })
    })
  }

  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault()
      const button = form.querySelector('button[type="submit"]')
      if (!button) return
      const label = button.textContent
      button.textContent = 'Заявка отправлена'
      button.disabled = true
      window.setTimeout(() => { button.textContent = label; button.disabled = false }, 2400)
    })
  })

  document.querySelectorAll('.floating-expert__close').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation()
      button.closest('.floating-expert')?.remove()
    })
  })
})()
