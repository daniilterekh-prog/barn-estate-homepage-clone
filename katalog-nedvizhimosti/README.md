# Каталог недвижимости — UI-kit v1.0.0

[Готовая страница](https://daniilterekh-prog.github.io/barn-estate-homepage-clone/katalog-nedvizhimosti/?direction=city).

Общие компоненты приведены к утверждённому киту главной от 01.11.2026: `barnes-sites/main-site/pages/home/exact-2026-10-21`, tag `barn-estate-home-reference-v1.0.0`, commit `90f0bac`. [Manifest и контрольные суммы](kit-v1/sources.json). Историческое происхождение каталога и ассетов сохранено в [kit-sources.json](kit-sources.json) и [reference-shell/sources.json](reference-shell/sources.json); каноническая библиотека исходных ассетов — barnes-assets.

## Что перенесено

- Типографика Tilda Sans, H1 каталога 32 px / clamp(38px, 4vw, 58px), метаданные карточки 13/18 px, цвета, отступы, контейнер 1920 px и gutter 22 px на телефоне.
- Кнопки: радиус 1 px, обычное начертание, общие CTA 70/58 px. Подробные карточки сохраняют компактные действия 54 px; в карточках уже 340 px действия стоят друг под другом.
- Sticky-хэдер с заявкой при прокрутке, логотип по центру на телефоне/планшете, панель WhatsApp/MAX/Telegram/звонок. Полное выдвижное меню с направлениями, собственниками и нижними ссылками сохранено.
- Новый footer BARN Estate, актуальный режим работы, плавающий эксперт, общий квиз и контактный шаг с контекстом объекта.
- Светлые полные фильтры и общий доступный dropdown департамента. Пять направлений меняют свои наборы полей.

Специальная композиция каталога: от 1024 px две строки. Сверху «Покупка / Аренда», департамент, отдельный список «Новостройки / Вторичная» и поиск. Ниже все четыре контекстных быстрых поля: локация, тип, стоимость, спальни либо площадь; рядом полная форма. На телефоне рынок стоит перед сеткой 2×2, поиск после неё. Рынок применяется к покупке городской/курортной/зарубежной недвижимости; для аренды и направлений без исходной классификации рынка поле скрыто. Выдача, карта и URL используют общую сделку. Сортировка и карта относятся к результатам; кнопка избранного под фильтрами скрыта на всех ширинах. 37 записей из сохранённых источников, без вымышленных арендных объектов.

## Модули и интеграция формы

Семь общих CSS/JS-файлов скопированы без изменений в `kit-v1/`. Из автономного блока 17 извлечён только runtime квиза; пути локальных портретов перебазированы. Footer взят из блока 15, эксперт — из 16. Изменения, необходимые каталогу, находятся в `catalog-kit-v1.css/js`, `catalog-filters.css`, `catalog-active-filters.js`, `listing.js` и существующем dropdown-модуле; главная не менялась. Новые зависимости не установлены. Изображения, шрифты и уведомления о лицензиях сохранены рядом; Splide runtime не подключается.

Общие CTA открывают вопросы о задаче/направлении/бюджете, кнопка карточки — сразу контакты с названием и URL объекта. После проверки имени, телефона и согласия форма генерирует отменяемое событие `barn:lead` с `detail.data`, `form` и `status`. Данные содержат `quizAnswers`, канал, URL страницы и департамент; для объекта — `objectId`, `objectTitle`, `objectUrl`. Интеграция CRM должна обработать событие, вызвать `preventDefault()` и показать подтверждение только после успешного ответа сервера. В текущем превью отправка не подключена: пользователю явно показывается «Данные не отправлены». Контактные ссылки открывают выбранный канал; заявки тестами не отправляются.

## Проверки

Скрипты используют установленный Playwright и Chrome; пути можно передать через окружение. `BARNES_CATALOG_URL` задаёт локальный или публичный URL.

```sh
node katalog-nedvizhimosti/tools/check_catalog.cjs
node katalog-nedvizhimosti/tools/check_catalog_toolbar.cjs
node katalog-nedvizhimosti/tools/check_kit_v1.cjs
```

Результаты — в [verification/](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification): 34 сценария каталога, 55 сочетаний панели, 15 ширин 320–2560 и контракты нового кита, реальные клавиатурные действия dropdown, формы/ошибки/контекст/возврат фокуса, axe WCAG A/AA, отсутствие ошибок загрузки. Квиз проверяется с синтетическими данными и без отправки. Публичная проверка после публикации сохраняется отдельно в `verification/live/`.

[План переноса](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/PLAN.md). Рабочие исходники и отчёты также сохраняются в приватном `barnes-sites/katalog-nedvizhimosti/`; этот репозиторий — публичное GitHub Pages превью.

## Общий переключатель рынка — 01.11.2026

«Новостройки» и «Вторичная» объединены общей рамкой высотой 64 px; выбранный сегмент выделен мягким фоном #f9f3f3, фирменным текстом и тонкой бордовой обводкой. В направлениях со сделкой так же группируются «Купить / Снять». Сохранены две строки, размеры текста, `aria-pressed` и существующие обработчики. Компонент оформлен локальным CSS поверх утверждённого кита, без новых библиотек.

## Размеренная панель фильтров — 01.11.2026

[Композиция и план](FILTERS-DESIGN.md). Белая панель с одной сеткой, прямоугольными полями и спокойным выбранным состоянием из кита. Лишние пиктограммы быстрых полей убраны; основная кнопка — «Все фильтры». Подборки вынесены в отдельную компактную строку, сброс подписан, сортировка относится к результатам. Департамент остаётся первым. До 767 px параметры доступны в полной форме; индикатор на кнопке считает выбранные группы. Карточки, общие блоки и исходная палитра сохранены. Новые зависимости не установлены.

Проверено: 34 сценария каталога; 55 сочетаний пяти направлений и 11 ширин 320–2560; применение и сброс параметров на телефоне, счётчик, поиск, сортировка/подборки и axe. Общие контракты кита, квиз и меню повторно прошли прежние проверки. `verification/two-row-toolbar.json` содержит актуальный результат новой композиции; `verification/market-segments.json` сохранён как история предыдущего варианта.

[Проверка новой панели на публичной странице](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-refined/README.md): 55 сочетаний направления/ширины, мобильная форма, счётчик, сортировка и подборки — успешно после публикации `ba71300`.


## Переходы в хэдере — 02.11.2026

Девять ссылок на страницы сайта стоят отдельной строкой под логотипом: городская, загородная, коммерческая, курортная, зарубежная, Санкт-Петербург, медиа, о BARN Estate и собственникам. Сохранены исходные адреса страниц и типографика кита. Строка видна на всех ширинах и при прокрутке страницы; когда места мало, прокручивается только сама навигация. Текст не сжимается и не переносится. Ссылки имеют высоту 44 px; фокус с клавиатуры раскрывает ссылку целиком. При открытии полного меню строка скрывается, сохраняя исходную геометрию меню.

Первый вариант строки проверен до восстановления подпунктов: [проверка навигации](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/navigation/navigation.json): 15 ширин 320–2560, обычный и закреплённый хэдер, отсутствие пересечений верхних кнопок/логотипа и горизонтального переполнения страницы, Tab до последней ссылки, бургер, изменение ширины и Escape. Axe WCAG A/AA — без нарушений в хэдере на 390/1440 px; ошибок JavaScript и HTTP нет. Снимки: [телефон](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/navigation/navigation-390.png), [планшет](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/navigation/navigation-1024.png), [десктоп](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/navigation/navigation-1440.png), [полное меню](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/navigation/menu-390.png).

[Проверка навигации на публичной странице](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-navigation/README.md): 15 ширин, закреплённый хэдер, клавиатура и бургер — успешно после публикации `bf1fff2`.


## Выпадающие подразделы хедера — 02.11.2026

Удалена лишняя нижняя линия под строкой переходов. Восстановлены девять выпадающих списков из утверждённой главной: 56 ссылок с теми же названиями и адресами. [Снимок данных референса](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/dropdowns/homepage-reference.json) и [происхождение](reference-shell/sources.json). Данные встроены в HTML, обработчики — `header-navigation.js`, оформление — локальный CSS-адаптер. Новых зависимостей нет.

Наведение и фокус открывают подразделы. На телефоне первое касание открывает список, повторное касание названия переходит на страницу раздела; ссылки внутри работают сразу. Стрелки, Home/End, Tab и Escape доступны с клавиатуры; Escape возвращает фокус к разделу. Списки закрываются при клике снаружи, прокрутке страницы, смене ширины и открытии бургера. Белая панель вынесена из горизонтального скроллера, ограничена размером экрана и прокручивается по высоте в альбомном режиме.

[Проверка](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/dropdowns/dropdowns.json): все девять разделов на 10 ширинах 320–2560 px, переход курсора из названия в список, границы экрана, закреплённый хэдер, бургер, клавиатура, касания и альбомный экран. Axe WCAG A/AA проверен с открытым списком на 390/1440 px; ошибок JavaScript и HTTP нет. Предыдущая проверка строки выше сохранена как история. Снимки: [десктоп](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/dropdowns/city-1440.png), [узкий экран](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/dropdowns/city-390.png), [зарубежная](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/dropdowns/international-1440.png), [касание на телефоне](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/dropdowns/touch-390.png).

[Проверка выпадающих подразделов на публичной странице](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-dropdowns/README.md): все девять разделов на 390/1440 px, наведение, касания, клавиатура и бургер — успешно после публикации `44779af`.


## Карта текущей выдачи — 02.11.2026

Кнопка «На карте» с контурной SVG-иконкой находится рядом с сортировкой; на телефоне — слева от счётчика и сортировки. Открывает полноэкранный вид из узла «Курортная»: панель объектов 420 px слева, крестик/zoom справа и нижняя раскрывающаяся шторка до 540 px. [Решение и план](MAP-DESIGN.md), [источники и SHA](map-view/sources.json).

`listing.js` публикует единый снимок отфильтрованной и отсортированной выдачи **до пагинации** через `BarnesCatalogListing.getSnapshot()` и `barn:catalog-results`. `catalog-map.js` использует только этот снимок: свои названия, фотографии, цены и ссылки всех пяти направлений, включая лоты вторички/аренды. В карте можно менять направление, рынок/сделку, поиск и сортировку; они обновляют каталог и URL. Подборки и избранное учитываются. Кнопка параметров открывает ту же контекстную форму фильтров поверх карты; состояние и фокус корректно возвращаются.

Исходный CSS fullscreen-режима перенесён без изменений в `map-view/reference-map.css`; адаптация и кнопка — `catalog-map.css`. Снимок курортной содержал вшитые чужие метки, поэтому фон заменён на чистый локальный снимок OpenStreetMap. [Атрибуция и лицензия](map-view/LICENSE.md) сохранены в изображении и интерфейсе. Карта остаётся **статичным предпросмотром**, как в референсе; zoom масштабирует изображение. В исходных 37 записях нет подтверждённых координат, точки объектов не выдумываются. Живой геокодер/API и новые runtime-библиотеки не подключены; внешних запросов тайлов на странице нет.

Проверка: `node katalog-nedvizhimosti/tools/check_catalog_map.cjs`; [результат и снимки](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/map/map.json). Пять направлений × оба режима, точный состав/порядок, выдача за первыми шестью карточками, поиск/сортировка/сброс/пустая выдача, подборки/избранное, общие фильтры, вложенные диалоги, Escape/Tab/фокус, zoom, повторное открытие, загрузка/ошибка/retry, 10 ширин 320–2560 и короткие portrait/landscape. Axe проверен в карте на 390/1440 px и во вложенной мобильной форме. Дополнительно повторены 34 сценария основного каталога. Серверные заявки не отправляются.

[Проверка карты на опубликованной странице](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-map/README.md): 15 групп, все пять направлений, 10 ширин, общие фильтры и мобильная шторка — успешно после публикации `8a43cdc`.


## Облегчённый первый слой — 02.11.2026

[Решение и план](FILTERS-SIMPLIFICATION.md). Убраны внешняя рамка с внутренними отступами и постоянный ряд подборок. Быстрыми остались локация и стоимость; тип, спальни/площадь и подборки перенесены в полную форму. «Все фильтры» оформлены вторичным контурным действием из кита. Направление первое, общий shape рынка/сделки, размеры, шрифты и палитра сохранены.

`catalog-active-filters.js` отображает выбранные условия из единого снимка выдачи. Они появляются только при выборе, удаляются отдельно с сохранением остальных полей и возвратом фокуса. Длинные подписи сокращаются визуально, полный текст доступен в названии кнопки. В общей форме добавлены радиокнопки спален, подборки и диапазоны площади; Apply/Cancel/Reset работают с общим состоянием и картой. Новых библиотек нет.

Проверки: [55 сочетаний направления/ширины](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/light-filters/toolbar.json), [условия и полная форма](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/light-filters/active-filters.json), [34 сценария каталога](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/light-filters/core-regression.json), [15 групп карты](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/light-filters/map-regression.json). Проверены клавиатура, `4+`, Apply/Cancel/URL, независимое удаление условий и фокус, длинные подписи на 320 px, отсутствие переполнения и axe с открытой формой/выбранными условиями на 390/1440 px. Ошибок JavaScript и HTTP нет. Предыдущие отчёты композиции сохранены как история.

```sh
node katalog-nedvizhimosti/tools/check_catalog_active_filters.cjs
```

[Публичная проверка облегчённых фильтров](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-light-filters/README.md): 55 сочетаний направления/ширины, отмена/удаление условий, карта и клавиатура — успешно после публикации `ad82dbd`.


## Мобильный хэдер и быстрые параметры — 02.11.2026

[План и измерения](MOBILE-HEADER-FILTERS.md). По уточнению пользователя исправлен именно хэдер. До 767 px убрана дополнительная строка навигации; все разделы остаются в полном бургере. Геометрия совпадает с главной: до 540 px логотип 36 px и шапка 77 px, на 541–767 px — 48/111 px, burger 44 px, штатные gutters. На белом фоне используется тёмный ink. Контакты появляются после 48 px прокрутки и в меню; четыре канала, Escape/возврат фокуса и клики поверх меню работают. Реальная высота верхней строки отслеживается при resize.

На телефоне возвращены **все четыре быстрых поля**: локация, тип, стоимость, спальни либо площадь — по текущему направлению. Сетка 2×2 в общем контуре без горизонтальной прокрутки. Направление и общий shape рынка/сделки первые, затем параметры, поиск и полная форма. DOM и порядок Tab совпадают с этой компоновкой; при ширине от 768 px поиск возвращается в исходную desktop/tablet-строку. Карточки и облегчённая desktop-панель сохранены.

[Сравнение и touch-проверки](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/mobile-header-filters/mobile.json): пять точных сравнений с главной, 25 сочетаний направления/ширины, все dropdown, menu/contacts/focus/Escape/resize, граница 767/768 и axe. [Измеренный референс](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/mobile-header-filters/home-reference.json). Повторены 34 сценария каталога, 55 сочетаний панели, контракты кита и выбранные условия; отчёты рядом. Новых библиотек нет.

```sh
node katalog-nedvizhimosti/tools/check_catalog_mobile.cjs
```

[Публичная проверка мобильной шапки и четырёх быстрых параметров](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-mobile/README.md): размеры главной,25touch-сочетаний,контакты/меню/resize и клавиатура — успешно после публикации `a237573`.


## Мобильная строка результатов — 02.11.2026

До 767 px постоянная кнопка «Избранное» под фильтрами скрыта. «На карте» расположена слева; справа количество проектов/объектов, под ним сортировка. Desktop/tablet-композиция от 768 px сохраняется. Изменение локализовано в `catalog-map.css`; логика карты, сортировки и сохранённых объектов остаётся общей.

[Проверка](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/mobile-results/results-summary.json): 30 сочетаний пяти направлений и ширин 320/390/540/767/768/1440; отсутствие пересечений и переполнения, правое выравнивание счётчика/сортировки, работа карты/сортировки/возврата фокуса и axe. Ошибок JavaScript/HTTP нет. [Телефон](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/mobile-results/summary-390.png), [desktop](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/mobile-results/summary-1440.png).

[Публичная проверка мобильной строки результатов](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-mobile-results/README.md): 30 адаптивных сочетаний, карта, сортировка и axe — успешно после публикации `cd00435`.


## Один мобильный хэдер — 02.11.2026

До 767 px оставлен только второй, компактный вариант шапки: бургер, логотип по центру и раскрытие контактов справа. Он доступен сразу сверху и сохраняется при прокрутке; прежний порог 48 px отменён. Это уточнение заменяет описание переключения состояний в предыдущем разделе. Геометрия и полный бургер сохранены; от 768 px поведение не изменено.

[Проверка](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/single-mobile-header/mobile.json): пять ширин, одна шапка без изменения высоты и состава при прокрутке, контакты/меню/Escape/Tab/resize, 25 сочетаний четырёх быстрых фильтров и пяти направлений, desktop-переключение и axe. [Телефон](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/single-mobile-header/filters-390.png), [контакты в меню](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/single-mobile-header/menu-contacts-390.png).

[Публичная проверка единственного мобильного хедера](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-single-mobile-header/README.md): исходники совпали, контакты/прокрутка и desktop проверены после публикации `2f59c0c`.


## Вертикальное выравнивание быстрых фильтров — 02.11.2026

До 767 px снят унаследованный `top:5px` у текста четырёх быстрых фильтров. Текст выровнен по вертикальному центру кнопки; существующие стрелки, сетка, размеры и desktop-стили сохранены. [Проверка 30 сочетаний](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/mobile-filter-center/report.json): пять направлений и 320/390/540/767/768/1440px, центр текста с точностью до1px, выбранное значение и отсутствие overflow. [Мобильный блок](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/mobile-filter-center/filters-390.png).

[Публичная проверка центрирования текста](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-mobile-filter-center/report.json): 30 сочетаний, выбранное значение и desktop прошли; [HTML/CSS совпадают с исходниками](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-mobile-filter-center/deployment.json).


## Сделка, рынок и четыре быстрых поля — 03.11.2026

По уточнению пользователя «Тип» и «Спальни» возвращены в основную desktop-панель. Главный переключатель теперь «Покупка / Аренда» во всех направлениях, а рынок — отдельный раскрывающийся список в том же стиле кита. Цены аренды помесячные, при смене сделки сбрасываются несовместимые ценовые диапазоны. Выбор рынка сохраняется при возврате к покупке; URL/reload и полноэкранная карта синхронизированы. Кнопка избранного со счётчиком под фильтрами скрыта; SVG карты перерисован и оптически выровнен. Предыдущие разделы про два поля описывают историю до этого изменения. [Решение и файлы](DEAL-MARKET.md).

[Проверки сделки/рынка](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/deal-market/deal-market.json): реальные ID, месячные цены, выбор типа/спален, рынок/URL/reload, общая карта, клавиатура/Escape/фокус, 55 сочетаний пяти направлений и11ширин320–3840px без наложений/overflow, axe mobile/desktop. Дополнительно прошли [34 сценария каталога](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/deal-market/checks.json), [55 проверок панели](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/deal-market/two-row-toolbar.json), [карта](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/deal-market/map.json) и [выбранные условия](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/deal-market/active-filters.json). [Desktop](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/deal-market/panel-1440.png), [tablet](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/deal-market/panel-768.png), [телефон](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/deal-market/panel-390.png).

```sh
node katalog-nedvizhimosti/tools/check_catalog_deal_market.cjs
```

[Публичная проверка покупки/аренды, рынка и четырёх полей](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-deal-market/deal-market.json): 55 сочетаний, реальные ID, карта/URL/reload, тип/спальни и axe прошли после публикации; [шесть файлов совпадают с исходниками](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-deal-market/deployment.json).


## Сделка первым полем и центрирование — 03.11.2026

По новому уточнению «Покупка / Аренда» перенесены перед департаментом в DOM и визуальном порядке на всех ширинах. Desktop-ширины колонок переставлены вместе с элементами. Текст и стрелки четырёх быстрых полей центрируются flex-компоновкой без унаследованных относительных/абсолютных сдвигов. Высота подписей адаптируется к одной или двум строкам; длинный выбранный тип на320px остаётся по центру и не выходит за поле.

[Проверка](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/order-center/deal-market.json): 55 сочетаний направлений/ширин, центр подписей и стрелок с точностью до1px, порядок сделки/департамента, отсутствие наложений/overflow; сохраняются проверки сделки/рынка, URL, карты, клавиатуры и axe. [Desktop](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/order-center/panel-1440.png), [телефон](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/order-center/panel-390.png), [две строки на320px](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/order-center/wrapped-320.png).

[Публичная проверка порядка сделки/департамента и вертикального центра](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-order-center/order-center.json): 8 ширин и двухстрочное выбранное значение прошли после публикации; [HTML/CSS совпадают с исходниками](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-order-center/deployment.json).


## Раскрытие меню наведением — 03.11.2026

Подменю «Городская», «Загородная», «Медиа» и остальных разделов открываются по фактическому наведению мыши/пера (`pointerenter`), независимо от первичного сенсорного режима браузера. Убрана блокировка по `hover:hover`. Первый touch-tap раскрывает список, второй следует ссылке; обычный клик мышью и Enter сохраняют URL раздела. Переход мыши в подменю отменяет закрытие; уход закрывает с прежней задержкой180ms. Клавиатурное открытие, Arrow/Home/End, Escape и возврат фокуса сохранены.

[Проверка](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/header-hover/hover.json): 72 сочетания девяти разделов, четырёх ширин768/1024/1440/1920 и двух режимов ввода; все раскрываются без клика и выводят исходные ссылки в пределах экрана. Проверены переход курсора/уход, sticky, бургер, клавиатура, клики мышью, два touch-tap и мобильное меню390px. JavaScript/HTTP ошибок нет. [Медиа при наведении](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/header-hover/media-hover-1440.png).

```sh
node katalog-nedvizhimosti/tools/check_header_hover.cjs
```

[Публичная проверка раскрытия меню наведением](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-header-hover/hover.json): 72 сочетания разделов/ширин/ввода, mouse/hybrid hover, клавиатура, sticky и touch прошли после публикации; [HTML/JS совпадают с исходниками](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-header-hover/deployment.json).


## Хэдер по главной — 03.11.2026

Отступ между линией и направлениями26px; строка меню16/18px вместо растянутых44px. Восстановлены исходные desktop-burger33px, подпись «Москва», ширины/интервалы, компактное состояние после48px и tablet-бургер до1280px. Логотип48/36px, контакты24px, мобильный toggle44px/иконка29px и CTA44px сверены с главной. Цвета взяты из белого состояния главной; геометрия бургера и панели контактов совпадает. В полном меню исправлена подпись BARN Estate Club. На мобильном остаётся один ранее выбранный компактный вариант. [Разбор, размеры и границы сравнения](HEADER-HOME-PARITY.md). Этот раздел заменяет старое описание постоянной строки направлений на tablet и при прокрутке.

[Проверка](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/header-home-parity/parity.json): 28 состояний14ширин320–3840px, геометрия/типографика/ссылки и белая палитра главной, порог48/49, отсутствие сдвигов scroll anchor, CTA/квиз/Escape, доступность фильтров под прозрачным резервом высоты, все9подменю, полный бургер/контакты390/1024/1440px и axe. [Наведение мышью и гибридный ввод](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/header-home-parity/hover.json):72сочетания. [До исправления](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/header-home-parity/before-summary.json), [источник и SHA](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/header-home-parity/reference-source.json).

[Строгий Pixelmatch](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/header-home-parity/pixels/pixel.json): для воспроизводимости выключен LCD text, динамический счётчик маскирован, top-white нормализован к белому фону каталога. Пять из6снимков совпали полностью; на1440px top-white остаётся45пикселей сглаживания Telegram при идентичных SVG. Это сохранено как ненулевой результат, без заявления о полном raw-pixel совпадении с фотографическим hero. [Каталог1440](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/header-home-parity/catalog-top-1440.png), [компактный390](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/header-home-parity/catalog-scrolled-390.png), [нормализованный референс](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/header-home-parity/pixels/home-top-white-1440.png), [diff](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/header-home-parity/pixels/diff-top-white-1440.png).

```sh
node katalog-nedvizhimosti/tools/check_header_home_parity.cjs
node katalog-nedvizhimosti/tools/check_header_hover.cjs
node katalog-nedvizhimosti/tools/check_header_pixels.cjs
```

Pixelmatch используется только для проверки, из установленного Toolkit; [источник](https://github.com/mapbox/pixelmatch), фактическая версия записана в pixel.json. Новых UI-библиотек/зависимостей нет.

[Публичная сверка хедера с главной](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-header-home-parity/parity.json): 28 состояний14ширин, отступ26px, порог48px,9подменю, бургер/контакты/CTA и axe прошли после публикации; [четыре runtime-файла совпадают с исходниками](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-header-home-parity/deployment.json).


## Быстрые фильтры без повторного заголовка — 03.11.2026

В раскрытии четырёх контекстных быстрых полей скрыта дополнительная строка с названием и крестиком: список сразу начинается с вариантов. Доступное имя popup/listbox сохранено, выбор закрывает список с возвратом фокуса; работают Escape, Tab и клик снаружи. Общий popup переключает режим при открытии обычных select департамента/рынка/сортировки, их заголовки сохранены.

[Проверка](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/quick-options/quick-options.json):40списков (4поля ×5направлений ×390/1440px), варианты и запись в состояние, закрытие/фокус, отсутствие выхода за экран, восстановление обычного select и axe. [Телефон](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/quick-options/road-390.png), [desktop](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/quick-options/road-1440.png).

[Публичная проверка быстрых списков без повторного заголовка](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-quick-options/quick-options.json): 40списков, выбор/состояние, закрытие/Escape/фокус и axe прошли после публикации; [HTML/CSS/JS совпадают с исходниками](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-quick-options/deployment.json).


## Постоянный сброс фильтров — 03.11.2026

Кнопка «Сбросить фильтры» постоянно видна справа под основной панелью, в том числе до первого выбора и после очистки. Повторно используется общий reset каталога/карты: очищаются локация, тип, цена, площадь/спальни, числовые границы, подборки, поисковая строка и режим «только избранное». Департамент, покупка/аренда, текущий рынок и сортировка сохраняются как контекст. Сохранённые объекты избранного не удаляются.

Пустая группа выбранных условий не занимает место. На телефоне условия переносятся отдельной строкой, кнопка остаётся справа. Высота кнопки36px, предусмотрен видимый фокус; после сброса элемент не исчезает и фокус сохраняется. Новая тяжёлая панель или дублирующий обработчик не добавлены.

[Проверка](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/permanent-reset/reset.json):20сочетаний пяти направлений и320/390/768/1440px, постоянная видимость, очистка всех критериев/поиска, сохранение контекста и исходных ID выдачи, Enter/фокус, карта и axe. [Выбранные условия и расширенная форма](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/permanent-reset/active-filters.json) проверены отдельно. [Телефон](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/permanent-reset/reset-390.png), [desktop](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/permanent-reset/reset-1440.png).

[Публичная проверка постоянной кнопки сброса фильтров](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-permanent-reset/reset.json): 20 сочетаний, очистка поиска/критериев, сохранение контекста, фокус, карта и axe прошли после публикации; [четыре runtime-файла совпадают с исходниками](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-permanent-reset/deployment.json).


## Стабильная сетка быстрых фильтров — 03.11.2026

При одной ширине экрана переключение департамента или сделки больше не меняет ширину и высоту общих полей: «Покупка / Аренда», департамент, четыре быстрых параметра и «Все фильтры». На десктопе используется единая сетка из четырёх колонок; если рынок не применим, поиск занимает его колонку и собственную, без пустого места. Ширина остальных колонок сохраняется. Минимум департамента — 200px, чтобы помещалось «Коммерческая»; на узких планшетах уменьшены только внутренние отступы и шрифт поля рынка, чтобы не обрезать «Новостройки». Адаптивные высоты остаются 64px на десктопе/планшете и 58px на телефоне. Новые зависимости не добавлены.

[Проверка геометрии](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/stable-filter-grid/geometry.json): 130состояний — 13ширин 320–3840px × 5департаментов × 2сделки, одинаковые размеры общих полей, отсутствие обрезания подписей департамента/рынка и переполнения. [Регрессия панели](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/stable-filter-grid/two-row-toolbar.json): 55сочетаний, поиск/сброс, полная форма, сортировка, выбранные условия и axe прошли. Снимки: [390px](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/stable-filter-grid/filters-390.png), [1024px](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/stable-filter-grid/filters-1024.png), [1440px](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/stable-filter-grid/filters-1440.png).

[Публичная проверка стабильной сетки фильтров](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-stable-filter-grid/geometry.json): 40 состояний: размеры общих полей сохраняются между пятью департаментами и двумя сделками на390/768/1024/1440px; подписи не обрезаются, переполнения нет; [HTML и CSS совпадают с исходниками](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-stable-filter-grid/deployment.json).


## Насыщенность сделки и департамента — 03.11.2026

По запросу пользователя текст «Покупка / Аренда» и выбранного департамента облегчён с 400 до 300. Поле рынка сохраняет своё начертание. [Проверка](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/filter-weight/weight.json): 8 состояний городской/загородной на 390/768/1024/1440px; computed font-weight 300, размеры полей и кегль совпадают с замерами до правки, ошибок JavaScript нет. Новых зависимостей нет.

[Публичная проверка насыщенности 300 для сделки и департамента](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-filter-weight/weight.json): 8 состояний городской/загородной на 390/768/1024/1440px: начертание 300, геометрия полей и кегль сохранены; [HTML и CSS совпадают с исходниками](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-filter-weight/deployment.json).


## Департамент «Москва» — 03.11.2026

Название «Городская» заменено на «Москва» в выборе департамента, списке направлений карты и доступном уведомлении о переключении. Внутреннее значение и URL остаются `city`; параметры городской недвижимости и результаты сохранены. [Проверка](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/moscow-label/label.json): выбор через настоящий dropdown, подпись поля/карты и URL на 390/1440px, без ошибок JavaScript. Новых зависимостей нет.

[Публичная проверка названия департамента «Москва»](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-moscow-label/label.json): Название «Москва» проверено в поле, dropdown, карте и уведомлении, URL city сохранён на 390/1440px; [HTML и два JS-модуля совпадают с исходниками](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-moscow-label/deployment.json).


## Типографика по новому киту — 03.11.2026

[Полная сверка, изменения и проверки](TYPOGRAPHY-AUDIT.md). Поля фильтров используют --home-field: 17/18/20px; полная форма — заголовок 20/24px и чипы 16px; раскрытые списки 18px. Сохранены 300 у сделки и департамента, размеры карточек и исходная геометрия панели. Общие блоки совпадают с актуальной главной. Пустая выдача использует роли компактного заголовка и основного описания; устранён остаточный тёмный фон под текстом выбранного чипа. Новые зависимости не добавлены.

Проверено: 12 ширин 320–3840px и 24 раскрытых состояния, 130 проверок стабильности геометрии, 55 сочетаний панели, общие контракты кита/квиза/карточек, длинные выбранные условия и axe. [Результаты](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/typography-kit/audit.json).

[Публичная проверка типографики по новому киту](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-typography-kit/audit.json): 12 ширин 320–3840px и 24 состояния: токены полей, H1/карточек/CTA, меню/квиз/общие блоки, выбранные условия и пустая выдача совпадают с проверенным контрактом; [HTML и два CSS-модуля совпадают с исходниками](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-typography-kit/deployment.json).


## Департамент без повторного заголовка — 03.11.2026

В dropdown департамента убрана верхняя строка с подписью «Департамент недвижимости» и крестиком: список начинается сразу с пяти направлений. Доступные имена диалога/списка и кнопки сохранены. Выбор, Escape с возвратом фокуса, клик снаружи и заголовки рынка/сортировки [проверены на 390/1440px](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/department-options/options.json). Новые зависимости не добавлены.

[Публичная проверка списка департамента без заголовка](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-department-options/options.json): На 390/1440px нет повторного заголовка департамента, выбор и закрытие работают, доступные имена сохранены; [HTML и JS-модуль совпадают с исходниками](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-department-options/deployment.json).


## Текст dropdown по левому краю поля — 03.11.2026

Варианты департамента, рынка и четырёх быстрых полей начинаются ровно под текстом кнопки. Геометрия popup вычисляет отступ от фактического начала подписи: учитываются рамки, адаптивные padding и смещение списка у края экрана. Заголовок рынка выровнен так же; у департамента по-прежнему только варианты. Сортировка сохраняет своё выравнивание. Шрифты и размеры полей не менялись. Новых зависимостей нет.

[Проверка](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/dropdown-alignment/alignment.json): 36 списков на 320/390/768/1024/1440/1920px, края текста каждого варианта и видимого заголовка совпадают с полем с допуском 0,5px; переполнения нет. [Выбор/закрытие/фокус](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/dropdown-alignment/behavior.json) прошли на 390/1440px. Снимки: [телефон](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/dropdown-alignment/dropdown-390.png), [десктоп](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/dropdown-alignment/dropdown-1440.png). [Исходные сдвиги](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/dropdown-alignment/before.json).

[Публичная проверка выравнивания текста dropdown](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-dropdown-alignment/alignment.json): 36 списков на 320–1920px: текст вариантов и заголовков совпадает по левому краю с подписью поля, переполнения нет; [HTML, CSS и JS-модуль совпадают с исходниками](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-dropdown-alignment/deployment.json).


## Сделка: заливка половины общего блока — 03.11.2026

В «Покупка / Аренда» убраны внутренний padding группы и рамка активного варианта. Две равные половины заполняют всю внутреннюю область общей рамки; активная половина имеет сплошную мягкую заливку #f9f3f3 и бордовый текст. Сохраняются внешние размеры 58/64px, общая рамка, начертание 300, доступный фокус и обработчики выбора. Новых зависимостей нет.

[Проверка](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/deal-halves/halves.json): 24 состояния Москвы/загородной, покупка/аренда, 320/390/768/1024/1440/1920px. Половины равны, нет внутренних рамок/зазоров, заливка занимает всю высоту, URL и клавиатура работают, axe без нарушений. Снимки: [покупка 390px](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/deal-halves/deal-buy-390.png), [аренда 390px](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/deal-halves/deal-rent-390.png), [покупка 1440px](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/deal-halves/deal-buy-1440.png), [аренда 1440px](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/deal-halves/deal-rent-1440.png).

[Публичная проверка заливки половины переключателя сделки](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-deal-halves/halves.json): 24 состояния на 320–1920px: половины заполняют всю область без внутренних рамок/зазоров, размеры блока и 300 сохранены, URL/клавиатура/axe прошли; [HTML и CSS совпадают с исходниками](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-deal-halves/deployment.json).


## Хлебные крошки по странице собственников — 03.11.2026

Размеры сверены с [живым референсом](https://barn-estate.ru/prodazha_sobstvennikam/). Текст: 12px/16px до 540px, 13px/18px на 541–768px, 17px/18px от 769px; везде Tilda Sans 300. Разделитель «/»: 14/16/18/20/25px с границами 540/768/1024/1440px, line-height 1.4. Промежутки 4/6/8px. Сохранены цвет для белого фона каталога, содержание, ссылки и отступы от соседних блоков. Новых зависимостей нет.

[Проверка](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/owner-breadcrumbs/breadcrumbs.json): 20 ширин 320–3840px, включая обе стороны границ 540/768/1024/1440. Сравнивались итоговые стили двух подписей и разделителя, интервалы и высота строки; совпадение точное, переполнения и ошибок JavaScript нет. [Исходные отличия](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/owner-breadcrumbs/before.json), [правила референса](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/owner-breadcrumbs/reference-rules.json). Снимки: [390px](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/owner-breadcrumbs/breadcrumbs-390.png), [1440px](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/owner-breadcrumbs/breadcrumbs-1440.png), [1920px](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/owner-breadcrumbs/breadcrumbs-1920.png).

[Публичная проверка крошек по странице собственников](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-owner-breadcrumbs/breadcrumbs.json): 20 ширин 320–3840px: размеры/начертание/интерлиньяж ссылок и разделителя, промежутки и высота строки совпадают с живым референсом; [HTML и CSS совпадают с исходниками](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-owner-breadcrumbs/deployment.json).


## Отступ над хлебными крошками — 03.11.2026

Отступ от хедера до строки крошек увеличен: 20→28px на телефоне до 540px, 24→32px на 541–1024px, 30→40px от 1025px. Размеры текста и внутренних промежутков крошек сохранены по странице собственников. [Замеры](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/breadcrumb-gap/gap.json) на 320/390/768/1024/1440/1920px подтверждают отступы 28/32/40px, отсутствие пересечений с хэдером и горизонтального переполнения; ошибок JavaScript нет. [Телефон](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/breadcrumb-gap/gap-390.png), [десктоп](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/breadcrumb-gap/gap-1440.png). Новых зависимостей нет.

[Публичная проверка отступа над крошками](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-breadcrumb-gap/gap.json): На 320/390/768/1024/1440/1920px отступы 28/32/40px, размеры текста сохранены; пересечений с хэдером, переполнения и ошибок JavaScript нет; [HTML и CSS совпадают с исходниками](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-breadcrumb-gap/deployment.json).


## Подпункты хедера по левому краю названия — 03.11.2026

Речь о меню «Москва / Загородная / Курортная / Медиа…» в хэдере. Белая панель сдвинута левее на её внутренний отступ с рамкой (сейчас 19px), поэтому текст подпунктов начинается точно под текстом родительской ссылки: «Вторичная» под «Москва», «Инвестиции» под «Курортная». Координата вычисляется от фактического Range текста и padding/border панели, с сохранением ограничения по краям экрана. Верхняя позиция, шрифты, размеры, ссылки и обработчики меню сохранены. Новых зависимостей нет.

[Геометрия](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/header-label-alignment/alignment.json): 63 раскрытых меню — 9 разделов × 7 ширин 1281/1366/1440/1441/1920/2560/3840px; все подпункты совпадают с родительским текстом по левому краю, панель левее текста и внутри viewport. [Исходный сдвиг](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/header-label-alignment/before.json): 19px. [Поведение](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/header-label-alignment/hover.json): 72 случая мыши/гибридного устройства, переход указателя в список, закрытие, клавиатура/Escape/фокус, touch и мобильный бургер прошли, без ошибок JavaScript/HTTP. Снимки: [Москва 1440](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/header-label-alignment/header-1440-0.png), [Курортная 1440](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/header-label-alignment/header-1440-3.png), [Москва 1920](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/header-label-alignment/header-1920-0.png), [Курортная 1920](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/header-label-alignment/header-1920-3.png).

[Публичная проверка выравнивания подпунктов хедера](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-header-label-alignment/alignment.json): 63 меню на 1281–3840px: текст каждого подпункта начинается под текстом родителя, белая панель левее на 19px, переполнения/ошибок нет; [HTML и JS совпадают с исходниками](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-header-label-alignment/deployment.json).


## Единый размер сортировки, карты и фильтров — 03.11.2026

Сортировка и кнопка «На карте» используют --home-field, как основные быстрые поля: 17px до 540px, 18px до 1440px, 20px далее. Мелкими в строке управления выдачей остаются количество объектов (14/15px) и «Сбросить фильтры» (14px). На телефонах уже 360px сортировке выделена отдельная нижняя строка справа: количество над ней, карта слева в первой строке. На остальных ширинах прежняя композиция сохранена. Min-height сортировки 44px согласован с её контейнером: исключено перекрытие области клика кнопки карты. Новых зависимостей нет.

[Проверка](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/result-type/typography.json): 50 сочетаний пяти вариантов сортировки и десяти ширин 320–1920px. Размеры сортировки/карты/быстрого поля совпадают, подписи не обрезаются, пересечений областей клика/переполнения и ошибок JavaScript нет. Выбор «Цена меньше» через popup меняет URL; карта открывается и закрывается по Escape. Снимки: [320px](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/result-type/results-320.png), [390px](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/result-type/results-390.png), [1440px](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/result-type/results-1440.png).

[Публичная проверка размеров сортировки и кнопки карты](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-result-type/typography.json): 50 сочетаний на 320–1920px: сортировка и карта одного размера с быстрыми полями; длинные подписи целиком, области клика не пересекаются, выбор/карта работают; [HTML и два CSS-модуля совпадают с исходниками](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-result-type/deployment.json).


## Бордовая выбранная половина сделки — 03.11.2026

По прямому уточнению пользователя выбранная половина «Покупка / Аренда» имеет фирменный бордовый фон #8b1d25 и белый текст #fff. Это заменяет прежнюю светло-розовую заливку #f9f3f3. Общая форма с двумя равными половинами, внешние размеры 58/64px, начертание 300 и размер текста сохранены. Другие элементы палитры не менялись. Новых зависимостей нет.

[Проверка](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/deal-color/color.json): покупка/аренда на 390/1440px, вычисленные фон/цвет текста, равные половины без внутренних рамок/зазоров, URL/клавиатура и axe прошли. Снимки: [покупка 390](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/deal-color/deal-buy-390.png), [аренда 390](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/deal-color/deal-rent-390.png), [покупка 1440](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/deal-color/deal-buy-1440.png), [аренда 1440](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/deal-color/deal-rent-1440.png).

[Публичная проверка бордовой выбранной половины](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-deal-color/color.json): Покупка/аренда на 390/1440px: фон #8b1d25, белый текст, полная заливка половины; размеры, клавиатура/URL и axe прошли; [HTML и CSS совпадают с исходниками](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-deal-color/deployment.json).


## Мобильная панель управления в две строки — 03.11.2026

До 767px элементы стоят так:

| Слева | Справа |
| --- | --- |
| Сбросить фильтры | Сортировка |
| На карте | Количество объектов |

Выбранные условия размещаются отдельной строкой выше. Общая обёртка на десктопе имеет display:contents; на мобильном её дочерние блоки участвуют в одной CSS Grid. JS-обработчики и DOM-узлы кнопок сохранены, дополнительных копий нет. На 320px уменьшены горизонтальный gap и место под стрелку сортировки, чтобы сохранять крупный шрифт и целую подпись. Размеры текста и бордовая заливка сделки не менялись. Новых зависимостей нет.

[Расположение](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/mobile-controls/layout.json): 12 состояний 320–767px с выбранными условиями и без них, совпадение центров двух строк, отсутствие пересечений, сброс/сортировка/карта и axe. Геометрия десктопа на 768/1024/1440/1920px совпала с вариантом без новой обёртки. [Все пять вариантов сортировки](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/mobile-controls/typography.json): 50 сочетаний 320–1920px без обрезания и переполнения. [Регрессия выбранных условий](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/mobile-controls/active-filters.json), [55 сочетаний панели](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/mobile-controls/toolbar.json) прошли. Снимки: [320px](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/mobile-controls/results-320.png), [390px](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/mobile-controls/results-390.png), [1440px](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/mobile-controls/results-1440.png).

[Публичная проверка мобильных двух строк управления](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-mobile-controls/layout.json): 12 мобильных состояний: сброс/сортировка сверху, карта/количество снизу, с тегами и без; четыре ширины десктопа без изменения геометрии, сброс/сортировка/карта/axe прошли; [HTML и CSS совпадают с исходниками](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-mobile-controls/deployment.json).


## «На карте»: насыщенность 300 — 03.11.2026

По запросу текст кнопки «На карте» облегчён с 400 до 300. Кегль --home-field, высота 44px, цвет и расположение сохранены. [Замеры](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/map-weight/weight.json) на 390/1440px: font-weight 300 у кнопки и текста, 17/18px, открытие карты и Escape работают, ошибок JavaScript/переполнения нет. Новых зависимостей нет.

[Публичная проверка насыщенности текста кнопки карты](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-map-weight/weight.json): На 390/1440px текст и кнопка имеют font-weight 300, кегль 17/18px и высота 44px сохранены, открытие/закрытие карты работают; [HTML и CSS совпадают с исходниками](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-map-weight/deployment.json).


## Итоговая ведомость размеров шрифтов — 03.11.2026

[Полная таблица 83текстовых ролей](FONT-SIZES.md) и [вычисленные стили](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/font-sizes/computed.json). Зафиксирован 291набор замеров на 17 ширинах 320–3840px и в состояниях страницы, проектов/лотов/аренды, раскрытых списков, меню, полной формы, карты, квиза/контакта и ошибок. Указаны точные границы, насыщенность, размеры внутри самих текстовых span; отличаются характеристики проектов и отдельных объектов. Кнопка «Смотреть больше» измерена на 12 проектах Курортной. Изменений дизайна, HTML/CSS/JS и отправки контактных данных нет.


## H1 по узловым страницам, без капса — 03.11.2026

«Каталог недвижимости» выведен обычным регистром. H1 перенесён со шкалы заголовков секций 22/38/44px на контракт узлов: 32px до 540px, от 541px — clamp(38px,4vw,58px). Насыщенность 300, line-height 1.05, letter-spacing −0.045em. Примеры: 38px на 768px; 40,96px на 1024px; 51,2px на 1280px; 57,6px на 1440px; 58px от 1450px. Обновлена [ведомость шрифтов](FONT-SIZES.md). Отступы и остальные текстовые роли сохранены.

[Сравнение](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/node-h1/h1.json) с [городской](https://daniilterekh-prog.github.io/barn-estate-homepage-clone/gorodskaya-nedvizhimost/) и [загородной](https://daniilterekh-prog.github.io/barn-estate-homepage-clone/zagorodnaya-nedvizhimost/): 14 ширин 320–3840px, одинаковые размеры/интерлиньяж/насыщенность/разрядка, отсутствие капса, обрезания/пересечений. [Общие проверки кита](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/node-h1/kit-contracts.json), [axe](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/node-h1/kit-accessibility.json), [типографика 12 ширин и 24 открытых состояния](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/node-h1/typography.json) прошли. Снимки: [390px](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/node-h1/h1-390.png), [1440px](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/node-h1/h1-1440.png), [1920px](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/node-h1/h1-1920.png). Новых зависимостей нет.

[Публичная проверка H1 по узловым страницам](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-node-h1/h1.json): 14 ширин 320–3840px: H1 совпадает с городской/загородной по размеру, интерлиньяжу, насыщенности и разрядке; обычный регистр, обрезания/пересечений нет; [HTML и CSS совпадают с исходниками](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-node-h1/deployment.json).


## Департаменты аренды — 03.11.2026

В аренде доступны Москва, Загородная и Коммерческая. Курортная и Зарубежная остаются в покупке; ограничения заданы в профилях и одинаково применяются к основному dropdown и карте. При переключении этих двух направлений на аренду и при прямом URL с недоступным сочетанием выбирается Москва. Переход между доступными департаментами сохраняет аренду.

Использован существующий dropdown без новых библиотек. Проверка `node katalog-nedvizhimosti/tools/check_catalog_rental_departments.cjs`: 320/390/1440 px, все пять прямых rental URL, состав списков, выбор в карте, сохранение аренды, возврат пяти направлений при покупке и переключение недоступных направлений. [Отчёт](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/rental-departments/rental-departments.json).

[Публичная проверка департаментов аренды](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-rental-departments/rental-departments.json): 320/390/1440px: состав списков каталога и карты, прямые URL, переключения сделок и возврат направлений в покупке; [HTML и JS совпадают с исходниками](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-rental-departments/deployment.json).


## «Новостройки / Вторичная»: насыщенность 300 — 03.11.2026

Текст выбранного рынка получил насыщенность 300 вместо 400. Оба варианта в раскрывающемся списке также используют 300. Размеры шрифта и геометрия сохранены; на карте выбранное значение уже имело насыщенность 300. Использован существующий CSS без новых зависимостей. Проверены computed styles обоих значений на 390/1440/1920 px в каталоге и на карте. [Отчёт](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/market-weight/market-weight.json).

[Публичная проверка насыщенности Новостроек / Вторичной](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-market-weight/market-weight.json): На 390/1440/1920px оба выбранных значения и варианты списка имеют насыщенность 300, кегль 17/18/20px сохранён; проверена карта; [HTML и CSS совпадают с исходниками](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-market-weight/deployment.json).


## Расстояние до первого подпункта как на главной — 03.11.2026

Расстояние от нижнего края строки «Москва / Загородная / …» до первого подпункта увеличено с 9 до 31 px, как на опубликованной главной `exact-2026-10-21/` (между текстовыми Range — 28 px). Верхний padding белой панели теперь 30 px плюс рамка 1 px; панель остаётся вплотную к области наведения без разрыва. Левое выравнивание, интервалы между подпунктами, шрифты и размеры хедера сохранены. Использован существующий CSS без новых зависимостей.

[Замеры главной и исходного состояния](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/header-submenu-gap/before-reference.json), [проверка 54 раскрытых меню](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/header-submenu-gap/gap.json): девять разделов на 1281/1440/1441/1920/2560/3840 px, совпадение расстояний до первого подпункта и левого края текста, переход курсора в список, границы viewport, клавиатура/Escape и мобильный бургер.

[Публичная проверка расстояний в меню хедера](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-header-submenu-gap/gap.json): 54 меню на шести ширинах 1281–3840px: отступ до первого подпункта 31px как на главной, левое выравнивание, наведение, клавиатура и мобильный бургер проверены; [HTML и CSS совпадают с исходниками](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-header-submenu-gap/deployment.json).


## Порядок кнопки и счётчика выдачи — 03.11.2026

Под карточками сначала стоит «Смотреть больше», ниже — «Показано 6 из 12». Переставлены элементы в HTML, поэтому визуальный порядок совпадает с порядком чтения. Стили и логика подгрузки сохранены; новых зависимостей нет. [Проверка на 390/1440 px](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/pagination-order/order.json): порядок и геометрия, загрузка оставшихся шести карточек, обновление счётчика до 12 из 12 и скрытие кнопки.

[Публичная проверка порядка кнопки и счётчика](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-pagination-order/order.json): На 390/1440px кнопка расположена над счётчиком; подгрузка до 12 карточек и обновление количества проверены; [HTML совпадает с исходником](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-pagination-order/deployment.json).


## Финальная типографика по главной, карточки сохранены — 03.11.2026

Фильтры, поиск, сортировка и управление картой приведены к фактическому hero главной: 16px до 1440px и 18px выше вместо смеси 17/18/20px. Сохранены насыщенность 300 и геометрия полей. Числовые диапазоны — 16px на телефоне и 18px выше; минимум 16px исключает увеличение экрана при фокусе ввода на iPhone. H1, компактные служебные подписи и ранее согласованные исключения сохранены. Хедер/бургер, футер, эксперт и квиз сверены с главной.

[Подробная сверка и таблица](TYPOGRAPHY-AUDIT.md), [актуальные размеры](FONT-SIZES.md), [проверка на 15 ширинах и 24 состояниях](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/final-fonts/audit.json), [90 неизменных состояний карточек выдачи и карты](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/final-fonts/cards-unchanged.json), [55 сочетаний панели и axe](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/final-fonts/two-row-toolbar.json). Воспроизведение: `tools/check_catalog_typography.cjs` и `tools/check_catalog_toolbar.cjs` с `BARNES_CATALOG_URL` / `BARNES_PROOF_DIR`. Использованы существующие Playwright/Chrome; новых библиотек нет. Главная и карточки не изменялись.

[Публичная финальная сверка шрифтов с главной](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-final-fonts/audit.json): 15 ширин 320–3840px, 24 состояния, размеры управления как в hero главной и неизменные текстовые стили карточек; [HTML и CSS совпадают с исходниками](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-final-fonts/deployment.json).


## Фильтры возвращены к прежним размерам — 03.11.2026

По уточнению пользователя отменена последняя унификация размеров управляющих элементов с hero главной. Фильтры, поиск, сортировка и «На карте» снова 17/18/20px, диапазоны полной формы — 17/18/20px, управление внутри карты — 17/19px. Три CSS-адаптера побайтно восстановлены из версии до унификации; карточки, H1 и общие блоки не менялись. Предыдущий аудит сохранён как история, актуальная таблица — [FONT-SIZES.md](FONT-SIZES.md).

[Проверка размеров и общих блоков](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/filters-restored/audit.json), [панель и доступность](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/filters-restored/two-row-toolbar.json). Новых зависимостей нет.

[Публичная проверка возвращённых размеров фильтров](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-filters-restored/audit.json): 15 ширин 320–3840px, 24 состояния, прежние размеры фильтров 17/18/20px, совпадение общих блоков с главной; [HTML и CSS совпадают с исходниками](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/live-filters-restored/deployment.json).


## Пакет для разработчика — 03.11.2026

[Дизайн и код](../handoff/catalog-2026-11-03/README.md): размеры, отступы, типографика, цвета, рамки и состояния; 15 ширин и 75 состояний, 213 текстовых стилей. Код отдельно в html/css/js, локальные ассеты и данные рядом. По уточнению пользователя интеграции, планы, ZIP и служебные отчёты удалены из папки передачи.
