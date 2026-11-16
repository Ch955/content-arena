// Shared helpers for scenes 7–9 of "చివరి చెట్టు రహస్యం" (Editor, 15 Nov 2026). Load after kit.js, cast.js, sets.js, ../scene4/lib456.js.
// lib456.js gives makeThing/pair/castPair/runShots/keys/tint/makeLightColumn/makeTreeEyes/makeSeedMeter/makeBoat/makeChirps.
// scene1/world.js can't be loaded on the same page (it also declares makeJeep), so the few world.js pieces we need are copied
// here VERBATIM (Veerendra with the chin scar, makeKid, the swing, lotus): keep them in sync if world.js changes.
"use strict";

// ---------------- copied verbatim from scene1/world.js ----------------
const _WR = new Map();
function putWrapped(a, S, o, transform) { S = KIT.get(S); KIT.put(a, S, o); const key = a.name + "|" + S.name + "|" + (a.st.seed || 0);
  let w = _WR.get(key); if (!w) { w = el("g", {}, null); _WR.set(key, w); }
  w.setAttribute("transform", transform); S.actors.appendChild(w); w.appendChild(a.g); return a; }
const makeVeerendraS = () => makeVeerendra({ drawHead(a) { VEERENDRA_OPT.drawHead(a); const ry = a.B.ry;   // a small scar on the chin (rewatch clue for scene 8)
  el("path", { d: `M10 ${ry * .8} l12 9`, stroke: "#E7B89A", "stroke-width": 3.2, "stroke-linecap": "round", fill: "none" }, a.face);
  el("path", { d: `M13 ${ry * .79} l-2 6 M18 ${ry * .83} l-2 6`, stroke: "#C98A6A", "stroke-width": 1.6, "stroke-linecap": "round", fill: "none" }, a.face); } });
const makeKid = (n) => makePerson({ ...CHINTU_OPT, name: "kid" + n, who: null, drawTop: undefined,
  top: { c: ["#3A7AD9", "#E8902E", "#8A4AB8"][n % 3], sleeve: ["#3A7AD9", "#E8902E", "#8A4AB8"][n % 3] }, bottom: { type: "shorts", c: ["#5A5A6A", "#3E7A5A", "#A8845A"][n % 3] }, skin: ["#B07A50", "#A86E46", "#C08A5E"][n % 3] });
function drawLotus(g, n = 7, seed = 0) { for (let i = 0; i < n; i++) { const x = (hash(i + seed) - .5) * 360, y = (hash(i * 2 + seed) - .5) * 50, s = .7 + hash(i * 3 + seed) * .5;
    const pg = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, g);
    el("path", { d: "M0 0 m-30 0 a30 11 0 1 0 60 0 a30 11 0 1 0 -60 0 M0 0 L28 -4", fill: "#4E9A44", stroke: "#2E5A2A", "stroke-width": 2 }, pg);
    if (i % 2 === 0) { const f = el("g", { transform: "translate(4 -6)" }, pg);
      [-30, -12, 12, 30, 0].forEach(a => el("path", { d: "M0 0 Q-9 -14 0 -30 Q9 -14 0 0 Z", fill: a ? "#F7A8C0" : "#FFD0DC", stroke: "#B8466A", "stroke-width": 1.5, transform: `rotate(${a})` }, f)); } } }
const makeSwing = (len = 360) => makeThing(g => { el("line", { x1: -34, y1: 0, x2: -34, y2: len, stroke: "#C9A46A", "stroke-width": 5 }, g);
  el("line", { x1: 34, y1: 0, x2: 34, y2: len, stroke: "#C9A46A", "stroke-width": 5 }, g);
  el("rect", { x: -50, y: len - 6, width: 100, height: 16, rx: 5, fill: "#8A5A30", stroke: INK, "stroke-width": 3 }, g); });

// ---------------- cast variants (scenes 7–9) ----------------
// the scar exactly as makeVeerendraS draws it
function drawScar(face, ry) {
  el("path", { d: `M10 ${ry * .8} l12 9`, stroke: "#E7B89A", "stroke-width": 3.2, "stroke-linecap": "round", fill: "none" }, face);
  el("path", { d: `M13 ${ry * .79} l-2 6 M18 ${ry * .83} l-2 6`, stroke: "#C98A6A", "stroke-width": 1.6, "stroke-linecap": "round", fill: "none" }, face);
}
// Veerendra (cast-sheet suit + chin scar) whose pushed-up sunglasses can fall off: st.noGlasses = 1 hides them.
// kurta: true = scene 9's humble look (plain cream kurta, sleeves rolled, no gold chain, no sunglasses) — the scar stays.
function makeVeerendraX(kurta = false) {
  let glasses = [];
  const K = kurta ? { top: { c: "#EFE6D2", sleeve: "#EFE6D2" }, bottom: { type: "trousers", c: "#5E5446" }, sleeveFull: false, sleeveLen: .5, cuff: null,
    drawTop(p, { S, tw, ww }) { el("path", { d: `M-16 ${S - 6} L0 ${S + 20} L16 ${S - 6}`, fill: "#B57A52", stroke: INK, "stroke-width": 3 }, p);
      el("line", { x1: 0, y1: S + 20, x2: 0, y2: S + 110, stroke: "#C9BC9E", "stroke-width": 3 }, p);
      [S + 40, S + 66, S + 92].forEach(y => el("circle", { cx: 0, cy: y, r: 3.5, fill: "#D9CFB4", stroke: "#A89F8A", "stroke-width": 1 }, p));
      el("path", { d: `M${-tw} ${S + 150} Q0 ${S + 166} ${tw} ${S + 150}`, stroke: "#C9BC9E", "stroke-width": 3, fill: "none", opacity: .7 }, p);
      el("path", { d: `M${-ww - 2} -8 Q0 6 ${ww + 2} -8`, stroke: "#8A7A5E", "stroke-width": 2, fill: "none", opacity: .5 }, p); } } : {};
  const a = makeVeerendra({ ...K, drawHead(h) { const n0 = h.top.childNodes.length; VEERENDRA_OPT.drawHead(h); glasses = [...h.top.childNodes].slice(n0);
      if (kurta) glasses.forEach(x => x.remove()); drawScar(h.face, h.B.ry); },
    onDraw(t, k) { glasses.forEach(x => x.style.opacity = k.noGlasses ? 0 : 1); } });
  a.st.noGlasses = 0; a.defaults.noGlasses = 0; return a;
}
// young Veerendra (about 8) for the paper flashback: the purple-shirt boy (as on the scene-1 swing), his skin, and the same chin scar
const makeYoungVeerendra = () => makePerson({ ...CHINTU_OPT, name: "youngV", who: null, drawTop: undefined, skin: "#B57A52", belly: 6,
  B: { ...CHINTU_OPT.B, rx: 56, ry: 58 }, top: { c: "#8A4AB8", sleeve: "#8A4AB8" }, bottom: { type: "shorts", c: "#A8845A" },
  drawHead(h) { CHINTU_OPT.drawHead(h); const ry = h.B.ry; el("path", { d: `M10 ${ry * .74} l13 9`, stroke: "#E7B89A", "stroke-width": 3.4, "stroke-linecap": "round", fill: "none" }, h.face);
    el("path", { d: `M13 ${ry * .73} l-2 6 M18 ${ry * .77} l-2 6`, stroke: "#C98A6A", "stroke-width": 1.6, "stroke-linecap": "round", fill: "none" }, h.face); } });

// ---------------- held props ----------------
PROPS.saw = (p) => { el("path", { d: "M0 0 L150 -10 L150 18 L0 24 Z", fill: KIT.lgrad([[0, "#E6EAEE"], [1, "#8A949E"]]), stroke: INK, "stroke-width": 3 }, p);   // from world.js
  for (let i = 0; i < 14; i++) el("path", { d: `M${8 + i * 10} ${23 - i * .45} l5 8 l5 -8`, fill: "#C9D0D8", stroke: INK, "stroke-width": 1.2 }, p);
  el("rect", { x: -26, y: -8, width: 30, height: 36, rx: 8, fill: "#8A5A30", stroke: INK, "stroke-width": 3 }, p); };
PROPS.rope = p => { for (let i = 0; i < 4; i++) el("ellipse", { cx: 0, cy: 34, rx: 30 - i * 2, ry: 40 - i * 3, fill: "none", stroke: i % 2 ? "#C9A46A" : "#A8844A", "stroke-width": 6 }, p); };
PROPS.spade = p => { const g = el("g", {}, p);   // a village spade (pāra): handle down from the hand, blade at the bottom
  el("rect", { x: -6, y: -40, width: 12, height: 200, rx: 5, fill: KIT.lgrad([[0, "#B8844C"], [1, "#7A5028"]], 0, 0, 1, 0), stroke: INK, "stroke-width": 3 }, g);
  el("path", { d: "M-34 150 L34 150 L30 214 Q0 232 -30 214 Z", fill: KIT.lgrad([[0, "#D8DEE4"], [1, "#7E8894"]], 0, 0, 1, 1), stroke: INK, "stroke-width": 3.5 }, g);
  el("path", { d: "M-24 170 Q0 176 24 170", stroke: "#fff", "stroke-width": 2.5, fill: "none", opacity: .6 }, g); };
PROPS.saplingPot = p => { const g = el("g", { transform: "translate(0 10)" }, p);   // a sapling in a small black nursery bag
  el("path", { d: "M-24 -6 L24 -6 L20 40 Q0 48 -20 40 Z", fill: "#2E2A2A", stroke: INK, "stroke-width": 3 }, g);
  const s = makeSapling(el("g", { transform: "translate(0 -4)" }, g), .9); s.set(1); };
PROPS.leafGlow = p => { el("circle", { r: 34, fill: KIT.rgrad([[0, "#FFF2B8", .9], [1, "#FFD867", 0]]) }, p);
  el("path", { d: "M0 0 Q12 -16 0 -40 Q-12 -16 0 0 Z", fill: "#8AD060", stroke: "#2E6A3A", "stroke-width": 2, transform: "rotate(60)" }, p); };

// ---------------- things ----------------
// factory blueprint board on two posts (sets.js makeSign); st.tilt
function makeSignProp() { return makeThing(g => ({ s: makeSign(g, 0, 0, 1) }), (t, st, P) => {}); }
// the locket lying on the roots (as placed in scene 6), st.glint 0..1 (a silver sparkle)
function makeLocketGround() {
  return makeThing(g => { el("path", { d: "M-6 -14 Q-40 -10 -44 8 Q-30 22 0 14 M6 -14 Q40 -6 46 10 Q30 24 4 16", fill: "none", stroke: "#D9DEE6", "stroke-width": 2.5 }, g); drawLocket(g, 1.15);
    return { sp: el("path", { d: "M0 -26 L4 -4 L26 0 L4 4 L0 26 L-4 4 L-26 0 L-4 -4 Z", fill: "#FFFFFF", transform: "translate(-8 -10)" }, g) }; },
    (t, st, P) => { const k = st.glint * (.5 + .5 * Math.sin(t * 3.1)); P.sp.style.opacity = k; P.sp.setAttribute("transform", `translate(-8 -10) scale(${.4 + .6 * k}) rotate(${t * 30})`); }, { glint: 0 });
}
// an axe falling out of a hand: from (x0,y0) to the ground y1 between t0 and t0+d, spinning; a dust puff on landing
function makeAxeFall(prop = "axe") {
  return makeThing(g => { const a = el("g", {}, g); PROPS[prop](a); const d = [0, 1, 2, 3, 4].map(() => el("circle", { r: 10, fill: "#C9B08A" }, g)); return { a, d }; },
    (t, st, P) => { const k = rng(t, st.t0, st.t0 + st.d), y = lerp(st.y0, st.y1, k * k), rot = lerp(st.r0, st.r1, k);
      P.a.setAttribute("transform", `translate(${lerp(st.x0, st.x1, k)} ${y}) rotate(${rot})`);
      P.d.forEach((c, i) => { const ph = (t - st.t0 - st.d - i * .05) / .9; c.style.opacity = ph > 0 && ph < 1 ? (1 - ph) * .75 : 0;
        c.setAttribute("cx", st.x1 + (i - 2) * 22 * (1 + ph * 2)); c.setAttribute("cy", st.y1 + 30 - ph * 34); c.setAttribute("r", 9 + clamp(ph) * 18); }); },
    { t0: 1e9, d: .9, x0: 0, y0: 0, x1: 0, y1: 0, r0: 0, r1: 95 });
}
// dust puffs along the ground (ground shaking / jeeps braking): st.k, st.w (width), st.seed
function makeDustRow(n = 12) {
  return makeThing(g => ({ c: [...Array(n)].map((_, i) => el("circle", { r: 12, fill: i % 2 ? "#CDB48C" : "#B89C74" }, g)) }),
    (t, st, P) => P.c.forEach((c, i) => { const ph = fract(t * (.7 + hash(i) * .5) + hash(i * 3 + st.seed)); c.setAttribute("cx", (hash(i * 7 + st.seed) - .5) * st.w + ph * 60 * st.dir);
      c.setAttribute("cy", -ph * 60 * (.5 + hash(i * 5))); c.setAttribute("r", 10 + ph * 34); c.style.opacity = st.k * Math.sin(ph * Math.PI) * .7; }), { k: 0, w: 600, seed: 0, dir: 1 });
}
// comic shake lines beside a figure's knees: st.k
function makeShakeLines() {
  return makeThing(g => ({ L: [-1, 1].map(s => el("path", { d: `M${s * 52} -150 q${s * 14} 22 0 44 M${s * 70} -146 q${s * 16} 22 0 40`, fill: "none", stroke: "#3A2418", "stroke-width": 4, "stroke-linecap": "round" }, g)) }),
    (t, st, P) => P.L.forEach((l, i) => { l.style.opacity = st.k * (fract(t * 7 + i * .5) < .6 ? 1 : .2); l.setAttribute("transform", `translate(${Math.sin(t * 40 + i) * 3} 0)`); }), { k: 0 });
}
// a whirlwind of dry leaves + dust streaks around a point (x,y = its base): st.k (strength), st.tf (time the wind freezes:
// the leaves hang in the air), st.fall (0..1: after the freeze they drift down), st.rx/ry (size)
function makeSwirl(n = 34) {
  return makeThing(g => { const P = { s: [], l: [] };
    for (let i = 0; i < 7; i++) P.s.push(el("path", { fill: "none", stroke: i % 2 ? "#E8D8B4" : "#D2BC92", "stroke-width": 7 - i % 3 * 2, "stroke-linecap": "round", opacity: .6 }, g));
    for (let i = 0; i < n; i++) P.l.push(el("path", { d: "M0 0 Q9 -12 0 -26 Q-9 -12 0 0 Z", fill: ["#C9A24A", "#A8742E", "#D9B85A", "#8A6A2A", "#7FAF4A"][i % 5], stroke: "#5A3A1A", "stroke-width": 1.5 }, g));
    return P; }, (t, st, P) => { const te = Math.min(t, st.tf), fr = t > st.tf ? 1 : 0, k = st.k;
    P.s.forEach((s, i) => { const a0 = te * (3.2 + i * .3) + i * .9, h = -40 - i * 70, r = st.rx * (.5 + i * .08); let d = "";
      for (let j = 0; j <= 10; j++) { const a = a0 + j * .22; d += (j ? " L" : "M") + (Math.cos(a) * r).toFixed(1) + " " + (h + Math.sin(a) * st.ry * .35 - j * 3).toFixed(1); }
      s.setAttribute("d", d); s.style.opacity = k * .55 * (1 - fr); });
    P.l.forEach((l, i) => { const a = te * (2.6 + hash(i) * 1.6) + hash(i * 3) * 6.28, h = -30 - hash(i * 5) * 520, r = st.rx * (.35 + .75 * hash(i * 7)) * (1 - h / 1400);
      const fy = st.fall * (-h + 20) * (.7 + .3 * hash(i)), fx = st.fall * Math.sin(t * 1.5 + i) * 40;
      l.setAttribute("transform", `translate(${Math.cos(a) * r + fx} ${h + Math.sin(a) * st.ry * .3 + fy}) rotate(${te * 300 * (hash(i) - .5) + (fr ? Math.sin(t * 2 + i) * 40 : 0)}) scale(${.9 + hash(i * 9) * .8})`);
      l.style.opacity = k * (fr && st.fall > .9 ? 1 - (st.fall - .9) * 10 : 1); }); }, { k: 0, tf: 1e9, fall: 0, rx: 260, ry: 120 });
}
// memory images swirling around a point: translucent trees of the lost forest (st.trees) and fleeing deer + birds (st.animals)
function makeGhosts() {
  return makeThing(g => { const P = { tr: [], an: [] };
    for (let i = 0; i < 7; i++) { const tg = el("g", {}, g); const r = roundTree(tg, 0, 0, 1.1 + hash(i) * .6, "#BFF0B8", "#9AD89A", "#D8F2D0"); P.tr.push(tg); }
    const deerD = "M-60 -60 Q-20 -76 30 -66 L52 -110 L60 -104 L48 -60 Q66 -50 60 -40 L40 -44 L40 0 L30 0 L26 -36 L-30 -38 L-40 0 L-50 0 L-46 -44 Q-70 -46 -60 -60 Z";
    for (let i = 0; i < 5; i++) { const ag = el("g", {}, g); if (i < 3) el("path", { d: deerD, fill: "#E8FFF0" }, ag);
      else for (let j = 0; j < 4; j++) el("path", { d: `M${j * 40 - 60} ${j % 2 * 20} q12 -14 24 0 q12 -14 24 0`, fill: "none", stroke: "#E8FFF0", "stroke-width": 5, "stroke-linecap": "round" }, ag); P.an.push(ag); }
    return P; }, (t, st, P) => { P.tr.forEach((tg, i) => { const a = t * .5 + i / 7 * 6.283, x = Math.cos(a) * st.rx, y = Math.sin(a) * st.ry - 180, front = Math.sin(a);
      tg.setAttribute("transform", `translate(${x} ${y + 120}) scale(${(.75 + .25 * front) * st.ts})`); tg.style.opacity = st.trees * (.28 + .2 * (front + 1) / 2); });
    P.an.forEach((ag, i) => { const a = -t * .9 + i / 5 * 6.283, x = Math.cos(a) * st.rx * 1.1, y = Math.sin(a) * st.ry * .8 - (i < 3 ? 60 : 380), dir = -Math.sin(a) >= 0 ? 1 : -1;
      ag.setAttribute("transform", `translate(${x} ${y}) scale(${dir * 1.1} 1.1)`); ag.style.opacity = st.animals * (.35 + .2 * Math.cos(a * 2)); }); },
    { trees: 0, animals: 0, rx: 520, ry: 160, ts: 1 });
}
// a travelling orb of light (st.k) with a short trail; position via x,y
function makeOrb(r = 40, color = "#FFF2B8") {
  return makeThing(g => ({ h: el("circle", { r: r * 3, fill: KIT.rgrad([[0, color, .8], [.35, "#FFD867", .3], [1, "#FFD867", 0]]) }, g), c: el("circle", { r: r * .45, fill: "#FFFFFF" }, g) }),
    (t, st, P) => { const p = .9 + .1 * Math.sin(t * 9); P.h.style.opacity = st.k * p; P.c.style.opacity = st.k; P.h.setAttribute("r", r * 3 * p); }, { k: 0 });
}
// a raindrop falling from height h onto (0,0) at time st.t0 (slow motion factor st.sm): drop -> splash crown -> dust puff + dark spot
function makeRaindrop() {
  return makeThing(g => { const P = {};
    P.spot = el("ellipse", { cx: 0, cy: 4, rx: 70, ry: 18, fill: "#5A3A22", opacity: 0 }, g);
    P.dust = [...Array(8)].map(() => el("circle", { r: 10, fill: "#D8BC90" }, g));
    P.crown = [...Array(9)].map(() => el("circle", { r: 7, fill: "#CFE8FA", stroke: "#5A8AB8", "stroke-width": 2 }, g));
    P.ring = el("ellipse", { cx: 0, cy: 0, rx: 10, ry: 3, fill: "none", stroke: "#CFE8FA", "stroke-width": 4 }, g);
    P.drop = el("path", { d: "M0 -60 Q26 -14 22 6 Q16 30 0 30 Q-16 30 -22 6 Q-26 -14 0 -60 Z", fill: KIT.lgrad([[0, "#EAF6FF"], [1, "#7FB8E6"]], 0, 0, 1, 1), stroke: "#4A7AA8", "stroke-width": 3 }, g);
    P.hl = el("ellipse", { cx: -8, cy: -4, rx: 5, ry: 10, fill: "#fff", opacity: .8 }, g); return P; },
    (t, st, P) => { const k = rng(t, st.t0 - st.fall, st.t0), y = -st.h * (1 - k), on = t < st.t0 && t > st.t0 - st.fall;
      [P.drop, P.hl].forEach(e => { e.setAttribute("transform", `translate(0 ${y - 30})`); e.style.opacity = on ? 1 : 0; });
      const ph = (t - st.t0) / .9;
      P.crown.forEach((c, i) => { const a = Math.PI * (i / 8), q = clamp(ph); c.setAttribute("cx", Math.cos(a) * 30 * (1 + q * 3) * (i % 2 ? 1 : .8)); c.setAttribute("cy", -Math.sin(a) * 70 * Math.sin(q * Math.PI) * (.6 + hash(i) * .6));
        c.style.opacity = ph > 0 && ph < 1 ? 1 - q : 0; });
      P.ring.setAttribute("rx", 10 + clamp(ph) * 120); P.ring.setAttribute("ry", 3 + clamp(ph) * 26); P.ring.style.opacity = ph > 0 && ph < 1 ? (1 - ph) : 0;
      P.dust.forEach((c, i) => { const q = (t - st.t0 - i * .03) / 1.4; c.setAttribute("cx", (i - 3.5) * 16 * (1 + clamp(q) * 3)); c.setAttribute("cy", -clamp(q) * 50 * (.5 + hash(i)));
        c.setAttribute("r", 8 + clamp(q) * 22); c.style.opacity = q > 0 && q < 1 ? (1 - q) * .7 : 0; });
      P.spot.style.opacity = t > st.t0 ? .55 * clamp((t - st.t0) / .5) : 0; P.spot.setAttribute("rx", 30 + 50 * clamp((t - st.t0) / .8)); },
    { t0: 1e9, h: 700, fall: .9 });
}
// a growing young tree (planting / seasons): st.k 0..1, st.c (0 sapling green .. 1 full)
function makeYoungTree(seed = 0) {
  return makeThing(g => { const inner = el("g", {}, g); roundTree(inner, 0, 0, 1, ["#5FA85A", "#6DB052", "#4E9446"][seed % 3], ["#3E8A48", "#4E9A44", "#3A7A3C"][seed % 3]); return { inner }; },
    (t, st, P) => { const k = clamp(st.k); P.inner.setAttribute("transform", `scale(${k}) rotate(${Math.sin(t * 1.2 + seed) * 1.5 * k})`); P.inner.style.opacity = k > .01 ? 1 : 0; }, { k: 0 });
}
function makeSaplingProp(s = 1) { return makeThing(g => ({ sp: makeSapling(g, s) }), (t, st, P) => { P.sp.set(clamp(st.k)); P.sp.g.setAttribute("transform", `scale(${s}) rotate(${Math.sin(t * 1.6) * 3 * st.k})`); }, { k: 0 }); }
// a little wooden name stake for the sapling: "అమ్మ" (painted)
function makeNameStake() {
  return makeThing(g => { el("rect", { x: -7, y: -150, width: 14, height: 150, rx: 3, fill: "#9A6A3A", stroke: INK, "stroke-width": 3 }, g);
    el("rect", { x: -78, y: -214, width: 156, height: 74, rx: 12, fill: KIT.lgrad([[0, "#E8C48A"], [1, "#C99A5A"]]), stroke: INK, "stroke-width": 4 }, g);
    el("path", { d: "M-62 -200 q20 -4 40 0 M20 -158 q20 4 40 0", stroke: "#A87A44", "stroke-width": 2, fill: "none", opacity: .7 }, g);
    txt("అమ్మ", { x: 0, y: -162, "text-anchor": "middle", "font-family": "Rama, NotoTe", "font-size": 46, fill: "#5A2A12" }, g);
    el("path", { d: "M54 -206 q10 -14 22 -4 q-6 14 -22 4 Z", fill: "#7BC04A", stroke: "#2E5A2A", "stroke-width": 1.5 }, g); return {}; });
}
// hand-drawn music notes (birds singing): k
function makeNotes() {
  return makeThing(g => ({ n: [0, 1, 2, 3].map(i => el("path", { d: i % 2 ? "M0 0 L0 -26 L14 -30 L14 -6 M0 0 a6 5 0 1 1 -1 0 M14 -6 a6 5 0 1 1 -1 0" : "M0 0 L0 -26 Q8 -22 12 -14 M0 0 a6 5 0 1 1 -1 0", fill: "none", stroke: "#3A2418", "stroke-width": 3.5, "stroke-linecap": "round" }, g)) }),
    (t, st, P) => P.n.forEach((n, i) => { const ph = fract(t * .6 + i / 4); n.setAttribute("transform", `translate(${i * 26 + Math.sin(t * 3 + i) * 8} ${-ph * 90})`); n.style.opacity = st.k * Math.sin(ph * Math.PI); }), { k: 0 });
}
// copy of world.js's side-view jeep (renamed: lib456 has its own far-away makeJeep), plus a headlight beam (st.beam)
function makeJeepSide() {
  return makeThing(g => { const P = {};
    P.beam = el("path", { d: "M206 -106 L900 -230 L900 60 Z", fill: KIT.lgrad([[0, "#FFF6C8", .7], [1, "#FFF6C8", 0]], 0, 0, 1, 0) }, g);
    el("ellipse", { cx: 0, cy: 6, rx: 230, ry: 16, fill: "#1a0e06", opacity: .25 }, g);
    const body = el("g", {}, g); P.body = body;
    el("path", { d: "M-210 -40 L-210 -120 Q-206 -134 -190 -136 L60 -136 L110 -200 Q118 -210 132 -210 L150 -210 L150 -136 L196 -132 Q214 -128 214 -110 L214 -40 Z", fill: KIT.lgrad([[0, "#F4F6F4"], [.6, "#D6DCDA"], [1, "#9AA4A2"]]), stroke: INK, "stroke-width": 4, "stroke-linejoin": "round" }, body);
    el("path", { d: "M-180 -200 L60 -200 L60 -136 L-180 -136 Z", fill: "#3A4A3E", stroke: INK, "stroke-width": 4 }, body);
    el("path", { d: "M-160 -190 L-60 -190 L-60 -146 L-160 -146 Z M-40 -190 L44 -190 L44 -146 L-40 -146 Z", fill: "#9AC8DA", stroke: INK, "stroke-width": 3 }, body);
    el("path", { d: "M70 -140 L114 -196 L140 -196 L140 -140 Z", fill: "#9AC8DA", stroke: INK, "stroke-width": 3 }, body);
    el("rect", { x: -214, y: -70, width: 430, height: 12, fill: "#C9A440", stroke: INK, "stroke-width": 2 }, body);
    P.lamp = el("rect", { x: 196, y: -116, width: 22, height: 20, rx: 4, fill: "#FFF6C8", stroke: INK, "stroke-width": 2.5 }, body);
    el("rect", { x: 200, y: -60, width: 30, height: 18, rx: 4, fill: "#B8BEC4", stroke: INK, "stroke-width": 2.5 }, body);
    P.door = el("path", { d: "M-40 -134 L60 -134 L60 -46 L-40 -46 Z", fill: "#E6EAE8", stroke: INK, "stroke-width": 3 }, body);
    el("path", { d: "M-150 -120 Q-60 -128 40 -120", stroke: "#fff", "stroke-width": 6, fill: "none", opacity: .7, "stroke-linecap": "round" }, body);
    P.wheels = [-130, 130].map(x => { const w = el("g", { transform: `translate(${x} -30)` }, g);
      el("circle", { r: 46, fill: "#222", stroke: INK, "stroke-width": 4 }, w); const hub = el("g", {}, w);
      el("circle", { r: 22, fill: "#B8BEC4", stroke: INK, "stroke-width": 3 }, hub); for (let i = 0; i < 5; i++) el("circle", { cx: Math.cos(i * 1.256) * 13, cy: Math.sin(i * 1.256) * 13, r: 3.2, fill: "#555" }, hub);
      el("rect", { x: -3, y: -44, width: 6, height: 12, fill: "#555" }, hub); return hub; });
    P.dust = [...Array(14)].map(() => el("circle", { fill: "#D9C29A", stroke: "#A8906A", "stroke-width": 2 }, g));
    P.dust.forEach(d => g.insertBefore(d, g.firstChild)); g.insertBefore(P.beam, g.firstChild);
    return P; }, (t, st, P) => { P.wheels.forEach(h => h.setAttribute("transform", `rotate(${st.k * 1.25})`));
    P.body.setAttribute("transform", `translate(0 ${Math.sin(t * 17) * 1.5 * clamp(st.speed || 0)}) rotate(${st.tilt || 0} 0 -40)`);
    P.door.setAttribute("transform", `translate(-40 0) scale(${1 - .85 * clamp(st.k2)} 1) translate(40 0)`);
    P.beam.style.opacity = st.beam * (.85 + .15 * Math.sin(t * 13)); P.lamp.setAttribute("fill", st.beam > .1 ? "#FFFFF0" : "#FFF6C8");
    const dk = clamp(st.dust || 0);
    P.dust.forEach((d, i) => { const ph = fract(t * .9 + hash(i)); const x = -220 - ph * 260 + (hash(i * 3) - .5) * 60, y = -20 - ph * 90 - hash(i * 5) * 30;
      d.setAttribute("cx", x); d.setAttribute("cy", y); d.setAttribute("r", 14 + ph * 40); d.style.opacity = dk * (1 - ph) * .8; }); }, { k: 0, k2: 0, speed: 0, dust: 0, beam: 0, tilt: 0 });
}

// ---------------- banyan additions: a dusk sky (orange → violet) that the storm can cover ----------------
const DUSK = (() => { const B = KIT.get("banyan"), L0 = B.layers[0].g;
  const g = el("g", {}, null); L0.insertBefore(g, L0.children[1]);
  el("rect", { x: -1400, y: -900, width: 4720, height: 2600, fill: KIT.lgrad([[0, "#2E2450"], [.3, "#6A3E6A"], [.55, "#C8645A"], [.75, "#F09858"], [1, "#FFC88A"]]) }, g);
  el("circle", { cx: 1500, cy: 840, r: 300, fill: "#FFD08A", opacity: .25 }, g);
  const tint = B.layers.find(l => l.name === "tint").g.firstChild;
  return { g, tint }; })();
function dusk(k) { DUSK.g.style.opacity = k; }

// ---------------- screen-space overlay (moral card, CTA, end card) ----------------
const OV = (() => {
  const css = document.createElement("style"); css.textContent = `
#ov789{position:absolute;inset:0;pointer-events:none}
#ov789 .o{position:absolute;opacity:0}
#ov-moral{left:50%;top:110px;transform:translateX(-50%);width:max-content;max-width:1560px;text-align:center;background:rgba(30,18,6,.32);border-radius:40px;padding:14px 60px 22px !important;font-family:Rama,NotoTe;font-size:66px;line-height:1.45;color:#FFF6D8;padding:0 170px;
  text-shadow:0 4px 0 #3A2208,0 0 26px rgba(40,20,0,.75),0 0 60px rgba(255,200,80,.35)}
#ov-badges{left:0;right:0;top:150px;display:flex;justify-content:center;gap:70px}
.bd{width:250px;text-align:center}
.bd .ic{width:170px;height:170px;margin:0 auto;border-radius:50%;background:radial-gradient(circle,#FFF6D0 0%,#FFD867 55%,#E8A830 100%);border:7px solid #5A3612;
  box-shadow:0 8px 0 rgba(0,0,0,.35),0 0 50px rgba(255,210,100,.7);display:flex;align-items:center;justify-content:center}
.bd .lb{margin-top:16px;font-family:Rama,NotoTe;font-size:58px;color:#FFF6D8;text-shadow:0 4px 0 #3A2208,0 0 18px rgba(0,0,0,.7)}
#ov-q{left:50%;top:470px;transform:translateX(-50%);display:flex;align-items:center;gap:26px;background:#FFFDF6;border:6px solid #3A2418;border-radius:46px;padding:18px 44px 24px 30px;
  box-shadow:0 10px 0 rgba(0,0,0,.35);font-family:Rama,NotoTe;font-size:54px;color:#3A2418;white-space:nowrap}
#ov-sub{left:50%;top:640px;transform:translateX(-50%);display:flex;align-items:center;gap:22px;padding:18px 46px 20px 34px;border-radius:22px;background:#E62117;color:#fff;
  font-family:InterB,Anton;font-weight:800;font-size:52px;letter-spacing:1px;box-shadow:0 10px 0 rgba(0,0,0,.35);white-space:nowrap}
#ov-hand{left:0;top:0}
#ov-end{inset:0;display:block}
#ov-end .ttl{position:absolute;left:110px;top:150px;width:900px;font-family:Rama,NotoTe;font-size:104px;line-height:1.25;color:#FFD877;-webkit-text-stroke:9px #3A2208;paint-order:stroke fill;
  text-shadow:0 7px 0 #2A1604,0 0 36px rgba(255,190,60,.5)}
#ov-end .en{position:absolute;left:116px;top:300px;font-family:InterB,Anton;font-weight:800;font-size:44px;color:#FFF6E0;letter-spacing:1px;text-shadow:0 3px 0 #2A1604,0 0 14px rgba(0,0,0,.8)}
#ov-end .brand{position:absolute;left:116px;top:400px;display:flex;align-items:center;gap:22px;font-family:Anton;font-size:64px;letter-spacing:4px;color:#fff;text-shadow:0 4px 0 #2A1604}
#ov-end .subs{position:absolute;left:116px;top:520px;display:flex;align-items:center;gap:20px;padding:16px 40px 18px 30px;border-radius:20px;background:#E62117;color:#fff;
  font-family:InterB,Anton;font-weight:800;font-size:46px;box-shadow:0 8px 0 rgba(0,0,0,.35);white-space:nowrap}
#ov-end .te{position:absolute;left:116px;top:640px;font-family:Rama,NotoTe;font-size:46px;color:#FFF6E0;text-shadow:0 3px 0 #2A1604,0 0 14px rgba(0,0,0,.8)}
#ov-end .cm{position:absolute;left:116px;top:735px;display:flex;align-items:center;gap:18px;background:#FFFDF6;border:5px solid #3A2418;border-radius:34px;padding:10px 32px 16px 20px;
  font-family:Rama,NotoTe;font-size:44px;color:#3A2418;box-shadow:0 8px 0 rgba(0,0,0,.35);white-space:nowrap}
#ov-end .slot{position:absolute;width:640px;height:360px;border-radius:24px;border:4px solid rgba(255,246,216,.55);background:rgba(20,12,6,.35);box-shadow:0 0 0 8px rgba(0,0,0,.12)}
#ov-end .ai{position:absolute;left:0;right:0;bottom:26px;text-align:center;font-family:InterB;font-size:26px;color:rgba(255,246,224,.85);text-shadow:0 2px 0 #000}`;
  document.head.appendChild(css);
  const root = document.createElement("div"); root.id = "ov789"; const stage = document.getElementById("stage"); stage.insertBefore(root, document.getElementById("k-chip"));
  const icon = (k, s = 110) => { const p = { flame: ICONS.flame, drop: ICONS.drop, heart: ICONS.heart }[k];
    return `<svg width="${s}" height="${s}" viewBox="-40 -40 80 80"><path d="${p}" fill="${k === "drop" ? "#5AB0E8" : k === "flame" ? "#F2762A" : "#6DBA4A"}" stroke="#3A2208" stroke-width="3.5" stroke-linejoin="round"/>
      ${k === "heart" ? '<path d="M0 22 L0 -10 M0 4 L-10 -4 M0 4 L10 -4" stroke="#2E5A2A" stroke-width="2.5" fill="none"/>' : ""}</svg>`; };
  const bubble = (s = 64) => `<svg width="${s}" height="${s}" viewBox="0 0 64 64"><path d="M8 10 H56 Q60 10 60 14 V42 Q60 46 56 46 H26 L14 58 L16 46 H8 Q4 46 4 42 V14 Q4 10 8 10 Z" fill="#4A9AE8" stroke="#1E3A6A" stroke-width="3.5" stroke-linejoin="round"/>
    <circle cx="20" cy="28" r="4" fill="#fff"/><circle cx="32" cy="28" r="4" fill="#fff"/><circle cx="44" cy="28" r="4" fill="#fff"/></svg>`;
  const play = (s = 54) => `<svg width="${s}" height="${s * .72}" viewBox="0 0 54 38"><rect x="0" y="0" width="54" height="38" rx="10" fill="#fff"/><path d="M21 10 L36 19 L21 28 Z" fill="#E62117"/></svg>`;
  const bell = (s = 50) => `<svg width="${s}" height="${s}" viewBox="0 0 50 50"><path d="M25 6 Q38 8 38 24 L38 33 L43 38 L7 38 L12 33 L12 24 Q12 8 25 6 Z" fill="#fff" stroke="#fff" stroke-width="2"/><circle cx="25" cy="42" r="5" fill="#fff"/></svg>`;
  root.innerHTML = `<div id="ov-moral" class="o"></div>
<div id="ov-badges" class="o">${["flame", "drop", "heart"].map((k, i) => `<div class="bd" id="bd${i}"><div class="ic">${icon(k)}</div><div class="lb">${["ధైర్యం", "కరుణ", "త్యాగం"][i]}</div></div>`).join("")}</div>
<div id="ov-q" class="o">${bubble(76)}<span>కామెంట్ చేయండి: ధైర్యం? కరుణ? త్యాగం?</span></div>
<div id="ov-sub" class="o">${play(60)}<span id="ov-subt">SUBSCRIBE</span><span id="ov-bell" style="opacity:0;display:flex">${bell(46)}</span></div>
<div id="ov-hand" class="o"><svg width="120" height="140" viewBox="0 0 120 140"><path d="M44 10 Q56 4 60 16 L62 60 L70 56 Q82 52 86 64 L94 62 Q106 60 106 74 L108 76 Q118 76 116 92 L110 118 Q104 134 84 134 L56 134 Q40 132 30 116 L10 84 Q4 72 16 68 Q26 66 34 80 L40 88 L38 18 Q38 12 44 10 Z" fill="#FFE2C4" stroke="#3A2418" stroke-width="5" stroke-linejoin="round"/></svg></div>
<div id="ov-end" class="o"><div class="ttl">చివరి చెట్టు రహస్యం</div><div class="en">The Secret of the Last Tree</div>
  <div class="brand">REEL RASAM</div><div class="subs">${play(56)}<span>Subscribe @reel_rasam</span></div>
  <div class="te">ఇలాంటి కథల కోసం subscribe చేయండి!</div>
  <div class="cm">${bubble(58)}<span>కామెంట్ చేయండి: ధైర్యం? కరుణ? త్యాగం?</span></div>
  <div class="slot" style="left:1160px;top:150px"></div><div class="slot" style="left:1160px;top:560px"></div>
  <div class="ai">Animation &amp; voices are AI-generated · a fictional story</div></div>`;
  const $ = id => document.getElementById(id);
  const O = { moral: $("ov-moral"), badges: $("ov-badges"), bd: [0, 1, 2].map(i => $("bd" + i)), q: $("ov-q"), sub: $("ov-sub"), subt: $("ov-subt"), bell: $("ov-bell"), hand: $("ov-hand"), end: $("ov-end"),
    reset() { [O.moral, O.badges, O.q, O.sub, O.hand, O.end].forEach(e => e.style.opacity = 0); },
    text(e, s) { if (e._t !== s) { e.textContent = s; e._t = s; } } };
  return O; })();

// camera keyframes with optional hard cuts: [[t, {x,y,z}, "cut"?], ...] ("cut" on a key = jump to it, no move into it)
function camSeq(t, ks) { let i = 0; while (i < ks.length - 1 && ks[i + 1][0] <= t) i++; const a = ks[i], b = ks[i + 1];
  if (!b || b[2] === "cut" || t < a[0]) return a[1]; return KIT.camLerp(a[1], b[1], ease(rng(t, a[0], b[0]))); }
const jit = (t, a, f = 40, s = 0) => a ? noise1(t * f, s) * a : 0;
// Veerendra's sunglasses falling off (same drawing as on his hair): from (x0,y0) to the ground y1 between t0 and t0+d
function makeGlassesFall() {
  return makeThing(g => { const a = el("g", {}, g);
    [-1, 1].forEach(s => el("path", { d: `M${s * 4} -4 L${s * 36} -8 Q${s * 40} 18 ${s * 22} 20 Q${s * 6} 18 ${s * 4} -4 Z`, fill: "#1A2430", stroke: "#C9A440", "stroke-width": 2.5 }, a));
    el("path", { d: "M-4 -4 Q0 -8 4 -4", stroke: "#C9A440", "stroke-width": 2.5, fill: "none" }, a); el("path", { d: "M-30 0 L-24 6", stroke: "#7FA8C8", "stroke-width": 3 }, a); return { a }; },
    (t, st, P) => { const k = rng(t, st.t0, st.t0 + st.d), b = t > st.t0 + st.d ? Math.exp(-(t - st.t0 - st.d) * 7) * Math.abs(Math.sin((t - st.t0 - st.d) * 14)) * 30 : 0;
      P.a.setAttribute("transform", `translate(${lerp(st.x0, st.x1, k)} ${lerp(st.y0, st.y1, k * k) - b}) rotate(${lerp(0, 200, k)})`); P.a.style.opacity = t < st.t0 ? 0 : 1; },
    { t0: 1e9, d: .7, x0: 0, y0: 0, x1: 0, y1: 0 });
}

// ---------------- scene 9 additions ----------------
// cracked dry earth patch (macro raindrop shot): st.wet 0..1 darkens it
function makeCrackPatch(w = 1400) {
  return makeThing(g => { const P = { base: el("ellipse", { cx: 0, cy: 0, rx: w / 2, ry: 120, fill: "#C9A070" }, g), L: [] };
    for (let i = 0; i < 26; i++) { let x = (hash(i * 3.3) - .5) * w * .9, y = (hash(i * 5.1) - .5) * 160, d = `M${x.toFixed(0)} ${y.toFixed(0)}`;
      for (let j = 0; j < 4; j++) { x += (hash(i * 7 + j) - .5) * 160; y += (hash(i * 11 + j) - .5) * 40; d += ` L${x.toFixed(0)} ${y.toFixed(0)}`; }
      P.L.push(el("path", { d, stroke: "#6A4A2A", "stroke-width": 3 + hash(i) * 3, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, g)); }
    return P; }, (t, st, P) => { P.base.setAttribute("fill", mixc("#C9A070", "#6A4A30", st.wet)); P.L.forEach(l => l.setAttribute("stroke", mixc("#6A4A2A", "#3A2618", st.wet))); }, { wet: 0 });
}
// a mound of fresh earth (hides the digger in the reveal)
function makeMound() { return makeThing(g => { el("path", { d: "M-170 0 Q-150 -90 -40 -110 Q60 -124 130 -80 Q180 -40 170 0 Z", fill: KIT.lgrad([[0, "#8A6040"], [1, "#5A3A22"]]), stroke: INK, "stroke-width": 4 }, g);
  for (let i = 0; i < 9; i++) el("ellipse", { cx: -120 + hash(i) * 260, cy: -20 - hash(i * 3) * 70, rx: 8 + hash(i * 5) * 8, ry: 5, fill: "#9A7050" }, g); return {}; }); }
// flicked earth from a spade: st.t0s list of flick times, at (0,0) going up-left
function makeFlick() { return makeThing(g => ({ c: [...Array(18)].map(() => el("circle", { r: 7, fill: "#7A5232", stroke: INK, "stroke-width": 1.5 }, g)) }),
  (t, st, P) => { let best = -1; for (const f of st.t0s) if (t >= f && t < f + 1) best = f;
    P.c.forEach((c, i) => { const q = best < 0 ? -1 : (t - best) / .9; if (q < 0 || q > 1) { c.style.opacity = 0; return; }
      c.style.opacity = 1; c.setAttribute("cx", -q * (120 + hash(i) * 180)); c.setAttribute("cy", -Math.sin(q * Math.PI) * (140 + hash(i * 3) * 120) + q * 60); c.setAttribute("r", 5 + hash(i * 5) * 7); }); }, { t0s: [] }); }
// a lotus cluster that opens (st.k)
function makeLotusProp(n = 7, seed = 0) { return makeThing(g => { const inner = el("g", {}, g); drawLotus(inner, n, seed); return { inner }; }, (t, st, P) => {
  P.inner.setAttribute("transform", `scale(${clamp(st.k)}) translate(0 ${Math.sin(t * 1.3 + seed) * 3})`); P.inner.style.opacity = st.k > .01 ? 1 : 0; }, { k: 0 }); }
// a sweep of big leaves crossing the frame (time-skip wipe): st.k 0..1 position (left -> right), world coords at cam z 1
function makeLeafWipe() { return makeThing(g => ({ L: [...Array(46)].map((_, i) => el("path", { d: "M0 0 Q60 -80 0 -200 Q-60 -80 0 0 Z", fill: ["#4E9446", "#6DB052", "#3A7A3C", "#8ACC52", "#5FA85A"][i % 5], stroke: "#24502A", "stroke-width": 4 }, g)) }),
  (t, st, P) => P.L.forEach((l, i) => { const x = lerp(-900, 2900, st.k) + (hash(i) - .5) * 700, y = -100 + (i / 46) * 1300 + (hash(i * 3) - .5) * 80;
    l.setAttribute("transform", `translate(${x} ${y}) rotate(${hash(i * 5) * 360 + st.k * 200}) scale(${1.4 + hash(i * 7) * 1.6})`); }), { k: 0 }); }

// top-down view of Anandapuram: a green wave spreads from the banyan at the centre. params: wave 0..1, pond 0..1
KIT.defineSet("topdown", S => {
  const L = S.layer(1, "map");
  el("rect", { x: -1400, y: -900, width: 4720, height: 2600, fill: "#C9A070" }, L);
  for (let i = 0; i < 60; i++) { let x = -400 + hash(i * 2.1) * 2700, y = -200 + hash(i * 4.3) * 1500, d = `M${x.toFixed(0)} ${y.toFixed(0)}`;
    for (let j = 0; j < 4; j++) { x += (hash(i * 9 + j) - .5) * 200; y += (hash(i * 13 + j) - .5) * 200; d += ` L${x.toFixed(0)} ${y.toFixed(0)}`; }
    el("path", { d, stroke: "#8A6438", "stroke-width": 3, fill: "none", opacity: .7 }, L); }
  for (let i = 0; i < 30; i++) stumpTop(L, -300 + hash(i * 6.1) * 2500, -100 + hash(i * 8.7) * 1300, "#9A7A54");
  const cid = KIT.uid("tw"), cp = el("clipPath", { id: cid }, KIT.defs), circ = el("circle", { cx: 960, cy: 540, r: 0 }, cp);
  const green = el("g", { "clip-path": `url(#${cid})` }, L);
  el("rect", { x: -1400, y: -900, width: 4720, height: 2600, fill: "#7AB85C" }, green);
  for (let i = 0; i < 8; i++) el("rect", { x: -200 + i * 70, y: 760, width: 46, height: 300, rx: 10, fill: i % 2 ? "#6AA84E" : "#8CC46A", transform: "rotate(-12 0 900)" }, green);
  const ring = el("circle", { cx: 960, cy: 540, r: 0, fill: "none", stroke: "#CFF5A0", "stroke-width": 26, opacity: .55 }, L);
  // path + pond + huts (on top of both looks)
  el("path", { d: "M-200 980 Q500 760 960 700 Q1400 640 2200 300", stroke: "#E8CC98", "stroke-width": 44, fill: "none", "stroke-linecap": "round" }, L);
  const pondB = el("ellipse", { cx: 1480, cy: 860, rx: 210, ry: 120, fill: "#A8804E", stroke: "#6A4A2A", "stroke-width": 4 }, L);
  const pondW = el("ellipse", { cx: 1480, cy: 860, rx: 0, ry: 0, fill: KIT.lgrad([[0, "#9AD6EE"], [1, "#4A98C6"]]), stroke: "#3A78A8", "stroke-width": 4 }, L);
  [[420, 640], [620, 860], [1260, 400], [1560, 560], [300, 300], [1700, 220], [820, 1000]].forEach(([x, y], i) => { const h = el("g", { transform: `translate(${x} ${y}) rotate(${hash(i) * 40 - 20})` }, L);
    el("rect", { x: -60, y: -60, width: 120, height: 120, rx: 8, fill: "#D4AE52", stroke: INK, "stroke-width": 4 }, h);
    el("path", { d: "M-60 -60 L60 60 M60 -60 L-60 60", stroke: "#B8923E", "stroke-width": 4 }, h); });
  // trees that pop up as the wave passes
  const trees = []; for (let i = 0; i < 70; i++) { const x = -200 + hash(i * 3.7) * 2400, y = -80 + hash(i * 5.9) * 1260; if (Math.hypot(x - 960, y - 540) < 300) continue;
    const g = el("g", {}, L); el("circle", { r: 46, fill: i % 2 ? "#4E9446" : "#3A7A3C", stroke: INK, "stroke-width": 3.5 }, g); el("circle", { cx: -12, cy: -12, r: 18, fill: "#fff", opacity: .15 }, g);
    trees.push({ g, x, y, d: Math.hypot(x - 960, y - 540) }); }
  // the banyan from above
  const ban = el("g", {}, L); el("path", { d: scallop(960, 540, 300, 270, 26, 4, .22), fill: "#2E6A36", stroke: INK, "stroke-width": 6 }, ban);
  el("path", { d: scallop(940, 520, 210, 190, 18, 7, .25), fill: "#3E8A48", stroke: INK, "stroke-width": 4 }, ban);
  el("path", { d: scallop(920, 500, 110, 100, 12, 9, .3), fill: "#5FA85A", stroke: INK, "stroke-width": 3 }, ban);
  const glow = el("circle", { cx: 960, cy: 540, r: 140, fill: KIT.rgrad([[0, "#FFF2B8", .9], [1, "#FFD867", 0]]) }, L);
  S.actorLayer();
  S.update = (t, o) => { const w = o.wave || 0, R = 2300 * ease(w); circ.setAttribute("r", R); ring.setAttribute("r", R); ring.style.opacity = w > 0 && w < 1 ? .55 : 0;
    trees.forEach(T => { const k = clamp((R - T.d) / 160); T.g.setAttribute("transform", `translate(${T.x} ${T.y}) scale(${back(k) * (.8 + hash(T.x) * .5)})`); T.g.style.display = k > 0 ? "" : "none"; });
    const p = o.pond == null ? clamp((R - 600) / 300) : o.pond; pondW.setAttribute("rx", 200 * Math.sqrt(p)); pondW.setAttribute("ry", 112 * Math.sqrt(p));
    glow.style.opacity = .4 + .3 * Math.sin(t * 3) + (w < .2 ? .4 : 0); };
});
function stumpTop(p, x, y, c) { el("circle", { cx: x, cy: y, r: 16, fill: c, stroke: INK, "stroke-width": 2.5 }, p); el("circle", { cx: x, cy: y, r: 7, fill: "none", stroke: "#6A4A2A", "stroke-width": 1.5 }, p); }
