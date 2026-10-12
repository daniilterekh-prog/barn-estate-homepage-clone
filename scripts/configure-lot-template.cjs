/* Mechanical migration: keep the verified DOM while extracting the example's data. */
const fs=require('node:fs/promises'),path=require('node:path');
const toolkit=process.env.CODEX_TOOLKIT_ROOT||path.join(require('node:os').homedir(),'.local/share/codex-toolkit');
const {JSDOM}=require(path.join(toolkit,'node_modules/jsdom'));
const root=path.resolve(__dirname,'../stranitsa-lota');
(async()=>{
 const d=new JSDOM(await fs.readFile(path.join(root,'index.html'),'utf8')).window.document;
 const q=s=>d.querySelector(s),qa=s=>[...d.querySelectorAll(s)],txt=s=>q(s)?.textContent.trim(),img=e=>({src:e.getAttribute('src'),alt:e.getAttribute('alt')||''});
 const dataSource=await fs.readFile(path.join(root,'source-data.js'),'utf8');
 const data=JSON.parse(dataSource.slice(dataSource.indexOf('=')+1).trim().replace(/;$/,''));
 const gallery=q('#source-gallery').content,construction=q('#source-construction').content;
 const id=txt('.lot-hero__title').match(/ID(\d+)/)?.[1];
 const example={id,source:'https://front.barnes.vsavr.ru/vtorichnaya-nedvizhimost/'+id+'/',title:txt('.lot-hero__title'),description:txt('.lot-hero__intro'),priceRub:Number(txt('.lot-hero__price').replace(/\D/g,''))||null,displayPrice:txt('.lot-hero__price'),cover:img(q('.lot-hero__image')),
  seo:{description:q('meta[name="description"]')?.content,ogTitle:q('meta[property="og:title"]')?.content,ogDescription:q('meta[property="og:description"]')?.content,structuredData:JSON.parse(q('script[type="application/ld+json"]').textContent)},
  broker:{name:txt('.lot-hero__broker-name'),role:txt('.lot-hero__broker-role'),phone:txt('.lot-hero__broker-phone'),url:q('.lot-hero__broker-name').getAttribute('href'),photo:img(q('.lot-hero__broker-photo'))},
  highlights:qa('.lot-hero__highlight').map(e=>e.textContent.trim()),badges:qa('.lot-hero__chip').map(e=>e.textContent.trim()),
  gallery:[...gallery.querySelectorAll('.lot-gallery-modal__image')].map(img),galleryBadges:[...gallery.querySelectorAll('.lot-gallery-modal__chip')].map(e=>e.textContent),
  complex:{cards:qa('.lot-about-complex__item').map(e=>({label:e.querySelector('.lot-about-complex__label').textContent,image:img(e.querySelector('img')),span:[...e.classList].some(c=>c.endsWith('--third'))?'third':'half'}))},
  developer:{name:txt('.lot-developer__name'),description:txt('.lot-developer__text'),logo:img(q('.lot-developer__logo')),url:q('.lot-developer__cta').getAttribute('href')},
  construction:{cards:qa('.construction__item').map(e=>({period:e.querySelector('.construction__year').textContent,image:img(e.querySelector('img')),span:[...e.classList].some(c=>c.endsWith('--third'))?'third':'half'})),photos:[...construction.querySelectorAll('.construction-gallery-modal__image')].map(img)},
  mortgage:{fields:qa('.mortgage__field').map(e=>{const h=e.querySelector('[role="slider"]');return {min:+h.getAttribute('aria-valuemin'),max:+h.getAttribute('aria-valuemax'),value:+h.getAttribute('aria-valuenow'),displayValue:e.querySelector('.mortgage__field-value').textContent}}),offers:qa('.mortgage__table tbody tr').map(e=>[...e.querySelectorAll('td')].slice(0,4).map(e=>e.textContent))},
  map:{views:data.maps,categories:data.categories,galleryMarkup:q('#source-gallery-map').content.querySelector('.lot-gallery-modal__map')?.innerHTML}};
 await fs.writeFile(path.join(root,'lot-data.js'),'/* Reference fixture. A data provider may set BARNES_LOT_DATA before this script. */\nwindow.BARNES_LOT_DATA = window.BARNES_LOT_DATA || '+JSON.stringify(example,null,2)+';\n');
 await fs.writeFile(path.join(root,'source-data.js'),'/* Shared review and menu state; the map belongs to the selected lot. */\nwindow.BARNES_PROPERTY_DATA = '+JSON.stringify({reviews:data.reviews,menuIcon:data.menuIcon})+';\nwindow.BARNES_PROPERTY_DATA.maps = window.BARNES_LOT_DATA.map?.views || [];\nwindow.BARNES_PROPERTY_DATA.categories = window.BARNES_LOT_DATA.map?.categories || [];\n');
 const before=q('script[src="source-data.js"]');for(const src of ['lot-data.js','lot-template.js']){const s=d.createElement('script');s.src=src;s.defer=true;before.before(s)}
 await fs.writeFile(path.join(root,'index.html'),'<!DOCTYPE html>\n'+d.documentElement.outerHTML+'\n');
 for(const name of ['capture-lot-reference.cjs','build-lot-template.cjs','verify-lot-template.cjs','check-lot-template-interactions.cjs']){const p=path.join(__dirname,name);let text=await fs.readFile(p,'utf8');text=text.replaceAll('../vtorichnaya-nedvizhimost/588036','../stranitsa-lota');if(name==='build-lot-template.cjs')text=text.replace("  console.log('Imported '+manifest.length+' assets');","  require('node:child_process').execFileSync(process.execPath,[path.join(__dirname,'configure-lot-template.cjs')],{stdio:'inherit'});\n  console.log('Imported '+manifest.length+' assets into the common lot template');");await fs.writeFile(p,text)}
 console.log('Extracted reference data; configured common lot page.');
})().catch(e=>{console.error(e);process.exit(1)});
