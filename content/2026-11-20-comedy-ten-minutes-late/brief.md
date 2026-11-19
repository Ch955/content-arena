---
post_slug: 2026-11-20-comedy-ten-minutes-late
pillar: office-comedy
format: reel
platforms: instagram,youtube
language: te+en
style: flat
slot: "2026-11-20 07:30 IST"
topic: "Office comedy (the owner's own script, 'పది నిమిషాల లేట్!'): Ramesh walks in at 10:10 AM, ten minutes late. His manager says they'll 'settle it at rating time', and on appraisal day Ramesh, who deserved the top rating, gets a secondary one. In the cabin the manager admits the work was fine, it was the ten minutes. Ramesh explodes ('నీ దుంప తెగ!'), promises to come an hour early from tomorrow, the manager is delighted, and Ramesh asks: 'then will you double my salary?'"
text_hook: "10:10 AM ⏰"
answer: "No riddle or dilemma. The payoff is the owner's punch: 'మరి నా శాలరీ డబుల్ చేస్తావా నువ్వు?', followed by the on-screen line 'ఆఫీస్‌లో టైమ్‌కి విలువ ఉంటుంది... కానీ ఉద్యోగి టైమ్‌కి విలువ ఉండదు! 😂'"
status: idea
---

# Brief: Office comedy, "పది నిమిషాల లేట్!"

Fri 20 Nov 2026, 07:30 IST. This replaces the planned twist-story (the `plan` rotation still shows twist-story/clay for
Fri; the owner chose this reel and the **flat** style). **This is the owner's own script.** I kept every line and joke
as written and only built the production layer around it: casting, `say` tags and `act` directions, SFX cues, visual
plan, the light interaction beats, the caption and youtube.md. 14 voiced lines in `script.json` (10 story lines from the
owner, 1 Gopi narration line for Scene 2, 3 short Gopi interaction lines), about 93 words, plus one silent on-screen
punch card.

## The only wording change (owner, please confirm)
- **Manager, Scene 1, line 3.** The script says "సరే, సరే... ఈ రెండు వీళ్లు చూసుకుందాం." It looks like a speech-to-text
  slip, so I used **"సరే, సరే... rating టైమ్ లో చూసుకుందాం."** ("fine, fine… we'll see at rating time"), which sets
  up Scene 2. If you meant something else, tell us and the Editor will retake only this line. For a spelling that
  matches the rest of your script, it could also be written "రేటింగ్ టైమ్‌లో చూసుకుందాం" (it sounds the same).

Other small production-only notes (no change in meaning):
- Scene 1's stage line "ఉదయం 10:10 గంటలకు రమేష్ ఆఫీస్‌కి వచ్చాడు." isn't voiced. It is shown instead: the clock hits
  10:10 under the "10:10 AM ⏰" text hook while Ramesh sneaks in. That saves ~3 s and keeps the manager's bark as the
  first voice.
- Scene 2's narration goes to Gopi as one short line: "Appraisal రోజు… top rating రావాల్సిన రమేష్ కి… secondary
  rating!", with a big "RATING: TOP → SECONDARY" stamp.
- The 😂 after Ramesh's last line is a sticker on screen, not part of the subtitle (subtitle fonts may not draw emoji).
- The `text` fields keep your "..." exactly. Only the `say` fields use "…" pauses and English audio tags for the voice.

## Cast (for the Editor: drawing + `PROFILE` via `elevenvoice.profile_for`)
| who | gender | age | temperament | dialect of lines | look / voice |
|---|---|---|---|---|---|
| `ramesh` | male | young (late 20s, office employee who rides a bike to work) | cheeky/smooth in Scene 1, **aggressive** (angry) in Scene 3, so cast as aggressive | the owner's lines as written (mostly neutral spoken Telugu: వచ్చావు, ఇచ్చారు, వస్తా, చేస్తావా); the Telangana colour comes from the voice | NEW drawing: light-blue shirt, slightly untucked; messy uneven hair; black backpack; dark-grey half-face bike helmet (in his hand in Scene 1, on his desk in the background in Scene 3); lanyard "RAMESH". `profile_for("male","young","aggressive")` → **telangana-male-young (Kaka)**, one voice for both moods: v3 `stability` 0.0 (Creative) so it can swing from cheeky to furious. Gemini: **Sadachbia** (lively), alt. Fenrir (but Fenrir was Kiran's voice yesterday) |
| `manager` | male | middle (~45, Ramesh's manager; no name, Ramesh calls him సార్) | **smooth**: smug, sarcastic, unbothered | the owner's lines as written (standard: ఏంట్రా, వచ్చావు, చేయమంటావ్) | NEW drawing: white shirt neatly tucked in, maroon tie, thick black moustache, slightly bald (receding top, grey temples), small paunch, a plain white coffee mug (no text, no logo) in every shot. `profile_for("male","middle","smooth")` → **andhra-male-middle (Sai Datta, warm-toned)**, `stability` 0.5. Gemini: **Algieba** (smooth), alt. Algenib (gravelly; was Suresh on 15 Nov) |
| `gopi` | male | young (host/narrator) | — | Tenglish | 4 short lines (Scene 2 narration, follow, comment, tag); corner cut-out only. ElevenLabs Liam / Gemini **Puck** |

Silent (drawn, no lines): 3 generic colleagues who pop up over the cubicles (the "ooooh", the gasp, the cheer). Not
Nikhil, Ananya, Kiran, Hema or any other existing character; this is a stand-alone office comedy in a generic office
(not Tower B). No Pinky.

### Voices (one voice per character per reel)
- **ElevenLabs paid plan:** Ramesh = telangana-male-young (Kaka), Manager = andhra-male-middle (Sai Datta warm), Gopi =
  Liam. **Free plan warning:** library voices fall back to built-ins, so Ramesh would get Liam = Gopi's voice. In that
  case voice Ramesh on Gemini (Sadachbia) or pitch him (as What-if #1 did for Nikhil); never let Ramesh and Gopi share
  a voice.
- **Gemini (if ElevenLabs is out of credits):** Gopi=Puck, Ramesh=Sadachbia, Manager=Algieba. Add `ramesh` and
  `manager` to `scenevoice.NAMES`/`PERSONA` in the reel's own `voices.py`: Ramesh "a cheeky Telugu office employee in
  his late 20s from Hyderabad, quick-witted, who flips from playful to furious"; Manager "a smug, sarcastic Telugu
  office manager of about 45, slow and very pleased with himself".
- Gemini voices don't carry a Telangana accent. If the reel ends up all-Gemini, that's acceptable for a comedy, but tell
  the owner.

## Angle
- Belief before: "Being ten minutes late is a small thing; good work speaks for itself." After (the laugh): "In some
  offices ten minutes cost you a rating, but nobody pays for your extra hour." Why they stop: a wall clock hitting 10:10,
  a boss barking "ఏంట్రా లేటుగా వచ్చావు?" with a DHOOM. Every 25–34 office-goer has lived that walk to the desk.
- The owner's angle is the reel. Alternatives I considered only for the on-screen framing: (2) "the appraisal-day
  revenge" (leading with the stamp) and (3) "the double-salary comeback" (leading with the punch, which would spoil it).
  Kept (1): open on the late entry, in story order.

## Hooks
| | Text hook (≤ 6 words, first 1–2 s) | Verbal hook |
|---|---|---|
| 1 ✔ | **10:10 AM ⏰** (the owner's choice) | **(Manager) "ఒరేయ్ రమేష్! ఏంట్రా లేటుగా వచ్చావు?"** (the owner's first line, on a DHOOM) |
| 2 | 10 నిమిషాలు లేట్… rating కట్! | (would need a narrator line before the manager; slower) |
| 3 | Manager vs Employee 😂 | (same; generic) |

## Script shape and interaction beats (light, comedy)
HOOK, open on the action (silent intro: clock → 10:10 TING, Ramesh tiptoes in; L1 manager bark + DHOOM) → setup (L2 the
excuse, L3 the threat "rating టైమ్ లో చూసుకుందాం") → Scene 2 (L4 Gopi + STAMP + sad trombone) → follow (L5, an open loop:
"అసలు గొడవ ఇప్పుడే!") → Scene 3 (L6–L11 the confrontation, escalating: polite → the reason → "నీ దుంప తెగ!" freeze →
the fake-heroic promise → the manager's delight → 0.4 s silence) → PUNCH (L12 double salary + DONK + laugh + HOORAY) →
silent punch card → comment (L13) → tag (L14) → end card.

Beats used (as the manager asked): a tiny on-screen hook "10:10 AM ⏰" from frame 1; a follow tap after Scene 2 (L5);
at the end the comment prompt "మీ manager ఇలా చేశాడా? 😂 Comment చేయండి!" (L13) and the tag prompt "మీ manager ని tag
చేయండి!" (L14); then the end card (it carries follow/subscribe). **No countdown, no "answer at the end", no ✅ beat**:
it isn't a riddle. No loop line; a sound callback instead (the clock's tick-tick-TING under the end card).

**Ending punch, silent on purpose:** the card "ఆఫీస్‌లో టైమ్‌కి విలువ ఉంటుంది... కానీ ఉద్యోగి టైమ్‌కి విలువ ఉండదు!
😂" types in under the laugh-track tail with a rimshot on the second half. Gopi reading it would step on the laugh and
turn the joke into a moral; the text plus the laugh is funnier and shorter. If the owner wants it voiced, add a Gopi line
(deadpan "[dramatic pause]… [laughs]") and cut L5's "అసలు గొడవ ఇప్పుడే!" to stay near 45 s.

## SFX cue list (THE KEY ASK: sound must be the star, not just the voices)
Owner, 19 Nov 2026: "when there are like laughing, fear or heavy sounds… it should be highlighted, not just a human
voice." Every comic beat gets a punchy cue. The same cues are in `script.json` as an `sfx` list on each line (`on` = the
word it lands on, `at` = on|before|after|under, `level`, `dur_s`, optional `offset_s` from that anchor).

**Levels:** `low` = bed level under the voice (~ −24 dBFS peak); `mid` = clearly heard, under the voice peaks (~ −14);
`high` = louder than the voice, placed in a gap between words (~ −8); `max` = the hit of the scene, music cut or ducked
−15 dB for the hit, peak ~ −3 dBFS (true-peak limiter on the master). The Editor should leave **voice gaps** for the
`high`/`max` hits (0.3–0.6 s after the anchor word) instead of putting them under speech. The only `max` cues that land
*on* a word (DHOOM, STAMP, record scratch) are sub- or transient-heavy so they don't mask the word.

| # | t (s, est.) | line / anchor word | cue | level | dur | build hint (synth in `mix.py`) |
|---|---|---|---|---|---|---|
| 1 | 0.0 | intro, under the text hook | clock tick-tock ×4 | mid | 1.1 | short clicks: 2 ms noise bursts through a 3 kHz band-pass, alternating pitch (tick/tock) |
| 2 | 1.1 | intro, minute hand hits 10:10 | bright "TING!" | high | 0.5 | 2.6 kHz + 5.2 kHz sines, fast attack, 0.5 s decay |
| 3 | 1.1 | intro, Ramesh tiptoes | tiptoe plinks ×3 | low | 0.4 | pizzicato: plucked sines 660/784/880 Hz, 80 ms each |
| 4 | 1.5 | L1 "ఒరేయ్" | whoosh (whip-pan to the manager) | mid | 0.3 | band-passed noise sweep 400→3 kHz |
| 5 | 2.6 | L1 "ఏంట్రా" | **DHOOM** boom, cymbal tail; music cut 0.6 s | **max** | 1.0 | sine sweep 90→35 Hz + low-passed noise thump + a 1 s high-passed noise "crash" tail at −12 dB; camera punch-in |
| 6 | 4.4 | L2 "పది" | cartoon "bloop" | low | 0.2 | sine glide 300→700 Hz |
| 7 | 6.6 | L3 after "సరే, సరే…" | comic coffee slurp | mid | 0.4 | noise through a 1.2→2.5 kHz band-pass sweep with tremolo (~30 Hz) |
| 8 | 8.0 | L3 after "చూసుకుందాం" | sinister "dun… DUNN" | high | 0.8 | two low saw stabs (E1 then F1… or G1→F#1), low-passed at 600 Hz, second longer |
| 9 | 8.4 | L3 end | whoosh + calendar-page flips | mid | 0.4 | noise whoosh + 6 rapid paper clicks |
| 10 | 9.6–11.6 | L4 "top rating రావాల్సిన రమేష్ కి…" | snare drumroll, rising | low→mid | 2.0 | dense 30/s noise bursts, band-pass 1.5–5 kHz, gain ramp; cuts dead on #11 |
| 11 | 11.9 | L4 "secondary" | **STAMP** slam + screen shake | **max** | 0.4 | 60 Hz thump + a broadband paper-slap click |
| 12 | 12.3 | L4 end | **sad trombone** "wah… wah… wah… waaaah"; music cut | high | 1.2 | 4 descending notes (G3–F#3–F3–E3) of a saw through a wah (LFO'd low-pass), the last one wobbling (6 Hz vibrato) |
| 13 | 13.5 | L5 "Follow" | button pop-in | mid | 0.2 | short sweep 500→1.2 kHz |
| 14 | 14.2 | L5 "కొట్టండి" | tap click + "ding" | mid | 0.4 | click + 1.6 kHz bell |
| 15 | 15.3 | L5 after "ఇప్పుడే" | 3 heavy stomps + glass door bang | high | 0.6 | 3 low thumps (80 Hz) 0.18 s apart + a bright glassy rattle |
| 16 | 15.9 | L6 before the line (door bang) | **crowd "ooooooh!"** rising as colleagues pop up | high | 0.8 | see "crowd sounds" below; ducks to low if it touches the first word |
| 17 | 24.0 | L7 after "కదా!" | **DHAN! DHAN! DHAAAN!** TV-serial triple zoom, a whoosh per zoom; music cut | **max** | 0.9 | three orchestra-hit stabs (low saw + noise + 50 Hz thump) 0.25 s apart, the third longer; whoosh before each |
| 18 | 25.6 | L8 onset of "నీ దుంప తెగ" | **record scratch**, music stops dead, FREEZE frame | **max** | 0.4 | band-passed noise with a fast pitch wobble (centre 2 kHz→400→1.5 kHz in 0.35 s) |
| 19 | 26.7 | L8 after "తెగ!" | crowd gasp "HAAH!" | mid | 0.4 | crowd layer (below) |
| 20 | 26.8 | L8 "పది నిమిషాలు" | music bed back in, faster | low | — | same bed, +8% tempo |
| 21 | 30.4 | L9 end | long loud coffee slurp | mid | 0.6 | as #7, longer |
| 22 | 31.6 | L10 "గంట ముందే" | mock-heroic brass "ta-da-DAAA" | mid | 1.0 | rising fifth on saw "brass" (C4–G4–C5), generic, synthesized (no film music) |
| 23 | 34.2 | L11 "మంచిది" | sparkly "ding!" | mid | 0.4 | 3 quick high sines (1.6/2.1/2.6 kHz) |
| 24 | 34.8 | L11 end | **total silence** (music too): the pause before the punch | — | 0.4 | mute everything |
| 25 | 35.2 | L12 "మరి" | soft whoosh (he leans in) | low | 0.3 | short noise whoosh |
| 26 | 37.8 | L12 after "నువ్వు?" | **hollow "DONK"** on the manager's blank face | **max** | 0.5 | wood block (900 Hz + 2.3 kHz, 40 ms) plus a hollow tail: 220 + 587 Hz inharmonic partials, 0.4 s decay, slight comb-filter "coconut" ring |
| 27 | 37.9 | L12 after the DONK | **audience laugh track** | **max** → mid | 3.0 | crowd layer (below); max for 1 s, then tails to mid under the punch card |
| 28 | 38.4 | L12, 0.4 s into the laugh | **"HOORAY!" cheer + applause** | high | 2.2 | crowd layer + applause (dense random claps: 3–8 ms noise bursts, Poisson ~40/s, band-pass 1–4 kHz, swelling then fading) |
| 29 | 39.8 | punch card, second half lands | rimshot "ba-dum-TSS" | high | 0.6 | two tom thumps (150/110 Hz) + high-passed noise "tss" |
| 30 | 40.4 | L13 "Comment" | 3 comment-bubble pops | mid | 0.5 | sweeps 900→300 Hz, 0.1 s apart |
| 31 | 43.4 | L14 "tag" | swoosh + pop | mid | 0.4 | — |
| 32 | 44.2 | L14 end | end-card sting + sparkle | mid | 1.0 | as the house end-card sparkle |
| 33 | 44.5 | end card | callback: two clock ticks + a small "ting" | low | 0.8 | as #1/#2, quieter |

**Crowd sounds (#16, #19, #27, #28), how to build them without copying anyone's audio (rule 1):**
1. **Preferred, in-house and cheap:** record each crowd reaction as 6–8 short TTS takes with different voices (Gemini:
   Puck, Fenrir, Algenib, Orus, Kore, Leda, Aoede… — `act` e.g. "a big, hearty audience belly laugh, no words" /
   "a long, rising, teasing 'ooooooh' from an office crowd" / "a sharp shocked gasp" / "a joyful 'hooray!' cheer"),
   then layer them with 30–150 ms offsets, ±2 semitone pitch shifts, a little room reverb and a bed of pink-noise
   murmur. Eight layers sound like a studio audience. Cost: pennies on Gemini (free tier), nothing extra.
2. ElevenLabs Sound Effects (`/v1/sound-generation`, text prompt → a laugh track/cheer) sounds better, but **it uses
   paid credits** and the key may be empty. Owner's OK first (rule 6).
3. Downloading a CC0 laugh/cheer pack needs the owner's OK and its licence noted in the brief. Never rip a laugh track
   from a TV show or another creator's reel.

**Music:** a bouncy, original synthesized office-comedy bed (pizzicato + bassoon-like synth, ~120 BPM), ducked under
voices as usual, **cut** on the DHOOM (#5), the sad trombone (#12), the DHAN-DHAN-DHAN (#17), the record scratch (#18,
stays off through "నీ దుంప తెగ!") and the pre-punch silence (#24); a short upbeat tag after the laugh track.

## Retention pass
- **Drop risk 1, 0–2 s (no voice yet):** the text hook and a ticking clock with the TING carry it, and the first voice
  comes at 1.5 s with a DHOOM. The intro is capped at 1.5 s.
- **Drop risk 2, Scene 2 (narration):** one Gopi line with a drumroll, a STAMP and a sad trombone (three sound events in
  5 s), then a follow line that opens a loop ("అసలు గొడవ ఇప్పుడే!") instead of a flat "follow".
- **Drop risk 3, L6–L7 (the longest lines, 11–12 words):** the "ooooh" from the colleagues just before L6 and the
  TV-serial triple zoom right after L7 are real pattern interrupts on the story's turn (the reason is revealed).
- **Drop risk 4, L9–L11 (short back-and-forth):** quick lines with slurp/heroic/ding gags, then a hard 0.4 s silence
  so the punch hits.
- **After the punch:** the silent card under the laugh (2.5 s), then two very short Gopi prompts. No outro speech.
- Cut / not added: no voiced stage direction in Scene 1, no extra jokes, no moral speech, no countdown.

## CTA options
1. ✔ "మీ manager ఇలా చేశాడా? 😂 Comment చేయండి!" + "మీ manager ని tag చేయండి!" (the manager's/owner's pair; the
   office-comedy goal is shares and tags, and a tag sends the reel to a real colleague).
2. "Office friend కి పంపండి… వాళ్ళ manager కూడా ఇంతే!" (a good share line, but it adds a joke the owner didn't write).
3. "రేపు ఇంకో office comedy… follow చేయండి!" (follow only; weaker for reach than the tag).

## Timing estimate
| L | who | text (short) | start | est. s |
|---|---|---|---|---|
| — | (silent) | clock → 10:10 TING, Ramesh sneaks in | 0.0 | 1.5 |
| 1 | manager | ఒరేయ్ రమేష్! ఏంట్రా లేటుగా వచ్చావు? | 1.5 | 2.6 |
| 2 | ramesh | పది నిమిషాలే కదా సార్! | 4.1 | 1.6 |
| 3 | manager | సరే, సరే... rating టైమ్ లో చూసుకుందాం. | 5.7 | 3.0 (incl. slurp, sting, flip) |
| 4 | gopi | Appraisal రోజు… secondary rating! | 8.7 | 4.8 (incl. stamp + trombone) |
| 5 | gopi | Follow కొట్టండి… అసలు గొడవ ఇప్పుడే! | 13.5 | 2.4 (incl. stomps) |
| 6 | ramesh | సార్, ఎందుకు సార్… నచ్చలేదా? | 15.9 | 4.2 (incl. 0.8 s "ooooh") |
| 7 | manager | నీ పని బాగానే ఉంది… లేటుగా వచ్చావు కదా! | 20.1 | 4.7 (incl. DHAN×3) |
| 8 | ramesh | ఒరేయ్... నీ దుంప తెగ!… ఎవరైనా? | 24.8 | 4.4 (incl. scratch/freeze) |
| 9 | manager | మరి ఏం చేయమంటావ్? | 29.2 | 1.8 (incl. slurp) |
| 10 | ramesh | రేపటి నుంచి గంట ముందే ఆఫీస్‌కి వస్తా! | 31.0 | 2.2 |
| 11 | manager | అయితే చాలా మంచిది రమేష్! | 33.2 | 2.0 (incl. 0.4 s silence) |
| 12 | ramesh | మరి నా శాలరీ డబుల్ చేస్తావా నువ్వు? | 35.2 | 5.2 (voice 2.4 + DONK + laugh + silent punch card 2.5) |
| 13 | gopi | మీ manager ఇలా చేశాడా? Comment చేయండి! | 40.4 | 2.2 |
| 14 | gopi | మీ manager ని tag చేయండి! + end card | 42.6 | 2.6 |
About 93 words of voice (~36 s at the recent ~2.6 words/s) + ~9 s of SFX breathing room ≈ **45 s**, at the top of the
35–45 s target. No speed-up beyond the usual engine setting; don't rush the comic pauses. If the render runs over ~46 s,
trim in this order: the intro to 1.2 s → the sad trombone to 1.0 s → L5 becomes just "Follow కొట్టండి!" (−1 s) → the
end-card sting overlaps L14. Never cut the 0.4 s pre-punch silence, the DONK or the laugh: they are the joke's timing.

## Hashtags
- Instagram: the owner's 5, exactly as given: `#OfficeComedy #TeluguComedy #CorporateLife #EmployeeLife
  #ManagerVsEmployee`. Instagram's cap is 5, so **`#reelrasam` is left out this time**, per the owner's list (the
  handle is still in the caption).
- YouTube: `#shorts` first, then the owner's 5, then `#telugu #telugushorts #comedy #funny #officelife #appraisal
  #corporatecomedy #comedyshorts #reelrasam` (15 total).

## Facts to verify
- None. This is **a fictional comedy** (Ramesh and his manager are our own one-off characters; no company, brand, real
  person or statistic). The caption says "A fictional comedy." Comedy safety: no star lookalikes, no film footage, no
  film music or famous dialogue; the "DHAN-DHAN-DHAN" triple zoom is a generic TV-serial trope, built from our own
  synthesized hits. Animation, voices and crowd sounds are AI-generated (labelled in the caption and on YouTube).

## Telugu / dialect flags for the owner
- **Manager L3: "rating టైమ్ లో చూసుకుందాం"** replaces "ఈ రెండు వీళ్లు చూసుకుందాం" (see the top of this brief). The only
  wording change.
- **"నీ దుంప తెగ!"** is kept: a mild, comic exclamation, not abuse. `act` asks for comic fury, not real venom.
- **Ramesh's "ఒరేయ్" / "నువ్వు" / "నీ" to his manager** is kept as the joke. The `act` for L8 plays it as handing the
  boss his own "ఒరేయ్" from L1 back to him. Note the arc: L6 polite "సార్… ఇచ్చారు… మీకు" → L8 "ఒరేయ్… నీ" → L12
  "చేస్తావా నువ్వు".
- **The manager says "ఒరేయ్" and "ఏంట్రా" to Ramesh in L1.** That is condescending on purpose (and sets up the payback).
- **Dialect vs voice:** by our rule Ramesh (angry) gets a Telangana voice, and normally the dialect of the lines follows
  the voice. Your lines are mostly neutral spoken Telugu (వచ్చావు, ఇచ్చారు, వస్తా), so I did **not** convert them to
  Telangana forms (e.g. "ఇచ్చిన్రు", "వచ్చినవ్"); the voice carries the accent. Say if you'd like Ramesh's Scene 3
  lines in Telangana Telugu instead.
- **"సెకండరీ రేటింగ్" / "secondary rating"** isn't a standard appraisal term in most Hyderabad IT companies (they use
  "meets expectations", "B" and so on), but it reads clearly next to "top rating" and it's your word, so it's kept. The
  stamp says "RATING: TOP → SECONDARY".
- **Gopi L4** "రావాల్సిన రమేష్ కి" and **L5** "Follow కొట్టండి… అసలు గొడవ ఇప్పుడే!" ("hit follow… the real fight
  starts now") are our lines: please check they sound natural.
- **Gopi L14** "మీ manager ని tag చేయండి!" asks viewers to tag their real manager; it's your prompt, delivered as a cheeky
  whisper.
- Audio tags used: Ramesh [nervous laugh], [cheekily], [frustrated], [hurt], [shouting], [furious], [angry],
  [determined], [proudly], [mischievously], [deadpan]; Manager [shouting], [sarcastically], [dismissively], [smugly],
  [calmly], [chuckles], [pleased], [warmly]; Gopi [dramatic pause], [whispers], [mischievously], [excited], [laughs].
  Max 3 per line, English only; they are stripped automatically for Gemini/Sarvam.
