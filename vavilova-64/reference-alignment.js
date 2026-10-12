// Page-local alignment with the approved for-partners reference.
(() => {
  const page = document.querySelector('.catalog-detail')
  if (!page) return
  const createHeading = (parent, eyebrowText, titleText, className) => {
    const wrapper = document.createElement('header')
    wrapper.className = 'vavilova-section-heading ' + (className || '')
    const eyebrow = document.createElement('p')
    eyebrow.className = 'vavilova-section-eyebrow'
    eyebrow.textContent = eyebrowText
    const heading = document.createElement('h2')
    heading.textContent = titleText
    wrapper.append(eyebrow, heading)
    parent.prepend(wrapper)
    return wrapper
  }
  const about = page.querySelector('.detail-about__inner')
  if (about) {
    page.querySelector('.detail-about__eyebrow')?.remove()
    createHeading(about, 'О проекте', 'О жилом комплексе')
  }
  const gallery = page.querySelector('.detail-gallery')
  if (gallery) createHeading(gallery, 'В деталях', 'Галерея проекта', 'base-container vavilova-gallery-heading')
  const contactTitle = page.querySelector('.catalog-contact__title')
  if (contactTitle) {
    const eyebrow = document.createElement('p')
    eyebrow.className = 'vavilova-section-eyebrow'
    eyebrow.textContent = 'Консультация BARNES'
    contactTitle.before(eyebrow)
  }
  page.querySelectorAll('h2').forEach((heading) => {
    const eyebrow = heading.previousElementSibling
    if (!eyebrow?.matches('.vavilova-section-eyebrow,.reviews-section__eyebrow,.lot-developer__label')) return
    if (heading.parentElement.classList.contains('vavilova-section-heading')) return
    const wrapper = document.createElement('header')
    wrapper.className = 'vavilova-section-heading'
    eyebrow.before(wrapper)
    wrapper.append(eyebrow, heading)
  })
  const heroCopy = page.querySelector('.detail-hero__copy')
  const breadcrumbs = page.querySelector('.detail-hero__breadcrumbs')
  if (heroCopy && breadcrumbs) heroCopy.prepend(breadcrumbs)
  const heroTitle = page.querySelector('.detail-hero__title')
  const heroLocation = page.querySelector('.detail-hero__location')
  if (heroTitle && heroLocation) heroTitle.before(heroLocation)

  // No confirmed minimum price is available: never use the mortgage example
  // amount as the project's starting price (see hero-data-rules.md).
  const originalSpecs = page.querySelector('.detail-hero__specs')
  if (heroCopy && originalSpecs) {
    const facts = document.createElement('dl')
    facts.className = 'vavilova-hero-facts'
    ;[
      ['Площадь', '29–120 м²'],
      ['Цена', 'Цена по запросу'],
      ['Сдача', 'III кв. 2029'],
    ].forEach(([label, value]) => {
      const fact = document.createElement('div')
      fact.className = 'vavilova-hero-fact'
      const term = document.createElement('dt')
      term.textContent = label
      const description = document.createElement('dd')
      description.textContent = value
      fact.append(term, description)
      facts.append(fact)
    })
    originalSpecs.replaceWith(facts)
  }

  const right = document.querySelector('.layout__header .site-header__right')
  const phone = right?.querySelector('.site-header__phone')
  if (right && phone) {
    const contacts = document.createElement('nav')
    contacts.className = 'vavilova-header-contacts'
    contacts.setAttribute('aria-label', 'Способы связи')
    const assetBase = new URL('../pictures/office-contact/', document.currentScript.src)
    const links = [
      ['WhatsApp', 'https://wa.me/79252621650', 'whatsapp.svg'],
      ['MAX', 'https://max.ru/join/AWj8ibiCtAPOJOlulMGNkykKGz_prXVWg-IQK1KpUG8', 'max.svg'],
      ['Telegram', 'https://t.me/art_de_vivre_barnes', 'telegram.svg'],
    ]
    links.forEach(([name, href, file]) => {
      const link = document.createElement('a')
      link.href = href
      link.className = 'vavilova-header-contact'
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      link.setAttribute('aria-label', 'Написать в ' + name)
      const image = document.createElement('img')
      image.src = new URL(file, assetBase).href
      image.alt = ''
      link.append(image)
      contacts.append(link)
    })
    phone.classList.add('vavilova-header-contact')
    phone.setAttribute('aria-label', 'Позвонить по номеру +7 495 182-50-79')
    contacts.append(phone)
    right.append(contacts)
  }
})()
