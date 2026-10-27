// 移植自圖鑑 fireworks（煙火，轉場 UI）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("fireworks", {
  dur: 4.0,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, cl, eOC, rnd } = K;
    const { A, B } = K;
    {
x.fillStyle='rgba(10,12,22,1)';x.fillRect(0,0,w,h);for(let b=0;b<4;b++){const T=1.8,tt=(t+b*.45)%T,cyc=Math.floor((t+b*.45)/T),s=cyc*10+b,cx=w*(.2+.6*rnd(s)),cy=h*(.25+.3*rnd(s+1)),col=[A,B,[255,200,87],[123,216,143]][s%4];
  if(tt<.35){x.fillStyle=rgb(col);x.fillRect(cx-1,h-(h-cy)*tt/.35,2,8)}else{const u=tt-.35;for(let i=0;i<40;i++){const a=i/40*Math.PI*2,v=h*.35*(.7+.3*rnd(s*40+i)),X=cx+Math.cos(a)*v*eOC(cl(u/1)),Yp=cy+Math.sin(a)*v*eOC(cl(u/1))+u*u*h*.12;
    x.fillStyle=rgb(col,cl(1-u/1.4));x.beginPath();x.arc(X,Yp,1.8,0,7);x.fill()}}}
    }
  },
});
