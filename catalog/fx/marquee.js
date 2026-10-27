// 移植自圖鑑 marquee（跑馬燈，文字標題）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：["限時優惠 · 全館 5 折 · ", "NEW ARRIVAL · 新品上市 · ", "FREE SHIPPING · 免運 · "]。原版的 t%T 循環與數字未改動。
fxDefine("marquee", {
  dur: 5.0,
  defaults: { T: ["限時優惠 · 全館 5 折 · ", "NEW ARRIVAL · 新品上市 · ", "FREE SHIPPING · 免運 · "], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb } = K;
    const { A, B, FG } = K;
    const BG = K.BG === null ? "#12151D" : K.BG;
    const clear = (x, w, h) => K.clear(x, w, h);
    {
clear(x,w,h);const rows=[['限時優惠 · 全館 5 折 · ',1,FG,null],['NEW ARRIVAL · 新品上市 · ',-1,BG,rgb(A)],['FREE SHIPPING · 免運 · ',1,rgb(B),null]];
  const fs=h*.15;rows.forEach(([s,dir,col,band],i)=>{x.save();const cy=h*(.22+i*.28);x.translate(w/2,cy);if(band)x.rotate(-.05);x.translate(-w/2,0);
    if(band){x.fillStyle=band;x.fillRect(-20,-fs*.75,w+40,fs*1.5)}
    x.font=`900 ${fs}px "Noto Sans TC"`;x.textBaseline='middle';x.textAlign='left';x.fillStyle=col;
    const tw=x.measureText(s).width,off=((t*55*dir)%tw+tw)%tw;for(let X=off-tw;X<w;X+=tw)x.fillText(s,X,0);x.restore()})
    }
  },
});
