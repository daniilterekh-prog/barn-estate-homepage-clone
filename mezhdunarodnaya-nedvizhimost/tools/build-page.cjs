const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const mapFile=path.join(root,'js/node-map-browser.js');
const map=fs.readFileSync(mapFile,'utf8').replace(/filterTemplate\.innerHTML=[\s\S]*?;document\.body\.appendChild\(filterTemplate\);/, 'filterTemplate.innerHTML='+JSON.stringify(fs.readFileSync(path.join(root,'templates/map-filters.html'),'utf8'))+';document.body.appendChild(filterTemplate);');
if(process.argv.includes('--check')){if(map!==fs.readFileSync(mapFile,'utf8'))throw Error('Map filter template differs');}
else fs.writeFileSync(mapFile,map);
const html=fs.readFileSync(path.join(root,'templates/page.html'),'utf8').replace(/<!-- BARNES:([\w-]+) -->/g,(_,id)=>fs.readFileSync(path.join(root,'blocks',id,'page.html'),'utf8').trim());
for(const name of ['index.html','mobile.html']){
 const file=path.join(root,name);
 if(process.argv.includes('--check')){if(fs.readFileSync(file,'utf8')!==html)throw Error(name+' differs from its source');}
 else fs.writeFileSync(file,html);
 console.log('PASS '+name);
}
