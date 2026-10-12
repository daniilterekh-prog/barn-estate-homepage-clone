(() => {
  'use strict'

  if (!document.body.classList.contains('international-page')) return

  document.body.classList.add('barnes-header-template')

  const addEyebrows = () => {
    const entries = [
      ['.catalog-best-offers__title', 'Новые проекты'],
      ['.catalog-map__title', 'География'],
      ['.catalog-grid__title', 'Каталог'],
      ['.departments-section__title', 'Направления'],
      ['.catalog-faq__title', 'Экспертиза BARNES'],
    ]

    entries.forEach(([selector, text]) => {
      const heading = document.querySelector(selector)
      if (!heading || heading.previousElementSibling?.classList.contains('catalog-section-eyebrow')) return
      const eyebrow = document.createElement('p')
      eyebrow.className = 'catalog-section-eyebrow'
      eyebrow.textContent = text
      heading.parentNode.insertBefore(eyebrow, heading)
    })
  }

  const enhanceHeader = () => {
    const header = document.querySelector('.layout__header .site-header')
    if (!header) return
    header.classList.add('site-header--no-nav', 'catalog-header-ready')
    document.querySelector('.catalog-page-nav')?.setAttribute('hidden', '')
    header.querySelector('.site-header__nav')?.remove()

    const search = header.querySelector('.site-header__search-btn')
    if (search) {
      search.classList.add('catalog-header-search')
      search.setAttribute('aria-label', 'Поиск')
      search.innerHTML = '<span class="ui-icon ui-icon-current site-header__icon site-header__icon--search" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"></circle><path d="m15.4 15.4 5.1 5.1"></path></svg></span>'
    }

    const right = header.querySelector('.site-header__right')
    const phone = right?.querySelector('.site-header__phone')
    if (!right || !phone || right.querySelector('.catalog-header-contacts')) return

    const base = location.pathname.includes('/standalone/') ? '../../' : '../'
    const contacts = document.createElement('nav')
    contacts.className = 'catalog-header-contacts'
    contacts.setAttribute('aria-label', 'Способы связи')
    const items = [
      ['Написать в WhatsApp', 'https://wa.me/79252621650', `${base}kurortnaya/assets/header-whatsapp.svg`],
      ['Написать в MAX', 'https://max.ru/join/AWj8ibiCtAPOJOlulMGNkykKGz_prXVWg-IQK1KpUG8', `${base}kurortnaya/assets/header-max.svg`],
      ['Написать в Telegram', 'https://t.me/art_de_vivre_barnes', `${base}kurortnaya/assets/header-telegram.svg`],
    ]
    items.forEach(([label, href, src]) => {
      const link = document.createElement('a')
      link.className = 'catalog-header-contact'
      link.href = href
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      link.setAttribute('aria-label', label)
      const image = document.createElement('img')
      image.src = src
      image.alt = ''
      image.setAttribute('aria-hidden', 'true')
      link.append(image)
      contacts.append(link)
    })
    phone.classList.add('catalog-header-contact', 'catalog-header-contact--phone')
    phone.setAttribute('aria-label', 'Позвонить по номеру +7 495 182-50-79')
    contacts.append(phone)
    right.append(contacts)
  }

  const createToolbar = () => {
    const list = document.querySelector('.catalog-grid__list')
    const header = document.querySelector('.catalog-grid__header')
    const quickFilters = document.querySelector('.catalog-quick-filters')
    const sort = document.querySelector('.catalog-grid__sort')
    if (!list || !header || !quickFilters || !sort || document.querySelector('.catalog-mode-toolbar')) return

    quickFilters.querySelectorAll('.catalog-quick-filters__item:nth-child(n+4)').forEach((item) => item.remove())
    quickFilters.classList.add('catalog-mode-filters', 'catalog-quick-filters')

    const toolbar = document.createElement('section')
    toolbar.className = 'catalog-mode-toolbar'
    toolbar.setAttribute('aria-label', 'Фильтры каталога')
    toolbar.innerHTML = `
      <div class="catalog-mode-switch" role="group" aria-label="Тип недвижимости">
        <button class="catalog-mode-switch__button is-active" type="button" aria-pressed="true">Все объекты</button>
        <button class="catalog-mode-switch__button" type="button" aria-pressed="false">Подборка BARNES</button>
      </div>`
    const detailed = document.createElement('button')
    detailed.className = 'catalog-mode-detailed-filters'
    detailed.type = 'button'
    detailed.setAttribute('aria-label', 'Подробные фильтры')
    detailed.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6h3m4 0h9M4 12h8m4 0h4M4 18h4m4 0h8" stroke="currentColor" stroke-width="1.15" stroke-linecap="round"></path><circle cx="9" cy="6" r="2" stroke="currentColor" stroke-width="1.15"></circle><circle cx="14" cy="12" r="2" stroke="currentColor" stroke-width="1.15"></circle><circle cx="10" cy="18" r="2" stroke="currentColor" stroke-width="1.15"></circle></svg><span class="catalog-mode-detailed-filters__label catalog-mode-detailed-filters__label--desktop">Все фильтры</span><span class="catalog-mode-detailed-filters__label catalog-mode-detailed-filters__label--mobile">Фильтры</span>'
    toolbar.append(quickFilters, sort, detailed)
    header.after(toolbar)

    toolbar.querySelectorAll('.catalog-mode-switch__button').forEach((button) => {
      button.addEventListener('click', () => {
        toolbar.querySelectorAll('.catalog-mode-switch__button').forEach((item) => {
          const active = item === button
          item.classList.toggle('is-active', active)
          item.setAttribute('aria-pressed', String(active))
        })
      })
    })
  }

  const alignOfferCards = () => {
    document.querySelectorAll('.international-offer-rendered .apartment-card').forEach((card) => {
      card.classList.add('launch-card')
    })
  }

  addEyebrows()
  enhanceHeader()
  createToolbar()
  alignOfferCards()
})()
