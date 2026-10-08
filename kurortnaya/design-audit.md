# Design Audit

## Page

- Локальная страница: `/kurortnaya/`
- Эталон для сравнения: https://barn-estate.ru/kurortnaya/
- Дата аудита: 2026-10-07
- Статус: обновлённый snapshot синхронизирован со staging `front.barnes.vsavr.ru` и повторно проверен.

> В приложенном брифе URL оставлен как `[ВСТАВИТЬ URL]`. В качестве эталона использован URL из исходной задачи — `https://barn-estate.ru/kurortnaya/`.

## Audit Scope

Проверены: структура страницы сверху вниз, фактический DOM и computed styles, CSS media queries, контейнеры, grid/flex, типографика, цвета, spacing, кнопки и их состояния, ссылки, карточки, изображения, формы, header, sticky-навигация, hero, footer, мобильное поведение, viewport height, touch targets, SEO-метаданные, внешние зависимости, console/network errors и горизонтальное переполнение.

Инструменты: Chrome headless через CDP, локальный HTTP server на `127.0.0.1:4173`, CSS-источник `barnes-source.css`, контрольные DOM-измерения live-страницы. Проверены локальные ширины 320–1920 px и контрольные высоты; live-источник — на контрольных ширинах 320, 390, 430, 768, 1024, 1280, 1440 и 1920 px.

## Executive Summary

Визуально локальный snapshot сохраняет структуру и computed layout исходной страницы: hero, карточки, map, формы, FAQ, news и footer присутствуют; корневого горизонтального overflow не обнаружено. Основные проблемы относятся не к текущей геометрии, а к архитектуре копии и доступности:

1. локальная страница загружает внешний runtime и карты с `barn-estate.ru`/Yandex; в локальном origin браузер фиксирует CORS-ошибки;
2. mobile-версия выбирается через `fetch('mobile.html')` + `document.write`, а при ошибке fetch нет видимого fallback/error state;
3. `index.html` и `mobile.html` — два больших дублирующих snapshot-файла суммарно около 1.56 MB;
4. на breakpoint 540/541 px и 1024/1025 px одновременно переключаются hero, фильтры, grid, FAQ, footer и типографика — это резкий layout cliff;
5. у форм нет полноценной видимой label/aria-label схемы для текстовых полей, у 15 изображений нет alt, а несколько мобильных интерактивных элементов меньше рекомендуемой touch area 44×44 px.

## Page Structure

| № | Секция | Тип | Основные элементы | Контейнер / сетка | Фон |
|---:|---|---|---|---|---|
| 1 | Global header | overlay / absolute | menu, logo, search, favorites, phone | `.site-header__inner.base-container` | transparent over hero |
| 2 | Catalog sticky nav | fixed, initially hidden | anchor buttons, request, phone | `.catalog-page-nav__inner.base-container` | `#fff` |
| 3 | Hero `#catalog-hero` | image + overlay | breadcrumbs, H1, search/filter form, quick links | max-width form 982 px | image + `linear-gradient(180deg,#0000004d,#00000014 50%,#0000006b)` |
| 4 | New starts `#catalog-new-starts` | slider | four offer cards, arrows, Splide track | variable slide width, 1–3 visible cards | `#fff` |
| 5 | Map `#catalog-map` | map block | title, description, Yandex map, search/fullscreen controls | base container; map canvas full block | `#fff` |
| 6 | Catalog `#catalog-grid` | product grid | title, sort select, 12 apartment cards, more button | 3 / 2 / 1 columns | `#fff` |
| 7 | Intro `#catalog-intro` | editorial split block | eyebrow, H2, lead, expandable details, image | 2 columns desktop, 1 column ≤1024 | `#fff` |
| 8 | Consultation `#catalog-consultation` | image CTA + form | expert, methods, name/phone/comment/consent | max content 690/560 px | image; mobile `#262626` |
| 9 | Departments `#catalog-departments` | image card grid | 5 direction cards, title and arrow | 6 columns desktop, 1 column ≤1024 | `#fff` |
| 10 | News `#catalog-news` | slider/cards | six article cards, pagination on mobile, nav desktop | Splide; 1 mobile slide | `#fff` |
| 11 | FAQ `#catalog-faq` | accordion | 10 questions, two columns desktop | 2 columns ≥541, 1 ≤540 | `#fff` |
| 12 | Contact `#catalog-contact` | image CTA + form | expert card, methods, form | 2 columns desktop, 1 ≤1024 | dark image block |
| 13 | Footer | navigation + contacts | logo, 8/4/2 nav columns, phone, email, socials, callback | `.site-footer__inner.base-container` | `#262626` |
| 14 | Floating / teleports | fixed / modal infrastructure | floating expert card, close, modal mount points | fixed right/bottom | white card / transparent layer |

## Breakpoints

### Реальные page-level breakpoints

| Диапазон | Фактическое поведение |
|---|---|
| `≤540` | mobile: hero 684 px, stacked filter 124 px, 1 catalog column, 1 FAQ column, mobile footer, hidden desktop arrows |
| `541–768` | hybrid mobile/tablet: hero 644 px, inline filter, 2 catalog columns, 2 FAQ columns, departments остаётся одной колонкой |
| `769–1024` | tablet: 2 catalog columns, one-column intro/departments, two-column FAQ, footer 2 columns |
| `1025–1280` | compact desktop: 3 catalog columns, 6 departments columns, footer 4 columns, desktop hero spacing |
| `1281–1440` | desktop: header nav hidden при `≤1280`; footer расширяется до 8 колонок выше 1280; section padding 60 px |
| `1441–1920` | wide desktop: section padding 75 px, hero min-height 694 px, large type and wider slider |
| `>1920` | base container capped at 1920 px; consultation has separate `min-width:1921px` rule |

В исходном CSS также встречаются вспомогательные пороги `560`, `640`, `768`, `860`, `901`, `1024`, `1280`, `1440`, `1920`; для основной страницы наиболее значимые переключения — `540`, `640`, `768`, `1024`, `1280`, `1440` и `1920`.

### Точки до / на / после breakpoint

Проверены пары `539/540/541`, `639/640/641`, `767/768/769`, `1023/1024/1025`, `1279/1280/1281`, `1439/1440/1441`. Самые резкие изменения обнаружены на `540/541` и `1024/1025`; подробности — в Master Issue Table.

## Responsive Matrix

Проверены точные ширины: `320, 360, 375, 390, 414, 430, 480, 539, 540, 541, 576, 600, 639, 640, 641, 720, 767, 768, 769, 800, 801, 834, 900, 960, 1023, 1024, 1025, 1100, 1152, 1200, 1279, 1280, 1281, 1366, 1439, 1440, 1441, 1536, 1600, 1728, 1920`.

В таблице ниже `container` — фактическая ширина layout viewport после классического scrollbar; `content` — ширина внутренней области после горизонтальных padding.

| Viewport | Hero | Filter | Catalog grid | FAQ grid | Container / content | Наблюдение |
|---:|---:|---:|---:|---:|---:|---|
| 320 | 684 | 124 stacked | 1 | 1 | 305 / 275 | fit; узкая типографика и small controls |
| 390 | 684 | 124 stacked | 1 | 1 | 375 / 342 | fit; H1 в 1 строку |
| 430 | 684 | 124 stacked | 1 | 1 | 415 / 381 | fit; cards растягиваются по ширине |
| 540 | 684 | 124 stacked | 1 | 1 | 525 / 487 | последний mobile state |
| 541 | 644 | 70 inline | 2 | 2 | 526 / 488 | резкий переход mobile → hybrid |
| 640 | 644 | 70 inline | 2 | 2 | 625 / 583 | intro ещё tablet-style |
| 768 | 644 | 70 inline | 2 | 2 | 753 / 708 | `max-width:768` boundary |
| 1024 | 644 | 70 inline | 2 | 2 | 1009 / 929 | последний tablet state |
| 1025 | 644 | 70 inline | 3 | 2 | 1010 / 930 | grid/departments/footer переключаются |
| 1280 | 644 | 70 inline | 3 | 2 | 1265 / 1151 | footer ещё 4 columns, header nav hidden |
| 1440 | 644 | 70 inline | 3 | 2 | 1425 / 1290 | основной контрольный desktop |
| 1920 | 694 | 70 inline | 3 | 2 | 1905 / 1707 | wide desktop; hero 694 px |

### Viewport height

Проверены: `1366×768`, `1440×900`, `1920×1080`, `2560×1440`, `390×844`, `375×667`, `430×932`. Hero, sticky elements и CTA не используют `100vh/100svh/100dvh` для своей высоты; hero задаётся `min-height` в px. Контент не клиппируется по высоте. `safe-area-inset-*` в CSS не обнаружены; fixed floating expert использует обычные `16/24px` offsets.

## Horizontal Overflow

Проверка `document.documentElement.scrollWidth`, `document.body.scrollWidth` и `document.documentElement.clientWidth` выполнена на всех 41 локальной ширине. Корневой horizontal overflow не найден: `scrollWidth === clientWidth` на всех измерениях.

DOM-поиск отдельных элементов намеренно находит отрицательно сдвинутые Splide clone slides и внутренний map content. Это ожидаемая внутренняя геометрия каруселей, она обрезается `.splide__track { overflow:hidden }`/`overflow-x:clip` и не увеличивает scrollable width страницы. Исправлять её как page-level overflow не требуется.

## Container System

Основная система — `.base-container { width:100%; max-width:1920px; margin:0 auto; }`.

| Viewport | Layout container | Measured horizontal padding | Content width | Fill |
|---:|---:|---:|---:|---:|
| 320 | 305 | 14.9 | 275.2 | 90.2% |
| 390 | 375 | 16.3 | 342.4 | 91.3% |
| 430 | 415 | 17.1 | 380.8 | 91.8% |
| 768 | 753 | 23.5 | 707.9 | 94.0% |
| 1024 | 1009 | 39.9 | 929.2 | 92.1% |
| 1280 | 1265 | 56.8 | 1151.4 | 91.0% |
| 1440 | 1425 | 67.3 | 1290.3 | 90.6% |
| 1920 | 1905 | 99.0 | 1707.0 | 89.6% |

Основные секции совпадают по направляющим. Зафиксированы осознанные локальные исключения: hero inner на mobile добавляет `padding: 0 16px 24px`, departments inner использует `20px` на mobile, consultation media имеет собственную формулу padding, contact inner — `14px` сверху. Эти исключения стоит задокументировать токенами, чтобы дальнейшие страницы их не дублировали вручную.

## Grid System

| Компонент | Desktop | Tablet | Mobile |
|---|---|---|---|
| Catalog cards | `repeat(3,minmax(0,1fr))`, gap 24 | `repeat(2,minmax(0,1fr))`, gap 24 | `1fr`, gap 24 |
| Departments | 6 columns, gap 2, card 340 px at 1440 | 1 column, card 280 px | 1 column, card 220 px |
| FAQ | 2 columns, gap 48–80 | 2 columns, gap 48 | 1 column, gap 0 |
| Intro | 2 equal columns, gap `clamp(36px,5vw,80px)` | 1 column, gap 34 | 1 column, gap 22 |
| Footer nav | 8 columns >1280 | 4 columns 1025–1280; 2 ≤1024 | 2 columns with mobile spacing |
| Offers | variable 3-card slider | variable 2–3-card slider | 1 full-width slide |

## Typography

Основной шрифт: `Tilda Sans`, fallback `Tilda Sans Fallback`, system stack. Локальные woff2-файлы подключены inline; основной source stylesheet также загружается отдельно.

| Type / component | Font | Size | Weight | Line height | Letter spacing | Color |
|---|---|---:|---:|---:|---:|---|
| Hero H1 desktop | Tilda Sans | `clamp(38px,4vw,58px)` | 300 | 1.05 | `-.045em` | `#fff` |
| Hero H1 mobile | Tilda Sans | 32 px | 300 | 33.6 px | `-.045em` | `#fff` |
| Main section title | Tilda Sans | 44 → 38 → 22/30 px | 300 | 1–1.2 | normal | `#1e1e1e` |
| Catalog title | Tilda Sans | 44 → 38 → 24 px | 300 | 1.1/1.15 | normal | `#1e1e1e` |
| Intro title | Tilda Sans | `clamp(36px,3.1vw,44px)` → 29 px | 300 | 1.08/1.12 | `-.035em` | `#1e1e1e` |
| Consultation/contact title | Tilda Sans | 40 → 34 → 31 px | 300 | 1.05–1.1 | contact `-.05em` | `#fff` |
| Card H3 | Tilda Sans | 22 → 20 px | 300 | 1.15 | normal | `#fff` |
| Body / lead | Tilda Sans | 22/20/18 → 15 px | 300 | 1.3–1.5 | normal | `#262626` / alpha |
| Button | Tilda Sans | 16–18 → 14–16 px | 300–500 | 1–1.2 | normal | variant-dependent |
| Form input | Tilda Sans | 20/18 → 15 px | 300 | 1.3 | normal | `#fff` on dark form |
| Footer link | Tilda Sans | 18 → 16 → 11 px | 300 | 1 | normal | `#fffc` |

Responsive typography is mostly systematic through `clamp()` and explicit `540/640/1024/1440` overrides. The notable discontinuity is the full `32px → 38px` H1 jump at 540/541 rather than a fluid interpolation.

### Text wrapping

- At 320 px the hero H1 wraps into 2 lines; at 390–430 px it fits in 1 line.
- At 390 px the long catalog, intro and FAQ headings use 2–3 lines; they remain inside the content column without clipping.
- Button labels do not visibly wrap in the tested states.
- Sticky catalog navigation is intentionally horizontally scrollable; its links remain single-line.
- The contact/consultation titles use separate mobile headings and do not overflow.

## Spacing

| Section | Desktop wide | 1440 / laptop | Mobile |
|---|---:|---:|---:|
| Hero min-height | 694 | 644 | 684 |
| Offers padding block | 75 | 60 | 35 |
| Map padding block | 75 | 60 | 40 |
| Catalog grid padding block | 75 | 60 | 40 |
| Intro padding | 80 / 54 | 70 / 42 at ≤1024 | 42 / 32 at ≤640 |
| Consultation outer padding | 60 | 48 | 32 |
| FAQ padding top / bottom | 75 / 94 | 60 / 120 | 40 / 43 |
| News padding block | 75 | 60 | 35 |
| Footer inner padding | 55 / 50 | 40 / 28 at ≤1024 | 32 / 28 |

Повторяющаяся scale: `2, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32, 35, 40, 48, 56, 60, 68, 70, 75, 80, 94`. Значения `35`, `43`, `54`, `67`, `73`, `94` являются контекстными, но должны быть описаны как section-specific tokens, иначе при добавлении новых страниц появится drift.

## Colors

| Token / role | Реальное значение | Использование |
|---|---|---|
| Primary text | `#1e1e1e` | body, headings, controls |
| Secondary text | `#262626` | card/body copy, dark surfaces |
| Brand burgundy | `#8b1d25` | active, primary buttons, labels |
| Brand hover | `#801b22` | hero submit hover |
| Warm accent | `#e7c88f` | desktop link hover |
| White | `#fff` | surfaces, light text |
| Soft surface | `#f7f7f7` | secondary button hover, controls |
| Image surface | `#f1f1f1` | image placeholders |
| Muted control | `#656462` | slider arrows and borders |
| Footer / dark surface | `#262626` | footer, mobile CTA |
| Border | `rgba(30,30,30,.08/.12/.2)` | dividers, selects |
| White text alpha | `#fffc`, `#ffffff8c`, `#ffffffb3` | footer and dark CTA copy |
| Overlay | `#00000014`, `#0000001f`, `#0000002e`, `#00000047`, `#0000004d`, `#0000006b` | hero, cards, map/CTA overlays |

Есть функционально близкие alpha-варианты `#1e1e1e80`, `#1e1e1e99`, `#1e1e1eb3`, `#fffc`, `#ffffff8c`, `#ffffffb3`. Рекомендуется свести их в semantic tokens `--text-muted`, `--text-subtle`, `--on-dark-muted` и не размножать hex-альфы по компонентам.

## Buttons and Interactive States

В локальном snapshot обнаружено 67 `<button>` и 12 визуально оформленных button-links. Классификация:

| Тип | Селекторы / количество | Default / размеры |
|---|---|---|
| Primary submit | `.ui-button--primary...`, 2 | min-height 56–70; full width in forms |
| Card actions | `.apartment-card__favorite`, 12; `.apartment-card__call-btn`, 12; detail links, 12 | favorite base 20×20, surrounding card actions about 40 px |
| Slider arrows | offers 2, news 2 | 68×68 desktop, 56×56 ≤1440, 48×48 ≤540 |
| Filter controls | hero search/filter/submit | desktop 70 px, mobile search/filter 58 px, submit 56 px |
| Tabs / methods | consultation 3, contact 3 | 34 px at ≤1440, 2-column flex at mobile |
| FAQ accordion | 10 `.catalog-faq__question` | full width, 20–24 px vertical padding |
| Navigation | 4 catalog nav buttons + request | single-line; sticky nav horizontally scrolls |
| Sort / more / map | select min-height 44; map controls; more links | select meets target; map inner controls vary |
| Footer / floating | callback button, floating card, close | callback min-height 56/48; close 30×30 |

Состояния, найденные в CSS:

- default: описан для всех основных variants;
- hover: есть для desktop при `min-width:1025px` у primary, arrows, links, cards, methods и footer;
- focus-visible: глобальный `2px` outline, отдельные burgundy rules у `.ui-button` и form controls;
- active/selected: `.catalog-page-nav__link--active`, method active, favorite active, FAQ open;
- disabled: `ui-button`, slider arrows, sort/more controls с opacity/cursor;
- loading: предусмотрен только класс `.ui-button--loading`, фактический loading state в текущей странице не активен;
- visited: отдельного состояния для ссылок нет; используется inherited/default color.

Touch audit выявил элементы меньше 44×44 px: mobile menu visual button 29×29, phone icon 22×22, sticky-nav links 23 px по высоте, floating close 30×30, часть map controls 30 px. Не все имеют доказанный фактический wrapper 44×44, поэтому это OPEN accessibility issue, а не только косметика.

## Links

В DOM проверено 137 `<a>`; пустых `href` не обнаружено. Основные link states используют `transition`, underline для read-more/privacy/FAQ content и burgundy/gold hover в desktop. Small text links в footer имеют computed height около 12 px на mobile и требуют сохранения увеличенной clickable area через родительский item.

## Cards and Images

- Catalog: 12 cards, `.apartment-card--catalog`, image ratio `4/3`, `object-fit: cover`, no radius, bottom padding 18 px.
- Offers: four logical cards plus Splide clones; active card is wider, inactive cards use a reduced width (`.86` of active width).
- Departments: five image cards; 6-column desktop grid with item spans and 280/220 px mobile/tablet minimum heights.
- News: six cards, image ratio `540/489`, `object-fit: cover`; mobile uses one slide and pagination.
- Intro image: `16/10` desktop, natural height with max-height 360 px at ≤1024 and 230 px at ≤640.
- В snapshot 58 image elements; 15 have no `alt`, ещё 3 имеют empty `alt`. Часть может быть decorative/map-generated, но нужно явно разделить `alt=""` для декоративных изображений и meaningful alt для content images.

## Forms

Есть 3 формы: hero search, consultation и contact. Обе lead-формы содержат name, phone, comment, consent и honeypot. Text inputs в DOM не имеют `id` + связанной visible `<label>` или `aria-label`; placeholder используется как основной визуальный hint. Это ухудшает screen-reader и error-state UX.

Стили форм: dark surface, input без внешней рамки с нижней border, desktop input 18–20 px, mobile 15 px, gap form 6 px, field padding-bottom 12 px, primary submit full-width. Focus border/box-shadow предусмотрены. Error classes предусмотрены в CSS, но в initial state и без заполнения ошибки не активны; автоматическая validation submission намеренно не выполнялась, чтобы не отправлять реальные формы.

## Header, Navigation and Hero

Header — absolute overlay, `z-index:100`, padding top 32 px (16 px mobile). При scroll/menu-open становится fixed white header с `z-index:200/1300`, shadow `0 4px 24px #00000014`. Desktop nav скрывается при `≤1280`; mobile header использует centered logo и боковые controls.

Hero измерен как 694 px при wide desktop, 644 px при 541–1440 и 684 px при ≤540. H1 центрирован; search bar max-width 982 px, desktop height 70 px, mobile 124 px stacked. Breadcrumb top: 140 px wide, 120 px ≤1440, 110 px ≤1024, 100 px ≤768, 88 px ≤540.

## Footer

Footer uses `#262626`, desktop 8-column navigation above 1280, 4 columns at 1025–1280, 2 columns ≤1024; mobile keeps 2-column nav and stacks contacts/meta/callback. Mobile footer adds inline `padding-inline` formula and border rails. Сетка выдерживает все проверенные ширины; issue — large abrupt height/column change at 1024/1025.

## SEO and Technical Findings

- Local title and description present and meaningful; canonical added locally: `https://barn-estate.ru/kurortnaya/`.
- Local document has no `lang` attribute (`<html lang="...">` missing); source also returns empty lang in DOM audit.
- JSON-LD/schema graph is present in the snapshot; no robots meta or CSP meta was found.
- Local page has 5 stylesheets and 6 external script references, including live Barnes Nuxt runtime and Yandex Maps bundles. The two local snapshot files are approximately 794 KB and 764 KB before network assets.
- The local browser run produced repeated CORS errors for `https://barn-estate.ru/_nuxt/*.js` from origin `http://127.0.0.1:4173`. Static DOM remains visible, but source-driven interaction/runtime cannot be considered reliable in local or offline use.
- `kurortnaya/kurortnaya.css` and `kurortnaya/kurortnaya.js` are tracked but not referenced by the current snapshot index. They are legacy/orphaned implementation files and can mislead future edits unless their status is documented or they are removed in a separate approved cleanup task.

## Design System Reconstruction

### Tokens

```text
font.family.body       = "Tilda Sans", "Tilda Sans Fallback", system-ui, sans-serif
color.text             = #1e1e1e
color.text-secondary   = #262626
color.brand            = #8b1d25
color.brand-hover      = #801b22
color.surface          = #ffffff
color.surface-soft     = #f7f7f7
color.surface-muted    = #f1f1f1
color.footer           = #262626
color.border           = rgba(30,30,30,.08/.12/.20)
space                  = 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 56, 60, 68, 70, 75, 80
radius                 = 0, 2, 3, 999px
container.max          = 1920px
container.padding      = calc(8.94118px + 1.96078vw) mobile / calc(-26.66667px + 6.59722vw) desktop
breakpoints            = 540, 640, 768, 1024, 1280, 1440, 1920
```

### Recommended component rules

- Primary button: minimum 48 px touch height on every mobile state; 56 px for form CTA; brand `#8b1d25`, hover `#801b22`, visible focus outline.
- Icon button: visual icon can remain 20–29 px, but interactive wrapper should be at least 44×44 px.
- Card: shared 4/3 media ratio and one consistent action row; favorite button should not be a 20×20 clickable target.
- Form: explicit label or `aria-label` for every field; placeholder remains supplementary text, not the accessible name.
- Section spacing: use named `section-md`, `section-lg`, `section-mobile` tokens instead of one-off 35/43/54/67/94 values.
- Responsive: keep visual state changes at 540/1024 only if intentional; otherwise interpolate type/spacing and move structural switches to 600/768/1024 with a test at ±1 px.

## Master Issue Table

| ID | Status | Viewport | Section | Element | Current | Problem | Recommended | Priority |
|---|---|---|---|---|---|---|---|---|
| UI-001 | PARTIAL | local all | Runtime | external scripts/assets | Nuxt runtime/preload удалены; визуальные ассеты и карта всё ещё зависят от staging/Yandex | clone больше не выдаёт CORS/runtime errors, но остаётся не полностью автономным | локально закрепить необходимые изображения и предусмотреть map fallback | P1 |
| UI-002 | PARTIAL | ≤540, network failure | Mobile loader | `fetch('mobile.html')` + `document.write` с проверкой response и fallback class | архитектурно остаётся подмена всего документа; fallback не сообщает пользователю об ошибке | перейти на один responsive DOM либо добавить видимый fallback state | P1 |
| UI-003 | OPEN | all | Snapshot architecture | `index.html` + `mobile.html` | ~313 KB + ~282 KB duplicated HTML | high maintenance cost, stale desktop/mobile content risk, slower parse | reduce to one source of truth; generate responsive markup at build time | P2 |
| UI-004 | OPEN | 541 | Hero / filters | `@max540` → `@min541` | hero 684→644; H1 32→38; filter 124 stacked→70 inline; catalog/FAQ 1→2 columns | 1 px width cliff; behavior can feel broken on narrow tablets | smooth typography/spacing; move structural switch to tested 600/640 and test 539–641 | P2 |
| UI-005 | OPEN | 1024/1025 | Grid / departments / footer | `@max1024` → desktop | catalog 2→3 columns, departments 1→6, footer 2→4, hero alignment changes | simultaneous multi-section layout jump and card width change | introduce intermediate tablet-wide layout or stagger changes; verify 1023/1024/1025 | P2 |
| UI-006 | OPEN | mobile | Forms | consultation/contact inputs | no explicit label/aria-label for text fields; placeholder is primary hint | screen-reader name and persistent field context are incomplete | add visible labels or `aria-label`/`aria-describedby`; connect errors to fields | P2 |
| UI-007 | OPEN | mobile | Interactive controls | header, phone, sticky nav, floating close | visual/clickable sizes include 22×22, 29×29, 30×30 and 23 px link heights | below recommended 44×44 target; difficult touch interaction | keep visual icon, enlarge button/link hit area to ≥44×44 | P2 |
| UI-008 | OPEN | all | Images | 58 images | 15 missing alt, 3 empty alt | content/decorative intent not explicit | add meaningful alt to content images; use explicit empty alt only for decorative images | P3 |
| UI-009 | PARTIAL | all | Document metadata | `<html>` | `lang="ru"` добавлен; CSP не задан | language detection исправлен, baseline hardening остаётся неполным | configure CSP at server level where compatible | P3 |
| UI-010 | OPEN | all | Maintainability | legacy `kurortnaya.css/js` | tracked but not linked by current snapshot | future changes may be made in dead files | document generated snapshot ownership; remove or archive in separate cleanup | P3 |
| UI-011 | OPEN | 1280/1281 | Header/footer | nav/footer column rules | footer 4→8 columns; header state changes at nearby range | density shift is abrupt on medium desktop | define a named compact-desktop state and test 1200–1366 | P3 |
| UI-012 | OPEN | all | Color system | alpha variants | several near-duplicate text/white alpha colors | token drift and inconsistent future components | normalize semantic muted/on-dark tokens | P3 |
| UI-013 | OPEN | all | Link states | visited | no dedicated visited style | browser state can be indistinguishable after navigation | define visited policy, or document intentional inherited behavior | P4 |
| UI-014 | INTENTIONAL | all | Splide | clone slides outside viewport | DOM detector finds offscreen clones | internal slider implementation, not page overflow | keep `overflow:hidden`; exclude clones from generic overflow lint | P4 |

## Actionable Checklist

### First implementation pass

- [ ] `UI-001`: remove or locally pin runtime dependencies that are not required for the static visual clone; ensure map degradation is explicit.
- [ ] `UI-002`: replace silent `document.write` mobile swap with one responsive source or a checked fallback path.
- [ ] `UI-006`: add accessible names to all consultation/contact/hero fields and wire validation messages.
- [ ] `UI-007`: make header menu, phone, slider/map close controls and sticky-nav items at least 44×44 px without changing icon visual size.
- [ ] `UI-008`/`UI-009`: add alt policy and `lang="ru"`; validate after changing markup.

### Responsive pass

- [ ] Re-run screenshots at 539, 540, 541, 639, 640, 641, 1023, 1024, 1025, 1279, 1280 and 1281 px.
- [ ] Decide whether `540/541` is an intentional product breakpoint. If not, interpolate H1/filter/section spacing and defer grid switch to a wider tested threshold.
- [ ] Add an intermediate departments/footer state around 1024–1100 px so 1→6 cards does not happen at a single pixel.
- [ ] Keep root overflow assertion in CI; ignore only known Splide clone descendants inside clipped tracks.

### Snapshot / repository hygiene

- [ ] Mark `index.html`/`mobile.html` as generated or replace them with one source-of-truth implementation.
- [ ] In a separate approved cleanup task, decide the fate of unused `kurortnaya.css` and `kurortnaya.js`; they were not changed or deleted by this audit.
- [ ] Add a small audit smoke test that verifies title, canonical, `lang`, zero root overflow, form accessible names and no failed external runtime requests.

## Audit History

### 2026-10-08 — перенос reference UI Kit

- Быстрые фильтры каталога, сортировка и hero-search приведены к FormControl-контракту: высота `58px`, радиус `14px`, граница `#E4E4E4`, label `14/15px` weight `400`, value `13px` weight `400`; CTA остаётся отдельным ActionButton `58/70px`.
- Страница проверена по [`../reference-ui.md`](../reference-ui.md); карточки проектов и предложений намеренно исключены из переноса, так как их контракта в UI Kit пока нет.
- Добавлен локальный слой `ui-kit.css`: H2 Standard/Compact/Editorial, eyebrow, lead, прямоугольные CTA, focus-visible, reduced-motion и footer приведены к утверждённым токенам.
- `ui-kit-runtime.js` подключает слой после snapshot-стилей и добавляет доступные имена полям обеих форм; визуальные placeholder сохранены.
- Подтверждены размеры CTA: `58px / 18px` на mobile, `70px / 17px` на desktop и `70px / 19px` на wide; footer mobile — `14px` для заголовков и `13px` для ссылок.
- Проверены 390, 541, 768, 1024, 1280, 1440 и 1920 px: UI Kit загружается, корневого overflow нет, console errors/exceptions отсутствуют. Количество карточек осталось 5 mobile / 12 desktop.

### 2026-10-07

- Повторно сняты desktop/mobile DOM и full-page screenshots с `https://front.barnes.vsavr.ru/kurortnaya/`.
- Перенесены обновлённые фильтры каталога «Тип недвижимости», «Цена ₽», «Общая площадь», актуальный счётчик избранного, карточки, карта и свежие стили.
- Добавлен изолированный `kurortnaya/source.css`; главная и другие страницы репозитория не изменялись.
- Удалён внешний Nuxt bootstrap и preload build metadata, вызывавшие CORS-ошибки в локальном origin; на контрольных ширинах 390, 541, 1024 и 1440 px console errors/exceptions отсутствуют.
- Проверены ширины 320–1920 px: корневого горизонтального overflow нет; mobile содержит 5 карточек, desktop — 12, как на актуальном staging.

### 2026-10-05

- Initial full UI/design/technical audit.
- Checked 41 local viewport widths from 320 to 1920 px, project breakpoints ±1 px, and seven viewport heights.
- Checked live source at eight control widths.
- Found 14 tracked findings: 2 P1, 5 P2, 5 P3, 1 open P4 and 1 intentional P4; the intentional slider finding is excluded from remediation count.
- No production CSS/JS/HTML was changed during the audit.
