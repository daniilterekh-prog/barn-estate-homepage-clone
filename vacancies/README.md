# Вакансии BARN Estate

[Открыть страницу на GitHub Pages](https://daniilterekh-prog.github.io/barn-estate-homepage-clone/vacancies/).

Отдельная самостоятельная папка: HTML, CSS, JS, фотографии, SVG и шрифты. Публикация09.11.2026 из [рабочих исходников и проверок](https://github.com/daniilterekh-prog/barnes-sites/tree/codex/vacancies-20261109/main-site/pages/vacancies), commit `e08782b3e3d74285010b283f17e6cb32d84721da`. Побайтовый состав runtime зафиксирован в [SOURCE.json](SOURCE.json).

Содержание — по [старой странице вакансий](https://barn-estate.ru/vacancies/), оформление — действующий кит BARN Estate, hero — по страницам собственников. Три направления и кнопки отклика ведут на исходную страницу работодателя hh.ru. Hero использует реальное фото офиса, нижний CTA — канонические фон и портрет Руслана; [происхождение](assets/cta-provenance.json). Подобранные альтернативные фотографии и генерируемая концепция сохранены отдельно в [исходниках](https://github.com/daniilterekh-prog/barnes-sites/tree/codex/vacancies-20261109/main-site/pages/vacancies/references/team-photos) и здесь не подменяют утверждённую версию.

Это публичное превью: `noindex,nofollow`, canonical указывает на barn-estate.ru. Публикация на GitHub Pages не является установкой на боевой сайт. Общие зависимости и пять финальных узлов не изменялись.

Страница не требует сборки или внешних библиотек. Все необходимые ассеты находятся внутри этой папки. Для локального запуска: `python3 -m http.server 8819 --directory vacancies` из корня репозитория.
