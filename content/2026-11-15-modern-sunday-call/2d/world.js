// Modern dilemma #1 "the 10-minute Sunday call" — drawn world, cast and choreography (loaded by ep.html).
const NS="http://www.w3.org/2000/svg", svg=document.getElementById("s"), absvg=document.getElementById("ab"), nar=document.getElementById("nar");
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
// comment bubbles during the countdown (generic names; none hints at the runbook or Kiran)
const CB=[["Anil","A — appraisal ముఖ్యం bro","#1E88E5",40,1150],["Divya","B — Sunday is Sunday!","#D81B60",560,1230],["Teja","10 mins అంటే 3 hrs 😂","#2E7D32",60,1320],
          ["Anu","Boot లో laptop... too real 💀","#8E24AA",400,1660],["Karthik","A, client wait చేయడు","#E65100",30,1760],["Sneha","🤔","#00897B",880,1400]];
$("cbs").innerHTML=CB.map(([n,g,c,x,y],i)=>`<div class="cb" id="cb${i}" style="left:${x}px;top:${y}px"><b style="color:${c}">${n}</b><i>${g}</i></div>`).join("");
$("bars").innerHTML=[...Array(10)].map((_,i)=>`<i id="bar${i}"></i>`).join("");

// ---------- defs + camera ----------
const defs=el("defs",{});
const lg=(id,stops,x2=0,y2=1,parent=defs)=>{const g=el("linearGradient",{id,x1:0,y1:0,x2,y2},parent);stops.forEach(([o,c])=>el("stop",{offset:o,"stop-color":c},g));return g};
lg("sky",[["0","#9ED3F0"],["1","#DDF1FA"]]);
const cam=el("g",{});
applySkin(cam, defs);
el("rect",{x:-900,y:-900,width:9900,height:3900,fill:"#3A2A22"},cam);

// ===== HOME (x 0..1080): a Kukatpally flat, Sunday 1:02 PM, Amma & Nanna's 30th anniversary lunch =====
el("rect",{x:-900,y:-700,width:2900,height:1900,fill:"#F2C79A"},cam);                 // warm wall
el("rect",{x:-900,y:1010,width:2900,height:200,fill:"#E3AE78"},cam);
el("rect",{x:-900,y:1004,width:2900,height:12,fill:"#C98F5A"},cam);
// door (left) with a marigold toran
el("rect",{x:-150,y:300,width:300,height:900,fill:"#8D5A34",stroke:INK,"stroke-width":7},cam);
el("rect",{x:-120,y:330,width:240,height:860,fill:"#A86D40",stroke:"#6E4424","stroke-width":5},cam);
for(let i=0;i<14;i++){const x=-150+i*23, y=300+Math.sin(i/13*Math.PI)*34; el("circle",{cx:x,cy:y,r:15,fill:i%2?"#FFB300":"#FB8C00",stroke:"#B35A00","stroke-width":2},cam);
  if(i%3===1) el("path",{d:`M${x-8} ${y+12} L${x} ${y+52} L${x+8} ${y+12} Z`,fill:"#3E8E41",stroke:"#1F5E22","stroke-width":2},cam)}
[[-150,300],[150,300]].forEach(([x,y])=>{for(let k=0;k<6;k++) el("circle",{cx:x,cy:y+20+k*26,r:12,fill:k%2?"#FFB300":"#FB8C00",stroke:"#B35A00","stroke-width":2},cam)});
// bunting across the wall
for(let i=0;i<16;i++){const x=-60+i*80; el("path",{d:`M${x} 210 L${x+70} 214 L${x+35} 280 Z`,fill:["#E53935","#FDD835","#43A047","#1E88E5","#8E24AA"][i%5],stroke:INK,"stroke-width":3},cam)}
el("path",{d:"M-80 208 Q540 226 1160 208",stroke:INK,"stroke-width":4,fill:"none"},cam);
// window (right) with curtains and a grill
el("rect",{x:770,y:330,width:280,height:330,fill:"url(#sky)",stroke:INK,"stroke-width":7},cam);
el("ellipse",{cx:900,cy:590,rx:180,ry:40,fill:"#B8DCA8"},cam);
for(let i=1;i<6;i++) el("line",{x1:770+i*46,y1:330,x2:770+i*46,y2:660,stroke:"#8A949E","stroke-width":5},cam);
el("path",{d:"M750 320 Q790 500 760 680 L800 680 Q830 500 800 320 Z",fill:"#C2185B",stroke:INK,"stroke-width":4},cam);
el("path",{d:"M1070 320 Q1030 500 1060 680 L1020 680 Q990 500 1020 320 Z",fill:"#C2185B",stroke:INK,"stroke-width":4},cam);
el("rect",{x:740,y:308,width:340,height:18,rx:8,fill:"#6D4C41",stroke:INK,"stroke-width":4},cam);
// wall clock (spins in L3)
const clockG=el("g",{transform:"translate(560,420)"},cam);
el("circle",{r:78,fill:"#FFFDF5",stroke:"#6D4C41","stroke-width":12},clockG);
for(let k=0;k<12;k++){const a=k/12*Math.PI*2; el("line",{x1:Math.sin(a)*56,y1:-Math.cos(a)*56,x2:Math.sin(a)*66,y2:-Math.cos(a)*66,stroke:INK,"stroke-width":k%3?3:6},clockG)}
const hrH=el("line",{x1:0,y1:0,x2:0,y2:-34,stroke:INK,"stroke-width":8,"stroke-linecap":"round"},clockG);
const mnH=el("line",{x1:0,y1:0,x2:0,y2:-54,stroke:INK,"stroke-width":5,"stroke-linecap":"round"},clockG);
el("circle",{r:7,fill:"#D7263D"},clockG);
// framed wedding photo (two simple faces, 1996)
const ph=el("g",{transform:"translate(330,430) rotate(-3)"},cam);
el("rect",{x:-80,y:-64,width:160,height:128,rx:6,fill:"#F5E6C8",stroke:"#8D5A34","stroke-width":10},ph);
el("circle",{cx:-28,cy:-6,r:22,fill:"#C68C62"},ph); el("circle",{cx:28,cy:-8,r:22,fill:"#B87D55"},ph);
el("path",{d:"M-56 64 Q-28 20 0 64 Z",fill:"#B0204A"},ph); el("path",{d:"M0 64 Q28 18 56 64 Z",fill:"#F2F2EE"},ph);
txt("1996",{x:0,y:-38,"font-family":"Anton","font-size":20,"text-anchor":"middle",fill:"#8D5A34"},ph);

// ===== CAR PARK (x CO..): the apartment basement, Nikhil's car with the laptop in the boot =====
const CO=3000;
el("rect",{x:CO-700,y:-700,width:2500,height:1900,fill:"#A7ADB5"},cam);
el("rect",{x:CO-700,y:-700,width:2500,height:560,fill:"#8C939C"},cam);
[[CO-100,420],[CO+300,440],[CO+800,420]].forEach(([x,y])=>{el("rect",{x,y:-140,width:22,height:y+140,fill:"#7A818A"},cam); el("rect",{x:x-40,y,width:102,height:20,rx:8,fill:"#FFF8E1",stroke:INK,"stroke-width":4},cam)});
el("rect",{x:CO-700,y:300,width:2500,height:26,fill:"#7A818A"},cam);
const pillar=(x)=>{el("rect",{x,y:330,width:160,height:1000,fill:"#BFC5CC",stroke:INK,"stroke-width":6},cam);
  for(let k=0;k<6;k++) el("rect",{x,y:1180+k*0,width:160,height:150,fill:k%2?"#10141E":"#FDD835",opacity:0},cam);
  for(let k=0;k<5;k++) el("path",{d:`M${x} ${1190+k*30} L${x+160} ${1160+k*30} L${x+160} ${1175+k*30} L${x} ${1205+k*30} Z`,fill:k%2?"#10141E":"#FDD835"},cam)};
pillar(CO-120); pillar(CO+1040);
txt("B1",{x:CO-40,y:560,"font-family":"Anton","font-size":90,"text-anchor":"middle",fill:"#2D6CDF"},cam);
el("rect",{x:CO-700,y:1300,width:2500,height:900,fill:"#6E737A"},cam);
el("rect",{x:CO-700,y:1300,width:2500,height:10,fill:"#5A5F66"},cam);
[CO+120,CO+960].forEach(x=>el("path",{d:`M${x} 1310 L${x-60} 2000`,stroke:"#F5F5F5","stroke-width":14},cam));
function drawCar(parent,ox,oy){   // rear view of a small red hatchback (no badge, plate left blank)
  const g=el("g",{transform:`translate(${ox},${oy})`},parent);
  el("path",{d:"M-300 150 Q-280 -20 0 -30 Q280 -20 300 150 Z",fill:"#B71C1C",stroke:INK,"stroke-width":7},g);
  el("path",{d:"M-240 140 Q-226 20 0 12 Q226 20 240 140 Z",fill:"#2E3A4E",stroke:INK,"stroke-width":5},g);
  el("rect",{x:-360,y:140,width:720,height:390,rx:64,fill:"#C62828",stroke:INK,"stroke-width":7},g);
  [-1,1].forEach(s=>{el("path",{d:`M${s*350} 180 L${s*270} 180 L${s*270} 300 L${s*350} 300 Z`,fill:"#FF7043",stroke:INK,"stroke-width":5},g); el("rect",{x:s>0?272:-348,y:240,width:76,height:30,fill:"#FFCDD2"},g)});
  el("rect",{x:-380,y:450,width:760,height:90,rx:30,fill:"#37474F",stroke:INK,"stroke-width":6},g);
  [-1,1].forEach(s=>el("rect",{x:s*280-60,y:520,width:120,height:70,rx:20,fill:"#1A1A1A"},g));
  const cav=el("g",{},g);   // the open boot: dark cavity, laptop bag, glow
  el("rect",{x:-250,y:150,width:500,height:280,rx:20,fill:"#2A2A30",stroke:INK,"stroke-width":5},cav);
  const glow=el("g",{},cav); [150,110,75].forEach((r,k)=>el("ellipse",{cx:0,cy:300,rx:r*1.5,ry:r,fill:"#FFE082",opacity:.18+k*.08},glow));
  el("path",{d:"M-150 410 L-150 280 Q-150 250 -120 250 L120 250 Q150 250 150 280 L150 410 Z",fill:"#212121",stroke:INK,"stroke-width":5},cav);
  el("path",{d:"M-70 250 Q0 180 70 250",stroke:"#424242","stroke-width":14,fill:"none"},cav);
  const lp=el("g",{transform:"rotate(-12 0 250)"},cav);   // the laptop sticking out of the bag
  el("rect",{x:-110,y:170,width:220,height:100,rx:8,fill:"#B0BEC5",stroke:INK,"stroke-width":5},lp); el("rect",{x:-96,y:182,width:192,height:76,rx:4,fill:"#9FD8FF"},lp);
  el("circle",{cx:0,cy:220,r:12,fill:"#fff",opacity:.8},lp);
  el("rect",{x:-60,y:320,width:120,height:40,rx:8,fill:"#424242"},cav);
  const lid=el("g",{},g);   // boot lid (closed)
  el("rect",{x:-260,y:142,width:520,height:300,rx:30,fill:"#D32F2F",stroke:INK,"stroke-width":6},lid);
  el("rect",{x:-100,y:340,width:200,height:60,rx:8,fill:"#FAFAFA",stroke:INK,"stroke-width":4},lid);
  const lidUp=el("g",{},g);   // boot lid swung up (underside)
  el("path",{d:"M-262 150 L-230 -120 L230 -120 L262 150 Z",fill:"#8E1B1B",stroke:INK,"stroke-width":6},lidUp);
  el("path",{d:"M-200 120 L-180 -80 L180 -80 L200 120 Z",fill:"#5D1414"},lidUp);
  return {g,cav,glow,lid,lidUp};
}
const CAR=drawCar(cam,CO+540,830);

// ===== OFFICE (x OO..): Suresh at his desk, Sunday, P1 escalation (drawn normally; the neon skin makes it glow) =====
const OO=6000;
el("rect",{x:OO-700,y:-700,width:2500,height:1900,fill:"#2B3A5C"},cam);
for(let i=0;i<9;i++) el("rect",{x:OO-600+i*280,y:180,width:240,height:110,rx:8,fill:"#22304E",stroke:"#5C7CB8","stroke-width":4},cam);   // blinds
const monG=[[OO+60,"#FF4D5E"],[OO+590,"#3FD6FF"]].map(([x,c])=>{const g=el("g",{},cam);
  el("rect",{x,y:330,width:440,height:300,rx:14,fill:"#0E1424",stroke:c,"stroke-width":10},g); el("rect",{x:x+200,y:630,width:40,height:90,fill:"#5C6B85"},g); el("rect",{x:x+150,y:715,width:140,height:20,rx:8,fill:"#5C6B85"},g); return g});
el("rect",{x:OO-700,y:1180,width:2500,height:44,fill:"#4A5C80",stroke:INK,"stroke-width":6},cam);
el("rect",{x:OO-700,y:1222,width:2500,height:700,fill:"#33415F",stroke:INK,"stroke-width":6},cam);
const mug=el("g",{transform:`translate(${OO+180},1180)`},cam); el("path",{d:"M-30 -74 L30 -74 L26 0 L-26 0 Z",fill:"#ECEFF1",stroke:INK,"stroke-width":5},mug); el("path",{d:"M30 -60 Q56 -50 30 -24",stroke:INK,"stroke-width":5,fill:"none"},mug);
[[OO+860,1120,"#FFEB3B",-6],[OO+920,1140,"#FF80AB",5]].forEach(([x,y,c,r])=>el("rect",{x:x-36,y:y-36,width:72,height:72,fill:c,stroke:INK,"stroke-width":4,transform:`rotate(${r} ${x} ${y})`},cam));
const alarm=el("circle",{cx:OO+980,cy:260,r:30,fill:"#FF1744",stroke:INK,"stroke-width":5},cam);

// ---------- adult characters (front view; local y=0 at the hip) ----------
function ik(sx,sy,tx,ty,a,b,side){let dx=tx-sx,dy=ty-sy,d=Math.hypot(dx,dy)||1; const dd=Math.min(d,a+b-1); dx/=d; dy/=d;
  const base=Math.atan2(dy,dx), cA=clamp((a*a+dd*dd-b*b)/(2*a*dd),-1,1), al=Math.acos(cA);
  const c1=[sx+Math.cos(base+al)*a,sy+Math.sin(base+al)*a], c2=[sx+Math.cos(base-al)*a,sy+Math.sin(base-al)*a];
  const sc=p=>p[1]+side*p[0]*0.6; const e=sc(c1)>sc(c2)?c1:c2; return [e,[sx+dx*dd,sy+dy*dd]]}
function makeAdult(o){
  const g=el("g",{},o.parent||cam), body=el("g",{},g);
  const hairBack=el("g",{},body);
  if(o.bun){ el("circle",{cx:0,cy:-84,r:36,fill:o.hair,stroke:INK,"stroke-width":3},hairBack);
    for(let k=0;k<9;k++){const a=Math.PI*(1.05+k*0.11); el("circle",{cx:Math.cos(a)*40,cy:-84+Math.sin(a)*40,r:7,fill:"#FFFDF5",stroke:"#C9C2B0","stroke-width":1.5},hairBack)}}
  if(o.saree){   // blouse + saree skirt + pallu across the chest (gold border)
    el("path",{d:"M-70 -60 L70 -60 L96 230 L-96 230 Z",fill:o.saree.base,stroke:INK,"stroke-width":5},body);
    for(let k=-2;k<=2;k++) el("line",{x1:k*22,y1:-40,x2:k*30,y2:226,stroke:INK,"stroke-width":2,opacity:.3},body);
    el("path",{d:"M-88 -268 Q-92 -288 -64 -292 L-24 -300 L24 -300 L64 -292 Q92 -288 88 -268 L76 -50 L-76 -50 Z",fill:o.shirt,stroke:INK,"stroke-width":5},body);
    el("path",{d:"M-28 -300 Q0 -262 28 -300",fill:o.skin,stroke:INK,"stroke-width":3},body);
    el("path",{d:"M-76 -120 Q0 -100 76 -120 L76 -50 L-76 -50 Z",fill:o.skin,stroke:INK,"stroke-width":3},body);   // midriff
    el("path",{d:"M-92 -262 L-40 -300 L96 -100 L90 -10 L60 -10 Z",fill:o.saree.pallu,stroke:INK,"stroke-width":5,"stroke-linejoin":"round"},body);
    el("path",{d:"M-84 -258 L-38 -290 L92 -98",stroke:o.saree.border,"stroke-width":9,fill:"none"},body);
    el("path",{d:"M-70 -230 L70 -40",stroke:o.saree.border,"stroke-width":6,fill:"none",opacity:.8},body);
    el("path",{d:"M-96 226 L96 226",stroke:o.saree.border,"stroke-width":14},body);
  } else {
    el("path",{d:"M-94 -268 Q-98 -288 -70 -292 L-26 -300 L26 -300 L70 -292 Q98 -288 94 -268 L82 -10 Q80 0 66 0 L-66 0 Q-80 0 -82 -10 Z",fill:o.shirt,stroke:INK,"stroke-width":5},body);
    el("path",{d:"M-24 -300 L0 -268 L24 -300",fill:o.skin},body);
    el("path",{d:"M-28 -302 L-4 -260 L-40 -276 Z",fill:o.collar||o.shirt,stroke:INK,"stroke-width":4,"stroke-linejoin":"round"},body);
    el("path",{d:"M28 -302 L4 -260 L40 -276 Z",fill:o.collar||o.shirt,stroke:INK,"stroke-width":4,"stroke-linejoin":"round"},body);
    el("line",{x1:0,y1:-262,x2:0,y2:0,stroke:INK,"stroke-width":3,opacity:.55},body);
    [-225,-170,-115,-60].forEach(y=>el("circle",{cx:6,cy:y,r:4,fill:o.button||"#9A9AA6"},body));
    el("path",{d:"M-60 -200 L-30 -200 L-30 -170 L-60 -170 Z",fill:"none",stroke:INK,"stroke-width":3,opacity:.45},body);   // pocket
    if(o.pen) el("rect",{x:-52,y:-214,width:8,height:34,rx:3,fill:o.pen},body);
  }
  el("rect",{x:-19,y:-334,width:38,height:44,fill:o.skin},body);
  if(o.specChain){ el("path",{d:"M-26 -300 Q-30 -230 0 -206 Q30 -230 26 -300",stroke:"#D4A537","stroke-width":3,fill:"none"},body);
    [-15,15].forEach(x=>el("ellipse",{cx:x,cy:-200,rx:13,ry:9,fill:"rgba(220,240,255,.5)",stroke:"#6D4C41","stroke-width":3},body))}
  if(o.badge){ el("path",{d:"M-24 -300 Q-22 -230 -12 -172",stroke:"#2D6CDF","stroke-width":8,fill:"none"},body); el("path",{d:"M24 -300 Q22 -230 12 -172",stroke:"#2D6CDF","stroke-width":8,fill:"none"},body);
    const bd=el("g",{transform:"translate(0,-122)"},body);
    el("rect",{x:-40,y:-52,width:80,height:104,rx:8,fill:"#fff",stroke:INK,"stroke-width":3.5},bd);
    el("rect",{x:-40,y:-52,width:80,height:24,rx:6,fill:"#2D6CDF"},bd);
    el("rect",{x:-14,y:-22,width:28,height:30,rx:3,fill:"#C9D6E3"},bd); el("circle",{cx:0,cy:-11,r:7,fill:"#8A5A3B"},bd);
    txt(o.badge[0],{x:0,y:26,"font-family":"Anton","font-size":17,"text-anchor":"middle",fill:INK},bd);
    txt(o.badge[1],{x:0,y:44,"font-family":"Anton","font-size":12.5,"text-anchor":"middle",fill:"#2D6CDF","letter-spacing":1},bd)}
  // arms (2-bone; rolled sleeves = a cuff band at the elbow)
  const arm=s=>({up:el("line",{stroke:o.sleeve||o.shirt,"stroke-width":32,"stroke-linecap":"round"},body),
                 lo:el("line",{stroke:o.fore||o.sleeve||o.shirt,"stroke-width":28,"stroke-linecap":"round"},body),
                 cuff:o.cuff?el("line",{stroke:o.cuff,"stroke-width":34,"stroke-linecap":"round"},body):null,
                 hand:el("circle",{r:17,fill:o.skin,stroke:INK,"stroke-width":3},body)});
  const AL=arm(-1), AR=arm(1);
  const itemG=el("g",{},body), items={}, itemGL=el("g",{},body), itemsL={};
  const phoneShape=p=>{el("rect",{x:-17,y:-36,width:34,height:64,rx:8,fill:"#222",stroke:INK,"stroke-width":3},p); return el("rect",{x:-12,y:-30,width:24,height:50,rx:4,fill:"#BFE6FF"},p)};
  items.phone=el("g",{},itemG); phoneShape(items.phone);
  itemsL.phone=el("g",{},itemGL); phoneShape(itemsL.phone);
  items.fork=el("g",{},itemG); el("path",{d:"M0 30 L0 -30",stroke:"#B0BEC5","stroke-width":6,"stroke-linecap":"round"},items.fork);
  [-8,0,8].forEach(x=>el("line",{x1:x,y1:-30,x2:x,y2:-50,stroke:"#B0BEC5","stroke-width":3.5},items.fork)); el("ellipse",{cx:0,cy:-50,rx:14,ry:9,fill:"#F2C230",stroke:"#B8860B","stroke-width":2},items.fork);
  itemsL.fork=el("g",{},itemGL); el("path",{d:"M0 30 L0 -30",stroke:"#B0BEC5","stroke-width":6,"stroke-linecap":"round"},itemsL.fork);
  [-8,0,8].forEach(x=>el("line",{x1:x,y1:-30,x2:x,y2:-50,stroke:"#B0BEC5","stroke-width":3.5},itemsL.fork)); el("ellipse",{cx:0,cy:-50,rx:14,ry:9,fill:"#F2C230",stroke:"#B8860B","stroke-width":2},itemsL.fork);
  // head
  const head=el("g",{},body);
  el("ellipse",{cx:-55,cy:2,rx:10,ry:17,fill:o.skin,stroke:INK,"stroke-width":3},head); el("ellipse",{cx:55,cy:2,rx:10,ry:17,fill:o.skin,stroke:INK,"stroke-width":3},head);
  el("path",{d:"M-54 -22 Q-56 -72 0 -74 Q56 -72 54 -22 Q54 30 30 56 Q0 74 -30 56 Q-54 30 -54 -22 Z",fill:o.skin,stroke:INK,"stroke-width":4},head);
  if(o.earrings) [-55,55].forEach(x=>el("circle",{cx:x,cy:24,r:7,fill:"#F5B347",stroke:INK,"stroke-width":2},head));
  const face=el("g",{},head);
  if(o.stubble){el("path",{d:"M-52 8 Q-50 42 -28 58 Q0 76 28 58 Q50 42 52 8 Q42 30 22 33 Q0 29 -22 33 Q-42 30 -52 8 Z",fill:o.stubble,opacity:.34},face);
    el("path",{d:"M-20 31 Q0 24 20 31 Q0 35 -20 31 Z",fill:o.stubble,opacity:.4},face);
    for(let k=0;k<26;k++){const a=hash(k+3)*Math.PI, r=40+hash(k+7)*12; el("circle",{cx:Math.cos(a)*r*1.05,cy:22+Math.sin(a)*r*0.82,r:1.6,fill:o.stubble,opacity:.5},face)}}
  el("circle",{cx:-34,cy:20,r:11,fill:"#E57373",opacity:o.blush||0.18},face); el("circle",{cx:34,cy:20,r:11,fill:"#E57373",opacity:o.blush||0.18},face);
  if(o.bags) [-21,21].forEach(x=>el("path",{d:`M${x-12} 4 Q${x} 11 ${x+12} 4`,stroke:"#6A3A2A","stroke-width":2.5,fill:"none",opacity:.55},face));
  if(o.lines) [-21,21].forEach(x=>{el("path",{d:`M${x-13} 7 Q${x} 13 ${x+13} 7`,stroke:"#7A4A2A","stroke-width":2,fill:"none",opacity:.5},face); el("path",{d:`M${x*1.9} -14 l${x>0?6:-6} 4 M${x*1.9} -8 l${x>0?7:-7} 2`,stroke:"#7A4A2A","stroke-width":2,opacity:.5},face)});
  const eyes=[-21,21].map(x=>{const e=el("g",{transform:`translate(${x},-8)`},face);
    const w=el("ellipse",{rx:12,ry:8,fill:o.eyeWhite||"#fff",stroke:INK,"stroke-width":2},e);
    const ir=el("circle",{r:6.5,fill:"#3B2414"},e); const pu=el("circle",{r:3,fill:"#000"},e); const hl=el("circle",{r:2,fill:"#fff"},e);
    const lid=el("path",{d:"M-13 -3 Q0 -11 13 -3",stroke:INK,"stroke-width":o.lash||3.5,fill:"none","stroke-linecap":"round"},e);
    const cover=el("ellipse",{rx:13,ry:9,fill:o.skin,opacity:0},e); const shut=el("path",{d:"M-12 1 Q0 6 12 1",stroke:INK,"stroke-width":3.5,fill:"none","stroke-linecap":"round",opacity:0},e);
    const glint=el("ellipse",{cx:0,cy:8,rx:11,ry:3,fill:"#CFEFFF",opacity:0},e);
    return {e,w,ir,pu,hl,lid,cover,shut,glint}});
  const brows=[-1,1].map(s=>el("path",{stroke:o.browCol||"#1C1410","stroke-width":o.brow||6,fill:"none","stroke-linecap":"round"},face));
  el("path",{d:"M3 0 Q-5 20 -2 26 Q4 29 10 25",stroke:"#7A4A2A","stroke-width":3,fill:"none","stroke-linecap":"round"},face);
  if(o.bindi) el("circle",{cx:0,cy:-36,r:5.5,fill:"#C62828"},face);
  const mouthO=el("ellipse",{cx:0,cy:44,rx:12,ry:3,fill:"#5A1E1E"},face);
  const lips=el("path",{d:"M-14 43 Q0 47 14 43",stroke:o.lip||"#8A3A3A","stroke-width":4,fill:"none","stroke-linecap":"round"},face);
  const smile=el("path",{d:"M-18 39 Q0 56 18 39",stroke:o.lip||"#8A3A3A","stroke-width":4.5,fill:"none","stroke-linecap":"round",opacity:0},face);
  const sad=el("path",{d:"M-14 48 Q0 39 14 48",stroke:o.lip||"#8A3A3A","stroke-width":4.5,fill:"none","stroke-linecap":"round",opacity:0},face);
  const smirk=el("path",{d:"M-14 44 Q4 49 19 37",stroke:o.lip||"#8A3A3A","stroke-width":4.5,fill:"none","stroke-linecap":"round",opacity:0},face);
  const wince=el("path",{d:"M-16 44 L-8 40 L0 45 L8 40 L16 44",stroke:o.lip||"#8A3A3A","stroke-width":4,fill:"none","stroke-linecap":"round","stroke-linejoin":"round",opacity:0},face);
  if(o.moustache){ el("path",{d:"M-30 30 Q-16 18 0 25 Q16 18 30 30 Q34 40 24 41 Q12 34 0 37 Q-12 34 -24 41 Q-34 40 -30 30 Z",fill:o.moustache,stroke:INK,"stroke-width":2},face)}
  if(o.glasses){ [-21,21].forEach(x=>el("rect",{x:x-17,y:-14,width:34,height:22,rx:9,fill:"rgba(220,240,255,.25)",stroke:o.glasses,"stroke-width":3.5},face));
    el("path",{d:"M-4 -6 Q0 -10 4 -6",stroke:o.glasses,"stroke-width":3.5,fill:"none"},face); [-1,1].forEach(s=>el("line",{x1:s*38,y1:-8,x2:s*52,y2:-12,stroke:o.glasses,"stroke-width":3.5},face))}
  const sweat=[[-40,-40],[44,-30]].map(([x,y])=>el("path",{d:`M${x} ${y-9} Q${x+7} ${y+2} ${x} ${y+6} Q${x-7} ${y+2} ${x} ${y-9} Z`,fill:"#9FDcFF",stroke:INK,"stroke-width":1.5,opacity:0},face));
  // hair (front)
  if(o.bun) el("path",{d:"M-58 -6 Q-64 -88 0 -90 Q64 -88 58 -6 Q52 -50 30 -58 Q10 -64 2 -84 Q-8 -64 -30 -58 Q-52 -50 -58 -6 Z",fill:o.hair,stroke:INK,"stroke-width":3},head);
  else el("path",{d:o.recede?"M-58 -10 Q-66 -70 -36 -84 Q0 -96 40 -84 Q64 -66 58 -10 L56 -8 Q54 -46 42 -56 Q20 -50 0 -64 Q-22 -52 -42 -58 Q-54 -46 -56 -8 Z":"M-58 -10 Q-66 -84 -6 -90 Q56 -94 62 -28 L58 -8 Q54 -48 30 -56 Q2 -62 -26 -54 Q-50 -46 -54 -8 Z",fill:o.hair,stroke:INK,"stroke-width":3},head);
  if(o.grey) [[-52,-30,-46,-56],[-48,-20,-40,-50],[52,-30,46,-56],[48,-22,40,-50]].forEach(([x1,y1,x2,y2])=>el("line",{x1,y1,x2,y2,stroke:"#D0D0D0","stroke-width":3.5,"stroke-linecap":"round"},head));
  if(o.headset){ el("path",{d:"M-62 -6 Q-68 -104 0 -108 Q68 -104 62 -6",stroke:"#263238","stroke-width":10,fill:"none"},head);
    [-1,1].forEach(s=>el("ellipse",{cx:s*60,cy:2,rx:15,ry:24,fill:"#37474F",stroke:INK,"stroke-width":3},head));
    el("path",{d:"M62 18 Q58 56 22 50",stroke:"#37474F","stroke-width":6,fill:"none","stroke-linecap":"round"},head); el("circle",{cx:20,cy:50,r:7,fill:"#263238"},head)}
  [AL.hand,AR.hand,itemG,itemGL].forEach(x=>body.appendChild(x));   // hands + held props in front of the head
  const st={x:0,y:0,s:1,flip:1,rot:0,hop:0,vis:1,talk:0,blink:0,shut:0,look:0,lookY:0,brow:"n",smile:0,sad:0,smirk:0,wince:0,sweat:0,tear:0,headRot:0,headY:0,
            hL:[-60,-130],hR:[60,-130],item:"",itemL:"",itemRot:0,itemRotL:0,wink:0};
  const SH=[[-82,-270],[82,-270]];
  function draw(){
    const k=st; g.setAttribute("transform",`translate(${k.x},${k.y-k.hop}) rotate(${k.rot}) scale(${k.s*k.flip},${k.s})`); g.style.opacity=k.vis;
    const ht=`translate(${k.look*3},${-392+k.headY}) rotate(${k.headRot})`; head.setAttribute("transform",ht); hairBack.setAttribute("transform",ht);
    face.setAttribute("transform",`translate(${k.look*7},${k.lookY*3})`);
    [[AL,SH[0],k.hL,-1],[AR,SH[1],k.hR,1]].forEach(([A,S,T,side])=>{const [e,h]=ik(S[0],S[1],T[0],T[1],118,112,side);
      A.up.setAttribute("x1",S[0]);A.up.setAttribute("y1",S[1]);A.up.setAttribute("x2",e[0]);A.up.setAttribute("y2",e[1]);
      A.lo.setAttribute("x1",e[0]);A.lo.setAttribute("y1",e[1]);A.lo.setAttribute("x2",h[0]);A.lo.setAttribute("y2",h[1]);
      if(A.cuff){A.cuff.setAttribute("x1",e[0]);A.cuff.setAttribute("y1",e[1]);A.cuff.setAttribute("x2",lerp(e[0],h[0],0.18));A.cuff.setAttribute("y2",lerp(e[1],h[1],0.18))}
      A.hand.setAttribute("cx",h[0]);A.hand.setAttribute("cy",h[1]); A.h=h});
    itemG.setAttribute("transform",`translate(${AR.h[0]},${AR.h[1]}) rotate(${k.itemRot})`); for(const n in items) items[n].style.opacity=k.item===n?1:0;
    itemGL.setAttribute("transform",`translate(${AL.h[0]},${AL.h[1]}) rotate(${k.itemRotL})`); for(const n in itemsL) itemsL[n].style.opacity=k.itemL===n?1:0;
    const o_=k.talk, quiet=o_<0.12;
    mouthO.setAttribute("ry",2+12*o_); mouthO.setAttribute("rx",11+5*o_); mouthO.style.opacity=quiet?0:1;
    const W=quiet&&k.wince&&!k.smile;
    lips.style.opacity=quiet&&!k.smile&&!k.sad&&!k.smirk&&!W?1:0; smile.style.opacity=quiet&&k.smile?1:0; sad.style.opacity=quiet&&k.sad&&!k.smile&&!W?1:0; smirk.style.opacity=quiet&&k.smirk&&!k.smile&&!W?1:0; wince.style.opacity=W?1:0;
    eyes.forEach((E,i)=>{const closed=k.blink||k.shut||(k.wink&&i===1); E.cover.style.opacity=closed?1:0; E.shut.style.opacity=closed?1:0; E.lid.style.opacity=closed?0:1;
      E.w.setAttribute("ry",closed?1:8+(k.brow==="u"?1.5:0)); [E.ir,E.pu].forEach(p=>{p.setAttribute("cx",k.look*4.5);p.setAttribute("cy",k.lookY*3)}); E.hl.setAttribute("cx",k.look*4.5-2.5);E.hl.setAttribute("cy",k.lookY*3-2.5);
      [E.ir,E.pu,E.hl].forEach(p=>p.style.opacity=closed?0:1); E.glint.style.opacity=closed?0:k.tear*0.9});
    brows.forEach((b,i)=>{const s=i?1:-1; const B={n:[-27,-29],u:[-34,-36],s:[-24,-30],a:[-30,-22],q:i?[-36,-34]:[-26,-27],w:[-27,-33]}[k.brow]||[-27,-29];
      b.setAttribute("d",`M${s*8} ${B[0]} Q${s*20} ${(B[0]+B[1])/2-4} ${s*33} ${B[1]}`)});
    sweat.forEach((d,i)=>{d.style.opacity=k.sweat?1:0; d.setAttribute("transform",`translate(0,${k.sweat?((k.sweat*30+i*0.5)%1)*18:0})`)});
  }
  function aim(side,wx,wy){const lx=(wx-st.x)/(st.s*st.flip), ly=(wy-(st.y-st.hop))/st.s; if(side==="L") st.hL=[lx,ly]; else st.hR=[lx,ly]}
  return {st,draw,g,aim};
}
const NIKHIL_OPT={skin:"#C98B5E",hair:"#1C1410",shirt:"#45454D",collar:"#3A3A42",stubble:"#5A3A28",brow:6.5,lip:"#7A3A30"};
const SAROJA_OPT={skin:"#C68C62",hair:"#2A1E1A",shirt:"#1F6E5A",saree:{base:"#B0204A",pallu:"#C2185B",border:"#F2B53A"},sleeve:"#1F6E5A",fore:"#C68C62",bun:true,bindi:true,earrings:true,specChain:true,lines:true,brow:4.5,lash:4,blush:0.3,lip:"#9A3040"};
const PRASAD_OPT={skin:"#B87D55",hair:"#A8A8A8",shirt:"#F4F4EE",collar:"#E4E4DA",button:"#C9C9C0",moustache:"#D8D8D8",glasses:"#5D4037",recede:true,lines:true,pen:"#1E88E5",brow:6,browCol:"#8A8A8A",lip:"#7A3A30"};
const SURESH_OPT={skin:"#B5774E",hair:"#1A1410",grey:true,shirt:"#7FA7D9",collar:"#6B93C6",sleeve:"#7FA7D9",fore:"#B5774E",cuff:"#6B93C6",moustache:"#1E1612",headset:true,bags:true,brow:7,lip:"#6A3028"};
const MAVA_OPT={skin:"#A86E48",hair:"#2A2420",grey:true,shirt:"#8E3B46",collar:"#7A2F3A",moustache:"#1E1612",brow:7,lip:"#6A3028"};
const PINNI_OPT={skin:"#C99266",hair:"#241A16",shirt:"#F2B53A",saree:{base:"#2E7D32",pallu:"#388E3C",border:"#F5D76E"},sleeve:"#F2B53A",fore:"#C99266",bun:true,bindi:true,earrings:true,brow:4.5,lash:4,blush:0.3,lip:"#A0404A"};
// home cast (draw order: relatives at the back, then the couple, then Nikhil; the table covers their laps)
const MV=makeAdult(MAVA_OPT), PN=makeAdult(PINNI_OPT), PR=makeAdult(PRASAD_OPT), SA=makeAdult(SAROJA_OPT), NK=makeAdult(NIKHIL_OPT);
const SU=makeAdult(SURESH_OPT);
// ===== home table + lunch (in front of the cast) =====
const table=el("g",{},cam);
el("rect",{x:-300,y:1180,width:1700,height:44,rx:10,fill:"#FFF4E0",stroke:INK,"stroke-width":6},table);
el("rect",{x:-300,y:1222,width:1700,height:700,fill:"#F7E2C0",stroke:INK,"stroke-width":6},table);
for(let i=0;i<14;i++) el("path",{d:`M${-260+i*120} 1226 Q${-250+i*120} 1500 ${-266+i*120} 1900`,stroke:"#E5C99C","stroke-width":6,fill:"none"},table);
el("rect",{x:-300,y:1250,width:1700,height:26,fill:"#B0204A"},table); el("rect",{x:-300,y:1282,width:1700,height:10,fill:"#F2B53A"},table);
const bowls=el("g",{},cam);
[[110,"#C1440E"],[200,"#F5F0E1"]].forEach(([x,c])=>{el("path",{d:`M${x-44} 1150 L${x+44} 1150 Q${x+40} 1196 ${x} 1198 Q${x-40} 1196 ${x-44} 1150 Z`,fill:"#C9CED6",stroke:INK,"stroke-width":4},bowls); el("ellipse",{cx:x,cy:1152,rx:42,ry:9,fill:c,stroke:INK,"stroke-width":3},bowls)});
// the 2-tier cake with the "30 ❤️" topper
const CX=400;
const cake=el("g",{},cam);
el("ellipse",{cx:CX,cy:1196,rx:160,ry:16,fill:"#E0E0E0",stroke:INK,"stroke-width":4},cake);
el("rect",{x:CX-125,y:1078,width:250,height:116,rx:12,fill:"#F8BBD0",stroke:INK,"stroke-width":5},cake);
el("path",{d:`M${CX-125} 1092 Q${CX-110} 1120 ${CX-95} 1094 Q${CX-80} 1126 ${CX-60} 1094 Q${CX-40} 1118 ${CX-20} 1094 Q${CX} 1128 ${CX+20} 1094 Q${CX+40} 1116 ${CX+60} 1094 Q${CX+80} 1124 ${CX+100} 1094 Q${CX+112} 1114 ${CX+125} 1092 L${CX+125} 1082 L${CX-125} 1082 Z`,fill:"#FFFFFF",stroke:INK,"stroke-width":3},cake);
el("rect",{x:CX-88,y:992,width:176,height:90,rx:12,fill:"#FFFFFF",stroke:INK,"stroke-width":5},cake);
for(let k=0;k<6;k++) el("circle",{cx:CX-75+k*30,cy:994,r:9,fill:"#E53935",stroke:INK,"stroke-width":2},cake);
for(let k=0;k<8;k++) el("circle",{cx:CX-108+k*31,cy:1150,r:7,fill:"#FFFFFF",stroke:"#E091A8","stroke-width":2},cake);
const sliceGap=el("path",{d:`M${CX-36} 1080 L${CX-24} 1080 L${CX-24} 1192 L${CX-36} 1192 Z`,fill:"#8D5A34",opacity:0},cake);
const topper=el("g",{},cake);
[CX+20,CX+80].forEach(x=>el("line",{x1:x,y1:990,x2:x,y2:940,stroke:"#B8860B","stroke-width":5},topper));
el("rect",{x:CX-24,y:874,width:148,height:72,rx:14,fill:"#F5B347",stroke:INK,"stroke-width":5},topper);
txt("30 ❤️",{x:CX+50,y:930,"font-family":"Anton","font-size":52,"text-anchor":"middle",fill:INK},topper);
// the cake knife (held by Amma and Nanna)
const knife=el("g",{},cam);
el("rect",{x:-74,y:-10,width:74,height:20,rx:8,fill:"#3E2723",stroke:INK,"stroke-width":3},knife);
el("path",{d:"M0 -12 L130 -4 Q140 0 130 6 L0 12 Z",fill:"#ECEFF1",stroke:INK,"stroke-width":3},knife);
el("path",{d:"M-30 -10 Q-40 -30 -20 -30",stroke:"#E53935","stroke-width":5,fill:"none"},knife);   // ribbon
// Amma's pulihora (steel plate)
const plate=el("g",{},cam);
el("ellipse",{cx:0,cy:0,rx:96,ry:22,fill:"#C9CED6",stroke:INK,"stroke-width":5},plate);
el("ellipse",{cx:0,cy:-2,rx:78,ry:15,fill:"#E6EAEE"},plate);
el("path",{d:"M-62 0 Q-58 -46 0 -50 Q58 -46 62 0 Z",fill:"#F2C230",stroke:"#B8860B","stroke-width":3},plate);
for(let k=0;k<16;k++){const x=-50+hash(k)*100, y=-6-hash(k+9)*34; el(k%3?"ellipse":"circle",k%3?{cx:x,cy:y,rx:7,ry:3.5,fill:"#2E7D32",transform:`rotate(${hash(k+2)*180} ${x} ${y})`}:{cx:x,cy:y,r:4,fill:"#8D5A34"},plate)}
el("path",{d:"M30 -24 Q44 -30 50 -18",stroke:"#D32F2F","stroke-width":5,fill:"none"},plate);
// steel tumbler + Nikhil's phone propped against it (screen facing us)
const tumbler=el("g",{transform:"translate(738,1192)"},cam);
el("path",{d:"M-30 -100 L30 -100 L24 0 L-24 0 Z",fill:"#CFD8DC",stroke:INK,"stroke-width":5},tumbler); el("path",{d:"M-18 -90 L-14 -10",stroke:"#fff","stroke-width":6,opacity:.7},tumbler);
const phoneUp=el("g",{},cam), phoneVib=el("g",{},phoneUp);
el("rect",{x:-34,y:-124,width:68,height:126,rx:12,fill:"#1A1A1A",stroke:INK,"stroke-width":4},phoneVib);
const phScr=el("rect",{x:-28,y:-116,width:56,height:108,rx:7,fill:"#22304E"},phoneVib);
const phCall=el("g",{},phoneVib);
el("circle",{cx:0,cy:-86,r:14,fill:"#2D6CDF",stroke:"#9FC3FF","stroke-width":2},phCall);
el("rect",{x:-20,y:-64,width:40,height:6,rx:3,fill:"#fff"},phCall); el("rect",{x:-14,y:-52,width:28,height:5,rx:2,fill:"#9AA6BA"},phCall);
el("circle",{cx:-14,cy:-26,r:9,fill:"#E53935"},phCall); el("circle",{cx:14,cy:-26,r:9,fill:"#43A047"},phCall);
const buzzL=[-1,1].map(s=>el("path",{d:`M${s*48} -90 Q${s*60} -62 ${s*48} -34 M${s*62} -100 Q${s*78} -62 ${s*62} -24`,stroke:"#FFFFFF","stroke-width":5,fill:"none","stroke-linecap":"round",opacity:0},phoneUp));
const phoneDown=el("g",{transform:"translate(760,1196)"},cam);
el("rect",{x:-40,y:-10,width:80,height:14,rx:6,fill:"#1A1A1A",stroke:INK,"stroke-width":3},phoneDown);
// relatives' clapping hands are part of their rigs

// ===== office desk props in front of Suresh =====
const odesk=el("g",{},cam);
el("rect",{x:OO-200,y:1180,width:1500,height:44,rx:8,fill:"#4A5C80",stroke:INK,"stroke-width":6},odesk);
el("rect",{x:OO-200,y:1222,width:1500,height:700,fill:"#33415F",stroke:INK,"stroke-width":6},odesk);
const olap=el("g",{},cam);   // laptop seen from behind (plain lid, no logo)
el("path",{d:`M${OO+330} 1182 L${OO+360} 1010 L${OO+720} 1010 L${OO+750} 1182 Z`,fill:"#90A4AE",stroke:INK,"stroke-width":6},olap);
el("rect",{x:OO+310,y:1176,width:460,height:14,rx:5,fill:"#78909C",stroke:INK,"stroke-width":4},olap);
cam.appendChild(odesk); cam.appendChild(olap); cam.appendChild(mug);

// ---------- A/B split panels (screen space): A = neon (call from the car boot), B = clay (phone off, lunch) ----------
const abDefs=el("defs",{},absvg);
const clipA=el("clipPath",{id:"clipA"},abDefs), clipARect=el("rect",{x:0,y:290,width:540,height:1190},clipA);
const clipB=el("clipPath",{id:"clipB"},abDefs), clipBRect=el("rect",{x:540,y:290,width:540,height:1190},clipB);
const abBg=el("rect",{x:0,y:0,width:1080,height:1920,fill:"#1A202C"},absvg);
const gAo=el("g",{"clip-path":"url(#clipA)"},absvg), gAf=el("g",{filter:"url(#skin-neon)"},gAo), gA=el("g",{},gAf);
const gBo=el("g",{"clip-path":"url(#clipB)"},absvg), gBf=el("g",{filter:"url(#skin-clay)"},gBo), gB=el("g",{},gBf);
el("line",{x1:540,y1:290,x2:540,y2:1480,stroke:"#fff","stroke-width":10},absvg);
// A: the basement, Nikhil on the open boot with the laptop; up in the flat's window, the family cuts the cake without him
el("rect",{x:-400,y:0,width:1880,height:1920,fill:"#5B6470"},gA);
el("rect",{x:-400,y:1300,width:1880,height:700,fill:"#4A5058"},gA);
const winA=el("g",{},gA);
el("rect",{x:640,y:330,width:260,height:220,fill:"#FFD180",stroke:INK,"stroke-width":7},winA);
el("rect",{x:700,y:470,width:70,height:60,fill:"#F8BBD0",stroke:INK,"stroke-width":3},winA); el("rect",{x:715,y:440,width:40,height:32,fill:"#fff",stroke:INK,"stroke-width":3},winA);
[[675,"#B0204A"],[800,"#F4F4EE"],[850,"#2E7D32"]].forEach(([x,c])=>{el("circle",{cx:x,cy:430,r:22,fill:"#8D5A34"},winA); el("rect",{x:x-24,y:452,width:48,height:90,rx:16,fill:c},winA)});
const carA=drawCar(gA,540,830); carA.lid.style.opacity=0; carA.lidUp.style.opacity=1;
const NKa=makeAdult({...NIKHIL_OPT,parent:gA});
const lapA=el("g",{},gA);
el("path",{d:"M420 1150 L450 980 L630 980 L660 1150 Z",fill:"#90A4AE",stroke:INK,"stroke-width":6},lapA);
el("rect",{x:400,y:1146,width:280,height:14,rx:5,fill:"#78909C",stroke:INK,"stroke-width":4},lapA);
// B: home table, phone face-down beside the pulihora, Nikhil eating
el("rect",{x:-400,y:0,width:1880,height:1920,fill:"#F2C79A"},gB);
el("rect",{x:-400,y:1010,width:1880,height:200,fill:"#E3AE78"},gB);
for(let i=0;i<8;i++){const x=180+i*90; el("path",{d:`M${x} 420 L${x+78} 424 L${x+39} 494 Z`,fill:["#E53935","#FDD835","#43A047","#1E88E5","#8E24AA"][i%5],stroke:INK,"stroke-width":3},gB)}
const NKb=makeAdult({...NIKHIL_OPT,parent:gB});
el("rect",{x:-400,y:1180,width:1880,height:44,rx:10,fill:"#FFF4E0",stroke:INK,"stroke-width":6},gB);
el("rect",{x:-400,y:1222,width:1880,height:700,fill:"#F7E2C0",stroke:INK,"stroke-width":6},gB);
el("rect",{x:-400,y:1250,width:1880,height:26,fill:"#B0204A"},gB);
const plateB=plate.cloneNode(true); gB.appendChild(plateB); plateB.setAttribute("transform","translate(470,1200)");
const phB=el("g",{transform:"translate(680,1196)"},gB); el("rect",{x:-44,y:-10,width:88,height:14,rx:6,fill:"#1A1A1A",stroke:INK,"stroke-width":3},phB);
el("text",{x:680,y:1150,"font-family":"Anton","font-size":40,"text-anchor":"middle",fill:"#6D6875"},gB).textContent="🔕";

// ---------- narrator Gopi badge (house look, clay, screen space) ----------
const ndefs=el("defs",{},nar);
const clip=el("clipPath",{id:"badgeClip"},ndefs); el("circle",{cx:165,cy:1385,r:122},clip);
const badge=el("g",{},nar);
const badgeIn=el("g",{filter:"url(#skin-clay)"},badge);
el("circle",{cx:165,cy:1385,r:134,fill:"#F5B347",stroke:INK,"stroke-width":7},badgeIn);
el("circle",{cx:165,cy:1385,r:122,fill:"#2D6CDF"},badgeIn);
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
  items.wave=el("g",{},handItem);txt("👋",{x:0,y:-8,"font-size":78,"text-anchor":"middle","dominant-baseline":"central"},items.wave);
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
const COLORS={gopi:"#F5B347",nikhil:"#C9C3F2",suresh:"#9FC3FF",saroja:"#FF9EB5",prasad:"#E8E8E0"}, NAMES={gopi:"GOPI",nikhil:"NIKHIL",suresh:"SURESH (TL) 📞",saroja:"AMMA",prasad:"NANNA"};
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
  if(k===0||/[…,!?—.'\s]\s*$/.test(tx.slice(0,k))){let best=est,bd=0.5; for(const [s] of segs){const d=Math.abs(s-est); if(d<bd){bd=d;best=s}} return best}
  return est}

let B=null;
function beats(){ if(B) return B; B={}; const sg=i=>segsOf(i), sv=(i,k)=>{const q=sg(i); return q[Math.min(k,q.length-1)][0]};   // sv: start of the k-th voiced segment of line i
  B.buzz0=0.0; B.cu1=1.15; B.titleIn=1.45; B.tTL=sv(0,2); B.tCake=sv(0,1);
  B.off0=S(1)-0.1; B.off1=E(1)+0.12; B.tChip=S(1)+0.35; B.tNeeke=sv(1,1)+0.3;
  B.tCrack=sv(2,1); B.t2h=B.tCrack+0.3; B.tHold=sv(2,3)-0.05; B.tWink=sv(2,4)+0.1;
  B.tPlate=S(3)+0.05; B.tPoint=sv(3,1)-0.1; B.tTurn=S(3)+0.35;
  B.tCal=S(4)+0.05; B.car0=sv(4,2)-0.12; B.tBoot=B.car0+0.25; B.tHalo=sv(4,3); B.car1=E(4)+0.1;
  B.chat0=Math.max(S(5)-0.15,B.car1); B.tM1=B.chat0+0.2; B.tM2=sv(5,1)+0.2; B.tM3=sv(5,1)+1.25; B.tWince=B.tM3-0.1; B.chat1=E(5)+0.12;
  B.fz0=S(6)-0.1; B.tFol=sv(6,1)+0.08;
  B.ab0=S(7)-0.12; B.tA=sv(7,1); B.tB=sv(7,3); B.tCm=sv(7,5); B.CD0=E(7)+0.1; B.CD1=B.CD0+TL.countdown;
  B.cb=CB.map((_,i)=>B.CD0+0.3+i*0.7); B.t2hA=B.CD0+1.6;
  B.rev=B.CD1+0.1; B.tRunbook=at(8,"runbook"); B.fl0=B.tRunbook-0.02; B.fl1=B.fl0+0.2; B.kir0=sv(8,2)-0.2; B.tStep=sv(8,3)+0.05;
  B.off2=sv(9,1)+0.02; B.tRes=sv(9,1)+0.35; B.tTen=sv(9,2); B.off3=E(9)+0.15;
  B.tChuck=S(10)-0.1; B.tCut=sv(10,2)+0.35; B.tSunday=sv(10,2)+0.3; B.boot0=E(10)-0.15; B.boot1=E(10)+0.45;
  B.sh0=Math.max(S(11)-0.1,B.boot1); B.tShare=sv(11,2)+0.3; B.tTL2=S(12)-0.05; B.tX=at(12,"మాత్రం");
  B.end0=Math.min(sv(12,1)-0.3,B.tX+0.45); B.tEF=sv(12,1)+0.12; B.loop0=sv(12,2)-0.05;
  return B}

const NKX=880, NKY=1240, PRX=200, PRY=1085, SAX=600, SAY=1085, MVX=10, MVY=1020, PNX=1040, PNY=1020;
const focus=(z,wx,wy,sx=540,sy=1000)=>({z,fx:wx-(sx-540)/z,fy:wy-(sy-1000)/z});
let curSkin="";
function skinTo(s){ if(s!==curSkin){ setSkin(s); curSkin=s } }

function frame(t){
  const b=beats();
  const office=(t>=b.off0&&t<b.off1)||(t>=b.off2&&t<b.off3);
  const car=(t>=b.car0&&t<b.car1)||(t>=b.boot0&&t<b.boot1);
  const abOn=t>=b.ab0&&t<b.rev+0.25;
  const loop=t>=b.loop0;
  const home=!office&&!car;
  skinTo(office?"neon":"clay");
  $("s").style.visibility=abOn&&t>b.ab0+0.3&&t<b.rev?"hidden":"visible";
  svg.style.filter=(t>b.fz0&&t<b.ab0)?"saturate(.3) brightness(.95)":"none";
  for(const [C,who] of [[NK,"nikhil"],[SA,"saroja"],[PR,"prasad"],[SU,"suresh"],[MV,"x"],[PN,"x"],[NKa,"x"],[NKb,"x"]]) Object.assign(C.st,{talk:who==="x"?0:talkOf(who,t),blink:((t*0.6+who.length*0.37+C.st.x*0.001)%3.3)<0.11?1:0,shut:0,look:0,lookY:0,brow:"n",smile:0,sad:0,smirk:0,wince:0,sweat:0,tear:0,
    headRot:0,headY:0,hop:0,rot:0,item:"",itemL:"",itemRot:0,itemRotL:0,vis:1,s:1,flip:1,wink:0});
  const frozen=t>b.fz0&&t<b.ab0;
  const tf=frozen?b.fz0:t;   // the frozen moment for the follow beat
  const ringing=(tf<b.rev)||loop;   // the phone buzzing on the table (opening + loop)
  const cutDone=t>b.tCut+0.35&&!loop;
  const knDy=(!loop&&t>b.tChuck-0.2&&t<b.sh0&&t>b.tCut)?40*out((t-b.tCut)/0.35):0;

  // ---------------- Amma (Saroja) ----------------
  const sa=SA.st; Object.assign(sa,{x:SAX,y:SAY,s:1}); sa.headRot=Math.sin(tf*1.4)*1.5; sa.look=-0.5; sa.smile=1;
  const knifeHold=(tf<b.off0)||loop||(t>b.tChuck-0.2&&t<b.sh0);
  if(knifeHold){ SA.aim("L",CX-55,898+knDy); sa.hR=[60,-80]; sa.look=-0.6; sa.lookY=0.6; }
  else { sa.hL=[-60,-90]; sa.hR=[60,-90] }
  if(tf<b.off0||loop){ if(tf>b.cu1){ sa.look=0.8; sa.lookY=0.6; sa.brow="u"; sa.smile=0 } }   // eyes on the buzzing phone
  if(t>b.off1&&t<b.tPlate){ sa.look=0.8; sa.brow="q"; sa.smile=0 }
  if(t>=b.tPlate&&t<b.car0){ const k=ease((t-b.tPlate)/0.6); SA.aim("R",lerp(640,NKX-30,k),1180); sa.look=0.9; sa.lookY=0.3; sa.smile=t<b.tPoint?1:0;
    if(t>b.tPoint){ SA.aim("L",lerp(SAX-60,730,out((t-b.tPoint)/0.25)),lerp(1000,1060,out((t-b.tPoint)/0.25))); sa.brow="a"; sa.smirk=1; SA.aim("R",NKX-40,1180); sa.headRot=6+Math.sin(t*10)*2 } }
  if(t>=b.chat0&&t<b.chat1){ SA.aim("R",SAX+70,890); sa.item="phone"; sa.itemRot=-8; sa.look=0.9; sa.lookY=0.2; sa.brow=t>b.tM2?"a":"q"; sa.smirk=1; sa.headRot=Math.sin(t*7)*2.5; }
  if(t>=b.rev&&t<b.off2){ sa.look=0.8; sa.brow="u"; sa.smile=0 }
  if(t>=b.off3&&t<b.sh0){ sa.smile=1; sa.look=-0.4; if(t>b.tCut) sa.shut=((t-b.tCut)%1.4)<0.5?1:0 }
  SA.draw();
  // ---------------- Nanna (Prasad) ----------------
  const pr=PR.st; Object.assign(pr,{x:PRX,y:PRY,s:1}); pr.headRot=Math.sin(tf*1.1+1)*1.2; pr.smirk=1; pr.look=0.4;
  if(knifeHold){ PR.aim("R",CX-70,912+knDy); pr.hL=[-60,-80]; pr.look=0.5; pr.lookY=0.6 } else { pr.hL=[-60,-90]; pr.hR=[60,-90] }
  if(tf<b.off0||loop){ if(tf>b.cu1){ pr.look=1; pr.lookY=0.5; pr.brow="q" } }
  if(t>=b.tTurn&&t<b.car0){ pr.look=1; pr.brow="q" }
  if(t>=b.chat0&&t<b.chat1){ pr.look=1; pr.smirk=1; pr.brow="q" }
  if(t>=b.off3&&t<b.sh0){ pr.look=0.9; pr.smirk=0; pr.smile=1; const ch=t>b.tChuck&&t<E(10)?1:0; pr.shut=ch&&t<b.tSunday?1:0; pr.hop=ch*Math.abs(Math.sin(t*12))*3; pr.headRot=4; pr.brow=t>b.tSunday?"q":"n";
    pr.talk=talkOf("prasad",t); if(pr.talk>0.12) pr.smile=0 }
  PR.draw();
  // ---------------- relatives (frozen mid-clap, then heads turn to Nikhil) ----------------
  [[MV,MVX,MVY,1],[PN,PNX,PNY,-1]].forEach(([C,x,y,dir],i)=>{const r=C.st; Object.assign(r,{x,y,s:0.86}); r.smile=1; r.look=dir*0.7; r.headRot=Math.sin(tf*1.6+i)*2;
    const clap=(tf<b.cu1&&!loop)?Math.abs(Math.sin(tf*9)) : 0;   // clapping, then frozen mid-clap on the buzz
    r.hL=[lerp(-30,-60,clap),-200]; r.hR=[lerp(30,60,clap),-200];
    if(tf>b.cu1&&(tf<b.off0||loop)){ r.smile=0; r.brow="u"; r.look=dir*0.9; r.lookY=0.4 }
    if(t>=b.tTurn&&t<b.car0){ r.look=dir*1; r.brow="q"; r.smile=0; r.headRot=dir*-6 }
    if(t>=b.chat0&&t<b.chat1){ r.smile=1; r.shut=t>b.tM3?1:0; r.look=dir*0.8 }
    if(t>=b.off3&&t<b.sh0){ r.smile=1; if(t>b.tCut){ const c2=Math.abs(Math.sin(t*9+i)); r.hL=[lerp(-30,-60,c2),-200]; r.hR=[lerp(30,60,c2),-200] } }
    C.draw()});
  // ---------------- Nikhil (home) ----------------
  const n=NK.st; Object.assign(n,{x:NKX,y:NKY}); n.headRot=Math.sin(tf*1.3)*1.5; n.hL=[-62,-66]; n.hR=[62,-66]; n.look=-0.6; n.smile=1;
  if(tf<b.off0||loop){ if(tf>0.6){ n.look=-0.7; n.lookY=0.8; n.brow="w"; n.smile=0; n.headRot=-5; n.wince=tf>b.tTL?1:0 } }
  if(t>=b.off1&&t<b.tPlate){ n.look=-0.7; n.lookY=0.8; n.brow="w"; n.smile=0; n.sad=1 }
  if(t>=b.tPlate&&t<b.car0){ n.look=-0.8; n.lookY=t>b.tPoint?0.8:0.2; n.brow=t>b.tPoint?"w":"u"; n.smile=0; n.sad=t>b.tPoint?1:0 }
  if(t>=b.tCal&&t<b.car0){ n.look=0.3; n.lookY=-0.6; n.brow="w"; n.sad=1; n.headRot=-6; n.talk=0 }
  if(t>=b.chat0&&t<b.chat1){ n.look=-0.9; n.smile=0; n.brow="u"; if(t>b.tWince){ n.wince=1; n.shut=1; n.headRot=-8; NK.aim("R",NKX+10,NKY-400); } }
  if(frozen){ n.look=-0.7; n.lookY=0.8; n.brow="w"; n.smile=0 }
  if(t>=b.rev&&t<b.off2){ NK.aim("R",NKX+52,NKY-395); n.item="phone"; n.itemRot=-12; n.itemL="fork"; NK.aim("L",NKX-90,NKY-200); n.look=-0.3; n.smirk=1; n.smile=0; n.brow="n"; n.headRot=4 }   // a relaxed 24-second call
  if(t>=b.off3&&t<b.sh0){ n.smile=1; n.look=-0.8; n.itemL="fork"; NK.aim("L",NKX-90,lerp(NKY-200,NKY-250,Math.abs(Math.sin(t*3)))); }
  NK.draw();
  // ---------------- Suresh (office) ----------------
  const su=SU.st; Object.assign(su,{x:OO+540,y:1240}); su.sweat=t<b.tRes?t:0; su.headRot=Math.sin(t*3)*2.5; su.brow="a"; su.look=0.2;
  SU.aim("R",OO+540+70,1240-380); su.hL=[-70,-66];   // hand on the headset mic
  if(t>b.tNeeke-0.05&&t<b.off1){ su.hL=[-40,-150]; su.brow="a"; su.headRot=-4 }   // jabbing finger
  if(t>=b.off2){ su.brow=t<b.tRes?"u":"n"; su.sweat=0; su.smile=t>b.tTen?1:0; su.hop=t>b.tTen?Math.abs(Math.sin(t*12))*3:0; if(t>b.tRes){ su.hL=[-66,-66]; su.headRot=Math.sin(t*9)*3 } }
  SU.draw();

  // ---------------- props ----------------
  // knife: in the couple's hands; it cuts in L11
  {knife.setAttribute("transform",`translate(${CX-50},${940+knDy}) rotate(70)`); knife.style.opacity=knifeHold?1:0;
   sliceGap.style.opacity=cutDone&&t<b.sh0+3?1:0}
  // plate: in front of Amma, then slid in front of Nikhil (L4)
  {const k=t<b.tPlate?0:ease((t-b.tPlate)/0.6); const px=lerp(590,NKX-20,loop?0:k); plate.setAttribute("transform",`translate(${px},1206)`)}
  // phone: propped up and buzzing; face-down after the call (L11)
  {const vib=ringing&&!frozen?1:(frozen?0.0:0); const sh=vib?Math.sin(t*95)*4:0, rr=vib?Math.sin(t*70)*3:0;
   const onCall=t>=b.rev&&t<b.off3, down=t>=b.off3&&!loop;
   phoneUp.setAttribute("transform",`translate(${700+sh},1196) rotate(${-10+rr})`); phoneUp.style.opacity=onCall||down?0:1; phoneDown.style.opacity=down?1:0;
   phScr.setAttribute("fill",ringing||frozen?"#22304E":"#111"); phCall.style.opacity=ringing||frozen?1:0;
   buzzL.forEach(p=>p.style.opacity=vib&&Math.sin(t*20)>-0.3?1:0)}
  // wall clock: 1:02; spins in L3 ("ఎప్పుడూ పది కాదు")
  {const spin=t>b.tCrack&&t<S(3)?(t-b.tCrack)*900:0, spin2=t>=S(3)?(S(3)-b.tCrack)*900:0; const m=12+((spin||spin2)/6), h=30+m/12;
   mnH.setAttribute("transform",`rotate(${m*6})`); hrH.setAttribute("transform",`rotate(${h*1+((spin||spin2)/12)})`)}
  // car boot: pops open (L5), closes on the laptop (insert after L11)
  {let k=0; if(t>=b.car0&&t<b.car1) k=t>b.tBoot?back((t-b.tBoot)/0.35):0; if(t>=b.boot0) k=1-ease((t-b.boot0-0.1)/0.3);
   CAR.lid.style.opacity=k<0.15?1:0; CAR.lidUp.style.opacity=k>=0.15?1:0; CAR.lidUp.setAttribute("transform",`translate(0,150) scale(1,${Math.max(0.05,k)}) translate(0,-150)`);
   CAR.glow.setAttribute("opacity",k>0.5?0.7+0.3*Math.sin(t*6):0); CAR.g.setAttribute("transform",`translate(${CO+540},${830+(t>b.tBoot&&t<b.tBoot+0.25&&t<b.car1?-Math.sin((t-b.tBoot)/0.25*Math.PI)*10:0)})`)}
  // office alarm light
  alarm.setAttribute("fill",t<b.tRes?(Math.sin(t*14)>0?"#FF1744":"#5A0010"):"#00E676");

  // ---------------- A/B panels ----------------
  absvg.style.opacity=abOn?1:0;
  if(abOn){
    const shut=t>b.rev?out((t-b.rev)/0.22):0;   // the split snaps shut: neither panel wins
    const open=out((t-b.ab0)/0.3);
    clipARect.setAttribute("x",lerp(-540,0,open)+shut*540); clipARect.setAttribute("width",540*(1-shut));
    clipBRect.setAttribute("x",lerp(1080,540,open)); clipBRect.setAttribute("width",540*(1-shut));
    abBg.setAttribute("opacity",1-shut);
    gA.setAttribute("transform",`translate(-270,${Math.sin(t*14)*1.5}) translate(540,1000) scale(.78) translate(-540,-1000)`);
    gB.setAttribute("transform",`translate(270,0) translate(540,1000) scale(.9) translate(-540,-1000)`);
    // A: Nikhil on the boot with the laptop, glum, lit by the screen
    const a=NKa.st; Object.assign(a,{x:540,y:1150,s:1}); NKa.aim("L",470,1110); NKa.aim("R",610,1110); a.look=0; a.lookY=1; a.headY=8; a.brow="w"; a.sad=1; a.headRot=Math.sin(t*2)*2; NKa.draw();
    // B: Nikhil at the table, eating, relaxed (the appraisal card shakes above him)
    const bb=NKb.st; Object.assign(bb,{x:470,y:1240,s:1}); bb.hL=[-62,-66]; bb.itemL=""; NKb.aim("R",lerp(520,500,Math.abs(Math.sin(t*3))),lerp(1180,900,Math.abs(Math.sin(t*3)))); bb.item="fork"; bb.smile=1; bb.look=0.3; bb.lookY=0.2; bb.headRot=Math.sin(t*2.4)*3; NKb.draw();
  }

  // ---------------- Gopi (narrator badge) ----------------
  const g=GOPI.st;
  const narOn=(t>1.2&&t<E(0)+0.2)||(t>S(2)-0.15&&t<E(2)+0.2)||(t>S(6)-0.15&&t<E(7)+0.1)||(t>S(11)-0.15&&t<b.end0);
  const narT=t>S(11)-0.15?S(11)-0.15:t>S(6)-0.15?S(6)-0.15:t>S(2)-0.15?S(2)-0.15:1.2;
  Object.assign(g,{x:165,y:1385+400*0.55+12,s:0.55,talk:talkOf("gopi",t),blink:((t*0.7)%3.1)<0.12?1:0,wink:0,look:0.5,lookY:0,brow:"n",smile:0,headRot:Math.sin(t*2.2)*3,item:"",armL:200,armR:160,lenL:115,lenR:115,hop:0,itemRot:0});
  if(t>b.tWink-0.05&&t<b.tWink+0.55){g.wink=1; g.smile=1; g.brow="q"}
  if(t>b.tFol-0.4&&t<E(6)){g.armR=40; g.item="point"; g.itemRot=-30}
  if(t>S(7)-0.1&&t<E(7)){g.brow="u"; g.look=0}
  if(t>S(12)-0.1){g.smile=1; g.brow="q"}
  GOPI.draw();
  const bs=narOn?Math.max(0.001,back((t-narT)/0.35)):0;
  badge.setAttribute("transform",`translate(165,1385) scale(${bs}) rotate(${Math.sin(t*2)*2}) translate(-165,-1385)`); badge.style.opacity=narOn?1:0;

  // ---------------- camera ----------------
  const punch=(t0,a_=0.1)=>t>t0?a_*Math.exp(-(t-t0)*4)*clamp((t-t0)/0.06):0;
  let cm;
  if(office){
    if(t<b.off1) cm=focus(1.0+0.02*(t-b.off0)+punch(b.tNeeke,0.14),OO+540,1000+ (t>b.tNeeke?-60*clamp((t-b.tNeeke)/0.2):0));
    else cm=focus(1.0+punch(b.tRes,0.1),OO+540,1000);
  } else if(car){
    if(t>=b.boot0) cm=focus(1.25,CO+540,1060);
    else cm=focus(1.2+0.03*(t-b.car0)+punch(b.tBoot,0.12),CO+540,1060);
  } else if(loop||tf<b.cu1){   // the opening close-up: phone buzzing beside the cake (also the loop's last frames)
    const tt=loop?0:tf; cm=focus(2.0+0.04*tt,640,1080,540,1060);
  } else if(tf<b.off0){
    const k=ease((tf-b.cu1)/0.6); cm=focus(lerp(2.04,1.0,k)+punch(b.tTL,0.12),lerp(640,560,k),lerp(1080,1000,k),540,lerp(1060,1000,k));
  } else if(t<S(3)) cm=focus(1.08+0.01*(t-b.off1),560,960);
  else if(t<b.tCal) cm=focus(1.3+0.02*(t-S(3)),720,980);
  else if(t<b.car0) cm=focus(1.9+0.03*(t-b.tCal),NKX-40,NKY-392,540,1080);
  else if(t>=b.chat0&&t<b.chat1) cm=focus(1.25,700,800,540,1330);
  else if(frozen) cm=focus(1.12,620,980);
  else if(t>=b.rev&&t<b.off2) cm=focus(1.55+0.03*(t-b.rev)+punch(b.tRunbook,0.06),NKX-60,NKY-380,540,950);
  else if(t>=b.off3&&t<b.sh0) cm=focus(lerp(1.5,1.35,ease((t-b.off3)/2)),(PRX+CX)/2+20,930,540,1000);
  else cm=focus(1.05,540,1000);
  let sx=0,sy=0; const shake=(t0,d,a_)=>{if(t>t0&&t<t0+d){const q=(1-(t-t0)/d)*a_; sx+=Math.sin(t*90)*q; sy+=Math.cos(t*77)*q}};
  shake(b.tCrack,0.25,7); shake(b.tBoot,0.2,6); shake(b.CD1,0.25,8); shake(b.loop0,0.3,6);
  cam.setAttribute("transform",`translate(${540+sx},${1000+sy}) scale(${cm.z}) translate(${-cm.fx},${-cm.fy})`);
  const scr=(wx,wy)=>[540+(wx-cm.fx)*cm.z+sx, 1000+(wy-cm.fy)*cm.z+sy];

  // ---------------- HTML overlays ----------------
  const show=(id,on,s=1,extra="")=>{const e=$(id); e.style.opacity=on?1:0; if(on) e.style.transform=`${extra} scale(${Math.max(0.01,s)})`};
  let dm=0; if(t>=b.chat0&&t<b.chat1) dm=0.35*clamp((t-b.chat0)/0.15); if(t>=b.kir0&&t<b.off2) dm=0.6; if(t>b.sh0&&t<b.loop0) dm=0.2;
  $("dim").style.opacity=dm;
  // title (a beat after the open)
  {const ti=$("title"), on=t>b.titleIn&&t<b.off0; ti.style.opacity=on?clamp((b.off0-t)/0.2):0; ti.style.transform=`scale(${Math.max(0.01,back((t-b.titleIn)/0.45))})`}
  // incoming-call card next to the buzzing phone (opening, frozen follow beat, loop)
  {const c=$("call"), on=(tf<b.off0||loop); const [px,py]=scr(700,1070); const w=470;
   c.style.opacity=on?1:0; if(on){const k=loop?pop(t,b.loop0,0.3):1; const sh_=(ringing&&!frozen)?Math.sin(t*60)*2:0;
     const z=cm.z>1.6?1:0.82; c.style.left=clamp(px-w/2,20,1080-w-20)+"px"; c.style.top=(py-(cm.z>1.6?440:330))+"px"; c.style.transform=`scale(${Math.max(0.01,k)*z}) rotate(${sh_}deg)`}}
  // "10 mins" chip: pops in the office (L2), cracks into "2 hrs" (L3), snaps back to "10 mins ✅" (L10)
  {const c=$("chip"), T=$("chipT"); let on=false, s=1, x=540, y=300, cls="";
   if(t>=b.tChip&&t<b.off1){ on=true; s=pop(t,b.tChip,0.3); x=800; y=720; }
   else if(t>=b.off1&&t<S(3)){ on=true; const [px,py]=scr(700,1000); x=px+20; y=Math.max(300,py-220); s=1; }
   else if(t>=b.tTen-0.05&&t<b.off3){ on=true; x=800; y=720; s=1; }
   c.style.opacity=on?1:0;
   if(on){ const cracked=t>=b.tCrack&&t<b.t2h, two=t>=b.t2h&&t<S(3); T.textContent=two?"2 hrs 😬":(t>=b.tTen-0.05?"10 mins ✅":"10 mins"); cls=two?"red":(t>=b.tTen-0.05?"ok":"");
     c.className=cls; $("crkP").setAttribute("stroke-dashoffset",cracked?1-out((t-b.tCrack)/0.12):1); $("crk").style.opacity=cracked?1:0;
     const sn=t>=b.t2h&&t<b.t2h+0.3?lerp(1.35,1,out((t-b.t2h)/0.3)):(t>=b.tTen-0.05&&t<b.tTen+0.3?lerp(1.4,1,out((t-b.tTen+0.05)/0.3)):1);
     const jit=cracked?Math.sin(t*80)*4:0; c.style.left=(x-150)+"px"; c.style.top=y+"px"; c.style.transform=`translateX(${jit}px) scale(${Math.max(0.01,s*sn)}) rotate(${two?-5:3}deg)`}}
  show("hold",t>b.tHold&&t<S(3)-0.05,lerp(1.8,1,out((t-b.tHold)/0.2)),`rotate(${-3+Math.sin(t*5)*1.2}deg)`);
  // appraisal calendar card flips up next to Nikhil's head (L5)
  {const c=$("calA"), on=t>b.tCal&&t<b.car0; c.style.opacity=on?1:0; if(on){c.style.left="150px"; c.style.top="620px";
    c.style.transform=`perspective(600px) rotateX(${lerp(90,0,out((t-b.tCal)/0.3))}deg) rotate(-5deg)`}}
  // "just in case" halo label over the open boot
  {const h=$("halo"), on=t>b.tHalo&&t<b.car1; h.style.opacity=on?1:0; if(on){const [px,py]=scr(CO+540,880); h.style.left=(px-150)+"px"; h.style.top=(py-90)+"px"; h.style.transform=`scale(${Math.max(0.01,pop(t,b.tHalo,0.3))}) rotate(${Math.sin(t*4)*3}deg)`}}
  // family group chat on Amma's phone (L6) — the rewatch clue, played as a wrong-group joke
  {const c=$("chat"), on=t>b.chat0&&t<b.chat1; c.style.opacity=on?clamp((b.chat1-t)/0.12):0; c.style.transform=`scale(${Math.max(0.01,pop(t,b.chat0,0.35))}) rotate(-1.5deg)`;
   [["m1",b.tM1],["m2",b.tM2],["m3",b.tM3]].forEach(([id,t0])=>{const m=$(id); m.style.opacity=t>t0?1:0; m.style.transform=`scale(${Math.max(0.01,pop(t,t0,0.3))})`})}
  // 6-frame flash-back of the runbook message on "runbook" (L9)
  $("flashMsg").style.opacity=t>=b.fl0&&t<b.fl1?1:0;
  // call timer during the 24-second call
  {const c=$("ctimer"), on=t>=b.rev&&t<b.off3; c.style.opacity=on&&!(t>=b.kir0&&t<b.off2)&&!(t>=b.off2)?1:0; if(on){const sec=Math.min(24,Math.floor((t-b.rev)/(b.off3-b.rev)*24)); c.textContent=`📞 00:${String(sec).padStart(2,"0")}`;
    const [px,py]=scr(NKX+60,NKY-560); c.style.left=Math.min(px-60,1080-300)+"px"; c.style.top=py+"px"; c.style.transform=`scale(${Math.max(0.01,pop(t,b.rev+0.1,0.3))})`}}
  // office: dashboard + roster card on the monitors, video-call chip
  {const on=office; ["dash","roster"].forEach((id,k)=>{const m=$(id); m.style.opacity=on?1:0; if(on){const [px,py]=scr(OO+[65,595][k]+5,335+5); m.style.left=px+"px"; m.style.top=py+"px"; m.style.transform=`scale(${cm.z})`}});
   const ok=t>=b.tRes&&t>=b.off2; $("dashH").textContent=ok?"RESOLVED ✅":"P1 ESCALATION"; $("dashH").className="h"+(ok?" ok":""); $("dashS").textContent=ok?"Payments module · fixed by Kiran":"Payments module · client down"; $("dashS").className="s"+(ok?" ok":"");
   $("dash").style.borderColor=ok?"#2BFF6A":"#FF4D5E"; $("dash").style.boxShadow=ok?"0 0 30px rgba(40,255,110,.7)":"0 0 30px rgba(255,60,80,.7)";
   for(let i=0;i<10;i++){const e=$("bar"+i); const hgt=ok?20+60*hash(i+4)+8*Math.sin(t*6+i):30+70*Math.abs(Math.sin(t*5+i*1.7)); e.style.height=hgt+"px"; e.style.background=ok?"#2BFF6A":"#FF4D5E"}
   $("vcall").style.opacity=on?1:0; $("vct").textContent=t<b.off1?"00:0"+Math.min(9,Math.floor(t-b.off0+1)):"00:"+String(Math.min(24,Math.floor((t-b.rev)/(b.off3-b.rev)*24))).padStart(2,"0")}
  // Kiran's on-call screen: runbook step 4, cursor clicks
  {const k=$("kir"), on=t>=b.kir0&&t<b.off2; k.style.opacity=on?1:0; k.style.transform=`scale(${Math.max(0.01,pop(t,b.kir0,0.3))})`;
   const cur=$("kcur"), ck=ease((t-b.kir0-0.1)/Math.max(0.2,b.tStep-b.kir0-0.15)), dip=Math.max(0,1-Math.abs(t-b.tStep)/0.08);
   cur.style.opacity=on?1:0; cur.style.transform=`translate(${lerp(900,800,ck)}px,${lerp(1250,560,ck)+dip*8}px) scale(${1-0.12*dip})`;
   $("dn4").style.opacity=t>b.tStep?1:0; $("st4").style.background=t>b.tStep?"#C8F7C5":"#FFF59D"}
  // follow tap (phone frozen mid-buzz)
  const fA=b.fz0, fB=b.ab0; const fOn=t>fA&&t<fB; const fol=$("fol"); fol.style.opacity=fOn?clamp(Math.min((t-fA)/0.2,(fB-t)/0.12)):0;
  fol.style.transform=`scale(${Math.max(0.01,back((t-fA)/0.4))*(Math.abs(t-b.tFol)<0.1?0.9:1)})`;
  const bF=$("bF"); bF.textContent=t<b.tFol?"+ FOLLOW":"FOLLOWING ✓"; bF.className="btn"+(t<b.tFol?"":" done");
  {const hand=$("tapHand"); const hk=ease((t-fA-0.1)/Math.max(0.3,b.tFol-fA-0.2)); const dip=Math.max(0,1-Math.abs(t-b.tFol)/0.1);
   hand.style.opacity=fOn?clamp(Math.min((t-fA-0.05)/0.15,(fB-t)/0.12)):0; hand.style.transform=`translate(${lerp(980,770,hk)-50}px,${lerp(1600,1230,hk)+dip*12}px) rotate(${-8+dip*6}deg)`;
   const rg_=$("ring"), rk=(t-b.tFol)/0.45; rg_.style.opacity=fOn&&rk>0&&rk<1?1-rk:0; rg_.style.left="760px"; rg_.style.top="1230px"; rg_.style.transform=`scale(${1+rk*6})`}
  $("frz").style.opacity=frozen?1:0;
  // A/B question, labels, countdown, bubbles
  const abQ=t>b.ab0&&t<b.rev; show("q",abQ,pop(t,b.ab0,0.4));
  show("aL",abQ&&t>b.tA-0.1,pop(t,b.tA-0.1,0.35)*(1+(t>b.tA&&t<b.tA+0.5?0.08*Math.sin((t-b.tA)*12):0)));
  show("bL",abQ&&t>b.tB-0.1,pop(t,b.tB-0.1,0.35)*(1+(t>b.tB&&t<b.tB+0.5?0.08*Math.sin((t-b.tB)*12):0)));
  {const c=$("chipA"), on=abQ&&t>b.tA; c.style.opacity=on?1:0; const two=t>b.t2hA; $("chipAT").textContent=two?"2 hrs 😬":"10 mins"; c.className=two?"red":"";
   c.style.transform=`scale(${Math.max(0.01,pop(t,b.tA,0.3))*(two&&t<b.t2hA+0.3?lerp(1.4,1,out((t-b.t2hA)/0.3)):1)}) rotate(${two?-6:-2}deg)`}
  {const c=$("calB"), on=abQ&&t>b.tB; c.style.opacity=on?1:0; c.style.transform=`scale(${Math.max(0.01,pop(t,b.tB,0.3))}) rotate(${4+(t>b.CD0?Math.sin(t*40)*4:0)}deg) translateX(${t>b.CD0?Math.sin(t*33)*4:0}px)`}
  const cdk=t-b.CD0, sec=Math.floor(cdk), fr=cdk-sec; const cdOn=t>=b.CD0&&t<b.CD1;
  $("cdw").style.opacity=cdOn?clamp(cdk/0.15)*clamp((TL.countdown-cdk)/0.15):0;
  show("cnow",(t>b.tCm-0.05&&t<b.CD1),Math.max(0.01,pop(t,b.tCm-0.05,0.35))*(1+0.05*Math.sin(t*Math.PI*4)));
  if(cdOn){const nn=Math.max(1,TL.countdown-sec); $("digit").textContent=nn; $("digit").style.transform=`scale(${lerp(1.5,1,out(fr/0.2))})`; $("digit").style.color=nn<=1?"#FF5252":"#F5B347";
    $("arc").setAttribute("stroke-dasharray",`${590.6*(1-cdk/TL.countdown)} 590.6`); $("cdw").style.transform=`scale(${1+Math.exp(-fr*8)*0.08})`;
    $("chand").setAttribute("transform",`rotate(${(Math.floor(cdk*2)/2)*72})`)}
  CB.forEach((_,i)=>{const e=$("cb"+i), t0=b.cb[i], k=pop(t,t0,0.3); const on=t>t0&&t<b.CD1+0.15; e.style.opacity=on?clamp((b.CD1+0.15-t)/0.15):0;
    e.style.transform=`translateY(${-(t-t0)*24}px) scale(${Math.max(0.01,k)}) rotate(${(i%2?3:-3)}deg)`});
  // share: send to "Office bestie", then "Team Lead" slides up and gets a red ✕
  {const shOn=t>b.sh0&&t<b.end0+0.1; const sh=$("share"); sh.style.opacity=shOn?clamp(Math.min((t-b.sh0)/0.2,(b.end0+0.1-t)/0.15)):0;
   $("mini").style.transform=`scale(${Math.max(0.01,back((t-b.sh0)/0.4))}) rotate(${-3+Math.sin(t*2)}deg)`;
   const t0=b.tShare; $("ctF").style.opacity=t>t0-0.35?1:0; $("ctF").style.transform=`scale(${Math.max(0.01,pop(t,t0-0.35,0.35))*(t>t0+0.25&&t<t0+0.5?1.06:1)})`;
   const ak=out((t-t0+0.1)/0.35); $("sp1").setAttribute("d","M440 760 Q520 640 596 690"); $("sp1").setAttribute("stroke-dashoffset",1-ak); $("sp1").style.opacity=t>t0-0.1?1:0;
   $("snF").style.opacity=t>t0+0.25?1:0;
   const tt=$("ctT"); tt.style.opacity=t>b.tTL2?1:0; tt.style.transform=`translateY(${lerp(400,0,out((t-b.tTL2)/0.3))}px) ${t>b.tX&&t<b.tX+0.3?`translateX(${Math.sin(t*70)*6}px)`:""}`;
   const x=$("xT"); x.style.opacity=t>b.tX?1:0; x.style.left="600px"; x.style.top="890px"; $("xP").setAttribute("stroke-dashoffset",1-out((t-b.tX)/0.25));
   tt.style.background=t>b.tX?"#FFE0E0":"#fff"}
  // end card (short) -> the phone buzzes again -> loop
  {const ec=$("endc"), eOn=t>b.end0&&t<b.loop0; ec.style.opacity=eOn?clamp(Math.min((t-b.end0)/0.15,(b.loop0-t)/0.06)):0;
   $("eF").textContent=t<b.tEF?"FOLLOW @_REELRASAM":"FOLLOWING ✓  @_REELRASAM"; $("eF").style.transform=`scale(${Math.abs(t-b.tEF)<0.1?0.92:1})`; $("eF").style.background=t<b.tEF?"":"#6D6875";
   const eh=$("eHand"), ek=ease((t-b.end0)/Math.max(0.2,b.tEF-b.end0-0.05)), edip=Math.max(0,1-Math.abs(t-b.tEF)/0.1);
   eh.style.opacity=eOn?1:0; eh.style.transform=`translate(${lerp(900,250,ek)-50}px,${lerp(1300,690,ek)+edip*12}px) scale(${1-0.1*edip}) rotate(-8deg)`}
  // flashes: hard cuts to/from the office (cold), the split snapping shut, the loop cut
  const fl=(t0,d,a_)=>t>t0&&t<t0+d?a_*(1-(t-t0)/d):0;
  {const st_=$("strip"), on=t>=b.loop0; st_.style.opacity=on?1:0; st_.style.transform=`translateX(-50%) scale(${Math.max(0.01,out((t-b.loop0)/0.2))})`}
  const f=$("flash"); f.style.background=(t>=b.off3-0.05&&t<b.off3+0.3)?"#FFB74D":"#fff";
  f.style.opacity=fl(b.off0,0.12,0.5)+fl(b.off1,0.12,0.4)+fl(b.rev,0.15,0.6)+fl(b.off2,0.12,0.4)+fl(b.off3,0.3,0.55)+fl(b.loop0,0.1,0.5)+fl(b.car0,0.1,0.3);
  // subtitles
  const sub=$("sub"), L=curLine(t);
  if(L&&!(t>=b.kir0&&t<b.off2&&false)){sub.style.opacity=1; sub.innerHTML=`<span class="who" style="background:${COLORS[L.who]}">${NAMES[L.who]}</span><br>${L.text.replace(/…/g,"...")}`} else sub.style.opacity=0;
}

window.render=function(t){ frame(t) };
