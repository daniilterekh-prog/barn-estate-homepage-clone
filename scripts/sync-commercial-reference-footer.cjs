/* Mechanical export of the saved reference footer; retain commerce's CSS scope/logo. */
const fs=require('node:fs/promises'),path=require('node:path'),cp=require('node:child_process');
const {JSDOM}=require('/home/daniil/.local/share/codex-toolkit/node_modules/jsdom');
(async()=>{
 const source=cp.execFileSync('git',['show','ff101ce:kurortnaya/index.html'],{maxBuffer:10*1024*1024}).toString();
 const footer=new JSDOM(source).window.document.querySelector('.site-footer');
 footer.querySelector('img').setAttribute('src','assets/source/f8285279bd12.svg');
 footer.querySelectorAll('a[href]').forEach(link=>link.setAttribute('href',new URL(link.getAttribute('href'),'https://daniilterekh-prog.github.io/barn-estate-homepage-clone/kurortnaya/').href));
 const html=footer.outerHTML.replaceAll('data-v-6eb18211','data-v-1e05d2e0');
 await fs.writeFile(path.resolve(__dirname,'../kommercheskaya-nedvizhimost/reference-footer.js'),'/* Reference footer: ff101ce; original local logo and CSS scope. */\nwindow.CommercialReferenceFooter = '+JSON.stringify(html)+';\n');
})().catch(e=>{console.error(e);process.exitCode=1});
