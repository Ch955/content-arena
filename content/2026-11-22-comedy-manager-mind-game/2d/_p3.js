// Ep 1 leftover: the red felicitation garland hung on the cabin door (below the plate)
{const gg=el("g",{transform:"translate(135,930) scale(.82)"},doorP); garlandShape(gg)}
const doorShine=el("rect",{x:30,y:700,width:24,height:520,fill:"#FFFFFF",opacity:.5},doorP);
W.appendChild(doorG);
// the manager's big chair (the Game 2 target, far left: the clues never lead there)
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
const BC=[0,1,2].map(k=>makeColleague(k,backPeople,false));     // the 20 Nov colleagues: heads over the partition (reactions, chorus)
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
