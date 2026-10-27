// 移植自圖鑑 shatter（碎裂，轉場 UI）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：["SCENE 2", "SCENE 1"]。原版的 t%T 循環與數字未改動。
fxDefine("shatter", {
  dur: 3,
  defaults: { T: ["SCENE 2", "SCENE 1"], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, cl, rnd } = K;
    const { A, FG } = K;
    const BG = K.BG === null ? "#12151D" : K.BG;
    const scene = (x, w, h, bg, fg, txt) => K.scene(x, w, h, bg, fg, txt, P.numFont);
    {
const p=cl(((t%2.6)-.5)/1.4);scene(x,w,h,rgb(A),BG,'SCENE 2');const n=6,m=4,cw=w/n,ch=h/m;
  for(let i=0;i<n;i++)for(let j=0;j<m;j++)for(let k=0;k<2;k++){const s=i*13+j*7+k,d=cl(p*1.6-rnd(s)*.6);if(d>=1)continue;const P=k?[[i,j],[i+1,j],[i,j+1]]:[[i+1,j],[i+1,j+1],[i,j+1]],
    cx=(P[0][0]+P[1][0]+P[2][0])/3*cw,cy=(P[0][1]+P[1][1]+P[2][1])/3*ch;x.save();x.translate(cx,cy+d*d*h*1.4);x.rotate(d*(rnd(s+1)-.5)*4);x.translate(-cx,-cy);
    x.beginPath();P.forEach(([a,b],q)=>q?x.lineTo(a*cw,b*ch):x.moveTo(a*cw,b*ch));x.closePath();x.clip();scene(x,w,h,BG,FG,'SCENE 1');x.restore()}
    }
  },
});
