// Modern dilemma #2 "the junior's salary" — drawn world, cast and choreography (loaded by ep.html).
// (makeAdult rig reused from 18 Nov "the reference call", with polo/fluffy/roundFace/band/pin/lowBun/rect specs/samosa/bottle added.)
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
const $=id=>document.getElementById(id);
// comment bubbles during the countdown (generic names; none hints at the HR mail, a calm meeting or the ending)
const CB=[["Ravi","A — 6 years ఊరికే కాదు","#1E88E5",30,1230],["Priya","B — switch చేస్తేనే hike 💯","#D81B60",500,1300],["Teja","Loyalty = 14 lakhs 💀","#2E7D32",30,1370],
          ["Anu","A, ఇప్పుడే వెళ్ళు bro","#8E24AA",590,1440],["Karthik","Samosa చల్లారిపోయింది 😂","#E65100",30,1510],["Sneha","🤔","#00897B",930,1000]];
$("cbs").innerHTML=CB.map(([n,g,c,x,y],i)=>`<div class="cb" id="cb${i}" style="left:${x}px;top:${y}px"><b style="color:${c}">${n}</b><i>${g}</i></div>`).join("");
// after the reveal (A/B/C prompt): a few comment pops
const CB2=[["Vamsi","C 📄 💯","#00897B",720,1200],["Swathi","Literally me 💀","#1E88E5",660,1330],["Sai","B… but respect","#D81B60",320,1330]];
$("cbs").innerHTML+=CB2.map(([n,g,c,x,y],i)=>`<div class="cb" id="cc${i}" style="left:${x}px;top:${y}px"><b style="color:${c}">${n}</b><i>${g}</i></div>`).join("");
// hand for the A/B taps
{const h=document.createElement("div"); h.className="hand"; h.id="abHand"; h.textContent="👆"; document.body.appendChild(h)}
// torn-paper edge for the flashback inset
{const pts=[]; const N=26; const j=(i,s)=>((hash(i*3.1+s)-0.5)*1.6);
 for(let i=0;i<=N;i++) pts.push(`${(i/N*100).toFixed(2)}% ${(1.2+j(i,1)).toFixed(2)}%`);
 for(let i=1;i<=N;i++) pts.push(`${(98.8+j(i,2)*0.8).toFixed(2)}% ${(i/N*100).toFixed(2)}%`);
 for(let i=N-1;i>=0;i--) pts.push(`${(i/N*100).toFixed(2)}% ${(98.6+j(i,3)).toFixed(2)}%`);
 for(let i=N-1;i>0;i--) pts.push(`${(1.2+j(i,4)*0.8).toFixed(2)}% ${(i/N*100).toFixed(2)}%`);
 $("fb").style.setProperty("--torn",`polygon(${pts.join(",")})`)}

// ---------- defs + camera ----------
const defs=el("defs",{});
const cam=el("g",{});
applySkin(cam, defs);
const W=el("g",{id:"world"},cam);
const CY=1300, CS=0.95;          // cafeteria: seated hip, scale (table top 1240)
const CB_=3000, HY=1250, HS=1.0; // Hema's cabin: x offset, seated hip, scale (desk top 1190)

// ===== CAFETERIA, Tower B, Hitech City (x -300..1400): cream wall, Hema's glass cabin door (left), a pillar clock, the
// window band with generic glass towers, a chai/samosa counter (right), a far table with two colleagues, the long table =====
el("rect",{x:-700,y:-900,width:2400,height:2200,fill:"#FCEBD2"},W);
el("rect",{x:-700,y:1040,width:2400,height:200,fill:"#F6C98E"},W);                       // wainscot
el("rect",{x:-700,y:1034,width:2400,height:10,fill:"#E0A960"},W);
// window band (behind Nikhil + Kiran)
el("rect",{x:400,y:300,width:1300,height:470,fill:"#BFE3F5",stroke:"#5E6B78","stroke-width":10},W);
[[420,470,140,"#8FB8D8"],[580,380,120,"#A7C8E2"],[720,330,170,"#7FA9CC"],[910,430,130,"#9CC0DD"],[1060,350,150,"#86B0D2"],[1230,460,130,"#A2C4DF"]].forEach(([x,y,w,c],k)=>{
  el("rect",{x,y,width:w,height:770-y,fill:c,stroke:"#5E7C96","stroke-width":3},W);
  for(let r=y+22;r<760;r+=32) for(let q=x+12;q<x+w-12;q+=24) el("rect",{x:q,y:r,width:12,height:16,fill:hash(q*r+k)>0.72?"#FFF4C9":"#E6F1F8",opacity:.9},W)});
for(let x=400;x<=1700;x+=220) el("rect",{x:x-5,y:300,width:10,height:470,fill:"#5E6B78"},W);
el("circle",{cx:640,cy:250,r:0,fill:"none"},W);
// pillar with the digital clock (HTML #wclk tracks it)
el("rect",{x:300,y:240,width:90,height:800,fill:"#F3DDBB",stroke:"#D9B98A","stroke-width":4},W);
// Hema's glass cabin door (A's destination): frosted glass, door frame, handle; the sign is HTML (#door)
el("rect",{x:-120,y:430,width:380,height:610,fill:"#CFE6EF",stroke:"#56616C","stroke-width":12},W);
el("rect",{x:-120,y:640,width:380,height:46,fill:"#FFFFFF",opacity:.6},W);
[[-60,450,-100,1030],[60,450,20,1030],[170,450,130,1030]].forEach(([x1,y1,x2,y2])=>el("polygon",{points:`${x1},${y1} ${x1+26},${y1} ${x2+26},${y2} ${x2},${y2}`,fill:"#FFFFFF",opacity:.3},W));
el("rect",{x:200,y:760,width:12,height:90,rx:4,fill:"#90A4AE",stroke:INK,"stroke-width":3},W);
// a potted plant by the door
el("rect",{x:-200,y:960,width:70,height:80,rx:8,fill:"#E07A3F",stroke:INK,"stroke-width":4},W);
[[-190,900],[-165,880],[-140,905]].forEach(([x,y])=>el("ellipse",{cx:x,cy:y,rx:20,ry:48,fill:"#43A047",stroke:INK,"stroke-width":3,transform:`rotate(${(x+165)*1.2} ${x} ${y+40})`},W));
// far table with two colleagues (silent), in front of the window
const farPeople=el("g",{},W);
const farTable=el("g",{},W);
[[372],[1010]].forEach(([x])=>{el("rect",{x:x-70,y:968,width:140,height:12,rx:4,fill:"#E9C9A0",stroke:INK,"stroke-width":3},farTable); el("rect",{x:x-8,y:980,width:16,height:60,fill:"#B98A55"},farTable)});
// chai + samosa counter (right, behind Kiran): steel, an urn, a tray of samosas (no shop name)
const counterG=el("g",{},W);
el("rect",{x:1120,y:880,width:560,height:30,fill:"#ECEFF1",stroke:INK,"stroke-width":5},counterG);
el("rect",{x:1130,y:910,width:540,height:130,fill:"#B0BEC5",stroke:INK,"stroke-width":5},counterG);
el("path",{d:"M1180 880 L1186 790 Q1230 770 1274 790 L1280 880 Z",fill:"#CFD8DC",stroke:INK,"stroke-width":4},counterG);
el("rect",{x:1222,y:842,width:16,height:14,fill:"#78909C",stroke:INK,"stroke-width":2},counterG);
el("rect",{x:1320,y:858,width:200,height:22,rx:4,fill:"#90A4AE",stroke:INK,"stroke-width":3},counterG);
for(let k=0;k<5;k++) el("path",{d:`M${1336+k*36} 858 L${1352+k*36} 830 L${1368+k*36} 858 Z`,fill:"#E0A040",stroke:"#8A5A1A","stroke-width":2.5},counterG);
// the long lunch table (front) is drawn after the people
const people=el("g",{},W);
const tableG=el("g",{},W);
el("rect",{x:-400,y:1238,width:2000,height:28,rx:6,fill:"#E9B87A",stroke:INK,"stroke-width":5},tableG);
el("rect",{x:-380,y:1266,width:1960,height:600,fill:"#C98B4E",stroke:INK,"stroke-width":5},tableG);
for(let k=0;k<8;k++) el("rect",{x:-380+k*250,y:1266,width:10,height:600,fill:"#B57A40"},tableG);
// table-top props: Ananya's steel plate (meals), Nikhil's plate + chai glass, Kiran's tray (lands in frame 1) + his plain water bottle
const propG=el("g",{},W);
el("ellipse",{cx:250,cy:1236,rx:70,ry:14,fill:"#CFD8DC",stroke:INK,"stroke-width":3},propG);
el("ellipse",{cx:232,cy:1228,rx:26,ry:9,fill:"#FFFDF5"},propG); el("ellipse",{cx:272,cy:1228,rx:18,ry:7,fill:"#F9A825"},propG);
el("ellipse",{cx:560,cy:1236,rx:62,ry:13,fill:"#CFD8DC",stroke:INK,"stroke-width":3},propG);
const plateSam=el("g",{transform:"translate(548,1232)"},propG);
el("path",{d:"M-22 4 L0 -34 L10 -16 Q4 -10 12 -6 Q8 0 16 4 Z",fill:"#E0A040",stroke:"#8A5A1A","stroke-width":3.5,"stroke-linejoin":"round"},plateSam);
const nkGlass=el("g",{transform:"translate(650,1238)"},propG);
el("path",{d:"M-14 -44 L14 -44 L11 0 L-11 0 Z",fill:"#E3EEF2",stroke:INK,"stroke-width":3},nkGlass); el("path",{d:"M-12.5 -30 L12.5 -30 L11 0 L-11 0 Z",fill:"#B9773E"},nkGlass);
const tray=el("g",{},W);
el("rect",{x:-80,y:-14,width:160,height:16,rx:5,fill:"#455A64",stroke:INK,"stroke-width":3},tray);
el("ellipse",{cx:34,cy:-18,rx:40,ry:9,fill:"#CFD8DC",stroke:INK,"stroke-width":2.5},tray);
for(let k=0;k<2;k++) el("path",{d:`M${16+k*30} -18 L${28+k*30} -42 L${40+k*30} -18 Z`,fill:"#E0A040",stroke:"#8A5A1A","stroke-width":2.5},tray);
el("path",{d:"M-62 -56 L-40 -56 L-43 -16 L-59 -16 Z",fill:"#E3EEF2",stroke:INK,"stroke-width":3},tray); el("path",{d:"M-60.5 -44 L-41.5 -44 L-43 -16 L-59 -16 Z",fill:"#B9773E"},tray);
const bottle=el("g",{},W);
el("rect",{x:-13,y:-64,width:26,height:72,rx:9,fill:"#4FC3F7",stroke:INK,"stroke-width":3},bottle); el("rect",{x:-9,y:-78,width:18,height:16,rx:4,fill:"#1565C0",stroke:INK,"stroke-width":3},bottle);

// ===== HEMA'S CABIN (x CB_..): glass back wall with the cafeteria far beyond, whiteboard, plant, desk, laptop =====
const C0=el("g",{},W);
el("rect",{x:CB_-700,y:-900,width:2400,height:2200,fill:"#E3EEF5"},C0);
el("rect",{x:CB_-100,y:520,width:1280,height:670,fill:"#FDF1DE",stroke:"#56616C","stroke-width":12},C0);      // glass wall: the cafeteria far beyond
el("rect",{x:CB_-100,y:900,width:1280,height:290,fill:"#F6D7A8"},C0);
[[CB_+60,940],[CB_+700,950]].forEach(([x,y])=>{el("rect",{x,y,width:240,height:10,rx:3,fill:"#E9B87A",stroke:"#B57A40","stroke-width":2},C0)});
const farKiranG=el("g",{},C0);
el("rect",{x:CB_-100,y:520,width:1280,height:670,fill:"#DDF0F8",opacity:.35},C0);
el("rect",{x:CB_-100,y:690,width:1280,height:36,fill:"#FFFFFF",opacity:.55},C0);
[[CB_+120,540,CB_+40,1180],[CB_+560,540,CB_+480,1180],[CB_+980,540,CB_+900,1180]].forEach(([x1,y1,x2,y2])=>el("polygon",{points:`${x1},${y1} ${x1+30},${y1} ${x2+30},${y2} ${x2},${y2}`,fill:"#FFFFFF",opacity:.3},C0));
for(let x=CB_+330;x<=CB_+760;x+=430) el("rect",{x:x-6,y:520,width:12,height:670,fill:"#56616C"},C0);
el("rect",{x:CB_+1000,y:300,width:260,height:180,rx:6,fill:"#FAFAF7",stroke:"#6F7C88","stroke-width":5},C0);   // whiteboard (no text)
el("path",{d:`M${CB_+1030} 350 Q${CB_+1090} 320 ${CB_+1140} 370 T${CB_+1230} 360`,stroke:"#1E88E5","stroke-width":5,fill:"none"},C0);
el("rect",{x:CB_+1040,y:400,width:90,height:8,rx:3,fill:"#E53935"},C0);
el("rect",{x:CB_-180,y:1090,width:80,height:100,rx:10,fill:"#5C6BC0",stroke:INK,"stroke-width":4},C0);
[[-170,1030],[-140,1000],[-112,1032]].forEach(([x,y])=>el("ellipse",{cx:CB_+x,cy:y,rx:22,ry:56,fill:"#43A047",stroke:INK,"stroke-width":3,transform:`rotate(${(x+140)*1.1} ${CB_+x} ${y+45})`},C0));
const cabinPeople=el("g",{},W);
const deskG=el("g",{},W);
el("rect",{x:CB_-300,y:1188,width:1700,height:26,rx:6,fill:"#F1E3CF",stroke:INK,"stroke-width":5},deskG);
el("rect",{x:CB_-280,y:1214,width:1660,height:700,fill:"#B9A58A",stroke:INK,"stroke-width":5},deskG);
el("rect",{x:CB_+900,y:1150,width:44,height:40,rx:6,fill:"#FFFFFF",stroke:INK,"stroke-width":4},deskG);   // Hema's mug
el("path",{d:`M${CB_+944} 1160 Q${CB_+960} 1170 ${CB_+944} 1182`,stroke:INK,"stroke-width":4,fill:"none"},deskG);
// Hema's laptop (screen toward camera; the document is the HTML #lap label)
const lapG=el("g",{},W);
el("rect",{x:-125,y:-160,width:250,height:160,rx:10,fill:"#37474F",stroke:INK,"stroke-width":5},lapG);
const lapScr=el("rect",{x:-112,y:-148,width:224,height:136,rx:4,fill:"#ECEFF1"},lapG);   // turns to the lid back once Hema turns it to Nikhil (L11)
el("path",{d:"M-140 0 L140 0 L150 12 L-150 12 Z",fill:"#90A4AE",stroke:INK,"stroke-width":4},lapG);
const LAPX=CB_+590, LAPY=1188;

// ---------- adult characters (front view; local y=0 at the hip) ----------
function ik(sx,sy,tx,ty,a,b,side){let dx=tx-sx,dy=ty-sy,d=Math.hypot(dx,dy)||1; const dd=Math.min(d,a+b-1); dx/=d; dy/=d;
  const base=Math.atan2(dy,dx), cA=clamp((a*a+dd*dd-b*b)/(2*a*dd),-1,1), al=Math.acos(cA);
  const c1=[sx+Math.cos(base+al)*a,sy+Math.sin(base+al)*a], c2=[sx+Math.cos(base-al)*a,sy+Math.sin(base-al)*a];
  const sc=p=>p[1]+side*p[0]*0.6; const e=sc(c1)>sc(c2)?c1:c2; return [e,[sx+dx*dd,sy+dy*dd]]}
let T_=0;   // global clock for small jitters (band buzz)
function makeAdult(o){
  const g=el("g",{},o.parent||W), body=el("g",{},g);
  const legs=[];
  if(o.legs) [-1,1].forEach(s=>{const lg_=el("g",{},body); el("path",{d:`M${s*50-30} -14 L${s*50+30} -14 L${s*56+26} 420 L${s*56-26} 420 Z`,fill:o.legs.pant,stroke:INK,"stroke-width":5},lg_);
    el("path",{d:`M${s*56-34} 418 Q${s*56-36} 446 ${s*56+s*14} 448 Q${s*56+46*s} 446 ${s*56+44*s} 424 Z`,fill:o.legs.shoe,stroke:INK,"stroke-width":4},lg_); legs.push(lg_)});
  const hairBack=el("g",{},body);
  if(o.longHair) el("path",{d:"M-72 -40 Q-80 -100 0 -102 Q80 -100 72 -40 L80 72 Q74 98 46 94 L-46 94 Q-74 98 -80 72 Z",fill:o.hair},hairBack);
  if(o.bun&&o.lowBun) el("ellipse",{cx:50,cy:30,rx:30,ry:26,fill:o.hair,stroke:INK,"stroke-width":3},hairBack);
  else if(o.bun){ el("circle",{cx:0,cy:-84,r:36,fill:o.hair,stroke:INK,"stroke-width":3},hairBack);
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
  } else if(o.polo){   // polo T-shirt: soft collar, short placket with 2 buttons, short sleeves (no logo)
    el("path",{d:"M-94 -268 Q-98 -288 -70 -292 L-26 -300 L26 -300 L70 -292 Q98 -288 94 -268 L82 -10 Q80 0 66 0 L-66 0 Q-80 0 -82 -10 Z",fill:o.shirt,stroke:INK,"stroke-width":5},body);
    el("path",{d:"M-22 -300 L0 -272 L22 -300",fill:o.skin},body);
    el("path",{d:"M-12 -282 L12 -282 L12 -226 L-12 -226 Z",fill:o.collar||o.shirt,stroke:INK,"stroke-width":3},body);
    [-266,-244].forEach(y=>el("circle",{cx:0,cy:y,r:3.5,fill:o.button||"#FFFDF5"},body));
    el("path",{d:"M-34 -304 Q-20 -296 -4 -282 L-14 -262 Q-34 -270 -50 -284 Z",fill:o.collar||o.shirt,stroke:INK,"stroke-width":4,"stroke-linejoin":"round"},body);
    el("path",{d:"M34 -304 Q20 -296 4 -282 L14 -262 Q34 -270 50 -284 Z",fill:o.collar||o.shirt,stroke:INK,"stroke-width":4,"stroke-linejoin":"round"},body);
    el("path",{d:"M-82 -22 L82 -22",stroke:o.collar||o.shirt,"stroke-width":8,opacity:.7},body);
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
    txt(o.badge[1],{x:0,y:44,"font-family":"Anton","font-size":o.badge[1].length>8?11:12.5,"text-anchor":"middle",fill:"#2D6CDF","letter-spacing":o.badge[1].length>8?0.4:1},bd);
    if(o.pin){ const pg=el("g",{transform:"translate(30,-62) rotate(-8)"},bd); const pts=[]; for(let k=0;k<10;k++){const r=k%2?13:29, a=-Math.PI/2+k*Math.PI/5; pts.push(`${(Math.cos(a)*r).toFixed(1)},${(Math.sin(a)*r).toFixed(1)}`)}
      el("polygon",{points:pts.join(" "),fill:"#FFC107",stroke:INK,"stroke-width":3,"stroke-linejoin":"round"},pg);
      txt("P1",{x:0,y:6,"font-family":"Anton","font-size":15,"text-anchor":"middle",fill:INK},pg); o._pin=pg}
    o._lany=ly; o._bd=bd}
  const arm=s=>({up:el("line",{stroke:o.shortSleeve?o.skin:(o.sleeve||o.shirt),"stroke-width":o.shortSleeve?27:32,"stroke-linecap":"round"},body),
                 cap:o.shortSleeve?el("line",{stroke:o.shirt,"stroke-width":40,"stroke-linecap":"round"},body):null,
                 lo:el("line",{stroke:o.fore||o.sleeve||o.shirt,"stroke-width":28,"stroke-linecap":"round"},body),
                 cuff:o.cuff?el("circle",{r:15,fill:o.cuff},body):null,
                 bang:o.bangles?el("circle",{r:16,fill:"none",stroke:"#FFC107","stroke-width":6},body):null,
                 hand:el("circle",{r:17,fill:o.skin,stroke:INK,"stroke-width":3},body)});
  const AL=arm(-1), AR=arm(1);
  const watch=o.watch?el("rect",{x:-14,y:-11,width:28,height:22,rx:6,fill:o.watch,stroke:INK,"stroke-width":3},body):null;
  const band=o.band?el("g",{},body):null, bandScr=o.band?(el("rect",{x:-16,y:-9,width:32,height:18,rx:7,fill:o.band,stroke:INK,"stroke-width":3},band), el("rect",{x:-7,y:-6,width:14,height:12,rx:3,fill:"#263238"},band)):null;
  const itemG=el("g",{},body), items={}, itemGL=el("g",{},body), itemsL={};
  const phoneShape=(p,scr)=>{el("rect",{x:-19,y:-38,width:38,height:68,rx:8,fill:"#1A1A1A",stroke:INK,"stroke-width":3},p); return el("rect",{x:-14,y:-32,width:28,height:54,rx:4,fill:scr},p)};
  items.phone=el("g",{},itemG); phoneShape(items.phone,"#BFE6FF");
  const samosa=(p,bit)=>{el("path",{d:bit?"M-22 4 L0 -34 L10 -16 Q4 -10 12 -6 Q8 0 16 4 Z":"M-22 4 L0 -34 L22 4 Z",fill:"#E0A040",stroke:"#8A5A1A","stroke-width":3.5,"stroke-linejoin":"round"},p);
    el("path",{d:"M-12 -2 L0 -22",stroke:"#B9772A","stroke-width":2.5},p); if(bit) el("path",{d:"M10 -16 Q4 -10 12 -6 Q8 0 16 4",stroke:"#FFE0A0","stroke-width":3,fill:"none"},p)};
  items.samosa=el("g",{},itemG); samosa(items.samosa,false); items.samosaBit=el("g",{},itemG); samosa(items.samosaBit,true);
  itemsL.bottle=el("g",{},itemGL); el("rect",{x:-13,y:-64,width:26,height:72,rx:9,fill:"#4FC3F7",stroke:INK,"stroke-width":3},itemsL.bottle); el("rect",{x:-9,y:-78,width:18,height:16,rx:4,fill:"#1565C0",stroke:INK,"stroke-width":3},itemsL.bottle);
  itemsL.phone=el("g",{},itemGL); phoneShape(itemsL.phone,"#BFE6FF");
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
  const glassShape=p=>{el("path",{d:"M-14 -44 L14 -44 L11 0 L-11 0 Z",fill:"#E3EEF2",stroke:INK,"stroke-width":3},p); el("path",{d:"M-12.5 -30 L12.5 -30 L11 0 L-11 0 Z",fill:"#B9773E"},p);
    for(let k=0;k<3;k++) el("line",{x1:-9+k*9,y1:-42,x2:-8+k*8,y2:-2,stroke:"#FFFFFF","stroke-width":1.5,opacity:.5},p)};
  items.glass=el("g",{},itemG); glassShape(items.glass); itemsL.glass=el("g",{},itemGL); glassShape(itemsL.glass);
  items.cert=el("g",{},itemG); el("rect",{x:-70,y:-56,width:120,height:84,rx:4,fill:"#FFF8E1",stroke:"#B8860B","stroke-width":6},items.cert);
  el("circle",{cx:-10,cy:-26,r:12,fill:"#FFC107",stroke:INK,"stroke-width":2.5},items.cert); [-6,4,14].forEach((y,k)=>el("rect",{x:-48,y,width:k?60:76,height:5,rx:2,fill:"#8D6E63"},items.cert));
  itemsL.phoneUp=el("g",{},itemGL); el("rect",{x:-21,y:-40,width:42,height:72,rx:8,fill:"#1A1A1A",stroke:INK,"stroke-width":3},itemsL.phoneUp); el("rect",{x:-16,y:-34,width:32,height:58,rx:4,fill:"#E8F0FE"},itemsL.phoneUp);
  el("rect",{x:-12,y:-20,width:24,height:24,rx:3,fill:"#FFFFFF",stroke:"#3F5A86","stroke-width":2},itemsL.phoneUp); el("rect",{x:-12,y:-20,width:24,height:7,rx:2,fill:"#E53935"},itemsL.phoneUp); for(let q=0;q<6;q++) el("rect",{x:-8+(q%3)*6,y:-10+Math.floor(q/3)*6,width:3.5,height:3.5,fill:q===4?"#2E7D32":"#90A4AE"},itemsL.phoneUp);
  // head
  const head=el("g",{},body);
  el("ellipse",{cx:-55,cy:2,rx:10,ry:17,fill:o.skin,stroke:INK,"stroke-width":3},head); el("ellipse",{cx:55,cy:2,rx:10,ry:17,fill:o.skin,stroke:INK,"stroke-width":3},head);
  const buds=o.earbuds?[-1,1].map(s=>el("ellipse",{cx:s*57,cy:6,rx:8,ry:10,fill:"#FAFAFA",stroke:INK,"stroke-width":2.5},head)):[];
  el("path",{d:o.roundFace?"M-57 -20 Q-59 -74 0 -76 Q59 -74 57 -20 Q59 34 36 58 Q0 80 -36 58 Q-59 34 -57 -20 Z":"M-54 -22 Q-56 -72 0 -74 Q56 -72 54 -22 Q54 30 30 56 Q0 74 -30 56 Q-54 30 -54 -22 Z",fill:o.skin,stroke:INK,"stroke-width":4},head);
  if(o.earrings) [-55,55].forEach(x=>el("circle",{cx:x,cy:24,r:o.earCol?5:6.5,fill:o.earCol||"#F5B347",stroke:INK,"stroke-width":2},head));
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
    else [-21,21].forEach(x=>el("rect",{x:x-17,y:-14,width:34,height:22,rx:o.rect?3:9,fill:"rgba(220,240,255,.25)",stroke:o.glasses,"stroke-width":3.5},face));
    el("path",{d:"M-4 -6 Q0 -10 4 -6",stroke:o.glasses,"stroke-width":3.5,fill:"none"},face); [-1,1].forEach(s=>el("line",{x1:s*37,y1:-8,x2:s*52,y2:-12,stroke:o.glasses,"stroke-width":3.5},face))}
  if(o.bun) el("path",{d:"M-58 -6 Q-64 -88 0 -90 Q64 -88 58 -6 Q52 -50 30 -58 Q10 -64 2 -84 Q-8 -64 -30 -58 Q-52 -50 -58 -6 Z",fill:o.hair,stroke:INK,"stroke-width":3},head);
  else if(o.longHair){el("path",{d:"M-60 -6 Q-68 -88 4 -88 Q64 -86 62 -14 Q50 -62 12 -64 Q-12 -46 -40 -44 Q-56 -30 -60 -6 Z",fill:o.hair,stroke:INK,"stroke-width":3},head);
    el("path",{d:"M-62 -20 Q-74 30 -64 80",stroke:o.hair,"stroke-width":18,fill:"none","stroke-linecap":"round"},head); el("path",{d:"M62 -20 Q74 30 64 80",stroke:o.hair,"stroke-width":18,fill:"none","stroke-linecap":"round"},head)}
  else if(o.sidePart){ el("path",{d:"M-58 -8 Q-68 -88 -6 -94 Q60 -98 63 -30 L59 -8 Q57 -46 44 -58 Q14 -72 -20 -64 Q-30 -62 -36 -72 Q-50 -52 -54 -8 Z",fill:o.hair,stroke:INK,"stroke-width":3},head);
    el("path",{d:"M-36 -90 Q-34 -80 -36 -70",stroke:"#4A3A30","stroke-width":3,fill:"none","stroke-linecap":"round"},head);
    el("path",{d:"M-18 -86 Q20 -92 46 -70",stroke:"#5C4C44","stroke-width":5,fill:"none","stroke-linecap":"round",opacity:.85},head)}
  else if(o.fluffy){ [[-56,-30],[-60,-56],[-46,-80],[-22,-96],[6,-100],[32,-94],[52,-76],[60,-50],[58,-26]].forEach(([x,y])=>el("circle",{cx:x,cy:y,r:19,fill:o.hair,stroke:INK,"stroke-width":3},head));
    el("path",{d:"M-58 -8 Q-66 -86 -4 -92 Q58 -94 60 -26 L58 -8 Q54 -46 32 -56 Q4 -62 -24 -56 Q-50 -48 -54 -8 Z",fill:o.hair},head);
    el("path",{d:"M-10 -66 Q14 -84 34 -62 Q30 -44 12 -42 Q24 -54 14 -60 Q4 -60 -10 -66 Z",fill:o.hair,stroke:INK,"stroke-width":3,"stroke-linejoin":"round"},head);   // the front flick
    el("path",{d:"M-36 -80 Q-24 -88 -12 -84 M20 -88 Q34 -86 42 -74",stroke:"#5A3A28","stroke-width":3,fill:"none","stroke-linecap":"round",opacity:.8},head)}
  else if(o.puff) el("path",{d:"M-58 -10 Q-70 -92 -10 -100 Q40 -112 64 -70 Q70 -40 58 -8 Q54 -52 30 -60 Q4 -70 -24 -60 Q-50 -50 -54 -8 Z",fill:o.hair,stroke:INK,"stroke-width":3},head);
  else el("path",{d:o.recede?"M-58 -10 Q-66 -70 -36 -84 Q0 -96 40 -84 Q64 -66 58 -10 L56 -8 Q54 -46 42 -56 Q20 -50 0 -64 Q-22 -52 -42 -58 Q-54 -46 -56 -8 Z":"M-58 -10 Q-66 -84 -6 -90 Q56 -94 62 -28 L58 -8 Q54 -48 30 -56 Q2 -62 -26 -54 Q-50 -46 -54 -8 Z",fill:o.hair,stroke:INK,"stroke-width":3},head);
  if(o.earbuds) buds.forEach(b_=>head.appendChild(b_));
  [AL.hand,AR.hand,itemG,itemGL].forEach(x=>body.appendChild(x));
  const st={x:0,y:0,s:1,flip:1,rot:0,hop:0,vis:1,talk:0,blink:0,shut:0,look:0,lookY:0,brow:"n",smile:0,laugh:0,sad:0,smirk:0,gasp:0,headRot:0,headY:0,
            hL:[-60,-130],hR:[60,-130],item:"",itemL:"",itemRot:0,itemRotL:0,wink:0,walk:0,lany:1,buds:1,buzz:0};
  const SH=[[-82,-270],[82,-270]];
  function draw(){
    const k=st; g.setAttribute("transform",`translate(${k.x},${k.y-k.hop}) rotate(${k.rot}) scale(${k.s*k.flip},${k.s})`); g.style.opacity=k.vis; g.style.display=k.vis>0?"":"none";
    if(!k.vis) return;
    const ht=`translate(${k.look*3},${-392+k.headY}) rotate(${k.headRot})`; head.setAttribute("transform",ht); hairBack.setAttribute("transform",ht);
    face.setAttribute("transform",`translate(${k.look*7},${k.lookY*3})`);
    legs.forEach((L,i)=>L.setAttribute("transform",`rotate(${(i?1:-1)*k.walk*14} 0 -10)`));
    if(o._lany) o._lany.style.opacity=k.lany; if(o._bd) o._bd.setAttribute("transform",`translate(0,-122) scale(${k.flip},1)`);
    buds.forEach((b_,i)=>b_.style.opacity=(i===1?k.buds:1));
    [[AL,SH[0],k.hL,-1],[AR,SH[1],k.hR,1]].forEach(([A,S,T,side])=>{const [e,h]=ik(S[0],S[1],T[0],T[1],118,112,side);
      A.up.setAttribute("x1",S[0]);A.up.setAttribute("y1",S[1]);A.up.setAttribute("x2",e[0]);A.up.setAttribute("y2",e[1]);
      A.lo.setAttribute("x1",e[0]);A.lo.setAttribute("y1",e[1]);A.lo.setAttribute("x2",h[0]);A.lo.setAttribute("y2",h[1]);
      const m=[lerp(e[0],h[0],0.25),lerp(e[1],h[1],0.25)], m2=[lerp(e[0],h[0],0.8),lerp(e[1],h[1],0.8)];
      if(A.cuff){A.cuff.setAttribute("cx",m[0]);A.cuff.setAttribute("cy",m[1])}
      if(A.cap){A.cap.setAttribute("x1",S[0]);A.cap.setAttribute("y1",S[1]);A.cap.setAttribute("x2",lerp(S[0],e[0],0.42));A.cap.setAttribute("y2",lerp(S[1],e[1],0.42))}
      if(band&&side<0){const m3=[lerp(e[0],h[0],0.8),lerp(e[1],h[1],0.8)], ang=Math.atan2(h[1]-e[1],h[0]-e[0])*180/Math.PI, jit=k.buzz?Math.sin(T_*90)*2.5:0;
        band.setAttribute("transform",`translate(${m3[0]+jit},${m3[1]}) rotate(${ang+90})`); bandScr.setAttribute("fill",k.buzz?"#4DD0E1":"#263238")}
      if(A.bang){A.bang.setAttribute("cx",m2[0]);A.bang.setAttribute("cy",m2[1])}
      if(watch&&side<0){const m3=[lerp(e[0],h[0],0.8),lerp(e[1],h[1],0.8)], ang=Math.atan2(h[1]-e[1],h[0]-e[0])*180/Math.PI; watch.setAttribute("transform",`translate(${m3[0]},${m3[1]}) rotate(${ang+90})`)}
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
const KIRAN_OPT={skin:"#B97A50",hair:"#22160F",shirt:"#F2B705",collar:"#D99A00",button:"#FFF8E1",polo:true,shortSleeve:true,fore:"#B97A50",fluffy:true,roundFace:true,band:"#263238",brow:6,lip:"#7A3A30",blush:0.24};   // Kiran M, 23 (new): mustard polo, fluffy wavy hair + front flick, round clean-shaven face, plain fitness band
const HEMA_OPT={skin:"#C48A62",hair:"#1E1412",shirt:"#283593",saree:{base:"#3949AB",pallu:"#303F9F",border:"#F5F5F5",bw:5,motif:"#9FA8DA"},sleeve:"#283593",fore:"#C48A62",bun:true,lowBun:true,noFlowers:true,earrings:true,earCol:"#CFD8DC",glasses:"#111111",rect:true,brow:5,lash:4,blush:0.2,lip:"#9A3A40"};   // Hema S, ~40 (new): indigo handloom saree with a thin white border, rectangular black specs, low bun, silver studs
const NIK_BADGE={...NIKHIL_OPT,badge:["NIKHIL R","TOWER B"]};
const ANA_BADGE={...ANANYA_OPT,badge:["ANANYA","TOWER B"]};
const KIR_BADGE={...KIRAN_OPT,badge:["KIRAN M","TOWER B"],pin:true};
const HEMA_BADGE={...HEMA_OPT,badge:["HEMA S","ENG MANAGER"]};
const FAR1={skin:"#B07850",hair:"#1A1410",shirt:"#81C784",collar:"#66BB6A",brow:6,lip:"#6A3028",moustache:"#1E1612"};
const FAR2={skin:"#C98F66",hair:"#20140F",shirt:"#F06292",trim:"#FFCDD2",kurta:true,longHair:true,sleeve:"#F06292",fore:"#C98F66",brow:4.5,lash:4,lip:"#A0404A"};

// cafeteria
const FP1=makeAdult({...FAR1,parent:farPeople}), FP2=makeAdult({...FAR2,parent:farPeople});
const KR=makeAdult({...KIR_BADGE,parent:people});
const NK=makeAdult({...NIK_BADGE,parent:people});
const AN=makeAdult({...ANA_BADGE,parent:people});
// cabin
const NKC=makeAdult({...NIK_BADGE,parent:cabinPeople});
const HM=makeAdult({...HEMA_BADGE,parent:cabinPeople});
const KRF=makeAdult({...KIR_BADGE,parent:farKiranG});   // far off in the cafeteria, through the glass

// ---------- flashback inset ("TUESDAY · HR ROOM", sepia torn paper): its own little world, paper filter + CSS sepia ----------
const fbs=$("fbs"), FB=el("g",{filter:"url(#skin-paper)"},fbs);
el("rect",{x:0,y:0,width:980,height:800,fill:"#C9B79C"},FB);
el("rect",{x:620,y:90,width:300,height:250,fill:"#E9E2D0",stroke:"#5D4B38","stroke-width":8},FB);         // window with blinds
for(let y=110;y<330;y+=22) el("rect",{x:628,y,width:284,height:9,fill:"#B9A98E"},FB);
el("rect",{x:60,y:120,width:200,height:140,rx:6,fill:"#EFE7D6",stroke:"#5D4B38","stroke-width":6},FB);       // a plain frame on the wall
el("path",{d:"M80 240 L130 180 L170 220 L200 190 L240 240 Z",fill:"#A1887F"},FB);
const fbPeople=el("g",{},FB);
const fbKR=makeAdult({...KIR_BADGE,parent:fbPeople});
el("rect",{x:-20,y:600,width:1020,height:24,fill:"#8D6E55",stroke:INK,"stroke-width":5},FB);                  // table
el("rect",{x:-20,y:624,width:1020,height:200,fill:"#7A5C45",stroke:INK,"stroke-width":5},FB);
// HR person, back view (faceless): low bun, shoulders in a grey-blue blouse, foreground right
const hr=el("g",{transform:"translate(800,640)"},FB);
el("path",{d:"M-170 200 Q-176 40 -110 10 Q-60 -14 0 -14 Q60 -14 110 10 Q176 40 170 200 Z",fill:"#7E8FA6",stroke:INK,"stroke-width":5},hr);
el("rect",{x:-26,y:-60,width:52,height:56,fill:"#B98060",stroke:INK,"stroke-width":4},hr);
el("ellipse",{cx:0,cy:-120,rx:74,ry:84,fill:"#2A1E1A",stroke:INK,"stroke-width":5},hr);
el("ellipse",{cx:0,cy:-66,rx:34,ry:24,fill:"#2A1E1A",stroke:INK,"stroke-width":4},hr);
el("path",{d:"M-30 -180 Q0 -196 30 -180",stroke:"#4A3A30","stroke-width":4,fill:"none"},hr);

// ---------- A/B split panels (screen space, flat) ----------
const abDefs=el("defs",{},absvg);
const clipA=el("clipPath",{id:"clipA"},abDefs); el("rect",{x:0,y:280,width:540,height:1300},clipA);
const clipB=el("clipPath",{id:"clipB"},abDefs); el("rect",{x:540,y:280,width:540,height:1300},clipB);
const abBg=el("rect",{x:0,y:0,width:1080,height:1920,fill:"#10141E"},absvg);
const gAo=el("g",{"clip-path":"url(#clipA)"},absvg), gA=el("g",{},gAo);
const gBo=el("g",{"clip-path":"url(#clipB)"},absvg), gB=el("g",{},gBo);
// A: the corridor to Hema's cabin, red alert tint
el("rect",{x:-200,y:200,width:900,height:1500,fill:"#F8D3CB"},gA);
el("rect",{x:-200,y:1360,width:900,height:300,fill:"#D99A8E"},gA);
el("rect",{x:360,y:700,width:200,height:660,fill:"#CFE6EF",stroke:"#56616C","stroke-width":10},gA);
el("rect",{x:372,y:920,width:10,height:80,rx:3,fill:"#90A4AE",stroke:INK,"stroke-width":2},gA);
el("rect",{x:350,y:620,width:200,height:66,rx:8,fill:"#FFFDF5",stroke:"#3F5A86","stroke-width":4},gA);
txt("HEMA S",{x:450,y:665,"font-family":"Anton","font-size":36,"text-anchor":"middle",fill:"#3F5A86","letter-spacing":2},gA);
for(let k=0;k<3;k++) el("path",{d:`M${300-k*8} ${830+k*60} l-60 ${-10+k*10}`,stroke:"#E8553D","stroke-width":8,"stroke-linecap":"round",opacity:.8},gA);   // speed lines
const NKa=makeAdult({...NIK_BADGE,legs:{pant:"#2B3240",shoe:"#1A1A1A"},parent:gA});
// B: home at night: dark wall, a window with the moon, his desk + the laptop (back, plain)
el("rect",{x:400,y:200,width:900,height:1500,fill:"#1F2A44"},gB);
el("rect",{x:640,y:470,width:300,height:240,rx:10,fill:"#2C3E66",stroke:"#0E1528","stroke-width":8},gB); el("line",{x1:790,y1:470,x2:790,y2:710,stroke:"#0E1528","stroke-width":6},gB);
el("circle",{cx:880,cy:530,r:30,fill:"#FFF3C4"},gB);
const gBp=el("g",{},gB);
const NKb=makeAdult({...NIKHIL_OPT,parent:gBp});
el("ellipse",{cx:810,cy:950,rx:110,ry:120,fill:"#64B5F6",opacity:.16},gB);                                   // screen glow on his face
el("rect",{x:560,y:1290,width:620,height:30,fill:"#5D4037",stroke:INK,"stroke-width":5},gB);                  // desk
el("rect",{x:580,y:1320,width:580,height:300,fill:"#4E342E",stroke:INK,"stroke-width":5},gB);
el("path",{d:"M700 1290 L716 1150 L904 1150 L920 1290 Z",fill:"#78909C",stroke:INK,"stroke-width":5},gB);       // laptop lid from behind (no logo)
el("rect",{x:690,y:1284,width:240,height:10,rx:3,fill:"#546E7A",stroke:INK,"stroke-width":3},gB);
const seam=el("rect",{x:532,y:280,width:16,height:1300,fill:INK},absvg);

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
const COLORS={gopi:"#F5B347",nikhil:"#C9C3F2",ananya:"#7FE0D0",kiran:"#C5E1A5",hema:"#F48FB1"},
      NAMES={gopi:"GOPI",nikhil:"NIKHIL",ananya:"ANANYA",kiran:"KIRAN",hema:"HEMA · MANAGER"};
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
  B.titleIn=1.5; B.t18=at(0,"eighteen")-0.05; B.tRun=at(0,"runbook")-0.1;
  B.fz0=S(1)-0.05; B.fz1=E(1)+0.08; B.t6=at(1,"ఆరేళ్ళ")-0.1; B.t14=at(1,"fourteen")-0.1; B.tHold=at(1,"ఏం");
  B.k0=S(2)-0.05; B.tMatch=at(2,"match")-0.05; B.tMail=at(2,"ఇంకో")-0.2; B.buzz=E(2)-0.1; B.up=E(2)+0.15; B.gone=S(3)+0.6;
  B.an0=S(3)-0.1; B.tNik=at(3,"Nikhil"); B.tImp=at(3,"ఇప్పుడే"); B.tCab=at(3,"cabin");
  B.nk0=S(4)-0.1; B.tRes=at(4,"resume"); B.clk15=at(4,"quiet"); B.clk16=S(5)-0.05;
  B.fol0=S(5)-0.1; B.tFol=at(5,"follow")+0.1; B.fol1=E(5)+0.05;
  B.ab0=S(6)-0.12; B.tA=at(6,"A…"); B.tB=at(6,"B…"); B.tCm=at(6,"Comment");
  B.CD0=E(6)+0.1; B.CD1=B.CD0+TL.countdown; B.cb=CB.map((_,i)=>B.CD0+0.35+i*0.65);
  B.rev=B.CD1; B.tBack=B.rev+0.55; B.tBite=at(7,"good")-0.35; B.tDown=at(7,"Congrats")-0.45; B.tCon=at(7,"Congrats")+0.05;
  B.wipe0=E(7)+0.2; B.cab=E(7)+0.42; B.wipe1=S(8)+0.5;
  B.tK1=at(8,"Runbook")-0.05; B.tK2=at(8,"మూడు")-0.05; B.tK3=at(8,"నలుగురు")-0.05;
  B.kk0=S(9)-0.15; B.tCmp=at(9,"compare")-0.05; B.tMkt=at(9,"market")-0.1;
  B.tDec=at(10,"December")-0.1; B.tAsk=at(10,"అడగకముందే")-0.15; B.tHR=at(10,"HR")-0.1;
  B.fb0=E(10)+0.08; B.tRb=at(11,"Runbook"); B.tPt=at(11,"ముందు")-0.05; B.mf=E(11)-0.32; B.fb1=E(11)+0.14;
  B.abc0=S(12)-0.12; B.tAB=at(12,"A or B")-0.1; B.tCm2=at(12,"comment")-0.05;
  B.sh0=S(13)-0.1; B.tAt=at(13,"junior")-0.2; B.tTag=at(13,"tag")+0.1; B.end0=at(13,"Follow")-0.15; B.tEF=at(13,"Follow")+0.3; B.loop0=at(13,"clue")-0.06;
  return B}

const focus=(z,wx,wy,sx=540,sy=1000)=>({z,fx:wx-(sx-540)/z,fy:wy-(sy-1000)/z});
const mixCam=(a,b_,k)=>({z:lerp(a.z,b_.z,k),fx:lerp(a.fx,b_.fx,k),fy:lerp(a.fy,b_.fy,k)});
let curSkin="";
function skinTo(s){ if(s!==curSkin){ setSkin(s); curSkin=s } }
const mmss=s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(Math.floor(s%60)).padStart(2,"0")}`;
// keep short Telugu words (రా, కి, ది, ఆ? ...) on the line of the word before them
const subFix=s=>s.replace(/…/g,"...").replace(/([^\s.!?])\s([ఀ-౿]{1,2}[.,!?]*)(?=\s|$)/g,"$1&nbsp;$2").replace(/(^|\s)(మీ|నా|ఏం|ఈ|నువ్వు)\s/g,"$1$2&nbsp;").replace(/A or B/g,"A&nbsp;or&nbsp;B").replace(/(1[48]) lakhs/g,"$1&nbsp;lakhs").replace(/silent job hunt/g,"silent&nbsp;job&nbsp;hunt");

function frame(t){
  const b=beats(); T_=t;
  const loop=t>=b.loop0;
  const tf=loop?0:t;
  const frozen=!loop&&t>=b.fz0&&t<b.fz1;
  const T=frozen?b.fz0:tf;                       // character time (stops in the freeze frame)
  const cabin=!loop&&t>=b.cab;
  const reveal=!loop&&t>=b.rev&&!cabin;
  const fbOn=!loop&&t>=b.fb0&&t<b.fb1;
  skinTo("flat");
  $("s").style.filter=frozen?`saturate(${lerp(1,0.3,clamp((t-b.fz0)/0.1))}) contrast(1.06)`:"";
  const reset=(C,who,x,y,s)=>Object.assign(C.st,{x,y,s,talk:who&&!loop&&!frozen?talkOf(who,t):0,blink:frozen?0:(((T*0.6+x*0.0013)%3.3)<0.11?1:0),shut:0,look:0,lookY:0,brow:"n",smile:0,laugh:0,sad:0,smirk:0,gasp:0,
    headRot:0,headY:0,hop:0,rot:0,item:"",itemL:"",itemRot:0,itemRotL:0,vis:1,flip:1,wink:0,walk:0,lany:1,buds:1,buzz:0,hL:[-62,-66],hR:[62,-66]});

  // ---------------- cafeteria: far colleagues ----------------
  const f1=FP1.st; reset(FP1,null,372,1000,0.4); f1.look=0.7; f1.talk=Math.abs(Math.sin(T*5))*0.35*((Math.floor(T*0.9)%2)?1:0); f1.headRot=Math.sin(T*1.3)*2; FP1.aim("L",348,970); FP1.aim("R",396,970); FP1.draw();
  const f2=FP2.st; reset(FP2,null,1010,1000,0.4); f2.flip=-1; f2.look=0.7; f2.smile=1; f2.laugh=(Math.floor(T*0.9)%2)?0:1; FP2.aim("L",1034,970); FP2.aim("R",986,970); FP2.draw();

  // ---------------- Kiran (bounces in, frame 1; the plant; runs off; comes back for his bottle) ----------------
  const kr=KR.st; const arr=clamp(T/0.35);
  let KX=lerp(905,850,out(arr)), KYp=CY; let trX=822, trY=lerp(1196,1238,out(T/0.3)), bottleOn=true;
  reset(KR,"kiran",KX,KYp,CS); kr.flip=-1; kr.hop=Math.sin(arr*Math.PI)*24;
  kr.look=0.8; kr.brow="u"; kr.smile=1; kr.laugh=1; kr.headRot=Math.sin(T*9)*2;
  if(T<0.45){ KR.aim("L",trX+62,trY-6); KR.aim("R",trX-62,trY-6) }
  else if(T<b.tRun){ const w=Math.sin(T*10)*10; kr.hL=[-96,-330+w]; kr.hR=[96,-340-w] }                       // both hands up: CTC 18!
  else { KR.aim("R",705,1090); kr.hL=[-62,-66] }                                                                   // "మీ runbook వల్లే!" -> points at Nikhil
  if(T>=b.k0){ kr.laugh=0; kr.smile=1; kr.brow="u"; kr.item="phone"; kr.itemRot=-10+Math.sin(T*7)*12; KR.aim("R",770,1010+Math.sin(T*7)*10); kr.hL=[-62,-66] }
  if(T>=b.tMail){ kr.smirk=1; kr.smile=0; kr.brow="q"; kr.itemRot=0; KR.aim("R",780,1050); kr.look=0.4; kr.lookY=0.2 }      // a secretive grin, phone toward the camera
  if(T>=b.buzz){ kr.buzz=T<b.up+0.2?1:0; kr.brow="u"; kr.gasp=1; kr.smirk=0; kr.look=-0.4; kr.lookY=0.7; kr.item=""; kr.hL=[-40,-180] }   // band buzzes: stand-up!
  if(T>=b.up){ const k=out((T-b.up)/0.25), ex=ease((T-b.up-0.25)/0.75);
    kr.y=lerp(CY,CY-70,k); kr.hop=Math.sin(clamp((T-b.up)/0.3)*Math.PI)*20; kr.gasp=0; kr.smile=1; kr.look=0.9; kr.lookY=0; kr.brow="n";
    kr.x=lerp(850,1420,ex); kr.flip=ex>0.05?1:-1;                                                                       // turns and jogs off (to the right)
    trX=kr.x+(kr.flip>0?-10:10); trY=kr.y-80; KR.aim("L",trX-60,trY-6); KR.aim("R",trX+60,trY-6); kr.headRot=-6+Math.sin(T*16)*3 }
  kr.vis=(!loop&&T>=b.up+1.0&&!reveal)||cabin?0:1;
  if(reveal){ const k=out((t-b.rev+0.1)/0.55); kr.vis=1; kr.flip=-1; kr.x=lerp(1350,880,k); kr.y=CY-50; kr.hop=Math.abs(Math.sin(t*12))*8*(1-k); kr.look=0.7; kr.smile=1; kr.laugh=0; kr.brow="n"; kr.item="";
    kr.hL=[-62,-80]; kr.hR=[62,-80];
    if(t>=b.tBack-0.15){ KR.aim("L",790,t<b.tBack?1200:1150); if(t>=b.tBack){ kr.itemL="bottle"; bottleOn=false } }
    if(t>=b.tCon-0.25){ KR.aim("R",lerp(820,706,out((t-b.tCon+0.25)/0.25)),1112); kr.laugh=t>b.tCon+0.15?1:0; kr.brow="u" }
    trX=-999 }
  KR.draw();
  tray.setAttribute("transform",`translate(${trX},${trY})`); tray.style.display=(!loop&&(T>=b.up+1.0||reveal))||cabin?"none":"";
  bottle.setAttribute("transform","translate(790,1238)"); bottle.style.display=bottleOn&&!cabin?"":"none";

  // ---------------- Nikhil (samosa halfway to his mouth) ----------------
  const nk=NK.st; reset(NK,"nikhil",525,CY,CS); nk.item="samosa"; nk.itemRot=-15; nk.hR=[52,-282]; nk.look=0.8; nk.brow="u"; nk.lookY=0;
  if(T>=b.t18){ nk.brow="u"; nk.look=0.9; nk.gasp=0 }
  if(frozen){ const k=t-b.fz0; nk.look=0.45+0.45*Math.cos(k*2.2); nk.lookY=0.1*Math.sin(k*2.2); nk.brow="w" }         // only his eyes move
  if(T>=b.k0){ nk.look=0.9; nk.brow="n"; nk.smile=0 }
  if(T>=b.up){ nk.look=1; nk.lookY=0 }
  if(T>=b.tNik){ nk.look=-0.7; nk.brow="w" }
  if(T>=b.nk0){ const k=ease((T-b.nk0)/2.6); nk.look=0.15; nk.lookY=0.9; nk.sad=1; nk.brow="w"; nk.headRot=4; nk.itemRot=lerp(-15,80,k); nk.hR=[lerp(52,64,k),lerp(-282,-210,k)] }   // the samosa droops
  if(reveal){ nk.sad=0; nk.headRot=0; nk.lookY=0; nk.look=0.9; nk.brow="n"; nk.smile=1; nk.itemRot=-15; nk.hR=[60,-230];
    if(t>=b.tBite-0.3&&t<b.tDown){ nk.hR=[34,-338]; nk.itemRot=-30; if(t>=b.tBite) nk.item="samosaBit" }
    if(t>=b.tDown){ nk.item=""; NK.aim("R",548,1225) }
    if(t>=b.tCon-0.25){ NK.aim("R",lerp(600,690,out((t-b.tCon+0.25)/0.25)),1112) } }
  plateSam.style.opacity=reveal&&t>=b.tDown+0.1?1:0;
  NK.draw();

  // ---------------- Ananya ----------------
  const an=AN.st; reset(AN,"ananya",215,CY,CS); an.look=0.8; an.smile=1; an.brow="n"; AN.aim("L",170,1236); AN.aim("R",265,1236);
  if(T>=b.t18){ an.smile=0; an.brow="u"; an.gasp=1 }
  if(T>=b.k0){ an.gasp=0; an.brow="w"; an.look=1; an.smirk=0 }
  if(T>=b.an0){ const k=out((T-b.an0)/0.3); an.x=215+30*k; an.rot=5*k; an.look=1; an.lookY=-0.1; an.brow="a"; an.headRot=4;   // leans in, eyes on Kiran's back
    if(T>=b.tNik){ an.look=0.8; an.lookY=0.1; an.brow="a" }
    const d1=Math.max(0,1-Math.abs(T-b.tImp)/0.09), d2=Math.max(0,1-Math.abs(T-b.tImp-0.24)/0.09);
    if(T>=b.tImp-0.25&&T<b.tImp+0.6) AN.aim("R",345,1236-30+(d1+d2)*30) }                                                 // two taps on the table
  if(T>=b.nk0){ an.brow="w"; an.sad=1; an.look=0.8; an.lookY=0.3; an.rot=3 }
  if(reveal){ an.x=215; an.rot=0; an.sad=0; an.brow="u"; an.look=0.9; an.lookY=0; an.headRot=0;
    if(t>=b.rev+0.25&&t<b.rev+0.38) an.shut=1;
    if(t>=b.tBite&&t<b.tCon) an.gasp=1;
    if(t>=b.tCon){ an.brow="n"; an.smile=1 } }
  AN.draw();

  // ---------------- cabin: Nikhil + Hema (Fri 10:00 AM), far Kiran through the glass ----------------
  const nc=NKC.st; reset(NKC,"nikhil",CB_+250,HY,HS); nc.look=0.7; nc.brow="n"; nc.smile=0; NKC.aim("L",CB_+190,1186); NKC.aim("R",CB_+320,1186);
  const reach=(t0,wx)=>{ if(t>=t0-0.25&&t<t0+0.35){ const k=t<t0?out((t-t0+0.25)/0.25):1-clamp((t-t0)/0.35); NKC.aim("R",lerp(CB_+320,wx,k),lerp(1186,1196,k)) } };
  reach(b.tK1,CB_+380); reach(b.tK2,CB_+470); reach(b.tK3,CB_+560); reach(b.tCmp+0.1,CB_+330);
  if(t>=b.tCmp-0.1&&t<b.tMkt){ nc.brow="a"; nc.look=0.8 }
  if(t>=b.tMkt&&t<b.tAsk){ nc.brow="n"; nc.hL=[-34,-96]; nc.hR=[34,-96] }
  if(t>=b.tDec){ nc.look=0.8; nc.brow="n" }
  if(t>=b.tAsk){ nc.brow="u"; nc.gasp=t<b.tHR+0.3?1:0; nc.look=0.6; nc.lookY=-0.2 }
  if(t>=b.tHR+0.3){ nc.gasp=0; nc.brow="u"; nc.smile=1 }
  if(t>=b.fb1){ nc.brow="n"; nc.look=1; nc.lookY=-0.6; nc.headRot=-7; nc.smile=1 }                                          // looks out through the glass
  NKC.draw();
  const hm=HM.st; reset(HM,"hema",CB_+840,HY,HS); hm.flip=-1; hm.look=0.7; hm.brow="n"; hm.smile=0; HM.aim("L",CB_+900,1186); HM.aim("R",CB_+760,1186);
  [b.tK1,b.tK2,b.tK3].forEach(t0=>{ if(t>t0&&t<t0+0.5) hm.headY=Math.sin((t-t0)/0.5*Math.PI)*8 });                        // nods
  if(t>=b.tCmp&&t<b.tDec){ hm.smile=1; hm.brow="u" }
  if(t>=b.tDec-0.1&&t<b.tAsk){ hm.smile=0; hm.brow="n"; hm.lookY=0.6; HM.aim("R",CB_+720+Math.sin(t*30)*8,1190+Math.cos(t*26)*4) }   // writes the sticky note
  if(t>=b.tAsk){ hm.smile=1; hm.lookY=0; hm.look=0.7; if(t<b.tAsk+0.5){ HM.aim("R",LAPX+90,LAPY-60); HM.aim("L",LAPX+150,LAPY-20) } }
  if(t>=b.tHR){ hm.smile=1; hm.brow="u"; hm.headRot=4 }
  HM.draw();
  {const k=t>=b.tAsk&&t<b.tAsk+0.45?(t-b.tAsk)/0.45:-1; const sx=k<0?1:Math.max(0.04,Math.abs(Math.cos(k*Math.PI)));
   lapG.setAttribute("transform",`translate(${LAPX},${LAPY}) scale(${sx},1)`)}
  const kf=KRF.st; reset(KRF,null,CB_+440,1070,0.36); kf.flip=-1; kf.vis=!loop&&t>=b.fb1?1:0; kf.item="samosa"; kf.smile=1; kf.laugh=1; kf.look=0.8; kf.brow="u";
  kf.hR=[70+Math.sin(t*9)*18,-390+Math.cos(t*9)*10]; kf.itemRot=Math.sin(t*9)*20; kf.hop=Math.abs(Math.sin(t*6))*4;
  KRF.draw();

  // ---------------- flashback inset (L11, "TUESDAY · HR ROOM") ----------------
  {const w=$("fbw"); const k=Math.min(clamp((t-b.fb0)/0.25),clamp((b.fb1-t)/0.2)); w.style.opacity=fbOn?k:0;
   w.style.transformOrigin="50% 0"; w.style.transform=`translateY(${(1-out((t-b.fb0)/0.3))*-60}px) rotate(${-1.2+0.5*Math.sin(t*1.3)}deg) scale(${0.9*(0.96+0.04*out((t-b.fb0)/0.3))})`;
   const f=fbKR.st; reset(fbKR,"kiran",380,665,0.95); f.talk=fbOn?talkOf("kiran",t):0; f.look=0.5; f.lookY=0.1; f.brow="w"; f.smile=0; fbKR.aim("L",300,640); fbKR.aim("R",450,640);
   if(t>=b.tRb-0.1&&t<b.tPt){ const d=Math.max(0,1-Math.abs(t-b.tRb-0.15)/0.1); fbKR.aim("R",545,640+d*10); f.lookY=0.6; f.look=0.6 }     // taps the printed runbook
   if(t>=b.tPt){ fbKR.aim("R",lerp(545,660,out((t-b.tPt)/0.25)),lerp(640,410,out((t-b.tPt)/0.25))); f.brow="a"; f.look=0.9; f.lookY=0 }   // points out of frame: "ముందు ఆయన salary"
   fbKR.draw();
   $("ofr").style.left="70px"; $("ofr").style.top="628px"; $("ofr").style.transform="rotate(-5deg)";
   $("rbk").style.left="400px"; $("rbk").style.top="622px"; $("rbk").style.transform=`rotate(3deg) scale(${1+0.06*Math.max(0,1-Math.abs(t-b.tRb-0.15)/0.15)})`}
  show("mflash",fbOn&&t>=b.mf&&t<b.mf+0.2,1,"rotate(-1deg)");

  // ---------------- split panels (L6 + countdown; slide apart for the reveal) ----------------
  {const on=!loop&&t>=b.ab0&&t<b.rev+0.5; const ab=$("ab"); ab.style.opacity=on?clamp((t-b.ab0)/0.12):0;
   const sp=t>=b.rev?ease((t-b.rev)/0.45):0;
   gAo.setAttribute("transform",`translate(${-sp*600},0)`); gBo.setAttribute("transform",`translate(${sp*600},0)`); seam.style.opacity=sp>0?0:1; abBg.style.opacity=1-sp;
   const cdk=t-b.CD0, cdOn=t>=b.CD0&&t<b.CD1;
   const A_=NKa.st; reset(NKa,null,lerp(150,250,clamp((t-b.ab0)/9)),1360,0.8); A_.walk=Math.sin(t*9); A_.hop=Math.abs(Math.sin(t*9))*6; A_.brow="a"; A_.look=0.9; A_.headRot=3; A_.hL=[-60,-150+Math.sin(t*9)*20]; A_.hR=[66,-150-Math.sin(t*9)*20]; A_.talk=cdOn?Math.abs(Math.sin(t*8))*0.5:0;
   NKa.draw();
   const B_=NKb.st; reset(NKb,null,810,1350,0.8); B_.look=0; B_.lookY=0.5; B_.brow="w"; B_.headRot=2; NKb.aim("L",760+Math.sin(t*23)*6,1290); NKb.aim("R",860+Math.cos(t*19)*6,1290); B_.blink=((t*0.5)%2.7)<0.1?1:0;
   NKb.draw();
   const sb=(id,x,y,t0)=>{const e=$(id); const v=on&&t>t0&&sp<0.05; e.style.opacity=v?1:0; e.style.left=x+"px"; e.style.top=y+"px"; e.style.transform=`scale(${Math.max(0.01,pop(t,t0,0.3))*(1+0.03*Math.sin(t*14))})`};
   sb("sbA",40,780,b.tA+0.1); sb("inv",610,720,b.tB+0.1); sb("sticky",712,1166,b.tB+0.35); $("sticky").style.transform+=" rotate(-4deg)";
   const lab=(id,hit)=>{const e=$(id); e.style.opacity=on&&sp<0.05?1:0; e.style.transform=`scale(${Math.max(0.01,pop(t,b.ab0+0.05,0.35))*(Math.abs(t-hit)<0.12?0.92:1)})`; e.className="abl"+(t>hit&&t<hit+0.5?" hit":"")};
   lab("aL",b.tA+0.05); lab("bL",b.tB+0.05);
   {const h=$("abHand"); const v=on&&t>b.tA-0.35&&t<b.tB+0.45; const k=ease((t-(b.tB-0.35))/0.3); const hx=t<b.tB-0.35?270:lerp(270,810,k), hy=360; const dip=Math.max(0,1-Math.abs(t-b.tA-0.05)/0.1)+Math.max(0,1-Math.abs(t-b.tB-0.05)/0.1);
    h.style.opacity=v?1:0; h.style.transform=`translate(${hx-40}px,${hy+20+dip*14}px) rotate(-8deg)`}
   show("q",on&&sp<0.05,pop(t,b.ab0+0.05,0.4));
   show("cnow",on&&t>Math.max(b.tCm-0.05,E(6)+0.25)&&t<b.CD1,Math.max(0.01,pop(t,Math.max(b.tCm-0.05,E(6)+0.25),0.35))*(1+0.05*Math.sin(t*Math.PI*4)));
   const sec=Math.floor(cdk), fr=cdk-sec;
   $("cdw").style.opacity=cdOn?clamp(cdk/0.15)*clamp((TL.countdown-cdk)/0.15):0; $("cdw").style.top="860px";
   if(cdOn){const n_=Math.max(1,TL.countdown-sec); $("digit").textContent=n_; $("digit").style.transform=`scale(${lerp(1.5,1,out(fr/0.2))})`; $("digit").style.color=n_<=1?"#FF5252":"#F5B347";
     $("arc").setAttribute("stroke-dasharray",`${565.5*(1-cdk/TL.countdown)} 565.5`); $("cdw").style.transform=`scale(${1+Math.exp(-fr*8)*0.08})`}
   CB.forEach((_,i)=>{const e=$("cb"+i), t0=b.cb[i], k=pop(t,t0,0.3); const v=!loop&&t>t0&&t<b.CD1; e.style.opacity=v?clamp((b.CD1-t)/0.15):0;
     e.style.transform=`translateY(${-(t-t0)*16}px) scale(${Math.max(0.01,k)}) rotate(${(i%2?3:-3)}deg)`})}

  // ---------------- Gopi (narrator badge) ----------------
  const g=GOPI.st;
  const nIn=(i,pre=0.15,post=0.2)=>t>S(i)-pre&&t<E(i)+post;
  const narOn=!loop&&(nIn(1)||nIn(5)||nIn(6,0.15,0.05)||nIn(12)||(t>S(13)-0.15&&t<b.end0));
  const narT=t>S(13)-0.15?S(13)-0.15:t>S(12)-0.15?S(12)-0.15:t>S(6)-0.15?S(6)-0.15:t>S(5)-0.15?S(5)-0.15:S(1)-0.15;
  let BX=900, BY=470, bsc=0.82;
  if(t>S(5)-0.2&&t<E(5)+0.3){ BX=900; BY=700 }
  if(t>S(6)-0.2&&t<E(6)+0.2){ BX=540; BY=1300 }
  if(t>S(12)-0.2&&t<E(12)+0.3){ BX=170; BY=1260 }
  if(t>S(13)-0.2){ BX=900; BY=1330 }
  Object.assign(g,{x:0,y:400*0.55+12,s:0.55,talk:talkOf("gopi",t),blink:((t*0.7)%3.1)<0.12?1:0,wink:0,look:BX>540?-0.5:0.5,lookY:0,brow:"n",smile:0,headRot:Math.sin(t*2.2)*3,item:"",armL:200,armR:160,lenL:115,lenR:115,hop:0,itemRot:0});
  if(t>S(1)&&t<E(1)){ g.brow="q"; g.look=-0.8 }
  if(t>b.tHold&&t<E(1)+0.2){ g.wink=1; g.smile=1 }
  if(t>b.fol0&&t<b.fol1){ g.armR=40; g.item="point"; g.itemRot=-30 }
  if(t>S(6)&&t<E(6)){ g.brow="u"; g.look=0 }
  if(t>S(12)){ g.smile=1; g.brow="q" }
  GOPI.draw();
  const bs=narOn?Math.max(0.001,back((t-narT)/0.35)):0;
  badge.setAttribute("transform",`translate(${BX},${BY}) scale(${bs*bsc}) rotate(${Math.sin(t*2)*2})`); badge.style.opacity=narOn?1:0;

  // ---------------- camera ----------------
  const punch=(t0,a_=0.1)=>t>t0?a_*Math.exp(-(t-t0)*4)*clamp((t-t0)/0.06):0;
  const OPEN=focus(1.0+0.012*tf,540,1000);
  const CAB=focus(1.0+0.006*(t-b.cab)+punch(b.tCmp,0.03)+punch(b.tAsk,0.04),CB_+540,1000);
  const shots=[
    [0,OPEN],
    [b.tRun,focus(1.2+0.01*(t-b.tRun),790,960,540,960),0.3],                       // punch-in on Kiran (the P1 pin) on "runbook"
    [b.fz0,focus(1.1,540,990),0.12],
    [b.fz1,focus(1.15+0.01*(t-b.fz1),720,1000),0.3],
    [b.up+0.2,focus(1.08,600,1000),0.5],
    [b.an0,focus(1.25+0.015*(t-b.an0)+punch(b.tImp,0.05),380,1020),0.3],
    [b.nk0,focus(1.3+0.02*(t-b.nk0),560,1000),0.35],
    [b.fol0,focus(1.0,540,1000),0.3],
    [b.rev,focus(1.06+0.01*(t-b.rev)+punch(b.tCon,0.04),600,1000),0.01],
    [b.cab,CAB],
    [b.fb1,focus(1.28+0.01*(t-b.fb1),CB_+430,975),0.5],
    [b.abc0,focus(1.0,CB_+540,1000),0.4],
  ];
  let cm=OPEN;
  if(!loop){ let i=0; while(i+1<shots.length&&t>=shots[i+1][0]) i++;
    const [t0,c,tr]=shots[i]; cm=c;
    if(i>0&&tr&&t<t0+tr){ const prev=shots[i-1][1]; cm=mixCam(prev,c,ease((t-t0)/tr)) } }
  let sx=0,sy=0; const shake=(t0,d,a_)=>{if(t>t0&&t<t0+d){const q=(1-(t-t0)/d)*a_; sx+=Math.sin(t*90)*q; sy+=Math.cos(t*77)*q}};
  if(!loop){ shake(b.t18,0.2,4); shake(b.fz0,0.15,6); shake(b.CD1,0.25,8); shake(b.tCon,0.15,4) }
  cam.setAttribute("transform",`translate(${540+sx},${1000+sy}) scale(${cm.z}) translate(${-cm.fx},${-cm.fy})`);
  const scr=(wx,wy)=>[540+(wx-cm.fx)*cm.z+sx, 1000+(wy-cm.fy)*cm.z+sy];

  // ---------------- HTML overlays ----------------
  let dm=0; if(fbOn) dm=0.5*Math.min(clamp((t-b.fb0)/0.25),clamp((b.fb1-t)/0.2)); if(!loop&&t>=b.fol0&&t<b.ab0) dm=0.28*clamp((t-b.fol0)/0.3);
  if(!loop&&t>=b.abc0&&t<b.sh0) dm=0.5*clamp((t-b.abc0)/0.3); $("dim").style.opacity=dm;
  // world-tracked labels: only when the whole label is in frame
  const wlab=(id,on,wx,wy,s=1)=>{const e=$(id); if(!on){e.style.opacity=0; return} const [px,py]=scr(wx,wy), z=cm.z*s, hw=e.offsetWidth*z/2, hh=e.offsetHeight*z/2;
    if(px-hw<4||px+hw>1076||py-hh<4||py+hh>1916){e.style.opacity=0; return} e.style.opacity=1; e.style.transform=`translate(${px}px,${py}px) translate(-50%,-50%) scale(${z})`};
  {const clk=reveal?"1:17 PM":(!loop&&T>=b.clk16)?"1:16 PM":(!loop&&T>=b.clk15)?"1:15 PM":(!loop&&T>=b.buzz)?"1:14 PM":"1:13 PM"; $("wclk").textContent=clk;
   const pz=[b.buzz,b.clk15,b.clk16,b.rev].reduce((a_,t0)=>(!loop&&t>t0&&t<t0+0.4)?1+0.15*Math.sin((t-t0)/0.4*Math.PI):a_,1);
   wlab("wclk",!cabin&&!(t>=b.ab0&&t<b.rev+0.3),345,610,0.82*pz)}
  {const glow=!loop&&T>=b.tCab-0.25&&T<E(3)+0.4; $("door").className="wl"+(glow?" glow":""); wlab("door",!cabin&&!(t>=b.ab0&&t<b.rev+0.3),110,560,glow?1+0.04*Math.sin(t*10):1)}
  {const turned=!loop&&t>=b.tAsk+0.225; lapScr.setAttribute("fill",turned?"#546E7A":"#ECEFF1"); const on=cabin&&!fbOn&&t<b.abc0&&!turned; $("lap").querySelector(".c").style.opacity=t>=b.tAsk?1:0; wlab("lap",on&&t>=b.wipe1-0.3,LAPX,LAPY-82,1)}
  // text hook (frame 1) + title a beat later
  {const on=loop||t<b.tHold; $("hook").style.opacity=on?(loop?1:clamp((b.tHold-t)/0.15)):0; $("hook").style.transform=`rotate(${-1.5+(loop?0:Math.sin(t*3)*0.6)}deg)`;
   const ti=$("title"), ton=!loop&&t>b.titleIn&&t<b.fz0; ti.style.opacity=ton?clamp((b.fz0-t)/0.12):0; ti.style.transform=`scale(${Math.max(0.01,back((t-b.titleIn)/0.45))}) rotate(-2deg)`}
  // L1/L2 chips: CTC 18 L over Kiran, Nikhil's 6 yrs / 14 L card, the pause icon on the samosa, the hold tag
  const wchip=(id,on,wx,wy,t0,rot)=>{const e=$(id); if(!on){e.style.opacity=0;return} const [px,py]=scr(wx,wy); e.style.opacity=1; e.style.left=px+"px"; e.style.top=py+"px"; e.style.transform=`translate(-50%,-50%) scale(${Math.max(0.01,pop(t,t0,0.3))}) rotate(${rot}deg)`};
  wchip("c18",!loop&&t>b.t18&&t<b.k0,860,770,b.t18,3);
  wchip("cNik",!loop&&t>b.t6&&t<b.k0,430,775,b.t6,-2);
  {const e=$("cNik").querySelector("em"); e.style.opacity=t>b.t14?1:0}
  wchip("pz",frozen,580,965,b.fz0+0.1,0);
  {const e=$("pz"); if(!loop&&t>=b.tBite-0.05&&t<b.tBite+0.25){const k=(t-b.tBite+0.05)/0.3, [px,py]=scr(640,880); e.style.opacity=1-k; e.style.left=px+"px"; e.style.top=py+"px"; e.style.transform=`translate(-50%,-50%) scale(${1+k*1.4})`}}   // the pause bubble pops on the bite
  show("hold",!loop&&t>b.tHold&&t<b.fz1,lerp(1.8,1,out((t-b.tHold)/0.2)),`rotate(${-3+Math.sin(t*5)*1.2}deg)`);
  // L2: offer -> MATCHED, the HR mail on his phone (clue), the band buzz, "anna, later!"
  wchip("offer",!loop&&T>=b.k0&&T<b.tMail,690,800,b.k0,-4);
  {const st=$("stampM"); const k=pop(t,b.tMatch,0.25); st.style.opacity=t>=b.tMatch?1:0; st.style.transform=`rotate(-12deg) scale(${lerp(2.2,1,clamp(k))})`}
  wchip("mail",!loop&&T>=b.tMail&&T<b.buzz+0.1,650,745,b.tMail,lerp(-10,-2,out((t-b.tMail)/0.3)));
  wchip("buzz",!loop&&T>=b.buzz&&T<b.up+0.6,900,1110,b.buzz,Math.sin(t*60)*2);
  wchip("later",!loop&&T>=b.up+0.15&&T<b.up+1.0,1000,800,b.up+0.15,-4);
  // L3: Ananya's two table taps
  [["tr1",b.tImp],["tr2",b.tImp+0.24]].forEach(([id,t0])=>{const e=$(id), k=(t-t0)/0.4; const [px,py]=scr(345,1240); e.style.opacity=!loop&&k>0&&k<1?1-k:0; e.style.left=px+"px"; e.style.top=py+"px"; e.style.transform=`scale(${1+k*3})`});
  // L4: Nikhil's thought bubble (the old resume, UPDATE? blinking)
  {const e=$("think"), on=!loop&&T>=b.nk0+0.2&&t<b.fol0+0.1; e.style.opacity=on?clamp((b.fol0+0.1-t)/0.15):0; e.style.left="30px"; e.style.top="300px";
   e.style.transform=`scale(${Math.max(0.01,pop(t,b.nk0+0.2,0.4))}) rotate(-2deg)`; $("upd").style.opacity=t>b.tRes&&Math.floor(t*4)%2?0.35:1}
  // follow tap (L5)
  const fA=b.fol0, fB=b.fol1+0.1; const fOn=!loop&&t>fA&&t<fB; const fol=$("fol"); fol.style.opacity=fOn?clamp(Math.min((t-fA)/0.2,(fB-t)/0.12)):0; fol.style.top="1330px";
  fol.style.transform=`scale(${Math.max(0.01,back((t-fA)/0.4))*(Math.abs(t-b.tFol)<0.1?0.9:1)})`;
  const bF=$("bF"); bF.textContent=t<b.tFol?"+ FOLLOW":"FOLLOWING ✓"; bF.className="btn"+(t<b.tFol?"":" done");
  {const hand=$("tapHand"); const hk=ease((t-fA-0.1)/Math.max(0.3,b.tFol-fA-0.2)); const dip=Math.max(0,1-Math.abs(t-b.tFol)/0.1);
   hand.style.opacity=fOn?clamp(Math.min((t-fA-0.05)/0.15,(fB-t)/0.12)):0; hand.style.transform=`translate(${lerp(900,560,hk)-50}px,${lerp(1700,1390,hk)+dip*12}px) rotate(${-8+dip*6}deg)`;
   const rg_=$("ring"), rk=(t-b.tFol)/0.45; rg_.style.opacity=fOn&&rk>0&&rk<1?1-rk:0; rg_.style.left="560px"; rg_.style.top="1390px"; rg_.style.transform=`scale(${1+rk*6})`}
  // reveal: "A కాదు… B కాదు…" between the sliding panels; the fist bump
  show("neither",!loop&&t>b.rev&&t<b.rev+1.15,pop(t,b.rev+0.05,0.3),`rotate(-2deg)`); $("neither").style.top="420px";
  {const e=$("bump"), on=reveal&&t>=b.tCon&&t<b.tCon+0.7; const [px,py]=scr(698,1100); e.style.opacity=on?1-clamp((t-b.tCon-0.45)/0.25):0; e.style.left=(px-50)+"px"; e.style.top=(py-130)+"px"; e.style.transform=`scale(${Math.max(0.01,pop(t,b.tCon,0.25))})`}
  // calendar wipe -> the cabin (Fri 10:00 AM), the 15:00 timer
  {const e=$("wipe"); const on=!loop&&t>b.wipe0&&t<b.wipe1; const k=Math.min(clamp((t-b.wipe0)/0.2),clamp((b.wipe1-t)/0.22)); e.style.opacity=on?1:0;
   e.style.clipPath=`circle(${k*120}% at 50% 45%)`; $("ev").style.transform=`scale(${Math.max(0.01,pop(t,b.wipe0+0.05,0.35))}) rotate(-1.5deg)`}
  const cabUI=cabin&&!fbOn&&t<b.abc0;
  show("calc",cabUI&&t>b.wipe1-0.1,pop(t,b.wipe1-0.1,0.3)); show("timer",cabUI&&t>b.wipe1-0.1,pop(t,b.wipe1,0.3)); $("timer").textContent="⏱ "+mmss(Math.max(0,900-Math.max(0,t-b.wipe1)));
  // the cards Nikhil lays down, the Kiran card (face-down, aside), the ask, Hema's sticky note, the DRAFT document
  const cardsOn=cabin&&!(t>=b.fb0-0.05&&t<b.fb1)&&t<b.abc0;   // back on the desk after the flashback
  const slap=(id,t0,x,y,rot)=>{const e=$(id), on=cardsOn&&t>=t0; e.style.opacity=on?1:0; if(!on) return; const k=out((t-t0)/0.18); e.style.left=x+"px"; e.style.top=y+"px"; e.style.transform=`translateY(${(1-k)*-60}px) scale(${lerp(1.35,1,k)}) rotate(${rot}deg)`};
  slap("k1",b.tK1,55,1170,-3); slap("k2",b.tK2,395,1176,2); slap("k3",b.tK3,735,1168,-2);
  {const e=$("kk"), on=cardsOn&&t>=b.kk0; e.style.opacity=on?1:0; if(on){const fk=clamp((t-b.tCmp)/0.3), mk=ease((t-b.tCmp-0.15)/0.4);
    e.style.left=lerp(400,20,mk)+"px"; e.style.top=lerp(1325,1335,mk)+"px"; e.style.transform=`translateY(${(1-out((t-b.kk0)/0.18))*-50}px) rotateY(${fk*180}deg) rotate(${lerp(1,-7,mk)}deg)`;
    e.querySelector(".back").style.opacity=fk>0.5?1:0; e.querySelector(".tx").style.opacity=fk>0.5?0:1}}
  slap("kask",b.tMkt,300,1325,1);
  {const e=$("note"), on=cardsOn&&t>=b.tDec+0.35; e.style.opacity=on?1:0; if(on){const k=out((t-b.tDec-0.35)/0.2); e.style.left="800px"; e.style.top="1352px"; e.style.transform=`translateY(${(1-k)*-40}px) scale(${lerp(1.4,1,k)}) rotate(7deg)`}}
  {const e=$("bigdoc"), on=cabin&&t>=b.tAsk+0.4&&t<b.fb0; e.style.opacity=on?1:0; e.style.left="240px"; e.style.top="360px"; e.style.transform=`scale(${Math.max(0.01,pop(t,b.tAsk+0.4,0.35))}) rotate(-1.5deg)`}
  // A/B/C tiles (L12)
  show("q3",!loop&&t>b.abc0&&t<b.sh0,pop(t,b.abc0,0.35),`rotate(-1.5deg)`);
  ["tA","tB","tC"].forEach((id,i)=>{const t0=i<2?b.abc0+0.15+i*0.2:b.tAB; const e=$(id); const on=!loop&&t>t0&&t<b.sh0; e.style.opacity=on?1:0;
    e.style.transform=`translateY(${lerp(-80,0,out((t-t0)/0.3))}px) scale(${Math.max(0.01,pop(t,t0,0.35))*(id==="tC"&&t>b.tAB?1+0.03*Math.sin(t*8):1)}) rotate(${[-2,1.5,-1][i]}deg)`;
    if(id==="tC") e.className="tile"+(t>b.tAB+0.1?" glow":"")});
  show("cm2",!loop&&t>b.tCm2&&t<b.sh0,pop(t,b.tCm2,0.3)*(1+0.04*Math.sin(t*12)));
  CB2.forEach((_,i)=>{const e=$("cc"+i), t0=b.tCm2+0.1+i*0.22; const v=!loop&&t>t0&&t<b.sh0; e.style.opacity=v?1:0; e.style.transform=`translateY(${-(t-t0)*16}px) scale(${Math.max(0.01,pop(t,t0,0.3))}) rotate(${(i%2?3:-3)}deg)`});
  // share: tag the junior you trained
  {const shOn=!loop&&t>b.sh0&&t<b.end0+0.1; const sh=$("share"); sh.style.opacity=shOn?clamp(Math.min((t-b.sh0)/0.2,(b.end0+0.1-t)/0.15)):0;
   $("sq").style.transform=`scale(${Math.max(0.01,back((t-b.sh0)/0.4))})`;
   $("cin").innerHTML=t>b.tAt?(t>b.tTag+0.1?'<em>@Office junior 🧑‍💻</em> నువ్వే గుర్తొచ్చావ్ 😅':"@"+(t>b.tAt+0.3?"Off":"")):"";
   ["ct1","ct2","ct3"].forEach((id,i)=>{const e=$(id), t0=b.tAt+0.1+i*0.08; e.style.opacity=t>t0?1:0; e.style.transform=`translateY(${lerp(30,0,out((t-t0)/0.25))}px) scale(${id==="ct1"&&Math.abs(t-b.tTag)<0.1?0.94:1})`; e.style.background=id==="ct1"&&t>b.tTag?"#FFF3B0":"#fff"});
   $("ok1").style.opacity=t>b.tTag+0.1?1:0}
  // end card with the follow tap, then the hard cut to frame 1
  {const ec=$("endc"), eOn=!loop&&t>b.end0&&t<b.loop0; ec.style.opacity=eOn?clamp((t-b.end0)/0.12):0;
   $("eF").textContent=t<b.tEF?"FOLLOW @_REELRASAM":"FOLLOWING ✓  @_REELRASAM"; $("eF").style.transform=`scale(${Math.abs(t-b.tEF)<0.1?0.92:1})`; $("eF").style.background=t<b.tEF?"":"#6D6875";
   const eh=$("eHand"), ek=ease((t-b.end0)/Math.max(0.2,b.tEF-b.end0-0.05)), edip=Math.max(0,1-Math.abs(t-b.tEF)/0.1);
   eh.style.opacity=eOn&&t<b.tEF+0.4?1:0; eh.style.transform=`translate(${lerp(900,500,ek)-50}px,${lerp(1300,800,ek)+edip*12}px) scale(${1-0.1*edip}) rotate(-8deg)`}
  // flashes: freeze, A/B, the reveal, the flashback in/out
  const fl=(t0,d,a_)=>t>t0&&t<t0+d?a_*(1-(t-t0)/d):0;
  $("flash").style.opacity=loop?0:(fl(b.fz0,0.14,0.45)+fl(b.ab0,0.1,0.3)+fl(b.rev,0.18,0.45)+fl(b.fb0,0.12,0.3)+fl(b.fb1-0.05,0.12,0.25));
  // subtitles (… -> ...); during the loop cut only the last phrase
  const sub=$("sub"), L=curLine(t);
  if(loop){ sub.style.opacity=t<E(13)+0.2?1:0; sub.innerHTML=`<span class="who" style="background:${COLORS.gopi}">GOPI</span><br>clue మొదట్లోనే ఉంది!` }
  else if(L){sub.style.opacity=1; sub.innerHTML=`<span class="who" style="background:${COLORS[L.who]}">${L.i===11?"KIRAN · TUESDAY":NAMES[L.who]}</span><br>${subFix(L.text)}`} else sub.style.opacity=0;
  if(!loop&&t<0.15) sub.style.opacity=0;
}
function show(id,on,s=1,extra=""){const e=$(id); e.style.opacity=on?1:0; if(on) e.style.transform=`${extra} scale(${Math.max(0.01,s)})`}

window.render=function(t){ frame(t) };
