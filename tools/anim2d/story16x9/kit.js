// story16x9 kit: a 1920x1080 storybook stage for long YouTube stories (first used for "చివరి చెట్టు రహస్యం", 15 Nov 2026).
// Load order in a scene page:  kit.js -> cast.js -> sets.js (-> ../skins.js optional) -> your <script> with function scene(t).
// Every frame is a pure function of t (actors are reset in KIT.begin), so a scene can be rendered in parallel chunks.
// See README.md in this folder.
"use strict";
const NS = "http://www.w3.org/2000/svg", W = 1920, H = 1080;
function el(tag, attrs, parent) { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent !== null) (parent || KIT.svg).appendChild(e); return e; }
const txt = (s, attrs, parent) => { const e = el("text", attrs, parent); e.textContent = s; return e; };
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), lerp = (a, b, k) => a + (b - a) * k;
const ease = x => { x = clamp(x); return x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; };
const out = x => 1 - Math.pow(1 - clamp(x), 3);
const back = x => { x = clamp(x); const c = 1.9; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const fract = x => x - Math.floor(x), hash = i => fract(Math.sin(i * 127.1 + 311.7) * 43758.5453);
const rng = (t, a, b) => clamp((t - a) / (b - a));                    // 0..1 progress of t through [a,b]
const pulse = (t, a, b, f = .3) => Math.min(rng(t, a, a + f), 1 - rng(t, b - f, b));   // fade in at a, out at b
const pop = (t, t0, d = .35) => t < t0 ? 0 : back((t - t0) / d);
function noise1(x, seed = 0) { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hash(i + seed * 57.3), hash(i + 1 + seed * 57.3), u) * 2 - 1; }
function hex2(c) { c = c.replace("#", ""); if (c.length === 3) c = c.split("").map(x => x + x).join(""); return [0, 2, 4].map(i => parseInt(c.substr(i, 2), 16)); }
function mixc(a, b, k) { if (k <= 0) return a; if (k >= 1) return b; const A = hex2(a), B = hex2(b); return "#" + A.map((v, i) => Math.round(lerp(v, B[i], k)).toString(16).padStart(2, "0")).join(""); }

const KIT = (() => {
  const base = (document.currentScript && document.currentScript.src) || location.href;
  const FONTS = (typeof KIT_FONTS !== "undefined") ? KIT_FONTS : new URL("../../../brand/fonts/", base).href;
  const css = document.createElement("style");
  css.textContent = `
@font-face{font-family:Rama;src:url(${FONTS}Ramabhadra-Regular.ttf),url(fonts/Ramabhadra-Regular.ttf)}
@font-face{font-family:NotoTe;src:url(${FONTS}NotoSansTelugu.ttf),url(fonts/NotoSansTelugu.ttf)}
@font-face{font-family:Anton;src:url(${FONTS}Anton-Regular.ttf),url(fonts/Anton-Regular.ttf)}
@font-face{font-family:InterB;src:url(${FONTS}Inter.ttf),url(fonts/Inter.ttf)}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#1b1410}
#stage{position:absolute;left:0;top:0;width:${W}px;height:${H}px;overflow:hidden}
#s{position:absolute;left:0;top:0;display:block}
.fx{position:absolute;inset:0;pointer-events:none;opacity:0}
#fx-glow{mix-blend-mode:screen}
#fx-grain{opacity:.22;mix-blend-mode:multiply;background-size:480px 270px}
#fx-vig{background:radial-gradient(ellipse 75% 70% at 50% 48%,rgba(0,0,0,0) 55%,rgba(20,10,4,.55) 100%)}
#k-title{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:0;
  background:radial-gradient(ellipse 60% 45% at 50% 50%,rgba(18,10,4,.72),rgba(18,10,4,.25) 70%,rgba(0,0,0,0))}
#k-title .tt{font-family:Rama,NotoTe;font-size:118px;line-height:1.25;color:#FFD877;-webkit-text-stroke:10px #3A2208;paint-order:stroke fill;
  text-shadow:0 8px 0 #2A1604,0 0 40px rgba(255,190,60,.55);text-align:center;padding:0 80px}
#k-title .ts{margin-top:18px;font-family:Rama,NotoTe;font-size:52px;color:#FFF6E0;text-shadow:0 3px 0 #2A1604,0 0 18px rgba(0,0,0,.8);text-align:center}
#k-title svg{margin:10px 0}
#k-sub{position:absolute;left:50%;bottom:30px;transform:translateX(-50%);max-width:1600px;min-width:300px;padding:10px 38px 16px;text-align:center;
  font-family:Rama,NotoTe;font-size:46px;line-height:1.4;color:#fff;background:rgba(24,14,8,.6);border-radius:30px;
  text-shadow:0 3px 0 #000,0 0 12px rgba(0,0,0,.85);opacity:0;white-space:normal}
#k-chip{position:absolute;left:50%;transform:translateX(-50%);display:inline-block;font-family:Rama,NotoTe;font-size:34px;line-height:1.3;padding:2px 22px 6px;
  border-radius:16px;color:#1d120a;border:3px solid #2A1A10;box-shadow:0 4px 0 rgba(0,0,0,.45);opacity:0;white-space:nowrap}
#k-fade{background:#000}
#k-brand{position:absolute;top:30px;right:40px;font-family:Anton;font-size:30px;letter-spacing:3px;color:#fff;opacity:.0;text-shadow:0 2px 0 #000}`;
  document.head.appendChild(css);
  const stage = document.createElement("div"); stage.id = "stage"; document.body.appendChild(stage);
  stage.innerHTML = `<svg id="s" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs id="kdefs"></defs><g id="kroot"><g id="kworld"></g></g></svg>
<canvas id="fx-cv" class="fx" width="${W}" height="${H}" style="opacity:1"></canvas>
<div id="fx-glow" class="fx"></div><div id="fx-torch" class="fx"></div><div id="fx-vig" class="fx"></div><div id="fx-grain" class="fx"></div>
<div id="fx-flash" class="fx" style="background:#fff"></div><div id="k-fade" class="fx"></div>
<div id="k-title"><div class="tt"></div><svg width="620" height="40" viewBox="0 0 620 40"><path d="M10 20 Q160 4 300 20 Q460 36 610 20" stroke="#FFD877" stroke-width="4" fill="none"/>
<path d="M310 20 q-26 -22 -52 0 q26 22 52 0 Z M310 20 q26 -22 52 0 q-26 22 -52 0 Z" fill="#7FBF5A" stroke="#3A2208" stroke-width="2"/><circle cx="310" cy="20" r="6" fill="#FFD877"/></svg><div class="ts"></div></div>
<div id="k-chip"></div><div id="k-sub"></div><div id="k-brand">REEL RASAM</div>`;
  const svg = document.getElementById("s"), defs = document.getElementById("kdefs"), root = document.getElementById("kroot"), world = document.getElementById("kworld");
  const $ = id => document.getElementById(id);
  const cv = $("fx-cv"), cx = cv.getContext("2d");
  { // paper/storybook grain tile (cheap: one multiply layer)
    const c = document.createElement("canvas"); c.width = 480; c.height = 270; const x = c.getContext("2d"), im = x.createImageData(480, 270);
    let sd = 11; const r = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < im.data.length; i += 4) { const v = 215 + r() * 40; im.data[i] = v; im.data[i + 1] = v * .97; im.data[i + 2] = v * .9; im.data[i + 3] = 255; }
    x.putImageData(im, 0, 0); $("fx-grain").style.backgroundImage = `url(${c.toDataURL()})`;
  }
  let gid = 0;
  const K = { W, H, svg, defs, root, world, el, $ };
  K.uid = p => (p || "k") + (++gid);
  // gradients: stops = [[offset, colour, opacity?], ...]; returns "url(#id)". lgrad default = top->bottom.
  K.lgrad = (stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1, extra = {}) => { const id = K.uid("lg"); const g = el("linearGradient", { id, x1, y1, x2, y2, ...extra }, defs);
    stops.forEach(s => el("stop", { offset: s[0], "stop-color": s[1], "stop-opacity": s[2] == null ? 1 : s[2] }, g)); K._last = g; return `url(#${id})`; };
  K.rgrad = (stops, cx_ = .5, cy_ = .5, r = .5, extra = {}) => { const id = K.uid("rg"); const g = el("radialGradient", { id, cx: cx_, cy: cy_, r, ...extra }, defs);
    stops.forEach(s => el("stop", { offset: s[0], "stop-color": s[1], "stop-opacity": s[2] == null ? 1 : s[2] }, g)); K._last = g; return `url(#${id})`; };
  // a gradient whose stops can be recoloured each frame: returns {url, set([c0,c1,...])}
  K.lgradLive = (cols, x1 = 0, y1 = 0, x2 = 0, y2 = 1) => { const url = K.lgrad(cols.map((c, i) => [i / (cols.length - 1), c]), x1, y1, x2, y2); const g = K._last;
    const st = [...g.children]; return { url, set: cs => cs.forEach((c, i) => st[i].setAttribute("stop-color", c)) }; };

  // ---------------- sets (backgrounds with parallax layers) ----------------
  const SETDEF = {}, SETS = {};
  K.defineSet = (name, build) => { SETDEF[name] = build; };
  K.get = name => { if (typeof name !== "string") return name; if (!SETS[name]) { if (!SETDEF[name]) throw new Error("unknown set " + name);
      const g = el("g", { "data-set": name }, world); g.style.display = "none";
      const S = { name, g, layers: [], cam: { x: W / 2, y: H / 2, z: 1, rot: 0 }, update: null, P: {} };
      S.layer = (p, lname) => { const lg = el("g", { "data-p": p }, g); S.layers.push({ g: lg, p, name: lname }); return lg; };
      S.actorLayer = () => { S.actors = S.layer(1, "actors"); return S.actors; };
      SETDEF[name](S); if (!S.actors) S.actorLayer(); SETS[name] = S; } return SETS[name]; };
  K.sets = () => Object.keys(SETDEF);
  let shown = [], actorsOn = [], t_ = 0;
  // show a set this frame. o = {cam:{x,y,z,rot}, shake: px, opacity, ...params for set.update}
  K.show = (name, o = {}) => { const S = K.get(name); const cam = Object.assign({ x: W / 2, y: H / 2, z: 1, rot: 0 }, o.cam || {});
    if (o.shake) { cam.x += noise1(t_ * 23, 1) * o.shake; cam.y += noise1(t_ * 23, 2) * o.shake; cam.rot += noise1(t_ * 17, 3) * o.shake * .03; }
    S.cam = cam; S.P = o; S.g.style.display = ""; S.g.style.opacity = o.opacity == null ? 1 : o.opacity; world.appendChild(S.g);
    for (const L of S.layers) { const p = L.p, xp = W / 2 + (cam.x - W / 2) * p, yp = H / 2 + (cam.y - H / 2) * p, zp = Math.max(.05, 1 + (cam.z - 1) * p);
      L.g.setAttribute("transform", `translate(${W / 2} ${H / 2}) rotate(${cam.rot * Math.min(p, 1)}) scale(${zp}) translate(${-xp} ${-yp})`); }
    if (S.update) S.update(t_, o); shown.push(S); return S; };
  // world point of set S (p = 1 layer) -> screen pixels
  K.toScreen = (S, x, y) => { S = K.get(S); const c = S.cam, r = c.rot * Math.PI / 180, dx = (x - c.x) * c.z, dy = (y - c.y) * c.z;
    return [W / 2 + dx * Math.cos(r) - dy * Math.sin(r), H / 2 + dx * Math.sin(r) + dy * Math.cos(r)]; };
  // camera helpers: frame a point (x,y) at zoom z; move between two shots
  K.camLerp = (a, b, k) => ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), z: lerp(a.z || 1, b.z || 1, k), rot: lerp(a.rot || 0, b.rot || 0, k) });
  K.camPath = (t, keys) => { // keys: [[t, {x,y,z}], ...] eased between keys
    if (t <= keys[0][0]) return keys[0][1]; for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) return K.camLerp(keys[i - 1][1], keys[i][1], ease(rng(t, keys[i - 1][0], keys[i][0])));
    return keys[keys.length - 1][1]; };
  K.punch = (t, t0, amt = .12, d = .5) => t < t0 ? 0 : amt * Math.exp(-(t - t0) / d) * (1 - Math.exp(-(t - t0) * 30));

  // ---------------- actors ----------------
  const ACTORS = [];
  K.register = a => { a.defaults = JSON.parse(JSON.stringify(a.st)); ACTORS.push(a); a.g.style.display = "none"; return a; };
  // place an actor into a set's actor layer this frame (order of put = draw order; later = in front)
  K.put = (a, S, o = {}) => { S = K.get(S); Object.assign(a.st, o); a.g.style.display = ""; S.actors.appendChild(a.g); if (!actorsOn.includes(a)) actorsOn.push(a); return a; };
  // walk an actor from x0 to x1 between t0 and t1 (sets x, flip, pose and phase)
  K.walk = (a, t, t0, t1, x0, x1, o = {}) => { const k = rng(t, t0, t1), st = a.st; st.x = lerp(x0, x1, o.ease === false ? k : ease(k)); st.flip = x1 >= x0 ? 1 : -1;
    if (t > t0 && t < t1) { st.pose = o.run ? "run" : "walk"; st.phase = (t - t0) * (o.run ? 13 : 8.5) * (o.cadence || 1); } return a; };
  K.blink = (t, seed = 0) => ((t * .9 + seed * .37) % 3.7) < .11 ? 1 : 0;

  // ---------------- timeline: lip sync + subtitles ----------------
  // window.TL = {fps, dur, lines:[{who,text,start,dur,env}]} (voices.py timeline.json). KIT.tlOffset shifts scene time -> TL time.
  K.tlOffset = 0;
  K.names = { narrator: ["కథ", "#F2D7A0"], meera: ["మీరా", "#9BE07A"], chintu: ["చింటూ", "#FF8A7A"], thatayya: ["తాతయ్య", "#F5F0E6"],
    veerendra: ["వీరేంద్ర", "#C9A2E0"], tree: ["మర్రి చెట్టు", "#FFD877"], devata: ["వృక్ష దేవత", "#FFE9A0"], villagers: ["గ్రామస్తులు", "#9FD3F0"],
    hench1: ["మనిషి", "#D8C3A5"], hench2: ["మనిషి", "#D8C3A5"] };
  K.talk = (who, t) => { const T = window.TL; if (!T || !T.lines) return 0; const tt = t + K.tlOffset, fps = T.fps || 30;
    for (const l of T.lines) { if (l.who !== who || !l.env) continue; const f = Math.floor((tt - l.start) * fps); if (f >= 0 && f < l.env.length) return l.env[f]; } return 0; };
  K.line = (t, hold = .35) => { const T = window.TL; if (!T || !T.lines) return null; const tt = t + K.tlOffset;
    for (const l of T.lines) if (tt >= l.start - .05 && tt < l.start + l.dur + hold) return l; return null; };
  const clean = s => (s || "").replace(/…/g, "...").replace(/\s+/g, " ").trim();
  // split a long line into readable chunks (<= ~max chars) at sentence/phrase breaks; time each chunk by its length
  K.chunks = (s, max = 78) => { s = clean(s); if (s.length <= max) return [s];
    const parts = s.split(/(?<=[.!?।,;:])\s+/); const outp = []; let cur = "";
    for (const p of parts) { if (cur && (cur + " " + p).length > max) { outp.push(cur); cur = p; } else cur = cur ? cur + " " + p : p; }
    if (cur) outp.push(cur);
    return outp.flatMap(c => { if (c.length <= max * 1.25) return [c]; const w = c.split(" "), o2 = []; let q = "";
      for (const x of w) { if (q && (q + " " + x).length > max) { o2.push(q); q = x; } else q = q ? q + " " + x : x; } if (q) o2.push(q); return o2; }); };
  let subOverride = null;
  K.sub = (text, who) => { subOverride = text == null ? null : { text, who }; };   // manual subtitle for this frame ("" hides)
  K.autoSubs = true; K.chipOn = true;
  function drawSubs(t) { let s = subOverride, k = 1;
    if (!s && K.autoSubs) { const l = K.line(t); if (l) { const cs = K.chunks(l.sub || l.text); const tt = t + K.tlOffset; let i = 0;
        if (cs.length > 1) { const tot = cs.reduce((a, c) => a + c.length, 0); let acc = 0; const pos = clamp((tt - l.start) / l.dur) * tot;
          for (i = 0; i < cs.length - 1; i++) { acc += cs[i].length; if (pos < acc) break; } }
        s = { text: cs[i], who: l.who }; k = clamp((tt - l.start + .05) / .12) * clamp((l.start + l.dur + .35 - tt) / .15); } }
    const sub = $("k-sub"), chip = $("k-chip");
    if (!s || !s.text) { sub.style.opacity = 0; chip.style.opacity = 0; return; }
    const tx = clean(s.text); if (sub._t !== tx) { sub.textContent = tx; sub._t = tx; } sub.style.opacity = k;
    const nm = K.chipOn && K.names[s.who];
    if (nm) { if (chip._w !== s.who) { chip.textContent = nm[0]; chip.style.background = nm[1]; chip._w = s.who; }
      chip.style.bottom = (30 + sub.offsetHeight - 6) + "px"; chip.style.opacity = k; } else chip.style.opacity = 0; }

  // ---------------- overlays (screen space, crisp) ----------------
  const FX = { glow: 0, torch: 0, vig: 0, grain: 0, flash: 0, fade: 0, rain: 0, motes: 0 };
  K.title = (k, main, subl = "") => { const T = $("k-title"); T.style.opacity = k; if (k > 0) { const a = T.querySelector(".tt"), b = T.querySelector(".ts");
      if (a._t !== main) { a.textContent = clean(main); a._t = main; } if (b._t !== subl) { b.textContent = clean(subl); b._t = subl; }
      T.style.transform = `scale(${lerp(.94, 1, ease(k))})`; } };
  K.fade = (k, color = "#000") => { const d = $("k-fade"); d.style.opacity = k; d.style.background = color; FX.fade = k; };
  K.flash = k => { $("fx-flash").style.opacity = k; };
  K.vignette = k => { $("fx-vig").style.opacity = k; };
  K.grain = k => { $("fx-grain").style.opacity = k; };
  // golden glow at screen (x,y), radius r; screen-blended
  K.glow = (k, x = W / 2, y = H / 2, r = 600, color = "255,196,80") => { const d = $("fx-glow"); d.style.opacity = clamp(k);
    if (k > 0) d.style.background = `radial-gradient(circle ${r}px at ${x}px ${y}px,rgba(${color},.85),rgba(${color},.35) 45%,rgba(${color},0) 100%)`; };
  // torch-light: darkness everywhere except a soft circle at (x,y)
  K.torch = (k, x, y, r = 330, dark = .93) => { const d = $("fx-torch"); d.style.opacity = clamp(k);
    if (k > 0) d.style.background = `radial-gradient(circle ${r * 1.6}px at ${x}px ${y}px,rgba(8,5,12,0) ${r * .55}px,rgba(8,5,12,${dark * .55}) ${r}px,rgba(8,5,12,${dark}) ${r * 1.6}px)`; };
  // canvas effects (rain, light motes) are drawn after scene(t)
  const motes = [];
  K.rain = (k, angle = 12) => { FX.rain = k; FX.rainA = angle; };
  K.motes = (k, x, y, spread = 400, color = "255,214,110", n = 40) => { if (k > 0) motes.push({ k, x, y, spread, color, n }); };
  function drawCanvas(t) { cx.clearRect(0, 0, W, H);
    if (FX.rain > 0) { const n = Math.round(420 * FX.rain), a = FX.rainA * Math.PI / 180, dx = Math.sin(a), dy = Math.cos(a);
      cx.strokeStyle = "rgba(205,225,245,.55)"; cx.lineWidth = 2.2; cx.beginPath();
      for (let i = 0; i < n; i++) { const sp = 1400 + hash(i * 3.1) * 900, len = 30 + hash(i * 7.7) * 34; const y = ((hash(i) * H + t * sp) % (H + 200)) - 100;
        const x = ((hash(i * 1.7) * (W + 400)) - 200 + y * dx / dy) % (W + 200); cx.moveTo(x, y); cx.lineTo(x - dx * len, y - dy * len); }
      cx.stroke(); cx.fillStyle = "rgba(205,225,245,.5)";
      for (let i = 0; i < n / 6; i++) { const ph = fract(t * 2.3 + hash(i * 9.1)), x = hash(i * 4.3) * W, y = 900 + hash(i * 5.9) * 170;
        cx.beginPath(); cx.ellipse(x, y, 4 + ph * 16, 1.5 + ph * 4, 0, 0, 7); cx.globalAlpha = (1 - ph) * FX.rain; cx.fill(); } cx.globalAlpha = 1;
      cx.fillStyle = `rgba(30,40,60,${.18 * FX.rain})`; cx.fillRect(0, 0, W, H); }
    for (const m of motes) for (let i = 0; i < m.n; i++) { const ph = fract(t * (.08 + hash(i) * .1) + hash(i * 2.3)), ang = hash(i * 5.1) * 6.283;
      const r = m.spread * (.15 + .85 * hash(i * 3.7)); const x = m.x + Math.cos(ang) * r + Math.sin(t * .7 + i) * 20, y = m.y + Math.sin(ang) * r * .6 - ph * 160;
      const a = Math.sin(ph * Math.PI) * m.k, s = 2 + hash(i * 8.8) * 4;
      const gr = cx.createRadialGradient(x, y, 0, x, y, s * 4); gr.addColorStop(0, `rgba(${m.color},${a})`); gr.addColorStop(1, `rgba(${m.color},0)`);
      cx.fillStyle = gr; cx.fillRect(x - s * 4, y - s * 4, s * 8, s * 8); }
    motes.length = 0; }

  // ---------------- frame lifecycle ----------------
  K.begin = t => { t_ = t; K.t = t; for (const S of shown) S.g.style.display = "none"; shown = [];
    for (const a of actorsOn) a.g.style.display = "none"; actorsOn = [];
    for (const a of ACTORS) { const d = a.defaults; for (const k in d) a.st[k] = Array.isArray(d[k]) ? d[k].slice() : (d[k] && typeof d[k] === "object" ? JSON.parse(JSON.stringify(d[k])) : d[k]); }
    subOverride = null; K.title(0); K.fade(0); K.flash(0); K.glow(0); K.torch(0); K.vignette(0); K.rain(0); K.grain(K.grainDefault); };
  K.end = t => { for (const a of actorsOn) { const st = a.st; if (st.who && st.talk == null) st.talk = K.talk(st.who, t);
      if (st.blink == null) st.blink = K.blink(t, st.seed || 0); a.draw(t); }
    drawCanvas(t); drawSubs(t); };
  K.grainDefault = .2;
  // optional art-style skins (../skins.js): applySkin wraps the world group; setSkin("paper") etc. per scene
  K.useSkins = () => { if (typeof applySkin !== "function") return "flat"; const s = applySkin(world, defs);
    const g = document.getElementById("paper-grain"); if (g) g.style.backgroundSize = "1920px 1080px"; return s; };
  if (typeof window.setSkin !== "function") window.setSkin = () => {};
  window.render = t => { K.begin(t); if (typeof scene === "function") scene(t); K.end(t); };
  return K;
})();
