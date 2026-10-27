// 移植自圖鑑 beatslam（逐拍重擊字，文字標題）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：["FACEBOOK", "YOUTUBE", "LINE", "INSTAGRAM", "TIKTOK", "THREADS"]。原版的 t%T 循環與數字未改動。
fxDefine("beatslam", {
  dur: 3.0,
  defaults: { T: ["FACEBOOK", "YOUTUBE", "LINE", "INSTAGRAM", "TIKTOK", "THREADS"], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, cl, rnd } = K;
    const { A, FG } = K;
    const clear = (x, w, h) => K.clear(x, w, h);
    {
clear(x,w,h);const W=['FACEBOOK','YOUTUBE','LINE','INSTAGRAM','TIKTOK','THREADS'],b=60/128,k=Math.floor(t/b),p=(t%b)/b,s=1+.6*Math.pow(1-cl(p/.25),3);
  x.save();x.translate(w/2+(p<.15?(rnd(k)-.5)*12:0),h/2);x.scale(s,s);x.font=`700 ${Math.min(h*.16,w*.09)}px Unbounded,sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillStyle=k%3==0?rgb(A):FG;x.fillText(W[k%W.length],0,0);x.restore();
  x.fillStyle=rgb(A,.6*(1-p));x.fillRect(0,0,w,h*.02);x.fillRect(0,h*.98,w,h*.02)
    }
  },
});
