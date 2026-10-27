// 移植自圖鑑 pillchain（膠囊串連，版面介面）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：["先想", "再做", "上線"]。原版的 t%T 循環與數字未改動。
fxDefine("pillchain", {
  dur: 7.5,
  defaults: { T: ["先想", "再做", "上線"], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, cl, eOB, rr } = K;
    const { A } = K;
    {
const tt=t%7.5,m=Math.min(w,h),CR='#F6EFE6',INK='#1C1814',out=1-cl((tt-6.7)/.6);
  x.fillStyle=CR;x.fillRect(0,0,w,h);const gl=x.createRadialGradient(w/2,h*.95,0,w/2,h*.95,h*.55);gl.addColorStop(0,'rgba(255,196,150,.55)');gl.addColorStop(1,'rgba(255,196,150,0)');x.fillStyle=gl;x.fillRect(0,0,w,h);
  const N=[['先想',.32,.3],['再做',.68,.5],['上線',.36,.7]],fs=Math.min(h*.03,w*.062),ph=fs*2.5;x.font=`700 ${fs}px "Noto Sans TC",sans-serif`;
  const P=N.map((n,i)=>({s:n[0],x:w*n[1],y:h*n[2]+Math.sin(tt*1.6+i*2)*h*.004,w:x.measureText(n[0]).width+fs*3.1,p:eOB(cl((tt-.3-i*1.5)/.55))*out}));
  x.globalAlpha=out;
  for(let i=0;i<2;i++){const a=P[i],b=P[i+1],dr=cl((tt-.8-i*1.5)/.8),sw=Math.sin(tt*1.4+i)*w*.02,
    X0=a.x,Y0=a.y+ph/2,X1=b.x,Y1=b.y-ph/2,c1x=X0+sw,c1y=Y0+(Y1-Y0)*.7,c2x=X1-sw,c2y=Y1-(Y1-Y0)*.7,bz=u=>{const v=1-u;return[v*v*v*X0+3*v*v*u*c1x+3*v*u*u*c2x+u*u*u*X1,v*v*v*Y0+3*v*v*u*c1y+3*v*u*u*c2y+u*u*u*Y1]};
    if(dr<=0)continue;x.strokeStyle=INK;x.lineWidth=2;x.lineCap='round';x.beginPath();for(let u=0;u<=dr+1e-6;u+=.02){const q=bz(Math.min(u,dr));u?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1])}x.stroke();
    if(dr<1){const q=bz(dr);x.fillStyle=rgb(A);x.beginPath();x.arc(q[0],q[1],4.5,0,7);x.fill()}}
  P.forEach((q,i)=>{if(q.p<=0)return;const last=i===2;x.save();x.translate(q.x,q.y);x.scale(q.p,q.p);x.fillStyle=last?rgb(A):INK;rr(x,-q.w/2,-ph/2,q.w,ph,ph/2);
    x.fillStyle=last?'#fff':rgb(A);x.beginPath();x.arc(-q.w/2+ph*.5,0,ph*.15,0,7);x.fill();
    x.fillStyle=last?'#fff':CR;x.font=`700 ${fs}px "Noto Sans TC",sans-serif`;x.textAlign='left';x.textBaseline='middle';x.fillText(q.s,-q.w/2+ph*.85,1);x.restore()});
  x.globalAlpha=1
    }
  },
});
