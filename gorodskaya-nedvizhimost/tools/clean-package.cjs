/** Dry-run by default. Delete only explicit obsolete files of this packaged node. */
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
if(!fs.existsSync(path.join(root,'templates/desktop.html'))||!fs.existsSync(path.join(root,'mobile.html')))throw Error('Build the package first');
const all=[];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,e.name);if(e.isDirectory())walk(file);else all.push(path.relative(root,file).replaceAll(path.sep,'/'))}}
walk(root);
const obsolete=all.filter(file=>file.startsWith('_nuxt/')||file.startsWith('standalone/')||file.startsWith('assets/source-assets/')||(/^[^/]+\.(js|css)$/.test(file)));
const keepText=all.filter(f=>!obsolete.includes(f)&&/\.(?:html|css|js|cjs)$/.test(f)).map(f=>fs.readFileSync(path.join(root,f),'utf8')).join('\n');
for(const file of all.filter(f=>/^assets\//.test(f)&&!obsolete.includes(f)&&/\.(?:png|jpe?g|webp|svg|ico|woff2?)$/.test(f))){
  if(!keepText.includes(file)&&!keepText.includes(path.basename(file)))obsolete.push(file);
}
const report={scope:'gorodskaya-nedvizhimost only',reason:'Unused Nuxt/vendor, old flat adapters now in css/js, duplicate source assets and obsolete standalone snapshot',files:obsolete.map(file=>({file,bytes:fs.statSync(path.join(root,file)).size})),recovery:'Previous committed versions remain in Git history'};
report.removedBytes=report.files.reduce((s,f)=>s+f.bytes,0);
fs.mkdirSync(path.join(root,'verification'),{recursive:true});
if(obsolete.length||!fs.existsSync(path.join(root,'verification/cleanup.json')))fs.writeFileSync(path.join(root,'verification/cleanup.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({files:report.files.length,bytes:report.removedBytes,examples:obsolete.slice(0,12)},null,2));
if(process.argv.includes('--apply')){
 for(const file of obsolete){
  const target=path.resolve(root,file);
  if(!target.startsWith(root+path.sep))throw Error('Unsafe target '+file);
  fs.unlinkSync(target);
 }
 for(const dir of ['_nuxt','standalone','assets/source-assets']){
  const target=path.join(root,dir);
  function empty(directory){
   if(!fs.existsSync(directory))return;
   for(const entry of fs.readdirSync(directory,{withFileTypes:true}))if(entry.isDirectory())empty(path.join(directory,entry.name));
   if(fs.readdirSync(directory).length===0)fs.rmdirSync(directory);
  }
  empty(target);
 }
 console.log('Removed explicit files; recover through Git history.');
}
