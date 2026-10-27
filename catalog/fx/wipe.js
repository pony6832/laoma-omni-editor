// 移植自圖鑑 wipe（圓形擴散轉場，轉場 UI）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：["SCENE 1", "SCENE 2"]。原版的 t%T 循環與數字未改動。
fxDefine("wipe", {
  dur: 3,
  defaults: { T: ["SCENE 1", "SCENE 2"], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, cl, eIO } = K;
    const { A, FG } = K;
    const BG = K.BG === null ? "#12151D" : K.BG;
    const scene = (x, w, h, bg, fg, txt) => K.scene(x, w, h, bg, fg, txt, P.numFont);
    {
const tt=t%4,R=Math.hypot(w,h),first=tt<2,s1=()=>scene(x,w,h,BG,FG,'SCENE 1'),s2=()=>scene(x,w,h,rgb(A),BG,'SCENE 2'),p=eIO(cl(((first?tt:tt-2)-1.1)/.8));
  (first?s1:s2)();if(p>0){x.save();x.beginPath();x.arc(first?w*.15:w*.85,first?h*.85:h*.15,R*p,0,7);x.clip();(first?s2:s1)();x.restore()}
    }
  },
});
