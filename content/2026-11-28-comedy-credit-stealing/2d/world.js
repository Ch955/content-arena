// Office comedy Ep 4 "మీటింగ్‌లో మేనేజర్ మాయ!" — sets + choreography (loaded by ep.html after office_cast.js; built on Ep 2's world.js).
// TWO sets in one world: the office's MEETING ROOM (whiteboard with a plain rising arrow, the meeting table, Ramesh's laptop with
// the Ep 0 'SECONDARY ⭐' sticky on its lid, the manager's plain white mug on the table) and the manager's GLASS CABIN (Ep 1's
// garland on the MANAGER door, his desk + nameplate, the same mug on the desk). The boss is voice only (HTML caller card).
// Beats: villain walk + text hook -> DHOOM 'గైస్!' + limp claps -> 2 AM coding flashback -> head pat + 'RAMESH' chip SHLOOPed into
// TEAM -> night-calls flashback -> 'VISION 💡' + ooooh -> whoosh to the cabin (silent follow tap, speed dial) -> 'I delivered...'
// -> FAAAH on Ramesh's jaw drop -> boss on speaker + KA-CHING BONUS -> the doubt -> finger count 1-2-3 -> punch: '???' flips to
// COMPANY 🏢, FREEZE -> 0.3 s silence -> Ramesh laugh-cries (tears squirting sideways) -> ending card, 3 stamps -> Gopi -> end card.

// comment bubbles: generic names, no real usernames
const CB=[["Ravi","మా TL 😤","#1E88E5",70,1110],["Divya","Senior కొట్టేశాడు 😭","#D81B60",250,1220],["Teja","Appraisal లో చూద్దాం 😂","#2E7D32",110,1330]];
$("cbs").innerHTML=CB.map(([n,g,c,x,y],i)=>`<div class="cb" id="cb${i}" style="left:${x}px;top:${y}px"><b style="color:${c}">${n}</b><i>${g}</i></div>`).join("");

const defs=el("defs",{});
const cam=el("g",{});
applySkin(cam, defs);
const W=el("g",{id:"world"},cam);
const FEET=1700;
const hipAt=s=>FEET-448*s;
const S85=0.85, H85=hipAt(S85);
const SUR_X=-170, RAM_X=110, MG_X=720, MG_P=330;          // meeting room
const RC_X=1640, MC_X=2030;                                // cabin: Ramesh beside the desk, the manager behind it
const BS=0.72, BH=1640-448*BS;                             // back-row colleagues (further back, smaller)
const TABLE_Y=1330;
{const f=el("filter",{id:"bgBlur",x:"-30%",y:"-30%",width:"160%",height:"160%"},defs); el("feGaussianBlur",{stdDeviation:6},f)}

// ===== MEETING ROOM (x -900..1100) =====
el("rect",{x:-1300,y:-900,width:4400,height:2300,fill:"#EAF3F8"},W);
el("rect",{x:-1300,y:1380,width:4400,height:22,fill:"#B7C6D3"},W);
el("rect",{x:-1300,y:1402,width:4400,height:1400,fill:"#CDD7E0"},W);
for(let y=1480;y<2400;y+=110) el("line",{x1:-1300,y1:y,x2:3100,y2:y,stroke:"#BCC8D3","stroke-width":4},W);
// a tall window strip on the left (daylight) + a potted plant
el("rect",{x:-860,y:380,width:300,height:620,rx:10,fill:"#BFE3F5",stroke:"#56616C","stroke-width":12},W);
el("line",{x1:-710,y1:380,x2:-710,y2:1000,stroke:"#56616C","stroke-width":8},W);
[[-830,420,-760,980],[-680,420,-610,980]].forEach(([x1,y1,x2,y2])=>el("polygon",{points:`${x1},${y1} ${x1+26},${y1} ${x2+26},${y2} ${x2},${y2}`,fill:"#FFFFFF",opacity:.4},W));
// the whiteboard: a plain rising arrow, bars, no text, no logos
const WB=el("g",{transform:"translate(560,520)"},W);
el("rect",{x:0,y:0,width:440,height:340,rx:12,fill:"#FFFFFF",stroke:"#78909C","stroke-width":12},WB);
el("rect",{x:40,y:340,width:360,height:14,rx:6,fill:"#90A4AE",stroke:INK,"stroke-width":3},WB);
[[70,250,50],[150,215,85],[230,170,130],[310,110,190]].forEach(([x,y,h])=>el("rect",{x,y,width:54,height:h,rx:4,fill:"#90CAF9",stroke:INK,"stroke-width":3},WB));
el("polyline",{points:"60,280 150,220 230,240 330,110 380,70",fill:"none",stroke:"#2E7D32","stroke-width":12,"stroke-linecap":"round","stroke-linejoin":"round"},WB);
el("path",{d:"M352 60 L398 56 L384 100 Z",fill:"#2E7D32",stroke:"#2E7D32","stroke-width":6,"stroke-linejoin":"round"},WB);
// a wall clock (as on 20 Nov)
{const clockG=el("g",{transform:"translate(-330,600) scale(.8)"},W);
 el("circle",{r:132,fill:"#10141E"},clockG); el("circle",{r:118,fill:"#FFFDF5"},clockG);
 for(let k=0;k<60;k++){const a=k*Math.PI/30, r0=k%5?104:92; el("line",{x1:Math.sin(a)*r0,y1:-Math.cos(a)*r0,x2:Math.sin(a)*110,y2:-Math.cos(a)*110,stroke:INK,"stroke-width":k%5?3:8},clockG)}
 [[12,0],[3,90],[6,180],[9,270]].forEach(([n,a])=>txt(String(n),{x:Math.sin(a*Math.PI/180)*74,y:-Math.cos(a*Math.PI/180)*74+13,"font-family":"Anton","font-size":38,"text-anchor":"middle",fill:INK},clockG));
 el("line",{x1:0,y1:10,x2:0,y2:-58,stroke:INK,"stroke-width":13,"stroke-linecap":"round",transform:"rotate(310)"},clockG);
 el("line",{x1:0,y1:14,x2:0,y2:-90,stroke:INK,"stroke-width":9,"stroke-linecap":"round",transform:"rotate(60)"},clockG); el("circle",{r:9,fill:"#E53935"},clockG)}
// the wall between the meeting room and the cabin
el("rect",{x:1100,y:-900,width:130,height:2300,fill:"#B7C6D3",stroke:INK,"stroke-width":6},W);

// ===== THE MANAGER'S GLASS CABIN (x 1230..2450) =====
el("rect",{x:1230,y:300,width:1220,height:1080,fill:"#D3E9F2",stroke:"#56616C","stroke-width":14},W);
for(let y=330;y<640;y+=34) el("line",{x1:1560,y1:y,x2:2430,y2:y,stroke:"#B0C8D4","stroke-width":10},W);           // blinds (upper half)
[[1700,320,1640,1370],[1950,320,1890,1370],[2250,320,2190,1370]].forEach(([x1,y1,x2,y2])=>el("polygon",{points:`${x1},${y1} ${x1+30},${y1} ${x2+30},${y2} ${x2},${y2}`,fill:"#FFFFFF",opacity:.35},W));
// faint cubicles seen through the glass
for(let x=1600;x<2420;x+=200){ el("rect",{x:x,y:1040,width:110,height:76,rx:6,fill:"#90A4AE",opacity:.45},W) }
el("rect",{x:1560,y:1120,width:870,height:260,fill:"#9FB4C7",opacity:.45},W);
// the door (MANAGER plate, readable) + Ep 1's red garland
const doorP=el("g",{transform:"translate(1260,0)"},W);
el("rect",{x:0,y:430,width:270,height:950,fill:"#C3E2EE",stroke:"#56616C","stroke-width":12},doorP);
el("rect",{x:0,y:640,width:270,height:40,fill:"#FFFFFF",opacity:.6},doorP);
el("rect",{x:226,y:860,width:14,height:110,rx:5,fill:"#90A4AE",stroke:INK,"stroke-width":3},doorP);
el("rect",{x:40,y:500,width:190,height:62,rx:8,fill:"#FFFDF5",stroke:"#3F5A86","stroke-width":5},doorP);
txt("MANAGER",{x:135,y:545,"font-family":"Anton","font-size":38,"letter-spacing":2,"text-anchor":"middle",fill:"#3F5A86"},doorP);
{const gg=el("g",{transform:"translate(135,930) scale(.82)"},doorP); garlandShape(gg)}
el("rect",{x:30,y:700,width:24,height:520,fill:"#FFFFFF",opacity:.5},doorP);
// the manager's big chair behind the desk (Ep 2 look)
const chairG=el("g",{transform:`translate(${MC_X+40},0)`},W);
el("rect",{x:-100,y:1000,width:200,height:330,rx:40,fill:"#263238",stroke:INK,"stroke-width":7},chairG);
el("rect",{x:-80,y:1030,width:160,height:250,rx:30,fill:"#37474F"},chairG);

// ---------- people ----------
const backPeople=el("g",{},W);
const BC=[1,0,2].map(k=>makeColleague(k,backPeople,true));            // green-shirt glasses, pink kurta, orange moustache
const BC_X=[-400,480,900];
const people=el("g",{},W);
const SU=makeSuresh(people,true,{});
const RM=makeRamesh(people,true,{});
const MG=makeManager(people,true,{});
// FAAAH burst (behind Ramesh's head in the cabin)
const burst=el("g",{},W), burstT=el("g",{},W);
{const pts=[]; for(let k=0;k<28;k++){const r=k%2?150:260, a=k*Math.PI/14; pts.push(`${(Math.cos(a)*r).toFixed(0)},${(Math.sin(a)*r*0.86).toFixed(0)}`)}
 el("polygon",{points:pts.join(" "),fill:"#E53935",stroke:INK,"stroke-width":8,"stroke-linejoin":"round"},burst);
 el("polygon",{points:pts.join(" "),fill:"#FF8A65",transform:"scale(.62)"},burst)}
txt("FAAAH!",{x:0,y:0,"font-family":"Anton","font-size":120,"letter-spacing":2,"text-anchor":"middle",fill:"#FFE066",stroke:INK,"stroke-width":10,"paint-order":"stroke","stroke-linejoin":"round"},burstT);
people.parentNode.insertBefore(burst,people);
// the meeting table (in front of everyone in the meeting room): laptop with the SECONDARY sticky, the mug, a notepad
const tableG=el("g",{},W);
el("rect",{x:-760,y:TABLE_Y+30,width:1820,height:420,fill:"#6D4C41",stroke:INK,"stroke-width":7},tableG);
el("path",{d:`M-800 ${TABLE_Y+34} L-760 ${TABLE_Y-6} L1060 ${TABLE_Y-6} L1100 ${TABLE_Y+34} Z`,fill:"#A1887F",stroke:INK,"stroke-width":7,"stroke-linejoin":"round"},tableG);
el("line",{x1:-760,y1:TABLE_Y+80,x2:1060,y2:TABLE_Y+80,stroke:"#5D4037","stroke-width":6},tableG);
{const lp=el("g",{transform:`translate(${RAM_X-70},${TABLE_Y+6})`},tableG);              // Ramesh's laptop (lid back to us)
 el("path",{d:"M-92 0 L-80 -128 L80 -128 L92 0 Z",fill:"#90A4AE",stroke:INK,"stroke-width":5,"stroke-linejoin":"round"},lp);
 el("rect",{x:-104,y:-4,width:208,height:14,rx:5,fill:"#78909C",stroke:INK,"stroke-width":4},lp);
 const sk=el("g",{transform:"translate(-6,-66) rotate(-6)"},lp);
 el("rect",{x:-50,y:-30,width:100,height:60,fill:"#FFF176",stroke:INK,"stroke-width":3},sk);
 txt("SECONDARY",{x:0,y:-2,"font-family":"Anton","font-size":17,"text-anchor":"middle",fill:"#C62828"},sk);
 {const p=[]; for(let k=0;k<10;k++){const r=k%2?4.5:11, a=-Math.PI/2+k*Math.PI/5; p.push(`${(Math.cos(a)*r).toFixed(1)},${(Math.sin(a)*r+17).toFixed(1)}`)} el("polygon",{points:p.join(" "),fill:"#FFB300",stroke:INK,"stroke-width":1.5},sk)}}
{const m=el("g",{transform:`translate(${MG_X+140},${TABLE_Y-36}) scale(1.1)`},tableG); mugShape(m)}    // the manager's mug, set down on the table
{const np=el("g",{transform:`translate(${SUR_X+60},${TABLE_Y+2})`},tableG); el("path",{d:"M-50 0 L-40 -16 L44 -16 L54 0 Z",fill:"#FFFDF5",stroke:INK,"stroke-width":4},np)}
// the cabin desk (in front of the manager) + nameplate + the same mug
const deskG=el("g",{},W);
el("rect",{x:1800,y:TABLE_Y+30,width:520,height:420,fill:"#5D4037",stroke:INK,"stroke-width":7},deskG);
el("path",{d:`M1770 ${TABLE_Y+34} L1800 ${TABLE_Y-6} L2320 ${TABLE_Y-6} L2350 ${TABLE_Y+34} Z`,fill:"#8D6E63",stroke:INK,"stroke-width":7,"stroke-linejoin":"round"},deskG);
{const np=el("g",{transform:`translate(2110,${TABLE_Y-6})`},deskG);                       // standing name block on the desk top (clear of the subtitles)
 el("path",{d:"M-100 0 L-92 -54 L92 -54 L100 0 Z",fill:"#FFE082",stroke:INK,"stroke-width":5,"stroke-linejoin":"round"},np);
 txt("MANAGER",{x:0,y:-12,"font-family":"Anton","font-size":36,"letter-spacing":2,"text-anchor":"middle",fill:"#5D4037"},np)}
{const m=el("g",{transform:`translate(2265,${TABLE_Y-36}) scale(1.1)`},deskG); mugShape(m)}
{const ps=el("g",{transform:`translate(1880,${TABLE_Y-8})`},deskG); el("rect",{x:-22,y:-50,width:44,height:52,rx:6,fill:"#455A64",stroke:INK,"stroke-width":4},ps);
 [[-10,"#E53935"],[2,"#1E88E5"],[12,"#43A047"]].forEach(([dx,c])=>el("line",{x1:dx,y1:-50,x2:dx+dx*0.4,y2:-96,stroke:c,"stroke-width":7,"stroke-linecap":"round"},ps))}
burstT.parentNode.appendChild(burstT);
// the manager's phone (world space, in his right hand)
const phoneG=el("g",{},W), phoneS=el("g",{},phoneG);
el("rect",{x:-26,y:-48,width:52,height:96,rx:10,fill:"#263238",stroke:INK,"stroke-width":5},phoneS);
const phoneScr=el("rect",{x:-19,y:-38,width:38,height:72,rx:4,fill:"#4FC3F7"},phoneS);
const waves=[0,1,2].map(k=>el("path",{d:`M${40+k*22} -30 Q${58+k*26} 0 ${40+k*22} 30`,stroke:"#FFFFFF","stroke-width":7,fill:"none","stroke-linecap":"round",opacity:0},phoneG));
// the VISION lightbulb over his head (world space)
const bulbG=el("g",{},W);
{for(let k=0;k<10;k++){const a=k*Math.PI/5; el("line",{x1:Math.cos(a)*74,y1:Math.sin(a)*74,x2:Math.cos(a)*112,y2:Math.sin(a)*112,stroke:"#FFB300","stroke-width":10,"stroke-linecap":"round"},bulbG)}
 el("circle",{r:58,fill:"#FFF176",stroke:INK,"stroke-width":7},bulbG);
 el("path",{d:"M-18 18 L-8 -6 L0 14 L8 -6 L18 18",stroke:"#F57F17","stroke-width":6,fill:"none","stroke-linejoin":"round"},bulbG);
 el("rect",{x:-28,y:50,width:56,height:40,rx:8,fill:"#90A4AE",stroke:INK,"stroke-width":5},bulbG);
 el("ellipse",{cx:-20,cy:-24,rx:12,ry:18,fill:"#FFFFFF",opacity:.7},bulbG);
 const lbl=el("g",{transform:"translate(0,-150)"},bulbG);
 el("rect",{x:-140,y:-50,width:280,height:92,rx:22,fill:"#10141E",stroke:"#FFE066","stroke-width":6},lbl);
 txt("VISION",{x:0,y:26,"font-family":"Anton","font-size":70,"letter-spacing":4,"text-anchor":"middle",fill:"#FFE066"},lbl)}
// pat lines over Ramesh's head + the tears (world space)
const patFx=el("g",{opacity:0},W); [-1,0,1].forEach(k=>el("path",{d:`M${k*40} -20 L${k*52} -56`,stroke:INK,"stroke-width":7,"stroke-linecap":"round"},patFx));
const tears=[]; for(let k=0;k<22;k++){const g=el("g",{opacity:0},W); el("path",{d:"M0 -16 Q12 0 0 10 Q-12 0 0 -16 Z",fill:"#4FC3F7",stroke:INK,"stroke-width":3},g); tears.push(g)}
// sparkles (screen space: BONUS, the stamps)
const SPK=[]; for(let k=0;k<8;k++){const g=el("g",{opacity:0},fx); const p=[]; for(let j=0;j<8;j++){const r=j%2?7:24, a=j*Math.PI/4-Math.PI/2; p.push(`${(Math.cos(a)*r).toFixed(1)},${(Math.sin(a)*r).toFixed(1)}`)} el("polygon",{points:p.join(" "),fill:"#FFF59D",stroke:"#FFB300","stroke-width":3},g); SPK.push(g)}
// whoosh speed lines (screen space)
const SPD=[]; for(let k=0;k<14;k++) SPD.push(el("rect",{x:0,y:0,width:520,height:10,rx:5,fill:"#FFFFFF",opacity:0},fx));

// ---------- the flashback insets (screen space) ----------
const fxDefs=el("defs",{},fx);
function inset(id,x,y,w,h,bg){const g=el("g",{opacity:0},fx); const cp=el("clipPath",{id},fxDefs); el("rect",{x:0,y:0,width:w,height:h,rx:28},cp);
  el("rect",{x:6,y:14,width:w,height:h,rx:28,fill:"rgba(0,0,0,.45)"},g);
  const inner=el("g",{"clip-path":`url(#${id})`},g); el("rect",{x:0,y:0,width:w,height:h,fill:bg},inner);
  const frame=el("rect",{x:0,y:0,width:w,height:h,rx:28,fill:"none",stroke:"#FFFDF5","stroke-width":10},g);
  return {g,inner,x,y,w,h}}
const IW=470, IH=420;
// 1: Ramesh coding at 2 AM
const F1=inset("fb1",570,300,IW,IH,"#1A2340");
el("circle",{cx:80,cy:80,r:40,fill:"#FFF59D"},F1.inner); el("circle",{cx:98,cy:68,r:36,fill:"#1A2340"},F1.inner);
[[180,50],[300,90],[400,40],[240,140]].forEach(([x,y])=>el("circle",{cx:x,cy:y,r:4,fill:"#FFFFFF",opacity:.8},F1.inner));
const glow1=el("ellipse",{cx:IW/2,cy:300,rx:170,ry:120,fill:"#4FC3F7",opacity:.25},F1.inner);
const RM1=makeRamesh(F1.inner,false,{});
el("rect",{x:0,y:330,width:IW,height:100,fill:"#4E342E",stroke:INK,"stroke-width":5},F1.inner);
{const lp=el("g",{transform:`translate(${IW/2},334)`},F1.inner);
 el("path",{d:"M-80 0 L-70 -100 L70 -100 L80 0 Z",fill:"#78909C",stroke:INK,"stroke-width":5,"stroke-linejoin":"round"},lp);
 el("circle",{cx:0,cy:-50,r:12,fill:"#B0BEC5"},lp)}
{const cl=el("g",{transform:"translate(388,370)"},F1.inner);
 el("rect",{x:-66,y:-30,width:132,height:56,rx:8,fill:"#10141E",stroke:"#455A64","stroke-width":4},cl);
 txt("2:00 AM",{x:0,y:14,"font-family":"Anton","font-size":36,"letter-spacing":2,"text-anchor":"middle",fill:"#FF5252"},cl)}
{const cups=el("g",{transform:"translate(60,330)"},F1.inner); [0,1,2].forEach(k=>{const c=el("g",{transform:`translate(${k*18},${-k*34}) scale(.62)`},cups); mugShape(c)})}
const code1=["{ }","</>","if()","++",";"].map((s,k)=>txt(s,{x:0,y:0,"font-family":"Anton","font-size":34,fill:"#69F0AE","text-anchor":"middle",opacity:0},F1.inner));
// 2: Ramesh juggling three ringing phones at night
const F2=inset("fb2",570,300,IW,IH,"#20183A");
el("circle",{cx:390,cy:80,r:40,fill:"#FFF59D"},F2.inner); el("circle",{cx:372,cy:68,r:36,fill:"#20183A"},F2.inner);
[[60,60],[150,110],[260,40],[440,170]].forEach(([x,y])=>el("circle",{cx:x,cy:y,r:4,fill:"#FFFFFF",opacity:.8},F2.inner));
const RM2=makeRamesh(F2.inner,false,{});
const ph2=[0,1,2].map(k=>{const g=el("g",{},F2.inner); el("rect",{x:-20,y:-36,width:40,height:72,rx:8,fill:["#E53935","#43A047","#1E88E5"][k],stroke:INK,"stroke-width":4},g);
  el("rect",{x:-14,y:-28,width:28,height:50,rx:3,fill:"#E1F5FE"},g);
  [0,1].forEach(j=>el("path",{d:`M${26+j*14} -20 Q${36+j*16} 0 ${26+j*14} 20`,stroke:"#FFE066","stroke-width":5,fill:"none","stroke-linecap":"round"},g));
  [0,1].forEach(j=>el("path",{d:`M${-26-j*14} -20 Q${-36-j*16} 0 ${-26-j*14} 20`,stroke:"#FFE066","stroke-width":5,fill:"none","stroke-linecap":"round"},g)); return g});
{const cl=el("g",{transform:"translate(90,375)"},F2.inner);
 el("rect",{x:-70,y:-30,width:140,height:56,rx:8,fill:"#10141E",stroke:"#455A64","stroke-width":4},cl);
 txt("11:47 PM",{x:0,y:14,"font-family":"Anton","font-size":34,"letter-spacing":2,"text-anchor":"middle",fill:"#FF5252"},cl)}

// ---------- narrator Gopi badge (house look, clay, screen space; Ep 2) ----------
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
const COLORS={gopi:"#F5B347",ramesh:"#9CCBF0",manager:"#F48FB1",boss:"#B0BEC5",suresh:"#C9B8EC"}, NAMES={gopi:"GOPI",ramesh:"RAMESH",manager:"MANAGER",boss:"BOSS 📞",suresh:"SURESH"};
let TL;
const LN=i=>TL.lines.find(l=>l.i===i);
function talkOf(who,t){for(const l of TL.lines){if(l.who!==who)continue;const f=Math.floor((t-l.start)*TL.fps);if(f>=0&&f<l.env.length)return l.env[f]}return 0}
const S=i=>LN(i).start, E=i=>LN(i).start+LN(i).dur, D=i=>LN(i).dur;
const W0=(i,k)=>S(i)+LN(i).fseg[Math.min(k,LN(i).fseg.length-1)][0], W1=(i,k)=>S(i)+LN(i).fseg[Math.min(k,LN(i).fseg.length-1)][1];
const OV=(typeof window!=="undefined"&&window.BEAT_OVERRIDES)||{};
let B=null;
function beats(){ if(B) return B; B={};
  const P=TL.punch;
  // meeting room
  B.walk0=0.0; B.walk1=0.62; B.titleIn=0.95; B.hookOff=W0(0,3)+0.2;
  B.dhoom=W0(0,0)-0.02; B.wide1=W0(0,3)-0.1; B.clap=E(0)+0.02;
  B.app0=E(0)+0.35; B.app1=S(2)-0.05;                                    // the manager walks over to Ramesh during L2
  B.r2=S(1)-0.1; B.fb1a=S(1)+0.45; B.fb1b=E(1)+0.35; B.keys=B.fb1a+0.05; B.name=W0(1,5);
  B.m3=S(2)-0.05; B.pat0=S(2)+0.05; B.shloop=W0(2,1); B.team=W0(2,1)-0.45;
  B.r4=S(3)-0.1; B.fb2a=S(3)+0.3; B.fb2b=E(3)+0.3; B.rings=W0(3,1)-0.05;
  B.m5=S(4)-0.05; B.tap=W0(4,1); B.bulb=W0(4,3)-0.03; B.ooh=E(4)+0.2;
  // whoosh to the cabin
  B.fol0=E(4)+0.2; B.tFol=E(4)+0.7; B.fol1=S(5)+0.5; B.wh0=E(4)+0.55; B.wh1=B.wh0+0.42; B.cab=B.wh0+0.2; B.dial=E(4)+0.9;
  B.m6=S(5)-0.05; B.faaah=E(5)+0.2; B.faaahE=B.faaah+1.1;
  B.boss=S(6)-0.05; B.kaching=E(6)+0.02;
  B.r8=S(7)-0.08; B.bloop=E(7)+0.02; B.m9=S(8)-0.05;
  B.r10=S(9)-0.05; B.k1=W1(9,1)-0.08; B.k2=W1(9,3)-0.08; B.k3=W0(9,4)-0.05; B.roll0=W0(9,4); B.roll1=E(9);
  // the punch block (owner)
  B.m11=S(10)-0.05; B.flip=S(10)+0.12; B.frz=E(10)+P.frz_off; B.sil0=B.frz+P.frz_d; B.sil1=B.sil0+TL.silence;
  B.react=B.sil1; B.trombone=B.sil1; B.sting=B.sil1+0.2; B.laugh=B.sil1+0.5; B.card0=B.sil1+P.react;
  B.stamp1=B.card0+0.05; B.stamp2=B.card0+0.6; B.stamp3=B.card0+1.15; B.card1=S(11)-0.08;
  // Gopi + end card
  B.c11=S(11)-0.1; B.tCm=W0(11,4); B.endSting=E(11)-0.3; B.end0=E(11)+0.02; B.tEF=B.end0+0.45;
  Object.assign(B,OV);
  return B}

const focus=(z,wx,wy,sx=540,sy=1000,r=0)=>({z,fx:wx-(sx-540)/z,fy:wy-(sy-1000)/z,r});
const mixCam=(a,b_,k)=>({z:lerp(a.z,b_.z,k),fx:lerp(a.fx,b_.fx,k),fy:lerp(a.fy,b_.fy,k),r:lerp(a.r||0,b_.r||0,k)});
// subtitles: glue short Telugu words to a neighbour (no orphans), hand-made breaks for the long lines
const subFix=s=>s.replace(/…/g,"...").replace(/(^|\s)(మీ|నా|నీ|ఏం|ఏ|మన|ఒక|ఈ|ఆ|మా)\s/g,"$1$2&nbsp;").replace(/([^\s.!?;])\s([ఀ-౿]{1,2}[.,!?]*)(?=\s|$)/g,"$1&nbsp;$2")
  .replace("I delivered","I&nbsp;delivered").replace("Well done","Well&nbsp;done")
  .replace("అవ్వడానికి మన","అవ్వడానికి<br>మన").replace("ఆ&nbsp;కోడ్ మొత్తం","ఆ&nbsp;కోడ్<br>మొత్తం").replace("కూడా నేనే","కూడా<br>నేనే")
  .replace("విషయం. కానీ","విషయం.<br>కానీ").replace("Finally, I&nbsp;delivered the","Finally, I&nbsp;delivered<br>the")
  .replace("చేశాను... క్రెడిట్","చేశాను...<br>క్రెడిట్").replace("తీసుకున్నారు... మరి","తీసుకున్నారు...<br>మరి").replace("కొట్టేశారు? Comment","కొట్టేశారు?<br>Comment");

function frame(t){
  const b=beats(); T_=t;
  const frozen=t>=b.frz&&t<b.sil1, silent=t>=b.sil0&&t<b.sil1, reactOn=t>=b.react&&t<b.c11, fz1=t>=b.faaah&&t<b.faaahE;
  const T=frozen?b.frz:fz1?b.faaah+(t-b.faaah)*0.2:t>=b.faaahE&&t<b.r8?t-0.88:t;          // slow-mo through the FAAAH, stopped in the freeze
  const cabin=t>=b.cab, card=t>=b.card0&&t<b.card1;
  $("s").style.filter=frozen?`saturate(${lerp(1,0.65,clamp((t-b.frz)/0.08))}) contrast(1.06) brightness(1.03)`:fz1?"saturate(1.25) contrast(1.05)":(t>=b.wh0&&t<b.wh1?`blur(${(6*Math.sin(clamp((t-b.wh0)/(b.wh1-b.wh0))*Math.PI)).toFixed(1)}px)`:"");
  const still=frozen;
  const R=(C,who,x,y,s)=>{resetPose(C,x,y,s,who&&!still?talkOf(who,t):0); C.st.blink=still?0:(((T*0.6+x*0.0013)%3.3)<0.11?1:0); return C.st};
  const m=R(MG,"manager",MG_X,H85,S85), r=R(RM,"ramesh",RAM_X,H85,S85), su=R(SU,"suresh",SUR_X,H85,S85);
  m.look=-0.4; m.smirk=1; m.brow="q";
  r.look=0.6; r.smile=1; r.brow="n"; RM.aim("L",RAM_X-40,H85-60); RM.aim("R",RAM_X+40,H85-60);
  su.itemL="notepad"; su.look=0.6; su.smile=1; su.brow="u"; SU.aim("L",SUR_X-40,H85-140); SU.aim("R",SUR_X+40,H85-80); bobble(su,T,0.35);
  [MG,RM,SU].forEach(c=>c.g.removeAttribute("filter"));
  let phone=null, bulbK=0, patK=0;

  // ================= MEETING ROOM =================
  if(!cabin){
    const k=clamp((T-b.walk0)/(b.walk1-b.walk0)), step=Math.sin(k*Math.PI*2.5);
    m.x=lerp(1010,MG_X,out(k)); m.walk=k<1?step*0.8:0; m.hop=k<1?Math.abs(step)*8:0; m.rot=k<1?step*1.2:0; m.brow="a"; m.look=-0.6; m.hR=[90+step*20,-60];   // villain walk
    if(T>=b.dhoom){ m.brow="u"; m.smile=1; m.smirk=0; m.headRot=-3; m.hR=[150,-250]; m.hL=[-150,-250]; m.spread=1; m.look=-0.5 }   // 'గైస్!' arms up
    if(T>=b.dhoom+0.9){ m.hR=[110,-150]; m.hL=[-110,-150]; m.spread=0 }
    if(T>=b.wide1){ m.spread=1; m.hR=[175,-210]; m.hL=[-175,-210]; m.headRot=-2+Math.sin(T*2)*2; m.smile=1; m.brow="u"; m.look=-0.7 }   // arms wide: 'మన టీమ్ అందరి'
    // the team: gasp on the DHOOM, limp claps (Suresh claps hardest)
    if(T>=b.dhoom&&T<b.dhoom+0.7){ [r,su].forEach(c=>{c.gasp=1; c.wide=1; c.smile=0}) }
    if(t>=b.clap&&t<b.clap+1.0){ const cl=Math.abs(Math.sin((t-b.clap)*Math.PI*6)); SU.aim("L",SUR_X-14+cl*30,H85-230); SU.aim("R",SUR_X+14-cl*30,H85-230); su.itemL=""; su.smile=1; su.shut=1; bobble(su,T,1.4);
      const cl2=Math.abs(Math.sin((t-b.clap)*Math.PI*3)); RM.aim("L",RAM_X-30+cl2*20,H85-150); RM.aim("R",RAM_X+30-cl2*20,H85-150); r.smile=0; r.brow="n"; r.look=0.7 }
    // L2: Ramesh's polite hand, the manager walks over
    if(t>=b.r2){ r.smile=0; r.smirk=0; r.brow="u"; r.look=0.7; RM.aim("R",RAM_X+70,H85-420); if(t>=W0(1,5)){ r.smile=1; r.brow="n" } }
    if(t>=b.app0){ const a=clamp((T-b.app0)/(b.app1-b.app0)), st_=Math.sin(a*Math.PI*4); m.x=lerp(MG_X,MG_P,ease(a)); m.walk=a<1?st_*0.6:0; m.hop=a<1?Math.abs(st_)*5:0;
      m.spread=0; m.hR=[70,-70]; m.hL=[-70,-70]; m.smile=1; m.smirk=0; m.brow="u"; m.look=-0.8; m.headRot=0 }
    // L3: the head pat; 'RAMESH' sucked into TEAM
    if(t>=b.m3&&t<b.r4){ m.smirk=1; m.smile=0; m.brow="q"; m.look=-0.8; m.headRot=-4; patK=t>=b.pat0?1:0;
      const pb=Math.abs(Math.sin((t-b.pat0)*Math.PI*3.2)); const [hx,hy]=RM.headW(); MG.aim("L",hx+20,hy-70*S85-pb*24); r.squash=1-0.025*(1-pb)*patK;
      r.smile=0; r.brow="a"; r.look=0.3; r.lookY=-0.6; RM.aim("R",RAM_X+40,H85-60); m.hR=[70,-80];
      if(t>=b.shloop){ m.spread=1; m.hR=[170,-260]; m.smile=1; m.smirk=0; m.look=0 } }
    // L4: pushing harder
    if(t>=b.r4){ m.x=MG_P; r.brow="a"; r.angry=0.25; r.look=0.7; RM.aim("R",RAM_X+120,H85-260); RM.aim("L",RAM_X-60,H85-240); m.smirk=1; m.brow="q"; m.look=-0.7; m.hR=[70,-70]; m.hL=[-70,-70] }
    // L5: calm, then 'విజన్ నాది!' tapping his temple + the bulb
    if(t>=b.m5){ r.angry=0; r.brow="n"; r.smile=0; r.look=0.7; RM.aim("R",RAM_X+40,H85-60); RM.aim("L",RAM_X-40,H85-60); m.smile=1; m.smirk=0; m.brow="n"; m.look=-0.5; m.hR=[60,-120]; m.hL=[-60,-120];
      if(t>=b.tap){ const [hx,hy]=MG.headW(); const tp=Math.abs(Math.sin((t-b.tap)*Math.PI*2.2)); MG.aim("R",hx+50*S85,hy-38*S85-tp*12); m.smirk=1; m.smile=0; m.brow="q"; m.look=0 }
      if(t>=b.bulb){ m.smile=1; m.smirk=0; m.brow="u"; m.headRot=-4; m.rot=-2; m.hop=Math.max(0,8-(T-b.bulb)*30); bulbK=1 } }
    if(t>=b.ooh){ [r,su].forEach(c=>{c.gasp=1; c.wide=1; c.smile=0; c.smirk=0}); su.nod=0; su.headRot=0 }
  }
  // ================= CABIN =================
  if(cabin){
    m.x=MC_X; r.x=RC_X; su.vis=0;
    const [hx,hy]=MG.headW();
    m.smile=1; m.smirk=0; m.brow="u"; m.look=0.2; m.rot=-2; m.headRot=-4;                                        // chest out, on the phone
    phone={x:MC_X+62*S85,y:H85-392*S85+10,rot:-10,scr:0.6};
    MG.aim("R",phone.x+4,phone.y+30); m.hL=[-70,-70];
    r.smile=0; r.brow="u"; r.look=0.9; r.lookY=-0.1; RM.aim("L",RC_X-40,H85-60); RM.aim("R",RC_X+40,H85-60);
    if(t>=b.m6){ m.hL=[-160,-150]; m.spread=1 }
    if(T>=b.faaah-0.12&&t<b.boss){ r.gasp=1; r.wide=1; r.squash=1+0.04*Math.sin(clamp((T-b.faaah+0.12)/0.25)*Math.PI*0.5); r.brow="u"; RM.aim("L",RC_X-70,H85-250); RM.aim("R",RC_X+70,H85-250) }   // jaw drop
    if(t>=b.boss){ phone={x:MC_X-70,y:H85-150,rot:-80,scr:1}; MG.aim("R",phone.x+10,phone.y+18); m.hL=[-70,-70]; m.spread=0; m.look=-0.2; m.lookY=0.6;   // on speaker, held out flat
      m.smile=1; m.brow="u"; r.gasp=0; r.wide=0; r.sad=1; r.brow="w"; r.look=0.6; r.lookY=0.3 }
    if(t>=b.kaching){ m.laugh=1; m.shut=1; m.hop=Math.max(0,10-(t-b.kaching)*40); r.sad=1 }
    if(t>=b.r8){ m.laugh=0; m.shut=0; m.smile=1; m.look=0.2; phone={x:MC_X+62*S85,y:H85-392*S85+10,rot:-10,scr:0.6}; MG.aim("R",phone.x+4,phone.y+30);
      r.sad=0; r.smile=1; r.wide=1; r.brow="u"; r.look=0.8; RM.aim("R",RC_X+60,H85-470); RM.aim("L",RC_X-40,H85-60) }   // schoolboy hand
    if(t>=b.m9){ phone={x:MC_X+30,y:H85-170,rot:-20,scr:0.15}; MG.aim("R",phone.x+6,phone.y+20); MG.aim("L",MC_X-10,H85-170); m.smile=0; m.angry=0.5; m.brow="a"; m.look=-0.8; m.headRot=3; m.rot=0;
      r.smile=1; RM.aim("R",RC_X+60,H85-440) }      // phone pressed to his chest, annoyed
    if(t>=b.r10){ m.angry=0.2; m.brow="a"; m.look=-0.8; r.smile=0; r.wide=0; r.brow="n"; r.look=0.8; r.lookY=0; RM.aim("L",RC_X-40,H85-60);
      const n=t<b.k1?0:t<b.k2?1:t<b.k3?2:3; RM.aim("R",RC_X+90,H85-330-n*20); r.spread=1; if(t>=b.k3){ r.brow="q"; r.smirk=1 } }   // counting on his fingers
    if(t>=b.m11){ m.angry=0; m.smile=1; m.brow="u"; m.look=-0.6; m.headRot=-6; m.rot=-3; MG.aim("L",MC_X-170,H85-300); m.spread=1;   // proud, straight-faced: good news!
      r.spread=0; r.smirk=0; r.brow="n"; RM.aim("R",RC_X+40,H85-60); if(t>=W0(10,1)){ r.gasp=1; r.wide=1; r.brow="u" } }
    if(reactOn){ // the reaction shot: Ramesh laugh-cries (the owner's 😭😂)
      const rk=(t-b.react); const env=TL.react.env[Math.floor(rk*30)]||0;
      r.gasp=0; r.wide=0; r.laugh=1; r.shut=1; r.brow="w"; r.sad=1; r.talk=0; r.headRot=Math.sin(rk*18)*5; r.hop=Math.abs(Math.sin(rk*16))*6*(0.4+env); r.look=0;
      RM.aim("L",RC_X-60,H85-200+Math.sin(rk*14)*10); RM.aim("R",RC_X+60,H85-200+Math.sin(rk*14+1)*10);
      m.smile=1; m.brow="u"; m.look=-0.6; m.headRot=-6; m.spread=0; MG.aim("L",MC_X-70,H85-70) }
    if(t>=b.c11){ r.laugh=0; r.shut=0; r.sad=1; r.brow="w"; r.look=0.7; r.smile=0; m.smile=1; m.brow="u" }
    if(t>=b.react&&t<b.c11) MG.g.setAttribute("filter","url(#bgBlur)");
  }
  [SU,RM,MG].forEach(c=>c.draw());
  // back-row colleagues (meeting room only): limp claps, the ooooh
  BC.forEach((c,i)=>{const st_=R(c,null,BC_X[i],BH,BS); st_.vis=cabin?0:1; st_.look=i===0?0.6:-0.4; st_.smile=0; st_.brow="n";
    if(t>=b.dhoom&&t<b.dhoom+0.7){ st_.gasp=1; st_.wide=1 }
    if(t>=b.clap&&t<b.clap+1.0){ const cl=Math.abs(Math.sin((t-b.clap)*Math.PI*2.4+i)); c.aim("L",BC_X[i]-20+cl*14,BH-160); c.aim("R",BC_X[i]+20-cl*14,BH-160); st_.smile=0; st_.brow="n"; st_.lookY=0.3 }
    if(t>=b.ooh){ st_.gasp=1; st_.wide=1; st_.brow="u"; st_.headRot=(i-1)*4; st_.look=i===0?0.8:-0.6 }
    c.draw()});
  // props: the phone, its speaker waves, the bulb, the pat lines, the tears
  phoneG.style.display=phone?"":"none";
  if(phone){ phoneG.setAttribute("transform",`translate(${phone.x},${phone.y}) rotate(${phone.rot}) scale(.9)`); phoneScr.setAttribute("fill",phone.scr>0.9?"#B3E5FC":"#4FC3F7");
    const bossT=talkOf("boss",t); waves.forEach((w,k)=>{const on=t>=b.boss&&t<b.r8; w.setAttribute("opacity",on?clamp(bossT*2-k*0.4):0)}) }
  {const [hx,hy]=MG.headW(); bulbG.style.display=bulbK&&t<b.wh0?"":"none"; const k=Math.max(0.01,back((t-b.bulb)/0.3)); bulbG.setAttribute("transform",`translate(${hx},${hy-240*S85}) scale(${0.85*k}) rotate(${Math.sin(t*4)*4})`)}
  {const [hx,hy]=RM.headW(); patFx.setAttribute("opacity",patK&&!cabin&&t<b.shloop?Math.abs(Math.sin((t-b.pat0)*Math.PI*3.2)):0); patFx.setAttribute("transform",`translate(${hx},${hy-96*S85})`)}
  {const on=reactOn&&cabin; const [hx,hy]=RM.headW(); const rs=RM.st.s, rr=RM.st.headRot*Math.PI/180;
   tears.forEach((g_,k)=>{ if(!on){g_.setAttribute("opacity",0);return}
     const side=k%2?1:-1, ph=fract((t-b.react)*1.7+hash(k)*1.0), vx=200+hash(k+5)*120, up=150+hash(k+9)*80;
     const ex=hx+side*21*rs, ey=hy-8*rs; const x=ex+side*vx*ph, y=ey-up*ph+520*ph*ph;
     g_.setAttribute("opacity",ph<0.92?1:0); g_.setAttribute("transform",`translate(${x},${y}) rotate(${side*(60+ph*80)}) scale(${0.9+0.5*ph})`)})}
  // the FAAAH burst behind Ramesh's head
  {const on=t>=b.faaah-0.03&&t<b.faaahE+0.05; const [hx,hy]=RM.headW(); const k=Math.max(0.01,back((t-b.faaah+0.03)/0.18)); burst.style.display=burstT.style.display=on?"":"none";
   burst.setAttribute("transform",`translate(${hx},${hy}) scale(${0.8*k}) rotate(${(t-b.faaah)*30})`);
   burstT.setAttribute("transform",`translate(${hx+10},${hy-170*RM.st.s}) scale(${0.62*k}) rotate(-6)`)}

  // ---------------- flashback insets ----------------
  const fbShow=(F,a,bb)=>{const on=t>=a&&t<bb; F.g.setAttribute("opacity",on?clamp(Math.min((t-a)/0.12,(bb-t)/0.12)):0);
    const k=Math.max(0.01,back((t-a)/0.3)); F.g.setAttribute("transform",`translate(${F.x+F.w/2},${F.y+F.h/2}) scale(${k}) rotate(${-2+Math.sin(t*2)*0.8}) translate(${-F.w/2},${-F.h/2})`); return on};
  if(fbShow(F1,b.fb1a,b.fb1b)){ const r1=R(RM1,null,IW/2,410,0.5); r1.sad=1; r1.brow="w"; r1.look=0; r1.lookY=0.8; r1.blink=((t*0.8)%1.6)<0.2?1:0;
    const ty=Math.sin(t*38), ty2=Math.sin(t*41+1); RM1.aim("L",IW/2-50+ty*10,300+ty2*6); RM1.aim("R",IW/2+50-ty2*10,300+ty*6); RM1.draw();
    glow1.setAttribute("opacity",0.22+0.06*Math.sin(t*20));
    code1.forEach((c_,k)=>{const f=fract(t*0.7+k/5); c_.setAttribute("x",80+k*80+Math.sin(f*6+k)*12); c_.setAttribute("y",300-f*220); c_.setAttribute("opacity",(1-f)*0.9)}) }
  if(fbShow(F2,b.fb2a,b.fb2b)){ const r2=R(RM2,null,IW/2,470,0.5); r2.gasp=1; r2.wide=1; r2.sweat=1; r2.brow="u"; r2.look=Math.sin(t*6)*0.8; r2.lookY=-0.6; r2.headRot=Math.sin(t*6)*5;
    const ang=t*5.5; const pts=[0,1,2].map(k=>[IW/2+Math.cos(ang+k*2.09)*120, 170+Math.sin(ang+k*2.09)*44]);
    RM2.aim("L",pts[0][0],pts[0][1]+60); RM2.aim("R",pts[1][0],pts[1][1]+60); RM2.draw();
    ph2.forEach((g_,k)=>g_.setAttribute("transform",`translate(${pts[k][0]},${pts[k][1]}) rotate(${Math.sin(t*40+k)*10+(k-1)*20})`)) }

  // ---------------- Gopi (narrator badge): the comment ----------------
  const g=GOPI.st; const narOn=t>b.c11&&t<b.end0;
  Object.assign(g,{x:0,y:400*0.55+12,s:0.55,talk:talkOf("gopi",t),blink:((t*0.7)%3.1)<0.12?1:0,wink:0,look:-0.5,lookY:0,brow:"q",smile:1,headRot:Math.sin(t*2.2)*3,item:"",armL:200,armR:160,lenL:115,lenR:115,hop:0,itemRot:0});
  GOPI.draw();
  const bs=narOn?Math.max(0.001,back((t-b.c11)/0.35)):0;
  badge.setAttribute("transform",`translate(930,660) scale(${bs*0.8}) rotate(${Math.sin(t*2)*2})`); badge.style.opacity=narOn?1:0;

  // ---------------- camera ----------------
  const pu=(t0,a_=0.1,k=5)=>t>t0?a_*Math.exp(-(t-t0)*k)*clamp((t-t0)/0.04):0;
  const HY=H85-392*S85;
  const CAB=focus(1.0,1840,1080,540,1000);
  const shots=[
    [0,focus(1.05,900,1060,540,1040,-3)],                                                  // low angle: the villain walk in
    [b.dhoom,focus(1.6+pu(b.dhoom,0.14),MG_X,HY+40,540,920,-2),0.05],                      // DHOOM punch-in on 'గైస్!'
    [b.wide1,focus(0.8,300,1180,540,1060),0.35],                                           // wide: the whole team, arms wide, claps
    [b.r2,focus(1.15,RAM_X+190,1040,540,1000),0.3],                                        // Ramesh's claim, the manager walking over
    [b.m3,focus(1.3,(RAM_X+MG_P)/2,1010,540,990),0.2],                                     // the pat
    [b.shloop,focus(1.38+pu(b.shloop,0.05),(RAM_X+MG_P)/2,1010,540,990),0.05],
    [b.r4,focus(1.15,RAM_X+190,1040,540,1000),0.2],                                        // claim 2
    [b.m5,focus(1.3,MG_P,1020,540,1000),0.2],                                              // 'చాలా మంచి విషయం'
    [b.bulb,focus(1.12+pu(b.bulb,0.06),MG_P,960,540,1040),0.12],                            // VISION
    [b.ooh,focus(0.8,300,1180,540,1060),0.2],                                              // ooooh
    [b.wh0,CAB,b.wh1-b.wh0],                                                               // whoosh to the cabin
    [b.m6,focus(1.12,1850,1060,540,1000),0.4],                                             // 'I delivered...'
    [b.faaah-0.12,focus(2.3,RC_X,HY+30,540,930),0.08],                                     // crash zoom: Ramesh's jaw drop
    [b.faaahE,focus(1.05,1840,1090,540,1010),0.25],                                        // the boss on speaker
    [b.r8,focus(1.25,RC_X+140,1040,540,1000),0.2],                                         // the doubt
    [b.m9,focus(1.4,MC_X-60,1020,540,990),0.12],                                           // 'ఏంటి రమేష్?'
    [b.r10,focus(1.1,1835,1060,540,1060),0.25],                                            // the finger count (chips top-left)
    [b.m11,focus(1.35,MC_X-90,1010,540,980),0.1],                                          // the punch
    [b.react,focus(2.1,RC_X,HY+10,540,900),0.01],                                          // the laugh-cry reaction
    [b.c11,focus(1.0,1840,1080,540,1000),0.01],                                            // Gopi + comment
  ];
  let cm=shots[0][1];
  {let i=0; while(i+1<shots.length&&t>=shots[i+1][0]) i++;
   const [t0,c,tr]=shots[i]; cm=c;
   if(i>0&&tr&&t<t0+tr){ const prev=shots[i-1][1]; cm=mixCam(prev,c,ease((t-t0)/tr)) }}
  if(frozen) cm={...cm,z:cm.z*(1+0.04*clamp((t-b.frz)/0.25))};
  let sx=0,sy=0; const shake=(t0,d,a_)=>{if(t>t0&&t<t0+d){const q=(1-(t-t0)/d)*a_; sx+=Math.sin(t*90)*q; sy+=Math.cos(t*77)*q}};
  shake(b.dhoom,0.45,22); shake(b.faaah,0.3,12); shake(b.frz,0.12,10); shake(b.stamp1,0.2,16); shake(b.stamp2,0.2,16); shake(b.stamp3,0.25,20);
  cam.setAttribute("transform",`translate(${540+sx},${1000+sy}) rotate(${cm.r||0}) scale(${cm.z}) translate(${-cm.fx},${-cm.fy})`);
  const scr=(wx,wy)=>{const r_=(cm.r||0)*Math.PI/180, dx=(wx-cm.fx)*cm.z, dy=(wy-cm.fy)*cm.z; return [540+dx*Math.cos(r_)-dy*Math.sin(r_)+sx, 1000+dx*Math.sin(r_)+dy*Math.cos(r_)+sy]};
  // speed lines in the whoosh
  SPD.forEach((s_,k)=>{const on=t>=b.wh0&&t<b.wh1; const f=clamp((t-b.wh0)/(b.wh1-b.wh0)); s_.setAttribute("opacity",on?0.7*Math.sin(f*Math.PI):0);
    s_.setAttribute("x",1100-f*1700-hash(k)*500); s_.setAttribute("y",200+k*120+hash(k+3)*60); s_.setAttribute("width",300+hash(k+1)*500)});
  // sparkles round the BONUS
  {const [hx,hy]=scr(...MG.headW()); SPK.forEach((s_,i)=>{const on=t>=b.kaching&&t<b.r8; const a=i/8*Math.PI*2+(t-b.kaching)*2.5;
    s_.setAttribute("opacity",on?1-clamp((t-b.r8+0.3)/0.3):0); s_.setAttribute("transform",`translate(${hx+Math.cos(a)*190},${hy+Math.sin(a)*150}) scale(${Math.max(0.01,pop(t,b.kaching+i*0.04,0.25))*0.9}) rotate(${(t-b.kaching)*120})`)})}

  // ---------------- HTML overlays ----------------
  {const dm=$("dim"); let a=0; if(t>=b.c11&&t<b.end0) a=0.5*clamp((t-b.c11)/0.25); dm.style.opacity=a; dm.style.background="#10141E"}
  {const on=t<b.hookOff; $("hook").style.opacity=on?clamp((b.hookOff-t)/0.15):0;
   $("hook").style.transform=`rotate(${-1.5+Math.sin(t*3)*0.6}deg) scale(${t<0.25?1+0.08*Math.sin(t/0.25*Math.PI):1+0.06*Math.exp(-Math.max(0,t-b.dhoom)*8)*(t>b.dhoom?1:0)})`;
   const ti=$("title"), ton=t>b.titleIn&&t<b.hookOff; ti.style.opacity=ton?clamp((b.hookOff-t)/0.15):0; ti.style.transform=`scale(${Math.max(0.01,back((t-b.titleIn)/0.3))}) rotate(-2deg)`}
  const schip=(id,on,px,py,t0,rot,s=1,sx_=1)=>{const e=$(id); if(!on){e.style.opacity=0;return} e.style.opacity=1; e.style.left=px+"px"; e.style.top=py+"px"; e.style.transform=`translate(-50%,-50%) scale(${Math.max(0.01,pop(t,t0,0.3))*s*sx_},${Math.max(0.01,pop(t,t0,0.3))*s}) rotate(${rot}deg)`};
  // 'RAMESH' name chip -> SHLOOP into the TEAM bubble
  {const [rx,ry]=scr(RAM_X,H85-560*S85), [tx,ty]=scr(MG_P+170,H85-600*S85); const tb=[Math.min(Math.max(tx,330),760),Math.max(ty,420)];
   const sk=clamp((t-b.shloop)/0.3), suck=sk*sk;
   schip("cName",!cabin&&t>=b.name&&t<b.shloop+0.3,lerp(rx,tb[0],suck),lerp(Math.max(ry,400),tb[1],suck),b.name,-3,1-0.95*suck,1+1.2*Math.sin(sk*Math.PI));
   const tp=t>=b.shloop+0.25&&t<b.shloop+0.55?1+0.15*Math.sin((t-b.shloop-0.25)/0.3*Math.PI):1;
   schip("cTeam",!cabin&&t>=b.team&&t<b.r4+0.2,tb[0],tb[1],b.team,2,tp)}
  schip("cBonus",cabin&&t>=b.kaching&&t<b.r8,...(()=>{const [hx,hy]=scr(...MG.headW()); return [Math.min(hx+60,860),Math.max(hy-200,420)]})(),b.kaching,-4,1+0.04*Math.sin(t*12));
  // the caller card (boss: voice only)
  {const on=t>=b.dial&&t<b.r10; const e=$("call"); e.style.opacity=on?clamp(Math.min((t-b.dial)/0.15,(b.r10-t)/0.2)):0;
   const glow=t>=b.boss&&t<b.r8; e.style.transform=`scale(${Math.max(0.01,back((t-b.dial)/0.3))*(glow?1+0.05*talkOf("boss",t):1)})`;
   const ct="00:"+String(Math.min(59,Math.floor(t-S(5)+1))).padStart(2,"0"); $("callS").textContent=t<S(5)-0.1?"Calling…":t<b.boss?ct:t<b.r8?"ON SPEAKER 🔊":t<b.m9?ct:"MUTED 🤫";
   e.querySelector(".cc").style.boxShadow=glow?`0 0 ${30+40*talkOf("boss",t)}px #81C784, 0 10px 0 rgba(0,0,0,.45)`:"0 10px 0 rgba(0,0,0,.45)"}
  // the finger count
  [["k1",b.k1],["k2",b.k2],["k3",b.k3]].forEach(([id,t0])=>{const e=$(id); const on=t>=t0&&t<b.react; e.style.opacity=on?1:0;
    const flip=id==="k3"&&t>=b.flip; const fk=id==="k3"?clamp((t-b.flip)/0.2):0;
    e.style.transform=`translateX(${lerp(60,0,out((t-t0)/0.25))}px) scale(${Math.max(0.01,pop(t,t0,0.3))},${id==="k3"&&t>=b.flip-0.1&&t<b.flip+0.1?Math.abs(Math.cos((t-b.flip+0.1)/0.2*Math.PI)):1}) rotate(${id==="k2"?1.5:-1.5}deg)`;
    if(id==="k3"){ $("k3v").textContent=flip?"COMPANY 🏢":"???"; e.className="kc"+(flip?" co":"") }});
  show("frz",frozen,1,"");
  // the ending card: three stamps (owner's words, verbatim)
  {const ec=$("endT"); ec.style.opacity=card?clamp(Math.min((t-b.card0)/0.12,(b.card1-t)/0.12)):0;
   [["st1",b.stamp1,-4],["st2",b.stamp2,3],["st3",b.stamp3,-2]].forEach(([id,t0,rot])=>{const e=$(id); const on=t>=t0; e.style.opacity=on?1:0;
     e.style.transform=`scale(${lerp(2.4,1,out((t-t0)/0.1))*(1+0.02*Math.sin((t-t0)*6))}) rotate(${rot}deg)`})}
  // follow tap (silent): pops in after the ooooh, tapped in the whoosh
  const fA=b.fol0, fB=b.fol1; const fOn=t>fA&&t<fB; const fol=$("fol"); fol.style.opacity=fOn?clamp(Math.min((t-fA)/0.15,(fB-t)/0.1)):0;
  fol.style.transform=`scale(${Math.max(0.01,back((t-fA)/0.3))*(Math.abs(t-b.tFol)<0.1?0.9:1)})`;
  const bF=$("bF"); bF.textContent=t<b.tFol?"+ FOLLOW":"FOLLOWING ✓"; bF.className="btn"+(t<b.tFol?"":" done");
  {const FX=455, FY=1335; const hand=$("tapHand"); const hk=ease((t-fA-0.05)/Math.max(0.3,b.tFol-fA-0.1)); const dip=Math.max(0,1-Math.abs(t-b.tFol)/0.1);
   hand.style.opacity=fOn?clamp(Math.min((t-fA-0.05)/0.12,(fB-t)/0.1)):0; hand.style.transform=`translate(${lerp(1000,FX,hk)-50}px,${lerp(1560,FY,hk)+dip*12}px) rotate(${-8+dip*6}deg)`;
   const rg_=$("ring"), rk=(t-b.tFol)/0.4; rg_.style.opacity=fOn&&rk>0&&rk<1?1-rk:0; rg_.style.left=FX+"px"; rg_.style.top=FY+"px"; rg_.style.transform=`scale(${1+rk*6})`}
  // comment prompt + bubbles
  show("cq",t>b.c11+0.1&&t<b.end0,pop(t,b.c11+0.1,0.35)*(1+0.03*Math.sin(t*10)),`rotate(-1.5deg)`);
  CB.forEach((_,i)=>{const e=$("cb"+i), t0=b.tCm+0.05+i*0.11; const v=t>t0&&t<b.end0; e.style.opacity=v?1:0; e.style.transform=`translateY(${-(t-t0)*14}px) scale(${Math.max(0.01,pop(t,t0,0.3))}) rotate(${(i%2?3:-3)}deg)`});
  // end card
  {const ec=$("endc"), eOn=t>b.end0; ec.style.opacity=eOn?clamp((t-b.end0)/0.12):0;
   $("eF").textContent=t<b.tEF?"FOLLOW @_REELRASAM":"FOLLOWING ✓  @_REELRASAM"; $("eF").style.transform=`scale(${Math.abs(t-b.tEF)<0.1?0.92:1})`; $("eF").style.background=t<b.tEF?"":"#6D6875";
   const eh=$("eHand"), ek=ease((t-b.end0)/Math.max(0.2,b.tEF-b.end0-0.05)), edip=Math.max(0,1-Math.abs(t-b.tEF)/0.1);
   eh.style.opacity=eOn&&t<b.tEF+0.25?clamp((b.tEF+0.25-t)/0.1):0; eh.style.transform=`translate(${lerp(1030,980,ek)-50}px,${lerp(1300,735,ek)+edip*12}px) scale(${1-0.1*edip}) rotate(-8deg)`}
  // flashes
  {const fl=(t0,d,a_)=>t>t0&&t<t0+d?a_*(1-(t-t0)/d):0; let a=0,col="#FFFFFF";
   const add=(t0,d,a_,c)=>{const v=fl(t0,d,a_); if(v>a){a=v;col=c}};
   add(b.dhoom,0.12,0.5,"#FF5A3C"); add(b.bulb,0.1,0.35,"#FFF59D"); add(b.faaah,0.12,0.6,"#E53935"); add(b.kaching,0.1,0.3,"#FFE082"); add(b.frz,0.16,0.85,"#FFFFFF");
   add(b.stamp1,0.08,0.25,"#FFFFFF"); add(b.stamp2,0.08,0.25,"#FFFFFF"); add(b.stamp3,0.1,0.35,"#FFFFFF");
   $("flash").style.opacity=a; $("flash").style.background=col}
  // subtitles (the punch stays up through the freeze + the silence; no subtitle for the laugh-cry or the card)
  const sub=$("sub"); const L=TL.lines.find(l=>t>=l.start-0.1&&t<(l.i===10?b.sil1:l.start+l.dur+0.25));
  if(L&&!(t>b.end0)&&!card){sub.style.opacity=1; sub.innerHTML=`<span class="who" style="background:${COLORS[L.who]}">${NAMES[L.who]}</span><br>${subFix(L.text)}`} else sub.style.opacity=0;
}
function show(id,on,s=1,extra=""){const e=$(id); e.style.opacity=on?1:0; if(on) e.style.transform=`${extra} scale(${Math.max(0.01,s)})`}

window.render=function(t){ frame(t) };
