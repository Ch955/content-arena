# story16x9: 16:9 storybook animation kit (long YouTube stories)

A 1920×1080 version of our 2D engine for 12–15 min stories, first built for "చివరి చెట్టు రహస్యం" (15 Nov 2026).
The cast and sets are our own code drawings in a warm painterly-storybook style: flat shapes, soft linear-gradient
shading and brown outlines. The look and every character's options are in `cast.js` and `sets.js`, so the same
character looks the same in every scene.

| file | what |
|---|---|
| `kit.js` | stage + camera (pan/zoom/rot/shake, parallax), sets/actors lifecycle, lip-sync + auto subtitles from `TL`, speaker chip, title cards, fades, flash, golden glow, torch-light, vignette, rain + light motes (canvas), paper grain |
| `cast.js` | `makePerson` rig + Meera, Chintu, Thatayya, Veerendra, 2 henchmen, 3 villagers; `makeDevata`, `makeDeer`, `makeBird`; props (`makeSeed` glow 0–3, `drawLocket`, axe, torch, bottle, sapling, pot, stick) |
| `sets.js` | `village` (green ↔ dry, regrowth), `banyan` (day/night, glowing leaves, voice-glow, storm, lightning, rainbow), `porch`, `forest`, `cave`, `pond`, `soil` (seed sprouts); `makeSign` (factory blueprint board) |
| `demo.html` | contact-sheet panels (`?view=0..20`) + a 20-s animated demo (`scene(t)`), which also serves as a scene example |
| `sheet.js` | renders every panel to `stills/view-NN.png` and tiles them into `sheet.png` |
| `render.js` | scene page → mp4 (stills, time ranges, parallel `--jobs`, `--join`, audio mux) |

## A scene file
One HTML file per story part (e.g. `content/<post>/2d/part3.html`):
```html
<!doctype html><html><head><meta charset="utf-8"></head><body>
<script src="/home/user/content-arena/tools/anim2d/story16x9/kit.js"></script>
<script src="/home/user/content-arena/tools/anim2d/story16x9/cast.js"></script>
<script src="/home/user/content-arena/tools/anim2d/story16x9/sets.js"></script>
<script src="/home/user/content-arena/tools/anim2d/skins.js"></script>   <!-- optional: setSkin() -->
<script>
KIT.useSkins();                                   // enables setSkin("paper"|"neon"|...); flat by default
const ME = makeMeera(), CH = makeChintu(), TREE_T0 = 0;
function scene(t) {                               // kit.js wraps this as render(t) = begin → scene → end
  const S = KIT.show("banyan", { night: 1, glow: rng(t, 2, 4), voice: KIT.talk("tree", t),
                                 cam: KIT.camPath(t, [[0, {x: 960, y: 480, z: 1}], [6, {x: 880, y: 620, z: 1.4}]]) });
  KIT.put(ME, S, { x: 820, y: 990, s: .6, mood: t < 3 ? "scared" : "awe", lookY: -1, turn: .4 });
  KIT.motes(rng(t, 2, 4), 960, 450, 700);
  KIT.title(pulse(t, .3, 3, .4), "చివరి చెట్టు రహస్యం", "ఒక మాయా చెట్టు కథ");
}
</script></body></html>
```
Rules that keep it fast and safe for parallel rendering:
- Every frame must be a pure function of `t`. `KIT.begin` resets each actor's `st` to its creation defaults, hides
  all sets and actors, and clears the overlays. Don't keep state between frames; use `rng/pulse/ease/KIT.camPath/KIT.walk`.
- Create actors and sets once at load (sets are built lazily on first `KIT.show`). If an actor must appear in two
  sets at the same moment (during a cross-fade), make a second instance (`makeMeera()` again).
- Cross-fade: show both sets, the incoming one last with `opacity: k`. Dip to black: `KIT.fade(k)`. Title cards: `KIT.title(k, main, sub)`.
- Camera: `cam: {x, y, z, rot}` (the world point at screen centre); `shake: px`; `KIT.punch(t, t0)` adds to `z`.
  Layers with p < 1 move less (parallax). `KIT.toScreen(S, x, y)` → screen px (for `KIT.torch` / `KIT.glow`).
- Subtitles come from `TL` automatically (current line; lines longer than ~78 chars are split at phrase breaks and
  timed by length; "…" shows as "..."). The chip uses `KIT.names[who]`; override a frame with `KIT.sub(text, who)`.
  The subtitle box takes the bottom ~150 px, so frame shots with the actors' feet at screen y ≤ ~880.
- Lip-sync: `st.who` (e.g. "meera") makes the mouth follow `TL` automatically. The tree speaks by passing
  `voice: KIT.talk("tree", t)` to the banyan; the Devata is `makeDevata()` with who `devata`. `KIT.tlOffset` lets a scene
  start at TL time > 0 (or use `render.js --offset`).
- Avoid SVG filters except brief glow moments (the overlays are CSS gradients, which are cheap). The paper skin is fine (~0.23 s/frame).

### Actor state (`actor.st`)
People: `x, y` (feet), `s`, `flip` (±1), `turn` (−1..1, a 3/4 face turn), `lean`, `vis`, `hop`,
`mood` (neutral | happy | sad | scared | angry | awe | smug), `talk` (auto), `blink` (auto), `look/lookY`, `headRot`,
`tear`, `tearRun` (0..1 a drop runs), `pose` (stand | walk | run | kneel | sit (+`seat` px) | point | armsUp | spread |
cower | hold | reach | think | handsHips | wave | carry), `pose2` + `poseK` (blend), `phase` (walk cycle; `KIT.walk`
sets x/flip/pose/phase), `hL/hR` ([dx,dy] hand offset from the shoulder), `item/itemL` (stick | axe | torch | bottle |
seed | locket | sapling | pot), `itemRot`, `glow` (the held seed's glow 0–3), `locket` (Meera wears it; false after the sacrifice).
Sizes at s = 1: kids ~430 px tall, adults ~570 px. In wide shots use s ≈ .55–.7, in medium shots .9–1.2.
Devata: `x, y, s, glow, mood` (neutral | happy | sad | stern | closed), `arms` (open | down | reach | bless). She floats and sways by herself.
Deer: `pose` stand | struggle | run | lie | nuzzle, `mood` calm | scared, `phase`. Bird: `pose` stand | fly | tired | drink | hop.

### Set parameters (`KIT.show(name, {...})`)
- `village`: `green` 0 dry present … 1 green past, `trees`, `sprouts`, `pond`, `birds`, `rainbow`, `sunset`, `banyanGlow`
- `banyan`: `night`, `glow` (gold leaves), `voice` (heart glow + ripples), `storm`, `lightning`, `wind`, `green`, `rainbow`
- `porch`: `evening` (lantern + warm light), `dry` · `forest`: `dusk`, `green`, `cave` · `cave`: `thorns` (1 tangled → 0 freed), `shakeThorns`, `eyes`, `light`
- `pond`: `water` (fills from the centre), `green`, `heat` · `soil`: `sprout`, `wet`, `seedGlow` 0–3, `seedY`
Rain is a screen overlay (`KIT.rain(k, angle)`); a storm is `banyan` + `storm` + `lightning` + `KIT.flash` + `shake`.

## Rendering
```bash
cd tools/anim2d/story16x9
node sheet.js                                                    # contact sheet → sheet.png (+ stills/view-NN.png)
node render.js part3.html --tl timeline.json --stills 2,9.5,31   # check stills first (prints ms per still)
node render.js part3.html --tl timeline.json --jobs 4 --out part3.mp4                 # video only, 4 workers
node render.js part3.html --tl timeline.json --dur 95.4 --jobs 4 --audio mix.wav --out part3.mp4
node render.js part3.html --tl timeline.json --from 60 --to 120 --out p3b.mp4         # one range (e.g. another machine)
node render.js --join story.mp4 part1.mp4 part2.mp4 part3.mp4 --audio story_mix.wav    # concat parts (+ audio)
```
`timeline.json` uses the voices.py format (`{fps, dur, lines:[{who, text, start, dur, env}]}`, where env is the 30-fps
loudness). Without `--dur`, the length is `TL.dur`. Parts are encoded with the same settings, so `--join` copies
the streams (no re-encode).

Measured on this machine (4 cores), 1920×1080, frame + JPEG capture: flat ~0.09–0.15 s/frame, night glow + motes
~0.14, paper skin ~0.23. With `--jobs 4`, 600 frames took 41 s wall (≈0.07 s/frame effective), so a 15-min story
(27,000 frames) takes ≈ 30–35 min on 4 cores.
