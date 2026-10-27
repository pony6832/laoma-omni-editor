// 移植自圖鑑 buttonplayer（按鈕展開播放器，介面微動態）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("buttonplayer", {
  dur: 5.0,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, cl, eOB, eIO, rr, uiText } = K;
    const { A } = K;
    {
x.fillStyle='#F2EFE8';x.fillRect(0,0,w,h);const tt=t%5,m=Math.max(0,Math.min(1.08,eOB(cl((tt-1)/.6))-eIO(cl((tt-4.1)/.5)))),W0=w*.22,H0=h*.14,W1=w*.62,H1=h*.46,bw=W0+(W1-W0)*m,bh=H0+(H1-H0)*m,X=w/2-bw/2,Yp=h/2-bh/2;
  x.save();x.shadowColor='rgba(0,0,0,.25)';x.shadowBlur=18;x.shadowOffsetY=8;x.fillStyle='#161922';rr(x,X,Yp,bw,bh,Math.min(bh/2,H0/2+(14-H0/2)*m));x.restore();
  if(m<.35){x.globalAlpha=1-m*2.8;x.fillStyle='#fff';x.beginPath();x.moveTo(X+bw*.2,h/2-H0*.22);x.lineTo(X+bw*.2,h/2+H0*.22);x.lineTo(X+bw*.2+H0*.38,h/2);x.fill();uiText(x,'Preview',X+bw*.42,h/2,H0*.34,'#fff',700,'left');x.globalAlpha=1}
  else{const a=cl((m-.45)/.5),pr=cl((tt-1.8)/2.2);x.globalAlpha=a;uiText(x,'Summer reel',X+bw*.06,Yp+bh*.16,bh*.09,'#fff',700,'left');for(let i=0;i<32;i++){const bx=X+bw*.06+i*bw*.88/32,amp=(.25+.75*Math.abs(Math.sin(i*.8+t*4)))*bh*.2;x.fillStyle=i/32<pr?rgb(A):'rgba(255,255,255,.28)';x.fillRect(bx,Yp+bh*.52-amp/2,bw*.015,amp)}
    x.fillStyle='rgba(255,255,255,.2)';rr(x,X+bw*.06,Yp+bh*.8,bw*.88,4,2);x.fillStyle=rgb(A);rr(x,X+bw*.06,Yp+bh*.8,bw*.88*pr,4,2);x.fillStyle='#fff';x.beginPath();x.arc(X+bw*.06+bw*.88*pr,Yp+bh*.8+2,6,0,7);x.fill();x.globalAlpha=1}
    }
  },
});
