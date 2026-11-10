/* Relocate the preserved page runtime without mixing it into editable blocks. */
(() => {
 'use strict';
 if (window.__BarnHandoff) return;
 const NativeURL = window.URL;
 const script = document.currentScript;
 const source = /*__SOURCE__*/'';
 const references = /*__MAP__*/{};
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
  let canonical=value;
  try {const u=new NativeURL(value,location.href);u.search='';u.hash='';canonical=u.href;} catch {}
  return byNew[canonical] || byNew[value] || (value.startsWith(currentBase) ? source + value.slice(currentBase.length) : value);
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
 const retiredVideo=value=>{try{return /\/(?:assets\/hero(?:-mobile)?\.mp4|upload\/barnes\.mp4)$/.test(new NativeURL(String(value),source).pathname);}catch{return false}};
 const mediaSrc=Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype,'src');
 if(mediaSrc?.set)Object.defineProperty(HTMLMediaElement.prototype,'src',{...mediaSrc,set(value){if(this.tagName==='VIDEO'&&retiredVideo(value)){this.removeAttribute('src');return;}return mediaSrc.set.call(this,resource(value,source));}});
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
  if(name==='src'&&this.tagName==='VIDEO'&&retiredVideo(value)){this.removeAttribute('src');return;}
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
