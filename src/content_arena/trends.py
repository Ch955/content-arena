"""Free trend signals for the manager skill. Each source fails soft: a broken source
returns an error entry instead of stopping the run. Signals are leads, not facts."""
from __future__ import annotations

import xml.etree.ElementTree as ET

import requests

from . import config

UA = {"User-Agent": "content-arena/0.1 (trend research)"}
TIMEOUT = 15


def google_trends_india() -> list[dict]:
    """Google Trends daily trending searches for India (public RSS)."""
    r = requests.get("https://trends.google.com/trending/rss?geo=IN", headers=UA, timeout=TIMEOUT)
    r.raise_for_status()
    ns = {"ht": "https://trends.google.com/trending/rss"}
    out = []
    for item in ET.fromstring(r.content).iter("item"):
        out.append({
            "source": "google_trends_in",
            "title": item.findtext("title", ""),
            "traffic": item.findtext("ht:approx_traffic", "", ns),
            "link": item.findtext("link", ""),
            "news": [n.findtext("ht:news_item_title", "", ns) for n in item.findall("ht:news_item", ns)][:3],
        })
    return out


def youtube_trending_entertainment() -> list[dict]:
    """YouTube 'most popular' in India, Entertainment category (24). Needs YOUTUBE_API_KEY (free quota)."""
    key = config.get("YOUTUBE_API_KEY")
    if not key:
        return [{"source": "youtube_in", "error": "YOUTUBE_API_KEY not set — skipped"}]
    r = requests.get("https://www.googleapis.com/youtube/v3/videos", timeout=TIMEOUT, params={
        "part": "snippet,statistics", "chart": "mostPopular", "regionCode": "IN",
        "videoCategoryId": "24", "maxResults": 25, "key": key,
    })
    r.raise_for_status()
    return [{
        "source": "youtube_in",
        "title": v["snippet"]["title"],
        "channel": v["snippet"]["channelTitle"],
        "views": v.get("statistics", {}).get("viewCount"),
        "link": f"https://www.youtube.com/watch?v={v['id']}",
    } for v in r.json().get("items", [])]


def reddit_tollywood() -> list[dict]:
    """Top r/tollywood posts of the day (public JSON; may be rate-limited)."""
    r = requests.get("https://www.reddit.com/r/tollywood/top.json", params={"t": "day", "limit": 20},
                     headers=UA, timeout=TIMEOUT)
    r.raise_for_status()
    return [{
        "source": "reddit_tollywood",
        "title": c["data"]["title"],
        "score": c["data"]["score"],
        "link": "https://www.reddit.com" + c["data"]["permalink"],
    } for c in r.json()["data"]["children"]]


SOURCES = [google_trends_india, youtube_trending_entertainment, reddit_tollywood]


def collect() -> list[dict]:
    results = []
    for fn in SOURCES:
        try:
            results.extend(fn())
        except Exception as exc:  # one bad source shouldn't stop the others
            results.append({"source": fn.__name__, "error": f"{type(exc).__name__}: {exc}"})
    return results
