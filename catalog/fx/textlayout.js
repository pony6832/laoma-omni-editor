// 移植自圖鑑 textlayout（文字拆成版面，介面微動態）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("textlayout", {
  dur: 5.5,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { cl, eIO, rr, uiBg, uiCard, uiText, UI_INK } = K;
    {
uiBg(x,w,h);const tt=t%5.5,W_=['Design','that','moves','people'],e=eIO(cl((tt-1.4)/1.1))-eIO(cl((tt-4.3)/.9)),fs=h*.095,S=[[w*.19,h*.5],[w*.4,h*.5],[w*.59,h*.5],[w*.82,h*.5]],E=[[w*.2,h*.2],[w*.21,h*.56],[w*.5,h*.56],[w*.79,h*.56]];
  x.globalAlpha=e;uiCard(x,w*.08,h*.1,w*.84,h*.2,12);for(let i=0;i<3;i++){uiCard(x,w*.08+i*w*.29,h*.4,w*.26,h*.5,12);x.fillStyle='#E6E9F2';rr(x,w*.1+i*w*.29,h*.66,w*.2,h*.03,3);rr(x,w*.1+i*w*.29,h*.73,w*.14,h*.03,3)}x.globalAlpha=1;
  W_.forEach((s,i)=>{const p=cl(e*1.2-i*.05),X=S[i][0]+(E[i][0]-S[i][0])*p,Yp=S[i][1]+(E[i][1]-S[i][1])*p;uiText(x,s,X,Yp,fs*(1-.3*p),i===2?'#E2492F':UI_INK,800)})
    }
  },
});
