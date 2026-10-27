// 移植自圖鑑 push（推移，轉場 UI）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：["SCENE 1", "SCENE 2"]。原版的 t%T 循環與數字未改動。
fxDefine("push", {
  dur: 3,
  defaults: { T: ["SCENE 1", "SCENE 2"], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, cl, eIO } = K;
    const { A, FG } = K;
    const BG = K.BG === null ? "#12151D" : K.BG;
    const scene = (x, w, h, bg, fg, txt) => K.scene(x, w, h, bg, fg, txt, P.numFont);
    {
const p=eIO(cl(((t%2.6)-.5)/1.4));x.save();x.translate(-p*w,0);scene(x,w,h,BG,FG,'SCENE 1');x.translate(w,0);scene(x,w,h,rgb(A),BG,'SCENE 2');x.restore()
    }
  },
});
