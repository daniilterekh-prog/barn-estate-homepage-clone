# Каноническая библиотека блоков BARNES

Репозиторий: [daniilterekh-prog/barnes-assets](https://github.com/daniilterekh-prog/barnes-assets).

- [Каталог для просмотра](https://daniilterekh-prog.github.io/barnes-assets/blocks/).
- [Код блоков](https://github.com/daniilterekh-prog/barnes-assets/tree/main/blocks).
- [UI Kit](https://github.com/daniilterekh-prog/barnes-assets/tree/main/ui-kit).

Исходные аренда и продажа сохранены в своих route-папках этого репозитория. В библиотеку вынесены rendered reference-шаблоны, без зависимостей от всей исходной страницы и Nuxt. Стили ограничены `.barnes-template`, поведение находится в portable-адаптере. Это не автоматическая синхронизация библиотека → страницы.

При задаче «возьми блок» сначала найти его в каталоге, выбрать rent/sale, прочитать block.json и README.md, перенести fragment/styles и только необходимые `_assets`, подключить initBlock. Исправить ссылки, данные эксперта, CTA, якоря и asset URLs. Для запросов использовать текущую форму через onRequest; реальную отправку подключать через onSubmit. Проверять desktop/mobile, клавиатуру, overflow и reduced-motion.

Оригинальные модальные изображения, промежуточные генерированные варианты и большие наборы ассетов не копировать без необходимости. Изображения библиотеки — хэшированные delivery-копии, их происхождение отмечено в UI Kit.
