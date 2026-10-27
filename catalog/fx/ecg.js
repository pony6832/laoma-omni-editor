// 移植自圖鑑 ecg（心電圖，數據圖表）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：["72 BPM"]。原版的 t%T 循環與數字未改動。
fxDefine("ecg", {
  dur: 3.3,
  defaults: { T: ["72 BPM"], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb } = K;
    const { A, FG } = K;
    const clear = (x, w, h) => K.clear(x, w, h);
    {
clear(x,w,h);x.strokeStyle='rgba(111,139,255,.12)';x.lineWidth=1;x.beginPath();for(let X=0;X<w;X+=20){x.moveTo(X,0);x.lineTo(X,h)}for(let Yp=0;Yp<h;Yp+=20){x.moveTo(0,Yp);x.lineTo(w,Yp)}x.stroke();
  const f=u=>{const q=((u%1)+1)%1;return q<.1?Math.sin(q/.1*Math.PI)*.08:q<.14?-(q-.1)/.04*.15:q<.18?-.15+(q-.14)/.04*1.15:q<.22?1-(q-.18)/.04*1.3:q<.26?-.3+(q-.22)/.04*.3:q<.4?0:q<.5?Math.sin((q-.4)/.1*Math.PI)*.18:0},head=(t*.3%1)*w;
  x.strokeStyle=rgb(A);x.lineWidth=2.5;x.shadowColor=rgb(A);x.shadowBlur=10;x.beginPath();for(let X=0;X<=head;X+=2){const Yp=h*.55-f(X/w*3-t*0)*h*.35;X?x.lineTo(X,Yp):x.moveTo(X,Yp)}x.stroke();x.shadowBlur=0;
  x.fillStyle=FG;x.beginPath();x.arc(head,h*.55-f(head/w*3)*h*.35,4,0,7);x.fill();x.font=`700 ${h*.1}px Unbounded,sans-serif`;x.textAlign='right';x.textBaseline='top';x.fillText('72 BPM',w*.95,h*.06)
    }
  },
});
