"""Long-lived Instagram User tokens last 60 days; refresh them before they expire.

The new token is never printed: it's written to .env and/or a file the caller removes.
"""
from __future__ import annotations

import os
import re
from pathlib import Path

import requests


def refresh_ig_token(token: str) -> tuple[str, int]:
    """Returns (new_token, expires_in_seconds). The token must be ≥24 h old and unexpired."""
    r = requests.get("https://graph.instagram.com/refresh_access_token",
                     params={"grant_type": "ig_refresh_token", "access_token": token}, timeout=30)
    body = r.json() if r.content else {}
    if r.status_code >= 400 or "access_token" not in body:
        msg = body.get("error", {}).get("message", f"HTTP {r.status_code}")
        raise RuntimeError(f"Token refresh failed: {msg}")
    return body["access_token"], int(body.get("expires_in", 0))


def write_env_value(env_path: Path, name: str, value: str) -> None:
    """Replace (or append) NAME=value in a .env file, keeping everything else."""
    text = env_path.read_text(encoding="utf-8") if env_path.exists() else ""
    line = f"{name}={value}"
    if re.search(rf"^{re.escape(name)}=.*$", text, flags=re.M):
        text = re.sub(rf"^{re.escape(name)}=.*$", lambda _: line, text, flags=re.M)
    else:
        text = text.rstrip("\n") + ("\n" if text else "") + line + "\n"
    env_path.write_text(text, encoding="utf-8")


def write_secret_file(path: Path, value: str) -> None:
    fd = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
    with os.fdopen(fd, "w") as f:
        f.write(value)
