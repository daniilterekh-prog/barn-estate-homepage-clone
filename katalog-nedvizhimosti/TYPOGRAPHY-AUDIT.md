# Типографика каталога и UI-кит главной — 03.11.2026

Источник: [канонический UI-кит главной v1.0.0](https://github.com/daniilterekh-prog/barnes-sites/blob/main/main-site/pages/home/exact-2026-10-21/UI-KIT.md), [опубликованный референс](https://daniilterekh-prog.github.io/barn-estate-homepage-clone/exact-2026-10-21/). Копии home-typography.css и home-buttons.css побайтно совпадают с текущими исходниками кита (Git blob 04fecc4195d7c467e88fe481fea083079534ca0f / 983d64e9c66966deb7e96b761bd609a9f2f23bbc).

Порядок работы:

1. Замерить итоговые font-size, font-weight, line-height, tracking, font-family на 12 ширинах 320–3840px и в раскрытых интерфейсах. Общие элементы сравнивать с подготовленным публичным референсом; сырой архив index.html без подключаемых при экспорте слоёв не является актуальной главной.
2. Сохранить уже совпадающие роли: H1, карточки, хэдер/меню, футер, квиз, компактный эксперт. Сохранить 300 для сделки и департамента, утверждённую геометрию фильтров и самостоятельную узкую композицию карты.
3. Подключить локальные поля к --home-field (17/18/20px), заголовок полной формы к --home-card (20px до 1024; 24px далее), чипы к 16px. Убрать конкурирующие локальные размеры. CTA используют --home-button-font (18/17/19px).
4. Проверить вычисленные роли, открытые состояния, переносы/переполнение, отсутствие изменения размеров общих полей между департаментами, формы и выбор параметров. Сохранить проверки, commit/push, затем подтвердить публичную версию.

## Найденные расхождения

| Роль | Было | Должно быть по роли кита |
| --- | --- | --- |
| Текст быстрых полей, сделки, поиска |19px до 1440, на телефоне смесь 17/18px | --home-field:17px ≤540;18px541–1440;20px ≥1441 |
| Заголовок полной формы |24px на всех ширинах | --home-card:20px ≤1024; 24px далее |
| Ввод полной формы |18px на всех ширинах | --home-field:17/18/20px |
| Чипы полной формы / выбранных условий |15/14px |16px |
| Варианты выпадающего выбора |17px |18px как компактный выбор направления |

Основной шрифт — Tilda Sans. Карточки сохраняют название20/22 px (400), цену24/26 px (500), адрес/ID13/18 px (300), компактные характеристики13/16 px и отдельные 54px действия. Хэдер, футер и квиз сравниваются с соответствующими компонентами главной; мини-карточки и фильтры карты сохраняют контракт курортного узла (узкая боковая панель), а не масштаб полной карточки выдачи. Служебные подписи/счётчики 12–15px и компактные брови эксперта 10–13px остаются самостоятельными ролями.

## Результат

Расхождения исправлены. Заголовок пустой выдачи использует компактную роль --home-card, описание пустой выдачи/ошибки — --home-lead и --home-lead-line. У выбранных чипов очищен фон самого текстового span: исходная тёмная тема окрашивала его в #464646 поверх светлого выбранного контейнера, снижая контраст. Фон теперь задаёт только контейнер; обычное и наведённое состояния прошли axe.

- [Исходные замеры](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/typography-kit/before.json).
- [Итоговая типографика](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/typography-kit/audit.json): 12 ширин 320–3840px, 24 раскрытых состояния, сравнение с референсом меню/квиза/хедера/футера, название/цена/ID карточки, выбранные чипы и пустая выдача.
- [Геометрия](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/typography-kit/geometry.json): 130 состояний, размеры общих полей совпадают между направлениями и сделками; нет переполнения и обрезанных названий департаментов/рынка.
- [Панель](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/typography-kit/toolbar.json): 55 сочетаний, форма/поиск/сброс/сортировка, axe.
- [Кит и формы](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/typography-kit/kit-contracts.json), [axe](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/typography-kit/kit-accessibility.json): 15 ширин, карточки, хэдер, контакты, квиз, валидация, клавиатура, возврат фокуса и отсутствие ошибок загрузки/JavaScript. Заявки не отправлялись.
- [Выбранные условия](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/typography-kit/active-filters.json): длинные подписи 320px, radio/клавиатура, URL, карта, применение/отмена/сброс и доступность.
- Снимки: [390px](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/typography-kit/typography-390.png), [1440px](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/typography-kit/typography-1440.png), [1920px](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/typography-kit/typography-1920.png).

Повторная проверка: `node katalog-nedvizhimosti/tools/check_catalog_typography.cjs`. URL каталога и каталог отчёта задаются BARNES_CATALOG_URL и BARNES_PROOF_DIR. Используется существующий Playwright/Chrome, новых пакетов/шрифтов не установлено.

Уточнение от 03.11.2026: по отдельному запросу хлебные крошки перенесены на шкалу [страницы продажи собственникам](https://barn-estate.ru/prodazha_sobstvennikam/): 12/13/17px и отдельный адаптивный размер разделителя. [Замеры 20 ширин](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/owner-breadcrumbs/breadcrumbs.json). Остальные роли этого аудита сохранены.

По уточнению пользователя сортировка и «На карте» также переведены на --home-field (17/18/20px), [проверены 50 сочетаний](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/result-type/typography.json). Счётчик и сброс остаются компактными.

Уточнение H1: по запросу пользователя используется шкала узловых страниц — 32px до 540px и clamp(38px,4vw,58px) выше, 300/1.05/−0.045em. Регистр обычный: «Каталог недвижимости». [Сравнение с городской/загородной на 14 ширинах](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/node-h1/h1.json). Эта роль заменяет прежние 22/38/44px только у H1 каталога.

## Финальная сверка с фактической главной, без изменений карточек — 03.11.2026

Новый ориентир для панели выдачи — фактические поля **hero главной**, а не универсальный `--home-field` для контактных форм. В hero поиск и фильтры имеют 16px до 1440px и 18px выше. Универсальный токен был на 1–2px крупнее: 17/18/20px. Главная остаётся источником сравнения; её файлы не изменялись.

| Элемент каталога | До | После |
| --- | --- | --- |
| Сделка, департамент, рынок, быстрые параметры, поиск | 17 / 18 / 20px | 16px ≤1440; 18px ≥1441 |
| Сортировка и «На карте» | 17 / 18 / 20px | 16px ≤1440; 18px ≥1441 |
| Видимая подпись «Все фильтры» | 18 / 20px | 16 / 18px |
| Поиск, департамент, рынок, сделка и сортировка внутри карты | 17 / 19px | 16 / 18px |
| Числовые диапазоны полной формы | 17 / 18 / 20px | 16px ≤540; 18px ≥541 |

Насыщенность управляющего текста — согласованные 300. Высота кнопок/полей, раскладка и межстрочные интервалы сохранены. На главной мобильный диапазон имеет 15px; в каталоге установлен минимум 16px, чтобы фокус поля не вызывал автоматическое увеличение экрана на iPhone. Это единственное намеренное отклонение близкого размера у унифицируемых числовых полей.

Хедер, бургер, футер, эксперт и квиз совпадают с главной по проверяемым размерам, насыщенности, межстрочным интервалам и разрядке. H1 сохраняет отдельно утверждённую шкалу узловых страниц, хлебные крошки — собственников. Самостоятельные компактные роли счётчика, сброса и подписей сохранены. Карточки выдачи и мини-карточки карты не изменялись: проверены контрольные суммы вычисленных текстовых стилей всех их элементов в 90 состояниях (15 ширин × 6 сочетаний департамента/рынка).

Доказательства:

- [Замеры фактической главной и каталога до правки](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/final-fonts/before-pairs.json).
- [Итоговая сверка: 15 ширин 320–3840px и 24 состояния](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/final-fonts/audit.json).
- [Неизменность карточек и мини-карточек карты](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/final-fonts/cards-unchanged.json).
- [Панель, ввод, применение, сброс, сортировка, доступность](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/final-fonts/two-row-toolbar.json).

Новых зависимостей и шрифтов нет. Изменения ограничены локальными адаптерами каталога; канонические слои кита и селекторы карточек сохранены.

### Уточнение: вернуть фильтры как было — 03.11.2026

По следующему сообщению пользователя унификация управляющих размеров отменена. Актуальны прежние 17/18/20px для панели, поиска, сортировки и кнопки карты; 17/18/20px для диапазонов полной формы и 17/19px для управления внутри карты. Три CSS-адаптера восстановлены побайтно из версии до унификации. Остальные результаты сравнения общих компонентов с главной и неизменность карточек сохраняются. Таблица выше описывает исторический вариант, текущая шкала — в [FONT-SIZES.md](FONT-SIZES.md). [Повторная проверка](https://github.com/daniilterekh-prog/barnes-sites/blob/main/katalog-nedvizhimosti/verification/filters-restored/audit.json).
