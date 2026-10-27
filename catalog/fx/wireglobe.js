// 移植自圖鑑 wireglobe（經緯線地球，數據圖表）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("wireglobe", {
  dur: 8.0,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, rnd } = K;
    const { A, B } = K;
    const clear = (x, w, h) => K.clear(x, w, h);
    {
clear(x,w,h);const cx=w/2,cy=h/2,R=h*.4,rot=t*.4,tl=.35;x.lineWidth=1;
  const P=(la,lo)=>{const c=Math.cos(la),X=c*Math.sin(lo+rot),Yv=Math.sin(la),Z=c*Math.cos(lo+rot);return[cx+X*R,cy-(Yv*Math.cos(tl)-Z*Math.sin(tl))*R,Yv*Math.sin(tl)+Z*Math.cos(tl)]};
  x.strokeStyle=rgb(B,.45);for(let lo=0;lo<12;lo++){x.beginPath();for(let k=0;k<=40;k++){const p=P(-Math.PI/2+k/40*Math.PI,lo/12*Math.PI*2);k?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1])}x.stroke()}
  x.strokeStyle=rgb(B,.3);for(let la=-2;la<=2;la++){x.beginPath();for(let k=0;k<=60;k++){const p=P(la*.5,k/60*Math.PI*2);k?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1])}x.stroke()}
  for(let i=0;i<8;i++){const p=P((rnd(i)-.5)*2,rnd(i+9)*6.28);if(p[2]>0){x.fillStyle=rgb(A,.5+.5*Math.sin(t*4+i));x.beginPath();x.arc(p[0],p[1],4,0,7);x.fill()}}
    }
  },
});
