// 移植自圖鑑 springstack（彈簧疊牌，介面微動態）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("springstack", {
  dur: 5.0,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, cl, eOB, eIO, rr, uiBg, uiText, UI_INK } = K;
    const { A } = K;
    {
uiBg(x,w,h);const tt=t%5,cw=w*.26,ch=h*.5,C=['#FFD9C9','#CFE0FF','#fff'],ang=[-.22,.18,-.02],dx=[-w*.2,w*.2,0];
  [0,1,2].forEach(i=>{const p=eOB(cl((tt-.5-i*.18)/.7))-eIO(cl((tt-3.8-(2-i)*.1)/.6)),px=w/2+dx[i]*p,py=h/2,a=ang[i]*p;x.save();x.translate(px,py);x.rotate(a);x.shadowColor='rgba(40,50,90,.22)';x.shadowBlur=18;x.shadowOffsetY=8;x.fillStyle=C[i];rr(x,-cw/2,-ch/2,cw,ch,14);x.restore();
    if(i===2){x.save();x.translate(px,py);x.rotate(a);x.fillStyle=rgb(A);x.beginPath();x.arc(0,-ch*.12,cw*.26,0,7);x.fill();uiText(x,'Summer kit',0,ch*.2,ch*.07,UI_INK,800);uiText(x,'$24',-cw*.2,ch*.35,ch*.09,UI_INK,800);x.fillStyle=UI_INK;x.beginPath();x.arc(cw*.28,ch*.35,ch*.065,0,7);x.fill();uiText(x,'✓',cw*.28,ch*.35,ch*.07,'#fff',800);x.restore()}})
    }
  },
});
