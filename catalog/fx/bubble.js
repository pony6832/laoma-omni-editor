// 移植自圖鑑 bubble（泡泡圖，數據圖表）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：["IG", "FB", "LINE"]。原版的 t%T 循環與數字未改動。
fxDefine("bubble", {
  dur: 4.0,
  defaults: { T: ["IG", "FB", "LINE"], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, cl, eOB } = K;
    const { A, B, FG } = K;
    const clear = (x, w, h) => K.clear(x, w, h);
    {
clear(x,w,h);const D=[[.27,.55,.24,'YouTube'],[.56,.4,.17,'IG'],[.76,.64,.13,'TikTok'],[.47,.77,.09,'FB'],[.84,.28,.08,'X'],[.13,.24,.07,'LINE']],tt=t%4;
  D.forEach(([px,py,r,l],i)=>{const p=eOB(cl((tt-i*.15)/.6)),R=Math.max(0,r*h*p*(1+.03*Math.sin(t*2+i))),Yp=py*h+Math.sin(t+i)*4;x.fillStyle=i%2?rgb(B,.55):rgb(A,.8);x.beginPath();x.arc(px*w,Yp,R,0,7);x.fill();
    if(p>.8){x.fillStyle=FG;x.font=`700 ${Math.max(9,R*.32)}px Unbounded,sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillText(l,px*w,Yp)}})
    }
  },
});
