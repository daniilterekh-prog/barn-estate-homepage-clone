/* Catalogue groups are rendered from data.json at build time. */
(()=>{
 const section=document.querySelector('.node-catalog-links');
 if(!section||section.dataset.nodeCatalogLinksReady)return;
 for(const more of section.querySelectorAll('.node-catalog-links__more')){
  const list=document.getElementById(more.getAttribute('aria-controls'));
  more.addEventListener('click',()=>{
   const expanded=more.getAttribute('aria-expanded')!=='true';
   more.setAttribute('aria-expanded',String(expanded));
   more.querySelector('span').textContent=expanded?'Скрыть':'Показать все';
   [...list.children].forEach((li,i)=>li.hidden=i>=3&&!expanded);
  });
 }
 section.dataset.nodeCatalogLinksReady='true';
})();
