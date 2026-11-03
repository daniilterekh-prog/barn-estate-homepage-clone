# Каталог BARN Estate — передача разработчику

Актуальная согласованная страница на 03.11.2026. Размеры фильтров **возвращены к 17/18/20px**. Карточки объектов сохранены. Это готовая статическая вёрстка и работающий клиентский прототип для переноса на основной сайт.

- [Скачать весь пакет ZIP](https://github.com/daniilterekh-prog/barn-estate-homepage-clone/raw/refs/heads/master/handoff/catalog-2026-11-03/barn-estate-catalog-developer.zip).
- [Открыть самостоятельное превью этой сборки](https://daniilterekh-prog.github.io/barn-estate-homepage-clone/handoff/catalog-2026-11-03/site/?direction=resort&deal=buy).
- [Исходная согласованная страница](https://daniilterekh-prog.github.io/barn-estate-homepage-clone/katalog-nedvizhimosti/?direction=resort&deal=buy&v=20261103-filters-restored).
- Исходник: [`44fffa4`](https://github.com/daniilterekh-prog/barn-estate-homepage-clone/commit/44fffa4960aad57bfa36c2433459acb961c8411b), каталог `katalog-nedvizhimosti/`.

## Быстрый запуск

Скачай ZIP, распакуй и открой терминал в папке `barn-estate-catalog`:

```sh
python3 tools/verify_package.py
python3 -m http.server 8080 --directory site
```

Открой [http://localhost:8080/?direction=resort&deal=buy](http://localhost:8080/?direction=resort&deal=buy). Node/npm и сборщик для запуска страницы не нужны. Запуск через HTTP обязателен: данные читаются через `fetch('objects.json')`.

## Что передаётся

| Путь | Назначение |
| --- | --- |
| [site/](site/) | Полная текущая страница, стили, скрипты, изображения, локальные шрифты, шаблоны и данные |
| [docs/IMPLEMENTATION.md](docs/IMPLEMENTATION.md) | Порядок подключения, модули, перенос на сайт |
| [docs/BEHAVIOR.md](docs/BEHAVIOR.md) | Фильтры, департаменты, URL, мобильная раскладка, карта и избранное |
| [docs/INTEGRATION.md](docs/INTEGRATION.md) | Подключение каталога, CRM/форм и настоящей карты |
| [docs/FONT-SIZES.md](docs/FONT-SIZES.md) | Актуальные размеры шрифтов и насыщенность |
| [verification/](verification/) | Проверка самостоятельного пакета и актуальные контрольные снимки |
| [manifest.json](manifest.json) | Состав `site/`, исходный commit и SHA-256 каждого файла |
| [tools/verify_package.py](tools/verify_package.py) | Проверка комплекта без сторонних пакетов |

## Статус интеграции

Фильтры, сортировка, поиск, избранное, URL, подгрузка карточек, меню, квиз и форма работают на клиенте. В `objects.json` — **37 сохранённых записей для демонстрации**, это не актуальная выгрузка CRM. Заявки в превью не отправляются. Карта — статичный предпросмотр с синхронизированным списком текущей выдачи; координаты объектов не выдуманы. Подключения описаны в `docs/INTEGRATION.md`.

Дизайн исходной страницы при упаковке не менялся. Все файлы в `site/` скопированы побайтно; проверяются manifest и отдельный запуск. Общий кит, историческое происхождение ассетов и уведомления о лицензиях сохранены в `site/kit-v1/sources.json`, `site/kit-sources.json`, `site/reference-shell/sources.json`, `site/map-view/LICENSE.md` и соседних файлах лицензий. Большой архив промежуточных проверок в пакет не входит.
