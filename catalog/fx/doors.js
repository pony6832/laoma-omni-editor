// 移植自圖鑑 doors（對開門，轉場 UI）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("doors", {
  dur: 3,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const TR = (x, w, h, t, path) => K.TR(x, w, h, t, path, P.numFont);
    {
TR(x,w,h,t,p=>x.rect(w/2*(1-p),0,w*p,h))
    }
  },
});
