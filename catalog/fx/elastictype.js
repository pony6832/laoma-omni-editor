// 移植自圖鑑 elastictype（彈性字距拉伸，介面微動態）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：["STRETCH"]。原版的 t%T 循環與數字未改動。
fxDefine("elastictype", {
  dur: 5.7,
  defaults: { T: ["STRETCH"], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, rr, uiText } = K;
    const { A, FG } = K;
    const clear = (x, w, h) => K.clear(x, w, h);
    {
clear(x,w,h);const k=.5+.5*Math.sin(t*1.1-1.2),sx=.7+.9*k,S_='STRETCH',n=S_.length,fs=Math.min(h*.3,w*.1),wt=[300,400,500,600,700,800,900][Math.round(k*6)];x.textBaseline='middle';x.textAlign='center';x.font=`${wt} ${fs}px Unbounded,sans-serif`;
  let tw=0;const ws=[];for(let i=0;i<n;i++){const cw=x.measureText(S_[i]).width*sx;ws.push(cw);tw+=cw}let X=(w-tw)/2;for(let i=0;i<n;i++){x.save();x.translate(X+ws[i]/2,h*.42);x.scale(sx,1);x.fillStyle=i===2?rgb(A):FG;x.fillText(S_[i],0,0);x.restore();X+=ws[i]}
  const tx=w*.2,tw2=w*.6,ty=h*.78;x.fillStyle='#2A3040';rr(x,tx,ty-2,tw2,4,2);x.fillStyle=rgb(A);rr(x,tx,ty-2,tw2*k,4,2);x.fillStyle='#fff';x.beginPath();x.arc(tx+tw2*k,ty,9,0,7);x.fill();uiText(x,'wdth '+Math.round(70+90*k)+'  wght '+wt,w/2,h*.9,h*.05,'rgba(237,239,245,.7)',500)
    }
  },
});
