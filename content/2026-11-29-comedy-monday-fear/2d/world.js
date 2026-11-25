// Office Politics Ep 5 "సోమవారం భయం!" — sets + choreography (loaded by ep.html after office_cast.js). Built on Ep 2's world.js.
// SET 1 (NEW): Ramesh's small rented flat, Sunday 9 PM: couch, a generic TV (abstract colour glow, no show/brand), wall clock,
//   a window with night city lights, a side table. Ramesh in his home look (grey crew-neck tee, checked shorts, barefoot; same
//   face/hair/stubble). Popcorn bowl on his belly -> PING + DHOOM (popcorn freezes mid-air) -> the manager's message on a phone
//   (HTML) -> L1 -> FAAAH #1 (the bowl explodes upward) -> time-lapse 9 PM -> 3 AM (laptop, cups stack, hair goes wild; silent
//   FOLLOW tap) -> 'MONDAY 9:00 AM'.
// SET 2: the same office as Ep 0-2 (cubicles, wall clock, the glass cabin + MANAGER door with Ep 1's garland, the drooping paper
//   star, Ramesh's 'SECONDARY ⭐' sticky + helmet). The manager waits in Ramesh's own swivel chair (villain spin), zombie Ramesh
//   (panda eyes, fly), the 'DEDICATED ⭐' forehead sticker, the ask, the needle-stop 'ఎందుకు?', the phone held up, the fake family
//   drama (soft focus, violin, arm round him, fake tear), the turn, DHAN-DHAN-DHAN crash zooms on the manager's 😳 + FAAAH #2, the
//   punch to camera -> FREEZE -> 0.3 s silence -> reaction (moustache droops, the mug tilts, coffee drips on his shoe) -> the
//   ending card (owner's words) -> Gopi tag -> end card 'Series: Office Politics · Ep 5'.
const defs=el("defs",{});
const cam=el("g",{});
applySkin(cam, defs);
const W=el("g",{id:"world"},cam);
const FEET=1700;
const hipAt=s=>FEET-448*s;
const S85=0.85, H85=hipAt(S85);
{const f=el("filter",{id:"bgBlur",x:"-30%",y:"-30%",width:"160%",height:"160%"},defs); el("feGaussianBlur",{stdDeviation:7},f)}
const star=(r0,r1,n=5,cy=0)=>{const p=[]; for(let k=0;k<2*n;k++){const r=k%2?r1:r0, a=-Math.PI/2+k*Math.PI/n; p.push(`${(Math.cos(a)*r).toFixed(1)},${(Math.sin(a)*r+cy).toFixed(1)}`)} return p.join(" ")};

// ======================= SET 1: Ramesh's flat (night) =======================
const HOME=el("g",{},W);
const HX=560, HHIP=1468, HS=0.95;                                       // Ramesh on the couch
el("rect",{x:-1100,y:-900,width:3600,height:2460,fill:"#4B5280"},HOME);   // wall (night, lamp-lit)
el("rect",{x:-1100,y:1080,width:3600,height:16,fill:"#3D4370"},HOME);     // dado line
el("rect",{x:-1100,y:1560,width:3600,height:1400,fill:"#8A6A50"},HOME);   // wooden floor
for(let y=1600;y<2600;y+=80) el("line",{x1:-1100,y1:y,x2:2500,y2:y,stroke:"#77593F","stroke-width":4},HOME);
el("rect",{x:-1100,y:1556,width:3600,height:14,fill:"#5E4532"},HOME);
// warm lamp glow (wall) + the TV's cool glow
{const g=el("radialGradient",{id:"lampG"},defs); el("stop",{offset:"0%","stop-color":"#FFE7A8","stop-opacity":.55},g); el("stop",{offset:"100%","stop-color":"#FFE7A8","stop-opacity":0},g)}
el("circle",{cx:930,cy:1120,r:420,fill:"url(#lampG)"},HOME);
const tvGlowG=el("radialGradient",{id:"tvG"},defs); el("stop",{offset:"0%","stop-color":"#7FD8FF","stop-opacity":.45},tvGlowG); el("stop",{offset:"100%","stop-color":"#7FD8FF","stop-opacity":0},tvGlowG);
const tvGlow=el("ellipse",{cx:200,cy:1250,rx:520,ry:420,fill:"url(#tvG)"},HOME);
// window: night sky, city lights, moon
const winG=el("g",{transform:"translate(700,520)"},HOME);
el("rect",{x:-14,y:-14,width:348,height:418,rx:10,fill:"#2B2F52",stroke:INK,"stroke-width":7},winG);
el("rect",{x:0,y:0,width:320,height:390,fill:"#141938"},winG);
el("circle",{cx:250,cy:70,r:34,fill:"#FFF3C4"},winG); el("circle",{cx:262,cy:62,r:30,fill:"#141938"},winG);
[[10,230,60,160],[70,190,70,200],[140,250,50,140],[190,170,60,220],[250,220,70,170]].forEach(([x,y,w,h],k)=>{el("rect",{x,y,width:w,height:h,fill:"#262C55"},winG);
  for(let yy=y+14;yy<y+h-10;yy+=26) for(let xx=x+8;xx<x+w-10;xx+=18) if(hash(xx*3+yy+k)>0.45) el("rect",{x:xx,y:yy,width:9,height:12,fill:"#FFD86B",opacity:.9},winG)});
el("line",{x1:160,y1:0,x2:160,y2:390,stroke:"#2B2F52","stroke-width":10},winG); el("line",{x1:0,y1:195,x2:320,y2:195,stroke:"#2B2F52","stroke-width":10},winG);
el("path",{d:"M-30 -30 L120 -30 Q90 200 110 420 L-30 420 Z",fill:"#C66B4E",stroke:INK,"stroke-width":5},winG);    // curtain
// floor lamp (right)
el("rect",{x:1046,y:1000,width:10,height:560,fill:"#3A3A3A"},HOME); el("path",{d:"M990 1000 L1110 1000 L1080 900 L1020 900 Z",fill:"#FFE0A3",stroke:INK,"stroke-width":5},HOME);
el("ellipse",{cx:1050,cy:1562,rx:60,ry:12,fill:"#3A3A3A"},HOME);
// wall clock (9:00 PM -> 3:00 AM in the time-lapse)
const HCX=250, HCY=640; const hClock=el("g",{transform:`translate(${HCX},${HCY})`},HOME);
el("circle",{r:104,fill:"#10141E"},hClock); el("circle",{r:92,fill:"#FFFDF5"},hClock);
for(let k=0;k<12;k++){const a=k*Math.PI/6; el("line",{x1:Math.sin(a)*74,y1:-Math.cos(a)*74,x2:Math.sin(a)*86,y2:-Math.cos(a)*86,stroke:INK,"stroke-width":k%3?4:9},hClock)}
const hHour=el("line",{x1:0,y1:8,x2:0,y2:-46,stroke:INK,"stroke-width":11,"stroke-linecap":"round"},hClock);
const hMin=el("line",{x1:0,y1:10,x2:0,y2:-72,stroke:INK,"stroke-width":7,"stroke-linecap":"round"},hClock);
el("circle",{r:8,fill:"#E53935"},hClock);
// framed picture (plain shapes)
{const p=el("g",{transform:"translate(470,700)"},HOME); el("rect",{x:-90,y:-70,width:180,height:140,fill:"#F5E6C8",stroke:INK,"stroke-width":7},p);
 el("path",{d:"M-80 60 L-20 -10 L20 30 L50 0 L80 60 Z",fill:"#7CB342"},p); el("circle",{cx:40,cy:-30,r:16,fill:"#FFB74D"},p)}
// the TV (generic: a plain dark bezel, an abstract cartoon glow on screen, NO logo or text) on a low stand, angled to the couch
const tvG=el("g",{transform:"translate(-40,0)"},HOME);
el("rect",{x:-150,y:1400,width:330,height:160,rx:10,fill:"#6D4C41",stroke:INK,"stroke-width":6},tvG);
el("line",{x1:15,y1:1410,x2:15,y2:1550,stroke:INK,"stroke-width":4},tvG);
el("rect",{x:0,y:1380,width:40,height:24,fill:"#263238"},tvG);
el("polygon",{points:"-150,1060 190,1110 190,1385 -150,1395",fill:"#1A1D24",stroke:INK,"stroke-width":7},tvG);
const tvScr=el("g",{},tvG); {const cp=el("clipPath",{id:"tvClip"},defs); el("polygon",{points:"-134,1078 174,1124 174,1370 -134,1380"},cp)}
tvScr.setAttribute("clip-path","url(#tvClip)");
el("rect",{x:-140,y:1060,width:330,height:330,fill:"#2A5DB0"},tvScr);
const tvBlobs=[["#FF8A65",60],["#FFD54F",46],["#81C784",54],["#BA68C8",40]].map(([c,r])=>el("circle",{r,fill:c,opacity:.85},tvScr));
// the couch (terracotta), cushions
const couchB=el("g",{},HOME);
el("rect",{x:290,y:1130,width:540,height:330,rx:46,fill:"#B5523B",stroke:INK,"stroke-width":7},couchB);
[[310,1160],[570,1160]].forEach(([x,y])=>el("rect",{x,y,width:240,height:230,rx:34,fill:"#C96A50",stroke:INK,"stroke-width":5},couchB));
el("rect",{x:640,y:1240,width:120,height:110,rx:24,fill:"#FFB74D",stroke:INK,"stroke-width":5,transform:"rotate(12 700 1295)"},couchB);   // a cushion
const homePeople=el("g",{},HOME);
const couchF=el("g",{},HOME);
el("rect",{x:300,y:1430,width:520,height:110,rx:24,fill:"#A9472F",stroke:INK,"stroke-width":7},couchF);
el("rect",{x:250,y:1260,width:90,height:290,rx:36,fill:"#B5523B",stroke:INK,"stroke-width":7},couchF);
el("rect",{x:780,y:1260,width:90,height:290,rx:36,fill:"#B5523B",stroke:INK,"stroke-width":7},couchF);
[300,800].forEach(x=>el("rect",{x:x-8,y:1540,width:24,height:24,fill:"#3E2723"},couchF));
// side table + the coffee cups (stack up in the time-lapse)
el("rect",{x:900,y:1380,width:150,height:20,rx:6,fill:"#8D6E63",stroke:INK,"stroke-width":5},HOME);
el("rect",{x:915,y:1400,width:14,height:160,fill:"#6D4C41"},HOME); el("rect",{x:1021,y:1400,width:14,height:160,fill:"#6D4C41"},HOME);
const cups=[0,1,2,3,4].map(k=>{const g=el("g",{opacity:0},HOME); mugShape(g); return g});
// popcorn bowl (on his belly) + kernels
const bowlG=el("g",{},HOME);
const bowlK=[]; for(let k=0;k<11;k++){const g=el("g",{},bowlG); [[0,0,13],[9,-6,10],[-8,-7,10],[2,-12,9]].forEach(([x,y,r])=>el("circle",{cx:x,cy:y,r,fill:"#FFF8E1",stroke:"#C9A13B","stroke-width":2.5},g)); bowlK.push(g)}
el("path",{d:"M-96 -20 L96 -20 L74 60 Q0 78 -74 60 Z",fill:"#E53935",stroke:INK,"stroke-width":6,"stroke-linejoin":"round"},bowlG);
[-56,-18,20,58].forEach(x=>el("path",{d:`M${x} -20 L${x+12} -20 L${x*0.78+10} 66 L${x*0.78} 66 Z`,fill:"#FFFFFF"},bowlG));
el("rect",{x:-102,y:-28,width:204,height:16,rx:8,fill:"#C62828",stroke:INK,"stroke-width":5},bowlG);
const POP=[]; for(let k=0;k<26;k++){const g=el("g",{opacity:0},HOME); [[0,0,12],[8,-6,9],[-7,-6,9],[1,-11,8]].forEach(([x,y,r])=>el("circle",{cx:x,cy:y,r,fill:"#FFF8E1",stroke:"#C9A13B","stroke-width":2.5},g)); POP.push(g)}
// the laptop on his lap (time-lapse): lid back, plain grey, no logo
const lapG=el("g",{opacity:0},HOME);
el("rect",{x:-120,y:-150,width:240,height:150,rx:10,fill:"#90A4AE",stroke:INK,"stroke-width":6},lapG);
el("rect",{x:-140,y:-4,width:280,height:20,rx:6,fill:"#78909C",stroke:INK,"stroke-width":5},lapG);
const lapGlow=el("ellipse",{cx:0,cy:-170,rx:150,ry:60,fill:"#B3E5FC",opacity:.35},lapG);
// Ramesh's phone (in his hand, world space)
const phoneW=el("g",{opacity:0},HOME);
el("rect",{x:-26,y:-46,width:52,height:92,rx:10,fill:"#1E222B",stroke:INK,"stroke-width":4},phoneW);
const phoneScr=el("rect",{x:-20,y:-38,width:40,height:72,rx:5,fill:"#B3E5FC"},phoneW);
// FAAAH burst (home) is shared with the office one below (moved between sets)

// ======================= SET 2: the office (Ep 0-2) =======================
const OFF=el("g",{},W);
el("rect",{x:-1100,y:-900,width:3600,height:2300,fill:"#EAF3F8"},OFF);
el("rect",{x:-1100,y:1380,width:3600,height:22,fill:"#B7C6D3"},OFF);
el("rect",{x:-1100,y:1402,width:3600,height:1400,fill:"#CDD7E0"},OFF);
for(let k=0;k<16;k++) el("line",{x1:-1100+k*260,y1:1402,x2:-1600+k*360,y2:2600,stroke:"#BCC8D3","stroke-width":5},OFF);
for(let y=1480;y<2400;y+=110) el("line",{x1:-1100,y1:y,x2:2500,y2:y,stroke:"#BCC8D3","stroke-width":4},OFF);
{const starG=el("g",{transform:"translate(-560,1250) rotate(160) scale(.7)"},OFF);                       // Ep 1 leftover: drooping paper star
 el("line",{x1:0,y1:-160,x2:0,y2:-62,stroke:INK,"stroke-width":3},starG); el("polygon",{points:star(64,26),fill:"#FFD54F",stroke:INK,"stroke-width":5,"stroke-linejoin":"round"},starG)}
const CLX=-330, CLY=560;                                                                                 // the office wall clock: 9:00
{const clockG=el("g",{transform:`translate(${CLX},${CLY})`},OFF);
 el("circle",{r:132,fill:"#10141E"},clockG); el("circle",{r:118,fill:"#FFFDF5"},clockG);
 for(let k=0;k<60;k++){const a=k*Math.PI/30, r0=k%5?104:92; el("line",{x1:Math.sin(a)*r0,y1:-Math.cos(a)*r0,x2:Math.sin(a)*110,y2:-Math.cos(a)*110,stroke:INK,"stroke-width":k%5?3:8},clockG)}
 [[12,0],[3,90],[6,180],[9,270]].forEach(([n,a])=>txt(String(n),{x:Math.sin(a*Math.PI/180)*74,y:-Math.cos(a*Math.PI/180)*74+13,"font-family":"Anton","font-size":38,"text-anchor":"middle",fill:INK},clockG));
 el("line",{x1:0,y1:10,x2:0,y2:-58,stroke:INK,"stroke-width":13,"stroke-linecap":"round",transform:"rotate(270)"},clockG);
 el("line",{x1:0,y1:14,x2:0,y2:-90,stroke:INK,"stroke-width":9,"stroke-linecap":"round"},clockG); el("circle",{r:9,fill:"#E53935"},clockG)}
const cub=el("g",{},OFF), cubP=el("g",{},OFF);
for(let x=-700;x<1000;x+=250){ el("rect",{x:x+70,y:1030,width:120,height:84,rx:6,fill:"#37474F",stroke:INK,"stroke-width":4},cub); el("rect",{x:x+80,y:1040,width:100,height:62,rx:3,fill:"#90CAF9"},cub); el("rect",{x:x+120,y:1114,width:20,height:26,fill:"#546E7A"},cub) }
el("rect",{x:-700,y:1140,width:1700,height:240,fill:"#9FB4C7",stroke:INK,"stroke-width":5},cubP);
el("rect",{x:-700,y:1132,width:1700,height:16,rx:6,fill:"#7F96AB",stroke:INK,"stroke-width":4},cubP);
for(let x=-450;x<1000;x+=250) el("rect",{x:x-5,y:1140,width:10,height:240,fill:"#7F96AB"},cubP);
// Ramesh's monitor (x 370-490): the 'SECONDARY ⭐' sticky (Ep 0 callback) + his helmet on the partition
{const sticky=el("g",{transform:"translate(700,1062) rotate(8) scale(.62)"},cubP);
 el("rect",{x:-56,y:-34,width:112,height:68,fill:"#FFF176",stroke:INK,"stroke-width":3},sticky);
 txt("SECONDARY",{x:0,y:-2,"font-family":"Anton","font-size":20,"text-anchor":"middle",fill:"#C62828"},sticky);
 el("polygon",{points:star(12,5,5,20),fill:"#FFB300",stroke:INK,"stroke-width":1.5},sticky)}
{const h=el("g",{transform:"translate(-80,1128)"},cubP); helmetShape(h,0.8)}
// the manager's glass cabin + door (plate readable, never mirrored) + Ep 1's red garland
el("rect",{x:1080,y:300,width:900,height:1080,fill:"#D3E9F2",stroke:"#56616C","stroke-width":14},OFF);
el("rect",{x:1500,y:1040,width:380,height:22,fill:"#B9A58A",stroke:"#7E6A50","stroke-width":3},OFF);
el("rect",{x:1600,y:880,width:12,height:160,fill:"#7E6A50"},OFF); el("circle",{cx:1606,cy:860,r:60,fill:"#81C784",opacity:.8},OFF);
{const doorP=el("g",{transform:"translate(1180,0)"},OFF);
 el("rect",{x:0,y:430,width:270,height:950,fill:"#C3E2EE",stroke:"#56616C","stroke-width":12},doorP);
 el("rect",{x:0,y:640,width:270,height:40,fill:"#FFFFFF",opacity:.6},doorP);
 el("rect",{x:226,y:860,width:14,height:110,rx:5,fill:"#90A4AE",stroke:INK,"stroke-width":3},doorP);
 el("rect",{x:40,y:500,width:190,height:62,rx:8,fill:"#FFFDF5",stroke:"#3F5A86","stroke-width":5},doorP);
 txt("MANAGER",{x:135,y:545,"font-family":"Anton","font-size":38,"letter-spacing":2,"text-anchor":"middle",fill:"#3F5A86"},doorP);
 const gg=el("g",{transform:"translate(135,930) scale(.82)"},doorP); garlandShape(gg)}
// Ramesh's own swivel chair (the manager waits in it): the back BEHIND a seated person, and the back seen from behind (before the spin)
const CH_X=600, CH_HIP=1452;
const chairWrap=el("g",{},OFF), chairBk=el("g",{},chairWrap);
el("rect",{x:-92,y:1110,width:184,height:300,rx:40,fill:"#37474F",stroke:INK,"stroke-width":7},chairBk);
el("rect",{x:-72,y:1136,width:144,height:240,rx:30,fill:"#455A64"},chairBk);
const chairBase=el("g",{},OFF);
el("rect",{x:-115,y:1440,width:230,height:46,rx:18,fill:"#263238",stroke:INK,"stroke-width":7},chairBase);
el("rect",{x:-14,y:1486,width:28,height:130,fill:"#78909C",stroke:INK,"stroke-width":4},chairBase);
el("path",{d:`M-110 ${FEET-26} L0 1610 L110 ${FEET-26}`,stroke:"#455A64","stroke-width":16,fill:"none","stroke-linecap":"round"},chairBase);
[-110,0,110].forEach(dx=>el("circle",{cx:dx,cy:FEET-18,r:16,fill:"#263238",stroke:INK,"stroke-width":3},chairBase));
chairBase.setAttribute("transform",`translate(${CH_X},0)`);
const people=el("g",{},OFF);
const mgWrap=el("g",{},people);
const chairFr=el("g",{},OFF);                                                       // the chair's back, seen from behind (hides him)
el("rect",{x:-112,y:980,width:224,height:470,rx:52,fill:"#2B363C",stroke:INK,"stroke-width":8},chairFr);
el("rect",{x:-86,y:1010,width:172,height:400,rx:40,fill:"#37474F"},chairFr);
[1080,1180,1280].forEach(y=>el("line",{x1:-70,y1:y,x2:70,y2:y,stroke:"#263238","stroke-width":5,opacity:.7},chairFr));
const spinLines=el("g",{opacity:0},OFF); [[-170,1100],[-190,1200],[-170,1300],[170,1120],[190,1220],[170,1320]].forEach(([x,y])=>el("path",{d:`M${x} ${y} Q${x*0.7} ${y-40} ${x*0.3} ${y-30}`,stroke:INK,"stroke-width":8,fill:"none","stroke-linecap":"round"},spinLines));
spinLines.setAttribute("transform",`translate(${CH_X},0)`);
// FAAAH burst (behind the head it hits) + text
const burst=el("g",{},W);
{const pts=[]; for(let k=0;k<28;k++){const r=k%2?150:260, a=k*Math.PI/14; pts.push(`${(Math.cos(a)*r).toFixed(0)},${(Math.sin(a)*r*0.86).toFixed(0)}`)}
 el("polygon",{points:pts.join(" "),fill:"#E53935",stroke:INK,"stroke-width":8,"stroke-linejoin":"round"},burst); el("polygon",{points:pts.join(" "),fill:"#FF8A65",transform:"scale(.62)"},burst)}
const burstT=el("g",{},W);
txt("FAAAH!",{x:0,y:0,"font-family":"Anton","font-size":120,"letter-spacing":2,"text-anchor":"middle",fill:"#FFE066",stroke:INK,"stroke-width":10,"paint-order":"stroke","stroke-linejoin":"round"},burstT);
// the fly (zombie Ramesh), the DEDICATED sticker, mug steam, coffee drips + puddle, the sweat drop
const fly=el("g",{opacity:0},W); el("ellipse",{cx:0,cy:0,rx:11,ry:8,fill:"#212121"},fly); const wingA=el("ellipse",{cx:-6,cy:-9,rx:9,ry:5,fill:"#E3F2FD",stroke:INK,"stroke-width":1.5,opacity:.85},fly), wingB=el("ellipse",{cx:6,cy:-9,rx:9,ry:5,fill:"#E3F2FD",stroke:INK,"stroke-width":1.5,opacity:.85},fly);
const flyTrail=el("path",{d:"",stroke:INK,"stroke-width":2.5,fill:"none","stroke-dasharray":"6 8",opacity:0},W);
const stk=el("g",{opacity:0},W);
el("rect",{x:-72,y:-26,width:144,height:52,rx:6,fill:"#FFF176",stroke:INK,"stroke-width":4},stk);
txt("DEDICATED",{x:-10,y:10,"font-family":"Anton","font-size":26,"letter-spacing":1,"text-anchor":"middle",fill:"#2E7D32"},stk);
el("polygon",{points:star(13,5.5,5,0),fill:"#FFB300",stroke:INK,"stroke-width":2,transform:"translate(52,0)"},stk);
const steam=[]; for(let k=0;k<6;k++) steam.push(el("circle",{r:12,fill:"#FFFFFF",stroke:"#B0BEC5","stroke-width":3,opacity:0},W));
const drips=[0,1,2].map(()=>el("path",{d:"M0 -14 Q9 0 7 6 Q0 13 -7 6 Q-9 0 0 -14 Z",fill:"#6D4C41",stroke:INK,"stroke-width":2,opacity:0},W));
const puddle=el("ellipse",{rx:0,ry:0,fill:"#6D4C41",stroke:INK,"stroke-width":2,opacity:0},W);
const coffeeStream=el("path",{d:"",stroke:"#6D4C41","stroke-width":13,fill:"none","stroke-linecap":"round",opacity:0},W);
// sparkles (fake family drama) + hearts
const SPK=[]; for(let k=0;k<8;k++){const g=el("g",{opacity:0},fx); el("polygon",{points:star(24,7,4),fill:"#FFF59D",stroke:"#FFB300","stroke-width":3},g); SPK.push(g)}
const HRT=[]; for(let k=0;k<5;k++){const g=el("g",{opacity:0},fx); el("path",{d:"M0 14 C-30 -8 -18 -30 0 -16 C18 -30 30 -8 0 14 Z",fill:"#F48FB1",stroke:INK,"stroke-width":3},g); HRT.push(g)}

// ---------------- the cast ----------------
const RH=makeRamesh(homePeople,true,{badge:null,shirt:"#9EA3A8",sleeve:"#9EA3A8",fore:"#B9805A",trim:"#80868C",tee:true,pocket:false,untucked:true,legs:{pant:"#34507E",check:"#BFD0EA",bare:true}});   // home look
const RM=makeRamesh(people,true,{});                                                    // Monday: the usual light-blue shirt
const MG=makeManager(mgWrap,true,{});
people.insertBefore(RM.g,mgWrap);
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
  const st={x:0,y:0,s:1,armL:200,armR:160,lenL:115,lenR:115,talk:0,brow:"n",look:0,lookY:0,blink:0,wink:0,hop:0,smile:0,headRot:0};
  function draw(){const k=st; g.setAttribute("transform",`translate(${k.x},${k.y-k.hop}) scale(${k.s})`);
    head.setAttribute("transform",`rotate(${k.headRot} 0 -300)`);
    [[armL,-58,k.armL,k.lenL],[armR,58,k.armR,k.lenR]].forEach(([a,sx,deg,len])=>{const r=deg*Math.PI/180;a.setAttribute("x1",sx);a.setAttribute("y1",-280);a.setAttribute("x2",sx+Math.sin(r)*len);a.setAttribute("y2",-280-Math.cos(r)*len)});
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
const LN=i=>TL.lines.find(l=>l.i===i);
function talkOf(who,t){for(const l of TL.lines){if(l.who!==who)continue;const f=Math.floor((t-l.start)*TL.fps);if(f>=0&&f<l.env.length)return l.env[f]}return 0}
function curLine(t){return TL.lines.find(l=>t>=l.start-0.1&&t<l.start+l.dur+0.25)}
const S=i=>LN(i).start, E=i=>LN(i).start+LN(i).dur, D=i=>LN(i).dur;
const W0=(i,k)=>S(i)+LN(i).fseg[Math.min(k,LN(i).fseg.length-1)][0], W1=(i,k)=>S(i)+LN(i).fseg[Math.min(k,LN(i).fseg.length-1)][1];
function atIn(i,k,frac){return W0(i,k)+(W1(i,k)-W0(i,k))*frac}
const OV=(typeof window!=="undefined"&&window.BEAT_OVERRIDES)||{};
let B=null;
function beats(){ if(B) return B; B={};
  // SET 1: Sunday night
  B.titleIn=0.4; B.ping=1.0; B.dhoom=1.12; B.msg0=1.3; B.type0=1.35; B.type1=1.95; B.msgSmall=S(0)-0.15;
  B.upright=S(0)-0.05; B.chinna=W0(0,4)-0.03; B.faaah=E(0)+0.15; B.faaahE=B.faaah+1.05;
  B.tl0=B.faaahE; B.tl1=S(1)-1.05; B.fol0=B.tl0+0.08; B.tFol=B.tl0+0.72; B.fol1=B.tl1+0.05; B.am3=B.tl1-0.45;
  // SET 2: Monday
  B.mon=B.tl1; B.spin=S(1)-0.5; B.spinE=S(1)-0.15;
  B.complete=W0(1,1); B.sip1=E(1)+0.05;
  B.z0=S(2)-0.2; B.z1=E(2)+0.35;
  B.slap=atIn(3,1,0.4)-0.08; B.m3=S(3)-0.05;
  B.r4=S(4)-0.05; B.bloop=E(4)+0.02;
  B.ns1=S(5)-0.25; B.r6=S(6)-0.08; B.ph0=W0(6,0)+0.05; B.ph1=Math.min(E(6)+0.35,S(7)-0.5);
  B.fam=S(7)-0.45; B.violin=S(7)-0.3; B.tear=W0(7,1);
  B.r8=S(8)-0.05; B.jeetham=W0(8,3)-0.03; B.ns2=E(8)+0.03;
  B.dh=[E(8)+0.33,E(8)+0.63,E(8)+0.93]; B.faaah2=E(8)+1.4; B.faaah2E=B.faaah2+1.05;
  B.r9=S(9)-0.15; B.company=W0(9,2)-0.03;
  B.frz=E(9)+0.08; B.sil0=B.frz+0.32; B.sil1=B.sil0+0.30; B.react=B.sil1; B.slide=B.react+0.05; B.dripA=B.react+0.85; B.sting=B.react+0.25; B.laugh=B.react+0.35;
  B.card=B.react+1.5;
  B.c10=S(10)-0.15; B.tTag=W0(10,1); B.endSting=E(10)-0.25; B.end0=E(10)+0.05; B.tEF=B.end0+0.45;
  Object.assign(B,OV);
  return B}

const focus=(z,wx,wy,sx=540,sy=1000,r=0)=>({z,fx:wx-(sx-540)/z,fy:wy-(sy-1000)/z,r});
const mixCam=(a,b_,k)=>({z:lerp(a.z,b_.z,k),fx:lerp(a.fx,b_.fx,k),fy:lerp(a.fy,b_.fy,k),r:lerp(a.r||0,b_.r||0,k)});
// keep short Telugu words with a neighbour (never orphan one on its own line), and hand-made breaks for the long lines
const subFix=s=>s.replace(/…/g,"...").replace(/(^|\s)(మీ|నా|నీ|ఏం|ఏ|మన|ఒక|ఈ|ఆ|మా)\s/g,"$1$2&nbsp;").replace(/([^\s.!?;])\s([ఀ-౿]{1,2}[.,!?]*)(?=\s|$)/g,"$1&nbsp;$2")
  .replace(/(రాత్రి) (9) (గంటలకి)/,"$1&nbsp;$2&nbsp;$3").replace("గంటలకి చిన్న","గంటలకి<br>చిన్న").replace("రమేష్! టాస్క్","రమేష్!<br>టాస్క్").replace("గుడ్! నువ్వు","గుడ్!<br>నువ్వు")
  .replace("సార్. మరి","సార్.<br>మరి").replace("కూడా పని చేశాను","కూడా<br>పని చేశాను").replace("రమేష్... మనం","రమేష్...<br>మనం")
  .replace("సార్... ఫ్యామిలీ","సార్...<br>ఫ్యామిలీ").replace("వెళ్లినట్టు జీతం","వెళ్లినట్టు<br>జీతం").replace("అంటారు... కానీ","అంటారు...<br>కానీ").replace("వచ్చేసరికి కంపెనీ","వచ్చేసరికి<br>కంపెనీ")
  .replace("చేసే friend","చేసే<br>friend");

function frame(t){
  const b=beats(); T_=t;
  const home=t<b.mon, frozen=t>=b.frz&&t<b.react, fz2=t>=b.faaah2&&t<b.faaah2E, fz1=t>=b.faaah&&t<b.faaahE;
  const tl=t>=b.tl0&&t<b.tl1, react=t>=b.react, popFrz=t>=b.dhoom&&t<b.upright+0.45;
  // character time: stops in the freeze (+ silence) and FAAAH #2; slow-mo through FAAAH #1
  const T=frozen?b.frz:fz2?b.faaah2:fz1?b.faaah+(t-b.faaah)*0.2:t;
  HOME.style.display=home?"":"none"; OFF.style.display=home?"none":"";
  $("s").style.filter=frozen?`saturate(${lerp(1,0.65,clamp((t-b.frz)/0.08))}) contrast(1.06) brightness(1.03)`:(fz1||fz2)?"saturate(1.25) contrast(1.05)":"";
  const still=frozen||fz2;
  const R=(C,who,x,y,s)=>{resetPose(C,x,y,s,who&&!still?talkOf(who,t):0); C.st.blink=still?0:(((T*0.6+x*0.0013)%3.3)<0.11?1:0); return C.st};
  let wob=0;
  // ================= SET 1: Ramesh's flat =================
  if(home){
    const r=R(RH,"ramesh",HX,HHIP,HS); r.sit=0.62;
    // TV glow: abstract blobs drift (no show, no text)
    tvBlobs.forEach((c,i)=>{c.setAttribute("cx",20+Math.sin(t*1.3+i*1.7)*120+i*20); c.setAttribute("cy",1220+Math.cos(t*1.1+i*2.1)*90)});
    tvGlow.setAttribute("opacity",0.75+0.25*Math.sin(t*5));
    // the clock: 9:00 -> 3:00 in the time-lapse
    const tk=clamp((t-b.tl0)/(b.tl1-b.tl0)), hrs=9+6*ease(tk);
    hHour.setAttribute("transform",`rotate(${hrs*30})`); hMin.setAttribute("transform",`rotate(${hrs*360})`);
    let bowlOn=1, bowlX=HX+8, bowlY=HHIP-92*HS, bowlRot=0;
    if(t<b.ping){                                                        // bliss: leaning back, eyes shut, popcorn to the mouth
      r.rot=-3; r.headRot=-6; r.shut=1; r.smile=1; r.look=-0.3;
      RH.aim("L",HX-70,HHIP-120); const up=Math.max(0,Math.sin(t*4.2)); RH.aim("R",HX+60-up*40,HHIP-150-up*200); r.headY=Math.sin(t*2)*3 }
    else if(t<b.upright){                                                // PING: eyes open, phone up; DHOOM: popcorn freezes in the air
      r.rot=-3; r.look=0.2; r.lookY=0.7; r.wide=t>=b.dhoom?1:0; r.gasp=t>=b.dhoom?1:0; r.brow="u";
      RH.aim("L",HX-70,HHIP-120); RH.aim("R",HX+90,HHIP-300) }
    else if(t<b.faaah){                                                  // L1: bolt upright, disbelief -> wail
      r.rot=0; r.brow="u"; r.wide=1; r.look=0; r.lookY=0.2; r.headRot=Math.sin(t*9)*2;
      RH.aim("R",HX+100,HHIP-310); RH.aim("L",HX-110,HHIP-200);
      if(t>=b.chinna){ r.brow="a"; r.angry=0.5; RH.aim("L",HX-150,HHIP-420); r.spread=1 }
      r.hop=t<b.upright+0.15?Math.sin((t-b.upright)/0.15*Math.PI)*24:0 }
    else if(t<b.tl0){                                                    // FAAAH #1: arms up, the bowl explodes
      r.brow="a"; r.angry=0.8; r.gasp=1; r.wide=1; RH.aim("L",HX-170,HHIP-470); RH.aim("R",HX+170,HHIP-470); r.spread=1; r.headRot=-4;
      bowlY-=out((t-b.faaah)/0.2)*60; bowlRot=-25*out((t-b.faaah)/0.2) }
    else {                                                               // time-lapse: hunched over the laptop, typing; cups pile up
      bowlOn=0; r.rot=4; r.headRot=8; r.lookY=0.9; r.look=0; r.brow="w"; r.sad=tk>0.5?1:0; r.panda=clamp(tk*1.3); r.wild=tk>0.45?1:0; r.headY=10;
      const ty=Math.sin(t*38)*10; RH.aim("L",HX-70,HHIP-80+ty); RH.aim("R",HX+70,HHIP-80-ty) }
    RH.draw();
    // bowl + kernels on top; flying popcorn (a toss in the bliss, frozen at the DHOOM, explodes on FAAAH #1)
    bowlG.style.display=bowlOn?"":"none"; bowlG.setAttribute("transform",`translate(${bowlX},${bowlY}) rotate(${bowlRot}) scale(.8)`);
    bowlK.forEach((k,i)=>k.setAttribute("transform",`translate(${-80+i*16},${-30-Math.sin(i*1.9)*10-(i%3)*6})`));
    POP.forEach((p,i)=>{let on=false,x=0,y=0,rot=0;
      if(t<b.ping&&i<3){ const ph=fract(t*0.67+i/3); on=ph<0.35; const k=ph/0.35; x=bowlX-20+i*20+k*30; y=bowlY-30-Math.sin(k*Math.PI)*150 }
      else if(popFrz&&i<10){ const side=i%2?1:-1, j=Math.floor(i/2); x=HX+side*(150+j*45+hash(i)*20); y=HHIP-470+j*40-hash(i+2)*60; rot=i*40;    // frozen mid-air (beside his head)
        if(t>=b.upright){ const k=t-b.upright; x+=side*k*500; y+=1200*k*k-200*k } on=true }
      else if(t>=b.faaah&&t<b.tl0+0.3){ const k=(t-b.faaah); on=true; const a=-Math.PI/2+(hash(i+3)-0.5)*2.4, v=1100+hash(i+5)*900;
        x=bowlX+Math.cos(a)*v*k; y=bowlY-40+Math.sin(a)*v*k+900*k*k; rot=k*400*(hash(i)-0.5) }
      p.setAttribute("opacity",on?1:0); if(on) p.setAttribute("transform",`translate(${x},${y}) rotate(${rot}) scale(1.2)`)});
    // phone in his hand (PING .. L1), the laptop (time-lapse), the cups
    {const on=t>=b.ping&&t<b.faaah; phoneW.setAttribute("opacity",on?1:0); const ph=t<b.upright?[HX+90,HHIP-300]:[HX+100,HHIP-310];
     phoneW.setAttribute("transform",`translate(${ph[0]+12},${ph[1]-30}) rotate(${t<b.upright?-8:8}) scale(${1+(t>=b.ping&&t<b.ping+0.25?0.15*Math.sin((t-b.ping)/0.25*Math.PI):0)})`);
     phoneScr.setAttribute("fill",t>=b.ping&&t<b.ping+0.6&&Math.floor(t*12)%2===0?"#FFFFFF":"#B3E5FC")}
    lapG.setAttribute("opacity",tl?1:0); lapG.setAttribute("transform",`translate(${HX},${HHIP-40})`); lapGlow.setAttribute("opacity",0.25+0.15*Math.sin(t*20));
    cups.forEach((c,i)=>{const on=tl&&tk>0.12+i*0.17; c.setAttribute("opacity",on?1:0); c.setAttribute("transform",`translate(${975+(i%2?8:-6)},${1338-i*72}) scale(${on?Math.max(0.01,back((tk-0.12-i*0.17)/0.08)):0.01}) rotate(${(i%2?4:-4)})`)});
  }
  // ================= SET 2: the office =================
  let mgSX=1;
  if(!home){
    const m=R(MG,"manager",CH_X,CH_HIP,S85), r=R(RM,"ramesh",230,H85,S85);
    // Ramesh on Monday: panda eyes, wild hair, slumped
    r.panda=0.9; r.wild=1; r.brow="w"; r.look=0.6; r.rot=2; r.headRot=4; RM.aim("L",160,H85-40); RM.aim("R",300,H85-40);
    if(t<b.z0+0.1) r.vis=t>=b.spin?1:0;                                            // he shuffles in as the chair spins
    if(t>=b.spin&&t<b.z0){ const k=clamp((t-b.spin)/0.9); r.x=lerp(60,230,out(k)); r.walk=k<1?Math.sin(t*10)*0.5:0 }
    // the manager: seated in Ramesh's chair, mug in his right hand
    m.sit=0.6; m.item="mug"; m.smirk=1; m.brow="q"; m.look=-0.6; MG.aim("R",CH_X+120,CH_HIP-150); MG.aim("L",CH_X-80,CH_HIP-40);
    const sipping=(t>=b.sip1&&t<b.z0+0.2)||(t>=b.r4&&t<b.r6);
    const [hx,hy]=MG.headW();
    if(sipping){ MG.aim("R",hx+30,hy+70*S85); m.itemRot=-20 }
    if(t<b.spinE){ const k=clamp((t-b.spin)/(b.spinE-b.spin)); mgSX=k<0.5?0.001:Math.sin((k-0.5)*Math.PI); m.vis=k>=0.5?1:0 }
    if(t>=b.spinE&&t<S(1)+0.3){ m.smile=1; m.smirk=0; m.brow="u"; m.headRot=-4 }
    if(t>=b.complete&&t<E(1)+0.1){ m.smirk=1; m.smile=0; m.brow="q"; m.look=-0.8 }
    // L3 zombie: one flat breath, the fly
    if(t>=b.z0&&t<b.m3){ r.rot=3; r.headRot=8; r.lookY=0.5; r.look=0.4; r.sad=1 }
    // L4 praise + the sticker flick
    if(t>=b.m3&&t<b.r4){ m.smile=1; m.smirk=0; m.brow="u"; m.headRot=-5; m.rot=-2; m.look=-0.7;
      if(t>=b.slap-0.3&&t<b.slap+0.3) MG.aim("L",CH_X-200,CH_HIP-260);
      if(t>=b.slap){ r.gasp=t<b.slap+0.35?1:0; r.wide=r.gasp; r.headRot=t<b.slap+0.2?-8:4 } }
    // L5 the ask (hopeful, sweet), L6 'ఎందుకు?' (the mug stops mid-sip, one eyebrow up)
    if(t>=b.r4&&t<b.r6){ r.smile=1; r.sad=0; r.brow="u"; r.look=0.7; r.headRot=-4; r.rot=0; RM.aim("L",200,H85-200); RM.aim("R",260,H85-210); m.smile=0; m.smirk=0; m.brow="n"; m.look=-0.4 }
    if(t>=b.ns1&&t<b.r6+0.2){ m.brow="q"; m.look=-0.9; m.smile=0; m.smirk=0; m.itemRot=-20; r.smile=0; r.gasp=1; r.brow="u" }
    // L7 the plea: the phone held up with the 9 PM message
    if(t>=b.r6&&t<b.fam){ r.sad=1; r.brow="w"; r.look=0.7; r.headRot=-3; RM.aim("R",330,H85-330); RM.aim("L",250,H85-200); m.brow="q"; m.look=-0.6; m.smirk=1 }
    // L8 the fake family drama: he gets up, an arm round Ramesh, a fake tear; soft focus, sparkles, violin
    let famK=0;
    if(t>=b.fam){ famK=out((t-b.fam)/0.4); m.sit=lerp(0.6,0,famK); m.y=lerp(CH_HIP,H85,famK); m.x=lerp(CH_X,390,famK); m.hop=Math.sin(famK*Math.PI)*30 }
    if(t>=b.fam&&t<b.r8+0.2){ m.smile=1; m.smirk=0; m.brow="w"; m.look=-0.7; m.headRot=-8; MG.aim("L",170,H85-275*S85); m.tear=t>=b.tear?clamp((t-b.tear)/1.2):0; m.sad=0;
      r.sad=0; r.smile=0; r.brow="n"; r.look=0.6; r.lookY=0.2; r.headRot=4 }
    // L9 the turn: bright and sweet; the needle-stop; DHAN-DHAN-DHAN on the manager's 😳; FAAAH #2 (moustache bristles)
    if(t>=b.r8){ r.smile=1; r.brow="u"; r.look=0.8; r.headRot=-5; RM.aim("R",310,H85-300); if(t>=b.jeetham){ RM.aim("R",330,H85-380); r.spread=1; r.hop=t<b.jeetham+0.15?Math.sin((t-b.jeetham)/0.15*Math.PI)*12:0 } }
    if(t>=b.r8+0.5&&t<b.r9){ m.tear=0; m.smile=0; m.brow="n"; m.look=-0.5; MG.aim("L",m.x-90,H85-60) }
    if(t>=b.ns2&&t<b.r9){ m.wide=1; m.gasp=1; m.brow="u"; m.angry=0.9; m.sweat=1; m.look=-0.2; m.headRot=0; m.squash=t<b.dh[0]+0.1?0.96:1;
      r.smile=1; r.spread=0; RM.aim("R",290,H85-200) }
    if(t>=b.faaah2&&t<b.r9){ m.moBristle=6+Math.sin(t*90)*4; m.hop=0 }
    // L10 the punch: Ramesh to camera (the manager blurred behind); FREEZE on 'అంటారు!'
    const punch=t>=b.r9&&t<b.react;
    if(punch){ r.x=230+40; r.s=1.15; r.y=hipAt(1.15)+150; r.hop=0; r.smile=0; r.smirk=1; r.brow="q"; r.look=0; r.lookY=0; r.headRot=0; r.rot=0; r.spread=0;
      RM.aim("L",r.x-40,r.y-60); RM.aim("R",r.x+40,r.y-60); if(t>=b.company){ r.brow="q"; r.headRot=-3; RM.aim("R",r.x+150,r.y-330) }
      m.wide=0; m.gasp=0; m.angry=0.4; m.sweat=1; m.moBristle=0; m.look=-0.5 }
    MG.g.setAttribute("filter",punch?"url(#bgBlur)":""); if(!punch) MG.g.removeAttribute("filter");
    people.appendChild(punch?RM.g:mgWrap);
    // REACTION (no dialogue): the moustache slowly droops, the mug tilts, coffee drips on his shoe
    if(react){ const k=clamp((t-b.react)/1.3); m.x=390; m.y=H85; m.sit=0; m.blank=1; m.angry=0; m.sweat=1; m.moDroop=ease(clamp((t-b.react)/0.65))*1.25; m.headRot=-3*k; m.look=0;
      MG.aim("R",390+80,H85-125); m.itemRot=lerp(0,72,ease(clamp((t-b.react-0.5)/0.4))); MG.aim("L",390-70,H85-40); r.vis=0 }
    RM.draw(); MG.draw();
    mgWrap.setAttribute("transform",`translate(${CH_X},0) scale(${mgSX},1) translate(${-CH_X},0)`);
    // the chair: its back hides him until the spin; afterwards it stands behind him (until he gets up)
    {const k=clamp((t-b.spin)/(b.spinE-b.spin)); const frSX=t<b.spin?1:k<0.5?Math.cos(k*Math.PI):0.001;
     chairFr.setAttribute("transform",`translate(${CH_X},0) scale(${frSX},1)`); chairFr.style.display=frSX>0.01?"":"none";
     const bkSX=t<b.spin?0.001:k<0.5?0.001:Math.sin((k-0.5)*Math.PI); chairWrap.setAttribute("transform",`translate(${CH_X},0) scale(${bkSX},1)`);
     spinLines.setAttribute("opacity",t>=b.spin&&t<b.spinE+0.1?1:0)}
    // the fly round zombie Ramesh's head
    {const on=t>=b.z0&&t<b.z1; const [hx_,hy_]=RM.headW(); const a=t*7; fly.setAttribute("opacity",on?1:0);
     const fx_=hx_+Math.cos(a)*110, fy_=hy_-60+Math.sin(a*1.3)*45; fly.setAttribute("transform",`translate(${fx_},${fy_}) scale(${Math.cos(a)<0?-1.8:1.8},1.8)`);
     [wingA,wingB].forEach((w,i)=>w.setAttribute("ry",3+3*Math.abs(Math.sin(t*90+i))));
     flyTrail.setAttribute("opacity",on?0.5:0); if(on){ const p=[]; for(let j=1;j<=8;j++){const aa=a-j*0.12; p.push(`${(hx_+Math.cos(aa)*110).toFixed(0)},${(hy_-60+Math.sin(aa*1.3)*45).toFixed(0)}`)} flyTrail.setAttribute("d","M"+p.join(" L")) }}
    // the DEDICATED ⭐ sticker: flicked from his hand, slapped on Ramesh's forehead, stays (until the punch close-up)
    {const on=t>=b.slap-0.18&&t<b.react; stk.setAttribute("opacity",on?1:0);
     if(on){ const [hx_,hy_]=RM.headW(); const tx_=hx_+4, ty_=hy_-52*RM.st.s; const k=clamp((t-b.slap+0.18)/0.18);
       const x=lerp(CH_X-200,tx_,ease(k)), y=lerp(CH_HIP-280,ty_,ease(k))-Math.sin(k*Math.PI)*80; const sl=t>=b.slap?lerp(1.6,1,clamp((t-b.slap)/0.08)):1;
       stk.setAttribute("transform",`translate(${x},${y}) rotate(${lerp(-40,-6,k)}) scale(${0.8*RM.st.s/S85*sl})`)}}
    // mug steam (villain smoke) while he sits
    steam.forEach((p_,i)=>{const f=fract(t*0.9+i/6); const on=t>=b.spinE&&t<b.fam; const [hx_,hy_]=MG.headW();
      p_.setAttribute("cx",CH_X+130+Math.sin(f*6+i)*16); p_.setAttribute("cy",CH_HIP-210-f*170); p_.setAttribute("r",8+f*16); p_.setAttribute("opacity",on&&!sipping?(1-f)*0.6:0)});
    // coffee: a stream + drips onto his right shoe, a puddle that grows
    {const on=react; const mx_=390+80+30, my_=H85-125-10; const shoeX=390+56*S85+6, shoeY=FEET-24;
     coffeeStream.setAttribute("opacity",on&&t>=b.react+0.78&&t<b.react+1.05?1:0); coffeeStream.setAttribute("d",`M${mx_} ${my_} Q${mx_+8} ${my_+60} ${shoeX} ${shoeY-260}`);
     drips.forEach((d_,i)=>{const t0=b.dripA+i*0.42, k=(t-t0)/0.4; const v=on&&k>0&&k<1; d_.setAttribute("opacity",v?1:0);
       if(v) d_.setAttribute("transform",`translate(${lerp(mx_,shoeX,k*0.2+0.8*k*k)},${lerp(my_,shoeY,k*k)}) scale(2.2)`)});
     const pk=clamp((t-b.dripA-0.35)/1.0); puddle.setAttribute("opacity",on&&pk>0?1:0); puddle.setAttribute("cx",shoeX); puddle.setAttribute("cy",shoeY+6); puddle.setAttribute("rx",18+50*pk); puddle.setAttribute("ry",6+10*pk)}
  }
  // FAAAH bursts (behind the head they hit)
  {const h1=t>=b.faaah-0.03&&t<b.faaahE+0.05, h2=t>=b.faaah2-0.03&&t<b.faaah2E+0.05; const on=h1||h2, t0=h1?b.faaah:b.faaah2;
   const C=h1?RH:MG; const [hx,hy]=C.headW(); const k=Math.max(0.01,back((t-t0+0.03)/0.18)); burst.style.display=burstT.style.display=on?"":"none";
   const host=h1?homePeople:people; if(on&&burst.parentNode!==host.parentNode){ host.parentNode.insertBefore(burst,host) } if(on) host.parentNode.appendChild(burstT);   // the FAAAH text on top of everything (popcorn included)
   burst.setAttribute("transform",`translate(${hx},${hy}) scale(${0.8*k}) rotate(${(t-t0)*30})`);
   burstT.setAttribute("transform",`translate(${hx+10},${hy-160*C.st.s}) scale(${0.62*k}) rotate(-6)`)}

  // ---------------- Gopi (narrator badge): the tag ----------------
  const g=GOPI.st; const narOn=t>b.c10&&t<b.end0;
  Object.assign(g,{x:0,y:400*0.55+12,s:0.55,talk:talkOf("gopi",t),blink:((t*0.7)%3.1)<0.12?1:0,wink:0,look:-0.5,lookY:0,brow:"q",smile:1,headRot:Math.sin(t*2.2)*3,armL:200,armR:160,lenL:115,lenR:115,hop:0});
  GOPI.draw();
  const bs=narOn?Math.max(0.001,back((t-b.c10)/0.35)):0;
  badge.setAttribute("transform",`translate(920,1390) scale(${bs*0.8}) rotate(${Math.sin(t*2)*2})`); badge.style.opacity=narOn?1:0;

  // ---------------- camera ----------------
  const pu=(t0,a_=0.1,k=5)=>t>t0?a_*Math.exp(-(t-t0)*k)*clamp((t-t0)/0.04):0;
  const HHY=HHIP-392*HS, HY=H85-392*S85, MHY=CH_HIP-392*S85;
  const shots=[
    [0,focus(0.86,470,1180,540,1060)],                                                   // the flat: TV, couch, window, clock
    [0.15,focus(0.98,520,1200,540,1060),0.85],                                           // slow push on the bliss
    [b.dhoom,focus(1.5+pu(b.dhoom,0.15),HX+40,HHY+60,540,1000,-2),0.05],                // DHOOM punch-in
    [b.upright,focus(1.25,HX,HHY+150,540,1000),0.12],                                     // L1 bolt upright
    [b.chinna,focus(1.6+pu(b.chinna,0.08),HX,HHY+40,540,980),0.06],                      // 'చిన్న' punch-in
    [b.faaah,focus(1.95,HX,HHY+20,540,980),0.08],                                        // FAAAH #1
    [b.tl0,focus(0.9,560,1150,540,1040),0.2],                                            // time-lapse wide (clock + cups)
    [b.tl0+0.3,focus(1.0,600,1160,540,1040),b.tl1-b.tl0-0.3],
    [b.mon,focus(0.9,430,1180,540,1060),0.01],                                           // Monday: the office, the chair from behind
    [b.spin,focus(1.05,470,1170,540,1060),0.3],
    [b.complete,focus(1.3+pu(b.complete,0.06),CH_X-50,MHY+90,540,960),0.08],              // 'కంప్లీట్' punch on him
    [b.z0,focus(1.5,230,HY+90,540,960),0.1],                                             // zombie Ramesh + the fly
    [b.m3,focus(1.0,420,1150,540,1050),0.12],                                            // two-shot: the praise + sticker
    [b.slap,focus(1.35+pu(b.slap,0.12,8),300,HY+120,540,980),0.04],                      // sticker SLAP punch-in
    [b.r4,focus(1.0,420,1150,540,1050),0.2],                                             // the ask (two-shot)
    [b.ns1,focus(1.9+pu(b.ns1,0.1,8),CH_X,MHY+40,540,940),0.04],                         // 'ఎందుకు?' snap zoom: the eyebrow
    [b.r6,focus(1.15,330,1130,540,1020),0.15],                                           // the plea + the phone
    [b.fam,focus(1.3,320,1100,540,1030),0.4],                                            // family drama two-shot
    [b.tear,focus(1.6,330,HY+140,540,980),1.5],                                          // slow push (soft focus)
    [b.r8,focus(1.15,300,1120,540,1030),0.15],                                           // the turn
    [b.jeetham,focus(1.55+pu(b.jeetham,0.06),230,HY+90,540,960),0.06],                    // 'జీతం' punch on Ramesh
    [b.dh[0],focus(1.6,390,HY+30,540,920),0.0],                                          // DHAN
    [b.dh[1],focus(2.1,390,HY+20,540,920),0.0],                                          // DHAN
    [b.dh[2],focus(2.7,390,HY+15,540,920),0.0],                                          // DHAAN
    [b.faaah2,focus(2.2,390,HY+20,540,960),0.06],                                        // FAAAH #2
    [b.r9,focus(1.45,270,900,330,860),0.01],                                             // Ramesh to camera (the manager blurred behind)
    [b.company,focus(1.6,270,900,330,860),0.12],                                         // 'కంపెనీ' push
    [b.react,focus(2.5,392,H85-392*S85+30,540,900),0.01],                                // REACTION: the moustache droops (face)                                         // REACTION: the manager head to shoe
    [b.react+0.75,focus(1.72,410,1300,540,1060),0.35],                                   // then the mug + the drips on his shoe
  ];
  let cm=shots[0][1];
  {let i=0; while(i+1<shots.length&&t>=shots[i+1][0]) i++;
   const [t0,c,tr]=shots[i]; cm=c;
   if(i>0&&tr&&t<t0+tr){ const prev=shots[i-1][1]; cm=mixCam(prev,c,ease((t-t0)/tr)) }}
  if(frozen) cm={...cm,z:cm.z*(1+0.04*clamp((t-b.frz)/0.25))};
  let sx=0,sy=0; const shake=(t0,d,a_)=>{if(t>t0&&t<t0+d){const q=(1-(t-t0)/d)*a_; sx+=Math.sin(t*90)*q; sy+=Math.cos(t*77)*q}};
  shake(b.dhoom,0.45,22); shake(b.faaah,0.3,14); shake(b.slap,0.2,10); shake(b.dh[0],0.2,16); shake(b.dh[1],0.2,18); shake(b.dh[2],0.25,22); shake(b.faaah2,0.3,14); shake(b.frz,0.12,10); shake(b.mon,0.2,10);
  if(tl){ sx+=Math.sin(t*50)*2 }
  cam.setAttribute("transform",`translate(${540+sx},${1000+sy}) rotate(${cm.r||0}) scale(${cm.z}) translate(${-cm.fx},${-cm.fy})`);
  const scr=(wx,wy)=>{const r_=(cm.r||0)*Math.PI/180, dx=(wx-cm.fx)*cm.z, dy=(wy-cm.fy)*cm.z; return [540+dx*Math.cos(r_)-dy*Math.sin(r_)+sx, 1000+dx*Math.sin(r_)+dy*Math.cos(r_)+sy]};
  // sparkles + hearts (fake family drama)
  const famOn=t>=b.fam+0.1&&t<b.ns2;
  SPK.forEach((s_,i)=>{const a=i/8*Math.PI*2+t*0.8; s_.setAttribute("opacity",famOn?0.5+0.5*Math.sin(t*6+i):0); s_.setAttribute("transform",`translate(${540+Math.cos(a)*420},${900+Math.sin(a)*520}) scale(${0.8+0.3*Math.sin(t*5+i)}) rotate(${t*60})`)});
  HRT.forEach((h_,i)=>{const k=fract(t*0.5+i/5); h_.setAttribute("opacity",famOn?(1-k)*0.9:0); h_.setAttribute("transform",`translate(${200+i*170+Math.sin(k*8+i)*20},${1300-k*500}) scale(${1+k*0.5})`)});

  // ---------------- HTML overlays ----------------
  {const sf=$("soft"); sf.style.opacity=famOn?clamp(Math.min((t-b.fam-0.1)/0.3,(b.ns2-t)/0.05)):0;
   if(famOn) $("s").style.filter="brightness(1.06) saturate(.9) blur(1.2px)"}
  {const on=t<S(0)-0.05; $("hook").style.opacity=on?clamp((S(0)-0.05-t)/0.1):0;
   $("hook").style.transform=`rotate(${-1.5+Math.sin(t*3)*0.6}deg) scale(${t<0.25?1+0.08*Math.sin(t/0.25*Math.PI):1})`;
   const ti=$("title"), ton=t>b.titleIn&&t<b.msg0; ti.style.opacity=ton?1:0; ti.style.transform=`scale(${Math.max(0.01,back((t-b.titleIn)/0.3))}) rotate(-2deg)`}
  const schip=(id,on,px,py,t0,rot,s=1)=>{const e=$(id); if(!on){e.style.opacity=0;return} e.style.opacity=1; e.style.left=px+"px"; e.style.top=py+"px"; e.style.transform=`translate(-50%,-50%) scale(${Math.max(0.01,pop(t,t0,0.3))*s}) rotate(${rot}deg)`};
  schip("cSun",t>0.25&&t<b.dhoom,820,1180,0.25,4);
  schip("c3am",tl&&t>b.am3,800,600,b.am3,-4);
  // the manager's message on the phone (pops big on the DHOOM, types in, holds ~2 s; small in the corner during L1; held up in L7)
  {const ph=$("phone"); let on=false, x=540, y=900, s=1, rot=-2;
   if(t>=b.msg0&&t<b.faaah){ on=true; const k=clamp((t-b.msgSmall)/0.3); x=lerp(540,850,ease(k)); y=lerp(860,560,ease(k)); s=Math.max(0.01,back((t-b.msg0)/0.3))*lerp(1,0.42,ease(k)); rot=lerp(-2,6,k) }
   if(t>=b.ph0&&t<b.ph1){ on=true; x=760; y=610; s=Math.max(0.01,back((t-b.ph0)/0.25))*0.6; rot=5 }
   ph.style.opacity=on?1:0; if(on){ ph.style.left=(x-310)+"px"; ph.style.top=(y-330)+"px"; ph.style.transform=`scale(${s}) rotate(${rot}deg)` }
   const typed=t>=b.type1||t>=b.ph0; $("pDots").style.display=typed?"none":""; $("pMsg").style.display=typed?"":"none"; $("pSt").textContent=typed?"online":"typing..."}
  // the MONDAY card: slams big, then a small label under the top bar until the zombie line
  {const e=$("mon"), on=t>=b.mon&&t<b.z0; if(!on) e.style.opacity=0; else { const k=out((t-b.mon-0.45)/0.25), sl=lerp(1.9,1,out((t-b.mon)/0.12));
    e.style.opacity=1; e.style.top=lerp(430,150,k)+"px"; e.style.transform=`scale(${sl*lerp(1,0.5,k)}) rotate(${lerp(-3,0,k)}deg)`; e.style.transformOrigin="50% 0" }}
  // the manager's 😳 (a reaction, not a line): beside his head on the crash zooms
  {const e=$("emo"), on=t>=b.dh[0]&&t<b.faaah2; e.style.opacity=on?1:0;
   if(on){ const [hx,hy]=MG.headW(); const [px,py]=scr(hx,hy); const st_=t>=b.dh[2]?2:t>=b.dh[1]?1:0; e.style.left=Math.min(900,px+230)+"px"; e.style.top=Math.max(380,py-280)+"px";
     e.style.transform=`translate(-50%,-50%) scale(${lerp(1.5,1,clamp((t-b.dh[st_])/0.1))*(0.8+0.15*st_)}) rotate(${(st_-1)*8}deg)` }}
  show("frz",frozen,1,"");
  // follow tap (silent, in the time-lapse)
  const fA=b.fol0, fB=b.fol1; const fOn=t>fA&&t<fB; const fol=$("fol"); fol.style.opacity=fOn?clamp(Math.min((t-fA)/0.15,(fB-t)/0.1)):0;
  fol.style.transform=`scale(${Math.max(0.01,back((t-fA)/0.3))*(Math.abs(t-b.tFol)<0.1?0.9:1)})`;
  const bF=$("bF"); bF.textContent=t<b.tFol?"+ FOLLOW":"FOLLOWING ✓"; bF.className="btn"+(t<b.tFol?"":" done");
  {const FX=955, FY=1335; const hand=$("tapHand"); const hk=ease((t-fA-0.05)/Math.max(0.3,b.tFol-fA-0.1)); const dip=Math.max(0,1-Math.abs(t-b.tFol)/0.1);
   hand.style.opacity=fOn?clamp(Math.min((t-fA-0.05)/0.12,(fB-t)/0.1)):0; hand.style.transform=`translate(${lerp(1000,FX,hk)-50}px,${lerp(1560,FY,hk)+dip*12}px) rotate(${-8+dip*6}deg)`;
   const rg_=$("ring"), rk=(t-b.tFol)/0.4; rg_.style.opacity=fOn&&rk>0&&rk<1?1-rk:0; rg_.style.left=FX+"px"; rg_.style.top=FY+"px"; rg_.style.transform=`scale(${1+rk*6})`}
  // the ending card (owner's words), held ~3 s
  {const e=$("ecard"), on=t>=b.card&&t<b.c10+0.05; e.style.opacity=on?clamp(Math.min((t-b.card)/0.08,(b.c10+0.05-t)/0.1)):0;
   e.querySelector(".l1").style.transform=`scale(${Math.max(0.01,lerp(1.8,1,out((t-b.card)/0.14)))}) rotate(-2deg)`;
   e.querySelector(".l2").style.opacity=clamp((t-b.card-0.35)/0.2); e.querySelector(".l2").style.transform=`translateY(${lerp(30,0,out((t-b.card-0.35)/0.25))}px)`}
  // share: tag a Sunday-working friend
  {const shOn=t>b.c10&&t<b.end0+0.1; const sh=$("share"); sh.style.opacity=shOn?clamp(Math.min((t-b.c10)/0.2,(b.end0+0.1-t)/0.12)):0;
   $("sq").style.transform=`scale(${Math.max(0.01,back((t-b.c10)/0.4))})`;
   const tA=b.c10+0.35; $("cin").innerHTML=t>tA?(t>b.tTag+0.05?'<em>@Office Bestie 💼</em> 😅':"@"+(t>tA+0.25?"Offi":"")):"";
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
   add(b.ping,0.08,0.3,"#FFFFFF"); add(b.dhoom,0.12,0.5,"#FF5A3C"); add(b.faaah,0.12,0.6,"#E53935"); add(b.mon,0.1,0.4,"#FFFFFF"); add(b.slap,0.08,0.3,"#FFFFFF");
   b.dh.forEach(x=>add(x,0.1,0.55,"#E53935")); add(b.faaah2,0.12,0.6,"#E53935"); add(b.frz,0.16,0.85,"#FFFFFF"); add(b.react,0.06,0.25,"#FFFFFF");
   $("flash").style.opacity=a; $("flash").style.background=col}
  // subtitles (… -> ...)
  const sub=$("sub"), L=curLine(t);
  if(L&&!(t>=b.card&&t<b.c10)){sub.style.opacity=1; sub.innerHTML=`<span class="who" style="background:${COLORS[L.who]}">${NAMES[L.who]}</span><br>${subFix(L.text)}`} else sub.style.opacity=0;
}
function show(id,on,s=1,extra=""){const e=$(id); e.style.opacity=on?1:0; if(on) e.style.transform=`${extra} scale(${Math.max(0.01,s)})`}

window.render=function(t){ frame(t) };
