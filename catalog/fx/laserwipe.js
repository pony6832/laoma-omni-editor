// 移植自圖鑑 laserwipe（雷射掃描轉場，轉場 UI）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：["SCENE 1", "SCENE 2"]。原版的 t%T 循環與數字未改動。
fxDefine("laserwipe", {
  dur: 3,
  defaults: { T: ["SCENE 1", "SCENE 2"], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, cl, eIO } = K;
    const { A, FG } = K;
    const BG = K.BG === null ? "#12151D" : K.BG;
    const scene = (x, w, h, bg, fg, txt) => K.scene(x, w, h, bg, fg, txt, P.numFont);
    {
const p=eIO(cl(((t%2.6)-.5)/1.4)),Yp=p*h;scene(x,w,h,BG,FG,'SCENE 1');x.save();x.beginPath();x.rect(0,0,w,Yp);x.clip();scene(x,w,h,rgb(A),BG,'SCENE 2');x.restore();
  if(p>0&&p<1){const g=x.createLinearGradient(0,Yp-24,0,Yp+24);g.addColorStop(0,'rgba(111,139,255,0)');g.addColorStop(.5,'rgba(200,220,255,.9)');g.addColorStop(1,'rgba(111,139,255,0)');x.fillStyle=g;x.fillRect(0,Yp-24,w,48);x.fillStyle='#fff';x.fillRect(0,Yp-1,w,2)}
    }
  },
});
