// 移植自圖鑑 typewriter（打字機，文字標題）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：["產生網格動畫…", "完成，共 120 幀"]。原版的 t%T 循環與數字未改動。
fxDefine("typewriter", {
  dur: 6.5,
  defaults: { T: ["產生網格動畫…", "完成，共 120 幀"], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, cl } = K;
    const { A, FG } = K;
    const clear = (x, w, h) => K.clear(x, w, h);
    {
clear(x,w,h);const L=[['> ','產生網格動畫…'],['> ','grid.wave(20, 12)'],['> ','export("reel.mp4")'],['✓ ','完成，共 120 幀']];
  const tot=L.reduce((s,l)=>s+l[1].length,0),T=6.5,tt=t%T;let n=Math.floor(cl(tt/4.2)*tot);
  const fs=Math.max(11,h*.075);x.font=`400 ${fs}px "JetBrains Mono","Noto Sans TC",monospace`;x.textBaseline='top';x.textAlign='left';
  let cx=0,cy=0;for(let i=0;i<L.length;i++){const l=L[i];if(i>0&&n<=0)break;const s=l[1].slice(0,Math.max(0,n));n-=l[1].length;const Yp=h*.2+i*fs*1.7;
    x.fillStyle=i===3?'#7BD88F':rgb(A);x.fillText(l[0],w*.08,Yp);
    const pw=x.measureText(l[0]).width;x.fillStyle=FG;x.fillText(s,w*.08+pw,Yp);cx=w*.08+pw+x.measureText(s).width;cy=Yp}
  if(Math.floor(t*2)%2===0){x.fillStyle=FG;x.fillRect(cx+2,cy,fs*.55,fs*1.1)}
    }
  },
});
