// 移植自圖鑑 cardexpand（卡片展開工作區，介面微動態）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("cardexpand", {
  dur: 5.0,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { cl, eIO, rr, uiBg, uiCard, uiText, UI_INK, UI_B } = K;
    {
uiBg(x,w,h);const tt=t%5,e=eIO(cl((tt-1)/.8))-eIO(cl((tt-4)/.7)),W0=w*.2,H0=h*.22,W1=w*.8,H1=h*.82,bw=W0+(W1-W0)*e,bh=H0+(H1-H0)*e,X=w/2-bw/2,Yp=h/2-bh/2;uiCard(x,X,Yp,bw,bh,10+8*e);
  if(e<.25){x.globalAlpha=1-e*4;uiText(x,'Q3 brief',X+bw*.12,Yp+bh*.35,bh*.2,UI_INK,700,'left');x.fillStyle='#E6E9F2';rr(x,X+bw*.12,Yp+bh*.6,bw*.6,bh*.07,3);x.globalAlpha=1}
  else{const a=cl((e-.5)/.5);x.globalAlpha=a;x.fillStyle='#F2F4FA';rr(x,X+4,Yp+4,bw*.2,bh-8,12);for(let i=0;i<4;i++){x.fillStyle=i==0?UI_B:'#D5DAE8';rr(x,X+bw*.04,Yp+bh*(.12+i*.1),bw*.12,bh*.045,4)}
    uiText(x,'Q3 brief',X+bw*.26,Yp+bh*.12,bh*.07,UI_INK,800,'left');for(let i=0;i<5;i++){x.fillStyle='#E6E9F2';rr(x,X+bw*.26,Yp+bh*(.24+i*.09),bw*(.62-.08*(i%3)),bh*.04,3)}x.fillStyle=UI_B;rr(x,X+bw*.26,Yp+bh*.74,bw*.18,bh*.09,8);uiText(x,'Open',X+bw*.35,Yp+bh*.785,bh*.04,'#fff',700);x.globalAlpha=1}
    }
  },
});
