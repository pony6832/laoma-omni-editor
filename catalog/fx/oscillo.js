// 移植自圖鑑 oscillo（聲波曲線，數據圖表）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("oscillo", {
  dur: 4.0,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb } = K;
    const { A, B } = K;
    const clear = (x, w, h) => K.clear(x, w, h);
    {
clear(x,w,h);[[A,1,0],[B,.7,1.7],[[255,200,87],.45,3.1]].forEach(([c,amp,ph])=>{x.strokeStyle=rgb(c,.85);x.lineWidth=2;x.beginPath();for(let X=0;X<=w;X+=3){const u=X/w,env=Math.sin(u*Math.PI),Yp=h/2+Math.sin(u*14+t*4+ph)*Math.sin(u*5-t*1.3+ph)*h*.32*amp*env*(.6+.4*Math.sin(t*2+ph));X?x.lineTo(X,Yp):x.moveTo(X,Yp)}x.stroke()})
    }
  },
});
