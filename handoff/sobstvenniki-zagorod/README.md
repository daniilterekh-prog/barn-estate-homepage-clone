# Собственники — загород · пакет разработчику

[Скачать ZIP](https://raw.githubusercontent.com/daniilterekh-prog/barn-estate-homepage-clone/master/handoff/sobstvenniki-zagorod/sobstvenniki-zagorod-developer.zip) · [Посмотреть пакет](https://daniilterekh-prog.github.io/barn-estate-homepage-clone/handoff/sobstvenniki-zagorod/html/index.html)

Актуальная страница от27.11.2026: загородные тексты и иллюстрации, рассылка и четыре направления по референсу, CTA с Еленой справа и формой слева без подписей имени/должности, новый аватар в карточке справа снизу. Все растровые изображения WebP, векторные знаки и иконки SVG.

| Содержимое | Путь |
| --- | --- |
| Полная самостоятельная страница | [html/index.html](html/index.html) |
| Части для CMS, не самостоятельные страницы | [html/head.fragment.html](html/head.fragment.html), [html/body.fragment.html](html/body.fragment.html) |
| Стили в исходном порядке | [css/](css/) |
| Скрипты | [js/](js/) |
| Изображения, шрифты, SVG | [assets/](assets/) |
| Тексты, body-атрибуты, ссылки и происхождение фото | [data/](data/) |
| Подключение и формы | [INTEGRATION.md](INTEGRATION.md) |
| Источники и контрольные суммы | [SOURCE.json](SOURCE.json), [CHECKSUMS.json](CHECKSUMS.json) |
| Вид страницы на телефоне и компьютере | [design/](design/) |
| Проверки | [VERIFICATION.json](VERIFICATION.json) |

Распакуй ZIP, открой папку `sobstvenniki-zagorod`, запусти `python3 -m http.server 8080` и перейди на `http://localhost:8080/html/index.html`. Сборщик, npm и приватный GitHub для просмотра не нужны. Все визуальные ресурсы находятся внутри пакета.

Формы проверяют ввод и согласие, но заявки и подписка в этом превью **не отправляются**. Подключение CRM/почты — задача интеграции, описанная в INTEGRATION.md.

[Текущая страница](https://daniilterekh-prog.github.io/barn-estate-homepage-clone/sobstvenniki-zagorod/) · [Канонические исходники](https://github.com/daniilterekh-prog/barnes-sites/tree/main/main-site/pages/собственники%20загород) · [Библиотека ассетов](https://github.com/daniilterekh-prog/barnes-assets/tree/main/owner-country).

Эту папку и один ZIP обновлять на месте. Предыдущие версии хранятся в Git. Сборка: задать BARN_SOURCE_REPO, BARN_PUBLIC_REPO и BARN_ASSETS_REPO, затем `node tools/build.cjs`; проверка файлов — `python3 tools/check-files.py`; архив — `python3 tools/archive.py`. Инструменты сборки используют установленный JSDOM/Playwright/Sharp, пути можно задать через JSDOM_MODULE/PLAYWRIGHT_MODULE/SHARP_MODULE. Для работы самой страницы эти инструменты не нужны.
