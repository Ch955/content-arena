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
const RAM_X=120, PRI_X=330, MG_X=760, SUR_X=960, COOL_X=455, CHAIR_X=-190, DOOR_X=1180;
// blur for the dancing manager behind Ramesh's close-up (L16)
{const f=el("filter",{id:"bgBlur",x:"-30%",y:"-30%",width:"160%",height:"160%"},defs); el("feGaussianBlur",{stdDeviation:7},f)}

// ===== OPEN OFFICE (x -900..2300) =====
el("rect",{x:-1100,y:-900,width:3600,height:2300,fill:"#EAF3F8"},W);
el("rect",{x:-1100,y:1380,width:3600,height:22,fill:"#B7C6D3"},W);
el("rect",{x:-1100,y:1402,width:3600,height:1400,fill:"#CDD7E0"},W);
for(let k=0;k<16;k++) el("line",{x1:-1100+k*260,y1:1402,x2:-1600+k*360,y2:2600,stroke:"#BCC8D3","stroke-width":5},W);
for(let y=1480;y<2400;y+=110) el("line",{x1:-1100,y1:y,x2:2500,y2:y,stroke:"#BCC8D3","stroke-width":4},W);
// Ep 1 leftover: a paper star on a string, drooping (static)
const starG=el("g",{transform:"translate(980,330) rotate(150)"},W);
el("line",{x1:0,y1:-160,x2:0,y2:-62,stroke:INK,"stroke-width":3},starG);
{const p=[]; for(let k=0;k<10;k++){const r=k%2?26:64, a=-Math.PI/2+k*Math.PI/5; p.push(`${(Math.cos(a)*r).toFixed(1)},${(Math.sin(a)*r).toFixed(1)}`)}
 el("polygon",{points:p.join(" "),fill:"#FFD54F",stroke:INK,"stroke-width":5,"stroke-linejoin":"round"},starG)}
