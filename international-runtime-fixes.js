(() => {
  'use strict'

  if (!document.querySelector('.page.catalog')) return

  document.querySelectorAll('.catalog-faq__question').forEach((question) => {
    question.addEventListener('click', () => {
      const item = question.closest('.catalog-faq__item')
      const answer = item?.querySelector('.catalog-faq__answer')
      if (!item || !answer) return
      const open = question.getAttribute('aria-expanded') === 'true'
      question.setAttribute('aria-expanded', String(!open))
      item.classList.toggle('catalog-faq__item--open', !open)
      answer.classList.toggle('catalog-faq__answer--open', !open)
    }, { capture: true })
  })
})()
