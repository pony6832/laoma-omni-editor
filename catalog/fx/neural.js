// 移植自圖鑑 neural（神經網路訊號，數據圖表）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("neural", {
  dur: 4.0,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, mix, rnd } = K;
    const { A, B } = K;
    const clear = (x, w, h) => K.clear(x, w, h);
    {
clear(x,w,h);const L=[3,5,5,2],pos=L.map((n,l)=>Array.from({length:n},(_,i)=>[w*(.15+l*.7/(L.length-1)),h*(.5+(i-(n-1)/2)*.17)]));x.lineWidth=1;
  for(let l=0;l<L.length-1;l++)pos[l].forEach((a,i)=>pos[l+1].forEach((b,j)=>{x.strokeStyle=rgb(B,.18);x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.stroke();
    const ph=((t*.8-l*.33+rnd(i*7+j+l*31)*.3)%1+1)%1;if(ph<.33){const u=ph/.33;x.fillStyle=rgb(A);x.beginPath();x.arc(a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u,2.5,0,7);x.fill()}}));
  pos.forEach((ly,l)=>ly.forEach(([X,Yp],i)=>{x.fillStyle=mix(.5+.5*Math.sin(t*4-l*1.5+i));x.beginPath();x.arc(X,Yp,7,0,7);x.fill()}))
    }
  },
});
