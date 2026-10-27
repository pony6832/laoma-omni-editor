// 移植自圖鑑 metaball3d（立體液滴融合，介面微動態）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("metaball3d", {
  dur: 6.0,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { uiBg } = K;
    {
uiBg(x,w,h);const P=[0,1,2].map(i=>{const a=t*(.9+.3*i)+i*2.1;return[w/2+Math.cos(a)*w*.13*(i?1:.2),h*.48+Math.sin(a*1.2)*h*.1*(i?1:.2),h*(i?.1+.015*i:.17)]});
  x.fillStyle='rgba(40,50,90,.12)';x.beginPath();x.ellipse(w/2,h*.86,w*.22,h*.04,0,0,7);x.fill();const col='#8B5CF6';x.fillStyle=col;P.forEach(p=>{x.beginPath();x.arc(p[0],p[1],p[2],0,7);x.fill()});
  for(let i=0;i<3;i++)for(let j=i+1;j<3;j++){const a=P[i],b=P[j],dd=Math.hypot(a[0]-b[0],a[1]-b[1]),th=(a[2]+b[2])*1.6;if(dd<th){const q=1-dd/th;x.strokeStyle=col;x.lineCap='round';x.lineWidth=Math.min(a[2],b[2])*1.6*q;x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.stroke()}}x.lineCap='butt';
  P.forEach(p=>{const g=x.createRadialGradient(p[0]-p[2]*.35,p[1]-p[2]*.4,p[2]*.05,p[0],p[1],p[2]);g.addColorStop(0,'rgba(255,255,255,.75)');g.addColorStop(.35,'rgba(200,170,255,.25)');g.addColorStop(1,'rgba(60,20,140,.45)');x.fillStyle=g;x.beginPath();x.arc(p[0],p[1],p[2],0,7);x.fill()})
    }
  },
});
