// 移植自圖鑑 odometer（里程表滾輪數字，數據圖表）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("odometer", {
  dur: 4.5,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, cl, eOC, rr } = K;
    const { A, FG } = K;
    const clear = (x, w, h) => K.clear(x, w, h);
    {
clear(x,w,h);const T=4.5,tt=t%T,v=48216*eOC(cl(tt/3)),N=5,dh=h*.3,dw=dh*.62,x0=w/2-N*dw/2,y0=h/2-dh/2;x.font=`700 ${dh*.78}px Unbounded,sans-serif`;x.textAlign='center';x.textBaseline='middle';
  for(let k=0;k<N;k++){const pw=Math.pow(10,N-1-k),q=v/pw,base=Math.floor(q)%10,fr=pw===1?q-Math.floor(q):cl(((q-Math.floor(q))*pw-(pw-1))),X=x0+k*dw;x.fillStyle='#232937';rr(x,X+2,y0,dw-4,dh,8);
    x.save();x.beginPath();x.rect(X,y0,dw,dh);x.clip();x.fillStyle=k<2?rgb(A):FG;x.fillText(base,X+dw/2,h/2-fr*dh);x.fillText((base+1)%10,X+dw/2,h/2+dh-fr*dh);x.restore()}
  x.fillStyle='rgba(18,21,29,.6)';x.fillRect(x0,y0,N*dw,dh*.12);x.fillRect(x0,y0+dh*.88,N*dw,dh*.12)
    }
  },
});
