// 移植自圖鑑 paybutton（支付按鈕狀態，介面微動態）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("paybutton", {
  dur: 5.0,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { cl, eIO, rr, uiBg, uiText, uiCursor, UI_G } = K;
    {
uiBg(x,w,h);const tt=t%5,H0=h*.2,W0=w*.42,a=eIO(cl((tt-1.3)/.4)),b=eIO(cl((tt-2.7)/.4)),k=a-b,bw=W0+(H0-W0)*k,al=Math.min(cl(tt/.3),1-cl((tt-4.4)/.3)),press=(tt>1.1&&tt<1.35)?.95:1;
  x.globalAlpha=al;x.save();x.translate(w/2,h/2);x.scale(press,press);x.shadowColor='rgba(80,70,220,.4)';x.shadowBlur=18;x.shadowOffsetY=8;x.fillStyle=b>.5?UI_G:'#5B4BFF';rr(x,-bw/2,-H0/2,bw,H0,H0/2);x.restore();
  if(k<.25&&b<.5){x.globalAlpha=al*(1-k*4);uiText(x,'Pay $48.00',w/2,h/2,H0*.36,'#fff',700);x.globalAlpha=al}else if(tt<2.7&&k>.75){x.strokeStyle='#fff';x.lineWidth=H0*.08;x.lineCap='round';x.beginPath();x.arc(w/2,h/2,H0*.25,t*7,t*7+4.2);x.stroke();x.lineCap='butt'}
  if(b>.5){const c=cl((tt-3.0)/.4),X=w/2-W0*.2;x.strokeStyle='#fff';x.lineWidth=H0*.08;x.lineCap='round';x.lineJoin='round';x.beginPath();x.moveTo(X,h/2);x.lineTo(X+H0*.12*Math.min(1,c*2),h/2+H0*.12*Math.min(1,c*2));if(c>.5)x.lineTo(X+H0*.12+H0*.26*(c-.5)*2,h/2+H0*.12-H0*.3*(c-.5)*2);x.stroke();x.lineCap='butt';uiText(x,'Paid',w/2+W0*.08,h/2,H0*.4,'#fff',700)}
  if(tt<1.3){const q=eIO(cl(tt/1));uiCursor(x,w*.75+(w*.55-w*.75)*q,h*.85+(h*.55-h*.85)*q,h/190)}x.globalAlpha=1
    }
  },
});
