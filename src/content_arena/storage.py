"""Upload rendered slides to Cloudflare R2 (S3-compatible) and return public URLs.

Instagram's API only accepts images by public URL, so every slide must be hosted.
Keys include a content hash, so a re-render always gets a fresh URL (no stale CDN cache).
"""
from __future__ import annotations

import hashlib
from pathlib import Path

from . import config

CONTENT_TYPES = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".mp4": "video/mp4"}


def object_key(post_slug: str, path: Path) -> str:
    digest = hashlib.sha256(path.read_bytes()).hexdigest()[:10]
    return f"posts/{post_slug}/{path.stem}-{digest}{path.suffix}"


class R2Storage:
    def __init__(self):
        import boto3  # optional dependency: pip install -e .[r2]

        account = config.get("R2_ACCOUNT_ID", required=True)
        self.bucket = config.get("R2_BUCKET", required=True)
        self.public_base = config.get("R2_PUBLIC_BASE_URL", required=True).rstrip("/")
        self.s3 = boto3.client(
            "s3",
            endpoint_url=f"https://{account}.r2.cloudflarestorage.com",
            aws_access_key_id=config.get("R2_ACCESS_KEY_ID", required=True),
            aws_secret_access_key=config.get("R2_SECRET_ACCESS_KEY", required=True),
            region_name="auto",
        )

    def upload(self, post_slug: str, files: list[Path]) -> list[str]:
        urls = []
        for path in files:
            key = object_key(post_slug, path)
            content_type = CONTENT_TYPES.get(path.suffix.lower(), "application/octet-stream")
            self.s3.upload_file(str(path), self.bucket, key, ExtraArgs={"ContentType": content_type})
            urls.append(f"{self.public_base}/{key}")
        return urls
