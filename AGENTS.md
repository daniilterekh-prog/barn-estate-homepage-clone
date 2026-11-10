# Five primary nodes are final and immutable

The user explicitly finalized these pages on 2026-11-06 and prohibited further changes:
`gorodskaya-nedvizhimost/`, `kommercheskaya-nedvizhimost/`, `zagorodnaya-nedvizhimost/`, `mezhdunarodnaya-nedvizhimost/`, `kurortnaya/`.

Their approved files and shared dependencies match commit `dd0cba9a0f5d11ead9e9f56451bb40e3a730def7` exactly. `FINAL-NODES.json` records their Git blob hashes. CI rejects changed final files before deployment.

Do not modify, regenerate, resynchronize, restyle or replace these files or their existing shared dependencies. Work on internal pages is not authorization to change the primary nodes. Changed components and controllers for other pages must be isolated outside the protected packages and shared paths. Do not alter the lock or disable its test without a new explicit user instruction revoking this finalization.

Source policy: `barnes-sites/main-site/AGENTS.md` and `FINAL-NODES.md`. This public repository is the deployed export; preserve the source-of-truth workflow.

## Постоянные папки передачи разработчику · правило пользователя10.11.2026

- Готовые пакеты страниц хранить в `handoff/<slug>/` того же согласованного GitHub-репозитория, где находится публичное превью. Для «Контактов» BARN Estate: `daniilterekh-prog/barn-estate-homepage-clone/handoff/contacts/`.
- Канонические исходники BARN Estate остаются в `barnes-sites/main-site/pages/<slug>/`, готовый пакет — в `barnes-sites/main-site/handoff/<slug>/`.
- В пакете — отдельные `html/`, `css/`, `js/`, `assets/`, необходимые данные, README с подключением и один актуальный ZIP. Полная страница и HTML-фрагменты должны быть явно подписаны.
- Обновлять одну постоянную папку и ZIP на месте после согласованных изменений. Не создавать рядом новые датированные копии, `old`, `v2`, `final-final` и архивы прежних вариантов. История — в Git; действующие исходники и готовый экспорт не смешивать.
- Перед передачей проверить пути, самостоятельный запуск, соответствие текущей странице, мобильный вид и необходимые действия, затем commit + push. Пользователю дать прямые ссылки на папку и ZIP.
- Существующие передачи других страниц не переносить массово без поручения; применять правило при их следующем согласованном обновлении. Правило не разрешает создавать публичные репозитории или менять защищённые финальные страницы.
