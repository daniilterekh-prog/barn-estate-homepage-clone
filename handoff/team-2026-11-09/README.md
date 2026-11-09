# Команда BARN Estate — дизайн и код для разработчика

Снимок от09.11.2026. Полная актуальная страница: хедер и все9подменю из «Избранного», поиск,8фильтров,27сотрудников, компактный CTA с формой главной, футер.

| Что нужно | Где смотреть |
| --- | --- |
| Открыть страницу | [code/html/index.html](code/html/index.html) |
| Скачать всю папку | [team-developer-2026-11-09.zip](https://raw.githubusercontent.com/daniilterekh-prog/barn-estate-homepage-clone/master/handoff/team-2026-11-09/team-developer-2026-11-09.zip) |
| HTML страницы и4фрагмента | [code/html/](code/html/) |
| CSS по компонентам | [code/css/](code/css/) |
| JavaScript по компонентам | [code/js/](code/js/) |
| Фотографии, SVG, шрифты, лицензии | [code/assets/](code/assets/) |
| Имена, роли и происхождение | [code/data/team.json](code/data/team.json) |
| Подключение и точки интеграции | [INTEGRATION.md](INTEGRATION.md) |
| Шрифты и размеры текста | [design/TYPOGRAPHY.md](design/TYPOGRAPHY.md) |
| Цвета, рамки и состояния | [design/COLORS.md](design/COLORS.md) |
| Сетка, размеры и отступы | [design/SPACING.md](design/SPACING.md) |
| Поведение компонентов | [design/BEHAVIOR.md](design/BEHAVIOR.md) |
| Скриншоты телефона и десктопа | [design/screenshots/](design/screenshots/) |
| Фактические замеры на16ширинах | [design/MEASUREMENTS.json](design/MEASUREMENTS.json) |
| Происхождение и SHA-256 | [SOURCE.json](SOURCE.json) |
| Результаты проверки | [VERIFICATION.json](VERIFICATION.json) |

Локальный запуск из этой папки:

```sh
python3 -m http.server 8080
```

Открыть `http://localhost:8080/code/html/index.html`. npm, сборщик и серверная часть не нужны. Для переноса сохраняй всю структуру `code/`; картинки и шрифты уже локальные. CSS/JS исполняются в том же порядке, что на рабочей странице. Изменены только пути ресурсов и переходов на соседние страницы; функции и оформление сохранены.

Проверены16ширин320–3840px, все9подменю, поиск и фильтры, мобильные контакты/меню, форма и режим без JS. Снимки исходника и экспорта побайтно совпали на390/1440/1920px. В ходе проверки пакет не запрашивал внешние ассеты. Ссылки на другие разделы ведут на опубликованный сайт; для просмотра этой страницы они не нужны.

Форма сохранена как на главной: в превью отправка заявок не подключена. После корректного заполнения выводится «В превью отправка заявок не подключена. Данные не отправлены.». Подключение CRM — отдельная задача интеграции.

Канонические исходники — [barnes-sites/main-site/pages/team](https://github.com/daniilterekh-prog/barnes-sites/tree/main/main-site/pages/team). Эта папка — отдельная передача разработчику, а не второй источник для редактирования страницы. Пять утверждённых узлов и их общие файлы не менялись.
