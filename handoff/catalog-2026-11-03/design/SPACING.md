# Размеры блоков, отступы и адаптив

Все значения — CSS px. Порядок shorthand `padding`/`margin`: сверху → справа → снизу → слева. Отрицательный margin у тела карточки создаёт наложение белой панели на фотографию. Высота текстовых блоков зависит от текста; ширина карточек — от сетки. Таблицы ниже — фактические замеры, а не фиксированные ширины для вёрстки.

## Общие направляющие

- Контейнер: максимум 1920px, по центру.
- Горизонтальный gutter до 540px: 22px. Выше: `clamp(24px, calc(-26.66667px + 6.59722vw), 100px)`. С 1921px внутренний gutter 0px, контейнер остаётся по центру шириной до 1920px.
- Верх от хедера до хлебных крошек: 28px до 540px; 32px до 1024px; 40px выше.
- Под H1: 28px на телефоне до 540px, 40px выше.
- Высота быстрых полей: 58px до 767px, 64px выше; рамка 1px, радиус 1px.
- Покупка/аренда: две равные половины общего контура, без внутреннего отступа и вложенного шейпа.
- Десктоп от 1024px: основные поля в верхнем ряду; четыре быстрых параметра и кнопка всех фильтров ниже; gap 16px.
- 768–1023px: сетка из четырёх равных колонок, gap 16px; параметры занимают полный ряд.
- До 767px: один столбец основных полей; четыре параметра в сетке 2×2 высотой 116px; расстояние между рядами основных блоков 12px. Поиск и кнопка фильтров стоят рядом, кнопка 58×58px.
- Мобильная панель результата: первая строка сброс / сортировка, вторая карта / количество. Gap 8px по вертикали и 12px по горизонтали; до 359px горизонтальный gap 6px.
- Между карточками: 24px. Число колонок и фактические размеры — в таблице сетки ниже.
- Под карточками: кнопка «Смотреть больше», затем количество; gap 14px.
- Хедер: полный 153px при 1281–1440px и 155px выше; без строки направлений 111px при 541–1280px; 77px до 540px. Логотип 36px по высоте на телефоне, 48px выше.
- От строки направления до первого подпункта: 31px. Текст подпунктов выровнен с названием направления; белая рамка сдвинута левее на padding+border (19px).
- Рамка dropdown хедера 1px; padding 30px 18px 8px; промежуток между подпунктами 12px.
- Карта: панель до 420px слева на десктопе, крестик 44×44px с отступами 20px; на телефоне нижняя раскрывающаяся шторка. Полные значения каждого состояния ниже.

Браузер замеров использует вертикальную полосу прокрутки 15px, поэтому `clientWidth` страницы обычно на 15px меньше ширины окна. Высота окна замеров — 1000px; ограничения через vh/dvh меняются вместе с окном. Для точного CSS-селектора таблицы указывают border-box ширину/высоту, padding, margin, gap и border-radius. Все остальные min/max-размеры, grid-template, position и выравнивание сохранены в MEASUREMENTS.json.

## Как читать MEASUREMENTS.json

`states` содержит номер состояния, ширину окна, клиентскую ширину и название. В `elements` — CSS-селектор, порядковое вхождение, пример текста, `visibleAt` и все свойства. Если свойство постоянно, записана строка. Если меняется, для каждого `value` указан список номеров `states`. Так сохранены точные параметры без многократного повторения одинаковых значений.

## `body`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 305px | 5750.3125px | 0px | 0px | normal | 0px |
| 390 | page | 375px | 5959.71875px | 0px | 0px | normal | 0px |
| 540 | page | 525px | 6262.71875px | 0px | 0px | normal | 0px |
| 541 | page | 526px | 4587.8125px | 0px | 0px | normal | 0px |
| 767 | page | 752px | 4712.5px | 0px | 0px | normal | 0px |
| 768 | page | 753px | 4355.625px | 0px | 0px | normal | 0px |
| 1024 | page | 1009px | 4531.5625px | 0px | 0px | normal | 0px |
| 1025 | page | 1010px | 3190.546875px | 0px | 0px | normal | 0px |
| 1280 | page | 1265px | 2999.125px | 0px | 0px | normal | 0px |
| 1281 | page | 1266px | 3041.59375px | 0px | 0px | normal | 0px |
| 1440 | page | 1425px | 3117.28125px | 0px | 0px | normal | 0px |
| 1441 | page | 1426px | 3179.390625px | 0px | 0px | normal | 0px |
| 1920 | page | 1905px | 3387.640625px | 0px | 0px | normal | 0px |
| 2560 | page | 2545px | 3495.140625px | 0px | 0px | normal | 0px |
| 3840 | page | 3825px | 3495.140625px | 0px | 0px | normal | 0px |
| 390 | filters | 390px | 5655.21875px | 0px | 0px | normal | 0px |
| 390 | active-condition | 375px | 6007.71875px | 0px | 0px | normal | 0px |
| 390 | lot-cards | 375px | 6175.015625px | 0px | 0px | normal | 0px |
| 390 | rental-cards | 375px | 5007.171875px | 0px | 0px | normal | 0px |
| 390 | empty | 375px | 2782.703125px | 0px | 0px | normal | 0px |
| 768 | lot-cards | 753px | 4482.203125px | 0px | 0px | normal | 0px |
| 768 | rental-cards | 753px | 3947.421875px | 0px | 0px | normal | 0px |
| 768 | empty | 753px | 2983.3125px | 0px | 0px | normal | 0px |
| 1440 | lot-cards | 1425px | 3176.453125px | 0px | 0px | normal | 0px |
| 1440 | rental-cards | 1425px | 3218.234375px | 0px | 0px | normal | 0px |
| 1440 | empty | 1425px | 2178.828125px | 0px | 0px | normal | 0px |
| 1920 | lot-cards | 1905px | 3446.8125px | 0px | 0px | normal | 0px |
| 1920 | rental-cards | 1905px | 3488.59375px | 0px | 0px | normal | 0px |
| 1920 | empty | 1905px | 2240.84375px | 0px | 0px | normal | 0px |

## `.base-container`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 305px | 61px | 0px 22px | 0px | normal | 0px |
| 390 | page | 375px | 61px | 0px 22px | 0px | normal | 0px |
| 540 | page | 525px | 61px | 0px 22px | 0px | normal | 0px |
| 541 | page | 526px | 79px | 0px 24px | 0px | normal | 0px |
| 767 | page | 752px | 79px | 0px 24px | 0px | normal | 0px |
| 768 | page | 753px | 79px | 0px 24px | 0px | normal | 0px |
| 1024 | page | 1009px | 79px | 0px 40.8889px | 0px | normal | 0px |
| 1025 | page | 1010px | 79px | 0px 40.9548px | 0px | normal | 0px |
| 1280 | page | 1265px | 79px | 0px 57.7777px | 0px | normal | 0px |
| 1281 | page | 1266px | 121px | 0px 57.8437px | 0px | normal | 0px |
| 1440 | page | 1425px | 121px | 0px 68.3333px | 0px | normal | 0px |
| 1441 | page | 1426px | 123px | 0px 68.3993px | 0px | normal | 0px |
| 1920 | page | 1905px | 123px | 0px 100px | 0px | normal | 0px |
| 2560 | page | 1920px | 123px | 0px | 0px | normal | 0px |
| 3840 | page | 1920px | 123px | 0px | 0px | normal | 0px |
| 390 | filters | 390px | 61px | 0px 22px | 0px | normal | 0px |
| 1440 | burger | 1425px | 79px | 0px 68.3333px | 0px | normal | 0px |
| 1920 | burger | 1905px | 79px | 0px 100px | 0px | normal | 0px |

## `.site-header`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 305px | 77px | 16px 0px 0px | 0px | normal | 0px |
| 390 | page | 375px | 77px | 16px 0px 0px | 0px | normal | 0px |
| 540 | page | 525px | 77px | 16px 0px 0px | 0px | normal | 0px |
| 541 | page | 526px | 111px | 32px 0px 0px | 0px | normal | 0px |
| 767 | page | 752px | 111px | 32px 0px 0px | 0px | normal | 0px |
| 768 | page | 753px | 111px | 32px 0px 0px | 0px | normal | 0px |
| 1024 | page | 1009px | 111px | 32px 0px 0px | 0px | normal | 0px |
| 1025 | page | 1010px | 111px | 32px 0px 0px | 0px | normal | 0px |
| 1280 | page | 1265px | 111px | 32px 0px 0px | 0px | normal | 0px |
| 1281 | page | 1266px | 153px | 32px 0px 0px | 0px | normal | 0px |
| 1440 | page | 1425px | 153px | 32px 0px 0px | 0px | normal | 0px |
| 1441 | page | 1426px | 155px | 32px 0px 0px | 0px | normal | 0px |
| 1920 | page | 1905px | 155px | 32px 0px 0px | 0px | normal | 0px |
| 2560 | page | 2545px | 155px | 32px 0px 0px | 0px | normal | 0px |
| 3840 | page | 3825px | 155px | 32px 0px 0px | 0px | normal | 0px |
| 390 | filters | 390px | 77px | 16px 0px 0px | 0px | normal | 0px |
| 1440 | burger | 1425px | 111px | 32px 0px 0px | 0px | normal | 0px |
| 1920 | burger | 1905px | 111px | 32px 0px 0px | 0px | normal | 0px |

## `.site-header__top`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 261px | 61px | 0px 0px 16px | 0px | 20px 0px | 0px |
| 390 | page | 331px | 61px | 0px 0px 16px | 0px | 20px 0px | 0px |
| 540 | page | 481px | 61px | 0px 0px 16px | 0px | 20px 0px | 0px |
| 541 | page | 478px | 79px | 0px 0px 30px | 0px | 12px 0px | 0px |
| 767 | page | 704px | 79px | 0px 0px 30px | 0px | 12px 0px | 0px |
| 768 | page | 705px | 79px | 0px 0px 30px | 0px | 12px 0px | 0px |
| 1024 | page | 927.25px | 79px | 0px 0px 30px | 0px | 12px 0px | 0px |
| 1025 | page | 928.09375px | 79px | 0px 0px 30px | 0px | 20px | 0px |
| 1280 | page | 1149.46875px | 79px | 0px 0px 30px | 0px | 20px | 0px |
| 1281 | page | 1150.34375px | 79px | 0px 0px 30px | 0px 0px 26px | 20px | 0px |
| 1440 | page | 1288.34375px | 79px | 0px 0px 30px | 0px 0px 26px | 20px | 0px |
| 1441 | page | 1289.21875px | 79px | 0px 0px 30px | 0px 0px 26px | 20px | 0px |
| 1920 | page | 1705.03125px | 79px | 0px 0px 30px | 0px 0px 26px | 20px | 0px |
| 2560 | page | 1920px | 79px | 0px 0px 30px | 0px 0px 26px | 20px | 0px |
| 3840 | page | 1920px | 79px | 0px 0px 30px | 0px 0px 26px | 20px | 0px |
| 390 | filters | 346px | 61px | 0px 0px 16px | 0px | 20px 0px | 0px |
| 1440 | burger | 1288.34375px | 79px | 0px 0px 30px | 0px | 20px | 0px |
| 1920 | burger | 1705.03125px | 79px | 0px 0px 30px | 0px | 20px | 0px |

## `.site-header__logo img`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 129.203125px | 36px | 0px | 0px | normal | 0px |
| 390 | page | 129.203125px | 36px | 0px | 0px | normal | 0px |
| 540 | page | 129.203125px | 36px | 0px | 0px | normal | 0px |
| 541 | page | 172.265625px | 48px | 0px | 0px | normal | 0px |
| 767 | page | 172.265625px | 48px | 0px | 0px | normal | 0px |
| 768 | page | 172.265625px | 48px | 0px | 0px | normal | 0px |
| 1024 | page | 172.265625px | 48px | 0px | 0px | normal | 0px |
| 1025 | page | 172.265625px | 48px | 0px | 0px | normal | 0px |
| 1280 | page | 172.265625px | 48px | 0px | 0px | normal | 0px |
| 1281 | page | 172.265625px | 48px | 0px | 0px | normal | 0px |
| 1440 | page | 172.265625px | 48px | 0px | 0px | normal | 0px |
| 1441 | page | 172.265625px | 48px | 0px | 0px | normal | 0px |
| 1920 | page | 172.265625px | 48px | 0px | 0px | normal | 0px |
| 2560 | page | 172.265625px | 48px | 0px | 0px | normal | 0px |
| 3840 | page | 172.265625px | 48px | 0px | 0px | normal | 0px |

## `.site-header__icon-btn`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 44px | 44px | 0px | 0px | 8px | 0px |
| 390 | page | 44px | 44px | 0px | 0px | 8px | 0px |
| 540 | page | 44px | 44px | 0px | 0px | 8px | 0px |
| 541 | page | 44px | 44px | 0px | 0px | 8px | 0px |
| 767 | page | 44px | 44px | 0px | 0px | 8px | 0px |
| 768 | page | 44px | 44px | 0px | 0px | 8px | 0px |
| 1024 | page | 44px | 44px | 0px | 0px | 8px | 0px |
| 1025 | page | 33px | 33px | 0px | 0px | 8px | 0px |
| 1280 | page | 33px | 33px | 0px | 0px | 8px | 0px |
| 1281 | page | 33px | 33px | 0px | 0px | 8px | 0px |
| 1440 | page | 33px | 33px | 0px | 0px | 8px | 0px |
| 1441 | page | 33px | 33px | 0px | 0px | 8px | 0px |
| 1920 | page | 33px | 33px | 0px | 0px | 8px | 0px |
| 2560 | page | 33px | 33px | 0px | 0px | 8px | 0px |
| 3840 | page | 33px | 33px | 0px | 0px | 8px | 0px |

## `.site-header__favorites-btn`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 541 | page | 22px | 22px | 0px | 0px | 8px | 0px |
| 767 | page | 22px | 22px | 0px | 0px | 8px | 0px |
| 768 | page | 22px | 22px | 0px | 0px | 8px | 0px |
| 1024 | page | 22px | 22px | 0px | 0px | 8px | 0px |
| 1025 | page | 22px | 22px | 0px | 0px | 8px | 0px |
| 1280 | page | 22px | 22px | 0px | 0px | 8px | 0px |
| 1281 | page | 22px | 22px | 0px | 0px | 8px | 0px |
| 1440 | page | 22px | 22px | 0px | 0px | 8px | 0px |
| 1441 | page | 22px | 22px | 0px | 0px | 8px | 0px |
| 1920 | page | 22px | 22px | 0px | 0px | 8px | 0px |
| 2560 | page | 22px | 22px | 0px | 0px | 8px | 0px |
| 3840 | page | 22px | 22px | 0px | 0px | 8px | 0px |

## `.site-header__messenger`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1025 | page | 24px | 24px | 0px | 0px | normal | 0px |
| 1280 | page | 24px | 24px | 0px | 0px | normal | 0px |
| 1281 | page | 24px | 24px | 0px | 0px | normal | 0px |
| 1440 | page | 24px | 24px | 0px | 0px | normal | 0px |
| 1441 | page | 24px | 24px | 0px | 0px | normal | 0px |
| 1920 | page | 24px | 24px | 0px | 0px | normal | 0px |
| 2560 | page | 24px | 24px | 0px | 0px | normal | 0px |
| 3840 | page | 24px | 24px | 0px | 0px | normal | 0px |

## `.home-header-contacts-toggle`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 44px | 44px | 0px | 0px | normal | 0px |
| 390 | page | 44px | 44px | 0px | 0px | normal | 0px |
| 540 | page | 44px | 44px | 0px | 0px | normal | 0px |
| 541 | page | 44px | 44px | 0px | 0px | normal | 0px |
| 767 | page | 44px | 44px | 0px | 0px | normal | 0px |
| 768 | page | 44px | 44px | 0px | 0px | normal | 0px |
| 1024 | page | 44px | 44px | 0px | 0px | normal | 0px |

## `.catalog-page-intro`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 305px | 136.78125px | 28px 22px 0px | 0px | normal | 0px |
| 390 | page | 375px | 103.1875px | 28px 22px 0px | 0px | normal | 0px |
| 540 | page | 525px | 103.1875px | 28px 22px 0px | 0px | normal | 0px |
| 541 | page | 526px | 122.28125px | 32px 24px 0px | 0px | normal | 0px |
| 767 | page | 752px | 122.28125px | 32px 24px 0px | 0px | normal | 0px |
| 768 | page | 753px | 122.28125px | 32px 24px 0px | 0px | normal | 0px |
| 1024 | page | 1009px | 128.1875px | 32px 40.8889px 0px | 0px | normal | 0px |
| 1025 | page | 1010px | 139.046875px | 40px 40.9548px 0px | 0px | normal | 0px |
| 1280 | page | 1265px | 149.75px | 40px 57.7777px 0px | 0px | normal | 0px |
| 1281 | page | 1266px | 149.78125px | 40px 57.8437px 0px | 0px | normal | 0px |
| 1440 | page | 1425px | 156.46875px | 40px 68.3333px 0px | 0px | normal | 0px |
| 1441 | page | 1426px | 163.515625px | 40px 68.3993px 0px | 0px | normal | 0px |
| 1920 | page | 1905px | 163.890625px | 40px 100px 0px | 0px | normal | 0px |
| 2560 | page | 1920px | 163.890625px | 40px 0px 0px | 0px 312.5px | normal | 0px |
| 3840 | page | 1920px | 163.890625px | 40px 0px 0px | 0px 952.5px | normal | 0px |
| 390 | filters | 390px | 103.1875px | 28px 22px 0px | 0px | normal | 0px |

## `.catalog-breadcrumbs`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 261px | 19.59375px | 0px | 0px 0px 22px | 4px | 0px |
| 390 | page | 331px | 19.59375px | 0px | 0px 0px 22px | 4px | 0px |
| 540 | page | 481px | 19.59375px | 0px | 0px 0px 22px | 4px | 0px |
| 541 | page | 478px | 22.390625px | 0px | 0px 0px 28px | 6px | 0px |
| 767 | page | 704px | 22.390625px | 0px | 0px 0px 28px | 6px | 0px |
| 768 | page | 705px | 22.390625px | 0px | 0px 0px 28px | 6px | 0px |
| 1024 | page | 927.25px | 25.1875px | 0px | 0px 0px 28px | 8px | 0px |
| 1025 | page | 928.09375px | 28px | 0px | 0px 0px 28px | 8px | 0px |
| 1280 | page | 1149.46875px | 28px | 0px | 0px 0px 28px | 8px | 0px |
| 1281 | page | 1150.34375px | 28px | 0px | 0px 0px 28px | 8px | 0px |
| 1440 | page | 1288.34375px | 28px | 0px | 0px 0px 28px | 8px | 0px |
| 1441 | page | 1289.21875px | 35px | 0px | 0px 0px 28px | 8px | 0px |
| 1920 | page | 1705.03125px | 35px | 0px | 0px 0px 28px | 8px | 0px |
| 2560 | page | 1920px | 35px | 0px | 0px 0px 28px | 8px | 0px |
| 3840 | page | 1920px | 35px | 0px | 0px 0px 28px | 8px | 0px |
| 390 | filters | 346px | 19.59375px | 0px | 0px 0px 22px | 4px | 0px |

## `.catalog-page-title`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 261px | 67.1875px | 0px | 0px 0px 28px | normal | 0px |
| 390 | page | 331px | 33.59375px | 0px | 0px 0px 28px | normal | 0px |
| 540 | page | 481px | 33.59375px | 0px | 0px 0px 28px | normal | 0px |
| 541 | page | 478px | 39.890625px | 0px | 0px 0px 40px | normal | 0px |
| 767 | page | 704px | 39.890625px | 0px | 0px 0px 40px | normal | 0px |
| 768 | page | 705px | 39.890625px | 0px | 0px 0px 40px | normal | 0px |
| 1024 | page | 927.25px | 43px | 0px | 0px 0px 40px | normal | 0px |
| 1025 | page | 928.09375px | 43.046875px | 0px | 0px 0px 40px | normal | 0px |
| 1280 | page | 1149.46875px | 53.75px | 0px | 0px 0px 40px | normal | 0px |
| 1281 | page | 1150.34375px | 53.78125px | 0px | 0px 0px 40px | normal | 0px |
| 1440 | page | 1288.34375px | 60.46875px | 0px | 0px 0px 40px | normal | 0px |
| 1441 | page | 1289.21875px | 60.515625px | 0px | 0px 0px 40px | normal | 0px |
| 1920 | page | 1705.03125px | 60.890625px | 0px | 0px 0px 40px | normal | 0px |
| 2560 | page | 1920px | 60.890625px | 0px | 0px 0px 40px | normal | 0px |
| 3840 | page | 1920px | 60.890625px | 0px | 0px 0px 40px | normal | 0px |
| 390 | filters | 346px | 33.59375px | 0px | 0px 0px 28px | normal | 0px |

## `.catalog-mode-toolbar`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 261px | 396px | 0px | 0px 0px 8px | 12px 0px | 0px |
| 390 | page | 331px | 396px | 0px | 0px 0px 8px | 12px 0px | 0px |
| 540 | page | 481px | 396px | 0px | 0px 0px 8px | 12px 0px | 0px |
| 541 | page | 478px | 396px | 0px | 0px 0px 8px | 12px 0px | 0px |
| 767 | page | 704px | 396px | 0px | 0px 0px 8px | 12px 0px | 0px |
| 768 | page | 705px | 224px | 0px | 0px 0px 8px | 16px | 0px |
| 1024 | page | 927.25px | 144px | 0px | 0px 0px 8px | 16px | 0px |
| 1025 | page | 928.09375px | 144px | 0px | 0px 0px 8px | 16px | 0px |
| 1280 | page | 1149.46875px | 144px | 0px | 0px 0px 8px | 16px | 0px |
| 1281 | page | 1150.34375px | 144px | 0px | 0px 0px 8px | 16px | 0px |
| 1440 | page | 1288.34375px | 144px | 0px | 0px 0px 8px | 16px | 0px |
| 1441 | page | 1289.21875px | 144px | 0px | 0px 0px 8px | 16px | 0px |
| 1920 | page | 1705.03125px | 144px | 0px | 0px 0px 8px | 16px | 0px |
| 2560 | page | 1920px | 144px | 0px | 0px 0px 8px | 16px | 0px |
| 3840 | page | 1920px | 144px | 0px | 0px 0px 8px | 16px | 0px |
| 390 | filters | 346px | 396px | 0px | 0px 0px 8px | 12px 0px | 0px |
| 390 | lot-cards | 331px | 326px | 0px | 0px 0px 8px | 12px 0px | 0px |

## `.catalog-toolbar__primary`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1024 | page | 927.25px | 64px | 0px | 0px | 16px | 0px |
| 1025 | page | 928.09375px | 64px | 0px | 0px | 16px | 0px |
| 1280 | page | 1149.46875px | 64px | 0px | 0px | 16px | 0px |
| 1281 | page | 1150.34375px | 64px | 0px | 0px | 16px | 0px |
| 1440 | page | 1288.34375px | 64px | 0px | 0px | 16px | 0px |
| 1441 | page | 1289.21875px | 64px | 0px | 0px | 16px | 0px |
| 1920 | page | 1705.03125px | 64px | 0px | 0px | 16px | 0px |
| 2560 | page | 1920px | 64px | 0px | 0px | 16px | 0px |
| 3840 | page | 1920px | 64px | 0px | 0px | 16px | 0px |

## `.catalog-toolbar__secondary`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1024 | page | 927.25px | 64px | 0px | 0px | 16px | 0px |
| 1025 | page | 928.09375px | 64px | 0px | 0px | 16px | 0px |
| 1280 | page | 1149.46875px | 64px | 0px | 0px | 16px | 0px |
| 1281 | page | 1150.34375px | 64px | 0px | 0px | 16px | 0px |
| 1440 | page | 1288.34375px | 64px | 0px | 0px | 16px | 0px |
| 1441 | page | 1289.21875px | 64px | 0px | 0px | 16px | 0px |
| 1920 | page | 1705.03125px | 64px | 0px | 0px | 16px | 0px |
| 2560 | page | 1920px | 64px | 0px | 0px | 16px | 0px |
| 3840 | page | 1920px | 64px | 0px | 0px | 16px | 0px |

## `.catalog-mode-switch`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 261px | 58px | 0px | 0px | 0px | 1px |
| 390 | page | 331px | 58px | 0px | 0px | 0px | 1px |
| 540 | page | 481px | 58px | 0px | 0px | 0px | 1px |
| 541 | page | 478px | 58px | 0px | 0px | 0px | 1px |
| 767 | page | 704px | 58px | 0px | 0px | 0px | 1px |
| 768 | page | 344.5px | 64px | 0px | 0px | 0px | 1px |
| 1024 | page | 205.046875px | 64px | 0px | 0px | 0px | 1px |
| 1025 | page | 205.390625px | 64px | 0px | 0px | 0px | 1px |
| 1280 | page | 263.890625px | 64px | 0px | 0px | 0px | 1px |
| 1281 | page | 264.09375px | 64px | 0px | 0px | 0px | 1px |
| 1440 | page | 297.15625px | 64px | 0px | 0px | 0px | 1px |
| 1441 | page | 297.375px | 64px | 0px | 0px | 0px | 1px |
| 1920 | page | 396.984375px | 64px | 0px | 0px | 0px | 1px |
| 2560 | page | 448.484375px | 64px | 0px | 0px | 0px | 1px |
| 3840 | page | 448.484375px | 64px | 0px | 0px | 0px | 1px |
| 390 | filters | 346px | 58px | 0px | 0px | 0px | 1px |

## `.catalog-mode-switch__button.is-active`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 129.5px | 56px | 0px 6px | 0px | normal | 0px |
| 390 | page | 164.5px | 56px | 0px 6px | 0px | normal | 0px |
| 540 | page | 239.5px | 56px | 0px 6px | 0px | normal | 0px |
| 541 | page | 238px | 56px | 0px 6px | 0px | normal | 0px |
| 767 | page | 351px | 56px | 0px 6px | 0px | normal | 0px |
| 768 | page | 171.25px | 62px | 0px 6px | 0px | normal | 0px |
| 1024 | page | 101.515625px | 62px | 0px 6px | 0px | normal | 0px |
| 1025 | page | 101.6875px | 62px | 0px 6px | 0px | normal | 0px |
| 1280 | page | 130.9375px | 62px | 0px 6px | 0px | normal | 0px |
| 1281 | page | 131.046875px | 62px | 0px 6px | 0px | normal | 0px |
| 1440 | page | 147.578125px | 62px | 0px 6px | 0px | normal | 0px |
| 1441 | page | 147.6875px | 62px | 0px 6px | 0px | normal | 0px |
| 1920 | page | 197.484375px | 62px | 0px 6px | 0px | normal | 0px |
| 2560 | page | 223.234375px | 62px | 0px 6px | 0px | normal | 0px |
| 3840 | page | 223.234375px | 62px | 0px 6px | 0px | normal | 0px |
| 390 | filters | 172px | 56px | 0px 6px | 0px | normal | 0px |
| 1920 | rental-cards | 197.5px | 62px | 0px 6px | 0px | normal | 0px |

## `.catalog-direction`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 261px | 58px | 0px | 0px | normal | 1px |
| 390 | page | 331px | 58px | 0px | 0px | normal | 1px |
| 540 | page | 481px | 58px | 0px | 0px | normal | 1px |
| 541 | page | 478px | 58px | 0px | 0px | normal | 1px |
| 767 | page | 704px | 58px | 0px | 0px | normal | 1px |
| 768 | page | 344.5px | 64px | 0px | 0px | normal | 1px |
| 1024 | page | 200px | 64px | 0px | 0px | normal | 1px |
| 1025 | page | 200px | 64px | 0px | 0px | normal | 1px |
| 1280 | page | 229.46875px | 64px | 0px | 0px | normal | 1px |
| 1281 | page | 229.65625px | 64px | 0px | 0px | normal | 1px |
| 1440 | page | 258.40625px | 64px | 0px | 0px | normal | 1px |
| 1441 | page | 258.578125px | 64px | 0px | 0px | normal | 1px |
| 1920 | page | 345.21875px | 64px | 0px | 0px | normal | 1px |
| 2560 | page | 390px | 64px | 0px | 0px | normal | 1px |
| 3840 | page | 390px | 64px | 0px | 0px | normal | 1px |
| 390 | filters | 346px | 58px | 0px | 0px | normal | 1px |

## `.catalog-direction>.resort-select-trigger`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 259px | 56px | 0px 44px 0px 16px | 0px | normal | 0px |
| 390 | page | 329px | 56px | 0px 44px 0px 16px | 0px | normal | 0px |
| 540 | page | 479px | 56px | 0px 44px 0px 16px | 0px | normal | 0px |
| 541 | page | 476px | 56px | 0px 44px 0px 16px | 0px | normal | 0px |
| 767 | page | 702px | 56px | 0px 44px 0px 16px | 0px | normal | 0px |
| 768 | page | 342.5px | 62px | 0px 44px 0px 20px | 0px | normal | 0px |
| 1024 | page | 198px | 62px | 0px 44px 0px 20px | 0px | normal | 0px |
| 1025 | page | 198px | 62px | 0px 44px 0px 20px | 0px | normal | 0px |
| 1280 | page | 227.46875px | 62px | 0px 44px 0px 20px | 0px | normal | 0px |
| 1281 | page | 227.65625px | 62px | 0px 44px 0px 20px | 0px | normal | 0px |
| 1440 | page | 256.40625px | 62px | 0px 44px 0px 20px | 0px | normal | 0px |
| 1441 | page | 256.578125px | 62px | 0px 44px 0px 20px | 0px | normal | 0px |
| 1920 | page | 343.21875px | 62px | 0px 44px 0px 20px | 0px | normal | 0px |
| 2560 | page | 388px | 62px | 0px 44px 0px 20px | 0px | normal | 0px |
| 3840 | page | 388px | 62px | 0px 44px 0px 20px | 0px | normal | 0px |
| 390 | filters | 344px | 56px | 0px 44px 0px 16px | 0px | normal | 0px |

## `.catalog-mode-filters`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 261px | 116px | 0px | 0px | 0px | 1px |
| 390 | page | 331px | 116px | 0px | 0px | 0px | 1px |
| 540 | page | 481px | 116px | 0px | 0px | 0px | 1px |
| 541 | page | 478px | 116px | 0px | 0px | 0px | 1px |
| 767 | page | 704px | 116px | 0px | 0px | 0px | 1px |
| 768 | page | 705px | 64px | 0px | 0px | 0px | 1px |
| 1024 | page | 723.25px | 64px | 0px | 0px | 0px | 1px |
| 1025 | page | 724.09375px | 64px | 0px | 0px | 0px | 1px |
| 1280 | page | 945.46875px | 64px | 0px | 0px | 0px | 1px |
| 1281 | page | 946.34375px | 64px | 0px | 0px | 0px | 1px |
| 1440 | page | 1084.34375px | 64px | 0px | 0px | 0px | 1px |
| 1441 | page | 1085.21875px | 64px | 0px | 0px | 0px | 1px |
| 1920 | page | 1501.03125px | 64px | 0px | 0px | 0px | 1px |
| 2560 | page | 1716px | 64px | 0px | 0px | 0px | 1px |
| 3840 | page | 1716px | 64px | 0px | 0px | 0px | 1px |
| 390 | filters | 346px | 116px | 0px | 0px | 0px | 1px |

## `.catalog-quick-filters__item`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 129.5px | 57px | 0px | 0px | normal | 0px |
| 390 | page | 164.5px | 57px | 0px | 0px | normal | 0px |
| 540 | page | 239.5px | 57px | 0px | 0px | normal | 0px |
| 541 | page | 238px | 57px | 0px | 0px | normal | 0px |
| 767 | page | 351px | 57px | 0px | 0px | normal | 0px |
| 768 | page | 175.75px | 62px | 0px | 0px | normal | 0px |
| 1024 | page | 180.3125px | 62px | 0px | 0px | normal | 0px |
| 1025 | page | 180.515625px | 62px | 0px | 0px | normal | 0px |
| 1280 | page | 235.859375px | 62px | 0px | 0px | normal | 0px |
| 1281 | page | 236.078125px | 62px | 0px | 0px | normal | 0px |
| 1440 | page | 270.578125px | 62px | 0px | 0px | normal | 0px |
| 1441 | page | 270.796875px | 62px | 0px | 0px | normal | 0px |
| 1920 | page | 374.75px | 62px | 0px | 0px | normal | 0px |
| 2560 | page | 428.5px | 62px | 0px | 0px | normal | 0px |
| 3840 | page | 428.5px | 62px | 0px | 0px | normal | 0px |
| 390 | filters | 172px | 57px | 0px | 0px | normal | 0px |

## `.catalog-quick-filters__button`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 129.5px | 57px | 0px 12px | 0px | 8px | 0px |
| 390 | page | 164.5px | 57px | 0px 12px | 0px | 8px | 0px |
| 540 | page | 239.5px | 57px | 0px 12px | 0px | 8px | 0px |
| 541 | page | 238px | 57px | 0px 12px | 0px | 8px | 0px |
| 767 | page | 351px | 57px | 0px 12px | 0px | 8px | 0px |
| 768 | page | 175.75px | 62px | 0px 14px | 0px | 12px | 0px |
| 1024 | page | 180.3125px | 62px | 0px 14px | 0px | 12px | 0px |
| 1025 | page | 180.515625px | 62px | 0px 14px | 0px | 12px | 0px |
| 1280 | page | 235.859375px | 62px | 0px 14px | 0px | 12px | 0px |
| 1281 | page | 236.078125px | 62px | 0px 14px | 0px | 12px | 0px |
| 1440 | page | 270.578125px | 62px | 0px 14px | 0px | 12px | 0px |
| 1441 | page | 270.796875px | 62px | 0px 14px | 0px | 12px | 0px |
| 1920 | page | 374.75px | 62px | 0px 14px | 0px | 12px | 0px |
| 2560 | page | 428.5px | 62px | 0px 14px | 0px | 12px | 0px |
| 3840 | page | 428.5px | 62px | 0px 14px | 0px | 12px | 0px |
| 390 | filters | 172px | 57px | 0px 12px | 0px | 8px | 0px |

## `.catalog-text-search`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 203px | 58px | 0px 14px | 0px | 14px | 1px |
| 390 | page | 273px | 58px | 0px 14px | 0px | 14px | 1px |
| 540 | page | 423px | 58px | 0px 14px | 0px | 14px | 1px |
| 541 | page | 420px | 58px | 0px 14px | 0px | 14px | 1px |
| 767 | page | 646px | 58px | 0px 14px | 0px | 14px | 1px |
| 768 | page | 344.5px | 64px | 0px 20px | 0px | 14px | 1px |
| 1024 | page | 294.1875px | 64px | 0px 20px | 0px | 14px | 1px |
| 1025 | page | 294.6875px | 64px | 0px 20px | 0px | 14px | 1px |
| 1280 | page | 378.625px | 64px | 0px 20px | 0px | 14px | 1px |
| 1281 | page | 378.921875px | 64px | 0px 20px | 0px | 14px | 1px |
| 1440 | page | 426.359375px | 64px | 0px 20px | 0px | 14px | 1px |
| 1441 | page | 426.65625px | 64px | 0px 20px | 0px | 14px | 1px |
| 1920 | page | 569.609375px | 64px | 0px 20px | 0px | 14px | 1px |
| 2560 | page | 643.5px | 64px | 0px 20px | 0px | 14px | 1px |
| 3840 | page | 643.5px | 64px | 0px 20px | 0px | 14px | 1px |
| 390 | filters | 288px | 58px | 0px 14px | 0px | 14px | 1px |
| 768 | lot-cards | 524.75px | 64px | 0px 20px | 0px | 14px | 1px |
| 1440 | lot-cards | 700.765625px | 64px | 0px 20px | 0px | 14px | 1px |
| 1920 | lot-cards | 930.828125px | 64px | 0px 20px | 0px | 14px | 1px |

## `.catalog-text-search svg`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 768 | page | 20px | 20px | 0px | 0px | normal | 0px |
| 1024 | page | 20px | 20px | 0px | 0px | normal | 0px |
| 1025 | page | 20px | 20px | 0px | 0px | normal | 0px |
| 1280 | page | 20px | 20px | 0px | 0px | normal | 0px |
| 1281 | page | 20px | 20px | 0px | 0px | normal | 0px |
| 1440 | page | 20px | 20px | 0px | 0px | normal | 0px |
| 1441 | page | 20px | 20px | 0px | 0px | normal | 0px |
| 1920 | page | 20px | 20px | 0px | 0px | normal | 0px |
| 2560 | page | 20px | 20px | 0px | 0px | normal | 0px |
| 3840 | page | 20px | 20px | 0px | 0px | normal | 0px |

## `#catalog-search`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 174px | 56px | 0px | 0px | normal | 0px |
| 390 | page | 244px | 56px | 0px | 0px | normal | 0px |
| 540 | page | 394px | 56px | 0px | 0px | normal | 0px |
| 541 | page | 391px | 56px | 0px | 0px | normal | 0px |
| 767 | page | 617px | 56px | 0px | 0px | normal | 0px |
| 768 | page | 268.5px | 62px | 0px | 0px | normal | 0px |
| 1024 | page | 218.1875px | 62px | 0px | 0px | normal | 0px |
| 1025 | page | 218.6875px | 62px | 0px | 0px | normal | 0px |
| 1280 | page | 302.625px | 62px | 0px | 0px | normal | 0px |
| 1281 | page | 302.921875px | 62px | 0px | 0px | normal | 0px |
| 1440 | page | 350.359375px | 62px | 0px | 0px | normal | 0px |
| 1441 | page | 350.65625px | 62px | 0px | 0px | normal | 0px |
| 1920 | page | 493.609375px | 62px | 0px | 0px | normal | 0px |
| 2560 | page | 567.5px | 62px | 0px | 0px | normal | 0px |
| 3840 | page | 567.5px | 62px | 0px | 0px | normal | 0px |
| 390 | filters | 259px | 56px | 0px | 0px | normal | 0px |
| 768 | lot-cards | 448.75px | 62px | 0px | 0px | normal | 0px |
| 1440 | lot-cards | 624.765625px | 62px | 0px | 0px | normal | 0px |
| 1920 | lot-cards | 854.828125px | 62px | 0px | 0px | normal | 0px |

## `.catalog-mode-detailed-filters`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 58px | 58px | 0px | 0px | 10px | 1px |
| 390 | page | 58px | 58px | 0px | 0px | 10px | 1px |
| 540 | page | 58px | 58px | 0px | 0px | 10px | 1px |
| 541 | page | 58px | 58px | 0px | 0px | 10px | 1px |
| 767 | page | 58px | 58px | 0px | 0px | 10px | 1px |
| 768 | page | 164.25px | 64px | 0px 10px | 0px | 10px | 1px |
| 1024 | page | 188px | 64px | 0px 16px | 0px | 10px | 1px |
| 1025 | page | 188px | 64px | 0px 16px | 0px | 10px | 1px |
| 1280 | page | 188px | 64px | 0px 16px | 0px | 10px | 1px |
| 1281 | page | 188px | 64px | 0px 16px | 0px | 10px | 1px |
| 1440 | page | 188px | 64px | 0px 16px | 0px | 10px | 1px |
| 1441 | page | 188px | 64px | 0px 16px | 0px | 10px | 1px |
| 1920 | page | 188px | 64px | 0px 16px | 0px | 10px | 1px |
| 2560 | page | 188px | 64px | 0px 16px | 0px | 10px | 1px |
| 3840 | page | 188px | 64px | 0px 16px | 0px | 10px | 1px |

## `.catalog-results-toolbar`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 261px | 96px | 0px | 0px 0px 20px | 8px 6px | 0px |
| 390 | page | 331px | 96px | 0px | 0px 0px 20px | 8px 12px | 0px |
| 540 | page | 481px | 96px | 0px | 0px 0px 20px | 8px 12px | 0px |
| 541 | page | 478px | 96px | 0px | 0px 0px 20px | 8px 12px | 0px |
| 767 | page | 704px | 96px | 0px | 0px 0px 20px | 8px 12px | 0px |
| 390 | filters | 346px | 96px | 0px | 0px 0px 20px | 8px 12px | 0px |
| 390 | active-condition | 331px | 144px | 0px | 0px 0px 20px | 8px 12px | 0px |

## `.catalog-collections-row`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 768 | page | 705px | 36px | 0px | 0px 0px 12px | 8px | 0px |
| 1024 | page | 927.25px | 36px | 0px | 0px 0px 12px | 8px | 0px |
| 1025 | page | 928.09375px | 36px | 0px | 0px 0px 12px | 8px | 0px |
| 1280 | page | 1149.46875px | 36px | 0px | 0px 0px 12px | 8px | 0px |
| 1281 | page | 1150.34375px | 36px | 0px | 0px 0px 12px | 8px | 0px |
| 1440 | page | 1288.34375px | 36px | 0px | 0px 0px 12px | 8px | 0px |
| 1441 | page | 1289.21875px | 36px | 0px | 0px 0px 12px | 8px | 0px |
| 1920 | page | 1705.03125px | 36px | 0px | 0px 0px 12px | 8px | 0px |
| 2560 | page | 1920px | 36px | 0px | 0px 0px 12px | 8px | 0px |
| 3840 | page | 1920px | 36px | 0px | 0px 0px 12px | 8px | 0px |

## `.catalog-result-summary`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 768 | page | 705px | 44px | 0px | 0px 0px 24px | 20px | 0px |
| 1024 | page | 927.25px | 44px | 0px | 0px 0px 24px | 20px | 0px |
| 1025 | page | 928.09375px | 44px | 0px | 0px 0px 24px | 20px | 0px |
| 1280 | page | 1149.46875px | 44px | 0px | 0px 0px 24px | 20px | 0px |
| 1281 | page | 1150.34375px | 44px | 0px | 0px 0px 24px | 20px | 0px |
| 1440 | page | 1288.34375px | 44px | 0px | 0px 0px 24px | 20px | 0px |
| 1441 | page | 1289.21875px | 44px | 0px | 0px 0px 24px | 20px | 0px |
| 1920 | page | 1705.03125px | 44px | 0px | 0px 0px 24px | 20px | 0px |
| 2560 | page | 1920px | 44px | 0px | 0px 0px 24px | 20px | 0px |
| 3840 | page | 1920px | 44px | 0px | 0px 0px 24px | 20px | 0px |

## `.catalog-active-filter`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | active-condition | 169.390625px | 40px | 6px 12px | 0px | 12px | 1px |
| 390 | empty | 210.921875px | 40px | 6px 12px | 0px | 12px | 1px |
| 768 | active-condition | 169.390625px | 36px | 6px 12px | 0px | 12px | 1px |
| 768 | empty | 210.921875px | 36px | 6px 12px | 0px | 12px | 1px |
| 1440 | active-condition | 169.390625px | 36px | 6px 12px | 0px | 12px | 1px |
| 1440 | empty | 210.921875px | 36px | 6px 12px | 0px | 12px | 1px |
| 1920 | active-condition | 169.390625px | 36px | 6px 12px | 0px | 12px | 1px |
| 1920 | empty | 210.921875px | 36px | 6px 12px | 0px | 12px | 1px |

## `.catalog-grid__sort`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 147.84375px | 44px | 0px | 0px | normal | 0px |
| 390 | page | 211.84375px | 44px | 0px | 0px | normal | 0px |
| 540 | page | 361.84375px | 44px | 0px | 0px | normal | 0px |
| 541 | page | 358.84375px | 44px | 0px | 0px | normal | 0px |
| 767 | page | 584.84375px | 44px | 0px | 0px | normal | 0px |
| 768 | page | 200px | 44px | 0px | 0px | normal | 0px |
| 1024 | page | 200px | 44px | 0px | 0px | normal | 0px |
| 1025 | page | 200px | 44px | 0px | 0px | normal | 0px |
| 1280 | page | 200px | 44px | 0px | 0px | normal | 0px |
| 1281 | page | 200px | 44px | 0px | 0px | normal | 0px |
| 1440 | page | 200px | 44px | 0px | 0px | normal | 0px |
| 1441 | page | 200px | 44px | 0px | 0px | normal | 0px |
| 1920 | page | 200px | 44px | 0px | 0px | normal | 0px |
| 2560 | page | 200px | 44px | 0px | 0px | normal | 0px |
| 3840 | page | 200px | 44px | 0px | 0px | normal | 0px |
| 390 | filters | 226.84375px | 44px | 0px | 0px | normal | 0px |

## `.catalog-map-trigger`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 120.90625px | 44px | 0px 12px | 0px | 10px | 1px |
| 390 | page | 120.90625px | 44px | 0px 12px | 0px | 10px | 1px |
| 540 | page | 120.90625px | 44px | 0px 12px | 0px | 10px | 1px |
| 541 | page | 124.734375px | 44px | 0px 12px | 0px | 10px | 1px |
| 767 | page | 124.734375px | 44px | 0px 12px | 0px | 10px | 1px |
| 768 | page | 132.734375px | 44px | 0px 16px | 0px | 10px | 1px |
| 1024 | page | 132.734375px | 44px | 0px 16px | 0px | 10px | 1px |
| 1025 | page | 132.734375px | 44px | 0px 16px | 0px | 10px | 1px |
| 1280 | page | 132.734375px | 44px | 0px 16px | 0px | 10px | 1px |
| 1281 | page | 132.734375px | 44px | 0px 16px | 0px | 10px | 1px |
| 1440 | page | 132.734375px | 44px | 0px 16px | 0px | 10px | 1px |
| 1441 | page | 140.375px | 44px | 0px 16px | 0px | 10px | 1px |
| 1920 | page | 140.375px | 44px | 0px 16px | 0px | 10px | 1px |
| 2560 | page | 140.375px | 44px | 0px 16px | 0px | 10px | 1px |
| 3840 | page | 140.375px | 44px | 0px 16px | 0px | 10px | 1px |

## `.catalog-map-trigger svg`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 20px | 20px | 0px | 0px | normal | 0px |
| 390 | page | 20px | 20px | 0px | 0px | normal | 0px |
| 540 | page | 20px | 20px | 0px | 0px | normal | 0px |
| 541 | page | 20px | 20px | 0px | 0px | normal | 0px |
| 767 | page | 20px | 20px | 0px | 0px | normal | 0px |
| 768 | page | 20px | 20px | 0px | 0px | normal | 0px |
| 1024 | page | 20px | 20px | 0px | 0px | normal | 0px |
| 1025 | page | 20px | 20px | 0px | 0px | normal | 0px |
| 1280 | page | 20px | 20px | 0px | 0px | normal | 0px |
| 1281 | page | 20px | 20px | 0px | 0px | normal | 0px |
| 1440 | page | 20px | 20px | 0px | 0px | normal | 0px |
| 1441 | page | 20px | 20px | 0px | 0px | normal | 0px |
| 1920 | page | 20px | 20px | 0px | 0px | normal | 0px |
| 2560 | page | 20px | 20px | 0px | 0px | normal | 0px |
| 3840 | page | 20px | 20px | 0px | 0px | normal | 0px |

## `.catalog-grid__inner`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 305px | 3754.8125px | 0px 22px | 0px | 0px | 0px |
| 390 | page | 375px | 3997.8125px | 0px 22px | 0px | 0px | 0px |
| 540 | page | 525px | 4300.8125px | 0px 22px | 0px | 0px | 0px |
| 541 | page | 526px | 2192.1875px | 0px 24px | 0px | 0px | 0px |
| 767 | page | 752px | 2316.875px | 0px 24px | 0px | 0px | 0px |
| 768 | page | 753px | 1960px | 0px 24px | 0px | 0px | 0px |
| 1024 | page | 1009px | 2130.03125px | 0px 40.8889px | 0px | 0px | 0px |
| 1025 | page | 1010px | 1452.9375px | 0px 40.9548px | 0px | 0px | 0px |
| 1280 | page | 1265px | 1410.8125px | 0px 57.7777px | 0px | 0px | 0px |
| 1281 | page | 1266px | 1411.25px | 0px 57.8437px | 0px | 0px | 0px |
| 1440 | page | 1425px | 1480.25px | 0px 68.3333px | 0px | 0px | 0px |
| 1441 | page | 1426px | 1480.71875px | 0px 68.3993px | 0px | 0px | 0px |
| 1920 | page | 1905px | 1688.59375px | 0px 100px | 0px | 0px | 0px |
| 2560 | page | 1920px | 1796.09375px | 0px | 0px 312.5px | 0px | 0px |
| 3840 | page | 1920px | 1796.09375px | 0px | 0px 952.5px | 0px | 0px |
| 390 | filters | 390px | 3693.3125px | 0px 22px | 0px | 0px | 0px |
| 390 | active-condition | 375px | 4045.8125px | 0px 22px | 0px | 0px | 0px |
| 390 | lot-cards | 375px | 4213.109375px | 0px 22px | 0px | 0px | 0px |
| 390 | rental-cards | 375px | 3045.265625px | 0px 22px | 0px | 0px | 0px |
| 390 | empty | 375px | 820.796875px | 0px 22px | 0px | 0px | 0px |
| 768 | lot-cards | 753px | 2086.578125px | 0px 24px | 0px | 0px | 0px |
| 768 | rental-cards | 753px | 1551.796875px | 0px 24px | 0px | 0px | 0px |
| 768 | empty | 753px | 587.6875px | 0px 24px | 0px | 0px | 0px |
| 1440 | lot-cards | 1425px | 1539.421875px | 0px 68.3333px | 0px | 0px | 0px |
| 1440 | rental-cards | 1425px | 1581.203125px | 0px 68.3333px | 0px | 0px | 0px |
| 1440 | empty | 1425px | 541.796875px | 0px 68.3333px | 0px | 0px | 0px |
| 1920 | lot-cards | 1905px | 1747.765625px | 0px 100px | 0px | 0px | 0px |
| 1920 | rental-cards | 1905px | 1789.546875px | 0px 100px | 0px | 0px | 0px |
| 1920 | empty | 1905px | 541.796875px | 0px 100px | 0px | 0px | 0px |

## `.catalog-grid__list`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 261px | 3163.125px | 0px | 0px | 24px | 0px |
| 390 | page | 331px | 3406.125px | 0px | 0px | 24px | 0px |
| 540 | page | 481px | 3709.125px | 0px | 0px | 24px | 0px |
| 541 | page | 478px | 1600.5px | 0px | 0px | 24px | 0px |
| 767 | page | 704px | 1725.1875px | 0px | 0px | 24px | 0px |
| 768 | page | 705px | 1540.3125px | 0px | 0px | 24px | 0px |
| 1024 | page | 927.25px | 1790.34375px | 0px | 0px | 24px | 0px |
| 1025 | page | 928.09375px | 1113.25px | 0px | 0px | 24px | 0px |
| 1280 | page | 1149.46875px | 1071.125px | 0px | 0px | 24px | 0px |
| 1281 | page | 1150.34375px | 1071.5625px | 0px | 0px | 24px | 0px |
| 1440 | page | 1288.34375px | 1140.5625px | 0px | 0px | 24px | 0px |
| 1441 | page | 1289.21875px | 1141.03125px | 0px | 0px | 24px | 0px |
| 1920 | page | 1705.03125px | 1348.90625px | 0px | 0px | 24px | 0px |
| 2560 | page | 1920px | 1456.40625px | 0px | 0px | 24px | 0px |
| 3840 | page | 1920px | 1456.40625px | 0px | 0px | 24px | 0px |
| 390 | filters | 346px | 3101.625px | 0px | 0px | 24px | 0px |
| 390 | lot-cards | 331px | 3730.21875px | 0px | 0px | 24px | 0px |
| 390 | rental-cards | 331px | 2562.375px | 0px | 0px | 24px | 0px |
| 390 | empty | 331px | 0px | 0px | 0px | 24px | 0px |
| 768 | lot-cards | 705px | 1705.6875px | 0px | 0px | 24px | 0px |
| 768 | rental-cards | 705px | 1170.90625px | 0px | 0px | 24px | 0px |
| 768 | empty | 705px | 0px | 0px | 0px | 24px | 0px |
| 1440 | lot-cards | 1288.34375px | 1238.53125px | 0px | 0px | 24px | 0px |
| 1440 | rental-cards | 1288.34375px | 1280.3125px | 0px | 0px | 24px | 0px |
| 1440 | empty | 1288.34375px | 0px | 0px | 0px | 24px | 0px |
| 1920 | lot-cards | 1705.03125px | 1446.875px | 0px | 0px | 24px | 0px |
| 1920 | rental-cards | 1705.03125px | 1488.65625px | 0px | 0px | 24px | 0px |
| 1920 | empty | 1705.03125px | 0px | 0px | 0px | 24px | 0px |

## `.catalog-grid__item`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 261px | 507.1875px | 0px | 0px | normal | 0px |
| 390 | page | 331px | 547.6875px | 0px | 0px | normal | 0px |
| 540 | page | 481px | 598.1875px | 0px | 0px | normal | 0px |
| 541 | page | 227px | 517.5px | 0px | 0px | normal | 0px |
| 767 | page | 340px | 559.0625px | 0px | 0px | normal | 0px |
| 768 | page | 340.5px | 497.4375px | 0px | 0px | normal | 0px |
| 1024 | page | 451.625px | 580.78125px | 0px | 0px | normal | 0px |
| 1025 | page | 293.359375px | 544.625px | 0px | 0px | normal | 0px |
| 1280 | page | 367.15625px | 523.5625px | 0px | 0px | normal | 0px |
| 1281 | page | 367.4375px | 523.78125px | 0px | 0px | normal | 0px |
| 1440 | page | 413.4375px | 558.28125px | 0px | 0px | normal | 0px |
| 1441 | page | 413.734375px | 558.515625px | 0px | 0px | normal | 0px |
| 1920 | page | 552.34375px | 662.453125px | 0px | 0px | normal | 0px |
| 2560 | page | 624px | 716.203125px | 0px | 0px | normal | 0px |
| 3840 | page | 624px | 716.203125px | 0px | 0px | normal | 0px |
| 390 | filters | 346px | 496.9375px | 0px | 0px | normal | 0px |
| 390 | lot-cards | 331px | 601.703125px | 0px | 0px | normal | 0px |
| 390 | rental-cards | 331px | 622.59375px | 0px | 0px | normal | 0px |
| 768 | lot-cards | 340.5px | 552.5625px | 0px | 0px | normal | 0px |
| 768 | rental-cards | 340.5px | 573.453125px | 0px | 0px | normal | 0px |
| 1440 | lot-cards | 413.4375px | 607.265625px | 0px | 0px | normal | 0px |
| 1440 | rental-cards | 413.4375px | 628.15625px | 0px | 0px | normal | 0px |
| 1920 | lot-cards | 552.34375px | 711.4375px | 0px | 0px | normal | 0px |
| 1920 | rental-cards | 552.34375px | 732.328125px | 0px | 0px | normal | 0px |

## `.apartment-card`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 261px | 507.1875px | 0px 0px 18px | 0px | normal | 0px |
| 390 | page | 331px | 547.6875px | 0px 0px 18px | 0px | normal | 0px |
| 540 | page | 481px | 598.1875px | 0px 0px 18px | 0px | normal | 0px |
| 541 | page | 227px | 517.5px | 0px 0px 18px | 0px | normal | 0px |
| 767 | page | 340px | 559.0625px | 0px 0px 18px | 0px | normal | 0px |
| 768 | page | 340.5px | 497.4375px | 0px 0px 18px | 0px | normal | 0px |
| 1024 | page | 451.625px | 580.78125px | 0px 0px 18px | 0px | normal | 0px |
| 1025 | page | 293.359375px | 544.625px | 0px 0px 18px | 0px | normal | 0px |
| 1280 | page | 367.15625px | 523.5625px | 0px 0px 18px | 0px | normal | 0px |
| 1281 | page | 367.4375px | 523.78125px | 0px 0px 18px | 0px | normal | 0px |
| 1440 | page | 413.4375px | 558.28125px | 0px 0px 18px | 0px | normal | 0px |
| 1441 | page | 413.734375px | 558.515625px | 0px 0px 18px | 0px | normal | 0px |
| 1920 | page | 552.34375px | 662.453125px | 0px 0px 18px | 0px | normal | 0px |
| 2560 | page | 624px | 716.203125px | 0px 0px 18px | 0px | normal | 0px |
| 3840 | page | 624px | 716.203125px | 0px 0px 18px | 0px | normal | 0px |
| 390 | filters | 346px | 496.9375px | 0px 0px 18px | 0px | normal | 0px |
| 390 | lot-cards | 331px | 601.703125px | 0px 0px 18px | 0px | normal | 0px |
| 390 | rental-cards | 331px | 622.59375px | 0px 0px 18px | 0px | normal | 0px |
| 768 | lot-cards | 340.5px | 552.5625px | 0px 0px 18px | 0px | normal | 0px |
| 768 | rental-cards | 340.5px | 573.453125px | 0px 0px 18px | 0px | normal | 0px |
| 1440 | lot-cards | 413.4375px | 607.265625px | 0px 0px 18px | 0px | normal | 0px |
| 1440 | rental-cards | 413.4375px | 628.15625px | 0px 0px 18px | 0px | normal | 0px |
| 1920 | lot-cards | 552.34375px | 711.4375px | 0px 0px 18px | 0px | normal | 0px |
| 1920 | rental-cards | 552.34375px | 732.328125px | 0px 0px 18px | 0px | normal | 0px |

## `.apartment-card__image`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 261px | 195.75px | 0px | 0px | normal | 0px |
| 390 | page | 331px | 248.25px | 0px | 0px | normal | 0px |
| 540 | page | 481px | 360.75px | 0px | 0px | normal | 0px |
| 541 | page | 227px | 170.25px | 0px | 0px | normal | 0px |
| 767 | page | 340px | 255px | 0px | 0px | normal | 0px |
| 768 | page | 340.5px | 255.375px | 0px | 0px | normal | 0px |
| 1024 | page | 451.625px | 338.71875px | 0px | 0px | normal | 0px |
| 1025 | page | 293.359375px | 220.015625px | 0px | 0px | normal | 0px |
| 1280 | page | 367.15625px | 275.359375px | 0px | 0px | normal | 0px |
| 1281 | page | 367.4375px | 275.578125px | 0px | 0px | normal | 0px |
| 1440 | page | 413.4375px | 310.078125px | 0px | 0px | normal | 0px |
| 1441 | page | 413.734375px | 310.296875px | 0px | 0px | normal | 0px |
| 1920 | page | 552.34375px | 414.25px | 0px | 0px | normal | 0px |
| 2560 | page | 624px | 468px | 0px | 0px | normal | 0px |
| 3840 | page | 624px | 468px | 0px | 0px | normal | 0px |
| 390 | filters | 346px | 259.5px | 0px | 0px | normal | 0px |

## `.apartment-card__body`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 237px | 192.4375px | 20px 18px 0px | -35px 12px 0px | normal | 0px |
| 390 | page | 307px | 180.4375px | 20px 18px 0px | -35px 12px 0px | normal | 0px |
| 540 | page | 457px | 180.4375px | 20px 18px 0px | -35px 12px 0px | normal | 0px |
| 541 | page | 203px | 228.25px | 20px 18px 0px | -35px 12px 0px | normal | 0px |
| 767 | page | 316px | 185.0625px | 20px 18px 0px | -35px 12px 0px | normal | 0px |
| 768 | page | 316.5px | 185.0625px | 20px 18px 0px | -35px 12px 0px | normal | 0px |
| 1024 | page | 427.625px | 185.0625px | 20px 18px 0px | -35px 12px 0px | normal | 0px |
| 1025 | page | 269.359375px | 205.609375px | 20px 18px 0px | -35px 12px 0px | normal | 0px |
| 1280 | page | 343.15625px | 191.203125px | 20px 18px 0px | -35px 12px 0px | normal | 0px |
| 1281 | page | 343.4375px | 191.203125px | 20px 18px 0px | -35px 12px 0px | normal | 0px |
| 1440 | page | 389.4375px | 191.203125px | 20px 18px 0px | -35px 12px 0px | normal | 0px |
| 1441 | page | 389.734375px | 191.21875px | 20px 18px 0px | -35px 12px 0px | normal | 0px |
| 1920 | page | 528.34375px | 191.203125px | 20px 18px 0px | -35px 12px 0px | normal | 0px |
| 2560 | page | 600px | 191.203125px | 20px 18px 0px | -35px 12px 0px | normal | 0px |
| 3840 | page | 600px | 191.203125px | 20px 18px 0px | -35px 12px 0px | normal | 0px |
| 390 | filters | 322px | 180.4375px | 20px 18px 0px | -35px 12px 0px | normal | 0px |
| 390 | lot-cards | 307px | 234.453125px | 20px 18px 0px | -35px 12px 0px | normal | 0px |
| 390 | rental-cards | 307px | 255.34375px | 20px 18px 0px | -35px 12px 0px | normal | 0px |
| 768 | lot-cards | 316.5px | 240.1875px | 20px 18px 0px | -35px 12px 0px | normal | 0px |
| 768 | rental-cards | 316.5px | 261.078125px | 20px 18px 0px | -35px 12px 0px | normal | 0px |
| 1440 | lot-cards | 389.4375px | 240.1875px | 20px 18px 0px | -35px 12px 0px | normal | 0px |
| 1440 | rental-cards | 389.4375px | 261.078125px | 20px 18px 0px | -35px 12px 0px | normal | 0px |
| 1920 | lot-cards | 528.34375px | 240.1875px | 20px 18px 0px | -35px 12px 0px | normal | 0px |
| 1920 | rental-cards | 528.34375px | 261.078125px | 20px 18px 0px | -35px 12px 0px | normal | 0px |

## `.apartment-card__actions`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 237px | 136px | 20px 18px 0px | 0px 12px | 8px | 0px |
| 390 | page | 307px | 136px | 20px 18px 0px | 0px 12px | 8px | 0px |
| 540 | page | 457px | 74px | 20px 18px 0px | 0px 12px | 8px | 0px |
| 541 | page | 203px | 136px | 20px 18px 0px | 0px 12px | 8px | 0px |
| 767 | page | 316px | 136px | 20px 18px 0px | 0px 12px | 8px | 0px |
| 768 | page | 316.5px | 74px | 20px 18px 0px | 0px 12px | 8px | 0px |
| 1024 | page | 427.625px | 74px | 20px 18px 0px | 0px 12px | 8px | 0px |
| 1025 | page | 269.359375px | 136px | 20px 18px 0px | 0px 12px | 8px | 0px |
| 1280 | page | 343.15625px | 74px | 20px 18px 0px | 0px 12px | 8px | 0px |
| 1281 | page | 343.4375px | 74px | 20px 18px 0px | 0px 12px | 8px | 0px |
| 1440 | page | 389.4375px | 74px | 20px 18px 0px | 0px 12px | 8px | 0px |
| 1441 | page | 389.734375px | 74px | 20px 18px 0px | 0px 12px | 8px | 0px |
| 1920 | page | 528.34375px | 74px | 20px 18px 0px | 0px 12px | 8px | 0px |
| 2560 | page | 600px | 74px | 20px 18px 0px | 0px 12px | 8px | 0px |
| 3840 | page | 600px | 74px | 20px 18px 0px | 0px 12px | 8px | 0px |
| 390 | filters | 322px | 74px | 20px 18px 0px | 0px 12px | 8px | 0px |

## `.apartment-card__favorite`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 40px | 40px | 0px | 0px | normal | 50% |
| 390 | page | 40px | 40px | 0px | 0px | normal | 50% |
| 540 | page | 40px | 40px | 0px | 0px | normal | 50% |
| 541 | page | 40px | 40px | 0px | 0px | normal | 50% |
| 767 | page | 40px | 40px | 0px | 0px | normal | 50% |
| 768 | page | 40px | 40px | 0px | 0px | normal | 50% |
| 1024 | page | 40px | 40px | 0px | 0px | normal | 50% |
| 1025 | page | 40px | 40px | 0px | 0px | normal | 50% |
| 1280 | page | 40px | 40px | 0px | 0px | normal | 50% |
| 1281 | page | 40px | 40px | 0px | 0px | normal | 50% |
| 1440 | page | 40px | 40px | 0px | 0px | normal | 50% |
| 1441 | page | 40px | 40px | 0px | 0px | normal | 50% |
| 1920 | page | 40px | 40px | 0px | 0px | normal | 50% |
| 2560 | page | 40px | 40px | 0px | 0px | normal | 50% |
| 3840 | page | 40px | 40px | 0px | 0px | normal | 50% |

## `.listing-card-fact`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 60.328125px | 33.25px | 0px | 0px | normal | 0px |
| 390 | page | 83.65625px | 33.25px | 0px | 0px | normal | 0px |
| 540 | page | 133.65625px | 33.25px | 0px | 0px | normal | 0px |
| 541 | page | 49px | 33.25px | 0px | 0px | normal | 0px |
| 767 | page | 86.65625px | 33.25px | 0px | 0px | normal | 0px |
| 768 | page | 86.828125px | 33.25px | 0px | 0px | normal | 0px |
| 1024 | page | 123.875px | 33.25px | 0px | 0px | normal | 0px |
| 1025 | page | 71.109375px | 39.390625px | 0px | 0px | normal | 0px |
| 1280 | page | 95.71875px | 39.390625px | 0px | 0px | normal | 0px |
| 1281 | page | 95.8125px | 39.390625px | 0px | 0px | normal | 0px |
| 1440 | page | 111.140625px | 39.390625px | 0px | 0px | normal | 0px |
| 1441 | page | 111.234375px | 39.390625px | 0px | 0px | normal | 0px |
| 1920 | page | 157.4375px | 39.390625px | 0px | 0px | normal | 0px |
| 2560 | page | 181.328125px | 39.390625px | 0px | 0px | normal | 0px |
| 3840 | page | 181.328125px | 39.390625px | 0px | 0px | normal | 0px |
| 390 | filters | 88.65625px | 33.25px | 0px | 0px | normal | 0px |

## `.catalog-grid__footer`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 261px | 71.6875px | 16px 0px 0px | 0px | 14px | 0px |
| 390 | page | 331px | 71.6875px | 16px 0px 0px | 0px | 14px | 0px |
| 540 | page | 481px | 71.6875px | 16px 0px 0px | 0px | 14px | 0px |
| 541 | page | 478px | 71.6875px | 16px 0px 0px | 0px | 14px | 0px |
| 767 | page | 704px | 71.6875px | 16px 0px 0px | 0px | 14px | 0px |
| 768 | page | 705px | 71.6875px | 16px 0px 0px | 0px | 14px | 0px |
| 1024 | page | 927.25px | 71.6875px | 16px 0px 0px | 0px | 14px | 0px |
| 1025 | page | 928.09375px | 71.6875px | 16px 0px 0px | 0px | 14px | 0px |
| 1280 | page | 1149.46875px | 71.6875px | 16px 0px 0px | 0px | 14px | 0px |
| 1281 | page | 1150.34375px | 71.6875px | 16px 0px 0px | 0px | 14px | 0px |
| 1440 | page | 1288.34375px | 71.6875px | 16px 0px 0px | 0px | 14px | 0px |
| 1441 | page | 1289.21875px | 71.6875px | 16px 0px 0px | 0px | 14px | 0px |
| 1920 | page | 1705.03125px | 71.6875px | 16px 0px 0px | 0px | 14px | 0px |
| 2560 | page | 1920px | 71.6875px | 16px 0px 0px | 0px | 14px | 0px |
| 3840 | page | 1920px | 71.6875px | 16px 0px 0px | 0px | 14px | 0px |
| 390 | filters | 346px | 71.6875px | 16px 0px 0px | 0px | 14px | 0px |
| 390 | lot-cards | 331px | 32.890625px | 16px 0px 0px | 0px | 14px | 0px |
| 768 | lot-cards | 705px | 32.890625px | 16px 0px 0px | 0px | 14px | 0px |
| 1440 | lot-cards | 1288.34375px | 32.890625px | 16px 0px 0px | 0px | 14px | 0px |
| 1920 | lot-cards | 1705.03125px | 32.890625px | 16px 0px 0px | 0px | 14px | 0px |

## `.catalog-grid__more`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 181.609375px | 24.796875px | 0px 0px 7px | 0px | 12px | 0px |
| 390 | page | 181.609375px | 24.796875px | 0px 0px 7px | 0px | 12px | 0px |
| 540 | page | 181.609375px | 24.796875px | 0px 0px 7px | 0px | 12px | 0px |
| 541 | page | 181.609375px | 24.796875px | 0px 0px 7px | 0px | 12px | 0px |
| 767 | page | 181.609375px | 24.796875px | 0px 0px 7px | 0px | 12px | 0px |
| 768 | page | 181.609375px | 24.796875px | 0px 0px 7px | 0px | 12px | 0px |
| 1024 | page | 181.609375px | 24.796875px | 0px 0px 7px | 0px | 12px | 0px |
| 1025 | page | 181.609375px | 24.796875px | 0px 0px 7px | 0px | 12px | 0px |
| 1280 | page | 181.609375px | 24.796875px | 0px 0px 7px | 0px | 12px | 0px |
| 1281 | page | 181.609375px | 24.796875px | 0px 0px 7px | 0px | 12px | 0px |
| 1440 | page | 181.609375px | 24.796875px | 0px 0px 7px | 0px | 12px | 0px |
| 1441 | page | 181.609375px | 24.796875px | 0px 0px 7px | 0px | 12px | 0px |
| 1920 | page | 181.609375px | 24.796875px | 0px 0px 7px | 0px | 12px | 0px |
| 2560 | page | 181.609375px | 24.796875px | 0px 0px 7px | 0px | 12px | 0px |
| 3840 | page | 181.609375px | 24.796875px | 0px 0px 7px | 0px | 12px | 0px |

## `.catalog-empty`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | empty | 331px | 252.796875px | 50px 20px | 0px | normal | 0px |
| 768 | empty | 705px | 239.6875px | 50px 20px | 0px | normal | 0px |
| 1440 | empty | 1288.34375px | 273.796875px | 50px 20px | 0px | normal | 0px |
| 1920 | empty | 1705.03125px | 273.796875px | 50px 20px | 0px | normal | 0px |

## `.resort-quick-dropdown`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | department-dropdown | 329px | 267px | 8px | 0px | normal | 1px |
| 390 | market-dropdown | 329px | 179.78125px | 8px | 0px | normal | 1px |
| 390 | sort-dropdown | 220px | 316px | 8px | 0px | normal | 1px |
| 768 | department-dropdown | 342.5px | 267px | 8px | 0px | normal | 1px |
| 768 | market-dropdown | 220px | 179.78125px | 8px | 0px | normal | 1px |
| 768 | sort-dropdown | 220px | 316px | 8px | 0px | normal | 1px |
| 1440 | department-dropdown | 256.40625px | 267px | 8px | 0px | normal | 1px |
| 1440 | market-dropdown | 256.40625px | 179.78125px | 8px | 0px | normal | 1px |
| 1440 | sort-dropdown | 220px | 316px | 8px | 0px | normal | 1px |
| 1920 | department-dropdown | 343.21875px | 267px | 8px | 0px | normal | 1px |
| 1920 | market-dropdown | 343.21875px | 179.78125px | 8px | 0px | normal | 1px |
| 1920 | sort-dropdown | 220px | 316px | 8px | 0px | normal | 1px |

## `.catalog-quick-filters__dropdown-header`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | market-dropdown | 311px | 49px | 8px 10px 12px 7px | 0px 0px 4px | 16px | 0px |
| 390 | sort-dropdown | 202px | 49px | 8px 10px 12px | 0px 0px 4px | 16px | 0px |
| 768 | market-dropdown | 202px | 49px | 8px 10px 12px 3px | 0px 0px 4px | 16px | 0px |
| 768 | sort-dropdown | 202px | 49px | 8px 10px 12px | 0px 0px 4px | 16px | 0px |
| 1440 | market-dropdown | 238.40625px | 49px | 8px 10px 12px 11px | 0px 0px 4px | 16px | 0px |
| 1440 | sort-dropdown | 202px | 49px | 8px 10px 12px | 0px 0px 4px | 16px | 0px |
| 1920 | market-dropdown | 325.21875px | 49px | 8px 10px 12px 11px | 0px 0px 4px | 16px | 0px |
| 1920 | sort-dropdown | 202px | 49px | 8px 10px 12px | 0px 0px 4px | 16px | 0px |

## `.catalog-quick-filters__options`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | department-dropdown | 311px | 240px | 0px | 9px 0px 0px | 5px | 0px |
| 390 | market-dropdown | 311px | 103.78125px | 0px | 9px 0px 0px | 5px | 0px |
| 390 | sort-dropdown | 202px | 240px | 0px | 9px 0px 0px | 5px | 0px |
| 768 | department-dropdown | 324.5px | 240px | 0px | 9px 0px 0px | 5px | 0px |
| 768 | market-dropdown | 202px | 103.78125px | 0px | 9px 0px 0px | 5px | 0px |
| 768 | sort-dropdown | 202px | 240px | 0px | 9px 0px 0px | 5px | 0px |
| 1440 | department-dropdown | 238.40625px | 240px | 0px | 9px 0px 0px | 5px | 0px |
| 1440 | market-dropdown | 238.40625px | 103.78125px | 0px | 9px 0px 0px | 5px | 0px |
| 1440 | sort-dropdown | 202px | 240px | 0px | 9px 0px 0px | 5px | 0px |
| 1920 | department-dropdown | 325.21875px | 240px | 0px | 9px 0px 0px | 5px | 0px |
| 1920 | market-dropdown | 325.21875px | 103.78125px | 0px | 9px 0px 0px | 5px | 0px |
| 1920 | sort-dropdown | 202px | 240px | 0px | 9px 0px 0px | 5px | 0px |

## `.resort-filters`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | filters | 390px | 1000px | 0px | 0px | normal | 0px |
| 768 | filters | 753px | 1000px | 24px | 0px | normal | 0px |
| 1440 | filters | 1425px | 1000px | 24px | 0px | normal | 0px |
| 1920 | filters | 1905px | 1000px | 24px | 0px | normal | 0px |

## `.hero-filter-modal__header`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | filters | 390px | 65px | 18px 18px 16px | 0px | 16px | 0px |
| 768 | filters | 640px | 76px | 24px 26px 21px | 0px | 16px | 0px |
| 1440 | filters | 640px | 76px | 24px 26px 21px | 0px | 16px | 0px |
| 1920 | filters | 640px | 76px | 24px 26px 21px | 0px | 16px | 0px |

## `.hero-filter-modal__body`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | filters | 390px | 774px | 0px 18px | 0px | normal | 0px |
| 768 | filters | 640px | 765px | 0px 26px | 0px | normal | 0px |
| 1440 | filters | 640px | 765px | 0px 26px | 0px | normal | 0px |
| 1920 | filters | 640px | 765px | 0px 26px | 0px | normal | 0px |

## `.hero-filter-modal__footer`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | filters | 390px | 161px | 14px 18px 18px | 0px | 12px | 0px |
| 768 | filters | 640px | 111px | 18px 26px 22px | 0px | 12px | 0px |
| 1440 | filters | 640px | 111px | 18px 26px 22px | 0px | 12px | 0px |
| 1920 | filters | 640px | 111px | 18px 26px 22px | 0px | 12px | 0px |

## `.hero-filter-panel-content__group`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | filters | 354px | 181.296875px | 22px 0px 23px | 0px | normal | 0px |
| 768 | filters | 588px | 129.296875px | 22px 0px 23px | 0px | normal | 0px |
| 1440 | filters | 588px | 129.296875px | 22px 0px 23px | 0px | normal | 0px |
| 1920 | filters | 588px | 129.296875px | 22px 0px 23px | 0px | normal | 0px |

## `.hero-filter-panel-content__range-input`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | filters | 172px | 44px | 0px 13px | 0px | normal | 1px |
| 768 | filters | 289px | 44px | 0px 13px | 0px | normal | 1px |
| 1440 | filters | 289px | 44px | 0px 13px | 0px | normal | 1px |
| 1920 | filters | 289px | 44px | 0px 13px | 0px | normal | 1px |

## `.ui-checkbox--chip`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | filters | 122.34375px | 44px | 7px 13px | 0px | 0px | 1px |
| 768 | filters | 122.34375px | 44px | 7px 13px | 0px | 0px | 1px |
| 1440 | filters | 122.34375px | 44px | 7px 13px | 0px | 0px | 1px |
| 1920 | filters | 122.34375px | 44px | 7px 13px | 0px | 0px | 1px |

## `.ui-checkbox__box`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | filters | 17px | 17px | 0px | 0px | normal | 2px |
| 768 | filters | 17px | 17px | 0px | 0px | normal | 2px |
| 1440 | filters | 17px | 17px | 0px | 0px | normal | 2px |
| 1920 | filters | 17px | 17px | 0px | 0px | normal | 2px |

## `.site-menu`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | burger | 375px | 923px | 0px | 0px | normal | 0px |
| 768 | burger | 753px | 889px | 0px | 0px | normal | 0px |
| 1440 | burger | 1425px | 889px | 0px | 0px | normal | 0px |
| 1920 | burger | 1905px | 889px | 0px | 0px | normal | 0px |

## `.site-menu__inner`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | burger | 375px | 2068.453125px | 20px 22px 24px | 0px | normal | 0px |
| 768 | burger | 753px | 2549.515625px | 24px 24px 40px | 0px | normal | 0px |
| 1440 | burger | 1425px | 997px | 40px 68.3333px | 0px | normal | 0px |
| 1920 | burger | 1905px | 1073px | 40px 100px | 0px | normal | 0px |

## `.site-menu__main`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1440 | burger | 1288.34375px | 750px | 0px 0px 40px | 0px | 40px | 0px |
| 1920 | burger | 1705.03125px | 856px | 0px 0px 56px | 0px | 72px | 0px |

## `.site-menu__nav`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | burger | 331px | 860px | 0px 0px 24px | 0px | 32px | 0px |
| 768 | burger | 705px | 750px | 0px 0px 40px | 0px | 32px | 0px |
| 1440 | burger | 420px | 710px | 0px | 0px | 32px | 0px |
| 1920 | burger | 500px | 800px | 0px | 0px | 48px | 0px |

## `.site-menu__bottom`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | burger | 331px | 466px | 24px 0px 0px | 0px | 24px | 0px |
| 768 | burger | 705px | 466px | 24px 0px 0px | 0px | 24px | 0px |
| 1440 | burger | 1288.34375px | 166px | 24px 0px 0px | 0px | 28px | 0px |
| 1920 | burger | 1705.03125px | 136px | 28px 0px 0px | 0px | 40px | 0px |

## `.catalog-header-dropdown`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1440 | header-dropdown | 220px | 252px | 30px 18px 8px | 0px | normal | 1px |
| 1920 | header-dropdown | 220px | 268px | 30px 18px 8px | 0px | normal | 1px |

## `.catalog-header-dropdown__list`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1440 | header-dropdown | 182px | 212px | 0px | 0px | 12px | 0px |
| 1920 | header-dropdown | 182px | 228px | 0px | 0px | 12px | 0px |

## `.map-browser`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | map | 390px | 1000px | 0px | 0px | normal | 0px |
| 768 | map | 753px | 1000px | 0px | 0px | normal | 0px |
| 1440 | map | 1425px | 1000px | 0px | 0px | normal | 0px |
| 1920 | map | 1905px | 1000px | 0px | 0px | normal | 0px |

## `.map-browser__panel`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | map | 390px | 850px | 0px | 0px | normal | 0px |
| 768 | map | 420px | 1000px | 0px | 0px | normal | 0px |
| 1440 | map | 420px | 1000px | 0px | 0px | normal | 0px |
| 1920 | map | 420px | 1000px | 0px | 0px | normal | 0px |

## `.map-browser__handle`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | map | 390px | 32px | 10px | 0px | normal | 0px |

## `.map-browser__search-row`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | map | 358px | 58px | 0px | 0px 16px 12px | 16px | 0px |
| 768 | map | 380px | 58px | 0px | 0px 20px 16px | 16px | 0px |
| 1440 | map | 380px | 58px | 0px | 0px 20px 16px | 16px | 0px |
| 1920 | map | 380px | 58px | 0px | 0px 20px 16px | 16px | 0px |

## `.map-browser__search`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | map | 294px | 58px | 0px 8px | 0px | 12px | 0px |
| 768 | map | 316px | 58px | 0px 8px | 0px | 12px | 0px |
| 1440 | map | 316px | 58px | 0px 8px | 0px | 12px | 0px |
| 1920 | map | 316px | 58px | 0px 8px | 0px | 12px | 0px |

## `.map-browser__filters`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | map | 358px | 366px | 0px | 0px 16px 12px | 12px 16px | 0px |
| 768 | map | 380px | 366px | 0px | 0px 20px 16px | 12px 16px | 0px |
| 1440 | map | 380px | 366px | 0px | 0px 20px 16px | 12px 16px | 0px |
| 1920 | map | 380px | 366px | 0px | 0px 20px 16px | 12px 16px | 0px |

## `.map-browser__field`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | map | 358px | 58px | 4px 4px 0px 8px | 0px | 12px | 0px |
| 768 | map | 380px | 58px | 4px 4px 0px 8px | 0px | 12px | 0px |
| 1440 | map | 380px | 58px | 4px 4px 0px 8px | 0px | 12px | 0px |
| 1920 | map | 380px | 58px | 4px 4px 0px 8px | 0px | 12px | 0px |

## `.map-browser__market`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | map | 358px | 40px | 0px | 0px | 24px | 0px |
| 768 | map | 380px | 40px | 0px | 0px | 24px | 0px |
| 1440 | map | 380px | 40px | 0px | 0px | 24px | 0px |
| 1920 | map | 380px | 40px | 0px | 0px | 24px | 0px |

## `.map-browser__card`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | map | 358px | 364.8125px | 0px 0px 24px | 0px 0px 24px | normal | 0px |
| 768 | map | 380px | 379.875px | 0px 0px 24px | 0px 0px 24px | normal | 0px |
| 1440 | map | 380px | 379.875px | 0px 0px 24px | 0px 0px 24px | normal | 0px |
| 1920 | map | 380px | 379.875px | 0px 0px 24px | 0px 0px 24px | normal | 0px |

## `.map-browser__close`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | map | 44px | 44px | 1px 6px | 0px | normal | 0px |
| 768 | map | 44px | 44px | 1px 6px | 0px | normal | 0px |
| 1440 | map | 44px | 44px | 1px 6px | 0px | normal | 0px |
| 1920 | map | 44px | 44px | 1px 6px | 0px | normal | 0px |

## `.map-browser__zoom`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | map | 86px | 44px | 0px | 0px | normal | 0px |
| 768 | map | 44px | 86px | 0px | 0px | normal | 0px |
| 1440 | map | 44px | 86px | 0px | 0px | normal | 0px |
| 1920 | map | 44px | 86px | 0px | 0px | normal | 0px |

## `.site-footer`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 305px | 1675.71875px | 0px 15.2157px | 0px | normal | 0px |
| 390 | page | 375px | 1675.71875px | 0px 16.5882px | 0px | normal | 0px |
| 540 | page | 525px | 1675.71875px | 0px 19.5294px | 0px | normal | 0px |
| 541 | page | 526px | 2044.34375px | 0px | 0px | normal | 0px |
| 767 | page | 752px | 2044.34375px | 0px | 0px | normal | 0px |
| 768 | page | 753px | 2044.34375px | 0px | 0px | normal | 0px |
| 1024 | page | 1009px | 2044.34375px | 0px | 0px | normal | 0px |
| 1025 | page | 1010px | 1369.5625px | 0px | 0px | normal | 0px |
| 1280 | page | 1265px | 1209.5625px | 0px | 0px | normal | 0px |
| 1281 | page | 1266px | 1209.5625px | 0px | 0px | normal | 0px |
| 1440 | page | 1425px | 1209.5625px | 0px | 0px | normal | 0px |
| 1441 | page | 1426px | 1262.15625px | 0px | 0px | normal | 0px |
| 1920 | page | 1905px | 1262.15625px | 0px | 0px | normal | 0px |
| 2560 | page | 2545px | 1262.15625px | 0px | 0px | normal | 0px |
| 3840 | page | 3825px | 1262.15625px | 0px | 0px | normal | 0px |
| 390 | filters | 390px | 1675.71875px | 0px 16.5882px | 0px | normal | 0px |

## `.site-footer__inner`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 274.59375px | 1675.71875px | 32px 23px 28px | 0px | normal | 0px |
| 390 | page | 341.84375px | 1675.71875px | 32px 23px 28px | 0px | normal | 0px |
| 540 | page | 485.96875px | 1675.71875px | 32px 23px 28px | 0px | normal | 0px |
| 541 | page | 526px | 2044.34375px | 40px 24px 28px | 0px | normal | 0px |
| 767 | page | 752px | 2044.34375px | 40px 24px 28px | 0px | normal | 0px |
| 768 | page | 753px | 2044.34375px | 40px 24px 28px | 0px | normal | 0px |
| 1024 | page | 1009px | 2044.34375px | 40px 40.8889px 28px | 0px | normal | 0px |
| 1025 | page | 1010px | 1369.5625px | 55px 40.9548px 50px | 0px | normal | 0px |
| 1280 | page | 1265px | 1209.5625px | 55px 57.7777px 50px | 0px | normal | 0px |
| 1281 | page | 1266px | 1209.5625px | 55px 57.8437px 50px | 0px | normal | 0px |
| 1440 | page | 1425px | 1209.5625px | 55px 68.3333px 50px | 0px | normal | 0px |
| 1441 | page | 1426px | 1262.15625px | 55px 68.3993px 50px | 0px | normal | 0px |
| 1920 | page | 1905px | 1262.15625px | 55px 100px 50px | 0px | normal | 0px |
| 2560 | page | 1920px | 1262.15625px | 55px 0px 50px | 0px 312.5px | normal | 0px |
| 3840 | page | 1920px | 1262.15625px | 55px 0px 50px | 0px 952.5px | normal | 0px |
| 390 | filters | 356.84375px | 1675.71875px | 32px 23px 28px | 0px | normal | 0px |

## `.site-footer__logo img`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 129.203125px | 36px | 0px | 0px | normal | 0px |
| 390 | page | 129.203125px | 36px | 0px | 0px | normal | 0px |
| 540 | page | 129.203125px | 36px | 0px | 0px | normal | 0px |
| 541 | page | 172.265625px | 48px | 0px | 0px | normal | 0px |
| 767 | page | 172.265625px | 48px | 0px | 0px | normal | 0px |
| 768 | page | 172.265625px | 48px | 0px | 0px | normal | 0px |
| 1024 | page | 172.265625px | 48px | 0px | 0px | normal | 0px |
| 1025 | page | 172.265625px | 48px | 0px | 0px | normal | 0px |
| 1280 | page | 172.265625px | 48px | 0px | 0px | normal | 0px |
| 1281 | page | 172.265625px | 48px | 0px | 0px | normal | 0px |
| 1440 | page | 172.265625px | 48px | 0px | 0px | normal | 0px |
| 1441 | page | 172.265625px | 48px | 0px | 0px | normal | 0px |
| 1920 | page | 172.265625px | 48px | 0px | 0px | normal | 0px |
| 2560 | page | 172.265625px | 48px | 0px | 0px | normal | 0px |
| 3840 | page | 172.265625px | 48px | 0px | 0px | normal | 0px |

## `.site-footer__column`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 105.296875px | 248.296875px | 0px | 0px | normal | 0px |
| 390 | page | 138.921875px | 248.296875px | 0px | 0px | normal | 0px |
| 540 | page | 210.984375px | 248.296875px | 0px | 0px | normal | 0px |
| 541 | page | 229px | 302px | 0px | 0px | normal | 0px |
| 767 | page | 342px | 302px | 0px | 0px | normal | 0px |
| 768 | page | 342.5px | 302px | 0px | 0px | normal | 0px |
| 1024 | page | 453.625px | 302px | 0px | 0px | normal | 0px |
| 1025 | page | 217.015625px | 302px | 0px | 0px | normal | 0px |
| 1280 | page | 174.90625px | 302px | 0px | 0px | normal | 0px |
| 1281 | page | 175.046875px | 302px | 0px | 0px | normal | 0px |
| 1440 | page | 198.046875px | 302px | 0px | 0px | normal | 0px |
| 1441 | page | 198.203125px | 320px | 0px | 0px | normal | 0px |
| 1920 | page | 267.5px | 320px | 0px | 0px | normal | 0px |
| 2560 | page | 303.328125px | 320px | 0px | 0px | normal | 0px |
| 3840 | page | 303.328125px | 320px | 0px | 0px | normal | 0px |
| 390 | filters | 146.421875px | 248.296875px | 0px | 0px | normal | 0px |

## `.floating-expert`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 288px | 108.53125px | 0px | 0px | normal | 0px |
| 390 | page | 358px | 97.28125px | 0px | 0px | normal | 0px |
| 540 | page | 360px | 97.28125px | 0px | 0px | normal | 0px |
| 541 | page | 360px | 110.1875px | 0px | 0px | normal | 0px |
| 767 | page | 360px | 110.1875px | 0px | 0px | normal | 0px |
| 768 | page | 360px | 110.1875px | 0px | 0px | normal | 0px |
| 1024 | page | 360px | 110.1875px | 0px | 0px | normal | 0px |
| 1025 | page | 360px | 110.1875px | 0px | 0px | normal | 0px |
| 1280 | page | 360px | 110.1875px | 0px | 0px | normal | 0px |
| 1281 | page | 360px | 110.1875px | 0px | 0px | normal | 0px |
| 1440 | page | 360px | 110.1875px | 0px | 0px | normal | 0px |
| 1441 | page | 360px | 110.1875px | 0px | 0px | normal | 0px |
| 1920 | page | 360px | 110.1875px | 0px | 0px | normal | 0px |
| 2560 | page | 360px | 110.1875px | 0px | 0px | normal | 0px |
| 3840 | page | 360px | 110.1875px | 0px | 0px | normal | 0px |

## `.floating-expert__avatar`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320 | page | 64px | 64px | 0px | 0px | normal | 50% |
| 390 | page | 64px | 64px | 0px | 0px | normal | 50% |
| 540 | page | 64px | 64px | 0px | 0px | normal | 50% |
| 541 | page | 72px | 72px | 0px | 0px | normal | 50% |
| 767 | page | 72px | 72px | 0px | 0px | normal | 50% |
| 768 | page | 72px | 72px | 0px | 0px | normal | 50% |
| 1024 | page | 72px | 72px | 0px | 0px | normal | 50% |
| 1025 | page | 72px | 72px | 0px | 0px | normal | 50% |
| 1280 | page | 72px | 72px | 0px | 0px | normal | 50% |
| 1281 | page | 72px | 72px | 0px | 0px | normal | 50% |
| 1440 | page | 72px | 72px | 0px | 0px | normal | 50% |
| 1441 | page | 72px | 72px | 0px | 0px | normal | 50% |
| 1920 | page | 72px | 72px | 0px | 0px | normal | 50% |
| 2560 | page | 72px | 72px | 0px | 0px | normal | 50% |
| 3840 | page | 72px | 72px | 0px | 0px | normal | 50% |

## `.home-owner-form`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | quiz | 375px | 1000px | 0px | 0px | normal | 0px |
| 768 | quiz | 753px | 1000px | 0px | 0px | normal | 0px |
| 1440 | quiz | 1425px | 1000px | 0px | 0px | normal | 0px |
| 1920 | quiz | 1905px | 1000px | 0px | 0px | normal | 0px |

## `.home-owner-form__body`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | quiz | 357px | 822px | 24px 20px | 0px | normal | 0px |
| 768 | quiz | 392.171875px | 818px | 32px | 0px | normal | 0px |
| 1440 | quiz | 566.171875px | 818px | 32px | 0px | normal | 0px |
| 1920 | quiz | 566.171875px | 818px | 32px | 0px | normal | 0px |

## `.home-owner-form__layout`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | quiz | 357px | 982px | 0px | 0px | normal | 0px |
| 768 | quiz | 719px | 818px | 0px | 0px | normal | 0px |
| 1440 | quiz | 1038px | 818px | 0px | 0px | normal | 0px |
| 1920 | quiz | 1038px | 818px | 0px | 0px | normal | 0px |

## `.home-owner-form__hero`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | quiz | 357px | 160px | 0px | 0px | normal | 0px |
| 768 | quiz | 326.828125px | 818px | 0px | 0px | normal | 0px |
| 1440 | quiz | 471.828125px | 818px | 0px | 0px | normal | 0px |
| 1920 | quiz | 471.828125px | 818px | 0px | 0px | normal | 0px |

## `.home-owner-form__input`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | contact | 302px | 56px | 15px 0px 12px | 0px | normal | 0px |
| 768 | contact | 313.171875px | 56px | 15px 0px 12px | 0px | normal | 0px |
| 1440 | contact | 487.171875px | 56px | 15px 0px 12px | 0px | normal | 0px |
| 1920 | contact | 487.171875px | 56px | 15px 0px 12px | 0px | normal | 0px |

## `.home-quiz__panel`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | quiz | 302px | 386.375px | 0px | 0px | normal | 0px |
| 768 | quiz | 313.171875px | 414.78125px | 0px | 0px | normal | 0px |
| 1440 | quiz | 487.171875px | 402px | 0px | 0px | normal | 0px |
| 1920 | quiz | 487.171875px | 402px | 0px | 0px | normal | 0px |

## `.home-quiz__options`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | quiz | 302px | 256.375px | 0px | 0px | 8px | 0px |
| 768 | quiz | 313.171875px | 274.78125px | 0px | 0px | 10px | 0px |
| 1440 | quiz | 487.171875px | 262px | 0px | 0px | 10px | 0px |
| 1920 | quiz | 487.171875px | 262px | 0px | 0px | 10px | 0px |

## `.home-quiz__option`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | quiz | 147px | 56px | 12px | 0px | 8px | 1px |
| 768 | quiz | 151.578125px | 58px | 14px 16px | 0px | 8px | 1px |
| 1440 | quiz | 238.578125px | 58px | 14px 16px | 0px | 8px | 1px |
| 1920 | quiz | 238.578125px | 58px | 14px 16px | 0px | 8px | 1px |

## `.home-owner-form__submit`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | contact | 302px | 58px | 0px 24px | 8px 0px 0px | 8px | 1px |
| 768 | contact | 313.171875px | 64px | 0px 36px | 8px 0px 0px | 8px | 1px |
| 1440 | contact | 487.171875px | 64px | 0px 36px | 8px 0px 0px | 8px | 1px |
| 1920 | contact | 487.171875px | 64px | 0px 47px | 8px 0px 0px | 8px | 1px |

## `.home-owner-form__consent-box`

| Окно | Состояние | Ширина | Высота | Padding | Margin | Gap | Радиус |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | contact | 16px | 16px | 0px | 2px 0px 0px | normal | 2px |
| 768 | contact | 16px | 16px | 0px | 2px 0px 0px | normal | 2px |
| 1440 | contact | 16px | 16px | 0px | 2px 0px 0px | normal | 2px |
| 1920 | contact | 16px | 16px | 0px | 2px 0px 0px | normal | 2px |

