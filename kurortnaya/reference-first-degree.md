# Референс узлов первой степени

«Курортная» утверждена как референс первого уровня. Каноническая библиотека: [barnes-assets / first-degree](https://github.com/daniilterekh-prog/barnes-assets/tree/main/blocks/nodes/first-degree).

- [Превью всех блоков](https://daniilterekh-prog.github.io/barnes-assets/blocks/nodes/first-degree/catalog.html).
- [UI-контракт](https://github.com/daniilterekh-prog/barnes-assets/blob/main/ui-kit/first-degree.md).
- [Измерения](https://github.com/daniilterekh-prog/barnes-assets/blob/main/ui-kit/first-degree-measurements.json).

Первый экспорт 1.0.0 зафиксирован по commit dacc3ab943a1dd8167188300592c683b35d16b06. 15 блоков и три самостоятельные карточки, desktop/mobile HTML, общие стили, локальные ассеты, runtime и инструкции интеграции. Другие страницы не смешиваются с этой коллекцией.

Полная синхронизация 12.10.2026 — по `9b83c5d6b3858df52fe27da7b1b8ba18a2210459`: все фрагменты, общий хэдер/футер, CTA, карточки, карта, фильтры и сортировка пересобраны; прежние `blocks/cards/*` тоже актуальны. [Сводка дня](changes-2026-10-12.md), проверки и инструменты экспорта сохранены в GitHub.

Для новых узлов копируй нужные папки плюс `_shared`, меняй данные/якоря/ссылки. API отправки заявок, каталог и карта подключаются адаптерами; библиотека не содержит ключей или фиктивной успешной отправки.
