// 移植自圖鑑 maskrise（遮罩滑升文字，文字標題）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：["CRAFTED", "於細節之中"]。原版的 t%T 循環與數字未改動。
fxDefine("maskrise", {
  dur: 4.0,
  defaults: { T: ["CRAFTED", "於細節之中"], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, cl, eOC } = K;
    const { A, Y, FG } = K;
    const clear = (x, w, h) => K.clear(x, w, h);
    {
clear(x,w,h);const T=4,tt=t%T,fs=h*.13,L=['CRAFTED','於細節之中','2026'],q=cl((tt-3.3)/.5);x.textAlign='left';x.textBaseline='alphabetic';
  L.forEach((s,i)=>{const p=1-Math.pow(2,-10*cl((tt-i*.25)/.9)),by=h*.34+i*fs*1.35;x.save();x.beginPath();x.rect(0,by-fs*1.1,w,fs*1.35);x.clip();
    x.font=`${i==1?900:400} ${fs}px "Noto Sans TC",sans-serif`;x.fillStyle=i==2?Y:FG;x.globalAlpha=1-q;x.fillText(s,w*.1,by+(1-p)*fs*1.2);x.restore()});
  x.fillStyle=rgb(A);x.fillRect(w*.1,h*.34+3*fs*1.35-fs*.7,w*.25*eOC(cl((tt-.8)/1))*(1-q),2)
    }
  },
});
