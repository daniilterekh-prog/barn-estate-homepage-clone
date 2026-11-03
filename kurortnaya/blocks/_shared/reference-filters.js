/** Opt-in reference UI only; data/feed/submission remain host-owned. */
export async function bootReferenceFilters() {
  if(window.BarnesReferenceFiltersReady)return;
  window.BarnesReferenceFiltersReady=true;
  const base=new URL('../../js/',import.meta.url);
  async function script(file){await new Promise((resolve,reject)=>{const el=document.createElement('script');el.src=new URL(file,base);el.onload=resolve;el.onerror=()=>reject(new Error(`Cannot load ${file}`));document.body.append(el);});}
  await script('filters-template.js?v=20261103-controls-row-22');
  await script('filters-modal.js?v=20261103-controls-row-22');
  if(document.querySelector('.catalog-projects-map__fullscreen,[data-open-resort-map]')){
    await script('map-projects.js?v=20261103-controls-row-22');
    await script('map-fullscreen.js?v=20261103-controls-row-22');
  }
  await script('quick-filters.js?v=20261103-controls-row-22');
  await script('brand-filters.js?v=20261103-controls-row-22');
}
