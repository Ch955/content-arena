// Shared helpers for scenes 4-6 of "చివరి చెట్టు రహస్యం" (Editor, 15 Nov 2026). Load after kit.js, cast.js, sets.js.
// Adds: held props (lantern, dosa, hanky, leaf, cap), extra sets (chintuHome, caveMouth, insert), "things" (non-character
// actors drawn in world space: seed meter, locket close-up, cupped palms, boat, wind/echo diagram, drops, pebbles, sunbeam,
// light column, jeep, long shadows, tree eyes), and a shot runner with cross-fades that alternates two cast instances.
"use strict";
const SKIN_M = "#C98A5C";
// ---------------- held props (built lazily by makePerson when st.item/itemL is set) ----------------
PROPS.lantern = p => {   // hurricane lantern hanging from the hand: the handle loop is at the hand (0,0)
  const g = el("g", {}, p);
  el("path", { d: "M-22 34 Q0 -6 22 34", fill: "none", stroke: "#3A2A1E", "stroke-width": 4 }, g);
  el("rect", { x: -26, y: 32, width: 52, height: 12, rx: 5, fill: "#7A3A22", stroke: INK, "stroke-width": 3 }, g);
  const glow = el("ellipse", { cx: 0, cy: 74, rx: 90, ry: 90, fill: KIT.rgrad([[0, "#FFE7A0", .7], [1, "#FFB040", 0]]) }, g);
  el("path", { d: "M-18 44 Q-30 74 -18 104 L18 104 Q30 74 18 44 Z", fill: "#FFF3C8", opacity: .55, stroke: INK, "stroke-width": 3 }, g);
  const flame = el("path", { d: "M0 62 Q10 80 0 92 Q-10 80 0 62 Z", fill: "#FFC23A", stroke: "#E07A20", "stroke-width": 2 }, g);
  [-1, 1].forEach(s => el("line", { x1: s * 22, y1: 44, x2: s * 24, y2: 104, stroke: "#7A3A22", "stroke-width": 4 }, g));
  el("rect", { x: -28, y: 102, width: 56, height: 22, rx: 6, fill: KIT.lgrad([[0, "#9A4A2A"], [1, "#5A2412"]]), stroke: INK, "stroke-width": 3 }, g);
  p._upd = (t, k) => { const f = .85 + .15 * Math.sin(t * 17) * Math.sin(t * 5.3); flame.setAttribute("transform", `translate(0 92) scale(${.9 + .1 * f} ${f}) translate(0 -92)`);
    glow.setAttribute("opacity", .55 + .15 * f); g.setAttribute("transform", `rotate(${-k.itemRot + Math.sin(t * 2.2) * 4})`); };
};
PROPS.dosa = p => { el("path", { d: "M-34 6 Q-30 -30 4 -36 Q34 -34 40 4 Q4 16 -34 6 Z", fill: KIT.lgrad([[0, "#F2C46A"], [1, "#C98A34"]], 0, 0, 1, 1), stroke: INK, "stroke-width": 3 }, p);
  [[-12, -18], [10, -22], [20, -8], [-4, -6]].forEach(([x, y]) => el("ellipse", { cx: x, cy: y, rx: 4, ry: 2.5, fill: "#A8662A", opacity: .6 }, p)); };
PROPS.hanky = p => { const g = el("g", {}, p);   // opened handkerchief with the seed (st.glow); held in front with both hands
  el("path", { d: "M-46 -6 L-10 -30 L46 -18 L40 10 L4 22 L-40 14 Z", fill: "#F7F3EA", stroke: INK, "stroke-width": 2.5 }, g);
  el("path", { d: "M-40 -4 L-10 -24 L40 -14 L35 6 L4 16 L-34 10 Z", fill: "none", stroke: "#4A7AB8", "stroke-width": 2.5, "stroke-dasharray": "6 4" }, g);
  const sg = el("g", { transform: "translate(2 -14)" }, g), sd = makeSeed(sg, .55); p._upd = (t, k) => sd.set(k.glow || 0, t); };
PROPS.cloth = p => { el("path", { d: "M-20 -10 Q0 -22 22 -8 L18 16 Q0 24 -18 14 Z", fill: "#F7F3EA", stroke: INK, "stroke-width": 2.5 }, p);
  el("path", { d: "M-14 -6 Q0 -14 16 -4", fill: "none", stroke: "#4A7AB8", "stroke-width": 2, "stroke-dasharray": "5 3" }, p); };
PROPS.leaf = p => { const g = el("g", { transform: "rotate(-30)" }, p);   // a big dry teak leaf as a fan
  el("path", { d: "M0 0 Q-60 -40 -40 -120 Q0 -150 40 -120 Q60 -40 0 0 Z", fill: KIT.lgrad([[0, "#C9A24A"], [1, "#8A6A2A"]]), stroke: INK, "stroke-width": 3 }, g);
  el("path", { d: "M0 0 L0 -132 M0 -40 L-30 -70 M0 -40 L30 -70 M0 -80 L-26 -106 M0 -80 L26 -106", stroke: "#6A4A1A", "stroke-width": 2.5, fill: "none" }, g); };
PROPS.locketHand = p => { // the locket pinched between fingers (chain hanging)
  el("path", { d: "M0 -16 Q-14 10 -6 30 M0 -16 Q14 12 6 32", fill: "none", stroke: "#D9DEE6", "stroke-width": 2.5 }, p); drawLocket(el("g", { transform: "translate(0 -2)" }, p), 1.1); };

// ---------------- things: simple world-space actors ----------------
// makeThing(build(g) -> parts, draw(t, st, parts), extra st). st: x, y, s, rot, vis + anything.
function makeThing(build, draw, st0 = {}) {
  const g = el("g", {}, null), inner = el("g", {}, g), parts = build(inner) || {};
  const st = Object.assign({ x: 0, y: 0, s: 1, rot: 0, vis: 1, talk: 0, blink: 0 }, st0);
  return KIT.register({ g, st, parts, draw(t) { g.setAttribute("transform", `translate(${st.x} ${st.y}) rotate(${st.rot}) scale(${st.s})`); g.style.opacity = st.vis; if (draw) draw(t, st, parts); } });
}
const pair = f => [f(), f()];   // two instances (for cross-fades between shots)

// ---- seed meter: the seed with three rings (flame = courage, drop = compassion, heart-leaf = sacrifice) ----
// st.lit [0..1 x3], st.pop [t0 x3] (sparkle burst time), st.glow (seed 0..3), st.hands (0..1 show cupped hands + hanky)
const ICONS = {
  flame: "M0 -30 Q18 -10 14 8 Q10 24 0 26 Q-10 24 -14 8 Q-16 -6 -6 -14 Q-4 -2 2 0 Q6 -14 0 -30 Z",
  drop: "M0 -30 Q20 -2 18 10 Q14 26 0 26 Q-14 26 -18 10 Q-20 -2 0 -30 Z",
  heart: "M0 24 Q-30 2 -24 -14 Q-16 -30 0 -16 Q16 -30 24 -14 Q30 2 0 24 Z" };
function makeSeedMeter() {
  return makeThing(g => {
    const P = {};
    P.halo = el("circle", { r: 420, fill: KIT.rgrad([[0, "#FFE9A0", .55], [.5, "#FFC94A", .15], [1, "#FFB020", 0]]) }, g);
    P.hands = el("g", { transform: "translate(0 120)" }, g);
    const hf = KIT.lgrad([[0, shade(SKIN_M, .12)], [1, shade(SKIN_M, -.15)]], 0, 0, 0, 1);
    [-1, 1].forEach(s => { el("path", { d: `M${s * 10} 90 Q${s * 200} 100 ${s * 250} 10 Q${s * 262} -30 ${s * 226} -40 Q${s * 150} 40 ${s * 10} 40 Z`, fill: hf, stroke: INK, "stroke-width": 4 }, P.hands);
      [0, 1, 2, 3].forEach(i => el("path", { d: `M${s * (232 - i * 4)} ${-30 + i * 22} q${s * 26} 2 ${s * 24} 16`, fill: "none", stroke: shade(SKIN_M, -.35), "stroke-width": 3, "stroke-linecap": "round" }, P.hands)); });
    el("path", { d: "M-240 -6 L-90 -70 L120 -64 L250 -10 L170 60 L-150 64 Z", fill: "#F7F3EA", stroke: INK, "stroke-width": 4 }, P.hands);
    el("path", { d: "M-214 -6 L-88 -56 L116 -52 L224 -10 L160 46 L-140 50 Z", fill: "none", stroke: "#4A7AB8", "stroke-width": 5, "stroke-dasharray": "14 9" }, P.hands);
    el("path", { d: "M-150 64 Q-120 20 -60 10 M170 60 Q130 20 80 12", fill: "none", stroke: "#D8CFBE", "stroke-width": 3 }, P.hands);
    P.rings = [170, 232, 294].map((r, i) => { const rg = el("g", {}, g);
      const dim = el("circle", { r, fill: "none", stroke: "#8A6A44", "stroke-width": 5, "stroke-dasharray": "3 13", opacity: .75 }, rg);
      const wide = el("circle", { r, fill: "none", stroke: "#FFC94A", "stroke-width": 30, opacity: 0 }, rg);
      const lit = el("circle", { r, fill: "none", stroke: "#FFE48A", "stroke-width": 8, opacity: 0 }, rg);
      const a = (-58 + i * 0) * Math.PI / 180, ix = Math.cos(a) * r, iy = Math.sin(a) * r;
      const ic = el("g", { transform: `translate(${ix} ${iy})` }, rg);
      const disc = el("circle", { r: 34, fill: "#3A2A1C", stroke: "#8A6A44", "stroke-width": 4 }, ic);
      const icon = el("path", { d: ICONS[["flame", "drop", "heart"][i]], fill: "#7A6040", stroke: INK, "stroke-width": 2 }, ic);
      if (i === 2) el("path", { d: "M0 20 L0 -6 M0 4 L-8 -4 M0 8 L8 0", stroke: "#3A2A1C", "stroke-width": 2, fill: "none" }, ic);
      const burst = el("g", {}, ic); for (let j = 0; j < 10; j++) el("path", { d: "M0 -40 L4 -62 L0 -80 L-4 -62 Z", fill: "#FFF2B0", transform: `rotate(${j * 36})` }, burst);
      return { r, dim, wide, lit, disc, icon, burst, ic }; });
    P.seedG = el("g", {}, g); P.seed = makeSeed(P.seedG, 2.3);
    return P;
  }, (t, st, P) => {
    P.hands.style.opacity = st.hands; P.halo.setAttribute("opacity", .25 + .25 * (st.glow / 3) + .1 * Math.sin(t * 3));
    P.seedG.setAttribute("transform", `translate(0 ${Math.sin(t * 1.6) * 6 - 10})`); P.seed.set(st.glow, t);
    P.rings.forEach((R, i) => { const k = clamp(st.lit[i]), pl = .85 + .15 * Math.sin(t * 4 + i);
      R.lit.setAttribute("opacity", k * pl); R.wide.setAttribute("opacity", k * .28 * pl); R.dim.setAttribute("opacity", .75 * (1 - k * .8));
      R.icon.setAttribute("fill", mixc("#7A6040", "#FFE48A", k)); R.disc.setAttribute("fill", mixc("#3A2A1C", "#C9861E", k)); R.disc.setAttribute("stroke", mixc("#8A6A44", "#FFF2B0", k));
      const pt = st.pop[i], ph = pt == null ? -1 : (t - pt) / .9;
      R.burst.style.opacity = ph > 0 && ph < 1 ? (1 - ph) : 0; R.burst.setAttribute("transform", `scale(${.6 + ph * 1.2}) rotate(${ph * 40})`);
      R.ic.setAttribute("transform", `translate(${Math.cos(-58 * Math.PI / 180) * R.r} ${Math.sin(-58 * Math.PI / 180) * R.r}) scale(${1 + (ph > 0 && ph < 1 ? Math.sin(ph * Math.PI) * .5 : 0)})`); });
  }, { lit: [0, 0, 0], pop: [null, null, null], glow: 0, hands: 1 });
}

// ---- the locket close-up: st.open 0..1 (lid swings open), st.shine ----
function makeLocketBig() {
  return makeThing(g => {
    const P = {}; const silver = KIT.lgrad([[0, "#FFFFFF"], [.45, "#CBD3DD"], [1, "#7E8896"]], 0, 0, 1, 1);
    el("path", { d: "M-6 -300 Q-120 -420 -300 -520 M6 -300 Q120 -420 300 -520", fill: "none", stroke: "#D9DEE6", "stroke-width": 7 }, g);
    el("circle", { cx: 0, cy: -282, r: 16, fill: "none", stroke: "#C8D0DA", "stroke-width": 7 }, g);
    // base (holds the portrait)
    el("ellipse", { rx: 210, ry: 260, fill: silver, stroke: "#4A5260", "stroke-width": 7 }, g);
    el("ellipse", { rx: 182, ry: 230, fill: "#3A3026", stroke: "#8C96A4", "stroke-width": 5 }, g);
    const por = el("g", {}, g); P.por = por;
    const cp = KIT.uid("lk"); el("ellipse", { rx: 176, ry: 224 }, el("clipPath", { id: cp }, KIT.defs)); por.setAttribute("clip-path", `url(#${cp})`);
    el("rect", { x: -200, y: -240, width: 400, height: 480, fill: KIT.lgrad([[0, "#F6E6C0"], [1, "#E2C690"]]) }, por);
    // mother: our own painted portrait (smiling, center-parted hair, small bindi, maroon saree with a gold border)
    el("path", { d: "M-170 240 Q-160 120 -70 96 L70 96 Q160 120 170 240 Z", fill: KIT.lgrad([[0, "#9A2A3A"], [1, "#6A1A26"]]), stroke: INK, "stroke-width": 4 }, por);
    el("path", { d: "M-150 150 Q-60 110 40 230", fill: "none", stroke: "#E8B83A", "stroke-width": 12 }, por);
    el("path", { d: "M-24 60 L-22 104 L22 104 L24 60 Z", fill: "#B97A52", stroke: INK, "stroke-width": 3 }, por);
    el("path", { d: "M-92 -10 Q-104 -130 0 -136 Q104 -130 92 -10 Q96 70 70 96 L-70 96 Q-96 70 -92 -10 Z", fill: "#1E140E", stroke: INK, "stroke-width": 3 }, por);
    el("path", { d: "M-70 -20 Q-72 -100 0 -104 Q72 -100 70 -20 Q70 40 40 66 Q0 90 -40 66 Q-70 40 -70 -20 Z", fill: KIT.lgrad([[0, "#C98E62"], [1, "#A86E44"]]), stroke: INK, "stroke-width": 3.5 }, por);
    el("path", { d: "M0 -104 Q-40 -96 -66 -40 Q-50 -80 0 -88 Z M0 -104 Q40 -96 66 -40 Q50 -80 0 -88 Z", fill: "#1E140E" }, por);
    el("line", { x1: 0, y1: -104, x2: 0, y2: -88, stroke: "#C0392B", "stroke-width": 3 }, por);
    el("circle", { cx: 0, cy: -58, r: 6, fill: "#C0392B" }, por);
    [-1, 1].forEach(s => { el("path", { d: `M${s * 16} -30 Q${s * 30} -40 ${s * 44} -30`, stroke: INK, "stroke-width": 4.5, fill: "none", "stroke-linecap": "round" }, por);  // kind, smiling closed-crescent eyes
      el("path", { d: `M${s * 14} -50 Q${s * 30} -58 ${s * 48} -50`, stroke: "#2A1A10", "stroke-width": 4, fill: "none" }, por);
      el("ellipse", { cx: s * 42, cy: 0, rx: 12, ry: 7, fill: "#E8806A", opacity: .4 }, por);
      el("circle", { cx: s * 72, cy: 6, r: 7, fill: "#E8B83A", stroke: INK, "stroke-width": 2 }, por); });
    el("path", { d: "M-2 -24 Q-6 -2 0 4 Q5 6 9 2", stroke: "#8A5A3A", "stroke-width": 3, fill: "none" }, por);
    el("path", { d: "M-22 26 Q0 44 22 26", stroke: "#8A2A2A", "stroke-width": 5, fill: "none", "stroke-linecap": "round" }, por);
    el("path", { d: "M-100 230 Q-60 160 -20 150", stroke: "#E8B83A", "stroke-width": 6, fill: "none", opacity: .7 }, por);
    P.glass = el("ellipse", { cx: -50, cy: -90, rx: 50, ry: 90, fill: "#fff", opacity: .12, transform: "rotate(20)" }, g);
    // lid (hinged on the left edge, x = -210)
    P.lidG = el("g", {}, g);
    P.lidOut = el("g", {}, P.lidG); el("ellipse", { rx: 210, ry: 260, fill: silver, stroke: "#4A5260", "stroke-width": 7 }, P.lidOut);
    el("ellipse", { rx: 140, ry: 180, fill: "none", stroke: "#8C96A4", "stroke-width": 6 }, P.lidOut);
    el("path", { d: "M0 -50 C-50 -110 -100 -10 0 70 C100 -10 50 -110 0 -50 Z", fill: "#9AA4B2", stroke: "#6A7482", "stroke-width": 3 }, P.lidOut);
    el("ellipse", { cx: -70, cy: -90, rx: 26, ry: 50, fill: "#fff", opacity: .6 }, P.lidOut);
    P.lidIn = el("g", {}, P.lidG); el("ellipse", { rx: 210, ry: 260, fill: KIT.lgrad([[0, "#E6EBF0"], [1, "#9AA4B2"]], 0, 0, 1, 1), stroke: "#4A5260", "stroke-width": 7 }, P.lidIn);
    el("ellipse", { rx: 170, ry: 215, fill: "none", stroke: "#B8C0CA", "stroke-width": 4 }, P.lidIn);
    P.sp = el("g", {}, g); for (let i = 0; i < 4; i++) el("path", { d: "M0 -26 L5 -5 L26 0 L5 5 L0 26 L-5 5 L-26 0 L-5 -5 Z", fill: "#FFFFFF", transform: `translate(${[-120, 150, 60, -160][i]} ${[-200, -120, 200, 120][i]})` }, P.sp);
    return P;
  }, (t, st, P) => { const a = ease(st.open) * Math.PI, c = Math.cos(a);   // lid scaleX: 1 (closed) -> -1 (open, flipped to the left)
    P.lidG.setAttribute("transform", `translate(-210 0) scale(${c} 1) translate(210 0)`); P.lidOut.style.display = c > 0 ? "" : "none"; P.lidIn.style.display = c > 0 ? "none" : "";
    [...P.sp.children].forEach((s, i) => { const ph = fract(t * .5 + i * .27); s.setAttribute("opacity", Math.sin(ph * Math.PI) * st.shine); s.setAttribute("transform", s.getAttribute("transform").replace(/ scale\([^)]*\)/, "") + ` scale(${.4 + Math.sin(ph * Math.PI) * .6})`); });
  }, { open: 0, shine: 1 });
}

// ---- cupped palms with water (scene 5 macro): st.fill 0..1, st.sip (ripple time), st.pour 0..1 (stream on) ----
function makePalms() {
  return makeThing(g => { const P = {};
    const hf = KIT.lgrad([[0, shade(SKIN_M, .14)], [1, shade(SKIN_M, -.18)]], 0, 0, 0, 1);
    el("path", { d: "M-330 120 Q-360 -40 -250 -70 Q-120 -20 0 -20 Q120 -20 250 -70 Q360 -40 330 120 Q160 230 0 230 Q-160 230 -330 120 Z", fill: hf, stroke: INK, "stroke-width": 5 }, g);
    P.bowl = el("ellipse", { cx: 0, cy: 10, rx: 250, ry: 70, fill: shade(SKIN_M, -.25), stroke: INK, "stroke-width": 3 }, g);
    P.water = el("ellipse", { cx: 0, cy: 14, rx: 0, ry: 0, fill: KIT.lgrad([[0, "#CFF0FF", .9], [1, "#5AAAD8", .9]]), stroke: "#3A88B8", "stroke-width": 3 }, g);
    P.rip = [0, 1].map(() => el("ellipse", { cx: 0, cy: 14, fill: "none", stroke: "#F2FBFF", "stroke-width": 3 }, g));
    P.glints = [0, 1, 2].map(i => el("path", { d: "M0 -10 L3 -3 L10 0 L3 3 L0 10 L-3 3 L-10 0 L-3 -3 Z", fill: "#fff" }, g));
    [-1, 1].forEach(s => [0, 1, 2, 3].forEach(i => el("path", { d: `M${s * (300 - i * 34)} ${-60 + i * 6} q${s * 6} -26 ${s * 30} -22`, fill: "none", stroke: INK, "stroke-width": 4, "stroke-linecap": "round" }, g)));
    el("path", { d: "M-230 180 Q0 240 230 180", fill: "none", stroke: shade(SKIN_M, -.35), "stroke-width": 4 }, g);
    P.stream = el("path", { fill: "none", stroke: "#9AD6EE", "stroke-width": 16, "stroke-linecap": "round", opacity: .9 }, g);
    P.drops = [0, 1, 2, 3].map(() => el("ellipse", { rx: 7, ry: 10, fill: "#BFE8FF", stroke: "#3A88B8", "stroke-width": 2 }, g));
    return P;
  }, (t, st, P) => { const f = clamp(st.fill); P.water.setAttribute("rx", 230 * Math.sqrt(f)); P.water.setAttribute("ry", 60 * Math.sqrt(f)); P.water.style.opacity = f > .01 ? 1 : 0;
    P.rip.forEach((r, i) => { const ph = st.sip == null ? -1 : (t - st.sip - i * .25) / 1; r.style.opacity = ph > 0 && ph < 1 ? (1 - ph) * .9 : 0; r.setAttribute("rx", 20 + clamp(ph) * 200 * Math.sqrt(f)); r.setAttribute("ry", 6 + clamp(ph) * 52 * Math.sqrt(f)); r.setAttribute("cx", 120); });
    P.glints.forEach((gl, i) => { const ph = fract(t * .7 + i * .33); gl.setAttribute("transform", `translate(${-120 + i * 110} ${0 + i * 8}) scale(${Math.sin(ph * Math.PI) * 1.4})`); gl.style.opacity = f; });
    const p = st.pour, x0 = 300, y0 = -420; P.stream.setAttribute("d", `M${x0} ${y0} Q${x0 - 30} ${y0 + 200} ${40 + Math.sin(t * 20) * 3} 10`); P.stream.style.opacity = p > 0 ? .85 : 0; P.stream.setAttribute("stroke-width", 4 + 12 * p);
    P.drops.forEach((d, i) => { const ph = fract(t * 2.2 + i / 4); d.setAttribute("cx", lerp(x0 - 60, 40, ph) + i * 8); d.setAttribute("cy", lerp(y0 + 60, 10, ph * ph)); d.style.opacity = p > 0 ? .9 * (1 - ph) : 0; });
  }, { fill: 0, sip: null, pour: 0 });
}

// ---- country boat (scene 5): st.tilt, st.bob ----
function makeBoat() {
  return makeThing(g => { const P = {}; P.b = el("g", {}, g);
    el("path", { d: "M-300 -60 Q-200 40 0 44 Q200 40 300 -60 Q160 -16 0 -14 Q-160 -16 -300 -60 Z", fill: KIT.lgrad([[0, "#9A6A40"], [1, "#5E3E22"]]), stroke: INK, "stroke-width": 5 }, P.b);
    el("path", { d: "M-300 -60 Q-160 -40 0 -38 Q160 -40 300 -60 Q160 -16 0 -14 Q-160 -16 -300 -60 Z", fill: "#3A2614", stroke: INK, "stroke-width": 3 }, P.b);
    [-150, 0, 150].forEach(x => el("path", { d: `M${x - 6} -36 L${x - 6} 32 M${x + 6} -36 L${x + 6} 32`, stroke: "#4A3018", "stroke-width": 3 }, P.b));
    el("path", { d: "M-250 -14 Q0 30 250 -14", fill: "none", stroke: "#B88A5A", "stroke-width": 3, opacity: .7 }, P.b);
    el("rect", { x: -60, y: -46, width: 120, height: 14, rx: 4, fill: "#7A5232", stroke: INK, "stroke-width": 3 }, P.b);   // the seat plank
    P.crack = el("path", { d: "M120 -10 L140 10 L130 24 L152 36", fill: "none", stroke: "#2A1A0C", "stroke-width": 3 }, P.b);
    return P; }, (t, st, P) => { P.b.setAttribute("transform", `translate(0 ${Math.sin(t * 1.4) * st.bob}) rotate(${st.tilt + Math.sin(t * 1.1) * st.bob * .3})`); P.crack.style.opacity = st.old; },
    { tilt: -8, bob: 0, old: 1 });
}

// ---- cave: water drop from a stalactite into a puddle; st.t0 list of hit times ----
function makeDrip() {
  return makeThing(g => { const P = {};
    el("path", { d: "M-70 -560 Q-30 -400 -6 -330 Q0 -310 6 -330 Q30 -400 70 -560 Z", fill: KIT.lgrad([[0, "#56485A"], [1, "#7A6A7E"]]), stroke: "#120C12", "stroke-width": 4 }, g);
    el("path", { d: "M-20 -500 Q-6 -420 -4 -350", fill: "none", stroke: "#A8C8E0", "stroke-width": 3, opacity: .5 }, g);
    P.pud = el("ellipse", { cx: 0, cy: 0, rx: 140, ry: 26, fill: "#2A3A4E", stroke: "#0E1420", "stroke-width": 3 }, g);
    el("ellipse", { cx: -30, cy: -6, rx: 60, ry: 8, fill: "#6A8AA8", opacity: .5 }, g);
    P.drop = el("path", { d: "M0 -16 Q10 0 0 8 Q-10 0 0 -16 Z", fill: "#CFEFFF", stroke: "#3A6A8A", "stroke-width": 2 }, g);
    P.rip = [0, 1, 2].map(() => el("ellipse", { cx: 0, cy: 0, fill: "none", stroke: "#CFEFFF", "stroke-width": 3 }, g));
    P.spl = [0, 1, 2, 3, 4].map(() => el("circle", { r: 5, fill: "#CFEFFF" }, g));
    return P; }, (t, st, P) => {
    let last = null, next = null; for (const h of st.hits) { if (h <= t) last = h; else if (next == null) next = h; }
    // the falling drop: forms 0.6 s before the hit, falls the last 0.35 s
    if (next != null && next - t < .9) { const k = 1 - (next - t) / .9; const fall = clamp((k - .6) / .4); P.drop.style.opacity = 1;
      P.drop.setAttribute("transform", `translate(0 ${-318 + fall * fall * 318}) scale(${.5 + .5 * clamp(k / .6)})`); } else P.drop.style.opacity = 0;
    const ph = last == null ? 9 : t - last;
    P.rip.forEach((r, i) => { const q = (ph - i * .18) / 1.1; r.style.opacity = q > 0 && q < 1 ? (1 - q) * .8 : 0; r.setAttribute("rx", 10 + clamp(q) * 130); r.setAttribute("ry", 3 + clamp(q) * 22); });
    P.spl.forEach((s, i) => { const q = ph / .45, a = (-150 + i * 30) * Math.PI / 180; s.style.opacity = q > 0 && q < 1 ? 1 - q : 0;
      s.setAttribute("cx", Math.cos(a) * q * 50); s.setAttribute("cy", Math.sin(a) * q * 60 + q * q * 40); }); }, { hits: [] });
}
// ---- pebbles + dust falling from the cave ceiling (st.t0 = roar time) ----
function makePebbles(n = 26, x0 = 0, x1 = 1900, yTop = 80, yFloor = 900) {
  return makeThing(g => ({ ps: [...Array(n)].map((_, i) => el("path", { d: `M-${6 + hash(i) * 8} 0 L0 -${6 + hash(i * 3) * 8} L${6 + hash(i * 5) * 8} 0 L0 ${5 + hash(i * 7) * 6} Z`, fill: i % 3 ? "#7A6A72" : "#9A8A86", stroke: "#1A1218", "stroke-width": 2 }, g)),
    dust: [...Array(10)].map((_, i) => el("ellipse", { rx: 70, ry: 30, fill: "#B8A8A0", opacity: 0 }, g)) }),
    (t, st, P) => { const d = t - st.t0;
      P.ps.forEach((p, i) => { const dl = hash(i * 9) * 1.2, q = d - dl, x = lerp(x0, x1, hash(i * 2.3)), yf = yFloor + hash(i * 4) * 60;
        if (q < 0) { p.style.opacity = 0; return; } const y = Math.min(yf, yTop + 900 * q * q * 1.6); p.style.opacity = 1 - clamp((q - 2.5) / 1);
        p.setAttribute("transform", `translate(${x} ${y}) rotate(${q * 400 * (hash(i) - .5)})`); });
      P.dust.forEach((e, i) => { const q = (d - hash(i * 5) * .8) / 2.4, x = lerp(x0, x1, hash(i * 7.7)); e.setAttribute("opacity", q > 0 && q < 1 ? Math.sin(q * Math.PI) * .35 : 0);
        e.setAttribute("cx", x); e.setAttribute("cy", yTop + 40 + q * 220); e.setAttribute("rx", 40 + clamp(q) * 90); e.setAttribute("ry", 18 + clamp(q) * 30); }); }, { t0: 1e9 });
}
// ---- wind + echo diagram (storybook chalk lines): wind enters from the left, hits a crack, echoes bounce off the walls ----
function makeWindEcho() {
  return makeThing(g => { const P = {};
    P.crack = el("path", { d: "M1580 250 L1610 300 L1590 340 L1630 400 L1612 450 L1650 520", fill: "none", stroke: "#0A0608", "stroke-width": 16, "stroke-linejoin": "round" }, g);
    P.streams = [0, 1, 2, 3].map(i => el("path", { d: `M-200 ${330 + i * 70} C300 ${260 + i * 60} 900 ${420 - i * 40} ${1590 + i * 8} ${310 + i * 60}`, fill: "none", stroke: "#DDF2FF", "stroke-width": 7 - i, "stroke-linecap": "round", "stroke-dasharray": "90 70" }, g));
    P.arcs = [...Array(6)].map(() => el("path", { fill: "none", stroke: "#FFE7A0", "stroke-width": 6, "stroke-linecap": "round" }, g));
    return P; }, (t, st, P) => { const k = st.k;
    P.crack.style.opacity = clamp(k * 2); P.streams.forEach((s, i) => { s.style.opacity = k * .8; s.setAttribute("stroke-dashoffset", -t * (340 + i * 40)); });
    P.arcs.forEach((a, i) => { const ph = fract(t * .55 + i / 6), r = 40 + ph * 520, side = i % 2 ? 1 : -1, cx_ = 1610, cy_ = 400;
      const a0 = side > 0 ? -.9 : 2.2, a1 = side > 0 ? .9 : 4.0; const P0 = [cx_ + Math.cos(a0) * r * (side > 0 ? .6 : 1), cy_ + Math.sin(a0) * r], P1 = [cx_ + Math.cos(a1) * r * (side > 0 ? .6 : 1), cy_ + Math.sin(a1) * r];
      a.setAttribute("d", `M${P0[0]} ${P0[1]} A${r * (side > 0 ? .6 : 1)} ${r} 0 0 ${side > 0 ? 1 : 1} ${P1[0]} ${P1[1]}`); a.style.opacity = k * (1 - ph) * .85; }); }, { k: 0 });
}
// ---- a soft beam of light (screen-space-ish, world coords): st.k, from (x0,y0) to a floor span ----
function makeBeam(x0, y0, w0, x1, y1, w1, color = "#FFE7A0") {
  return makeThing(g => { const f = KIT.lgrad([[0, color, .75], [1, color, 0]], 0, 0, 0, 1);
    return { p: el("path", { d: `M${x0 - w0 / 2} ${y0} L${x0 + w0 / 2} ${y0} L${x1 + w1 / 2} ${y1} L${x1 - w1 / 2} ${y1} Z`, fill: f }, g),
      p2: el("path", { d: `M${x0 - w0 / 4} ${y0} L${x0 + w0 / 4} ${y0} L${x1 + w1 / 4} ${y1} L${x1 - w1 / 4} ${y1} Z`, fill: f }, g) }; },
    (t, st, P) => { P.p.style.opacity = st.k * (.55 + .1 * Math.sin(t * 1.3)); P.p2.style.opacity = st.k * .5; }, { k: 0 });
}
// ---- the column of gold light (scene 6): st.k (0..1 rise), st.w ----
function makeLightColumn(h = 2400) {
  return makeThing(g => { const P = {};
    P.outer = el("rect", { x: -160, y: -h, width: 320, height: h, fill: KIT.lgrad([[0, "#FFE9A0", 0], [.2, "#FFE9A0", .45], [1, "#FFD060", .8]]) }, g);
    P.inner = el("rect", { x: -50, y: -h, width: 100, height: h, fill: KIT.lgrad([[0, "#FFFFFF", 0], [.15, "#FFFBE6", .85], [1, "#FFFFFF", 1]]) }, g);
    P.base = el("ellipse", { cx: 0, cy: 0, rx: 260, ry: 60, fill: KIT.rgrad([[0, "#FFFBE6", 1], [1, "#FFD060", 0]]) }, g);
    P.sp = [...Array(16)].map(() => el("circle", { r: 6, fill: "#FFF6C8" }, g));
    return P; }, (t, st, P) => { const k = clamp(st.k), hh = h * ease(k);
    [P.outer, P.inner].forEach(r => { r.setAttribute("y", -hh); r.setAttribute("height", hh); });
    P.outer.setAttribute("x", -160 * st.w); P.outer.setAttribute("width", 320 * st.w); P.inner.setAttribute("x", -50 * st.w * (.9 + .1 * Math.sin(t * 9))); P.inner.setAttribute("width", 100 * st.w * (.9 + .1 * Math.sin(t * 9)));
    P.base.style.opacity = k > 0 ? .8 : 0; P.outer.style.opacity = k > 0 ? 1 : 0; P.inner.style.opacity = k > 0 ? 1 : 0;
    P.sp.forEach((s, i) => { const ph = fract(t * (.4 + hash(i) * .5) + hash(i * 3)); s.setAttribute("cx", (hash(i * 7) - .5) * 260 * st.w + Math.sin(t * 2 + i) * 10); s.setAttribute("cy", -ph * hh);
      s.style.opacity = k > 0 ? Math.sin(ph * Math.PI) : 0; }); }, { k: 0, w: 1 });
}
// ---- jeep far away: two headlights + beams turning (scene 6 wide shot); st.k progress 0..1 ----
function makeJeep() {
  return makeThing(g => { const P = {}; P.body = el("g", {}, g);
    el("path", { d: "M-40 0 L-40 -22 L-14 -24 L-6 -38 L26 -38 L34 -22 L44 -20 L44 0 Z", fill: "#2A2A30", stroke: "#111", "stroke-width": 2 }, P.body);
    [-24, 28].forEach(x => el("circle", { cx: x, cy: 2, r: 9, fill: "#111" }, P.body));
    P.beam = el("path", { d: "M44 -12 L420 -70 L420 50 Z", fill: KIT.lgrad([[0, "#FFF6C8", .75], [1, "#FFF6C8", 0]], 0, 0, 1, 0) }, P.body);
    P.lamp = el("circle", { cx: 44, cy: -12, r: 7, fill: "#FFFBE0" }, P.body); P.halo = el("circle", { cx: 44, cy: -12, r: 26, fill: "#FFF6C8", opacity: .5 }, P.body);
    return P; }, (t, st, P) => { P.body.setAttribute("transform", `rotate(${st.turn})`); });
}
// ---- long sunset shadow under a character: st.len ----
function makeShadow() { return makeThing(g => ({ e: el("ellipse", { cx: -260, cy: 0, rx: 280, ry: 20, fill: "#3A1A0A", opacity: .28 }, g) }), (t, st, P) => P.e.setAttribute("opacity", .28 * st.k), { k: 1 }); }
// ---- the tree's soft eyes of light on the trunk (scene 6) ----
function makeTreeEyes() {
  return makeThing(g => { const P = {}; P.e = [-1, 1].map(s => { const eg = el("g", { transform: `translate(${960 + s * 52} 540)` }, g);
      el("ellipse", { rx: 46, ry: 26, fill: KIT.rgrad([[0, "#FFF6C8", .9], [1, "#FFD060", 0]]) }, eg);
      const lid = el("path", { d: "M-22 0 Q0 -14 22 0 Q0 10 -22 0 Z", fill: "#FFF6D8", stroke: "#E8B040", "stroke-width": 2 }, eg); return { eg, lid }; }); return P; },
    (t, st, P) => { P.e.forEach(E => { E.eg.style.opacity = st.k * (.85 + .15 * Math.sin(t * 2)); const bl = st.blinkT != null && t > st.blinkT && t < st.blinkT + .18 ? .15 : 1;
      E.lid.setAttribute("transform", `scale(1 ${bl * (st.soft ? .7 : 1)})`); }); }, { k: 0, blinkT: null, soft: 1 });
}
// ---- a floating seed (world space) ----
function makeFloatSeed(s = 1) { return makeThing(g => ({ sd: makeSeed(g, s) }), (t, st, P) => P.sd.set(st.glow, t), { glow: 0 }); }
// ---- falling dosa piece (comic slow-mo) ----
function makeDosaFall() { return makeThing(g => { const pg = el("g", {}, g); PROPS.dosa(pg); return { pg }; }, (t, st, P) => {}); }
// ---- music notes / chirp marks ----
function makeChirps() { return makeThing(g => ({ n: [0, 1, 2].map(i => el("path", { d: i === 1 ? "M0 0 L0 -26 L14 -30 L14 -6 M0 0 a6 5 0 1 1 -1 0 M14 -6 a6 5 0 1 1 -1 0" : "M0 0 L0 -26 Q8 -22 12 -14 M0 0 a6 5 0 1 1 -1 0", fill: "none", stroke: "#3A2418", "stroke-width": 3.5, "stroke-linecap": "round" }, g)) }),
  (t, st, P) => P.n.forEach((n, i) => { const ph = (t - st.t0 - i * .25) / 1.2; n.style.opacity = ph > 0 && ph < 1 ? Math.sin(ph * Math.PI) : 0; n.setAttribute("transform", `translate(${20 + i * 26 + ph * 30} ${-ph * 70}) rotate(${Math.sin(ph * 6) * 12})`); }), { t0: 1e9 }); }
// ---- heat haze lines rising (scene 5) ----
function makeHaze(x0 = -300, x1 = 2200, y0 = 760, y1 = 1000) {
  return makeThing(g => ({ w: [...Array(14)].map(() => el("path", { fill: "none", stroke: "#FFF4D8", "stroke-width": 4, "stroke-linecap": "round" }, g)) }),
    (t, st, P) => P.w.forEach((w, i) => { const ph = fract(t * .25 + hash(i)), x = lerp(x0, x1, hash(i * 3.3)), y = lerp(y1, y0, ph) ;
      let d = `M${x} ${y}`; for (let j = 1; j <= 6; j++) d += ` Q${x + j * 30 - 15} ${y + Math.sin(t * 3 + i + j) * 8} ${x + j * 30} ${y}`; w.setAttribute("d", d); w.style.opacity = Math.sin(ph * Math.PI) * .35 * st.k; }), { k: 1 });
}
// ---- a little puff of dust (crack movement) ----
function makePuff() { return makeThing(g => ({ c: [0, 1, 2, 3].map(() => el("circle", { r: 10, fill: "#E8D2AA" }, g)) }),
  (t, st, P) => P.c.forEach((c, i) => { const ph = (t - st.t0 - i * .08) / .9; c.style.opacity = ph > 0 && ph < 1 ? (1 - ph) * .8 : 0; c.setAttribute("cx", (i - 1.5) * 18 * (1 + ph * 2)); c.setAttribute("cy", -ph * 30); c.setAttribute("r", 8 + clamp(ph) * 16); }), { t0: 1e9 }); }

// ---------------- extra sets ----------------
// Chintu's house front, morning. params: none (morning light). Doorstep top at y = 870; ground at ~ 940.
KIT.defineSet("chintuHome", S => {
  const L0 = S.layer(0, "sky"); el("rect", { x: -1400, y: -900, width: 4720, height: 2600, fill: KIT.lgrad([[0, "#F2D9A8"], [.6, "#F8EAC8"], [1, "#FBF2DC"]]) }, L0);
  const sun = el("circle", { cx: 300, cy: 150, r: 60, fill: "#FFF8DC" }, L0); el("circle", { cx: 300, cy: 150, r: 140, fill: "#FFF4D0", opacity: .25 }, L0);
  const Lh = S.layer(.3, "hills"); el("path", { d: hillPath(-1200, 3200, 560, 60, 3, 14), fill: "#D8B888" }, Lh);
  for (let i = 0; i < 10; i++) stump(Lh, -400 + i * 300 + hash(i) * 80, 600 + hash(i * 2) * 20, .6);
  const L = S.layer(1, "house"); S.P0 = {};
  el("path", { d: "M-900 900 L2900 900 L2900 1600 L-900 1600 Z", fill: KIT.lgrad([[0, "#D8B482"], [1, "#B8925E"]]) }, L);
  // the house: lime-washed blue wall, ochre dado, tiled roof
  el("rect", { x: 200, y: 260, width: 1500, height: 640, fill: KIT.lgrad([[0, "#CFE0E4"], [1, "#B4CCD2"]]), stroke: INK, "stroke-width": 5 }, L);
  el("rect", { x: 200, y: 760, width: 1500, height: 140, fill: "#D29A52", stroke: INK, "stroke-width": 4 }, L);
  for (let i = 0; i < 14; i++) el("path", { d: `M${240 + hash(i) * 1400} ${300 + hash(i * 2) * 420} q${10 + hash(i * 3) * 30} 3 ${30 + hash(i * 4) * 30} -2`, stroke: "#A8C0C6", "stroke-width": 2.5, fill: "none" }, L);
  // door (open: dark inside, a pot of water by the door)
  el("rect", { x: 820, y: 400, width: 280, height: 470, fill: "#2A1A12", stroke: INK, "stroke-width": 5 }, L);
  el("rect", { x: 820, y: 400, width: 280, height: 470, fill: KIT.lgrad([[0, "#4A3020", .6], [1, "#120A06", 0]], 0, 0, 1, 0) }, L);
  el("path", { d: "M820 400 L760 420 L760 880 L820 870 Z", fill: "#7A4A2A", stroke: INK, "stroke-width": 4 }, L);
  el("path", { d: "M1100 400 L1160 420 L1160 880 L1100 870 Z", fill: "#7A4A2A", stroke: INK, "stroke-width": 4 }, L);
  el("rect", { x: 790, y: 376, width: 340, height: 30, fill: "#8A5A30", stroke: INK, "stroke-width": 4 }, L);
  for (let i = 0; i < 10; i++) el("path", { d: `M${812 + i * 32} 406 q-8 26 0 46 q8 -20 0 -46 Z`, fill: i % 2 ? "#4E9A44" : "#6AB04E", stroke: "#2E5A2A", "stroke-width": 1.5 }, L);
  // doorstep (gadapa) painted turmeric with red dots
  el("rect", { x: 700, y: 862, width: 520, height: 46, fill: "#E8B830", stroke: INK, "stroke-width": 4 }, L);
  for (let i = 0; i < 9; i++) el("circle", { cx: 730 + i * 58, cy: 885, r: 7, fill: "#C0392B" }, L);
  // window + shelf pots
  el("rect", { x: 380, y: 450, width: 220, height: 190, fill: "#2E2018", stroke: INK, "stroke-width": 5 }, L);
  for (let i = 1; i < 5; i++) el("line", { x1: 380 + i * 44, y1: 450, x2: 380 + i * 44, y2: 640, stroke: "#8A8A8A", "stroke-width": 6 }, L);
  [[1340, 900, 1.1], [1430, 900, .85]].forEach(([x, y, s]) => { const pg = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, L);
    el("path", { d: "M-40 -70 Q-64 -20 -34 0 L34 0 Q64 -20 40 -70 Z", fill: KIT.lgrad([[0, "#D47A45"], [1, "#8E4422"]], 0, 0, 1, 1), stroke: INK, "stroke-width": 3 }, pg);
    el("rect", { x: -26, y: -86, width: 52, height: 18, rx: 6, fill: "#B65E30", stroke: INK, "stroke-width": 3 }, pg); });
  // a muggu (rice-flour pattern) on the ground in front of the step
  const mg = el("g", { transform: "translate(960 1010) scale(1 .32)" }, L);
  for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) if (Math.abs(i) + Math.abs(j) <= 4) el("circle", { cx: i * 46, cy: j * 46, r: 5, fill: "#FFFFFF" }, mg);
  el("path", { d: "M0 -190 Q120 -120 190 0 Q120 120 0 190 Q-120 120 -190 0 Q-120 -120 0 -190 Z M0 -110 L110 0 L0 110 L-110 0 Z", fill: "none", stroke: "#FFFFFF", "stroke-width": 7 }, mg);
  // roof
  el("path", { d: "M120 280 L1780 280 L1700 180 L200 180 Z", fill: "#A8462E", stroke: INK, "stroke-width": 5 }, L);
  for (let r = 0; r < 2; r++) for (let i = 0; i < 34; i++) el("path", { d: `M${210 + i * 46 + r * 23} ${200 + r * 40} q23 26 46 0`, fill: "none", stroke: "#6A2A1A", "stroke-width": 3 }, L);
  // clothesline with a towel (sways)
  el("line", { x1: 1720, y1: 420, x2: 2400, y2: 400, stroke: "#5A4A3A", "stroke-width": 3 }, L);
  S.P0.towel = el("path", { d: "M1840 416 L1960 412 L1966 560 L1846 566 Z", fill: "#C0392B", stroke: INK, "stroke-width": 3 }, L);
  el("rect", { x: 2380, y: 380, width: 20, height: 540, fill: "#7A5232", stroke: INK, "stroke-width": 3 }, L);
  S.actorLayer();
  const Lfg = S.layer(1.3, "foreground"); for (let i = 0; i < 10; i++) tuft(Lfg, -400 + i * 300 + hash(i) * 90, 1130 + hash(i * 3) * 20, 1.4, "#B08A50");
  S.update = (t) => { S.P0.towel.setAttribute("transform", `skewX(${Math.sin(t * 1.6) * 3})`); };
});
// Cave mouth under the hill (outside, morning; cold mist drifting out). params: mist 0..1, dark 0..1 (inner darkness)
KIT.defineSet("caveMouth", S => {
  el("rect", { x: -1400, y: -900, width: 4720, height: 2600, fill: KIT.lgrad([[0, "#E8CFA0"], [1, "#F6E6C6"]]) }, S.layer(0, "sky"));
  el("path", { d: hillPath(-1200, 3200, 600, 80, 6, 12), fill: "#C8A880" }, S.layer(.25, "far"));
  const Lh = S.layer(.7, "hill");
  el("path", { d: "M-500 950 Q-300 260 500 140 Q960 60 1500 160 Q2300 300 2500 950 Z", fill: KIT.lgrad([[0, "#A08670"], [1, "#7A6250"]]), stroke: INK, "stroke-width": 6 }, Lh);
  for (let i = 0; i < 12; i++) el("path", { d: `M${100 + hash(i) * 1800} ${260 + hash(i * 2) * 500} l${40 + hash(i * 3) * 60} ${10 + hash(i * 4) * 20}`, stroke: "#6A5240", "stroke-width": 4, fill: "none" }, Lh);
  [[200, 400, 1], [1700, 380, .8], [600, 230, .7], [1400, 230, .6]].forEach(([x, y, s]) => drawDryTree(Lh, x, y, s, x).leaves.forEach(l => { l.setAttribute("fill", "#A89A50"); l.style.opacity = .8; }));
  const L = S.layer(1, "mouth");
  el("path", { d: "M-900 880 Q400 850 960 860 Q1500 870 2900 860 L2900 1600 L-900 1600 Z", fill: KIT.lgrad([[0, "#C9A272"], [1, "#A8804E"]]) }, L);
  // the jagged opening
  const mouthD = "M620 900 L640 640 L700 560 L760 520 L800 470 L880 440 L960 450 L1040 430 L1120 470 L1180 520 L1240 560 L1280 640 L1310 900 Z";
  el("path", { d: mouthD, fill: "#5A4636", stroke: INK, "stroke-width": 8, transform: "translate(960 900) scale(1.12) translate(-960 -900)" }, L);
  S.dark = el("path", { d: mouthD, fill: KIT.lgrad([[0, "#0C080A"], [.7, "#1A1216"], [1, "#2A2024"]]), stroke: INK, "stroke-width": 5 }, L);
  for (let i = 0; i < 8; i++) { const x = 720 + i * 72; el("path", { d: `M${x - 22} ${470 + Math.abs(i - 3.5) * 22} L${x} ${520 + Math.abs(i - 3.5) * 22 + hash(i) * 40} L${x + 22} ${470 + Math.abs(i - 3.5) * 22} Z`, fill: "#5A4636", stroke: INK, "stroke-width": 3 }, L); }
  [[520, 900, 1.3], [1420, 905, 1], [380, 960, .9], [1600, 950, 1.4]].forEach(([x, y, s]) => { const rg = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, L);
    el("path", { d: "M-60 0 Q-64 -40 -20 -54 Q30 -66 58 -30 Q70 -4 60 0 Z", fill: KIT.lgrad([[0, "#B7A894"], [1, "#7E7060"]], 0, 0, 1, 1), stroke: INK, "stroke-width": 3 }, rg); });
  [[300, 890], [1680, 890]].forEach(([x, y]) => { const tg = el("g", { transform: `translate(${x} ${y})` }, L); drawThorns(tg, x % 7, 1); tg.setAttribute("transform", `translate(${x} ${y}) scale(.6)`); });
  S.mist = [...Array(9)].map(() => el("ellipse", { fill: "#EEF4F8", opacity: 0 }, L));
  S.actorLayer();
  const Lfg = S.layer(1.35, "fg"); for (let i = 0; i < 10; i++) tuft(Lfg, -500 + i * 320 + hash(i) * 90, 1120 + hash(i * 3) * 20, 1.5, "#A8824E");
  S.update = (t, o) => { const m = o.mist == null ? 1 : o.mist;
    S.mist.forEach((e, i) => { const ph = fract(t * .07 + hash(i)); const x = 960 + (hash(i * 3) - .5) * 300 + (i % 2 ? 1 : -1) * ph * 700, y = 820 - hash(i * 5) * 200 + ph * 40;
      e.setAttribute("cx", x); e.setAttribute("cy", y); e.setAttribute("rx", 80 + ph * 240); e.setAttribute("ry", 24 + ph * 40); e.setAttribute("opacity", Math.sin(ph * Math.PI) * .32 * m); }); };
});
// Insert backdrop for close-ups (warm dark with drifting bokeh). params: warm 0..1 (gold vs. evening rose), bright 0..1
KIT.defineSet("insert", S => {
  const bg = KIT.lgradLive(["#2A1A10", "#4A2E16", "#1E120A"]);
  el("rect", { x: -1400, y: -900, width: 4720, height: 2600, fill: bg.url }, S.layer(0, "bg"));
  const Lb = S.layer(.4, "bokeh"); S.bk = [...Array(18)].map((_, i) => el("circle", { r: 30 + hash(i * 3) * 70, fill: i % 3 ? "#FFD877" : "#FFB86A" }, Lb));
  S.actorLayer();
  S.update = (t, o) => { const w = o.warm == null ? 1 : o.warm, b = o.bright || 0;
    bg.set([mixc(mixc("#2A1A10", "#3A1A22", 1 - w), "#6A4A20", b), mixc(mixc("#4A2E16", "#5A2A2E", 1 - w), "#9A6A2A", b), mixc("#1E120A", "#3A2410", b)]);
    S.bk.forEach((c, i) => { c.setAttribute("cx", -100 + hash(i) * 2100 + Math.sin(t * .3 + i) * 40); c.setAttribute("cy", 60 + hash(i * 2) * 960 + Math.cos(t * .25 + i) * 30);
      c.setAttribute("opacity", (.08 + .1 * hash(i * 5)) * (.7 + .3 * Math.sin(t * .8 + i * 2)) * (1 + b)); }); };
});

// ---------------- shot runner ----------------
// shots: [[t0, fn(t, C, op, lt, i), xfade?], ...]; shot i is drawn from t0_i until t0_{i+1} + xfade_{i+1}. The incoming shot
// fades in over its xfade (drawn last = on top). C = cast slot (i % 2) so an actor can be in two shots during a cross-fade.
function runShots(t, shots) {
  for (let i = 0; i < shots.length; i++) { const [t0, fn, x = 0] = shots[i], nx = shots[i + 1] ? (shots[i + 1][2] || 0) : 0, t1 = shots[i + 1] ? shots[i + 1][0] + nx : 1e9;
    if (t < t0 || t >= t1) continue; const op = x > 0 ? rng(t, t0, t0 + x) : 1; fn(t, i % 2, op, t - t0, i); }
}
// a two-instance cast: CAST.me[C], CAST.ch[C] ...
function castPair(make) { return [make(), make()]; }
// talk + extra: chew/laugh motion added to auto lip-sync
const talkOr = (who, t, extra) => Math.max(KIT.talk(who, t), extra || 0);
// ease a value through keyframes [[t, v], ...]
function keys(t, ks) { if (t <= ks[0][0]) return ks[0][1]; for (let i = 1; i < ks.length; i++) if (t <= ks[i][0]) return lerp(ks[i - 1][1], ks[i][1], ease(rng(t, ks[i - 1][0], ks[i][0]))); return ks[ks.length - 1][1]; }
// screen-space tint overlay (sunset grade, memory sepia): one div, set every frame (reset in sceneEnd)
const TINT = (() => { const d = document.createElement("div"); d.className = "fx"; d.style.opacity = 1; d.style.mixBlendMode = "multiply";
  document.getElementById("stage").insertBefore(d, document.getElementById("fx-glow")); return d; })();
const TINT2 = (() => { const d = document.createElement("div"); d.className = "fx"; d.style.opacity = 1; d.style.mixBlendMode = "screen";
  document.getElementById("stage").insertBefore(d, document.getElementById("fx-glow")); return d; })();
function tint(k, css) { TINT.style.opacity = k; if (k > 0) TINT.style.background = css; }
function tint2(k, css) { TINT2.style.opacity = k; if (k > 0) TINT2.style.background = css; }
function resetTints() { TINT.style.opacity = 0; TINT2.style.opacity = 0; }
