// Office comedy "పది నిమిషాల లేట్!" — drawn world, cast and choreography (loaded by ep.html).
// makeAdult rig from 19 Nov "the junior's salary", with legs, messy hair, bald top + grey temples, paunch, tie, belt,
// untucked hem, backpack (+ straps), spread fingers (ten fingers), the plain white mug, the half-face helmet, a red angry
// flush, ear steam, and the blank "DONK" face (dot eyes, flat mouth, eye twitch) added.
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
// comment bubbles (L12): generic names, no real usernames
const CB=[["Ravi","😂😂😂","#1E88E5",70,1110],["Priya","Same here bro 💀","#D81B60",560,1190],["Teja","Literally my manager","#2E7D32",110,1290]];
$("cbs").innerHTML=CB.map(([n,g,c,x,y],i)=>`<div class="cb" id="cb${i}" style="left:${x}px;top:${y}px"><b style="color:${c}">${n}</b><i>${g}</i></div>`).join("");
// punch card words (typed in word by word; the ZWNJ forms stay inside one word)
const L1W="ఆఫీస్‌లో టైమ్‌కి విలువ ఉంటుంది...".split(" "), L2W="కానీ ఉద్యోగి టైమ్‌కి విలువ ఉండదు! 😂".split(" ");
$("l1").innerHTML=L1W.map((w,i)=>`<span class="w" id="w1_${i}">${w}</span>`).join(" ");
$("l2").innerHTML=L2W.map((w,i)=>`<span class="w" id="w2_${i}">${w}</span>`).join(" ");
// end-card clock ticks
{const g=$("eTicks"); for(let k=0;k<12;k++){const a=k*Math.PI/6; el("line",{x1:Math.sin(a)*70,y1:-Math.cos(a)*70,x2:Math.sin(a)*(k%3?78:76-10),y2:-Math.cos(a)*(k%3?78:76-10),stroke:INK,"stroke-width":k%3?4:7},g)}}

// ---------- defs + camera ----------
const defs=el("defs",{});
const cam=el("g",{});
applySkin(cam, defs);
const W=el("g",{id:"world"},cam);
const CB_=3600;                       // the cabin set's x offset
const SY=1275, SS=0.95;               // open office: standing hip, scale (feet ~1700)

// ===== OPEN OFFICE (x -600..1950): pale wall, wall clock + OFFICE TIME board, back row of cubicles, Ramesh's desk
// (front), the manager's glass cabin with the MANAGER door (right) =====
el("rect",{x:-900,y:-900,width:3200,height:2300,fill:"#EAF3F8"},W);
el("rect",{x:-900,y:1380,width:3200,height:22,fill:"#B7C6D3"},W);
el("rect",{x:-900,y:1402,width:3200,height:1400,fill:"#CDD7E0"},W);                          // floor
for(let k=0;k<14;k++) el("line",{x1:-900+k*260,y1:1402,x2:-1400+k*360,y2:2600,stroke:"#BCC8D3","stroke-width":5},W);
for(let y=1480;y<2400;y+=110) el("line",{x1:-900,y1:y,x2:2300,y2:y,stroke:"#BCC8D3","stroke-width":4},W);
// abstract wall art (no text)
el("rect",{x:-420,y:300,width:220,height:300,rx:8,fill:"#FFFFFF",stroke:"#5E6B78","stroke-width":8},W);
el("circle",{cx:-310,cy:410,r:60,fill:"#F5B347"},W); el("rect",{x:-390,y:480,width:160,height:70,fill:"#2D6CDF",opacity:.8},W);
// the big wall clock (hands animated) + the OFFICE TIME board
const CLX=330, CLY=470;
const clockG=el("g",{transform:`translate(${CLX},${CLY})`},W);
el("circle",{r:132,fill:"#10141E"},clockG); el("circle",{r:118,fill:"#FFFDF5"},clockG);
for(let k=0;k<60;k++){const a=k*Math.PI/30, r0=k%5?104:92; el("line",{x1:Math.sin(a)*r0,y1:-Math.cos(a)*r0,x2:Math.sin(a)*110,y2:-Math.cos(a)*110,stroke:INK,"stroke-width":k%5?3:8},clockG)}
[[12,0],[3,90],[6,180],[9,270]].forEach(([n,a])=>txt(String(n),{x:Math.sin(a*Math.PI/180)*74,y:-Math.cos(a*Math.PI/180)*74+13,"font-family":"Anton","font-size":38,"text-anchor":"middle",fill:INK},clockG));
const hHand=el("line",{x1:0,y1:10,x2:0,y2:-58,stroke:INK,"stroke-width":13,"stroke-linecap":"round"},clockG);
const mHand=el("line",{x1:0,y1:14,x2:0,y2:-90,stroke:INK,"stroke-width":9,"stroke-linecap":"round"},clockG);
const sHand=el("line",{x1:0,y1:20,x2:0,y2:-100,stroke:"#E53935","stroke-width":4,"stroke-linecap":"round"},clockG);
el("circle",{r:9,fill:"#E53935"},clockG);
const clkGlow=el("circle",{r:150,fill:"none",stroke:"#FFE066","stroke-width":16,opacity:0},clockG);
const board=el("g",{transform:"translate(700,470)"},W);
el("rect",{x:-180,y:-92,width:360,height:184,rx:16,fill:"#1F3B57",stroke:INK,"stroke-width":8},board);
txt("OFFICE TIME",{x:0,y:-22,"font-family":"Anton","font-size":46,"letter-spacing":3,"text-anchor":"middle",fill:"#FFE066"},board);
txt("10:00 AM",{x:0,y:58,"font-family":"Anton","font-size":72,"letter-spacing":3,"text-anchor":"middle",fill:"#FFFFFF"},board);
// back row of cubicles (partitions + plain monitors)
function cubicles(parent,x0,x1,top,bot,col,trim){
  for(let x=x0;x<x1;x+=250){ el("rect",{x:x+70,y:top-110,width:120,height:84,rx:6,fill:"#37474F",stroke:INK,"stroke-width":4},parent); el("rect",{x:x+80,y:top-100,width:100,height:62,rx:3,fill:"#90CAF9"},parent); el("rect",{x:x+120,y:top-26,width:20,height:26,fill:"#546E7A"},parent) }
  el("rect",{x:x0,y:top,width:x1-x0,height:bot-top,fill:col,stroke:INK,"stroke-width":5},parent);
  el("rect",{x:x0,y:top-8,width:x1-x0,height:16,rx:6,fill:trim,stroke:INK,"stroke-width":4},parent);
  for(let x=x0+250;x<x1;x+=250) el("rect",{x:x-5,y:top,width:10,height:bot-top,fill:trim},parent)}
cubicles(W,-700,1000,1140,1380,"#9FB4C7","#7F96AB");
// the manager's glass cabin + door (the plate is on the outside: readable, never mirrored)
el("rect",{x:1080,y:300,width:900,height:1080,fill:"#D3E9F2",stroke:"#56616C","stroke-width":14},W);
el("rect",{x:1500,y:1040,width:380,height:22,fill:"#B9A58A",stroke:"#7E6A50","stroke-width":3},W);               // his desk, far, through the glass
el("rect",{x:1600,y:880,width:12,height:160,fill:"#7E6A50"},W); el("circle",{cx:1606,cy:860,r:60,fill:"#81C784",opacity:.8},W);
[[1520,320,1460,1370],[1700,320,1640,1370],[1880,320,1820,1370]].forEach(([x1,y1,x2,y2])=>el("polygon",{points:`${x1},${y1} ${x1+30},${y1} ${x2+30},${y2} ${x2},${y2}`,fill:"#FFFFFF",opacity:.35},W));
const doorG=el("g",{transform:"translate(1180,0)"},W);
const doorP=el("g",{},doorG);
el("rect",{x:0,y:430,width:270,height:950,fill:"#C3E2EE",stroke:"#56616C","stroke-width":12},doorP);
el("rect",{x:0,y:640,width:270,height:40,fill:"#FFFFFF",opacity:.6},doorP);
el("rect",{x:226,y:860,width:14,height:110,rx:5,fill:"#90A4AE",stroke:INK,"stroke-width":3},doorP);
el("rect",{x:40,y:500,width:190,height:62,rx:8,fill:"#FFFDF5",stroke:"#3F5A86","stroke-width":5},doorP);
txt("MANAGER",{x:135,y:545,"font-family":"Anton","font-size":38,"letter-spacing":2,"text-anchor":"middle",fill:"#3F5A86"},doorP);
// LATE! burst behind the manager (DHOOM)
const lateG=el("g",{},W);
{const pts=[]; for(let k=0;k<24;k++){const r=k%2?150:250, a=k*Math.PI/12; pts.push(`${(Math.cos(a)*r).toFixed(0)},${(Math.sin(a)*r*0.8).toFixed(0)}`)}
 el("polygon",{points:pts.join(" "),fill:"#E53935",stroke:INK,"stroke-width":8,"stroke-linejoin":"round"},lateG);
 txt("LATE!",{x:0,y:30,"font-family":"Anton","font-size":96,"letter-spacing":4,"text-anchor":"middle",fill:"#FFFFFF",stroke:INK,"stroke-width":4,"paint-order":"stroke"},lateG)}
const oPeople=el("g",{},W);
// Ramesh's desk (front row, Scene 2): plain monitor back, his helmet, his backpack
const rDesk=el("g",{},W);
const RDX=470, RDY=1450;
el("rect",{x:RDX+90,y:RDY-170,width:200,height:150,rx:10,fill:"#455A64",stroke:INK,"stroke-width":5},rDesk);    // monitor back (plain)
el("rect",{x:RDX+170,y:RDY-22,width:40,height:24,fill:"#37474F",stroke:INK,"stroke-width":4},rDesk);
const deskHelmet=el("g",{transform:`translate(${RDX-200},${RDY-4})`},rDesk);
const deskPack=el("g",{transform:`translate(${RDX-330},${RDY-4})`},rDesk);
const rDeskFront=el("g",{},W);
el("rect",{x:RDX-420,y:RDY-6,width:840,height:26,rx:6,fill:"#E9C9A0",stroke:INK,"stroke-width":5},rDeskFront);
el("rect",{x:RDX-400,y:RDY+20,width:800,height:520,fill:"#C9A57A",stroke:INK,"stroke-width":5},rDeskFront);
el("rect",{x:RDX-380,y:RDY+50,width:240,height:110,rx:6,fill:"none",stroke:"#A9855A","stroke-width":5},rDeskFront);
// rain cloud over Ramesh (sad trombone)
const cloud=el("g",{},W);
[[-60,0,52],[0,-26,66],[64,-4,54],[24,18,50],[-30,20,46]].forEach(([x,y,r])=>el("circle",{cx:x,cy:y,r,fill:"#90A4AE",stroke:INK,"stroke-width":5},cloud));
[[-60,0,52],[0,-26,66],[64,-4,54],[24,18,50],[-30,20,46]].forEach(([x,y,r])=>el("circle",{cx:x,cy:y,r:r-5,fill:"#90A4AE"},cloud));
const rain=[]; for(let k=0;k<7;k++) rain.push(el("line",{x1:-70+k*24,y1:50,x2:-76+k*24,y2:80,stroke:"#4FC3F7","stroke-width":6,"stroke-linecap":"round"},cloud));
// steam puffs (angry, L4)
const steam=[]; for(let k=0;k<6;k++) steam.push(el("circle",{r:16,fill:"#FFFFFF",stroke:"#B0BEC5","stroke-width":3,opacity:0},W));

// ===== THE CABIN (x CB_..): back wall, the glass with the open office beyond (colleagues, Ramesh's desk with his helmet
// + backpack), the cabin wall clock (solid wall, right), the manager's desk (front) =====
const C0=el("g",{},W);
el("rect",{x:CB_-900,y:-900,width:3000,height:2300,fill:"#F1E6D6"},C0);
el("rect",{x:CB_-330,y:330,width:1040,height:930,fill:"#E3F0F7",stroke:"#56616C","stroke-width":14},C0);   // glass
el("rect",{x:CB_-330,y:330,width:1040,height:930,fill:"#EAF3F8"},C0);
el("rect",{x:CB_-330,y:520,width:1040,height:120,fill:"#FFFFFF",opacity:.4},C0);
// far office through the glass
const farPeople=el("g",{},C0);
const farProps=el("g",{},C0);
cubicles(farProps,CB_-330,CB_+710,1010,1260,"#B3C4D3","#93A8BB");
const farHelmet=el("g",{transform:`translate(${CB_+330},1004) scale(0.5)`},farProps);
const farPack=el("g",{transform:`translate(${CB_+250},1004) scale(0.5)`},farProps);
[[CB_-200,340,CB_-260,1250],[CB_+170,340,CB_+110,1250],[CB_+520,340,CB_+460,1250]].forEach(([x1,y1,x2,y2])=>el("polygon",{points:`${x1},${y1} ${x1+34},${y1} ${x2+34},${y2} ${x2},${y2}`,fill:"#FFFFFF",opacity:.28},C0));
el("rect",{x:CB_-330,y:330,width:1040,height:930,fill:"none",stroke:"#56616C","stroke-width":14},C0);
el("rect",{x:CB_+190,y:330,width:14,height:930,fill:"#56616C"},C0);
// the cabin wall clock (10:00-ish; the minute hand moves on its own)
const CCX=CB_+930, CCY=560;
const cclock=el("g",{transform:`translate(${CCX},${CCY})`},C0);
el("circle",{r:92,fill:"#10141E"},cclock); el("circle",{r:81,fill:"#FFFDF5"},cclock);
for(let k=0;k<12;k++){const a=k*Math.PI/6; el("line",{x1:Math.sin(a)*64,y1:-Math.cos(a)*64,x2:Math.sin(a)*76,y2:-Math.cos(a)*76,stroke:INK,"stroke-width":k%3?3:7},cclock)}
const chH=el("line",{x1:0,y1:6,x2:0,y2:-40,stroke:INK,"stroke-width":10,"stroke-linecap":"round"},cclock);
const chM=el("line",{x1:0,y1:8,x2:0,y2:-62,stroke:INK,"stroke-width":7,"stroke-linecap":"round"},cclock);
el("circle",{r:7,fill:"#E53935"},cclock);
const cclkRing=el("circle",{r:100,fill:"none",stroke:"#FFE066","stroke-width":12,opacity:0},cclock);
// a plant + file shelf (left)
el("rect",{x:CB_-560,y:880,width:170,height:380,fill:"#B9A58A",stroke:INK,"stroke-width":5},C0);
for(let k=0;k<3;k++) el("rect",{x:CB_-545+k*52,y:900,width:40,height:120,fill:["#2D6CDF","#E8553D","#43A047"][k],stroke:INK,"stroke-width":3},C0);
// sunrise rays (mock heroic, L9) — behind Ramesh
const rays=el("g",{},C0);
for(let k=0;k<16;k++){const a0=k*Math.PI/8, a1=a0+Math.PI/16; el("polygon",{points:`0,0 ${Math.cos(a0)*1400},${Math.sin(a0)*1400} ${Math.cos(a1)*1400},${Math.sin(a1)*1400}`,fill:k%2?"#FFB300":"#FFD54F"},rays)}
el("circle",{r:150,fill:"#FFF3C4"},rays);
const cPeople=el("g",{},W);
const cDesk=el("g",{},W);
el("rect",{x:CB_-260,y:1248,width:1560,height:30,rx:6,fill:"#8D6E55",stroke:INK,"stroke-width":5},cDesk);
el("rect",{x:CB_-240,y:1278,width:1520,height:700,fill:"#6D5240",stroke:INK,"stroke-width":5},cDesk);
for(let k=0;k<6;k++) el("rect",{x:CB_-240+k*260,y:1278,width:8,height:700,fill:"#5D4434"},cDesk);
el("rect",{x:CB_+940,y:1196,width:150,height:54,rx:6,fill:"#ECEFF1",stroke:INK,"stroke-width":4},cDesk);       // file tray (plain)
el("rect",{x:CB_+950,y:1184,width:130,height:14,rx:3,fill:"#FFFFFF",stroke:INK,"stroke-width":3},cDesk);
el("rect",{x:CB_+520,y:1214,width:44,height:36,rx:6,fill:"#455A64",stroke:INK,"stroke-width":4},cDesk);       // pen stand
[[-8,-30],[2,-40],[12,-34]].forEach(([x,y],k)=>el("line",{x1:CB_+542+x,y1:1214,x2:CB_+542+x*1.6,y2:1214+y,stroke:["#1E88E5","#E53935","#10141E"][k],"stroke-width":5,"stroke-linecap":"round"},cDesk));
const sparkle=el("g",{opacity:0},W);
{const st_=(s)=>{const p=[];for(let k=0;k<8;k++){const r=k%2?s*0.28:s, a=k*Math.PI/4-Math.PI/2; p.push(`${(Math.cos(a)*r).toFixed(1)},${(Math.sin(a)*r).toFixed(1)}`)}return p.join(" ")};
 el("polygon",{points:st_(40),fill:"#FFFFFF",stroke:"#FFD54F","stroke-width":4},sparkle); el("polygon",{points:st_(20),fill:"#FFF59D",transform:"translate(46,-30)"},sparkle)}

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
helmetShape(deskHelmet,0.9); packShape(deskPack,0.95); helmetShape(farHelmet,1); packShape(farPack,1);

// ---------- adult characters (front view; local y=0 at the hip) ----------
function ik(sx,sy,tx,ty,a,b,side){let dx=tx-sx,dy=ty-sy,d=Math.hypot(dx,dy)||1; const dd=Math.min(d,a+b-1); dx/=d; dy/=d;
  const base=Math.atan2(dy,dx), cA=clamp((a*a+dd*dd-b*b)/(2*a*dd),-1,1), al=Math.acos(cA);
  const c1=[sx+Math.cos(base+al)*a,sy+Math.sin(base+al)*a], c2=[sx+Math.cos(base-al)*a,sy+Math.sin(base-al)*a];
  const sc=p=>p[1]+side*p[0]*0.6; const e=sc(c1)>sc(c2)?c1:c2; return [e,[sx+dx*dd,sy+dy*dd]]}
let T_=0;
function makeAdult(o){
  const g=el("g",{},o.parent||W), body=el("g",{},g);
  const legs=[];
  if(o.legs) [-1,1].forEach(s=>{const lg_=el("g",{},body); el("path",{d:`M${s*50-30} -14 L${s*50+30} -14 L${s*56+26} 420 L${s*56-26} 420 Z`,fill:o.legs.pant,stroke:INK,"stroke-width":5},lg_);
    el("path",{d:`M${s*56-34} 418 Q${s*56-36} 446 ${s*56+s*14} 448 Q${s*56+46*s} 446 ${s*56+44*s} 424 Z`,fill:o.legs.shoe,stroke:INK,"stroke-width":4},lg_); legs.push(lg_)});
  const hairBack=el("g",{},body);
  const pack=o.backpack?el("rect",{x:-112,y:-286,width:224,height:250,rx:40,fill:o.backpack,stroke:INK,"stroke-width":5},body):null;
  if(o.longHair) el("path",{d:"M-72 -40 Q-80 -100 0 -102 Q80 -100 72 -40 L80 72 Q74 98 46 94 L-46 94 Q-74 98 -80 72 Z",fill:o.hair},hairBack);
  if(o.bun) el("ellipse",{cx:50,cy:30,rx:30,ry:26,fill:o.hair,stroke:INK,"stroke-width":3},hairBack);
  if(o.kurta){
    el("path",{d:"M-84 -268 Q-88 -286 -62 -290 L-24 -298 L24 -298 L62 -290 Q88 -286 84 -268 L70 -60 L104 220 L-104 220 L-70 -60 Z",fill:o.shirt,stroke:INK,"stroke-width":5},body);
    el("path",{d:"M-30 -298 Q0 -250 30 -298",fill:o.skin,stroke:o.trim,"stroke-width":8},body);
  } else {
    const hem=o.untucked?"L84 18 Q60 30 30 22 Q0 34 -34 24 Q-64 34 -86 16 Z":"L82 -10 Q80 0 66 0 L-66 0 Q-80 0 -82 -10 Z";
    const d=o.paunch?"M-94 -268 Q-98 -288 -70 -292 L-26 -300 L26 -300 L70 -292 Q98 -288 94 -268 L98 -160 Q124 -80 100 -10 Q94 2 76 2 L-76 2 Q-94 2 -100 -10 Q-124 -80 -98 -160 Z"
                    :"M-94 -268 Q-98 -288 -70 -292 L-26 -300 L26 -300 L70 -292 Q98 -288 94 -268 "+hem;
    el("path",{d,fill:o.shirt,stroke:INK,"stroke-width":5},body);
    if(o.paunch) el("path",{d:"M-70 -120 Q0 -60 70 -120",stroke:INK,"stroke-width":3,fill:"none",opacity:.25},body);
    el("path",{d:"M-24 -300 L0 -268 L24 -300",fill:o.skin},body);
    if(!o.tie){ el("line",{x1:0,y1:-262,x2:0,y2:o.untucked?20:0,stroke:INK,"stroke-width":3,opacity:.55},body);
      [-225,-170,-115,-60].forEach(y=>el("circle",{cx:6,cy:y,r:4,fill:o.button||"#9A9AA6"},body)) }
    if(o.tie){ el("path",{d:"M-24 -300 L0 -268 L24 -300 Z",fill:o.shirt},body);
      el("path",{d:"M-6 -282 L-20 -258 L-24 -84 L0 -56 L24 -84 L20 -258 L6 -282 Z",fill:o.tie,stroke:INK,"stroke-width":4,"stroke-linejoin":"round"},body);
      for(let y=-240;y>-96;y+=38) el("line",{x1:-20,y1:y+12,x2:20,y2:y-8,stroke:"#A33A4A","stroke-width":5},body);
      el("path",{d:"M-15 -300 L15 -300 L10 -280 L-10 -280 Z",fill:o.tie,stroke:INK,"stroke-width":4,"stroke-linejoin":"round"},body)}
    el("path",{d:"M-28 -302 L-4 -262 L-40 -276 Z",fill:o.collar||o.shirt,stroke:INK,"stroke-width":4,"stroke-linejoin":"round"},body);
    el("path",{d:"M28 -302 L4 -262 L40 -276 Z",fill:o.collar||o.shirt,stroke:INK,"stroke-width":4,"stroke-linejoin":"round"},body);
    if(o.pocket) el("path",{d:"M-62 -205 L-32 -205 L-32 -172 L-62 -172 Z",fill:"none",stroke:INK,"stroke-width":3,opacity:.45},body);
    if(o.belt){ el("rect",{x:-100,y:-16,width:200,height:18,fill:"#2B2B2B",stroke:INK,"stroke-width":3},body); el("rect",{x:-14,y:-18,width:28,height:22,rx:3,fill:"#B0BEC5",stroke:INK,"stroke-width":3},body) }
  }
  const straps=o.backpack?el("g",{},body):null;
  if(straps){ el("path",{d:"M-66 -292 Q-78 -200 -70 -110",stroke:"#1A1C20","stroke-width":18,fill:"none","stroke-linecap":"round"},straps); el("path",{d:"M66 -292 Q78 -200 70 -110",stroke:"#1A1C20","stroke-width":18,fill:"none","stroke-linecap":"round"},straps) }
  el("rect",{x:-19,y:-334,width:38,height:44,fill:o.skin},body);
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
  const mugShape=p=>{el("path",{d:"M-30 -12 Q-50 -12 -50 6 Q-50 24 -30 22",stroke:INK,"stroke-width":12,fill:"none"},p); el("path",{d:"M-30 -12 Q-50 -12 -50 6 Q-50 24 -30 22",stroke:"#FFFFFF","stroke-width":6,fill:"none"},p);
    el("path",{d:"M-32 -30 L28 -30 L24 34 Q22 42 12 42 L-16 42 Q-26 42 -28 34 Z",fill:"#FFFFFF",stroke:INK,"stroke-width":5},p); el("ellipse",{cx:-2,cy:-30,rx:30,ry:7,fill:"#6D4C41",stroke:INK,"stroke-width":3},p)};
  items.mug=el("g",{},itemG); mugShape(items.mug); itemsL.mug=el("g",{transform:"scale(-1,1)"},itemGL); mugShape(itemsL.mug);
  itemsL.helmet=el("g",{transform:"translate(0,58)"},itemGL); helmetShape(itemsL.helmet,0.95);
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
  else if(o.longHair){el("path",{d:"M-60 -6 Q-68 -88 4 -88 Q64 -86 62 -14 Q50 -62 12 -64 Q-12 -46 -40 -44 Q-56 -30 -60 -6 Z",fill:o.hair,stroke:INK,"stroke-width":3},head)}
  else el("path",{d:"M-58 -10 Q-66 -84 -6 -90 Q56 -94 62 -28 L58 -8 Q54 -48 30 -56 Q2 -62 -26 -54 Q-50 -46 -54 -8 Z",fill:o.hair,stroke:INK,"stroke-width":3},head);
  if(o.glasses){ [-21,21].forEach(x=>el("rect",{x:x-17,y:-14,width:34,height:22,rx:9,fill:"rgba(220,240,255,.25)",stroke:o.glasses,"stroke-width":3.5},face)); el("path",{d:"M-4 -6 Q0 -10 4 -6",stroke:o.glasses,"stroke-width":3.5,fill:"none"},face)}
  const sweat=el("path",{d:"M60 -40 Q70 -22 62 -14 Q52 -14 54 -26 Z",fill:"#81D4FA",stroke:INK,"stroke-width":2,opacity:0},head);
  [AL.fing,AR.fing,AL.hand,AR.hand,itemG,itemGL].forEach(x=>body.appendChild(x));
  const st={};
  const SH=[[-82,-270],[82,-270]];
  function draw(){
    const k=st; g.setAttribute("transform",`translate(${k.x},${k.y-k.hop}) rotate(${k.rot}) scale(${k.s},${k.s*(k.squash||1)})`); g.style.opacity=k.vis; g.style.display=k.vis>0?"":"none";
    if(!k.vis) return;
    const ht=`translate(${k.look*3},${-392+k.headY}) rotate(${k.headRot})`; head.setAttribute("transform",ht); hairBack.setAttribute("transform",ht);
    face.setAttribute("transform",`translate(${k.look*7},${k.lookY*3})`);
    legs.forEach((L,i)=>L.setAttribute("transform",`rotate(${(i?1:-1)*k.walk*14} 0 -10)`));
    if(pack) pack.style.opacity=k.pack; if(straps) straps.style.opacity=k.pack;
    if(o._lany) o._lany.style.opacity=k.lany;
    flush.setAttribute("opacity",k.angry*0.32); sweat.setAttribute("opacity",k.sweat);
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
  function headW(){const k=st; return [k.x+k.look*3*k.s, k.y-k.hop+(-392+k.headY)*k.s]}
  return {st,draw,g,aim,headW};
}

// this reel's cast (saved in tools/anim2d/cast.md)
const RAMESH_OPT={skin:"#B9805A",hair:"#1B1310",shirt:"#9CCBF0",collar:"#84B8E2",button:"#FFFFFF",messy:true,untucked:true,pocket:true,stubble:"#4A3426",brow:6.5,lip:"#7A3A30",blush:0.2};   // Ramesh, late 20s: light-blue shirt (untucked), messy hair tufts, light stubble
const MANAGER_OPT={skin:"#B07850",hair:"#1C1612",grey:"#A7A7A7",bald:true,shirt:"#FAFAFA",collar:"#E3E3E3",tie:"#7B1E2B",paunch:true,belt:true,moustache:"#14100C",thickMo:true,lines:true,brow:7.5,lip:"#6A3028",blush:0.12};   // the manager, ~45: tucked white shirt, maroon tie, thick moustache, bald top + grey temples, paunch
const RAMESH_S1={...RAMESH_OPT,badge:["RAMESH","STAFF"],backpack:"#23262B",legs:{pant:"#3B4252",shoe:"#1A1A1A"}};
const MANAGER_S1={...MANAGER_OPT,legs:{pant:"#37404A",shoe:"#2B1B12"}};
const COL=[{skin:"#C98F66",hair:"#20140F",shirt:"#F06292",trim:"#FFCDD2",kurta:true,longHair:true,bun:true,sleeve:"#F06292",fore:"#C98F66",brow:4.5,lash:4,lip:"#A0404A"},
           {skin:"#A86F48",hair:"#1A1410",shirt:"#81C784",collar:"#66BB6A",glasses:"#263238",brow:6,lip:"#6A3028"},
           {skin:"#C08860",hair:"#2A1A12",shirt:"#FFB74D",collar:"#FFA726",moustache:"#1E1612",brow:6,lip:"#6A3028"}];

const RM=makeAdult({...RAMESH_S1,parent:oPeople});          // open office (S1 walk-in, S2 walk to the cabin)
const MG=makeAdult({...MANAGER_S1,parent:oPeople});
const RMD=makeAdult({...RAMESH_OPT,badge:["RAMESH","STAFF"],parent:oPeople});      // seated at his desk (S2)
rDeskFront.parentNode.appendChild(rDeskFront);               // desk front over the seated Ramesh
const FARC=COL.map(o=>makeAdult({...o,parent:farPeople}));   // the 3 colleagues behind the cabin glass
const RC=makeAdult({...RAMESH_OPT,badge:["RAMESH","STAFF"],parent:cPeople});       // cabin
const MC=makeAdult({...MANAGER_OPT,parent:cPeople});
farProps.parentNode.insertBefore(farPeople,farProps.nextSibling); farProps.appendChild(farHelmet); farProps.appendChild(farPack);
// colleagues must sit BEHIND the far partitions: move the partitions after them
{const part=[...farProps.childNodes]; part.forEach(n=>farProps.appendChild(n)); farProps.parentNode.insertBefore(farPeople,farProps)}
oPeople.parentNode.insertBefore(lateG,oPeople);

// confetti (screen space, HOORAY)
const CONF=[]; for(let k=0;k<70;k++) CONF.push(el("rect",{x:-9,y:-5,width:18,height:10,rx:2,fill:["#E53935","#FFD54F","#43A047","#1E88E5","#8E24AA","#FF7043"][k%6],opacity:0},fx));

// ---------- narrator Gopi badge (house look, clay, screen space) ----------
const ndefs=el("defs",{},nar);
const clip=el("clipPath",{id:"badgeClip"},ndefs); el("circle",{cx:0,cy:0,r:122},clip);
const badge=el("g",{},nar);
const badgeIn=el("g",{filter:"url(#skin-clay)"},badge);
el("circle",{cx:0,cy:0,r:134,fill:"#F5B347",stroke:INK,"stroke-width":7},badgeIn);
el("circle",{cx:0,cy:0,r:122,fill:"#7B2FF7"},badgeIn);
const gopiG=el("g",{"clip-path":"url(#badgeClip)"},badgeIn);
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
const GOPI=makeChar({parent:gopiG,skin:"#C68A55",hair:"#3B2A20",shirt:"#FB8C00",shorts:"#1E88E5"});

// ---------- timeline ----------
const COLORS={gopi:"#F5B347",ramesh:"#9CCBF0",manager:"#F48FB1"}, NAMES={gopi:"GOPI",ramesh:"RAMESH",manager:"MANAGER"};
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
// word onset snapped to the nearest voiced-segment start (hits land on the attack of the word), if one is close
function onset(i,word,nth=0,win=0.3){const t0=at(i,word,nth); let best=t0,bd=win; for(const [s] of segsOf(i)){const d=Math.abs(s-t0); if(d<bd){bd=d;best=s}} return best}
// end of the voiced segment that contains (or ends just before) word
function segEnd(i,word){const t0=at(i,word); for(const [s,e] of segsOf(i)) if(t0>=s-0.05&&t0<=e+0.05) return e; return t0+0.3}
const segS=(i,k)=>segsOf(i)[Math.min(k,segsOf(i).length-1)][0], segE=(i,k)=>segsOf(i)[Math.min(k,segsOf(i).length-1)][1];
const OV=(typeof window!=="undefined"&&window.BEAT_OVERRIDES)||{};

let B=null;
function beats(){ if(B) return B; B={};
  // Scene 1: silent intro (tick-tock x4 -> TING at 10:10), the bark, the excuse, the threat
  B.tick=[0.06,0.33,0.60,0.87]; B.ting=1.12; B.titleIn=1.0; B.tip=[S(0)-0.42,S(0)-0.28,S(0)-0.14];
  B.whip=S(0)-0.06; B.dhoom=segS(0,1)-0.12;   /* the crack lands in the gap before ఏంట్రా, the boom rolls under it */ B.dhoomEnd=B.dhoom+0.6;
  B.r0=S(1)-0.12; B.bloop=onset(1,"పది");
  B.m2=S(2)-0.1; B.slurp1=segE(2,0)+0.02; B.tChu=onset(2,"చూసుకుందాం"); B.dun1=E(2)+0.06; B.dun2=E(2)+0.36; B.flip0=E(2)+0.72;
  // Scene 2: the appraisal (drumroll -> STAMP -> sad trombone), the follow tap, the march + door bang
  B.s2=S(3)-0.25; B.formIn=at(3,"top")-0.35; B.roll0=segS(3,1)-0.05; B.stamp=segE(3,1)+0.04;   /* in the gap before "secondary" (QC: not on the word) */ B.tromb=E(3)+0.05;
  B.fol0=S(4)-0.4; B.tFolPop=S(4)-0.35; B.tFol=onset(4,"కొట్టండి"); B.fol1=E(4)+0.3;
  B.stomp=[E(4)+0.05,E(4)+0.23,E(4)+0.41]; B.bang=E(4)+0.58;
  // Scene 3: the cabin
  B.cab=B.bang+0.04; B.ooh=B.bang+0.04; B.oohS=B.bang-0.06;
  B.r5=S(5)-0.1; B.m6=S(6)-0.1; B.tGood=at(6,"బాగానే"); B.tPadi6=at(6,"పది"); B.dhan=[E(6)+0.10,E(6)+0.35,E(6)+0.60];
  B.r7=S(7)-0.08; B.slap=onset(7,"ఒరేయ్"); B.scratch=segE(7,0)+0.03; B.frz0=B.scratch; B.tNee=segS(7,1); B.gasp=segE(7,3)+0.02; B.frz1=segS(7,4);   /* retake: ఒరేయ్ | నీ | దుంప | తెగ! | పది నిమిషాలు… */ B.musicIn=B.frz1;
  B.m8=S(8)-0.1; B.slurp2=E(8)+0.04;
  B.r9=S(9)-0.08; B.tGanta=at(9,"గంట")-0.08;
  B.m10=S(10)-0.1; B.ding=onset(10,"మంచిది",0,0.2); B.sil0=E(10)+0.06; B.sil1=S(11)-0.015;
  B.lean=S(11); B.tDbl=at(11,"డబుల్"); B.donk=E(11)+0.2; B.laugh=B.donk+0.1; B.hooray=B.laugh+0.4;
  B.card1=B.donk+0.45; B.card2=B.donk+1.3; B.rim=B.card2+0.12*L2W.length+0.08;
  B.c12=S(12)-0.15; B.tCm=segS(12,1); B.s13=S(13)-0.12; B.tTag=segS(13,1); B.end0=E(13)+0.08; B.tEF=B.end0+0.45;
  B.eTick=[B.end0+0.2,B.end0+0.4]; B.eTing=B.end0+0.6;
  Object.assign(B,OV);
  return B}

const focus=(z,wx,wy,sx=540,sy=1000,r=0)=>({z,fx:wx-(sx-540)/z,fy:wy-(sy-1000)/z,r});
const mixCam=(a,b_,k)=>({z:lerp(a.z,b_.z,k),fx:lerp(a.fx,b_.fx,k),fy:lerp(a.fy,b_.fy,k),r:lerp(a.r||0,b_.r||0,k)});
// keep short Telugu words (కి, ని, ఆ? ...) on the line of the word before them
const subFix=s=>s.replace(/…/g,"...").replace(/([^\s.!?])\s([ఀ-౿]{1,2}[.,!?]*)(?=\s|$)/g,"$1&nbsp;$2").replace(/(^|\s)(మీ|నా|నీ|ఏం)\s/g,"$1$2&nbsp;").replace(/(టైమ్) (లో)/g,"$1&nbsp;$2").replace(/(రమేష్) (కి)/g,"$1&nbsp;$2").replace(/secondary rating/g,"secondary&nbsp;rating").replace(/top rating/g,"top&nbsp;rating").replace(/(సెకండరీ) (రేటింగ్)/g,"$1&nbsp;$2").replace(/(manager) (ని)/g,"$1&nbsp;$2").replace(/(tag) (చేయండి)/g,"$1&nbsp;$2").replace(/పది నిమిషాలు/g,"పది&nbsp;నిమిషాలు").replace("చేశాడా? Comment","చేశాడా?<br>Comment");

function frame(t){
  const b=beats(); T_=t;
  const silent=t>=b.sil0&&t<b.sil1;
  const frozen=t>=b.frz0&&t<b.frz1;
  const donkHold=t>=b.donk&&t<b.donk+0.5;
  const T=frozen?b.frz0:silent?b.sil0:t;                 // character time (stops in the freeze and in the silent beat)
  const s2=t>=b.flip0+0.3&&t<b.cab, cabin=t>=b.cab, s1=!s2&&!cabin;
  $("s").style.filter=frozen?`saturate(${lerp(1,0.6,clamp((t-b.frz0)/0.08))}) contrast(1.08) brightness(1.03)`:"";   // light desaturation: Ramesh stays red
  const reset=(C,who,x,y,s)=>Object.assign(C.st,{x,y,s,talk:who&&!frozen&&!silent?talkOf(who,t):0,blink:frozen||silent?0:(((T*0.6+x*0.0013)%3.3)<0.11?1:0),shut:0,look:0,lookY:0,brow:"n",smile:0,laugh:0,sad:0,smirk:0,gasp:0,
    headRot:0,headY:0,hop:0,rot:0,item:"",itemL:"",itemRot:0,itemRotL:0,vis:1,wink:0,walk:0,lany:1,pack:0,spread:0,blank:0,twitch:0,angry:0,sweat:0,wide:0,squash:1,hL:[-62,-66],hR:[62,-66]});

  // ---------------- Scene 1: the clock, Ramesh tiptoes in, the manager at his door ----------------
  {const mm=t<b.ting?9:10, kk=t<b.ting?0:out((t-b.ting)/0.12);       // 10:09 -> 10:10 (click)
   const mAng=(mm-1+kk)*6+(t<b.ting?0:0)+(mm===9?54-48:0); const mA=t<b.ting?54:lerp(54,60,kk)+(t>b.ting+0.12?Math.sin((t-b.ting)*40)*Math.exp(-(t-b.ting)*10)*3:0);
   const hA=300+(mA/60)*30; const sec=b.tick.filter(x=>t>=x).length+(t>=b.ting?1:0);
   mHand.setAttribute("transform",`rotate(${mA})`); hHand.setAttribute("transform",`rotate(${hA})`); sHand.setAttribute("transform",`rotate(${(56+sec)*6})`);
   clkGlow.setAttribute("opacity",t>=b.ting&&t<b.ting+0.5?1-(t-b.ting)/0.5:0); clkGlow.setAttribute("r",150+(t-b.ting)*60);
   clockG.setAttribute("transform",`translate(${CLX},${CLY}) scale(${t>=b.ting&&t<b.ting+0.3?1+0.06*Math.sin((t-b.ting)/0.3*Math.PI):1})`)}
  clockG.style.display=board.style.display=s2?"none":"";
  const rm=RM.st; reset(RM,"ramesh",0,SY,SS); rm.pack=1; rm.itemL="helmet";
  {const k=clamp(T/(b.whip+0.05)); const step=Math.sin(T*Math.PI*2.6);
   rm.x=lerp(60,330,k); rm.hop=Math.abs(step)*18+14; rm.walk=step*0.9; rm.squash=1+0.03*Math.abs(step); rm.look=0.9; rm.brow="w"; rm.smirk=1; rm.headRot=-4+step*2;
   rm.hL=[-70,-60]; rm.hR=[14,-350]; rm.sweat=0.9;                                                    // finger on lips, tiptoe
   if(T>=b.whip){ rm.x=330; rm.hop=14; rm.walk=0.7; rm.look=0.9; rm.smirk=0; rm.gasp=1; rm.brow="u"; rm.hR=[30,-330]; rm.headRot=-2; rm.wide=1 }   // frozen mid-tiptoe
   if(T>=b.r0){ const k2=out((T-b.r0)/0.2); rm.gasp=0; rm.smile=1; rm.brow="q"; rm.look=0.7; rm.walk=0; rm.hop=lerp(14,0,k2);
     rm.spread=1; rm.hL=[lerp(-70,-110,k2),lerp(-60,-300,k2)]; rm.hR=[lerp(40,110,k2),lerp(-280,-300,k2)]; rm.headRot=5; rm.sweat=1 }      // guilty grin + ten fingers
   if(T>=b.m2){ rm.spread=0; rm.smile=0; rm.sad=1; rm.brow="w"; rm.hL=[-70,-60]; rm.hR=[60,-70]; rm.look=0.8 }
   if(T>=b.tChu){ rm.gasp=1; rm.sad=0; rm.wide=1; rm.sweat=1 }}
  rm.vis=s1?1:0;
  const mg=MG.st; reset(MG,"manager",1310,SY,SS); mg.itemL="mug"; mg.look=-0.9; mg.brow="a"; mg.hL=[-60,-120]; mg.hR=[70,-60];
  if(T<b.whip){ mg.look=0; mg.brow="n"; mg.lookY=0.5; mg.hL=[-40,-250]; mg.itemRotL=0; mg.smile=0 }                    // reading over his mug
  if(T>=b.whip&&T<b.r0){ mg.brow="a"; mg.look=-1; mg.hR=[90,-140]; if(T>=b.dhoom){ mg.hR=[150,-230]; mg.headRot=-4; mg.hop=Math.max(0,8-(T-b.dhoom)*40) } }   // points: LATE!
  if(T>=b.r0&&T<b.m2){ mg.brow="a"; mg.look=-1; mg.smirk=0; mg.hR=[70,-60] }
  if(T>=b.m2){ mg.brow="n"; mg.look=-0.9; mg.smirk=1;
    if(T<b.slurp1-0.25){ const w=Math.sin(T*14)*30; mg.hR=[120+w,-230] }                                              // "సరే, సరే" wave-off
    else if(T<b.slurp1+0.45){ MG.aim("L",1310-26,SY-392*SS+40); mg.itemRotL=-25; mg.shut=1 }                          // slurp
    else { mg.hL=[-60,-150]; mg.brow="a"; mg.look=-1; mg.lookY=0.2 } }                                                  // narrowed eyes over the mug
  if(T>=b.tChu){ mg.smirk=1; mg.brow="a"; mg.headRot=-3 }
  mg.vis=s1?1:0;
  RM.draw(); MG.draw();
  lateG.setAttribute("transform",`translate(1310,760) scale(${t>=b.dhoom&&t<b.r0?Math.max(0.01,back((t-b.dhoom)/0.25))*(1+0.04*Math.sin(t*30)):0.001}) rotate(${-6+Math.sin(t*20)*2})`);
  lateG.style.opacity=t>=b.dhoom&&t<b.r0?1:0;

  // ---------------- Scene 2: Ramesh at his desk (appraisal day), then the march to the cabin ----------------
  const rd=RMD.st; reset(RMD,"ramesh",RDX,1505,SS); rd.vis=s2&&t<b.stomp[0]?1:0; rd.lany=1;
  rd.look=0.3; rd.lookY=-0.3; rd.brow="u"; rd.smile=1; RMD.aim("L",RDX-110,RDY); RMD.aim("R",RDX+110,RDY);                     // hopeful
  if(t>=b.roll0){ rd.smile=0; rd.gasp=0; rd.brow="u"; rd.wide=1; rd.headY=-6; rd.hL=[-50,-250]; rd.hR=[50,-250] }               // fingers crossed
  if(t>=b.stamp){ rd.wide=0; rd.gasp=1; rd.brow="w"; rd.headY=0; RMD.aim("L",RDX-110,RDY); RMD.aim("R",RDX+110,RDY) }
  if(t>=b.tromb){ const k=ease((t-b.tromb)/1.0); rd.gasp=0; rd.sad=1; rd.brow="w"; rd.lookY=0.8; rd.headRot=lerp(0,7,k); rd.headY=lerp(0,14,k); rd.y=1505+10*k }   // droops
  if(t>=b.fol0){ rd.sad=0; rd.brow="a"; rd.angry=clamp((t-b.fol0)/0.8); rd.lookY=0; rd.look=0.6; rd.headRot=0; rd.headY=0; rd.y=1505;
    RMD.aim("L",RDX-90,RDY-10+Math.abs(Math.sin(t*16))*-14); RMD.aim("R",RDX+90,RDY-10+Math.abs(Math.cos(t*16))*-14) }           // fuming, fists drumming
  RMD.draw();
  // the march (stomps) to the cabin door
  if(t>=b.stomp[0]&&t<b.cab){ const k=clamp((t-b.stomp[0])/(b.bang-b.stomp[0]-0.06)); const R=RM.st; reset(RM,null,lerp(RDX,1240,ease(k)),SY,SS);
    R.vis=1; R.pack=0; R.itemL=""; R.angry=1; R.brow="a"; R.look=0.9; R.walk=Math.sin(k*Math.PI*3)*1.1; R.hop=Math.abs(Math.sin(k*Math.PI*3))*16;
    R.hL=[-90,-60+Math.sin(k*20)*20]; R.hR=[90,-60-Math.sin(k*20)*20];
    if(t>=b.bang-0.12){ RM.aim("R",1200,SY-150); }
    RM.draw() }
  rDesk.style.display=rDeskFront.style.display=(s2||(s1&&false))?"":"none";
  deskHelmet.style.display=deskPack.style.display=s2?"":"none";
  {const on=s2&&t>=b.tromb-0.05&&t<b.fol0+0.3; const k=out((t-b.tromb+0.05)/0.3); cloud.style.display=on?"":"none";
   cloud.setAttribute("transform",`translate(${RDX+10},${lerp(880,960,k)}) scale(${0.8*k+0.1})`);
   rain.forEach((r_,i)=>{const f=fract(t*2.5+i*0.37); r_.setAttribute("transform",`translate(0,${f*60})`); r_.setAttribute("opacity",t>b.tromb+0.25?1-f:0)})}
  steam.forEach((p,i)=>{const on=s2&&t>=b.fol0+0.2&&t<b.stomp[0]; const f=fract(t*1.6+i/6); const side=i%2?1:-1;
    p.setAttribute("cx",RDX+side*(62+f*40)); p.setAttribute("cy",1505-392*SS-10-f*90); p.setAttribute("r",10+f*18); p.setAttribute("opacity",on?(1-f)*0.95:0)});
  {const k=t>=b.bang-0.04&&t<b.cab+0.3?out((t-b.bang+0.04)/0.12):0; doorP.setAttribute("transform",`translate(${0},0) scale(${1-0.75*k},1)`)}   // door flies open

  // ---------------- Scene 3: the cabin ----------------
  const RCX=CB_+280, RCY=1262, MCX=CB_+730, MCY=1330;
  const rc=RC.st; reset(RC,"ramesh",RCX,RCY,1.0); rc.vis=cabin?1:0; rc.angry=1; rc.brow="a"; rc.look=0.9; RC.aim("L",RCX-80,1250); RC.aim("R",RCX+80,1250);
  const mc=MC.st; reset(MC,"manager",MCX,MCY,1.0); mc.vis=cabin?1:0; mc.itemL="mug"; mc.look=-0.9; mc.brow="n"; mc.smirk=1; mc.rot=4; MC.aim("L",MCX-120,1150); MC.aim("R",MCX+100,1246);   // leans back, mug in hand
  if(cabin){
    if(t<b.r5){ const k=out((t-b.cab)/0.25); rc.x=lerp(RCX-220,RCX,k); rc.hop=Math.sin(k*Math.PI)*20; mc.gasp=0; mc.brow="u"; mc.smirk=0 }      // bursts in
    if(t>=b.r5){ RC.aim("L",RCX-70,1252); RC.aim("R",RCX+120,1252); rc.rot=-3; rc.angry=0.7; rc.brow="w";                                  // hands on the desk, angry but polite
      if(t>=at(5,"నా పని")-0.1){ rc.brow="w"; rc.sad=1; rc.angry=0.4; rc.hR=[80,-200]; rc.look=0.9 } }
    if(t>=b.m6){ rc.sad=0; rc.angry=0.5; rc.brow="u"; mc.smirk=0; mc.smile=1; mc.brow="n";
      if(t>=b.tGood&&t<b.tGood+0.5) mc.headY=Math.sin((t-b.tGood)/0.5*Math.PI*2)*7;                                                        // sweet nods
      if(t>=b.tPadi6-0.15){ const k=out((t-b.tPadi6+0.15)/0.25); MC.aim("R",lerp(MCX+100,CCX-70,k),lerp(1246,CCY+120,k)); mc.smile=0; mc.smirk=1; mc.brow="q"; mc.look=-0.6 } }   // points at the clock
    if(t>=b.dhan[0]&&t<b.r7){ rc.angry=0; rc.gasp=1; rc.wide=1; rc.brow="u"; rc.look=0.6; rc.hL=[-40,-300]; rc.hR=[40,-300]; mc.smirk=1; MC.aim("R",MCX+100,1246) }   // shocked face (triple zoom)
    if(t>=b.r7){ rc.gasp=0; rc.wide=0; rc.angry=1; rc.brow="a"; rc.look=0.9; rc.rot=-6;
      const k=Math.max(0,1-Math.abs(t-b.slap)/0.12); RC.aim("R",RCX+150,1250-30*(1-k)); RC.aim("L",RCX-60,1250-30*(1-k)); rc.hop=k*6;      // slaps the desk
      if(t>=b.frz0){ rc.hR=[150,-330]; rc.hL=[-80,-120]; rc.gasp=1; rc.wide=1; rc.angry=1.7; rc.brow="a"; rc.headRot=-4 }                       // finger in his face, red and furious (frozen)
      if(t>=b.frz1){ const w=Math.sin(t*9); rc.hL=[-110+w*20,-260]; rc.hR=[110-w*20,-280]; rc.rot=-4 }                                         // rants with both hands
      mc.smirk=0; mc.brow="u"; mc.gasp=t>=b.frz0&&t<b.frz1?1:0; mc.wide=1; mc.sweat=t>=b.frz0?0.9:0 }
    if(t>=b.m8){ rc.angry=0.8; rc.brow="a"; rc.hL=[-62,-66]; RC.aim("L",RCX-70,1252); RC.aim("R",RCX+120,1252); rc.rot=-3;
      mc.gasp=0; mc.wide=0; mc.sweat=0; mc.smirk=1; mc.brow="n"; mc.headRot=Math.sin(clamp((t-b.m8)/0.6)*Math.PI)*6;                          // the shrug
      MC.aim("R",MCX+150,1150-Math.sin(clamp((t-b.m8)/0.6)*Math.PI)*60);
      if(t>=b.slurp2-0.15&&t<b.r9+0.2){ MC.aim("L",MCX-24,MCY-392+40); mc.itemRotL=-30; mc.shut=1 } }                                       // long slurp
    if(t>=b.r9){ rc.angry=0; rc.brow="n"; rc.rot=0; rc.look=0.2; rc.lookY=-0.4; rc.headRot=-5; rc.y=RCY-10; rc.smirk=1;
      RC.aim("L",RCX-100,RCY-60); RC.aim("R",RCX+100,RCY-60) }                                                                                 // chest out, hands on hips
    if(t>=b.m10){ mc.smile=1; mc.smirk=0; mc.brow="u"; mc.shut=0; mc.itemRotL=10; MC.aim("L",MCX-110,MCY-400); mc.rot=0;                       // the toast
      rc.smirk=1; rc.look=0.9; rc.lookY=0; rc.headRot=0; rc.y=RCY }
    if(t>=b.lean){ const k=ease((t-b.lean)/0.6); rc.rot=lerp(0,12,k); rc.x=RCX+40*k; rc.smirk=0; rc.brow="q"; rc.look=1; RC.aim("L",RCX-40+60*k,1252); RC.aim("R",RCX+160,1252);   // leans in, deadpan
      mc.smile=1 }
    if(t>=b.donk){ mc.smile=0; mc.blank=1; mc.twitch=t>b.donk+0.25?1:0; mc.itemRotL=10; MC.aim("L",MCX-150,MCY-330) }                           // blank face, mug frozen mid-air
    if(t>=b.laugh+0.3){ rc.smirk=1; rc.brow="q" }
    if(t>=b.c12){ rc.rot=6; rc.x=RCX+20 }
  }
  RC.draw(); MC.draw();
  // colleagues behind the glass: pop up on the 'ooooh', gasp, cheer on the HOORAY
  FARC.forEach((C,i)=>{const X=[CB_+60,CB_+470,CB_+585][i]; const up=cabin?out((t-b.ooh-0.05*i)/0.25):0; const st_=C.st;
    reset(C,null,X,lerp(1205,1080,up),0.42); st_.look=i===2?-0.8:0.8; st_.vis=cabin?1:0;
    st_.gasp=1; st_.brow="u"; st_.hL=[-60,-150]; st_.hR=[60,-150];
    if(t>=b.r5){ st_.gasp=0; st_.smirk=1; st_.brow="q" }
    if(t>=b.dhan[0]){ st_.gasp=1; st_.wide=1; st_.brow="u"; st_.smirk=0 }
    if(t>=b.gasp-0.05){ st_.gasp=1; st_.hL=[-20,-330]; st_.hR=[20,-330]; st_.wide=1 }                                // hands to face
    if(t>=b.m8){ st_.gasp=0; st_.wide=0; st_.smirk=1; st_.hL=[-60,-150]; st_.hR=[60,-150] }
    if(t>=b.laugh){ st_.smirk=0; st_.laugh=1; st_.headRot=Math.sin(t*12+i)*6; st_.hop=Math.abs(Math.sin(t*10+i*2))*16 }
    if(t>=b.hooray){ const w=Math.sin(t*14+i*1.7)*30; st_.hL=[-120,-470+w]; st_.hR=[120,-470-w] }
    if(frozen||silent) st_.hop=0;
    C.draw()});
  {const on=cabin&&t>=b.tGanta-0.1&&t<b.tGanta+1.25; const k=Math.min(out((t-b.tGanta+0.1)/0.2),clamp((b.tGanta+1.25-t)/0.2)); rays.style.display=on?"":"none";
   rays.setAttribute("transform",`translate(${RCX},${880}) rotate(${(t-b.tGanta)*25}) scale(${k})`)}
  {const on=cabin&&t>=b.ding-0.05&&t<b.ding+0.6; const [hx,hy]=MC.headW(); sparkle.setAttribute("opacity",on?1-clamp((t-b.ding-0.3)/0.3):0);
   sparkle.setAttribute("transform",`translate(${hx-20},${hy-78}) scale(${Math.max(0.01,pop(t,b.ding-0.05,0.25))}) rotate(${(t-b.ding)*90})`)}
  {const a=(t>=b.tPadi6-0.15&&t<b.dhan[0])?Math.max(0,1-((t-b.tPadi6)%0.5)/0.5):0; cclkRing.setAttribute("opacity",a); chM.setAttribute("transform",`rotate(${12+t*0.1})`); chH.setAttribute("transform",`rotate(${300+t*0.01})`);
   cclock.setAttribute("transform",`translate(${CCX},${CCY}) rotate(${a?Math.sin(t*40)*3:0})`)}

  // ---------------- Gopi (narrator badge) ----------------
  const g=GOPI.st;
  const nIn=(i,pre=0.15,post=0.2)=>t>S(i)-pre&&t<E(i)+post;
  const narOn=nIn(3)||nIn(4,0.15,0.05)||nIn(12)||(t>S(13)-0.15&&t<b.end0);
  const narT=t>S(13)-0.15?S(13)-0.15:t>S(12)-0.15?S(12)-0.15:t>S(4)-0.15?S(4)-0.15:S(3)-0.15;
  let BX=150, BY=1390, bsc=0.8;
  if(t>S(4)-0.2&&t<E(4)+0.3){ BX=150; BY=1390 }
  if(t>S(12)-0.2){ BX=950; BY=770 }
  if(t>S(13)-0.2){ BX=900; BY=1340 }
  Object.assign(g,{x:0,y:400*0.55+12,s:0.55,talk:talkOf("gopi",t),blink:((t*0.7)%3.1)<0.12?1:0,wink:0,look:BX>540?-0.5:0.5,lookY:0,brow:"n",smile:0,headRot:Math.sin(t*2.2)*3,item:"",armL:200,armR:160,lenL:115,lenR:115,hop:0,itemRot:0});
  if(t>S(3)&&t<b.stamp){ g.brow="q"; g.look=0.6 }
  if(t>=b.stamp&&t<E(3)+0.3){ g.wink=1; g.smile=1 }
  if(t>b.fol0&&t<b.fol1){ g.armR=40; g.item="point"; g.itemRot=-30 }
  if(t>S(12)){ g.smile=1; g.brow="q" }
  GOPI.draw();
  const bs=narOn?Math.max(0.001,back((t-narT)/0.35)):0;
  badge.setAttribute("transform",`translate(${BX},${BY}) scale(${bs*bsc}) rotate(${Math.sin(t*2)*2})`); badge.style.opacity=narOn?1:0;

  // ---------------- camera ----------------
  const punch=(t0,a_=0.1,k=5)=>t>t0?a_*Math.exp(-(t-t0)*k)*clamp((t-t0)/0.04):0;
  const RH=[RCX,870], MH=[MCX,938];
  const shots=[
    [0,focus(1.12+0.03*t,470,560,540,760)],                                          // the clock + Ramesh tiptoeing in
    [b.whip,focus(1.2,1310,880,540,900),0.22],                                         // whip-pan to the manager
    [b.dhoom,focus(1.5+punch(b.dhoom,0.12),1310,860,540,860),0.06],                    // DHOOM punch-in
    [b.r0,focus(1.35+0.02*(t-b.r0)+punch(b.bloop,0.04),330,920,540,940),0.01],         // cut: Ramesh, ten fingers
    [b.m2,focus(1.25+0.03*(t-b.m2),1300,900,540,920),0.01],                            // cut: the manager
    [b.tChu,focus(1.6+0.04*(t-b.tChu)+punch(b.dun2,0.05),1310,860,540,880),0.25],      // push-in: the threat
    [b.flip0+0.3,focus(1.38+0.01*(t-b.s2)+punch(b.stamp,0.08,6),RDX,1130,540,1090),0.01], // Scene 2: his desk
    [b.stomp[0],focus(1.1,lerp(RDX,1180,clamp((t-b.stomp[0])/(b.bang-b.stomp[0]))),1100,540,1080),0.15],
    [b.cab,focus(1.0,CB_+505,1000),0.01],                                              // the cabin, wide
    [b.r5,focus(1.42+0.02*(t-b.r5),RCX+40,900,540,900),0.25],
    [b.m6,focus(1.42+0.02*(t-b.m6),MCX-30,960,540,900),0.01],
    [b.tPadi6-0.15,focus(1.12,MCX+60,820,540,900),0.3],                                // include the clock
    [b.dhan[0],focus(1.75,RH[0],RH[1],540,900,-3),0.04],                                // DHAN!
    [b.dhan[1],focus(2.25,RH[0],RH[1],540,900,3),0.04],                                 // DHAN!
    [b.dhan[2],focus(2.9,RH[0],RH[1]+10,540,900,0),0.05],                               // DHAAAN!
    [b.r7,focus(1.3+punch(b.slap,0.08),RCX+110,940,540,960),0.01],
    [b.frz1,focus(1.1+0.02*(t-b.frz1),CB_+505,980),0.2],
    [b.m8,focus(1.42+0.02*(t-b.m8),MCX-30,960,540,900),0.01],
    [b.r9,focus(1.35+0.03*(t-b.r9),RCX+40,880,540,920,0),0.01],
    [b.m10,focus(1.45+0.03*(t-b.m10)+punch(b.ding,0.04),MCX-30,960,540,900),0.01],
    [b.sil0,focus(1.08,CB_+505,990),0.01],                                              // the silent two-shot
    [b.lean,focus(1.08+0.18*ease((t-b.lean)/2.2),CB_+520,960),0.01],                    // slow push-in on the bargain
    [b.donk,focus(2.0+punch(b.donk,0.1,8),MH[0],MH[1],540,1000),0.04],                  // DONK: snap to the blank face
    [b.laugh+0.45,focus(1.0,CB_+505,1080),0.3],                                         // pull back: the colleagues cheer
  ];
  let cm=shots[0][1];
  {let i=0; while(i+1<shots.length&&t>=shots[i+1][0]) i++;
   const [t0,c,tr]=shots[i]; cm=c;
   if(i>0&&tr&&t<t0+tr){ const prev=shots[i-1][1]; cm=mixCam(prev,c,ease((t-t0)/tr)) }}
  let sx=0,sy=0; const shake=(t0,d,a_)=>{if(t>t0&&t<t0+d){const q=(1-(t-t0)/d)*a_; sx+=Math.sin(t*90)*q; sy+=Math.cos(t*77)*q}};
  shake(b.dhoom,0.45,22); shake(b.stamp,0.35,24); b.stomp.forEach(x=>shake(x,0.15,10)); shake(b.bang,0.3,16); b.dhan.forEach((x,i)=>shake(x,0.18,8+i*4));
  shake(b.frz0,0.12,10); shake(b.slap,0.15,8); shake(b.donk,0.25,14);
  cam.setAttribute("transform",`translate(${540+sx},${1000+sy}) rotate(${cm.r||0}) scale(${cm.z}) translate(${-cm.fx},${-cm.fy})`);
  const scr=(wx,wy)=>{const r=(cm.r||0)*Math.PI/180, dx=(wx-cm.fx)*cm.z, dy=(wy-cm.fy)*cm.z; return [540+dx*Math.cos(r)-dy*Math.sin(r)+sx, 1000+dx*Math.sin(r)+dy*Math.cos(r)+sy]};

  // ---------------- HTML overlays ----------------
  // the cold spotlight on the threat (L3 'చూసుకుందాం' -> the dun-DUNN)
  {const dm=$("dim"); let a=0, bg="";
   if(s1&&t>=b.tChu-0.05&&t<b.flip0+0.35){ a=Math.min(clamp((t-b.tChu+0.05)/0.2),1); const [px,py]=scr(1310,SY-392*SS+30);
     bg=`radial-gradient(circle at ${px}px ${py}px, rgba(140,180,255,0.18) 0, rgba(140,180,255,0.10) 200px, rgba(6,10,22,.86) 330px)` }
   if(t>=b.fol0&&t<b.fol1+0.1){ a=0.3*clamp((t-b.fol0)/0.25); bg="#10141E" }
   if(t>=b.c12&&t<b.s13){ a=0.45*clamp((t-b.c12)/0.25); bg="#10141E" }
   dm.style.opacity=a; dm.style.background=bg}
  // text hook (frame 1) + title a beat later
  {const on=t<b.dhoom-0.05; $("hook").style.opacity=on?clamp((b.dhoom-0.05-t)/0.12):0;
   $("hook").style.transform=`rotate(${-1.5+Math.sin(t*3)*0.6}deg) scale(${t>=b.ting&&t<b.ting+0.3?1+0.12*Math.sin((t-b.ting)/0.3*Math.PI):1})`;
   const ti=$("title"), ton=t>b.titleIn&&t<b.dhoom-0.05; ti.style.opacity=ton?1:0; ti.style.transform=`scale(${Math.max(0.01,back((t-b.titleIn)/0.4))}) rotate(-2deg)`}
  const wchip=(id,on,wx,wy,t0,rot,s=1)=>{const e=$(id); if(!on){e.style.opacity=0;return} const [px,py]=scr(wx,wy); e.style.opacity=1; e.style.left=px+"px"; e.style.top=py+"px"; e.style.transform=`translate(-50%,-50%) scale(${Math.max(0.01,pop(t,t0,0.3))*s}) rotate(${rot}deg)`};
  wchip("c10",t>b.bloop-0.05&&t<b.m2,330,660,b.bloop-0.05,-3);
  wchip("c1h",cabin&&t>b.tGanta&&t<b.m10,RCX+120,700,b.tGanta,-3);
  wchip("cDbl",cabin&&t>b.tDbl-0.1&&t<b.donk,CB_+520,720,b.tDbl-0.1,3);
  {const e=$("emo"), on=cabin&&t>b.tDbl+0.15&&t<b.donk+0.45; const [px,py]=scr(CB_+520,720); e.style.opacity=on?1:0; e.style.left=(px+205)+"px"; e.style.top=(py-85)+"px"; e.style.transform=`scale(${Math.max(0.01,pop(t,b.tDbl+0.15,0.3))}) rotate(${Math.sin(t*8)*8}deg)`}
  show("frz",frozen,1,"");
  // calendar flip: DEC 10 -> JAN -> FEB -> MAR -> APPRAISAL DAY (Scene 1 -> 2)
  {const c=$("cal"), on=t>=b.flip0&&t<b.s2+0.55; const k=Math.min(clamp((t-b.flip0)/0.12),clamp((b.s2+0.55-t)/0.15)); c.style.opacity=on?k:0;
   if(on){ $("calP").style.transform=`scale(${lerp(0.7,1,out((t-b.flip0)/0.2))}) rotate(-2deg)`;
     ["pg0","pg1","pg2","pg3"].forEach((id,i)=>{const t0=b.flip0+0.1+i*0.11; const f=clamp((t-t0)/0.12); $(id).style.transform=`rotateX(${f*-100}deg)`; $(id).style.opacity=f>=1?0:1}) }}
  // rating form, drumroll glow, STAMP, the big line
  {const on=s2&&t>=b.formIn&&t<b.stamp+0.75; const f=$("form"); f.style.opacity=on?Math.min(1,clamp((b.stamp+0.75-t)/0.15)):0;
   f.style.transform=`translateY(${(1-out((t-b.formIn)/0.3))*-80}px) rotate(${-1.5+(t>=b.stamp&&t<b.stamp+0.3?Math.sin(t*80)*1.5:0)}deg)`;
   const tp=$("top"); tp.className=t>=b.roll0&&t<b.stamp?"glow":""; tp.style.transform=`scale(${t>=b.roll0&&t<b.stamp?1+0.05*Math.sin(t*30):1})`;
   tp.querySelector("i").style.transform=`scaleX(${t>=b.stamp+0.08?out((t-b.stamp-0.08)/0.15):0}) rotate(-6deg)`;
   const sp=$("stamp"), son=s2&&t>=b.stamp-0.06&&t<b.stamp+0.75; sp.style.opacity=son?f.style.opacity:0; sp.style.left="300px"; sp.style.top="560px";
   const sk=clamp((t-b.stamp+0.06)/0.06); sp.style.transform=`rotate(-14deg) scale(${lerp(2.6,1,sk)})`;
   show("bigR",s2&&t>=b.stamp+0.7&&t<b.stomp[0],pop(t,b.stamp+0.7,0.3),`rotate(-2deg)`)}
  // follow tap (L4)
  const fA=b.fol0, fB=b.fol1+0.15; const fOn=t>fA&&t<fB; const fol=$("fol"); fol.style.opacity=fOn?clamp(Math.min((t-fA)/0.2,(fB-t)/0.12)):0;
  fol.style.transform=`scale(${Math.max(0.01,back((t-fA)/0.4))*(Math.abs(t-b.tFol)<0.1?0.9:1)})`;
  const bF=$("bF"); bF.textContent=t<b.tFol?"+ FOLLOW":"FOLLOWING ✓"; bF.className="btn"+(t<b.tFol?"":" done");
  {const hand=$("tapHand"); const hk=ease((t-fA-0.1)/Math.max(0.3,b.tFol-fA-0.2)); const dip=Math.max(0,1-Math.abs(t-b.tFol)/0.1);
   hand.style.opacity=fOn?clamp(Math.min((t-fA-0.05)/0.15,(fB-t)/0.12)):0; hand.style.transform=`translate(${lerp(900,560,hk)-50}px,${lerp(1200,830,hk)+dip*12}px) rotate(${-8+dip*6}deg)`;
   const rg_=$("ring"), rk=(t-b.tFol)/0.45; rg_.style.opacity=fOn&&rk>0&&rk<1?1-rk:0; rg_.style.left="560px"; rg_.style.top="830px"; rg_.style.transform=`scale(${1+rk*6})`}
  // 'నీ దుంప తెగ!' stamps over the freeze
  show("dumpa",(frozen&&t>=b.tNee-0.04)||(t>=b.frz1&&t<b.frz1+0.15),lerp(1.9,1,out((t-b.tNee+0.04)/0.15)),`rotate(-4deg)`);
  // the silent punch card: two halves, word by word; then it rides up for the comment prompt
  {const c=$("card"), on=t>=b.card1&&t<b.s13; c.style.opacity=on?Math.min(clamp((t-b.card1)/0.12),clamp((b.s13-t)/0.15)):0;
   const up=t>=b.c12?out((t-b.c12)/0.35):0; c.style.transform=`translateY(${-60*up}px) scale(${lerp(Math.max(0.01,back((t-b.card1)/0.35)),0.86,up)}) rotate(-1deg)`;
   L1W.forEach((_,i)=>{const w=$("w1_"+i), t0=b.card1+0.12+i*0.13; w.style.opacity=t>=t0?1:0; w.style.transform=`scale(${Math.max(0.01,pop(t,t0,0.2))})`});
   L2W.forEach((_,i)=>{const w=$("w2_"+i), t0=b.card2+i*0.12; w.style.opacity=t>=t0?1:0; w.style.transform=`scale(${Math.max(0.01,pop(t,t0,0.2))*(t>=b.rim&&t<b.rim+0.25?1+0.08*Math.sin((t-b.rim)/0.25*Math.PI):1)})`})}
  // confetti on the HOORAY
  CONF.forEach((r_,i)=>{const t0=b.hooray+hash(i)*0.5, k=t-t0; const on=k>0&&k<2.6&&t<b.s13;
    if(!on){r_.setAttribute("opacity",0);return} const x=hash(i+7)*1080+Math.sin(k*3+i)*40, y=-30+k*(420+hash(i+3)*260);
    r_.setAttribute("opacity",1); r_.setAttribute("transform",`translate(${x},${y}) rotate(${k*360*(hash(i+11)-0.5)*2+i*20})`)});
  // comment prompt + bubbles (L12)
  show("cq",t>b.c12+0.1&&t<b.s13,pop(t,b.c12+0.1,0.35)*(1+0.03*Math.sin(t*10)),`rotate(-1.5deg)`);
  CB.forEach((_,i)=>{const e=$("cb"+i), t0=b.tCm+0.05+i*0.11; const v=t>t0&&t<b.s13; e.style.opacity=v?1:0; e.style.transform=`translateY(${-(t-t0)*14}px) scale(${Math.max(0.01,pop(t,t0,0.3))}) rotate(${(i%2?3:-3)}deg)`});
  // share: tag your manager
  {const shOn=t>b.s13&&t<b.end0+0.1; const sh=$("share"); sh.style.opacity=shOn?clamp(Math.min((t-b.s13)/0.2,(b.end0+0.1-t)/0.12)):0;
   $("sq").style.transform=`scale(${Math.max(0.01,back((t-b.s13)/0.4))})`;
   const tA=b.s13+0.35; $("cin").innerHTML=t>tA?(t>b.tTag+0.05?'<em>@My Manager 👔</em> 😅':"@"+(t>tA+0.25?"My M":"")):"";
   ["ct1","ct2","ct3"].forEach((id,i)=>{const e=$(id), t0=tA+0.1+i*0.08; e.style.opacity=t>t0?1:0; e.style.transform=`translateY(${lerp(30,0,out((t-t0)/0.25))}px) scale(${id==="ct1"&&Math.abs(t-b.tTag)<0.1?0.94:1})`; e.style.background=id==="ct1"&&t>b.tTag?"#FFF3B0":"#fff"});
   $("ok1").style.opacity=t>b.tTag+0.05?1:0}
  // end card + the ticking clock (tick-tick-ting callback)
  {const ec=$("endc"), eOn=t>b.end0; ec.style.opacity=eOn?clamp((t-b.end0)/0.12):0;
   $("eF").textContent=t<b.tEF?"FOLLOW @_REELRASAM":"FOLLOWING ✓  @_REELRASAM"; $("eF").style.transform=`scale(${Math.abs(t-b.tEF)<0.1?0.92:1})`; $("eF").style.background=t<b.tEF?"":"#6D6875";
   const eh=$("eHand"), ek=ease((t-b.end0)/Math.max(0.2,b.tEF-b.end0-0.05)), edip=Math.max(0,1-Math.abs(t-b.tEF)/0.1);
   eh.style.opacity=eOn&&t<b.tEF+0.3?clamp((b.tEF+0.3-t)/0.12):0; eh.style.transform=`translate(${lerp(900,300,ek)-50}px,${lerp(1300,690,ek)+edip*12}px) scale(${1-0.1*edip}) rotate(-8deg)`;   // taps FOLLOW (left part), then leaves
   const n=b.eTick.filter(x=>t>=x).length+(t>=b.eTing?1:0); $("eSec").setAttribute("transform",`rotate(${n*6})`); $("eM").setAttribute("transform",`rotate(60)`); $("eH").setAttribute("transform",`rotate(305)`);
   $("eclk").style.transform=`scale(${t>=b.eTing&&t<b.eTing+0.3?1+0.1*Math.sin((t-b.eTing)/0.3*Math.PI):1})`}
  // flashes (coloured): DHOOM, STAMP, the door bang, DHAN x3, the freeze, the DONK
  {const fl=(t0,d,a_)=>t>t0&&t<t0+d?a_*(1-(t-t0)/d):0; let a=0,col="#FFFFFF";
   const add=(t0,d,a_,c)=>{const v=fl(t0,d,a_); if(v>a){a=v;col=c}};
   add(b.dhoom,0.12,0.5,"#FF5A3C"); add(b.stamp,0.1,0.45,"#FFFFFF"); add(b.bang,0.12,0.55,"#FFFFFF"); add(b.dhan[0],0.12,0.55,"#E53935"); add(b.dhan[1],0.12,0.55,"#FFD54F"); add(b.dhan[2],0.16,0.6,"#FFFFFF");
   add(b.frz0,0.12,0.5,"#FFFFFF"); add(b.donk,0.1,0.4,"#FFFFFF"); add(b.flip0,0.08,0.3,"#FFFFFF");
   $("flash").style.opacity=a; $("flash").style.background=col}
  // subtitles (… -> ...)
  const sub=$("sub"), L=curLine(t);
  if(L){sub.style.opacity=1; sub.innerHTML=`<span class="who" style="background:${COLORS[L.who]}">${NAMES[L.who]}</span><br>${subFix(L.text)}`} else sub.style.opacity=0;
}
function show(id,on,s=1,extra=""){const e=$(id); e.style.opacity=on?1:0; if(on) e.style.transform=`${extra} scale(${Math.max(0.01,s)})`}

window.render=function(t){ frame(t) };
