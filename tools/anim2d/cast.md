# Recurring cast — drawing options (keep every reel consistent)

Editor rule (owner, 12 Nov 2026): the recurring leads Nikhil and Ananya are drawn the same in every reel. Reuse these
options exactly; copy the `makeAdult()` rig from the reference episode below (adult proportions — small head on a
long torso, 2-bone arms with elbows, almond eyes — not the kid `makeChar()` rig used for Gopi/Pinky).

First used: `content/2026-11-13-whatif-redo-one-day/2d/ep.html` (What-if #1, paper skin + clay replay), 13 Nov 2026.

## Nikhil — 28, Hyderabad software engineer, thoughtful, a little introverted
Charcoal shirt with collar + button placket + pocket, short dark hair, light stubble.
```js
const NIKHIL_OPT={skin:"#C98B5E",hair:"#1C1410",shirt:"#45454D",collar:"#3A3A42",stubble:"#5A3A28",brow:6.5,lip:"#7A3A30"};
```

## Ananya — 27, his close friend, confident, curious, empathetic
Teal kurta with a gold round neckline + dashed centre trim, 3/4 sleeves with gold cuffs, shoulder-length dark hair,
small gold earrings.
```js
const ANANYA_OPT={skin:"#D9A47A",hair:"#2A1A14",shirt:"#1E8C8C",trim:"#F5B347",kurta:true,longHair:true,fore:"#D9A47A",sleeve:"#1E8C8C",cuff:"#F5B347",earrings:true,brow:4.5,lash:4,blush:0.3,lip:"#A0404A"};
```

## Rig notes (`makeAdult(o)`)
- Local y = 0 at the hip; shoulders at y −270, head centre at y −392. Seated behind a table: hip ~60 px below the
  table top (pantry: `NY=1240`, table top 1180), hands rest at local y ≈ −66. Standing (Ananya): `AY=1085`.
- Pose state: `look/lookY`, `brow` (n|u|s|a|q|w), `smile|sad|smirk`, `tear` (eye glint), `tearRun` (0..1 drop),
  `shut`, `wink`, `headRot/headY`, hand targets `hL/hR` (local) or `aim("R", wx, wy)` (world), `item` (chai|phone).
- Paper skin posterizes colours to 6 levels/channel: avoid radial gradients inside the world (they band into
  rings); use flat translucent cut-paper shapes for light (lamp cone, phone glow).

## Voices
- Nikhil: `PROFILE "andhra-male-young"` (cool → Andhra; ElevenLabs library voice on a paid plan). On the free plan he
  falls back to built-in Liam = Gopi's voice, so What-if #1 pitched him to 0.94 (`ELEVEN_PITCH`) to tell them apart.
  Gemini fallback: Charon. Sarvam fallback: rahul.
- Ananya: `PROFILE "andhra-female-young"` (free plan → Jessica). Gemini: Kore. Sarvam: kavya.

## Standing scenes (from Moral dilemma #1, `content/2026-11-14-dilemma-wallet-emi/2d/ep.html`, 14 Nov 2026)
`makeAdult()` there adds optional `legs:{pant,shoe}` (trousers + shoes, `st.walk` swings them), `badge:[line1,line2]`
(office lanyard + ID badge), `itemL` (left-hand phone), the `wallet`/`walletOpen` props, and for one-off characters
`moustache`, `grey`, `bags`, `eyeWhite`, `uniform` (plain shirt with flap pockets + shoulder flaps, no logo) and a cap
(`st.cap`). Nikhil in that reel: `{...NIKHIL_OPT, badge:["NIKHIL R","TOWER B"], legs:{pant:"#2B3240",shoe:"#1A1A1A"}}`.

## Nikhil's family + his team lead (from Modern dilemma #1, `content/2026-11-15-modern-sunday-call/2d/world.js`, 15 Nov 2026)
Clay home (Kukatpally) + neon office. `makeAdult()` there adds `saree:{base,pallu,border}` (blouse + pallu with a gold
border), `bun` (with jasmine), `bindi`, `specChain` (glasses hanging on a chain), `glasses` (frame colour; reading
glasses), `recede`, `lines` (age lines), `pen` (shirt-pocket pen), `headset`, `cuff` (rolled sleeves), `st.wince`,
`st.sweat`, and the `fork` item. Reuse these if the family returns:
```js
const SAROJA_OPT={skin:"#C68C62",hair:"#2A1E1A",shirt:"#1F6E5A",saree:{base:"#B0204A",pallu:"#C2185B",border:"#F2B53A"},sleeve:"#1F6E5A",fore:"#C68C62",bun:true,bindi:true,earrings:true,specChain:true,lines:true,brow:4.5,lash:4,blush:0.3,lip:"#9A3040"};   // Amma, ~55
const PRASAD_OPT={skin:"#B87D55",hair:"#A8A8A8",shirt:"#F4F4EE",collar:"#E4E4DA",button:"#C9C9C0",moustache:"#D8D8D8",glasses:"#5D4037",recede:true,lines:true,pen:"#1E88E5",brow:6,browCol:"#8A8A8A",lip:"#7A3A30"};   // Nanna, ~60
const SURESH_OPT={skin:"#B5774E",hair:"#1A1410",grey:true,shirt:"#7FA7D9",collar:"#6B93C6",sleeve:"#7FA7D9",fore:"#B5774E",cuff:"#6B93C6",moustache:"#1E1612",headset:true,bags:true,brow:7,lip:"#6A3028"};   // TL, ~40
```
Voices in that reel (all Gemini — the ElevenLabs key ran out): Gopi=Puck, Nikhil=Charon, Suresh=Algenib, Saroja=Kore, Prasad=Orus.

## Long-form storybook cast (16:9, from "చివరి చెట్టు రహస్యం", 15 Nov 2026)
Meera (12, two braids, yellow blouse + green langa voni with a gold border, silver locket), Chintu (12, chubby, red
shirt, khaki shorts), Thatayya (70, white kurta + dhoti, kanduva, round glasses, white moustache, stick), Veerendra
(45, plum suit jacket, gold chain, sunglasses on his hair), 2 henchmen with axes, 3 villagers, Vriksha Devata (a
guardian spirit of leaves and golden light; no idol or religious symbols), a deer and a bird. The drawing options live in
`tools/anim2d/story16x9/cast.js` (`MEERA_OPT`, `CHINTU_OPT`, ...). Reuse them with `makeMeera()` etc. so the cast looks the same in every part.

## Nikhil at night + Ananya's dead phone (from Twist story #1, `content/2026-11-16-twist-voice-note/2d/world.js`, 16 Nov 2026)
Neon bedroom / paper flashbacks / clay morning in Nikhil's Dilsukhnagar flat (he lives with Amma; Amma = `SAROJA_OPT`).
`makeAdult()` there merges the earlier rigs (saree/bun/specChain, kurta/longHair, `legs` + `st.walk`, `badge`) and adds
`tee` (plain round-neck T-shirt), `bag` (shoulder bag), `st.laugh` (open laugh), `st.scr` (phone screen on/off), the
items `bite` (cake piece), `dosa`, and the left-hand `dead` phone (black screen, red battery "0%").
```js
const NIGHT_OPT={...NIKHIL_OPT,tee:true,shirt:"#8A8F98",collar:"#6B7079"};   // same Nikhil, grey T-shirt at night
```
Voices in that reel (all Gemini — the ElevenLabs key is out of credits): Gopi=Puck, Nikhil=Charon, Ananya=Kore; Nikhil's
own voice note = Charon + a phone-speaker band-pass (`PHONE_AF` in voices.py).

## Engagement-night family (from What-if #2 "the forehead number", `content/2026-11-17-whatif-forehead-number/2d/world.js`, 17 Nov 2026)
Neon Kukatpally function hall (cousin Divya's engagement) + clay time-lapse. `makeAdult()` there adds `jhumka` (big gold
bell earrings), `necklace` (two gold chains + pendant), `bangles`, `sharp` (arched, sharp eyebrows), `earbuds` (white;
`st.buds=0` takes the right one out), `kanduva` + `kanduvaStripe` (cotton towel over the left shoulder), `round` (round
glasses), `old` (forehead lines), `noFlowers` (bun without jasmine), `puff` (styled hair), `saree.motif` / `saree.bw`,
`st.gasp` (open-mouth surprise), the items `laddu`, `plate` (steel plate with sweets), and left-hand `vcall` (phone with a
generic video-call grid) and `album` (paper photo album). Seated cast: no `legs`, hip at the seat, sofa/chair front drawn after.
```js
const VIMALA_OPT={skin:"#C88A5E",hair:"#1E1412",shirt:"#4A148C",saree:{base:"#6A1B9A",pallu:"#AD1457",border:"#FFC107",motif:"#FFD54F",bw:12},sleeve:"#4A148C",fore:"#C88A5E",bun:true,bindi:true,jhumka:true,necklace:true,bangles:true,sharp:true,lines:true,brow:5.5,lash:4.5,blush:0.25,lip:"#B0203A"};   // Vimala అత్తయ్య, ~52 (Nanna's sister)
const ROHIT_OPT={skin:"#C68A5E",hair:"#17110E",shirt:"#E8E0CC",trim:"#B08D57",kurta:true,sleeve:"#E8E0CC",puff:true,earbuds:true,brow:6,lip:"#7A3A30"};   // Rohit, ~30, her son (US job); standing: legs:{pant:"#EDE7D9",shoe:"#6D4C41"}
const SRINU_OPT={skin:"#9C6440",hair:"#1A1410",shirt:"#F7F7F2",collar:"#ECECE4",button:"#D8D8D0",kanduva:"#FFF8E7",kanduvaStripe:"#C62828",moustache:"#1E1612",brow:6.5,lip:"#6A3028"};   // Srinu, ~29, B.Tech -> farmer cousin; legs:{pant:"#F2EFE6",shoe:"#6D4C41"}
const AMMAMMA_OPT={skin:"#B98060",hair:"#C9C9C9",shirt:"#7B1E2B",saree:{base:"#F4F1E8",pallu:"#F7F4EC",border:"#7B1E2B",bw:11},sleeve:"#7B1E2B",fore:"#B98060",bun:true,noFlowers:true,glasses:"#6D4C41",round:true,lines:true,old:true,bindi:true,brow:4.5,browCol:"#9E9E9E",lash:3.5,blush:0.2,lip:"#8A4A40"};   // Ammamma, ~74 (Amma's mother)
```
Nikhil here: `{...NIKHIL_OPT, badge:["NIKHIL R","TOWER B"], legs:{pant:"#2B3240",shoe:"#1A1A1A"}}` at the door, plain `NIKHIL_OPT`
seated on the sofa; Ananya standing: `{...ANANYA_OPT, legs:{pant:"#F3E5AB",shoe:"#8D6E63"}}`.
Voices in that reel (all Gemini — the ElevenLabs key had 51 credits left, Sarvam had none): Gopi=Puck, Vimala=Autonoe,
Ammamma=Sulafat, Ananya=Kore, Nikhil=Charon.

## Sandeep + the Tower B office (from Moral dilemma #2 "the reference call", `content/2026-11-18-dilemma-reference-call/2d/world.js`, 18 Nov 2026)
Paper office at Tower B, Hitech City (glass stand-up room, Sandeep's desk) + a sepia torn-paper flashback inset ("LAST
YEAR": paper filter + CSS sepia on an HTML-clipped inset with its own little SVG world) + the chai stall below Tower B at
dusk (same paper skin, warm palette). Radhika (HR) is voice only: a generic call card (no app, no logo). `makeAdult()`
there adds `sidePart` (neat gelled side part with a gloss line), `watch` (plain smart watch on the left wrist, no logo),
the items `glass` (chai tumbler, either hand), `cert` (certificate held at the chest) and left-hand `phoneUp` (phone face-up
with a calendar). Silent stand-up colleague: `PEER1` (moustache, brown shirt).
```js
const SANDEEP_OPT={skin:"#BF8459",hair:"#120D0A",shirt:"#8EC3EE",collar:"#79AEDC",button:"#E8F2FB",sleeve:"#8EC3EE",fore:"#BF8459",cuff:"#A9D3F5",sidePart:true,watch:"#263238",brow:6,lip:"#7A3A30"};   // Sandeep K, 34, senior engineer on Nikhil's team: slim light-blue shirt, rolled sleeves, smart watch, gelled side part, confident half-smile (smirk)
const SANDEEP_DOWN={...SANDEEP_OPT,fore:"#8EC3EE",cuff:"#79AEDC"};   // sleeves down (chai stall), lanyard in his pocket (st.lany=0)
```
Office: `{...SANDEEP_OPT, badge:["SANDEEP K","TOWER B"]}`; standing: `legs:{pant:"#37414F",shoe:"#3E2723"}`. Ananya standing here
wears a team lanyard: `{...ANANYA_OPT, badge:["ANANYA","TOWER B"], legs:{pant:"#F3E5AB",shoe:"#8D6E63"}}`.
Voices in that reel (all Gemini — the ElevenLabs key had 51 credits left, Sarvam none): Gopi=Puck, Nikhil=Charon,
Ananya=Kore, Sandeep=Umbriel (profile andhra-male-middle on ElevenLabs), Radhika=Gacrux + a mild phone band (profile
andhra-female-middle).

## Kiran + Hema (from Modern dilemma #2 "the junior's salary", `content/2026-11-19-modern-junior-salary/2d/world.js`, 19 Nov 2026)
Flat Tower B cafeteria (Thu 1:13 PM) + Hema's glass cabin (Fri 10:00 AM) + a paper/sepia torn-edge flashback inset
("TUESDAY · HR ROOM", own SVG world with the paper filter + CSS sepia). Kiran is the new junior from the 15 Nov reel; on
15 Nov he was only a name on screen (roster card, runbook screen), so this is his first drawing: keep it from now on.
`makeAdult()` there adds `polo` (polo T-shirt: soft collar, short placket, no logo), `shortSleeve` (sleeve cap over a
skin-coloured upper arm; set `fore` to the skin), `fluffy` (wavy hair with a front flick), `roundFace`, `band` (plain
fitness band on the left wrist, no logo; `st.buzz=1` lights + shakes it), `pin` (gold "P1" star pin on the lanyard
badge; counter-flipped with the badge so it never mirrors), `lowBun` (with `bun`+`noFlowers`: a low bun peeking behind
the head), `earCol` (stud colour, e.g. silver), `rect` (rectangular specs with `glasses`), the items `samosa`/`samosaBit`
(right hand) and left-hand `bottle` (plain water bottle) and `phone`.
```js
const KIRAN_OPT={skin:"#B97A50",hair:"#22160F",shirt:"#F2B705",collar:"#D99A00",button:"#FFF8E1",polo:true,shortSleeve:true,fore:"#B97A50",fluffy:true,roundFace:true,band:"#263238",brow:6,lip:"#7A3A30",blush:0.24};   // Kiran M, 23: bubbly new junior, mustard polo, fluffy wavy hair + front flick, round clean-shaven face, big grin (smile+laugh)
const HEMA_OPT={skin:"#C48A62",hair:"#1E1412",shirt:"#283593",saree:{base:"#3949AB",pallu:"#303F9F",border:"#F5F5F5",bw:5,motif:"#9FA8DA"},sleeve:"#283593",fore:"#C48A62",bun:true,lowBun:true,noFlowers:true,earrings:true,earCol:"#CFD8DC",glasses:"#111111",rect:true,brow:5,lash:4,blush:0.2,lip:"#9A3A40"};   // Hema S, ~40: Nikhil's engineering manager (Suresh the TL's boss), indigo handloom saree with a thin white border, rectangular black specs, low bun, silver studs
```
Office: Kiran `{...KIRAN_OPT, badge:["KIRAN M","TOWER B"], pin:true}`, Hema `{...HEMA_OPT, badge:["HEMA S","ENG MANAGER"]}`
(the badge's second line shrinks automatically when it is long). Nikhil/Ananya seated with their TOWER B badges.
Voices in that reel (all Gemini — the ElevenLabs key had 51 credits left, Sarvam none): Gopi=Puck, Nikhil=Charon,
Ananya=Kore, Kiran=Fenrir, Hema=Despina. Kiran is never on ElevenLabs: `profile_for("male","young","cool")` is
andhra-male-young = Nikhil's voice (the bank has one Andhra young male). Hema: profile andhra-female-middle (Seeta).

## Office comedy one-offs: Ramesh + his manager (from "పది నిమిషాల లేట్!", `content/2026-11-20-comedy-ten-minutes-late/2d/world.js`, 20 Nov 2026)
Generic office (not Tower B). `makeAdult()` there adds `messy` (uneven hair tufts), `bald` + `grey` (bald top with a
shine, dark sides with grey temples), `paunch`, `tie`, `belt`, `untucked` (wavy shirt hem), `backpack` (pack behind the
torso + front straps; `st.pack` shows/hides it), `st.spread` (open hands: ten fingers), `st.angry` (red flush),
`st.sweat`, `st.wide` (wide eyes), `st.blank` + `st.twitch` (the DONK face: dot eyes, flat mouth, one eye twitching),
`st.squash`, and the props `mug` (plain white coffee mug, no text/logo; the manager holds it in his LEFT hand, `itemL`)
and `helmet` (dark-grey half-face bike helmet; Ramesh's left hand in Scene 1, on his desk after that).
```js
const RAMESH_OPT={skin:"#B9805A",hair:"#1B1310",shirt:"#9CCBF0",collar:"#84B8E2",button:"#FFFFFF",messy:true,untucked:true,pocket:true,stubble:"#4A3426",brow:6.5,lip:"#7A3A30",blush:0.2};   // Ramesh, late 20s: light-blue shirt (untucked), messy hair, light stubble
const MANAGER_OPT={skin:"#B07850",hair:"#1C1612",grey:"#A7A7A7",bald:true,shirt:"#FAFAFA",collar:"#E3E3E3",tie:"#7B1E2B",paunch:true,belt:true,moustache:"#14100C",thickMo:true,lines:true,brow:7.5,lip:"#6A3028",blush:0.12};   // the manager, ~45: tucked white shirt, maroon tie, thick moustache, bald top + grey temples, paunch
```
Ramesh: `{...RAMESH_OPT, badge:["RAMESH","STAFF"], backpack:"#23262B", legs:{pant:"#3B4252",shoe:"#1A1A1A"}}` walking in;
seated/standing in the cabin without the backpack. Manager standing: `legs:{pant:"#37404A",shoe:"#2B1B12"}`. Neither
character is ever flipped (no mirrored badge text). Colleagues (silent, behind the cabin glass): a woman in a pink
kurta with a bun, a man in a green shirt with glasses, a man in an orange shirt with a moustache.
Voices in that reel (all Gemini; the ElevenLabs key cap had ~51 credits, Sarvam none): Ramesh=Sadachbia, the
manager=Algieba, Gopi=Puck. Profiles if ElevenLabs is back: Ramesh `profile_for("male","young","aggressive")` =
telangana-male-young (Kaka; never the free-plan built-in, which is Gopi's Liam), the manager
`profile_for("male","middle","smooth")` = andhra-male-middle (Sai Datta, warm).
