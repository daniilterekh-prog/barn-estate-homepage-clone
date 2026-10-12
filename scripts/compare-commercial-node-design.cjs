/* Compare shared visual roles; differing commercial content is not a pixel diff. */
const fs=require('node:fs/promises');
const path=require('node:path');
const assert=require('node:assert/strict');
const toolkit=process.env.WEB_CAPTURE_TOOLKIT||'/home/daniil/Documents/Codex/2026-10-11/firecrawl/work/web-capture-toolkit';
const {chromium}=require(path.join(toolkit,'node_modules/playwright'));
const reference='https://daniilterekh-prog.github.io/barn-estate-homepage-clone/kurortnaya/';
const roles={
  hero:'.catalog-hero__title',mapTitle:'.catalog-map__title',listingTitle:'.catalog-grid__title',newsTitle:'.news-section__title',faqTitle:'.catalog-faq__title',introTitle:'.catalog-intro__title',
  eyebrow:'.catalog-grid__header>.catalog-section-eyebrow',faqQuestion:'.catalog-faq__question-text',faqAnswer:'.catalog-faq__answer-content',
  cardName:'.apartment-card--catalog .apartment-card__name-text',cardPrice:'.apartment-card--catalog .apartment-card__price',
  cardCall:'.apartment-card--catalog .apartment-card__call-btn',cardDetails:'.apartment-card--catalog .apartment-card__detail-btn',
  filter:'.catalog-mode-toolbar .catalog-quick-filters__caption',sort:'.catalog-mode-toolbar .catalog-grid__sort-select',
  cardBody:'.apartment-card--catalog .apartment-card__body',mapHeader:'.catalog-map__header',listingGrid:'.catalog-grid__list'
};
(async()=>{
  const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
  const results=[];
  try{
    const source=await browser.newPage({viewport:{width:1440,height:900}}),local=await browser.newPage({viewport:{width:1440,height:900}});
    await source.goto(reference,{waitUntil:'networkidle'});
    await local.goto('file://'+path.resolve(__dirname,'../kommercheskaya-nedvizhimost/index.html'));
    for(const p of [source,local])await p.evaluate(()=>document.fonts.ready);
    for(const width of [390,768,1440,1920,2560]){
      const styles=[];
      for(const p of [source,local]){
        await p.setViewportSize({width,height:900});
        styles.push(await p.evaluate(roles=>Object.fromEntries(Object.entries(roles).map(([role,selector])=>{
          const e=document.querySelector(selector);if(!e)return[role,null];
          const s=getComputedStyle(e);
          const properties=['fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','color'];
          if(['cardCall','cardDetails'].includes(role))properties.push('height','borderRadius');
          if(role==='cardBody')properties.splice(0,properties.length,'padding','margin');
          if(role==='mapHeader')properties.splice(0,properties.length,'marginBottom');
          if(role==='listingGrid')properties.splice(0,properties.length,'gap','gridTemplateColumns');
          return[role,Object.fromEntries(properties.map(prop=>[prop,s[prop]]))];
        })),roles));
      }
      const differences=[];
      for(const role of Object.keys(roles))for(const property of Object.keys(styles[0][role]||{}))if(styles[0][role][property]!==styles[1][role]?.[property])differences.push({role,property,reference:styles[0][role][property],local:styles[1][role]?.[property]});
      // Chromium distributes 1/64 CSS-pixel remainders differently with a
      // one-project reference grid versus the twelve populated commercial lots.
      const cssSubpixelRounding=differences.filter(d=>d.role==='listingGrid'&&d.property==='gridTemplateColumns'&&(()=>{
        const a=d.reference.split(' ').map(parseFloat),b=d.local.split(' ').map(parseFloat);
        return a.length===b.length&&a.every((value,index)=>Math.abs(value-b[index])<=.016);
      })());
      const mismatches=differences.filter(d=>!cssSubpixelRounding.includes(d));
      results.push({width,reference:styles[0],local:styles[1],differences,cssSubpixelRounding,mismatches});
      console.log(width,JSON.stringify(differences));
    }
    await fs.writeFile(path.resolve(__dirname,'../kommercheskaya-nedvizhimost/node-reference-comparison.json'),JSON.stringify({reference,verifiedAt:new Date().toISOString(),scope:'Shared typography, card controls/body geometry, map header spacing and grid columns; not whole-page pixel equality',results},null,2)+'\n');
    assert.equal(results.every(r=>!r.mismatches.length),true,'Reference role comparison (grid remainder limit 1/64 CSS px; recorded, not pixel equality)');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
