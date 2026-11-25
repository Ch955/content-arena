---
post_slug: 2026-11-28-comedy-credit-stealing
pillar: office-comedy
format: reel
platforms: instagram,youtube
language: te+en
style: flat
slot: "2026-11-28 07:30 IST"
series: "Office Politics"
episode: 4
topic: "Office comedy (the owner's script, 'మీటింగ్‌లో మేనేజర్ మాయ!', credit stealing): at the team meeting the manager credits 'the whole team'. Ramesh says he wrote all the code and attended the client calls; the manager calls that teamwork, and the vision was his. On a speakerphone call to his boss he says 'I delivered the project'. Ramesh, standing beside him, asks who gets the increment. Punch: 'కంపెనీకి వస్తుంది రమేష్!', and Ramesh laugh-cries."
text_hook: "Project నాది… Credit ఎవరిది? 🤨"
thumbnail_text: "CREDIT కొట్టేసిన MANAGER 😂"
ending_text: "పని మనది... పేరు మేనేజర్‌ది... లాభం కంపెనీది!"
answer: "No riddle. The punch is the manager's verbatim 'కంపెనీకి వస్తుంది రమేష్!', then the freeze, Ramesh's laugh-cry reaction and the three-part ending card."
status: idea
---

# Brief: Office Politics Ep 4, "మీటింగ్‌లో మేనేజర్ మాయ!"

Sat 28 Nov 2026, 07:30 IST. **The owner's script**: every dialogue line and the ending text are verbatim (**verbatim** in the
timing table). I added only the production layer (act/say/sfx, visual_plan) and one short Gopi line (✍). Same office,
cast, looks, voices, FAAAH and sting as Ep 1–2 (`content/2026-11-23-comedy-manager-mind-game/`, `2d/office_cast.js`
unchanged; full SFX builds in `content/2026-11-21-comedy-operation-red-flower/brief.md`).

## Flags for the owner
- **New one-off: the BOSS** is voice only (speakerphone, Gemini **Orus**, phone EQ) and never drawn.
- Ramesh's **😭😂 is a reaction, not a line**: it's in `script.json` as the `funny-bg` note on L11 (a non-verbal Sadachbia
  laugh-cry take, ~1.2 s, under the sad trombone), so the voice engine never reads an emoji.
- Suresh and the colleagues appear silently in the meeting (Suresh claps hardest). No new lines.
- One FAAAH, on "I delivered the project successfully!" (the theft, with Ramesh beside him). The punch keeps the freeze + sad
  trombone + laugh-cry.

## Cast (all Gemini)
| who | gender | age | temperament | dialect of lines | look | Gemini voice |
|---|---|---|---|---|---|---|
| `manager` | male | middle (~45) | smooth: the villain | standard spoken Telugu + office English | `makeManager` (MANAGER_OPT) | **Algieba** |
| `ramesh` | male | young (late 20s) | cool: the innocent-looking hero, the sarcastic punches | standard Telugu | `makeRamesh` (RAMESH_OPT) | **Sadachbia** |
| `suresh` | male | young (~30) | silent here: claps and nods hardest | — | `makeSuresh` (SURESH_OFFICE_OPT) | — |
| `boss` | male | middle (~55) | cool: brisk, booming, pleased | English only | **voice only, never drawn** (caller card 'BOSS 📞' + grey silhouette); telephone EQ | **Orus** (firm; no series character uses it, distinct from Algieba/Sadachbia/Achird/Puck) |
| `gopi` | male | young host | — | Tenglish | corner cut-out, last line only | **Puck** |

## Angle, hooks, CTA
- Belief before: "if I speak up, I'll get the credit." After: "even when you speak up, the credit goes up and the money goes to
  the company." It hits every 25–34 who's watched a boss present their work.
- Hooks: text hook ✔ **"Project నాది… Credit ఎవరిది? 🤨"** (alternatives: "Credit దొంగ Manager 😤", which is too
  aggressive; "Increment ఎవరికి? 😭", which spoils the punch). Verbal hook ✔ the owner's "గైస్!" on a DHOOM (alternatives:
  starting on the boss call, which is out of order; a Gopi intro, which is slower).
- CTA ✔ "మీ credit ఎవరు కొట్టేశారు? Comment లో చెప్పండి!" (alternatives: tag a teammate, which is weaker here;
  "follow for Ep 5", which is a softer ask).
- Thumbnail (cover): "CREDIT కొట్టేసిన MANAGER 😂" over the manager on the phone and Ramesh's jaw drop.

## Script shape and interaction beats
Villain walk + text hook → L1 speech (DHOOM) → L2–L5 Ramesh's two claims vs "teamwork" / "vision నాది" (name chip
sucked into TEAM, lightbulb, ooooh) → whoosh to the cabin (silent follow tap) → **L6 "I delivered…", FAAAH** → L7 boss on
speaker (KA-CHING) → L8–L10 the "small doubt", finger count → **L11 punch → freeze → Ramesh's 😭😂 reaction → 3-beat
ending card** → L12 Gopi comment → end card "Series: Office Politics · Ep 4".
**Punch (owner's rule):** record scratch + FREEZE → 0.3 s silence → ~1.5 s no-dialogue reaction shot with the funny sound + tuba sting + laugh → the ending-text card (owner's words, verbatim) held ~3 s. Never trim this block. Mid-reel follow = silent FOLLOW pop + tap (visual + sound, as Ep 2). No countdown, no ✅, no "answer at the end".

**FAAAH cues:** #1 L6, right after "successfully!" with Ramesh's jaw drop (~26 s). That's the only one.

## SFX cue list (full per-line cues in `script.json` → `sfx`)
Levels as in Ep 1–2: `low` ≈ −24 dBFS bed under the voice; `mid` ≈ −14, under voice peaks; `high` ≈ −8, in a gap
between words; `max` = the scene's hit, music cut/ducked −15 dB, peak ~ −3 dBFS; `silence` = all sound out. Leave voice gaps
(0.3–0.6 s) for `high`/`max` hits. DHOOM, record scratch + freeze, STAMP, DONK, drumroll, rimshot, pops, crowd/laugh
(in-house layered Gemini crowd, never ripped audio) and the tuba comedy sting are the Ep 1–2 `mix.py` builds; FAAAH =
`tools/anim2d/sfx/faaah.wav`.
New synths only: limp claps, the vacuum SHLOOP, three phone rings, speed-dial beeps, the cash-register KA-CHING, a ding per finger count, a sad trombone, and the phone band-pass on the boss.

| L | anchor (at) | cue | level | dur s |
|---|---|---|---|---|
| 1 | pre-roll (silent intro) (before) | villain-entry | high | 0.6 |
| 1 | గైస్! (on) | dhoom | **max** | 1.0 |
| 1 | end of line (after) | clap | mid | 0.5 |
| 2 | కోడ్ (under) | keyboard | low | 1.0 |
| 3 | టీమ్‌వర్క్ (on) | shloop | mid | 0.5 |
| 4 | క్లయింట్ కాల్స్ (under) | phone-rings | low | 1.0 |
| 5 | విజన్ నాది! (on) | heroic-brass | mid | 1.0 |
| 5 | end of line (after) | crowd-ooooh | high | 0.6 |
| 5 | after the ooooh (after) | phone-dial | low | 0.6 |
| 5 | after the ooooh (after) | follow-pop | mid | 0.2 |
| 5 | after the ooooh (after) | follow-tap | mid | 0.4 |
| 6 | successfully! (after) | **FAAAH** | **max** | 1.2 |
| 7 | whole line (under) | phone-eq | low | 1.8 |
| 7 | Well done! (after) | ka-ching | mid | 0.5 |
| 8 | డౌట్. (after) | bloop | low | 0.2 |
| 10 | చేశాను… / తీసుకున్నారు… (on) | count-dings | mid | 0.6 |
| 10 | మరి ఇన్క్రిమెంట్… ఎవరికొస్తుంది సార్? (under) | drumroll | low | 1.4 |
| 11 | రమేష్! (after) | freeze | **max** | 0.4 |
| 11 | freeze (after) | silence | silence | 0.3 |
| 11 | reaction shot (after) | funny-bg | high | 1.2 |
| 11 | reaction shot (after) | comedy-sting | high | 1.6 |
| 11 | reaction shot (after) | laugh-track | high | 1.6 |
| 11 | ending card (after) | card-slam | high | 1.2 |
| 12 | Comment (on) | bubble-pops | mid | 0.5 |
| 12 | end card (after) | end-sting | mid | 1.0 |

## Retention pass
- **0–3 s:** villain walk, the text hook and a DHOOM on "గైస్!".
- **6–20 s (most likely drop, two similar claims):** each claim gets its own visual payoff (code flashback → name sucked into
  TEAM; phone flashback → "VISION 💡" + ooooh), so it never reads as two identical beats.
- **21–28 s:** a location switch + follow tap → FAAAH → the boss's voice (a new sound and a new character).
- **32–48 s:** the finger count builds a 1-2-3 loop the viewer completes → punch → freeze → laugh-cry → 3-stamp card.

## Timing estimate (**verbatim** = the owner's words, ✍ = ours; est. includes each line's own SFX room)
| L | who | text | start | est. s |
|---|---|---|---|---|
| — | (silent) | intro: text hook + villain walk | 0.0 | 0.6 |
| 1 | manager | **verbatim** గైస్! ఈ ప్రాజెక్ట్ సక్సెస్ అవ్వడానికి మన టీమ్ అందరి కృషి ఉంది. | 0.6 | 5.0 |
| 2 | ramesh | **verbatim** సార్, ముఖ్యంగా ఆ కోడ్ మొత్తం నేనే రాశాను సార్. | 5.9 | 3.6 |
| 3 | manager | **verbatim** అవును రమేష్... టీమ్‌వర్క్ అంటే అదే! | 9.8 | 2.8 |
| 4 | ramesh | **verbatim** సార్, క్లయింట్ కాల్స్ కూడా నేనే అటెండ్ అయ్యాను. | 12.9 | 3.4 |
| 5 | manager | **verbatim** చాలా మంచి విషయం. కానీ ప్రాజెక్ట్ విజన్ నాది! | 16.6 | 4.2 |
| 6 | manager | **verbatim** సార్! Finally, I delivered the project successfully! | 21.1 | 4.8 |
| 7 | boss | **verbatim** Excellent! Well done! | 26.2 | 1.8 |
| 8 | ramesh | **verbatim** సార్, ఒక్క చిన్న డౌట్. | 28.3 | 2.0 |
| 9 | manager | **verbatim** ఏంటి రమేష్? | 30.6 | 1.2 |
| 10 | ramesh | **verbatim** ప్రాజెక్ట్ నేను చేశాను... క్రెడిట్ మీరు తీసుకున్నారు... మరి ఇన్క్రిమెంట్ ఎవరికొస్తుంది సార్? | 32.1 | 5.6 |
| 11 | manager | **verbatim** కంపెనీకి వస్తుంది రమేష్! | 38.0 | 6.4 |
| — | (card) | ENDING CARD **verbatim**: పని మనది... పేరు మేనేజర్‌ది... లాభం కంపెనీది! | 44.7 | 3.2 |
| 12 | gopi | ✍ మీ credit ఎవరు కొట్టేశారు? Comment లో చెప్పండి! | 47.9 | 3.2 |
| — | (card) | end card 'Series: Office Politics' + handles | 51.4 | 1.0 |

**≈ 52.4 s** (target 45–60 s, aiming ~50). If the render runs over 58 s, trim the L5 ooooh/dial overlap and hold the ending card 2.8 s.

## Hashtags
- Instagram (fixed, owner 23 Nov): `#fyp #explorepage #reels #insta #telugu`.
- YouTube (15): `#shorts #officecomedy #telugucomedy #corporatelife #officepolitics #managervsemployee #telugu #telugushorts #comedy #funny #officelife #creditstealing #increment #corporatecomedy #reelrasam`.

## Facts to verify
- None. **A fictional comedy**: our own characters; no company, brand, real person or statistic. No film footage,
  music or famous dialogue. Animation, voices and sound effects are AI-generated (labelled).

## Telugu flags for the owner
- Owner lines are kept verbatim (including the spelling "ఇన్క్రిమెంట్"). Please check only our Gopi line: "మీ credit ఎవరు కొట్టేశారు? Comment లో చెప్పండి!"
- Audio tags: manager [proudly] [warmly] [smugly] [chuckles] [calmly] [dramatic pause] [excited] [annoyed]; Ramesh
  [politely] [proudly] [deadpan] [frustrated] [innocently] [dramatic pause]; boss [impressed] [warmly]; Gopi [laughs] [whispers].
