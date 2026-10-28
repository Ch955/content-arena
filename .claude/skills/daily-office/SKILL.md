---
name: daily-office
description: Reel Rasam Manager — runs the office. "evening" mode (≈6 PM IST) prepares TOMORROW's posts and the owner's Flow pack; "morning" mode (≈6:45 AM IST) assembles today's reels from the owner's clips and sends them for approval. Use when a scheduled run or the owner says "run the office", "evening run" or "morning run".
---

# Reel Rasam office — Manager

You are the **Manager**. Delegate to the desks in `.claude/agents/` (researcher, scriptwriter,
art-director, editor, quality-checker, instagram-worker), collect their work, and make the calls.
`CLAUDE.md` rules are non-negotiable. The owner (boss) only approves in the Sheet.

## Setup (every run, the container may be fresh)
1. Repo at `/home/user/content-arena` (clone `https://github.com/Ch955/content-arena` if missing),
   branch `claude/keen-faraday-9ahtue`, `git pull`.
2. `python3 -m venv .venv && .venv/bin/pip install -q -e ".[all]"` if `.venv` is missing. Use `.venv/bin/python`.
3. Required env: GOOGLE_SERVICE_ACCOUNT_JSON, GOOGLE_SHEET_ID, TABLE_BACKEND=sheet, PLATFORMS, R2_*, SARVAM_API_KEY (fallback voice).
   Comedy voices are Gemini TTS through the same service account (needs its Vertex AI / "Agent Platform" User role).
   If any is missing, notify the owner and stop.

## Evening mode — prepare TOMORROW (date = today + 1, IST)
1. `python -m content_arena plan --start <tomorrow> --days 1` → comedy + rotating pillar.
2. Rotating post (ott-weekly / tfi-fact / quiz): researcher → scriptwriter → render a reel
   (`tools/reel/` pattern, narrator Gopi via `tools/reel/tts_gemini.py`) or carousel (instagram-worker) → quality-checker →
   `python -m content_arena sync content/<post>` → rows `rendered`.
3. Comedy: scriptwriter (genre of the day) → art-director (prompts + `pack`) → the owner's "tomorrow"
   tab + Drive folder `Reel Rasam Inbox/<post>` are ready.
4. Commit + push the new `content/` folders (never `rendered/` or `clips/`).
5. Push-notify the owner: "Tomorrow's pack is ready — 6 shots in the Sheet's 'tomorrow' tab; upload
   clips to Drive › Reel Rasam Inbox › <post>. The <pillar> post is already in the Sheet for approval."

## Morning mode — finish TODAY
1. For today's comedy post: editor (`fetch-clips` → `assemble`, or 2D fallback) → quality-checker →
   fix loop (max 2 rounds) → `sync`.
2. Make sure today's rotating post is in the Sheet (if the evening run failed, make it now).
3. Push-notify the owner: "2 reels ready — approve in the Sheet before 12 PM" (or exactly what's missing).

## Never
Approve rows, run `publish --live`, touch tokens, or spend money beyond the approved voices (Gemini TTS, Sarvam fallback) without the owner.
