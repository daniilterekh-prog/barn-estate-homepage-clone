# Контактный CTA: фон и UI-kit — 2026-10-08

Проверена каноническая библиотека daniilterekh-prog/barnes-assets; новый фон создан встроенным imagegen по запросу пользователя. Сверены reference-ui.md и arenda_sobstvennikam/reference-ui-overrides.css из origin/master.

## Изменения

- assets/partner-cta-residence.webp:1672×941,118750bytes; техническая конвертация PNG→WebP quality88. Декоративная иллюстрация, не конкретный объект. Портрет Игоря без изменений. HTML src/width/height/alt/lazy заданы статически, добавлен якорь #partner-contact.
- Правая карточка: H3 22/26.4px,400; описание22/28.16px,300; имя22/26.4px,400; должность13/18px,300. Padding40px desktop/32px tablet, gap24px, radius1px. До1024: H3 20/24px, описание15/19.2px,300.
- Каналы70px desktop/58px mobile, labels17/19/18px,400, radius1px, gap12px; SVG18px desktop/22px mobile. Paths сохранены. Две колонки от1280, одна до1279. Нативные toggle buttons, role=group, синхронный aria-pressed, белый focus, reduced-motion.

## Проверка

In-app Browser:320/390/768/1024/1280/1440/1920. Все4 кнопки имеют ожидаемые computed font/line/weight/height/radius/SVG size. Переполнения CTA по ширине и обрезки карточки/кнопок нет. Фон загружен, naturalWidth1672.

Все4 канала переключены Enter, ровно один aria-pressed=true. Правая кнопка открывает «Обсудить партнёрство», Escape закрывает. Пустой submit проверен без ввода контактов и согласия; заявки не отправлялись. Существующая логика, тексты и честный статус отсутствия backend сохранены, CRM не подключена. SEO-метаданные не менялись. Viewport сброшен.

Для освобождения временного диска удалена только /tmp/barnes-directions-generated-originals/generated-country.png: cmp подтвердил побайтное совпадение с сохранённым оригиналом generated_images/01a11aac-ecfa-7531-9900-f6f1e0344449/exec-d51ab021-ac8c-4324-add8-87baa0fcabbc.png. Оригинал и сайт не удалены.

## Финальный промпт (built-in imagegen)

Use case: photorealistic-natural. Asset type: wide background photograph for a premium real estate ambassador program contact CTA on BARNES website. Generate a horizontal 16:9 high-end editorial architectural photograph of a spacious elegant contemporary luxury residence living room at dusk, panoramic windows with believable city skyline, warm indirect illumination, natural dark wood and travertine stone, restrained cream upholstery. Composition: left half quiet dark low-detail wall and shadowed foreground suitable for white form text overlay; right half more visible elegant interior and windows, restrained detail not competing with a small expert portrait overlaid in HTML. Natural proportions, realistic materials, clean credible architecture, no people, no text, no logos, no watermark. Sophisticated understated premium atmosphere, not shiny CGI, not surreal. The image is decorative illustration, not a specific property.
