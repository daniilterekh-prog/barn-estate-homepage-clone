# Почему собственники выбирают BARNES — панорама

Selected component from `BARNES_Why_Panorama_Codex.zip`, mounted on both existing owner routes after their scrolling path section. The rent route waits for Nuxt hydration before insertion.

Files: `owner-panorama.js`, `owner-panorama.css`, `assets/barnes-private-salon.webp`. The selected image is a conceptual architectural illustration, not a photograph of the Moscow office. Existing Tilda Sans is reused.

Four tabs use automatic activation, roving tabindex, ArrowLeft/ArrowRight/Home/End and a labelled focusable panel. The image remains stationary; the CTA follows the left headline. All four panel contents, including a non-interactive CTA measurement replica, are measured at the current width; the maximum height is applied to the live panel. Measurement repeats on width changes and font loading.

Container: maximum 1920px with existing page gutter formula and 100px wide gutters; 22px mobile gutters. White background, burgundy #8b1d25, 1px radius. At mobile widths tabs become a 2×2 grid; panel content becomes a single column. Typography and image cropping follow the supplied component.

CTA: «Консультация эксперта» on both routes. The button sits directly beneath the left argument headline, with a 28px desktop / 24px mobile gap. It is preserved during tab changes so its form handler and focus remain intact. Both invoke the current hero request handler. Event `barnes:owner-request` retains direction and source `why-barnes-panorama`; form dataset records the same context. No simulated submission state is added.

Active argument uses a white editorial panel with a 2px burgundy left border, 36px spacing above and 32/32/36px inner padding. Its headline uses an intentional user-requested larger role: 32/38.4px, weight 300 (mobile 24/28.8px); description uses Lead 22/33px, weight 300 (mobile 15/21px). Evidence uses 18/27px (mobile 15/21px), separated by a thin line and 24px spacing. Mobile panel padding is 24/20px. All arguments remain height-matched by measurement.

Headlines describe concrete services rather than abstract positioning: presentation to relevant tenants/buyers, promotion through owned media, justification of rental rate/sale price and deal terms, and connecting overseas offices to the search. Rent and sale terminology is kept separate; no guaranteed outcome, price or timing is claimed.

Tab numbers use outlined square shapes with 1px radius, 42px desktop / 36px mobile; the active number has burgundy fill and white text. Labels sit to the right, vertically centred, with a 16px desktop / 10px mobile gap. Numbers never shrink; tab targets remain at least 48px tall. Top indicator lines are removed. This is an intentional user-requested component variant.

Tab labels use 22/26.4px, weight 400, and 18/21.6px up to 600px. The tab grid is four columns on desktop, two up to 1000px, and one up to 360px to retain readable labels beside the numbers without overflow. Number typography is unchanged.

The introductory sentence beside the section title and the channel-selection note were removed at the user's request. Publication of both owner routes was explicitly authorised on 2026-10-08. Shared files remain scoped to these routes; other landing pages are unaffected.

## Current request modal image

Both owner routes use the existing real portrait `pictures/consultation/cta-ruslan-pruss.webp` in the modal's right column instead of a generated interior. The portrait has descriptive alt text, `object-fit: contain` and bottom-centred placement, so the head is never cropped. A separate generated old-money library background (`assets/modal-expert-old-money.webp`) sits behind the unmodified real cutout via CSS; this is not presented as an actual BARNES office. Mobile retains the stacked layout with a 240px-tall contained portrait. Request fields and submission handlers are unchanged.
