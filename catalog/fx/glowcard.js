// 移植自圖鑑 glowcard（發光卡片倒影，版面介面）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：["功能詳情", "重點一眼看懂"]。原版的 t%T 循環與數字未改動。
fxDefine("glowcard", {
  dur: 6.0,
  defaults: { T: ["功能詳情", "重點一眼看懂"], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, cl, eOB, eIO, rr } = K;
    const { A } = K;
    const clear = (x, w, h) => K.clear(x, w, h);
    {
clear(x,w,h);const tt=t%6,m=Math.min(w,h),cw=Math.min(w*.82,m*1.5),chF=Math.min(h*.2,cw*.42),cx=w/2,cyTop=h*.38;
  const pw=eOB(cl((tt-.2)/.7)),ph=eOB(cl((tt-.7)/.8)),ct=cl((tt-1.5)/.5),out=1-eIO(cl((tt-5.1)/.7)),fl=Math.sin(tt*2.2)*h*.006;
  const bw=cw*cl(pw),bh=Math.max(chF*.07,chF*cl(ph))*out+0.01,top=cyTop+fl+(chF-bh)/2;
  const draw=(ref)=>{const g=x.createLinearGradient(cx-bw/2,0,cx+bw/2,0);g.addColorStop(0,'#FF5E7A');g.addColorStop(.55,'#FF7A55');g.addColorStop(1,'#FFA84C');
    x.fillStyle=g;rr(x,cx-bw/2,top,bw,bh,Math.min(bh/2,chF*.28));
    if(bh>chF*.4){x.save();x.globalAlpha=ct*out;const ic=bh*.15,ix=cx-bw/2+chF*.34,iy=top+bh/2;x.strokeStyle='#fff';x.lineWidth=ic*.34;x.lineCap='round';
      for(let k=0;k<3;k++){const an=k*Math.PI/3;x.beginPath();x.moveTo(ix-Math.cos(an)*ic,iy-Math.sin(an)*ic);x.lineTo(ix+Math.cos(an)*ic,iy+Math.sin(an)*ic);x.stroke()}
      x.fillStyle='#fff';x.textAlign='left';x.textBaseline='middle';x.font=`700 ${bh*.25}px "Noto Sans TC",sans-serif`;x.fillText('功能詳情',ix+ic*2,top+bh*.4);
      x.fillStyle='rgba(255,255,255,.75)';x.font=`400 ${bh*.15}px "Noto Sans TC",sans-serif`;x.fillText('重點一眼看懂',ix+ic*2,top+bh*.66);x.restore()}
    if(!ref&&bh>chF*.3){x.save();x.globalAlpha=.55*out;x.strokeStyle='rgba(255,255,255,.7)';x.lineWidth=1.4;x.beginPath();
      x.roundRect?x.roundRect(cx-bw/2+.7,top+.7,bw-1.4,bh-1.4,Math.min(bh/2,chF*.28)):x.rect(cx-bw/2,top,bw,bh);x.stroke();x.restore()}};
  x.save();x.shadowColor=rgb(A,.55*out);x.shadowBlur=h*.05*(.8+.2*Math.sin(tt*3));draw(false);x.restore();
  const base=top+bh;x.save();x.beginPath();x.rect(0,base+h*.012,w,h);x.clip();x.translate(0,(base+h*.012)*2-0);x.scale(1,-1);x.globalAlpha=.5;draw(true);x.restore();
  const fy=base+h*.012,fg=x.createLinearGradient(0,fy,0,fy+chF*.75);fg.addColorStop(0,rgb([18,21,29],.2));fg.addColorStop(1,rgb([18,21,29],1));
  x.fillStyle=fg;x.fillRect(0,fy,w,chF*.8)
    }
  },
});
