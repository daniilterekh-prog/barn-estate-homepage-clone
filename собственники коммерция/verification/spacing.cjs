const fs = require("node:fs"),
  path = require("node:path"),
  assert = require("node:assert/strict");
const {
  chromium,
} = require("/home/daniil/.local/share/codex-toolkit/node_modules/playwright");
const selectors = [
  ".owner-sale-hero",
  ".owner-sale-hero__content",
  ".owner-sale-hero__title",
  ".owner-sale-hero__description",
  ".owner-sale-presentation",
  ".owner-sale-presentation__inner",
  ".owner-sale-presentation__title",
  ".owner-sale-presentation__grid",
  ".owner-sale-presentation__card",
  ".owner-sale-services",
  ".owner-sale-services__inner",
  ".owner-sale-services__title",
  ".owner-sale-services__card",
  ".about-company",
  ".about-company__inner",
  ".about-company__title",
  ".owner-sale-stages",
  ".owner-sale-stages__inner",
  ".owner-sale-stages__list",
  ".owner-sale-stages__item",
  ".owner-sale-stages__item-title",
  "#why-barnes .be-section",
  "#why-barnes .be-panorama-header",
  "#why-barnes .be-tabs",
  "#why-barnes .be-tab-panel",
  ".owner-sale-strategy",
  ".owner-sale-strategy__inner",
  ".owner-sale-strategy__content",
  ".owner-sale-strategy__title",
  ".catalog-consultation",
  ".catalog-consultation__inner",
  ".catalog-consultation__title",
  ".owner-sale-types",
  ".owner-sale-types__inner",
  ".owner-sale-types__title",
  ".owner-sale-types__grid",
  ".newsletter-cta",
  ".site-footer",
];
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.route("https://front.barnes.vsavr.ru/**", (route) => route.abort());
  const report = {
    reference:
      "https://daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/",
    target: process.env.COMMERCIAL_PREVIEW_URL || "http://127.0.0.1:8796/",
    checkedAt: new Date().toISOString(),
    widths: [],
    errors: [],
  };
  p.on("pageerror", (e) => report.errors.push(e.message));
  for (const width of [
    320, 390, 540, 768, 900, 1024, 1280, 1440, 1600, 1920, 2560, 3840,
  ]) {
    await p.setViewportSize({ width, height: 1000 });
    const row = { width };
    for (const key of ["reference", "target"]) {
      await p.goto(report[key], { waitUntil: "networkidle" });
      await p.evaluate(async () => {
        await document.fonts.ready;
        await new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        );
      });
      row[key] = await p.evaluate(
        (selectors) =>
          Object.fromEntries(
            selectors.map((sel) => {
              const e = document.querySelector(sel);
              if (!e) return [sel, null];
              const box = e.getBoundingClientRect(),
                parent = e.parentElement.getBoundingClientRect(),
                s = getComputedStyle(e),
                frame = e.classList.contains("base-container"),
                px = (n) => Math.round(n * 1000) / 1000 + "px";
              return [
                sel,
                {
                  padding: [
                    s.paddingTop,
                    s.paddingRight,
                    s.paddingBottom,
                    s.paddingLeft,
                  ],
                  margin: [
                    s.marginTop,
                    frame ? px(parent.right - box.right) : s.marginRight,
                    s.marginBottom,
                    frame ? px(box.left - parent.left) : s.marginLeft,
                  ],
                  gap: [s.rowGap, s.columnGap],
                  height: box.height,
                },
              ];
            }),
          ),
        selectors,
      );
    }
    row.targetExtra = await p.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      faqSpace: getComputedStyle(document.querySelector(".commercial-faq"))
        .paddingTop,
      sectionSpace: getComputedStyle(
        document.querySelector(".owner-sale-types"),
      ).paddingTop,
      faqTitleGap: getComputedStyle(
        document.querySelector(".commercial-faq__title"),
      ).marginBottom,
      contentSpace: getComputedStyle(document.body)
        .getPropertyValue("--uk-content")
        .trim(),
    }));
    assert.equal(row.targetExtra.overflow, false, "Overflow at " + width);
    assert.equal(
      row.targetExtra.faqSpace,
      row.targetExtra.sectionSpace,
      "FAQ section spacing at " + width,
    );
    assert.equal(
      row.targetExtra.faqTitleGap,
      row.targetExtra.contentSpace,
      "FAQ heading gap at " + width,
    );
    if ([390, 1440].includes(width)) {
      await p.locator(".owner-sale-stages").scrollIntoViewIfNeeded();
      await p.screenshot({
        path: path.join(__dirname, "spacing-stages-" + width + ".png"),
      });
      await p.evaluate(() => scrollTo(0, 0));
      await p.screenshot({
        path: path.join(__dirname, "spacing-page-" + width + ".png"),
        fullPage: true,
      });
    }
    row.differences = selectors.flatMap((sel) => {
      const a = row.reference[sel],
        c = row.target[sel];
      if (!a || !c) return [];
      return ["padding", "margin", "gap"].flatMap((k) =>
        JSON.stringify(a[k]) === JSON.stringify(c[k])
          ? []
          : [{ selector: sel, property: k, reference: a[k], target: c[k] }],
      );
    });
    report.widths.push(row);
    assert.deepEqual(row.differences, [], "Spacing differs at " + width);
    console.log(JSON.stringify({ width, differences: row.differences.length }));
  }
  assert.deepEqual(report.errors, []);
  report.passed = true;
  fs.writeFileSync(
    path.join(
      __dirname,
      process.env.COMMERCIAL_PREVIEW_URL
        ? "spacing-publication.json"
        : "spacing.json",
    ),
    JSON.stringify(report, null, 2) + "\n",
  );
  await b.close();
})();
