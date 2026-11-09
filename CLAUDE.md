# Content Arena — Reel Rasam

An AI-assisted content system for **Reel Rasam**, a faceless Telugu + English
riddles, stories & life-lessons channel (cinema/OTT until 8 Nov 2026) on Instagram, Facebook and (later) YouTube.
Handles: Instagram `@_reelrasam`, YouTube `@reel_rasam` (see `brand/brand.json`).
Slides and captions use the Instagram handle; the brand hashtag stays `#reelrasam`.

## Roles

- **Owner (human)** — approves every post. Nothing is published without the
  owner setting a row to `approved`.
- **Manager** — the `/content-manager` skill (`.claude/skills/content-manager/`).
  Finds trending topics, picks one, writes a master brief.
- **Workers** — subagents in `.claude/agents/`. Each adapts one brief to one
  platform format. Phase 1 has `instagram-worker` only. Facebook is **paused**
  (no Page yet): rows are Instagram-only (`PLATFORMS=instagram`) and publishing
  uses Instagram Login (`META_AUTH=instagram_login`, no Page needed).
  Reels (format `reel`: `caption.md` + `youtube.md` + `rendered/video.mp4`) go to
  Instagram Reels and YouTube Shorts (`PLATFORMS=instagram,youtube`). `facebook-worker`
  and a dedicated `youtube-worker` come later; reel rendering is a prototype in `tools/reel/`.
- **Python scripts** (`src/content_arena/`) — rendering, storage, the content
  table and publishing. **The AI never calls publishing APIs directly**;
  only `python -m content_arena publish` does, and only for approved rows.

## Content pillars

**Owner's plan from 9 Nov 2026: the channel moved off cinema** to riddles, stories from great books and
premium life lessons — **2 posts a day, every post interactive** (a question the viewer answers in the comments).
`python -m content_arena plan` prints what to make (`src/content_arena/schedule.py`).

| Pillar | When | Format |
|---|---|---|
| `podupu` — పొడుపు కథ / story-riddle (lateral-thinking mysteries welcome) | **every day** (slot 1) | animated reel, ~35–50 s: hook → riddle/clues → comment-before-reveal + countdown → **answer in the same reel** → why → share/follow |
| `book-story` — a story from a great book: Betala Kathalu, Panchatantra, Tenali Rama, Jataka/Aesop-style fables, big ideas from good non-fiction | **Mon/Wed/Fri/Sun** (slot 2) | animated reel, ~60–75 s, ends with a question → countdown → answer/reasoning → "మీరు agree ఆ?" |
| `life-lesson` — premium, non-cliché lessons (Vemana, Sumathi Satakam, Thirukkural, Marcus Aurelius/Seneca, ideas like second-order thinking) | **Tue/Thu/Sat** (slot 2) | animated reel, ~45 s, a dilemma the viewer answers ("A or B? comment చేయండి") |

**Owner's rule (9 Nov 2026): every answer is revealed in the same reel — never held for a later reel.**

**Format (owner-approved 9 Nov 2026): 2D animated reels** made with `tools/anim2d/` (our drawn cast — Gopi hosts,
Pinky guesses — lip-synced Gemini voices, synthesized music/SFX, Telugu subtitles). Card reels (`shots.json` with
`card`s → `python -m content_arena assemble`) are the quick fallback. No owner uploads are needed.

**Interaction beats in every reel** (wording adapted to the reel; Tenglish, talk to the viewer):
1. 0–3 s hook ("Hey! ఆగండి… 90% మంది దీన్ని solve చేయలేరు!").
2. ~5 s: "Answer చివర్లో ఉంది… చివరి వరకు చూడండి!" (on screen: ANSWER AT THE END 👀).
3. After the clues: "ఇలాంటివి రోజూ కావాలంటే… follow చేయండి, YouTube లో subscribe!" (animated follow tap).
4. Right before the reveal: "Answer reveal అయ్యే ముందే… మీ answer comment లో పెట్టండి!" + 5 s countdown.
5. After the reveal: "మీ answer correct ఆ? Comment లో ✅ పెట్టండి!".
6. Share: "ఈ riddle మీ friend కి share చేసి… వాళ్ళ knowledge check చేయండి!" (stories: "మీ పిల్లలకి share చేయండి").
7. Close: "Follow చేయండి… subscribe చేయండి… రేపు ఇంకో twist!" + end card.

**Book and lesson content — how to stay safe and true:**
- Public-domain classics retold in our own words, or a modern book's *idea* explained in our own words with the
  book and author named. Never copy text; quote at most one short line, always attributed.
- Every quote, attribution and claim needs a source in `Facts to verify`; mark adaptations ("retold and adapted
  from …") in the caption. Never invent a quote or put words in a real person's mouth.
- Nothing that mocks or argues about religion, caste, region or politics; drop caste labels and ritual details
  from old stories. Keep it family-friendly.
- Riddles: traditional folk riddles or our own originals, with exactly one fair answer.
- Mark AI-generated/altered content where the platform asks (YouTube "altered or synthetic", Meta AI label).

The old cinema pillars (comedy, ott-weekly, tfi-fact, quiz; 28 Oct – 8 Nov 2026) are retired; their safety
rules (no star lookalikes, no film footage/music) still apply to anything cinema-related.

Language: Telugu-first slides and cards (Telugu script, English terms where natural),
captions with a Telugu paragraph then an English one. Spoken scripts are natural Tenglish.

**Spoken style (reels): talk *to* the viewer, never read a paragraph.** Open with a scroll-stopping
hook ("Hey! ఆగండి ఆగండి… scroll చేయకండి!"), use short punchy lines (one idea each, ≤ ~12 words),
questions to the viewer ("Ready ఆ?", "మీరు ఈ కథ విప్పగలరా?"), reactions and countdowns
("Number one —"), and a direct CTA ("follow కొట్టండి, bell నొక్కండి!"). Voices (owner-approved
28 Oct 2026): **Gemini TTS** — since 9 Nov via the **Gemini API / AI Studio key** (network secret for
`generativelanguage.googleapis.com`, free tier; the Cloud project's billing account is inactive), each line acted from a per-line `act` direction, sped up 5% (`SPEED` in
`assemble.py`); host=Puck, cast voices Gopi=Puck, Chinna=Fenrir, Pandu=Algenib, Pinky=Leda, Amma=Kore (~₹2 per reel,
$300 trial credit). Every take is auto-checked (length + a Gemini listener) and re-taken if it reads the
direction aloud or drags. Old house voice (fallback only): Sarvam bulbul:v3 `shubh`, pace 1.18, temp 0.9.

## Pipeline and status flow

```
/content-manager  →  content/<YYYY-MM-DD>-<slug>/brief.md            row: idea
instagram-worker  →  slides.json + caption.md                        row: drafted
render + upload   →  rendered/*.png (+ .jpg) → public URLs (R2)      row: rendered
owner (Sheet/CLI) →                                                  row: approved | rejected
publish (Actions) →  Instagram / Facebook                            row: posting → posted | failed
```

- One table row per **platform post** (`<post-slug>-instagram`, `-youtube` for reels; `-facebook` once a Page exists).
- **Hashtags (owner, 9 Nov 2026: use the high-reach ones):** Instagram allows only **5** (its cap since Dec 2025),
  so pick the biggest *relevant* tags — e.g. riddle reel: `#telugu #telugureels #riddles #podupukathalu #reelrasam`;
  story: `#telugu #telugureels #telugustories #moralstories #reelrasam`. YouTube: up to **15** — `#shorts` + 2 big
  ones first (shown above the title), then e.g. `#telugu #telugushorts #riddles #riddle #brainteaser #puzzle
  #iqtest #teluguriddles #podupukathalu #kathalu #telugustories #reelrasam`. Tags must match the reel (unrelated
  trending tags get a video ignored); YouTube drops all tags if a video has more than 60.
- **Publish times (owner, 9 Nov 2026):** ~7:30 AM and ~6:30 PM IST (`.github/workflows/publish.yml`); the owner
  approves the next day's reels by 7 AM.
- Allowed transitions are enforced in `src/content_arena/table.py`. Scripts
  never move a row into `approved` except via the owner's explicit
  `approve` command, and never touch `approved`/`posted` rows when syncing.
- `publish` posts **at most one row per platform** per run, oldest `approved` first, and
  defaults to dry run; `--live` is required to actually post.

## Commands

```bash
python -m content_arena trends                    # trending candidates (JSON)
python -m content_arena render content/<post>     # slides.json → rendered/*.png + *.jpg
python -m content_arena sync content/<post>       # upload images + create/update table rows
python -m content_arena list [--status approved]
python -m content_arena approve <row-id>          # owner only — never run this yourself
python -m content_arena publish [--live]
python -m content_arena refresh-ig-token          # owner: extend the 60-day IG token (touches account)
python -m content_arena youtube-auth              # owner, once: connect @reel_rasam (touches account)
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
docs/youtube-setup.md                     YouTube OAuth + API audit (uploads are private until audited)
tools/anim2d/                             2D animated reel engine (default format; see its README)
tools/reel/                               reel renderer prototype (HTML scenes + Gemini narrator + ffmpeg)
.github/workflows/publish.yml             twice-daily publish (guarded by PUBLISH_ENABLED)
.github/workflows/refresh-ig-token.yml    twice-monthly IG token refresh (guarded by PUBLISH_ENABLED)
```
