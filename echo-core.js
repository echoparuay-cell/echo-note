/* ============================================================
   echo-core.js · v1.1
   แก่นคณิตศาสตร์ mod-12 ของนาฬิกาเสียง Echo Note
   คิดที่เดียว — ทุกหน้าเรียกใช้ผ่าน <script src="echo-core.js">
   ครอบคลุม: สี/ชื่อโน้ต · สเกล 4 ชนิด · โหมด 7 โหมด ·
             วงล้อหมุน (createWheel) · เสียง (playScale)
   ============================================================ */
var EchoCore=(function(){

/* ---------- ค่าคงที่สากล ---------- */
var COLORS=["#E11D2A","#E0218A","#8A2BE2","#2E4FD4","#15A6E8","#36C03F","#F2D02C","#F5901E","#EE5A24","#E8312A","#E0479E","#F178B6"];
var NOTE_EN=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
var NOTE_TH=["โด","โด#","เร","เร#","มี","ฟา","ฟา#","ซอล","ซอล#","ลา","ลา#","ที"];
var DUAL={1:"C\u266F/D\u266D",3:"D\u266F/E\u266D",6:"F\u266F/G\u266D",8:"G\u266F/A\u266D",10:"A\u266F/B\u266D"};

function mod12(n){return ((n%12)+12)%12;}
function noteLabel(pc){return DUAL[pc]||NOTE_EN[pc];}

/* ---------- สเกล 4 ชนิด ---------- */
var SCALES=[
  {id:"major",th:"เมเจอร์",en:"Major",iv:[0,2,4,5,7,9,11]},
  {id:"nat",th:"เนเชอรัลไมเนอร์",en:"Natural Minor",iv:[0,2,3,5,7,8,10]},
  {id:"har",th:"ฮาร์โมนิกไมเนอร์",en:"Harmonic Minor",iv:[0,2,3,5,7,8,11]},
  {id:"mel",th:"เมโลดิกไมเนอร์",en:"Melodic Minor",iv:[0,2,3,5,7,9,11]}
];

/* ---------- โหมด 7 โหมด = หมุนลายพิกัดเมเจอร์ ---------- */
var MAJOR_IV=[0,2,4,5,7,9,11];
function modeIv(k){
  var out=[],j;
  for(j=0;j<7;j++)out.push(mod12(MAJOR_IV[(j+k)%7]-MAJOR_IV[k]));
  out.sort(function(a,b){return a-b;});
  return out;
}
var MODE_NAMES=[["Ionian","ไอโอเนียน"],["Dorian","โดเรียน"],["Phrygian","ฟรีเจียน"],["Lydian","ลิเดียน"],["Mixolydian","มิกโซลิเดียน"],["Aeolian","เอโอเลียน"],["Locrian","โลเครียน"]];
var MODES=[];
(function(){
  for(var k=0;k<7;k++)MODES.push({id:MODE_NAMES[k][0].toLowerCase(),en:MODE_NAMES[k][0],th:MODE_NAMES[k][1],deg:k,iv:modeIv(k)});
})();
/* เมเจอร์แม่ของโหมด: โหมด deg k ที่โทนิก t → โน้ตชุดเดียวกับเมเจอร์ของ (t - MAJOR_IV[k]) */
function relativeMajor(tonic,deg){return mod12(tonic-MAJOR_IV[deg]);}

/* ---------- เรขาคณิตวงล้อ ---------- */
var CX=200,CY=200,RO=185,RI=118;
function xy(deg,r){var t=(deg-90)*Math.PI/180;return [CX+r*Math.cos(t),CY+r*Math.sin(t)];}
function sec(i){var a0=i*30-15,a1=i*30+15,o0=xy(a0,RO),o1=xy(a1,RO),n1=xy(a1,RI),n0=xy(a0,RI);
  return "M "+o0[0]+" "+o0[1]+" A "+RO+" "+RO+" 0 0 1 "+o1[0]+" "+o1[1]+" L "+n1[0]+" "+n1[1]+" A "+RI+" "+RI+" 0 0 0 "+n0[0]+" "+n0[1]+" Z";}

/* ---------- CSS ของวงล้อ (ฉีดครั้งเดียว) ---------- */
function injectCSS(){
  if(document.getElementById("ec-style"))return;
  var st=document.createElement("style");st.id="ec-style";
  st.textContent=".ec-ring{transform-box:view-box;transform-origin:200px 200px;transition:transform .9s cubic-bezier(.45,0,.2,1)}"+
    ".ec-lbl{transform-box:view-box;transition:transform .9s cubic-bezier(.45,0,.2,1)}"+
    ".ec-seg{transition:fill-opacity .5s, stroke .5s;cursor:pointer}"+
    "@media (prefers-reduced-motion: reduce){.ec-ring,.ec-lbl,.ec-seg{transition:none}}";
  document.head.appendChild(st);
}

/* ---------- โรงงานวงล้อ: หน้าไหนก็เรียกได้ ---------- */
/* var w=EchoCore.createWheel(el); w.onTap(fn); w.set(tonic,iv); */
function createWheel(container){
  injectCSS();
  var s='<svg viewBox="0 0 400 400" style="width:100%;max-width:300px;height:auto;display:block;margin:0 auto">';
  s+='<circle cx="200" cy="200" r="'+(RO+8)+'" fill="none" stroke="#1b2547" stroke-width="3"/>';
  s+='<g class="ec-ring">';
  var i;
  for(i=0;i<12;i++){
    s+='<path class="ec-seg" data-pc="'+i+'" d="'+sec(i)+'" fill="'+COLORS[i]+'"/>';
    var pEn=xy(i*30,(RO+RI)/2+6),pTh=xy(i*30,RI+16);
    s+='<g class="ec-lbl" data-pc="'+i+'" style="transform-origin:'+pEn[0]+'px '+((pEn[1]+pTh[1])/2)+'px">';
    s+='<text x="'+pEn[0]+'" y="'+(pEn[1]+6)+'" text-anchor="middle" font-size="19" font-weight="800" fill="#fff" pointer-events="none">'+NOTE_EN[i]+'</text>';
    s+='<text x="'+pTh[0]+'" y="'+(pTh[1]+3)+'" text-anchor="middle" font-size="9.5" font-weight="600" fill="#ffe9b8" pointer-events="none">'+NOTE_TH[i]+'</text>';
    s+='</g>';
  }
  s+='</g>';
  for(i=0;i<12;i++){
    var pN=xy(i*30,RO-12);
    s+='<text x="'+pN[0]+'" y="'+(pN[1]+4)+'" text-anchor="middle" font-size="12" font-weight="800" fill="'+(i===0?"#E8C547":"#7a86a8")+'" pointer-events="none">'+(i===0?12:i)+'</text>';
  }
  s+='<polygon class="ec-hole" fill="#05070f" fill-opacity="0.88" stroke="#E8C547" stroke-width="3" stroke-linejoin="round" pointer-events="none"/>';
  var top=xy(0,RI);
  s+='<circle cx="'+top[0]+'" cy="'+top[1]+'" r="7" fill="#E8C547" pointer-events="none"/>';
  s+='<circle cx="200" cy="200" r="7" fill="#E8C547" pointer-events="none"/>';
  s+='</svg>';
  container.innerHTML=s;

  var ring=container.querySelector(".ec-ring"),
      hole=container.querySelector(".ec-hole"),
      segs=container.querySelectorAll(".ec-seg"),
      lbls=container.querySelectorAll(".ec-lbl"),
      rot=0, holeIv=null, tapCb=null;

  segs.forEach?null:null;
  for(i=0;i<segs.length;i++){
    (function(el){el.addEventListener("click",function(){if(tapCb)tapCb(parseInt(el.getAttribute("data-pc"),10));});})(segs[i]);
  }

  function holePts(iv){var p="",j;for(j=0;j<iv.length;j++){var v=xy(iv[j]*30,RI);p+=v[0]+","+v[1]+" ";}return p;}
  function morph(toIv){
    if(!holeIv){holeIv=toIv.slice();hole.setAttribute("points",holePts(toIv));return;}
    var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(reduce||holeIv.length!==toIv.length){holeIv=toIv.slice();hole.setAttribute("points",holePts(toIv));return;}
    var from=holeIv.slice(),t0=null,DUR=380;
    function step(ts){
      if(!t0)t0=ts;
      var t=Math.min(1,(ts-t0)/DUR),e=1-Math.pow(1-t,3),cur=[],j;
      for(j=0;j<from.length;j++)cur.push(from[j]+(toIv[j]-from[j])*e);
      hole.setAttribute("points",holePts(cur));
      if(t<1)requestAnimationFrame(step);else holeIv=toIv.slice();
    }
    requestAnimationFrame(step);
  }
  function set(tonic,iv){
    var target=-tonic*30,best=target;
    while(best-rot>180)best-=360;
    while(best-rot<-180)best+=360;
    rot=best;
    ring.style.transform="rotate("+rot+"deg)";
    var j;
    for(j=0;j<lbls.length;j++)lbls[j].style.transform="rotate("+(-rot)+"deg)";
    morph(iv);
    var member={},k;
    for(k=0;k<iv.length;k++)member[mod12(tonic+iv[k])]=1;
    for(j=0;j<segs.length;j++){
      var pc=parseInt(segs[j].getAttribute("data-pc"),10),lit=!!member[pc],isT=(pc===tonic);
      segs[j].setAttribute("fill-opacity",lit?1:0.16);
      segs[j].setAttribute("stroke",isT?"#fff":(lit?"#E8C547":"#05070f"));
      segs[j].setAttribute("stroke-width",isT?3.5:(lit?2:1.2));
      lbls[j].style.opacity=lit?1:0.4;
    }
  }
  return {set:set,onTap:function(cb){tapCb=cb;}};
}

/* ---------- เสียง: ไล่สเกลขาขึ้น + ปิดอ็อกเทฟ ---------- */
var ac=null;
function playScale(tonic,iv){
  if(!ac)ac=new (window.AudioContext||window.webkitAudioContext)();
  var base=60+tonic,seq=iv.concat([12]),STEP=0.22,i;
  for(i=0;i<seq.length;i++){
    (function(k){
      var t=ac.currentTime+k*STEP,f=440*Math.pow(2,(base+seq[k]-69)/12);
      var o=ac.createOscillator(),g=ac.createGain();
      o.type="triangle";o.frequency.value=f;
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.16,t+0.02);g.gain.exponentialRampToValueAtTime(0.001,t+STEP*1.9);
      o.connect(g);g.connect(ac.destination);o.start(t);o.stop(t+STEP*2);
    })(i);
  }
}

/* ---------- เสียงโน้ตเดี่ยว (feedback ตอนแต้มพิกัด) ---------- */
function playNote(semitoneAboveC4){
  if(!ac)ac=new (window.AudioContext||window.webkitAudioContext)();
  var t=ac.currentTime,f=440*Math.pow(2,(60+semitoneAboveC4-69)/12);
  var o=ac.createOscillator(),g=ac.createGain();
  o.type="triangle";o.frequency.value=f;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(0.16,t+0.02);g.gain.exponentialRampToValueAtTime(0.001,t+0.5);
  o.connect(g);g.connect(ac.destination);o.start(t);o.stop(t+0.55);
}

return {
  COLORS:COLORS,NOTE_EN:NOTE_EN,NOTE_TH:NOTE_TH,DUAL:DUAL,
  SCALES:SCALES,MODES:MODES,MAJOR_IV:MAJOR_IV,
  mod12:mod12,noteLabel:noteLabel,relativeMajor:relativeMajor,
  createWheel:createWheel,playScale:playScale,playNote:playNote
};
})();
