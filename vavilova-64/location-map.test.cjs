const {test}=require('node:test')
const assert=require('node:assert/strict')
const fs=require('node:fs'),path=require('node:path')
test('location includes one project-coordinate map after its content',()=>{
  const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8')
  const section=html.match(/<section[^>]*id="location"[\s\S]*?<\/section>/)[0]
  assert.equal((section.match(/<iframe/g)||[]).length,1)
  assert.match(section,/37\.54993%2C55\.683495/)
  assert.match(section,/title="Карта расположения/)
  assert.ok(section.indexOf('detail-location__content')<section.indexOf('vavilova-location-map__frame'))
  assert.equal((section.match(/<button[^>]*detail-location__action/g)||[]).length,1)
})
