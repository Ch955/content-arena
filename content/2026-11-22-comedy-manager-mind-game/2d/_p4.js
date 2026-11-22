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
  B.m2=S(2)-0.05; B.brass=W0(2,5)-0.02; B.ting=E(2)+0.3;
  // GAME 1: honesty test
  B.g1=S(3)-0.5; B.gulp=E(3)+0.03; B.ooh=E(3)+0.33;
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
