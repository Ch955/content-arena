// story16x9 cast: our own storybook drawings (flat shapes + soft gradient shading, warm brown outlines).
// Every character is a rig: actor = {g, st, draw(t)}. Set st each frame (KIT.begin resets it to the defaults):
//   x, y (feet on the ground, world px), s (scale), flip (1 faces right, -1 faces left), turn (-1..1: face turns
//   towards the viewer's left/right, a 3/4 cheat), lean (deg), vis (opacity), hop (px up)
//   mood: neutral | happy | sad | scared | angry | awe | smug     talk: 0..1 (auto from TL via st.who)  blink (auto)
//   look, lookY: -1..1 eye direction    headRot (deg)   tear: 0..1 (wet eyes)  tearRun: 0..1 (a drop runs down)
//   pose: stand | walk | run | kneel | sit | point | armsUp | spread | cower | hold | reach | think | handsHips | wave | carry
//   pose2 + poseK: blend from pose to pose2 (0..1)      phase: walk/run cycle phase (KIT.walk sets it)
//   hL/hR: [dx,dy] override of a hand position relative to its shoulder;  item / itemL: prop in the right / left hand
//   itemRot: deg     (kids) locket: worn locket on/off
// Sizes at s = 1: kids ~430 px tall, adults ~570 px. Draw order inside a set = put() order.
"use strict";
const INK = "#3A2418";
const BUILD = {
  kid: { hipY: -160, hipW: 17, thigh: 80, shin: 78, shY: -285, shW: 44, waistW: 36, upArm: 62, foreArm: 58, neckY: -298, headY: -362, rx: 56, ry: 60, leg: 22, arm: 19, hand: 13 },
  adult: { hipY: -252, hipW: 25, thigh: 124, shin: 122, shY: -446, shW: 60, waistW: 50, upArm: 98, foreArm: 92, neckY: -466, headY: -514, rx: 43, ry: 51, leg: 30, arm: 24, hand: 15 },
};
let _pidN = 0;
function ik(ax, ay, bx, by, l1, l2, bend) {
  const dx = bx - ax, dy = by - ay; let d = Math.hypot(dx, dy); d = clamp(d, Math.abs(l1 - l2) + .01, l1 + l2 - .01);
  const a = Math.atan2(dy, dx), c = clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1), ang = a - bend * Math.acos(c);
  return [[ax + Math.cos(ang) * l1, ay + Math.sin(ang) * l1], [ax + Math.cos(a) * d, ay + Math.sin(a) * d]];
}
function shade(c, k) { return k > 0 ? mixc(c, "#ffffff", k) : mixc(c, "#2a1408", -k); }
// soft cloth fill: lighter at the top-left, darker at the bottom-right
function cloth(c, a = .16, b = -.2) { return KIT.lgrad([[0, shade(c, a)], [.55, c], [1, shade(c, b)]], 0, 0, .35, 1); }
const attrsLine = (w, c) => ({ stroke: c, "stroke-width": w, "stroke-linecap": "round", fill: "none" });
function line(p, w, c) { return el("line", attrsLine(w, c), p); }
function setL(l, a, b) { l.setAttribute("x1", a[0]); l.setAttribute("y1", a[1]); l.setAttribute("x2", b[0]); l.setAttribute("y2", b[1]); }

// ---------- pose library: joint targets (g-local: feet at y 0, forward = +x) ----------
function poseJ(name, B, ph, st) {
  const LL = B.thigh + B.shin, AL = B.upArm + B.foreArm, hipH = -LL * .965;
  const J = { hx: 0, hy: hipH, lean: 0, fL: [-B.hipW * 1.05, 0], fR: [B.hipW * 1.05, 0], kL: null, kR: null,
    aL: [-.1 * AL, .965 * AL], aR: [.1 * AL, .965 * AL], bL: -1, bR: 1, finger: 0, headDy: 0 };
  const s = Math.sin(ph || 0), c = Math.cos(ph || 0);
  switch (name) {
    case "walk": { const str = .26 * LL; J.fL = [-B.hipW * .3 + str * s, -Math.max(0, c) * .1 * LL]; J.fR = [B.hipW * .3 - str * s, -Math.max(0, -c) * .1 * LL];
      J.hy = hipH + .045 * LL * Math.abs(s) - .01 * LL; J.aL = [-.06 * AL - .28 * AL * s, .9 * AL]; J.aR = [.06 * AL + .28 * AL * s, .9 * AL]; J.bL = -1; J.bR = -1; J.lean = 3; break; }
    case "run": { const str = .38 * LL; J.fL = [str * s, -Math.max(0, c) * .28 * LL]; J.fR = [-str * s, -Math.max(0, -c) * .28 * LL];
      J.hy = hipH + .07 * LL * Math.abs(s) + .03 * LL; J.aL = [-.42 * AL * s, .5 * AL]; J.aR = [.42 * AL * s, .5 * AL]; J.bL = -1; J.bR = -1; J.lean = 11; J.headDy = 4; break; }
    case "kneel": { J.hy = -B.thigh * 1.02 - 4; J.kL = [-B.hipW * .5, -6]; J.fL = [-B.hipW * .5 - B.shin * .98, -4]; J.kR = [B.thigh * .92, J.hy + B.thigh * .32];
      J.fR = [B.thigh * .92 + 6, 0]; J.lean = 4; J.aL = [.25 * AL, .62 * AL]; J.aR = [.4 * AL, .6 * AL]; J.bL = -1; J.bR = -1; break; }
    case "sit": { const seat = st.seat || B.shin + 10; J.hy = -seat; J.kL = [B.thigh * .9 - B.hipW, -seat + 6]; J.kR = [B.thigh * .95 + B.hipW, -seat + 4];
      J.fL = [J.kL[0] + 6, 0]; J.fR = [J.kR[0] + 8, 0]; J.aL = [.22 * AL, .62 * AL]; J.aR = [.25 * AL, .6 * AL]; J.bL = -1; J.bR = -1; break; }
    case "point": J.aR = [.96 * AL, -.12 * AL]; J.finger = 1; J.lean = 2; J.bR = -1; break;
    case "armsUp": J.aL = [-.38 * AL, -.88 * AL]; J.aR = [.38 * AL, -.88 * AL]; J.bL = 1; J.bR = -1; J.headDy = -3; break;
    case "spread": J.aL = [-.93 * AL, .12 * AL]; J.aR = [.93 * AL, .12 * AL]; J.bL = 1; J.bR = -1; J.fL = [-B.hipW * 2.2, 0]; J.fR = [B.hipW * 2.2, 0]; break;
    case "cower": J.aL = [B.shW * .85, -.1 * AL]; J.aR = [-B.shW * .85, -.1 * AL]; J.bL = -1; J.bR = 1; J.hy = hipH + .06 * LL; J.lean = -7;
      J.fL = [-B.hipW * 1.6, 0]; J.fR = [B.hipW * 1.6, 0]; J.headDy = 6; break;
    case "hold": J.aL = [B.shW * .78, .5 * AL]; J.aR = [-B.shW * .78, .5 * AL]; J.bL = -1; J.bR = 1; break;
    case "reach": J.aR = [.75 * AL, .55 * AL]; J.aL = [.55 * AL, .62 * AL]; J.bL = -1; J.bR = -1; J.lean = 9; break;
    case "think": J.aR = [-B.shW * .7, -.16 * AL]; J.aL = [.3 * AL, .52 * AL]; J.bR = 1; J.bL = -1; break;
    case "handsHips": J.aL = [B.shW * .8 - B.waistW - 16, .52 * AL]; J.aR = [-(B.shW * .8 - B.waistW - 16), .52 * AL]; J.bL = -1; J.bR = 1; J.fL = [-B.hipW * 1.8, 0]; J.fR = [B.hipW * 1.8, 0]; break;
    case "wave": J.aR = [.4 * AL + .12 * AL * Math.sin(ph * 2 || 0), -.8 * AL]; J.bR = -1; break;
    case "carry": J.aR = [.3 * AL, .28 * AL]; J.aL = [.5 * AL, .3 * AL]; J.bL = -1; J.bR = -1; break;
  }
  return J;
}
function blendJ(A, Bj, k) { if (k <= 0) return A; if (k >= 1) return Bj; const o = {};
  for (const n in A) { const a = A[n], b = Bj[n];
    if (Array.isArray(a) || Array.isArray(b)) { const aa = a || b, bb = b || a; o[n] = [lerp(aa[0], bb[0], k), lerp(aa[1], bb[1], k)]; }
    else if (typeof a === "number") o[n] = (n[0] === "b" && n.length === 2) ? (k < .5 ? a : b) : lerp(a, b, k); else o[n] = k < .5 ? a : b; }
  return o; }

// ---------- generic person ----------
// o: {build:"kid"|"adult", skin, hair, style:{...}, top:{type,...}, bottom:{type,...}, ...}
function makePerson(o) {
  const B = Object.assign({}, BUILD[o.build || "adult"], o.B || {}), id = "p" + (++_pidN);
  const g = el("g", { "data-actor": o.name || id }, null);
  const shadow = el("ellipse", { cx: 0, cy: 2, rx: B.shW * 1.35, ry: 13, fill: "#1a0e06", opacity: .2 }, g);
  const body = el("g", {}, g);
  const behind = el("g", {}, body);                 // props behind the body (axe on the back etc.)
  const legsG = el("g", {}, body);
  const skirtG = el("g", {}, body);
  const upper = el("g", {}, body);                  // torso frame: origin at the hip, rotated by lean
  const armsG = el("g", {}, body);
  const skinFill = KIT.lgrad([[0, shade(o.skin, .1)], [1, shade(o.skin, -.12)]], 0, 0, .6, 1);
  const bottom = o.bottom || { type: "trousers", c: "#444" }, top = o.top || { type: "shirt", c: "#888" };
  // legs: outline + fill bones; feet
  const legs = [0, 1].map(i => { const lg = el("g", {}, legsG);
    const showLeg = bottom.type !== "skirt";
    const L = { g: lg, oT: line(lg, B.leg + 6, INK), oS: line(lg, B.leg + 5, INK), T: line(lg, B.leg, showLeg ? (bottom.type === "shorts" ? o.skin : bottom.c) : o.skin), S: line(lg, B.leg - 2, bottom.type === "trousers" ? bottom.c : o.skin) };
    if (bottom.type === "shorts") L.sh = line(lg, B.leg + 14, bottom.c), L.shO = null;
    if (!showLeg) { L.oT.style.display = "none"; L.T.style.display = "none"; }
    L.foot = el("path", { d: o.shoe ? "M-8 -10 Q-12 6 4 6 L26 6 Q34 4 30 -4 Q22 -12 -8 -10 Z" : "M-6 -9 Q-10 5 4 5 L22 5 Q30 3 26 -4 Q18 -11 -6 -9 Z",
      fill: o.shoe || o.skin, stroke: INK, "stroke-width": 3 }, lg);
    if (!o.shoe) L.strap = el("path", { d: "M2 -6 L14 -4", stroke: o.sandal || "#7A4A26", "stroke-width": 4, "stroke-linecap": "round" }, lg);
    return L; });
  const skirt = bottom.type === "skirt" ? el("path", { fill: cloth(bottom.c, .14, -.22), stroke: INK, "stroke-width": 3.5, "stroke-linejoin": "round" }, skirtG) : null;
  const skirtBorder = bottom.type === "skirt" && bottom.border ? el("path", { fill: "none", stroke: bottom.border, "stroke-width": bottom.borderW || 14, "stroke-linecap": "round" }, skirtG) : null;
  const skirtFolds = bottom.type === "skirt" ? [0, 1, 2].map(() => el("path", { fill: "none", stroke: shade(bottom.c, -.28), "stroke-width": 3, opacity: .5, "stroke-linecap": "round" }, skirtG)) : [];
  if (bottom.type === "skirt" && bottom.checks) skirtFolds.push(...[0, 1, 2, 3].map(() => el("path", { fill: "none", stroke: bottom.checks, "stroke-width": 4, opacity: .55 }, skirtG)));
  const S = B.shY - B.hipY, HY = B.headY - B.hipY, NY = B.neckY - B.hipY;   // hip-local heights (negative)
  // torso
  const tw = B.shW, ww = B.waistW + (o.belly || 0) * .4, bel = o.belly || 0;
  const torsoD = `M${-tw} ${S + 16} Q${-tw} ${S - 2} ${-tw + 18} ${S - 6} L${tw - 18} ${S - 6} Q${tw} ${S - 2} ${tw} ${S + 16}
    C${tw + bel * .6} ${S * .55} ${ww + bel} ${S * .2} ${ww} 8 Q0 ${18 + bel * .2} ${-ww} 8 C${-ww - bel} ${S * .2} ${-tw - bel * .6} ${S * .55} ${-tw} ${S + 16} Z`;
  if (o.longKurta) el("path", { d: `M${-ww - 6} -6 L${-ww - 22} ${B.thigh * .82} Q0 ${B.thigh * .9} ${ww + 22} ${B.thigh * .82} L${ww + 6} -6 Z`, fill: cloth(top.c, .05, -.2), stroke: INK, "stroke-width": 3.5 }, upper);
  const torso = el("path", { d: torsoD, fill: cloth(top.c), stroke: INK, "stroke-width": 4, "stroke-linejoin": "round" }, upper);
  el("path", { d: `M${tw * .35} ${S + 4} C${tw + bel * .5} ${S * .5} ${ww + bel * .8} ${S * .2} ${ww - 2} 6 Q${ww * .5} 12 ${ww * .3} 10 C${ww * .6} ${S * .3} ${tw * .6} ${S * .6} ${tw * .35} ${S + 4} Z`,
    fill: "#2a1408", opacity: .12 }, upper);   // soft side shade
  const neck = el("path", { d: `M${-B.rx * .32} ${NY + 6} L${-B.rx * .3} ${HY + B.ry * .5} L${B.rx * .3} ${HY + B.ry * .5} L${B.rx * .32} ${NY + 6} Z`, fill: skinFill, stroke: INK, "stroke-width": 3 }, upper);
  upper.insertBefore(neck, torso);
  const torsoDeco = el("g", {}, upper);
  if (o.drawTop) o.drawTop(torsoDeco, { B, S, tw, ww, bel, NY, top, cloth, id });
  const locket = el("g", {}, upper);
  if (o.locket) { el("path", { d: `M${-B.rx * .34} ${NY + 2} Q0 ${NY + 46} ${B.rx * .34} ${NY + 2}`, fill: "none", stroke: "#D9DEE6", "stroke-width": 2.5 }, locket);
    const lk = el("g", { transform: `translate(0 ${NY + 50})` }, locket); drawLocket(lk, .75); }
  // head
  const headG = el("g", {}, upper), hairBack = el("g", {}, headG), headIn = el("g", {}, headG);
  const ears = [-1, 1].map(s => el("ellipse", { cx: s * B.rx * .98, cy: 6, rx: B.rx * .16, ry: B.ry * .24, fill: o.skin, stroke: INK, "stroke-width": 3 }, headIn));
  const headD = o.build === "kid" ? null : `M${-B.rx} -8 Q${-B.rx} ${-B.ry} 0 ${-B.ry} Q${B.rx} ${-B.ry} ${B.rx} -8 Q${B.rx} ${B.ry * .55} ${B.rx * .45} ${B.ry * .86} Q0 ${B.ry * 1.06} ${-B.rx * .45} ${B.ry * .86} Q${-B.rx} ${B.ry * .55} ${-B.rx} -8 Z`;
  const headShape = headD ? el("path", { d: headD, fill: skinFill, stroke: INK, "stroke-width": 3.5 }, headIn)
    : el("ellipse", { cx: 0, cy: 0, rx: B.rx * (o.cheeky ? 1.08 : 1), ry: B.ry, fill: skinFill, stroke: INK, "stroke-width": 3.5 }, headIn);
  const face = el("g", {}, headIn);
  const E = o.build === "kid" ? { y: 2, dx: B.rx * .4, rx: 12.5, ry: 15, ir: 9 } : { y: -4, dx: B.rx * .42, rx: 9.5, ry: 8, ir: 6.2 };
  const cheeks = [-1, 1].map(s => el("ellipse", { cx: s * B.rx * .58, cy: E.y + B.ry * .38, rx: B.rx * .2, ry: B.rx * .12, fill: "#F07A6A", opacity: o.blush == null ? .28 : o.blush }, face));
  const eyes = [-1, 1].map(s => { const eg = el("g", {}, face), cid = KIT.uid("ec");
    const cp = el("clipPath", { id: cid }, KIT.defs), ce = el("ellipse", { rx: E.rx, ry: E.ry }, cp);
    const w = el("ellipse", { rx: E.rx, ry: E.ry, fill: "#FFFDF8" }, eg);
    const inner = el("g", { "clip-path": `url(#${cid})` }, eg);
    const ir = el("circle", { r: E.ir, fill: o.eyeC || "#4A2A16" }, inner), pu = el("circle", { r: E.ir * .5, fill: "#140904" }, inner);
    const hl = el("circle", { r: E.ir * .32, fill: "#fff" }, inner), hl2 = el("circle", { r: E.ir * .16, fill: "#fff" }, inner);
    const lidF = el("path", { fill: o.skin }, inner);
    const ol = el("ellipse", { rx: E.rx, ry: E.ry, fill: "none", stroke: INK, "stroke-width": 2.2 }, eg);
    const lash = el("path", { fill: "none", stroke: INK, "stroke-width": o.lash || 3.6, "stroke-linecap": "round" }, eg);
    return { eg, ce, w, ir, pu, hl, hl2, lidF, ol, lash, s }; });
  const brows = [-1, 1].map(() => el("path", { fill: "none", stroke: o.browC || o.hair, "stroke-width": o.brow || (o.build === "kid" ? 5 : 6), "stroke-linecap": "round" }, face));
  const nose = el("path", { fill: "none", stroke: shade(o.skin, -.35), "stroke-width": 3, "stroke-linecap": "round" }, face);
  const MY = o.build === "kid" ? B.ry * .5 : B.ry * .55;
  const mouthO = el("path", { fill: "#7A2626", stroke: INK, "stroke-width": 2.5, "stroke-linejoin": "round" }, face);
  const tongue = el("ellipse", { rx: 6, ry: 3, fill: "#E07A7A" }, face);
  const mouthL = el("path", { fill: "none", stroke: o.lip || shade(o.skin, -.5), "stroke-width": 3.6, "stroke-linecap": "round" }, face);
  const teeth = el("path", { fill: "#FFFDF6" }, face);
  const tears = [-1, 1].map(s => el("path", { d: "M0 -7 Q6 2 0 6 Q-6 2 0 -7 Z", fill: "#BFE8FF", stroke: INK, "stroke-width": 1.5, opacity: 0 }, face));
  const faceDeco = el("g", {}, face);          // moustache, glasses, wrinkles
  const hairFront = el("g", {}, headIn);
  const headTop = el("g", {}, headIn);          // sunglasses on hair, headband
  if (o.drawHead) o.drawHead({ back: hairBack, front: hairFront, face: faceDeco, top: headTop, upper, B, HY, E, MY, id, o });
  // arms
  const arms = [0, 1].map(i => { const ag = el("g", {}, armsG);
    const A = { g: ag, oU: line(ag, B.arm + 6, INK), oF: line(ag, B.arm + 4, INK), U: line(ag, B.arm, o.sleeveFull ? top.sleeve || top.c : o.skin), F: line(ag, B.arm - 2, o.sleeveFull ? top.sleeve || top.c : o.skin) };
    if (!o.sleeveFull && o.sleeve !== false) A.slv = line(ag, B.arm + 9, top.sleeve || top.c);
    if (o.cuff) A.cuff = el("circle", { r: B.arm * .62, fill: o.cuff, stroke: INK, "stroke-width": 2.5 }, ag);
    A.hand = el("circle", { r: B.hand, fill: o.skin, stroke: INK, "stroke-width": 3 }, ag);
    A.finger = line(ag, 7, o.skin); A.fingerO = null;
    A.item = el("g", {}, ag); return A; });
  const ITEMS = {}; // built lazily
  function itemNode(A, name) { if (!A.items) A.items = {}; if (!A.items[name]) { const ig = el("g", {}, A.item); (PROPS[name] || (() => {}))(ig, o); A.items[name] = ig; } return A.items[name]; }
  const st = { x: 0, y: 0, s: 1, flip: 1, turn: 0, lean: 0, vis: 1, hop: 0, mood: "neutral", talk: null, blink: null, look: 0, lookY: 0, headRot: 0, tear: 0, tearRun: 0,
    pose: "stand", pose2: null, poseK: 0, phase: 0, hL: null, hR: null, item: o.item || "", itemL: o.itemL || "", itemRot: 0, locket: !!o.locket, who: o.who || null, seed: _pidN, seat: 0, glow: 0 };
  const MOOD = { // brow [inner, outer] y offsets, eye open (ry mult), lid angle, mouth {w, c curve, h open}
    neutral: { bi: 0, bo: 0, eo: 1, lid: 0, w: 1, c: 2, h: 0 }, happy: { bi: -3, bo: -2, eo: .9, lid: 0, w: 1.35, c: 9, h: 7, lo: 1, teeth: 1 },
    sad: { bi: -9, bo: 4, eo: .85, lid: .25, w: .9, c: -6, h: 0 }, scared: { bi: -12, bo: -6, eo: 1.25, lid: 0, w: .8, c: 0, h: 13, small: 1 },
    angry: { bi: 8, bo: -6, eo: .9, lid: .38, w: 1.1, c: -4, h: 0, ang: 1 }, awe: { bi: -11, bo: -8, eo: 1.2, lid: 0, w: .7, c: 2, h: 10, spark: 1 },
    smug: { bi: 2, bo: -5, eo: .8, lid: .3, w: 1.2, c: 6, h: 0, smirk: 1 } };
  function draw(t) {
    const k = st; let J = poseJ(k.pose, B, k.phase, k); if (k.pose2 && k.poseK > 0) J = blendJ(J, poseJ(k.pose2, B, k.phase, k), k.poseK);
    g.setAttribute("transform", `translate(${k.x} ${k.y - k.hop}) scale(${k.s * k.flip} ${k.s})`); g.style.opacity = k.vis;
    shadow.setAttribute("rx", B.shW * 1.35 * (1 - clamp(k.hop / 400) * .5));
    const hip = [J.hx, J.hy], lean = J.lean + k.lean, lr = lean * Math.PI / 180;
    const rot = (x, y) => [hip[0] + x * Math.cos(lr) - y * Math.sin(lr), hip[1] + x * Math.sin(lr) + y * Math.cos(lr)];
    upper.setAttribute("transform", `translate(${hip[0]} ${hip[1]}) rotate(${lean})`);
    // legs (draw the back leg first: the one further behind = smaller x)
    const sockets = [[-B.hipW, 0], [B.hipW, 0]].map(([x, y]) => rot(x, y + 4));
    const feet = [J.fL, J.fR], knees = [J.kL, J.kR], kneeP = [];
    legs.forEach((L, i) => { const sk = sockets[i]; let kn, ft;
      if (knees[i]) { kn = knees[i]; ft = feet[i]; } else [kn, ft] = ik(sk[0], sk[1], feet[i][0], feet[i][1], B.thigh, B.shin, 1);
      kneeP.push(kn); setL(L.oT, sk, kn); setL(L.T, sk, kn); setL(L.oS, kn, ft); setL(L.S, kn, ft);
      if (L.sh) setL(L.sh, sk, [lerp(sk[0], kn[0], .55), lerp(sk[1], kn[1], .55)]);
      const fa = knees[i] && k.pose === "kneel" && i === 0 ? -8 : 0;
      L.foot.setAttribute("transform", `translate(${ft[0]} ${ft[1]}) rotate(${fa})`); if (L.strap) L.strap.setAttribute("transform", `translate(${ft[0]} ${ft[1]})`); });
    if (feet[0][0] > feet[1][0]) legsG.appendChild(legs[1].g); else legsG.appendChild(legs[0].g);
    if (skirt) { const wl = rot(-B.waistW - 4, -14), wr = rot(B.waistW + 4, -14); const xs = [feet[0][0], feet[1][0], kneeP[0][0], kneeP[1][0]];
      const lo = bottom.len == null ? 1 : bottom.len; const hemY = lo >= 1 ? Math.min(-8, Math.max(feet[0][1], feet[1][1]) - 8) : lerp(hip[1], 0, lo);
      const fl = bottom.flare || 34, xl = Math.min(...xs) - fl, xr = Math.max(...xs) + fl, wv = Math.sin(t * 2 + k.seed) * 3;
      skirt.setAttribute("d", `M${wl[0]} ${wl[1]} C${wl[0] - 8} ${lerp(wl[1], hemY, .4)} ${xl + 6} ${lerp(wl[1], hemY, .7)} ${xl} ${hemY} Q${(xl + xr) / 2} ${hemY + 12 + wv} ${xr} ${hemY} C${xr - 6} ${lerp(wr[1], hemY, .7)} ${wr[0] + 8} ${lerp(wr[1], hemY, .4)} ${wr[0]} ${wr[1]} Z`);
      if (skirtBorder) skirtBorder.setAttribute("d", `M${xl + 6} ${hemY - 7} Q${(xl + xr) / 2} ${hemY + 5 + wv} ${xr - 6} ${hemY - 7}`);
      skirtFolds.forEach((f, i) => { const fx = lerp(xl + 30, xr - 30, (i + .5) / skirtFolds.length), wx = lerp(wl[0], wr[0], (i + .5) / skirtFolds.length);
        f.setAttribute("d", `M${wx} ${wl[1] + 30} Q${(wx + fx) / 2 + 6} ${lerp(wl[1], hemY, .5)} ${fx} ${hemY - 14}`); }); }
    // head
    const tr = k.turn;
    headG.setAttribute("transform", `translate(${tr * 4} ${HY + J.headDy}) rotate(${k.headRot})`);
    face.setAttribute("transform", `translate(${tr * B.rx * .26 + k.look * 2} ${k.lookY * 2})`);
    hairFront.setAttribute("transform", `translate(${tr * B.rx * .1} 0)`); headTop.setAttribute("transform", `translate(${tr * B.rx * .1} 0)`);
    ears.forEach((e, i) => { const s = i ? 1 : -1; e.setAttribute("cx", s * B.rx * .98 - tr * B.rx * .18); e.style.opacity = (s * tr < -.55) ? 0 : 1; });
    const M = MOOD[k.mood] || MOOD.neutral, bl = k.blink ? 1 : 0;
    eyes.forEach((Ey, i) => { const s = Ey.s, sq = 1 - tr * s * .18; // near eye a bit larger
      const ry = E.ry * M.eo, rx = E.rx * (M.eo > 1 ? 1.08 : 1) * sq;
      Ey.eg.setAttribute("transform", `translate(${s * E.dx} ${E.y})`);
      [Ey.w, Ey.ol, Ey.ce].forEach(e => { e.setAttribute("rx", rx); e.setAttribute("ry", ry); });
      const px = clamp(k.look, -1, 1) * rx * .42, py = clamp(k.lookY, -1, 1) * ry * .35 + (M.small ? -1 : 1);
      const irr = E.ir * (M.small ? .7 : 1); Ey.ir.setAttribute("r", irr); Ey.pu.setAttribute("r", irr * .5);
      [Ey.ir, Ey.pu].forEach(e => { e.setAttribute("cx", px); e.setAttribute("cy", py); });
      Ey.hl.setAttribute("cx", px - irr * .35); Ey.hl.setAttribute("cy", py - irr * .4); Ey.hl2.setAttribute("cx", px + irr * .35); Ey.hl2.setAttribute("cy", py + irr * .3);
      Ey.hl2.style.opacity = M.spark || k.tear > .3 ? 1 : .6;
      const lidA = M.ang ? (s > 0 ? 1 : -1) : (M.lid && k.mood === "sad" ? (s > 0 ? -1 : 1) : 0);   // angry: inner corner low; sad: outer low
      const top0 = -ry - 2, lidY = bl ? ry + 2 : lerp(top0, ry, M.lid || 0), d1 = lidA * ry * .5;
      Ey.lidF.setAttribute("d", `M${-rx - 2} ${top0 - 4} L${rx + 2} ${top0 - 4} L${rx + 2} ${lidY - d1} L${-rx - 2} ${lidY + d1} Z`);
      if (bl) Ey.lash.setAttribute("d", `M${-rx} 1 Q0 ${ry * .55} ${rx} 1`);
      else if (M.lid) Ey.lash.setAttribute("d", `M${-rx} ${lidY + d1} L${rx} ${lidY - d1}`);
      else Ey.lash.setAttribute("d", `M${-rx - 1} ${-ry * .2} Q0 ${-ry * 1.25} ${rx + 1} ${-ry * .2}`);
      [Ey.w, Ey.ol, Ey.ir, Ey.pu, Ey.hl, Ey.hl2].forEach(e => e.style.opacity = bl ? 0 : 1); Ey.lidF.style.opacity = bl ? 0 : 1; });
    brows.forEach((b, i) => { const s = i ? 1 : -1, by = E.y - E.ry * (o.build === "kid" ? 1.55 : 2.1);
      b.setAttribute("d", `M${s * E.dx * .35} ${by + M.bi} Q${s * E.dx * .95} ${by - 5 + (M.bi + M.bo) / 2} ${s * E.dx * 1.55} ${by + M.bo}`); });
    nose.setAttribute("d", o.build === "kid" ? `M${tr * 4 - 3} ${E.y + B.ry * .27} Q${tr * 4 + 2} ${E.y + B.ry * .33} ${tr * 4 + 5} ${E.y + B.ry * .27}`
      : `M${tr * 5 + 2} ${E.y + 6} Q${tr * 6 - 5} ${E.y + 24} ${tr * 6 - 2} ${E.y + 28} Q${tr * 6 + 4} ${E.y + 31} ${tr * 6 + 9} ${E.y + 27}`);
    const talk = clamp(k.talk || 0), open = Math.max(M.h, talk * (o.build === "kid" ? 15 : 13)), mw = (o.build === "kid" ? 11 : 12) * M.w * (open > 4 ? .85 : 1);
    if (open > 2.5) { const up = M.c > 4 ? -2 : 0;
      mouthO.setAttribute("d", `M${-mw} ${MY + up} Q0 ${MY - 3 - (M.c > 4 ? 0 : 1)} ${mw} ${MY + up} Q${mw * .8} ${MY + open * .9 + M.c * .4} 0 ${MY + open + M.c * .3} Q${-mw * .8} ${MY + open * .9 + M.c * .4} ${-mw} ${MY + up} Z`);
      teeth.style.opacity = M.teeth ? 1 : 0; if (M.teeth) teeth.setAttribute("d", `M${-mw * .78} ${MY + up + 1.5} Q0 ${MY - 1} ${mw * .78} ${MY + up + 1.5} L${mw * .6} ${MY + up + 5} Q0 ${MY + 4} ${-mw * .6} ${MY + up + 5} Z`);
      mouthO.style.opacity = 1; tongue.setAttribute("cx", 0); tongue.setAttribute("cy", MY + open * .75); tongue.setAttribute("rx", mw * .45); tongue.style.opacity = open > 7 ? 1 : 0; mouthL.style.opacity = 0;
    } else { mouthO.style.opacity = 0; tongue.style.opacity = 0; teeth.style.opacity = 0; mouthL.style.opacity = 1;
      mouthL.setAttribute("d", M.smirk ? `M${-mw} ${MY + 1} Q${mw * .2} ${MY + 5} ${mw * 1.1} ${MY - 6}` : `M${-mw} ${MY - M.c * .2} Q0 ${MY + M.c} ${mw} ${MY - M.c * .2}`); }
    tears.forEach((d, i) => { const s = i ? 1 : -1, ph = k.tearRun; d.style.opacity = ph > 0 && ph < 1 ? 1 : 0;
      d.setAttribute("transform", `translate(${s * E.dx + s * 4} ${E.y + E.ry + 4 + ph * 40}) scale(${1 + ph * .2})`); });
    cheeks.forEach(c => c.setAttribute("opacity", (o.blush == null ? .28 : o.blush) + (k.mood === "happy" ? .12 : 0)));
    locket.style.display = k.locket ? "" : "none";
    // arms
    const shs = [rot(-B.shW * .8, S + 18), rot(B.shW * .8, S + 18)];
    [[arms[0], shs[0], k.hL || J.aL, J.bL], [arms[1], shs[1], k.hR || J.aR, J.bR]].forEach(([A, sh, off, bend], i) => {
      const [e, h] = ik(sh[0], sh[1], sh[0] + off[0], sh[1] + off[1], B.upArm, B.foreArm, bend);
      setL(A.oU, sh, e); setL(A.U, sh, e); setL(A.oF, e, h); setL(A.F, e, h);
      if (A.slv) setL(A.slv, sh, [lerp(sh[0], e[0], o.sleeveLen || .5), lerp(sh[1], e[1], o.sleeveLen || .5)]);
      if (A.cuff) { A.cuff.setAttribute("cx", lerp(e[0], h[0], .82)); A.cuff.setAttribute("cy", lerp(e[1], h[1], .82)); }
      A.hand.setAttribute("cx", h[0]); A.hand.setAttribute("cy", h[1]);
      const fa = Math.atan2(h[1] - e[1], h[0] - e[0]);
      const fin = i === 1 && J.finger; A.finger.style.display = fin ? "" : "none";
      if (fin) setL(A.finger, h, [h[0] + Math.cos(fa) * B.hand * 1.6, h[1] + Math.sin(fa) * B.hand * 1.6]);
      const nm = i ? k.item : k.itemL;
      if (A.items) for (const n in A.items) A.items[n].style.display = n === nm ? "" : "none";
      if (nm) { const it = itemNode(A, nm); it.style.display = "";
        if (nm === "stick") it.setAttribute("transform", `translate(${h[0]} ${h[1]})`), it.firstChild.setAttribute("y2", -h[1] - 2), it.firstChild.nextSibling && it.firstChild.nextSibling.setAttribute("y2", -h[1] - 2);
        else it.setAttribute("transform", `translate(${h[0]} ${h[1]}) rotate(${k.itemRot})`);
        if (it._upd) it._upd(t, k); } });
    if (o.onDraw) o.onDraw(t, k, J);
  }
  const a = { g, st, draw, B, o, name: o.name };
  return KIT.register(a);
}

// ---------- props (also used as held items) ----------
function drawLocket(p, s = 1, open = 0) {
  const g = el("g", { transform: `scale(${s})` }, p);
  el("ellipse", { cx: 0, cy: 0, rx: 14, ry: 17, fill: KIT.lgrad([[0, "#FFFFFF"], [.5, "#C8D0DA"], [1, "#8C96A4"]], 0, 0, 1, 1), stroke: "#4A5260", "stroke-width": 2.5 }, g);
  el("ellipse", { cx: 0, cy: 0, rx: 9, ry: 11.5, fill: "none", stroke: "#8C96A4", "stroke-width": 1.8 }, g);
  el("path", { d: "M0 -6 C-6 -12 -10 -2 0 6 C10 -2 6 -12 0 -6 Z", fill: "#9AA4B2" }, g);   // a small heart engraving
  el("circle", { cx: 0, cy: -19, r: 3.5, fill: "none", stroke: "#C8D0DA", "stroke-width": 2 }, g);
  el("ellipse", { cx: -5, cy: -6, rx: 3, ry: 5, fill: "#fff", opacity: .7 }, g);
  return g;
}
const PROPS = {
  stick: (p) => { line(p, 13, INK).setAttribute("y2", 200); const l = line(p, 9, "#8A5A30"); l.setAttribute("y2", 200); el("path", { d: "M-6 -6 Q0 -22 14 -16", stroke: "#6A4020", "stroke-width": 10, fill: "none", "stroke-linecap": "round" }, p); },
  axe: (p) => { el("rect", { x: -6, y: -150, width: 12, height: 210, rx: 5, fill: KIT.lgrad([[0, "#A8743C"], [1, "#6E4520"]], 0, 0, 1, 0), stroke: INK, "stroke-width": 3 }, p);
    el("path", { d: "M-6 -148 L-6 -104 Q-40 -96 -58 -78 Q-66 -118 -58 -158 Q-40 -144 -6 -148 Z", fill: KIT.lgrad([[0, "#E6EAEE"], [1, "#8A949E"]], 0, 0, 1, 0), stroke: INK, "stroke-width": 3.5, "stroke-linejoin": "round" }, p);
    el("path", { d: "M-56 -150 Q-62 -118 -55 -84", stroke: "#fff", "stroke-width": 3, fill: "none", opacity: .7 }, p); },
  torch: (p) => { el("rect", { x: -9, y: -10, width: 18, height: 52, rx: 6, fill: "#3C4A5C", stroke: INK, "stroke-width": 3 }, p); el("path", { d: "M-13 -10 L-16 -30 L16 -30 L13 -10 Z", fill: "#56677C", stroke: INK, "stroke-width": 3 }, p);
    el("ellipse", { cx: 0, cy: -30, rx: 15, ry: 5, fill: "#FFF6C8", stroke: INK, "stroke-width": 2 }, p); },
  bottle: (p) => { el("rect", { x: -15, y: -50, width: 30, height: 74, rx: 10, fill: KIT.lgrad([[0, "#F2F5F8"], [.5, "#B8C2CC"], [1, "#7D8894"]], 0, 0, 1, 0), stroke: INK, "stroke-width": 3 }, p);
    el("rect", { x: -9, y: -64, width: 18, height: 16, rx: 4, fill: "#5A6B7E", stroke: INK, "stroke-width": 3 }, p); },
  seed: (p) => { const s = makeSeed(p, .8); p._upd = (t, k) => s.set(k.glow || 0, t); },
  locket: (p) => { el("path", { d: "M0 -18 Q-20 -40 -6 -60 M0 -18 Q18 -42 4 -62", fill: "none", stroke: "#D9DEE6", "stroke-width": 2.5 }, p); drawLocket(p, 1.15); },
  sapling: (p) => { const s = makeSapling(p, .8); p._upd = () => s.set(1); },
  pot: (p) => { el("path", { d: "M-26 -40 Q-40 -10 -22 14 L22 14 Q40 -10 26 -40 Z", fill: KIT.lgrad([[0, "#D47A45"], [1, "#8E4422"]], 0, 0, 1, 1), stroke: INK, "stroke-width": 3 }, p);
    el("rect", { x: -18, y: -50, width: 36, height: 12, rx: 4, fill: "#B65E30", stroke: INK, "stroke-width": 3 }, p); },
};
// magic seed: glow 0 (dull) .. 3 (radiant). Returns {g, set(glow, t)}
function makeSeed(parent, s = 1) {
  const g = el("g", { transform: `scale(${s})` }, parent);
  const halo = el("circle", { r: 80, fill: KIT.rgrad([[0, "#FFE9A0", .9], [.35, "#FFC94A", .45], [1, "#FFB020", 0]]) }, g);
  const rays = el("g", {}, g); for (let i = 0; i < 12; i++) el("path", { d: "M0 -30 L5 -70 L0 -96 L-5 -70 Z", fill: "#FFE7A0", opacity: .8, transform: `rotate(${i * 30})` }, rays);
  const rings = [0, 1, 2].map(() => el("circle", { r: 30, fill: "none", stroke: "#FFE08A", "stroke-width": 3 }, g));
  el("path", { d: "M0 -26 C18 -22 22 6 12 18 C6 26 -6 26 -12 18 C-22 6 -18 -22 0 -26 Z", fill: KIT.lgrad([[0, "#C8913E"], [.5, "#8A5A24"], [1, "#5A3612"]], 0, 0, 1, 1), stroke: INK, "stroke-width": 3 }, g);
  const vein = el("path", { d: "M0 -20 Q-6 0 0 20 M0 -6 Q8 -2 10 6 M0 4 Q-8 6 -10 12", fill: "none", stroke: "#FFE08A", "stroke-width": 2.5, "stroke-linecap": "round" }, g);
  el("ellipse", { cx: -6, cy: -12, rx: 4, ry: 7, fill: "#fff", opacity: .35 }, g);
  return { g, set(glow, t = 0) { const k = clamp(glow / 3), pl = .85 + .15 * Math.sin(t * 5);
    halo.setAttribute("opacity", glow <= 0 ? 0 : (.25 + .75 * k) * pl); halo.setAttribute("r", 40 + 70 * k);
    rays.style.opacity = glow >= 2.5 ? clamp(glow - 2.5) * 2 * pl : 0; rays.setAttribute("transform", `rotate(${t * 12}) scale(${.8 + .3 * k})`);
    vein.setAttribute("stroke", glow > 0 ? "#FFE08A" : "#6A4420"); vein.style.opacity = glow > 0 ? .5 + .5 * k : .6;
    rings.forEach((r, i) => { const ph = fract(t * .6 + i / 3); r.setAttribute("r", 28 + ph * (40 + 50 * k)); r.style.opacity = glow >= 1 && i < Math.floor(glow) ? (1 - ph) * .8 : 0; }); } };
}
function makeSapling(parent, s = 1) { const g = el("g", { transform: `scale(${s})` }, parent);
  el("path", { d: "M-22 0 Q0 -10 22 0 Q20 12 0 14 Q-20 12 -22 0 Z", fill: "#7A5030", stroke: INK, "stroke-width": 2.5 }, g);
  const stem = el("path", { d: "M0 0 Q-4 -40 2 -80", fill: "none", stroke: "#5C8A32", "stroke-width": 6, "stroke-linecap": "round" }, g);
  const lv = [[-1, -36], [1, -50], [-1, -64], [1, -78]].map(([sd, y]) => el("path", { d: `M0 0 Q${sd * 14} -14 ${sd * 30} -6 Q${sd * 14} 6 0 0 Z`, fill: sd > 0 ? "#7BC04A" : "#5FA53A", stroke: INK, "stroke-width": 2, transform: `translate(0 ${y})` }, g));
  return { g, set(k) { stem.setAttribute("d", `M0 0 Q-4 ${-40 * k} 2 ${-80 * k}`); lv.forEach((l, i) => { const kk = clamp(k * 4 - i * .7);
      l.setAttribute("transform", `translate(0 ${[-36, -50, -64, -78][i] * k}) scale(${kk})`); }); } };
}

// ---------- heads, hair and outfit details ----------
function hairBlob(p, d, c, extra = {}) { return el("path", { d, fill: c, stroke: INK, "stroke-width": 3, "stroke-linejoin": "round", ...extra }, p); }
const MEERA_OPT = {
  name: "meera", who: "meera", build: "kid", skin: "#C98A5C", hair: "#20140E", lip: "#9A3A34", locket: true, lash: 4, blush: .32,
  top: { c: "#F4C23A", sleeve: "#F4C23A" }, bottom: { type: "skirt", c: "#2E9A52", border: "#F2C230", borderW: 16, flare: 30 }, sleeveLen: .42,
  drawTop(p, { S, tw, ww }) {   // langa voni: blouse + green half-saree drape over the left shoulder with a gold edge
    el("path", { d: `M${-tw + 6} ${S + 4} L${-tw + 34} ${S - 4} L${ww + 6} 2 L${ww - 26} 6 Z`, fill: cloth("#5CBF5A", .18, -.15), stroke: INK, "stroke-width": 3, "stroke-linejoin": "round" }, p);
    el("path", { d: `M${-tw + 34} ${S - 2} L${ww + 4} 0`, stroke: "#F2C230", "stroke-width": 6, "stroke-linecap": "round" }, p);
    el("rect", { x: -ww - 4, y: -22, width: (ww + 4) * 2, height: 14, rx: 5, fill: "#F2C230", stroke: INK, "stroke-width": 2.5 }, p);
    for (let i = 0; i < 6; i++) el("circle", { cx: -ww + 8 + i * (ww * 2 - 16) / 5, cy: -15, r: 2.6, fill: "#C0392B" }, p); },
  drawHead({ back, front, B }) { const rx = B.rx, ry = B.ry;
    hairBlob(back, `M${-rx - 6} 10 Q${-rx - 10} ${-ry - 16} 0 ${-ry - 12} Q${rx + 10} ${-ry - 16} ${rx + 6} 10 Q${rx} 30 ${rx - 8} 34 L${-rx + 8} 34 Q${-rx} 30 ${-rx - 6} 10 Z`, "#20140E");
    // two braids hanging over the shoulders (front), red ribbons
    [-1, 1].forEach(s => { const bg = el("g", {}, front);
      for (let i = 0; i < 7; i++) el("ellipse", { cx: s * (rx * .78 + i * 1.5), cy: ry * .25 + i * 17, rx: 11 - i * .5, ry: 11, fill: i % 2 ? "#2A1A12" : "#20140E", stroke: INK, "stroke-width": 2.5 }, bg);
      el("path", { d: `M${s * rx * .86 - 8} ${ry * .25 + 118} l-6 18 l12 -6 l12 6 l-6 -18 Z`, fill: "#D9302C", stroke: INK, "stroke-width": 2 }, bg);
      el("ellipse", { cx: s * rx * .86, cy: ry * .25 + 120, rx: 8, ry: 5, fill: "#D9302C", stroke: INK, "stroke-width": 2 }, bg); });
    hairBlob(front, `M${-rx - 3} 4 Q${-rx - 6} ${-ry - 6} -2 ${-ry - 6} Q${-10} ${-ry * .5} ${-rx * .6} ${-ry * .32} Q${-rx * .85} ${-ry * .1} ${-rx - 3} 4 Z`, "#20140E");
    hairBlob(front, `M${rx + 3} 4 Q${rx + 6} ${-ry - 6} 2 ${-ry - 6} Q${10} ${-ry * .5} ${rx * .6} ${-ry * .32} Q${rx * .85} ${-ry * .1} ${rx + 3} 4 Z`, "#20140E");
    el("path", { d: `M${-rx * .5} ${-ry * .82} Q${-rx * .2} ${-ry * .95} -6 ${-ry * .9}`, stroke: "#5A4030", "stroke-width": 3, fill: "none", opacity: .7 }, front);   // hair shine
    el("circle", { cx: rx * .62, cy: -ry * .72, r: 7, fill: "#FFF4E0", stroke: INK, "stroke-width": 2 }, front);   // a small white flower clip
    el("circle", { cx: rx * .62, cy: -ry * .72, r: 2.5, fill: "#F2C230" }, front); },
};
const CHINTU_OPT = {
  name: "chintu", who: "chintu", build: "kid", skin: "#B87A4E", hair: "#1A120C", lip: "#8A3A30", belly: 14, cheeky: 1, blush: .34,
  B: { shW: 48, waistW: 44, leg: 26, arm: 21, rx: 60, ry: 58 },
  top: { c: "#D93A32", sleeve: "#D93A32" }, bottom: { type: "shorts", c: "#C7A46A" }, sleeveLen: .5,
  drawTop(p, { S, tw, ww, NY, B }) {
    el("path", { d: `M-20 ${S - 6} L0 ${S + 22} L20 ${S - 6} L34 ${S + 8} L0 ${S + 26} L-34 ${S + 8} Z`, fill: "#B82C26", stroke: INK, "stroke-width": 3, "stroke-linejoin": "round" }, p);
    el("line", { x1: 0, y1: S + 24, x2: 0, y2: 6, stroke: INK, "stroke-width": 2.5, opacity: .5 }, p);
    [S + 44, S + 74, S + 104].forEach(y => el("circle", { cx: 4, cy: y, r: 3.4, fill: "#F6E2C0", stroke: INK, "stroke-width": 1.2 }, p));
    el("path", { d: `M${-tw + 14} ${S + 40} l22 0 l0 18 l-22 0 Z`, fill: "none", stroke: "#8E211C", "stroke-width": 2.5 }, p); },
  drawHead({ back, front, B }) { const rx = B.rx * 1.08, ry = B.ry;
    // short tufty hair
    hairBlob(front, `M${-rx + 2} ${-ry * .25} Q${-rx - 4} ${-ry - 4} 0 ${-ry - 10} Q${rx + 4} ${-ry - 4} ${rx - 2} ${-ry * .25} Q${rx * .7} ${-ry * .62} ${rx * .3} ${-ry * .55} L${rx * .2} ${-ry * .74} L${0} ${-ry * .56} L${-rx * .25} ${-ry * .74} L${-rx * .35} ${-ry * .56} Q${-rx * .7} ${-ry * .6} ${-rx + 2} ${-ry * .25} Z`, "#1A120C");
    [[-18, -ry - 8, -26, -ry - 26], [4, -ry - 10, 6, -ry - 30], [22, -ry - 6, 32, -ry - 22]].forEach(([x1, y1, x2, y2]) => el("path", { d: `M${x1 - 8} ${y1 + 6} Q${x2} ${y2} ${x1 + 8} ${y1 + 4}`, fill: "#1A120C", stroke: INK, "stroke-width": 2.5 }, front)); },
};
const THATAYYA_OPT = {
  name: "thatayya", who: "thatayya", build: "adult", skin: "#B8784E", hair: "#F2EFEA", browC: "#F4F1EC", brow: 8, lip: "#7A3A30", sleeveFull: true, longKurta: true, item: "stick", blush: .15,
  B: { shW: 56, waistW: 50 },
  top: { c: "#F6F2E8", sleeve: "#F1ECE0" }, bottom: { type: "skirt", c: "#FBF8F0", border: "#C9A24A", borderW: 6, flare: 18 },
  drawTop(p, { S, tw, ww }) {
    el("path", { d: `M-16 ${S - 4} L0 ${S + 26} L16 ${S - 4}`, fill: "none", stroke: "#C9C2B0", "stroke-width": 3 }, p);
    [S + 40, S + 66, S + 92].forEach(y => el("circle", { cx: 0, cy: y, r: 3.5, fill: "#D9D2C0", stroke: "#A89F8A", "stroke-width": 1 }, p));
    // kanduva (towel) over the left shoulder
    el("path", { d: `M${-tw - 2} ${S + 30} Q${-tw + 6} ${S - 14} ${-tw + 44} ${S - 8} L${-tw + 34} ${S + 4} Q${-tw + 14} ${S + 4} ${-tw + 16} ${S + 140} L${-tw - 4} ${S + 136} Z`, fill: cloth("#E9D7A8", .1, -.15), stroke: INK, "stroke-width": 3 }, p);
    el("path", { d: `M${-tw - 2} ${S + 126} L${-tw + 16} ${S + 130}`, stroke: "#B5502E", "stroke-width": 5 }, p); },
  drawHead({ back, front, face, B, E, MY }) { const rx = B.rx, ry = B.ry;
    // bald crown, white hair at the sides and back
    hairBlob(back, `M${-rx - 6} 6 Q${-rx - 12} ${-ry * .55} ${-rx * .7} ${-ry * .8} L${rx * .7} ${-ry * .8} Q${rx + 12} ${-ry * .55} ${rx + 6} 6 Q${rx} 22 ${rx - 6} 24 L${-rx + 6} 24 Q${-rx} 22 ${-rx - 6} 6 Z`, "#ECE8E2");
    [-1, 1].forEach(s => hairBlob(front, `M${s * (rx + 4)} 4 Q${s * (rx + 12)} ${-ry * .4} ${s * rx * .62} ${-ry * .62} Q${s * rx * .7} ${-ry * .3} ${s * rx * .82} 0 Z`, "#F2EFEA"));
    el("path", { d: `M${-rx * .45} ${-ry * .62} Q0 ${-ry * .7} ${rx * .45} ${-ry * .62}`, stroke: "#9A6040", "stroke-width": 2.5, fill: "none", opacity: .6 }, face);   // forehead lines
    el("path", { d: `M${-rx * .38} ${-ry * .5} Q0 ${-ry * .57} ${rx * .38} ${-ry * .5}`, stroke: "#9A6040", "stroke-width": 2.5, fill: "none", opacity: .5 }, face);
    [-1, 1].forEach(s => el("path", { d: `M${s * rx * .66} ${E.y - 2} l${s * 8} -4 M${s * rx * .66} ${E.y + 4} l${s * 9} 2`, stroke: "#9A6040", "stroke-width": 2, opacity: .6 }, face));
    // big white moustache
    el("path", { d: `M-4 ${MY - 9} Q-20 ${MY - 16} -38 ${MY - 4} Q-44 ${MY + 4} -36 ${MY + 2} Q-20 ${MY - 4} -4 ${MY - 2} Z M4 ${MY - 9} Q20 ${MY - 16} 38 ${MY - 4} Q44 ${MY + 4} 36 ${MY + 2} Q20 ${MY - 4} 4 ${MY - 2} Z`, fill: "#F6F3EE", stroke: INK, "stroke-width": 2.5 }, face);
    // round glasses
    [-1, 1].forEach(s => el("circle", { cx: s * E.dx, cy: E.y, r: 15, fill: "#DDEFFF", "fill-opacity": .18, stroke: "#5A3A22", "stroke-width": 3.2 }, face));
    el("path", { d: `M${-E.dx + 15} ${E.y - 2} Q0 ${E.y - 8} ${E.dx - 15} ${E.y - 2}`, stroke: "#5A3A22", "stroke-width": 3, fill: "none" }, face);
    [-1, 1].forEach(s => el("line", { x1: s * (E.dx + 15), y1: E.y - 2, x2: s * (rx - 2), y2: E.y - 6, stroke: "#5A3A22", "stroke-width": 3 }, face)); },
  onDraw(t, k) { },
};
const VEERENDRA_OPT = {
  name: "veerendra", who: "veerendra", build: "adult", skin: "#B57A52", hair: "#16100C", lip: "#6A2E28", belly: 30, sleeveFull: true, shoe: "#2A1A12", blush: .12,
  B: { shW: 64, waistW: 54 }, cuff: "#F4EBD8",
  top: { c: "#4A2E5E", sleeve: "#4A2E5E" }, bottom: { type: "trousers", c: "#2B2730" },
  drawTop(p, { S, tw, ww, bel, NY }) {
    // cream shirt open at the collar, jacket lapels, gold chain, pocket square
    el("path", { d: `M-30 ${S - 6} L30 ${S - 6} L22 ${S + 150} Q0 ${S + 168} -22 ${S + 150} Z`, fill: cloth("#F4EBD8", .1, -.12), stroke: INK, "stroke-width": 3 }, p);
    el("path", { d: `M-18 ${S - 6} L0 ${S + 34} L18 ${S - 6} Z`, fill: "#B57A52" }, p);
    el("path", { d: `M-22 ${S - 4} Q0 ${S + 40} 22 ${S - 4}`, fill: "none", stroke: "#E8B83A", "stroke-width": 5 }, p);
    el("path", { d: `M-26 ${S - 2} Q0 ${S + 50} 26 ${S - 2}`, fill: "none", stroke: "#F7D35A", "stroke-width": 3, "stroke-dasharray": "5 3" }, p);
    [-1, 1].forEach(s => el("path", { d: `M${s * 30} ${S - 8} L${s * 52} ${S + 30} L${s * 36} ${S + 46} L${s * 28} ${S + 150} L${s * 22} ${S + 150}`, fill: "#3A2248", stroke: INK, "stroke-width": 3.5, "stroke-linejoin": "round" }, p));
    el("rect", { x: tw * .3, y: S + 52, width: 30, height: 6, fill: "#2A1838" }, p); el("path", { d: `M${tw * .32} ${S + 52} l8 -12 l6 10 l8 -12 l4 14 Z`, fill: "#E8B83A" }, p);
    el("circle", { cx: 0, cy: S + 120, r: 4, fill: "#E8B83A", stroke: INK, "stroke-width": 1.2 }, p);
    el("rect", { x: -ww + 2, y: -18, width: (ww - 2) * 2, height: 12, fill: "#1E1A22" }, p); el("rect", { x: -10, y: -20, width: 20, height: 16, rx: 3, fill: "#E8B83A", stroke: INK, "stroke-width": 2 }, p); },
  drawHead({ back, front, face, top, B, E, MY }) { const rx = B.rx, ry = B.ry;
    hairBlob(front, `M${-rx - 3} 0 Q${-rx - 8} ${-ry - 12} 0 ${-ry - 12} Q${rx + 8} ${-ry - 12} ${rx + 3} 0 Q${rx - 2} ${-ry * .55} ${rx * .3} ${-ry * .68} Q${-rx * .2} ${-ry * .6} ${-rx * .5} ${-ry * .66} Q${-rx + 2} ${-ry * .5} ${-rx - 3} 0 Z`, "#16100C");
    [-1, 1].forEach(s => el("path", { d: `M${s * (rx + 1)} -2 Q${s * (rx + 3)} ${-ry * .3} ${s * rx * .8} ${-ry * .5}`, stroke: "#9A9A9A", "stroke-width": 5, fill: "none", "stroke-linecap": "round" }, front));
    // sunglasses pushed up on the hair
    [-1, 1].forEach(s => el("path", { d: `M${s * 4} ${-ry * .86} L${s * 36} ${-ry * .9} Q${s * 40} ${-ry * .62} ${s * 22} ${-ry * .6} Q${s * 6} ${-ry * .62} ${s * 4} ${-ry * .86} Z`, fill: "#1A2430", stroke: "#C9A440", "stroke-width": 2.5 }, top));
    el("path", { d: `M-30 ${-ry * .82} L-26 ${-ry * .78}`, stroke: "#7FA8C8", "stroke-width": 3, opacity: .8 }, top);
    // thick moustache + a little double chin
    el("path", { d: `M0 ${MY - 9} Q-16 ${MY - 14} -28 ${MY - 4} Q-30 ${MY + 2} -22 ${MY} Q-10 ${MY - 4} 0 ${MY - 3} Q10 ${MY - 4} 22 ${MY} Q30 ${MY + 2} 28 ${MY - 4} Q16 ${MY - 14} 0 ${MY - 9} Z`, fill: "#16100C", stroke: INK, "stroke-width": 2 }, face);
    el("path", { d: `M-20 ${ry * .98} Q0 ${ry * 1.12} 20 ${ry * .98}`, stroke: "#8A5636", "stroke-width": 2.5, fill: "none", opacity: .6 }, face); },
};
const HENCH1_OPT = {
  name: "hench1", who: "hench1", build: "adult", skin: "#9C6440", hair: "#1A1410", lip: "#5A2A22", B: { shW: 64, waistW: 50, arm: 27 }, shoe: "#3A2A1E", item: "axe", blush: .08,
  top: { c: "#6E7A4A" }, bottom: { type: "trousers", c: "#4A4038" }, sleeve: false,
  drawTop(p, { S, tw }) { el("path", { d: `M-24 ${S - 6} Q0 ${S + 30} 24 ${S - 6}`, fill: "#9C6440", stroke: INK, "stroke-width": 3 }, p);
    el("rect", { x: -50, y: -24, width: 100, height: 12, fill: "#2A2018" }, p); },
  drawHead({ front, face, top, B, MY }) { const rx = B.rx, ry = B.ry;
    hairBlob(front, `M${-rx - 2} -4 Q${-rx - 4} ${-ry - 6} 0 ${-ry - 6} Q${rx + 4} ${-ry - 6} ${rx + 2} -4 Q${rx} ${-ry * .6} 0 ${-ry * .62} Q${-rx} ${-ry * .6} ${-rx - 2} -4 Z`, "#1A1410");
    el("path", { d: `M${-rx - 4} ${-ry * .52} Q0 ${-ry * .72} ${rx + 4} ${-ry * .52} L${rx + 2} ${-ry * .3} Q0 ${-ry * .5} ${-rx - 2} ${-ry * .3} Z`, fill: "#B83228", stroke: INK, "stroke-width": 2.5 }, top);
    el("path", { d: `M${rx} ${-ry * .42} l14 10 l-4 16`, stroke: "#B83228", "stroke-width": 7, fill: "none", "stroke-linecap": "round" }, top);
    el("path", { d: `M${-rx * .9} 12 Q${-rx * .8} ${ry * .7} 0 ${ry * .95} Q${rx * .8} ${ry * .7} ${rx * .9} 12 Q${rx * .4} ${ry * .4} 0 ${ry * .42} Q${-rx * .4} ${ry * .4} ${-rx * .9} 12 Z`, fill: "#3A2A20", opacity: .32 }, face); },
};
const HENCH2_OPT = {
  name: "hench2", who: "hench2", build: "adult", skin: "#A86E48", hair: "#2A2420", lip: "#5A2A22", belly: 26, B: { shW: 70, waistW: 58, arm: 29 }, shoe: "#3A2A1E", item: "axe", blush: .08,
  top: { c: "#7A5236", sleeve: "#7A5236" }, bottom: { type: "trousers", c: "#3A3A44" }, sleeveLen: .6,
  drawTop(p, { S }) { el("path", { d: `M-22 ${S - 6} L0 ${S + 22} L22 ${S - 6}`, fill: "#A86E48", stroke: INK, "stroke-width": 3 }, p);
    el("path", { d: `M-60 ${S + 20} Q0 ${S + 60} 60 ${S + 20}`, stroke: "#5A3A24", "stroke-width": 3, fill: "none", opacity: .5 }, p); },
  drawHead({ front, face, B, MY }) { const rx = B.rx, ry = B.ry;
    hairBlob(front, `M${-rx - 2} -2 Q${-rx - 2} ${-ry * .7} ${-rx * .5} ${-ry * .8} Q${-rx * .7} ${-ry * .4} ${-rx * .8} -2 Z M${rx + 2} -2 Q${rx + 2} ${-ry * .7} ${rx * .5} ${-ry * .8} Q${rx * .7} ${-ry * .4} ${rx * .8} -2 Z`, "#2A2420");
    el("path", { d: `M0 ${MY - 9} Q-18 ${MY - 12} -26 ${MY + 8} Q-22 ${MY + 10} -18 ${MY} Q-8 ${MY - 4} 0 ${MY - 4} Q8 ${MY - 4} 18 ${MY} Q22 ${MY + 10} 26 ${MY + 8} Q18 ${MY - 12} 0 ${MY - 9} Z`, fill: "#2A2420", stroke: INK, "stroke-width": 2 }, face);
    el("path", { d: `M${rx * .2} ${-ry * .3} l10 14`, stroke: "#7A4A30", "stroke-width": 3, opacity: .7 }, face); },
};
const VILLAGER_OPTS = [
  { name: "villagerA", who: "villagers", build: "adult", skin: "#C08458", hair: "#1E1410", lip: "#9A3A3A", blush: .25, lash: 3.6, B: { shW: 52, waistW: 44, rx: 41 },
    top: { c: "#E07A2E", sleeve: "#E07A2E" }, bottom: { type: "skirt", c: "#E8873A", border: "#8A2A5A", borderW: 10, flare: 22 }, sleeveLen: .45,
    drawTop(p, { S, tw, ww }) { el("path", { d: `M${tw - 6} ${S + 2} L${tw - 34} ${S - 4} L${-ww - 4} 4 L${-ww + 22} 10 Z`, fill: cloth("#F0953F", .15, -.1), stroke: INK, "stroke-width": 3 }, p);
      el("path", { d: `M${tw - 34} ${S - 2} L${-ww - 2} 2`, stroke: "#8A2A5A", "stroke-width": 6 }, p); },
    drawHead({ back, front, B }) { const rx = B.rx, ry = B.ry; hairBlob(back, `M${rx * .4} ${-ry * .6} Q${rx * 1.4} ${-ry * .5} ${rx * 1.1} 8 Q${rx * .9} 20 ${rx * .7} 6 Z`, "#1E1410");
      el("circle", { cx: rx * .95, cy: -2, r: 18, fill: "#1E1410", stroke: INK, "stroke-width": 2.5 }, back);
      hairBlob(front, `M${-rx - 3} 2 Q${-rx - 4} ${-ry - 6} 0 ${-ry - 6} Q${rx + 4} ${-ry - 6} ${rx + 3} 2 Q${rx * .7} ${-ry * .7} 0 ${-ry * .72} Q${-rx * .7} ${-ry * .7} ${-rx - 3} 2 Z`, "#1E1410");
      [-1, 1].forEach(s => el("circle", { cx: s * rx, cy: 20, r: 4, fill: "#F2C230" }, front)); } },
  { name: "villagerB", who: "villagers", build: "adult", skin: "#A56C44", hair: "#2A221C", lip: "#6A2E28", B: { shW: 58, waistW: 48 }, blush: .1,
    top: { c: "#F3F0E6" }, bottom: { type: "skirt", c: "#3E7A5A", checks: "#E8D98A", len: .86, flare: 16 }, sleeve: false,
    drawTop(p, { S, tw }) { el("path", { d: `M-30 ${S - 6} Q0 ${S + 26} 30 ${S - 6}`, fill: "#A56C44", stroke: INK, "stroke-width": 3 }, p);
      el("path", { d: `M${tw - 10} ${S - 8} Q${tw + 10} ${S + 20} ${tw - 4} ${S + 120} L${tw - 22} ${S + 116} Q${tw - 10} ${S + 30} ${tw - 34} ${S - 4} Z`, fill: cloth("#D9C590", .1, -.1), stroke: INK, "stroke-width": 3 }, p); },
    drawHead({ front, face, B, MY }) { const rx = B.rx, ry = B.ry;
      hairBlob(front, `M${-rx - 2} -6 Q${-rx - 4} ${-ry - 8} 0 ${-ry - 8} Q${rx + 4} ${-ry - 8} ${rx + 2} -6 Q${rx * .6} ${-ry * .55} 0 ${-ry * .6} Q${-rx * .6} ${-ry * .55} ${-rx - 2} -6 Z`, "#2A221C");
      el("path", { d: `M0 ${MY - 8} Q-16 ${MY - 12} -24 ${MY - 2} Q-14 ${MY - 4} 0 ${MY - 2} Q14 ${MY - 4} 24 ${MY - 2} Q16 ${MY - 12} 0 ${MY - 8} Z`, fill: "#2A221C" }, face); } },
  { name: "villagerC", who: "villagers", build: "adult", skin: "#B07650", hair: "#9A948C", lip: "#8A3A3A", blush: .2, lash: 3.4, B: { shW: 52, waistW: 46, rx: 41 }, belly: 10,
    top: { c: "#5A64B8", sleeve: "#5A64B8" }, bottom: { type: "skirt", c: "#6A74C8", border: "#E8B83A", borderW: 9, flare: 22 }, sleeveLen: .5,
    drawTop(p, { S, tw, ww }) { el("path", { d: `M${-tw + 6} ${S + 2} L${-tw + 34} ${S - 4} L${ww + 4} 4 L${ww - 22} 10 Z`, fill: cloth("#7A84D8", .12, -.1), stroke: INK, "stroke-width": 3 }, p); },
    drawHead({ back, front, face, B, E }) { const rx = B.rx, ry = B.ry; el("circle", { cx: 0, cy: -ry * .95, r: 20, fill: "#9A948C", stroke: INK, "stroke-width": 2.5 }, back);
      hairBlob(front, `M${-rx - 3} 4 Q${-rx - 4} ${-ry - 4} 0 ${-ry - 4} Q${rx + 4} ${-ry - 4} ${rx + 3} 4 Q${rx * .7} ${-ry * .7} 0 ${-ry * .74} Q${-rx * .7} ${-ry * .7} ${-rx - 3} 4 Z`, "#9A948C");
      [-1, 1].forEach(s => el("path", { d: `M${s * rx * .62} ${E.y + 6} l${s * 7} 3`, stroke: "#8A5A3A", "stroke-width": 2, opacity: .6 }, face)); } },
];
const makeMeera = (x = {}) => makePerson({ ...MEERA_OPT, ...x });
const makeChintu = (x = {}) => makePerson({ ...CHINTU_OPT, ...x });
const makeThatayya = (x = {}) => makePerson({ ...THATAYYA_OPT, ...x });
const makeVeerendra = (x = {}) => makePerson({ ...VEERENDRA_OPT, ...x });
const makeHench = (n = 1, x = {}) => makePerson({ ...(n === 1 ? HENCH1_OPT : HENCH2_OPT), ...x });
const makeVillager = (n = 0, x = {}) => makePerson({ ...VILLAGER_OPTS[n % 3], ...x });

// ---------- Vriksha Devata: a kind guardian spirit of leaves, vines and golden light (no idol, no religious symbols) ----------
// st: x, y (centre of the waist, she floats), s, glow 0..1, talk, blink, mood (neutral|happy|sad|stern), arms ("open"|"down"|"reach"), vis
function makeDevata(o = {}) {
  const g = el("g", { "data-actor": "devata" }, null), id = KIT.uid("dv");
  const aura = el("ellipse", { cx: 0, cy: -150, rx: 420, ry: 520, fill: KIT.rgrad([[0, "#FFF2B8", .75], [.4, "#FFD867", .32], [1, "#FFC23A", 0]]) }, g);
  const hairG = el("g", {}, g), gown = el("g", {}, g), armsG = el("g", {}, g), headG = el("g", { transform: "translate(0 -330)" }, g), leavesG = el("g", {}, g);
  const leafD = "M0 0 Q10 -14 0 -34 Q-10 -14 0 0 Z";
  const G1 = "#3E9A4E", G2 = "#7CC255", GOLD = "#F2C94C";
  // hair: long strands of leaves flowing up and back, swaying
  const strands = [...Array(10)].map((_, i) => { const p = el("path", { fill: "none", stroke: i % 2 ? "#4FA850" : "#2F7E44", "stroke-width": 28 - (i % 5) * 3, "stroke-linecap": "round", opacity: .95 }, hairG);
    const lv = [...Array(6)].map((_, j) => el("path", { d: leafD, fill: j % 2 ? G2 : "#5DB25A", stroke: "#24603A", "stroke-width": 1.5 }, hairG)); return { p, lv, i }; });
  // gown: a flowing teardrop of green fading to gold, trailing into vines
  const gownFill = KIT.lgrad([[0, "#6CC060"], [.45, "#3E9A4E"], [.85, "#C9C25A"], [1, "#F2C94C", .2]], 0, 0, 0, 1);
  const body = el("path", { fill: gownFill, stroke: "#24603A", "stroke-width": 3.5, "stroke-linejoin": "round" }, gown);
  const vines = [0, 1, 2].map(i => el("path", { fill: "none", stroke: i === 1 ? "#E9C24A" : "#3E8A44", "stroke-width": 7 - i, "stroke-linecap": "round" }, gown));
  const gLeaves = [...Array(26)].map((_, i) => el("path", { d: leafD, fill: [G2, "#58AE52", "#A6CF5A", GOLD][i % 4], stroke: "#24603A", "stroke-width": 1.5, opacity: .95 }, gown));
  el("path", { d: "M-46 -270 Q0 -240 46 -270 L40 -230 Q0 -210 -40 -230 Z", fill: "#A6CF5A", stroke: "#24603A", "stroke-width": 3 }, gown);   // leafy collar
  // arms (soft golden skin), vines winding round the forearms
  const skin = "#EBCB8F", skinFill = KIT.lgrad([[0, "#F6DFAE"], [1, "#D9B070"]], 0, 0, 1, 1);
  const arms = [-1, 1].map(s => { const ag = el("g", {}, armsG); const o1 = line(ag, 36, "#24603A"), a1 = line(ag, 30, skin), o2 = line(ag, 31, "#24603A"), a2 = line(ag, 25, skin);
    const vine = el("path", { fill: "none", stroke: "#3E9A4E", "stroke-width": 4 }, ag); const hand = el("ellipse", { rx: 16, ry: 19, fill: skin, stroke: "#24603A", "stroke-width": 2.5 }, ag);
    const lf = el("path", { d: leafD, fill: G2, stroke: "#24603A", "stroke-width": 1.5 }, ag); return { s, o1, a1, o2, a2, vine, hand, lf }; });
  // head: serene face, leaf crown-less hairline (leaves frame the face), no forehead marks
  const neck = el("rect", { x: -13, y: 28, width: 26, height: 40, fill: skinFill, stroke: "#24603A", "stroke-width": 2.5 }, headG);
  el("path", { d: "M-58 -6 Q-70 -70 0 -82 Q70 -70 58 -6 Q70 40 56 70 Q30 52 30 30 L-30 30 Q-30 52 -56 70 Q-70 40 -58 -6 Z", fill: "#3E9A4E", stroke: "#24603A", "stroke-width": 3 }, headG);   // leafy hair mass
  const faceShape = el("path", { d: "M-44 -14 Q-44 -64 0 -64 Q44 -64 44 -14 Q44 30 22 50 Q0 64 -22 50 Q-44 30 -44 -14 Z", fill: skinFill, stroke: "#24603A", "stroke-width": 3 }, headG);
  const lids = [-1, 1].map(s => el("path", { fill: "none", stroke: "#3A2A18", "stroke-width": 3.4, "stroke-linecap": "round" }, headG));
  const irises = [-1, 1].map(s => el("ellipse", { rx: 6.5, ry: 7.5, fill: "#3E8A44" }, headG));
  const glints = [-1, 1].map(s => el("circle", { r: 2.2, fill: "#FFFBE6" }, headG));
  [-1, 1].forEach(s => el("path", { d: `M${s * 10} -26 Q${s * 20} -32 ${s * 32} -27`, stroke: "#5A7A3A", "stroke-width": 3.5, fill: "none", "stroke-linecap": "round" }, headG));
  el("path", { d: "M2 -10 Q-3 6 1 10 Q5 12 8 9", stroke: "#B58A5A", "stroke-width": 2.5, fill: "none" }, headG);
  [-1, 1].forEach(s => el("ellipse", { cx: s * 26, cy: 14, rx: 9, ry: 5, fill: "#F2A07A", opacity: .35 }, headG));
  const mouthL = el("path", { fill: "none", stroke: "#9A4A3A", "stroke-width": 3.2, "stroke-linecap": "round" }, headG);
  const mouthO = el("path", { fill: "#8A3A30", stroke: "#5A2A20", "stroke-width": 2 }, headG);
  const frame = [...Array(12)].map((_, i) => el("path", { d: leafD, fill: i % 3 === 0 ? GOLD : i % 2 ? G2 : "#5DB25A", stroke: "#24603A", "stroke-width": 1.5 }, headG));
  frame.forEach((f, i) => { const a = Math.PI * (1.02 + i / 11 * .96), r = 64; f.setAttribute("transform", `translate(${Math.cos(a) * r * 1.02} ${Math.sin(a) * r - 6}) rotate(${a * 180 / Math.PI + 90}) scale(1.05)`); });
  const floatLeaves = [...Array(14)].map((_, i) => el("path", { d: leafD, fill: i % 2 ? GOLD : G2, stroke: "#24603A", "stroke-width": 1.2 }, leavesG));
  const st = { x: 0, y: 0, s: 1, vis: 1, glow: 1, talk: null, blink: null, mood: "neutral", arms: "open", flip: 1, who: o.who || "devata", seed: 3, look: 0 };
  function draw(t) { const k = st, bob = Math.sin(t * 1.3) * 10;
    g.setAttribute("transform", `translate(${k.x} ${k.y + bob}) scale(${k.s * k.flip} ${k.s})`); g.style.opacity = k.vis;
    aura.setAttribute("opacity", .35 + .65 * k.glow * (.9 + .1 * Math.sin(t * 2.2))); aura.setAttribute("rx", 380 + 50 * k.glow);
    // gown silhouette sways at the hem
    const sw = Math.sin(t * 1.1) * 26, sw2 = Math.sin(t * 1.1 + 1) * 40;
    body.setAttribute("d", `M-46 -268 Q-78 -200 -84 -100 Q-96 20 -60 120 Q${-30 + sw} 210 ${10 + sw2} 280 Q${40 + sw} 200 70 110 Q100 10 86 -100 Q78 -200 46 -268 Z`);
    vines.forEach((v, i) => { const ph = t * 1.2 + i * 2; v.setAttribute("d", `M${-30 + i * 30} 140 Q${-20 + i * 26 + Math.sin(ph) * 30} 230 ${-10 + i * 20 + sw2 * .8} 300 Q${i * 14 + Math.sin(ph + 1) * 40} 350 ${10 + i * 10 + sw2} 400`); });
    gLeaves.forEach((l, i) => { const fy = -230 + (i % 13) * 34, fx = (i < 13 ? -1 : 1) * (52 + (fy + 230) * .14 * (fy > 0 ? 1.2 : 1)) * (.55 + hash(i) * .5) + (fy > 100 ? sw * .5 : 0);
      l.setAttribute("transform", `translate(${fx} ${fy}) rotate(${(i < 13 ? -40 : 40) + Math.sin(t * 1.6 + i) * 12 + 180}) scale(${1.1 + hash(i * 3) * .5})`); });
    strands.forEach(({ p, lv, i }) => { const sd = i < 5 ? -1 : 1, jj = i % 5, a0 = -90 + sd * (28 + jj * 17), ph = t * .9 + i * .6; const pts = [];
      for (let j = 0; j <= 6; j++) { const r = 30 + j * 40, a = (a0 + sd * j * 7 + Math.sin(ph + j * .5) * (4 + j * 2.5)) * Math.PI / 180; pts.push([Math.cos(a) * r * .95, -362 + Math.sin(a) * r * .7 + j * j * 5]); }
      p.setAttribute("d", "M" + pts.map(q => q.join(" ")).join(" L"));
      lv.forEach((l, j) => { const q = pts[j + 1]; l.setAttribute("transform", `translate(${q[0]} ${q[1]}) rotate(${a0 + 90 + sd * j * 10 + Math.sin(ph + j) * 25}) scale(${1.25 - j * .06})`); }); });
    // arms
    const AP = { open: [[-235, -175], [235, -175]], down: [[-100, -50], [100, -50]], reach: [[-130, -180], [170, -150]], bless: [[-120, -120], [140, -120]] }[k.arms] || [[-150, -60], [150, -60]];
    arms.forEach((A, i) => { const sh = [A.s * 50, -250], tg = [AP[i][0] + Math.sin(t * 1.2 + i) * 8, AP[i][1] + Math.cos(t * 1.1 + i) * 8];
      const [e, h] = ik(sh[0], sh[1], tg[0], tg[1], 105, 100, A.s > 0 ? -1 : 1);
      setL(A.o1, sh, e); setL(A.a1, sh, e); setL(A.o2, e, h); setL(A.a2, e, h); A.hand.setAttribute("cx", h[0]); A.hand.setAttribute("cy", h[1]);
      A.vine.setAttribute("d", `M${sh[0]} ${sh[1]} Q${e[0] + 14} ${e[1] - 10} ${e[0]} ${e[1]} Q${(e[0] + h[0]) / 2 - 12} ${(e[1] + h[1]) / 2 + 12} ${h[0]} ${h[1]}`);
      A.lf.setAttribute("transform", `translate(${e[0]} ${e[1]}) rotate(${A.s * 60})`); });
    // face
    const bl = k.blink, tk = clamp(k.talk || 0), M = k.mood;
    [-1, 1].forEach((s, i) => { const x = s * 17 + k.look * 3, y = -10;
      lids[i].setAttribute("d", bl || M === "closed" ? `M${x - 11} ${y} Q${x} ${y + 6} ${x + 11} ${y}` : `M${x - 12} ${y} Q${x} ${y - 11} ${x + 12} ${y}`);
      irises[i].setAttribute("cx", x); irises[i].setAttribute("cy", y + 1); irises[i].style.opacity = bl || M === "closed" ? 0 : 1;
      glints[i].setAttribute("cx", x - 2); glints[i].setAttribute("cy", y - 2); glints[i].style.opacity = bl || M === "closed" ? 0 : 1; });
    if (tk > .12) { mouthO.style.opacity = 1; mouthL.style.opacity = 0; mouthO.setAttribute("d", `M-10 30 Q0 27 10 30 Q8 ${32 + tk * 12} 0 ${33 + tk * 13} Q-8 ${32 + tk * 12} -10 30 Z`); }
    else { mouthO.style.opacity = 0; mouthL.style.opacity = 1; mouthL.setAttribute("d", M === "stern" ? "M-11 32 Q0 31 11 32" : M === "sad" ? "M-10 34 Q0 29 10 34" : "M-12 29 Q0 37 12 29"); }
    floatLeaves.forEach((l, i) => { const ph = fract(t * .07 + hash(i)), a = hash(i * 2) * 6.28 + t * .2; const r = 200 + hash(i * 5) * 160;
      l.setAttribute("transform", `translate(${Math.cos(a) * r} ${-150 + Math.sin(a) * r * .8 - ph * 120}) rotate(${t * 40 + i * 30}) scale(${.6 + hash(i * 7) * .5})`); l.style.opacity = Math.sin(ph * Math.PI); });
  }
  return KIT.register({ g, st, draw, name: "devata" });
}

// ---------- the small deer (fawn), side view facing right ----------
// st: x, y (hooves), s, flip, pose: stand|struggle|run|lie|nuzzle, mood: calm|scared, blink, phase
function makeDeer() {
  const g = el("g", { "data-actor": "deer" }, null), bodyC = "#C27A3E", belly = "#F3DDB8";
  const shadow = el("ellipse", { cx: 0, cy: 2, rx: 110, ry: 12, fill: "#1a0e06", opacity: .2 }, g);
  const root = el("g", {}, g);
  const legs = [[-58, 0], [-40, 1], [44, 0], [62, 1]].map(([x, far]) => { const lg = el("g", {}, root);
    const o1 = line(lg, 16, INK), up = line(lg, 12, far ? shade(bodyC, -.2) : bodyC), o2 = line(lg, 12, INK), lo = line(lg, 8, far ? shade(bodyC, -.2) : bodyC); const hoof = el("ellipse", { rx: 7, ry: 5, fill: "#2A1A10" }, lg);
    return { x, far, lg, o1, up, o2, lo, hoof }; });
  legs.filter(l => l.far).forEach(l => root.insertBefore(l.lg, root.firstChild));
  const torso = el("g", {}, root);
  el("path", { d: "M-80 -150 Q-96 -112 -76 -88 Q-20 -72 50 -84 Q90 -92 92 -130 Q88 -168 40 -168 Q-40 -176 -80 -150 Z", fill: KIT.lgrad([[0, "#D88E4E"], [1, "#A8622E"]]), stroke: INK, "stroke-width": 3.5 }, torso);
  el("path", { d: "M-70 -96 Q-10 -80 60 -92 Q40 -76 -10 -76 Q-50 -78 -70 -96 Z", fill: belly, opacity: .9 }, torso);
  [[-40, -140], [-14, -150], [14, -144], [-30, -118], [4, -124], [36, -130], [-56, -128]].forEach(([x, y]) => el("ellipse", { cx: x, cy: y, rx: 6, ry: 4.5, fill: "#FFF1D6", opacity: .9 }, torso));
  const tail = el("path", { d: "M-82 -148 Q-100 -160 -96 -142 Q-92 -136 -82 -140 Z", fill: "#FFF1D6", stroke: INK, "stroke-width": 2.5 }, torso);
  const neckHead = el("g", { transform: "translate(70 -150)" }, root);
  el("path", { d: "M-20 10 Q-14 -40 4 -66 L32 -58 Q22 -20 22 14 Z", fill: KIT.lgrad([[0, "#D88E4E"], [1, "#B06A34"]]), stroke: INK, "stroke-width": 3.5 }, neckHead);
  const head = el("g", { transform: "translate(14 -78)" }, neckHead);
  const ears = [-1, 1].map(s => el("path", { d: "M0 0 Q-34 -26 -46 -10 Q-30 6 0 4 Z", fill: s < 0 ? "#B06A34" : "#D88E4E", stroke: INK, "stroke-width": 3, transform: `translate(${-4 + s * 6} -14) rotate(${s * 18})` }, head));
  el("path", { d: "M-22 -10 Q-20 -36 6 -34 Q30 -30 52 -6 Q60 6 50 12 Q30 18 8 14 Q-18 12 -22 -10 Z", fill: KIT.lgrad([[0, "#DE9656"], [1, "#B8723A"]]), stroke: INK, "stroke-width": 3.5 }, head);
  el("ellipse", { cx: 52, cy: 2, rx: 7, ry: 6, fill: "#2A1A10" }, head);
  const eyeW = el("ellipse", { cx: 8, cy: -14, rx: 9, ry: 10, fill: "#1E120A" }, head), eyeH = el("circle", { cx: 5, cy: -18, r: 3, fill: "#fff" }, head);
  const eyeC = el("path", { d: "M-1 -13 Q8 -7 17 -13", stroke: "#1E120A", "stroke-width": 3, fill: "none", "stroke-linecap": "round" }, head);
  const scared = el("ellipse", { cx: 8, cy: -14, rx: 11.5, ry: 12.5, fill: "#fff", stroke: INK, "stroke-width": 1.5 }, head); head.insertBefore(scared, eyeW);
  el("path", { d: "M30 10 Q38 14 46 10", stroke: "#6A3A20", "stroke-width": 2, fill: "none" }, head);
  const st = { x: 0, y: 0, s: 1, flip: 1, vis: 1, pose: "stand", mood: "calm", blink: null, phase: 0, headRot: 0, hop: 0, seed: 5, talk: 0 };
  function draw(t) { const k = st; let hop = k.hop, rot = 0; const ph = k.phase;
    g.setAttribute("transform", `translate(${k.x} ${k.y}) scale(${k.s * k.flip} ${k.s})`); g.style.opacity = k.vis;
    let hr = k.headRot + Math.sin(t * 1.4) * 2;
    if (k.pose === "run") { hop += Math.abs(Math.sin(ph)) * 40; rot = Math.sin(ph) * -8; }
    if (k.pose === "struggle") { rot = Math.sin(t * 9) * 4; hr += Math.sin(t * 7) * 14; }
    if (k.pose === "lie") { hop = -70; }
    root.setAttribute("transform", `translate(0 ${-hop}) rotate(${rot} 0 -110)`);
    shadow.setAttribute("rx", 110 - clamp(hop / 100) * 40);
    neckHead.setAttribute("transform", `translate(70 -150) rotate(${hr + (k.pose === "nuzzle" ? 28 : 0)} 0 0)`);
    legs.forEach((L, i) => { const hipY = -100, sx = L.x; let fx = sx, fy = 0, bend = i < 2 ? -1 : 1;
      if (k.pose === "run") { const p = ph + (i < 2 ? Math.PI : 0) + L.far * .4; fx = sx + Math.sin(p) * 46; fy = -Math.max(0, Math.cos(p)) * 30 + hop; }
      else if (k.pose === "struggle") { fx = sx + Math.sin(t * 10 + i * 1.7) * (i < 2 ? 22 : 10); fy = -Math.max(0, Math.sin(t * 10 + i)) * 16; }
      else if (k.pose === "lie") { fx = sx + (i < 2 ? -20 : 30); fy = 70 - 30; }
      const sy = hipY; const [kn, f] = k.pose === "lie" ? [[sx + (i < 2 ? -30 : 34), -52 + 70], [fx + (i < 2 ? -10 : 34), -40 + 70]] : ik(sx, sy - hop, fx, fy, 52, 52, bend);
      setL(L.o1, [sx, sy - hop], kn); setL(L.up, [sx, sy - hop], kn); setL(L.o2, kn, f); setL(L.lo, kn, f); L.hoof.setAttribute("cx", f[0] + 2); L.hoof.setAttribute("cy", f[1]); });
    const sc = k.mood === "scared"; scared.style.opacity = sc ? 1 : 0; eyeW.setAttribute("rx", sc ? 6 : 9); eyeW.setAttribute("ry", sc ? 7 : 10);
    const b = k.blink; [eyeW, eyeH].forEach(e => e.style.opacity = b ? 0 : 1); eyeC.style.opacity = b ? 1 : 0; if (b) scared.style.opacity = 0;
    ears.forEach((e, i) => e.setAttribute("transform", `translate(${-4 + (i ? 1 : -1) * 6} -14) rotate(${(i ? 1 : -1) * 18 + (sc ? -24 : Math.sin(t * 2 + i) * 6)})`));
    tail.setAttribute("transform", `rotate(${Math.sin(t * 6) * 10} -82 -144)`); }
  return KIT.register({ g, st, draw, name: "deer" });
}

// ---------- the small bird (sparrow-like), side view facing right ----------
// st: x, y, s, flip, pose: stand|fly|tired|drink|hop, flap (auto when flying), blink
function makeBird() {
  const g = el("g", { "data-actor": "bird" }, null), root = el("g", {}, g);
  const wingBack = el("path", { d: "M0 0 Q-30 -40 -64 -36 Q-40 -10 0 6 Z", fill: "#8A5A34", stroke: INK, "stroke-width": 2.5 }, root);
  const legs = [-6, 6].map(x => el("path", { d: `M${x} 18 L${x} 34 M${x - 6} 34 L${x + 6} 34`, stroke: "#C77A3A", "stroke-width": 3, fill: "none", "stroke-linecap": "round" }, root));
  const tail = el("path", { d: "M-24 2 L-56 -6 L-54 10 Z", fill: "#7A4A2A", stroke: INK, "stroke-width": 2.5, "stroke-linejoin": "round" }, root);
  el("ellipse", { cx: 0, cy: 0, rx: 30, ry: 22, fill: KIT.lgrad([[0, "#C98A52"], [1, "#8A5430"]]), stroke: INK, "stroke-width": 3 }, root);
  el("path", { d: "M-10 10 Q8 24 26 6 Q14 20 -6 18 Z", fill: "#F4E2C4" }, root);
  const headG = el("g", { transform: "translate(22 -16)" }, root);
  el("circle", { r: 17, fill: KIT.lgrad([[0, "#A86A3A"], [1, "#7A4A2A"]]), stroke: INK, "stroke-width": 3 }, headG);
  el("path", { d: "M2 6 Q12 14 16 4 Q8 2 2 6 Z", fill: "#F4E2C4" }, headG);
  el("path", { d: "M14 -4 L30 0 L14 5 Z", fill: "#F2B33A", stroke: INK, "stroke-width": 2, "stroke-linejoin": "round" }, headG);
  const eye = el("circle", { cx: 6, cy: -4, r: 4, fill: "#140904" }, headG), eyeH = el("circle", { cx: 5, cy: -5.5, r: 1.4, fill: "#fff" }, headG);
  const eyeC = el("path", { d: "M1 -3 Q6 0 11 -3", stroke: "#140904", "stroke-width": 2.5, fill: "none" }, headG);
  const wing = el("path", { d: "M-4 -4 Q-34 -30 -56 -10 Q-30 10 -2 8 Z", fill: KIT.lgrad([[0, "#A0683C"], [1, "#6E4224"]]), stroke: INK, "stroke-width": 2.5 }, root);
  el("path", { d: "M-20 -6 Q-34 -4 -44 -8 M-16 0 Q-30 2 -40 0", stroke: "#4A2A16", "stroke-width": 2, fill: "none", opacity: .6 }, root);
  const st = { x: 0, y: 0, s: 1, flip: 1, vis: 1, pose: "stand", blink: null, flap: null, seed: 9, talk: 0 };
  function draw(t) { const k = st; let rot = 0, dy = 0, hr = 0; const fl = k.flap == null ? (k.pose === "fly" ? Math.sin(t * 22) : 0) : k.flap;
    if (k.pose === "tired") { rot = 72; dy = 26; hr = 10; }
    if (k.pose === "drink") { rot = 18; hr = 34; }
    if (k.pose === "hop") dy = -Math.abs(Math.sin(t * 8)) * 16;
    if (k.pose === "stand") hr = Math.sin(t * 3) * 6;
    g.setAttribute("transform", `translate(${k.x} ${k.y}) scale(${k.s * k.flip} ${k.s})`); g.style.opacity = k.vis;
    root.setAttribute("transform", `translate(0 ${dy - 34}) rotate(${rot})`);
    headG.setAttribute("transform", `translate(22 -16) rotate(${hr})`);
    const wa = k.pose === "fly" ? -40 * fl : (k.pose === "tired" ? 30 : 0);
    wing.setAttribute("transform", `rotate(${wa} -4 0) scale(1 ${k.pose === "fly" ? 1.1 : 1})`); wingBack.style.opacity = k.pose === "fly" ? 1 : 0;
    wingBack.setAttribute("transform", `rotate(${-40 * fl * .8 + 10} 0 0)`);
    legs.forEach(l => l.style.opacity = k.pose === "fly" ? 0 : 1);
    const closed = k.blink || k.pose === "tired"; eye.style.opacity = closed ? 0 : 1; eyeH.style.opacity = closed ? 0 : 1; eyeC.style.opacity = closed ? 1 : 0; }
  return KIT.register({ g, st, draw, name: "bird" });
}
