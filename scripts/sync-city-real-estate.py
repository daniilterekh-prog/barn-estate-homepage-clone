#!/usr/bin/env python3
"""Sync the city catalogue as a faithful static snapshot of the live page.

The page is intentionally kept separate from index.html. It preserves the
server-rendered DOM and the source responsive CSS instead of recreating the
layout from a second component tree.
"""

from __future__ import annotations

import argparse
import hashlib
import re
import urllib.parse
import urllib.request
from pathlib import Path


SOURCE_URL = "https://barn-estate.ru/gorodskaya-nedvizhimost/"
ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / "city-real-estate.html"
ROUTE_PAGE = ROOT / "gorodskaya-nedvizhimost" / "index.html"
ASSET_DIR = ROOT / "assets" / "city-real-estate" / "source-assets"


def request(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
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


def download_images(html: str) -> dict[str, str]:
    values: list[str] = []
    for tag in ("img", "source"):
        for attr in ("src", "srcset"):
            values.extend(re.findall(rf"<{tag}\b[^>]*\b{attr}=\"([^\"]+)\"", html))

    urls: list[str] = []
    for value in values:
        for candidate in value.split(","):
            url = candidate.strip().split(" ", 1)[0]
            if url and url not in urls and (url.startswith("/") or url.startswith("http")):
                urls.append(url)

    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    replacements: dict[str, str] = {}
    for index, raw_url in enumerate(urls, 1):
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
            css = re.sub(r"url\((['\"]?)/", r"url(\1https://barn-estate.ru/", css)
            html = html.replace(stylesheet.group(0), f"<style data-source-external>{css}</style>")
        except Exception as error:
            print(f"external stylesheet kept remote: {error}")

    replacements = download_images(html)
    for source, local in replacements.items():
        html = html.replace(source, local)
        html = html.replace(absolute_url(source), local)

    html = html.replace("<head>", '<head><base href="/">', 1)
    interactive_html = "<!-- Source snapshot: " + SOURCE_URL + " -->\n" + html
    static_html = re.sub(r"<script\b[^>]*\bsrc=\"[^\"]+\"[^>]*>.*?</script>", "", interactive_html, flags=re.S)

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
