/* Relocate the preserved page runtime without mixing it into editable blocks. */
(() => {
 'use strict';
 if (window.__BarnHandoff) return;
 const NativeURL = window.URL;
 const script = document.currentScript;
 const source = "https://daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/";
 const references = {"https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/owner-mechanics.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/owner-mechanics.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/owner-panorama.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/owner-panorama.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/presentation-mobile.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/presentation-mobile.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/expert-avatar.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/expert-avatar.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/anchor-navigation.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/anchor-navigation.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/services-layout.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/services-layout.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/newsletter-home.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/newsletter-home.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/about-home.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/about-home.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/cta-resort.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/cta-resort.css","https://daniilterekh-prog.github.io/barnes-assets/brand/barn-estate/logo.svg":"../assets/9b2d8c1a7d4d2135.svg","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/expert-dialog.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/expert-dialog.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/anchor-navigation.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/anchor-navigation.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/expert-avatar.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/expert-avatar.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/newsletter-home.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/newsletter-home.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/owner-panorama.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/owner-panorama.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/cta-resort.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/cta-resort.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/expert-dialog.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/expert-dialog.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/about-home.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/about-home.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/cta-bleed.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/cta-bleed.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/slider-controls.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/slider-controls.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/card-gaps.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/card-gaps.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/page-kit.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/page-kit.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/layout-gutters.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/layout-gutters.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/brand-nowrap.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/brand-nowrap.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/owner-sale.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/owner-sale.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/page-breadcrumbs.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/page-breadcrumbs.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/hero-laptop.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/hero-laptop.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/media-reference.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/media-reference.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/slider-controls.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/slider-controls.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/page-breadcrumbs.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/page-breadcrumbs.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/brand-nowrap.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/brand-nowrap.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/cta-bleed.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/cta-bleed.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/assets/ruslan.webp":"../assets/4464b6998f60131d.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/media-header.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/media-header.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/media-header.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/media-header.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/owner-sale.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/owner-sale.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/hero.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/hero.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/assets/hero.png":"../assets/615bfa6ae8972761.png","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/exact-2026-10-21/home-owner-form.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/exact-2026-10-21/home-owner-form.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/source.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/source.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/assets/fonts/TildaSans-Light.woff2":"../assets/f0f2c165784c7234.woff2","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/assets/presentation-v3/object-detail.webp":"../assets/fe53b29e285ed19e.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/assets/presentation-v3/viewing.webp":"../assets/5d852247fa02f311.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/exact-2026-10-21/blocks/14-newsletter/assets/8a78978e0423f444f2adbe1f.webp":"../assets/a59b66d0d7fdeda1.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/assets/presentation-v3/legal.webp":"../assets/ec539a2263ccb105.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/assets/presentation-v3/positioning.webp":"../assets/925883abb16a4b93.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/assets/fonts/TildaSans-Regular.woff2":"../assets/2670dad44ca6c2a1.woff2","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/owner-header.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/owner-header.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/assets/fonts/TildaSans-Medium.woff2":"../assets/f716269e361f4665.woff2","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/assets/stages.png":"../assets/718abf0b246fe187.png","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/assets/presentation-v3/privacy.webp":"../assets/cc27430018adaa0a.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/assets/types-04.png":"../assets/398e4b6d8ad61632.png","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/assets/strategy.png":"../assets/362c3f5453ecc581.png","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/assets/types-03.png":"../assets/7e10e0bd72639a4b.png","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/assets/presentation-v3/negotiation.webp":"../assets/a8167d8f84ef0eca.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/pictures/office-contact/telegram.svg":"../assets/4435c9a57e165a1c.svg","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/assets/ruslan-floating-media.webp":"../assets/6bbaa8e1df83e7d5.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/pictures/office-contact/whatsapp.svg":"../assets/3e197e0e1f3e679e.svg","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/assets/consultation-bg.webp":"../assets/963872afd408bd77.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/assets/types-01.png":"../assets/f780a9179fd099d0.png","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/assets/home-about-logo-round-red.png":"../assets/abb141124e76fe4c.png","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/assets/types-02.png":"../assets/f1cefa66d4f8cc2a.png","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/pictures/office-contact/max.svg":"../assets/5caa61a4b0731d0d.svg","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/assets/barnes-private-salon.webp":"../assets/ffab11f9222a5a3d.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/exact-2026-10-21/blocks/14-newsletter/assets/f6f65669dc22ef4fe836335c.webp":"../assets/3285d219f1845deb.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/assets/menu-featured-02.jpg":"../assets/7781fce4e8048ef7.jpg","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/assets/menu-featured-01.jpg":"../assets/c5384c30d421ad70.jpg","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/assets/modal-ruslan-organic.webp":"../assets/6bbaa8e1df83e7d5.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/assets/services-bg.png":"../assets/a1f881f235a834e6.png","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/fonts/TildaSans-Light.woff2":"../assets/f0f2c165784c7234.woff2","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/fonts/TildaSans-Regular.woff2":"../assets/2670dad44ca6c2a1.woff2","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/fonts/TildaSans-Medium.woff2":"../assets/f716269e361f4665.woff2","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/assets/fonts/TildaSans-Semibold.woff2":"../assets/3814f8c444073262.woff2","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/assets/fonts/TildaSans-Bold.woff2":"../assets/a2690df6fe834806.woff2","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/assets/fonts/TildaSans-ExtraBold.woff2":"../assets/726a3a878465a590.woff2","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/assets/fonts/TildaSans-Black.woff2":"../assets/73abed6708c43912.woff2","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/assets/modal-request.webp":"../assets/cb1ac940c0a5bc83.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/assets/floating-expert-bg.webp":"../assets/9509f5dd4efa3674.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/":"../html/index.html"};
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
