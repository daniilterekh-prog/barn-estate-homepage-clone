/* Reuse only approved node-page components, without resort listing data. */
const fs=require('node:fs/promises');
(async()=>{
  const target='mezhdunarodnaya-nedvizhimost';
  const source=await fs.readFile('kurortnaya/ui-kit-runtime.js','utf8');
  const between=(start,end)=>source.slice(source.indexOf(start),source.indexOf(end));
  const header=between('  function enhanceSiteHeader()','  enhanceSiteHeader();');
  const sticky=between('  function enhanceCatalogStickyHeader()','  enhanceCatalogStickyHeader();');
  const modal=between('  function enhanceContactModal()','  enhanceContactMethods();');
  let code='/* Approved Kurortnaya components adapted to the international route. */\n(function(){\nvar openContactModal=null;\ndocument.body.classList.add("barnes-header-template","international-node-design");\n'+header+'\nenhanceSiteHeader();\n'+sticky+'\nenhanceCatalogStickyHeader();\n'+modal+'\nenhanceContactModal();\nwindow.BARNES_OPEN_CONTACT=openContactModal;\n})();\n';
  code=code.replaceAll("'assets/header-","'../kurortnaya/assets/header-").replaceAll('src="assets/header-','src="../kurortnaya/assets/header-').replaceAll('src="assets/denis-','src="../kurortnaya/assets/denis-').replaceAll('курортной недвижимости','международной недвижимости').replaceAll('kurortnaya-sticky-contacts','international-sticky-contacts').replace("status.textContent = 'Спасибо! Мы свяжемся с вами в ближайшее время.';","status.textContent = 'Для отправки заявки свяжитесь с BARNES: +7 (495) 182-50-79.';");
  code=code.replace('      form.reset();','');
  code=code.replace('    var frameRequested = false;',"    document.addEventListener('keydown',function(event){if(event.key==='Escape'){panel.hidden=true;toggle.setAttribute('aria-expanded','false');}});\n    var frameRequested = false;");
  code=code.replace('enhanceSiteHeader();','enhanceSiteHeader();\ndocument.querySelector(".site-header__messengers")?.remove();');
  code=code.replace('window.BARNES_OPEN_CONTACT=openContactModal;','window.BARNES_OPEN_CONTACT=openContactModal;\nvar assetBase=new URL("../kurortnaya/assets/",document.currentScript.src);\ndocument.querySelectorAll("img[src^=\\\"../kurortnaya/assets/\\\"]").forEach(function(img){img.src=new URL(img.getAttribute("src").split("/").pop(),assetBase).href;});');
  code=code.replace("    var sourceLogo = header.querySelector", "    sticky.addEventListener('click', function(event) { var link=event.target.closest('.catalog-sticky__link'); if(!link)return; event.preventDefault(); var section=document.querySelector(link.getAttribute('href')); if(section) window.scrollTo({top:section.getBoundingClientRect().top+window.scrollY-sticky.offsetHeight-12,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}); });\n    var sourceLogo = header.querySelector");
  code=code.replace('    document.addEventListener(\'keydown\', function (event) {','    document.addEventListener(\'keydown\', function (event) {');
  await fs.writeFile(target+'/node-components.js',code);
  for(const [sourceName,targetName]of [['ui-kit.css','node-ui.css'],['start-sales-cards.css','node-start-sales.css'],['listing-mode.css','node-listing.css'],['start-sales-cards.js','node-start-sales.js']]){
    let text=await fs.readFile('kurortnaya/'+sourceName,'utf8');
    text=text.replaceAll('url("assets/','url("../kurortnaya/assets/');
    await fs.writeFile(target+'/'+targetName,text);
  }
  // Existing snapshots stay isolated; insert only this page's components.
  for(const file of ['index.html','standalone/index.html']){
    const prefix=file.startsWith('standalone/')?'../':'';
    let html=await fs.readFile(target+'/'+file,'utf8');
    html=html.replace(/src="[^"]+"(?= alt="Зарубежная недвижимость для жизни и инвестиций" class="catalog-intro__image")/, 'src="'+prefix+'../kurortnaya/assets/barnes-moscow-residence-v4.webp"');
    html=html.replaceAll(' Показать объекты </button>', ' Найти </button>');
    html=html.replace(/<link[^>]+href="[^"?]*node-[^"]*"[^>]*>/g,'').replace(/<script[^>]+src="[^"?]*node-[^"?]*\.js[^"]*"[^>]*><\/script>/g,'').replace(/<link[^>]+href="[^"]*shared\/owner-header\.css[^"]*"[^>]*>/g,'');
    html=html.replace('</head>',['node-ui.css','node-listing.css','node-start-sales.css','node-page.css'].map(file=>'<link rel="stylesheet" href="'+prefix+file+(file==='node-page.css'?'?v=20261012-sort-2':'?v=20261012-node-1')+'">').join('')+'<link rel="stylesheet" href="'+prefix+'../shared/owner-header.css?v=20261012-owner-header-5"></head>');
    const sourceRuntime=html.match(/<script src="[^"]*source-runtime\.js[^"]*" defer=""><\/script>/)?.[0];
    if(!sourceRuntime)throw new Error('Missing source runtime: '+file);
    html=html.replace(sourceRuntime,'<script src="'+prefix+'node-components.js?v=20261012-node-1" defer></script><script src="'+prefix+'node-catalog.js?v=20261012-node-1" defer></script>'+sourceRuntime.replace(/\?v=[^"]+/,'?v=20261012-node-1')+'<script src="'+prefix+'node-start-sales.js?v=20261012-node-1" defer></script>');
    await fs.writeFile(target+'/'+file,html);
  }
})().catch(e=>{console.error(e);process.exitCode=1;});
