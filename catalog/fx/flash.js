// 移植自圖鑑 flash（星芒閃白，轉場 UI）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：["SCENE 1", "SCENE 2"]。原版的 t%T 循環與數字未改動。
fxDefine("flash", {
  dur: 3,
  defaults: { T: ["SCENE 1", "SCENE 2"], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb } = K;
    const { A, FG } = K;
    const BG = K.BG === null ? "#12151D" : K.BG;
    const scene = (x, w, h, bg, fg, txt) => K.scene(x, w, h, bg, fg, txt, P.numFont);
    {
const tt=t%2.6;tt<1.2?scene(x,w,h,BG,FG,'SCENE 1'):scene(x,w,h,rgb(A),BG,'SCENE 2');const f=Math.max(0,1-Math.abs(tt-1.2)/.25);
  if(f>0){x.fillStyle=`rgba(255,255,255,${f*.9})`;x.fillRect(0,0,w,h);x.save();x.translate(w/2,h/2);x.rotate(tt);x.fillStyle=`rgba(255,236,190,${f})`;for(let i=0;i<8;i++){x.rotate(Math.PI/4);x.beginPath();x.moveTo(0,-4);x.lineTo(w*.7*f,0);x.lineTo(0,4);x.fill()}x.restore()}
    }
  },
});
