// Moral dilemma #2 "the reference call" — drawn world, cast and choreography (loaded by ep.html).
// (makeAdult rig + Gopi badge reused from 17 Nov "the forehead number", with sidePart/watch/glass/cert/phoneUp added.)
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
// comment bubbles during the countdown (generic names; none hints at how the story ends)
const CB=[["Ravi","A — karma bro","#1E88E5",40,1250],["Priya","B — amma kosam","#D81B60",560,1300],["Teja","A, no doubt","#2E7D32",60,1380],
          ["Anu","B… past is past","#8E24AA",540,1440],["Karthik","Phone cut చేస్తా 😅","#E65100",40,1500],["Sneha","🤔","#00897B",945,1000]];
$("cbs").innerHTML=CB.map(([n,g,c,x,y],i)=>`<div class="cb" id="cb${i}" style="left:${x}px;top:${y}px"><b style="color:${c}">${n}</b><i>${g}</i></div>`).join("");
// after the reveal (A/B/C prompt): a few comment pops
const CB2=[["Vamsi","C ☕ 💯","#00897B",640,1090],["Swathi","A only!","#1E88E5",760,1220],["Sai","B… amma kosam","#D81B60",560,1350]];
$("cbs").innerHTML+=CB2.map(([n,g,c,x,y],i)=>`<div class="cb" id="cc${i}" style="left:${x}px;top:${y}px"><b style="color:${c}">${n}</b><i>${g}</i></div>`).join("");
// call-card waveform bars
$("wave").innerHTML=Array.from({length:14},()=>"<i></i>").join("");
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
const FAR=0.6, NEAR=0.95, SY=1116, NY=1560;      // far seated hip (stand-up room) / near standing hip
const CX=3000, CS=0.8, CY=1420;                  // chai stall: x offset, scale, hip

// ===== OFFICE, Tower B, Hitech City (x 0..1100): wall, window with tower cut-outs, the glass stand-up room, Sandeep's desk =====
el("rect",{x:-700,y:-900,width:2600,height:2100,fill:"#D6DDE3"},W);                 // back wall (cool paper)
el("rect",{x:-700,y:1180,width:2600,height:1200,fill:"#9AA4AE"},W);                 // carpet
el("rect",{x:-700,y:1176,width:2600,height:10,fill:"#6E7882"},W);
for(let i=0;i<10;i++) el("rect",{x:-700+i*260,y:1186,width:130,height:900,fill:"#8F99A3",opacity:.5},W);
// window band (left) with Hitech City towers (generic, no names) + afternoon light
el("rect",{x:-700,y:250,width:1260,height:560,fill:"#CFE4F1",stroke:"#5E6B78","stroke-width":10},W);
[[-640,430,150,"#9FB7CC"],[-470,360,120,"#B7C9D8"],[-330,300,170,"#8FA9C0"],[-140,400,130,"#A9BFD2"],[10,330,150,"#94AEC4"],[180,450,120,"#B3C6D6"],[320,380,160,"#9CB4C9"]].forEach(([x,y,w,c],k)=>{
  el("rect",{x,y,width:w,height:810-y,fill:c,stroke:"#6F8295","stroke-width":3},W);
  for(let r=y+24;r<800;r+=34) for(let q=x+14;q<x+w-14;q+=26) el("rect",{x:q,y:r,width:14,height:18,fill:hash(q*r+k)>0.7?"#FFF4C9":"#E6EEF4",opacity:.9},W)});
for(let x=-700;x<=560;x+=210) el("rect",{x:x-5,y:250,width:10,height:560,fill:"#5E6B78"},W);
el("polygon",{points:"-200,810 120,810 420,1180 -40,1180",fill:"#FFF3C4",opacity:.35},W);   // afternoon light on the floor
// a plant + a water cooler on the left (generic office)
el("rect",{x:-40,y:1050,width:90,height:130,rx:10,fill:"#B0703C",stroke:INK,"stroke-width":4},W);
[[-30,980],[5,950],[40,985],[-10,1010],[25,1020]].forEach(([x,y])=>el("ellipse",{cx:x,cy:y,rx:28,ry:58,fill:"#4E8A4A",stroke:INK,"stroke-width":3,transform:`rotate(${(x-5)*0.8} ${x} ${y+40})`},W));
// the glass stand-up room (right)
const RX0=560, RX1=1120, RY0=735, RY1=1200;
el("rect",{x:RX0,y:RY0,width:RX1-RX0,height:RY1-RY0,fill:"#C5D3DF"},W);             // inside back wall
el("rect",{x:880,y:800,width:200,height:130,rx:6,fill:"#FAFAF7",stroke:"#6F7C88","stroke-width":5},W);   // whiteboard
[["#FFF176",900,815],["#F8BBD0",950,815],["#B3E5FC",1000,815],["#FFF176",900,865],["#C8E6C9",955,868]].forEach(([c,x,y])=>el("rect",{x,y,width:40,height:38,fill:c,stroke:"#9E9E9E","stroke-width":1.5,transform:`rotate(${(x%7)-3} ${x+20} ${y+19})`},W));
el("path",{d:"M1040 840 Q1060 870 1045 905",stroke:"#1E88E5","stroke-width":4,fill:"none"},W);
const roomPeople=el("g",{},W);   // people go in here (behind the table front + glass)
const tableFront=el("g",{},W);
el("rect",{x:600,y:1076,width:500,height:22,rx:6,fill:"#E9E4DA",stroke:INK,"stroke-width":5},tableFront);
el("rect",{x:620,y:1098,width:460,height:102,fill:"#BDB5A6",stroke:INK,"stroke-width":5},tableFront);
[[700,1060],[880,1062],[1000,1058]].forEach(([x,y])=>el("rect",{x:x-22,y,width:44,height:16,rx:3,fill:"#37474F"},tableFront));   // laptops/notebooks on the table
// glass front + frosted band + door frame
el("rect",{x:RX0,y:RY0,width:RX1-RX0,height:RY1-RY0,fill:"#CDEBF6",opacity:.14},W);
el("rect",{x:RX0,y:RY0,width:RX1-RX0,height:40,fill:"#FFFFFF",opacity:.55},W);
[[620,760,560,1180],[700,760,640,1180],[960,760,900,1180],[1030,760,990,1180]].forEach(([x1,y1,x2,y2])=>el("polygon",{points:`${x1},${y1} ${x1+22},${y1} ${x2+22},${y2} ${x2},${y2}`,fill:"#FFFFFF",opacity:.18},W));
el("rect",{x:RX0-8,y:RY0-8,width:RX1-RX0+16,height:RY1-RY0+16,fill:"none",stroke:"#56616C","stroke-width":14},W);
el("rect",{x:RX0+80,y:RY0,width:10,height:RY1-RY0,fill:"#56616C"},W);             // door post
el("rect",{x:RX0+62,y:930,width:8,height:70,rx:3,fill:"#90A4AE",stroke:INK,"stroke-width":2},W);   // door handle
// Sandeep's desk (outside the room, in front): laptop lid (no logo), mug, chair; the certificate is an HTML label (#cert)
const desk=el("g",{},W);
el("rect",{x:640,y:1290,width:470,height:22,rx:5,fill:"#D9CBB2",stroke:INK,"stroke-width":5},desk);
el("rect",{x:660,y:1312,width:430,height:220,fill:"#B8A88E",stroke:INK,"stroke-width":5},desk);
el("rect",{x:700,y:1328,width:170,height:80,rx:6,fill:"#A39274",stroke:INK,"stroke-width":3},desk);
el("path",{d:"M720 1290 L742 1190 L878 1190 L858 1290 Z",fill:"#9EA7B0",stroke:INK,"stroke-width":5},desk);   // laptop lid, from behind
el("rect",{x:700,y:1284,width:200,height:10,rx:3,fill:"#7D868F",stroke:INK,"stroke-width":3},desk);
el("rect",{x:1040,y:1240,width:40,height:50,rx:6,fill:"#ECEFF1",stroke:INK,"stroke-width":4},desk);
el("path",{d:"M1080 1252 Q1096 1265 1080 1278",stroke:INK,"stroke-width":4,fill:"none"},desk);

// ===== CHAI STALL below Tower B, 6:40 PM (x CX..): dusk bands, tower silhouettes, streetlight, the stall, a standing counter =====
const C0=el("g",{},W);
[["#F7B267",-900,520],["#F79D65",520,760],["#F4845F",760,960],["#E56B5D",960,1100],["#B9566A",1100,1240]].forEach(([c,y0,y1])=>el("rect",{x:CX-700,y:y0,width:2600,height:y1-y0,fill:c},C0));
el("circle",{cx:CX+860,cy:900,r:70,fill:"#FFD8A8",opacity:.9},C0);   // low sun
[[CX-260,520,170],[CX-60,640,130],[CX+90,470,160],[CX+600,560,150],[CX+780,700,120],[CX+940,500,170],[CX+1150,620,140]].forEach(([x,y,w],k)=>{
  el("rect",{x,y,width:w,height:1240-y,fill:k%2?"#5B3A58":"#4A2F4E"},C0);
  for(let r=y+30;r<1200;r+=40) for(let q=x+16;q<x+w-16;q+=30) if(hash(q+r*1.7)>0.55) el("rect",{x:q,y:r,width:12,height:16,fill:"#FFD180",opacity:.85},C0)});
el("rect",{x:CX-700,y:1240,width:2600,height:1200,fill:"#7B6658"},C0);              // pavement
el("rect",{x:CX-700,y:1236,width:2600,height:10,fill:"#5A4A40"},C0);
// streetlight (cut-paper sodium lamp + flat cone of light)
el("rect",{x:CX+960,y:560,width:16,height:700,fill:"#3E3A40",stroke:INK,"stroke-width":3},C0);
el("path",{d:`M${CX+968} 570 Q${CX+968} 520 ${CX+900} 520 L${CX+860} 520`,stroke:"#3E3A40","stroke-width":12,fill:"none"},C0);
el("ellipse",{cx:CX+850,cy:530,rx:36,ry:14,fill:"#FFB74D",stroke:INK,"stroke-width":3},C0);
el("polygon",{points:`${CX+818},540 ${CX+882},540 ${CX+1040},1240 ${CX+660},1240`,fill:"#FFD54F",opacity:.22},C0);
// the stall (back, left): awning, kettle on a stove, tumblers, a biscuit jar (no shop name)
el("rect",{x:CX-120,y:760,width:520,height:480,fill:"#8D6E63",stroke:INK,"stroke-width":5},C0);
for(let k=0;k<7;k++) el("path",{d:`M${CX-150+k*80} 720 L${CX-70+k*80} 720 L${CX-70+k*80} 790 Q${CX-110+k*80} 810 ${CX-150+k*80} 790 Z`,fill:k%2?"#FFF3E0":"#E53935",stroke:INK,"stroke-width":4},C0);
el("rect",{x:CX-100,y:960,width:480,height:30,fill:"#A1887F",stroke:INK,"stroke-width":4},C0);
el("rect",{x:CX-60,y:930,width:110,height:30,rx:4,fill:"#455A64",stroke:INK,"stroke-width":3},C0);    // stove
el("path",{d:`M${CX-40} 930 Q${CX-50} 860 ${CX+5} 850 Q${CX+60} 860 ${CX+50} 930 Z`,fill:"#CFD8DC",stroke:INK,"stroke-width":4},C0);   // steel kettle
el("path",{d:`M${CX+48} 880 L${CX+90} 862`,stroke:"#B0BEC5","stroke-width":9,"stroke-linecap":"round"},C0);
el("path",{d:`M${CX-30} 852 Q${CX+5} 820 ${CX+40} 852`,stroke:"#90A4AE","stroke-width":6,fill:"none"},C0);
for(let k=0;k<5;k++){const x=CX+120+k*32; el("path",{d:`M${x-11} 930 L${x+11} 930 L${x+8} 960 L${x-8} 960 Z`,fill:"#E3EEF2",stroke:INK,"stroke-width":3},C0)}
el("rect",{x:CX+300,y:900,width:60,height:60,rx:10,fill:"#FFF8E1",stroke:INK,"stroke-width":4,opacity:.9},C0);
for(let k=0;k<4;k++) el("circle",{cx:CX+316+(k%2)*28,cy:920+Math.floor(k/2)*22,r:9,fill:"#D7A35C"},C0);
const kSteam=[0,1,2].map(k=>el("path",{d:"",stroke:"#FFFFFF","stroke-width":5,fill:"none",opacity:.6,"stroke-linecap":"round"},C0));
const stallPeople=el("g",{},W);
// standing counter in front of Nikhil + Sandeep (wood plank on a steel frame)
const counter=el("g",{},W);
el("rect",{x:CX+120,y:1352,width:760,height:24,rx:6,fill:"#A1887F",stroke:INK,"stroke-width":5},counter);
el("rect",{x:CX+150,y:1376,width:700,height:300,fill:"#6D4C41",stroke:INK,"stroke-width":5},counter);
for(let k=0;k<4;k++) el("rect",{x:CX+170+k*170,y:1390,width:130,height:270,rx:4,fill:"#5D4037",opacity:.6},counter);
const slideGlass=el("g",{},W);   // the second glass Nikhil slides across (world object)
el("path",{d:"M-14 -44 L14 -44 L11 0 L-11 0 Z",fill:"#E3EEF2",stroke:INK,"stroke-width":3},slideGlass); el("path",{d:"M-12.5 -30 L12.5 -30 L11 0 L-11 0 Z",fill:"#B9773E"},slideGlass);
const gSteam=[0,1].map(k=>el("path",{d:"",stroke:"#FFFFFF","stroke-width":4,fill:"none",opacity:.7,"stroke-linecap":"round"},W));

// ---------- adult characters (front view; local y=0 at the hip) ----------
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
    txt(o.badge[1],{x:0,y:44,"font-family":"Anton","font-size":12.5,"text-anchor":"middle",fill:"#2D6CDF","letter-spacing":1},bd); o._lany=ly; o._bd=bd}
  const arm=s=>({up:el("line",{stroke:o.sleeve||o.shirt,"stroke-width":32,"stroke-linecap":"round"},body),
                 lo:el("line",{stroke:o.fore||o.sleeve||o.shirt,"stroke-width":28,"stroke-linecap":"round"},body),
                 cuff:o.cuff?el("circle",{r:15,fill:o.cuff},body):null,
                 bang:o.bangles?el("circle",{r:16,fill:"none",stroke:"#FFC107","stroke-width":6},body):null,
                 hand:el("circle",{r:17,fill:o.skin,stroke:INK,"stroke-width":3},body)});
  const AL=arm(-1), AR=arm(1);
  const watch=o.watch?el("rect",{x:-14,y:-11,width:28,height:22,rx:6,fill:o.watch,stroke:INK,"stroke-width":3},body):null;
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
  else if(o.sidePart){ el("path",{d:"M-58 -8 Q-68 -88 -6 -94 Q60 -98 63 -30 L59 -8 Q57 -46 44 -58 Q14 -72 -20 -64 Q-30 -62 -36 -72 Q-50 -52 -54 -8 Z",fill:o.hair,stroke:INK,"stroke-width":3},head);
    el("path",{d:"M-36 -90 Q-34 -80 -36 -70",stroke:"#4A3A30","stroke-width":3,fill:"none","stroke-linecap":"round"},head);
    el("path",{d:"M-18 -86 Q20 -92 46 -70",stroke:"#5C4C44","stroke-width":5,fill:"none","stroke-linecap":"round",opacity:.85},head)}
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
    if(o._lany) o._lany.style.opacity=k.lany; if(o._bd) o._bd.setAttribute("transform",`translate(0,-122) scale(${k.flip},1)`);
    buds.forEach((b_,i)=>b_.style.opacity=(i===1?k.buds:1));
    [[AL,SH[0],k.hL,-1],[AR,SH[1],k.hR,1]].forEach(([A,S,T,side])=>{const [e,h]=ik(S[0],S[1],T[0],T[1],118,112,side);
      A.up.setAttribute("x1",S[0]);A.up.setAttribute("y1",S[1]);A.up.setAttribute("x2",e[0]);A.up.setAttribute("y2",e[1]);
      A.lo.setAttribute("x1",e[0]);A.lo.setAttribute("y1",e[1]);A.lo.setAttribute("x2",h[0]);A.lo.setAttribute("y2",h[1]);
      const m=[lerp(e[0],h[0],0.25),lerp(e[1],h[1],0.25)], m2=[lerp(e[0],h[0],0.8),lerp(e[1],h[1],0.8)];
      if(A.cuff){A.cuff.setAttribute("cx",m[0]);A.cuff.setAttribute("cy",m[1])}
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
// recurring cast (tools/anim2d/cast.md) + this reel's new character
const NIKHIL_OPT={skin:"#C98B5E",hair:"#1C1410",shirt:"#45454D",collar:"#3A3A42",stubble:"#5A3A28",brow:6.5,lip:"#7A3A30"};
const ANANYA_OPT={skin:"#D9A47A",hair:"#2A1A14",shirt:"#1E8C8C",trim:"#F5B347",kurta:true,longHair:true,fore:"#D9A47A",sleeve:"#1E8C8C",cuff:"#F5B347",earrings:true,brow:4.5,lash:4,blush:0.3,lip:"#A0404A"};
const SANDEEP_OPT={skin:"#BF8459",hair:"#120D0A",shirt:"#8EC3EE",collar:"#79AEDC",button:"#E8F2FB",sleeve:"#8EC3EE",fore:"#BF8459",cuff:"#A9D3F5",sidePart:true,watch:"#263238",brow:6,lip:"#7A3A30"};   // Sandeep, 34 (new): slim light-blue shirt, rolled sleeves, smart watch (no logo), gelled side part
const SANDEEP_DOWN={...SANDEEP_OPT,fore:"#8EC3EE",cuff:"#79AEDC"};   // chai stall: sleeves down (buttoned cuffs), lanyard in his pocket
const PEER1={skin:"#B07850",hair:"#1A1410",shirt:"#A1887F",collar:"#8D6E63",brow:6,lip:"#6A3028",moustache:"#1E1612"};       // stand-up colleague (silent)
const PEER2={skin:"#C98F66",hair:"#20140F",shirt:"#E57373",trim:"#FFCDD2",kurta:true,longHair:true,sleeve:"#E57373",fore:"#C98F66",brow:4.5,lash:4,lip:"#A0404A"};   // stand-up colleague (silent)
const NIK_STAND={...NIKHIL_OPT,badge:["NIKHIL R","TOWER B"],legs:{pant:"#2B3240",shoe:"#1A1A1A"}};
const ANA_STAND={...ANANYA_OPT,badge:["ANANYA","TOWER B"],legs:{pant:"#F3E5AB",shoe:"#8D6E63"}};

// stand-up room (far, seated): Sandeep (by the door, watching Nikhil leave), Ananya, a colleague
const SDR=makeAdult({...SANDEEP_OPT,badge:["SANDEEP K","TOWER B"],parent:roomPeople});
const ANF=makeAdult({...ANANYA_OPT,parent:roomPeople});
const PR1=makeAdult({...PEER1,parent:roomPeople});
roomPeople.insertBefore(PR1.g, SDR.g);
// near (office): Nikhil on the call, Ananya (from L4)
const NK=makeAdult(NIK_STAND);
const AN=makeAdult(ANA_STAND);
// chai stall: Nikhil + Sandeep behind the counter
const NKC=makeAdult({...NIK_STAND,parent:stallPeople});
const SDC=makeAdult({...SANDEEP_DOWN,legs:{pant:"#37414F",shoe:"#3E2723"},parent:stallPeople});

// ---------- flashback inset ("LAST YEAR", sepia torn paper): its own little world, paper filter + CSS sepia ----------
const fbs=$("fbs"), FB=el("g",{filter:"url(#skin-paper)"},fbs);
// (a) 2:07 AM at his desk + (c) the appraisal card: the same desk
const fbDesk=el("g",{},FB);
el("rect",{x:0,y:0,width:980,height:800,fill:"#59606B"},fbDesk);
el("rect",{x:40,y:70,width:220,height:200,fill:"#2C3440",stroke:"#1A1F27","stroke-width":8},fbDesk);       // night window
el("circle",{cx:200,cy:120,r:26,fill:"#F5F0DC"},fbDesk);
for(let k=0;k<5;k++) el("rect",{x:60+k*40,y:190-hash(k)*60,width:26,height:80+hash(k)*60,fill:"#3B4552"},fbDesk);
const fbNK=makeAdult({...NIKHIL_OPT,parent:fbDesk});
el("rect",{x:470,y:230,width:470,height:330,rx:12,fill:"#202833",stroke:INK,"stroke-width":8},fbDesk);   // monitor (the #dash text sits on it)
el("rect",{x:486,y:246,width:438,height:298,rx:6,fill:"#E9F5EA"},fbDesk);
el("rect",{x:680,y:560,width:40,height:60,fill:"#37474F"},fbDesk);
el("rect",{x:0,y:600,width:980,height:200,fill:"#8D7B66",stroke:INK,"stroke-width":6},fbDesk);            // desk top
el("rect",{x:330,y:612,width:90,height:70,rx:8,fill:"#ECEFF1",stroke:INK,"stroke-width":4},fbDesk);        // mug
el("path",{d:"M420 628 Q444 646 420 664",stroke:INK,"stroke-width":5,fill:"none"},fbDesk);
el("polygon",{points:"880,600 940,470 960,478 910,600",fill:"#455A64"},fbDesk); el("path",{d:"M900 470 Q950 430 990 470 Z",fill:"#FFD54F",stroke:INK,"stroke-width":4},fbDesk);   // desk lamp
// (b) the all-hands: slide screen, Sandeep with the certificate, the audience from behind
const fbHall=el("g",{},FB);
el("rect",{x:0,y:0,width:980,height:800,fill:"#7A6F66"},fbHall);
el("rect",{x:220,y:50,width:540,height:270,rx:8,fill:"#2A3F66",stroke:INK,"stroke-width":8},fbHall);       // slide (the #slide text sits on it)
const fbSD=makeAdult({...SANDEEP_OPT,parent:fbHall});
for(let k=0;k<9;k++){const x=40+k*115+(k%2)*20, y=720+(k%2)*30; el("circle",{cx:x,cy:y-60,r:42,fill:["#2A1E1A","#1C1410","#3A2A20"][k%3],stroke:INK,"stroke-width":4},fbHall); el("path",{d:`M${x-70} ${y+80} Q${x-60} ${y-10} ${x} ${y-14} Q${x+60} ${y-10} ${x+70} ${y+80} Z`,fill:["#90A4AE","#BCAAA4","#A5D6A7","#CE93D8"][k%4],stroke:INK,"stroke-width":4},fbHall)}
const clapHands=[0,1,2].map(k=>el("text",{x:150+k*330,y:640,"font-size":54,"text-anchor":"middle"},fbHall)); clapHands.forEach(c=>c.textContent="👏");

// ---------- A/B split panels (screen space, own drawings, paper filter) ----------
const abDefs=el("defs",{},absvg);
const clipA=el("clipPath",{id:"clipA"},abDefs); el("rect",{x:0,y:280,width:540,height:1200},clipA);
const clipB=el("clipPath",{id:"clipB"},abDefs); el("rect",{x:540,y:280,width:540,height:1200},clipB);
const abBg=el("rect",{x:0,y:0,width:1080,height:1920,fill:"#2A2016"},absvg);
const gAo=el("g",{"clip-path":"url(#clipA)"},absvg), gA=el("g",{filter:"url(#skin-paper)"},gAo);
const gBo=el("g",{"clip-path":"url(#clipB)"},absvg), gB=el("g",{filter:"url(#skin-paper)"},gBo);
// A: cold, hard truth (blue-grey office wall, a red alert stripe)
el("rect",{x:-200,y:200,width:900,height:1400,fill:"#B9C6D3"},gA);
el("rect",{x:-200,y:1360,width:900,height:300,fill:"#8E9AA6"},gA);
for(let k=0;k<6;k++) el("rect",{x:-200+k*160,y:290,width:70,height:1070,fill:"#AEBBC8"},gA);
const NKa=makeAdult({...NIK_STAND,parent:gA});
// B: warm cover (soft peach wall)
el("rect",{x:400,y:200,width:900,height:1400,fill:"#F2D3B3"},gB);
el("rect",{x:400,y:1360,width:900,height:300,fill:"#C9A98A"},gB);
el("rect",{x:640,y:430,width:300,height:240,rx:10,fill:"#FBE9D7",stroke:"#B08968","stroke-width":8},gB); el("line",{x1:790,y1:430,x2:790,y2:670,stroke:"#B08968","stroke-width":6},gB);   // a warm window
const NKb=makeAdult({...NIK_STAND,parent:gB});
const seam=el("rect",{x:532,y:280,width:16,height:1200,fill:INK},absvg);

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
const COLORS={gopi:"#F5B347",nikhil:"#C9C3F2",ananya:"#7FE0D0",sandeep:"#90CAF9",radhika:"#E1BEE7"},
      NAMES={gopi:"GOPI",nikhil:"NIKHIL",ananya:"ANANYA",sandeep:"SANDEEP",radhika:"RADHIKA · HR 📞"};
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
  B.titleIn=1.5; B.tOffer=at(0,"thirty"); B.tYours=at(0,"మీదే");
  B.mute=S(1)-0.3; B.fb0=S(1)-0.05; B.fbB=at(1,"తనదన్నాడు")-0.1; B.fbC=at(1,"promotion")-0.05; B.fb1=at(1,"పోయింది")+0.3; B.titleOut=B.fb0;
  B.tRev=at(2,"revenge")-0.05; B.tHold=at(2,"Nikhil");
  B.an0=S(3)-0.25; B.tAmma=at(3,"dialysis")-0.1; B.tMonth=at(3,"ఈ నెలే");
  B.fol0=S(4)-0.1; B.tFol=at(4,"follow")+0.1; B.fol1=E(4)+0.05; B.clk41=S(4);
  B.ab0=S(5)-0.12; B.tA=at(5,"A…"); B.tB=at(5,"B…"); B.tCm=at(5,"Comment");
  B.CD0=E(5)+0.1; B.CD1=B.CD0+TL.countdown; B.cb=CB.map((_,i)=>B.CD0+0.35+i*0.65);
  B.rev=B.CD1; B.tDel=at(6,"deliver"); B.tTrue=at(6,"అది"); B.tBias=at(7,"biased")-0.25; B.tAsk=at(7,"ఆయన్నే"); B.tNod=at(7,"అడగండి");
  B.callEnd=E(7)+0.08; B.wipe0=E(7)+0.3; B.stall=S(8)-0.18; B.wipe1=B.stall+0.12;
  B.walk1=S(8)+0.35; B.tCal1=at(8,"నిజం")-0.1; B.tSorry=at(8,"Sorry")-0.1;
  B.tSlide=S(9)+0.1; B.tSlide1=at(9,"తాగు"); B.tTake=E(9)+0.15;
  B.abc0=S(10)-0.12; B.tC=at(10,"C?")-0.1; B.tCm2=at(10,"Comment");
  B.sh0=S(11)-0.1; B.tAt=at(11,"colleague")-0.25; B.tTag=at(11,"tag")+0.1; B.end0=at(11,"Follow")-0.15; B.tEF=at(11,"Follow")+0.3; B.loop0=at(11,"ఈ call")-0.06;
  return B}

const focus=(z,wx,wy,sx=540,sy=1000)=>({z,fx:wx-(sx-540)/z,fy:wy-(sy-1000)/z});
const mixCam=(a,b_,k)=>({z:lerp(a.z,b_.z,k),fx:lerp(a.fx,b_.fx,k),fy:lerp(a.fy,b_.fy,k)});
let curSkin="";
function skinTo(s){ if(s!==curSkin){ setSkin(s); curSkin=s } }
const mmss=s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(Math.floor(s%60)).padStart(2,"0")}`;

function frame(t){
  const b=beats();
  const loop=t>=b.loop0;
  const tf=loop?0:t;                 // opening/loop share frame 1
  const T=tf;                        // character time
  skinTo("paper");
  const stall=!loop&&t>=b.stall;
  const reveal=!loop&&t>=b.rev&&!stall;
  const reset=(C,who,x,y,s)=>Object.assign(C.st,{x,y,s,talk:who&&!loop?talkOf(who,t):0,blink:((T*0.6+x*0.0013)%3.3)<0.11?1:0,shut:0,look:0,lookY:0,brow:"n",smile:0,laugh:0,sad:0,smirk:0,gasp:0,
    headRot:0,headY:0,hop:0,rot:0,item:"",itemL:"",itemRot:0,itemRotL:0,vis:1,flip:1,wink:0,walk:0,lany:1,buds:1,hL:[-62,-66],hR:[62,-66]});

  // ---------------- stand-up room (far, seated) ----------------
  // Sandeep: watches Nikhil leave with the phone (frame 1, uneasy); later back to the meeting
  const sd=SDR.st; reset(SDR,null,700,SY,FAR); sd.look=-1; sd.lookY=0.1; sd.brow="w"; sd.sad=1; sd.headRot=-4; SDR.aim("L",672,SY-40); SDR.aim("R",735,SY-48);
  if(T>3.0&&T<b.an0){ sd.look=-0.2; sd.sad=0; sd.smirk=1; sd.brow="n"; sd.headRot=0 }                    // back to the meeting, polished smile
  if(T>=b.an0&&T<b.rev){ sd.look=-0.9; sd.smirk=0; sd.brow="w"; sd.headRot=-3 }                          // glances out again
  if(reveal){ sd.look=-0.8; sd.brow="u"; sd.smirk=0; sd.headRot=-2; if(t>b.tAsk) { sd.brow="w"; sd.lookY=0.5 } }
  SDR.draw();
  const af=ANF.st; reset(ANF,null,860,SY,FAR); af.vis=(T<b.an0-0.05)?1:0; af.look=-0.7; af.lookY=-0.1; af.brow="u"; af.headRot=-3; ANF.aim("L",835,SY-40); ANF.aim("R",885,SY-44);
  ANF.draw();
  const p1=PR1.st; reset(PR1,null,1010,SY,FAR); p1.look=-0.4; p1.lookY=0.6; p1.headRot=Math.sin(T*1.2)*1.5; PR1.aim("L",985,SY-44); PR1.aim("R",1035,SY-40); p1.talk=Math.abs(Math.sin(T*6))*0.3*((Math.floor(T*1.1)%2)?1:0);
  PR1.draw();

  // ---------------- near: Nikhil on the call ----------------
  const nk=NK.st; const NX=reveal?520:lerp(330,300,ease(T/1.4)); reset(NK,"nikhil",NX,NY,NEAR);
  nk.walk=T<1.4&&!reveal?Math.sin(T*7)*(1-T/1.4):0; nk.look=0.25; nk.lookY=0.1; nk.brow="w"; nk.item="phone"; nk.itemRot=12; nk.hR=[64,-388]; nk.headRot=-2;
  NK.aim("L",NX-70,NY-0.95*60);
  if(T>b.tYours-0.1&&T<b.mute){ nk.brow="a"; nk.look=0.1; nk.lookY=0.3 }
  if(T>=b.mute&&T<b.rev){ nk.brow="a"; nk.look=-0.3; nk.lookY=0.5; nk.headRot=4; nk.sad=1; nk.hR=[60,-250]; nk.itemRot=-10 }   // muted: phone down at chest, bitter
  if(T>=b.mute&&T<b.mute+0.3){ const k=(T-b.mute)/0.3; NK.aim("L",NX+20,NY-0.95*230) }                                         // thumb on mute
  if(T>=b.tRev&&T<b.an0){ nk.brow="a"; nk.look=0.6; nk.lookY=0.7; nk.sad=0; nk.headRot=0; NK.aim("L",NX+30,NY-0.95*240) }        // thumb hovers (REVENGE?)
  if(T>=b.an0&&T<b.rev){ nk.look=0.8; nk.lookY=0; nk.brow="a"; nk.sad=0; nk.headRot=3; if(T>b.tMonth){ nk.brow="w"; nk.sad=1; nk.look=0.9 } }   // jaw tight, then it lands
  if(T>=b.fol0&&T<b.rev){ nk.look=0.3; nk.lookY=0.6; nk.brow="w" }
  if(reveal){ nk.hR=[64,-388]; nk.itemRot=12; nk.sad=0; nk.brow="n"; nk.look=0.2; nk.lookY=0; nk.headRot=0; NK.aim("L",NX-70,NY-0.95*60);
    if(t>b.tBias-0.1){ nk.brow="u"; nk.look=0.1 } if(t>b.tAsk){ nk.brow="n" }
    if(t>b.callEnd){ nk.hR=[66,-120]; nk.itemRot=0; nk.look=0.9; nk.smile=1 } }
  nk.vis=stall?0:1;
  // ---------------- near: Ananya (follows him out in L4; beside him for the reveal) ----------------
  const an=AN.st; const AX=reveal?850:640; reset(AN,"ananya",AX,NY,NEAR); an.flip=-1; an.vis=(!loop&&!stall&&T>=b.an0)?1:0;
  an.look=1; an.lookY=0.2; an.brow="w"; an.sad=1; AN.aim("R",AX-70,NY-0.95*60); AN.aim("L",AX+60,NY-0.95*60);
  if(T>=b.an0&&T<b.an0+0.35){ an.walk=Math.sin((T-b.an0)*16); an.x=lerp(760,AX,ease((T-b.an0)/0.35)) }
  if(T>=b.an0&&T<b.rev){ AN.aim("R",NX+100,NY-0.95*185); an.headRot=-5; if(T<b.tAmma-0.2){ an.look=-0.9; an.lookY=-0.3 } }      // hand on his arm; glance back at the glass room
  if(T>=b.fol0&&T<b.rev){ an.look=0.6; an.lookY=0.2 }
  if(reveal){ an.look=1; an.sad=0; an.brow="n"; AN.aim("R",AX-75,NY-0.95*60);
    if(t>b.tBias-0.1&&t<b.tNod){ an.brow="u"; an.gasp=t<b.tBias+0.4?1:0 } if(t>=b.tNod){ an.brow="n"; an.smile=1; an.headY=Math.max(0,Math.sin((t-b.tNod)*7))*8*(t<b.tNod+1.0?1:0) } }
  NK.draw(); AN.draw();

  // ---------------- chai stall (6:40 PM) ----------------
  const nc=NKC.st; reset(NKC,"nikhil",CX+330,CY,CS); nc.item="glass"; nc.look=0.3; nc.lookY=0.4; nc.smile=0; nc.brow="n"; NKC.aim("R",CX+405,1360); NKC.aim("L",CX+270,1360);
  if(t>=b.walk1-0.3&&t<b.tSorry){ nc.look=0.8; nc.lookY=0.1; nc.brow="n" }
  if(t>=b.tSorry){ nc.look=1; nc.lookY=0; nc.brow="u" }
  if(t>=b.tSlide-0.1){ nc.brow="n"; nc.smile=1; nc.look=0.9 }
  // the slide: the right hand pushes the second glass along the counter to Sandeep
  const gk=ease((t-b.tSlide)/Math.max(0.3,b.tSlide1-b.tSlide)); let gx=CX+430, gy=1352;
  if(t>=b.tSlide){ gx=lerp(CX+430,CX+610,gk); NKC.aim("R",gx-8,gy-24) } if(t>=b.tSlide1){ NKC.aim("R",CX+430,1360) }
  if(t>=b.tTake){ gx=CX+610 }
  nc.item="glass"; if(t<b.tSlide){ NKC.aim("L",CX+250,1340); nc.itemL="glass"; nc.item="" } else { nc.itemL="glass"; NKC.aim("L",CX+255,1340) }
  NKC.draw();
  const sc_=SDC.st; let SX=CX+720; const wk=clamp((t-(b.stall))/(b.walk1-b.stall)); if(t<b.walk1){ SX=lerp(CX+1150,CX+720,ease(wk)) }
  reset(SDC,"sandeep",SX,CY,CS); sc_.lany=0; sc_.walk=t<b.walk1?Math.sin(t*9):0; sc_.look=-0.3; sc_.lookY=0.9; sc_.brow="w"; sc_.sad=1; sc_.headRot=4;
  sc_.itemL=t<b.tCal1+0.2?"phoneUp":""; SDC.aim("L",SX-40,1270); SDC.aim("R",SX+70,CY-60);
  if(t>=b.tCal1+0.2){ SDC.aim("L",SX-60,1360); SDC.aim("R",SX+60,1362) }
  if(t>=b.tSorry){ sc_.look=-1; sc_.lookY=0.1; sc_.headRot=-3; sc_.brow="w" }
  if(t>=b.tSlide1){ sc_.look=-0.7; sc_.lookY=0.6; sc_.sad=0; sc_.smile=t>b.tTake?1:0; sc_.brow="n" }
  if(t>=b.tTake){ SDC.aim("L",CX+612,1330); sc_.itemL="glass" }
  SDC.draw();
  slideGlass.setAttribute("transform",`translate(${gx},${gy})`); slideGlass.style.opacity=t>=b.tSlide-0.3&&t<b.tTake?1:0;
  {const steamPath=(x,y,k,h)=>`M${x} ${y} q${8*Math.sin(k)} ${-h/3} 0 ${-h*0.66} t0 ${-h*0.34}`;
   kSteam.forEach((p,k)=>{const ph=T*2+k*2.1; p.setAttribute("d",steamPath(CX+5+(k-1)*16,820-(ph%1)*10,ph*3,70)); p.setAttribute("opacity",0.35+0.25*Math.sin(ph*2))});
   gSteam.forEach((p,k)=>{const x=k?(t<b.tTake?gx:CX+612):CX+250; const ph=T*2.4+k*1.3; p.setAttribute("d",steamPath(x,1300-(ph%1)*8,ph*3,46)); p.style.opacity=stall&&!(k&&t<b.tSlide-0.3)?0.6:0})}

  // ---------------- flashback inset (L2) ----------------
  const fbOn=!loop&&t>=b.fb0&&t<b.fb1;
  {const w=$("fbw"); const k=Math.min(clamp((t-b.fb0)/0.25),clamp((b.fb1-t)/0.2)); w.style.opacity=fbOn?k:0;
   w.style.transformOrigin="50% 0"; w.style.transform=`translateY(${(1-out((t-b.fb0)/0.3))*-60}px) rotate(${-1.5+0.6*Math.sin(t*1.3)}deg) scale(${0.875*(0.96+0.04*out((t-b.fb0)/0.3))})`;
   const hall=t>=b.fbB&&t<b.fbC; fbDesk.style.display=hall?"none":""; fbHall.style.display=hall?"":"none";
   const f=fbNK.st; reset(fbNK,null,260,690,0.95); f.look=0.9; f.lookY=-0.1; f.brow="n"; fbNK.aim("L",200,600); fbNK.aim("R",330,600);
   if(t<b.fbB){ f.smile=1; f.brow="u"; f.shut=0 }                                             // 2:07 AM: it works
   if(t>=b.fbC){ f.look=0.3; f.lookY=1; f.sad=1; f.brow="w"; f.headRot=5 }                     // the appraisal card
   fbNK.draw();
   const s_=fbSD.st; reset(fbSD,null,490,760,0.9); s_.smirk=0; s_.smile=1; s_.look=0.2; s_.brow="u"; s_.item="cert"; s_.itemRot=-4; s_.hR=[30,-200]; s_.hL=[-60,-200];
   fbSD.draw();
   clapHands.forEach((c,k)=>c.setAttribute("transform",`translate(0,${Math.abs(Math.sin(t*14+k))*-10})`));
   $("dash").style.opacity=!hall?1:0; $("dash").style.left="486px"; $("dash").style.top="246px";
   $("slide").style.opacity=hall?1:0; $("slide").style.left="230px"; $("slide").style.top="58px";
   const ak=out((t-b.fbC)/0.35); $("appr").style.opacity=t>=b.fbC?1:0; $("appr").style.left="120px"; $("appr").style.top=`${lerp(-200,470,ak)}px`; $("appr").style.transform=`rotate(${lerp(-14,-4,ak)}deg)`}

  // ---------------- split panels (L6 + countdown; slide apart for the reveal) ----------------
  {const on=!loop&&t>=b.ab0&&t<b.rev+0.5; const ab=$("ab"); ab.style.opacity=on?clamp((t-b.ab0)/0.12):0;
   const sp=t>=b.rev?ease((t-b.rev)/0.45):0;   // panels slide apart
   gAo.setAttribute("transform",`translate(${-sp*600},0)`); gBo.setAttribute("transform",`translate(${sp*600},0)`); seam.style.opacity=sp>0?0:1; abBg.style.opacity=1-sp;
   const cdk=t-b.CD0, cdOn=t>=b.CD0&&t<b.CD1;
   const A_=NKa.st; reset(NKa,null,270,1360,0.8); A_.brow="a"; A_.look=0.3; A_.item="phone"; A_.itemRot=12; A_.hR=[64,-388]; NKa.aim("L",200,1360-0.8*200); A_.headRot=-3; A_.talk=cdOn?Math.abs(Math.sin(t*8))*0.5:0;
   NKa.draw();
   const B_=NKb.st; reset(NKb,null,810,1360,0.8); B_.smile=1; B_.look=-0.3; B_.item="phone"; B_.itemRot=12; B_.hR=[64,-388]; B_.hL=[-40,-30]; B_.brow="n"; B_.headRot=3; B_.talk=cdOn?Math.abs(Math.sin(t*7+1))*0.5:0;
   NKb.draw();
   // speech bubbles, crossed fingers, the offer card tearing (A)
   const sb=(id,x,y,t0)=>{const e=$(id); const v=on&&t>t0&&sp<0.05; e.style.opacity=v?1:0; e.style.left=x+"px"; e.style.top=y+"px"; e.style.transform=`scale(${Math.max(0.01,pop(t,t0,0.3))})`};
   sb("sbA",40,840,b.tA+0.1); sb("sbB",590,840,b.tB+0.1);
   {const e=$("cross"); const v=on&&t>b.tB+0.3&&sp<0.05; e.style.opacity=v?1:0; e.style.left="905px"; e.style.top="1285px"; e.style.transform=`rotate(${Math.sin(t*6)*8}deg) scale(${Math.max(0.01,pop(t,b.tB+0.3,0.3))})`}
   {const e=$("offerT"); const v=on&&t>b.tA+0.2&&sp<0.05; e.style.opacity=v?1:0; e.style.left="60px"; e.style.top="700px"; const tr=cdOn?clamp(cdk/TL.countdown):(t>=b.CD1?1:0);
    $("oL").style.transform=`translate(${-tr*26}px,${tr*30}px) rotate(${-tr*14}deg)`; $("oR").style.transform=`translate(${tr*26}px,${tr*40}px) rotate(${tr*16}deg)`}
   // labels + taps on A and B as Gopi reads them
   const lab=(id,t0,hit)=>{const e=$(id); e.style.opacity=on&&sp<0.05?1:0; e.style.transform=`scale(${Math.max(0.01,pop(t,b.ab0+0.05,0.35))*(Math.abs(t-hit)<0.12?0.92:1)})`; e.className="abl"+(t>hit&&t<hit+0.5?" hit":"")};
   lab("aL",0,b.tA+0.05); lab("bL",0,b.tB+0.05);
   {const h=$("abHand"); const v=on&&t>b.tA-0.35&&t<b.tB+0.45; const k=ease((t-(b.tB-0.35))/0.3); const hx=t<b.tB-0.35?270:lerp(270,810,k), hy=360; const dip=Math.max(0,1-Math.abs(t-b.tA-0.05)/0.1)+Math.max(0,1-Math.abs(t-b.tB-0.05)/0.1);
    h.style.opacity=v?1:0; h.style.transform=`translate(${hx-40}px,${hy+20+dip*14}px) rotate(-8deg)`}
   show("q",on&&sp<0.05,pop(t,b.ab0+0.05,0.4));
   show("cnow",on&&t>Math.max(b.tCm-0.05,E(5)+0.25)&&t<b.CD1,Math.max(0.01,pop(t,Math.max(b.tCm-0.05,E(5)+0.25),0.35))*(1+0.05*Math.sin(t*Math.PI*4)));
   const sec=Math.floor(cdk), fr=cdk-sec;
   $("cdw").style.opacity=cdOn?clamp(cdk/0.15)*clamp((TL.countdown-cdk)/0.15):0; $("cdw").style.top="430px";
   if(cdOn){const n_=Math.max(1,TL.countdown-sec); $("digit").textContent=n_; $("digit").style.transform=`scale(${lerp(1.5,1,out(fr/0.2))})`; $("digit").style.color=n_<=1?"#FF5252":"#F5B347";
     $("arc").setAttribute("stroke-dasharray",`${565.5*(1-cdk/TL.countdown)} 565.5`); $("cdw").style.transform=`scale(${1+Math.exp(-fr*8)*0.08})`}
   CB.forEach((_,i)=>{const e=$("cb"+i), t0=b.cb[i], k=pop(t,t0,0.3); const v=!loop&&t>t0&&t<b.CD1; e.style.opacity=v?clamp((b.CD1-t)/0.15):0;
     e.style.transform=`translateY(${-(t-t0)*18}px) scale(${Math.max(0.01,k)}) rotate(${(i%2?3:-3)}deg)`})}

  // ---------------- Gopi (narrator badge) ----------------
  const g=GOPI.st;
  const nIn=(i,pre=0.15,post=0.2)=>t>S(i)-pre&&t<E(i)+post;
  const narOn=!loop&&(nIn(2)||nIn(4)||nIn(5,0.15,0.05)||nIn(10)||(t>S(11)-0.15&&t<b.end0));
  const narT=t>S(11)-0.15?S(11)-0.15:t>S(10)-0.15?S(10)-0.15:t>S(5)-0.15?S(5)-0.15:t>S(4)-0.15?S(4)-0.15:S(2)-0.15;
  let BX=900, BY=1330, bsc=0.82;
  if(t>S(4)-0.2&&t<E(4)+0.3){ BX=900; BY=700 }
  if(t>S(5)-0.2&&t<E(5)+0.2){ BX=540; BY=1300 }
  if(t>S(10)-0.2&&t<E(10)+0.3){ BX=170; BY=1180 }
  if(t>S(11)-0.2){ BX=900; BY=1330 }
  Object.assign(g,{x:0,y:400*0.55+12,s:0.55,talk:talkOf("gopi",t),blink:((t*0.7)%3.1)<0.12?1:0,wink:0,look:BX>540?-0.5:0.5,lookY:0,brow:"n",smile:0,headRot:Math.sin(t*2.2)*3,item:"",armL:200,armR:160,lenL:115,lenR:115,hop:0,itemRot:0});
  if(t>S(2)&&t<E(2)){ g.brow="q"; g.look=-0.8; g.smile=t<b.tHold?1:0 }
  if(t>b.tHold&&t<E(2)+0.2){ g.wink=1; g.smile=1 }
  if(t>b.fol0&&t<b.fol1){ g.armR=40; g.item="point"; g.itemRot=-30 }
  if(t>S(5)&&t<E(5)){ g.brow="u"; g.look=0 }
  if(t>S(10)){ g.smile=1; g.brow="q" }
  GOPI.draw();
  const bs=narOn?Math.max(0.001,back((t-narT)/0.35)):0;
  badge.setAttribute("transform",`translate(${BX},${BY}) scale(${bs*bsc}) rotate(${Math.sin(t*2)*2})`); badge.style.opacity=narOn?1:0;

  // ---------------- camera ----------------
  const punch=(t0,a_=0.1)=>t>t0?a_*Math.exp(-(t-t0)*4)*clamp((t-t0)/0.06):0;
  const OPEN=focus(1.0+0.012*tf,540,1000);
  const WIDE=focus(1.0,540,1000);
  const ST=focus(1.0,CX+540,1000);
  const shots=[
    [0,OPEN],
    [b.tYours-0.15,focus(1.0+0.03*clamp((t-b.tYours+0.15)/0.4)+0.012*t+punch(b.tYours,0.02),540,1000)],
    [b.mute,focus(1.08,540,1060),0.3],
    [S(2)-0.1,focus(1.45+0.03*(t-S(2))+punch(b.tRev,0.08),330,1170,540,1060),0.25],
    [b.an0,focus(1.3+0.02*(t-b.an0)+punch(b.tMonth,0.06),470,1180,540,1010),0.25],
    [b.fol0,WIDE,0.3],
    [b.rev,focus(1.05+0.015*(t-b.rev)+punch(b.tBias+0.25,0.05),640,1060,540,1000),0.01],
    [b.stall,focus(1.0,CX+560,1080)],
    [b.walk1,focus(1.12+0.02*(t-b.walk1)+punch(b.tSorry+0.1,0.05),CX+530,1150,540,1060),0.6],
    [b.tSlide,focus(1.3+0.02*(t-b.tSlide),CX+500,1240,540,1080),0.35],
    [b.abc0,focus(1.0,CX+540,1040),0.4],
  ];
  let cm=OPEN;
  if(!loop){ let i=0; while(i+1<shots.length&&t>=shots[i+1][0]) i++;
    const [t0,c,tr]=shots[i]; cm=c;
    if(i>0&&tr&&t<t0+tr){ const prev=shots[i-1][1]; cm=mixCam(prev,c,ease((t-t0)/tr)) } }
  let sx=0,sy=0; const shake=(t0,d,a_)=>{if(t>t0&&t<t0+d){const q=(1-(t-t0)/d)*a_; sx+=Math.sin(t*90)*q; sy+=Math.cos(t*77)*q}};
  if(!loop){ shake(b.tYours,0.2,4); shake(b.CD1,0.25,8) }
  cam.setAttribute("transform",`translate(${540+sx},${1000+sy}) scale(${cm.z}) translate(${-cm.fx},${-cm.fy})`);
  const scr=(wx,wy)=>[540+(wx-cm.fx)*cm.z+sx, 1000+(wy-cm.fy)*cm.z+sy];

  // ---------------- HTML overlays ----------------
  let dm=0; if(fbOn) dm=0.35*Math.min(clamp((t-b.fb0)/0.25),clamp((b.fb1-t)/0.2)); if(!loop&&t>=b.fol0&&t<b.ab0) dm=0.28*clamp((t-b.fol0)/0.3);
  if(!loop&&t>=b.abc0&&t<b.sh0) dm=0.42*clamp((t-b.abc0)/0.3); $("dim").style.opacity=dm;
  // world-tracked labels: certificate, wall clock, stand-up door tag, Sandeep's calendar
  const wlab=(id,on,wx,wy,s=1)=>{const e=$(id); e.style.opacity=on?1:0; if(!on) return; const [px,py]=scr(wx,wy); e.style.transform=`translate(${px}px,${py}px) translate(-50%,-50%) scale(${cm.z*s})`};
  {const [cx_]=scr(940,1232), hw=100*0.9*cm.z; wlab("cert",!stall&&!reveal&&cx_-hw>=0&&cx_+hw<=1080,940,1232,0.9)}   // whole plaque in frame, or not at all
  {const clkTxt=t>=b.callEnd&&!loop?"3:44 PM":(reveal?"3:43 PM":(!loop&&t>=b.clk41?"3:41 PM":"3:40 PM")); $("wclk").textContent=clkTxt;
   const pulse=(!loop&&t>b.clk41&&t<b.clk41+0.4)?1+0.15*Math.sin((t-b.clk41)/0.4*Math.PI):((!loop&&t>b.callEnd&&t<b.callEnd+0.4)?1+0.15*Math.sin((t-b.callEnd)/0.4*Math.PI):1);
   wlab("wclk",!stall,410,780,pulse)}
  wlab("doorTag",!stall,840,755,0.95);
  {const on=stall&&t>b.stall+0.1&&t<b.tCal1+0.2; const [wx,wy]=[SDC.st.x-200,985]; wlab("cal",on,wx,wy,0.9*Math.max(0.01,pop(t,b.stall+0.1,0.3)))}
  // text hook (frame 1) + title a beat later
  {const on=loop||t<b.titleOut; $("hook").style.opacity=on?(loop?1:clamp((b.titleOut-t)/0.15)):0; $("hook").style.transform=`rotate(${-1.5+(loop?0:Math.sin(t*3)*0.6)}deg)`;
   const ti=$("title"), ton=!loop&&t>b.titleIn&&t<b.titleOut; ti.style.opacity=ton?clamp((b.titleOut-t)/0.15):0; ti.style.transform=`scale(${Math.max(0.01,back((t-b.titleIn)/0.45))}) rotate(-2deg)`}
  // call card: top-left in the office (moves to the top centre for the reveal); waveform, mute, timer, ended
  {const c=$("call"); const on=loop||(!stall&&!(t>=b.fb0&&t<b.fb1)&&!(t>=b.ab0&&t<b.rev)&&!(t>=b.fol0&&t<b.ab0));
   const x=reveal?290:30, y=reveal?172:440; c.style.opacity=on?1:0; c.style.left=x+"px"; c.style.top=y+"px";
   c.style.transform=`scale(${reveal?0.9:1}) rotate(${reveal?0:-1}deg)`;
   const muted=!loop&&t>=b.mute&&t<b.rev+0.25; $("mute").className=muted?"on":""; $("mute").textContent=""; $("mute").innerHTML=(muted?"🔇":"🎤")+'<div id="muteLbl">'+(t>=b.rev?"UNMUTED":"MUTED")+"</div>";
   const ml=$("muteLbl"); const lblOn=!loop&&((t>=b.mute&&t<b.mute+1.2)||(t>=b.rev+0.25&&t<b.rev+1.2)); ml.style.opacity=lblOn?1:0; ml.style.background=t>=b.rev?"#2E7D32":"#E53935";
   $("mute").style.transform=`scale(${(!loop&&(Math.abs(t-b.mute)<0.12||Math.abs(t-b.rev-0.25)<0.12))?1.25:1})`;
   const ended=!loop&&t>=b.callEnd; c.className=ended?"ended":"";
   const base=(!loop&&t>=b.rev)?300+(t-b.rev):(!loop&&t>=b.clk41)?185+(t-b.clk41):110+T; $("ctm").textContent=mmss(base);
   const bars=$("wave").children, rt=loop?0:talkOf("radhika",t)*(muted?0:1);
   for(let i=0;i<bars.length;i++){const h=6+rt*38*(0.45+0.55*Math.abs(Math.sin(i*1.7+t*13)));  bars[i].style.height=h+"px"; bars[i].style.background=muted?"#B0BEC5":"#7E57C2"}}
  // reference form chip (frame 1 clue): until the flashback; pulses on "thirty LPA"
  {const e=$("form"); const on=loop||t<b.fb0; e.style.opacity=on?(loop?1:clamp((b.fb0-t)/0.15)):0; e.style.left="560px"; e.style.top="440px";
   e.style.transform=`scale(${loop?0.94:0.94*(1+0.06*Math.exp(-Math.max(0,t-b.tOffer)*5)*(t>b.tOffer?1:0))}) rotate(1.2deg)`}
  // REVENGE? button + hold tag (L3)
  {const e=$("rev"); const on=!loop&&t>b.tRev&&t<b.an0; e.style.opacity=on?1:0; e.style.left="60px"; e.style.top="710px";
   e.style.transform=`scale(${Math.max(0.01,pop(t,b.tRev,0.35))*(1+0.04*Math.sin(t*12))}) rotate(-3deg)`; e.style.boxShadow=`0 0 ${20+18*Math.abs(Math.sin(t*6))}px ${8+6*Math.abs(Math.sin(t*6))}px rgba(255,82,82,.75),0 10px 0 #10141E`}
  show("hold",!loop&&t>b.tHold&&t<b.an0,lerp(1.8,1,out((t-b.tHold)/0.2)),`rotate(${-3+Math.sin(t*5)*1.2}deg)`); $("hold").style.top="170px";
  // Ananya's chip (L4)
  {const c=$("cAmma"); const on=!loop&&t>b.tAmma&&t<b.fol0; c.style.opacity=on?1:0; c.style.left="540px"; c.style.top="760px"; c.style.transform=`translate(-50%,0) scale(${Math.max(0.01,pop(t,b.tAmma,0.3))}) rotate(-2deg)`}
  // follow tap (L5)
  const fA=b.fol0, fB=b.fol1+0.1; const fOn=!loop&&t>fA&&t<fB; const fol=$("fol"); fol.style.opacity=fOn?clamp(Math.min((t-fA)/0.2,(fB-t)/0.12)):0; fol.style.top="900px";
  fol.style.transform=`scale(${Math.max(0.01,back((t-fA)/0.4))*(Math.abs(t-b.tFol)<0.1?0.9:1)})`;
  const bF=$("bF"); bF.textContent=t<b.tFol?"+ FOLLOW":"FOLLOWING ✓"; bF.className="btn"+(t<b.tFol?"":" done");
  {const hand=$("tapHand"); const hk=ease((t-fA-0.1)/Math.max(0.3,b.tFol-fA-0.2)); const dip=Math.max(0,1-Math.abs(t-b.tFol)/0.1);
   hand.style.opacity=fOn?clamp(Math.min((t-fA-0.05)/0.15,(fB-t)/0.12)):0; hand.style.transform=`translate(${lerp(900,560,hk)-50}px,${lerp(1320,960,hk)+dip*12}px) rotate(${-8+dip*6}deg)`;
   const rg_=$("ring"), rk=(t-b.tFol)/0.45; rg_.style.opacity=fOn&&rk>0&&rk<1?1-rk:0; rg_.style.left="560px"; rg_.style.top="960px"; rg_.style.transform=`scale(${1+rk*6})`}
  // reveal: "A కాదు… B కాదు…" between the sliding panels, then the two cards stack
  show("neither",!loop&&t>b.rev&&t<b.tDel-0.1,pop(t,b.rev+0.05,0.3),`rotate(-2deg)`); $("neither").style.top="760px";
  show("rc1",reveal&&t>b.tDel-0.1,pop(t,b.tDel-0.1,0.35),`rotate(-1deg)`); $("rc1").style.top="360px";
  show("rc2",reveal&&t>b.tBias-0.05,pop(t,b.tBias-0.05,0.35),`rotate(1deg)`); $("rc2").style.top="490px";
  {const e=$("rc2").querySelector("small"); e.style.opacity=t>b.tAsk-0.1?1:0}
  // clock-wipe to 6:40 PM + the stall clock
  {const e=$("wipe"); const on=!loop&&t>b.wipe0&&t<b.wipe1+0.25; const k=Math.min(clamp((t-b.wipe0)/0.2),clamp((b.wipe1+0.25-t)/0.25)); e.style.opacity=on?1:0;
   e.style.clipPath=`circle(${k*120}% at 50% 45%)`; e.querySelector(".ic").style.transform=`rotate(${(t-b.wipe0)*720}deg)`}
  show("sclk",stall&&t<b.sh0,pop(t,b.wipe1,0.3));
  // A/B/C tiles (L11)
  show("q3",!loop&&t>b.abc0&&t<b.sh0,pop(t,b.abc0,0.35),`rotate(-1.5deg)`);
  ["tA","tB","tC"].forEach((id,i)=>{const t0=i<2?b.abc0+0.1+i*0.18:b.tC; const e=$(id); const on=!loop&&t>t0&&t<b.sh0; e.style.opacity=on?1:0;
    e.style.transform=`translateY(${lerp(-80,0,out((t-t0)/0.3))}px) scale(${Math.max(0.01,pop(t,t0,0.35))*(id==="tC"&&t>b.tC?1+0.03*Math.sin(t*8):1)}) rotate(${[-2,1.5,-1][i]}deg)`;
    if(id==="tC") e.className="tile"+(t>b.tC+0.1?" glow":"")});
  CB2.forEach((_,i)=>{const e=$("cc"+i), t0=b.tCm2+0.05+i*0.22; const v=!loop&&t>t0&&t<b.sh0; e.style.opacity=v?1:0; e.style.transform=`translateY(${-(t-t0)*16}px) scale(${Math.max(0.01,pop(t,t0,0.3))}) rotate(${(i%2?3:-3)}deg)`});
  // share: tag the colleague
  {const shOn=!loop&&t>b.sh0&&t<b.end0+0.1; const sh=$("share"); sh.style.opacity=shOn?clamp(Math.min((t-b.sh0)/0.2,(b.end0+0.1-t)/0.15)):0;
   $("sq").style.transform=`scale(${Math.max(0.01,back((t-b.sh0)/0.4))})`;
   $("cin").innerHTML=t>b.tAt?(t>b.tTag+0.1?'<em>@Office friend 🙃</em> నువ్వే గుర్తొచ్చావ్ 😤':"@"+(t>b.tAt+0.3?"Off":"")):"";
   ["ct1","ct2","ct3"].forEach((id,i)=>{const e=$(id), t0=b.tAt+0.1+i*0.08; e.style.opacity=t>t0?1:0; e.style.transform=`translateY(${lerp(30,0,out((t-t0)/0.25))}px) scale(${id==="ct1"&&Math.abs(t-b.tTag)<0.1?0.94:1})`; e.style.background=id==="ct1"&&t>b.tTag?"#FFF3B0":"#fff"});
   $("ok1").style.opacity=t>b.tTag+0.1?1:0}
  // end card with the follow tap, then the hard cut to frame 1
  {const ec=$("endc"), eOn=!loop&&t>b.end0&&t<b.loop0; ec.style.opacity=eOn?clamp((t-b.end0)/0.12):0;
   $("eF").textContent=t<b.tEF?"FOLLOW @_REELRASAM":"FOLLOWING ✓  @_REELRASAM"; $("eF").style.transform=`scale(${Math.abs(t-b.tEF)<0.1?0.92:1})`; $("eF").style.background=t<b.tEF?"":"#6D6875";
   const eh=$("eHand"), ek=ease((t-b.end0)/Math.max(0.2,b.tEF-b.end0-0.05)), edip=Math.max(0,1-Math.abs(t-b.tEF)/0.1);
   eh.style.opacity=eOn&&t<b.tEF+0.4?1:0; eh.style.transform=`translate(${lerp(900,500,ek)-50}px,${lerp(1300,800,ek)+edip*12}px) scale(${1-0.1*edip}) rotate(-8deg)`}
  // flashes: mute, the flashback in/out, the reveal, the stall cut
  const fl=(t0,d,a_)=>t>t0&&t<t0+d?a_*(1-(t-t0)/d):0;
  $("flash").style.opacity=loop?0:(fl(b.fb0,0.12,0.3)+fl(b.fb1-0.05,0.12,0.25)+fl(b.rev,0.18,0.45)+fl(b.ab0,0.1,0.3));
  // subtitles (… -> ...); during the loop cut only the last phrase
  const sub=$("sub"), L=curLine(t);
  if(loop){ sub.style.opacity=t<E(11)+0.2?1:0; sub.innerHTML=`<span class="who" style="background:${COLORS.gopi}">GOPI</span><br>ఈ call మీకే వస్తే?` }
  else if(L){sub.style.opacity=1; sub.innerHTML=`<span class="who" style="background:${COLORS[L.who]}">${NAMES[L.who]}</span><br>${L.text.replace(/…/g,"...").replace(/ (రా[.!?]?)$/,"&nbsp;$1")}`} else sub.style.opacity=0;
  if(!loop&&t<0.15) sub.style.opacity=0;
}
function show(id,on,s=1,extra=""){const e=$(id); e.style.opacity=on?1:0; if(on) e.style.transform=`${extra} scale(${Math.max(0.01,s)})`}

window.render=function(t){ frame(t) };
