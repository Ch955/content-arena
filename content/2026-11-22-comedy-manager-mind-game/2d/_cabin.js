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
