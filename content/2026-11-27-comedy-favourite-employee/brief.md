---
post_slug: 2026-11-27-comedy-favourite-employee
pillar: office-comedy
format: reel
platforms: instagram,youtube
language: te+en
style: flat
slot: "2026-11-27 07:30 IST"
series: "Office Politics"
episode: 3
topic: "Office comedy (the owner's script, 'ఆఫీస్‌లో ఫేవరెట్ ఎవరు?', favouritism): in his cabin the manager gushes over his favourite, Suresh. Ramesh walks in to ask about his promotion and is told 'later' again, as last year, and to have patience. Outside, Ramesh asks Suresh if he got the promotion. Twist: no, he got another job, wedding planning for the manager's son. Punch: 'are you an employee or a family member?'"
text_hook: "Manager కి ఫేవరెట్ ఎవరు? 👀"
thumbnail_text: "PROMOTION కాదు… పెళ్లి పని! 😂"
ending_text: "ఆఫీస్‌లో టాలెంట్ కంటే ఫేవరెటిజం ఎక్కువ! 😂"
answer: "No riddle. The twist is Suresh's 'reward' (wedding planning for the manager's son); the punch is Ramesh's verbatim line, then the freeze, reaction and ending card."
status: idea
---

# Brief: Office Politics Ep 3, "ఆఫీస్‌లో ఫేవరెట్ ఎవరు?"

Fri 27 Nov 2026, 07:30 IST. **The owner's script**: every dialogue line and the ending text are verbatim (**verbatim** in the
timing table). I added only the production layer (act/say/sfx, visual_plan) and one short Gopi line (✍). Same office,
cast, looks, voices, FAAAH and sting as Ep 1–2 (`content/2026-11-23-comedy-manager-mind-game/`, `2d/office_cast.js`
unchanged; full SFX builds in `content/2026-11-21-comedy-operation-red-flower/brief.md`).

## Flags for the owner
- Suresh is the series Suresh (Ep 1–2: oiled side part, tight lavender shirt, always nodding), not the 15 Nov TL.
- Priya isn't in the owner's script, so she isn't in this episode (no line or appearance added).
- Only one FAAAH (the wedding-planning reveal). The punch gets the freeze + wedding toot + tuba + laugh, so two big hits don't collide.
- At ~47 s it's the shortest of the three; real takes usually run longer, so I didn't add lines.

## Cast (all Gemini)
| who | gender | age | temperament | dialect of lines | look | Gemini voice |
|---|---|---|---|---|---|---|
| `manager` | male | middle (~45) | smooth: the villain | standard spoken Telugu + office English | `makeManager` (MANAGER_OPT) | **Algieba** |
| `ramesh` | male | young (late 20s) | cool: the innocent-looking hero, the sarcastic punches | standard Telugu | `makeRamesh` (RAMESH_OPT) | **Sadachbia** |
| `suresh` | male | young (~30) | smooth: the "Yes sir" favourite, bobble nod (the series Suresh, NOT the 15 Nov TL) | standard | `makeSuresh` (SURESH_OFFICE_OPT) | **Achird** |
| `gopi` | male | young host | — | Tenglish | corner cut-out, last line only | **Puck** |

## Angle, hooks, CTA
- Belief before: "the favourite gets the promotion." After: "being the favourite only means unpaid personal work." Every
  25–34 office has a "Suresh", so the reel is easy to tag.
- Hooks: text hook ✔ **"Manager కి ఫేవరెట్ ఎవరు? 👀"** (alternatives: "Promotion ఎప్పుడు సార్? 😩", which is flatter;
  "Office లో Suresh ఎవరు?", which spoils the CTA). Verbal hook ✔ the owner's L1 praise over the pink "favourite" glow
  (alternatives: Ramesh's promotion ask first, which is out of order; a Gopi intro, which is slower).
- CTA ✔ "మీ office సురేష్ ని… comment లో tag చేయండి!" (alternatives: "మీ manager favourite ఎవరు? comment", which draws
  fewer tags; "office group కి share", which is weaker than a tag).
- Thumbnail (cover): "PROMOTION కాదు… పెళ్లి పని! 😂" over Suresh's checklist rolling down the aisle.

## Script shape and interaction beats
Hearts intro + text hook → L1–L2 favourite (harp, hearts, nod) → L3 Ramesh barges in (DHOOM on ప్రమోషన్) → L4–L6
brush-off, "last year too" calendar stamps, "patience" sermon → the door shuts on his face (silent follow tap) → L7–L9 water
cooler, drumroll → **L10 twist, FAAAH** → **L11 punch → freeze → reaction (Suresh's proud nod) → ending card** → L12 Gopi tag →
end card "Series: Office Politics · Ep 3".
**Punch (owner's rule):** record scratch + FREEZE → 0.3 s silence → ~1.5 s no-dialogue reaction shot with the funny sound + tuba sting + laugh → the ending-text card (owner's words, verbatim) held ~3 s. Never trim this block. Mid-reel follow = silent FOLLOW pop + tap (visual + sound, as Ep 2). No countdown, no ✅, no "answer at the end".

**FAAAH cues:** #1 L10, Suresh's "వెడ్డింగ్ ప్లానింగ్!" as the checklist rolls out (~31 s). That's the only one.

## SFX cue list (full per-line cues in `script.json` → `sfx`)
Levels as in Ep 1–2: `low` ≈ −24 dBFS bed under the voice; `mid` ≈ −14, under voice peaks; `high` ≈ −8, in a gap
between words; `max` = the scene's hit, music cut/ducked −15 dB, peak ~ −3 dBFS; `silence` = all sound out. Leave voice gaps
(0.3–0.6 s) for `high`/`max` hits. DHOOM, record scratch + freeze, STAMP, DONK, drumroll, rimshot, pops, crowd/laugh
(in-house layered Gemini crowd, never ripped audio) and the tuba comedy sting are the Ep 1–2 `mix.py` builds; FAAAH =
`tools/anim2d/sfx/faaah.wav`.
New synths only: heart pops, the hand-swat whoosh, the calendar flip, the scroll unroll, and a generic comic wedding-band toot + dhol (no real song).

| L | anchor (at) | cue | level | dur s |
|---|---|---|---|---|
| 1 | pre-roll (silent intro) (before) | harp-gliss | high | 0.6 |
| 1 | నమ్మకం (on) | heart-pops | mid | 0.5 |
| 1 | end of line (after) | nod-boings | low | 0.6 |
| 2 | సార్! (after) | sparkle | low | 0.3 |
| 3 | సార్… (before) | door-swing | mid | 0.4 |
| 3 | ప్రమోషన్ (on) | dhoom | **max** | 1.0 |
| 4 | లేదు (on) | swat-whoosh | low | 0.3 |
| 4 | చూద్దాం. (after) | sad-bloop | mid | 0.4 |
| 5 | గత సంవత్సరం (on) | calendar-flip | mid | 0.6 |
| 5 | అన్నారు. (after) | stamp | high | 0.6 |
| 6 | ఓపిక (on) | wise-chime | mid | 0.5 |
| 6 | end of line (after) | door-whoosh | high | 0.5 |
| 6 | end of line (after) | follow-pop | mid | 0.2 |
| 6 | end of line (after) | follow-tap | mid | 0.4 |
| 7 | whole line (under) | tension-tick | low | 2.4 |
| 8 | ఇంకో పని (under) | drumroll | low | 1.2 |
| 9 | అదేంట్రా? (after) | dun | mid | 0.4 |
| 10 | వెడ్డింగ్ ప్లానింగ్! (on) | scroll-unroll | mid | 0.6 |
| 10 | after the unroll (after) | **FAAAH** | **max** | 1.2 |
| 10 | after the FAAAH (after) | dhol | low | 1.0 |
| 11 | రా? (after) | freeze | **max** | 0.4 |
| 11 | freeze (after) | silence | silence | 0.3 |
| 11 | reaction shot (after) | funny-bg | high | 1.2 |
| 11 | reaction shot (after) | comedy-sting | high | 1.6 |
| 11 | reaction shot (after) | laugh-track | high | 1.6 |
| 11 | ending card (after) | card-slam | high | 0.4 |
| 12 | tag (on) | tag-swoosh | mid | 0.4 |
| 12 | end card (after) | end-sting | mid | 1.0 |

## Retention pass
- **0–3 s:** pink glow, hearts and the text hook; the villain is sweet for once, which is odd enough to stop a scroll.
- **7–17 s:** a DHOOM on "ప్రమోషన్", then calendar stamps "తర్వాత" on 2024/2025, a visual reveal inside the talkiest stretch.
- **20–28 s (most likely drop, the corridor):** the follow tap lands on the door slam; tension ticks + drumroll keep the open
  loop ("ఇంకో పని?") running to the reveal.
- **31–43 s:** FAAAH twist → punch → freeze → reaction → card. Never cut the pause.

## Timing estimate (**verbatim** = the owner's words, ✍ = ours; est. includes each line's own SFX room)
| L | who | text | start | est. s |
|---|---|---|---|---|
| — | (silent) | intro: text hook + cabin, hearts | 0.0 | 0.6 |
| 1 | manager | **verbatim** సురేష్! నువ్వు ఈ టీమ్‌కి చాలా ఇంపార్టెంట్ రా. నీ మీద నాకు చాలా నమ్మకం ఉంది. | 0.6 | 5.0 |
| 2 | suresh | **verbatim** థాంక్యూ సార్! | 5.9 | 1.4 |
| 3 | ramesh | **verbatim** సార్, నా ప్రమోషన్ గురించి మాట్లాడాలి. | 7.6 | 2.8 |
| 4 | manager | **verbatim** ఇప్పుడు టైమ్ లేదు రమేష్. తర్వాత చూద్దాం. | 10.7 | 2.8 |
| 5 | ramesh | **verbatim** సార్, గత సంవత్సరం కూడా తర్వాత అన్నారు. | 13.8 | 3.2 |
| 6 | manager | **verbatim** నీకు ఓపిక ఉండాలి రమేష్! | 17.3 | 3.4 |
| 7 | ramesh | **verbatim** ఏంట్రా సురేష్! నీకు ప్రమోషన్ వచ్చిందా? | 21.0 | 2.8 |
| 8 | suresh | **verbatim** లేదురా... నాకు ఇంకో పని ఇచ్చాడు. | 24.1 | 2.6 |
| 9 | ramesh | **verbatim** అదేంట్రా? | 27.0 | 1.0 |
| 10 | suresh | **verbatim** మేనేజర్ కొడుకు పెళ్లికి వెడ్డింగ్ ప్లానింగ్! | 28.3 | 4.4 |
| 11 | ramesh | **verbatim** ఒరేయ్! నువ్వు ఎంప్లాయ్‌వా? లేక ఫ్యామిలీ మెంబర్‌వా రా? | 33.0 | 6.2 |
| — | (card) | ENDING CARD **verbatim**: ఆఫీస్‌లో టాలెంట్ కంటే ఫేవరెటిజం ఎక్కువ! 😂 | 39.5 | 3.0 |
| 12 | gopi | ✍ మీ office సురేష్ ని… comment లో tag చేయండి! | 42.5 | 3.4 |
| — | (card) | end card 'Series: Office Politics' + handles | 46.2 | 1.0 |

**≈ 47.2 s** (target 45–60 s, aiming ~50). If the render runs over 58 s, trim L6's door whoosh to 0.3 s and the card hold to 2.6 s.

## Hashtags
- Instagram (fixed, owner 23 Nov): `#fyp #explorepage #reels #insta #telugu`.
- YouTube (15): `#shorts #officecomedy #telugucomedy #corporatelife #officepolitics #managervsemployee #telugu #telugushorts #comedy #funny #officelife #favouritism #promotion #corporatecomedy #reelrasam`.

## Facts to verify
- None. **A fictional comedy**: our own characters; no company, brand, real person or statistic. No film footage,
  music or famous dialogue. Animation, voices and sound effects are AI-generated (labelled).

## Telugu flags for the owner
- Owner lines are kept verbatim. Please check only our Gopi line: "మీ office సురేష్ ని… comment లో tag చేయండి!"
- Audio tags: manager [warmly] [proudly] [dismissively] [sighs] [smugly]; Ramesh [hopefully] [deadpan] [sarcastically]
  [curious] [whispers] [shocked] [dramatic pause]; Suresh [excited] [sighs] [proudly]; Gopi [laughs] [mischievously]. Max 3 per line.
