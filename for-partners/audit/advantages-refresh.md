# Обновление карточек преимуществ — 2026-10-08

Эта редакция заменяет прежний визуальный контракт advantages-content.md и advantages-reveal.md: в покое все изображения затемнены на 12%, описание скрыто. Дополнительное затемнение до 68% и описание появляются при hover, клавиатурном фокусе активного слайда либо touch-переключателе. Номера и начало заголовков имеют одинаковые вертикальные координаты; карточки не меняют высоту.

## Порядок и фактическая основа

1. Международная сеть BARNES — презентация, слайды 2, 3, 5, 11; без спорных чисел офисов/стран.
2. Премиальная и делюкс-недвижимость — слайды 2, 4, 5, 11; типы объектов вместо неподтверждённого стажа.
3. Встречи с предпринимателями и инвесторами — слайды 4, 5, 20; мероприятия на Петровке, не обещание передачи VIP-базы.
4. Комментарии экспертов в РБК и Forbes — слайд 11. Публичный раздел https://barn-estate.ru/media/ подтверждает присутствие аналитики бренда в СМИ.
5. Девелоперы и закрытые продажи — слайд 11; только доступные предложения, без гарантии эксклюзивного доступа.
6. Рекомендованный клиент закреплён за вами — слайды 12–13; после проверки уникальности.
7. Статус работы с клиентом и результат сделки — слайд 12.
8. Покупка, продажа и аренда в России и за рубежом — слайды 6–9, 11.
9. Презентации объектов для ваших клиентов — слайды 18–19; доступ уточняется у менеджера.
10. Art de Vivre: искусство, вино и яхтинг — слайды 2, 10; поло подтверждено официальной публикацией BARNES о поддержке Open de France 2025: https://www.barnes-international.com/es/acerca-de-barnes/actualidad/2025/la-25a-edicion-del-open-polo-de-francia-barnes-en-chantilly-3084.html . Фото этой публикации недоступно для загрузки (403), использована иллюстрация, а не снимок турнира.

## Изображения и промпты

Каноническая библиотека daniilterekh-prog/barnes-assets проверена. Шесть новых изображений созданы imagegen, затем только уменьшены и перекодированы в WebP 800×1200, quality 88. Это иллюстрации: люди и события не выдаются за реальных сотрудников, клиентов или мероприятия BARNES. Логотипоподобная надпись BARNES присутствует только на игровой рубашке всадника, по запросу пользователя.

Общий промпт: `Use case: photorealistic-natural. Asset type: vertical BARNES partnership website photo card. [scene] Single portrait 2:3 image, sophisticated natural editorial realism, warm neutral palette, real material texture, no collage, no overlay, no baked-in darkening, no decorative text or watermark. Upper quarter kept visually calm and slightly dark in natural scene lighting for white HTML number/title. Subject in middle/lower area, crop-safe center. No logos and no readable text.` Для поло последнее предложение: `Only text allowed is the BARNES sponsor on the jersey.`

| Файл в assets/advantages | Scene |
| --- | --- |
| media-analysis.webp | A refined real estate market analyst's desk: open architecture journal, printed market charts without readable numbers, fountain pen, warm stone desk and softly blurred Moscow skyline through tall windows. No miniature buildings. No people. |
| client-registration.webp | Close-up of a refined advisor's hands placing a single cream client referral folder into an organized portfolio at a walnut desk, subtle brass details, warm daylight. Folder plain and confidential, no names or readable document text, no handshake. |
| client-feedback.webp | A real estate advisor in elegant neutral suit, three-quarter rear view, making a phone call beside a tall office window with softly blurred city beyond, holding an understated notebook, natural human anatomy. No visible face in close-up, no miniature buildings. |
| property-requests.webp | A beautiful premium Moscow apartment with an open terrace overlooking a green residential district, architectural photography, warm pale stone and oak, large glazed doors, no people, avoid skyscraper-only composition. |
| partner-materials.webp | Carefully arranged premium property presentation portfolio on a large oak table: two open editorial brochures with clear large architectural photos, one tablet showing a property photograph without text, elegant natural linen and paper textures, no people. |
| barnes-polo.webp | A photorealistic editorial photograph of a single polo rider on a beautiful chestnut horse on a manicured grass field in France, rider wearing a navy polo jersey with a legible white chest sponsor word exactly 'BARNES', holding a polo mallet naturally. Horse and rider full body visible, correct anatomy, elegant restrained sport photography, tasteful distant trees. This is an illustrative scene, not a documentary of a specific event. |

## Проверка

check-advantages-reveal.cjs: десять карточек, совпадение координат номеров/заголовков, Art de Vivre последним, базовое и активное затемнение, скрытие/раскрытие описания, постоянная высота, клавиатура Home/End, вместимость текста и загрузка фото при включённых изображениях. Итоги: advantages-reveal-checks.json. Проверяется изолированная секция, не вся страница. При падении Chromium запуск NO_IMAGES=1 проверяет только геометрию и поведение и явно помечается photosEnabled=false.

SEO: h2, десять h3, HTML-описания и метаданные сохранены; новые смысловые заголовки не внедряют неподтверждённых числовых обещаний. Декоративные фотографии с пустым alt не дублируют текст карточек. Формы, URL и навигация не изменены.

Фактические прогоны: 390 px с изображениями — PASS, все десять фото загружены, сделаны closed/open/last скриншоты; 320 px без изображений — PASS. 1440 px без изображений — PASS для геометрии и поведения. Попытки 1440 px с фото и 768 px завершились падением процесса Chromium; полноценная визуальная desktop/tablet-проверка не подтверждена. Старые advantages-reveal-1440-*.png относятся к предыдущей редакции, не использовать как актуальный эталон.
