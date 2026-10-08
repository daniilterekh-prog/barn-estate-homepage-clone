(() => {
  const offers = [
    {
      category: 'ПЕНТХАУС',
      name: 'Видовой пентхаус с тремя террасами и камином',
      address: 'Пречистенская наб, 43',
      stats: [['Площадь', '285,5 м²'], ['Этаж', '5'], ['Спальни', '3'], ['Комнаты', '4']],
      price: '350 000 000 ₽',
      id: '561413',
      image: 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/11075423/d13733056f669deb3558a833a5d4f8f4/iblock/516/516ff1a2ffb19b012219760f5be431dc/3bdbfb684ee31aaf8e43a0355d272251.jpg',
    },
    {
      category: 'АПАРТАМЕНТ',
      name: 'Изысканный апартамент в башне «Москва»',
      address: 'Пресненская наб, 8стр1',
      stats: [['Площадь', '154 м²'], ['Этаж', '68'], ['Спальни', '1'], ['Комнаты', '2']],
      price: '179 000 000 ₽',
      id: '575401',
      image: 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/11005738/d13733056f669deb3558a833a5d4f8f4/iblock/6d4/6d4e63c9a5a5340f6870db100decb834/392b41d6a54c0e54beb45f5d061d2c63.jpg',
    },
    {
      category: 'КВАРТИРА',
      name: 'Просторная квартира в премиальном ЖК Prime Park',
      address: 'Ленинградский пр-кт, 37/3',
      stats: [['Площадь', '159,6 м²'], ['Этаж', '35'], ['Спальни', '4'], ['Комнаты', '5']],
      price: '151 373 100 ₽',
      id: '593595',
      image: 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/11114744/d13733056f669deb3558a833a5d4f8f4/iblock/5a4/5a4526b6eb91f6fbc7f6aef0465b1a74/5f3c3b4ab0aea8a69138dd3226e2bfd4.jpg',
    },
  ]

  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character]))
  const actions = '<div class="listing-card__actions"><button class="listing-card__call" type="button">Заказать звонок</button><a class="listing-card__detail" href="#lot">Подробнее <span aria-hidden="true">↗</span></a></div>'

  const cardMarkup = (offer, variant, index) => {
    const title = escapeHtml(offer.name)
    return `<article class="listing-card listing-card--${variant}">
      <div class="listing-card__media">
        <img src="${escapeHtml(offer.image)}" alt="${title}" loading="lazy" />
        <div class="listing-card__media-bar"><span>${escapeHtml(offer.category)}</span><button class="listing-card__favorite" type="button" aria-label="Добавить в избранное">♡</button></div>
        <span class="listing-card__index">0${index + 1}</span>
      </div>
      <div class="listing-card__info">
        <div class="listing-card__topline"><span class="listing-card__category-text">${escapeHtml(offer.category)}</span><span class="listing-card__id">ID ${escapeHtml(offer.id)}</span></div>
        <h3>${title}</h3>
        <p class="listing-card__address">${escapeHtml(offer.address)}</p>
        <div class="listing-card__stats">${offer.stats.map(([label, value]) => `<span><b>${escapeHtml(value)}</b><small>${escapeHtml(label)}</small></span>`).join('')}</div>
        <div class="listing-card__price-row"><p class="listing-card__price">${escapeHtml(offer.price)}</p></div>
        ${actions}
      </div>
    </article>`
  }

  document.querySelectorAll('[data-variant]').forEach((grid) => {
    const variant = grid.dataset.variant
    grid.innerHTML = offers.map((offer, index) => cardMarkup(offer, variant, index)).join('')
  })
})()
