// 移植自圖鑑 spotlight（聚光燈探照，轉場 UI）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：["找到重點", "聚光燈照到哪裡，內容就出現在哪裡"]。原版的 t%T 循環與數字未改動。
fxDefine("spotlight", {
  dur: 6.0,
  defaults: { T: ["找到重點", "聚光燈照到哪裡，內容就出現在哪裡"], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, cl, eIO } = K;
    const { A, FG } = K;
    const scene = (x, w, h, bg, fg, txt) => K.scene(x, w, h, bg, fg, txt, P.numFont);
    {
scene(x,w,h,'#1B2233',FG,'');x.font=`900 ${h*.16}px "Noto Sans TC"`;x.textAlign='center';x.textBaseline='middle';x.fillStyle=rgb(A);x.fillText('找到重點',w/2,h*.42);x.fillStyle=FG;x.font=`500 ${h*.06}px "Noto Sans TC"`;x.fillText('聚光燈照到哪裡，內容就出現在哪裡',w/2,h*.62);
  const tt=t%6,o=cl((tt-4.4)/.8),cx=w*(.5+.32*Math.sin(t*.9)),cy=h*(.5+.25*Math.sin(t*1.4)),R=h*(.22+.9*eIO(o));const g=x.createRadialGradient(cx,cy,R*.55,cx,cy,R);g.addColorStop(0,'rgba(5,6,10,0)');g.addColorStop(1,'rgba(5,6,10,.96)');x.fillStyle=g;x.fillRect(0,0,w,h)
    }
  },
});
