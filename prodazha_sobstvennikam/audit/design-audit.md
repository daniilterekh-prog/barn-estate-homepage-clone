# Design Audit

## Page

- Reference URL: `https://front.barnes.vsavr.ru/prodazha_sobstvennikam/`
- Audited clone: `prodazha_sobstvennikam/index.html`
- Local test URL: `http://127.0.0.1:8766/prodazha_sobstvennikam/`
- Audit date: `2026-10-06`
- Scope: full-page UI/design QA, responsive behavior, DOM semantics, CSS system, interactions, accessibility, image/font loading, technical SEO and performance risks.

## Audit Scope and Evidence

The audit uses:

- static inspection of `index.html`, `source.css`, `owner-sale.css`, `owner-sale.js` and all local assets;
- source/reference comparison already captured in the browser for the clone and the reference page;
- exact geometry checks previously recorded at `390px`, `540px`, `768px`, `1024px`, `1280px`, `1440px` and `1920px` viewport widths;
- DOM/resource checks: links, forms, buttons, images, fonts, local asset resolution and horizontal overflow.

Current-turn limitation: the in-app browser refused DOM evaluation for `file://` and could not reach the temporary localhost server from its isolated process. Therefore the report does not claim a fresh interactive rerun for every listed width; values marked `verified` come from the previous browser pass, while the remaining rows are derived from the actual CSS breakpoint map and require one final browser pass before production release.

Production files were not changed during this audit. Only this documentation file is added.

## Executive Summary

The clone is visually coherent and closely follows the reference page. The previously verified geometry matched the reference at `390px` and `1280px` down to the recorded hundredths of a pixel for the main sections, and the tested widths had no horizontal overflow beyond the normal scrollbar gutter.

The largest risks are not the visual layout itself:

1. The clone is explicitly `noindex, nofollow`, which is correct for a staging clone but blocks organic indexing if this route is ever deployed as a public landing page.
2. The three visible forms are intercepted by `owner-sale.js`, `preventDefault()` is called, and a local success message is shown. There is no real submission, validation, error announcement or backend integration in this artifact.
3. The page ships about `13MB` of assets; several hero/background PNGs are `0.7–1.8MB` each.
4. Most navigation URLs remain absolute links to `front.barnes.vsavr.ru`, so the separate clone leaves the clone when users navigate.
5. The page has a broad visual language but no small centralized token layer: hundreds of literal color values and many one-off spacing values make future pages harder to keep consistent.

Issue totals: `12` tracked findings — `0 P1`, `5 P2`, `5 P3`, `2 P4`.

## Page Structure

| № | Section | Type | Main elements | Container / grid | Background |
|---:|---|---|---|---|---|
| 1 | Header / navigation | global header | logo, desktop nav, favorites, search, phone, mobile menu | `.site-header__top`, 3-column desktop grid; flex mobile | transparent over hero; white when scrolled/menu-open |
| 2 | Hero `.owner-sale-hero` | hero | image, overlay, H1, copy, CTA, expert/contact content | `.base-container`; body grid becomes one column at `≤1024px` | image with dark gradient overlays |
| 3 | `#stages` | process / offer | title, six stages, valuation offer card | 2 columns; one column at `≤1024px` | `#fff` |
| 4 | `.owner-sale-strategy` | split feature | image, title, text, CTA | `937fr / 783fr`; one column at `≤1024px` | `#fff`, `1px` rules |
| 5 | `#about` presentation | gallery / editorial | title, six presentation images and captions | responsive gallery in `.base-container` | `#fff` |
| 6 | `.about-company` | company facts / expandable copy | title, facts, text, “Читать далее” | inner max-width `1440px`; facts 6 columns from `≥901px`, 2 columns at `≤640px` | `#fff`, decorative border |
| 7 | `.catalog-consultation` | lead form / tabs | expert, title, phone/messenger tabs, inputs, consent, submit | max form width `610px`; mobile-specific header/expert | image background desktop; dark mobile surface |
| 8 | `.owner-sale-services` | carousel | 11 service cards, arrows | Splide-like track; card width `430/360/280/82%` by breakpoint | `#fff`, `1px` rules |
| 9 | `.owner-sale-magazine` | editorial CTA | background image, title, three-item list | full-width absolute image, content container | image / dark overlay |
| 10 | `#property-types` | card catalog | four property cards | 2 columns with `2px` gap; 1 column at `≤540px` | `#fff` / image cards |
| 11 | `#request` | contact form | title, tabs, inputs, consent, expert card | desktop 2-column grid; one column at `≤1024px` | `#262626`, image + overlay |
| 12 | `.newsletter-cta` | newsletter CTA | title, lead, form, responsive image | `.9fr / 1.1fr`; stacked image layer at `≤860px` | `#fff` |
| 13 | Footer | global footer | logo, navigation, contacts, social, legal, callback | desktop columns; mobile stacking | dark footer |
| 14 | Floating expert | floating action | Ruslan card, dismiss control, feedback modal | fixed `360px` max / `calc(100vw - 32px)` | white card, shadow |
| 15 | Sticky navigation | in-page navigation | five anchor controls | fixed/sticky state driven by JS | white translucent / dark text |
| 16 | Mobile menu | modal navigation | 64 links, two featured cards, bottom link groups | fixed panel with internal scroll | white panel |

## Verified Page Geometry

The reference and clone had identical recorded section geometry at the two representative widths below.

### 390px viewport

The layout viewport is `375px` because the page reserves a `15px` scrollbar gutter.

| Element | Y | Height | Width |
|---|---:|---:|---:|
| Header | `0` | `69px` | `375px` |
| Hero | `0` | `520px` | `375px` |
| Stages | `520px` | `1415.78px` | `375px` |
| Strategy | `1935.78px` | `751px` | `375px` |
| Services | `6307.45px` | `534px` | `375px` |
| Magazine | `6841.45px` | `468px` | `375px` |
| Property types | `7309.45px` | `966px` | `375px` |
| Request | `8275.45px` | `679.55px` | `375px` |
| Footer | `9356.70px` | `1550.94px` | `375px` |

H1: `x=16.28px`, `y=248.44px`, `w=342.44px`, `h=72px`.

### 1280px viewport

The layout viewport is `1265px` because of the stable scrollbar gutter.

| Element | Y | Height | Width |
|---|---:|---:|---:|
| Header | `0` | `111px` | `1265px` |
| Hero | `0` | `760px` | `1265px` |
| Stages | `760px` | `1201.13px` | `1265px` |
| Strategy | `1961.13px` | `622px` | `1265px` |
| Services | `5207.47px` | `522.75px` | `1265px` |
| Magazine | `5730.22px` | `589.91px` | `1265px` |
| Property types | `6320.13px` | `802px` | `1265px` |
| Request | `7122.13px` | `918px` | `1265px` |
| Footer | `8706.63px` | `1344.56px` | `1265px` |

H1: `x=56.78px`, `y=576.02px`, `w=743.44px`, `h=50.39px`.

## Breakpoints

These are the actual breakpoint values found in the shipped CSS, not a framework assumption.

| Breakpoint | Changes | Risk / recommendation |
|---:|---|---|
| `≤540px` / `541px` | mobile header, one-column property cards, mobile form expert/header, 520px hero, 40px section padding, 30px H1/section titles | Key mobile boundary. Keep it intentional; test `540/541` together. |
| `≤560px` | unrelated news-slider overflow rule in the shared source stylesheet | Shared CSS contains page families beyond this page; avoid relying on global rules. |
| `≤640px` | about-company facts become two columns and facts shrink to `112px` min-height | Test `640/641`; long fact labels may wrap differently. |
| `≤768px` | hero `560px`, title `30px`, section padding `48px`, service card min-height `260px`, type card `240px` | Test `768/769`; this is the main tablet-to-mobile typography step. |
| `≤860px` | newsletter changes from grid to stacked background-image composition; min-height moves to `620px` | Test `860/861`; overlay readability and image crop are the main risk. |
| `≥901px` | about-company facts change from 5 to 6 columns | Test `900/901`; this is a content-grid breakpoint, not a global layout breakpoint. |
| `≤1024px` / `1025px` | most grids become one column, hero body stacks, contact form stacks, hero `640px`, title `36px` | Test `1024/1025`; check CTA order and sticky behavior. |
| `≤1280px` | header top spacing and several shared components tighten | This breakpoint is partly shared-source CSS; verify only page-owned selectors when modifying. |
| `≤1440px` | desktop values reduce: hero `760px`, H1 `42px`, section title `38px`, card heights/paddings shrink | Test `1440/1441`; no intermediate fluid type is used for the main headings. |
| `≤1920px` / `≥1921px` | container padding changes; special consultation media padding at `≥1921px` | Large-screen behavior needs a real 2048/2560 browser pass before deployment. |

## Responsive Matrix

`Verified` means a real browser comparison was recorded in the previous pass. `CSS band` means the width is covered by the same actual media-query band but was not independently rerun in this audit turn.

| Width | Status | Active layout band / expected behavior | Finding |
|---:|---|---|---|
| 320 | CSS band | `≤540px` mobile | Needs runtime check for the longest card/form labels. |
| 360 | CSS band | `≤540px` mobile | No CSS-specific overflow source found. |
| 375 | CSS band | `≤540px` mobile | Same mobile rules as verified `390px`. |
| 390 | Verified | mobile | No horizontal overflow; clone/reference geometry matched. |
| 414 | CSS band | `≤540px` mobile | Same rules; image crop should be spot-checked. |
| 430 | CSS band | `≤540px` mobile | Same rules; no distinct breakpoint. |
| 480 | CSS band | `≤540px` mobile | Same rules; potential card text-height variance only. |
| 540 | Verified | exact mobile boundary | No horizontal overflow in prior sweep; one-column property cards. |
| 576 | CSS band | `541–640px` | Desktop header rules with compact facts grid. |
| 600 | CSS band | `541–640px` | Check 5/2-column facts transition only. |
| 640 | CSS band | exact facts boundary | `about-company__facts` switches at this value. |
| 720 | CSS band | `641–768px` | Tablet typography and stacked major grids. |
| 768 | Verified | exact tablet boundary | No horizontal overflow in prior sweep. |
| 800 | CSS band | `769–860px` | Newsletter is stacked/overlay composition. |
| 834 | CSS band | `769–860px` | Same newsletter band. |
| 900 | CSS band | `861–900px` | Newsletter returns to grid; facts still 5 columns. |
| 960 | CSS band | `901–1024px` | About facts become 6 columns; contact remains one column. |
| 1024 | Verified | exact tablet/desktop boundary | No horizontal overflow in prior sweep. |
| 1100 | CSS band | `1025–1280px` | Desktop grids; reduced H1/section spacing. |
| 1152 | CSS band | `1025–1280px` | No separate breakpoint. |
| 1200 | CSS band | `1025–1280px` | No separate breakpoint. |
| 1280 | Verified | exact reference desktop check | Geometry matched reference to recorded hundredths. |
| 1366 | CSS band | `1281–1440px` | Desktop reduced scale. |
| 1440 | Verified | exact desktop boundary | No horizontal overflow in prior sweep. |
| 1536 | CSS band | `1441–1920px` | Full desktop scale begins. |
| 1600 | CSS band | `1441–1920px` | No separate breakpoint. |
| 1728 | CSS band | `1441–1920px` | No separate breakpoint. |
| 1920 | Verified | exact max desktop boundary | No horizontal overflow in prior sweep. |
| 2048 | CSS-only | `≥1921px` | Must be rerun in a real browser; inspect special consultation media padding. |
| 2560 | CSS-only | `≥1921px` | Must be rerun in a real browser; inspect max-width and image crop. |

## Horizontal Overflow

The previous browser sweep reported no unexpected horizontal overflow at `390`, `540`, `768`, `1024`, `1280`, `1440` or `1920px`. The observed `documentElement.scrollWidth` was the layout width minus the stable `15px` scrollbar gutter, not an overflow condition.

Potential risk areas for future changes:

- service carousel intentionally uses a wide track and must keep `overflow-x: clip`;
- fixed floating expert uses `calc(100vw - 32px)` and should be retested at `320px`;
- long menu/card labels at `320–360px`;
- special `≥1921px` consultation media padding.

## Container System

| Viewport | Layout width observed | Container rule | Left/right padding | Max-width |
|---:|---:|---|---:|---:|
| `390px` | `375px` | mobile `calc(8.94118px + 1.96078vw)` | `16.28px / 16.28px` | `1920px` |
| `540px` | `525px` | mobile formula | approximately `19px` each | `1920px` |
| `768px` | `753px` | mobile formula through `≤768px` | approximately `23.7px` each | `1920px` |
| `1024px` | `1009px` | desktop formula `calc(-26.66667px + 6.59722vw)` | approximately `39.89px` each | `1920px` |
| `1280px` | `1265px` | desktop formula | `56.78px / 56.78px` | `1920px` |
| `1440px` | `1425px` | desktop formula | approximately `67.33px` each | `1920px` |
| `1920px` | `1905px` | desktop formula / max-width | approximately `99px` each | `1920px` |

The main `.base-container` is consistent for the core page, but several sections introduce independent systems: `.about-company__inner` max-width `1440px`, form max-width `610px`, strategy content max-width `850px`, and newsletter max-width `1920px`. These are visually intentional, but they are not a single universal grid.

## Grid System

- Global container: `width:100%`, `max-width:1920px`, responsive inline padding.
- Hero body: `minmax(0,1fr) auto`, gap `48px 64px`; one column at `≤1024px`.
- Stages body: `.92fr / 1.08fr`, `130px` gap reduced to `56px` at `≤1440px`; one column at `≤1024px`.
- Strategy: `937fr / 783fr`, `min-height:590px`; one column at `≤1024px`.
- About facts: 5 columns by default, 6 columns at `≥901px`, 2 columns at `≤640px`.
- Contact: `1.08fr / .92fr`, gap `clamp(34px,6vw,90px)`; one column at `≤1024px`.
- Property cards: 2 columns with `2px` gap; 1 column at `≤540px`.
- Newsletter: `.9fr / 1.1fr`, stacked background composition at `≤860px`.
- Services: flex track with fixed responsive slide width `430px`, `360px`, `280px`, or `82%`.

The grid strategy is strong at the tested widths. The main consistency cost is that several independent fractional systems and component-specific max-widths coexist without documented tokens.

## Typography

| Type | Font | Size | Weight | Line-height | Letter spacing | Color |
|---|---|---:|---:|---:|---:|---|
| H1 hero | Tilda Sans | `55px → 42px → 36px → 30px` | `400` | `1.2` | normal | `#fff` |
| Section H2 | Tilda Sans | `44px → 38px → 32px → 30px` | `300` | `1–1.2` | often normal / `.04em` | `#1e1e1e` |
| Newsletter H2 | Tilda Sans | `44px → 38px → 22px` | `300` | `1 → 1.2` | `-.04em` | `#1e1e1e` |
| Strategy / lead | Tilda Sans | `22px`, responsive | `300` | `1.35–1.4` | normal | `#1e1e1e` / muted white |
| Body | Tilda Sans | `16px`, mobile `15px` in about copy | `300–400` | `1.4–1.55` | normal | `#1e1e1e`, `#4f4d49` |
| Navigation | Tilda Sans | `18px → 16px` | `300–400` | `1.5` | normal | `#1e1e1e` |
| Button base | Tilda Sans | `20px → 16px → 15px` | `500` | `1` | normal | variant-dependent |
| Form input | Tilda Sans | `20px → 18px → 17px` | `300` | `1.3–1.35` | normal | white on dark form |
| Metadata | Tilda Sans | `10–15px` | `300–500` | component-specific | `.08–.16em` | muted / uppercase |

The type system is visually intentional, but it is mostly breakpoint-step based rather than fluid. H1 and major H2 values jump at `1440`, `1024`, `768` and `540` instead of using `clamp()`. This is acceptable for the reference clone, but future pages should use named type tokens so the jumps are explicit.

### Text wrapping

- H1 is capped at `925px` and had the same recorded box at `390px` and `1280px` as the reference.
- Major section headings use `max-width` values or full-width mobile layout; no orphan-word issue was observed in the verified widths.
- The unverified risk range is `320–360px`, especially the service labels, menu links, form CTA labels and property-card titles.

## Colors

| Token candidate | Value | Usage |
|---|---|---|
| Ink / primary text | `#1e1e1e` | global text, dark surfaces |
| Ink variant | `#1d1d1b` | about-company text |
| Brand burgundy | `#8b1d25` | primary CTA, accent, stats |
| Brand hover | `#801b22` | primary button hover |
| Dark surface | `#262626` | contact section |
| Light surface | `#f7f7f7` / `#f7f7f5` | secondary hover and pale surfaces |
| Neutral surface | `#f1f1f1` | image/card placeholders |
| Body muted | `#4f4d49` / `#656462` | secondary text, labels |
| Newsletter muted | `#7f7d7a` | newsletter secondary text |
| White | `#fff` | hero/form text and surfaces |
| Gold accent | `#e7c88f` | small accent usage |
| Error | `#ef4444` | form error borders |
| Dark overlay | `#00000047`, `#00000073`, `#0000008c` | hero/image overlays |
| Light border | `rgba(30,30,30,.12)` | dividers and carousel rules |

Contrast calculations against white:

- `#1e1e1e`: `16.67:1`, passes AA.
- `#8b1d25`: `9.13:1`, passes AA.
- `#656462`: `5.91:1`, passes AA for normal text.
- `#7f7d7a`: `4.10:1`, fails the `4.5:1` AA threshold for normal-size text. This is the clearest contrast finding.
- `#b2b2b2`: `2.12:1`, should remain border/decoration only, not body text.

There are hundreds of literal color occurrences and many alpha variants of the same ink/white. Unifying semantic color tokens would reduce accidental near-duplicates without changing the reference look.

## Spacing and Vertical Rhythm

Observed section spacing scale includes `2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 30, 32, 34, 36, 40, 42, 44, 48, 50, 56, 60, 68, 70, 72, 75, 88, 96, 100, 110, 120, 130, 140, 150px`.

The most common macro values are `40/48/60/75/96/150px`; the scale is therefore not a strict 4px or 8px system. The following component rhythm is intentional and should be preserved for the clone:

| Component | Desktop | Tablet | Mobile |
|---|---:|---:|---:|
| Hero min-height | `900px` | `640–760px` | `520–560px` |
| Stages padding | `96px` | `60px` | `40–48px` |
| Strategy padding | `75px` | `60px` | `40–48px` |
| Presentation padding | `150px` | `60px` | `40–48px` |
| Services padding | `150px` | `60px` | `40–48px` |
| Types padding | `150px` | `60px` | `40–48px` |
| Form section | `56–60px` / full-height contact | `48px` | `32px 0 30px` |
| Newsletter outer padding | `clamp(34px,5vw,88px)` | same | `0` |
| Service card padding | `50px` | `40px 32px` | `22–28px 18–24px` |

Internal gaps include `6px` form fields, `8px` button icon gap, `10–12px` tab gaps, `20–24px` heading/form gaps, `28–40px` content gaps and `48–64px` hero/strategy gaps.

## Buttons and Interactive Controls

### Button tokens found

| Variant | Height / min-height | Horizontal padding | Radius | Default | Hover / focus |
|---|---:|---:|---:|---|---|
| Base | `70px` | `28px` | `3px` | transparent / inherited | transition `.2s ease` |
| Medium | `40px` | `24px` | `3px` | inherited | same |
| Small | `38px` | `20px` | `3px` | inherited | same |
| Large | `70px`, then `56/68px` | `68px`, then `40/24px` | `3px` | variant-dependent | same |
| Primary | follows size | follows size | `3px` | `#8b1d25 / #fff` | `#801b22`; visible `2px` focus outline |
| Secondary | follows size | follows size | `3px` | `#fff`, border `#1e1e1e1f` | `#f7f7f7`, darker border |
| Full submit | large/mobile | full width | component overrides | primary | disabled/loading opacity |
| Icon button | component-specific | often `0` | none | transparent | opacity `.75` on desktop |

States present in CSS: default, hover, focus-visible, disabled and loading. Active/pressed state is inherited from browser/button behavior rather than consistently defined for every variant. Visited link states are not separately styled.

Accessibility observations:

- Global focus-visible outline exists: `2px` with `2px` offset.
- The header icon button has no explicit minimum touch target; its SVG is `20–24px`, below the recommended `44px` mobile target and below the WCAG 2.2 `24px` minimum target-size guidance in some contexts.
- Floating close control is `30px`; it is also smaller than the preferred `44px` touch area.
- Slider arrows and sticky controls should be checked for actual clickable box, not just SVG size, at `320–430px`.

## Links and Navigation

Static HTML contains `141` anchors, including `64` menu links. Empty visual anchors are labeled with `aria-label` for logos, phone and social links. Navigation is semantically represented by `nav` elements and the sticky navigation maps to in-page anchors.

The clone still contains absolute reference-domain URLs such as `https://front.barnes.vsavr.ru/...`. This is exact for a visual/reference clone, but it is not isolated behavior for a standalone local or future deployed clone. Internal route mapping should be decided before publishing the clone as an independent site.

## Cards and Images

### Card systems

- Property cards: `2px` grid gap, `4px` radius, dark surface, absolute image with `object-fit:cover`, min-height `399px → 340px → 280px → 240px → 220px`.
- Service cards: `aspect-ratio:566/425` on desktop, white surface, `50px` desktop padding, hover burgundy background, responsive min-heights `260px` and `220px`.
- Offer/contact cards: dark surfaces with radius `4px` and large editorial image treatments.
- Floating expert: fixed white card, `360px` max-width, `0 22px 62px #12121233` base shadow, animated pulse.

### Image audit

- `26` static `<img>` elements were found; all have an `alt` attribute. Empty alt values are used for decorative images, which is appropriate.
- `19` images use `loading="lazy"`; hero/above-the-fold imagery is not lazy-loaded.
- Local HTML/CSS image references resolve to existing files; no missing local asset was found.
- PNGs are intentionally kept for pixel parity but are the main performance cost. Largest files: `hero.png 1.82MB`, `services-bg.png 0.99MB`, `request-bg.png 0.93MB`, `strategy.png 0.84MB`, property images around `0.77–0.79MB`.
- Total asset directory size is approximately `13MB`.
- Main image CSS uses `object-fit:cover`; crop behavior is stable in the verified widths, but 2048/2560 should be visually checked.

## Forms

There are `3` static forms and a runtime feedback modal form:

1. catalog consultation;
2. catalog contact;
3. newsletter;
4. runtime feedback modal.

Form styling is consistent: max-width `610px`, vertical gap `6px`, inputs with transparent backgrounds and `1px` bottom borders, textarea min-height `72px` desktop / `64px` smaller sizes, submit min-height `58px` or `54px`.

Positive findings:

- Visible fields are wrapped in `<label>` elements.
- Placeholder copy and `autocomplete` values are present.
- Consent controls have visible text and links to legal notices.
- Focus styles change the border to white and add a `1px` white shadow on dark forms.

Findings:

- No visible field has a native `required` attribute.
- Forms are `novalidate`; the clone prevents default submission and replaces the button label with a local success message. This is not a real lead-capture flow.
- Error state classes exist in CSS, but the clone does not expose an accessible error summary or `aria-describedby` association.
- Honeypots are intentionally hidden and should remain excluded from the accessible name tree.

## Header, Mobile Menu, Sticky and Modal

- Header height recorded: `111px` at `1280px`, `69px` at `390px`.
- Desktop header uses a `1fr auto 1fr` grid with `20px` gap; at `≤1024px` it becomes `auto 1fr auto`; at `≤540px` it becomes centered flex with absolutely positioned edge controls.
- Scroll/menu-open state changes the header to fixed white background, dark text, logo brightness filter and z-index `1300` for menu-open.
- Mobile menu is a fixed panel from `top:var(--site-menu-top)` to the viewport bottom, z-index `1200`, with internal scrolling. The previously verified menu had `64` links and matched the reference box at `390px`: `[0,69,375,775]`.
- Sticky navigation becomes visible after approximately `0.72 * viewport height` and changes the active link by section. This behavior was verified in the prior interaction pass.
- Feedback modal uses `role="dialog"` and `aria-modal="true"`, but it does not expose an `aria-labelledby` reference to its title. Focus trapping and focus restoration are not implemented in the clone script.
- Menu/modal state uses body scroll locking. The clone should keep `aria-expanded` synchronized on the menu trigger and restore focus to the trigger after closing.

## SEO and Technical Foundations

| Check | Result | Assessment |
|---|---|---|
| Title | present: `Продать элитную недвижимость в России и по всему миру с BARNES` | Good, but long; measure against the final production SERP title. |
| Meta description | absent | P2 if indexable; add a unique 150–160 character description. |
| Canonical | absent | P2 if indexable; add self-referencing canonical on production route. |
| Robots | `noindex, nofollow` | Correct for a private clone; blocking if deployed as the public page. |
| H1 | exactly `1` | Good. |
| H2/H3 | `10` H2, `12` H3 | Logical overall; verify duplicated responsive consultation headings with a screen reader. |
| JSON-LD | no `application/ld+json` in static HTML | Add Organization/LocalBusiness and WebPage/Breadcrumb schema when production SEO is in scope. |
| Viewport | `width=device-width, initial-scale=1` | Good. |
| Images | all have `alt`; 19 lazy | Good baseline; improve modern-format delivery where parity allows. |
| Local assets | all local refs resolve | Good. |
| HTTPS / mixed content | local clone uses local asset paths; reference links are HTTPS | Good for assets; external navigation remains reference-domain dependent. |
| Sitemap / robots.txt | not part of page folder | Must be audited at repository/site level before indexing. |

## Accessibility

### Passed / mostly healthy

- One visible page H1.
- Header, navigation, main, footer, forms and sections use semantic elements.
- Buttons declare `type`.
- Images have `alt`, with empty alt for decorative imagery.
- Focus-visible outline is defined globally and for UI buttons.
- Form fields are label-wrapped.
- Menu has dialog semantics and a visible accessible label.

### Open accessibility issues

- Modal has no `aria-labelledby`; add an `id` to `.feedback-modal__title` and reference it.
- Menu trigger state should expose and update `aria-expanded`; close should restore focus.
- Modal should trap focus while open, close on Escape, and restore focus to the launching CTA.
- Icon-only header/floating/slider controls need a minimum clickable area of at least `44×44px` where possible.
- `#7f7d7a` on white is approximately `4.10:1`, below the `4.5:1` normal-text AA target.
- Forms need required-field semantics, inline errors, `aria-invalid` and `aria-describedby` when validation is added.

## Performance

The main performance concern is payload, not layout complexity:

- approximately `13MB` of page assets;
- many large PNG backgrounds and editorial images;
- one large `source.css` file around `660KB`;
- local fonts include eight weights, which preserves the reference but increases font payload;
- floating expert pulse animation uses box-shadow expansion, which can be paint-heavy on mobile;
- stable image dimensions are present for most content images, reducing layout shift risk.

Recommended performance path: keep exact reference assets for the visual audit, then create an opt-in production optimization pass using AVIF/WebP derivatives, responsive `srcset`, font subset/weight review and a measured LCP/CLS/INP baseline. Do not replace assets during a pixel-parity task without screenshot comparison.

## Consistency Issues

- Literal colors are repeated in many alpha variants instead of semantic tokens.
- Spacing uses many one-off values (`19`, `22`, `34`, `42`, `53`, `68`, `75`, `88`, `96`, `130`, `150`) alongside the common scale.
- Radius values are fragmented across `0`, `2`, `3`, `4` and `999px`.
- Main headings have multiple breakpoint steps; this matches the reference but should be named as a documented type ramp.
- Section containers are mostly aligned, but about-company, strategy, forms and newsletter each add independent max-widths.
- Primary/secondary UI button tokens are centralized in the source stylesheet, while page-specific CTA overrides duplicate dimensions and typography.

## Master Issue Table

| ID | Status | Viewport | Section | Element | Current | Problem | Recommended | Priority |
|---|---|---|---|---|---|---|---|---|
| UI-001 | OPEN | all | Forms | submit handlers | `preventDefault()` + fake success | No real submission, validation or error announcement | Connect to the intended endpoint; add `required`, validation, `aria-invalid`, `aria-describedby` and success/error states | P2 |
| UI-002 | INTENTIONAL / VERIFY | all | SEO | robots/meta | `noindex, nofollow`; no description/canonical | Correct for clone, blocks production indexing | Keep for staging; add production canonical, description, robots and schema before public release | P2 |
| UI-003 | OPEN | all | Performance | assets/CSS | ~`13MB` assets; `source.css` ~`660KB` | Slow first load and higher mobile data cost | Add measured responsive image derivatives and CSS/font optimization after parity sign-off | P2 |
| UI-004 | OPEN | all | Navigation | 141 anchors | many links point to `front.barnes.vsavr.ru` | Clone navigation exits the separate page/site | Map internal routes for the clone or explicitly document reference-only links | P2 |
| UI-005 | OPEN | 320–430 | Floating/header | icon controls | `20–30px` visual/control sizes | Small touch targets on mobile | Use at least `44×44px` hit areas while preserving icon size | P2 |
| UI-006 | OPEN | modal/menu | Mobile nav / modal | ARIA state/focus | missing labelledby/focus trap/restoration; menu state needs expanded sync | Keyboard and assistive-tech state is incomplete | Add labelled dialog title, focus trap, Escape handling and focus restoration | P2 |
| UI-007 | OPEN | all | Newsletter | muted text | `#7f7d7a` on `#fff` ≈ `4.10:1` | Fails normal-text AA contrast | Darken to at least approximately `#6f6d6a` or increase font size/weight; verify exact rendered pair | P3 |
| UI-008 | OPEN | 320–640 | About facts | facts grid | 5 columns → 6 columns at `901`, then 2 columns at `640` | Multiple local transitions can create uneven label wrapping | Add runtime snapshots at `640/641` and define minimum label height | P3 |
| UI-009 | OPEN | 320–360 | Typography | long labels | smallest widths not runtime-verified in current pass | Potential orphan words/card height variance | Run 320/360 visual pass; use controlled max-width or copy breaks only if confirmed | P3 |
| UI-010 | OPEN | 2048–2560 | Large desktop | consultation/media | special `≥1921px` media padding | Large-screen crop and alignment not browser-verified | Run 2048/2560 snapshots and compare container guide to `1920px` | P3 |
| UI-011 | OPEN | all | Design system | literal values | many literal colors/spacing/radii | Future pages can drift from this page | Extract semantic tokens without changing current rendered values | P3 |
| UI-012 | OPEN | all | Motion | transitions/animation | pulse and multiple transitions; only some reduced-motion rules | Motion reduction is not uniformly documented across components | Add component-level reduced-motion rules and test with `prefers-reduced-motion: reduce` | P4 |

## Recommended Design System

### Typography tokens

```text
--font-brand: "Tilda Sans", "Tilda Sans Fallback", system-ui, sans-serif
--type-hero: 55px / 1.2 / 400
--type-h1-laptop: 42px / 1.2 / 400
--type-h1-tablet: 36px / 1.2 / 400
--type-h1-mobile: 30px / 1.2 / 400
--type-display: 44px / 1.0–1.2 / 300
--type-section-laptop: 38px / 1.0–1.2 / 300
--type-section-mobile: 30px / 1.2 / 300
--type-body: 16px / 1.4–1.55 / 300–400
--type-body-mobile: 15px / 1.5 / 300–400
--type-button: 15–20px / 1 / 500
```

### Color tokens

```text
--color-ink: #1e1e1e
--color-ink-soft: #4f4d49
--color-muted: #656462
--color-paper: #ffffff
--color-surface: #f7f7f7
--color-surface-neutral: #f1f1f1
--color-brand: #8b1d25
--color-brand-hover: #801b22
--color-dark-surface: #262626
--color-border: rgba(30,30,30,.12)
--color-error: #ef4444
```

### Layout tokens

```text
--container-max: 1920px
--container-pad-desktop: calc(-26.66667px + 6.59722vw)
--container-pad-mobile: calc(8.94118px + 1.96078vw)
--grid-rule: 1px solid rgba(30,30,30,.12)
--card-radius: 4px
--button-radius: 3px
--control-radius: 0–3px depending on form/reference component
```

### Breakpoint tokens

```text
--bp-mobile: 540px
--bp-facts: 640px
--bp-tablet: 768px
--bp-newsletter-stack: 860px
--bp-facts-wide: 901px
--bp-layout: 1024px
--bp-header-tight: 1280px
--bp-desktop-scale: 1440px
--bp-canvas: 1920px
```

## Actionable Checklist

### Before publishing the clone

- [ ] Decide whether `noindex, nofollow` is intentional for this route.
- [ ] Decide whether reference-domain absolute links should remain or be mapped to clone routes.
- [ ] Connect all forms to the actual endpoint and add real validation/error/success states.
- [ ] Add production title/description/canonical/robots policy and JSON-LD where applicable.
- [ ] Add `aria-labelledby`, `aria-expanded`, focus trap and focus restoration for menu/modal.
- [ ] Expand icon-control hit areas to at least `44×44px` on touch layouts.
- [ ] Fix the `#7f7d7a` contrast pair if it is used for normal-size text.

### Before the next UI iteration

- [ ] Run real browser snapshots at every requested width from `320px` through `2560px`, especially `320/360`, `540/541`, `640/641`, `768/769`, `860/861`, `900/901`, `1024/1025`, `1440/1441` and `1920/1921`.
- [ ] Check viewport heights `1366×768`, `1440×900`, `1920×1080`, `2560×1440`, `390×844`, `375×667`, `430×932`.
- [ ] Run keyboard-only checks for header, menu, sticky links, tabs, forms, accordion, carousel arrows, modal and footer links.
- [ ] Capture LCP/CLS/INP after image optimization, not before.
- [ ] Keep reference screenshots and compare after each asset or typography change.

### If the design system is formalized

- [ ] Replace literal repeated colors with semantic tokens.
- [ ] Document the existing spacing scale before normalizing values.
- [ ] Keep the reference-specific section heights as component tokens.
- [ ] Document the intentional non-uniform radii (`0/2/3/4/999px`).
- [ ] Create shared button, form-field, card, link and dialog primitives without changing current pixel output.

## Audit History

### 2026-10-06

- Added the first full technical UI/design audit for the owner-sale page.
- Documented page structure, actual CSS breakpoints, container/grid rules, typography, colors, spacing, components, forms, images, accessibility and technical SEO.
- Recorded verified geometry from the previous browser parity pass at `390px` and `1280px`, plus responsive checks at `540/768/1024/1440/1920px`.
- Added a single current master issue table with `12` findings and explicit priorities/statuses.
- No production code or assets were changed during the audit.
