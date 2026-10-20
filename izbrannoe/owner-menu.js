(() => {
  'use strict'
  const button = document.querySelector('[data-menu-open]')
  const menu = document.querySelector('.site-menu')
  const header = document.querySelector('.site-header')
  if (!button || !menu || !header) return
  const wrapper = header.closest('.layout__header')
  const main = document.querySelector('main')
  const footer = document.querySelector('.favorites-layout > .site-footer')
  const closedIcon = button.innerHTML
  // Exact close icon from prodazha_sobstvennikam/owner-sale.js.
  const openIcon = '<span class="ui-icon ui-icon-current site-header__icon" data-v-63dbb988 data-v-8bd2f545><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg></span>'
  let savedOverflow = '', savedPadding = ''
  let previousInert = []
  const isOpen = () => !menu.hidden
  function position() {
    if (!isOpen()) return
    const height = header.getBoundingClientRect().height
    document.documentElement.style.setProperty('--site-menu-top', `${height}px`)
    document.documentElement.style.setProperty('--layout-header-height', `${height}px`)
  }
  function toggle(open) {
    if (open === isOpen()) return
    if (open) {
      wrapper.style.height = `${header.getBoundingClientRect().height}px`
      savedOverflow = document.body.style.overflow
      savedPadding = document.body.style.paddingRight
      const scrollbarWidth = Math.max(0, innerWidth - document.documentElement.clientWidth)
      document.body.style.paddingRight = scrollbarWidth ? `${scrollbarWidth}px` : savedPadding
      document.body.style.overflow = 'hidden'
      previousInert = [main, footer].filter(Boolean).map(element => [element, element.inert])
      previousInert.forEach(([element]) => {element.inert = true})
    }
    menu.hidden = !open
    header.classList.toggle('site-header--menu-open', open)
    button.setAttribute('aria-expanded', String(open))
    button.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню')
    button.innerHTML = open ? openIcon : closedIcon
    if (open) {
      position()
      menu.querySelector('a')?.focus({preventScroll:true})
    } else {
      wrapper.style.height = ''
      document.body.style.overflow = savedOverflow
      document.body.style.paddingRight = savedPadding
      previousInert.forEach(([element, value]) => {element.inert = value})
      document.documentElement.style.removeProperty('--site-menu-top')
      document.documentElement.style.removeProperty('--layout-header-height')
      button.focus({preventScroll:true})
    }
  }
  button.addEventListener('click', () => toggle(!isOpen()))
  menu.addEventListener('click',event => {if(event.target.closest('a, .site-menu__close, .site-menu__overlay'))toggle(false)})
  document.addEventListener('keydown',event => {
    if (!isOpen()) return
    if (event.key === 'Escape') {event.preventDefault();toggle(false);return}
    if (event.key !== 'Tab') return
    const items = [button, ...menu.querySelectorAll('a[href],button:not([disabled])')].filter(element => element.getClientRects().length)
    const index = items.indexOf(document.activeElement)
    if (event.shiftKey && index <= 0) {event.preventDefault();items.at(-1)?.focus()}
    else if (!event.shiftKey && (index === items.length-1 || index === -1)) {event.preventDefault();items[0]?.focus()}
    else if (!event.shiftKey && index === 0) {event.preventDefault();items[1]?.focus()}
  })
  addEventListener('resize',position)
})()
