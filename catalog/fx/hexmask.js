// 移植自圖鑑 hexmask（六角形遮罩，轉場 UI）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("hexmask", {
  dur: 3,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { cl } = K;
    const TR = (x, w, h, t, path) => K.TR(x, w, h, t, path, P.numFont);
    {
TR(x,w,h,t,p=>{const r=h*.09,D=Math.hypot(w/2,h/2);for(let j=-1;j<9;j++)for(let i=-1;i<14;i++){const X=(i+(j&1)*.5)*r*1.75,Yp=j*r*1.5,s=cl(p*2.2-Math.hypot(X-w/2,Yp-h/2)/D)*r*1.05;
  if(s<=0)continue;x.moveTo(X+s,Yp);for(let k=1;k<=6;k++){const a=k/6*Math.PI*2;x.lineTo(X+Math.cos(a)*s,Yp+Math.sin(a)*s)}}})
    }
  },
});
