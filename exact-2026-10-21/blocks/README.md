# Блоки актуальной главной BARN Estate

16 автономных пакетов. Для вставки одним фрагментом используй paste.html каждого блока (включает CSS/JS и изображения/шрифты в data URI). [Каталог превью](index.html) · [Главная, собранная из блоков](page.html) · [Состав](manifest.json) · [План](PLAN.md).

Каждая папка содержит index.html, block.html, block.css, block.js, assets/, README.md с ТЗ, content.json, design.json и manifest.json с хешами. Для копирования одного блока скачай его папку целиком либо ZIP из downloads/. Стили изолированы классом barnes-block. Для локального просмотра: `python3 -m http.server 8810` из папки blocks. Открывай через HTTP, а не редактор кода.

- [01-header — Хедер](01-header/README.md) · [превью](01-header/index.html)
- [02-hero — Херо и поиск](02-hero/README.md) · [превью](02-hero/index.html)
- [03-services — Услуги](03-services/README.md) · [превью](03-services/index.html)
- [04-recommendations — По рекомендации BARN Estate](04-recommendations/README.md) · [превью](04-recommendations/index.html)
- [05-directions — Выбрать направление](05-directions/README.md) · [превью](05-directions/index.html)
- [06-about — О BARN Estate](06-about/README.md) · [превью](06-about/index.html)
- [07-project-month — Проект месяца](07-project-month/README.md) · [превью](07-project-month/index.html)
- [08-reviews — Отзывы](08-reviews/README.md) · [превью](08-reviews/index.html)
- [10-team — Наша команда](10-team/README.md) · [превью](10-team/index.html)
- [11-partners — Наши партнёры](11-partners/README.md) · [превью](11-partners/index.html)
- [12-contacts — Способы связи](12-contacts/README.md) · [превью](12-contacts/index.html)
- [13-news — Новости](13-news/README.md) · [превью](13-news/index.html)
- [14-newsletter — Рассылка](14-newsletter/README.md) · [превью](14-newsletter/index.html)
- [15-footer — Футер](15-footer/README.md) · [превью](15-footer/index.html)
- [16-expert — Плавающий эксперт](16-expert/README.md) · [превью](16-expert/index.html)
- [17-quiz — Квиз обращения к эксперту](17-quiz/README.md) · [превью](17-quiz/index.html)

## Подключения

Формы/подписка/каталог требуют серверных обработчиков принимающего сайта. Квиз и клиентская логика работают самостоятельно; события barn:lead, barn:subscribe и barn:search описаны в каждом пакете. Изображения, шрифты и SVG находятся внутри каждого пакета. Все внутренние ссылки исходного снимка преобразованы в абсолютные barn-estate.ru; перед переносом замени их на маршруты своего сайта.

## Состояние исходных данных

У загородного объекта ID587186 исходное фото возвращает404 — добавлена явная заглушка. У коммерческого объекта ID557723 фото отсутствует в исходном снимке. Курортная категория сохранённой подборки пустая. Подробности: [CURRENT.md](../CURRENT.md). Другие изображения локальны, подмен фотографиями других объектов нет.

## Источник

Рабочий commit 3b8f2fb715bdf1840df0ed6450226414b028ebe0, захват 2026-11-01T12:42:16.163Z. Библиотека сохраняет текущий дизайн с согласованными изменениями, а не первоначальную страницу21.10. Исходный Nuxt-архив не переписывается. Генератор: ../tools/block-library/.
