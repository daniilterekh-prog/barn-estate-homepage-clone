# Цвета, рамки и состояния

| Назначение | Значение |
| --- | --- |
| Белый фон страницы, полей и карточек | `#FFFFFF` |
| Основной текст | `#1E1E1E` |
| Текст фильтров и вторичный текст | `#4F4D49` |
| Подписи, ID, хлебные крошки, placeholder | `#656462` |
| Бордовый акцент, выбранная половина покупки/аренды | `#8B1D25` |
| Текст выбранной половины покупки/аренды | `#FFFFFF` |
| Контур полей | `#8B8986`, 1px solid |
| Разделители полей и светлые рамки | `#E4E4E4`, 1px solid |
| Светлое выделение выбранного условия / варианта | `#F9F3F3` |
| Наведение на поле или вариант | `#F7F7F7` |
| Клавиатурный focus | outline 2px `#8B1D25`, offset 3px; у ссылок меню offset 2px |
| Нижняя линия белого хедера | `rgba(30,30,30,0.1)`; при открытом меню `rgba(30,30,30,0.12)` |
| Тень выпадающего меню хедера | `0 8px 24px rgba(0,0,0,0.08)` |
| Тень обычного dropdown | `0 8px 24px rgba(30,30,30,0.04)` |

Ниже перечислены фактически снятые цвета/рамки/тени, включая формы, карту, меню и состояния. Цвета официальных иконок находятся в SVG в `code/assets/images/`; цвет `currentColor` наследуется от элемента. Фотографии не перекрашиваются.

## Текст

| Значение | Где используется, примеры селекторов |
| --- | --- |
| `rgb(0, 0, 0)` | `.floating-expert__avatar` |
| `rgb(101, 100, 98)` | `.catalog-breadcrumbs`, `.catalog-pagination-count`, `.catalog-result-summary`, `.catalog-text-search`, `.catalog-text-search svg`, `article.map-browser__card > address` |
| `rgb(102, 102, 102)` | `.home-owner-form__consent-box` |
| `rgb(139, 29, 37)` | `.catalog-active-filter`, `.catalog-grid__more`, `.catalog-map-trigger`, `.catalog-map-trigger svg`, `.catalog-mode-detailed-filters`, `.catalog-quick-filters__option.is-selected` |
| `rgb(147, 31, 43)` | `a > h3` |
| `rgb(153, 153, 153)` | `div.map-browser__zoom > button` |
| `rgb(221, 221, 221)` | `.ui-checkbox__box` |
| `rgb(247, 247, 245)` | `.resort-filters` |
| `rgb(255, 255, 255)` | `.catalog-mode-switch__button.is-active`, `.home-owner-form__submit`, `.site-footer`, `.site-footer__column`, `.site-footer__inner`, `.site-footer__logo img` |
| `rgb(30, 30, 30)` | `#catalog-search`, `.apartment-card`, `.apartment-card__actions`, `.apartment-card__body`, `.apartment-card__favorite`, `.apartment-card__image` |
| `rgb(79, 77, 73)` | `.catalog-grid__sort`, `.catalog-mode-switch__button:not(.is-active)`, `.catalog-quick-filters__button`, `.catalog-quick-filters__dropdown-header`, `.catalog-quick-filters__options`, `.map-browser__field` |
| `rgba(255, 255, 255, 0.8)` | `div.site-footer__contacts > a.site-footer__email`, `div.site-footer__contacts > p.site-footer__address`, `div.site-footer__contacts > p.site-footer__hours`, `div.site-footer__meta > a.site-footer__privacy`, `div.site-footer__meta > p.site-footer__copyright`, `li > a.site-footer__link` |

## Фоны

| Значение | Где используется, примеры селекторов |
| --- | --- |
| `rgb(117, 23, 30)` | `.home-owner-form__submit`, `form.home-owner-form__form > button.home-owner-button.home-owner-button--primary.home-owner-button--large.home-owner-button--full.home-owner-form__submit` |
| `rgb(139, 29, 37)` | `.catalog-mode-switch__button.is-active`, `.home-owner-form__submit`, `a.site-header__favorites-btn > span.site-header__favorites-count`, `button.catalog-mode-detailed-filters > span.catalog-filter-count`, `div.apartment-card__actions > a.ui-button.ui-button--primary.ui-button--medium.apartment-card__detail-btn`, `div.catalog-empty > button.ui-button.ui-button--primary.ui-button--medium` |
| `rgb(238, 230, 219)` | `.home-owner-form__hero` |
| `rgb(239, 237, 235)` | `section.home-quiz__panel > button.home-quiz__next` |
| `rgb(239, 239, 239)` | `div.home-quiz__summary > button` |
| `rgb(241, 241, 241)` | `.map-browser` |
| `rgb(243, 241, 236)` | `.floating-expert__avatar` |
| `rgb(247, 247, 247)` | `.catalog-mode-switch__button:not(.is-active)`, `div.catalog-mode-switch > button.catalog-mode-switch__button` |
| `rgb(249, 243, 243)` | `.catalog-active-filter`, `.catalog-quick-filters__option.is-selected`, `.ui-checkbox--chip:has(input:checked)`, `div.catalog-quick-filters__options > button.catalog-quick-filters__option`, `div.home-owner-form__channels > button` |
| `rgb(255, 255, 255)` | `.apartment-card`, `.apartment-card__body`, `.apartment-card__favorite`, `.catalog-direction`, `.catalog-header-dropdown`, `.catalog-map-trigger` |
| `rgb(38, 38, 38)` | `.site-footer` |
| `rgba(0, 0, 0, 0)` | `#catalog-search`, `.apartment-card__actions`, `.apartment-card__image`, `.base-container`, `.catalog-breadcrumbs`, `.catalog-collections-row` |

## Цвета рамок

| Значение | Где используется, примеры селекторов |
| --- | --- |
| `rgb(0, 0, 0)` | `.floating-expert__avatar`, `div.home-quiz__summary > button` |
| `rgb(101, 100, 98)` | `.catalog-breadcrumbs`, `.catalog-pagination-count`, `.catalog-result-summary`, `.catalog-text-search svg`, `article.map-browser__card > address`, `div.apartment-card__body > p.apartment-card__address` |
| `rgb(117, 23, 30)` | `.home-owner-form__submit`, `form.home-owner-form__form > button.home-owner-button.home-owner-button--primary.home-owner-button--large.home-owner-button--full.home-owner-form__submit` |
| `rgb(118, 118, 118)` | `div.home-owner-form__honeypot > input` |
| `rgb(139, 137, 134)` | `.catalog-direction`, `.catalog-mode-detailed-filters`, `.catalog-mode-filters`, `.catalog-mode-switch`, `.catalog-text-search`, `.hero-filter-panel-content__range-input` |
| `rgb(139, 137, 134) rgb(101, 100, 98) rgb(139, 137, 134) rgb(139, 137, 134)` | `.catalog-text-search` |
| `rgb(139, 29, 37)` | `.catalog-grid__more`, `.catalog-map-trigger`, `.catalog-map-trigger svg`, `.catalog-mode-detailed-filters`, `.catalog-quick-filters__option.is-selected`, `.catalog-text-search` |
| `rgb(147, 31, 43)` | `a > h3` |
| `rgb(153, 153, 153)` | `div.map-browser__zoom > button` |
| `rgb(183, 181, 178)` | `.home-quiz__option`, `div.home-quiz__options > button.home-quiz__option` |
| `rgb(222, 222, 222)` | `.map-browser__close` |
| `rgb(228, 228, 228)` | `.catalog-header-dropdown`, `.floating-expert`, `.hero-filter-modal__body`, `.hero-filter-modal__footer`, `.hero-filter-modal__header`, `.hero-filter-panel-content__group` |
| `rgb(228, 228, 228) rgb(153, 153, 153) rgb(153, 153, 153)` | `div.map-browser__zoom > button` |
| `rgb(228, 228, 228) rgb(30, 30, 30)` | `.catalog-empty` |
| `rgb(228, 228, 228) rgb(30, 30, 30) rgb(30, 30, 30)` | `.catalog-quick-filters__item` |
| `rgb(247, 247, 245)` | `.resort-filters` |
| `rgb(255, 255, 255)` | `.catalog-mode-switch__button.is-active`, `.site-footer`, `.site-footer__column`, `.site-footer__inner`, `.site-footer__logo img`, `.site-header__messenger` |
| `rgb(255, 255, 255) rgba(255, 255, 255, 0.3)` | `.site-footer__inner` |
| `rgb(30, 30, 30)` | `#catalog-search`, `.apartment-card`, `.apartment-card__actions`, `.apartment-card__body`, `.apartment-card__image`, `.base-container` |
| `rgb(30, 30, 30) rgb(30, 30, 30) rgb(204, 204, 204)` | `.home-owner-form__input`, `label > input`, `label.home-owner-form__field > input.home-owner-form__input` |
| `rgb(30, 30, 30) rgb(30, 30, 30) rgb(222, 222, 222)` | `.map-browser__card` |
| `rgb(30, 30, 30) rgb(30, 30, 30) rgb(30, 30, 30) rgb(228, 228, 228)` | `.catalog-quick-filters__item` |
| `rgb(30, 30, 30) rgb(30, 30, 30) rgba(30, 30, 30, 0.1)` | `.site-header__top` |
| `rgb(30, 30, 30) rgb(30, 30, 30) rgba(30, 30, 30, 0.12)` | `.site-header__top` |
| `rgb(79, 77, 73)` | `.catalog-grid__sort`, `.catalog-mode-switch__button:not(.is-active)`, `.catalog-quick-filters__button`, `.catalog-quick-filters__options`, `div.catalog-empty > p`, `div.catalog-mode-switch > button.catalog-mode-switch__button` |
| `rgb(79, 77, 73) rgb(79, 77, 73) rgb(228, 228, 228)` | `.catalog-quick-filters__dropdown-header`, `.map-browser__field`, `.map-browser__search` |
| `rgb(79, 77, 73) rgb(79, 77, 73) rgba(0, 0, 0, 0)` | `div.map-browser__market > button` |
| `rgba(0, 0, 0, 0)` | `.catalog-active-filter`, `div.catalog-quick-filters__options > button.catalog-quick-filters__option` |
| `rgba(255, 255, 255, 0.7)` | `div.site-footer__meta > button.site-footer__callback-btn` |
| `rgba(255, 255, 255, 0.8)` | `div.site-footer__contacts > a.site-footer__email`, `div.site-footer__contacts > p.site-footer__address`, `div.site-footer__contacts > p.site-footer__hours`, `div.site-footer__meta > a.site-footer__privacy`, `div.site-footer__meta > p.site-footer__copyright`, `li > a.site-footer__link` |
| `rgba(30, 30, 30, 0.16)` | `.apartment-card__favorite` |
| `rgba(30, 30, 30, 0.18) rgb(30, 30, 30) rgb(30, 30, 30)` | `div.apartment-card__body > p.apartment-card__price` |
| `rgba(30, 30, 30, 0.22)` | `div.apartment-card__actions > button.ui-button.ui-button--secondary.ui-button--medium.apartment-card__call-btn` |
| `rgba(30, 30, 30, 0.28)` | `.home-owner-form__consent-box` |

## Толщина рамок

| Значение | Где используется, примеры селекторов |
| --- | --- |
| `0px` | `#catalog-search`, `.apartment-card`, `.apartment-card__actions`, `.apartment-card__body`, `.apartment-card__image`, `.base-container` |
| `0px 0px 0px 1px` | `.catalog-quick-filters__item` |
| `0px 0px 0px 2px` | `div.hero-filter-modal__body > p.resort-filters__error` |
| `0px 0px 1px` | `.catalog-grid__more`, `.catalog-quick-filters__dropdown-header`, `.hero-filter-modal__header`, `.hero-filter-panel-content__group`, `.home-owner-form__input`, `.map-browser__card` |
| `0px 1px` | `.site-footer__inner` |
| `1px` | `.apartment-card__favorite`, `.catalog-active-filter`, `.catalog-direction`, `.catalog-header-dropdown`, `.catalog-map-trigger`, `.catalog-mode-detailed-filters` |
| `1px 0px` | `.catalog-empty` |
| `1px 0px 0px` | `.catalog-quick-filters__item`, `.hero-filter-modal__footer`, `div.apartment-card__body > p.apartment-card__price`, `div.map-browser__zoom > button` |
| `1px 0px 1px 1px` | `.catalog-text-search` |
| `2px` | `div.home-owner-form__honeypot > input`, `div.home-quiz__summary > button` |

## Скругления

| Значение | Где используется, примеры селекторов |
| --- | --- |
| `0px` | `#catalog-search`, `.apartment-card`, `.apartment-card__actions`, `.apartment-card__body`, `.apartment-card__image`, `.base-container` |
| `1px` | `.catalog-active-filter`, `.catalog-direction`, `.catalog-header-dropdown`, `.catalog-map-trigger`, `.catalog-mode-detailed-filters`, `.catalog-mode-filters` |
| `2px` | `.home-owner-form__consent-box`, `.ui-checkbox__box` |
| `3px` | `div.catalog-empty > button.ui-button.ui-button--primary.ui-button--medium` |
| `50%` | `.apartment-card__favorite`, `.floating-expert__avatar` |
| `999px` | `a.site-header__favorites-btn > span.site-header__favorites-count` |

## Тени

| Значение | Где используется, примеры селекторов |
| --- | --- |
| `rgba(0, 0, 0, 0.08) 0px 4px 24px 0px` | `.site-header` |
| `rgba(0, 0, 0, 0.08) 0px 8px 24px 0px` | `.catalog-header-dropdown` |
| `rgba(30, 30, 30, 0.04) 0px 8px 24px 0px` | `.resort-quick-dropdown` |

## Outline

| Значение | Где используется, примеры селекторов |
| --- | --- |
| `rgb(0, 0, 0) none 3px` | `.floating-expert__avatar` |
| `rgb(101, 100, 98) none 3px` | `.catalog-breadcrumbs`, `.catalog-pagination-count`, `.catalog-result-summary`, `.catalog-text-search`, `.catalog-text-search svg`, `article.map-browser__card > address` |
| `rgb(102, 102, 102) none 3px` | `.home-owner-form__consent-box` |
| `rgb(139, 29, 37) none 3px` | `.catalog-active-filter`, `.catalog-grid__more`, `.catalog-map-trigger`, `.catalog-map-trigger svg`, `.catalog-mode-detailed-filters`, `.catalog-quick-filters__option.is-selected` |
| `rgb(139, 29, 37) solid 2px` | `#catalog-search`, `.catalog-mode-switch__button:not(.is-active)`, `.hero-filter-panel-content__range-input`, `div.catalog-mode-switch > button.catalog-mode-switch__button`, `div.hero-filter-panel-content__range > input.hero-filter-panel-content__range-input`, `label > input` |
| `rgb(147, 31, 43) none 3px` | `a > h3` |
| `rgb(153, 153, 153) none 3px` | `div.map-browser__zoom > button` |
| `rgb(221, 221, 221) none 3px` | `.ui-checkbox__box` |
| `rgb(247, 247, 245) none 3px` | `.resort-filters` |
| `rgb(255, 255, 255) none 3px` | `.catalog-mode-switch__button.is-active`, `.home-owner-form__submit`, `.site-footer`, `.site-footer__column`, `.site-footer__inner`, `.site-footer__logo img` |
| `rgb(30, 30, 30) none 3px` | `#catalog-search`, `.apartment-card`, `.apartment-card__actions`, `.apartment-card__body`, `.apartment-card__favorite`, `.apartment-card__image` |
| `rgb(79, 77, 73) none 3px` | `.catalog-grid__sort`, `.catalog-mode-switch__button:not(.is-active)`, `.catalog-quick-filters__button`, `.catalog-quick-filters__dropdown-header`, `.catalog-quick-filters__options`, `.map-browser__field` |
| `rgba(255, 255, 255, 0.8) none 3px` | `div.site-footer__contacts > a.site-footer__email`, `div.site-footer__contacts > p.site-footer__address`, `div.site-footer__contacts > p.site-footer__hours`, `div.site-footer__meta > a.site-footer__privacy`, `div.site-footer__meta > p.site-footer__copyright`, `li > a.site-footer__link` |

## SVG fill

| Значение | Где используется, примеры селекторов |
| --- | --- |
| `rgb(0, 0, 0)` | `#catalog-search`, `.apartment-card`, `.apartment-card__actions`, `.apartment-card__body`, `.apartment-card__favorite`, `.apartment-card__image` |

## SVG stroke

| Значение | Где используется, примеры селекторов |
| --- | --- |
| `rgb(139, 29, 37)` | `.catalog-map-trigger svg` |

