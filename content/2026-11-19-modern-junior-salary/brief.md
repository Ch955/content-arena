---
post_slug: 2026-11-19-modern-junior-salary
pillar: modern-dilemma
format: reel
platforms: instagram,youtube
language: te+en
style: flat
slot: "2026-11-19 07:30 IST"
topic: "Modern dilemma — at lunch in the Hitech City office cafeteria, Kiran, the new junior Nikhil trained (15 Nov reel), happily blurts out that his CTC is now ₹18 L (another company's offer, matched by ours) 'thanks to your runbook'. Nikhil has 6 years' experience and is on ₹14 L. A: march into the manager's cabin today and fight, or B: stay quiet and job-hunt secretly"
text_hook: "Junior కి 18… నాకు 14?! 😶"
answer: "Neither A nor B. Nikhil congratulates Kiran ('Negotiate చేశావ్ కదా… good.'), sleeps on it and books a calm 15-minute 'comp check-in' with his engineering manager Hema for the next morning. He brings what he can show (the payments runbook, 3 outages it prevented, 4 juniors trained), refuses to compare himself with Kiran and asks for a market correction with a review date. Hema gives the date (Dec 1) and the twist: before Nikhil asked, Kiran had already told HR in his own retention talk on Tuesday, 'Runbook Nikhil anna ది… ముందు ఆయన salary చూడండి!' (the 'ఇంకో పని కూడా చేశా anna…' he never got to finish at lunch). Loop: 'clue మొదట్లోనే ఉంది!' → frame 1."
status: idea
---

# Brief: Modern dilemma — the junior's salary

Thu 19 Nov 2026, 07:30 IST (one reel a day; rotation: modern-dilemma, 45–60 s). Art style **flat** (the `plan` default;
bright, clean flat colours suit a funny-real cafeteria story), with one torn-edge paper/sepia inset for the L12 flashback
(as in the 18 Nov reel); the Editor may switch skins per scene. 14 voiced lines in `script.json`, 125 words, all 10
words or fewer except L14 (11 words in three short phrases). Callback reel to 15 Nov ("the 10-minute Sunday
call"): Kiran is the same new junior who fixed the Sunday P1 with Nikhil's runbook. The premise is the manager's pick; I
kept its core and tightened the writing (changes listed below).

## Cast (for the Editor: drawing + `PROFILE` via `elevenvoice.profile_for`)
| who | gender | age | temperament | dialect of lines | look / voice |
|---|---|---|---|---|---|
| `nikhil` | male | young (28, software engineer, Tower B, Hitech City; 6 years at the company, owns the payments module, wrote the runbook) | cool / thoughtful (hurt for one line in L5, then composed) | standard Andhra (చేశావ్, చేయనా, కావాలి) | `{...NIKHIL_OPT, badge:["NIKHIL R","TOWER B"]}`; `profile_for("male","young","cool")` → andhra-male-young; Gemini **Charon** (as in every reel since 15 Nov) |
| `ananya` | female | young (27, his close friend and teammate) | emotional / fiercely loyal | standard Andhra (వెళ్ళు) | `{...ANANYA_OPT, badge:["ANANYA","TOWER B"]}`; `profile_for("female","young","emotional")` → andhra-female-young; Gemini **Kore** |
| `kiran` | male | young (23, the new junior from 15 Nov; his first on-call was that Sunday P1) | cool / emotional: bubbly, innocent, grateful (serious and sincere for one line in the L12 flashback) | standard Andhra (చూపిస్తే, చేశారు, చేశా, చూడండి) | NEW drawing: round friendly face, clean-shaven, fluffy wavy hair with a front flick, a big grin, bright mustard-yellow polo T-shirt, plain fitness band (no logo), lanyard "KIRAN M · TOWER B" with a small "P1 ⭐" kudos pin. Voice: `profile_for("male","young","cool")` also returns andhra-male-young = **Nikhil's** ElevenLabs voice, so Kiran must NOT use that profile (see "Voices" below). Gemini **Fenrir** (excitable; different from Nikhil = Charon and Gopi = Puck) |
| `hema` | female | middle (~40, Nikhil's engineering manager, Suresh the TL's boss; owns comp decisions for the team) | cool / calm, kind, businesslike | standard Andhra (అడగకముందే, చెప్పాడు) | NEW drawing: indigo handloom cotton saree with a thin white border, rectangular black specs, a neat low bun (no flowers: office), small silver studs, lanyard "HEMA S · ENG MANAGER"; seated in a small glass cabin with a plant and a laptop. `profile_for("female","middle","cool")` → andhra-female-middle (Seeta); Gemini **Despina** (smooth; alt. Gacrux, used for Radhika on 18 Nov) |
| `gopi` | male | young (host/narrator) | — | Tenglish | 5 lines: stakes + hold, follow, question + countdown, comment, tag + close + loop; Gemini **Puck** |

Silent (drawn, no lines): cafeteria crowd (2–3 generic figures), a faceless HR person (back view) in the L12 flashback.
Suresh (TL, 15 Nov) is not needed; Hema is his boss, which is why the salary talk goes to her. No Telangana-dialect
character in this reel: everyone is cool, emotional or calm, so all lines are Andhra. No Pinky (adult story).

### Voices (one voice per character per reel)
- **ElevenLabs:** the bank has only one Andhra young-male voice (Darsh M), which is Nikhil's. Options for Kiran, in order:
  (1) if ElevenLabs is used at all, keep Nikhil on andhra-male-young and voice Kiran on Gemini Fenrir (the per-character
  engine choice already exists in the 18 Nov `voices.py`); (2) give Kiran the Telangana young voice (Kaka) only if the
  owner agrees, which would also need his lines in Telangana Telugu, so I don't recommend it. Never give Kiran Gopi's Liam.
- **Gemini (likely, as the last four reels were all-Gemini):** Gopi=Puck, Nikhil=Charon, Ananya=Kore, Kiran=Fenrir,
  Hema=Despina. `kiran` and `hema` need entries in `scenevoice.NAMES`/`PERSONA` in the reel's own `voices.py`, as the
  Editor did for Sandeep and Radhika: Kiran "a bubbly, innocent 23-year-old Telugu software engineer, quick and
  excited"; Hema "a calm, kind Telugu engineering manager of about 40, measured and warm".
- Kiran's L12 is the flashback in the HR room: optional light room reverb so it reads as "earlier", not a phone band.

## Changes from the manager's premise
- **How Kiran's CTC became ₹18 L (plot hole closed):** he showed another company's offer and ours matched it (L3). That
  explains a big jump only days after the 15 Nov Sunday P1 without a fake "appraisal" for a new joiner, and it's why he
  says "మీ runbook వల్లే": the Sunday fix (with Nikhil's runbook) is why the company chose to match instead of letting him
  go. It also sets up the twist: the retention talk with HR is where Kiran did his "ఇంకో పని".
- **Kiran's line to HR:** "Runbook Nikhil anna ది… ముందు ఆయన salary చూడండి!" instead of "he's underpaid". Kiran doesn't
  know Nikhil's number (he blurts out his own because he assumes his senior earns more), so "check his salary first" is
  what he could honestly say. Same meaning, no plot hole.
- **The meeting is the next morning, not "today":** the 15-minute "comp check-in" is Fri 10:00 AM. That keeps the
  resolution clearly apart from option A ("ఇవాళే fight"): he cools off, gathers data and asks; he doesn't storm in.
- **The twist is in the manager's voice and then Kiran's own:** Hema says it (L11), and a short flashback lets Kiran
  say it himself (L12). Hearing the bubbly kid turn serious is the emotional hit, and it pays off L1 ("మీ runbook వల్లే").
- **"పదిహేను నిమిషాలే" (L9)** is a small callback to the 15 Nov TL's "జర పది నిమిషాలే" for regular viewers; it works
  without having seen that reel.
- Clue planted twice: Kiran's unfinished "ఇంకో పని కూడా చేశా anna…" + the HR mail subject on his phone (L3), and the
  "Market correction · Nikhil R · DRAFT" document already open on Hema's laptop (L9).

## Premise options (the "would I send this to a friend?" test)
1. **(chosen) The junior's salary.** "The new joiner earns more than me" is one of the most felt, least said things in
   Hyderabad IT; every 25–34 viewer either lived it or fears it. The stakes land in line 1 (₹18 L vs. ₹14 L, six years vs.
   a few weeks), both options are defensible (fight = self-respect but risky and comparative; job hunt = how the market
   actually pays, but it walks away from six years), and the resolution is a smart third way plus a warm twist that
   flips the "villain" into the hero. Send-to-friend test: **yes**. "Tag the junior you trained 😅" is a joke people
   play on a real colleague, and seniors will send it to each other with "literally me 💀".
2. **The appraisal rating swap.** Nikhil gets "meets expectations"; Ananya, who did half his work while he covered her
   leave, gets "exceeds". Good office drama, but it pits the two leads against each other, which hurts the recurring duo.
3. **The WFH-mandate EMI.** The company orders 5 days in office; Nikhil just took a home loan for a flat far out of the city. Very
   relatable, but the dilemma (quit vs. commute) is mostly "commute", and the smart resolution is thin.

## Angle
- Belief before: "If a junior earns more than you, the company doesn't value you: either fight now or leave quietly."
  After: "The junior isn't the enemy, and the market moved, not your worth. Ask calmly, with proof and a date, and you
  may find someone is already on your side." Why they stop: line 1 is a happy junior announcing a number bigger than
  yours, and line 2 is that number next to yours. Money, people and envy in 7 seconds, no phone notification.
- Alt angle 2: "Switching is the only way to a real hike" (true for many, but it's a LinkedIn take, not a story).
- Alt angle 3: "Never share your salary at work" (a rule-of-thumb lecture; preachy, no twist).

## Hooks
| | Text hook (≤ 6 words, first 2 s) | Verbal hook |
|---|---|---|
| 1 ✔ | **Junior కి 18… నాకు 14?! 😶** | **(Kiran, beaming) "Anna! నా CTC 18 lakhs అయ్యింది… మీ runbook వల్లే!"** |
| 2 | నేను train చేశా… వాడికి ఎక్కువ! | (Gopi) "మీరు train చేసిన junior… మీకంటే ఎక్కువ salary తీసుకుంటే?" (a "what if" voice; weaker than being at the table) |
| 3 | 6 years vs new joiner 💀 | (Nikhil, inner) "ఆరేళ్ళ loyalty కి… 14 lakhs. నిన్న వచ్చినవాడికి 18." (bitter; starts the reel on self-pity) |

## Script shape (14 lines)
HOOK, open on the action (L1 Kiran: "CTC 18 lakhs… మీ runbook వల్లే!"; title a beat later) → STAKES + hold (L2 Gopi over a
freeze frame: "ఆరేళ్ళ experience. CTC… 14 lakhs. ఏం చేశాడో… చివర్లో!") → **PLANT** (L3 Kiran: offer matched, "ఇంకో పని
కూడా చేశా anna…", pulled away to stand-up) → A, defensible (L4 Ananya: "ఇప్పుడే cabin కి వెళ్ళు!") → B, defensible (L5
Nikhil: "quiet గా resume update చేయనా?") → follow (L6) → question + 5 s countdown on an A/B split (L7) → REVEAL, neither
(L8 "Negotiate చేశావ్ కదా… good. Congrats రా!") → SOLUTION, next morning, 15 minutes (L9 the three proofs; L10 "Kiran తో
compare కాదు… market correction, review date తో") → TWIST (L11 Hema: "Review — December 1. నువ్వు అడగకముందే… Kiran HR కి
చెప్పాడు."; L12 Kiran in flashback: "Runbook Nikhil anna ది… ముందు ఆయన salary చూడండి!") → comment (L13) → tag + close +
LOOP (L14 "clue మొదట్లోనే ఉంది!" → hard cut to frame 1).

Interaction beats (adult wording): 1 hook L1 · 2 hold L2 ("ఏం చేశాడో… చివర్లో") · 3 follow L6 · 4 "మీరైతే? A… B…
Comment చేయండి" + 5 s countdown L7 · 5 "మీకు ఎప్పుడైనా junior కంటే తక్కువ వచ్చిందా? A or B… comment!" L13 · 6 share as a
tag ("మీరు train చేసిన junior ని tag చేయండి!") L14 (caption adds "friends కి share చేయండి") · 7 close + loop L14 (end
card carries follow/subscribe).

## Plot-hole check (the twist must survive a rewatch)
- **How does a brand-new junior jump to ₹18 L?** Not an appraisal: he got another company's offer and ours matched it
  (L3, the "MATCHED ✔" stamp). Fresh joiners getting late outside offers is common; the Sunday P1 fix is why the company
  bothered to match.
- **Why is Nikhil on ₹14 L after 6 years?** Six years at one company with small yearly hikes while new joiners come in
  at today's market rate. Nobody is a villain; that's the funny-real sting. (A story detail, not a statistic.)
- **Why does Kiran blurt his CTC out?** He's 23, happy and grateful, and assumes his senior earns more. That same
  assumption is why he tells HR to "check his salary", not "he's underpaid": he doesn't know the number.
- **Why doesn't Nikhil already know what Kiran told HR?** Kiran starts to tell him at lunch ("ఇంకో పని కూడా చేశా
  anna…") but his band buzzes for the 1:15 stand-up and he runs off (L3). HR conversations are private; Hema only
  learns it because HR forwards Kiran's point to the team's manager.
- **Why can Hema give a review date on the spot?** Because she already had the correction drafted since Tuesday (the
  "DRAFT · created Tue" document, L9/L11). Nikhil's proof makes it easy; it doesn't come from nowhere. She gives a
  *review date*, not a number: the final amount stays off-screen on purpose (no reward scene).
- **Is "neither A nor B" a cheat?** No. He doesn't fight today (not A) and he doesn't quietly leave (not B). He asks, the
  next morning, calmly, with proof, without comparing to Kiran. Viewers who chose A or B aren't wrong, and neither Gopi
  nor the comment bubbles judge them. B is still sensible advice in real life; the reel doesn't shame it.
- **Who is Hema vs. Suresh?** Suresh (15 Nov) is the team lead; Hema is the engineering manager above him who owns comp.
  No contradiction with earlier reels.
- **Timeline:** Sun 15 Nov the P1 fix → Tue Kiran's retention talk + HR mail ("Re: one more point — your mentor") → Hema's
  draft (Tue) → Thu 1 PM lunch → Fri 10:00 AM the 15-minute meeting → review on Dec 1 (the appraisal month the 15 Nov reel
  mentioned). Clocks and chips on screen match.
- **Numbers consistent everywhere:** Kiran ₹18 L; Nikhil 6 yrs, ₹14 L; 3 outages prevented; 4 juniors trained; 15 min;
  Dec 1. Caption and youtube.md use the same.
- Rewatch clues: the "P1 ⭐" pin (L1), Kiran's unfinished "ఇంకో పని కూడా చేశా anna…" and the HR mail subject on his
  phone (L3), and "Market correction · Nikhil R · DRAFT" on Hema's laptop (L9).

## Retention pass
- **Drop risk 1, L3 (Kiran explaining the match):** it's one line with a visual stamp, and it carries the clue. Kiran
  running off mid-sentence is a small, real pattern interrupt (and a mini open loop: "what other thing?").
- **Drop risk 2, L4–L6 (A, B, follow):** two short, opposite reactions (fierce friend vs. tired inner voice), each with a
  comic visual (Ananya's table taps, the drooping samosa), then one brisk follow line.
- **Drop risk 3, the 5 s countdown:** split A/B with funny comment bubbles that don't give anything away.
- **Drop risk 4, L9–L10 (the meeting, the "explainer" part):** cards slap down one by one, a visible 15:00 timer, and
  the face-down Kiran card is a silent gesture people will screenshot. No lecture about negotiation.
- **Drop risk 5, after the twist:** only two short Gopi lines, the last one a loop that sends people back to find the
  clue.
- Cut: no "never compare salaries" speech, no "switching gives 30% hikes" claim, no HR-policy talk, no number for
  Nikhil's new salary, no hug.

## CTA options
1. ✔ "మీకు ఎప్పుడైనా junior కంటే తక్కువ వచ్చిందా? A or B… comment!" + "మీరు train చేసిన junior ని tag చేయండి!"
   (modern-dilemma goal: comments + shares; the tag is a friendly joke on a real colleague, and it flatters the junior)
2. "ఈ reel మీ office senior కి పంపండి… వాళ్ళు A ఆ B ఆ చూడండి!" (good share, but less playful than a tag)
3. "మీ first hike ఎంత? Comment చేయండి." (strong comment driver, but people don't write salary numbers under their
   names; kept as a pinned-comment idea for the owner)

## Timing estimate
| L | who | est. s |
|---|---|---|
| 1 | kiran | 3.4 |
| 2 | gopi | 3.8 |
| 3 | kiran | 3.6 |
| 4 | ananya | 3.0 |
| 5 | nikhil | 3.0 |
| 6 | gopi | 2.7 |
| 7 | gopi | 3.8 (+ 5 s silent countdown) |
| 8 | nikhil | 2.6 |
| 9 | nikhil | 3.8 |
| 10 | nikhil | 3.6 |
| 11 | hema | 3.8 |
| 12 | kiran | 2.8 |
| 13 | gopi | 3.6 |
| 14 | gopi | 3.8 |
125 words ≈ **47–48 s of voice** (recent reels ran ~2.6 words/s) + 5 s countdown + ~2 s of title/gaps ≈ **54–55 s**,
inside 45–60 s with ~5 s of headroom, so no speed-up is needed beyond the usual engine setting. If it runs over 58 s, trim
in this order: L6 → "Follow చేయండి!" (the button carries it) → L10 drop "Review date తో." (the "Ask" card shows it) →
L14 drop "Follow…" (the end card carries it). Never cut L3, L11 or L12; they are the clue and the twist.

## Facts to verify
- None. This is **a fictional situation** (Nikhil, Ananya, Kiran and Hema are our own characters; the companies, the
  offer, the salaries, the outages and the runbook are invented and unnamed). Hitech City is a real Hyderabad area used
  only as setting. No quote, statistic, brand or real person is used. "New joiners can earn more than long-serving
  seniors" is the story's situation, not a claim with a number. The caption says "a fictional situation".

## Telugu / dialect flags for the owner
- All lines are standard Andhra Telugu / Tenglish (no Telangana-voiced character in this reel).
- L1 "నా CTC 18 lakhs అయ్యింది" — "lakhs" in English as office people say it; `say` reads "eighteen lakhs".
- L2 "ఆరేళ్ళ experience" (six years' experience): please confirm the spelling ఆరేళ్ళ (vs. ఆరేళ్ల).
- L3 "వేరే offer చూపిస్తే… match చేశారు!" ("I showed another offer and they matched it"). Natural? Alternative: "వేరే
  offer చూపించా… వెంటనే match చేశారు!" (+1 word). "ఇంకో పని కూడా చేశా anna…" uses the colloquial చేశా (చేశాను).
- L4 now "Junior కి పద్దెనిమిదా?" (Editor retake, 18 Nov: the whispered English "eighteen ఆ?" was heard as "80" in the mix, so the number is said in Telugu, in a clear voice). Spelling/feel OK?
- L5 "quiet గా resume update చేయనా?" — self-talk "shall I…?"; alternative "చేసుకుందామా?".
- L7 "B… silent job hunt" is English on purpose (how office people say it); Telugu alternative "B… గుట్టుగా job hunt".
- L8 "Congrats రా, Kiran!" — "రా" from a senior to a 23-year-old junior he trained: warm elder-brother, not
  condescending? (Kiran calls him "anna", so it matches.)
- L9 "Ma'am" — Nikhil addressing his manager; common in Hyderabad offices. If you prefer first names at Tower B, use
  "Hema," instead.
- L11 Hema uses "నువ్వు" with Nikhil (a manager ~12 years older, warm). If it sounds too familiar, use "మీరు అడగకముందే".
- L12 "ముందు ఆయన salary చూడండి!" ("check his salary first") — Kiran to HR, polite plural. Check it sounds respectful
  and not like a demand.
- L13 "junior కంటే తక్కువ వచ్చిందా?" — salary is implied ("got less than a junior"); add "salary" (+1 word) if unclear.
- `say` reads 18 / 14 as "eighteen" / "fourteen" and "December 1" as "December first"; on-screen text keeps the digits.
- Audio tags for Kiran ([excited], [laughs], [proudly], [mischievously], [earnest], [firmly]) and Hema ([calmly],
  [warmly], [softly]) are free-form v3 tags; max 3 per line, English only.
