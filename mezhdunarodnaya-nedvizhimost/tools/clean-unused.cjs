/* Conservative asset cleanup: literal runtime/build references, never old reports. */
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const files=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);
const live=[path.join(root,'index.html'),path.join(root,'mobile.html'),...['css','js','blocks','templates'].flatMap(d=>files(path.join(root,d)))].filter(f=>/\.(css|js|html)$/.test(f));
const text=live.map(f=>fs.readFileSync(f,'utf8')).join('\n');
const unused=files(path.join(root,'assets')).filter(file=>{
 const rel=path.relative(root,file).split(path.sep).join('/'),base=path.basename(file);
 if(base==='provenance.json')return false;
 if(base==='manifest.json')return true;
 return !text.includes(rel)&&!text.includes("'"+base+"'")&&!text.includes('"'+base+'"');
});
const obsolete=['NODE-DESIGN-PLAN.md','REFERENCE-SYNC-2026-10-12.md','latest/index.html','audit/design-audit.md','standalone/INTERNATIONAL-PAGE.md','standalone/international-runtime-fixes.js','standalone/international-source.css','standalone/international.css','standalone/international.js','verification/node-design.json','verification/reference-sync.json','verification/result.json'].map(f=>path.join(root,f)).filter(f=>fs.existsSync(f));
const candidates=[...unused,...obsolete].map(file=>({file:path.relative(root,file).split(path.sep).join('/'),bytes:fs.statSync(file).size}));
if(process.argv.includes('--apply')){
 for(const entry of candidates){const target=path.resolve(root,entry.file);if(!target.startsWith(root+path.sep))throw Error('Invalid cleanup target');fs.unlinkSync(target);}
 for(const name of ['latest','audit']){const dir=path.join(root,name);if(fs.existsSync(dir)&&!fs.readdirSync(dir).length)fs.rmdirSync(dir);}
 fs.writeFileSync(path.join(root,'verification/cleanup.json'),JSON.stringify({removed:candidates,bytesRemoved:candidates.reduce((sum,e)=>sum+e.bytes,0),recovery:'Git history before this packaging commit'},null,2)+'\n');
}
console.log(JSON.stringify({mode:process.argv.includes('--apply')?'applied':'dry-run',count:candidates.length,bytes:candidates.reduce((sum,e)=>sum+e.bytes,0),files:candidates.map(e=>e.file)},null,2));
