"""The owner's "Tomorrow" pack: one Sheet row per shot with copy-paste Flow prompts.

Source: content/<post>/shots.json written by the Scriptwriter/Art Director:
{"post_slug": "...", "shots": [{"n": 1, "image_prompt": "...", "video_prompt": "...", "lines": [...]}]}
"""
from __future__ import annotations

import json
from pathlib import Path

from . import config

TAB = "tomorrow"
HEADER = ["post", "shot", "step 1 — image prompt (Flow)", "step 2 — video prompt (Flow)", "upload as", "drive folder"]


def cast_block() -> str:
    """Locked cast descriptions + style line, pasted into prompts by the writer (see brand/cast.md)."""
    return (config.ROOT / "brand" / "cast.md").read_text(encoding="utf-8")


def rows_for(post_dir: Path, folder_link: str) -> list[list[str]]:
    data = json.loads((post_dir / "shots.json").read_text(encoding="utf-8"))
    return [[data["post_slug"], str(s["n"]), s["image_prompt"], s["video_prompt"], f"shot{s['n']}.mp4", folder_link]
            for s in data["shots"]]


def write_tab(rows: list[list[str]], note: str) -> str:
    """Replace the 'tomorrow' tab of the content Sheet. Returns the tab URL."""
    import gspread

    from .table import open_table
    table = open_table()
    book = table.ws.spreadsheet
    try:
        ws = book.worksheet(TAB)
        ws.clear()
    except gspread.WorksheetNotFound:
        ws = book.add_worksheet(TAB, rows=60, cols=len(HEADER))
    ws.update(range_name="A1", values=[[note], HEADER] + rows, value_input_option="RAW")
    book.batch_update({"requests": [
        {"repeatCell": {"range": {"sheetId": ws.id, "startRowIndex": 2, "startColumnIndex": 2, "endColumnIndex": 4},
                        "cell": {"userEnteredFormat": {"wrapStrategy": "WRAP"}}, "fields": "userEnteredFormat.wrapStrategy"}},
        {"updateDimensionProperties": {"range": {"sheetId": ws.id, "dimension": "COLUMNS", "startIndex": 2, "endIndex": 4},
                                       "properties": {"pixelSize": 420}, "fields": "pixelSize"}},
    ]})
    return f"{book.url}#gid={ws.id}"
