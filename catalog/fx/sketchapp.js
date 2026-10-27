// 移植自圖鑑 sketchapp（草圖變 App，介面微動態）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("sketchapp", {
  dur: 6.0,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { cl, eIO, rr, uiBg, uiCard, uiText, UI_INK, UI_B } = K;
    {
uiBg(x,w,h);const tt=t%6,p=eIO(cl((tt-.9)/1.6))*(1-eIO(cl((tt-4.8)/.8))),pw=w*.34,ph=h*.9,X=w/2-pw/2,Yp=h*.05,R=pw*.27,cx=w/2,cy=Yp+ph*.4;
  const sr=(a,b,c,d,r)=>{x.beginPath();x.roundRect?x.roundRect(a,b,c,d,r):x.rect(a,b,c,d);x.stroke()};
  x.save();x.globalAlpha=Math.max(0,1-p*.9);x.strokeStyle='#8A91A4';x.lineWidth=1.4;x.setLineDash([5,4]);sr(X,Yp,pw,ph,pw*.12);sr(X+pw*.1,Yp+ph*.07,pw*.5,ph*.04,3);x.beginPath();x.arc(cx,cy,R,0,7);x.stroke();sr(X+pw*.1,Yp+ph*.66,pw*.38,ph*.2,8);sr(X+pw*.52,Yp+ph*.66,pw*.38,ph*.2,8);x.restore();
  x.save();x.globalAlpha=p;uiCard(x,X,Yp,pw,ph,pw*.12);uiText(x,'Daily Focus',X+pw*.1,Yp+ph*.09,ph*.045,UI_INK,700,'left');x.lineWidth=R*.18;x.strokeStyle='#E3E8F5';x.beginPath();x.arc(cx,cy,R,0,7);x.stroke();x.strokeStyle=UI_B;x.lineCap='round';x.beginPath();x.arc(cx,cy,R,-Math.PI/2,-Math.PI/2+Math.PI*2*.86*p);x.stroke();x.lineCap='butt';uiText(x,Math.round(86*p)+'%',cx,cy,R*.5,UI_INK,800);
  [['Sleep','3h 40m'],['Streak','12']].forEach(([a,b],i)=>{const bx=X+pw*(.1+i*.42),by=Yp+ph*.66;x.fillStyle='#F2F4FA';rr(x,bx,by,pw*.38,ph*.2,8);uiText(x,a,bx+pw*.04,by+ph*.06,ph*.032,'#8A91A4',600,'left');uiText(x,b,bx+pw*.04,by+ph*.14,ph*.065,UI_INK,800,'left')});x.restore()
    }
  },
});
