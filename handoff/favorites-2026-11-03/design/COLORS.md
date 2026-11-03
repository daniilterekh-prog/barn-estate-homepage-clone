# Цвета, рамки и состояния

| Роль | Значение |
| --- | --- |
| Основной текст | #1e1e1e |
| Вторичный текст | #4f4d49 |
| Метаданные и крошки | #656462 |
| Бордовый акцент | #8b1d25 |
| Белые поверхности | #fff |
| Разделители | #e4e4e4 |

## Фактически измеренные свойства

| Свойство | Значение | Примеры селекторов |
| --- | --- | --- |
| color | `rgb(101, 100, 98)` | `.catalog-mode-switch__button`, `.catalog-mode-switch__button span`, `.favorites-bottom>p`, `.favorites-breadcrumbs`, `.favorites-breadcrumbs [aria-hidden]` |
| color | `rgb(101, 113, 122)` | `.apartment-card__address` |
| color | `rgb(102, 102, 102)` | `.home-owner-form input`, `.home-owner-form__consent` |
| color | `rgb(120, 128, 138)` | `.apartment-card__lotid` |
| color | `rgb(139, 29, 37)` | `.catalog-mode-switch__button`, `.catalog-mode-switch__button span`, `.site-header__nav-link`, `.site-header__request` |
| color | `rgb(255, 255, 255)` | `.apartment-card__detail-btn`, `.favorites-empty a`, `.home-owner-form__submit`, `.site-footer`, `.site-footer__callback-btn` |
| color | `rgb(30, 30, 30)` | `.apartment-card`, `.apartment-card__body`, `.apartment-card__call-btn`, `.apartment-card__image`, `.apartment-card__name-text` |
| color | `rgb(79, 77, 73)` | `.favorites-empty p` |
| color | `rgba(255, 255, 255, 0.8)` | `.site-footer__copyright` |
| backgroundColor | `rgb(117, 23, 30)` | `.home-owner-form__submit` |
| backgroundColor | `rgb(139, 29, 37)` | `.apartment-card__detail-btn`, `.favorites-empty a`, `.home-owner-form__submit`, `[data-favorites-total]` |
| backgroundColor | `rgb(255, 255, 255)` | `.apartment-card`, `.apartment-card__body`, `.apartment-card__call-btn`, `.catalog-header-dropdown`, `.catalog-mode-switch` |
| backgroundColor | `rgb(38, 38, 38)` | `.site-footer` |
| backgroundColor | `rgba(0, 0, 0, 0)` | `.apartment-card__address`, `.apartment-card__image`, `.apartment-card__lotid`, `.apartment-card__name-text`, `.apartment-card__price` |
| border | `` | `.apartment-card__price`, `.favorites-bottom`, `.favorites-toolbar`, `.home-owner-form input`, `.site-footer__inner` |
| border | `0px none rgb(101, 100, 98)` | `.catalog-mode-switch__button`, `.catalog-mode-switch__button span`, `.favorites-bottom>p`, `.favorites-breadcrumbs`, `.favorites-breadcrumbs [aria-hidden]` |
| border | `0px none rgb(101, 113, 122)` | `.apartment-card__address` |
| border | `0px none rgb(102, 102, 102)` | `.home-owner-form input`, `.home-owner-form__consent` |
| border | `0px none rgb(120, 128, 138)` | `.apartment-card__lotid` |
| border | `0px none rgb(139, 29, 37)` | `.catalog-mode-switch__button`, `.catalog-mode-switch__button span`, `.site-header__nav-link` |
| border | `0px none rgb(255, 255, 255)` | `.site-footer`, `.site-footer__inner`, `[data-favorites-total]` |
| border | `0px none rgb(30, 30, 30)` | `.apartment-card`, `.apartment-card__body`, `.apartment-card__image`, `.apartment-card__name-text`, `.apartment-card__price` |
| border | `0px none rgb(79, 77, 73)` | `.favorites-empty p` |
| border | `0px none rgba(255, 255, 255, 0.8)` | `.site-footer__copyright` |
| border | `1px solid rgb(117, 23, 30)` | `.home-owner-form__submit` |
| border | `1px solid rgb(139, 29, 37)` | `.apartment-card__detail-btn`, `.favorites-empty a`, `.home-owner-form__submit`, `.site-header__request` |
| border | `1px solid rgb(183, 181, 178)` | `.home-quiz__option` |
| border | `1px solid rgb(228, 228, 228)` | `.catalog-header-dropdown`, `.favorites-empty` |
| border | `1px solid rgba(255, 255, 255, 0.7)` | `.site-footer__callback-btn` |
| border | `1px solid rgba(30, 30, 30, 0.12)` | `.favorites-continue` |
| border | `1px solid rgba(30, 30, 30, 0.22)` | `.apartment-card__call-btn` |
| border | `2px inset rgb(118, 118, 118)` | `.home-owner-form input` |
| borderRadius | `0px` | `.apartment-card`, `.apartment-card__address`, `.apartment-card__body`, `.apartment-card__call-btn`, `.apartment-card__detail-btn` |
| borderRadius | `1px` | `.catalog-header-dropdown`, `.favorites-continue`, `.favorites-empty a`, `.home-owner-form__submit`, `.home-quiz__option` |
| borderRadius | `999px` | `[data-favorites-total]` |
| boxShadow | `none` | `.apartment-card`, `.apartment-card__address`, `.apartment-card__body`, `.apartment-card__call-btn`, `.apartment-card__detail-btn` |
| boxShadow | `rgba(0, 0, 0, 0.08) 0px 4px 24px 0px` | `.site-header` |
| boxShadow | `rgba(0, 0, 0, 0.08) 0px 8px 24px 0px` | `.catalog-header-dropdown` |

Иконки и фотографии сохраняют исходные цвета. SVG с currentColor наследуют цвет текста. Клавиатурный focus: бордовый outline2px. Поведение и цвета hover/selected определены в отдельных CSS; статический JSON не подменяет эти состояния.
