"""Render slides.json into carousel images with HTML/CSS + headless Chromium.

Outputs rendered/NN.png (master, for review) and rendered/NN.jpg (what gets
published — Instagram's API accepts JPEG only). 1080×1350 = 4:5 portrait.
"""
from __future__ import annotations

import json
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, select_autoescape

from . import config
from .config import ROOT

WIDTH, HEIGHT = 1080, 1350
SLIDE_TYPES = {"cover", "point", "stat", "bars", "quiz", "answer", "list", "cta"}


def load_brand() -> dict:
    return json.loads((ROOT / "brand" / "brand.json").read_text(encoding="utf-8"))


def load_post(post_dir: Path) -> dict:
    post = json.loads((post_dir / "slides.json").read_text(encoding="utf-8"))
    slides = post.get("slides", [])
    if not 2 <= len(slides) <= 10:
        raise ValueError(f"A carousel needs 2–10 slides, got {len(slides)}")
    for i, s in enumerate(slides, 1):
        if s.get("type") not in SLIDE_TYPES:
            raise ValueError(f"Slide {i}: unknown type {s.get('type')!r} (allowed: {sorted(SLIDE_TYPES)})")
    return post


def build_html(post: dict, brand: dict) -> list[str]:
    env = Environment(loader=FileSystemLoader(ROOT / "templates" / "carousel"),
                      autoescape=select_autoescape(["html", "j2"]))
    tpl = env.get_template("slide.html.j2")
    fonts_url = (ROOT / "brand" / "fonts").as_uri()
    total = len(post["slides"])
    return [tpl.render(slide=s, post=post, brand=brand, index=i, total=total,
                       fonts_url=fonts_url, width=WIDTH, height=HEIGHT)
            for i, s in enumerate(post["slides"], 1)]


def render(post_dir: Path) -> list[Path]:
    from playwright.sync_api import sync_playwright

    post_dir = Path(post_dir).resolve()
    pages = build_html(load_post(post_dir), load_brand())
    out = post_dir / "rendered"
    out.mkdir(exist_ok=True)
    for old in out.glob("*.*"):
        old.unlink()
    jpgs = []
    with sync_playwright() as p:
        browser = p.chromium.launch(**config.chromium_launch_args())
        page = browser.new_page(viewport={"width": WIDTH, "height": HEIGHT})
        for i, html in enumerate(pages, 1):
            src = out / f"{i:02d}.html"
            src.write_text(html, encoding="utf-8")  # file:// so local fonts load
            page.goto(src.as_uri())
            page.evaluate("document.fonts.ready")
            page.screenshot(path=str(out / f"{i:02d}.png"))
            jpg = out / f"{i:02d}.jpg"
            page.screenshot(path=str(jpg), type="jpeg", quality=95)
            src.unlink()
            jpgs.append(jpg)
        browser.close()
    return jpgs
