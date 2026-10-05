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
    if (value.includes('/pictures/logo.svg')) return '/vavilova-64/assets/reference/remote-06.svg'
    if (value.includes('/pictures/consultation/cta-ruslan-pruss.webp')) return '/vavilova-64/assets/reference/cta-ruslan-pruss.webp'
    if (value.includes('/pictures/newsletter/subscribe-block-img.webp')) return '/vavilova-64/assets/reference/subscribe-block-img.webp'
    if (value.includes('/pictures/newsletter/subscribe-block-img-mob.webp')) return '/vavilova-64/assets/reference/subscribe-block-img-mob.webp'
    if (value.includes('/pictures/floating-expert/old-money-interior.webp')) return '/vavilova-64/assets/reference/old-money-interior.webp'
    if (value.includes('/pictures/for-banks/modal-request-img.webp')) return '/vavilova-64/assets/reference/modal-request-img.webp'
    if (value.startsWith('assets/reference/')) return `/vavilova-64/${value}`
    if (value.includes('/zhilye-kompleksy/vavilova-64/assets/reference/')) return value.replace('/zhilye-kompleksy/vavilova-64/', '/vavilova-64/')
    const filename = Object.keys(localAssetByFilename).find((name) => value.includes(name))
    return filename ? `/vavilova-64/assets/reference/${localAssetByFilename[filename]}` : value
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

if (window.location.protocol !== 'file:') {
  const originalClient = document.createElement('script')
  originalClient.type = 'module'
  originalClient.src = '_nuxt/B9PCyV3B.js'
  document.head.appendChild(originalClient)
}
