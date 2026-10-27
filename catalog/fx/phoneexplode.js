// 移植自圖鑑 phoneexplode（手機爆炸圖，介面微動態）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("phoneexplode", {
  dur: 6.0,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { cl, eIO, rr, uiBg, uiText, UI_B } = K;
    const { Y } = K;
    {
uiBg(x,w,h);const tt=t%6,sp=eIO(cl((tt-.9)/1))-eIO(cl((tt-3.9)/.9)),cw=w*.2,ch=cw*1.9,L=[['#2A2F3B','Case'],['#1B6B52','Board'],['#fff','Display'],['rgba(160,200,255,.45)','Glass']];
  for(let i=0;i<4;i++){const z=(i-1.5)*h*.17*sp,Y=h*.52-z;x.save();x.translate(w*.42,Y);x.transform(.9,.38,-.9,.38,0,0);x.shadowColor='rgba(40,50,90,.2)';x.shadowBlur=10;x.shadowOffsetY=8;x.fillStyle=L[i][0];rr(x,-cw/2,-ch/2,cw,ch,cw*.12);x.restore();
    x.save();x.translate(w*.42,Y);x.transform(.9,.38,-.9,.38,0,0);if(i===2){x.fillStyle='#E6EEFF';rr(x,-cw*.4,-ch*.4,cw*.8,ch*.25,5);x.fillStyle=UI_B;rr(x,-cw*.4,-ch*.08,cw*.35,ch*.2,5);x.fillStyle='#FFD9C9';rr(x,cw*.02,-ch*.08,cw*.38,ch*.2,5)}
    if(i===1){x.fillStyle='#7BD88F';[[-.25,-.3],[.1,-.3],[-.25,.05]].forEach(([a,b])=>rr(x,cw*a,ch*b,cw*.3,ch*.2,3))}x.restore();x.save();x.globalAlpha=sp;uiText(x,L[i][1],w*.42+cw*1.1+10,Y,h*.05,'#5B6274',700,'left');x.restore()}
    }
  },
});
