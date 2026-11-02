/** Assemble only this node from its editable static sections. */
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
for(const view of ['desktop','mobile']){
  const shell=fs.readFileSync(path.join(root,'templates',view+'.html'),'utf8');
  let html=shell.replace(/<!-- BARNES:([a-z-]+) -->/g,(_,id)=>fs.readFileSync(path.join(root,'blocks',id,'page-'+view+'.html'),'utf8').trim());
  html=html.replace('<body>','<body class="city-home-kit">');
  html=html.replace('</head>','<link rel="stylesheet" href="css/catalog-filters.css?v=20261102-city-filters-1"></head>');
  html=html.replace('src="js/bootstrap.js"','src="js/bootstrap.js?v=20261102-city-filters-1"');
  if(view==='mobile')html=html.replace('<html','<html data-city-mobile="true"');
  html=html.replace('</head>','<link rel="stylesheet" href="css/portable.css"><link rel="stylesheet" href="css/request-quiz.css?v=20261102-city-filters-1"><link rel="stylesheet" href="css/quiz-buttons.css?v=20261102-city-filters-1"><link rel="stylesheet" href="css/home-kit.css?v=20261102-city-filters-1"></head>');
  const file=view==='desktop'?'index.html':'mobile.html';
  if(process.argv.includes('--check')){
    if(fs.readFileSync(path.join(root,file),'utf8')!==html)throw Error(file+' differs from source blocks');
  }else fs.writeFileSync(path.join(root,file),html);
  console.log('PASS '+file);
}
