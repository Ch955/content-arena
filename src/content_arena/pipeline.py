"""Keep the content table in step with a post folder.

`sync` infers the stage from the files present and creates/updates one row per
platform. It never touches rows the owner or publisher controls (approved/posting/posted).

Post formats (brief front matter `format:`):
- carousel (default): slides.json + caption.md → rendered/*.jpg      → Instagram (+ Facebook later)
- reel:               caption.md (+ youtube.md) → rendered/video.mp4 → Instagram Reel, YouTube Short
"""
from __future__ import annotations

import re
from pathlib import Path

from . import config
from .table import LOCKED, Table


def platforms() -> list[str]:
    """Platforms to create rows for, e.g. "instagram,youtube". Facebook waits for a Page."""
    return [p.strip() for p in config.get("PLATFORMS", "instagram").split(",") if p.strip()]


MAX_CAPTION = 2200      # Instagram caption limit
MAX_HASHTAGS = 5        # Instagram's cap since Dec 2025 (Help Center: "up to 5 tags on a post")
YT_MAX_TITLE = 100
YT_MAX_DESCRIPTION = 5000
YT_MAX_HASHTAGS = 15    # YouTube ignores every hashtag on a video that has more than 60; stay well under


def parse_caption(text: str) -> tuple[str, list[str]]:
    """Split caption text into (body, hashtags). Hashtags = the last paragraph if it is only #tags."""
    paras = [p.strip() for p in re.split(r"\n\s*\n", text.strip()) if p.strip()]
    if paras and all(tok.startswith("#") for tok in paras[-1].split()):
        return "\n\n".join(paras[:-1]), paras[-1].split()
    return "\n\n".join(paras), []


def parse_youtube(text: str) -> tuple[str, str, list[str]]:
    """youtube.md: first line is the title ('# ' optional), the rest is the description + hashtags."""
    first, _, rest = text.strip().partition("\n")
    body, tags = parse_caption(rest)
    return first.lstrip("# ").strip(), body, tags


def facts_section(brief: str) -> str:
    m = re.search(r"^## Facts to verify\s*\n(.*?)(?=^## |\Z)", brief, flags=re.M | re.S)
    return m.group(1).strip() if m else ""


def full_caption(caption: str, hashtags: list[str]) -> str:
    return f"{caption}\n\n{' '.join(hashtags)}".strip()


def validate_caption(caption: str, hashtags: list[str]) -> None:
    if len(hashtags) > MAX_HASHTAGS:
        raise ValueError(f"{len(hashtags)} hashtags — Instagram allows at most {MAX_HASHTAGS}")
    if len(full_caption(caption, hashtags)) > MAX_CAPTION:
        raise ValueError(f"Caption is over Instagram's {MAX_CAPTION}-character limit")


def validate_youtube(title: str, description: str, hashtags: list[str]) -> None:
    if not title or len(title) > YT_MAX_TITLE:
        raise ValueError(f"YouTube title must be 1–{YT_MAX_TITLE} characters")
    if "<" in title + description or ">" in title + description:
        raise ValueError("YouTube rejects '<' and '>' in titles/descriptions")
    if len(hashtags) > YT_MAX_HASHTAGS:
        raise ValueError(f"{len(hashtags)} YouTube hashtags — keep it to {YT_MAX_HASHTAGS} or fewer")
    if len(full_caption(description, hashtags)) > YT_MAX_DESCRIPTION:
        raise ValueError(f"YouTube description is over {YT_MAX_DESCRIPTION} characters")


def front_matter(brief: str, key: str) -> str:
    m = re.search(rf"^{key}:\s*(.+)$", brief, flags=re.M)
    return m.group(1).strip() if m else ""


def sync(post_dir: Path, table: Table, upload=None, platforms_: list[str] | None = None) -> list[dict]:
    """Create/update rows for a post. `upload(slug, paths) -> urls` is called only when rendered
    media exists; pass None to skip uploading (rows then stay at 'drafted')."""
    post_dir = Path(post_dir)
    slug = post_dir.name
    brief_path = post_dir / "brief.md"
    if not brief_path.exists():
        raise FileNotFoundError(f"{brief_path} is missing — run /content-manager first")
    brief = brief_path.read_text(encoding="utf-8")
    fmt = front_matter(brief, "format") or "carousel"
    if fmt not in ("carousel", "reel"):
        raise ValueError(f"Unknown format {fmt!r} in {brief_path} (use carousel or reel)")

    common = {"post_slug": slug, "format": fmt, "brief_path": str(brief_path),
              "facts_to_verify": facts_section(brief)}
    for key in ("pillar", "language", "topic"):
        if front_matter(brief, key):
            common[key] = front_matter(brief, key)

    caption_md = post_dir / "caption.md"
    drafted = caption_md.exists() and (fmt == "reel" or (post_dir / "slides.json").exists())
    media = sorted((post_dir / "rendered").glob("*.jpg")) if fmt == "carousel" \
        else [p for p in [post_dir / "rendered" / "video.mp4"] if p.exists()]
    status = "idea"
    if drafted:
        caption, tags = parse_caption(caption_md.read_text(encoding="utf-8"))
        validate_caption(caption, tags)
        common.update(caption=caption, hashtags=" ".join(tags))
        status = "drafted"
        if media and upload is not None:
            common["media_urls"] = "\n".join(upload(slug, media))
            status = "rendered"

    rows = []
    for platform in platforms_ or platforms():
        if platform == "youtube" and fmt != "reel":
            continue  # YouTube gets videos only
        fields = dict(common)
        if platform == "youtube" and drafted:
            yt = post_dir / "youtube.md"
            if not yt.exists():
                raise FileNotFoundError(f"{yt} is missing — reels need a YouTube title/description")
            title, description, yt_tags = parse_youtube(yt.read_text(encoding="utf-8"))
            validate_youtube(title, description, yt_tags)
            fields.update(title=title, caption=description, hashtags=" ".join(yt_tags))
        row_id = f"{slug}-{platform}"
        row = table.get(row_id) or table.insert({"id": row_id, "platform": platform, "status": "idea"})
        if row["status"] in LOCKED:
            rows.append(row)  # owner/publisher controls this row now
            continue
        _advance(table, row_id, row["status"], status)
        rows.append(table.update(row_id, **fields))
    return rows


STAGES = ["idea", "drafted", "rendered"]


def _advance(table: Table, row_id: str, current: str, target: str) -> None:
    """Walk a row to the stage the files support, one allowed transition at a time."""
    if target == "idea" or current == target:
        return
    if current == "rejected":  # reworked after rejection
        table.update(row_id, status="drafted")
        current = "drafted"
    if current == "rendered" and target == "drafted":  # media removed → back to drafted
        table.update(row_id, status="drafted")
        return
    for stage in STAGES[STAGES.index(current) + 1: STAGES.index(target) + 1]:
        table.update(row_id, status=stage)
