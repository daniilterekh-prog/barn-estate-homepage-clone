const fs = require("node:fs"),
  path = require("node:path"),
  crypto = require("node:crypto"),
  assert = require("node:assert/strict");
const {
  chromium,
} = require("/home/daniil/.local/share/codex-toolkit/node_modules/playwright");
const out = __dirname,
  root = path.dirname(out),
  base = process.env.COMMERCIAL_PREVIEW_URL || "http://127.0.0.1:8796/";
const refs = {
  sale: "https://daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam/",
  city: "https://daniilterekh-prog.github.io/barn-estate-homepage-clone/gorodskaya-nedvizhimost/",
};
const styles = (selector) => {
  const e = document.querySelector(selector),
    s = getComputedStyle(e),
    r = e.getBoundingClientRect();
  return {
    width: Math.round(r.width * 1000) / 1000,
    padding: s.padding,
    columnGap: s.columnGap,
    rowGap: s.rowGap,
    columns: s.gridTemplateColumns.split(" ").length,
    fontSize: s.fontSize,
    fontWeight: s.fontWeight,
    lineHeight: s.lineHeight,
    letterSpacing: s.letterSpacing,
    color: s.color,
    background: s.backgroundColor,
    borderRadius: s.borderRadius,
  };
};
const directions = [
  ".owner-sale-types__grid",
  ".owner-sale-types__card",
  ".owner-sale-types__title",
  ".owner-sale-types__action",
];
const faq = [
  ".catalog-faq",
  ".catalog-faq__inner",
  ".catalog-faq__title",
  ".catalog-faq__grid",
  ".catalog-faq__question",
  ".catalog-faq__question-text",
  ".catalog-faq__answer-content",
];
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ reducedMotion: "reduce" });
  await p.route("https://front.barnes.vsavr.ru/**", (r) => r.abort());
  const report = {
    url: base,
    references: refs,
    checkedAt: new Date().toISOString(),
    widths: [],
    errors: [],
  };
  p.on("pageerror", (e) => report.errors.push(e.message));
  try {
    async function ready(url) {
      await p.goto(url, { waitUntil: "networkidle" });
      await p.evaluate(async () => {
        await document.fonts.ready;
        await new Promise((r) =>
          requestAnimationFrame(() => requestAnimationFrame(r)),
        );
      });
    }
    for (const width of [320, 390, 768, 1440, 1920]) {
      await p.setViewportSize({ width, height: 1000 });
      const row = { width };
      await ready(refs.sale);
      row.referenceDirections = Object.fromEntries(
        await Promise.all(
          directions.map(async (sel) => [sel, await p.evaluate(styles, sel)]),
        ),
      );
      await ready(refs.city);
      row.referenceFaq = Object.fromEntries(
        await Promise.all(
          faq.map(async (sel) => [sel, await p.evaluate(styles, sel)]),
        ),
      );
      await ready(base);
      row.directions = Object.fromEntries(
        await Promise.all(
          directions.map(async (sel) => [sel, await p.evaluate(styles, sel)]),
        ),
      );
      row.faq = Object.fromEntries(
        await Promise.all(
          faq.map(async (sel) => [sel, await p.evaluate(styles, sel)]),
        ),
      );
      for (const side of ['directions','referenceDirections']) delete row[side]['.owner-sale-types__title'].width;
      for (const side of ['faq','referenceFaq']) delete row[side]['.catalog-faq__question-text'].width;
      assert.deepEqual(
        row.directions,
        row.referenceDirections,
        "Directions differ at " + width,
      );
      assert.deepEqual(
        row.faq,
        row.referenceFaq,
        "FAQ styles differ at " + width,
      );
      assert.equal(await p.locator(".owner-sale-types__card").count(), 3);
      assert.equal(await p.locator("#faq .catalog-faq__question").count(), 6);
      assert.equal(
        await p.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        "Horizontal overflow",
      );
      const questions = p.locator("#faq .catalog-faq__question");
      for (let i = 0; i < 6; i++) {
        const q = questions.nth(i);
        await q.focus();
        await q.press(i % 2 ? "Space" : "Enter");
        assert.equal(await q.getAttribute("aria-expanded"), "true");
        const answer = p.locator("#" + (await q.getAttribute("aria-controls")));
        assert.equal(await answer.getAttribute("aria-hidden"), "false");
        assert.equal(await answer.evaluate((e) => e.inert), false);
        await p.waitForFunction(
          (id) =>
            document.getElementById(id).getBoundingClientRect().height > 10,
          await q.getAttribute("aria-controls"),
        );
        await q.press("Enter");
        assert.equal(await q.getAttribute("aria-expanded"), "false");
        assert.equal(await answer.evaluate((e) => e.inert), true);
      }
      if (width > 540) {
        const paired = await p.evaluate(() => {
          const q = [
            ...document.querySelectorAll("#faq .catalog-faq__question"),
          ];
          return q
            .slice(0, 3)
            .every(
              (e, i) =>
                Math.abs(
                  e.getBoundingClientRect().top -
                    q[i + 3].getBoundingClientRect().top,
                ) < 1,
            );
        });
        assert(paired, "FAQ rows must align");
      }
      const newsletter = p.locator(".newsletter-cta");
      await newsletter.scrollIntoViewIfNeeded();
      await newsletter.locator("img").evaluate((i) => i.decode());
      row.newsletterImage = await newsletter
        .locator("img")
        .evaluate((i) => ({
          url: i.currentSrc,
          width: i.naturalWidth,
          height: i.naturalHeight,
        }));
      assert(
        row.newsletterImage.url.includes(
          width <= 540 ? "magazines-mobile.webp" : "magazines-desktop.webp",
        ),
      );
      if ([390, 1440].includes(width)) {
        for (const [slug, selector] of [
          ["directions", ".owner-sale-types"],
          ["faq", "#faq"],
          ["newsletter", ".newsletter-cta"],
        ])
          await p
            .locator(selector)
            .screenshot({
              path: path.join(out, `updated-${slug}-${width}.png`),
            });
      }
      report.widths.push(row);
      console.log(JSON.stringify({ width, passed: true }));
    }
    const sha = (b) => crypto.createHash("sha256").update(b).digest("hex");
    report.newsletterHashes = JSON.parse(
      fs.readFileSync(path.join(root, "assets/newsletter/source.json")),
    ).images.map((i) => {
      const hash = sha(
        fs.readFileSync(path.join(root, "assets/newsletter", i.file)),
      );
      assert.equal(hash, i.sha256);
      return { file: i.file, sha256: hash };
    });
    if (process.env.COMMERCIAL_PREVIEW_URL) {
      report.publishedNewsletterHashes = await Promise.all(report.newsletterHashes.map(async entry => {
        const response = await fetch(new URL('assets/newsletter/'+entry.file,base));
        assert.equal(response.status,200);
        const hash = sha(Buffer.from(await response.arrayBuffer()));
        assert.equal(hash,entry.sha256,'Published newsletter image must match the reference');
        return {file:entry.file,sha256:hash};
      }));
    }
    report.directionHashes = [
      "service-city.webp",
      "service-country.webp",
      "service-rent.webp",
    ].map((file) => ({
      file,
      sha256: sha(fs.readFileSync(path.join(root, "assets/directions", file))),
    }));
    assert.deepEqual(report.errors, []);
    report.passed = true;
    fs.writeFileSync(
      path.join(
        out,
        process.env.COMMERCIAL_PREVIEW_URL
          ? "directions-faq-newsletter-publication.json"
          : "directions-faq-newsletter.json",
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
