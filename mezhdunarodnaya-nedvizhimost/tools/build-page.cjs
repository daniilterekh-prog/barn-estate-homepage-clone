const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const mapFile=path.join(root,'js/node-map-browser.js');
const map=fs.readFileSync(mapFile,'utf8').replace(/filterTemplate\.innerHTML=[\s\S]*?;document\.body\.appendChild\(filterTemplate\);/, 'filterTemplate.innerHTML='+JSON.stringify(fs.readFileSync(path.join(root,'templates/map-filters.html'),'utf8'))+';document.body.appendChild(filterTemplate);');
if(process.argv.includes('--check')){if(map!==fs.readFileSync(mapFile,'utf8'))throw Error('Map filter template differs');}
else fs.writeFileSync(mapFile,map);
const quiz=fs.readFileSync(path.join(root,'blocks/international-quiz/template.html'),'utf8').trim();
const html=fs.readFileSync(path.join(root,'templates/page.html'),'utf8').replace(/<!-- BARNES:([\w-]+) -->/g,(_,id)=>fs.readFileSync(path.join(root,'blocks',id,'page.html'),'utf8').trim())
 .replace(/js\/node-components\.js\?v=[^"]+/, 'js/node-components.js?v=20261101-quiz-1')
 .replace(/js\/node-map-browser\.js\?v=[^"]+/, 'js/node-map-browser.js?v=20261101-quiz-1')
 .replace('</head>','<link rel="stylesheet" href="css/international-quiz.css?v=20261101-1"></head>')
 .replace('</body>','<template id="international-quiz-template">'+quiz+'</template><script src="js/international-quiz.js?v=20261101-1" defer></script></body>');
for(const name of ['index.html','mobile.html']){
 const file=path.join(root,name);
 if(process.argv.includes('--check')){if(fs.readFileSync(file,'utf8')!==html)throw Error(name+' differs from its source');}
 else fs.writeFileSync(file,html);
 console.log('PASS '+name);
}
