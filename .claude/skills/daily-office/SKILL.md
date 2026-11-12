---
name: daily-office
description: Reel Rasam Manager — runs the office. "evening" mode (≈6 PM IST) makes TOMORROW's two card reels (podupu katha + book story / life lesson) and puts them in the Sheet; "morning" mode (≈6:45 AM IST) checks today's posts are ready for approval. Use when a scheduled run or the owner says "run the office", "evening run" or "morning run".
---

# Reel Rasam office — Manager

You are the **Manager**. Delegate to the desks in `.claude/agents/` (researcher, scriptwriter,
editor, quality-checker; art-director and instagram-worker only for image/carousel work), collect their work, and make the calls.
`CLAUDE.md` rules are non-negotiable. The owner (boss) only approves in the Sheet.

## Setup (every run, the container may be fresh)
1. Repo at `/home/user/content-arena` (clone `https://github.com/Ch955/content-arena` if missing),
   branch `claude/keen-faraday-9ahtue`, `git pull`.
2. `python3 -m venv .venv && .venv/bin/pip install -q -e ".[all]"` if `.venv` is missing. Use `.venv/bin/python`.
3. Required env: GOOGLE_SERVICE_ACCOUNT_JSON, GOOGLE_SHEET_ID, TABLE_BACKEND=sheet, PLATFORMS, R2_*, SARVAM_API_KEY (fallback voice).
   Comedy voices are Gemini TTS through the same service account (needs its Vertex AI / "Agent Platform" User role).
   If any is missing, notify the owner and stop.

## Evening mode — make TOMORROW's two reels (date = today + 1, IST)
1. `python -m content_arena plan --start <tomorrow> --days 1` → from 13 Nov: slot 1 `what-if` or `moral-dilemma`,
   slot 2 `micro-doc` or `modern-dilemma` (owner: adult storylines, premium, never childish; CLAUDE.md quality bar).
2. Pick strong premises (pitch 3, keep the one you'd send to a friend): real stakes in line 1, a twist, a hard A/B
   question, specific Telugu 25–34 life details. Micro-docs: Researcher first, true facts only. **The answer / ending
   is always revealed in the same reel.**
3. Researcher (sources for any story/quote) → scriptwriter (script with the 7 interaction beats in CLAUDE.md,
   acting notes per line) → editor (2D animation with `tools/anim2d/` in the day's art style from `plan` —
   neon/clay/paper/pixel/flat, the two reels differ; voices ElevenLabs → Gemini → Sarvam automatically; make the
   on-screen action interactive: tap/poll buttons, comment bubbles, countdown, reactions; card reel only as a fallback)
   → quality-checker → `python -m content_arena sync content/<post>` → rows `rendered`.
4. Commit + push the new `content/` folders (never `rendered/`, `clips/` or `work/`).
5. Push-notify the owner: "Tomorrow's 2 reels are in the Sheet — approve before 7 AM (they post at ~7:30 AM and ~6:30 PM)" (+ anything to check).

## Morning mode — check TODAY
1. Make sure today's two reels are in the Sheet as `rendered`/`approved`; if the evening run failed, make them now
   (same steps as evening).
2. If Gemini voices were unavailable last night (Sarvam fallback) and work now, re-voice + re-render rows that
   are still `rendered` (never touch `approved` rows).
3. Push-notify only if something needs the owner (missing approval, a problem).

## Never
Approve rows, run `publish --live`, touch tokens, or spend money beyond the approved voices (ElevenLabs credits, Gemini TTS, Sarvam fallback) without the owner.
