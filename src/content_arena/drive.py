"""Google Drive inbox: the owner uploads AI clips from their phone; the office picks them up.

Layout: <Reel Rasam Inbox>/<post-slug>/shot1.mp4 … shotN.mp4 (any common video name works;
files are ordered by the first number in the name).
"""
from __future__ import annotations

import re
from pathlib import Path

import requests

from . import config
from .table import parse_service_account

API = "https://www.googleapis.com/drive/v3/files"
FOLDER = "application/vnd.google-apps.folder"


class Drive:
    def __init__(self, session: requests.Session | None = None):
        from google.auth.transport.requests import Request
        from google.oauth2.service_account import Credentials

        info = parse_service_account(config.get("GOOGLE_SERVICE_ACCOUNT_JSON", required=True))
        creds = Credentials.from_service_account_info(info, scopes=["https://www.googleapis.com/auth/drive"])
        creds.refresh(Request())
        self.http = session or requests.Session()
        self.http.headers["Authorization"] = f"Bearer {creds.token}"
        self.inbox = config.get("DRIVE_INBOX_FOLDER_ID", "1pjpI7_i3kj-qw1U1ZRShOOzqvzMyPapr")  # "Reel Rasam Inbox"

    def _list(self, q: str) -> list[dict]:
        r = self.http.get(API, timeout=30, params={"q": q, "fields": "files(id,name,mimeType,size,webViewLink)",
                                                    "supportsAllDrives": "true", "includeItemsFromAllDrives": "true"})
        r.raise_for_status()
        return r.json()["files"]

    def folder(self, name: str) -> dict:
        """Get or create <inbox>/<name>; returns {id, webViewLink}."""
        safe = name.replace("'", "")
        found = self._list(f"'{self.inbox}' in parents and name='{safe}' and mimeType='{FOLDER}' and trashed=false")
        if found:
            return found[0]
        r = self.http.post(API, timeout=30, params={"fields": "id,webViewLink", "supportsAllDrives": "true"},
                           json={"name": name, "mimeType": FOLDER, "parents": [self.inbox]})
        r.raise_for_status()
        return r.json()

    def clips(self, name: str) -> list[dict]:
        f = self.folder(name)
        vids = [x for x in self._list(f"'{f['id']}' in parents and trashed=false")
                if x["mimeType"].startswith("video/") or x["name"].lower().endswith((".mp4", ".mov", ".webm"))]
        return sorted(vids, key=lambda x: shot_number(x["name"]))

    def download(self, file_id: str, dest: Path) -> Path:
        with self.http.get(f"{API}/{file_id}", params={"alt": "media", "supportsAllDrives": "true"},
                           stream=True, timeout=300) as r:
            r.raise_for_status()
            dest.parent.mkdir(parents=True, exist_ok=True)
            with dest.open("wb") as fh:
                for chunk in r.iter_content(1 << 20):
                    fh.write(chunk)
        return dest


def shot_number(name: str) -> int:
    m = re.search(r"\d+", name)
    return int(m.group()) if m else 10**6
