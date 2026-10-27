// 移植自圖鑑 rotator（文字輪播，文字標題）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：["影片", "網站", "品牌", "動畫", "我們做"]。原版的 t%T 循環與數字未改動。
fxDefine("rotator", {
  dur: 5.6,
  defaults: { T: ["影片", "網站", "品牌", "動畫", "我們做"], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, cl, eOB } = K;
    const { A, FG } = K;
    const clear = (x, w, h) => K.clear(x, w, h);
    {
clear(x,w,h);const W=['影片','網站','品牌','動畫'],P=1.4,u=t/P,i=Math.floor(u)%W.length,m=eOB(cl(((u%1)-.7)/.3));
  const fs=h*.16;x.font=`900 ${fs}px "Noto Sans TC"`;x.textBaseline='middle';x.textAlign='left';const pre='我們做',pw=x.measureText(pre).width,bw=fs*2.2,X0=w/2-(pw+fs*.15+bw)/2,bx=X0+pw+fs*.15;
  x.fillStyle=FG;x.fillText(pre,X0,h/2);x.save();x.beginPath();x.rect(bx,h/2-fs*.7,bw,fs*1.4);x.clip();x.fillStyle=rgb(A);
  x.fillText(W[i],bx+fs*.05,h/2-m*fs*1.4);x.fillText(W[(i+1)%W.length],bx+fs*.05,h/2+(1-m)*fs*1.4);x.restore();x.fillStyle=rgb(A);x.fillRect(bx,h/2+fs*.72,bw-fs*.1,4)
    }
  },
});
