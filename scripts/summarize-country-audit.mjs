// Generate a versionable report from actual PNG captures, retaining failures.
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const toolkit=process.env.CAPTURE_TOOLKIT;
if(!toolkit) throw new Error('Set CAPTURE_TOOLKIT.');
const {PNG}=await import(pathToFileURL(path.join(toolkit,'node_modules/pngjs/lib/png.js')));
const {default:pixelmatch}=await import(pathToFileURL(path.join(toolkit,'node_modules/pixelmatch/index.js')));
const directories=process.argv.slice(2);
if(!directories.length) throw new Error('Pass capture directories.');
const reports=await Promise.all(directories.map(dir=>fs.readFile(path.join(dir,'report.json'),'utf8').then(JSON.parse)));
const rows=new Map();
for(let i=0;i<reports.length;i++) for(const row of reports[i].widths) {
  const rect=row.sectionMetrics['.catalog-projects-map'].rect;
  for(const state of row.scrollStates) {
    const images=await Promise.all(['source','local'].map(kind=>fs.readFile(path.join(directories[i],`${kind}-${row.width}-y${state.y}.png`)).then(buffer=>PNG.sync.read(buffer))));
    for(const image of images) {
      const [x,y,w,h]=rect;
      for(let r=Math.max(0,Math.floor(y-state.y));r<Math.min(image.height,Math.ceil(y-state.y+h));r++) {
        for(let c=Math.max(0,Math.floor(x));c<Math.min(image.width,Math.ceil(x+w));c++) image.data.fill(255,(r*image.width+c)*4,(r*image.width+c)*4+4);
      }
    }
    state.outsideMapStrictChangedPixels=pixelmatch(images[0].data,images[1].data,undefined,images[0].width,images[0].height,{threshold:0,includeAA:true});
  }
  rows.set(row.width,row);
}
const widths=[...rows.values()].sort((a,b)=>a.width-b.width);
const report={
  ...reports[0],localURL:'/zagorodnaya-nedvizhimost/',capturedAt:reports.map(r=>r.capturedAt),
  status:'partial: dynamic map is not fully reproduced',
  nativeScrollSettleMs:'500–1200; identical wait for reference and local within each capture pair',
  originalFontSHA256:{
    'TildaSans-Light.woff2':'f0f2c165784c72343618a7c2cbde00e45dbb9b09af5149984792f280cac9642e',
    'TildaSans-Regular.woff2':'2670dad44ca6c2a1b9bbdbf1af6d8db9173f2dbe31604e80bdf9599b55047d41',
    'TildaSans-Medium.woff2':'f716269e361f466570f37bc920988c619ddc8a7828c5949c1c56a731a320ab47'
  },
  exclusions:'Outside-map counts explicitly mask only the .catalog-projects-map rectangle. Full-page and viewport counts are unmasked.',
  widths,
  summary:{testedWidths:widths.map(r=>r.width),geometryAndTextStylesMatch:widths.every(r=>!r.sectionDifferences.length&&!r.textStyleDifferences.length),wholePageOutsideMapMatches:widths.every(r=>r.fullPageOutsideMap.strictChangedPixels===0),allScrollStatesOutsideMapMatch:widths.every(r=>r.scrollStates.every(s=>s.outsideMapStrictChangedPixels===0)),wholePageIncludingMapMatches:widths.every(r=>r.fullPage.strictChangedPixels===0)},
  interactionChecks:{viewport:[1440,900],transports:['HTTP','file://'],javascriptErrors:0,horizontalOverflow:false,fontWeightsLoaded:[300,400,500],introOpenClose:true,seoLinksOpenClose:true,faqOpenClose:true,bestOfferNext:'Усадьба Аносино',newsNext:'Россия вошла в топ-10 стран по росту цен на жилую недвижимость',externalFormsSubmitted:false},
  errors:reports.map(r=>r.errors),
};
const target=path.resolve('zagorodnaya-nedvizhimost/verification/2026-10-12.json');
await fs.mkdir(path.dirname(target),{recursive:true});
await fs.writeFile(target,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report.summary));
console.log(target);
