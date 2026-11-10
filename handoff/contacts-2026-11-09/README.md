# Контакты BARN Estate — дизайн и код для разработчика

Актуальный снимок от 09.11.2026: верх без херо, три офиса, карты и способы связи в одном блоке, подменю по «Избранному», футер и контактный диалог. Петербург: **наб. реки Мойки, 59, БЦ «Сенатор», пом. 307**. Мобильные вкладки — в одну строку, крайние подписи по двум краям сетки, промежутки равные.

| Что нужно | Где смотреть |
| --- | --- |
| Полная страница | [code/html/index.html](code/html/index.html) |
| Скачать всю папку | [contacts-developer-2026-11-09.zip](https://raw.githubusercontent.com/daniilterekh-prog/barn-estate-homepage-clone/master/handoff/contacts-2026-11-09/contacts-developer-2026-11-09.zip) |
| HTML страницы и четырёх фрагментов | [code/html/](code/html/) |
| CSS по компонентам | [code/css/](code/css/) |
| JavaScript по компонентам | [code/js/](code/js/) |
| SVG, шрифты и лицензии | [code/assets/](code/assets/) |
| Адреса, ссылки и источники данных | [code/data/content-sources.json](code/data/content-sources.json) |
| Подключение и точки интеграции | [INTEGRATION.md](INTEGRATION.md) |
| Шрифты и размеры текста | [design/TYPOGRAPHY.md](design/TYPOGRAPHY.md) |
| Цвета, рамки и состояния | [design/COLORS.md](design/COLORS.md) |
| Сетка, размеры и отступы | [design/SPACING.md](design/SPACING.md) |
| Поведение компонентов | [design/BEHAVIOR.md](design/BEHAVIOR.md) |
| Снимки телефона и десктопа | [design/screenshots/](design/screenshots/) |
| Фактические замеры | [design/MEASUREMENTS.json](design/MEASUREMENTS.json) |
| Происхождение и SHA-256 | [SOURCE.json](SOURCE.json) |
| Результаты проверки | [VERIFICATION.json](VERIFICATION.json) |

Локальный запуск из этой папки:

```sh
python3 -m http.server 8080
```

Открыть `http://localhost:8080/code/html/index.html`. npm, сборщик и серверная часть не нужны. Сохраняй структуру `code/`: относительные пути настроены для неё. Все шрифты и SVG локальные; карта использует внешний iframe Яндекс Карт.

Полная страница уже подключает CSS/JS в правильном порядке. Фрагменты нужны для переноса в шаблон проекта; отдельно вместе с полной страницей их добавлять не нужно. JavaScript, SVG, шрифты и данные скопированы без изменения; в HTML/CSS перебазированы только локальные пути.

Канонические исходники: [barnes-sites/main-site/pages/contacts](https://github.com/daniilterekh-prog/barnes-sites/tree/main/main-site/pages/contacts). Эта папка — передача разработчику. Рабочее [превью страницы](https://daniilterekh-prog.github.io/barn-estate-homepage-clone/contacts/). Пять утверждённых узлов и общие файлы не менялись.

Проверены16ширин320–3840px: вычисленные стили и геометрия исходника и экспорта совпали. На390/1440/1920px Pixelmatch не обнаружил значимых различий (threshold0.1); исходные PNG отличаются на6–12незначительных пикселях растрирования, это отражено в VERIFICATION.json. Проверены все9подменю,3офиса, клавиатура, мобильное меню/контакты, диалог и режим без JS; ошибок JS/локальных ресурсов и нарушений axe в проверенном состоянии нет. Внешние ресурсы оформления не запрашивались, карты Яндекса в сравнении заблокированы для стабильного снимка.

Обновлено 10.11.2026: удалены стрелки из ссылок под картами всех трёх офисов; ссылки и кнопки «Маршрут» сохранены. Повторная проверка пакета: 16 ширин, визуальная сверка, меню и доступность.
