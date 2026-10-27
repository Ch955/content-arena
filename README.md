# Content Arena — Reel Rasam

AI-assisted content system for **Reel Rasam**, a faceless Telugu + English cinema/OTT channel.
Claude plans and drafts; Python renders and publishes; **the owner approves every post**.

See [`CLAUDE.md`](CLAUDE.md) for the architecture, status flow and rules, and
[`docs/meta-setup-checklist.md`](docs/meta-setup-checklist.md) for the Meta setup.

## Daily flow

1. `/content-manager` → writes `content/<date>-<slug>/brief.md` (with sourced *Facts to verify*).
2. Ask Claude to run the **instagram-worker** agent on that folder → `slides.json`, `caption.md`, rendered slides.
3. `python -m content_arena sync content/<post>` → uploads images to R2, adds rows to the Sheet (`rendered`).
4. **You** review on your phone (Sheet → image links + facts) and set status to `approved` (or `rejected`).
5. GitHub Actions posts one approved row at ~12:30 and ~19:30 IST (Instagram; Facebook paused).

## Setup (laptop)

```bash
python -m venv .venv && source .venv/bin/activate     # Windows: .venv\Scripts\activate
pip install -e ".[all]"
python -m playwright install chromium                 # one-time browser download (~150 MB)
cp .env.example .env                                  # then fill in values — never commit .env
python -m unittest discover -s tests                  # offline tests
python -m content_arena render content/2026-10-27-gross-net-share-baahubali2
```

## Services (all free tiers)

| Need | Service | Notes |
|---|---|---|
| Content table | Google Sheet + service account | Approve from your phone. `TABLE_BACKEND=csv` for local testing. |
| Image hosting | Cloudflare R2 | Instagram's API needs public JPEG URLs. |
| Publishing | Instagram API (Instagram Login) | No Facebook Page needed; 60-day token auto-refreshed. Facebook later. |
| Schedule | GitHub Actions | Off until repo variable `PUBLISH_ENABLED=true`. |
| Fonts | Anton, Inter, Ramabhadra, Noto Sans Telugu | SIL Open Font License, in `brand/fonts/`. |
