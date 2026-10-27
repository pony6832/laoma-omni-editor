// 移植自圖鑑 ringclose（圓環閉合達標，介面微動態）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("ringclose", {
  dur: 5.0,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { cl, eOC, eOB, uiBg, uiText, UI_INK, UI_G } = K;
    {
uiBg(x,w,h);const tt=t%5,cx=w/2,cy=h/2,R=h*.3,p=eOC(cl((tt-.3)/2.2)),done=cl((tt-2.5)/.4),Lw=R*.28;x.lineWidth=Lw;x.strokeStyle='#D8F0E0';x.beginPath();x.arc(cx,cy,R,0,7);x.stroke();
  x.strokeStyle=UI_G;x.lineCap='round';x.beginPath();x.arc(cx,cy,R,-Math.PI/2,-Math.PI/2+Math.PI*2*p);x.stroke();x.lineCap='butt';
  if(done>0){const e=eOB(done),f=Math.min(1,e);x.fillStyle=UI_G;x.beginPath();x.arc(cx,cy,(R-Lw*.5)*f,0,7);x.fill();uiText(x,'Goal',cx,cy-R*.14,R*.34*f,'#fff',800);uiText(x,'hit',cx,cy+R*.22,R*.34*f,'#fff',800);
    const q=eOC(cl((tt-2.5)/1));for(let i=0;i<10;i++){const a=i/10*Math.PI*2,dd=R*(1.25+.5*q);x.fillStyle=`rgba(45,190,96,${1-q})`;x.beginPath();x.arc(cx+Math.cos(a)*dd,cy+Math.sin(a)*dd,3*(1-q)+1,0,7);x.fill()}}else uiText(x,Math.round(p*100)+'%',cx,cy,R*.5,UI_INK,800)
    }
  },
});
