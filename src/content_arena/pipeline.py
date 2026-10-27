"""Keep the content table in step with a post folder.

`sync` infers the stage from the files present and creates/updates one row per
platform. It never touches rows the owner or publisher controls (approved/posting/posted).
"""
from __future__ import annotations

import json
import re
from pathlib import Path

from .table import LOCKED, Table

PLATFORMS = ["instagram", "facebook"]
MAX_CAPTION = 2200   # Instagram caption limit
MAX_HASHTAGS = 30    # Instagram hashtag limit


def parse_caption(text: str) -> tuple[str, list[str]]:
    """Split caption.md into (caption body, hashtags). Hashtags = the last paragraph if it is only #tags."""
    paras = [p.strip() for p in re.split(r"\n\s*\n", text.strip()) if p.strip()]
    if paras and all(tok.startswith("#") for tok in paras[-1].split()):
        return "\n\n".join(paras[:-1]), paras[-1].split()
    return "\n\n".join(paras), []


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


def sync(post_dir: Path, table: Table, upload=None) -> list[dict]:
    """Create/update rows for a post. `upload(slug, jpg_paths) -> urls` is called only when
    rendered images exist; pass None to skip uploading (rows then stay at 'drafted')."""
    post_dir = Path(post_dir)
    slug = post_dir.name
    brief_path = post_dir / "brief.md"
    if not brief_path.exists():
        raise FileNotFoundError(f"{brief_path} is missing — run /content-manager first")
    brief = brief_path.read_text(encoding="utf-8")

    fields = {"post_slug": slug, "brief_path": str(brief_path), "facts_to_verify": facts_section(brief)}
    for key in ("pillar", "language", "topic"):
        m = re.search(rf"^{key}:\s*(.+)$", brief, flags=re.M)
        if m:
            fields[key] = m.group(1).strip()
    status = "idea"

    if (post_dir / "slides.json").exists() and (post_dir / "caption.md").exists():
        caption, tags = parse_caption((post_dir / "caption.md").read_text(encoding="utf-8"))
        validate_caption(caption, tags)
        meta = json.loads((post_dir / "slides.json").read_text(encoding="utf-8"))
        fields.update(caption=caption, hashtags=" ".join(tags), topic=meta.get("topic", fields.get("topic", "")))
        status = "drafted"
        jpgs = sorted((post_dir / "rendered").glob("*.jpg"))
        if jpgs and upload is not None:
            fields["media_urls"] = "\n".join(upload(slug, jpgs))
            status = "rendered"

    rows = []
    for platform in PLATFORMS:
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
    if current == "rendered" and target == "drafted":  # images removed → back to drafted
        table.update(row_id, status="drafted")
        return
    for stage in STAGES[STAGES.index(current) + 1: STAGES.index(target) + 1]:
        table.update(row_id, status=stage)
