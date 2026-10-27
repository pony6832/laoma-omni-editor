// 移植自圖鑑 kpitrend（成長指標卡，介面微動態）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("kpitrend", {
  dur: 5.0,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { cl, eOC, eOB, rr, uiBg, uiCard, uiText, UI_B, UI_G } = K;
    {
uiBg(x,w,h);const tt=t%5,cw=w*.62,ch=h*.78,X=w/2-cw/2,Yp=h*.11;uiCard(x,X,Yp,cw,ch,16);uiText(x,'Weekly sign-ups',X+cw*.07,Yp+ch*.1,h*.05,'#5B6274',600,'left');
  const v=Math.round(200*eOC(cl(tt/1.8)));x.fillStyle='#DDF5E6';rr(x,X+cw*.07,Yp+ch*.18,cw*.42,ch*.16,ch*.08);uiText(x,'+'+v+'%',X+cw*.28,Yp+ch*.26,ch*.11,'#167A3E',800);
  const n=7,bx=X+cw*.07,bw=cw*.86/n,base=Yp+ch*.9,mh=ch*.46;for(let i=0;i<n;i++){const p=eOB(cl((tt-.3-i*.12)/.6)),hh=mh*(.2+.8*i/(n-1))*p,g=x.createLinearGradient(0,base-hh,0,base);g.addColorStop(0,'#5B8CFF');g.addColorStop(1,UI_B);x.fillStyle=g;rr(x,bx+i*bw+bw*.12,base-hh,bw*.76,hh,5)}
  const lp=cl((tt-1.2)/1.2);x.strokeStyle=UI_G;x.lineWidth=3;x.lineCap='round';x.beginPath();for(let i=0;i<n;i++){if(i/(n-1)>lp)break;const px=bx+i*bw+bw/2,py=base-mh*(.2+.8*i/(n-1))-9;i?x.lineTo(px,py):x.moveTo(px,py)}x.stroke();x.lineCap='butt'
    }
  },
});
