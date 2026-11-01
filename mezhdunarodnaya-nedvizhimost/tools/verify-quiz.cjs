const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
(async()=>{
 const base=process.argv[2]||'http://127.0.0.1:8126/',rows=[],errors=[],posts=[];
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/google-chrome',args:['--no-sandbox']});
 const page=await browser.newPage({reducedMotion:'reduce'});
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.method()==='POST')posts.push(r.url());});
 const host=page.locator('.international-quiz-host'),next=()=>host.locator('[data-quiz-next]'),frame=()=>host.locator('.modal__content');
 const countries=['Таиланд','ОАЭ','Грузия','Турция','Азербайджан','Другие страны'];
 try{
  for(const [width,height]of[[320,900],[390,900],[540,900],[581,900],[768,900],[1024,900],[1440,900],[1920,900],[2560,900],[844,390],[568,320]]){
   await page.setViewportSize({width,height});await page.goto(base,{waitUntil:'load'});
   await page.locator('.floating-expert__card').click();assert.equal(await host.getAttribute('data-quiz-step'),'purpose');
   const frameHeight=await frame().evaluate(e=>e.getBoundingClientRect().height);
   assert.equal(await host.locator('.vfm__overlay').evaluate(e=>getComputedStyle(e).backgroundColor),'rgba(0, 0, 0, 0.5)');
   assert.ok(await next().isDisabled());
   await host.getByRole('button',{name:'Для инвестиций',exact:true}).click();await next().click();
   assert.deepEqual(await host.locator('.home-quiz__option').allTextContents(),countries);assert.ok(await next().isDisabled());
   await host.getByRole('button',{name:'Другие страны',exact:true}).click();await next().click();
   const budget=host.locator('[name=budget]'),currency=host.locator('[name=currency]');
   assert.deepEqual(await currency.locator('option').allTextContents(),['₽','$','€']);
   await budget.fill('нет');assert.ok(await next().isDisabled());
   await budget.fill('300–500 тыс.');await currency.selectOption('$');await next().click();
   let answers=JSON.parse(await host.locator('[name=quizAnswers]').inputValue());assert.deepEqual(answers,{purpose:'Для инвестиций',country:'Другие страны',budget:'300–500 тыс.',currency:'$'});
   assert.ok(Math.abs(frameHeight-await frame().evaluate(e=>e.getBoundingClientRect().height))<1);
   await host.getByRole('button',{name:'← Назад',exact:true}).click();assert.equal(await budget.inputValue(),'300–500 тыс.');assert.equal(await currency.inputValue(),'$');
   await next().click();assert.ok(await host.locator('[name=consent]').isChecked()===false);
   assert.ok(await host.locator('.home-owner-form__hero-image').evaluate(e=>e.complete&&e.naturalWidth>0));
   for(const channel of ['Telegram','WhatsApp','MAX','Звонок']){await host.locator('[data-channel="'+channel+'"]').click();assert.equal(await host.locator('[name=preferredChannel]').inputValue(),channel);}
   const submit=host.locator('[type=submit]');await submit.click();assert.equal(await host.locator('[name=name]').getAttribute('aria-invalid'),'true');
   assert.equal(await host.locator('[name=name]').getAttribute('aria-describedby'),'international-quiz-status');
   await host.locator('[name=name]').fill('Тест');await host.locator('[name=phone]').fill('123');await submit.click();assert.equal(await host.locator('[name=phone]').getAttribute('aria-invalid'),'true');
   await host.locator('[name=phone]').fill('+971 50 123 4567');await submit.click();assert.equal(await host.locator('[name=consent]').getAttribute('aria-invalid'),'true');
   await host.locator('[name=consent]').check({force:true});await submit.click();assert.match(await host.locator('[data-owner-status]').textContent(),/Данные не отправлены/);
   const visibleText=await host.innerText();assert.ok(!/(^|[\s.,!?;:«»])(?:ты|тебе|тебя|твой)(?=$|[\s.,!?;:«»])/i.test(visibleText));
   assert.ok(await frame().evaluate(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight+1;}));
   assert.ok(await host.locator('.home-owner-form__body').evaluate(e=>e.scrollWidth<=e.clientWidth+1));
   assert.equal(await page.locator('#__nuxt').evaluate(e=>e.inert),true);
   for(let i=0;i<18;i++){await page.keyboard.press('Tab');assert.ok(await host.evaluate(e=>e.contains(document.activeElement)));}
   await page.keyboard.press('Escape');assert.equal(await host.count(),0);assert.equal(await page.locator('#__nuxt').evaluate(e=>e.inert),false);
   assert.equal(await page.evaluate(()=>document.activeElement.classList.contains('floating-expert__card')),true);
   await page.locator('.catalog-grid__item:not([hidden]) .apartment-card__call-btn').first().click();
   assert.equal(await host.getAttribute('data-quiz-step'),'contact');assert.ok(await host.locator('[name=objectUrl]').inputValue());assert.ok(await host.locator('[name=objectName]').inputValue());assert.equal(await host.locator('[name=preferredChannel]').inputValue(),'Звонок');
   await host.locator('[data-quiz-close]').click();assert.equal(await host.count(),0);
   rows.push({width,height,countries:true,stateAndCurrency:true,validation:true,objectContext:true,keyboard:true,frameStable:true});console.log('PASS',width,height);
  }
  // Every approved country, unknown budget, repeat opens and general CTA routing.
  await page.setViewportSize({width:1440,height:1000});await page.goto(base,{waitUntil:'load'});
  for(const country of countries){
   await page.locator('.floating-expert__card').click();await host.getByRole('button',{name:'Для жизни',exact:true}).click();await next().click();await host.getByRole('button',{name:country,exact:true}).click();await next().click();await host.getByRole('button',{name:'Бюджет пока не определён',exact:true}).click();await next().click();
   assert.equal(JSON.parse(await host.locator('[name=quizAnswers]').inputValue()).country,country);await page.keyboard.press('Escape');
  }
  for(const selector of ['.site-footer__callback-btn','.catalog-consultation__form [type=submit]','.catalog-contact__form [type=submit]']){await page.locator(selector).click();assert.equal(await host.getAttribute('data-quiz-step'),'purpose');await page.keyboard.press('Escape');}
  await page.evaluate(()=>scrollTo(0,900));await page.locator('.catalog-sticky__request:visible').click();assert.equal(await host.getAttribute('data-quiz-step'),'purpose');await page.keyboard.press('Escape');
  await page.locator('.catalog-projects-map__fullscreen').click();
  await page.evaluate(()=>window.BarnesInternationalQuiz.open({trigger:document.querySelector('.map-browser__filter-toggle')}));
  assert.equal(await host.evaluate(e=>e.inert),false);await host.getByRole('button',{name:'Сразу перейти к контактам'}).click();await page.keyboard.press('Escape');
  assert.ok(await page.locator('.map-browser').isVisible());await page.keyboard.press('Escape');assert.ok(await page.locator('.map-browser').isHidden());
  assert.equal(await page.locator('.catalog-feedback-modal').count(),0);assert.deepEqual(errors,[]);assert.deepEqual(posts,[]);
  fs.writeFileSync(path.resolve(__dirname,'../verification/quiz.json'),JSON.stringify({base,countries,rows,allCountries:true,generalCtas:true,errors,posts,backend:'not connected'},null,2)+'\n');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
