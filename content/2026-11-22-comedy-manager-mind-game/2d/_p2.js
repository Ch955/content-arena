// Ramesh's monitor on the back row: the 'SECONDARY ⭐' sticky (Ep 0 callback) + his helmet on the partition
const sticky=el("g",{transform:"translate(-70,1068) rotate(8) scale(.62)"},cubP);
el("rect",{x:-56,y:-34,width:112,height:68,fill:"#FFF176",stroke:INK,"stroke-width":3},sticky);
txt("SECONDARY",{x:0,y:-2,"font-family":"Anton","font-size":20,"text-anchor":"middle",fill:"#C62828"},sticky);
{const p=[]; for(let k=0;k<10;k++){const r=k%2?5:12, a=-Math.PI/2+k*Math.PI/5; p.push(`${(Math.cos(a)*r).toFixed(1)},${(Math.sin(a)*r+20).toFixed(1)}`)} el("polygon",{points:p.join(" "),fill:"#FFB300",stroke:INK,"stroke-width":1.5},sticky)}
{const h=el("g",{transform:"translate(-330,1128)"},cubP); helmetShape(h,0.8)}
