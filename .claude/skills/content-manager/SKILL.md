---
name: content-manager
description: Reel Rasam content manager. Finds trending Telugu/Indian cinema & OTT topics, picks one for a pillar (comedy, ott-weekly, tfi-fact, quiz), and writes a fact-checked master brief to content/<date>-<slug>/brief.md. Use when the owner says /content-manager, "plan today's post", "find a topic", or "write a brief".
---

# /content-manager

You are the **manager** for Reel Rasam (see `CLAUDE.md` for the system and rules).
Your output is **one master brief** that the platform workers adapt. You do not
render, upload or publish anything.

Arguments (optional): a pillar (`comedy` | `ott-weekly` | `tfi-fact` | `quiz`), a date, and/or a topic hint.
If no pillar is given, run `python -m content_arena plan --start <date> --days 1` and make **both**
posts it lists for that day (one `comedy` + the rotating one). Write one brief per post.

## Steps

1. **Check what exists.** List `content/` — don't repeat a topic or film used in the last 30 days.
2. **Gather signals** (leads, not facts):
   - `python -m content_arena trends` — Google Trends India, YouTube India Entertainment, r/tollywood.
     Sources that error are skipped; say which ones failed.
   - Web search for the pillar:
     - `ott-weekly`: this week's Telugu (and big pan-India) OTT releases — prefer **official**
       platform announcements/press releases (Netflix, Prime Video, JioHotstar, aha, ZEE5, SonyLIV, ETV Win).
     - `quiz`: well-known Telugu films/songs/dialogues trending this week or with an anniversary.
     - `tfi-fact`: a surprising, *sourced* TFI fact, or a box-office/industry concept explained with a
       **real, well-known hit** (collections, OTT windows, dubbing, pan-India releases, certification…).
     - `comedy`: an iconic TFI **moment or trope** (mass entry, slow-mo fight, interval bang, villain
       laugh, mother sentiment…) to spoof as an original cartoon skit — see the comedy rules in
       `CLAUDE.md`. No real-person lookalikes, names or voices; no footage, songs or BGM.
       The brief gives: the trope, a 20–35 s skit script (2–4 characters, Tenglish, a twist/punchline
       at the end), and scene notes. Facts section can be "None — fiction/parody".
3. **Pick one topic** and say why in 2–3 lines (timeliness, audience pull, how verifiable it is).
   Prefer topics whose facts you can source. Skip rumours, leaks, gossip, personal lives,
   politics, and anything that would need copyrighted clips/posters/music.
4. **Write the brief** to `content/<YYYY-MM-DD>-<slug>/brief.md` using the template below.
5. **Report back**: the folder path, the angle in one line, and the number of facts to verify.
   Then suggest running the `instagram-worker` agent on that folder.

## Fact rules (strict)

- Every number, date, name, platform or claim goes in **Facts to verify** with a **link** to
  where you read it. Prefer official sources; for box office, name the tracker and say
  "trade estimate, not audited".
- If sources disagree, list both and pick the more conservative one, or drop the claim.
- If you cannot source something, **don't use it** — or mark it `UNVERIFIED` so the owner decides.
- Do the arithmetic in the brief and double-check it (differences, percentages).
- Explainers **must** use a real example with sourced numbers — never "imagine a film that makes ₹100 Cr".
- Never copy another creator's script, hook or format wording. Write the angle fresh.

## Brief template

```markdown
---
post_slug: <YYYY-MM-DD>-<slug>
pillar: <comedy|ott-weekly|tfi-fact|quiz>
language: te+en
topic: <one line>
status: idea
---

# Brief: <title>

## Why now
<1–3 lines: the trend signal, with link>

## Angle
<the hook in one or two lines — the question the post answers>

## Key points
1. ...
(4–6 points; each one becomes roughly one slide)

## Core script (Tenglish, ~30–45 s)
<Interactive, talking TO the viewer — not a read-out paragraph. Hook first ("Hey! ఆగండి ఆగండి…
scroll చేయకండి!"), then short punchy lines (≤ ~12 words), questions to the viewer, reactions,
"Number one —" countdowns, and a direct CTA ("follow కొట్టండి, bell నొక్కండి!").
Numbers spoken as English words. Used later for reels.>

## Facts to verify
- [ ] <fact> — <source name, date>: <link>
- [ ] Derived: <arithmetic shown>
- [ ] <anything uncertain, marked UNVERIFIED>
```

Example of a finished brief: `content/2026-10-27-gross-net-share-baahubali2/brief.md`.
