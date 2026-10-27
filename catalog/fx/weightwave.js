// 移植自圖鑑 weightwave（字重波浪，文字標題）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：["字重波浪WAVE"]。原版的 t%T 循環與數字未改動。
fxDefine("weightwave", {
  dur: 4.0,
  defaults: { T: ["字重波浪WAVE"], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { mix } = K;
    const clear = (x, w, h) => K.clear(x, w, h);
    {
clear(x,w,h);const s='字重波浪WAVE',n=s.length,fs=Math.min(h*.2,w*.11),Wt=[300,400,500,700,900];x.textBaseline='middle';x.textAlign='center';let tw=0;const ws=[];
  for(let i=0;i<n;i++){const k=.5+.5*Math.sin(t*3-i*.55),wt=Wt[Math.round(k*4)];x.font=`${wt} ${fs}px "Noto Sans TC",Unbounded,sans-serif`;const cw=x.measureText(s[i]).width*(.85+.3*k);ws.push([wt,cw,k]);tw+=cw}
  let X=(w-tw)/2;ws.forEach(([wt,cw,k],i)=>{x.font=`${wt} ${fs}px "Noto Sans TC",Unbounded,sans-serif`;x.save();x.translate(X+cw/2,h/2);x.scale(.85+.3*k,1);x.fillStyle=mix(k);x.fillText(s[i],0,0);x.restore();X+=cw})
    }
  },
});
