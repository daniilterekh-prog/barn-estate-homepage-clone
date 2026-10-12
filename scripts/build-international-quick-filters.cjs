/* Local copies of approved resort controls, with international options and state. */
const fs=require('node:fs/promises');
(async()=>{
 const target='mezhdunarodnaya-nedvizhimost';
 let js=await fs.readFile('kurortnaya/quick-filters.js','utf8');
 js=js.replace('quick-filters.css?v=2','node-quick-filters.css?v=20261012-quick-1');
 const start=js.indexOf('  var configs = ['),end=js.indexOf('  var popup =',start);
 js=js.slice(0,start)+`  var template=document.querySelector('#source-filters').content;
  function choices(title){
    var group=Array.from(template.querySelectorAll('.hero-filter-panel-content__group')).find(function(g){return g.querySelector('.hero-filter-panel-content__title')?.textContent.trim()===title;});
    var labels=Array.from(group.querySelectorAll('.ui-checkbox'));
    return {choices:labels.map(function(l){return l.textContent.trim();}),values:labels.map(function(l){return l.querySelector('input').value;})};
  }
  var countries=choices('Страны'),types=choices('Тип недвижимости'),prices=choices('Диапазоны');
  var configs=[
    Object.assign({title:'Локация',key:'directions',reset:'Все страны'},countries),
    Object.assign({title:'Тип недвижимости',key:'propertyTypes',reset:'Любой тип'},types),
    Object.assign({title:'Стоимость',key:'priceRanges',reset:'Любая'},prices),
    {title:'Спальни',key:'bedrooms',reset:'Любые',choices:['1','2','3','Более 3'],values:['1','2','3','4+']}
  ];
`+js.slice(end);
 await fs.writeFile(target+'/node-quick-filters.js',js);
 await fs.writeFile(target+'/node-quick-filters.css',await fs.readFile('kurortnaya/quick-filters.css','utf8'));
 await fs.writeFile(target+'/node-listing.css',await fs.readFile('kurortnaya/listing-mode.css','utf8'));
 for(const file of ['index.html','standalone/index.html']){
  const prefix=file.startsWith('standalone/')?'../':'';
  let html=await fs.readFile(target+'/'+file,'utf8');
  html=html.replace(/<script[^>]+src="[^"]*node-quick-filters\.js[^"]*"[^>]*><\/script>/g,'');
  html=html.replace(/(<script src="[^"]*source-runtime\.js[^>]+><\/script>)/,'$1<script src="'+prefix+'node-quick-filters.js?v=20261012-quick-1" defer></script>');
  await fs.writeFile(target+'/'+file,html);
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
