const fs = require("node:fs"),
  path = require("node:path"),
  assert = require("node:assert/strict"),
  crypto = require("node:crypto");
const {
  chromium,
} = require("/home/daniil/.local/share/codex-toolkit/node_modules/playwright");
const root = path.dirname(__dirname),
  base = process.env.COMMERCIAL_PREVIEW_URL || "http://127.0.0.1:8796/";
(async () => {
  const b = await chromium.launch(),
    p = await b.newPage({ reducedMotion: "reduce" }),
    report = {
      url: base,
      checkedAt: new Date().toISOString(),
      viewports: [],
      errors: [],
    };
  p.on("pageerror", (e) => report.errors.push(e.message));
  p.on("response", (r) => {
    if (r.status() >= 400) report.errors.push(r.status() + " " + r.url());
  });
  try {
    for (const width of [320, 390, 768, 1024, 1440, 1920, 2560]) {
      await p.setViewportSize({ width, height: 1000 });
      await p.goto(base, { waitUntil: "networkidle" });
      const section = p.locator(".catalog-consultation");
      await section.scrollIntoViewIfNeeded();
      await section
        .locator("img")
        .evaluateAll((images) => Promise.all(images.map((i) => i.decode())));
      const state = await section.evaluate((e) => ({
        width: innerWidth,
        overflow: document.documentElement.scrollWidth > innerWidth,
        images: [...e.querySelectorAll("img")].map((i) => ({
          src: i.currentSrc,
          width: i.naturalWidth,
          height: i.naturalHeight,
          position: getComputedStyle(i).objectPosition,
        })),
        floatingAvatar: document
          .querySelector(".floating-expert__avatar img")
          .getAttribute("src"),
        inputs: [...e.querySelectorAll("input,textarea")].map((i) => ({
          name: i.name,
          width: i.getBoundingClientRect().width,
        })),
      }));
      assert(!state.overflow);
      assert(
        state.images.every(
          (i) =>
            i.src.includes("alina-medvedeva-cta.webp") &&
            i.width === 1672 &&
            i.height === 941,
        ),
      );
      assert(state.floatingAvatar.includes("alina-floating-avatar.webp"));
      assert.equal(state.images[1].position,'100% 0%','Mobile thumbnail focuses the right-hand portrait');
      if ([390, 1440].includes(width))
        await section.screenshot({
          path: path.join(__dirname, `cta-image-${width}.png`),
        });
      report.viewports.push(state);
    }
    const r = await fetch(new URL("assets/alina-medvedeva-cta.webp", base));
    assert.equal(r.status, 200);
    report.sha256 = crypto
      .createHash("sha256")
      .update(Buffer.from(await r.arrayBuffer()))
      .digest("hex");
    const source = JSON.parse(
      fs.readFileSync(
        path.join(root, "assets/alina-medvedeva-cta-source.json"),
      ),
    );
    assert.equal(report.sha256, source.sha256);
    assert.deepEqual(report.errors, []);
    report.passed = true;
    fs.writeFileSync(
      path.join(
        __dirname,
        process.env.COMMERCIAL_PREVIEW_URL
          ? "cta-image-publication.json"
          : "cta-image.json",
      ),
      JSON.stringify(report, null, 2) + "\n",
    );
    console.log(
      JSON.stringify({
        passed: true,
        viewports: report.viewports.length,
        sha256: report.sha256,
      }),
    );
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
