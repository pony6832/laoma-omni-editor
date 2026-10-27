// 移植自圖鑑 textpath（曲線流動文字，文字標題）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：["沿著曲線流動的文字 · FLOW ALONG THE PATH · "]。原版的 t%T 循環與數字未改動。
fxDefine("textpath", {
  dur: 4.0,
  defaults: { T: ["沿著曲線流動的文字 · FLOW ALONG THE PATH · "], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, mix } = K;
    const { B } = K;
    const clear = (x, w, h) => K.clear(x, w, h);
    {
clear(x,w,h);const s='沿著曲線流動的文字 · FLOW ALONG THE PATH · ',fs=h*.075;x.font=`700 ${fs}px "Noto Sans TC",Unbounded,sans-serif`;x.textAlign='center';x.textBaseline='middle';const Yf=X=>h/2+Math.sin(X*.012+t*1.2)*h*.2;
  x.strokeStyle=rgb(B,.35);x.lineWidth=1;x.beginPath();for(let X=0;X<=w;X+=5)X?x.lineTo(X,Yf(X)):x.moveTo(X,Yf(X));x.stroke();let X=(-(t*50)%(fs*12));for(let i=0;X<w+fs;i++){const ch=s[i%s.length],cw=x.measureText(ch).width,m=X+cw/2,a=Math.atan2(Yf(m+1)-Yf(m-1),2);
    x.save();x.translate(m,Yf(m)-fs*.4);x.rotate(a);x.fillStyle=mix((m/w+1)%1);x.fillText(ch,0,0);x.restore();X+=cw}
    }
  },
});
