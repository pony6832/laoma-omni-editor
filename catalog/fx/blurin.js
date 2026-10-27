// 移植自圖鑑 blurin（模糊逐字浮現，文字標題）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：["每個字都清楚登場"]。原版的 t%T 循環與數字未改動。
fxDefine("blurin", {
  dur: 4.0,
  defaults: { T: ["每個字都清楚登場"], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, cl, eOC } = K;
    const { A, FG } = K;
    const clear = (x, w, h) => K.clear(x, w, h);
    {
clear(x,w,h);const s='每個字都清楚登場',T=4,tt=t%T,n=s.length,fs=Math.min(h*.14,w*.8/n);x.font=`700 ${fs}px "Noto Sans TC"`;x.textAlign='left';x.textBaseline='middle';let X=(w-x.measureText(s).width)/2;const q=cl((tt-3.3)/.5);
  for(let i=0;i<n;i++){const p=eOC(cl((tt-.2-i*.09)/.7)),cw=x.measureText(s[i]).width;x.save();x.filter=`blur(${(1-p)*12+q*10}px)`;x.globalAlpha=p*(1-q);x.fillStyle=i>=5?rgb(A):FG;x.fillText(s[i],X,h/2+(1-p)*fs*.5);x.restore();X+=cw}
    }
  },
});
