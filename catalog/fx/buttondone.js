// 移植自圖鑑 buttondone（按鈕完成變形，介面微動態）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("buttondone", {
  dur: 4.0,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { cl, eIO, rr, uiBg, uiText, uiCursor, UI_B, UI_G } = K;
    {
uiBg(x,w,h);const tt=t%4,s=h/190,H0=h*.2,W0=w*.34,p=eIO(cl((tt-1.25)/.45))*(1-eIO(cl((tt-3.4)/.4))),bw=W0+(H0*1.05-W0)*p,press=(tt>1.05&&tt<1.3)?.94:1;
  x.save();x.translate(w/2,h/2);x.scale(press,press);x.shadowColor=p>.5?'rgba(45,190,96,.45)':'rgba(59,107,255,.45)';x.shadowBlur=18;x.shadowOffsetY=8;x.fillStyle=p>.5?UI_G:UI_B;rr(x,-bw/2,-H0/2,bw,H0,H0/2);x.restore();
  if(p<.5){x.globalAlpha=1-p*2;uiText(x,'Publish',w/2,h/2,H0*.4,'#fff',700);x.globalAlpha=1}else{const c=cl((tt-1.6)/.4),X=w/2-H0*.2;x.strokeStyle='#fff';x.lineWidth=H0*.09;x.lineCap='round';x.lineJoin='round';x.beginPath();x.moveTo(X,h/2);x.lineTo(X+H0*.14*Math.min(1,c*2),h/2+H0*.14*Math.min(1,c*2));if(c>.5)x.lineTo(X+H0*.14+H0*.3*(c-.5)*2,h/2+H0*.14-H0*.34*(c-.5)*2);x.stroke();x.lineCap='butt'}
  const q=cl((tt-1.7)/.8);if(q>0&&q<1){x.strokeStyle=`rgba(45,190,96,${1-q})`;x.lineWidth=3;x.beginPath();x.arc(w/2,h/2,H0*.55+q*H0*.8,0,7);x.stroke()}
  const cp=eIO(cl(tt/1.0));if(tt<2.4)uiCursor(x,w*.78+(w/2+W0*.2-w*.78)*cp,h*.85+(h/2+H0*.15-h*.85)*cp,s)
    }
  },
});
