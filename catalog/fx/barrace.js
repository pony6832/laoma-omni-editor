// 移植自圖鑑 barrace（長條圖競賽，數據圖表）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：["IG", "FB", "LINE"]。原版的 t%T 循環與數字未改動。
fxDefine("barrace", {
  dur: 8.0,
  defaults: { T: ["IG", "FB", "LINE"], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, eIO, rr } = K;
    const { A, B, Y, FG } = K;
    const clear = (x, w, h) => K.clear(x, w, h);
    {
clear(x,w,h);const L=['YouTube','IG','TikTok','FB','LINE'],V=[[60,30,10,80,50],[70,45,30,78,55],[78,62,55,74,58],[85,75,80,70,60],[90,82,95,66,61]],C=[rgb(A),rgb(B),Y,'#7BD88F','#9AA1B3'];
  const yr=(t*.5)%(V.length-1),a=Math.floor(yr),f=eIO(yr-a),val=L.map((_,i)=>V[a][i]+(V[a+1][i]-V[a][i])*f),rk=y=>{const s=L.map((_,i)=>i).sort((p,q)=>V[y][q]-V[y][p]),r=[];s.forEach((i,k)=>r[i]=k);return r},r0=rk(a),r1=rk(a+1),bh=h*.12;
  L.forEach((l,i)=>{const r=r0[i]+(r1[i]-r0[i])*f,Yp=h*.14+r*bh*1.3,bw=w*.62*val[i]/100;x.fillStyle=C[i];rr(x,w*.2,Yp,bw,bh,4);x.fillStyle=FG;x.font=`600 ${bh*.45}px Unbounded,sans-serif`;x.textAlign='right';x.textBaseline='middle';x.fillText(l,w*.18,Yp+bh/2);x.textAlign='left';x.fillText(Math.round(val[i]),w*.2+bw+6,Yp+bh/2)});
  x.fillStyle='rgba(237,239,245,.25)';x.font=`700 ${h*.2}px Unbounded,sans-serif`;x.textAlign='right';x.textBaseline='alphabetic';x.fillText(String(2022+Math.round(yr)),w*.95,h*.95)
    }
  },
});
