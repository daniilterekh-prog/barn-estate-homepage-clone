const fs = require("node:fs"),
  path = require("node:path"),
  crypto = require("node:crypto"),
  assert = require("node:assert/strict");
const {
  chromium,
} = require("/home/daniil/.local/share/codex-toolkit/node_modules/playwright");
const root = path.dirname(__dirname),
  base = process.env.COMMERCIAL_PREVIEW_URL || "http://127.0.0.1:8796/";
(async () => {
  const b = await chromium.launch(),
    p = await b.newPage();
  const report = {
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
    for (const width of [320, 360, 390, 768, 1024, 1440, 1920]) {
      await p.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
      await p.goto(base, { waitUntil: "networkidle" });
      await p
        .locator(".floating-expert__avatar img")
        .evaluate((i) => i.decode());
      const state = await p
        .locator(".floating-expert__avatar")
        .evaluate((e) => {
          const i = e.querySelector("img"),
            a = e.getBoundingClientRect(),
            r = i.getBoundingClientRect(),
            c = e.closest(".floating-expert__card").getBoundingClientRect(),
            s = getComputedStyle(i);
          return {
            width: innerWidth,
            src: i.currentSrc,
            naturalWidth: i.naturalWidth,
            naturalHeight: i.naturalHeight,
            avatar: { x: a.x, y: a.y, width: a.width, height: a.height },
            image: { x: r.x, y: r.y, width: r.width, height: r.height },
            card: { x: c.x, y: c.y, right: c.right, bottom: c.bottom },
            borderRadius: getComputedStyle(e).borderRadius,
            fit: s.objectFit,
            transform: s.transform,
            overflow: document.documentElement.scrollWidth > innerWidth,
          };
        });
      assert(state.src.includes("assets/alina-floating-avatar.webp"));
      assert.equal(state.naturalWidth, 640);
      assert.equal(state.naturalHeight, 640);
      assert.equal(state.borderRadius, "50%");
      assert.equal(state.avatar.width, state.avatar.height);
      for (const key of ["x", "y", "width", "height"])
        assert(
          Math.abs(state.avatar[key] - state.image[key]) < 1,
          "Image must fill the circle without zoom or offset",
        );
      assert(
        state.avatar.x >= state.card.x &&
          state.avatar.x + state.avatar.width <= state.card.right &&
          state.avatar.y >= state.card.y &&
          state.avatar.y + state.avatar.height <= state.card.bottom,
      );
      assert.equal(state.overflow, false);
      assert.equal(state.fit, "contain");
      assert.equal(state.transform, "none");
      if ([390, 1440].includes(width)) {
        await p
          .locator(".floating-expert")
          .screenshot({
            path: path.join(__dirname, `alina-avatar-${width}.png`),
          });
        await p.locator(".floating-expert__card").click();
        assert(
          (
            await p.locator(".home-owner-form__hero-image").getAttribute("src")
          ).includes("alina-medvedeva.webp"),
          "Consultation portrait stays unchanged",
        );
        await p.keyboard.press("Escape");
      }
      report.viewports.push(state);
    }
    const response = await fetch(
        new URL("assets/alina-floating-avatar.webp", base),
      ),
      bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(response.status, 200);
    const source = JSON.parse(
      fs.readFileSync(
        path.join(root, "assets/alina-floating-avatar-source.json"),
      ),
    );
    report.avatarSha256 = crypto
      .createHash("sha256")
      .update(bytes)
      .digest("hex");
    assert.equal(report.avatarSha256, source.sha256);
    assert.deepEqual(report.errors, []);
    report.passed = true;
    fs.writeFileSync(
      path.join(
        __dirname,
        process.env.COMMERCIAL_PREVIEW_URL
          ? "alina-avatar-publication.json"
          : "alina-avatar.json",
      ),
      JSON.stringify(report, null, 2) + "\n",
    );
    console.log(
      JSON.stringify({
        passed: true,
        viewports: report.viewports.length,
        sha256: report.avatarSha256,
      }),
    );
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
