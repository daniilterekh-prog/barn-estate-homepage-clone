# Блоки Курортной

[Каталог](catalog.html) · [Сборное превью](index.html) · [Контракт](../UI-KIT.md) · [Страница и редактирование](../README.md) · [Проверки](../verification/package.json).

15 секций и 3 карточки перенесены из канонической библиотеки `barnes-assets`, commit `7000ede`; дизайн соответствует утверждённой Курортной. Это не другая страница и не новый вариант оформления.

## Два назначения файлов

- `page-desktop.html` / `page-mobile.html` — исходники 13 статических секций **целой страницы**. Редактируй их, затем запускай `node tools/build-page.cjs` из `kurortnaya/`.
- `fragment.html` / `mobile.html` — итоговый компонент для использования отдельно, после улучшений страницы. Превью — `index.html`. Не подключай `js/listing-mode.js` к уже готовому фрагменту листинга.
- `styles.css`, `block.json` — общий CSS, источник, зависимости и callbacks. Сохраняй scoped-классы и `data-v-*`.

Отдельный блок зависит от `blocks/_shared/`, `css/`, `js/` и `assets/` этого узла. Копируй их с сохранением структуры. Медиа и шрифты в единственном экземпляре в `assets/`; `_shared/*.css` подключают тот же CSS, что целая страница. Нет зависимости от соседних узлов сайта.

```html
<link rel="stylesheet" href="/kurortnaya/blocks/listing/styles.css">
<div id="catalog-slot"></div>
<script type="module">
import { mountNode } from '/kurortnaya/blocks/_shared/runtime.js';
const cleanup = await mountNode(
  document.querySelector('#catalog-slot'), '/kurortnaya/blocks/listing/', {
    onFilter: ({ key, trigger, root }) => openYourFilter({ key, trigger, root }),
    onSort: ({ value, root }) => sortYourCatalog(value, root),
    onRequest: ({ trigger }) => openYourRequestForm(trigger),
  }
);
// При удалении компонента вызови cleanup().
</script>
```

Для утверждённых dropdown/modal/map вместо собственных обработчиков фильтров передай `{ referenceFilters: true }` в `mountNode`, после монтажа один раз вызови `bootReferenceFilters()` из `_shared/reference-filters.js`. Он подключает **те же файлы `js/`**, что страница. Слайдер также использует общий `js/start-sales-cards.js`, в превью подключается автоматически.

До 540 px выбирается `mobile.html`; выше — `fragment.html`. При смене breakpoint приложение должно размонтировать и заново смонтировать компонент. HTTP необходим для `fetch` и modules. Для чужого сайта предпочтителен iframe/отдельный документ: экспорт сохраняет scoped CSS, но не обещает полной изоляции глобальных стилей.

## Интеграция

`onSubmit` подключает настоящий API; без него данные не отправляются. `onRequest` подключает форму хоста; без него открывается экспортированный request-modal. `onFilter/onSort/onSearch` подключают данные каталога, `onMap` — географическую карту, `onMenu` — меню сайта. Превью остаётся визуальным референсом и не выдаётся за боевую фильтрацию/API.

`sticky-nav` и `request-modal` генерируются общим runtime в целой странице; здесь их HTML сохранён отдельно для переноса. `card-*` — самостоятельные образцы карточек. Папки `filters-modal`, `quick-filter-dropdowns`, `map/panel` содержат инструкции к действующим общим контроллерам, не копии JS.

Время, адреса, фотографии, якоря, телефоны, ссылки и данные объектов заменяются под новый узел. Изменение исходников `page-*` не пересоздаёт автоматически итоговые экспортированные фрагменты: синхронизируй их отдельно и проверь превью.
