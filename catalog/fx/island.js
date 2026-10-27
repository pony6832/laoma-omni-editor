// 移植自圖鑑 island（動態島展開，介面微動態）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：["LIVE"]。原版的 t%T 循環與數字未改動。
fxDefine("island", {
  dur: 5.0,
  defaults: { T: ["LIVE"], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { cl, eOB, eIO, rr, uiBg, uiText, UI_B } = K;
    {
uiBg(x,w,h);const pw=w*.34,ph=h*.92,X=w/2-pw/2,Yp=h*.04;x.fillStyle='#D9DDE8';rr(x,X,Yp,pw,ph,pw*.14);const g=x.createLinearGradient(X,Yp,X+pw,Yp+ph);g.addColorStop(0,'#FFD9C9');g.addColorStop(.5,'#E4D8FF');g.addColorStop(1,'#CFE0FF');x.fillStyle=g;rr(x,X+4,Yp+4,pw-8,ph-8,pw*.12);
  const tt=t%5,e=Math.max(0,eOB(cl((tt-.6)/.6))-eIO(cl((tt-3.6)/.5))),iw=pw*(.28+.5*e),ih=ph*(.045+.12*e),ix=w/2-iw/2,iy=Yp+ph*.03;x.fillStyle='#000';rr(x,ix,iy,iw,ih,Math.min(iw,ih)/2);
  if(e>.6){x.globalAlpha=cl((e-.6)/.4);x.fillStyle='#FF3B30';x.beginPath();x.arc(ix+iw*.13,iy+ih*.36,ih*.09*(1+.3*Math.sin(t*8)),0,7);x.fill();uiText(x,'LIVE',w/2,iy+ih*.36,ih*.3,'#fff',800);uiText(x,'Webinar starts now',w/2,iy+ih*.74,ih*.12,'rgba(255,255,255,.7)',500);x.globalAlpha=1}
  [UI_B,'#2A2F3B','#FFC857','#FF6A4D'].forEach((c,k)=>{x.fillStyle=c;rr(x,X+pw*(.1+k*.22),Yp+ph*.84,pw*.18,pw*.18,pw*.045)})
    }
  },
});
