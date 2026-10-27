// 移植自圖鑑 iris（多環光圈，轉場 UI）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("iris", {
  dur: 3,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, cl, eIO } = K;
    const { B } = K;
    const TR = (x, w, h, t, path) => K.TR(x, w, h, t, path, P.numFont);
    {
const p=eIO(cl(((t%2.6)-.5)/1.4)),D=Math.hypot(w,h)/2;TR(x,w,h,t,q=>x.arc(w/2,h/2,q*D,0,7));
  [0,.12,.24].forEach((d,i)=>{const q=cl(p*1.3-d);if(q>0&&q<1){x.strokeStyle=i%2?rgb(B,1-q):`rgba(255,200,87,${1-q})`;x.lineWidth=4;x.beginPath();x.arc(w/2,h/2,q*D*1.1,0,7);x.stroke()}})
    }
  },
});
