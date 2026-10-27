// 移植自圖鑑 glasstilt（玻璃卡傾斜，介面微動態）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("glasstilt", {
  dur: 7.0,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, rr, uiText } = K;
    const { A, B } = K;
    {
const g=x.createLinearGradient(0,0,w,h);g.addColorStop(0,'#1B2160');g.addColorStop(1,'#3A1E6B');x.fillStyle=g;x.fillRect(0,0,w,h);[[rgb(A,.6),.25,.3],[rgb(B,.6),.78,.72]].forEach(([c,px,py])=>{const rg=x.createRadialGradient(w*px,h*py,0,w*px,h*py,h*.55);rg.addColorStop(0,c);rg.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=rg;x.fillRect(0,0,w,h)});
  const a=.45*Math.sin(t*.9),cw=w*.46,ch=cw*.62;x.save();x.translate(w/2,h/2);x.transform(Math.cos(a*.6),Math.sin(a)*.12,0,1,0,0);x.save();x.shadowColor='rgba(0,0,0,.4)';x.shadowBlur=24;x.shadowOffsetY=14;x.fillStyle='rgba(255,255,255,.14)';rr(x,-cw/2,-ch/2,cw,ch,16);x.restore();
  x.strokeStyle='rgba(255,255,255,.45)';x.lineWidth=1.2;x.beginPath();x.roundRect?x.roundRect(-cw/2,-ch/2,cw,ch,16):x.rect(-cw/2,-ch/2,cw,ch);x.stroke();x.save();x.beginPath();x.roundRect?x.roundRect(-cw/2,-ch/2,cw,ch,16):x.rect(-cw/2,-ch/2,cw,ch);x.clip();
  const gx=-cw/2+cw*(.5+a*1.2),gl=x.createLinearGradient(gx,-ch/2,gx+cw*.35,ch/2);gl.addColorStop(0,'rgba(255,255,255,0)');gl.addColorStop(.5,'rgba(255,255,255,.35)');gl.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gl;x.fillRect(-cw/2,-ch/2,cw,ch);x.restore();
  x.fillStyle='rgba(255,236,190,.9)';rr(x,-cw*.4,-ch*.3,cw*.16,ch*.2,4);uiText(x,'4242  4242  4242  4242',-cw*.4,ch*.2,ch*.09,'#fff',600,'left');uiText(x,'Alex Chen',-cw*.4,ch*.36,ch*.07,'rgba(255,255,255,.75)',500,'left');x.restore()
    }
  },
});
