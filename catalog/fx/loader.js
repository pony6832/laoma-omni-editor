// 移植自圖鑑 loader（載入動畫，轉場 UI）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("loader", {
  dur: 3,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb } = K;
    const { A, FG, M } = K;
    const clear = (x, w, h) => K.clear(x, w, h);
    {
clear(x,w,h);const r=Math.min(w,h)*.27,cx=w/2,cy=h/2;x.lineCap='round';x.lineWidth=8;x.strokeStyle=M;x.beginPath();x.arc(cx,cy,r,0,7);x.stroke();
  const st=t*4.2,len=Math.PI*(.25+1.2*(Math.sin(t*2.2)+1)/2);x.strokeStyle=rgb(A);x.beginPath();x.arc(cx,cy,r,st,st+len);x.stroke();
  x.fillStyle=FG;x.font=`700 ${r*.42}px Unbounded,sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillText(Math.floor((t*22)%101)+'%',cx,cy+2)
    }
  },
});
