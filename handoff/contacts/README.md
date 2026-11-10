# Контакты BARN Estate — пакет разработчику

Актуальная версия от10.11.2026. Одна готовая папка с раздельными HTML, CSS, JavaScript и ассетами; старые варианты в неё не входят.

| Что нужно | Файл или папка |
| --- | --- |
| Полная страница | [html/index.html](html/index.html) |
| HTML и фрагменты для шаблона | [html/](html/) |
| Стили | [css/](css/) |
| JavaScript | [js/](js/) |
| SVG, шрифты, лицензии | [assets/](assets/) |
| Данные и их источники | [data/content-sources.json](data/content-sources.json) |
| Подключение | [INTEGRATION.md](INTEGRATION.md) |
| Типографика, цвета, отступы, поведение и снимки | [design/](design/) |
| Проверка пакета | [VERIFICATION.json](VERIFICATION.json) |
| Происхождение файлов | [SOURCE.json](SOURCE.json) |
| Скачать всю папку | [contacts-developer.zip](https://raw.githubusercontent.com/daniilterekh-prog/barn-estate-homepage-clone/master/handoff/contacts/contacts-developer.zip) |

Запуск из этой папки: `python3 -m http.server 8080`, затем открыть `http://localhost:8080/html/index.html`. Сборщик и npm не нужны. Сохраняй взаимное расположение html/, css/, js/ и assets/.

Полная страница уже подключает всё в правильном порядке. Четыре HTML-фрагмента предназначены для переноса в шаблон; их не нужно повторно добавлять к полной странице. Карты — внешний iframe Яндекса. Диалог содержит ссылки для связи, отправки в CRM нет.

Состояние: белый верх без херо; три офиса и способы связи в едином блоке; Петербург — наб. реки Мойки,59, БЦ «Сенатор», пом.307; мобильные вкладки слева, промежутки до16px; стрелки кнопок SVG, под картами стрелок нет. Шрифты и SVG локальные.

[Рабочие исходники](https://github.com/daniilterekh-prog/barnes-sites/tree/main/main-site/pages/contacts) · [Превью](https://daniilterekh-prog.github.io/barn-estate-homepage-clone/contacts/).

Эта папка обновляется на месте после согласованных правок. Датированные копии и архив старых вариантов не создаются; история хранится в Git. Правило: [передача разработчику](RULES.md).

Пересборка из канонического репозитория: `python3 main-site/handoff/contacts/tools/build.py`, затем `node main-site/handoff/contacts/tools/verify.cjs` при работающих локальных серверах и `python3 main-site/handoff/contacts/tools/package.py`. Перед передачей проверять ZIP и его контрольные суммы. Установленные проверочные инструменты не являются зависимостями страницы.
