/* One-time, audited mechanical migration. The finished node builds independently. */
const fs=require('node:fs/promises'),path=require('node:path'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const {chromium}=require('/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
(async()=>{
 const root=path.resolve('mezhdunarodnaya-nedvizhimost');
 const before=execFileSync('git',['ls-files','mezhdunarodnaya-nedvizhimost'],{encoding:'utf8'}).trim().split('\n');
 if(!(await fs.stat(path.join(root,'source.css')).catch(()=>null)))throw Error('Already migrated; use tools/build-page.cjs');
 for(const dir of ['css','js','templates','tools','blocks','assets/imported','assets/fonts','verification'])await fs.mkdir(path.join(root,dir),{recursive:true});
 const copies=['header-whatsapp.svg','header-max.svg','header-telegram.svg','footer-logo.svg','favicon.ico','denis-perkovsky-cutout.png','denis-perkovsky-interior-hq.webp','barnes-moscow-residence-v4.webp','cta-consultation-interior.webp','cta-contact-resort-lounge.webp'];
 for(const name of copies)await fs.copyFile('kurortnaya/assets/'+name,path.join(root,'assets',name));
 for(const name of await fs.readdir('assets/fonts'))await fs.copyFile('assets/fonts/'+name,path.join(root,'assets/fonts',name));
 const names=await fs.readdir(path.join(root,'assets')),mapping={},provenance=[];
 const decode=s=>s.replaceAll('&amp;','&');
 async function resource(value){
  value=decode(value);if(mapping[value])return mapping[value];
  if(!/^https?:/.test(value))return value;
  const url=new URL(value),base=decodeURIComponent(url.pathname.split('/').pop());
  const cached=names.find(n=>n.endsWith('-'+base));
  if(cached)return mapping[value]='assets/'+cached;
  const name=crypto.createHash('sha256').update(value).digest('hex').slice(0,16)+(base==='tiles'?'.png':'-'+base);
  const file='assets/imported/'+name;
  let bytes;
  try{bytes=execFileSync('curl',['--fail','--silent','--location','--max-time','45',value],{maxBuffer:24*1024*1024});}
  catch{throw Error('Could not capture image '+base+' from '+url.hostname);}
  if(!bytes.length)throw Error('Empty image '+base);
  await fs.writeFile(path.join(root,file),bytes);
  const source=base==='tiles'?'https://yandex.ru/maps/ (static tile snapshot)':value;
  provenance.push({source,file,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')});
  return mapping[value]=file;
 }
 let html=await fs.readFile(path.join(root,'index.html'),'utf8');
 for(const m of html.matchAll(/<img[^>]*\bsrc="(https?:[^"<>]+)"/g))await resource(m[1]);
 for(const m of html.matchAll(/<link[^>]*href="(https?:[^"<>]+)"[^>]*>/g))if(/icon/.test(m[0]))await resource(m[1]);
 const cssFiles=(await fs.readdir(root)).filter(n=>n.endsWith('.css'));
 for(const name of cssFiles){
  let css=await fs.readFile(path.join(root,name),'utf8');
  for(const m of css.matchAll(/url\(["']?(https?:[^"')]+)["']?\)/g))await resource(m[1]);
  css=css.replace(/url\((["']?)(https?:[^"')]+)\1\)/g,(_,q,u)=>'url("../'+mapping[u]+'")');
  css=css.replaceAll('../kurortnaya/assets/','../assets/');
  await fs.writeFile(path.join(root,'css',name),css);
  await fs.unlink(path.join(root,name));
 }
 const stateText=await fs.readFile(path.join(root,'source-map-states.js'),'utf8');
 const states=JSON.parse(stateText.slice(stateText.indexOf('=')+1).trim().replace(/;$/,''));
 for(const state of states)for(const tile of state.tiles)tile.src=await resource(tile.src);
 await fs.writeFile(path.join(root,'js/source-map-states.js'),'window.BARNES_INTERNATIONAL_MAP_STATES='+JSON.stringify(states)+';\n');
 await fs.unlink(path.join(root,'source-map-states.js'));
 for(const name of (await fs.readdir(root)).filter(n=>n.endsWith('.js'))){
  let js=await fs.readFile(path.join(root,name),'utf8');
  js=js.replaceAll('../kurortnaya/assets/','assets/');
  js=js.replace('new URL("assets/",document.currentScript.src)','new URL("../assets/",document.currentScript.src)');
  js=js.replace('img.getAttribute("src").split("/").pop()', 'img.getAttribute("src").slice("assets/".length)');
  js=js.replace("new URL('assets/',new URL('node-catalog.js',document.currentScript.src))","new URL('../assets/',document.currentScript.src)");
  js=js.replace(/new URL\('((?:node-[\w-]+)\.css[^']*)',/g,"new URL('../css/$1',");
  js=js.replace("new URL('assets/map-browser-preview.png', assetsBase)","new URL('../assets/map-browser-preview.png', assetsBase)");
  await fs.writeFile(path.join(root,'js',name),js);await fs.unlink(path.join(root,name));
 }
 await fs.copyFile('shared/owner-header.css',path.join(root,'css/owner-header.css'));
 const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const page=await browser.newPage();
 html=await page.evaluate(({html,mapping})=>{
  const d=new DOMParser().parseFromString(html,'text/html');
  const visit=root=>{
   root.querySelectorAll('img,source').forEach(e=>{for(const attr of ['src','srcset']){const value=e.getAttribute(attr);if(mapping[value])e.setAttribute(attr,mapping[value]);}});
   root.querySelectorAll('img').forEach(e=>{const value=e.getAttribute('src')||'';if(value.includes('../kurortnaya/assets/'))e.setAttribute('src',value.replace('../kurortnaya/assets/','assets/'));if(value.includes('../prodazha_sobstvennikam/assets/logo.svg'))e.setAttribute('src','assets/footer-logo.svg');});
   root.querySelectorAll('template').forEach(t=>visit(t.content));
  };visit(d);
  d.querySelectorAll('link[href]').forEach(e=>{let href=e.getAttribute('href');if(mapping[href])e.setAttribute('href',mapping[href]);else if(href.startsWith('../shared/owner-header.css'))e.setAttribute('href','css/owner-header.css');else if(!href.includes('/')&&/\.css/.test(href))e.setAttribute('href','css/'+href);});
  d.querySelectorAll('script[src]').forEach(e=>{const src=e.getAttribute('src');if(!src.includes('/'))e.setAttribute('src','js/'+src);});
  return '<!DOCTYPE html>\n'+d.documentElement.outerHTML;
 },{html,mapping});
 const sections=[['header','.site-header'],['hero','.catalog-hero'],['start-sales','.catalog-best-offers'],['map','.catalog-map'],['listing','.catalog-grid'],['brand-intro','.catalog-intro'],['cta-central','.catalog-consultation'],['directions','.departments-section'],['news','.news-section'],['faq','.catalog-faq'],['cta-bottom','.catalog-contact'],['footer','.site-footer'],['floating-expert','.floating-expert']];
 const blocks=await page.evaluate(({html,sections})=>{const d=new DOMParser().parseFromString(html,'text/html');return sections.map(([id,selector])=>({id,selector,html:d.querySelector(selector)?.outerHTML}));},{html,sections});
 for(const block of blocks){if(!block.html)throw Error('Missing section '+block.id);await fs.mkdir(path.join(root,'blocks',block.id),{recursive:true});await fs.writeFile(path.join(root,'blocks',block.id,'page.html'),block.html+'\n');html=html.replace(block.html,'<!-- BARNES:'+block.id+' -->');}
 await browser.close();
 await fs.writeFile(path.join(root,'templates/page.html'),html);
 await fs.rename(path.join(root,'map-filters-template.html'),path.join(root,'templates/map-filters.html'));
 await fs.writeFile(path.join(root,'assets/imported/provenance.json'),JSON.stringify(provenance,null,2)+'\n');
 await fs.writeFile(path.join(root,'verification/migration.json'),JSON.stringify({before,blocks:sections,copied:copies,renderResources:provenance.map(p=>p.file)},null,2)+'\n');
 console.log('Localized',provenance.length,'remote resources; exported',blocks.length,'editable sections');
})().catch(e=>{console.error(e.message);process.exitCode=1;});
