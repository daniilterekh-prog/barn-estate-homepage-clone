/** Assemble only this node from its editable static sections. */
const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
for(const view of ['desktop','mobile']){
  const shell=fs.readFileSync(path.join(root,'templates',view+'.html'),'utf8');
  let html=shell.replace(/<!-- BARNES:([a-z-]+) -->/g,(_,id)=>fs.readFileSync(path.join(root,'blocks',id,'page-'+view+'.html'),'utf8').trim());
  if(view==='mobile')html=html.replace('<html','<html data-city-mobile="true"');
  html=html.replace('</head>','<link rel="stylesheet" href="css/portable.css"></head>');
  const file=view==='desktop'?'index.html':'mobile.html';
  if(process.argv.includes('--check')){
    if(fs.readFileSync(path.join(root,file),'utf8')!==html)throw Error(file+' differs from source blocks');
  }else fs.writeFileSync(path.join(root,file),html);
  console.log('PASS '+file);
}
