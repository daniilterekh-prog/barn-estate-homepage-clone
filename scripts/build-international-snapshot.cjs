/* Mechanical normalization of a public DOM capture into an isolated page. */
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit/node_modules/playwright');
(async () => {
  const target = path.resolve('mezhdunarodnaya-nedvizhimost');
  const capture = JSON.parse(await fs.readFile('/tmp/barnes-international-capture.json','utf8'));
  const names = await fs.readdir(path.join(target,'assets'));
  const browser = await chromium.launch({ executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox'] });
  const page = await browser.newPage();
  await page.route('**/*',route=>route.abort());
  await page.setContent(capture.html);
  const html = await page.evaluate(({capture,names}) => {
    const origin='https://front.barnes.vsavr.ru';
    const normalize = value => {
      if (!value || /^(data:|#|mailto:|tel:)/.test(value)) return value;
      const url=new URL(value,origin);
      const basename=decodeURIComponent(url.pathname.split('/').pop());
      const local=names.find(name=>name.endsWith('-'+basename));
      return local ? 'assets/'+local : url.href;
    };
    document.querySelectorAll('script,style,link[rel="stylesheet"],link[rel="preload"],link[rel="modulepreload"],link[rel="prefetch"],base').forEach(e=>e.remove());
    document.querySelectorAll('img,source').forEach(e=>{
      if(e.hasAttribute('src'))e.setAttribute('src',normalize(e.getAttribute('src')));
      e.removeAttribute('srcset'); e.removeAttribute('onerror');
      e.setAttribute('loading','eager');
    });
    document.querySelectorAll('a[href],link[href]').forEach(e=>e.setAttribute('href',normalize(e.getAttribute('href'))));
    document.querySelectorAll('[style]').forEach(e=>e.setAttribute('style',e.getAttribute('style').replace(/url\((['"]?)([^)'"\s]+)\1\)/g,(_,q,url)=>'url("'+normalize(url)+'")')));
    document.body.className='international-source-page';
    document.body.style.removeProperty('overflow');
    document.querySelectorAll('.vfm,.hero-filter-modal,.site-menu').forEach(e=>e.remove());
    for(const kind of ['filters','callback','menu']){
      const template=document.createElement('template');template.id='source-'+kind;template.innerHTML=capture[kind];
      template.content.querySelectorAll('img').forEach(e=>e.setAttribute('src',normalize(e.getAttribute('src'))));
      template.content.querySelectorAll('a[href]').forEach(e=>e.setAttribute('href',normalize(e.getAttribute('href'))));
      document.body.append(template);
    }
    for(const file of ['source.css','source-map.css','source-runtime.css']){const link=document.createElement('link');link.rel='stylesheet';link.href=file+'?v=20261012-2';document.head.append(link);}
    for(const file of ['source-map-states.js','source-runtime.js']){const script=document.createElement('script');script.src=file+'?v=20261012-2';script.defer=true;document.body.append(script);}
    return '<!DOCTYPE html>\n'+document.documentElement.outerHTML;
  },{capture,names});
  const css=capture.css.replace(/url\((['"]?)(\/[^)'"\s]+)\1\)/g,(_,q,url)=>url.startsWith('/fonts/')?'url("../assets'+url+'")':'url("https://front.barnes.vsavr.ru'+url+'")');
  await fs.writeFile(path.join(target,'index.html'),html);
  await fs.writeFile(path.join(target,'standalone/index.html'),html.replace(/src="assets\//g,'src="../assets/').replace(/url\("assets\//g,'url("../assets/').replace(/href="(source[^"?]+\.css)/g,'href="../$1').replace(/src="(source[^"?]+\.js)/g,'src="../$1'));
  await fs.writeFile(path.join(target,'source.css'),css.replace(/[ \t]+$/gm,''));
  console.log(JSON.stringify({html:html.length,css:css.length}));
  await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1;});
