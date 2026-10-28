# Episode 1 (3D) — "Mass Entry" · Flow prompt pack

Make each **image** first (free in Flow), then turn that image into an 8 s **video** (uses free daily
credits). Paste the full prompt; keep the cast descriptions exactly as in `brand/cast.md`.
Turn **off** dialogue/speech in Flow if offered — Reel Rasam adds Telugu voices, music and subtitles itself.

## Step 0 — character reference images (once; reuse forever)
Make one full-body image per character on a plain light background:
`Full-body character reference sheet of <LOCKED DESCRIPTION>, standing front view, neutral friendly pose, plain light grey background. 3D animated family-movie style, soft cinematic lighting, expressive faces, vibrant colours, high detail, no text, no logos`
Save the five best images — in later scenes add them as **ingredients/reference images**.

## Shots (each: image prompt → video prompt). Location = home location from cast.md.

**Shot 1 — the crime (wide)**
- Image: `Wide shot of the colony playground. Pandu (<Pandu>) grabs a big rainbow lollipop from Pinky (<Pinky>), who looks shocked. <STYLE>`
- Video: `Pandu snatches the lollipop and does a silly victory dance laughing, Pinky's lip trembles and she starts to cry. Static wide camera. Playful.`

**Shot 2 — slow-motion hero entry**
- Image: `Low-angle shot of Chinna (<Chinna>) walking towards the camera, red towel cape flowing, dust and neem leaves swirling, golden sunset backlight, epic hero moment. <STYLE>`
- Video: `Extreme slow motion: Chinna walks forward confidently, cape flapping in the wind, dust and leaves floating, camera slowly pushes in from a low angle. Over-the-top epic.`

**Shot 3 — face-off**
- Image: `Close-up face-off: Chinna (<Chinna>) on the right glaring, Pandu (<Pandu>) on the left nervously holding the lollipop, playground behind. <STYLE>`
- Video: `Chinna slowly pulls the yellow toy sunglasses down over his eyes, Pandu gulps and sweats comically. Camera slowly circles. Dramatic.`

**Shot 4 — the "fight"**
- Image: `Action shot: Chinna (<Chinna>) mid-air doing a cartoonish spinning jump kick near Pandu (<Pandu>) beside the sandbox. <STYLE>`
- Video: `Chinna does a spinning jump kick and misses completely, Pandu ducks, slips on the lollipop wrapper and falls bottom-first into the sandbox; the lollipop flies up and Pinky (<Pinky>) catches it and cheers. Cartoon comedy timing.`

**Shot 5 — the real boss arrives**
- Image: `Lakshmi Amma (<Lakshmi Amma>) standing at the colony gate with the steel ladle raised, angry; Chinna (<Chinna>) frozen in a hero pose in front of her. <STYLE>`
- Video: `Amma taps the ladle on her palm; Chinna freezes, his sunglasses slowly slide down his nose, he gives a scared nervous smile. Comedic pause.`

**Shot 6 — dragged home**
- Image: `Lakshmi Amma (<Lakshmi Amma>) walking away holding Chinna (<Chinna>) by the ear, his cape dragging on the ground, Gopi (<Gopi>) in the foreground looking at the camera. <STYLE>`
- Video: `Amma leads Chinna away by the ear while he protests; Gopi turns to the camera and shrugs with a cheeky smile. Camera static.`

## Send the clips to Reel Rasam
Cloudflare dashboard → R2 → bucket `reelrasam-media` → **Upload** into folder
`incoming/2026-10-29-comedy-mass-entry-3d/` named `shot1.mp4` … `shot6.mp4` (works from a phone browser).
Then tell Claude "clips uploaded" — voices, music, SFX, subtitles and branding are added automatically,
and the reel goes to the Sheet for approval.
