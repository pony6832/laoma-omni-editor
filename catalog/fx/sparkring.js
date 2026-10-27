// 移植自圖鑑 sparkring（火花漣漪，背景氛圍）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：["先有一點火花"]。原版的 t%T 循環與數字未改動。
fxDefine("sparkring", {
  dur: 6.0,
  defaults: { T: ["先有一點火花"], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, mix, cl, eOC, eOB, rnd } = K;
    const { A, FG } = K;
    const clear = (x, w, h) => K.clear(x, w, h);
    {
clear(x,w,h);const tt=t%6,cx=w/2,cy=h*.44,m=Math.min(w,h),R=m*.045,
  ig=eOB(cl((tt-.25)/.9)),a=1-cl((tt-5.3)/.6),gy=cy+R*2.6;
  const pool=x.createRadialGradient(0,0,0,0,0,m*.55);pool.addColorStop(0,rgb(A,.28*ig*a));pool.addColorStop(1,rgb(A,0));
  x.save();x.translate(cx,gy);x.scale(1,.26);x.fillStyle=pool;x.beginPath();x.arc(0,0,m*.55,0,7);x.fill();x.restore();
  for(let i=0;i<6;i++){const p=(tt-1.1-i*.55)/3.4;if(p<=0||p>=1)continue;const rx=m*(.07+.46*eOC(p)),al=(1-p)*(1-p)*a;
    x.strokeStyle=mix(.35+.6*(1-p),al*.95);x.lineWidth=.8+2.2*(1-p);x.beginPath();x.ellipse(cx,gy,rx,rx*.26,0,0,7);x.stroke()}
  for(let k=0;k<12;k++){const u=(tt*.45+k/12)%1,sx=cx+(rnd(k*3.7)-.5)*R*7*u,sy=cy-R*.6-u*h*.13;
    x.fillStyle=`rgba(255,226,190,${(1-u)*ig*a*.9})`;x.beginPath();x.arc(sx,sy,1.2+rnd(k)*1.8,0,7);x.fill()}
  const r=R*ig*(1+.06*Math.sin(tt*6)),g=x.createRadialGradient(cx,cy,0,cx,cy,Math.max(1,r*5));
  g.addColorStop(0,`rgba(255,220,180,${.95*ig*a})`);g.addColorStop(.3,rgb(A,.38*ig*a));g.addColorStop(1,rgb(A,0));
  x.fillStyle=g;x.fillRect(0,0,w,h);x.fillStyle=`rgba(255,246,230,${ig*a})`;x.beginPath();x.arc(cx,cy,Math.max(.1,r*.55),0,7);x.fill();
  const tx=cl((tt-1.2)/.5)*(1-cl((tt-5.2)/.5));x.globalAlpha=tx;x.fillStyle=FG;x.font=`500 ${m*.042}px "Noto Sans TC",sans-serif`;
  x.textAlign='center';x.textBaseline='middle';x.fillText('先有一點火花',cx,h*.7);x.globalAlpha=1
    }
  },
});
