#!/usr/bin/env python3
"""Sync the city catalogue as a faithful static snapshot of the live page.

The page is intentionally kept separate from index.html. It preserves the
server-rendered DOM and the source responsive CSS instead of recreating the
layout from a second component tree.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import urllib.parse
import urllib.request
from pathlib import Path


SOURCE_URL = "https://barn-estate.ru/gorodskaya-nedvizhimost/"
ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / "city-real-estate.html"
ROUTE_PAGE = ROOT / "gorodskaya-nedvizhimost" / "index.html"
ASSET_DIR = ROOT / "assets" / "city-real-estate" / "source-assets"
NUXT_DIR = ROOT / "gorodskaya-nedvizhimost" / "_nuxt"
LOCAL_NUXT_PREFIX = "/gorodskaya-nedvizhimost/_nuxt/"


def request(url: str, referer: str | None = None) -> bytes:
    headers = {"User-Agent": "Mozilla/5.0"}
    if referer:
        headers["Referer"] = referer
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=45) as response:
        return response.read()


def absolute_url(value: str) -> str:
    if value.startswith("//"):
        return "https:" + value
    if value.startswith("/"):
        return urllib.parse.urljoin(SOURCE_URL, value)
    return value


def safe_name(url: str, index: int) -> str:
    parsed = urllib.parse.urlparse(url)
    name = Path(parsed.path).name or "asset"
    digest = hashlib.sha1(url.encode()).hexdigest()[:10]
    return f"{index:02d}-{digest}-{name}"


def unique_urls(values: list[str]) -> list[str]:
    urls: list[str] = []
    for value in values:
        if value and value not in urls:
            urls.append(value)
    return urls


def download_url_map(urls: list[str], index_start: int = 1) -> dict[str, str]:
    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    replacements: dict[str, str] = {}
    for index, raw_url in enumerate(unique_urls(urls), index_start):
        source_url = absolute_url(raw_url)
        output_name = safe_name(source_url, index)
        output_path = ASSET_DIR / output_name
        try:
            if not output_path.exists():
                output_path.write_bytes(request(source_url))
            replacements[raw_url] = output_path.relative_to(ROOT).as_posix()
        except Exception as error:  # Keep the original URL if the source CDN rejects it.
            print(f"asset kept remote: {source_url} ({error})")
    return replacements


def download_images(html: str) -> dict[str, str]:
    values: list[str] = []
    for tag in ("img", "source"):
        for attr in ("src", "srcset"):
            values.extend(re.findall(rf"<{tag}\b[^>]*\b{attr}=\"([^\"]+)\"", html))

    # Nuxt serializes lazy cards and map projects inside __NUXT_DATA__. Those
    # URLs are not present in rendered <img> attributes until hydration, so
    # collect them too to keep the interactive route fully local.
    values.extend(
        re.findall(
            r"(?:(?:https?:)?//|/)[^\"'<>\s\\]+\.(?:jpe?g|png|webp)(?:\?[^\"'<>\s\\]*)?",
            html,
            flags=re.IGNORECASE,
        )
    )

    urls: list[str] = []
    for value in values:
        for candidate in value.split(","):
            url = candidate.strip().split(" ", 1)[0]
            # A previous sync can already have localized CSS image URLs in
            # the source snapshot. They are local files, not new source URLs.
            if url.startswith(("/city-real-estate/source-assets/", "assets/city-real-estate/source-assets/")):
                continue
            if url and url not in urls and (url.startswith("/") or url.startswith("http")):
                urls.append(url)

    return download_url_map(urls)


def localize_css_assets(css: str, index_start: int) -> str:
    values = re.findall(r"url\((['\"]?)([^)\"']+)\1\)", css)
    urls = []
    for _, value in values:
        if value.startswith("data:") or value.startswith("#") or value.startswith("/fonts/"):
            continue
        if value.startswith("/") or value.startswith("http"):
            urls.append(value)

    replacements = download_url_map(urls, index_start)
    for source, local in replacements.items():
        css = css.replace(source, local)
        css = css.replace(absolute_url(source), local)
    return css


def localize_nuxt_runtime(html: str) -> str:
    """Download the Nuxt entry, route chunks, and build manifest locally."""
    NUXT_DIR.mkdir(parents=True, exist_ok=True)
    queue = [
        url
        for url in unique_urls(re.findall(r"https://barn-estate\.ru/_nuxt/[^\"' >]+", html))
        if url.endswith(".js")
    ]
    downloaded: dict[str, str] = {}
    seen: set[str] = set()

    while queue:
        url = queue.pop(0)
        if url in seen:
            continue
        seen.add(url)
        try:
            data = request(url)
        except Exception as error:
            print(f"runtime kept remote: {url} ({error})")
            continue
        name = Path(urllib.parse.urlparse(url).path).name
        output_path = NUXT_DIR / name
        output_path.write_bytes(data)
        downloaded[url] = LOCAL_NUXT_PREFIX + name
        text = data.decode("utf-8", errors="ignore")
        for relative in re.findall(r"[\"'](\./[^\"']+\.js)[\"']", text):
            queue.append(urllib.parse.urljoin(url, relative))

    manifest_paths = unique_urls(
        re.findall(r"(?:https://barn-estate\.ru)?/_nuxt/(builds/meta/[^\"' >]+\.json)", html)
    )
    for manifest_path in manifest_paths:
        url = absolute_url("/_nuxt/" + manifest_path)
        try:
            data = request(url)
            output_path = NUXT_DIR / manifest_path
            output_path.parent.mkdir(parents=True, exist_ok=True)
            output_path.write_bytes(data)
            downloaded[url] = LOCAL_NUXT_PREFIX + manifest_path
        except Exception as error:
            print(f"manifest kept remote: {url} ({error})")

    # The source page's Yandex key is restricted to barn-estate.ru. A local
    # copy of the loader keeps the map identical while allowing the cloned
    # route to initialize it from localhost or static hosting.
    map_runtime = NUXT_DIR / "yandex-maps.js"
    try:
        map_runtime.write_bytes(
            request(
                "https://api-maps.yandex.ru/v3/?lang=ru_RU&apikey=eb19bd7a-97ea-4903-8f5b-ab24c1115a63",
                referer=SOURCE_URL,
            )
        )
    except Exception as error:
        print(f"map runtime kept remote: {error}")

    for source, local in downloaded.items():
        html = html.replace(source, local)
    html = html.replace('buildAssetsDir:"/_nuxt/"', f'buildAssetsDir:"{LOCAL_NUXT_PREFIX}"')
    return html


def inject_map_bridge(html: str) -> str:
    bridge = f'''<script data-city-map-bridge>
(() => {{
  const originalAppendChild = Element.prototype.appendChild;
  Element.prototype.appendChild = function (node) {{
    if (node instanceof HTMLScriptElement && node.id === "vue-yandex-maps") {{
      node.src = "{LOCAL_NUXT_PREFIX}yandex-maps.js";
    }}
    return originalAppendChild.call(this, node);
  }};
}})();
</script>'''
    return html.replace("<head>", "<head>" + bridge, 1)


def inject_image_bridge(html: str, replacements: dict[str, str]) -> str:
    """Keep API-rendered image URLs local after Nuxt hydration."""
    mapping: dict[str, str] = {}
    for source, local in replacements.items():
        absolute = absolute_url(source)
        local_url = "/" + local.lstrip("/")
        mapping[source] = local_url
        mapping[absolute] = local_url
    payload = json.dumps(mapping, ensure_ascii=False, separators=(",", ":"))
    bridge = f'''<script data-city-image-bridge>
(() => {{
  const imageMap = {payload};
  const rewrite = (node) => {{
    if (!(node instanceof Element)) return;
    let localImage = null;
    for (const attribute of ["src", "poster"]) {{
      const value = node.getAttribute(attribute);
      if (value && imageMap[value]) {{
        localImage = imageMap[value];
        node.setAttribute(attribute, localImage);
      }} else if (value && value.startsWith("/assets/city-real-estate/source-assets/")) {{
        localImage = value;
      }}
      if (node.tagName === "IMG" && value && (imageMap[value] || value.startsWith("/assets/city-real-estate/source-assets/"))) node.removeAttribute("loading");
    }}
    if (node.tagName === "IMG" && localImage) {{
      const media = node.closest(".apartment-card__media") || node.parentElement;
      if (media) {{
        media.style.backgroundImage = `url("${{localImage}}")`;
        media.style.backgroundSize = "cover";
        media.style.backgroundPosition = "center";
      }}
    }}
    const srcset = node.getAttribute("srcset");
    if (srcset) node.setAttribute("srcset", srcset.split(",").map((part) => {{
      const bits = part.trim().split(/\\s+/);
      if (imageMap[bits[0]]) bits[0] = imageMap[bits[0]];
      return bits.join(" ");
    }}).join(", "));
  }};
  const scan = (root = document) => {{
    if (root instanceof Element) rewrite(root);
    root.querySelectorAll?.("img,source,video").forEach(rewrite);
  }};
  scan();
  new MutationObserver((records) => records.forEach((record) =>
    record.addedNodes.forEach((node) => scan(node))
  )).observe(document.documentElement, {{childList: true, subtree: true}});
}})();
</script>'''
    return html.replace("</body>", bridge + "</body>", 1)


def rewrite_root_paths(html: str) -> str:
    def replace_attr(match: re.Match[str]) -> str:
        prefix, value, suffix = match.groups()
        if value.startswith("/"):
            value = absolute_url(value)
        return prefix + value + suffix

    return re.sub(r"((?:href|src|action|poster|data-src)=\")([^\"]+)(\")", replace_attr, html)


def sync(source_path: Path | None = None) -> None:
    html = (source_path.read_bytes() if source_path else request(SOURCE_URL)).decode("utf-8")
    html = rewrite_root_paths(html)

    stylesheet = re.search(r'<link[^>]+href="(https://barn-estate\.ru/_nuxt/[^\"]+\.css)"[^>]*>', html)
    if stylesheet:
        try:
            css = request(stylesheet.group(1)).decode("utf-8")
            css = localize_css_assets(css, len(re.findall(r"assets/city-real-estate/source-assets/", html)) + 1)
            css = re.sub(r"url\((['\"]?)/fonts/", r"url(\1/fonts/", css)
            html = html.replace(stylesheet.group(0), f"<style data-source-external>{css}</style>")
        except Exception as error:
            print(f"external stylesheet kept remote: {error}")

    replacements = download_images(html)
    for source, local in replacements.items():
        html = html.replace(source, local)
        html = html.replace(absolute_url(source), local)

    html = localize_nuxt_runtime(html)

    html = html.replace("<head>", '<head><base href="/">', 1)
    interactive_html = "<!-- Source snapshot: " + SOURCE_URL + " -->\n" + html
    static_html = re.sub(r"<script\b[^>]*\bsrc=\"[^\"]+\"[^>]*>.*?</script>", "", interactive_html, flags=re.S)
    static_html = re.sub(r"[ \t]+(?=\n|$)", "", static_html)
    interactive_html = inject_map_bridge(interactive_html)
    interactive_html = inject_image_bridge(interactive_html, replacements)

    PAGE.write_text(static_html, encoding="utf-8")
    ROUTE_PAGE.parent.mkdir(parents=True, exist_ok=True)
    ROUTE_PAGE.write_text(interactive_html, encoding="utf-8")
    print(f"wrote {PAGE} ({PAGE.stat().st_size} bytes)")
    print(f"wrote {ROUTE_PAGE} ({ROUTE_PAGE.stat().st_size} bytes)")
    print(f"downloaded {len(replacements)} image assets into {ASSET_DIR}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, help="Use a previously fetched HTML file")
    sync(parser.parse_args().source)
