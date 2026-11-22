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
