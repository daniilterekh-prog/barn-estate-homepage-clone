(() => {
  const updateStaticLayout = () => {
    const header = document.querySelector('.layout__header .site-header, .site-header')
    if (header) document.documentElement.style.setProperty('--layout-header-height', `${Math.ceil(header.getBoundingClientRect().height)}px`)
  }
  const addStaticSliderRules = () => {
    if (document.querySelector('style[data-vavilova-static]')) return
    const style = document.createElement('style')
    style.dataset.vavilovaStatic = ''
    style.textContent = '.documents__slider[data-v-2131a8df] .splide__slide{width:var(--documents-slide-width)!important}'
    document.head.appendChild(style)
  }
  updateStaticLayout()
  addStaticSliderRules()
  if (window.ResizeObserver) {
    const header = document.querySelector('.layout__header .site-header, .site-header')
    if (header) new ResizeObserver(updateStaticLayout).observe(header)
  }
  window.addEventListener('resize', updateStaticLayout, { passive: true })
})()

;(() => {
  const referenceTitle = 'ЖК «Вавилова 64» — квартиры премиум-класса | BARNES'
  const referenceDescription = 'ЖК «Вавилова 64» в Гагаринском районе Москвы: квартиры площадью от 29 до 120 м², два корпуса, приватная инфраструктура и панорамное остекление.'

  document.documentElement.lang = 'ru'
  document.title = referenceTitle
  const description = document.querySelector('meta[name="description"]')
  const ogTitle = document.querySelector('meta[property="og:title"]')
  const ogDescription = document.querySelector('meta[property="og:description"]')
  if (description) description.content = referenceDescription
  if (ogTitle) ogTitle.content = referenceTitle
  if (ogDescription) ogDescription.content = referenceDescription

  const addEyebrow = (selector, text) => {
    const heading = document.querySelector(selector)
    if (!heading || heading.previousElementSibling?.classList.contains('vavilova-section-eyebrow')) return
    const eyebrow = document.createElement('p')
    eyebrow.className = 'vavilova-section-eyebrow'
    eyebrow.textContent = text
    heading.before(eyebrow)
  }

  const sectionEyebrows = [
    ['.detail-characteristics__title', 'Ключевые параметры'],
    ['.detail-location__title', 'Локация'],
    ['.mortgage__title', 'Условия покупки'],
    ['.detail-architecture__title', 'Концепция проекта'],
    ['.detail-infrastructure__title', 'Пространство для жизни'],
    ['.construction__title', 'Динамика проекта'],
    ['.documents__title', 'Материалы проекта'],
    ['.detail-similar__title', 'Выбор BARNES'],
    ['.catalog-faq__title', 'Полезная информация'],
    ['.newsletter-cta h2', 'BARNES / Аналитика'],
  ]
  sectionEyebrows.forEach(([selector, text]) => addEyebrow(selector, text))

  const aboutEyebrow = document.querySelector('.detail-about__eyebrow')
  const reviewsEyebrow = document.querySelector('.reviews-section__eyebrow')
  const developerEyebrow = document.querySelector('.lot-developer__label')
  if (aboutEyebrow) aboutEyebrow.textContent = 'О проекте'
  if (reviewsEyebrow) reviewsEyebrow.textContent = 'Опыт клиентов'
  if (developerEyebrow) {
    developerEyebrow.textContent = 'Девелопер'
    developerEyebrow.classList.add('vavilova-section-eyebrow')
  }

  document.querySelectorAll('.detail-sticky-header__agent-name, .catalog-contact__expert-name, .catalog-contact__mobile-name').forEach((element) => {
    element.textContent = 'Анастасия Шпак'
  })
  document.querySelectorAll('.catalog-contact__expert-role, .catalog-contact__mobile-role').forEach((element) => {
    element.textContent = 'Эксперт по недвижимости'
  })

  const deadlineLabel = [...document.querySelectorAll('.detail-characteristics__label')].find((element) => element.textContent.trim().toLowerCase() === 'срок сдачи')
  if (deadlineLabel?.nextElementSibling) deadlineLabel.nextElementSibling.textContent = 'III квартал 2029'

  const faqContent = [
    ['Где расположен жилой комплекс?', 'ЖК «Вавилова 64» расположен в Гагаринском районе Москвы, на улице Вавилова, рядом со станцией метро «Вавиловская».'],
    ['Кто является девелопером проекта?', 'Девелопер проекта — компания СИТИ21, работающая на рынке недвижимости Москвы и Московской области с 1997 года.'],
    ['К какому классу относится проект?', '«Вавилова 64» — жилой комплекс премиум-класса с закрытой территорией и приватной инфраструктурой для резидентов.'],
    ['Сколько корпусов и этажей предусмотрено?', 'Проект включает два корпуса высотой 21 этаж и 505 квартир.'],
    ['Какие площади квартир представлены?', 'В проекте представлены квартиры площадью от 29 до 120 м². Доступные планировки и актуальные условия можно запросить у эксперта BARNES.'],
    ['Какая высота потолков в квартирах?', 'Высота потолков на типовых этажах составляет 3,15 м, на верхних этажах — до 3,95 м.'],
    ['Предусмотрен ли паркинг?', 'В проекте предусмотрен двухуровневый паркинг на 185 машиномест.'],
    ['Какая инфраструктура доступна жителям?', 'Для резидентов предусмотрены библиотека, переговорная и фитнес-рум, а закрытая территория формирует приватную жилую среду.'],
    ['Когда планируется завершение строительства?', 'Ввод комплекса в эксплуатацию запланирован на III квартал 2029 года.'],
    ['Как получить подборку квартир?', 'Оставьте заявку в форме ниже. Эксперт BARNES уточнит ваш сценарий и подготовит подборку подходящих квартир и условий покупки.'],
  ]

  const schemaScript = document.querySelector('script[type="application/ld+json"]')
  if (schemaScript) {
    try {
      const schema = JSON.parse(schemaScript.textContent)
      const graph = Array.isArray(schema['@graph']) ? schema['@graph'] : []
      graph.forEach((entry) => {
        if (entry['@type'] === 'WebPage') {
          entry.name = referenceTitle
          entry.description = referenceDescription
          entry.url = 'https://barn-estate.ru/zhilye-kompleksy/vavilova-64/'
        }
        if (entry['@type'] === 'FAQPage') {
          entry.mainEntity = faqContent.map(([question, answer]) => ({
            '@type': 'Question',
            name: question,
            acceptedAnswer: { '@type': 'Answer', text: answer },
          }))
        }
        if (entry['@type'] === 'Person' && entry.name === 'Анастасия Шпак') entry.jobTitle = 'Эксперт по недвижимости'
      })
      schemaScript.textContent = JSON.stringify(schema)
    } catch (error) {
      console.warn('Vavilova schema enhancement skipped', error)
    }
  }

  document.querySelectorAll('.catalog-faq__item').forEach((item, index) => {
    const data = faqContent[index]
    const button = item.querySelector('.catalog-faq__question')
    const question = item.querySelector('.catalog-faq__question-text')
    const answer = item.querySelector('.catalog-faq__answer')
    const answerText = item.querySelector('.catalog-faq__answer-content p')
    if (!data || !button || !answer) return
    const answerId = `vavilova-faq-answer-${index + 1}`
    if (question) question.textContent = data[0]
    if (answerText) answerText.textContent = data[1]
    answer.id = answerId
    answer.setAttribute('role', 'region')
    button.setAttribute('aria-controls', answerId)
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true'
      button.setAttribute('aria-expanded', String(!expanded))
      item.classList.toggle('catalog-faq__item--open', !expanded)
      answer.classList.toggle('catalog-faq__answer--open', !expanded)
      answer.style.removeProperty('max-height')
    })
    answer.style.removeProperty('max-height')
  })

  const setupExpandable = (toggleSelector, wrapSelector) => {
    const toggle = document.querySelector(toggleSelector)
    const wrap = document.querySelector(wrapSelector)
    if (!toggle || !wrap) return
    const collapsedHeight = wrap.getBoundingClientRect().height
    toggle.setAttribute('aria-controls', `${wrapSelector.replace(/[^a-z0-9]+/gi, '-')}-content`)
    wrap.id = `${wrapSelector.replace(/[^a-z0-9]+/gi, '-')}-content`
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true'
      toggle.setAttribute('aria-expanded', String(!expanded))
      wrap.style.maxHeight = expanded ? `${collapsedHeight}px` : `${wrap.scrollHeight}px`
      wrap.style.overflow = expanded ? 'hidden' : 'visible'
      toggle.textContent = expanded ? 'Читать далее' : 'Свернуть'
    })
  }
  setupExpandable('.detail-about__toggle', '.detail-about__text-wrap')
  setupExpandable('.detail-architecture__more', '.detail-architecture__text-wrap')
  setupExpandable('.lot-developer__toggle', '.lot-developer__text-wrap')

  const scrollToContact = () => document.querySelector('.catalog-contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  document.querySelectorAll('.detail-sticky-header__consult, .detail-characteristics__cta, .detail-location__action--primary, .mortgage__action, .apartment-card__call-btn').forEach((button) => {
    button.addEventListener('click', scrollToContact)
  })
  document.querySelectorAll('.detail-hero__button--secondary, .detail-location__action--secondary').forEach((button) => {
    button.textContent = 'Получить презентацию'
    button.addEventListener('click', scrollToContact)
  })

  const stickyTargets = ['.detail-characteristics', '.detail-about', '.detail-gallery', '.detail-similar', '.detail-infrastructure', '.construction', '.detail-similar']
  document.querySelectorAll('.detail-sticky-header__link').forEach((button, index) => {
    button.addEventListener('click', () => document.querySelector(stickyTargets[index])?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  })

  const fieldNames = [
    ['.catalog-contact__input[type="text"]', 'Ваше имя'],
    ['.catalog-contact__input[type="tel"]', 'Номер телефона'],
    ['.catalog-contact__textarea', 'Комментарий'],
  ]
  fieldNames.forEach(([selector, label]) => document.querySelector(selector)?.setAttribute('aria-label', label))
  const honeypot = document.querySelector('.catalog-contact__honeypot input, input[name*="website"], input[name*="company"]')
  if (honeypot) {
    honeypot.setAttribute('aria-hidden', 'true')
    honeypot.tabIndex = -1
  }

  const phoneField = document.querySelector('.catalog-contact__input[type="tel"]')
  document.querySelectorAll('.catalog-contact__method').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.classList.contains('catalog-contact__method--active')))
    button.addEventListener('click', () => {
      document.querySelectorAll('.catalog-contact__method').forEach((method) => {
        method.classList.remove('catalog-contact__method--active')
        method.setAttribute('aria-pressed', 'false')
      })
      button.classList.add('catalog-contact__method--active')
      button.setAttribute('aria-pressed', 'true')
      const channel = button.textContent.trim()
      if (phoneField) phoneField.placeholder = channel === 'Звонок' ? 'Ваш номер телефона' : `Номер телефона для ${channel}`
    })
  })

  const enhanceHeaderNavigation = () => {
    const header = document.querySelector('.layout__header .site-header')
    const inner = header?.querySelector('.site-header__inner')
    const footerColumns = [...document.querySelectorAll('.site-footer__column')]
    if (!header || !inner || !footerColumns.length) return

    const topLevelLinks = {
      'Москва': 'https://barn-estate.ru/gorodskaya-nedvizhimost/',
      'Загородная': 'https://barn-estate.ru/zagorodnaya-nedvizhimost/',
      'Коммерческая': 'https://barn-estate.ru/kommercheskaya-nedvizhimost/',
      'Курортная': 'https://barn-estate.ru/kurortnaya/',
      'Зарубежная': 'https://barn-estate.ru/mezhdunarodnaya-nedvizhimost/',
      'Санкт-Петербург': 'https://barnes-spb.ru/',
      'Медиа': 'https://barn-estate.ru/media/',
      'О BARNES': 'https://barn-estate.ru/mir-barnes/',
      'Собственникам': 'https://barn-estate.ru/sobstvennikam/',
    }

    const navList = document.createElement('ul')
    navList.className = 'site-header__nav-list'
    navList.setAttribute('data-v-7912d681', '')
    footerColumns.forEach((column) => {
      const title = column.querySelector('.site-footer__column-title')?.textContent.trim()
      if (!title) return
      const item = document.createElement('li')
      item.className = 'site-header__nav-item vavilova-nav-item'
      item.setAttribute('data-v-7912d681', '')
      const link = document.createElement('a')
      link.className = 'site-header__nav-link'
      link.setAttribute('data-v-7912d681', '')
      link.href = topLevelLinks[title] || column.querySelector('a')?.href || '#'
      link.textContent = title
      item.appendChild(link)
      const footerLinks = [...column.querySelectorAll('.site-footer__link')]
      if (footerLinks.length) {
        const subnav = document.createElement('ul')
        subnav.className = 'site-header__subnav'
        subnav.setAttribute('data-v-7912d681', '')
        footerLinks.forEach((footerLink) => {
          const subitem = document.createElement('li')
          subitem.setAttribute('data-v-7912d681', '')
          const sublink = document.createElement('a')
          sublink.className = 'site-header__subnav-link'
          sublink.setAttribute('data-v-7912d681', '')
          sublink.href = footerLink.href
          sublink.textContent = footerLink.textContent.trim()
          subitem.appendChild(sublink)
          subnav.appendChild(subitem)
        })
        item.appendChild(subnav)
      }
      navList.appendChild(item)
    })

    if (!inner.querySelector(':scope > .site-header__nav')) {
      const nav = document.createElement('nav')
      nav.className = 'site-header__nav'
      nav.setAttribute('data-v-7912d681', '')
      nav.setAttribute('aria-label', 'Основное меню')
      nav.appendChild(navList)
      inner.appendChild(nav)
    }
    header.classList.remove('site-header--no-nav')

    let menu = document.querySelector('.vavilova-site-menu')
    if (!menu) {
      menu = document.createElement('div')
      menu.id = 'vavilova-site-menu'
      menu.className = 'vavilova-site-menu'
      menu.hidden = true
      menu.setAttribute('aria-label', 'Основное меню')
      const panel = document.createElement('div')
      panel.className = 'vavilova-site-menu__panel base-container'
      const menuNav = document.createElement('nav')
      menuNav.className = 'vavilova-site-menu__nav'
      menuNav.setAttribute('aria-label', 'Разделы сайта')
      menuNav.appendChild(navList.cloneNode(true))
      panel.appendChild(menuNav)
      menu.appendChild(panel)
      document.body.appendChild(menu)
    }

    const menuButton = document.querySelector('.site-header__icon-btn')
    if (!menuButton) return
    const closeMenu = (restoreFocus = true) => {
      menu.hidden = true
      document.body.classList.remove('vavilova-menu-open')
      header.classList.remove('site-header--menu-open')
      menuButton.setAttribute('aria-expanded', 'false')
      menuButton.setAttribute('aria-label', 'Открыть меню')
      if (restoreFocus) menuButton.focus()
    }
    const openMenu = () => {
      menu.hidden = false
      document.body.classList.add('vavilova-menu-open')
      header.classList.add('site-header--menu-open')
      menuButton.setAttribute('aria-expanded', 'true')
      menuButton.setAttribute('aria-label', 'Закрыть меню')
      menu.querySelector('a')?.focus()
    }
    menuButton.setAttribute('aria-controls', menu.id)
    menuButton.setAttribute('aria-expanded', 'false')
    menuButton.addEventListener('click', () => menu.hidden ? openMenu() : closeMenu())
    menu.addEventListener('click', (event) => {
      if (event.target === menu) closeMenu()
    })
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !menu.hidden) closeMenu()
    })
  }
  enhanceHeaderNavigation()

  const hero = document.querySelector('.detail-hero')
  const contactSection = document.querySelector('.catalog-contact')
  const newsletterSection = document.querySelector('.newsletter-cta')
  const footerSection = document.querySelector('.site-footer')
  const floatingExpert = document.querySelector('.floating-expert')
  if (floatingExpert && window.IntersectionObserver) {
    const expertVisibility = new Map()
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => expertVisibility.set(entry.target, entry.isIntersecting))
      floatingExpert.classList.toggle('floating-expert--hero-hidden', [...expertVisibility.values()].some(Boolean))
    }, { threshold: .15 })
    ;[hero, contactSection, newsletterSection, footerSection].filter(Boolean).forEach((section) => observer.observe(section))
  }

  const gallerySlides = [...document.querySelectorAll('.detail-gallery .splide__slide')]
  let galleryIndex = Math.max(0, gallerySlides.findIndex((slide) => slide.classList.contains('is-active')))
  const renderGallery = () => {
    gallerySlides.forEach((slide, index) => {
      slide.classList.toggle('is-active', index === galleryIndex)
      slide.classList.toggle('is-visible', index === galleryIndex)
      slide.classList.toggle('is-next', index === (galleryIndex + 1) % gallerySlides.length)
      slide.setAttribute('aria-hidden', String(index !== galleryIndex))
    })
  }
  if (gallerySlides.length > 1) {
    document.querySelector('.detail-gallery__nav--prev')?.addEventListener('click', () => {
      galleryIndex = (galleryIndex - 1 + gallerySlides.length) % gallerySlides.length
      renderGallery()
    })
    document.querySelector('.detail-gallery__nav--next')?.addEventListener('click', () => {
      galleryIndex = (galleryIndex + 1) % gallerySlides.length
      renderGallery()
    })
    renderGallery()
  }

  const documentSlides = [...document.querySelectorAll('.documents__slider .splide__slide')]
  const documentList = document.querySelector('.documents__slider .splide__list')
  let documentIndex = 0
  const renderDocuments = () => {
    if (!documentList || !documentSlides.length) return
    const gap = 24
    const width = documentSlides[0].getBoundingClientRect().width + gap
    documentList.style.transform = `translateX(${-documentIndex * width}px)`
    documentList.style.transition = 'transform 240ms ease'
  }
  const documentButtons = [...document.querySelectorAll('.documents__nav-btn')]
  documentButtons[0]?.addEventListener('click', () => {
    documentIndex = Math.max(0, documentIndex - 1)
    renderDocuments()
  })
  documentButtons[1]?.addEventListener('click', () => {
    documentIndex = Math.min(Math.max(0, documentSlides.length - 1), documentIndex + 1)
    renderDocuments()
  })
  document.querySelectorAll('.documents__card[href="#"]').forEach((link) => {
    link.href = '#request'
    const label = link.querySelector('.documents__download')
    if (label) label.textContent = 'Запросить документ'
    link.addEventListener('click', (event) => {
      event.preventDefault()
      scrollToContact()
    })
  })
  const documentNames = [
    'Проектная декларация',
    'Разрешение на строительство',
    'Градостроительный план земельного участка',
    'Заключение о соответствии проектной документации',
    'Договор долевого участия',
  ]
  document.querySelectorAll('.documents__name').forEach((name, index) => {
    if (documentNames[index]) name.textContent = documentNames[index]
  })

  const reviewNavButtons = [...document.querySelectorAll('.reviews-section__nav-btn')]
  if (document.querySelectorAll('.reviews-section__slide,.reviews-section__item').length < 2) {
    reviewNavButtons.forEach((button) => {
      button.disabled = true
      button.setAttribute('aria-disabled', 'true')
    })
  }

  document.querySelectorAll('.apartment-card__favorite').forEach((button) => {
    button.setAttribute('aria-pressed', 'false')
    button.addEventListener('click', () => {
      const active = button.getAttribute('aria-pressed') === 'true'
      button.setAttribute('aria-pressed', String(!active))
      button.setAttribute('aria-label', active ? 'Добавить в избранное' : 'Удалить из избранного')
    })
  })

  const constructionCards = [...document.querySelectorAll('.construction__card')]
  if (constructionCards.length) {
    const dialog = document.createElement('dialog')
    dialog.className = 'vavilova-construction-dialog'
    dialog.innerHTML = '<button type="button" class="vavilova-construction-dialog__close" aria-label="Закрыть">×</button><img class="vavilova-construction-dialog__image" alt=""><p class="vavilova-construction-dialog__caption"></p>'
    const initialSource = constructionCards[0].querySelector('img')
    const initialImage = dialog.querySelector('.vavilova-construction-dialog__image')
    if (initialSource && initialImage) {
      initialImage.src = initialSource.currentSrc || initialSource.src
      initialImage.alt = initialSource.alt || 'Ход строительства ЖК «Вавилова 64»'
    }
    document.body.appendChild(dialog)
    const close = () => dialog.close()
    dialog.querySelector('.vavilova-construction-dialog__close')?.addEventListener('click', close)
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) close()
    })
    constructionCards.forEach((card) => card.addEventListener('click', () => {
      const source = card.querySelector('img')
      const image = dialog.querySelector('.vavilova-construction-dialog__image')
      const caption = dialog.querySelector('.vavilova-construction-dialog__caption')
      if (source && image) {
        image.src = source.currentSrc || source.src
        image.alt = source.alt || card.textContent.trim()
      }
      if (caption) caption.textContent = card.querySelector('.construction__year')?.textContent.trim() || 'Ход строительства'
      dialog.showModal()
      dialog.querySelector('.vavilova-construction-dialog__close')?.focus()
    }))
  }
})()

if (window.location.protocol !== 'file:') {
  const localAssetByFilename = {
    '37537bbcc39d4cd6cbbfa8bee57ccfe0.jpg': 'remote-01.jpg',
    'bf26ef82ed142679082f0fae8dc18488.png': 'remote-02.png',
    'd0e8983961e781afad3c1f25a08f5275.jpg': 'remote-03.jpg',
    '29296760b219f5107a541eb0cac60fdc.jpg': 'remote-04.jpg',
    '45441924dd559f27980bb1e4b9e35d1e.jpg': 'remote-05.jpg',
    '38354625442181b9dd310d2ad6d696c8.png': 'remote-07.png',
    '7fbe570016207b60c4b87abce0359c2b.jpg': 'remote-08.jpg',
    'ee04fea766ad35ed0e0cc65912603d6f.jpeg': 'remote-09.jpeg',
    '53627b2d71b98135a8c2258f212b0db5.png': 'remote-10.png',
    '3cd5b2a4636a91623bf1125e9b389892.jpg': 'remote-11.jpg',
    '3484ecf7d74418f69a0504af4589a7d7.jpg': 'remote-12.jpg',
    '2a6f5cdc8f57a2f27dae77f9c4b3c757.jpeg': 'remote-13.jpeg',
    'b138dc69ef90454451aad7e0b03633f8.png': 'remote-14.png',
    'dcd957119fb45bc4e6bf026b560fe838.jpg': 'remote-15.jpg',
    '02ede6a47f1d7d9037a60bbd94dacd88.jpg': 'remote-16.jpg',
    '7488fd27911cb615739d3c4e0d57c4ed.jpg': 'remote-17.jpg',
    '7cbc0403f9a07e8399d7dfe3ae2115fe.jpg': 'remote-18.jpg',
    'c1651708fd986a42f24484ae8ca711f5.jpg': 'remote-19.jpg',
  }
  const localAsset = (value) => {
    if (!value) return value
    if (value.includes('/pictures/logo.svg')) return '/stranitsa-zhk/assets/reference/remote-06.svg'
    if (value.includes('8f5ddbc1f811f957fe777caaf9cef323')) return '/stranitsa-zhk/assets/reference/expert-anastasia-shpak.jpg'
    if (value.includes('/pictures/consultation/cta-ruslan-pruss.webp')) return '/stranitsa-zhk/assets/reference/cta-ruslan-pruss.webp'
    if (value.includes('/pictures/newsletter/subscribe-block-img.webp')) return '/stranitsa-zhk/assets/reference/subscribe-block-img.webp'
    if (value.includes('/pictures/newsletter/subscribe-block-img-mob.webp')) return '/stranitsa-zhk/assets/reference/subscribe-block-img-mob.webp'
    if (value.includes('/pictures/floating-expert/old-money-interior.webp')) return '/stranitsa-zhk/assets/reference/old-money-interior.webp'
    if (value.includes('/pictures/for-banks/modal-request-img.webp')) return '/stranitsa-zhk/assets/reference/modal-request-img.webp'
    if (value.includes('/images/mock/contacts-background.png')) return '/stranitsa-zhk/assets/reference/contacts-background.webp'
    if (value.includes('/images/mock/dom-dostizhenie-construction-2025.jpg')) return '/stranitsa-zhk/assets/reference/construction-2025.webp'
    if (value.includes('/images/mock/dom-dostizhenie-construction-2026.jpg')) return '/stranitsa-zhk/assets/reference/construction-2026.webp'
    if (value.startsWith('assets/reference/')) return `/stranitsa-zhk/${value}`
    if (value.includes('/zhilye-kompleksy/vavilova-64/assets/reference/')) return value.replace('/zhilye-kompleksy/vavilova-64/', '/stranitsa-zhk/')
    const filename = Object.keys(localAssetByFilename).find((name) => value.includes(name))
    return filename ? `/stranitsa-zhk/assets/reference/${localAssetByFilename[filename]}` : value
  }
  const rewriteImage = (image) => {
    const src = image.getAttribute('src')
    const next = localAsset(src)
    if (src && next !== src) image.setAttribute('src', next)
    const srcset = image.getAttribute('srcset')
    if (srcset) image.setAttribute('srcset', srcset.split(',').map((part) => {
      const [url, descriptor] = part.trim().split(/\s+/, 2)
      const rewritten = localAsset(url)
      return descriptor ? `${rewritten} ${descriptor}` : rewritten
    }).join(', '))
  }
  const rewriteImages = () => document.querySelectorAll('img').forEach(rewriteImage)
  rewriteImages()
  new MutationObserver(rewriteImages).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['src', 'srcset'] })
}

if (window.location.protocol !== 'file:' && /\/zhilye-kompleksy\/vavilova-64\/?$/.test(window.location.pathname)) {
  const originalClient = document.createElement('script')
  originalClient.type = 'module'
  originalClient.src = '_nuxt/B9PCyV3B.js'
  document.head.appendChild(originalClient)
}
