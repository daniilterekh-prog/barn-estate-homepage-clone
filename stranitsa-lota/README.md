# Общий шаблон лота BARNES

[Открыть последнюю опубликованную версию в GitHub Pages](https://daniilterekh-prog.github.io/barn-estate-homepage-clone/stranitsa-lota/?v=b01bcd4). Публичный экспорт исходника `b80dd67` — commit `369625429bfdb7185911aee9b8c303ca8d9983b8`, защита CSS/JS от старого кэша — `b01bcd4c495e59ea1f80aa2dd83e894e074097e9` в `barn-estate-homepage-clone`. [Проверка опубликованной страницы](https://github.com/daniilterekh-prog/barnes-sites/blob/main/stranitsa-lota/verification/pages.json). Это превью, не установка на рабочий домен агентства.

## Текущее оформление · 01.11.2026

Шаблон переведён на **утверждённый UI-кит главной v1.0.0**. Готовые хедер (светлое состояние внутренней страницы), рассылка и футер импортированы из `barn-estate-home-reference-v1.0.0`, без общего квиза. Их HTML/CSS и только используемые ассеты находятся в `kit/`; происхождение и SHA — `kit/provenance.json`. SVG звонка — Material Icons, Apache-2.0, лицензия сохранена рядом с ассетами. Новые библиотеки не устанавливались.

`home-kit.css` — единые роли типографики, сетки и кнопок; `home-kit.js` — контакты хедера и доступные подписи форм. Сохранены H1 объекта, цена, галерея, характеристики, условные секции, брокер и обращение по конкретному лоту. Страница не превращена в главную или лендинг ЖК. Формы по-прежнему локальные, CRM не подключена.

[Новые проверки и снимки](https://github.com/daniilterekh-prog/barnes-sites/blob/main/stranitsa-lota/verification/home-kit.json) · [390 px](https://github.com/daniilterekh-prog/barnes-sites/blob/main/stranitsa-lota/verification/page-390.png) · [1440 px](https://github.com/daniilterekh-prog/barnes-sites/blob/main/stranitsa-lota/verification/page-1440.png) · [2560 px](https://github.com/daniilterekh-prog/barnes-sites/blob/main/stranitsa-lota/verification/page-2560.png) · [план переноса](https://github.com/daniilterekh-prog/barnes-sites/blob/main/stranitsa-lota/IMPLEMENTATION.md).

Проверка кита: сервер на4194 и `PLAYWRIGHT_MODULE=/путь/к/playwright node main-site/pages/lot/verify-home-kit.cjs` из корня. Проверяет12 ширин320–3840 px, фактические токены, новые общие блоки, подписи/контекст формы, валидацию, меню, мобильные контакты, галерею, материалы, футер и Escape.

Исторические `preview-desktop.png`, `preview-mobile.png` и сравнение конкурентов ниже относятся к структуре до визуального переноса; для актуального вида использовать снимки из `verification/`.

Рабочая страница: `/stranitsa-lota/`. Один тип страницы для всех лотов, без папок по ID. Главная и страница ЖК независимы. На живой домен эта версия не установлена.

Фото, цена и брокер → описание и характеристики → планировка при наличии → расположение → компактная справка о доме при подтверждённой связи → реальные похожие предложения при наличии → контакт.

[Анализ конкурентов и решение](https://github.com/daniilterekh-prog/barnes-sites/blob/main/stranitsa-lota/STRUCTURE-ANALYSIS.md) · [Проверка новой структуры](https://github.com/daniilterekh-prog/barnes-sites/blob/main/stranitsa-lota/structure-verification.json).

Проверенные снимки новой версии: [1440 px](https://github.com/daniilterekh-prog/barnes-sites/blob/main/stranitsa-lota/preview-desktop.png), [390 px](https://github.com/daniilterekh-prog/barnes-sites/blob/main/stranitsa-lota/preview-mobile.png).

## Данные

Поставщик задаёт `window.BARNES_LOT_DATA` **до** загрузки `lot-data.js`. Выбор объекта — до инициализации; горячее переключение без перезагрузки не поддерживается. `lot-data.js` содержит демонстрационный объект 588036, сохранённый 12.10.2026, а не актуальную базу цен/наличия.

- Обязательны `id`, `title`, `cover.src`.
- `descriptionParagraphs` — абзацы; `facts` — массив `{label, value}`; пустые значения скрыты.
- `floorPlan: {src, alt}` — действительная планировка этого объекта. Нет файла — небольшой запрос материалов, без фиктивного изображения.
- `building: {verified: true, name, description, url}` — одна справка. Без явного `verified: true` скрыта. Не определять принадлежность по фото/категории.
- `related: [{title, url, cover?: {src, alt}, displayPrice?}]` — реальные отобранные лоты. Без массива — только кнопка подбора у брокера.
- `broker`, `gallery`, `map` необязательны. Карта — локальный снимок; для другого объекта нужны его собственные данные. Без карты скрываются блок и вкладка.
- Старые `complex.cards`, `developer`, `construction`, тестовые кредитные ставки исключены из страницы. Для вторички и аренды нет фиктивного ипотечного платежа.

`lot-template.js` заполняет исходные компоненты и диалоги; `lot-sections.js` строит новую структуру; `lot-sections.css` сохраняет шрифт и палитру BARNES. `local.js` — галерея, карта, меню, диалоги, локальная валидация. CRM не подключена: формы предлагают телефон и не сообщают об успешной отправке.

## Происхождение и проверки

Исходный HTML, TildaSans, изображения и стили: [BARNES 588036](https://front.barnes.vsavr.ru/vtorichnaya-nedvizhimost/588036/), снимок [barn-estate-homepage-clone, e279089](https://github.com/daniilterekh-prog/barn-estate-homepage-clone/tree/e2790893cfd2110da9b654f2d0c0d8e5d93591dc/stranitsa-lota). Хеши ассетов — `source-assets.json`; каноническая библиотека — [barnes-assets](https://github.com/daniilterekh-prog/barnes-assets). Новых UI-пакетов нет: собственные статические HTML/CSS/JS и существующие компоненты.

`verification.json`, `interaction-verification.json`, `data-binding-verification.json`, `PLAN.md` — исторические проверки/план копии **до** изменения структуры, не доказательство соответствия текущей страницы оригиналу пиксель в пиксель.

Превью из корня: `python3 tools/preview.py --port 4192`, открыть `http://127.0.0.1:4192/stranitsa-lota/`.

Проверка: `PLAYWRIGHT_MODULE=/путь/к/playwright node main-site/pages/lot/verify.cjs`. Использует уже установленный Playwright и Chrome; ничего не устанавливает. Семь ширин 320–1920 px, overflow, изображения, якоря, три диалога, Escape и три варианта данных. Снимки — `/tmp`, отчёт — рядом. Тестовая картинка планировки проверяет только условный рендер, не попадает в демонстрационное наполнение.
