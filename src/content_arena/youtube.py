"""YouTube Shorts upload via the YouTube Data API (OAuth refresh token, resumable upload).

Important: videos uploaded from an *unverified* API project are locked to private viewing until the
project passes YouTube's API compliance audit (see docs/youtube-setup.md). The uploader still works;
the owner flips each video to Public in YouTube Studio until the audit is approved.

`authorize()` is a one-time, owner-run step on the laptop: it opens Google's consent page and writes
YOUTUBE_REFRESH_TOKEN into .env. Nothing secret is printed.
"""
from __future__ import annotations

import http.server
import secrets
import threading
import urllib.parse
import webbrowser

import requests

from . import config

TOKEN_URL = "https://oauth2.googleapis.com/token"
AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
UPLOAD_URL = "https://www.googleapis.com/upload/youtube/v3/videos"
SCOPE = "https://www.googleapis.com/auth/youtube.upload"
CATEGORY_ENTERTAINMENT = "24"


class YouTubeError(RuntimeError):
    pass


def access_token(session: requests.Session | None = None) -> str:
    http = session or requests
    r = http.post(TOKEN_URL, timeout=30, data={
        "client_id": config.get("YOUTUBE_CLIENT_ID", required=True),
        "client_secret": config.get("YOUTUBE_CLIENT_SECRET", required=True),
        "refresh_token": config.get("YOUTUBE_REFRESH_TOKEN", required=True),
        "grant_type": "refresh_token",
    })
    body = r.json() if r.content else {}
    if r.status_code >= 400 or "access_token" not in body:
        reason = body.get("error_description") or body.get("error") or r.status_code
        raise YouTubeError(f"YouTube token refresh failed: {reason} — if it says invalid_grant, "
                           "run `python -m content_arena youtube-auth` again")
    return body["access_token"]


def upload_short(video: bytes, title: str, description: str, tags: list[str],
                 privacy: str = "public", session: requests.Session | None = None) -> str:
    """Resumable upload in two requests. Returns the video ID."""
    http = session or requests.Session()
    auth = {"Authorization": f"Bearer {access_token(http)}"}
    meta = {
        "snippet": {"title": title, "description": description,
                    "tags": [t.lstrip("#") for t in tags], "categoryId": CATEGORY_ENTERTAINMENT,
                    "defaultLanguage": "te", "defaultAudioLanguage": "te"},
        "status": {"privacyStatus": privacy, "selfDeclaredMadeForKids": False},
    }
    start = http.post(UPLOAD_URL, params={"uploadType": "resumable", "part": "snippet,status"}, timeout=60,
                      json=meta, headers={**auth, "X-Upload-Content-Type": "video/mp4",
                                          "X-Upload-Content-Length": str(len(video))})
    if start.status_code >= 400 or "Location" not in start.headers:
        raise YouTubeError(f"YouTube upload init failed: HTTP {start.status_code} {start.text[:300]}")
    done = http.put(start.headers["Location"], data=video, timeout=600,
                    headers={**auth, "Content-Type": "video/mp4"})
    if done.status_code >= 400:
        raise YouTubeError(f"YouTube upload failed: HTTP {done.status_code} {done.text[:300]}")
    return done.json()["id"]


def authorize(port: int = 8765) -> str:
    """One-time consent flow on the owner's laptop (Desktop OAuth client). Returns the refresh token."""
    client_id = config.get("YOUTUBE_CLIENT_ID", required=True)
    redirect = f"http://127.0.0.1:{port}/"
    state = secrets.token_urlsafe(16)
    url = AUTH_URL + "?" + urllib.parse.urlencode({
        "client_id": client_id, "redirect_uri": redirect, "response_type": "code", "scope": SCOPE,
        "access_type": "offline", "prompt": "consent", "state": state,
    })
    result: dict = {}

    class Handler(http.server.BaseHTTPRequestHandler):
        def do_GET(self):
            q = dict(urllib.parse.parse_qsl(urllib.parse.urlparse(self.path).query))
            if q.get("state") == state and "code" in q:
                result["code"] = q["code"]
                msg = "Reel Rasam: YouTube connected. You can close this tab."
            else:
                msg = "Authorization failed or was cancelled. Close this tab and try again."
            self.send_response(200)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.end_headers()
            self.wfile.write(msg.encode())

        def log_message(self, *args):
            pass

    server = http.server.HTTPServer(("127.0.0.1", port), Handler)
    thread = threading.Thread(target=server.handle_request, daemon=True)
    thread.start()
    print("Opening Google's consent page. Sign in with the Reel Rasam account and pick the @reel_rasam channel.")
    print("If no browser opens, paste this URL into one:\n" + url)
    webbrowser.open(url)
    thread.join(timeout=300)
    server.server_close()
    if "code" not in result:
        raise YouTubeError("No authorization code received (timed out after 5 minutes)")
    r = requests.post(TOKEN_URL, timeout=30, data={
        "code": result["code"], "client_id": client_id,
        "client_secret": config.get("YOUTUBE_CLIENT_SECRET", required=True),
        "redirect_uri": redirect, "grant_type": "authorization_code",
    })
    body = r.json()
    if "refresh_token" not in body:
        raise YouTubeError(f"Token exchange failed: {body.get('error_description') or body.get('error')}")
    return body["refresh_token"]
