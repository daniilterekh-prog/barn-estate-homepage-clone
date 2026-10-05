# Design Audit

## Page

- Эталон: [https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost](https://front.barnes.vsavr.ru/mezhdunarodnaya-nedvizhimost)
- Локальная копия: `/home/daniil/Documents/ChatGPT/САЙТ/international.html`
- Папка страницы: `/mezhdunarodnaya-nedvizhimost/`
- Дата аудита: 2026-10-05
- Статус: initial full UI/design/technical audit; production HTML/CSS/JS/assets в рамках аудита не изменялись.

> В приложенном брифе URL оставлен как `[ВСТАВИТЬ URL]`. В качестве эталона использован URL из исходной задачи. Хост `front.barnes.vsavr.ru` выглядит как front/staging-среда; SEO-выводы, относящиеся к индексации и security headers, нужно финально подтвердить на production-хосте.

## Audit Scope

Проверены структура страницы сверху вниз, DOM и computed styles, CSS media queries, контейнеры, grid/flex, типографика, цвета, spacing, кнопки и состояния, ссылки, карточки, изображения, формы, header, sticky-навигация, hero, footer, мобильное поведение, viewport height, touch targets, SEO-метаданные, JSON-LD, внешние зависимости, console/network behavior и горизонтальное переполнение.

Инструменты: Chrome headless через CDP, in-app browser, локальный HTTP server, DOM/CSS inspection, контрольные скриншоты `390×844` и `1440×900`. Проверены локальная копия и live reference на точных ширинах `320, 360, 375, 390, 414, 430, 480, 576, 600, 640, 720, 768, 800, 834, 900, 960, 1024, 1100, 1152, 1200, 1280, 1366, 1440, 1536, 1600, 1728, 1920, 2048, 2560`, а также точки около основных breakpoint-границ.

## Executive Summary

Визуальная композиция страницы собрана последовательно: hero, поиск, рекомендации, карта, каталог, editorial-блоки, формы, направления, новости, FAQ, контакты и footer присутствуют. На всех 29 проверенных ширинах корневого горизонтального overflow не обнаружено: `document.documentElement.scrollWidth === clientWidth`.

Основные риски:

1. На границах `540/541`, `1024/1025`, `1280/1281` и `1440/1441` одновременно меняются несколько систем — типографика, высота hero, количество колонок, footer и форма поиска. Это создаёт резкие layout cliffs.
2. У 10 полей live-страницы нет явного `label`/`aria-label`; placeholder используется как основной hint. Для screen reader и ошибок валидации этого недостаточно.
3. У двух Yandex map icon-only controls нет доступного имени; skip-link отсутствует.
4. Live DOM не содержит `lang`, canonical и hreflang. На staging/front-хосте `sitemap.xml` и `sitemap_index.xml` возвращают `404`; production нужно проверить отдельно.
5. Локальный clone имеет относительный canonical `international.html` и жёстко заданную геометрию remote map iframe. Если копия будет опубликована, её нельзя оставлять индексируемой как самостоятельную SEO-страницу без осознанного canonical/noindex решения.
6. На mobile горизонтальные элементы каруселей выходят за видимую область своих track-контейнеров. Корневой overflow не возникает, но touch-scroll и клавиатурный доступ к этим элементам нужно проверять отдельно.

## Page Structure

| № | Секция | Тип | Основные элементы | Контейнер / сетка | Фон |
|---:|---|---|---|---|---|
| 1 | Global header | overlay / absolute | logo, menu, search, favorites, phone | `.site-header__inner.base-container` | image + overlay |
| 2 | Catalog sticky nav | fixed, initially hidden | anchor links, request, phone | `.catalog-page-nav__inner.base-container` | `#fff` |
| 3 | Hero `#catalog-hero` | image + overlay | breadcrumbs, H1, search/filter form, quick links | filter bar max-width ≈982 px | image + dark gradient |
| 4 | Best offers | slider | recommendations, arrows, cards | 1–3 visible cards | `#fff` |
| 5 | Map `#catalog-map` | map block | title, description, Yandex map, search, fullscreen | map max-width ≈1720 px | `#fff` |
| 6 | Catalog grid | product grid | title, sort, property cards, actions | 3 / 2 / 1 columns | `#fff` |
| 7 | Intro | editorial block | H2, lead, expandable text, image | 2 columns desktop, 1 ≤1024 | `#fff` |
| 8 | Consultation | image CTA + form | expert, methods, name/phone/comment/consent | form grid, gap 6 px | image / dark mobile |
| 9 | Departments | image card grid | countries/directions, arrows | 6 columns desktop, 1 ≤1024 | `#fff` |
| 10 | News | slider/cards | article cards, pagination, arrows | 3 desktop / horizontal mobile | `#fff` |
| 11 | FAQ | accordion | questions and answers | 2 columns ≥541, 1 ≤540 | `#fff` |
| 12 | Contact | image CTA + form | expert card, methods, form | 2 columns desktop, 1 ≤1024 | `#262626` |
| 13 | Footer | navigation + contacts | logo, 8/4/2 nav columns, contacts, socials | `.site-footer__inner.base-container` | `#262626` |
| 14 | Floating / teleports | fixed / modal infrastructure | floating expert, close, modal mount points | fixed right/bottom | white / transparent |

## Breakpoints

### Основные page-level states

| Диапазон | Фактическое поведение |
|---|---|
| `≤540` | mobile: hero 684 px, search/filter stacked, 1 catalog column, 1 FAQ column, 2-column footer |
| `541–1024` | hybrid/tablet: hero 644 px, inline filter 70 px, 2 catalog columns, 2 FAQ columns, 2-column footer |
| `1025–1280` | compact desktop: 3 catalog columns, 4-column footer, desktop filter |
| `1281–1440` | desktop: footer expands to 8 columns, catalog remains 3 columns |
| `1441–1920` | wide desktop: hero becomes 694 px, section vertical padding increases to 75 px |
| `>1920` | base content is capped by a 1920 px max-width; outer viewport receives centered whitespace |

В CSS также встречаются вспомогательные пороги `290, 540, 560, 610, 640, 768, 948, 982, 1024, 1025, 1280, 1440, 1920, 1921`. Для дальнейших страниц нужно считать контрактными именно named states, а не копировать все числовые media queries вручную.

### Точки до / на / после breakpoint

Проверены пары `539/540/541`, `639/640/641`, `767/768/769`, `1023/1024/1025`, `1279/1280/1281`, `1439/1440/1441`, `1919/1920/1921`. Самые заметные cliffs — `540/541`, `1024/1025` и `1280/1281`.

## Responsive Matrix

В таблице `client` — фактическая ширина layout viewport после классического scrollbar, `grid` — число колонок каталога, `body` — измеренная высота локальной копии. Все значения в px.

| Viewport | client | Hero | Grid | Local body | Live body | Наблюдение |
|---:|---:|---:|---:|---:|---:|---|
| 320 | 305 | 684 | 1 | 16552 | 12830 | mobile, H1 в 2 строки |
| 360 | 345 | 684 | 1 | 16770 | 12876 | mobile, карточки в одну колонку |
| 375 | 360 | 684 | 1 | 16857 | 12899 | H1 уже в 1 строку |
| 390 | 375 | 684 | 1 | 16903 | 12848 | длинные H2 в 2 строки |
| 414 | 399 | 684 | 1 | 17015 | 12877 | catalog H2 становится однострочным |
| 430 | 415 | 684 | 1 | 17147 | 12941 | mobile state |
| 480 | 465 | 684 | 1 | 17494 | 13073 | mobile state, длинная страница |
| 576 | 561 | 644 | 2 | 15342 | 13165 | 2 columns, inline filter |
| 600 | 585 | 644 | 2 | 15316 | 13132 | tablet state |
| 640 | 625 | 644 | 2 | 15178 | 12979 | tablet state |
| 720 | 705 | 644 | 2 | 15403 | 13180 | tablet state |
| 768 | 753 | 644 | 2 | 15473 | 15044 | live data/layout state changes |
| 800 | 785 | 644 | 2 | 15516 | 15057 | tablet state |
| 834 | 819 | 644 | 2 | 15547 | 15127 | tablet state |
| 900 | 885 | 644 | 2 | 15636 | 15265 | tablet state |
| 960 | 945 | 644 | 2 | 15708 | 15363 | tablet state |
| 1024 | 1009 | 644 | 2 | 15784 | 15472 | последний 2-column state |
| 1100 | 1085 | 644 | 3 | 11899 | 11457 | 3 columns; резкое уменьшение высоты |
| 1152 | 1137 | 644 | 3 | 11868 | 11410 | compact desktop |
| 1200 | 1185 | 644 | 3 | 11843 | 11397 | compact desktop |
| 1280 | 1265 | 644 | 3 | 11918 | 11493 | footer 4 columns |
| 1366 | 1351 | 644 | 3 | 11654 | 11297 | footer 8 columns |
| 1440 | 1425 | 644 | 3 | 11723 | 11385 | last 644 px hero state |
| 1536 | 1521 | 694 | 3 | 12214 | 12110 | wide hero state |
| 1600 | 1585 | 694 | 3 | 12269 | 12182 | wide desktop |
| 1728 | 1713 | 694 | 3 | 12409 | 12356 | wide desktop |
| 1920 | 1905 | 694 | 3 | 12606 | 12603 | max-width nearing cap |
| 2048 | 2033 | 694 | 3 | 12665 | 12666 | inner grid capped at 1920 |
| 2560 | 2545 | 694 | 3 | 12665 | 12666 | centered 1920 px content |

### Viewport height

Контрольные высоты включали `390×844`, `375×667`, `430×932`, `1366×768`, `1440×900`, `1920×1080`, `2560×1440`. Hero и основные CTA не клиппируются. Полноэкранный map uses `100vh`; в CSS не найдены `svh`, `dvh` и `safe-area-inset-*`. На mobile Safari это может давать скачки высоты при появлении адресной строки.

### Horizontal overflow

На всех 29 локальных и live контрольных ширинах root overflow отсутствует. При детальном DOM-сканировании дочерние элементы offer/news carousel намеренно выходят за границы viewport: например, на 320 px news card right достигает примерно 1595 px, но родитель использует `overflow-x:auto/hidden`. Это не page-level overflow. Нужно отдельно проверить touch-scroll, keyboard reachability, snap behavior и отсутствие невидимых focus targets.

## Typography

Основной стек: `"Tilda Sans", "Tilda Sans Fallback", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`.

| Type / component | Size | Weight | Line-height | Letter-spacing | Color |
|---|---:|---:|---:|---:|---|
| Hero H1 wide | 58 px | 300 | ≈60.9 px | ≈−2.61 px | `#fff` |
| Hero H1 mobile | 32 px | 300 | ≈33.6 px | ≈−0.045em | `#fff` |
| Section H2 desktop | 44–58 px | 300 | 1.0–1.2 | normal / negative | `#1e1e1e` |
| Section H2 mobile | 22–32 px | 300 | 1.05–1.2 | normal | `#1e1e1e` |
| Card heading | 20–22 px | 300 | ≈1.15 | normal | `#fff` |
| Body / controls | 15–16 px | 300–500 | 1.3–1.5 | normal | `#1e1e1e` |
| Input / filter | 15–16 px | 300–500 | ≈1.3 | normal | context-dependent |

На `540/541` H1 скачком меняется с 32 на 38 px, hero — с 684 на 644 px, а filter — со stacked 124 px на inline 70 px. На 390 px H1 уже однострочный; длинные H2 остаются внутри колонки и не клиппируются. Кнопки в проверенных состояниях не переносят текст.

## Colors

| Role | Значение | Использование |
|---|---|---|
| Primary text | `#1e1e1e` | body, headings, controls |
| Secondary / dark surface | `#262626` | footer, contact, dark CTA |
| Brand burgundy | `#8b1d25` | primary CTA, active states |
| Brand hover | `#801b22` | hover primary CTA |
| White | `#fff` | surfaces and dark-surface text |
| Soft surface | `#f7f7f7` | control hover / muted surface |
| Image placeholder | `#f1f1f1` | map/image fallback |
| Muted control | `#656462` | slider arrows and borders |
| Border | `rgba(30,30,30,.08/.12/.20)` | inputs, cards, dividers |
| Warm accent | `#e7c88f` | selected desktop link hover |
| Hero/card overlays | `#00000014`…`#0000006b` | readability over imagery |

Color direction is coherent. The maintainability issue is token drift: several near-duplicate alpha values such as `#1e1e1e80`, `#1e1e1e99`, `#1e1e1eb3`, `#fffc`, `#ffffff8c`, `#ffffffb3` perform similar roles and should become semantic tokens.

## Spacing

| Section | Wide desktop | 1440 / laptop | Mobile |
|---|---:|---:|---:|
| Hero | 694 | 644 | 684 |
| Best offers padding | 75 | 60 | 35 |
| Map padding | 75 | 60 | 40 |
| Catalog grid padding | 75 | 60 | 40 |
| Intro | `80 / 54` | `70 / 42` | `42 / 32` |
| Consultation | 60 | 48 | 32 |
| FAQ | `75 / 94` | `60 / 120` | `40 / 43` |
| News | 75 | 60 | 35 |
| Footer | `56 / 50` | `40 / 28` | `32 / 28` |

Повторяющаяся scale: `4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32, 40, 48, 56, 60, 68, 70, 75, 80, 94`. Значения 35/43/54/67/94 остаются section-specific и должны быть явно названы в design tokens, иначе новые страницы будут расходиться по ритму.

## Containers

Основная система: `.base-container { width:100%; max-width:1920px; margin:0 auto; }`. На live в широком viewport `2316` inner max-width равен `1920`, а catalog list получает около `100 px` внутреннего rail с каждой стороны и ширину около `1720 px`.

| Viewport | Layout client | Ориентировочный horizontal padding | Content / list |
|---:|---:|---:|---:|
| 320 | 305 | ≈15 | ≈275 |
| 390 | 375 | ≈16 | ≈342 |
| 768 | 753 | ≈23.5 | ≈708 |
| 1024 | 1009 | ≈39.9 | ≈929 |
| 1280 | 1265 | ≈56.8 | ≈1151 |
| 1440 | 1425 | ≈67.3 | ≈1290 |
| 1920 | 1905 | ≈99 | ≈1707 |
| 2048+ | 2033+ | max rail ≈100 | inner max 1920 |

Основные секции совпадают по направляющим. Исключения — mobile hero, departments, contact/consultation media и fixed map, где используются отдельные padding/offset formulas. Эти исключения нужно закрепить как component tokens.

## Grid

| Component | Desktop | Tablet | Mobile |
|---|---|---|---|
| Catalog cards | `repeat(3,minmax(0,1fr))`, gap 24 | `repeat(2,minmax(0,1fr))`, gap 24 | `1fr`, gap 24 |
| Departments | 6 columns, compact gaps | 1 column | 1 column |
| FAQ | 2 columns, gap ≈48–80 | 2 columns | 1 column |
| Intro | 2 columns, gap up to 80 | 1 column | 1 column |
| Footer nav | 8 columns `>1280` | 4 columns `1025–1280` | 2 columns `≤1024` |
| Best offers | variable 2–3 slides | variable 2–3 slides | one full-width slide |
| News | multi-card slider | multi-card slider | horizontal single-card track |

Catalog width grows from one card ≈275 px at 320 to three cards ≈316 px at 1100 and ≈557 px per card in the current 2316 px live viewport. The 1024→1025 transition is structurally large and should be a named responsive state, not an incidental media-query side effect.

## Buttons

Live inspection found 72 buttons. Key computed sizes:

| Type | Selector / example | Size / state |
|---|---|---|
| Header menu | `.site-header__icon-btn` | ≈33×33 visual button; aria-label changes Open/Close |
| Hero filter toggle | `.catalog-hero-filters__toggle` | 64×70, `aria-label="Открыть фильтры"` |
| Hero submit | `.catalog-hero-filters__submit` | ≈181×70, burgundy `#8b1d25` |
| Slider arrows | best offers | ≈68×68 circular desktop |
| Map fullscreen | map control | ≈171×53, border and radius 3 px |
| Quick filter | `.catalog-quick-filter__button` | ≈338×46 in current wide live viewport |
| Card favorite | `.apartment-card__favorite` | 40×40 circular |
| Card call | `.apartment-card__call-btn` | ≈245×54 |
| Card detail | primary link/button | ≈245×54, burgundy |

Hover, focus-visible, active/selected, disabled and loading classes exist in CSS. Global focus outline is present. Open issue: two Yandex map icon-only buttons have no useful accessible name, and not every visible icon is proven to have a 44×44 interactive wrapper.

## Links

Live DOM: 148 links, no empty `href`. Local and live use burgundy / warm accent hover conventions; footer and sticky nav use small single-line labels. Sticky catalog nav is horizontally scrollable and appears only after scroll; it has `aria-label="Навигация по странице"`.

Required verification: keep keyboard focus visible while nav is horizontally scrolled; ensure offscreen links are reachable without trapping focus; define whether inherited visited state is intentional. The clone must not leave links pointing to the live site when the page is deployed as a separate repository page unless that is an explicit integration decision.

## Cards

- Catalog cards use image-first composition, `object-fit: cover`, roughly 4:3 media, text/action block below and favorite/call/detail controls.
- Offers are slider cards with variable active/inactive widths and cloned slides.
- Department cards are image tiles with country/direction labels.
- News cards are image + title/editorial cards; mobile uses one visible card with horizontal scrolling.
- Local clone currently has 12 catalog card items. Live data is dynamic: the current desktop snapshot showed 12 items, while a 320 px live emulation exposed only 5 rendered catalog items at that moment. This is a data/render-state issue, not a stable CSS invariant; visual regression must pin the fixture/page-size before comparing heights.

## Forms

Live page contains hero search plus consultation/contact lead forms; current inspection found 13 inputs/textareas/form controls in the page. Text controls include search by ID/name/address, map visible-area search, name, phone and comment fields.

Findings:

- 10 text inputs/textareas have no explicit associated `<label>` and no reliable `aria-label` in the DOM audit.
- Placeholder text is doing double duty as both visual hint and accessible name; it disappears on input and is insufficient for persistent context.
- Focus styles exist, but error messages and field-to-error relationships need explicit verification.
- Real submission was not performed to avoid sending lead data. Validation states should be tested with a safe mocked endpoint.

Recommended field contract: visible label or `aria-labelledby`, stable `id`, `autocomplete`, `aria-describedby` for hint/error, `aria-invalid` only in error state, and a focus return rule after modal/submit failure.

## Images

Live page has 51 image elements. Three images have empty/missing alt candidates in the current DOM: one image URL ending in `be19a…png`, the consultation background and the contacts background. These may be decorative, so the correct action is to classify them: meaningful content gets descriptive alt; purely decorative images get explicit `alt=""` and are excluded from the accessibility tree.

The hero and cards preserve image cropping well at the two visual checkpoints. The page relies on large remote imagery; loading, broken-image fallback, `width/height` or aspect-ratio reservation, and lazy-loading behavior should be validated on slow network.

## Header

Header is an overlay over hero imagery. At the current wide live viewport:

- `.site-header` ≈110.9 px high, top padding 32 px;
- logo ≈231×48 px;
- mobile menu opens with class `site-header--menu-open`, changes button label to `Закрыть меню`, locks body overflow and exposes a menu/dialog layer;
- close interaction works in the tested live state;
- sticky catalog nav starts translated/hidden (`y≈−100 px`) and becomes visible after scroll with `catalog-page-nav--visible`.

The header/menu state is functionally sound in the smoke test. Verify focus management, Escape close, focus return to the menu button and screen-reader announcement; these were not fully automated in this audit.

## Footer

Footer uses `#262626`. At `≤1024` navigation has 2 columns; `1025–1280` has 4 columns; above `1280` it expands to 8 columns. At `1281 px` the 8-column state produces very narrow footer columns (roughly 126 px in the live boundary test), which is visually dense and should be reviewed against content-language expansion.

Footer contacts, phone, email, socials and callback are present. Check that small text links retain adequate hit areas even when their glyph height is around 12–16 px on mobile.

## SEO and Technical Findings

### Live reference

- Title: `Элитная зарубежная недвижимость в BARNES Moscow`.
- Meta description is present and meaningful: `В продаже более 5 000 объектов премиальной зарубежной недвижимости...`.
- Open Graph title and description are present.
- One JSON-LD graph is present with `WebSite`, `WebPage`, `Organization`, `LocalBusiness`, `RealEstateAgent`, `FAQPage`, `CollectionPage`, `BreadcrumbList` and `ImageObject` types.
- `lang` is missing/empty in the rendered `<html>`.
- Canonical and hreflang were not found in the rendered live DOM.
- `link rel="next"` exists and points to `...?page=2`.
- `robots.txt` responds 200 with `User-Agent: *` and empty `Disallow`.
- `sitemap.xml` and `sitemap_index.xml` return 404 on the audited front host; confirm the production host before assigning release-blocking severity.
- Live curl returned HTTP 200; measured TTFB ≈0.384 s and total ≈0.596 s in the audit environment.
- Response exposed `Server: nginx/1.28.0` and `x-powered-by: Nuxt`; cache policy and HSTS were not visible in the inspected headers. Treat as environment hardening follow-up, not a UI defect.

### Local clone

- Title, description, Open Graph title/description and JSON-LD are present.
- Local canonical is relative: `href="international.html"`. This is not a safe deployed canonical for `/mezhdunarodnaya-nedvizhimost/`; use the final absolute public URL or `noindex` the clone if it is only an internal implementation snapshot.
- Local `rel="next"` points at `https://barn-estate.ru/mezhdunarodnaya-nedvizhimost?page=2`; verify that this is the intended public host.
- The local HTML contains the large source inline stylesheet plus `international.css`; the source is a snapshot, not a clean source-of-truth component tree.

## Responsive Issues

1. `540/541`: hero 684→644, H1 32→38, filter 124 stacked→70 inline, catalog 1→2 columns and FAQ 1→2 columns in one pixel.
2. `1024/1025`: catalog 2→3 columns and footer 2→4 columns; content density changes in the same pixel.
3. `1280/1281`: footer 4→8 columns; text columns become unusually narrow.
4. `1440/1441`: hero jumps 644→694 px, likely intentional but visually abrupt.
5. `1920/1921`: container reaches a 1920 px cap and centers; this is coherent but should remain documented for new pages.
6. Mobile carousels use `overflow-x:auto/hidden`; root overflow is safe, but internal keyboard/touch behavior requires a dedicated interaction test.
7. Fullscreen map uses `100vh`, without `svh/dvh` or safe-area insets.
8. Local clone map styles contain fixed snapshot offsets such as `left:-291.36px`, `top:-1825px`, `width:2316px`, `height:12663px`, then rely on JS repositioning. This is fragile under a different viewport, font load, map response or browser zoom.

## Consistency Issues

1. Responsive behavior is partly fluid (`clamp`) and partly hard-switched at one-pixel boundaries. Documenting named states will prevent accidental drift.
2. Alpha colors and border opacity have several near-duplicates; consolidate into semantic tokens.
3. Section spacing contains many one-off values (`35, 43, 54, 67, 94`) without an explicit token contract.
4. Some icon controls are named and tested, while provider map controls are anonymous; accessibility ownership is inconsistent between page and third-party widgets.
5. Local clone data is not guaranteed to match live dynamic result ordering/count. Pixel regression requires a fixed dataset and URL/query state.
6. Reduced-motion CSS only changes a toast transition; other slider, menu, accordion and page transitions should respect `prefers-reduced-motion: reduce`.

## Master Issue Table

| ID | Status | Viewport | Section / selector | Current | Problem / impact | Recommended fix | Verification | Priority |
|---|---|---|---|---|---|---|---|---|
| UI-001 | OPEN | live host | canonical / `<head>` | no live canonical | duplicate URL signals are uncontrolled | emit one absolute canonical for the public route; confirm staging policy | inspect rendered head and crawler response | P2 |
| UI-002 | OPEN | live host | `<html>` | `lang` empty/missing | screen readers choose language heuristically | set `lang="ru"` or actual document language | axe + DOM assertion | P2 |
| UI-003 | OPEN | live host | hreflang / sitemap | no hreflang; sitemap endpoints 404 on front | international discovery/indexing may be incomplete | add only valid alternates; expose sitemap on production or document exclusion | production crawl + Search Console-equivalent check | P2 |
| UI-004 | OPEN | local clone | `link[rel=canonical]` | `international.html` relative canonical | clone can self-canonicalize to an invalid/development path | absolute production canonical or `noindex` for internal snapshot | inspect final deployed HTML | P2 |
| UI-005 | OPEN | all | consultation/contact/hero inputs | 10 controls without explicit label/name | incomplete accessible names and weak error UX | visible labels or `aria-labelledby`; connect hint/error with `aria-describedby` | keyboard + screen-reader/axe check | P2 |
| UI-006 | OPEN | all | Yandex map controls | 2 icon-only provider buttons unnamed | users cannot identify map actions | provide accessible names if controllable; otherwise verify provider configuration | accessibility tree inspection | P2 |
| UI-007 | OPEN | all | document navigation | no skip link | keyboard users repeat header/navigation | add “К содержимому” link to `main` | first-Tab smoke test | P3 |
| UI-008 | OPEN | ≤540 | carousel tracks | children extend far beyond viewport inside overflow container | touch/keyboard reachability can be confusing even without root overflow | implement explicit carousel semantics, snap, controls and focus visibility | touch + keyboard test at 320/390 | P3 |
| UI-009 | OPEN | 540/541 | hero/filter/catalog/FAQ | several structural switches in one px | layout cliff and unpredictable narrow-tablet composition | smooth type/spacing; move structural switch to named 600/640 state if product allows | screenshots at 539/540/541 | P2 |
| UI-010 | OPEN | 1024/1025 | catalog/footer | grid 2→3 and footer 2→4 in one px | card width and page density change abruptly | introduce tablet-wide intermediate state or stagger transitions | screenshots at 1023/1024/1025 | P2 |
| UI-011 | OPEN | 1280/1281 | footer nav | 4→8 columns | narrow columns and poor text wrapping | cap at 4 until a wider min width, or define footer-specific breakpoint | 1280/1281/1366 visual diff | P3 |
| UI-012 | OPEN | 1440/1441 | hero | height 644→694 | 50 px jump changes first-screen composition | confirm intentional art direction; otherwise interpolate | screenshot pair + product approval | P3 |
| UI-013 | OPEN | mobile | map fullscreen | `height:100vh`, no `dvh/svh` or safe-area | browser chrome can clip map controls | use `min-height:100dvh` with safe-area padding fallback | iOS/Android viewport test | P3 |
| UI-014 | OPEN | all | `prefers-reduced-motion` | only toast transition is reduced | menu/slider/accordion may still animate for motion-sensitive users | wrap nonessential transitions in reduced-motion override | OS setting + interaction smoke test | P3 |
| UI-015 | OPEN | local clone | remote map iframe styles | fixed large offsets plus JS reposition | fragile with font/network/viewport changes | use responsive wrapper and measured map bounds; avoid document-sized iframe | reload at 320/1440/2560 and network throttle | P3 |
| UI-016 | OPEN | data-driven | catalog result list | live count/order differs by viewport state; local has 12 static cards | visual regression heights are not deterministic | pin fixture/query/page-size for audit and use stable empty/loading states | same URL repeated 3 times per width | P3 |
| UI-017 | OPEN | image loading | 3 alt candidates | meaningful/decorative intent unclear | unnecessary screen-reader noise or missing image context | classify every image; descriptive alt for content, `alt=""` for decorative | axe + manual image review | P3 |
| UI-018 | OPEN | all | color/spacing tokens | alpha and one-off values proliferate | future pages drift from this page | create semantic color and section-spacing tokens | token inventory diff | P4 |
| UI-019 | INTENTIONAL | all | clipped slider clones | offscreen children found by generic scan | internal carousel geometry, not root overflow | keep clipping; exclude known tracks from overflow lint | assert root scrollWidth only | P4 |

## Recommended Design System

### Tokens

```text
font.family.body       = "Tilda Sans", "Tilda Sans Fallback", system-ui, sans-serif
color.text             = #1e1e1e
color.text-secondary   = #262626
color.brand            = #8b1d25
color.brand-hover      = #801b22
color.accent-warm      = #e7c88f
color.surface          = #ffffff
color.surface-soft     = #f7f7f7
color.surface-muted    = #f1f1f1
color.surface-dark     = #262626
color.border-subtle    = rgba(30,30,30,.08)
color.border-default   = rgba(30,30,30,.12)
color.border-strong    = rgba(30,30,30,.20)
color.on-dark-muted    = rgba(255,255,255,.55)
container.max          = 1920px
grid.max               = 1720px
grid.gap               = 24px
radius.control         = 3px
radius.pill            = 999px
breakpoints            = 540, 640, 768, 1024, 1280, 1440, 1920
```

### Component rules

- Primary CTA: minimum 48 px touch height on mobile, 56–70 px where it is a form submit; burgundy fill, visible focus ring, disabled/loading state.
- Icon button: visual icon can stay 20–30 px, but interactive wrapper should be at least 44×44 px.
- Form: persistent label, stable id, autocomplete, described hint/error and deterministic focus return.
- Card: shared media ratio, explicit loading/error/empty states, one consistent action row and favorite target ≥44×44 px.
- Carousel: semantic region label, previous/next controls, current position, keyboard reachability and reduced-motion behavior.
- Sections: use named `section-sm`, `section-md`, `section-lg`, not unexplained values like 35/43/54/67/94.
- Responsive: document mobile/tablet/compact-desktop/wide-desktop states and test every state at `−1`, exact, `+1` px.

## Actionable Checklist

### P1/P2 release and accessibility pass

- [ ] `UI-001`/`UI-003`: verify canonical, hreflang, sitemap and robots behavior on the real production host; do not infer production status from front host.
- [ ] `UI-002`: set the correct document language.
- [ ] `UI-004`: decide whether the local clone is deployable; use an absolute canonical or `noindex` it as an internal snapshot.
- [ ] `UI-005`: add accessible names, labels, autocomplete and error relationships to every form control.
- [ ] `UI-006`/`UI-007`: name map controls where possible and add a skip link.

### Responsive pass

- [ ] Capture `539/540/541`, `1023/1024/1025`, `1279/1280/1281`, `1439/1440/1441` at the same fixed data state.
- [ ] Decide whether the 540/541 and 1440/1441 changes are intentional art direction or should interpolate.
- [ ] Add a stable footer state so 8 columns are not introduced at 1281 px.
- [ ] Verify map fullscreen on mobile browsers with dynamic address bars and safe areas.
- [ ] Test carousel touch, keyboard and focus behavior at 320, 390 and 576 px.

### Snapshot / repository hygiene

- [ ] Pin a catalog fixture/query/page-size for pixel regression; record the data timestamp with every screenshot set.
- [ ] Keep the local clone separate from the main page implementation; do not merge its static snapshot data or CSS overrides into unrelated pages.
- [ ] Preserve the current audit as the single current file for this page: `/mezhdunarodnaya-nedvizhimost/audit/design-audit.md`.
- [ ] Re-run audit after any visual changes and update the Master Issue Table rather than creating parallel audit files.

## Audit History

### 2026-10-05

- Initial full UI/design/technical audit of the international real-estate page.
- Checked local and live reference at 29 exact widths from 320 to 2560 px, plus breakpoint boundary pairs and viewport-height checkpoints.
- Checked DOM structure, styles, SEO metadata, JSON-LD, forms, button names, menu open/close, sticky nav and FAQ expansion.
- Captured visual checkpoints at `390×844` and `1440×900`.
- Found 18 open findings and 1 intentional implementation finding: 0 P1, 8 P2, 9 P3, 1 P4 open; the intentional clipped-carousel finding is excluded from remediation count.
- No production HTML/CSS/JS/assets were changed during the audit.
