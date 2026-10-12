# Вопросы и ответы

Эталон узла первой степени. Источник: `kurortnaya`, commit `14401c518b4a5f51e910121f1741d79efa164a80`.

- `fragment.html` — desktop/tablet; `mobile.html` — до 540 px.
- `index.html` — самостоятельное превью.
- `styles.css` — подключение общего слоя; копируйте `blocks/_shared`, `css`, `js`, `assets` узла вместе с блоком.
- `block.json` — источник, зависимости и интеграционные callbacks.

Импортируйте `mountNode` из `../_shared/runtime.js` и передайте URL папки и обработчики. Сохраняйте классы и `data-v-*`: они являются частью экспортированного CSS-контракта. Тексты, изображения, ссылки, телефоны и ID якорей заменяются под новый узел. Полная инструкция: [общий README](../README.md).

Для правки целой страницы используй `page-desktop.html` и `page-mobile.html`, затем `node tools/build-page.cjs` из корня узла. Не подменяй исходник на итоговый `fragment.html`.
