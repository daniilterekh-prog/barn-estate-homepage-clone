# owner-sale

Точка входа: `index.html`.

HTML, собственные CSS, JS и локальные ассеты лежат в этой папке. Общие зависимости — в `../`; встроенные стили и авторские исполняемые скрипты вынесены в `*.inline-*.css` / `*.inline-*.js`. Начальная конфигурация Nuxt и JSON остались в HTML для порядка инициализации. Варианты `standalone`, `latest`, `mobile` сохранены рядом.

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
