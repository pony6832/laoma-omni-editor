// 移植自圖鑑 dockmagnify（Dock 放大展開，介面微動態）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("dockmagnify", {
  dur: 6.0,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { cl, eOB, eIO, rr, uiBg, uiCard, uiText, UI_G } = K;
    {
uiBg(x,w,h);const tt=t%6,n=7,s0=h*.1,gap=s0*.28,mx=w*(.5+.27*Math.sin(t*.9)),C=['#FF6A4D','#2A2F3B','#FFC857','#3B6BFF','#2DBE60','#8B5CF6','#E1306C'],base=[];let acc=0;for(let i=0;i<n;i++){base.push(acc+s0/2);acc+=s0+gap}
  const tot0=acc-gap,bx0=w/2-tot0/2,sizes=base.map(b=>s0*(1+.85*Math.exp(-Math.pow((bx0+b-mx)/(w*.08),2)))),tot=sizes.reduce((a,b)=>a+b+gap,-gap),by=h*.9;let X=w/2-tot/2;
  x.save();x.shadowColor='rgba(40,50,90,.2)';x.shadowBlur=18;x.fillStyle='rgba(255,255,255,.78)';rr(x,w/2-tot/2-10,by-s0*1.9-6,tot+20,s0*1.9+16,14);x.restore();
  sizes.forEach((sz,i)=>{const bn=(i===3&&tt>2.2&&tt<3.2)?-Math.abs(Math.sin((tt-2.2)*Math.PI*2))*s0*.6:0;x.fillStyle=C[i];rr(x,X,by-sz+bn,sz,sz,sz*.25);x.fillStyle='rgba(255,255,255,.85)';x.beginPath();x.arc(X+sz/2,by-sz/2+bn,sz*.18,0,7);x.fill();X+=sz+gap});
  const wp=Math.max(0,eOB(cl((tt-3.2)/.5))-eIO(cl((tt-5.3)/.5)));if(wp>.02){const ww=w*.4,wh=h*.42,wx=w/2,wy=h*.12;x.save();x.translate(wx,h*.82);x.scale(wp,wp);x.translate(-wx,-h*.82);uiCard(x,wx-ww/2,wy,ww,wh,12);uiText(x,'Campaign report',wx-ww*.44,wy+wh*.14,wh*.08,'#5B6274',700,'left');uiText(x,'+37%',wx-ww*.44,wy+wh*.42,wh*.22,UI_G,800,'left');x.restore()}
    }
  },
});
