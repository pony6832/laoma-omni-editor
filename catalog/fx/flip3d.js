// 移植自圖鑑 flip3d（立體翻轉逐字，文字標題）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：["立體翻轉登場"]。原版的 t%T 循環與數字未改動。
fxDefine("flip3d", {
  dur: 4.0,
  defaults: { T: ["立體翻轉登場"], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, cl, eOB } = K;
    const { A } = K;
    const clear = (x, w, h) => K.clear(x, w, h);
    {
clear(x,w,h);const s='立體翻轉登場',tt=t%4,n=s.length,fs=Math.min(h*.18,w*.8/n);x.font=`900 ${fs}px "Noto Sans TC"`;x.textAlign='center';x.textBaseline='middle';const sw=fs*1.05,x0=w/2-sw*(n-1)/2;
  for(let i=0;i<n;i++){const p=cl((tt-.2-i*.12)/.6),e=eOB(p),sc=Math.cos((1-e)*Math.PI/2),q=cl((tt-3.3)/.5);x.save();x.translate(x0+i*sw,h/2);x.scale(1,Math.max(.02,sc*(1-q)));x.fillStyle=i>3?rgb(A):`rgba(237,239,245,${.5+.5*sc})`;x.fillText(s[i],0,0);x.restore()}
    }
  },
});
