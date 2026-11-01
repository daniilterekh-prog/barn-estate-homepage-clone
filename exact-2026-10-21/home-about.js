/* Restored from components/blok-o-barnes/index.html, after Nuxt hydration. */
(()=>{
 if(window.__barnesHomeAbout)return;
 const logo=new URL('assets/home-about-logo-round-red.png',document.currentScript.src).href;
 const template="<section class=\"about-company\" data-preserve-brand aria-labelledby=\"about-company-title\">\n <div class=\"about-company__inner\">\n  <div class=\"about-company__brand\" aria-label=\"BARN Estate\">\n   <img class=\"about-company__brand-logo\" src=\"__ABOUT_LOGO__\" alt=\"Круглый логотип BARN Estate, красный вариант\" width=\"600\" height=\"600\" />\n  </div>\n  <div class=\"about-company__content\">\n   <h1 class=\"about-company__title\" id=\"about-company-title\">Агентство элитной недвижимости BARN Estate</h1>\n   <p class=\"about-company__intro\">BARN Estate — агентство элитной недвижимости с многолетним опытом работы на российском рынке. Мы специализируемся на подборе, покупке, продаже и аренде премиальной недвижимости, объединяя глубокое знание рынка, профессиональную экспертизу и индивидуальный подход к каждому клиенту.</p>\n   <div class=\"about-company__copy\">\n    <div class=\"about-company__copy-text\" id=\"about-company-more\" hidden>\n     <p>Компания продолжает историю команды, которая с 2019 года представляла в России международный бренд BARNES. Сегодня BARN Estate развивается под собственным именем, сохраняя высокие стандарты сервиса, накопленный опыт и философию Art de Vivre — искусство жить.</p>\n     <p>В портфеле BARN Estate представлены эксклюзивные объекты городской и загородной недвижимости Москвы и Подмосковья, Санкт-Петербурга, а также курортных регионов России. Мы работаем с новостройками и вторичным рынком, частными резиденциями, загородными домами, инвестиционными и коммерческими объектами.</p>\n     <p>В сегменте курортной недвижимости мы предлагаем объекты в наиболее востребованных регионах России, включая Алтай, Архыз, Крым и Шерегеш. В нашем портфеле представлены современные резиденции, апартаменты и загородные дома для сезонного отдыха, постоянного проживания и инвестиций.</p>\n     <p>Зарубежное направление BARN Estate охватывает востребованные рынки недвижимости ОАЭ, Турции, Таиланда и европейских стран. Подбор объектов и сопровождение сделок за рубежом осуществляются с привлечением профильных партнеров.</p>\n     <p>Мы помогаем клиентам находить решения, соответствующие их образу жизни, личным предпочтениям и финансовым целям. Благодаря профессиональным связям и многолетнему опыту работы на рынке специалисты BARN Estate предлагают в том числе объекты из закрытых баз, не представленные в открытой продаже.</p>\n     <p>BARN Estate — больше, чем агентство недвижимости. Для нас философия Art de Vivre воплощается не только в выборе места для жизни, но и в интересе к архитектуре, искусству, культуре и гастрономии.</p>\n     <p>Офис компании на Петровке, 19 в Москве — пространство для общения с клиентами и партнерами, встреч с представителями бизнеса и творческих индустрий. Мы поддерживаем традицию проведения культурных и деловых мероприятий, объединяющих людей со схожими интересами и взглядами на качество жизни.</p>\n     <p>Для нас элитная недвижимость — это сочетание эстетики, комфорта и долгосрочной ценности. Мы помогаем клиентам принимать взвешенные решения, сопровождая их на каждом этапе выбора и приобретения недвижимости.</p>\n    </div>\n    <button class=\"about-company__read-more\" type=\"button\" aria-controls=\"about-company-more\" aria-expanded=\"false\">Читать далее<span class=\"about-company__read-more-icon\" aria-hidden=\"true\"><svg viewBox=\"0 0 16 16\" focusable=\"false\"><path d=\"M3 13 13 3M5 3h8v8\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.25\"/></svg></span></button>\n   </div>\n  </div>\n </div>\n</section>";
 function refresh(){
  const before=document.querySelector('.project-hero');if(!before)return;
  const existing=document.querySelector('.about-company');
  if(existing){if(existing.nextElementSibling!==before)before.before(existing);return;}
  const wrapper=document.createElement('div');wrapper.innerHTML=template.replace('__ABOUT_LOGO__',logo);
  const section=wrapper.firstElementChild;before.before(section);
  const button=section.querySelector('.about-company__read-more'),copy=section.querySelector('.about-company__copy-text');
  const observer=new ResizeObserver(fitLogo);
  observer.observe(section.querySelector('.about-company__title'));
  observer.observe(section.querySelector('.about-company__intro'));
  document.fonts?.ready.then(fitLogo);
  button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));copy.hidden=!open;button.firstChild.textContent=open?'Свернуть':'Читать далее';if(!open)button.scrollIntoView({block:'nearest'})});
 }
 function fitLogo(){
  const section=document.querySelector('.about-company');if(!section)return;
  if(innerWidth<1280){section.style.removeProperty('--home-about-logo-size');return;}
  const content=section.querySelector('.about-company__content'),intro=section.querySelector('.about-company__intro'),copy=section.querySelector('.about-company__copy'),button=section.querySelector('.about-company__read-more');
  // Match the collapsed right column, even while the long copy is expanded.
  const size=intro.getBoundingClientRect().bottom-content.getBoundingClientRect().top+parseFloat(getComputedStyle(copy).marginTop)+button.getBoundingClientRect().height;
  const value=`${size}px`;
  if(section.style.getPropertyValue('--home-about-logo-size')!==value)section.style.setProperty('--home-about-logo-size',value);
 }
 window.__barnesHomeAbout={refresh,fitLogo};
 window.__barnesHomeContent?.refresh?.();
})();
