(() => {
  'use strict'

  if (!document.querySelector('.page.catalog')) return

  const installImageFallbacks = async () => {
    try {
      const response = await fetch('/mezhdunarodnaya-nedvizhimost/assets/manifest.json')
      if (!response.ok) return
      const manifest = await response.json()
      const fallbackBySource = new Map(manifest.assets.map((asset) => [asset.sourceUrl, asset.localPath]))

      const attachFallback = (image) => {
        if (image.dataset.internationalFallbackAttached) return
        image.dataset.internationalFallbackAttached = 'true'
        image.addEventListener('error', () => {
          const fallback = fallbackBySource.get(image.currentSrc || image.src)
          if (!fallback || image.dataset.internationalFallbackUsed) return
          image.dataset.internationalFallbackUsed = 'true'
          image.src = `/mezhdunarodnaya-nedvizhimost/${fallback}`
        }, { once: true })
      }

      document.querySelectorAll('img').forEach(attachFallback)
      new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType !== Node.ELEMENT_NODE) return
            if (node.matches('img')) attachFallback(node)
            node.querySelectorAll?.('img').forEach(attachFallback)
          })
        })
      }).observe(document.body, { childList: true, subtree: true })
    } catch (_) {
      // The remote images remain the canonical source when the local manifest is unavailable.
    }
  }

  installImageFallbacks()

  const installMapFallback = () => {
    const map = document.querySelector('.catalog-projects-map')
    const canvas = map?.querySelector('.catalog-projects-map__canvas')
    if (!map || !canvas || canvas.querySelector('ymaps3--map')) return

    map.classList.add('catalog-projects-map--static-fallback')
    const mapAttribution = document.createElement('div')
    mapAttribution.className = 'international-map-fallback-attribution'
    mapAttribution.innerHTML = `
      <a href="https://yandex.ru/legal/maps_termsofuse/?lang=ru_RU" target="_blank" rel="noopener">Условия использования</a>
      <a href="https://yandex.ru/maps/?from=api-maps&amp;ll=37.61842300000002%2C55.75124399999371&amp;origin=jsapi_3&amp;z=11&amp;l=map" target="_blank" rel="noopener">© Яндекс</a>
    `
    const openMapsButton = document.createElement('button')
    openMapsButton.className = 'international-map-fallback-open'
    openMapsButton.type = 'button'
    openMapsButton.textContent = 'Открыть Яндекс Карты'
    openMapsButton.addEventListener('click', () => {
      window.open('https://yandex.ru/maps/?from=api-maps&ll=37.61842300000002%2C55.75124399999371&origin=jsapi_3&z=11&l=map', '_blank', 'noopener')
    })
    const zoomControls = document.createElement('div')
    zoomControls.className = 'international-map-fallback-zoom'
    zoomControls.innerHTML = '<button type="button" aria-label="Увеличить карту">+</button><button type="button" aria-label="Уменьшить карту">−</button>'
    canvas.append(openMapsButton, zoomControls, mapAttribution)
    const style = document.createElement('style')
    style.textContent = `
      .catalog-projects-map--static-fallback .catalog-projects-map__canvas {
        position: relative;
        background: #f1f1f1 url('/mezhdunarodnaya-nedvizhimost/assets/map-background-1440.png') center / cover no-repeat;
      }
      .catalog-projects-map--static-fallback .catalog-projects-map__canvas > .__ymap_container {
        visibility: hidden;
      }
      .international-map-fallback-open,
      .international-map-fallback-zoom,
      .international-map-fallback-attribution {
        position: absolute;
        z-index: 2;
      }
      .international-map-fallback-open {
        bottom: 12px;
        left: 12px;
        border: 0;
        border-radius: 4px;
        background: #fff;
        box-shadow: 0 2px 8px #0002;
        color: #1e1e1e;
        cursor: pointer;
        font: 14px/1.2 'Tilda Sans', Arial, sans-serif;
        padding: 12px 16px;
      }
      .international-map-fallback-zoom {
        top: 68px;
        right: 10px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        border-radius: 4px;
        background: #fff;
        box-shadow: 0 2px 8px #0002;
      }
      .international-map-fallback-zoom button {
        width: 40px;
        height: 40px;
        border: 0;
        border-bottom: 1px solid #ddd;
        background: #fff;
        color: #333;
        cursor: pointer;
        font: 24px/1 Arial, sans-serif;
      }
      .international-map-fallback-zoom button:last-child { border-bottom: 0; }
      .international-map-fallback-attribution {
        right: 10px;
        bottom: 8px;
        display: flex;
        gap: 7px;
        align-items: center;
        color: #555;
        font: 10px/1.2 Arial, sans-serif;
      }
      .international-map-fallback-attribution a { color: inherit; text-decoration: none; }
    `
    document.head.appendChild(style)
  }

  window.setTimeout(installMapFallback, 2200)

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
