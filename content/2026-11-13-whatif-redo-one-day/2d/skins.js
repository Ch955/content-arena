// Art-style skins for the 2D engine (owner, 11 Nov 2026: a different look per reel, not only flat 2D).
// A skin is an SVG filter applied to the drawn world (the camera group); the HTML overlays — title, subtitles,
// countdown clock, answer and end card — stay crisp and readable in every style.
//   neon  : dark night, every edge glows in its own colour (glow-sketch look)
//   clay  : soft lighting + bevel so shapes look like plasticine models (3D clay look)
//   paper : paper grain + cut-out shadows (construction-paper look)
//   pixel : chunky pixel blocks (retro game look)
// Use: set `const SKIN = "neon"` (or ?skin=neon in the URL) before the main script, and call applySkin(cam, defs)
// right after the camera group is created. "flat" (or unset) keeps the original look.
// Per scene: call setSkin("paper") etc. inside render(t) (owner, 12 Nov 2026: the style that suits each scene).
function applySkin(cam, defs) {
  const q = new URLSearchParams(location.search).get("skin");
  const skin = q || (typeof SKIN !== "undefined" ? SKIN : "flat");
  const flat = !skin || skin === "flat";
  const NS = "http://www.w3.org/2000/svg";
  const f = document.createElementNS(NS, "filter");
  f.setAttribute("id", "skin-" + skin);
  f.setAttribute("x", "-5%"); f.setAttribute("y", "-5%"); f.setAttribute("width", "110%"); f.setAttribute("height", "110%");
  f.setAttribute("color-interpolation-filters", "sRGB");
  const FX = {
    neon: `
      <feColorMatrix in="SourceGraphic" type="luminanceToAlpha" result="lum"/>
      <feConvolveMatrix in="SourceGraphic" order="3" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" preserveAlpha="true" result="edgeC"/>
      <feColorMatrix in="edgeC" type="matrix" values="3 0 0 0 0  0 3 0 0 0  0 0 3 0 0  1 1 1 0 0" result="edge"/>
      <feMorphology in="edge" operator="dilate" radius="1.6" result="thick"/>
      <feColorMatrix in="SourceGraphic" type="saturate" values="2.2" result="sat"/>
      <feComposite in="sat" in2="thick" operator="in" result="lines"/>
      <feComponentTransfer in="lines" result="bright"><feFuncR type="linear" slope="1.6" intercept=".15"/><feFuncG type="linear" slope="1.6" intercept=".15"/><feFuncB type="linear" slope="1.6" intercept=".2"/></feComponentTransfer>
      <feGaussianBlur in="bright" stdDeviation="7" result="glow"/>
      <feColorMatrix in="SourceGraphic" type="matrix" values=".07 0 0 0 .02  0 .06 0 0 .03  0 0 .12 0 .1  0 0 0 1 0" result="night"/>
      <feMerge><feMergeNode in="night"/><feMergeNode in="glow"/><feMergeNode in="glow"/><feMergeNode in="bright"/></feMerge>`,
    clay: `
      <feColorMatrix in="SourceGraphic" type="luminanceToAlpha" result="lum"/>
      <feGaussianBlur in="lum" stdDeviation="11" result="bump"/>
      <feSpecularLighting in="bump" surfaceScale="26" specularConstant=".7" specularExponent="18" lighting-color="#fff4e0" result="spec">
        <feDistantLight azimuth="235" elevation="42"/></feSpecularLighting>
      <feDiffuseLighting in="bump" surfaceScale="22" diffuseConstant="1.15" lighting-color="#ffffff" result="diff">
        <feDistantLight azimuth="235" elevation="50"/></feDiffuseLighting>
      <feComposite in="SourceGraphic" in2="diff" operator="arithmetic" k1="1.1" k2="0" k3="0" k4="0" result="lit"/>
      <feComposite in="spec" in2="SourceAlpha" operator="in" result="specIn"/>
      <feComponentTransfer in="specIn" result="specSoft"><feFuncA type="linear" slope=".55"/></feComponentTransfer>
      <feMerge><feMergeNode in="lit"/><feMergeNode in="specSoft"/></feMerge>`,
    paper: `
      <feColorMatrix in="SourceGraphic" type="luminanceToAlpha" result="lum"/>
      <feGaussianBlur in="lum" stdDeviation="2.5" result="lumS"/>
      <feOffset in="lumS" dx="-6" dy="-8" result="lumO"/>
      <feComposite in="lumO" in2="lumS" operator="arithmetic" k2="1" k3="-1" result="diffL"/>
      <feComponentTransfer in="diffL" result="edge"><feFuncA type="linear" slope="5"/></feComponentTransfer>
      <feGaussianBlur in="edge" stdDeviation="2" result="edgeB"/>
      <feFlood flood-color="#2b1d10" flood-opacity=".6"/>
      <feComposite in2="edgeB" operator="in" result="shadow"/>
      <feComponentTransfer in="SourceGraphic" result="flatc"><feFuncR type="discrete" tableValues=".12 .32 .52 .7 .85 .96"/><feFuncG type="discrete" tableValues=".12 .32 .52 .7 .85 .96"/><feFuncB type="discrete" tableValues=".1 .28 .46 .64 .8 .92"/></feComponentTransfer>
      <feMerge><feMergeNode in="flatc"/><feMergeNode in="shadow"/></feMerge>`,
    pixel: `
      <feFlood x="6" y="6" width="2" height="2"/>
      <feComposite width="14" height="14"/>
      <feTile result="grid"/>
      <feComposite in="SourceGraphic" in2="grid" operator="in"/>
      <feMorphology operator="dilate" radius="7" result="px"/>
      <feComponentTransfer in="px"><feFuncR type="discrete" tableValues="0 .25 .5 .75 1"/><feFuncG type="discrete" tableValues="0 .25 .5 .75 1"/><feFuncB type="discrete" tableValues="0 .25 .5 .75 1"/></feComponentTransfer>`,
  };
  if (!flat && !FX[skin]) { console.log("unknown skin", skin); return "flat"; }
  // every style gets its filter, so a reel can switch style per scene with setSkin(name) inside render(t)
  for (const k in FX) {
    const fk = k === skin ? f : f.cloneNode(false);
    fk.setAttribute("id", "skin-" + k); fk.innerHTML = FX[k]; defs.appendChild(fk);
  }
  // filter on a wrapper so the camera transform (zoom/pan) stays on the inner group
  const wrap = document.createElementNS(NS, "g");
  cam.parentNode.insertBefore(wrap, cam); wrap.appendChild(cam);
  if (!flat) wrap.setAttribute("filter", `url(#skin-${skin})`);
  document.body.dataset.skin = flat ? "flat" : skin;
  window.setSkin = name => {   // e.g. setSkin(t > 20 && t < 30 ? "paper" : "neon") for a flashback
    if (!name || name === "flat") wrap.removeAttribute("filter"); else wrap.setAttribute("filter", `url(#skin-${name})`);
    const g = document.getElementById("paper-grain"); if (g) g.style.display = name === "paper" ? "block" : "none";
    document.body.dataset.skin = name || "flat";
  };
  {   // paper fibre texture (shown only while the paper style is on): drawn once, sits over the world but under the text overlays
    const c = document.createElement("canvas"); c.width = 540; c.height = 960; const x = c.getContext("2d"), im = x.createImageData(540, 960);
    let seed = 7; const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < im.data.length; i += 4) { const v = 200 + r() * 55; im.data[i] = v; im.data[i + 1] = v * .97; im.data[i + 2] = v * .9; im.data[i + 3] = 255; }
    x.putImageData(im, 0, 0);
    const d = document.createElement("div"); d.id = "paper-grain";
    d.style.cssText = `position:absolute;inset:0;background:url(${c.toDataURL()}) 0 0/1080px 1920px;mix-blend-mode:multiply;opacity:.55;pointer-events:none`;
    const svgEl = document.getElementById("s"); svgEl.parentNode.insertBefore(d, svgEl.nextSibling);
    d.style.display = skin === "paper" ? "block" : "none";
  }
  return skin;
}
