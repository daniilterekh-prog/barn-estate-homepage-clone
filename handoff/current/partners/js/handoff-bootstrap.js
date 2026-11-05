/* Relocate the preserved page runtime without mixing it into editable blocks. */
(() => {
 'use strict';
 if (window.__BarnHandoff) return;
 const NativeURL = window.URL;
 const script = document.currentScript;
 const source = "https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/";
 const references = {"https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/cta-bleed.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/cta-bleed.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/slider-controls.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/slider-controls.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/page-breadcrumbs.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/page-breadcrumbs.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/layout-gutters.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/layout-gutters.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/expert-avatar.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/expert-avatar.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/anchor-navigation.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/anchor-navigation.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/page-kit.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/page-kit.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/services-layout.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/services-layout.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/brand-nowrap.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/brand-nowrap.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/about-home.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/about-home.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/style.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/style.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/kit.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/kit.css","https://daniilterekh-prog.github.io/barnes-assets/brand/barn-estate/logo.svg":"../assets/9b2d8c1a7d4d2135.svg","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/ambassadors-premium-residence-20261104.webp":"../assets/7d1227a5cde755bf.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/exact-2026-10-21/home-owner-form.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/exact-2026-10-21/home-owner-form.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/hero-laptop.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/hero-laptop.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/hero.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/hero.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/program.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/program.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/partners/87e5a0a2a2a73b3d72e87648.svg":"../assets/68ebd64f4b2d04c0.svg","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/partners/764479c3e7e1f41d81a0f02d.svg":"../assets/8a8a2fcef7b4919f.svg","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/about-logo-round-red.png":"../assets/abb141124e76fe4c.png","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/directions/directions.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/directions/directions.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/expert-dialog.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/expert-dialog.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/igor-bocharov.webp":"../assets/d9fca9ab0b97106c.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/partners/9ea9bb28f941cf235c7fd8ad.svg":"../assets/8c3ffc6b48305ece.svg","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/partners/bd50209efd9c42725c2e361e.svg":"../assets/3dc5dbae81ea4d16.svg","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/partner-contact.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/partner-contact.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/partners/93d8f9169ce58218b5e9ad91.svg":"../assets/71d6c75042649a43.svg","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/partners/8a1cfe8f5620f188115bcba8.svg":"../assets/688993a108b69c35.svg","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/partners/dbe86663de2e66fe6c7e73f8.svg":"../assets/d2fcc8d05010200d.svg","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/media-header.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/media-header.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/partners/c52b96a92cb0f04c755c14ae.svg":"../assets/b643357eddc27985.svg","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/partners/1203e601bc39306b8030eab5.svg":"../assets/827b2ed8ba410d82.svg","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/brand-moscow.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/brand-moscow.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/partners/910a6c059306c2da72402f48.svg":"../assets/981be49239329477.svg","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/partners/7e1d3274487906d5dbdc0908.svg":"../assets/01f0e6050bde3c94.svg","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/partners/256739184643c8a59ea2d95c.svg":"../assets/996a69816f82c3a2.svg","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/partners/2070652af80c99d00a1c2355.svg":"../assets/774f522ba53c035b.svg","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/media-reference.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/media-reference.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/brand-nowrap.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/brand-nowrap.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/about-home.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/about-home.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/slider-controls.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/slider-controls.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/cta-bleed.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/cta-bleed.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/anchor-navigation.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/anchor-navigation.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/page-breadcrumbs.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/page-breadcrumbs.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/directions/directions.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/directions/directions.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/for-partners.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/for-partners.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/partners/76b3eaa901c71dcdec3fbebb.svg":"../assets/169eb3f940f64835.svg","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/conditions/buyer.webp":"../assets/7536002d05027c7e.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/directions/directions-data.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/directions/directions-data.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/media-header.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/media-header.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/conditions/owner.webp":"../assets/7b86e1d0d8510cbe.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/conditions/repeat.webp":"../assets/c979d7e98780ede1.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/fonts/TildaSans-Regular.woff2":"../assets/2670dad44ca6c2a1.woff2","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/fonts/TildaSans-Medium.woff2":"../assets/f716269e361f4665.woff2","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/fonts/TildaSans-Light.woff2":"../assets/f0f2c165784c7234.woff2","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/expert-dialog.js":"./daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/expert-dialog.js","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/shared/assets/home-about-logo-round-red.png":"../assets/abb141124e76fe4c.png","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/subscribe-block-img.webp":"../assets/32aa70cd1ff3d81f.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/faq-typography.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/faq-typography.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/directions/moscow-purchase-20261105.webp":"../assets/024039f7b4e2f106.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/owner-shell.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/owner-shell.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/button-kit.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/button-kit.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/conditions-heading.css":"../css/daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/conditions-heading.css","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/advantages/business-meeting.webp":"../assets/4b0b572da70ce894.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/community/petrovka-club.webp":"../assets/c2697471f8634fca.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/community/investment-meeting.webp":"../assets/21df3c41d339a23f.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/partner-cta-residence.webp":"../assets/e98df516a6aaf488.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/subscribe-block-img-mob.webp":"../assets/3285d219f1845deb.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/directions/generated-country.webp":"../assets/c653980372e6d13a.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/directions/generated-rent-city.webp":"../assets/a796cbe8f7a288fb.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/directions/generated-rent-country.webp":"../assets/9e04efd641b55734.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/directions/generated-abroad.webp":"../assets/28a716ae1fcc6fdc.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/directions/generated-residency.webp":"../assets/1ccdac31cdc7e7e7.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/directions/generated-commercial.webp":"../assets/3167212c5885c681.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/favicon.ico":"../assets/2f312a5f919c41bb.ico","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/floating-expert-bg.webp":"../assets/9509f5dd4efa3674.webp","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/fonts/TildaSans-Semibold.woff2":"../assets/3814f8c444073262.woff2","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/fonts/TildaSans-Bold.woff2":"../assets/a2690df6fe834806.woff2","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/fonts/TildaSans-ExtraBold.woff2":"../assets/726a3a878465a590.woff2","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/assets/fonts/TildaSans-Black.woff2":"../assets/73abed6708c43912.woff2","https://daniilterekh-prog.github.io/shared/pictures/office-contact/whatsapp.svg":"../assets/3e197e0e1f3e679e.svg","https://daniilterekh-prog.github.io/shared/pictures/office-contact/max.svg":"../assets/5caa61a4b0731d0d.svg","https://daniilterekh-prog.github.io/shared/pictures/office-contact/telegram.svg":"../assets/4435c9a57e165a1c.svg","https://daniilterekh-prog.github.io/barn-estate-homepage-clone/for-partners/":"../html/index.html"};
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
