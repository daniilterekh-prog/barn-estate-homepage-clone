function initializeFavoritesKit() {
  'use strict'
  const header = document.querySelector('.site-header')
  const wrapper = header.closest('.layout__header')
  const burger = header.querySelector('.site-header__icon-btn')
  const menu = header.querySelector('#site-mobile-menu')
  // Reuse approved burger navigation as the single source of submenu links.
  const desktopNav = header.querySelector('.site-header__nav')
  const groups = [...menu.querySelectorAll('.site-menu__nav-group,.site-menu__bottom-group')]
  let activeDropdown = null, closeTimer
  function closeDropdown() {
    clearTimeout(closeTimer)
    if (!activeDropdown) return
    activeDropdown.panel.hidden = true
    activeDropdown.link.setAttribute('aria-expanded','false')
    activeDropdown = null
  }
  function openDropdown(entry) {
    clearTimeout(closeTimer)
    if (activeDropdown === entry || !desktopNav.getClientRects().length || isOpen()) return
    closeDropdown()
    activeDropdown = entry
    entry.panel.hidden = false
    entry.link.setAttribute('aria-expanded','true')
    entry.panel.style.left = '0px'
    const bounds = entry.panel.getBoundingClientRect()
    entry.panel.style.left = Math.min(0,innerWidth - 16 - bounds.right) + 'px'
  }
  desktopNav.querySelectorAll('.site-header__nav-item').forEach((item,index) => {
    const link = item.querySelector('.site-header__nav-link')
    const group = groups.find(group => group.querySelector('.site-menu__nav-title,.site-menu__bottom-title')?.textContent.trim() === link.textContent.trim())
    const links = group?.querySelectorAll('li a')
    if (!links?.length) return
    const panel = document.createElement('div')
    panel.className = 'favorites-nav-dropdown'
    panel.id = 'favorites-nav-dropdown-' + index
    panel.hidden = true
    const list = document.createElement('ul')
    links.forEach(source => {
      const li = document.createElement('li'), a = document.createElement('a')
      a.href = source.href
      a.textContent = source.textContent.trim()
      li.append(a);list.append(li)
    })
    panel.append(list);item.append(panel)
    link.setAttribute('aria-expanded','false')
    link.setAttribute('aria-controls',panel.id)
    const entry = {item,link,panel}
    item.addEventListener('pointerenter',event => {if(event.pointerType !== 'touch') openDropdown(entry)})
    item.addEventListener('pointerleave',() => {closeTimer=setTimeout(() => {if(!item.contains(document.activeElement)) closeDropdown()},180)})
    item.addEventListener('focusin',() => openDropdown(entry))
    item.addEventListener('focusout',event => {if(!item.contains(event.relatedTarget)) closeDropdown()})
    item.addEventListener('keydown',event => {
      if(event.key === 'ArrowDown' && event.target === link){event.preventDefault();openDropdown(entry);panel.querySelector('a').focus()}
      if(event.key === 'Escape'){
        event.preventDefault();event.stopPropagation()
        link.focus({preventScroll:true});closeDropdown()
      }
    })
  })
  document.addEventListener('pointerdown',event => {if(!desktopNav.contains(event.target)) closeDropdown()})
  let menuWasOpen = false, restoreMenu = null
  const isOpen = () => !menu.hidden
  function menuState() {
    const open = isOpen()
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню')
    if (open) {
      closeDropdown()
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
    closeDropdown()
    if (isOpen()) burger.click()
    const sticky = header.classList.contains('site-header--scrolled')
    header.classList.remove('site-header--scrolled')
    wrapper.style.minHeight = header.getBoundingClientRect().height + 'px'
    header.classList.toggle('site-header--scrolled', sticky)
  }
  new MutationObserver(() => {
    closeDropdown()
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
