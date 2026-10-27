// 移植自圖鑑 dissolve（像素溶解，轉場 UI）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("dissolve", {
  dur: 3,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rnd } = K;
    const TR = (x, w, h, t, path) => K.TR(x, w, h, t, path, P.numFont);
    {
TR(x,w,h,t,p=>{const n=24,m=15,cw=w/n,ch=h/m;for(let i=0;i<n;i++)for(let j=0;j<m;j++)if(rnd(i*97+j)<p)x.rect(i*cw,j*ch,cw+.5,ch+.5)})
    }
  },
});
