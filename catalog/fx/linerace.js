// 移植自圖鑑 linerace（折線競賽，數據圖表）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：["A 品牌", "B 品牌", "C 品牌"]。原版的 t%T 循環與數字未改動。
fxDefine("linerace", {
  dur: 5.0,
  defaults: { T: ["A 品牌", "B 品牌", "C 品牌"], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, cl, eIO } = K;
    const { A, B, M } = K;
    const clear = (x, w, h) => K.clear(x, w, h);
    {
clear(x,w,h);const S=[[A,s=>.3+.5*s+.08*Math.sin(s*9)],[B,s=>.25+.35*s+.1*Math.sin(s*6+1)],[[255,200,87],s=>.2+.6*s*s+.05*Math.sin(s*12)]],L=['A 品牌','B 品牌','C 品牌'],p=eIO(cl(((t%5))/3.6)),x0=w*.1,x1=w*.78;x.strokeStyle=M;x.lineWidth=1;
  for(let k=0;k<4;k++){const Yp=h*.85-k*h*.22;x.beginPath();x.moveTo(x0,Yp);x.lineTo(x1,Yp);x.stroke()}S.forEach(([c,f],i)=>{x.strokeStyle=rgb(c);x.lineWidth=3;x.beginPath();for(let s=0;s<=p;s+=.01){const X=x0+(x1-x0)*s,Yp=h*.85-f(s)*h*.7;s?x.lineTo(X,Yp):x.moveTo(X,Yp)}x.stroke();
    const X=x0+(x1-x0)*p,Yp=h*.85-f(p)*h*.7;x.fillStyle=rgb(c);x.beginPath();x.arc(X,Yp,5,0,7);x.fill();x.font=`700 ${h*.06}px "Noto Sans TC"`;x.textAlign='left';x.textBaseline='middle';x.fillText(L[i]+' '+Math.round(f(p)*100),X+10,Yp)})
    }
  },
});
