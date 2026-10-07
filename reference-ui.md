# Homepage Reference UI

## Status

**REFERENCE / LOCKED — HOMEPAGE ONLY**

This document defines the locked reference UI system for the BARNES Moscow homepage only. It is not the final global UI Kit and must not be applied automatically to other pages.

Reference state: the current homepage decisions are fixed as the working reference for the next implementation steps. This does not claim that every audit issue is fixed and does not promote the values to the global site UI Kit.

## Source Page

- Reference URL: https://barn-estate.ru/
- Audited local page: http://127.0.0.1:8888/
- Source audit: [barnes-main-page-audit.md](/home/daniil/Documents/ChatGPT/САЙТ/barnes-main-page-audit.md)
- Scope: homepage only.
- Current validation: hydrated DOM, computed styles, CSS media queries, Playwright viewport matrix, screenshots, keyboard/pointer states and source-page comparison.

## Principles

1. Preserve the premium editorial character: Tilda Sans, large light type, white space, restrained palette, image-led composition and BARNES burgundy.
2. Unify repeated semantic roles, not every visual difference.
3. Keep section-specific art direction where it is clearly intentional.
4. Prefer a small semantic token layer over many component-specific literals.
5. Make responsive behavior continuous where the content allows it; document deliberate steps.
6. Accessibility is part of the reference: one page H1, explicit labels, visible focus and complete disclosure/tab semantics.
7. This file describes the target reference. It does not authorize production-code changes by itself.

## Locked Reference Scope

The following homepage UI decisions are now the single reference baseline for the next implementation passes:

- Typography: Tilda Sans with weights `300 / 400 / 500`; heading weight `300`.
- H2 Standard: `38px / 45.6px` base, `22px / 26.4px` mobile, `44px / 52.8px` wide.
- H2 Compact: `38px / 38px` base, `22px / 22px` mobile, `44px / 44px` wide.
- Eyebrow: `12px / 14.4px` mobile and `14px / 16.1px` tablet/desktop/wide, weight `400`, tracking `0.12em`, semantic color `#4F4D49`.
- Colors: semantic primary `#1E1E1E`, secondary `#4F4D49`, muted `#656462`, brand `#8B1D25`, surface `#F1F1F1`, dark surface `#262626`, border `#E4E4E4`.
- Spacing: `8 / 16 / 24 / 32px` component scale and `50 / 64 / 72 / 96px` responsive section scale.
- Standard section spacing is applied to Services, Barnes Choice, Departments, Reviews, Video, Team, Partners and News.
- Barnes Choice eyebrow: `Недвижимость по направлениям`.
- Departments eyebrow: `Выбрать направление`.
- Reviews intentionally has no eyebrow; its title is `Отзывы`.
- About, Projects, Office and Newsletter remain intentional editorial exceptions until separately reviewed.
- Container, grid, buttons, links, cards, forms, icons, radius and responsive rules remain governed by the specifications below.

This is a homepage reference UI Kit, not a global site-wide token contract.

## Page Map

| № | Section | Purpose | Main elements | Background | Reference container |
|---:|---|---|---|---|---|
| 1 | Header | brand, navigation, conversion actions | logo, nav, phone, menu, callback | transparent → white on scroll | base |
| 2 | Hero / filters | first impression and property search | video, tabs, filters, search, submit | media + overlay | full-bleed media + base controls |
| 3 | Services | explain service offer | eyebrow, H2, lead, 3 cards | white | base |
| 4 | Barnes choice | recommended properties | eyebrow, title, tabs, cards, CTA, arrows | white | base |
| 5 | About company | brand/editorial proof | title, copy, statistics, expand | white | editorial |
| 6 | Departments | entry points by property type | eyebrow, title, 7 category tiles | white | base |
| 7 | Projects | project promotion | 2 project slides, media, arrows | image/media | full section + base controls |
| 8 | Reviews | trust and social proof | title, quote, author, arrows | white | base |
| 9 | Video | editorial media | video controls | white | base |
| 10 | Team | people and expertise | eyebrow, title, profile cards | white | base |
| 11 | Partners | partner proof | title, copy, logo tracks | white | base |
| 12 | Office/contact | direct contact | image, email, address, social links | white | base/editorial |
| 13 | News | editorial content | eyebrow, title, news cards, CTA | white | base |
| 14 | Newsletter | lead capture | copy, email form, visual | dark/light editorial surface | footer grid |
| 15 | Footer | navigation and legal contact | logo, links, phone, callback, legal | #262626 | footer base |
| 16 | Floating expert | persistent conversion | floating card, feedback dialog | card surface | viewport-fixed |

## Reference Typography

### Primitive decisions

- Family: Tilda Sans.
- Reference weights: 300 light, 400 regular, 500 medium.
- Other declared font weights remain available only when a real content need is documented.
- Text colors use semantic tokens; component CSS must not introduce a new dark grey for the same role.
- Uppercase is reserved for navigation, eyebrow labels and selected editorial headings.
- Canonical H2 base/medium value: `38px / 45.6px`, weight `300`. Responsive steps are `22px / 26.4px` on mobile and `44px / 52.8px` on wide screens.

### Fixed homepage H2 reference tokens

These are reference tokens for the homepage only. They are recorded for the future UI Kit and are not yet applied to existing heading selectors, so this decision does not change the current rendered page.

| Token | Base / medium | Mobile ≤540px | Wide ≥1441px | Use |
|---|---:|---:|---:|---|
| `--font-weight-heading` | `300` | `300` | `300` | all reference H2 roles |
| `--type-h2-standard-size` / line-height | `38px / 45.6px` | `22px / 26.4px` | `44px / 52.8px` | section titles with supporting copy |
| `--type-h2-compact-size` / line-height | `38px / 38px` | `22px / 22px` | `44px / 44px` | short one-line editorial headings |
| `--type-h2-editorial-size` / line-height | `44px / 43.12px` | `22px / 26.4px` | `44px / 43.12px` | About brand-editorial exception |

The canonical value to reuse first in later UI Kit work is the base/medium H2 value: `38px`, `45.6px`, weight `300`.

### Reference type roles

| Role | Reference style | Responsive rule | Use |
|---|---|---|---|
| Display / Hero | 48/48px mobile; fluid to 104/104px wide; weight 300 | clamp-based between breakpoints | hero brand/title only |
| H1 / Page title | visual Display style with semantic H1 | one per page | page-level heading; may be visually integrated into hero |
| H2 Standard | 22/26.4px mobile; 38/45.6px desktop; 44/52.8px wide; weight 300 | fluid or 3 semantic steps | section titles with supporting copy |
| H2 Compact | 22/22px mobile; 38/38px desktop; 44/44px wide; weight 300 | only for short one-line editorial labels | Barnes choice, team/news style where line-height 1 is intentional |
| H3 / Card title | 18–22px, line-height 1.15–1.25, weight 400 | scale only when wrapping requires it | property, news, department and team titles |
| Lead / Body Large | 15/21px mobile; 22/33px desktop; weight 300 | fluid within content width | section intro and editorial lead |
| Body | 16/22.4px, weight 300/400 | stable | paragraphs and supporting copy |
| Secondary | 13/18px, weight 300/400 | stable | metadata, helper, form notes |
| Eyebrow | 12/14.4px mobile; 14/16.1px tablet/desktop/wide, weight 400, letter-spacing 0.12em, #4F4D49 | no breakpoint growth above 14px | Services, Barnes Choice, Departments and News section label |
| Navigation | 16/16px desktop, 18/18px wide, weight 300, uppercase | hidden/compact below available-space threshold | header navigation |
| Button label | 16/17.6px desktop, 16px mobile, weight 500 | 18px only at wide scale | actions |
| Form label | 14/20px, weight 400 | explicit visible or visually hidden label | all fields |
| Footer | 13/18px minimum mobile; 16/16px desktop; 18/18px wide | never use 11/11px as a content link | footer navigation/legal |

### Current → reference typography mapping

| Role | Current variants | Reference decision | Classification |
|---|---|---|---|
| Services/section title | 22/26.4, 38/45.6, 44/52.8 | H2 Standard | SAFE TO UNIFY |
| Barnes/team/news title | 22/22, 38/38, 44/44 | H2 Compact for short editorial headings | INTENTIONAL, document role |
| About title | 22/26.4 with negative tracking; 44/43.12 desktop | preserve as Brand Editorial, not a third generic H2 | INTENTIONAL |
| Eyebrows | 12, 13, 16, 22, 24px; #CACACA and rgba dark grey | 12/14.4px mobile; 14/16.1px tablet/desktop/wide; 400; 0.12em; #4F4D49 | FIXED IN REFERENCE CSS |
| Footer links | 11/11 mobile, 16/16 desktop | minimum 13/18 mobile | SAFE TO UNIFY |
| Page heading | no h1 | add semantic H1 using hero/display visual role | SAFE TO UNIFY |

## Reference Colors

### Semantic palette

| Token | Value | Function |
|---|---|---|
| Brand | #8B1D25 | primary CTA, active links, interactive accent |
| Brand accent | #E7C88F | restrained brand accent and focus on dark surfaces when contrast is verified |
| Background | #FFFFFF | primary page surface |
| Surface | #F1F1F1 | neutral card/input surface |
| Dark surface | #262626 | footer and dark editorial blocks |
| Text primary | #1E1E1E | headings and primary body |
| Text secondary | #4F4D49 | readable muted copy and metadata |
| Text muted | #656462 | secondary metadata, icons, supporting text |
| Border | #E4E4E4 | input/divider border |
| Overlay | rgba(0,0,0,.28) | media readability overlay |
| On dark | #FFFFFF | text and controls on dark surface |
| Error | #EF4444 | validation/error only |

### Current → reference color mapping

| Current value | Current use | Reference decision |
|---|---|---|
| #1E1E1E | main text | keep as Text primary |
| #1D1D1B | About title | map to Text primary unless brand editorial exception is visually required |
| #000000 | service description | map to Text primary; no separate black body role |
| #4F4D49 | muted copy | keep as Text secondary |
| #656462 | metadata/icons | keep as Text muted |
| #7F7D7A | low grey copy | replace for normal text; contrast is about 4.10:1 on white |
| #CACACA | News eyebrow | replace for text; contrast is about 1.64:1 on white |
| #8B1D25 | CTA and links | keep as Brand |
| #F1F1F1 | surface | keep as Surface |
| #E4E4E4 and rgba(30,30,30,.12) | borders | Border is preferred; alpha divider remains only where overlay behavior needs it |

Color decision: keep the restrained palette. Do not add additional greys, gradients or accent colors to solve local component differences.

## Reference Spacing

### Primitive scale

Use the smallest scale that represents observed homepage rhythm:

2, 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 60, 64, 72, 80, 96, 100, 120, 128, 150px.

Values 35px, 50px, 75px and 115.2px remain allowed only as named fluid section results or documented editorial exceptions. Values such as 38.4px and 81.92px should not be authored as new literals.

### Semantic spacing

| Token | Reference behavior | Typical use |
|---|---|---|
| space-inline-xs | 8px | icon/label micro gap |
| space-inline-sm | 12–16px | metadata and compact controls |
| space-component | 20–24px | card/form internal gap |
| space-component-lg | 28–40px | heading to content, card groups |
| section-sm | 35px mobile → 60px tablet → 75px desktop | compact sections |
| section-md | 50px mobile → 64px tablet → 72px desktop → 96px wide | standard editorial sections |
| section-lg | 60px mobile → 70/80px tablet → 80/100px desktop | hero-adjacent or media sections |

### Fixed homepage spacing reference tokens

These are reference tokens for the homepage only. The standard section family now uses the `section-md` token in the first implementation pass; editorial sections remain unchanged until their composition is reviewed.

| Token | Base / medium | Mobile ≤540px | Tablet 541–1024px | Wide ≥1441px | Use |
|---|---:|---:|---:|---:|---|
| `--space-inline-xs` | `8px` | `8px` | `8px` | `8px` | icon/label micro gap |
| `--space-inline-sm` | `16px` | `16px` | `16px` | `16px` | compact control and metadata gap |
| `--space-component` | `24px` | `24px` | `24px` | `24px` | card/form internal gap |
| `--space-component-lg` | `32px` | `32px` | `32px` | `32px` | heading-to-content and grouped content |
| `--space-section-sm` | `75px` | `35px` | `60px` | `75px` | compact section rhythm |
| `--space-section-md` | `72px` | `50px` | `64px` | `96px` | standard inter-section rhythm |
| `--space-section-lg` | `100px` | `60px` | `80px` | `100px` | hero-adjacent/media sections |

The canonical base/medium spacing value to reuse first is `--space-section-md: 72px`. About, Projects, Office and Newsletter remain documented editorial exceptions where media and asymmetric composition determine the final section height.

### Section rhythm decision

Do not force every section to the same height. Standardize section padding roles, then allow content and media to determine section height. About, Project and Newsletter are editorial exceptions because their composition depends on media and asymmetric columns.

## Reference Containers

### Base container

- max-width: 1920px.
- margin-inline: auto.
- Use one fluid gutter rule from the current homepage:
  - mobile up to 768px: approximately 15–24px across the range;
  - 769–1920px: approximately 26–100px across the range;
  - above 1920px: content remains capped and outer margin grows.
- Header, section titles, cards, forms and footer use the same base vertical guides.

### Container roles

| Role | Rule | Allowed use |
|---|---|---|
| Base | max 1920px with shared fluid gutters | default for header, sections, cards, footer |
| Full bleed | width 100%, no horizontal text padding | hero/project media only |
| Editorial | base outer alignment plus two-column custom grid | About and office/contact |
| Narrow copy | max 560–620px inside base | lead, newsletter copy, long text |
| Slider viewport | base-aligned viewport with controlled overflow | cards, team, news, reviews |

Departments and team must stop overriding the base gutter. Their cards may have their own grid, but their outer left/right guides must match adjacent section titles.

## Reference Grid

| Pattern | Columns | Gap | Use |
|---|---:|---:|---|
| Stack | 1 | 12–20px | mobile service, department and form layouts |
| Service grid | 2 | 20px | desktop service cards; third card may span |
| Department grid | 6 | 2px | desktop category tiles; 1 column below desktop contract |
| Editorial split | 2 | fluid, max about 160px | About and office/contact |
| Footer split | 0.9fr / 1.1fr | 0 | newsletter/footer visual split |
| Slider track | content-dependent | section token | properties, team, news, reviews |

Use Grid for macro layout and Flexbox for control rows/slider tracks. Do not create multiple implementations of the same pattern without a documented reason.

## Reference Buttons

### Roles

| Role | Purpose | Reference visual |
|---|---|---|
| Primary | main conversion/action | solid Brand, white label, no competing decoration |
| Secondary | alternative action | neutral or dark surface with clear hierarchy |
| Outline | low-emphasis action on light surface | 1px border, transparent background |
| Text | editorial navigation | Brand text, underline/offset, no fill |
| Icon | slider/menu/close actions | circular or transparent; minimum 44×44px hit area |

Do not create a new button variant for a different section if the action has the same role.

### Primary reference contract

- Mobile height: 58px.
- Tablet/desktop height: 70px.
- Horizontal padding: 24px mobile, 36px desktop, 47px wide only when the label requires it.
- Label: 17/18.7px, weight 400; 19px/20.9px at wide scale.
- Background: Brand; text: On dark.
- Radius: 1px reference for rectangular action buttons.
- Transition: background/color/opacity 180–220ms ease.
- Focus-visible: 2px Brand or contrast-safe outline with 4px offset.
- Disabled: opacity 0.5–0.6, cursor not-allowed, no hover transform.
- Loading: only where network submission exists; preserve width and expose aria-busy.

### Button audit snapshot — 2026-10-07

Measured on the homepage at 390, 768, 1280 and 1920px. The same visual action currently uses several incompatible contracts:

| Role / selector | Current measurements | Finding |
|---|---|---|
| Hero primary `.home-hero-filters__submit` | `58px` mobile, `70px` tablet/desktop; `16/17.6px`, `18/19.8px` wide; radius `3px` mobile and `0` from tablet | Primary role changes radius and wide typography without a documented reason |
| Barnes CTA `.barnes-choice__action` | `68px` mobile, `56px` tablet, `70px` desktop; `16/16px` mobile/tablet and `20/20px` desktop; radius `3px` | Same primary role has a tablet height dip and oversized desktop label |
| Project outline `.project-hero__cta` | `68px` mobile, `56px` tablet, `70px` desktop; same `16/20px` split; radius `3px` | Outline CTA does not share one height/type contract |
| Newsletter submit | `54px` mobile, `58px` tablet/desktop; `16/16px`; radius `0` | Submit control is shorter and sharper than primary CTA |
| Footer callback | `50px` mobile, `56px` tablet/desktop; `16/16px`, weight `500`; radius `0` | Callback is visually smaller than the main CTA family |
| Slider arrows | `48px` mobile, `56px` tablet/desktop, `68px` wide; circular | Responsive scale is intentional, but hit-area behavior must remain explicit |
| Text links `.ui-more-link` | about `25px` rendered box; `14/16.8px` | Text is correct for the role, but clickable area needs a larger invisible hit area |
| Hero/Barnes tabs | `24–34px` rendered height, `12–22px` type | Tab labels are visually distinct but current touch areas are below the 44px reference target |
| Header icon controls | visual/link boxes from `22px` to `33px` | Icon is small by design, but the interactive parent must be at least `44×44px` |
| Slider pagination | visual button boxes `8px`, active `38×8px` | Needs an accessible hit area around the visual dot |
| Floating close | `30×30px` | Below the reference icon-control hit area |

### Proposed button unification order

1. Unify Primary and Outline CTA height/type first: `58px` mobile, `70px` from tablet/desktop; `17/18.7px`, weight `400`; `1px` radius.
2. Remove the `56px` tablet dip from Barnes and Project CTAs.
3. Bring newsletter submit and footer callback into the same height family unless their narrower editorial composition is intentionally approved.
4. Keep visual slider-arrow scaling `48/56/68px`, but ensure every other icon action has a minimum `44×44px` interactive parent.
5. Preserve the visual size of text links, tabs and pagination dots while enlarging their hit areas invisibly.

No button CSS was changed as part of this audit snapshot; these are the next reference decisions to approve before implementation.

### Rectangular control inventory — header excluded

This inventory includes rectangular `<button>` elements and anchors styled as controls. Circular slider arrows, pagination dots and all header controls are excluded.

| Family / selector | 390px | 768px | 1280px | 1920px | Type inside |
|---|---|---|---|---|---|
| Hero filter icon `.home-hero-filters__filter-icon` | `60×58px` | hidden | hidden | hidden | `16/16px`, weight `400` |
| Hero filter tabs `.home-hero-filters__tab` | hidden | `24px` high | `24px` high | `26px` high | `16/16px` → `18/18px` wide; active `400`, inactive `300` |
| Hero filter fields `.hero-filter-field` / `.home-hero-filters__more` | hidden | `70px` high | `70px` high | `70px` high | `16/17.6px`, weight `300`; `18/19.8px` wide |
| Hero primary `.home-hero-filters__submit` | `342×58px` | `705×70px` | `209×70px` | `248×70px` | `17/18.7px`, weight `400`; `19/20.9px` wide |
| Barnes tabs `.barnes-choice__tab` | select only | `32px` high | `32px` high | `34px` high | `20/20px` → `22/22px` wide, weight `300` |
| Barnes mobile select `.barnes-choice__select-control` | `120×26px` | hidden | hidden | hidden | `12/14.4px`, weight `300` |
| Barnes primary `.barnes-choice__action` | `342×58px` | `320×70px` | `320×70px` | `320×70px` | `17/18.7px`, weight `400`; `19/20.9px` wide |
| Project outline `.project-hero__cta` | `204×58px` | `228×70px` | `228×70px` | `266×70px` | `17/18.7px`, weight `400`; `19/20.9px` wide |
| About text CTA `.ui-more-link` | `141×25px` | `141×25px` | `141×25px` | `141×25px` | `14/16.8px`, weight `300` |
| News text CTA `.news-section__action` | `206×25px` | `206×25px` | `206×25px` | `206×25px` | `14/16.8px`, weight `400` |
| Office/contact `.office-contact__social` | `335×48px` | `315×48px` | `225×48px` | `348×48px` | `17/18.7px` mobile/tablet/desktop; `19/20.9px` wide, weight `400` |
| Newsletter submit | `335×58px` | `199×70px` | `199×70px` | `233×70px` | `17/18.7px`, weight `400`; `19/20.9px` wide |
| Footer callback `.site-footer__callback-btn` | `294×53px` | `705×56px` | `294×56px` | `334×56px` | `17/18.7px`, weight `400`; `19/20.9px` wide |
| Floating expert `.floating-expert__card` | `343×97px` | `360×110px` | `360×110px` | `360×110px` | `16/16px`, weight `400` |
| Floating close `.floating-expert__close` | `30×30px` | `30×30px` | `30×30px` | `30×30px` | inherited `16/16px`; icon-only |

Rectangular-system conclusion: Hero primary, Barnes primary, Project outline and Newsletter submit now share one CTA geometry and use weight `400`; Footer callback keeps its compact geometry but uses the same label weight. Text links and filter/tab controls remain separate semantic roles.

### Implemented rectangular action correction — 2026-10-07

The first rectangular-control correction is limited to the main CTA family:

- Hero primary, Barnes primary, Project outline and Newsletter submit now share `58px` height on mobile and `70px` from tablet through desktop.
- Rectangular action labels use `17px / 18.7px`, weight `400`; wide desktop uses `19px / 20.9px`.
- Horizontal padding is `24px` mobile, `36px` base desktop and `47px` wide desktop.
- Radius is `1px` for the four shared CTA controls and the compact Footer callback.
- Footer callback keeps its compact size but now also uses weight `400`.
- Office/contact, filter fields, tabs, text links and floating controls remain separate roles and were not changed in this pass.

### Icon and slider contract

Slider arrows: 48px mobile, 56px desktop, 68px wide. Use disabled state instead of hiding unavailable navigation. Menu/close/favorite/search parents must be at least 44×44px even when the visual icon is smaller.

### Header button audit snapshot — 2026-10-07

The header was checked separately at 320, 390, 540, 541, 768, 1024, 1025, 1280, 1281, 1440 and 1920px:

| Control | Current rendered / interactive box | Typography / state | Finding |
|---|---:|---|---|
| Mobile menu `.site-header__icon-btn` | `29×29px` at ≤540px; `33×33px` above 540px | icon-only; transparent; hover opacity; no visible focus ring | visual size is intentional, hit area is below `44×44px` |
| Mobile phone `.site-header__mobile-phone` | `22×22px` at ≤540px | icon-only; transparent; default focus is visible | hit area is below `44×44px` |
| Favorites `.site-header__favorites-btn` | `22×22px` above 540px | icon-only; transparent; hover opacity; no visible focus ring | hit area is below `44×44px` |
| Search `.site-header__search-btn` | `22px` icon at 541–1024px; about `72×22px` with label from 1025px | label `16/16px`, weight `400` in computed snapshot; no visible focus ring | label is readable, vertical hit area is too small |
| Header phone `.site-header__phone` | about `168×21px` from 1025px | `16/16px`, weight `300`; default focus visible | text link needs a 44px vertical parent area |

Breakpoint observations:

- `540→541px`: header height changes from `69px` to `111px`; mobile phone disappears, menu grows from `29px` to `33px`, favorites/search appear at `22px`.
- `1024→1025px`: search changes from icon-only `22×22px` to icon plus label `71.5×22px`; the header phone appears at `167.8×21px`.
- `1280→1281px`: header navigation appears and header height changes from `111px` to `153px`; the button dimensions themselves do not change.

Header-specific state findings:

- Hover exists for desktop controls as opacity reduction (`.75–.8`), with no transform or layout shift.
- Menu, favorites and search declare `outline: none` but do not provide a replacement `:focus-visible` treatment in the current computed state.
- The visual icon sizes should remain unchanged; only the invisible interactive parent should grow.
- Recommended reference: `44×44px` minimum parent for mobile menu/phone and desktop menu/favorites/search icon actions, `44px` minimum height for text phone/search links, with a visible `2px` focus ring and `2px` offset.

The header navigation itself remains outside this button pass. Its current visibility switches at the `1280/1281px` boundary and is documented separately as a navigation breakpoint issue.

## Reference Links

| Link role | Reference style | States |
|---|---|---|
| Header navigation | uppercase, 16/16px desktop or 18/18px wide, weight 300 | color/opacity hover; visible focus |
| Text CTA | 14/16.8px, Brand, underline with 2px offset | hover color/opacity; focus ring |
| Inline content | Text secondary or Brand according to meaning | underline on hover/focus |
| Footer | 13/18px minimum mobile, 16/16px desktop | visible focus, adequate hit area |

Visited styling is not a separate visual role unless browser behavior requires it. Focus-visible must never be removed.

## Reference Cards

The homepage needs four card families, not one universal card:

| Family | Purpose | Shared rules | Intentional difference |
|---|---|---|---|
| Media card | services, properties, news | image first, object-fit cover, title/meta/CTA rhythm | image ratio and copy density are section-specific |
| Category tile | departments | full-card image, overlay/readability treatment | dense 2px desktop grid |
| Profile card | team | portrait media, name and role | portrait crop differs from property/news |
| Logo tile | partners | contain logo, consistent visual box | decorative/informative alt decision per logo |

All card families share title color, focus treatment, image overflow behavior and base radius policy. Do not force one image aspect ratio across all four families.

## Reference Forms

- Every input has a real label; placeholder is supporting text only.
- Input height: 58px mobile, 70px desktop where the field belongs to the hero/filter contract.
- Border: 1px Border or semantic dark underline for the newsletter editorial form.
- Radius: 3px for standard fields; filter fields may retain the homepage 14px radius as an intentional control family.
- Focus-visible: 2px visible ring or high-contrast bottom/outer indicator.
- Error: inline message tied with aria-describedby and visible border/state.
- Disabled: reduced contrast and cursor not-allowed.
- Submit: Primary role; preserve button width during loading.
- Dialog form: trap focus, close on Escape, return focus to opener, announce status.

## Reference Icons

Keep the existing BARNES icon family and current font/SVG source. Normalize by function:

- inline icon: 16–18px;
- standard action icon: 20–22px;
- mobile menu icon: current visual size may remain approximately 29px;
- desktop header icon: current visual size may remain approximately 33px;
- all interactive parents: minimum 44×44px;
- icon/text gap: 8px standard, 12–18px only for large CTA compositions.

Stroke/fill should follow the existing icon family; do not mix a new icon set into the homepage.

## Office/contact Link Reference

The WhatsApp, Telegram, MAX and phone links use the same interactive contact-link role as the rectangular homepage actions:

- Desktop/tablet: `17px / 18.7px`, weight `400`.
- Wide desktop: `19px / 20.9px`, weight `400`.
- Mobile: `17px / 18.7px`, weight `400`.
- Existing control height remains `48px`; the change affects text readability only.
- Existing icon sizing and horizontal spacing remain unchanged.

## Radius, Borders and Elevation

| Token | Value | Use |
|---|---:|---|
| radius-sharp | 0 | editorial media/sections where the edge is intentionally architectural |
| radius-control | 1px | rectangular action buttons; standard inputs remain separate |
| radius-filter | 14px | hero filter fields |
| radius-round | 999px | pills/badges only |
| radius-circle | 50% | arrow/icon controls |

Borders are 1px. Preferred border color is #E4E4E4; use rgba(30,30,30,.12) only for a deliberate soft divider. The homepage currently needs only one functional shadow: scrolled header, 0 4px 24px rgba(0,0,0,.08). Do not add generic card shadows.

## Header Reference

- Transparent over hero in initial state.
- Fixed white surface after scroll, with the existing shadow.
- Shared base-container guides.
- Desktop navigation appears only when the full row fits; 1280/1281 is a current breakpoint discontinuity and must be reviewed.
- Menu button exposes aria-expanded and aria-controls.
- Open menu has visible close action, Escape close, focus trap and focus return.
- Logo, phone and action controls preserve current BARNES proportions; only spacing and state semantics are candidates for unification.

## Hero Reference

- Preserve full-bleed media and premium editorial composition.
- Keep filter controls aligned to the base container.
- Keep the primary submit as the single dominant action.
- Preserve current overlay/image treatment; do not add decorative UI.
- Replace the 540→541 service-card-style discontinuity if it affects hero-adjacent fold rhythm.
- Optimize mobile video loading with poster/metadata strategy only after visual LCP comparison.

## Footer Reference

- Keep dark #262626 surface and white logo/text treatment.
- Use one footer container and shared column guides.
- From `1200px` up, use six equal columns: row one is `Москва`, `Загородная`, `Коммерческая`, `Санкт-Петербург`, `Курортная`, `Зарубежная`; row two is `Медиа`, `О BARNES`, `Собственникам`.
- On mobile, keep `40px` separation between the newsletter block and the dark footer.
- Mobile footer column titles use `14px / 16.8px`; footer links use `13px / 18.2px`, weight `400`.
- Newsletter form and callback remain distinct roles: newsletter is lead capture; callback is contact conversion.
- Legal and consent copy must remain readable and keyboard accessible.

## Responsive Rules

### Reference contracts

| Range | Contract |
|---|---|
| ≤540px | mobile header, 1-column cards, 58px primary buttons, compact section padding |
| 541–1024px | tablet type and 70px controls, 1-column service/department layouts where current content needs it |
| 1025–1280px | compact desktop grids; header nav may remain hidden if the row does not fit |
| 1281–1440px | desktop nav and full section grid |
| ≥1441px | wide typography/spacing; content still capped at 1920px |
| ≥1921px | preserve 1920px content cap and grow outer margins only |

### Responsive behavior decisions

- Typography: use the reference steps above; use clamp for fluid roles, not dozens of independent literals.
- Spacing: reduce semantic section tokens, not arbitrary per-component values.
- Grid: switch based on content fit; test adjacent widths before and after each change.
- Cards: prevent height jumps caused only by breakpoint literals.
- Images: preserve family-specific crop, maintain stable media boxes to reduce layout shift.
- Header: use available-space logic for navigation where possible.
- Mobile safe area: add inset handling to fixed header/floating controls during implementation.

Required QA widths remain: 320, 360, 375, 390, 414, 430, 480, 576, 600, 640, 720, 768, 800, 834, 900, 960, 1024, 1100, 1152, 1200, 1280, 1366, 1440, 1536, 1600, 1728, 1920, 2048, 2560px, plus 539/540/541 and 1279/1280/1281.

## Primitive → Semantic → Component

| Primitive | Semantic token | Component use |
|---|---|---|
| #1E1E1E | Text primary | H2, card title, body |
| #8B1D25 | Brand interactive | Primary button, text CTA, active state |
| #E4E4E4 | Border | input/divider |
| 20px | space-component | card/form gap |
| 60px | section-md tablet | standard section padding |
| 70px | control-desktop | hero fields and desktop primary button |
| radius 1px | radius-control | rectangular CTA/input |
| 2px outline | focus-visible | all keyboard interactive components |

No component token should duplicate a semantic token without a local, documented reason.

## Current → Reference Mapping

| Element / role | Current variants | Recommended reference | Reason |
|---|---|---|---|
| Base container | shared formula plus departments/team override | one base container and aligned inner grids | remove guide drift |
| Section headings | standard, compact and About editorial variants | H2 Standard + H2 Compact + one documented Brand Editorial exception | preserve hierarchy without arbitrary variants |
| Eyebrows | 12–24px | 12–14px role | same function should read the same |
| Body dark text | #1E1E1E, #1D1D1B, #000 | Text primary #1E1E1E | remove duplicate semantics |
| Muted text | #4F4D49, #656462, #7F7D7A, #CACACA | Text secondary/muted only | contrast and consistency |
| Primary CTA | 58px mobile, 70px desktop, sharp/radius differences | 58/70px token, radius 1px | one action contract |
| CTA typography | 16/16px, 16/17.6px, 18/19.8px and 20/20px across roles | 17/18.7px base; 19/20.9px only wide; weight 400 | compensate for the lighter label weight |
| Slider arrows | 48/56/68px | responsive Icon button token | same function, documented scale |
| Small interactive controls | 8–34px visual boxes | preserve visual, add 44px minimum hit area | touch and keyboard usability |
| Header controls | 22–33px icon/link boxes | preserve visual icon, add 44px parent and visible focus ring | header usability and keyboard QA |
| Footer links | 11px mobile to 18px wide | 13/18 minimum mobile, 16/16 desktop | readability |
| Focus | outline none in many controls | visible 2px focus-visible | keyboard QA |
| Hero search | empty label | explicit label | form semantics |

## Required Corrections

These are specification outputs, not completed implementation changes.

| ID | Section | Current | Reference correction | Priority |
|---|---|---|---|---|
| R-001 | Mobile menu | Escape does not close local overlay | add close button, Escape, focus return, expanded/controls semantics | P1 |
| R-002 | Page semantics | no H1 | add one semantic H1 using hero/display visual role | P2 |
| R-003 | All controls | outline none without replacement | add visible focus-visible ring | P2 |
| R-004 | Hero search | empty label | add bound label; keep placeholder as hint | P2 |
| R-005 | Services / responsive | 540→541 card height 198→264px and section jump +568.59px | replace fixed step with content/aspect/clamp rule | P2 |
| R-006 | Departments/team | outer guides drift at 768/1024px | remove inner gutter override | P2 |
| R-007 | Text palette | #CACACA and #7F7D7A fail normal AA | use Text muted/secondary tokens | P2 |
| R-008 | SEO infra | production robots/sitemap use legacy host and duplicate entry | canonical current host and clean sitemap | P2 |
| R-009 | Hero media | earlier mobile transfer about 9.77MB with preload auto | poster/metadata/lazy strategy; measure LCP/CLS | P2 |
| R-010 | HTML | empty lang | set lang=ru | P3 |
| R-011 | SEO | canonical absent locally | add self-canonical | P3 |
| R-012 | Images | 32/126 missing alt | classify decorative/informative | P3 |
| R-013 | Footer | 11/11px mobile links | use readable footer token | P3 |
| R-014 | Typography | eyebrows 12/13/16/22/24px | map to 12/14.4px mobile and 14/16.1px tablet/desktop/wide; 400; 0.12em; #4F4D49 | P3 |
| R-015 | Colors | three dark primary text values | consolidate Text primary | P3 |
| R-016 | Reviews | author metadata is footer landmark | use citation wrapper without footer landmark | P3 |
| R-017 | ARIA | menu/tab relationships incomplete | add disclosure and tabpanel relations | P3 |
| R-018 | Header | nav hidden at 1280, visible at 1281; +42px header | review available-space breakpoint | P4 |
| R-019 | Local deployment | robots/sitemap return 404 | add only if clone is independently indexed | P4 |
| R-020 | Primary/outline CTA | same role uses 56/58/68/70px and 16/18/20px labels | unify to 58px mobile, 70px tablet/desktop, 16/17.6px base, 18/19.8px wide, weight 500 | P2 |
| R-021 | CTA radius | primary controls use both `0` and `3px` | use `3px` standard; keep sharp only as documented editorial exception | P3 |
| R-022 | Interactive hit areas | header icons 22–33px, tabs 24–34px, pagination 8px, close 30px | add invisible minimum `44×44px` parents without changing visual icons/dots | P2 |
| R-023 | Newsletter/footer actions | newsletter `54/58px`, footer callback `50/56px`, both radius `0` | map to Primary/Secondary contracts or document intentional compact editorial variants | P3 |
| R-024 | Header hit areas | menu `29/33px`, phone/favorites `22px`, text phone `21px` high | add invisible minimum `44×44px`/`44px` height without changing icon or text visuals | P2 |
| R-025 | Header focus | menu/favorites/search compute to `outline: none` | add visible `:focus-visible` ring, 2px with 2px offset | P2 |
| R-026 | Rectangular CTA family | primary/outline/submit/callback controls use `50/54/56/58/68/70px` and `16/20px` labels | unify semantic CTA roles first; keep filters, tabs and text links as separate families | P2 |

## Safe to Unify

- Same-role eyebrows to 12–14px.
- Dark body/title colors to Text primary.
- Muted copy to contrast-safe Text secondary/muted.
- Base outer container guides, including departments/team.
- CTA height tokens 58px mobile and 70px desktop.
- Slider arrow hit-area and state contract.
- Focus-visible treatment.
- Form labeling and dialog focus behavior.
- Footer mobile text minimum.

## Review Required

- Whether sharp desktop hero CTA radius 0 is a deliberate editorial exception or should become radius-control.
- Whether H2 Compact should remain separate from H2 Standard in Barnes/team/news.
- Exact card media ratios for each family; do not force one ratio without visual review.
- Exact 1280/1281 nav behavior after real content-fit testing.
- Hero video loading strategy after LCP comparison.
- Whether local robots/sitemap are needed for this clone deployment.

## Intentional Exceptions

- Hero and project media remain full-bleed.
- About uses an asymmetric editorial grid and Brand Editorial title.
- Department desktop grid uses a dense 2px gap.
- Partner logos use a marquee track and may have family-specific visual boxes.
- Card image ratio remains family-specific: service, property/news, profile and logo tiles are not interchangeable.
- Header initial and scrolled states intentionally differ in color and positioning.

## Reference Decision Table

| Category | Reference decision | Confidence | Reason |
|---|---|---|---|
| Typography | Tilda Sans, 300/400/500; H2 Standard + Compact | HIGH | repeated computed styles and brand character |
| Colors | #1E1E1E, #4F4D49, #656462, #8B1D25, #FFFFFF, #F1F1F1, #262626 | HIGH | repeated actual palette and contrast review |
| Spacing | `--space-section-md: 72px` with responsive `50/64/96px` steps; named supporting scale | HIGH | repeated homepage rhythm, documented responsive bands and editorial exceptions |
| Containers | max 1920px, one shared gutter system | HIGH | measured base container and alignment drift |
| Grid | stack, service 2-col, department 6-col, editorial split, slider | HIGH | repeated layout patterns |
| Buttons | Primary/Secondary/Outline/Text/Icon; 58/70px primary | MEDIUM | current height is clear; radius needs review |
| Cards | four families, shared semantics, family-specific media | MEDIUM | visual functions differ |
| Forms | explicit labels, 58/70 controls, visible states | HIGH | accessibility and current control sizes |
| Radius | 0, 3, 14, circle | MEDIUM | actual repeated values, desktop CTA exception unresolved |
| Borders | 1px #E4E4E4 plus limited alpha divider | HIGH | actual usage |
| Icons | existing family, role sizes, 44px hit area | MEDIUM | source family is clear; stroke details need component pass |
| Responsive | 540/541 and 1280/1281 require correction/review | HIGH | measured discontinuities |

## Open Decisions

1. Approve radius 3px for primary CTA or retain sharp desktop hero CTA as intentional.
2. Choose whether the local clone is an independently crawlable deployment.
3. Approve the mobile video loading policy after performance measurement.
4. Approve the exact navigation behavior at 1280–1281px.

## Changelog

### 2026-10-05

- Created the first homepage-only reference UI specification from the existing design audit.
- Added page map, typography/color/spacing/container/grid/button/card/form/icon rules.
- Added current-to-reference mapping, decision confidence, safe/review/intentional classification and 19 required corrections.
- Kept this document separate from design-audit.md; no production code changed.

### 2026-10-06

- Implemented the first homepage-only primitive and semantic token layer in homepage-ui-tokens.css.
- Connected the token layer to the homepage without changing the rendered font, weight or color values.
- Fixed the homepage reference H2 base/medium token at `38px / 45.6px`, weight `300`; retained `22px` mobile and `44px` wide responsive steps.
- Recorded H2 tokens as specification only; no H2 component selectors or rendered heading styles were changed.
- Fixed the homepage reference spacing base/medium token at `72px`; retained `50px` mobile, `64px` tablet and `96px` wide steps for standard sections.
- Applied `section-md` spacing to the standard section family; kept About, Projects, Office and Newsletter as editorial exceptions.
- Locked the current homepage typography, color, spacing and component decisions as the Homepage Reference UI Kit; global-site promotion remains out of scope.
- Unified Services, Barnes Choice, Departments and News eyebrow styles: 12px mobile, 14px from tablet through wide desktop, weight 400, 0.12em tracking and Text secondary color.
- Added Barnes Choice eyebrow `Недвижимость по направлениям` and Departments eyebrow `Выбрать направление`; removed the Reviews eyebrow.
- Increased homepage office/contact method labels to the reference contact-link role: 18/22.5px from tablet through wide desktop and 16/20px on mobile; retained the 48px touch target.
- Audited homepage buttons and interactive links at 390/768/1280/1920px; documented CTA height/type divergence, radius divergence and undersized hit areas. No button CSS was changed.
- Audited header controls at 320/390/540/541/768/1024/1025/1280/1281/1440/1920px; isolated hit-area and keyboard-focus fixes from the rest of the button system. No header CSS was changed.
- Audited all rectangular homepage controls with the header excluded; recorded dimensions and typography at 390/768/1280/1920px. No button CSS was changed.
- Applied the first rectangular CTA correction to Hero, Barnes Choice and Project controls; kept header, circular controls and separate form/footer/text-link roles unchanged.

### 2026-10-07

- Unified Newsletter with the rectangular CTA geometry and changed all rectangular action labels to weight `400`; kept header and circular controls unchanged.
- Increased rectangular action labels to `17px` base / `19px` wide and set the button radius token to `1px`.
- Aligned Office/Contact communication links to the same `17px / 19px`, weight `400` typography while preserving their `48px` hit area.
- Reflowed wide desktop footer navigation to six columns: six property directions on row one, then `Медиа`, `О BARNES` and `Собственникам` on row two.
- Increased mobile footer readability to `14px` titles and `13px / 18.2px` links; added `40px` separation after the newsletter form.
