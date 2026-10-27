// 移植自圖鑑 wordcollapse（關鍵詞收束，文字標題）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：["創新", "品質", "服務", "BRAND"]。原版的 t%T 循環與數字未改動。
fxDefine("wordcollapse", {
  dur: 4.6,
  defaults: { T: ["創新", "品質", "服務", "BRAND"], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, cl, eOC, eOB, eIO } = K;
    const { A, FG } = K;
    const clear = (x, w, h) => K.clear(x, w, h);
    {
clear(x,w,h);const W=['創新','品質','服務'],tt=t%4.6,out=cl((tt-3.4)/.4),fs=Math.min(h*.18,w*.1);x.font=`900 ${fs}px "Noto Sans TC"`;x.textAlign='center';x.textBaseline='middle';
  W.forEach((s,i)=>{const p=cl((tt-.3-i*.6)/.3),e=eOB(p),X=w/2+(i-1)*w*.28;x.save();x.globalAlpha=p;x.translate(X+(w/2-X)*eIO(out),h*.42+(1-e)*20);x.scale(1-out*.85,1-out*.85);x.fillStyle=i==1?rgb(A):FG;x.fillText(s,0,0);x.restore()});
  const lw=w*.7*eOC(cl((tt-1.9)/.5))*(1-out);x.fillStyle=rgb(A);x.fillRect(w/2-lw/2,h*.58,lw,3);const q=cl((tt-3.7)/.4);if(q>0){x.globalAlpha=q;x.fillStyle=FG;x.font=`700 ${fs*.6}px Unbounded,sans-serif`;x.fillText('BRAND',w/2,h*.45);x.globalAlpha=1}
    }
  },
});
