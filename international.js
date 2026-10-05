(() => {
  'use strict'

  const page = document.body
  if (!page.classList.contains('international-page')) return

  if (location.protocol === 'file:') {
    document.querySelectorAll('link[href^="/"], img[src^="/"], source[src^="/"]').forEach((asset) => {
      const attribute = asset.hasAttribute('href') ? 'href' : 'src'
      asset.setAttribute(attribute, '.' + asset.getAttribute(attribute))
    })
    document.querySelectorAll('style').forEach((style) => {
      style.textContent = style.textContent.replace(/url\((['"]?)\//g, 'url($1./')
    })
  }

  const header = document.querySelector('.site-header')
  const menuButton = document.querySelector('.site-header__icon-btn')
  const nav = document.querySelector('.catalog-page-nav')

  const toast = document.createElement('div')
  toast.className = 'international-toast'
  toast.setAttribute('role', 'status')
  document.body.append(toast)

  const showToast = (message) => {
    toast.textContent = message
    toast.classList.add('is-visible')
    window.clearTimeout(showToast.timer)
    showToast.timer = window.setTimeout(() => toast.classList.remove('is-visible'), 2600)
  }

  const menu = document.createElement('aside')
  menu.className = 'international-menu'
  menu.hidden = true
  menu.setAttribute('aria-label', 'Меню BARNES')
  menu.innerHTML = `
    <div class="international-menu__grid">
      <section class="international-menu__group"><h2>Недвижимость</h2>
        <a href="https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost">Зарубежная недвижимость</a>
        <a href="https://front.barnes.vsavr.ru/gorodskaya-nedvizhimost/">Городская недвижимость</a>
        <a href="https://front.barnes.vsavr.ru/zagorodnaya-nedvizhimost/">Загородная недвижимость</a>
      </section>
      <section class="international-menu__group"><h2>Направления</h2>
        <a href="https://front.barnes.vsavr.ru/oae/">ОАЭ</a>
        <a href="https://front.barnes.vsavr.ru/ispaniya/">Испания</a>
        <a href="https://front.barnes.vsavr.ru/italiya/">Италия</a>
        <a href="https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost/turtsiya/">Турция</a>
        <a href="https://front.barnes.vsavr.ru/tailand/">Таиланд</a>
      </section>
      <section class="international-menu__group"><h2>BARNES Moscow</h2>
        <a href="https://front.barnes.vsavr.ru/contacts/">Контакты</a>
        <a href="https://front.barnes.vsavr.ru/team/">Команда</a>
        <a href="https://front.barnes.vsavr.ru/contacts/">Оставить заявку</a>
      </section>
    </div>`
  document.body.append(menu)

  const setMenu = (open) => {
    menu.hidden = !open
    header?.classList.toggle('site-header--menu-open', open)
    menuButton?.setAttribute('aria-expanded', String(open))
    page.classList.toggle('international-menu-open', open)
  }

  menuButton?.setAttribute('aria-expanded', 'false')
  menuButton?.addEventListener('click', () => setMenu(menu.hidden))
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false)
  })

  const updateHeader = () => {
    header?.classList.toggle('site-header--scrolled', window.scrollY > 24)
  }
  window.addEventListener('scroll', updateHeader, { passive: true })
  updateHeader()

  const scrollTo = (selector) => {
    const target = document.querySelector(selector)
    if (!target) return
    const offset = (nav?.getBoundingClientRect().height || 0) + 16
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' })
  }

  const navTargets = [
    '.catalog-best-offers',
    '.catalog-map',
    '.catalog-consultation',
    '.departments-section',
    '.news-section',
  ]
  nav?.querySelectorAll('button').forEach((button, index) => {
    button.addEventListener('click', () => scrollTo(navTargets[index]))
  })

  const sourceCatalogCards = [
    { img: 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/34011/d13733056f669deb3558a833a5d4f8f4/iblock/91f/4495510775ced2087304026.41045680_9043df6b7d_1920.jpg', name: 'Paris-75005', address: 'УГЛОВАЯ КВАРТИРА - ПАРИЖ 5 - ХНРИ IV - 3 СПАЛЬНИ - ОТКРЫТАЯ ПАНОРАМА', price: '230 903 000 ₽', href: 'https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost/prodazha_paris_75005_3018/', lot: 'ID 3049881', stats: [['116 м²', 'Площадь'], ['6', 'Этаж'], ['3', 'Спальни'], ['4', 'Комнаты']] },
    { img: 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/64087/d13733056f669deb3558a833a5d4f8f4/iblock/7cd/16473333956052380764b3e4.94191910_5fc851bcdd_1920.jpg', name: 'Paris-75016', address: 'Париж 16 - Auteuil - Двухуровневая квартира на верхнем этаже', price: '203 738 000 ₽', href: 'https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost/prodazha_paris_75016_5024/', lot: 'ID 5135517', stats: [['207 м²', 'Площадь'], ['5', 'Спален'], ['7', 'Комнаты']] },
    { img: '', name: 'Bordeaux-33000', address: 'Бордо Лаботтьер дом 4 спальни - бассейн с гаражом', price: '152 124 000 ₽', href: 'https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost/prodazha_bordeaux_33000_779/', lot: 'ID 4738214', stats: [['254 м²', 'Площадь'], ['4', 'Спальни'], ['8', 'Комнаты']] },
    { img: 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/51303/d13733056f669deb3558a833a5d4f8/iblock/4a1/7203193646024e8b3029843.10576993_43991f531d_1920.jpg', name: 'Neuilly-sur-Seine-92200', address: 'Нейли-Майри - Дуплексная квартира - 2 спальни - Как небольшой таунхаус - Редкая недвижимость на продажу', price: '54 330 000 ₽', href: 'https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost/prodazha_neuilly_sur_seine_92200_4487/', lot: 'ID 4932857', stats: [['48 м²', 'Площадь'], ['2', 'Этаж'], ['2', 'Спальни'], ['3', 'Комнаты']] },
    { img: 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/31298/d13733056f669deb3558a833a5d4f8/iblock/805/3033171305f2baf28ad9e43.19093458_4a264e3d3b_1920.jpg', name: 'Grasse-06130', address: 'Грас Сен-Жан - Вилла 7 номеров - Частная усадьба - Вид на море и холмы', price: '207 360 000 ₽', href: 'https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost/prodazha_grasse_06130_2417/', lot: 'ID 3833458', stats: [['354 м²', 'Площадь'], ['2', 'Этаж'], ['7', 'Спален'], ['8', 'Комнаты']] },
    { img: 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/61137/d13733056f669deb3558a833a5d4f8/iblock/c0d/14021794465ee9e64985f570.04887924_47f670b202_1920.jpg', name: 'Mougins-06250', address: 'Мужчины - Вилла 7 спален - Вид на горы', price: '249 013 000 ₽', href: 'https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost/prodazha_mougins_06250_6181/', lot: 'ID 3964744', stats: [['340 м²', 'Площадь'], ['6', 'Спален'], ['11', 'Комнаты']] },
    { img: 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/18782/d13733056f669deb3558a833a5d4f8/iblock/dcf/gb177432p426552ndlwb.jpg', name: 'Beau Champ', address: 'Beau Champ - 3-х спальная вилла в престижном районе с видом на море', price: '199 210 000 ₽', href: 'https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost/prodazha_beau_champ_248/', lot: 'ID 177432', stats: [['264 м²', 'Площадь'], ['3', 'Спальни']] },
    { img: 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/39956/d13733056f669deb3558a833a5d4f8/iblock/71d/9199487156023accf301b75.31220516_84de67c1fa_1919.jpg', name: 'Bordeaux-33000', address: 'ЭКСКЛЮЗИВНЫЙ - ДОМ НА ПРОДАЖУ - БОРДО - 3 СПАЛЬНИ - ГЕНЫ СВЯТЫХ - САД', price: '51 794 000 ₽', href: 'https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost/prodazha_bordeaux_33000_3908/', lot: 'ID 4932305', stats: [['132 м²', 'Площадь'], ['1', 'Этаж'], ['3', 'Спальни'], ['4', 'Комнаты']] },
    { img: 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/11027713/d13733056f669deb3558a833a5d4f8/iblock/d67/d6731f6c1fc639fd12f6b79a4903fd50/4969dc62fe2f58db4d11beab6c73c97f.jpg', name: 'Исключительная резиденция - Меганиси, Греция', address: 'Вся инфраструктура', price: '976 823 000 ₽', href: 'https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost/584047/', lot: 'ID 584047', stats: [['1 003 м²', 'Площадь'], ['8', 'Спален']] },
    { img: 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/28658/d13733056f669deb3558a833a5d4f8/iblock/908/17086333105cc0375b30b316.91168265_490d96ed05_1280.jpg', name: 'Barcelona', address: 'Барселона - Готика - Квартира - 86 м² - 2 спальни', price: '62 479 000 ₽', href: 'https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost/prodazha_barcelona_1977/', lot: 'ID 2944801', stats: [['96 м²', 'Площадь'], ['1', 'Этаж'], ['2', 'Спальни'], ['2', 'Комнаты']] },
    { img: 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/58287/d13733056f669deb3558a833a5d4f8/iblock/e43/15273994055fa3dfc8bdb424.89697791_27fcf9c0e3_1920.jpg', name: 'Saint-Gervais-les-Bains-74170', address: 'СВЯТОЙ ГЕРВЕ - ДОМ 330 М2 - ЦЕНТРАЛЬНАЯ ДЕРЕВНЯ С САДОМ', price: '108 660 000 ₽', href: 'https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost/prodazha_saint_gervais_les_bains_74170_5726/', lot: 'ID 4319713', stats: [['332 м²', 'Площадь'], ['10', 'Спален'], ['13', 'Комнаты']] },
    { img: 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/37391/df2a5158440fbae38fa1e23df1e2b3d5/iblock/c86/14315719365d19fbecb612e4.44463093_2baa8f656e_1920.webp', name: 'Porto Cervo', address: 'Квартира с видом на море и садом', price: '54 330 000 ₽', href: 'https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost/prodazha_porto_cervo_3545/', lot: 'ID 3177535', stats: [['87 м²', 'Площадь'], ['1', 'Этаж'], ['2', 'Спальни'], ['2', 'Комнаты']] },
  ]

  sourceCatalogCards.splice(0, sourceCatalogCards.length,
    { img: 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/33551/d13733056f669deb3558a833a5d4f8f4/iblock/b60/panoramasexkluzivmodernvilla84738177_1500_1000.jpeg', name: 'Budapest III. kerülete', address: 'Эксклюзивная современная вилла с панорамным видом', price: 'Цена по запросу', href: 'https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost/prodazha_budapest_iii_ker_lete_2946/', lot: 'ID 4019510', stats: [['344 м²', 'Площадь'], ['3', 'Этаж'], ['4', 'Спальни'], ['6', 'Комнаты']] },
    { img: 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/63522/d13733056f669deb3558a833a5d4f8f4/iblock/34c/6412761805eb1301f4519f3.48191392_18604ea477_1920.jpg', name: 'Lyon-69004', address: 'Лион 4ème - Круа Рус - 81 м² квартира, подлежащая установке', price: '36 129 000 ₽', href: 'https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost/prodazha_lyon_69004_4747/', lot: 'ID 3659949', stats: [['81 м²', 'Площадь'], ['3', 'Комнаты']] },
    { img: '', name: 'Porto', address: 'Т2, резиденция Санта Катарина, Порто.', price: '55 054 000 ₽', href: 'https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost/prodazha_porto_675/', lot: 'ID 3431780', stats: [['123 м²', 'Площадь'], ['2', 'Спальни'], ['3', 'Комнаты']] },
    { img: 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/42319/d13733056f669deb3558a833a5d4f8f4/iblock/b9a/20091012655fc7796ee3a7d2.37405420_3eec4d3505_1024.jpg', name: 'Sotogrande', address: 'Фантастическая вилла в отличном состоянии', price: '108 207 000 ₽', href: 'https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost/prodazha_sotogrande_4340/', lot: 'ID 4618374', stats: [['347 м²', 'Площадь'], ['4', 'Спальни'], ['5', 'Комнаты']] },
    { img: 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/30839/d13733056f669deb3558a833a5d4f8f4/iblock/bfd/6759097205ed90c9d8ddff1.65479012_0ae0d5e451_1920.jpg', name: 'Saint-Gervais-les-Bains-74170', address: 'Рассылка BARNES!', price: '23 090 000 ₽', href: 'https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost/prodazha_saint_gervais_les_bains_74170_2360/', lot: 'ID 2800751', stats: [['41 м²', 'Площадь'], ['2', 'Комнаты']] },
    { img: 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/60569/d13733056f669deb3558a833a5d4f8f4/iblock/e21/1830353810605b203bbd0db5.27145254_ccf6d2680f_1920.jpg', name: 'Combloux-74920', address: 'Недавнее шале с бассейном с видом на Монблан.', price: '235 431 000 ₽', href: 'https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost/prodazha_combloux_74920_6067/', lot: 'ID 2962101', stats: [['307 м²', 'Площадь'], ['3', 'Этаж'], ['7', 'Спален'], ['9', 'Комнаты']] },
    { img: 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/18300/d13733056f669deb3558a833a5d4f8f4/iblock/869/13142749035e4ac6654c10f3.42649652_42a843d0d6_1920.jpg', name: 'Marbella', address: "Невероятный дуплексный пентхаус в заповеднике Сьерра Бланка - 'Золотая миля'.", price: '534 247 000 ₽', href: 'https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost/prodazha_marbella_165/', lot: 'ID 3620118', stats: [['1 102 м²', 'Площадь'], ['2', 'Этаж'], ['5', 'Спален'], ['20', 'Комнаты']] },
    { img: 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/39520/d13733056f669deb3558a833a5d4f8f4/iblock/16f/5201695505f156ca9c2f4d1.29209714_76a30fd411_1920.jpg', name: 'Mougins-06250', address: 'МУГИНСЫ - ВИЛЛА С ОТДЕЛЬНОЙ КВАРТИРОЙ - 6 СПАЛЕН', price: '125 865 000 ₽', href: 'https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost/prodazha_mougins_06250_3853/', lot: 'ID 3973533', stats: [['204 м²', 'Площадь'], ['1', 'Этаж'], ['6', 'Спален'], ['5', 'Комнаты']] },
    { img: 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/11019573/d13733056f669deb3558a833a5d4f8f4/iblock/d8c/d8c89f58b4639f78b32b636858695e0e/ee46b76f1790e610e6e12a9b04191e20.jpg', name: '2-спальные апартаменты в Caspian Dream Liner', address: 'Вся инфраструктура', price: '90 258 938 ₽', href: 'https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost/582265/', lot: 'ID 582265', stats: [['127 м²', 'Площадь'], ['2', 'Спальни']] },
    { img: 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/28093/d13733056f669deb3558a833a5d4f8f4/iblock/ba7/1511364343602cf7afd3bd90.64552802_2cbf615535_1920.jpg', name: 'Versailles-78000', address: 'Версаль Нотр-Дам - семейный дом 19 века площадью 188 м² с садом - Уникальное местоположение.', price: '176 573 000 ₽', href: 'https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost/prodazha_versailles_78000_1923/', lot: 'ID 4819352', stats: [['186 м²', 'Площадь'], ['3', 'Этаж'], ['5', 'Спален'], ['8', 'Комнаты']] },
    { img: 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/57730/d13733056f669deb3558a833a5d4f8f4/iblock/f7e/10811202205f720ee047abf8.80453983_a53e79b0aa_1920.jpg', name: 'Marseille-13002', address: 'продажа - марсель 2ème - апартаменты пульон - 3 спальни - терраса -', price: '71 987 000 ₽', href: 'https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost/prodazha_marseille_13002_5640/', lot: 'ID 4322996', stats: [['115 м²', 'Площадь'], ['3', 'Спальни'], ['4', 'Комнаты']] },
    { img: 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/36892/d13733056f669deb3558a833a5d4f8f4/iblock/d33/16228755456027d785df8666.15632876_07b4b95b41_1600.jpg', name: 'Paris-75004', address: 'Квартира Продажа - Париж 4 - Сен-Поль - Площадь Вогезов - Эксклюзивность', price: '193 325 000 ₽', href: 'https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost/prodazha_paris_75004_3468/', lot: 'ID 4839652', stats: [['129 м²', 'Площадь'], ['3', 'Спальни'], ['4', 'Комнаты']] },
  )

  sourceCatalogCards.splice(0, sourceCatalogCards.length,
    { img: 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/28551/df2a5158440fbae38fa1e23df1e2b3d5/iblock/693/16234220605faa5fec9ca565.42364691_17a5bc920b_1920.webp', name: 'Sainte-Lucie-de-Porto-Vecchio-20144', address: 'КАППИЦИОЛА - 4 СТРОИТЕЛЬСКИЙ ВИЛЛА - МОРСКОЙ ВИЛЛА - 200 м от пивоварни', price: '162 085 000 ₽', href: 'https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost/prodazha_sainte_lucie_de_porto_vecchio_20144_1961/', lot: 'ID 4462681', stats: [['140 м²', 'Площадь'], ['1', 'Этаж'], ['3', 'Спальни'], ['7', 'Комнаты']] },
    { img: 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/58155/d13733056f669deb3558a833a5d4f8f4/iblock/1ce/11295498460195903501c25.50948740_e2e599c3b3_1919.jpg', name: 'Urrugne-64122', address: 'УРН, ОЧАРОВАТЕЛЬНЫЙ ДОМ В ТИХОМ РАЙОНЕ', price: '105 581 000 ₽', href: 'https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost/prodazha_urrugne_64122_5703/', lot: 'ID 4282250', stats: [['200 м²', 'Площадь'], ['1', 'Этаж'], ['5', 'Спален'], ['5', 'Комнаты']] },
    { img: 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/37327/d13733056f669deb3558a833a5d4f8f4/iblock/6bf/5847709405f24360d5be643.53032911_b1ecb122ba_1920.jpg', name: "L'Aigle-61300", address: "В самом сердце города Л'Айгль, особняк площадью 250 м² и 6 комнат на участке площадью 526 м².", price: '45 094 000 ₽', href: 'https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost/prodazha_l_aigle_61300_3518/', lot: 'ID 3930226', stats: [['250 м²', 'Площадь'], ['2', 'Этаж'], ['10', 'Комнаты']] },
    { img: 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/10987042/d13733056f669deb3558a833a5d4f8f4/iblock/f10/f106f86a6f464715658e162891d52eb1/be860936917df1a1a9e1c6a1879421bd.jpg', name: 'Manisa Villas Bangjo – Pasak', address: 'Вся инфраструктура', price: '46 512 492 ₽', href: 'https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost/561772/', lot: 'ID 561772', stats: [['269 м²', 'Площадь'], ['3', 'Спальни'], ['3', 'Комнаты']] },
    { img: 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/25356/d13733056f669deb3558a833a5d4f8f4/iblock/bdf/2768138215fdb56809de233.49431675_1c0f5a1279_1276.jpg', name: 'Marrakech', address: 'Великолепный дворец', price: '89 644 000 ₽', href: 'https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost/prodazha_marrakech_1388/', lot: 'ID 4694018', stats: [['365 м²', 'Площадь'], ['13', 'Комнаты']] },
    { img: 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/55210/d13733056f669deb3558a833a5d4f8f4/iblock/af1/12484643635e7de13b5510e1.02927896_3e672aec09_1920.jpg', name: 'Cascais', address: 'Вилла с 5 спальнями, Кашкайш', price: '199 210 000 ₽', href: 'https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost/prodazha_cascais_5199/', lot: 'ID 3819002', stats: [['364 м²', 'Площадь'], ['5', 'Спален'], ['6', 'Комнаты']] },
    { img: 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/34633/d13733056f669deb3558a833a5d4f8f4/iblock/82e/1526943123605cbdea1d6d66.52151180_7ed1e6e67a_1920.jpg', name: 'Bougival-78380', address: 'Сте Барнс - Бугиваль 134 м² Архитектурный дом с 2015 г.', price: '104 132 000 ₽', href: 'https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost/prodazha_bougival_78380_3104/', lot: 'ID 5180596', stats: [['134 м²', 'Площадь'], ['4', 'Спальни'], ['6', 'Комнаты']] },
    { img: 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/8623636/d13733056f669deb3558a833a5d4f8/iblock/8ed/1.jpg', name: '1300 Brickell Bay D, Miami', address: '1300 Brickell Bay Dr, Miami', price: 'Цена по запросу', href: 'https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost/1300-brickell-bay-d-miami/', lot: 'ID 0', stats: [['220 м²', 'Площадь'], ['38', 'Этаж'], ['3', 'Спальни'], ['4', 'Комнаты']] },
    { img: '', name: 'Paris-75007', address: 'Paris 7ème - Исключительная собственность', price: '769 678 000 ₽', href: 'https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost/prodazha_paris_75007_894/', lot: 'ID 5177367', stats: [['464 м²', 'Площадь'], ['6', 'Спален'], ['7', 'Комнаты']] },
    { img: 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/52172/d13733056f669deb3558a833a5d4f8f4/iblock/e17/8708582745e2a7a90a53757.37683421_e528f95673_1920.jpg', name: 'Maisons-Laffitte-78600', address: 'Продается квартира - Домовладельцы - Лафит - 5 спален - 219 кв.м. (219 кв.м.)', price: '112 282 000 ₽', href: 'https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost/prodazha_maisons_laffitte_78600_4628/', lot: 'ID 3221600', stats: [['226 м²', 'Площадь'], ['2', 'Этаж'], ['5', 'Спален'], ['10', 'Комнаты']] },
    { img: 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/32024/d13733056f669deb3558a833a5d4f8f4/iblock/3a0/19413925235f7c4a820bf929.77426004_1920.jpg', name: 'Madrid', address: 'Мадрид 28010 - Альмагро - Роскошные апартаменты в новом здании с 2 спальнями', price: '201 474 000 ₽', href: 'https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost/prodazha_madrid_2521/', lot: 'ID 3324982', stats: [['314 м²', 'Площадь'], ['4', 'Этаж'], ['2', 'Спальни'], ['3', 'Комнаты']] },
    { img: 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/61924/d13733056f669deb3558a833a5d4f8f4/iblock/9ff/138412117604903b7e14e62.55017427_69375ac9ac_1920.jpg', name: 'Monte Estoril', address: '4-х комнатная квартира с видом на море', price: '71 019 000 ₽', href: 'https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost/prodazha_monte_estoril_6319/', lot: 'ID 5113340', stats: [['151 м²', 'Площадь'], ['13', 'Этаж'], ['4', 'Спальни'], ['5', 'Комнаты']] },
  )

  const syncSourcePageData = () => {
    document.querySelectorAll('.catalog-grid__item').forEach((item, index) => {
      const data = sourceCatalogCards[index]
      if (!data) return
      item.querySelector('.apartment-card__media-link')?.setAttribute('href', data.href)
      item.querySelector('.apartment-card__name--link')?.setAttribute('href', data.href)
      item.querySelector('.apartment-card__detail-btn')?.setAttribute('href', data.href)
      const image = item.querySelector('.apartment-card__image')
      if (data.img) {
        if (!image) {
          const nextImage = document.createElement('img')
          nextImage.className = 'apartment-card__image'
          item.querySelector('.apartment-card__media-link')?.append(nextImage)
        }
        const nextImage = item.querySelector('.apartment-card__image')
        nextImage.src = data.img
        nextImage.alt = data.name
      } else {
        image?.remove()
      }
      const name = item.querySelector('.apartment-card__name-text')
      if (name) name.textContent = data.name
      const address = item.querySelector('.apartment-card__address')
      if (address) address.textContent = data.address
      const price = item.querySelector('.apartment-card__price')
      if (price) price.textContent = data.price
      const lot = item.querySelector('.apartment-card__lotid')
      if (lot) lot.textContent = data.lot
      const stats = item.querySelector('.apartment-card__stats')
      if (stats) {
        stats.style.setProperty('--stats-count', String(data.stats.length))
        stats.innerHTML = data.stats.map(([value, label]) => '<div class="apartment-card__stat"><b class="apartment-card__stat-value">' + value + '</b><small class="apartment-card__stat-label">' + label + '</small></div>').join('')
        stats.querySelectorAll('*').forEach((node) => node.setAttribute('data-v-80c326fb', ''))
      }
    })

    document.querySelectorAll('a').forEach((link) => {
      if (link.closest('.international-menu')) return
      const href = link.getAttribute('href')
      if (href?.startsWith('https://barn-estate.ru/')) link.setAttribute('href', href.replace('https://barn-estate.ru', 'https://front.barnes.vsavr.ru'))
      else if (href && !href.includes(':') && !href.startsWith('//')) link.setAttribute('href', new URL(href, 'https://front.barnes.vsavr.ru').href)
    })
  }

  const catalogInner = document.querySelector('.catalog-grid__inner')
  if (catalogInner && !catalogInner.querySelector('.catalog-quick-filters')) {
    const quickFilters = document.createElement('div')
    quickFilters.className = 'catalog-quick-filters'
    quickFilters.setAttribute('aria-label', 'Быстрые фильтры')
    quickFilters.setAttribute('data-v-5a2b3b97', '')
    quickFilters.setAttribute('data-v-6fd45cc6', '')
    quickFilters.innerHTML = ['Тип недвижимости', 'Цена ₽', 'Страны', 'Общая площадь', 'Комнаты'].map((label) => '<div class="catalog-quick-filters__item" data-v-6fd45cc6><button type="button" class="catalog-quick-filters__button" aria-expanded="false" aria-haspopup="true" data-v-6fd45cc6><span class="catalog-quick-filters__label" data-v-6fd45cc6>' + label + '</span><span class="catalog-quick-filters__value" data-v-6fd45cc6>Не выбрано</span><span class="catalog-quick-filters__chevron" aria-hidden="true" data-v-6fd45cc6></span></button></div>').join('')
    catalogInner.querySelector('.catalog-grid__header')?.after(quickFilters)
  }

  syncSourcePageData()

  const bestOffers = document.querySelector('.catalog-best-offers')
  const offerItems = [
    ['https://front.barnes.vsavr.ru/zhilye-kompleksy/zhemchuzhina-stambula-v-kygytkhane/', 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/9682332/50c67a0738bb1843e93eec7710536d7b/iblock/4bc/pyoq5gkg0qj03x3h2k15682sij7nmlw8/2.3.jpeg', 'Жемчужина Стамбула в Кыгытхане', 'Стамбул', 'Цена по запросу'],
    ['https://front.barnes.vsavr.ru/zhilye-kompleksy/al-jurf-gardens-/', 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/iblock/039/0395030729d5073ce642d246a9a4f6f9/3a8b2f35f0f0ac0d0d647e54e043a3ed.jpeg', 'AL JURF GARDENS', 'Дубай', 'Цена по запросу'],
    ['https://front.barnes.vsavr.ru/zhilye-kompleksy/amazi-salalah/', 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/iblock/5f5/5f5825870604d427e45f0f174fcd12dc/7c727a309e816ccfe4aacda7f0347575.png', 'AMAZI SALALAH', 'Салала', 'Цена по запросу'],
    ['https://front.barnes.vsavr.ru/zhilye-kompleksy/artlife-kempinski-residences/', 'https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/iblock/e4e/e4eb0768a98b051888b1e8b3022ae153/5a3e61b48390c8dcd6bfe320b01e86d1.jpg', 'ARTLIFE KEMPINSKI RESIDENCES', 'Ереван', 'от 400 000 ₽'],
  ]
  if (bestOffers && !bestOffers.querySelector('.international-offer-rendered')) {
    const sliderWrap = bestOffers.querySelector('.catalog-best-offers__slider-wrap')
    const slider = document.createElement('div')
    slider.className = 'splide catalog-best-offers__slider international-offer-rendered'
    slider.setAttribute('data-v-08286baa', '')
    slider.setAttribute('aria-label', 'Новые старты ЖК')
    slider.innerHTML = '<div class="splide__track"><ul class="splide__list"></ul></div>'
    const list = slider.querySelector('.splide__list')
    offerItems.forEach(([href, src, name, place, price], index) => {
      const slide = document.createElement('li')
      slide.className = 'splide__slide international-offer-card' + (index === 0 ? ' is-active is-visible' : index === 1 ? ' is-visible is-next' : '')
      slide.setAttribute('data-v-08286baa', '')
      slide.setAttribute('data-v-80c326fb', '')
      slide.innerHTML = '<article class="apartment-card"><a class="apartment-card__link" href="' + href + '"><div class="apartment-card__media"><img class="apartment-card__image" src="' + src + '" alt=" ' + name + '" loading="lazy"></div><div class="apartment-card__body"><p class="apartment-card__name"> ' + name + '</p><p class="apartment-card__address">' + place + '</p><div class="apartment-card__details"><div class="apartment-card__price-row"><p class="apartment-card__price">' + price + '</p></div></div></div></a></article>'
      slide.querySelector('article')?.setAttribute('data-v-08286baa', '')
      slide.querySelectorAll('*').forEach((node) => node.setAttribute('data-v-80c326fb', ''))
      list?.append(slide)
    })
    sliderWrap?.append(slider)
    const positionOfferSlider = () => {
      if (!list || !sliderWrap) return
      const active = list.querySelector('.splide__slide.is-active')
      if (!active) return
      const gap = Number.parseFloat(getComputedStyle(sliderWrap).getPropertyValue('--catalog-best-offers-gap')) || 0
      list.querySelectorAll('.splide__slide').forEach((slide) => { slide.style.marginRight = gap + 'px' })
      const wrapRect = sliderWrap.getBoundingClientRect()
      const activeRect = active.getBoundingClientRect()
      const targetLeft = window.innerWidth / 2 - activeRect.width / 2
      list.style.transform = 'translateX(' + (targetLeft - activeRect.left) + 'px)'
    }
    positionOfferSlider()
    window.addEventListener('resize', positionOfferSlider, { passive: true })
  }

  const news = document.querySelector('.news-section')
  if (news && !news.querySelector('.international-news-grid')) {
    news.querySelector('.news-section__inner > span')?.remove()
    const newsItems = [
      ['https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/11174655/8f5ddbc1f811f957fe777caaf9cef323/iblock/9a9/9a9041c1611692076e767fdcd4a2fb6d/32bb1c09e2de90b389dcf4bd8cfa3802.png', 'Forbes обновил мировой рейтинг городов по числу миллиардеров: Москва опустилась на третье место', 'https://front.barnes.vsavr.ru/media/novosti/forbes-obnovil-mirovoy-reyting-gorodov-po-chislu-milliarderov-moskva-opustilas-na-trete-mesto/'],
      ['https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/11174656/8f5ddbc1f811f957fe777caaf9cef323/iblock/48e/48e3fba91f6bfc920f2e2c77244dcf82/8b67d18cf8e818fb793c259ffb3fed78.png', 'Инвестиции в туризм Алтайского края выросли в полтора раза за год', 'https://front.barnes.vsavr.ru/media/novosti/investitsii-v-turizm-altayskogo-kraya-vyrosli-v-poltora-raza-za-god/'],
      ['https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/11174654/8f5ddbc1f811f957fe777caaf9cef323/iblock/753/753a5fd832550d48dca46a89a654e6e9/f65d8dbc17c559c5df2fd4ac4d1c0c94.png', 'Москва вошла в топ-5 городов мира по ценам на элитное жилье', 'https://front.barnes.vsavr.ru/media/novosti/moskva-voshla-v-top-5-gorodov-mira-po-tsenam-na-elitnoe-zhile/'],
      ['https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/11138184/8f5ddbc1f811f957fe777caaf9cef323/iblock/090/0901ea8a8fe1ab26001aa935c0442cea/f19bce520e61659e0feb1844a98319ae.png', 'Состоятельные покупатели стимулируют рынок брендовой недвижимости в Дубае', 'https://front.barnes.vsavr.ru/media/novosti/sostoyatelnye-pokupateli-stimuliruyut-rynok-brendovoy-nedvizhimosti-v-dubae/'],
      ['https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/11183306/8f5ddbc1f811f957fe777caaf9cef323/iblock/a3f/a3f9a05b430280e2897d887fbf6bfe12/764e3d4bccb6027b30366e2f2bf025d2.jpg', 'Стоимость недвижимости делюкс-сегмента выросла в третьем квартале 2024', 'https://front.barnes.vsavr.ru/media/novosti/stoimost-nedvizhimosti-delyuks-segmenta-vyrosla-v-tretem-kvartale-2024/'],
      ['https://c15d3839-d361-4fb8-9615-0c7a980d0169.selstorage.ru/resize_cache/11177242/8f5ddbc1f811f957fe777caaf9cef323/iblock/1d1/1d19c59186122a2d4c2b21fa848f77ac/32b04ebf9a2af2e54c68f782cb58f3f9.png', 'Опубликован рейтинг городов по уровню ресторанного обслуживания', 'https://front.barnes.vsavr.ru/media/novosti/opublikovan-reyting-gorodov-po-urovnyu-restorannogo-obsluzhivaniya/'],
    ]
    const grid = document.createElement('div')
    grid.className = 'international-news-grid'
    newsItems.forEach(([src, title, href]) => {
      const card = document.createElement('article')
      card.className = 'international-news-card news-section__card'
      card.innerHTML = `<a class="news-section__card-link" href="${href}"><img class="news-section__image" src="${src}" alt="${title}" loading="lazy"><div class="news-section__content"><p class="news-section__category">${title}</p><span class="news-section__read-more">Читать подробнее</span></div></a>`
      grid.append(card)
    })
    news.querySelector('.news-section__header')?.after(grid)
  }

  const heroSearch = document.querySelector('.catalog-hero-filters__search-input')
  const submitSearch = document.querySelector('.catalog-hero-filters__submit')
  const catalog = document.querySelector('.catalog-grid')
  const cards = [...document.querySelectorAll('.apartment-card--catalog')]

  const applySearch = () => {
    const query = heroSearch?.value.trim().toLocaleLowerCase('ru') || ''
    let matches = 0
    cards.forEach((card) => {
      const visible = !query || card.textContent.toLocaleLowerCase('ru').includes(query)
      card.closest('.catalog-grid__item')?.classList.toggle('is-filtered', !visible)
      if (visible) matches += 1
    })
    if (catalog) scrollTo('.catalog-grid')
    showToast(query ? `Найдено объектов: ${matches}` : 'Показаны все объекты')
  }

  heroSearch?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      applySearch()
    }
  })
  submitSearch?.addEventListener('click', applySearch)

  const sort = document.querySelector('.catalog-grid__sort-select')
  sort?.addEventListener('change', () => {
    const items = [...document.querySelectorAll('.catalog-grid__item')]
    const direction = sort.value.includes('desc') || sort.value.includes('high') ? -1 : 1
    if (!sort.value || sort.selectedIndex === 0) return
    const value = (item) => Number((item.textContent.match(/[\d\s]+\s₽/)?.[0] || '0').replace(/\D/g, ''))
    items.sort((a, b) => (value(a) - value(b)) * direction).forEach((item) => item.parentElement.append(item))
  })

  document.querySelectorAll('.catalog-quick-filters__button').forEach((button) => {
    button.addEventListener('click', () => {
      const value = button.querySelector('.catalog-quick-filters__value')
      if (!value) return
      value.textContent = value.textContent === 'Не выбрано' ? 'Выбрано' : 'Не выбрано'
      button.classList.toggle('is-selected')
    })
  })

  const offerRow = document.querySelector('.catalog-best-offers__slider-row')
  document.querySelectorAll('.catalog-best-offers__nav-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const delta = button.classList.contains('catalog-best-offers__nav-btn--prev') ? -1 : 1
      offerRow?.scrollBy({ left: delta * Math.max(320, offerRow.clientWidth * .6), behavior: 'smooth' })
    })
  })

  document.querySelectorAll('.catalog-faq__question').forEach((question) => {
    const item = question.closest('.catalog-faq__item')
    const answer = item?.querySelector('.catalog-faq__answer')
    question.setAttribute('aria-expanded', String(!answer?.hidden))
    question.addEventListener('click', () => {
      if (!answer) return
      answer.hidden = !answer.hidden
      question.setAttribute('aria-expanded', String(!answer.hidden))
      item?.classList.toggle('is-open', !answer.hidden)
    })
  })

  const map = document.querySelector('.catalog-map')
  if (map && !map.querySelector('.international-map-fallback')) {
    const viewport = document.createElement('div')
    viewport.className = 'catalog-projects-map'
    viewport.setAttribute('aria-label', 'Карта объектов BARNES')
    viewport.innerHTML = `<div class="international-map-fallback"></div><div class="international-map-yandex" aria-hidden="true"></div><div class="international-map-markers" aria-live="polite"></div><div class="international-map-zoom" aria-label="Управление масштабом"><button type="button" data-map-zoom="in" aria-label="Увеличить карту">+</button><button type="button" data-map-zoom="out" aria-label="Уменьшить карту">−</button></div><div class="international-map-controls"><label><span class="international-map-search-icon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5"></circle><path d="m20 20-3.5-3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path></svg></span><input type="search" placeholder="Поиск в видимой области" aria-label="Поиск в видимой области"></label><button type="button" data-map-fullscreen>На весь экран</button></div><div class="international-map-popup" hidden><button type="button" class="international-map-popup__close" aria-label="Закрыть карточку">×</button><p class="international-map-popup__kicker">Направление BARNES</p><h3></h3><p></p><a href="#catalog-contact">Подробнее ↗</a></div>`
    map.append(viewport)
    const markers = viewport.querySelector('.international-map-markers')
    const popup = viewport.querySelector('.international-map-popup')
    const search = viewport.querySelector('input[type="search"]')
    const fallback = viewport.querySelector('.international-map-fallback')
    const yandexRoot = viewport.querySelector('.international-map-yandex')
    const remoteMapFrame = document.createElement('iframe')
    remoteMapFrame.className = 'international-map-remote'
    remoteMapFrame.title = 'Карта объектов BARNES'
    remoteMapFrame.loading = 'eager'
    remoteMapFrame.src = 'https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost'
    const positionRemoteMapFrame = () => {
      const pageTop = viewport.getBoundingClientRect().top + window.scrollY
      remoteMapFrame.style.width = `${window.innerWidth}px`
      remoteMapFrame.style.height = `${Math.max(document.body.scrollHeight, pageTop + 300)}px`
      remoteMapFrame.style.left = '0px'
      remoteMapFrame.style.top = `${-pageTop}px`
    }
    positionRemoteMapFrame()
    window.addEventListener('resize', positionRemoteMapFrame)
    remoteMapFrame.addEventListener('load', () => {
      viewport.classList.add('international-map--remote-ready')
      fallback.style.opacity = '0'
      if (yandexRoot) yandexRoot.style.display = 'none'
    }, { once: true })
    viewport.insertBefore(remoteMapFrame, yandexRoot || markers)
    viewport.querySelector('.international-map-popup a')?.setAttribute('href', 'https://front.barnes.vsavr.ru/contacts/')
    const places = [
      ['pin', 'Москва', 'Россия', 47.25, 81.91],
      ['pin', 'Москва', 'Россия', 60.73, 14.38],
      ['pin', 'Москва', 'Россия', 46.99, 28.48],
      ['cluster', 'Объекты BARNES', '792 объекта', 48.26, 22.91, '792'],
      ['cluster', 'Объекты BARNES', '39 объектов', 48.84, 32.19, '39'],
      ['cluster', 'Объекты BARNES', '9 объектов', 35.09, 41.47, '9'],
      ['cluster', 'Объекты BARNES', '19 объектов', 62.84, 73.01, '19'],
      ['cluster', 'Объекты BARNES', '15 объектов', 55.87, 50.37, '15'],
      ['cluster', 'Объекты BARNES', '8 объектов', 52.17, 36.27, '8'],
      ['cluster', 'Объекты BARNES', '6 объектов', 53.38, 28.85, '6'],
      ['cluster', 'Объекты BARNES', '6 объектов', 65.49, 91.56, '6'],
    ]
    places.forEach(([type, name, country, x, y, count]) => {
      const marker = document.createElement('button')
      marker.className = type === 'cluster' ? 'international-map-cluster' : 'international-map-marker'
      marker.type = 'button'
      marker.style.left = `${x}%`
      marker.style.top = `${y}%`
      marker.dataset.search = `${name} ${country}`.toLocaleLowerCase('ru')
      marker.setAttribute('aria-label', `${name}, ${country}`)
      if (count) marker.textContent = count
      marker.addEventListener('click', () => {
        popup.querySelector('h3').textContent = name
        popup.querySelector('p:not(.international-map-popup__kicker)').textContent = country
        popup.hidden = false
      })
      markers.append(marker)
    })
    popup.querySelector('.international-map-popup__close').addEventListener('click', () => { popup.hidden = true })
    search.addEventListener('input', () => {
      const query = search.value.trim().toLocaleLowerCase('ru')
      markers.querySelectorAll('.international-map-marker').forEach((marker) => {
        marker.hidden = Boolean(query) && !marker.dataset.search.includes(query)
      })
    })
    viewport.querySelector('[data-map-fullscreen]').addEventListener('click', (event) => {
      const fullscreen = viewport.classList.toggle('international-map--fullscreen')
      event.currentTarget.textContent = fullscreen ? 'Свернуть' : 'На весь экран'
    })
    let mapInstance = null
    const loadYandexMap = async () => {
      if (!window.ymaps3) {
        let script = document.querySelector('script[data-barnes-yandex-map]')
        if (!script) {
          script = document.createElement('script')
          script.dataset.barnesYandexMap = 'true'
          script.src = 'https://api-maps.yandex.ru/v3/?apikey=eb19bd7a-97ea-4903-8f5b-ab24c1115a63&lang=ru_RU'
          document.head.append(script)
        }
        await new Promise((resolve, reject) => {
          script.addEventListener('load', resolve, { once: true })
          script.addEventListener('error', reject, { once: true })
        })
      }
      await window.ymaps3.ready
      const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer } = window.ymaps3
      if (!YMap || !YMapDefaultSchemeLayer || !yandexRoot) return
      mapInstance = new YMap(yandexRoot, {
        location: { center: [37.618423, 55.751244], zoom: 11 },
        mode: 'vector',
      })
      mapInstance.addChild(new YMapDefaultSchemeLayer())
      if (YMapDefaultFeaturesLayer) mapInstance.addChild(new YMapDefaultFeaturesLayer({ zIndex: 1800 }))
      fallback.style.opacity = '0'
    }
    loadYandexMap().catch(() => {})
    let scale = 1
    viewport.querySelectorAll('[data-map-zoom]').forEach((button) => {
      button.addEventListener('click', () => {
        if (mapInstance?.setLocation) {
          const currentZoom = mapInstance.zoom ?? 11
          mapInstance.setLocation({ zoom: Math.min(15, Math.max(7, currentZoom + (button.dataset.mapZoom === 'in' ? 1 : -1))) })
          return
        }
        scale = Math.min(1.4, Math.max(.85, scale + (button.dataset.mapZoom === 'in' ? .12 : -.12)))
        fallback.style.transform = `scale(${scale})`
      })
    })
  }

  document.querySelectorAll('.apartment-card__favorite').forEach((button) => {
    button.addEventListener('click', () => {
      const active = button.getAttribute('aria-pressed') === 'true'
      button.setAttribute('aria-pressed', String(!active))
      button.setAttribute('aria-label', active ? 'Добавить в избранное' : 'Удалить из избранного')
    })
  })

  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault()
      const button = form.querySelector('button[type="submit"]')
      if (!button) return
      const label = button.textContent
      button.textContent = 'Заявка отправлена'
      button.disabled = true
      window.setTimeout(() => {
        button.textContent = label
        button.disabled = false
      }, 2400)
    })
  })

  document.querySelectorAll('.floating-expert__close').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation()
      button.closest('.floating-expert')?.remove()
    })
  })
})()
