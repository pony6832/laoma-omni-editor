// 移植自圖鑑 product360（產品 360 旋轉，介面微動態）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：["主動降噪", "40 小時續航", "空間音訊"]。原版的 t%T 循環與數字未改動。
fxDefine("product360", {
  dur: 6.0,
  defaults: { T: ["主動降噪", "40 小時續航", "空間音訊"], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { cl, eOC, rr, uiBg, uiCard, uiText, UI_INK, UI_B, UI_G } = K;
    {
uiBg(x,w,h);const tt=t%6,cx=w*.35,cy=h*.5,R=h*.26,a=t*1.1,c=Math.cos(a),s=Math.sin(a);x.fillStyle='rgba(40,50,90,.12)';x.beginPath();x.ellipse(cx,cy+R*1.15,R*(.6+.3*Math.abs(c)),R*.12,0,0,7);x.fill();
  x.strokeStyle=UI_B;x.lineWidth=R*.14;x.lineCap='round';x.beginPath();x.ellipse(cx,cy-R*.1,Math.max(.5,R*Math.abs(c)*.95),R*.9,0,Math.PI,Math.PI*2);x.stroke();x.lineCap='butt';
  const cup=(X,fr)=>{const wd=R*(.2+.32*Math.abs(s)),hh=R*.72;x.fillStyle=fr?'#2F5BFF':'#7E9BFF';rr(x,X-wd/2,cy-hh*.1,wd,hh,wd*.5);x.fillStyle='rgba(255,255,255,.25)';rr(x,X-wd*.3,cy+hh*.05,wd*.35,hh*.5,wd*.15)},X1=cx-R*c*.95,X2=cx+R*c*.95;if(s>0){cup(X1,false);cup(X2,true)}else{cup(X2,false);cup(X1,true)}
  ['主動降噪','40 小時續航','空間音訊'].forEach((s_,i)=>{const p=eOC(cl((tt-1-i*.7)/.5));if(p<=0)return;const X=w*.62+(1-p)*20,Yp=h*.32+i*h*.17;x.globalAlpha=p;uiCard(x,X,Yp-h*.06,w*.32,h*.12,10);x.fillStyle=UI_G;x.beginPath();x.arc(X+w*.03,Yp,h*.03,0,7);x.fill();uiText(x,'✓',X+w*.03,Yp,h*.035,'#fff',800);uiText(x,s_,X+w*.065,Yp,h*.045,UI_INK,700,'left');x.globalAlpha=1});
  uiText(x,'$129',cx,h*.9,h*.07,UI_INK,800)
    }
  },
});
