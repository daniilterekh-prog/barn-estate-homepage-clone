const fs = require("node:fs"),
  path = require("node:path"),
  crypto = require("node:crypto"),
  assert = require("node:assert/strict");
const {
  chromium,
} = require("/home/daniil/.local/share/codex-toolkit/node_modules/playwright");
const sharp = require("/home/daniil/.local/share/codex-toolkit/node_modules/sharp");
const out = __dirname,
  root = path.dirname(out),
  base = process.env.COMMERCIAL_PREVIEW_URL || "http://127.0.0.1:8796/";
const sha = (b) => crypto.createHash("sha256").update(b).digest("hex");
function files(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory() && e.name !== "verification"
        ? files(path.join(dir, e.name))
        : e.isFile()
          ? [path.join(dir, e.name)]
          : [],
    );
}
(async () => {
  const report = {
    url: base,
    checkedAt: new Date().toISOString(),
    viewports: [],
    imageRequests: [],
    nonWebpRasterRequests: [],
    httpErrors: [],
    jsErrors: [],
    conversion: JSON.parse(
      fs.readFileSync(path.join(root, "assets/webp-conversion.json")),
    ),
  };
  assert.equal(
    files(root).filter((p) => /\.(png|jpe?g|gif|avif)$/i.test(p)).length,
    0,
    "All owned raster assets must be WebP",
  );
  for (const file of files(root).filter((f) => f.endsWith(".webp"))) {
    assert.equal((await sharp(file).metadata()).format, "webp", file);
  }
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on("pageerror", (e) => report.jsErrors.push(e.message));
  page.on("response", (r) => {
    if (r.status() >= 400) report.httpErrors.push(r.status() + " " + r.url());
  });
  page.on("request", (r) => {
    if (r.resourceType() === "image") {
      report.imageRequests.push(r.url());
      if (/\.(png|jpe?g|gif|avif)([?#]|$)/i.test(r.url()))
        report.nonWebpRasterRequests.push(r.url());
    }
  });
  try {
    for (const width of [390, 768, 1440, 1920]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
      await page.goto(base, { waitUntil: "networkidle" });
      await page.evaluate(async () => {
        for (const img of document.images) img.loading = "eager";
        await document.fonts.ready;
        await Promise.all(
          [...document.images].map((i) => i.decode().catch(() => {})),
        );
      });
      const state = await page.evaluate(() => ({
        width: innerWidth,
        overflow: document.documentElement.scrollWidth > innerWidth,
        images: [...document.images].map((i) => ({
          src: i.currentSrc || i.src,
          complete: i.complete,
          width: i.naturalWidth,
          height: i.naturalHeight,
        })),
        directions: [
          ...document.querySelectorAll(".owner-sale-types__card"),
        ].map((a) => ({
          text: a.querySelector("h3").textContent,
          href: a.href,
          src: a.querySelector("img").currentSrc,
        })),
      }));
      assert.equal(state.overflow, false);
      assert(state.images.every((i) => i.width > 0));
      assert(
        state.images.every(
          (i) =>
            /\.(webp|svg)([?#]|$)/i.test(i.src) ||
            i.src.startsWith("data:image/svg"),
        ),
        "All rendered raster images must be WebP",
      );
      assert.equal(state.directions.length, 4);
      assert(
        state.directions.some(
          (d) =>
            d.href.endsWith("/prodazha_sobstvennikam_spb/") &&
            d.text.includes("САНКТ-ПЕТЕРБУРГЕ"),
        ),
      );
      for (const image of await page.locator(".owner-sale-types__image").all())
        assert.equal(await image.evaluate((i) => i.naturalWidth), 849);
      if ([390, 1440].includes(width)) {
        await page
          .locator(".owner-sale-types")
          .screenshot({ path: path.join(out, `webp-directions-${width}.png`) });
        await page.evaluate(() => scrollTo(0, 0));
        const open = page.locator('[aria-label="Открыть меню"]').first();
        await open.click();
        assert(await page.locator(".site-menu").isVisible(), "Menu must open");
        await page.waitForFunction(() =>
          [...document.querySelectorAll(".site-menu img")].every(
            (i) => i.complete && i.naturalWidth,
          ),
        );
        await page.screenshot({
          path: path.join(out, `webp-menu-${width}.png`),
        });
        const close = page.locator('[aria-label="Закрыть меню"]').first();
        if (await close.isVisible()) await close.click();
        else await page.keyboard.press("Escape");
      }
      report.viewports.push(state);
      console.log(
        JSON.stringify({
          width,
          images: state.images.length,
          directions: state.directions.length,
          passed: true,
        }),
      );
    }
    report.directionAssets = await Promise.all(
      JSON.parse(
        fs.readFileSync(path.join(root, "assets/directions/source.json")),
      ).images.map(async (image) => {
        const r = await fetch(new URL("assets/directions/" + image.file, base));
        assert.equal(r.status, 200);
        const hash = sha(Buffer.from(await r.arrayBuffer()));
        assert.equal(hash, image.sha256);
        return { file: image.file, sha256: hash };
      }),
    );
    const spb = await fetch(
      "https://daniilterekh-prog.github.io/barn-estate-homepage-clone/prodazha_sobstvennikam_spb/",
    );
    assert.equal(spb.status, 200);
    report.spbPageStatus = spb.status;
    report.imageRequests = [...new Set(report.imageRequests)];
    report.servedRasterFormats = await Promise.all(report.imageRequests.filter(url => /\.webp([?#]|$)/i.test(url)).map(async url => {
      const response = await fetch(url);assert.equal(response.status,200);
      const bytes = Buffer.from(await response.arrayBuffer()),meta = await sharp(bytes).metadata();
      assert.equal(meta.format,'webp','Actual served bytes must be WebP');
      return {url,format:meta.format,width:meta.width,height:meta.height,bytes:bytes.length};
    }));

    assert.deepEqual(report.nonWebpRasterRequests, []);
    assert.deepEqual(report.httpErrors, []);
    assert.deepEqual(report.jsErrors, []);
    report.passed = true;
    fs.writeFileSync(
      path.join(
        out,
        process.env.COMMERCIAL_PREVIEW_URL
          ? "webp-publication.json"
          : "webp.json",
      ),
      JSON.stringify(report, null, 2) + "\n",
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
