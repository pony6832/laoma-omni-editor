// 移植自圖鑑 slices（百葉窗轉場，轉場 UI）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：["SCENE 1", "SCENE 2"]。原版的 t%T 循環與數字未改動。
fxDefine("slices", {
  dur: 3,
  defaults: { T: ["SCENE 1", "SCENE 2"], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, cl, eOC } = K;
    const { A, B, FG } = K;
    const BG = K.BG === null ? "#12151D" : K.BG;
    const scene = (x, w, h, bg, fg, txt) => K.scene(x, w, h, bg, fg, txt, P.numFont);
    {
const tt=t%4,first=tt<2,lt=first?tt:tt-2,n=8,s1=()=>scene(x,w,h,BG,FG,'SCENE 1'),s2=()=>scene(x,w,h,rgb(B),BG,'SCENE 2');
  (first?s1:s2)();for(let k=0;k<n;k++){const p=eOC(cl((lt-.8-k*.06)/.5));if(p<=0)continue;const y0=k*h/n,X=first?0:w*(1-p),ww=w*p;
    x.save();x.beginPath();x.rect(X,y0,ww,h/n+1);x.clip();(first?s2:s1)();x.restore();if(p<1){x.fillStyle=rgb(A);x.fillRect(first?ww-3:X,y0,3,h/n+1)}}
    }
  },
});
