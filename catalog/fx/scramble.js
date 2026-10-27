// 移植自圖鑑 scramble（亂碼解碼，文字標題）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：["MOTION 2026", "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&*@$"]。原版的 t%T 循環與數字未改動。
fxDefine("scramble", {
  dur: 3.0,
  defaults: { T: ["MOTION 2026", "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&*@$"], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, cl, rnd } = K;
    const { A, FG, M } = K;
    const clear = (x, w, h) => K.clear(x, w, h);
    {
clear(x,w,h);const T=5,tt=t%T,S='MOTION 2026',G='ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&*@$',fs=Math.min(h*.2,w/S.length*1.45);
  x.font=`600 ${fs}px "JetBrains Mono",monospace`;x.textBaseline='middle';x.textAlign='left';const cw=x.measureText('M').width,X0=(w-cw*S.length)/2,out=cl((tt-4.3)/.5);
  x.globalAlpha=1-out;for(let i=0;i<S.length;i++){if(S[i]===' '||tt<i*.04)continue;const done=tt>.4+i*.12;
    x.fillStyle=done?FG:rgb(A,.85);x.fillText(done?S[i]:G[Math.floor(rnd(i*31+Math.floor(t*18))*G.length)],X0+i*cw,h/2)}
  x.fillStyle='#9AA1B3';x.font=`400 ${h*.06}px "JetBrains Mono",monospace`;x.fillText(tt>1.8?'decrypted ✓':'decrypting…',X0,h/2+fs*.95);x.globalAlpha=1
    }
  },
});
