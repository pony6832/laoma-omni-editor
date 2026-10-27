// 移植自圖鑑 chartmorph（圖表形態變換，介面微動態）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("chartmorph", {
  dur: 5.2,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, cl, eIO, rr, uiBg, uiCard, uiText, UI_B } = K;
    const { A } = K;
    {
uiBg(x,w,h);const tt=t%5.2,m=eIO(cl((tt-1.1)/1.1))-eIO(cl((tt-3.6)/1.1)),cw=w*.7,ch=h*.78,X=w/2-cw/2,Yp=h*.11;uiCard(x,X,Yp,cw,ch,14);uiText(x,'Weekly reach',X+cw*.06,Yp+ch*.1,ch*.055,'#5B6274',700,'left');
  const V=[.35,.5,.42,.68,.6,.82,.95],n=7,bx=X+cw*.08,bw=cw*.84/n,base=Yp+ch*.86,mh=ch*.55,P=V.map((v,i)=>[bx+i*bw+bw/2,base-v*mh]);
  if(m>.02){x.save();x.globalAlpha=m;const g=x.createLinearGradient(0,Yp+ch*.3,0,base);g.addColorStop(0,'rgba(59,107,255,.28)');g.addColorStop(1,'rgba(59,107,255,0)');x.fillStyle=g;x.beginPath();x.moveTo(P[0][0],base);P.forEach(p=>x.lineTo(p[0],p[1]));x.lineTo(P[n-1][0],base);x.closePath();x.fill();x.strokeStyle=UI_B;x.lineWidth=3;x.lineJoin='round';x.beginPath();P.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.stroke();x.restore()}
  const r=5;for(let i=0;i<n;i++){const wd=bw*.62*(1-m)+2*r*m,hh=(base-P[i][1])*(1-m)+2*r*m,ty=P[i][1]-r*m;x.fillStyle=i===n-1?rgb(A):UI_B;rr(x,P[i][0]-wd/2,ty,wd,hh,wd/2*m+4*(1-m))}
    }
  },
});
