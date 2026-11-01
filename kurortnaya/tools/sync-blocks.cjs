/** Mechanical re-export from capture-first-degree.cjs; media stay in node assets/. */
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..'),site=path.dirname(root),captures=process.argv[2]||path.join(site,'.playwright-mcp');
const commit=process.argv[3]||cp.execFileSync('git',['rev-parse','HEAD'],{cwd:site,encoding:'utf8'}).trim();
const origin='https://daniilterekh-prog.github.io/barn-estate-homepage-clone/';
const meta=JSON.parse(fs.readFileSync(path.join(root,'blocks/manifest.json')));
for(const view of ['desktop','mobile']){
 const rows=JSON.parse(fs.readFileSync(path.join(captures,'first-degree-'+view+'.json'))).concat(JSON.parse(fs.readFileSync(path.join(captures,'first-degree-cards-'+view+'.json'))));
 for(const row of rows){const folder=path.join(root,'blocks',row.id);let html=row.html;
  html=html.replace(/https:\/\/daniilterekh-prog\.github\.io\/barn-estate-homepage-clone\/[^\s"<>]+/g,url=>{
   const file=path.join(site,decodeURIComponent(url.slice(origin.length).split('?')[0]));
   if(!fs.existsSync(file)||!fs.statSync(file).isFile())return url;
   return path.relative(folder,file).split(path.sep).join('/');
  });
  html=html.replace(/\s(?:on\w+|data-start-sales-bound)="[^"]*"/g,'');
  html=html.replace(/(<(?:li|ul)[^>]*class="[^"]*splide__[^"]*"[^>]*?)\sstyle="[^"]*"/g,'$1');
  if(row.id==='card-start-sales')html='<section class="catalog-best-offers node-card-preview">'+html+'</section>';
  else if(row.id.startsWith('card-'))html='<section class="node-card-preview">'+html+'</section>';
  fs.writeFileSync(path.join(folder,view==='desktop'?'fragment.html':'mobile.html'),html+'\n');
 }
}
for(const block of meta.blocks){block.version='1.1.0';block.source.commit=commit;block.referenceKit={version:'home-1.0.0',date:'2026-11-01',exceptions:['hero H1','FAQ']};fs.writeFileSync(path.join(root,'blocks',block.id.replace('first-degree-',''),'block.json'),JSON.stringify(block,null,2)+'\n');}
meta.version='1.1.0';meta.sourceCommit=commit;fs.writeFileSync(path.join(root,'blocks/manifest.json'),JSON.stringify(meta,null,2)+'\n');
console.log('Synced '+meta.blocks.length+' blocks; all page-* source files preserved');
