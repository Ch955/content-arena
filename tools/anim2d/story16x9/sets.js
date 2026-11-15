// story16x9 sets: backgrounds as functions with parallax layers (p = 0 sky ... 1 actors' ground ... >1 foreground).
// KIT.show(name, {cam, ...params}); params per set are listed above each defineSet. Ground line for actors ≈ y 900–960.
// Colours: warm storybook palette, soft linear gradients only (paper skin bands radial gradients into rings — the few
// radial glows here are brief magic moments).
"use strict";
// --- shared drawing helpers ---
// leafy "cloud" outline: n outward-bulging arcs round an ellipse (storybook foliage)
function scallop(cx_, cy_, rx, ry, n, seed = 0, amp = .2) { let d = ""; const P = i => { const a = (i % n) / n * 6.2832, r = 1 + (hash((i % n) + seed * 31) - .5) * .14; return [cx_ + Math.cos(a) * rx * r, cy_ + Math.sin(a) * ry * r]; };
  for (let i = 0; i <= n; i++) { const [x, y] = P(i); if (!i) { d = `M${x.toFixed(1)} ${y.toFixed(1)}`; continue; }
    const am = (i - .5) / n * 6.2832, k = 1 + amp + hash(i + seed * 7) * amp * .6; d += ` Q${(cx_ + Math.cos(am) * rx * k).toFixed(1)} ${(cy_ + Math.sin(am) * ry * k).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`; }
  return d + " Z"; }
function hillPath(x0, x1, y, amp, seed, steps = 12, bottom = 1400) {
  let d = `M${x0} ${bottom} L${x0} ${y}`; const dx = (x1 - x0) / steps;
  for (let i = 1; i <= steps; i++) { const x = x0 + i * dx, yy = y - amp * (.5 + .5 * Math.sin(i * 1.7 + seed * 3.1) * Math.cos(i * .63 + seed)), cxp = x - dx / 2;
    d += ` Q${cxp} ${yy - amp * .35 * hash(i + seed)} ${x} ${yy}`; }
  return d + ` L${x1} ${bottom} Z`;
}
function cloud(p, x, y, s, fill, op = 1) { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})`, opacity: op }, p);
  [[-70, 10, 50], [-20, -12, 62], [40, -4, 54], [86, 14, 40], [0, 18, 60]].forEach(([cx_, cy_, r]) => el("circle", { cx: cx_, cy: cy_, r, fill }, g));
  el("rect", { x: -110, y: 14, width: 230, height: 44, rx: 22, fill }, g); return g; }
function roundTree(p, x, y, s, c1, c2, trunk = "#6E4A2A") { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p);
  el("path", { d: "M-10 0 L-7 -70 Q-26 -96 -30 -110 M7 -70 L10 0 Z", fill: trunk }, g);
  el("path", { d: "M-11 0 Q-8 -40 -7 -80 L7 -80 Q8 -40 11 0 Z", fill: trunk, stroke: INK, "stroke-width": 2.5 }, g);
  const can = el("g", {}, g);
  [[-36, -110, 46, c2], [34, -112, 44, c2], [0, -150, 56, c1], [-30, -130, 40, c1], [30, -134, 40, c1]].forEach(([cx_, cy_, r, c]) => el("circle", { cx: cx_, cy: cy_, r, fill: c, stroke: INK, "stroke-width": 2.5 }, can));
  el("circle", { cx: -14, cy: -166, r: 18, fill: "#fff", opacity: .14 }, can); return { g, can }; }
function stump(p, x, y, s, c = "#8A6A44") { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p);
  el("path", { d: "M-22 0 L-18 -34 L18 -34 L22 0 Z", fill: c, stroke: INK, "stroke-width": 2.5 }, g);
  el("ellipse", { cx: 0, cy: -34, rx: 18, ry: 6, fill: "#D9B88A", stroke: INK, "stroke-width": 2 }, g); el("ellipse", { cx: 0, cy: -34, rx: 8, ry: 2.6, fill: "none", stroke: "#A88A5A", "stroke-width": 1.5 }, g); return g; }
function tuft(p, x, y, s, c) { return el("path", { d: `M${x - 20 * s} ${y} Q${x - 18 * s} ${y - 30 * s} ${x - 26 * s} ${y - 46 * s} Q${x - 8 * s} ${y - 28 * s} ${x - 4 * s} ${y - 8 * s} Q${x} ${y - 40 * s} ${x + 4 * s} ${y - 58 * s} Q${x + 10 * s} ${y - 30 * s} ${x + 6 * s} ${y - 6 * s} Q${x + 16 * s} ${y - 30 * s} ${x + 30 * s} ${y - 40 * s} Q${x + 20 * s} ${y - 20 * s} ${x + 20 * s} ${y} Z`, fill: c, stroke: INK, "stroke-width": 2 }, p); }
function rainbow(p, cx_, cy_, r) { const g = el("g", { opacity: 0 }, p);
  ["#E8604C", "#F2994A", "#F2C94C", "#7BC04A", "#4AA8D8", "#5A6AC8", "#8A5AB8"].forEach((c, i) => el("path", { d: `M${cx_ - r + i * 22} ${cy_} A${r - i * 22} ${r - i * 22} 0 0 1 ${cx_ + r - i * 22} ${cy_}`, fill: "none", stroke: c, "stroke-width": 23, opacity: .62 }, g));
  return g; }
function birdsV(p, n, seed) { return [...Array(n)].map((_, i) => el("path", { fill: "none", stroke: "#3A2A22", "stroke-width": 4, "stroke-linecap": "round" }, p)); }
function updBirds(arr, t, k, x0, y0, seed = 0) { arr.forEach((b, i) => { const x = ((x0 + i * 70 * hash(i + seed) + t * (90 + 20 * hash(i))) % 2600) - 300, y = y0 + hash(i * 3 + seed) * 160 + Math.sin(t * 2 + i) * 8, f = Math.sin(t * 14 + i * 2) * 9;
    b.setAttribute("d", `M${x - 16} ${y - f} Q${x - 8} ${y - 6} ${x} ${y} Q${x + 8} ${y - 6} ${x + 16} ${y - f}`); b.style.opacity = k; }); }
// a palette registry for sets that blend between two looks (green <-> dry, day <-> night)
function palette() { const L = []; const f = (e, attr, a, b) => { L.push([e, attr, a, b]); e.setAttribute(attr, a); return e; };
  f.apply = k => { for (const [e, attr, a, b] of L) e.setAttribute(attr, mixc(a, b, k)); }; return f; }

// ---------------- Anandapuram village: green (past) <-> dry (present) ----------------
// params: green 0..1 (1 = the green past), trees (defaults to green; regrowth), sprouts 0..1, pond 0..1 (water),
//         birds 0..1, rainbow 0..1, sunset 0..1, banyanGlow 0..1 (the distant last tree glows)
KIT.defineSet("village", S => {
  const P = palette(); // a = dry, b = green  (apply(green))
  const sky = KIT.lgradLive(["#E9B877", "#F6E2B8", "#FBEFD6"]);
  const L0 = S.layer(0, "sky"); el("rect", { x: -1400, y: -900, width: 4720, height: 2600, fill: sky.url }, L0);
  const sun = el("circle", { cx: 1540, cy: 190, r: 70, fill: "#FFF4D0", opacity: .9 }, L0);
  const sunHalo = el("circle", { cx: 1540, cy: 190, r: 150, fill: "#FFF4D0", opacity: .22 }, L0);
  const rb = rainbow(S.layer(.05, "rainbow"), 1000, 760, 760);
  const Lc = S.layer(.1, "clouds"); const clouds = [[200, 160, 1], [900, 110, .8], [1500, 230, .7], [2300, 140, .9], [-400, 200, .8]].map(([x, y, s]) => cloud(Lc, x, y, s, "#FFFFFF", .8));
  const Lbird = S.layer(.3, "birds"), birds = birdsV(Lbird, 9, 1);
  const Lh1 = S.layer(.22, "far hills"); P(el("path", { d: hillPath(-1200, 3200, 560, 90, 1, 16) }, Lh1), "fill", "#D9B98A", "#9CC98A");
  const Lh2 = S.layer(.38, "hills"); P(el("path", { d: hillPath(-1000, 3000, 620, 70, 4, 14) }, Lh2), "fill", "#C9A472", "#7DB46A");
  // the last banyan on the far ridge (it is there in both looks)
  const banG = el("g", { transform: "translate(1580 600) scale(.32)" }, Lh2);
  const banGlow = el("ellipse", { cx: 0, cy: -320, rx: 520, ry: 330, fill: "#FFD867", opacity: 0 }, banG);
  drawBanyanMini(banG, P);
  // forest band: trees (scale with `trees`) + stumps (fade as trees return)
  const Lf = S.layer(.55, "forest"); P(el("path", { d: hillPath(-900, 2900, 690, 26, 7, 20) }, Lf), "fill", "#C49A64", "#6FA85C");
  const forest = [], stumps = [];
  for (let i = 0; i < 30; i++) { const x = -800 + i * 125 + hash(i) * 60, y = 702 + hash(i * 2) * 26, s = .75 + hash(i * 3) * .45;
    if (Math.abs(x - 1580) < 90) continue;
    stumps.push(stump(Lf, x, y, s * .7)); const tr = roundTree(Lf, x, y, s, "#5FA85A", "#3E8A48"); forest.push(tr); }
  forest.forEach(f => { [...f.can.children].forEach((c, j) => { if (c.getAttribute("fill") !== "#fff") P(c, "fill", j % 2 ? "#5FA85A" : "#3E8A48", j % 2 ? "#5FA85A" : "#3E8A48"); }); });
  // village ground
  const Lm = S.layer(1, "village");
  P(el("path", { d: "M-900 760 Q400 730 960 748 Q1500 765 2900 735 L2900 1500 L-900 1500 Z" }, Lm), "fill", "#D8B47E", "#8CC46A");
  P(el("path", { d: "M-900 840 Q600 820 1100 850 Q1700 880 2900 840 L2900 1500 L-900 1500 Z" }, Lm), "fill", "#CFA670", "#7AB85C");
  // fields with rows (crops <-> cracks)
  const field = el("g", {}, Lm); P(el("path", { d: "M-600 800 L380 790 L460 880 L-700 900 Z" }, field), "fill", "#C99A62", "#6FAE4E");
  const rows = []; for (let i = 0; i < 7; i++) rows.push(P(el("path", { d: `M${-640 + i * 8} ${806 + i * 13} L${400 + i * 9} ${796 + i * 12}`, "stroke-width": 5, "stroke-dasharray": "14 9", fill: "none" }, field), "stroke", "#A87A48", "#3E8A3A"));
  const sproutG = el("g", {}, Lm), sprouts = [];
  for (let i = 0; i < 22; i++) { const x = -560 + (i % 11) * 92 + (i > 10 ? 40 : 0), y = 812 + (i > 10 ? 52 : 0) + (i % 11) * -1; const sg = el("g", { transform: `translate(${x} ${y})` }, sproutG);
    const stem = el("path", { d: "M0 0 L0 -20", stroke: "#4E9A3A", "stroke-width": 4, "stroke-linecap": "round" }, sg);
    const l1 = el("path", { d: "M0 -20 Q-12 -30 -18 -20 Q-10 -14 0 -20 Z", fill: "#7BC04A", stroke: "#3A6A2A", "stroke-width": 1.5 }, sg);
    const l2 = el("path", { d: "M0 -20 Q12 -32 20 -22 Q10 -14 0 -20 Z", fill: "#8ACC52", stroke: "#3A6A2A", "stroke-width": 1.5 }, sg); sprouts.push(sg); }
  // dirt path
  P(el("path", { d: "M780 1500 Q860 980 930 880 Q990 800 1060 760 L1110 760 Q1060 820 1040 900 Q1010 1060 1180 1500 Z" }, Lm), "fill", "#E8CC98", "#D9BC86");
  // huts
  [[180, 790, 1], [560, 770, .82], [1300, 778, .9], [2050, 790, 1.05]].forEach(([x, y, s], i) => drawHut(Lm, x, y, s, P, i));
  // well
  const well = el("g", { transform: "translate(1500 840)" }, Lm);
  el("path", { d: "M-60 0 L-60 -60 Q0 -76 60 -60 L60 0 Q0 14 -60 0 Z", fill: "#B9A88C", stroke: INK, "stroke-width": 3 }, well);
  el("ellipse", { cx: 0, cy: -62, rx: 60, ry: 14, fill: "#5A4A3A", stroke: INK, "stroke-width": 3 }, well);
  [-50, 50].forEach(x => el("rect", { x: x - 5, y: -150, width: 10, height: 90, fill: "#7A5232", stroke: INK, "stroke-width": 2.5 }, well));
  el("rect", { x: -60, y: -156, width: 120, height: 12, rx: 4, fill: "#7A5232", stroke: INK, "stroke-width": 2.5 }, well);
  for (let r = 0; r < 3; r++) el("path", { d: `M-60 ${-14 - r * 18} Q0 ${-26 - r * 18} 60 ${-14 - r * 18}`, stroke: "#9A8A70", "stroke-width": 2, fill: "none" }, well);
  // pond (fills with `pond`)
  const pondG = el("g", { transform: "translate(1820 905)" }, Lm);
  P(el("ellipse", { cx: 0, cy: 0, rx: 230, ry: 46 }, pondG), "fill", "#B98E5A", "#7A9A5A");
  for (let i = 0; i < 9; i++) el("path", { d: `M${-180 + i * 42} ${-20 + hash(i) * 30} l${20 + hash(i * 2) * 20} ${-8 + hash(i * 3) * 16} l${14} ${10}`, stroke: "#8A6438", "stroke-width": 2.5, fill: "none" }, pondG);
  const water = el("ellipse", { cx: 0, cy: 2, rx: 220, ry: 40, fill: KIT.lgrad([[0, "#8FD0EA"], [1, "#4A9AC8"]]), stroke: "#3A7AA8", "stroke-width": 3 }, pondG);
  const shine = el("path", { d: "M-120 -8 Q-60 -18 0 -10", stroke: "#fff", "stroke-width": 4, fill: "none", opacity: .7, "stroke-linecap": "round" }, pondG);
  S.actorLayer();
  // foreground grass + flowers
  const Lfg = S.layer(1.3, "foreground"), tufts = [], flowers = [];
  for (let i = 0; i < 16; i++) tufts.push(P(tuft(Lfg, -700 + i * 210 + hash(i) * 80, 1110 + hash(i * 5) * 30, 1.2 + hash(i * 7) * .8, "#B08A50"), "fill", "#B9925A", "#5FA048"));
  for (let i = 0; i < 12; i++) { const fg = el("g", { transform: `translate(${-600 + i * 260 + hash(i * 9) * 90} ${1080 + hash(i * 4) * 30})` }, Lfg);
    [0, 72, 144, 216, 288].forEach(a => el("ellipse", { cx: 0, cy: -9, rx: 6, ry: 10, fill: i % 2 ? "#F5D04A" : "#F2F0F6", transform: `rotate(${a})` }, fg));
    el("circle", { r: 5, fill: "#E8873A" }, fg); flowers.push(fg); }
  const tint = el("rect", { x: -1400, y: -900, width: 4720, height: 2600, fill: "#FF8A3A", opacity: 0 }, S.layer(0.0001, "tint"));
  S.update = (t, o) => { const gr = o.green == null ? 0 : o.green, tr = o.trees == null ? gr : o.trees, sp = o.sprouts || 0, pd = o.pond == null ? gr : o.pond;
    P.apply(gr); sky.set([mixc("#E9B877", "#7EC6EE", gr), mixc("#F6E2B8", "#BFE6F6", gr), mixc("#FBEFD6", "#EAF7FB", gr)]);
    sun.setAttribute("fill", mixc("#FFF0C0", "#FFFBE6", gr)); sunHalo.setAttribute("opacity", .22 + (1 - gr) * .2);
    forest.forEach((f, i) => { const k = clamp(tr * 1.3 - hash(i * 11) * .3); f.g.style.display = k <= .01 ? "none" : ""; f.g.setAttribute("transform", `${f.g.getAttribute("transform").replace(/ scale\([^)]*\)$/, "")} scale(${(.75 + hash(i * 3) * .45) * k})`); });
    stumps.forEach((s, i) => s.style.opacity = 1 - clamp(tr * 1.5));
    sprouts.forEach((s, i) => { const k = clamp(sp * 1.6 - hash(i * 5) * .6); s.style.display = k <= 0 ? "none" : ""; s.setAttribute("transform", `translate(${-560 + (i % 11) * 92 + (i > 10 ? 40 : 0)} ${812 + (i > 10 ? 52 : 0)}) scale(${k * 1.2})`); });
    water.setAttribute("rx", 220 * Math.sqrt(pd)); water.setAttribute("ry", 40 * Math.sqrt(pd)); water.style.opacity = pd > .02 ? 1 : 0; shine.style.opacity = pd > .5 ? .7 : 0;
    flowers.forEach((f, i) => f.style.opacity = clamp(gr * 2 - hash(i) * .8));
    updBirds(birds, t, o.birds == null ? gr : o.birds, 0, 120, 1);
    Lc.children.length && clouds.forEach((c, i) => c.setAttribute("transform", `translate(${(([200, 900, 1500, 2300, -400][i] + t * (6 + i * 2)) % 3200) - 600} ${[160, 110, 230, 140, 200][i]}) scale(${[1, .8, .7, .9, .8][i]})`));
    rb.style.opacity = o.rainbow || 0; banGlow.setAttribute("opacity", (o.banyanGlow || 0) * (.5 + .2 * Math.sin(t * 3)));
    tint.setAttribute("opacity", (o.sunset || 0) * .22); };
});
function drawHut(p, x, y, s, P, i) { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p);
  el("ellipse", { cx: 0, cy: 4, rx: 150, ry: 14, fill: "#2a1408", opacity: .15 }, g);
  P(el("path", { d: "M-120 0 L-120 -120 L120 -120 L120 0 Z", stroke: INK, "stroke-width": 3 }, g), "fill", "#D9B07A", "#E6C08A");
  el("path", { d: "M-120 -40 L120 -40 L120 0 L-120 0 Z", fill: "#B9875A", opacity: .5 }, g);
  el("path", { d: "M-30 0 L-30 -86 Q0 -100 30 -86 L30 0 Z", fill: "#5A3A26", stroke: INK, "stroke-width": 3 }, g);
  el("rect", { x: 56, y: -94, width: 40, height: 34, fill: "#3A2A1E", stroke: INK, "stroke-width": 3 }, g);
  [66, 76, 86].forEach(xx => el("line", { x1: xx, y1: -94, x2: xx, y2: -60, stroke: "#8A6A4A", "stroke-width": 2.5 }, g));
  P(el("path", { d: "M-150 -110 L0 -210 L150 -110 Q0 -96 -150 -110 Z", stroke: INK, "stroke-width": 3.5, "stroke-linejoin": "round" }, g), "fill", "#B89A5E", "#D4AE52");
  for (let k = 0; k < 7; k++) el("path", { d: `M${-130 + k * 40} -112 L${-60 + k * 20} -176`, stroke: "#8A6A34", "stroke-width": 2, opacity: .6 }, g);
  if (i % 2 === 0) { const pt = el("g", { transform: "translate(-80 0)" }, g); el("path", { d: "M-16 -30 Q-24 -10 -12 0 L12 0 Q24 -10 16 -30 Z", fill: "#B5602E", stroke: INK, "stroke-width": 2.5 }, pt); }
  return g; }
function drawBanyanMini(g, P) {   // a small far-away banyan silhouette (village skyline)
  for (let i = 0; i < 14; i++) el("path", { d: `M${-300 + i * 46} -230 Q${-296 + i * 46} -120 ${-300 + i * 46 + hash(i) * 20} 0`, stroke: "#6A4A30", "stroke-width": 6, fill: "none" }, g);
  el("path", { d: "M-70 0 Q-50 -120 -40 -250 L40 -250 Q50 -120 70 0 Z", fill: "#6E4A2E", stroke: INK, "stroke-width": 6 }, g);
  P(el("path", { d: scallop(0, -320, 470, 150, 22, 3, .25), stroke: INK, "stroke-width": 7 }, g), "fill", "#3A743C", "#3A743C");
  [[-220, -380, 200, 90], [60, -420, 230, 100], [260, -350, 180, 80]].forEach(([x, y, rx, ry], j) => P(el("path", { d: scallop(x, y, rx, ry, 12, j + 5, .25), stroke: INK, "stroke-width": 6 }, g), "fill", "#4E8E48", "#4E8E48"));
}

// ---------------- the giant last banyan ----------------
// params: night 0..1, glow 0..1 (leaves glow gold), voice 0..1 (voice-glow at the heart of the trunk; pass KIT.talk("tree",t)),
//         storm 0..1 (clouds, darker, wind), lightning 0..1, green 0..1 (ground turns green, flowers), rainbow 0..1, wind (extra sway)
KIT.defineSet("banyan", S => {
  const sky = KIT.lgradLive(["#8CCBEA", "#CDEAF2", "#F4E6C4"]);
  const L0 = S.layer(0, "sky"); el("rect", { x: -1400, y: -900, width: 4720, height: 2600, fill: sky.url }, L0);
  const stars = el("g", {}, L0); for (let i = 0; i < 90; i++) el("circle", { cx: -300 + hash(i) * 2500, cy: -100 + hash(i * 2) * 620, r: .8 + hash(i * 3) * 2.2, fill: "#FFF8E0" }, stars);
  const moon = el("g", { transform: "translate(1560 170)" }, L0); el("circle", { r: 120, fill: "#FFF3C8", opacity: .12 }, moon); el("circle", { r: 58, fill: "#FFF3C8" }, moon); el("circle", { cx: 22, cy: -12, r: 48, fill: "#1B2850", opacity: 0, class: "moonCut" }, moon);
  const sunD = el("circle", { cx: 1580, cy: 160, r: 64, fill: "#FFF8DC" }, L0);
  const rb = rainbow(S.layer(.05, "rainbow"), 960, 820, 840);
  const Lst = S.layer(.08, "storm"), stormCl = [];
  for (let i = 0; i < 9; i++) stormCl.push(cloud(Lst, -600 + i * 380, 60 + hash(i) * 180, 1.6 + hash(i * 2) * 1.2, i % 2 ? "#3A4256" : "#4A5268"));
  const bolt = el("path", { d: "M1690 380 L1650 520 L1690 528 L1630 740 L1730 548 L1684 540 L1730 380 Z", fill: "#FFFBE0", stroke: "#BFD8FF", "stroke-width": 6, opacity: 0 }, S.layer(.12, "bolt"));
  const Lf = S.layer(.3, "far land"); const far1 = el("path", { d: hillPath(-1200, 3200, 700, 40, 2, 16) }, Lf); const far2 = el("path", { d: hillPath(-1100, 3100, 760, 30, 5, 18) }, Lf);
  const farStumps = []; for (let i = 0; i < 14; i++) farStumps.push(stump(Lf, -500 + i * 220 + hash(i) * 80, 770 + hash(i * 2) * 20, .5));
  // the tree
  const T = S.layer(1, "tree");
  const backGlow = el("ellipse", { cx: 960, cy: 330, rx: 1050, ry: 460, fill: KIT.rgrad([[0, "#FFE7A0", .8], [.55, "#FFC94A", .3], [1, "#FFB020", 0]]), opacity: 0 }, T);
  const ground = el("path", { d: "M-900 900 Q300 860 960 850 Q1600 860 2900 900 L2900 1600 L-900 1600 Z" }, T);
  const ground2 = el("path", { d: "M-900 980 Q500 950 1000 975 Q1600 1000 2900 970 L2900 1600 L-900 1600 Z" }, T);
  const sway = el("g", {}, T);
  const roots = []; for (let i = 0; i < 30; i++) { const x = 230 + i * 50 + hash(i) * 34, top = 360 + hash(i * 2) * 90; if (Math.abs(x - 960) < 170) continue;
    const pillar = hash(i * 8) < .22, endY = pillar || hash(i * 5) < .5 ? 870 + hash(i) * 14 : 600 + hash(i) * 200, w = pillar ? 16 + hash(i * 6) * 8 : 3 + hash(i * 6) * 5;
    roots.push(el("path", { d: `M${x} ${top} C${x + (hash(i * 3) - .5) * 40} ${top + 120} ${x - (hash(i * 7) - .5) * 40} ${(top + endY) / 2 + 80} ${x + (hash(i * 4) - .5) * 26} ${endY}`, stroke: "#7A5236", "stroke-width": w, fill: "none", "stroke-linecap": "round" }, sway)); }
  // trunk: several strands
  const trunkFill = KIT.lgrad([[0, "#9A6C44"], [.5, "#7A5234"], [1, "#4E3220"]], 0, 0, 1, 0);
  const trunk = el("path", { d: "M780 880 Q820 820 840 700 Q850 560 820 420 L1100 420 Q1070 560 1080 700 Q1100 820 1150 880 Q1060 900 960 892 Q860 900 780 880 Z", fill: trunkFill, stroke: INK, "stroke-width": 5 }, T);
  T.insertBefore(trunk, sway.nextSibling);
  [[870, 880, 880, 450], [930, 890, 935, 440], [1000, 890, 1005, 445], [1060, 880, 1060, 450]].forEach(([x1, y1, x2, y2], i) => el("path", { d: `M${x1} ${y1} Q${x1 + (i % 2 ? 14 : -14)} ${(y1 + y2) / 2} ${x2} ${y2}`, stroke: "#5A3A24", "stroke-width": 4, fill: "none", opacity: .55 }, T));
  // root flare on the ground
  [[-1, 700], [1, 1230], [-1, 760], [1, 1170]].forEach(([s, x], i) => el("path", { d: `M${s < 0 ? 820 : 1110} 860 Q${(x + (s < 0 ? 820 : 1110)) / 2} ${850 - i * 4} ${x} ${880 + i * 6} Q${(x + (s < 0 ? 820 : 1110)) / 2} ${870} ${s < 0 ? 840 : 1090} 884 Z`, fill: "#6E4A2E", stroke: INK, "stroke-width": 3.5 }, T));
  // heart of the tree: a hollow that glows when it speaks
  const knot = "M0 -62 Q22 -58 30 -26 Q40 12 26 44 Q12 70 -6 64 Q-30 52 -34 14 Q-36 -30 -18 -54 Q-10 -63 0 -62 Z";
  el("path", { d: knot, transform: "translate(962 640) scale(1.35)", fill: "#5A3A24", stroke: INK, "stroke-width": 3 }, T);   // bark lip
  const hollow = el("path", { d: knot, transform: "translate(962 642)", fill: "#2E1C10", stroke: INK, "stroke-width": 3 }, T);
  const heart = el("path", { d: knot, transform: "translate(962 646) scale(.82)", fill: KIT.lgrad([[0, "#FFF6C8"], [1, "#FFB830"]]), opacity: 0 }, T);
  const ripples = [0, 1, 2].map(() => el("ellipse", { cx: 960, cy: 640, fill: "none", stroke: "#FFE08A", "stroke-width": 5, opacity: 0 }, T));
  // canopy: scalloped foliage masses (dark mass -> mid clumps -> light top clumps), branches showing through
  const can = el("g", {}, T); const canBlobs = [];
  const canBack = el("path", { d: scallop(960, 300, 900, 215, 40, 1, .2) + scallop(960, 190, 620, 170, 30, 2, .2), stroke: INK, "stroke-width": 5 }, can);
  [[960, 440, 470, 330, 26], [960, 440, 1450, 330, 26], [960, 430, 720, 230, 20], [960, 430, 1200, 230, 20], [960, 440, 230, 400, 16], [960, 440, 1690, 400, 16]].forEach(([x1, y1, x2, y2, w]) =>
    canBlobs.push([el("path", { d: `M${x1} ${y1} Q${(x1 + x2) / 2} ${Math.min(y1, y2) - 30} ${x2} ${y2}`, stroke: "#5A3A24", "stroke-width": w, fill: "none", "stroke-linecap": "round" }, can), -1]));
  const CL = [[300, 330, 230, 120, 0], [620, 270, 250, 130, 0], [960, 230, 280, 140, 0], [1300, 270, 250, 130, 0], [1620, 330, 230, 120, 0],
    [180, 420, 160, 80, 0], [1740, 420, 160, 80, 0], [460, 180, 200, 110, 1], [800, 120, 230, 110, 1], [1130, 120, 230, 110, 1], [1460, 180, 200, 110, 1],
    [960, 330, 220, 110, 1], [620, 390, 200, 90, 1], [1300, 390, 200, 90, 1], [640, 90, 150, 70, 2], [960, 50, 170, 70, 2], [1280, 90, 150, 70, 2], [380, 260, 130, 60, 2], [1540, 260, 130, 60, 2], [860, 250, 120, 55, 2], [1080, 250, 120, 55, 2]];
  CL.forEach(([x, y, rx, ry, ring], i) => canBlobs.push([el("path", { d: scallop(x, y, rx, ry, 14 + (ring ? 0 : 4), i * 3 + 7, .24), stroke: INK, "stroke-width": ring === 2 ? 2.5 : 3.5 }, can), ring]));
  const hl = []; for (let i = 0; i < 18; i++) { const c = CL[i % CL.length]; hl.push(el("path", { d: scallop(c[0] - c[2] * .25, c[1] - c[3] * .35, c[2] * .32, c[3] * .25, 8, i, .3), fill: "#fff", opacity: .12 }, can)); }
  const leaves = []; for (let i = 0; i < 80; i++) { const a = hash(i * 7) * Math.PI, r = .3 + .7 * Math.sqrt(hash(i * 9));
    const x = 960 + Math.cos(a) * 860 * r * (i % 2 ? 1 : -1) * .95, y = 420 - Math.sin(a) * 330 * r - 20;
    leaves.push(el("path", { d: "M0 0 Q9 -12 0 -28 Q-9 -12 0 0 Z", fill: "#FFE27A", stroke: "#C98A20", "stroke-width": 1.5, transform: `translate(${x} ${y}) rotate(${hash(i) * 360}) scale(${1 + hash(i * 3)})`, opacity: 0 }, can)); }
  S.actorLayer();
  // fireflies + grass
  const ff = []; for (let i = 0; i < 18; i++) ff.push(el("circle", { r: 4, fill: "#FFF0A0" }, T));
  const Lfg = S.layer(1.35, "foreground"), tufts = [];
  for (let i = 0; i < 14; i++) tufts.push(tuft(Lfg, -600 + i * 230 + hash(i) * 90, 1120 + hash(i * 3) * 30, 1.3 + hash(i * 5) * .8, "#B08A50"));
  const flowers = []; for (let i = 0; i < 14; i++) { const fg = el("g", { transform: `translate(${-500 + i * 230 + hash(i * 9) * 90} ${1060 + hash(i * 4) * 50})` }, Lfg);
    [0, 72, 144, 216, 288].forEach(a => el("ellipse", { cx: 0, cy: -9, rx: 6, ry: 10, fill: i % 3 ? "#F5D04A" : "#F28AA0", transform: `rotate(${a})` }, fg)); el("circle", { r: 5, fill: "#E8873A" }, fg); flowers.push(fg); }
  const nightTint = el("rect", { x: -1400, y: -900, width: 4720, height: 2600, fill: "#0E1838", opacity: 0 }, S.layer(1.0001, "tint"));
  S.update = (t, o) => { const n = o.night || 0, sm = o.storm || 0, gl = o.glow || 0, gr = o.green || 0, v = clamp(o.voice || 0);
    const day = ["#8CCBEA", "#CDEAF2", "#F4E6C4"], nig = ["#0B1532", "#1B2A55", "#33406A"], sto = ["#2A3044", "#4A5066", "#6A6A78"];
    sky.set(day.map((c, i) => mixc(mixc(c, nig[i], n), sto[i], sm)));
    stars.style.opacity = n * (1 - sm); moon.style.opacity = n * (1 - sm); sunD.style.opacity = (1 - n) * (1 - sm);
    stormCl.forEach((c, i) => { c.style.opacity = sm; c.setAttribute("transform", `translate(${((-600 + i * 380 + t * (30 + i * 6)) % 3400) - 300} ${60 + hash(i) * 180}) scale(${1.6 + hash(i * 2) * 1.2})`); });
    bolt.style.opacity = o.lightning || 0;
    const dark = clamp(n * .55 + sm * .4);
    far1.setAttribute("fill", mixc(mixc("#D2B282", "#9CC98A", gr), "#2A2E48", dark)); far2.setAttribute("fill", mixc(mixc("#C9A472", "#86BC70", gr), "#242840", dark));
    farStumps.forEach(s => s.style.opacity = 1 - gr);
    ground.setAttribute("fill", mixc(mixc("#C9A26E", "#86C060", gr), "#2C3048", dark)); ground2.setAttribute("fill", mixc(mixc("#BC955E", "#76B454", gr), "#262A40", dark));
    const leafDay = ["#3A7A3C", "#4E9446", "#6DB052"], leafNight = ["#16302C", "#1E4236", "#2A5A40"];
    canBack.setAttribute("fill", mixc("#24542C", "#0C1E20", dark));
    canBlobs.forEach(([c, ring], i) => ring < 0 ? c.setAttribute("stroke", mixc("#5A3A24", "#221A16", dark)) : c.setAttribute("fill", mixc(mixc(leafDay[ring], leafNight[ring], dark), "#C9A040", gl * .35 * (ring === 2 ? 1 : .6))));
    hl.forEach(h => h.style.opacity = .08 * (1 - dark) + gl * .05);
    roots.forEach(r => r.setAttribute("stroke", mixc("#7A5236", "#2E2620", dark)));
    trunk.style.filter = ""; trunk.setAttribute("opacity", 1);
    const w = (o.wind || 0) + sm; sway.setAttribute("transform", `rotate(${Math.sin(t * 1.3) * (.3 + w * 1.2)} 960 860)`);
    can.setAttribute("transform", `translate(${Math.sin(t * .9) * (2 + w * 14)} ${Math.sin(t * 1.4) * (1 + w * 4)}) rotate(${Math.sin(t * 1.1) * (.15 + w * .9)} 960 880)`);
    backGlow.setAttribute("opacity", gl * (.75 + .25 * Math.sin(t * 2.4)));
    leaves.forEach((l, i) => { const tw = .55 + .45 * Math.sin(t * (2 + hash(i) * 3) + i); l.setAttribute("opacity", clamp(gl * 1.4 - hash(i * 13) * .4) * tw); });
    heart.setAttribute("opacity", clamp(v * 1.4 + gl * .25)); hollow.setAttribute("fill", mixc("#2E1C10", "#8A5A20", clamp(v + gl * .3)));
    ripples.forEach((r, i) => { const ph = fract(t * .8 + i / 3); r.setAttribute("rx", 46 + ph * 260); r.setAttribute("ry", 70 + ph * 300); r.setAttribute("opacity", v > .05 ? (1 - ph) * .7 * clamp(v * 2) : 0); });
    ff.forEach((f, i) => { const x = 300 + hash(i) * 1300 + Math.sin(t * .6 + i) * 60, y = 560 + hash(i * 2) * 360 + Math.cos(t * .8 + i * 2) * 40;
      f.setAttribute("cx", x); f.setAttribute("cy", y); f.setAttribute("opacity", n * (1 - sm) * (.4 + .6 * Math.abs(Math.sin(t * 2 + i)))); });
    tufts.forEach(tf => tf.setAttribute("fill", mixc(mixc("#B9925A", "#5FA048", gr), "#24283A", dark)));
    flowers.forEach((f, i) => f.style.opacity = clamp(gr * 2 - hash(i) * .8));
    rb.style.opacity = o.rainbow || 0; nightTint.setAttribute("opacity", n * .12 + sm * .1); };
});

// ---------------- Thatayya's house porch (front view) ----------------
// params: evening 0..1 (warm light, lantern on), dry 0..1 (yard colour seen at the sides; default 1)
KIT.defineSet("porch", S => {
  const L0 = S.layer(.4, "yard"); const ysky = KIT.lgradLive(["#F2C98A", "#F8E6C2"]);
  el("rect", { x: -1200, y: -600, width: 4400, height: 1500, fill: ysky.url }, L0);
  const yh = el("path", { d: hillPath(-1200, 3200, 640, 50, 3, 14) }, L0);
  const Lw = S.layer(1, "house");
  const wallF = KIT.lgrad([[0, "#F3E6CC"], [1, "#E2CDA6"]]);
  el("rect", { x: 260, y: 150, width: 1400, height: 720, fill: wallF, stroke: INK, "stroke-width": 4 }, Lw);
  el("rect", { x: 260, y: 740, width: 1400, height: 130, fill: "#C98A4A", opacity: .75 }, Lw);
  el("path", { d: "M260 740 L1660 740", stroke: "#8A5A2E", "stroke-width": 5 }, Lw);
  for (let i = 0; i < 18; i++) el("path", { d: `M${300 + hash(i) * 1300} ${200 + hash(i * 2) * 500} q${10 + hash(i * 3) * 30} ${4} ${30 + hash(i * 4) * 30} ${-2}`, stroke: "#CDB58A", "stroke-width": 2, fill: "none", opacity: .7 }, Lw);
  // door
  el("rect", { x: 1170, y: 380, width: 230, height: 490, fill: "#6A3E22", stroke: INK, "stroke-width": 5 }, Lw);
  el("rect", { x: 1150, y: 360, width: 270, height: 30, fill: "#8A5A30", stroke: INK, "stroke-width": 4 }, Lw);
  [1180, 1290].forEach(x => { el("rect", { x, y: 400, width: 100, height: 460, fill: KIT.lgrad([[0, "#8A5634"], [1, "#6A3E22"]], 0, 0, 1, 0), stroke: INK, "stroke-width": 3 }, Lw);
    [470, 600, 730].forEach(y => el("rect", { x: x + 16, y, width: 68, height: 90, fill: "none", stroke: "#4A2A14", "stroke-width": 3 }, Lw));
    el("circle", { cx: x === 1180 ? x + 88 : x + 12, cy: 640, r: 7, fill: "#D9A84A", stroke: INK, "stroke-width": 2 }, Lw); });
  // a string of mango leaves over the door (thoranam, everyday house decoration)
  for (let i = 0; i < 9; i++) el("path", { d: `M${1180 + i * 27} 392 q-8 26 0 46 q8 -20 0 -46 Z`, fill: i % 2 ? "#4E9A44" : "#6AB04E", stroke: "#2E5A2A", "stroke-width": 1.5 }, Lw);
  // window
  el("rect", { x: 520, y: 400, width: 260, height: 220, fill: "#2E2018", stroke: INK, "stroke-width": 5 }, Lw);
  for (let i = 1; i < 6; i++) el("line", { x1: 520 + i * 43, y1: 400, x2: 520 + i * 43, y2: 620, stroke: "#8A8A8A", "stroke-width": 6 }, Lw);
  [-1, 1].forEach(s => el("rect", { x: s < 0 ? 440 : 780, y: 395, width: 80, height: 230, fill: "#3E7AA0", stroke: INK, "stroke-width": 4 }, Lw));
  el("rect", { x: 500, y: 620, width: 300, height: 22, fill: "#B9A07A", stroke: INK, "stroke-width": 3 }, Lw);
  // clay pots, a wall shelf
  [[930, 860, 1], [1000, 860, .8], [1500, 860, 1.1]].forEach(([x, y, s]) => { const pg = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, Lw);
    el("path", { d: "M-40 -70 Q-64 -20 -34 0 L34 0 Q64 -20 40 -70 Z", fill: KIT.lgrad([[0, "#D47A45"], [1, "#8E4422"]], 0, 0, 1, 1), stroke: INK, "stroke-width": 3 }, pg);
    el("rect", { x: -26, y: -86, width: 52, height: 18, rx: 6, fill: "#B65E30", stroke: INK, "stroke-width": 3 }, pg); });
  // platform (arugu) + steps
  el("path", { d: "M-200 870 L2120 870 L2120 1500 L-200 1500 Z", fill: KIT.lgrad([[0, "#C9B79A"], [1, "#A8957A"]]) }, Lw);
  el("rect", { x: -200, y: 866, width: 2320, height: 14, fill: "#8A7A62" }, Lw);
  for (let i = 0; i < 12; i++) el("line", { x1: -200 + i * 200, y1: 880, x2: -240 + i * 200, y2: 1500, stroke: "#9A8A70", "stroke-width": 3, opacity: .6 }, Lw);
  // rope cot (nulaka mancham)
  const cot = el("g", { transform: "translate(700 960)" }, Lw);
  [[-10, 0], [470, 0]].forEach(([x]) => el("rect", { x: x - 10, y: -60, width: 22, height: 70, fill: "#6A4426", stroke: INK, "stroke-width": 3 }, cot));
  el("rect", { x: -20, y: -76, width: 510, height: 24, rx: 6, fill: "#8A5A30", stroke: INK, "stroke-width": 3.5 }, cot);
  for (let i = 0; i < 16; i++) el("line", { x1: i * 30, y1: -74, x2: i * 30 + 14, y2: -54, stroke: "#E8D6A8", "stroke-width": 3 }, cot);
  S.actorLayer();
  // roof overhang + pillars (in front)
  const Lr = S.layer(1.06, "roof");
  el("path", { d: "M-200 40 L2120 40 L2120 170 L-200 170 Z", fill: "#8A4A30" }, Lr);
  for (let r = 0; r < 3; r++) for (let i = 0; i < 48; i++) el("path", { d: `M${-200 + i * 50 + (r % 2) * 25} ${60 + r * 40} q25 30 50 0`, fill: r === 2 ? "#B5523A" : "#A8462E", stroke: "#5A2A1A", "stroke-width": 3 }, Lr);
  el("rect", { x: -200, y: 166, width: 2320, height: 26, fill: "#6A4426", stroke: INK, "stroke-width": 4 }, Lr);
  const lantern = el("g", { transform: "translate(960 192)" }, Lr); el("line", { x1: 0, y1: 0, x2: 0, y2: 60, stroke: "#3A2A1E", "stroke-width": 3 }, lantern);
  el("path", { d: "M-22 60 L22 60 L18 118 L-18 118 Z", fill: "#3A3A3A", stroke: INK, "stroke-width": 3 }, lantern);
  const flame = el("ellipse", { cx: 0, cy: 92, rx: 12, ry: 20, fill: "#FFD066" }, lantern);
  const lglow = el("circle", { cx: 0, cy: 92, r: 160, fill: KIT.rgrad([[0, "#FFD580", .6], [1, "#FFB040", 0]]), opacity: 0 }, lantern);
  [140, 1780].forEach(x => { el("rect", { x: x - 28, y: 180, width: 56, height: 700, fill: KIT.lgrad([[0, "#9A6A40"], [.5, "#7A5030"], [1, "#5A3A22"]], 0, 0, 1, 0), stroke: INK, "stroke-width": 4 }, Lr);
    el("rect", { x: x - 42, y: 170, width: 84, height: 30, fill: "#6A4426", stroke: INK, "stroke-width": 3 }, Lr); el("rect", { x: x - 40, y: 856, width: 80, height: 26, fill: "#8A7A62", stroke: INK, "stroke-width": 3 }, Lr); });
  const warm = el("rect", { x: -1400, y: -900, width: 4720, height: 2600, fill: "#FF8A3A", opacity: 0 }, S.layer(1.0001, "tint"));
  S.update = (t, o) => { const ev = o.evening || 0, dry = o.dry == null ? 1 : o.dry;
    ysky.set([mixc(mixc("#9AD2EE", "#F2C98A", dry), "#E8905A", ev), mixc(mixc("#DDF0F6", "#F8E6C2", dry), "#F6C08A", ev)]);
    yh.setAttribute("fill", mixc("#86BC70", "#C9A472", dry));
    flame.setAttribute("opacity", ev > 0 ? 1 : 0); flame.setAttribute("ry", 18 + Math.sin(t * 13) * 2);
    lglow.setAttribute("opacity", ev * (.8 + .2 * Math.sin(t * 9))); warm.setAttribute("opacity", ev * .14); };
});

// ---------------- forest path (dry, sparse) toward the hills / cave ----------------
// params: dusk 0..1, green 0..1, cave 0..1 (show the cave mouth on the far hill)
KIT.defineSet("forest", S => {
  const sky = KIT.lgradLive(["#E6C690", "#F4E2BC", "#FBF0D8"]);
  el("rect", { x: -1400, y: -900, width: 4720, height: 2600, fill: sky.url }, S.layer(0, "sky"));
  const L1 = S.layer(.2, "far"), far = el("path", { d: hillPath(-1200, 3200, 520, 120, 8, 12) }, L1);
  const caveH = el("g", { transform: "translate(1400 0)" }, S.layer(.35, "cave hill"));
  const ch = el("path", { d: "M-420 900 Q-300 420 -40 380 Q240 360 420 600 Q520 760 560 900 Z", stroke: INK, "stroke-width": 4 }, caveH);
  el("path", { d: "M-60 900 Q-70 700 40 660 Q150 700 140 900 Z", fill: "#1A1218", stroke: INK, "stroke-width": 4 }, caveH);
  const L2 = S.layer(.45, "trees far"), farTrees = [];
  for (let i = 0; i < 16; i++) farTrees.push(drawDryTree(L2, -700 + i * 200 + hash(i) * 80, 720, .55 + hash(i * 2) * .3, i));
  const L3 = S.layer(1, "path"); const gnd = el("path", { d: "M-900 760 Q600 730 1000 750 Q1500 770 2900 740 L2900 1600 L-900 1600 Z" }, L3);
  const pathD = el("path", { d: "M600 1600 Q760 1000 900 860 Q980 780 1100 752 L1160 752 Q1080 800 1040 880 Q960 1060 1240 1600 Z", fill: "#E2C08C", opacity: .9 }, L3);
  const midTrees = []; [[-80, 930, 1.3], [280, 860, 1], [1500, 870, 1.05], [1880, 950, 1.35], [2300, 900, 1.2]].forEach(([x, y, s], i) => midTrees.push(drawDryTree(L3, x, y, s, i + 30)));
  const rocks = el("g", {}, L3); [[420, 940, 1], [1350, 920, .8], [1700, 990, 1.2], [700, 1000, .7]].forEach(([x, y, s]) => { const rg = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, rocks);
    el("path", { d: "M-60 0 Q-64 -40 -20 -54 Q30 -66 58 -30 Q70 -4 60 0 Z", fill: KIT.lgrad([[0, "#B7A894"], [1, "#7E7060"]], 0, 0, 1, 1), stroke: INK, "stroke-width": 3 }, rg); });
  const bushes = []; [[160, 900], [1180, 870], [2000, 920]].forEach(([x, y], i) => { const b = el("g", { transform: `translate(${x} ${y})` }, L3);
    [[-30, -20, 34], [10, -32, 40], [44, -16, 30]].forEach(([cx_, cy_, r]) => bushes.push(el("circle", { cx: cx_, cy: cy_, r, stroke: INK, "stroke-width": 2.5 }, b))); });
  S.actorLayer();
  const Lfg = S.layer(1.4, "foreground"); const fgTrunk = el("path", { d: "M-200 1200 Q-120 700 -60 300 Q-40 120 -80 -100 L60 -100 Q80 200 60 500 Q40 900 120 1200 Z", fill: "#4A3424", stroke: INK, "stroke-width": 5 }, Lfg);
  const branch = el("path", { d: "M40 120 Q400 60 700 -10 Q760 -20 800 0 Q740 20 700 30 Q420 110 50 190 Z", fill: "#4A3424", stroke: INK, "stroke-width": 4 }, Lfg);
  const fgLeaves = []; for (let i = 0; i < 12; i++) fgLeaves.push(el("path", { d: "M0 0 Q12 -16 0 -40 Q-12 -16 0 0 Z", transform: `translate(${120 + i * 55} ${100 - i * 9 + (i % 2) * 24}) rotate(${150 + (i % 2) * 60})`, stroke: INK, "stroke-width": 1.5 }, Lfg));
  const tufts = []; for (let i = 0; i < 12; i++) tufts.push(tuft(Lfg, 200 + i * 220 + hash(i) * 80, 1110 + hash(i * 3) * 30, 1.4, "#B08A50"));
  S.update = (t, o) => { const d = o.dusk || 0, gr = o.green || 0;
    sky.set([mixc(mixc("#E6C690", "#C77A4A", d), "#8CCBEA", gr * (1 - d)), mixc("#F4E2BC", "#E8A060", d), mixc("#FBF0D8", "#F6CC8A", d)]);
    far.setAttribute("fill", mixc(mixc("#C7A784", "#8A6A70", d), "#8AB08A", gr)); ch.setAttribute("fill", mixc(mixc("#A88A6A", "#6E5258", d), "#7A9A6A", gr));
    caveH.style.opacity = o.cave == null ? 1 : o.cave;
    gnd.setAttribute("fill", mixc(mixc("#CDA670", "#9A7050", d), "#7AB85C", gr));
    bushes.forEach(b => b.setAttribute("fill", mixc(mixc("#9A8A50", "#6A5A40", d), "#4E9A44", gr)));
    fgLeaves.forEach((l, i) => l.setAttribute("fill", mixc(i % 2 ? "#A89048" : "#8A7A3A", "#4E9A44", gr)));
    farTrees.concat(midTrees).forEach(tr => tr.leaves.forEach((l, i) => { l.setAttribute("fill", mixc("#A89A50", "#5AA552", gr)); l.style.opacity = .7 + gr * .3; }));
    tufts.forEach(tf => tf.setAttribute("fill", mixc(mixc("#B9925A", "#7A6040", d), "#5FA048", gr)));
    branch.setAttribute("transform", `rotate(${Math.sin(t * 1.1) * .8} 40 150)`); };
});
function drawDryTree(p, x, y, s, seed) { const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, p), leaves = [];
  el("path", { d: "M-16 0 Q-10 -120 -6 -200 L6 -200 Q10 -120 16 0 Z", fill: "#6E5236", stroke: INK, "stroke-width": 3 }, g);
  [[-1, -150, 70], [1, -120, 80], [-1, -190, 50], [1, -200, 60]].forEach(([sd, y0, len], i) => {
    el("path", { d: `M0 ${y0} Q${sd * len * .5} ${y0 - 20} ${sd * len} ${y0 - 50 - hash(seed + i) * 30}`, stroke: "#6E5236", "stroke-width": 9 - i, fill: "none", "stroke-linecap": "round" }, g);
    for (let j = 0; j < 3; j++) leaves.push(el("ellipse", { cx: sd * len * (.6 + j * .2), cy: y0 - 50 - j * 8, rx: 20, ry: 13, stroke: INK, "stroke-width": 1.5 }, g)); });
  return { g, leaves }; }

// ---------------- dark cave (torch-light: use KIT.torch on top) ----------------
// params: thorns 0..1 (1 = the deer is tangled; 0 = branches pulled apart), eyes 0..1 (two eyes in the dark), light 0..1 (ambient)
KIT.defineSet("cave", S => {
  const L0 = S.layer(0, "dark"); el("rect", { x: -1400, y: -900, width: 4720, height: 2600, fill: KIT.lgrad([[0, "#2A2232"], [.6, "#3A3042"], [1, "#221A24"]]) }, L0);
  const Le = S.layer(.3, "entrance"); el("path", { d: "M-400 900 Q-380 300 -60 160 Q200 120 260 400 Q300 700 280 900 Z", fill: KIT.lgrad([[0, "#4A6A8A"], [1, "#2A3A52"]]), opacity: .55 }, Le);
  const eyes = el("g", { opacity: 0, transform: "translate(1500 520)" }, S.layer(.5, "eyes"));
  [-1, 1].forEach(s => { el("ellipse", { cx: s * 36, cy: 0, rx: 18, ry: 10, fill: "#FFD23A", transform: `rotate(${s * 12} ${s * 36} 0)` }, eyes); el("ellipse", { cx: s * 36, cy: 0, rx: 4, ry: 9, fill: "#1A0E06" }, eyes); });
  const Lw = S.layer(.6, "walls");
  [[-300, 0, 1.2, "#4A3C4C"], [1500, 0, 1.4, "#4A3C4C"], [600, -50, 1, "#423646"]].forEach(([x, y, s, c]) => el("path", { d: `M${x - 400 * s} 1200 Q${x - 360 * s} ${400 + y} ${x - 120 * s} ${200 + y} Q${x + 80 * s} ${120 + y} ${x + 240 * s} ${300 + y} Q${x + 400 * s} 600 ${x + 420 * s} 1200 Z`, fill: c, stroke: "#120C12", "stroke-width": 4 }, Lw));
  for (let i = 0; i < 16; i++) { const x = -300 + i * 160 + hash(i) * 60, l = 80 + hash(i * 2) * 180; el("path", { d: `M${x - 40} -40 Q${x - 10} ${l * .6} ${x + 4} ${l} Q${x + 14} ${l * .6} ${x + 44} -40 Z`, fill: i % 2 ? "#4E4052" : "#56485A", stroke: "#120C12", "stroke-width": 3 }, Lw); }
  const L1 = S.layer(1, "floor"); el("path", { d: "M-900 860 Q200 820 960 850 Q1700 880 2900 840 L2900 1600 L-900 1600 Z", fill: KIT.lgrad([[0, "#5E4E58"], [1, "#3A2E38"]]) }, L1);
  for (let i = 0; i < 26; i++) el("ellipse", { cx: -400 + hash(i) * 2800, cy: 900 + hash(i * 2) * 160, rx: 10 + hash(i * 3) * 24, ry: 6 + hash(i * 4) * 10, fill: "#5A4C54", stroke: "#1A1218", "stroke-width": 2 }, L1);
  [[300, 860], [1700, 870]].forEach(([x, y]) => el("path", { d: `M${x - 50} ${y} Q${x - 10} ${y - 150} ${x} ${y - 180} Q${x + 14} ${y - 140} ${x + 50} ${y} Z`, fill: "#4A3C48", stroke: "#120C12", "stroke-width": 3 }, L1));
  // thorn bush (back half behind the deer, front half after the actors)
  const thornBack = el("g", { transform: "translate(1240 900)" }, L1); drawThorns(thornBack, 0);
  S.actorLayer();
  const Lt = S.layer(1, "thorns front"), thornFront = [];
  [[-1, 0], [1, 1], [-1, 2], [1, 3]].forEach(([sd, i]) => { const g = el("g", { transform: "translate(1240 900)" }, Lt); drawThorns(g, i + 1, sd); thornFront.push([g, sd, i]); });
  const Lfg = S.layer(1.35, "foreground"); [[-150, 1.4], [2100, 1.6]].forEach(([x, s]) => el("path", { d: `M${x - 300 * s} 1300 Q${x - 200 * s} ${900} ${x} ${860} Q${x + 200 * s} 880 ${x + 300 * s} 1300 Z`, fill: "#120C12" }, Lfg));
  const amb = el("rect", { x: -1400, y: -900, width: 4720, height: 2600, fill: "#000", opacity: 0 }, S.layer(1.0001, "dim"));
  S.update = (t, o) => { const th = o.thorns == null ? 1 : o.thorns;
    thornFront.forEach(([g, sd, i]) => g.setAttribute("transform", `translate(${1240 + sd * (1 - th) * 140} ${900}) rotate(${sd * (1 - th) * 34 + Math.sin(t * 8 + i) * th * (o.shakeThorns || 0) * 3} 0 0)`));
    eyes.style.opacity = (o.eyes || 0) * (Math.sin(t * .9) > -.95 ? 1 : 0); amb.setAttribute("opacity", .3 * (1 - (o.light == null ? .6 : o.light))); };
});
function drawThorns(g, seed, sd = 1) { for (let i = 0; i < 6; i++) { const a = (-160 + i * 30 + hash(seed * 10 + i) * 20) * Math.PI / 180, r = 140 + hash(seed + i * 3) * 90;
    const x2 = Math.cos(a) * r * sd, y2 = Math.sin(a) * r * .7 - 20; const d = `M0 0 Q${x2 * .5 + 30 * sd} ${y2 * .5 - 40} ${x2} ${y2}`;
    el("path", { d, stroke: "#120C08", "stroke-width": 11, fill: "none", "stroke-linecap": "round" }, g); el("path", { d, stroke: "#5A3A2A", "stroke-width": 6, fill: "none", "stroke-linecap": "round" }, g);
    for (let j = 1; j < 5; j++) { const k = j / 5, x = lerp(0, x2, k) + (1 - k) * k * 30 * sd, y = lerp(0, y2, k) - (1 - k) * k * 80; el("path", { d: `M${x} ${y} l${8 * (j % 2 ? 1 : -1)} -14 l4 12 Z`, fill: "#3A2418" }, g); }
    el("circle", { cx: x2, cy: y2, r: 5, fill: "#7A3A4A" }, g); } }

// ---------------- the dry cracked pond ----------------
// params: water 0..1 (fills from the centre), green 0..1 (reeds/grass return), heat 0..1 (hazy sun)
KIT.defineSet("pond", S => {
  const sky = KIT.lgradLive(["#F0C27A", "#F8E2B4", "#FCF2DC"]);
  const L0 = S.layer(0, "sky"); el("rect", { x: -1400, y: -900, width: 4720, height: 2600, fill: sky.url }, L0);
  const sun = el("circle", { cx: 420, cy: 170, r: 90, fill: "#FFF6D6" }, L0), sunH = el("circle", { cx: 420, cy: 170, r: 200, fill: "#FFF0C0", opacity: .3 }, L0);
  const L1 = S.layer(.3, "far"), far = el("path", { d: hillPath(-1200, 3200, 600, 60, 9, 16) }, L1); const deadT = [];
  for (let i = 0; i < 6; i++) deadT.push(drawDryTree(L1, -300 + i * 480 + hash(i) * 100, 640, .5, i + 50));
  const Lb = S.layer(1, "basin"); const bank = el("path", { d: "M-900 700 Q400 680 960 690 Q1500 700 2900 690 L2900 1600 L-900 1600 Z" }, Lb);
  const bed = el("ellipse", { cx: 960, cy: 930, rx: 1020, ry: 200 }, Lb);
  const cracks = el("g", {}, Lb), cid = KIT.uid("pc"); const cp = el("clipPath", { id: cid }, KIT.defs); el("ellipse", { cx: 960, cy: 930, rx: 1000, ry: 190 }, cp);
  cracks.setAttribute("clip-path", `url(#${cid})`);
  // cracked mud: jittered grid of tiles (polygons) with dark gaps
  const tiles = []; const cols = 16, rowsN = 6, pt = (i, j) => [ -60 + i * 130 + (hash(i * 7 + j * 13) - .5) * 70, 730 + j * 70 + (hash(i * 3 + j * 17) - .5) * 30 + Math.abs(i - 8) * 0 ];
  el("rect", { x: -100, y: 700, width: 2200, height: 480, fill: "#6A4A2E" }, cracks);
  for (let i = 0; i < cols; i++) for (let j = 0; j < rowsN; j++) { const a = pt(i, j), b = pt(i + 1, j), c = pt(i + 1, j + 1), d = pt(i, j + 1), sh = 5;
    tiles.push(el("path", { d: `M${a[0] + sh} ${a[1] + sh} L${b[0] - sh} ${b[1] + sh} L${c[0] - sh} ${c[1] - sh} L${d[0] + sh} ${d[1] - sh} Z`, fill: mixc("#C9A070", "#B58A5A", hash(i * 5 + j)), stroke: "#E0BE8E", "stroke-width": 2 }, cracks)); }
  const water = el("ellipse", { cx: 960, cy: 930, fill: KIT.lgrad([[0, "#9AD6EE"], [1, "#4A98C6"]]), stroke: "#3A78A8", "stroke-width": 4 }, Lb);
  const ripples = [0, 1, 2].map(() => el("ellipse", { cx: 960, cy: 930, fill: "none", stroke: "#E8F8FF", "stroke-width": 3 }, Lb));
  const log = el("g", { transform: "translate(1460 880) rotate(-6)" }, Lb); el("rect", { x: -150, y: -24, width: 300, height: 48, rx: 24, fill: KIT.lgrad([[0, "#9A7450"], [1, "#6A4A30"]]), stroke: INK, "stroke-width": 3.5 }, log);
  el("ellipse", { cx: 150, cy: 0, rx: 14, ry: 24, fill: "#C9A57A", stroke: INK, "stroke-width": 3 }, log);
  const reeds = []; for (let i = 0; i < 26; i++) { const x = -60 + i * 80 + hash(i) * 40, y = i % 2 ? 745 : 1110 + hash(i) * 20;
    reeds.push(el("path", { d: `M${x} ${y} Q${x + 6} ${y - 60} ${x + (hash(i * 2) - .5) * 60} ${y - 110 - hash(i * 3) * 40}`, "stroke-width": 5, fill: "none", "stroke-linecap": "round" }, Lb)); }
  S.actorLayer();
  const Lfg = S.layer(1.3, "foreground"), tufts = []; for (let i = 0; i < 13; i++) tufts.push(tuft(Lfg, -600 + i * 240 + hash(i) * 90, 1130 + hash(i * 3) * 20, 1.5, "#B08A50"));
  const haze = el("rect", { x: -1400, y: -900, width: 4720, height: 2600, fill: "#FFE6B0", opacity: 0 }, S.layer(1.0001, "haze"));
  S.update = (t, o) => { const w = o.water || 0, gr = o.green || 0, h = o.heat == null ? (1 - gr) : o.heat;
    sky.set([mixc("#F0C27A", "#8CCBEA", gr), mixc("#F8E2B4", "#CDEAF2", gr), mixc("#FCF2DC", "#F4F4E4", gr)]);
    sunH.setAttribute("opacity", .15 + .25 * h); far.setAttribute("fill", mixc("#D2AE7C", "#8AC07A", gr)); deadT.forEach(d => d.g.style.opacity = 1 - gr);
    bank.setAttribute("fill", mixc("#D8B47E", "#8CC46A", gr)); bed.setAttribute("fill", mixc("#B58A5A", "#7A9A5A", gr));
    cracks.style.opacity = 1 - clamp(w * 1.2); water.setAttribute("rx", 1000 * Math.sqrt(w)); water.setAttribute("ry", 190 * Math.sqrt(w)); water.style.opacity = w > .01 ? 1 : 0;
    ripples.forEach((r, i) => { const ph = fract(t * .5 + i / 3); r.setAttribute("rx", 1000 * Math.sqrt(w) * ph * .9); r.setAttribute("ry", 190 * Math.sqrt(w) * ph * .9); r.style.opacity = w > .05 ? (1 - ph) * .6 : 0; });
    reeds.forEach((r, i) => { r.setAttribute("stroke", mixc("#A8885A", "#4E9A3A", gr)); r.setAttribute("transform", `rotate(${Math.sin(t * 1.5 + i) * 2} 0 1000)`); });
    tufts.forEach(tf => tf.setAttribute("fill", mixc("#B9925A", "#5FA048", gr))); haze.setAttribute("opacity", h * .12 * (.8 + .2 * Math.sin(t * 2))); };
});

// ---------------- soil close-up (the seed falls and sprouts) ----------------
// params: sprout 0..1 (a seedling grows), wet 0..1 (rain-dark soil), seedGlow 0..3, seedY (px from the ground; 0 = landed)
KIT.defineSet("soil", S => {
  const sky = KIT.lgradLive(["#5A6A84", "#8A9AB0"]); el("rect", { x: -1400, y: -900, width: 4720, height: 2600, fill: sky.url }, S.layer(0, "sky"));
  const L1 = S.layer(.4, "far"); const far = el("path", { d: hillPath(-1200, 3200, 640, 50, 12, 14) }, L1);
  const L = S.layer(1, "soil"); const soil = el("path", { d: "M-900 760 Q400 720 960 740 Q1500 760 2900 730 L2900 1600 L-900 1600 Z" }, L);
  const soil2 = el("path", { d: "M-900 900 Q600 870 1000 890 Q1500 910 2900 880 L2900 1600 L-900 1600 Z" }, L);
  for (let i = 0; i < 40; i++) el("ellipse", { cx: -300 + hash(i) * 2500, cy: 780 + hash(i * 2) * 300, rx: 6 + hash(i * 3) * 14, ry: 4 + hash(i * 4) * 6, fill: "#8A6A4A", stroke: "#4A3220", "stroke-width": 1.5 }, L);
  const seedG = el("g", {}, L), seed = makeSeed(seedG, 1.2);
  const sp = el("g", { transform: "translate(960 800)" }, L);
  const stem = el("path", { fill: "none", stroke: "#4E9A3A", "stroke-width": 14, "stroke-linecap": "round" }, sp);
  const lvs = [[-1, .45], [1, .62], [-1, .8], [1, .95]].map(([s, at]) => ({ s, at, e: el("path", { d: `M0 0 Q${s * 50} -60 ${s * 120} -30 Q${s * 60} 20 0 0 Z`, fill: s > 0 ? "#7BC04A" : "#5FA53A", stroke: "#2E5A2A", "stroke-width": 3 }, sp) }));
  const glowSp = el("ellipse", { cx: 0, cy: -150, rx: 260, ry: 300, fill: KIT.rgrad([[0, "#FFE08A", .7], [1, "#FFE08A", 0]]), opacity: 0 }, sp); sp.insertBefore(glowSp, stem);
  S.update = (t, o) => { const k = o.sprout || 0, w = o.wet || 0;
    sky.set([mixc("#8CCBEA", "#5A6A84", w), mixc("#E6F2F2", "#8A9AB0", w)]); far.setAttribute("fill", mixc("#86BC70", "#4E6A5A", w));
    soil.setAttribute("fill", mixc("#A87A50", "#6A4A30", w)); soil2.setAttribute("fill", mixc("#94683E", "#5A3E28", w));
    seedG.setAttribute("transform", `translate(960 ${800 - (o.seedY || 0)})`); seed.set(o.seedGlow || 0, t); seedG.style.opacity = k > .3 ? 1 - clamp((k - .3) * 4) : 1;
    const h = 330 * k; stem.setAttribute("d", `M0 0 Q${Math.sin(t) * 10} ${-h * .5} ${Math.sin(t * 1.3) * 16} ${-h}`); stem.style.opacity = k > 0 ? 1 : 0;
    lvs.forEach(L_ => { const kk = clamp((k - L_.at * .7) * 3); L_.e.setAttribute("transform", `translate(${Math.sin(t * 1.3) * 16 * L_.at} ${-h * L_.at}) scale(${kk}) rotate(${Math.sin(t * 2 + L_.at * 5) * 5})`); });
    glowSp.setAttribute("opacity", (o.seedGlow || 0) > 2 ? .6 * k : 0); };
});

// ---------------- props for scenes (call inside a set's actor layer or anywhere) ----------------
// factory blueprint sign on two posts. makeSign(parent, x, y, s) -> g
function makeSign(parent, x = 0, y = 0, s = 1, label = "NEW FACTORY SITE") {
  const g = el("g", { transform: `translate(${x} ${y}) scale(${s})` }, parent);
  [-170, 170].forEach(px => el("rect", { x: px - 9, y: -300, width: 18, height: 300, fill: "#7A5232", stroke: INK, "stroke-width": 3 }, g));
  el("rect", { x: -230, y: -420, width: 460, height: 260, rx: 6, fill: KIT.lgrad([[0, "#2E5E9E"], [1, "#1E4478"]]), stroke: INK, "stroke-width": 5 }, g);
  for (let i = 1; i < 10; i++) el("line", { x1: -230 + i * 46, y1: -420, x2: -230 + i * 46, y2: -160, stroke: "#4A7AB8", "stroke-width": 1.2 }, g);
  for (let i = 1; i < 6; i++) el("line", { x1: -230, y1: -420 + i * 43, x2: 230, y2: -420 + i * 43, stroke: "#4A7AB8", "stroke-width": 1.2 }, g);
  const w = "#EAF2FF"; el("path", { d: "M-170 -190 L-170 -300 L-100 -260 L-100 -300 L-30 -260 L-30 -300 L40 -260 L40 -190 Z", fill: "none", stroke: w, "stroke-width": 3 }, g);
  [[70, -360], [120, -380]].forEach(([cx_, top]) => el("rect", { x: cx_, y: top, width: 26, height: -190 - top, fill: "none", stroke: w, "stroke-width": 3 }, g));
  el("path", { d: "M40 -190 L180 -190 L180 -260 L40 -260", fill: "none", stroke: w, "stroke-width": 3 }, g);
  el("path", { d: "M70 -380 q10 -16 0 -30 M124 -400 q10 -16 0 -30", fill: "none", stroke: w, "stroke-width": 2.5, "stroke-dasharray": "4 4" }, g);
  el("rect", { x: -230, y: -470, width: 460, height: 54, rx: 6, fill: "#F2C230", stroke: INK, "stroke-width": 4 }, g);
  txt(label, { x: 0, y: -432, "text-anchor": "middle", "font-family": "Anton", "font-size": 34, "letter-spacing": 3, fill: "#2A1A08" }, g);
  return g;
}
