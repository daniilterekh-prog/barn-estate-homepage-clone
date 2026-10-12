# Курортная — самодостаточный узел первой степени

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

Хэдер после hero, окно заявки, переключатель/параметры листинга и вторичный лот создаются действующим JS: `js/ui-kit-runtime.js`, `js/listing-mode.js`, `js/quick-filters.js`, `js/brand-filters.js`. Оформление — одноимённые CSS в `css/`. Карточки стартов дополняются `js/start-sales-cards.js` и `css/start-sales-cards.css`.

## Вытащить блок для другого узла

В каждой папке блока: `fragment.html`, `mobile.html`, `styles.css`, `block.json`, `README.md`, `index.html`. Это итоговый компонент; `index.html` показывает его отдельно. Не подменяй `page-desktop.html` на `fragment.html`: повторная обработка JS создаст дубли.

Изображения и шрифты не дублируются по блокам: используются общие `assets/` и `css/` **внутри этого узла**. При переносе сохраняй структуру `blocks/ + css/ + assets/`. Скопировать один `fragment.html` без зависимостей недостаточно — они описаны в `block.json`. [Runtime и callbacks](blocks/README.md).

После изменения исходников страницы/JS обновляй также экспортированный `fragment.html`/`mobile.html` и контракт. Каноническая библиотека — [barnes-assets](https://github.com/daniilterekh-prog/barnes-assets/tree/main/blocks/nodes/first-degree). Превью библиотеки — не второй источник бизнес-данных: интеграция через callbacks.

## Проверки

`node tools/build-page.cjs --check` сверяет сборку. `node tools/verify-package.cjs http://127.0.0.1:8785/` проверяет папку, отдельно обслуживаемую HTTP-сервером: 8 ширин страницы, 36 превью, изображения, overflow, 404, JS-ошибки и внешние render-зависимости. Playwright задаётся через `PLAYWRIGHT_PATH`; используется существующий Chrome. Отчёт: `verification/package.json`.

Дополнительные проверки в репозитории: `scripts/verify-kurort-*.cjs`, с `KURORT_BASE_URL=http://127.0.0.1:8785/`. Удалённые старые версии восстанавливаются из истории Git; перечень — `verification/cleanup.json`.

## Что требует интеграции

Карта Яндекс — локальный статичный снимок `assets/map-preview.png`, не живой API. Полноэкранная панель и поиск по 32 сохранённым проектам работают локально; zoom масштабирует изображение. `market` всегда `new-build` или `secondary`; сброс не смешивает поиски. Полные фильтры едины для hero/листинга/карты; параметры без метаданных не имитируют фильтрацию каталога. Snapshot не является актуальной базой объектов.

Мессенджеры, телефон, политики и страницы объектов намеренно внешние. Отправка формы требует backend; демо не означает доставку заявки. Неиспользуемые ключи API Яндекс, vendor-runtime и сериализованные тайлы удалены.

## Происхождение

Основа: [фронт Курортной](https://front.barnes.vsavr.ru/kurortnaya/) и действующая согласованная адаптация. Библиотека блоков: `barnes-assets`, commit `7000ede`. Хэдер/футер — наш шаблон собственников продажи, без направлений. [Происхождение херо](assets/hero-alpine-natural.md): одобренный desktop, неизменный mobile.

Frontend-памятка проверена: HyperUI доступен бесплатно по MIT, но здесь сохранены утверждённые компоненты BARNES, новые библиотеки не добавлены.
