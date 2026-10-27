// 移植自圖鑑 liquid（液態遮罩，轉場 UI）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("liquid", {
  dur: 3,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const TR = (x, w, h, t, path) => K.TR(x, w, h, t, path, P.numFont);
    {
TR(x,w,h,t,p=>{const lv=h*(1.1-p*1.3);x.moveTo(0,h);for(let X=0;X<=w;X+=6)x.lineTo(X,lv+Math.sin(X*.02+t*5)*h*.06*Math.sin(p*Math.PI)+Math.sin(X*.045-t*3)*h*.03);x.lineTo(w,h);x.closePath()})
    }
  },
});
