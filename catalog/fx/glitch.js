// 移植自圖鑑 glitch（故障效果，文字標題）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：["GLITCH"]。原版的 t%T 循環與數字未改動。
fxDefine("glitch", {
  dur: 3.0,
  defaults: { T: ["GLITCH"], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, rnd } = K;
    const { A, B, FG } = K;
    const c = K.canvas;
    const dpr = K.dpr;
    const clear = (x, w, h) => K.clear(x, w, h);
    {
clear(x,w,h);const fs=h*.24;x.font=`700 ${fs}px Unbounded,"Noto Sans TC",sans-serif`;x.textAlign='center';x.textBaseline='middle';
  const sd=Math.floor(t*9),on=rnd(sd)<.42;const dx=on?(rnd(sd+1)-.5)*16:0;
  if(on){x.globalCompositeOperation='lighter';x.fillStyle=rgb(A,.9);x.fillText('GLITCH',w/2-dx,h/2);x.fillStyle=rgb(B,.9);x.fillText('GLITCH',w/2+dx,h/2);x.globalCompositeOperation='source-over'}
  else{x.fillStyle=FG;x.fillText('GLITCH',w/2,h/2)}
  if(on){x.save();x.setTransform(1,0,0,1,0,0);const W=c.width,H=c.height;for(let k=0;k<4;k++){const sy=rnd(sd*3+k)*H,sh=(4+rnd(sd*7+k)*18)*dpr,off=(rnd(sd*5+k)-.5)*50*dpr;x.drawImage(c,0,sy,W,sh,off,sy,W,sh)}x.restore()}
  x.fillStyle='rgba(0,0,0,.18)';for(let Yp=0;Yp<h;Yp+=3)x.fillRect(0,Yp,w,1)
    }
  },
});
