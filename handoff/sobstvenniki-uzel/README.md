# Собственникам — общий узел · пакет разработчику

**[Скачать ZIP](https://raw.githubusercontent.com/daniilterekh-prog/barn-estate-homepage-clone/master/handoff/sobstvenniki-uzel/sobstvenniki-uzel-developer.zip)** · **[Посмотреть пакет](https://daniilterekh-prog.github.io/barn-estate-homepage-clone/handoff/sobstvenniki-uzel/html/)**

Постоянный комплект текущей страницы «Услуги собственникам недвижимости» от 12.11.2026. Включены семь новых изображений, действующий UI-кит, адаптивный хедер, меню, футер, вкладки преимуществ, пять этапов и окно консультации.

| Что нужно | Где находится |
| --- | --- |
| Полная страница | [html/index.html](html/index.html) |
| Части для CMS, не самостоятельные страницы | [html/head.fragment.html](html/head.fragment.html), [html/body.fragment.html](html/body.fragment.html) |
| Стили | [css/](css/) |
| Контроллеры | [js/](js/) |
| Изображения, SVG, шрифты, лицензии | [assets/](assets/) |
| Атрибуты body, ссылки, источники новых изображений и промпты | [data/](data/) |
| Подключение и форма | [INTEGRATION.md](INTEGRATION.md) |
| Снимки, типографика и геометрия | [DESIGN.md](DESIGN.md), [design/](design/) |
| Происхождение и контрольные суммы runtime | [SOURCE.json](SOURCE.json) |
| Браузерная проверка и визуальное совпадение | [VERIFICATION.json](VERIFICATION.json) |
| Контрольные суммы содержимого ZIP | [CHECKSUMS.json](CHECKSUMS.json) |

Распакуй ZIP, перейди в `sobstvenniki-uzel/`, запусти `python3 -m http.server 8080` и открой `http://localhost:8080/html/index.html`. Сборщик и npm для просмотра не нужны. Все визуальные ресурсы находятся внутри пакета; исходный сайт и приватный GitHub для запуска не требуются.

Форма проверяет поля, согласие и способ связи, но **заявки не отправляются**. Подключение CRM/почты — задача интеграции. Три карточки продажи пока ведут на общую страницу продажи, четвёртая — на аренду; это согласованные временные адреса. Подробности — INTEGRATION.md.

[Текущее превью](https://daniilterekh-prog.github.io/barn-estate-homepage-clone/sobstvenniki-uzel/) · [Канонические исходники](https://github.com/daniilterekh-prog/barnes-sites/tree/main/main-site/pages/owner-hub) · [Оригиналы изображений](https://github.com/daniilterekh-prog/barnes-assets/tree/main/owner-hub/editorial).

Обновлять эту папку и один ZIP на месте. История предыдущих состояний хранится в Git. Происхождение файлов закреплено commit и SHA-256 в SOURCE.json.

Пересборка: задать `BARN_SOURCE_REPO`, `BARN_PUBLIC_REPO`, `BARN_ASSETS_REPO` путями к актуальным checkout, затем `node tools/build.cjs`. Сборщик проверяет совпадение исходников и публичного runtime. Проверки: `python3 tools/check-files.py`, `node tools/verify.cjs` (при серверах исходника и пакета, адреса SOURCE_URL/PACKAGE_URL), затем `python3 tools/archive.py`. JSDOM, Playwright и Sharp нужны только для сборки/проверок; можно задать пути через JSDOM_MODULE, PLAYWRIGHT_MODULE, SHARP_MODULE. Отдельная мобильная проверка — MOBILE.json; иллюстрации блоков лежат в design/.
