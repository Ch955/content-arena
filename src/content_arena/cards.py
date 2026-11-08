"""Scene cards for narrated reels (podupu katha, book story, life lesson) — no Flow clips needed.

Each shot in shots.json may carry a "card": {"kicker", "emoji", "title", "body", "theme"}; this renders
clips/shotN.png (1080×1920) with Chromium, which `assemble` then animates with a slow camera move.
The top 170 px (brand header) and bottom ~560 px (subtitles) are kept clear.
"""
from __future__ import annotations

import html
import json
from pathlib import Path

from . import config

W, H = 1080, 1920
THEMES = {  # background gradient top → bottom, accent
    "podupu": ("#2B1055", "#0E0E12", "#F5B700"),
    "book-story": ("#3A1C0E", "#0E0E12", "#F4A261"),
    "life-lesson": ("#0B3D3A", "#0E0E12", "#2EC4B6"),
    "answer": ("#14402A", "#0E0E12", "#7BE495"),
}


def card_html(card: dict, fonts: Path, theme: str) -> str:
    top, bottom, accent = THEMES.get(card.get("theme", theme), THEMES["podupu"])
    esc = lambda k: html.escape(card.get(k, "")).replace("…", "...").replace("\n", "<br>")  # the font has no "…"
    return f"""<!doctype html><meta charset=utf-8><style>
@font-face{{font-family:Anton;src:url({fonts.as_uri()}/Anton-Regular.ttf)}}
@font-face{{font-family:Rama;src:url({fonts.as_uri()}/Ramabhadra-Regular.ttf)}}
@font-face{{font-family:NotoTe;src:url({fonts.as_uri()}/NotoSansTelugu.ttf)}}
html,body{{margin:0;width:{W}px;height:{H}px;overflow:hidden;background:linear-gradient({top},{bottom});color:#fff}}
.wrap{{position:absolute;top:230px;left:80px;right:80px;bottom:600px;display:flex;flex-direction:column;
justify-content:center;align-items:center;text-align:center;gap:34px}}
.kicker{{font-family:Anton,Rama;font-size:40px;letter-spacing:3px;color:#0E0E12;background:{accent};padding:8px 26px;border-radius:12px}}
.emoji{{font-size:230px;line-height:1;filter:drop-shadow(0 12px 18px rgba(0,0,0,.5))}}
.title{{font-family:Rama,NotoTe;font-size:82px;line-height:1.3;text-shadow:0 5px 0 #000}}
.body{{font-family:Rama,NotoTe;font-size:52px;line-height:1.4;color:#e8e8e8}}
.glow{{position:absolute;width:900px;height:900px;left:90px;top:420px;border-radius:50%;
background:radial-gradient({accent}33,transparent 65%)}}
</style><div class=glow></div><div class=wrap>
{f'<div class=kicker>{esc("kicker")}</div>' if card.get("kicker") else ''}
{f'<div class=emoji>{esc("emoji")}</div>' if card.get("emoji") else ''}
{f'<div class=title>{esc("title")}</div>' if card.get("title") else ''}
{f'<div class=body>{esc("body")}</div>' if card.get("body") else ''}
</div>"""


def render_cards(post_dir: Path, theme: str = "podupu") -> list[Path]:
    """Write clips/shotN.png for every shot that has a "card" and no clip of its own yet."""
    from playwright.sync_api import sync_playwright

    post_dir = Path(post_dir).resolve()
    shots = json.loads((post_dir / "shots.json").read_text(encoding="utf-8"))["shots"]
    todo = [s for s in shots if s.get("card")]
    out_dir = post_dir / "clips"; out_dir.mkdir(exist_ok=True)
    fonts = config.ROOT / "brand" / "fonts"
    done = []
    with sync_playwright() as p:
        b = p.chromium.launch(**config.chromium_launch_args())
        pg = b.new_page(viewport={"width": W, "height": H})
        for s in todo:
            src = out_dir / f"shot{s['n']}.html"
            src.write_text(card_html(s["card"], fonts, theme), encoding="utf-8")
            pg.goto(src.as_uri())
            pg.evaluate("document.fonts.ready")
            png = out_dir / f"shot{s['n']}.png"
            pg.screenshot(path=str(png))
            src.unlink()
            done.append(png)
        b.close()
    return done
