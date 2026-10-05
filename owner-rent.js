/* Isolated interactions for /arenda_sobstvennikam/.  The page markup and
   styles are a static SSR snapshot of the reference page. */
(function () {
  'use strict'

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true })
    else fn()
  }

  ready(function () {
    var header = document.querySelector('.site-header')
    var sticky = document.querySelector('.owner-sale-sticky')
    var menuButton = document.querySelector('.site-header__icon-btn')
    var menuOpen = false

    function updateScrollState() {
      var scrolled = window.scrollY > 24
      if (header) header.classList.toggle('site-header--scrolled', scrolled)
      if (sticky) sticky.classList.toggle('owner-sale-sticky--visible', scrolled)
    }

    window.addEventListener('scroll', updateScrollState, { passive: true })
    updateScrollState()

    if (sticky) {
      sticky.querySelectorAll('[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (event) {
          var target = document.querySelector(link.getAttribute('href'))
          if (!target) return
          event.preventDefault()
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      })
    }

    function closeMenu() {
      menuOpen = false
      document.documentElement.classList.remove('owner-rent-menu-open')
      if (menuButton) menuButton.setAttribute('aria-expanded', 'false')
      var drawer = document.querySelector('.owner-rent-drawer')
      if (drawer) drawer.remove()
    }

    function openMenu() {
      if (menuOpen) return closeMenu()
      menuOpen = true
      document.documentElement.classList.add('owner-rent-menu-open')
      if (menuButton) menuButton.setAttribute('aria-expanded', 'true')
      var drawer = document.createElement('aside')
      drawer.className = 'owner-rent-drawer'
      drawer.setAttribute('aria-label', 'Меню')
      drawer.innerHTML = '<button type="button" class="owner-rent-drawer__close" aria-label="Закрыть меню">×</button>' +
        '<nav><a href="/">Главная</a><a href="/arendovat/">Арендовать</a><a href="/prodazha_sobstvennikam/">Продать недвижимость</a><a href="#request">Оставить заявку</a><a href="/media/blog/">Статьи</a></nav>'
      document.body.appendChild(drawer)
      drawer.querySelector('button').addEventListener('click', closeMenu)
      drawer.querySelectorAll('a').forEach(function (link) { link.addEventListener('click', closeMenu) })
    }

    if (menuButton) menuButton.addEventListener('click', openMenu)
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMenu()
    })

    document.querySelectorAll('form').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault()
        var submit = form.querySelector('button[type="submit"]')
        if (submit) {
          submit.disabled = true
          var original = submit.textContent
          submit.textContent = 'Отправлено'
          window.setTimeout(function () {
            submit.disabled = false
            submit.textContent = original
          }, 2500)
        }
      })
    })

    var floatingExpert = document.createElement('aside')
    floatingExpert.className = 'floating-expert floating-expert--gorodskaya'
    floatingExpert.setAttribute('aria-label', 'Руслан Прус')
    floatingExpert.setAttribute('data-v-cd0a1259', '')
    floatingExpert.innerHTML = '<button data-v-cd0a1259 type="button" class="floating-expert__card" aria-haspopup="dialog"><span data-v-cd0a1259 class="floating-expert__avatar"><img data-v-cd0a1259 src="https://front.barnes.vsavr.ru/pictures/consultation/cta-ruslan-pruss.webp" alt="Руслан Прус" width="72" height="72" loading="lazy" decoding="async"></span><span data-v-cd0a1259 class="floating-expert__content"><span data-v-cd0a1259 class="floating-expert__label">Руководитель департамента городской недвижимости</span><span data-v-cd0a1259 class="floating-expert__title">Задать вопрос эксперту</span><span data-v-cd0a1259 class="floating-expert__name">Руслан Прус</span></span></button><button data-v-cd0a1259 type="button" class="floating-expert__close" aria-label="Скрыть карточку Руслан Прус"></button>'
    document.body.appendChild(floatingExpert)
    floatingExpert.querySelector('.floating-expert__close').addEventListener('click', function (event) {
      event.stopPropagation()
      floatingExpert.remove()
    })
    floatingExpert.querySelector('.floating-expert__card').addEventListener('click', function () {
      var target = document.querySelector('#request')
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  })
})()
