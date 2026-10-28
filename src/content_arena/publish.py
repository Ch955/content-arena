"""Publish ONE approved row per run: Instagram (carousel or Reel), YouTube Shorts, Facebook later.

Auth modes (META_AUTH):
- instagram_login (default): Instagram API with Instagram Login — no Facebook Page needed.
  Host graph.instagram.com, long-lived Instagram User token (IG_ACCESS_TOKEN, refresh every <60 days).
- facebook_login: Instagram + Facebook Page via a Page token (META_PAGE_ACCESS_TOKEN).

Safety rules:
- Only rows with status 'approved' are considered; oldest first; at most one per run.
- Dry run by default. Nothing is sent unless live=True (CLI: --live).
- The row is set to 'posting' before any API call, so a crash can never double-post:
  a row stuck in 'posting' needs the owner to check the account and fix it by hand.
- Tokens go in the Authorization header, never in URLs or logs.
"""
from __future__ import annotations

import json
import time
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

import requests

from . import config
from . import youtube
from .pipeline import full_caption, validate_caption, validate_youtube
from .table import Table


class PublishError(RuntimeError):
    pass


class MetaClient:
    def __init__(self, token: str, version: str, session: requests.Session | None = None,
                 poll_interval: float = 3.0, poll_attempts: int = 20, host: str = "graph.facebook.com"):
        self.base = f"https://{host}/{version}"
        self.http = session or requests.Session()
        self.http.headers["Authorization"] = f"Bearer {token}"
        self.poll_interval, self.poll_attempts = poll_interval, poll_attempts

    def _call(self, method: str, path: str, **data) -> dict:
        resp = self.http.request(method, f"{self.base}/{path}", data=data if method == "POST" else None,
                                 params=data if method == "GET" else None, timeout=60)
        body = resp.json() if resp.content else {}
        if resp.status_code >= 400 or "error" in body:
            err = body.get("error", {})
            raise PublishError(f"Graph API {path}: {err.get('message', resp.status_code)} "
                               f"(code {err.get('code')}, subcode {err.get('error_subcode')}, "
                               f"trace {err.get('fbtrace_id')})")
        return body

    def _wait_ready(self, container_id: str, attempts: int | None = None) -> None:
        for _ in range(attempts or self.poll_attempts):
            status = self._call("GET", container_id, fields="status_code").get("status_code")
            if status == "FINISHED":
                return
            if status in ("ERROR", "EXPIRED"):
                raise PublishError(f"Media container {container_id} is {status}")
            time.sleep(self.poll_interval)
        raise PublishError(f"Media container {container_id} not ready after polling")

    def instagram_carousel(self, ig_user_id: str, image_urls: list[str], caption: str) -> str:
        children = []
        for url in image_urls:
            cid = self._call("POST", f"{ig_user_id}/media", image_url=url, is_carousel_item="true")["id"]
            self._wait_ready(cid)
            children.append(cid)
        parent = self._call("POST", f"{ig_user_id}/media", media_type="CAROUSEL",
                            children=",".join(children), caption=caption)["id"]
        self._wait_ready(parent)
        return self._call("POST", f"{ig_user_id}/media_publish", creation_id=parent)["id"]

    def instagram_reel(self, ig_user_id: str, video_url: str, caption: str) -> str:
        cid = self._call("POST", f"{ig_user_id}/media", media_type="REELS", video_url=video_url,
                         caption=caption, share_to_feed="true")["id"]
        self._wait_ready(cid, attempts=self.poll_attempts * 5)  # video processing takes minutes
        return self._call("POST", f"{ig_user_id}/media_publish", creation_id=cid)["id"]

    def instagram_user_id(self) -> str:
        """The account the token belongs to (Instagram Login tokens only)."""
        me = self._call("GET", "me", fields="user_id,username")
        print(f"Instagram account: @{me.get('username')}")
        return str(me["user_id"])

    def facebook_multi_photo(self, page_id: str, image_urls: list[str], message: str) -> str:
        photo_ids = [self._call("POST", f"{page_id}/photos", url=url, published="false")["id"]
                     for url in image_urls]
        attached = {f"attached_media[{i}]": json.dumps({"media_fbid": pid}) for i, pid in enumerate(photo_ids)}
        return self._call("POST", f"{page_id}/feed", message=message, **attached)["id"]


IST = ZoneInfo("Asia/Kolkata")


def parse_when(value: str) -> datetime:
    """Parse scheduled_for; a value typed without a timezone (e.g. '2026-10-31 19:30') means IST."""
    dt = datetime.fromisoformat(value.strip())
    return dt if dt.tzinfo else dt.replace(tzinfo=IST)


def make_client() -> MetaClient:
    version = config.get("GRAPH_API_VERSION", "v23.0")
    if auth_mode() == "instagram_login":
        return MetaClient(config.get("IG_ACCESS_TOKEN", required=True), version, host="graph.instagram.com")
    return MetaClient(config.get("META_PAGE_ACCESS_TOKEN", required=True), version)


def auth_mode() -> str:
    mode = config.get("META_AUTH", "instagram_login")
    if mode not in ("instagram_login", "facebook_login"):
        raise config.ConfigError(f"META_AUTH must be instagram_login or facebook_login, not {mode!r}")
    return mode


def ig_user_id(client: MetaClient) -> str:
    """IG_USER_ID if it's a real numeric ID; otherwise ask Instagram which account the token is for."""
    configured = (config.get("IG_USER_ID") or "").strip()
    if configured.isdigit():
        return configured
    if auth_mode() != "instagram_login":
        raise config.ConfigError("IG_USER_ID must be the numeric Instagram account ID")
    return client.instagram_user_id()


def pick_next(table: Table, now: datetime | None = None) -> dict | None:
    """Oldest approved row whose scheduled_for (if any) has passed."""
    now = now or datetime.now(timezone.utc)
    due = [r for r in table.by_status("approved")
           if not r["scheduled_for"] or parse_when(r["scheduled_for"]) <= now]
    return min(due, key=lambda r: r["approved_at"] or r["created_at"], default=None)


def check_row(row: dict) -> tuple[list[str], str]:
    rid, platform, fmt = row["id"], row["platform"], row["format"] or "carousel"
    urls = [u for u in row["media_urls"].split() if u]
    if not all(u.startswith("https://") for u in urls):
        raise PublishError(f"Row {rid}: media URLs must be public https URLs")
    if fmt == "carousel" and not 2 <= len(urls) <= 10:
        raise PublishError(f"Row {rid}: carousel needs 2–10 images, has {len(urls)}")
    if fmt == "reel" and (len(urls) != 1 or not urls[0].endswith(".mp4")):
        raise PublishError(f"Row {rid}: a reel needs exactly one .mp4 URL")
    tags = row["hashtags"].split()
    if platform == "youtube":
        if fmt != "reel":
            raise PublishError(f"Row {rid}: YouTube rows must be reels")
        validate_youtube(row["title"], row["caption"], tags)
    elif platform in ("instagram", "facebook"):
        validate_caption(row["caption"], tags)
    else:
        raise PublishError(f"Row {rid}: unsupported platform {platform!r}")
    if platform == "facebook" and auth_mode() != "facebook_login":
        raise PublishError(f"Row {rid}: Facebook posts need a Page and META_AUTH=facebook_login")
    return urls, full_caption(row["caption"], tags)


def post_youtube(row: dict, url: str, description: str, uploader=None) -> str:
    video = requests.get(url, timeout=300)
    video.raise_for_status()
    privacy = config.get("YOUTUBE_PRIVACY", "public")
    return (uploader or youtube.upload_short)(video.content, row["title"], description,
                                              row["hashtags"].split(), privacy=privacy)


def run(table: Table, live: bool = False, client: MetaClient | None = None, log=print,
        yt_uploader=None) -> dict | None:
    row = pick_next(table)
    if row is None:
        log("No approved rows are due. Nothing to publish.")
        return None
    urls, caption = check_row(row)
    fmt = row["format"] or "carousel"
    log(f"Next: {row['id']} ({row['platform']} {fmt}, {len(urls)} media)")
    if not live:
        log("DRY RUN — nothing was posted and the table was not changed. Use --live to publish.")
        return row

    table.update(row["id"], status="posting", error="")
    try:
        if row["platform"] == "youtube":
            post_id = post_youtube(row, urls[0], caption, yt_uploader)
        else:
            client = client or make_client()
            if row["platform"] == "instagram" and fmt == "reel":
                post_id = client.instagram_reel(ig_user_id(client), urls[0], caption)
            elif row["platform"] == "instagram":
                post_id = client.instagram_carousel(ig_user_id(client), urls, caption)
            else:
                post_id = client.facebook_multi_photo(config.get("META_PAGE_ID", required=True), urls, caption)
    except Exception as exc:
        table.update(row["id"], status="failed", error=str(exc)[:500])
        log(f"FAILED: {row['id']}: {exc}")
        raise
    done = table.update(row["id"], status="posted", platform_post_id=post_id,
                        posted_at=datetime.now(timezone.utc).replace(microsecond=0).isoformat())
    log(f"POSTED: {row['id']} → {post_id}")
    return done
