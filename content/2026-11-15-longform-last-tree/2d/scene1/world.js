// చివరి చెట్టు రహస్యం — shared world for scenes 1–3 (props, extra sets, helpers). Loaded after kit.js, cast.js, sets.js.
// Our own drawings in the story16x9 look (flat shapes, soft gradients, brown INK outlines).
"use strict";

// ---------- helpers ----------
// a drawn prop that behaves like an actor (reset each frame, placed with KIT.put)
function makeProp(name, build, upd, st0 = {}) {
  const g = el("g", { "data-actor": name }, null), inner = el("g", {}, g); const P = build(inner) || {};
  const st = Object.assign({ x: 0, y: 0, s: 1, flip: 1, rot: 0, vis: 1, k: 0, k2: 0, k3: 0, t0: 0 }, st0);
  return KIT.register({ g, st, P, name, draw(t) {
    g.setAttribute("transform", `translate(${st.x} ${st.y}) rotate(${st.rot}) scale(${st.s * st.flip} ${st.s})`); g.style.opacity = st.vis;
    if (upd) upd(t, st, P, inner); } });
}
// an extra parallax layer inside an existing set (inserted before layer `before` = index or layer name)
function addLayer(setName, p, before, build) {
  const S = KIT.get(setName); const g = el("g", { "data-p": p }, null);
  const ref = typeof before === "string" ? S.layers.find(l => l.name === before) : S.layers[before];
  S.g.insertBefore(g, ref ? ref.g : null); S.layers.push({ g, p, name: "custom" }); return build ? build(g) : g;
}
// put an actor inside a transformed wrapper (swing, lying down)
const _WR = new Map();
function putWrapped(a, S, o, transform) { S = KIT.get(S); KIT.put(a, S, o); const key = a.name + "|" + S.name + "|" + (a.st.seed || 0);
  let w = _WR.get(key); if (!w) { w = el("g", {}, null); _WR.set(key, w); }
  w.setAttribute("transform", transform); S.actors.appendChild(w); w.appendChild(a.g); return a; }
// shot list with cross-fades: [[t0, t1, fn(t, S-opacity), xfadeIn]]
function shots(t, list) {
  for (let i = 0; i < list.length; i++) { const [a, b, fn, xf = .7] = list[i]; const nx = list[i + 1], ext = nx ? (nx[3] == null ? .7 : nx[3]) : 0;
    if (t >= a && t < b + ext) fn(t, i > 0 && xf > 0 ? rng(t, a, a + xf) : 1); }
}
const sm = x => ease(x);

// ---------- held items (added to the cast's PROPS) ----------
PROPS.lantern = (p) => {
  const halo = el("circle", { cx: 0, cy: 60, r: 230, fill: KIT.rgrad([[0, "#FFD68A", .55], [.4, "#FFB850", .22], [1, "#FF9A30", 0]]) }, p);
  el("path", { d: "M-14 8 Q0 -16 14 8", fill: "none", stroke: "#3A2A1E", "stroke-width": 4 }, p);
  el("rect", { x: -20, y: 8, width: 40, height: 10, rx: 3, fill: "#5A4A3A", stroke: INK, "stroke-width": 2.5 }, p);
  el("path", { d: "M-18 18 Q-28 50 -18 78 L18 78 Q28 50 18 18 Z", fill: KIT.lgrad([[0, "#FFF2C0"], [1, "#FFC860"]]), stroke: INK, "stroke-width": 3, opacity: .95 }, p);
  const fl = el("path", { d: "M0 34 Q8 48 0 62 Q-8 48 0 34 Z", fill: "#FF9A2A" }, p);
  el("line", { x1: -18, y1: 48, x2: 18, y2: 48, stroke: "#5A4A3A", "stroke-width": 2, opacity: .5 }, p);
  el("rect", { x: -22, y: 76, width: 44, height: 12, rx: 3, fill: "#5A4A3A", stroke: INK, "stroke-width": 2.5 }, p);
  p._upd = (t) => { const f = .85 + .15 * Math.sin(t * 11) * Math.sin(t * 7.3); fl.setAttribute("transform", `translate(0 48) scale(${f} ${f * 1.05}) translate(0 -48)`); halo.setAttribute("opacity", .75 + .25 * f); };
};
PROPS.bag = (p) => {
  el("path", { d: "M-6 0 Q-30 10 -34 30 M6 0 Q24 10 28 30", stroke: "#6A3A20", "stroke-width": 5, fill: "none" }, p);
  el("rect", { x: -42, y: 26, width: 78, height: 64, rx: 10, fill: KIT.lgrad([[0, "#3E7AC0"], [1, "#25528A"]]), stroke: INK, "stroke-width": 3 }, p);
  el("path", { d: "M-42 40 Q-3 58 36 40 L36 52 Q-3 70 -42 52 Z", fill: "#2A5E9E", stroke: INK, "stroke-width": 2.5 }, p);
  el("rect", { x: -10, y: 50, width: 12, height: 10, rx: 2, fill: "#F2C230", stroke: INK, "stroke-width": 1.5 }, p);
};
PROPS.brasspot = (p) => {
  el("path", { d: "M-30 -12 Q-50 18 -32 42 Q0 58 32 42 Q50 18 30 -12 Z", fill: KIT.lgrad([[0, "#F6D46A"], [.5, "#D9A43A"], [1, "#9A6A1E"]], 0, 0, 1, 1), stroke: INK, "stroke-width": 3 }, p);
  el("path", { d: "M-18 -12 L-16 -26 L16 -26 L18 -12 Z", fill: "#D9A43A", stroke: INK, "stroke-width": 3 }, p);
  el("ellipse", { cx: 0, cy: -27, rx: 22, ry: 6, fill: "#E8BC52", stroke: INK, "stroke-width": 2.5 }, p);
  el("path", { d: "M-22 6 Q-20 -4 -10 -8", stroke: "#FFF6D0", "stroke-width": 4, fill: "none", opacity: .8, "stroke-linecap": "round" }, p);
};
PROPS.axeR = (p) => { const g = el("g", { transform: "scale(-1 1)" }, p); PROPS.axe(g); };
PROPS.saw = (p) => { el("path", { d: "M0 0 L150 -10 L150 18 L0 24 Z", fill: KIT.lgrad([[0, "#E6EAEE"], [1, "#8A949E"]]), stroke: INK, "stroke-width": 3 }, p);
  for (let i = 0; i < 14; i++) el("path", { d: `M${8 + i * 10} ${23 - i * .45} l5 8 l5 -8`, fill: "#C9D0D8", stroke: INK, "stroke-width": 1.2 }, p);
  el("rect", { x: -26, y: -8, width: 30, height: 36, rx: 8, fill: "#8A5A30", stroke: INK, "stroke-width": 3 }, p); };

// ---------- cast variants ----------
const NIGHT_OPT = { top: { c: "#E6DAF2", sleeve: "#E6DAF2" }, bottom: { type: "skirt", c: "#B9A4DA", border: "#F4EEFA", borderW: 9, flare: 30 }, sleeveLen: .55,
  drawTop(p, { S, tw, ww }) { el("path", { d: `M-24 ${S - 6} Q0 ${S + 22} 24 ${S - 6}`, fill: "none", stroke: "#F8F2FC", "stroke-width": 7, "stroke-linecap": "round" }, p);
    for (let i = 0; i < 5; i++) el("circle", { cx: -ww + 10 + hash(i) * ww * 1.8, cy: S + 40 + hash(i * 3) * 80, r: 4, fill: "#F6F0FA", opacity: .9 }, p);
    el("rect", { x: -ww - 2, y: -16, width: (ww + 2) * 2, height: 9, rx: 4, fill: "#9A86C4", opacity: .8 }, p); } };
const makeMeeraNight = (x = {}) => makeMeera({ ...NIGHT_OPT, ...x });
const makeVeerendraS = () => makeVeerendra({ drawHead(a) { VEERENDRA_OPT.drawHead(a); const ry = a.B.ry;   // a small scar on the chin (rewatch clue for scene 8)
  el("path", { d: `M10 ${ry * .8} l12 9`, stroke: "#E7B89A", "stroke-width": 3.2, "stroke-linecap": "round", fill: "none" }, a.face);
  el("path", { d: `M13 ${ry * .79} l-2 6 M18 ${ry * .83} l-2 6`, stroke: "#C98A6A", "stroke-width": 1.6, "stroke-linecap": "round", fill: "none" }, a.face); } });
const makeKid = (n) => makePerson({ ...CHINTU_OPT, name: "kid" + n, who: null, drawTop: undefined,
  top: { c: ["#3A7AD9", "#E8902E", "#8A4AB8"][n % 3], sleeve: ["#3A7AD9", "#E8902E", "#8A4AB8"][n % 3] }, bottom: { type: "shorts", c: ["#5A5A6A", "#3E7A5A", "#A8845A"][n % 3] }, skin: ["#B07A50", "#A86E46", "#C08A5E"][n % 3] });

// ---------- props ----------
const makeRock = () => makeProp("rock", g => {
  el("path", { d: "M-170 0 Q-190 -90 -120 -150 Q-40 -210 50 -180 Q150 -150 175 -60 Q186 -10 170 0 Z", fill: KIT.lgrad([[0, "#7A7484"], [1, "#3E3A48"]], 0, 0, 1, 1), stroke: INK, "stroke-width": 4 }, g);
  el("path", { d: "M-110 -140 Q-50 -186 30 -170", stroke: "#A8A2B4", "stroke-width": 6, fill: "none", opacity: .5, "stroke-linecap": "round" }, g);
  el("path", { d: "M-60 -60 l40 -20 M60 -90 l30 30", stroke: "#2E2A36", "stroke-width": 3, opacity: .6 }, g);
  [-150, -60, 90, 160].forEach((x, i) => tuft(g, x, 4, 1.1 + hash(i) * .5, "#2E3A3A")); });

// glowing friendly eyes in the bark (k = open/visible, k2 = blink 0..1)
const makeBarkEyes = () => makeProp("barkEyes", g => {
  const P = { eyes: [] };
  P.halo = el("ellipse", { cx: 0, cy: 0, rx: 190, ry: 90, fill: KIT.rgrad([[0, "#FFE7A0", .55], [1, "#FFC94A", 0]]) }, g);
  [-1, 1].forEach(s => { const eg = el("g", { transform: `translate(${s * 56} 0)` }, g);
    el("ellipse", { rx: 40, ry: 26, fill: KIT.rgrad([[0, "#FFF8D8", .9], [1, "#FFD060", 0]]) }, eg);
    const e = el("path", { d: "M-24 0 Q0 -20 24 0 Q0 18 -24 0 Z", fill: "#FFF6CC", stroke: "#FFC13A", "stroke-width": 3 }, eg);
    const pu = el("ellipse", { cx: 2, cy: 1, rx: 7, ry: 8, fill: "#E89A20", opacity: .55 }, eg);
    P.eyes.push({ eg, e, pu }); });
  P.smile = el("path", { d: "M-40 60 Q0 82 40 60", fill: "none", stroke: "#FFE08A", "stroke-width": 5, "stroke-linecap": "round", opacity: 0 }, g);
  return P; }, (t, st, P) => { const k = clamp(st.k), bl = clamp(st.k2);
  P.halo.setAttribute("opacity", k * (.7 + .3 * Math.sin(t * 2)));
  P.eyes.forEach(E => { const sy = Math.max(.06, 1 - bl) * (.4 + .6 * k); E.eg.firstChild.setAttribute("opacity", k);
    E.e.setAttribute("transform", `scale(1 ${sy})`); E.e.setAttribute("opacity", k); E.pu.setAttribute("transform", `scale(1 ${sy})`); E.pu.setAttribute("opacity", k * .55); });
  P.smile.setAttribute("opacity", k * st.k3); });

// cracked earth patch (k = how cracked); glow k2 = gold light from the cracks (the ground opens)
const makeCracks = (n = 14, w = 900) => makeProp("cracks", g => {
  const P = { lines: [], glow: null };
  P.glow = el("ellipse", { cx: 0, cy: 0, rx: w * .45, ry: 60, fill: KIT.rgrad([[0, "#FFE9A0", .9], [.5, "#FFC94A", .4], [1, "#FFB020", 0]]), opacity: 0 }, g);
  for (let i = 0; i < n; i++) { const x0 = (hash(i * 3.3) - .5) * w, y0 = (hash(i * 5.1) - .5) * 70; let d = `M${x0} ${y0}`, x = x0, y = y0;
    for (let j = 0; j < 5; j++) { x += (hash(i * 7 + j) - .5) * 110; y += (hash(i * 11 + j) - .5) * 36; d += ` L${x.toFixed(0)} ${y.toFixed(0)}`;
      if (j % 2) d += ` M${x.toFixed(0)} ${y.toFixed(0)} l${((hash(i + j * 3) - .5) * 60).toFixed(0)} ${((hash(i * 2 + j) - .3) * 24).toFixed(0)} M${x.toFixed(0)} ${y.toFixed(0)}`; }
    P.lines.push(el("path", { d, stroke: "#5A3A22", "stroke-width": 1.6 + hash(i) * 1.8, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, g)); }
  return P; }, (t, st, P) => { P.lines.forEach((l, i) => { const k = clamp(st.k * 1.6 - hash(i * 9) * .6); l.style.opacity = k;
    l.setAttribute("stroke", mixc("#5A3A22", "#FFD25A", clamp(st.k2 * 1.3))); });
  P.glow.setAttribute("opacity", st.k2 * (.8 + .2 * Math.sin(t * 3))); });

// opening in the ground between the roots, with light (k = open)
const makeRootOpening = () => makeProp("rootOpen", g => {
  const P = {};
  P.beam = el("path", { d: "M-70 0 L-160 -520 L160 -520 L70 0 Z", fill: KIT.lgrad([[0, "#FFE7A0", .0], [.7, "#FFE7A0", .25], [1, "#FFF2C0", .55]], 0, 1, 0, 0) }, g);
  P.hole = el("ellipse", { cx: 0, cy: 0, rx: 90, ry: 22, fill: KIT.rgrad([[0, "#FFF6D0"], [.6, "#FFC94A"], [1, "#B8741A"]]), stroke: "#4A2E18", "stroke-width": 4 }, g);
  P.lips = [-1, 1].map(s => el("path", { d: `M${s * 20} -4 Q${s * 70} -26 ${s * 120} -2 Q${s * 70} 8 ${s * 20} 4 Z`, fill: "#6E4A2E", stroke: INK, "stroke-width": 3 }, g));
  P.dust = [...Array(10)].map((_, i) => el("circle", { r: 3 + hash(i) * 4, fill: "#FFE7A0" }, g));
  return P; }, (t, st, P) => { const k = clamp(st.k);
  P.hole.setAttribute("rx", 10 + 90 * k); P.hole.setAttribute("ry", 3 + 20 * k); P.hole.style.opacity = k > .01 ? 1 : 0;
  P.lips.forEach((l, i) => l.setAttribute("transform", `translate(${(i ? 1 : -1) * 40 * k} ${-6 * k})`));
  P.beam.style.opacity = k * (.7 + .3 * Math.sin(t * 2.2));
  P.dust.forEach((d, i) => { const ph = fract(t * .35 + hash(i)); d.setAttribute("cx", (hash(i * 3) - .5) * 160 * k + Math.sin(t + i) * 10); d.setAttribute("cy", -ph * 420); d.style.opacity = k * Math.sin(ph * Math.PI); }); });

// floating magic seed (k = glow level 0..3 passed to makeSeed); k2 = three dim rings (the progress meter)
const makeSeedProp = (s = 1) => makeProp("seedProp", g => { const P = {};
  P.star = el("g", {}, g); for (let i = 0; i < 4; i++) el("path", { d: "M0 -150 L10 -20 L0 0 L-10 -20 Z", fill: "#FFF2C0", opacity: .7, transform: `rotate(${i * 90})` }, P.star);
  P.starHalo = el("circle", { r: 120, fill: KIT.rgrad([[0, "#FFF6D0", .9], [.4, "#FFD86A", .45], [1, "#FFB020", 0]]) }, g);
  P.spin = el("g", {}, g); P.seed = makeSeed(P.spin, 1);
  P.rings = [0, 1, 2].map(i => el("circle", { r: 44 + i * 14, fill: "none", stroke: "#E8C878", "stroke-width": 3, "stroke-dasharray": "6 6", opacity: 0 }, g));
  return P; }, (t, st, P) => { P.seed.set(st.k, t); P.spin.setAttribute("transform", `rotate(${Math.sin(t * 1.3) * 18}) scale(${st.s2 || 1})`);
  const sh = clamp(st.k3); P.star.setAttribute("transform", `rotate(${t * 20}) scale(${.6 + .4 * Math.sin(t * 3)})`); P.star.style.opacity = sh; P.starHalo.style.opacity = sh * (.8 + .2 * Math.sin(t * 4));
  P.rings.forEach((r, i) => { r.style.opacity = clamp(st.k2) * (.45 + .15 * Math.sin(t * 2 + i)); r.setAttribute("transform", `rotate(${t * (8 + i * 4) * (i % 2 ? -1 : 1)})`); }); }, { k: 0, s2: 1 });

// three symbols: flame (courage), water drop (compassion), heart-shaped leaf (sacrifice); k,k2,k3 = each visible; st.merge 0..1 flies them into the seed
const makeSymbols = () => makeProp("symbols", g => { const P = { sy: [] };
  const mk = (draw, col) => { const sg = el("g", {}, g); el("circle", { r: 70, fill: KIT.rgrad([[0, col, .55], [1, col, 0]]) }, sg); draw(sg); return sg; };
  P.sy.push(mk(sg => { el("path", { d: "M0 -46 C22 -20 30 0 22 20 C16 36 -16 36 -22 20 C-30 0 -12 -14 0 -46 Z", fill: KIT.lgrad([[0, "#FFE27A"], [1, "#FF7A2A"]]), stroke: "#B8461A", "stroke-width": 3 }, sg);
    el("path", { d: "M0 -8 C10 4 12 14 6 24 C2 30 -8 28 -8 18 C-8 8 -4 4 0 -8 Z", fill: "#FFF6C0" }, sg); }, "#FFB040"));
  P.sy.push(mk(sg => { el("path", { d: "M0 -44 C14 -20 30 -2 30 16 C30 34 16 44 0 44 C-16 44 -30 34 -30 16 C-30 -2 -14 -20 0 -44 Z", fill: KIT.lgrad([[0, "#C8F0FF"], [1, "#3A9AD8"]]), stroke: "#1E5A8A", "stroke-width": 3 }, sg);
    el("path", { d: "M-14 12 Q-14 26 -2 32", stroke: "#fff", "stroke-width": 4, fill: "none", "stroke-linecap": "round", opacity: .8 }, sg); }, "#6AC8FF"));
  P.sy.push(mk(sg => { el("path", { d: "M0 40 C-34 14 -44 -8 -34 -26 C-24 -42 -6 -40 0 -24 C6 -40 24 -42 34 -26 C44 -8 34 14 0 40 Z", fill: KIT.lgrad([[0, "#9AE07A"], [1, "#3E9A44"]]), stroke: "#2A5A2A", "stroke-width": 3 }, sg);
    el("path", { d: "M0 -20 L0 34 M0 0 L-16 -12 M0 12 L16 0", stroke: "#2E6A2E", "stroke-width": 2.5, fill: "none" }, sg); }, "#8AE07A"));
  return P; }, (t, st, P) => { const pos = [[-210, -40], [0, -230], [210, -40]], m = clamp(st.merge || 0);
  P.sy.forEach((sg, i) => { const v = clamp([st.k, st.k2, st.k3][i]), bob = Math.sin(t * 2 + i * 2) * 8;
    const x = lerp(pos[i][0], 0, ease(m)), y = lerp(pos[i][1] + bob, 0, ease(m)), sc = (.4 + .6 * back(v)) * (1 - .8 * ease(m));
    sg.setAttribute("transform", `translate(${x} ${y}) scale(${sc})`); sg.style.opacity = v * (1 - clamp((m - .7) * 3.3)); }); }, { merge: 0 });

// a single falling leaf path (st.t0 start, from (x0,y0) to (x1,y1) over dur) — position set by caller
const makeLeaf = (c = "#6DB052") => makeProp("leaf", g => { el("path", { d: "M0 0 Q12 -14 0 -34 Q-12 -14 0 0 Z", fill: c, stroke: "#2E5A2A", "stroke-width": 2 }, g);
  el("path", { d: "M0 -2 L0 -30", stroke: "#2E5A2A", "stroke-width": 1.5 }, g); });
function leafPath(L, t, t0, t1, x0, y0, x1, y1) { const k = rng(t, t0, t1); L.st.x = lerp(x0, x1, k) + Math.sin(k * 9) * 60 * (1 - k); L.st.y = lerp(y0, y1, k * k * .3 + k * .7);
  L.st.rot = Math.sin(k * 9) * 50 + k * 40; return k; }

// water poured from the pot: stream + a dark wet patch (k = flow, k2 = wet)
const makeWater = () => makeProp("water", g => { const P = {};
  P.wet = el("ellipse", { cx: 0, cy: 0, rx: 120, ry: 22, fill: "#6A4628", opacity: 0 }, g);
  P.stream = el("path", { d: "M0 -150 Q10 -80 0 0", stroke: "#8ACFEF", "stroke-width": 12, fill: "none", "stroke-linecap": "round", "stroke-dasharray": "26 10" }, g);
  P.st2 = el("path", { d: "M0 -150 Q10 -80 0 0", stroke: "#E8F8FF", "stroke-width": 4, fill: "none", "stroke-linecap": "round", "stroke-dasharray": "10 26" }, g);
  P.drops = [...Array(8)].map(() => el("circle", { r: 5, fill: "#BFE8FF", stroke: "#3A7AA8", "stroke-width": 1 }, g));
  return P; }, (t, st, P) => { const k = clamp(st.k), w = clamp(st.k2); const h = st.h || 150;
  P.wet.setAttribute("rx", 30 + 120 * w); P.wet.setAttribute("ry", 6 + 20 * w); P.wet.style.opacity = w * .8;
  const d = `M0 ${-h} Q14 ${-h * .5} 0 0`; P.stream.setAttribute("d", d); P.st2.setAttribute("d", d);
  P.stream.style.opacity = k; P.st2.style.opacity = k * .9; P.stream.setAttribute("stroke-dashoffset", -t * 160); P.st2.setAttribute("stroke-dashoffset", -t * 160);
  P.drops.forEach((dr, i) => { const ph = fract(t * 2.2 + hash(i)); dr.setAttribute("cx", (hash(i * 3) - .5) * 80 * ph); dr.setAttribute("cy", -Math.sin(ph * Math.PI) * 30); dr.style.opacity = k * (1 - ph); }); }, { h: 150 });

// jeep (side view facing right). k = wheel turn (distance), k2 = door open 0..1
const makeJeep = () => makeProp("jeep", g => { const P = {};
  el("ellipse", { cx: 0, cy: 6, rx: 230, ry: 16, fill: "#1a0e06", opacity: .25 }, g);
  const body = el("g", {}, g); P.body = body;
  el("path", { d: "M-210 -40 L-210 -120 Q-206 -134 -190 -136 L60 -136 L110 -200 Q118 -210 132 -210 L150 -210 L150 -136 L196 -132 Q214 -128 214 -110 L214 -40 Z", fill: KIT.lgrad([[0, "#F4F6F4"], [.6, "#D6DCDA"], [1, "#9AA4A2"]]), stroke: INK, "stroke-width": 4, "stroke-linejoin": "round" }, body);
  el("path", { d: "M-180 -200 L60 -200 L60 -136 L-180 -136 Z", fill: "#3A4A3E", stroke: INK, "stroke-width": 4 }, body);   // soft top
  el("path", { d: "M-160 -190 L-60 -190 L-60 -146 L-160 -146 Z M-40 -190 L44 -190 L44 -146 L-40 -146 Z", fill: "#9AC8DA", stroke: INK, "stroke-width": 3 }, body);
  el("path", { d: "M70 -140 L114 -196 L140 -196 L140 -140 Z", fill: "#9AC8DA", stroke: INK, "stroke-width": 3 }, body);
  el("rect", { x: -214, y: -70, width: 430, height: 12, fill: "#C9A440", stroke: INK, "stroke-width": 2 }, body);   // gold stripe
  el("rect", { x: 196, y: -116, width: 22, height: 20, rx: 4, fill: "#FFF6C8", stroke: INK, "stroke-width": 2.5 }, body);  // headlight
  el("rect", { x: 200, y: -60, width: 30, height: 18, rx: 4, fill: "#B8BEC4", stroke: INK, "stroke-width": 2.5 }, body);   // bumper
  P.door = el("path", { d: "M-40 -134 L60 -134 L60 -46 L-40 -46 Z", fill: "#E6EAE8", stroke: INK, "stroke-width": 3 }, body);
  el("path", { d: "M-150 -120 Q-60 -128 40 -120", stroke: "#fff", "stroke-width": 6, fill: "none", opacity: .7, "stroke-linecap": "round" }, body);
  P.wheels = [-130, 130].map(x => { const w = el("g", { transform: `translate(${x} -30)` }, g);
    el("circle", { r: 46, fill: "#222", stroke: INK, "stroke-width": 4 }, w); const hub = el("g", {}, w);
    el("circle", { r: 22, fill: "#B8BEC4", stroke: INK, "stroke-width": 3 }, hub); for (let i = 0; i < 5; i++) el("circle", { cx: Math.cos(i * 1.256) * 13, cy: Math.sin(i * 1.256) * 13, r: 3.2, fill: "#555" }, hub);
    el("rect", { x: -3, y: -44, width: 6, height: 12, fill: "#555" }, hub); return hub; });
  P.dust = [...Array(14)].map(() => el("circle", { fill: "#D9C29A", stroke: "#A8906A", "stroke-width": 2 }, g));
  P.dust.forEach(d => g.insertBefore(d, g.firstChild));
  return P; }, (t, st, P) => { P.wheels.forEach(h => h.setAttribute("transform", `rotate(${st.k * 1.25})`));
  P.body.setAttribute("transform", `translate(0 ${Math.sin(t * 17) * 1.5 * clamp(st.speed || 0)})`);
  P.door.setAttribute("transform", `translate(-40 0) scale(${1 - .85 * clamp(st.k2)} 1) translate(40 0)`);
  const sp = clamp(st.speed || 0), dk = clamp(st.dust || 0);
  P.dust.forEach((d, i) => { const ph = fract(t * .9 + hash(i)); const x = -220 - ph * 260 + (hash(i * 3) - .5) * 60, y = -20 - ph * 90 - hash(i * 5) * 30;
    d.setAttribute("cx", x); d.setAttribute("cy", y); d.setAttribute("r", 14 + ph * 40); d.style.opacity = dk * (1 - ph) * .8; }); }, { speed: 0, dust: 0 });

// rope swing hanging from (0,0) down `len`; the wrapper swing rotation is done by the caller
const makeSwing = (len = 360) => makeProp("swing", g => { el("line", { x1: -34, y1: 0, x2: -34, y2: len, stroke: "#C9A46A", "stroke-width": 5 }, g);
  el("line", { x1: 34, y1: 0, x2: 34, y2: len, stroke: "#C9A46A", "stroke-width": 5 }, g);
  el("rect", { x: -50, y: len - 6, width: 100, height: 16, rx: 5, fill: "#8A5A30", stroke: INK, "stroke-width": 3 }, g); });

// peacock (side view, facing right); k = tail fan 0..1
const makePeacock = () => makeProp("peacock", g => { const P = {};
  P.fan = el("g", { transform: "translate(-30 -80)" }, g);
  for (let i = 0; i < 15; i++) { const a = -170 + i * 11.5, f = el("g", { transform: `rotate(${a})` }, P.fan);
    el("path", { d: "M0 0 Q90 -14 190 0 Q90 14 0 0 Z", fill: "#2E8A5A", stroke: "#1E4A3A", "stroke-width": 2 }, f);
    el("ellipse", { cx: 170, cy: 0, rx: 18, ry: 13, fill: "#2A9AB0", stroke: "#1E4A3A", "stroke-width": 2 }, f);
    el("ellipse", { cx: 172, cy: 0, rx: 9, ry: 7, fill: "#1A3A8A" }, f); el("circle", { cx: 174, cy: 0, r: 3, fill: "#F2C230" }, f); }
  P.train = el("path", { d: "M-20 -60 Q-140 -40 -200 -20 Q-120 -10 -10 -40 Z", fill: "#2E8A5A", stroke: "#1E4A3A", "stroke-width": 2.5 }, g);
  [[-6, 0], [10, 0]].forEach(([x]) => el("path", { d: `M${x} -40 L${x} 0 M${x - 8} 0 L${x + 8} 0`, stroke: "#8A6A4A", "stroke-width": 4, fill: "none" }, g));
  el("ellipse", { cx: 0, cy: -70, rx: 44, ry: 32, fill: KIT.lgrad([[0, "#2A6ADA"], [1, "#1A3A9A"]]), stroke: INK, "stroke-width": 3 }, g);
  el("path", { d: "M-10 -60 Q-30 -50 -40 -66 Q-20 -74 -10 -60 Z", fill: "#C9A46A" }, g);
  P.neck = el("g", {}, g); el("path", { d: "M18 -90 Q26 -130 40 -150 L56 -146 Q46 -120 40 -84 Z", fill: "#1E5ADA", stroke: INK, "stroke-width": 3 }, P.neck);
  el("circle", { cx: 50, cy: -152, r: 15, fill: "#1E5ADA", stroke: INK, "stroke-width": 3 }, P.neck);
  el("path", { d: "M62 -154 L78 -150 L62 -146 Z", fill: "#C9A46A", stroke: INK, "stroke-width": 1.5 }, P.neck);
  el("circle", { cx: 54, cy: -156, r: 3, fill: "#111" }, P.neck); el("path", { d: "M46 -158 Q50 -150 58 -152", stroke: "#fff", "stroke-width": 3, fill: "none" }, P.neck);
  for (let i = 0; i < 3; i++) el("path", { d: `M${46 + i * 4} -166 L${42 + i * 6} -186`, stroke: "#1E5ADA", "stroke-width": 2 }, P.neck), el("circle", { cx: 42 + i * 6, cy: -188, r: 3.5, fill: "#2A9AB0" }, P.neck);
  return P; }, (t, st, P) => { const f = clamp(st.k); P.fan.setAttribute("transform", `translate(-30 -80) scale(${.2 + .8 * f}) rotate(${Math.sin(t * 6) * 2 * f})`); P.fan.style.opacity = f > .05 ? 1 : 0;
  P.train.style.opacity = 1 - f; P.neck.setAttribute("transform", `rotate(${Math.sin(t * 2.2) * 4} 30 -90)`); });

// rabbit (side view facing right), hops in place with st.hopPh
const makeRabbit = (c = "#E8E2D8") => makeProp("rabbit", g => { const P = { b: el("g", {}, g) };
  el("ellipse", { cx: 0, cy: -26, rx: 36, ry: 26, fill: c, stroke: INK, "stroke-width": 3 }, P.b);
  el("circle", { cx: -34, cy: -30, r: 9, fill: "#fff", stroke: INK, "stroke-width": 2 }, P.b);
  el("ellipse", { cx: 30, cy: -48, rx: 18, ry: 16, fill: c, stroke: INK, "stroke-width": 3 }, P.b);
  [[20, 4], [30, -2]].forEach(([x, r]) => el("ellipse", { cx: x, cy: -82, rx: 6, ry: 24, fill: c, stroke: INK, "stroke-width": 2.5, transform: `rotate(${r} ${x} -62)` }, P.b));
  el("circle", { cx: 38, cy: -50, r: 3, fill: "#111" }, P.b); el("circle", { cx: 47, cy: -44, r: 2.5, fill: "#E07A8A" }, P.b);
  return P; }, (t, st, P) => { const h = Math.max(0, Math.sin((t + st.t0) * 6)) * 26 * (st.k || 0); P.b.setAttribute("transform", `translate(0 ${-h}) rotate(${-h * .3})`); }, { k: 1 });

// coin glint (Veerendra's greed)
const makeCoins = () => makeProp("coins", g => { const P = { c: [] };
  for (let i = 0; i < 2; i++) { const cg = el("g", { transform: `translate(${i ? 26 : -26} 0)` }, g);
    el("ellipse", { rx: 13, ry: 11, fill: KIT.lgrad([[0, "#FFF2A0"], [1, "#D49A1A"]]), stroke: "#8A5A10", "stroke-width": 2 }, cg);
    el("ellipse", { rx: 7, ry: 6, fill: "none", stroke: "#B8801A", "stroke-width": 1.5 }, cg);
    const sp = el("path", { d: "M0 -26 L3 -3 L26 0 L3 3 L0 26 L-3 3 L-26 0 L-3 -3 Z", fill: "#FFFBE0", transform: "translate(8 -8)" }, cg); P.c.push([cg, sp]); }
  return P; }, (t, st, P) => { P.c.forEach(([cg, sp], i) => { const k = clamp(st.k); cg.style.opacity = k; sp.setAttribute("transform", `translate(8 -8) scale(${.4 + .6 * Math.abs(Math.sin(t * 5 + i))}) rotate(${t * 60})`); }); });

// lotus pads + flowers (a cluster)
function drawLotus(g, n = 7, seed = 0) { for (let i = 0; i < n; i++) { const x = (hash(i + seed) - .5) * 360, y = (hash(i * 2 + seed) - .5) * 50, s = .7 + hash(i * 3 + seed) * .5;
    const pg = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, g);
    el("path", { d: "M0 0 m-30 0 a30 11 0 1 0 60 0 a30 11 0 1 0 -60 0 M0 0 L28 -4", fill: "#4E9A44", stroke: "#2E5A2A", "stroke-width": 2 }, pg);
    if (i % 2 === 0) { const f = el("g", { transform: "translate(4 -6)" }, pg);
      [-30, -12, 12, 30, 0].forEach(a => el("path", { d: "M0 0 Q-9 -14 0 -30 Q9 -14 0 0 Z", fill: a ? "#F7A8C0" : "#FFD0DC", stroke: "#B8466A", "stroke-width": 1.5, transform: `rotate(${a})` }, f)); } } }

// the title background (dark, gold motes, a big glowing seed under the title)
KIT.defineSet("titleBg", S => {
  el("rect", { x: -1400, y: -900, width: 4720, height: 2600, fill: KIT.rgrad([[0, "#2A2410"], [.6, "#120C06"], [1, "#050302"]], .5, .55, .7) }, S.layer(0, "bg"));
  const Lv = S.layer(.3, "vines"); const vines = [];
  [[-60, -40, 1], [1980, -40, -1], [-60, 1120, 1], [1980, 1120, -1]].forEach(([x, y, sx], i) => { const vg = el("g", { transform: `translate(${x} ${y}) scale(${sx} ${y > 500 ? -1 : 1})` }, Lv); vines.push(vg);
    el("path", { d: "M0 0 Q160 60 260 200 Q320 300 300 420", stroke: "#3A5A2A", "stroke-width": 8, fill: "none" }, vg);
    for (let j = 0; j < 7; j++) el("path", { d: "M0 0 Q14 -18 0 -44 Q-14 -18 0 0 Z", fill: j % 2 ? "#4E8A3A" : "#6AA84A", stroke: "#22381A", "stroke-width": 2, transform: `translate(${60 + j * 36} ${30 + j * 50 - j * j * 2}) rotate(${60 + j * 15})` }, vg); });
  const L1 = S.layer(1, "seed"); const sg = el("g", { transform: "translate(960 850)" }, L1); const seed = makeSeed(sg, 1.6);
  S.update = (t, o) => { seed.set(o.seedGlow == null ? 2.6 : o.seedGlow, t); vines.forEach((v, i) => v.style.opacity = .8); };
});

// close-up: a big trunk being chopped at the forest edge (green past). params: notch 0..1
KIT.defineSet("axeClose", S => {
  el("rect", { x: -1400, y: -900, width: 4720, height: 2600, fill: KIT.lgrad([[0, "#9ED2EA"], [1, "#E6F4E8"]]) }, S.layer(0, "sky"));
  const L1 = S.layer(.35, "far trees"); el("path", { d: hillPath(-1200, 3200, 640, 60, 3, 14), fill: "#7DB46A" }, L1);
  for (let i = 0; i < 18; i++) roundTree(L1, -600 + i * 190 + hash(i) * 60, 700 + hash(i * 2) * 30, 1 + hash(i * 3) * .5, "#5FA85A", "#3E8A48");
  const L2 = S.layer(1, "ground"); el("path", { d: "M-900 900 Q600 880 1000 890 Q1500 900 2900 880 L2900 1600 L-900 1600 Z", fill: "#7AB85C" }, L2);
  const tr = el("g", {}, L2);
  el("path", { d: "M1060 920 Q1080 600 1070 -300 L1330 -300 Q1320 600 1350 920 Z", fill: KIT.lgrad([[0, "#9A6C44"], [.5, "#7A5234"], [1, "#4E3220"]], 0, 0, 1, 0), stroke: INK, "stroke-width": 5 }, tr);
  for (let i = 0; i < 9; i++) el("path", { d: `M${1100 + i * 26} ${900} Q${1090 + i * 26 + (i % 2 ? 12 : -12)} 400 ${1095 + i * 26} -300`, stroke: "#5A3A24", "stroke-width": 3, fill: "none", opacity: .45 }, tr);
  const notch = el("path", { fill: "#E8C890", stroke: INK, "stroke-width": 3 }, tr);
  const notchIn = el("path", { fill: "#C9A066" }, tr);
  S.actorLayer();
  const chips = [...Array(16)].map((_, i) => el("rect", { width: 12 + hash(i) * 10, height: 6 + hash(i * 2) * 5, fill: i % 2 ? "#E8C890" : "#D2A86A", stroke: INK, "stroke-width": 1.5 }, S.layer(1, "chips")));
  const leaves = [...Array(10)].map((_, i) => el("path", { d: "M0 0 Q10 -12 0 -28 Q-10 -12 0 0 Z", fill: i % 2 ? "#5FA85A" : "#3E8A48", stroke: INK, "stroke-width": 1.5 }, S.layer(1, "leaves")));
  const Lfg = S.layer(1.3, "fg"); for (let i = 0; i < 12; i++) tuft(Lfg, -600 + i * 240, 1120 + hash(i) * 20, 1.5, "#5FA048");
  S.update = (t, o) => { const n = clamp(o.notch || 0), d = 20 + 110 * n, y0 = o.notchY || 640;
    notch.setAttribute("d", `M1062 ${y0 - 40 - d * .3} L${1062 + d} ${y0} L1062 ${y0 + 30 + d * .2} Z`); notchIn.setAttribute("d", `M1066 ${y0 - 26 - d * .25} L${1060 + d * .8} ${y0} L1066 ${y0 + 20 + d * .15} Z`);
    const ti = o.lastHit == null ? -9 : o.lastHit, dt = t - ti;
    chips.forEach((c, i) => { const vx = -(180 + hash(i) * 380), vy = -(240 + hash(i * 3) * 300), x = 1062 + vx * dt, y = y0 + vy * dt + 900 * dt * dt;
      c.setAttribute("x", x); c.setAttribute("y", y); c.setAttribute("transform", `rotate(${dt * 600 * (hash(i * 5) - .5)} ${x} ${y})`); c.style.opacity = dt >= 0 && dt < 1.1 ? 1 - dt / 1.1 : 0; });
    leaves.forEach((l, i) => { const dt2 = t - ti + .1, x = 1000 + hash(i) * 500 + Math.sin(dt2 * 3 + i) * 40, y = -60 + dt2 * (120 + hash(i * 2) * 80);
      l.setAttribute("transform", `translate(${x} ${y}) rotate(${dt2 * 120 + i * 40})`); l.style.opacity = dt2 > 0 && dt2 < 4 ? clamp(1 - dt2 / 4) : 0; }); };
});

// trees falling as silhouettes against a sky, the banyan standing behind. params: falls [t...], col (0 silhouette, 1 coloured), sky 0 sunset .. 1 day
KIT.defineSet("fallSil", S => {
  const sky = KIT.lgradLive(["#3A1E3A", "#C8503A", "#F6A23A"]);
  el("rect", { x: -1400, y: -900, width: 4720, height: 2600, fill: sky.url }, S.layer(0, "sky"));
  const sun = el("circle", { cx: 1300, cy: 640, r: 150, fill: "#FFD26A", opacity: .9 }, S.layer(.05, "sun"));
  const Lb = S.layer(.25, "banyan"); const banG = el("g", { transform: "translate(960 760) scale(.62)" }, Lb);
  const banP = palette(); drawBanyanMini(banG, banP);
  const Lh = S.layer(.4, "hills"); const hills = el("path", { d: hillPath(-1200, 3200, 760, 40, 6, 16) }, Lh);
  const L1 = S.layer(1, "trees"); const ground = el("path", { d: "M-900 860 Q600 840 1000 850 Q1500 860 2900 840 L2900 1600 L-900 1600 Z" }, L1);
  const TR = []; [[-60, 870, 1.9], [230, 862, 2.2], [520, 866, 1.7], [1420, 862, 1.8], [1700, 870, 2.2], [1990, 866, 1.9]].forEach(([x, y, s], i) => {
    const g = el("g", { transform: `translate(${x} ${y})` }, L1), rt = roundTree(g, 0, 0, s, "#5FA85A", "#3E8A48"); TR.push({ g, rt, x, y, s, dir: x < 960 ? -1 : 1, paths: [...rt.g.querySelectorAll("path,circle")] });
    stump(L1, x, y, s * .45); });
  TR.forEach(T => T.paths.forEach(p => { p.dataset.f = p.getAttribute("fill") || "none"; }));
  const dust = [...Array(8)].map(() => el("ellipse", { fill: "#E8C8A0" }, L1));
  S.actorLayer();
  S.update = (t, o) => { const col = clamp(o.col || 0), sk = clamp(o.sky || 0), falls = o.falls || [];
    sky.set([mixc("#3A1E3A", "#7EC6EE", sk), mixc("#C8503A", "#BFE6F6", sk), mixc("#F6A23A", "#EAF7FB", sk)]); sun.style.opacity = 1 - sk;
    const silC = "#1E1218"; banP.apply(1); banG.querySelectorAll("path").forEach(p => { if (!p.dataset.f) p.dataset.f = p.getAttribute("fill") || "none"; p.setAttribute("fill", p.dataset.f === "none" ? "none" : mixc(silC, p.dataset.f, col)); p.setAttribute("stroke", col > .5 ? INK : silC); });
    hills.setAttribute("fill", mixc("#2A1820", "#7DB46A", col)); ground.setAttribute("fill", mixc("#1A1014", "#6FA85C", col));
    TR.forEach((T, i) => { const tf = falls[i]; let a = 0; if (tf != null && t > tf) { const k = clamp((t - tf) / 1.3); a = T.dir * 88 * k * k; if (k >= 1) a = T.dir * (88 + Math.sin((t - tf - 1.3) * 18) * 3 * Math.exp(-(t - tf - 1.3) * 5)); }
      T.g.setAttribute("transform", `translate(${T.x} ${T.y}) rotate(${a})`);
      T.paths.forEach(p => { if (p.dataset.f === "#fff") p.style.opacity = col; else if (p.dataset.f !== "none") p.setAttribute("fill", mixc(silC, p.dataset.f, col)); p.setAttribute("stroke", col > .5 ? INK : silC); }); });
    dust.forEach((d, i) => { const T = TR[i % TR.length], tf = falls[i % TR.length]; const dt = tf == null ? -1 : t - tf - 1.25;
      d.setAttribute("cx", T.x + T.dir * (150 + i * 20) * T.s / 2 + dt * T.dir * 60); d.setAttribute("cy", T.y - 20 - dt * 30); d.setAttribute("rx", 60 + dt * 140); d.setAttribute("ry", 20 + dt * 40);
      d.style.opacity = dt > 0 && dt < 1.5 ? (1 - dt / 1.5) * .7 : 0; d.setAttribute("fill", mixc("#5A3A30", "#E8D0A8", col)); }); };
});

// Meera's room at night: params glow (the far banyan in the window), morning 0..1, dream 0..1 (a green forest grows over her bed)
KIT.defineSet("room", S => {
  const L0 = S.layer(.15, "outside"); const osky = KIT.lgradLive(["#0B1532", "#22305E", "#3A3A5A"]);
  el("rect", { x: 1000, y: 0, width: 900, height: 900, fill: osky.url }, L0);
  const ostars = el("g", {}, L0); for (let i = 0; i < 40; i++) el("circle", { cx: 1060 + hash(i) * 780, cy: 60 + hash(i * 2) * 380, r: 1 + hash(i * 3) * 2, fill: "#FFF8E0" }, ostars);
  const ofield = el("path", { d: "M1000 560 Q1300 540 1500 550 Q1700 560 1900 545 L1900 900 L1000 900 Z", fill: "#262C44" }, L0);
  const obanG = el("g", { transform: "translate(1500 560) scale(.36)" }, L0);
  const obanGlow = el("ellipse", { cx: 0, cy: -320, rx: 640, ry: 380, fill: KIT.rgrad([[0, "#FFE7A0", .95], [.5, "#FFC94A", .4], [1, "#FFB020", 0]]), opacity: 0 }, obanG);
  const obP = palette(); drawBanyanMini(obanG, obP); obP.apply(1);
  const obLeaves = []; for (let i = 0; i < 30; i++) obLeaves.push(el("circle", { cx: (hash(i) - .5) * 900, cy: -330 + (hash(i * 2) - .5) * 260, r: 10, fill: "#FFE27A" }, obanG));
  const Lw = S.layer(1, "room"); const wall = KIT.lgradLive(["#2E3450", "#232840"]);
  el("path", { d: `M-400 -200 L2400 -200 L2400 900 L-400 900 Z M1300 200 L1300 640 L1720 640 L1720 200 Z`, fill: wall.url, "fill-rule": "evenodd" }, Lw);
  const sunbeam = el("path", { d: "M1300 220 L1720 220 L1500 900 L760 900 Z", fill: "#FFE6A0", opacity: 0 }, Lw);
  const moon = el("path", { d: "M1300 220 L1720 220 L1420 900 L700 900 Z", fill: "#9AB0E0", opacity: .1 }, Lw);
  el("rect", { x: 1290, y: 190, width: 440, height: 460, fill: "none", stroke: "#5A3A24", "stroke-width": 22 }, Lw);
  el("rect", { x: 1290, y: 190, width: 440, height: 460, fill: "none", stroke: INK, "stroke-width": 4 }, Lw);
  for (let i = 1; i < 5; i++) el("line", { x1: 1300 + i * 84, y1: 200, x2: 1300 + i * 84, y2: 640, stroke: "#6A6A72", "stroke-width": 8 }, Lw);
  el("rect", { x: 1270, y: 640, width: 480, height: 26, fill: "#6A4A30", stroke: INK, "stroke-width": 3 }, Lw);
  // shelf with books, a calendar-like picture, a hook with the school bag
  el("rect", { x: 160, y: 300, width: 300, height: 18, fill: "#6A4A30", stroke: INK, "stroke-width": 3 }, Lw);
  [["#C0503A", 30], ["#3A7AC0", 24], ["#E8B83A", 28], ["#4E9A44", 22]].reduce((x, [c, w]) => { el("rect", { x, y: 230, width: w, height: 70, fill: c, stroke: INK, "stroke-width": 2.5 }, Lw); return x + w + 4; }, 180);
  const bagG = el("g", { transform: "translate(620 420)" }, Lw); PROPS.bag(bagG);
  const floor = el("path", { d: "M-400 900 L2400 900 L2400 1600 L-400 1600 Z", fill: "#4A3A34" }, Lw);
  el("rect", { x: -400, y: 896, width: 2800, height: 10, fill: "#2E2420" }, Lw);
  // the mat + pillow
  const mat = el("path", { d: "M180 990 L1100 990 L1140 1050 L140 1050 Z", fill: "#C9A46A", stroke: INK, "stroke-width": 3 }, Lw);
  for (let i = 0; i < 12; i++) el("line", { x1: 180 + i * 78, y1: 992, x2: 150 + i * 82, y2: 1048, stroke: "#A8844A", "stroke-width": 3 }, Lw);
  el("ellipse", { cx: 280, cy: 975, rx: 110, ry: 34, fill: "#F2EEF8", stroke: INK, "stroke-width": 3 }, Lw);
  S.actorLayer();
  const Ld = S.layer(1, "dream"); const dreamT = [];
  for (let i = 0; i < 9; i++) { const g = el("g", {}, Ld); const rt = roundTree(g, 0, 0, 1, "#7FD07A", "#4EAA5A"); dreamT.push({ g, x: 60 + i * 230 + hash(i) * 60, y: 1000 - hash(i * 2) * 40, s: 1.6 + hash(i * 3) * 1.1 }); }
  const fireflies = [...Array(16)].map(() => el("circle", { r: 5, fill: "#E8FFB0" }, Ld));
  const tint = el("rect", { x: -1400, y: -900, width: 4720, height: 2600, fill: "#FFB860", opacity: 0 }, S.layer(1.0001, "tint"));
  S.update = (t, o) => { const gl = o.glow || 0, m = o.morning || 0, d = o.dream || 0;
    osky.set([mixc("#0B1532", "#F6C48A", m), mixc("#22305E", "#FBE2B8", m), mixc("#3A3A5A", "#FFF2D8", m)]); ostars.style.opacity = 1 - m;
    ofield.setAttribute("fill", mixc("#262C44", "#C9A472", m)); obanGlow.setAttribute("opacity", gl * (.75 + .25 * Math.sin(t * 2.4)));
    obLeaves.forEach((l, i) => l.style.opacity = clamp(gl * 1.4 - hash(i * 7) * .4) * (.5 + .5 * Math.sin(t * 3 + i)));
    wall.set([mixc("#2E3450", "#E8C89A", m), mixc("#232840", "#C9A27A", m)]); floor.setAttribute("fill", mixc("#4A3A34", "#9A7A5A", m));
    moon.style.opacity = .1 * (1 - m); sunbeam.style.opacity = m * .35;
    dreamT.forEach((T, i) => { const k = clamp(d * 1.6 - hash(i * 5) * .6); T.g.setAttribute("transform", `translate(${T.x} ${T.y}) scale(${T.s * ease(k)}) rotate(${Math.sin(t + i) * 1.5})`); T.g.style.opacity = .55 * k; });
    fireflies.forEach((f, i) => { f.setAttribute("cx", 100 + hash(i) * 1700 + Math.sin(t * .7 + i) * 50); f.setAttribute("cy", 300 + hash(i * 2) * 600 + Math.cos(t * .9 + i) * 30); f.style.opacity = d * (.4 + .6 * Math.abs(Math.sin(t * 2 + i))); });
    tint.setAttribute("opacity", m * .1); };
});

// close-up: two hands wrap the seed in a cotton handkerchief. params: fold 0..1, seedGlow, open 0..1 (hands come in)
KIT.defineSet("hanky", S => {
  el("rect", { x: -1400, y: -900, width: 4720, height: 2600, fill: KIT.rgrad([[0, "#3A3020"], [.7, "#151020"], [1, "#0A0810"]], .5, .5, .7) }, S.layer(0, "bg"));
  const L = S.layer(1, "hands"); const skin = "#C98A5C";
  const cloth = el("g", { transform: "translate(960 600)" }, L);
  const sq = el("path", { d: "M-260 -170 L260 -170 L260 170 L-260 170 Z", fill: "#F6F2EA", stroke: INK, "stroke-width": 4 }, cloth);
  el("path", { d: "M-240 -150 L240 -150 L240 150 L-240 150 Z", fill: "none", stroke: "#4A8AD0", "stroke-width": 6, "stroke-dasharray": "18 8" }, cloth);
  const sd = el("g", {}, cloth), seed = makeSeed(sd, 1.1);
  const flaps = [[0, -170, 0], [260, 0, 90], [0, 170, 180], [-260, 0, 270]].map(([x, y, r], i) => { const fg = el("g", { transform: `translate(${x} ${y}) rotate(${r})` }, cloth);
    const f = el("path", { d: "M-262 0 L262 0 L0 190 Z", fill: i % 2 ? "#EFE8DA" : "#F8F4EC", stroke: INK, "stroke-width": 3.5, "stroke-linejoin": "round" }, fg);
    el("path", { d: "M-230 12 L230 12", stroke: "#4A8AD0", "stroke-width": 5, "stroke-dasharray": "18 8" }, fg); return fg; });
  const knot = el("g", { transform: "translate(960 600)" }, L); el("ellipse", { rx: 40, ry: 30, fill: "#F6F2EA", stroke: INK, "stroke-width": 3.5 }, knot);
  [-1, 1].forEach(s => el("path", { d: `M${s * 30} -10 Q${s * 90} -60 ${s * 110} -20 Q${s * 80} 0 ${s * 30} 10 Z`, fill: "#F2ECE0", stroke: INK, "stroke-width": 3 }, knot));
  const hands = [-1, 1].map(s => { const hg = el("g", {}, L);
    el("path", { d: `M${s * 520} 420 Q${s * 420} 300 ${s * 330} 230 L${s * 250} 300 Q${s * 330} 380 ${s * 380} 520 Z`, fill: "#F4C23A", stroke: INK, "stroke-width": 4 }, hg);   // sleeve
    el("ellipse", { cx: s * 280, cy: 230, rx: 120, ry: 90, fill: KIT.lgrad([[0, shade(skin, .1)], [1, shade(skin, -.12)]]), stroke: INK, "stroke-width": 4 }, hg);
    for (let i = 0; i < 4; i++) el("path", { d: `M${s * (190 - i * 6)} ${170 + i * 34} q${-s * 60} 4 ${-s * 70} 22`, stroke: INK, "stroke-width": 3, fill: "none" }, hg);
    el("path", { d: `M${s * 200} 150 q${-s * 50} -30 ${-s * 70} 10`, fill: "none", stroke: INK, "stroke-width": 3 }, hg); return hg; });
  S.update = (t, o) => { const f = clamp(o.fold || 0), h = clamp(o.open == null ? 1 : o.open);
    seed.set(o.seedGlow || 0, t); sd.style.opacity = f < .8 ? 1 : 1 - clamp((f - .8) * 5);
    flaps.forEach((fg, i) => { const k = clamp(f * 4 - i * .75); const [x, y, r] = [[0, -170, 0], [260, 0, 90], [0, 170, 180], [-260, 0, 270]][i];
      fg.setAttribute("transform", `translate(${x} ${y}) rotate(${r}) scale(1 ${Math.max(.001, ease(k))})`); fg.style.display = k > .02 ? "" : "none"; });
    const sc = 1 - .45 * clamp((f - .75) * 4); sq.parentNode.setAttribute("transform", `translate(960 600) scale(${sc})`);
    knot.style.opacity = clamp((f - .85) * 7); knot.setAttribute("transform", `translate(960 ${600 - 120 * (1 - sc)}) scale(${.8 + .2 * clamp((f - .85) * 7)})`);
    hands.forEach((hg, i) => { const s = i ? 1 : -1, dx = s * (1 - h) * 500 + s * Math.sin(t * 1.6 + i) * 6 - s * 40 * Math.sin(f * Math.PI); hg.setAttribute("transform", `translate(${960 + dx} ${600 + (1 - h) * 200})`); }); };
});
