// Office comedy Ep 2 "😂 Operation Manager Mind Game" — sets + choreography (loaded by ep.html after office_cast.js).
// ONE set: the same open office as Ep 0/Ep 1 (cubicles, wall clock, the manager's glass cabin + MANAGER door), Christmas decor
// gone except Ep 1's leftovers (a drooping paper star; the red garland hung on the cabin door), Ramesh's 'SECONDARY ⭐' sticky
// (Ep 0) on his monitor, his helmet on the partition. New props: the water cooler, the manager's big chair, the scoreboard
// (HTML), the 3 game cards (HTML), the stopwatch (fx), the OUT! stamp (HTML). Beats: S1 villain entry + challenge -> GAME 1
// honesty -> GAME 2 blindfold (silent follow tap, cooler DONK, glass door BOINNG + FAAAH #1, birds) -> GAME 3 silence
// (stopwatch, explosion, FAAAH #2, OUT! stamp) -> 'winner?' -> 'మీరే సార్!' victory dance -> 0.3 s silence -> Ramesh's punch to
// camera -> FREEZE -> comment / tag / end card 'Series: Office Politics · Ep 2'.
// comment bubbles: generic names, no real usernames
const CB=[["Ravi","Silence game 😂😂","#1E88E5",70,1110],["Divya","Blindfold 🙈 glass door!","#D81B60",250,1220],["Teja","మా manager అన్నిట్లో 😅","#2E7D32",110,1330]];
$("cbs").innerHTML=CB.map(([n,g,c,x,y],i)=>`<div class="cb" id="cb${i}" style="left:${x}px;top:${y}px"><b style="color:${c}">${n}</b><i>${g}</i></div>`).join("");

const defs=el("defs",{});
const cam=el("g",{});
applySkin(cam, defs);
const W=el("g",{id:"world"},cam);
const FEET=1700;
const hipAt=s=>FEET-448*s;
const S85=0.85, H85=hipAt(S85);                 // everyone stands at this scale on the office floor
const RAM_X=90, PRI_X=280, MG_X=760, SUR_X=960, COOL_X=470, CHAIR_X=800, DOOR_X=1180, SUR_DOOR=1580;
// blur for the dancing manager behind Ramesh's close-up (L16)
{const f=el("filter",{id:"bgBlur",x:"-30%",y:"-30%",width:"160%",height:"160%"},defs); el("feGaussianBlur",{stdDeviation:7},f)}

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
// the manager's big chair (the Game 2 target): it stands right behind where he starts -- the clues lead him away from it
const chairG=el("g",{transform:`translate(${CHAIR_X},0)`},W);
el("rect",{x:-100,y:1010,width:200,height:330,rx:40,fill:"#263238",stroke:INK,"stroke-width":7},chairG);
el("rect",{x:-80,y:1040,width:160,height:250,rx:30,fill:"#37474F"},chairG);
el("rect",{x:-62,y:1080,width:124,height:40,rx:8,fill:"#FFFDF5",stroke:INK,"stroke-width":4},chairG);
txt("MANAGER",{x:0,y:1111,"font-family":"Anton","font-size":30,"letter-spacing":1,"text-anchor":"middle",fill:"#3F5A86"},chairG);
el("rect",{x:-120,y:1330,width:240,height:52,rx:18,fill:"#1C262C",stroke:INK,"stroke-width":7},chairG);
el("rect",{x:-14,y:1382,width:28,height:200,fill:"#78909C",stroke:INK,"stroke-width":4},chairG);
el("path",{d:`M-110 ${FEET-26} L0 1580 L110 ${FEET-26}`,stroke:"#455A64","stroke-width":16,fill:"none","stroke-linecap":"round"},chairG);
[-110,0,110].forEach(dx=>el("circle",{cx:dx,cy:FEET-18,r:16,fill:"#263238",stroke:INK,"stroke-width":3},chairG));
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
// heroic rays behind the boast (L3) + the FAAAH burst (behind the manager)
const rays=el("g",{},W);
for(let k=0;k<18;k++){const a=k*Math.PI/9; el("polygon",{points:`0,0 ${Math.cos(a-0.07)*900},${Math.sin(a-0.07)*900} ${Math.cos(a+0.07)*900},${Math.sin(a+0.07)*900}`,fill:k%2?"#FFE082":"#FFF59D",opacity:.75},rays)}
const burst=el("g",{},W);
{const pts=[]; for(let k=0;k<28;k++){const r=k%2?150:260, a=k*Math.PI/14; pts.push(`${(Math.cos(a)*r).toFixed(0)},${(Math.sin(a)*r*0.86).toFixed(0)}`)}
 el("polygon",{points:pts.join(" "),fill:"#E53935",stroke:INK,"stroke-width":8,"stroke-linejoin":"round"},burst);
 el("polygon",{points:pts.join(" "),fill:"#FF8A65",transform:"scale(.62)"},burst)}
const burstT=el("g",{},W);
txt("FAAAH!",{x:0,y:0,"font-family":"Anton","font-size":120,"letter-spacing":2,"text-anchor":"middle",fill:"#FFE066",stroke:INK,"stroke-width":10,"paint-order":"stroke","stroke-linejoin":"round"},burstT);

// ---------- people ----------
const people=el("g",{},W);
const BC=[0,1,2].map(k=>makeColleague(k,backPeople,false));
const impact=el("g",{opacity:0},W); for(let k=0;k<7;k++){const a=-1.2+k*0.4; el("line",{x1:Math.cos(a)*50,y1:Math.sin(a)*50,x2:Math.cos(a)*120,y2:Math.sin(a)*120,stroke:INK,"stroke-width":9,"stroke-linecap":"round"},impact)}     // the 20 Nov colleagues: heads over the partition (reactions, chorus)
const SU=makeSuresh(people,true,{});
const PR=makePriya(people,true,{});
const RM=makeRamesh(people,true,{});
const MG=makeManager(people,true,{});
W.appendChild(coolG);                                            // the cooler stands in front of the back row, behind nobody
people.parentNode.insertBefore(rays,people); people.parentNode.insertBefore(burst,people); people.parentNode.insertBefore(coolG,people); people.parentNode.insertBefore(burstT,people.nextSibling);
// mug steam ('villain smoke')
const steam=[]; for(let k=0;k<8;k++) steam.push(el("circle",{r:16,fill:"#FFFFFF",stroke:"#B0BEC5","stroke-width":3,opacity:0},W));
// cartoon birds + stars circling the manager's head after the glass door (world space)
const birds=[0,1,2,3].map(k=>{const g=el("g",{opacity:0},W);
  if(k%2===0){ el("ellipse",{cx:0,cy:0,rx:26,ry:18,fill:"#FFD54F",stroke:INK,"stroke-width":4},g); el("path",{d:"M22 -4 L40 2 L22 8 Z",fill:"#FB8C00",stroke:INK,"stroke-width":3},g);
    el("circle",{cx:10,cy:-6,r:4,fill:INK},g); el("path",{d:"M-6 -6 Q-16 -30 -28 -10",fill:"#FFE082",stroke:INK,"stroke-width":3},g) }
  else { const p=[]; for(let j=0;j<10;j++){const r=j%2?10:26, a=-Math.PI/2+j*Math.PI/5; p.push(`${(Math.cos(a)*r).toFixed(1)},${(Math.sin(a)*r).toFixed(1)}`)} el("polygon",{points:p.join(" "),fill:"#FFF176",stroke:INK,"stroke-width":3.5},g) }
  return g});
// confetti (screen space) + sparkles (screen space)
const CONF=[]; for(let k=0;k<80;k++) CONF.push(el("rect",{x:-9,y:-5,width:18,height:10,rx:2,fill:["#E53935","#FFD54F","#43A047","#1E88E5","#8E24AA","#FF7043"][k%6],opacity:0},fx));
const SPK=[]; for(let k=0;k<6;k++){const g=el("g",{opacity:0},fx); const p=[]; for(let j=0;j<8;j++){const r=j%2?7:24, a=j*Math.PI/4-Math.PI/2; p.push(`${(Math.cos(a)*r).toFixed(1)},${(Math.sin(a)*r).toFixed(1)}`)} el("polygon",{points:p.join(" "),fill:"#FFF59D",stroke:"#FFB300","stroke-width":3},g); SPK.push(g)}
// the 1:00 stopwatch (screen space, Game 3)
const SWX=540, SWY=600;
const swG=el("g",{opacity:0},fx), swIn=el("g",{},swG);
el("rect",{x:-30,y:-205,width:60,height:40,rx:8,fill:"#90A4AE",stroke:INK,"stroke-width":6},swIn);
el("rect",{x:-14,y:-176,width:28,height:22,fill:"#78909C",stroke:INK,"stroke-width":4},swIn);
el("circle",{cx:0,cy:0,r:168,fill:"#10141E"},swIn);
const swFace=el("circle",{cx:0,cy:0,r:150,fill:"#FFFDF5"},swIn);
for(let k=0;k<60;k++){const a=k*Math.PI/30, r0=k%5?132:118; el("line",{x1:Math.sin(a)*r0,y1:-Math.cos(a)*r0,x2:Math.sin(a)*142,y2:-Math.cos(a)*142,stroke:INK,"stroke-width":k%5?3:7},swIn)}
const swHand=el("line",{x1:0,y1:16,x2:0,y2:-126,stroke:"#E53935","stroke-width":8,"stroke-linecap":"round"},swIn);
el("circle",{r:12,fill:"#E53935",stroke:INK,"stroke-width":3},swIn);
const swTxt=txt("01:00",{x:0,y:84,"font-family":"Anton","font-size":64,"letter-spacing":2,"text-anchor":"middle",fill:INK},swIn);
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
function atIn(i,k,frac){return W0(i,k)+(W1(i,k)-W0(i,k))*frac}
const OV=(typeof window!=="undefined"&&window.BEAT_OVERRIDES)||{};
let B=null;
function beats(){ if(B) return B; B={};
  // S1: villain entry, the challenge, the bait, the boast
  B.door=0.05; B.walk0=0.1; B.walk1=2.0; B.titleIn=0.45; B.doorShut=1.55;
  B.dhoom=W0(0,2)-0.02; B.tada=E(0)+0.02;
  B.r1=S(1)-0.1; B.bloop=E(1)+0.02;
  B.m2=S(2)-0.05; B.brass=W0(2,5)-0.02; B.ting=E(2)+0.05;
  // GAME 1: honesty test
  B.g1=S(3)-0.3; B.gulp=E(3)+0.03; B.ooh=E(3)+0.33;
  B.m4=S(4)-0.05; B.see=W0(4,0); B.offChip=W0(4,4)-0.05; B.crick=E(4)+0.02;
  B.r5=S(5)-0.08; B.c404=atIn(5,1,0.2); B.laugh1=E(5)+0.03; B.rim=B.laugh1+0.2; B.team1=B.laugh1+0.35;
  // GAME 2: blindfold
  B.g2=S(6)-0.02; B.fol0=W0(6,1); B.tFol=W0(6,5)+0.1; B.fol1=E(6)+0.3; B.tie0=W0(6,3); B.fwip=E(6)+0.02;
  B.shuf0=S(7)-0.05; B.pend=W0(7,3)-0.05; B.donk=E(7)+0.05;
  B.s9=S(9)-0.05; B.point=W0(9,1); B.bonk=E(9)+0.2; B.faaah=E(9)+0.6; B.faaahE=B.faaah+1.0; B.birds=B.faaahE+0.05; B.team2=B.faaahE;
  // GAME 3: silence
  B.g3=S(10)-0.02; B.sw0=E(10)+0.02; B.tick1=B.sw0+0.05; B.tick2=B.sw0+0.42;
  B.buzz=W0(11,0); B.pointS=W0(11,3); B.faaah2=E(11)+0.2; B.faaah2E=B.faaah2+1.0;
  B.r12=S(12)-0.05; B.stamp=E(12)-0.04; B.team3=B.stamp;
  B.m13=S(13)-0.05; B.fish=W0(13,2)-0.05; B.roll0=W0(13,3)-0.1; B.roll1=E(13);
  // 'మీరే సార్!' + the silence + the punch + FREEZE
  B.ch=S(14)-0.03; B.mgr1=S(14)+0.12; B.cheer=E(14)+0.0; B.vbrass=E(14)+0.35; B.sil0=S(15)-0.32; B.sil1=S(15)-0.015;
  B.r15=S(15)-0.02; B.frz=E(15)+0.1; B.sting=E(15)+0.4; B.laugh3=E(15)+0.5;
  B.c16=S(16)-0.15; B.tCm=W0(16,0)+0.1; B.s17=W0(16,1)-0.08; B.tTag=W0(16,2)+0.05; B.endSting=E(16)-0.3; B.end0=E(16)+0.02; B.tEF=B.end0+0.45;
  Object.assign(B,OV);
  return B}

const focus=(z,wx,wy,sx=540,sy=1000,r=0)=>({z,fx:wx-(sx-540)/z,fy:wy-(sy-1000)/z,r});
const mixCam=(a,b_,k)=>({z:lerp(a.z,b_.z,k),fx:lerp(a.fx,b_.fx,k),fy:lerp(a.fy,b_.fy,k),r:lerp(a.r||0,b_.r||0,k)});
// keep short Telugu words with a neighbour (never orphan one on its own line), and hand-made breaks for the long lines
const subFix=s=>s.replace(/…/g,"...").replace(/(^|\s)(మీ|నా|నీ|ఏం|ఏ|మన|ఒక|ఈ|ఆ|మా)\s/g,"$1$2&nbsp;").replace(/([^\s.!?;])\s([ఀ-౿]{1,2}[.,!?]*)(?=\s|$)/g,"$1&nbsp;$2")
  .replace(/(Game) (\d)/g,"$1&nbsp;$2").replace(/(Yes) (sir)/g,"$1&nbsp;$2").replace(/(take) (it)/g,"$1&nbsp;$2").replace(/(offline) (life)/g,"$1&nbsp;$2").replace(/(pending) (appraisals)/g,"$1&nbsp;$2")
  .replace("ఛాలెంజ్! ఎవరు","ఛాలెంజ్!<br>ఎవరు").replace("mindset. Let's","mindset.<br>Let's").replace("సార్... మాకు","సార్...<br>మాకు").replace("Blindfold... సార్,","Blindfold...<br>సార్,")
  .replace("సార్... మా&nbsp;pending","సార్...<br>మా&nbsp;pending").replace("challenge... ఒక్క","challenge...<br>ఒక్క").replace("ఎక్కడ? సురేష్!","ఎక్కడ?<br>సురేష్!").replace("నడవదు! So","నడవదు!<br>So")
  .replace("గెలిచారు. కానీ","గెలిచారు.<br>కానీ").replace("మాత్రం మీరు","మాత్రం<br>మీరు").replace("చేయండి... మీ","చేయండి...<br>మీ").replace("ఓడించేవాడు... ఈ","ఓడించేవాడు...<br>ఈ")
  .replace("ఎప్పుడైనా టీమ్‌కి","ఎప్పుడైనా<br>టీమ్‌కి").replace("డెడ్‌లైన్ మీరే","డెడ్‌లైన్<br>మీరే");

function frame(t){
  const b=beats(); T_=t;
  const silent=t>=b.sil0&&t<b.sil1, frozen=t>=b.frz, fz1=t>=b.faaah&&t<b.faaahE, fz2=t>=b.faaah2&&t<b.faaah2E;
  // character time: slow-mo through FAAAH #1 (the glass keeps wobbling), stops in FAAAH #2, the silent beat and the freeze
  const T=frozen?b.frz:silent?b.sil0:fz1?b.faaah+(t-b.faaah)*0.15:t>=b.faaahE&&t<b.g3?t-0.85:fz2?b.faaah2:t;
  const sc1=t<b.g1, g1=t>=b.g1&&t<b.g2, g2=t>=b.g2&&t<b.g3, g3=t>=b.g3&&t<b.ch, fin=t>=b.ch, punch=t>=b.r15;
  $("s").style.filter=frozen?`saturate(${lerp(1,0.7,clamp((t-b.frz)/0.08))}) contrast(1.06) brightness(1.03)`:(fz1||fz2)?"saturate(1.25) contrast(1.05)":"";
  const still=frozen||silent||fz2;
  const R=(C,who,x,y,s)=>{resetPose(C,x,y,s,who&&!still?talkOf(who,t):0); C.st.blink=still?0:(((T*0.6+x*0.0013)%3.3)<0.11?1:0); return C.st};
  const m=R(MG,"manager",MG_X,H85,S85), r=R(RM,"ramesh",RAM_X,H85,S85), p=R(PR,"priya",PRI_X,H85,S85), su=R(SU,"suresh",SUR_X,H85,S85);
  m.itemL="mug"; MG.aim("L",m.x-70,H85-170*S85); m.hR=[70,-70]; m.look=-0.4; m.smirk=1; m.brow="q";
  r.look=0.6; r.smile=1; r.brow="u"; RM.aim("L",RAM_X-40,H85-60); RM.aim("R",RAM_X+40,H85-60);
  p.look=0.6; p.smirk=1; p.brow="q"; p.item="clipboard"; PR.aim("R",PRI_X+50,H85-170); PR.aim("L",PRI_X-30,H85-60);
  su.itemL="notepad"; su.look=-0.6; su.smile=1; su.brow="u"; SU.aim("L",SUR_X-40,H85-140); SU.aim("R",SUR_X+40,H85-80); bobble(su,T,0.35);
  [MG,RM,PR,SU].forEach(c=>{c.g.removeAttribute("filter")});
  let doorK=0, coolRot=0, wob=0;

  // ---------------- S1: villain entry from the cabin, the challenge, the bait, the boast ----------------
  if(sc1){
    const k=clamp((T-b.walk0)/(b.walk1-b.walk0)), step=Math.sin(k*Math.PI*3);
    m.x=lerp(DOOR_X+150,MG_X,out(k)); m.walk=k<1?step*0.8:0; m.hop=k<1?Math.abs(step)*8:0; m.rot=k<1?step*1.2:0; m.brow="a"; m.look=-0.5;
    m.hR=[90+step*20,-60];
    su.x=lerp(DOOR_X+330,SUR_X,out(clamp((T-b.walk0-0.35)/(b.walk1-b.walk0)))); su.walk=k<1?-step*0.7:0;                       // the yes-man trails behind him
    doorK=t<b.doorShut?out((t-b.door)/0.12):1-out((t-b.doorShut)/0.25);
    if(T>=b.dhoom){ m.brow="a"; m.smirk=1; m.headRot=-3; m.spread=1; m.hR=[160,-300]; m.look=-0.6 }                            // the challenge
    if(T>=b.dhoom+0.9){ m.hR=[110,-160]; m.spread=0; m.smile=1; m.smirk=0; m.brow="u" }
    [r,p].forEach(c=>{c.gasp=T>=b.dhoom&&T<b.dhoom+0.8?1:0; c.wide=c.gasp; c.look=0.7; c.smirk=0; c.smile=c.gasp?0:1});
    if(t>=b.r1){ r.smile=1; r.wide=1; r.brow="u"; r.look=0.8; RM.aim("R",RAM_X+70,H85-190) }                                 // too-sweet innocent question
    if(t>=b.r1){ m.look=-0.8; m.smile=0; m.smirk=1; m.brow="q" }
    if(t>=b.m2){ m.laugh=T<W0(2,0)+0.35?1:0; m.smirk=1; m.rot=-2; m.headRot=-5; m.look=-0.3; MG.aim("L",m.x-60,H85-410); m.hR=[100,-90]; r.wide=0 }   // chest out, mug raised
    if(t>=b.brass){ m.smile=1; m.smirk=0; m.brow="u"; m.hop=Math.max(0,8-(T-b.brass)*30) }
    if(t>=b.ting-0.05){ r.smile=0; r.smirk=1; r.brow="q"; r.look=0; r.lookY=0 }                                               // Ramesh's secret smile (one eyebrow)
  }
  // ---------------- GAME 1: honesty test ----------------
  if(g1){
    p.look=0.8; p.smile=1; p.smirk=0; p.brow="u"; PR.aim("L",PRI_X+150,H85-240);                                              // pen pointing at him
    m.look=-0.7; m.smile=1; m.brow="u"; m.smirk=0;
    if(t>=W0(3,1)){ p.smile=0; p.smirk=1; p.brow="q" }
    if(t>=b.gulp&&t<b.m4){ m.smile=0; m.gasp=1; m.wide=1; m.sweat=1; m.brow="u"; m.squash=1-0.05*Math.sin(clamp((T-b.gulp)/0.3)*Math.PI); m.look=0 }
    if(t>=b.m4){ m.sweat=1; m.look=0.7; m.smile=1; m.brow="w"; m.hR=[14,-282]; m.headRot=4;                                   // tugging his tie, avoiding eyes
      if(t>=W0(4,4)){ m.hR=[150,-190]; m.spread=1; m.smirk=1; m.smile=0; m.brow="n"; m.headRot=0 } }
    if(t>=b.ooh&&t<b.r5){ r.gasp=1; r.wide=1; r.smile=0; p.gasp=0; su.gasp=1; su.smile=0 }
    if(t>=b.r5){ r.smile=0; r.sad=1; r.brow="w"; r.look=0.8; r.smirk=0; RM.aim("R",RAM_X+60,H85-120); m.spread=0; m.hR=[70,-70]; m.smile=0; m.smirk=0; m.brow="a"; m.look=-0.7; m.angry=0.3 }
    if(t>=b.laugh1){ [p,su].forEach((c,j)=>{c.laugh=1; c.shut=1; c.smirk=0; c.smile=0; c.headRot=Math.sin(T*12+j)*6; c.hop=Math.abs(Math.sin(T*10+j*2))*8}); r.sad=0; r.smirk=1; m.angry=0.6 }
  }
  // ---------------- GAME 2: blindfold ----------------
  let mx=MG_X;
  if(g2){
    p.smile=1; p.smirk=0; p.brow="u"; p.look=0.8; PR.aim("L",PRI_X-60,H85-330);                                                // bright game host
    if(t>=W0(6,1)){ p.smile=0; p.smirk=1; p.brow="q" }
    m.smile=1; m.smirk=1; m.brow="u"; m.look=-0.3;
    if(t>=b.tie0&&t<b.shuf0+0.2){ const k=out((t-b.tie0)/0.4); su.x=lerp(SUR_X,MG_X+95,k); su.itemL=""; bobble(su,T,0.2);
      SU.aim("L",MG_X+40,H85-370*S85); SU.aim("R",MG_X+120,H85-380*S85); su.look=-0.8 }                                          // Suresh ties it on
    m.blind=clamp((t-b.fwip+0.25)/0.25);
    if(t>=b.shuf0){ su.x=lerp(MG_X+95,SUR_DOOR,out((t-b.shuf0)/0.8)); su.walk=t<b.shuf0+0.8?Math.sin(t*12)*0.7:0; su.look=-0.8 }   // to the far side of the glass door
    if(t>=b.shuf0){ const k=clamp((T-b.shuf0)/(b.donk-b.shuf0)); mx=lerp(MG_X,COOL_X+128,k); const st=Math.sin(T*9);
      m.walk=st*0.5; m.hop=Math.abs(st)*5; m.rot=st*1.5; m.smile=0; m.smirk=1; m.brow="n"; m.itemL="mug"; MG.aim("L",mx-150,H85-290); m.hR=[150,-260];
      r.smile=0; r.smirk=1; r.brow="q"; r.look=0.8; RM.aim("R",RAM_X+40,H85-345); p.smirk=1; p.look=0.8 }                         // arms out, shuffling left; Ramesh's helpful low voice
    if(t>=b.donk){ const k=T-b.donk; mx=COOL_X+128+Math.min(30,k*120); m.walk=0; m.hop=0; m.rot=Math.sin(k*30)*4*Math.exp(-k*5); m.gasp=1; m.smirk=0; m.squash=1-0.07*Math.exp(-k*10);
      coolRot=-7*Math.sin(k*22)*Math.exp(-k*4); [r,p].forEach(c=>{c.smirk=0; c.gasp=0; c.laugh=k<0.6?1:0; c.shut=c.laugh}) }
    if(t>=b.s9){ su.smile=1; su.brow="u"; bobble(su,T,1.6); su.look=0.8; su.itemL="notepad"; m.gasp=0; m.smirk=1; m.look=0.6 }
    if(t>=b.point){ SU.aim("L",SUR_DOOR-260,H85-250); su.itemL=""; su.look=-0.9; su.hop=Math.abs(Math.sin(T*8))*5;                                          // points 'Straight!' at the glass door
      const k=clamp((T-b.point)/(b.bonk-b.point)); mx=lerp(COOL_X+158,DOOR_X+60,ease(k)); const st=Math.sin(T*12);
      m.walk=k<1?st*0.9:0; m.hop=k<1?Math.abs(st)*8:0; m.rot=k<1?2:0; m.smile=1; m.smirk=0; m.brow="u"; MG.aim("L",mx+40,H85-300); m.hR=[190,-250] }   // confident, straight on
    if(T>=b.bonk){ const k=T-b.bonk; mx=DOOR_X+60-Math.min(26,k*200); m.walk=0; m.hop=0; m.rot=-3*Math.exp(-k*6); m.squash=1-0.1*Math.exp(-k*8); m.gasp=1; m.wide=1; m.smile=0; m.brow="u";
      m.hR=[130,-180]; MG.aim("L",mx-80,H85-200); wob=Math.sin(k*38)*Math.exp(-k*2.8); su.gasp=1; su.smile=0; su.nod=0; su.headRot=0;
      [r,p].forEach(c=>{c.gasp=1; c.wide=1; c.laugh=0; c.shut=0}) }
    if(t>=b.faaahE){ m.gasp=0; m.wide=0; m.blank=1; m.twitch=1; m.headRot=Math.sin(t*3)*6; [r,p].forEach((c,j)=>{c.gasp=0; c.laugh=1; c.shut=1; c.hop=Math.abs(Math.sin(t*10+j))*8}); su.gasp=0; su.sad=1 }
  }
  m.x=g2?mx:m.x;
  // ---------------- GAME 3: silence ----------------
  if(g3){
    m.blind=0; m.smirk=0; m.smile=0; m.brow="n"; m.look=0; m.angry=0; r.smirk=1; r.smile=0; r.look=0.7; p.smirk=1; p.look=0.7; su.look=-0.7; su.smile=1;
    if(t>=b.g3+0.1&&t<b.buzz){ p.smile=1; p.smirk=0; PR.aim("L",PRI_X-20,H85-360); if(t>=W0(10,1)) PR.aim("L",PRI_X+20,H85-345) }     // finger on lips
    if(t>=b.sw0&&t<b.buzz){ const k=(t-b.sw0)/(b.buzz-b.sw0); m.angry=0.2+k*1.0; m.brow="a"; m.headRot=Math.sin(t*40)*k*2.5; m.squash=1-0.02*k; m.wide=1 }  // cheeks puff, holding it in
    if(t>=b.buzz){ m.angry=1.2; m.brow="a"; m.wide=0; m.headRot=Math.sin(T*16)*3; m.hop=Math.max(0,12-(T-b.buzz)*50);
      MG.aim("R",RAM_X+260,H85-260); m.look=-0.9;                                                                              // 'రమేష్!' (points at Ramesh)
      if(t>=b.pointS){ MG.aim("R",SUR_X-60,H85-280); m.look=0.9 }                                                             // 'సురేష్!'
      [r,p,su].forEach(c=>{c.gasp=1; c.wide=1; c.smirk=0; c.smile=0; c.nod=0; c.headRot=0}) }
    if(t>=b.r12){ m.angry=0.6; m.hop=0; m.hR=[70,-70]; m.look=-0.5;
      [r,p,su].forEach(c=>{c.gasp=0; c.wide=0}); r.smirk=1; r.brow="q"; r.look=0.8; RM.aim("R",RAM_X+150,H85-300); p.smirk=1; su.sad=1 }  // a calm referee
    if(t>=b.stamp){ m.angry=0; m.gasp=1; m.wide=1; m.brow="u"; RM.aim("R",RAM_X+200,H85-380) }
    if(t>=b.m13){ m.gasp=0; m.wide=0; m.smirk=1; m.smile=0; m.brow="u"; m.rot=-3; m.headRot=-5; m.hR=[100,-80]; m.look=-0.3;    // unashamed, chest out
      r.smirk=0; r.brow="w"; RM.aim("R",RAM_X+40,H85-60); p.smirk=0; p.brow="w"; su.sad=0; su.smile=1 }
    if(t>=b.fish){ m.hR=[78,-388]; m.look=Math.sin(T*5)*0.9; m.headRot=Math.sin(T*5)*5; m.smile=1; m.smirk=0 }               // hand to his ear, fishing for praise
  }
  // ---------------- 'మీరే సార్!', the victory dance, the silence, the punch, the FREEZE ----------------
  if(fin){
    const dk=T-b.ch, w=Math.sin(T*11);
    m.x=lerp(MG_X,520,ease(clamp(dk/1.6))); m.smile=1; m.shut=1; m.brow="u"; m.hop=Math.abs(w)*22; m.rot=w*5; m.headRot=-w*6;
    MG.aim("L",m.x-60,H85-520); m.hR=[120+w*40,-330+Math.abs(w)*60]; m.spread=1;                                           // the mug up like a trophy
    [r,p,su].forEach((c,j)=>{const ww=Math.sin(T*13+j*1.7); c.smile=1; c.smirk=0; c.brow="u"; c.look=0; c.hop=Math.abs(ww)*10; c.nod=0; c.headRot=0});
    RM.aim("R",RAM_X+60,H85-430+Math.sin(T*13)*20); PR.aim("L",PRI_X-60,H85-430+Math.sin(T*13+1.7)*20); SU.aim("R",SUR_X+60,H85-430+Math.sin(T*13+3.4)*20); p.item="";
    if(punch){ r.x=RAM_X+60; r.s=1.15; r.y=hipAt(1.15)+150; r.hop=0; r.smile=0; r.smirk=1; r.brow="q"; r.look=0; r.lookY=0; RM.aim("L",r.x-40,r.y-60); RM.aim("R",r.x+40,r.y-60);
      people.appendChild(RM.g); [MG,PR,SU].forEach(c=>c.g.setAttribute("filter","url(#bgBlur)"));
      [p,su].forEach(c=>{c.hop=0; c.smile=0; c.smirk=1; c.brow="q"}); PR.aim("L",PRI_X-30,H85-60); SU.aim("R",SUR_X+40,H85-80);
      if(t>=W0(15,4)-0.05) r.brow="q", r.headRot=-3 }
  } else people.insertBefore(RM.g,MG.g);
  [SU,PR,RM,MG].forEach(c=>c.draw());
  // back-row colleagues pop up: the 'ooooh' (G1), the laughs, the chorus
  BC.forEach((c,i)=>{const X=[630,185,-300][i];
    const up=Math.max(g1&&t>=b.ooh?out((t-b.ooh-0.05*i)/0.2):0, t>=b.laugh1&&t<b.g2?1:0, g2&&t>=b.faaahE?out((t-b.faaahE-0.06*i)/0.2):0, fin?out((t-b.ch-0.05*i)/0.2):0);
    const st_=R(c,null,X,lerp(1330,1150,up),0.5); st_.vis=up>0?1:0; st_.look=i===0?0.5:0.7;
    if(g1&&t<b.laugh1){ st_.gasp=1; st_.wide=1 } else if(fin){ st_.smile=1; st_.hR=[30,-460]; st_.hop=Math.abs(Math.sin(T*12+i))*10 } else { st_.laugh=1; st_.shut=1; st_.headRot=Math.sin(T*14+i)*5; st_.hop=Math.abs(Math.sin(T*12+i))*10 }
    if(punch) c.g.setAttribute("filter","url(#bgBlur)"); else c.g.removeAttribute("filter");
    c.draw()});
  // the door (opens for the entry; the glass wobbles after the BOINNG), the cooler, the rays
  doorP.setAttribute("transform",`translate(${wob*10},0) skewX(${wob*4}) scale(${1-0.78*doorK},1)`); doorShine.setAttribute("x",30+wob*30);
  coolB.setAttribute("transform",`rotate(${coolRot} ${COOL_X} 1690) translate(${COOL_X},0)`);
  bub.forEach((c_,i)=>{const k=(t-b.donk-0.1-i*0.12)/0.5; const on=g2&&k>0&&k<1; c_.setAttribute("opacity",on?1-k:0); c_.setAttribute("cy",1330-k*120); c_.setAttribute("cx",Math.sin(k*9+i)*14)});
  {const on=sc1&&t>=b.brass&&t<b.ting; rays.style.display=on?"":"none"; rays.setAttribute("transform",`translate(${MG_X},${H85-300}) rotate(${t*20}) scale(${Math.max(0.01,out((t-b.brass)/0.2))})`)}
  // FAAAH bursts (behind the manager)
  {const h1=t>=b.faaah-0.03&&t<b.faaahE+0.05, h2=t>=b.faaah2-0.03&&t<b.faaah2E+0.05; const on=h1||h2, t0=h1?b.faaah:b.faaah2;
   const [hx,hy]=MG.headW(); const k=Math.max(0.01,back((t-t0+0.03)/0.18)); burst.style.display=burstT.style.display=on?"":"none";
   burst.setAttribute("transform",`translate(${hx},${hy}) scale(${0.8*k}) rotate(${(t-t0)*30})`);
   burstT.setAttribute("transform",`translate(${hx+10},${hy-150*MG.st.s}) scale(${0.62*k}) rotate(-6)`)}
  {const on=g2&&t>=b.bonk&&t<b.bonk+0.45; const [hx,hy]=MG.headW(); impact.setAttribute("opacity",on?1-clamp((t-b.bonk-0.25)/0.2):0);
   impact.setAttribute("transform",`translate(${hx+40},${hy-10}) scale(${0.6+0.6*out((t-b.bonk)/0.15)})`)}
  // birds + stars circling his head after the glass door
  {const on=g2&&t>=b.bonk+0.1; const [hx,hy]=MG.headW();
   birds.forEach((g_,i)=>{const a=t*5+i*Math.PI/2; g_.setAttribute("opacity",on?clamp((t-b.bonk-0.1)/0.15):0);
     g_.setAttribute("transform",`translate(${hx+Math.cos(a)*95},${hy-95+Math.sin(a)*26}) scale(${0.8+0.2*Math.sin(a)}) ${Math.cos(a)<0?"scale(-1,1)":""}`)})}
  // mug steam ('villain smoke') in the entry
  steam.forEach((p_,i)=>{const f=fract(t*0.9+i/8); const on=sc1&&t<b.r1; const mm=MG.st;
    p_.setAttribute("cx",mm.x-75*mm.s+Math.sin(f*6+i)*20); p_.setAttribute("cy",H85-175*S85-40-f*220); p_.setAttribute("r",10+f*20); p_.setAttribute("opacity",on?(1-f)*0.7:0)});

  // ---------------- Gopi (narrator badge): the comment + the tag ----------------
  const g=GOPI.st;
  const cmOn=t>b.c16&&t<b.s17, tgOn=t>=b.s17&&t<b.end0, narOn=cmOn||tgOn; const narT=tgOn?b.s17:b.c16;
  let BX=930, BY=760, bsc=0.8; if(tgOn){ BX=920; BY=1390 }
  Object.assign(g,{x:0,y:400*0.55+12,s:0.55,talk:talkOf("gopi",t),blink:((t*0.7)%3.1)<0.12?1:0,wink:0,look:-0.5,lookY:0,brow:"q",smile:1,headRot:Math.sin(t*2.2)*3,item:"",armL:200,armR:160,lenL:115,lenR:115,hop:0,itemRot:0});
  GOPI.draw();
  const bs=narOn?Math.max(0.001,back((t-narT)/0.35)):0;
  badge.setAttribute("transform",`translate(${BX},${BY}) scale(${bs*bsc}) rotate(${Math.sin(t*2)*2})`); badge.style.opacity=narOn?1:0;

  // ---------------- camera ----------------
  const pu=(t0,a_=0.1,k=5)=>t>t0?a_*Math.exp(-(t-t0)*k)*clamp((t-t0)/0.04):0;
  const HY=H85-392*S85;   // head height (standing, s 0.85)
  const shots=[
    [0,focus(1.05,1160,1010,540,1040,-3)],                                               // low angle: out of the cabin
    [0.85,focus(0.95,960,1080,540,1040),0.9],                                             // follow the slow-mo walk
    [b.dhoom,focus(1.6+pu(b.dhoom,0.14),MG_X,HY+40,540,920,-2),0.05],                      // DHOOM punch-in on 'ఛాలెంజ్!'
    [b.dhoom+0.9,focus(0.8,560,1180,540,1060),0.35],                                      // wide: the team + the boss
    [b.r1,focus(1.45,RAM_X+80,1010,540,980),0.01],                                        // Ramesh, too sweet
    [b.m2,focus(1.3,MG_X,1030,540,980),0.01],                                             // the boast
    [b.brass,focus(1.45+pu(b.brass,0.05),MG_X,1010,540,960),0.06],
    [b.ting-0.05,focus(2.5,RAM_X,HY+15,540,900),0.08],                                    // Ramesh's secret smile
    [b.g1,focus(1.2,540,1090,540,1070),0.01],                                             // GAME 1: Priya + the boss
    [b.gulp,focus(1.85+pu(b.gulp,0.05),MG_X,HY+40,540,920),0.06],                         // the gulp
    [b.m4,focus(1.35,MG_X-30,1040,540,980),0.15],                                         // the dodge
    [b.r5,focus(0.98,440,1110,540,1040),0.01],                                            // Ramesh's jab
    [b.laugh1,focus(0.8,560,1180,540,1060),0.2],                                          // the laugh
    [b.g2,focus(0.66,620,1250,540,1090),0.01],                                            // GAME 2 wide: the chair (left), the cooler, the door (right)
    [b.tie0,focus(1.15,830,1060,540,1000),0.3],                                           // Suresh ties the blindfold
    [b.shuf0,focus(0.95,540,1130,540,1040),0.3],                                          // the shuffle
    [b.donk,focus(1.5+pu(b.donk,0.1,8),COOL_X+90,1060,540,1000),0.03],                    // DONK
    [b.s9,focus(0.92,1090,1130,540,1050),0.15],                                            // 'Straight!' -> the door
    [b.bonk,focus(1.3+pu(b.bonk,0.12),DOOR_X+60,1070,540,1000),0.03],                     // BOINNG
    [b.faaah,focus(2.3,DOOR_X+40,HY+30,540,920),0.07],                                   // FAAAH #1 slow-mo zoom
    [b.faaahE,focus(1.15,DOOR_X+20,1060,540,1000),0.25],                                 // dazed, birds
    [b.g3,focus(0.98,545,1190,540,1130),0.01],                                            // GAME 3 under the stopwatch
    [b.buzz,focus(1.2+pu(b.buzz,0.1),MG_X-60,1100,540,1100),0.04],                        // the explosion
    [b.faaah2,focus(2.2,MG_X,HY+30,540,960),0.07],                                        // FAAAH #2
    [b.r12-0.02,focus(0.98,520,1130,540,1070),0.01],                                      // Ramesh's verdict + OUT!
    [b.m13,focus(1.3+0.04*(t-b.m13),MG_X,1040,540,990),0.15],                             // chest out, fishing
    [b.ch-0.02,focus(0.8,560,1180,540,1060),0.01],                                        // 'మీరే సార్!' + the dance
    [b.r15,focus(1.45,RAM_X+60,900,330,860),0.01],                                        // Ramesh to camera (the dance blurred behind)
  ];
  let cm=shots[0][1];
  {let i=0; while(i+1<shots.length&&t>=shots[i+1][0]) i++;
   const [t0,c,tr]=shots[i]; cm=c;
   if(i>0&&tr&&t<t0+tr){ const prev=shots[i-1][1]; cm=mixCam(prev,c,ease((t-t0)/tr)) }}
  if(frozen) cm={...cm,z:cm.z*(1+0.04*clamp((t-b.frz)/0.25))};
  let sx=0,sy=0; const shake=(t0,d,a_)=>{if(t>t0&&t<t0+d){const q=(1-(t-t0)/d)*a_; sx+=Math.sin(t*90)*q; sy+=Math.cos(t*77)*q}};
  shake(b.dhoom,0.45,22); shake(b.donk,0.25,12); shake(b.bonk,0.35,22); shake(b.faaah,0.25,10); shake(b.buzz,0.3,14); shake(b.faaah2,0.25,10); shake(b.stamp,0.35,24); shake(b.frz,0.12,10); shake(b.door,0.2,8);
  cam.setAttribute("transform",`translate(${540+sx},${1000+sy}) rotate(${cm.r||0}) scale(${cm.z}) translate(${-cm.fx},${-cm.fy})`);
  const scr=(wx,wy)=>{const r_=(cm.r||0)*Math.PI/180, dx=(wx-cm.fx)*cm.z, dy=(wy-cm.fy)*cm.z; return [540+dx*Math.cos(r_)-dy*Math.sin(r_)+sx, 1000+dx*Math.sin(r_)+dy*Math.cos(r_)+sy]};
  // fake sparkles round the scoreboard's 'MANAGER 1'
  SPK.forEach((s_,i)=>{const on=t>=b.mgr1&&t<b.mgr1+1.3&&!frozen; const a=i/6*Math.PI*2+(t-b.mgr1)*2.5;
    s_.setAttribute("opacity",on?1-clamp((t-b.mgr1-0.9)/0.4):0); s_.setAttribute("transform",`translate(${400+Math.cos(a)*150},${186+Math.sin(a)*40}) scale(${Math.max(0.01,pop(t,b.mgr1+i*0.05,0.25))*0.8}) rotate(${(t-b.mgr1)*120})`)});
  // the stopwatch
  {const on=g3&&t<b.faaah2; const sk=on?Math.max(0.01,back((t-b.g3-0.25)/0.3)):0.01; swG.setAttribute("opacity",on&&t>=b.g3+0.25?1:0);
   const sec=t<b.tick1?0:t<b.tick2?1:2; swHand.setAttribute("transform",`rotate(${sec*6})`); swTxt.textContent=["01:00","00:59","00:58"][sec];
   const red=t>=b.buzz&&t<b.buzz+0.5&&(Math.floor((t-b.buzz)*12)%2===0); swFace.setAttribute("fill",t>=b.buzz?(red?"#FF5252":"#FFCDD2"):"#FFFDF5");
   const jit=t>=b.buzz&&t<b.buzz+0.4?Math.sin(t*90)*6:0; swG.setAttribute("transform",`translate(${SWX+jit},${SWY}) scale(${sk*0.85}) rotate(${t>=b.buzz?Math.sin(t*50)*3*Math.exp(-(t-b.buzz)*4):0})`)}

  // ---------------- HTML overlays ----------------
  {const dm=$("dim"); let a=0, bg="#10141E";
   if(t>=b.c16&&t<b.s17){ a=0.5*clamp((t-b.c16)/0.25) }
   dm.style.opacity=a; dm.style.background=bg}
  {const on=t<b.dhoom-0.05; $("hook").style.opacity=on?clamp((b.dhoom-0.05-t)/0.1):0;
   $("hook").style.transform=`rotate(${-1.5+Math.sin(t*3)*0.6}deg) scale(${t<0.25?1+0.08*Math.sin(t/0.25*Math.PI):1})`;
   const ti=$("title"), ton=t>b.titleIn&&t<b.dhoom-0.05; ti.style.opacity=ton?1:0; ti.style.transform=`scale(${Math.max(0.01,back((t-b.titleIn)/0.3))}) rotate(-2deg)`}
  // scoreboard
  {const sc=$("score"), on=t>=b.dhoom&&t<b.s17; sc.style.opacity=on?1:0;
   const tm=t>=b.team3?3:t>=b.team2?2:t>=b.team1?1:0, mg=t>=b.mgr1?1:0; $("sT").textContent=tm; $("sM").textContent=mg+(mg?" ✨":"");
   const last=Math.max(...[b.team1,b.team2,b.team3,b.mgr1].filter(x=>t>=x),-9); const pk=t-last<0.3?1+0.18*Math.sin((t-last)/0.3*Math.PI):1;
   sc.style.transform=`translateY(${lerp(-260,0,out((t-b.dhoom)/0.3))}px) scale(${pk})`}
  // game cards: slam big, then settle as a label under the scoreboard
  [["g1",b.g1,b.g2],["g2",b.g2,b.g3],["g3",b.g3,b.ch]].forEach(([id,t0,t1])=>{const e=$(id); const on=t>=t0&&t<t1&&!(id==="g3"&&t>=b.sw0&&t<b.r12);
    if(!on){e.style.opacity=0;return} const k=out((t-t0-1.0)/0.3), sl=lerp(1.9,1,out((t-t0)/0.12));
    e.style.opacity=1; e.style.top=lerp(330,232,k)+"px"; e.style.transform=`scale(${sl*lerp(1,0.46,k)}) rotate(${lerp(-3,0,k)}deg)`; e.style.transformOrigin="50% 0"});
  const schip=(id,on,px,py,t0,rot,s=1)=>{const e=$(id); if(!on){e.style.opacity=0;return} e.style.opacity=1; e.style.left=px+"px"; e.style.top=py+"px"; e.style.transform=`translate(-50%,-50%) scale(${Math.max(0.01,pop(t,t0,0.3))*s}) rotate(${rot}deg)`};
  schip("cOff",g1&&t>b.offChip&&t<b.r5+0.3,560,560,b.offChip,-3);
  schip("c404",g1&&t>b.c404&&t<b.g2,540,580,b.c404,3);
  schip("cPend",g2&&t>b.pend&&t<b.s9,560,560,b.pend,-3);
  // OUT! stamp over the manager
  {const on=g3&&t>=b.stamp-0.06&&t<b.m13; const e=$("outS"); const [px,py]=scr(MG_X,H85-250);
   e.style.opacity=on?Math.min(1,clamp((b.m13-t)/0.1)):0; e.style.left=Math.min(px,790)+"px"; e.style.top=py+"px";
   e.style.transform=`translate(-50%,-50%) rotate(${-12+(t>=b.stamp&&t<b.stamp+0.3?Math.sin(t*80)*1.5:0)}deg) scale(${lerp(2.6,1,clamp((t-b.stamp+0.06)/0.06))})`}
  show("frz",frozen&&t<b.c16,1,"");
  show("frzT",frozen&&t<b.c16,pop(t,b.frz+0.05,0.3),`rotate(-3deg)`);
  // follow tap (silent, inside the Game 2 card)
  const fA=b.fol0, fB=b.fol1; const fOn=t>fA&&t<fB; const fol=$("fol"); fol.style.opacity=fOn?clamp(Math.min((t-fA)/0.15,(fB-t)/0.1)):0;
  fol.style.transform=`scale(${Math.max(0.01,back((t-fA)/0.3))*(Math.abs(t-b.tFol)<0.1?0.9:1)})`;
  const bF=$("bF"); bF.textContent=t<b.tFol?"+ FOLLOW":"FOLLOWING ✓"; bF.className="btn"+(t<b.tFol?"":" done");
  {const FX=955, FY=1335; const hand=$("tapHand"); const hk=ease((t-fA-0.05)/Math.max(0.3,b.tFol-fA-0.1)); const dip=Math.max(0,1-Math.abs(t-b.tFol)/0.1);
   hand.style.opacity=fOn?clamp(Math.min((t-fA-0.05)/0.12,(fB-t)/0.1)):0; hand.style.transform=`translate(${lerp(1000,FX,hk)-50}px,${lerp(1560,FY,hk)+dip*12}px) rotate(${-8+dip*6}deg)`;
   const rg_=$("ring"), rk=(t-b.tFol)/0.4; rg_.style.opacity=fOn&&rk>0&&rk<1?1-rk:0; rg_.style.left=FX+"px"; rg_.style.top=FY+"px"; rg_.style.transform=`scale(${1+rk*6})`}
  // confetti on 'మీరే సార్!' (stops in the silence + the freeze)
  CONF.forEach((r_,i)=>{const tc=frozen?b.frz:silent?b.sil0:t; const t0=b.ch+0.1+hash(i)*0.25, k=tc-t0; const on=k>0&&k<2.6&&t<b.c16;
    if(!on){r_.setAttribute("opacity",0);return} const side=i%2?1:-1; const x=540+side*(470-k*(260+hash(i+7)*300))+Math.sin(k*3+i)*30, y=1500-k*900*(0.6+hash(i+3)*0.6)+k*k*700;
    r_.setAttribute("opacity",1); r_.setAttribute("transform",`translate(${x},${y}) rotate(${k*360*(hash(i+11)-0.5)*2+i*20})`)});
  // comment prompt + bubbles
  show("cq",t>b.c16+0.1&&t<b.s17,pop(t,b.c16+0.1,0.35)*(1+0.03*Math.sin(t*10)),`rotate(-1.5deg)`);
  CB.forEach((_,i)=>{const e=$("cb"+i), t0=b.tCm+0.05+i*0.11; const v=t>t0&&t<b.s17; e.style.opacity=v?1:0; e.style.transform=`translateY(${-(t-t0)*14}px) scale(${Math.max(0.01,pop(t,t0,0.3))}) rotate(${(i%2?3:-3)}deg)`});
  // share: tag your office manager
  {const shOn=t>b.s17&&t<b.end0+0.1; const sh=$("share"); sh.style.opacity=shOn?clamp(Math.min((t-b.s17)/0.2,(b.end0+0.1-t)/0.12)):0;
   $("sq").style.transform=`scale(${Math.max(0.01,back((t-b.s17)/0.4))})`;
   const tA=b.s17+0.25; $("cin").innerHTML=t>tA?(t>b.tTag+0.05?'<em>@My Manager 👔</em> 😅':"@"+(t>tA+0.2?"My M":"")):"";
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
   add(b.door,0.1,0.3,"#FFFFFF"); add(b.dhoom,0.12,0.5,"#FF5A3C"); add(b.g1,0.1,0.35,"#FFFFFF"); add(b.g2,0.1,0.35,"#FFFFFF"); add(b.g3,0.1,0.35,"#FFFFFF");
   add(b.bonk,0.1,0.5,"#FFFFFF"); add(b.faaah,0.12,0.6,"#E53935"); add(b.buzz,0.12,0.45,"#E53935"); add(b.faaah2,0.12,0.6,"#E53935"); add(b.stamp,0.1,0.45,"#FFFFFF"); add(b.frz,0.16,0.85,"#FFFFFF");
   $("flash").style.opacity=a; $("flash").style.background=col}
  // subtitles (… -> ...)
  const sub=$("sub"), L=curLine(t);
  if(L&&!(t>b.end0)){sub.style.opacity=1; sub.innerHTML=`<span class="who" style="background:${COLORS[L.who]}">${NAMES[L.who]}</span><br>${subFix(L.text)}`} else sub.style.opacity=0;
}
function show(id,on,s=1,extra=""){const e=$(id); e.style.opacity=on?1:0; if(on) e.style.transform=`${extra} scale(${Math.max(0.01,s)})`}

window.render=function(t){ frame(t) };
