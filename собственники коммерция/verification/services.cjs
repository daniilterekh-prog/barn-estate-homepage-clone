const fs = require("node:fs"),
  path = require("node:path"),
  assert = require("node:assert/strict");
const {
  chromium,
} = require("/home/daniil/.local/share/codex-toolkit/node_modules/playwright");
const reference =
  "https://daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/";
const target = process.env.COMMERCIAL_PREVIEW_URL || "http://127.0.0.1:8796/";
const selectors = [
  ".owner-sale-services",
  ".owner-sale-services__header-wrap",
  ".owner-sale-services__title",
  ".owner-sale-services__slider",
  ".splide__track",
  ".splide__list",
  ".splide__slide",
  ".owner-sale-services__card",
  ".owner-sale-services__number",
  ".owner-sale-services__text",
  ".owner-sale-services__text strong",
  ".owner-sale-services__text span",
  ".barn-slider-footer",
  ".owner-sale-services__cta",
  ".owner-sale-services__nav",
  ".owner-sale-services__nav-btn",
];
function measure(selectors) {
  const root = document.querySelector(".owner-sale-services");
  return Object.fromEntries(
    selectors.map((sel) => {
      const e = sel === ".owner-sale-services" ? root : root.querySelector(sel);
      if (!e) return [sel, null];
      const r = e.getBoundingClientRect(),
        s = getComputedStyle(e);
      return [
        sel,
        {
          width: Math.round(r.width * 1000) / 1000,
          display: s.display,
          minHeight: s.minHeight,
          padding: s.padding,
          marginTop: s.marginTop,
          gap: s.gap,
          font: s.font,
          border: s.border,
          borderRadius: s.borderRadius,
        },
      ];
    }),
  );
}
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ reducedMotion: "reduce" });
  await p.route("https://front.barnes.vsavr.ru/**", (r) => r.abort());
  const report = {
    reference,
    target,
    checkedAt: new Date().toISOString(),
    viewports: [],
    errors: [],
  };
  p.on("pageerror", (e) => report.errors.push(e.message));
  try {
    for (const width of [320, 390, 768, 1024, 1440, 1920, 2560]) {
      await p.setViewportSize({ width, height: 1000 });
      const row = { width };
      for (const [key, url] of [
        ["reference", reference],
        ["target", target],
      ]) {
        await p.goto(url, { waitUntil: "networkidle" });
        await p.evaluate(async () => {
          await document.fonts.ready;
          await new Promise((r) =>
            requestAnimationFrame(() => requestAnimationFrame(r)),
          );
        });
        await p.locator(".owner-sale-services").scrollIntoViewIfNeeded();
        await p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
        row[key] = await p.evaluate(measure, selectors);
      }
      for (const sel of selectors) {
        assert(row.reference[sel] && row.target[sel], sel);
        assert.deepEqual(
          row.target[sel],
          row.reference[sel],
          `${sel} differs at ${width}`,
        );
      }
      assert.equal(await p.locator(".owner-sale-services__card").count(), 11);
      assert.equal(
        (await p.locator(".owner-sale-services__cta").innerText()).trim(),
        "Обсудить стратегию продажи",
      );
      const fits = await p
        .locator(".owner-sale-services__card")
        .evaluateAll((cards) =>
          cards.map((card) => {
            const c = card.getBoundingClientRect();
            return [
              ...card.querySelectorAll(
                ".owner-sale-services__number,strong,.owner-sale-services__text>span",
              ),
            ].every((e) => {
              const r = e.getBoundingClientRect();
              return (
                r.top >= c.top &&
                r.bottom <= c.bottom + 1 &&
                r.right <= c.right + 1 &&
                r.left >= c.left - 1
              );
            });
          }),
        );
      assert(fits.every(Boolean), "Card text exceeds boundaries at " + width);
      const next = p.locator(".owner-sale-services__nav-btn").last(),
        previous = p.locator(".owner-sale-services__nav-btn").first();
      assert(await previous.isDisabled());
      await next.focus();
      await next.press("Enter");
      assert(await previous.isEnabled(), "Next button keyboard");
      for (let i = 0; i < 15 && (await next.isEnabled()); i++)
        await next.click();
      assert(await next.isDisabled(), "Last card reachable");
      await p.waitForFunction(() => {
        const e = document.querySelector('.owner-sale-services .splide__slide:last-child');
        const a = e.getBoundingClientRect(), b = e.closest('.splide__track').getBoundingClientRect();
        return a.right <= b.right + 2 && a.left >= b.left - 2;
      });
      const lastVisible = await p
        .locator(".owner-sale-services .splide__slide")
        .last()
        .evaluate((e) => {
          const a = e.getBoundingClientRect(),
            b = e.closest(".splide__track").getBoundingClientRect();
          return a.right <= b.right + 2 && a.left >= b.left - 2;
        });
      assert(lastVisible, "Last slide is fully visible");
      await previous.click();
      assert(await next.isEnabled());
      if ([390, 1440].includes(width)) {
        while (await previous.isEnabled()) await previous.click();
        await p
          .locator(".owner-sale-services")
          .screenshot({ path: path.join(__dirname, `services-${width}.png`) });
      }
      await p.locator(".owner-sale-services__cta").click();
      await p.waitForFunction(() => {
        const r = document.querySelector("#request").getBoundingClientRect();
        return r.top < innerHeight && r.bottom > 0;
      });
      row.passed = true;
      report.viewports.push(row);
      console.log(JSON.stringify({ width, passed: true }));
    }
    assert.deepEqual(report.errors, []);
    report.passed = true;
    fs.writeFileSync(
      path.join(
        __dirname,
        process.env.COMMERCIAL_PREVIEW_URL
          ? "services-publication.json"
          : "services.json",
      ),
      JSON.stringify(report, null, 2) + "\n",
    );
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
