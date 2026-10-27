// 移植自圖鑑 glassfocus（毛玻璃列聚焦，介面微動態）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("glassfocus", {
  dur: 8.0,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { cl, eIO, rr, uiBg, uiCard, uiText, UI_INK } = K;
    {
uiBg(x,w,h);const T=2,k=Math.floor(t/T)%4,p=eIO(cl((t%T-1.2)/.6)),nx=(k+1)%4,pos=k+(nx-k)*p,cw=w*.62,ch=h*.8,X=w/2-cw/2,Yp=h*.1,R=[['Open rate','48%'],['Click rate','6.2%'],['Replies','31'],['Revenue','$4.2k']];
  uiCard(x,X,Yp,cw,ch,14);uiText(x,'Campaign report',X+cw*.06,Yp+ch*.1,ch*.06,UI_INK,800,'left');const rh=ch*.17,y0=Yp+ch*.22;
  R.forEach(([a,b],i)=>{const f=cl(1-Math.abs(i-pos));x.globalAlpha=.4+.6*f;uiText(x,a,X+cw*.08,y0+i*rh+rh/2,rh*.34,UI_INK,600,'left');uiText(x,b,X+cw*.92,y0+i*rh+rh/2,rh*(.34+.14*f),UI_INK,800,'right')});x.globalAlpha=1;
  const gy=y0+pos*rh;x.save();x.shadowColor='rgba(59,107,255,.25)';x.shadowBlur=14;x.fillStyle='rgba(255,255,255,.55)';rr(x,X+cw*.03,gy+2,cw*.94,rh-4,10);x.restore();x.strokeStyle='rgba(59,107,255,.55)';x.lineWidth=1.5;x.beginPath();x.roundRect?x.roundRect(X+cw*.03,gy+2,cw*.94,rh-4,10):x.rect(X+cw*.03,gy+2,cw*.94,rh-4);x.stroke()
    }
  },
});
