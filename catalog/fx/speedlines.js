// 移植自圖鑑 speedlines（漫畫速度線，轉場 UI）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：["爆！"]。原版的 t%T 循環與數字未改動。
fxDefine("speedlines", {
  dur: 3,
  defaults: { T: ["爆！"], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, cl, rnd } = K;
    const { A } = K;
    {
x.fillStyle='#F2EFE8';x.fillRect(0,0,w,h);const k=Math.floor(t*12);x.fillStyle='#161922';for(let i=0;i<70;i++){const a=rnd(i+k*.37)*Math.PI*2,r0=Math.min(w,h)*(.18+.15*rnd(i+k)),r1=Math.hypot(w,h);
  x.beginPath();x.moveTo(w/2+Math.cos(a-.012)*r0,h/2+Math.sin(a-.012)*r0);x.lineTo(w/2+Math.cos(a)*r1,h/2+Math.sin(a)*r1);x.lineTo(w/2+Math.cos(a+.012)*r0,h/2+Math.sin(a+.012)*r0);x.fill()}
  const p=(t%1.6)/1.6,s=1+.5*Math.pow(1-cl(p/.2),3);x.save();x.translate(w/2,h/2);x.scale(s,s);x.rotate(-.06);x.font=`900 ${h*.24}px "Noto Sans TC"`;x.textAlign='center';x.textBaseline='middle';x.lineWidth=h*.03;x.strokeStyle='#161922';x.strokeText('爆！',0,0);x.fillStyle=rgb(A);x.fillText('爆！',0,0);x.restore()
    }
  },
});
