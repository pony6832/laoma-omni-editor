// 移植自圖鑑 tabspanels（分頁切換面板，介面微動態）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("tabspanels", {
  dur: 5.4,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { cl, eIO, rr, uiBg, uiCard, uiText, UI_INK } = K;
    {
uiBg(x,w,h);const T=1.8,k=Math.floor(t/T),i0=k%3,i1=(k+1)%3,p=eIO(cl((t%T-1.1)/.5)),cw=w*.64,ch=h*.84,X=w/2-cw/2,Yp=h*.08;uiCard(x,X,Yp,cw,ch,14);const tabs=['Reels','Posts','Email'],tw=cw*.26,tx=X+cw*.05,ty=Yp+ch*.07,th=ch*.1,ai=i0+(i1-i0)*p;
  x.fillStyle='#F0F2F8';rr(x,tx,ty,tw*3+8,th,th/2);x.fillStyle='#161922';rr(x,tx+tw*ai+2,ty+2,tw,th-4,(th-4)/2);tabs.forEach((s,i)=>uiText(x,s,tx+tw*i+tw/2+2,ty+th/2,th*.38,Math.abs(i-ai)<.5?'#fff':'#5B6274',700));
  const N=[['Launch teaser','Spring kit','Welcome mail'],['Studio tour','Studio shoot','Weekly digest'],['Tool tip','Behind scenes','Promo blast']],V=['21k','14k','9.6k'],CL=['#9DD7FF','#FF9D88','#161922'];
  [[i0,1-p,-1],[i1,p,1]].forEach(([ti,al,sg])=>{if(al<=.01)return;x.save();x.globalAlpha=al;x.translate(sg*(1-al)*cw*.08,0);for(let r=0;r<3;r++){const ry=Yp+ch*(.28+r*.22);x.fillStyle=CL[r];rr(x,X+cw*.07,ry,ch*.14,ch*.14,6);uiText(x,N[r][ti],X+cw*.07+ch*.2,ry+ch*.04,ch*.055,UI_INK,700,'left');uiText(x,V[r],X+cw*.93,ry+ch*.07,ch*.055,'#8A91A4',700,'right')}x.restore()})
    }
  },
});
