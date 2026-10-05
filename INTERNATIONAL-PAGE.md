# Копия страницы зарубежной недвижимости

Канонический источник: <https://barn-estate.ru/mezhdunarodnaya-nedvizhimost/>.

Страница изолирована от главной:

- маршрут: `/mezhdunarodnaya-nedvizhimost/`;
- HTML: `mezhdunarodnaya-nedvizhimost/index.html`;
- локальный статический fallback: `international.html`;
- отдельные вспомогательные стили и интеракции fallback: `international.css`, `international.js`;
- `_nuxt/` содержит только захваченный runtime исходной страницы, который нужен для SSR-гидрации каталога.

Фотографии объектов оставлены на тех же CDN-URL, что и у источника, чтобы сохранить их точное содержимое и кадрирование. Общие Barnes-ассеты сверены с каноническим репозиторием `daniilterekh-prog/barnes-assets`.
