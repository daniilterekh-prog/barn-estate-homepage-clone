# partners

Точка входа: `index.html`.

HTML, собственные CSS, JS и локальные ассеты лежат в этой папке. Общие зависимости — в `../../shared/`; встроенные стили и авторские исполняемые скрипты вынесены в `*.inline-*.css` / `*.inline-*.js`. Начальная конфигурация Nuxt и JSON остались в HTML для порядка инициализации. Варианты `standalone`, `latest`, `mobile` сохранены рядом.

Происхождение и SHA исходного репозитория: `../../../docs/migration.json`. Это сохранённая статическая версия; исходный Nuxt/Vue-проект здесь не реконструирован.

## Сетка и размеры шрифтов · 03.11.2026

`media-reference.css` переносит адаптивную сетку и текстовые роли [Медиа](https://daniilterekh-prog.github.io/barn-estate-homepage-clone/media/#subscribe). Источник — существующий UI-кит BARN Estate, без новых библиотек. [Контракт, текущие публичные страницы и проверки](https://github.com/daniilterekh-prog/barnes-sites/blob/main/main-site/pages/media-reference-2026-11-03/README.md). Старый статический снимок и текущая публичная страница различаются наполнением; CSS применён к обоим, опубликованная версия проверяется отдельно.

## Высота hero по живой главной · 03.11.2026

`hero-height.css`:560 px до540 px,820 px от541 до1440 px,960 px от1441 px. [Источник и120проверок четырёх страниц](https://github.com/daniilterekh-prog/barnes-sites/blob/main/main-site/pages/media-reference-2026-11-03/hero-height/README.md). Этот контракт заменяет только прежние значения высоты первого экрана.

## Хедер по Медиа ·03.11.2026

media-header.css/js приводят первичный хедер к Медиа; в закреплённом сохраняют левые якоря, заменяют размер/пропорцию логотипа и всю правую часть. [Контракт и проверки](https://github.com/daniilterekh-prog/barnes-sites/blob/main/main-site/pages/header-media-2026-11-03/README.md).

## Полное оформление hero по Медиа ·03.11.2026

`hero-media-parity.css` задаёт общие отступы, типографику, размеры CTA и цвета. [Контракт и проверки](https://github.com/daniilterekh-prog/barnes-sites/blob/main/main-site/pages/hero-media-parity-2026-11-03/README.md).

## Техническая очистка ·03.11.2026

Удалены доказанные повторные CSS/SSR-декларации; исходные версии примитивов сохранены в provenance, текущие хэши обновлены. Геометрия, цвета, контент и действия проверяются сравнением до/после. [Единый реестр страниц](https://github.com/daniilterekh-prog/barnes-sites/blob/main/main-site/current-pages.json) · [Метод и отчёты](https://github.com/daniilterekh-prog/barnes-sites/tree/main/main-site/maintenance/2026-11-03-cleanup).

Текущий hero.css собирается из общего main-site/shared/hero-media/hero.css; старые hero-height.css/hero-media-parity.css заменены этим компонентом. Оформление херо не меняется.

Обновление 04.11.2026: плавающая карточка Руслана использует тот же портрет и круглый крупный кадр, что Медиа, через общие `expert-avatar.css/js`.
Новый hero: `assets/ambassadors-premium-residence-20261104.webp`; оригинал и происхождение в [barnes-assets](https://github.com/daniilterekh-prog/barnes-assets/tree/main/partners/hero/2026-11-04). Размеры и отступы hero сохранены.

## Правки Насти ·04.11.2026

[Реализация и проверки](https://github.com/daniilterekh-prog/barnes-sites/blob/main/main-site/pages/partners/revision-2026-11-04/README.md): компактные этапы, открытые преимущества, ответственность, направления/партнёры, клуб, форма перед компанией и разные CTA. Бегущие строки из главной, без новых библиотек. `assets/program.css` заменяет снятые `how-it-works.css`/`advantages-enhanced.css`; живой runtime — `for-partners.js`. SVG и их происхождение — `assets/partners/`; реальные фото — `assets/community/`, каноническая библиотека barnes-assets.

Уточнение пользователя: отдельный блок «Для вашего клиента / Наши услуги» удалён как дубль направлений. Во всех текстовых действиях, переключаемых направлениях и подписке стрелки — SVG16×16 из кита главной, без Unicode/emoji. Удалены связанные CSS и обработчик услуг.

## Сверка с новым UI-китом · 04.11.2026

[Изменения, источники и проверки](https://github.com/daniilterekh-prog/barnes-sites/blob/main/main-site/pages/partners/kit-audit-2026-11-04/README.md). `assets/kit.css` задаёт общие роли главной v1.0.2 и зарегистрированные партнёрские варианты; поздние хедер/херо по Медиа сохранены. Новых зависимостей нет.

04.11.2026: по запросу пользователя удалены кнопка «Приостановить логотипы», её обработчик и стили. Бегущая строка, пауза при наведении и reduced-motion сохранены.
 Проверено в браузере на 390/1440/1920px: кнопка отсутствует, анимация работает, переполнения и ошибок JavaScript нет; reduced-motion отключает движение.

04.11.2026: под заголовком FAQ добавлен отступ 28px на мобильном / 40px на desktop через фактический `.catalog-faq__grid`. Мобильные CTA этапов и направлений занимают всю ширину контента, текст/стрелка центрированы по образцу кнопки формы собственников. В форме восстановлен светлый подзаголовок на тёмном фоне.
Проверено в браузере на 9 ширинах 320–1920px: фактический отступ FAQ 28/40px, мобильные кнопки совпадают по левому краю и ширине с формой собственников; переполнения и ошибок JavaScript нет. [Замеры](https://github.com/daniilterekh-prog/barnes-sites/blob/main/main-site/pages/partners/kit-audit-2026-11-04/faq-cta-checks.json).

## Общий UI и мобильный бургер ·04.11.2026

[Изменения и проверки](https://github.com/daniilterekh-prog/barnes-sites/blob/main/main-site/pages/ui-parity-2026-11-04/README.md). Хедер1.1.0 и общий `page-kit.css`; исходники в `main-site/shared`, синхронизация по `current-components.json`. Новых библиотек нет. Основные роли — UI-кит главной1.0.2, зарегистрированные варианты карточек/форм сохранены.

## CTA по собственникам ·05.11.2026

[Оформление и проверки](https://github.com/daniilterekh-prog/barnes-sites/blob/main/main-site/pages/partners/contact-owner-2026-11-04/README.md). `assets/contact-owner.css` применяет дизайн нижнего CTA продажи к партнёрскому блоку; исходные фото и слова сохранены.
