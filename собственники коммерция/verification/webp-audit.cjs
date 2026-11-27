/* Audit current commercial-owner page and developer export without changing images. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/home/daniil/.local/share/codex-toolkit/node_modules/playwright');
const sharp=require(process.env.SHARP_MODULE||'/home/daniil/.local/share/codex-toolkit/node_modules/sharp');
const root=path.resolve(__dirname,'../..'),pageRoot=path.dirname(__dirname),packageRoot=path.join(root,'handoff/owner-commercial');
const canonicalRoot=process.env.BARN_SOURCE_REPO||'/tmp/barnes-owners-commercial-source';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(d=>d.isDirectory()?walk(path.join(p,d.name)):[path.join(p,d.name)]);
const raster=/\.(webp|png|jpe?g|gif|avif|bmp|tiff?|ico)$/i;
async function staticFiles(folder,canonical){
 const files=walk(folder).filter(f=>!path.relative(folder,f).split(path.sep).includes('verification')&&raster.test(f));const images=[];
 for(const file of files){const bytes=fs.readFileSync(file),meta=await sharp(bytes).metadata();assert.equal(meta.format,'webp',file);assert.equal(path.extname(file).toLowerCase(),'.webp',file);await sharp(bytes).stats();
  const relative=path.relative(folder,file),paired=path.join(canonical,relative);assert(fs.existsSync(paired),'Missing canonical '+paired);assert.equal(sha(fs.readFileSync(paired)),sha(bytes),'Canonical mismatch '+relative);
  images.push({file:relative,format:meta.format,width:meta.width,height:meta.height,bytes:bytes.length,sha256:sha(bytes),canonicalMatch:true});
 }
 return{images,webp:images.length,nonWebp:0,diagnosticPngExcluded:walk(path.join(folder,'verification')).filter(f=>/\.png$/i.test(f)).length};
}
function zipAudit(){
 const code=String.raw`import sys,zipfile,json,hashlib,re
with zipfile.ZipFile(sys.argv[1]) as z:
 assert z.testzip() is None
 checks=json.loads(z.read('owner-commercial/CHECKSUMS.json'))
 for item in checks:assert hashlib.sha256(z.read('owner-commercial/'+item['file'])).hexdigest()==item['sha256'],item['file']
 images=[]
 for name in z.namelist():
  if re.search(r'\.(webp|png|jpe?g|gif|avif|bmp|tiff?|ico)$',name,re.I):
   b=z.read(name);assert name.endswith('.webp') and b[:4]==b'RIFF' and b[8:12]==b'WEBP',name
   images.append({'file':name,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest(),'format':'webp'})
 print(json.dumps({'crc':'pass','checksums':len(checks),'images':images,'webp':len(images),'nonWebp':0}))`;
 return JSON.parse(cp.execFileSync('python3',['-c',code,path.join(packageRoot,'owner-commercial-developer.zip')],{encoding:'utf8'}));
}
(async()=>{
 const report={date:new Date().toISOString(),scope:'Commercial owners page and its permanent developer handoff only',publicCommit:cp.execFileSync('git',['-C',root,'rev-parse','HEAD'],{encoding:'utf8'}).trim(),static:{},zip:zipAudit(),browser:[]};
 report.static.page=await staticFiles(pageRoot,path.join(canonicalRoot,'main-site/pages/собственники коммерция'));
 report.static.handoff=await staticFiles(packageRoot,path.join(canonicalRoot,'main-site/handoff/owner-commercial'));
 const browser=await chromium.launch();
 try{for(const [label,url]of[['page','https://daniilterekh-prog.github.io/barn-estate-homepage-clone/собственники%20коммерция/'],['handoff','https://daniilterekh-prog.github.io/barn-estate-homepage-clone/handoff/owner-commercial/html/index.html']]){
  for(const width of[390,1440]){
   const p=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'}),pending=[],images=new Map(),errors=[];
   p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());if(r.request().resourceType()==='image')pending.push((async()=>{const bytes=await r.body(),m=await sharp(bytes).metadata(),type=r.headers()['content-type']||'';assert(['webp','svg'].includes(m.format),r.url()+' format '+m.format);if(m.format==='webp')assert.match(type,/image\/webp/i);images.set(r.url(),{url:r.url(),format:m.format,contentType:type,bytes:bytes.length,sha256:sha(bytes)});})())});
   await p.goto(url,{waitUntil:'networkidle'});await p.evaluate(async()=>{for(const i of document.images)i.loading='eager';await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()))});
   await p.locator('button[aria-label="Открыть меню"]:visible').first().click();await p.evaluate(async()=>{await Promise.all([...document.querySelectorAll('.site-menu img')].map(i=>i.decode()))});await p.keyboard.press('Escape');
   await p.locator('.owner-sale-hero__button').click();await p.getByRole('dialog').waitFor();await p.getByRole('dialog').locator('img').evaluateAll(async list=>{await Promise.all(list.map(i=>i.decode()))});await p.keyboard.press('Escape');
   const state=await p.evaluate(()=>({domImages:[...document.images].map(i=>({src:i.currentSrc||i.src,width:i.naturalWidth,height:i.naturalHeight})),inlineRasterData:[...document.querySelectorAll('*')].flatMap(e=>[getComputedStyle(e).backgroundImage,e.getAttribute('src')||'']).filter(s=>/data:image\/(png|jpe?g|gif|avif|bmp)/i.test(s)),broken:[...document.images].filter(i=>i.currentSrc&&(!i.complete||!i.naturalWidth)).map(i=>i.currentSrc)}));
   await Promise.all(pending);assert.deepEqual(errors,[]);assert.deepEqual(state.broken,[]);assert.deepEqual(state.inlineRasterData,[]);
   for(const img of state.domImages)assert(/\.webp(?:[?#]|$)|\.svg(?:[?#]|$)|^data:image\/svg\+xml/.test(img.src),img.src);
   const loaded=[...images.values()];report.browser.push({label,url,width,images:loaded,webp:loaded.filter(i=>i.format==='webp').length,svg:loaded.filter(i=>i.format==='svg').length,nonWebpRaster:0,broken:0,errors,inlineRasterData:0,domImages:state.domImages.length,menuAndExpertDialog:true});console.log(label,width,loaded.length,'images, all WebP/SVG');await p.close();
  }
 }}finally{await browser.close()}
 report.result='pass';report.note='SVG vector logos/icons remain SVG. PNG files are diagnostic screenshots in verification folders; none are page assets or ZIP images. No runtime or ZIP modifications were needed.';
 const bytes=JSON.stringify(report,null,2)+'\n';fs.writeFileSync(path.join(__dirname,'webp-audit.json'),bytes);fs.writeFileSync(path.join(packageRoot,'verification/WEBP-AUDIT.json'),bytes);
 console.log(JSON.stringify({result:report.result,pageWebp:report.static.page.webp,packageWebp:report.static.handoff.webp,zipWebp:report.zip.webp,browserProfiles:report.browser.length,nonWebpRaster:0}));
})().catch(e=>{console.error(e);process.exit(1)});
