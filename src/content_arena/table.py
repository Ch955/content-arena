"""The content table: one row per platform post, with an enforced status flow.

Backends: Google Sheet (production, approve from the phone) and CSV (local testing).
"""
from __future__ import annotations

import csv
import json
from datetime import datetime, timezone
from pathlib import Path

from . import config

COLUMNS = [
    "id", "post_slug", "platform", "format", "pillar", "language", "status", "topic",
    "title", "caption", "hashtags", "media_urls", "facts_to_verify", "brief_path",
    "scheduled_for", "created_at", "updated_at", "approved_at", "posted_at",
    "platform_post_id", "error",
]

STATUSES = ["idea", "drafted", "rendered", "approved", "rejected", "posting", "posted", "failed"]

# Allowed status changes. "approved" is only ever set by the owner.
TRANSITIONS = {
    "idea": {"drafted", "rejected"},
    "drafted": {"drafted", "rendered", "rejected"},
    "rendered": {"drafted", "rendered", "approved", "rejected"},
    "approved": {"posting", "rejected"},
    "posting": {"posted", "failed"},
    "failed": {"approved", "rejected"},
    "rejected": {"drafted"},
    "posted": set(),
}

# Rows in these states are owned by the owner/publisher; sync must not touch them.
LOCKED = {"approved", "posting", "posted"}


class TransitionError(ValueError):
    pass


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def check_transition(old: str, new: str) -> None:
    if old not in TRANSITIONS:
        raise TransitionError(f"Unknown status {old!r}")
    if new not in TRANSITIONS[old]:
        raise TransitionError(f"Status change {old!r} -> {new!r} is not allowed")


class Table:
    """Base class: subclasses implement _read_all() and _write_row()."""

    def all(self) -> list[dict]:
        return [{c: str(r.get(c, "") or "") for c in COLUMNS} for r in self._read_all()]

    def get(self, row_id: str) -> dict | None:
        return next((r for r in self.all() if r["id"] == row_id), None)

    def by_status(self, status: str) -> list[dict]:
        return [r for r in self.all() if r["status"] == status]

    def insert(self, row: dict) -> dict:
        if self.get(row["id"]):
            raise ValueError(f"Row {row['id']} already exists")
        full = {c: str(row.get(c, "") or "") for c in COLUMNS}
        full["created_at"] = full["updated_at"] = now_iso()
        self._write_row(full, new=True)
        return full

    def update(self, row_id: str, **fields) -> dict:
        row = self.get(row_id)
        if row is None:
            raise KeyError(row_id)
        if "status" in fields:
            check_transition(row["status"], fields["status"])
        row.update({k: str(v) for k, v in fields.items()})
        row["updated_at"] = now_iso()
        self._write_row(row, new=False)
        return row

    def _read_all(self) -> list[dict]:
        raise NotImplementedError

    def _write_row(self, row: dict, new: bool) -> None:
        raise NotImplementedError


class CsvTable(Table):
    def __init__(self, path: str | Path):
        self.path = Path(path)

    def _read_all(self) -> list[dict]:
        if not self.path.exists():
            return []
        with self.path.open(newline="", encoding="utf-8") as f:
            return list(csv.DictReader(f))

    def _write_row(self, row: dict, new: bool) -> None:
        rows = self._read_all()
        if new:
            rows.append(row)
        else:
            rows = [row if r["id"] == row["id"] else r for r in rows]
        self.path.parent.mkdir(parents=True, exist_ok=True)
        tmp = self.path.with_suffix(".tmp")
        with tmp.open("w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=COLUMNS)
            w.writeheader()
            w.writerows({c: r.get(c, "") for c in COLUMNS} for r in rows)
        tmp.replace(self.path)


class SheetTable(Table):
    """Google Sheet backend. Worksheet 'content', header row = COLUMNS."""

    WORKSHEET = "content"

    def __init__(self, sheet_id: str):
        import gspread  # optional dependency: pip install -e .[sheet]
        from google.oauth2.service_account import Credentials

        scopes = ["https://www.googleapis.com/auth/spreadsheets"]
        raw = config.get("GOOGLE_SERVICE_ACCOUNT_JSON")
        if raw:
            creds = Credentials.from_service_account_info(json.loads(raw), scopes=scopes)
        else:
            path = config.get("GOOGLE_SERVICE_ACCOUNT_FILE", required=True)
            creds = Credentials.from_service_account_file(path, scopes=scopes)
        book = gspread.authorize(creds).open_by_key(sheet_id)
        try:
            self.ws = book.worksheet(self.WORKSHEET)
        except gspread.WorksheetNotFound:
            self.ws = book.add_worksheet(self.WORKSHEET, rows=500, cols=len(COLUMNS))
        if self.ws.row_values(1) != COLUMNS:
            self.ws.update(range_name="A1", values=[COLUMNS])

    def _read_all(self) -> list[dict]:
        return self.ws.get_all_records(expected_headers=COLUMNS, default_blank="")

    def _write_row(self, row: dict, new: bool) -> None:
        values = [[row.get(c, "") for c in COLUMNS]]
        if new:
            self.ws.append_row(values[0], value_input_option="RAW")
            return
        ids = self.ws.col_values(1)
        idx = ids.index(row["id"]) + 1  # 1-based sheet row
        self.ws.update(range_name=f"A{idx}", values=values, value_input_option="RAW")

    def add_status_dropdown(self) -> None:
        """Turn the status column into a dropdown so the owner can approve with two taps."""
        col = COLUMNS.index("status")
        self.ws.spreadsheet.batch_update({"requests": [{"setDataValidation": {
            "range": {"sheetId": self.ws.id, "startRowIndex": 1, "startColumnIndex": col, "endColumnIndex": col + 1},
            "rule": {"condition": {"type": "ONE_OF_LIST",
                                   "values": [{"userEnteredValue": s} for s in STATUSES]},
                     "showCustomUi": True, "strict": True},
        }}]})


def open_table() -> Table:
    backend = config.get("TABLE_BACKEND", "csv")
    if backend == "sheet":
        return SheetTable(config.get("GOOGLE_SHEET_ID", required=True))
    if backend == "csv":
        return CsvTable(config.ROOT / config.get("CSV_PATH", "data/content.csv"))
    raise config.ConfigError(f"Unknown TABLE_BACKEND {backend!r} (use 'sheet' or 'csv')")
