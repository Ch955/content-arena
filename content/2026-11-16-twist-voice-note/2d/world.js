// Twist story #1 "the voice note from my own number" — drawn world, cast and choreography (loaded by ep.html).
const NS="http://www.w3.org/2000/svg", svg=document.getElementById("s"), absvg=document.getElementById("ab"), nar=document.getElementById("nar");
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
// comment bubbles during the countdown (generic names; none gives away the "last year" answer)
const CB=[["Ravi","Ananya prank 😂","#1E88E5",40,1240],["Divya","Time travel bro 👀","#D81B60",560,1300],["Teja","AI voice clone?","#2E7D32",60,1400],
          ["Anu","Bus accident warning 😨","#8E24AA",330,1520],["Karthik","Amma plan చేసింది!","#E65100",40,1640],["Sneha","🤔","#00897B",880,1420]];
$("cbs").innerHTML=CB.map(([n,g,c,x,y],i)=>`<div class="cb" id="cb${i}" style="left:${x}px;top:${y}px"><b style="color:${c}">${n}</b><i>${g}</i></div>`).join("");
["wf0","wf1","wf2","wf3"].forEach(id=>$(id).innerHTML=[...Array(28)].map(()=>"<i></i>").join(""));
// torn paper edges (flashbacks): a jagged frame
{let o="M-10 -10 H1090 V1930 H-10 Z ", p=[]; const J=(k)=>(hash(k)*22+8);
 for(let x=0;x<=1080;x+=36) p.push([x,J(x)]); for(let y=0;y<=1920;y+=36) p.push([1080-J(y+7),y]);
 for(let x=1080;x>=0;x-=36) p.push([x,1920-J(x+13)]); for(let y=1920;y>=0;y-=36) p.push([J(y+29),y]);
 const d="M"+p.map(q=>q.join(" ")).join(" L")+" Z"; $("tornP").setAttribute("d",o+d); $("tornS").setAttribute("d",d)}

// ---------- defs + camera ----------
const defs=el("defs",{});
const lg=(id,stops,x2=0,y2=1,parent=defs)=>{const g=el("linearGradient",{id,x1:0,y1:0,x2,y2},parent);stops.forEach(([o,c])=>el("stop",{offset:o,"stop-color":c},g));return g};
lg("daysky",[["0","#9ED3F0"],["1","#DDF1FA"]]);
const cam=el("g",{});
applySkin(cam, defs);
const W=el("g",{id:"world"},cam);
el("rect",{x:-3000,y:-900,width:15000,height:3900,fill:"#14183A"},W);

// ===== BEDROOM + HALL (x -1600..1080, NEON): Nikhil's room in the Dilsukhnagar flat, 11:58 PM =====
el("rect",{x:-2600,y:-700,width:3900,height:2000,fill:"#1B2A6B"},W);
el("rect",{x:-2600,y:1300,width:3900,height:900,fill:"#24195A"},W);
el("rect",{x:-2600,y:1294,width:3900,height:12,fill:"#6A5ACD"},W);
el("rect",{x:-330,y:-700,width:40,height:2000,fill:"#141E52"},W);   // wall corner between hall and bedroom
// window + blue streetlight outside
el("rect",{x:700,y:260,width:300,height:440,fill:"#0B2244",stroke:"#3FD6FF","stroke-width":10},W);
el("rect",{x:715,y:560,width:270,height:125,fill:"#102C55"},W);
for(let i=0;i<3;i++) el("rect",{x:730+i*90,y:600-i*40,width:60,height:90+i*40,fill:"#16306A",stroke:"#5C6BC0","stroke-width":3},W);   // far buildings
[[742,620],[832,600],[922,560],[760,650],[940,610]].forEach(([x,y])=>el("rect",{x,y,width:14,height:14,fill:"#FFD54F"},W));
el("line",{x1:940,y1:330,x2:940,y2:700,stroke:"#4FC3F7","stroke-width":8},W);
el("path",{d:"M900 330 Q940 300 980 330 Z",fill:"#81D4FA",stroke:"#4FC3F7","stroke-width":4},W);
el("path",{d:"M915 335 L965 335 L1000 520 L880 520 Z",fill:"#7FE7FF",opacity:.22},W);
for(let i=1;i<6;i++) el("line",{x1:700+i*50,y1:260,x2:700+i*50,y2:700,stroke:"#5C6BC0","stroke-width":5},W);
el("path",{d:"M680 250 Q720 480 690 720 L730 720 Q760 480 730 250 Z",fill:"#3949AB",stroke:"#7986CB","stroke-width":4},W);
el("rect",{x:670,y:236,width:350,height:18,rx:8,fill:"#5C6BC0"},W);
el("path",{d:"M700 700 L1000 700 L760 1300 L300 1300 Z",fill:"#4FC3F7",opacity:.10},W);   // streetlight beam on the bed
// ceiling-fan shadow on the wall (turns slowly)
const fan=el("g",{transform:"translate(430,250)"},W);
for(let k=0;k<3;k++) el("ellipse",{cx:95,cy:0,rx:120,ry:22,fill:"#3D4FB5",opacity:.5,transform:`rotate(${k*120})`},fan);
el("circle",{r:20,fill:"#3D4FB5",opacity:.6},fan);
// small framed photo: Amma + Nikhil
const ph=el("g",{transform:"translate(250,560) rotate(-3)",opacity:0},W);
el("rect",{x:-70,y:-56,width:140,height:112,rx:6,fill:"#FFE0B2",stroke:"#FFB74D","stroke-width":8},ph);
el("circle",{cx:-24,cy:-4,r:19,fill:"#C68C62"},ph); el("circle",{cx:24,cy:-8,r:19,fill:"#C98B5E"},ph);
el("path",{d:"M-50 56 Q-24 18 2 56 Z",fill:"#C2185B"},ph); el("path",{d:"M0 56 Q24 14 50 56 Z",fill:"#45454D"},ph);
// bed: headboard, pillows, mattress, nightstand
el("rect",{x:30,y:880,width:700,height:330,rx:30,fill:"#5E35B1",stroke:"#B388FF","stroke-width":6},W);
for(let i=1;i<6;i++) el("line",{x1:30+i*116,y1:900,x2:30+i*116,y2:1190,stroke:"#7E57C2","stroke-width":4},W);
el("rect",{x:110,y:1065,width:290,height:120,rx:46,fill:"#B39DDB",stroke:"#D1C4E9","stroke-width":5},W);   // pillow (where the phone lies)
el("rect",{x:430,y:1040,width:270,height:140,rx:50,fill:"#9575CD",stroke:"#D1C4E9","stroke-width":5},W);   // pillow behind him
const phonePil=el("g",{transform:"translate(255,1112) rotate(-14)"},W);   // the phone lying on the pillow
el("rect",{x:-34,y:-58,width:68,height:116,rx:12,fill:"#111",stroke:"#90CAF9","stroke-width":4},phonePil);
const phonePilScr=el("rect",{x:-27,y:-50,width:54,height:100,rx:8,fill:"#BFE6FF"},phonePil);
el("rect",{x:840,y:1080,width:220,height:230,rx:10,fill:"#4527A0",stroke:"#9575CD","stroke-width":5},W);   // nightstand
el("rect",{x:870,y:990,width:40,height:90,rx:10,fill:"#80DEEA",opacity:.85},W);   // water bottle
el("rect",{x:950,y:1040,width:70,height:40,rx:8,fill:"#FF80AB"},W);   // book
const NIGHT_LAMP=el("circle",{cx:1000,cy:1010,r:0},W);

// ===== CAFÉ (x CO.., PAPER): today's Sunday lunch (a neighbourhood café; no office look) =====
const CO=3000;
el("rect",{x:CO-900,y:-700,width:2800,height:2000,fill:"#E9DCC0"},W);
el("rect",{x:CO-900,y:1300,width:2800,height:900,fill:"#BFA27A"},W);
const board=el("g",{transform:`translate(${CO+60},300)`},W);
el("rect",{x:0,y:0,width:470,height:330,rx:12,fill:"#2E3B2F",stroke:"#6D4C41","stroke-width":12},board);
txt("☕ CAFÉ MENU",{x:235,y:70,"font-family":"Anton","font-size":46,"text-anchor":"middle",fill:"#F5F0DC","letter-spacing":2},board);
txt("Veg Biryani  ₹180",{x:235,y:150,"font-family":"InterB","font-weight":800,"font-size":36,"text-anchor":"middle",fill:"#FFE082"},board);
txt("Cold coffee  ₹90",{x:235,y:210,"font-family":"InterB","font-weight":800,"font-size":36,"text-anchor":"middle",fill:"#F5F0DC"},board);
txt("Masala chai  ₹30",{x:235,y:270,"font-family":"InterB","font-weight":800,"font-size":36,"text-anchor":"middle",fill:"#F5F0DC"},board);
el("rect",{x:CO+650,y:300,width:400,height:360,fill:"url(#daysky)",stroke:"#6D4C41","stroke-width":10},W);
[[CO+740,600,90],[CO+900,580,110],[CO+1010,620,70]].forEach(([x,y,r])=>el("circle",{cx:x,cy:y,r,fill:"#7CB342"},W));
el("line",{x1:CO+850,y1:300,x2:CO+850,y2:660,stroke:"#6D4C41","stroke-width":8},W);
for(let i=0;i<12;i++) el("circle",{cx:CO-120+i*110,cy:250+Math.sin(i/11*Math.PI)*40,r:11,fill:i%2?"#FFD54F":"#FFAB91",stroke:"#8D6E63","stroke-width":2},W);
el("rect",{x:CO-200,y:760,width:90,height:200,rx:10,fill:"#8D6E63"},W); el("circle",{cx:CO-155,cy:720,r:80,fill:"#558B2F"},W);   // potted plant

// ===== KITCHEN / DINING (x KO.., PAPER last year, CLAY this year): the same Dilsukhnagar flat, morning =====
const KO=6000;
el("rect",{x:KO-900,y:-700,width:2800,height:2000,fill:"#F4CF9E"},W);
el("rect",{x:KO-900,y:1300,width:2800,height:900,fill:"#D9A877"},W);
el("rect",{x:KO-900,y:1010,width:2800,height:170,fill:"#E9B987"},W);
// window with the street: compound wall, gate, the office bus (clipped to the window)
const winClip=el("clipPath",{id:"winClip"},defs); el("rect",{x:KO+300,y:300,width:480,height:410},winClip);
el("rect",{x:KO+300,y:300,width:480,height:410,fill:"url(#daysky)"},W);
const street=el("g",{"clip-path":"url(#winClip)"},W);
el("rect",{x:KO+280,y:520,width:520,height:120,fill:"#C9B79C"},street);   // compound wall
el("rect",{x:KO+280,y:640,width:520,height:80,fill:"#8A8F98"},street);   // road
[[KO+340,470,60],[KO+720,480,70]].forEach(([x,y,r])=>el("circle",{cx:x,cy:y,r,fill:"#8BC34A"},street));
const bus=el("g",{},street);
el("rect",{x:-250,y:-170,width:500,height:150,rx:22,fill:"#FAFAFA",stroke:INK,"stroke-width":6},bus);
el("rect",{x:-250,y:-70,width:500,height:22,fill:"#1E88E5"},bus);
for(let k=0;k<6;k++) el("rect",{x:-225+k*78,y:-150,width:60,height:62,rx:8,fill:"#455A64",stroke:INK,"stroke-width":3},bus);
el("rect",{x:200,y:-150,width:40,height:110,rx:6,fill:"#90A4AE",stroke:INK,"stroke-width":3},bus);
[-160,160].forEach(x=>{el("circle",{cx:x,cy:-16,r:30,fill:"#263238",stroke:INK,"stroke-width":5},bus); el("circle",{cx:x,cy:-16,r:11,fill:"#B0BEC5"},bus)});
const exhaust=el("g",{},street); for(let k=0;k<3;k++) el("circle",{cx:0,cy:0,r:16+k*8,fill:"#B0BEC5",opacity:.5},exhaust);
el("rect",{x:KO+300,y:300,width:480,height:410,fill:"none",stroke:"#6D4C41","stroke-width":12},W);
el("line",{x1:KO+540,y1:300,x2:KO+540,y2:710,stroke:"#6D4C41","stroke-width":8},W);
el("rect",{x:KO+280,y:705,width:520,height:22,rx:6,fill:"#8D5A34",stroke:INK,"stroke-width":4},W);
// front door (right) with a marigold toran; opens outward (dark gap) when Nikhil leaves
el("rect",{x:KO+900,y:330,width:240,height:970,fill:"#5D3A1F",stroke:INK,"stroke-width":7},W);
const doorGap=el("rect",{x:KO+918,y:350,width:204,height:950,fill:"#FFF3D6"},W);
const doorPanel=el("g",{},W);
el("rect",{x:KO+918,y:350,width:204,height:950,fill:"#A86D40",stroke:"#6E4424","stroke-width":5},doorPanel);
el("rect",{x:KO+945,y:400,width:150,height:360,fill:"none",stroke:"#6E4424","stroke-width":5},doorPanel);
el("rect",{x:KO+945,y:820,width:150,height:400,fill:"none",stroke:"#6E4424","stroke-width":5},doorPanel);
el("circle",{cx:KO+940,cy:820,r:10,fill:"#F2B53A",stroke:INK,"stroke-width":3},doorPanel);
for(let i=0;i<11;i++){const x=KO+905+i*23, y=330+Math.sin(i/10*Math.PI)*30; el("circle",{cx:x,cy:y,r:14,fill:i%2?"#FFB300":"#FB8C00",stroke:"#B35A00","stroke-width":2},W);
  if(i%3===1) el("path",{d:`M${x-8} ${y+12} L${x} ${y+48} L${x+8} ${y+12} Z`,fill:"#3E8E41",stroke:"#1F5E22","stroke-width":2},W)}
// wall calendar (small, no brand)
const wcal=el("g",{transform:`translate(${KO+110},380) rotate(-2)`},W);
el("rect",{x:-70,y:-70,width:140,height:160,rx:8,fill:"#FFFDF5",stroke:INK,"stroke-width":5},wcal);
el("rect",{x:-70,y:-70,width:140,height:40,rx:6,fill:"#D7263D"},wcal);
txt("NOV",{x:0,y:-40,"font-family":"Anton","font-size":30,"text-anchor":"middle",fill:"#fff"},wcal);
txt("16",{x:0,y:50,"font-family":"Anton","font-size":72,"text-anchor":"middle",fill:INK},wcal);
el("circle",{cx:0,cy:25,r:46,fill:"none",stroke:"#D7263D","stroke-width":5},wcal);
// steel shelf with dabbas
el("rect",{x:KO-260,y:560,width:360,height:20,fill:"#90A4AE",stroke:INK,"stroke-width":4},W);
[[KO-220,"#B0BEC5"],[KO-130,"#CFD8DC"],[KO-40,"#B0BEC5"],[KO+50,"#CFD8DC"]].forEach(([x,c])=>el("rect",{x:x-34,y:470,width:68,height:90,rx:10,fill:c,stroke:INK,"stroke-width":4},W));

// ===== HALL (x -1600..-400, NEON): Amma's door =====
const HX=-1000;
el("rect",{x:HX-170,y:520,width:340,height:780,fill:"#3E2A1E",stroke:"#FFB74D","stroke-width":8},W);
const hallWarm=el("rect",{x:HX-150,y:540,width:300,height:760,fill:"#FFC46B"},W);
const hallDoor=el("g",{},W);
el("rect",{x:HX-150,y:540,width:300,height:760,fill:"#8D5A34",stroke:"#FF8A65","stroke-width":5},hallDoor);
el("rect",{x:HX-115,y:590,width:230,height:280,fill:"none",stroke:"#FF8A65","stroke-width":4},hallDoor);
el("rect",{x:HX-115,y:930,width:230,height:320,fill:"none",stroke:"#FF8A65","stroke-width":4},hallDoor);
el("circle",{cx:HX+118,cy:930,r:10,fill:"#FFD54F"},hallDoor);
el("rect",{x:HX-150,y:1290,width:300,height:10,fill:"#FFB300"},W);   // warm light under the door
for(let i=0;i<9;i++){const x=HX-150+i*37, y=520+Math.sin(i/8*Math.PI)*24; el("circle",{cx:x,cy:y,r:13,fill:i%2?"#FFB300":"#FB8C00"},W)}
el("rect",{x:HX+320,y:1020,width:100,height:280,rx:10,fill:"#4527A0",stroke:"#9575CD","stroke-width":4},W);   // small table + night lamp
el("path",{d:`M${HX+330} 1020 L${HX+410} 1020 L${HX+390} 960 L${HX+350} 960 Z`,fill:"#FFE082"},W);

// ===== BALCONY (x BO.., NEON): Ananya's flat, fairy lights =====
const BO=9000;
el("rect",{x:BO-900,y:-700,width:2800,height:2000,fill:"#140F4A"},W);
el("circle",{cx:BO+860,cy:300,r:60,fill:"#E1F5FE"},W);
for(let i=0;i<6;i++){const x=BO-200+i*230, h=300+hash(i)*300; el("rect",{x,y:1200-h,width:170,height:h,fill:"#1E2A78",stroke:"#5C6BC0","stroke-width":4},W);
  for(let k=0;k<8;k++) if(hash(i*9+k)>0.45) el("rect",{x:x+20+(k%3)*50,y:1200-h+30+Math.floor(k/3)*70,width:26,height:30,fill:hash(k+i)>0.5?"#FFD54F":"#80DEEA"},W)}
el("rect",{x:BO-900,y:-700,width:300,height:2000,fill:"#2A2F7A",stroke:"#7986CB","stroke-width":6},W);   // balcony wall (left)
el("path",{d:`M${BO-500} 360 Q${BO+300} 470 ${BO+1300} 360`,stroke:"#FFD54F","stroke-width":4,fill:"none"},W);
const fairy=[]; for(let i=0;i<22;i++){const x=BO-460+i*80, y=360+Math.sin(clamp((x-(BO-500))/1800)*Math.PI)*105;
  fairy.push(el("circle",{cx:x,cy:y+14,r:12,fill:["#FF4081","#FFD740","#69F0AE","#40C4FF"][i%4]},W))}
const pot=el("g",{transform:`translate(${BO+880},1170)`},W); el("path",{d:"M-60 0 L60 0 L46 -110 L-46 -110 Z",fill:"#E64A19"},pot);
[[-30,-200],[0,-240],[30,-190],[-50,-150],[50,-160]].forEach(([x,y])=>el("ellipse",{cx:x,cy:y,rx:22,ry:60,fill:"#00E676",transform:`rotate(${x/2} ${x} ${y})`},pot));

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
    for(let k=0;k<9;k++){const a=Math.PI*(1.05+k*0.11); el("circle",{cx:Math.cos(a)*40,cy:-84+Math.sin(a)*40,r:7,fill:"#FFFDF5",stroke:"#C9C2B0","stroke-width":1.5},hairBack)}}
  if(o.saree){
    el("path",{d:"M-70 -60 L70 -60 L96 230 L-96 230 Z",fill:o.saree.base,stroke:INK,"stroke-width":5},body);
    for(let k=-2;k<=2;k++) el("line",{x1:k*22,y1:-40,x2:k*30,y2:226,stroke:INK,"stroke-width":2,opacity:.3},body);
    el("path",{d:"M-88 -268 Q-92 -288 -64 -292 L-24 -300 L24 -300 L64 -292 Q92 -288 88 -268 L76 -50 L-76 -50 Z",fill:o.shirt,stroke:INK,"stroke-width":5},body);
    el("path",{d:"M-28 -300 Q0 -262 28 -300",fill:o.skin,stroke:INK,"stroke-width":3},body);
    el("path",{d:"M-76 -120 Q0 -100 76 -120 L76 -50 L-76 -50 Z",fill:o.skin,stroke:INK,"stroke-width":3},body);
    el("path",{d:"M-92 -262 L-40 -300 L96 -100 L90 -10 L60 -10 Z",fill:o.saree.pallu,stroke:INK,"stroke-width":5,"stroke-linejoin":"round"},body);
    el("path",{d:"M-84 -258 L-38 -290 L92 -98",stroke:o.saree.border,"stroke-width":9,fill:"none"},body);
    el("path",{d:"M-70 -230 L70 -40",stroke:o.saree.border,"stroke-width":6,fill:"none",opacity:.8},body);
    el("path",{d:"M-96 226 L96 226",stroke:o.saree.border,"stroke-width":14},body);
  } else if(o.kurta){
    el("path",{d:"M-84 -268 Q-88 -286 -62 -290 L-24 -298 L24 -298 L62 -290 Q88 -286 84 -268 L70 -60 L104 220 L-104 220 L-70 -60 Z",fill:o.shirt,stroke:INK,"stroke-width":5},body);
    el("path",{d:"M-30 -298 Q0 -250 30 -298",fill:o.skin,stroke:o.trim,"stroke-width":8},body);
    el("path",{d:"M0 -258 L0 -120",stroke:o.trim,"stroke-width":7,"stroke-dasharray":"10 8"},body);
  } else if(o.tee){   // night: plain grey T-shirt with a round neck
    el("path",{d:"M-94 -268 Q-98 -288 -70 -292 L-30 -300 L30 -300 L70 -292 Q98 -288 94 -268 L84 -6 Q82 4 68 4 L-68 4 Q-82 4 -84 -6 Z",fill:o.shirt,stroke:INK,"stroke-width":5},body);
    el("path",{d:"M-32 -301 Q0 -258 32 -301",fill:o.skin,stroke:INK,"stroke-width":4},body);
    el("path",{d:"M-36 -300 Q0 -250 36 -300",fill:"none",stroke:o.collar||"#6B7079","stroke-width":5},body);
  } else {
    el("path",{d:"M-94 -268 Q-98 -288 -70 -292 L-26 -300 L26 -300 L70 -292 Q98 -288 94 -268 L82 -10 Q80 0 66 0 L-66 0 Q-80 0 -82 -10 Z",fill:o.shirt,stroke:INK,"stroke-width":5},body);
    el("path",{d:"M-24 -300 L0 -268 L24 -300",fill:o.skin},body);
    el("path",{d:"M-28 -302 L-4 -260 L-40 -276 Z",fill:o.collar||o.shirt,stroke:INK,"stroke-width":4,"stroke-linejoin":"round"},body);
    el("path",{d:"M28 -302 L4 -260 L40 -276 Z",fill:o.collar||o.shirt,stroke:INK,"stroke-width":4,"stroke-linejoin":"round"},body);
    el("line",{x1:0,y1:-262,x2:0,y2:0,stroke:INK,"stroke-width":3,opacity:.55},body);
    [-225,-170,-115,-60].forEach(y=>el("circle",{cx:6,cy:y,r:4,fill:o.button||"#9A9AA6"},body));
    el("path",{d:"M-60 -200 L-30 -200 L-30 -170 L-60 -170 Z",fill:"none",stroke:INK,"stroke-width":3,opacity:.45},body);
  }
  el("rect",{x:-19,y:-334,width:38,height:44,fill:o.skin},body);
  if(o.specChain){ el("path",{d:"M-26 -300 Q-30 -230 0 -206 Q30 -230 26 -300",stroke:"#D4A537","stroke-width":3,fill:"none"},body);
    [-15,15].forEach(x=>el("ellipse",{cx:x,cy:-200,rx:13,ry:9,fill:"rgba(220,240,255,.5)",stroke:"#6D4C41","stroke-width":3},body))}
  if(o.badge){ el("path",{d:"M-24 -300 Q-22 -230 -12 -172",stroke:"#2D6CDF","stroke-width":8,fill:"none"},body); el("path",{d:"M24 -300 Q22 -230 12 -172",stroke:"#2D6CDF","stroke-width":8,fill:"none"},body);
    const bd=el("g",{transform:"translate(0,-122)"},body);
    el("rect",{x:-40,y:-52,width:80,height:104,rx:8,fill:"#fff",stroke:INK,"stroke-width":3.5},bd);
    el("rect",{x:-40,y:-52,width:80,height:24,rx:6,fill:"#2D6CDF"},bd);
    el("rect",{x:-14,y:-22,width:28,height:30,rx:3,fill:"#C9D6E3"},bd); el("circle",{cx:0,cy:-11,r:7,fill:"#8A5A3B"},bd);
    txt(o.badge[0],{x:0,y:26,"font-family":"Anton","font-size":17,"text-anchor":"middle",fill:INK},bd);
    txt(o.badge[1],{x:0,y:44,"font-family":"Anton","font-size":12.5,"text-anchor":"middle",fill:"#2D6CDF","letter-spacing":1},bd)}
  if(o.bag){ el("path",{d:"M60 -296 L-70 -40",stroke:"#3E2723","stroke-width":10},body); el("rect",{x:-110,y:-60,width:90,height:70,rx:12,fill:"#5D4037",stroke:INK,"stroke-width":4},body)}
  const arm=s=>({up:el("line",{stroke:o.sleeve||o.shirt,"stroke-width":32,"stroke-linecap":"round"},body),
                 lo:el("line",{stroke:o.fore||o.sleeve||o.shirt,"stroke-width":28,"stroke-linecap":"round"},body),
                 cuff:o.cuff?el("circle",{r:15,fill:o.cuff},body):null,
                 hand:el("circle",{r:17,fill:o.skin,stroke:INK,"stroke-width":3},body)});
  const AL=arm(-1), AR=arm(1);
  const itemG=el("g",{},body), items={}, itemGL=el("g",{},body), itemsL={};
  const phoneShape=(p,scr)=>{el("rect",{x:-19,y:-38,width:38,height:68,rx:8,fill:"#1A1A1A",stroke:INK,"stroke-width":3},p); return el("rect",{x:-14,y:-32,width:28,height:54,rx:4,fill:scr},p)};
  items.phone=el("g",{},itemG); const scrR=phoneShape(items.phone,"#BFE6FF");
  itemsL.phone=el("g",{},itemGL); phoneShape(itemsL.phone,"#BFE6FF");
  itemsL.dead=el("g",{},itemGL);   // Ananya's own phone: black screen, red battery 0%
  el("rect",{x:-34,y:-66,width:68,height:122,rx:12,fill:"#111",stroke:INK,"stroke-width":4},itemsL.dead);
  el("rect",{x:-28,y:-58,width:56,height:106,rx:7,fill:"#050505"},itemsL.dead);
  el("rect",{x:-18,y:-26,width:32,height:18,rx:3,fill:"none",stroke:"#FF1744","stroke-width":3.5},itemsL.dead); el("rect",{x:14,y:-21,width:4,height:8,fill:"#FF1744"},itemsL.dead);
  el("rect",{x:-15,y:-23,width:4,height:12,fill:"#FF1744"},itemsL.dead);
  txt("0%",{x:0,y:22,"font-family":"Anton","font-size":24,"text-anchor":"middle",fill:"#FF1744"},itemsL.dead);
  items.bite=el("g",{},itemG); el("path",{d:"M-14 -10 L16 -10 L10 14 L-10 14 Z",fill:"#FFF3E0",stroke:INK,"stroke-width":3},items.bite); el("rect",{x:-14,y:-14,width:30,height:7,rx:3,fill:"#F48FB1"},items.bite);
  items.dosa=el("g",{},itemG); el("path",{d:"M-24 6 Q0 -30 24 6 Z",fill:"#9CCC65",stroke:"#558B2F","stroke-width":3},items.dosa);
  // head
  const head=el("g",{},body);
  el("ellipse",{cx:-55,cy:2,rx:10,ry:17,fill:o.skin,stroke:INK,"stroke-width":3},head); el("ellipse",{cx:55,cy:2,rx:10,ry:17,fill:o.skin,stroke:INK,"stroke-width":3},head);
  el("path",{d:"M-54 -22 Q-56 -72 0 -74 Q56 -72 54 -22 Q54 30 30 56 Q0 74 -30 56 Q-54 30 -54 -22 Z",fill:o.skin,stroke:INK,"stroke-width":4},head);
  if(o.earrings) [-55,55].forEach(x=>el("circle",{cx:x,cy:24,r:6.5,fill:"#F5B347",stroke:INK,"stroke-width":2},head));
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
    const glint=el("ellipse",{cx:0,cy:8,rx:11,ry:3,fill:"#CFEFFF",opacity:0},e);
    return {e,w,ir,pu,hl,lid,cover,shut,glint}});
  const brows=[-1,1].map(s=>el("path",{stroke:o.browCol||"#1C1410","stroke-width":o.brow||6,fill:"none","stroke-linecap":"round"},face));
  el("path",{d:"M3 0 Q-5 20 -2 26 Q4 29 10 25",stroke:"#7A4A2A","stroke-width":3,fill:"none","stroke-linecap":"round"},face);
  if(o.bindi) el("circle",{cx:0,cy:-36,r:5.5,fill:"#C62828"},face);
  const mouthO=el("ellipse",{cx:0,cy:44,rx:12,ry:3,fill:"#5A1E1E"},face);
  const lips=el("path",{d:"M-14 43 Q0 47 14 43",stroke:o.lip||"#8A3A3A","stroke-width":4,fill:"none","stroke-linecap":"round"},face);
  const smile=el("path",{d:"M-18 39 Q0 56 18 39",stroke:o.lip||"#8A3A3A","stroke-width":4.5,fill:"none","stroke-linecap":"round",opacity:0},face);
  const laugh=el("path",{d:"M-20 38 Q0 64 20 38 Z",fill:"#5A1E1E",stroke:o.lip||"#8A3A3A","stroke-width":4,opacity:0},face);
  const sad=el("path",{d:"M-14 48 Q0 39 14 48",stroke:o.lip||"#8A3A3A","stroke-width":4.5,fill:"none","stroke-linecap":"round",opacity:0},face);
  const smirk=el("path",{d:"M-14 44 Q4 49 19 37",stroke:o.lip||"#8A3A3A","stroke-width":4.5,fill:"none","stroke-linecap":"round",opacity:0},face);
  const tears=[-1,1].map(s=>el("path",{d:"M0 -7 Q6 2 0 6 Q-6 2 0 -7 Z",fill:"#9FDcFF",stroke:INK,"stroke-width":1.5,opacity:0},face));
  if(o.bun) el("path",{d:"M-58 -6 Q-64 -88 0 -90 Q64 -88 58 -6 Q52 -50 30 -58 Q10 -64 2 -84 Q-8 -64 -30 -58 Q-52 -50 -58 -6 Z",fill:o.hair,stroke:INK,"stroke-width":3},head);
  else if(o.longHair){el("path",{d:"M-60 -6 Q-68 -88 4 -88 Q64 -86 62 -14 Q50 -62 12 -64 Q-12 -46 -40 -44 Q-56 -30 -60 -6 Z",fill:o.hair,stroke:INK,"stroke-width":3},head);
    el("path",{d:"M-62 -20 Q-74 30 -64 80",stroke:o.hair,"stroke-width":18,fill:"none","stroke-linecap":"round"},head); el("path",{d:"M62 -20 Q74 30 64 80",stroke:o.hair,"stroke-width":18,fill:"none","stroke-linecap":"round"},head)}
  else el("path",{d:"M-58 -10 Q-66 -84 -6 -90 Q56 -94 62 -28 L58 -8 Q54 -48 30 -56 Q2 -62 -26 -54 Q-50 -46 -54 -8 Z",fill:o.hair,stroke:INK,"stroke-width":3},head);
  const lit=el("ellipse",{cx:0,cy:0,rx:58,ry:76,fill:"#BFE6FF",opacity:0},head);
  [AL.hand,AR.hand,itemG,itemGL].forEach(x=>body.appendChild(x));
  const st={x:0,y:0,s:1,flip:1,rot:0,hop:0,vis:1,talk:0,blink:0,shut:0,look:0,lookY:0,brow:"n",smile:0,laugh:0,sad:0,smirk:0,tear:0,tearRun:0,lit:0,headRot:0,headY:0,
            hL:[-60,-130],hR:[60,-130],item:"",itemL:"",itemRot:0,itemRotL:0,wink:0,walk:0,scr:1};
  const SH=[[-82,-270],[82,-270]];
  function draw(){
    const k=st; g.setAttribute("transform",`translate(${k.x},${k.y-k.hop}) rotate(${k.rot}) scale(${k.s*k.flip},${k.s})`); g.style.opacity=k.vis; g.style.display=k.vis>0?"":"none";
    if(!k.vis) return;
    const ht=`translate(${k.look*3},${-392+k.headY}) rotate(${k.headRot})`; head.setAttribute("transform",ht); hairBack.setAttribute("transform",ht);
    face.setAttribute("transform",`translate(${k.look*7},${k.lookY*3})`);
    legs.forEach((L,i)=>L.setAttribute("transform",`rotate(${(i?1:-1)*k.walk*14} 0 -10)`));
    [[AL,SH[0],k.hL,-1],[AR,SH[1],k.hR,1]].forEach(([A,S,T,side])=>{const [e,h]=ik(S[0],S[1],T[0],T[1],118,112,side);
      A.up.setAttribute("x1",S[0]);A.up.setAttribute("y1",S[1]);A.up.setAttribute("x2",e[0]);A.up.setAttribute("y2",e[1]);
      A.lo.setAttribute("x1",e[0]);A.lo.setAttribute("y1",e[1]);A.lo.setAttribute("x2",h[0]);A.lo.setAttribute("y2",h[1]);
      if(A.cuff){const m=[lerp(e[0],h[0],0.25),lerp(e[1],h[1],0.25)]; A.cuff.setAttribute("cx",m[0]);A.cuff.setAttribute("cy",m[1])}
      A.hand.setAttribute("cx",h[0]);A.hand.setAttribute("cy",h[1]); A.h=h});
    itemG.setAttribute("transform",`translate(${AR.h[0]},${AR.h[1]}) rotate(${k.itemRot})`); for(const n in items) items[n].style.opacity=k.item===n?1:0;
    itemGL.setAttribute("transform",`translate(${AL.h[0]},${AL.h[1]}) rotate(${k.itemRotL})`); for(const n in itemsL) itemsL[n].style.opacity=k.itemL===n?1:0;
    scrR.setAttribute("fill",k.scr?"#BFE6FF":"#111");
    const o_=k.talk, quiet=o_<0.12;
    mouthO.setAttribute("ry",2+12*o_); mouthO.setAttribute("rx",11+5*o_); mouthO.style.opacity=quiet&&!k.laugh?0:(quiet?0:1);
    laugh.style.opacity=quiet&&k.laugh?1:0;
    lips.style.opacity=quiet&&!k.smile&&!k.sad&&!k.smirk&&!k.laugh?1:0; smile.style.opacity=quiet&&k.smile&&!k.laugh?1:0; sad.style.opacity=quiet&&k.sad&&!k.smile&&!k.laugh?1:0; smirk.style.opacity=quiet&&k.smirk&&!k.smile&&!k.laugh?1:0;
    eyes.forEach((E,i)=>{const closed=k.blink||k.shut||(k.wink&&i===1); E.cover.style.opacity=closed?1:0; E.shut.style.opacity=closed?1:0; E.lid.style.opacity=closed?0:1;
      E.w.setAttribute("ry",closed?1:8+(k.brow==="u"?1.5:0)); [E.ir,E.pu].forEach(p=>{p.setAttribute("cx",k.look*4.5);p.setAttribute("cy",k.lookY*3)}); E.hl.setAttribute("cx",k.look*4.5-2.5);E.hl.setAttribute("cy",k.lookY*3-2.5);
      [E.ir,E.pu,E.hl].forEach(p=>p.style.opacity=closed?0:1); E.glint.style.opacity=closed?0:k.tear*0.9;
      E.lid.setAttribute("d",k.sad||k.tear>0.5?"M-13 -1 Q0 -9 13 -4":"M-13 -3 Q0 -11 13 -3")});
    brows.forEach((b,i)=>{const s=i?1:-1; const B={n:[-27,-29],u:[-34,-36],s:[-24,-30],a:[-30,-22],q:i?[-36,-34]:[-26,-27],w:[-27,-33]}[k.brow]||[-27,-29];
      b.setAttribute("d",`M${s*8} ${B[0]} Q${s*20} ${(B[0]+B[1])/2-4} ${s*33} ${B[1]}`)});
    tears.forEach((d,i)=>{const s=i?1:-1; const ph=k.tearRun; d.style.opacity=k.tearRun>0&&k.tearRun<1?1:0; d.setAttribute("transform",`translate(${s*24+s*ph*4},${2+ph*44}) scale(${1+ph*0.3})`)});
    lit.setAttribute("opacity",k.lit*0.14);
  }
  function aim(side,wx,wy){const lx=(wx-st.x)/(st.s*st.flip), ly=(wy-(st.y-st.hop))/st.s; if(side==="L") st.hL=[lx,ly]; else st.hR=[lx,ly]}
  return {st,draw,g,aim};
}
const NIKHIL_OPT={skin:"#C98B5E",hair:"#1C1410",shirt:"#45454D",collar:"#3A3A42",stubble:"#5A3A28",brow:6.5,lip:"#7A3A30"};
const ANANYA_OPT={skin:"#D9A47A",hair:"#2A1A14",shirt:"#1E8C8C",trim:"#F5B347",kurta:true,longHair:true,fore:"#D9A47A",sleeve:"#1E8C8C",cuff:"#F5B347",earrings:true,brow:4.5,lash:4,blush:0.3,lip:"#A0404A"};
const SAROJA_OPT={skin:"#C68C62",hair:"#2A1E1A",shirt:"#1F6E5A",saree:{base:"#B0204A",pallu:"#C2185B",border:"#F2B53A"},sleeve:"#1F6E5A",fore:"#C68C62",bun:true,bindi:true,earrings:true,specChain:true,lines:true,brow:4.5,lash:4,blush:0.3,lip:"#9A3040"};   // Amma, ~55 (cast.md)
const NIGHT_OPT={...NIKHIL_OPT,tee:true,shirt:"#8A8F98",collar:"#6B7079"};   // same Nikhil, grey T-shirt at night
// bedroom (NKB), hall (NKH), canteen (NKC), kitchen last year (NKP, leaves for the bus) and this year (NKN)
const NKB=makeAdult(NIGHT_OPT);
const blanket=el("g",{},W);
el("path",{d:"M300 1175 Q560 1140 860 1190 L1100 1220 L1100 1340 L20 1340 L20 1215 Q160 1180 300 1175 Z",fill:"#00897B",stroke:"#64FFDA","stroke-width":6},blanket);
for(let k=0;k<5;k++) el("path",{d:`M${380+k*130} 1200 Q${400+k*130} 1260 ${370+k*130} 1330`,stroke:"#4DB6AC","stroke-width":5,fill:"none"},blanket);
el("rect",{x:20,y:1330,width:1080,height:60,rx:10,fill:"#311B92",stroke:"#7C4DFF","stroke-width":5},W);
const NKH=makeAdult({...NIGHT_OPT,legs:{pant:"#3E4A61",shoe:"#C98B5E"}});
const AN=makeAdult(ANANYA_OPT), NKC=makeAdult(NIKHIL_OPT);   // Sunday lunch: no office lanyard
const ctable=el("g",{},W);
el("rect",{x:CO-400,y:1180,width:2000,height:44,rx:10,fill:"#E0C092",stroke:INK,"stroke-width":6},ctable);
el("rect",{x:CO-400,y:1222,width:2000,height:700,fill:"#C9A577",stroke:INK,"stroke-width":6},ctable);
const plateAt=(parent,x,y,food)=>{const g=el("g",{transform:`translate(${x},${y})`},parent);
  el("ellipse",{cx:0,cy:0,rx:100,ry:22,fill:"#C9CED6",stroke:INK,"stroke-width":5},g); el("ellipse",{cx:0,cy:-2,rx:80,ry:15,fill:"#E6EAEE"},g);
  if(food==="biryani"){ el("path",{d:"M-64 0 Q-60 -54 0 -58 Q60 -54 64 0 Z",fill:"#F2A33A",stroke:"#B8711A","stroke-width":3},g);
    for(let k=0;k<14;k++){const xx=-48+hash(k+40)*96, yy=-8-hash(k+51)*38; el("circle",{cx:xx,cy:yy,r:4,fill:k%3?"#FFF3D6":"#E65100"},g)}}
  else { el("path",{d:"M-70 -4 Q-10 -60 70 -4 Z",fill:"#9CCC65",stroke:"#558B2F","stroke-width":4},g); for(let k=0;k<8;k++) el("circle",{cx:-40+hash(k+60)*80,cy:-12-hash(k+70)*20,r:4,fill:"#33691E"},g);
    el("ellipse",{cx:56,cy:-10,rx:24,ry:9,fill:"#FFFDF5",stroke:INK,"stroke-width":3},g)}
  return g};
plateAt(W,CO+300,1196,"biryani"); const nkPlate=plateAt(W,CO+780,1196,"biryani");
const phoneT=el("g",{},W);   // Nikhil's phone lying on the canteen table
el("rect",{x:-46,y:-12,width:92,height:18,rx:6,fill:"#1A1A1A",stroke:INK,"stroke-width":3},phoneT);
// kitchen cast: Amma at the table, Nikhil (last year leaves; this year stays)
const AM=makeAdult(SAROJA_OPT), NKP=makeAdult({...NIKHIL_OPT,badge:["NIKHIL R","TOWER B"],bag:true,legs:{pant:"#2B3240",shoe:"#1A1A1A"}}), NKN=makeAdult(NIKHIL_OPT);
const ktable=el("g",{},W);
el("rect",{x:KO-400,y:1180,width:1290,height:44,rx:10,fill:"#FFF4E0",stroke:INK,"stroke-width":6},ktable);
el("rect",{x:KO-400,y:1222,width:1290,height:700,fill:"#F7E2C0",stroke:INK,"stroke-width":6},ktable);
for(let i=0;i<10;i++) el("path",{d:`M${KO-360+i*125} 1226 Q${KO-350+i*125} 1500 ${KO-366+i*125} 1900`,stroke:"#E5C99C","stroke-width":6,fill:"none"},ktable);
el("rect",{x:KO-400,y:1250,width:1290,height:24,fill:"#2E7D32"},ktable); el("rect",{x:KO-400,y:1280,width:1290,height:9,fill:"#F2B53A"},ktable);
plateAt(W,KO+290,1196,"dosa"); const nkDosa=plateAt(W,KO+690,1196,"dosa");
// the small birthday cake with one candle
const CKX=KO+490, cake=el("g",{},W);
el("ellipse",{cx:CKX,cy:1192,rx:92,ry:12,fill:"#E0E0E0",stroke:INK,"stroke-width":4},cake);
el("rect",{x:CKX-70,y:1100,width:140,height:90,rx:12,fill:"#FFF8F0",stroke:INK,"stroke-width":5},cake);
el("path",{d:`M${CKX-70} 1112 Q${CKX-52} 1136 ${CKX-35} 1112 Q${CKX-17} 1136 ${CKX} 1112 Q${CKX+17} 1136 ${CKX+35} 1112 Q${CKX+52} 1136 ${CKX+70} 1112 L${CKX+70} 1104 L${CKX-70} 1104 Z`,fill:"#F48FB1",stroke:INK,"stroke-width":3},cake);
const cakeCut=el("path",{d:`M${CKX+30} 1102 L${CKX+70} 1102 L${CKX+70} 1190 L${CKX+30} 1190 Z`,fill:"#F4CF9E",opacity:0},cake);
el("rect",{x:CKX-6,y:1040,width:12,height:62,rx:4,fill:"#64B5F6",stroke:INK,"stroke-width":3},cake);
const flame=el("path",{d:`M${CKX} 1000 Q${CKX+14} 1024 ${CKX} 1040 Q${CKX-14} 1024 ${CKX} 1000 Z`,fill:"#FFB300",stroke:"#E65100","stroke-width":2.5},cake);
// balcony cast (Ananya on the call) + railing in front
const ANB=makeAdult(ANANYA_OPT);
const rail=el("g",{},W);
el("rect",{x:BO-600,y:1200,width:2400,height:900,fill:"#283593",stroke:"#7986CB","stroke-width":6},rail);
el("rect",{x:BO-600,y:1180,width:2400,height:30,rx:8,fill:"#B0BEC5",stroke:"#ECEFF1","stroke-width":4},rail);
for(let i=0;i<16;i++) el("line",{x1:BO-560+i*150,y1:1210,x2:BO-560+i*150,y2:1920,stroke:"#5C6BC0","stroke-width":6},rail);

// ---------- split screen (L9): the top half re-uses the world through <use>, framed on the balcony ----------
const abDefs=el("defs",{},absvg);
const clipT=el("clipPath",{id:"clipTop"},abDefs), clipTRect=el("rect",{x:0,y:0,width:1080,height:958},clipT);
const abG=el("g",{"clip-path":"url(#clipTop)"},absvg);
el("rect",{x:0,y:0,width:1080,height:960,fill:"#05060F"},abG);
const abF=el("g",{filter:"url(#skin-neon)"},abG);
const abUse=el("use",{href:"#world"},abF);
el("line",{x1:0,y1:958,x2:1080,y2:958,stroke:"#fff","stroke-width":10},absvg);

// ---------- narrator Gopi badge (house look, clay, screen space) ----------
const ndefs=el("defs",{},nar);
const clip=el("clipPath",{id:"badgeClip"},ndefs); el("circle",{cx:165,cy:1385,r:122},clip);
const badge=el("g",{},nar);
const badgeIn=el("g",{filter:"url(#skin-clay)"},badge);
el("circle",{cx:165,cy:1385,r:134,fill:"#F5B347",stroke:INK,"stroke-width":7},badgeIn);
el("circle",{cx:165,cy:1385,r:122,fill:"#7B2FF7"},badgeIn);
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
const COLORS={gopi:"#F5B347",nikhil:"#C9C3F2",ananya:"#7FE0D0"}, NAMES={gopi:"GOPI",nikhil:"NIKHIL",ananya:"ANANYA"};
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
function beats(){ if(B) return B; B={}; const sv=(i,k)=>{const q=segsOf(i); return q[Math.min(k,q.length-1)][0]};
  B.ping=0; B.tap=0.22; B.titleIn=1.5; B.clk=S(1); B.pull=sv(1,1)-0.2; B.titleOut=B.pull+0.1; B.tSender=sv(1,1)+0.05; B.tVoice=sv(1,3); B.tVoice2=sv(1,4);
  B.chat0=S(2)-0.12; B.t815=sv(2,1); B.tBus=sv(2,2); B.chat1=E(2)+0.1;
  B.slots=S(3)+0.05; B.tHold=sv(3,2); B.tMiss=sv(3,3);
  B.fb1=S(4)-0.15; B.tDead=S(4)+0.2; B.tTake=S(4)+1.0; B.slot1=sv(4,0)+1.45; B.tDead2=sv(4,1);
  B.sch0=S(5)-0.12; B.tToggle=sv(5,1)+0.12; B.slot2=B.tToggle+0.45; B.tBack=sv(5,2)-0.05; B.sch1=E(5)+0.12; B.fb1e=E(5)+0.15;
  B.fz0=B.fb1e; B.tFol=sv(6,1)+0.12; B.fz1=S(7)-0.08;
  B.cal0=S(7); B.calFly=sv(7,1)-0.25; B.slot3=sv(7,1)+0.1; B.tTheory=sv(7,1); B.tCm=sv(7,2);
  B.CD0=E(7)+0.1; B.CD1=B.CD0+TL.countdown; B.cb=CB.map((_,i)=>B.CD0+0.3+i*0.6); B.ring0=B.CD1-1.0;
  B.split0=B.CD1; B.tNuvve=at(8,"నువ్వే"); B.split1=E(8)+0.15;
  B.fb2=B.split1; B.tUp=sv(9,0)+0.25; B.walk0=sv(9,1)-0.15; B.walk1=sv(9,1)+0.75; B.busGo=sv(9,1)+0.55; B.tAlone=sv(9,2)-0.1; B.fb2e=E(9)+0.12;
  B.fb3=B.fb2e; B.msg1=B.fb3+0.12; B.msg2=sv(10,1)-0.05; B.fb3e=sv(10,2)-0.12;
  B.tFlip=sv(10,2)+0.12; B.tWish=sv(10,3); B.hall0=E(10)+0.05; B.knock=B.hall0+0.1; B.door=S(11)+0.3; B.warm=S(11)+0.62;
  B.kit0=B.warm+0.12; B.tHonk=sv(11,1)-0.1; B.busGo2=sv(11,1)+0.15; B.tFeed=sv(11,1)+0.5; B.tCheck=sv(11,2);
  B.sh0=S(12)-0.1; B.tAt=sv(12,0)+0.5; B.tTag=sv(12,1)+0.1; B.end0=sv(12,2)-0.12; B.tEF=sv(12,2)+0.25; B.loop0=sv(12,3)-0.03;
  return B}

const focus=(z,wx,wy,sx=540,sy=1000)=>({z,fx:wx-(sx-540)/z,fy:wy-(sy-1000)/z});
const mixCam=(a,b_,k)=>({z:lerp(a.z,b_.z,k),fx:lerp(a.fx,b_.fx,k),fy:lerp(a.fy,b_.fy,k)});
let curSkin="";
function skinTo(s){ if(s!==curSkin){ setSkin(s); curSkin=s } }
let wfReady=false;
function wfInit(){ if(wfReady) return; wfReady=true; const env=TL.lines[0].env, n=28;
  const h=[...Array(n)].map((_,k)=>{const a=Math.floor(k*env.length/n), b_=Math.floor((k+1)*env.length/n); let m=0; for(let j=a;j<b_;j++) m=Math.max(m,env[j]); return 10+50*m});
  ["wf0","wf1","wf2","wf3"].forEach(id=>[...$(id).children].forEach((e,k)=>e.style.height=h[k]+"px")) }
function wfPlay(id,k){ [...$(id).children].forEach((e,j)=>e.className=j<k*28?"on":"") }

function frame(t){
  const b=beats(); wfInit();
  const loop=t>=b.loop0;
  // scene
  let sc="bed";
  if(loop) sc="bed";
  else if(t>=b.fb1&&t<b.fb1e) sc="canteen";
  else if(t>=b.fb2&&t<b.fb2e) sc="kitPast";
  else if(t>=b.fb3&&t<b.fb3e) sc="bedPast";
  else if(t>=b.hall0&&t<b.kit0) sc="hall";
  else if(t>=b.kit0) sc="kitNow";
  const split=!loop&&t>=b.split0&&t<b.split1;
  skinTo(sc==="canteen"||sc==="kitPast"||sc==="bedPast"?"paper":sc==="kitNow"?"clay":"neon");
  const paper=curSkin==="paper";
  $("sepia").style.opacity=paper?0.32:0; $("torn").style.opacity=paper?1:0;
  const tf=loop?0:t;                          // opening/loop share the same moment (frame 1)
  const opening=loop||t<b.pull+0.5;
  const reset=(C,who,x,y)=>Object.assign(C.st,{x,y,talk:who?talkOf(who,t):0,blink:((t*0.6+x*0.0013)%3.3)<0.11?1:0,shut:0,look:0,lookY:0,brow:"n",smile:0,laugh:0,sad:0,smirk:0,tear:0,tearRun:0,lit:0,
    headRot:0,headY:0,hop:0,rot:0,item:"",itemL:"",itemRot:0,itemRotL:0,vis:1,s:1,flip:1,wink:0,walk:0,scr:1,hL:[-62,-66],hR:[62,-66]});

  // ---------------- Nikhil in bed (night; also last year's 11:40 PM insert) ----------------
  const nb=NKB.st; reset(NKB,null,560,1250);
  const NBX=560, NBY=1250;
  if(opening&&!loop){ const k=ease((t-b.pull)/0.45); nb.rot=lerp(-55,0,k); nb.vis=t<b.pull?0:1 }
  if(loop) nb.vis=0;
  NKB.aim("R",NBX+40,NBY-300); nb.item="phone"; nb.itemRot=-8; nb.lit=1; nb.look=0.4; nb.lookY=0.6; nb.hL=[-62,-110];
  if(!opening&&t<b.chat0){ nb.brow="u"; nb.look=0.4; nb.lookY=0.5; if(t>b.tVoice){ nb.brow="w"; nb.look=0; nb.lookY=0; nb.headRot=-3 } }
  if(t>=b.chat0&&t<b.chat1){ nb.brow="w"; nb.look=0.6; nb.lookY=-0.2; nb.talk=talkOf("nikhil",t); nb.headRot=Math.sin(t*2)*2; if(t>b.tBus){ nb.brow="u"; nb.look=0.2 } }
  if(t>=b.chat1&&t<b.fb1){ nb.brow="w"; nb.look=0.5; nb.lookY=0.6; nb.headRot=-4+Math.sin(t*1.5) }
  if(t>=b.fz0&&t<b.split0){ nb.brow="q"; nb.look=0.5; nb.lookY=0.6; if(t>b.cal0){ nb.brow="w"; nb.headRot=-5 } if(t>b.CD0) { nb.brow=((t*2)%2<1)?"w":"q"; nb.look=0.4+0.2*Math.sin(t*3) } }
  if(t>=b.ring0&&t<b.split0){ nb.brow="u"; nb.look=0.5; nb.lookY=0.6 }
  if(split){ NKB.aim("R",NBX+52,NBY-400); nb.itemRot=-12; nb.lit=0.6; nb.look=-0.3; nb.lookY=-0.2; nb.brow=t>b.tNuvve?"u":"w"; nb.headRot=4; if(t>b.tNuvve+0.4){ nb.brow="w"; nb.sad=1 } }
  if(sc==="bedPast"){ nb.hL=[-30,-150]; NKB.aim("R",NBX+30,NBY-160); nb.itemRot=0; nb.lookY=0.9; nb.look=0.2; nb.sad=1; nb.brow="w"; nb.lit=1; nb.headRot=-3 }
  if(sc==="bed"&&t>=b.fb3e&&!loop){ NKB.aim("R",NBX+52,NBY-400); nb.itemRot=-12; nb.lit=0.4; nb.look=-0.2;
    if(t>b.tFlip){ nb.brow="u"; nb.smile=1; nb.tear=1 } if(t>b.tFlip+0.4){ nb.laugh=1; NKB.aim("L",NBX-40,NBY-405); nb.shut=1; nb.tear=0 }
    if(t>b.tWish){ nb.laugh=0; nb.smile=1; nb.shut=0; nb.hop=Math.sin(clamp((t-b.tWish)/0.5)*Math.PI)*60; nb.headRot=6; nb.hL=[-120,-200]; NKB.aim("R",NBX+130,NBY-470); nb.item="" } }
  NKB.draw();
  phonePilScr.setAttribute("fill",opening?"#BFE6FF":"#111"); phonePil.style.opacity=opening?1:0;
  fan.setAttribute("transform",`translate(430,250) rotate(${tf*40})`);
  // ---------------- hall: Nikhil knocks on Amma's door ----------------
  const nh=NKH.st; reset(NKH,null,HX+330,1060); nh.vis=sc==="hall"?1:0; nh.flip=-1; nh.look=0.6; nh.smile=1; nh.brow="u";
  if(sc==="hall"){ const kk=t-b.knock, kn=(kk>0&&kk<0.5)?Math.abs(Math.sin(kk*Math.PI*4)):0; NKH.aim("R",HX+175-kn*25,880); nh.hL=[-62,-60];
    if(t>b.door){ NKH.aim("R",HX+260,1000); nh.laugh=1 } }
  NKH.draw();
  { const k=t<b.door?0:out((t-b.door)/0.35); hallDoor.setAttribute("transform",`translate(${HX-150},0) scale(${lerp(1,0.12,k)},1) translate(${-(HX-150)},0)`); }
  // ---------------- canteen: Ananya + Nikhil (today, 1:20 PM) ----------------
  const an=AN.st; reset(AN,"ananya",CO+330,1240); an.vis=sc==="canteen"?1:0; an.look=0.6; an.smile=1; an.headRot=Math.sin(t*1.7)*2;
  const nc=NKC.st; reset(NKC,null,CO+780,1240); nc.vis=an.vis; nc.look=-0.2; nc.lookY=1; nc.smile=1; nc.headRot=Math.sin(t*3)*2;
  let phOnTable=true;
  if(sc==="canteen"){
    // Ananya shows her dead phone, then takes Nikhil's from the table
    if(t<b.tTake+0.6||(t>b.tDead2-0.1&&t<b.sch0)){ AN.aim("L",CO+185,lerp(1170,1010,out((t-b.tDead)/0.35))); an.itemL="dead"; an.itemRotL=-6; an.sad=t<b.tTake?1:0; an.smile=t<b.tTake?0:1; an.brow=t<b.tTake?"w":"q" }
    if(t>b.tTake-0.4&&t<b.tTake){ const k=ease((t-(b.tTake-0.4))/0.4); AN.aim("R",lerp(CO+400,CO+560,k),lerp(1100,1175,k)) }
    if(t>=b.tTake){ phOnTable=false; const k=ease((t-b.tTake)/0.4); AN.aim("R",lerp(CO+560,CO+420,k),lerp(1175,1000,k)); an.item="phone"; an.itemRot=-10; an.look=0.2; an.lookY=0.6; an.smirk=1; an.smile=0 }
    if(t>=b.sch0){ AN.aim("R",CO+420,960); an.item="phone"; an.lookY=0.7; an.look=0.1; an.smile=1; an.smirk=0; an.brow="q"; if(t>b.tToggle) { an.wink=1; an.look=1; an.lookY=0 } }
    if(t>=b.tBack){ const k=ease((t-b.tBack)/0.35); AN.aim("R",lerp(CO+420,CO+590,k),lerp(960,1170,k)); an.wink=0; an.smile=1; if(k>=1){ an.item=""; phOnTable=true } }
    if(an.talk<0.12&&t<b.sch0) an.talk=0;
    // Nikhil eats biryani, eyes on the plate
    const ch=Math.abs(Math.sin(t*3.2)); NKC.aim("R",lerp(CO+800,CO+790,ch),lerp(1170,1020,ch)); nc.hL=[-66,-66]; if(t>b.tDead&&t<b.tTake){ nc.look=-0.8; nc.lookY=0.3; nc.brow="u"; nc.smile=0 }
  }
  AN.draw(); NKC.draw();
  phoneT.setAttribute("transform",`translate(${t>=b.tBack+0.3&&t<b.fb1e?CO+620:CO+560},1188)`); phoneT.style.opacity=phOnTable?1:0;
  // ---------------- kitchen: last year (paper) / this year (clay) ----------------
  const am=AM.st; reset(AM,null,KO+290,1240); am.vis=(sc==="kitPast"||sc==="kitNow")?1:0; am.smile=1; am.look=0.6; am.headRot=Math.sin(t*1.2)*1.5;
  const np=NKP.st; reset(NKP,null,KO+690,1240); np.vis=sc==="kitPast"?1:0;
  const nn=NKN.st; reset(NKN,null,KO+690,1240); nn.vis=sc==="kitNow"?1:0;
  let busX=KO+540, doorOpen=0, flameOn=sc==="kitPast";
  if(sc==="kitPast"){
    // he checks the time, grabs the bag and walks out to the bus; Amma stays with the candle
    np.look=-0.5; np.lookY=0.3; np.brow="w"; NKP.aim("L",KO+620,1060); np.hR=[66,-80];
    if(t>b.tUp){ const k=ease((t-b.tUp)/0.4); np.y=lerp(1240,1060,k); np.look=0.9; np.brow="u" }
    if(t>b.walk0){ const k=clamp((t-b.walk0)/(b.walk1-b.walk0)); np.x=lerp(KO+690,KO+1080,ease(k)); np.walk=Math.sin(k*Math.PI*4); np.look=1; np.vis=k<0.92?1:clamp((1-k)/0.08); np.y=1060-Math.abs(Math.sin(k*Math.PI*4))*6;
      NKP.aim("R",np.x+110,np.y-200); NKP.aim("L",np.x-90,np.y-60) }
    doorOpen=t>b.walk0+0.15?1:0;
    am.look=t<b.walk1?0.8:0.3; am.lookY=t<b.walk1?-0.1:0.6; am.smile=1; am.brow=t>b.walk0?"w":"n"; if(t>b.walk0&&t<b.walk1) AM.aim("R",KO+380,950);
    if(t>b.tAlone){ am.look=0.5; am.lookY=0.7; am.smile=1; am.sad=0; am.brow="w"; AM.aim("R",KO+330,1170); am.item="dosa"; am.itemRot=0 }
    busX=t<b.busGo?KO+560:KO+560+Math.pow(t-b.busGo,2)*900;
  }
  if(sc==="kitNow"){
    nn.smile=1; nn.look=-0.6; nn.headRot=Math.sin(t*2)*2; NKN.aim("L",KO+640,1150); NKN.aim("R",KO+720,1150);
    am.look=0.8; am.laugh=1; am.shut=((t*2)%1.6)<0.5?1:0;
    busX=t<b.busGo2?KO+560:KO+560+Math.pow(t-b.busGo2,2)*700;
    if(t>b.tHonk&&t<b.tFeed){ nn.look=0.2; nn.lookY=-0.6; nn.brow="u"; nn.smile=0; nn.smirk=1 }
    if(t>b.tFeed){ const k=ease((t-b.tFeed)/0.5); AM.aim("R",lerp(KO+440,KO+690,k),lerp(1150,860,k)); am.item=k<1?"bite":"bite"; am.laugh=0; am.smile=1; am.shut=0; am.look=1;
      nn.look=-0.8; nn.laugh=k>0.9?1:0; nn.smile=1; nn.shut=k>0.9?1:0; nn.headRot=-6 }
    flameOn=t<b.tFeed;
  }
  AM.draw(); NKP.draw(); NKN.draw();
  bus.setAttribute("transform",`translate(${busX},710) translate(0,${Math.sin(t*30)*1.5})`);
  exhaust.setAttribute("transform",`translate(${busX-270},680) scale(${0.6+0.4*Math.sin(t*12)})`); exhaust.style.opacity=(sc==="kitNow"&&t>b.busGo2-0.3)||(sc==="kitPast"&&t>b.busGo-0.3)?0.8:0;
  doorPanel.setAttribute("transform",doorOpen?`translate(${KO+918},0) scale(0.12,1) translate(${-(KO+918)},0)`:"");
  flame.style.opacity=flameOn?1:0; flame.setAttribute("transform",`translate(${CKX},1040) scale(${1+0.12*Math.sin(t*23)},${1+0.15*Math.sin(t*17)}) translate(${-CKX},-1040)`);
  cakeCut.style.opacity=sc==="kitNow"&&t>b.tFeed?1:0;
  // ---------------- balcony: Ananya on the call (split screen) ----------------
  const ab=ANB.st; reset(ANB,"ananya",BO+540,1250); ab.vis=split?1:0;
  if(split){ ANB.aim("R",BO+540+52,1250-400); ab.item="phone"; ab.itemRot=-12; ab.look=-0.3; ab.smile=1; ab.headRot=-4+Math.sin(t*2)*2; ab.brow="q"; ANB.aim("L",BO+500,1150); }
  ANB.draw();
  fairy.forEach((f,i)=>f.setAttribute("opacity",0.55+0.45*Math.sin(t*3+i*1.7)));

  // ---------------- Gopi (narrator badge) ----------------
  const g=GOPI.st;
  const nIn=(i,pre=0.15,post=0.2)=>t>S(i)-pre&&t<E(i)+post;
  const narOn=!loop&&(nIn(1)||nIn(3)||(t>S(6)-0.15&&t<E(7)+0.1)||nIn(11)||(t>S(12)-0.15&&t<b.end0));
  const narT=t>S(12)-0.15?S(12)-0.15:t>S(11)-0.15?S(11)-0.15:t>S(6)-0.15?S(6)-0.15:t>S(3)-0.15?S(3)-0.15:S(1)-0.15;
  Object.assign(g,{x:165,y:1385+400*0.55+12,s:0.55,talk:talkOf("gopi",t),blink:((t*0.7)%3.1)<0.12?1:0,wink:0,look:0.5,lookY:0,brow:"n",smile:0,headRot:Math.sin(t*2.2)*3,item:"",armL:200,armR:160,lenL:115,lenR:115,hop:0,itemRot:0});
  if(t>S(3)&&t<E(3)){ g.brow="q"; g.look=0.8 }
  if(t>b.tMiss&&t<E(3)+0.2){ g.wink=1; g.smile=1 }
  if(t>b.tFol-0.4&&t<E(6)){ g.armR=40; g.item="point"; g.itemRot=-30 }
  if(t>S(7)-0.1&&t<E(7)){ g.brow="u"; g.look=0 }
  if(t>S(11)){ g.smile=1; g.brow="q" }
  GOPI.draw();
  const bs=narOn?Math.max(0.001,back((t-narT)/0.35)):0;
  badge.setAttribute("transform",`translate(165,1385) scale(${bs}) rotate(${Math.sin(t*2)*2}) translate(-165,-1385)`); badge.style.opacity=narOn?1:0;

  // ---------------- camera ----------------
  const punch=(t0,a_=0.1)=>t>t0?a_*Math.exp(-(t-t0)*4)*clamp((t-t0)/0.06):0;
  const OPEN=focus(2.3+0.03*tf,265,1105,540,1000);
  let cm;
  if(sc==="bed"){
    if(opening&&(loop||t<b.pull)) cm=OPEN;
    else if(t<b.pull+0.5) cm=mixCam(OPEN,focus(1.0,560,1000),ease((t-b.pull)/0.5));
    else if(t<b.chat0) cm=focus(t>b.tVoice2?lerp(1.0,1.7,out((t-b.tVoice2)/0.3)):1.0+0.02*(t-b.pull),t>b.tVoice2?NBX:560,t>b.tVoice2?860:1000,540,t>b.tVoice2?1050:1000);
    else if(t<b.chat1) cm=focus(1.35+punch(b.tBus,0.1),600,900,330,1250);
    else if(t<b.fb1) cm=focus(1.05+0.02*(t-b.chat1),560,1000,540,1060);
    else if(t<b.fz1) cm=focus(1.12,560,950,540,1080);
    else if(t<b.split0) cm=focus(1.25+0.012*(t-b.cal0),560,900,540,1250);
    else if(split) cm=focus(1.15,NBX,880,540,1420);
    else if(t>=b.fb3e) cm=focus(1.3+punch(b.tFlip,0.08),NBX,930,330,1250);
    else cm=focus(1.05,560,1000);
  } else if(sc==="bedPast") cm=focus(1.25+0.03*(t-b.fb3),NBX,950,540,1350);
  else if(sc==="hall") cm=focus(1.05+0.04*(t-b.hall0)+punch(b.knock,0.04),HX+200,950,540,1000);
  else if(sc==="canteen"){
    if(t<b.tTake) cm=focus(1.5+punch(b.tDead,0.08),CO+330,900,540,1050);
    else if(t<b.sch0) cm=focus(1.25,CO+550,960,540,1050);
    else cm=focus(1.3,CO+520,960,540,1300);
  } else if(sc==="kitPast"){
    if(t<b.tAlone) cm=focus(1.05+0.02*(t-b.fb2),KO+590,900,540,1000);
    else cm=focus(lerp(1.15,1.5,ease((t-b.tAlone)/1.2)),KO+390,980,540,1000);
  } else if(sc==="kitNow"){
    if(t<b.tFeed) cm=focus(1.05+0.015*(t-b.kit0),KO+540,880,540,1000);
    else cm=focus(lerp(1.1,1.45,ease((t-b.tFeed)/0.8)),KO+490,960,540,1000);
  }
  let sx=0,sy=0; const shake=(t0,d,a_)=>{if(t>t0&&t<t0+d){const q=(1-(t-t0)/d)*a_; sx+=Math.sin(t*90)*q; sy+=Math.cos(t*77)*q}};
  shake(b.tVoice2,0.25,6); shake(b.tBus,0.2,5); shake(b.CD1,0.25,8); shake(b.tWish,0.3,8); shake(b.knock,0.4,3);
  cam.setAttribute("transform",`translate(${540+sx},${1000+sy}) scale(${cm.z}) translate(${-cm.fx},${-cm.fy})`);
  const scr=(wx,wy)=>[540+(wx-cm.fx)*cm.z+sx, 1000+(wy-cm.fy)*cm.z+sy];
  // split: the top half shows the balcony
  absvg.style.opacity=split?1:0;
  if(split){ const k=out((t-b.split0)/0.25); clipTRect.setAttribute("height",958*k); const z=1.1; abUse.setAttribute("transform",`translate(540,500) scale(${z}) translate(${-(BO+540)},${-880})`) }

  // ---------------- HTML overlays ----------------
  const show=(id,on,s=1,extra="")=>{const e=$(id); e.style.opacity=on?1:0; if(on) e.style.transform=`${extra} scale(${Math.max(0.01,s)})`};
  let dm=0; if(t>=b.cal0&&t<b.split0) dm=0.25; if(t>b.sh0&&t<b.loop0) dm=0; $("dim").style.opacity=dm;
  // title (a beat after the open)
  {const ti=$("title"), on=!loop&&t>b.titleIn&&t<b.titleOut; ti.style.opacity=on?clamp((b.titleOut-t)/0.2):0; ti.style.transform=`scale(${Math.max(0.01,back((t-b.titleIn)/0.45))})`}
  // ---- the phone ----
  {const P=$("phone"); let on=false, cx=540, cy=1040, s=1, rot=0, pane="lock", dim_=0;
   const lit=loop?clamp((t-b.loop0)/0.15):1;
   if(opening&&(loop||t<b.pull)){ on=true; s=1+(t>b.clk&&!loop?0.28*out((t-b.clk)/0.35):0); cy=1040+(t>b.clk&&!loop?120*out((t-b.clk)/0.35):0); rot=-2; dim_=1-lit }
   else if(opening&&t<b.pull+0.45){ on=true; const k=ease((t-b.pull)/0.45); const [hx,hy]=scr(NBX+40,NBY-330); s=lerp(1.28,0.08,k); cx=lerp(540,hx,k); cy=lerp(1160,hy,k); rot=lerp(-2,-8,k) }
   else if(t>=b.chat0&&t<b.chat1){ on=true; pane="chat"; s=0.62*Math.max(0.01,pop(t,b.chat0,0.3)); cx=770; cy=640; rot=3 }
   else if(t>=b.sch0&&t<b.sch1){ on=true; pane="sched"; s=0.70*Math.max(0.01,pop(t,b.sch0,0.3)); cx=600; cy=640; rot=-2 }
   else if(sc==="bed"&&t>=b.fz0&&t<b.fz1){ on=false }
   P.style.opacity=on?1:0;
   if(on){ P.style.left=(cx-280)+"px"; P.style.top=(cy-520)+"px"; P.style.transform=`rotate(${rot}deg) scale(${s})`;
     ["lock","chat","sched"].forEach(id=>$(id).style.opacity=id===pane?1:0); $("phDim").style.opacity=dim_;
     // notification: tap at 0.22 s, the voice note plays during line 1
     const pk=clamp((t-S(0))/D(0)); wfPlay("wf0",loop?0:pk); $("nPlay").textContent=(!loop&&t>b.tap&&t<E(0))?"❚❚":"▶";
     $("nLen").textContent=(!loop&&t>S(0))?`0:0${Math.min(4,Math.floor(pk*4))}`:"0:04";
     wfPlay("wf1",t>b.chat0+0.3?clamp((t-b.chat0-0.3)/1.4):0); wfPlay("wf2",0);
     const ton=t>b.tToggle; $("tg").style.background=ton?"#34C759":"#B8C2D0"; $("tgK").style.left=(ton?6+lerp(0,54,out((t-b.tToggle)/0.15)):6)+"px";
     $("sBtn").textContent=t>b.tToggle+0.35?"✓ Scheduled · 11:58 PM":"Schedule"; $("sBtn").style.background=t>b.tToggle+0.35?"#34C759":"#2D6CDF" }}
  {const r=$("notif"); r.style.transform=`translateX(${(!loop&&opening)?0:0}px)`}
  // chips
  const chipAt=(id,on,x,y,s,rot=0)=>{const c=$(id); c.style.opacity=on?1:0; if(on){c.style.left=x+"px"; c.style.top=y+"px"; c.style.transform=`translate(-50%,0) scale(${Math.max(0.01,s)}) rotate(${rot}deg)`}};
  chipAt("cSender",!loop&&t>b.tSender&&t<b.chat0,540,330,pop(t,b.tSender,0.3),-3);
  chipAt("cVoice",!loop&&t>b.tVoice&&t<b.chat0,540,440,pop(t,b.tVoice,0.3)*(1+(t>b.tVoice2&&t<b.tVoice2+0.3?0.12*Math.sin((t-b.tVoice2)*20):0)),3);
  chipAt("c815",t>b.t815&&t<b.chat1,600,1020,pop(t,b.t815,0.3)*(t>b.tBus&&t<b.tBus+0.3?1.12:1),-4);
  chipAt("dchip",(sc==="canteen")||(sc==="kitPast")||(sc==="bedPast"),540,330,pop(t,sc==="canteen"?b.fb1:sc==="kitPast"?b.fb2:b.fb3,0.3),-2);
  $("dchip").textContent=sc==="kitPast"?"🕐 16 NOV 2025 · 8:15 AM":sc==="bedPast"?"🕐 16 NOV 2025 · 11:40 PM":"🕐 TODAY · 1:20 PM · CAFÉ";
  {const [px,py]=scr(CO+185,960); chipAt("cBatt",sc==="canteen"&&t>b.tDead+0.2&&t<b.sch0,Math.max(150,px-40),py-250,pop(t,b.tDead+0.2,0.3)*(t>b.tDead2&&t<b.tDead2+0.3?1.15:1),5)}
  chipAt("cMorn",sc==="kitNow"&&t<b.sh0,540,330,pop(t,b.kit0+0.1,0.3),-2);
  chipAt("cBusGo",sc==="kitNow"&&t>b.busGo2+0.3&&t<b.sh0,540,440,pop(t,b.busGo2+0.3,0.3),3);
  show("hold",t>b.tHold&&t<b.fb1,lerp(1.8,1,out((t-b.tHold)/0.2)),`rotate(${-3+Math.sin(t*5)*1.2}deg)`);
  // clue slots: appear in L4, fill as the clues land, stay until the reveal
  {const on=t>b.slots&&t<b.split0; $("slots").style.opacity=on?clamp((t-b.slots)/0.2):0;
   [b.slot1,b.slot2,b.slot3].forEach((t0,i)=>{const sl=$("sl"+i), full=t>t0; sl.className="slot"+(full?" full":""); sl.querySelector(".q").style.opacity=full?0:1;
     const c=sl.querySelector(".c"); c.style.opacity=full?1:0; c.style.transform=`scale(${full?Math.max(0.01,pop(t,t0,0.35)):1})`;
     sl.style.transform=`scale(${(t>b.tMiss&&t<b.tMiss+0.6)?1+0.06*Math.sin((t-b.tMiss)*Math.PI*5):(full&&t<t0+0.3?lerp(1.15,1,(t-t0)/0.3):1)})`})}
  // big calendar widget (L8): pops centre, then flies into slot 3
  {const c=$("bigcal"), on=t>b.cal0&&t<b.slot3; c.style.opacity=on?1:0;
   if(on){const k=t<b.calFly?0:ease((t-b.calFly)/(b.slot3-b.calFly)); const s=lerp(1,0.4,k)*Math.max(0.01,pop(t,b.cal0,0.3)); c.style.left=lerp(150,736,k)+"px"; c.style.top=lerp(560,160,k)+"px"; c.style.transform=`scale(${s})`}}
  // follow tap (the phone screen dims for a moment)
  const fA=b.fz0, fB=b.fz1; const fOn=t>fA&&t<fB; const fol=$("fol"); fol.style.opacity=fOn?clamp(Math.min((t-fA)/0.2,(fB-t)/0.12)):0;
  fol.style.transform=`scale(${Math.max(0.01,back((t-fA)/0.4))*(Math.abs(t-b.tFol)<0.1?0.9:1)})`;
  const bF=$("bF"); bF.textContent=t<b.tFol?"+ FOLLOW":"FOLLOWING ✓"; bF.className="btn"+(t<b.tFol?"":" done");
  {const hand=$("tapHand"); const hk=ease((t-fA-0.1)/Math.max(0.3,b.tFol-fA-0.2)); const dip=Math.max(0,1-Math.abs(t-b.tFol)/0.1);
   hand.style.opacity=fOn?clamp(Math.min((t-fA-0.05)/0.15,(fB-t)/0.12)):0; hand.style.transform=`translate(${lerp(900,560,hk)-50}px,${lerp(1600,1240,hk)+dip*12}px) rotate(${-8+dip*6}deg)`;
   const rg_=$("ring"), rk=(t-b.tFol)/0.45; rg_.style.opacity=fOn&&rk>0&&rk<1?1-rk:0; rg_.style.left="560px"; rg_.style.top="1240px"; rg_.style.transform=`scale(${1+rk*6})`}
  NKB.st.scr=(fOn&&t>b.tFol-0.2&&t<b.tFol+0.6)?0:1; if(fOn) NKB.draw();
  // theory question, countdown, the lock clock at 11:59, comment bubbles
  show("q",t>b.tTheory-0.05&&t<b.CD1,pop(t,b.tTheory-0.05,0.4));
  show("cnow",t>b.tCm-0.05&&t<b.CD1,Math.max(0.01,pop(t,b.tCm-0.05,0.35))*(1+0.05*Math.sin(t*Math.PI*4)));
  const cdk=t-b.CD0, sec=Math.floor(cdk), fr=cdk-sec; const cdOn=t>=b.CD0&&t<b.CD1;
  $("cdw").style.opacity=cdOn?clamp(cdk/0.15)*clamp((TL.countdown-cdk)/0.15):0;
  if(cdOn){const nn_=Math.max(1,TL.countdown-sec); $("digit").textContent=nn_; $("digit").style.transform=`scale(${lerp(1.5,1,out(fr/0.2))})`; $("digit").style.color=nn_<=1?"#FF5252":"#F5B347";
    $("arc").setAttribute("stroke-dasharray",`${590.6*(1-cdk/TL.countdown)} 590.6`); $("cdw").style.transform=`scale(${1+Math.exp(-fr*8)*0.08})`;
    $("chand").setAttribute("transform",`rotate(${(Math.floor(cdk*2)/2)*72})`)}
  show("cclk",cdOn,1+(fr<0.1?0.04:0));
  CB.forEach((_,i)=>{const e=$("cb"+i), t0=b.cb[i], k=pop(t,t0,0.3); const on=t>t0&&t<b.ring0; e.style.opacity=on?clamp((b.ring0-t)/0.15):0;
    e.style.transform=`translateY(${-(t-t0)*20}px) scale(${Math.max(0.01,k)}) rotate(${(i%2?3:-3)}deg)`});
  // Ananya calling... 11:59 PM (last second of the countdown -> he answers -> split)
  {const c=$("call"), on=t>b.ring0&&t<b.split0+0.2; c.style.opacity=on?clamp((b.split0+0.2-t)/0.2):0; c.style.transform=`scale(${Math.max(0.01,pop(t,b.ring0,0.3))}) rotate(${Math.sin(t*60)*1.5}deg)`}
  // reveal: the "recorded 16 Nov 2025" label flashes up big for 6 frames on "నువ్వే"
  $("recBig").style.opacity=t>=b.tNuvve&&t<b.tNuvve+0.2?1:0; $("recBig").style.transform=`scale(${lerp(1.2,1,clamp((t-b.tNuvve)/0.2))}) rotate(-2deg)`;
  // last year's chat (paper insert)
  {const c=$("lastchat"), on=sc==="bedPast"; c.style.opacity=on?1:0; c.style.transform=`scale(${Math.max(0.01,pop(t,b.fb3,0.3))}) rotate(-1deg)`;
   [["lm1",b.msg1],["lm2",b.msg2]].forEach(([id,t0])=>{const m=$(id); m.style.opacity=t>t0?1:0; m.style.transform=`scale(${Math.max(0.01,pop(t,t0,0.3))})`}); wfPlay("wf3",t>b.msg2?clamp((t-b.msg2)/0.7):0)}
  // clock flip 11:59 -> 12:00 AM
  {const c=$("flip"), on=sc==="bed"&&!loop&&t>=b.fb3e&&t<b.hall0; c.style.opacity=on?1:0; c.style.transform=`scale(${Math.max(0.01,pop(t,b.fb3e,0.3))}) rotate(2deg)`;
   const f=t>b.tFlip; $("flC").innerHTML=f?"12:00<small>AM</small>":"11:59<small>PM</small>"; $("flH").textContent=f?"📅 TODAY · MON 16":"📅 TOMORROW · MON 16";
   $("flC").style.transform=`perspective(500px) rotateX(${t>b.tFlip-0.12&&t<b.tFlip+0.12?lerp(-90,90,(t-b.tFlip+0.12)/0.24):0}deg)`; $("flH").style.color=f?"#FFD54F":"#9FC3FF"}
  // ✅ on "Correct ఆ?"
  {const c=$("check"), on=sc==="kitNow"&&t>b.tCheck&&t<b.sh0+0.2; c.style.opacity=on?1:0; c.style.transform=`scale(${Math.max(0.01,pop(t,b.tCheck,0.35))}) rotate(-8deg)`}
  // share: tag a friend
  {const shOn=t>b.sh0&&t<b.end0+0.1; const sh=$("share"); sh.style.opacity=shOn?clamp(Math.min((t-b.sh0)/0.2,(b.end0+0.1-t)/0.15)):0;
   $("sq").style.transform=`scale(${Math.max(0.01,back((t-b.sh0)/0.4))})`;
   const typed=t>b.tAt?(t>b.tTag+0.1?'<em>@Best friend 💛</em> ఇది నువ్వే!':"@"+(t>b.tAt+0.3?"Be":"")):"";
   $("cin").innerHTML=typed;
   ["ct1","ct2","ct3"].forEach((id,i)=>{const e=$(id), t0=b.tAt+0.1+i*0.08; e.style.opacity=t>t0?1:0; e.style.transform=`translateY(${lerp(30,0,out((t-t0)/0.25))}px) scale(${id==="ct1"&&Math.abs(t-b.tTag)<0.1?0.94:1})`; e.style.background=id==="ct1"&&t>b.tTag?"#FFF3B0":"#fff"});
   $("ok1").style.opacity=t>b.tTag+0.1?1:0}
  // end card with the follow tap (>= 1.2 s), then the hard cut to frame 1
  {const ec=$("endc"), eOn=t>b.end0&&t<b.loop0; ec.style.opacity=eOn?clamp((t-b.end0)/0.15):0;
   $("eF").textContent=t<b.tEF?"FOLLOW @_REELRASAM":"FOLLOWING ✓  @_REELRASAM"; $("eF").style.transform=`scale(${Math.abs(t-b.tEF)<0.1?0.92:1})`; $("eF").style.background=t<b.tEF?"":"#6D6875";
   const eh=$("eHand"), ek=ease((t-b.end0)/Math.max(0.2,b.tEF-b.end0-0.05)), edip=Math.max(0,1-Math.abs(t-b.tEF)/0.1);
   eh.style.opacity=eOn&&t<b.tEF+0.5?1:0; eh.style.transform=`translate(${lerp(900,500,ek)-50}px,${lerp(1300,800,ek)+edip*12}px) scale(${1-0.1*edip}) rotate(-8deg)`}
  // tap ring on the notification (frame 1 has none: the tap comes at 0.22 s)
  // flashes: cuts into/out of the flashbacks, the reveal, the warm door light, the loop cut
  const fl=(t0,d,a_)=>t>t0&&t<t0+d?a_*(1-(t-t0)/d):0;
  const f=$("flash"); const warm=t>=b.warm-0.1&&t<b.kit0+0.35; f.style.background=warm?"#FFC46B":"#fff";
  f.style.opacity=loop?0:(fl(b.fb1,0.15,0.6)+fl(b.fb1e,0.12,0.5)+fl(b.split0,0.15,0.5)+fl(b.fb2,0.15,0.6)+fl(b.fb3e,0.12,0.5)+fl(b.hall0,0.1,0.4)+
    (warm?clamp(1-Math.abs(t-b.kit0)/0.3):0)+fl(b.pull,0.12,0.25));
  // subtitles (… -> ...)
  const sub=$("sub"), L=curLine(t);
  if(L&&!(t>E(12)+0.02)){sub.style.opacity=1; const nm=L.i===0?"NIKHIL · 🎤 VOICE NOTE":NAMES[L.who]; sub.innerHTML=`<span class="who" style="background:${COLORS[L.who]}">${nm}</span><br>${L.text.replace(/…/g,"...")}`} else sub.style.opacity=0;
}

window.render=function(t){ frame(t) };
