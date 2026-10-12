# Проверка после упаковки

- `package.json`: 44 браузерные проверки. Целая папка обслуживалась как корень отдельного HTTP-сервера, без остальных страниц; 8 ширин 320–2560 px, 18 отдельных компонентов × 2 ширины. Нет внешних render-зависимостей, 404, сломанных изображений, JS-ошибок и overflow.
- `design-parity.json`: 60 ролей на 390/768/1366/1920/2560 px. Font family/size/weight, line-height, letter-spacing, color, radius, padding, margin и min-height совпали с замерами до упаковки (`8251b17`).
- `shared-map.json`: standalone map использует тот же JS, 32 локальных изображения, полный фильтр справа/на весь экран mobile, корректное закрытие.
- `cleanup.json`: удалённые старые пути, дубли контроллеров и число удалённых неиспользуемых scoped CSS-правил. Все исторические версии восстанавливаются из Git.

Дополнительно выполнены штатные `scripts/verify-kurort-{hero-images,cta-channels,quick-filters,filters,required-market,sort-dropdown,mobile-header-actions,footer-hover}.cjs`. Проверены три входа в фильтры, state/reset/keyboard, обязательный рынок, CTA MAX/Telegram, заявка и хэдер mobile. Футер совпал с собственниками продажи на 320/390/768/1440/1920/2560 px; 136–138 применимых hover-правил без жёлтого/золотого. Тест ждёт загрузки динамического CSS, чтобы не замерять промежуточные цвета CSS transition.

`node tools/build-page.cjs --check`, syntax checks JS и `git diff --check` прошли. Мобильное изображение неизменно: SHA256 `1bc33f36c257ab4c1a9a743627ebdf7424291f88c2da104e34f8236786c00f2e`.

Тесты не подтверждают работу backend-заявок или живого API карты: они не подключены и не входят в эту упаковку.
