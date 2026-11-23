// "ఒక్క దీపం కోసం 50 లక్షల మంది" — Arunachalam Maha Deepam logistics reel: drawn world, cast and choreography (ep.html).
// FLAT skin, night -> dusk -> the hilltop flame. Rigs: makeAdult() from the 24 Nov tiffin world.js (+ `old` forehead lines
// from 17 Nov) for Ammamma (AMMAMMA_OPT, cast.md); the kid makeChar() from tools/anim2d/ep.html for Pinky (her house look,
// barefoot on the path). Crowds are simple silhouettes seen from behind; buses/trains carry no text or logos.
const NS="http://www.w3.org/2000/svg", svg=document.getElementById("s");
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
const hex=c=>[1,3,5].map(k=>parseInt(c.slice(k,k+2),16)), mixc=(a,b,k)=>{const A=hex(a),B=hex(b);return "#"+A.map((v,i)=>Math.round(lerp(v,B[i],clamp(k))).toString(16).padStart(2,"0")).join("")};

const defs=el("defs",{});
const cam=el("g",{});
applySkin(cam, defs);
const W=el("g",{id:"world"},cam);
let clipN=0;
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
  if(o.old) el("path",{d:"M-30 -46 Q0 -52 30 -46 M-26 -38 Q0 -43 26 -38",stroke:"#7A4A2A","stroke-width":2,fill:"none",opacity:.45},face);   // forehead lines (17 Nov rig)
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

function makeChar(o){   // the kid rig (tools/anim2d/ep.html), Pinky
  const g=el("g",{},o.parent||cam), body=el("g",{},g);
  const legL=el("line",{stroke:o.skin,"stroke-width":30,"stroke-linecap":"round"},body),legR=el("line",{stroke:o.skin,"stroke-width":30,"stroke-linecap":"round"},body);
  const shoeL=el("ellipse",{rx:24,ry:13,fill:o.shoe||"#333"},body),shoeR=el("ellipse",{rx:24,ry:13,fill:o.shoe||"#333"},body);
  if(o.dress) el("path",{d:"M-70 -150 L70 -150 L95 -40 L-95 -40 Z",fill:o.dress},body);
  else el("rect",{x:-62,y:-175,width:124,height:60,rx:16,fill:o.shorts},body);
  el("rect",{x:-62,y:-300,width:124,height:150,rx:36,fill:o.shirt},body);
  if(o.dots) [[-30,-260],[20,-230],[-15,-190],[35,-280],[30,-175]].forEach(([x,y])=>el("circle",{cx:x,cy:y,r:7,fill:"#fff",opacity:.9},body));
  const armL=el("line",{stroke:o.skin,"stroke-width":26,"stroke-linecap":"round"},body),armR=el("line",{stroke:o.skin,"stroke-width":26,"stroke-linecap":"round"},body);
  const handItem=el("g",{},body), items={};
  const head=el("g",{},body);
  if(o.pigtails){el("circle",{cx:-112,cy:-430,r:38,fill:o.hair},head);el("circle",{cx:112,cy:-430,r:38,fill:o.hair},head);
    [-1,1].forEach(s=>el("path",{d:`M${s*90} -470 l${s*30} -18 l${-s*4} 30 z`,fill:"#F06292"},head))}
  if(o.curls) [[-90,-470],[-55,-505],[-15,-520],[25,-518],[62,-500],[92,-468],[-100,-430],[100,-430]].forEach(([x,y])=>el("circle",{cx:x,cy:y,r:30,fill:o.hair},head));
  el("circle",{cx:0,cy:-400,r:105,fill:o.skin},head);
  el("path",{d:o.hairPath||"M-105 -410 Q-100 -520 0 -515 Q100 -520 105 -410 Q60 -470 0 -455 Q-60 -470 -105 -410Z",fill:o.hair},head);
  el("circle",{cx:-60,cy:-365,r:16,fill:"#FF8A80",opacity:.45},head);el("circle",{cx:60,cy:-365,r:16,fill:"#FF8A80",opacity:.45},head);
  const eyeW=[-36,36].map(x=>el("ellipse",{cx:x,cy:-405,rx:21,ry:25,fill:"#fff"},head));
  const pup=[-36,36].map(x=>el("circle",{cx:x,cy:-402,r:11,fill:"#1b1b1b"},head));
  const lids=[-36,36].map(x=>el("path",{d:`M${x-22} -404 Q${x} -390 ${x+22} -404`,stroke:"#3a2a1a","stroke-width":6,fill:"none",opacity:0},head));
  const brow=[-1,1].map(s=>el("line",{stroke:"#3a2a1a","stroke-width":9,"stroke-linecap":"round"},head));
  const mouth=el("ellipse",{cx:0,cy:-345,rx:20,ry:4,fill:"#7A1F1F"},head);
  const smile=el("path",{d:"M-34 -356 Q0 -318 34 -356",stroke:"#7A1F1F","stroke-width":8,fill:"none","stroke-linecap":"round",opacity:0},head);
  const grin=el("g",{opacity:0},head);el("path",{d:"M-48 -362 Q0 -296 48 -362 Z",fill:"#7A1F1F"},grin);
  el("rect",{x:-40,y:-362,width:34,height:13,fill:"#fff"},grin);el("rect",{x:6,y:-362,width:34,height:13,fill:"#fff"},grin);
  const hmm=el("path",{d:"M-26 -342 Q-6 -350 24 -338",stroke:"#7A1F1F","stroke-width":8,fill:"none","stroke-linecap":"round",opacity:0},head);
  if(o.glasses==="round"){const gl=el("g",{},head);[-38,38].forEach(x=>el("circle",{cx:x,cy:-405,r:33,fill:"rgba(255,255,255,.12)",stroke:"#111","stroke-width":9},gl));el("line",{x1:-6,y1:-410,x2:6,y2:-410,stroke:"#111","stroke-width":7},gl)}
  if(o.items){
    if(o.items.includes("mic")){const it=items.mic=el("g",{},handItem);el("rect",{x:-9,y:-70,width:18,height:80,rx:6,fill:"#424242"},it);el("circle",{cx:0,cy:-82,r:24,fill:"#9E9E9E",stroke:"#424242","stroke-width":4},it)}
    if(o.items.includes("palm")){const it=items.palm=el("g",{},handItem);txt("✋",{x:0,y:-8,"font-size":78,"text-anchor":"middle","dominant-baseline":"central"},it)}
    if(o.items.includes("point")){const it=items.point=el("g",{},handItem);txt("👉",{x:14,y:-6,"font-size":70,"text-anchor":"middle","dominant-baseline":"central"},it)}
    if(o.items.includes("stick")){const it=items.stick=el("g",{},handItem);el("line",{x1:0,y1:10,x2:0,y2:-150,stroke:"#8D6E63","stroke-width":9,"stroke-linecap":"round"},it);el("circle",{cx:0,cy:-152,r:8,fill:"#FAFAFA"},it)}
  }
  const st={x:0,y:0,s:1,flip:1,rot:0,walk:0,armL:200,armR:160,lenL:115,lenR:115,talk:0,brow:"n",look:0,lookY:0,blink:0,hop:0,item:"",itemRot:0,
            smile:0,grin:0,hmm:0,shut:0,jaw:0,headRot:0,vis:1};
  function draw(){
    const k=st; g.setAttribute("transform",`translate(${k.x},${k.y-k.hop}) rotate(${k.rot}) scale(${k.s*k.flip},${k.s})`); g.style.opacity=k.vis;
    head.setAttribute("transform",`rotate(${k.headRot} 0 -300)`);
    const sw=Math.sin(k.walk)*28, ll=150;
    [[legL,shoeL,-28,sw],[legR,shoeR,28,-sw]].forEach(([l,sh,hx,a])=>{const r=a*Math.PI/180,x2=hx+Math.sin(r)*ll,y2=-150+Math.cos(r)*ll;
      l.setAttribute("x1",hx);l.setAttribute("y1",-150);l.setAttribute("x2",x2);l.setAttribute("y2",y2);sh.setAttribute("cx",x2+8);sh.setAttribute("cy",y2)});
    [[armL,-58,k.armL,k.lenL],[armR,58,k.armR,k.lenR]].forEach(([a,sx,deg,len])=>{const r=deg*Math.PI/180;a.setAttribute("x1",sx);a.setAttribute("y1",-280);
      a.setAttribute("x2",sx+Math.sin(r)*len);a.setAttribute("y2",-280-Math.cos(r)*len)});
    const r=k.armR*Math.PI/180; handItem.setAttribute("transform",`translate(${58+Math.sin(r)*(k.lenR+3)},${-280-Math.cos(r)*(k.lenR+3)}) rotate(${k.itemRot})`);
    for(const n in items) items[n].style.opacity=k.item===n?1:0;
    const open=Math.max(k.talk,k.jaw), quiet=open<0.15;
    mouth.setAttribute("ry",3+22*open+18*k.jaw); mouth.setAttribute("rx",18+6*open);
    mouth.style.opacity=quiet&&(k.grin||k.smile||k.hmm)?0:1;
    smile.style.opacity=k.smile&&quiet&&!k.grin?1:0; grin.style.opacity=k.grin&&quiet?1:0; hmm.style.opacity=k.hmm&&quiet&&!k.smile&&!k.grin?1:0;
    const closed=k.blink||k.shut; eyeW.forEach(e=>e.setAttribute("ry",closed?2:25*(1+0.2*k.jaw))); lids.forEach(l=>l.style.opacity=closed?1:0);
    pup.forEach((p,i)=>{p.setAttribute("cx",(i?36:-36)+k.look*8);p.setAttribute("cy",-402+k.lookY*8);p.style.opacity=closed?0:1});
    brow.forEach((b,i)=>{const s=i?1:-1,B={a:[-424,-446],s:[-452,-432],u:[-462,-458],n:[-440,-440],q:i?[-468,-462]:[-436,-440]}[k.brow];
      b.setAttribute("x1",s*14);b.setAttribute("y1",B[0]);b.setAttribute("x2",s*58);b.setAttribute("y2",B[1])});
  }
  function aimLocal(side,lx,ly,len){const sx=side==="L"?-58:58,dx=lx-sx,dy=ly+280,d=Math.hypot(dx,dy);const a=Math.atan2(dx,-dy)*180/Math.PI;
    if(side==="L"){st.armL=a;st.lenL=len||Math.min(d,140)}else{st.armR=a;st.lenR=len||Math.min(d,140)}}
  function aim(side,wx,wy,len){const lx=(wx-st.x)/(st.s*st.flip), ly=(wy-(st.y-st.hop))/st.s; aimLocal(side,lx,ly,len)}
  return {st,draw,g,aim,aimLocal};
}

// ======================= the world (wide shot) =======================
const PK=[545,688];   // the hilltop
{const g=el("linearGradient",{id:"sky",gradientUnits:"userSpaceOnUse",x1:0,y1:-300,x2:0,y2:1270},defs);
 ["s0","s1","s2"].forEach((id,i)=>el("stop",{id,offset:[0,0.62,1][i],"stop-color":"#000"},g));
 const rg=el("radialGradient",{id:"fglow"},defs); el("stop",{offset:0,"stop-color":"#FFE9A8","stop-opacity":1},rg); el("stop",{offset:0.25,"stop-color":"#FFB547","stop-opacity":0.75},rg); el("stop",{offset:1,"stop-color":"#FF7A2A","stop-opacity":0},rg);
 const lg=el("radialGradient",{id:"lglow"},defs); el("stop",{offset:0,"stop-color":"#FFE08A","stop-opacity":1},lg); el("stop",{offset:1,"stop-color":"#FF9A3C","stop-opacity":0},lg);
 const wg=el("linearGradient",{id:"warm",x1:0,y1:0,x2:0,y2:1},defs); el("stop",{offset:0,"stop-color":"#FFB35C","stop-opacity":0},wg); el("stop",{offset:0.45,"stop-color":"#FFB35C","stop-opacity":0.5},wg); el("stop",{offset:1,"stop-color":"#FF8A3C","stop-opacity":0.08},wg);
 const bl=el("filter",{id:"blur8",x:"-20%",y:"-50%",width:"140%",height:"200%"},defs); el("feGaussianBlur",{stdDeviation:8},bl);}
const skyR=el("rect",{x:-700,y:-700,width:2480,height:2000,fill:"url(#sky)"},W);
const stars=el("g",{},W); const STARS=[...Array(80)].map((_,i)=>el("circle",{cx:-200+hash(i)*1480,cy:-250+hash(i+99)*1050,r:1.5+hash(i+7)*2.6,fill:"#FFF8E1"},stars));
const farH=el("path",{d:"M-700 1265 L-700 1120 Q-420 1040 -180 1110 Q60 1170 240 1150 L900 1150 Q1080 1100 1300 1060 Q1560 1020 1780 1120 L1780 1265 Z"},W);
const HILL_D="M-420 1268 L-160 1196 C40 1120 210 960 380 812 C440 762 500 690 545 688 C600 690 650 742 712 800 C840 920 1000 1062 1200 1150 L1500 1268 Z";
const hillG=el("g",{},W);
const flameBack=el("g",{opacity:0},W);   // the big glow sits behind the hill's rim
el("circle",{cx:PK[0],cy:PK[1],r:520,fill:"url(#fglow)"},flameBack);
const hill=el("path",{d:HILL_D},hillG);
const hillFace=el("path",{d:"M-160 1196 C40 1120 210 960 380 812 C440 762 500 690 545 688 C520 760 470 860 420 1000 C380 1110 300 1200 200 1268 L-420 1268 Z",opacity:.5},hillG);
const hillRim=el("path",{d:"M60 1120 C210 960 380 812 440 762 C500 690 545 688 545 688 C600 690 650 742 712 800 C840 920 1000 1062 1100 1110",fill:"none",stroke:"#FFB547","stroke-width":7,opacity:0,"stroke-linecap":"round"},hillG);
// the flame on the hilltop
const flameG=el("g",{transform:`translate(${PK[0]},${PK[1]})`},W);
const fHalo=el("circle",{cx:0,cy:-30,r:150,fill:"url(#lglow)",opacity:0},flameG);
const fOuter=el("path",{d:"M0 -170 C30 -120 62 -70 50 -30 C40 0 20 10 0 10 C-20 10 -40 0 -50 -30 C-62 -70 -30 -120 0 -170 Z",fill:"#FF8A2A",stroke:"#C2410C","stroke-width":4},flameG);
const fInner=el("path",{d:"M0 -110 C18 -80 32 -50 26 -26 C20 -8 10 -2 0 -2 C-10 -2 -20 -8 -26 -26 C-32 -50 -18 -80 0 -110 Z",fill:"#FFE27A"},flameG);
el("path",{d:"M-70 6 Q0 34 70 6 L58 24 Q0 44 -58 24 Z",fill:"#5A3A22",stroke:INK,"stroke-width":4},flameG);   // a plain cauldron rim (no ritual detail)
// ground, the walking band, the road, the rail track
const ground=el("rect",{x:-700,y:1262,width:2480,height:1200},W);
const band=el("path",{d:"M-700 1262 L1780 1262 L1780 1345 L-700 1345 Z",opacity:.55},W);
const track=el("g",{},W); el("rect",{x:-700,y:1238,width:2480,height:6,fill:"#4A4560"},track); for(let x=-700;x<1780;x+=34) el("rect",{x,y:1240,width:8,height:10,fill:"#3A3550"},track);
const road=el("rect",{x:-700,y:1360,width:2480,height:92},W);
const roadLine=el("g",{},W); for(let x=-700;x<1780;x+=120) el("rect",{x,y:1402,width:60,height:6,fill:"#C9B98A",opacity:.6},roadLine);
// the 14-km loop around the hill (back arc faint, front arc bright), walkers along the front
const loopG=el("g",{opacity:0});
const LB="M10 1190 A530 120 0 0 1 1070 1190", LF="M1070 1190 A530 120 0 0 1 10 1190";
const loopBack=el("path",{d:LB,fill:"none",stroke:"#FFD54F","stroke-width":6,opacity:.45,pathLength:1,"stroke-dasharray":"0 1","stroke-linecap":"round"},loopG);
const loopGlow=el("path",{d:LF,fill:"none",stroke:"#FFB547","stroke-width":26,opacity:.6,filter:"url(#blur8)",pathLength:1,"stroke-dasharray":"0 1"},loopG);
const loopFront=el("path",{d:LF,fill:"none",stroke:"#FFE082","stroke-width":11,pathLength:1,"stroke-dasharray":"0 1","stroke-linecap":"round"},loopG);
const loopDot=el("circle",{r:16,fill:"#FFF3C4",stroke:"#FF9A3C","stroke-width":5},loopG);
const loopWalk=el("g",{},loopG);

// a walker seen from behind (origin at the feet, ~140 px tall), optional little lamp
const CC=["#7A3B52","#3E5C76","#8A6A3C","#5B4B7A","#2F6B5E","#9A4E2E","#6E6E7E","#B07A2A","#A33B3B","#3F6E8C"];
function makeWalker(parent,k){
  const g=el("g",{},parent), c=CC[k%CC.length], saree=hash(k+3)<0.45;
  const lg=[-1,1].map(s=>el("rect",{x:s*9-6,y:-34,width:12,height:34,rx:5,fill:"#2A1E1A"},g));
  if(saree) el("path",{d:"M-26 -96 L26 -96 L32 -6 L-32 -6 Z",fill:c},g); else { el("path",{d:"M-24 -98 L24 -98 L22 -40 L-22 -40 Z",fill:c},g); el("rect",{x:-20,y:-44,width:40,height:14,fill:"#EDE6D6"},g) }   // shirt + white dhoti/veshti
  if(saree) el("path",{d:"M-26 -96 L6 -96 L-30 -20 Z",fill:mixc(c,"#FFD54F",0.35)},g);
  const head=el("g",{},g);
  el("circle",{cx:0,cy:-112,r:17,fill:"#16100C"},head);
  if(saree) el("circle",{cx:0,cy:-106,r:9,fill:"#16100C"},head);
  const lamp=hash(k+11)<0.45?el("g",{},g):null;
  if(lamp){ el("circle",{cx:0,cy:0,r:22,fill:"url(#lglow)"},lamp); el("circle",{cx:0,cy:0,r:5,fill:"#FFF3C4"},lamp) }
  return {g,lg,head,lamp,ph:hash(k+5)*6.28}}
const ROWS=[{y:1270,s:.32,n:30,v:26},{y:1303,s:.40,n:24,v:32},{y:1340,s:.48,n:18,v:40}];
const crowd=[]; const crowdG=el("g",{},W);
ROWS.forEach((R,ri)=>{const rg=el("g",{},crowdG); for(let k=0;k<R.n;k++){const w=makeWalker(rg,k+ri*40); w.x0=k*(1480/R.n)+hash(k+ri*7)*30-200; w.R=R; crowd.push(w)}});
W.appendChild(loopG);
const warmOv=el("rect",{x:-700,y:700,width:2480,height:1000,fill:"url(#warm)",opacity:0},W);

// buses (plain, no text) and a train (no text)
function makeBus(parent,k){
  const g=el("g",{},parent), c=["#E8E1CF","#D9C27A","#9FC2C9","#E2B38C"][k%4], st=["#2F6B5E","#A33B3B","#3E5C76","#7A3B52"][k%4];
  el("rect",{x:0,y:-120,width:300,height:104,rx:18,fill:c,stroke:INK,"stroke-width":5},g);
  el("rect",{x:4,y:-50,width:292,height:12,fill:st},g);
  for(let i=0;i<5;i++) el("rect",{x:18+i*52,y:-106,width:42,height:40,rx:6,fill:"#FFE9A8",stroke:INK,"stroke-width":3},g);
  el("rect",{x:272,y:-106,width:22,height:52,rx:5,fill:"#BFE3F0",stroke:INK,"stroke-width":3},g);
  el("circle",{cx:292,cy:-30,r:7,fill:"#FFF8C4"},g);
  [60,236].forEach(x=>{el("circle",{cx:x,cy:-14,r:22,fill:"#1A1A1A",stroke:INK,"stroke-width":4},g); el("circle",{cx:x,cy:-14,r:8,fill:"#9E9E9E"},g)});
  return g}
const busG=el("g",{},W); const BUS=[...Array(12)].map((_,k)=>makeBus(busG,k));
const trainG=el("g",{},W);
{for(let k=0;k<6;k++){const x=k*236, c=k?"#C9B27A":"#8B2E2E";
  el("rect",{x,y:-74,width:228,height:66,rx:k?8:22,fill:c,stroke:INK,"stroke-width":5},trainG);
  if(k){for(let i=0;i<5;i++) el("rect",{x:x+16+i*42,y:-64,width:30,height:24,rx:4,fill:"#FFE9A8",stroke:INK,"stroke-width":2.5},trainG); el("rect",{x,y:-30,width:228,height:8,fill:"#7A3B2E"},trainG)}
  else {el("rect",{x:x+14,y:-64,width:56,height:28,rx:6,fill:"#BFE3F0",stroke:INK,"stroke-width":3},trainG); el("circle",{cx:x+10,cy:-24,r:7,fill:"#FFF8C4"},trainG)}
  [x+40,x+188].forEach(cx=>el("circle",{cx,cy:-6,r:11,fill:"#1A1A1A",stroke:INK,"stroke-width":3},trainG))}}
// CCTV poles
const PX=[175,395,690,905], poles=PX.map((x,k)=>{const g=el("g",{},W);
  el("path",{d:`M${x+(k%2?-30:30)} 1046 L${x+(k%2?-260:260)} 1250 L${x+(k%2?-110:110)} 1262 Z`,fill:"#E3F2FD",opacity:.12},g);   // view cone
  el("rect",{x:x-7,y:1010,width:14,height:440,fill:"#5D6470",stroke:INK,"stroke-width":3},g);
  el("rect",{x:x-(k%2?62:-8),y:1008,width:54,height:10,fill:"#5D6470"},g);
  const hd=el("g",{transform:`translate(${x+(k%2?-58:58)},1030) scale(${k%2?-1:1},1)`},g);
  el("rect",{x:-34,y:-18,width:68,height:36,rx:8,fill:"#ECEFF1",stroke:INK,"stroke-width":4},hd); el("circle",{cx:34,cy:0,r:12,fill:"#263238",stroke:INK,"stroke-width":3},hd);
  const led=el("circle",{cx:-20,cy:-6,r:6,fill:"#FF3B30"},hd); return {g,led}});
// map pin
const pinG=el("g",{opacity:0},W);
const pinRing=el("ellipse",{cx:0,cy:0,rx:40,ry:12,fill:"none",stroke:"#FFD54F","stroke-width":5},pinG);
const pinB=el("g",{},pinG); el("path",{d:"M0 0 C-14 -30 -46 -56 -46 -92 A46 46 0 0 1 46 -92 C46 -56 14 -30 0 0 Z",fill:"#E53935",stroke:INK,"stroke-width":6},pinB); el("circle",{cx:0,cy:-92,r:17,fill:"#fff"},pinB);
const PIN=[790,1262];

// ======================= the family on the path (L8-L9) =======================
const FAM=el("g",{},svg);   // screen-space scene drawn over the world
const famSky=el("rect",{x:0,y:0,width:1080,height:1920,fill:"url(#sky)"},FAM);
const famStars=el("g",{},FAM); for(let i=0;i<40;i++) el("circle",{cx:hash(i+300)*1080,cy:hash(i+400)*700,r:1.5+hash(i+500)*2,fill:"#FFF8E1",opacity:.8},famStars);
const famHill=el("path",{d:"M300 1190 C480 1060 640 860 760 760 C800 728 830 716 860 716 C900 718 940 750 990 800 C1080 890 1160 990 1300 1100 L1300 1200 L300 1200 Z"},FAM);
const famGround=el("rect",{x:0,y:1170,width:1080,height:760},FAM);
const famPath=el("path",{d:"M-100 1290 L1180 1290 L1180 1600 L-100 1600 Z",opacity:.6},FAM);
const famBg=el("g",{},FAM);   // tent + food stall + far walkers (scroll)
function makeTent(parent){const g=el("g",{},parent);
  el("path",{d:"M-130 0 L-110 -120 L0 -170 L110 -120 L130 0 Z",fill:"#F5F5F0",stroke:INK,"stroke-width":5},g); el("path",{d:"M-30 0 L0 -90 L30 0 Z",fill:"#CFD8DC",stroke:INK,"stroke-width":4},g);
  el("rect",{x:-14,y:-150,width:28,height:70,fill:"#2E9D5B"},g); el("rect",{x:-35,y:-129,width:70,height:28,fill:"#2E9D5B"},g); return g}
function makeLeaf(parent,steam=true){const g=el("g",{},parent);
  el("path",{d:"M-70 0 Q-60 -26 0 -30 Q60 -26 74 0 Q60 22 0 24 Q-60 22 -70 0 Z",fill:"#3FA34D",stroke:"#1E5E2A","stroke-width":4},g); el("path",{d:"M-66 0 L70 0",stroke:"#7CC576","stroke-width":3},g);
  el("ellipse",{cx:-10,cy:-6,rx:30,ry:14,fill:"#FFFDF5",stroke:"#C9C2B0","stroke-width":2},g); el("ellipse",{cx:34,cy:-2,rx:16,ry:9,fill:"#F2A33A"},g); el("ellipse",{cx:-44,cy:2,rx:13,ry:8,fill:"#C0392B"},g);
  const st=el("g",{},g); if(steam) [-20,0,20].forEach((x,i)=>el("path",{d:`M${x} -30 q-12 -22 0 -42 q12 -20 0 -40`,fill:"none",stroke:"#FFFFFF","stroke-width":5,"stroke-linecap":"round",opacity:.7},st));
  return {g,st}}
const famTent=makeTent(famBg); const famStall=el("g",{},famBg);
el("rect",{x:-120,y:-90,width:240,height:16,fill:"#8D6E63",stroke:INK,"stroke-width":4},famStall); el("rect",{x:-110,y:-74,width:12,height:74,fill:"#6D4C41"},famStall); el("rect",{x:98,y:-74,width:12,height:74,fill:"#6D4C41"},famStall);
el("path",{d:"M-140 -150 L140 -150 L120 -200 L-120 -200 Z",fill:"#F2B53A",stroke:INK,"stroke-width":4},famStall);
el("rect",{x:-110,y:-150,width:10,height:60,fill:"#6D4C41"},famStall); el("rect",{x:100,y:-150,width:10,height:60,fill:"#6D4C41"},famStall);
const famLeaf=[makeLeaf(famStall),makeLeaf(famStall)]; famLeaf[0].g.setAttribute("transform","translate(-55,-100) scale(.7)"); famLeaf[1].g.setAttribute("transform","translate(55,-100) scale(.7)");
const famWalk=[...Array(9)].map((_,k)=>{const w=makeWalker(famBg,k+90); w.x0=k*150; return w});
const stones=el("g",{},FAM); const STN=[...Array(14)].map((_,k)=>el("ellipse",{cx:0,cy:0,rx:18+hash(k)*16,ry:8+hash(k+1)*5,fill:"#4A4560",opacity:.9},stones));
const AMMAMMA_OPT={skin:"#B98060",hair:"#C9C9C9",shirt:"#7B1E2B",saree:{base:"#F4F1E8",pallu:"#F7F4EC",border:"#7B1E2B",bw:11},sleeve:"#7B1E2B",fore:"#B98060",bun:true,noFlowers:true,glasses:"#6D4C41",round:true,lines:true,old:true,bindi:true,brow:4.5,browCol:"#9E9E9E",lash:3.5,blush:0.2,lip:"#8A4A40"};   // cast.md (17 Nov)
const famPpl=el("g",{},FAM);
const AM=makeAdult({...AMMAMMA_OPT,floor:"#B98060",parent:famPpl});
{const bag=el("g",{},AM.g); el("path",{d:"M60 -268 L112 -70",stroke:"#8D5A2B","stroke-width":9,fill:"none"},bag);
 el("path",{d:"M78 -86 L150 -86 L156 10 Q118 26 74 10 Z",fill:"#E8C27A",stroke:INK,"stroke-width":5},bag); el("path",{d:"M80 -60 L152 -60",stroke:"#B5651D","stroke-width":5},bag)}   // cloth bag
const PINKY=makeChar({parent:famPpl,skin:"#D49A6A",hair:"#2b1a10",shirt:"#EC407A",dress:"#F48FB1",dots:true,pigtails:true,shoe:"#D49A6A"});   // house look, barefoot
const famWarm=el("rect",{x:0,y:0,width:1080,height:1920,fill:"#FF9A3C",opacity:0},FAM);

// ======================= HTML overlays =======================
// counter icons
const cic=$("cic"), ICON={};
const ic=n=>{const g=el("g",{},cic); ICON[n]=g; return g};
{let g=ic("people"); [[-40,10,"#7A3B52"],[40,10,"#3E5C76"],[0,-4,"#B07A2A"]].forEach(([x,y,c])=>{el("path",{d:`M${x-28} ${y+60} Q${x-28} ${y+4} ${x} ${y+4} Q${x+28} ${y+4} ${x+28} ${y+60} Z`,fill:c,stroke:INK,"stroke-width":4},g); el("circle",{cx:x,cy:y-22,r:20,fill:"#16100C",stroke:INK,"stroke-width":3},g)});
 g=ic("bus"); const b=makeBus(g,1); b.setAttribute("transform","translate(-70,40) scale(.47)");
 g=ic("train"); el("rect",{x:-66,y:-30,width:132,height:58,rx:12,fill:"#8B2E2E",stroke:INK,"stroke-width":5},g); el("rect",{x:-54,y:-20,width:40,height:24,rx:4,fill:"#BFE3F0",stroke:INK,"stroke-width":3},g); el("rect",{x:2,y:-20,width:46,height:24,rx:4,fill:"#FFE9A8",stroke:INK,"stroke-width":3},g); [-40,40].forEach(x=>el("circle",{cx:x,cy:34,r:11,fill:"#1A1A1A"},g)); el("rect",{x:-70,y:44,width:140,height:6,fill:"#9E9E9E"},g);
 g=ic("cap"); el("path",{d:"M-58 4 Q-60 -48 0 -52 Q60 -48 58 4 Z",fill:"#C2A36B",stroke:INK,"stroke-width":5},g); el("rect",{x:-58,y:-6,width:116,height:20,fill:"#5A4220",stroke:INK,"stroke-width":4},g); el("path",{d:"M-62 14 Q0 44 62 14 L62 22 Q0 56 -62 22 Z",fill:"#1A1A1A",stroke:INK,"stroke-width":3},g); el("circle",{cx:0,cy:-24,r:13,fill:"#F2C94C",stroke:INK,"stroke-width":3},g);
 g=ic("cctv"); el("rect",{x:-8,y:-10,width:16,height:76,fill:"#5D6470",stroke:INK,"stroke-width":3},g); el("rect",{x:-56,y:-46,width:96,height:44,rx:9,fill:"#ECEFF1",stroke:INK,"stroke-width":5},g); el("circle",{cx:40,cy:-24,r:14,fill:"#263238",stroke:INK,"stroke-width":3},g); ICON.led=el("circle",{cx:-36,cy:-34,r:7,fill:"#FF3B30"},g);
 g=ic("path"); el("ellipse",{cx:0,cy:24,rx:64,ry:26,fill:"none",stroke:"#FFE082","stroke-width":9},g); el("path",{d:"M-52 30 Q-30 -4 -8 -34 Q0 -42 8 -34 Q30 -4 52 30 Z",fill:"#3A3355",stroke:INK,"stroke-width":4},g); el("ellipse",{cx:0,cy:24,rx:64,ry:26,fill:"none",stroke:"#FFE082","stroke-width":9,"stroke-dasharray":"0 0"},g);
 g=ic("tent"); const tt=makeTent(g); tt.setAttribute("transform","translate(0,50) scale(.5)");
 g=ic("plate"); const lf=makeLeaf(g); lf.g.setAttribute("transform","translate(0,26) scale(.95)")}
// police caps card
{const C=$("capsv"); window.CAPS=[]; for(let r=0;r<3;r++) for(let c=0;c<6;c++){const g=el("g",{},C); const x=70+c*126, y=64+r*96;
  const in_=el("g",{},g); el("path",{d:"M-44 4 Q-46 -36 0 -40 Q46 -36 44 4 Z",fill:"#C2A36B",stroke:INK,"stroke-width":4},in_); el("rect",{x:-44,y:-4,width:88,height:15,fill:"#5A4220",stroke:INK,"stroke-width":3},in_);
  el("path",{d:"M-48 11 Q0 34 48 11 L48 17 Q0 44 -48 17 Z",fill:"#1A1A1A"},in_); el("circle",{cx:0,cy:-18,r:10,fill:"#F2C94C",stroke:INK,"stroke-width":2.5},in_);
  CAPS.push({g,x,y})}}
// lamp rail (bottom lamp = fact 1 ... top lamp = the flame)
const RL=$("rail"); el("rect",{x:4,y:4,width:84,height:712,rx:42,fill:"rgba(10,12,28,.62)",stroke:"rgba(255,213,79,.55)","stroke-width":4},RL);
const LAMPS=[...Array(6)].map((_,i)=>{const y=650-i*118, g=el("g",{transform:`translate(46,${y})`},RL);
  const glow=el("circle",{cx:0,cy:-16,r:44,fill:"url(#lglowR)",opacity:0},g);
  el("path",{d:"M-30 -6 Q0 30 30 -6 Q20 -12 0 -12 Q-20 -12 -30 -6 Z",fill:"#B5651D",stroke:INK,"stroke-width":4},g);
  el("path",{d:"M24 -8 L36 -16",stroke:"#B5651D","stroke-width":6,"stroke-linecap":"round"},g);
  const wick=el("line",{x1:0,y1:-12,x2:0,y2:-20,stroke:"#3E2723","stroke-width":4},g);
  const fl=el("path",{d:"M0 -58 C10 -44 16 -30 12 -20 C8 -12 4 -10 0 -10 C-4 -10 -8 -12 -12 -20 C-16 -30 -10 -44 0 -58 Z",fill:"#FFB547",stroke:"#E8762B","stroke-width":3,opacity:0},g);
  return {g,glow,fl}});
{const d=el("defs",{},RL); const lg=el("radialGradient",{id:"lglowR"},d); el("stop",{offset:0,"stop-color":"#FFE08A","stop-opacity":1},lg); el("stop",{offset:1,"stop-color":"#FF9A3C","stop-opacity":0},lg)}
// comment bubbles (L10)
const CB=[["Ravi","చేశా! 🙏","#1E88E5",150,960],["Sneha","ఈ సారి తప్పకుండా 🪔","#D81B60",420,1090],["Kiran","3 సార్లు! 🙌","#2E7D32",170,1225]];
$("cbs").innerHTML=CB.map(([n,g,c,x,y],i)=>`<div class="cb" id="cb${i}" style="left:${x}px;top:${y}px"><b style="color:${c}">${n}</b><i>${g}</i></div>`).join("");

// ======================= timeline =======================
const COLORS={gopi:"#F5B347",pinky:"#F48FB1",ammamma:"#FFCC80"}, NAMES={gopi:"GOPI",pinky:"PINKY",ammamma:"AMMAMMA"};
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
  B.hook1=2.3; B.md0=S(1)+0.35; B.push0=S(1)-0.1; B.push1=E(1)+0.1;
  B.wide2=S(2)-0.12; B.pin=S(2)+0.1; B.rail=S(2)+0.3; B.src=S(2);
  B.bus0=S(3)-0.35; B.train=at(3,"పదహారు")-0.45; B.caps=S(4)+0.05; B.cctv=at(4,"పదకొండు")-0.2; B.busEnd=S(5)+0.4;
  B.fol0=S(5)-0.12; B.tF=at(5,"follow")-0.05; B.tS=B.tF+0.45; B.fol1=E(5)+0.25;
  B.loop0d=S(6)-0.1; B.loop1d=E(6)-0.2;
  B.fam0=S(7)-0.32; B.fam1=E(8)+0.22; B.tAkali=at(7,"ఆకలి")-0.05; B.pat=S(8)+0.15;
  B.cq=S(9)-0.05; B.cb=CB.map((_,i)=>at(9,"Comment")-0.25+i*0.33); B.cq1=E(9)+0.3;
  B.dusk0=S(9)-0.2; B.dusk1=S(10)+0.8; B.turn=S(10); B.fl=E(10)+0.35; B.share=S(11)-0.05; B.tShare=at(11,"పంపండి");
  B.end0=E(11)+0.06; B.tEF=B.end0+0.5; B.loop0=TL.dur-1.1;
  B.CE=[{t0:at(0,"యాభై")-0.12,show:0,end:S(1)-0.08,to:5000000,lab:"DEVOTEES EXPECTED",ic:"people"},
        {t0:S(3)-0.05,end:B.train+0.35,to:4877,lab:"BUSES · 23–25 NOV",ic:"bus"},
        {t0:B.train+0.35,end:E(3)+0.2,to:16,lab:"SPECIAL TRAINS",ic:"train"},
        {t0:S(4)-0.05,end:B.cctv+0.15,to:15500,suf:"+",lab:"POLICE",ic:"cap"},
        {t0:B.cctv+0.15,end:E(4)+0.15,to:1100,pre:"~",lab:"CCTV CAMERAS",ic:"cctv"},
        {t0:at(6,"పద్నాలుగు")-0.1,end:E(6)+0.15,to:14,suf:" KM",lab:'<span class="te">గిరి ప్రదక్షిణ దారి</span>',ic:"path"},
        {t0:at(8,"నూట")-0.12,end:at(8,"రెండు")-0.12,to:120,lab:"MEDICAL CAMPS",ic:"tent"},
        {t0:at(8,"రెండు")-0.12,end:E(8)+0.2,to:288,lab:"FREE FOOD SPOTS",ic:"plate"}];
  B.CE.forEach(c=>{c.cnt=c.show===0?0.9:0.75; if(c.show===undefined) c.show=c.t0});
  B.lamps=[E(3)-0.3,E(4)-0.25,E(6)-0.35,at(8,"నూట")+0.55,at(8,"రెండు")+0.75,at(10,"ఒక్క")-0.1];
  B.ticks=B.CE.map(c=>[c.t0,c.t0+c.cnt]);
  return B}

const focus=(z,wx,wy,sx=540,sy=960)=>({z,fx:wx-(sx-540)/z,fy:wy-(sy-960)/z});
const mixCam=(a,b_,k)=>({z:lerp(a.z,b_.z,k),fx:lerp(a.fx,b_.fx,k),fy:lerp(a.fy,b_.fy,k)});
let curSkin=""; function skinTo(s){ if(s!==curSkin){ setSkin(s); curSkin=s } }
const SUBS={0:"ఒక్క దీపం కోసం...<br>50 లక్షల మంది!",1:"ఈ సాయంత్రం Arunachalam<br>కొండ మీద... Maha Deepam.",2:"ఊరు Tiruvannamalai...<br>ఇంత మందిని ఎలా manage చేస్తారు?",
  3:"4,877 buses...<br>16 special trains!",4:"15,500 కి పైగా police...<br>1,100 CCTV cameras!",5:"ఇలాంటి behind-the-scenes<br>కావాలంటే... follow చేయండి!",
  6:"కొండ చుట్టూ 14 km...<br>గిరి ప్రదక్షిణ దారి.",7:"అమ్మమ్మా...<br>కాళ్ళు నొప్పి! ఆకలి!",8:"భయం లేదు... 120 medical camps,<br>288 చోట్ల free భోజనం.",
  9:"మీరు గిరి ప్రదక్షిణ చేశారా?<br>Comment లో చెప్పండి!",10:"సాయంత్రం... 50 లక్షల మంది...<br>ఒక్క దీపం వైపు.",11:"Arunachalam వెళ్ళే మీ వాళ్ళకి<br>పంపండి... follow చేయండి!"};
const fmtIN=n=>Math.round(n).toLocaleString("en-IN");
function show(id,on,s=1,extra=""){const e=$(id); e.style.opacity=on?1:0; if(on) e.style.transform=`${extra} scale(${Math.max(0.01,s)})`}

function frame(t){
  const b=beats();
  const loop=t>=b.loop0, lt=loop?t-b.loop0:t;          // the loop shot = frame 1 (night, wide, counter at 0)
  const fam=!loop&&t>=b.fam0&&t<b.fam1;
  skinTo("flat");
  // ---------- palette: night -> dusk ----------
  const dk=loop?0:ease((t-b.dusk0)/(b.dusk1-b.dusk0));
  const fk=loop?0:out((t-b.fl)/0.7), gk=loop?0:ease((t-b.fl-0.15)/1.8);
  $("s0").setAttribute("stop-color",mixc("#070B24","#2A2152",dk)); $("s1").setAttribute("stop-color",mixc("#18204A","#B4527A",dk)); $("s2").setAttribute("stop-color",mixc("#2B3366","#F39A5B",dk));
  STARS.forEach((s,i)=>s.setAttribute("opacity",(1-dk*0.9)*(0.55+0.45*Math.sin(lt*2+i))));
  farH.setAttribute("fill",mixc("#1E2350","#5A3A6A",dk)); hill.setAttribute("fill",mixc("#141226","#231A33",dk)); hillFace.setAttribute("fill",mixc("#0C0B1A","#170F24",dk));
  ground.setAttribute("fill",mixc("#10132C","#2A1F3A",dk)); band.setAttribute("fill",mixc("#2A2B4E","#5A3E52",dk)); road.setAttribute("fill",mixc("#1A1C34","#2E2440",dk));
  // ---------- camera ----------
  const WIDE={z:1,fx:540,fy:960};
  let cm={z:1+0.012*lt,fx:540,fy:960};
  if(!loop){
    if(t>=b.push0&&t<b.wide2) cm=mixCam({z:1+0.012*b.push0,fx:540,fy:960},focus(1.55,PK[0],PK[1]+40,540,900),ease((t-b.push0)/(b.wide2-b.push0)));
    else if(t>=b.wide2&&t<b.loop0d) cm={z:1+0.006*(t-b.wide2),fx:540,fy:960};
    else if(t>=b.loop0d&&t<b.fam0) cm=mixCam(WIDE,{z:0.93,fx:540,fy:990},ease((t-b.loop0d)/0.8));
    else if(t>=b.fam1&&t<b.turn) cm={z:1+0.01*(t-b.fam1),fx:540,fy:960};
    else if(t>=b.turn) cm=mixCam({z:1+0.01*(b.turn-b.fam1),fx:540,fy:960},focus(1.22,PK[0],PK[1]+150,540,820),ease((t-b.turn)/(b.fl+1.4-b.turn)));
    // punch-ins on the counter hits
    let pz=0; b.CE.forEach(c=>{const k=t-(c.t0+c.cnt); if(k>0&&k<0.5) pz+=0.035*Math.sin(Math.PI*k/0.5)}); cm.z*=1+pz;
  }
  cam.setAttribute("transform",`translate(540,960) scale(${cm.z}) translate(${-cm.fx},${-cm.fy})`);
  // ---------- the flame ----------
  flameG.style.opacity=fk>0?1:0; flameG.setAttribute("transform",`translate(${PK[0]},${PK[1]}) scale(${(0.2+0.8*fk)*0.78})`);
  {const fl=1+0.06*Math.sin(t*17)+0.04*Math.sin(t*29); fOuter.setAttribute("transform",`scale(${1/fl*1.02},${fl})`); fInner.setAttribute("transform",`scale(1,${fl*0.98})`)}
  fHalo.setAttribute("opacity",fk); flameBack.setAttribute("opacity",gk*0.95); flameBack.setAttribute("transform",`translate(${PK[0]},${PK[1]}) scale(${0.4+0.8*gk}) translate(${-PK[0]},${-PK[1]})`);
  hillRim.setAttribute("opacity",gk*0.85); warmOv.setAttribute("opacity",gk*0.75);
  // ---------- crowd (walking; at L11 they stop and lift their lamps towards the hill) ----------
  const tw=loop?lt:(t<b.turn?t:b.turn+0.6*(1-Math.exp(-(t-b.turn)*1.7)));
  const lift=loop?0:ease((t-b.turn-0.3)/1.0);
  crowd.forEach((w,k)=>{const R=w.R; let x=w.x0+R.v*tw; x=((x+260)%1600+1600)%1600-260;
    const ph=tw*5.2+w.ph, bob=Math.abs(Math.sin(ph))*3*(1-lift);
    w.g.setAttribute("transform",`translate(${x},${R.y-bob}) scale(${R.s})`);
    w.lg.forEach((l,i)=>l.setAttribute("transform",`translate(0,${(i?1:-1)*Math.sin(ph)*4*(1-lift)})`));
    w.head.setAttribute("transform",`translate(0,${-lift*4})`);
    if(w.lamp){w.lamp.setAttribute("transform",`translate(${lerp(26,14,lift)},${lerp(-56,-150,lift)}) scale(${1+0.12*Math.sin(t*9+k)})`)}});
  // ---------- buses + train (L4..L5) ----------
  {const on=!loop&&t>=b.bus0&&t<b.busEnd; busG.style.display=on?"":"none";
   if(on){const fade=clamp((b.busEnd-t)/0.4); busG.setAttribute("opacity",fade); BUS.forEach((g,k)=>{const x=-360+(t-b.bus0)*420-k*380; g.style.display=x>-360&&x<1120?"":"none"; g.setAttribute("transform",`translate(${x},${1446+Math.sin(t*14+k)*1.2}) scale(.82)`)})}
   const tx=1120-(t-b.train)*700; trainG.style.display=!loop&&t>=b.train&&tx>-1500?"":"none"; trainG.setAttribute("transform",`translate(${tx},1240)`)}
  // ---------- CCTV poles (L5..) ----------
  poles.forEach((p,k)=>{const t0=b.cctv+k*0.12, on=!loop&&t>=t0&&t<b.loop0d; p.g.style.display=on?"":"none";
    if(on){p.g.setAttribute("transform",`translate(0,${(1-back((t-t0)/0.45))*480})`); p.g.setAttribute("opacity",clamp((b.loop0d-t)/0.3)); p.led.setAttribute("opacity",Math.sin(t*7+k)>0?1:0.2)}});
  // ---------- map pin (L3) ----------
  {const on=!loop&&t>=b.pin&&t<b.bus0; pinG.setAttribute("opacity",on?clamp((b.bus0-t)/0.3):0);
   const k=out((t-b.pin)/0.35), bounce=t>b.pin+0.35?Math.exp(-(t-b.pin-0.35)*8)*Math.sin((t-b.pin-0.35)*20)*14:0;
   pinG.setAttribute("transform",`translate(${PIN[0]},${PIN[1]})`); pinB.setAttribute("transform",`translate(0,${-(1-k)*700-Math.abs(bounce)})`);
   const rk=clamp((t-b.pin-0.33)/0.6); pinRing.setAttribute("transform",`scale(${1+rk*1.6})`); pinRing.setAttribute("opacity",t>b.pin+0.33?1-rk:0);
   const e=$("pinL"); e.style.opacity=on&&t>b.pin+0.25?clamp((b.bus0-t)/0.3):0; e.style.left="0px"; e.style.top="0px";
   e.style.transform=`translate(${540-e.offsetWidth/2}px,340px) scale(${Math.max(0.01,pop(t,b.pin+0.25,0.35))})`}
  // ---------- the 14-km loop (L7) ----------
  {const on=!loop&&t>=b.loop0d&&t<b.fam0+0.05; loopG.setAttribute("opacity",on?1:0);
   if(on){const k=ease((t-b.loop0d)/(b.loop1d-b.loop0d)), kf=clamp(k*2), kb=clamp(k*2-1);
     [loopFront,loopGlow].forEach(p=>p.setAttribute("stroke-dasharray",`${kf} 1`)); loopBack.setAttribute("stroke-dasharray",`${kb} 1`);
     const P=(kf<1?loopFront:loopBack), L=P.getTotalLength(), pt=P.getPointAtLength(L*(kf<1?kf:kb)); loopDot.setAttribute("cx",pt.x); loopDot.setAttribute("cy",pt.y);
     if(!loopWalk.childNodes.length) for(let i=0;i<9;i++){const w=makeWalker(loopWalk,200+i); w.u=i/9; loopWalk.W=(loopWalk.W||[]).concat([w])}
     loopWalk.W.forEach(w=>{const u=(w.u+(t-b.loop0d)*0.03)%1; const show_=u<kf; w.g.style.display=show_?"":"none"; const p=loopFront.getPointAtLength(L*u); w.g.setAttribute("transform",`translate(${p.x},${p.y+4}) scale(.27)`)})}}
  // ---------- the family on the path (L8-L9) ----------
  FAM.style.display=fam?"":"none";
  if(fam){const ft=t-b.fam0, sc=ft*70;
    famHill.setAttribute("fill","#16142A"); famGround.setAttribute("fill","#1A1A33"); famPath.setAttribute("fill","#3A3552");
    famTent.setAttribute("transform",`translate(${250-sc*0.5},1250) scale(.8)`); famStall.setAttribute("transform",`translate(${880-sc*0.5},1262) scale(.85)`);
    famLeaf.forEach((l,i)=>l.st.setAttribute("transform",`translate(0,${-((t*30+i*20)%20)})`));
    famWalk.forEach((w,k)=>{const x=((w.x0-sc*0.5)%1350+1350)%1350-140, ph=t*5+w.ph; w.g.setAttribute("transform",`translate(${x},${1288-Math.abs(Math.sin(ph))*3}) scale(.55)`);
      w.lg.forEach((l,i)=>l.setAttribute("transform",`translate(0,${(i?1:-1)*Math.sin(ph)*4})`)); if(w.lamp) w.lamp.setAttribute("transform","translate(26,-56)")});
    STN.forEach((s,k)=>{const x=((k*170-sc)%2380+2380)%2380-150; s.setAttribute("cx",x); s.setAttribute("cy",k%2?1330:1590)});
    // Ammamma (calm, amused) + Pinky (tired, whiny, then happy)
    const A=AM.st, P=PINKY.st, wph=t*6.5;
    Object.assign(A,{x:655,y:1420-446*0.85-Math.abs(Math.sin(wph))*4,s:0.85,talk:talkOf("ammamma",t),blink:((t*0.6)%3.1)<0.1?1:0,shut:0,look:-0.6,lookY:0.4,brow:"n",smile:1,laugh:0,sad:0,smirk:0,gasp:0,
      headRot:-4,headY:0,hop:0,rot:0,item:"",itemL:"",itemRot:0,itemRotL:0,vis:1,flip:1,wink:0,walk:0,lany:1,specSwing:0,tear:0,phoneGlow:0,hL:[-70,-66],hR:[66,-70]});
    Object.assign(P,{x:540,y:1420-Math.abs(Math.sin(wph))*5,s:0.78,talk:talkOf("pinky",t),blink:((t*0.7)%2.7)<0.1?1:0,brow:"s",look:0.8,lookY:-0.8,walk:wph,hop:0,smile:0,grin:0,hmm:1,jaw:0,headRot:6,item:"",shut:0});
    const pinkyAim=(side,wx,wy)=>PINKY.aim(side,wx,wy);
    if(t<S(8)-0.1){   // L8: tugging the saree, then the tummy
      const tug=Math.sin(t*16)*10; pinkyAim("R",640+tug,1245); P.headRot=8+Math.sin(t*16)*2;
      if(t>b.tAkali){PINKY.aimLocal("L",-20,-205,95); P.brow="s"} else PINKY.aimLocal("L",-90,-180);
      A.look=-0.9; A.lookY=0.6; A.smile=0; A.brow="u"; A.headRot=-6; AM.aim("L",600,1090)}
    else {   // L9: Ammamma chuckles and pats her head; Pinky looks up and smiles at the food
      const pat=Math.abs(Math.sin((t-b.pat)*7))*14; AM.aim("L",562,1008-pat); A.laugh=t<at(8,"భయం")+0.6?1:0; A.smile=1; A.brow="n"; A.headRot=-8;
      PINKY.aimLocal("R",90,-170); PINKY.aimLocal("L",-90,-170); P.look=0.9; P.lookY=-1; P.hmm=0; P.brow=t>at(8,"రెండు")?"u":"n"; P.smile=t>at(8,"రెండు")?1:0; P.grin=t>at(8,"free")?1:0; P.headRot=4;
      if(t>at(8,"రెండు")) P.hop=Math.abs(Math.sin(t*8))*10}
    AM.draw(); PINKY.draw();
    famWarm.setAttribute("opacity",0.08);
  }
  // ---------- HTML: hook pill, chips, counters ----------
  show("hook",lt<b.hook1,1,`translateY(${loop?0:-Math.max(0,(t-b.hook1+0.25)*0)}px)`); $("hook").style.opacity=lt<b.hook1?clamp((b.hook1-lt)/0.2):0;
  {const on=!loop&&t>=b.md0&&t<b.wide2; show("chipMD",on,pop(t,b.md0,0.35),"rotate(-1.5deg)")}
  {let c=null; for(const e of b.CE) if((loop?0.0001:t)>=e.show&&(loop?0.0001:t)<e.end) c=e;
   const el_=$("cnt"); el_.style.opacity=c?1:0;
   if(c){const k=loop?0:out((t-c.t0)/c.cnt), v=c.to*k; $("cnum").textContent=(c.pre||"")+fmtIN(v)+(c.suf||"");
     $("clab").innerHTML=c.lab; for(const n in ICON) if(n!=="led") ICON[n].style.display=n===c.ic?"":"none";
     if(ICON.led) ICON.led.setAttribute("opacity",Math.sin(t*7)>0?1:0.2);
     const hit=loop?0:t-(c.t0+c.cnt), pk=hit>0?Math.exp(-hit*7)*0.12:0;
     el_.style.transform=`scale(${(c.show===0?1:Math.max(0.01,pop(t,c.show,0.3)))*(1+pk)})`;
     $("cnum").style.color=k>=1?"#FFE27A":"#FFD54F"}}
  // police caps card (L5)
  {const on=!loop&&t>=b.caps&&t<b.cctv+0.1; const e=$("caps"); e.style.opacity=on?clamp((b.cctv+0.1-t)/0.15):0; e.style.transform=`scale(${Math.max(0.01,pop(t,b.caps,0.3))})`;
   CAPS.forEach((c,i)=>{const t0=b.caps+0.1+i*0.06; c.g.setAttribute("transform",`translate(${c.x},${c.y}) scale(${t>=t0?Math.max(0.01,back((t-t0)/0.25)):0.01})`)})}
  // lamp rail
  {const on=!loop&&t>=b.rail&&t<b.end0; const r=$("rail"); r.style.opacity=on?clamp((t-b.rail)/0.3):0; r.style.transform=`translateX(${-(1-out((t-b.rail)/0.4))*120}px)`;
   LAMPS.forEach((L,i)=>{const t0=b.lamps[i], lit=t>=t0; L.fl.setAttribute("opacity",lit?1:0); L.glow.setAttribute("opacity",lit?0.9:0);
     const s=lit?(1+Math.exp(-(t-t0)*6)*0.6):1, fl=lit?1+0.08*Math.sin(t*15+i):1;
     L.g.setAttribute("transform",`translate(46,${650-i*118}) scale(${s})`); L.fl.setAttribute("transform",`translate(0,-10) scale(${1/fl},${fl}) translate(0,10)`)})}
  // source strip (L3 -> end card)
  $("src").style.opacity=!loop&&t>=b.src?clamp((t-b.src)/0.3):0;
  // follow + subscribe taps (L6)
  {const on=!loop&&t>=b.fol0&&t<b.fol1; const f=$("fol"); f.style.opacity=on?clamp(Math.min((t-b.fol0)/0.15,(b.fol1-t)/0.15)):0; f.style.transform=`scale(${Math.max(0.01,back((t-b.fol0)/0.35))})`;
   const bF=$("bF"), bS=$("bS"); bF.textContent=t<b.tF?"+ FOLLOW":"FOLLOWING ✓"; bF.className="btn"+(t<b.tF?"":" done"); bS.textContent=t<b.tS?"▶ SUBSCRIBE":"SUBSCRIBED ✓"; bS.className="btn"+(t<b.tS?"":" done");
   bF.style.transform=`scale(${Math.abs(t-b.tF)<0.08?0.92:1})`; bS.style.transform=`scale(${Math.abs(t-b.tS)<0.08?0.92:1})`;
   const hand=$("tapHand"); let hx,hy,dip;
   if(on){ if(t<b.tF+0.1){const k=ease((t-b.fol0)/(b.tF-b.fol0)); hx=lerp(1060,990,k); hy=lerp(800,400,k); dip=Math.max(0,1-Math.abs(t-b.tF)/0.1)}
     else {const k=ease((t-b.tF-0.1)/(b.tS-b.tF-0.1)); hx=990; hy=lerp(400,520,k); dip=Math.max(0,1-Math.abs(t-b.tS)/0.1)}
     hand.style.opacity=1; hand.style.transform=`translate(${hx-50}px,${hy+dip*12}px) rotate(-8deg)`}
   else if(!loop&&t>=b.end0&&t<b.tEF+0.4){const k=ease((t-b.end0)/(b.tEF-b.end0)); dip=Math.max(0,1-Math.abs(t-b.tEF)/0.1); hand.style.opacity=1; hand.style.transform=`translate(${lerp(1040,960,k)-50}px,${lerp(1500,1105,k)+dip*12}px) rotate(-8deg)`}
   else hand.style.opacity=0;
   const rg_=$("ring"), tt=[b.tF,b.tS,b.tEF].find(x=>t>x&&t<x+0.45); rg_.style.opacity=!loop&&tt?1-(t-tt)/0.45:0;
   if(tt){rg_.style.left=(tt===b.tEF?960:990)+"px"; rg_.style.top=(tt===b.tF?400:tt===b.tS?520:1105)+"px"; rg_.style.transform=`scale(${1+(t-tt)/0.45*6})`}}
  // comment question + bubbles (L10)
  {const on=!loop&&t>=b.cq&&t<b.cq1; show("cq",on,pop(t,b.cq,0.35),"rotate(-1.5deg)"); if(on) $("cq").style.opacity=clamp((b.cq1-t)/0.2);
   CB.forEach((_,i)=>{const e=$("cb"+i), t0=b.cb[i]; const v=!loop&&t>t0&&t<b.cq1; e.style.opacity=v?clamp((b.cq1-t)/0.2):0; e.style.transform=`translateY(${-(t-t0)*12}px) scale(${Math.max(0.01,pop(t,t0,0.3))}) rotate(${i%2?3:-3}deg)`})}
  // share (L12) + end card
  {const on=!loop&&t>=b.share&&t<b.end0; show("share",on,pop(t,b.share,0.35)*(Math.abs(t-b.tShare)<0.09?0.92:1),"rotate(-1.5deg)")}
  {const ec=$("endc"), on=!loop&&t>=b.end0&&t<b.loop0; ec.style.opacity=on?clamp((t-b.end0)/0.15):0;
   $("eF").textContent=t<b.tEF?"FOLLOW @_REELRASAM":"FOLLOWING ✓  @_REELRASAM"; $("eF").style.background=t<b.tEF?"":"#6D6875"; $("eF").style.transform=`scale(${Math.abs(t-b.tEF)<0.1?0.93:1})`}
  // flashes at the cuts
  const fl=(t0,d,a_)=>t>t0&&t<t0+d?a_*(1-(t-t0)/d):0;
  $("flash").style.opacity=loop?0:(fl(b.wide2,0.12,0.25)+fl(b.fam0,0.12,0.3)+fl(b.fam1,0.12,0.25)+fl(b.fl,0.35,0.35));
  // subtitles
  const sub=$("sub"), L=curLine(t);
  if(!loop&&L&&t<b.end0){sub.style.opacity=1; sub.innerHTML=`<span class="who" style="background:${COLORS[L.who]}">${NAMES[L.who]}</span><br>${SUBS[L.i]}`} else sub.style.opacity=0;
}
window.render=function(t){ frame(t) };
