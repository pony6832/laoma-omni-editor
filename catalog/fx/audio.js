// 移植自圖鑑 audio（音波頻譜，數據圖表）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("audio", {
  dur: 4.0,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { mix, rr } = K;
    const clear = (x, w, h) => K.clear(x, w, h);
    {
clear(x,w,h);const n=48,bw=w*.84/n;for(let i=0;i<n;i++){let v=.5+.5*Math.sin(i*.35+t*4)*Math.cos(i*.13-t*2.3);v=v*(.35+.65*Math.sin(Math.PI*(i+.5)/n));
  const bh=v*h*.36+3;x.fillStyle=mix(i/(n-1));rr(x,w*.08+i*bw+bw*.18,h/2-bh,bw*.64,bh*2,bw*.32)}
    }
  },
});
