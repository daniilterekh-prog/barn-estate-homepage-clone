# Закреплённый хедер

[Превью](index.html) · [HTML](../../html/02-owner-sale-sticky.html) · [CSS](../../css/02-owner-sale-sticky.css) · [JS](../../js/02-owner-sale-sticky.js)

../../html/02-owner-sale-sticky.html содержит только компонент с его адаптером/данными, без повторных body/main/layout. Используй общую оболочку [page-shell.html](../../html/page-shell.html) или такие же классы/атрибуты body и родителей на целевой странице. Общий контекст CSS: ../../css/page.css.

Подключи ../../css/02-owner-sale-sticky.css и ../../js/02-owner-sale-sticky.js. Зависимости и описание — ../../js/02-owner-sale-sticky.json. Исходные имена классов и data-v-* входят в CSS-контракт: сохраняй их при переносе. Если монтируешь в SPA — вызови initBlock после вставки и cleanup при удалении.

Формы используют один общий компонент: shared/js/home-quiz.js для главной/Медиа, shared/js/expert-dialog.js для собственников/амбассадоров. Меняются только текст/картинка. Поиск, отправка и подписка передаются событиями barn:search, barn:submit, barn:subscribe; backend здесь не подключён. Глобальные URL и якоря адаптируй к целевому сайту.
