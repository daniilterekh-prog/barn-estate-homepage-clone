/* City catalogue snapshot, 2026-10-12: 4 projects + 12 lots from the saved city page. */
window.BarnesCityMapProjects = [
  {
    "name": "Татум",
    "href": "https://barn-estate.ru/zhilye-kompleksy/start-prodazh-obrucheva-27/",
    "image": "../assets/c714d4a43087da62.jpg",
    "type": "rc",
    "price": "от 20 500 000 ₽",
    "priceRub": 20500000
  },
  {
    "name": "Палашевский 11",
    "href": "https://barn-estate.ru/zhilye-kompleksy/start-prodazh-palashevskiy-11/",
    "image": "../assets/084b2b6f06e71057.jpg",
    "type": "rc",
    "price": "Цена по запросу",
    "priceRub": null
  },
  {
    "name": "Новая 11",
    "href": "https://barn-estate.ru/zhilye-kompleksy/novaya-11/",
    "image": "../assets/040420c4b252e01e.jpg",
    "type": "rc",
    "price": "от 30 000 000 ₽",
    "priceRub": 30000000
  },
  {
    "name": "Вавилова 64",
    "href": "https://barn-estate.ru/zhilye-kompleksy/vavilova-64/",
    "image": "../assets/7781fce4e8048ef7.jpg",
    "type": "rc",
    "price": "Цена по запросу",
    "priceRub": null
  },
  {
    "name": "Просторный 3-уровневый таунхаус в ЖК «Берег Столицы»",
    "href": "https://barn-estate.ru/vtorichnaya-nedvizhimost/595261/",
    "image": "../assets/e10d5cf935dc2e4c.jpeg",
    "type": "lot",
    "price": "275 000 000 ₽",
    "priceRub": 275000000
  },
  {
    "name": "Уникальный 2-уровневый пентхаус с террасой",
    "href": "https://barn-estate.ru/vtorichnaya-nedvizhimost/588036/",
    "image": "../assets/1e2dd8c5d60e6a8c.jpg",
    "type": "lot",
    "price": "1 254 177 000 ₽",
    "priceRub": 1254177000
  },
  {
    "name": "Стильная 4-комнатная квартира в ЖК Victory Park Residences",
    "href": "https://barn-estate.ru/vtorichnaya-nedvizhimost/586963/",
    "image": "../assets/f6b69a68d3dc5b84.png",
    "type": "lot",
    "price": "240 000 000 ₽",
    "priceRub": 240000000
  },
  {
    "name": "Дизайнерская квартира в ЖК «Весковский 3»",
    "href": "https://barn-estate.ru/vtorichnaya-nedvizhimost/559839/",
    "image": "../assets/594482a7a9c71ba0.jpeg",
    "type": "lot",
    "price": "130 000 000 ₽",
    "priceRub": 130000000
  },
  {
    "name": "Просторный апартамент в клубном ЖК класса de luxe «Дом в Газетном»",
    "href": "https://barn-estate.ru/vtorichnaya-nedvizhimost/587550/",
    "image": "../assets/54aefcc2d6a3ad61.jpg",
    "type": "lot",
    "price": "289 607 500 ₽",
    "priceRub": 289607500
  },
  {
    "name": "Комфортная 2-комнатная квартира в премиальном ЖК «Полянка/44»",
    "href": "https://barn-estate.ru/vtorichnaya-nedvizhimost/575547/",
    "image": "../assets/dad5ee437891fb59.jpg",
    "type": "lot",
    "price": "153 979 200 ₽",
    "priceRub": 153979200
  },
  {
    "name": "Дизайнерская квартира в камерном доме «Пресненский Вал 14»",
    "href": "https://barn-estate.ru/vtorichnaya-nedvizhimost/594075/",
    "image": "../assets/a412283d63954d09.jpg",
    "type": "lot",
    "price": "67 490 000 ₽",
    "priceRub": 67490000
  },
  {
    "name": "Chkalov",
    "href": "https://barn-estate.ru/vtorichnaya-nedvizhimost/583777/",
    "image": "../assets/80933b4c042ba784.jpg",
    "type": "lot",
    "price": "55 092 000 ₽",
    "priceRub": 55092000
  },
  {
    "name": "Изысканная и просторная квартира в клубном доме премиум-класса «Афанасьевский»",
    "href": "https://barn-estate.ru/vtorichnaya-nedvizhimost/572242/",
    "image": "../assets/e8f9f87c7f81dc15.jpg",
    "type": "lot",
    "price": "400 000 000 ₽",
    "priceRub": 400000000
  },
  {
    "name": "Просторная 5-комнатная квартира с террасой в премиальном комплексе Savvin River Residence в Хамовниках на набережной Москвы-реки",
    "href": "https://barn-estate.ru/vtorichnaya-nedvizhimost/585820/",
    "image": "../assets/dcbf59bef9c1e1ff.jpg",
    "type": "lot",
    "price": "800 000 000 ₽",
    "priceRub": 800000000
  },
  {
    "name": "Уникальный 5-уровневый пентхаус в премиальном ЖК «Венский дом» в Хамовниках",
    "href": "https://barn-estate.ru/vtorichnaya-nedvizhimost/584908/",
    "image": "../assets/94ce2169b9d1b8f4.jpg",
    "type": "lot",
    "price": "Цена по запросу",
    "priceRub": null
  },
  {
    "name": "Отличная 2-комнатная квартира в ЖК Headliner",
    "href": "https://barn-estate.ru/vtorichnaya-nedvizhimost/593405/",
    "image": "../assets/46731dbe5fe00ce5.jpg",
    "type": "lot",
    "price": "32 000 000 ₽",
    "priceRub": 32000000
  }
].map(function (item) {
  item.image = new URL(item.image, document.currentScript.src).href;
  return item;
});

