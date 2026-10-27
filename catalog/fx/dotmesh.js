// 移植自圖鑑 dotmesh（點陣波浪網，介面微動態）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("dotmesh", {
  dur: 8.0,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { mix } = K;
    {
x.fillStyle='#F6F3FA';x.fillRect(0,0,w,h);const NX=48,NY=22;for(let j=0;j<NY;j++){const gy=j/(NY-1);for(let i=0;i<NX;i++){const gx=i/(NX-1),z=Math.sin(gx*9+t*1.6)*Math.cos(gy*7-t*1.2)*.5+Math.sin(gx*4-gy*3+t)*.3,px=w/2+(gx-.5)*w*(.5+gy*.75),py=h*.3+gy*h*.62-z*h*(.07+gy*.16),r=.8+gy*1.8+z;x.fillStyle=mix(.5+.5*z,.35+.55*gy);x.beginPath();x.arc(px,py,Math.max(.4,r),0,7);x.fill()}}
    }
  },
});
