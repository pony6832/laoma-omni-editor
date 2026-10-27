// 移植自圖鑑 like（按讚愛心，轉場 UI）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("like", {
  dur: 3,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, cl, eOC, eOB, heart } = K;
    const { A, B, Y } = K;
    const clear = (x, w, h) => K.clear(x, w, h);
    {
clear(x,w,h);const tt=t%2.6,cx=w*.4,cy=h*.56,S=Math.min(w,h)*.22,ring=cl(tt/.5);
  if(ring<1){x.strokeStyle=rgb(A,1-ring);x.lineWidth=6*(1-ring)+1;x.beginPath();x.arc(cx,cy-S*.1,S*(.4+1.1*eOC(ring)),0,7);x.stroke()}
  const q=eOC(cl((tt-.05)/.6));if(q<1)for(let i=0;i<10;i++){const a=i/10*Math.PI*2,d=S*(.6+.9*q);x.globalAlpha=1-q;x.fillStyle=i%2?rgb(B):Y;x.beginPath();x.arc(cx+Math.cos(a)*d,cy-S*.1+Math.sin(a)*d,4*(1-q)+1,0,7);x.fill()}
  x.globalAlpha=1;x.fillStyle=rgb(A);heart(x,cx,cy,S*eOB(cl((tt-.1)/.45))*(1-cl((tt-2.3)/.3)));
  for(let k=0;k<6;k++){const u=(t*.35+k/6)%1;x.globalAlpha=(1-u)*.9;x.fillStyle=[rgb(A),rgb(B),Y][k%3];heart(x,w*.8+Math.sin(u*9+k)*w*.04,h*(.95-u*.85),Math.min(w,h)*.045*(.6+u*.5))}x.globalAlpha=1
    }
  },
});
