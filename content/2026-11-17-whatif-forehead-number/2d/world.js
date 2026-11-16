// What-if #2 "the forehead number" — drawn world, cast and choreography (loaded by ep.html).
const NS="http://www.w3.org/2000/svg", svg=document.getElementById("s"), nar=document.getElementById("nar");
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
// comment bubbles during the countdown (generic names; none gives the answer away)
const CB=[["Ravi","Salary 💰","#1E88E5",40,1360],["Priya","Net worth?","#D81B60",600,1420],["Teja","Steps count 😂","#2E7D32",60,1520],
          ["Anu","Followers count?","#8E24AA",470,1600],["Karthik","Happiness level?","#E65100",40,1680],["Sneha","🤔","#00897B",880,1330]];
$("cbs").innerHTML=CB.map(([n,g,c,x,y],i)=>`<div class="cb" id="cb${i}" style="left:${x}px;top:${y}px"><b style="color:${c}">${n}</b><i>${g}</i></div>`).join("");

// ---------- defs + camera ----------
const defs=el("defs",{});
const cam=el("g",{});
applySkin(cam, defs);
const W=el("g",{id:"world"},cam);
const FAR=0.6, NEAR=0.95, FY=1060, SY=1205, NY=1560;   // far standing hip / far seated hip / near hip

// ===== FUNCTION HALL, Kukatpally (one set): back wall, LED stage, fairy-light curtains, marigolds, chairs, sofa =====
el("rect",{x:-2000,y:-900,width:5200,height:2100,fill:"#2A1B5E"},W);            // back wall
el("rect",{x:-2000,y:1180,width:5200,height:1200,fill:"#3B2468"},W);            // floor
el("rect",{x:-2000,y:1176,width:5200,height:10,fill:"#8E6BE0"},W);
for(let i=0;i<14;i++) el("rect",{x:-600+i*170,y:1186,width:150,height:900,fill:i%2?"#432A75":"#3B2468",opacity:.6},W);   // floor tiles
// LED stage backdrop "Divya ❤️ Varun" (far, small) + platform + bride/groom silhouettes
const stage=el("g",{},W);
el("rect",{x:240,y:330,width:600,height:360,rx:14,fill:"#3A0F5C",stroke:"#FF4FD8","stroke-width":8},stage);
for(let k=0;k<26;k++) el("circle",{cx:262+k*22.4,cy:345,r:5,fill:k%2?"#FFD740":"#FF80AB"},stage);
for(let k=0;k<26;k++) el("circle",{cx:262+k*22.4,cy:675,r:5,fill:k%2?"#FFD740":"#FF80AB"},stage);
txt("Divya ❤️ Varun",{x:540,y:470,"font-family":"Anton","font-size":66,"text-anchor":"middle",fill:"#FFE6FA","letter-spacing":2},stage);
txt("ENGAGEMENT",{x:540,y:530,"font-family":"Anton","font-size":32,"text-anchor":"middle",fill:"#FFD740","letter-spacing":8},stage);
el("rect",{x:200,y:690,width:680,height:60,rx:6,fill:"#5A2D82",stroke:"#B388FF","stroke-width":5},stage);
for(let k=0;k<17;k++) el("circle",{cx:210+k*41,cy:752+((k%2)*6),r:15,fill:k%2?"#FFB300":"#FB8C00"},stage);   // marigold skirting
[[470,"#1A0F33"],[610,"#1A0F33"]].forEach(([x,c],j)=>{const g=el("g",{transform:`translate(${x},690)`},stage);
  el("circle",{cx:0,cy:-118,r:16,fill:c},g); el("path",{d:j?"M-22 -100 L22 -100 L18 -40 L26 0 L-26 0 L-18 -40 Z":"M-20 -100 L20 -100 L34 0 L-34 0 Z",fill:c},g)});   // Divya + Varun (silhouettes only)
// fairy-light curtains (left + right) and marigold garland swags
const fairy=[];
[[-260,220],[860,1340]].forEach(([x0,x1])=>{for(let x=x0;x<=x1;x+=34){const h=520+hash(x)*120; el("line",{x1:x,y1:120,x2:x,y2:120+h,stroke:"#6B5BB0","stroke-width":2},W);
  for(let y=140;y<120+h;y+=46){fairy.push(el("circle",{cx:x,cy:y+(hash(x+y)*10),r:6.5,fill:["#FFE082","#FFD740","#FFF59D","#FFCC80"][Math.floor(hash(x*3+y)*4)]},W))}}});
for(let s=0;s<4;s++){const x0=-280+s*420; el("path",{d:`M${x0} 230 Q${x0+210} 330 ${x0+420} 230`,stroke:"#2E7D32","stroke-width":5,fill:"none"},W);
  for(let k=0;k<=14;k++){const u=k/14, x=x0+u*420, y=230+Math.sin(u*Math.PI)*100*0.95; el("circle",{cx:x,cy:y,r:13,fill:k%2?"#FFB300":"#FB8C00",stroke:"#B35A00","stroke-width":2},W)}}
// wall clock (time-lapse 8 -> 11 PM)
const clk=el("g",{transform:"translate(960,430)"},W);
el("circle",{r:62,fill:"#FFFDF5",stroke:"#FFD740","stroke-width":9},clk);
for(let k=0;k<12;k++) el("line",{x1:0,y1:-50,x2:0,y2:-42,stroke:INK,"stroke-width":4,transform:`rotate(${k*30})`},clk);
const clkH=el("line",{x1:0,y1:6,x2:0,y2:-30,stroke:INK,"stroke-width":7,"stroke-linecap":"round"},clk), clkM=el("line",{x1:0,y1:8,x2:0,y2:-46,stroke:"#C62828","stroke-width":4,"stroke-linecap":"round"},clk);
el("circle",{r:5,fill:INK},clk);
// entrance door (left, far)
el("rect",{x:-30,y:700,width:170,height:480,fill:"#5D3A1F",stroke:"#FFB74D","stroke-width":7},W);
const doorWarm=el("rect",{x:-14,y:716,width:138,height:464,fill:"#FFD180",opacity:.85},W);
for(let i=0;i<8;i++){const x=-24+i*22, y=700+Math.sin(i/7*Math.PI)*22; el("circle",{cx:x,cy:y,r:11,fill:i%2?"#FFB300":"#FB8C00"},W)}

// ---------- adult characters (front view; local y=0 at the hip) ----------
function ik(sx,sy,tx,ty,a,b,side){let dx=tx-sx,dy=ty-sy,d=Math.hypot(dx,dy)||1; const dd=Math.min(d,a+b-1); dx/=d; dy/=d;
  const base=Math.atan2(dy,dx), cA=clamp((a*a+dd*dd-b*b)/(2*a*dd),-1,1), al=Math.acos(cA);
  const c1=[sx+Math.cos(base+al)*a,sy+Math.sin(base+al)*a], c2=[sx+Math.cos(base-al)*a,sy+Math.sin(base-al)*a];
  const sc=p=>p[1]+side*p[0]*0.6; const e=sc(c1)>sc(c2)?c1:c2; return [e,[sx+dx*dd,sy+dy*dd]]}
function makeAdult(o){
  const g=el("g",{},o.parent||W), body=el("g",{},g);
  const legs=[];
  if(o.legs) [-1,1].forEach(s=>{const lg_=el("g",{},body); el("path",{d:`M${s*50-30} -14 L${s*50+30} -14 L${s*56+26} 420 L${s*56-26} 420 Z`,fill:o.legs.pant,stroke:INK,"stroke-width":5},lg_);
    el("path",{d:`M${s*56-34} 418 Q${s*56-36} 446 ${s*56+s*14} 448 Q${s*56+46*s} 446 ${s*56+44*s} 424 Z`,fill:o.legs.shoe,stroke:INK,"stroke-width":4},lg_); legs.push(lg_)});
  const hairBack=el("g",{},body);
  if(o.longHair) el("path",{d:"M-72 -40 Q-80 -100 0 -102 Q80 -100 72 -40 L80 72 Q74 98 46 94 L-46 94 Q-74 98 -80 72 Z",fill:o.hair},hairBack);
  if(o.bun){ el("circle",{cx:0,cy:-84,r:36,fill:o.hair,stroke:INK,"stroke-width":3},hairBack);
    if(!o.noFlowers) for(let k=0;k<9;k++){const a=Math.PI*(1.05+k*0.11); el("circle",{cx:Math.cos(a)*40,cy:-84+Math.sin(a)*40,r:7,fill:"#FFFDF5",stroke:"#C9C2B0","stroke-width":1.5},hairBack)}}
  if(o.saree){
    el("path",{d:"M-70 -60 L70 -60 L96 230 L-96 230 Z",fill:o.saree.base,stroke:INK,"stroke-width":5},body);
    for(let k=-2;k<=2;k++) el("line",{x1:k*22,y1:-40,x2:k*30,y2:226,stroke:INK,"stroke-width":2,opacity:.3},body);
    if(o.saree.motif) for(let k=0;k<10;k++) el("circle",{cx:-70+hash(k+90)*140,cy:-20+hash(k+99)*220,r:5,fill:o.saree.motif},body);
    el("path",{d:"M-88 -268 Q-92 -288 -64 -292 L-24 -300 L24 -300 L64 -292 Q92 -288 88 -268 L76 -50 L-76 -50 Z",fill:o.shirt,stroke:INK,"stroke-width":5},body);
    el("path",{d:"M-28 -300 Q0 -262 28 -300",fill:o.skin,stroke:INK,"stroke-width":3},body);
    el("path",{d:"M-76 -120 Q0 -100 76 -120 L76 -50 L-76 -50 Z",fill:o.skin,stroke:INK,"stroke-width":3},body);
    el("path",{d:"M-92 -262 L-40 -300 L96 -100 L90 -10 L60 -10 Z",fill:o.saree.pallu,stroke:INK,"stroke-width":5,"stroke-linejoin":"round"},body);
    el("path",{d:"M-84 -258 L-38 -290 L92 -98",stroke:o.saree.border,"stroke-width":o.saree.bw||9,fill:"none"},body);
    el("path",{d:"M-70 -230 L70 -40",stroke:o.saree.border,"stroke-width":6,fill:"none",opacity:.8},body);
    el("path",{d:"M-96 226 L96 226",stroke:o.saree.border,"stroke-width":14},body);
  } else if(o.kurta){
    el("path",{d:"M-84 -268 Q-88 -286 -62 -290 L-24 -298 L24 -298 L62 -290 Q88 -286 84 -268 L70 -60 L104 220 L-104 220 L-70 -60 Z",fill:o.shirt,stroke:INK,"stroke-width":5},body);
    el("path",{d:"M-30 -298 Q0 -250 30 -298",fill:o.skin,stroke:o.trim,"stroke-width":8},body);
    el("path",{d:"M0 -258 L0 -120",stroke:o.trim,"stroke-width":7,"stroke-dasharray":"10 8"},body);
  } else {
    el("path",{d:"M-94 -268 Q-98 -288 -70 -292 L-26 -300 L26 -300 L70 -292 Q98 -288 94 -268 L82 -10 Q80 0 66 0 L-66 0 Q-80 0 -82 -10 Z",fill:o.shirt,stroke:INK,"stroke-width":5},body);
    el("path",{d:"M-24 -300 L0 -268 L24 -300",fill:o.skin},body);
    el("path",{d:"M-28 -302 L-4 -260 L-40 -276 Z",fill:o.collar||o.shirt,stroke:INK,"stroke-width":4,"stroke-linejoin":"round"},body);
    el("path",{d:"M28 -302 L4 -260 L40 -276 Z",fill:o.collar||o.shirt,stroke:INK,"stroke-width":4,"stroke-linejoin":"round"},body);
    el("line",{x1:0,y1:-262,x2:0,y2:0,stroke:INK,"stroke-width":3,opacity:.55},body);
    [-225,-170,-115,-60].forEach(y=>el("circle",{cx:6,cy:y,r:4,fill:o.button||"#9A9AA6"},body));
    el("path",{d:"M-60 -200 L-30 -200 L-30 -170 L-60 -170 Z",fill:"none",stroke:INK,"stroke-width":3,opacity:.45},body);
    if(o.pen) el("rect",{x:-52,y:-214,width:8,height:34,rx:3,fill:o.pen},body);
  }
  if(o.kanduva){ // cotton towel over the left shoulder (Srinu)
    el("path",{d:"M-96 -270 Q-70 -306 -30 -300 L-44 -250 Q-70 -170 -64 -60 L-100 -60 Q-108 -170 -96 -270 Z",fill:o.kanduva,stroke:INK,"stroke-width":4},body);
    [-84,-74].forEach(x=>el("line",{x1:x,y1:-250,x2:x-4,y2:-66,stroke:o.kanduvaStripe||"#C62828","stroke-width":4},body));
    el("path",{d:"M-100 -70 L-64 -70",stroke:o.kanduvaStripe||"#C62828","stroke-width":5},body)}
  el("rect",{x:-19,y:-334,width:38,height:44,fill:o.skin},body);
  if(o.necklace){ el("path",{d:"M-30 -300 Q0 -240 30 -300",stroke:"#FFC107","stroke-width":8,fill:"none"},body); el("path",{d:"M-40 -296 Q0 -206 40 -296",stroke:"#FFB300","stroke-width":6,fill:"none"},body);
    el("circle",{cx:0,cy:-226,r:10,fill:"#FFC107",stroke:INK,"stroke-width":2.5},body); el("circle",{cx:0,cy:-226,r:4,fill:"#D81B60"},body)}
  if(o.specChain){ el("path",{d:"M-26 -300 Q-30 -230 0 -206 Q30 -230 26 -300",stroke:"#D4A537","stroke-width":3,fill:"none"},body);
    [-15,15].forEach(x=>el("ellipse",{cx:x,cy:-200,rx:13,ry:9,fill:"rgba(220,240,255,.5)",stroke:"#6D4C41","stroke-width":3},body))}
  if(o.badge){ const ly=el("g",{},body); el("path",{d:"M-24 -300 Q-22 -230 -12 -172",stroke:"#2D6CDF","stroke-width":8,fill:"none"},ly); el("path",{d:"M24 -300 Q22 -230 12 -172",stroke:"#2D6CDF","stroke-width":8,fill:"none"},ly);
    const bd=el("g",{transform:"translate(0,-122)"},ly);
    el("rect",{x:-40,y:-52,width:80,height:104,rx:8,fill:"#fff",stroke:INK,"stroke-width":3.5},bd);
    el("rect",{x:-40,y:-52,width:80,height:24,rx:6,fill:"#2D6CDF"},bd);
    el("rect",{x:-14,y:-22,width:28,height:30,rx:3,fill:"#C9D6E3"},bd); el("circle",{cx:0,cy:-11,r:7,fill:"#8A5A3B"},bd);
    txt(o.badge[0],{x:0,y:26,"font-family":"Anton","font-size":17,"text-anchor":"middle",fill:INK},bd);
    txt(o.badge[1],{x:0,y:44,"font-family":"Anton","font-size":12.5,"text-anchor":"middle",fill:"#2D6CDF","letter-spacing":1},bd); o._lany=ly}
  const arm=s=>({up:el("line",{stroke:o.sleeve||o.shirt,"stroke-width":32,"stroke-linecap":"round"},body),
                 lo:el("line",{stroke:o.fore||o.sleeve||o.shirt,"stroke-width":28,"stroke-linecap":"round"},body),
                 cuff:o.cuff?el("circle",{r:15,fill:o.cuff},body):null,
                 bang:o.bangles?el("circle",{r:16,fill:"none",stroke:"#FFC107","stroke-width":6},body):null,
                 hand:el("circle",{r:17,fill:o.skin,stroke:INK,"stroke-width":3},body)});
  const AL=arm(-1), AR=arm(1);
  const itemG=el("g",{},body), items={}, itemGL=el("g",{},body), itemsL={};
  const phoneShape=(p,scr)=>{el("rect",{x:-19,y:-38,width:38,height:68,rx:8,fill:"#1A1A1A",stroke:INK,"stroke-width":3},p); return el("rect",{x:-14,y:-32,width:28,height:54,rx:4,fill:scr},p)};
  items.phone=el("g",{},itemG); phoneShape(items.phone,"#BFE6FF");
  items.laddu=el("g",{},itemG); el("circle",{cx:0,cy:-14,r:15,fill:"#FFA726",stroke:"#B35A00","stroke-width":3},items.laddu);
  for(let k=0;k<6;k++) el("circle",{cx:-8+hash(k+5)*16,cy:-22+hash(k+11)*16,r:2.4,fill:"#E65100"},items.laddu);
  items.plate=el("g",{},itemG); el("ellipse",{cx:0,cy:-6,rx:40,ry:11,fill:"#CFD8DC",stroke:INK,"stroke-width":3},items.plate); el("circle",{cx:-10,cy:-14,r:9,fill:"#FFA726"},items.plate); el("circle",{cx:12,cy:-13,r:9,fill:"#FFCA28"},items.plate);
  itemsL.vcall=el("g",{},itemGL);   // Rohit's phone: a generic video-call grid (no app, no logo)
  el("rect",{x:-24,y:-46,width:48,height:84,rx:9,fill:"#1A1A1A",stroke:INK,"stroke-width":3},itemsL.vcall);
  [["#4FC3F7",-18,-40],["#F48FB1",1,-40],["#AED581",-18,-6],["#FFD54F",1,-6]].forEach(([c,x,y])=>el("rect",{x,y,width:17,height:32,rx:3,fill:c},itemsL.vcall));
  itemsL.album=el("g",{},itemGL);   // Nanna's paper photo album (open)
  el("path",{d:"M-62 -40 L0 -30 L62 -40 L62 30 L0 40 L-62 30 Z",fill:"#8D6E63",stroke:INK,"stroke-width":3},itemsL.album);
  el("path",{d:"M-56 -34 L-3 -25 L-3 34 L-56 26 Z",fill:"#FFF8E1",stroke:INK,"stroke-width":2},itemsL.album); el("path",{d:"M56 -34 L3 -25 L3 34 L56 26 Z",fill:"#FFF8E1",stroke:INK,"stroke-width":2},itemsL.album);
  el("rect",{x:-48,y:-22,width:36,height:28,fill:"#90CAF9",stroke:"#6D4C41","stroke-width":2},itemsL.album); el("rect",{x:12,y:-20,width:36,height:28,fill:"#FFCC80",stroke:"#6D4C41","stroke-width":2},itemsL.album);
  el("circle",{cx:-30,cy:-10,r:6,fill:"#8D5A3B"},itemsL.album); el("circle",{cx:30,cy:-8,r:6,fill:"#8D5A3B"},itemsL.album);
  // head
  const head=el("g",{},body);
  el("ellipse",{cx:-55,cy:2,rx:10,ry:17,fill:o.skin,stroke:INK,"stroke-width":3},head); el("ellipse",{cx:55,cy:2,rx:10,ry:17,fill:o.skin,stroke:INK,"stroke-width":3},head);
  const buds=o.earbuds?[-1,1].map(s=>el("ellipse",{cx:s*57,cy:6,rx:8,ry:10,fill:"#FAFAFA",stroke:INK,"stroke-width":2.5},head)):[];
  el("path",{d:"M-54 -22 Q-56 -72 0 -74 Q56 -72 54 -22 Q54 30 30 56 Q0 74 -30 56 Q-54 30 -54 -22 Z",fill:o.skin,stroke:INK,"stroke-width":4},head);
  if(o.earrings) [-55,55].forEach(x=>el("circle",{cx:x,cy:24,r:6.5,fill:"#F5B347",stroke:INK,"stroke-width":2},head));
  if(o.jhumka) [-56,56].forEach(x=>{el("circle",{cx:x,cy:22,r:6,fill:"#FFC107",stroke:INK,"stroke-width":2},head);
    el("path",{d:`M${x-13} 50 Q${x-12} 28 ${x} 28 Q${x+12} 28 ${x+13} 50 Z`,fill:"#FFB300",stroke:INK,"stroke-width":2.5},head);
    [-8,0,8].forEach(d=>el("circle",{cx:x+d,cy:54,r:3,fill:"#FFF8E1",stroke:INK,"stroke-width":1},head))});
  const face=el("g",{},head);
  if(o.stubble){el("path",{d:"M-52 8 Q-50 42 -28 58 Q0 76 28 58 Q50 42 52 8 Q42 30 22 33 Q0 29 -22 33 Q-42 30 -52 8 Z",fill:o.stubble,opacity:.34},face);
    el("path",{d:"M-20 31 Q0 24 20 31 Q0 35 -20 31 Z",fill:o.stubble,opacity:.4},face);
    for(let k=0;k<26;k++){const a=hash(k+3)*Math.PI, r=40+hash(k+7)*12; el("circle",{cx:Math.cos(a)*r*1.05,cy:22+Math.sin(a)*r*0.82,r:1.6,fill:o.stubble,opacity:.5},face)}}
  el("circle",{cx:-34,cy:20,r:11,fill:"#E57373",opacity:o.blush||0.18},face); el("circle",{cx:34,cy:20,r:11,fill:"#E57373",opacity:o.blush||0.18},face);
  if(o.lines) [-21,21].forEach(x=>{el("path",{d:`M${x-13} 7 Q${x} 13 ${x+13} 7`,stroke:"#7A4A2A","stroke-width":2,fill:"none",opacity:.5},face); el("path",{d:`M${x*1.9} -14 l${x>0?6:-6} 4 M${x*1.9} -8 l${x>0?7:-7} 2`,stroke:"#7A4A2A","stroke-width":2,opacity:.5},face)});
  if(o.old) el("path",{d:"M-30 -46 Q0 -52 30 -46 M-26 -38 Q0 -43 26 -38",stroke:"#7A4A2A","stroke-width":2,fill:"none",opacity:.45},face);
  const eyes=[-21,21].map(x=>{const e=el("g",{transform:`translate(${x},-8)`},face);
    const w=el("ellipse",{rx:12,ry:8,fill:"#fff",stroke:INK,"stroke-width":2},e);
    const ir=el("circle",{r:6.5,fill:"#3B2414"},e); const pu=el("circle",{r:3,fill:"#000"},e); const hl=el("circle",{r:2,fill:"#fff"},e);
    const lid=el("path",{d:"M-13 -3 Q0 -11 13 -3",stroke:INK,"stroke-width":o.lash||3.5,fill:"none","stroke-linecap":"round"},e);
    const cover=el("ellipse",{rx:13,ry:9,fill:o.skin,opacity:0},e); const shut=el("path",{d:"M-12 1 Q0 6 12 1",stroke:INK,"stroke-width":3.5,fill:"none","stroke-linecap":"round",opacity:0},e);
    return {e,w,ir,pu,hl,lid,cover,shut}});
  const brows=[-1,1].map(s=>el("path",{stroke:o.browCol||"#1C1410","stroke-width":o.brow||6,fill:"none","stroke-linecap":"round"},face));
  el("path",{d:"M3 0 Q-5 20 -2 26 Q4 29 10 25",stroke:"#7A4A2A","stroke-width":3,fill:"none","stroke-linecap":"round"},face);
  if(o.bindi) el("circle",{cx:0,cy:-36,r:5.5,fill:"#C62828"},face);
  const mouthO=el("ellipse",{cx:0,cy:44,rx:12,ry:3,fill:"#5A1E1E"},face);
  const lips=el("path",{d:"M-14 43 Q0 47 14 43",stroke:o.lip||"#8A3A3A","stroke-width":4,fill:"none","stroke-linecap":"round"},face);
  const smile=el("path",{d:"M-18 39 Q0 56 18 39",stroke:o.lip||"#8A3A3A","stroke-width":4.5,fill:"none","stroke-linecap":"round",opacity:0},face);
  const laugh=el("path",{d:"M-20 38 Q0 64 20 38 Z",fill:"#5A1E1E",stroke:o.lip||"#8A3A3A","stroke-width":4,opacity:0},face);
  const sad=el("path",{d:"M-14 48 Q0 39 14 48",stroke:o.lip||"#8A3A3A","stroke-width":4.5,fill:"none","stroke-linecap":"round",opacity:0},face);
  const smirk=el("path",{d:"M-14 44 Q4 49 19 37",stroke:o.lip||"#8A3A3A","stroke-width":4.5,fill:"none","stroke-linecap":"round",opacity:0},face);
  const gasp=el("ellipse",{cx:0,cy:46,rx:10,ry:13,fill:"#5A1E1E",stroke:o.lip||"#8A3A3A","stroke-width":3.5,opacity:0},face);
  if(o.moustache) el("path",{d:"M-30 30 Q-16 18 0 25 Q16 18 30 30 Q34 40 24 41 Q12 34 0 37 Q-12 34 -24 41 Q-34 40 -30 30 Z",fill:o.moustache,stroke:INK,"stroke-width":2},face);
  if(o.glasses){ if(o.round) [-21,21].forEach(x=>el("circle",{cx:x,cy:-7,r:16,fill:"rgba(220,240,255,.25)",stroke:o.glasses,"stroke-width":3.5},face));
    else [-21,21].forEach(x=>el("rect",{x:x-17,y:-14,width:34,height:22,rx:9,fill:"rgba(220,240,255,.25)",stroke:o.glasses,"stroke-width":3.5},face));
    el("path",{d:"M-4 -6 Q0 -10 4 -6",stroke:o.glasses,"stroke-width":3.5,fill:"none"},face); [-1,1].forEach(s=>el("line",{x1:s*37,y1:-8,x2:s*52,y2:-12,stroke:o.glasses,"stroke-width":3.5},face))}
  if(o.bun) el("path",{d:"M-58 -6 Q-64 -88 0 -90 Q64 -88 58 -6 Q52 -50 30 -58 Q10 -64 2 -84 Q-8 -64 -30 -58 Q-52 -50 -58 -6 Z",fill:o.hair,stroke:INK,"stroke-width":3},head);
  else if(o.longHair){el("path",{d:"M-60 -6 Q-68 -88 4 -88 Q64 -86 62 -14 Q50 -62 12 -64 Q-12 -46 -40 -44 Q-56 -30 -60 -6 Z",fill:o.hair,stroke:INK,"stroke-width":3},head);
    el("path",{d:"M-62 -20 Q-74 30 -64 80",stroke:o.hair,"stroke-width":18,fill:"none","stroke-linecap":"round"},head); el("path",{d:"M62 -20 Q74 30 64 80",stroke:o.hair,"stroke-width":18,fill:"none","stroke-linecap":"round"},head)}
  else if(o.puff) el("path",{d:"M-58 -10 Q-70 -92 -10 -100 Q40 -112 64 -70 Q70 -40 58 -8 Q54 -52 30 -60 Q4 -70 -24 -60 Q-50 -50 -54 -8 Z",fill:o.hair,stroke:INK,"stroke-width":3},head);
  else el("path",{d:o.recede?"M-58 -10 Q-66 -70 -36 -84 Q0 -96 40 -84 Q64 -66 58 -10 L56 -8 Q54 -46 42 -56 Q20 -50 0 -64 Q-22 -52 -42 -58 Q-54 -46 -56 -8 Z":"M-58 -10 Q-66 -84 -6 -90 Q56 -94 62 -28 L58 -8 Q54 -48 30 -56 Q2 -62 -26 -54 Q-50 -46 -54 -8 Z",fill:o.hair,stroke:INK,"stroke-width":3},head);
  if(o.earbuds) buds.forEach(b_=>head.appendChild(b_));
  [AL.hand,AR.hand,itemG,itemGL].forEach(x=>body.appendChild(x));
  const st={x:0,y:0,s:1,flip:1,rot:0,hop:0,vis:1,talk:0,blink:0,shut:0,look:0,lookY:0,brow:"n",smile:0,laugh:0,sad:0,smirk:0,gasp:0,headRot:0,headY:0,
            hL:[-60,-130],hR:[60,-130],item:"",itemL:"",itemRot:0,itemRotL:0,wink:0,walk:0,lany:1,buds:1};
  const SH=[[-82,-270],[82,-270]];
  function draw(){
    const k=st; g.setAttribute("transform",`translate(${k.x},${k.y-k.hop}) rotate(${k.rot}) scale(${k.s*k.flip},${k.s})`); g.style.opacity=k.vis; g.style.display=k.vis>0?"":"none";
    if(!k.vis) return;
    const ht=`translate(${k.look*3},${-392+k.headY}) rotate(${k.headRot})`; head.setAttribute("transform",ht); hairBack.setAttribute("transform",ht);
    face.setAttribute("transform",`translate(${k.look*7},${k.lookY*3})`);
    legs.forEach((L,i)=>L.setAttribute("transform",`rotate(${(i?1:-1)*k.walk*14} 0 -10)`));
    if(o._lany) o._lany.style.opacity=k.lany;
    buds.forEach((b_,i)=>b_.style.opacity=(i===1?k.buds:1));
    [[AL,SH[0],k.hL,-1],[AR,SH[1],k.hR,1]].forEach(([A,S,T,side])=>{const [e,h]=ik(S[0],S[1],T[0],T[1],118,112,side);
      A.up.setAttribute("x1",S[0]);A.up.setAttribute("y1",S[1]);A.up.setAttribute("x2",e[0]);A.up.setAttribute("y2",e[1]);
      A.lo.setAttribute("x1",e[0]);A.lo.setAttribute("y1",e[1]);A.lo.setAttribute("x2",h[0]);A.lo.setAttribute("y2",h[1]);
      const m=[lerp(e[0],h[0],0.25),lerp(e[1],h[1],0.25)], m2=[lerp(e[0],h[0],0.8),lerp(e[1],h[1],0.8)];
      if(A.cuff){A.cuff.setAttribute("cx",m[0]);A.cuff.setAttribute("cy",m[1])}
      if(A.bang){A.bang.setAttribute("cx",m2[0]);A.bang.setAttribute("cy",m2[1])}
      A.hand.setAttribute("cx",h[0]);A.hand.setAttribute("cy",h[1]); A.h=h});
    itemG.setAttribute("transform",`translate(${AR.h[0]},${AR.h[1]}) rotate(${k.itemRot})`); for(const n in items) items[n].style.opacity=k.item===n?1:0;
    itemGL.setAttribute("transform",`translate(${AL.h[0]},${AL.h[1]}) rotate(${k.itemRotL})`); for(const n in itemsL) itemsL[n].style.opacity=k.itemL===n?1:0;
    const o_=k.talk, quiet=o_<0.12;
    mouthO.setAttribute("ry",2+12*o_); mouthO.setAttribute("rx",11+5*o_); mouthO.style.opacity=quiet?0:1;
    const ex=quiet&&(k.laugh||k.gasp);
    laugh.style.opacity=quiet&&k.laugh?1:0; gasp.style.opacity=quiet&&k.gasp&&!k.laugh?1:0;
    lips.style.opacity=quiet&&!k.smile&&!k.sad&&!k.smirk&&!ex?1:0; smile.style.opacity=quiet&&k.smile&&!ex?1:0; sad.style.opacity=quiet&&k.sad&&!k.smile&&!ex?1:0; smirk.style.opacity=quiet&&k.smirk&&!k.smile&&!ex?1:0;
    eyes.forEach((E,i)=>{const closed=k.blink||k.shut||(k.wink&&i===1); E.cover.style.opacity=closed?1:0; E.shut.style.opacity=closed?1:0; E.lid.style.opacity=closed?0:1;
      E.w.setAttribute("ry",closed?1:8+(k.brow==="u"?2:0)+(k.gasp?2:0)); [E.ir,E.pu].forEach(p=>{p.setAttribute("cx",k.look*4.5);p.setAttribute("cy",k.lookY*3)}); E.hl.setAttribute("cx",k.look*4.5-2.5);E.hl.setAttribute("cy",k.lookY*3-2.5);
      [E.ir,E.pu,E.hl].forEach(p=>p.style.opacity=closed?0:1);
      E.lid.setAttribute("d",k.sad?"M-13 -1 Q0 -9 13 -4":"M-13 -3 Q0 -11 13 -3")});
    brows.forEach((b,i)=>{const s=i?1:-1; const B={n:[-27,-29],u:[-34,-36],s:[-24,-30],a:[-30,-22],q:i?[-37,-35]:[-26,-27],w:[-27,-33]}[k.brow]||[-27,-29];
      const lift=o.sharp?-5:-4; b.setAttribute("d",o.sharp?`M${s*8} ${B[0]+2} Q${s*24} ${Math.min(B[0],B[1])-9} ${s*34} ${B[1]+3}`:`M${s*8} ${B[0]} Q${s*20} ${(B[0]+B[1])/2+lift} ${s*33} ${B[1]}`)});
  }
  function aim(side,wx,wy){const lx=(wx-st.x)/(st.s*st.flip), ly=(wy-(st.y-st.hop))/st.s; if(side==="L") st.hL=[lx,ly]; else st.hR=[lx,ly]}
  // forehead point in world coords (where the number floats, just above the brows)
  function fore(){const k=st; return [k.x+k.look*3*k.s*k.flip, k.y-k.hop+(-392+k.headY-50)*k.s]}
  return {st,draw,g,aim,fore};
}
// recurring cast (tools/anim2d/cast.md) + this reel's new characters
const NIKHIL_OPT={skin:"#C98B5E",hair:"#1C1410",shirt:"#45454D",collar:"#3A3A42",stubble:"#5A3A28",brow:6.5,lip:"#7A3A30"};
const ANANYA_OPT={skin:"#D9A47A",hair:"#2A1A14",shirt:"#1E8C8C",trim:"#F5B347",kurta:true,longHair:true,fore:"#D9A47A",sleeve:"#1E8C8C",cuff:"#F5B347",earrings:true,brow:4.5,lash:4,blush:0.3,lip:"#A0404A"};
const SAROJA_OPT={skin:"#C68C62",hair:"#2A1E1A",shirt:"#1F6E5A",saree:{base:"#B0204A",pallu:"#C2185B",border:"#F2B53A"},sleeve:"#1F6E5A",fore:"#C68C62",bun:true,bindi:true,earrings:true,specChain:true,lines:true,brow:4.5,lash:4,blush:0.3,lip:"#9A3040"};   // Amma, ~55
const PRASAD_OPT={skin:"#B87D55",hair:"#A8A8A8",shirt:"#F4F4EE",collar:"#E4E4DA",button:"#C9C9C0",moustache:"#D8D8D8",glasses:"#5D4037",recede:true,lines:true,pen:"#1E88E5",brow:6,browCol:"#8A8A8A",lip:"#7A3A30"};   // Nanna, ~60
const VIMALA_OPT={skin:"#C88A5E",hair:"#1E1412",shirt:"#4A148C",saree:{base:"#6A1B9A",pallu:"#AD1457",border:"#FFC107",motif:"#FFD54F",bw:12},sleeve:"#4A148C",fore:"#C88A5E",bun:true,bindi:true,jhumka:true,necklace:true,bangles:true,sharp:true,lines:true,brow:5.5,lash:4.5,blush:0.25,lip:"#B0203A"};   // Vimala aunty, ~52 (new)
const ROHIT_OPT={skin:"#C68A5E",hair:"#17110E",shirt:"#E8E0CC",trim:"#B08D57",kurta:true,sleeve:"#E8E0CC",puff:true,earbuds:true,brow:6,lip:"#7A3A30"};   // Rohit, ~30, US son (new)
const SRINU_OPT={skin:"#9C6440",hair:"#1A1410",shirt:"#F7F7F2",collar:"#ECECE4",button:"#D8D8D0",kanduva:"#FFF8E7",kanduvaStripe:"#C62828",moustache:"#1E1612",brow:6.5,lip:"#6A3028"};   // Srinu, ~29, farmer cousin (new)
const AMMAMMA_OPT={skin:"#B98060",hair:"#C9C9C9",shirt:"#7B1E2B",saree:{base:"#F4F1E8",pallu:"#F7F4EC",border:"#7B1E2B",bw:11},sleeve:"#7B1E2B",fore:"#B98060",bun:true,noFlowers:true,glasses:"#6D4C41",round:true,lines:true,old:true,bindi:true,brow:4.5,browCol:"#9E9E9E",lash:3.5,blush:0.2,lip:"#8A4A40"};   // Ammamma, ~74 (new)

// ---------- furniture (far plane) ----------
function chairAt(x,col="#E53935"){const g=el("g",{transform:`translate(${x},${SY}) scale(${FAR})`},W);
  el("path",{d:"M-62 -230 Q0 -250 62 -230 L58 -10 L-58 -10 Z",fill:col,stroke:INK,"stroke-width":5},g);
  for(let k=0;k<3;k++) el("rect",{x:-40,y:-200+k*50,width:80,height:16,rx:6,fill:"#000",opacity:.18},g);
  return g}
function chairFront(x,col="#E53935"){const g=el("g",{transform:`translate(${x},${SY}) scale(${FAR})`},W);
  el("rect",{x:-74,y:-14,width:148,height:30,rx:10,fill:col,stroke:INK,"stroke-width":5},g);
  [-62,62].forEach(lx=>el("path",{d:`M${lx-8} 14 L${lx+8} 14 L${lx+(lx>0?20:-20)} 210 L${lx+(lx>0?4:-4)} 210 Z`,fill:col,stroke:INK,"stroke-width":4},g)); return g}
// sofa (back) for Amma, Nikhil, Nanna
const SOFA0=700, SOFA1=1090;
el("rect",{x:SOFA0,y:1000,width:SOFA1-SOFA0,height:220,rx:34,fill:"#8E1F4F",stroke:"#FF80AB","stroke-width":6},W);
for(let k=1;k<3;k++) el("line",{x1:SOFA0+k*(SOFA1-SOFA0)/3,y1:1020,x2:SOFA0+k*(SOFA1-SOFA0)/3,y2:1200,stroke:"#6A1239","stroke-width":5},W);
// tray table (steel laddu tray) beside the sofa
el("rect",{x:1140,y:1110,width:150,height:20,rx:6,fill:"#8D6E63",stroke:INK,"stroke-width":4},W);
el("rect",{x:1200,y:1130,width:30,height:200,fill:"#6D4C41",stroke:INK,"stroke-width":3},W);
el("ellipse",{cx:1215,cy:1104,rx:70,ry:14,fill:"#CFD8DC",stroke:INK,"stroke-width":4},W);
for(let k=0;k<7;k++) el("circle",{cx:1170+k*15,cy:1092-((k%2)*8),r:10,fill:k%3?"#FFA726":"#FFCA28",stroke:"#B35A00","stroke-width":1.5},W);
// plastic chairs: Ammamma (310), Vimala (420), Rohit's (545), the phone chair (655)
const chB=[310,420,545,655].map((x,i)=>chairAt(x,i%2?"#E53935":"#F5F5F5"));
// stacked chairs (time-lapse): grows by the door
const stack=el("g",{transform:`translate(1165,${SY+150})`},W), stackK=[];
for(let k=0;k<6;k++){const g=el("g",{transform:`translate(0,${-k*26}) scale(${FAR})`},stack); el("path",{d:"M-62 -230 Q0 -250 62 -230 L58 -10 L-58 -10 Z",fill:k%2?"#F5F5F5":"#E53935",stroke:INK,"stroke-width":5},g);
  el("rect",{x:-74,y:-14,width:148,height:30,rx:10,fill:k%2?"#F5F5F5":"#E53935",stroke:INK,"stroke-width":5},g); stackK.push(g)}

// ---------- cast ----------
const SR=makeAdult({...SRINU_OPT,legs:{pant:"#F2EFE6",shoe:"#6D4C41"}});                 // far, standing by Ammamma
const AMM=makeAdult(AMMAMMA_OPT);                                                          // far, seated
chairFront(310,"#F5F5F5");
const VIF=makeAdult(VIMALA_OPT);                                                           // far, seated (from L5)
chairFront(420,"#E53935");
const RO=makeAdult({...ROHIT_OPT,legs:{pant:"#EDE7D9",shoe:"#6D4C41"}});                 // far, standing on his phone
const ROS=makeAdult(ROHIT_OPT);                                                            // far, seated (after the phone goes down)
chairFront(545,"#F5F5F5"); chairFront(655,"#E53935");
const phoneDown=el("g",{transform:`translate(655,${SY-14})`},W); el("rect",{x:-26,y:-8,width:52,height:12,rx:4,fill:"#1A1A1A",stroke:INK,"stroke-width":3},phoneDown);
const AMA=makeAdult(SAROJA_OPT), NKS=makeAdult(NIKHIL_OPT), NAN=makeAdult(PRASAD_OPT);    // on the sofa
W.insertBefore(NKS.g, AMA.g);   // Amma's feeding hand stays in front of Nikhil
el("rect",{x:SOFA0-10,y:1170,width:SOFA1-SOFA0+20,height:160,rx:26,fill:"#A8295F",stroke:"#FF80AB","stroke-width":6},W);   // sofa seat front
[SOFA0-30,SOFA1-10].forEach(x=>el("rect",{x,y:1060,width:40,height:270,rx:18,fill:"#7A1A44",stroke:"#FF80AB","stroke-width":5},W));   // arms
const AN=makeAdult({...ANANYA_OPT,legs:{pant:"#F3E5AB",shoe:"#8D6E63"}});                 // far, standing by the sofa
const NKN=makeAdult({...NIKHIL_OPT,badge:["NIKHIL R","TOWER B"],legs:{pant:"#2B3240",shoe:"#1A1A1A"}});   // near: just in from the office
const VIN=makeAdult({...VIMALA_OPT});                                                      // near: blocks his way

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

// ---------- forehead numbers (HTML, crisp neon) ----------
// NUMBER TABLE (script.json): start -> live change -> end of the 8-11 PM time-lapse
const PEOPLE={ammamma:[AMM,4500,4503], amma:[AMA,3250,3253], nanna:[NAN,3180,3183], srinu:[SR,2400,2403], vimala:[VIF,1900,1903], vimalaN:[VIN,1900,1903],
  ananya:[AN,610,610], nikhil:[NKS,96,100], nikhilN:[NKN,96,96], rohit:[RO,12,12], rohitS:[ROS,12,15]};
$("nums").innerHTML=Object.keys(PEOPLE).map(k=>`<div class="num${k==="ammamma"?" big":""}" id="n-${k}"></div>`).join("")+`<div class="plus" id="plus1">+1</div><div class="spark" id="spark">✨</div>`;
const fmt=n=>n>=1000?Math.floor(n/1000)+","+String(n%1000).padStart(3,"0"):String(n);

// ---------- timeline ----------
const COLORS={gopi:"#F5B347",nikhil:"#C9C3F2",ananya:"#7FE0D0",vimala:"#FF8AD8",ammamma:"#FFE082"}, NAMES={gopi:"GOPI",nikhil:"NIKHIL",ananya:"ANANYA",vimala:'VIMALA <span class="te">అత్తయ్య</span>',ammamma:"AMMAMMA"};
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

let B=null;
function beats(){ if(B) return B; B={};
  B.titleIn=1.5; B.crore=at(0,"crore"); B.jab=at(0,"నీకెంత");
  B.ign0=at(1,"అందరి")-0.05; B.ign1=at(1,"number"); B.titleOut=E(1)+0.15;
  B.wR=S(2)-0.12; B.wS=at(2,"వ్యవసాయం")-0.12; B.t2400=at(2,"two thousand"); B.wBack=E(2)+0.05;
  B.slots=S(3)+0.05; B.tHold=at(3,"Answer"); B.tMiss=at(3,"clues");
  B.nearOff=S(4)-0.15; B.tTap=at(4,"అయినా"); B.slot1=at(4,"పెద్ద");
  B.sofa=S(5)-0.15; B.tFeed=at(5,"laddu")-0.15; B.tTick=at(5,"పెడుతుంటే")+0.25; B.t97=at(5,"ninety"); B.slot2=B.t97+0.15; B.wRo=at(5,"Rohit")-0.12; B.slot3=at(5,"కదలట్లేదు")+0.1;
  B.fol0=S(6)-0.1; B.tFol=at(6,"కొట్టి")+0.1; B.fol1=at(6,"comment")-0.05; B.tQ=at(6,"comment"); B.tCm=at(6,"Five");
  B.CD0=E(6)+0.1; B.CD1=B.CD0+TL.countdown; B.cb=CB.map((_,i)=>B.CD0+0.35+i*0.65);
  B.rev=S(7)-0.05; B.tFam=at(7,"family"); B.tPhone=at(7,"phone"); B.tShrug=E(7)-0.35;
  B.why=E(7)+0.1; B.tMath=at(8,"నాలుగు")-0.35; B.tPocket=E(8)-0.55;
  // script L10 (Vimala's line) is cut for length: the turn plays silently in clay between Nikhil's line and Gopi's
  B.clay=E(8)+0.12; B.tPoint=B.clay+0.1; B.tBud=B.clay+0.3; B.tDown=B.clay+0.62; B.tSit=B.clay+0.88; B.tPat=B.clay+1.0;
  B.tl0=Math.max(B.clay+1.3,at(9,"Correct")+0.35); B.tCheck=at(9,"Correct"); B.tQ2=at(9,"మీ");
  B.sh0=S(10)-0.1; B.tl1=B.sh0-0.45;   // 8:00 -> 11:00 PM; each +1 lands on the hour (9, 10, 11), 11 PM holds before the share card
  B.tAt=at(10,"cousin")-0.2; B.tTag=at(10,"tag")+0.15; B.end0=at(10,"Follow")-0.15; B.tEF=at(10,"Follow")+0.3; B.loop0=at(10,"clue")-0.04;
  return B}

const focus=(z,wx,wy,sx=540,sy=1000)=>({z,fx:wx-(sx-540)/z,fy:wy-(sy-1000)/z});
const mixCam=(a,b_,k)=>({z:lerp(a.z,b_.z,k),fx:lerp(a.fx,b_.fx,k),fy:lerp(a.fy,b_.fy,k)});
let curSkin="";
function skinTo(s){ if(s!==curSkin){ setSkin(s); curSkin=s } }

function frame(t){
  const b=beats();
  const loop=t>=b.loop0;
  const tf=loop?0:t;                                    // opening/loop share frame 1
  const clay=!loop&&t>=b.clay;
  skinTo(clay?"clay":"neon");
  const near=loop||t<b.nearOff, punchFar=!loop&&((t>=b.wR&&t<b.wBack));
  const reset=(C,who,x,y,s)=>Object.assign(C.st,{x,y,s,talk:who?talkOf(who,t):0,blink:((tf*0.6+x*0.0013)%3.3)<0.11?1:0,shut:0,look:0,lookY:0,brow:"n",smile:0,laugh:0,sad:0,smirk:0,gasp:0,
    headRot:0,headY:0,hop:0,rot:0,item:"",itemL:"",itemRot:0,itemRotL:0,vis:1,flip:1,wink:0,walk:0,lany:1,buds:1,hL:[-62,-66],hR:[62,-66]});
  const T=loop?0:t;   // character time (frozen pose on the loop frame)

  // ---------------- near pair: Vimala blocks Nikhil at the entrance (L1-L3, loop) ----------------
  const nn=NKN.st; reset(NKN,loop?null:"nikhil",200,NY,NEAR); nn.vis=near&&!punchFar?1:0; nn.look=0.7; nn.lookY=-0.1; nn.brow="w"; nn.smile=0;
  // pulling off the office lanyard (left hand at the strap), bag hand down
  NKN.aim("L",200-20,NY-0.95*290); nn.hR=[66,-30];
  if(T>0.6&&T<b.jab){ nn.smile=1; nn.brow="n" }
  if(T>=b.jab){ nn.smile=0; nn.brow="w"; nn.look=0.8; nn.headRot=-2 }
  if(T>=b.ign1&&T<b.wR){ nn.brow="u"; nn.look=0.3; nn.lookY=-0.8 }
  if(T>=b.wBack-0.05&&T<b.nearOff){ nn.brow="w"; nn.look=0.9; nn.smirk=1 }
  if(loop) { nn.brow="w"; nn.look=0.7; nn.lookY=-0.1; nn.smile=0 }
  NKN.draw();
  const vn=VIN.st; reset(VIN,loop?null:"vimala",820,NY,NEAR); vn.vis=nn.vis; vn.flip=-1; vn.look=0.7; vn.brow="q"; vn.smirk=1; vn.headRot=Math.sin(T*2.2)*2;
  VIN.aim("L",820+70,NY-0.95*60); VIN.aim("R",820-60,NY-0.95*120);    // hand on hip / bangles
  if(T>b.crore-0.2&&T<b.jab){ VIN.aim("R",820-150,NY-0.95*420); vn.brow="u"; vn.headRot=-4 }        // "crore!" hand up, rings flashing
  if(T>=b.jab&&T<b.ign0){ VIN.aim("R",820-260,NY-0.95*300); vn.brow="q"; vn.smirk=1 }                 // points at Nikhil
  if(T>=b.ign0&&T<b.wR){ vn.brow="u"; vn.gasp=1; vn.smirk=0; vn.lookY=-0.9; vn.look=0.2 }              // the numbers light up
  if(T>=b.wBack-0.1&&T<b.nearOff){ vn.brow="u"; vn.gasp=1; vn.smirk=0; vn.look=1; vn.lookY=0.1; VIN.aim("R",820-90,NY-0.95*330) }   // eyes flick to Nikhil's 96
  if(loop){ vn.brow="q"; vn.smirk=1; vn.look=0.7 }
  VIN.draw();

  // ---------------- far plane ----------------
  // Srinu helps Ammamma (hands her a plate), later stands by her
  const sr=SR.st; reset(SR,null,185,FY,FAR); sr.rot=6; sr.smile=1; sr.look=0.8; sr.lookY=0.5; SR.aim("R",265,FY+40); SR.aim("L",210,FY+80); sr.item="plate"; sr.itemRot=-6;
  if(T>=b.wS&&T<b.wBack){ sr.rot=3; sr.look=0.6; sr.lookY=0; sr.smile=1; sr.brow="u" }
  if(T>=b.nearOff){ sr.item=""; sr.rot=2; sr.look=0.7; SR.aim("R",255,FY+30); if(T>b.tTap) sr.laugh=1 }
  if(clay){ sr.item=""; sr.rot=0; sr.look=0.5; sr.lookY=0.4; sr.smile=1; SR.aim("R",265,FY-10) }
  SR.draw();
  const am=AMM.st; reset(AMM,loop?null:"ammamma",310,SY,FAR); am.smile=1; am.look=-0.4; am.lookY=0.3; AMM.aim("L",280,SY-40); AMM.aim("R",345,SY-40); am.headRot=Math.sin(T*1.1)*1.5;
  if(T<b.nearOff||loop){ am.look=-0.6; AMM.aim("L",250,SY-70) }   // takes the plate from Srinu
  if(!loop&&T>=b.nearOff&&!clay){ am.look=0.2; am.lookY=-0.2; am.laugh=T>b.tTap?0:0; if(T>b.tTap&&T<E(4)+0.3){ const tp=Math.abs(Math.sin((T-b.tTap)*9)); AMM.aim("R",310+40*FAR+tp*4,SY-FAR*402+tp*5); am.smile=1; am.brow="u" } if(T>=E(4)+0.3) am.laugh=1 }
  if(clay&&T>=b.tl0){ am.shut=1; am.headRot=10; am.headY=6; am.smile=1 }   // dozing
  AMM.draw();
  // Vimala (far, seated by Rohit) from L5
  const vf=VIF.st; reset(VIF,loop?null:"vimala",420,SY,FAR); vf.vis=!near?1:0; vf.look=0.8; vf.brow="w"; vf.headRot=Math.sin(T*1.6)*2;
  VIF.aim("L",395,SY-50); VIF.aim("R",440,SY-50);
  if(!near&&T<b.clay){ vf.look=0.9; vf.lookY=-0.2; vf.brow="w"; vf.sad=1 }
  if(T>=b.clay){ vf.look=1; vf.brow="a"; vf.sad=0; VIF.aim("R",505,SY-FAR*250); if(T>b.tBud){ vf.brow="w"; vf.smile=0; VIF.aim("R",470,SY-FAR*200+Math.sin(T*12)*6) } }   // "Rohit… phone down"
  if(T>=b.tSit){ vf.brow="n"; vf.smile=1; vf.look=1 }
  if(T>=b.tPat&&T<b.tl0+0.9){ const k=Math.abs(Math.sin((T-b.tPat)*8)); VIF.aim("R",520-k*6,SY-FAR*392+8); vf.smile=1; vf.shut=0 }
  if(clay&&T>=b.tl0+0.9){ vf.smile=1; vf.look=0.8; VIF.aim("R",470,SY-60) }
  VIF.draw();
  // Rohit: standing on his video call until he puts the phone down, then seated next to his mother
  const ro=RO.st; reset(RO,null,565,FY,FAR); ro.lookY=1; ro.look=-0.1; ro.headY=8; ro.headRot=5; ro.itemL="vcall"; ro.itemRotL=4; ro.hL=[-24,-200]; ro.hR=[30,-170]; ro.smile=0;
  ro.talk=Math.abs(Math.sin(T*7))*0.25*((Math.floor(T*1.3)%2)?1:0);                        // murmuring into the call
  if(T>=b.clay){ ro.lookY=0; ro.headY=0; ro.headRot=0; ro.look=-1; ro.brow="u"; ro.talk=0 }
  if(T>=b.tBud){ ro.buds=0; ro.hR=[50,-430] }
  if(T>=b.tBud+0.3){ ro.hR=[50,-150] }
  if(T>=b.tDown-0.25){ const k=ease((T-(b.tDown-0.25))/0.25); RO.aim("L",lerp(565-14,655,k),lerp(FY-0.6*200,SY-30,k)); if(T>=b.tDown){ ro.itemL="" } }
  if(T>=b.tDown+0.1){ RO.aim("L",530,FY-60) }
  ro.vis=!loop&&T>=b.tSit?0:1;
  RO.draw();
  const rs=ROS.st; reset(ROS,null,545,SY,FAR); rs.vis=!loop&&T>=b.tSit?1:0; rs.flip=-1; rs.look=1; rs.smile=1; rs.buds=0; rs.headRot=-4; ROS.aim("L",520,SY-50); ROS.aim("R",570,SY-50);
  if(clay&&T>=b.tl0+0.9){ rs.laugh=1; rs.look=0.6 }
  ROS.draw();
  phoneDown.style.opacity=!loop&&T>=b.tDown?1:0;
  // the sofa: Amma (waves + laddu), Nikhil (from L5), Nanna
  const sofa=!near;
  const a_=AMA.st; reset(AMA,null,780,SY,FAR); a_.smile=1; a_.look=-0.6; a_.headRot=Math.sin(T*1.3)*2;
  AMA.aim("L",755,SY-50); const wv=Math.sin(T*9); AMA.aim("R",800+wv*8,SY-FAR*470); a_.item="laddu";   // waves at Nikhil with a laddu
  if(sofa){ a_.look=0.8; a_.lookY=0; AMA.aim("R",840,SY-80); a_.item="laddu"; a_.headRot=4 }
  if(sofa&&T>=b.tFeed&&T<b.rev){ const k=ease((T-b.tFeed)/0.35); AMA.aim("R",lerp(840,885,k),lerp(SY-80,SY-FAR*(392-44)+4,k)); a_.laugh=0; a_.smile=1; a_.item=T<b.tTick+0.2?"laddu":"" }
  if(sofa&&T>=b.rev){ a_.item=""; AMA.aim("R",820,SY-60); a_.look=0.9 }
  if(clay&&T>=b.tl0){ a_.look=0.8; a_.lookY=0.4; a_.smile=1; AMA.aim("R",870,SY-90); a_.item="" }
  AMA.draw();
  const ns=NKS.st; reset(NKS,loop?null:"nikhil",900,SY,FAR); ns.vis=sofa?1:0; ns.look=-0.5; ns.smile=1; NKS.aim("L",870,SY-50); NKS.aim("R",930,SY-50);
  if(sofa&&T>=b.tFeed&&T<b.rev){ ns.look=-0.8; ns.headRot=-6; ns.laugh=T>b.tTick-0.1&&T<b.tTick+0.6?1:0; ns.shut=ns.laugh; ns.smile=1 }
  if(sofa&&T>=b.t97&&T<b.rev){ ns.look=1; ns.brow="u"; ns.laugh=0; ns.shut=0; ns.smile=0; ns.gasp=1 }          // Ananya: "నీది 97!"
  if(sofa&&T>=b.CD0&&T<b.rev){ ns.gasp=0; ns.brow="w"; ns.look=0.2; ns.lookY=-0.9 }                          // looks up at his number
  if(sofa&&T>=b.rev&&T<b.why){ ns.brow="u"; ns.look=1; ns.lookY=0; ns.gasp=0; ns.smile=0 }
  if(sofa&&T>=b.why&&T<b.clay){ ns.smile=0; ns.sad=1; ns.brow="w"; const k=(T-b.why)/(b.tMath-b.why+0.4); ns.look=k<0.5?-1:1; ns.lookY=0.2;
    ns.item="phone"; ns.itemRot=-8; NKS.aim("R",915,SY-118); if(T>=b.tPocket){ const p=ease((T-b.tPocket)/0.4); NKS.aim("R",lerp(915,930,p),lerp(SY-118,SY+10,p)); ns.itemRot=lerp(-8,90,p); if(p>=1) ns.item="" } }
  if(clay){ ns.sad=0; ns.smile=1; ns.look=0.9; ns.lookY=0.5; ns.brow="n"; NKS.aim("R",950,SY-60) }
  NKS.draw();
  const na=NAN.st; reset(NAN,null,1020,SY,FAR); na.smile=0; na.look=-0.5; na.lookY=0.2; NAN.aim("L",990,SY-50); NAN.aim("R",1045,SY-50); na.headRot=Math.sin(T*0.9)*1.5;
  if(sofa&&T<b.clay){ na.look=-0.8; na.smile=1 }
  if(clay&&T>=b.tl0){ na.look=-0.9; na.lookY=0.5; na.smile=1; na.itemL="album"; NAN.aim("L",955,SY-95); na.itemRotL=-8 }
  NAN.draw();
  // Ananya: by the sofa from L5; shrugs at her own 610 (L8); waves bye at the door (start of the time-lapse)
  const an=AN.st; reset(AN,loop?null:"ananya",1150,FY,FAR); an.vis=!near&&T<b.tl0+0.8?1:0; an.flip=-1; an.look=0.9; an.lookY=0.3; an.smile=1; an.brow="q";
  AN.aim("L",1180,FY-60); AN.aim("R",1120,FY-60);
  if(T>=b.sofa&&T<b.t97){ AN.aim("R",1010,FY-0.6*330); an.brow="u" }                  // "చూడు…" points at Nikhil's number
  if(T>=b.wRo-0.3&&T<b.slot3+0.4){ an.look=1; an.lookY=0; an.brow="q"; an.smirk=1; an.smile=0 }
  if(T>=b.rev&&T<b.why){ an.smile=1; an.brow="n"; an.look=0.8 }
  if(T>=b.tShrug&&T<b.why+0.3){ AN.aim("R",1150-10,FY-0.6*442); AN.aim("L",1215,FY-0.6*260); an.brow="u"; an.smile=0; an.sad=1; an.look=0; an.lookY=-0.6 }   // taps her own 610, shrugs
  if(T>=b.tl0){ an.x=70; an.flip=1; an.look=0.4; an.smile=1; const w=Math.sin((T-b.tl0)*14); AN.aim("R",70+90,FY-0.6*470+w*10); an.vis=clamp((b.tl0+0.8-T)/0.25) }   // "Divya bye!" at the door
  AN.draw();

  // furniture changes in the time-lapse
  const tlk=clay?clamp((T-b.tl0)/(b.tl1-b.tl0)):0;
  stackK.forEach((g,k)=>g.style.opacity=clay&&tlk>k/6?1:0);
  [2].forEach(i=>chB[i].style.opacity=1);
  fairy.forEach((f,i)=>{const off=clay&&hash(i*7.3)<tlk*0.85; f.setAttribute("opacity",off?0.08:0.55+0.45*Math.sin(tf*3+i*1.7))});
  {const hr=8+3*tlk; clkH.setAttribute("transform",`rotate(${hr*30})`); clkM.setAttribute("transform",`rotate(${(hr%1)*360+tlk*3*360})`)}
  doorWarm.setAttribute("opacity",clay?0.95:0.85);

  // ---------------- Gopi (narrator badge) ----------------
  const g=GOPI.st;
  const nIn=(i,pre=0.15,post=0.2)=>t>S(i)-pre&&t<E(i)+post;
  const narOn=!loop&&(nIn(1)||nIn(3)||nIn(6,0.15,0.05)||nIn(9)||(t>S(10)-0.15&&t<b.end0));
  const narT=t>S(10)-0.15?S(10)-0.15:t>S(9)-0.15?S(9)-0.15:t>S(6)-0.15?S(6)-0.15:t>S(3)-0.15?S(3)-0.15:S(1)-0.15;
  const topR=t<S(4)||(t>S(9)-0.3&&t<S(10)-0.15); const BX=topR?915:165, BY=t<S(4)?600:topR?650:1385;
  Object.assign(g,{x:0,y:400*0.55+12,s:0.55,talk:talkOf("gopi",t),blink:((t*0.7)%3.1)<0.12?1:0,wink:0,look:BX>540?-0.5:0.5,lookY:0,brow:"n",smile:0,headRot:Math.sin(t*2.2)*3,item:"",armL:200,armR:160,lenL:115,lenR:115,hop:0,itemRot:0});
  if(t>S(3)&&t<E(3)){ g.brow="q"; g.look=-0.8 }
  if(t>b.tMiss&&t<E(3)+0.2){ g.wink=1; g.smile=1 }
  if(t>b.fol0&&t<b.fol1){ g.armR=40; g.item="point"; g.itemRot=-30 }
  if(t>b.tQ&&t<E(6)){ g.brow="u"; g.look=0 }
  if(t>S(9)){ g.smile=1; g.brow="q" }
  GOPI.draw();
  const bs=narOn?Math.max(0.001,back((t-narT)/0.35)):0;
  badge.setAttribute("transform",`translate(${BX},${BY}) scale(${bs*(BX>540?0.82:1)}) rotate(${Math.sin(t*2)*2})`); badge.style.opacity=narOn?1:0;

  // ---------------- camera ----------------
  const punch=(t0,a_=0.1)=>t>t0?a_*Math.exp(-(t-t0)*4)*clamp((t-t0)/0.06):0;
  const OPEN=focus(1.0+0.012*tf,540,1000);
  const WIDE=focus(1.0,540,1000);
  const WIDE2=focus(0.93,620,860,540,1060);
  const shots=[
    [0,OPEN],
    [b.ign0-0.2,mixCam(OPEN,WIDE,1),0.4],
    [b.wR,focus(2.05+0.03*(t-b.wR)+punch(at(2,"twelve"),0.12),565,800,540,880),0.2],
    [b.wS,focus(2.0+0.03*(t-b.wS)+punch(b.t2400,0.14),235,830,540,900),0.2],
    [b.wBack,focus(1.3,510,1150,540,1060),0.18],
    [S(3)-0.1,focus(1.0+0.02*(t-S(3)),540,1000),0.3],
    [b.nearOff,focus(2.15+0.04*(t-b.nearOff)+punch(b.tTap,0.08),300,905,540,960),0.2],
    [b.sofa,focus(1.75+0.02*(t-b.sofa)+punch(b.tTick,0.1),965,975,540,980),0.22],
    [b.t97-0.05,focus(2.3+punch(b.t97,0.12),905,960,540,960),0.15],
    [b.wRo,focus(2.3+0.04*(t-b.wRo),565,820,540,900),0.18],
    [b.fol0,WIDE2,0.3],
    [b.rev,focus(1.7+0.03*(t-b.rev),960,960,540,1000),0.25],
    [b.why,focus(2.6+0.04*(t-b.why)+punch(b.tMath,0.06),905,965,540,980),0.25],
    [b.clay,focus(1.9+0.03*(t-b.clay),500,910,540,980),0.25],
    [b.tl0,focus(0.85+0.01*(t-b.tl0),580,860,540,1060),0.3],
  ];
  let cm=OPEN;
  if(loop) cm=OPEN;
  else { let i=0; while(i+1<shots.length&&t>=shots[i+1][0]) i++;
    const [t0,c,tr]=shots[i]; cm=c;
    if(i>0&&tr&&t<t0+tr){ const prev=shots[i-1][1]; cm=mixCam(prev,c,ease((t-t0)/tr)) } }
  let sx=0,sy=0; const shake=(t0,d,a_)=>{if(t>t0&&t<t0+d){const q=(1-(t-t0)/d)*a_; sx+=Math.sin(t*90)*q; sy+=Math.cos(t*77)*q}};
  if(!loop){ shake(b.ign1,0.25,6); shake(b.t2400,0.25,7); shake(b.CD1,0.25,8) }
  cam.setAttribute("transform",`translate(${540+sx},${1000+sy}) scale(${cm.z}) translate(${-cm.fx},${-cm.fy})`);
  const scr=(wx,wy)=>[540+(wx-cm.fx)*cm.z+sx, 1000+(wy-cm.fy)*cm.z+sy];

  // ---------------- forehead numbers ----------------
  const order=["vimalaN","srinu","nikhilN","ammamma","rohit","amma","nanna"];      // ignite: Vimala first, then left -> right
  const ignAt=k=>{const j=order.indexOf(k); return j<0?b.ign0:(j===0?b.ign0:b.ign0+0.25+(j-1)*(b.ign1-b.ign0-0.1)/6)};
  const cdk=t-b.CD0, cdOn=!loop&&t>=b.CD0&&t<b.CD1, tick=cdOn?Math.exp(-(cdk-Math.floor(cdk))*7):0;
  const flashRev=!loop&&t>=b.rev&&t<b.rev+0.35;
  for(const k in PEOPLE){
    const [C,v0,v1]=PEOPLE[k], e=$("n-"+k), st=C.st;
    let v=v0;
    if(k==="nikhil"&&t>=b.tTick) v=97;
    if(clay&&t>=b.tl0){ const steps=Math.min(3,Math.floor(tlk*3+1e-6)); /* +1 at 9:00, 10:00, 11:00 PM (hr = 8 + 3*tlk) */ if(k==="nikhil") v=97+steps; else if(k==="rohitS") v=12+steps; else if(k!=="ananya") v=v0+Math.min(v1-v0,steps) }
    if(k==="nikhil"&&clay&&t<b.tl0) v=97;
    const on=!loop&&st.vis>0.5&&t>=ignAt(k)&&!(k==="ananya"&&!(t>=b.sofa-0.2));
    e.style.opacity=on?Math.min(1,st.vis):0; if(!on) continue;
    const [wx,wy]=C.fore(); const [px,py]=scr(wx,wy);
    const fs=Math.max(30,64*st.s*cm.z)*(k==="ammamma"?1.12:1);
    const ig=pop(t,ignAt(k),0.3);
    let sc=Math.max(0.01,ig)*(1+0.14*tick)*(flashRev?1.15:1);
    if(k==="ammamma"&&t>b.tTap&&t<E(4)+0.5) sc*=1+0.1*Math.abs(Math.sin((t-b.tTap)*6));
    if(k==="rohit"&&t>=b.wR&&t<b.wS) sc*=1+0.12*Math.exp(-(t-at(2,"twelve"))*5)*(t>at(2,"twelve")?1:0);
    if(k==="srinu"&&t>=b.t2400&&t<b.wBack) sc*=1+0.18*Math.exp(-(t-b.t2400)*5);
    if(k==="nikhil"&&t>=b.tTick&&t<b.tTick+0.4) sc*=1+0.3*Math.exp(-(t-b.tTick)*8);
    e.textContent=fmt(v); e.style.fontSize=fs+"px";
    const glitch=k==="rohit"&&t>=b.wRo&&t<b.fol0&&Math.floor(t*12)%3===0;
    e.className="num"+(k==="ammamma"?" big":"")+(glitch?" glitch":"");
    e.style.filter=flashRev?"brightness(2)":"";
    e.style.transform=`translate(${px}px,${py}px) translate(-50%,-50%) translateX(${glitch?Math.sin(t*90)*4:0}px) scale(${sc})`;
  }
  {const e=$("plus1"), k=(t-b.tTick)/0.8, [wx,wy]=NKS.fore(), [px,py]=scr(wx,wy); e.style.opacity=!loop&&k>0&&k<1?1-k:0; e.style.transform=`translate(${px+40}px,${py-60-k*70}px)`}
  {const t100=b.tl1, e=$("spark"), k=(t-t100)/0.9, [wx,wy]=NKS.fore(), [px,py]=scr(wx,wy); e.style.opacity=!loop&&k>0&&k<1?Math.sin(k*Math.PI):0;
   e.style.transform=`translate(${px-30}px,${py-70}px) scale(${0.8+k*0.6}) rotate(${k*40}deg)`}
  {const e=$("shimmer"), k=(t-b.ign0-0.2)/(b.ign1-b.ign0+0.2); e.style.opacity=!loop&&k>0&&k<1?Math.sin(k*Math.PI):0; e.style.left=lerp(-260,1080,k)+"px"}

  // ---------------- HTML overlays ----------------
  const show=(id,on,s=1,extra="")=>{const e=$(id); e.style.opacity=on?1:0; if(on) e.style.transform=`${extra} scale(${Math.max(0.01,s)})`};
  let dm=0; if(t>=b.fol0&&t<b.rev) dm=0.30*clamp((t-b.fol0)/0.3); $("dim").style.opacity=loop?0:dm;
  // text hook (frame 1) + WHAT IF title a beat later
  {const on=loop||t<b.titleOut; show("hook",on,1,`rotate(${loop?-1.5:-1.5+Math.sin(t*3)*0.6}deg)`); $("hook").style.opacity=on?(loop?1:clamp((b.titleOut-t)/0.15)):0;
   $("hookT").textContent=(!loop&&t>=S(1)-0.05)?"అందరి forehead మీద ఒక number…":"Forehead మీద number… ఏంటది? 🤔";
   const ti=$("title"), ton=!loop&&t>b.titleIn&&t<b.titleOut; ti.style.opacity=ton?clamp((b.titleOut-t)/0.15):0; ti.style.transform=`scale(${Math.max(0.01,back((t-b.titleIn)/0.45))}) rotate(-2deg)`}
  // chips
  const chipAt=(id,on,x,y,s,rot=0)=>{const c=$(id); c.style.opacity=on?1:0; if(on){c.style.left=x+"px"; c.style.top=y+"px"; c.style.transform=`translate(-50%,0) scale(${Math.max(0.01,s)}) rotate(${rot}deg)`}};
  chipAt("cUS",!loop&&t>b.crore&&t<b.ign0,560,1300,pop(t,b.crore,0.3),-4);
  chipAt("cBtech",!loop&&t>b.wS+0.25&&t<b.wBack,560,330,pop(t,b.wS+0.25,0.3),-3);
  show("hold",!loop&&t>b.tHold&&t<b.nearOff,lerp(1.8,1,out((t-b.tHold)/0.2)),`rotate(${-3+Math.sin(t*5)*1.2}deg)`);
  // clue slots: appear in L4, fill as the clues land, stay through the countdown
  {const on=!loop&&t>b.slots&&t<b.rev; $("slots").style.opacity=on?clamp((t-b.slots)/0.2):0;
   [b.slot1,b.slot2,b.slot3].forEach((t0,i)=>{const sl=$("sl"+i), full=t>t0; sl.className="slot"+(full?" full":""); sl.querySelector(".q").style.opacity=full?0:1;
     const c=sl.querySelector(".c"); c.style.opacity=full?1:0; c.style.transform=`scale(${full?Math.max(0.01,pop(t,t0,0.35)):1})`;
     sl.style.transform=`scale(${(t>b.tMiss&&t<b.tMiss+0.6)?1+0.06*Math.sin((t-b.tMiss)*Math.PI*5):(full&&t<t0+0.3?lerp(1.15,1,(t-t0)/0.3):(cdOn?1+0.04*tick:1))})`})}
  // follow tap
  const fA=b.fol0, fB=b.fol1+0.15; const fOn=!loop&&t>fA&&t<fB; const fol=$("fol"); fol.style.opacity=fOn?clamp(Math.min((t-fA)/0.2,(fB-t)/0.12)):0;
  fol.style.transform=`scale(${Math.max(0.01,back((t-fA)/0.4))*(Math.abs(t-b.tFol)<0.1?0.9:1)})`;
  const bF=$("bF"); bF.textContent=t<b.tFol?"+ FOLLOW":"FOLLOWING ✓"; bF.className="btn"+(t<b.tFol?"":" done");
  {const hand=$("tapHand"); const hk=ease((t-fA-0.1)/Math.max(0.3,b.tFol-fA-0.2)); const dip=Math.max(0,1-Math.abs(t-b.tFol)/0.1);
   hand.style.opacity=fOn?clamp(Math.min((t-fA-0.05)/0.15,(fB-t)/0.12)):0; hand.style.transform=`translate(${lerp(900,560,hk)-50}px,${lerp(1620,1260,hk)+dip*12}px) rotate(${-8+dip*6}deg)`;
   const rg_=$("ring"), rk=(t-b.tFol)/0.45; rg_.style.opacity=fOn&&rk>0&&rk<1?1-rk:0; rg_.style.left="560px"; rg_.style.top="1260px"; rg_.style.transform=`scale(${1+rk*6})`}
  // question + countdown + comment bubbles (none gives the answer away)
  show("q",!loop&&t>b.tQ-0.05&&t<b.CD1,pop(t,b.tQ-0.05,0.4)*(1+0.03*tick));
  show("cnow",!loop&&t>b.tCm-0.05&&t<b.CD1,Math.max(0.01,pop(t,b.tCm-0.05,0.35))*(1+0.05*Math.sin(t*Math.PI*4)));
  {const sec=Math.floor(cdk), fr=cdk-sec;
   $("cdw").style.opacity=cdOn?clamp(cdk/0.15)*clamp((TL.countdown-cdk)/0.15):0;
   if(cdOn){const n_=Math.max(1,TL.countdown-sec); $("digit").textContent=n_; $("digit").style.transform=`scale(${lerp(1.5,1,out(fr/0.2))})`; $("digit").style.color=n_<=1?"#FF5252":"#7FF6FF";
     $("arc").setAttribute("stroke-dasharray",`${565.5*(1-cdk/TL.countdown)} 565.5`); $("cdw").style.transform=`scale(${1+Math.exp(-fr*8)*0.08})`}}
  CB.forEach((_,i)=>{const e=$("cb"+i), t0=b.cb[i], k=pop(t,t0,0.3); const on=!loop&&t>t0&&t<b.CD1; e.style.opacity=on?clamp((b.CD1-t)/0.15):0;
    e.style.transform=`translateY(${-(t-t0)*18}px) scale(${Math.max(0.01,k)}) rotate(${(i%2?3:-3)}deg)`});
  // reveal label (above the sofa, pointing down at Nikhil's number)
  {const on=!loop&&t>b.tFam-0.1&&t<b.why; const e=$("lab"); e.style.opacity=on?1:0; e.style.transform=`translateY(${lerp(-60,0,out((t-b.tFam+0.1)/0.3))}px) scale(${Math.max(0.01,pop(t,b.tFam-0.1,0.35))})`;
   $("lab2").style.opacity=t>b.tPhone-0.05?1:0}
  // maths chip (L9)
  show("math",!loop&&t>b.tMath&&t<b.clay,pop(t,b.tMath,0.35),`rotate(-2deg)`);
  // time-lapse clock + ✅ + comment question
  {const on=clay&&t>=b.tl0-0.1&&t<b.sh0; const hr=8+3*tlk; const h=Math.floor(hr+1e-6), m=Math.floor((hr-h)*60/5)*5;
   show("tclk",on,pop(t,b.tl0-0.1,0.3)); $("tclkT").textContent=`🕗 ${h}:${String(m).padStart(2,"0")} PM`}
  show("check",clay&&t>b.tCheck&&t<b.sh0+0.1,pop(t,b.tCheck,0.35),`rotate(-8deg)`);
  show("q2",clay&&t>b.tQ2-0.05&&t<b.sh0+0.1,pop(t,b.tQ2-0.05,0.35),`rotate(-1.5deg)`);
  // share: tag the cousin
  {const shOn=!loop&&t>b.sh0&&t<b.end0+0.1; const sh=$("share"); sh.style.opacity=shOn?clamp(Math.min((t-b.sh0)/0.2,(b.end0+0.1-t)/0.15)):0;
   $("sq").style.transform=`scale(${Math.max(0.01,back((t-b.sh0)/0.4))})`;
   $("cin").innerHTML=t>b.tAt?(t>b.tTag+0.1?'<em>@Cousin 🫠</em> నువ్వే గుర్తొచ్చావ్ 😅':"@"+(t>b.tAt+0.3?"Cou":"")):"";
   ["ct1","ct2","ct3"].forEach((id,i)=>{const e=$(id), t0=b.tAt+0.1+i*0.08; e.style.opacity=t>t0?1:0; e.style.transform=`translateY(${lerp(30,0,out((t-t0)/0.25))}px) scale(${id==="ct1"&&Math.abs(t-b.tTag)<0.1?0.94:1})`; e.style.background=id==="ct1"&&t>b.tTag?"#FFF3B0":"#fff"});
   $("ok1").style.opacity=t>b.tTag+0.1?1:0}
  // end card with the follow tap, then the hard cut to frame 1
  {const ec=$("endc"), eOn=!loop&&t>b.end0&&t<b.loop0; ec.style.opacity=eOn?clamp((t-b.end0)/0.12):0;
   $("eF").textContent=t<b.tEF?"FOLLOW @_REELRASAM":"FOLLOWING ✓  @_REELRASAM"; $("eF").style.transform=`scale(${Math.abs(t-b.tEF)<0.1?0.92:1})`; $("eF").style.background=t<b.tEF?"":"#6D6875";
   const eh=$("eHand"), ek=ease((t-b.end0)/Math.max(0.2,b.tEF-b.end0-0.05)), edip=Math.max(0,1-Math.abs(t-b.tEF)/0.1);
   eh.style.opacity=eOn&&t<b.tEF+0.4?1:0; eh.style.transform=`translate(${lerp(900,500,ek)-50}px,${lerp(1300,800,ek)+edip*12}px) scale(${1-0.1*edip}) rotate(-8deg)`}
  // flashes: the numbers igniting, the whip-pans, the reveal, the warm clay glow
  const fl=(t0,d,a_)=>t>t0&&t<t0+d?a_*(1-(t-t0)/d):0;
  const f=$("flash"); const warm=t>=b.clay-0.15&&t<b.clay+0.4; f.style.background=warm?"#FFC46B":"#fff";
  f.style.opacity=loop?0:(fl(b.ign0,0.12,0.35)+fl(b.wR,0.1,0.25)+fl(b.wS,0.1,0.25)+fl(b.rev,0.18,0.55)+(warm?0.85*clamp(1-Math.abs(t-b.clay)/0.35):0));
  // subtitles (… -> ...)
  const sub=$("sub"), L=curLine(t);
  if(L&&!(t>E(10)+0.02)){sub.style.opacity=1; sub.innerHTML=`<span class="who" style="background:${COLORS[L.who]}">${NAMES[L.who]}</span><br>${L.text.replace(/…/g,"...")}`} else sub.style.opacity=0;
  if(t<0.15) sub.style.opacity=0;
}

window.render=function(t){ frame(t) };
