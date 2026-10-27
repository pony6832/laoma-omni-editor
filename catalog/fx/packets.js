// 移植自圖鑑 packets（資料封包流動，數據圖表）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("packets", {
  dur: 4.0,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, rr } = K;
    const { A, B, M } = K;
    const clear = (x, w, h) => K.clear(x, w, h);
    {
clear(x,w,h);const N=[[.12,.3],[.12,.7],[.5,.5],[.88,.25],[.88,.5],[.88,.75]],E=[[0,2],[1,2],[2,3],[2,4],[2,5]],bz=(u,a,m1,m2,b)=>(1-u)**3*a+3*(1-u)**2*u*m1+3*(1-u)*u*u*m2+u**3*b;x.lineWidth=2;
  E.forEach(([a,b],k)=>{const P=N[a],Q=N[b],mx=(P[0]+Q[0])/2;x.strokeStyle=M;x.beginPath();x.moveTo(P[0]*w,P[1]*h);x.bezierCurveTo(mx*w,P[1]*h,mx*w,Q[1]*h,Q[0]*w,Q[1]*h);x.stroke();
    for(let q=0;q<3;q++){const u=(t*.5+q/3+k*.17)%1;x.fillStyle=k<2?rgb(B):rgb(A);x.fillRect(bz(u,P[0],mx,mx,Q[0])*w-5,bz(u,P[1],P[1],Q[1],Q[1])*h-3,10,6)}});
  N.forEach(([px,py],i)=>{x.fillStyle=i==2?rgb(A):'#2A3040';rr(x,px*w-h*.06,py*h-h*.06,h*.12,h*.12,6)})
    }
  },
});
