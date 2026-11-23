// Twist story "the mystery tiffin" — drawn world, cast and choreography (loaded by ep.html).
// makeAdult rig reused from 19 Nov "the junior's salary"; added here: saree.check (checked cotton), floor (saree to the
// floor when standing), apron (+ pocket), streaks (grey hair streaks), st.specSwing (specs on the chain swing), the
// items ladle (right hand) and laptop (left hand). New props: the dented two-tier steel tiffin, the tea trolley, the
// curry-leaf + mustard-seed steam swirl, the airport photo, Nikhil's monitor with the DAY 6 tally.
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
// countdown comment bubbles: WRONG guesses only (never the aunty, the counter or the photo)
const CB=[["Ravi","Ananya ఏ 😏","#1E88E5",40,980],["Priya","Secret admirer 💘","#D81B60",640,1060],
          ["Teja","Amma courier పంపిందా? 📦","#2E7D32",40,1390],["Sneha","Office ghost 👻😂","#8E24AA",560,1500]];
$("cbs").innerHTML=CB.map(([n,g,c,x,y],i)=>`<div class="cb" id="cb${i}" style="left:${x}px;top:${y}px"><b style="color:${c}">${n}</b><i>${g}</i></div>`).join("");
// torn-paper edge for the memory inset
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
const DT=1180, FL=1450, CX=3000, CT=1150;   // desk top, wall base / aisle floor, cafeteria x offset, counter top
let clipN=0;

// ---------- props ----------
function makeTiffin(parent,o={}){   // two-tier round steel tiffin, base centre at (0,0); DENT on the lid at 2 o'clock
  const g=el("g",{},parent), body=el("g",{},g);
  [[-58,0],[-116,-58]].forEach(([y0,y1])=>{ el("rect",{x:-60,y:y0,width:120,height:y1-y0,rx:7,fill:"#C5CED3",stroke:INK,"stroke-width":4},body);
    el("rect",{x:-44,y:y0+6,width:11,height:y1-y0-12,rx:5,fill:"#F4F7F8",opacity:.8},body); el("rect",{x:30,y:y0+6,width:16,height:y1-y0-12,rx:6,fill:"#9AA7AE",opacity:.55},body)});
  el("rect",{x:-60,y:-62,width:120,height:9,fill:"#9AA7AE",stroke:INK,"stroke-width":3},body);
  [-1,1].forEach(s=>{ el("rect",{x:s*64-5,y:-78,width:10,height:40,rx:3,fill:"#90A4AE",stroke:INK,"stroke-width":3},body); el("circle",{cx:s*64,cy:-58,r:4,fill:INK},body)});
  const food=el("g",{opacity:0},g);
  el("ellipse",{cx:0,cy:-116,rx:57,ry:12,fill:"#5F6E76",stroke:INK,"stroke-width":3},food);
  el("path",{d:"M-44 -116 Q-4 -168 40 -116 Z",fill:"#7CB342",stroke:"#33691E","stroke-width":3,"stroke-linejoin":"round"},food);       // pesarattu (folded)
  for(let k=0;k<7;k++) el("circle",{cx:-28+hash(k+40)*54,cy:-121-hash(k+50)*16,r:2.6,fill:"#33691E"},food);
  el("path",{d:"M12 -116 Q22 -132 38 -118 Z",fill:"#F6E3A1",stroke:"#C9A75A","stroke-width":2},food);                                    // upma peeking
  const lid=el("g",{},g);
  el("path",{d:"M-62 -116 Q-60 -150 0 -152 Q60 -150 62 -116 Z",fill:"#D3DBDF",stroke:INK,"stroke-width":4,"stroke-linejoin":"round"},lid);
  el("rect",{x:-64,y:-120,width:128,height:8,rx:3,fill:"#AEBAC0",stroke:INK,"stroke-width":3},lid);
  el("rect",{x:-12,y:-162,width:24,height:12,rx:5,fill:"#AEBAC0",stroke:INK,"stroke-width":3},lid);
  el("path",{d:"M-44 -126 Q-38 -142 -18 -146",stroke:"#FFFFFF","stroke-width":6,fill:"none","stroke-linecap":"round",opacity:.85},lid);
  const dent=el("g",{transform:"translate(40,-137) rotate(32)"},lid);   // the dent (same spot in every frame)
  el("ellipse",{rx:11,ry:5.5,fill:"#6E7F88"},dent); el("path",{d:"M-10 3 Q0 8 10 3",stroke:"#FFFFFF","stroke-width":2.5,fill:"none",opacity:.9},dent);
  el("path",{d:"M-9 -2 Q0 -6 9 -2",stroke:INK,"stroke-width":2,fill:"none",opacity:.6},dent);
  const glint=el("path",{d:"M0 -12 L3 -3 L12 0 L3 3 L0 12 L-3 3 L-12 0 L-3 -3 Z",fill:"#FFFFFF",stroke:"#FFF59D","stroke-width":1.5,opacity:0,transform:"translate(54,-150)"},lid);
  return {g,lid,food,dent,glint}}
function makeSwirl(parent){   // tempering steam: curry leaves + mustard seeds riding a steam curl
  const g=el("g",{},parent), parts=[];
  for(let k=0;k<3;k++){const p=el("path",{d:"M0 -30 Q-26 -48 -8 -70 Q8 -52 0 -30 Q26 -12 8 10 Q-8 -8 0 -30",stroke:"#FFFFFF","stroke-width":7,fill:"none","stroke-linecap":"round",opacity:.75},g); parts.push({e:p,kind:"s",k})}
  for(let k=0;k<3;k++){const l=el("g",{},g); el("path",{d:"M-14 0 Q0 -10 14 0 Q0 10 -14 0 Z",fill:"#43A047",stroke:"#1B5E20","stroke-width":2.5},l); el("line",{x1:-12,y1:0,x2:12,y2:0,stroke:"#1B5E20","stroke-width":1.5},l); parts.push({e:l,kind:"l",k})}
  for(let k=0;k<6;k++){const s=el("circle",{r:4.5,fill:"#4E342E",stroke:"#2A1A12","stroke-width":1},g); parts.push({e:s,kind:"m",k})}
  return {g,parts}}
function swirlAt(sw,t,x,y,amp,dir=0,rise=260){   // dir: horizontal drift (px over the rise)
  sw.g.style.opacity=amp; if(amp<=0) return;
  sw.parts.forEach((p,i)=>{const ph=fract(t*0.42+i/sw.parts.length), a=ph*Math.PI*3+i;
    const px=x+Math.sin(a)*(16+46*ph)+dir*ph, py=y-ph*rise, o=Math.sin(ph*Math.PI);
    p.e.setAttribute("transform",`translate(${px.toFixed(1)},${py.toFixed(1)}) rotate(${(a*40).toFixed(0)}) scale(${p.kind==="s"?0.6+0.7*ph:1})`); p.e.style.opacity=(p.kind==="s"?0.7:1)*o})}
function makeTrolley(parent){   // steel tea trolley; origin = back end (right) on the floor; the back wheel at x -40
  const g=el("g",{},parent);
  el("rect",{x:-246,y:-330,width:84,height:100,rx:12,fill:"#B0BEC5",stroke:INK,"stroke-width":4},g);            // tea urn
  el("rect",{x:-222,y:-346,width:36,height:18,rx:5,fill:"#90A4AE",stroke:INK,"stroke-width":3},g);
  el("rect",{x:-238,y:-300,width:10,height:60,rx:4,fill:"#ECEFF1",opacity:.8},g);
  el("rect",{x:-172,y:-262,width:22,height:10,fill:"#78909C",stroke:INK,"stroke-width":2},g);
  for(let k=0;k<3;k++) el("path",{d:`M${-130+k*30} -232 L${-126+k*30} -262 L${-108+k*30} -262 L${-104+k*30} -232 Z`,fill:"#FFFFFF",stroke:INK,"stroke-width":2.5},g);   // paper cups
  el("rect",{x:-270,y:-232,width:262,height:14,rx:4,fill:"#CFD8DC",stroke:INK,"stroke-width":4},g);             // top tray
  el("rect",{x:-270,y:-84,width:262,height:14,rx:4,fill:"#CFD8DC",stroke:INK,"stroke-width":4},g);              // bottom shelf
  [-262,-20].forEach(x=>el("rect",{x,y:-232,width:10,height:206,fill:"#B0BEC5",stroke:INK,"stroke-width":3},g));
  el("path",{d:"M-16 -226 L-2 -300 L14 -300",stroke:"#90A4AE","stroke-width":10,fill:"none","stroke-linecap":"round"},g);   // push handle
  el("path",{d:"M-16 -226 L-2 -300 L14 -300",stroke:INK,"stroke-width":2.5,fill:"none"},g);
  const wheels=[-250,-40].map(x=>{const w=el("g",{transform:`translate(${x},-20)`},g); el("circle",{r:20,fill:"#37474F",stroke:INK,"stroke-width":4},w);
    el("circle",{r:7,fill:"#B0BEC5",stroke:INK,"stroke-width":2},w); el("line",{x1:-14,y1:0,x2:14,y2:0,stroke:"#B0BEC5","stroke-width":3},w); return w});
  return {g,wheels}}
const SON_OPT={skin:"#BE8460",hair:"#16100C",shirt:"#45454D",collar:"#3A3A42",sidePart:true,brow:6,lip:"#7A3A30"};   // her son, ~28: charcoal shirt, side part, clean-shaven
function makePhoto(parent){   // the photo by her counter: her son, charcoal shirt, suitcase, airport window; 'Nov 2024'
  const g=el("g",{},parent), id="ph"+(clipN++);
  el("rect",{x:-80,y:-100,width:160,height:200,rx:3,fill:"#FFFEF6",stroke:"#5D4B38","stroke-width":3},g);
  const cp=el("clipPath",{id},defs); el("rect",{x:-70,y:-90,width:140,height:150},cp);
  const pic=el("g",{"clip-path":`url(#${id})`},g);
  el("rect",{x:-70,y:-90,width:140,height:150,fill:"#CFE8F5"},pic);
  el("rect",{x:-70,y:-90,width:140,height:96,fill:"#A7D3EE"},pic);
  for(let x=-70;x<=70;x+=35) el("rect",{x:x-2,y:-90,width:4,height:96,fill:"#5E6B78"},pic);
  el("path",{d:"M-52 -56 L18 -62 L30 -70 L36 -70 L32 -60 L46 -60 Q54 -58 46 -54 L-46 -48 Z",fill:"#FFFFFF",stroke:"#5E6B78","stroke-width":2},pic);   // plane
  el("rect",{x:-70,y:6,width:140,height:54,fill:"#D7CCC8"},pic);
  const P=makeAdult({...SON_OPT,legs:{pant:"#2F3542",shoe:"#1A1A1A"},parent:pic}); Object.assign(P.st,{x:-10,y:-4,s:0.125,hR:[96,-470],hL:[-80,-80],smile:1,brow:"u"}); P.draw();
  el("rect",{x:20,y:-6,width:30,height:44,rx:4,fill:"#D84315",stroke:INK,"stroke-width":2},pic); el("rect",{x:30,y:-14,width:10,height:9,fill:"none",stroke:INK,"stroke-width":2},pic);   // suitcase
  txt("Nov 2024",{x:0,y:88,"font-family":"InterB","font-style":"italic","font-weight":700,"font-size":22,"text-anchor":"middle",fill:"#37474F"},g);
  [-1,1].forEach(s=>el("rect",{x:s*62-20,y:-112,width:40,height:20,fill:"#FFF59D",opacity:.75,transform:`rotate(${s*20} ${s*62} -102)`},g));
  return g}

// ===== DESK, Tower B, Hitech City (x -400..1600): warm cream wall, window band with generic glass towers, the aisle on
// the left (tea trolley), Nikhil's long desk (x 330..1600, full front panel), his monitor with the DAY 6 tally =====
el("rect",{x:-900,y:-900,width:2800,height:2400,fill:"#F4E6D0"},W);
el("rect",{x:-900,y:FL-10,width:2800,height:1200,fill:"#C9D3DC"},W);                     // floor
el("rect",{x:-900,y:FL-22,width:2800,height:14,fill:"#B98A55"},W);                        // skirting
el("rect",{x:420,y:260,width:1200,height:450,fill:"#BFE3F5",stroke:"#5E6B78","stroke-width":10},W);
[[440,430,140,"#8FB8D8"],[600,350,120,"#A7C8E2"],[740,300,170,"#7FA9CC"],[930,400,130,"#9CC0DD"],[1080,330,150,"#86B0D2"],[1250,440,130,"#A2C4DF"],[1400,360,150,"#8FB8D8"]].forEach(([x,y,w,c],k)=>{
  el("rect",{x,y,width:w,height:700-y,fill:c,stroke:"#5E7C96","stroke-width":3},W);
  for(let r=y+22;r<690;r+=32) for(let q=x+12;q<x+w-12;q+=24) el("rect",{x:q,y:r,width:12,height:16,fill:hash(q*r+k)>0.72?"#FFF4C9":"#E6F1F8",opacity:.9},W)});
for(let x=420;x<=1620;x+=240) el("rect",{x:x-5,y:260,width:10,height:450,fill:"#5E6B78"},W);
el("rect",{x:-300,y:300,width:520,height:360,rx:8,fill:"#E9DCC6",stroke:"#D3BF9E","stroke-width":5},W);   // a pin-board (no text)
[[-250,340,110,80,"#FFF59D"],[-110,360,90,70,"#B3E5FC"],[20,330,120,90,"#F8BBD0"],[-200,470,140,90,"#C8E6C9"]].forEach(([x,y,w,h,c])=>el("rect",{x,y,width:w,height:h,fill:c,stroke:"#B0A08A","stroke-width":2},W));
const trolley=makeTrolley(W);
const deskBack=el("g",{},W);   // chairs + people behind the desk
const chair1=el("g",{},deskBack), chair2=el("g",{},deskBack);
[chair1,chair2].forEach(c=>{el("rect",{x:-86,y:-250,width:172,height:250,rx:30,fill:"#3E4A59",stroke:INK,"stroke-width":5},c); el("rect",{x:-70,y:-234,width:140,height:80,rx:22,fill:"#4E5B6C"},c)});
const deskPeople=el("g",{},deskBack);
const deskG=el("g",{},W);
el("rect",{x:330,y:DT,width:1400,height:26,rx:6,fill:"#EBD3AE",stroke:INK,"stroke-width":5},deskG);
el("rect",{x:345,y:DT+26,width:1370,height:FL+110-DT-26,fill:"#C98B4E",stroke:INK,"stroke-width":5},deskG);
for(let k=0;k<6;k++) el("rect",{x:345+k*240,y:DT+26,width:8,height:FL+110-DT-26,fill:"#B57A40"},deskG);
// monitor (front view, generic code lines) + the DAY 6 sticky tally
const mon=el("g",{transform:"translate(1080,0)"},deskG);
el("rect",{x:-20,y:DT-70,width:40,height:70,fill:"#455A64",stroke:INK,"stroke-width":4},mon); el("rect",{x:-70,y:DT-12,width:140,height:14,rx:5,fill:"#455A64",stroke:INK,"stroke-width":4},mon);
el("rect",{x:-150,y:DT-270,width:300,height:200,rx:10,fill:"#263238",stroke:INK,"stroke-width":6},mon);
el("rect",{x:-136,y:DT-256,width:272,height:172,rx:4,fill:"#1E2A38"},mon);
[[40,"#80CBC4"],[60,"#FFCC80"],[90,"#B39DDB"],[52,"#80CBC4"],[110,"#90CAF9"],[70,"#FFCC80"]].forEach(([w,c],k)=>el("rect",{x:-120+(k%3?18:0),y:DT-244+k*24,width:w+60,height:9,rx:4,fill:c,opacity:.85},mon));
const sticky=el("g",{transform:`translate(-128,${DT-120}) rotate(-5)`},mon);
el("rect",{x:0,y:0,width:112,height:92,fill:"#FFF176",stroke:"#C9A800","stroke-width":2},sticky);
txt("DAY 6",{x:56,y:34,"font-family":"Anton","font-size":30,"text-anchor":"middle",fill:INK},sticky);
[0,1,2,3].forEach(k=>el("line",{x1:18+k*14,y1:48,x2:18+k*14,y2:80,stroke:INK,"stroke-width":4,"stroke-linecap":"round"},sticky));
el("line",{x1:10,y1:76,x2:70,y2:52,stroke:INK,"stroke-width":4,"stroke-linecap":"round"},sticky); el("line",{x1:88,y1:48,x2:88,y2:80,stroke:INK,"stroke-width":4,"stroke-linecap":"round"},sticky);
// a small plant + a pen cup on the desk
el("rect",{x:1330,y:DT-70,width:70,height:70,rx:8,fill:"#E07A3F",stroke:INK,"stroke-width":4},deskG);
[[1345,DT-110],[1365,DT-130],[1388,DT-108]].forEach(([x,y])=>el("ellipse",{cx:x,cy:y,rx:18,ry:42,fill:"#43A047",stroke:INK,"stroke-width":3,transform:`rotate(${(x-1365)*1.3} ${x} ${y+36})`},deskG));
el("rect",{x:860,y:DT-56,width:44,height:56,rx:6,fill:"#5C6BC0",stroke:INK,"stroke-width":4},deskG);
[[870,"#E53935"],[882,"#1E88E5"],[894,"#43A047"]].forEach(([x,c])=>el("rect",{x,y:DT-86,width:6,height:36,rx:2,fill:c},deskG));
const deskProps=el("g",{},W);
const TF=makeTiffin(deskProps);          // THE tiffin
const lidOff=el("g",{},deskProps);       // (the lid when it rests on the desk is TF.lid moved)
const SWT=makeSwirl(W);                  // steam off the tiffin
const deskFront=el("g",{},W);            // people in front of the desk

// ===== CAFETERIA, ground floor (CX..): yellow wall, teal tiles, menu board, the photo, the steel counter =====
const C0=el("g",{},W);
el("rect",{x:CX-700,y:-900,width:2600,height:2400,fill:"#FFE7A3"},C0);
el("rect",{x:CX-700,y:980,width:2600,height:500,fill:"#4DB6AC"},C0);
for(let y=1000;y<1480;y+=40) el("line",{x1:CX-700,y1:y,x2:CX+1900,y2:y,stroke:"#26A69A","stroke-width":3},C0);
for(let x=CX-700;x<CX+1900;x+=40) el("line",{x1:x,y1:980,x2:x,y2:1480,stroke:"#26A69A","stroke-width":3},C0);
el("rect",{x:CX-700,y:FL-10,width:2600,height:1200,fill:"#D7CCC8"},C0);
el("rect",{x:CX+680,y:300,width:420,height:330,rx:12,fill:"#2E5E3E",stroke:"#6D4C41","stroke-width":14},C0);   // menu board (text = HTML #menu)
el("rect",{x:CX-60,y:300,width:560,height:420,fill:"#FFF3D6",stroke:"#C9A35C","stroke-width":8},C0);           // kitchen pass window
for(let k=0;k<4;k++) el("rect",{x:CX-30+k*130,y:330,width:100,height:16,rx:4,fill:"#B0BEC5",stroke:INK,"stroke-width":2},C0);
[[CX+20,430,60],[CX+140,410,80],[CX+290,440,56],[CX+400,420,70]].forEach(([x,y,w])=>{el("rect",{x,y,width:w,height:470-y+40,rx:8,fill:"#CFD8DC",stroke:INK,"stroke-width":3},C0)});
const photoW=makePhoto(C0); photoW.setAttribute("transform",`translate(${CX+150},850) rotate(-4)`);   // taped by her counter
const cafBack=el("g",{},W);
const counterG=el("g",{},W);
el("rect",{x:CX-400,y:CT,width:2200,height:30,fill:"#ECEFF1",stroke:INK,"stroke-width":5},counterG);
el("rect",{x:CX-390,y:CT+30,width:2180,height:FL+120-CT-30,fill:"#B0BEC5",stroke:INK,"stroke-width":5},counterG);
for(let k=0;k<9;k++) el("rect",{x:CX-390+k*250,y:CT+30,width:6,height:FL+120-CT-30,fill:"#90A4AE"},counterG);
// stove + the tempering pan (mustard seeds + curry leaves), big steel pots, a plate stack
el("rect",{x:CX+700,y:CT-26,width:150,height:26,rx:4,fill:"#37474F",stroke:INK,"stroke-width":4},counterG);
el("path",{d:`M${CX+705} ${CT-40} Q${CX+775} ${CT-2} ${CX+845} ${CT-40} Z`,fill:"#455A64",stroke:INK,"stroke-width":4},counterG);
el("rect",{x:CX+845,y:CT-48,width:70,height:10,rx:4,fill:"#5D4037",stroke:INK,"stroke-width":3},counterG);
for(let k=0;k<9;k++) el("circle",{cx:CX+730+hash(k+60)*90,cy:CT-38+hash(k+70)*6,r:4,fill:"#4E342E"},counterG);
[[CX+740,-1],[CX+800,1]].forEach(([x,s])=>el("path",{d:`M${x-12} ${CT-38} Q${x} ${CT-48} ${x+12} ${CT-38} Q${x} ${CT-28} ${x-12} ${CT-38} Z`,fill:"#43A047",stroke:"#1B5E20","stroke-width":2},counterG));
[[CX+1000,110,140],[CX+1160,120,120],[CX+1320,100,150]].forEach(([x,w,h])=>{el("rect",{x:x-w/2,y:CT-h,width:w,height:h,rx:10,fill:"#CFD8DC",stroke:INK,"stroke-width":4},counterG);
  el("rect",{x:x-w/2-6,y:CT-h-10,width:w+12,height:14,rx:5,fill:"#B0BEC5",stroke:INK,"stroke-width":3},counterG); el("rect",{x:x-w/2+10,y:CT-h+14,width:10,height:h-28,rx:4,fill:"#FFFFFF",opacity:.7},counterG)});
for(let k=0;k<5;k++) el("ellipse",{cx:CX+300,cy:CT-6-k*8,rx:54,ry:10,fill:"#E0E6EA",stroke:INK,"stroke-width":2.5},counterG);
const SWP=makeSwirl(W);                   // steam off her pan (same motif)
const cafFront=el("g",{},W);

// ---------- adult characters (front view; local y=0 at the hip) ----------
function ik(sx,sy,tx,ty,a,b,side){let dx=tx-sx,dy=ty-sy,d=Math.hypot(dx,dy)||1; const dd=Math.min(d,a+b-1); dx/=d; dy/=d;
  const base=Math.atan2(dy,dx), cA=clamp((a*a+dd*dd-b*b)/(2*a*dd),-1,1), al=Math.acos(cA);
  const c1=[sx+Math.cos(base+al)*a,sy+Math.sin(base+al)*a], c2=[sx+Math.cos(base-al)*a,sy+Math.sin(base-al)*a];
  const sc=p=>p[1]+side*p[0]*0.6; const e=sc(c1)>sc(c2)?c1:c2; return [e,[sx+dx*dd,sy+dy*dd]]}
function makeAdult(o){
  const g=el("g",{},o.parent||W), body=el("g",{},g);
  const legs=[];
  if(o.legs&&!o.saree) [-1,1].forEach(s=>{const lg_=el("g",{},body); el("path",{d:`M${s*50-30} -14 L${s*50+30} -14 L${s*56+26} 420 L${s*56-26} 420 Z`,fill:o.legs.pant,stroke:INK,"stroke-width":5},lg_);
    el("path",{d:`M${s*56-34} 418 Q${s*56-36} 446 ${s*56+s*14} 448 Q${s*56+46*s} 446 ${s*56+44*s} 424 Z`,fill:o.legs.shoe,stroke:INK,"stroke-width":4},lg_); legs.push(lg_)});
  const hairBack=el("g",{},body);
  if(o.longHair) el("path",{d:"M-72 -40 Q-80 -100 0 -102 Q80 -100 72 -40 L80 72 Q74 98 46 94 L-46 94 Q-74 98 -80 72 Z",fill:o.hair},hairBack);
  if(o.bun&&o.lowBun) el("ellipse",{cx:50,cy:30,rx:30,ry:26,fill:o.hair,stroke:INK,"stroke-width":3},hairBack);
  else if(o.bun) el("circle",{cx:0,cy:-84,r:36,fill:o.hair,stroke:INK,"stroke-width":3},hairBack);
  if(o.saree){
    const Y2=o.floor?436:230, X2=o.floor?110:96;
    if(o.floor) [-1,1].forEach(s=>el("ellipse",{cx:s*40,cy:442,rx:30,ry:10,fill:o.floor,stroke:INK,"stroke-width":3},body));
    el("path",{d:`M-70 -60 L70 -60 L${X2} ${Y2} L${-X2} ${Y2} Z`,fill:o.saree.base,stroke:INK,"stroke-width":5},body);
    if(o.saree.check){ const xa=y=>70+(X2-70)*(y+60)/(Y2+60);
      for(let y=-40;y<Y2-6;y+=26) el("line",{x1:-xa(y)+3,y1:y,x2:xa(y)-3,y2:y,stroke:o.saree.check,"stroke-width":4,opacity:.7},body);
      for(let k=-4;k<=4;k++) el("line",{x1:k*15,y1:-58,x2:k*15*X2/70,y2:Y2-4,stroke:o.saree.check,"stroke-width":4,opacity:.7},body)}
    for(let k=-2;k<=2;k++) el("line",{x1:k*22,y1:-40,x2:k*30,y2:Y2-4,stroke:INK,"stroke-width":2,opacity:.25},body);
    el("path",{d:"M-88 -268 Q-92 -288 -64 -292 L-24 -300 L24 -300 L64 -292 Q92 -288 88 -268 L76 -50 L-76 -50 Z",fill:o.shirt,stroke:INK,"stroke-width":5},body);
    el("path",{d:"M-28 -300 Q0 -262 28 -300",fill:o.skin,stroke:INK,"stroke-width":3},body);
    el("path",{d:"M-76 -120 Q0 -100 76 -120 L76 -50 L-76 -50 Z",fill:o.skin,stroke:INK,"stroke-width":3},body);
    el("path",{d:"M-92 -262 L-40 -300 L96 -100 L90 -10 L60 -10 Z",fill:o.saree.pallu,stroke:INK,"stroke-width":5,"stroke-linejoin":"round"},body);
    if(o.saree.check) [[-60,-262,80,-90],[-30,-282,92,-60],[-74,-230,40,-30]].forEach(([a,b_,c,d])=>el("line",{x1:a,y1:b_,x2:c,y2:d,stroke:o.saree.check,"stroke-width":4,opacity:.65},body));
    el("path",{d:"M-84 -258 L-38 -290 L92 -98",stroke:o.saree.border,"stroke-width":o.saree.bw||9,fill:"none"},body);
    el("path",{d:`M${-X2} ${Y2-4} L${X2} ${Y2-4}`,stroke:o.saree.border,"stroke-width":12},body);
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
  }
  if(o.apron){   // cafeteria apron (bib + pocket)
    el("path",{d:"M-50 -246 L50 -246 L60 -70 L80 210 L-80 210 L-60 -70 Z",fill:o.apron,stroke:INK,"stroke-width":4,"stroke-linejoin":"round"},body);
    el("path",{d:"M-48 -246 L-30 -300 M48 -246 L30 -300",stroke:o.apron,"stroke-width":8,fill:"none"},body);
    el("path",{d:"M-62 -72 L62 -72",stroke:"#B8860B","stroke-width":5},body);
    el("path",{d:"M-92 -72 L-62 -72 M62 -72 L96 -64 L104 -40",stroke:o.apron,"stroke-width":7,fill:"none","stroke-linecap":"round"},body);
    o._pocket=el("g",{transform:"translate(26,-10)"},body);
    el("rect",{x:-28,y:-34,width:56,height:58,rx:6,fill:"#D9982A",stroke:INK,"stroke-width":3},o._pocket);
    o._phone=el("rect",{x:-14,y:-52,width:28,height:26,rx:4,fill:"#1A1A1A",stroke:INK,"stroke-width":2},o._pocket); o._pocket.appendChild(o._pocket.firstChild)}
  el("rect",{x:-19,y:-334,width:38,height:44,fill:o.skin},body);
  let specG=null;
  if(o.specChain){ specG=el("g",{},body); el("path",{d:"M-26 -300 Q-30 -230 0 -206 Q30 -230 26 -300",stroke:"#D4A537","stroke-width":3,fill:"none"},specG);
    [-15,15].forEach(x=>el("ellipse",{cx:x,cy:-200,rx:13,ry:9,fill:"rgba(220,240,255,.5)",stroke:"#6D4C41","stroke-width":3},specG)); el("path",{d:"M-3 -201 Q0 -205 3 -201",stroke:"#6D4C41","stroke-width":3,fill:"none"},specG)}
  if(o.badge){ const ly=el("g",{},body); el("path",{d:"M-24 -300 Q-22 -230 -12 -172",stroke:"#2D6CDF","stroke-width":8,fill:"none"},ly); el("path",{d:"M24 -300 Q22 -230 12 -172",stroke:"#2D6CDF","stroke-width":8,fill:"none"},ly);
    const bd=el("g",{transform:"translate(0,-122)"},ly);
    el("rect",{x:-40,y:-52,width:80,height:104,rx:8,fill:"#fff",stroke:INK,"stroke-width":3.5},bd);
    el("rect",{x:-40,y:-52,width:80,height:24,rx:6,fill:"#2D6CDF"},bd);
    el("rect",{x:-14,y:-22,width:28,height:30,rx:3,fill:"#C9D6E3"},bd); el("circle",{cx:0,cy:-11,r:7,fill:"#8A5A3B"},bd);
    txt(o.badge[0],{x:0,y:26,"font-family":"Anton","font-size":17,"text-anchor":"middle",fill:INK},bd);
    txt(o.badge[1],{x:0,y:44,"font-family":"Anton","font-size":12.5,"text-anchor":"middle",fill:"#2D6CDF","letter-spacing":1},bd);
    o._lany=ly; o._bd=bd}
  const arm=s=>({up:el("line",{stroke:o.sleeve||o.shirt,"stroke-width":32,"stroke-linecap":"round"},body),
                 lo:el("line",{stroke:o.fore||o.sleeve||o.shirt,"stroke-width":28,"stroke-linecap":"round"},body),
                 cuff:o.cuff?el("circle",{r:15,fill:o.cuff},body):null,
                 bang:o.bangles?el("circle",{r:16,fill:"none",stroke:o.bangles,"stroke-width":6},body):null,
                 hand:el("circle",{r:17,fill:o.skin,stroke:INK,"stroke-width":3},body)});
  const AL=arm(-1), AR=arm(1);
  const itemG=el("g",{},body), items={}, itemGL=el("g",{},body), itemsL={};
  const phoneShape=(p,scr)=>{el("rect",{x:-19,y:-38,width:38,height:68,rx:8,fill:"#1A1A1A",stroke:INK,"stroke-width":3},p); return el("rect",{x:-14,y:-32,width:28,height:54,rx:4,fill:scr},p)};
  itemsL.phone=el("g",{},itemGL); phoneShape(itemsL.phone,"#80CBC4");
  items.plate=el("g",{},itemG); el("ellipse",{cx:0,cy:-6,rx:44,ry:11,fill:"#E0E6EA",stroke:INK,"stroke-width":3},items.plate);
  el("path",{d:"M-30 -10 Q-4 -40 22 -10 Z",fill:"#7CB342",stroke:"#33691E","stroke-width":2.5},items.plate); el("ellipse",{cx:26,cy:-12,rx:12,ry:6,fill:"#F6E3A1",stroke:"#C9A75A","stroke-width":2},items.plate);
  items.ladle=el("g",{},itemG); el("line",{x1:0,y1:0,x2:46,y2:58,stroke:"#90A4AE","stroke-width":7,"stroke-linecap":"round"},items.ladle); el("line",{x1:0,y1:0,x2:46,y2:58,stroke:INK,"stroke-width":2},items.ladle);
  el("path",{d:"M34 58 Q46 82 66 62 Z",fill:"#B0BEC5",stroke:INK,"stroke-width":3},items.ladle);
  itemsL.laptop=el("g",{},itemGL); el("rect",{x:-70,y:-20,width:140,height:96,rx:8,fill:"#90A4AE",stroke:INK,"stroke-width":4,transform:"rotate(-12)"},itemsL.laptop);
  el("rect",{x:-60,y:-12,width:120,height:8,rx:3,fill:"#B0BEC5",transform:"rotate(-12)"},itemsL.laptop);
  // head
  const head=el("g",{},body);
  el("ellipse",{cx:-55,cy:2,rx:10,ry:17,fill:o.skin,stroke:INK,"stroke-width":3},head); el("ellipse",{cx:55,cy:2,rx:10,ry:17,fill:o.skin,stroke:INK,"stroke-width":3},head);
  el("path",{d:o.roundFace?"M-57 -20 Q-59 -74 0 -76 Q59 -74 57 -20 Q59 34 36 58 Q0 80 -36 58 Q-59 34 -57 -20 Z":"M-54 -22 Q-56 -72 0 -74 Q56 -72 54 -22 Q54 30 30 56 Q0 74 -30 56 Q-54 30 -54 -22 Z",fill:o.skin,stroke:INK,"stroke-width":4},head);
  if(o.earrings) [-55,55].forEach(x=>el("circle",{cx:x,cy:24,r:o.earCol?5:6.5,fill:o.earCol||"#F5B347",stroke:INK,"stroke-width":2},head));
  const face=el("g",{},head);
  if(o.stubble){el("path",{d:"M-52 8 Q-50 42 -28 58 Q0 76 28 58 Q50 42 52 8 Q42 30 22 33 Q0 29 -22 33 Q-42 30 -52 8 Z",fill:o.stubble,opacity:.34},face);
    el("path",{d:"M-20 31 Q0 24 20 31 Q0 35 -20 31 Z",fill:o.stubble,opacity:.4},face);
    for(let k=0;k<26;k++){const a=hash(k+3)*Math.PI, r=40+hash(k+7)*12; el("circle",{cx:Math.cos(a)*r*1.05,cy:22+Math.sin(a)*r*0.82,r:1.6,fill:o.stubble,opacity:.5},face)}}
  el("circle",{cx:-34,cy:20,r:11,fill:"#E57373",opacity:o.blush||0.18},face); el("circle",{cx:34,cy:20,r:11,fill:"#E57373",opacity:o.blush||0.18},face);
  if(o.lines) [-21,21].forEach(x=>{el("path",{d:`M${x-13} 7 Q${x} 13 ${x+13} 7`,stroke:"#7A4A2A","stroke-width":2,fill:"none",opacity:.5},face); el("path",{d:`M${x*1.9} -14 l${x>0?6:-6} 4 M${x*1.9} -8 l${x>0?7:-7} 2`,stroke:"#7A4A2A","stroke-width":2,opacity:.5},face)});
  const eyes=[-21,21].map(x=>{const e=el("g",{transform:`translate(${x},-8)`},face);
    const w=el("ellipse",{rx:12,ry:8,fill:"#fff",stroke:INK,"stroke-width":2},e);
    const ir=el("circle",{r:6.5,fill:"#3B2414"},e); const pu=el("circle",{r:3,fill:"#000"},e); const hl=el("circle",{r:2,fill:"#fff"},e);
    const lid=el("path",{d:"M-13 -3 Q0 -11 13 -3",stroke:INK,"stroke-width":o.lash||3.5,fill:"none","stroke-linecap":"round"},e);
    const cover=el("ellipse",{rx:13,ry:9,fill:o.skin,opacity:0},e); const shut=el("path",{d:"M-12 1 Q0 6 12 1",stroke:INK,"stroke-width":3.5,fill:"none","stroke-linecap":"round",opacity:0},e);
    return {e,w,ir,pu,hl,lid,cover,shut}});
  const brows=[-1,1].map(s=>el("path",{stroke:o.browCol||"#1C1410","stroke-width":o.brow||6,fill:"none","stroke-linecap":"round"},face));
  el("path",{d:"M3 0 Q-5 20 -2 26 Q4 29 10 25",stroke:"#7A4A2A","stroke-width":3,fill:"none","stroke-linecap":"round"},face);
  if(o.bindi) el("circle",{cx:0,cy:-36,r:5,fill:"#C62828"},face);
  const mouthO=el("ellipse",{cx:0,cy:44,rx:12,ry:3,fill:"#5A1E1E"},face);
  const lips=el("path",{d:"M-14 43 Q0 47 14 43",stroke:o.lip||"#8A3A3A","stroke-width":4,fill:"none","stroke-linecap":"round"},face);
  const smile=el("path",{d:"M-18 39 Q0 56 18 39",stroke:o.lip||"#8A3A3A","stroke-width":4.5,fill:"none","stroke-linecap":"round",opacity:0},face);
  const laugh=el("path",{d:"M-20 38 Q0 64 20 38 Z",fill:"#5A1E1E",stroke:o.lip||"#8A3A3A","stroke-width":4,opacity:0},face);
  const sad=el("path",{d:"M-14 48 Q0 39 14 48",stroke:o.lip||"#8A3A3A","stroke-width":4.5,fill:"none","stroke-linecap":"round",opacity:0},face);
  const smirk=el("path",{d:"M-14 44 Q4 49 19 37",stroke:o.lip||"#8A3A3A","stroke-width":4.5,fill:"none","stroke-linecap":"round",opacity:0},face);
  const gasp=el("ellipse",{cx:0,cy:46,rx:10,ry:13,fill:"#5A1E1E",stroke:o.lip||"#8A3A3A","stroke-width":3.5,opacity:0},face);
  const tear=el("path",{d:"M0 0 Q-5 9 0 13 Q5 9 0 0 Z",fill:"#B3E5FC",stroke:"#4FC3F7","stroke-width":1.5,opacity:0},face);
  if(o.glasses) [-21,21].forEach(x=>el("rect",{x:x-17,y:-14,width:34,height:22,rx:9,fill:"rgba(220,240,255,.25)",stroke:o.glasses,"stroke-width":3.5},face));
  if(o.bun) el("path",{d:"M-58 -6 Q-64 -88 0 -90 Q64 -88 58 -6 Q52 -50 30 -58 Q10 -64 2 -84 Q-8 -64 -30 -58 Q-52 -50 -58 -6 Z",fill:o.hair,stroke:INK,"stroke-width":3},head);
  else if(o.longHair){el("path",{d:"M-60 -6 Q-68 -88 4 -88 Q64 -86 62 -14 Q50 -62 12 -64 Q-12 -46 -40 -44 Q-56 -30 -60 -6 Z",fill:o.hair,stroke:INK,"stroke-width":3},head);
    el("path",{d:"M-62 -20 Q-74 30 -64 80",stroke:o.hair,"stroke-width":18,fill:"none","stroke-linecap":"round"},head); el("path",{d:"M62 -20 Q74 30 64 80",stroke:o.hair,"stroke-width":18,fill:"none","stroke-linecap":"round"},head)}
  else if(o.sidePart){ el("path",{d:"M-58 -8 Q-68 -88 -6 -94 Q60 -98 63 -30 L59 -8 Q57 -46 44 -58 Q14 -72 -20 -64 Q-30 -62 -36 -72 Q-50 -52 -54 -8 Z",fill:o.hair,stroke:INK,"stroke-width":3},head);
    el("path",{d:"M-18 -86 Q20 -92 46 -70",stroke:"#5C4C44","stroke-width":5,fill:"none","stroke-linecap":"round",opacity:.85},head)}
  else el("path",{d:"M-58 -10 Q-66 -84 -6 -90 Q56 -94 62 -28 L58 -8 Q54 -48 30 -56 Q2 -62 -26 -54 Q-50 -46 -54 -8 Z",fill:o.hair,stroke:INK,"stroke-width":3},head);
  if(o.streaks) [["M-44 -40 Q-40 -70 -14 -80",0],["M30 -76 Q48 -66 52 -36",0],["M-52 -16 Q-56 -40 -46 -58",0]].forEach(([d])=>el("path",{d,stroke:o.streaks,"stroke-width":5,fill:"none","stroke-linecap":"round",opacity:.9},head));
  [AL.hand,AR.hand,itemG,itemGL].forEach(x=>body.appendChild(x));
  const st={x:0,y:0,s:1,flip:1,rot:0,hop:0,vis:1,talk:0,blink:0,shut:0,look:0,lookY:0,brow:"n",smile:0,laugh:0,sad:0,smirk:0,gasp:0,headRot:0,headY:0,
            hL:[-60,-130],hR:[60,-130],item:"",itemL:"",itemRot:0,itemRotL:0,wink:0,walk:0,lany:1,specSwing:0,tear:0,phoneGlow:0};
  const SH=[[-82,-270],[82,-270]];
  function draw(){
    const k=st; g.setAttribute("transform",`translate(${k.x},${k.y-k.hop}) rotate(${k.rot}) scale(${k.s*k.flip},${k.s})`); g.style.opacity=k.vis; g.style.display=k.vis>0?"":"none";
    if(!k.vis) return;
    const ht=`translate(${k.look*3},${-392+k.headY}) rotate(${k.headRot})`; head.setAttribute("transform",ht); hairBack.setAttribute("transform",ht);
    face.setAttribute("transform",`translate(${k.look*7},${k.lookY*3})`);
    legs.forEach((L,i)=>L.setAttribute("transform",`rotate(${(i?1:-1)*k.walk*14} 0 -10)`));
    if(specG) specG.setAttribute("transform",`rotate(${k.specSwing} 0 -300)`);
    if(o._phone) o._phone.setAttribute("fill",k.phoneGlow?"#80CBC4":"#1A1A1A");
    if(o._lany) o._lany.style.opacity=k.lany; if(o._bd) o._bd.setAttribute("transform",`translate(0,-122) scale(${k.flip},1)`);
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
    tear.style.opacity=k.tear?1:0; tear.setAttribute("transform",`translate(${21+k.look*4.5},${4+k.tear*22})`);
    eyes.forEach((E,i)=>{const closed=k.blink||k.shut||(k.wink&&i===1); E.cover.style.opacity=closed?1:0; E.shut.style.opacity=closed?1:0; E.lid.style.opacity=closed?0:1;
      E.w.setAttribute("ry",closed?1:8+(k.brow==="u"?2:0)+(k.gasp?2:0)); [E.ir,E.pu].forEach(p=>{p.setAttribute("cx",k.look*4.5);p.setAttribute("cy",k.lookY*3)}); E.hl.setAttribute("cx",k.look*4.5-2.5);E.hl.setAttribute("cy",k.lookY*3-2.5);
      [E.ir,E.pu,E.hl].forEach(p=>p.style.opacity=closed?0:1);
      E.lid.setAttribute("d",k.sad?"M-13 -1 Q0 -9 13 -4":"M-13 -3 Q0 -11 13 -3")});
    brows.forEach((b,i)=>{const s=i?1:-1; const B={n:[-27,-29],u:[-34,-36],s:[-24,-30],a:[-30,-22],q:i?[-37,-35]:[-26,-27],w:[-27,-33]}[k.brow]||[-27,-29];
      b.setAttribute("d",`M${s*8} ${B[0]} Q${s*20} ${(B[0]+B[1])/2-4} ${s*33} ${B[1]}`)});
  }
  function aim(side,wx,wy){const lx=(wx-st.x)/(st.s*st.flip), ly=(wy-(st.y-st.hop))/st.s; if(side==="L") st.hL=[lx,ly]; else st.hR=[lx,ly]}
  function hand(side){const h=(side==="L"?st.hL:st.hR); return [st.x+h[0]*st.s*st.flip, st.y-st.hop+h[1]*st.s]}
  return {st,draw,g,aim,hand};
}

// recurring cast (tools/anim2d/cast.md) + this reel's new character
const NIKHIL_OPT={skin:"#C98B5E",hair:"#1C1410",shirt:"#45454D",collar:"#3A3A42",stubble:"#5A3A28",brow:6.5,lip:"#7A3A30"};
const ANANYA_OPT={skin:"#D9A47A",hair:"#2A1A14",shirt:"#1E8C8C",trim:"#F5B347",kurta:true,longHair:true,fore:"#D9A47A",sleeve:"#1E8C8C",cuff:"#F5B347",earrings:true,brow:4.5,lash:4,blush:0.3,lip:"#A0404A"};
const SAROJA_OPT={skin:"#C68C62",hair:"#2A1E1A",shirt:"#1F6E5A",saree:{base:"#B0204A",pallu:"#C2185B",border:"#F2B53A"},sleeve:"#1F6E5A",fore:"#C68C62",bun:true,bindi:true,earrings:true,specChain:true,lines:true,brow:4.5,lash:4,blush:0.3,lip:"#9A3040"};   // Nikhil's Amma (15/16 Nov)
const LAKSHMI_OPT={skin:"#C08660",hair:"#2B2220",streaks:"#B8B8B8",shirt:"#283A8C",saree:{base:"#2F3F9A",pallu:"#34459F",border:"#E0A526",bw:7,check:"#F4F4F4"},sleeve:"#283A8C",fore:"#C08660",
                   bun:true,lowBun:true,bindi:true,specChain:true,roundFace:true,lines:true,apron:"#E5A82E",bangles:"#B0BEC5",earrings:true,earCol:"#E0A526",brow:4.5,browCol:"#4A3C34",lash:3.5,blush:0.3,lip:"#9A4A44"};   // Lakshmi aunty, ~55 (NEW)
const NIK_BADGE={...NIKHIL_OPT,badge:["NIKHIL R","TOWER B"]};
const ANA_BADGE={...ANANYA_OPT,badge:["ANANYA","TOWER B"]};
const LEGS_N={pant:"#2B3240",shoe:"#1A1A1A"}, LEGS_A={pant:"#F3E5AB",shoe:"#8D6E63"};

// desk: Nikhil seated (day 6 + the shared lunch), Lakshmi behind the desk (day 7), Ananya + Nikhil standing in front
const NK=makeAdult({...NIK_BADGE,parent:deskPeople});
const LKD=makeAdult({...LAKSHMI_OPT,parent:deskPeople});
const AN=makeAdult({...ANA_BADGE,legs:LEGS_A,parent:deskFront});
const NKE=makeAdult({...NIK_BADGE,legs:LEGS_N,parent:deskFront});
// cafeteria
const LK=makeAdult({...LAKSHMI_OPT,parent:cafBack});
const NKW=makeAdult({...NIK_BADGE,legs:LEGS_N,parent:cafFront});
const ANC=makeAdult({...ANA_BADGE,legs:LEGS_A,parent:cafFront});

// ---------- L4 thought bubble (Amma in Rajahmundry | his empty flat) ----------
{const T=$("thk"); el("rect",{x:0,y:0,width:592,height:330,fill:"#FFF8E1"},T); el("rect",{x:296,y:0,width:296,height:330,fill:"#ECEFF1"},T);
 el("rect",{x:0,y:262,width:296,height:68,fill:"#A5D6A7"},T); el("rect",{x:296,y:262,width:296,height:68,fill:"#CFD8DC"},T);
 el("path",{d:"M40 170 L130 100 L220 170 Z",fill:"#C0603A",stroke:INK,"stroke-width":4},T); el("rect",{x:56,y:170,width:150,height:96,fill:"#FFE0B2",stroke:INK,"stroke-width":4},T);
 el("rect",{x:110,y:206,width:40,height:60,fill:"#8D6E63",stroke:INK,"stroke-width":3},T); el("rect",{x:166,y:190,width:28,height:28,fill:"#90CAF9",stroke:INK,"stroke-width":3},T);
 el("circle",{cx:250,cy:70,r:24,fill:"#FFD54F"},T);
 var THA=makeAdult({...SAROJA_OPT,parent:T}); Object.assign(THA.st,{x:240,y:300,s:0.27,smile:1,brow:"u",hR:[110,-440],hL:[-60,-90]});
 el("line",{x1:296,y1:0,x2:296,y2:330,stroke:INK,"stroke-width":5},T);
 el("line",{x1:470,y1:0,x2:470,y2:88,stroke:INK,"stroke-width":3},T); el("circle",{cx:470,cy:100,r:16,fill:"#FFF59D",stroke:INK,"stroke-width":3},T);
 el("rect",{x:330,y:236,width:150,height:30,rx:6,fill:"#B0BEC5",stroke:INK,"stroke-width":3},T);   // a thin mattress on the floor
 el("rect",{x:536,y:150,width:8,height:8,fill:INK},T); el("path",{d:"M540 158 L540 180 M534 186 a8 8 0 1 0 12 0",stroke:"#F9A825","stroke-width":4,fill:"none"},T);   // one key on a hook
 THA.draw(); window.THA=THA}

// ---------- recap strip panels (no labels): the dent, the photo, the swirl ----------
const RC0=$("rc0"), RC1=$("rc1"), RC2=$("rc2");
el("rect",{x:0,y:0,width:296,height:296,fill:"#F4E6D0"},RC0); el("rect",{x:0,y:236,width:296,height:60,fill:"#EBD3AE"},RC0);
const rcT=makeTiffin(RC0); rcT.g.setAttribute("transform","translate(120,560) scale(2.8)");
el("rect",{x:0,y:0,width:296,height:296,fill:"#FFE7A3"},RC1); const rcP=makePhoto(RC1); rcP.setAttribute("transform","translate(148,150) scale(1.3) rotate(-4)");
el("rect",{x:0,y:0,width:296,height:296,fill:"#FFE7A3"},RC2); el("rect",{x:0,y:250,width:296,height:46,fill:"#ECEFF1"},RC2);
el("path",{d:"M78 236 Q148 290 218 236 Z",fill:"#455A64",stroke:INK,"stroke-width":4},RC2);
const rcS=makeSwirl(RC2);
// spinning tiffin (L7 + countdown)
const spinG=el("g",{},$("spin")); const spT=makeTiffin(spinG); spT.g.setAttribute("transform","translate(0,190) scale(2.3)");

// ---------- the memory inset (sepia torn paper): childhood drop + the airport goodbye ----------
const fbs=$("fbs"), FB=el("g",{filter:"url(#skin-paper)"},fbs);
const FA=el("g",{},FB), FBB=el("g",{},FB);
// A: home doorway, a school morning
el("rect",{x:0,y:0,width:960,height:760,fill:"#D9C7A6"},FA); el("rect",{x:0,y:600,width:960,height:160,fill:"#B59C77"},FA);
el("rect",{x:620,y:150,width:240,height:450,fill:"#8D6E55",stroke:"#3B2A1A","stroke-width":8},FA); el("rect",{x:650,y:180,width:180,height:390,fill:"#E9DCC2"},FA);
el("rect",{x:90,y:180,width:220,height:170,fill:"#EFE3C8",stroke:"#5D4B38","stroke-width":6},FA); el("line",{x1:200,y1:180,x2:200,y2:350,stroke:"#5D4B38","stroke-width":5},FA);
const kidG=el("g",{},FA);
function makeKid(o){   // the kid rig (Gopi-style proportions)
  const g=el("g",{},o.parent), body=el("g",{},g);
  el("rect",{x:-62,y:-175,width:124,height:60,rx:16,fill:o.shorts},body);
  el("rect",{x:-62,y:-300,width:124,height:150,rx:36,fill:o.shirt,stroke:"#9E9E9E","stroke-width":3},body);
  [-34,34].forEach(x=>{el("rect",{x:x-14,y:-118,width:28,height:110,rx:12,fill:o.skin},body); el("ellipse",{cx:x,cy:-6,rx:22,ry:12,fill:"#3E2723"},body)});
  const armL=el("line",{stroke:o.skin,"stroke-width":26,"stroke-linecap":"round"},body),armR=el("line",{stroke:o.skin,"stroke-width":26,"stroke-linecap":"round"},body);
  const head=el("g",{},body);
  el("circle",{cx:0,cy:-400,r:105,fill:o.skin},head);
  el("path",{d:"M-105 -410 Q-100 -520 0 -515 Q100 -520 105 -410 Q60 -470 0 -455 Q-60 -470 -105 -410Z",fill:o.hair},head);
  const eyes=[-36,36].map(x=>{el("ellipse",{cx:x,cy:-405,rx:19,ry:23,fill:"#fff"},head); return el("circle",{cx:x,cy:-400,r:10,fill:"#1b1b1b"},head)});
  const mouth=el("ellipse",{cx:0,cy:-345,rx:18,ry:5,fill:"#7A1F1F"},head);
  const st={x:0,y:0,s:1,armL:200,armR:160,gasp:0,look:0};
  function draw(){g.setAttribute("transform",`translate(${st.x},${st.y}) scale(${st.s})`);
    [[armL,-58,st.armL],[armR,58,st.armR]].forEach(([a,sx,deg])=>{const r=deg*Math.PI/180;a.setAttribute("x1",sx);a.setAttribute("y1",-280);a.setAttribute("x2",sx+Math.sin(r)*115);a.setAttribute("y2",-280-Math.cos(r)*115)});
    eyes.forEach((e,i)=>e.setAttribute("cx",(i?36:-36)+st.look*8)); mouth.setAttribute("ry",st.gasp?20:5); mouth.setAttribute("rx",st.gasp?16:18)}
  return {st,draw}}
const KID=makeKid({parent:kidG,skin:"#BE8460",hair:"#16100C",shirt:"#FFFFFF",shorts:"#283593"});
const fbT=makeTiffin(FA);
// B: the airport goodbye (Nov 2024)
el("rect",{x:0,y:0,width:960,height:760,fill:"#D9C7A6"},FBB); el("rect",{x:60,y:60,width:840,height:420,fill:"#C9DCE4",stroke:"#5D4B38","stroke-width":8},FBB);
for(let x=60;x<=900;x+=168) el("rect",{x:x-4,y:60,width:8,height:420,fill:"#5D4B38"},FBB);
el("path",{d:"M180 260 L560 230 L630 180 L660 182 L640 232 L720 230 Q760 240 720 256 L210 290 Z",fill:"#F5EFE2",stroke:"#5D4B38","stroke-width":4},FBB);
el("rect",{x:0,y:600,width:960,height:160,fill:"#B8A68A"},FBB);
const fbSon=makeAdult({...SON_OPT,legs:{pant:"#2F3542",shoe:"#1A1A1A"},parent:FBB});
el("rect",{x:560,y:520,width:110,height:150,rx:10,fill:"#D84315",stroke:INK,"stroke-width":5},FBB); el("rect",{x:595,y:494,width:40,height:30,fill:"none",stroke:INK,"stroke-width":5},FBB);

// ---------- split frame (L10): Nikhil | the photo of her son ----------
const abDefs=el("defs",{},absvg);
const clipA=el("clipPath",{id:"clipA"},abDefs); el("rect",{x:0,y:300,width:540,height:1180},clipA);
const clipB=el("clipPath",{id:"clipB"},abDefs); el("rect",{x:540,y:300,width:540,height:1180},clipB);
const gAo=el("g",{"clip-path":"url(#clipA)"},absvg), gA=el("g",{},gAo);
const gBo=el("g",{"clip-path":"url(#clipB)"},absvg), gB=el("g",{},gBo);
el("rect",{x:0,y:200,width:600,height:1400,fill:"#F4E6D0"},gA); el("rect",{x:0,y:1250,width:600,height:300,fill:"#EBD3AE"},gA);
const NKs=makeAdult({...NIKHIL_OPT,parent:gA});
el("rect",{x:500,y:200,width:600,height:1400,fill:"#FFE7A3"},gB);
const spPh=makePhoto(gB); spPh.setAttribute("transform","translate(810,880) scale(2.45) rotate(-3)");
const seam=el("rect",{x:532,y:300,width:16,height:1180,fill:INK},absvg);

// ---------- the video call (generic UI): Amma in her kitchen in Rajahmundry ----------
{const V=$("vcs"); el("rect",{x:0,y:0,width:484,height:884,fill:"#FFF3E0"},V);
 for(let y=520;y<884;y+=44) for(let x=0;x<484;x+=44) el("rect",{x,y,width:42,height:42,fill:(x/44+y/44)%2?"#E0F2F1":"#FFFFFF"},V);
 el("rect",{x:300,y:90,width:150,height:180,fill:"#BBDEFB",stroke:"#8D6E63","stroke-width":8},V); el("line",{x1:375,y1:90,x2:375,y2:270,stroke:"#8D6E63","stroke-width":5},V);
 el("rect",{x:20,y:300,width:220,height:14,fill:"#8D6E63"},V);
 [[50,262,"#CFD8DC",40,38],[110,250,"#B0BEC5",50,50],[180,266,"#FFCC80",34,34]].forEach(([x,y,c,w,h])=>el("rect",{x:x-w/2,y,width:w,height:h,rx:8,fill:c,stroke:INK,"stroke-width":3},V));
 window.AMMA=makeAdult({...SAROJA_OPT,parent:V});
 const P=$("pip"); el("rect",{x:0,y:0,width:122,height:172,fill:"#F4E6D0"},P); window.PIPN=makeAdult({...NIKHIL_OPT,parent:P})}

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
const COLORS={gopi:"#F5B347",nikhil:"#C9C3F2",ananya:"#7FE0D0",lakshmi:"#FFCC80"},
      NAMES={gopi:"GOPI",nikhil:"NIKHIL",ananya:"ANANYA",lakshmi:"LAKSHMI AUNTY"};
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
  B.tap=at(0,"ఆరో")-0.04; B.titleIn=1.15; B.pull=at(0,"Nikhil")-0.25;
  B.lid0=S(1)-0.2; B.sniff=S(1)+0.25; B.tFav=at(1,"favourite"); B.tPeru=at(1,"పేరు")-0.1; B.lidBack=E(1)+0.1; B.ans0=S(1)+0.1; B.ans1=E(1)+0.1;
  B.heart=S(2)-0.05; B.tStk=at(2,"admirer")-0.05; B.tParty=at(2,"Party"); B.poof=E(2)+0.05;
  B.th0=at(3,"రాజమండ్రిలో")-0.1; B.tEv=at(3,"ఎవరు"); B.th1=E(3)+0.12;
  B.caf=S(4)-0.62; B.pick=S(4)+0.15; B.an5=S(5)-0.25; B.tPopu=at(5,"పోపు"); B.tQ=at(5,"ఎక్కడో"); B.leave=S(5)+0.2;
  B.fol0=S(6)-0.1; B.rc=[S(6)+0.05,S(6)+0.3,S(6)+0.55]; B.tFol=at(6,"follow")+0.1; B.fol1=E(6)+0.05;
  B.q0=S(7)-0.1; B.tGuess=at(7,"guess"); B.CD0=E(7)+0.1; B.CD1=B.CD0+TL.countdown; B.cb=CB.map((_,i)=>B.CD0+0.3+i*0.95);
  B.rev=B.CD1; B.wipe1=B.rev+0.72; B.walk0=B.rev+0.45; B.walk1=S(8)-0.62; B.frz=S(8)-0.58;
  B.thumb=S(9)-0.55; B.fb0=S(9)+0.02; B.drop=B.fb0+0.3; B.fbB=S(9)+1.4; B.fb1=S(9)+3.25; B.phc1=E(9)+0.15;   // phrase starts measured on vo/L9.wav
  B.offer=S(10)-0.2; B.sp0=S(10)+2.08; B.sp1=E(10)+0.12;
  B.seat0=E(10)+0.3; B.sit=B.seat0+0.35; B.ring0=S(11)-0.95; B.conn=S(11)-0.12; B.tAnnam=S(11)+1.65;
  B.sh0=S(12)-0.1; B.tAmma=S(12)+1.0; B.tTag=S(12)+2.3; B.end0=E(12)+0.08; B.tEF=B.end0+0.55; B.loop0=TL.dur-1.5;
  return B}

const focus=(z,wx,wy,sx=540,sy=1000)=>({z,fx:wx-(sx-540)/z,fy:wy-(sy-1000)/z});
const mixCam=(a,b_,k)=>({z:lerp(a.z,b_.z,k),fx:lerp(a.fx,b_.fx,k),fy:lerp(a.fy,b_.fy,k)});
let curSkin="";
function skinTo(s){ if(s!==curSkin){ setSkin(s); curSkin=s } }
// subtitles: explicit line breaks (no orphaned short Telugu words), … -> ...
const SUBS={0:"ఆరో రోజు! ఈ tiffin<br>ఎవరు పెడుతున్నారు Nikhil?!",1:"పెసరట్టు-ఉప్మా... నా&nbsp;favourite.<br>పేరు కూడా లేదు.",2:"Secret admirer!<br>Party ఎప్పుడు?",
  3:"అమ్మ రాజమండ్రిలో...<br>మరి నాకు ఎవరు వండుతారు?",4:"అన్నం తిన్నావా నాన్నా?",5:"ఈ పోపు వాసన...<br>ఎక్కడో తెలిసినట్టుందే!",
  6:"Clues అన్నీ screen మీదే...<br>ఇలాంటి twists కి follow కొట్టండి!",7:"Tiffin ఎవరిది?<br>మీ guess comment చేయండి...<br>five seconds!",8:"Aunty... మీరా?!",
  9:"ఈ box మా బాబుది...<br>America వెళ్ళి రెండేళ్ళు.<br>Phone కూడా తక్కువే.",10:"అలవాటుగా వాడికి వండుతా...<br>నువ్వు అచ్చం వాడిలాగే నాన్నా.",
  11:"అమ్మా... ఊరికే చేశా.<br>అన్నం తిన్నావా?",12:"మీకూ office లో ఒక 'అమ్మ' ఉన్నారా?<br>వాళ్ళని tag చేయండి!"};
const TX=470;   // the tiffin's spot on Nikhil's desk

function frame(t){
  const b=beats();
  const loop=t>=b.loop0;
  const tf=loop?0:t;                                   // the loop shot = frame 1
  const caf=!loop&&t>=b.caf&&t<b.rev+0.36;
  const day7=!loop&&t>=b.rev+0.36;
  const seat=!loop&&t>=b.seat0;
  const fbOn=!loop&&t>=b.fb0&&t<b.fb1;
  const frz=!loop&&t>=b.frz&&t<S(8)+0.2;
  skinTo("flat");
  const reset=(C,who,x,y,s)=>Object.assign(C.st,{x,y,s,talk:who&&!loop?talkOf(who,t):0,blink:(((tf*0.6+x*0.0013)%3.3)<0.11?1:0),shut:0,look:0,lookY:0,brow:"n",smile:0,laugh:0,sad:0,smirk:0,gasp:0,
    headRot:0,headY:0,hop:0,rot:0,item:"",itemL:"",itemRot:0,itemRotL:0,vis:1,flip:1,wink:0,walk:0,lany:1,specSwing:0,tear:0,phoneGlow:0,hL:[-62,-66],hR:[62,-66]});

  // ---------------- trolley (frame 1: rolling out at the left; day 7: parked) ----------------
  {const x=day7?330:320-75*tf; trolley.g.setAttribute("transform",`translate(${x},${FL+48})`); trolley.g.style.display=(day7||tf<3)&&!caf?"":"none";
   trolley.wheels.forEach((w,i)=>w.setAttribute("transform",`translate(${[-250,-40][i]},-20) rotate(${day7?0:-tf*215})`))}
  // ---------------- chairs ----------------
  chair1.setAttribute("transform",`translate(640,${DT+20})`);
  {const k=seat?out((t-b.seat0)/0.4):0; chair2.setAttribute("transform",`translate(${lerp(140,420,k)},${DT+20})`); chair2.style.display=seat?"":"none"}

  // ---------------- DAY 6: Nikhil (seated) + Ananya (front) ----------------
  const nk=NK.st; reset(NK,"nikhil",640,DT+60,0.95); nk.look=-0.6; nk.vis=(!day7||seat)?1:0;
  const an=AN.st; reset(AN,"ananya",790,1720-448*1.08,1.08); an.vis=day7?0:1; an.look=-0.7; an.smile=1; an.brow="u";
  let tfx=TX, tfy=DT, lidDX=0, lidDY=0, lidR=0, foodOn=0;
  if(!day7){
    // Ananya taps the lid (frame 1), then teases
    const tapD=Math.max(0,1-Math.abs(tf-b.tap)/0.08)+Math.max(0,1-Math.abs(tf-b.tap-0.22)/0.08);
    if(tf<S(1)-0.3){ AN.aim("L",TX-14,DT-236+Math.min(1,tapD*1.6)*52); an.rot=-4; an.lookY=0.5; an.look=-0.8; an.brow="u"; an.smile=0 }
    if(tf>=b.pull-0.1&&tf<S(1)-0.3){ an.look=-0.3; an.lookY=0; an.brow="q" }
    if(tf>=b.pull){ const k=ease((tf-b.pull)/0.7); an.x=lerp(790,935,k); an.walk=k>0&&k<1?Math.sin(tf*12)*0.6:0; if(tf<S(1)-0.3){ an.hL=[-62,-66] } }   // steps aside: Nikhil in view
    if(tf>=b.sniff&&tf<b.sniff+1.4){ const k=Math.sin(clamp((tf-b.sniff)/1.4)*Math.PI); an.rot=-7*k; an.headY=10*k; an.headRot=-8*k; an.look=-0.9; an.lookY=0.8*k; an.shut=k>0.6?1:0; an.smile=1 }   // sniffs the steam (silent clue)
    if(tf>=S(2)-0.1&&tf<b.poof){ an.smirk=1; an.smile=0; an.brow="q"; an.look=-0.5; an.headRot=5; if(tf>=b.tParty){ an.laugh=1; an.smirk=0; an.hop=Math.abs(Math.sin(tf*14))*4 } AN.aim("R",880,1060) }
    if(tf>=b.poof){ an.laugh=0; an.smirk=0; an.brow="w"; an.smile=0; an.sad=tf>=b.tEv?1:0; an.look=-0.6; an.lookY=0.2 }
    // Nikhil
    nk.look=-0.7; nk.lookY=0.5; nk.brow="n";
    if(tf<b.lid0){ nk.brow="w"; nk.look=-0.8; nk.lookY=0.6 }
    if(tf>=b.lid0&&tf<b.lidBack+0.3){ const up=out((tf-b.lid0)/0.35), dn=clamp((tf-b.lidBack)/0.3);
      const hx=lerp(TX+10,TX+60,up*(1-dn)), hy=lerp(DT-150,DT-300,up*(1-dn)); NK.aim("L",hx,hy); lidDX=(hx-TX-10)*(1-dn); lidDY=(hy-DT+150)*(1-dn); lidR=(tf>=b.tPeru-0.1&&tf<b.lidBack?-160*out((tf-b.tPeru+0.1)/0.3):0)*(1-dn);
      nk.smile=tf<b.tPeru?1:0; nk.brow=tf<b.tPeru?"u":"w"; nk.look=-0.7; nk.lookY=0.3; foodOn=up*(1-dn) }
    if(tf>=b.lidBack+0.3){ nk.brow="w"; nk.look=0.6; nk.lookY=0 }
    if(tf>=S(2)&&tf<b.poof+0.3){ nk.look=0.8; nk.brow="n"; nk.smile=0; nk.sad=0 }                         // flat look at her
    if(tf>=S(3)-0.1){ nk.look=0.2; nk.lookY=0.6; nk.sad=1; nk.brow="w"; nk.headRot=4 }
  }
  // ---------------- DAY 7: Lakshmi at his desk with the trolley; Nikhil walks in with his laptop ----------------
  const lk=LKD.st; reset(LKD,"lakshmi",430,DT-95,0.95); lk.vis=day7?1:0;
  const ne=NKE.st; reset(NKE,"nikhil",900,1720-448*1.08,1.08); ne.vis=day7&&!seat?1:0; ne.itemL="laptop"; ne.hL=[-80,-120];
  if(day7&&!seat){
    const wk=clamp((t-b.walk0)/(b.walk1-b.walk0)); ne.x=lerp(1300,900,out(wk)); ne.walk=wk<1?Math.sin(t*12):0; ne.hop=wk<1?Math.abs(Math.sin(t*12))*6:0; ne.look=-0.6;
    // she places the tiffin -> FREEZE when she sees him (specs swing on the chain)
    lk.look=0.2; lk.lookY=0.6; lk.smile=1; tfx=TX+10; tfy=lerp(DT-40,DT,clamp((t-b.rev-0.4)/0.4));
    if(t>=b.frz){ const k=t-b.frz; lk.look=0.85; lk.lookY=0; lk.smile=0; lk.gasp=t<S(9)-0.5?1:0; lk.brow="u"; lk.specSwing=16*Math.sin(k*7)*Math.exp(-k*1.6); lk.headY=-4;
      ne.brow="u"; ne.gasp=t<S(8)?1:0; ne.look=-0.8; tfy=DT-60 }
    if(t>=S(8)){ ne.brow="u"; ne.look=-0.7 }
    // holding the tiffin (thumb on the dent), then holding it out to him
    if(t>=b.frz){ tfx=TX+30; tfy=DT-70 }
    if(t>=b.thumb){ lk.gasp=0; lk.look=0; lk.lookY=0.9; lk.brow="w"; lk.sad=1; lk.headRot=-5; tfx=TX+30; tfy=DT-80 }
    if(t>=b.fb1){ lk.look=0.6; lk.lookY=0.2 }
    if(t>=b.offer){ const k=out((t-b.offer)/0.6); tfx=lerp(TX+30,TX+150,k); tfy=lerp(DT-80,DT-110,k); lk.sad=0; lk.smile=1; lk.look=0.8; lk.lookY=0.15; lk.brow="w"; lk.headRot=-6; lk.rot=4*k }
    LKD.aim("L",tfx-62,tfy-60); LKD.aim("R",tfx+50,tfy-112);
    if(t>=b.thumb&&t<b.offer) LKD.aim("R",tfx+44,tfy-140+Math.sin((t-b.thumb)*5)*3);   // thumb on the dent
    lk.phoneGlow=t>=b.fb1&&t<b.phc1?1:0;
    if(t>=S(9)) { ne.brow="w"; ne.look=-0.7; ne.sad=t<b.offer?1:0 }
    if(t>=b.offer){ ne.sad=0; ne.brow="u"; ne.smile=t>at(10,"అచ్చం")?1:0 }
  }
  // ---------------- the shared lunch + the video call ----------------
  if(seat){
    lk.y=lerp(DT-95,DT+60,out((t-b.sit)/0.4)); lk.x=420; lk.rot=0; lk.look=0.8; lk.smile=1; lk.brow="n"; lk.headRot=0; lk.lookY=0.1; lk.sad=0;
    tfx=530; tfy=DT; foodOn=1; lidDX=-120; lidDY=150-2; lidR=0;
    LKD.aim("L",380,DT-10); LKD.aim("R",470,DT-10);
    nk.look=-0.4; nk.brow="n"; nk.smile=1; nk.sad=0; nk.headRot=0;
    if(t>=b.ring0-0.3){ nk.itemL="phone"; nk.hL=[-30,-380]; nk.look=-0.1; nk.lookY=-0.3; nk.smile=t>=b.conn?1:0; nk.brow=t>=b.conn?"u":"n" }
    if(t>=b.tAnnam-0.2){ lk.smile=1; lk.brow="w"; LKD.aim("R",450,DT-400); lk.lookY=0.2; lk.tear=clamp((t-b.tAnnam)/1.2)*0.8 }   // wipes her eye, smiling
  }
  NK.draw(); AN.draw(); LKD.draw(); NKE.draw();
  // the tiffin (lid lifted / back on / held / open on the desk), the glint on the dent (frame 1 + the loop)
  TF.g.setAttribute("transform",`translate(${tfx},${tfy})`); TF.g.style.display=caf?"none":"";
  TF.lid.setAttribute("transform",`translate(${lidDX},${lidDY}) rotate(${lidR} 0 -134)`); TF.food.style.opacity=foodOn>0.3?1:0;
  {const gl=loop?0.5+0.5*Math.sin(t*9):Math.max(0,1-tf/1.2)*(0.5+0.5*Math.sin(tf*9)); TF.glint.style.opacity=gl; TF.glint.setAttribute("transform",`translate(54,-150) scale(${0.8+0.4*gl}) rotate(${tf*90})`)}
  swirlAt(SWT,t,tfx,tfy-150,!day7&&!caf&&tf>=b.lid0+0.2&&tf<b.lidBack+0.4?clamp((tf-b.lid0-0.2)/0.3):0,150,240);   // drifts to Ananya (she sniffs it)

  // ---------------- CAFETERIA (1:15 PM): Lakshmi at her counter, Nikhil takes his plate, Ananya sniffs ----------------
  const lc=LK.st; reset(LK,"lakshmi",CX+600,CT-20,0.95); lc.vis=caf?1:0; lc.item="ladle"; lc.itemRot=-20+Math.sin(t*4)*10; LK.aim("R",CX+715+Math.sin(t*4)*12,CT-110); LK.aim("L",CX+540,CT-30);
  lc.look=-0.7; lc.smile=1; lc.lookY=0.2;
  const nw=NKW.st; reset(NKW,"nikhil",CX+330,1720-448*1.08,1.08); nw.vis=caf?1:0; nw.look=0.6; nw.smile=1;
  const ac=ANC.st; reset(ANC,"ananya",CX+940,1720-448*1.08,1.08); ac.vis=caf?1:0; ac.look=-0.6;
  if(caf){
    if(t<b.pick){ NKW.aim("R",CX+430,CT-20) } else { nw.item="plate"; nw.hR=[70,-150]; nw.itemRot=0 }
    if(t>=S(4)&&t<E(4)+0.3){ nw.smile=1; nw.brow="u"; nw.look=0.8 }
    if(t>=b.leave){ const k=clamp((t-b.leave)/1.6); nw.x=lerp(CX+330,CX-260,ease(k)); nw.walk=k<1?Math.sin(t*11):0; nw.hop=k<1?Math.abs(Math.sin(t*11))*5:0; nw.look=-0.8; lc.look=lerp(-0.7,-1,k) }
    if(t>=b.an5){ lc.look=0.6 }
    ac.x=lerp(CX+1250,CX+940,out((t-b.caf-0.3)/0.6)); ac.walk=t<b.caf+0.9?Math.sin(t*11):0;
    if(t>=b.tPopu-0.3){ const k=clamp((t-b.tPopu+0.3)/0.4); ac.rot=-5*k; ac.headRot=-6*k; ac.shut=t<b.tQ?1:0; ac.look=-0.6; ac.lookY=0.4; ac.smile=t<b.tQ?1:0 }
    if(t>=b.tQ){ ac.shut=0; ac.brow="q"; ac.look=-0.3; ac.lookY=-0.2; ac.headRot=6; ac.smile=0; ANC.aim("R",CX+1000,1000) }
  }
  LK.draw(); NKW.draw(); ANC.draw();
  swirlAt(SWP,t,CX+775,CT-50,caf?1:0,(t>=b.an5&&t<b.fol0)?140:40,300);

  // ---------------- the memory inset (L9) ----------------
  {const w=$("fbw"); const k=Math.min(clamp((t-b.fb0)/0.25),clamp((b.fb1-t)/0.2)); w.style.opacity=fbOn?k:0;
   w.style.transformOrigin="50% 0"; w.style.transform=`translateY(${(1-out((t-b.fb0)/0.3))*-60}px) rotate(${-1.2+0.5*Math.sin(t*1.3)}deg) scale(${0.9*(0.96+0.04*out((t-b.fb0)/0.3))})`;
   const sceneB=t>=b.fbB; FA.style.display=sceneB?"none":""; FBB.style.display=sceneB?"":"none"; $("fbLY").textContent=sceneB?"Nov 2024":"చిన్నప్పుడు";
   const kd=KID.st; Object.assign(kd,{x:420,y:640,s:0.86,armL:200,armR:150,gasp:0,look:0.4});
   const fall=clamp((t-b.drop)/0.32), bnc=t>b.drop+0.32?Math.abs(Math.sin((t-b.drop-0.32)*12))*30*Math.exp(-(t-b.drop-0.32)*5):0;
   let fx=lerp(530,600,fall), fy=lerp(470,640,fall*fall)-bnc; if(t<b.drop){ kd.armR=150; fx=530; fy=470 } else { kd.armR=lerp(150,110,fall); kd.gasp=1; kd.look=0.8 }
   fbT.g.setAttribute("transform",`translate(${fx},${fy}) scale(0.8) rotate(${fall*35-(bnc?8:0)})`); fbT.dent.style.opacity=t>=b.drop+0.32?1:0; KID.draw();
   const cl=$("clang"); const ck=t-b.drop-0.32; cl.style.opacity=fbOn&&!sceneB&&ck>0&&ck<0.9?1:0; cl.style.left="560px"; cl.style.top="470px"; cl.style.transform=`scale(${Math.max(0.01,pop(t,b.drop+0.32,0.25))}) rotate(-8deg)`;
   const fs=fbSon.st; Object.assign(fs,{x:420,y:690-448*0.72,s:0.72,smile:1,brow:"u",look:0.3,talk:0,blink:0,shut:0,lookY:0,laugh:0,sad:0,smirk:0,gasp:0,headRot:Math.sin(t*3)*3,headY:0,hop:0,rot:0,item:"",itemL:"",vis:1,flip:1,wink:0,walk:0,lany:1,specSwing:0,tear:0,phoneGlow:0});
   fs.hR=[110,-460+Math.sin(t*10)*30]; fs.hL=[-70,-80]; fbSon.draw()}
  // her phone in the apron pocket: a long gap since the last call
  {const e=$("phc"), on=!loop&&t>=b.fb1&&t<b.phc1; e.style.opacity=on?Math.min(1,clamp((b.phc1-t)/0.15)):0; e.style.left="600px"; e.style.top="330px"; e.style.transform=`scale(${Math.max(0.01,pop(t,b.fb1,0.3))}) rotate(3deg)`; lk.phoneGlow=on?1:0}

  // ---------------- split frame (L10): Nikhil | her son's photo ----------------
  {const on=!loop&&t>=b.sp0&&t<b.sp1; const ab=$("ab"); ab.style.opacity=on?Math.min(clamp((t-b.sp0)/0.15),clamp((b.sp1-t)/0.15)):0;
   const k=out((t-b.sp0)/0.4); gAo.setAttribute("transform",`translate(${(1-k)*-200},0)`); gBo.setAttribute("transform",`translate(${(1-k)*200},0)`);
   const s_=NKs.st; Object.assign(s_,{x:270,y:1640,s:1.4,talk:0,blink:((t*0.6)%3.3)<0.11?1:0,look:0.4,lookY:0,brow:"u",smile:0,laugh:0,sad:0,smirk:0,gasp:0,headRot:0,headY:0,hop:0,rot:0,item:"",itemL:"",vis:1,flip:1,wink:0,walk:0,lany:1,specSwing:0,tear:0,phoneGlow:0,hL:[-62,-66],hR:[62,-66]}); NKs.draw()}

  // ---------------- video call ----------------
  {const e=$("vc"), on=!loop&&t>=b.ring0&&t<b.sh0+0.1; e.style.opacity=on?clamp((t-b.ring0)/0.15):0; e.style.left="540px"; e.style.top="300px";
   e.style.transform=`scale(${Math.max(0.01,pop(t,b.ring0,0.35))}) rotate(2deg)`; $("vring").style.opacity=t<b.conn?1:0;
   $("vring").querySelector(".av").style.transform=`scale(${1+0.06*Math.sin(t*14)})`;
   $("vct").textContent="00:0"+Math.max(0,Math.min(9,Math.floor(t-b.conn+1)));
   const A=AMMA.st; Object.assign(A,{x:242,y:1080,s:1.3,talk:0,blink:((t*0.5)%3.1)<0.1?1:0,look:0.05,lookY:0,brow:"n",smile:0,laugh:0,sad:0,smirk:0,gasp:0,headRot:Math.sin(t*2)*2,headY:0,hop:0,rot:0,item:"",itemL:"",vis:1,flip:1,wink:0,walk:0,lany:1,specSwing:0,tear:0,phoneGlow:0,hL:[-62,-66],hR:[62,-66]});
   if(t>=b.conn){ A.brow="u"; A.smile=1; A.gasp=t<b.conn+0.4?1:0 }
   if(t>=b.tAnnam){ A.laugh=1; A.smile=1; A.hR=[40,-330]; A.headRot=-4+Math.sin(t*8)*2 }             // she lights up
   AMMA.draw();
   const P=PIPN.st; Object.assign(P,{x:61,y:240,s:0.34,talk:talkOf("nikhil",t),blink:0,look:0,lookY:0,brow:"n",smile:1,laugh:0,sad:0,smirk:0,gasp:0,headRot:0,headY:0,hop:0,rot:0,item:"",itemL:"",vis:1,flip:1,wink:0,walk:0,lany:1,specSwing:0,tear:0,phoneGlow:0,hL:[-62,-66],hR:[62,-66]}); PIPN.draw()}

  // ---------------- Gopi (narrator badge) ----------------
  const g=GOPI.st;
  const nIn=(i,pre=0.15,post=0.2)=>t>S(i)-pre&&t<E(i)+post;
  const narOn=!loop&&(nIn(6)||nIn(7,0.15,0.05)||nIn(12,0.15,0.1));
  const narT=t>S(12)-0.15?S(12)-0.15:t>S(7)-0.15?S(7)-0.15:S(6)-0.15;
  let BX=880, BY=1050, bsc=0.82;
  if(t>S(7)-0.2&&t<E(7)+0.2){ BX=170; BY=740 }
  if(t>S(12)-0.2){ BX=900; BY=1330 }
  Object.assign(g,{x:0,y:400*0.55+12,s:0.55,talk:talkOf("gopi",t),blink:((t*0.7)%3.1)<0.12?1:0,wink:0,look:BX>540?-0.5:0.5,lookY:0,brow:"n",smile:0,headRot:Math.sin(t*2.2)*3,item:"",armL:200,armR:160,lenL:115,lenR:115,hop:0,itemRot:0});
  if(t>S(6)&&t<b.rc[2]+0.4){ g.brow="q"; g.wink=t>b.rc[2]?1:0; g.smile=1 }
  if(t>b.fol0&&t<b.fol1&&t>at(6,"ఇలాంటి")){ g.armR=40; g.item="point"; g.itemRot=-30; g.look=-0.2; g.lookY=0.6 }
  if(t>S(7)&&t<E(7)){ g.brow="u"; g.look=0.6 }
  if(t>S(12)){ g.smile=1; g.brow="q" }
  GOPI.draw();
  const bs=narOn?Math.max(0.001,back((t-narT)/0.35)):0;
  badge.setAttribute("transform",`translate(${BX},${BY}) scale(${bs*bsc}) rotate(${Math.sin(t*2)*2})`); badge.style.opacity=narOn?1:0;

  // ---------------- camera ----------------
  const punch=(t0,a_=0.1)=>t>t0?a_*Math.exp(-(t-t0)*4)*clamp((t-t0)/0.06):0;
  const OPEN=focus(1.6+0.01*tf+punch(b.tap,0.03),470,1260);
  const shots=[
    [0,OPEN],
    [b.pull,focus(1.08,640,1150),0.7],                                         // pull back: the desk, DAY 6 tally, 1:00 PM
    [b.lid0,focus(1.3+0.01*(t-b.lid0),560,1080),0.4],                          // the lid comes off: pesarattu-upma + the swirl
    [S(2)-0.15,focus(1.12,660,1080),0.35],
    [b.th0-0.1,focus(1.32+0.02*(t-b.th0),640,960),0.4],                        // push-in on his uneasy face
    [b.caf,focus(0.96+0.006*(t-b.caf),CX+560,1020)],                           // CUT: the cafeteria
    [b.an5,focus(1.18+0.01*(t-b.an5),CX+800,980),0.5],                         // Ananya + the swirl
    [b.rev+0.36,focus(1.02,620,1150)],                                         // DAY 7 (behind the wipe)
    [b.frz,focus(1.12,600,1120),0.25],
    [b.thumb,focus(1.55+0.01*(t-b.thumb),TX+40,1020),0.35],                    // her thumb on the dent
    [b.fb1,focus(1.15,600,1100),0.4],
    [b.seat0,focus(1.05,520,1120)],                                            // the shared lunch
    [b.tAnnam,focus(1.12+0.01*(t-b.tAnnam),480,1100),0.6],
  ];
  let cm=OPEN;
  if(!loop){ let i=0; while(i+1<shots.length&&t>=shots[i+1][0]) i++;
    const [t0,c,tr]=shots[i]; cm=c;
    if(i>0&&tr&&t<t0+tr){ const prev=shots[i-1][1]; cm=mixCam(prev,c,ease((t-t0)/tr)) } }
  let sx=0,sy=0; const shake=(t0,d,a_)=>{if(t>t0&&t<t0+d){const q=(1-(t-t0)/d)*a_; sx+=Math.sin(t*90)*q; sy+=Math.cos(t*77)*q}};
  if(!loop){ shake(b.frz,0.2,4) }
  cam.setAttribute("transform",`translate(${540+sx},${1000+sy}) scale(${cm.z}) translate(${-cm.fx},${-cm.fy})`);
  const scr=(wx,wy)=>[540+(wx-cm.fx)*cm.z+sx, 1000+(wy-cm.fy)*cm.z+sy];

  // ---------------- HTML overlays ----------------
  let dm=0; if(fbOn) dm=0.5*Math.min(clamp((t-b.fb0)/0.25),clamp((b.fb1-t)/0.2));
  if(!loop&&t>=b.fol0&&t<b.q0) dm=0.45*clamp((t-b.fol0)/0.3);
  if(!loop&&t>=b.q0&&t<b.rev+0.3) dm=lerp(0.45,1,clamp((t-b.q0)/0.25));   // solid: nobody from the cafeteria shows during the guesses
  if(!loop&&t>=b.sp0&&t<b.sp1) dm=0.6;
  $("dim").style.opacity=dm;
  const wlab=(id,on,wx,wy,s=1,rot=0)=>{const e=$(id); if(!on){e.style.opacity=0; return} const [px,py]=scr(wx,wy), z=cm.z*s, hw=e.offsetWidth*z/2, hh=e.offsetHeight*z/2;
    if(px-hw<4||px+hw>1076||py-hh<4||py+hh>1916){e.style.opacity=0; return} e.style.opacity=1; e.style.transform=`translate(${px}px,${py}px) translate(-50%,-50%) scale(${z}) rotate(${rot}deg)`};
  {$("wclk").textContent=caf?"1:15 PM":day7?"12:40 PM":"1:00 PM"; const bg=!(t>=b.fol0&&t<b.rev+0.4);
   if(caf) wlab("wclk",false,0,0); /* the cafeteria time is on the 1:15 PM chip (a wall clock collided with the top bar) */ else wlab("wclk",bg||loop,250,640,0.9)}
  wlab("menu",caf&&!(t>=b.fol0),CX+890,465,1);
  wlab("slip",caf&&!(t>=b.q0),CX+560,CT-20,0.85,-3);
  // text hook (frame 1 + the loop) + title a beat later
  {const on=loop||t<b.lid0; $("hook").style.opacity=on?(loop?1:clamp((b.lid0-t)/0.15)):0; $("hook").style.transform=`rotate(${-1.5+(loop?0:Math.sin(t*3)*0.6)}deg)`;
   const ti=$("title"), ton=!loop&&t>b.titleIn&&t<b.lid0; ti.style.opacity=ton?clamp((b.lid0-t)/0.12):0; ti.style.top="1240px"; ti.style.transform=`scale(${Math.max(0.01,back((t-b.titleIn)/0.45))}) rotate(-2deg)`}
  show("ans",!loop&&t>b.ans0&&t<b.ans1,pop(t,b.ans0,0.35),`rotate(-2deg)`);
  // the lid's underside: no name, no note
  {const e=$("lidU"), on=!loop&&t>=b.tPeru&&t<b.lidBack; e.style.opacity=on?1:0; if(on){const [px,py]=scr(TX+60,DT-330); e.style.left=(px-150)+"px"; e.style.top=(py-150)+"px"; e.style.transform=`scale(${Math.max(0.01,pop(t,b.tPeru,0.3))}) rotate(${-6+Math.sin(t*3)*2}deg)`}}
  // L2: the heart, the sticker, Nikhil's flat look pops it
  {const e=$("heart"), on=!loop&&t>=b.heart&&t<b.poof+0.05; const [px,py]=scr(TX,DT-280); e.style.opacity=on?1:0; e.style.left=(px-60)+"px"; e.style.top=(py-70-(t-b.heart)*20)+"px"; e.style.transform=`scale(${Math.max(0.01,pop(t,b.heart,0.3))*(1+0.08*Math.sin(t*12))})`}
  {const e=$("stk"), on=!loop&&t>=b.tStk&&t<b.poof+0.05; e.style.opacity=on?1:0; e.style.left="120px"; e.style.top="330px"; e.style.transform=`scale(${lerp(1.8,1,out((t-b.tStk)/0.18))}) rotate(-7deg)`}
  {const e=$("poof"), k=(t-b.poof)/0.45, [px,py]=scr(TX,DT-300); e.style.opacity=!loop&&k>0&&k<1?1-k:0; e.style.left=(px-50)+"px"; e.style.top=(py-60)+"px"; e.style.transform=`scale(${1+k})`}
  // L3: the thought bubble (Amma in Rajahmundry | his empty flat)
  {const e=$("think"), on=!loop&&t>=b.th0&&t<b.th1; e.style.opacity=on?1:0; e.style.left="30px"; e.style.top="300px";
   e.style.transform=`scale(${Math.max(0.01,pop(t,b.th0,0.4))*(t>b.th1-0.12?1+(t-b.th1+0.12)*3:1)}) rotate(-2deg)`;
   if(on){ const A=THA.st; A.hR=[110,-440+Math.sin(t*9)*40]; A.blink=((t*0.5)%2.3)<0.1?1:0; THA.draw() }}
  // time chips
  {const e=$("tchip"), onC=caf&&t<b.fol0, onD=day7&&t>=b.wipe1&&t<b.thumb; e.textContent=onC?"1:15 PM · CAFETERIA":"NEXT DAY · 12:40 PM"; show("tchip",onC||onD,pop(t,onC?b.caf+0.05:b.wipe1,0.3))}
  // L5: Ananya's '?'
  {const e=$("sniffq"), on=caf&&t>=b.tQ&&t<b.fol0; e.style.opacity=on?1:0; if(on){const [px,py]=scr(CX+985,1720-448*1.08-560*1.08); e.style.left=(px-42)+"px"; e.style.top=(py-42+Math.sin(t*5)*6)+"px"; e.style.transform=`scale(${Math.max(0.01,pop(t,b.tQ,0.3))})`}}
  // L6: recap strip (three clues, same weight, no labels) + the follow tap
  {const on=!loop&&t>=b.fol0&&t<b.fol1+0.1; $("recap").style.opacity=on?clamp((b.fol1+0.1-t)/0.15):0;
   ["pn0","pn1","pn2"].forEach((id,i)=>{const e=$(id), t0=b.rc[i]; e.style.opacity=t>t0?1:0; e.style.transform=`translateY(${lerp(-60,0,out((t-t0)/0.25))}px) scale(${Math.max(0.01,pop(t,t0,0.3))}) rotate(${[-3,2,-2][i]}deg)`});
   if(on) swirlAt(rcS,t,148,226,1,10,190)}
  const fA=b.tFol-1.0, fB=b.fol1+0.1; const fOn=!loop&&t>fA&&t<fB; const fol=$("fol"); fol.style.opacity=fOn?clamp(Math.min((t-fA)/0.2,(fB-t)/0.12)):0; fol.style.top="1250px";
  fol.style.transform=`scale(${Math.max(0.01,back((t-fA)/0.4))*(Math.abs(t-b.tFol)<0.1?0.9:1)})`;
  const bF=$("bF"); bF.textContent=t<b.tFol?"+ FOLLOW":"FOLLOWING ✓"; bF.className="btn"+(t<b.tFol?"":" done");
  {const hand=$("tapHand"); const hk=ease((t-fA-0.1)/Math.max(0.3,b.tFol-fA-0.2)); const dip=Math.max(0,1-Math.abs(t-b.tFol)/0.1);
   hand.style.opacity=fOn?clamp(Math.min((t-fA-0.05)/0.15,(fB-t)/0.12)):0; hand.style.transform=`translate(${lerp(900,560,hk)-50}px,${lerp(1650,1310,hk)+dip*12}px) rotate(${-8+dip*6}deg)`;
   const rg_=$("ring"), rk=(t-b.tFol)/0.45; rg_.style.opacity=fOn&&rk>0&&rk<1?1-rk:0; rg_.style.left="560px"; rg_.style.top="1310px"; rg_.style.transform=`scale(${1+rk*6})`}
  // L7 + countdown: the spinning tiffin, '?', 5-4-3-2-1, wrong guesses only
  {const on=!loop&&t>=b.q0&&t<b.rev+0.1;
   show("q",on,pop(t,b.q0,0.35),`rotate(-1.5deg)`);
   const sp=$("spin"); sp.style.opacity=on?clamp((t-b.q0)/0.2):0; spinG.setAttribute("transform",`scale(${Math.cos((t-b.q0)*2.6)},1)`); sp.style.transform=`scale(${Math.max(0.01,pop(t,b.q0,0.4))}) translateY(${Math.sin(t*3)*8}px)`;
   const qm=$("qm"); qm.style.opacity=on&&t>b.q0+0.4?1:0; qm.style.left="610px"; qm.style.top="330px"; qm.style.transform=`scale(${Math.max(0.01,pop(t,b.q0+0.4,0.35))*(1+0.06*Math.sin(t*6))}) rotate(12deg)`;
   show("cnow",on&&t>Math.max(b.tGuess,E(7)-0.4)&&t<b.CD1,Math.max(0.01,pop(t,Math.max(b.tGuess,E(7)-0.4),0.35))*(1+0.05*Math.sin(t*Math.PI*4)));
   const cdk=t-b.CD0, cdOn=t>=b.CD0&&t<b.CD1, sec=Math.floor(cdk), fr=cdk-sec;
   $("cdw").style.opacity=cdOn?clamp(cdk/0.15)*clamp((TL.countdown-cdk)/0.15):0;
   if(cdOn){const n_=Math.max(1,TL.countdown-sec); $("digit").textContent=n_; $("digit").style.transform=`scale(${lerp(1.5,1,out(fr/0.2))})`; $("digit").style.color=n_<=1?"#FF5252":"#F5B347";
     $("arc").setAttribute("stroke-dasharray",`${565.5*(1-cdk/TL.countdown)} 565.5`); $("cdw").style.transform=`scale(${1+Math.exp(-fr*8)*0.08})`}
   CB.forEach((_,i)=>{const e=$("cb"+i), t0=b.cb[i], k=pop(t,t0,0.3); const v=!loop&&t>t0&&t<b.CD1; e.style.opacity=v?clamp((b.CD1-t)/0.15):0;
     e.style.transform=`translateY(${-(t-t0)*14}px) scale(${Math.max(0.01,k)}) rotate(${(i%2?3:-3)}deg)`})}
  // NEXT DAY wipe
  {const e=$("wipe"); const on=!loop&&t>b.rev&&t<b.wipe1; const k=Math.min(clamp((t-b.rev)/0.2),clamp((b.wipe1-t)/0.22)); e.style.opacity=on?1:0;
   e.style.clipPath=`circle(${k*120}% at 50% 45%)`; e.querySelector(".tm").style.transform=`scale(${Math.max(0.01,pop(t,b.rev+0.05,0.35))}) rotate(-1.5deg)`}
  // the share card: tag your office Amma
  {const shOn=!loop&&t>b.sh0&&t<b.end0+0.1; const sh=$("share"); sh.style.opacity=shOn?clamp(Math.min((t-b.sh0)/0.2,(b.end0+0.1-t)/0.15)):0;
   $("sq").style.transform=`scale(${Math.max(0.01,back((t-b.sh0)/0.4))})`;
   const tAt=b.tAmma-0.3; $("cin").innerHTML=t>tAt?(t>b.tTag+0.1?'<em>@Office అమ్మ 🍱</em> మీ tiffin కి thanks 🥹':"@"+(t>tAt+0.3?"Off":"")):"";
   ["ct1","ct2","ct3"].forEach((id,i)=>{const e=$(id), t0=tAt+0.1+i*0.08; e.style.opacity=t>t0?1:0; e.style.transform=`translateY(${lerp(30,0,out((t-t0)/0.25))}px) scale(${id==="ct1"&&Math.abs(t-b.tTag)<0.1?0.94:1})`; e.style.background=id==="ct1"&&t>b.tTag?"#FFF3B0":"#fff"});
   $("ok1").style.opacity=t>b.tTag+0.1?1:0}
  // end card with the follow tap, then the SILENT hard cut to frame 1
  {const ec=$("endc"), eOn=!loop&&t>b.end0&&t<b.loop0; ec.style.opacity=eOn?clamp((t-b.end0)/0.12):0;
   $("eF").textContent=t<b.tEF?"FOLLOW @_REELRASAM":"FOLLOWING ✓  @_REELRASAM"; $("eF").style.transform=`scale(${Math.abs(t-b.tEF)<0.1?0.92:1})`; $("eF").style.background=t<b.tEF?"":"#6D6875";
   const eh=$("eHand"), ek=ease((t-b.end0)/Math.max(0.2,b.tEF-b.end0-0.05)), edip=Math.max(0,1-Math.abs(t-b.tEF)/0.1);
   eh.style.opacity=eOn&&t<b.tEF+0.4?1:0; eh.style.transform=`translate(${lerp(900,500,ek)-50}px,${lerp(1300,650,ek)+edip*12}px) scale(${1-0.1*edip}) rotate(-8deg)`}
  {const on=loop; show("loopT",on,pop(t,b.loop0+0.15,0.3),"rotate(-2deg)"); const e=$("dring"); const [px,py]=scr(TX+40,DT-137); e.style.opacity=on?0.6+0.4*Math.sin(t*8):0; e.style.left=px+"px"; e.style.top=py+"px"; e.style.transform=`scale(${1+0.08*Math.sin(t*8)})`}
  // flashes: the cafeteria cut, the reveal, the inset in/out, the shared lunch
  const fl=(t0,d,a_)=>t>t0&&t<t0+d?a_*(1-(t-t0)/d):0;
  $("flash").style.opacity=loop?0:(fl(b.caf,0.12,0.35)+fl(b.fb0,0.12,0.3)+fl(b.fb1-0.05,0.12,0.25)+fl(b.seat0,0.12,0.3));
  // subtitles (none in the silent loop)
  const sub=$("sub"), L=curLine(t);
  if(!loop&&L&&!(t>b.end0)){sub.style.opacity=1; sub.innerHTML=`<span class="who" style="background:${COLORS[L.who]}">${NAMES[L.who]}</span><br>${SUBS[L.i]}`} else sub.style.opacity=0;
}
function show(id,on,s=1,extra=""){const e=$(id); e.style.opacity=on?1:0; if(on) e.style.transform=`${extra} scale(${Math.max(0.01,s)})`}

window.render=function(t){ frame(t) };
