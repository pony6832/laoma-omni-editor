// 移植自圖鑑 arcs（地圖連線，數據圖表）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("arcs", {
  dur: 6.0,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, mix, cl, eOC, rnd } = K;
    const { A, FG, M } = K;
    const clear = (x, w, h) => K.clear(x, w, h);
    {
clear(x,w,h);const gs=Math.max(9,w/42);x.fillStyle=M;
  for(let X=gs/2;X<w;X+=gs)for(let Yp=gs/2;Yp<h;Yp+=gs){if(Math.sin(X*.013)*Math.cos(Yp*.02)+Math.sin(X*.004+Yp*.006)>.15)x.fillRect(X-1,Yp-1,2.2,2.2)}
  const N=[...Array(9)].map((_,i)=>[w*(.1+.8*rnd(i*3+1)),h*(.2+.6*rnd(i*3+2))]),E=.55,cur=Math.floor(t/E);x.lineWidth=2;
  for(let k=cur-5;k<=cur;k++){const a=N[Math.floor(rnd(k*1.7+.3)*9)],b=N[Math.floor(rnd(k*2.9+4)*9)];if(a===b)continue;const age=(t-k*E)/2.2;if(age<0||age>1)continue;
    const mx=(a[0]+b[0])/2,my=Math.min(a[1],b[1])-Math.hypot(b[0]-a[0],b[1]-a[1])*.4,p=eOC(cl(age/.6)),fd=1-cl((age-.6)/.4);
    x.strokeStyle=mix(rnd(k+.7),.9*fd);x.beginPath();for(let s=0;s<=24;s++){const u=s/24*p;x[s?'lineTo':'moveTo']((1-u)*(1-u)*a[0]+2*(1-u)*u*mx+u*u*b[0],(1-u)*(1-u)*a[1]+2*(1-u)*u*my+u*u*b[1])}x.stroke();
    if(p>=.99){x.strokeStyle=rgb(A,fd);x.beginPath();x.arc(b[0],b[1],4+(1-fd)*14,0,7);x.stroke()}}
  N.forEach(([a,b])=>{x.fillStyle=FG;x.beginPath();x.arc(a,b,3,0,7);x.fill()})
    }
  },
});
