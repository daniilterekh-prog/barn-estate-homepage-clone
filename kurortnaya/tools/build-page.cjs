/** Assemble the page from editable block HTML. No third-party dependency. */
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
for(const view of ['desktop','mobile']){
 const shell = fs.readFileSync(path.join(root,'templates',view+'.html'),'utf8');
 const html = shell.replace(/<!-- BARNES:([a-z-]+) -->/g,(_,id)=>fs.readFileSync(path.join(root,'blocks',id,'page-'+view+'.html'),'utf8').trim());
 const file = view==='desktop'?'index.html':'mobile.html';
 if(process.argv.includes('--check')){
  if(fs.readFileSync(path.join(root,file),'utf8')!==html)throw Error(file+' differs from its blocks. Run node tools/build-page.cjs');
 }else fs.writeFileSync(path.join(root,file),html);
 console.log('PASS '+file);
}
