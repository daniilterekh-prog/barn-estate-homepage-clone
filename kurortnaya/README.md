# Курортная — самодостаточный узел первой степени

02.11.2026: размер логотипа и контур кнопки сверены с главной:48/36px, кнопка44px, border1px #8b1d25, padding0 18px, line-height1. Увеличение64/48 отменено.

**01.11.2026 · контракт1.1.0:** общие роли приведены к сегодняшнему утверждённому киту главной v1.0.0. **H1 hero и FAQ — исключения пользователя, сохранены без изменений.** [Актуальный контракт](UI-KIT.md), [происхождение и план](kit-2026-11-01.md), [проверка10ширин](https://github.com/daniilterekh-prog/barnes-sites/blob/main/main-site/pages/resort/kit-2026-11-01/verification/home-reference.json). Общий слой страницы и блоков — `css/home-reference.css`. Новые логотип/зелёный телефон сохранены локально.

Актуальная страница целиком, редактируемые блоки, отдельные превью, весь CSS/JS, изображения, SVG и Tilda Sans находятся **в этой папке**. Копируй всю `kurortnaya/`: соседние папки сайта не нужны. Для работы страницы не нужно устанавливать npm-пакеты.

```text
kurortnaya/
├── index.html, mobile.html  целая страница desktop/mobile
├── css/                    действующие стили, общий хэдер/футер
├── js/                     взаимодействия и данные карты
├── assets/                 актуальные изображения, SVG, fonts/
├── templates/              каркас страницы с местами для блоков
├── blocks/
│   ├── catalog.html        каталог отдельных превью
│   ├── index.html          сборное превью библиотеки
│   ├── _shared/            общие действия и подключения CSS
│   ├── header/, sticky-nav/, hero/, start-sales/, map/, listing/
│   ├── brand-intro/, cta-central/, directions/, news/, faq/
│   ├── cta-bottom/, footer/, floating-expert/, request-modal/
│   ├── card-start-sales/, card-project/, card-lot/
│   └── quick-filter-dropdowns/, filters-modal/
├── tools/                  сборщик и проверка переносимости
├── verification/           отчёты очистки и тестов
└── UI-KIT.md, STRUCTURE.md  контракт и решения по структуре
```

## Открыть страницу

Из `kurortnaya` запусти `python3 -m http.server 8785`, открой `http://127.0.0.1:8785/`. Мобильная загрузка и ES modules требуют HTTP, не `file://`. Папку можно разместить по любому пути.

## Изменить блок целой страницы

В 13 статических секциях `blocks/` есть `page-desktop.html` и `page-mobile.html` — исходники целой страницы **до выполнения JS**. Измени их и запусти из этой папки:

```sh
node tools/build-page.cjs
node tools/build-page.cjs --check
```

Сборщик вставляет фрагменты в `templates/desktop.html` и `templates/mobile.html`; результат — `index.html` и `mobile.html`. Не редактируй собранный HTML отдельно от исходников. Пути `assets/...` внутри `page-*.html` рассчитываются от корня целой страницы; сами эти файлы не являются отдельными превью.

Хэдер после hero и окно заявки дополняются `js/ui-kit-runtime.js`. Актуальные фильтры листинга, подборки и обе карточки уже находятся в HTML; `js/catalog-filters.js`, `js/quick-filters.js` и `js/brand-filters.js` подключают их взаимодействия. Оформление — одноимённые CSS в `css/`. Карточки стартов дополняются `js/start-sales-cards.js` и `css/start-sales-cards.css`.

## Вытащить блок для другого узла

В каждой папке блока: `fragment.html`, `mobile.html`, `styles.css`, `block.json`, `README.md`, `index.html`. Это итоговый компонент; `index.html` показывает его отдельно. Не подменяй `page-desktop.html` на `fragment.html`: повторная обработка JS создаст дубли.

Изображения и шрифты не дублируются по блокам: используются общие `assets/` и `css/` **внутри этого узла**. При переносе сохраняй структуру `blocks/ + css/ + assets/`. Скопировать один `fragment.html` без зависимостей недостаточно — они описаны в `block.json`. [Runtime и callbacks](blocks/README.md).

После изменения исходников страницы/JS обновляй также экспортированный `fragment.html`/`mobile.html` и контракт. Каноническая библиотека — [barnes-assets](https://github.com/daniilterekh-prog/barnes-assets/tree/main/blocks/nodes/first-degree). Превью библиотеки — не второй источник бизнес-данных: интеграция через callbacks.

После `capture-first-degree.cjs` из канонической библиотеки запускай `node kurortnaya/tools/sync-blocks.cjs` из корня репозитория: все18фрагментов обновятся из DOM, пути медиа перебазируются один раз, `page-*` исходники сохранятся. Затем проверь отдельные превью. `node tools/verify-home-reference.cjs URL` проверяет нормы сегодняшнего кита и неизменность H1/FAQ; `verify-package.cjs` — комплект и превью.

02.11.2026: исправлена кнопка «Читать далее», полный текст сверен с оригиналом; видимые названия обновлены на BARN Estate, включая отдельные блоки. [Проверка раскрытия и бренда](https://github.com/daniilterekh-prog/barnes-sites/blob/main/main-site/pages/resort/kit-2026-11-01/verification/intro-brand-2026-11-02.json), [источник текста](https://github.com/daniilterekh-prog/barnes-sites/blob/main/main-site/pages/resort/kit-2026-11-01/verification/intro-source-2026-11-02.json).

02.11.2026: блок связи и контурная заявка перенесены с главной в общий `css/header-actions.css`; [прямая сверка9ширин](https://github.com/daniilterekh-prog/barnes-sites/blob/main/main-site/pages/resort/kit-2026-11-01/verification/header-actions-2026-11-02.json). Исправлены скрытый телефон панели, перекрытие бургера и SVG закреплённого хедера.

02.11.2026: [микро-квиз эксперта](expert-quiz-2026-11-02.md) — цель/курорт/бюджет и контакты, возможность сразу задать вопрос; другие кнопки открывают прямую форму. [Проверки10экранов](https://github.com/daniilterekh-prog/barnes-sites/blob/main/main-site/pages/resort/kit-2026-11-01/verification/expert-quiz-2026-11-02.json). Отправка требует обработчика barn:lead; в превью данные не отправляются.

02.11.2026: подключено раскрытие FAQ, все10ответов полностью сверены с опубликованным сайтом; [источник](https://github.com/daniilterekh-prog/barnes-sites/blob/main/main-site/pages/resort/kit-2026-11-01/verification/faq-source-2026-11-02.json), [проверки страницы/блока](https://github.com/daniilterekh-prog/barnes-sites/blob/main/main-site/pages/resort/kit-2026-11-01/verification/faq-2026-11-02.json). Типографика и отступы FAQ сохранены.

## Проверки

`node tools/build-page.cjs --check` сверяет сборку. `node tools/verify-package.cjs http://127.0.0.1:8785/` проверяет папку, отдельно обслуживаемую HTTP-сервером: 8 ширин страницы, 36 превью, изображения, overflow, 404, JS-ошибки и внешние render-зависимости. Playwright задаётся через `PLAYWRIGHT_PATH`; используется существующий Chrome. Отчёт: `verification/package.json`.

Дополнительные проверки в репозитории: `scripts/verify-kurort-*.cjs`, с `KURORT_BASE_URL=http://127.0.0.1:8785/`. Удалённые старые версии восстанавливаются из истории Git; перечень — `verification/cleanup.json`.

## Что требует интеграции

Карта Яндекс — локальный статичный снимок `assets/map-preview.png`, не живой API. Полноэкранная панель и поиск по 32 сохранённым проектам работают локально; zoom масштабирует изображение. `market` всегда `new-build` или `secondary`; сброс не смешивает поиски. Полные фильтры едины для hero/листинга/карты; параметры без метаданных не имитируют фильтрацию каталога. Snapshot не является актуальной базой объектов.

Мессенджеры, телефон, политики и страницы объектов намеренно внешние. Отправка формы требует backend; демо не означает доставку заявки. Неиспользуемые ключи API Яндекс, vendor-runtime и сериализованные тайлы удалены.

## Происхождение

Основа: [фронт Курортной](https://front.barnes.vsavr.ru/kurortnaya/) и действующая согласованная адаптация. Библиотека блоков: `barnes-assets`, commit `7000ede`. Хэдер/футер — наш общий шаблон; меню первого экрана и способы связи приведены к утверждённой главной. [Происхождение херо](assets/hero-alpine-natural.md): одобренный desktop, неизменный mobile.

Frontend-памятка проверена: HyperUI доступен бесплатно по MIT, но здесь сохранены утверждённые компоненты BARNES, новые библиотеки не добавлены.

02.11.2026: крошки перенесены над линией hero-хедера, под линией добавлено меню главной. [Источник ссылок](https://github.com/daniilterekh-prog/barnes-sites/blob/main/main-site/pages/resort/kit-2026-11-01/verification/header-navigation-source-2026-11-02.json), [проверка адаптива](https://github.com/daniilterekh-prog/barnes-sites/blob/main/main-site/pages/resort/kit-2026-11-01/verification/header-navigation-2026-11-02.json).

Мобильные хедеры02.11: верхний ряд — геометрия главной, направления на мобильном скрыты; после hero — заявка36px и контактыSVG34px по центру ряда. [Замеры и проверка](https://github.com/daniilterekh-prog/barnes-sites/blob/main/main-site/pages/resort/kit-2026-11-01/verification/mobile-header-2026-11-02.json).

02.11.2026: старты продаж используют компоновку блока выбора главной без направлений; карточки500/410px, стрелки снизу и CTA каталога. [План/источник](start-sales-home-reference-2026-11-02.md), [прямая сверка](https://github.com/daniilterekh-prog/barnes-sites/blob/main/main-site/pages/resort/kit-2026-11-01/verification/start-sales-home-2026-11-02.json).

Актуальное уточнение03.11: строка направлений под линией удалена на всех ширинах, крошки возвращены в hero. [Проверка](https://github.com/daniilterekh-prog/barnes-sites/blob/main/main-site/pages/resort/kit-2026-11-01/verification/header-breadcrumbs-2026-11-03.json).

## Фильтры по общему каталогу ·02.11.2026

Панель, dropdown и светлая полная форма перенесены с `katalog-nedvizhimosti/?direction=international`, с курортными параметрами. Desktop: департамент/рынок/поиск, затем локация/стоимость/все фильтры. Mobile: четыре поля2×2 и поиск/иконка. Карта, счётчик, выбранные условия и сброс связаны с тем же state. Новостройки и вторичка всегда раздельны. Новых библиотек нет.

`catalog-filters.js` и `catalog-filters.css` — общий адаптер страницы и блоков. Исходные карточки и H1/FAQ сохранены. Проверки:9ширин320–3840px, прямое сравнение computed styles с референсом, применение/сброс/рынки/поиск/карта/сортировка, валидация/клавиатура/возврат фокуса и самостоятельные блоки. Ограничение snapshot-данных и контракт — в UI-kit; API каталога отдельно.

[План и источник](filters-catalog-reference-2026-11-02.md) · [Замеры/сценарии](https://github.com/daniilterekh-prog/barnes-sites/blob/main/main-site/pages/resort/kit-2026-11-01/verification/catalog-filters-2026-11-02.json) · [Переносимые блоки](https://github.com/daniilterekh-prog/barnes-sites/blob/main/main-site/pages/resort/kit-2026-11-01/verification/catalog-filter-blocks-2026-11-02.json).

02.11.2026: убрана светлая заливка выбранного способа связи в обоих CTA; активный канал бордовый. Исправлен оставшийся на WhatsApp класс --active после переключения. [Проверка каналов и клавиатуры](https://github.com/daniilterekh-prog/barnes-sites/blob/main/main-site/pages/resort/kit-2026-11-01/verification/cta-contact-active-2026-11-02.json).

03.11.2026: меню направлений под линией удалено на всех разрешениях, крошки возвращены в hero. Заголовок и поиск чуть ниже:16px mobile/24px desktop. Это уточнение отменяет прежние правила меню от02.11.2026. Контакты и хедер после hero сохранены.

[Расположение крошек и отступ херо03.11](hero-breadcrumbs-2026-11-03.md) · [Замеры12экранов](https://github.com/daniilterekh-prog/barnes-sites/blob/main/main-site/pages/resort/kit-2026-11-01/verification/header-breadcrumbs-2026-11-03.json) · [Отдельные блоки](https://github.com/daniilterekh-prog/barnes-sites/blob/main/main-site/pages/resort/kit-2026-11-01/verification/header-blocks-2026-11-03.json) · [Мобильная шапка](https://github.com/daniilterekh-prog/barnes-sites/blob/main/main-site/pages/resort/kit-2026-11-01/verification/mobile-header-2026-11-03.json).

03.11.2026: фильтры1.4.0 по свежей общей выдаче — dropdown рынка вместо двух кнопок, все четыре быстрых поля на desktop, покупка без аренды. Общий catalog-filters.js/css, shared dropdown/state; карточки и хедер сохранены. Проверки10ширин320–3840px и отдельных блоков.

[Актуальная панель03.11](filters-current-catalog-2026-11-03.md) · [Сверка с общей выдачей](https://github.com/daniilterekh-prog/barnes-sites/blob/main/main-site/pages/resort/kit-2026-11-01/verification/catalog-filters-2026-11-03.json) · [Переносимые фильтры](https://github.com/daniilterekh-prog/barnes-sites/blob/main/main-site/pages/resort/kit-2026-11-01/verification/catalog-filter-blocks-2026-11-03.json).

03.11.2026: подборки и сортировка полной карты собраны в один ряд на desktop; compact-раскладка сохранена. Контракт MapControlsRow и проверка map-controls-row-2026-11-03.json.

[Проверка строки карты](https://github.com/daniilterekh-prog/barnes-sites/blob/main/main-site/pages/resort/kit-2026-11-01/verification/map-controls-row-2026-11-03.json).

## Актуальная загрузка ·03.11.2026

Старая разметка фильтров и JS-пересборка листинга удалены. HTML сразу содержит актуальную панель и обе карточки с раздельными рынками; CSS страницы загружается в head до первого показа. Удалены прежние правила нижних линий и скрытия листинга. Все локальные CSS/JS-подключения страницы и превью используют выпуск `20261103-clean-load-18`; отдельные движки не дублируют уже загруженные стили. История доступна в Git, старые исполняемые варианты в текущей папке не нужны.

[Проверка загрузки](https://github.com/daniilterekh-prog/barnes-sites/blob/main/main-site/pages/resort/kit-2026-11-01/verification/current-load-2026-11-03.json) · [Описание очистки](current-load-2026-11-03.md).

03.11.2026 · крошки приведены к общей выдаче:17px выше768px,13px до768px,12px до540px; weight300, line-height18/16px. В медиа на769–1024px текст13px, в выдаче17px; на остальных проверенных ширинах текст совпадает. Расположение и цвета Курортной сохранены. Выпуск20261103-breadcrumbs-19. [Замеры трёх страниц](https://github.com/daniilterekh-prog/barnes-sites/blob/main/main-site/pages/resort/kit-2026-11-01/verification/breadcrumb-sizes-2026-11-03.json).

03.11.2026 ·1.5.0: [актуальные фильтры и полный повторный проход по киту](kit-refresh-2026-11-03.md). Панель/dropdown/full-form сверены с текущей общей выдачей. Карточки объектов исключены, H1/FAQ сохранены; исправлены роли и интервалы CTA/форм, направлений и новостей. Действующий выпуск20261103-kit-filters-20.

Опубликованная версия проверена03.11: страница900/2560px и отдельный блок карты1024px — выравнивание, чекбоксы, сортировка, клавиатура и сброс. [Проверка после публикации](https://github.com/daniilterekh-prog/barnes-sites/blob/main/main-site/pages/resort/kit-2026-11-01/verification/map-controls-row-published-2026-11-03.json).
Опубликованная очистка проверена03.11: 4ширины страницы, desktop/mobile без JS и 6проверок канонических блоков. [Результат после публикации](https://github.com/daniilterekh-prog/barnes-sites/blob/main/main-site/pages/resort/kit-2026-11-01/verification/current-load-published-2026-11-03.json).
Крошки после публикации проверены390/900/1440/2560px; [замеры и совпадение CSS библиотеки](https://github.com/daniilterekh-prog/barnes-sites/blob/main/main-site/pages/resort/kit-2026-11-01/verification/breadcrumb-sizes-published-2026-11-03.json).

Публикация1.5.0 проверена:11ширин общих ролей,4ширины popup/полной формы против выдачи, контрольные суммы CSS/JS канонических блоков. [Итоговые замеры](https://github.com/daniilterekh-prog/barnes-sites/blob/main/main-site/pages/resort/kit-2026-11-01/verification/kit-refresh-2026-11-03/published.json).

03.11.2026 ·1.5.1: [экспертный квиз по главной](quiz-home-parity-2026-11-03.md), Денис и курортные вопросы. Публичный core d5c5ecf; shared-блоки синхронизированы.

03.11.2026 ·1.5.2: [ряд подборок/карты/сортировки](listing-controls-row-2026-11-03.md); подпись второй подборки — exclusive. Публичный core c848727.


## Первый экран пяти узлов ·05.11.2026

По поручению пользователя хедер, высота hero, размеры H1 и десктопные крошки соответствуют текущей продаже собственникам. Общий компонент `main-site/shared/node-shell`; все пять узлов правятся одновременно. Прежнее исключение H1 Курортной заменено этим правилом. Тексты, РОПы, фотографии, объекты и предметные параметры поиска сохранены. [Контракт и сборка](https://github.com/daniilterekh-prog/barnes-sites/tree/main/main-site/shared/node-shell). Новых runtime-зависимостей нет.
