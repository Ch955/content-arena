// Moral dilemma "Amma's chain" — drawn world, cast and choreography (loaded by ep.html). PIXEL skin for the whole reel.
// makeAdult rig reused from 24 Nov "the mystery tiffin"; added here: wrist (bare wrist under the sleeve end), tan (pale watch
// tan line on the anatomical LEFT wrist = viewer's right, AR), braid (loose side braid over her left shoulder + tie),
// dupatta (over both shoulders, dotted), pen (shirt-pocket pen), lowSpecs (reading specs low on the nose), bald (balding
// top, white side hair). Props: the pawn tray + cloth packets, Amma's chain (thin gold, small round pendant with a red
// stone), pink pledge tokens, the hospital receipt, the steel bureau with its inner locker, the wall calendar, the pill box.
// Every clue's TEXT is a crisp HTML label (ep.html) tracked to the world with wlab(), outside the pixel filter.
const NS="http://www.w3.org/2000/svg", svg=document.getElementById("s"), nar=document.getElementById("nar"), absvg=document.getElementById("ab");
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

function ik(sx,sy,tx,ty,a,b,side){let dx=tx-sx,dy=ty-sy,d=Math.hypot(dx,dy)||1; const dd=Math.min(d,a+b-1); dx/=d; dy/=d;
  const base=Math.atan2(dy,dx), cA=clamp((a*a+dd*dd-b*b)/(2*a*dd),-1,1), al=Math.acos(cA);
  const c1=[sx+Math.cos(base+al)*a,sy+Math.sin(base+al)*a], c2=[sx+Math.cos(base-al)*a,sy+Math.sin(base-al)*a];
  const sc=p=>p[1]+side*p[0]*0.6; const e=sc(c1)>sc(c2)?c1:c2; return [e,[sx+dx*dd,sy+dy*dd]]}
function makeAdult(o){
  const g=el("g",{},o.parent||W), body=el("g",{},g);
  const legs=[];
  if(o.legs&&!o.saree) [-1,1].forEach(s=>{const lg_=el("g",{},body); el("path",{d:`M${s*50-30} -14 L${s*50+30} -14 L${s*56+26} 420 L${s*56-26} 420 Z`,fill:o.legs.pant,stroke:INK,"stroke-width":5},lg_);
    el("path",{d:`M${s*56-34} 418 Q${s*56-36} 446 ${s*56+s*14} 448 Q${s*56+46*s} 446 ${s*56+44*s} 424 Z`,fill:o.legs.shoe,stroke:INK,"stroke-width":4},lg_); legs.push(lg_)});
  const hairBack=el("g",{},body);
  if(o.longHair) el("path",{d:"M-72 -40 Q-80 -100 0 -102 Q80 -100 72 -40 L80 72 Q74 98 46 94 L-46 94 Q-74 98 -80 72 Z",fill:o.hair},hairBack);
  if(o.braid) el("path",{d:"M-70 -40 Q-78 -100 0 -102 Q78 -100 70 -40 L72 26 Q60 44 0 44 Q-60 44 -72 26 Z",fill:o.hair},hairBack);
  if(o.bun&&o.lowBun) el("ellipse",{cx:50,cy:30,rx:30,ry:26,fill:o.hair,stroke:INK,"stroke-width":3},hairBack);
  else if(o.bun) el("circle",{cx:0,cy:-84,r:36,fill:o.hair,stroke:INK,"stroke-width":3},hairBack);
  if(o.saree){
    const Y2=o.floor?436:230, X2=o.floor?110:96;
    if(o.floor) [-1,1].forEach(s=>el("ellipse",{cx:s*40,cy:442,rx:30,ry:10,fill:o.floor,stroke:INK,"stroke-width":3},body));
    el("path",{d:`M-70 -60 L70 -60 L${X2} ${Y2} L${-X2} ${Y2} Z`,fill:o.saree.base,stroke:INK,"stroke-width":5},body);
    if(o.saree.check){ const xa=y=>70+(X2-70)*(y+60)/(Y2+60);
      for(let y=-40;y<Y2-6;y+=26) el("line",{x1:-xa(y)+3,y1:y,x2:xa(y)-3,y2:y,stroke:o.saree.check,"stroke-width":4,opacity:.7},body);
      for(let k=-4;k<=4;k++) el("line",{x1:k*15,y1:-58,x2:k*15*X2/70,y2:Y2-4,stroke:o.saree.check,"stroke-width":4,opacity:.7},body)}
    for(let k=-2;k<=2;k++) el("line",{x1:k*22,y1:-40,x2:k*30,y2:Y2-4,stroke:INK,"stroke-width":2,opacity:.25},body);
    el("path",{d:"M-88 -268 Q-92 -288 -64 -292 L-24 -300 L24 -300 L64 -292 Q92 -288 88 -268 L76 -50 L-76 -50 Z",fill:o.shirt,stroke:INK,"stroke-width":5},body);
    el("path",{d:"M-28 -300 Q0 -262 28 -300",fill:o.skin,stroke:INK,"stroke-width":3},body);
    el("path",{d:"M-76 -120 Q0 -100 76 -120 L76 -50 L-76 -50 Z",fill:o.skin,stroke:INK,"stroke-width":3},body);
    el("path",{d:"M-92 -262 L-40 -300 L96 -100 L90 -10 L60 -10 Z",fill:o.saree.pallu,stroke:INK,"stroke-width":5,"stroke-linejoin":"round"},body);
    if(o.saree.check) [[-60,-262,80,-90],[-30,-282,92,-60],[-74,-230,40,-30]].forEach(([a,b_,c,d])=>el("line",{x1:a,y1:b_,x2:c,y2:d,stroke:o.saree.check,"stroke-width":4,opacity:.65},body));
    el("path",{d:"M-84 -258 L-38 -290 L92 -98",stroke:o.saree.border,"stroke-width":o.saree.bw||9,fill:"none"},body);
    el("path",{d:`M${-X2} ${Y2-4} L${X2} ${Y2-4}`,stroke:o.saree.border,"stroke-width":12},body);
  } else if(o.kurta){
    el("path",{d:"M-84 -268 Q-88 -286 -62 -290 L-24 -298 L24 -298 L62 -290 Q88 -286 84 -268 L70 -60 L104 220 L-104 220 L-70 -60 Z",fill:o.shirt,stroke:INK,"stroke-width":5},body);
    el("path",{d:"M-30 -298 Q0 -250 30 -298",fill:o.skin,stroke:o.trim,"stroke-width":8},body);
    el("path",{d:"M0 -258 L0 -120",stroke:o.trim,"stroke-width":7,"stroke-dasharray":"10 8"},body);
    if(o.dupatta){ [-1,1].forEach(s=>{el("path",{d:`M${s*30} -300 Q${s*92} -292 ${s*94} -250 L${s*100} -20 L${s*62} -20 L${s*58} -250 Q${s*50} -278 ${s*24} -290 Z`,fill:o.dupatta,stroke:INK,"stroke-width":4,"stroke-linejoin":"round"},body);
      for(let k=0;k<5;k++) el("circle",{cx:s*(78+(k%2)*8),cy:-220+k*44,r:4,fill:o.dupDot||"#FFE28A"},body);
      el("path",{d:`M${s*62} -20 L${s*100} -20`,stroke:o.dupDot||"#FFE28A","stroke-width":6},body)}) }
  } else {
    el("path",{d:"M-94 -268 Q-98 -288 -70 -292 L-26 -300 L26 -300 L70 -292 Q98 -288 94 -268 L82 -10 Q80 0 66 0 L-66 0 Q-80 0 -82 -10 Z",fill:o.shirt,stroke:INK,"stroke-width":5},body);
    el("path",{d:"M-24 -300 L0 -268 L24 -300",fill:o.skin},body);
    el("path",{d:"M-28 -302 L-4 -260 L-40 -276 Z",fill:o.collar||o.shirt,stroke:INK,"stroke-width":4,"stroke-linejoin":"round"},body);
    el("path",{d:"M28 -302 L4 -260 L40 -276 Z",fill:o.collar||o.shirt,stroke:INK,"stroke-width":4,"stroke-linejoin":"round"},body);
    el("line",{x1:0,y1:-262,x2:0,y2:0,stroke:INK,"stroke-width":3,opacity:.55},body);
    [-225,-170,-115,-60].forEach(y=>el("circle",{cx:6,cy:y,r:4,fill:o.button||"#9A9AA6"},body));
    el("path",{d:"M-60 -200 L-30 -200 L-30 -170 L-60 -170 Z",fill:"none",stroke:INK,"stroke-width":3,opacity:.45},body);
    if(o.pen){ el("rect",{x:-50,y:-222,width:8,height:40,rx:3,fill:o.pen},body) }
  }
  if(o.apron){   // cafeteria apron (bib + pocket)
    el("path",{d:"M-50 -246 L50 -246 L60 -70 L80 210 L-80 210 L-60 -70 Z",fill:o.apron,stroke:INK,"stroke-width":4,"stroke-linejoin":"round"},body);
    el("path",{d:"M-48 -246 L-30 -300 M48 -246 L30 -300",stroke:o.apron,"stroke-width":8,fill:"none"},body);
    el("path",{d:"M-62 -72 L62 -72",stroke:"#B8860B","stroke-width":5},body);
    el("path",{d:"M-92 -72 L-62 -72 M62 -72 L96 -64 L104 -40",stroke:o.apron,"stroke-width":7,fill:"none","stroke-linecap":"round"},body);
    o._pocket=el("g",{transform:"translate(26,-10)"},body);
    el("rect",{x:-28,y:-34,width:56,height:58,rx:6,fill:"#D9982A",stroke:INK,"stroke-width":3},o._pocket);
    o._phone=el("rect",{x:-14,y:-52,width:28,height:26,rx:4,fill:"#1A1A1A",stroke:INK,"stroke-width":2},o._pocket); o._pocket.appendChild(o._pocket.firstChild)}
  el("rect",{x:-19,y:-334,width:38,height:44,fill:o.skin},body);
  let specG=null;
  if(o.specChain){ specG=el("g",{},body); el("path",{d:"M-26 -300 Q-30 -230 0 -206 Q30 -230 26 -300",stroke:"#D4A537","stroke-width":3,fill:"none"},specG);
    [-15,15].forEach(x=>el("ellipse",{cx:x,cy:-200,rx:13,ry:9,fill:"rgba(220,240,255,.5)",stroke:"#6D4C41","stroke-width":3},specG)); el("path",{d:"M-3 -201 Q0 -205 3 -201",stroke:"#6D4C41","stroke-width":3,fill:"none"},specG)}
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
                 bang:o.bangles?el("circle",{r:16,fill:"none",stroke:o.bangles,"stroke-width":6},body):null,
                 wr:o.wrist?el("line",{stroke:o.skin,"stroke-width":25},body):null,   // bare wrist (sleeve ends above it)
                 tan:(o.tan&&s>0)?el("line",{stroke:o.tan,"stroke-width":25},body):null,   // pale watch tan line (anatomical LEFT wrist = viewer's right)
                 hand:el("circle",{r:17,fill:o.skin,stroke:INK,"stroke-width":3},body)});
  const AL=arm(-1), AR=arm(1);
  const itemG=el("g",{},body), items={}, itemGL=el("g",{},body), itemsL={};
  const phoneShape=(p,scr)=>{el("rect",{x:-19,y:-38,width:38,height:68,rx:8,fill:"#1A1A1A",stroke:INK,"stroke-width":3},p); return el("rect",{x:-14,y:-32,width:28,height:54,rx:4,fill:scr},p)};
  itemsL.phone=el("g",{},itemGL); phoneShape(itemsL.phone,"#80CBC4");
  items.plate=el("g",{},itemG); el("ellipse",{cx:0,cy:-6,rx:44,ry:11,fill:"#E0E6EA",stroke:INK,"stroke-width":3},items.plate);
  el("path",{d:"M-30 -10 Q-4 -40 22 -10 Z",fill:"#7CB342",stroke:"#33691E","stroke-width":2.5},items.plate); el("ellipse",{cx:26,cy:-12,rx:12,ry:6,fill:"#F6E3A1",stroke:"#C9A75A","stroke-width":2},items.plate);
  items.ladle=el("g",{},itemG); el("line",{x1:0,y1:0,x2:46,y2:58,stroke:"#90A4AE","stroke-width":7,"stroke-linecap":"round"},items.ladle); el("line",{x1:0,y1:0,x2:46,y2:58,stroke:INK,"stroke-width":2},items.ladle);
  el("path",{d:"M34 58 Q46 82 66 62 Z",fill:"#B0BEC5",stroke:INK,"stroke-width":3},items.ladle);
  itemsL.laptop=el("g",{},itemGL); el("rect",{x:-70,y:-20,width:140,height:96,rx:8,fill:"#90A4AE",stroke:INK,"stroke-width":4,transform:"rotate(-12)"},itemsL.laptop);
  el("rect",{x:-60,y:-12,width:120,height:8,rx:3,fill:"#B0BEC5",transform:"rotate(-12)"},itemsL.laptop);
  // head
  const head=el("g",{},body);
  el("ellipse",{cx:-55,cy:2,rx:10,ry:17,fill:o.skin,stroke:INK,"stroke-width":3},head); el("ellipse",{cx:55,cy:2,rx:10,ry:17,fill:o.skin,stroke:INK,"stroke-width":3},head);
  el("path",{d:o.roundFace?"M-57 -20 Q-59 -74 0 -76 Q59 -74 57 -20 Q59 34 36 58 Q0 80 -36 58 Q-59 34 -57 -20 Z":"M-54 -22 Q-56 -72 0 -74 Q56 -72 54 -22 Q54 30 30 56 Q0 74 -30 56 Q-54 30 -54 -22 Z",fill:o.skin,stroke:INK,"stroke-width":4},head);
  if(o.earrings) [-55,55].forEach(x=>el("circle",{cx:x,cy:24,r:o.earCol?5:6.5,fill:o.earCol||"#F5B347",stroke:INK,"stroke-width":2},head));
  const face=el("g",{},head);
  if(o.stubble){el("path",{d:"M-52 8 Q-50 42 -28 58 Q0 76 28 58 Q50 42 52 8 Q42 30 22 33 Q0 29 -22 33 Q-42 30 -52 8 Z",fill:o.stubble,opacity:.34},face);
    el("path",{d:"M-20 31 Q0 24 20 31 Q0 35 -20 31 Z",fill:o.stubble,opacity:.4},face);
    for(let k=0;k<26;k++){const a=hash(k+3)*Math.PI, r=40+hash(k+7)*12; el("circle",{cx:Math.cos(a)*r*1.05,cy:22+Math.sin(a)*r*0.82,r:1.6,fill:o.stubble,opacity:.5},face)}}
  el("circle",{cx:-34,cy:20,r:11,fill:"#E57373",opacity:o.blush||0.18},face); el("circle",{cx:34,cy:20,r:11,fill:"#E57373",opacity:o.blush||0.18},face);
  if(o.lines) [-21,21].forEach(x=>{el("path",{d:`M${x-13} 7 Q${x} 13 ${x+13} 7`,stroke:"#7A4A2A","stroke-width":2,fill:"none",opacity:.5},face); el("path",{d:`M${x*1.9} -14 l${x>0?6:-6} 4 M${x*1.9} -8 l${x>0?7:-7} 2`,stroke:"#7A4A2A","stroke-width":2,opacity:.5},face)});
  const eyes=[-21,21].map(x=>{const e=el("g",{transform:`translate(${x},-8)`},face);
    const w=el("ellipse",{rx:12,ry:8,fill:"#fff",stroke:INK,"stroke-width":2},e);
    const ir=el("circle",{r:6.5,fill:"#3B2414"},e); const pu=el("circle",{r:3,fill:"#000"},e); const hl=el("circle",{r:2,fill:"#fff"},e);
    const lid=el("path",{d:"M-13 -3 Q0 -11 13 -3",stroke:INK,"stroke-width":o.lash||3.5,fill:"none","stroke-linecap":"round"},e);
    const cover=el("ellipse",{rx:13,ry:9,fill:o.skin,opacity:0},e); const shut=el("path",{d:"M-12 1 Q0 6 12 1",stroke:INK,"stroke-width":3.5,fill:"none","stroke-linecap":"round",opacity:0},e);
    return {e,w,ir,pu,hl,lid,cover,shut}});
  const brows=[-1,1].map(s=>el("path",{stroke:o.browCol||"#1C1410","stroke-width":o.brow||6,fill:"none","stroke-linecap":"round"},face));
  el("path",{d:"M3 0 Q-5 20 -2 26 Q4 29 10 25",stroke:"#7A4A2A","stroke-width":3,fill:"none","stroke-linecap":"round"},face);
  if(o.bindi) el("circle",{cx:0,cy:-36,r:5,fill:"#C62828"},face);
  const mouthO=el("ellipse",{cx:0,cy:44,rx:12,ry:3,fill:"#5A1E1E"},face);
  const lips=el("path",{d:"M-14 43 Q0 47 14 43",stroke:o.lip||"#8A3A3A","stroke-width":4,fill:"none","stroke-linecap":"round"},face);
  const smile=el("path",{d:"M-18 39 Q0 56 18 39",stroke:o.lip||"#8A3A3A","stroke-width":4.5,fill:"none","stroke-linecap":"round",opacity:0},face);
  const laugh=el("path",{d:"M-20 38 Q0 64 20 38 Z",fill:"#5A1E1E",stroke:o.lip||"#8A3A3A","stroke-width":4,opacity:0},face);
  const sad=el("path",{d:"M-14 48 Q0 39 14 48",stroke:o.lip||"#8A3A3A","stroke-width":4.5,fill:"none","stroke-linecap":"round",opacity:0},face);
  const smirk=el("path",{d:"M-14 44 Q4 49 19 37",stroke:o.lip||"#8A3A3A","stroke-width":4.5,fill:"none","stroke-linecap":"round",opacity:0},face);
  const gasp=el("ellipse",{cx:0,cy:46,rx:10,ry:13,fill:"#5A1E1E",stroke:o.lip||"#8A3A3A","stroke-width":3.5,opacity:0},face);
  const tear=el("path",{d:"M0 0 Q-5 9 0 13 Q5 9 0 0 Z",fill:"#B3E5FC",stroke:"#4FC3F7","stroke-width":1.5,opacity:0},face);
  if(o.lowSpecs){ [-21,21].forEach(x=>el("rect",{x:x-17,y:2,width:34,height:17,rx:5,fill:"rgba(220,240,255,.22)",stroke:o.lowSpecs,"stroke-width":4},face)); el("path",{d:"M-4 8 Q0 4 4 8",stroke:o.lowSpecs,"stroke-width":4,fill:"none"},face);
    [-1,1].forEach(s=>el("line",{x1:s*38,y1:8,x2:s*54,y2:2,stroke:o.lowSpecs,"stroke-width":4},face)) }
  if(o.glasses) [-21,21].forEach(x=>el("rect",{x:x-17,y:-14,width:34,height:22,rx:9,fill:"rgba(220,240,255,.25)",stroke:o.glasses,"stroke-width":3.5},face));
  if(o.bald){ [-1,1].forEach(s=>{el("path",{d:`M${s*58} -4 Q${s*64} -40 ${s*50} -58 Q${s*40} -40 ${s*44} -26 Q${s*40} -12 ${s*46} 0 Z`,fill:o.bald,stroke:INK,"stroke-width":3},head)});
    el("path",{d:"M-34 -66 Q0 -84 34 -66",stroke:"#FFFFFF","stroke-width":6,fill:"none","stroke-linecap":"round",opacity:.45},head) }
  else if(o.braid){ el("path",{d:"M-60 -6 Q-68 -88 4 -88 Q64 -86 62 -14 Q50 -62 12 -64 Q-12 -46 -40 -44 Q-56 -30 -60 -6 Z",fill:o.hair,stroke:INK,"stroke-width":3},head);
    el("path",{d:"M40 -60 Q66 -30 62 10",stroke:o.hair,"stroke-width":20,fill:"none","stroke-linecap":"round"},head);
    for(let k=0;k<8;k++) el("ellipse",{cx:62+(k%2?6:-2)+k*2.2,cy:24+k*27,rx:16-k*0.6,ry:17,fill:o.hair,stroke:INK,"stroke-width":3,transform:`rotate(${k%2?18:-18} ${62+(k%2?6:-2)+k*2.2} ${24+k*27})`},head);
    el("rect",{x:70,y:236,width:20,height:12,rx:3,fill:o.tie||"#C62828",stroke:INK,"stroke-width":2},head); el("path",{d:"M74 248 L72 272 M80 248 L80 276 M86 248 L88 272",stroke:o.hair,"stroke-width":5,"stroke-linecap":"round"},head) }
  else if(o.bun) el("path",{d:"M-58 -6 Q-64 -88 0 -90 Q64 -88 58 -6 Q52 -50 30 -58 Q10 -64 2 -84 Q-8 -64 -30 -58 Q-52 -50 -58 -6 Z",fill:o.hair,stroke:INK,"stroke-width":3},head);
  else if(o.longHair){el("path",{d:"M-60 -6 Q-68 -88 4 -88 Q64 -86 62 -14 Q50 -62 12 -64 Q-12 -46 -40 -44 Q-56 -30 -60 -6 Z",fill:o.hair,stroke:INK,"stroke-width":3},head);
    el("path",{d:"M-62 -20 Q-74 30 -64 80",stroke:o.hair,"stroke-width":18,fill:"none","stroke-linecap":"round"},head); el("path",{d:"M62 -20 Q74 30 64 80",stroke:o.hair,"stroke-width":18,fill:"none","stroke-linecap":"round"},head)}
  else if(o.sidePart){ el("path",{d:"M-58 -8 Q-68 -88 -6 -94 Q60 -98 63 -30 L59 -8 Q57 -46 44 -58 Q14 -72 -20 -64 Q-30 -62 -36 -72 Q-50 -52 -54 -8 Z",fill:o.hair,stroke:INK,"stroke-width":3},head);
    el("path",{d:"M-18 -86 Q20 -92 46 -70",stroke:"#5C4C44","stroke-width":5,fill:"none","stroke-linecap":"round",opacity:.85},head)}
  else el("path",{d:"M-58 -10 Q-66 -84 -6 -90 Q56 -94 62 -28 L58 -8 Q54 -48 30 -56 Q2 -62 -26 -54 Q-50 -46 -54 -8 Z",fill:o.hair,stroke:INK,"stroke-width":3},head);
  if(o.streaks) [["M-44 -40 Q-40 -70 -14 -80",0],["M30 -76 Q48 -66 52 -36",0],["M-52 -16 Q-56 -40 -46 -58",0]].forEach(([d])=>el("path",{d,stroke:o.streaks,"stroke-width":5,fill:"none","stroke-linecap":"round",opacity:.9},head));
  [AL.hand,AR.hand,itemG,itemGL].forEach(x=>body.appendChild(x));
  const st={x:0,y:0,s:1,flip:1,rot:0,hop:0,vis:1,talk:0,blink:0,shut:0,look:0,lookY:0,brow:"n",smile:0,laugh:0,sad:0,smirk:0,gasp:0,headRot:0,headY:0,
            hL:[-60,-130],hR:[60,-130],item:"",itemL:"",itemRot:0,itemRotL:0,wink:0,walk:0,lany:1,specSwing:0,tear:0,phoneGlow:0};
  const SH=[[-82,-270],[82,-270]];
  function draw(){
    const k=st; g.setAttribute("transform",`translate(${k.x},${k.y-k.hop}) rotate(${k.rot}) scale(${k.s*k.flip},${k.s})`); g.style.opacity=k.vis; g.style.display=k.vis>0?"":"none";
    if(!k.vis) return;
    const ht=`translate(${k.look*3},${-392+k.headY}) rotate(${k.headRot})`; head.setAttribute("transform",ht); hairBack.setAttribute("transform",ht);
    face.setAttribute("transform",`translate(${k.look*7},${k.lookY*3})`);
    legs.forEach((L,i)=>L.setAttribute("transform",`rotate(${(i?1:-1)*k.walk*14} 0 -10)`));
    if(specG) specG.setAttribute("transform",`rotate(${k.specSwing} 0 -300)`);
    if(o._phone) o._phone.setAttribute("fill",k.phoneGlow?"#80CBC4":"#1A1A1A");
    if(o._lany) o._lany.style.opacity=k.lany; if(o._bd) o._bd.setAttribute("transform",`translate(0,-122) scale(${k.flip},1)`);
    [[AL,SH[0],k.hL,-1],[AR,SH[1],k.hR,1]].forEach(([A,S,T,side])=>{const [e,h]=ik(S[0],S[1],T[0],T[1],118,112,side);
      A.up.setAttribute("x1",S[0]);A.up.setAttribute("y1",S[1]);A.up.setAttribute("x2",e[0]);A.up.setAttribute("y2",e[1]);
      A.lo.setAttribute("x1",e[0]);A.lo.setAttribute("y1",e[1]);A.lo.setAttribute("x2",h[0]);A.lo.setAttribute("y2",h[1]);
      const m=[lerp(e[0],h[0],0.25),lerp(e[1],h[1],0.25)], m2=[lerp(e[0],h[0],0.8),lerp(e[1],h[1],0.8)];
      if(A.cuff){A.cuff.setAttribute("cx",m[0]);A.cuff.setAttribute("cy",m[1])}
      const seg=(ln,a,b)=>{ln.setAttribute("x1",lerp(e[0],h[0],a));ln.setAttribute("y1",lerp(e[1],h[1],a));ln.setAttribute("x2",lerp(e[0],h[0],b));ln.setAttribute("y2",lerp(e[1],h[1],b))};
      if(A.wr) seg(A.wr,0.56,1); if(A.tan) seg(A.tan,0.66,0.84);
      if(A.bang){A.bang.setAttribute("cx",m2[0]);A.bang.setAttribute("cy",m2[1])}
      A.hand.setAttribute("cx",h[0]);A.hand.setAttribute("cy",h[1]); A.h=h});
    itemG.setAttribute("transform",`translate(${AR.h[0]},${AR.h[1]}) rotate(${k.itemRot})`); for(const n in items) items[n].style.opacity=k.item===n?1:0;
    itemGL.setAttribute("transform",`translate(${AL.h[0]},${AL.h[1]}) rotate(${k.itemRotL})`); for(const n in itemsL) itemsL[n].style.opacity=k.itemL===n?1:0;
    const o_=k.talk, quiet=o_<0.12;
    mouthO.setAttribute("ry",2+12*o_); mouthO.setAttribute("rx",11+5*o_); mouthO.style.opacity=quiet?0:1;
    const ex=quiet&&(k.laugh||k.gasp);
    laugh.style.opacity=quiet&&k.laugh?1:0; gasp.style.opacity=quiet&&k.gasp&&!k.laugh?1:0;
    lips.style.opacity=quiet&&!k.smile&&!k.sad&&!k.smirk&&!ex?1:0; smile.style.opacity=quiet&&k.smile&&!ex?1:0; sad.style.opacity=quiet&&k.sad&&!k.smile&&!ex?1:0; smirk.style.opacity=quiet&&k.smirk&&!k.smile&&!ex?1:0;
    tear.style.opacity=k.tear?1:0; tear.setAttribute("transform",`translate(${21+k.look*4.5},${4+k.tear*22})`);
    eyes.forEach((E,i)=>{const closed=k.blink||k.shut||(k.wink&&i===1); E.cover.style.opacity=closed?1:0; E.shut.style.opacity=closed?1:0; E.lid.style.opacity=closed?0:1;
      E.w.setAttribute("ry",closed?1:8+(k.brow==="u"?2:0)+(k.gasp?2:0)); [E.ir,E.pu].forEach(p=>{p.setAttribute("cx",k.look*4.5);p.setAttribute("cy",k.lookY*3)}); E.hl.setAttribute("cx",k.look*4.5-2.5);E.hl.setAttribute("cy",k.lookY*3-2.5);
      [E.ir,E.pu,E.hl].forEach(p=>p.style.opacity=closed?0:1);
      E.lid.setAttribute("d",k.sad?"M-13 -1 Q0 -9 13 -4":"M-13 -3 Q0 -11 13 -3")});
    brows.forEach((b,i)=>{const s=i?1:-1; const B={n:[-27,-29],u:[-34,-36],s:[-24,-30],a:[-30,-22],q:i?[-37,-35]:[-26,-27],w:[-27,-33]}[k.brow]||[-27,-29];
      b.setAttribute("d",`M${s*8} ${B[0]} Q${s*20} ${(B[0]+B[1])/2-4} ${s*33} ${B[1]}`)});
  }
  function aim(side,wx,wy){const lx=(wx-st.x)/(st.s*st.flip), ly=(wy-(st.y-st.hop))/st.s; if(side==="L") st.hL=[lx,ly]; else st.hR=[lx,ly]}
  function hand(side){const h=(side==="L"?st.hL:st.hR); return [st.x+h[0]*st.s*st.flip, st.y-st.hop+h[1]*st.s]}
  return {st,draw,g,aim,hand};
}

function makeChar(o){
  const g=el("g",{},o.parent), body=el("g",{},g);
  el("rect",{x:-62,y:-175,width:124,height:60,rx:16,fill:o.shorts},body);
  el("rect",{x:-62,y:-300,width:124,height:150,rx:36,fill:o.shirt},body);
  const armL=el("line",{stroke:o.skin,"stroke-width":26,"stroke-linecap":"round"},body),armR=el("line",{stroke:o.skin,"stroke-width":26,"stroke-linecap":"round"},body);
  const handItem=el("g",{},body), items={};
  const head=el("g",{},body);
  [[-90,-470],[-55,-505],[-15,-520],[25,-518],[62,-500],[92,-468],[-100,-430],[100,-430]].forEach(([x,y])=>el("circle",{cx:x,cy:y,r:30,fill:o.hair},head));
  el("circle",{cx:0,cy:-400,r:105,fill:o.skin},head);
  el("path",{d:"M-105 -410 Q-100 -520 0 -515 Q100 -520 105 -410 Q60 -470 0 -455 Q-60 -470 -105 -410Z",fill:o.hair},head);
  el("circle",{cx:-60,cy:-365,r:16,fill:"#FF8A80",opacity:.45},head);el("circle",{cx:60,cy:-365,r:16,fill:"#FF8A80",opacity:.45},head);
  const eyeW=[-36,36].map(x=>el("ellipse",{cx:x,cy:-405,rx:21,ry:25,fill:"#fff"},head));
  const pup=[-36,36].map(x=>el("circle",{cx:x,cy:-402,r:11,fill:"#1b1b1b"},head));
  const lids=[-36,36].map(x=>el("path",{d:`M${x-22} -404 Q${x} -390 ${x+22} -404`,stroke:"#3a2a1a","stroke-width":7,fill:"none","stroke-linecap":"round",opacity:0},head));
  const brow=[-1,1].map(s=>el("line",{stroke:"#3a2a1a","stroke-width":9,"stroke-linecap":"round"},head));
  const mouth=el("ellipse",{cx:0,cy:-345,rx:20,ry:4,fill:"#7A1F1F"},head);
  const smile=el("path",{d:"M-34 -356 Q0 -318 34 -356",stroke:"#B23A3A","stroke-width":8,fill:"none","stroke-linecap":"round",opacity:0},head);
  const gl=el("g",{},head);[-38,38].forEach(x=>el("circle",{cx:x,cy:-405,r:33,fill:"rgba(255,255,255,.12)",stroke:"#455A64","stroke-width":9},gl));el("line",{x1:-6,y1:-410,x2:6,y2:-410,stroke:"#455A64","stroke-width":7},gl);
  items.point=el("g",{},handItem);txt("👉",{x:14,y:-6,"font-size":70,"text-anchor":"middle","dominant-baseline":"central"},items.point);
  const st={x:0,y:0,s:1,armL:200,armR:160,lenL:115,lenR:115,talk:0,brow:"n",look:0,lookY:0,blink:0,wink:0,hop:0,item:"",itemRot:0,smile:0,headRot:0};
  function draw(){const k=st; g.setAttribute("transform",`translate(${k.x},${k.y-k.hop}) scale(${k.s})`);
    head.setAttribute("transform",`rotate(${k.headRot} 0 -300)`);
    [[armL,-58,k.armL,k.lenL],[armR,58,k.armR,k.lenR]].forEach(([a,sx,deg,len])=>{const r=deg*Math.PI/180;a.setAttribute("x1",sx);a.setAttribute("y1",-280);a.setAttribute("x2",sx+Math.sin(r)*len);a.setAttribute("y2",-280-Math.cos(r)*len)});
    const r=k.armR*Math.PI/180; handItem.setAttribute("transform",`translate(${58+Math.sin(r)*(k.lenR+3)},${-280-Math.cos(r)*(k.lenR+3)}) rotate(${k.itemRot})`);
    for(const n in items) items[n].style.opacity=k.item===n?1:0;
    const open=k.talk, quiet=open<0.15;
    mouth.setAttribute("ry",3+22*open); mouth.setAttribute("rx",18+6*open); mouth.style.opacity=quiet&&k.smile?0:1; smile.style.opacity=k.smile&&quiet?1:0;
    eyeW.forEach((e,i)=>{const c=k.blink||(k.wink&&i===1); e.setAttribute("ry",c?2:25); lids[i].style.opacity=c?1:0; pup[i].style.opacity=c?0:1; pup[i].setAttribute("cx",(i?36:-36)+k.look*8); pup[i].setAttribute("cy",-402+k.lookY*8)});
    brow.forEach((b,i)=>{const s=i?1:-1,B={u:[-470,-462],n:[-440,-440],q:i?[-468,-462]:[-436,-440]}[k.brow];b.setAttribute("x1",s*14);b.setAttribute("y1",B[0]);b.setAttribute("x2",s*58);b.setAttribute("y2",B[1])});
  }
  return {st,draw};
}

let TL;
function talkOf(who,t){for(const l of TL.lines){if(l.who!==who)continue;const f=Math.floor((t-l.start)*TL.fps);if(f>=0&&f<l.env.length)return l.env[f]}return 0}
function curLine(t){return TL.lines.find(l=>t>=l.start-0.1&&t<l.start+l.dur+0.25)}
const S=i=>TL.lines[i].start, E=i=>TL.lines[i].start+TL.lines[i].dur, D=i=>TL.lines[i].dur;
const _segs={};
function segsOf(i){if(!_segs[i]){const l=TL.lines[i],e=l.env.concat([0,0,0,0,0,0]);let segs=[],on=null,low=0;
  e.forEach((v,f)=>{if(v>0.1){if(on===null)on=f;low=0}else{low++;if(on!==null&&low>=4){segs.push([l.start+on/30,l.start+(f-low+1)/30]);on=null}}}); _segs[i]=segs} return _segs[i]}
function at(i,word,nth=0){const tx=TL.lines[i].spoken||TL.lines[i].text; let k=-1; for(let n=0;n<=nth;n++){k=tx.indexOf(word,k+1); if(k<0) throw new Error("word "+word+" in "+i)}
  const segs=segsOf(i); if(!segs.length) return S(i)+D(i)*k/tx.length;
  const tot=segs.reduce((a,[s,e])=>a+e-s,0); let tgt=tot*k/tx.length;
  let est=segs[segs.length-1][1]; for(const [s,e] of segs){if(tgt<=e-s+1e-6){est=s+tgt;break} tgt-=e-s}
  return est}

// ======================================================================================================================
const $=id=>document.getElementById(id);
const CB=[["Ravi","A — అమ్మకి తెలియాలి",60,1250],["Sneha","B — చెల్లిని కాపాడు",560,1250],["Teja","B 🤝",60,1400],["Priya","A 💯",560,1400]];   // equal A/B, no hint
$("cbs").innerHTML=CB.map(([n,g,x,y],i)=>`<div class="cb" id="cb${i}" style="left:${x}px;top:${y}px"><b style="color:${["#1E6FD9","#C2185B","#2E7D32","#7E3FBF"][i]}">${n}</b><i>${g}</i></div>`).join("");
$("ibar").innerHTML="<i></i>".repeat(10);
{let h=""; for(let d=0;d<36;d++) h+=`<i class="${d===16||d===17?"m":""}">${d<5?"":d-4}</i>`; $("calg").innerHTML=h}   // Mon-first grid: 1 Aug 2026 is a Saturday (5 blanks); 12 + 13 circled
{let sh=[]; for(let k=0;k<70;k++) sh.push(`${Math.round(hash(k)*1074)}px ${Math.round(hash(k+99)*1914)}px 0 ${hash(k+7)>0.8?2:0}px ${hash(k+3)>0.5?"#9FD6FF":"#FFE28A"}`); $("stars").style.boxShadow=sh.join(",")}

// ---------- defs + camera ----------
const defs=el("defs",{});
const cam=el("g",{});
applySkin(cam, defs);
const W=el("g",{id:"world"},cam);
const CT=1180, HX=3000, FLH=1450, DSK=1180, DX=6000, DT=1180, WX=9000;
const GOLD="#F2B53A", GOLDD="#B07A12", RED="#D32F2F";
const NIKHIL_OPT={skin:"#C98B5E",hair:"#1C1410",shirt:"#45454D",collar:"#3A3A42",stubble:"#5A3A28",brow:6.5,lip:"#7A3A30"};   // tools/anim2d/cast.md
const NIK={...NIKHIL_OPT,wrist:true,tan:"#EBCFAE"};   // this reel: bare wrists, pale watch tan line on his left wrist (every frame)
const SAROJA_OPT={skin:"#C68C62",hair:"#2A1E1A",shirt:"#1F6E5A",saree:{base:"#B0204A",pallu:"#C2185B",border:"#F2B53A"},sleeve:"#1F6E5A",fore:"#C68C62",bun:true,bindi:true,earrings:true,specChain:true,lines:true,brow:4.5,lash:4,blush:0.3,lip:"#9A3040"};   // Amma (15/16/24 Nov)
const KEERTHI_OPT={skin:"#C9926A",hair:"#1E1410",shirt:"#E0A419",trim:"#8C3B12",kurta:true,braid:true,tie:"#C62828",dupatta:"#A3243B",dupDot:"#FFE28A",sleeve:"#E0A419",fore:"#C9926A",cuff:"#8C3B12",
                   earrings:true,earCol:"#E0E0E0",brow:4.2,lash:4,blush:0.32,lip:"#B0485A"};   // Keerthi, 22 (NEW): mustard cotton kurti, maroon dotted dupatta, loose side braid, silver studs
const NARASIMHA_OPT={skin:"#B07A55",hair:"#E6E6E6",bald:"#ECECEC",shirt:"#F4F4EE",collar:"#E2E2D8",button:"#C9C9C0",sleeve:"#F4F4EE",fore:"#B07A55",pen:"#1E4FB3",lowSpecs:"#4E342E",lines:true,
                     brow:5.5,browCol:"#DADADA",lip:"#7A3A30",blush:0.1};   // Narasimha, ~65 (NEW): balding, white side hair, reading specs low on his nose, white half-sleeve shirt, pen in the pocket
const LEGS_N={pant:"#2B3240",shoe:"#1A1A1A"}, LEGS_K={pant:"#3D5A8C",shoe:"#8D6E63"};

// ---------- props ----------
function makeChainLie(p){   // Amma's chain laid out: a thin gold loop + small round pendant with a red stone (chunky enough for the pixel filter)
  const g=el("g",{},p);
  el("ellipse",{cx:0,cy:-6,rx:62,ry:26,fill:"none",stroke:"#5A3A06","stroke-width":13},g);
  el("ellipse",{cx:0,cy:-6,rx:62,ry:26,fill:"none",stroke:GOLD,"stroke-width":7},g);
  el("circle",{cx:0,cy:26,r:17,fill:GOLD,stroke:"#5A3A06","stroke-width":5},g); el("circle",{cx:0,cy:26,r:8,fill:RED},g);
  return g}
function makeChainHang(p){   // the same chain held up from one hand (origin = the fingers)
  const g=el("g",{},p);
  el("path",{d:"M-16 0 Q-28 64 0 92 Q28 64 16 0",fill:"none",stroke:"#5A3A06","stroke-width":13,"stroke-linecap":"round"},g);
  el("path",{d:"M-16 0 Q-28 64 0 92 Q28 64 16 0",fill:"none",stroke:GOLD,"stroke-width":7,"stroke-linecap":"round"},g);
  el("circle",{cx:0,cy:106,r:17,fill:GOLD,stroke:"#5A3A06","stroke-width":5},g); el("circle",{cx:0,cy:106,r:8,fill:RED},g);
  return g}
function makeToken(p){ const g=el("g",{},p); el("rect",{x:-75,y:-35,width:150,height:70,fill:"#F7A8C4",stroke:"#7A2948","stroke-width":4},g); el("circle",{cx:-60,cy:-22,r:5,fill:"#7A2948"},g); return g}
function makeReceipt(p){   // folded white hospital slip with a red '+'
  const g=el("g",{},p); el("rect",{x:-30,y:-38,width:60,height:76,fill:"#FFFFFF",stroke:"#5A5A5A","stroke-width":3},g);
  el("rect",{x:-6,y:-26,width:12,height:30,fill:RED},g); el("rect",{x:-15,y:-17,width:30,height:12,fill:RED},g);
  [12,22].forEach(y=>el("rect",{x:-20,y,width:40,height:4,fill:"#9E9E9E"},g)); return g}

// ===== SHOP: an old pawn + jewellery counter, Dilsukhnagar (x -200..1700) =====
const SH=el("g",{},W);
el("rect",{x:-600,y:-600,width:2600,height:2800,fill:"#3F7D73"},SH);
el("rect",{x:-600,y:1000,width:2600,height:700,fill:"#2F5E57"},SH);
el("rect",{x:-600,y:990,width:2600,height:14,fill:"#24493F"},SH);
el("rect",{x:-600,y:1580,width:2600,height:800,fill:"#6D4C41"},SH);
// window to the street (grille), the green street sign = HTML #sign
el("rect",{x:240,y:300,width:420,height:350,fill:"#9FD0E8",stroke:"#5D4037","stroke-width":14},SH);
el("rect",{x:254,y:520,width:392,height:116,fill:"#B7A28C"},SH);
[[262,430,90],[372,400,110],[500,450,80],[580,420,70]].forEach(([x,y,w])=>el("rect",{x,y,width:w,height:640-y,fill:"#C9B8A6",stroke:"#8D7B69","stroke-width":3},SH));
el("rect",{x:440,y:440,width:12,height:200,fill:"#5A5A5A"},SH);   // the sign's post
for(let x=270;x<660;x+=46) el("rect",{x,y:300,width:8,height:350,fill:"#4E342E",opacity:.85},SH);
el("rect",{x:240,y:470,width:420,height:8,fill:"#4E342E",opacity:.85},SH);
// shelves + small boxes, the old iron safe, a plain wall clock (no numbers)
[[760,560],[760,700]].forEach(([x,y])=>{el("rect",{x,y,width:420,height:14,fill:"#8D6E63",stroke:"#3E2723","stroke-width":3},SH);
  for(let k=0;k<6;k++) el("rect",{x:x+14+k*68,y:y-46-(k%2)*10,width:52,height:46+(k%2)*10,fill:["#B71C1C","#1E4FB3","#6A1B9A","#B71C1C","#00695C","#1E4FB3"][k],stroke:"#3E2723","stroke-width":3},SH)});
el("rect",{x:1250,y:760,width:220,height:430,fill:"#2E4A3A",stroke:"#14241B","stroke-width":8},SH);
el("rect",{x:1270,y:780,width:180,height:390,fill:"none",stroke:"#4C6B58","stroke-width":5},SH);
el("circle",{cx:1360,cy:960,r:34,fill:"#B0BEC5",stroke:"#14241B","stroke-width":6},SH); el("rect",{x:1354,y:930,width:12,height:60,fill:"#14241B"},SH);
el("circle",{cx:1330,cy:470,r:56,fill:"#FFFDF4",stroke:"#3E2723","stroke-width":8},SH); el("path",{d:"M1330 470 L1330 432 M1330 470 L1358 482",stroke:"#3E2723","stroke-width":6,"stroke-linecap":"round"},SH);
const shopBack=el("g",{},W);              // Narasimha behind the counter
const counterG=el("g",{},W);
el("rect",{x:180,y:CT,width:1340,height:26,fill:"#D7E3E8",stroke:INK,"stroke-width":5},counterG);
el("rect",{x:190,y:CT+26,width:1320,height:380,fill:"#5D4037",stroke:INK,"stroke-width":5},counterG);
el("rect",{x:214,y:CT+46,width:1272,height:200,fill:"#BFE2EA",stroke:"#3E2723","stroke-width":4},counterG);
el("rect",{x:214,y:CT+196,width:1272,height:50,fill:"#8E1B2E"},counterG);
for(let k=0;k<12;k++){const x=270+k*104; el("ellipse",{cx:x,cy:CT+178,rx:30,ry:12,fill:"none",stroke:GOLD,"stroke-width":7},counterG); el("ellipse",{cx:x,cy:CT+166,rx:30,ry:12,fill:"none",stroke:GOLD,"stroke-width":7},counterG)}
for(let k=0;k<6;k++) el("rect",{x:214+k*212,y:CT+46,width:6,height:200,fill:"#FFFFFF",opacity:.6},counterG);
// brass scale + ledger on the counter
{const s=el("g",{transform:`translate(1420,${CT})`},counterG);
 el("rect",{x:-40,y:-14,width:80,height:14,fill:"#C9A227",stroke:INK,"stroke-width":3},s); el("rect",{x:-5,y:-120,width:10,height:108,fill:"#C9A227",stroke:INK,"stroke-width":3},s);
 el("rect",{x:-70,y:-126,width:140,height:8,fill:"#C9A227",stroke:INK,"stroke-width":3},s);
 [-62,62].forEach(x=>{el("path",{d:`M${x} -118 L${x-18} -60 M${x} -118 L${x+18} -60`,stroke:"#7A6A2A","stroke-width":2},s); el("path",{d:`M${x-26} -60 Q${x} -44 ${x+26} -60 Z`,fill:"#D4AF37",stroke:INK,"stroke-width":3},s)})}
const ledger=el("g",{transform:`translate(1150,${CT})`},counterG);
el("path",{d:"M-110 -6 L0 -14 L110 -6 L110 0 L-110 0 Z",fill:"#7B1E2B",stroke:INK,"stroke-width":3},ledger);
el("path",{d:"M-104 -8 L0 -16 L0 -2 L-104 -2 Z",fill:"#FFFDF4",stroke:INK,"stroke-width":2},ledger); el("path",{d:"M104 -8 L0 -16 L0 -2 L104 -2 Z",fill:"#FFFDF4",stroke:INK,"stroke-width":2},ledger);
const shopProps=el("g",{},W);
const TRAY=el("g",{},shopProps);
el("rect",{x:-170,y:-30,width:340,height:30,fill:"#B0BEC5",stroke:INK,"stroke-width":4},TRAY);
el("rect",{x:-170,y:-30,width:340,height:8,fill:"#ECEFF1"},TRAY);
const watchPk=el("g",{transform:"translate(-90,-30)"},TRAY);
el("path",{d:"M-46 0 L-38 -48 Q0 -60 38 -48 L46 0 Z",fill:"#3F6FB5",stroke:INK,"stroke-width":4,"stroke-linejoin":"round"},watchPk);
el("path",{d:"M-16 -52 Q0 -72 16 -52",fill:"none",stroke:"#E0C080","stroke-width":5},watchPk);
el("circle",{cx:0,cy:-24,r:12,fill:"none",stroke:"#9FC4F0","stroke-width":4,opacity:.8},watchPk);
const chainPk=el("g",{transform:"translate(70,-30)"},TRAY);
el("path",{d:"M-84 0 L-74 -24 L74 -24 L84 0 Z",fill:"#B71C1C",stroke:INK,"stroke-width":4,"stroke-linejoin":"round"},chainPk);
const trayChain=makeChainLie(chainPk); trayChain.setAttribute("transform","translate(0,-44) scale(0.95)");
const tokK=makeToken(chainPk); tokK.setAttribute("transform","translate(0,-130)");
el("line",{x1:-60,y1:-148,x2:-50,y2:-40,stroke:"#7A2948","stroke-width":3},chainPk);
const notTag=el("g",{},TRAY); el("rect",{x:-150,y:-104,width:120,height:26,fill:"#B3261E",stroke:INK,"stroke-width":3},notTag);
const tokNG=makeToken(shopProps);          // Nikhil's own pledge token (slid across the counter)
const shopFront=el("g",{},W);
const chainH=makeChainHang(W);             // the chain in someone's hand (any scene)

// ===== HOME (HX..): hall wall calendar + pill box, the steel bureau (inner locker), laundry, the doorway, Keerthi's study corner =====
const HM=el("g",{},W);
el("rect",{x:HX-700,y:-600,width:3600,height:2800,fill:"#EFD3A8"},HM);
el("rect",{x:HX-700,y:FLH-10,width:3600,height:900,fill:"#C79F7B"},HM);
for(let x=HX-700;x<HX+2900;x+=90) el("line",{x1:x,y1:FLH,x2:x,y2:FLH+900,stroke:"#A9825F","stroke-width":3},HM);
for(let y=FLH+60;y<FLH+900;y+=70) el("line",{x1:HX-700,y1:y,x2:HX+2900,y2:y,stroke:"#A9825F","stroke-width":3},HM);
el("rect",{x:HX-700,y:FLH-24,width:3600,height:16,fill:"#9C6B4A"},HM);
// calendar (face = HTML #cal) on a nail
el("line",{x1:HX+210,y1:440,x2:HX+150,y2:472,stroke:"#5D4037","stroke-width":2},HM); el("line",{x1:HX+210,y1:440,x2:HX+270,y2:472,stroke:"#5D4037","stroke-width":2},HM);
el("rect",{x:HX+75,y:450,width:270,height:340,fill:"#FFFDF4",stroke:"#6B5A44","stroke-width":4},HM); el("rect",{x:HX+75,y:450,width:270,height:44,fill:"#C0392B"},HM);
// side table + the weekly pill box + a steel tumbler
el("rect",{x:HX+70,y:1150,width:280,height:20,fill:"#8D6E63",stroke:INK,"stroke-width":4},HM);
[HX+86,HX+320].forEach(x=>el("rect",{x,y:1170,width:16,height:280,fill:"#6D4C41",stroke:INK,"stroke-width":3},HM));
for(let k=0;k<7;k++) el("rect",{x:HX+110+k*26,y:1124,width:24,height:26,fill:["#E53935","#FB8C00","#FDD835","#43A047","#1E88E5","#8E24AA","#EC407A"][k],stroke:INK,"stroke-width":2},HM);
el("rect",{x:HX+300,y:1092,width:30,height:58,fill:"#CFD8DC",stroke:INK,"stroke-width":3},HM);
// the steel bureau (closed / open with the inner locker)
const BUR=el("g",{},HM);
el("rect",{x:HX+360,y:420,width:150,height:120,fill:"#7B5E57",stroke:INK,"stroke-width":4},BUR);   // suitcase on top
el("rect",{x:HX+380,y:540,width:310,height:910,fill:"#9EA7AD",stroke:INK,"stroke-width":6},BUR);
const burIn=el("g",{},BUR);   // the inside (shown when open)
el("rect",{x:HX+392,y:552,width:286,height:886,fill:"#6E7B82"},burIn);
[760,940,1120].forEach(y=>el("rect",{x:HX+392,y,width:286,height:10,fill:"#B0BEC5",stroke:INK,"stroke-width":2},burIn));
[[HX+400,680,"#C2185B"],[HX+470,690,"#1E88E5"],[HX+400,870,"#43A047"],[HX+470,880,"#FB8C00"],[HX+400,1060,"#8E24AA"]].forEach(([x,y,c])=>el("rect",{x,y,width:62,height:760-680-((y-680)%180===0?0:10),fill:c,stroke:INK,"stroke-width":2},burIn));
el("rect",{x:HX+550,y:830,width:118,height:110,fill:"#4E5A60",stroke:INK,"stroke-width":4},burIn);   // the inner locker
el("rect",{x:HX+562,y:850,width:94,height:80,fill:"#2B3236"},burIn);
el("path",{d:`M${HX+580} 930 L${HX+584} 880 Q${HX+609} 870 ${HX+634} 880 L${HX+638} 930 Z`,fill:"#B71C1C",stroke:INK,"stroke-width":3},burIn);   // the red jewel pouch
const burDoorsOpen=el("g",{},burIn);
el("path",{d:`M${HX+380} 540 L${HX+330} 580 L${HX+330} 1410 L${HX+380} 1450 Z`,fill:"#AEB7BD",stroke:INK,"stroke-width":5},burDoorsOpen);
el("path",{d:`M${HX+690} 540 L${HX+740} 580 L${HX+740} 1410 L${HX+690} 1450 Z`,fill:"#AEB7BD",stroke:INK,"stroke-width":5},burDoorsOpen);
el("path",{d:`M${HX+668} 830 L${HX+700} 846 L${HX+700} 954 L${HX+668} 940 Z`,fill:"#5F6B71",stroke:INK,"stroke-width":3},burDoorsOpen);   // locker door ajar
const burDoors=el("g",{},BUR);   // closed
el("rect",{x:HX+380,y:540,width:155,height:910,fill:"#A7B0B6",stroke:INK,"stroke-width":6},burDoors);
el("rect",{x:HX+535,y:540,width:155,height:910,fill:"#A7B0B6",stroke:INK,"stroke-width":6},burDoors);
[HX+520,HX+550].forEach(x=>el("rect",{x,y:880,width:8,height:110,rx:3,fill:"#ECEFF1",stroke:INK,"stroke-width":2},burDoors));
el("rect",{x:HX+590,y:950,width:46,height:64,fill:"#CFD8DC",stroke:INK,"stroke-width":3},burDoors);   // the locker's key plate
el("circle",{cx:HX+613,cy:974,r:6,fill:INK},burDoors); el("rect",{x:HX+610,y:976,width:6,height:16,fill:INK},burDoors);
[HX+400,HX+555].forEach(x=>el("rect",{x,y:560,width:14,height:870,fill:"#FFFFFF",opacity:.35},burDoors));
// laundry stool
el("rect",{x:HX+950,y:1300,width:150,height:16,fill:"#1E88E5",stroke:INK,"stroke-width":3},HM);
[HX+960,HX+1076].forEach(x=>el("rect",{x,y:1316,width:14,height:134,fill:"#1565C0",stroke:INK,"stroke-width":2},HM));
[["#FFFFFF",0],["#F48FB1",24],["#90CAF9",46],["#FFF59D",68]].forEach(([c,k])=>el("rect",{x:HX+960+(k%3)*3,y:1276-k,width:130,height:24,fill:c,stroke:INK,"stroke-width":3},HM));
// doorway
el("rect",{x:HX+1150,y:500,width:200,height:950,fill:"#4A3B33"},HM);
el("rect",{x:HX+1136,y:486,width:228,height:964,fill:"none",stroke:"#8D6E63","stroke-width":24},HM);
// study board (fee slip = HTML #fee) + desk + lamp + books + the college bag
el("rect",{x:HX+1440,y:470,width:340,height:300,fill:"#C8A165",stroke:"#6D4C41","stroke-width":12},HM);
[[HX+1460,490,90,70,"#FFF59D"],[HX+1690,500,74,92,"#B3E5FC"],[HX+1466,690,110,60,"#F8BBD0"],[HX+1690,640,70,100,"#FFFFFF"]].forEach(([x,y,w,h,c])=>el("rect",{x,y,width:w,height:h,fill:c,stroke:"#8D7B69","stroke-width":2},HM));
el("rect",{x:HX+1480,y:566,width:260,height:112,fill:"#FFFFFF",stroke:"#2E7D32","stroke-width":4},HM);
const deskBack=el("g",{},W);              // Keerthi seated at her desk
const deskG=el("g",{},W);
el("rect",{x:HX+1420,y:DSK,width:580,height:26,fill:"#D7B98E",stroke:INK,"stroke-width":5},deskG);
el("rect",{x:HX+1432,y:DSK+26,width:556,height:FLH+40-DSK-26,fill:"#A1887F",stroke:INK,"stroke-width":5},deskG);
el("rect",{x:HX+1450,y:DSK+60,width:200,height:90,fill:"#8D6E63",stroke:INK,"stroke-width":3},deskG); el("rect",{x:HX+1530,y:DSK+98,width:40,height:10,fill:"#D7CCC8"},deskG);
{const l=el("g",{transform:`translate(${HX+1480},${DSK})`},deskG); el("rect",{x:-30,y:-10,width:60,height:10,fill:"#455A64",stroke:INK,"stroke-width":3},l);
 el("path",{d:"M0 -10 L-6 -110 L40 -150",stroke:"#455A64","stroke-width":8,fill:"none"},l); el("path",{d:"M20 -170 L70 -150 L52 -118 Z",fill:"#FFB74D",stroke:INK,"stroke-width":3},l)}
[["#1E88E5",0],["#E53935",18],["#43A047",36]].forEach(([c,k])=>el("rect",{x:HX+1760,y:DSK-18-k,width:110,height:18,fill:c,stroke:INK,"stroke-width":3},deskG));
const bag=el("g",{transform:`translate(${HX+1920},${DSK})`},deskG);   // canvas college bag, generic ID lanyard, the receipt corner
el("path",{d:"M-62 0 L-56 -96 L56 -96 L62 0 Z",fill:"#C9B58C",stroke:INK,"stroke-width":4,"stroke-linejoin":"round"},bag);
el("path",{d:"M-40 -96 Q0 -170 40 -96",fill:"none",stroke:"#8D7B5A","stroke-width":10},bag);
el("rect",{x:-56,y:-72,width:112,height:26,fill:"#B8A47A",stroke:INK,"stroke-width":3},bag);
el("path",{d:"M-30 -60 L-36 10",stroke:"#1E4FB3","stroke-width":5},bag); el("rect",{x:-50,y:4,width:30,height:40,fill:"#FFFFFF",stroke:INK,"stroke-width":2},bag);
const bagRc=el("g",{transform:"translate(22,-102) rotate(12)"},bag);   // the corner of the folded hospital receipt
el("rect",{x:-16,y:-26,width:32,height:40,fill:"#FFFFFF",stroke:"#5A5A5A","stroke-width":3},bagRc); el("rect",{x:-3,y:-20,width:6,height:16,fill:RED},bagRc); el("rect",{x:-8,y:-15,width:16,height:6,fill:RED},bagRc);
const homeMid=el("g",{},W);                // Amma at the bureau, Nikhil in the doorway
const homeFront=el("g",{},W);              // corridor: Nikhil + Keerthi standing (and the flashback at the bureau)
const towel=el("g",{},W); el("rect",{x:-62,y:-20,width:124,height:40,fill:"#FFFFFF",stroke:INK,"stroke-width":3},towel); el("rect",{x:-62,y:6,width:124,height:6,fill:"#E57373"},towel);
const rcptH=makeReceipt(W);                // the receipt in Keerthi's hand / on the dining table

// ===== DINING (DX..): the table, three seated =====
const DN=el("g",{},W);
el("rect",{x:DX-700,y:-600,width:2600,height:2800,fill:"#EFD3A8"},DN);
el("rect",{x:DX-700,y:FLH-10,width:2600,height:900,fill:"#C79F7B"},DN);
el("rect",{x:DX+360,y:380,width:380,height:400,fill:"#BFE3F5",stroke:"#6D4C41","stroke-width":14},DN);
el("rect",{x:DX+543,y:380,width:14,height:400,fill:"#6D4C41"},DN);
el("path",{d:`M${DX+330} 360 L${DX+430} 360 Q${DX+400} 600 ${DX+440} 800 L${DX+330} 800 Z`,fill:"#C2185B",opacity:.85},DN);
el("path",{d:`M${DX+770} 360 L${DX+670} 360 Q${DX+700} 600 ${DX+660} 800 L${DX+770} 800 Z`,fill:"#C2185B",opacity:.85},DN);
el("circle",{cx:DX+930,cy:520,r:50,fill:"#FFFDF4",stroke:"#3E2723","stroke-width":8},DN); el("path",{d:`M${DX+930} 520 L${DX+930} 486 M${DX+930} 520 L${DX+954} 530`,stroke:"#3E2723","stroke-width":6},DN);
el("rect",{x:DX+90,y:470,width:180,height:130,fill:"#A5D6A7",stroke:"#6D4C41","stroke-width":10},DN); el("path",{d:`M${DX+100} 590 L${DX+160} 520 L${DX+200} 560 L${DX+230} 530 L${DX+262} 590 Z`,fill:"#558B2F"},DN);
const dineBack=el("g",{},W);
[DX+250,DX+550,DX+850].forEach(x=>{el("rect",{x:x-90,y:900,width:180,height:300,fill:"#8D6E63",stroke:INK,"stroke-width":5},dineBack); el("rect",{x:x-70,y:920,width:140,height:40,fill:"#A1887F"},dineBack)});
const dinePeople=el("g",{},dineBack);
const tableG=el("g",{},W);
el("rect",{x:DX+40,y:DT,width:1020,height:26,fill:"#D7B98E",stroke:INK,"stroke-width":5},tableG);
el("rect",{x:DX+50,y:DT+26,width:1000,height:300,fill:"#E8F0F2",stroke:INK,"stroke-width":5},tableG);
for(let x=DX+80;x<DX+1050;x+=50) el("rect",{x,y:DT+26,width:14,height:300,fill:"#90CAF9",opacity:.6},tableG);
[DX+150,DX+950].forEach(x=>el("path",{d:`M${x-20} ${DT} L${x-24} ${DT-64} L${x+24} ${DT-64} L${x+20} ${DT} Z`,fill:"#CFD8DC",stroke:INK,"stroke-width":3},tableG));
const tableProps=el("g",{},W);
const chainT=makeChainLie(tableProps);

// ===== WARD (WX..): a hospital bed (flashback, no names) =====
const WD=el("g",{},W);
el("rect",{x:WX-700,y:-600,width:2600,height:2800,fill:"#7FB3A0"},WD);
el("rect",{x:WX-700,y:FLH-10,width:2600,height:900,fill:"#B0BEC5"},WD);
el("rect",{x:WX+580,y:380,width:340,height:330,fill:"#E3F2FD",stroke:"#78909C","stroke-width":12},WD);
for(let y=400;y<700;y+=26) el("rect",{x:WX+592,y,width:316,height:10,fill:"#B0BEC5"},WD);
el("rect",{x:WX+960,y:620,width:12,height:830,fill:"#90A4AE",stroke:INK,"stroke-width":2},WD); el("rect",{x:WX+930,y:640,width:70,height:96,rx:10,fill:"#E1F5FE",stroke:INK,"stroke-width":3},WD);
el("path",{d:`M${WX+966} 736 Q${WX+900} 900 ${WX+760} 1110`,stroke:"#B0BEC5","stroke-width":4,fill:"none"},WD);
el("rect",{x:WX+60,y:640,width:200,height:140,fill:"#263238",stroke:INK,"stroke-width":5},WD); el("path",{d:`M${WX+70} 720 L${WX+120} 720 L${WX+135} 680 L${WX+155} 760 L${WX+170} 720 L${WX+250} 720`,stroke:"#69F0AE","stroke-width":5,fill:"none"},WD);
const wardBed=el("g",{},W);
el("rect",{x:WX+100,y:1180,width:820,height:40,fill:"#ECEFF1",stroke:INK,"stroke-width":5},wardBed);
[WX+110,WX+900].forEach(x=>el("rect",{x,y:1220,width:16,height:230,fill:"#90A4AE",stroke:INK,"stroke-width":3},wardBed));
el("rect",{x:WX+90,y:1000,width:20,height:220,fill:"#90A4AE",stroke:INK,"stroke-width":3},wardBed);
el("rect",{x:WX+120,y:1110,width:200,height:76,rx:30,fill:"#FFFFFF",stroke:INK,"stroke-width":4},wardBed);   // pillow
const wardPeople=el("g",{},W);
const blanket=el("g",{},W);
el("path",{d:`M${WX+290} 1196 Q${WX+286} 1060 ${WX+420} 1050 L${WX+916} 1070 L${WX+916} 1212 L${WX+290} 1212 Z`,fill:"#3F6FB5",stroke:INK,"stroke-width":6},blanket);
el("rect",{x:WX+300,y:1120,width:610,height:18,fill:"#9FC4F0"},blanket); el("path",{d:`M${WX+290} 1100 Q${WX+330} 1060 ${WX+420} 1050`,stroke:"#FFFFFF","stroke-width":16,fill:"none"},blanket);

// ---------- the cast ----------
const NKC=makeAdult({...NIK,legs:LEGS_N,parent:shopFront});          // at the counter
const NAR=makeAdult({...NARASIMHA_OPT,parent:shopBack});            // behind the counter
const AMS=makeAdult({...SAROJA_OPT,floor:"#8D6E63",parent:homeMid}); // folding laundry by the bureau
const NKD=makeAdult({...NIK,legs:LEGS_N,parent:homeMid});           // in the doorway
const KTD=makeAdult({...KEERTHI_OPT,parent:deskBack});              // seated at her desk
const NKS=makeAdult({...NIK,legs:LEGS_N,parent:homeFront});         // corridor
const KTS=makeAdult({...KEERTHI_OPT,legs:LEGS_K,parent:homeFront}); // corridor / the bureau (flashback)
const AMH=makeAdult({...SAROJA_OPT,parent:wardPeople});             // in the hospital bed (flashback)
const KTT=makeAdult({...KEERTHI_OPT,parent:dinePeople});            // dining table
const NKT=makeAdult({...NIK,parent:dinePeople});
const AMD=makeAdult({...SAROJA_OPT,parent:dinePeople});
// chain/receipt/token/towel render on top of everything in the world
[tokNG,chainH,towel,rcptH].forEach(g=>W.appendChild(g));

// ---------- narrator Gopi (square pixel badge, screen space) ----------
const badge=el("g",{},nar);
el("rect",{x:-128,y:-128,width:256,height:256,fill:"#F5B700",stroke:INK,"stroke-width":8},badge);
const ndefs=el("defs",{},nar); const clp=el("clipPath",{id:"badgeClip"},ndefs); el("rect",{x:-114,y:-114,width:228,height:228},clp);
const badgeIn=el("g",{filter:"url(#skin-pixel)"},badge);
el("rect",{x:-114,y:-114,width:228,height:228,fill:"#7B2FF7"},badgeIn);
const gopiG=el("g",{"clip-path":"url(#badgeClip)"},badgeIn);
const GOPI=makeChar({parent:gopiG,skin:"#C68A55",hair:"#3B2A20",shirt:"#FB8C00",shorts:"#1E88E5"});

// ---------- timeline ----------
const COLORS={gopi:"#F5B700",nikhil:"#C9C3F2",narasimha:"#E0E0E0",amma:"#F48FB1",keerthi:"#FFD54F"},
      NAMES={gopi:"GOPI",nikhil:"NIKHIL",narasimha:"NARASIMHA",amma:"AMMA",keerthi:"KEERTHI"};
let B=null;
function beats(){ if(B) return B; B={};
  B.tok0=0.1; B.tok1=0.75; B.tray0=0.3; B.tray1=0.95; B.punch=at(0,"అమ్మ")-0.06; B.titleIn=1.0; B.title1=S(1)+0.35;
  B.pull=S(1)-0.15; B.vaddi=at(1,"వడ్డీ"); B.int0=B.vaddi-0.1; B.ans0=B.title1+0.05; B.ans1=E(1)+0.25; B.tap1=at(1,"పెట్టింది");
  B.home=S(2)-0.7; B.pat=at(2,"locker")-0.05; B.pan2=E(2)-0.3; B.frz=E(2)-0.05; B.game0=S(3)-0.45;
  B.curA=S(3)+0.05; B.curB=at(3,"బీ")-0.05; B.hop0=E(3)+0.25; B.fol0=at(4,"follow")-0.9; B.tFol=at(4,"follow")+0.12; B.fol1=E(4)+0.3;
  B.CD0=E(4)+0.1; B.CD1=B.CD0+TL.countdown; B.cb=CB.map((_,i)=>B.CD0+0.35+i*1.05);
  B.hops=[]; for(let x=B.hop0;x<B.CD1-0.2;x+=0.5) B.hops.push(x);
  B.pick=B.CD1+0.05; B.shop2=B.CD1+0.55; B.drain0=B.shop2+0.15; B.drain1=B.drain0+0.8; B.lift=B.shop2+0.35; B.hand=B.shop2+0.95; B.notR=B.shop2+0.75;
  B.corr=S(5)-0.1; B.rc0=S(6)-0.35; B.fbA=at(6,"hospital")-0.1; B.fbB=at(6,"call")-0.1; B.now1=E(6)+0.12; B.mK=B.now1+0.45;
  B.fbC=at(7,"నేనూ")-0.12; B.now2=E(7)-0.2; B.dine=S(8)-0.6; B.lay=B.dine+0.15; B.rule=at(8,"ఎవరూ")-0.1;
  B.chuck=S(9)-0.05; B.tapW=at(9,"watch")-0.12; B.inset0=at(9,"watch")+0.12; B.inset1=E(9)+0.8; B.scr=B.inset0+0.25; B.laugh=E(9)+0.35;
  B.ck0=E(9)+0.62; B.sh0=S(10)+0.2; B.ck1=B.sh0; B.tTag=at(10,"Tag")-0.05; B.end0=E(10)+0.08; B.tEF=B.end0+0.55; B.loop0=TL.dur-1.5;
  return B}

const focus=(z,wx,wy,sx=540,sy=1000)=>({z,fx:wx-(sx-540)/z,fy:wy-(sy-1000)/z});
const mixCam=(a,b_,k)=>({z:lerp(a.z,b_.z,k),fx:lerp(a.fx,b_.fx,k),fy:lerp(a.fy,b_.fy,k)});
let curSkin=""; function skinTo(s){ if(s!==curSkin){ setSkin(s); curSkin=s } }
const SUBS={0:"చెల్లి పేరు మీద...<br>అమ్మ chain?!",1:"Keerthi పెట్టింది బాబూ... ₹38,000.<br>వడ్డీ పెరుగుతోంది.",2:"Keerthi పెళ్ళికి ఆ chain...<br>locker లో భద్రం.",
  3:"A: అమ్మకి చెప్పాలా?<br>B: గుట్టుగా విడిపించాలా?",4:"మీరైతే A or B?<br>Comment చేయండి... follow కొట్టండి!",5:"Chain విడిపించా.<br>ఎందుకు పెట్టావ్ Keerthi?",
  6:"అమ్మ hospital bill అన్నయ్యా...<br>call నాకే వచ్చింది.",7:"అమ్మ మనిద్దరికీ చెప్పలేదు...<br>నేనూ చెప్పలేకపోయా.",8:"ఇక మీద ఈ ఇంట్లో...<br>ఎవరూ ఏదీ దాచకూడదు.",
  9:"సరే నాన్నా...<br>మరి నీ watch ఎక్కడ?",10:"ఇలా గుట్టుగా కాపాడే<br>sibling ఉన్నారా? Tag చేయండి!"};
const TRX=800;   // the tray's spot on the counter

function frame(t){
  const b=beats();
  const loop=t>=b.loop0;
  const tf=loop?0:t;
  let sc;
  if(loop||t<b.home) sc="shop"; else if(t<b.game0) sc="home"; else if(t<b.shop2) sc="game"; else if(t<b.corr) sc="shop2";
  else if(t<b.fbA) sc="corr"; else if(t<b.fbB) sc="ward"; else if(t<b.now1) sc="call"; else if(t<b.fbC) sc="corr"; else if(t<b.now2) sc="locker"; else if(t<b.dine) sc="corr"; else sc="dine";
  if(sc==="game") sc="shop";   // the world behind the opaque game screen
  const fb=!loop&&(sc==="ward"||sc==="call"||sc==="locker");
  skinTo("pixel");
  $("s").style.filter=fb?"sepia(.85) saturate(.95) brightness(1.03) contrast(1.02)":"none"; document.body.classList.toggle("fb",fb);
  const reset=(C,who,x,y,s)=>Object.assign(C.st,{x,y,s,talk:who&&!loop?talkOf(who,t):0,blink:(((tf*0.6+x*0.0013)%3.3)<0.11?1:0),shut:0,look:0,lookY:0,brow:"n",smile:0,laugh:0,sad:0,smirk:0,gasp:0,
    headRot:0,headY:0,hop:0,rot:0,item:"",itemL:"",itemRot:0,itemRotL:0,vis:0,flip:1,wink:0,walk:0,lany:1,specSwing:0,tear:0,phoneGlow:0,hL:[-62,-66],hR:[62,-66]});
  let chainAt=null, chainVis=0, rcAt=null, tokNAt=null, towelAt=null;

  // ---------------- SHOP (frame 1, L0-L1, the reveal, the loop) ----------------
  const nk=NKC.st; reset(NKC,"nikhil",400,1720-448*1.08,1.08);
  const nr=NAR.st; reset(NAR,"narasimha",1000,CT+40,0.95);
  let trx=TRX, chainInTray=1, notOn=0;
  if(sc==="shop"||sc==="shop2"){
    nk.vis=1; nr.vis=1; nk.look=0.7; nk.lookY=0.4; nr.look=-0.6; nr.lookY=0.5;
    if(sc==="shop"){
      // he slides his own WATCH token across (bare wrist, tan line); Narasimha pulls the tray in
      const k=ease((tf-b.tok0)/(b.tok1-b.tok0)); const tx=lerp(470,545,k); tokNAt=[tx,CT-37]; NKC.aim("R",tx-28,CT-84);   // fingers on the top edge: the bare wrist + tan line stay in view
      trx=lerp(960,TRX,out((tf-b.tray0)/(b.tray1-b.tray0))); NAR.aim("L",trx+175,CT-20); NAR.aim("R",1130,CT-40);
      if(tf>=b.punch-0.5){ nk.gasp=1; nk.brow="u"; nk.look=0.9; nk.lookY=0.6 }
      if(tf>=S(0)+0.9&&tf<b.pull){ nk.gasp=0; nk.sad=1; nk.brow="w"; nk.headRot=-3 }
      if(!loop&&t>=b.pull){ nk.gasp=0; nk.sad=0; nk.brow="w"; nk.look=0.8; nk.lookY=0.1; nr.look=-0.8; nr.lookY=0.1; NAR.aim("L",TRX+170,CT-20);
        const tp=t>=b.vaddi&&t<b.vaddi+0.6?Math.abs(Math.sin((t-b.vaddi)*16))*14:0; NAR.aim("R",1120,CT-20-tp);   // taps the ledger on 'వడ్డీ'
        if(t>=b.tap1&&t<b.vaddi) { nr.brow="u"; nr.lookY=-0.2 } if(t>=b.vaddi){ nr.sad=1; nr.brow="w" } nk.headRot=-4 }
      if(loop){ nk.gasp=0; nk.brow="n"; nk.look=0.7; nk.lookY=0.6 }
    } else {
      // NEXT MORNING: Narasimha lifts the chain out and hands it over; the watch packet stays (NOT REDEEMED)
      tokNAt=null; chainInTray=0; nk.look=0.7; nk.lookY=0.2; nk.brow="n"; nr.look=-0.7;
      const lk=ease((t-b.lift)/0.3), hk=ease((t-b.hand+0.45)/0.45);
      const p0=[TRX+70,CT-80], p1=[TRX-40,CT-150], p2=[560,CT-170];
      const cx=t<b.hand-0.45?lerp(p0[0],p1[0],lk):lerp(p1[0],p2[0],hk), cy=t<b.hand-0.45?lerp(p0[1],p1[1],lk):lerp(p1[1],p2[1],hk);
      if(t>=b.lift){ chainAt=[cx,cy]; chainVis=1; NAR.aim("L",cx,cy); nr.lookY=0.3 } else { chainInTray=1; NAR.aim("L",TRX+170,CT-20) }
      NAR.aim("R",1120,CT-24);
      NKC.aim("R",t>=b.hand-0.3?cx:500,t>=b.hand-0.3?cy:CT-60); if(t>=b.hand){ nk.smile=0; nk.brow="w"; nr.look=-0.9 }
      notOn=t>=b.notR?1:0;
    }
  }
  NKC.draw(); NAR.draw();
  TRAY.setAttribute("transform",`translate(${trx},${CT})`); TRAY.style.display=sc==="shop"||sc==="shop2"?"":"none";
  trayChain.style.display=chainInTray?"":"none"; tokK.style.display=chainInTray?"":"none"; notTag.style.opacity=notOn;

  // ---------------- HOME (L2): Amma folds laundry + pats the locker; Nikhil in the doorway; Keerthi freezes ----------------
  const am=AMS.st; reset(AMS,"amma",HX+840,1720-448*1.05,1.05);
  const nd=NKD.st; reset(NKD,"nikhil",HX+1240,1720-448*1.08,1.08);
  const kd=KTD.st; reset(KTD,"keerthi",HX+1650,DSK+60,0.95);
  if(sc==="home"){
    am.vis=1; nd.vis=1; kd.vis=1; am.smile=1; am.look=-0.3; am.lookY=0.5; am.brow="n";
    const fold=Math.sin(t*3.2)*10; towelAt=[HX+840,1100+fold]; AMS.aim("L",HX+780,1102+fold); AMS.aim("R",HX+900,1102+fold);
    if(t>=b.pat-0.25){ const k=ease((t-b.pat+0.25)/0.25); const pt=t>=b.pat?Math.abs(Math.sin((t-b.pat)*12))*10*Math.exp(-(t-b.pat)*2):0; AMS.aim("L",lerp(HX+780,HX+640,k)-pt,lerp(1102,990,k)); am.look=-0.8; am.lookY=0; am.smile=1; am.brow="u";
      towelAt=[HX+880,1100]; AMS.aim("R",HX+900,1102) }
    nd.look=-0.7; nd.lookY=0.2; nd.brow="w"; NKD.aim("L",HX+1240-70,1236-20); NKD.aim("R",HX+1240+62,1236-60);   // hand on his pocket
    if(t>=b.pan2-0.2){ nd.look=0.6 }
    kd.look=-0.2; kd.lookY=0.8; KTD.aim("L",HX+1600,DSK-12+Math.sin(t*9)*4); KTD.aim("R",HX+1700,DSK-14);   // writing
    if(t>=b.frz){ kd.look=-0.8; kd.lookY=0; kd.gasp=1; kd.brow="u"; KTD.aim("L",HX+1600,DSK-12); kd.headRot=-4 }   // freezes on 'locker'
  }
  if(sc==="call"){   // flashback 14 AUG: the balance call comes to Keerthi at her desk
    kd.vis=1; kd.itemL="phone"; kd.hL=[-56,-380]; kd.look=0.5; kd.lookY=-0.1; kd.gasp=t<b.fbB+0.5?0:1; kd.brow="u"; kd.headRot=5; KTD.aim("R",HX+1700,DSK-14)
  }
  AMS.draw(); NKD.draw(); KTD.draw();
  // bureau doors: open only in the locker flashback
  burDoors.style.display=sc==="locker"?"none":""; burIn.style.display=sc==="locker"?"":"none";
  bagRc.style.display=(t<b.rc0||loop)?"":"none";

  // ---------------- CORRIDOR (L5-L7) + the bureau flashback ----------------
  const ns=NKS.st; reset(NKS,"nikhil",HX+1410,1720-448*1.08,1.08);
  const ks=KTS.st; reset(KTS,"keerthi",HX+1770,1720-448*1.0,1.0);
  if(sc==="corr"){
    ns.vis=1; ks.vis=1; ns.look=0.7; ns.lookY=0.15; ns.brow="w"; ks.look=-0.6; ks.lookY=0.3;
    const out_=ease((t-b.corr)/0.45); const hx=lerp(HX+1470,HX+1580,out_), hy=lerp(1150,1010,out_);
    NKS.aim("R",hx,hy); chainAt=[hx,hy+8]; chainVis=1; NKS.aim("L",HX+1410-66,1236-60);
    ks.brow="w"; ks.sad=1; ks.headRot=-4;
    if(t>=at(5,"ఎందుకు")) { ns.sad=1; ns.brow="w" }
    // she pulls the folded receipt out of her bag
    if(t>=b.rc0){ const k=ease((t-b.rc0)/0.45); rcAt=[lerp(HX+1940,HX+1660,k),lerp(DSK-110,1020,k)]; KTS.aim("R",rcAt[0]+6,rcAt[1]+24); ks.look=k<0.5?0.8:-0.5; ks.lookY=0.5;
      if(t>=b.now1){ chainVis=1; ks.look=-0.6; ks.lookY=0.9; ks.tear=1; ks.sad=1 } }
    if(t>=b.now2){ ks.look=-0.2; ks.lookY=1; ks.sad=1; ks.tear=1; ns.sad=1; ns.brow="w"; ns.look=0.6; ns.lookY=0.4; NKS.aim("R",HX+1540,1080) ; chainAt=[HX+1540,1088] }
  }
  if(sc==="locker"){   // flashback 14 AUG: Keerthi opens the bureau's inner locker and takes the chain
    ks.vis=1; ks.x=HX+800; ks.look=-0.9; ks.lookY=0.2; ks.brow="w"; ks.sad=1; ks.headRot=-6;
    const k=ease((t-b.fbC-0.15)/0.5); const hx=lerp(HX+610,HX+700,k), hy=lerp(900,930,k); KTS.aim("L",hx,hy); chainAt=[hx,hy+10]; chainVis=k>0.05?1:0; KTS.aim("R",HX+800+60,1272-80)
  }
  NKS.draw(); KTS.draw();

  // ---------------- WARD (flashback 12-13 AUG) ----------------
  const ah=AMH.st; reset(AMH,"",WX+600,1150,0.9); ah.rot=-90; ah.hL=[-30,-150]; ah.hR=[30,-150]; ah.vis=sc==="ward"?1:0; ah.shut=1; ah.headRot=0; ah.sad=1; AMH.draw();
  blanket.style.display=sc==="ward"?"":"none";

  // ---------------- DINING (L8-L9) ----------------
  const kt=KTT.st; reset(KTT,"keerthi",DX+250,DT+60,0.95);
  const nt=NKT.st; reset(NKT,"nikhil",DX+550,DT+60,0.95);
  const ad=AMD.st; reset(AMD,"amma",DX+850,DT+60,0.95);
  let chainTon=0, rcTon=0;
  if(sc==="dine"){
    kt.vis=nt.vis=ad.vis=1;
    kt.look=0.6; kt.lookY=0.8; kt.sad=1; kt.brow="w";
    nt.look=0; nt.lookY=0.1; nt.brow="n"; ad.look=-0.6; ad.lookY=0.3; ad.brow="n";
    // he lays the chain + the receipt down
    const k=ease((t-b.lay)/0.4);
    NKT.aim("L",lerp(DX+500,DX+470,k),lerp(1060,DT-10,k)); NKT.aim("R",lerp(DX+600,DX+640,k),lerp(1060,DT-10,k));
    if(k<1){ chainAt=[lerp(DX+500,DX+470,k),lerp(1060,DT-30,k)]; chainVis=1; rcAt=[lerp(DX+620,DX+735,k),lerp(1060,DT-34,k)] } else { chainTon=1; rcTon=1 }
    if(t>=b.lay+0.3){ ad.look=-0.5; ad.lookY=0.9; ad.gasp=t<b.lay+0.9?1:0; ad.brow="u"; if(t>=b.lay+0.9){ ad.sad=1; ad.brow="w" } }   // she sees the receipt: caught
    if(t>=at(8,"ఎవరూ")){ nt.look=t%1.2<0.6?-0.5:0.5; nt.brow="n" }
    if(t>=b.chuck){ ad.sad=0; ad.gasp=0; ad.smile=1; ad.brow="q"; ad.look=-0.6; ad.lookY=0.4; ad.headRot=-5; nt.look=0.6; nt.brow="u"; nt.lookY=0.1; kt.look=0.8; kt.lookY=0.3; kt.sad=0 }
    if(t>=b.tapW){ const k2=ease((t-b.tapW)/0.25); const tp=t>=b.tapW+0.25&&t<b.tapW+0.8?Math.abs(Math.sin((t-b.tapW)*14))*8:0; AMD.aim("L",lerp(DX+780,DX+655,k2),lerp(1100,DT-24,k2)-tp); ad.lookY=0.8 }   // taps his bare wrist
    if(t>=b.inset0){ kt.gasp=1; kt.brow="u"; kt.look=0.8; kt.lookY=0 }
    if(t>=b.scr){ nt.smile=1; nt.brow="w"; nt.look=-0.5; nt.lookY=0.3; nt.headRot=6; NKT.aim("L",DX+550-40,DT+60-330*0.95) }   // scratches his neck, caught
    if(t>=b.laugh){ ad.laugh=1; kt.laugh=1; kt.gasp=0; nt.laugh=1; [ad,kt,nt].forEach((c,i)=>{c.hop=Math.abs(Math.sin(t*12+i))*5; c.headRot=Math.sin(t*9+i)*4}); AMD.aim("L",DX+790,1080) }
  }
  KTT.draw(); NKT.draw(); AMD.draw();
  chainT.style.display=chainTon?"":"none"; chainT.setAttribute("transform",`translate(${DX+470},${DT-8}) scale(0.9,0.55)`);

  // hand-held props
  chainH.style.display=chainVis&&chainAt&&!loop?"":"none"; if(chainAt) chainH.setAttribute("transform",`translate(${chainAt[0]},${chainAt[1]}) rotate(${Math.sin(t*3)*6})`);
  rcptH.style.display=(rcAt||rcTon)&&!loop?"":"none"; if(rcTon) rcptH.setAttribute("transform",`translate(${DX+735},${DT-36}) rotate(-8)`); else if(rcAt) rcptH.setAttribute("transform",`translate(${rcAt[0]},${rcAt[1]}) rotate(-6)`);
  tokNG.style.display=tokNAt?"":"none"; if(tokNAt) tokNG.setAttribute("transform",`translate(${tokNAt[0]},${tokNAt[1]})`);
  towel.style.display=towelAt?"":"none"; if(towelAt) towel.setAttribute("transform",`translate(${towelAt[0]},${towelAt[1]})`);

  // ---------------- Gopi (square pixel badge) ----------------
  const g=GOPI.st;
  const nIn=(i,pre=0.15,post=0.2)=>t>S(i)-pre&&t<E(i)+post;
  const narOn=!loop&&(nIn(3,0.2,0.05)||nIn(4,0.05,0.2)||nIn(10,0.15,0.1));
  const narT=t>S(10)-0.15?S(10)-0.15:S(3)-0.2;
  let BX=880, BY=1370, bsc=0.8;
  Object.assign(g,{x:0,y:400*0.55+12,s:0.55,talk:talkOf("gopi",t),blink:((t*0.7)%3.1)<0.12?1:0,wink:0,look:-0.5,lookY:0,brow:"n",smile:0,headRot:Math.sin(t*2.2)*3,item:"",armL:200,armR:160,lenL:115,lenR:115,hop:0,itemRot:0});
  if(t>S(3)&&t<E(3)){ g.brow="q"; g.look=-0.6; g.lookY=-0.3 }
  if(t>=at(3,"బీ")&&t<E(3)){ g.wink=1 }
  if(t>=S(4)&&t<E(4)+0.2){ g.brow="u"; g.smile=1 }
  if(t>=b.fol0&&t<b.fol1){ g.armR=40; g.item="point"; g.itemRot=-30; g.look=-0.7; g.lookY=0.5 }
  if(t>S(10)){ g.smile=1; g.brow="q" }
  GOPI.draw();
  const bs=narOn?Math.max(0.001,back((t-narT)/0.35)):0;
  badge.setAttribute("transform",`translate(${BX},${BY}) scale(${bs*bsc}) rotate(${Math.sin(t*2)*1.5})`); badge.style.opacity=narOn?1:0;

  // ---------------- camera ----------------
  const punch=(t0,a_=0.1)=>t>t0?a_*Math.exp(-(t-t0)*4)*clamp((t-t0)/0.06):0;
  const OPEN=focus(1.65+0.012*tf,650,1010);
  const shots=[
    [0,OPEN],
    [b.punch,focus(2.3+punch(b.punch,0.08),860,1080),0.18],                    // punch-in on 'KEERTHI — 14 AUG' + the red-stone chain
    [b.pull,focus(1.2,720,990),0.45],                                          // the counter: Nikhil | Narasimha + the ledger
    [b.home,focus(1.12+0.008*(t-b.home),HX+520,1000)],                         // CUT home: calendar, pill box, bureau, Amma
    [b.pan2,focus(1.1,HX+1620,1000),0.45],                                     // pan: Nikhil in the doorway, Keerthi freezes, bag + fee slip
    [b.game0,focus(1.2,720,990)],
    [b.shop2,focus(1.45+0.01*(t-b.shop2),700,1030)],                           // NEXT MORNING at the counter
    [b.corr,focus(1.15+0.006*(t-b.corr),HX+1620,1000)],                        // the corridor
    [b.fbA,focus(1.5+0.02*(t-b.fbA),WX+470,1080)],                                           // flashback: the ward
    [b.fbB,focus(1.4,HX+1660,960)],                                            // flashback: the call at her desk
    [b.now1,focus(1.2,HX+1620,1000)],
    [b.fbC,focus(1.5,HX+690,990)],                                            // flashback: the bureau locker
    [b.now2,focus(1.25+0.01*(t-b.now2),HX+1640,960)],
    [b.dine,focus(1.06+0.004*(t-b.dine),DX+550,1000)],                         // the dining table
    [b.chuck,focus(1.2,DX+700,1000),0.4],
    [b.tapW,focus(1.75,DX+640,1060),0.2],                                      // punch on his bare wrist (tan line)
    [b.laugh,focus(1.06,DX+550,1000),0.4],
  ];
  let cm=OPEN;
  if(!loop){ let i=0; while(i+1<shots.length&&t>=shots[i+1][0]) i++;
    const [t0,c,tr]=shots[i]; cm=c;
    if(i>0&&tr&&t<t0+tr){ const prev=shots[i-1][1]; cm=mixCam(prev,c,ease((t-t0)/tr)) } }
  let sx=0,sy=0; const shake=(t0,d,a_)=>{if(t>t0&&t<t0+d){const q=(1-(t-t0)/d)*a_; sx+=Math.sin(t*90)*q; sy+=Math.cos(t*77)*q}};
  if(!loop){ shake(b.punch,0.2,5); shake(b.frz,0.15,3) }
  cam.setAttribute("transform",`translate(${540+sx},${1000+sy}) scale(${cm.z}) translate(${-cm.fx},${-cm.fy})`);
  const scr=(wx,wy)=>[540+(wx-cm.fx)*cm.z+sx, 1000+(wy-cm.fy)*cm.z+sy];

  // ---------------- crisp world labels ----------------
  const gameOn=!loop&&t>=b.game0&&t<b.shop2;
  const wlab=(id,on,wx,wy,s=1,rot=0)=>{const e=$(id); if(!on||gameOn){e.style.opacity=0; return} const [px,py]=scr(wx,wy), z=cm.z*s, hw=e.offsetWidth*z/2, hh=e.offsetHeight*z/2;
    if(px-hw<4||px+hw>1076||py-hh<4||py+hh>1916){e.style.opacity=0; return} e.style.opacity=1; e.style.transform=`translate(${px-e.offsetWidth/2}px,${py-e.offsetHeight/2}px) scale(${z}) rotate(${rot}deg)`};
  const shopV=sc==="shop"||sc==="shop2";
  wlab("tokN",shopV&&!!tokNAt,tokNAt?tokNAt[0]:0,tokNAt?tokNAt[1]:0);
  wlab("tokK",shopV&&chainInTray,trx+70,CT-160);
  wlab("notR",shopV&&notOn,trx-90,CT-91);
  wlab("sign",shopV,450,470);
  const cardsOn=!loop&&t>=b.now1&&t<b.fbC;   // the match-cut cards sit over the board: no labels under them
  wlab("cal",(sc==="home"||sc==="corr"||sc==="locker")&&!cardsOn,HX+210,620);
  wlab("fee",(sc==="home"||sc==="corr"||sc==="call")&&!cardsOn,HX+1610,622);

  // ---------------- HTML overlays ----------------
  // hook (frame 1 + the loop), title a beat later, the HUD
  {const on=loop||t<b.pull; $("hook").style.opacity=on?(loop?1:clamp((b.pull-t)/0.15)):0; $("hook").style.transform=`rotate(${loop?-1:-1+Math.sin(t*3)*0.5}deg)`;
   const ti=$("title"), ton=!loop&&t>b.titleIn&&t<b.title1; ti.style.opacity=ton?clamp((b.title1-t)/0.12):0; ti.style.transform=`scale(${Math.max(0.01,back((t-b.titleIn)/0.4))})`}
  const hudOn=!(t>=b.sh0&&!loop); $("hud").style.opacity=hudOn?1:0;
  {const on=!loop&&t>=b.int0&&t<b.sh0; const im=$("imet"); im.style.opacity=on?1:0; im.style.transform=`scale(${Math.max(0.01,pop(t,b.int0,0.35))})`;
   const paid=t>=b.drain1; im.className=paid?"paid":""; const n=paid?10:Math.min(10,2+Math.floor((t-b.int0)/2.2));
   [...$("ibar").children].forEach((c,i)=>c.className=i<n?"on":""); $("iarr").textContent=paid?"PAID ✓":"▲"; $("iarr").style.transform=paid?"":`translateY(${Math.sin(t*8)*3}px)`}
  show("ans",!loop&&t>b.ans0&&t<b.ans1,pop(t,b.ans0,0.35),`rotate(-2deg)`); $("ans").style.top="1330px";
  // NEXT MORNING chip + SAVE FILE drain
  show("tchip",!loop&&t>=b.shop2&&t<b.corr,pop(t,b.shop2,0.3));
  {const on=!loop&&t>=b.shop2&&t<b.corr; $("save").style.opacity=on?1:0; $("save").style.top="330px"; $("save").style.transform=`scale(${Math.max(0.01,pop(t,b.shop2,0.3))})`;
   $("saveB").style.width=(100-62*ease((t-b.drain0)/(b.drain1-b.drain0)))+"%"}
  // flashback frame + date tab
  {$("fbf").style.opacity=fb?1:0; $("fbtab").style.opacity=fb?1:0; $("fbd").textContent=sc==="ward"?"12–13 AUG":"14 AUG";
   const t0=sc==="ward"?b.fbA:sc==="call"?b.fbB:b.fbC; $("fbtab").style.transform=`scale(${Math.max(0.01,pop(t,t0,0.3))})`}
  // match-cut: receipt 14 AUG = token 14 AUG (back in the corridor, after the call)
  {const on=!loop&&t>=b.now1&&t<b.fbC; const rc=$("rc"), kc=$("kc"), eq=$("eq1");
   rc.style.opacity=on?1:0; rc.style.left="70px"; rc.style.top="360px"; rc.style.transform=`scale(${Math.max(0.01,pop(t,b.now1,0.3))}) rotate(-3deg)`;
   kc.style.opacity=on&&t>=b.mK?1:0; kc.style.left="660px"; kc.style.top="420px"; kc.style.transform=`translateX(${(1-out((t-b.mK)/0.25))*300}px) rotate(3deg)`;
   eq.style.opacity=on&&t>=b.mK+0.2?1:0; eq.style.left="488px"; eq.style.top="470px"; eq.style.transform=`scale(${Math.max(0.01,pop(t,b.mK+0.2,0.3))})`}
  // the 02 SEP inset (his watch token = her fee slip)
  {const on=!loop&&t>=b.inset0&&t<b.inset1; const nc=$("nc"), fc=$("fc"), eq=$("eq2");
   nc.style.opacity=on?1:0; nc.style.left="60px"; nc.style.top="370px"; nc.style.transform=`scale(${Math.max(0.01,pop(t,b.inset0,0.3))}) rotate(-3deg)`;
   fc.style.opacity=on&&t>=b.inset0+0.2?1:0; fc.style.left="690px"; fc.style.top="370px"; fc.style.transform=`scale(${Math.max(0.01,pop(t,b.inset0+0.2,0.3))}) rotate(3deg)`;
   eq.style.opacity=on&&t>=b.inset0+0.35?1:0; eq.style.left="492px"; eq.style.top="425px"; eq.style.transform=`scale(${Math.max(0.01,pop(t,b.inset0+0.35,0.3))})`}
  show("rule",!loop&&t>=b.rule&&t<b.chuck,pop(t,b.rule,0.35),"rotate(-1.5deg)");
  show("ck",!loop&&t>=b.ck0&&t<b.ck1,pop(t,b.ck0,0.35),"rotate(-1.5deg)");
  // the CHOOSE A / B game screen
  {const on=gameOn; const gm=$("game"); gm.style.opacity=on?1:0;
   if(on){ const boot=clamp((t-b.game0)/0.3); gm.style.clipPath=`inset(${(1-boot)*50}% 0 ${(1-boot)*50}% 0)`;
     $("gt").style.transform=`translateY(${Math.sin(t*4)*4}px)`;
     let sel=-1; if(t>=b.curA) sel=0; if(t>=b.curB) sel=1; b.hops.forEach((h,i)=>{ if(t>=h) sel=i%2 }); if(t>=b.pick) sel=1;
     const cur=$("cur"); cur.style.opacity=sel<0?0:((t*2.5)%1<0.78||t>=b.pick?1:0.15); cur.style.top=(sel===1?810:520)+115-36+"px"; cur.style.transform=`translateX(${Math.sin(t*10)*5}px)`;
     $("oA").className="opt"; $("oB").className="opt"+(t>=b.pick?" sel":"");
     const pk=t>=b.pick?pop(t,b.pick,0.3):1; $("oB").style.transform=t>=b.pick?`scale(${1+0.04*Math.exp(-(t-b.pick)*5)})`:"";
     $("oA").style.opacity=t>=b.pick?0.45:1;
     const cdk=t-b.CD0, cdOn=t>=b.CD0&&t<b.CD1, sec=Math.floor(cdk), fr=cdk-sec;
     $("timer").style.opacity=cdOn?1:0; if(cdOn){ const n_=Math.max(1,TL.countdown-sec); $("digit").textContent=n_; $("digit").style.transform=`scale(${lerp(1.4,1,out(fr/0.2))})`; $("digit").style.color=n_<=1?"#FF7A59":"#FFE28A";
       [...$("blocks").children].forEach((c,i)=>c.className=i<n_?"":"off") }
     show("selT",t>=b.pick,pk) } }
  CB.forEach((_,i)=>{const e=$("cb"+i), t0=b.cb[i], k=pop(t,t0,0.3); const v=!loop&&t>t0&&t<b.CD1; e.style.opacity=v?clamp((b.CD1-t)/0.12):0;
    e.style.transform=`translateY(${-(t-t0)*8}px) scale(${Math.max(0.01,k)}) rotate(${(i%2?2:-2)}deg)`});
  // follow tap (end of L4)
  const fA=b.fol0, fB=b.fol1; const fOn=!loop&&t>fA&&t<fB; const fol=$("fol"); fol.style.opacity=fOn?clamp(Math.min((t-fA)/0.2,(fB-t)/0.12)):0; fol.style.left="110px";
  fol.style.transform=`scale(${Math.max(0.01,back((t-fA)/0.4))*(Math.abs(t-b.tFol)<0.1?0.9:1)})`;
  const bF=$("bF"); bF.textContent=t<b.tFol?"+ FOLLOW":"FOLLOWING ✓"; bF.className="btn"+(t<b.tFol?"":" done");
  {const hand=$("tapHand"); const hk=ease((t-fA-0.1)/Math.max(0.3,b.tFol-fA-0.2)); const dip=Math.max(0,1-Math.abs(t-b.tFol)/0.1);
   hand.style.opacity=fOn?clamp(Math.min((t-fA-0.05)/0.15,(fB-t)/0.12)):0; hand.style.transform=`translate(${lerp(900,640,hk)-50}px,${lerp(1700,1395,hk)+dip*12}px) rotate(${-8+dip*6}deg)`;
   const rg_=$("ring"), rk=(t-b.tFol)/0.45; rg_.style.opacity=fOn&&rk>0&&rk<1?1-rk:0; rg_.style.left="640px"; rg_.style.top="1395px"; rg_.style.transform=`scale(${1+rk*6})`}
  // the share card: tag your sibling
  {const shOn=!loop&&t>b.sh0&&t<b.end0+0.1; const sh=$("share"); sh.style.opacity=shOn?clamp(Math.min((t-b.sh0)/0.2,(b.end0+0.1-t)/0.15)):0;
   $("sq").style.transform=`scale(${Math.max(0.01,back((t-b.sh0)/0.4))})`;
   const tAt=b.sh0+0.5; $("cin").innerHTML=t>tAt?(t>b.tTag+0.1?'<em>@అన్నయ్య / చెల్లి 💛</em> నువ్వే నా hero 🤝':"@"+(t>tAt+0.3?"అ":"")):"";
   ["ct1","ct2"].forEach((id,i)=>{const e=$(id), t0=tAt+0.1+i*0.08; e.style.opacity=t>t0?1:0; e.style.transform=`translateY(${lerp(30,0,out((t-t0)/0.25))}px) scale(${id==="ct1"&&Math.abs(t-b.tTag)<0.1?0.94:1})`; e.style.background=id==="ct1"&&t>b.tTag?"#FFF3B0":"#fff"});
   $("ok1").style.opacity=t>b.tTag+0.1?1:0}
  // end card with the follow tap, then the SILENT hard cut to frame 1
  {const ec=$("endc"), eOn=!loop&&t>b.end0&&t<b.loop0; ec.style.opacity=eOn?clamp((t-b.end0)/0.12):0;
   $("eF").textContent=t<b.tEF?"FOLLOW @_REELRASAM":"FOLLOWING ✓  @_REELRASAM"; $("eF").style.transform=`scale(${Math.abs(t-b.tEF)<0.1?0.92:1})`; $("eF").style.background=t<b.tEF?"":"#6D6875";
   const eh=$("eHand"), ek=ease((t-b.end0)/Math.max(0.2,b.tEF-b.end0-0.05)), edip=Math.max(0,1-Math.abs(t-b.tEF)/0.1);
   eh.style.opacity=eOn&&t<b.tEF+0.4?1:0; eh.style.transform=`translate(${lerp(1010,900,ek)-50}px,${lerp(880,720,ek)+edip*12}px) scale(${1-0.1*edip}) rotate(-8deg)`}
  {show("loopT",loop,pop(t,b.loop0+0.15,0.3),"rotate(-1.5deg)"); $("loopT").style.top="1500px";
   const mk=(id,wx,wy,w,h)=>{const e=$(id); if(!loop){e.style.opacity=0;return} const [px,py]=scr(wx,wy); e.style.opacity=0.65+0.35*Math.sin(t*8); e.style.width=w*cm.z+"px"; e.style.height=h*cm.z+"px"; e.style.left=(px-w*cm.z/2)+"px"; e.style.top=(py-h*cm.z/2)+"px"};
   const wr=NKC.hand("R"); mk("mk1",tokNAt?tokNAt[0]:470,CT-37,180,96); mk("mk2",wr[0]+30,wr[1]-34,70,70)}
  // flashes on the hard cuts
  const fl=(t0,d,a_)=>t>t0&&t<t0+d?a_*(1-(t-t0)/d):0;
  $("flash").style.opacity=loop?0:(fl(b.home,0.12,0.3)+fl(b.shop2,0.12,0.3)+fl(b.fbA,0.14,0.45)+fl(b.fbB,0.1,0.3)+fl(b.now1,0.12,0.35)+fl(b.fbC,0.12,0.4)+fl(b.now2,0.1,0.3)+fl(b.dine,0.12,0.3));
  // subtitles (none in the silent loop or on the end card)
  const sub=$("sub"), L=curLine(t);
  if(!loop&&L&&!(t>b.end0)){sub.style.opacity=1; sub.innerHTML=`<span class="who" style="background:${COLORS[L.who]}">${NAMES[L.who]}</span><br>${SUBS[L.i]}`} else sub.style.opacity=0;
}
function show(id,on,s=1,extra=""){const e=$(id); e.style.opacity=on?1:0; if(on) e.style.transform=`${extra} scale(${Math.max(0.01,s)})`}

window.render=function(t){ frame(t) };
