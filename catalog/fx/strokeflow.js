// 移植自圖鑑 strokeflow（描邊大字流動，文字標題）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：["CONTENT · NEWS · DATA · "]。原版的 t%T 循環與數字未改動。
fxDefine("strokeflow", {
  dur: 6.0,
  defaults: { T: ["CONTENT · NEWS · DATA · "], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb } = K;
    const { A, FG } = K;
    const clear = (x, w, h) => K.clear(x, w, h);
    {
clear(x,w,h);const fs=h*.3;x.font=`700 ${fs}px Unbounded,sans-serif`;x.textBaseline='middle';x.textAlign='left';x.lineWidth=1.5;const s='CONTENT · NEWS · DATA · ',tw=x.measureText(s).width;
  [[.3,1,FG],[.72,-1,rgb(A)]].forEach(([yy,d,c])=>{x.strokeStyle=c;let o=((-t*40*d)%tw+tw)%tw-tw;for(;o<w;o+=tw)x.strokeText(s,o,h*yy)})
    }
  },
});
