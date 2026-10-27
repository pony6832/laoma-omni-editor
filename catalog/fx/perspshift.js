// 移植自圖鑑 perspshift（透視層疊位移，介面微動態）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("perspshift", {
  dur: 5.0,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, cl, eIO, rr, uiBg, UI_B } = K;
    const { A } = K;
    {
uiBg(x,w,h);const tt=t%5,sp=eIO(cl((tt-.8)/.9))-eIO(cl((tt-3.4)/.9)),cw=w*.34,F=['#fff','#EAF0FF','#FFE7DF'],K=[UI_B,'#8B5CF6',rgb(A)];
  for(let i=2;i>=0;i--){const z=(i-1)*h*.16*(.35+sp*.9);x.save();x.translate(w/2,h*.52-z);x.transform(.9,.38,-.9,.38,0,0);x.shadowColor='rgba(40,50,90,.18)';x.shadowBlur=14;x.shadowOffsetY=10;x.fillStyle=F[i];rr(x,-cw/2,-cw*.375,cw,cw*.75,12);x.restore();
    x.save();x.translate(w/2,h*.52-z);x.transform(.9,.38,-.9,.38,0,0);x.fillStyle=K[i];rr(x,-cw*.4,-cw*.3,cw*.35,cw*.07,3);x.fillStyle='#D5DAE8';rr(x,-cw*.4,-cw*.15,cw*.7,cw*.05,3);rr(x,-cw*.4,-cw*.04,cw*.55,cw*.05,3);x.restore()}
    }
  },
});
