// 移植自圖鑑 circletext（環形旋轉文字，文字標題）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：["SCROLL · FOLLOW · SAVE · SHARE · ", "追蹤"]。原版的 t%T 循環與數字未改動。
fxDefine("circletext", {
  dur: 8.0,
  defaults: { T: ["SCROLL · FOLLOW · SAVE · SHARE · ", "追蹤"], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb } = K;
    const { A, FG } = K;
    const BG = K.BG === null ? "#12151D" : K.BG;
    const clear = (x, w, h) => K.clear(x, w, h);
    {
clear(x,w,h);const s='SCROLL · FOLLOW · SAVE · SHARE · ',R=h*.33,n=s.length;x.font=`700 ${h*.07}px Unbounded,sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillStyle=FG;
  for(let i=0;i<n;i++){const a=i/n*Math.PI*2+t*.5;x.save();x.translate(w/2+Math.cos(a)*R,h/2+Math.sin(a)*R);x.rotate(a+Math.PI/2);x.fillText(s[i],0,0);x.restore()}
  x.fillStyle=rgb(A);x.beginPath();x.arc(w/2,h/2,R*.55,0,7);x.fill();x.fillStyle=BG;x.font=`900 ${h*.09}px "Noto Sans TC"`;x.fillText('追蹤',w/2,h/2)
    }
  },
});
