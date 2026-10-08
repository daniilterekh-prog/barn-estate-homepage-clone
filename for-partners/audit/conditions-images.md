# Изображения «Условия сотрудничества» — 2026-10-08

Три новые сгенерированные иллюстрации встроенным imagegen: интерьер, фасад, переговорная. Не реальные объекты или офис BARNES. Каноническая библиотека barnes-assets проверена; готового набора под три условия не найдено. Старые media-02/03/04.png сохранены, новые ассеты используются только в #conditions. Содержание, размеры карточек, шрифты UI-кита и SEO-метаданные не меняются. Квадратные WebP 800×800, quality88; только техническое уменьшение и перекодирование.

## Промпты

Общий шаблон:

`Use case: photorealistic-natural. Asset type: square editorial photograph for a premium BARNES real estate partnership website card. Scene: [scene] Style: natural professional photography, realistic material grain, restrained warm neutral colors, gentle contrast, realistic exposure, full scene sharp enough to feel real, 50mm lens. Square composition, key subject crop-safe near center; upper and lower edges uncluttered for existing website overlay. Avoid: miniature buildings, scale models, artificial CGI sheen, obvious AI-stock aesthetic, hands, people, handshake, cash, charts, text, logos, watermarks, collage, exaggerated luxury, baked-in shading. Single square image.`

### assets/conditions/buyer.webp

An understated premium city apartment living room, tall real oak doors, limestone floor, linen sofa, a single bronze pendant, natural side daylight. Camera at eye level, believable occupied home, subtle imperfections, not palatial.

### assets/conditions/owner.webp

An authentic close architectural photograph of a refined historic Moscow residential facade in pale stone, tall windows and a wrought-iron balcony, photographed from street level, restrained greenery at bottom, overcast natural light, believable perspective.

### assets/conditions/repeat.webp

An intimate elegant real estate office meeting space with a walnut round table, two upholstered chairs, one closed plain paper folder and a ceramic cup, tall window softly revealing a city street, no people. Calm working environment, daylight, not a hotel lobby.

## Проверка

check-conditions-images.cjs проверяет изолированный блок с настоящими стилями на 390/1440: загрузка трёх разных квадратных изображений, ненулевые размеры, отсутствие горизонтального overflow. Снимки conditions-images-{width}.png. Не является проверкой всей страницы.

Standalone Chromium дважды упал до завершения прогона; скриншоты и PASS этим сценарием не получены. Вместо этого выполнена проверка всей актуальной страницы в Codex In-app Browser после reload: три новых src и complete/naturalWidth подтверждены; все изображения одинаковой высоты 420.6875 px на исходном desktop viewport, 256.828125 px при viewport390×900. Визуально проверены естественное кадрирование и читаемость подписей. Мобильная подмена viewport после проверки сброшена. Скриншоты показаны в ходе проверки, отдельные файлы не экспортированы.
