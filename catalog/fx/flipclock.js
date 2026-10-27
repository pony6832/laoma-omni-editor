// 移植自圖鑑 flipclock（翻牌數字，數據圖表）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("flipclock", {
  dur: 4.0,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { cl, eIO, rr } = K;
    const { FG } = K;
    const BG = K.BG === null ? "#12151D" : K.BG;
    const clear = (x, w, h) => K.clear(x, w, h);
    {
clear(x,w,h);const v=Math.floor(t),p=eIO(cl((t%1)/.4)),N=String(v%100).padStart(2,'0'),O=String((v+99)%100).padStart(2,'0'),cw=h*.4,ch=h*.56,gap=12,Yp=h/2-ch/2;
  for(let i=0;i<2;i++){const X=w/2-cw-gap/2+i*(cw+gap),card=(d,y0,y1)=>{x.save();x.beginPath();x.rect(X,y0,cw,y1-y0);x.clip();x.fillStyle='#232937';rr(x,X,Yp,cw,ch,10);x.fillStyle=FG;x.font=`700 ${ch*.7}px Unbounded,sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillText(d,X+cw/2,h/2+ch*.03);x.restore()};
    card(N[i],Yp,h/2);if(p<1){card(O[i],h/2,Yp+ch);const half=p<.5,s=half?1-p*2:(p-.5)*2;x.save();x.translate(0,h/2);x.scale(1,Math.max(.001,s));x.translate(0,-h/2);half?card(O[i],Yp,h/2):card(N[i],h/2,Yp+ch);x.restore()}else card(N[i],h/2,Yp+ch);
    x.fillStyle=BG;x.fillRect(X,h/2-1,cw,2)}
    }
  },
});
