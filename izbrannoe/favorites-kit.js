function initializeFavoritesKit() {
  'use strict'
  const header = document.querySelector('.site-header')
  const wrapper = header.closest('.layout__header')
  const burger = header.querySelector('.site-header__icon-btn')
  const menu = header.querySelector('#site-mobile-menu')
  let menuWasOpen = false, restoreMenu = null
  const isOpen = () => !menu.hidden
  function menuState() {
    const open = isOpen()
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню')
    if (open) {
      document.documentElement.style.setProperty('--site-menu-top', header.getBoundingClientRect().height + 'px')
    }
    if (open === menuWasOpen) return
    menuWasOpen = open
    if (open) {
      const nodes = [document.querySelector('main'), document.querySelector('[data-barn-block="15-footer"]')]
      const states = nodes.map(e => [e,e.inert])
      const root = document.documentElement, overflow = root.style.overflow, gutter = root.style.scrollbarGutter
      states.forEach(([e]) => {e.inert = true})
      root.style.scrollbarGutter = 'stable'
      root.style.overflow = 'hidden'
      restoreMenu = () => {states.forEach(([e,v]) => {e.inert = v});root.style.overflow=overflow;root.style.scrollbarGutter=gutter}
      menu.querySelector('a')?.focus({preventScroll:true})
    } else {
      restoreMenu?.();restoreMenu = null
      document.documentElement.style.removeProperty('--site-menu-top')
      burger.focus({preventScroll:true})
    }
  }
  function reserveHeader() {
    if (isOpen()) burger.click()
    const sticky = header.classList.contains('site-header--scrolled')
    header.classList.remove('site-header--scrolled')
    wrapper.style.minHeight = header.getBoundingClientRect().height + 'px'
    header.classList.toggle('site-header--scrolled', sticky)
  }
  new MutationObserver(() => {
    menuState()
    window.__barnesHeaderContacts?.refresh()
  }).observe(header, {attributes:true,attributeFilter:['class']})
  document.addEventListener('keydown', event => {
    if (!isOpen()) return
    if (event.key === 'Escape') {event.preventDefault();event.stopImmediatePropagation();burger.click();menuState();return}
    if (event.key !== 'Tab') return
    const items = [burger,...menu.querySelectorAll('a[href],button:not([disabled])')].filter(e => e.getClientRects().length)
    const i=items.indexOf(document.activeElement)
    if (event.shiftKey && i<=0) {event.preventDefault();items.at(-1)?.focus()}
    else if (!event.shiftKey && i===items.length-1) {event.preventDefault();burger.focus()}
  },true)
  document.addEventListener('click', event => {
    if (event.target.closest('.site-header__favorites-btn')) event.target.closest('a').href='index.html'
  },true)
  function annotateSelection() {
    const form = document.querySelector('[data-barn-modal] form')
    if (!form || form.querySelector('[name="favoriteIds"]')) return
    for (const [name,value] of Object.entries({favoriteIds:JSON.stringify(window.BarnesFavorites.getIds()),favoritesPreview:String(new URLSearchParams(location.search).get('preview')==='1')})) {
      const input=document.createElement('input');input.type='hidden';input.name=name;input.value=value;form.append(input)
    }
  }
  new MutationObserver(annotateSelection).observe(document.body,{childList:true,subtree:true})
  reserveHeader()
  document.fonts.ready.then(reserveHeader)
  window.addEventListener('resize',reserveHeader)
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initializeFavoritesKit,{once:true});else initializeFavoritesKit();
