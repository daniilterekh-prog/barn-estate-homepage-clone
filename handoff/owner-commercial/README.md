# Собственники — коммерция · пакет разработчику

[Скачать ZIP](https://raw.githubusercontent.com/daniilterekh-prog/barn-estate-homepage-clone/master/handoff/owner-commercial/owner-commercial-developer.zip) · [Посмотреть пакет](https://daniilterekh-prog.github.io/barn-estate-homepage-clone/handoff/owner-commercial/html/index.html)

Актуальная коммерческая страница от 27.11.2026: согласованный порядок блоков и отступы, «Единая команда BARN Estate», CTA с последним фото Алины, четыре направления с изображениями референса, FAQ из узловых страниц покупки, рассылка и актуальный футер. В нижней правой карточке сохранён полный круглый аватар без увеличения. Растровые изображения — WebP, векторные знаки и иконки — SVG.

| Содержимое | Путь |
| --- | --- |
| Полная самостоятельная страница | [html/index.html](html/index.html) |
| Фрагменты для CMS, не самостоятельные страницы | [html/head.fragment.html](html/head.fragment.html), [html/body.fragment.html](html/body.fragment.html) |
| Стили, порядок подключения сохранён в HTML | [css/](css/) |
| Скрипты и контроллеры | [js/](js/) |
| Изображения, шрифты, SVG | [assets/](assets/) |
| Тексты, ссылки, атрибуты body, происхождение фото | [data/](data/) |
| Подключение, формы и маршруты | [INTEGRATION.md](INTEGRATION.md) |
| Дизайн и снимки страницы | [DESIGN.md](DESIGN.md), [design/](design/) |
| Источники и контрольные суммы | [SOURCE.json](SOURCE.json), [CHECKSUMS.json](CHECKSUMS.json) |
| Результаты проверок | [VERIFICATION.json](VERIFICATION.json) |

Распакуй архив, открой папку `owner-commercial`, запусти `python3 -m http.server 8080` и перейди на `http://localhost:8080/html/index.html`. Установка npm и доступ к приватным репозиториям для просмотра не нужны. Все ресурсы страницы находятся внутри пакета.

Формы проверяют ввод и согласие, но заявки и подписка в превью **не отправляются**. Подключение CRM/почты описано в INTEGRATION.md.

[Текущая страница](https://daniilterekh-prog.github.io/barn-estate-homepage-clone/собственники%20коммерция/) · [Канонические исходники](https://github.com/daniilterekh-prog/barnes-sites/tree/main/main-site/pages/собственники%20коммерция) · [Канонические ассеты](https://github.com/daniilterekh-prog/barnes-assets/tree/main/owner-commercial).

Папку и один ZIP обновлять на месте; история — в Git. Восстановление экспорта: задать пути BARN_SOURCE_REPO, BARN_PUBLIC_REPO, BARN_ASSETS_REPO, затем `node tools/build.cjs`; статическая проверка — `python3 tools/check-files.py`; архив — `python3 tools/archive.py`. Инструменты сборки используют JSDOM, браузерные проверки — Playwright и Sharp; пути модулей можно задать через JSDOM_MODULE, PLAYWRIGHT_MODULE, SHARP_MODULE. Для работы страницы они не нужны. Сборщик переиспользован из согласованного пакета `handoff/sobstvenniki-zagorod/`, без новых runtime-библиотек.
