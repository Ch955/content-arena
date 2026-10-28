"""CLI: python -m content_arena <command>. See CLAUDE.md for the workflow."""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from . import pipeline, publish, render, table as table_mod, trends


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(prog="content_arena")
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("trends", help="print trend candidates as JSON")
    p = sub.add_parser("render", help="slides.json → rendered/*.png + *.jpg")
    p.add_argument("post_dir", type=Path)
    p = sub.add_parser("sync", help="upload rendered images (if any) and create/update table rows")
    p.add_argument("post_dir", type=Path)
    p.add_argument("--no-upload", action="store_true", help="don't upload; rows stop at 'drafted'")
    p = sub.add_parser("list", help="list table rows")
    p.add_argument("--status", choices=table_mod.STATUSES)
    for name in ("approve", "reject"):
        p = sub.add_parser(name, help=f"owner only: mark a row {name}d")
        p.add_argument("row_id")
    p = sub.add_parser("publish", help="publish the next approved row (dry run unless --live)")
    p.add_argument("--live", action="store_true")
    sub.add_parser("init-sheet", help="add the status dropdown to the Google Sheet")
    p = sub.add_parser("refresh-ig-token", help="extend IG_ACCESS_TOKEN by 60 days (writes .env, never prints it)")
    p.add_argument("--out", type=Path, help="also write the new token to this file (for CI)")
    sub.add_parser("youtube-auth", help="owner, one time: connect the YouTube channel (writes .env)")
    p = sub.add_parser("pack", help="write tomorrow's Flow prompt pack to the Sheet + create Drive upload folders")
    p.add_argument("post_dirs", type=Path, nargs="+")
    p = sub.add_parser("fetch-clips", help="download the owner's clips from the Drive inbox into content/<post>/clips/")
    p.add_argument("post_dir", type=Path)
    p = sub.add_parser("assemble", help="clips + Telugu voices + music + subtitles → rendered/video.mp4")
    p.add_argument("post_dir", type=Path)
    p = sub.add_parser("plan", help="what to make each day (comedy daily + OTT/fact/quiz rotation)")
    p.add_argument("--days", type=int, default=7)
    p.add_argument("--start", help="YYYY-MM-DD (default: today, IST)")
    args = ap.parse_args(argv)

    if args.cmd == "pack":
        from . import drive, pack
        d, rows = drive.Drive(), []
        for post in args.post_dirs:
            rows += pack.rows_for(post, d.folder(post.name)["webViewLink"])
        url = pack.write_tab(rows, "Tomorrow's shots — for each row: make the image in Flow (step 1), turn it into a "
                                   "video (step 2), upload the clip to the Drive folder with the given name.")
        print(f"Pack ready: {url}")
        return 0
    if args.cmd == "fetch-clips":
        from . import drive
        d = drive.Drive(); clips = d.clips(args.post_dir.name)
        for i, c in enumerate(clips, 1):
            print(d.download(c["id"], args.post_dir / "clips" / f"shot{drive.shot_number(c['name'])}.mp4"))
        print(f"{len(clips)} clip(s) downloaded")
        return 0 if clips else 2
    if args.cmd == "assemble":
        from . import assemble
        print(assemble.assemble(args.post_dir))
        return 0
    if args.cmd == "plan":
        from datetime import date, datetime
        from zoneinfo import ZoneInfo
        from . import schedule
        start = date.fromisoformat(args.start) if args.start else datetime.now(ZoneInfo("Asia/Kolkata")).date()
        for day, pillars in schedule.plan(start, args.days):
            print(f"{day:%a %d %b}: {' + '.join(pillars)}")
        return 0

    if args.cmd == "youtube-auth":
        from . import config, tokens, youtube
        token = youtube.authorize()
        tokens.write_env_value(config.ROOT / ".env", "YOUTUBE_REFRESH_TOKEN", token)
        print("Saved YOUTUBE_REFRESH_TOKEN to .env. Add the same value as a GitHub secret.")
        return 0

    if args.cmd == "refresh-ig-token":
        from . import config, tokens
        new, expires_in = tokens.refresh_ig_token(config.get("IG_ACCESS_TOKEN", required=True))
        env = config.ROOT / ".env"
        if env.exists():
            tokens.write_env_value(env, "IG_ACCESS_TOKEN", new)
            print("Updated IG_ACCESS_TOKEN in .env")
        if args.out:
            tokens.write_secret_file(args.out, new)
            print(f"Wrote new token to {args.out}")
        print(f"New token valid for ~{expires_in // 86400} days")
        return 0

    if args.cmd == "trends":
        print(json.dumps(trends.collect(), ensure_ascii=False, indent=2))
        return 0
    if args.cmd == "render":
        for path in render.render(args.post_dir):
            print(path)
        return 0

    table = table_mod.open_table()
    if args.cmd == "sync":
        upload = None
        if not args.no_upload:
            from .storage import R2Storage
            upload = R2Storage().upload
        for row in pipeline.sync(args.post_dir, table, upload=upload):
            print(f"{row['id']}: {row['status']}")
    elif args.cmd == "list":
        rows = table.by_status(args.status) if args.status else table.all()
        for r in rows:
            print(f"{r['status']:<9} {r['id']}  {r['topic'][:60]}")
    elif args.cmd in ("approve", "reject"):
        status = args.cmd + "d"
        extra = {"approved_at": table_mod.now_iso()} if status == "approved" else {}
        print(f"{args.row_id}: {table.update(args.row_id, status=status, **extra)['status']}")
    elif args.cmd == "publish":
        publish.run(table, live=args.live)
    elif args.cmd == "init-sheet":
        if not isinstance(table, table_mod.SheetTable):
            print("TABLE_BACKEND is not 'sheet' — nothing to do.")
            return 1
        table.add_status_dropdown()
        print("Status dropdown added.")
    return 0


def run() -> int:
    from .config import ConfigError
    try:
        return main()
    except KeyError as exc:
        print(f"No row with id {exc}. See: python -m content_arena list", file=sys.stderr)
    except (ConfigError, table_mod.TransitionError, publish.PublishError, ValueError, FileNotFoundError,
            RuntimeError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
    return 1


if __name__ == "__main__":
    sys.exit(run())
