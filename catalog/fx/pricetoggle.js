// 移植自圖鑑 pricetoggle（月繳年繳切換，介面微動態）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("pricetoggle", {
  dur: 5.0,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { cl, eIO, rr, uiBg, uiCard, uiText, UI_INK } = K;
    {
uiBg(x,w,h);const tt=t%5,sw=eIO(cl((tt-1.2)/.5))-eIO(cl((tt-3.6)/.5)),cw=w*.5,ch=h*.74,X=w/2-cw/2,Yp=h*.13;uiCard(x,X,Yp,cw,ch,18);
  const tw=cw*.72,tx=w/2-tw/2,ty=Yp+ch*.1,th=ch*.13;x.fillStyle='#E6E9F2';rr(x,tx,ty,tw,th,th/2);x.save();x.shadowColor='rgba(0,0,0,.2)';x.shadowBlur=6;x.fillStyle='#fff';rr(x,tx+3+(tw/2-3)*sw,ty+3,tw/2-3,th-6,(th-6)/2);x.restore();
  uiText(x,'Monthly',tx+tw*.25,ty+th/2,th*.4,sw<.5?UI_INK:'#8A91A4',700);uiText(x,'Yearly',tx+tw*.75,ty+th/2,th*.4,sw>.5?UI_INK:'#8A91A4',700);
  uiText(x,'Pro',w/2,Yp+ch*.42,h*.055,'#5B6274',700);uiText(x,'$'+Math.round(29+261*sw),w/2,Yp+ch*.64,h*.17,UI_INK,800);
  x.globalAlpha=cl(sw);x.fillStyle='#DDF5E6';rr(x,w/2-cw*.26,Yp+ch*.8,cw*.52,ch*.11,ch*.055);uiText(x,'2 months free',w/2,Yp+ch*.855,ch*.055,'#167A3E',700);x.globalAlpha=1
    }
  },
});
