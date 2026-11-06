# Пять узлов BARN Estate для разработчиков

Дата06.11.2026. 90 отдельных блоков. [Каталог превью](index.html).

| Узел | Папка | HTML | CSS | JS | Блоки |
|---|---|---|---|---|---|
| Городская недвижимость | [city](city/) | [html](city/html/) | [css](city/css/) | [js](city/js/) | [blocks](city/blocks/) |
| Загородная недвижимость | [country](country/) | [html](country/html/) | [css](country/css/) | [js](country/js/) | [blocks](country/blocks/) |
| Зарубежная недвижимость | [international](international/) | [html](international/html/) | [css](international/css/) | [js](international/js/) | [blocks](international/blocks/) |
| Коммерческая недвижимость | [commercial](commercial/) | [html](commercial/html/) | [css](commercial/css/) | [js](commercial/js/) | [blocks](commercial/blocks/) |
| Курортная недвижимость | [resort](resort/) | [html](resort/html/) | [css](resort/css/) | [js](resort/js/) | [blocks](resort/blocks/) |

Каждая страница разделена по типам файлов. Номер блока одинаков в html/css/js. В blocks/ — превью, описание и зависимости. Для просмотра запусти python3 -m http.server 8080 из этой папки. Полные страницы сохраняют текущую логику; сложные зависимости каталога/карты описаны в INTEGRATION.md. Формы данные не отправляют. Проверки: verification/.
