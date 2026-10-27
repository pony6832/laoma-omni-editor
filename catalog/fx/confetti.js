// 移植自圖鑑 confetti（彩帶慶祝，轉場 UI）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：["恭喜達標！"]。原版的 t%T 循環與數字未改動。
fxDefine("confetti", {
  dur: 3.0,
  defaults: { T: ["恭喜達標！"], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, cl, eOB, rnd } = K;
    const { A, B, Y, FG } = K;
    const clear = (x, w, h) => K.clear(x, w, h);
    {
clear(x,w,h);const T=3.6,tt=t%T,cyc=Math.floor(t/T),C=[rgb(A),rgb(B),Y,'#7BD88F',FG],tau=(1-Math.exp(-2.2*tt))/2.2,fd=1-cl((tt-3)/.5);
  const q=eOB(cl((tt-.25)/.5));if(q>0){x.save();x.globalAlpha=fd;x.translate(w/2,h*.45);x.scale(q,q);x.fillStyle=FG;x.font=`900 ${h*.13}px "Noto Sans TC"`;x.textAlign='center';x.textBaseline='middle';x.fillText('恭喜達標！',0,0);x.restore()}
  for(let i=0;i<140;i++){const s=cyc*1000+i,side=i%2,vx=(side?1:-1)*(.25+rnd(s+1)*.6)*w*1.6,vy=-(.8+rnd(s+2)*.7)*h*2.4;
    const X=(side?w*.04:w*.96)+vx*tau+Math.sin(tt*5+i)*10*tt,Yp=h*1.02+vy*tau+.5*h*1.1*tt*tt;
    x.save();x.globalAlpha=fd;x.translate(X,Yp);x.rotate(tt*(3+rnd(s+3)*5)+i);x.scale(1,Math.cos(tt*9+i));x.fillStyle=C[i%5];x.fillRect(-4,-6,8,12);x.restore()}x.globalAlpha=1
    }
  },
});
