// Office comedy Ep 3 "ఆఫీస్‌లో ఫేవరెట్ ఎవరు?" — sets + choreography (loaded by ep.html after office_cast.js). Built on Ep 2's world.js.
// TWO sets: (1) the manager's cabin from INSIDE (new, x 2480..4500): warm wall, blinds, a plain certificate (no text), the desk
// with a front-facing MANAGER nameplate, Ep 2's big MANAGER chair behind it, the glass door on the left (no text on its inside
// face, so nothing reads mirrored; it shuts on Ramesh's face). (2) the same open office as Ep 0-2 (cubicles, wall clock, the cabin
// from outside with its MANAGER plate + Ep 1's red garland, Ramesh's 'SECONDARY' sticky, the water cooler).
// Beats: hook (pink glow + hearts round Suresh) -> L3 Ramesh barges in, DHOOM -> brush-off chip -> sepia calendar flashback
// with 2 'తర్వాత' stamps -> guru sermon, the door shuts on Ramesh's face (silent follow tap) -> whip pan to the water cooler ->
// L7-L9 -> L10 the wedding checklist unrolls down the aisle, FAAAH (Ramesh's jaw drops) -> L11 punch -> FREEZE -> 0.3 s silence ->
// 1.6 s reaction (Suresh blinks twice, then nods proudly with a plain wedding card) -> ENDING CARD (owner's words) -> Gopi tag ->
// end card 'Series: Office Politics · Ep 3'. Props: Ramesh's APPRAISAL 2026 file stays in his hands in both sets; the manager's
// white mug in his left hand; Suresh's notepad until he swaps it for the checklist.
const defs=el("defs",{});
const cam=el("g",{});
applySkin(cam, defs);
const W=el("g",{id:"world"},cam);
const FEET=1700;
const hipAt=s=>FEET-448*s;
const S85=0.85, H85=hipAt(S85);
const HY=H85-392*S85;                                   // head height (standing, s 0.85)
const COOL_X=150, DOOR_X=1180;                          // office: water cooler, the cabin door (outside)
const RM_O=400, SU_O=680;                               // office: Ramesh + Suresh at the cooler
const CDOOR=2840, MG_C=3480, SU_C=3690, RM_C=3190;      // cabin: door hinge x, manager, Suresh, Ramesh
// ===== OPEN OFFICE (x -900..2300) =====
el("rect",{x:-1100,y:-900,width:3600,height:2300,fill:"#EAF3F8"},W);
el("rect",{x:-1100,y:1380,width:3600,height:22,fill:"#B7C6D3"},W);
el("rect",{x:-1100,y:1402,width:3600,height:1400,fill:"#CDD7E0"},W);
for(let k=0;k<16;k++) el("line",{x1:-1100+k*260,y1:1402,x2:-1600+k*360,y2:2600,stroke:"#BCC8D3","stroke-width":5},W);
for(let y=1480;y<2400;y+=110) el("line",{x1:-1100,y1:y,x2:2500,y2:y,stroke:"#BCC8D3","stroke-width":4},W);
// Ep 1 leftover: a paper star on a string, drooping (static)
const starG=el("g",{transform:"translate(-560,1250) rotate(160) scale(.7)"},W);
el("line",{x1:0,y1:-160,x2:0,y2:-62,stroke:INK,"stroke-width":3},starG);
{const p=[]; for(let k=0;k<10;k++){const r=k%2?26:64, a=-Math.PI/2+k*Math.PI/5; p.push(`${(Math.cos(a)*r).toFixed(1)},${(Math.sin(a)*r).toFixed(1)}`)}
 el("polygon",{points:p.join(" "),fill:"#FFD54F",stroke:INK,"stroke-width":5,"stroke-linejoin":"round"},starG)}
// the big wall clock (as on 20 Nov)
const CLX=-330, CLY=560;
const clockG=el("g",{transform:`translate(${CLX},${CLY})`},W);
el("circle",{r:132,fill:"#10141E"},clockG); el("circle",{r:118,fill:"#FFFDF5"},clockG);
for(let k=0;k<60;k++){const a=k*Math.PI/30, r0=k%5?104:92; el("line",{x1:Math.sin(a)*r0,y1:-Math.cos(a)*r0,x2:Math.sin(a)*110,y2:-Math.cos(a)*110,stroke:INK,"stroke-width":k%5?3:8},clockG)}
[[12,0],[3,90],[6,180],[9,270]].forEach(([n,a])=>txt(String(n),{x:Math.sin(a*Math.PI/180)*74,y:-Math.cos(a*Math.PI/180)*74+13,"font-family":"Anton","font-size":38,"text-anchor":"middle",fill:INK},clockG));
el("line",{x1:0,y1:10,x2:0,y2:-58,stroke:INK,"stroke-width":13,"stroke-linecap":"round",transform:"rotate(150)"},clockG);
const mHand=el("line",{x1:0,y1:14,x2:0,y2:-90,stroke:INK,"stroke-width":9,"stroke-linecap":"round"},clockG);
el("circle",{r:9,fill:"#E53935"},clockG);
// back row of cubicles: monitors, then the colleagues' heads (S1 snicker), then the partitions
const cub=el("g",{},W), backPeople=el("g",{},W), cubP=el("g",{},W);
for(let x=-700;x<1000;x+=250){ el("rect",{x:x+70,y:1030,width:120,height:84,rx:6,fill:"#37474F",stroke:INK,"stroke-width":4},cub); el("rect",{x:x+80,y:1040,width:100,height:62,rx:3,fill:"#90CAF9"},cub); el("rect",{x:x+120,y:1114,width:20,height:26,fill:"#546E7A"},cub) }
el("rect",{x:-700,y:1140,width:1700,height:240,fill:"#9FB4C7",stroke:INK,"stroke-width":5},cubP);
el("rect",{x:-700,y:1132,width:1700,height:16,rx:6,fill:"#7F96AB",stroke:INK,"stroke-width":4},cubP);
for(let x=-450;x<1000;x+=250) el("rect",{x:x-5,y:1140,width:10,height:240,fill:"#7F96AB"},cubP);
// Ramesh's monitor on the back row: the 'SECONDARY ⭐' sticky (Ep 0 callback) + his helmet on the partition
const sticky=el("g",{transform:"translate(-70,1068) rotate(8) scale(.62)"},cubP);
el("rect",{x:-56,y:-34,width:112,height:68,fill:"#FFF176",stroke:INK,"stroke-width":3},sticky);
txt("SECONDARY",{x:0,y:-2,"font-family":"Anton","font-size":20,"text-anchor":"middle",fill:"#C62828"},sticky);
{const p=[]; for(let k=0;k<10;k++){const r=k%2?5:12, a=-Math.PI/2+k*Math.PI/5; p.push(`${(Math.cos(a)*r).toFixed(1)},${(Math.sin(a)*r+20).toFixed(1)}`)} el("polygon",{points:p.join(" "),fill:"#FFB300",stroke:INK,"stroke-width":1.5},sticky)}
{const h=el("g",{transform:"translate(-330,1128)"},cubP); helmetShape(h,0.8)}
// the manager's glass cabin + door (plate outside: readable, never mirrored)
el("rect",{x:1080,y:300,width:900,height:1080,fill:"#D3E9F2",stroke:"#56616C","stroke-width":14},W);
el("rect",{x:1500,y:1040,width:380,height:22,fill:"#B9A58A",stroke:"#7E6A50","stroke-width":3},W);
el("rect",{x:1600,y:880,width:12,height:160,fill:"#7E6A50"},W); el("circle",{cx:1606,cy:860,r:60,fill:"#81C784",opacity:.8},W);
[[1520,320,1460,1370],[1700,320,1640,1370],[1880,320,1820,1370]].forEach(([x1,y1,x2,y2])=>el("polygon",{points:`${x1},${y1} ${x1+30},${y1} ${x2+30},${y2} ${x2},${y2}`,fill:"#FFFFFF",opacity:.35},W));
const doorG=el("g",{transform:"translate(1180,0)"},W);
const doorP=el("g",{},doorG);
el("rect",{x:0,y:430,width:270,height:950,fill:"#C3E2EE",stroke:"#56616C","stroke-width":12},doorP);
el("rect",{x:0,y:640,width:270,height:40,fill:"#FFFFFF",opacity:.6},doorP);
el("rect",{x:226,y:860,width:14,height:110,rx:5,fill:"#90A4AE",stroke:INK,"stroke-width":3},doorP);
el("rect",{x:40,y:500,width:190,height:62,rx:8,fill:"#FFFDF5",stroke:"#3F5A86","stroke-width":5},doorP);
txt("MANAGER",{x:135,y:545,"font-family":"Anton","font-size":38,"letter-spacing":2,"text-anchor":"middle",fill:"#3F5A86"},doorP);
// Ep 1 leftover: the red felicitation garland hung on the cabin door (below the plate)
{const gg=el("g",{transform:"translate(135,930) scale(.82)"},doorP); garlandShape(gg)}
const doorShine=el("rect",{x:30,y:700,width:24,height:520,fill:"#FFFFFF",opacity:.5},doorP);
W.appendChild(doorG);
// ===== THE CABIN, INSIDE (x 2480..4500) =====
el("rect",{x:2480,y:-900,width:2100,height:2300,fill:"#F1E4D0"},W);
el("rect",{x:2480,y:1170,width:2100,height:210,fill:"#E3CFB2"},W);
el("rect",{x:2480,y:1160,width:2100,height:14,fill:"#C9AE88"},W);
el("rect",{x:2480,y:1380,width:2100,height:22,fill:"#A88B66"},W);
el("rect",{x:2480,y:1402,width:2100,height:1400,fill:"#D2BC9A"},W);
for(let y=1470;y<2400;y+=95) el("line",{x1:2480,y1:y,x2:4580,y2:y,stroke:"#C2A982","stroke-width":4},W);
for(let k=0;k<12;k++) el("line",{x1:2480+k*190,y1:1402,x2:2280+k*230,y2:2600,stroke:"#C2A982","stroke-width":3},W);
// window + blinds
el("rect",{x:3380,y:440,width:520,height:440,fill:"#BFE3F5",stroke:"#56616C","stroke-width":12},W);
for(let y=470;y<870;y+=34) el("rect",{x:3392,y:y,width:496,height:20,fill:"#ECEFF1",stroke:"#B0BEC5","stroke-width":2},W);
el("line",{x1:3880,y1:452,x2:3880,y2:760,stroke:"#90A4AE","stroke-width":4},W);
// a plain framed certificate (no text) + a wall plant shelf
el("rect",{x:3070,y:560,width:190,height:150,fill:"#6D4C41",stroke:INK,"stroke-width":5},W);
el("rect",{x:3086,y:576,width:158,height:118,fill:"#FFF8E1"},W);
[602,626,650].forEach((y,i)=>el("line",{x1:3108,y1:y,x2:3222-(i===2?40:0),y2:y,stroke:"#B0A48A","stroke-width":5},W));
el("circle",{cx:3214,cy:668,r:15,fill:"#FFC107",stroke:"#B8860B","stroke-width":3},W);
// the glass door frame (left wall): an opening onto the open office
el("rect",{x:CDOOR-20,y:420,width:300,height:960,fill:"#56616C"},W);
el("rect",{x:CDOOR,y:440,width:260,height:940,fill:"#EAF3F8"},W);
el("rect",{x:CDOOR,y:1140,width:260,height:240,fill:"#9FB4C7"},W);           // a cubicle partition seen through the doorway
el("rect",{x:CDOOR,y:1132,width:260,height:14,fill:"#7F96AB"},W);
el("rect",{x:CDOOR+60,y:1040,width:110,height:80,rx:6,fill:"#37474F"},W); el("rect",{x:CDOOR+70,y:1050,width:90,height:58,fill:"#90CAF9"},W);
// Ep 2's big MANAGER chair, now back behind his desk
const chairG=el("g",{transform:"translate(4230,-40)"},W);   // its MANAGER plate stays out of every cabin shot (never cut at the frame edge)
el("rect",{x:-100,y:1010,width:200,height:330,rx:40,fill:"#263238",stroke:INK,"stroke-width":7},chairG);
el("rect",{x:-80,y:1040,width:160,height:250,rx:30,fill:"#37474F"},chairG);
el("rect",{x:-62,y:1080,width:124,height:40,rx:8,fill:"#FFFDF5",stroke:INK,"stroke-width":4},chairG);
txt("MANAGER",{x:0,y:1111,"font-family":"Anton","font-size":30,"letter-spacing":1,"text-anchor":"middle",fill:"#3F5A86"},chairG);
// the desk (behind the people: they stand to its left)
el("rect",{x:3840,y:1230,width:460,height:40,rx:8,fill:"#8D6E63",stroke:INK,"stroke-width":7},W);
el("rect",{x:3860,y:1270,width:420,height:330,fill:"#795548",stroke:INK,"stroke-width":7},W);
el("rect",{x:3890,y:1300,width:360,height:120,rx:8,fill:"#6D4C41"},W);
el("rect",{x:3930,y:1196,width:110,height:34,rx:6,fill:"#FFFFFF",stroke:INK,"stroke-width":4},W);   // a closed laptop (plain, no logo)
[0,1,2,3].forEach(k=>el("rect",{x:4150,y:1200-k*18,width:120,height:16,rx:3,fill:["#E57373","#64B5F6","#FFD54F","#81C784"][k],stroke:INK,"stroke-width":3},W));   // a file pile
// pink 'favourite' glow behind Suresh + floating hearts (world space)
const glow=el("g",{},W);
el("circle",{r:300,fill:"#F8BBD0",opacity:.45},glow); el("circle",{r:200,fill:"#F48FB1",opacity:.35},glow);
const HEART="M0 10 C-26 -8 -22 -32 0 -20 C22 -32 26 -8 0 10 Z";
// the water cooler (Game 2: the DONK)
const coolG=el("g",{},W), coolB=el("g",{},coolG);
el("rect",{x:-72,y:1390,width:144,height:300,rx:14,fill:"#ECEFF1",stroke:INK,"stroke-width":6},coolB);
el("rect",{x:-50,y:1440,width:100,height:70,rx:8,fill:"#CFD8DC",stroke:INK,"stroke-width":4},coolB);
el("rect",{x:-18,y:1452,width:12,height:28,rx:3,fill:"#1E88E5",stroke:INK,"stroke-width":2},coolB); el("rect",{x:6,y:1452,width:12,height:28,rx:3,fill:"#E53935",stroke:INK,"stroke-width":2},coolB);
el("path",{d:"M-44 1390 L-36 1360 L36 1360 L44 1390 Z",fill:"#B0BEC5",stroke:INK,"stroke-width":5},coolB);
const bottle=el("g",{},coolB);
el("path",{d:"M-58 1360 L-58 1230 Q-58 1196 -24 1190 L-18 1160 L18 1160 L24 1190 Q58 1196 58 1230 L58 1360 Z",fill:"#81D4FA",stroke:INK,"stroke-width":6,opacity:.95},bottle);
el("path",{d:"M-58 1300 L58 1300 L58 1360 L-58 1360 Z",fill:"#4FC3F7",opacity:.8},bottle);
el("rect",{x:-40,y:1220,width:14,height:110,rx:7,fill:"#FFFFFF",opacity:.6},bottle);
const bub=[0,1,2].map(k=>el("circle",{cx:0,cy:1330,r:8,fill:"#FFFFFF",stroke:"#4FC3F7","stroke-width":2,opacity:0},coolB));
const hearts=el("g",{},W); const HRT=[]; for(let k=0;k<7;k++){const g=el("g",{},hearts); el("path",{d:HEART,fill:["#EC407A","#F06292","#E91E63"][k%3],stroke:INK,"stroke-width":3},g); HRT.push(g)}
// guru rays (L6, behind the manager) + the FAAAH burst (behind Ramesh)
const rays=el("g",{},W);
for(let k=0;k<18;k++){const a=k*Math.PI/9; el("polygon",{points:`0,0 ${Math.cos(a-0.07)*900},${Math.sin(a-0.07)*900} ${Math.cos(a+0.07)*900},${Math.sin(a+0.07)*900}`,fill:k%2?"#FFE082":"#FFF59D",opacity:.7},rays)}
const burst=el("g",{},W);
{const pts=[]; for(let k=0;k<28;k++){const r=k%2?150:260, a=k*Math.PI/14; pts.push(`${(Math.cos(a)*r).toFixed(0)},${(Math.sin(a)*r*0.86).toFixed(0)}`)}
 el("polygon",{points:pts.join(" "),fill:"#E53935",stroke:INK,"stroke-width":8,"stroke-linejoin":"round"},burst);
 el("polygon",{points:pts.join(" "),fill:"#FF8A65",transform:"scale(.62)"},burst)}
// ---------- people ----------
const people=el("g",{},W);
const BC=[0,1,2].map(k=>makeColleague(k,backPeople,false));
const SU=makeSuresh(people,true,{});
const RM=makeRamesh(people,true,{});
const MG=makeManager(people,true,{});
people.parentNode.insertBefore(coolG,people); people.parentNode.insertBefore(rays,people); people.parentNode.insertBefore(burst,people); people.parentNode.insertBefore(glow,people);
const burstT=el("g",{},W);
txt("FAAAH!",{x:0,y:0,"font-family":"Anton","font-size":120,"letter-spacing":2,"text-anchor":"middle",fill:"#FFE066",stroke:INK,"stroke-width":10,"paint-order":"stroke","stroke-linejoin":"round"},burstT);
W.appendChild(hearts);
// Ramesh's jaw drop (FAAAH): a big open mouth over his face (world space)
const jaw=el("ellipse",{rx:16,ry:20,fill:"#5A1E1E",stroke:"#7A3A30","stroke-width":4,opacity:0},W);
// the cabin's glass door panel (front layer: it shuts IN FRONT of Ramesh). No text on this inside face.
const panelG=el("g",{},W), panelP=el("g",{},panelG);
el("rect",{x:0,y:440,width:260,height:940,fill:"#B3DAEA",opacity:.55,stroke:"#56616C","stroke-width":12},panelP);
el("rect",{x:30,y:700,width:22,height:520,fill:"#FFFFFF",opacity:.55},panelP);
el("rect",{x:200,y:860,width:14,height:110,rx:5,fill:"#90A4AE",stroke:INK,"stroke-width":3},panelP);
// ---------- props held by the cast (in the character's local space: drawn in front of the body) ----------
function fileShape(p){   // Ramesh's thick appraisal file
  [14,9,4].forEach(d=>el("rect",{x:-78+d,y:-96+d,width:156,height:192,rx:6,fill:"#FFFDF5",stroke:INK,"stroke-width":3},p));
  el("rect",{x:-80,y:-100,width:156,height:192,rx:8,fill:"#E8B04A",stroke:INK,"stroke-width":5},p);
  el("rect",{x:-62,y:-70,width:120,height:74,rx:6,fill:"#FFFDF5",stroke:INK,"stroke-width":3},p);
  txt("APPRAISAL",{x:-2,y:-38,"font-family":"Anton","font-size":24,"letter-spacing":1,"text-anchor":"middle",fill:"#10141E"},p);
  txt("2026",{x:-2,y:-8,"font-family":"Anton","font-size":26,"letter-spacing":1,"text-anchor":"middle",fill:"#C62828"},p)}
const fileG=el("g",{},RM.g); fileShape(fileG);
const CHK=(p,x,y,s=1)=>el("path",{d:`M${x} ${y} l${10*s} ${11*s} l${20*s} ${-24*s}`,stroke:"#2E7D32","stroke-width":7*s,fill:"none","stroke-linecap":"round","stroke-linejoin":"round"},p);
// the wedding checklist: top roll in both hands, the paper hangs to the floor, then runs along the floor (generic items, no brands)
const scrollG=el("g",{},SU.g);
const scPaper=el("rect",{x:-150,y:-210,width:300,height:10,fill:"#FFFDF5",stroke:INK,"stroke-width":4},scrollG);
const scFloor=el("path",{d:"",fill:"#FFFDF5",stroke:INK,"stroke-width":4},scrollG);
const scFloorL=el("g",{},scrollG);
const ROWS=[["కొడుకు పెళ్లి","te","#C2185B"],["Catering","en"],["Mehendi","en"],["Band","en"],["Return gifts","en"],["Decoration","en"]];
const scRows=ROWS.map(([s,k,c],i)=>{const g=el("g",{},scrollG); const y=-150+i*92;
  txt(s,{x:-104,y:y+14,"font-family":k==="te"?"Rama":"InterB","font-weight":k==="te"?"normal":800,"font-size":k==="te"?40:38,"letter-spacing":0,fill:c||"#10141E"},g); CHK(g,-140,y-4,1); return g});
const scEnd=el("g",{},scrollG); el("ellipse",{cx:0,cy:0,rx:22,ry:38,fill:"#F5EBD0",stroke:INK,"stroke-width":4},scEnd); el("ellipse",{cx:0,cy:0,rx:8,ry:14,fill:"#D7C9A6"},scEnd);
const scTop=el("rect",{x:-162,y:-232,width:324,height:36,rx:18,fill:"#F5EBD0",stroke:INK,"stroke-width":5},scrollG);
// the plain paper wedding card (reaction shot): two rings + little hearts, no text
const cardG=el("g",{},SU.g);
el("rect",{x:-70,y:-52,width:140,height:104,rx:8,fill:"#FFF3E0",stroke:"#C62828","stroke-width":6},cardG);
el("rect",{x:-58,y:-40,width:116,height:80,rx:5,fill:"none",stroke:"#FFB300","stroke-width":3},cardG);
el("circle",{cx:-12,cy:4,r:20,fill:"none",stroke:"#FFB300","stroke-width":7},cardG); el("circle",{cx:12,cy:4,r:20,fill:"none",stroke:"#FFB300","stroke-width":7},cardG);
el("path",{d:"M0 -28 C-6 -34 -12 -30 0 -22 C12 -30 6 -34 0 -28 Z",fill:"#E91E63"},cardG);
// sparkles (screen space)
const SPK=[]; for(let k=0;k<6;k++){const g=el("g",{opacity:0},fx); const p=[]; for(let j=0;j<8;j++){const r=j%2?7:24, a=j*Math.PI/4-Math.PI/2; p.push(`${(Math.cos(a)*r).toFixed(1)},${(Math.sin(a)*r).toFixed(1)}`)} el("polygon",{points:p.join(" "),fill:"#FFF59D",stroke:"#FFB300","stroke-width":3},g); SPK.push(g)}
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
let TL;
const LN=i=>TL.lines.find(l=>l.i===i);
function talkOf(who,t){for(const l of TL.lines){if(l.who!==who)continue;const f=Math.floor((t-l.start)*TL.fps);if(f>=0&&f<l.env.length)return l.env[f]}return 0}
function curLine(t){return TL.lines.find(l=>t>=l.start-0.1&&t<l.start+l.dur+0.25)}
const S=i=>LN(i).start, E=i=>LN(i).start+LN(i).dur, D=i=>LN(i).dur;
const W0=(i,k)=>S(i)+LN(i).fseg[Math.min(k,LN(i).fseg.length-1)][0], W1=(i,k)=>S(i)+LN(i).fseg[Math.min(k,LN(i).fseg.length-1)][1];
function atIn(i,k,frac){return W0(i,k)+(W1(i,k)-W0(i,k))*frac}

// ---------- timeline ----------
const COLORS={gopi:"#F5B347",ramesh:"#9CCBF0",manager:"#F48FB1",suresh:"#C9B8EC"}, NAMES={gopi:"GOPI",ramesh:"RAMESH",manager:"MANAGER",suresh:"SURESH"};
const OV=(typeof window!=="undefined"&&window.BEAT_OVERRIDES)||{};
let B=null;
function beats(){ if(B) return B; B={};
  // cabin: the favourite (hook), Ramesh's ask (DHOOM), the brush-off, the flashback, the sermon, the door
  B.hookOut=W0(0,3)-0.1; B.hp=atIn(0,4,0.3); B.boing=E(0)+0.02; B.sparkle=E(1)+0.02;
  B.door=S(2)-0.62; B.dhoom=W1(2,1)+0.05;
  B.m4=S(3)-0.05; B.swat=atIn(3,2,0.45); B.later=W0(3,3); B.bloop=E(3)+0.03;
  B.r5=S(4)-0.05; B.cal0=W0(4,1)-0.05; B.stamp1=E(4)+0.05; B.flip=E(4)+0.4; B.stamp2=E(4)+0.62; B.cal1=S(5)-0.05;
  B.m6=S(5)-0.05; B.chime=W0(5,2); B.push=E(5); B.slam=E(5)+0.2; B.fol0=E(5)+0.2; B.tFol=E(5)+0.7; B.whip=E(5)+1.0; B.fol1=S(6)-0.25;
  // office: the water cooler, the twist, FAAAH, the punch, FREEZE, silence, reaction, ending card
  B.suIn=B.whip+0.15; B.grab=S(6)-0.12; B.tick0=S(6); B.tick1=E(6);
  B.roll0=W0(7,1); B.dun=E(8)+0.02;
  B.scr0=S(9)+0.15; B.unroll=W0(9,1); B.faaah=E(9)+0.3; B.faaahE=B.faaah+1.1; B.dhol=E(9)+1.5;
  B.r11=S(10)-0.05; B.frz=E(10)+0.1; B.sil0=E(10)+0.5; B.sil1=E(10)+0.8; B.re0=B.sil1; B.blink1=B.re0+0.12; B.blink2=B.re0+0.42; B.nod0=B.re0+0.7;
  B.toot=B.re0; B.sting=B.re0+0.2; B.laugh=B.re0+0.3; B.card=E(10)+2.4;
  B.s12=S(11)-0.1; B.tTag=W0(11,1)+0.3; B.endSting=E(11)+0.3; B.end0=E(11)+0.8; B.tEF=B.end0+0.6;
  Object.assign(B,OV);
  return B}

const focus=(z,wx,wy,sx=540,sy=1000,r=0)=>({z,fx:wx-(sx-540)/z,fy:wy-(sy-1000)/z,r});
const mixCam=(a,b_,k)=>({z:lerp(a.z,b_.z,k),fx:lerp(a.fx,b_.fx,k),fy:lerp(a.fy,b_.fy,k),r:lerp(a.r||0,b_.r||0,k)});
// keep short Telugu words with a neighbour (never orphan one on its own line) + hand-made breaks for the long lines
const subFix=s=>s.replace(/…/g,"...").replace(/(^|\s)(మీ|నా|నీ|ఏం|ఏ|మన|ఒక|ఈ|ఆ|మా)\s/g,"$1$2&nbsp;").replace(/([^\s.!?;])\s([ఀ-౿]{1,2}[.,!?]*)(?=\s|$)/g,"$1&nbsp;$2")
  .replace("రా. నీ&nbsp;","రా.<br>నీ&nbsp;").replace("సురేష్! నీకు","సురేష్!<br>నీకు").replace("ఎంప్లాయ్‌వా? లేక","ఎంప్లాయ్‌వా?<br>లేక")
  .replace("పెళ్లికి వెడ్డింగ్","పెళ్లికి<br>వెడ్డింగ్").replace("ని... comment","ని...<br>comment").replace("రమేష్. తర్వాత","రమేష్.<br>తర్వాత")
  .replace("సంవత్సరం కూడా","సంవత్సరం<br>కూడా").replace("ప్రమోషన్ గురించి","ప్రమోషన్<br>గురించి");

function frame(t){
  const b=beats(); T_=t;
  const frozen=t>=b.frz&&t<b.re0, fz=t>=b.faaah&&t<b.faaahE;
  const T=frozen?b.frz:fz?b.faaah+(t-b.faaah)*0.25:t>=b.faaahE?t-0.82:t;    // character time: slow-mo through the FAAAH, stopped in the freeze + silence
  const cab=t<b.whip+0.15, react=t>=b.re0;
  $("s").style.filter=frozen?`saturate(${lerp(1,0.65,clamp((t-b.frz)/0.08))}) contrast(1.06) brightness(1.03)`:fz?"saturate(1.25) contrast(1.05)":(t>=b.whip&&t<b.whip+0.3)?`blur(${(6*Math.sin(clamp((t-b.whip)/0.3)*Math.PI)).toFixed(1)}px)`:"";
  const R=(C,who,x,y,s)=>{resetPose(C,x,y,s,who&&!frozen?talkOf(who,t):0); C.st.blink=frozen?0:(((T*0.6+x*0.0013)%3.3)<0.11?1:0); return C.st};
  const m=R(MG,"manager",MG_C,H85,S85), r=R(RM,"ramesh",cab?RM_C:RM_O,H85,S85), su=R(SU,"suresh",cab?SU_C:SU_O,H85,S85);
  m.itemL="mug"; MG.aim("L",m.x-70,H85-170*S85); m.hR=[70,-70]; m.look=0.5; m.smile=1; m.brow="u";
  su.itemL="notepad"; su.look=-0.6; su.smile=1; su.brow="u"; SU.aim("L",su.x-40,H85-140); SU.aim("R",su.x+40,H85-80);
  r.look=0.6; r.brow="n"; RM.aim("L",r.x-60,H85-140*S85); RM.aim("R",r.x+70,H85-140*S85);
  let fileP=[5,-150,0], scrollOn=false, cardOn=false, panelK=0, doorK=0;

  if(cab){
    // ---------------- the cabin ----------------
    // hook: the manager's arm round his favourite, glow + hearts; Suresh bobble-nods
    MG.aim("R",SU_C-55,H85-268*S85); m.look=0.7; m.smile=1; m.headRot=4; su.look=-0.7; bobble(su,T,0.35);
    if(t>=b.boing&&t<b.door){ bobble(su,T,1.4) }
    if(t>=S(1)-0.1&&t<b.door){ su.rot=4; su.headY=14; su.shut=t<E(1)?1:0; bobble(su,T,0.8) }        // the deep grateful bow
    // Ramesh barges in with his file
    r.vis=t>=b.door+0.05?1:0;
    if(t<S(2)-0.05){ const k=clamp((t-b.door-0.05)/0.55), st=Math.sin(t*14); r.x=lerp(CDOOR+150,RM_C,out(k)); r.walk=k<1?st*0.8:0; r.hop=k<1?Math.abs(st)*6:0 }
    r.look=0.7; r.smile=1; r.brow="u";
    panelK=t<b.door?1:t<b.push?1-0.8*out((t-b.door)/0.15):0.2;
    if(t>=b.door){ MG.aim("R",m.x+90,H85-150); m.look=-0.4; su.look=-0.8; su.smile=0; su.smirk=1 }
    if(t>=b.dhoom&&t<b.m4){ r.smile=0; r.wide=1; r.brow="u"; m.gasp=t<b.dhoom+0.6?1:0; m.smile=0; su.gasp=m.gasp; su.smirk=0 }
    // the brush-off: no eye contact, a swat
    if(t>=b.m4){ m.look=0.9; m.lookY=-0.6; m.smile=0; m.smirk=1; m.brow="n"; m.headRot=8; su.smirk=1; su.look=-0.6;
      const k=clamp((t-b.swat+0.1)/0.35); MG.aim("R",m.x-60+Math.sin(k*Math.PI*2)*110,H85-250+Math.sin(k*Math.PI)*-60);
      r.smile=0; r.sad=t>=b.bloop?1:0; r.brow=t>=b.bloop?"w":"n" }
    if(t>=b.r5){ r.sad=0; r.smirk=1; r.brow="q"; r.look=0.8; m.look=0.8; MG.aim("R",m.x+70,H85-70) }
    // the sermon: finger raised, rays
    if(t>=b.m6){ m.look=-0.6; m.lookY=0; m.headRot=-4; m.smirk=1; m.brow="u"; MG.aim("R",m.x+50,H85-470); m.spread=0; r.smirk=0; r.brow="w"; su.smile=1; bobble(su,T,0.6) }
    // pushed out: the door shuts on his face
    if(t>=b.push){ const k=clamp((t-b.push)/0.2); r.x=lerp(RM_C,CDOOR+135,out(k)); r.hop=k<1?Math.sin(k*Math.PI)*14:0; r.gasp=1; r.wide=1; r.smirk=0; r.look=0;
      MG.aim("R",CDOOR+300,H85-260); m.look=-0.9; m.smirk=1; m.brow="n";
      panelK=t<b.slam?0.2:0.2+0.8*clamp((t-b.slam)/0.07);
      if(t>=b.slam+0.07){ const q=t-b.slam; r.squash=1-0.06*Math.exp(-q*5); r.rot=-2; r.gasp=0; r.wide=0; r.sad=1; r.brow="w"; r.lookY=0.3 } }
  } else {
    // ---------------- the open office: the water cooler ----------------
    m.vis=0;
    r.look=0.7; r.sad=t<b.grab?1:0; r.brow=t<b.grab?"w":"n"; RM.aim("L",r.x-25,H85-160*S85);
    fileP=[-20,-160,-10];
    { const k=clamp((t-b.suIn)/Math.max(0.3,b.grab-b.suIn-0.05)), st=Math.sin(t*13); su.x=lerp(1180,SU_O,out(k)); su.walk=k<1?st*0.8:0; su.hop=k<1?Math.abs(st)*5:0; su.look=k<1?-0.5:-0.7; bobble(su,T,0.5);
      doorK=t<b.suIn+0.4?1:1-out((t-b.suIn-0.4)/0.2) }
    if(t>=b.grab){ const k=out((t-b.grab)/0.25); RM.aim("R",lerp(r.x+80,su.x-60,k),H85-265*S85); r.smile=0; r.smirk=0; r.brow="u"; r.lookY=0; su.x-=12*k }
    if(t>=S(6)){ r.brow="q"; r.rot=4; r.headRot=5; su.look=-0.8 }                                                   // jealous lean
    if(t>=S(7)-0.05){ su.sad=1; su.smile=0; su.headRot=-4; RM.aim("R",r.x+70,H85-140*S85); r.rot=0; r.headRot=0;
      if(t>=W0(7,1)){ su.sad=0; su.smile=1; su.brow="u"; su.rot=-3; bobble(su,T,0.5) } }
    if(t>=S(8)-0.05){ r.brow="u"; r.wide=1; r.rot=5; r.headRot=4; r.look=0.9 }                                      // 'అదేంట్రా?'
    // the twist: the checklist
    if(t>=b.scr0){ scrollOn=true; su.itemL=""; su.smile=1; su.brow="u"; su.look=-0.4; su.headRot=-3; SU.aim("L",su.x-150,H85-200*S85); SU.aim("R",su.x+150,H85-200*S85) }
    if(t>=b.faaah){ r.gasp=1; r.wide=1; r.brow="u"; r.rot=0; r.headRot=0; r.squash=1+0.06*clamp((T-b.faaah)/0.08) }
    if(t>=b.faaahE){ r.gasp=1; r.squash=1.04; su.hop=t>=b.dhol&&t<b.dhol+1.0?Math.abs(Math.sin(T*12))*12:0; su.headRot=Math.sin(T*12)*4 }
    // the punch
    if(t>=b.r11){ r.gasp=0; r.wide=t<W0(10,1)?1:0; r.squash=1; r.brow=t<W0(10,1)?"u":"q"; r.look=0.4; r.smirk=t>=W0(10,1)?1:0; r.rot=0; r.headRot=t>=W0(10,2)?-4:0;
      RM.aim("R",r.x+120,H85-300*S85); su.hop=0; su.headRot=0; su.smile=1 }
    // reaction: Suresh blinks twice, then nods proudly with a plain wedding card
    if(react){ cardOn=true; su.smile=1; su.smirk=0; su.brow="u"; su.look=-0.2; su.lookY=0; SU.aim("R",su.x+95,H85-350*S85); su.blink=(Math.abs(t-b.blink1)<0.07||Math.abs(t-b.blink2)<0.07)?1:0;
      if(t>=b.nod0) bobble(su,t,1.5) }
  }
  MG.draw(); RM.draw(); SU.draw();
  // props
  fileG.setAttribute("transform",`translate(${fileP[0]},${fileP[1]}) rotate(${fileP[2]})`); fileG.style.display=r.vis?"":"none";
  scrollG.style.display=scrollOn?"":"none";
  if(scrollOn){ const u=clamp((t-b.unroll)/0.6), v=clamp((T-b.unroll-0.5)/1.4); const bot=lerp(-190,430,out(u));
    scPaper.setAttribute("height",bot+210); scRows.forEach((g,i)=>g.style.opacity=(-150+i*92+30<bot)?1:0);
    const L=v*820; scFloor.setAttribute("d",v>0?`M140 420 L${150+L} 420 L${170+L} 470 L120 470 Z`:"");
    scFloorL.innerHTML=""; for(let x=190;x<150+L-30;x+=70) el("path",{d:`M${x} 436 l40 0 M${x+4} 452 l46 0`,stroke:"#9E9E9E","stroke-width":4},scFloorL);
    scEnd.setAttribute("transform",u<1?`translate(0,${bot})`:`translate(${150+L+10},445) rotate(${-90+L*0.8})`);
    if(u<1) scEnd.setAttribute("transform",`translate(0,${bot}) rotate(90)`) }
  cardG.style.display=cardOn?"":"none"; if(cardOn) cardG.setAttribute("transform",`translate(${(su.hR||[95,-350])[0]+10},${su.hR[1]-60}) rotate(${-8+Math.sin(t*12)*(t>=b.nod0?3:0)})`);
  panelP.setAttribute("transform",`translate(${CDOOR},0) scale(${panelK},1)`); panelG.style.display=cab?"":"none";
  // back-row colleagues: pop up gasping on the FAAAH (office only)
  BC.forEach((c,i)=>{const X=[630,185,-300][i]; const up=!cab&&t>=b.faaah?out((t-b.faaah-0.05*i)/0.2):0;
    const st_=R(c,null,X,lerp(1330,1150,up),0.5); st_.vis=up>0?1:0; st_.look=0.6; st_.gasp=1; st_.wide=1; if(react){st_.gasp=0; st_.laugh=1; st_.shut=1} c.draw()});
  // the office door (Suresh comes out of the cabin), the cooler
  doorP.setAttribute("transform",`scale(${1-0.78*doorK},1)`);
  coolB.setAttribute("transform",`translate(${COOL_X},0)`);
  // glow + hearts round Suresh (hook)
  {const on=cab&&t<b.door+0.3; const [hx,hy]=SU.headW(); glow.style.display=on?"":"none"; glow.setAttribute("transform",`translate(${hx},${hy+60}) scale(${on?Math.min(1,0.6+t*0.8)*(1+0.04*Math.sin(t*4)):0.01})`);
   hearts.style.display=on?"":"none";
   HRT.forEach((g,i)=>{const big=i<3, t0=big?b.hp+i*0.08:0.1+i*0.35; const k=fract((t-t0)/2.2), a=i*1.1;
     const sc=big?(t<t0?0:Math.max(0.01,back((t-t0)/0.3))*(1.4-0.4*clamp((t-t0-0.3)/1))):0.9; const x=hx+Math.cos(a)*(big?150:190)+Math.sin(t*2+i)*14, y=hy-40+(big?-60-30*clamp(t-t0):Math.sin(a)*80-k*120);
     g.setAttribute("transform",`translate(${x},${y}) scale(${Math.max(0.01,sc*(big?1.6:1))}) rotate(${Math.sin(t*3+i)*12})`); g.style.opacity=big?(t>=t0?1:0):(t<0.1+i*0.35?0:1-k)})}
  // guru rays
  {const on=cab&&t>=b.chime-0.1&&t<b.push; rays.style.display=on?"":"none"; rays.setAttribute("transform",`translate(${MG_C},${HY+20}) rotate(${t*20}) scale(${Math.max(0.01,out((t-b.chime+0.1)/0.25))})`)}
  // FAAAH burst behind Ramesh + the jaw drop
  {const on=!cab&&t>=b.faaah-0.03&&t<b.faaahE+0.05; const [hx,hy]=RM.headW(); const k=Math.max(0.01,back((t-b.faaah+0.03)/0.18));
   burst.style.display=burstT.style.display=on?"":"none";
   burst.setAttribute("transform",`translate(${hx},${hy}) scale(${0.8*k}) rotate(${(t-b.faaah)*30})`); burstT.setAttribute("transform",`translate(${hx+10},${hy-160}) scale(${0.62*k}) rotate(-6)`);
   const jo=!cab&&t>=b.faaah&&t<b.r11; jaw.setAttribute("opacity",jo?1:0);
   if(jo){ const q=clamp((T-b.faaah)/0.12); jaw.setAttribute("cx",hx+r.look*7*r.s); jaw.setAttribute("cy",hy+(46+30*q)*r.s); jaw.setAttribute("rx",(13+5*q)*r.s); jaw.setAttribute("ry",(14+38*q)*r.s) }}

  // ---------------- Gopi (narrator badge): the tag ----------------
  const g=GOPI.st; const narOn=t>=b.s12&&t<b.end0;
  Object.assign(g,{x:0,y:400*0.55+12,s:0.55,talk:talkOf("gopi",t),blink:((t*0.7)%3.1)<0.12?1:0,wink:0,look:-0.5,lookY:0,brow:"q",smile:1,headRot:Math.sin(t*2.2)*3,item:"",armL:200,armR:160,lenL:115,lenR:115,hop:0,itemRot:0});
  GOPI.draw();
  const bs=narOn?Math.max(0.001,back((t-b.s12)/0.35)):0;
  badge.setAttribute("transform",`translate(920,1390) scale(${bs*0.8}) rotate(${Math.sin(t*2)*2})`); badge.style.opacity=narOn?1:0;

  // ---------------- camera ----------------
  const pu=(t0,a_=0.1,k=5)=>t>t0?a_*Math.exp(-(t-t0)*k)*clamp((t-t0)/0.04):0;
  const shots=[
    [0,focus(1.12+0.02*t,3590,HY+120,540,1000)],                                         // the favourite: manager + Suresh, glow
    [S(1)-0.15,focus(1.5,SU_C-20,HY+70,540,960),0.2],                                    // the bow
    [b.door-0.05,focus(0.92,3400,1090,540,1040),0.3],                                    // wide: the door, Ramesh walks in
    [b.dhoom,focus(1.95+pu(b.dhoom,0.15),RM_C,HY+50,540,940,-2),0.05],                   // DHOOM punch-in
    [b.m4,focus(1.3,MG_C-40,1030,540,980),0.2],                                          // the brush-off
    [b.r5,focus(1.4,RM_C+30,1010,540,1010),0.15],                                        // Ramesh + the flashback (calendar up top)
    [b.m6,focus(1.3+0.03*(t-b.m6),MG_C,1020,540,990),0.15],                              // the sermon
    [b.push,focus(1.0,3250,1080,540,1040),0.12],                                         // pushed out
    [b.slam,focus(1.75+pu(b.slam,0.1),CDOOR+135,HY+60,540,960),0.06],                    // his face on the glass
    [b.whip,focus(1.0,560,1090,540,1040),0.3],                                           // whip pan to the cooler
    [S(6)-0.1,focus(1.35,(RM_O+SU_O)/2,1030,540,1000),0.3],                              // the whisper
    [S(8)-0.05,focus(1.75+pu(S(8),0.08),RM_O+30,HY+60,540,960),0.06],                    // 'అదేంట్రా?'
    [S(9)-0.05,focus(1.0,620,1150,540,1080),0.25],                                       // the checklist
    [b.faaah,focus(2.1,RM_O,HY+40,820,940),0.07],                                        // FAAAH: the jaw (the checklist stays out of frame: no cut-off words)
    [b.faaahE,focus(0.95,640,1170,540,1090),0.3],                                        // wide: down the aisle (the cabin's MANAGER plate stays out of frame)
    [b.r11,focus(2.1,RM_O+20,HY+70,820,940),0.15],                                       // the punch, close (the checklist stays out of frame: no cut-off words)                                       // the punch, close
    [b.re0,focus(2.2,SU_O,HY+80,540,860),0.01],                                          // the reaction
  ];
  let cm=shots[0][1];
  {let i=0; while(i+1<shots.length&&t>=shots[i+1][0]) i++;
   const [t0,c,tr]=shots[i]; cm=c;
   if(i>0&&tr&&t<t0+tr){ const prev=shots[i-1][1]; cm=mixCam(prev,c,ease((t-t0)/tr)) }}
  if(frozen) cm={...cm,z:cm.z*(1+0.04*clamp((t-b.frz)/0.25))};
  let sx=0,sy=0; const shake=(t0,d,a_)=>{if(t>t0&&t<t0+d){const q=(1-(t-t0)/d)*a_; sx+=Math.sin(t*90)*q; sy+=Math.cos(t*77)*q}};
  shake(b.dhoom,0.45,22); shake(b.stamp1,0.2,10); shake(b.stamp2,0.2,10); shake(b.slam,0.3,18); shake(b.faaah,0.3,12); shake(b.frz,0.12,10); shake(b.card,0.25,14);
  cam.setAttribute("transform",`translate(${540+sx},${1000+sy}) rotate(${cm.r||0}) scale(${cm.z}) translate(${-cm.fx},${-cm.fy})`);
  const scr=(wx,wy)=>{const r_=(cm.r||0)*Math.PI/180, dx=(wx-cm.fx)*cm.z, dy=(wy-cm.fy)*cm.z; return [540+dx*Math.cos(r_)-dy*Math.sin(r_)+sx, 1000+dx*Math.sin(r_)+dy*Math.cos(r_)+sy]};
  // the teacher's-pet sparkle round Suresh's head (L2)
  {const [hx,hy]=SU.headW(); const [px,py]=scr(hx,hy); SPK.forEach((s_,i)=>{const on=cab&&t>=b.sparkle&&t<b.sparkle+1.0; const a=i/6*Math.PI*2+(t-b.sparkle)*2.5;
    s_.setAttribute("opacity",on?1-clamp((t-b.sparkle-0.6)/0.4):0); s_.setAttribute("transform",`translate(${px+Math.cos(a)*170},${py+Math.sin(a)*130}) scale(${Math.max(0.01,pop(t,b.sparkle+i*0.04,0.25))}) rotate(${(t-b.sparkle)*120})`)})}

  // ---------------- HTML overlays ----------------
  {const on=t<b.hookOut; $("hook").style.opacity=on?clamp((b.hookOut-t)/0.12):0;
   $("hook").style.transform=`rotate(${-1.5+Math.sin(t*3)*0.6}deg) scale(${t<0.25?1+0.08*Math.sin(t/0.25*Math.PI):1})`}
  const schip=(id,on,px,py,t0,rot,s=1)=>{const e=$(id); if(!on){e.style.opacity=0;return} e.style.opacity=1; e.style.left=px+"px"; e.style.top=py+"px"; e.style.transform=`translate(-50%,-50%) scale(${Math.max(0.01,pop(t,t0,0.3))*s}) rotate(${rot}deg)`};
  schip("cLater",t>b.later&&t<b.r5+0.35,560,520,b.later,-3,1.15);
  // calendar flashback: 2024 + stamp, flip, 2025 + stamp
  {const on=t>=b.cal0&&t<b.cal1; const c=$("cal"); c.style.opacity=on?clamp(Math.min((t-b.cal0)/0.12,(b.cal1-t)/0.12)):0;
   const fl=t>=b.flip&&t<b.flip+0.16?Math.abs(Math.cos((t-b.flip)/0.16*Math.PI)):1; $("calY").textContent=t<b.flip+0.08?"2024":"2025";
   c.style.transform=`scale(${Math.max(0.01,back((t-b.cal0)/0.3))}) rotate(-2deg)`; $("calY").style.transform=`scaleY(${Math.max(0.02,fl)})`;
   const s0=t>=b.flip?b.stamp2:b.stamp1, st=$("calS"); const sv=t>=s0-0.04&&(t<b.flip||t>=b.stamp2-0.04);
   st.style.opacity=sv?1:0; st.style.transform=`translate(-50%,-50%) rotate(${t>=b.flip?10:-12}deg) scale(${lerp(2.4,1,clamp((t-s0+0.04)/0.06))})`}
  show("frz",frozen,1,"");
  // follow tap (silent): pops when the door shuts
  const fA=b.fol0, fB=b.fol1; const fOn=t>fA&&t<fB; const fol=$("fol"); fol.style.opacity=fOn?clamp(Math.min((t-fA)/0.15,(fB-t)/0.1)):0;
  fol.style.transform=`scale(${Math.max(0.01,back((t-fA)/0.3))*(Math.abs(t-b.tFol)<0.1?0.9:1)})`;
  const bF=$("bF"); bF.textContent=t<b.tFol?"+ FOLLOW":"FOLLOWING ✓"; bF.className="btn"+(t<b.tFol?"":" done");
  {const FX=955, FY=1565; const hand=$("tapHand"); const hk=ease((t-fA-0.05)/Math.max(0.3,b.tFol-fA-0.1)); const dip=Math.max(0,1-Math.abs(t-b.tFol)/0.1);
   hand.style.opacity=fOn?clamp(Math.min((t-fA-0.05)/0.12,(fB-t)/0.1)):0; hand.style.transform=`translate(${lerp(1000,FX,hk)-50}px,${lerp(1790,FY,hk)+dip*12}px) rotate(${-8+dip*6}deg)`;
   const rg_=$("ring"), rk=(t-b.tFol)/0.4; rg_.style.opacity=fOn&&rk>0&&rk<1?1-rk:0; rg_.style.left=FX+"px"; rg_.style.top=FY+"px"; rg_.style.transform=`scale(${1+rk*6})`}
  // the ENDING CARD (owner's words), slams in, held ~3 s
  {const on=t>=b.card&&t<b.s12; const e=$("endT"); e.style.opacity=on?clamp(Math.min((t-b.card)/0.08,(b.s12-t)/0.12)):0;
   e.querySelector(".cd").style.transform=`scale(${lerp(1.6,1,out((t-b.card)/0.14))*(1+0.012*Math.sin((t-b.card)*6))}) rotate(-2deg)`}
  // share: tag your office Suresh
  {const shOn=t>b.s12&&t<b.end0+0.1; const sh=$("share"); sh.style.opacity=shOn?clamp(Math.min((t-b.s12)/0.2,(b.end0+0.1-t)/0.12)):0;
   $("sq").style.transform=`scale(${Math.max(0.01,back((t-b.s12)/0.4))})`;
   const tA=b.s12+0.35; $("cin").innerHTML=t>tA?(t>b.tTag+0.05?'<em>@Office Suresh 😇</em> 😂':"@"+(t>tA+0.25?"Office S":"")):"";
   ["ct1","ct2","ct3"].forEach((id,i)=>{const e=$(id), t0=tA+0.05+i*0.07; e.style.opacity=t>t0?1:0; e.style.transform=`translateY(${lerp(30,0,out((t-t0)/0.25))}px) scale(${id==="ct1"&&Math.abs(t-b.tTag)<0.1?0.94:1})`; e.style.background=id==="ct1"&&t>b.tTag?"#FFF3B0":"#fff"});
   $("ok1").style.opacity=t>b.tTag+0.05?1:0}
  // end card
  {const ec=$("endc"), eOn=t>b.end0; ec.style.opacity=eOn?clamp((t-b.end0)/0.12):0;
   $("eF").textContent=t<b.tEF?"FOLLOW @_REELRASAM":"FOLLOWING ✓  @_REELRASAM"; $("eF").style.transform=`scale(${Math.abs(t-b.tEF)<0.1?0.92:1})`; $("eF").style.background=t<b.tEF?"":"#6D6875";
   const eh=$("eHand"), ek=ease((t-b.end0)/Math.max(0.2,b.tEF-b.end0-0.05)), edip=Math.max(0,1-Math.abs(t-b.tEF)/0.1);
   eh.style.opacity=eOn&&t<b.tEF+0.25?clamp((b.tEF+0.25-t)/0.1):0; eh.style.transform=`translate(${lerp(1030,980,ek)-50}px,${lerp(1300,735,ek)+edip*12}px) scale(${1-0.1*edip}) rotate(-8deg)`}
  // flashes
  {const fl=(t0,d,a_)=>t>t0&&t<t0+d?a_*(1-(t-t0)/d):0; let a=0,col="#FFFFFF";
   const add=(t0,d,a_,c)=>{const v=fl(t0,d,a_); if(v>a){a=v;col=c}};
   add(b.door,0.1,0.25,"#FFFFFF"); add(b.dhoom,0.12,0.5,"#FF5A3C"); add(b.stamp1,0.08,0.3,"#FFFFFF"); add(b.stamp2,0.08,0.3,"#FFFFFF"); add(b.slam,0.1,0.45,"#FFFFFF");
   add(b.faaah,0.12,0.6,"#E53935"); add(b.frz,0.16,0.85,"#FFFFFF"); add(b.re0,0.06,0.3,"#FFFFFF");
   $("flash").style.opacity=a; $("flash").style.background=col}
  // subtitles (… -> ...)
  const sub=$("sub"), L=curLine(t);
  if(L&&!(t>b.end0)&&!(t>=b.frz&&L.i===10)){sub.style.opacity=1; sub.innerHTML=`<span class="who" style="background:${COLORS[L.who]}">${NAMES[L.who]}</span><br>${subFix(L.text)}`} else sub.style.opacity=0;
}
function show(id,on,s=1,extra=""){const e=$(id); e.style.opacity=on?1:0; if(on) e.style.transform=`${extra} scale(${Math.max(0.01,s)})`}

window.render=function(t){ frame(t) };
