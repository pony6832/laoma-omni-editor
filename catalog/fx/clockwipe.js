// 移植自圖鑑 clockwipe（時鐘掃描，轉場 UI）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("clockwipe", {
  dur: 3,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const TR = (x, w, h, t, path) => K.TR(x, w, h, t, path, P.numFont);
    {
TR(x,w,h,t,p=>{x.moveTo(w/2,h/2);x.arc(w/2,h/2,w,-Math.PI/2,-Math.PI/2+p*Math.PI*2+.001);x.closePath()})
    }
  },
});
