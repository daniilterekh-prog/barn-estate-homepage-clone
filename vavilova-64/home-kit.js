// Agent-facing labels only. Keep URLs, legal names, inputs and event listeners.
(() => {
  if (!document.body.classList.contains('vavilova-home-kit')) return
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  let node
  while ((node = walker.nextNode())) {
    if (node.parentElement.closest('script,style,textarea,input,[data-legal-name]')) continue
    if (/BARNES INTERNATIONAL REALTY|BARNES International Realty/.test(node.nodeValue)) continue
    node.nodeValue = node.nodeValue.replace(/\bBARNES\b/g, 'BARN Estate')
  }
  document.querySelectorAll('img[alt],a[aria-label],button[aria-label]').forEach(element => {
    for (const name of ['alt', 'aria-label']) {
      const value = element.getAttribute(name)
      if (value && !/INTERNATIONAL REALTY/i.test(value)) {
        element.setAttribute(name, value.replace(/\bBARNES\b/g, 'BARN Estate'))
      }
    }
  })
  document.title = document.title.replace(/\bBARNES\b/g, 'BARN Estate')
  const ogTitle = document.querySelector('meta[property="og:title"]')
  if (ogTitle) ogTitle.content = ogTitle.content.replace(/\bBARNES\b/g, 'BARN Estate')
})()
