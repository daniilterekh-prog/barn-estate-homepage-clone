(() => {
  const dialog = document.querySelector('#filters-dialog')
  const form = document.querySelector('[data-filters-form]')
  const cards = [...document.querySelectorAll('[data-card]')]
  const grid = document.querySelector('[data-listing-grid]')
  const queryInput = document.querySelector('[data-query]')
  const resultsCount = document.querySelector('[data-results-count]')
  const emptyState = document.querySelector('[data-listing-empty]')
  const activeFilters = document.querySelector('[data-active-filters]')
  const badge = document.querySelector('[data-filter-badge]')
  const toast = document.querySelector('[data-toast]')
  const countrySelect = form.querySelector('[data-country-select]')
  const citySelect = form.querySelector('[data-city-select]')
  const districtSelect = form.querySelector('[data-district-select]')
  const cityField = form.querySelector('[data-city-field]')
  const districtField = form.querySelector('[data-district-field]')
  const topDistrictControl = document.querySelector('[data-city-dependent]')
  const locationData = {
    russia: { label: 'Россия', cities: { moscow: { label: 'Москва', districts: { '': 'Любой район', хамовники: 'Хамовники', пресненский: 'Пресненский', хорошевский: 'Хорошевский' } }, spb: { label: 'Санкт-Петербург', districts: { '': 'Любой район', петроградский: 'Петроградский', центральный: 'Центральный' } }, sochi: { label: 'Сочи', districts: { '': 'Любой район', центр: 'Центральный' } } } },
    france: { label: 'Франция', cities: { paris: { label: 'Париж', districts: { '': 'Любой район', восьмой: '8-й округ', шестнадцатый: '16-й округ' } }, nice: { label: 'Ницца', districts: { '': 'Любой район', центр: 'Центр' } } } },
    italy: { label: 'Италия', cities: { milan: { label: 'Милан', districts: { '': 'Любой район', brera: 'Брера' } }, rome: { label: 'Рим', districts: { '': 'Любой район', центр: 'Центр' } } } },
    uae: { label: 'ОАЭ', cities: { dubai: { label: 'Дубай', districts: { '': 'Любой район', palm: 'Palm Jumeirah', downtown: 'Downtown' } } } },
  }
  const state = { deal: 'buy', category: 'city', country: 'russia', city: 'moscow', minPrice: '', maxPrice: '', minArea: '', maxArea: '', rooms: [], district: '' }

  const formatNumber = (value) => new Intl.NumberFormat('ru-RU').format(value)
  const formatCount = (value) => {
    const lastTwo = value % 100
    const last = value % 10
    if (lastTwo >= 11 && lastTwo <= 14) return `${value} объектов`
    if (last === 1) return `${value} объект`
    if (last >= 2 && last <= 4) return `${value} объекта`
    return `${value} объектов`
  }

  const showToast = (message) => {
    toast.textContent = message
    toast.classList.add('is-visible')
    window.clearTimeout(showToast.timeout)
    showToast.timeout = window.setTimeout(() => toast.classList.remove('is-visible'), 2300)
  }

  const openFilters = () => {
    if (typeof dialog.showModal === 'function') dialog.showModal()
    else dialog.setAttribute('open', '')
  }
  const closeFilters = () => dialog.close ? dialog.close() : dialog.removeAttribute('open')
  document.querySelectorAll('[data-open-filters]').forEach((button) => button.addEventListener('click', openFilters))
  document.querySelector('[data-close-filters]').addEventListener('click', closeFilters)
  dialog.addEventListener('click', (event) => { if (event.target === dialog) closeFilters() })

  const fillSelect = (select, options, selected = '') => {
    const hasEmptyOption = Object.prototype.hasOwnProperty.call(options, '')
    const placeholder = select === citySelect && !hasEmptyOption ? '<option value="">Выберите город</option>' : ''
    select.innerHTML = placeholder + Object.entries(options).map(([value, label]) => `<option value="${value}">${label}</option>`).join('')
    select.value = Object.prototype.hasOwnProperty.call(options, selected) ? selected : ''
  }

  const updateLocationFields = ({ country = countrySelect.value, city = citySelect.value, district = districtSelect.value } = {}) => {
    const countryData = locationData[country]
    const hasCountry = Boolean(countryData)
    cityField.hidden = !hasCountry
    if (!hasCountry) {
      citySelect.innerHTML = ''
      districtSelect.innerHTML = ''
      districtField.hidden = true
      return
    }
    fillSelect(citySelect, Object.fromEntries(Object.entries(countryData.cities).map(([value, data]) => [value, data.label])), city)
    const cityData = countryData.cities[citySelect.value]
    const hasCity = Boolean(cityData)
    districtField.hidden = !hasCity
    fillSelect(districtSelect, hasCity ? cityData.districts : { '': 'Сначала выберите город' }, hasCity ? district : '')
  }

  countrySelect.addEventListener('change', () => updateLocationFields({ country: countrySelect.value, city: '', district: '' }))
  citySelect.addEventListener('change', () => updateLocationFields({ city: citySelect.value, district: '' }))

  const readForm = () => ({
    deal: form.elements.deal.value,
    category: form.elements.category.value,
    country: countrySelect.value,
    city: citySelect.value,
    minPrice: form.elements.minPrice.value,
    maxPrice: form.elements.maxPrice.value,
    minArea: form.elements.minArea.value,
    maxArea: form.elements.maxArea.value,
    rooms: [...form.querySelectorAll('input[name="rooms"]:checked')].map((input) => input.value),
    district: districtSelect.value,
  })

  const syncForm = () => {
    form.elements.deal.value = state.deal
    form.elements.category.value = state.category
    countrySelect.value = state.country
    updateLocationFields({ country: state.country, city: state.city, district: state.district })
    form.elements.minPrice.value = state.minPrice
    form.elements.maxPrice.value = state.maxPrice
    form.elements.minArea.value = state.minArea
    form.elements.maxArea.value = state.maxArea
    form.querySelectorAll('input[name="rooms"]').forEach((input) => { input.checked = state.rooms.includes(input.value) })
    districtSelect.value = state.district
  }

  const activeCount = () => [state.deal !== 'buy', state.category !== 'city', state.country !== 'russia', state.city !== 'moscow', state.minPrice, state.maxPrice, state.minArea, state.maxArea, state.rooms.length, state.district].filter(Boolean).length

  const renderControlValues = () => {
    const price = state.minPrice || state.maxPrice
    const priceLabel = state.minPrice && state.maxPrice ? `${formatNumber(state.minPrice)}–${formatNumber(state.maxPrice)} ₽` : state.minPrice ? `от ${formatNumber(state.minPrice)} ₽` : state.maxPrice ? `до ${formatNumber(state.maxPrice)} ₽` : 'Любая'
    document.querySelector('[data-control-value="deal"]').textContent = state.deal === 'rent' ? 'Снять' : 'Купить'
    document.querySelector('[data-control-value="category"]').textContent = ({ city: 'Городская недвижимость', country: 'Загородная', resort: 'Курортная', commercial: 'Коммерческая' })[state.category]
    document.querySelector('[data-control-value="country"]').textContent = locationData[state.country]?.label || 'Не выбрана'
    document.querySelector('[data-control-value="city"]').textContent = locationData[state.country]?.cities[state.city]?.label || 'Выберите город'
    document.querySelector('[data-control-value="district"]').textContent = state.district ? locationData[state.country]?.cities[state.city]?.districts[state.district] : 'Любой'
    topDistrictControl.hidden = !state.city
    document.querySelector('[data-control-value="price"]').textContent = price ? priceLabel : 'Любая'
    badge.hidden = !activeCount()
    badge.textContent = activeCount()
  }

  const renderChips = () => {
    const chips = []
    if (state.deal !== 'buy') chips.push(['Снять', () => { state.deal = 'buy' }])
    if (state.category !== 'city') chips.push([({ country: 'Загородная', resort: 'Курортная', commercial: 'Коммерческая' })[state.category], () => { state.category = 'city' }])
    if (state.country !== 'russia') chips.push([locationData[state.country]?.label || 'Страна', () => { state.country = 'russia'; state.city = 'moscow'; state.district = '' }])
    if (state.city && state.city !== 'moscow') chips.push([locationData[state.country]?.cities[state.city]?.label || 'Город', () => { state.city = 'moscow'; state.district = '' }])
    if (state.minPrice || state.maxPrice) chips.push([`Цена: ${state.minPrice ? `от ${formatNumber(state.minPrice)}` : ''}${state.minPrice && state.maxPrice ? ' — ' : ''}${state.maxPrice ? `до ${formatNumber(state.maxPrice)}` : ''} ₽`, () => { state.minPrice = ''; state.maxPrice = '' }])
    if (state.minArea || state.maxArea) chips.push([`Площадь: ${state.minArea || '0'}–${state.maxArea || '∞'} м²`, () => { state.minArea = ''; state.maxArea = '' }])
    if (state.rooms.length) chips.push([`Комнаты: ${state.rooms.join(', ')}`, () => { state.rooms = [] }])
    if (state.district) chips.push([`Район: ${state.district[0].toUpperCase()}${state.district.slice(1)}`, () => { state.district = '' }])
    activeFilters.innerHTML = chips.map(([label], index) => `<span class="active-filter">${label}<button type="button" aria-label="Убрать фильтр ${label}" data-remove-chip="${index}">×</button></span>`).join('')
    activeFilters.querySelectorAll('[data-remove-chip]').forEach((button) => button.addEventListener('click', () => { chips[Number(button.dataset.removeChip)][1](); syncForm(); render(); }))
  }

  const cardMatches = (card) => {
    const price = Number(card.dataset.price)
    const area = Number(card.dataset.area)
    const rooms = Number(card.dataset.rooms)
    const query = queryInput.value.trim().toLocaleLowerCase('ru')
    const searchText = card.textContent.toLocaleLowerCase('ru')
    const roomMatches = !state.rooms.length || state.rooms.some((room) => room === '5' ? rooms >= 5 : rooms === Number(room))
    return card.dataset.category === state.category && card.dataset.country === state.country && (!state.city || card.dataset.city === state.city) && (!state.minPrice || price >= Number(state.minPrice)) && (!state.maxPrice || price <= Number(state.maxPrice)) && (!state.minArea || area >= Number(state.minArea)) && (!state.maxArea || area <= Number(state.maxArea)) && roomMatches && (!state.district || card.dataset.district === state.district) && (!query || searchText.includes(query))
  }

  const render = () => {
    const visible = cards.filter(cardMatches)
    cards.forEach((card) => { card.hidden = !visible.includes(card) })
    resultsCount.textContent = formatCount(visible.length)
    emptyState.hidden = visible.length !== 0
    renderControlValues()
    renderChips()
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    Object.assign(state, readForm())
    closeFilters()
    render()
  })
  form.addEventListener('reset', () => window.setTimeout(() => { Object.assign(state, { deal: 'buy', category: 'city', country: 'russia', city: 'moscow', minPrice: '', maxPrice: '', minArea: '', maxArea: '', rooms: [], district: '' }); syncForm(); render() }, 0))
  document.querySelector('[data-reset-filters]').addEventListener('click', () => { form.reset(); closeFilters() })
  document.querySelector('[data-reset-empty]').addEventListener('click', () => { Object.assign(state, { deal: 'buy', category: 'city', country: 'russia', city: 'moscow', minPrice: '', maxPrice: '', minArea: '', maxArea: '', rooms: [], district: '' }); queryInput.value = ''; syncForm(); render() })
  queryInput.addEventListener('input', render)

  document.querySelector('[data-sort]').addEventListener('change', (event) => {
    const order = event.target.value
    const sorted = [...cards].sort((a, b) => {
      if (order === 'price-asc') return Number(a.dataset.price) - Number(b.dataset.price)
      if (order === 'price-desc') return Number(b.dataset.price) - Number(a.dataset.price)
      if (order === 'area-desc') return Number(b.dataset.area) - Number(a.dataset.area)
      return cards.indexOf(a) - cards.indexOf(b)
    })
    sorted.forEach((card) => grid.append(card))
  })

  document.querySelectorAll('[data-view]').forEach((button) => button.addEventListener('click', () => {
    const list = button.dataset.view === 'list'
    grid.classList.toggle('listing-grid--list', list)
    document.querySelectorAll('[data-view]').forEach((item) => { item.classList.toggle('is-active', item === button); item.setAttribute('aria-pressed', String(item === button)) })
  }))

  document.querySelectorAll('.card__favorite').forEach((button) => button.addEventListener('click', () => {
    const active = button.getAttribute('aria-pressed') === 'true'
    button.setAttribute('aria-pressed', String(!active))
    button.textContent = active ? '♡' : '♥'
    button.setAttribute('aria-label', active ? 'Добавить в избранное' : 'Удалить из избранного')
  }))
  document.querySelectorAll('[data-request-call]').forEach((button) => button.addEventListener('click', () => showToast('Заявка на звонок отправлена')))
  document.querySelector('[data-save-search]').addEventListener('click', () => showToast('Поиск сохранён'))

  syncForm()
  render()
})()
