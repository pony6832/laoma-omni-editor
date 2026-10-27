// 移植自圖鑑 particlefunnel（粒子漏斗，介面微動態）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("particlefunnel", {
  dur: 5.0,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { cl, eOC, rnd, uiBg, uiCard, uiText, UI_INK, UI_B } = K;
    {
uiBg(x,w,h);const cx=w/2,top=h*.1,neck=h*.5,bot=h*.64,fw=w*.34,nw=w*.035,tt=t%5;x.fillStyle='rgba(59,107,255,.10)';x.beginPath();x.moveTo(cx-fw,top);x.lineTo(cx+fw,top);x.lineTo(cx+nw,neck);x.lineTo(cx+nw,bot);x.lineTo(cx-nw,bot);x.lineTo(cx-nw,neck);x.closePath();x.fill();
  for(let i=0;i<110;i++){const ph=(t*.45+rnd(i))%1,yy=top+(bot-top)*ph,u=cl((yy-top)/(neck-top)),half=fw*(1-u)+nw*u,xx=cx+(rnd(i+9)-.5)*1.9*half;x.fillStyle=UI_B;x.globalAlpha=.35+.65*rnd(i+5);x.beginPath();x.arc(xx,yy,1.4+1.4*rnd(i+3),0,7);x.fill()}x.globalAlpha=1;
  const v=Math.round(600*eOC(cl(tt/3.5)));uiCard(x,cx-w*.15,h*.72,w*.3,h*.2,12);uiText(x,String(v),cx-w*.035,h*.82,h*.1,UI_INK,800);uiText(x,'sales',cx+w*.085,h*.84,h*.045,'#8A91A4',600)
    }
  },
});
