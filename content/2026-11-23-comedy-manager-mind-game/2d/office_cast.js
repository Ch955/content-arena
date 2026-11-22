// Ep 2 (22 Nov) adds st.blind (the black game blindfold, blindfoldShape) -- nothing else changed.
// "Office Politics" series cast (Ep 0 'పది నిమిషాల లేట్!' 20 Nov, Ep 1 'Operation Red Flower' 21 Nov, Ep 2 22 Nov).
// REUSABLE: copy this file into the next episode's 2d/ folder and load it before world.js. It holds the helpers, the
// makeAdult() rig (20 Nov rig + this episode's additions), the props and one factory per character:
//   makeManager(parent, extra)  makeRamesh(parent, extra)  makeSuresh(parent, extra)  makePriya(parent, extra)
//   makeColleague(k, parent, extra)   (k = 0 pink-kurta woman with a bun, 1 green shirt + glasses, 2 orange shirt + moustache)
// `extra` = more makeAdult options, e.g. {legs:...} for standing shots (each factory has a `standing` flag).
// New in Ep 1 (21 Nov): ponytail, cardigan (open, over a crew-neck top), hoops (small gold hoops), earPen (pen behind
// the right ear), oiled + sidePart (shiny side-parted hair with a comb line), buttoned (shirt buttoned to the collar,
// straining buttons), props clipboard (right hand) and notepad (left hand), the felicitation garland (st.garland 0..1 =
// drop progress, st.gswing = swing deg) and the Santa party hat (st.santa 0..1, st.hatTilt deg), st.splay (legs spread:
// sitting on the floor), st.sit (seated on a chair: legs foreshortened), st.nod (bobble-head nod offset, px).
const NS="http://www.w3.org/2000/svg", svg=document.getElementById("s"), nar=document.getElementById("nar"), fx=document.getElementById("fx");
function el(tag,attrs,parent){const e=document.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);(parent||svg).appendChild(e);return e}
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x)), lerp=(a,b,k)=>a+(b-a)*k;
const ease=x=>{x=clamp(x);return x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2};
const out=x=>1-Math.pow(1-clamp(x),3);
const back=x=>{x=clamp(x);const c=2.2;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)};
const txt=(s,attrs,parent)=>{const e=el("text",attrs,parent);e.textContent=s;return e};
const fract=x=>x-Math.floor(x);
const hash=i=>fract(Math.sin(i*127.1+311.7)*43758.5453);
const pop=(t,t0,d=0.35)=>t<t0?0:back((t-t0)/d);
const INK="#10141E";
const $=id=>document.getElementById(id);

// ---------- props ----------
function helmetShape(p,s=1){const g=el("g",{transform:`scale(${s})`},p);
  el("path",{d:"M-52 0 Q-58 -66 0 -72 Q58 -66 52 0 Q30 8 0 8 Q-30 8 -52 0 Z",fill:"#4A4F57",stroke:INK,"stroke-width":5},g);
  el("path",{d:"M-48 -22 Q0 -40 48 -22 L46 -6 Q0 -22 -46 -6 Z",fill:"#1E2126",stroke:INK,"stroke-width":3},g);
  el("path",{d:"M-30 -58 Q0 -66 26 -60",stroke:"#7A8089","stroke-width":5,fill:"none","stroke-linecap":"round"},g);
  el("path",{d:"M-40 4 Q-30 34 0 36 Q30 34 40 4",stroke:"#222","stroke-width":4,fill:"none"},g); return g}
function packShape(p,s=1){const g=el("g",{transform:`scale(${s})`},p);
  el("rect",{x:-60,y:-110,width:120,height:112,rx:26,fill:"#23262B",stroke:INK,"stroke-width":5},g);
  el("rect",{x:-44,y:-54,width:88,height:46,rx:12,fill:"#33373D",stroke:INK,"stroke-width":3},g);
  el("path",{d:"M-30 -110 Q0 -136 30 -110",stroke:"#23262B","stroke-width":10,fill:"none"},g); return g}
function mugShape(p){el("path",{d:"M-30 -12 Q-50 -12 -50 6 Q-50 24 -30 22",stroke:INK,"stroke-width":12,fill:"none"},p); el("path",{d:"M-30 -12 Q-50 -12 -50 6 Q-50 24 -30 22",stroke:"#FFFFFF","stroke-width":6,fill:"none"},p);
  el("path",{d:"M-32 -30 L28 -30 L24 34 Q22 42 12 42 L-16 42 Q-26 42 -28 34 Z",fill:"#FFFFFF",stroke:INK,"stroke-width":5},p); el("ellipse",{cx:-2,cy:-30,rx:30,ry:7,fill:"#6D4C41",stroke:INK,"stroke-width":3},p)}
function clipboardShape(p){   // Priya's games clipboard (plain: lines only, no text)
  el("rect",{x:-46,y:-70,width:92,height:124,rx:8,fill:"#A1887F",stroke:INK,"stroke-width":4},p);
  el("rect",{x:-38,y:-58,width:76,height:104,rx:3,fill:"#FFFDF5",stroke:INK,"stroke-width":2},p);
  for(let k=0;k<5;k++) el("line",{x1:-28,y1:-36+k*17,x2:k===4?4:28,y2:-36+k*17,stroke:"#90A4AE","stroke-width":4,"stroke-linecap":"round"},p);
  el("rect",{x:-20,y:-80,width:40,height:20,rx:5,fill:"#B0BEC5",stroke:INK,"stroke-width":3},p)}
function notepadShape(p){     // Suresh's small spiral notepad
  el("rect",{x:-30,y:-44,width:60,height:80,rx:5,fill:"#FFF59D",stroke:INK,"stroke-width":3.5},p);
  for(let k=0;k<5;k++) el("circle",{cx:-20+k*10,cy:-44,r:4,fill:"none",stroke:"#546E7A","stroke-width":2.5},p);
  for(let k=0;k<4;k++) el("line",{x1:-20,y1:-22+k*14,x2:20,y2:-22+k*14,stroke:"#B0A060","stroke-width":2.5},p)}
// the felicitation garland: BRIGHT RED flowers (award-function style, never white), a gold tassel at the bottom
function garlandShape(p){
  const g=el("g",{},p);
  const P=(u,w,dp)=>[lerp(-w,w,u), -300+Math.sin(u*Math.PI)*dp];   // U from shoulder to shoulder
  [[86,270,21,"#C62828"],[74,250,19,"#E53935"]].forEach(([w,dp,R0,c],row)=>{
    for(let k=0;k<=26;k++){const u=k/26, [x,y]=P(u,w,dp); const r=R0+Math.sin(u*Math.PI)*4;
      el("circle",{cx:x+(row?3:0),cy:y,r,fill:k%3===1?"#B71C1C":c,stroke:INK,"stroke-width":2.5},g);
      el("circle",{cx:x+(row?3:0),cy:y,r:r*0.42,fill:k%2?"#FF8A80":"#FFCDD2"},g);
      if(row===0&&k%4===2) el("ellipse",{cx:x+r*0.95,cy:y+4,rx:8,ry:4.5,fill:"#43A047",stroke:INK,"stroke-width":1.5,transform:`rotate(30 ${x+r*0.95} ${y+4})`},g)}});
  el("path",{d:"M-12 -28 L12 -28 L18 24 L-18 24 Z",fill:"#FFC107",stroke:INK,"stroke-width":3},g);       // gold tassel
  for(let k=-2;k<=2;k++) el("line",{x1:k*5,y1:24,x2:k*7,y2:50,stroke:"#FFB300","stroke-width":3.5,"stroke-linecap":"round"},g);
  el("circle",{cx:0,cy:-32,r:16,fill:"#E53935",stroke:INK,"stroke-width":2.5},g);
  return g}
// Ep 2: the black game blindfold (a cloth band over the eyes, the knot + two tails on his left side)
function blindfoldShape(p){
  const g=el("g",{},p);
  el("path",{d:"M-58 -26 Q0 -34 58 -26 L58 8 Q0 2 -58 8 Z",fill:"#1C1C22",stroke:INK,"stroke-width":3.5,"stroke-linejoin":"round"},g);
  el("path",{d:"M-50 -14 Q0 -20 50 -14",stroke:"#3A3A46","stroke-width":3,fill:"none",opacity:.8},g);
  el("circle",{cx:-60,cy:-9,r:9,fill:"#1C1C22",stroke:INK,"stroke-width":3},g);
  el("path",{d:"M-62 -6 Q-84 6 -90 30 L-80 32 Q-74 12 -60 2 Z M-60 -2 Q-76 18 -72 44 L-62 42 Q-64 20 -56 4 Z",fill:"#1C1C22",stroke:INK,"stroke-width":2.5,"stroke-linejoin":"round"},g);
  return g}
// the Santa party hat (a costume only)
function santaShape(p){
  const g=el("g",{},p);
  el("path",{d:"M-56 -62 Q-40 -140 20 -168 Q64 -176 92 -120 Q70 -132 54 -118 Q34 -100 56 -64 Z",fill:"#D32F2F",stroke:INK,"stroke-width":4,"stroke-linejoin":"round"},g);
  el("path",{d:"M-30 -96 Q-4 -140 30 -150",stroke:"#EF5350","stroke-width":7,fill:"none","stroke-linecap":"round",opacity:.8},g);
  el("rect",{x:-66,y:-80,width:132,height:30,rx:15,fill:"#FFFFFF",stroke:INK,"stroke-width":4},g);
  el("circle",{cx:94,cy:-116,r:17,fill:"#FFFFFF",stroke:INK,"stroke-width":4},g);
  return g}

// ---------- adult characters (front view; local y=0 at the hip) ----------
function ik(sx,sy,tx,ty,a,b,side){let dx=tx-sx,dy=ty-sy,d=Math.hypot(dx,dy)||1; const dd=Math.min(d,a+b-1); dx/=d; dy/=d;
  const base=Math.atan2(dy,dx), cA=clamp((a*a+dd*dd-b*b)/(2*a*dd),-1,1), al=Math.acos(cA);
  const c1=[sx+Math.cos(base+al)*a,sy+Math.sin(base+al)*a], c2=[sx+Math.cos(base-al)*a,sy+Math.sin(base-al)*a];
  const sc=p=>p[1]+side*p[0]*0.6; const e=sc(c1)>sc(c2)?c1:c2; return [e,[sx+dx*dd,sy+dy*dd]]}
let T_=0;
function makeAdult(o){
  const g=el("g",{},o.parent||svg), body=el("g",{},g);
  const legs=[];
  if(o.legs) [-1,1].forEach(s=>{const lg_=el("g",{},body); el("path",{d:`M${s*50-30} -14 L${s*50+30} -14 L${s*56+26} 420 L${s*56-26} 420 Z`,fill:o.legs.pant,stroke:INK,"stroke-width":5},lg_);
    el("path",{d:`M${s*56-34} 418 Q${s*56-36} 446 ${s*56+s*14} 448 Q${s*56+46*s} 446 ${s*56+44*s} 424 Z`,fill:o.legs.shoe,stroke:INK,"stroke-width":4},lg_); legs.push(lg_)});
  const hairBack=el("g",{},body);
  const pack=o.backpack?el("rect",{x:-112,y:-286,width:224,height:250,rx:40,fill:o.backpack,stroke:INK,"stroke-width":5},body):null;
  if(o.longHair) el("path",{d:"M-72 -40 Q-80 -100 0 -102 Q80 -100 72 -40 L80 72 Q74 98 46 94 L-46 94 Q-74 98 -80 72 Z",fill:o.hair},hairBack);
  if(o.bun) el("ellipse",{cx:50,cy:30,rx:30,ry:26,fill:o.hair,stroke:INK,"stroke-width":3},hairBack);
  let pony=null;
  if(o.ponytail){ pony=el("g",{},hairBack);   // high ponytail: tied at the crown, the tail swings behind the right side of the head
    el("path",{d:"M6 -96 Q40 -150 74 -118 Q98 -86 90 -20 Q86 30 70 58 Q64 20 66 -20 Q66 -70 40 -96 Z",fill:o.hair,stroke:INK,"stroke-width":3.5,"stroke-linejoin":"round"},pony);
    el("path",{d:"M52 -110 Q78 -84 76 -20",stroke:"#3B2A22","stroke-width":3,fill:"none",opacity:.6},pony)}
  if(o.kurta){
    el("path",{d:"M-84 -268 Q-88 -286 -62 -290 L-24 -298 L24 -298 L62 -290 Q88 -286 84 -268 L70 -60 L104 220 L-104 220 L-70 -60 Z",fill:o.shirt,stroke:INK,"stroke-width":5},body);
    el("path",{d:"M-30 -298 Q0 -250 30 -298",fill:o.skin,stroke:o.trim,"stroke-width":8},body);
  } else {
    const hem=o.untucked?"L84 18 Q60 30 30 22 Q0 34 -34 24 Q-64 34 -86 16 Z":"L82 -10 Q80 0 66 0 L-66 0 Q-80 0 -82 -10 Z";
    const d=o.paunch?"M-94 -268 Q-98 -288 -70 -292 L-26 -300 L26 -300 L70 -292 Q98 -288 94 -268 L98 -160 Q124 -80 100 -10 Q94 2 76 2 L-76 2 Q-94 2 -100 -10 Q-124 -80 -98 -160 Z"
                    :o.cardigan?"M-86 -268 Q-90 -288 -64 -292 L-26 -300 L26 -300 L64 -292 Q90 -288 86 -268 L76 -150 Q72 -110 80 -60 L84 -10 Q80 0 66 0 L-66 0 Q-80 0 -84 -10 L-80 -60 Q-72 -110 -76 -150 Z"
                    :"M-94 -268 Q-98 -288 -70 -292 L-26 -300 L26 -300 L70 -292 Q98 -288 94 -268 "+hem;
    el("path",{d,fill:o.shirt,stroke:INK,"stroke-width":5},body);
    if(o.paunch) el("path",{d:"M-70 -120 Q0 -60 70 -120",stroke:INK,"stroke-width":3,fill:"none",opacity:.25},body);
    if(o.cardigan){   // crew-neck top + an open cardigan (two front panels)
      el("path",{d:"M-26 -300 Q0 -278 26 -300 Z",fill:o.skin},body);
      el("path",{d:"M-26 -300 Q0 -278 26 -300",stroke:o.trim||INK,"stroke-width":5,fill:"none"},body);
      [-1,1].forEach(s=>el("path",{d:`M${s*30} -300 L${s*64} -292 Q${s*90} -288 ${s*86} -268 L${s*76} -150 Q${s*72} -110 ${s*80} -60 L${s*86} 14 L${s*40} 14 Q${s*36} -120 ${s*28} -240 Q${s*24} -284 ${s*30} -300 Z`,fill:o.cardigan,stroke:INK,"stroke-width":4.5,"stroke-linejoin":"round"},body));
      [-200,-150,-100,-50].forEach(y=>el("circle",{cx:-34,cy:y,r:4.5,fill:"#E0C070",stroke:INK,"stroke-width":1.5},body));
      el("path",{d:"M-84 4 L-40 4 M40 4 L84 4",stroke:"#2A3A60","stroke-width":8},body);
    } else if(o.buttoned){   // buttoned right up to the collar, buttons straining (pull lines)
      el("path",{d:"M-24 -300 L24 -300 L18 -286 Q0 -280 -18 -286 Z",fill:o.shirt,stroke:INK,"stroke-width":3},body);
      el("line",{x1:0,y1:-290,x2:0,y2:-6,stroke:INK,"stroke-width":3,opacity:.5},body);
      [-288,-238,-188,-138,-88,-38].forEach((y,k)=>{ el("circle",{cx:0,cy:y,r:4.5,fill:o.button||"#FFFFFF",stroke:INK,"stroke-width":1.5},body);
        if(k>0&&k<5) [-1,1].forEach(s=>el("path",{d:`M${s*5} ${y-20} Q${s*20} ${y-26} ${s*38} ${y-22}`,stroke:o.strain||"#8E7CC3","stroke-width":3,fill:"none","stroke-linecap":"round"},body))});
    } else el("path",{d:"M-24 -300 L0 -268 L24 -300",fill:o.skin},body);
    if(!o.tie&&!o.buttoned&&!o.cardigan){ el("line",{x1:0,y1:-262,x2:0,y2:o.untucked?20:0,stroke:INK,"stroke-width":3,opacity:.55},body);
      [-225,-170,-115,-60].forEach(y=>el("circle",{cx:6,cy:y,r:4,fill:o.button||"#9A9AA6"},body)) }
    if(o.tie){ el("path",{d:"M-24 -300 L0 -268 L24 -300 Z",fill:o.shirt},body);
      el("path",{d:"M-6 -282 L-20 -258 L-24 -84 L0 -56 L24 -84 L20 -258 L6 -282 Z",fill:o.tie,stroke:INK,"stroke-width":4,"stroke-linejoin":"round"},body);
      for(let y=-240;y>-96;y+=38) el("line",{x1:-20,y1:y+12,x2:20,y2:y-8,stroke:"#A33A4A","stroke-width":5},body);
      el("path",{d:"M-15 -300 L15 -300 L10 -280 L-10 -280 Z",fill:o.tie,stroke:INK,"stroke-width":4,"stroke-linejoin":"round"},body)}
    if(!o.cardigan){
      const ci=o.buttoned?-8:-4, cy_=o.buttoned?-276:-262;
      el("path",{d:`M-28 -302 L${ci} ${cy_} L-40 -276 Z`,fill:o.collar||o.shirt,stroke:INK,"stroke-width":4,"stroke-linejoin":"round"},body);
      el("path",{d:`M28 -302 L${-ci} ${cy_} L40 -276 Z`,fill:o.collar||o.shirt,stroke:INK,"stroke-width":4,"stroke-linejoin":"round"},body)}
    if(o.pocket) el("path",{d:"M-62 -205 L-32 -205 L-32 -172 L-62 -172 Z",fill:"none",stroke:INK,"stroke-width":3,opacity:.45},body);
    if(o.belt){ el("rect",{x:-100,y:-16,width:200,height:18,fill:"#2B2B2B",stroke:INK,"stroke-width":3},body); el("rect",{x:-14,y:-18,width:28,height:22,rx:3,fill:"#B0BEC5",stroke:INK,"stroke-width":3},body) }
  }
  const straps=o.backpack?el("g",{},body):null;
  if(straps){ el("path",{d:"M-66 -292 Q-78 -200 -70 -110",stroke:"#1A1C20","stroke-width":18,fill:"none","stroke-linecap":"round"},straps); el("path",{d:"M66 -292 Q78 -200 70 -110",stroke:"#1A1C20","stroke-width":18,fill:"none","stroke-linecap":"round"},straps) }
  el("rect",{x:-19,y:-334,width:38,height:44,fill:o.skin},body);
  if(o.buttoned){ el("path",{d:"M-24 -300 L24 -300 L18 -286 Q0 -280 -18 -286 Z",fill:o.shirt,stroke:INK,"stroke-width":3},body);
    el("path",{d:"M-28 -302 L-8 -276 L-40 -276 Z",fill:o.collar||o.shirt,stroke:INK,"stroke-width":4,"stroke-linejoin":"round"},body);
    el("path",{d:"M28 -302 L8 -276 L40 -276 Z",fill:o.collar||o.shirt,stroke:INK,"stroke-width":4,"stroke-linejoin":"round"},body);
    el("circle",{cx:0,cy:-288,r:4.5,fill:o.button||"#FFFFFF",stroke:INK,"stroke-width":1.5},body)}
  if(o.badge){ const ly=el("g",{},body); el("path",{d:"M-24 -300 Q-22 -230 -12 -172",stroke:"#2D6CDF","stroke-width":8,fill:"none"},ly); el("path",{d:"M24 -300 Q22 -230 12 -172",stroke:"#2D6CDF","stroke-width":8,fill:"none"},ly);
    const bd=el("g",{transform:"translate(0,-122)"},ly);
    el("rect",{x:-40,y:-52,width:80,height:104,rx:8,fill:"#fff",stroke:INK,"stroke-width":3.5},bd);
    el("rect",{x:-40,y:-52,width:80,height:24,rx:6,fill:"#2D6CDF"},bd);
    el("rect",{x:-14,y:-22,width:28,height:30,rx:3,fill:"#C9D6E3"},bd); el("circle",{cx:0,cy:-11,r:7,fill:"#8A5A3B"},bd);
    txt(o.badge[0],{x:0,y:26,"font-family":"Anton","font-size":17,"text-anchor":"middle",fill:INK},bd);
    txt(o.badge[1],{x:0,y:44,"font-family":"Anton","font-size":12.5,"text-anchor":"middle",fill:"#2D6CDF","letter-spacing":1},bd);
    o._lany=ly; o._bd=bd}
  const arm=s=>({up:el("line",{stroke:o.sleeve||o.shirt,"stroke-width":32,"stroke-linecap":"round"},body),
                 lo:el("line",{stroke:o.fore||o.sleeve||o.shirt,"stroke-width":28,"stroke-linecap":"round"},body),
                 cuff:o.cuff?el("circle",{r:15,fill:o.cuff},body):null,
                 fing:el("g",{opacity:0},body),
                 hand:el("circle",{r:17,fill:o.skin,stroke:INK,"stroke-width":3},body)});
  const AL=arm(-1), AR=arm(1);
  [AL,AR].forEach(A=>{[[-15,-16],[-7,-24],[1,-26],[9,-23],[17,-12]].forEach(([x,y])=>el("line",{x1:0,y1:-4,x2:x*1.15,y2:y*1.15,stroke:o.skin,"stroke-width":9,"stroke-linecap":"round"},A.fing));
    [[-15,-16],[-7,-24],[1,-26],[9,-23],[17,-12]].forEach(([x,y])=>el("circle",{cx:x*1.15,cy:y*1.15,r:5,fill:o.skin,stroke:INK,"stroke-width":2},A.fing))});
  const itemG=el("g",{},body), items={}, itemGL=el("g",{},body), itemsL={};
  items.mug=el("g",{},itemG); mugShape(items.mug); itemsL.mug=el("g",{transform:"scale(-1,1)"},itemGL); mugShape(itemsL.mug);
  itemsL.helmet=el("g",{transform:"translate(0,58)"},itemGL); helmetShape(itemsL.helmet,0.95);
  items.clipboard=el("g",{transform:"translate(-6,-30)"},itemG); clipboardShape(items.clipboard);
  itemsL.notepad=el("g",{transform:"translate(6,-26)"},itemGL); notepadShape(itemsL.notepad);
  // head
  const head=el("g",{},body);
  el("ellipse",{cx:-55,cy:2,rx:10,ry:17,fill:o.skin,stroke:INK,"stroke-width":3},head); el("ellipse",{cx:55,cy:2,rx:10,ry:17,fill:o.skin,stroke:INK,"stroke-width":3},head);
  el("path",{d:"M-54 -22 Q-56 -72 0 -74 Q56 -72 54 -22 Q54 30 30 56 Q0 74 -30 56 Q-54 30 -54 -22 Z",fill:o.skin,stroke:INK,"stroke-width":4},head);
  const flush=el("path",{d:"M-52 -10 Q-54 -66 0 -68 Q54 -66 52 -10 Q52 30 30 52 Q0 68 -30 52 Q-52 30 -52 -10 Z",fill:"#E53935",opacity:0},head);
  const face=el("g",{},head);
  if(o.stubble){el("path",{d:"M-52 8 Q-50 42 -28 58 Q0 76 28 58 Q50 42 52 8 Q42 30 22 33 Q0 29 -22 33 Q-42 30 -52 8 Z",fill:o.stubble,opacity:.3},face)}
  el("circle",{cx:-34,cy:20,r:11,fill:"#E57373",opacity:o.blush||0.18},face); el("circle",{cx:34,cy:20,r:11,fill:"#E57373",opacity:o.blush||0.18},face);
  if(o.lines) [-21,21].forEach(x=>{el("path",{d:`M${x-13} 7 Q${x} 13 ${x+13} 7`,stroke:"#7A4A2A","stroke-width":2,fill:"none",opacity:.5},face)});
  if(o.lines) el("path",{d:"M-30 -46 Q0 -52 30 -46 M-26 -38 Q0 -43 26 -38",stroke:"#7A4A2A","stroke-width":2,fill:"none",opacity:.4},face);
  const eyes=[-21,21].map(x=>{const e=el("g",{transform:`translate(${x},-8)`},face);
    const w=el("ellipse",{rx:12,ry:8,fill:"#fff",stroke:INK,"stroke-width":2},e);
    const ir=el("circle",{r:6.5,fill:"#3B2414"},e); const pu=el("circle",{r:3,fill:"#000"},e); const hl=el("circle",{r:2,fill:"#fff"},e);
    const lid=el("path",{d:"M-13 -3 Q0 -11 13 -3",stroke:INK,"stroke-width":o.lash||3.5,fill:"none","stroke-linecap":"round"},e);
    const cover=el("ellipse",{rx:13,ry:9,fill:o.skin,opacity:0},e); const shut=el("path",{d:"M-12 1 Q0 6 12 1",stroke:INK,"stroke-width":3.5,fill:"none","stroke-linecap":"round",opacity:0},e);
    const dot=el("circle",{r:4.5,fill:INK,opacity:0},e);
    return {e,w,ir,pu,hl,lid,cover,shut,dot,x}});
  const brows=[-1,1].map(s=>el("path",{stroke:o.browCol||"#1C1410","stroke-width":o.brow||6,fill:"none","stroke-linecap":"round"},face));
  el("path",{d:"M3 0 Q-5 20 -2 26 Q4 29 10 25",stroke:"#7A4A2A","stroke-width":3,fill:"none","stroke-linecap":"round"},face);
  const mouthO=el("ellipse",{cx:0,cy:44,rx:12,ry:3,fill:"#5A1E1E"},face);
  const lips=el("path",{d:"M-14 43 Q0 47 14 43",stroke:o.lip||"#8A3A3A","stroke-width":4,fill:"none","stroke-linecap":"round"},face);
  const smile=el("path",{d:"M-18 39 Q0 56 18 39",stroke:o.lip||"#8A3A3A","stroke-width":4.5,fill:"none","stroke-linecap":"round",opacity:0},face);
  const laugh=el("path",{d:"M-20 38 Q0 64 20 38 Z",fill:"#5A1E1E",stroke:o.lip||"#8A3A3A","stroke-width":4,opacity:0},face);
  const sad=el("path",{d:"M-14 50 Q0 39 14 50",stroke:o.lip||"#8A3A3A","stroke-width":4.5,fill:"none","stroke-linecap":"round",opacity:0},face);
  const smirk=el("path",{d:"M-14 44 Q4 49 19 37",stroke:o.lip||"#8A3A3A","stroke-width":4.5,fill:"none","stroke-linecap":"round",opacity:0},face);
  const gasp=el("ellipse",{cx:0,cy:46,rx:10,ry:13,fill:"#5A1E1E",stroke:o.lip||"#8A3A3A","stroke-width":3.5,opacity:0},face);
  const flat=el("line",{x1:-13,y1:45,x2:13,y2:45,stroke:INK,"stroke-width":4,"stroke-linecap":"round",opacity:0},face);
  if(o.moustache) el("path",{d:o.thickMo?"M-36 32 Q-22 12 0 22 Q22 12 36 32 Q40 44 28 44 Q14 34 0 38 Q-14 34 -28 44 Q-40 44 -36 32 Z":"M-30 30 Q-16 18 0 25 Q16 18 30 30 Q34 40 24 41 Q12 34 0 37 Q-12 34 -24 41 Q-34 40 -30 30 Z",fill:o.moustache,stroke:INK,"stroke-width":2},face);
  // hair
  if(o.bald){   // bald top with a shine; dark sides with grey temples
    [-1,1].forEach(s=>{el("path",{d:`M${s*58} -6 Q${s*62} -46 ${s*44} -60 Q${s*36} -40 ${s*44} -22 Q${s*46} -10 ${s*50} -4 Z`,fill:o.hair,stroke:INK,"stroke-width":3},head);
      el("path",{d:`M${s*57} -20 Q${s*58} -40 ${s*48} -52 Q${s*44} -36 ${s*49} -22 Z`,fill:o.grey||"#9E9E9E"},head)});
    el("path",{d:"M-22 -62 Q0 -70 20 -62",stroke:o.hair,"stroke-width":5,fill:"none",opacity:.35},head);
    el("ellipse",{cx:-14,cy:-58,rx:16,ry:7,fill:"#FFFFFF",opacity:.45,transform:"rotate(-12 -14 -58)"},head)}
  else if(o.messy){
    el("path",{d:"M-58 -10 Q-66 -84 -6 -90 Q56 -94 62 -28 L58 -8 Q54 -48 30 -56 Q2 -62 -26 -54 Q-50 -46 -54 -8 Z",fill:o.hair,stroke:INK,"stroke-width":3},head);
    [[-50,-62,-78,-96],[-30,-80,-46,-122],[-8,-88,-6,-130],[14,-88,34,-124],[34,-80,66,-104],[52,-60,80,-70],[-58,-36,-82,-50]].forEach(([x,y,tx,ty],k)=>{
      el("path",{d:`M${x-14} ${y+8} Q${(x+tx)/2-8} ${(y+ty)/2} ${tx} ${ty} Q${(x+tx)/2+10} ${(y+ty)/2+6} ${x+14} ${y+6} Z`,fill:o.hair,stroke:INK,"stroke-width":3,"stroke-linejoin":"round"},head)});
    el("path",{d:"M-58 -10 Q-66 -84 -6 -90 Q56 -94 62 -28 L58 -8 Q54 -48 30 -56 Q2 -62 -26 -54 Q-50 -46 -54 -8 Z",fill:o.hair},head);
    el("path",{d:"M-20 -58 Q-34 -40 -46 -36 M10 -60 Q4 -42 -6 -36",stroke:o.hair,"stroke-width":9,fill:"none","stroke-linecap":"round"},head)}
  else if(o.sidePart){   // oiled, shiny side part (parting on his right = our left), a comb line, the sweep to the other side
    el("path",{d:"M-58 -8 Q-64 -80 -24 -88 L-20 -70 Q-40 -60 -52 -30 Z",fill:o.hair,stroke:INK,"stroke-width":3},head);
    el("path",{d:"M-18 -90 Q40 -98 60 -50 L60 -10 Q56 -40 40 -52 Q10 -66 -20 -62 Q-30 -64 -26 -74 Z",fill:o.hair,stroke:INK,"stroke-width":3,"stroke-linejoin":"round"},head);
    el("path",{d:"M-22 -88 Q-24 -76 -22 -64",stroke:"#D9B89A","stroke-width":3,fill:"none","stroke-linecap":"round"},head);          // the parting
    if(o.oiled){ el("path",{d:"M-6 -82 Q24 -86 44 -66",stroke:"#FFFFFF","stroke-width":5,fill:"none","stroke-linecap":"round",opacity:.6},head);
      el("path",{d:"M-46 -66 Q-40 -76 -32 -80",stroke:"#FFFFFF","stroke-width":4,fill:"none","stroke-linecap":"round",opacity:.5},head);
      [[-10,-74,40,-58],[-6,-68,46,-48]].forEach(([a,b_,c,d_])=>el("path",{d:`M${a} ${b_} Q${(a+c)/2} ${b_-10} ${c} ${d_}`,stroke:"#3A2E26","stroke-width":2,fill:"none",opacity:.9},head))}}   // comb lines
  else if(o.ponytail){   // pulled back smoothly into the high ponytail, a hair tie at the crown
    el("path",{d:"M-58 -6 Q-66 -86 2 -88 Q64 -86 60 -8 Q54 -54 26 -62 Q2 -68 -26 -60 Q-52 -50 -58 -6 Z",fill:o.hair,stroke:INK,"stroke-width":3},head);
    el("path",{d:"M-30 -78 Q0 -84 30 -78",stroke:"#3B2A22","stroke-width":3,fill:"none",opacity:.6},head);
    el("ellipse",{cx:22,cy:-92,rx:13,ry:8,fill:o.tieCol||"#E53935",stroke:INK,"stroke-width":2.5},head)}
  else if(o.longHair){el("path",{d:"M-60 -6 Q-68 -88 4 -88 Q64 -86 62 -14 Q50 -62 12 -64 Q-12 -46 -40 -44 Q-56 -30 -60 -6 Z",fill:o.hair,stroke:INK,"stroke-width":3},head)}
  else el("path",{d:"M-58 -10 Q-66 -84 -6 -90 Q56 -94 62 -28 L58 -8 Q54 -48 30 -56 Q2 -62 -26 -54 Q-50 -46 -54 -8 Z",fill:o.hair,stroke:INK,"stroke-width":3},head);
  if(o.glasses){ [-21,21].forEach(x=>el("rect",{x:x-17,y:-14,width:34,height:22,rx:9,fill:"rgba(220,240,255,.25)",stroke:o.glasses,"stroke-width":3.5},face)); el("path",{d:"M-4 -6 Q0 -10 4 -6",stroke:o.glasses,"stroke-width":3.5,fill:"none"},face)}
  if(o.hoops) [-1,1].forEach(s=>el("circle",{cx:s*56,cy:25,r:10,fill:"none",stroke:"#E0A82E","stroke-width":4},head));
  if(o.earPen){ const pg=el("g",{transform:"translate(58,-24) rotate(-38)"},head);
    el("rect",{x:-5,y:-34,width:10,height:62,rx:4,fill:"#1E88E5",stroke:INK,"stroke-width":2.5},pg); el("rect",{x:-5,y:-34,width:10,height:14,rx:3,fill:"#0D47A1"},pg); el("path",{d:"M-5 28 L0 38 L5 28 Z",fill:"#FFE0B2",stroke:INK,"stroke-width":2},pg)}
  const sweat=el("path",{d:"M60 -40 Q70 -22 62 -14 Q52 -14 54 -26 Z",fill:"#81D4FA",stroke:INK,"stroke-width":2,opacity:0},head);
  const hatG=el("g",{},head); santaShape(hatG);
  const blindG=el("g",{},head); blindfoldShape(blindG);   // Ep 2 (st.blind 0..1: tied on)
  const garG=el("g",{},body); garlandShape(garG);
  [AL.fing,AR.fing,AL.hand,AR.hand,itemG,itemGL].forEach(x=>body.appendChild(x));
  const st={};
  const SH=[[-82,-270],[82,-270]];
  function draw(){
    const k=st; g.setAttribute("transform",`translate(${k.x},${k.y-k.hop}) rotate(${k.rot}) scale(${k.s},${k.s*(k.squash||1)})`); g.style.opacity=k.vis; g.style.display=k.vis>0?"":"none";
    if(!k.vis) return;
    const ht=`translate(${k.look*3},${-392+k.headY+(k.nod||0)}) rotate(${k.headRot})`; head.setAttribute("transform",ht); hairBack.setAttribute("transform",ht);
    if(pony) pony.setAttribute("transform",`rotate(${(k.ponySwing||0)} 30 -100)`);
    face.setAttribute("transform",`translate(${k.look*7},${k.lookY*3})`);
    legs.forEach((L,i)=>L.setAttribute("transform",`rotate(${(i?1:-1)*k.walk*14+(i?-1:1)*(k.splay||0)} 0 -10)${k.sit?` scale(1,${k.sit})`:""}`));
    if(pack) pack.style.opacity=k.pack; if(straps) straps.style.opacity=k.pack;
    if(o._lany) o._lany.style.opacity=k.lany;
    flush.setAttribute("opacity",k.angry*0.32); sweat.setAttribute("opacity",k.sweat);
    blindG.style.display=k.blind>0?"":"none"; if(k.blind>0) blindG.setAttribute("transform",`translate(0,${(1-k.blind)*-60}) scale(${0.6+0.4*k.blind},1)`);
    hatG.style.display=k.santa>0?"":"none"; if(k.santa>0) hatG.setAttribute("transform",`translate(0,${-(1-k.santa)*520}) rotate(${k.hatTilt||0} 0 -70)`);
    garG.style.display=k.garland>0?"":"none"; if(k.garland>0) garG.setAttribute("transform",`translate(0,${-(1-k.garland)*640}) rotate(${k.gswing||0} 0 -300)`);
    [[AL,SH[0],k.hL,-1],[AR,SH[1],k.hR,1]].forEach(([A,S,T,side])=>{const [e,h]=ik(S[0],S[1],T[0],T[1],118,112,side);
      A.up.setAttribute("x1",S[0]);A.up.setAttribute("y1",S[1]);A.up.setAttribute("x2",e[0]);A.up.setAttribute("y2",e[1]);
      A.lo.setAttribute("x1",e[0]);A.lo.setAttribute("y1",e[1]);A.lo.setAttribute("x2",h[0]);A.lo.setAttribute("y2",h[1]);
      if(A.cuff){const m=[lerp(e[0],h[0],0.25),lerp(e[1],h[1],0.25)]; A.cuff.setAttribute("cx",m[0]);A.cuff.setAttribute("cy",m[1])}
      A.hand.setAttribute("cx",h[0]);A.hand.setAttribute("cy",h[1]); A.h=h;
      A.fing.setAttribute("transform",`translate(${h[0]},${h[1]}) rotate(${side*-12})`); A.fing.setAttribute("opacity",k.spread?1:0)});
    itemG.setAttribute("transform",`translate(${AR.h[0]},${AR.h[1]}) rotate(${k.itemRot})`); for(const n in items) items[n].style.opacity=k.item===n?1:0;
    itemGL.setAttribute("transform",`translate(${AL.h[0]},${AL.h[1]}) rotate(${k.itemRotL})`); for(const n in itemsL) itemsL[n].style.opacity=k.itemL===n?1:0;
    const o_=k.talk, quiet=o_<0.12;
    mouthO.setAttribute("ry",2+12*o_); mouthO.setAttribute("rx",11+5*o_); mouthO.style.opacity=quiet||k.blank?0:1;
    const ex=quiet&&(k.laugh||k.gasp);
    laugh.style.opacity=quiet&&k.laugh&&!k.blank?1:0; gasp.style.opacity=quiet&&k.gasp&&!k.laugh&&!k.blank?1:0;
    lips.style.opacity=quiet&&!k.smile&&!k.sad&&!k.smirk&&!ex&&!k.blank?1:0; smile.style.opacity=quiet&&k.smile&&!ex&&!k.blank?1:0; sad.style.opacity=quiet&&k.sad&&!k.smile&&!ex&&!k.blank?1:0; smirk.style.opacity=quiet&&k.smirk&&!k.smile&&!ex&&!k.blank?1:0;
    flat.style.opacity=k.blank?1:0;
    eyes.forEach((E,i)=>{const closed=!k.blank&&(k.blink||k.shut||(k.wink&&i===1)); const bl=k.blank;
      E.cover.style.opacity=closed||bl?1:0; E.shut.style.opacity=closed?1:0; E.lid.style.opacity=closed||bl?0:1; E.dot.style.opacity=bl?1:0;
      E.w.style.opacity=bl?0:1;
      const tw=bl&&i===1&&k.twitch?Math.sin(T_*80)*1.6:0; E.dot.setAttribute("cy",tw); E.dot.setAttribute("r",bl?(i===1&&k.twitch?4+Math.abs(Math.sin(T_*40)):4.5):4.5);
      E.w.setAttribute("ry",closed?1:8+(k.brow==="u"?2:0)+(k.gasp?2:0)+(k.wide?3:0)); [E.ir,E.pu].forEach(p=>{p.setAttribute("cx",k.look*4.5);p.setAttribute("cy",k.lookY*3)}); E.hl.setAttribute("cx",k.look*4.5-2.5);E.hl.setAttribute("cy",k.lookY*3-2.5);
      [E.ir,E.pu,E.hl].forEach(p=>p.style.opacity=closed||bl?0:1);
      E.lid.setAttribute("d",k.sad?"M-13 -1 Q0 -9 13 -4":"M-13 -3 Q0 -11 13 -3")});
    brows.forEach((b,i)=>{const s=i?1:-1; let B={n:[-27,-29],u:[-34,-36],s:[-24,-30],a:[-19,-33],q:i?[-37,-35]:[-26,-27],w:[-27,-33]}[k.brow]||[-27,-29];
      if(k.blank&&i===1&&k.twitch) B=[B[0]-Math.abs(Math.sin(T_*40))*4,B[1]-Math.abs(Math.sin(T_*40))*4];
      b.setAttribute("d",`M${s*8} ${B[0]} Q${s*20} ${(B[0]+B[1])/2-4} ${s*33} ${B[1]}`)});
  }
  function aim(side,wx,wy){const lx=(wx-st.x)/st.s, ly=(wy-(st.y-st.hop))/st.s; if(side==="L") st.hL=[lx,ly]; else st.hR=[lx,ly]}
  function headW(){const k=st; return [k.x+k.look*3*k.s, k.y-k.hop+(-392+k.headY+(k.nod||0))*k.s]}
  return {st,draw,g,aim,headW};
}
// the per-frame pose reset (every field the rig reads)
function resetPose(C,x,y,s,talk){Object.assign(C.st,{x,y,s,talk:talk||0,blink:0,shut:0,look:0,lookY:0,brow:"n",smile:0,laugh:0,sad:0,smirk:0,gasp:0,
  headRot:0,headY:0,nod:0,hop:0,rot:0,item:"",itemL:"",itemRot:0,itemRotL:0,vis:1,wink:0,walk:0,lany:1,pack:0,spread:0,blank:0,twitch:0,angry:0,sweat:0,wide:0,squash:1,
  splay:0,sit:0,santa:0,hatTilt:0,blind:0,garland:0,gswing:0,ponySwing:0,hL:[-62,-66],hR:[62,-66]})}

// ---------- the series cast (tools/anim2d/cast.md) ----------
const RAMESH_OPT={skin:"#B9805A",hair:"#1B1310",shirt:"#9CCBF0",collar:"#84B8E2",button:"#FFFFFF",messy:true,untucked:true,pocket:true,stubble:"#4A3426",brow:6.5,lip:"#7A3A30",blush:0.2};   // Ramesh, late 20s: light-blue shirt (untucked), messy hair, light stubble
const MANAGER_OPT={skin:"#B07850",hair:"#1C1612",grey:"#A7A7A7",bald:true,shirt:"#FAFAFA",collar:"#E3E3E3",tie:"#7B1E2B",paunch:true,belt:true,moustache:"#14100C",thickMo:true,lines:true,brow:7.5,lip:"#6A3028",blush:0.12};   // the manager, ~45: tucked white shirt, maroon tie, thick moustache, bald top + grey temples, paunch
const SURESH_OFFICE_OPT={skin:"#BE8A5E",hair:"#0E0A08",shirt:"#C9B8EC",collar:"#B9A6E2",button:"#FFFFFF",strain:"#8E7CC3",buttoned:true,sidePart:true,oiled:true,brow:6,lip:"#7A3A30",blush:0.22};   // Suresh (Office Politics), ~30: oiled shiny side part + comb lines, too-tight pale-lavender shirt buttoned to the collar (straining buttons), no tie. NOT the 15 Nov TL's SURESH_OPT
const PRIYA_OPT={skin:"#C9956B",hair:"#1F1410",shirt:"#F2B632",trim:"#D99A1E",cardigan:"#26355E",sleeve:"#26355E",fore:"#26355E",cuff:"#1B2748",ponytail:true,tieCol:"#E53935",hoops:true,earPen:true,brow:4.8,lash:4,blush:0.28,lip:"#A0404A"};   // Priya, late 20s: high ponytail, mustard top under an open navy cardigan, small gold hoops, a pen behind her right ear
const COLLEAGUE_OPT=[{skin:"#C98F66",hair:"#20140F",shirt:"#F06292",trim:"#FFCDD2",kurta:true,longHair:true,bun:true,sleeve:"#F06292",fore:"#C98F66",brow:4.5,lash:4,lip:"#A0404A"},   // pink kurta, bun
           {skin:"#A86F48",hair:"#1A1410",shirt:"#81C784",collar:"#66BB6A",glasses:"#263238",brow:6,lip:"#6A3028"},                                                                       // green shirt, glasses
           {skin:"#C08860",hair:"#2A1A12",shirt:"#FFB74D",collar:"#FFA726",moustache:"#1E1612",brow:6,lip:"#6A3028"}];                                                                     // orange shirt, moustache
const LEGS={manager:{pant:"#37404A",shoe:"#2B1B12"},ramesh:{pant:"#3B4252",shoe:"#1A1A1A"},suresh:{pant:"#2E2E38",shoe:"#4E342E"},priya:{pant:"#3A3F55",shoe:"#6D4C41"},
            col:[{pant:"#F8BBD0",shoe:"#8D6E63"},{pant:"#4E5A65",shoe:"#1A1A1A"},{pant:"#5D4E3F",shoe:"#2B1B12"}]};
const legsIf=(standing,l)=>standing?{legs:l}:{};
function makeManager(parent,standing=true,extra={}){return makeAdult({...MANAGER_OPT,...legsIf(standing,LEGS.manager),...extra,parent})}
function makeRamesh(parent,standing=true,extra={}){return makeAdult({...RAMESH_OPT,badge:["RAMESH","STAFF"],...legsIf(standing,LEGS.ramesh),...extra,parent})}
function makeSuresh(parent,standing=true,extra={}){return makeAdult({...SURESH_OFFICE_OPT,badge:["SURESH","STAFF"],...legsIf(standing,LEGS.suresh),...extra,parent})}
function makePriya(parent,standing=true,extra={}){return makeAdult({...PRIYA_OPT,badge:["PRIYA","STAFF"],...legsIf(standing,LEGS.priya),...extra,parent})}
function makeColleague(k,parent,standing=true,extra={}){return makeAdult({...COLLEAGUE_OPT[k],...legsIf(standing,LEGS.col[k]),...extra,parent})}
// Suresh's bobble-head nod (call every frame while he nods): st.nod + a little head tilt
function bobble(st,t,amp=1){st.nod=Math.sin(t*16)*7*amp; st.headRot=Math.sin(t*16+0.6)*4*amp}
