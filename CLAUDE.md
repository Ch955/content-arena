# Content Arena — Reel Rasam

An AI-assisted content system for **Reel Rasam**, a faceless Telugu + English
cinema/OTT channel on Instagram, Facebook and (later) YouTube.
Handles: Instagram `@_reelrasam`, YouTube `@reel_rasam` (see `brand/brand.json`).
Slides and captions use the Instagram handle; the brand hashtag stays `#reelrasam`.

## Roles

- **Owner (human)** — approves every post. Nothing is published without the
  owner setting a row to `approved`.
- **Manager** — the `/content-manager` skill (`.claude/skills/content-manager/`).
  Finds trending topics, picks one, writes a master brief.
- **Workers** — subagents in `.claude/agents/`. Each adapts one brief to one
  platform format. Phase 1 has `instagram-worker` only (its carousel is also
  posted to Facebook). `facebook-worker` and `youtube-worker` come later.
- **Python scripts** (`src/content_arena/`) — rendering, storage, the content
  table and publishing. **The AI never calls publishing APIs directly**;
  only `python -m content_arena publish` does, and only for approved rows.

## Content pillars

| Pillar | Cadence | Format (Phase 1) |
|---|---|---|
| `ott-weekly` — This Week on OTT | 1 / week (Friday) | carousel |
| `trivia` — quizzes, guess-the-movie | 1 / day | carousel |
| `explainer` — Box Office 101 & cinema explainers | 1 / day | carousel |

Language: Telugu-first slides (Telugu script, English movie titles/terms),
captions with a Telugu paragraph then an English one. Spoken scripts are
natural Tenglish ("Gross ante — theatre counter daggara audience kattina total amount").

## Pipeline and status flow

```
/content-manager  →  content/<YYYY-MM-DD>-<slug>/brief.md            row: idea
instagram-worker  →  slides.json + caption.md                        row: drafted
render + upload   →  rendered/*.png (+ .jpg) → public URLs (R2)      row: rendered
owner (Sheet/CLI) →                                                  row: approved | rejected
publish (Actions) →  Instagram / Facebook                            row: posting → posted | failed
```

- One table row per **platform post** (`<post-slug>-instagram`, `<post-slug>-facebook`).
- Allowed transitions are enforced in `src/content_arena/table.py`. Scripts
  never move a row into `approved` except via the owner's explicit
  `approve` command, and never touch `approved`/`posted` rows when syncing.
- `publish` posts **at most one** row per run, oldest `approved` first, and
  defaults to dry run; `--live` is required to actually post.

## Commands

```bash
python -m content_arena trends                    # trending candidates (JSON)
python -m content_arena render content/<post>     # slides.json → rendered/*.png + *.jpg
python -m content_arena sync content/<post>       # upload images + create/update table rows
python -m content_arena list [--status approved]
python -m content_arena approve <row-id>          # owner only — never run this yourself
python -m content_arena publish [--live]
python -m unittest discover -s tests              # tests (no network, no accounts)
```

## Rules (non-negotiable)

1. **Original content only.** Never copy other creators' scripts, clips,
   music, designs, posters or stills. Visuals are our own HTML/CSS; movie
   titles appear as text only.
2. **Never invent statistics or facts.** Every number, date, name or claim
   must come from a source that is linked in the brief's `Facts to verify`
   section. If a fact can't be sourced, drop it or mark it `UNVERIFIED` —
   the owner decides. Box-office figures are always labelled as trade
   estimates with the source named on the slide.
3. **Explain with a real example.** Explainers use a well-known hit (e.g. a
   major Telugu release) with sourced numbers, not abstract or made-up ones.
   Show the arithmetic and check it.
4. **Secrets** (tokens, IDs, keys) live only in `.env` (git-ignored), the
   cloud environment settings, or GitHub Actions secrets. Never hard-code,
   print, log or commit them. `.env.example` lists names only.
5. **Ask the owner before** installing anything, or running any command that
   touches their accounts (`sync` uploads, `publish --live`, token exchange).
6. **Keep it cheap:** free tiers and open-source first. Flag any cost.
7. **Telugu text is reviewed by the owner** — flag anything you're unsure of.

## Layout

```
.claude/skills/content-manager/SKILL.md   manager skill
.claude/agents/instagram-worker.md        carousel worker
brand/brand.json, brand/fonts/            colours, fonts (OFL licences included)
templates/carousel/slide.html.j2          slide template (1080×1350)
content/<date>-<slug>/                    brief.md, slides.json, caption.md, rendered/
src/content_arena/                        Python package
docs/meta-setup-checklist.md              Meta account/app/token setup
.github/workflows/publish.yml             twice-daily publish (guarded by PUBLISH_ENABLED)
```
