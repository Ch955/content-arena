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
