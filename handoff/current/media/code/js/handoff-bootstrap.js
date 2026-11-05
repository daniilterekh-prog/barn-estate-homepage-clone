/* Relocate the preserved page runtime without mixing it into editable blocks. */
(() => {
 'use strict';
 if (window.__BarnHandoff) return;
 const NativeURL = window.URL;
 const script = document.currentScript;
 const source = "https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/";
 const references = {"https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/style.CIys_ExF.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/style.CIys_ExF.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/media-ui-kit.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/media/media-ui-kit.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/media-typography.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/media/media-typography.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/hero-laptop.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/media/hero-laptop.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/home-kit.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/media/home-kit.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/mobile-layout.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/media/mobile-layout.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/D0yxhUTd.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/D0yxhUTd.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/kit/home-spacing.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/media/kit/home-spacing.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/page-breadcrumbs.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/page-breadcrumbs.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/media-header.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/media/media-header.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/exact-2026-10-21/home-owner-form.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/exact-2026-10-21/home-owner-form.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/hero-reference.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/media/hero-reference.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/page-kit.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/media/page-kit.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/BfiGtcZ0.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/BfiGtcZ0.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/uhpdXi8b.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/uhpdXi8b.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/S8YO-wjC.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/S8YO-wjC.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/83yWE3O-.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/83yWE3O-.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/slider-controls.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/slider-controls.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/brand-nowrap.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/media/brand-nowrap.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/pictures/mock/contacts-background.webp":"../../../shared/assets/612ba80ab547d43d.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/Do3ne2qC.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/Do3ne2qC.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/kit/home-typography.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/media/kit/home-typography.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/C5olrH7c.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/C5olrH7c.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/BU2xWQHo.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/BU2xWQHo.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/Cgus0222.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/Cgus0222.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/CFZN_xYQ.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/CFZN_xYQ.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/cr5LBAdK.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/cr5LBAdK.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/BHimf0ZB.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/BHimf0ZB.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/pictures/logo.svg":"../../../shared/assets/9b2d8c1a7d4d2135.svg","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/D-00bjsc.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/D-00bjsc.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/layout-gutters.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/layout-gutters.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/cta-bleed.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/cta-bleed.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/card-gaps.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/card-gaps.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/ujul8TNW.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/ujul8TNW.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/CX5t5dJR.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/CX5t5dJR.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/FOtBbIy-.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/FOtBbIy-.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/C8UT6lXa.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/C8UT6lXa.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/preview-guard.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/media/preview-guard.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/VNfaeIID.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/VNfaeIID.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/kit/home-buttons.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/media/kit/home-buttons.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/DG0aNqvh.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/DG0aNqvh.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/B6jnLW7p.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/B6jnLW7p.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/Dp8XTTW3.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/Dp8XTTW3.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/BlkTOgCQ.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/BlkTOgCQ.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/kit/home-header-contacts.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/media/kit/home-header-contacts.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/D1gV92bo.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/D1gV92bo.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/kWjSkF6H.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/kWjSkF6H.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/C-bRiW-L.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/C-bRiW-L.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/exact-2026-10-21/home-owner-form.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/exact-2026-10-21/home-owner-form.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/assets/3f1a8ddd0969.jpg":"../../../shared/assets/7f5b2f41c7371d17.jpg","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/BT3tluBQ.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/media/_nuxt/BT3tluBQ.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/cta-bleed.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/cta-bleed.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/page-breadcrumbs.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/page-breadcrumbs.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/pictures/office-contact/telegram.svg":"../../../shared/assets/4435c9a57e165a1c.svg","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/pictures/office-contact/whatsapp.svg":"../../../shared/assets/3e197e0e1f3e679e.svg","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/hero-height.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/media/hero-height.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/pictures/office-contact/max.svg":"../../../shared/assets/5caa61a4b0731d0d.svg","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/slider-controls.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/slider-controls.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/kit/home-header-contacts.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/media/kit/home-header-contacts.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/brand-nowrap.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/media/brand-nowrap.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/home-kit.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/media/home-kit.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/media-header.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/media/media-header.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/assets/1f3c02d5dfd1.svg":"../../../shared/assets/9a3836abbd9be5ff.svg","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/assets/073a8c5c7e1f.svg":"../../../shared/assets/264c1d9659661f19.svg","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/assets/916a81b9692c.svg":"../../../shared/assets/4a7a346835f09776.svg","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/assets/d7fdb5c7d799.svg":"../../../shared/assets/c8073291b5c80b51.svg","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/assets/d4d25a1720b5.svg":"../../../shared/assets/cc8b08ff39075f88.svg","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/fonts/TildaSans-Medium.woff2":"../../../shared/assets/f716269e361f4665.woff2","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/fonts/TildaSans-Regular.woff2":"../../../shared/assets/2670dad44ca6c2a1.woff2","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/assets/cc24b5088a62.png":"../../../shared/assets/fb5b1fe66c3d1a3e.png","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/assets/ac08b5bc4b40.png":"../../../shared/assets/20a7005a5aaf94d3.png","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/fonts/TildaSans-Light.woff2":"../../../shared/assets/f0f2c165784c7234.woff2","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/assets/8cb420ffa393.png":"../../../shared/assets/70a34b91eeac0f7a.png","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/pictures/media/library-banner.jpg":"../../../shared/assets/9d2b482860ffe98c.jpg","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/pictures/newsletter/subscribe-block-img-main.webp":"../../../shared/assets/a59b66d0d7fdeda1.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/pictures/consultation/cta-ruslan-portrait.webp":"../../../shared/assets/4464b6998f60131d.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/pictures/media/moscow-q1-2026-photo.webp":"../../../shared/assets/03e90186522c6c39.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/quiz/assets/owner-modal-prus.webp":"../../../shared/assets/6bbaa8e1df83e7d5.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/pictures/media/moscow-editorial-20261103.webp":"../../../shared/assets/0cfbd127a45fb4d0.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/upload/resize_cache/iblock/73c/860_860_1/9cwjxd1nv1mw9bl45842e79dktgegwmn.png":"../../../shared/assets/da8a390f10d60edc.png","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/upload/resize_cache/iblock/294/860_860_1/61slsqlw5b3xiuzbzr2wdhtncdt8s28d.png":"../../../shared/assets/dda6d9e9e33bf7b4.png","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/assets/84f0c5a5ec24.png":"../../../shared/assets/962177570b8bd30e.png","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/upload/resize_cache/iblock/639/860_860_1/d8xnef6922u1a4llj9pvw3z1ddf3sy1y.png":"../../../shared/assets/550b4b8fe016cfa9.png","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/assets/d15206be32e6.png":"../../../shared/assets/e95343f4df3a808d.png","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/assets/361adc287ce5.jpg":"../../../shared/assets/4d788948f98d4c96.jpg","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/assets/2df9caebd7cd.png":"../../../shared/assets/263adebd13b2ecea.png","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/assets/a28ea5c4642e.png":"../../../shared/assets/6c92f0a33a164c54.png","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/assets/a3270203f0e5.png":"../../../shared/assets/e99d33cda006779c.png","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/upload/resize_cache/iblock/e46/860_860_1/ijkueckcwybkzip88ffms6xg30rlw65f.png":"../../../shared/assets/91fabe66b447114d.png","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/upload/resize_cache/iblock/a83/860_860_1/lf3yhp13yczliygj1mtv44gxpbcydrnr.png":"../../../shared/assets/ef20841008b1bc32.png","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/upload/resize_cache/iblock/bb1/860_860_1/10is3kag8edpmn1zo5ch1l5nh1jn1p29.png":"../../../shared/assets/321837bbbc4a44ee.png","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/pictures/media/library-editorial-20261103.webp":"../../../shared/assets/dd5b332651ee4010.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/pictures/newsletter/subscribe-block-img-mob.webp":"../../../shared/assets/3285d219f1845deb.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/exact-2026-10-21/assets/owner-modal-prus.webp":"../../../shared/assets/6bbaa8e1df83e7d5.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/assets/45166ee62836.jpg":"../../../shared/assets/5b10e2286da52d33.jpg","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/assets/d77b3a703b03.jpg":"../../../shared/assets/b558020c3e4b76d7.jpg","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/pictures/media/market-highlights-bg.webp":"../../../shared/assets/76046faa8c57fab4.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/exact-2026-10-21/assets/quiz-mobile-prus-magazine.webp":"../../../shared/assets/8985649766af2311.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/pictures/feedback-hero.webp":"../../../shared/assets/b5b079b952ba93c6.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/":"../html/index.html"};
 const previewURL = location.href;
 const currentBase = new NativeURL('./', previewURL).href;
 const pageBase = new NativeURL('./', previewURL).pathname;
 const byOld = {}, byNew = {}, byPath = {};
 for (const [url, relative] of Object.entries(references)) {
  const target = new NativeURL(relative, script.src).href;
  byOld[url] = target;
  byNew[target] = url;
  const pathname = new NativeURL(url).pathname;
  byPath[pathname] = target;
  if (pathname.startsWith('/barn-estate-homepage-clone/')) {
   byPath[pathname.slice('/barn-estate-homepage-clone'.length)] = target;
  }
 }
 function originalBase(base) {
  const value = String(base || location.href);
  return byNew[value] || (value.startsWith(currentBase) ? source + value.slice(currentBase.length) : value);
 }
 function resolve(value, base) {
  try {
   let input = String(value);
   const prefix = new NativeURL(pageBase, location.origin).href;
   if (input.startsWith(prefix)) input = source + input.slice(prefix.length);
   else if (input.startsWith(pageBase)) input = source + input.slice(pageBase.length);
   const url = new NativeURL(input, originalBase(base));
   url.hash = '';
   const full = url.href;
   url.search = '';
   return byOld[full] || byOld[url.href] || byPath[url.pathname] || null;
  } catch { return null; }
 }
 const resource = (value, base = source) => resolve(value, base) || value;
 class HandoffURL extends NativeURL {
  constructor(value, base) {
   const original = originalBase(base);
   const mapped = resolve(value, original);
   super(mapped || value, mapped ? undefined : original);
  }
 }
 window.URL = HandoffURL;
 // Let Nuxt hydrate its original route, then restore the handoff URL without navigation.
 if (script.dataset.nativePage === 'true') {
  const base = document.createElement('base');
  base.href = currentBase;
  document.head.prepend(base);
  history.replaceState(history.state, '', new NativeURL(source).pathname + location.search + location.hash);
  let ticks = 0;
  const timer = setInterval(() => {
   const app = document.querySelector('#__nuxt')?.__vue_app__?.config.globalProperties.$nuxt;
   if (app?.isHydrating === false || ++ticks > 100) {
    clearInterval(timer);
    history.replaceState(history.state, '', previewURL);
   }
  }, 100);
 }
 const nativeFetch = window.fetch.bind(window);
 window.fetch = (input, options) => {
  const method = (options?.method || input?.method || 'GET').toUpperCase();
  if (!['GET', 'HEAD'].includes(method)) {
   return Promise.resolve(new Response(JSON.stringify({error:'Preview: submission disabled'}), {
    status:405, headers:{'content-type':'application/json'}
   }));
  }
  return nativeFetch(typeof input === 'string' || input instanceof NativeURL ? resource(input, location.href) : input, options);
 };
 for (const name of ['__buildAssetsURL', '__publicAssetsURL']) {
  let handler = window[name];
  Object.defineProperty(window, name, {
   configurable:true,
   get() { return handler; },
   set(value) {
    handler = typeof value === 'function' ? function(...args) {
     return resource(value.apply(this, args), source);
    } : value;
   }
  });
 }
 for (const [Type, property] of [[HTMLImageElement,'src'],[HTMLScriptElement,'src'],[HTMLLinkElement,'href'],[HTMLSourceElement,'src']]) {
  const descriptor = Object.getOwnPropertyDescriptor(Type.prototype, property);
  if (descriptor?.set) Object.defineProperty(Type.prototype, property, {
   ...descriptor,
   set(value) { return descriptor.set.call(this, resource(value, location.href)); }
  });
 }
 function srcset(value) {
  return String(value).split(',').map(item => {
   const [url, ...descriptor] = item.trim().split(/\s+/);
   return resource(url, source) + (descriptor.length ? ' ' + descriptor.join(' ') : '');
  }).join(', ');
 }
 const nativeSetAttribute = Element.prototype.setAttribute;
 Element.prototype.setAttribute = function(name, value) {
  if (name === 'src' || (name === 'href' && this.tagName === 'LINK')) value = resource(value, source);
  if (name === 'srcset') value = srcset(value);
  return nativeSetAttribute.call(this, name, value);
 };
 function rewriteHTML(html) {
  return String(html)
   .replace(/\b(src|poster)=["']([^"']+)["']/g, (_, attribute, url) => attribute + '="' + resource(url, source) + '"')
   .replace(/\bsrcset=["']([^"']+)["']/g, (_, value) => 'srcset="' + srcset(value) + '"');
 }
 const innerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
 Object.defineProperty(Element.prototype, 'innerHTML', {
  ...innerHTML,
  set(value) { return innerHTML.set.call(this, rewriteHTML(value)); }
 });
 const insertHTML = Element.prototype.insertAdjacentHTML;
 Element.prototype.insertAdjacentHTML = function(position, html) {
  return insertHTML.call(this, position, rewriteHTML(html));
 };
 window.__BarnHandoff = {source, pageBase, resource};
})();
