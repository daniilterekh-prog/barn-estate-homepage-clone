# Страница ЖК BARN Estate — пакет разработчику

Актуальная сборка от 25.11.2026 из согласованного превью `zhk-structure`, включая планировки по присланному референсу, кнопку индивидуальной подборки и дополнительные характеристики в ячейках. Это одна постоянная папка: при правках обновляются она и ZIP, история остаётся в Git.

| Что нужно | Где находится |
| --- | --- |
| Полная страница со всеми подключениями | [html/index.html](html/index.html) |
| Фрагменты для переноса в шаблон | [html/](html/) — файлы `00`–`16`, явно помечены как фрагменты |
| Стили в исходном порядке | [css/](css/) |
| Скрипты, включая Splide | [js/](js/) |
| Фотографии, SVG, локальные шрифты, лицензия Splide | [assets/](assets/) |
| Подключение и действия | [INTEGRATION.md](INTEGRATION.md) |
| Поля Intrum и условный показ | [DATA.md](DATA.md) · [data/](data/) |
| UI-кит и адаптив | [DESIGN.md](DESIGN.md) |
| Источник и преобразования | [SOURCE.json](SOURCE.json) |
| Проверка сборки | [VERIFICATION.json](VERIFICATION.json) |
| Контрольные суммы файлов | [CHECKSUMS.sha256](CHECKSUMS.sha256) |
| Вся папка одним архивом | [zhk-structure-developer.zip](https://raw.githubusercontent.com/daniilterekh-prog/barn-estate-homepage-clone/master/handoff/zhk-structure/zhk-structure-developer.zip) |

Запуск из этой папки:

```bash
python3 -m http.server 8080
```

Открыть `http://localhost:8080/html/index.html`. Сборщик и npm не нужны. Сохранять взаимное расположение `html/`, `css/`, `js/`, `assets/`; корневой `index.html` только перенаправляет на полную страницу.

**Полная страница и фрагменты — альтернативы.** Не добавлять фрагменты повторно в `html/index.html`. Все 14 разделов, хедер, футер, формы и плавающий эксперт уже собраны в полной странице.

Фотографии новостей локализованы из сохранённой главной без изменения байтов. Стили, скрипты, шрифты и изображения не зависят от соседних папок сайта. Яндекс Карта требует сети; внешние переходы на сайт, новости, документы и мессенджеры сохранены.

Это готовая передача визуального шаблона. Intrum API, актуальный каталог квартир и отправка заявок не подключены. Формы показывают «Заявка не отправлена» и телефон; разработчику нужно подключить свой транспорт. Статические форматы квартир и похожие проекты не следует считать актуальным наличием. Подробности — в DATA.md.

[Исходники](https://github.com/daniilterekh-prog/barnes-sites/tree/main/main-site/pages/residential-complex/structure) · [Превью](https://daniilterekh-prog.github.io/barn-estate-homepage-clone/zhk-structure/) · [Открыть пакет](https://daniilterekh-prog.github.io/barn-estate-homepage-clone/handoff/zhk-structure/html/index.html).

Пересборка в каноническом репозитории: `python3 main-site/pages/residential-complex/structure/tools/build-handoff.py`; после проверок — та же команда с `--package`. Затем скопировать готовую папку в `barn-estate-homepage-clone/handoff/zhk-structure/`, проверить, commit + push. Не редактировать защищённые узлы и не смешивать их общие зависимости с локальными файлами этого пакета.
