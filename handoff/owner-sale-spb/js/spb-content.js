/* Regional routes and direction actions, based on the current SPb homepage. */
(()=>{'use strict';
const current=document.currentScript,home=new URL('../home-spb/',current.src).href;
const routes={"/":"https://barnestate-spb.ru/","/gorodskaya-nedvizhimost/":"https://barnestate-spb.ru/gorodskaya-nedvizhimost/vtorichnaya-nedvizhimost/","/vtorichnaya-nedvizhimost/":"https://barnestate-spb.ru/gorodskaya-nedvizhimost/vtorichnaya-nedvizhimost/","/novostroyki/":"https://barnestate-spb.ru/gorodskaya-nedvizhimost/novostroyki/","/kottedzhnye-poselki/":"https://barnestate-spb.ru/zagorodnaya-nedvizhimost/","/barnes-club/":"https://barnestate-spb.ru/barn-estate-club/","/mir-barnes/":"https://barnestate-spb.ru/mir-barn-estate/","/zhilye-kompleksy/":"https://barnestate-spb.ru/zhilye-kompleksy/","/gorodskaya-nedvizhimost/novostroyki/":"https://barnestate-spb.ru/gorodskaya-nedvizhimost/novostroyki/","/gorodskaya-nedvizhimost/vtorichnaya-nedvizhimost/":"https://barnestate-spb.ru/gorodskaya-nedvizhimost/vtorichnaya-nedvizhimost/","/zagorodnaya-nedvizhimost/":"https://barnestate-spb.ru/zagorodnaya-nedvizhimost/","/kommercheskaya-nedvizhimost/":"https://barnestate-spb.ru/kommercheskaya-nedvizhimost/","/kommercheskaya-nedvizhimost/arendovat/":"https://barnestate-spb.ru/kommercheskaya-nedvizhimost/arendovat/","/contacts/":"https://barnestate-spb.ru/contacts/","/sobstvennikam/":"https://barnestate-spb.ru/sobstvennikam/","/prodazha_sobstvennikam/":"https://barnestate-spb.ru/prodazha_sobstvennikam/","/arenda_sobstvennikam/":"https://barnestate-spb.ru/arenda_sobstvennikam/","/exclusive/":"https://barnestate-spb.ru/exclusive/","/team/":"https://barnestate-spb.ru/team/","/vacancies/":"https://barnestate-spb.ru/vacancies/","/mir-barn-estate/":"https://barnestate-spb.ru/mir-barn-estate/","/barn-estate-club/":"https://barnestate-spb.ru/barn-estate-club/","/stily-zhizni/":"https://barnestate-spb.ru/stily-zhizni/","/zhurnaly/":"https://barnestate-spb.ru/zhurnaly/","/altai/":"https://barnestate-spb.ru/altai/","/arhyz/":"https://barnestate-spb.ru/arhyz/","/italiya/":"https://barnestate-spb.ru/italiya/","/portugaliya/":"https://barnestate-spb.ru/portugaliya/","/gorodskaya-nedvizhimost/filter/type_immovables-is-apartamenty/":"https://barnestate-spb.ru/gorodskaya-nedvizhimost/filter/type_immovables-is-apartamenty/","/gorodskaya-nedvizhimost/filter/type_immovables-is-penthausy/":"https://barnestate-spb.ru/gorodskaya-nedvizhimost/filter/type_immovables-is-penthausy/","/kurortnaya/":"https://barn-estate.ru/kurortnaya/","/mezhdunarodnaya-nedvizhimost/":"https://barn-estate.ru/mezhdunarodnaya-nedvizhimost/"};
routes['/']=home;routes['/prodazha_sobstvennikam/']=new URL('./',current.src).href;
const normalized=text=>text.replace(/\s+/g,' ').trim();
function update(){
 for(const link of document.querySelectorAll('a[href]')){
  const raw=link.getAttribute('href');if(!raw||raw.startsWith('#'))continue;
  let url;try{url=new URL(raw,'https://barn-estate.ru')}catch{continue}
  if(!/^(?:www\.)?(?:barn-estate\.ru|barnestate-spb\.ru|barnes-spb\.ru|front\.barnes\.vsavr\.ru)$/.test(url.hostname))continue;
  const destination=routes[url.pathname];if(destination&&link.href!==destination)link.href=destination;
 }
 // The regional menu already has a complete SPb group. Keep one local entry.
 const groups=[...document.querySelectorAll('.site-menu__nav-group,.site-menu__group,.site-footer__column')];
 for(const group of groups){const heading=group.querySelector('.site-menu__nav-title,.site-menu__title,.site-footer__column-title');if(!heading||normalized(heading.textContent).toUpperCase()!=='МОСКВА')continue;
  const sibling=groups.find(other=>other!==group&&(other.parentElement===group.parentElement||group.closest('.site-menu__nav')&&other.closest('.site-menu__nav')===group.closest('.site-menu__nav'))&&normalized(other.querySelector('.site-menu__nav-title,.site-menu__title,.site-footer__column-title')?.textContent||'').toUpperCase()==='САНКТ-ПЕТЕРБУРГ');
  if(sibling){group.replaceWith(sibling)}else{heading.textContent='Санкт-Петербург'}
 }
}
update();new MutationObserver(update).observe(document.body,{childList:true,subtree:true});
})();
