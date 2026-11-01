/* Export only this autonomous node; imported legacy Nuxt/inline files never ship. */
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),target=process.argv[2];
if(!target||!path.isAbsolute(target)||path.resolve(target)===root)throw Error('Supply a distinct absolute city package destination');
const output=path.resolve(target),files=[];
for(const f of['index.html','mobile.html','README.md','UI-KIT.md','STRUCTURE.md'])files.push(f);
function walk(dir){for(const e of fs.readdirSync(path.join(root,dir),{withFileTypes:true})){const file=dir+'/'+e.name;if(e.isDirectory())walk(file);else files.push(file)}}
for(const dir of['css','js','blocks','templates','tools','verification'])walk(dir);
const manifest=JSON.parse(fs.readFileSync(path.join(root,'assets/manifest.json')));
for(const file of new Set([...manifest.map(a=>a.file),'assets/manifest.json','assets/city-map-preview.png','assets/cta-ruslan-unified-v1.webp','assets/cta-ruslan-unified-v1.md']))files.push(file);
for(const file of files){
 const from=path.resolve(root,file),to=path.resolve(output,file);
 if(!from.startsWith(root+path.sep)||!to.startsWith(output+path.sep))throw Error('Unsafe path '+file);
 if(!fs.existsSync(from))throw Error('Missing package resource '+file);
 fs.mkdirSync(path.dirname(to),{recursive:true});fs.copyFileSync(from,to);
}
console.log('Exported '+files.length+' city files to '+output);
