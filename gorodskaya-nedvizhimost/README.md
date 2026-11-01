# Городская недвижимость — самостоятельный узел

## Обновление по главной · 01.11.2026

Рабочая версия приведена к [утверждённому UI-киту главной v1.0.0](https://github.com/daniilterekh-prog/barnes-sites/blob/main/main-site/pages/home/exact-2026-10-21/UI-KIT.md): сетка, ритм секций, брови, вводный заголовок, кнопки, хедер/мобильные контакты, старты500/410px и стрелки справа снизу, карточки направлений300, локальные портреты и новый квиз. Москва предвыбрана; обращения по выбранному объекту открывают короткий контактный шаг с названием/ссылкой и каналом «Звонок».

Исходник восстановления — актуальный автономный городской пакет публичного snapshot797cda2; прежний импортированный Nuxt-вход рабочей базы был старее опубликованной городской. Новый index.html использует только css/js/assets/templates/blocks. Сохранившиеся импортированные index.inline-*.css/js, _nuxt, standalone и assets/source-assets не подключены к новой странице и **не входят в публичный экспорт**; не удалялись без сверки зависимостей других импортированных страниц.

`css/home-kit.css`, `css/request-quiz.css`, `css/quiz-buttons.css`, `js/home-kit.js`, `js/node-modal.js` — текущий контракт. Форма происходит из home/exact-2026-10-21/source/home-owner-form.*; кнопки — home-buttons.css; зелёный Call SVG — Material Icons Apache-2.0, лицензия в assets/material-icons-LICENSE.txt. Ассеты и SHA — assets/manifest.json. Новых библиотек нет.

Из корня barnes-sites:

```sh
node main-site/pages/city/tools/build-page.cjs
python3 -m http.server 4190 --directory main-site/pages/city
node main-site/pages/city/tools/verify-home-kit.cjs http://127.0.0.1:4190/
node main-site/pages/city/tools/export-blocks.cjs http://127.0.0.1:4190/
node main-site/pages/city/tools/verify-package.cjs http://127.0.0.1:4190/
node main-site/pages/city/tools/export-public.cjs /absolute/path/to/public-repo/gorodskaya-nedvizhimost
```

В публичном пакете те же команды запускаются из папки gorodskaya-nedvizhimost с префиксом tools/. Экспорт обновляет только городскую; другие разделы и главная не изменяются. [Исходный аудит и план](https://github.com/daniilterekh-prog/barnes-sites/blob/main/docs/audits/city-vs-home-kit-2026-11-01/README.md).

Папка устроена по принципу `kurortnaya/`: её можно перенести целиком и запустить отдельным статическим HTTP-сервером. Для отображения не нужны соседние страницы, общие папки изображений, Nuxt, CDN, ключи карты или сборщик пакетов. Главная страница не изменена.

## Структура

- `index.html`, `mobile.html` — собранные desktop/mobile документы.
- `templates/` — оболочки документов с маркерами блоков.
- `blocks/*/page-desktop.html`, `page-mobile.html` — редактируемые секции исходной страницы.
- `blocks/*/fragment.html`, `mobile.html` — итоговый DOM компонентов, не источник сборки страницы.
- `blocks/catalog.html` — каталог21 компонента с отдельными превью.
- `css/`, `js/` — собственные стили и контроллеры.
- `assets/` — локальные изображения, SVG и шрифты; `manifest.json` хранит происхождение.
- `tools/` — сборка, экспорт, очистка и проверки.
- `verification/` — отчёты проверок и перечень удалённых файлов.

## Работа с папкой

Из корня репозитория:

```sh
node tools/build-page.cjs
node tools/build-page.cjs --check
python3 -m http.server 4190
```

После изменения источников пересобрать страницу, запустить отдельный сервер, затем обновить экспорт:

```sh
node tools/export-blocks.cjs http://127.0.0.1:4190/
node tools/verify-package.cjs http://127.0.0.1:4190/
node tools/clean-package.cjs
```

Очистка по умолчанию только показывает кандидатов. `--apply` удаляет явно перечисленные файлы внутри этой папки. Исторические версии восстанавливаются из Git, а не хранятся рядом с рабочими ассетами. Общие файлы других страниц не удаляются.

`scripts/sync-city-real-estate.py` теперь обёртка локальной сборки. `scripts/package-city-node.cjs` — одноразовая миграция старого Nuxt-снимка, не команда дальнейшего редактирования.

## Источники и ограничения

Верстка и московский контент: [исходная городская страница](https://barn-estate.ru/gorodskaya-nedvizhimost/). Карточки, быстрые фильтры, раскрытая карта и форма: авторские компоненты [Курортной](https://github.com/daniilterekh-prog/barn-estate-homepage-clone/tree/master/kurortnaya), адаптированные в собственные файлы города. Канонический контракт: [BARNES FirstDegreeNode](https://github.com/daniilterekh-prog/barnes-assets/blob/main/ui-kit/first-degree.md). Новые сторонние библиотеки не добавлены.

Подложка карты локальная статичная; выдача — сохранённые4 проекта и12 лотов, не живой API. Формы демонстрационные и не отправляют заявки; телефон, мессенджеры и ссылки на объекты остаются внешними бизнес-ссылками. Фон CTA задокументирован в `assets/cta-ruslan-unified-v1.md`.

После удаления дублей две ссылки страницы аренды переведены на побайтно идентичные общие изображения, чтобы не сломать её. Это не зависимость городской папки от аренды.
