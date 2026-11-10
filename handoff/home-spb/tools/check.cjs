const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/home/daniil/.local/share/codex-toolkit/node_modules/playwright');
const url=process.env.CHECK_URL,root=path.resolve(__dirname,'..'),out=process.env.CHECK_OUTPUT||path.join(root,'verification');
if(!url)throw Error('Set CHECK_URL to an HTTP server containing this package');
const origin=new URL(url).origin,names=['Новостройки','Вторичка','Загородная','Коммерческая','Курортная','Зарубежная'],counts=[4,3,3,3,3,5];
(async()=>{fs.mkdirSync(out,{recursive:true});const b=await chromium.launch(),results=[];
for(const width of [320,390,1440]){
 const p=await b.newPage({viewport:{width,height:900}}),errors=[],failed=[],external=[];p.setDefaultTimeout(12000);
 p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)failed.push([r.url(),r.status()]);});p.on('requestfailed',r=>failed.push([r.url(),r.failure()?.errorText]));
 await p.route('**/*',r=>{if(new URL(r.request().url()).origin!==origin){external.push(r.request().url());return r.abort();}return r.continue();});
 assert.equal((await p.goto(url,{waitUntil:'networkidle'})).status(),200);await p.waitForFunction(()=>document.querySelector('#__nuxt')?.__vue_app__?.config.globalProperties.$nuxt?.isHydrating===false);await p.waitForTimeout(500);
 const state=await p.evaluate(()=>({title:document.title,overflow:document.documentElement.scrollWidth>innerWidth,tabs:[...document.querySelectorAll('.barnes-choice__tab')].map(e=>e.textContent.trim()),brandCaptions:document.querySelectorAll('.spb-brand-caption').length,robots:document.querySelector('meta[name=robots]')?.content}));
 assert(!state.overflow);assert.equal(state.brandCaptions,0);assert(state.robots.includes('noindex'));assert.deepEqual(state.tabs,names);
 const schemas=await p.locator('#home-agency-schema').allTextContents();assert.equal(schemas.length,1);assert.deepEqual(JSON.parse(schemas[0]),JSON.parse(fs.readFileSync(path.join(root,'data/spb-schema.json'))));
 await p.screenshot({path:path.join(out,`${width}-hero.webp`)});
 if(width!==320){
  const widget=p.locator('.floating-expert');assert.equal(await widget.locator('.floating-expert__name').textContent(),'Людмила Белоусова');await widget.locator('.floating-expert__card').click();
  const modal=p.locator('.home-owner-host');await modal.waitFor();const portrait=await modal.locator('img').evaluate(async e=>{await e.decode();return {src:e.src,alt:e.alt,width:e.naturalWidth}});assert(portrait.src.includes('ludmila-belousova-bw.webp'));assert(portrait.width>1000);assert(portrait.alt.includes('руководитель филиала'));
  await p.keyboard.press('Escape');await modal.waitFor({state:'detached'});assert(await p.evaluate(()=>document.activeElement?.classList.contains('floating-expert__card')));
 }
 await p.locator('.floating-expert__close').click().catch(()=>{});
 const groups=[];
 if(width!==320)for(let i=0;i<names.length;i++){
  const row=p.locator('.barnes-choice');await row.scrollIntoViewIfNeeded();
  if(width<768){await row.getByRole('button',{name:'Категории недвижимости',exact:true}).click();await row.getByRole('option',{name:names[i],exact:true}).click();}else await row.getByRole('tab',{name:names[i],exact:true}).click();
  await p.waitForTimeout(350);
  const group=await row.evaluate(async e=>{const records=[...new Map([...e.querySelectorAll('.home-rec-card')].map(x=>[x.dataset.href,{name:x.dataset.name,url:x.dataset.href,img:x.querySelector('img').src}])).values()];for(const record of records){const image=new Image;image.src=record.img;await image.decode();if(!image.naturalWidth)throw Error('Broken image');}return {records,action:e.querySelector('.barnes-choice__action').href};});
  assert.equal(group.records.length,counts[i]);for(const r of group.records)assert.equal(new URL(r.url).hostname,i>=4?'barn-estate.ru':'barnestate-spb.ru');groups.push({name:names[i],...group});
 }
 if(width!==320){
  // Return to the first category and toggle a visible favourite, including cloned slides.
  const row=p.locator('.barnes-choice');if(width<768){await row.getByRole('button',{name:'Категории недвижимости',exact:true}).click();await row.getByRole('option',{name:names[0],exact:true}).click();}else await row.getByRole('tab',{name:names[0],exact:true}).click();
  await row.evaluate(e=>scrollTo(0,scrollY+e.getBoundingClientRect().top-140));await p.waitForTimeout(400);let favorite;
  for(const e of await row.locator('.home-rec-favorite').all()){const r=await e.boundingBox();if(r&&r.x>=0&&r.x+r.width<=width&&r.y>120&&r.y+r.height<900){favorite=e;break;}}
  assert(favorite,'visible favourite');await favorite.click();assert.equal(await favorite.getAttribute('aria-pressed'),'true');await favorite.click();assert.equal(await favorite.getAttribute('aria-pressed'),'false');
 }
 const featured=p.locator('.project-hero');await featured.scrollIntoViewIfNeeded();const slides=[];
 for(let i=0;i<2;i++){
  if(i){if(width<=540)await featured.locator('.splide__pagination__page').nth(1).click();else await featured.getByRole('button',{name:'Следующий проект',exact:true}).first().click();await p.waitForTimeout(900);}
  const slide=await featured.locator('.splide__slide.is-active').first().evaluate(e=>{const title=e.querySelector('.project-hero__title'),c=e.querySelector('.project-hero__content'),box=c.getBoundingClientRect(),s=getComputedStyle(c),range=document.createRange();range.selectNodeContents(title);return {name:title.textContent,left:box.left+parseFloat(s.paddingLeft),right:box.right-parseFloat(s.paddingRight),lines:[...range.getClientRects()].map(x=>({left:x.left,right:x.right}))}});assert(slide.lines.every(r=>r.left>=slide.left-1&&r.right<=slide.right+1));slides.push(slide);
  await p.screenshot({path:path.join(out,`${width}-featured-${i+1}.webp`)});
 }
 assert.notEqual(slides[0].name,slides[1].name);
 await p.locator('.departments-section').scrollIntoViewIfNeeded();await p.waitForTimeout(300);await p.screenshot({path:path.join(out,`${width}-directions.webp`)});
 const team=await p.locator('.team-section').evaluate(async e=>{const cards=[...e.querySelectorAll('.team-member-card')];for(const card of cards){const image=new Image;image.src=card.querySelector('img').src;await image.decode();if(!image.naturalWidth)throw Error('Broken team portrait');}return {count:cards.length,name:cards[0].querySelector('h3').textContent,role:cards[0].querySelector('.team-member-card__role').textContent}});assert.equal(team.name,'Людмила Белоусова');assert(team.role.includes('Руководитель филиала'));assert.equal(team.count,25);
 const allImages=await p.evaluate(async()=>{const urls=new Set([...document.images].map(e=>e.currentSrc||e.src).filter(Boolean));for(const e of document.querySelectorAll('*')){const bg=getComputedStyle(e).backgroundImage;for(const m of bg.matchAll(/url\(["']?([^"')]+)["']?\)/g))urls.add(m[1]);}await Promise.all([...urls].map(u=>Promise.race([new Promise((resolve,reject)=>{const i=new Image;i.onload=resolve;i.onerror=()=>reject(Error('Image failed '+u));i.src=u;if(i.complete&&i.naturalWidth)resolve();}),new Promise((_,reject)=>setTimeout(()=>reject(Error('Image timeout '+u)),10000))])));return urls.size;});
 await p.evaluate(()=>scrollTo(0,0));const menu=p.locator('.site-header button[aria-label*="меню" i]').first();await menu.click();await p.waitForTimeout(300);assert(await p.locator('.site-header').evaluate(e=>!!e.querySelector('[aria-expanded="true"]')||/menu.*open|open.*menu/.test(e.innerHTML)));await p.keyboard.press('Escape');
 // Search destination is a navigation, fulfilled locally to prevent a real external request.
 await p.goto(url,{waitUntil:'networkidle'});let destination;
 await p.route('https://barnestate-spb.ru/**',r=>{destination=r.request().url();return r.fulfill({status:200,contentType:'text/html',body:'<!doctype html><title>Destination verified</title>'});});
 const input=p.locator('.home-hero input:visible').first();await input.fill('585004');await input.press('Enter');await p.waitForURL('https://barnestate-spb.ru/gorodskaya-nedvizhimost/vtorichnaya-nedvizhimost/585004/');assert(destination);
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);assert.deepEqual(external,[]);
 results.push({width,...state,groups,slides,team,allImages,searchDestination:destination,errors,failed,external});await p.close();
}
await b.close();fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({date:'2026-11-10',url,network:'External resource requests blocked; expected search navigation fulfilled by test',results},null,2)+'\n');console.log(JSON.stringify(results.map(r=>({width:r.width,groups:r.groups.map(g=>[g.name,g.records.length]),team:r.team.count,slides:r.slides.map(s=>s.name),errors:r.errors,failed:r.failed,external:r.external}))));
})().catch(e=>{console.error(e);process.exit(1)});
