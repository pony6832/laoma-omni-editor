// 移植自圖鑑 dashzoom（儀表板聚焦推近，介面微動態）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("dashzoom", {
  dur: 6.0,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { cl, eIO, uiBg, uiCard, uiText, UI_INK, UI_G } = K;
    {
uiBg(x,w,h);const tt=t%6,z=eIO(cl((tt-1)/.9))-eIO(cl((tt-3.8)/.9)),s=1+1.35*z,T4=[['Open rate','48%'],['Click rate','6.2%'],['Replies','31'],['Revenue','$4.2k']],tw=w*.3,th=h*.3,gx=w*.03,gy=h*.04,X0=w/2-tw-gx/2,Y0=h/2-th-gy/2,fi=1,fx=X0+(fi%2)*(tw+gx)+tw/2,fy=Y0+Math.floor(fi/2)*(th+gy)+th/2,qx=w/2+(fx-w/2)*z,qy=h/2+(fy-h/2)*z;
  x.save();x.translate(w/2-s*qx,h/2-s*qy);x.scale(s,s);T4.forEach(([a,b],i)=>{const X=X0+(i%2)*(tw+gx),Yp=Y0+Math.floor(i/2)*(th+gy),hl=i===fi;x.globalAlpha=hl?1:1-.55*z;uiCard(x,X,Yp,tw,th,10);uiText(x,a,X+tw*.08,Yp+th*.25,th*.13,'#8A91A4',600,'left');uiText(x,b,X+tw*.08,Yp+th*.62,th*.3,hl&&z>.5?UI_G:UI_INK,800,'left');
    if(hl&&z>.3){x.strokeStyle=`rgba(59,107,255,${z})`;x.lineWidth=2/s;x.beginPath();x.roundRect?x.roundRect(X,Yp,tw,th,10):x.rect(X,Yp,tw,th);x.stroke()}});x.globalAlpha=1;x.restore()
    }
  },
});
