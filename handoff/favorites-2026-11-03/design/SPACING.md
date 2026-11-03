# Размеры блоков, отступы и адаптив

Единицы — CSS px. Padding/margin записаны сверху → справа → снизу → слева. Высота окна замеров1000px; размеры vh/dvh зависят от высоты окна. Замеры описывают отображённую геометрию, а не фиксируют ширину карточки.

- Основной контейнер: максимум1920px, по центру; gutter22px до540px, далее clamp(24px,calc(-26.66667px + 6.59722vw),100px), с1921px0px внутри контейнера.
- От хедера до крошек:28px до540px,32px до1024px,40px выше.
- От крошек до H1:22px на телефоне,28px выше. Под H1:28/40px.
- Хэдер:77px до540px,111px до1280px,153/155px наdesktop. Логотип36/48px.
- Подменю хедера: padding30px18px8px, рамка1px, gap12px. Текст выровнен по названию родителя, поверхность сдвинута левее на19px.
- Вкладки и сортировка:44px. До700px сортировка выше вкладок; вкладки всегда слева, gap24px на мобильном, без растягивания.
- Сетка:3колонки, до1024px2, до540px1; ширина исходной карточки ограничена420px.
- Отмена удаления доступна15секунд. Меню, сортировка и квиз закрываются поEscape с возвратом фокуса.

## Фактическая геометрия

| Ширина окна | Состояние | Селектор | Ширина × высота | Padding | Margin | Gap |
| --- | --- | --- | --- | --- | --- | --- |
| 320 | page | `.site-header` | 305.00 × 77.00 | 16px 0px 0px | 0px | normal |
| 320 | page | `.site-header__logo img` | 129.20 × 36.00 | 0px | 0px | normal |
| 320 | page | `.favorites-main` | 305.00 × 1369.86 | 28px 22px 40px | 0px | normal |
| 320 | page | `.favorites-breadcrumbs` | 261.00 × 19.59 | 0px | 0px | 4px |
| 320 | page | `.favorites-heading` | 261.00 × 83.59 | 22px 0px 28px | 0px | 24px |
| 320 | page | `.favorites-toolbar` | 261.00 × 97.00 | 0px | 0px | 8px |
| 320 | page | `.catalog-mode-switch` | 161.00 × 44.00 | 0px | 0px | 24px |
| 320 | page | `.favorites-summary` | 261.00 × 65.00 | 0px | 0px | 16px |
| 320 | page | `.favorites-grid` | 261.00 × 929.67 | 0px | 0px | 26px |
| 320 | page | `.apartment-card` | 261.00 × 443.44 | 0px 0px 18px | 0px | normal |
| 320 | page | `.apartment-card__image` | 261.00 × 195.75 | 0px | 0px | normal |
| 320 | page | `.apartment-card__body` | 237.00 × 194.69 | 20px 18px 0px | -35px 12px 0px | normal |
| 320 | page | `.favorites-bottom` | 261.00 × 83.00 | 24px 0px 0px | 24px 0px 0px | 16px |
| 320 | page | `.favorites-continue` | 261.00 × 58.00 | 0px 24px | 0px | 24px |
| 320 | page | `.site-footer__inner` | 274.59 × 1675.72 | 32px 23px 28px | 0px | normal |
| 390 | page | `.site-header` | 375.00 × 77.00 | 16px 0px 0px | 0px | normal |
| 390 | page | `.site-header__logo img` | 129.20 × 36.00 | 0px | 0px | normal |
| 390 | page | `.favorites-main` | 375.00 × 1438.86 | 28px 22px 40px | 0px | normal |
| 390 | page | `.favorites-breadcrumbs` | 331.00 × 19.59 | 0px | 0px | 4px |
| 390 | page | `.favorites-heading` | 331.00 × 83.59 | 22px 0px 28px | 0px | 24px |
| 390 | page | `.favorites-toolbar` | 331.00 × 97.00 | 0px | 0px | 8px |
| 390 | page | `.catalog-mode-switch` | 161.00 × 44.00 | 0px | 0px | 24px |
| 390 | page | `.favorites-summary` | 331.00 × 65.00 | 0px | 0px | 16px |
| 390 | page | `.favorites-grid` | 331.00 × 998.67 | 0px | 0px | 26px |
| 390 | page | `.apartment-card` | 331.00 × 483.94 | 0px 0px 18px | 0px | normal |
| 390 | page | `.apartment-card__image` | 331.00 × 248.25 | 0px | 0px | normal |
| 390 | page | `.apartment-card__body` | 307.00 × 182.69 | 20px 18px 0px | -35px 12px 0px | normal |
| 390 | page | `.favorites-bottom` | 331.00 × 83.00 | 24px 0px 0px | 24px 0px 0px | 16px |
| 390 | page | `.favorites-continue` | 331.00 × 58.00 | 0px 24px | 0px | 24px |
| 390 | page | `.site-footer__inner` | 341.84 × 1675.72 | 32px 23px 28px | 0px | normal |
| 540 | page | `.site-header` | 525.00 × 77.00 | 16px 0px 0px | 0px | normal |
| 540 | page | `.site-header__logo img` | 129.20 × 36.00 | 0px | 0px | normal |
| 540 | page | `.favorites-main` | 525.00 × 1572.36 | 28px 22px 40px | 0px | normal |
| 540 | page | `.favorites-breadcrumbs` | 481.00 × 19.59 | 0px | 0px | 4px |
| 540 | page | `.favorites-heading` | 481.00 × 83.59 | 22px 0px 28px | 0px | 24px |
| 540 | page | `.favorites-toolbar` | 481.00 × 97.00 | 0px | 0px | 8px |
| 540 | page | `.catalog-mode-switch` | 161.00 × 44.00 | 0px | 0px | 24px |
| 540 | page | `.favorites-summary` | 481.00 × 65.00 | 0px | 0px | 16px |
| 540 | page | `.favorites-grid` | 481.00 × 1132.17 | 0px | 0px | 26px |
| 540 | page | `.apartment-card` | 420.00 × 550.69 | 0px 0px 18px | 0px | normal |
| 540 | page | `.apartment-card__image` | 420.00 × 315.00 | 0px | 0px | normal |
| 540 | page | `.apartment-card__body` | 396.00 × 182.69 | 20px 18px 0px | -35px 12px 0px | normal |
| 540 | page | `.favorites-bottom` | 481.00 × 83.00 | 24px 0px 0px | 24px 0px 0px | 16px |
| 540 | page | `.favorites-continue` | 481.00 × 58.00 | 0px 24px | 0px | 24px |
| 540 | page | `.site-footer__inner` | 485.97 × 1675.72 | 32px 23px 28px | 0px | normal |
| 541 | page | `.site-header` | 526.00 × 111.00 | 32px 0px 0px | 0px | normal |
| 541 | page | `.site-header__logo img` | 172.27 × 48.00 | 0px | 0px | normal |
| 541 | page | `.favorites-main` | 526.00 × 1010.28 | 32px 24px 70px | 0px | normal |
| 541 | page | `.favorites-breadcrumbs` | 478.00 × 22.39 | 0px | 0px | 6px |
| 541 | page | `.favorites-heading` | 478.00 × 107.89 | 28px 0px 40px | 0px | 24px |
| 541 | page | `.favorites-toolbar` | 478.00 × 97.00 | 0px | 0px | 8px |
| 541 | page | `.catalog-mode-switch` | 284.00 × 44.00 | 0px | 0px | 24px |
| 541 | page | `.favorites-summary` | 478.00 × 76.00 | 0px | 0px | 16px |
| 541 | page | `.favorites-grid` | 478.00 × 466.00 | 0px | 0px | 24px |
| 541 | page | `.apartment-card` | 227.00 × 466.00 | 0px 0px 18px | 0px | normal |
| 541 | page | `.apartment-card__image` | 227.00 × 170.25 | 0px | 0px | normal |
| 541 | page | `.apartment-card__body` | 203.00 × 238.75 | 20px 18px 0px | -35px 12px 0px | normal |
| 541 | page | `.favorites-bottom` | 478.00 × 99.00 | 28px 0px 0px | 40px 0px 0px | 16px |
| 541 | page | `.favorites-continue` | 280.00 × 70.00 | 0px 36px | 0px | 24px |
| 541 | page | `.site-footer__inner` | 526.00 × 2044.34 | 40px 19.549px 28px | 0px | normal |
| 700 | page | `.site-header` | 685.00 × 111.00 | 32px 0px 0px | 0px | normal |
| 700 | page | `.site-header__logo img` | 172.27 × 48.00 | 0px | 0px | normal |
| 700 | page | `.favorites-main` | 685.00 × 1023.67 | 32px 24px 70px | 0px | normal |
| 700 | page | `.favorites-breadcrumbs` | 637.00 × 22.39 | 0px | 0px | 6px |
| 700 | page | `.favorites-heading` | 637.00 × 107.89 | 28px 0px 40px | 0px | 24px |
| 700 | page | `.favorites-toolbar` | 637.00 × 97.00 | 0px | 0px | 8px |
| 700 | page | `.catalog-mode-switch` | 284.00 × 44.00 | 0px | 0px | 24px |
| 700 | page | `.favorites-summary` | 637.00 × 76.00 | 0px | 0px | 16px |
| 700 | page | `.favorites-grid` | 637.00 × 479.39 | 0px | 0px | 24px |
| 700 | page | `.apartment-card` | 306.50 × 479.39 | 0px 0px 18px | 0px | normal |
| 700 | page | `.apartment-card__image` | 306.50 × 229.88 | 0px | 0px | normal |
| 700 | page | `.apartment-card__body` | 282.50 × 192.52 | 20px 18px 0px | -35px 12px 0px | normal |
| 700 | page | `.favorites-bottom` | 637.00 × 99.00 | 28px 0px 0px | 40px 0px 0px | 16px |
| 700 | page | `.favorites-continue` | 280.00 × 70.00 | 0px 36px | 0px | 24px |
| 700 | page | `.site-footer__inner` | 685.00 × 2044.34 | 40px 22.6666px 28px | 0px | normal |
| 767 | page | `.site-header` | 752.00 × 111.00 | 32px 0px 0px | 0px | normal |
| 767 | page | `.site-header__logo img` | 172.27 × 48.00 | 0px | 0px | normal |
| 767 | page | `.favorites-main` | 752.00 × 996.80 | 32px 24px 70px | 0px | normal |
| 767 | page | `.favorites-breadcrumbs` | 704.00 × 22.39 | 0px | 0px | 6px |
| 767 | page | `.favorites-heading` | 704.00 × 107.89 | 28px 0px 40px | 0px | 24px |
| 767 | page | `.favorites-toolbar` | 704.00 × 45.00 | 0px | 0px | 24px |
| 767 | page | `.catalog-mode-switch` | 276.00 × 44.00 | 0px | 0px | 20px |
| 767 | page | `.favorites-summary` | 704.00 × 76.00 | 0px | 0px | 16px |
| 767 | page | `.favorites-grid` | 704.00 × 504.52 | 0px | 0px | 24px |
| 767 | page | `.apartment-card` | 340.00 × 504.52 | 0px 0px 18px | 0px | normal |
| 767 | page | `.apartment-card__image` | 340.00 × 255.00 | 0px | 0px | normal |
| 767 | page | `.apartment-card__body` | 316.00 × 192.52 | 20px 18px 0px | -35px 12px 0px | normal |
| 767 | page | `.favorites-bottom` | 704.00 × 99.00 | 28px 0px 0px | 40px 0px 0px | 24px |
| 767 | page | `.favorites-continue` | 280.00 × 70.00 | 0px 36px | 0px | 24px |
| 767 | page | `.site-footer__inner` | 752.00 × 2044.34 | 40px 23.9804px 28px | 0px | normal |
| 768 | page | `.site-header` | 753.00 × 111.00 | 32px 0px 0px | 0px | normal |
| 768 | page | `.site-header__logo img` | 172.27 × 48.00 | 0px | 0px | normal |
| 768 | page | `.favorites-main` | 753.00 × 997.17 | 32px 24px 70px | 0px | normal |
| 768 | page | `.favorites-breadcrumbs` | 705.00 × 22.39 | 0px | 0px | 6px |
| 768 | page | `.favorites-heading` | 705.00 × 107.89 | 28px 0px 40px | 0px | 24px |
| 768 | page | `.favorites-toolbar` | 705.00 × 45.00 | 0px | 0px | 24px |
| 768 | page | `.catalog-mode-switch` | 276.00 × 44.00 | 0px | 0px | 20px |
| 768 | page | `.favorites-summary` | 705.00 × 76.00 | 0px | 0px | 16px |
| 768 | page | `.favorites-grid` | 705.00 × 504.89 | 0px | 0px | 24px |
| 768 | page | `.apartment-card` | 340.50 × 504.89 | 0px 0px 18px | 0px | normal |
| 768 | page | `.apartment-card__image` | 340.50 × 255.38 | 0px | 0px | normal |
| 768 | page | `.apartment-card__body` | 316.50 × 192.52 | 20px 18px 0px | -35px 12px 0px | normal |
| 768 | page | `.favorites-bottom` | 705.00 × 99.00 | 28px 0px 0px | 40px 0px 0px | 24px |
| 768 | page | `.favorites-continue` | 280.00 × 70.00 | 0px 36px | 0px | 24px |
| 768 | page | `.site-footer__inner` | 753.00 × 2044.34 | 40px 24px 28px | 0px | normal |
| 1024 | page | `.site-header` | 1009.00 × 111.00 | 32px 0px 0px | 0px | normal |
| 1024 | page | `.site-header__logo img` | 172.27 × 48.00 | 0px | 0px | normal |
| 1024 | page | `.favorites-main` | 1009.00 × 1062.70 | 32px 40.8889px 70px | 0px | normal |
| 1024 | page | `.favorites-breadcrumbs` | 927.25 × 25.19 | 0px | 0px | 8px |
| 1024 | page | `.favorites-heading` | 927.25 × 111.00 | 28px 0px 40px | 0px | 24px |
| 1024 | page | `.favorites-toolbar` | 927.25 × 45.00 | 0px | 0px | 24px |
| 1024 | page | `.catalog-mode-switch` | 276.00 × 44.00 | 0px | 0px | 20px |
| 1024 | page | `.favorites-summary` | 927.25 × 76.00 | 0px | 0px | 16px |
| 1024 | page | `.favorites-grid` | 927.25 × 564.52 | 0px | 0px | 24px |
| 1024 | page | `.apartment-card` | 420.00 × 564.52 | 0px 0px 18px | 0px | normal |
| 1024 | page | `.apartment-card__image` | 420.00 × 315.00 | 0px | 0px | normal |
| 1024 | page | `.apartment-card__body` | 396.00 × 192.52 | 20px 18px 0px | -35px 12px 0px | normal |
| 1024 | page | `.favorites-bottom` | 927.25 × 99.00 | 28px 0px 0px | 40px 0px 0px | 24px |
| 1024 | page | `.favorites-continue` | 280.00 × 70.00 | 0px 36px | 0px | 24px |
| 1024 | page | `.site-footer__inner` | 1009.00 × 2044.34 | 40px 40.8888px 28px | 0px | normal |
| 1025 | page | `.site-header` | 1010.00 × 111.00 | 32px 0px 0px | 0px | normal |
| 1025 | page | `.site-header__logo img` | 172.27 × 48.00 | 0px | 0px | normal |
| 1025 | page | `.favorites-main` | 1010.00 × 993.91 | 40px 40.9548px 70px | 0px | normal |
| 1025 | page | `.favorites-breadcrumbs` | 928.09 × 28.00 | 0px | 0px | 8px |
| 1025 | page | `.favorites-heading` | 928.09 × 111.05 | 28px 0px 40px | 0px | 40px |
| 1025 | page | `.favorites-toolbar` | 928.09 × 45.00 | 0px | 0px | 24px |
| 1025 | page | `.catalog-mode-switch` | 292.00 × 44.00 | 0px | 0px | 28px |
| 1025 | page | `.favorites-summary` | 928.09 × 76.00 | 0px | 0px | 16px |
| 1025 | page | `.favorites-grid` | 928.09 × 484.86 | 0px | 0px | 40px 24px |
| 1025 | page | `.apartment-card` | 293.36 × 484.86 | 0px 0px 18px | 0px | normal |
| 1025 | page | `.apartment-card__image` | 293.36 × 220.02 | 0px | 0px | normal |
| 1025 | page | `.apartment-card__body` | 269.36 × 207.84 | 20px 18px 0px | -35px 12px 0px | normal |
| 1025 | page | `.favorites-bottom` | 928.09 × 99.00 | 28px 0px 0px | 40px 0px 0px | 24px |
| 1025 | page | `.favorites-continue` | 280.00 × 70.00 | 0px 36px | 0px | 24px |
| 1025 | page | `.site-footer__inner` | 1010.00 × 1369.56 | 55px 40.9548px 50px | 0px | normal |
| 1280 | page | `.site-header` | 1265.00 × 111.00 | 32px 0px 0px | 0px | normal |
| 1280 | page | `.site-header__logo img` | 172.27 × 48.00 | 0px | 0px | normal |
| 1280 | page | `.favorites-main` | 1265.00 × 1050.77 | 40px 57.7777px 70px | 0px | normal |
| 1280 | page | `.favorites-breadcrumbs` | 1149.47 × 28.00 | 0px | 0px | 8px |
| 1280 | page | `.favorites-heading` | 1149.47 × 121.75 | 28px 0px 40px | 0px | 40px |
| 1280 | page | `.favorites-toolbar` | 1149.47 × 45.00 | 0px | 0px | 24px |
| 1280 | page | `.catalog-mode-switch` | 292.00 × 44.00 | 0px | 0px | 28px |
| 1280 | page | `.favorites-summary` | 1149.47 × 76.00 | 0px | 0px | 16px |
| 1280 | page | `.favorites-grid` | 1149.47 × 531.02 | 0px | 0px | 40px 24px |
| 1280 | page | `.apartment-card` | 367.16 × 531.02 | 0px 0px 18px | 0px | normal |
| 1280 | page | `.apartment-card__image` | 367.16 × 275.36 | 0px | 0px | normal |
| 1280 | page | `.apartment-card__body` | 343.16 × 198.66 | 20px 18px 0px | -35px 12px 0px | normal |
| 1280 | page | `.favorites-bottom` | 1149.47 × 99.00 | 28px 0px 0px | 40px 0px 0px | 24px |
| 1280 | page | `.favorites-continue` | 280.00 × 70.00 | 0px 36px | 0px | 24px |
| 1280 | page | `.site-footer__inner` | 1265.00 × 1209.56 | 55px 57.7777px 50px | 0px | normal |
| 1281 | page | `.site-header` | 1266.00 × 153.00 | 32px 0px 0px | 0px | normal |
| 1281 | page | `.site-header__logo img` | 172.27 × 48.00 | 0px | 0px | normal |
| 1281 | page | `.favorites-main` | 1266.00 × 1051.02 | 40px 57.8437px 70px | 0px | normal |
| 1281 | page | `.favorites-breadcrumbs` | 1150.34 × 28.00 | 0px | 0px | 8px |
| 1281 | page | `.favorites-heading` | 1150.34 × 121.78 | 28px 0px 40px | 0px | 40px |
| 1281 | page | `.favorites-toolbar` | 1150.34 × 45.00 | 0px | 0px | 24px |
| 1281 | page | `.catalog-mode-switch` | 292.00 × 44.00 | 0px | 0px | 28px |
| 1281 | page | `.favorites-summary` | 1150.34 × 76.00 | 0px | 0px | 16px |
| 1281 | page | `.favorites-grid` | 1150.34 × 531.23 | 0px | 0px | 40px 24px |
| 1281 | page | `.apartment-card` | 367.44 × 531.23 | 0px 0px 18px | 0px | normal |
| 1281 | page | `.apartment-card__image` | 367.44 × 275.58 | 0px | 0px | normal |
| 1281 | page | `.apartment-card__body` | 343.44 × 198.66 | 20px 18px 0px | -35px 12px 0px | normal |
| 1281 | page | `.favorites-bottom` | 1150.34 × 99.00 | 28px 0px 0px | 40px 0px 0px | 24px |
| 1281 | page | `.favorites-continue` | 280.00 × 70.00 | 0px 36px | 0px | 24px |
| 1281 | page | `.site-footer__inner` | 1266.00 × 1209.56 | 55px 57.8437px 50px | 0px | normal |
| 1440 | page | `.site-header` | 1425.00 × 153.00 | 32px 0px 0px | 0px | normal |
| 1440 | page | `.site-header__logo img` | 172.27 × 48.00 | 0px | 0px | normal |
| 1440 | page | `.favorites-main` | 1425.00 × 1092.20 | 40px 68.3333px 70px | 0px | normal |
| 1440 | page | `.favorites-breadcrumbs` | 1288.34 × 28.00 | 0px | 0px | 8px |
| 1440 | page | `.favorites-heading` | 1288.34 × 128.47 | 28px 0px 40px | 0px | 40px |
| 1440 | page | `.favorites-toolbar` | 1288.34 × 45.00 | 0px | 0px | 24px |
| 1440 | page | `.catalog-mode-switch` | 292.00 × 44.00 | 0px | 0px | 28px |
| 1440 | page | `.favorites-summary` | 1288.34 × 76.00 | 0px | 0px | 16px |
| 1440 | page | `.favorites-grid` | 1288.34 × 565.73 | 0px | 0px | 40px 24px |
| 1440 | page | `.apartment-card` | 413.44 × 565.73 | 0px 0px 18px | 0px | normal |
| 1440 | page | `.apartment-card__image` | 413.44 × 310.08 | 0px | 0px | normal |
| 1440 | page | `.apartment-card__body` | 389.44 × 198.66 | 20px 18px 0px | -35px 12px 0px | normal |
| 1440 | page | `.favorites-bottom` | 1288.34 × 99.00 | 28px 0px 0px | 40px 0px 0px | 24px |
| 1440 | page | `.favorites-continue` | 280.00 × 70.00 | 0px 36px | 0px | 24px |
| 1440 | page | `.site-footer__inner` | 1425.00 × 1209.56 | 55px 68.3333px 50px | 0px | normal |
| 1441 | page | `.site-header` | 1426.00 × 155.00 | 32px 0px 0px | 0px | normal |
| 1441 | page | `.site-header__logo img` | 172.27 × 48.00 | 0px | 0px | normal |
| 1441 | page | `.favorites-main` | 1426.00 × 1099.47 | 40px 68.3993px 70px | 0px | normal |
| 1441 | page | `.favorites-breadcrumbs` | 1289.22 × 35.00 | 0px | 0px | 8px |
| 1441 | page | `.favorites-heading` | 1289.22 × 128.52 | 28px 0px 40px | 0px | 40px |
| 1441 | page | `.favorites-toolbar` | 1289.22 × 45.00 | 0px | 0px | 24px |
| 1441 | page | `.catalog-mode-switch` | 312.00 × 44.00 | 0px | 0px | 28px |
| 1441 | page | `.favorites-summary` | 1289.22 × 76.00 | 0px | 0px | 16px |
| 1441 | page | `.favorites-grid` | 1289.22 × 565.95 | 0px | 0px | 40px 24px |
| 1441 | page | `.apartment-card` | 413.73 × 565.95 | 0px 0px 18px | 0px | normal |
| 1441 | page | `.apartment-card__image` | 413.73 × 310.30 | 0px | 0px | normal |
| 1441 | page | `.apartment-card__body` | 389.73 × 198.66 | 20px 18px 0px | -35px 12px 0px | normal |
| 1441 | page | `.favorites-bottom` | 1289.22 × 99.00 | 28px 0px 0px | 40px 0px 0px | 24px |
| 1441 | page | `.favorites-continue` | 298.00 × 70.00 | 0px 47px | 0px | 24px |
| 1441 | page | `.site-footer__inner` | 1426.00 × 1262.16 | 55px 68.3992px 50px | 0px | normal |
| 1920 | page | `.site-header` | 1905.00 × 155.00 | 32px 0px 0px | 0px | normal |
| 1920 | page | `.site-header__logo img` | 172.27 × 48.00 | 0px | 0px | normal |
| 1920 | page | `.favorites-main` | 1905.00 × 1104.55 | 40px 100px 70px | 0px | normal |
| 1920 | page | `.favorites-breadcrumbs` | 1705.03 × 35.00 | 0px | 0px | 8px |
| 1920 | page | `.favorites-heading` | 1705.03 × 128.89 | 28px 0px 40px | 0px | 40px |
| 1920 | page | `.favorites-toolbar` | 1705.03 × 45.00 | 0px | 0px | 24px |
| 1920 | page | `.catalog-mode-switch` | 312.00 × 44.00 | 0px | 0px | 28px |
| 1920 | page | `.favorites-summary` | 1705.03 × 76.00 | 0px | 0px | 16px |
| 1920 | page | `.favorites-grid` | 1705.03 × 570.66 | 0px | 0px | 40px 24px |
| 1920 | page | `.apartment-card` | 420.00 × 570.66 | 0px 0px 18px | 0px | normal |
| 1920 | page | `.apartment-card__image` | 420.00 × 315.00 | 0px | 0px | normal |
| 1920 | page | `.apartment-card__body` | 396.00 × 198.66 | 20px 18px 0px | -35px 12px 0px | normal |
| 1920 | page | `.favorites-bottom` | 1705.03 × 99.00 | 28px 0px 0px | 40px 0px 0px | 24px |
| 1920 | page | `.favorites-continue` | 298.00 × 70.00 | 0px 47px | 0px | 24px |
| 1920 | page | `.site-footer__inner` | 1905.00 × 1262.16 | 55px 99.9999px 50px | 0px | normal |
| 2560 | page | `.site-header` | 2545.00 × 155.00 | 32px 0px 0px | 0px | normal |
| 2560 | page | `.site-header__logo img` | 172.27 × 48.00 | 0px | 0px | normal |
| 2560 | page | `.favorites-main` | 1920.00 × 1104.55 | 40px 0px 70px | 0px 312.5px | normal |
| 2560 | page | `.favorites-breadcrumbs` | 1920.00 × 35.00 | 0px | 0px | 8px |
| 2560 | page | `.favorites-heading` | 1920.00 × 128.89 | 28px 0px 40px | 0px | 40px |
| 2560 | page | `.favorites-toolbar` | 1920.00 × 45.00 | 0px | 0px | 24px |
| 2560 | page | `.catalog-mode-switch` | 312.00 × 44.00 | 0px | 0px | 28px |
| 2560 | page | `.favorites-summary` | 1920.00 × 76.00 | 0px | 0px | 16px |
| 2560 | page | `.favorites-grid` | 1920.00 × 570.66 | 0px | 0px | 40px 24px |
| 2560 | page | `.apartment-card` | 420.00 × 570.66 | 0px 0px 18px | 0px | normal |
| 2560 | page | `.apartment-card__image` | 420.00 × 315.00 | 0px | 0px | normal |
| 2560 | page | `.apartment-card__body` | 396.00 × 198.66 | 20px 18px 0px | -35px 12px 0px | normal |
| 2560 | page | `.favorites-bottom` | 1920.00 × 99.00 | 28px 0px 0px | 40px 0px 0px | 24px |
| 2560 | page | `.favorites-continue` | 298.00 × 70.00 | 0px 47px | 0px | 24px |
| 2560 | page | `.site-footer__inner` | 1920.00 × 1262.16 | 55px 100px 50px | 0px 312.5px | normal |
| 3840 | page | `.site-header` | 3825.00 × 155.00 | 32px 0px 0px | 0px | normal |
| 3840 | page | `.site-header__logo img` | 172.27 × 48.00 | 0px | 0px | normal |
| 3840 | page | `.favorites-main` | 1920.00 × 1104.55 | 40px 0px 70px | 0px 952.5px | normal |
| 3840 | page | `.favorites-breadcrumbs` | 1920.00 × 35.00 | 0px | 0px | 8px |
| 3840 | page | `.favorites-heading` | 1920.00 × 128.89 | 28px 0px 40px | 0px | 40px |
| 3840 | page | `.favorites-toolbar` | 1920.00 × 45.00 | 0px | 0px | 24px |
| 3840 | page | `.catalog-mode-switch` | 312.00 × 44.00 | 0px | 0px | 28px |
| 3840 | page | `.favorites-summary` | 1920.00 × 76.00 | 0px | 0px | 16px |
| 3840 | page | `.favorites-grid` | 1920.00 × 570.66 | 0px | 0px | 40px 24px |
| 3840 | page | `.apartment-card` | 420.00 × 570.66 | 0px 0px 18px | 0px | normal |
| 3840 | page | `.apartment-card__image` | 420.00 × 315.00 | 0px | 0px | normal |
| 3840 | page | `.apartment-card__body` | 396.00 × 198.66 | 20px 18px 0px | -35px 12px 0px | normal |
| 3840 | page | `.favorites-bottom` | 1920.00 × 99.00 | 28px 0px 0px | 40px 0px 0px | 24px |
| 3840 | page | `.favorites-continue` | 298.00 × 70.00 | 0px 47px | 0px | 24px |
| 3840 | page | `.site-footer__inner` | 1920.00 × 1262.16 | 55px 100px 50px | 0px 952.5px | normal |
| 390 | burger | `.site-header` | 375.00 × 77.00 | 16px 0px 0px | 0px | normal |
| 390 | burger | `.site-header__logo img` | 129.20 × 36.00 | 0px | 0px | normal |
| 390 | burger | `.favorites-main` | 375.00 × 1438.86 | 28px 22px 40px | 0px | normal |
| 390 | burger | `.favorites-breadcrumbs` | 331.00 × 19.59 | 0px | 0px | 4px |
| 390 | burger | `.favorites-heading` | 331.00 × 83.59 | 22px 0px 28px | 0px | 24px |
| 390 | burger | `.favorites-toolbar` | 331.00 × 97.00 | 0px | 0px | 8px |
| 390 | burger | `.catalog-mode-switch` | 161.00 × 44.00 | 0px | 0px | 24px |
| 390 | burger | `.favorites-summary` | 331.00 × 65.00 | 0px | 0px | 16px |
| 390 | burger | `.favorites-grid` | 331.00 × 998.67 | 0px | 0px | 26px |
| 390 | burger | `.apartment-card` | 331.00 × 483.94 | 0px 0px 18px | 0px | normal |
| 390 | burger | `.apartment-card__image` | 331.00 × 248.25 | 0px | 0px | normal |
| 390 | burger | `.apartment-card__body` | 307.00 × 182.69 | 20px 18px 0px | -35px 12px 0px | normal |
| 390 | burger | `.favorites-bottom` | 331.00 × 83.00 | 24px 0px 0px | 24px 0px 0px | 16px |
| 390 | burger | `.favorites-continue` | 331.00 × 58.00 | 0px 24px | 0px | 24px |
| 390 | burger | `.site-footer__inner` | 341.84 × 1675.72 | 32px 23px 28px | 0px | normal |
| 390 | sort | `.site-header` | 375.00 × 77.00 | 16px 0px 0px | 0px | normal |
| 390 | sort | `.site-header__logo img` | 129.20 × 36.00 | 0px | 0px | normal |
| 390 | sort | `.favorites-main` | 375.00 × 1438.86 | 28px 22px 40px | 0px | normal |
| 390 | sort | `.favorites-breadcrumbs` | 331.00 × 19.59 | 0px | 0px | 4px |
| 390 | sort | `.favorites-heading` | 331.00 × 83.59 | 22px 0px 28px | 0px | 24px |
| 390 | sort | `.favorites-toolbar` | 331.00 × 97.00 | 0px | 0px | 8px |
| 390 | sort | `.catalog-mode-switch` | 161.00 × 44.00 | 0px | 0px | 24px |
| 390 | sort | `.favorites-summary` | 331.00 × 65.00 | 0px | 0px | 16px |
| 390 | sort | `.favorites-grid` | 331.00 × 998.67 | 0px | 0px | 26px |
| 390 | sort | `.apartment-card` | 331.00 × 483.94 | 0px 0px 18px | 0px | normal |
| 390 | sort | `.apartment-card__image` | 331.00 × 248.25 | 0px | 0px | normal |
| 390 | sort | `.apartment-card__body` | 307.00 × 182.69 | 20px 18px 0px | -35px 12px 0px | normal |
| 390 | sort | `.favorites-bottom` | 331.00 × 83.00 | 24px 0px 0px | 24px 0px 0px | 16px |
| 390 | sort | `.favorites-continue` | 331.00 × 58.00 | 0px 24px | 0px | 24px |
| 390 | sort | `.resort-quick-dropdown` | 220.00 × 158.00 | 13px | 0px | normal |
| 390 | sort | `.site-footer__inner` | 341.84 × 1675.72 | 32px 23px 28px | 0px | normal |
| 390 | quiz-task | `.site-header` | 375.00 × 77.00 | 16px 0px 0px | 0px | normal |
| 390 | quiz-task | `.site-header__logo img` | 129.20 × 36.00 | 0px | 0px | normal |
| 390 | quiz-task | `.favorites-main` | 375.00 × 1438.86 | 28px 22px 40px | 0px | normal |
| 390 | quiz-task | `.favorites-breadcrumbs` | 331.00 × 19.59 | 0px | 0px | 4px |
| 390 | quiz-task | `.favorites-heading` | 331.00 × 83.59 | 22px 0px 28px | 0px | 24px |
| 390 | quiz-task | `.favorites-toolbar` | 331.00 × 97.00 | 0px | 0px | 8px |
| 390 | quiz-task | `.catalog-mode-switch` | 161.00 × 44.00 | 0px | 0px | 24px |
| 390 | quiz-task | `.favorites-summary` | 331.00 × 65.00 | 0px | 0px | 16px |
| 390 | quiz-task | `.favorites-grid` | 331.00 × 998.67 | 0px | 0px | 26px |
| 390 | quiz-task | `.apartment-card` | 331.00 × 483.94 | 0px 0px 18px | 0px | normal |
| 390 | quiz-task | `.apartment-card__image` | 331.00 × 248.25 | 0px | 0px | normal |
| 390 | quiz-task | `.apartment-card__body` | 307.00 × 182.69 | 20px 18px 0px | -35px 12px 0px | normal |
| 390 | quiz-task | `.favorites-bottom` | 331.00 × 83.00 | 24px 0px 0px | 24px 0px 0px | 16px |
| 390 | quiz-task | `.favorites-continue` | 331.00 × 58.00 | 0px 24px | 0px | 24px |
| 390 | quiz-task | `.site-footer__inner` | 341.84 × 1675.72 | 32px 23px 28px | 0px | normal |
| 390 | quiz-contact | `.site-header` | 375.00 × 77.00 | 16px 0px 0px | 0px | normal |
| 390 | quiz-contact | `.site-header__logo img` | 129.20 × 36.00 | 0px | 0px | normal |
| 390 | quiz-contact | `.favorites-main` | 375.00 × 1438.86 | 28px 22px 40px | 0px | normal |
| 390 | quiz-contact | `.favorites-breadcrumbs` | 331.00 × 19.59 | 0px | 0px | 4px |
| 390 | quiz-contact | `.favorites-heading` | 331.00 × 83.59 | 22px 0px 28px | 0px | 24px |
| 390 | quiz-contact | `.favorites-toolbar` | 331.00 × 97.00 | 0px | 0px | 8px |
| 390 | quiz-contact | `.catalog-mode-switch` | 161.00 × 44.00 | 0px | 0px | 24px |
| 390 | quiz-contact | `.favorites-summary` | 331.00 × 65.00 | 0px | 0px | 16px |
| 390 | quiz-contact | `.favorites-grid` | 331.00 × 998.67 | 0px | 0px | 26px |
| 390 | quiz-contact | `.apartment-card` | 331.00 × 483.94 | 0px 0px 18px | 0px | normal |
| 390 | quiz-contact | `.apartment-card__image` | 331.00 × 248.25 | 0px | 0px | normal |
| 390 | quiz-contact | `.apartment-card__body` | 307.00 × 182.69 | 20px 18px 0px | -35px 12px 0px | normal |
| 390 | quiz-contact | `.favorites-bottom` | 331.00 × 83.00 | 24px 0px 0px | 24px 0px 0px | 16px |
| 390 | quiz-contact | `.favorites-continue` | 331.00 × 58.00 | 0px 24px | 0px | 24px |
| 390 | quiz-contact | `.site-footer__inner` | 341.84 × 1675.72 | 32px 23px 28px | 0px | normal |
| 390 | empty | `.site-header` | 375.00 × 77.00 | 16px 0px 0px | 0px | normal |
| 390 | empty | `.site-header__logo img` | 129.20 × 36.00 | 0px | 0px | normal |
| 390 | empty | `.favorites-main` | 375.00 × 841.77 | 28px 22px 40px | 0px | normal |
| 390 | empty | `.favorites-breadcrumbs` | 331.00 × 19.59 | 0px | 0px | 4px |
| 390 | empty | `.favorites-heading` | 331.00 × 83.59 | 22px 0px 28px | 0px | 24px |
| 390 | empty | `.favorites-toolbar` | 331.00 × 97.00 | 0px | 0px | 8px |
| 390 | empty | `.catalog-mode-switch` | 165.00 × 44.00 | 0px | 0px | 24px |
| 390 | empty | `.favorites-summary` | 331.00 × 65.00 | 0px | 0px | 16px |
| 390 | empty | `.favorites-bottom` | 331.00 × 117.19 | 24px 0px 0px | 24px 0px 0px | 16px |
| 390 | empty | `.favorites-continue` | 331.00 × 58.00 | 0px 24px | 0px | 24px |
| 390 | empty | `.favorites-empty` | 331.00 × 367.39 | 45px 18px | 0px | normal |
| 390 | empty | `.site-footer__inner` | 341.84 × 1675.72 | 32px 23px 28px | 0px | normal |
| 1440 | burger | `.site-header` | 1425.00 × 111.00 | 32px 0px 0px | 0px | normal |
| 1440 | burger | `.site-header__logo img` | 172.27 × 48.00 | 0px | 0px | normal |
| 1440 | burger | `.favorites-main` | 1425.00 × 1092.20 | 40px 68.3333px 70px | 0px | normal |
| 1440 | burger | `.favorites-breadcrumbs` | 1288.34 × 28.00 | 0px | 0px | 8px |
| 1440 | burger | `.favorites-heading` | 1288.34 × 128.47 | 28px 0px 40px | 0px | 40px |
| 1440 | burger | `.favorites-toolbar` | 1288.34 × 45.00 | 0px | 0px | 24px |
| 1440 | burger | `.catalog-mode-switch` | 292.00 × 44.00 | 0px | 0px | 28px |
| 1440 | burger | `.favorites-summary` | 1288.34 × 76.00 | 0px | 0px | 16px |
| 1440 | burger | `.favorites-grid` | 1288.34 × 565.73 | 0px | 0px | 40px 24px |
| 1440 | burger | `.apartment-card` | 413.44 × 565.73 | 0px 0px 18px | 0px | normal |
| 1440 | burger | `.apartment-card__image` | 413.44 × 310.08 | 0px | 0px | normal |
| 1440 | burger | `.apartment-card__body` | 389.44 × 198.66 | 20px 18px 0px | -35px 12px 0px | normal |
| 1440 | burger | `.favorites-bottom` | 1288.34 × 99.00 | 28px 0px 0px | 40px 0px 0px | 24px |
| 1440 | burger | `.favorites-continue` | 280.00 × 70.00 | 0px 36px | 0px | 24px |
| 1440 | burger | `.site-footer__inner` | 1425.00 × 1209.56 | 55px 68.3333px 50px | 0px | normal |
| 1440 | sort | `.site-header` | 1425.00 × 153.00 | 32px 0px 0px | 0px | normal |
| 1440 | sort | `.site-header__logo img` | 172.27 × 48.00 | 0px | 0px | normal |
| 1440 | sort | `.favorites-main` | 1425.00 × 1092.20 | 40px 68.3333px 70px | 0px | normal |
| 1440 | sort | `.favorites-breadcrumbs` | 1288.34 × 28.00 | 0px | 0px | 8px |
| 1440 | sort | `.favorites-heading` | 1288.34 × 128.47 | 28px 0px 40px | 0px | 40px |
| 1440 | sort | `.favorites-toolbar` | 1288.34 × 45.00 | 0px | 0px | 24px |
| 1440 | sort | `.catalog-mode-switch` | 292.00 × 44.00 | 0px | 0px | 28px |
| 1440 | sort | `.favorites-summary` | 1288.34 × 76.00 | 0px | 0px | 16px |
| 1440 | sort | `.favorites-grid` | 1288.34 × 565.73 | 0px | 0px | 40px 24px |
| 1440 | sort | `.apartment-card` | 413.44 × 565.73 | 0px 0px 18px | 0px | normal |
| 1440 | sort | `.apartment-card__image` | 413.44 × 310.08 | 0px | 0px | normal |
| 1440 | sort | `.apartment-card__body` | 389.44 × 198.66 | 20px 18px 0px | -35px 12px 0px | normal |
| 1440 | sort | `.favorites-bottom` | 1288.34 × 99.00 | 28px 0px 0px | 40px 0px 0px | 24px |
| 1440 | sort | `.favorites-continue` | 280.00 × 70.00 | 0px 36px | 0px | 24px |
| 1440 | sort | `.resort-quick-dropdown` | 220.00 × 158.00 | 13px | 0px | normal |
| 1440 | sort | `.site-footer__inner` | 1425.00 × 1209.56 | 55px 68.3333px 50px | 0px | normal |
| 1440 | quiz-task | `.site-header` | 1425.00 × 111.00 | 32px 0px 0px | 0px | normal |
| 1440 | quiz-task | `.site-header__logo img` | 172.27 × 48.00 | 0px | 0px | normal |
| 1440 | quiz-task | `.favorites-main` | 1425.00 × 1092.20 | 40px 68.3333px 70px | 0px | normal |
| 1440 | quiz-task | `.favorites-breadcrumbs` | 1288.34 × 28.00 | 0px | 0px | 8px |
| 1440 | quiz-task | `.favorites-heading` | 1288.34 × 128.47 | 28px 0px 40px | 0px | 40px |
| 1440 | quiz-task | `.favorites-toolbar` | 1288.34 × 45.00 | 0px | 0px | 24px |
| 1440 | quiz-task | `.catalog-mode-switch` | 292.00 × 44.00 | 0px | 0px | 28px |
| 1440 | quiz-task | `.favorites-summary` | 1288.34 × 76.00 | 0px | 0px | 16px |
| 1440 | quiz-task | `.favorites-grid` | 1288.34 × 565.73 | 0px | 0px | 40px 24px |
| 1440 | quiz-task | `.apartment-card` | 413.44 × 565.73 | 0px 0px 18px | 0px | normal |
| 1440 | quiz-task | `.apartment-card__image` | 413.44 × 310.08 | 0px | 0px | normal |
| 1440 | quiz-task | `.apartment-card__body` | 389.44 × 198.66 | 20px 18px 0px | -35px 12px 0px | normal |
| 1440 | quiz-task | `.favorites-bottom` | 1288.34 × 99.00 | 28px 0px 0px | 40px 0px 0px | 24px |
| 1440 | quiz-task | `.favorites-continue` | 280.00 × 70.00 | 0px 36px | 0px | 24px |
| 1440 | quiz-task | `.site-footer__inner` | 1425.00 × 1209.56 | 55px 68.3333px 50px | 0px | normal |
| 1440 | quiz-contact | `.site-header` | 1425.00 × 111.00 | 32px 0px 0px | 0px | normal |
| 1440 | quiz-contact | `.site-header__logo img` | 172.27 × 48.00 | 0px | 0px | normal |
| 1440 | quiz-contact | `.favorites-main` | 1425.00 × 1092.20 | 40px 68.3333px 70px | 0px | normal |
| 1440 | quiz-contact | `.favorites-breadcrumbs` | 1288.34 × 28.00 | 0px | 0px | 8px |
| 1440 | quiz-contact | `.favorites-heading` | 1288.34 × 128.47 | 28px 0px 40px | 0px | 40px |
| 1440 | quiz-contact | `.favorites-toolbar` | 1288.34 × 45.00 | 0px | 0px | 24px |
| 1440 | quiz-contact | `.catalog-mode-switch` | 292.00 × 44.00 | 0px | 0px | 28px |
| 1440 | quiz-contact | `.favorites-summary` | 1288.34 × 76.00 | 0px | 0px | 16px |
| 1440 | quiz-contact | `.favorites-grid` | 1288.34 × 565.73 | 0px | 0px | 40px 24px |
| 1440 | quiz-contact | `.apartment-card` | 413.44 × 565.73 | 0px 0px 18px | 0px | normal |
| 1440 | quiz-contact | `.apartment-card__image` | 413.44 × 310.08 | 0px | 0px | normal |
| 1440 | quiz-contact | `.apartment-card__body` | 389.44 × 198.66 | 20px 18px 0px | -35px 12px 0px | normal |
| 1440 | quiz-contact | `.favorites-bottom` | 1288.34 × 99.00 | 28px 0px 0px | 40px 0px 0px | 24px |
| 1440 | quiz-contact | `.favorites-continue` | 280.00 × 70.00 | 0px 36px | 0px | 24px |
| 1440 | quiz-contact | `.site-footer__inner` | 1425.00 × 1209.56 | 55px 68.3333px 50px | 0px | normal |
| 1440 | empty | `.site-header` | 1425.00 × 153.00 | 32px 0px 0px | 0px | normal |
| 1440 | empty | `.site-header__logo img` | 172.27 × 48.00 | 0px | 0px | normal |
| 1440 | empty | `.favorites-main` | 1425.00 × 957.06 | 40px 68.3333px 70px | 0px | normal |
| 1440 | empty | `.favorites-breadcrumbs` | 1288.34 × 28.00 | 0px | 0px | 8px |
| 1440 | empty | `.favorites-heading` | 1288.34 × 128.47 | 28px 0px 40px | 0px | 40px |
| 1440 | empty | `.favorites-toolbar` | 1288.34 × 45.00 | 0px | 0px | 24px |
| 1440 | empty | `.catalog-mode-switch` | 298.00 × 44.00 | 0px | 0px | 28px |
| 1440 | empty | `.favorites-summary` | 1288.34 × 76.00 | 0px | 0px | 16px |
| 1440 | empty | `.favorites-bottom` | 1288.34 × 99.00 | 28px 0px 0px | 40px 0px 0px | 24px |
| 1440 | empty | `.favorites-continue` | 280.00 × 70.00 | 0px 36px | 0px | 24px |
| 1440 | empty | `.favorites-empty` | 1288.34 × 430.59 | 70px 20px | 0px | normal |
| 1440 | empty | `.site-footer__inner` | 1425.00 × 1209.56 | 55px 68.3333px 50px | 0px | normal |
| 1440 | header-dropdown | `.site-header` | 1425.00 × 153.00 | 32px 0px 0px | 0px | normal |
| 1440 | header-dropdown | `.site-header__logo img` | 172.27 × 48.00 | 0px | 0px | normal |
| 1440 | header-dropdown | `.favorites-main` | 1425.00 × 1092.20 | 40px 68.3333px 70px | 0px | normal |
| 1440 | header-dropdown | `.favorites-breadcrumbs` | 1288.34 × 28.00 | 0px | 0px | 8px |
| 1440 | header-dropdown | `.favorites-heading` | 1288.34 × 128.47 | 28px 0px 40px | 0px | 40px |
| 1440 | header-dropdown | `.favorites-toolbar` | 1288.34 × 45.00 | 0px | 0px | 24px |
| 1440 | header-dropdown | `.catalog-mode-switch` | 292.00 × 44.00 | 0px | 0px | 28px |
| 1440 | header-dropdown | `.favorites-summary` | 1288.34 × 76.00 | 0px | 0px | 16px |
| 1440 | header-dropdown | `.favorites-grid` | 1288.34 × 565.73 | 0px | 0px | 40px 24px |
| 1440 | header-dropdown | `.apartment-card` | 413.44 × 565.73 | 0px 0px 18px | 0px | normal |
| 1440 | header-dropdown | `.apartment-card__image` | 413.44 × 310.08 | 0px | 0px | normal |
| 1440 | header-dropdown | `.apartment-card__body` | 389.44 × 198.66 | 20px 18px 0px | -35px 12px 0px | normal |
| 1440 | header-dropdown | `.favorites-bottom` | 1288.34 × 99.00 | 28px 0px 0px | 40px 0px 0px | 24px |
| 1440 | header-dropdown | `.favorites-continue` | 280.00 × 70.00 | 0px 36px | 0px | 24px |
| 1440 | header-dropdown | `.catalog-header-dropdown` | 220.00 × 252.00 | 30px 18px 8px | 0px | normal |
| 1440 | header-dropdown | `.site-footer__inner` | 1425.00 × 1209.56 | 55px 68.3333px 50px | 0px | normal |
