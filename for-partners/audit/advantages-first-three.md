# Первые три карточки преимуществ — 2026-10-08

Заменены только изображения международной сети, премиум/делюкс-недвижимости и встреч с предпринимателями/инвесторами. Содержание описаний и порядок карточек сохранены. Ассеты сгенерированы встроенным imagegen; это иллюстративные сцены, не реальные объекты, сотрудники или встречи BARNES. Каноническая библиотека barnes-assets проверена; готового набора под три карточки не найдено. Старые изображения не удалены.

## Типографика

Описание при наведении: Body из reference-ui.md — Tilda Sans16/22.4px,400, letter-spacing0, text-transform:none. Все десять карточек используют единый класс; font-family теперь задан явно. Заголовки, номера, положение текста, базовое затемнение12% и интерактивное68% сохранены. SEO: HTML-тексты, alt, метаданные и URL не изменены.

## Промпты и сохранённые файлы

Общий шаблон: `Use case: photorealistic-natural. Asset type: vertical 2:3 premium BARNES partnership website photo card. Scene: [scene] Composition: key subject in middle/lower half, upper quarter quiet with natural darker midtones for white HTML heading. Style: natural professional editorial photography, neutral warm gray and stone palette, restrained contrast, believable light, detailed real material texture, realistic perspective, no oversaturated gold. Single portrait image. Constraints: no text, logos, watermark, miniature buildings, architectural scale models, CGI shine, surreal details, money, charts, baked-in dark overlay. Illustrative scene, not a documentary image of actual BARNES employees, office or event.`

### assets/advantages/international-network.webp

A real-looking editorial architectural photograph from a Paris residential balcony overlooking elegant Haussmann buildings and rooftops, the Eiffel Tower distant and subtle, iron balcony foreground, soft overcast daylight. Single coherent city view, no map, no flags, no collage. Visually communicates international real estate.

### assets/advantages/premium-residence.webp

A refined contemporary premium penthouse living room with floor-to-ceiling windows, beautiful natural travertine, dark oak furniture, a sculptural cream sofa and an understated city skyline beyond, realistic everyday proportions, subtle material imperfections, gentle daylight. Architectural magazine photography, not a 3D render.

### assets/advantages/business-meeting.webp

A candid medium-wide editorial photograph of three mature business professionals, a woman and two men, in understated tailored smart-casual clothing conversing around a walnut table in an elegant private office lounge. Natural engaged expressions, no eye contact with camera, relaxed side profiles, hands resting naturally mostly obscured by table, no handshake. Realistic varied human faces and anatomy, discreet premium interior, no staged triumphant poses.

Все три WebP800×1200,quality88. Только техническое уменьшение и перекодирование.

## Проверка

Codex In-app Browser, актуальная страница после reload:1440×1000 — три новых src загружены, вычисленный шрифт Tilda Sans16/22.4/400. Hover каждой из трёх карточек даёт visibility:visible, высота540px сохраняется, текст помещается. 390×1000 с touch — все три описания открываются по+/−, тот же Body16/22.4/400, высота460px сохраняется, тексты помещаются. Визуально просмотрен desktop и раскрытие третьей карточки. Подмены viewport/touch сброшены. Скриншоты показаны в проверке, отдельно не экспортированы.

