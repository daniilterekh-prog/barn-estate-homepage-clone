/* Static fragment is compiled by tools/home-events.cjs. Restore after Nuxt hydration
   through the existing home-content observer; no second observer or network fetch. */
(()=>{
  if(window.__barnesHomeEvents)return;
  const base=new URL('.',document.currentScript.src);
  const template="<section id=\"home-events\" class=\"home-events\" aria-labelledby=\"home-events-title\">\n <div class=\"home-events__inner\">\n  <header class=\"home-events__header\">\n   <p class=\"home-events__eyebrow\">Личные встречи</p>\n   <h2 id=\"home-events-title\">Мероприятия BARN Estate</h2>\n  </header>\n  <div class=\"home-events__grid\">\n   <article class=\"home-events__card\">\n   <a class=\"home-events__card-link\" href=\"https://barn-estate.ru/media/meropriyatiya/osenniy-padel-v-parke-gorkogo-novyy-turnir-dlya-druzey-barn-estate/\" aria-label=\"Как прошло мероприятие: Осенний падел в парке Горького: новый турнир для друзей BARN Estate\">\n    <div class=\"home-events__media\">\n     <img class=\"home-events__image\" src=\"assets/home-event-2026-10-05.webp\" alt=\"Осенний падел в парке Горького: новый турнир для друзей BARN Estate\" width=\"1600\" height=\"827\" loading=\"lazy\" decoding=\"async\">\n     <time class=\"home-events__date\" datetime=\"2026-10-05\">5 октября 2026 г.</time>\n    </div>\n    <div class=\"home-events__copy\">\n     <h3>Осенний падел в парке Горького: новый турнир для друзей BARN Estate</h3>\n     <span class=\"home-events__read-more\">Как прошло мероприятие</span>\n    </div>\n   </a>\n   </article>\n   <article class=\"home-events__card\">\n   <a class=\"home-events__card-link\" href=\"https://barn-estate.ru/media/meropriyatiya/barnes-friendly-padel-glavnyy-padel-turnir-leta-2026/\" aria-label=\"Как прошло мероприятие: BARN Estate &amp; FRIENDLY PADEL: главный падел-турнир этого лета\">\n    <div class=\"home-events__media\">\n     <img class=\"home-events__image\" src=\"assets/home-event-2026-07-26.webp\" alt=\"BARN Estate &amp; FRIENDLY PADEL: главный падел-турнир этого лета\" width=\"1600\" height=\"1066\" loading=\"lazy\" decoding=\"async\">\n     <time class=\"home-events__date\" datetime=\"2026-07-26\">26 июля 2026 г.</time>\n    </div>\n    <div class=\"home-events__copy\">\n     <h3>BARN Estate &amp; FRIENDLY PADEL: главный падел-турнир этого лета</h3>\n     <span class=\"home-events__read-more\">Как прошло мероприятие</span>\n    </div>\n   </a>\n   </article>\n  </div>\n  <div class=\"home-events__footer\"><a class=\"home-events__link\" href=\"/barn-estate-homepage-clone/media/meropriyatiya/\">Все мероприятия <svg aria-hidden=\"true\" focusable=\"false\" width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\"><path d=\"M3 13 13 3M5 3h8v8\" stroke=\"currentColor\" stroke-width=\"1.35\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg></a></div>\n </div>\n</section>";
  function refresh(){
    const before=document.querySelector('.news-section');
    if(!before)return;
    let section=document.getElementById('home-events');
    if(!section){
      const holder=document.createElement('template');holder.innerHTML=template;
      section=holder.content.firstElementChild;
      for(const image of section.querySelectorAll('img'))image.src=new URL(image.getAttribute('src'),base).href;
      // Resolve preview navigation before the legacy adapter rewrites root links.
      for(const link of section.querySelectorAll('a')){
        link.href=new URL(link.getAttribute('href'),base).href;
        link.dataset.homeOriginalLink='';
      }
    }
    if(section.nextElementSibling!==before)before.before(section);
  }
  window.__barnesHomeEvents={refresh};
  // home-content calls refresh only once the captured Vue app has hydrated.
  if(document.body.dataset.homeSpacingReady==='true')refresh();
})();
