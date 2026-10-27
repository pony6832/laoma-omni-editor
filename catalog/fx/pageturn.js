// 移植自圖鑑 pageturn（翻頁轉場，轉場 UI）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：["SCENE 2", "SCENE 1"]。原版的 t%T 循環與數字未改動。
fxDefine("pageturn", {
  dur: 3,
  defaults: { T: ["SCENE 2", "SCENE 1"], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, cl, eIO } = K;
    const { A, FG } = K;
    const BG = K.BG === null ? "#12151D" : K.BG;
    const scene = (x, w, h, bg, fg, txt) => K.scene(x, w, h, bg, fg, txt, P.numFont);
    {
const p=eIO(cl(((t%2.6)-.5)/1.4)),fx=w*(1-p);scene(x,w,h,rgb(A),BG,'SCENE 2');x.save();x.beginPath();x.rect(0,0,fx,h);x.clip();scene(x,w,h,BG,FG,'SCENE 1');x.restore();
  if(p>0&&p<1){const fw=Math.min(w-fx,fx)*.5+w*.05*(1-p);const g=x.createLinearGradient(fx-fw,0,fx,0);g.addColorStop(0,'#C9CCD6');g.addColorStop(1,'#F5F6FA');x.fillStyle=g;x.fillRect(fx-fw,0,fw,h);
    const sh=x.createLinearGradient(fx,0,fx+30,0);sh.addColorStop(0,'rgba(0,0,0,.45)');sh.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=sh;x.fillRect(fx,0,30,h)}
    }
  },
});
