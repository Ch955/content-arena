// Office comedy Ep 1 "🎄 Operation Red Flower" — sets + choreography (loaded by ep.html after office_cast.js).
// Scenes: S1 the open office (villain entry from the cabin, the announcement, Ramesh at his desk) -> PANTRY (the secret
// meeting) -> CHAIRS (musical chairs, FAAAH #1, the silent follow tap) -> TRUTH (truth or dare: bottle, spotlight, VIP
// pass, DHAN x3) -> AWARD (garland + Santa hat, FAAAH #2, plaque STAMP, the threat, the silence, Ramesh's punch to camera,
// DONK, 'Merry Christmas Sir!' FREEZE) -> comment / tag / Episode 2 / end card over the frozen still.
// comment bubbles: generic names, no real usernames
const CB=[["Ravi","😂😂😂","#1E88E5",70,1110],["Divya","Best Running Coach award 🏃","#D81B60",250,1220],["Teja","Overtime King 👑","#2E7D32",110,1330]];
$("cbs").innerHTML=CB.map(([n,g,c,x,y],i)=>`<div class="cb" id="cb${i}" style="left:${x}px;top:${y}px"><b style="color:${c}">${n}</b><i>${g}</i></div>`).join("");

const defs=el("defs",{});
const cam=el("g",{});
applySkin(cam, defs);
const W=el("g",{id:"world"},cam);
const P_=4200;                         // the pantry set's x offset
const FEET=1700;                       // floor line for standing people on the office floor
const hipAt=s=>FEET-448*s;

// ===== OPEN OFFICE (x -700..2000), dressed for the office Christmas party =====
el("rect",{x:-900,y:-900,width:3200,height:2300,fill:"#EAF3F8"},W);
el("rect",{x:-900,y:1380,width:3200,height:22,fill:"#B7C6D3"},W);
el("rect",{x:-900,y:1402,width:3200,height:1400,fill:"#CDD7E0"},W);
for(let k=0;k<14;k++) el("line",{x1:-900+k*260,y1:1402,x2:-1400+k*360,y2:2600,stroke:"#BCC8D3","stroke-width":5},W);
for(let y=1480;y<2400;y+=110) el("line",{x1:-900,y1:y,x2:2300,y2:y,stroke:"#BCC8D3","stroke-width":4},W);
// streamers (red / green zigzag) + bunting
const strm=el("g",{},W);
[[60,"#E53935",0],[110,"#2E7D32",60]].forEach(([y,c,ph])=>{let p=[]; for(let x=-800;x<=2100;x+=60) p.push(`${x},${y+((x/60+ph/60)%2?26:0)}`); el("polyline",{points:p.join(" "),fill:"none",stroke:c,"stroke-width":9,"stroke-linejoin":"round"},strm)});
const bunt=[]; for(let k=0;k<26;k++){const x=-760+k*110; const f=el("polygon",{points:`${x-26},148 ${x+26},148 ${x},198`,fill:["#E53935","#FFD54F","#43A047"][k%3],stroke:INK,"stroke-width":3},strm); bunt.push(f)}
el("path",{d:"M-800 148 Q600 170 2100 148",stroke:INK,"stroke-width":3,fill:"none"},strm);
// the banner (office party): MERRY CHRISTMAS
const bannerG=el("g",{},W);
el("line",{x1:190,y1:220,x2:190,y2:160,stroke:INK,"stroke-width":4},bannerG); el("line",{x1:870,y1:220,x2:870,y2:160,stroke:INK,"stroke-width":4},bannerG);
const bannerB=el("g",{},bannerG);
el("rect",{x:170,y:220,width:720,height:116,rx:16,fill:"#D32F2F",stroke:INK,"stroke-width":7},bannerB);
el("rect",{x:184,y:232,width:692,height:92,rx:10,fill:"none",stroke:"#FFD54F","stroke-width":4,"stroke-dasharray":"14 10"},bannerB);
txt("MERRY CHRISTMAS",{x:530,y:305,"font-family":"Anton","font-size":66,"letter-spacing":4,"text-anchor":"middle",fill:"#FFFFFF"},bannerB);
// a paper star on a string
const starG=el("g",{},W);
el("line",{x1:0,y1:-160,x2:0,y2:-62,stroke:INK,"stroke-width":3},starG);
{const p=[]; for(let k=0;k<10;k++){const r=k%2?26:64, a=-Math.PI/2+k*Math.PI/5; p.push(`${(Math.cos(a)*r).toFixed(1)},${(Math.sin(a)*r).toFixed(1)}`)}
 el("polygon",{points:p.join(" "),fill:"#FFD54F",stroke:INK,"stroke-width":5,"stroke-linejoin":"round"},starG); el("polygon",{points:p.join(" "),fill:"none",stroke:"#FFF59D","stroke-width":3,transform:"scale(.6)"},starG)}
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
// tinsel on the partitions (sparkles on 'Christmas games!')
const tinsel=el("g",{},cubP);
{let p=[]; for(let x=-700;x<=1000;x+=34) p.push(`${x},${1150+Math.sin(x/34*1.3)*10}`); el("polyline",{points:p.join(" "),fill:"none",stroke:"#FFD54F","stroke-width":7,"stroke-linecap":"round"},tinsel)}
const twinkles=[]; for(let k=0;k<16;k++){const t_=el("circle",{cx:-660+k*106,cy:1150+Math.sin(k*1.7)*10,r:9,fill:"#FFF59D",opacity:0},tinsel); twinkles.push(t_)}
// a small decorated tree by the reception (left)
const treeG=el("g",{transform:"translate(-480,1700)"},W);
el("rect",{x:-60,y:-90,width:120,height:90,rx:10,fill:"#8D6E63",stroke:INK,"stroke-width":5},treeG);
[[-200,170,-90],[-330,140,-200],[-440,105,-320]].forEach(([top,w,bot])=>el("polygon",{points:`0,${top} ${w},${bot} ${-w},${bot}`,fill:"#2E7D32",stroke:INK,"stroke-width":5,"stroke-linejoin":"round"},treeG));
const baubles=[[-60,-120,"#E53935"],[70,-130,"#FFD54F"],[-30,-230,"#1E88E5"],[50,-250,"#E53935"],[0,-350,"#FFD54F"],[-90,-110,"#FFD54F"],[100,-110,"#1E88E5"]].map(([x,y,c])=>el("circle",{cx:x,cy:y,r:14,fill:c,stroke:INK,"stroke-width":3},treeG));
const treeStar=el("g",{transform:"translate(0,-450)"},treeG);
{const p=[]; for(let k=0;k<10;k++){const r=k%2?14:34, a=-Math.PI/2+k*Math.PI/5; p.push(`${(Math.cos(a)*r).toFixed(1)},${(Math.sin(a)*r).toFixed(1)}`)} el("polygon",{points:p.join(" "),fill:"#FFD54F",stroke:INK,"stroke-width":4},treeStar)}
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
const doorDark=el("rect",{x:1180,y:430,width:270,height:950,fill:"#1B2733",opacity:0},W);   // the doorway behind the blasted door
W.appendChild(doorG);
// FAAAH burst (behind the manager): a flat red star burst + the word (world space, placed per hit)
const burst=el("g",{},W);
{const pts=[]; for(let k=0;k<28;k++){const r=k%2?150:260, a=k*Math.PI/14; pts.push(`${(Math.cos(a)*r).toFixed(0)},${(Math.sin(a)*r*0.86).toFixed(0)}`)}
 el("polygon",{points:pts.join(" "),fill:"#E53935",stroke:INK,"stroke-width":8,"stroke-linejoin":"round"},burst);
 el("polygon",{points:pts.join(" "),fill:"#FF8A65",transform:"scale(.62)"},burst)}
const burstT=el("g",{},W);
txt("FAAAH!",{x:0,y:0,"font-family":"Anton","font-size":120,"letter-spacing":2,"text-anchor":"middle",fill:"#FFE066",stroke:INK,"stroke-width":10,"paint-order":"stroke","stroke-linejoin":"round"},burstT);
// Ramesh's desk (S1): monitor (front), the 'SECONDARY ⭐' sticky note (Ep 0 callback), his helmet
const RDX=150, RDY=1450;
const rDesk=el("g",{},W);
el("rect",{x:RDX+110,y:RDY-250,width:250,height:180,rx:10,fill:"#37474F",stroke:INK,"stroke-width":5},rDesk);
el("rect",{x:RDX+124,y:RDY-236,width:222,height:150,rx:4,fill:"#64B5F6"},rDesk);
el("rect",{x:RDX+210,y:RDY-70,width:50,height:64,fill:"#455A64",stroke:INK,"stroke-width":4},rDesk);
const sticky=el("g",{transform:`translate(${RDX+290},${RDY-210}) rotate(8)`},rDesk);
el("rect",{x:-56,y:-34,width:112,height:68,fill:"#FFF176",stroke:INK,"stroke-width":3},sticky);
txt("SECONDARY",{x:0,y:-2,"font-family":"Anton","font-size":20,"text-anchor":"middle",fill:"#C62828"},sticky);
{const p=[]; for(let k=0;k<10;k++){const r=k%2?5:12, a=-Math.PI/2+k*Math.PI/5; p.push(`${(Math.cos(a)*r).toFixed(1)},${(Math.sin(a)*r+20).toFixed(1)}`)} el("polygon",{points:p.join(" "),fill:"#FFB300",stroke:INK,"stroke-width":1.5},sticky)}
const deskHelmet=el("g",{transform:`translate(${RDX-250},${RDY-4})`},rDesk); helmetShape(deskHelmet,0.9);
const rSeat=el("g",{},W);   // seated Ramesh goes here (between the desk back and the desk front)
const rDeskFront=el("g",{},W);
el("rect",{x:RDX-420,y:RDY-6,width:840,height:26,rx:6,fill:"#E9C9A0",stroke:INK,"stroke-width":5},rDeskFront);
el("rect",{x:RDX-400,y:RDY+20,width:800,height:520,fill:"#C9A57A",stroke:INK,"stroke-width":5},rDeskFront);
el("rect",{x:RDX-380,y:RDY+50,width:240,height:110,rx:6,fill:"none",stroke:"#A9855A","stroke-width":5},rDeskFront);
// musical chairs: 4 office chairs in a row with a GAP in the middle (where the manager 'sits')
const CHX=[150,400,860,1110], GAPX=630, SEATY=1520;
const chairs=el("g",{},W);
CHX.forEach(x=>{const c=el("g",{transform:`translate(${x},0)`},chairs);
  el("rect",{x:-78,y:SEATY-250,width:156,height:200,rx:30,fill:"#3949AB",stroke:INK,"stroke-width":6},c);
  el("rect",{x:-10,y:SEATY-52,width:20,height:44,fill:"#546E7A",stroke:INK,"stroke-width":3},c);
  el("rect",{x:-92,y:SEATY-14,width:184,height:40,rx:14,fill:"#283593",stroke:INK,"stroke-width":6},c);
  el("rect",{x:-9,y:SEATY+26,width:18,height:110,fill:"#78909C",stroke:INK,"stroke-width":3},c);
  el("path",{d:`M-80 ${FEET-30} L0 ${SEATY+130} L80 ${FEET-30}`,stroke:"#455A64","stroke-width":12,fill:"none","stroke-linecap":"round"},c);
  [-80,0,80].forEach(dx=>el("circle",{cx:dx,cy:FEET-22,r:12,fill:"#263238",stroke:INK,"stroke-width":3},c))});
// truth or dare: a small round party table + the bottle
const TBX=600, TBY=1520;
const table=el("g",{},W);
el("rect",{x:TBX-12,y:TBY+20,width:24,height:150,fill:"#6D4C41",stroke:INK,"stroke-width":4},table);
el("ellipse",{cx:TBX,cy:FEET-10,rx:80,ry:16,fill:"#5D4037",stroke:INK,"stroke-width":4},table);
el("ellipse",{cx:TBX,cy:TBY+10,rx:190,ry:46,fill:"#8D6E63",stroke:INK,"stroke-width":6},table);
el("ellipse",{cx:TBX,cy:TBY,rx:190,ry:46,fill:"#FFFDF5",stroke:INK,"stroke-width":6},table);
el("path",{d:`M${TBX-190} ${TBY} Q${TBX} ${TBY+80} ${TBX+190} ${TBY}`,fill:"#E53935",opacity:.85},table);   // red party tablecloth hem
const bottleG=el("g",{},table);
const bottle=el("g",{},bottleG);
el("rect",{x:-70,y:-17,width:100,height:34,rx:16,fill:"#43A047",stroke:INK,"stroke-width":4},bottle);
el("rect",{x:28,y:-9,width:44,height:18,rx:6,fill:"#43A047",stroke:INK,"stroke-width":4},bottle);
el("rect",{x:66,y:-11,width:12,height:22,rx:3,fill:"#FFD54F",stroke:INK,"stroke-width":3},bottle);
el("rect",{x:-50,y:-10,width:40,height:8,rx:4,fill:"#A5D6A7",opacity:.9},bottle);
// VIP lanyard card on Suresh (world, follows his chest)
const vipG=el("g",{},W);
el("path",{d:"M-26 -70 Q-20 -30 -10 0 M26 -70 Q20 -30 10 0",stroke:"#FFB300","stroke-width":9,fill:"none"},vipG);
el("rect",{x:-48,y:0,width:96,height:64,rx:10,fill:"#FFD54F",stroke:INK,"stroke-width":4},vipG);
txt("VIP",{x:0,y:46,"font-family":"Anton","font-size":40,"letter-spacing":2,"text-anchor":"middle",fill:INK},vipG);
// spotlight cone (truth or dare: 'సురేష్!')
const cone=el("polygon",{points:"0,0 0,0 0,0",fill:"#FFF59D",opacity:0},W);

// ===== PANTRY (x P_-700..P_+1700): warm wall, upper cabinets, whiteboard, counter, kettle, tea cups, a warm lamp =====
const PAN=el("g",{},W);
el("rect",{x:P_-900,y:-900,width:3000,height:2300,fill:"#F3DDBE"},PAN);
el("rect",{x:P_-900,y:1402,width:3000,height:1400,fill:"#D8C09C"},PAN);
for(let k=0;k<20;k++) el("line",{x1:P_-900+k*160,y1:1402,x2:P_-900+k*160,y2:2400,stroke:"#C8AE88","stroke-width":4},PAN);
for(let k=0;k<4;k++) el("rect",{x:P_+860+k*230,y:250,width:210,height:300,rx:8,fill:"#C99D6B",stroke:INK,"stroke-width":5},PAN);
el("rect",{x:P_-700,y:1180,width:2400,height:34,rx:6,fill:"#ECEFF1",stroke:INK,"stroke-width":5},PAN);
el("rect",{x:P_-690,y:1214,width:2380,height:500,fill:"#B98A5A",stroke:INK,"stroke-width":5},PAN);
for(let k=0;k<8;k++) el("rect",{x:P_-660+k*300,y:1240,width:270,height:430,rx:8,fill:"none",stroke:"#9C7246","stroke-width":5},PAN);
// whiteboard + the plan (drawn on in L3)
const WB=el("g",{transform:`translate(${P_+110},400)`},PAN);
el("rect",{x:0,y:0,width:640,height:400,rx:12,fill:"#FFFFFF",stroke:"#78909C","stroke-width":14},WB);
el("rect",{x:40,y:400,width:560,height:16,rx:4,fill:"#90A4AE",stroke:INK,"stroke-width":3},WB);
const wbClip=el("clipPath",{id:"wbClip"},defs); const wbClipR=el("rect",{x:P_+110,y:400,width:0,height:400},wbClip);
const wbInk=el("g",{"clip-path":"url(#wbClip)"},PAN);
{const g=el("g",{transform:`translate(${P_+110},380)`},wbInk);
 [64,44,24].forEach((r,k)=>el("circle",{cx:120,cy:150,r,fill:"none",stroke:"#D32F2F","stroke-width":9},g)); el("circle",{cx:120,cy:150,r:8,fill:"#D32F2F"},g);
 el("line",{x1:200,y1:80,x2:126,y2:146,stroke:"#1E88E5","stroke-width":8,"stroke-linecap":"round"},g); el("path",{d:"M196 70 L214 66 L208 86",fill:"#1E88E5"},g);
 txt("TARGET:",{x:230,y:180,"font-family":"Anton","font-size":76,"letter-spacing":2,fill:"#D32F2F"},g);
 txt("MANAGER",{x:80,y:300,"font-family":"Anton","font-size":112,"letter-spacing":3,fill:"#D32F2F"},g);
 el("path",{d:"M70 322 Q320 346 590 316",stroke:"#D32F2F","stroke-width":9,fill:"none","stroke-linecap":"round"},g)}
// kettle + cups on the counter
const KX=P_+1180;
const kettle=el("g",{transform:`translate(${KX},1180)`},PAN);
el("path",{d:"M-60 0 L-50 -120 Q0 -140 50 -120 L60 0 Z",fill:"#ECEFF1",stroke:INK,"stroke-width":5},kettle);
el("path",{d:"M50 -100 Q100 -100 92 -40 Q86 -10 58 -14",stroke:INK,"stroke-width":10,fill:"none"},kettle);
el("path",{d:"M-52 -96 L-98 -126 L-92 -112 L-56 -80 Z",fill:"#ECEFF1",stroke:INK,"stroke-width":4},kettle);
el("rect",{x:-70,y:0,width:140,height:18,rx:6,fill:"#37474F",stroke:INK,"stroke-width":4},kettle);
const kLed=el("circle",{cx:0,cy:-30,r:9,fill:"#455A64",stroke:INK,"stroke-width":2},kettle);
const kSteam=[0,1,2].map(k=>el("circle",{cx:-96,cy:-140,r:12,fill:"#FFFFFF",stroke:"#B0BEC5","stroke-width":3,opacity:0},kettle));
[[P_+920,"#FFFFFF"],[P_+1010,"#FFCC80"],[P_+1400,"#90CAF9"]].forEach(([x,c])=>{const g=el("g",{transform:`translate(${x},1180)`},PAN);
  el("path",{d:"M-28 -60 L28 -60 L22 0 L-22 0 Z",fill:c,stroke:INK,"stroke-width":4},g); el("path",{d:"M26 -48 Q46 -44 40 -24 Q36 -14 22 -16",stroke:INK,"stroke-width":5,fill:"none"},g)});
// warm lamp + light cone
el("line",{x1:P_+480,y1:-100,x2:P_+480,y2:150,stroke:INK,"stroke-width":5},PAN);
el("path",{d:`M${P_+400} 220 Q${P_+480} 120 ${P_+560} 220 Z`,fill:"#FFB74D",stroke:INK,"stroke-width":5},PAN);
el("polygon",{points:`${P_+410},220 ${P_+550},220 ${P_+1150},1700 ${P_-190},1700`,fill:"#FFE0A0",opacity:.26},PAN);

// ---------- people ----------
const people=el("g",{},W), front=el("g",{},W);
const BC=[0,1,2].map(k=>makeColleague(k,backPeople,false));     // heads over the cubicles (S1)
const C=[0,1,2].map(k=>makeColleague(k,people,true));          // standing colleagues (pantry, party)
const SU=makeSuresh(people,true,{});
const PR=makePriya(people,true,{});
const RM=makeRamesh(people,true,{});
const MG=makeManager(people,true,{});
const RMS=makeRamesh(rSeat,false,{});                           // Ramesh seated at his desk (S1)
W.appendChild(table); W.appendChild(vipG); W.appendChild(cone);
people.parentNode.insertBefore(burst,people); people.parentNode.insertBefore(burstT,people.nextSibling);
// mug steam ('villain smoke') + anger steam
const steam=[]; for(let k=0;k<8;k++) steam.push(el("circle",{r:16,fill:"#FFFFFF",stroke:"#B0BEC5","stroke-width":3,opacity:0},W));
// confetti (screen space: poppers)
const CONF=[]; for(let k=0;k<80;k++) CONF.push(el("rect",{x:-9,y:-5,width:18,height:10,rx:2,fill:["#E53935","#FFD54F","#43A047","#1E88E5","#8E24AA","#FF7043"][k%6],opacity:0},fx));
// sparkles (Suresh's 'Yes sir!')
const SPK=[]; for(let k=0;k<6;k++){const g=el("g",{opacity:0},fx); const p=[]; for(let j=0;j<8;j++){const r=j%2?7:24, a=j*Math.PI/4-Math.PI/2; p.push(`${(Math.cos(a)*r).toFixed(1)},${(Math.sin(a)*r).toFixed(1)}`)} el("polygon",{points:p.join(" "),fill:"#FFF59D",stroke:"#FFB300","stroke-width":3},g); SPK.push(g)}
// heads popping in the 'ooooh' (screen space laughs are the characters themselves)

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
const COLORS={gopi:"#F5B347",ramesh:"#9CCBF0",manager:"#F48FB1",priya:"#FFD54F",suresh:"#C9B8EC",team:"#A5D6A7"}, NAMES={gopi:"GOPI",ramesh:"RAMESH",manager:"MANAGER",priya:"PRIYA",suresh:"SURESH",team:"TEAM"};
let TL;
const LN=i=>TL.lines.find(l=>l.i===i);
function talkOf(who,t){for(const l of TL.lines){if(l.who!==who)continue;const f=Math.floor((t-l.start)*TL.fps);if(f>=0&&f<l.env.length)return l.env[f]}return 0}
function curLine(t){return TL.lines.find(l=>t>=l.start-0.1&&t<l.start+l.dur+0.25)}
const S=i=>LN(i).start, E=i=>LN(i).start+LN(i).dur, D=i=>LN(i).dur;
const W0=(i,k)=>S(i)+LN(i).fseg[Math.min(k,LN(i).fseg.length-1)][0], W1=(i,k)=>S(i)+LN(i).fseg[Math.min(k,LN(i).fseg.length-1)][1];
// a word inside fine segment k (proportional to the characters of the segment's words)
function atIn(i,k,frac){return W0(i,k)+(W1(i,k)-W0(i,k))*frac}
const OV=(typeof window!=="undefined"&&window.BEAT_OVERRIDES)||{};
let B=null;
function beats(){ if(B) return B; B={};
  // S1: villain entry, the announcement, Ramesh's sarcasm
  B.door=0.06; B.walk1=S(0)+0.35; B.titleIn=0.45;
  B.dhoom=W0(0,0)-0.02; B.xmas=W0(0,2); B.jingle=B.xmas; B.scratch=W0(0,3)-0.27; B.kani=W0(0,3); B.pend=W0(0,4); B.dun=E(0)+0.03;
  B.r1=S(1)-0.1; B.snick=E(1)-0.1; B.whoosh1=E(1)+0.05; B.pan0=E(1)+0.2;
  // PANTRY
  B.kettle=S(2)+0.03; B.tgt=atIn(2,0,0.55); B.heist=atIn(3,2,0.42); B.hands=E(3)+0.03; B.whoosh2=E(3)+0.28; B.flo=E(3)+0.42;
  // CHAIRS
  B.knuck=W0(4,2); B.str=W0(4,4); B.tune0=E(4)+0.05; B.needle=E(4)+0.9; B.scram=E(4)+0.95; B.thud=E(4)+1.25; B.faaah=E(4)+1.32; B.faaahE=B.faaah+0.95;
  B.r5=S(5)-0.1; B.chip5=W0(5,1)+0.35; B.laugh1=E(5)+0.03; B.fol0=E(5)+0.03; B.tFol=B.fol0+0.42; B.fol1=B.fol0+0.72;
  // TRUTH
  B.tr0=S(7)-0.1; B.spin=W1(7,1)+0.0; B.spinE=B.spin+0.7; B.tick0=W0(7,3); B.tick1=E(7)+0.05;
  B.m8=S(8)-0.05; B.spot=S(8)+0.02; B.yes=W0(9,0); B.thank=W0(9,1);
  B.r10=S(10)-0.08; B.queue=atIn(10,1,0.1); B.vip=atIn(10,2,0.55); B.ooh=E(10)+0.02; B.dhan=[E(10)+0.35,E(10)+0.58,E(10)+0.81];
  // AWARD
  B.aw0=S(11)-0.12; B.roll0=W0(11,1); B.roll1=E(11)-0.04; B.garl=E(11)+0.03; B.thwump=B.garl+0.15; B.hat=B.garl+0.3; B.faaah2=E(11)+0.45; B.faaah2E=B.faaah2+0.9;
  B.r12=S(12)-0.05; B.stamp=W0(12,3)-0.13; B.laugh2=E(12)+0.02;
  B.m13=S(13)-0.05; B.dhoom2=W0(13,2)-0.12; B.gasp=E(13)+0.03; B.sil0=E(13)+0.38; B.sil1=S(14)-0.015;
  B.r14=S(14); B.panulu=W0(14,3); B.donk=E(14)+0.2;
  B.t15=S(15)-0.12; B.popper=atIn(15,0,0.3); B.frz=E(15)+0.08; B.sting=E(15)+0.35; B.laugh3=E(15)+0.45;
  B.c16=S(16)-0.15; B.tCm=W0(16,3); B.s17=S(17)-0.12; B.tTag=W0(17,1); B.ep2=W0(17,2); B.endSting=E(17)-0.3; B.end0=E(17)+0.02; B.tEF=B.end0+0.45;
  Object.assign(B,OV);
  return B}

const focus=(z,wx,wy,sx=540,sy=1000,r=0)=>({z,fx:wx-(sx-540)/z,fy:wy-(sy-1000)/z,r});
const mixCam=(a,b_,k)=>({z:lerp(a.z,b_.z,k),fx:lerp(a.fx,b_.fx,k),fy:lerp(a.fy,b_.fy,k),r:lerp(a.r||0,b_.r||0,k)});
// keep short Telugu words (ఆ? లో కి ని తో ...) with the word before them; never orphan a short word on its own line
const subFix=s=>s.replace(/…/g,"...").replace(/([^\s.!?])\s([ఀ-౿]{1,2}[.,!?]*)(?=\s|$)/g,"$1&nbsp;$2").replace(/(^|\s)(మీ|నా|నీ|ఏం|ఏ|మన|ఒక)\s/g,"$1$2&nbsp;")
  .replace(/(తో) (పాటు)/g,"$1&nbsp;$2").replace(/(pass)&nbsp;(ఆ)/g,"$1&nbsp;$2").replace(/(ఆ) (సార్)/g,"$1&nbsp;$2").replace(/(Episode) (2)/g,"$1&nbsp;$2").replace(/(Red) (Flower)/g,"$1&nbsp;$2")
  .replace(/(important) (chair)/g,"$1&nbsp;$2").replace(/(double) (workload)/g,"$1&nbsp;$2").replace(/(Christmas) (games)/g,"$1&nbsp;$2").replace(/(Thank) (you) (sir)/g,"$1&nbsp;$2&nbsp;$3")
  .replace("ఇస్తారు? Comment","ఇస్తారు?<br>Comment").replace("ఇస్తాడనుకున్నాం... మన","ఇస్తాడనుకున్నాం...<br>మన").replace("ఇంటికి!","ఇంటికి!").replace("games! కానీ","games!<br>కానీ").replace("పాటు overtime","పాటు<br>overtime").replace("ఆ? Chair","ఆ?<br>Chair").replace("లో... Suresh","లో...<br>Suresh").replace("Dare! సార్","Dare!<br>సార్").replace("చేయండి... రేపు","చేయండి...<br>రేపు");

function frame(t){
  const b=beats(); T_=t;
  const silent=t>=b.sil0&&t<b.sil1, frozen=t>=b.frz, fz1=t>=b.faaah&&t<b.faaahE, fz2=t>=b.faaah2&&t<b.faaah2E;
  const T=frozen?b.frz:silent?b.sil0:fz1?b.faaah:fz2?b.faaah2:t;    // character time (stops in the freezes + the silent beat)
  const sc1=t<b.pan0, pan=t>=b.pan0&&t<b.flo, chairsS=t>=b.flo&&t<b.tr0, truth=t>=b.tr0&&t<b.aw0, award=t>=b.aw0;
  $("s").style.filter=frozen?`saturate(${lerp(1,0.7,clamp((t-b.frz)/0.08))}) contrast(1.06) brightness(1.03)`:(fz1||fz2)?"saturate(1.25) contrast(1.05)":"";
  const still=frozen||silent||fz1||fz2;
  const R=(C,who,x,y,s)=>{resetPose(C,x,y,s,who&&!still?talkOf(who,t):0); C.st.blink=still?0:(((T*0.6+x*0.0013)%3.3)<0.11?1:0); return C.st};
  const all=[MG,RM,PR,SU,...C]; all.forEach(c=>c.st.vis=0);

  // ---------------- S1: villain entry from the cabin; Ramesh at his desk ----------------
  const s95=0.95, h95=hipAt(s95);
  if(sc1){
    const m=R(MG,"manager",1315,h95,s95); m.itemL="mug"; m.brow="a"; m.smirk=1; m.look=-0.4;
    const k=clamp((T-b.door-0.12)/(b.walk1-b.door-0.12)); const step=Math.sin(k*Math.PI*2.2);
    m.x=lerp(1315,1020,ease(k)); m.walk=k<1?step*0.8:0; m.hop=k<1?Math.abs(step)*8:0; m.rot=k<1?step*1.2:0;      // slow-mo villain walk
    MG.aim("L",m.x-70,h95-180*s95); m.hR=[90,-60];
    if(T>=b.dhoom){ m.brow="a"; m.smirk=0; m.look=-0.2; MG.aim("R",m.x+150,h95-330); m.headRot=-3 }                     // 'Attention everyone!'
    if(T>=b.xmas-0.05){ m.smile=1; m.brow="u"; m.spread=1; m.hR=[150,-300]; MG.aim("L",m.x-120,h95-300) }           // fake-generous
    if(T>=b.scratch){ m.smile=0; m.spread=0; m.smirk=1; m.brow="a"; m.hR=[70,-160]; MG.aim("L",m.x-70,h95-180*s95); m.look=-0.6; m.headRot=-4 }  // the sting
    if(T>=b.pend){ m.hR=[110,-250]; m.itemRot=0; }
    if(T>=E(0)){ m.hR=[70,-80]; m.lookY=0.3 }
    MG.draw();
    const r=R(RMS,"ramesh",RDX,1505,s95); r.vis=t>=b.r1-0.3?1:0; r.look=0.7; r.smile=1; r.brow="u";
    RMS.aim("L",RDX-30,1380); RMS.aim("R",RDX+30,1380);                                                              // hands folded, sweet
    if(t>=W0(1,2)-0.1){ r.smile=0; r.smirk=1; r.brow="q"; r.look=0.9 }                                                // bone-dry on 'overtime'
    RMS.draw();
  } else { RMS.st.vis=0; RMS.draw() }
  rDesk.style.display=rDeskFront.style.display=rSeat.style.display=sc1?"":"none";
  // heads over the cubicles: pop up and snicker at the end of L1
  BC.forEach((c,i)=>{const X=[420,640,860][i]; const up=sc1?out((t-b.snick-0.06*i)/0.2):0; const st_=R(c,null,X,lerp(1300,1150,up),0.5); st_.vis=sc1&&up>0?1:0;
    st_.look=-0.7; st_.laugh=1; st_.shut=1; st_.hL=[-20,-330]; st_.hR=[30,-330]; st_.headRot=Math.sin(t*14+i)*5; st_.hop=Math.abs(Math.sin(t*12+i))*10; c.draw()});
  // door blast + doorway
  {const k=t>=b.door&&sc1?out((t-b.door)/0.1):0; doorP.setAttribute("transform",`scale(${1-0.78*k},1)`); doorDark.setAttribute("opacity",k*0.85)}
  // decorations: twinkle on 'Christmas games!', droop on the scratch
  {const tw=t>=b.xmas&&t<b.scratch; twinkles.forEach((x,i)=>x.setAttribute("opacity",tw?0.4+0.6*Math.abs(Math.sin(t*9+i*1.3)):0));
   const dr=t>=b.scratch&&sc1?out((t-b.scratch)/0.35):0;
   bannerB.setAttribute("transform",`rotate(${dr*9} 190 220)`); starG.setAttribute("transform",`translate(980,${300+dr*40}) rotate(${(t<b.scratch?Math.sin(t*2)*6:0)+dr*150})`);
   treeStar.setAttribute("transform",`translate(${dr*30},${-450+dr*30}) rotate(${dr*70})`);
   bunt.forEach((f,i)=>f.setAttribute("transform",`translate(0,${dr*(10+(i%3)*8)})`));
   if(!sc1){ bannerB.setAttribute("transform",""); starG.setAttribute("transform",`translate(980,300) rotate(${Math.sin(t*2)*6})`); treeStar.setAttribute("transform","translate(0,-450)"); bunt.forEach(f=>f.setAttribute("transform","")) }}
  mHand.setAttribute("transform",`rotate(${t*0.2})`);

  // ---------------- PANTRY: the secret meeting ----------------
  if(pan){
    const p=R(PR,"priya",P_+250,hipAt(1.0)-30,1.0); p.look=0.6; p.smirk=1; p.brow="q"; p.lookY=0;
    const wk=clamp((t-b.tgt+0.1)/0.9);
    if(t<b.tgt+0.9){ PR.aim("R",P_+190+wk*480,560+((wk*7)%1)*150); p.look=-0.6; p.headRot=-4 } else { p.hR=[70,-90] }  // writes on the board (marker hand)
    if(t>=S(3)){ p.look=0.8; p.smirk=1 }
    const r=R(RM,"ramesh",P_+720,hipAt(1.0)-30,1.0); r.look=-0.7; r.brow="q"; r.smirk=1; r.lookY=0.2; RM.aim("L",P_+690,1080); RM.aim("R",P_+760,1060);   // leaning in, hands together
    if(t>=S(3)){ r.headRot=-5; r.lookY=0.3 }
    if(t>=b.heist){ r.smirk=0; r.smile=1; r.brow="u"; r.look=0 }
    const cx=[P_+40,P_+470,P_+980];
    C.forEach((c,i)=>{const st_=R(c,null,cx[i],hipAt(0.86)-70,0.86); st_.look=i===2?-0.8:0.6; st_.smirk=1; st_.brow="q"; st_.lookY=0.3});
    if(t>=b.hands){ const k=out((t-b.hands)/0.12); const hx=P_+490, hy=1060;                                          // hands-in huddle
      [PR,RM,...C].forEach((c,j)=>{c.aim("R",lerp(c.st.x+60,hx+(j-2)*14,k),lerp(c.st.y-60,hy-(j%2)*16,k)); c.st.smile=1; c.st.smirk=0; c.st.brow="u"}) }
    [...C,PR,RM].forEach(c=>c.draw());
  }
  wbClipR.setAttribute("width",t<b.tgt-0.1?0:clamp((t-b.tgt+0.1)/0.9)*640);
  {const on=pan&&t>=b.kettle; kLed.setAttribute("fill",on?"#FF5252":"#455A64"); kSteam.forEach((s_,i)=>{const f=fract(t*1.2+i/3); s_.setAttribute("cy",-140-f*120); s_.setAttribute("cx",-96-f*30); s_.setAttribute("r",10+f*16); s_.setAttribute("opacity",on?(1-f)*0.9:0)})}

  // ---------------- CHAIRS: musical chairs ----------------
  const s8=0.8, h8=hipAt(s8);
  chairs.style.display=chairsS?"":"none";
  if(chairsS){
    const tuneK=clamp((t-b.tune0)/(b.needle-b.tune0)), walking=t>=b.tune0&&T<b.needle;
    const dive=T>=b.needle?out((T-b.scram)/0.25):0;
    const order=[PR,RM,SU,C[1]], base=[CHX[0]-30,CHX[1]-10,CHX[2]+10,CHX[3]+30];
    order.forEach((c,j)=>{const who=c===RM?"ramesh":null; const st_=R(c,who,base[j],h8,s8);
      st_.look=j<2?0.6:-0.6; st_.smile=1; st_.brow="u";
      if(walking){ const ph=(T-b.tune0)*8+j; st_.x=base[j]+Math.sin((T-b.tune0)*5.2)*70; st_.walk=Math.sin(ph*Math.PI)*0.9; st_.hop=Math.abs(Math.sin(ph*Math.PI))*14; st_.look=0.9 }
      if(T>=b.needle){ st_.x=lerp(base[j]+Math.sin((b.needle-b.tune0)*5.2)*70,CHX[j],dive); st_.y=lerp(h8,SEATY-4,dive); st_.sit=lerp(1,0.42,dive); st_.hop=Math.sin(dive*Math.PI)*40; st_.gasp=dive<1?1:0; st_.smile=dive>=1?1:0 }
      if(T>=b.thud){ st_.look=j<2?0.9:-0.9; st_.gasp=0; st_.smirk=1; st_.smile=0; st_.brow="q" } });
    const m=R(MG,"manager",GAPX,h8,s8); m.itemL="mug"; m.smirk=1; m.brow="q"; m.look=0;
    if(t<b.tune0){ m.headRot=Math.sin(t*3)*3;
      if(t>=b.knuck){ const sh=Math.sin(t*40)*6; MG.aim("L",GAPX-24,h8-210*s8+sh); MG.aim("R",GAPX+24,h8-210*s8-sh); m.itemL="" }                 // cracks his knuckles (mug down for a beat)
      if(t>=b.str){ m.itemL="mug"; MG.aim("L",GAPX-70,h8-160*s8); m.hR=[120,-330]; m.smile=1; m.smirk=0; m.brow="u" } }                         // 'నా strength!'
    if(walking){ m.shut=1; m.smile=1; m.smirk=0; m.headRot=Math.sin(T*10)*7; m.hop=Math.abs(Math.sin(T*10))*16; m.hR=[110+Math.sin(T*10)*30,-300]; MG.aim("L",GAPX-110,h8-260*s8); m.rot=Math.sin(T*10)*3 }   // smug dance, eyes shut
    if(T>=b.needle){ const sk=out((T-b.scram)/0.3); m.shut=1; m.smile=1; m.y=lerp(h8,FEET-150,sk); m.sit=lerp(1,0.38,sk); m.splay=lerp(0,38,sk); m.hop=0;   // sits down... on nothing
      MG.aim("L",GAPX-120,lerp(h8-200,FEET-420,sk)); m.hR=[lerp(100,150,sk),lerp(-300,-260,sk)] }
    if(T>=b.thud){ m.shut=0; m.smile=0; m.gasp=1; m.wide=1; m.brow="u"; m.squash=1-0.08*Math.exp(-(T-b.thud)*12); m.sweat=1; m.look=0; m.headRot=0;
      MG.aim("L",GAPX-140,FEET-300); m.hR=[160,-300] }                                                                                        // on the floor, mug still up
    if(t>=b.r5){ m.gasp=0; m.wide=0; m.sad=1; m.brow="w"; m.look=-0.5; m.lookY=-0.3 }
    if(t>=b.r5){ const r=RM.st; r.y=h8; r.sit=0; r.x=lerp(CHX[1],GAPX-170,out((t-b.r5)/0.35)); r.hop=0; r.smile=1; r.smirk=0; r.brow="u"; r.look=0.8; r.lookY=0.5;   // stands, offers a hand, too sweet
      RM.aim("R",GAPX-100,FEET-330); RM.aim("L",r.x-60,h8-60);
      if(t>=W0(5,2)-0.05){ r.smile=0; r.smirk=1; r.brow="q"; r.look=0.4; r.lookY=0 } }
    if(t>=b.laugh1){ [PR,SU,C[1]].forEach((c,j)=>{c.st.laugh=1; c.st.shut=1; c.st.headRot=Math.sin(t*12+j)*6; c.st.hop=Math.abs(Math.sin(t*10+j*2))*8}) }
    [C[1],SU,PR,RM,MG].forEach(c=>c.draw());
  }

  // ---------------- TRUTH or DARE ----------------
  table.style.display=truth?"":"none";
  {const sp=clamp((t-b.spin)/0.7); const ang=truth?(t<b.spin?-30:(1-Math.pow(1-sp,3))*1440+(-1440)):0;   // spins, stops pointing at the manager (right)
   bottleG.setAttribute("transform",`translate(${TBX},${TBY}) scale(1,0.42) rotate(${ang})`);
   bottle.setAttribute("transform",t>=b.spinE&&t<b.spinE+0.15?`scale(${1+0.12*Math.sin((t-b.spinE)/0.15*Math.PI)})`:"")}
  if(truth){
    const r=R(RM,"ramesh",130,h8,s8); r.look=0.7; r.smile=1; r.brow="u"; RM.aim("L",90,h8-70); RM.aim("R",170,h8-70);
    const p=R(PR,"priya",360,h8,s8); p.item="clipboard"; p.look=0.8; p.smile=1; p.brow="u"; PR.aim("R",420,h8-170); PR.aim("L",330,h8-60);
    const m=R(MG,"manager",840,h8,s8); m.itemL="mug"; m.look=-0.6; m.smirk=1; m.brow="n"; MG.aim("L",780,h8-150); m.hR=[70,-70];
    const su=R(SU,"suresh",1070,h8,s8); su.itemL="notepad"; su.look=-0.7; su.smile=1; su.brow="u"; SU.aim("L",1030,h8-140); SU.aim("R",1100,h8-90); bobble(su,t,0.35);
    if(t>=b.spin){ p.look=0.9; p.lookY=0.6; r.look=0.8; r.lookY=0.6; m.look=-0.8; m.lookY=0.6; m.smirk=0; su.look=-0.8; su.lookY=0.6 }              // all watch the bottle
    if(t>=b.spinE){ m.gasp=1; m.wide=1; m.sweat=1; m.brow="u"; m.lookY=0.3; p.smirk=1; p.smile=0; p.brow="q"; p.lookY=0; r.smirk=1; r.smile=0; r.lookY=0 }
    if(t>=b.tick0){ PR.aim("R",470,h8-250); p.look=0.9 }                                                                                       // points the pen
    if(t>=b.m8){ m.gasp=0; m.wide=0; m.sweat=0; m.smile=1; m.brow="u"; m.look=0.9; MG.aim("R",990,h8-300); m.headRot=3 }                   // 'సురేష్!' points straight at him
    if(t>=b.yes){ su.smile=1; su.brow="u"; su.look=-0.5; bobble(su,t,1.6); su.hop=Math.abs(Math.sin(t*8))*6; SU.aim("R",1060,h8-260) }   // bobble-head nodding, almost bowing
    if(t>=b.thank){ su.rot=Math.sin(clamp((t-b.thank)/0.5)*Math.PI)*-8 }
    if(t>=b.r10){ m.smile=0; m.smirk=1; m.look=-0.4; m.hR=[70,-70]; r.smile=0; r.smirk=0; r.brow="u"; r.look=0.8; RM.aim("R",280,h8-260); p.smirk=1 }   // polite, a needle
    if(t>=b.vip){ r.brow="q"; r.smirk=1 }
    if(t>=b.ooh){ [PR,RM,SU].forEach(c=>{c.st.gasp=1; c.st.wide=1; c.st.smirk=0; c.st.smile=0; c.st.brow="u"}); su.nod=0; m.gasp=1; m.wide=1; m.brow="u"; m.sweat=1; m.look=0 }
    [RM,PR,MG,SU].forEach(c=>c.draw());
  }
  {const on=truth&&t>=b.vip-0.05&&t<b.aw0; const [hx,hy]=SU.headW(); vipG.style.display=on?"":"none";
   vipG.setAttribute("transform",`translate(${SU.st.x},${hy+130*s8}) scale(${0.8*Math.max(0.01,pop(t,b.vip-0.05,0.3))})`)}
  {const on=truth&&t>=b.spot&&t<b.r10; const x=SU.st.x; cone.setAttribute("points",`${x-60},0 ${x+60},0 ${x+230},${FEET} ${x-230},${FEET}`); cone.setAttribute("opacity",on?0.33*clamp((t-b.spot)/0.06):0)}

  // ---------------- AWARD ----------------
  const s85=0.85, h85=hipAt(s85);
  if(award){
    const m=R(MG,"manager",630,h85,s85); m.itemL="mug"; m.smile=1; m.brow="u"; m.look=-0.4; MG.aim("L",560,h85-160); m.hR=[70,-70];
    const p=R(PR,"priya",330,h85,s85); p.item="clipboard"; p.look=0.7; p.smile=1; p.brow="u"; PR.aim("R",380,h85-170); PR.aim("L",300,h85-60);
    const r=R(RM,"ramesh",110,h85,s85); r.look=0.8; r.smirk=1; r.brow="q"; RM.aim("L",70,h85-60); RM.aim("R",150,h85-60);
    const su=R(SU,"suresh",960,h85,s85); su.itemL="notepad"; su.look=-0.7; su.smile=1; su.brow="u"; SU.aim("L",920,h85-140); SU.aim("R",990,h85-90); bobble(su,T,0.3);
    const cpos=[[480,0.6],[795,0.6],[1170,0.62]];
    C.forEach((c,i)=>{const st_=R(c,null,cpos[i][0],FEET-150-448*cpos[i][1],cpos[i][1]); st_.look=i===2?-0.8:0.5; st_.smirk=1; st_.brow="q"});
    // the award
    const gk=clamp((t-b.garl)/0.15), hk=clamp((t-b.hat)/0.12);
    if(t>=b.garl){ m.garland=gk; m.gswing=Math.sin((T-b.garl)*9)*7*Math.exp(-(T-b.garl)*2.5) }
    if(t>=b.hat){ m.santa=hk; m.hatTilt=-6 }
    if(t>=b.thwump){ m.smile=0; m.gasp=1; m.wide=1; m.brow="u"; m.look=0; m.lookY=-0.2; m.headRot=0 }
    if(t>=b.r12){ m.gasp=0; m.wide=0; m.smile=0; m.smirk=0; m.brow="w"; m.sad=1; m.look=-0.6;
      r.smirk=0; r.smile=1; r.brow="u"; r.look=0.7; RM.aim("R",250,h85-330); r.headRot=-3 }                                                   // Ramesh announces, solemn
    if(t>=b.stamp){ r.smile=0; r.smirk=1; r.brow="q"; r.hR=[80,-90] }
    if(t>=b.laugh2&&t<b.m13){ [PR,RM,SU,...C].forEach((c,j)=>{c.st.laugh=1; c.st.shut=1; c.st.smirk=0; c.st.smile=0; c.st.headRot=Math.sin(T*12+j)*6; c.st.hop=Math.abs(Math.sin(T*10+j*2))*8});
      PR.aim("R",360+Math.sin(T*20)*10,h85-200); PR.aim("L",300,h85-200+Math.sin(T*20)*10) }                                                 // claps
    if(t>=b.m13){ m.sad=0; m.angry=clamp((t-b.m13)/0.5)+0.4; m.brow="a"; m.gasp=0; m.look=0; m.headRot=Math.sin(T*16)*3;
      m.gswing=Math.sin(T*11)*10; m.hatTilt=-6+Math.sin(T*9)*12; MG.aim("R",780,h85-360); m.hop=t>=b.dhoom2?Math.max(0,10-(T-b.dhoom2)*40):0;
      [PR,RM,SU,...C].forEach(c=>{c.st.laugh=0; c.st.shut=0; c.st.hop=0; c.st.headRot=0; c.st.smirk=0; c.st.gasp=t>=b.gasp-0.05?1:0; c.st.wide=1; c.st.brow="u"}) }
    if(t>=b.sil0){ m.angry=1.4 }
    if(t>=b.r14){ m.angry=0.5; m.blank=0; m.gswing=0; m.hatTilt=-14; MG.aim("R",700,h85-60); m.hop=0; m.headRot=0;
      r.look=0; r.lookY=0; r.gasp=0; r.wide=0; r.smirk=1; r.brow="q"; r.headRot=0; RM.aim("L",60,h85-70); RM.aim("R",160,h85-70) }       // Ramesh turns to the camera
    if(t>=b.r14+0.05&&t<b.t15){ [PR,SU,...C].forEach(c=>{c.st.gasp=0; c.st.wide=0; c.st.smirk=1; c.st.brow="q"}) }
    if(t>=b.donk){ m.angry=0; m.blank=1; m.twitch=T>b.donk+0.2?1:0 }
    if(t>=b.t15){ m.blank=1; m.twitch=1;
      [PR,RM,SU,...C].forEach((c,j)=>{const w=Math.sin(T*14+j*1.7)*28; c.st.smile=1; c.st.smirk=0; c.st.gasp=0; c.st.wide=0; c.st.brow="u"; c.st.laugh=0; c.st.look=0; c.st.lookY=0; c.st.hR=[110,-430+w]; c.st.item=""; c.st.hop=Math.abs(Math.sin(T*9+j))*10}) }   // everyone waves
    [...C,SU,PR,RM,MG].forEach(c=>c.draw());
  }
  all.forEach(c=>{if(!c.st.vis) c.draw()});
  // FAAAH bursts (behind the manager)
  {const h1=t>=b.faaah-0.03&&t<b.faaahE+0.05&&chairsS, h2=t>=b.faaah2-0.03&&t<b.faaah2E+0.05&&award; const on=h1||h2, t0=h1?b.faaah:b.faaah2;
   const [hx,hy]=MG.headW(); const k=Math.max(0.01,back((t-t0+0.03)/0.18)); burst.style.display=burstT.style.display=on?"":"none";
   burst.setAttribute("transform",`translate(${hx},${hy}) scale(${0.8*k}) rotate(${(t-t0)*30})`);
   burstT.setAttribute("transform",`translate(${hx+10},${hy-(h2?235:120)*MG.st.s}) scale(${0.62*k}) rotate(-6)`)}
  // mug steam (S1 'villain smoke') + anger steam (the threat)
  steam.forEach((p,i)=>{let on=false,cx=0,cy=0; const f=fract(t*0.9+i/8);
    if(sc1){ const m=MG.st; on=true; cx=m.x-70*m.s+Math.sin(f*6+i)*20; cy=hipAt(0.95)-200*0.95-40-f*220 }
    if(award&&t>=b.m13&&t<b.r14+0.2){ const [hx,hy]=MG.headW(); on=true; const sd=i%2?1:-1; cx=hx+sd*(60+f*50); cy=hy-20-f*110 }
    p.setAttribute("cx",cx); p.setAttribute("cy",cy); p.setAttribute("r",10+f*20); p.setAttribute("opacity",on?(1-f)*(sc1?0.7:0.95):0)});

  // ---------------- Gopi (narrator badge): the silent follow tap, the comment, the tag ----------------
  const g=GOPI.st;
  const folOn=t>b.fol0-0.05&&t<b.fol1+0.1, cmOn=t>S(16)-0.15&&t<E(16)+0.2, tgOn=t>S(17)-0.15&&t<b.end0;
  const narOn=folOn||cmOn||tgOn; const narT=tgOn?S(17)-0.15:cmOn?S(16)-0.15:b.fol0-0.05;
  let BX=150, BY=1300, bsc=0.8;
  if(cmOn){ BX=930; BY=760 } if(tgOn){ BX=920; BY=1390 }
  Object.assign(g,{x:0,y:400*0.55+12,s:0.55,talk:talkOf("gopi",t),blink:((t*0.7)%3.1)<0.12?1:0,wink:folOn&&t>b.tFol?1:0,look:BX>540?-0.5:0.5,lookY:0,brow:"q",smile:folOn?1:0,headRot:Math.sin(t*2.2)*3,item:"",armL:200,armR:160,lenL:115,lenR:115,hop:0,itemRot:0});
  if(folOn){ g.armR=40; g.item="point"; g.itemRot=-30 }
  if(cmOn||tgOn) g.smile=1;
  GOPI.draw();
  const bs=narOn?Math.max(0.001,back((t-narT)/0.35)):0;
  badge.setAttribute("transform",`translate(${BX},${BY}) scale(${bs*bsc}) rotate(${Math.sin(t*2)*2})`); badge.style.opacity=narOn?1:0;

  // ---------------- camera ----------------
  const punch=(t0,a_=0.1,k=5)=>t>t0?a_*Math.exp(-(t-t0)*k)*clamp((t-t0)/0.04):0;
  const MH=()=>MG.headW(), RH=()=>RM.headW();
  const shots=[
    [0,focus(1.12+0.05*t,1240,960,540,1080,-3)],                                         // low angle: the cabin door blasts open
    [b.dhoom,focus(1.5+punch(b.dhoom,0.14),1060,880,540,900,-2),0.05],                    // DHOOM punch-in on 'Attention'
    [b.xmas-0.08,focus(0.95,760,880,540,1000),0.25],                                       // wide: the decorations twinkle
    [b.scratch,focus(1.12,880,900,540,960),0.04],                                         // the scratch: decorations droop
    [b.pend,focus(1.4+0.05*(t-b.pend)+punch(b.dun+0.3,0.05),1030,850,540,880),0.3],       // push-in on the smug face
    [b.r1,focus(1.3,330,1060,540,980),0.01],                                              // Ramesh at his desk (+ the heads behind)
    [b.pan0,focus(0.98,P_+480,960),0.01],                                                 // PANTRY
    [S(3)-0.05,focus(1.25+0.03*(t-S(3)),P_+600,920,540,960),0.2],
    [b.heist,focus(1.15+punch(b.heist,0.06),P_+520,960),0.05],
    [b.flo,focus(1.35,GAPX,hipAt(0.8)-260,540,900),0.01],                                 // CHAIRS: the strut
    [b.tune0,focus(0.86,630,1220,540,1060),0.15],                                         // wide for the game
    [b.thud,focus(1.05+punch(b.thud,0.08),630,1330,540,1060),0.03],
    [b.faaah,focus(2.25,GAPX,FEET-150-392*0.8*0.95,540,900),0.07],                        // FAAAH #1 freeze-zoom on his face
    [b.r5-0.02,focus(1.12,470,1300,540,1040),0.01],                                       // Ramesh offers a hand
    [b.fol0,focus(0.95,630,1240,540,1060),0.2],
    [b.tr0,focus(1.0,600,1170,540,1040),0.01],                                           // TRUTH or dare
    [b.spin-0.05,focus(2.1,TBX,TBY+10,540,1100),0.12],                                    // the bottle
    [b.spinE+0.15,focus(1.3,700,1020,540,980),0.12],                                      // the trap question
    [b.m8,focus(1.12,900,1060,540,1000),0.08],
    [b.spot+0.05,focus(1.5,1050,1000,540,960),0.15],                                      // Suresh in the spotlight
    [b.r10,focus(1.3,260,1020,540,980),0.01],                                             // Ramesh, polite needle
    [b.vip-0.1,focus(1.0,620,1080,540,1000),0.2],
    [b.dhan[0],focus(1.7,840,hipAt(0.8)-392*0.8,540,900,-3),0.04],                        // DHAN!
    [b.dhan[1],focus(2.2,840,hipAt(0.8)-392*0.8,540,900,3),0.04],                         // DHAN!
    [b.dhan[2],focus(2.85,840,hipAt(0.8)-392*0.8+8,540,900,0),0.05],                      // DHAAAN!
    [b.aw0,focus(1.15,470,1050,540,1000),0.01],                                           // AWARD
    [b.garl-0.1,focus(1.35,600,980,540,980),0.12],
    [b.faaah2,focus(2.2,630,hipAt(0.85)-392*0.85,540,920),0.07],                          // FAAAH #2
    [b.r12-0.02,focus(0.95,560,1090,540,1060),0.01],                                      // the plaque, all laugh
    [b.m13,focus(1.5+0.04*(t-b.m13)+punch(b.dhoom2,0.12),630,hipAt(0.85)-330,540,940),0.06],  // the threat
    [b.r14,focus(2.1+0.04*(t-b.r14),110,hipAt(0.85)-392*0.85+30,540,900),0.01],           // Ramesh to camera (close-up)
    [b.donk,focus(2.3+punch(b.donk,0.1,8),630,hipAt(0.85)-392*0.85,540,960),0.03],        // DONK: the blank face
    [b.t15,focus(0.93,620,1170,540,1060),0.01],                                           // 'Merry Christmas Sir!' + FREEZE
  ];
  let cm=shots[0][1];
  {let i=0; while(i+1<shots.length&&t>=shots[i+1][0]) i++;
   const [t0,c,tr]=shots[i]; cm=c;
   if(i>0&&tr&&t<t0+tr){ const prev=shots[i-1][1]; cm=mixCam(prev,c,ease((t-t0)/tr)) }}
  if(frozen) cm={...cm,z:cm.z*(1+0.04*clamp((t-b.frz)/0.25))};
  // the MERRY CHRISTMAS banner is either fully in frame (below the top bar) or fully out: never clipped at the top edge
  if(!pan){const z=cm.z, top=1000+(220-cm.fy)*z, bot=1000+(336+(sc1&&t>=b.scratch?125:0)-cm.fy)*z; if(top<125&&bot>-5){const up=bot+5, dn=125-top; cm={...cm,fy:up<dn?cm.fy+up/z:cm.fy-dn/z}}}
  let sx=0,sy=0; const shake=(t0,d,a_)=>{if(t>t0&&t<t0+d){const q=(1-(t-t0)/d)*a_; sx+=Math.sin(t*90)*q; sy+=Math.cos(t*77)*q}};
  shake(b.dhoom,0.45,22); shake(b.scratch,0.12,8); shake(b.door,0.2,12); shake(b.thud,0.3,22); shake(b.faaah,0.25,10); b.dhan.forEach((x,i)=>shake(x,0.18,8+i*4));
  shake(b.thwump,0.2,12); shake(b.faaah2,0.25,10); shake(b.stamp,0.35,24); shake(b.dhoom2,0.45,22); shake(b.donk,0.25,14); shake(b.frz,0.12,10); shake(b.heist,0.15,8);
  cam.setAttribute("transform",`translate(${540+sx},${1000+sy}) rotate(${cm.r||0}) scale(${cm.z}) translate(${-cm.fx},${-cm.fy})`);
  const scr=(wx,wy)=>{const r=(cm.r||0)*Math.PI/180, dx=(wx-cm.fx)*cm.z, dy=(wy-cm.fy)*cm.z; return [540+dx*Math.cos(r)-dy*Math.sin(r)+sx, 1000+dx*Math.sin(r)+dy*Math.cos(r)+sy]};
  // sparkles round Suresh ('Yes sir!' harp)
  SPK.forEach((s_,i)=>{const on=truth&&t>=b.yes&&t<b.yes+1.1; const [hx,hy]=SU.headW(); const [px,py]=scr(hx,hy); const a=i/6*Math.PI*2+(t-b.yes)*2.5;
    s_.setAttribute("opacity",on?1-clamp((t-b.yes-0.7)/0.4):0); s_.setAttribute("transform",`translate(${px+Math.cos(a)*170},${py+Math.sin(a)*130}) scale(${Math.max(0.01,pop(t,b.yes+i*0.05,0.25))}) rotate(${(t-b.yes)*120})`)});

  // ---------------- HTML overlays ----------------
  {const dm=$("dim"); let a=0, bg="";
   if(sc1&&t>=b.dun-0.05&&t<b.r1){ a=clamp((t-b.dun+0.05)/0.15); const [px,py]=scr(MG.st.x,hipAt(0.95)-392*0.95);
     bg=`radial-gradient(circle at ${px}px ${py}px, rgba(255,120,90,0.12) 0, rgba(255,120,90,0.06) 220px, rgba(16,6,10,.84) 360px)` }
   if(pan){ a=0.5; bg="radial-gradient(circle at 540px 700px, rgba(255,190,90,0.0) 0, rgba(255,170,60,0.10) 380px, rgba(60,30,10,.62) 900px)" }    // low warm light
   if(truth&&t>=b.spot&&t<b.r10){ a=clamp((t-b.spot)/0.05)*0.92; const [px,py]=scr(SU.st.x,hipAt(0.8)-250); bg=`radial-gradient(ellipse 300px 520px at ${px}px ${py}px, rgba(255,250,200,0.0) 0, rgba(255,250,200,0.0) 55%, rgba(8,10,20,.82) 100%)` }
   if(award&&t>=b.dhoom2&&t<b.sil1){ const fl=t<b.dhoom2+0.5?((Math.floor((t-b.dhoom2)*22)%2)?0.75:0.1):0.35; a=fl; bg="#05070D" }                      // lights flicker, then dim
   if(t>=b.fol0&&t<b.fol1+0.1){ a=0.3*clamp((t-b.fol0)/0.2); bg="#10141E" }
   if(t>=b.c16&&t<b.s17){ a=0.5*clamp((t-b.c16)/0.25); bg="#10141E" }
   dm.style.opacity=a; dm.style.background=bg}
  // text hook (frame 1) + the title a beat later
  {const on=t<b.dhoom-0.05; $("hook").style.opacity=on?clamp((b.dhoom-0.05-t)/0.1):0;
   $("hook").style.transform=`rotate(${-1.5+Math.sin(t*3)*0.6}deg) scale(${t<0.25?1+0.08*Math.sin(t/0.25*Math.PI):1})`;
   const ti=$("title"), ton=t>b.titleIn&&t<b.dhoom-0.05; ti.style.opacity=ton?1:0; ti.style.transform=`scale(${Math.max(0.01,back((t-b.titleIn)/0.3))}) rotate(-2deg)`}
  const wchip=(id,on,wx,wy,t0,rot,s=1)=>{const e=$(id); if(!on){e.style.opacity=0;return} const [px,py]=scr(wx,wy); e.style.opacity=1; e.style.left=px+"px"; e.style.top=py+"px"; e.style.transform=`translate(-50%,-50%) scale(${Math.max(0.01,pop(t,t0,0.3))*s}) rotate(${rot}deg)`};
  const schip=(id,on,px,py,t0,rot,s=1)=>{const e=$(id); if(!on){e.style.opacity=0;return} e.style.opacity=1; e.style.left=px+"px"; e.style.top=py+"px"; e.style.transform=`translate(-50%,-50%) scale(${Math.max(0.01,pop(t,t0,0.3))*s}) rotate(${rot}deg)`};
  schip("cPend",sc1&&t>b.pend-0.05&&t<b.r1,540,560,b.pend-0.05,-3);
  schip("cChair",chairsS&&t>b.chip5&&t<b.fol0,540,520,b.chip5,-2);
  schip("cQueue",truth&&t>b.queue&&t<b.ooh+0.2,330,560,b.queue,-3);
  schip("cVip",truth&&t>b.vip&&t<b.ooh+0.2,780,700,b.vip,4);
  schip("cWork",award&&t>b.dhoom2&&t<b.r14,540,520,b.dhoom2,-3,1+0.04*Math.sin(t*20));
  schip("cGift",award&&t>b.panulu-0.05&&t<b.donk,560,560,b.panulu-0.05,-2);
  show("frz",frozen&&t<b.c16,1,"");
  // heist title card
  {const on=pan&&t>=b.heist-0.03; const e=$("heist"); e.style.opacity=on?Math.min(1,clamp((b.flo-t)/0.12)):0; e.style.transform=`scale(${lerp(2.2,1,out((t-b.heist+0.03)/0.12))}) rotate(-3deg)`}
  // award plaque STAMP
  {const on=award&&t>=b.stamp-0.06&&t<b.m13; const e=$("plaque"); e.style.opacity=on?Math.min(1,clamp((b.m13-t)/0.1)):0;
   e.style.transform=`rotate(${-2+(t>=b.stamp&&t<b.stamp+0.3?Math.sin(t*80)*1.5:0)}deg) scale(${lerp(2.4,1,clamp((t-b.stamp+0.06)/0.06))})`}
  // freeze caption
  show("frzT",frozen&&t<b.c16,pop(t,b.frz+0.05,0.3),`rotate(-4deg)`);
  // follow tap (silent, over the laugh)
  const fA=b.fol0, fB=b.fol1+0.1; const fOn=t>fA&&t<fB; const fol=$("fol"); fol.style.opacity=fOn?clamp(Math.min((t-fA)/0.15,(fB-t)/0.1)):0;
  fol.style.transform=`scale(${Math.max(0.01,back((t-fA)/0.3))*(Math.abs(t-b.tFol)<0.1?0.9:1)})`;
  const bF=$("bF"); bF.textContent=t<b.tFol?"+ FOLLOW":"FOLLOWING ✓"; bF.className="btn"+(t<b.tFol?"":" done");
  {const hand=$("tapHand"); const hk=ease((t-fA-0.05)/Math.max(0.3,b.tFol-fA-0.1)); const dip=Math.max(0,1-Math.abs(t-b.tFol)/0.1);
   hand.style.opacity=fOn?clamp(Math.min((t-fA-0.05)/0.12,(fB-t)/0.1)):0; hand.style.transform=`translate(${lerp(900,560,hk)-50}px,${lerp(1200,830,hk)+dip*12}px) rotate(${-8+dip*6}deg)`;
   const rg_=$("ring"), rk=(t-b.tFol)/0.4; rg_.style.opacity=fOn&&rk>0&&rk<1?1-rk:0; rg_.style.left="560px"; rg_.style.top="830px"; rg_.style.transform=`scale(${1+rk*6})`}
  // confetti: poppers on 'Merry Christmas' (stops in the freeze)
  CONF.forEach((r_,i)=>{const tc=frozen?b.frz:t; const t0=b.popper+hash(i)*0.25, k=tc-t0; const on=k>0&&k<2.6&&t<b.s17;
    if(!on){r_.setAttribute("opacity",0);return} const side=i%2?1:-1; const x=540+side*(470-k*(260+hash(i+7)*300))+Math.sin(k*3+i)*30, y=1500-k*900*(0.6+hash(i+3)*0.6)+k*k*700;
    r_.setAttribute("opacity",1); r_.setAttribute("transform",`translate(${x},${y}) rotate(${k*360*(hash(i+11)-0.5)*2+i*20})`)});
  // comment prompt + bubbles
  show("cq",t>b.c16+0.1&&t<b.s17,pop(t,b.c16+0.1,0.35)*(1+0.03*Math.sin(t*10)),`rotate(-1.5deg)`);
  CB.forEach((_,i)=>{const e=$("cb"+i), t0=b.tCm+0.05+i*0.11; const v=t>t0&&t<b.s17; e.style.opacity=v?1:0; e.style.transform=`translateY(${-(t-t0)*14}px) scale(${Math.max(0.01,pop(t,t0,0.3))}) rotate(${(i%2?3:-3)}deg)`});
  // share: tag your office manager
  {const shOn=t>b.s17&&t<b.end0+0.1; const sh=$("share"); sh.style.opacity=shOn?clamp(Math.min((t-b.s17)/0.2,(b.end0+0.1-t)/0.12)):0;
   $("sq").style.transform=`scale(${Math.max(0.01,back((t-b.s17)/0.4))})`;
   const tA=b.s17+0.35; $("cin").innerHTML=t>tA?(t>b.tTag+0.05?'<em>@My Manager 👔</em> 😅':"@"+(t>tA+0.25?"My M":"")):"";
   ["ct1","ct2","ct3"].forEach((id,i)=>{const e=$(id), t0=tA+0.1+i*0.08; e.style.opacity=t>t0?1:0; e.style.transform=`translateY(${lerp(30,0,out((t-t0)/0.25))}px) scale(${id==="ct1"&&Math.abs(t-b.tTag)<0.1?0.94:1})`; e.style.background=id==="ct1"&&t>b.tTag?"#FFF3B0":"#fff"});
   $("ok1").style.opacity=t>b.tTag+0.05?1:0}
  show("ep2",t>=b.ep2-0.03&&t<b.end0+0.1,lerp(1.8,1,out((t-b.ep2+0.03)/0.12)),`rotate(-3deg)`);
  // end card
  {const ec=$("endc"), eOn=t>b.end0; ec.style.opacity=eOn?clamp((t-b.end0)/0.12):0;
   $("eF").textContent=t<b.tEF?"FOLLOW @_REELRASAM":"FOLLOWING ✓  @_REELRASAM"; $("eF").style.transform=`scale(${Math.abs(t-b.tEF)<0.1?0.92:1})`; $("eF").style.background=t<b.tEF?"":"#6D6875";
   const eh=$("eHand"), ek=ease((t-b.end0)/Math.max(0.2,b.tEF-b.end0-0.05)), edip=Math.max(0,1-Math.abs(t-b.tEF)/0.1);
   eh.style.opacity=eOn&&t<b.tEF+0.3?clamp((b.tEF+0.3-t)/0.12):0; eh.style.transform=`translate(${lerp(900,300,ek)-50}px,${lerp(1300,800,ek)+edip*12}px) scale(${1-0.1*edip}) rotate(-8deg)`}
  // flashes
  {const fl=(t0,d,a_)=>t>t0&&t<t0+d?a_*(1-(t-t0)/d):0; let a=0,col="#FFFFFF";
   const add=(t0,d,a_,c)=>{const v=fl(t0,d,a_); if(v>a){a=v;col=c}};
   add(b.door,0.1,0.35,"#FFFFFF"); add(b.dhoom,0.12,0.5,"#FF5A3C"); add(b.pan0,0.1,0.45,"#FFFFFF"); add(b.flo,0.1,0.45,"#FFFFFF"); add(b.heist,0.1,0.35,"#E53935");
   add(b.faaah,0.12,0.6,"#E53935"); add(b.tr0,0.08,0.35,"#FFFFFF"); add(b.spot,0.08,0.3,"#FFF59D"); b.dhan.forEach((x,i)=>add(x,0.12,0.55,["#E53935","#FFD54F","#FFFFFF"][i]));
   add(b.aw0,0.08,0.35,"#FFFFFF"); add(b.faaah2,0.12,0.6,"#E53935"); add(b.stamp,0.1,0.45,"#FFFFFF"); add(b.donk,0.1,0.4,"#FFFFFF"); add(b.frz,0.16,0.85,"#FFFFFF");
   $("flash").style.opacity=a; $("flash").style.background=col}
  // subtitles (… -> ...)
  const sub=$("sub"), L=curLine(t);
  if(L&&!(t>b.end0)){sub.style.opacity=1; sub.innerHTML=`<span class="who" style="background:${COLORS[L.who]}">${NAMES[L.who]}</span><br>${subFix(L.text)}`} else sub.style.opacity=0;
}
function show(id,on,s=1,extra=""){const e=$(id); e.style.opacity=on?1:0; if(on) e.style.transform=`${extra} scale(${Math.max(0.01,s)})`}

window.render=function(t){ frame(t) };
