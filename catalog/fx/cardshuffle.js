// 移植自圖鑑 cardshuffle（卡片洗牌，介面微動態）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("cardshuffle", {
  dur: 5.2,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { cl, eIO, rr, uiBg, uiText } = K;
    {
uiBg(x,w,h);const T=1.3,k=Math.floor(t/T),p=eIO(cl((t%T-.3)/.8)),cw=w*.3,ch=h*.5,G=[['#FF9A6B','#FF5E8A'],['#8B5CF6','#5B8CFF'],['#34D399','#3B82F6'],['#FBBF24','#F97316']];
  const I=[0,1,2,3].map(j=>({id:(k+j)%4,r:j===0?3*p:j-p,sd:j===0?Math.sin(p*Math.PI)*w*.2:0})).sort((a,b)=>b.r-a.r);
  I.forEach(o=>{const X=w/2-w*.1+o.r*w*.06+o.sd,Yp=h/2+h*.02-o.r*h*.035,s=1-o.r*.05,g=x.createLinearGradient(X-cw/2,Yp-ch/2,X+cw/2,Yp+ch/2);g.addColorStop(0,G[o.id][0]);g.addColorStop(1,G[o.id][1]);x.save();x.translate(X,Yp);x.scale(s,s);x.shadowColor='rgba(40,50,90,.25)';x.shadowBlur=16;x.shadowOffsetY=8;x.fillStyle=g;rr(x,-cw/2,-ch/2,cw,ch,14);x.restore();x.save();x.translate(X,Yp);x.scale(s,s);uiText(x,'0'+(o.id+1),-cw*.28,-ch*.3,ch*.14,'rgba(255,255,255,.9)',800,'left');x.restore()})
    }
  },
});
