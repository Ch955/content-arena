---
post_slug: 2026-11-29-comedy-monday-fear
pillar: office-comedy
format: reel
platforms: instagram,youtube
language: te+en
style: flat
slot: "2026-11-29 07:30 IST"
series: "Office Politics"
episode: 5
topic: "Office comedy (the owner's script, 'సోమవారం భయం!', weekend work): Sunday 9 PM, Ramesh is blissful on the couch when the manager's message lands: 'Hi Team, Just a small task. Please complete before Monday 9 AM.' Monday morning the manager praises his dedication; Ramesh asks to leave early because he worked Sunday; the manager plays 'we're family'. Ramesh asks for a family-function-style raise; the manager freezes (😳). Punch: 'family until salary, then company'."
text_hook: "Sunday 9 PM… Manager message 😱"
thumbnail_text: "SUNDAY 9 PM TASK 😱"
ending_text: "ఉద్యోగికి వీకెండ్ ఉండదు... మేనేజర్‌కి మాత్రం ఎంప్లాయ్ ఎప్పుడూ ఆన్‌లైన్‌లో ఉండాలి! 😂"
answer: "No riddle. The punch is Ramesh's verbatim 'ఫ్యామిలీ అంటారు... కానీ జీతం దగ్గరికి వచ్చేసరికి కంపెనీ అంటారు!', then the freeze, the manager's drooping-moustache reaction and the ending card."
status: idea
---

# Brief: Office Politics Ep 5, "సోమవారం భయం!"

Sun 29 Nov 2026, 07:30 IST. **The owner's script**: every dialogue line and the ending text are verbatim (**verbatim** in the
timing table). I added only the production layer (act/say/sfx, visual_plan) and one short Gopi line (✍). Same office,
cast, looks, voices, FAAAH and sting as Ep 1–2 (`content/2026-11-23-comedy-manager-mind-game/`, `2d/office_cast.js`
unchanged; full SFX builds in `content/2026-11-21-comedy-operation-red-flower/brief.md`).

## Flags for the owner
- **Opening vs the 16 Nov insight** (late-night phone-notification openings held ~4–5 s): kept, because it's your script. To
  soften it, frame 1 is a funny visual hook (Ramesh blissful, popcorn on his belly, "SUNDAY 😌"), then PING + DHOOM + FAAAH
  inside 5 s. The message is the manager's (a conflict with a deadline), not a mystery notification.
- The message text is on screen only (`opening_message` in `script.json`), held ~2 s so it can be read.
- The manager's **😳 is a reaction, not a line**: DHAN-DHAN-DHAN crash-zooms + FAAAH #2 on L9 (no voice).
- New set: Ramesh's flat, and his home look (grey T-shirt + checked shorts, same face/hair; a colour override only).
- `say` speaks the "9" in L1 as "తొమ్మిది" so the TTS doesn't say "nine". The text is unchanged.

## Cast (all Gemini)
| who | gender | age | temperament | dialect of lines | look | Gemini voice |
|---|---|---|---|---|---|---|
| `manager` | male | middle (~45) | smooth: the villain | standard spoken Telugu + office English | `makeManager` (MANAGER_OPT) | **Algieba** |
| `ramesh` | male | young (late 20s) | cool: the innocent-looking hero, the sarcastic punches | standard Telugu | `makeRamesh` (RAMESH_OPT) | **Sadachbia** |
| `gopi` | male | young host | — | Tenglish | corner cut-out, last line only | **Puck** |

## Angle, hooks, CTA
- Belief before: "Sunday is mine." After: "to a manager you're always online, and family only until salary time."
  Universal for 25–34 IT employees, and it posts on a Sunday morning, the day itself.
- Hooks: text hook ✔ **"Sunday 9 PM… Manager message 😱"** (alternatives: "చిన్న task అంట 🙃", which is subtler;
  "Weekend ఎక్కడ? 😩", which is generic). Verbal hook ✔ the owner's L1 disbelief after the message (alternatives: open
  on Monday, which loses the hook; a Gopi intro, which is slower).
- CTA ✔ "Sunday కూడా పని చేసే friend ని… tag చేయండి!" (alternatives: "మీ weekend ఎవరు చెడగొట్టారు? comment", which draws
  fewer tags; share to the office group).
- Thumbnail (cover): "SUNDAY 9 PM TASK 😱" over popcorn mid-air and Ramesh's horrified face lit by the phone.

## Script shape and interaction beats
Couch bliss + text hook → PING + DHOOM, the message on screen → **L1 disbelief, FAAAH #1** → time-lapse 9 PM → 3 AM (silent
follow tap) → "MONDAY 9:00 AM" → L2–L4 the villain chair-spin, zombie Ramesh, a "DEDICATED ⭐" sticker → L5–L7 the ask,
the needle-stop "ఎందుకు?", the plea → L8 the fake-family violin → **L9 the turn → the manager's 😳, FAAAH #2** → **L10
punch → freeze → reaction (the moustache droops, coffee drips) → ending card** → L11 Gopi tag → end card "Series: Office Politics · Ep 5".
**Punch (owner's rule):** record scratch + FREEZE → 0.3 s silence → ~1.5 s no-dialogue reaction shot with the funny sound + tuba sting + laugh → the ending-text card (owner's words, verbatim) held ~3 s. Never trim this block. Mid-reel follow = silent FOLLOW pop + tap (visual + sound, as Ep 2). No countdown, no ✅, no "answer at the end".

**FAAAH cues:** #1 L1, "ఏంట్రా ఇది!" as the popcorn explodes (~9 s); #2 L9, the manager's 😳 after the triple crash-zoom (~36 s).

## SFX cue list (full per-line cues in `script.json` → `sfx`)
Levels as in Ep 1–2: `low` ≈ −24 dBFS bed under the voice; `mid` ≈ −14, under voice peaks; `high` ≈ −8, in a gap
between words; `max` = the scene's hit, music cut/ducked −15 dB, peak ~ −3 dBFS; `silence` = all sound out. Leave voice gaps
(0.3–0.6 s) for `high`/`max` hits. DHOOM, record scratch + freeze, STAMP, DONK, drumroll, rimshot, pops, crowd/laugh
(in-house layered Gemini crowd, never ripped audio) and the tuba comedy sting are the Ep 1–2 `mix.py` builds; FAAAH =
`tools/anim2d/sfx/faaah.wav`.
New synths only: a lazy lo-fi bed + a happy sigh, a phone PING, typing clicks, the time-lapse whirr, a fly buzz, the sticker slap, a TV-serial violin swell (generic), and a slide-whistle down + coffee drips.

| L | anchor (at) | cue | level | dur s |
|---|---|---|---|---|
| 1 | pre-roll (silent intro) (before) | bliss-bed | low | 1.0 |
| 1 | pre-roll (message) (before) | ping-dhoom | **max** | 1.0 |
| 1 | pre-roll (message) (before) | typing | low | 0.8 |
| 1 | ఇది! (after) | **FAAAH** | **max** | 1.2 |
| 1 | after the FAAAH (after) | clock-whirr | mid | 1.2 |
| 1 | after the FAAAH (after) | follow-pop | mid | 0.2 |
| 1 | after the FAAAH (after) | follow-tap | mid | 0.4 |
| 2 | గుడ్ మార్నింగ్ (before) | chair-spin | high | 0.6 |
| 3 | whole line (under) | fly-buzz | low | 1.0 |
| 4 | డెడికేటెడ్ (on) | sticker-slap | mid | 0.4 |
| 5 | వెళ్లొచ్చా? (after) | bloop | low | 0.2 |
| 6 | ఎందుకు? (on) | needle-stop | high | 0.3 |
| 8 | whole line (under) | serial-violin | mid | 2.6 |
| 9 | సార్! (after) | needle-stop | high | 0.3 |
| 9 | after the needle-stop (after) | dhan-dhan | **max** | 0.9 |
| 9 | after the zooms (after) | **FAAAH** | **max** | 1.2 |
| 10 | అంటారు! (after) | freeze | **max** | 0.4 |
| 10 | freeze (after) | silence | silence | 0.3 |
| 10 | reaction shot (after) | funny-bg | high | 1.2 |
| 10 | reaction shot (after) | comedy-sting | high | 1.6 |
| 10 | reaction shot (after) | laugh-track | high | 1.6 |
| 10 | ending card (after) | card-slam | high | 0.4 |
| 11 | tag (on) | tag-swoosh | mid | 0.4 |
| 11 | end card (after) | end-sting | mid | 1.0 |

## Retention pass
- **0–5 s:** a blissful visual → PING/DHOOM → readable message → FAAAH. The contrast is the hook.
- **10–24 s (most likely drop, routine office talk):** villain chair-spin, zombie fly, sticker slap, needle-stop, a sound or
  sight gag on every line.
- **27–37 s:** the violin "family" set-up is cut by a needle-stop and the 😳 FAAAH, a real reversal, not random.
- **37–51 s:** punch → freeze → reaction → the long ending card (two lines, ~3.4 s).

## Timing estimate (**verbatim** = the owner's words, ✍ = ours; est. includes each line's own SFX room)
| L | who | text | start | est. s |
|---|---|---|---|---|
| — | (silent) | intro: Ramesh blissful on the couch + text hook | 0.0 | 1.0 |
| — | (on screen) | PING + DHOOM, the manager's message types in and holds | 1.0 | 2.6 |
| 1 | ramesh | **verbatim** ఆదివారం రాత్రి 9 గంటలకి చిన్న టాస్కా? ఏంట్రా ఇది! | 3.6 | 6.2 |
| 2 | manager | **verbatim** గుడ్ మార్నింగ్ రమేష్! టాస్క్ కంప్లీట్ చేశావా? | 10.1 | 3.4 |
| 3 | ramesh | **verbatim** చేశాను సార్. | 13.8 | 1.6 |
| 4 | manager | **verbatim** వెరీ గుడ్! నువ్వు చాలా డెడికేటెడ్ ఎంప్లాయ్‌వి. | 15.7 | 3.2 |
| 5 | ramesh | **verbatim** థాంక్యూ సార్. మరి ఈరోజు కొంచెం త్వరగా వెళ్లొచ్చా? | 19.2 | 3.4 |
| 6 | manager | **verbatim** ఎందుకు? | 22.9 | 1.2 |
| 7 | ramesh | **verbatim** నిన్న ఆదివారం కూడా పని చేశాను కదా సార్! | 24.4 | 3.0 |
| 8 | manager | **verbatim** రమేష్... మనం ఫ్యామిలీ లాంటివాళ్లం కదా! | 27.7 | 3.0 |
| 9 | ramesh | **verbatim** అయితే సార్... ఫ్యామిలీ ఫంక్షన్‌కి వెళ్లినట్టు జీతం కూడా పెంచండి సార్! | 31.0 | 6.2 |
| 10 | ramesh | **verbatim** ఫ్యామిలీ అంటారు... కానీ జీతం దగ్గరికి వచ్చేసరికి కంపెనీ అంటారు! | 37.5 | 6.6 |
| — | (card) | ENDING CARD **verbatim**: ఉద్యోగికి వీకెండ్ ఉండదు... మేనేజర్‌కి మాత్రం ఎంప్లాయ్ ఎప్పుడూ ఆన్‌లైన్‌లో ఉండాలి! 😂 | 44.4 | 3.4 |
| 11 | gopi | ✍ Sunday కూడా పని చేసే friend ని… tag చేయండి! | 47.8 | 3.2 |
| — | (card) | end card 'Series: Office Politics' + handles | 51.3 | 1.0 |

**≈ 52.3 s** (target 45–60 s, aiming ~50). If the render runs over 58 s, cut the time-lapse to 0.8 s and the opening message hold to 1.8 s.

## Hashtags
- Instagram (fixed, owner 23 Nov): `#fyp #explorepage #reels #insta #telugu`.
- YouTube (15): `#shorts #officecomedy #telugucomedy #corporatelife #officepolitics #managervsemployee #telugu #telugushorts #comedy #funny #officelife #mondayblues #weekendwork #corporatecomedy #reelrasam`.

## Facts to verify
- None. **A fictional comedy**: our own characters; no company, brand, real person or statistic. No film footage,
  music or famous dialogue. Animation, voices and sound effects are AI-generated (labelled).

## Telugu flags for the owner
- Owner lines are kept verbatim. One reading doubt: "ఫ్యామిలీ ఫంక్షన్‌కి వెళ్లినట్టు జీతం కూడా పెంచండి" is acted as "treat it like
  a family function (where you give gifts), so raise my salary too". Tell us if you meant it differently and we'll adjust only the delivery.
- Please check our Gopi line: "Sunday కూడా పని చేసే friend ని… tag చేయండి!"
- Audio tags: manager [cheerfully] [smugly] [proudly] [warmly] [suspiciously] [softly]; Ramesh [shocked] [frustrated]
  [exhausted] [hopefully] [innocently] [pleading] [mischievously] [excited] [deadpan] [dramatic pause] [sarcastically]; Gopi [laughs] [mischievously].
