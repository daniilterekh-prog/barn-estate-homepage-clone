(() => {
  const header = document.querySelector('.site-header')
  const sticky = document.querySelector('.owner-sale-sticky')
  const hero = document.querySelector('.owner-sale-hero')
  const body = document.body

  const updateChrome = () => {
    const scrolled = window.scrollY > 24
    header?.classList.toggle('site-header--scrolled', scrolled)
    const stickyVisible = window.scrollY > Math.max((hero?.offsetHeight || 520) - 160, 260)
    sticky?.classList.toggle('owner-sale-sticky--visible', stickyVisible)
    sticky?.setAttribute('aria-hidden', String(!stickyVisible))
  }

  let ticking = false
  window.addEventListener('scroll', () => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(() => {
      updateChrome()
      ticking = false
    })
  }, { passive: true })
  window.addEventListener('resize', updateChrome)
  updateChrome()

  const scrollToTarget = (selector) => {
    const target = document.querySelector(selector) || (selector === '#articles' ? document.querySelector('.newsletter-cta') : null)
    if (!target) return
    const offset = (sticky?.classList.contains('owner-sale-sticky--visible') ? sticky.offsetHeight : 0) + 16
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' })
  }

  const stickyTargets = ['#about', '#stages', '#property-types', '#request', '#articles']
  document.querySelectorAll('.owner-sale-sticky__link').forEach((button, index) => {
    button.addEventListener('click', () => scrollToTarget(stickyTargets[index]))
  })

  document.querySelector('.owner-sale-strategy__button')?.addEventListener('click', () => scrollToTarget('#request'))
  document.querySelector('.owner-sale-hero__button')?.addEventListener('click', () => scrollToTarget('#request'))

  document.querySelectorAll('.catalog-contact__method').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.catalog-contact__method').forEach((item) => {
        item.classList.remove('catalog-contact__method--active')
        item.setAttribute('aria-selected', 'false')
      })
      button.classList.add('catalog-contact__method--active')
      button.setAttribute('aria-selected', 'true')
    })
  })

  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault()
      const submit = form.querySelector('button[type="submit"]')
      if (!submit) return
      const original = submit.textContent
      submit.textContent = 'Заявка отправлена'
      submit.disabled = true
      window.setTimeout(() => {
        submit.textContent = original
        submit.disabled = false
      }, 2400)
    })
  })

  const menuButton = document.querySelector('.site-header__icon-btn')
  const menu = document.createElement('div')
  menu.className = 'local-menu'
  menu.hidden = true
  menu.innerHTML = '<nav aria-label="Основное меню"><a href="https://front.barnes.vsavr.ru/gorodskaya-nedvizhimost/">Купить недвижимость</a><a href="https://front.barnes.vsavr.ru/prodazha_sobstvennikam/">Собственникам</a><a href="https://front.barnes.vsavr.ru/media/blog/">Журнал BARNES</a><a href="#request">Оставить заявку</a></nav>'
  document.body.append(menu)

  const setMenuOpen = (open) => {
    menu.hidden = !open
    header?.classList.toggle('site-header--menu-open', open)
    menuButton?.setAttribute('aria-expanded', String(open))
  }
  menuButton?.setAttribute('aria-expanded', 'false')
  menuButton?.addEventListener('click', () => setMenuOpen(menu.hidden))
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenuOpen(false)
  })
})()

;(() => {
  const hero = document.querySelector('.owner-sale-hero')
  if (!hero || !window.location.pathname.endsWith('/projects-map.html') || document.querySelector('[data-project-map]')) return

  const projects = [
    { name: 'ЖК «Берег Столицы»', address: 'Таманская улица, 3', x: 24, y: 34, href: 'https://barn-estate.ru/gorodskaya-nedvizhimost/' },
    { name: 'Клубный дом «Афанасьевский»', address: 'Большой Афанасьевский переулок, 28', x: 57, y: 29, href: 'https://barn-estate.ru/gorodskaya-nedvizhimost/' },
    { name: 'ЖК «SLAVA»', address: 'Ленинградский проспект, 37', x: 69, y: 52, href: 'https://barn-estate.ru/gorodskaya-nedvizhimost/' },
    { name: 'ЖК «HIDE»', address: 'Шелепихинская набережная, 34', x: 41, y: 68, href: 'https://barn-estate.ru/gorodskaya-nedvizhimost/' },
  ]

  const markup = `<div id="catalog-map" class="catalog-page-section local-catalog-map-section"><section class="catalog-map" aria-label="Карта проектов"><div class="base-container"><div class="catalog-map__header"><h2 class="catalog-map__title">Проекты на карте</h2><p class="catalog-map__text">На карте собраны проекты, представленные в портфеле BARNES. Смотрите, где они расположены, сравнивайте локации и выбирайте недвижимость в подходящем районе Москвы.</p></div><div class="catalog-projects-map" data-project-map><div class="catalog-projects-map__canvas" data-yandex-map role="application" aria-label="Карта проектов BARNES"><div class="local-map-fallback" aria-hidden="true"><span class="local-map-fallback__road local-map-fallback__road--ring"></span><span class="local-map-fallback__road local-map-fallback__road--north"></span><span class="local-map-fallback__road local-map-fallback__road--west"></span><span class="local-map-fallback__water"></span><span class="local-map-fallback__district local-map-fallback__district--center">ЦАО</span><span class="local-map-fallback__district local-map-fallback__district--south">ЮАО</span></div><div class="local-map-markers" data-map-markers aria-live="polite"></div></div><div class="catalog-projects-map__controls"><label class="catalog-projects-map__search"><span class="catalog-projects-map__search-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg></span><span class="visually-hidden">Поиск проектов в видимой области</span><input type="search" class="catalog-projects-map__search-input" data-map-search placeholder="Поиск в видимой области" autocomplete="off"></label><button type="button" class="catalog-projects-map__fullscreen" data-map-fullscreen aria-pressed="false"><svg class="catalog-projects-map__fullscreen-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 1 2-2v-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg><span data-map-fullscreen-label>На весь экран</span></button></div><div class="catalog-projects-map__zoom-wrap" aria-label="Управление масштабом"><button type="button" class="catalog-projects-map__zoom catalog-projects-map__zoom--in" data-map-zoom="in" aria-label="Увеличить карту">+</button><button type="button" class="catalog-projects-map__zoom catalog-projects-map__zoom--out" data-map-zoom="out" aria-label="Уменьшить карту">−</button></div><div class="catalog-projects-map__popup" data-map-popup hidden><button type="button" class="catalog-projects-map__popup-close" data-map-popup-close aria-label="Закрыть карточку проекта">×</button><p class="catalog-projects-map__popup-kicker">Проект BARNES</p><h3 data-map-popup-title></h3><p data-map-popup-address></p><a data-map-popup-link href="#request">Подробнее <span aria-hidden="true">↗</span></a></div></div></div></section></div>`
  hero.insertAdjacentHTML('afterend', markup)

  const section = document.querySelector('[data-project-map]')
  const markers = section.querySelector('[data-map-markers]')
  const search = section.querySelector('[data-map-search]')
  const popup = section.querySelector('[data-map-popup]')
  const popupTitle = section.querySelector('[data-map-popup-title]')
  const popupAddress = section.querySelector('[data-map-popup-address]')
  const popupLink = section.querySelector('[data-map-popup-link]')
  const fullscreenButton = section.querySelector('[data-map-fullscreen]')
  const mapCanvas = section.querySelector('[data-yandex-map]')
  let mapInstance
  let fallbackZoom = 1

  if (window.location.hash === '#catalog-map') {
    requestAnimationFrame(() => section.scrollIntoView({ block: 'start' }))
  }

  const renderMarkers = (query = '') => {
    const normalized = query.trim().toLocaleLowerCase('ru')
    markers.innerHTML = ''
    projects.forEach((project, index) => {
      const visible = !normalized || `${project.name} ${project.address}`.toLocaleLowerCase('ru').includes(normalized)
      if (!visible) return
      const marker = document.createElement('button')
      marker.type = 'button'
      marker.className = 'local-map-marker'
      marker.style.left = `${project.x}%`
      marker.style.top = `${project.y}%`
      marker.dataset.projectIndex = String(index)
      marker.setAttribute('aria-label', project.name)
      marker.innerHTML = '<span aria-hidden="true"></span>'
      marker.addEventListener('click', () => {
        popupTitle.textContent = project.name
        popupAddress.textContent = project.address
        popupLink.href = project.href
        popup.hidden = false
      })
      markers.append(marker)
    })
  }

  const applyFallbackZoom = () => {
    mapCanvas.style.setProperty('--local-map-scale', String(fallbackZoom))
  }

  renderMarkers()
  search.addEventListener('input', () => renderMarkers(search.value))
  section.querySelector('[data-map-popup-close]').addEventListener('click', () => { popup.hidden = true })
  section.querySelectorAll('[data-map-zoom]').forEach((button) => {
    button.addEventListener('click', () => {
      const direction = button.dataset.mapZoom === 'in' ? 0.12 : -0.12
      fallbackZoom = Math.min(1.42, Math.max(0.86, fallbackZoom + direction))
      applyFallbackZoom()
      if (mapInstance?.setLocation) mapInstance.setLocation({ zoom: 11 + Math.round((fallbackZoom - 1) * 4), duration: 220 })
    })
  })

  const updateFullscreenLabel = (isFullscreen) => {
    fullscreenButton.setAttribute('aria-pressed', String(isFullscreen))
    fullscreenButton.querySelector('[data-map-fullscreen-label]').textContent = isFullscreen ? 'Свернуть' : 'На весь экран'
  }
  fullscreenButton.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement === section) await document.exitFullscreen()
      else await section.requestFullscreen()
    } catch (_) {
      section.classList.toggle('catalog-projects-map--fullscreen')
      updateFullscreenLabel(section.classList.contains('catalog-projects-map--fullscreen'))
    }
  })
  document.addEventListener('fullscreenchange', () => updateFullscreenLabel(document.fullscreenElement === section))

  const initYandexMap = async () => {
    const script = document.createElement('script')
    script.src = 'https://api-maps.yandex.ru/v3/?apikey=eb19bd7a-97ea-4903-8f5b-ab24c1115a63&lang=ru_RU'
    script.async = true
    script.onload = async () => {
      try {
        await window.ymaps3.ready
        const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer } = window.ymaps3
        mapInstance = new YMap(mapCanvas, { location: { center: [37.6184, 55.7512], zoom: 11 } }, [new YMapDefaultSchemeLayer({}), new YMapDefaultFeaturesLayer({})])
        mapCanvas.classList.add('catalog-projects-map__canvas--ready')
      } catch (_) {
        mapCanvas.classList.add('catalog-projects-map__canvas--fallback')
      }
    }
    script.onerror = () => mapCanvas.classList.add('catalog-projects-map__canvas--fallback')
    document.head.append(script)
  }
  initYandexMap()
})()
