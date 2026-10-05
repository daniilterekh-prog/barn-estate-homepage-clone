(() => {
  const byText = (selector, value) => [...document.querySelectorAll(selector)].find((node) => node.textContent.trim() === value)
  const scrollToSection = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const sectionByLabel = {
    'Характеристики': 'characteristics',
    'Описание': 'about',
    'Фото': 'gallery',
    'Продажа': 'apartments',
    'Инфраструктура': 'location',
    'Ход строительства': 'construction',
    'Похожие предложения': 'similar',
  }

  document.querySelectorAll('.detail-sticky-header__link').forEach((button) => {
    button.addEventListener('click', () => scrollToSection(sectionByLabel[button.textContent.trim()]))
  })

  document.querySelectorAll('[class*="__cta"], [class*="__consult"], [class*="__submit"], [class*="__call-btn"]').forEach((button) => {
    button.addEventListener('click', () => scrollToSection('catalog-contact'))
  })

  document.querySelectorAll('.detail-location__category').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.detail-location__category').forEach((item) => item.classList.remove('is-active'))
      button.classList.add('is-active')
    })
  })

  document.querySelectorAll('.catalog-faq__question').forEach((button) => {
    button.addEventListener('click', () => {
      const answer = button.parentElement?.querySelector('[class*="answer"]') || button.nextElementSibling
      if (!answer) return
      const expanded = button.getAttribute('aria-expanded') === 'true'
      button.setAttribute('aria-expanded', String(!expanded))
      answer.hidden = expanded
    })
  })

  document.querySelectorAll('a[href="#"]').forEach((link) => link.addEventListener('click', (event) => event.preventDefault()))

  const header = document.querySelector('.site-header')
  const sticky = document.querySelector('.detail-sticky-header')
  if (header && sticky) {
    const updateSticky = () => {
      sticky.setAttribute('aria-hidden', String(window.scrollY < window.innerHeight * .72))
      sticky.classList.toggle('detail-sticky-header--visible', window.scrollY >= window.innerHeight * .72)
    }
    window.addEventListener('scroll', updateSticky, { passive: true })
    updateSticky()
  }
})()
