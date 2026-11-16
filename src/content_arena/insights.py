"""Read-only Instagram dashboard (owner, 16 Nov 2026: "read my Instagram dashboard").

Uses the same Instagram Login token as publishing (IG_ACCESS_TOKEN), which must also carry the
`instagram_business_manage_insights` permission. Only GET requests: this module never posts or changes anything.

Collected:
- profile: username, followers, posts (needs only instagram_business_basic)
- account totals for the last N days: views, reach, accounts engaged, interactions, likes, comments, shares,
  saves, follows/unfollows, profile link taps
- daily new followers and daily reach (time series)
- follower demographics (age, gender, city) when Instagram has enough followers to show them (≥100)
- per reel: plays/views, reach, likes, comments, shares, saves, average watch time

A metric Instagram refuses (missing permission, too few followers, not available for the account) is recorded
under "errors" instead of stopping the report. The token is sent in the Authorization header only, never printed.
"""
from __future__ import annotations

import json
from datetime import date, datetime, timedelta, timezone

from .publish import MetaClient, PublishError, make_client, ig_user_id

ACCOUNT_TOTALS = ["views", "reach", "accounts_engaged", "total_interactions", "likes", "comments", "shares",
                  "saves", "follows_and_unfollows", "profile_links_taps"]
REEL_METRICS = ["views", "reach", "likes", "comments", "shares", "saved", "total_interactions",
                "ig_reels_avg_watch_time", "ig_reels_video_view_total_time"]
PERMISSION_HINT = ("The Instagram token can't read insights yet: regenerate it with the "
                   "'instagram_business_manage_insights' permission (see docs/meta-setup-checklist.md, section F).")


def _epoch(d: date) -> int:
    return int(datetime(d.year, d.month, d.day, tzinfo=timezone.utc).timestamp())


def _try(errors: dict, key: str, fn):
    try:
        return fn()
    except PublishError as e:
        errors[key] = str(e)
        return None


def _total(item: dict) -> int | float | dict | None:
    tv = item.get("total_value") or {}
    if tv.get("breakdowns"):
        out = {}
        for b in tv["breakdowns"]:
            for r in b.get("results", []):
                out[" / ".join(r.get("dimension_values", []))] = r.get("value")
        return out
    return tv.get("value")


def collect(client: MetaClient, user_id: str, days: int = 30, reels: int = 25, today: date | None = None) -> dict:
    today = today or datetime.now(timezone.utc).date()
    since, until = today - timedelta(days=days), today
    errors: dict[str, str] = {}
    report: dict = {"generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
                    "window": {"since": since.isoformat(), "until": until.isoformat(), "days": days}}

    report["profile"] = _try(errors, "profile", lambda: client._call(
        "GET", user_id, fields="username,followers_count,follows_count,media_count"))

    totals = {}
    for metric in ACCOUNT_TOTALS:   # one call per metric so a single unsupported metric doesn't hide the rest
        body = _try(errors, f"account.{metric}", lambda m=metric: client._call(
            "GET", f"{user_id}/insights", metric=m, period="day", metric_type="total_value",
            since=_epoch(since), until=_epoch(until)))
        if body:
            for item in body.get("data", []):
                totals[item["name"]] = _total(item)
    breakdown = _try(errors, "account.follows_and_unfollows.breakdown", lambda: client._call(
        "GET", f"{user_id}/insights", metric="follows_and_unfollows", period="day", metric_type="total_value",
        breakdown="follow_type", since=_epoch(since), until=_epoch(until)))
    if breakdown and breakdown.get("data"):
        totals["follows_and_unfollows"] = _total(breakdown["data"][0])
    report["account_totals"] = totals

    series = {}
    for metric in ("follower_count", "reach"):
        # time series allow at most 30 days per call
        body = _try(errors, f"daily.{metric}", lambda m=metric: client._call(
            "GET", f"{user_id}/insights", metric=m, period="day", metric_type="time_series",
            since=_epoch(max(since, until - timedelta(days=29))), until=_epoch(until)))
        if body and body.get("data"):
            series[metric] = {v["end_time"][:10]: v["value"] for v in body["data"][0].get("values", [])}
    report["daily"] = series

    demo = {}
    for dim in ("age", "gender", "city"):
        body = _try(errors, f"followers.{dim}", lambda d=dim: client._call(
            "GET", f"{user_id}/insights", metric="follower_demographics", period="lifetime",
            metric_type="total_value", timeframe="this_month", breakdown=d))
        if body and body.get("data"):
            demo[dim] = _total(body["data"][0])
    report["follower_demographics"] = demo

    media = _try(errors, "media", lambda: client._call(
        "GET", f"{user_id}/media", limit=reels,
        fields="id,caption,timestamp,permalink,media_type,media_product_type,like_count,comments_count")) or {}
    rows = []
    for m in media.get("data", []):
        row = {"id": m["id"], "posted": m.get("timestamp", "")[:16], "type": m.get("media_product_type"),
               "permalink": m.get("permalink"), "caption": (m.get("caption") or "").split("\n")[0][:80],
               "likes": m.get("like_count"), "comments": m.get("comments_count")}
        metrics = REEL_METRICS if m.get("media_product_type") == "REELS" else \
            ["views", "reach", "likes", "comments", "shares", "saved", "total_interactions"]
        body = _try(errors, f"media.{m['id']}", lambda mid=m["id"], ms=metrics: client._call(
            "GET", f"{mid}/insights", metric=",".join(ms)))
        for item in (body or {}).get("data", []):
            vals = item.get("values") or [{}]
            row[item["name"]] = vals[0].get("value", _total(item))
        rows.append(row)
    report["media"] = rows
    report["errors"] = errors
    if any("permission" in e.lower() or "(code 10" in e or "(code 200" in e for e in errors.values()):
        report["hint"] = PERMISSION_HINT
    return report


def _fmt(v) -> str:
    if v is None:
        return "–"
    if isinstance(v, float):
        return f"{v:,.1f}"
    if isinstance(v, int):
        return f"{v:,}"
    return str(v)


def to_markdown(r: dict) -> str:
    p = r.get("profile") or {}
    w = r["window"]
    out = [f"# Instagram dashboard — @{p.get('username', '?')}",
           f"Generated {r['generated_at']} · window {w['since']} → {w['until']} ({w['days']} days)", "",
           f"**Followers:** {_fmt(p.get('followers_count'))} · **Following:** {_fmt(p.get('follows_count'))} · "
           f"**Posts:** {_fmt(p.get('media_count'))}", ""]
    t = r.get("account_totals") or {}
    if t:
        out += ["## Account totals", "| Metric | Value |", "|---|---|"]
        out += [f"| {k} | {_fmt(v) if not isinstance(v, dict) else ', '.join(f'{a}: {b}' for a, b in v.items())} |"
                for k, v in t.items()]
        out.append("")
    for name, s in (r.get("daily") or {}).items():
        out += [f"## Daily {name}", " · ".join(f"{d[5:]}: {v}" for d, v in s.items()), ""]
    for dim, d in (r.get("follower_demographics") or {}).items():
        top = sorted(d.items(), key=lambda kv: -(kv[1] or 0))[:10] if isinstance(d, dict) else []
        out += [f"## Followers by {dim}", " · ".join(f"{k}: {v}" for k, v in top), ""]
    media = r.get("media") or []
    if media:
        out += ["## Posts (newest first)",
                "| Posted (UTC) | Type | Views | Reach | Likes | Comments | Shares | Saves | Avg watch (ms) | Caption |",
                "|---|---|---|---|---|---|---|---|---|---|"]
        for m in media:
            out.append(f"| {m['posted']} | {m.get('type') or ''} | {_fmt(m.get('views'))} | {_fmt(m.get('reach'))} | "
                       f"{_fmt(m.get('likes'))} | {_fmt(m.get('comments'))} | {_fmt(m.get('shares'))} | "
                       f"{_fmt(m.get('saved'))} | {_fmt(m.get('ig_reels_avg_watch_time'))} | "
                       f"{m['caption'].replace('|', '/')} |")
        out.append("")
    if r.get("hint"):
        out += [f"> {r['hint']}", ""]
    if r.get("errors"):
        out += [f"<details><summary>{len(r['errors'])} metric(s) Instagram did not return</summary>", ""]
        out += [f"- {k}: {v}" for k, v in r["errors"].items()]
        out += ["", "</details>"]
    return "\n".join(out)


def run(days: int = 30, reels: int = 25, out_json: str | None = None) -> dict:
    client = make_client()
    report = collect(client, ig_user_id(client), days=days, reels=reels)
    if out_json:
        with open(out_json, "w", encoding="utf-8") as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
    return report
