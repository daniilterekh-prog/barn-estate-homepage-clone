// Offline adapter for the captured Nuxt application. No contact data is sent.
(() => {
 const root = new URL('./', document.currentScript.src);
 const fetchOriginal = window.fetch.bind(window);
 window.fetch = (input, options = {}) => {
  const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url, location.href);
  const method = String(options.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();
  if (url.pathname === '/api/app/favorites/init') return Promise.resolve(new Response(JSON.stringify({uuid:'00000000-0000-4000-8000-000000000000'}),{headers:{'Content-Type':'application/json'}}));
  if (method !== 'GET' && method !== 'HEAD') return Promise.reject(new Error('Локальная копия: отправка данных отключена.'));
  if (url.pathname === '/api/app/settings/view') return fetchOriginal(new URL('data/settings.json', root));
  if (url.pathname === '/api/app/content/media/view') return fetchOriginal(new URL('data/media.json', root));
  if (url.pathname.includes('/_nuxt/builds/')) return Promise.resolve(new Response(JSON.stringify({id:'local-media',timestamp:0,matcher:{static:{},wildcard:{},dynamic:{}}}),{headers:{'Content-Type':'application/json'}}));
  if (url.pathname === '/api/app/content/media/fresh/view') return fetchOriginal(new URL('data/media.json', root)).then(r=>r.json()).then(data=>{
   const section=url.searchParams.get('section')||'all';
   const page=Number(url.searchParams.get('page')||1);
   const list=page===1?data.freshMaterials.list.filter(item=>section==='all'||item.section===section):[];
   return new Response(JSON.stringify({list,pagination:{page,count:list.length,countPages:1,countElements:list.length},code:200}),{headers:{'Content-Type':'application/json'}});
  });
  if (url.pathname.startsWith('/api/')) return Promise.reject(new Error('Этот серверный маршрут не входит в копию страницы.'));
  return fetchOriginal(input, options);
 };
 document.addEventListener('click', event => {
  const anchor = event.target.closest('a[href]');
  if (!anchor || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const url = new URL(anchor.href, location.href);
  if (url.origin === location.origin && url.pathname !== '/barn-estate-homepage-clone/media/' && !url.pathname.startsWith('/barn-estate-homepage-clone/media/pictures/') && !url.pathname.startsWith('/barn-estate-homepage-clone/media/assets/')) {
   event.preventDefault(); event.stopImmediatePropagation();
   location.href = 'https://front.barnes.vsavr.ru' + (url.pathname.startsWith('/barn-estate-homepage-clone/') ? url.pathname.slice(27) : url.pathname) + url.search + url.hash;
  }
 }, true);
 document.addEventListener('submit', event => {
  event.preventDefault(); event.stopImmediatePropagation();
  alert('Это локальная копия. Отправка формы не подключена.');
 }, true);
})();
