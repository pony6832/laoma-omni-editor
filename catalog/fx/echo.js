// 移植自圖鑑 echo（殘影拖尾字，文字標題）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：["ECHO"]。原版的 t%T 循環與數字未改動。
fxDefine("echo", {
  dur: 6.0,
  defaults: { T: ["ECHO"], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { mix } = K;
    const { FG } = K;
    const clear = (x, w, h) => K.clear(x, w, h);
    {
clear(x,w,h);const P=tt=>[w/2+Math.sin(tt*1.1)*w*.25,h/2+Math.sin(tt*1.7)*h*.22];x.font=`700 ${h*.22}px Unbounded,sans-serif`;x.textAlign='center';x.textBaseline='middle';
  for(let k=8;k>=0;k--){const [X,Yp]=P(t-k*.06);x.fillStyle=k?mix(k/8,.6*(1-k/9)):FG;x.fillText('ECHO',X,Yp)}
    }
  },
});
