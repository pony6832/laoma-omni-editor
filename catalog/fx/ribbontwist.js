// 移植自圖鑑 ribbontwist（緞帶扭轉，介面微動態）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("ribbontwist", {
  dur: 6.0,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { mix } = K;
    const { Y } = K;
    const clear = (x, w, h) => K.clear(x, w, h);
    {
clear(x,w,h);const N=90,P=[];for(let i=0;i<=N;i++){const u=i/N,X=w*.06+u*w*.88,Y=h/2+Math.sin(u*Math.PI*2.2-t*1.1)*h*.22,tw=u*9-t*1.6,hw=h*.17*Math.cos(tw)*(.35+.65*Math.sin(u*Math.PI));P.push([X,Y,hw,Math.cos(tw),u])}
  for(let i=0;i<N;i++){const a=P[i],b=P[i+1];x.fillStyle=mix(a[4],.55+.45*Math.abs(a[3]));x.strokeStyle=x.fillStyle;x.lineWidth=.6;x.beginPath();x.moveTo(a[0],a[1]-a[2]);x.lineTo(b[0],b[1]-b[2]);x.lineTo(b[0],b[1]+b[2]);x.lineTo(a[0],a[1]+a[2]);x.closePath();x.fill();x.stroke()}
    }
  },
});
