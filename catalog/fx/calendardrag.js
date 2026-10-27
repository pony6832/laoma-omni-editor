// 移植自圖鑑 calendardrag（日曆拖曳預約，介面微動態）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("calendardrag", {
  dur: 6.0,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { cl, eIO, rr, uiBg, uiCard, uiText, uiCursor, UI_INK, UI_G } = K;
    {
uiBg(x,w,h);const tt=t%6,cw=w*.62,ch=h*.84,X=w/2-cw/2,Yp=h*.08;uiCard(x,X,Yp,cw,ch,14);const c0=X+cw*.18,colw=cw*.38;
  uiText(x,'Mon',c0+colw*.05,Yp+ch*.1,ch*.045,'#8A91A4',600,'left');uiText(x,'16',c0+colw*.3,Yp+ch*.1,ch*.09,UI_INK,800,'left');uiText(x,'Tue',c0+colw+colw*.05,Yp+ch*.1,ch*.045,'#8A91A4',600,'left');uiText(x,'17',c0+colw+colw*.3,Yp+ch*.1,ch*.09,'#8A91A4',800,'left');
  x.strokeStyle='#E6E9F2';x.lineWidth=1;for(let i=0;i<5;i++){const yy=Yp+ch*(.24+i*.15);x.beginPath();x.moveTo(X+cw*.05,yy);x.lineTo(X+cw*.95,yy);x.stroke();uiText(x,(9+i)+':00',X+cw*.05,yy+ch*.035,ch*.035,'#A0A7BA',500,'left')}
  const d=eIO(cl((tt-1.3)/1.2))*(1-eIO(cl((tt-4.8)/.8))),bw=colw*.9,bh=ch*.13,bx=c0+colw*.02+colw*d,by=Yp+ch*(.27+.3*d),booked=tt>2.6&&tt<4.9,mv=d>0&&d<1;
  x.save();x.shadowColor='rgba(120,80,220,.35)';x.shadowBlur=mv?14:6;x.shadowOffsetY=mv?8:2;x.fillStyle=booked?UI_G:'#8B5CF6';rr(x,bx,by,bw,bh,8);x.restore();uiText(x,booked?'Booked ✓':'Call with Sam',bx+bw*.08,by+bh/2,bh*.36,'#fff',700,'left');
  if(tt<3.2){const q=eIO(cl(tt/1.3)),px=tt<1.3?w*.9+(c0+colw*.5-w*.9)*q:bx+bw*.5,py=tt<1.3?h*.95+(Yp+ch*.33-h*.95)*q:by+bh*.5;uiCursor(x,px,py,h/190)}
    }
  },
});
