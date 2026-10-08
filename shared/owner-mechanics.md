# Owner-page mechanics: reference parity

Reference: `for-partners/assets/how-it-works.css`, section `#how-it-works` (eyebrow «МЕХАНИКА ПАРТНЁРСТВА»).

Applied locally to rent's `.owner-sale-exclusive` and sale's existing equivalent `.owner-sale-stages`. Text and item counts remain unchanged; no new section is inserted.

The shared stylesheet `owner-mechanics.css` is loaded after each page's existing stylesheet and overrides only these two sections.

- Desktop columns: .86fr / 1.14fr, gap clamp(52px, 6vw, 116px).
- Main title: clamp(38px, 3.05vw, 52px), weight 300, line-height 1.08.
- Sale's additional lead: 38px, weight 300, line-height 1.15.
- Left description: 25px / 1.3; up to 900px: 16px / 1.3.
- Item headings: clamp(23px, 1.75vw, 30px), weight 400, line-height 1.15.
- Item descriptions: 22px / 1.35, weight 300.
- Number column: 52px, gap 24px; row padding 34px 0 36px.
- Up to 900px: one column, title 36px, static reading order.
- Up to 540px: title 28px / 1.12, item heading 20px, item description 15px / 1.35, number column 30px, gap 14px.
- Desktop sticky position: clamp(170px, 25vh, 238px).
- Motion: upcoming opacity .28, past .48, active 1; active content moves -8px horizontally. Existing scroll controllers set the active row and final-row alignment.
- Reduced motion keeps all item content visible without transitions.

Rent's forced title-line wrapping is removed to fit the new left column naturally. The negative overlap with the next section is removed. The rent CTA invokes the existing hero request handler.

Publication of both owner routes was explicitly authorised on 2026-10-08. Other landing pages are unaffected.
