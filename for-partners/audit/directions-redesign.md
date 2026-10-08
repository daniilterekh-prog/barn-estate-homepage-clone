# Переработка «Направления BARNES»

Дата: 2026-10-08. Основание: просьба убрать подробности, сузить левую часть, исправить наложения и сгенерировать отсутствующие изображения.

## Реализация

- Левая фотография: .85fr; правая информация: 1.15fr; промежуток 48 px desktop и 32 px tablet. Фото 620 px desktop, 320 px tablet, 290 px mobile.
- Правая панель состоит из пяти самостоятельных групп: заголовок/описание, бюджет, показатели, комиссия, CTA. Минимальные строки сохраняют позиции при переключении, но допускают рост содержимого — больше нет фиксированных высот отдельных заголовков/описаний, вызывавших наложения.
- Удалён HTML-блок «Подробнее о направлении». Данные деталей сохранены в исходном объекте как история, на странице не выводятся.
- H2/H3/Body/подписи/CTA соответствуют UI-киту: Light H2, Regular H3, Body 16/22.4, метаданные 13/18; кнопка 70/58 px, radius 1.
- Комиссия крупная бордовая; ВНЖ и коммерция — «Условия оговариваются», без придуманного процента. Формат сделки сохранён подписью.
- Все семь табов, клавиатура и выбор на мобильном сохранены. Форма получает выбранное направление через существующий обработчик barnes:request; серверная отправка не добавлялась.
- Мобильная композиция до 900 px: selector, фото, текст. Бровь по центру. Остальная страница не перерабатывалась.

## Изображения

Использован встроенный imagegen, не API/CLI. Шесть новых сцен заменяют прежние цветовые заглушки. Оригинальная городская фотография сохранена. Генерации — иллюстрации категорий, не реальные предложения или документы; это указано в alt и подписи. Ассеты сохранены в assets/directions/generated-{country,rent-city,rent-country,abroad,residency,commercial}.webp. PNG-оригиналы остаются в каталоге generated_images; WebP — без изменения сцены, quality 90.

Каноническая библиотека barnes-assets была проверена в этой рабочей сессии. Новая генерация выполнена по прямому запросу пользователя, а не вместо поиска имеющихся реальных объектов.

### Общая часть промптов

Use case: photorealistic-natural. Asset type: real-estate website category illustration, single landscape photograph, 3:2 composition. Style: believable high-end editorial architectural photography, restrained warm neutral palette, realistic materials and straight verticals, no exaggerated CGI gloss. Full-bleed image with subject centered and generous crop-safe margins so it also works in a tall panel. No people, no text, no logo, no watermark, no collage. This is an illustrative concept, not documentation of a specific property.

### Сцены (Scene)

- country: Contemporary country estate outside Moscow: elegant limestone and wood villa surrounded by mature pines, manicured private garden, late afternoon light. Exterior three-quarter view.
- rent-city: Premium Moscow apartment living room for long-term rental, floor-to-ceiling windows with a subtle city skyline, linen sofa, walnut joinery, travertine, warm natural daylight. Interior architectural photograph.
- rent-country: Beautiful rental country residence outside Moscow, view from a tasteful living room through open glazing onto a private wooded terrace and garden, warm oak and cream upholstery, relaxed luxury.
- abroad: Contemporary luxury Mediterranean coastal residence, terraced limestone architecture, infinity pool overlooking blue sea, olive trees, natural golden daylight, sophisticated restrained design.
- residency: Elegant contemporary residential waterfront district in Istanbul, a tasteful apartment terrace overlooking the Bosphorus with distant city buildings, limestone facade and understated greenery. No documents, no passports.
- commercial: Premium contemporary business center lobby with double-height glass entrance, stone floors, refined office reception and architectural lighting, natural daylight, realistic commercial property photography.

## Приёмка

check-directions-redesign.cjs проверяет 7 категорий на 320,375,390,540,768,1024,1280,1440,1920 px: изображение загружено, нет блока подробностей, overflow/наложений/обрезки строк нет; позиции кнопки и высоты фото стабильны; выбранная коммерция передаётся в hidden directionId существующей формы. UI-снимки 390/1440 px — directions-redesign-{width}-{category}.png, машинные данные — directions-redesign-checks.json и directions-check-{width}.json. SCREENSHOTS=1 включает снимки, WIDTHS позволяет отдельный прогон размеров.

В тесте посторонние изображения заблокированы, а изображения направлений подаются из тех же локальных WebP через Playwright route. На desktop активируется реальный обработчик кнопки через DOM click, на mobile — selectOption. Это обход нехватки ресурсов автоматического браузера при многократном scroll-into-view, а не изменение сайта. HTTP-доступность ассетов проверена отдельно. Floating-expert скрыт только тестовым CSS. Серверная доставка формы не тестировалась — она не реализована этим изменением.

Публикация не выполнялась: код и изображения сохраняются в текущей ветке GitHub. Изменение чисел и условий программы в этот редизайн не входит.
