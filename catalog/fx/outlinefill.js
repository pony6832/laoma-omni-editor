// 移植自圖鑑 outlinefill（描邊注滿字，文字標題）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：["FILL UP"]。原版的 t%T 循環與數字未改動。
fxDefine("outlinefill", {
  dur: 4.0,
  defaults: { T: ["FILL UP"], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, cl, eIO } = K;
    const { A, FG } = K;
    const clear = (x, w, h) => K.clear(x, w, h);
    {
clear(x,w,h);const s='FILL UP',fs=Math.min(h*.3,w*.17),tt=t%4,p=eIO(cl((tt-.6)/2.2))*(1-cl((tt-3.5)/.4));x.font=`700 ${fs}px Unbounded,sans-serif`;x.textAlign='center';x.textBaseline='middle';
  x.lineWidth=2;x.strokeStyle=FG;x.strokeText(s,w/2,h/2);const top=h/2+fs*.45-p*fs*1.0;x.save();x.beginPath();x.moveTo(0,h);for(let X=0;X<=w;X+=6)x.lineTo(X,top+Math.sin(X*.04+t*5)*fs*.05);x.lineTo(w,h);x.closePath();x.clip();x.fillStyle=rgb(A);x.fillText(s,w/2,h/2);x.restore()
    }
  },
});
